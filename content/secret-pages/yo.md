+++
date = '1970-01-01T00:00:00-00:00'
draft = false
title = 'Yo'
summary = "yo"
description = "yo"
readTime = false
autonumber = false
math = false
hideBackToTop = true
tags = ["yo"]
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

red = getComputedStyle(document.documentElement).getPropertyValue('--red') || '#FC5D7C'
orange = getComputedStyle(document.documentElement).getPropertyValue('--orange') || '#F39660'
yellow = getComputedStyle(document.documentElement).getPropertyValue('--yellow') || '#E7C664'
green = getComputedStyle(document.documentElement).getPropertyValue('--green') || '#9ED072'
blue = getComputedStyle(document.documentElement).getPropertyValue('--blue') || '#76CCE0'
purple = getComputedStyle(document.documentElement).getPropertyValue('--purple') || '#B39DF3'
let colors = [
    red,
    orange,
    yellow,
    green,
    blue,
    purple,
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