import React, { useState, useEffect } from 'react';
import {createScene, updateIndex, rotateObject} from "./renderer"
import "./App.css"

function App() {

  const [index, setIndex] = useState(0);
  const [scene, setScene] = useState(null);
  const [content, setContent] = useState([]);
  const [mouseStart, setMouseStart] = useState({});

  useEffect(() => {
    //we created scene
    if(!scene){
      setScene(createScene(setContent))
    }
  });

  function startRotate(e){
    if(e.clientX){
      setMouseStart({
        x: e.clientX,
        y: e.clientY
      })
    }else{
      e.preventDefault();
      setMouseStart({
        x: e.touches[0].pageX,
        y: e.touches[0].pageY
      })
    }
  }

  return (
    <div onTouchEnd={()=>setMouseStart({})} onTouchStart={(e)=>startRotate(e)} onTouchMove={(e)=>rotateObject(scene, mouseStart, setMouseStart, e)} onMouseUp={()=>setMouseStart({})} onMouseDown={(e)=>startRotate(e)} onMouseMove={(e)=>rotateObject(scene, mouseStart, setMouseStart, e)} className="nav-style">
      {index>0 && (<button onClick={()=>updateIndex(-1, index, setIndex, scene, content)} id="left">◀</button>)}
      {index < content.length-1 && (<button onClick={()=>updateIndex(1, index, setIndex, scene, content)} id="right">▶</button>)}
    </div>
  );
}

export default App;
