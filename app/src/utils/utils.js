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

export { capitalize, secondsToMinutes, secondsToMMSS }
