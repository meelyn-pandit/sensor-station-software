import { getDeviceId } from './serial-chip.js'
import Command from '../command.js'
import fs from 'fs'

const get_version = async () => {
  try {
    const id = await getDeviceId()
    console.log(id)
    console.log('3')
    fs.writeFileSync('/etc/ctt/station-id', id)
    process.exit(0)
  } catch(err) {
    console.error(err)
    console.log('2')
    await Command('/usr/local/bin/hashlet', ['cut', '-c5-16', '>', '/etc/ctt/station-id'])
    process.exit(0)
  }
}

get_version()
