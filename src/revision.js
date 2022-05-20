import fs from 'fs'
import i2c from 'i2c-bus'

const scan_i2c = async () => {
  const i2c1 = await i2c.openPromisified(1)
  const results = i2c1.scan()
  console.log(results)
}

const identify_revision = async () => {
}

const read_revision = () => {
  return parseFloat(fs.readFileSync('/etc/ctt/station-revision').toString().trim())
}

let revision = read_revision()

export default {
  revision: revision
}
