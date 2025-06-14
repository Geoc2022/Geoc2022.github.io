+++
date = '2025-05-19T01:22:38-04:00'
aliases = ['/pages/about_contact.html', '/pages/about_contact']
draft = false
title = 'whoami'
+++

<script>
const text = "whoami";
let i = 0;
const el = document.getElementsByClassName("single-title")[0];
function type() {
    if (i <= text.length) {
        el.textContent = text.slice(0, i) + (i < text.length ? "_" : "");
        i++;
        setTimeout(type, 150);
    }
}
if (el) type();
</script>

I’m an undergraduate at Brown University pursuing dual Sc.B. degrees in Computer Science and Mathematics (expected May 2026). 

My interests currently center on cryptography, deep learning, and formal proof verification. Some of my recent projects include implementing a [cryptographic voting protocol](../projects/vote), developing methods for [robust estimation in adversarial graph models](../projects/robust-estimation-for-the-erdos-renyi-model), and creating a [Abstract Algebra Lean game](https://github.com/Geoc2022/AlgebraGame). 

I've used languages like Python, C/C++, Java, and Lean among others, and I’m comfortable with tools like TensorFlow, PyTorch, and CUDA for deep learning, as well Matplotlib, NumPy, and pandas for data analysis.

<span class="annotation__text" data-annotation="Or maybe it is related - I find a lot of people who like math also like this stuff too. It makes sense why they might like board games, but playing music feels a little ironic for STEM people.">Unrelated</span>, I'm a big fan of board games, photography, and music. 

<span class="annotation__text" data-annotation="References: Riley Hartman and Mitchell Perales" data-annotation-accent="#00000000">
<span style="color: var(--bg0)">░░</span></span>

Here's my [resume](/George_Chemmala_resume.pdf).
<!-- 
### **Education**

**Brown University** — Providence, RI
**Sc.B. in Computer Science & Sc.B. in Mathematics** (Major GPA: 4.0)
Expected: May 2026

Relevant Coursework: Data Structures & Algorithms, Deep Learning, Machine Learning, Robust Algorithms for ML, Formal Proof and Verification, Applied Cryptography, Computer Systems, Abstract Algebra, Number Theory, Monte Carlo Simulation

---

### **Projects & Research**

**Vote: Cryptographic Voting Protocol Implementation** — *C++, CryptoPP*
Spring 2025

* Built a secure, end-to-end verifiable voting system using homomorphic encryption and threshold decryption
* Integrated zero-knowledge proofs and blinding to protect voter anonymity and ensure ballot integrity
* Extended the protocol to support multiple candidates and restricted voting per user

**WeensyOS: Virtual Memory Kernel Implementation** — *C, C++, x86 Assembly*
Spring 2025

* Engineered kernel code for managing user/kernel virtual memory and enforcing permissions
* Enhanced memory utilization with dynamic, non-contiguous page allocation
* Optimized fork and exit system calls for efficient process handling
* Implemented overlapping virtual address spaces for process isolation

**[Robust Estimation for the Erdős–Rényi Model](https://github.com/Geoc2022/2952Q_FinalProject)** — *Python, Matplotlib, NumPy, NetworkX*
Fall 2024

* Developed robust algorithms to estimate edge probability $p$ in adversarial Erdős–Rényi graphs
* Proved runtime and accuracy guarantees, surpassing baseline methods
* Evaluated performance on synthetic datasets with 10k+ nodes
* Followed best practices: modular code, visualizations, and reproducibility

**[Spiderverse Style Transfer & Transfer Learning](https://github.com/AzureCoral/Spider-Verse-Style-Transfer)** — *Python, TensorFlow, CUDA*
Spring 2024

* Designed a multi-style transfer pipeline using VGG16 to replicate visual styles from Spiderverse media
* Introduced novel transfer learning techniques for improved texture recognition
* Used CUDA for GPU acceleration, achieving 10x speedup in model training and inference

---

### **Experience**

**President** — *Math Circle*
2023–Present

* Launched a student-led outreach program teaching recreational math to local high school students
* Led program logistics, lesson planning, and administrative oversight

**Teaching Assistant** — *Brown Department of Mathematics & Applied Mathematics*
2024–2025

* Assisted in courses: Statistical Inference I, Abstract Algebra, Applied ODEs
* Led problem-solving sessions, hosted office hours, and graded coursework for classes up to 350 students

**Research Assistant** — *Brown University Directed Reading Program*
2024

* Studied Classical Algebraic Geometry with a focus on algorithmic foundations
* Investigated Gröbner bases, polynomial systems, and computational algebraic methods

**Computer Technician & Teaching Assistant** — *Georgia Governor’s Honors Program (GHP)*
2023

* Supported student research in computational mathematics
* Maintained classroom computing systems for deep learning applications
* Helped debug Python code and optimize machine learning workflows

---

### **Skills & Interests**

**Languages:** Python, C, C++, Java, Lean, Haskell, Julia, LaTeX, Mathematica, MATLAB

**Tools & Software:** VS Code, Vim, PyCharm, IntelliJ, Google Colab, Jupyter, Git, Unix/Linux, Docker, Figma

**Libraries:** pandas, NumPy, scikit-learn, sympy, scipy, Matplotlib, NetworkX, TensorFlow, PyTorch, TorchVision, OpenCV, Sage

**Interests:** Education, Music, Board/Card Games, Photography, [Manim](https://youtu.be/DQVuFo6CSmE?t=1189) -->
