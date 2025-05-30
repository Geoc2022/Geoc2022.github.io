+++
date = '2025-05-28T19:09:06-04:00'
draft = true
title = 'Mnist'

summary = ""
description = ""
readTime = false
autonumber = false
math = false
hideBackToTop = false
tags = []
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

  <p>Here is a simple TensorFlow.js example that loads the MNIST dataset, trains a model, and allows you to draw digits to see how well the model predicts them.</p>

  <div id="mnist-examples"><h3>Loading...</h3></div>
  <div id="model-summary"><h3>Loading...</h3></div>
  <div id="draw-canvas"><h3>Waiting on training...</h3></div>

</head>

<body>
</body>
</html>