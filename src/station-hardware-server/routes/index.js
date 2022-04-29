import express from 'express'
var router = express.Router()
import glob from 'glob'
import fs from 'fs'
import { ComputeModule } from './compute-module.js'
import getDeviceId from '../../id-driver/index.js'

const ModuleInfo = new ComputeModule()

/**
 * get a list of CTT software packages / versions
 */
function GetPackageVersions() {
  return new Promise((resolve, reject) => {
    let file_pattern = '/home/pi/ctt/*/package.json'
    let packages = []
    glob(file_pattern, (err, filenames) => {
      if (err) {
        reject(err)
      }
      filenames.forEach((filename) => {
        try {
          let contents = JSON.parse(fs.readFileSync(filename))
          packages.push({
            name: contents.name,
            version: contents.version
          })
        } catch (err) {
          console.error('unable to parse package.json')
          console.error(err)
        }
      })
      resolve(packages)
    })
  })
}


let device_id
getDeviceId().then((id) => {
  device_id = id
}).catch((err) => {
  console.log('Device ID Error')
  console.error(err)
  device_id = "error"
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({ welcome: true })
})

router.get('/id', function (req, res, next) {
  res.json({ id: device_id })
})

router.get('/about', (req, res, next) => {
  ModuleInfo.info()
    .then((info) => {
      info.station_id = device_id
      return info
    })
    .then((info) => {
      try {
        let bootcount = parseInt(fs.readFileSync('/etc/bootcount').toString().trim())
        info.bootcount = bootcount
        let station_image = fs.readFileSync('/etc/ctt/station-image').toString().trim()
        info.station_image = station_image
        let station_image_software = fs.readFileSync('/etc/ctt/station-software').toString().trim()
        info.station_software = station_image_software
      } catch (err) {
        console.log('unable to load extra meta data', err.toString())
      }
      res.json(info)
    })
    .catch((err) => {
      res.json({ err: err.toString() })
    })
})

router.get('/node/version', function (req, res, next) {
  GetPackageVersions()
    .then((packages) => {
      res.json({ packages: packages })
    })
    .catch((err) => {
      res.status(500).send()
    })
})

module.exports = router
