import i2c from '../../i2c/i2c.js'

/**
 * utility to read temperature from TMP411 sensor chip
 */
class Tmp411 {
  #address = 0x4e

  constructor() {
    this.i2c = new i2c({
      address: this.#address,
      bus: 1,
    })

    this.registers = {
      CONFIG: {
        WRITE: 0x09,
        READ: 0x03,
      },
      READ: {
        LOCAL: {
          HIGH_BYTE: 0x00,
          LOW_BYTE: 0x15,
        },
        REMOTE: {
          HIGH_BYTE: 0x01,
          LOW_BYTE: 0x10,
        },
      },
      STATUS: 0x02,
    }
  }

  /**
   * read configuration of tmp411 sensor
   */
  async readConfiguration() {
    const buffer = Buffer.alloc(1)
    await this.i2c.readRegister({
      register: this.registers.CONFIG.READ,
      buffer,
    })
    return buffer
  }

  /**
   * configure TMP411 chip to read temperature range -55C to 150C
   */
  async configure() {
    return this.i2c.writeRegister({
      register: this.registers.CONFIG.WRITE,
      buffer: Buffer.from([0b00000100])
    })
  }

  /**
   *
   **/
  async readLocalTemperature() {
    // configure the tmp411 chip to extend temperature range
    await this.configure()
    // read the low byte from the register
    const low_byte = Buffer.alloc(1)
    await this.i2c.readRegister({
      register: this.registers.READ.LOCAL.LOW_BYTE,
      buffer: low_byte,
    })
    // read the high byte from the register
    const high_byte = Buffer.alloc(1)
    await this.i2c.readRegister({
      register: this.registers.READ.LOCAL.HIGH_BYTE,
      buffer: high_byte,
    })
    const high = high_byte.readUInt8()
    const low = low_byte.readUInt8()
    const offset = 0x40
    // extended range offset
    let celsius = high - offset
    // account for decimal fraction
    if (low === 128) celsius += 0.5
    return celsius
  }
}

export default Tmp411
