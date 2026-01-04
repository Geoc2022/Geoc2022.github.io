+++
date = '2026-01-03T13:03:32-04:00'
draft = true
title = 'Doomsday Algorithm'

summary = "Practice the Doomsday algorithm"
description = "Practice the Doomsday algorithm"
readTime = false
autonumber = false
math = false
hideBackToTop = false
tags = ["utils"]
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++

<div id="doomsday-trainer" align="center">
  <h1 style="font-size:2.5em; font-weight:bold; display:flex; align-items:center; justify-content:center; gap:0.5em; width:100%;">
      <input type="text" id="Day" placeholder="6" style="font-size:1em; width:4em; min-width:3em; text-align:right;" oninput="generateNewDate()">
      <span>/</span>
      <input type="text" id="Month" placeholder="6" style="font-size:1em; width:4em; min-width:3em; text-align:center;" oninput="generateNewDate()">
      <span>/</span>
      <input type="text" id="Year" placeholder="6" style="font-size:1em; width:4em; min-width:3em; text-align:left;" oninput="generateNewDate()">
  </h1>
  <p style="font-size:1.2em;" id="random-date">?</p>
  <button id="redo-button" style="font-size: 1.5em;">↻</button>
  <p id="result" style="font-size:1.2em; min-height: 1.5em;"></p>
</div>
<details style="margin-top: 1em;">
<summary>Doomsday</summary>
<p id="hint-content" style="margin-top: 0.5em;"></p>
</details>
<details style="margin-top: 1em;">
<summary>Closest Doomsday</summary>
<p id="hint2-content" style="margin-top: 0.5em;"></p>
</details>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const dateEl = document.getElementById('random-date');
    const resultEl = document.getElementById('result');
    const redoBtn = document.getElementById('redo-button');
    const hintEl = document.getElementById('hint-content');
    const hint2El = document.getElementById('hint2-content');

    let startTime;
    let correctDay;
    let yearDoomsday;
    let closestDoomsday;
    let randomDate;

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const doomsdaysByMonth = {
        1: { common: [3, 10, 17, 24, 31], leap: [4, 11, 18, 25] },
        2: { common: [7, 14, 21, 28], leap: [1, 8, 15, 22, 29] },
        3: [7, 14, 21, 28],
        4: [4, 11, 18, 25],
        5: [2, 9, 16, 23, 30],
        6: [6, 13, 20, 27],
        7: [4, 11, 18, 25],
        8: [1, 8, 15, 22, 29],
        9: [5, 12, 19, 26],
        10: [3, 10, 17, 24, 31],
        11: [7, 14, 21, 28],
        12: [5, 12, 19, 26]
    };

    function isLeap(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function getDoomsdayForYear(y) {
        return (2 + 5 * (y % 4) + 4 * (y % 100) + 6 * (y % 400)) % 7;
    }

    function getClosestDoomsday(month, day, year) {
        const leap = isLeap(year);
        let monthDoomsdays;
        if (month === 1 || month === 2) {
            monthDoomsdays = doomsdaysByMonth[month][leap ? 'leap' : 'common'];
        } else {
            monthDoomsdays = doomsdaysByMonth[month];
        }

        let closest = monthDoomsdays[0];
        let minDiff = Math.abs(day - closest);
        for (let i = 1; i < monthDoomsdays.length; i++) {
            const diff = Math.abs(day - monthDoomsdays[i]);
            if (diff < minDiff) {
                minDiff = diff;
                closest = monthDoomsdays[i];
            }
        }
        return closest;
    }

    function generateNewDate() {
        const year = Math.floor(Math.random() * 300) + 1900;
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1;

        randomDate = new Date(year, month - 1, day);

        dateEl.textContent = randomDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

        yearDoomsday = getDoomsdayForYear(randomDate.getFullYear());
        const monthForClosest = randomDate.getMonth() + 1;
        const dayForClosest = randomDate.getDate();
        const yearForClosest = randomDate.getFullYear();
        closestDoomsday = getClosestDoomsday(monthForClosest, dayForClosest, yearForClosest);

        let dayOfWeek = (yearDoomsday + (dayForClosest - closestDoomsday)) % 7;
        correctDay = (dayOfWeek < 0) ? (dayOfWeek + 7) : dayOfWeek;

        const monthName = randomDate.toLocaleDateString(undefined, { month: 'long' });
        hintEl.innerHTML = `${yearDoomsday}: ${dayNames[yearDoomsday]}`;
        hint2El.innerHTML = `${monthName} ${closestDoomsday}`;

        startTime = new Date();
    }

    function handleGuess(event) {
        if (event.target.tagName.toLowerCase() === 'input') return;
        const guess = parseInt(event.key);
        if (!isNaN(guess) && guess >= 0 && guess <= 6) {
            const endTime = new Date();
            const timeTaken = (endTime - startTime) / 1000;

            if (guess === correctDay) {
                resultEl.innerHTML = `<span style="color: var(--green);">✓ ${timeTaken.toFixed(2)}s</span>`;
            } else {
                resultEl.innerHTML = `<span style="color: var(--red);">${dayNames[correctDay]}</span> ${timeTaken.toFixed(2)}s`;
            }

            setTimeout(generateNewDate, 0);
        }
    }

    redoBtn.addEventListener('click', generateNewDate);
    document.addEventListener('keydown', handleGuess);

    generateNewDate();
});
</script>
