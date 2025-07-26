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

<div id="message" style="font-family: var(--font-mono); font-size: 24px;"></div>
<br>
Here are some tools to play with ciphers and encodings. You can use the URL parameters to try out each of the ciphers.

> [message=hail+ceaser&caesar=-1](/utils/cipher/?message=hail+ceaser&caesar=-1)
>
> [message=](/utils/cipher/?message=WIN&morse=true)[WIN](https://youtu.be/JI6V2jmJxq4)[&morse=true](/utils/cipher/?message=WIN&morse=true)
>
> [message=daisy+daisy&binary=true&binary=false&hex=true&hex=false](/utils/cipher/?message=daisy+daisy&binary=true&binary=false&hex=true&hex=false)

<script>
const searchParams = new URLSearchParams(window.location.search);
for (const param of searchParams) {
  console.log(param);
}
let text = "message";
if (searchParams.has('message')) {
    text = searchParams.get('message');
}
let shifts = [];
if (searchParams.has('caesar')) {
    shifts = searchParams.getAll('caesar').map(Number);
}
const binary = searchParams.getAll('binary').map(v => v === 'true');
const hex = searchParams.getAll('hex').map(v => v === 'true');
const morse = searchParams.getAll('morse').map(v => v === 'true');

const el = document.getElementById("message");

// Morse code maps
const morseMap = {
  'A': '.-',    'B': '-...',  'C': '-.-.', 'D': '-..',  'E': '.',
  'F': '..-.',  'G': '--.',   'H': '....', 'I': '..',   'J': '.---',
  'K': '-.-',   'L': '.-..',  'M': '--',   'N': '-.',   'O': '---',
  'P': '.--.',  'Q': '--.-',  'R': '.-.',  'S': '...',  'T': '-',
  'U': '..-',   'V': '...-',  'W': '.--',  'X': '-..-', 'Y': '-.--',
  'Z': '--..',  '0': '-----', '1': '.----','2': '..---','3': '...--',
  '4': '....-', '5': '.....', '6': '-....','7': '--...','8': '---..',
  '9': '----.', ' ': '/',     '.': '.-.-.-', ',': '--..--'
};
const morseRevMap = Object.fromEntries(Object.entries(morseMap).map(([k, v]) => [v, k]));

function caesarDecode(str, shift) {
  return str.split('').map(c => String.fromCharCode(c.charCodeAt(0) - shift)).join('');
}
function caesarEncode(str, shift) {
  return str.split('').map(c => String.fromCharCode(c.charCodeAt(0) + shift)).join('');
}
function textToBinary(str) {
  return str.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}
function binaryToText(str) {
  return str.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');
}
function textToHex(str) {
  return str.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
}
function hexToText(str) {
  return str.split(' ').map(h => String.fromCharCode(parseInt(h, 16))).join('');
}
function textToMorse(str) {
  return Array.from(str.toUpperCase()).map(c => morseMap[c] || c).join(' ');
}
function morseToText(str) {
  return str.split(' ').map(m => morseRevMap[m] || m).join('');
}

function buildStages(text) {
  let stages = [text];

  for (const shift of shifts) {
    stages.push(caesarDecode(stages[stages.length - 1], shift));
  }

  for (const b of binary) {
    const prev = stages[stages.length - 1];
    stages.push(b ? textToBinary(prev) : binaryToText(prev));
  }

  for (const h of hex) {
    const prev = stages[stages.length - 1];
    stages.push(h ? textToHex(prev) : hexToText(prev));
  }

  for (const m of morse) {
    const prev = stages[stages.length - 1];
    stages.push(m ? textToMorse(prev) : morseToText(prev));
  }

  return stages;
}

function animateStages(stages, el) {
  let stage = 0;
  function step() {
    if (stage >= stages.length - 1) {
      el.textContent = stages[stage];
      return;
    }
    let current = stages[stage].split('');
    const next = stages[stage + 1].split('');
    function reveal() {
      const unrevealed = [];
      for (let i = 0; i < next.length; i++) {
        if (current[i] !== next[i]) unrevealed.push(i);
      }
      if (unrevealed.length === 0) {
        el.textContent = next.join('');
        stage++;
        setTimeout(step, 400);
        return;
      }
      const idx = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      current[idx] = next[idx];
      el.textContent = current.join('');
      setTimeout(reveal, 50);
    }
    el.textContent = current.join('');
    reveal();
  }
  step();
}

if (el) {
  const stages = buildStages(text);
  animateStages(stages, el);
}
</script>
