const { exec } = require('child_process');
const fs = require('fs')

class MountUsb {
    constructor(dir){
        this.dir = dir;        
    }
    mount(drive){
        return new Promise((resolve, reject) =>{            
            if(fs.existsSync(this.dir) == false){
                fs.mkdirSync(this.dir);
            }

            // $ 'mount /dev/${drive} ${this.dir}'
            let child = exec(`mount /dev/${drive} ${this.dir}`, (error,stdout, stderr) =>{
                if(error){
                    reject(error);
                }
            })
            child.on('close', (code) => {
                resolve();
            }); 
        });
    }
    unmount(){
        return new Promise((resolve, reject) =>{
            if(fs.existsSync(this.dir) == false){
                resolve();
            }

            let child = exec(`umount ${this.dir}`, (error,stdout, stderr) =>{
                if(error){
                    reject(error);
                }
            })
            child.on('close', (code) => {
                resolve();
            });  
        });
    }
    clean(){
        return new Promise((resolve, reject) =>{
            if(fs.existsSync(this.dir) == false){
                resolve();
            }
            let child = exec(`rm -rf ${this.dir}`, (error,stdout, stderr) =>{
                if(error){
                    console.log(error);                    
                    reject(error);
                }
            })
            child.on('close', (code) => {
                resolve();
            });            
        })
    }
}

export default MountUsb;
    