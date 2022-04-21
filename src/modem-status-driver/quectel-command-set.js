import { CommandSetParser } from './command-set-parser';

const linearInterp = (x, x0, x1, y0, y1) => { return y0 + (x - x0) * (y1-y0) / (x1-x0)};
const parseId = (data, splitter) =>{
    let lines = data.split(splitter);
    if(lines.length == 2){
        return lines[1];
    }
    return data;
}

const QuectelCommandSetParser = new CommandSetParser([{
    command: 'AT+CSQ',
    name: 'signal',
    parser: (response) => {
        // 'AT+CSQ\r\r\n+CSQ: 19,99'

        let ret = "?,?";
        const sliceBy = "+CSQ: ";
        let startIndex = response.indexOf(sliceBy);
        if (startIndex >= 0) {
            startIndex += sliceBy.length;
            let values = response.slice(startIndex).split(",");
            if (values.length == 2) {
                let rssiRaw = parseInt(values[0]);
                let bitErrorRate = parseInt(values[1]);
                
                let rssi = -113;
                if(rssiRaw == 1){
                    rssi = -111;
                }else if((rssiRaw >= 2) && (rssiRaw <= 30)){
                    rssi = linearInterp(rssiRaw, 2, 30, -109, -53);
                }else if(rssiRaw == 31){
                    rssi = -51;
                }else if(rssiRaw == 100){
                    rssi = -116;
                }else if(rssiRaw == 101){
                    rssi = -115;
                }else if((rssiRaw >= 102) && (rssiRaw <= 190)){
                    rssi = linearInterp(rssiRaw, 102, 190, -114, -26);
                }else if(rssiRaw == 191){
                    rssi = -25;
                }

                if(bitErrorRate == 99){
                    ret = `${rssi}, ?`;
                }else{
                    ret = `${rssi}, ${bitErrorRate}`;
                }
            }
        }

        return ret;
    }
}, {
    command: 'AT+CIMI',
    name: 'imsi',
    parser: (response) => {
        return parseId(response.trim(), "\r\n");
    }
}, {
    command: 'AT+GSN',
    name: 'imei',
    parser: (response) => {
        return parseId(response.trim(), "\r\n");
    }
}, {
    command: 'AT+CCID',
    name: 'sim',
    parser: (response) => {
        let temp = "";
        temp = parseId(response.trim(), "\r\n"); //  AT+CCID\r\r\n+CCID: 8901260852391584042F'
        temp = parseId(temp, " "); // +CCID: 8901260852391584042F'
        return temp.replace("F",""); // 8901260852391584042'
    }
},{
    command: 'ATI',
    name: 'info',
    parser: (response) => {
        //'ATI\r\r\nQuectel\r\nEC25\r\nRevision: EC25AFFAR07A08M4G'
        let lines = response.split("\r\n");
        if(lines.length >= 3){
            return `${lines[1]} ${lines[2]}`;
        }
        return response.trim();
    }
}, {
    command: 'AT+CREG?',
    name: 'creg',
    parser: (response) => {
        //  creg: 'AT+CREG?\r\r\n+CREG: 0,1',
        let lines = response.split("+CREG: ");
        if(lines.length == 2){
            // console.log(lines);
            // console.typeof(lines);
            let data = lines[1].split(",");
            if(data.length == 2){
                const stat = [
                    "Not Searching",
                    "Home",
                    "Searching",
                    "Denied",
                    "Unknown",
                    "Roaming"
                ];
                return stat[parseInt(lines[1])+1];
            }
        }

        return response.trim();
    }
}, {
    command: 'AT+COPS?',
    name: 'carrier',
    parser: (response) => {
        // 'AT+COPS?\r\r\n+COPS: 0,0,"Twilio",7',
        let lines = response.split("\r\n")
        let ret = "Searching...";
        lines.forEach(element => {
            if (element.includes("COPS:")) {
                let columns = element.split(",");
                if (columns.length == 4) {
                    const accessTechnology = {
                        0: "2G",
                        2: "3G",
                        4: "3G",
                        5: "3G",
                        6: "3G",
                        7: "LTE"
                    }
                    ret = `${columns[2] == "\"Twilio\"" ? "T-Mobile" : columns[2]},${accessTechnology[columns[3]]}`;
                }
            }
        });
        return ret;
    }
}, {
    command: 'AT',
    name: 'ok',
    parser: (response) => {
        return response.trim();
    }
}]);

export {QuectelCommandSetParser};