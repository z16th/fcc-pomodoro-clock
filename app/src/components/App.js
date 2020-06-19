import React from 'react';
import './App.css';
import { capitalize, secondsToMMSS } from '../utils/utils' 

const defaultBreakTime = 5*60
const defaultSessionTime = 25*60

function reducer( state, action ){
  switch(action.type){
    case 'RESET':
      return {
        isOnBreak: false,
        isTicking: false,
        isPlaying: false
      }
    case 'START_BREAK':
      return {
        isOnBreak: true,
        ...state
      }
    case 'STOP_BREAK':
      return {
        isOnBreak: false,
        ...state
      }
    case 'START_TICKING':
      return {
        isTicking: true,
        ...state
      }
    case 'STOP_TICKING':
      return {
        isTicking: true,
        ...state
      }
    case 'START_PLAYING':
      return {
        isPlaying: true,
        ...state
      }
    case 'STOP_PLAYING':
      return {
        isPlaying: false,
        ...state
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
  const id = React.useRef(null)
  const [ trackers, dispatch ] = React.useReducer(
    reducer,
    {
      isOnBreak: false,
      isTicking: false,
      isPlaying: false,
    }
  )

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

  const handleStartStop = () => {
    console.log('start-stop clicked');
    if(!trackers.isTicking)
    dispatch({ type: 'START_TICKING'})    
    if(trackers.isTicking){
      dispatch({ type: 'STOP_TICKING'})
    }

  }

  const handleReset = () => {
    dispatch({ type: 'RESET' })
  }

  return (
    <div className="App">
      <Controller
        label='break'
        state={breakTime}
        modifier={setBreakTime}
        tracker={trackers.isOnBreak}
      />
      <Controller
        label='session'
        state={sessionTime}
        modifier={setSessionTime}
        tracker={trackers.isTicking}
      />

      <div id='timer-label'>
        {trackers.isOnBreak ? 'Break Time' : 'Current Session'}
      </div>
      <div id='time-left'>{secondsToMMSS(timeLeft)}</div>
      <div id='start_stop' onClick={handleStartStop}>>[]</div>
      <div id='reset'>reset</div>

    </div>
  )
}

function Controller({ label, state, modifier, tracker }){
  const seconds = 60

  const handleClick = (value) => {
    if(state + value > 0 && state + value <= 60*seconds && !tracker)
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
      
      <div id={`${label}-length`}>{secondsToMMSS(state)}</div>
      
      <div
        id={`${label}-increment`}
        onClick={() => handleClick(seconds)} 
      >
        up
      </div>
    </React.Fragment>
    
  )
}