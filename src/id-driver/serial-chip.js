import i2c from 'i2c-bus'
import 'regenerator-runtime/runtime'

class SerialChip {
	constructor() {
		this.i2c_address = 0x58
		this.command = 0x80
	}

	async getId() {
		let i2c1 = await i2c.openPromisified(1)
		let cmd_buffer = Buffer.from([this.command])
		await i2c1.i2cWrite(this.i2c_address, cmd_buffer.length, cmd_buffer)
		let buffer = Buffer.alloc(16)
		let response = await i2c1.i2cRead(this.i2c_address, buffer.length, buffer)
		await i2c1.close()
		return buffer.toString('hex').toUpperCase()
	}
}

const getDeviceId = async () => {
	let serial_chip = new SerialChip()
	return serial_chip.getId()
}

export { SerialChip, getDeviceId }
