+++
date = '2025-05-23T13:03:32-04:00'
draft = false
title = 'Dice'

summary = "A random number generator"
description = "A random number generator"
readTime = false
autonumber = false
math = false
hideBackToTop = true
tags = ["utils"]
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++


<!-- # / dice_number
reroll -->

<!-- dice number = 6 -->

<div align="center">
    <h1 style="font-size:2.5em; font-weight:bold; display:flex; align-items:center; justify-content:center; gap:0.5em; width:100%;">
        <span id="result" style="display:inline-block; min-width:3em; width:4em; text-align:right;"></span>
        <span>/</span>
        <input type="text" id="outOf" placeholder="6" style="font-size:1em; width:4em; min-width:3em; text-align:left;" oninput="rollDice()" autofocus>
    </h1>
</div>
<div align="center" style="margin-top: 20px;">  
    <button id="roll" style="border-radius: 6px; border: 1px solid #ccc; padding: 2px 5px; font-size: 1em;">Roll</button>
</div>

<script>
    const rollButton = document.getElementById('roll');
    const outOfInput = document.getElementById('outOf');

    function rollDice() {
        const outOf = parseInt(outOfInput.value, 10);
        if (isNaN(outOf) || outOf <= 0) {
            return;
        }
        const randomNumber = Math.floor(Math.random() * outOf) + 1;

        const resultDisplay = document.getElementById('result');
        resultDisplay.innerHTML = randomNumber;
    }
    
    rollButton.addEventListener('click', () => {
        result = rollDice();
        }
    );

    rollDice();
</script>