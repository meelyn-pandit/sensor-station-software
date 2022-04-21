import Adc from "../adc"
import Tmp102 from "../tmp102"

let options = { type: "Ads7924" };
let x = new Adc(options);
x.init();
console.log(x.read(0) * (5.016 / 4096) * 6);
console.log(x.read(1) * (5.016 / 4096) * 6);
console.log(x.read(2) * (5.016 / 4096));

let y = new Tmp102();

y.init();

setInterval(function () { console.log(y.read()) }, 1000);

