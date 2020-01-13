import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// var SampleImagePath = require('/models/head1.fbx');

export const updateIndex = (value, index, setIndex, scene, content)=> {
    var newVal = index+value;
    setIndex(newVal)
    updateScene(scene, content[newVal])
}

export const createScene = (setContent)=>{

    fetch('/models.json')
    .then((r) => r.text())
    .then(text  => {
      setContent(JSON.parse(text))
    })  

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    //lights
    //Ambient
    var lightAmbient = new THREE.AmbientLight( 0x576469 ); // soft white light
    scene.add( lightAmbient );

    //Directional
    var light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
    light.position.set( 0, 1000, 1000 ); 			//default; light shining from top
    light.castShadow = true;            // default false
    scene.add( light );

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    renderer.setClearColor (0x9ea9ad, 1);

    var loader = new FBXLoader();
    loader.load( '/models/head.fbx', ( object ) => {
        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.material = new THREE.MeshLambertMaterial( { 
                    color: 0xb0b0b0,
                } );
                object.castShadow = false; //default is false
                object.receiveShadow = false; //default
            }
        } );
        scene.add( object );
    });

    camera.position.z = 500;
    camera.position.y = -60;

    var animate = function () {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    };
    
    animate();

    return scene;
}

export const rotateObject = (scene, mouseStart, setMouseStart, e) =>{
    if(!scene || !mouseStart.x)
        return

    //2 because 0 is ambient light and 1 is directional light
    if(scene.children[2]){
        scene.children[2].rotation.y += (mouseStart.x - e.clientX) * 0.005;
        scene.children[2].rotation.x += (mouseStart.y - e.clientY) * 0.005;
    }

    setMouseStart({
        x: e.clientX,
        y: e.clientY
    })
}

export const updateScene = (scene, index) => {
    console.log(index)
    for(var i = 2; i < scene.children.length; i++){
        scene.remove(scene.children[i]);
    }

    var loader = new FBXLoader();
    loader.load( "/models/"+index["location"], ( object ) => {
        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.material = new THREE.MeshLambertMaterial( { 
                    color: 0xb0b0b0,
                } );
                object.castShadow = false; //default is false
                object.receiveShadow = false; //default
            }
        } );
        scene.add( object );
    });
}