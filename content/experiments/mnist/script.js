import {MnistData} from './data.js';

async function showExamples(data) {
  let examplesDiv = document.getElementById('mnist-examples');
  examplesDiv.innerHTML = '<h3>MNIST Data</h3>';

  const examples = data.nextTestBatch(20);
  const numExamples = examples.xs.shape[0];
  
  for (let i = 0; i < numExamples; i++) {
    const imageTensor = tf.tidy(() => {
      return examples.xs
      .slice([i, 0], [1, examples.xs.shape[1]])
      .reshape([28, 28, 1]);
    });

    const smallCanvas = document.createElement('canvas');
    smallCanvas.width = 28;
    smallCanvas.height = 28;

    await tf.browser.toPixels(imageTensor, smallCanvas);

    const scale = 1;
    const largeCanvas = document.createElement('canvas');
    largeCanvas.width = 28 * scale;
    largeCanvas.height = 28 * scale;
    largeCanvas.style = `margin: 4px; width: ${28 * scale}px; height: ${28 * scale}px; image-rendering: pixelated;`;

    const ctx = largeCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(smallCanvas, 0, 0, largeCanvas.width, largeCanvas.height);

    examplesDiv.appendChild(largeCanvas);

    imageTensor.dispose();
  }
}

async function run() {  
  console.log('Loading Data');
  const data = new MnistData();
  await data.load();
  await showExamples(data);

  console.log('Loading Model');
  const model = getModel();
  
  await showSummary(model);
    
  await train(model, data);

  await showAccuracy(model, data);
  await showConfusion(model, data);

  console.log('Model training complete!');

  
  const drawDiv = document.getElementById('draw-canvas');
  drawDiv.innerHTML = `
    <h3>Draw a digit</h3>
    <canvas id="user-canvas" width="280" height="280" style="border:1px solid #ccc; background:#ffffff; touch-action:none; cursor:crosshair;"></canvas>
    <br>
    <button id="predict-btn" style="border-radius: 6px; border: 1px solid #ccc; padding: 2px 5px; font-size: 1em;" >Predict</button>
    <button id="clear-btn" style="border-radius: 6px; border: 1px solid #ccc; padding: 2px 5px; font-size: 1em;" >Clear</button>
    <div id="prediction-result" style="margin-top:10px;font-size:1.2em;"></div>`;

  const userCanvas = document.getElementById('user-canvas');
  const ctx = userCanvas.getContext('2d');
  ctx.lineWidth = 25;
  ctx.lineCap = 'round';
  let drawing = false;
  let predictTimeout = null;

  function getPos(e) {
    if (e.touches) {
      const rect = userCanvas.getBoundingClientRect();
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return { x: e.offsetX, y: e.offsetY };
  }

  function doPredictionFromCanvas() {
    const userCtx = userCanvas.getContext('2d');
    const userImgData = userCtx.getImageData(0, 0, userCanvas.width, userCanvas.height);
    let minX = userCanvas.width, minY = userCanvas.height, maxX = 0, maxY = 0;
    let found = false;
    for (let y = 0; y < userCanvas.height; y++) {
      for (let x = 0; x < userCanvas.width; x++) {
        const idx = (y * userCanvas.width + x) * 4;
        if (userImgData.data[idx] < 250 || userImgData.data[idx + 1] < 250 || userImgData.data[idx + 2] < 250) {
          found = true;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }

    let sx = 0, sy = 0, sw = userCanvas.width, sh = userCanvas.height;
    if (found) {
      sx = minX;
      sy = minY;
      sw = maxX - minX + 1;
      sh = maxY - minY + 1;
    }

    const targetSize = 20;
    const scale = Math.min(targetSize / sw, targetSize / sh);

    const dx = Math.floor((28 - Math.round(sw * scale)) / 2);
    const dy = Math.floor((28 - Math.round(sh * scale)) / 2);

    const smallCanvas = document.createElement('canvas');
    smallCanvas.width = 28;
    smallCanvas.height = 28;
    const smallCtx = smallCanvas.getContext('2d');
    smallCtx.fillStyle = "#FFF";
    smallCtx.fillRect(0, 0, 28, 28);
    smallCtx.imageSmoothingEnabled = true;
    smallCtx.imageSmoothingQuality = 'high';
    smallCtx.drawImage(
      userCanvas,
      sx, sy, sw, sh,
      dx, dy, Math.round(sw * scale), Math.round(sh * scale)
    );
    const imgData = smallCtx.getImageData(0, 0, 28, 28);

    const input = [];
    for (let i = 0; i < imgData.data.length; i += 4) {
      const avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
      input.push(1 - (avg / 255));
    }

    const inputTensor = tf.tensor(input, [1, 28, 28, 1]);
    const prediction = model.predict(inputTensor);
    const predIdx = prediction.argMax(-1).dataSync()[0];
    document.getElementById('prediction-result').textContent =
      `Prediction: ${predIdx}`;

    inputTensor.dispose();
    prediction.dispose();
  }

  function schedulePrediction() {
    if (predictTimeout) clearTimeout(predictTimeout);
    predictTimeout = setTimeout(doPredictionFromCanvas, 150);
  }

  userCanvas.addEventListener('mousedown', () => { drawing = true; ctx.beginPath(); });
  userCanvas.addEventListener('mouseup', () => { drawing = false; });
  userCanvas.addEventListener('mouseleave', () => { drawing = false; });
  userCanvas.addEventListener('mousemove', e => {
    if (!drawing) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    schedulePrediction();
  });
  userCanvas.addEventListener('touchstart', () => { drawing = true; ctx.beginPath(); });
  userCanvas.addEventListener('touchend', () => { drawing = false; });
  userCanvas.addEventListener('touchcancel', () => { drawing = false; });
  userCanvas.addEventListener('touchmove', e => {
    if (!drawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    schedulePrediction();
  }, { passive: false });

  document.getElementById('clear-btn').onclick = () => {
    ctx.clearRect(0, 0, userCanvas.width, userCanvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, userCanvas.width, userCanvas.height);
    document.getElementById('prediction-result').textContent = '';
  };

  document.getElementById('predict-btn').onclick = doPredictionFromCanvas;
}

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-button');
  startBtn.textContent = 'Start MNIST Demo';
  startBtn.style = 'border-radius:6px; border:1px solid #ccc; padding:6px 16px; font-size:1.1em; margin:16px 0;';

  startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    startBtn.textContent = 'Loading...';
    run().finally(() => {
      startBtn.style.display = 'none';
    });
  });
});

function getModel() {
  const model = tf.sequential();
  
  const IMAGE_WIDTH = 28;
  const IMAGE_HEIGHT = 28;
  const IMAGE_CHANNELS = 1;  
  
  model.add(tf.layers.conv2d({
    inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
    kernelSize: 5,
    filters: 8,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }));

  model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
  
  model.add(tf.layers.conv2d({
    kernelSize: 5,
    filters: 16,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }));
  model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
  
  model.add(tf.layers.dropout({rate: 0.25}));

  model.add(tf.layers.flatten());

  model.add(tf.layers.dense({
    units: 32,
    kernelInitializer: 'varianceScaling',
    activation: 'relu'
  }));
  model.add(tf.layers.dropout({rate: 0.5}));

  const NUM_OUTPUT_CLASSES = 10;
  model.add(tf.layers.dense({
    units: NUM_OUTPUT_CLASSES,
    kernelInitializer: 'varianceScaling',
    activation: 'softmax'
  }));

  const optimizer = tf.train.adam();
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

async function showSummary(model) {
  let summaryDiv = document.getElementById('model-summary');
  summaryDiv.innerHTML = '<h3>Model Architecture</h3>';
  const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--bg1') || "#ccc";

  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.marginBottom = '16px';

  const header = document.createElement('tr');
  ['Layer (type)', 'Output Shape', 'Param #'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    th.style.border = `1px solid ${borderColor}`;
    th.style.padding = '4px 8px';
    header.appendChild(th);
  });
  table.appendChild(header);

  model.layers.forEach(layer => {
    const tr = document.createElement('tr');
    const tdName = document.createElement('td');
    tdName.textContent = `${layer.getClassName()}`;
    tdName.style.border = `1px solid ${borderColor}`;
    tdName.style.padding = '4px 8px';
    tr.appendChild(tdName);

    const tdShape = document.createElement('td');
    const shape = Array.isArray(layer.outputShape) ? layer.outputShape.slice(1) : [];
    tdShape.textContent = JSON.stringify(shape);
    tdShape.style.border = `1px solid ${borderColor}`;
    tdShape.style.padding = '4px 8px';
    tr.appendChild(tdShape);

    const tdParams = document.createElement('td');
    tdParams.textContent = layer.countParams();
    tdParams.style.border = `1px solid ${borderColor}`;
    tdParams.style.padding = '4px 8px';
    tr.appendChild(tdParams);

    table.appendChild(tr);
  });

  summaryDiv.appendChild(table);
}

async function train(model, data) {
  const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
  const container = {
    name: 'Model Training', tab: 'Model', styles: { height: '1000px' }
  };
  const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);
  
  const BATCH_SIZE = 512;
  const TRAIN_DATA_SIZE = 5500;
  const TEST_DATA_SIZE = 1000;

  const [trainXs, trainYs] = tf.tidy(() => {
    const d = data.nextTrainBatch(TRAIN_DATA_SIZE);
    return [
      d.xs.reshape([TRAIN_DATA_SIZE, 28, 28, 1]),
      d.labels
    ];
  });

  const [testXs, testYs] = tf.tidy(() => {
    const d = data.nextTestBatch(TEST_DATA_SIZE);
    return [
      d.xs.reshape([TEST_DATA_SIZE, 28, 28, 1]),
      d.labels
    ];
  });

  return model.fit(trainXs, trainYs, {
    batchSize: BATCH_SIZE,
    validationData: [testXs, testYs],
    epochs: 10,
    shuffle: true,
    callbacks: fitCallbacks
  });
}

const classNames = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

function doPrediction(model, data, testDataSize = 500) {
  const IMAGE_WIDTH = 28;
  const IMAGE_HEIGHT = 28;
  const testData = data.nextTestBatch(testDataSize);
  const testxs = testData.xs.reshape([testDataSize, IMAGE_WIDTH, IMAGE_HEIGHT, 1]);
  const labels = testData.labels.argMax(-1);
  const preds = model.predict(testxs).argMax(-1);

  testxs.dispose();
  return [preds, labels];
}

async function showAccuracy(model, data) {
  const [preds, labels] = doPrediction(model, data);
  const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
  const container = {name: 'Accuracy', tab: 'Evaluation'};
  tfvis.show.perClassAccuracy(container, classAccuracy, classNames);

  labels.dispose();
}

async function showConfusion(model, data) {
  const [preds, labels] = doPrediction(model, data);
  const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds);
  const container = {name: 'Confusion Matrix', tab: 'Evaluation'};
  tfvis.render.confusionMatrix(container, {values: confusionMatrix, tickLabels: classNames});

  labels.dispose();
}

