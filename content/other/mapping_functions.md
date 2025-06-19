+++
date = '2021-06-30T12:00:00-04:00'
draft = false
title = 'Mapping Functions Visual'

summary = "Visualizing how a function maps points on the number line and its fixed points"
description = "Visualizing how a function maps points on the number line and its fixed points"
readTime = false
autonumber = false
math = true
hideBackToTop = false
tags = ["math", "desmos", "functions", "fixed points"]
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++

<div align="center">
<iframe src="https://www.desmos.com/calculator/t2svyb4dlz?embed" width="100%" height="500" frameborder="0"></iframe>
</div>

This visualization shows how the number line (in **red**) is mapped by the function

$$
f(x) = 1 + \frac{1}{x}
$$

to produce the points shown in **green**.

The **orange lines** indicate the *fixed points* of $f$, which satisfy

$$
x = f(x).
$$

We can find these fixed points by solving the equation:

$$
x = 1 + \frac{1}{x}
$$

Rearranging,

$$
x - 1 - \frac{1}{x} = 0
$$

Multiplying both sides by $x$ to clear the denominator:

$$
x^2 - x - 1 = 0
$$

The solutions to this quadratic are the fixed points of the function. Fixed points are where applying the function $f$ does not change the point, i.e., $x = f(x)$. In this case, the fixed points are the golden ratio and its conjugate.