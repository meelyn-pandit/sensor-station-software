var express = require('express');
var router = express.Router();
const fs = require('fs')
const {UsbStorage, BlockDeviceCmd} = require('@cellular-tracking-technologies/usb-storage-driver');
// const WifiConfig = require('wifi-config').default;


class WifiConfig {
    constructor(path) {
        this.path = path;
    }
    init(country) {
        return new Promise((resolve, reject) =>{
            try {
                const file = this.path;
                const contents = `ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev\nupdate_config=1\ncountry=${country}\n`;
                fs.appendFile(file, contents, {flag:'w'},()=>{
                    resolve();
                });
            } catch (err) {
                reject(err);
            }
        });
    }
    addNetwork(ssid, psk) {
        try {
            const file = this.path;
            const contents = `\nnetwork={\n\tssid=\"${ssid}\"\n\tpsk=\"${psk}\"\n}`;
            fs.appendFileSync(file, contents);
        } catch (err) {
            console.log("err");
        }
    }
}



let usb = new UsbStorage();

/* GET home page. */
router.get('/', function(req, res, next) {

    new BlockDeviceCmd().poll()
    .then((devices) =>{
        res.json(devices);
    }).catch((error) => {
        res.json(null);
    });

});

const success = {status:"success"};
const fail = {status:"fail"};

router.get('/mount', function(req, res, next) {
    usb.mount()
    .then(()=>{
        res.json(success);
    }).catch((err) =>{
        res.json(fail);
    });
});

router.get('/unmount', function(req, res, next) {
    usb.unmount()
    .then(()=>{
        res.json(success);
    }).catch((err) =>{
        res.json(fail);
    });
});

router.get('/data', function(req, res, next) {
    req.setTimeout(1000*60*10); // set a 10 minute timeout for the usb transfer process to complete
    usb.copyTo("/data", /.*$/, (err)=>{
        if(err){
            res.json(fail);
        }else{
            res.json(success);
        }
    });
});

router.get('/wifi', function(req, res, next) {  

    const path = "/mnt/usb/wifi/credentials.json";

    if(fs.existsSync(path)){
        var data = JSON.parse(fs.readFileSync(path, 'utf8'));

        let wifi = new WifiConfig("/etc/wpa_supplicant/wpa_supplicant.conf");
        wifi.init(data.country)
        .then(()=>{
            wifi.addNetwork(data.ssid, data.psk);
        }).catch((err)=>{
            console.log(err);
        })

        return res.json(success);
    }
    return res.json(fail);
});

module.exports = router;
