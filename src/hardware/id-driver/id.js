import At24Mac602 from './at24mac602.js'
import Ds3231 from './ds3231.js'

const prefix = 'V3'

export default {
  0: async() => {
    const buffer = await Ds3231()
    return prefix.concat(buffer.slice(3).toString('hex').toUpperCase())
  },
  1: async() => {
    const buffer = await At24Mac602.ReadEUI64()
    const sliced_buffer = Buffer.concat([buffer.slice(0,3), buffer.slice(5)])
    return prefix.concat(sliced_buffer.toString('hex').toUpperCase())
  },
}