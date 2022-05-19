import Adc from '../max11645.js'


const run = async () => {
  let adc = new Adc()
  let result = await adc.getVoltages()
  console.log(result)
  process.exit(0)
}

run()


