import React from 'react'
import { secondsToMMSS } from '../utils/utils' 
import './Controller.css'

export default function Timer({ messageCondition, buttonCondition, timeLeft, handleStartStop, handleReset }){
  return (
    <div className='timer'>
      <div id='timer-label' className='flex-center'>
        {messageCondition ? 'Break Time' : 'Current Session'}
      </div>
      <div id='time-left' className='flex-center'>{secondsToMMSS(timeLeft)}</div>
      <div id='start_stop' className='flex-center' onClick={handleStartStop}>
        {buttonCondition ? 'PAUSE' : 'PLAY'}
      </div>
      <div id='reset' className='flex-center' onClick={handleReset}>RESET</div>
    </div>
  )
}