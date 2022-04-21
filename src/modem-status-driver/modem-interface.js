import { Modem } from './modem';

/**
 * modem interface around modem serial class
 * poll modem information at a regular interval
 */
class ModemInterface {
  /**
   * 
   * @param {*} opts 
   */
  constructor(opts) {
    this.modem = new Modem(opts);
    this.command_set_parser = opts.command_set_parser;
    this.buildModemInterface();
    this.poll_frequency_seconds = opts.poll_frequency_seconds ? opts.poll_frequency_seconds*1000 : 5000;
    this.timer;
    this.info = {};
  }

  /**
   * 
   * @param  {...any} msgs class logger
   */
  log(...msgs) {
    msgs.unshift('modem-interface');
    msgs.unshift(new Date());
    console.log(...msgs);
  }

  /**
   * handle raw responses from the modem
   */
  buildModemInterface() {
    this.modem.on('response', (modem_response) => {
      // we got a response from the modem - use the command set parser to parse it
      let parsed_response = this.command_set_parser.parseCommandResponse(modem_response);
      // merge the parsed response with our modem response information
      this.info = Object.assign(this.info, parsed_response);
    });
    this.modem.on('unsolicited', (unsolicited) => {
      this.log(unsolicited);
    });
    this.modem.on('error', (err) => {
      this.log('error', error);
    });
  }

  /**
   * issue list of command from modem command set
   */
  issueCommands() {
    this.command_set_parser.command_set.forEach((command_response) => {
      this.modem.issueCommand({
        command: command_response.command,
      });
    })
  }

  /**
   * start polling the modem on a regular interval
   */
  startPolling() {
    if (this.timer) {
      clearTimeout(this.timer);
    } 
    this.issueCommands();
    this.timer = setInterval(this.issueCommands.bind(this), this.poll_frequency_seconds);
  }

  /**
   * stop polling the modem
   */
  stopPolling() {
    clearTimeout(this.timer);
  }

  /**
   * open interface to the modem and start polling
   */
  open() {
    this.modem.start().then(() => {
      this.startPolling();
    });
  }
}

export { ModemInterface };