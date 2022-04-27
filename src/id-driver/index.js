import { RtcSerial } from './rtc-serial.js'
import { SerialChip } from './serial-chip.js'

let chip = new RtcSerial()
chip.getId().then(serial => {
	console.log('RTC   ', serial)
})

let serial = new SerialChip()
serial.getId().then(serial => {
	console.log('Serial', serial)
})
