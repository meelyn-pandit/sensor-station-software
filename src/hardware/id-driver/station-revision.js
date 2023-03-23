import GetV2Serial from './atsha204a.js' 
import fs from 'fs'
import i2cScanner from '../i2c/scan.js'
import StationVersion from './version.js'
import InitializeExpander from '../io-expander/initialize.js'
import Id from './id.js'

const ID_FILE = '/etc/ctt/station-id'
const VERSION_FILE = '/etc/ctt/station-revision'

const ExpanderAddress = 0x70

const run = async () => {
  let id='ID_ERROR', version=0

  // first scan the i2c bus to check for the expander i2c address
  const addresses = await i2cScanner(1)
  console.log('i2c addresses', addresses.map(addr => addr.toString(16)))
  if (addresses.includes(ExpanderAddress)) {
    // Identifed a device at the expander IO address - a version 3(+) station
    console.log('initializing the IO expander')
    await InitializeExpander()
    // Check the revision of the board
    const revision = await StationVersion()
    console.log('identified station revision', revision)
    switch(revision) {
      case 0:
        console.log('Sensor Station V3.0 hardware')
        id = await Id[0]()
        version = 3
        break
      case 1:
        console.log('Sensor Station V3.2 hardware')
        id = await Id[1]()
        version = 3
        break
      default:
        console.log('Unidentified Station Revision:', revision)
        console.log('not sure how to proceed with the ID')
    }
  } else {
    // Presume this is a V2 station - use the hashlet function to get the ID
    console.log('Sensor Station V2 hardware')
    id = await GetV2Serial()
    version = 2
  }

  console.log(`version: ${version} id: ${id}`)
  fs.writeFileSync(VERSION_FILE, version.toString())
  fs.writeFileSync(ID_FILE, id.trim())
  process.exit(0)
}

run()
