import { Led as V2LedDriver } from './v2-driver.js'
import { Led as V3LedDriver } from './v3-driver.js'

import StationRevision from '../revision.js'

let Led

if (StationRevision.revision >= 3) {
  Led = V3LedDriver
} else {
  Led = V2LedDriver
}

export { Led }
