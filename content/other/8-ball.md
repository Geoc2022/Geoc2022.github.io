+++
date = '2025-07-06T02:06:27-04:00'
draft = false
title = 'Magic 8 Ball'
summary = "Ask the Magic 8 Ball a question and get an answer using three.js"
description = "Ask the Magic 8 Ball a question and get an answer using three.js"
readTime = false
autonumber = false
math = false
hideBackToTop = false
tags = [ "magic", "three.js", "webgl", "interactive" ]
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++

<head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manufacturing+Consent&display=swap" rel="stylesheet">
</head>

<div id="render">
</div>

> Much of this was based on [this demo](https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_csg.html) which you can see in action [here](https://threejs.org/examples/#webgl_geometry_csg).

It turns out three.js is a lot easier/fun to use than I thought. Stick on the page to see all the different answers - some of the faces might not be what you remember...

<style>
    .threejs-demo-canvas {
    width: 100%;
    height: 100%;
    min-width: 300px;
    min-height: 300px;
    display: block;
    margin: 0 auto;
    background: transparent !important;
    }
    @media (min-width: 700px) {
        .threejs-demo-canvas {
            min-width: 600px;
            min-height: 600px;
        }
    }

    .manufacturing-consent-regular {
        font-family: "Manufacturing Consent", system-ui;
        font-weight: 400;
        font-style: normal;
    }

</style>

<script type="importmap">
{
    "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/",
        "three-mesh-bvh": "https://cdn.jsdelivr.net/npm/three-mesh-bvh@0.7.3/build/index.module.js",
        "three-bvh-csg": "https://cdn.jsdelivr.net/npm/three-bvh-csg@0.0.16/build/index.module.js"
    }
}
</script>

<script type="module">
import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { SUBTRACTION, INTERSECTION, ADDITION, Brush, Evaluator } from 'three-bvh-csg';

let stats;
let camera, scene, renderer;
let baseBrush, brush;
let core;
let result, evaluator, wireframe;
const params = {
    operation: SUBTRACTION,
    useGroups: true,
    wireframe: false,
};

// 8 Ball face labels
const normalLabels = [
    "Yes", "No", "Maybe", "Ask again", "Definitely", "Unlikely",
    "Absolutely", "Doubtful", "Possibly", "Try later", "Sure", "No way",
    "Outlook good", "Don't count on it", "Yes, but", "Cannot predict", "Very likely", "Very doubtful",
    "Most likely", "My sources say no"
];

const funnyLabels = [
    "Pay $0.99 for 1 more answer",
    "New Ball. Who this?",
    "We have been trying to reach you regarding...",
    "404",
    "Ignore previous answer",
    "Information Available",
    "42",
    "…",
    "Ask your mom",
    "Made with 3.js",
    "Ask google",
];

let faceLabels = normalLabels

init();

function createLabelTexture(text) {
    // Create a canvas and draw the label text with automatic line breaks
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#00000000";
    ctx.fillRect(0, 0, size, size);
    if (text.length > 50) {
        ctx.font = `{42 * (Math.log(50) / Math.log(text.length - 50))}px Manufacturing Consent`;
    } else {
        ctx.font = "42px Manufacturing Consent";
    }
    ctx.lineWidth = 1;
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Split text into lines that fit the canvas width
    function wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let line = '';
        for (let n = 0; n < words.length; n++) {
            const testLine = line + (line ? ' ' : '') + words[n];
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line) {
                lines.push(line);
                line = words[n];
            } else {
                line = testLine;
            }
        }
        lines.push(line);
        return lines;
    }

    const maxWidth = size * 0.8;
    const lines = wrapText(ctx, text, maxWidth);
    const lineHeight = 38;
    const totalHeight = lines.length * lineHeight;
    let y = size / 2 - totalHeight / 2 + lineHeight / 2;

    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], size / 2, y + i * lineHeight);
    }

    return new THREE.CanvasTexture(canvas);
}

function addLabelsToIcosahedron(geometry, labels) {
    const group = new THREE.Group();
    const pos = geometry.attributes.position;
    const index = geometry.index;
    const faceCount = index ? index.count / 3 : pos.count / 3;
    for (let i = 0; i < faceCount && i < labels.length; i++) {
        let a, b, c;
        if (index) {
            a = index.getX(i * 3);
            b = index.getX(i * 3 + 1);
            c = index.getX(i * 3 + 2);
        } else {
            a = i * 3;
            b = i * 3 + 1;
            c = i * 3 + 2;
        }
        const vA = new THREE.Vector3().fromBufferAttribute(pos, a);
        const vB = new THREE.Vector3().fromBufferAttribute(pos, b);
        const vC = new THREE.Vector3().fromBufferAttribute(pos, c);
        const center = new THREE.Vector3().addVectors(vA, vB).add(vC).divideScalar(3);

        // Compute face normal
        const cb = new THREE.Vector3().subVectors(vC, vB);
        const ab = new THREE.Vector3().subVectors(vA, vB);
        const normal = new THREE.Vector3().crossVectors(cb, ab).normalize();

        // Create a plane for the label
        const planeSize = 0.6;
        const labelTexture = createLabelTexture(labels[i]);
        const mat = new THREE.MeshBasicMaterial({
            map: labelTexture,
            transparent: true,
            side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(planeSize, planeSize),
            mat
        );
        plane.position.copy(center.clone().add(normal.clone().multiplyScalar(0.005)));
        plane.lookAt(center.clone().add(normal));
        group.add(plane);
    }
    return group;
}

function init() {
    // environment
    camera = new THREE.PerspectiveCamera(50, 1, 1, 100);
    camera.position.set(-.2, 4.5, -.5);
    camera.lookAt(0, 0, 0);
    scene = new THREE.Scene();

    // lights
    const ambient = new THREE.HemisphereLight(0xffffff, 0x000000, 3);
    scene.add(ambient);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(1, 4, 3).multiplyScalar(3);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.setScalar(2048);
    directionalLight.shadow.bias = -1e-4;
    directionalLight.shadow.normalBias = 1e-4;
    scene.add(directionalLight);

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true });
    renderer.setClearColor( 0x000000, 0 ); // Transparent
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setAnimationLoop(animate);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.classList.add('threejs-demo-canvas');
    document.getElementById('render').appendChild(renderer.domElement);

    stats = new Stats();
    document.body.appendChild(stats.dom);

    // add shadow plane
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(),
        new THREE.ShadowMaterial({
            color: 0x781b60,
            transparent: true,
            opacity: 0.04,
            side: THREE.DoubleSide,
        }),
    );
    plane.position.y = -3;
    plane.rotation.x = -Math.PI / 2;
    plane.scale.setScalar(10);
    plane.receiveShadow = true;
    scene.add(plane);

    // create brushes
    evaluator = new Evaluator();
    baseBrush = new Brush(
        new THREE.IcosahedronGeometry(2, 1),
        new THREE.MeshStandardMaterial({
            flatShading: true,
            color: 0x000000,
            polygonOffset: true,
            roughness: .5,
            polygonOffsetUnits: 1,
            polygonOffsetFactor: 1,
        }),
    );
    brush = new Brush(
        new THREE.CylinderGeometry(.9, 0, 4, 12),
        new THREE.MeshStandardMaterial({
            color: 0x000000,
            polygonOffset: true,
            polygonOffsetUnits: 1,
            polygonOffsetFactor: 1,
        }),
    );
    core = new Brush(
        new THREE.IcosahedronGeometry(1.70, 0),
        new THREE.MeshStandardMaterial({
            flatShading: true,
            color: 0x000aff,
            // transparent: true,
            // opacity: 0.0,
            // emissive: 0x000aff,
            // roughness: 0.0,
            // emissiveIntensity: 10,
            polygonOffset: true,
            polygonOffsetUnits: 1,
            polygonOffsetFactor: 1,
        }),
    );
    core.castShadow = true;
    scene.add(core);

    // Add face labels to the core
    const coreLabels = addLabelsToIcosahedron(core.geometry, faceLabels);
    core.add(coreLabels);

    // Add the liquid inside the 8 ball (murky/foggy water effect)
    const liquidBrush = new Brush(
        new THREE.IcosahedronGeometry(1.85, 1),
        new THREE.MeshPhysicalMaterial({
            transparent: true,
            opacity: 1,
            color: 0x000122,
            roughness: 0.95,
            transmission: 0.5,
            thickness: 1,
            ior: 1.33,
            attenuationColor: 0x1a237e,
            attenuationDistance: 0.7,
            polygonOffset: true,
            polygonOffsetUnits: 1,
            polygonOffsetFactor: 1,
            depthWrite: false,
            fog: true
        }),
    );
    liquidBrush.castShadow = false;
    liquidBrush.receiveShadow = false;
    liquidBrush.rotation.x = .333
    scene.add(liquidBrush);

    // create wireframe
    wireframe = new THREE.Mesh(
        undefined,
        new THREE.MeshBasicMaterial({ color: 0x009688, wireframe: true }),
    );
    scene.add(wireframe);

    // controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 3;
    controls.maxDistance = 50;

    // set up gui
    // const gui = new GUI();
    // gui.add(params, 'operation', { SUBTRACTION, INTERSECTION, ADDITION });
    // gui.add(params, 'wireframe');
    // gui.add(params, 'useGroups');

    window.addEventListener('resize', onWindowResize);
    onWindowResize();
}

function updateCSG() {
    evaluator.useGroups = params.useGroups;
    result = evaluator.evaluate(baseBrush, brush, params.operation, result);
    result.castShadow = true;
    result.receiveShadow = true;
    scene.add(result);
}

function onWindowResize() {
    const container = document.getElementById('render');
    const width = container ? container.clientWidth : window.innerWidth;
    const height = container ? container.clientHeight : window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function animate() {
    // update the transforms
    function randomFace() {
        const geometry = core.geometry;
        geometry.computeFaceNormals?.();
        const faces = geometry.index ? geometry.index.count / 3 : geometry.attributes.position.count / 3;
        const faceIndex = Math.floor(Math.random() * faces);

        let a, b, c;
        if (geometry.index) {
            a = geometry.index.getX(faceIndex * 3);
            b = geometry.index.getX(faceIndex * 3 + 1);
            c = geometry.index.getX(faceIndex * 3 + 2);
        } else {
            a = faceIndex * 3;
            b = faceIndex * 3 + 1;
            c = faceIndex * 3 + 2;
        }

        const pos = geometry.attributes.position;
        const vA = new THREE.Vector3().fromBufferAttribute(pos, a);
        const vB = new THREE.Vector3().fromBufferAttribute(pos, b);
        const vC = new THREE.Vector3().fromBufferAttribute(pos, c);

        const cb = new THREE.Vector3().subVectors(vC, vB);
        const ab = new THREE.Vector3().subVectors(vA, vB);
        const normal = new THREE.Vector3().crossVectors(cb, ab).normalize();

        const up = new THREE.Vector3(0, 1, 0);
        const quat = new THREE.Quaternion().setFromUnitVectors(up, normal);
        core._targetQuat = quat;
        core._lastChange = performance.now();

        if (Math.random() < 0.5) {
            faceLabels[Math.round(faceIndex) % faceLabels.length] = funnyLabels[Math.round(faceIndex) % funnyLabels.length];
            // delete the labels;
            const coreLabels = core.children.find(child => child instanceof THREE.Group);
            if (coreLabels) {
                core.remove(coreLabels);
                // remake the labels
                const newCoreLabels = addLabelsToIcosahedron(core.geometry, faceLabels);
                core.add(newCoreLabels);
            }
        }
    }

    if (!core._targetQuat || !core._lastChange || performance.now() - core._lastChange > 10000) {
        randomFace();
    }
    core.quaternion.slerp(core._targetQuat, 0.01);

    // update the csg
    updateCSG();
    wireframe.geometry = result.geometry;
    wireframe.visible = params.wireframe;

    renderer.render(scene, camera);
    stats.update();
}
</script>
