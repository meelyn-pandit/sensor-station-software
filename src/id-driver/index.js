import { getDeviceId as getRtcId } from './rtc-serial.js'
import { getDeviceId as atsha204aId } from './atsha204a.js'
import StationRevision from '../revision.js'

let getDeviceId

if (StationRevision.revision >= 3) {
  getDeviceId = getRtcId
} else {
  getDeviceId = atsha204aId
}

export default getDeviceId
