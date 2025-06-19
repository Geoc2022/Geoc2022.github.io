+++
date = '2023-05-20T12:00:00-04:00'
draft = false
title = 'Visualizing the Complex Plane'

summary = "Explore how complex functions transform the plane using Desmos"
description = "Explore how complex functions transform the plane using Desmos"
readTime = false
autonumber = false
math = true
hideBackToTop = false
tags = ["math", "desmos", "complex analysis", "complex numbers"]
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++

<div align="center">
<iframe src="https://www.desmos.com/calculator/x3li50ozlc?embed" width="100%" height="500" frameborder="0"></iframe>
</div>

Desmos now supports [built-in complex number functions](https://help.desmos.com/hc/en-us/articles/31103542590733-Complex-Numbers), making it easier to visualize how functions transform the complex plane.

The example above shows the function:

$$
f(z) = z^{t}
$$

applied to a grid in the complex plane. You can see how the structure of the plane is **warped** by the function — lines become curves, but angles are preserved, which is a key property of [conformal mappings](https://en.wikipedia.org/wiki/Conformal_map).

Functions like $z^n$ (where $n$ is a real or complex exponent) exhibit interesting behavior due to **branch points** and **multi-valuedness**. For instance, fractional powers like $z^{4/3}$ introduce multiple “sheets” — each corresponding to a different branch of the complex logarithm.

The Desmos calculator contains many custom-defined complex functions in this graph — but thanks to recent updates, most of these can now be replaced with Desmos' native complex operations.
