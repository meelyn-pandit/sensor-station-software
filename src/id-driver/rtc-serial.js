import RunCommand from '../command.js'

const getDeviceId = () => {
  return RunCommand('station-id', [])
}

export { getDeviceId }
