+++
date = '2025-05-26T00:12:00-04:00'
draft = false
title = 'Cha Cha Slide'

summary = "Cha Cha real smooth!"
description = "Cha Cha real smooth!"
readTime = false
autonumber = false
math = false
hideBackToTop = false
tags = ["secret-pages"]
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++


<style>
body {
    animation: 
    toRight 1s ease-in-out,
    toLeft 1s 1s ease-in-out,
    takeItBack 2s 2s ease-in-out,
    oneHop 1s 4s ease-in-out,
    oneHop 1s 6s ease-in-out,
    stompRight .5s 9s ease-in-out,
    stompRight .5s 9.5s ease-in-out,
    stompLeft .5s 10.5s ease-in-out,
    stompLeft .5s 11s ease-in-out,
    slideLeft 1.5s 12s ease-in-out,
    slideRight 1.5s 13.5s ease-in-out,
    crisscross 1s 15s ease-in-out,
    crisscross 1s 17s ease-in-out,
    chaChaSmooth 5s 19s ease-in-out;
    animation-fill-mode: forwards;
}
@keyframes toRight {
    0% { transform: translateX(0); }
    70% { transform: translateX(200px); }
    100% { transform: translateX(0); }
}
@keyframes toLeft {
    0% { transform: translateX(0); }
    70% { transform: translateX(-200px); }
    100% { transform: translateX(0); }
}
@keyframes slideRight {
    0% { transform: translateX(0); }
    50% { transform: translateX(300px); }
    100% { transform: translateX(0); }
}
@keyframes slideLeft {
    0% { transform: translateX(0); }
    50% { transform: translateX(-300px); }
    100% { transform: translateX(0); }
}
@keyframes takeItBack {
    0% { transform: scale(1); }
    30% { transform: scale(0.7); }
    100% { transform: scale(1); }
}
@keyframes oneHop {
    0% { transform: translateY(0); }
    30% { transform: translateY(-80px); }
    60% { transform: translateY(-80px); }
    100% { transform: translateY(0); }
}
@keyframes stompRight {
    0% { transform: skewY(0deg); }
    50% { transform: skewY(25deg); }
    100% { transform: skewY(0deg); }
}
@keyframes stompLeft {
    0% { transform: skewY(0deg); }
    50% { transform: skewY(-25deg); }
    100% { transform: skewY(0deg); }
}
@keyframes crisscross {
    0% { transform: scaleX(1) scaleY(1); }
    50% { transform: scaleX(-1) scaleY(-1); }
    100% { transform: scaleX(1) scaleY(1); }
}
@keyframes reverseReverse {
    0% { transform: scaleX(1); }
    50% { transform: scaleX(-1); }
    100% { transform: scaleX(1); }
}
@keyframes chaChaSmooth {
    0% { transform: skewX(0deg); }
    10% { transform: skewX(20deg); }
    20% { transform: skewX(-20deg); }
    30% { transform: skewX(20deg); }
    40% { transform: skewX(-20deg); }
    50% { transform: skewX(20deg); }
    60% { transform: skewX(-20deg); }
    70% { transform: skewX(20deg); }
    80% { transform: skewX(-20deg); }
    90% { transform: skewX(20deg); }
    100% { transform: skewX(0deg); }
}
</style>

<iframe width="560" height="315" src="https://www.youtube.com/embed/wZv62ShoStY?&amp;start=82&autoplay=1&mute=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<!-- <audio id="chaChaAudio" src="chacha.mp3" autoplay></audio>
<script>
const chaChaAudio = document.getElementById("chaChaAudio");
chaChaAudio.currentTime = 0;
chaChaAudio.play().catch(() => {
    // Autoplay might be blocked; wait for user interaction
    const playOnUserGesture = () => {
        chaChaAudio.play();
        window.removeEventListener('click', playOnUserGesture);
        window.removeEventListener('keydown', playOnUserGesture);
    };
    window.addEventListener('click', playOnUserGesture);
    window.addEventListener('keydown', playOnUserGesture);
});
</script> -->

<!-- 
<script>
const moves = [
  {
    name: "toRight",
    animation: "toRight 1s ease-in-out",
    beforeMp3: "toRight.mp3"
  },
  {
    name: "slideRight",
    animation: "slideRight 1s ease-in-out",
    beforeMp3: "slideRight.mp3"
  },
  {
    name: "takeItBack",
    animation: "takeItBack 1s ease-in-out",
    beforeMp3: "takeItBack.mp3"
  },
  {
    name: "oneHop",
    animation: "oneHop 0.6s ease-in-out",
    beforeMp3: "oneHop_before.mp3",
    duringMp3: "oneHop_during.mp3"
  },
  {
    name: "stompRight",
    animation: "stompRight 0.5s ease-in-out",
    beforeMp3: "stompRight.mp3"
  },
  {
    name: "crisscross",
    animation: "crisscross 1s ease-in-out",
    beforeMp3: "crisscross.mp3"
  },
  {
    name: "chaChaSmooth",
    animation: "chaChaSmooth 1.5s ease-in-out",
    beforeMp3: "chaChaSmooth_before.mp3",
    duringMp3: "chaChaSmooth_during.mp3"
  }
];

let moveOrder = [];
let currentMove = 0;
let isPlaying = false;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function playAudio(src) {
  if (!src) return null;
  const audio = new Audio(src);
  audio.play();
  return audio;
}

function doMove(move) {
  isPlaying = true;
  document.body.style.animation = "none";
  void document.body.offsetWidth; // force reflow

  // Play before-move audio
  const beforeAudio = playAudio(move.beforeMp3);
  beforeAudio && beforeAudio.addEventListener("ended", () => {
    // Play during-move audio if needed
    let duringAudio = null;
    if (move.duringMp3) {
      duringAudio = playAudio(move.duringMp3);
    }
    document.body.style.animation = move.animation;
    // Wait for animation to finish
    const duration = parseFloat(move.animation.match(/([\d.]+)s/)[1]) * 1000;
    setTimeout(() => {
      document.body.style.animation = "none";
      if (duringAudio) duringAudio.pause();
      isPlaying = false;
    }, duration);
  });
  if (!beforeAudio) {
    // If no before audio, just animate
    let duringAudio = null;
    if (move.duringMp3) duringAudio = playAudio(move.duringMp3);
    document.body.style.animation = move.animation;
    const duration = parseFloat(move.animation.match(/([\d.]+)s/)[1]) * 1000;
    setTimeout(() => {
      document.body.style.animation = "none";
      if (duringAudio) duringAudio.pause();
      isPlaying = false;
    }, duration);
  }
}

function nextMove() {
  if (isPlaying) return;
  if (moveOrder.length === 0 || currentMove >= moveOrder.length) {
    moveOrder = [...moves];
    shuffle(moveOrder);
    currentMove = 0;
  }
  doMove(moveOrder[currentMove]);
  currentMove++;
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    nextMove();
  }
});
</script>

> Press <kbd>Spacebar</kbd> to cha-cha through the moves! -->
