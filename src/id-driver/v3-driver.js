import RtcEeprom from './rtc-serial.js'

const get_id = async () => {
  const eeprom = new RtcEeprom()
  const id = await eeprom.getId()
  console.log(id)
  process.exit(0)
}

get_id()
