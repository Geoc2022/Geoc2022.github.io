+++
date = '0000-01-01T12:00:00-04:00'
draft = false
title = 'Yo'

readTime = false
autonumber = false
math = false
hideBackToTop = true
tags = ["secret-pages", "yo"]
showTags = true
fediverse = "@geoc@mathstodon.xyz"
+++
<br>

<div align="center">
<canvas id="yoBox" width="300" height="300" style="border:1px solid #ccc;"></canvas>
</div>

<script>
const canvas = document.getElementById('yoBox');
const ctx = canvas.getContext('2d');

let x = 50, y = 50;
let dx = 1.6180339887, dy = 2;
const yoWidth = 30, yoHeight = 30;

//   --red: #FC5D7C;
//   --orange: #F39660;
//   --yellow: #E7C664;
//   --green: #9ED072;
//   --blue: #76CCE0;
//   --purple: #B39DF3;
let colors = [
    '#FC5D7C',
    '#F39660',
    '#E7C664',
    '#9ED072',
    '#76CCE0',
    '#B39DF3'
];

yoColor = colors[4];
ctx.fillStyle = yoColor;
ctx.font = "30px sans-serif";

function getAccentColor() {
    const rootStyles = getComputedStyle(document.documentElement);
    return rootStyles.getPropertyValue('--blue') || '#0078d4'; // fallback color
}

function drawYo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = yoColor;
    ctx.fillText("yo", x, y + yoHeight);
}

function update() {
    x += dx;
    y += dy;

    if (x < 0 || x + yoWidth > canvas.width) {
        dx = -dx;
        yoColor = colors[Math.floor(Math.random() * colors.length)];
    }
    if (y < 0 || y + yoHeight > canvas.height) {
        dy = -dy;
        yoColor = colors[Math.floor(Math.random() * colors.length)];
    }
    
    drawYo();
    requestAnimationFrame(update);
}

drawYo();
update();
</script>