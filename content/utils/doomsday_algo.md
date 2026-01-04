+++
date = '2026-01-03T13:03:32-04:00'
draft = false
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
  <style>
    .doomsday-trainer-h1 {
      font-size:2.5em;
      font-weight:bold;
      align-items:center;
      justify-content:center;
      gap:0.5em;
      width:100%;
    }
    .doomsday-input {
      font-size:1em;
      min-width:2em;
    }
    .doomsday-input-day-month {
      width:2.5em;
      text-align:center;
    }
    .doomsday-input-year {
      width:4em;
      text-align:left;
    }
    .doomsday-input-day-full {
      width:1.5em;
      text-align:center;
    }
    .doomsday-input-month-full {
      width:5.5em;
      text-align:right;
    }
  </style>
  <h1 class="doomsday-trainer-h1" style="display:None;" id="num_date">
      <input type="text" id="DayNum" placeholder="dd" class="doomsday-input doomsday-input-day-month" style="text-align:right;">
      <span>/</span>
      <input type="text" id="MonthNum" placeholder="mm" class="doomsday-input doomsday-input-day-month">
      <span>/</span>
      <input type="text" id="YearNum" placeholder="yyyy" class="doomsday-input doomsday-input-year">
  </h1>
  <h1 class="doomsday-trainer-h1" style="display:flex; gap:0.25em;" id="full_date">
      <input type="text" id="MonthFull" placeholder="Month" class="doomsday-input doomsday-input-month-full">
      <input type="text" id="DayFull" placeholder="Day" class="doomsday-input doomsday-input-day-full">
      <span>,</span>
      <input type="text" id="YearFull" placeholder="Year" class="doomsday-input doomsday-input-year">
  </h1>
  <p id="result" style="font-size:1.2em; min-height: 1.5em;">Type 0-6 to guess for Sun-Sat</p>
  <button id="redo-button" style="font-size: 1.5em;">↻</button>
</div>
<details style="margin-top: 1em;">
<summary>Doomsday</summary>
<p id="hint-content" style="margin-top: 0.5em;"></p>
</details>
<details style="margin-top: 1em;">
<summary>Month Doomsday</summary>
<p id="hint2-content" style="margin-top: 0.5em;"></p>
</details>

The Doomsday algorithm is a method to calculate the day of the week for any given date. The key concept is that certain dates in each year always fall on the same day of the week, known as "Doomsdays." By memorizing these dates and using modular calculations, you can quickly determine the day of the week for any date.

<details style="margin-top: 1em;">
<summary>Doomsdays for the year <input type="text" id="InfoYearInput" placeholder="YYYY"></summary>
<p id="InfoDoomsdaysContent" style="margin-top: 0.5em;"></p>
</details>

<script>
let easyMode = localStorage.getItem('easyMode') === 'true';

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthAbbr = ["", "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

function isLeap(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDoomsdayForYear(y) {
    return (2 + 5 * (y % 4) + 4 * (y % 100) + 6 * (y % 400)) % 7;
}

function getAllDoomsdayDatesForYear(year) {
    const leap = isLeap(year);
    const doomsdaysSet = easyMode ? easyDoomsdaysByMonth : doomsdaysByMonth;
    const allDoomsdays = [];

    for (let month = 1; month <= 12; month++) {
        let monthDoomsdays;
        if (month === 1 || month === 2) {
            monthDoomsdays = doomsdaysSet[month][leap ? 'leap' : 'common'];
        } else {
            monthDoomsdays = doomsdaysSet[month];
        }
        monthDoomsdays.forEach(day => {
            allDoomsdays.push({ month: month, day: day });
        });
    }
    return allDoomsdays;
}

// https://rosettacode.org/wiki/Doomsday_rule
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

// 4/4 6/6 8/8 10/10 12/12
// 5/9 7/11 9/5 11/7
// 1/3 (1/4) 2/28 (2/29) “March 0”
const easyDoomsdaysByMonth = {
    1: { common: [3], leap: [4] },
    2: { common: [28], leap: [29] },
    3: [],
    4: [4],
    5: [9],
    6: [6],
    7: [11],
    8: [8],
    9: [5],
    10: [10],
    11: [7],
    12: [12]
};

function updateInfoDoomsdays(year) {
    if (isNaN(year)) return;
    const leap = isLeap(year);
    const doomsdaysSet = easyMode ? easyDoomsdaysByMonth : doomsdaysByMonth;
    let doomsdaysText = '';
    for (let month = 1; month <= 12; month++) {
        let monthDoomsdays;
        if (month === 1 || month === 2) {
            monthDoomsdays = doomsdaysSet[month][leap ? 'leap' : 'common'];
        } else {
            monthDoomsdays = doomsdaysSet[month];
        }
        doomsdaysText += `${easyMode ? month.toString() : monthNames[month]} ${easyMode ? '/' : ':'} ${monthDoomsdays.join(', ')}<br>`;
    }
    document.getElementById('InfoDoomsdaysContent').innerHTML = doomsdaysText;
}

document.addEventListener('DOMContentLoaded', () => {
    const resultEl = document.getElementById('result');
    const redoBtn = document.getElementById('redo-button');
    const hintEl = document.getElementById('hint-content');
    const hint2El = document.getElementById('hint2-content');

    const dayNumInput = document.getElementById('DayNum');
    const monthNumInput = document.getElementById('MonthNum');
    const yearNumInput = document.getElementById('YearNum');

    const dayFullInput = document.getElementById('DayFull');
    const monthFullInput = document.getElementById('MonthFull');
    const yearFullInput = document.getElementById('YearFull');

    const numDateEl = document.getElementById('num_date');
    const fullDateEl = document.getElementById('full_date');
    const trainerEl = document.getElementById('doomsday-trainer');
    const titleEl = document.querySelector('.single-title');
    const infoYearInput = document.getElementById('InfoYearInput');

    let startTime;
    let correctDay;
    let yearDoomsday;
    let closestDoomsday;
    let randomDate;

    if (easyMode && titleEl) {
        titleEl.textContent = 'Practice the Simplified Doomsday Algorithm';
    }

    if (titleEl) {
        titleEl.addEventListener('click', () => {
            easyMode = !easyMode;
            localStorage.setItem('easyMode', easyMode);
            titleEl.textContent = easyMode ? 'Practice the Simplified Doomsday Algorithm' : 'Doomsday Algorithm';
            updateInfoDoomsdays(parseInt(infoYearInput.value) || new Date().getFullYear());
            generateNewDate();
        });
    }

    const currentYear = new Date().getFullYear();
    infoYearInput.placeholder = currentYear;
    updateInfoDoomsdays(currentYear);

    infoYearInput.addEventListener('input', (e) => {
        const year = parseInt(e.target.value) || new Date().getFullYear();
        updateInfoDoomsdays(year);
    });

    dayNumInput.addEventListener('input', (e) => dayFullInput.value = e.target.value);
    dayFullInput.addEventListener('input', (e) => dayNumInput.value = e.target.value);
    yearNumInput.addEventListener('input', (e) => yearFullInput.value = e.target.value);
    yearFullInput.addEventListener('input', (e) => yearNumInput.value = e.target.value);

    monthNumInput.addEventListener('input', (e) => {
        const monthNum = parseInt(e.target.value);
        if (monthNum >= 1 && monthNum <= 12) {
            monthFullInput.value = monthNames[monthNum];
        } else {
            monthFullInput.value = '';
        }
    });

    monthFullInput.addEventListener('input', (e) => {
        const monthStr = e.target.value.toLowerCase();
        let monthNum = -1;

        const fullMonthIndex = monthNames.findIndex(m => m.toLowerCase() === monthStr);
        if (fullMonthIndex > 0) {
            monthNum = fullMonthIndex;
        }

        if (monthNum === -1) {
            const abbrMonthIndex = monthAbbr.findIndex(m => m === monthStr);
            if (abbrMonthIndex > 0) {
                monthNum = abbrMonthIndex;
            }
        }

        if (monthNum !== -1) {
            monthNumInput.value = monthNum;
        } else {
            const parsed = parseInt(monthStr);
            if (!isNaN(parsed) && parsed >= 1 && parsed <= 12) {
                monthNumInput.value = parsed;
            } else {
                monthNumInput.value = '';
            }
        }
    });

    function getClosestDoomsdayDateInfo(targetMonth, targetDay, targetYear) {
        const allDoomsdays = getAllDoomsdayDatesForYear(targetYear);
        const targetDate = new Date(targetYear, targetMonth - 1, targetDay);

        let closestDoomsdayMonth = 0;
        let closestDoomsdayDay = 0;
        let minDiff = Infinity;

        allDoomsdays.forEach(dd => {
            const doomsdayDate = new Date(targetYear, dd.month - 1, dd.day);
            const diff = Math.abs(targetDate.getTime() - doomsdayDate.getTime());

            if (diff < minDiff) {
                minDiff = diff;
                closestDoomsdayMonth = dd.month;
                closestDoomsdayDay = dd.day;
            }
        });
        return { month: closestDoomsdayMonth, day: closestDoomsdayDay };
    }

    function generateNewDate() {
        const desiredDay = dayNumInput.value ? parseInt(dayNumInput.value) : null;
        const desiredMonth = monthNumInput.value ? parseInt(monthNumInput.value) : null;
        const desiredYear = yearNumInput.value ? parseInt(yearNumInput.value) : null;

        let year, month, day, date;
        let validDate = false;
        let attempts = 0;

        while (!validDate && attempts < 100) {
            attempts++;
            year = desiredYear !== null ? desiredYear : Math.floor(Math.random() * 300) + 1900;
            month = desiredMonth !== null ? desiredMonth : Math.floor(Math.random() * 12) + 1;
            const maxDay = new Date(year, month, 0).getDate();
            day = desiredDay !== null ? desiredDay : Math.floor(Math.random() * maxDay) + 1;

            if (desiredDay !== null && day !== desiredDay) {
                continue;
            }

            date = new Date(year, month - 1, day);

            if (date.getFullYear() === year && (date.getMonth() + 1) === month && date.getDate() === day) {
                validDate = true;
            }
        }

        if (!validDate) {
            const fallbackYear = Math.floor(Math.random() * 300) + 1900;
            const fallbackMonth = Math.floor(Math.random() * 12) + 1;
            const fallbackDay = Math.floor(Math.random() * 28) + 1;
            randomDate = new Date(fallbackYear, fallbackMonth - 1, fallbackDay);
        } else {
            randomDate = date;
        }

        dayNumInput.placeholder = randomDate.getDate().toString();
        monthNumInput.placeholder = (randomDate.getMonth() + 1).toString();
        yearNumInput.placeholder = randomDate.getFullYear().toString();

        dayFullInput.placeholder = randomDate.getDate().toString();
        monthFullInput.placeholder = randomDate.toLocaleDateString(undefined, { month: 'long' });
        yearFullInput.placeholder = randomDate.getFullYear().toString();

        yearDoomsday = getDoomsdayForYear(randomDate.getFullYear());
        const monthForClosest = randomDate.getMonth() + 1;
        const dayForClosest = randomDate.getDate();
        const yearForClosest = randomDate.getFullYear();

        const { month: closestDoomsdayMonth, day: closestDoomsdayDay } = getClosestDoomsdayDateInfo(monthForClosest, dayForClosest, yearForClosest);

        let dayOfWeek = (yearDoomsday + (dayForClosest - closestDoomsdayDay)) % 7;
        correctDay = (dayOfWeek < 0) ? (dayOfWeek + 7) : dayOfWeek;

        const doomsdayHintValue = numDateEl.style.display === 'flex' ? yearDoomsday.toString() : dayNames[yearDoomsday];

        hintEl.innerHTML = `${doomsdayHintValue}`;
        const monthDoomsdayHint = numDateEl.style.display === 'flex'
            ? `${closestDoomsdayMonth}/${closestDoomsdayDay}`
            : `${monthNames[closestDoomsdayMonth]} ${closestDoomsdayDay}`;
        hint2El.innerHTML = `${monthDoomsdayHint}`;

        startTime = new Date();
    }

    function handleGuess(event) {
        if (event.target.tagName.toLowerCase() === 'input') return;
        const guess = parseInt(event.key);
        if (!isNaN(guess) && guess >= 0 && guess <= 6) {
            const endTime = new Date();
            const timeTaken = (endTime - startTime) / 1000;

            const displayValue = numDateEl.style.display === 'flex' ? correctDay.toString() : dayNames[correctDay];

            if (guess === correctDay) {
                resultEl.innerHTML = `<span style="color: var(--green);">${displayValue}</span> ${timeTaken.toFixed(2)}s`;
            } else {
                resultEl.innerHTML = `<span style="color: var(--red);">${displayValue}</span> ${timeTaken.toFixed(2)}s`;
            }

            setTimeout(generateNewDate, 0);
        }
    }

    function toggleDateDisplay(event) {
        if (event.target.id === 'doomsday-trainer') {
            if (numDateEl.style.display === 'none') {
                numDateEl.style.display = 'flex';
                fullDateEl.style.display = 'none';
            } else {
                numDateEl.style.display = 'none';
                fullDateEl.style.display = 'flex';
            }
        }
    }

    redoBtn.addEventListener('click', generateNewDate);
    document.addEventListener('keydown', handleGuess);
    trainerEl.addEventListener('click', toggleDateDisplay);

    generateNewDate();
});
</script>
