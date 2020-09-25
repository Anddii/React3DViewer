import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

let allContent = [];
let loadIndex = 0;
var scene;

let modelCount = 0;
let allModels = [];

export const updateIndex = (value, index, setIndex, scene, content)=> {
    var newVal = index+value;
    setIndex(newVal)
    updateScene(scene, allModels[newVal])
}

export const createScene = (setContent, setIndex)=>{
    
    scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    renderer.setClearColor (0x9ea9ad, 1);

    //lights
    //Ambient
    var lightAmbient = new THREE.AmbientLight( 0x576469 ); // soft white light
    scene.add( lightAmbient );

    //Directional
    var light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
    light.position.set( 0, 1000, 1000 ); 			//default; light shining from top
    light.castShadow = true;            // default false
    scene.add( light );

    camera.position.z = 500;
    camera.position.y = -60;

    fetch('/models.json')
    .then((r) => r.text())
    .then(text  => {
        const content = JSON.parse(text)
        modelCount = content.length;
        setContent(content.reverse())
        allContent = content;
        load();
    })  

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

    let startX = e.clientX !== undefined ? e.clientX : e.touches[0].pageX;
    let startY = e.clientY !== undefined ? e.clientY : e.touches[0].pageY;

    // 0 is ambient light and 1 is directional light
    if(scene.children[2]){
        scene.children[2].rotation.y -= (mouseStart.x - startX) * 0.005;
        scene.children[2].rotation.x -= (mouseStart.y - startY) * 0.005;
    }

    setMouseStart({
        x: startX,
        y: startY
    })
}

export const updateScene = (scene, index) => {
    for(var i = 2; i < scene.children.length; i++){
        scene.remove(scene.children[i]);
    }
    scene.add( index );
}

function load() {
    return new Promise( (resolve, reject) => {
        const loader = new FBXLoader();
        loader.load("/models/"+allContent[loadIndex]["location"], function (object) {
            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.material = new THREE.MeshLambertMaterial( { 
                        color: 0xb0b0b0,   //Use imported material: child.material.color
                    } );
                    object.castShadow = false; //default is false
                    object.receiveShadow = false; //default
                }
            } );
            allModels.push(object)
            // scene.add( allModels[0] );
            resolve(object);
        });
    
    }).then(()=>{
        if(loadIndex == 0)
            scene.add(allModels[0])
        loadIndex++;
        if(loadIndex < allContent.length)
            load()
    });
}