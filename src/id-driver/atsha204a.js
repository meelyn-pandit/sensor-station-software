import Command from '../command.js'

const getDeviceId = () => {
  return Command('hashlet', ['serial-num', '|', 'cut', '-c5-16'])
}

export default getDeviceId 
