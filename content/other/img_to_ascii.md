+++
date = '2025-07-04T15:54:17-04:00'
draft = false
title = 'Img to ASCII'

summary = "Convert images to ASCII art"
description = "Convert images to ASCII art"
readTime = false
autonumber = false
math = false
hideBackToTop = false
tags = [ "image", "ascii", "webcam", "filter"]
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++
<style>
  #output {
    font-family: monospace;
    white-space: pre;
    line-height: 1;
    font-size: 6px;
    padding: 1rem;
    margin-top: 1rem;
    overflow-x: auto;
    overflow-y: auto;
    color: var(--content-primary);
    background: #00000000;
  }
  #webcamVideo {
    display: none !important;
  }
</style>

<input type="file" accept="image/*" id="imageInput" onchange="onImageInputChange()">
<br>
<button id="webcamBtn" onclick="toggleWebcam()">Click to Use Webcam</button>
<br><br>
<label>Factor Size: <select id="factorSelect"></select></label>
<br><br>
<button onclick="processImage()">Render</button>

<video id="webcamVideo" width="320" height="240" autoplay></video>
<canvas id="canvas" style="display: none"></canvas>

<div id="output"></div>

<script>
let webcamRendering = false;
let webcamActive = false;
let webcamStream = null;

const exampleImageUrl = "https://upload.wikimedia.org/wikipedia/commons/0/0b/Pitstone-windmill.600px.jpg";
const exampleFactor = 10;

function gcd(a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function returnFactors(x) {
  const factors = [];
  for (let i = 1; i <= x; i++) {
    if (x % i === 0) factors.push(i);
  }
  return factors;
}

function mean(values) {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function pstdev(values, meanValue) {
  const variance = values.reduce((sum, v) => sum +
        Math.pow(v - meanValue, 2), 0) / values.length;
  return Math.sqrt(variance);
}

function getLuminance(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function logPixel(value, mean, stdev) {
  const z = (value - mean) / stdev;
  if (z >= 1) return '██';
  else if (z >= 0.65) return '▓▓';
  else if (z >= 0) return '▒▒';
  else if (z >= -0.65) return '░░';
  else return '  ';
}

function stopWebcam() {
  const webcamVideo = document.getElementById('webcamVideo');
  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
    webcamStream = null;
  }
  webcamVideo.srcObject = null;
  webcamActive = false;
  webcamRendering = false;
}

function onImageInputChange() {
  stopWebcam();
  setUpFactorSelect();
}

async function setUpFactorSelect() {
  const fileInput = document.getElementById('imageInput');
  if (!fileInput.files.length) return;

  const img = new Image();
  const file = fileInput.files[0];
  const url = URL.createObjectURL(file);

  img.onload = () => {
    const width = img.width;
    const height = img.height;
    const commonDivisor = gcd(width, height);
    const factors = returnFactors(commonDivisor);
    const factorSelect = document.getElementById('factorSelect');

    factorSelect.innerHTML = '';
    factors.forEach(factor => {
      const option = document.createElement('option');
      option.value = factor;
      option.textContent = factor;
      factorSelect.appendChild(option);
    });

    URL.revokeObjectURL(url);
  };

  img.src = url;
}

async function processImage() {
  const fileInput = document.getElementById('imageInput');
  const factorInput = parseInt(factorSelect.value);
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const output = document.getElementById('output');
  const webcamVideo = document.getElementById('webcamVideo');

  if (webcamActive && webcamVideo.srcObject) {
    const width = webcamVideo.videoWidth;
    const height = webcamVideo.videoHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(webcamVideo, 0, 0, width, height);
    processCanvasToAscii(width, height, ctx, factorInput, output);
    return;
  }

  if (!fileInput.files.length) {
    alert("Please upload an image or use the webcam.");
    return;
  }

  const img = new Image();
  const file = fileInput.files[0];
  const url = URL.createObjectURL(file);

  img.onload = () => {
    const width = img.width;
    const height = img.height;

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    processCanvasToAscii(width, height, ctx, factorInput, output);

    URL.revokeObjectURL(url);
  };

  img.src = url;
}

function processCanvasToAscii(width, height, ctx, factorInput, output) {
  const imgData = ctx.getImageData(0, 0, width, height).data;
  const factors = returnFactors(gcd(width, height));
  if (!factors.includes(factorInput)) {
    alert(`Invalid factor. Valid options are: ${factors.join(', ')}`);
    const factorSelect = document.getElementById('factorSelect');
    factorSelect.innerHTML = '';
    factors.forEach(factor => {
      const option = document.createElement('option');
      option.value = factor;
      option.textContent = factor;
      factorSelect.appendChild(option);
    });
    return;
  }

  const popList = [];
  for (let y = 0; y < height; y += factorInput) {
    const index = (y * width + 0) * 4;
    const r = imgData[index];
    const g = imgData[index + 1];
    const b = imgData[index + 2];
    popList.push(getLuminance(r, g, b));
  }

  const popMean = mean(popList);
  const popStdev = pstdev(popList, popMean);

  let asciiImage = '';

  for (let y = 0; y < height; y += factorInput) {
    let line = '';
    for (let x = 0; x < width; x += factorInput) {
      const index = (y * width + x) * 4;
      const r = imgData[index];
      const g = imgData[index + 1];
      const b = imgData[index + 2];
      const lum = getLuminance(r, g, b);
      line += logPixel(lum, popMean, popStdev);
    }
    asciiImage += line + '\n';
  }

  output.textContent = asciiImage;
}

function toggleWebcam() {
  const webcamVideo = document.getElementById('webcamVideo');
  const fileInput = document.getElementById('imageInput');
  if (webcamActive) {
    stopWebcam();
    return;
  }
  stopWebcam();
  fileInput.value = "";
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      webcamStream = stream;
      webcamVideo.srcObject = stream;
      webcamActive = true;
      webcamVideo.onloadedmetadata = () => {
        const width = webcamVideo.videoWidth || 320;
        const height = webcamVideo.videoHeight || 240;
        const commonDivisor = gcd(width, height);
        const factors = returnFactors(commonDivisor);
        const factorSelect = document.getElementById('factorSelect');
        factorSelect.innerHTML = '';
        factors.forEach(factor => {
          const option = document.createElement('option');
          option.value = factor;
          option.textContent = factor;
          factorSelect.appendChild(option);
        });
        factorSelect.value = 10;
        startWebcamAsciiRender();
      };
    })
    .catch(err => {
      alert("Could not access webcam: " + err);
      webcamActive = false;
    });
}

function startWebcamAsciiRender() {
  if (webcamRendering) return;
  webcamRendering = true;
  const webcamVideo = document.getElementById('webcamVideo');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const output = document.getElementById('output');
  const factorSelect = document.getElementById('factorSelect');

  function renderLoop() {
    if (!webcamActive || !webcamVideo.srcObject) {
      webcamRendering = false;
      return;
    }
    const width = webcamVideo.videoWidth;
    const height = webcamVideo.videoHeight;
    if (width && height && factorSelect.value) {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(webcamVideo, 0, 0, width, height);
      processCanvasToAscii(width, height, ctx, parseInt(factorSelect.value), output);
    }
    requestAnimationFrame(renderLoop);
  }
  renderLoop();
}

window.addEventListener('DOMContentLoaded', () => {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const width = img.width;
    const height = img.height;
    const commonDivisor = gcd(width, height);
    const factors = returnFactors(commonDivisor);
    const factorSelect = document.getElementById('factorSelect');
    factorSelect.value = exampleFactor;

    const output = document.getElementById('output');
    processCanvasToAscii(width, height, ctx, exampleFactor, output);
  };
  img.src = exampleImageUrl;
});
</script>
