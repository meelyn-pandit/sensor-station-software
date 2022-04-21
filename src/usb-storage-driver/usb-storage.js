import BlockDeviceCmd from './block-device-cmd';
import MountUsb from './mount-usb';
var ncp = require('ncp').ncp;
const path = require('path');

class UsbStorage {
    constructor(mount_point="/mnt/usb"){
        this.mount_point = mount_point;
        this.drive = new MountUsb(mount_point);
    }
    mount(){
        return new Promise((resolve, reject) =>{

            this.unmount()
            .then(()=>{
                return new BlockDeviceCmd().poll();
            }).then((devices)=>{
                if(devices.length > 0){
                    return this.drive.mount(devices[0].name);
                }else{
                    reject("No Usb Devices Detected");
                }
            }).then(()=>{
                resolve();
            }).catch((err) =>{    
                reject(err);
            })
        });
    }
    unmount(){
        return new Promise((resolve, reject) =>{

            this.drive.unmount()
            .then(() => {
                return this.drive.clean();
            }).then(() =>{
                resolve();
            }).catch((err) =>{
                resolve(err);
            })
        });
    }
    copyTo(src, pattern, callback){
        ncp.limit = 16;
        ncp(src, this.mount_point, { filter: pattern}, callback);
    }
    copyFrom(src, dest, callback){
        ncp.limit = 16; 
        ncp(path.join(this.mount_point, src), dest, callback);
    }
}

export default UsbStorage;
