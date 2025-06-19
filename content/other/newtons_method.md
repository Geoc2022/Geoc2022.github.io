+++
date = '2021-09-29T12:00:00-04:00'
draft = false
title = 'Newton-Raphson Method'

summary = "An interactive visualization of Newton's method for finding roots of equations"
description = "Explore how Newton's iterative method converges to square roots using tangent lines. A Desmos graph illustrates the process dynamically."
readTime = false
autonumber = false
math = true
hideBackToTop = false
tags = ["math", "desmos", "numerical methods", "newton-raphson"]
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++

<div align="center">
<iframe src="https://www.desmos.com/calculator/nvlqlsn7nf" width="100%" height="500" frameborder=0></iframe>
</div>

The [**Newton-Raphson method**](https://en.wikipedia.org/wiki/Newton%27s_method) is a technique for approximating the roots (or zeros) of a function. It uses **tangent lines** to iteratively home in on a solution.

Given a function $f(x)$, the method starts at an initial guess $x_0$, and then refines it using the formula:

$$
x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}
$$

In this graph, the goal is to find $\sqrt{a}$, which is the inverse of the function $f(x) = x^2$. So we're solving:

$$
x^2 = a \quad \text{or} \quad f(x) = x^2 - a = 0
$$

Each step draws a **tangent line** at the current point $x_n$, and uses its intersection with the x-axis to find the next guess $x_{n+1}$.

It’s surprisingly efficient — and can take a decent guess to a great guess.

---

### Learn More

The method in reverse can find the square of a number and is used in squaring tricks:

<div align="center">
<iframe width="100%" height="400" src="https://www.youtube.com/embed/4NoiIcmuiWw?si=wXyA47coVW11M2r_" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

---

This algorithm is also part of the Quake III game's [Inverse Square Root function](https://youtu.be/p8u_k2LIZyo).