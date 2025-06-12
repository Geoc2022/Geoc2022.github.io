+++
date = '2025-05-28T19:09:06-04:00'
draft = false
title = 'An MNIST Demo Using TensorFlow.js'
aliases = ['/experiments/mnist.html', '/experiments/mnist']

summary = "A simple TensorFlow.js implementation of MNIST "
description = "A simple TensorFlow.js implementation of MNIST "
readTime = false
autonumber = false
math = false
hideBackToTop = false
tags = ["TensorFlow", "MNIST", "Machine-Learning", "JavaScript"]
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++


<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MNIST Example</title>
  <link rel="stylesheet" href="style.css">
  <link rel="icon" href="/favicon.ico">
  <!-- Import TensorFlow.js -->
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js"></script>
  <!-- Import tfjs-vis -->
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-vis@1.0.2/dist/tfjs-vis.umd.min.js"></script>
  <!-- Import the data file -->
  <script src="../../experiments/mnist/data.js" type="module"></script>
  <!-- Import the main script file -->
  <script src="../../experiments/mnist/script.js" type="module"></script>
</head>
<body>
  <p>
    Here is a simple TensorFlow.js example that loads the <span class="annotation__text" data-annotation="The MNIST dataset is a large database of handwritten digits (28x28 pixel images) that is commonly used as a 'Hello World' for machine learning.">MNIST dataset</span>, trains a model, and allows you to draw digits to see how well the model predicts them. Once the model is trained, you can draw a digit in the box below and it will predict what digit you drew.
  </p>
  <p>
    <em>Also, once the model is trained, feel free to hide the sidebar (top right) to get a better view of the canvas.</em>
  </p>

  <button id="start-button">Loading Content</button>

  <div id="mnist-examples"></div>
  <div id="model-summary"></div>
  <div id="draw-canvas"></div>

  <p>
    The model is pretty small in order to run in the browser, so it's not accurate all the time. I've also noticed that the model has a couple weird quirks like you have to draw some of the digits in a <span class="annotation__text" data-annotation="For example, it seems to prefer the 7 to be drawn with a curved line at the top.">specific way</span> for it to recognize them correctly.
  </p>
  <p>
    I suspect this has to do with the fact that the input box here doesn't output images with the same style as the MNIST dataset, so it may not be able to recognize the digits as well as it could as from the actual MNIST dataset which is partially an issue with the model not being able to generalize well.
  </p>
</body>
</html>