import MountUsb from './mount-usb.js'
import ncp from 'ncp'
import path from 'path'
import UsbScanner from './usb-scanner.js'

class UsbStorage {
  
  constructor(mount_point = "/mnt/usb") {
    this.mount_point = mount_point
    this.drive = new MountUsb(mount_point)
    this.scanner = new UsbScanner()
  }

  async mount() {
    return new Promise((resolve, reject) => {
			// first run the unmount script to clean the mount directory (rm)
      this.unmount().then(() => {
        // list drives
        return this.scanner.retriveUsb()
      }).then((device) => {
        // validate more than 0 USB drives attached
        if (device) {
          // return first drive in the list...
          return this.drive.mount(device.path)
        } else {
          reject("No Usb Devices Detected")
        }
      }).then((code) => {
        // command line response code
        if (code != 0) {
          // reject if the reponse code is non 0
          reject(`code: ${code} mount response`)
        }
        // finished
        resolve()
      }).catch((err) => {
        console.log('usb mount err', err)
        reject(err)
      })
    })
  }

  async unmount() {
    return this.drive.unmount()
      .then(() => {
        return this.drive.clean()
      })
  }

  copyTo(src, pattern, callback) {
    ncp.ncp.limit = 16
    ncp(src, this.mount_point, { filter: pattern }, callback)
  }

  copyFrom(src, dest, callback) {
    ncp.ncp.limit = 16
    ncp(path.join(this.mount_point, src), dest, callback)
  }
}

export default UsbStorage
