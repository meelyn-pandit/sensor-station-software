// https://github.com/fivdi/i2c-bus#readme
import i2c from 'i2c-bus'

/**
 * i2c interface for reading / writing
 */
class I2C {
  #address
  #bus
	/**
	 * 
	 * @param {*} address  - i2c address
	 */
	constructor(opts) {
		this.#address = opts.address
		this.#bus = opts.bus
	}

	/**
	 * 
	 * @param {Number} opts.register 1 byte register, ie 0x58
	 * @param {Buffer} opts.buffer buffer object to write to 
	 */
	async writeRegister(opts) {
		const i2c1 = await i2c.openPromisified(this.#bus)
		let results = await i2c1.writeI2cBlock(this.#address, opts.register, opts.buffer.length, opts.buffer)
		await i2c1.close()
    return results
	}

	/**
	 * 
	 * @param {Buffer} buffer 
	 */
	async write(buffer) {
		const i2c1 = await i2c.openPromisified(this.#bus)
		let results = await i2c1.i2cWrite(this.#address, buffer.length, buffer)
		await i2c1.close()
    return results
	}

	/**
	 * 
	 * @param {Number} opts.register
	 * @param {Buffer} opts.buffer
	 * @returns 
	 */
	async readRegister(opts) {
		const i2c1 = await i2c.openPromisified(this.#bus)
		let results = await i2c1.readI2cBlock(this.#address, opts.register, opts.buffer.length, opts.buffer)
		await i2c1.close()
		return results
	}

	/**
	 * 
	 * @param {Buffer} buffer 
	 */
	async read(buffer) {
		const i2c1 = await i2c.openPromisified(this.#bus)
		let results = await i2c1.i2cRead(this.#address, buffer.length, buffer)
		await i2c1.close()
    return results
	}

}

export default I2C
