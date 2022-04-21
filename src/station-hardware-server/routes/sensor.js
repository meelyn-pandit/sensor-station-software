var express = require('express');
var router = express.Router();
const {Adc, Tmp102} = require('@cellular-tracking-technologies/adc-driver');

let options = {type:"Ads7924"};
const adc = new Adc(options);
const temp = new Tmp102();
adc.init();
temp.init();

let temperature = {}
let voltages = {}

setInterval(() => {

    voltages.battery = (adc.read(0) * (5.016 / 4096) * 6).toFixed(2);
    voltages.solar = (adc.read(1) * (5.016 / 4096) * 6).toFixed(2);
    voltages.rtc = (adc.read(2) * (5.016 / 4096)).toFixed(2);

    temperature.celsius =  temp.read().toFixed(0);
    temperature.fahrenheit = (temperature.celsius * 1.8 + 32).toFixed(0);

}, 5000);

router.get('/voltages', function(req, res, next) {
    res.json(voltages);
});
 
router.get('/temperature', function(req, res, next) {
    res.json(temperature);
});

router.get('/details', (req, res, next) => {
    res.json({
        voltages: voltages,
        temperature: temperature
    });
})

module.exports = router;