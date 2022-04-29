import { QaqcPacket } from './packet.js'

class StationInfoPacket {
  constructor(opts) {
    this.station_id = opts.station_id
    this.imei = opts.imei
    this.sim = opts.sim
    this.packet = new QaqcPacket({
      category: 1,
      type: 1,
      payload: this.getPayload(),
      station_id: this.station_id
    })
  }

 getPayload() {
	 	let imei = Buffer.alloc(8)
		imei.writeBigInt64LE(this.imei)
		let sim = Buffer.alloc(8)
		sim.writeBigInt64LE(this.sim)
    return Buffer.concat([
			imei,
			sim
		])
  }

}

export { StationInfoPacket }