+++
date = '2025-05-26T00:12:00-04:00'
draft = false
title = 'Cha Cha Slide'

summary = "'Now it's time to get funky'"
description = "'Now it's time to get funky'"
readTime = false
autonumber = false
math = false
hideBackToTop = false
tags = ["secret-pages"]
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++

Press <button id="start">**here**</button> to start the Cha Cha Slide! (Works best on desktop)

<style>
body {
    animation: none;
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

<script>
document.addEventListener('DOMContentLoaded', function() {
  let started = false;
  let animationTimeouts = [];

  const audio = document.createElement('audio');
  audio.src = '/chacha.mp3';
  audio.preload = 'auto';

  const emojiSteps = [
    { time: 0.5, emoji: '➡️', label: 'toRight' },
    { time: 1.5, emoji: '⬅️', label: 'toLeft' },
    { time: 2.5, emoji: '🔙', label: 'takeItBack' },
    { time: 4.5, emoji: '🦘', label: 'oneHop' },
    { time: 6.5, emoji: '🐸', label: 'oneHop' },
    { time: 9.5, emoji: '👟', label: 'stompRight' },
    { time: 10.0, emoji: '👠', label: 'stompRight' },
    { time: 11.0, emoji: '👞', label: 'stompLeft' },
    { time: 11.5, emoji: '👢', label: 'stompLeft' },
    { time: 13.0, emoji: '🛝', label: 'slideLeft' },
    { time: 14.5, emoji: '🛝', label: 'slideRight' },
    { time: 16.0, emoji: '🔀', label: 'crisscross' },
    { time: 18.0, emoji: '🔀', label: 'crisscross' },
    { time: 20.0, emoji: '💃', label: 'chaChaSmooth' }
  ];

  const emojiDiv = document.createElement('div');
  emojiDiv.style.position = 'fixed';
  emojiDiv.style.top = '30%';
  emojiDiv.style.left = '50%';
  emojiDiv.style.transform = 'translate(-50%, -50%)';
  emojiDiv.style.fontSize = '5rem';
  emojiDiv.style.pointerEvents = 'none';
  emojiDiv.style.zIndex = '9999';
  emojiDiv.style.transition = 'opacity 0.3s';
  emojiDiv.style.opacity = '0';
  document.body.appendChild(emojiDiv);

  function showEmoji(emoji) {
    emojiDiv.textContent = emoji;
    emojiDiv.style.opacity = '1';
    setTimeout(() => {
      emojiDiv.style.opacity = '0';
    }, 900);
  }

  function clearAnimations() {
    document.body.style.animation = 'none';
    void document.body.offsetWidth;
    document.body.style.animationFillMode = 'forwards';
  }

  function clearTimeouts() {
    animationTimeouts.forEach(t => clearTimeout(t));
    animationTimeouts = [];
  }

  document.body.appendChild(audio);

  function chachaSlide() {
    if (started) return;
      started = true;

      clearAnimations();
      clearTimeouts();

      // Set up the animation string
      document.body.style.animation =
        'toRight 1s 0.5s ease-in-out,' +
        'toLeft 1s 1.5s ease-in-out,' +
        'takeItBack 2s 2.5s ease-in-out,'  +
        'oneHop 1s 4.5s ease-in-out,' +
        'oneHop 1s 6.5s ease-in-out,' +
        'stompRight .5s 9.5s ease-in-out,' +
        'stompRight .5s 10s ease-in-out,' +
        'stompLeft .5s 11s ease-in-out,' +
        'stompLeft .5s 11.5s ease-in-out,' +
        'slideLeft 1.5s 13s ease-in-out,' +
        'slideRight 1.5s 14.5s ease-in-out,' +
        'crisscross 1s 16s ease-in-out,' +
        'crisscross 1s 18s ease-in-out,' +
        'chaChaSmooth 5s 20s ease-in-out';
      document.body.style.animationFillMode = 'forwards';

      audio.currentTime = 0;
      audio.play();

      emojiSteps.forEach(step => {
        const t = setTimeout(() => {
          showEmoji(step.emoji);
        }, step.time * 1000);
        animationTimeouts.push(t);
      });

      const resetTimeout = setTimeout(() => {
        started = false;
        clearAnimations();
      }, 25000);
      animationTimeouts.push(resetTimeout);
  }

  document.body.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
      chachaSlide();
    }
  });

  const btn = document.getElementById('start');
  btn.addEventListener('click', function(e) {
    chachaSlide();
  });
});
</script>

<!-- <iframe width="560" height="315" src="https://www.youtube.com/embed/wZv62ShoStY?&amp;start=82&autoplay=1&mute=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> -->
