+++
date = '2025-05-25T01:45:15-04:00'
draft = false
title = 'Ball Pit'

summary = ""
description = ""
readTime = false
autonumber = false
math = false
hideBackToTop = false
tags = []
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++
<br>
<!-- <div align="center" style="width: 100%; height: 100%; overflow: hidden;"> -->
<canvas id="canvas" width="350" height="350" overflow="hidden"></canvas>
<!-- </div> -->
<script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const balls = [];
    // const colors = [
    //     '#FC5D7C',
    //     '#F39660',
    //     '#E7C664',
    //     '#9ED072',
    //     '#76CCE0',
    //     '#B39DF3'
    // ]
    red = getComputedStyle(document.documentElement).getPropertyValue('--red') || '#FC5D7C'
    orange = getComputedStyle(document.documentElement).getPropertyValue('--orange') || '#F39660'
    yellow = getComputedStyle(document.documentElement).getPropertyValue('--yellow') || '#E7C664'
    green = getComputedStyle(document.documentElement).getPropertyValue('--green') || '#9ED072'
    blue = getComputedStyle(document.documentElement).getPropertyValue('--blue') || '#76CCE0'
    purple = getComputedStyle(document.documentElement).getPropertyValue('--purple') || '#B39DF3'
    const colors = [
        red,
        orange,
        yellow,
        green,
        blue,
        purple,
    ]
    const numBalls = 50;
    const ballRadius = 10;
    const ballSpeed = 2;
    const maxSpeed = 5;
    var mouseX = 0;
    var mouseY = 0;
    var mouseDown = false;
    function Ball(x, y, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
    }
    Ball.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    };
    Ball.prototype.update = function() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x + ballRadius > canvas.width || this.x - ballRadius < 0) {
            this.x = Math.max(ballRadius, Math.min(this.x, canvas.width - ballRadius));
            this.dx = -this.dx
            if (this.dx * this.dx > maxSpeed) {
                this.dx *= 0.9;
            }
        }
        if (this.y + ballRadius > canvas.height || this.y - ballRadius < 0) {
            this.y = Math.max(ballRadius, Math.min(this.y, canvas.height - ballRadius));
            this.dy = -this.dy;
            if (this.dx * this.dx > maxSpeed) {
                this.dx *= 0.9;
            }
        }
        if (mouseDown) {
            this.gravitateToMouse();
        } else {
            this.dx *= 0.999;
            this.dy *= 0.999;
        }
    };
    Ball.prototype.gravitateToMouse = function() {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 100) {
            this.dx += (dx / (distance)) * .1;
            this.dy += (dy / (distance)) * .1;
        }
    };
    function init() {
        for (let i = 0; i < numBalls; i++) {
            const x = Math.random() * (canvas.width - 2 * ballRadius) + ballRadius;
            const y = Math.random() * (canvas.height - 2 * ballRadius) + ballRadius;
            const dx = (Math.random() - 0.5) * ballSpeed;
            const dy = (Math.random() - 0.5) * ballSpeed;
            const color = colors[Math.floor(Math.random() * colors.length)];
            balls.push(new Ball(x, y, dx, dy, color));
        }
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < balls.length; i++) {
            balls[i].draw();
            balls[i].update();
        }
        requestAnimationFrame(animate);
    }
    function updateDisplay(event) {
        const rect = canvas.getBoundingClientRect();
        mouseX = (event.clientX - rect.left) * (canvas.width / rect.width);
        mouseY = (event.clientY - rect.top) * (canvas.height / rect.height);
    }
    canvas.addEventListener("mousemove", updateDisplay, false);
    canvas.addEventListener("mouseenter", updateDisplay, false);
    canvas.addEventListener("mouseleave", updateDisplay, false);
    canvas.addEventListener("mousedown", function(event) {
        mouseDown = true;
        updateDisplay(event);
    }, false);
    canvas.addEventListener("mouseup", function(event) {
        mouseDown = false;
        updateDisplay(event);
    }, false);
    canvas.addEventListener("touchstart", function(event) {
        mouseDown = true;
        if (event.touches.length > 0) {
            updateDisplay(event.touches[0]);
        }
        event.preventDefault();
    }, false);
    canvas.addEventListener("touchend", function(event) {
        mouseDown = false;
        event.preventDefault();
    }, false);
    canvas.addEventListener("touchcancel", function(event) {
        mouseDown = false;
        event.preventDefault();
    }, false);
    canvas.addEventListener("touchmove", function(event) {
        if (event.touches.length > 0) {
            updateDisplay(event.touches[0]);
        }
        event.preventDefault();
    }, false);
    init();
    animate();
</script>