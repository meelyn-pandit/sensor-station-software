import fs from 'fs'

const read_revision = () => {
  return parseFloat(fs.readFileSync('/etc/ctt/station-revision').toString().trim())
}

let revision = read_revision()

export default {
  revision: revision
}
