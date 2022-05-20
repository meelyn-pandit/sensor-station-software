import Command from '../command.js'

const getDeviceId = async () => {
  const id = await Command('hashlet', ['serial-num'])
	return id.substring(4,16)
}

export default getDeviceId 
