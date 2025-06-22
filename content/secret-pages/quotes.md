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

	function displayRandomQuote() {
		fetch('./../quotes_data.json')
			.then(response => response.json())
			.then(data => {
				const randomQuote = data[Math.floor(Math.random() * data.length)];
				quoteElement.innerHTML = `<blockquote style="font-style: italic; margin: 1em 0; padding-left: 1em;">${randomQuote.quote}</blockquote>`;
				if (randomQuote.link) {
					quoteElement.innerHTML += `<p><a href="${randomQuote.link}" target="_blank">${randomQuote.author}</a></p>`;
				} else {
					quoteElement.innerHTML += `<p><em>- ${randomQuote.author}</em></p>`;
				}
			})
			.catch(error => console.error('Error fetching quotes:', error));
	}

	displayRandomQuote();

	redoButton.addEventListener('click', displayRandomQuote);
</script>