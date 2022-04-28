class Led {
  constructor(addr) {
    this.addr = addr
    console.log('construct led driver', addr)
  }

  init() {
    console.log('init led', this.addr)
  }

  on() {
//    console.log('led on', this.addr)
  }
  
  off() {
//    console.log('led off', this.addr)
  }

  toggle() {
//    console.log('toggle led', this.addr)
  }

  blink(period_ms) {
//    console.log('blink led at', period_ms, this.addr)
  }

}

export { Led }
