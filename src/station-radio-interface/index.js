import { BaseStation } from './server/base-station.js'

// instantiate the base station software
const station = new BaseStation({
  config_filepath: '/etc/ctt/station-config.json',
  radio_map_filepath: '/etc/ctt/radio-map.json'
})

// start it up
station.init({})
