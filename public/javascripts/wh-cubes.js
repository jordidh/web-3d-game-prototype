/** Constants **/
const boxSize = 90;
const shelfSize = 9;
const boxMargin = 10;
const boxOpacity = 0.15;

/** Variables **/
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

/** Main program **/
init();
animate();

/** Functions **/
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
    camera.up = new THREE.Vector3(0,1,0);
    camera.position.x = cameraStartPosition.x;
    camera.position.y = cameraStartPosition.y;
    camera.position.z = cameraStartPosition.z;
    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xCCCCCC );
    //scene.fog = new THREE.Fog( 0x000000, 250, 1400 );

    // Add lights
    var pointLight = new THREE.PointLight( 0xffffff, 1.5 );
    pointLight.position.set( 0, 4000, 0 );
    pointLight.color.setHSL( Math.random(), 1, 0.5 );
    scene.add( pointLight );

    /*
    scene.add( new THREE.AmbientLight( 0x555555 ) );
    var light = new THREE.SpotLight( 0xffffff, 1.5 );
    light.position.set( 0, 500, 2000 );
    scene.add( light );
    */

    // Create a plane with axis
    var geo1 = new THREE.PlaneBufferGeometry(8000, 8000, 8, 8);
    var mat1 = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
    //var mat1 = new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } );
    var plane = new THREE.Mesh(geo1, mat1);
    scene.add(plane);
    plane.rotateX( - Math.PI / 2);
    // Axis
    var sphereAxis = new THREE.AxesHelper(4200);
    plane.add(sphereAxis);


    // Create the objects
    createShelf('E01', 5, 8, 0, 0, 0, 'z');
    createShelf('E02', 5, 4, 300, 0, 0, 'z');
    createShelf('E03', 5, 7, 400, 0, 0, 'z');
    createShelf('E04', 5, 7, 700, 0, 0, 'z');
    createShelf('E05', 5, 7, -100, 0, 0, 'z');
    createShelf('E06', 5, 5, -1000, 0, 0, 'x');
    createShelf('E07', 5, 5, -1000, 0, 100, 'x');
    createShelf('E08', 5, 5, -1000, 0, 500, 'x');
    createShelf('E09', 5, 5, -1000, 0, 600, 'x');
    createShelf('E10', 7, 10, -1000, 0, 1600, 'x');
    createShelf('E11', 9, 10, -1000, 0, -1600, 'x');
    createShelf('E12', 9, 10, -2000, 0, -1800, 'z');

    createBuffer('BUF01', -2500, 1, -300, 600, 1, 300);
    createBuffer('BUF02', -2500, 1, 100, 600, 1, 300);

    createDock('DOCK_OUT', -2800, 1, -300, 50, 400, 300);
    createDock('DOCK_IN', -2800, 1, 100, 50, 400, 300);

    // Render
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    document.addEventListener( 'keypress', onKeyPress, false );
    renderer.domElement.addEventListener( 'mousemove', onMouseMove );
}

function onMouseMove( e ) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

// Key pressed to move camera
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

        case 110: //n: hide one
            hideOneShelf('E01');
            break;
        case 109: //m: hide all
            hideAllExceptShelf('E', 'E01');
            break;

        case 98: //b
            fadeAllShelf('E', 1);
            break;
        case 66: //B
            fadeAllShelf('E', boxOpacity);
            break;
        case 118: //v
            fadeAllShelfExcept('E', 'E04', boxOpacity);
            break;
        case 86: //V
            fadeOneShelf('E01', boxOpacity);
            break;
        case 99: //c
            let nodesToBlur = ['E01-X4-Y5', 'E03-X4-Y0', 'E04-X1-Y5'];
            fadeNodes('E', nodesToBlur, 1);
            break;
        case 67: //C
            let nodesNotToBlur = ['E01-X4-Y5', 'E03-X4-Y0', 'E04-X1-Y5'];
            fadeAllShelfsExcept('E', nodesNotToBlur, boxOpacity);
            break;
        case 120: //x
            hideAllShelfStructure();
            break;

        case 105: //i: camera returns to initial position
            camera.up = new THREE.Vector3(0,1,0);
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

function rotateCamera( speed, xDistance, yDistance, zDistance ) {
    var speed = Date.now() * speed;

    camera.position.x = Math.cos(speed) * xDistance;
    camera.position.y = yDistance;
    camera.position.z = Math.sin(speed) * zDistance;

    //camera.lookAt(scene.position); //0,0,0
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

    // Keep the camera up
    camera.up = new THREE.Vector3(0,1,0);

    camera.clearViewOffset();
}

function render() {
    controls.update();

    /*
    // Rotate continuously
    rotateCamera(0.0001,
        cameraStartPosition.x + cameraModification.x,
        cameraStartPosition.y + cameraModification.y,
        cameraStartPosition.z + cameraModification.z);
        */

    // Move through mouse
    pick();
    renderer.render( scene, camera );
}

/** Warehouse functions **/
function createBuffer(bufferName, initialX, initialY, initialZ, sizeX, sizeY, sizeZ) {
    // Box texture
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load( 'textures/wood-cube-01.jpg' );

    // Buffer
    var geometry  = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
    var boxMaterial = new THREE.MeshBasicMaterial({color: 0xffd400, wireframe: false});
    var cube = new THREE.Mesh(geometry, boxMaterial);

    // Set the position, by default is (0, 0, 0)
    cube.position.set(
        ( sizeX / 2 ) + initialX,
        ( sizeY / 2) + initialY,
        ( sizeZ / 2) + initialZ);  // Center of the box
    cube.name = bufferName;
    scene.add(cube);

    // Show buffer name
    var loader = new THREE.FontLoader();
    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
        var xMid, text;
        var color = 0x000000;
        var matLite = new THREE.MeshBasicMaterial( {
            color: color,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide
        } );
        var shapes = font.generateShapes( bufferName, 50 );
        var geometry = new THREE.ShapeBufferGeometry( shapes );
        geometry.computeBoundingBox();
        //xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        //geometry.translate( xMid, 0, 0 );
        geometry.translate( initialX, (initialY + sizeY) + 50, initialZ );
        // make shape ( N.B. edge view not visible )
        text = new THREE.Mesh( geometry, matLite );
        scene.add( text );
    } ); //end load function
}

function createDock(dockName, initialX, initialY, initialZ, sizeX, sizeY, sizeZ) {
    // Box texture
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load( 'textures/wood-cube-01.jpg' );

    // Dock
    var geometry  = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
    var boxMaterial = new THREE.MeshBasicMaterial({color: 0x333333, wireframe: true});
    var cube = new THREE.Mesh(geometry, boxMaterial);

    // Set the position, by default is (0, 0, 0)
    cube.position.set(
        ( sizeX / 2 ) + initialX,
        ( sizeY / 2) + initialY,
        ( sizeZ / 2) + initialZ);  // Center of the box
    cube.name = dockName;
    scene.add(cube);

    // Show dock name
    var loader = new THREE.FontLoader();
    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
        var xMid, text;
        var color = 0x000000;
        var matLite = new THREE.MeshBasicMaterial( {
            color: color,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide
        } );
        var shapes = font.generateShapes( dockName, 50 );
        var geometry = new THREE.ShapeBufferGeometry( shapes );
        geometry.computeBoundingBox();
        //xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
        //geometry.translate( xMid, 0, 0 );
        geometry.translate( initialX, (initialY + sizeY) + 50, initialZ );
        // make shape ( N.B. edge view not visible )
        text = new THREE.Mesh( geometry, matLite );
        scene.add( text );
    } ); //end load function
}

function createShelf(shelfPrefix, numRows, numColumns, initialX, initialY, initialZ, orientation) {
    // Box texture
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load( 'textures/wood-cube-01.jpg' );

    for ( var row = 0; row < numRows; row++ ) {
        for ( var col = 0; col < numColumns; col++ ) {
            var geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize, 1, 1, 1);
            var boxMaterial = new THREE.MeshBasicMaterial( { map: texture, opacity: 1, transparent: true } );
            //var material = new THREE.MeshBasicMaterial({color: 0xfffff, wireframe: true});
            var cube = new THREE.Mesh(geometry, boxMaterial);

            // Set the position, by default is (0, 0, 0)
            if (orientation === 'z') {
                cube.position.set(
                    ( boxSize / 2 ) + initialX,
                    (( boxSize + boxMargin ) * row) + ( boxSize / 2) + initialY,
                    (( boxSize + boxMargin ) * col) + ( boxSize / 2) + initialZ);  // Center of the box
            } else {
                cube.position.set(
                    (( boxSize + boxMargin ) * col) + ( boxSize / 2) + initialX,
                    (( boxSize + boxMargin ) * row) + ( boxSize / 2) + initialY,
                    ( boxSize / 2 ) + initialZ);  // Center of the box
            }

            cube.name = shelfPrefix + '-X' + row.toString() + '-Y' + col.toString();

            console.log('Created ' + cube.name);
            scene.add(cube);
        }
    }

    // Create the shelf structure

    // Barres travesseres
    for ( var row = 1; row < numRows; row++ ) {
        var geometry;
        if (orientation === 'z') {
            geometry = new THREE.BoxGeometry((boxSize + boxMargin), shelfSize, (boxSize + boxMargin) * numColumns,  1, 1, 1);
        }
        else {
            geometry = new THREE.BoxGeometry((boxSize + boxMargin) * numColumns, shelfSize, (boxSize + boxMargin), 1, 1, 1);
        }
        var boxMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: true});
        var cube = new THREE.Mesh(geometry, boxMaterial);

        // Set the position, by default is (0, 0, 0)
        if (orientation === 'z') {
            cube.position.set(
                ( boxSize / 2 ) + initialX,
                (( shelfSize + boxSize ) * row) + ( shelfSize / 2) + initialY,
                /*((boxSize + boxMargin) * numRows) / 2 + initialZ*/
                ((boxSize + boxMargin) * numColumns) / 2 + initialZ);  // Center of the box
        } else {
            cube.position.set(
                ((boxSize + boxMargin) * numColumns) / 2 + initialX,
                (( shelfSize + boxSize ) * row) + ( shelfSize / 2) + initialY,
                ( boxSize / 2 ) + initialZ);  // Center of the box
        }
        cube.name = 'TRAVESSER-' + shelfPrefix + '-X' + row.toString();
        scene.add(cube);
    }

    // Puntals verticals
    for ( var col = 0; col < numColumns + 1; col++ ) {
        var geometry;
        if (orientation === 'z') {
            geometry = new THREE.BoxGeometry((boxSize + boxMargin), (boxSize + boxMargin) * numRows, shelfSize, 1, 1, 1);
        }
        else {
            geometry = new THREE.BoxGeometry(shelfSize, (boxSize + boxMargin) * numRows, (boxSize + boxMargin), 1, 1, 1);
        }
        //var boxMaterial = new THREE.MeshBasicMaterial( { map: texture, opacity: 1, transparent: true } );
        var boxMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true, wireframeLinewidth: 10});
        var cube = new THREE.Mesh(geometry, boxMaterial);

        // Set the position, by default is (0, 0, 0)
        if (orientation === 'z') {
            cube.position.set(
                ( boxSize / 2 ) + initialX,
                ((boxSize + boxMargin) * numRows) / 2 + initialY,
                (( shelfSize + boxSize ) * col) + ( shelfSize / 2) + initialZ);  // Center of the box
        } else {
            cube.position.set(
                (( shelfSize + boxSize ) * col) + ( shelfSize / 2) + initialX,
                ((boxSize + boxMargin) * numRows) / 2 + initialY,
                ( boxSize / 2 ) + initialZ);  // Center of the box
        }
        cube.name = 'PUNTAL-' + shelfPrefix + '-X' + row.toString();
        scene.add(cube);
    }

    // Show Shelf name
    var loader = new THREE.FontLoader();
    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
        var xMid, text;
        var color = 0xff2222;
        var matLite = new THREE.MeshBasicMaterial( {
            color: color,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide
        } );
        var shapes = font.generateShapes( shelfPrefix, 50 );
        var geometry = new THREE.ShapeBufferGeometry( shapes );
        geometry.computeBoundingBox();
        if (orientation === 'z') {
            geometry.translate( (( boxSize ) / 2) + initialX,
                ((boxSize + boxMargin) * (numRows + 1)) + initialY,
                (((boxSize + boxMargin) * numColumns ) / 2) + initialZ );
        } else {
            geometry.translate( ((( boxSize + boxMargin) * numColumns ) / 2) + initialX,
                ((boxSize + boxMargin) * (numRows + 1)) + initialY,
                ((boxSize + boxMargin) / 2) + initialZ );
        }
        // make shape ( N.B. edge view not visible )
        text = new THREE.Mesh( geometry, matLite );
        scene.add( text );
    } ); //end load function
}

function hideOneShelf(shelfPrefix) {

    scene.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            if (node.name.startsWith(shelfPrefix)) {
                node.visible = !node.visible;
            }
        }
    } );
}

function hideAllExceptShelf(commonShelfPrefix, visibleShelfPrefix) {

    scene.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            if (node.name.startsWith(commonShelfPrefix)) {
                if (!node.name.startsWith(visibleShelfPrefix)) {
                    node.visible = !node.visible;
                }
            }
        }
    } );
}

function hideAllShelfStructure() {

    scene.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            if (node.name.startsWith('PUNTAL-')) {
                node.visible = !node.visible;
            } else if (node.name.startsWith('TRAVESSER-')) {
                node.visible = !node.visible;
            }
        }
    } );
}

function fadeOneShelf(shelfPrefix, opacity) {
    scene.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            if (node.name.startsWith(shelfPrefix)) {
                node.material.opacity = opacity;
            }
        }
    } );
}

function fadeAllShelfExcept(commonShelfPrefix, visibleShelfPrefix, opacity) {

    scene.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            if (node.name.startsWith(commonShelfPrefix)) {
                if (!node.name.startsWith(visibleShelfPrefix)) {
                    node.material.opacity = opacity;
                }
            }
        }
    } );
}

function fadeAllShelf(commonShelfPrefix, opacity) {

    scene.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            if (node.name.startsWith(commonShelfPrefix)) {
                node.material.opacity = opacity;
            }
        }
    } );
}

function fadeNodes(commonShelfPrefix, nodesToBlur, opacity) {

    scene.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            if (node.name.startsWith(commonShelfPrefix)) {
                for(var i = 0; i < nodesToBlur.length; i++)
                {
                    if(nodesToBlur[i] === node.name) {
                        node.material.opacity = opacity;
                        console.log('Comparing ' + nodesToBlur[i] + ' with ' + node.name);
                    }
                }
            }
        }
    } );
}

function fadeAllShelfsExcept(commonShelfPrefix, nodesNotToBlur, opacity) {

    scene.traverse( function( node ) {
        if ( node instanceof THREE.Mesh ) {
            if (node.name.startsWith(commonShelfPrefix)) {
                if (nodesNotToBlur.includes(node.name)) {
                    node.material.opacity = 1;
                } else {
                    node.material.opacity = opacity;
                }
            }
        }
    } );
}
