import React from 'react';
import './App.css';

const capitalize = (str) => {
  return str[0].toUpperCase() + str.slice(1)
}

function Controller({label, defaultLength = 5}){
  const [ length, setLength ] = React.useState(defaultLength);

  const handleClick = (value) => {
    if(length + value > 0 && length + value <= 60){
      setLength(length + value)
    }
  }

  return(
    <div className='controller'>
      <div id={`${label}-label`}>
        {capitalize(label)} Length</div>
      <div id={`${label}-decrement`} onClick={() => handleClick(-1)}>
        down
      </div>
      <div id={`${label}-length`}>
        {length}
      </div>
      <div id={`${label}-increment`} onClick={() => handleClick(1)}>
        up
      </div>
    </div>
  )
}

function Timer(){
  const provitionalValue = 1500
  const [ time, setTime ] = React.useState(provitionalValue)
  const [ isTicking, setIsTicking ] = React.useState(false)

  React.useEffect(() =>{
    let id = null;
    if(isTicking){
      id = setInterval(() => {
        console.log('1 second has passed')
        if(time > 0) setTime( time => time - 1)
      }, 1000);  
    }
    return () => clearInterval(id)
  },[isTicking,time])

  const handleStartStop = () => {
    setIsTicking(ticking => !ticking)
  }

  const handleReset = () => {
    setIsTicking(false)
    setTime(provitionalValue)
  }

  return(
    <div className='timer'>
      <div id='timer-label'>
        Current Session
      </div>
      <div id='time-left'>
        {time}
      </div>
      <div id='start_stop' onClick={handleStartStop}>>[]</div>
      <div id='reset' onClick={handleReset}> reset </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="App">
      <Controller label='break' />
      <Controller label='session' defaultLength={25} />
      <Timer />
    </div>
  );
}