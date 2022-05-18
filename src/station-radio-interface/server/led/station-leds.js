import { StationLeds as StationLedsV2 } from './station-leds-v2.js'
import { StationLeds as StationLedsV3 } from './station-leds-v3.js'

import revision from '../../../revision.js'

let StationLeds

if (revision.revision >= 3)  {
  console.log('importing v3 leds')
  StationLeds = StationLedsV3
} else {
  console.log('importing v2 leds')
  StationLeds = StationLedsV2
}

export { StationLeds }
