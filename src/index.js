import css from './css/main.css'
import * as THREE from 'three'
import CreateLoop from 'raf-loop'
let OrbitControls = require('three-orbit-controls')(THREE)

let scene, camera, renderer, canvas, controls, clock
let geometry, material, mesh, pointLight3

init()

function init() {

    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 10000)
    // controls = new OrbitControls(camera)
    camera.position.z = 500
    camera.position.y = -50
    camera.rotation.x = 45 * Math.PI / 180

    // controls = new OrbitControls(camera)

    clock = new THREE.Clock()

    var light = new THREE.AmbientLight('#CD3438') // soft white light
    scene.add(light)

    var directionalLight = new THREE.DirectionalLight(0x888888, 0.5)
    directionalLight.position.set(0, 1, 0).normalize()
    //scene.add(directionalLight);

    var pointLight = new THREE.PointLight(0x888888, 1.3, 300);
    pointLight.position.set(0, 100, 350);
    // scene.add(pointLight);

    // pointLight.castShadow = true;
    // pointLight.shadow.camera.near = 1;
    // pointLight.shadow.camera.far = 500;
    // pointLight.shadowCameraVisible = true;
    // pointLight.shadow.bias = 0.01;

    // var pointLight2 = new THREE.PointLight(0xFFFFFF, 1, 125);
    // pointLight2.position.set(0, 0, 1000);
    // scene.add(pointLight2);
    //
    //


    pointLight3 = createLight('#ffffff');
    pointLight3.position.z = 400;
    pointLight3.position.y = 30;
    pointLight3.position.x = 50;
    scene.add(pointLight3);

    // pointLight2.cameraVisisble = true
    // pointLight2.castShadow = true;
    // pointLight2.shadow.camera.near = 1;
    // pointLight2.shadow.camera.far = 500;
    // // pointLight2.shadowCameraVisible = true;
    // pointLight2.shadow.bias = 0.01;

    scene.fog = new THREE.Fog(0xCD3438, 200, 400);

    let loader = new THREE.JSONLoader()
    loader.load(
        // resource URL
        './assets/mountain-xlow.min.js',
        // Function when resource is loaded
        function (geometry, materials) {
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

            // camera.up = new THREE.Vector3(0, 0, 1);
            // camera.lookAt(new THREE.Vector3(0, 0, 350)); // In order to keep the same camera target during rotation
            scene.add(mesh);
            animate()
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

    // document.addEventListener('scroll', function(){
    //   mesh.rotation.x+= 0.03;
    // })
}

function createLight( color ) {

    var pointLight = new THREE.PointLight( color, 1., 150 );
    pointLight.castShadow = true;
    pointLight.shadow.camera.near = 1;
    pointLight.shadow.camera.far = 200;
    // pointLight.shadowCameraVisible = true;
    pointLight.shadow.bias = 0;

    var geometry = new THREE.SphereGeometry( 0.5, 12, 6 );
    var material = new THREE.MeshBasicMaterial( { color: color } );
    var sphere = new THREE.Mesh( geometry, material );
    pointLight.add( sphere );

    return pointLight

  }

function animate() {

    requestAnimationFrame(animate)

    // mesh.rotation.x += 0.01
    mesh.rotation.x -= 0.003
    let xOffset = Math.sin((clock.getElapsedTime() + clock.getDelta()))
    pointLight3.position.x += xOffset
    // pointLight3.position.y += Math.sin(clock.getElapsedTime() + clock.getDelta() * 2)

    renderer.render(scene, camera)

}