+++
date = '2021-07-30T12:23:57-04:00'
draft = false
title = 'Desmos Mandelbrot Set'

summary = "A couple ways to create the Mandelbrot set in Desmos"
description = "A couple ways to create the Mandelbrot set in Desmos"
readTime = false
autonumber = false
math = true
hideBackToTop = false
tags = ["math", "desmos", "mandelbrot"]
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++

<div align="center">
    
<iframe src="https://www.desmos.com/calculator/dxeerl4ekb?embed" width="100%" height="500" frameborder="0"></iframe>

</div>

The [Mandelbrot set](https://en.wikipedia.org/wiki/Mandelbrot_set) is a set of complex numbers defined by the equation:
$$
z_{n+1} = z_n^2 + c
$$
where $z$ is a complex number and $c$ is a constant complex number. The set is defined as the set of all complex numbers $c$ for which the sequence does not <span class="annotation__text" data-annotation="Once z_n exceeds a magnitude of 2, we can assume that the sequence will diverge, and we can stop iterating.">diverge</span> when starting with $z_0 = 0$.

<!-- The Julia set is defined similarly, but instead of varying $c$, we vary $z$ and keep $c$ constant. The Julia set is defined as the set of all complex numbers $z$ for which the sequence does not diverge when starting with a fixed complex number $c$. -->

When I first implemented the Mandelbrot set in Desmos, we didn't have recursion or actions available, so I had to use a workaround with just repeating the same function over and over again. This is pretty inefficient (the window below might take awhile to load), but it works. 

<div align="center">

<iframe src="https://www.desmos.com/calculator/na1pznblis?embed" width="100%" height="500" frameborder="0"></iframe>

</div>

<div align="center">

<iframe src="https://www.desmos.com/calculator/4mvtsufit0?embed" width="100%" height="500" frameborder="0"></iframe>

</div>

A grid using [Vogel's model](https://en.wikipedia.org/wiki/Fibonacci_sequence#Nature) can cram more points into the same space, allowing for a more detailed view of the Mandelbrot set. This is why sunflowers and pinecones have that spiral pattern, as it allows for the most efficient packing of seeds or scales.


Then actions got added to Desmos, which allowed us to do recursion by adding steps to the function. Here you could choose how many iterations you wanted to run, but it was still pretty slow for large numbers of iterations.

<div align="center">

<iframe src="https://www.desmos.com/calculator/gbhdi4isi6" width="100%" height="500" frameborder="0"></iframe>

</div>


Finally, we got recursion, which allows us to create the Mandelbrot set in a much more efficient way. This is the current implementation, which is much faster, loading quite a bit faster than the previous ones.


<div align="center">

<iframe src="https://www.desmos.com/calculator/ytfl6giwz1" width="100%" height="500" frameborder="0"></iframe>

</div>