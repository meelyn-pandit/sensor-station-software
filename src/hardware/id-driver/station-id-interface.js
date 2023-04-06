import { 
  PollState, 
} from '../io-expander/expander.js'

import i2cScanner from '../i2c/scan.js'
import At24Mac602 from './at24mac602.js'
import Atsha204a from './atsha204a.js'
import Ds3231 from './ds3231.js'

// prefix for V3 station IDs
const PREFIX = 'V3'

const IdChips = {
  DS3231: async() => {
    const buffer = await Ds3231()
    return PREFIX.concat(buffer.slice(3).toString('hex').toUpperCase())
  },
  AT24MAC602: async() => {
    const buffer = await At24Mac602.ReadEUI64()
    const sliced_buffer = Buffer.concat([buffer.slice(0,3), buffer.slice(5)])
    return PREFIX.concat(sliced_buffer.toString('hex').toUpperCase())
  },
  ATSHA204A: async() => {
    return Atsha204a()
  }
}

/**
 * abstraction around identifying hardware version / revision
 * IO expander needs to be initialized in advanced
 */
class StationIdInterface {
  // i2c address for IO expander on v3+ boards
  #expander_address = 0x70

  /**
   * checks resister configuration to identify hardware revision for V3+ stations
   * through the IO expander
   */
  async getHardwareRevision() {
    const results = await PollState()
    // expect a, b for two channels with 8 input/outputs
    const { a: channel_a } = results
    // bitwise NOT ... javascript converts to signed 32 bit integers
    // https://stackoverflow.com/questions/6798111/bitwise-operations-on-32-bit-unsigned-ints
    return ((~channel_a >>> 0) & 0xFF) >> 1
  } 

  async ioExpanderExists() {
    // scan the i2c bus channel 1 for device addresses
    const addresses = await i2cScanner(1)
    // check if the IO expander address is populated (V3 stations)
    if (addresses.includes(this.#expander_address)) {
      // IO expander found - get the hardware revision
      return true
    }
    return false
  }

  /**
   * 
   * @returns {Object} 
   */
  async getVersion() {
    const io_expander_exists = await this.ioExpanderExists()
    // check if the IO expander address is populated (V3 stations)
    if (io_expander_exists) {
      // IO expander found - get the hardware revision
      const revision = await this.getHardwareRevision()
      return {
        version: 3,
        revision: revision,
      }
    }
    // assume a V2 station as default hardware
    return {
      version: 2,
      revision: 0,
    }
  }

  async getV3StationId(revision) {
    let id
    switch(revision) {
      case 0:
        // revision 0 - use DS3231 RTC EEPROM chip for ID
        id = await IdChips.DS3231()
        break
      case 1:
        // revision 1 - use AT24MAC602 Serial EEPROM 
        id = await IdChips.AT24MAC602()
        break
      default: 
        throw new Error('Cannot identify station revision')
    }
    return id
  }

  async getV2StationId() {
    return IdChips.ATSHA204A()
  }

  async getHardwareInfo() {
    const version_info = await this.getVersion()
    const { version, revision } = version_info
    let id
    switch(version) {
      case 3:
        id = await this.getV3StationId(revision)
        break
      case 2:
        id = await this.getV2StationId()
        break
      default:
        throw new Error(`Unexpectted station version ${version}`)
    }
    return {
      id,
      version,
      revision
    }
  }
}

export default StationIdInterface
