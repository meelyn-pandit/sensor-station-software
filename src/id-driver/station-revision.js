import RtcSerial from './rtc-serial.js'
import GetV2Serial from './atsha204a.js' 
import fs from 'fs'

const ID_FILE = '/etc/ctt/station-id'
const VERSION_FILE = '/etc/ctt/station-revision'

const V3_PREFIX = 'V3'

const get_v3_id = async () => {
  const rtc_serial = new RtcSerial()
  let rtc_id = await rtc_serial.getId()
	return V3_PREFIX.concat(rtc_id.substring(6))
}

const run = async () => {
  console.log('getting sensor station version / id')
  let id = 'ID_ERROR'
  let version = 0
  try {
    id = await get_v3_id()
    version = 3
  } catch(v3_err) {
    try {
      id = await GetV2Serial()
      version = 2
    } catch(v2_err) {
      // can't get v2 or v3 id....
      console.log('V3 ID error')
      console.error(v3_err)
      console.log('V2 ID error')
      console.error(v2_err)
    }
  }
  console.log(`version: ${version} id: ${id}`)
  fs.writeFileSync(VERSION_FILE, version.toString())
  fs.writeFileSync(ID_FILE, id.trim())
  process.exit(0)
}

run()
