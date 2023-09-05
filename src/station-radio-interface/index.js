import { BaseStation } from './server/base-station.js'
// import OpenSerialPorts from './server/open-serial-ports.js'

// // create radio json
// OpenSerialPorts()
// instantiate the base station software
const station = new BaseStation({
  config_filepath: '/etc/ctt/station-config.json',
  radio_map_filepath: '/etc/ctt/radio-map.json'
  // radio_map_filepath: '/home/ctt/sensor-station-software/src/station-radio-interface/server/data/serial-ports.json',
})

// start it up
station.init({})
