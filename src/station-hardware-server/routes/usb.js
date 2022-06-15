import express from 'express'
import fs from 'fs'
import { UsbStorage } from '../../usb-storage-driver/index.js'
import drivelist from 'drivelist'

const router = express.Router()

class WifiConfig {

	/**
	 * 
	 * @param {*} country 
	 */
  constructor(country) {
    if (!country) {
      // default to US
      country = 'US'
    }
    this.country = country 
    this.wpa_supplicant_location = '/etc/wpa_supplicant/wpa_supplicant.conf'
    this.wifi_header = `ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev\nupdate_config=1\ncountry=${country}\n`
  }

  /**
   * write wpa_supplicant.conf file - only supports 1 network at a time
   * @param {*} opts.ssid
   * @param {*} opts.psk
   */
  write(opts) {
		if (opts.ssid) {
      if (opts.psk) {
        const network_info = `\nnetwork={\n\tssid=\"${opts.ssid}\"\n\tpsk=\"${opts.psk}\"\n}`
        const file_contents = `${this.wifi_header}${network_info}`
        fs.writeFileSync(this.wpa_supplicant_location, file_contents)
      }
		}
		throw new Error('missing ssid and/or psk')
  }
}

const usb = new UsbStorage()

/* GET home page. */
router.get('/', function (req, res, next) {
  drivelist.list()
    .then((devices) => {
      res.json(devices.filter(device => { return device.busType == 'USB'}))
    }).catch((error) => {
      res.json(null)
    })
})

const success = { status: "success" }
const fail = { status: "fail" }

router.get('/mount', (req, res) => {
  usb.mount()
    .then(() => {
      res.json(success)
    }).catch((err) => {
      res.json(fail)
    })
})

router.get('/unmount', (req, res) => {
  usb.unmount()
    .then(() => {
      res.json(success)
    }).catch((err) => {
      console.log('hardware-server USB umount error')
      console.error(err)
      res.json(fail)
    })
})

router.get('/data', (req, res, next) => {
  req.setTimeout(1000 * 60 * 10) // set a 10 minute timeout for the usb transfer process to complete
  usb.copyTo("/data", /.*$/, (err) => {
    if (err) {
      res.json(fail)
    } else {
      res.json(success)
    }
  })
})

/**
 * load WiFi credentials from USB mount point
 */
router.get('/wifi', function (req, res, next) {
  const path = "/mnt/usb/wifi/credentials.json"
  let response = fail

  if (fs.existsSync(path)) {
    try {
      // load JSON file with credentials
      var data = JSON.parse(fs.readFileSync(path, 'utf8'))
      let wifi = new WifiConfig(data.country)
      wifi.write({
				ssid: data.ssid, 
				psk: data.psk
			})
      // finished
      response = success
    } catch(err) {
      console.log('something went wrong adding wifi network')
      console.log(err)
    }
  } else {
		console.log('hardware-server WiFi crendentials path does not exist', path)
	}
  res.json(response)
})

export default router