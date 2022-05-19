import i2c from 'i2c-bus'

class I2C {
  #address
  #bus
	/**
	 * 
	 * @param {*} address  - i2c address
	 */
	constructor(opts) {
    console.log('init i2c', opts)
		this.#address = opts.address
		this.#bus = opts.bus
	}

	/**
	 * 
	 * @param {*} opts.register 
	 * @param {*} opts.buffer
	 */
	async writeRegister(opts) {
		const i2c1 = await i2c.openPromisified(this.#bus)
		let results = await i2c1.writeI2cBlock(this.#address, opts.register, opts.buffer.length, opts.buffer)
		await i2c1.close()
    return results
	}

	/**
	 * 
	 * @param {*} buffer 
	 */
	async write(buffer) {
		const i2c1 = await i2c.openPromisified(this.#bus)
		let results = await i2c1.i2cWrite(this.#address, buffer.length, buffer)
		await i2c1.close()
    return results
	}

	/**
	 * 
	 * @param {*} opts.register
	 * @param {*} opts.buffer
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
	 * @param {*} buffer 
	 */
	async read(buffer) {
		const i2c1 = await i2c.openPromisified(this.#bus)
		let results = await i2c1.i2cRead(this.#address, buffer.length, buffer)
		await i2c1.close()
    return results
	}

}

export default I2C
