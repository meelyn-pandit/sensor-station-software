import InitializeExpander from './io-expander/initialize.js'
import StationIdInterface from './id-driver/station-id-interface.js'
import fs from 'fs'

const Filenames = {
  ID: '/etc/ctt/station-id',
  VERSION: '/etc/ctt/station-revision'
}

const run = async () => {
  const id_interface = new StationIdInterface()
  const io_expander_exists = id_interface.ioExpanderExists()
  if (io_expander_exists) {
    console.log('IO Expander found')
    await InitializeExpander()
  }
  const hardware_info = await id_interface.getHardwareInfo()
  const { version, id, revision } = hardware_info
  console.log(`Identified Sensor Station Hardware:  Version: ${version}; Revision: ${revision}; Id: ${id}`)
  fs.writeFileSync(Filenames.ID, id.trim())
  fs.writeFileSync(Filenames.VERSION, version.toString())
}

run()