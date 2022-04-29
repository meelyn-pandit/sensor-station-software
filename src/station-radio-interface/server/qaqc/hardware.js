import { QaqcPacket } from './packet.js'

class HardwarePacket {
	constructor(opts) {
		this.station_id = opts.station_id
		this.usb_hub_count = opts.usb_hub_count
		this.radio_count = opts.radio_count
		this.system_time = opts.system_time
		this.channel_qaqc = opts.channel_qaqc

		this.packet = new QaqcPacket({
			category: 1,
			type: 4,
			station_id: this.station_id,
			payload: this.getPayload()
		})
	}

	getChannelDataResults() {
		let mask, channel_data
		let results = 0, i
		Object.keys(this.channel_qaqc).forEach((channel) => {
			// get bitmask for nth bit (channel) - 1
			i = parseInt(channel) - 1
			mask = 1 << i
			channel_data = this.channel_qaqc[channel]
			if (channel_data == true) {
				console.log('masking channel', channel)
				results |= mask
			}
		})
		return results
	}

	getPayload() {
		let buffer = Buffer.alloc(3)
		buffer.writeUInt8(this.usb_hub_count, 0)
		buffer.writeUInt8(this.radio_count, 1)
		let channel_qaqc = this.getChannelDataResults()
		buffer.writeUInt8(channel_qaqc, 2)
		let date_buffer = Buffer.alloc(8)
		try {
			let date = new Date(this.system_time)
			date_buffer.writeBigUint64LE(date.getTime())
		} catch (err) {
			console.error('invalid date for hardware qaqc packet', this.system_time)
			console.error(err)
		}

		return Buffer.concat([
			buffer,
			date_buffer
		])
	}
}

export { HardwarePacket }