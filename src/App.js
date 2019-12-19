import React, { useRef, useEffect } from 'react';
import './App.css';
import { Spring } from 'wobble';

// Create a new spring
const NewCardSpring = () => new Spring({
  fromValue: 0,
  toValue: 0,
  stiffness: 1000,
  damping: 500,
  mass: 3,
});
const springX = NewCardSpring();
const springY = NewCardSpring();

const runSpring = (newPos) => {
  console.log(newPos);
  springX.updateConfig({
    toValue: newPos.x * 2 / newPos.width
  }).start();
  springY.updateConfig({
    toValue: newPos.y * 2 / newPos.height * -1
  }).start();
}

function App() {
  const ref = useRef();
  useEffect(() => {
    const updateTilt = (() => {
      let yRotation = 0;
      let xRotation = 0;
      return (xVal, yVal) => {
        yRotation = typeof xVal === 'number' ? xVal * 10 : yRotation;
        xRotation = typeof yVal === 'number' ? yVal * 10 : xRotation;
        ref.current.style.transform = `translate(-50%, -50%) perspective(600px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(${1})`;
      }
    })()
    springX
      .onStart(() => {
        console.log('Spring started!');
      })
      .onUpdate((s) => {
        console.log(`Spring's current value: ` + s.currentValue);
        console.log(`Spring's current velocity: ` + s.currentVelocity);
        updateTilt(s.currentValue);
      })
      .onStop(() => {
        console.log('Spring is at rest!');
      })
      .start();
    springY
      .onStart(() => {
        console.log('Spring started!');
      })
      .onUpdate((s) => {
        console.log(`Spring's current value: ` + s.currentValue);
        console.log(`Spring's current velocity: ` + s.currentVelocity);
        updateTilt(undefined, s.currentValue);
      })
      .onStop(() => {
        console.log('Spring is at rest!');
      })
      .start();
  }, [ref])
  useEffect(() => {
    const offset = ref.current.getBoundingClientRect();
    ref.current.addEventListener('mousemove', (event) => {
      var pos = { left: event.pageX - offset.left, top: event.pageY - offset.top }
      runSpring({
        x: pos.left - offset.width / 2,
        y: pos.top - offset.height / 2,
        width: offset.width,
        height: offset.height
      });
    })
    ref.current.addEventListener('mouseleave', () => {
      runSpring({
        x: 0,
        y: 0,
        width: offset.width,
        height: offset.height
      });
    })
    // Set listeners for spring events, start the spring.
    
  }, [ref])

  return (
    <div className="App">
      <div id="card" className="drop-shadow-natural" ref={ref}></div>
    </div>
  );
}

export default App;
