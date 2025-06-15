+++
date = '2025-06-14T22:08:59-04:00'
draft = false
title = 'Animation'

summary = "Hover over the letters to see the animation!"
description = "Hover over the letters to see the animation!"
readTime = false
autonumber = false
math = false
hideBackToTop = false
tags = []
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++

Click the letters if on mobile - best viewed on desktop!

<span class="annotation__text annotation__responsive" data-annotation=
"░░░░░░░░░░
░░<(.)___░░░░
▓▓▓(___)▓▓▓▓
" data-annotation-mobile="
<br>░░░░░░░░░░ <br>
░░<(.)___░░░░ <br>
▓▓▓(___)▓▓▓▓
" data-annotation-accent="#e7c664" data-annotation-accent-solid="#76cce0">░Q░</span>
<span class="annotation__text annotation__responsive" data-annotation=
"░░░░░░░░░░
░░=(.)___░░░░
▓▓▓(___)▓▓▓▓
" data-annotation-mobile="
<br>░░░░░░░░░░ <br>
░░=(.)___░░░░ <br>
▓▓▓(___)▓▓▓▓
" data-annotation-accent="#e7c664" data-annotation-accent-solid="#76cce0">░U░</span>
<span class="annotation__text annotation__responsive" data-annotation=
"░░░░░░░░░░
░░>(.)___░░░░
▓▓▓(___)▓▓▓▓
" data-annotation-mobile="
<br>░░░░░░░░░░ <br>
░░>(.)___░░░░ <br>
▓▓▓(___)▓▓▓▓
" data-annotation-accent="#e7c664" data-annotation-accent-solid="#76cce0">░A░</span>
<span class="annotation__text annotation__responsive" data-annotation=
"░░░░░░░░░░
░░=(.)___░░░░
▓▓▓(___)▓▓▓▓
" data-annotation-mobile="
<br>░░░░░░░░░░ <br>
░░=(.)___░░░░ <br>
▓▓▓(___)▓▓▓▓
" data-annotation-accent="#e7c664" data-annotation-accent-solid="#76cce0">░C░</span>
<span class="annotation__text annotation__responsive" data-annotation=
"░░░░░░░░░░
░░<(.)___░░░░
▓▓▓(___)▓▓▓▓
" data-annotation-mobile="
<br>░░░░░░░░░░ <br>
░░<(.)___░░░░ <br>
▓▓▓(___)▓▓▓▓
" data-annotation-accent="#e7c664" data-annotation-accent-solid="#76cce0">░K░</span>

<script>
document.querySelectorAll('.annotation__responsive').forEach(function(el) {
    function updateAnnotation() {
        if (window.innerWidth <= 500) {
            el.setAttribute('data-annotation', el.getAttribute('data-annotation-mobile'));
        } else {
            el.setAttribute('data-annotation', el.getAttribute('data-annotation').replace(/<br>/g, '').replace(/\s+/g, '\n'));
        }
    }
    window.addEventListener('resize', updateAnnotation);
    updateAnnotation();
});
</script>
