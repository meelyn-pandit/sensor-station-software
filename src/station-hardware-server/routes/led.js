var express = require('express');
var router = express.Router();

const { Led } = require('@cellular-tracking-technologies/led-driver');

let led_gps = new Led(38);
let led_diag_a = new Led(39);
let led_diag_b = new Led(40);

led_gps.init();
led_diag_a.init();
led_diag_b.init();

function setLedState(led, options){

    const ret_ok = {res:true};
    const ret_err = {res:false};

    if(("state" in options) == false){
        return ret_err;
    }

    switch(options.state){
        case 'on':
            led.on();
            break;
        case 'off':
            led.off();
            break;
        case 'toggle':
            led.toggle();
            break;
        case 'blink':
            let blink_rate = 250;
            if("blink_rate_ms" in options){
                blink_rate = options.blink_rate_ms;
            }
            led.blink(blink_rate);
            break;
        default:
            console.log("default led");
            return ret_err;
    }
    return ret_ok;
}

/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({});
});

router.post('/diag/a', function(req, res) {
    res.json(setLedState(led_diag_a, req.body));    
});
router.post('/diag/b', function(req, res) {
    res.json(setLedState(led_diag_b, req.body));    
});
router.post('/gps', function(req, res) {
    res.json(setLedState(led_gps, req.body));
});

module.exports = router;