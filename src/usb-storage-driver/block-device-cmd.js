const { exec } = require('child_process');

/*
$ lsblk -f -l -o NAME,FSTYPE,UUID

NAME         FSTYPE UUID
sda                 
sda1         vfat   746E-6D79
sdb                 
sdb1         vfat   C85E-F866
sdc                 
sdc1         vfat   87AA-2CED
sdd                 
sdd1         vfat   3433-3231
mmcblk0             
mmcblk0p1    vfat   5203-DB74
mmcblk0p2    ext4   2ab3f8e1-7dc6-43f5-b0db-dd5759d51d4e
mmcblk0boot0        
mmcblk0boot1
*/

class BlockDeviceCmd {
    constructor(){
    }
    poll(){

        return new Promise((resolve, reject) => {

            let child = exec('lsblk -f -l -o NAME,FSTYPE,UUID', (error,stdout, stderr) =>{
                if(error){
                    reject(error);
                }
            })    
                       
            child.stdout.on('data', (data) => {                       
                let results = [];
                data.split("\n").forEach(element => {
                    if (element.includes("sd")) {
                        let device = element.trim().split(/[ ]+/);
                        if(device.length == 3){
                            results.push({
                                name:device[0],
                                fs_type:device[1],
                                uuid:device[2]
                            });
                        }
                    }
                })

                resolve(results);
            });
            
            child.stderr.on('data', (data) => {
                reject(data.toString());
            });
        });
    }
}

export default BlockDeviceCmd;