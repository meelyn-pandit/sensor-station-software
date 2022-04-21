import {Led} from '../index';
// 38.39.40
let x = new Led(38);
let y = new Led(39);
let z = new Led(40);

x.on();
y.on();
z.on();

x.on();
x.off();
x.on();
x.off();

x.blink(250);

setTimeout(()=>{
    // x.off();
    setInterval(()=>{
        x.toggle();
    }, 2000);
}, 5000)



