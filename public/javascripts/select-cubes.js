// Variables
var container;
var camera, controls, scene, renderer;
var pickingData = [], pickingTexture, pickingScene;
var highlightBox;
var mouse = new THREE.Vector2();
var offset = new THREE.Vector3( 10, 10, 10 );
var radius = 500;
var angle = 0;
var cameraStartPosition = new THREE.Vector3( 3000, 1500, 3000 );
var cameraModification = new THREE.Vector3( 0, 0, 0 );

init();
animate();

// Functions
function init() {

    // Create the div in the HTML tho show the scene
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    var info = document.createElement( 'div' );
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.innerHTML = '<a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> webgl - interactive cubes';
    container.appendChild( info );


    // Create the scene
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 20000 );
    //camera.position.z = 1000;
    camera.up = new THREE.Vector3(0,1,0);
    camera.position.set(cameraStartPosition);
    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    pickingScene = new THREE.Scene();
    pickingTexture = new THREE.WebGLRenderTarget( 1, 1 );
    scene.add( new THREE.AmbientLight( 0x555555 ) );
    var light = new THREE.SpotLight( 0xffffff, 1.5 );
    light.position.set( 0, 500, 2000 );
    scene.add( light );


    var geo1 = new THREE.PlaneBufferGeometry(8000, 8000, 8, 8);
    var mat1 = new THREE.MeshBasicMaterial({ color: 0x008800, side: THREE.DoubleSide });
    var plane1 = new THREE.Mesh(geo1, mat1);
    scene.add(plane1);
    plane1.rotateX( - Math.PI / 2);

    var sphereAxis = new THREE.AxesHelper(4200);
    plane1.add(sphereAxis);


    var pickingMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

    //var defaultMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true, vertexColors: THREE.VertexColors, shininess: 0	} );
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load( 'textures/wood-cube-01.jpg' );
    var defaultMaterial = new THREE.MeshBasicMaterial( { map: texture } );

    function applyVertexColors( geometry, color ) {
        var position = geometry.attributes.position;
        var colors = [];
        for ( var i = 0; i < position.count; i ++ ) {
            colors.push( color.r, color.g, color.b );
        }
        geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    }
    var geometriesDrawn = [];
    var geometriesPicking = [];
    var matrix = new THREE.Matrix4();
    var quaternion = new THREE.Quaternion();
    var color = new THREE.Color();

    // Estanteria 1
    for ( var i = 0; i < 200; i ++ ) {
        var geometry = new THREE.BoxBufferGeometry();
        var position = new THREE.Vector3();
        position.x = (Math.floor((i % 100) / 10) * 100) + 50; //Math.random() * 10000 - 5000;
        position.y = ((i % 10) * 100) + 50; //Math.random() * 6000 - 3000;
        position.z = (Math.floor(i / 100) * 100) + 50; //Math.random() * 8000 - 4000;
        var rotation = new THREE.Euler();
        rotation.x = 0; //Math.random() * 2 * Math.PI;
        rotation.y = 0; //Math.random() * 2 * Math.PI;
        rotation.z = 0; //Math.random() * 2 * Math.PI;
        var scale = new THREE.Vector3();
        scale.x = 90; //Math.random() * 200 + 100;
        scale.y = 90; //Math.random() * 200 + 100;
        scale.z = 90; //Math.random() * 200 + 100;
        quaternion.setFromEuler( rotation, false );
        matrix.compose( position, quaternion, scale );
        geometry.applyMatrix( matrix );
        // give the geometry's vertices a random color, to be displayed
        //applyVertexColors( geometry, color.setHex( Math.random() * 0xffffff ) );
        applyVertexColors( geometry, color.setHex( (i % 10) / 10  * 0xffffff ) );

        geometry.name = 'E01-X000' + i.toString();

        geometriesDrawn.push( geometry );
        geometry = geometry.clone();
        // give the geometry's vertices a color corresponding to the "id"
        applyVertexColors( geometry, color.setHex( i ) );
        geometriesPicking.push( geometry );
    }

    // Estanteria 2
    for ( var i = 0; i < 200; i ++ ) {
        var geometry = new THREE.BoxBufferGeometry();
        var position = new THREE.Vector3();
        position.x = (Math.floor((i % 100) / 10) * 100) + 50; //Math.random() * 10000 - 5000;
        position.y = ((i % 10) * 100) + 50; //Math.random() * 6000 - 3000;
        position.z = ((Math.floor(i / 100) * 100) + 500) + 50; //Math.random() * 8000 - 4000;
        var rotation = new THREE.Euler();
        rotation.x = 0; //Math.random() * 2 * Math.PI;
        rotation.y = 0; //Math.random() * 2 * Math.PI;
        rotation.z = 0; //Math.random() * 2 * Math.PI;
        var scale = new THREE.Vector3();
        scale.x = 90; //Math.random() * 200 + 100;
        scale.y = 90; //Math.random() * 200 + 100;
        scale.z = 90; //Math.random() * 200 + 100;
        quaternion.setFromEuler( rotation, false );
        matrix.compose( position, quaternion, scale );
        geometry.applyMatrix( matrix );
        // give the geometry's vertices a random color, to be displayed
        //applyVertexColors( geometry, color.setHex( Math.random() * 0xffffff ) );
        applyVertexColors( geometry, color.setHex( (i % 10) / 10  * 0xffffff ) );

        geometry.name = 'E02-X' + ("000" + i.toString()).slice(-4);

        geometriesDrawn.push( geometry );
        geometry = geometry.clone();
        // give the geometry's vertices a color corresponding to the "id"
        applyVertexColors( geometry, color.setHex( i ) );
        geometriesPicking.push( geometry );
    }

    // Estanteria 3
    for ( var i = 0; i < 200; i ++ ) {
        var geometry = new THREE.BoxBufferGeometry();
        var position = new THREE.Vector3();
        position.x = (Math.floor((i % 100) / 10) * 100) + 50; //Math.random() * 10000 - 5000;
        position.y = ((i % 10) * 100) + 50; //Math.random() * 6000 - 3000;
        position.z = ((Math.floor(i / 100) * 100) + 1000) + 50; //Math.random() * 8000 - 4000;
        var rotation = new THREE.Euler();
        rotation.x = 0; //Math.random() * 2 * Math.PI;
        rotation.y = 0; //Math.random() * 2 * Math.PI;
        rotation.z = 0; //Math.random() * 2 * Math.PI;
        var scale = new THREE.Vector3();
        scale.x = 90; //Math.random() * 200 + 100;
        scale.y = 90; //Math.random() * 200 + 100;
        scale.z = 90; //Math.random() * 200 + 100;
        quaternion.setFromEuler( rotation, false );
        matrix.compose( position, quaternion, scale );
        geometry.applyMatrix( matrix );
        // give the geometry's vertices a random color, to be displayed
        //applyVertexColors( geometry, color.setHex( Math.random() * 0xffffff ) );
        applyVertexColors( geometry, color.setHex( (i % 10) / 10  * 0xffffff ) );

        geometry.name = 'E03-X' + ("000" + i.toString()).slice(-4);

        geometriesDrawn.push( geometry );
        geometry = geometry.clone();
        // give the geometry's vertices a color corresponding to the "id"
        applyVertexColors( geometry, color.setHex( i ) );
        geometriesPicking.push( geometry );
    }

    var objects = new THREE.Mesh( THREE.BufferGeometryUtils.mergeBufferGeometries( geometriesDrawn ), defaultMaterial );
    scene.add( objects );

    //console.log("Objects in scene " + objects.name);
    pickingScene.add( new THREE.Mesh( THREE.BufferGeometryUtils.mergeBufferGeometries( geometriesPicking ), pickingMaterial ) );
    highlightBox = new THREE.Mesh(
        new THREE.BoxBufferGeometry(),
        new THREE.MeshLambertMaterial( { color: 0xffff00 }
        ) );
    scene.add( highlightBox );

    /*
    // Estanteria 4: Feta de cubs
    for ( var i = 0; i < 1; i ++ ) {
        //var geometry = new THREE.BoxGeometry((-i * 100), (i * 100), 0, (-i * 100) + 90, (i * 100) + 90, 90);
        var geometry = new THREE.BoxGeometry(-200, 200, 0, -90, 90, 90);
        var material = new THREE.MeshBasicMaterial({color: 0xfffff, wireframe: true});
        var cube = new THREE.Mesh(geometry, material);
        cube.name = 'CUBE' + i.toString();
        scene.add(cube);
    }
    */


    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    renderer.domElement.addEventListener( 'mousemove', onMouseMove );
    //renderer.domElement.addEventListener( 'mousedown', onMouseDown );
    //renderer.domElement.addEventListener( 'keypress', onKeyPress, false );
    document.addEventListener( 'keypress', onKeyPress, false );

    /*
    console.log('camera x' + camera.position.x);
    console.log('camera y' + camera.position.y);
    console.log('camera z' + camera.position.z);
    */
}

function onMouseMove( e ) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

/*
// Change camera
function onMouseDown( e ) {
    //console.log('onMouseClick');

    var isRightMB;
    e = e || window.event;

    if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = e.which == 3;
    else if ("button" in e)  // IE, Opera
        isRightMB = e.button == 2;

    if (isRightMB) {
        //console.log('onMouseClick is right button');
        camera.position.set( e.clientX,e.clientY, 1000 );
        camera.up = new THREE.Vector3( e.clientX, e.clientY, 0 );
        camera.lookAt( new THREE.Vector3( e.clientX, e.clientY, 0 ) );
        //camera.setViewOffset( window.innerWidth, window.innerHeight, );
    }
}
*/

function moveObjects() {
    scene.objects.forEachGlyph();
}

// Change camera
function onKeyPress( e ) {
    //console.log('onMouseClick');
    var key = e.which || e.keyCode;

    var delta = 70;

    switch(key){
        case 100 : //d: aproximar a (0, ,0)
            cameraModification.setX(cameraModification.x - delta);
            cameraModification.setZ(cameraModification.z - delta);
            camera.updateProjectionMatrix();
            break;
        case 97 : //a: allunyar de (0, , 0)
            cameraModification.setX(cameraModification.x + delta);
            cameraModification.setZ(cameraModification.z + delta);
            //camera.lookAt(camera.position.x, camera.position.y, camera.position.z + 10000);
            camera.updateProjectionMatrix();
            break;

        case 113 : //q: camera moves to up
            cameraModification.setY(cameraModification.y + delta);
            //camera.lookAt(camera.position.x, camera.position.y, camera.position.z + 10000);
            camera.updateProjectionMatrix();
            break;
        case 122 : //z: camera moves to down
            if ((cameraStartPosition.y + cameraModification.y - delta) > 0) {
                cameraModification.setY(cameraModification.y - delta);
                //camera.lookAt(camera.position.x, camera.position.y, camera.position.z + 10000);
                camera.updateProjectionMatrix();
            }
            break;

        case 110: //n: move lookat to left
            //camera.lookAt.position.copy(new THREE.Vector3(-1000, 0, 0));
            //camera.target.set(new THREE.Vector3(-1000, 0, 0));
            //camera.target.position.copy(new THREE.Vector3(-1000, 0, 0));
            //camera.updateProjectionMatrix();

            scene.traverse( function( node ) {
                if ( node instanceof THREE.Mesh ) {
                    // insert your code here, for example:
                    console.log("Object " + node.name);
                }
            });

            break;
        case 109: //m: move lookat to right
            //camera.lookAt.position.copy(new THREE.Vector3(1000, 0, 0));
            //camera.target.position.copy(new THREE.Vector3(1000, 0, 0));
            //camera.updateProjectionMatrix();
            break;

        case 105: //i: camera returns to initial position
            camera.position.set(cameraStartPosition);
            cameraModification.setX(0);
            cameraModification.setY(0);
            cameraModification.setZ(0);
            //camera.lookAt(camera.position.x, camera.position.y, camera.position.z + 10000);
            break;

    }

    //alert('keypress ' + key);
    console.log('keypress ' + key);
}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function pick() {
    //render the picking scene off-screen
    // set the view offset to represent just a single pixel under the mouse
    camera.setViewOffset(
        renderer.domElement.width,
        renderer.domElement.height,
        mouse.x * window.devicePixelRatio | 0,
        mouse.y * window.devicePixelRatio | 0,
        1,
        1 );
    // render the scene
    renderer.render( pickingScene, camera, pickingTexture );
    // clear the view offset so rendering returns to normal
    camera.clearViewOffset();
    //create buffer for reading single pixel
    var pixelBuffer = new Uint8Array( 4 );
    //read the pixel
    renderer.readRenderTargetPixels( pickingTexture, 0, 0, 1, 1, pixelBuffer );
    //interpret the pixel as an ID
    var id = ( pixelBuffer[ 0 ] << 16 ) | ( pixelBuffer[ 1 ] << 8 ) | ( pixelBuffer[ 2 ] );
}

function rotateCamera( speed, xDistance, yDistance, zDistance ) {
    var speed = Date.now() * speed;

    camera.position.x = Math.cos(speed) * xDistance;
    camera.position.y = yDistance;
    camera.position.z = Math.sin(speed) * zDistance;

    //camera.lookAt(scene.position); //0,0,0
}

function render() {
    controls.update();
    //pick();
    //rotateCamera(0.0005, 3000, 1500, 3000);
    rotateCamera(0.0001,
        cameraStartPosition.x + cameraModification.x,
        cameraStartPosition.y + cameraModification.y,
        cameraStartPosition.z + cameraModification.z);
    renderer.render( scene, camera );
}