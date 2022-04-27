import i2c from 'i2c-bus'
import 'regenerator-runtime/runtime'

class RtcSerial {
	constructor() {
    console.log('init rtc')
		this.i2c_address = 0x57
	}

  async sleep() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 500)
    })
  }

	async getId() {
		let buffer = Buffer.alloc(8)
		let i2c1 = await i2c.openPromisified(1)
    console.log('opened i2c bus 1')
    await this.sleep()
    console.log('done sleeping')
		let response = await i2c1.i2cRead(this.i2c_address, buffer.length, buffer)
    console.log('got i2c1 response')
		await i2c1.close()
    console.log('closed i2c1')
		return buffer.toString('hex').toUpperCase()
	}
}

const getDeviceId = async () => {
  console.log("WTSDFDSFSDFDS")
  let rtc_serial = new RtcSerial()
  let id
  return await rtc_serial.getId()
}

export { RtcSerial, getDeviceId }
