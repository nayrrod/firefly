import css from './css/main.css'
import * as THREE from 'three'
import Resize from 'throttled-resize'

let OrbitControls = require('three-orbit-controls')(THREE)

let scene, camera, renderer, canvas, controls, clock
let geometry, material, mesh, firefly
let WIDTH

init()

function init() {
    WIDTH = window.innerWidth
    let resize = new Resize()
    resize.on('resize:end', handleResize)
    scene = new THREE.Scene()
    // Place and rotate the camera to face the top of the model
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000)
    camera.rotation.x = 45 * Math.PI / 180
    camera.position.y = -50
    camera.position.z = 500
    camera.initialPosition = camera.position.clone()

    clock = new THREE.Clock()

    let ambientLight = new THREE.AmbientLight('#CD3438')
    scene.add(ambientLight)

    //  Overhead light
    let directionalLight = new THREE.DirectionalLight(0x888888, 0.5)
    directionalLight.position.set(0, 1, 0).normalize()

    // Main visibility point light
    let pointLight = new THREE.PointLight(0x888888, 1.3, 300)
    pointLight.position.set(0, 100, 350)

    // Create the firefly
    firefly = createLight('#ffffff')
    firefly.position.z = 400
    firefly.position.y = 30
    firefly.position.x = 0
    firefly.initialPosition = firefly.position.clone()
    scene.add(firefly)

    // Add some fog matching the DOM background color
    scene.fog = new THREE.Fog(0xCD3438, 200, 400)


    THREE.DefaultLoadingManager.onProgress = function (item, loaded, total) {
        // For some reason this callback is only called at the end
        // Probably because of incompatibility with the model, which was created
        // with and earlier version of three.js
        console.log(item, loaded, total)
    }

    let loader = new THREE.JSONLoader()
    loader.load(
        // Resource URL
        './assets/mountain-xlow.min.js',
        // Function when resource is loaded
        function (geometry, materials) {
            // When model is loaded add it to the scene
            geometry.computeFlatVertexNormals()
            let wireframeMaterial = new THREE.MeshLambertMaterial({
                color: '#ee4b39',
            })
            mesh = new THREE.Mesh(geometry, wireframeMaterial)
            mesh.scale.set(20, 20, 20)

            mesh.position.z = 0
            mesh.position.x = 0
            mesh.position.y = 0

            mesh.rotation.z = 0
            mesh.rotation.x = 30
            mesh.rotation.y = 0

            mesh.receiveShadow = true

            // Launch the animation loop
            scene.add(mesh)
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
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.BasicShadowMap
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
}

//  Utility function creating a point light with a child sphere geometry
function createLight(color) {
    let pointLight = new THREE.PointLight(color, 1., 150)
    pointLight.castShadow = true
    pointLight.shadow.camera.near = 1
    pointLight.shadow.camera.far = 200
    pointLight.shadow.bias = 0

    let geometry = new THREE.SphereGeometry(0.5, 12, 6)
    let material = new THREE.MeshBasicMaterial({
        color: color
    })
    let sphere = new THREE.Mesh(geometry, material)
    pointLight.add(sphere)

    return pointLight
}

function animate() {

    requestAnimationFrame(animate)
    // Rotate the mountains model
    let delta = clock.getDelta()
    mesh.rotation.x -= delta * 0.17
    // Displace the firefly from its initial position along a sinusoid
    let xOffset = Math.sin(clock.getElapsedTime() % (2 * Math.PI))
    // Interpolate the offset using window width
    xOffset = xOffset * (WIDTH / 33.6)
    firefly.position.x = firefly.initialPosition.x + xOffset
    // Make the firefly size jitter, to simulate flickering
    let rand = Math.random() * (1 - 0.5) + 0.5
    firefly.scale.set(rand, rand, rand)

    renderer.render(scene, camera)

}
