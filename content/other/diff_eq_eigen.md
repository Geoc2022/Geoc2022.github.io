+++
date = '2023-02-27T12:00:00-04:00'
draft = false
title = 'Differential Equations and Eigenvalues'

summary = "Explore how the eigenvalues of a matrix determine the behavior of differential equations"
description = "A visual introduction to the differential equation x' = Ax, showing how the nature of the matrix A — specifically its eigenvalues — shapes the solution."
readTime = false
autonumber = false
math = true
hideBackToTop = false
tags = ["math", "desmos", "differential equations", "eigenvalues", "linear algebra"]
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++

Differential equations describe how systems evolve over time. One of the most basic examples is:

$$
x'(t) = a x(t)
$$

where $a$ is a constant. The solution is:

$$
x(t) = x_0 e^{a t}
$$

This models exponential growth or decay, depending on the sign of $a$.

A natural generalization is when $x(t)$ is a **vector**, and $a$ is replaced by a **matrix** $A$:

$$
\mathbf{x}'(t) = A \mathbf{x}(t)
$$

$$
\mathbf{x}(t) = \mathbf{x}(0) e^{A t} 
$$

The solution has an [exponential nature](https://youtu.be/O85OWBJ2ayo), depending on the **eigenvalues** and **eigenvectors** of $A$. The following Desmos graphs illustrate the two main cases: real eigenvalues and imaginary eigenvalues, with the points representing the columns of the matrix $A$.

---

### Real Eigenvalues

<div align="center">
<iframe src="https://www.desmos.com/calculator/t0d68x9dpf?embed" width="100%" height="500" frameborder="0"></iframe>
</div>

When $A$ has **real eigenvalues**, the trajectories follow **straight or curved paths** that either move directly toward or away from the origin. The eigenvectors determine the primary axes of motion, and the eigenvalues dictate how quickly solutions grow or shrink along those directions.

For example, if the eigenvalues are both positive, all solutions move outward; if both are negative, all trajectories spiral inward.

---

### Imaginary Eigenvalues

<div align="center">
<iframe src="https://www.desmos.com/calculator/nrbxatbwlk?embed" width="100%" height="500" frameborder="0"></iframe>
</div>

If $A$ has **purely imaginary eigenvalues**, the system behaves like a **rotation**. The solutions trace out ellipses around the origin. This shows up in systems like springs, pendulums, or electrical circuits.

These visuals help connect abstract linear algebra concepts with concrete motion — and show how eigenvalues are again the coolest part of linear algebra.