import i2c from 'i2c-bus'
import 'regenerator-runtime/runtime'

class RtcSerial {
	constructor() {
		this.i2c_address = 0x57
	}

	async getId() {
		let buffer = Buffer.alloc(8)
		let i2c1 = await i2c.openPromisified(1)
		let response = await i2c1.i2cRead(this.i2c_address, buffer.length, buffer)
		await i2c1.close()
		return buffer.toString('hex').toUpperCase()
	}
}

export { RtcSerial }
