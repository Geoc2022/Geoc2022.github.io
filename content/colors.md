+++
date = '2025-05-24T21:15:21-04:00'
draft = false
title = 'Colors'

summary = "Color tools"
description = "Color tools"
readTime = false
autonumber = false
math = false
hideBackToTop = false
tags = ["utils"]
showTags = true
fediverse = "@geoc@mathstodon.xyz"
+++

# Extract Colors from Text
<style>
    .color-box {
      display: inline-block;
      width: 75px;
      height: 75px;
      margin: 5px;
      cursor: pointer;
      border: 0px solid #ccc;
      box-shadow: 0 0 4px rgba(0,0,0,0.2);
    }
</style>

<textarea id="inputText" rows="5" cols=25% style="border-radius: 6px; border: 1px solid #ccc; padding: 6px 10px; font-size: 1em; color: var(--fg); width: auto;">
#181819 #222327 #2C2E34 #33353F #363944 #3B3E48 #414550 #595F6F #FC5D7C #F39660 #E7C664 #9EDO72 #76CCE0 #B39DF3 #E2E2E3 #7F8490 #FF6077 #55393D #394634 #A7DF78 #85D3F2 #354157 #4E432F
</textarea>
<br>
<div id="colorContainer"></div>
<p>
    <span id="colorCount"></span>
</p>

<script>
function extractColors() {
    const text = document.getElementById("inputText").value;
    const container = document.getElementById("colorContainer");
    container.innerHTML = "";

    const regexes = {
    hex: /#(?:[0-9a-fA-F]{3}){1,2}/g,
    rgb: /rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g,
    hsl: /hsl\(\s*\d+\s*,\s*\d+%?\s*,\s*\d+%?\s*\)/g
    };

    let matches = [];
    for (let type in regexes) {
    const found = text.match(regexes[type]);
    if (found) matches = matches.concat(found);
    }

    const toHex = (color) => {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = color;
    return ctx.fillStyle;
    };

    const uniqueColors = [...new Set(matches)];

    uniqueColors.forEach(color => {
    const hex = toHex(color);
    const box = document.createElement("div");
    box.className = "color-box";
    box.style.backgroundColor = hex;
    box.title = hex;
    box.onclick = () => {
        navigator.clipboard.writeText(hex);
    };
    container.appendChild(box);
    });

    const count = uniqueColors.length;
    document.getElementById("colorCount").innerText = '# of colors: ' + count;
    // return count;
}

extractColors();
document.getElementById("inputText").addEventListener("input", function() {
    extractColors();
});


</script>