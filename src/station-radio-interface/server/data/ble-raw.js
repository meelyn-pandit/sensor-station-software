// Raw payload from BLE tags
export default class RawDataPayload {

  /**
   * @param {String} hex_string 
   */
  constructor(hex_string) {
    this.hex_string = hex_string
    this.bytes = null
    try {
      this.bytes = Buffer.from(hex_string, 'hex')
    } catch (err) {
      console.log(err)
      throw new Error('invalid hex string')
    }

    // to be over-ridden by child class
    this.data = null // overridden by child class
    this.valid = false
  }

  /**
 * 
 * @param data buffer
 */
parse_payload(data) {
    return {
      service: data.readUInt16LE(2),
      product: data.readUInt8(4),
      family: data.readUInt8(5),
      id: data.subarray(6, 10).toString('hex'),
      vcc: data.readUInt8(10) * 0.03125,
      temp: data.readUInt16LE(11) / 100
    }
  }
  
  
//   const payload = "0c161c180100000000395ef9080409435454"
//   let obj = parse_payload(Buffer.from(payload, 'hex'))
//   console.log(obj)

//   /**
//    * 
//    * @param {Buffer} bytes_to_validate 
//    */
//   validateCrc(bytes_to_validate) {
//     // PYTHON CODE
//     // """CRC validation"""
//     // see: https://crcmod.sourceforge.net/crcmod.predefined.html
//     // crc16 = crcmod.mkCrcFun(0x11021, rev=False, initCrc=0xFFFF, xorOut=0x0000)
//     // crc_res = crc16(bytes_to_validate)
//     // #####################################################################################################################
//     // Python 2 code appears to use the crc method crc-ccitt-false per https://crcmod.sourceforge.net/crcmod.predefined.html
//     const crc_res = crc.crc16ccitt(bytes_to_validate)
//     if (crc_res == this.data['crc']) {
//       return true
//     }
//     return false
//   }
}