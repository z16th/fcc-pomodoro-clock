import React from 'react';
import Timer from './components/Timer'
import Controller from './components/Controller'
import { reducer, START_TICKING, STOP_TICKING, START_BREAK, STOP_BREAK, RESET } from './utils/reducer'
import './App.css';

const defaultBreakTime = 5*60
const defaultSessionTime = 25*60

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
      <div className='controllers'>
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
      </div>
      <Timer
        messageCondition={trackers.isOnBreak}
        buttonCondition={trackers.isTicking}
        timeLeft={timeLeft}
        handleStartStop={handleStartStop}
        handleReset={handleReset}
      />
      <audio id='beep' src='https://z16th-bucket.s3-us-west-1.amazonaws.com/fcc-projects/alarm-sound-min.mp3' ref={audioRef} />
    </div>
  )
}