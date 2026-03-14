+++
date = '2025-06-22T13:19:30-04:00'
draft = false
title = 'Quotes'

summary = "A collection of quotes over the years that I like"
description = "A collection of quotes over the years that I like"
readTime = false
autonumber = false
math = false
hideBackToTop = false
tags = []
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++

<!-- Randomly pick a quote from the quotes.json file and display it here.	-->

<html>
<div id="quote" style="min-height: 250px; margin-top: 2em"></div>

<div align="center">
	<button id="redo">↻</button>
</div>
</html>

<script>
const quoteElement = document.getElementById('quote');
const redoButton = document.getElementById('redo');

let quotesData = [];

async function loadQuotes() {
    const response = await fetch('./../quotes_data.json');
    quotesData = await response.json();
}

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    return Math.abs(hash).toString(16);
}

function displayQuote(quote) {
    const hash = hashString(quote.quote);
    history.replaceState(null, '', `#${hash}`);

    quoteElement.innerHTML = `<blockquote style="font-style: italic; margin: 1em 0; padding-left: 1em;">${quote.quote}</blockquote>`;
    if (quote.link) {
        quoteElement.innerHTML += `<p><em>- <a href="${quote.link}" target="_blank">${quote.author}</a></em></p>`;
    } else {
        quoteElement.innerHTML += `<p><em>- ${quote.author}</em></p>`;
    }
}

function displayRandomQuote() {
    const randomQuote = quotesData[Math.floor(Math.random() * quotesData.length)];
    displayQuote(randomQuote);
}

function displayQuoteFromHash(hash) {
    const matchedQuote = quotesData.find(q => hashString(q.quote) === hash);
    if (matchedQuote) {
        displayQuote(matchedQuote);
    } else {
        displayRandomQuote();
    }
}

async function init() {
    try {
        await loadQuotes();
        const hash = window.location.hash.slice(1);
        if (hash) {
            displayQuoteFromHash(hash);
        } else {
            displayRandomQuote();
        }
    } catch (error) {
        console.error('Error fetching quotes:', error);
    }
}

init();

redoButton.addEventListener('click', displayRandomQuote);
</script>
