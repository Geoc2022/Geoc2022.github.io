+++
date = '2025-06-29T12:53:17-04:00'
draft = false
title = 'Julia Set Filter'

summary = "Become the Julia Set with your webcam"
description = "Become the Julia Set with your webcam"
readTime = false
autonumber = false
math = false
hideBackToTop = false
tags = [ "webcam", "julia set", "filter", "complex" ]
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++

<video id="webcam" autoplay playsinline style="display:none;"></video>
<canvas id="output"></canvas>

<br>
<input type="range" id="c1" min="-1" max="1" step="0.001" value="-0.5125" style="width:120px; vertical-align:middle;">
<small>c₁=<span id="c1-value"></span></small>
<br>
<input type="range" id="c2" min="-1" max="1" step="0.001" value="0.5213" style="width:120px; vertical-align:middle;">
<small>c₂=<span id="c2-value"></span></small>
<br>
<input type="range" id="iterations" min="1" max="200" step="1" value="0" style="width:120px; vertical-align:middle;">
<small>iterations=<span id="iterations-value"></span></small>


Here's the JavaScript code that computes the Julia set map:
```javascript
function iterateMap(x, y, map, iterations) {
    let [real, imag] = [x, y];
    for (let i = 0; i < iterations; i++) {
        [real, imag] = map(real, imag);
    }
    return [real, imag];
}
function juliaSet(x, y, c1, c2, iterations) {
    const map = (x, y) => {
        const real = x * x - y * y + c1;
        const imag = 2 * x * y + c2;
        return [real, imag];
    };
    return iterateMap(x, y, map, iterations);
}
```

This was inspired by [this video](https://youtu.be/0OP9guFmWfs?t=72). It wasn't too bad to implement, and I've left the complex power function in the code for possibly creating other complex maps in the future.

<script>
const c1Slider = document.getElementById('c1');
const c2Slider = document.getElementById('c2');
const iterationsSlider = document.getElementById('iterations');
const c1Value = document.getElementById('c1-value');
const c2Value = document.getElementById('c2-value');
const iterationsValue = document.getElementById('iterations-value');
let c1 = parseFloat(c1Slider.value);
let c2 = parseFloat(c2Slider.value);
let iterations = parseInt(iterationsSlider.value, 10);
c1Value.textContent = c1;
c2Value.textContent = c2;
iterationsValue.textContent = iterations;
c1Slider.addEventListener('input', () => {
    c1 = parseFloat(c1Slider.value);
    c1Value.textContent = c1;
});
c2Slider.addEventListener('input', () => {
    c2 = parseFloat(c2Slider.value);
    c2Value.textContent = c2;
});
iterationsSlider.addEventListener('input', () => {
    iterations = parseInt(iterationsSlider.value, 10);
    iterationsValue.textContent = iterations;
});
function animateIterations(target = 100, delay = 30) {
    let start = 0;
    let startTime = null;
    function easeInOut(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const duration = target * delay;
        let t = Math.min(elapsed / duration, 1);
        let eased = Math.round(start + (target - start) * easeInOut(t));
        iterationsSlider.value = eased;
        iterations = eased;
        iterationsValue.textContent = eased;
        if (t < 1) {
            requestAnimationFrame(step);
        }
    }
    requestAnimationFrame(step);
}
async function complexPower() {
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('output');
    const ctx = canvas.getContext('2d');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        const size = Math.min(video.videoWidth, video.videoHeight);
        canvas.width = size;
        canvas.height = size;
        draw(size);
    });
    function h(x, y) {
        // h(x, y) = arctan(x / y)
        return Math.atan2(y, x);
    }
    function p_at(x1, y1, x2, y2) {
        // p_at = cos(x2 * h(x1, y1) + (y2 * ln(x1^2 + y1^2))/2)
        const theta = h(x1, y1);
        const r2 = x1 * x1 + y1 * y1;
        return Math.cos(x2 * theta + (y2 * Math.log(r2)) / 2);
    }
    function p_bt(x1, y1, x2, y2) {
        // p_bt = sin(x2 * h(x1, y1) + (y2 * ln(x1^2 + y1^2))/2)
        const theta = h(x1, y1);
        const r2 = x1 * x1 + y1 * y1;
        return Math.sin(x2 * theta + (y2 * Math.log(r2)) / 2);
    }
    function power(x1, y1, x2, y2) {
        // (x1 + y1 i)^(x2 + y2 i)
        const r2 = x1 * x1 + y1 * y1;
        const theta = h(x1, y1);
        const mag = Math.pow(r2, x2 / 2) * Math.exp(-y2 * theta);
        return [
            mag * p_at(x1, y1, x2, y2),
            mag * p_bt(x1, y1, x2, y2)
        ];
    }
    function iterateMap(x, y, map, iterations) {
        let [real, imag] = [x, y];
        for (let i = 0; i < iterations; i++) {
            [real, imag] = map(real, imag);
        }
        return [real, imag];
    }
    function juliaSet(x, y, c1, c2, iterations) {
        const map = (x, y) => {
            const real = x * x - y * y + c1;
            const imag = 2 * x * y + c2;
            return [real, imag];
        };
        return iterateMap(x, y, map, iterations);
    }
    function mapping(x, y) {
        const [real, imag] = juliaSet(x, y, c1, c2, iterations);
        return [real, imag];
    }
    function complexMap(x, y, width, height) {
        const cx = (x / width) * 2 - 1;
        const cy = (y / height) * 2 - 1;
        const [real, imag] = mapping(cx, cy, c1, c2, iterations);
        const newX = Math.floor(((real + 1) / 2) * width);
        const newY = Math.floor(((imag + 1) / 2) * height);
        return [newX, newY];
    }
    function draw(size) {
        const sx = Math.floor((video.videoWidth - size) / 2);
        const sy = Math.floor((video.videoHeight - size) / 2);
        ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
        let frame = ctx.getImageData(0, 0, size, size);
        let output = ctx.createImageData(size, size);
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let [sx2, sy2] = complexMap(x, y, size, size);
                if (sx2 >= 0 && sx2 < size && sy2 >= 0 && sy2 < size) {
                    let srcIdx = (sy2 * size + sx2) * 4;
                    let dstIdx = (y * size + x) * 4;
                    output.data[dstIdx] = frame.data[srcIdx];
                    output.data[dstIdx+1] = frame.data[srcIdx+1];
                    output.data[dstIdx+2] = frame.data[srcIdx+2];
                    output.data[dstIdx+3] = frame.data[srcIdx+3];
                }
            }
        }
        ctx.putImageData(output, 0, 0);
        requestAnimationFrame(() => draw(size));
    }
}
function onVideoReady(callback) {
    const video = document.getElementById('webcam');
    if (video.readyState >= 2) {
        callback();
    } else {
        video.addEventListener('loadeddata', callback, { once: true });
    }
}
window.addEventListener('DOMContentLoaded', () => {
    complexPower().then(() => {
        onVideoReady(() => {
            animateIterations(100, 60);
        });
    });
});
</script>
