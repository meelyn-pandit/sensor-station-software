import RunCommand from '../command.js'

export default async () => {
  const station_id = RunCommand('station-id')
  return station_id.trim()
}
