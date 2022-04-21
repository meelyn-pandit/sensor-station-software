const fetch = require('node-fetch');
const url = require('url');

class UsbWifiUploadTask {
    constructor(base_url) {
        this.url = url.resolve(base_url, 'usb/wifi')
        this.header = "WiFi";
    }
    loading() {
        return [this.header, "Uploading..."];
    }
    results() {
        return new Promise((resolve, reject) => {
            fetch(this.url)
                .then(data => {
                    return data.json()
                })
                .then(res => {
                    resolve([this.header, `Uploading:${res.status}`]);
                })
                .catch(error => {
                    resolve([this.header, `Uploading:error`]);
                });
        });
    }
}

export { UsbWifiUploadTask };