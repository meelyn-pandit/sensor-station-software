import RtcEeprom from './rtc-serial.js'

const V3_PREFIX = 'V3'

const get_id = async () => {
  const eeprom = new RtcEeprom()
  let rtc_id = await eeprom.getId()
	rtc_id = V3_PREFIX.concat(rtc_id.substring(6))
  console.log(rtc_id)
  process.exit(0)
}

get_id()
