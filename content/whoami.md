+++
date = '2025-05-19T01:22:38-04:00'
aliases = ['/pages/about_contact.html', '/pages/about_contact']
draft = false
title = 'whoami'
+++

My interests currently center on cryptography, machine learning, and formal proof verification. Some of my recent projects include implementing a [cryptographic voting protocol](../projects/vote), developing methods for [robust estimation in adversarial graph models](../projects/robust-estimation-for-the-erdos-renyi-model), and creating a [Abstract Algebra Lean game](https://github.com/Geoc2022/AlgebraGame).

<span class="annotation__text" data-annotation="Or maybe it is related - I find a lot of people who like math also like this stuff too. It makes sense why they might like board games, but playing music feels a little ironic for STEM people.">Unrelated</span>, I'm a big fan of board games, photography, and music. 

<span class="annotation__text" data-annotation="References: Riley Hartman and Mitchell Perales" data-annotation-accent="#00000000">
<span style="color: var(--bg0)">░░</span></span>

<script>
const text = "whoami";
let i = 0;
const el = document.getElementsByClassName("single-title")[0];
function type() {
    if (i <= text.length) {
        el.textContent = text.slice(0, i) + (i < text.length ? "_" : "");
        i++;
        setTimeout(type, 150);
    }
}
if (el) type();
</script>

