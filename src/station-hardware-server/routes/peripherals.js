const express = require('express');
const router = express.Router()
const { exec }= require('child_process');

router.get('/', function(req, res, next) {
  // run lsusb and parse the results
  exec("lsusb", (err, stdout, stderr) => {
    if (err) {
      res.json({'error': err.toString()});
    }
    let fields;
    let lines = stdout.split('\n');
    let records = [];
    let ids, values;
    // for each lsusb record - pull out device id, vendor id, product id and name
    lines.forEach((line) => {
      fields = line.split(' ');
      if (fields.length > 6) {
        ids = fields[5];
        values = ids.split(':');
        records.push({
          device: fields[3],
          vendor: values[0],
          product: values[1],
          name: fields.slice(6,).join(' ').trim()
        });
      }
    });
    res.json({
      info: records
    });
  });
});

module.exports = router;