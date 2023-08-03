import { FileManager } from './file-manager.js'
import { Logger } from './logger.js'
import { BeepFormatter } from './beep-formatter.js'
import { LogFormatter } from './log-formatter.js'
import { GpsFormatter } from './gps-formatter.js'
import { NodeHealthFormatter } from './node-health-formatter.js'
import { TelemetryFormatter } from './telemetry-formatter.js'
import { BleFormatter } from './ble-formatter.js'
import { BeepStatManager } from './beep-stat-manager.js'
import moment from 'moment'

/**
 * manager class for incoming beep packets
 */
class DataManager {
  /**
   * 
   * @param {*} opts 
   */
  constructor(opts) {
    this.id = opts.id
    this.base_log_dir = opts.base_log_dir
    this.date_format = opts.date_format
    this.stats = new BeepStatManager()

    // utility for maintaining filenames for given id, descriptor (suffix)
    this.file_manager = new FileManager({
      id: this.id,
      base_log_dir: this.base_log_dir
      // base_log_dir: '/home/ctt/sensor-station-software/src/test-data/'
    })

    // loggers for each data file
    this.loggers = {
      log: new Logger({
        fileuri: this.file_manager.getFileUri('log'),
        suffix: 'log',
        formatter: new LogFormatter({
          date_format: this.date_format
        })
      }),
      beep: new Logger({
        fileuri: this.file_manager.getFileUri('raw-data'),
        suffix: 'raw-data',
        formatter: new BeepFormatter({
          date_format: this.date_format
        }),
      }),
      gps: new Logger({
        fileuri: this.file_manager.getFileUri('gps'),
        suffix: 'gps',
        formatter: new GpsFormatter({
          date_format: this.date_format
        })
      }),
      node_health: new Logger({
        fileuri: this.file_manager.getFileUri('node-health'),
        suffix: 'node-health',
        formatter: new NodeHealthFormatter({
          date_format: this.date_format
        })
      }),
      telemetry: new Logger({
        fileuri: this.file_manager.getFileUri('telemetry'),
        suffix: 'telemetry',
        formatter: new TelemetryFormatter({
          date_format: this.date_format
        })
      }),
      ble: new Logger({
        fileuri: this.file_manager.getFileUri('ble'), // getting same raw data as radio beeps and using conditionals
        suffix: 'ble', // try ble suffix and if that doesn't work, switch to raw-data
        formatter: new BleFormatter({
          date_format: this.date_format
        })
      })
    }
  }

  /**
   * write all the loggers cache to disk
   */
  writeCache() {
    Object.keys(this.loggers).forEach((key) => {
      let logger = this.loggers[key]
      // console.log('logger', logger)
      logger.writeCacheToDisk()
    })
  }

  /**
   * 
   * @param {*} msg - general message to log
   */
  log(...msgs) {
    msgs.unshift(moment(new Date).utc().format(this.date_format))
    this.loggers.log.addRecord(msgs.join(','))
  }

  /**
   * 
   * @param {*} beep 
   */
  handleRadioBeep(beep) {
    // console.log('handle radio beep', beep)
    let record, id, stats
    if (beep.meta) {
      // expect new protocol
      switch (beep.meta.data_type) {
        case 'ble_tag': {
          // console.log('this is a ble tag')
          record = this.loggers.beep.addRecord(beep)
          console.log('ble record', record)
          this.stats.addBleBeep(record)
          break
        }
        case 'coded_id': {
          record = this.loggers.beep.addRecord(beep)
          this.stats.addBeep(record)
          break
        }
        case 'node_coded_id': {
          record = this.loggers.beep.addRecord(beep)
          this.stats.addBeep(record)
          break
        }
        case 'node_health': {
          record = this.loggers.node_health.addRecord(beep)
          this.stats.addNodeHealth(record)
          break
        }
        case 'telemetry': {
          record = this.loggers.telemetry.addRecord(beep)
          this.stats.addTelemetryBeep(record)
          break
        }
        default: {
          console.log(beep)
          console.error(`i don't know what to do with this record`)
          break
        }
      }
    } else {
      // handle original protocol
      if (beep.data.node_alive) {
        record = this.loggers.node_health.addRecord(beep)
        this.stats.addNodeHealth(record)
      }
      if (beep.data.node_beep) {
        record = this.loggers.beep.addRecord(beep)
        this.stats.addBeep(record)
      }
      if (beep.data.tag) {
        record = this.loggers.beep.addRecord(beep)
        this.stats.addBeep(record)
      }
    }
  }

  /**
   * 
   * @param {*} record - GPS record
   */
  handleGps(record) {
    this.loggers.gps.addRecord(record)
  }

  /**
   * 
   * @param {*} beep - BLE beep - need to parse out payload here?
   */
  handleBleBeep(record){
    console.log('handle ble beep', beep)
    this.loggers.ble.addRecord(record)
  }

  /**
   * rotate all logging files
   */
  rotate() {
    // reduce the array of loggers by rotating data files one at a time
    return Object.keys(this.loggers).reduce((previousPromise, nextLoggerKey) => {
      let logger = this.loggers[nextLoggerKey]
      return previousPromise.then((rotateResult) => {
        // after prior promise - return the next promise to execute
        return this.file_manager.rotateDataFile({
          fileuri: logger.fileuri,
          new_basename: this.file_manager.getFileName(logger.suffix)
        })
          .then(rotate_response => Promise.resolve(true))
          .catch((err) => {
            console.error(`problem rotating file ${logger.fileuri}`)
            console.error(err)
          })
      })
    }, Promise.resolve(true))
  }
}

export { DataManager }
