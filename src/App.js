import React, { useState, useEffect } from 'react';
import {createScene, updateIndex, rotateObject} from "./renderer"
import "./App.css"
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';

function App() {

  const [index, setIndex] = useState(0);
  const [scene, setScene] = useState(null);
  const [content, setContent] = useState([]);
  const [mouseStart, setMouseStart] = useState({});
  const [sliderValue, setSliderValue ] = useState(0); 

  useEffect(() => {
    //we created scene
    if(!scene){
      setScene(createScene(setContent, setIndex))
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

  function sliderChanged(changeEvent){
    updateIndex(changeEvent.target.value-sliderValue, index, setIndex, scene, content)
    setSliderValue(changeEvent.target.value)
  }

  function buttonClick(number){
    setSliderValue(index+number)
    updateIndex(number, index, setIndex, scene, content)
  }

  return (
    <div>
      <div className="controls-slider">
        <RangeSlider
        value={sliderValue}
        min={0}
        max={content.length}
        onChange={changeEvent => sliderChanged(changeEvent)}
        />
      </div>
      <div onTouchEnd={()=>setMouseStart({})} onTouchStart={(e)=>startRotate(e)} onTouchMove={(e)=>rotateObject(scene, mouseStart, setMouseStart, e)} onMouseUp={()=>setMouseStart({})} onMouseDown={(e)=>startRotate(e)} onMouseMove={(e)=>rotateObject(scene, mouseStart, setMouseStart, e)} className="nav-style">
        {index>0 && (<button onClick={()=>buttonClick(-1)} id="left">◀</button>)}
        {index < content.length-1 && (<button onClick={()=>buttonClick(1)} id="right">▶</button>)}
      </div>
    </div>

  );
}

export default App;
