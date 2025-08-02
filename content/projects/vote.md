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

<script>
function hashTitle(text) {
  return text.split('').map(c => {
    let code = c.charCodeAt(0);
    let base = (c <= 'Z') ? 65 : 97;
    if (!/[a-zA-Z]/.test(c)) return c;
    return String.fromCharCode(((code - base + 3) % 26) + base);
  }).join('');
}

const text = "Cryptographic Voting with Multiple Candidates";
let i = 0;
const el = document.getElementsByClassName("single-title")[0];
function decode() {
  function decodeChar(c) {
    let code = c.charCodeAt(0);
    let base = (c <= 'Z') ? 65 : 97;
    if (!/[a-zA-Z]/.test(c)) return c;
    return String.fromCharCode(((code - base - 3 + 26) % 26) + base);
  }

  const hashedTitle = hashTitle(text);
  let current = hashedTitle.split('');
  const target = hashedTitle.split('').map(decodeChar);

  function step() {
    const unrevealed = [];
    for (let i = 0; i < current.length; i++) {
      if (current[i] !== target[i]) unrevealed.push(i);
    }
    if (unrevealed.length === 0) return;

    const idx = unrevealed[Math.floor(Math.random() * unrevealed.length)];
    current[idx] = target[idx];
    el.textContent = current.join('');

    setTimeout(step, 40);
  }

  el.textContent = hashedTitle;
  step();
}
if (el) decode();
</script>


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

For our Applied Cryptography final project, we implemented an extension of the Helios voting protocol in which each voter can vote for multiple candidates. Here's the paper remade for the web using this $\LaTeX$ to markdown/html [converter](./../../library/converter.py).

>For our Applied Cryptography final project, we have implemented an extension of the Vote project in which each voter can vote for multiple candidates. We enforced the condition that each voter votes for exactly $k$ out of $n$ total candidates, where $k$ and $n$ are global constants (e.g. $k = 2, n = 6$). In order to do this, we modified the project infrastructure to accommodate each voter voting for multiple candidates and each candidate's votes being totaled separately. We also included a zero-knowledge proof (ZKP) to ensure that each voter voted for exactly $k$ candidates.



## DCP Background


### Homomorphic Encryption

<div class="definition-box" data-title="Definition" data-label="Homomorphic Encryption">

Homomorphic encryption is a form of encryption such that for and operation $\oplus$ on plaintexts, there exists an operation $\otimes$ on ciphertexts such that:

$$\mathrm{Enc}(m_1) \otimes \mathrm{Enc}(m_2) = \mathrm{Enc}(m_1 \oplus m_2)$$

[^1]

</div>


This is a handy trick that allows a agent to perform operations on our data as ciphertexts without being able to directly read it. And, we can see how this is useful in the context of voting since we preforming a tally of votes while keeping the votes private.


<div class="example-box" data-title="Example" data-label="ElGamal Homomorphic Encryption">

The encryption of a message $m$ is given by:

$$\mathrm{Enc}(m) = (g^r, pk^r \cdot g^m)$$

where $g$ is a generator, $r$ is a random number, $pk = g^{sk}$ is the public key, and $sk$ is the secret key. The ciphertext can be added or multiplied to yield the same result as adding or multiplying the plaintexts.

For example, if we have two ciphertexts $c_1 = (g^{r_1}, pk^{r_1} \cdot g^{m_1})$ and $c_2 = (g^{r_2}, pk^{r_2} \cdot g^{m_2})$, we can define the addition of ciphertexts as:

$$ c_1 + c_2= (g^{r_1} \cdot g^{r_2}, pk^{r_1} \cdot g^{m_1} \cdot pk^{r_2} \cdot g^{m_2}) $$

$$ = (g^{r_1 + r_2}, pk^{r_1 + r_2} \cdot g^{m_1 + m_2}) $$

$$ = \mathrm{Enc}(m_1 + m_2) $$

where the addition of the ciphertexts is component-wise multiplication.

[^2]

</div>



### Threshold Encryption

In addition to homomorphic encryption, we also want to be able to split the decryption key among multiple parties. Not only will this prevent a single party from calling the election whenever they want, but it also allows for a more secure system since one party cannot decrypt the votes by itself. One attack on the system is that a malicious party could "call the election" throughout the election process and decrypt the votes examining the votes and potentially tracking the votes back to the voters. 


This strategy of splitting the decryption key among multiple parties is known as threshold encryption [^3]. In threshold encryption, a ciphertext can only be decrypted by a subset of parties, and the decryption key is shared among those parties. This allows for a more secure system, as no single party has access to the decryption key.


<div class="example-box" data-title="Example" data-label="ElGamal Threshold Encryption">

In ElGamal threshold encryption, $n$ parties (arbiters) collaborate to generate a shared public key and distribute the decryption process. Each party $i$ generates a keypair $(sk_i, pk_i)$, where the public key is computed as:

$pk_i = g^{sk_i},$

and $sk_i$ is kept private. Each party publishes $pk_i$, and the combined public key is computed as:

$$pk = \prod_{i=1}^n pk_i = g^{\sum_{i=1}^n sk_i}.$$

This combined public key $pk$ is used for encryption, while the corresponding secret key $sk = \sum_{i=1}^n sk_i$ is secret-shared among the $n$ parties.


To encrypt a message $m$, the ciphertext is computed as 

$c = (c_1, c_2) = (g^r, pk^r \cdot g^m),$

where $r$ is a random value.


To decrypt the ciphertext $c = (c_1, c_2)$, each party computes a partial decryption. Specifically, party $i$ computes

$d_i = c_1^{sk_i}.$

The partial decryptions are then combined by multiplying them together:

$$\prod_{i=1}^n d_i = \prod_{i=1}^n c_1^{sk_i} = c_1^{\sum_{i=1}^n sk_i} = c_1^{sk}.$$

This result, $c_1^{sk}$, is used to decrypt the second component of the ciphertext:

$$g^m = \frac{c_2}{c_1^{sk}}.$$

[^4]

</div>



## Zero-Knowledge Proofs

<div class="definition-box" data-title="Definition" data-label="Zero-Knowledge Proofs">

A zero-knowledge proof (ZKP) is a cryptographic protocol that allows one party (the prover) to prove to another party (the verifier) that they know a value $w$ without revealing any information about $w$ itself [^5]. A ZKP of knowledge has these 5 properties:


- **Completeness:** If the statement is true, there exists a proof that proves it is true.


- **Soundness:** If the statement is false, any proof cannot prove it is true.


- **Proof of Knowledge:** If a prover $P^*$ can prove, then they must know $w$.


- **Honest-Verifier Zero-Knowledge (HVZK):** An honest verifier does not learn anything about $w$.


- **Zero-Knowledge:** A malicious verifier does not learn anything about $w$.

</div>

This protocol will be useful in our voting system to ensure that each voter votes either 0 or 1 for each candidate, and that they vote for exactly $k$ candidates. The ZKP will allow the voter to prove to the verifier that they have voted for exactly $k$ candidates without revealing which candidates they voted for.


However, one of the limitations of ZKPs is that they can be interactive, meaning that the prover and verifier must communicate back and forth to complete the proof. This can be a problem in some scenarios, such as in our voting system where we want to ensure that the votes are private and cannot be traced back to the voter. If we did not have a way to make the ZKP non-interactive, each of the agents in out problem would have to communicate with the orgional voter to verify the proof. This would be a problem in our voting system, as we want to ensure that the votes are private and cannot be traced back to the voter.



### Non-Interactive Zero-Knowledge Proofs

<div class="definition-box" data-title="Definition" data-label="Random Oracle Model">

The random oracle model (ROM) is a theoretical model in which a hash function is treated as a random oracle. In this model, the hash function behaves like a random function, meaning that it produces random outputs for each unique input. The prover and verifier have access to this hash function, and the security of the protocol relies on the assumption that the hash function behaves randomly.

</div>


We can use the Fiat-Shamir heuristic and the random oracle model to transform a three-round sigma protocol into a non-interactive zero-knowledge proof (NIZK) [^6]


In a three-round sigma protocol,

<div class="prop-box" data-title="Protocol" data-label="3 Round Sigma Protocol">

1. The prover sends a message to the verifier setting up the proof.


2. The verifier sends a challenge to the prover.


3. The prover sends a response to the challenge.


4. The verifier checks the proof using the challenge and response.
</div>


This protocol can be transformed into a NIZK by replacing the verifier's challenge with a hash of the first two messages.


Now our protocol looks like this:

<div class="prop-box" data-title="Protocol" data-label="NIZK Protocol">

1. The prover sends a message to the verifier setting up the proof.


2. The prover computes the challenge as the hash of the first message and sends it to the verifier.


3. The prover sends a response to the challenge.


4. The verifier checks the proof using the challenge and response.
</div>


This insures that the prover does not have to interact with the verifier, and the verifier does not have to interact with the prover. Moreover, the proof is secure against a malicious prover and verifier. The prover cannot predict the challenge, and the verifier cannot influence the challenge to bias the proof in their favor. This ensures that the proof is secure against a malicious verifier and maintains the zero-knowledge property.



## $k$-candidate ZKP

The votes that the voter sends to the tallyer are of the form:

$$ (g^{sk}, g^{r_1}, g^{sk \cdot r_1 + v_1}) $$

$$ (g^{sk}, g^{r_2}, g^{sk \cdot r_2 + v_2}) $$

$$ \vdots $$

$$ (g^{sk}, g^{r_n}, g^{sk \cdot r_n + v_n}) $$

where $n$ is the number of candidates, $v_i$ is the vote for candidate $i$, and $r_i$ is a random number. 


Therefore, when we multiply the votes together componentwise and preseve first component, we get

$$(g^{sk}, g^{r}, g^{sk \cdot r + \sum_{i=1}^n v_i})$$

where $r = \sum_{i=1}^n r_i$ 


This now looks like a single ElGamal ciphertext but we have the extra information about the sum of the votes. Now we can divide the last component by $g^{k}$, where $k$ is the number of candidates that we require the voter to vote for, and check if the result is an Elgamal ciphertext to verify that the voter voted for exactly $k$ candidates.


We can use a Non-Interactive Zero-Knowledge Proof (NIZK) to prove that the voter voted for exactly $k$ candidates. This will mirror the same ZKP that we used to prove that a vote is an encryption of a 0 or 1. 

<div class="prop-box" data-title="Protocol" data-label="NIZK for k-candidate voting">

1. Our voter sends all of their votes to the tallyer.


2. The voter adds a ZKP to prove that they voted for exactly $k$ candidates:


3. The voter creates a random number $r^\prime \leftarrow \mathbb{Z}_q$


4. The voter sends $(g^{r^\prime}, pk^{r^\prime})$ to set up the zkp challenge.


5. The voter computes the challenge as $$\sigma = H(g^{r}, pk^{r}, g^{r^\prime}, pk^{r^\prime})$$ where $H$ is a hash function


6. The voter sends $r^{\prime\prime} = r^\prime + \sigma \cdot r$ to the tallyer 

</div>

Now the tallyer can verify the proof:

<div class="prop-box" data-title="Protocol" data-label="Tallyer Verification of k-candidate voting">

1. The tallyer computes $g^{r^\prime} \cdot (g^r)^{\sigma}$ and checks if it is equal to $g^{r^{\prime\prime}}$


2. The tallyer computes $pk^{r^\prime} \cdot (pk^r)^{\sigma}$ and checks if it is equal to $pk^{r^{\prime\prime}}$


3. If both checks pass, the tallyer can be sure that the voter voted for exactly $k$ candidates.

</div>

The tallyer can now strip the signature and continue with the voting process.




## Vote Architecture Summary



Since the Vote project is already a cryptographically secure voting platform, we will be building on top of the existing Vote project. 


We will build off of this existing architecture and modify it to allow for multiple candidates. The main changes we will make are that each vote will contian subvotes for each candidate which will be tagged with the candidate's index. Essentially, we will be running $n$ elections - one for each candidate. 


1. **Registrar:** The registrar will check that all voters are registered to vote only once. For each voter, they will issue a certificate for their verification key for each candidate. The registrar will also check that each voter submits a vote for all $n$ candidates.


2. **Tallyer:** The tallyer will post votes on a public bulletin board. They will check that the signature is valid and strip the signature from the vote. It will do this for each subvote for each candidate. The tallyer will also check that the ZKP is valid and that the voter submits a vote for all $n$ candidates.


3. **Arbiters:** The arbiters will generate the election parameters and decrypt the final result. They will generate the threshold encryption keys. There will be $t$ arbiters and each will have their $(pk_i, sk_i)$. They all reveal $pk_i$ to the public, so that everyone can compute the full public key $pk$.


4. **Voters:** The voters will be able to vote, view, and verify the final result. They will encrypt their votes using the public key. The voter will sign this vote using their signing key. They will send this vote to the tallyer. The voter will also generate a ZKP to show that they voted for exactly $k$ candidates.

# References

[^1]: Ronald L Rivest, Len Adleman, Michael L Dertouzos, et al. 1978. On data banks and privacy homomorphisms. Foundations of secure computation 4, 11 (1978), 169–180.

[^2]: T. Elgamal. 1985. A public key cryptosystem and a signature scheme based on discrete logarithms. IEEE Transactions on Information Theory 31, 4 (1985), 469–472. doi:10.1109/TIT.1985.1057074

[^3]: Yvo Desmedt and Yair Frankel. 1990. Threshold cryptosystems. In Advances in Cryptology — CRYPTO’ 89 Proceedings, Gilles Brassard (Ed.). Springer New York, New York, NY, 307–315.

[^4]: Alfredo De Santis, Yvo Desmedt, Yair Frankel, and Moti Yung. 1994. How to share a function securely. In Proceedings of the Twenty-Sixth Annual ACM Symposium on Theory of Computing (Montreal, Quebec, Canada) (STOC ’94). Association for Computing Machinery, New York, NY, USA, 522–533. doi:10.1145/195058.195405

[^5]: Shafi Goldwasser, Silvio Micali, and Charles Rackoff. 1989. The Knowledge Complexity of Interactive Proof Systems. SIAM J. Comput. 18, 1 (1989), 186–208. doi:10.1137/0218012 arXiv:https://doi.org/10.1137/0218012

[^6]: Huixin Wu and Feng Wang. 2014. A Survey of Noninteractive Zero Knowledge Proof System and Its Applications. The Scientific World Journal 2014, 1 (2014), 560484. doi:10.1155/2014/560484 arXiv:https://onlinelibrary.wiley.com/doi/pdf/10.1155/2014/560484

