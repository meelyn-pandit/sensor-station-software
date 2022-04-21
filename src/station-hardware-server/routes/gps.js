var express = require('express');
var router = express.Router();

const { GpsClient } = require('@cellular-tracking-technologies/gps-client');

let gps = new GpsClient({ max_gps_records: 100 });
gps.start();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.json(gps.info());
});

module.exports = router;