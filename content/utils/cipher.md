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
let shifts = [];
if (searchParams.has('caesar')) {
    shifts = searchParams.getAll('caesar').map(Number);
}
let i = 0;
const el = document.getElementById("message");
function decode() {
  function decodeChar(c, shift) {
    let code = c.charCodeAt(0);
    return String.fromCharCode(code - shift);
  }

  const hashedTitle = text;
  let current = hashedTitle.split('');
  let targets = [hashedTitle.split('')];
  for (const shift of shifts) {
      const prev = targets[targets.length - 1];
      targets.push(prev.map(c => decodeChar(c, shift)));
  }
  const target = targets[targets.length - 1];

  function step(stage = 1) {
    if (stage >= targets.length) return;

    let current = targets[stage - 1].slice();
    const nextTarget = targets[stage];

    function reveal() {
        const unrevealed = [];
        for (let i = 0; i < current.length; i++) {
            if (current[i] !== nextTarget[i]) unrevealed.push(i);
        }
        if (unrevealed.length === 0) {
            el.textContent = current.join('');
            setTimeout(() => step(stage + 1), 400);
            return;
        }

        const idx = unrevealed[Math.floor(Math.random() * unrevealed.length)];
        current[idx] = nextTarget[idx];
        el.textContent = current.join('');

        setTimeout(reveal, 50);
    }

    el.textContent = current.join('');
    reveal();
}

  el.textContent = hashedTitle;
  step();
}
if (el) decode();
</script>
