import React from 'react';
import { capitalize, secondsToMMSS } from '../utils/utils'
import './App.css';

const defaultBreak = 5*60
const defaultSession = 25*60

export default function App() {
  const [ currentBreakTime, setBreakTime ] = React.useState(defaultBreak)
  const [ currentSessionTime, setSessionTime ] = React.useState(defaultSession)
  const [ timer, setTimer ] = React.useState(defaultSession)

  const resetDefaults = () => {
    console.log('defaults restored')
    setBreakTime(defaultBreak)
    setSessionTime(defaultSession)
    setTimer(defaultSession)
  }

  return (
    <div className="App">
      <Controller 
        label='break' 
        state={currentBreakTime}
        modifier={setBreakTime}
      />
      <Controller
       label='session'
       state={currentSessionTime}
       modifier={setSessionTime}
       setTime={(value) => setTimer(value)}
      />
      <Timer 
        time={timer} 
        setTime={(value) => setTimer(value)} 
        breakTime={currentBreakTime}
        sessionTime={currentSessionTime} 
        resetDefaults={resetDefaults}
      />
      <Alarm 
        time={timer} 
      />
    </div>
  );
}

function Alarm({ time }){
  const audioRef = React.useRef(null)

  React.useEffect(() => {
    if(time > 0 && audioRef.current.currentTime !== 0){
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  })

  React.useEffect(() => {
    if(time === 0){
      if(audioRef.current){
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    }
  })
  return(
    <audio id='beep' src='https://z16th-bucket.s3-us-west-1.amazonaws.com/fcc-projects/alarm-sound-min.mp3' ref={audioRef} />
  )
}

function Controller({ label, state, modifier, setTime }){
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

function Timer({ time, setTime, breakTime, sessionTime, resetDefaults }){
  const [ isTicking, setIsTicking ] = React.useState(false)
  const [ isOnBreak, setIsOnBreak ] = React.useState(false)
  React.useEffect(() => {
    if(time === 0 && isOnBreak){
        setTime(sessionTime)
        setIsOnBreak(false)
    }
  },[time,setTime,sessionTime,isOnBreak])

  React.useEffect(() => {
    if(time === 0 && !isOnBreak){
      setTime(breakTime)
      setIsOnBreak(true)
    }
  },[time,setTime,breakTime,isOnBreak])

  React.useEffect(() =>{
    let id = null;
      id = setInterval(() => {
        if(time > 0 && isTicking)
          setTime( time => time - 1)
      }, 1000);  
    return () => clearInterval(id)
  },[time,setTime,isTicking])

  const handleStartStop = () => {
    setIsTicking(ticking => !ticking)
  }

  const handleReset = () => { 
    resetDefaults()
    setIsTicking(false)
    setIsOnBreak(false)
  }

  return(
    <div className='timer'>
      <div id='timer-label'>
        {!isOnBreak ? "Current Session" : "On A Break"}
      </div>
      <div id='time-left'>
        {secondsToMMSS(time)}
      </div>
      <div id='start_stop' onClick={handleStartStop}>>[]</div>
      <div id='reset' onClick={handleReset}> reset </div>
    </div>
  )
}