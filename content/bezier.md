+++
date = '2025-05-25T17:44:51-04:00'
draft = false
title = 'Bezier'

summary = "Bezier curve tools"
description = "Bezier curve tools"
readTime = false
autonumber = false
math = false
hideBackToTop = false
tags = ["utils"]
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++

# Extract Cubic-Bezier Curves from Text
<style>
    .bezier-box {
      display: inline-block;
      padding: 8px 14px;
      margin: 5px;
      cursor: pointer;
      border-radius: 6px;
      background: var(--bg);
      color: var(--orange);
      font-family: monospace;
      font-size: 1em;
      box-shadow: 0 0 4px rgba(0,0,0,0.2);
      border: 1px solid var(--bg1);
      transition: background 0.3s border-color 0.3s;
      vertical-align: top;
    }
    .bezier-box:hover {
      background: var(--bg1);
    }
    .bezier-graph {
      display: block;
      margin: 0 auto 8px auto;
      border-radius: 4px;
    }
</style>

<textarea id="inputText" rows="5" cols=35% style="border-radius: 6px; border: 1px solid #ccc; padding: 6px 10px; font-size: 1em; color: var(--fg); width: auto;">
animation-timing-function: cubic-bezier(0.42, 0, 1, 1); /* ease-in */
animation-timing-function: cubic-bezier(0, 0, 0.58, 1); /* ease-out */
animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1); /* ease-in-out */
animation-timing-function: cubic-bezier(.5, 0, 1, 1); /* quadratic */
</textarea>
<br>
<div id="bezierContainer"></div>
<p>
    <span id="bezierCount"></span>
</p>

<script>
orange = getComputedStyle(document.documentElement).getPropertyValue('--orange') || "#f39660";
green = getComputedStyle(document.documentElement).getPropertyValue('--green') || "#a7df78";
function cubicBezier(t, p0, p1, p2, p3) {
    const mt = 1 - t;
    return mt*mt*mt*p0 + 3*mt*mt*t*p1 + 3*mt*t*t*p2 + t*t*t*p3;
}

function drawBezierGraph(ctx, x1, y1, x2, y2, width, height) {
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = orange;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const x = cubicBezier(t, 0, x1, x2, 1);
        const y = cubicBezier(t, 0, y1, y2, 1);
        const px = (x * (width-2)) + 1;
        const py = ((1-y) * (height-2)) + 1;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();

    ctx.fillStyle = green;
    ctx.beginPath();
    ctx.arc(x1*(width-2)+1, (1-y1)*(height-2)+1, 3, 0, 2*Math.PI);
    ctx.arc(x2*(width-2)+1, (1-y2)*(height-2)+1, 3, 0, 2*Math.PI);
    ctx.fill();
}

function extractBeziers() {
    const text = document.getElementById("inputText").value;
    const container = document.getElementById("bezierContainer");
    container.innerHTML = "";

    const bezierRegex = /cubic-bezier\(\s*([-+]?\d*\.?\d+)\s*,\s*([-+]?\d*\.?\d+)\s*,\s*([-+]?\d*\.?\d+)\s*,\s*([-+]?\d*\.?\d+)\s*\)/gi;

    const matches = [...text.matchAll(bezierRegex)] || [];
    const uniqueBeziers = [];
    const seen = new Set();

    matches.forEach(match => {
        const bezierStr = match[0];
        if (!seen.has(bezierStr)) {
            uniqueBeziers.push(match);
            seen.add(bezierStr);
        }
    });

    uniqueBeziers.forEach(match => {
        const [bezier, x1, y1, x2, y2] = match;
        const box = document.createElement("div");
        box.className = "bezier-box";
        box.title = "Click to copy";

        const canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 200;
        canvas.className = "bezier-graph";
        box.appendChild(canvas);

        const label = document.createElement("div");
        label.textContent = bezier;
        box.appendChild(label);

        box.onclick = () => {
            navigator.clipboard.writeText(bezier);
        };
        container.appendChild(box);

        const ctx = canvas.getContext("2d");
        drawBezierGraph(
            ctx,
            parseFloat(x1), parseFloat(y1),
            parseFloat(x2), parseFloat(y2),
            canvas.width, canvas.height
        );
    });

    document.getElementById("bezierCount").innerText = '# of cubic-bezier curves: ' + uniqueBeziers.length;
}

extractBeziers();
document.getElementById("inputText").addEventListener("input", extractBeziers);
</script>
