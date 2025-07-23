+++
date = '2025-06-23T17:44:51-04:00'
draft = false
title = 'Cipher'

summary = "Crypto tools"
description = "Crypto tools"
readTime = false
autonumber = false
math = false
hideBackToTop = false
tags = ["utils", "crypto"]
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++

<div id="message" style="font-family: var(--font-mono)"></div>

<script>
const searchParams = new URLSearchParams(window.location.search);
for (const param of searchParams) {
  console.log(param);
}
let text = "message"
if (searchParams.has('message')); {
    text = searchParams.get('message')
}
let shift = 0
if (searchParams.has('caesar')); {
    shift = searchParams.get('caesar')
}
let i = 0;
const el = document.getElementById("message");
function decode() {
  function decodeChar(c) {
    let code = c.charCodeAt(0);
    return String.fromCharCode(code - shift);
  }

  const hashedTitle = text;
  let current = hashedTitle.split('');
  const target = hashedTitle.split('').map(decodeChar);

  function randomIndices(arr, count) {
    const indices = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== target[i]) indices.push(i);
    }
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.slice(0, count);
  }

  function step() {
    const unrevealed = [];
    for (let i = 0; i < current.length; i++) {
      if (current[i] !== target[i]) unrevealed.push(i);
    }
    if (unrevealed.length === 0) return;

    const idx = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    current[idx] = target[idx];
    el.textContent = current.join('');

    setTimeout(step, 50);
  }

  el.textContent = hashedTitle;
  step();
}
if (el) decode();
</script>
