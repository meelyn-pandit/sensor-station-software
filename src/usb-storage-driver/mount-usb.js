import { exec } from 'child_process'
import fs from 'fs'

class MountUsb {

  constructor(dir) {
    this.dir = dir
  }

  mount(device) {
    return new Promise((resolve, reject) => {
			console.log('mounting USB drive', device)
      if (fs.existsSync(this.dir) == false) {
        fs.mkdirSync(this.dir)
      }

			let error
      // $ 'mount /dev/${drive} ${this.dir}'
      let child = exec(`mount ${device} ${this.dir}`, (error, stdout, stderr) => {
        if (error) {
          reject(error)
        }
				error = stderr
      })
      child.on('close', (code) => {
				if (code != 0) {
					reject(`usb mount error ${error}`)
				} else {
					resolve(code)
				}
      })
    })
  }

  unmount() {
		console.log('unmounting USB drive', this.dir)
    return new Promise((resolve, reject) => {
      if (fs.existsSync(this.dir) == false) {
        resolve()
      }
			let error
      let child = exec(`umount ${this.dir}`, (error, stdout, stderr) => {
        if (error) {
          reject(error)
        }
				error = stderr
      })
      child.on('close', (code) => {
				if (code != 0) {
					reject(`usb umount error code ${error}`)
				} else {
					resolve(code)
				}
      })
    })
  }

  clean() {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(this.dir) == false) {
        resolve()
      }
      let child = exec(`rm -rf ${this.dir}`, (error, stdout, stderr) => {
        if (error) {
          console.log(error)
          reject(error)
        }
      })
      child.on('close', (code) => {
        resolve()
      })
    })
  }
}

export default MountUsb
