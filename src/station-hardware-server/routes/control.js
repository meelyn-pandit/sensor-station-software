import { exec }  from 'child_process'
const express = require('express')
const router = express.Router()
const fs = require('fs')

const REBOOT_TEMPLATE = `#!/bin/bash
echo 'updating crontab'
tmp=/tmp/root-crontab
sudo crontab -l -u root | grep -v shutdown > $tmp
echo "WHEN /sbin/shutdown -r now" >> $tmp
sudo crontab -u root $tmp
rm $tmp
echo 'finished'
`
router.get('/reboot-schedule', (req, res) => {
  exec('sudo crontab -l -u root | grep shutdown', (err, stdout, stderr) => {
    if (err) {
      console.error(err)
      res.sendStatus(500)
    }
    let vals = stdout.split(/[ ,]+/)
    res.json({
      m: vals[0],
      h: vals[1],
      dom: vals[2],
      mon: vals[3],
      dow: vals[4]
    })
  })
})

const validate = (opts) => {
  let value = opts.value.trim()
  if (value == '*') {
    return value
  }
  if (value >= opts.min && value < opts.max) {
    return value
  }
  return false
}

let default_minute = 23
let default_hour = 4
let default_dom = '*'
let default_mon = '*'
let default_dow = 0

router.post('/update-reboot-schedule', (req, res) => {
  let minute = validate({ value: req.body.minute, min: 0, max: 60 })
  minute = minute ? minute : default_minute
  let hour = validate({ value: req.body.hour, min: 0, max: 24 })
  hour = hour ? hour : default_hour
  let dom = validate({ value: req.body.dom, min: 1, max: 32 })
  dom = dom ? dom: default_dom
  let mon = validate({ value: req.body.mon, min: 1, max: 13})
  mon = mon ? mon: default_mon
  let dow = validate({ value: req.body.dow, min: 0, max: 7})
  dow = dow ? dow: default_dow

  let when = `${minute} ${hour} ${dom} ${mon} ${dow}`
  let script = REBOOT_TEMPLATE.replace(/WHEN/, when)
  console.log('writing file', script)
  let filename = '/tmp/update-reboot-schedule.sh'
  fs.writeFile(filename, script, (err) => {
    if (err) {
      console.error('error writing tmp bash file')
      console.error(err)
      res.sendStatus(500)
    }
    console.log('about to execute crontab replacement')
    exec(`/bin/bash ${filename}`, (err, stdout, stderr) => {
      if (err) {
        console.error('error executing tmp bash file')
        console.error(err)
        res.sendStatus(500)
      }
      console.log(stdout)
      console.log('finished running reboot rewrite -sending valid status....')
      res.sendStatus(204)
    })
  })
})

module.exports = router