+++
date = '2025-04-20T23:34:21-04:00'
draft = false
title = 'Interactive Proofs of Intro Euclidian Geometry'

summary = "Some Euclidean constructions from Euclid's Elements"
description = "Some Euclidean constructions from Euclid's Elements"
readTime = false
autonumber = false
math = true
hideBackToTop = false
tags = ["geometry", "euclid", "ruler and compass", "desmos"] 
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++

The following is a collection of problems from [Hartshorne's](https://en.wikipedia.org/wiki/Robin_Hartshorne) *[Geometry: Euclid and Beyond](https://david92jackson.neocities.org/images/Euclid_and_Beyond-Hartshorne.pdf)* that involve ruler and compass constructions. The problems are based on Books [I](https://www.c82.net/euclid/book1), [III](https://www.c82.net/euclid/book3), and [IV](https://www.c82.net/euclid/book4) of Euclid's *[Elements](https://www.c82.net/euclid/)*. Each problem has a specified number of steps (denoted as *par*) that is the minimum number of steps required to complete the construction. Each of the proofs uses the optimal par.

### Counting Steps

#### What is counted as a step:
- Using the ruler to **draw a new line** through two distinct points (given or previously constructed)
- Using the ruler to **extend a given or previously constructed line** in either direction
- Using the compass to **draw a new circle** with center at a given or constructed point and radius equal to the distance between two given or constructed points

#### What is not counted as a step:
- **Extending** lines that are already given or constructed
- **Choosing points at random** or subject to conditions, such as lying on a given line or circle
- **Obtaining new points** as intersections of lines and circles - these points are considered constructed automatically

> The ruler may not be used to measure distances or have any markings (it is a straightedge only).

---

### 2.1 Given an angle, construct the angle bisector  
*par = 4*

<div align="center">
<iframe src="https://www.desmos.com/geometry/qd6m2qblam?embed" width="100%" height="500" frameborder="0"></iframe>
</div>

---

### 2.2 Given a line segment, find the midpoint of that segment  
*par = 3*

<div align="center">
<iframe src="https://www.desmos.com/geometry/9abg68dhwy?embed" width="100%" height="500" frameborder="0"></iframe>
</div>

---

### 2.3 Given a line $l$ and a point $A$ on $l$, construct a line perpendicular to $l$ through $A$  
*par = 4, possible in 3*

<div align="center">
<iframe src="https://www.desmos.com/geometry/sz4jwiwspx?embed" width="100%" height="500" frameborder="0"></iframe>
</div>

---

### 2.4 Given a line $l$ and a point $A$ not on $l$, construct a line perpendicular to $l$ passing through $A$  
*par = 4, possible in 3*

<div align="center">
<iframe src="https://www.desmos.com/geometry/akrgqzhqa2?embed" width="100%" height="500" frameborder="0"></iframe>
</div>

---

### 2.5 Given an angle at a point $A$, and given a ray emanating from a point $B$, construct an angle at $B$ equal to the angle at $A$  
*par = 4*

<div align="center">
<iframe src="https://www.desmos.com/geometry/bdywzli0ys?embed" width="100%" height="500" frameborder="0"></iframe>
</div>

---

### 2.6 Given a line $l$ and a point $A$ not on $l$, construct a line parallel to $l$ passing through $A$  
*par = 3*

<div align="center">
<iframe src="https://www.desmos.com/geometry/e2urdltkcw?embed" width="100%" height="500" frameborder="0"></iframe>
</div>

---

### 2.7 Given the circumference of a circle, find the center of the circle  
*par = 5*

<div align="center">
<iframe src="https://www.desmos.com/geometry/pc9rhqeutx?embed" width="100%" height="500" frameborder="0"></iframe>
</div>

---

### 2.8 Given a circle with center $O$, and a point $A$ outside the circle, construct a line through $A$ tangent to the circle.  
*par = 6*  
> Warning: You may not slide the ruler until it seems to be tangent to the circle. You must construct another point on the desired tangent line before drawing the tangent.

<div align="center">
<iframe src="https://www.desmos.com/geometry/wkjzh2tbnp?embed" width="100%" height="500" frameborder="0"></iframe>
</div>

---

### 2.9 Construct a circle inscribed in a given triangle $ABC$  
*par = 13*

<div align="center">
<iframe src="https://www.desmos.com/geometry/lxz6gmgwmf?embed" width="100%" height="500" frameborder="0"></iframe>
</div>

---

### 2.10 Construct a circle circumscribed about a given triangle $ABC$  
*par = 7*

<div align="center">
<iframe src="https://www.desmos.com/geometry/parkxjv2ob?embed" width="100%" height="500" frameborder="0"></iframe>
</div>

---

### 2.11 Given a line $l$, a line segment $d$, and a point $O$, construct a circle with center $O$ that cuts off a segment congruent to $d$ on the line $l$  
*par = 9*

<div align="center">
<iframe src="https://www.desmos.com/geometry/oyjuobjw14?embed" width="100%" height="500" frameborder="0"></iframe>
</div>

---

### 2.12 Given a point $A$, a line $l$, and a point $B$ on $l$, construct a circle that passes through $A$ and is tangent to the line at $B$  
*par = 8*

<div align="center">
<iframe src="https://www.desmos.com/geometry/szdklbj32v?embed" width="100%" height="500" frameborder="0"></iframe>
</div>

---

### 2.13 Construct three circles, each one meeting the other two at right angles.  
*par = 11*  
> We say that two circles meet at right angles if the radii of the two circles to a point of intersection make right angles.

<div align="center">
<iframe src="https://www.desmos.com/geometry/clmxsib0tl?embed" width="100%" height="500" frameborder="0"></iframe>
</div>