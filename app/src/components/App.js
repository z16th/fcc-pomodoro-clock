import React from 'react';
import './App.css';

const capitalize = (str) => {
  return str[0].toUpperCase() + str.slice(1)
}

const secondsToMinutes = (time) => {
  return time / 60
}

const secondsToMMSS = (time) => {
  let minutes = Math.floor(time / 60)
  let seconds = time % 60
  if(minutes < 10)
    minutes = '0' + minutes
  if(seconds < 10)
    seconds = '0' + seconds
  return `${minutes}:${seconds}`
}

function Controller({label, state, modifier, setTime}){

  const handleClick = (value) => {
    if(state + value > 0 && state + value <= 60*60){
      modifier(state => (state + value))
      if(label === 'session') setTime(state => state + value)
    }
  }

  return(
    <div className='controller'>
      <div id={`${label}-label`}>
        {capitalize(label)} Length</div>
      <div id={`${label}-decrement`} onClick={() => handleClick(-60)}>
        down
      </div>
      <div id={`${label}-length`}>
        {state/60}
      </div>
      <div id={`${label}-increment`} onClick={() => handleClick(60)}>
        up
      </div>
    </div>
  )
}

function Timer({time, setTime, breakTime, sessionTime, onABreak, setOnABrake, resetDefaults}){
  const [ isTicking, setIsTicking ] = React.useState(false)

  React.useEffect(() =>{
    let id = null;
    if(isTicking){
      id = setInterval(() => {
        if(time > 0)
          setTime( time => time - 1)

        if(time === 0){
          if(onABreak){
            setOnABrake(false)
            setTime(sessionTime)
          }else{
            setOnABrake(true)
            setTime(breakTime)
          }
        }
      }, 1000);  
    }
    return () => clearInterval(id)
  },[breakTime,isTicking,onABreak,sessionTime,setOnABrake,setTime,time])

  const handleStartStop = () => {
    setIsTicking(ticking => !ticking)
  }

  const handleReset = () => {
    setIsTicking(false)
    setOnABrake(false)
    resetDefaults()
  }

  return(
    <div className='timer'>
      <div id='timer-label'>
        {!onABreak ? "Current Session" : "On A Break"}
      </div>
      <div id='time-left'>
        {secondsToMMSS(time)}
      </div>
      <div id='start_stop' onClick={handleStartStop}>>[]</div>
      <div id='reset' onClick={handleReset}> reset </div>
    </div>
  )
}

export default function App() {
  const defaultBreak = 5*60
  const defaultSession = 25*60
  const [ breakTime, setBreakTime ] = React.useState(defaultBreak)
  const [ sessionTime, setSessionTime ] = React.useState(defaultSession)
  const [ time, setTime ] = React.useState(sessionTime)
  const [ onABreak, setOnABrake ] = React.useState(false)

  const resetDefaults = () => {
    console.log('defaults restored')
    setBreakTime(defaultBreak)
    setSessionTime(defaultSession)
    setTime(defaultSession)
  }

  return (
    <div className="App">
      <Controller 
        label='break' 
        state={breakTime}
        modifier={setBreakTime}
      />
      <Controller
       label='session'
       state={sessionTime}
       modifier={setSessionTime}
       setTime={(value) => setTime(value)}
      />
      <Timer 
        time={time} 
        setTime={(value) => setTime(value)} 
        breakTime={breakTime}
        sessionTime={sessionTime} 
        onABreak={onABreak}
        setOnABrake={setOnABrake}
        resetDefaults={resetDefaults}
      />
    </div>
  );
}