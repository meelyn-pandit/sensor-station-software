import { 
  PollState, 
} from '../io-expander/expander.js'

/**
 * Return a version for the current Sensor Station
 */
export default async () => {
  // poll the hardware revision of V3 stations
  const results = await PollState()
  const { a } = results
  // bitwise NOT ... javascript converts to signed 32 bit integers
  // https://stackoverflow.com/questions/6798111/bitwise-operations-on-32-bit-unsigned-ints
  const config_state = ((~a >>> 0) & 0xFF) >> 1
  return config_state
}
