// import RawDataPayload from './ble-raw.js' // need to get datapacket from beep-formatter?

/**
 * Payload Format:
 * 
 * f908
Payload: AA BB CCCC DD EE FFFFFFFF GG HHHH II JJ KKKKKK
Hex:     0c 16 1c18 01 00 00000035 49 3813 04 09 435454
Decimal: 12 22 2824 1  0  00000035 73       4  9  C T T

GG: 73*0.03125 
HH: Buffer.from('3813', 'hex').readInt16LE()/100
Total Length: 12 Bytes
Service UUID: 16
GATT Service Type: 

AA - Total Length (Bytes, where 1 Byte = 2 Characters) for B, C, D, E, F
BB - Value Indicating the start of the Service UUID [Will always be 16]
CCCC - GATT Service Type (UINT16LE(CCCC))
DD - CTT Product Family (01 = Blue Morpho) [UINT8]
EE - Blue Morpho Payload Type [UINT8]

DD = 01 and EE = 00
FFFFFFFF - 8 Digit Unique Identifier (Hex String)
GG -  Solar Voltage = (GG * 0.03125)   
Example: GG is 0x46:  70 (decimal) * 0.03125 = 2.188 V
HHHH - Temperature = (INT16LE(HHHH) / 100) 
Example: HHHH is 0xD009: 2512 (decimal) / 100 = 25.12 C
II - Total Length (Bytes, where 1 Byte = 2 Characters) for J and K

Broadcast name Identifier [Will always be 09]
KKKKKK - Hexadecimal encoded ASCII 43 = C 54 = T 54 = T

*/

export default function parsePayload(data) {
    return {
      service: data.readUInt16LE(2),
      product: data.readUInt8(4),
      family: data.readUInt8(5),
      id: data.subarray(6, 10).toString('hex'),
      vcc: data.readUInt8(10) * 0.03125,
      temp: data.readUInt16LE(11) / 100
    }
  }
  
  
  
  // import RawDataPacket from './raw.js' // need to get datapacket from beep-formatter?
  
  // export default class CttArgosRawDataPacketV12 extends RawDataPacket {
  //   static VERSION = 12
    
  //   static latitude_factor = 93206.7
    
  //   static longitude_factor = 46603.4
    
  //   constructor(hex_string) {
  //     super(hex_string)
  //     this.data = this.parseRawData()
  //     this.valid = this.validateCrc(this.bytes.subarray(0, 17))
  //   }
  
  //   parseRawData() {
  //     const packet_rev = this.bytes.readUint8(0)
  //     const epoch = this.bytes.readUint32LE(1)
  //     const lat = this.getCoord(this.bytes.subarray(5, 8), CttArgosRawDataPacketV12.latitude_factor)
  //     const lng = this.getCoord(this.bytes.subarray(8, 11), CttArgosRawDataPacketV12.longitude_factor)
  //     const act = this.bytes.readUInt16LE(11)
  //     const polar_act = this.bytes.readUInt16LE(13)
  //     const magnitude = this.quantize(this.bytes.readUint8(15), 0, 1500)
  //     const battery = this.quantize(this.bytes.readUint8(16), 2, 4.5)
  //     const crc = this.bytes.readUint16LE(17)
      
  //     const data = {
  //       'packet': {
  //           'rev': packet_rev,
  //           'counter': 0
  //       },
  //       'unique_id': null,
  //       'address': null,
  //       'reason': null,
  //       'flags': null,
  //       'alt': null,
  //       'received_at': this.getDateFromEpoch(epoch),
  //       'location': {
  //           'latitude': lat,
  //           'longitude': lng,
  //           'hdop': null
  //       },
  //       'battery': battery.toFixed(2) * 100,
  //       'activity': act,
  //       'crc': crc,
  //       'temp': null,
  //       'extra': {
  //           'polar_act': polar_act,
  //           'magnitude': magnitude,
  //           'mortality': true
  //       }
  //     }
  //     console.log(data)
  //     return data
  //   }
  
  //   /**
  //    * 
  //    * @param {ArrayBuffer} bs 
  //    * @param {Number} factor 
  //    */
  //   getCoord(bs, factor) {
  //     if (bs.length < 3) {
  //       return None
  //     }
  //     let b2 = bs[2] & 0x7f
  //     if ((bs[2] & 0x80) > 0) {
  //       factor = -factor
  //     }
  //     const contents = [
  //       bs[0],
  //       bs[1],
  //       b2,
  //       0x00
  //     ]
  //     const a = Buffer.from(contents)
  //     const coord = a.readUInt32LE()
  //     return parseFloat((coord / factor).toFixed(6))
  //   }
  
  //   getDateFromEpoch(epoch) {
  //     if (epoch == null) {
  //       return null
  //     }
  //     return new Date(epoch * 1000)
  //   }
  
  //   parseCombinedHdop(value){
  //     if (value) {
  //       return [
  //         value >> 4,
  //         value & 0x0F
  //       ]
  //     }
  //     else {
  //       return [null, null]
  //     }
  //   }
  
  //   parseHourlyAct(value) {
  //     // mask all but rightmost 2 bits for each of 4 pairwise bits in byte
  //     const mask = 0x3
  //     if (value == null) {
  //       return [-1,-1,-1,-1]
  //     }
  //     return [
  //         value & mask,
  //         (value >> 2) & mask,
  //         (value >> 4) & mask,
  //         (value >> 6) & mask 
  //     ]
  //   }
  
  //   quantize(value, min, max) {
  //     const n_bytes = 1
  //     let factor = 0
  //     let result = 0
  //     if (value) {
  //       factor = (max - min) / (256 * n_bytes)
  //       result = value * factor + min
  //     }
  //     return result
  //   }
  // }
  