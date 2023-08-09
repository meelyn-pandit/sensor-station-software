import parsePayload from './ble-parser.js'
// import moment from 'moment'

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
      'RadioId',
      'BleId',
      'Protocol',
      'RSSI',
      'Service',
      'Product',
      'Family',
      'ID',
      'VCC',
      'Temp',
      // 'TagType',
    ]
    this.date_format = opts.date_format
  }

  /**
   * 
   * @param {object} record - GPS record received from GPSD
   */
  formatRecord(record) {

    // console.log('ble formatter record', record)
    // console.log('beep record protocol', record.protocol)
    // console.log('beep record data type', record.meta.data_type)

    let fields, recorded_at, channel, ble_chan, protocol, tag_rssi
    let { service, product, family, id, vcc, temp } = parsePayload(Buffer.from(record.data.payload, 'hex'))
    let tag_type = record.meta.data_type
    // console.log('ble tag type', tag_type)
    // if (record.protocol) {
      
      recorded_at = record.received_at
      channel = record.channel
      ble_chan = record.meta.chan
      protocol = record.protocol
      tag_rssi = record.meta.rssi
      
      fields = [
        recorded_at.format(this.date_format),
        channel,
        ble_chan,
        protocol,
        tag_rssi,
        service,
        product,
        family,
        id,
        vcc,
        temp,
        // tag_type,
      ]
    // }
    if(vcc < 2.0) {
      console.error('Solar voltage is low')
    }
    console.log('ble formatter fields', fields)

    return fields
  }
}

export { BleFormatter }