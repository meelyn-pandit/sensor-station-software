import RunCommand from '../command.js'

const getDeviceId = () => {
  return RunCommand('rtc', [])
}

export { getDeviceId }
