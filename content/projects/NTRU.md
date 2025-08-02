+++
title = "The NTRU Cryptographic System"
date = "2024-05-11"
draft = false

summary = "Overview of the NTRU cryptographic system"
description = "Overview of the NTRU cryptographic system"
readTime = false
autonumber = false
math = true
tags = ["cryptography", "NTRU", "lattice-based cryptography"]
showTags = false
hideBackToTop = false
fediverse = "@geoc@mathstodon.xyz"
+++


<style>
:root {
  --nord-d0: #2E3440;
  --nord-d1: #3B4252;
  --nord-d2: #434C5E;
  --nord-d3: #4C566A;

  --nord-w0: #D8DEE9;
  --nord-w1: #E5E9F0;
  --nord-w2: #ECEFF4;

  --nord-bggg: #8FBCBB;
  --nord-bgg:  #88C0D0;
  --nord-bg:   #81A1C1;
  --nord-bbg:  #5E81AC;

  --nord-red:    #BF616A;
  --nord-orange: #D08770;
  --nord-yellow: #EBCB8B;
  --nord-green:  #A3BE8C;
  --nord-purple: #B48EAD;
}

.theorem-box,
.maintheorem-box,
.lemma-box,
.prop-box,
.definition-box,
.example-box,
.proof-box {
  --accent: var(--nord-red);
  background-color: color-mix(in srgb, var(--accent) 10%, rgba(0, 0, 0, 0));
  border-left: 4px solid var(--accent);
  margin: 1em 0;
  padding: 0.75em 1em 0.75em 1.2em;
  position: relative;
}

.definition-box { --accent: var(--nord-bggg); }
.example-box    { --accent: var(--nord-bg); }
.lemma-box    { --accent: var(--nord-yellow); }
.prop-box    { --accent: var(--nord-orange); }
.maintheorem-box { --accent: var(--nord-purple); }

.theorem-box,
.maintheorem-box,
.lemma-box,
.proof-box      {
    margin: 0em 0;
}
.proof-box      {
    background-color: rgba(0, 0, 0, 0);
}

.theorem-box::before,
.maintheorem-box::before,
.lemma-box::before,
.prop-box::before,
.definition-box::before,
.example-box::before,
.proof-box::before {
  content: attr(data-title);
  font-weight: bold;
  display: block;
  margin-bottom: 0.25em;
  color: var(--accent);
}

.maintheorem-box::before {
    content: "Main Theorem"
}

.theorem-box[data-label]::before,
.lemma-box[data-label]::before,
.prop-box[data-label]::before,
.definition-box[data-label]::before,
.example-box[data-label]::before,
.proof-box[data-label]::before {
  content: attr(data-title) " (" attr(data-label) ")";
}

.maintheorem-box[data-label]::before {
  content: "Main Theorem (" attr(data-label) ")";
}

.proof-box::after {
    content: "■"
}

sup { vertical-align: top; position: relative; top: -0.4em; font-size: .6em; }
</style>

For my Cryptography class I did my final paper and on the NTRU Cryptography System, a crypto system created by professors at Brown. Here's the paper remade for the web using this $\LaTeX$ to markdown/html [converter](./../../library/converter.py).

> NTRU is a lattice-based cryptosystem that is efficient and is currently secure against quantum attacks. In this paper, we give an overview of the NTRU cryptosystem, comparing it to other cryptosystems we've discussed in class, discussing its efficiency and quantum resistance, and giving a basic overview of the algebraic perspective of NTRU. 

## Comparison with Previous Methods

Most of the cryptosystems we've discussed in class have involved problems in groups. For example, we've seen Elgamal PKC that is based on the discrete logarithm problem for $R^{\ast}_p$, but the construction works generally using the DLP in any group including elliptic curves, that also form a group under addition [^1]. 


As an extension of a monoid, groups are algebraic structures that have one operation; therefore, these group based cryptosystems are based on the hardness of one operation, such as multiplication modulo $m$ in RSA, or elliptic curve addition in ECC. 


However, the NTRU cryptosystem lives in the realm of rings, which are algebraic structures that have two operations, addition and multiplication, which are connected via the distributive law [^1]. Specifically, NTRU operates in the ring $R = (Z_n, +, \star)$, where $\star$ is cyclic convolution [^2]. Interestingly, it has an alternate perspective in lattices and is based on the Shortest Vector Problem (SVP) or Closest Vector Problem (CVP) in a lattice [^1].



## Background


### Motivation for NTRU


#### Efficiency

Compared to the cryptosystems we've discussed in class, NTRU has a clear efficiency advantage with faster encryption/decryption and parallelization [^1]. Lattice based cryptosystems are generally between 1 and 2 orders of magnitude faster than RSA or ECC systems at equivalent security levels [^3]. The main operation used in NTRU is the convolution, which is simpler than the modular exponentiation used in RSA and repeated squaring/doubling used in ECC [^4]. Not only does this mean that NTRU is suitable for machines with limited computing power, but it also allows for parallelization, which means that we can split the operations between multiple processors to improve speed [^4]. Furthermore, NTRU also has a lower time complexity of $O(N^2)$ ($O(N \log N)$ with the Fast Fourier Transform) compared to RSA's $O(N^3)$ [^4]. However, these speed differences have become less relevant as machines have gotten faster and NTRU's resilience to quantum attacks has become more important [^3].



#### Quantum Resistance

Classical computers are constrained by the resources of time and space. Typically, these two resources are at odds with each other (e.g., using more memory can lead to faster computation through techniques like caching). However, quantum computers have an additional resource of precision which allows them another avenue of decreasing time-complexity [^5]. Quantum computers get this extra resource by using quantum states of objects (e.g., atoms, photons, or nuclear spins) which do not have the binary classification of 0 or 1, but can exist in a superposition of states. This superposition is the decrease of precision that allows quantum computers to simulate the behavior of multiple states at once. Of course, this when the superposition is measured, the quantum state collapses to a single state, but by using clever tricks we can select the information we want at the expense of losing erroneous information [^5].


Using classical mechanics, the best factoring algorithm asymptotically is the general number field sieve (GNFS) [^6]. However, Peter Shor showed that a quantum computer could factor numbers in polynomial time, surpassing the GNFS [^5]. 


The main idea behind Shor's algorithm is to use quantum Fourier transform, a quantum version of the Fast Fourier Transform, in order to study of the order of elements in a group [^1]. This is the trick that allows Shor's algorithm to force the quantum superposition to collapse to a state that reveals the factors of a number at the cost of precision with knowing about all the trials. 


Using this process, Shor is easily able to find a solution $r$ to this problem:

$$
x^r \equiv 1 \mod n
$$

where $r$ is the order of $x$ modulo $n$. 

This is a key step to factor numbers since if $x$ is chosen randomly and has an even order $r$, then $\gcd(x^{r/2} - 1, n)$ is likely to be a nontrivial odd factor of $n$ [^1].


Furthermore, Shor also develops a way to find discrete logarithms in $F^\ast_p$ on a quantum computer with two modular exponentiations and two quantum Fourier transforms [^5].


So, Shor is also easily able to find a solution $x$ to this problem:

$$
g^x \equiv h \mod p
$$

where $x$ is the discrete logarithm of $h$ to the base $g$


And as we've seen in class, most of the cryptosystems we've discussed are based on the hardness of factorization or the discrete logarithm problem. The prime factorization algorithm breaks down RSA, the discrete logarithm algorithm breaks down Elgamal and the elliptic curve discrete logarithm problem breaks down ECC. Although a sufficiently large quantum computer has not been built yet, they have the potential to break these cryptosystems. However, is it still unknown how to solve the shortest or closest vector problems, the common basis for lattice-based cryptosystems, in polynomial time on a quantum computer [^1]. This means that lattice-based cryptosystems are currently secure even against the construction of a quantum computer. In particular, according to a survey of quantum resistant public key cryptography by the National Institute of Standards and Technology (NIST), "the NTRU family of cryptographic algorithms appears to be the most practical" [^7]. 



### Basic Definitions

<div class="definition-box" data-title="Definition">

Convolutional polynomial rings of rank $N$ are the quotient ring

$$R = \frac{\mathbb{Z}[x]}{(x^N-1)}$$ 

where the ring $\mathbb{Z}$ can be replaced with $\mathbb{Z}/p\mathbb{Z}$ [^1]

</div> 

<div class="example-box" data-title="Examples">
$$R=\frac{\mathbb{Z}[x]}{(x^N-1)},\quad R_p=\frac{(\mathbb{Z}/p\mathbb{Z})[x]}{(x^N-1)},\quad R_q=\frac{(\mathbb{Z}/q\mathbb{Z})[x]}{(x^N-1)}, $$
where $p$ and $q$ are prime numbers.
</div>

The majority of operations we will use are addition and multiplication modulo $x^N-1$ in $R$. Where elements of $R$ look like:

$$f(x)=f_0+f_1x+\cdots+f_{N-1}x^{N-1} \quad \text{where } f_i\in\mathbb{Z}.$$

Elements do not have degree greater than $N-1$ since we can deduce by a factor of $x^N-1$. Moreover, the other rings $R_p, R_q$ are similar to $R$ but with the additional constraint of $f_i$ from $\mathbb{Z}/p\mathbb{Z}$ or $\mathbb{Z}/q\mathbb{Z}$ respectively.


Addition in these rings is straightforward, we add the coefficients of the same degree term and reduce by modulo if needed.

$$
a_0 + \cdots + a_{N-1}x^{N-1} + b_0 + \cdots + b_{N-1}x^{N-1} = (a_0+b_0) + \cdots + (a_{N-1}+b_{N-1})x^{N-1} \\
$$
$$
\text{In vector form: }(a_0, \ldots, a_{N-1}) + (b_0, \ldots, b_{N-1}) = (a_0+b_0, \ldots, a_{N-1}+b_{N-1}) 
$$


However, multiplication is a bit more complicated. Note how the multiplication of two polynomials is like a convolution of the coefficients.


<div class="example-box" data-title="Example">

$$
(a_0 + a_1 x + a_2 x^2) (b_0 + b_1 x) = a_0b_0 + a_1b_0 x + a_2b_0 x^2 + a_0b_1 x + a_1b_1 x^2 + a_2b_1 x^3 
$$

Each of the terms can be grouped by their degree, reminiscent of how we group terms with the same magnitude in integer multiplication.


This association between convolution and multiplication led to the development of the fastest asymptotic algorithm for multiplication, which is based on the Fast Fourier Transform (FFT) which has a time complexity of $O(N \log N)$, faster that the traditional $O(N^2)$ method used in schoolbook multiplication. It gets its speed from the fact that the convolution of two polynomials is equivalent to the pointwise multiplication of their Fourier transforms in convolutional space.

</div>


After multiplying two polynomials, we need to reduce the polynomial by modulo $x^N-1$. This is because the coefficients of the polynomial can be greater than the modulus, and we need to reduce them to the appropriate range.


<div class="definition-box" data-title="Definition">

Ternary polynomials are polynomials with coefficients in $\{-1, 0, 1\}$. We will use the same convention in the book where $\mathcal{T}(d_1, d_2)$ is the set of ternary polynomials with $d_1$ coefficients of 1, $d_2$ coefficients of -1, and the rest are 0. [^1]

</div>



## NTRU Cryptosystem


### Ring-based Encryption


#### Public Parameter Creation

First we pick the public parameters $(N, p, q, d)$ we'll use for the encryption. Typically, $N$ is between $250$ and $2500$, $p$ is a prime number, and $q$ such that $\gcd(p, q) = \gcd(N, q) = 1, q > (6d + 1)p$. The parameter $d$ is typically around half of $N$ [^3] [^1].



<div class="prop-box" data-title="Key Creation">


- Choose a private polynomial $f \in \mathcal{T}(d+1, d)$ that is invertible in $R_q$ and $R_p$. We repeatedly generate a ternary polynomial $f$ until we find one that is invertible in $R_q$ and $R_p$.


- Compute $F_q$, the inverse of $f$ in $R_q$.


- Choose a private polynomial $g \in \mathcal{T}(d, d)$.


- Publish the public key $h = F_q \star g$.



</div>
<div class="prop-box" data-title="Encryption">


- Choose a plaintext $m \in R_p$.


- Choose a random polynomial $r \in \mathcal{T}(d, d)$. Here we generate a random ternary polynomial again.


- Use the public key $h$ to compute the ciphertext $e \equiv p r \star h + m \mod q$. Here we multiply the polynomials $p r$ and $h$ using the convolution operation $\star$, add the plaintext $m$, and then reduce the result by $x^N - 1$ and then by $q$.


- Send the ciphertext $e$ to the recipient.



</div>
<div class="prop-box" data-title="Decryption">


- Compute $a = f \star e \equiv p g \star r + f \star m \mod q$. Here we multiply the polynomials $p g$ and $r$ using the convolution operation $\star$, add the ciphertext $e$, and then reduce the result by $x^N - 1$ and then by $q$.


- Compute $m = F_p \star a \mod p$. Here we multiply the polynomials $F_p$ and $a$ using the convolution operation $\star$, and then reduce the result by $x^N - 1$ and then by $p$.


</div>

#### Why This Works

Consider $a = pg \star r + f \star m \mod q$. Before the mod by $q$, because we start with $f, g, r$ as ternary polynomials and bounds on $m$, we have the polynomial have coefficients with magnitude smaller than $q / 2$ guaranteed by the $q > (6d + 1)p$ condition. This means $a$ is the same in $R$ and not just modulo $q$ [^8] [^1]. Therefore, we get our message back when we multiply by $F_p$ and reduce by $p$.


$$
F_p \star a \equiv F_p \star (pg \star r + f \star m) \pmod{p} 
$$

$$
\equiv F_p \star (pg \star r) + F_p \star (f \star m) \pmod{p} 
$$

$$
\equiv p F_p \star (g \star r) + F_p \star (f \star m) \pmod{p} 
$$

$$
\equiv F_p \star (f \star m) \pmod{p} 
$$

$$
\equiv (F_p \star f) \star m \pmod{p} 
$$

$$
\equiv m \pmod{p}
$$



## Conclusion

The NTRU cryptosystem is an alternate approach to most of the methods in class, operating within the realm of rings. This change in environment allows for faster encryption/decryption and parallelization. Furthermore, NTRU is currently resistant to quantum attacks, which is a growing concern as quantum computers become more powerful.


# References

[^1]: [HPS14] Jeffrey Hoffstein, Jill Pipher, and Joseph H. Silverman. An Introduction to MathematicalCryptography. Undergraduate Texts in Mathematics. New York, NY: Springer NewYork, 2014. isbn: 978-1-4939-1710-5 978-1-4939-1711-2. doi: 10 . 1007 / 978 - 1 - 4939 -1711-2. url: https://link.springer.com/10.1007/978-1-4939-1711-2 (visited on01/16/2024).
[^2]: [Sch] John Schanck. “NTRU-HRSS-KEM”. First PQC Standardization Conference. Fort Laud-erdale, FL, USA. url: https://ntru.org/talks/20180412_nist_round1.pdf.
[^3]: [Sil] Joseph Silverman. “NTRU and Lattice-Based Crypto: Past, Present, and Future”. TheMathematics of Post-Quantum Cryptography. DIMACS Center. url: http://archive.dimacs.rutgers.edu/Workshops/Post-Quantum/Slides/Silverman.pdf.Department of Mathematics, Brown University, Providence, RI 02912
[^4]: [HVP10] Jens Hermans, Frederik Vercauteren, and Bart Preneel. “Speed Records for NTRU”. In:Topics in Cryptology - CT-RSA 2010. Ed. by Josef Pieprzyk. Red. by David Hutchisonet al. Vol. 5985. Series Title: Lecture Notes in Computer Science. Berlin, Heidelberg:Springer Berlin Heidelberg, 2010, pp. 73–88. isbn: 978-3-642-11924-8 978-3-642-11925-5.doi: 10.1007/978-3-642-11925-5_6. url: http://link.springer.com/10.1007/978-3-642-11925-5_6 (visited on 05/09/2024).
[^5]: [Sho97] Peter W. Shor. “Polynomial-Time Algorithms for Prime Factorization and DiscreteLogarithms on a Quantum Computer”. In: SIAM Journal on Computing 26.5 (Oct. 1997),pp. 1484–1509. issn: 0097-5397, 1095-7111. doi: 10 . 1137 / S0097539795293172. url: http://epubs.siam.org/doi/10.1137/S0097539795293172 (visited on 05/09/2024).
[^6]: [Pom] Carl Pomerance. “A Tale of Two Sieves”. In: (). url: https://www.ams.org/notices/199612/pomerance.pdf.
[^7]: [PC09] Ray A. Perlner and David A. Cooper. “Quantum resistant public key cryptography: asurvey”. In: Proceedings of the 8th Symposium on Identity and Trust on the Internet. IDtrust’09: 8th Symposium on Identity and Trust on the Internet. Gaithersburg MarylandUSA: ACM, Apr. 14, 2009, pp. 85–93. isbn: 978-1-60558-474-4. doi: 10.1145/1527017.1527028. url: https://dl.acm.org/doi/10.1145/1527017.1527028 (visited on05/09/2024).
[^8]: [HPS98] Jeffrey Hoffstein, Jill Pipher, and Joseph H. Silverman. “NTRU: A ring-based pub-lic key cryptosystem”. In: Algorithmic Number Theory. Ed. by Joe P. Buhler. Red. byGerhard Goos, Juris Hartmanis, and Jan Van Leeuwen. Vol. 1423. Series Title: Lecture Notes in Computer Science. Berlin, Heidelberg: Springer Berlin Heidelberg, 1998,pp. 267–288. isbn: 978-3-540-64657-0 978-3-540-69113-6. doi: 10.1007/BFb0054868. url: http://link.springer.com/10.1007/BFb0054868 (visited on 05/07/2024).
