+++
date = '2021-06-23'
draft = false
title = 'Umbral Calculus'

summary = "How to use umbral calculus to find a closed form for a sequence"
description = "How to use umbral calculus to find a closed form for a sequence"
readTime = false
autonumber = false
math = true
tags = ["python", "math"]
showTags = false
hideBackToTop = false
fediverse = "@geoc@mathstodon.xyz"
+++

Using umbral calculus, we can find a closed form for a sequence by using the finite difference operator — the analogue of the derivative for sequences. I've written a simple script to do this, which you can try out below:

<div align="left">
    <h4>Sequence: </h4>
    <input type="text" id="seqInput" value="1, 4, 3, 4" style="border-radius: 6px; border: 1px solid #ccc; padding: 6px 10px; font-size: 1em;">
    <h4>Closed Form:</h4>
    <p id="result"></p>
</div>

<script>
function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

function expandFallingEx(n) {
  let terms = [1];

  for (let i = 0; i < n; i++) {
    const newTerms = Array(terms.length + 1).fill(0);
    for (let j = 0; j < terms.length; j++) {
      newTerms[j] -= terms[j] * i;
      newTerms[j + 1] += terms[j];
    }
    terms = newTerms;
  }

  return terms;
}


function formulaSimplified(seq) {
  let tempSeq = [...seq];
  const deltasList = [tempSeq[0]];

  while (!diff(tempSeq).every(v => v === 0) && diff(tempSeq).length > 0) {
    tempSeq = diff(tempSeq);
    deltasList.push(tempSeq[0]);
  }

  let poly = [];

  let initialCoefficient = 0;
  for (let i = deltasList.length - 1; i >= 0; i--) {
    initialCoefficient = deltasList[i] - initialCoefficient;
    const coeff = initialCoefficient / factorial(i);
    const falling = expandFallingEx(i);
    for (let p = 0; p < falling.length; p++) {
      poly[p] = (poly[p] || 0) + coeff * falling[p];
    }
  }

  const terms = [];
  for (let i = poly.length - 1; i >= 0; i--) {
    const c = poly[i];
    if (Math.abs(c) < 1e-10) continue;
    const formatted = 
      (c === 1 && i !== 0 ? '' : c === -1 && i !== 0 ? '-' : c.toFixed(6).replace(/\.?0+$/, '')) + 
      (i === 0 ? '' : i === 1 ? 'x' : `x^${i}`);
    terms.push(formatted);
  }

  return terms.join(' + ').replace(/\+\s-\s/g, '- ');
}

function diff(sequence, n = 1) {
  let result = sequence.slice();
  for (let k = 0; k < n; k++) {
    result = result.slice(1).map((val, i) => val - result[i]);
  }
  return result;
}

// const seq = [20, -10, -20];
// console.log(formulaSimplified(seq));
const input = document.getElementById("seqInput").value;
const seq = input.split(",").map(Number);
const result = formulaSimplified(seq);
document.getElementById("result").innerText = result;
document.getElementById("seqInput").addEventListener("input", function() {
    const input = document.getElementById("seqInput").value;
    const seq = input.split(",").map(Number);
    const result = formulaSimplified(seq);
    document.getElementById("result").innerText = result;
});

</script>

You can check the math by copying your closed form into $f(x)$ in this [desmos graph](https://www.desmos.com/calculator/vtcrpcqgxc):
<div align="center">

<iframe src="https://www.desmos.com/calculator/vtcrpcqgxc" width="100%" height="500" frameborder="0"></iframe>

</div>

<!-- The finite difference operator is defined as:
$$
\Delta f(x) = f(x + 1) - f(x)
$$
This operator is used to find the difference between consecutive terms in a sequence. For example, if we have a sequence $1, 4, 3, 4$, we can find the first difference:
$$
\Delta f(x) = f(x + 1) - f(x) = (4 - 1, 3 - 4, 4 - 3) = (3, -1, 1)
$$
You can also continue to find the second difference:
$$
\Delta^2 f(x) = \Delta f(x + 1) - \Delta f(x) = (-1 - 3, 1 - (-1)) = (-4, 2)
$$ -->

You can learn more about umbral calculus from [Vinton's Umbral Calculus Notes](./../Vintons_Umbral_Calculus_Notes.pdf)