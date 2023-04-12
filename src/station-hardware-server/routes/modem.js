
import express from 'express'
import { exec } from 'child_process'
import { ModemInterface, QuectelCommandSetParser } from '../../modem-status-driver/index.js'
import RunCommand from '../../command.js'
var router = express.Router()

const Modem = new ModemInterface({
  uri: '/dev/station_modem_status',
  baud_rate: 115200,
  command_set_parser: QuectelCommandSetParser,
  poll_frequency_seconds: 10
})
try {
  Modem.open()
} catch (err) {
  console.error('unable to open the modem')
  console.error(err)
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json(Modem.info)
})

router.get('/ppp', (req, res, next) => {
  // check if at least 1 ppp connection exists
  exec('ifconfig | grep ppp | wc -l', (err, stdout, stderr) => {
    if (err) {
      res.status(500).send(err.toString())
    }
    let status = false
    if (parseInt(stdout) > 0) {
      status = true
    }
    res.json({
      ppp: status
    })
  })
})

router.post('/stop', (req, res, next) => {
  RunCommand('systemctl stop modem')
    .then((response) => {
      res.status(204).send()
    })
    .catch((err) => {
      res.status(500).send(err.toString())
    })
})

router.post('/start', (req, res, next) => {
  RunCommand('systemctl start modem')
    .then((response) => {
      res.status(204).send()
    })
    .catch((err) => {
      res.status(500).send(err.toString())
    })
})

router.post('/enable', (req, res, next) => {
  RunCommand('systemctl enable /lib/ctt/sensor-station-software/system/modem/modem.service')
    .then((response) => {
      // start the modem after enabling
      RunCommand('systemctl restart modem')
        .then((response) => {
          res.status(204).send()
        })
    })
    .catch((err) => {
      res.status(500).send(err.toString())
    })
})

router.post('/disable', (req, res, next) => {
  RunCommand('systemctl disable modem')
    .then((response) => {
      res.status(204).send()
    })
    .catch((err) => {
      res.status(500).send(err.toString())
    })
})

export default router