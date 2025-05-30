+++
date = '2025-05-28T19:09:06-04:00'
draft = false
title = 'Mnist'

summary = "A simple TensorFlow.js example of MNIST "
description = "A simple TensorFlow.js example of MNIST "
readTime = false
autonumber = false
math = false
hideBackToTop = false
tags = ["TensorFlow.js", "MNIST", "Machine Learning", "JavaScript"]
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++


<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TensorFlow.js Tutorial</title>

  <!-- Import TensorFlow.js -->
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js"></script>
  <!-- Import tfjs-vis -->
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-vis@1.0.2/dist/tfjs-vis.umd.min.js"></script>

  <!-- Import the data file -->
  <script src="data.js" type="module"></script>

  <!-- Import the main script file -->
  <script src="script.js" type="module"></script>

  Here is a simple TensorFlow.js example that loads the MNIST dataset, trains a model, and allows you to draw digits to see how well the model predicts them. Once the model is trained, you can draw a digit in the box below and it will predict what digit you drew. The model is trained on the MNIST dataset, which consists of 28x28 pixel grayscale images of handwritten digits (0-9).

  *Also, once the model is trained, feel free to hide the sidebar (top right) to get a better view of the canvas.*

  <div id="mnist-examples"><h3>Loading...</h3></div>
  <div id="model-summary"><h3>Loading...</h3></div>
  <div id="draw-canvas"><h3>Waiting on training...</h3></div>

  The model is pretty small in order to run in the browser, so it may not be very accurate. I've also noticed that the model has a couple weird quirks like you have to draw some of the digits in a specific way for it to recognize them correctly. For example, it seems to prefer the 7 to be drawn with a curved line at the top.

  I also suspect the poor accuracy has to do with the fact that the input box here doesn't output images with the same style as the MNIST dataset, so it may not be able to recognize the digits as well as it could as from the actual MNIST dataset which is partially an issue with the model not being able to generalize well.
</head>

<body>
</body>
</html>