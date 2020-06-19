import React from 'react'
import { capitalize, secondsToMinutes } from '../utils/utils' 
import './Timer.css'

export default function Controller({ label, state, modifier, disableCondition }){
  const seconds = 60

  const handleClick = (value) => {
    if(state + value > 0 && state + value <= 60 * seconds && !disableCondition)
      modifier( timer => timer + value)
  }

  return(
    <div className='controller flex-center'>
      <div id={`${label}-label`} className='label'>
        {capitalize(label)} Length 
      </div>
      <div className='buttons flex-center'>
        <div 
          id={`${label}-decrement`}
          className='btn'
          onClick={() => handleClick(-seconds)} 
        >
          －
        </div>
        <div 
          id={`${label}-length`} 
          className='length'>{secondsToMinutes(state)}
        </div>
        <div
          id={`${label}-increment`}
          className='btn'
          onClick={() => handleClick(seconds)} 
        >
          ＋
        </div>
      </div>
    </div>
  )
}