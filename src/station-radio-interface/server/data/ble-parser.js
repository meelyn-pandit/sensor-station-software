// import RawDataPayload from './ble-raw.js' // need to get datapacket from beep-formatter?

/**
 * Payload Format:
 * 
 * f908
Payload: AA BB CCCC DD EE FFFFFFFF GG HHHH II JJ KKKKKK
Hex:     0c 16 1c18 01 00 00000035 49 3813 04 09 435454
         
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
  console.log('calling parser')
    // console.log('ble parser data', data)
    // const total_length = parseInt(data.toString('hex', 0, 1), 16)
    // const total_length = 11
    // console.log('total byte length', total_length)

      // if (total_length !== 12) { 
      //   // throw new Error('Bad payload, length is not 12 bytes!')
      //   console.error('BLE Parser Error: Bad payload, length is not 12 bytes')
      //   return {
      //     service: 'E101',
      //     product: 'E101',
      //     family: 'E101',
      //     id: 'E101',
      //     vcc: 'E101',
      //     temp: 'E101',
      //   }
      // }

    // const total_length = 11
    // console.log('total payload length', total_length)
  const broadcast_id = data.subarray(15, 18).toString('utf8') // utf8 is ascii character
    // const broadcast_id = 'BTT'
  
    // console.log('broadcast id', broadcast_id)
  
    // if (broadcast_id !== 'CTT') {
    //   console.error('Broadcast ID is not CTT and is: ', broadcast_id)
    //   return {
    //     service: 'E102',
    //       product: 'E102',
    //       family: 'E102',
    //       id: 'E102',
    //       vcc: 'E102',
    //       temp: 'E102',
    //   }
    // }
  
  const x = {
    byte_length: parseInt(data.toString('hex', 0, 1), 16),
    service: data.readUInt16LE(2),
    product: data.readUInt8(4), // 1 byte = 8 bits
    family: data.readUInt8(5),
    id: data.subarray(6, 10).toString('hex'),
    vcc: data.readUInt8(10) * 0.03125,
    temp: data.readUInt16LE(11) / 100
  }
  // console.log('PARSED STUFF', x)
  return x
}