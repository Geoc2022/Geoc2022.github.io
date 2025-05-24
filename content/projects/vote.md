+++
title = "Cryptographic Voting with Multiple Candidates"
date = "2025-05-12"
draft = false

summary = "Extension of the Helios Voting Protocol to support multiple candidates"
description = "Extension of the Helios Voting Protocol to support multiple candidates"
readTime = false
autonumber = false
math = true
tags = ["cryptography", "voting"]
showTags = false
hideBackToTop = false
fediverse = "@geoc@mathstodon.xyz"
+++

For our Applied Cryptography final project, we implemented an extension of the Helios voting protocal in which each voter can vote for multiple candidates. We enforced the condition that each voter votes for exactly $k$ out of $n$ total candidates, where $k$ and $n$ are global constants (e.g. $k = 2, n = 6$). In order to do this, we modified the project infrastructure to accommodate each voter voting for multiple candidates and each candidate's votes being totaled separately. We also included a zero-knowledge proof (ZKP) to ensure that each voter voted for exactly $k$ candidates.

## Read our [report](/projects/paper.pdf)
<h2> Read our <a href="./../paper.pdf">report</a> </h2>

----
The following is a simplified excerpt from our report:

## Cryptographic Primitives

### Homomorphic Encryption

Homomorphic encryption allows computations on ciphertexts that translate to operations on plaintexts:

$$
\mathrm{Enc}(m_1) \otimes \mathrm{Enc}(m_2) = \mathrm{Enc}(m_1 \oplus m_2)
$$

**Example (ElGamal):**
$$
\mathrm{Enc}(m) = (g^r, pk^r \cdot g^m)
$$
Now we can add ciphertexts:
$$
(g^{r_1}, pk^{r_1}g^{m_1}) \cdot (g^{r_2}, pk^{r_2}g^{m_2}) = (g^{r_1+r_2}, pk^{r_1+r_2}g^{m_1+m_2})
$$

### Threshold Encryption

Threshold encryption splits the decryption key among $n$ parties. Only a subset can decrypt, increasing security.

**Example (ElGamal):**

- Each party $i$ generates $(sk_i, pk_i)$, $pk_i = g^{sk_i}$
- Combined public key: $pk = \prod pk_i = g^{\sum sk_i}$
- To decrypt, each computes $d_i = c_1^{sk_i}$, then combine: $\prod d_i = c_1^{\sum sk_i}$

### Zero-Knowledge Proofs (ZKPs)

A ZKP lets a prover convince a verifier they know a value $w$ without revealing it. Key properties:

- **Completeness:** True statements can be proven.
- **Soundness:** False statements can't be proven.
- **Proof of Knowledge:** Prover must know $w$.
- **Zero-Knowledge:** Verifier learns nothing about $w$.

In our system, ZKPs ensure each voter votes for exactly $k$ candidates, without revealing which ones.

### Non-Interactive ZKPs

Using the Fiat-Shamir heuristic, interactive proofs can be made non-interactive by replacing the verifier's challenge with a hash, making the protocol suitable for private voting.

  - The prover sends a message to the verifier setting up the proof.
  - The prover computes the challenge as the hash of the first message and sends it to the verifier.
  - The prover sends a response to the challenge.
  - The verifier checks the proof using the challenge and response.

## $k$-candidate ZKP
The votes that the voter sends to the tallyer are of the form:

$$
  (g^{sk}, g^{r_1}, g^{sk \cdot r_1 + v_1}) \\
$$

$$
  (g^{sk}, g^{r_2}, g^{sk \cdot r_2 + v_2}) \\
$$

$$
  \vdots \\
$$

$$
  (g^{sk}, g^{r_n}, g^{sk \cdot r_n + v_n})
$$

where $n$ is the number of candidates, $v_i$ is the vote for candidate $i$, and $r_i$ is a random number. 

Therefore, when we multiply the votes together componentwise and preseve first component, we get
$$
  (g^{sk}, g^{r}, g^{sk \cdot r + \sum_{i=1}^n v_i})
$$
where $r = \sum_{i=1}^n r_i$ 

This now looks like a single ElGamal ciphertext but we have the extra information about the sum of the votes. Now we can divide the last component by $g^{k}$, where $k$ is the number of candidates that we require the voter to vote for, and check if the result is an Elgamal ciphertext to verify that the voter voted for exactly $k$ candidates.

We can use a Non-Interactive Zero-Knowledge Proof (NIZK) to prove that the voter voted for exactly $k$ candidates. This will mirror the same ZKP that we used to prove that a vote is an encryption of a 0 or 1. 

- Our voter sends all of their votes to the tallyer.
- The voter adds a ZKP to prove that they voted for exactly $k$ candidates:
    - The voter creates a random number $r^\prime \leftarrow \mathbb{Z}_q$
    - The voter sends $(g^{r^\prime}, pk^{r^\prime})$ to set up the zkp challenge.
    - The voter computes the challenge as $$\sigma = H(g^{r}, pk^{r}, g^{r^\prime}, pk^{r^\prime})$$ where $H$ is a hash function
    - The voter sends $r^{\prime\prime} = r^\prime + \sigma \cdot r$ to the tallyer 
- Now the tallyer can verify the proof:
    - The tallyer computes $g^{r^\prime} \cdot (g^r)^{\sigma}$ and checks if it is equal to $g^{r^{\prime\prime}}$
    - The tallyer computes $pk^{r^\prime} \cdot (pk^r)^{\sigma}$ and checks if it is equal to $pk^{r^{\prime\prime}}$
    - If both checks pass, the tallyer can be sure that the voter voted for exactly $k$ candidates.
- The tallyer can now strip the signature and continue with the voting process.

## [Read More](./../paper.pdf)