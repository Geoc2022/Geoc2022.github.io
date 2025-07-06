+++
date = '2025-07-06T02:06:27-04:00'
draft = false
title = '8 Ball'
summary = "Ask the 8 Ball a question and get an answer using three.js"
description = "Ask the 8 Ball a question and get an answer using three.js"
readTime = false
autonumber = false
math = false
hideBackToTop = false
tags = [ "8 ball", "three.js", "webgl", "interactive" ]
showTags = false
fediverse = "@geoc@mathstodon.xyz"
+++

<div id="info">
    <a href="https://threejs.org" target="_blank" rel="noopener">three.js</a> bvh csg -
    <a href="https://github.com/gkjohnson/three-bvh-csg" target="_blank" rel="noopener">three-bvh-csg</a><br/>
    See <a href="https://github.com/gkjohnson/three-bvh-csg" target="_blank" rel="noopener">main project repository</a> for more information and examples on constructive solid geometry.
</div>

<style>
    #info {
        margin-bottom: 1em;
        font-size: 1em;
        background: var(--bg);
        padding: 0.5em 1em;
        border-radius: 6px;
    }
    .threejs-demo-canvas {
        width: 100vw;
        height: 80vh;
        display: block;
        margin: 0 auto;
        background: var(--bg)
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
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
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

init();

function init() {
    // environment
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.set(-1, 1, 1).normalize().multiplyScalar(10);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

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
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
    renderer.setAnimationLoop(animate);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.classList.add('threejs-demo-canvas');
    document.body.appendChild(renderer.domElement);

    stats = new Stats();
    document.body.appendChild(stats.dom);

    // add shadow plane
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(),
        new THREE.ShadowMaterial({
            color: 0xd81b60,
            transparent: true,
            opacity: 0.075,
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
        new THREE.IcosahedronGeometry(2, 2),
        new THREE.MeshStandardMaterial({
            flatShading: true,
            color: 0x000000,
            polygonOffset: true,
            roughness: 0.0,
            polygonOffsetUnits: 1,
            polygonOffsetFactor: 1,
        }),
    );
    // liquidBrush = new Brush(
    //     new THREE.IcosahedronGeometry(1.9, 2),
    //     new THREE.MeshStandardMaterial({
    //         trasnsparent: true,
    //         opacity: 0.5,
    //         color: 0x000aff,
    //         polygonOffset: true,
    //         roughness: 0.0,
    //         polygonOffsetUnits: 1,
    //         polygonOffsetFactor: 1,
    //     }),
    // );
    brush = new Brush(
        new THREE.CylinderGeometry(1, 0, 4, 32),
        new THREE.MeshStandardMaterial({
            color: 0x000000,
            polygonOffset: true,
            polygonOffsetUnits: 1,
            polygonOffsetFactor: 1,
        }),
    );
    core = new Brush(
        new THREE.IcosahedronGeometry(1.75, 0),
        new THREE.MeshStandardMaterial({
            flatShading: true,
            color: 0x000aff,
            emissive: 0x0000ff,
            emissiveIntensity: 0.35,
            polygonOffset: true,
            polygonOffsetUnits: 1,
            polygonOffsetFactor: 1,
        }),
    );
    core.castShadow = true;
    scene.add(core);

    // const coreWireframe = new THREE.LineSegments(
    //     new THREE.WireframeGeometry(core.geometry),
    //     new THREE.LineBasicMaterial({ color: 0xffffff })
    // );
    // core.add(coreWireframe);

    // create wireframe
    wireframe = new THREE.Mesh(
        undefined,
        new THREE.MeshBasicMaterial({ color: 0x009688, wireframe: true }),
    );
    scene.add(wireframe);

    // controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 5;
    controls.maxDistance = 75;

    // set up gui
    const gui = new GUI();
    gui.add(params, 'operation', { SUBTRACTION, INTERSECTION, ADDITION });
    gui.add(params, 'wireframe');
    gui.add(params, 'useGroups');

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
    camera.aspect = window.innerWidth / (window.innerHeight * 0.8);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
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
    }

    if (!core._targetQuat || !core._lastChange || performance.now() - core._lastChange > 3000) {
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
