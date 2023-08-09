import moment from 'moment'
import parsePayload from './ble-parser.js'
// import CttBLERawDataPayloadV01 from './ble-parser'

/**
 * file formatter for GPS files
 */
class BeepFormatter {
  /**
   * 
   * @param {*} opts 
   */
  constructor(opts) {
    this.header = [
      'Time',
      'RadioId',
      'TagId',
      'TagRSSI',
      'NodeId',
      'Validated',
      'Type',
      // 'VCC',
      // 'Temp',
      // 'Service',
      // 'Product',
      // 'Family'
    ]
    this.date_format = opts.date_format
  }

  /**
   * 
   * @param {object} record - GPS record received from GPSD
   */
  formatRecord(record) {
    // console.log('beep formatter record', record)
    // console.log('beep record protocol', record.protocol)
    // console.log('beep record data type', record.meta.data_type)

    let fields, recorded_at, tag_rssi, vcc, temp, service, product, family
    let ble_data = record.data.payload ? parsePayload(Buffer.from(record.data.payload, 'hex')) : null
    let node_id = ''
    let validated = 0
    let tag_id = record.data.id ? record.data.id : ble_data.id
    // console.log('BLE Parsed Data', ble_data)

    let tag_type = record.meta.data_type
    if (record.protocol) {
      // handle new protocol
      switch (record.meta.data_type) {
        case 'ble_tag':
          vcc = ble_data.vcc
          temp = ble_data.temp
          service = ble_data.service
          product = ble_data.product
          family = ble_data.family
          tag_rssi = record.meta.rssi
          recorded_at = record.received_at
          break
        case 'node_coded_id':
          // beep originated from a node
          // get the node id, and get the recorded at date from the device
          // tag_id = record.data.id
          node_id = record.meta.source.id
          recorded_at = moment(new Date(record.data.rec_at * 1000)).utc()
          tag_rssi = record.data.rssi
          break
        case 'coded_id':
          // tag_id = record.data.id
          tag_rssi = record.meta.rssi
          recorded_at = record.received_at
          break
        default:
          // beep on the radio - use the time it was received
          recorded_at = record.received_at
          break
      }
      // if (tag_id.length == 10) {v12
      // }

      fields = [
        recorded_at.format(this.date_format),
        record.channel,
        tag_id,
        tag_rssi,
        node_id,
        validated,
        tag_type,
        // vcc = ble_data ? ble_data.vcc : null, // need to have ble data defined here otherwise it will not get saved to raw data csv
        // temp = ble_data ? ble_data.temp : null,
        // service = ble_data ? ble_data.service : null,
        // product = ble_data ? ble_data.product : null,
        // family = ble_data ? ble_data.family : null,
      ]
    } else {
      // handle original protocol
      // if (record.data.tag || record.data.payload) {
        if (record.data.tag) {
        // beep received at radio
        recorded_at = record.received_at
        fields = [
          recorded_at.format(this.date_format),
          record.channel,
          record.data.tag.id,
          record.rssi,
          '',
          validated,
          tag_type
        ]
      } else if (record.data.payload) {
        fields = [
          recorded_at.format(this.date_format),
          record.channel,
          tag_id,
          tag_rssi,
          node_id,
          validated,
          tag_type,

        ]
      } else if (record.data.node_beep) {
        // beep received by a node
        recorded_at = record.received_at.subtract(record.data.node_beep.offset_ms, 'ms')
        fields = [
          record.received_at.format(this.date_format),ble_tag
        ]
      } else {
          console.error(`i don't know what to do ${record}`)
          console.log(record)
          fields = null
        }
    }
    return fields
  }
}

export { BeepFormatter }