import {MnistData} from './data.js';

async function showExamples(data) {
  let examplesDiv = document.getElementById('mnist-examples');
  examplesDiv.innerHTML = '';

  const examples = data.nextTestBatch(20);
  const numExamples = examples.xs.shape[0];
  
  for (let i = 0; i < numExamples; i++) {
    const imageTensor = tf.tidy(() => {
      return examples.xs
        .slice([i, 0], [1, examples.xs.shape[1]])
        .reshape([28, 28, 1]);
    });
    
    const canvas = document.createElement('canvas');
    canvas.width = 28;
    canvas.height = 28;
    canvas.style = 'margin: 4px;';
    await tf.browser.toPixels(imageTensor, canvas);
    examplesDiv.appendChild(canvas);

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

  console.log('Model training complete!');

  
  const drawDiv = document.getElementById('draw-canvas');
  drawDiv.innerHTML = `
    <h3>Draw a digit</h3>
    <canvas id="user-canvas" width="280" height="280" style="border:1px solid #ccc; background:#fff; touch-action:none; cursor:crosshair;"></canvas>
    <br>
    <button id="predict-btn">Predict</button>
    <button id="clear-btn">Clear</button>
    <div id="prediction-result" style="margin-top:10px;font-size:1.2em;"></div>
  `;

  const userCanvas = document.getElementById('user-canvas');
  const ctx = userCanvas.getContext('2d');
  ctx.lineWidth = 20;
  ctx.lineCap = 'round';
  let drawing = false;

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
  }, { passive: false });

  document.getElementById('clear-btn').onclick = () => {
    ctx.clearRect(0, 0, userCanvas.width, userCanvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, userCanvas.width, userCanvas.height);
    document.getElementById('prediction-result').textContent = '';
  };

  document.getElementById('predict-btn').onclick = async () => {
    const smallCanvas = document.createElement('canvas');
    smallCanvas.width = 28;
    smallCanvas.height = 28;
    const smallCtx = smallCanvas.getContext('2d');
    smallCtx.drawImage(userCanvas, 0, 0, 28, 28);
    const imgData = smallCtx.getImageData(0, 0, 28, 28);

    const input = [];
    for (let i = 0; i < imgData.data.length; i += 4) {
      const avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
      input.push(1 - (avg / 255)); // normalize and invert
    }

    const inputTensor = tf.tensor(input, [1, 28, 28, 1]);
    const prediction = model.predict(inputTensor);
    const predIdx = prediction.argMax(-1).dataSync()[0];
    document.getElementById('prediction-result').textContent =
      `Prediction: ${predIdx}`;

    inputTensor.dispose();
    prediction.dispose();
  };
}

document.addEventListener('DOMContentLoaded', run);

function getModel() {
  const model = tf.sequential();
  
  const IMAGE_WIDTH = 28;
  const IMAGE_HEIGHT = 28;
  const IMAGE_CHANNELS = 1;  
  
  // In the first layer of our convolutional neural network we have 
  // to specify the input shape. Then we specify some parameters for 
  // the convolution operation that takes place in this layer.
  model.add(tf.layers.conv2d({
    inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
    kernelSize: 5,
    filters: 8,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }));

  // The MaxPooling layer acts as a sort of downsampling using max values
  // in a region instead of averaging.  
  model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
  
  // Repeat another conv2d + maxPooling stack. 
  // Note that we have more filters in the convolution.
  model.add(tf.layers.conv2d({
    kernelSize: 5,
    filters: 16,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }));
  model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
  
  // Now we flatten the output from the 2D filters into a 1D vector to prepare
  // it for input into our last layer. This is common practice when feeding
  // higher dimensional data to a final classification output layer.
  model.add(tf.layers.flatten());

  // Our last layer is a dense layer which has 10 output units, one for each
  // output class (i.e. 0, 1, 2, 3, 4, 5, 6, 7, 8, 9).
  const NUM_OUTPUT_CLASSES = 10;
  model.add(tf.layers.dense({
    units: NUM_OUTPUT_CLASSES,
    kernelInitializer: 'varianceScaling',
    activation: 'softmax'
  }));

  
  // Choose an optimizer, loss function and accuracy metric,
  // then compile and return the model
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

  const table = document.createElement('table');
  table.style.borderCollapse = 'collapse';
  table.style.marginBottom = '16px';

  const header = document.createElement('tr');
  ['Layer (type)', 'Output Shape', 'Param #'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    th.style.border = '1px solid #ccc';
    th.style.padding = '4px 8px';
    header.appendChild(th);
  });
  table.appendChild(header);

  model.layers.forEach(layer => {
    const tr = document.createElement('tr');
    const tdName = document.createElement('td');
    tdName.textContent = `${layer.name} (${layer.getClassName()})`;
    tdName.style.border = '1px solid #ccc';
    tdName.style.padding = '4px 8px';
    tr.appendChild(tdName);

    const tdShape = document.createElement('td');
    tdShape.textContent = JSON.stringify(layer.outputShape);
    tdShape.style.border = '1px solid #ccc';
    tdShape.style.padding = '4px 8px';
    tr.appendChild(tdShape);

    const tdParams = document.createElement('td');
    tdParams.textContent = layer.countParams();
    tdParams.style.border = '1px solid #ccc';
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

async function testModel(model) {
  const drawDiv = document.getElementById('draw-canvas-container');
  drawDiv.innerHTML = '';

  const canvas = document.createElement('canvas');
  canvas.width = 28;
  canvas.height = 28;
  canvas.style.border = '1px solid #333';
  canvas.style.background = '#000';
  canvas.style.cursor = 'crosshair';
  drawDiv.appendChild(canvas);

  const clearBtn = document.createElement('button');
  clearBtn.textContent = 'Clear';
  clearBtn.style.margin = '8px';
  drawDiv.appendChild(clearBtn);

  const predictBtn = document.createElement('button');
  predictBtn.textContent = 'Predict';
  drawDiv.appendChild(predictBtn);

  const resultDiv = document.createElement('div');
  resultDiv.style.marginTop = '12px';
  drawDiv.appendChild(resultDiv);

  let drawing = false;
  const ctx = canvas.getContext('2d');
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#fff';

  canvas.addEventListener('mousedown', e => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  });
  canvas.addEventListener('mousemove', e => {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  });
  canvas.addEventListener('mouseup', () => drawing = false);
  canvas.addEventListener('mouseleave', () => drawing = false);

  clearBtn.onclick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resultDiv.textContent = '';
  };

  predictBtn.onclick = async () => {
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const input = tf.tidy(() => {
    let img = tf.browser.fromPixels(imgData); // shape: [28, 28, 4]
    
    // Convert to grayscale by averaging across RGB channels (exclude alpha)
    img = img.mean(2); // shape: [28, 28]

    // Normalize to [0, 1] and invert for white digits on black bg
    img = img.toFloat().div(tf.scalar(255.0));
    img = tf.scalar(1.0).sub(img); // invert: black bg, white digit

    // Reshape to [1, 28, 28, 1]
    return img.expandDims(0).expandDims(-1);
  });

  const output = model.predict(input); // shape: [1, 10]
  const probs = await output.data(); // array of probabilities

  const predIdx = probs.indexOf(Math.max(...probs));
  resultDiv.textContent = `Prediction: ${classNames[predIdx]}`;

  input.dispose();
  output.dispose();
};
}
