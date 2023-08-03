import moment from 'moment'

/**
 * file formatter for BLE data
 */
class BleFormatter {
  /**
   * 
   * @param {*} opts 
   */
  constructor(opts) {
    this.header = [
      'Time',
      'Service',
      'Product',
      'Family',
      'ID',
      'VCC',
      'Temp(C)',
    ]
    this.date_format = opts.date_format
  }

  /**
   * @param {String} data
   */

  parsePayload(data) {
    return {
    //   raw_payload: data,
      service: data.readUInt16LE(2),
      product: data.readUInt8(4),
      family: data.readUInt8(5),
      id: data.subarray(6, 10).toString('hex'),
      vcc: data.readUInt8(10) * 0.03125,
      temp: data.readUInt16LE(11) / 100
    }
  }

  /**
   * 
   * @param {object} record - GPS record received from GPSD
   */
  formatRecord(record) {
    console.log('beep formatter record', record)
    // console.log('beep record protocol', record.protocol)
    // console.log('beep record data type', record.meta.data_type)

    let fields, recorded_at
    let { service, product, family, id, vcc, temp } = parsePayload(Buffer.from(payload, 'hex'))
    console.log('BLE Parsed Data', ble_data)

    // let tag_type = 'ble'
    
      fields = [
        recorded_at.format(this.date_format),
        service,
        product,
        family,
        id,
        vcc,
        temp
      ]
    
    console.log('beep formatter fields', fields)
    return fields
  }
}

export { BleFormatter }