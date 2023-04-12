import SensorMonitorV2 from './v2-driver.js'
import SensorMonitorV3 from './v3-driver.js'
import Revision from '../../revision.js'

let Driver

if (Revision.revision >=3 ) {
  console.log('loading v3 sensor driver')
  Driver = SensorMonitorV3
} else {
  console.log('loading v2 sensor driver')
  Driver = SensorMonitorV2
}

export default Driver
