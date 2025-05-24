+++
title = "Visualizing Spectral Graph Theory"
date = "2024-10-21"
draft = false

summary = "A Manim project explaining spectral graph theory"
description = "A Manim project explaining spectral graph theory"
readTime = false
autonumber = false
math = true
tags = ["math", "manim", "graph-theory", "linear-algebra", "video", "spectral-graph-theory", "csci2952q"]
showTags = false
hideBackToTop = false
fediverse = "@geoc@mathstodon.xyz"
+++

As part of the graduate course [**CSCI 2952Q: Robust Algorithms for Machine Learning at Brown**](https://cs.brown.edu/people/ycheng79/csci2952qf24.html), we created a video presentation that dives into some of the key ideas from Daniel A. Spielman’s [*Spectral and Algebraic Graph Theory*](http://cs-www.cs.yale.edu/homes/spielman/sagt/sagt.pdf). The project focused on making abstract mathematical concepts more intuitive through visuals and animations with [Manim](https://www.manim.community/).

<iframe width="100%" height="400" src="https://www.youtube-nocookie.com/embed/DQVuFo6CSmE?si=XMAnLBucuSkY8-kn" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Even though graph theory is already pretty visual by nature, linear algebra turns out to be unusually effective at talking about it—especially when we start looking at **eigenvalues** and **eigenvectors**, the *spectrum* of a graph. Spectral graph theory turns out to reveal deep insights about how graphs behave using these linear algebra tools. 

The presentation starts with some of the basic tools we need to talk about spectra: the **Rayleigh quotient**, and one of the most beautiful results in linear algebra, the **spectral theorem**. From there, we move into the world of **graph Laplacians**, which give us a new way to study graphs using their eigenvalues. For example, we show how you can tell whether a graph is connected just by looking at its smallest nonzero eigenvalue.

After that, we explore some higher-level ideas like the **isoperimetric ratio** and **conductance**, which are key to problems in **graph partitioning**—an area where spectral methods really shine. We wrap things up with a short look at how spectral graph theory developed and some of the ways it’s used today, from machine learning to network analysis.

The full source code of the animations is available on [GitHub](https://github.com/AzureCoral/spectral-graph-theory). While a few of the more experimental 3D animations didn’t make it into the final cut, the code is there if you’re curious to explore more.

[![GitHub](https://img.shields.io/badge/GitHub-%23121011.svg?logo=github&logoColor=white)](https://github.com/AzureCoral/spectral-graph-theory)