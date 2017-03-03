import css from './css/main.css'
import * as THREE from 'three'
import CreateLoop from 'raf-loop'
import Resize from 'throttled-resize';

let OrbitControls = require('three-orbit-controls')(THREE)

let scene, camera, renderer, canvas, controls, clock
let geometry, material, mesh, pointLight3
let WIDTH

init()

function init() {
    WIDTH = window.innerWidth
    let resize = new Resize()
    resize.on('resize:end', handleResize)
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.z = 500
    camera.position.y = -50
    camera.rotation.x = 45 * Math.PI / 180

    clock = new THREE.Clock()

    var light = new THREE.AmbientLight('#CD3438')
    scene.add(light)

    var directionalLight = new THREE.DirectionalLight(0x888888, 0.5)
    directionalLight.position.set(0, 1, 0).normalize()

    var pointLight = new THREE.PointLight(0x888888, 1.3, 300);
    pointLight.position.set(0, 100, 350);

    pointLight3 = createLight('#ffffff')
    pointLight3.position.z = 400
    pointLight3.position.y = 30
    pointLight3.position.x = 0
    pointLight3.initialPosition = pointLight3.position.clone()
    scene.add(pointLight3)

    scene.fog = new THREE.Fog(0xCD3438, 200, 400);


    THREE.DefaultLoadingManager.onProgress = function (item, loaded, total) {
        // For some reason this callback is only called at the end
        // Probably because of incompatibility with the model, which was created
        // with and earlier version of three.js
        console.log(item, loaded, total);
    };

    let loader = new THREE.JSONLoader()
    loader.load(
        // Resource URL
        './assets/mountain-xlow.min.js',
        // Function when resource is loaded
        function (geometry, materials) {
            // When model is loaded add it to the scene
            geometry.computeFlatVertexNormals();
            var wireframeMaterial = new THREE.MeshLambertMaterial({
                color: '#ee4b39',
            });
            mesh = new THREE.Mesh(geometry, wireframeMaterial);
            mesh.scale.set(20, 20, 20);

            mesh.position.z = 0;
            mesh.position.x = 0;
            mesh.position.y = 0;

            mesh.rotation.z = 0;
            mesh.rotation.x = 30;
            mesh.rotation.y = 0;

            mesh.receiveShadow = true;

            // Launch the animation loop
            scene.add(mesh);
            animate()
            document.getElementById('loading-overlay').remove()
        }
    )

    canvas = document.getElementById('threejs-canvas')
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
}

function handleResize() {
    //On resize, only update the camera frustrum, position and renderer size
    WIDTH = window.innerWidth
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.z = 500
    camera.position.y = -50
    camera.rotation.x = 45 * Math.PI / 180
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
    // console.log('resize fired')
}


function createLight(color) {
    var pointLight = new THREE.PointLight(color, 1., 150);
    pointLight.castShadow = true;
    pointLight.shadow.camera.near = 1;
    pointLight.shadow.camera.far = 200;
    pointLight.shadow.bias = 0;

    var geometry = new THREE.SphereGeometry(0.5, 12, 6);
    var material = new THREE.MeshBasicMaterial({
        color: color
    });
    var sphere = new THREE.Mesh(geometry, material);
    pointLight.add(sphere);

    return pointLight

}

function animate() {

    requestAnimationFrame(animate)
    // Rotate the mountains model
    let delta = clock.getDelta()
    mesh.rotation.x -= delta * 0.17
    // Animate the firefly position along a sinusoid
    let xOffset = Math.sin(clock.getElapsedTime() % (2 * Math.PI))
    xOffset = xOffset * (WIDTH / 33.6)
    pointLight3.position.x = pointLight3.initialPosition.x + xOffset
    // Make the firefly size jitter
    let rand = Math.random() * (1 - 0.5) + 0.5
    pointLight3.scale.set(rand, rand, rand)

    renderer.render(scene, camera)

}
