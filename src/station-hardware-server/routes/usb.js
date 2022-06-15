import express from 'express'
import fs from 'fs'
import { UsbStorage } from '../../usb-storage-driver/index.js'
import drivelist from 'drivelist'

const router = express.Router()

class WifiConfig {

  constructor(country) {
    if (!country) {
      // default to US
      country = 'US'
    }
    this.country = country 
    this.wpa_supplicant_location = '/etc/wpa_supplicant/wpa_supplicant.conf'
    this.wifi_header = `ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev\nupdate_config=1\ncountry=${country}\n`
  }

  init() {
    if (fs.existsSync(this.wpa_supplicant_location)) {
      // wpa_supplicant exists (as it should) - read it
      let contents = fs.readFileSync(this.wpa_supplicant_location).toString()
      // check if this wifi header is found 
      if (contents.search(this.wifi_header) < 0) {
        // header is not found - re-create file
        console.log('overwriting wpa_supplicant file with new header')
        fs.writeFileSync(this.wpa_supplicant_location, this.wifi_header)
      } else {
        console.log('wpa_supplicant header found - not doing anything')
      }
    }
  }

  /**
   * 
   * @param {*} opts.ssid
   * @param {*} opts.psk
   */
  addNetwork(opts) {
    console.log('adding wifi network', opts)
    const network_info = `\nnetwork={\n\tssid=\"${ssid}\"\n\tpsk=\"${psk}\"\n}`
    fs.appendFileSync(this.wpa_supplicant_location, network_info)
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

router.get('/wifi', function (req, res, next) {
  const path = "/mnt/usb/wifi/credentials.json"
  let response = fail

  if (fs.existsSync(path)) {
    try {
      // load JSON file with credentials
      var data = JSON.parse(fs.readFileSync(path, 'utf8'))
      let wifi = new WifiConfig(data.country)
      wifi.init(data.country)
      wifi.addNetwork(data.ssid, data.psk)
      // finished
      response = success
    } catch(err) {
      console.log('something went wrong adding wifi network')
      console.log(err)
    }
  }
  res.json(response)
})

export default router