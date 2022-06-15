import MountUsb from './mount-usb.js'
import ncp from 'ncp'
import path from 'path'
import drivelist from 'drivelist'

class UsbStorage {
  
  constructor(mount_point = "/mnt/usb") {
    this.mount_point = mount_point
    this.drive = new MountUsb(mount_point)
  }
  mount() {
    return new Promise((resolve, reject) => {
			// first run the unmount script to clean the mount directory (rm)
      this.unmount().then(() => {
        // list drives
        return drivelist.list().then(devices => {
          // filter USB drives
          return devices.filter(device => { device.busType='USB' })
        })
      }).then((devices) => {
        // validate more than 0 USB drives attached
        if (devices.length > 0) {
          // return first drive in the list...
          return this.drive.mount(devices[0].device)
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
  unmount() {
    return new Promise((resolve, reject) => {
      this.drive.unmount()
        .then(() => {
          return this.drive.clean()
        }).then(() => {
          resolve()
        }).catch((err) => {
					console.log('usb umount err', err)
          resolve(err)
        })
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
