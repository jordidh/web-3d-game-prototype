// Create the scene + camera + renderer
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Create the objects of the scene
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var geometry = new THREE.BoxGeometry( 1, 1, 1 );

//var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var textureLoader = new THREE.TextureLoader();
var texture = textureLoader.load( 'textures/wood-cube-01.jpg' );
var material = new THREE.MeshBasicMaterial( { map: texture } );

var cube01 = new THREE.Mesh( geometry, material );
cube01.position.x = 1;
var cube02 = new THREE.Mesh( geometry, material );
cube02.position.x = 2.2;
scene.add( cube01 );
scene.add( cube02 );

camera.position.z = 5;

// Animate the scene (without this can't see anything)
// Render the scene each time the screen is refreshed
var animate = function() {
    requestAnimationFrame( animate );

    // Move the cube
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;

    // Move the camera
    //camera.position.x += 0.01;
    //camera.position.y += 0.01;
    //camera.position.z += 0.01;

    // Call to three.js render
    renderer.render( scene, camera );
};

animate();