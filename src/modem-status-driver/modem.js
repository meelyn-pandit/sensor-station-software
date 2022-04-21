const EventEmitter = require('events');
const SerialPort = require('serialport');
import Readline from '@serialport/parser-readline';
import { v4 as uuidv4 } from 'uuid';

/**
 * Modem Serial Port Control
 */
class Modem extends EventEmitter {
  /**
   * 
   * @param {*} opts.uri - string
   */
  constructor(opts) {
    super();
    this.uri = opts.uri ? opts.uri : '/dev/station_modem'
    this.baud_rate = opts.baud_rate ? opts.baud_rate : 115200;
    this.line_terminator = opts.line_terminator ? opts.line_terminator : '\r\n';
    this.serial;
    this.command_stack = [];
    this.response_buffer = '';
    this.response_timeout = 5000;
    this.next_command_delay = 2500;
    this.response_codes = [
      'OK',
      'CONNECT',
      'RING',
      'NO CARRIER',
      'ERROR',
      'NO DIALTONE'
    ]
    this.lock = false;
  }

  /**
   * start the modem interface
   */
  start() {
    return new Promise((resolve, reject) => {
      this.buildModemInterface().then((serial_port) => {
        this.serial = serial_port;
        resolve();
      }).catch((err) => {
        reject(err);
      });
    })
  }

  /**
   * build the serial port interface
   * return a promise that resolves when the modem serial port is opened
   */
  buildModemInterface() {
    return new Promise((resolve, reject) => {
      this.log(`starting modem interface on port ${this.uri} @ ${this.baud_rate}`);
      let serial_port = new SerialPort(this.uri, {
        baudRate: this.baud_rate
      });
      serial_port.on('open', () => {
        resolve(serial_port);
      });
      serial_port.on('error', (err) => {
        reject(err);
      });
      serial_port.on('data', (data) => {
        // buffer the received data
        this.response_buffer += data.toString();
        // check if the response code exists in our buffered data
        this.response_codes.forEach((code) => {
          if (this.response_buffer.toUpperCase().indexOf(code) > -1) {
            this.handleModemResponse({
              data: this.response_buffer.replace(code, '').trim(), 
              code: code
            });
            this.response_buffer = '';
          }
        })
      });
      return serial_port;
    });
  }

  /**
   * 
   * @param  {...any} msgs messages to log - include date, descriptor
   */
  log(...msgs) {
    msgs.unshift('modem');
    msgs.unshift(new Date());
    console.log(...msgs);
  }

  /**
   * 
   * @param {*} command - string
   * return command id pushed to command stack for event retrieval
   */
  issueCommand(opts) {
    let id = uuidv4();
    this.command_stack.push({
      command_id: id,
      command: opts.command,
      timeout: setTimeout(this.commandTimeout.bind(this), this.response_timeout),
      issued_at: new Date()
    });
    this.processCommand();
    return id;
  }

  /**
   * process next command in the stack
   */
  processCommand() {
    if (this.command_stack.length > 0) {
      // check if writing is locked
      if (this.lock === false) {
        // not locked - issue a command and lock the write process
        let command = this.command_stack[0];
        command.processed_at = new Date();
        this.write(command.command);
        this.lock = true;
      } else {
        setTimeout(this.processCommand.bind(this), this.next_command_delay);
      }
    } else {
      // no commands in the stack - unlock command write access
      this.lock = false;
    }
  }

  /**
   * handle a command timeout
   */
  commandTimeout() {
    // if there are commands in the queue - pop the earliest command from the queue as a timeout
    if (this.command_stack.length > 0) {
      let last_command = this.command_stack.shift();
      this.log(`command ${last_command.command} timed out`);
      last_command.response_at = new Date();
      this.emit('timeout', last_command);
      this.lock = false;
      setTimeout(this.processCommand.bind(this), this.next_command_delay);
    }
  }

  /**
   * 
   * @param {*} data - string write raw data to the modem
   */
  write(data) {
    let line = data.toString().trim();
    this.serial.write(line+this.line_terminator);
  }

  /**
   * 
   * @param {*} data - string block of data from the modem
   */
  handleModemResponse(opts) {
    // if there is a command in queue - associate response with last command
    if (this.command_stack.length > 0) {
      let last_command = this.command_stack.shift();
      // assume response to the most recent command - clear timeout 
      clearTimeout(last_command.timeout);
      delete last_command.timeout;
      last_command.response = opts.data.trim();
      last_command.response_at = new Date();
      last_command.code = opts.code;
      this.emit('response', last_command);
      // process more commands, if in queue
      this.lock = false;
      setTimeout(this.processCommand.bind(this), 500);
    } else {
      // unsolicited data?
      this.emit('unsolicited', opts.data);
    }
  }
}

export { Modem };
