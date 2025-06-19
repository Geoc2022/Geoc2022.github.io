+++
date = '2022-05-15T12:00:00-04:00'
draft = false
title = 'Möbius Transformations'

summary = "See how Möbius transformations map the complex plane"
description = "See how Möbius transformations map the complex plane"
readTime = false
autonumber = false
math = true
hideBackToTop = false
tags = ["math", "desmos", "complex analysis", "mobius"]
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++

<div align="center">
<iframe src="https://www.desmos.com/calculator/bce4gmcz5j?embed" width="100%" height="500" frameborder="0"></iframe>
</div>

A **Möbius transformation** is a special kind of complex function defined by:

$$
f(z) = \frac{a z + b}{c z + d}
$$

where $a, b, c, d \in \mathbb{C}$ and <span class="annotation__text" data-annotation="This condition ensures that the function is invertible and does not collapse the entire complex plane to a point.">$ad - bc \neq 0$</span>.

These transformations are the **building blocks of complex geometry**. They map lines and circles to other lines and circles, and they **preserve angles** (i.e., they’re *conformal*), but they can distort distances and shapes. They basically represent the composition of translations, similarities, orthogonal transformations, and inversions all in one formula.

In the Desmos graph above, each of the values $a, b, c, d$ is a complex number, adjustable with the point sliders (each point is a complex number). You can observe how changing them warps the complex grid.

### Key Properties of Möbius Transformations:
- They form a group under composition.
- They send circles and lines to other circles and lines.
- If $c \neq 0$, the function has a **pole** at $z = -\frac{d}{c}$.
- They can represent **inversions**, **rotations**, **translations**, and **scaling** — all in one expression.

For a deeper dive, check out the [Wikipedia article on Möbius transformations](https://en.wikipedia.org/wiki/Möbius_transformation) and try composing a few of them using different coefficients in the Desmos graph!