import { QaqcPacket } from './packet.js'

class GpsPacket {
	constructor(opts) {
		this.lat = opts.lat
		this.lng = opts.lng
		this.gps_time = opts.gps_time
		this.mode = opts.mode
		this.nsats = opts.nsats
		this.station_id = opts.station_id

		this.packet = new QaqcPacket({
			category: 1,
			type: 2,
			station_id: this.station_id,
			payload: this.getPayload()
		})
	}

	getTime() {
		let buffer = Buffer.alloc(8)

		try {
			let date = new Date(this.gps_time)
			buffer.writeBigUint64LE(date.getTime())
		} catch (err) {
			console.error('error getting time', this.gps_time)
			console.error(err)
		}
		return buffer
	}

	getPayload() {
		let buffer = Buffer.alloc(10)

		if (this.mode) {
			buffer.writeInt32LE(Math.round(this.lat * 1000000), 0)
			buffer.writeInt32LE(Math.round(this.lng * 1000000), 4)
			buffer.writeUInt8(this.mode, 8)
			buffer.writeUInt8(this.nsats, 9)
		}
		return Buffer.concat([
			buffer,
			this.getTime()
		])
	}

}

export { GpsPacket }