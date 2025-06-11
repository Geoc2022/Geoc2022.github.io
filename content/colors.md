+++
date = '2025-05-24T21:15:21-04:00'
draft = false
title = 'Colors'

summary = "Color tools"
description = "Color tools"
readTime = false
autonumber = false
math = false
hideBackToTop = false
tags = ["utils"]
showTags = true
fediverse = "@geoc@mathstodon.xyz"
+++

# Extract Colors from Text
<style>
    .color-box {
      display: inline-block;
      width: 75px;
      height: 75px;
      margin: 5px;
      cursor: pointer;
      border: 0px solid #ccc;
      box-shadow: 0 0 4px rgba(0,0,0,0.2);
    }

    .dropzone {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin-bottom: 10px;
      color: #888;
      cursor: pointer;
    }
</style>

<textarea id="inputText" rows="5" cols=25% style="border-radius: 6px; border: 1px solid #ccc; padding: 6px 10px; font-size: 1em; color: var(--fg); width: auto;">
#181819 #222327 #2C2E34 #33353F #363944 #3B3E48 #414550 #595F6F #FC5D7C #F39660 #E7C664 #9EDO72 #76CCE0 #B39DF3 #E2E2E3 #7F8490 #FF6077 #55393D #394634 #A7DF78 #85D3F2 #354157 #4E432F
</textarea>
<br>
<div id="colorContainer"></div>
<p>
    <span id="colorCount"></span>
</p>

# Extract colors from IMG
<input type="file" id="imageInput" accept="image/*" style="margin-bottom: 10px;">
<br>
<input type="text" id="imageUrlInput" placeholder="Paste image URL here" style="margin-bottom: 10px; width: 60%;">
<canvas id="imageCanvas" style="display:none;"></canvas>
<div id="imgColorContainer"></div>
<p>
    <span id="imgColorCount"></span>
</p>

<script>
function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
}

function getDominantColors(image, colorCount = 8) {
    const canvas = document.getElementById("imageCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0, image.width, image.height);
    const data = ctx.getImageData(0, 0, image.width, image.height).data;

    const colorMap = {};
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
        if (a < 128) continue; // skip transparent
        const key = [r, g, b].join(",");
        colorMap[key] = (colorMap[key] || 0) + 1;
    }

    const sorted = Object.entries(colorMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, colorCount);

    return sorted.map(([key]) => {
        const [r, g, b] = key.split(",").map(x => parseInt(x, 10));
        return rgbToHex(r, g, b);
    });
}

function showColorBoxes(colors, containerId, countId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    colors.forEach(hex => {
        const box = document.createElement("div");
        box.className = "color-box";
        box.style.backgroundColor = hex;
        box.title = hex;
        box.onclick = () => navigator.clipboard.writeText(hex);
        container.appendChild(box);
    });
}

function extractColors() {
    const text = document.getElementById("inputText").value;
    const regexes = {
        hex: /#(?:[0-9a-fA-F]{3}){1,2}/g,
        rgb: /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g,
        hsl: /hsl\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*\)/g
    };

    let matches = [];
    for (let type in regexes) {
        const found = text.match(regexes[type]);
        if (found) matches = matches.concat(found);
    }

    const toHex = (color) => {
        const ctx = document.createElement("canvas").getContext("2d");
        ctx.fillStyle = color;
        return ctx.fillStyle;
    };

    const uniqueColors = [...new Set(matches)].map(toHex);
    showColorBoxes(uniqueColors, "colorContainer", "colorCount");
}

extractColors();
document.getElementById("inputText").addEventListener("input", extractColors);

document.getElementById("imageUrlInput").addEventListener("input", function() {
    const url = document.getElementById("imageUrlInput").value.trim();
    if (!url) return;
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.onload = function() {
        const colors = getDominantColors(img, 8);
        showColorBoxes(colors, "imgColorContainer", "imgColorCount");
    };
    img.onerror = function() {
        // alert("Could not load image from the provided URL.");
    };
    img.src = url;
});

document.getElementById("imageInput").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const img = new window.Image();
    img.onload = function() {
        const colors = getDominantColors(img, 8);
        showColorBoxes(colors, "imgColorContainer", "imgColorCount");
    };
    img.src = URL.createObjectURL(file);
});

// Add drag-and-drop and click-to-select support
const dropZone = document.createElement("div");
dropZone.className = "dropzone";
dropZone.innerHTML = "Drag and drop an image here or click to select";

const imageInput = document.getElementById("imageInput");
imageInput.style.display = "none"; // Hide the original input
imageInput.parentNode.insertBefore(dropZone, imageInput);

// Drag events
["dragenter", "dragover"].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.borderColor = "#888";
        dropZone.style.background = "#f8f8f8";
    });
});

["dragleave", "drop"].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.style.borderColor = "#ccc";
        dropZone.style.background = "";
    });
});

// Drop event
dropZone.addEventListener("drop", function(e) {
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const img = new window.Image();
    img.onload = function() {
        const colors = getDominantColors(img, 8);
        showColorBoxes(colors, "imgColorContainer", "imgColorCount");
    };
    img.src = URL.createObjectURL(file);
});

// Click-to-select support
dropZone.addEventListener("click", function() {
    imageInput.value = ""; // Reset so change always fires
    imageInput.click();
});

// File input change event (already present, but ensure it works with dropZone)
imageInput.addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const img = new window.Image();
    img.onload = function() {
        const colors = getDominantColors(img, 8);
        showColorBoxes(colors, "imgColorContainer", "imgColorCount");
    };
    img.src = URL.createObjectURL(file);
});
</script>
