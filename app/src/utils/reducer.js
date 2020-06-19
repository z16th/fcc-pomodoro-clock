
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
    default:
      return {
        ...state
      }
  }
}

export { reducer, START_TICKING, STOP_TICKING, START_BREAK, STOP_BREAK, START_PLAYING, STOP_PLAYING, RESET }