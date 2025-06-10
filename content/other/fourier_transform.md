+++
title = "Desmos Fourier Transform Visualization "
date = "2022-01-10"
draft = false

summary = "3b1b's Fourier Transform visualization on Desmos"
description = "3b1b's Fourier Transform visualization on Desmos"
readTime = false
autonumber = false
math = true
tags = ["math", "desmos"]
showTags = false
hideBackToTop = false
fediverse = "@geoc@mathstodon.xyz"
+++
<div align="center">

<iframe src="https://www.desmos.com/calculator/lujhlxwdhg?embed" width="100%" height="500" frameborder="0"></iframe>

</div>
$\cos\left(3x\right)+\cos\left(7x\right)$ wrapped around a circle

This Desmos implementation offers a hands-on visual of 3Blue1Brown’s video on the [Fourier Transform](https://youtu.be/spUNpyF58BY?t=153).

You start with a periodic signal, for example:

$$
f(x) = \cos(3x) + \cos(7x)
$$

This function contains two frequencies, 3 and 7. The goal is to uncover those frequencies by transforming the function into a circular form and watching how it behaves as we vary the winding frequency.

---

### Wrapping the Graph Around a Circle

To “wrap” the function around a circle, you define a new function:

$$
r(\theta) = f(q\theta)
$$

This maps the height of the function to the radius at each angle $\theta$, where $q$ controls how tightly the function is wound around the circle. As $\theta$ goes from 0 to some maximum value $a$, the function spirals around the origin, with peaks and valleys of the signal pushing the spiral outward and inward.

---

### Measuring the Center of Mass

Once the function is wrapped, you can calculate its center of mass:

$$
\left( \frac{1}{a} \int_0^a r(p)\cos(p)\,dp,\ \frac{1}{a} \int_0^a r(p)\sin(p)\,dp \right)
$$

This gives you the average position of all those radial values on the circle. If the original signal has no structure that aligns with the winding frequency, the center of mass stays close to the origin. But if the winding frequency matches a component of the signal (e.g. 3 or 7) then the high values of the signal tend to align in the same direction, and the center of mass pulls away from the center.

---

### Detecting Frequencies

To capture how the center of mass moves as the winding frequency changes, the graph tracks the real part of the center of mass against $q$:

$$
\left( q,\ \frac{2}{a} \int_0^a r(p)\cos(p)\,dp \right)
$$

When $q$ matches the inverse of a frequency in the original signal, there’s a clear spike. This provides a clean visual cue for frequency detection: the further the center of mass moves from the origin, the stronger that frequency component is in the signal.

---

### Why It Works

This approach makes the Fourier Transform intuitive. Rather than dealing with abstract formulas, you’re visualizing how different frequencies “pull” on the graph when it's wrapped around a circle. When everything aligns, it shows up clearly. When it doesn’t, the signal averages out.
