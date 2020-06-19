import React from 'react';
import './App.css';
import { capitalize, secondsToMinutes, secondsToMMSS } from '../utils/utils' 

const defaultBreakTime = 5*60
const defaultSessionTime = 25*60

const START_TICKING = 'START_TICKING'
const STOP_TICKING = 'STOP_TICKING'
const START_BREAK = 'START_BREAK'
const STOP_BREAK = 'STOP_BREAK'
const START_PLAYING = 'START_PLAYING'
const STOP_PLAYING = 'STOP_PLAYING'
const RESET = 'RESET'

function reducer( state, action ){
  switch(action.type){
    case RESET:
      return {
        isOnBreak: false,
        isTicking: false,
        isPlaying: false
      }
      case START_TICKING:
        return {
          ...state,
          isTicking: true
        }
      case STOP_TICKING:
        return {
          ...state,
          isTicking: false,
        }
    case START_BREAK:
      return {
        ...state,
        isOnBreak: true,
      }
    case STOP_BREAK:
      return {
        ...state,
        isOnBreak: false,
      }
    case START_PLAYING:
      return {
        ...state,
        isPlaying: true,
      }
    case STOP_PLAYING:
      return {
        ...state,
        isPlaying: false,
      }
    default:
      return {
        ...state
      }
  }
}

export default function App() {
  const [ breakTime, setBreakTime ] = React.useState(defaultBreakTime)
  const [ sessionTime, setSessionTime ] = React.useState(defaultSessionTime)
  const [ timeLeft, setTimeLeft ] = React.useState(sessionTime)
  const [ trackers, dispatch ] = React.useReducer(
    reducer,
    {
      isOnBreak: false,
      isTicking: false,
      isPlaying: false,
    }
  )

  const id = React.useRef(null)
  const audioRef = React.useRef(null)

  React.useEffect(() => {
    setTimeLeft(sessionTime)
  },[sessionTime])

  React.useEffect(() => {
    id.current = setInterval(() => {
      if(trackers.isTicking){
        setTimeLeft(timer => timer - 1)
      }
    }, 1000);
    return () => clearInterval(id.current)
  },[trackers.isTicking])

  React.useEffect(() => {
    if(timeLeft === 0){
      playAudio()
      if(!trackers.isOnBreak){
        dispatch({ type: START_BREAK })
        setTimeLeft(breakTime)
      }else{
        dispatch({ type: STOP_BREAK })
        setTimeLeft(sessionTime)
      }
    }
  },[timeLeft, trackers.isOnBreak, breakTime, sessionTime])

  const handleStartStop = () => {
    if(!trackers.isTicking){
      dispatch({ type: START_TICKING })
    }  
    else if(trackers.isTicking){
      dispatch({ type: STOP_TICKING})
    }
  }

  const handleReset = () => {
    dispatch({ type: RESET })
    setBreakTime(defaultBreakTime)
    setSessionTime(defaultSessionTime)
    setTimeLeft(sessionTime)
    pauseAudio()
  }

  const pauseAudio = () => {
    if(!audioRef.current.paused){
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const playAudio = () => {
    audioRef.current.play()
  }

  return (
    <div className="App">
      <Controller
        label='break'
        state={breakTime}
        modifier={setBreakTime}
        disableCondition={trackers.isOnBreak}
      />
      <Controller
        label='session'
        state={sessionTime}
        modifier={setSessionTime}
        disableCondition={trackers.isTicking}
      />

      <Timer
        messageCondition={trackers.isOnBreak}
        timeLeft={timeLeft}
        handleStartStop={handleStartStop}
        handleReset={handleReset}
      />

      <audio id='beep' src='https://z16th-bucket.s3-us-west-1.amazonaws.com/fcc-projects/alarm-sound-min.mp3' ref={audioRef} />

    </div>
  )
}

function Timer({ messageCondition, timeLeft, handleStartStop, handleReset }){
  return (
    <React.Fragment>
      <div id='timer-label'>
        {messageCondition ? 'Break Time' : 'Current Session'}
      </div>
      <div id='time-left'>{secondsToMMSS(timeLeft)}</div>
      <div id='start_stop' onClick={handleStartStop}>>[]</div>
      <div id='reset' onClick={handleReset}>reset</div>
    </React.Fragment>
  )
}

function Controller({ label, state, modifier, disableCondition }){
  const seconds = 60

  const handleClick = (value) => {
    if(state + value > 0 && state + value <= 60 * seconds && !disableCondition)
      modifier( timer => timer + value)
  }

  return(
    <React.Fragment>
      <div id={`${label}-label`}>
        {capitalize(label)} Length 
      </div>
      <div 
        id={`${label}-decrement`}
        onClick={() => handleClick(-seconds)} 
      >
        down
      </div>
      <div id={`${label}-length`}>{secondsToMinutes(state)}</div>
      <div
        id={`${label}-increment`}
        onClick={() => handleClick(seconds)} 
      >
        up
      </div>
    </React.Fragment>
  )
}