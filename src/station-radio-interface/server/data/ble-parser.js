import RawDataPacket from './raw.js' // need to get datapacket from beep-formatter?

export default class CttArgosRawDataPacketV12 extends RawDataPacket {
  static VERSION = 12
  
  static latitude_factor = 93206.7
  
  static longitude_factor = 46603.4
  
  constructor(hex_string) {
    super(hex_string)
    this.data = this.parseRawData()
    this.valid = this.validateCrc(this.bytes.subarray(0, 17))
  }

  parseRawData() {
    const packet_rev = this.bytes.readUint8(0)
    const epoch = this.bytes.readUint32LE(1)
    const lat = this.getCoord(this.bytes.subarray(5, 8), CttArgosRawDataPacketV12.latitude_factor)
    const lng = this.getCoord(this.bytes.subarray(8, 11), CttArgosRawDataPacketV12.longitude_factor)
    const act = this.bytes.readUInt16LE(11)
    const polar_act = this.bytes.readUInt16LE(13)
    const magnitude = this.quantize(this.bytes.readUint8(15), 0, 1500)
    const battery = this.quantize(this.bytes.readUint8(16), 2, 4.5)
    const crc = this.bytes.readUint16LE(17)
    
    const data = {
      'packet': {
          'rev': packet_rev,
          'counter': 0
      },
      'unique_id': null,
      'address': null,
      'reason': null,
      'flags': null,
      'alt': null,
      'received_at': this.getDateFromEpoch(epoch),
      'location': {
          'latitude': lat,
          'longitude': lng,
          'hdop': null
      },
      'battery': battery.toFixed(2) * 100,
      'activity': act,
      'crc': crc,
      'temp': null,
      'extra': {
          'polar_act': polar_act,
          'magnitude': magnitude,
          'mortality': true
      }
    }
    console.log(data)
    return data
  }

  /**
   * 
   * @param {ArrayBuffer} bs 
   * @param {Number} factor 
   */
  getCoord(bs, factor) {
    if (bs.length < 3) {
      return None
    }
    let b2 = bs[2] & 0x7f
    if ((bs[2] & 0x80) > 0) {
      factor = -factor
    }
    const contents = [
      bs[0],
      bs[1],
      b2,
      0x00
    ]
    const a = Buffer.from(contents)
    const coord = a.readUInt32LE()
    return parseFloat((coord / factor).toFixed(6))
  }

  getDateFromEpoch(epoch) {
    if (epoch == null) {
      return null
    }
    return new Date(epoch * 1000)
  }

  parseCombinedHdop(value){
    if (value) {
      return [
        value >> 4,
        value & 0x0F
      ]
    }
    else {
      return [null, null]
    }
  }

  parseHourlyAct(value) {
    // mask all but rightmost 2 bits for each of 4 pairwise bits in byte
    const mask = 0x3
    if (value == null) {
      return [-1,-1,-1,-1]
    }
    return [
        value & mask,
        (value >> 2) & mask,
        (value >> 4) & mask,
        (value >> 6) & mask 
    ]
  }

  quantize(value, min, max) {
    const n_bytes = 1
    let factor = 0
    let result = 0
    if (value) {
      factor = (max - min) / (256 * n_bytes)
      result = value * factor + min
    }
    return result
  }
}
