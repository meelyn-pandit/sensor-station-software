import fs from 'fs'

export default () => {
  return fs.readFileSync('/etc/ctt/station-id').toString().trim()
}
