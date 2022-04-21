/**
 * command / response parser for a serial interface
 */
class CommandSetParser {
  /**
   * 
   * @param {*} opts - list or single object with command, name, parser keys
   */
  constructor(opts) {
    this.command_set = [];
    if (opts) {
      this.addCommandParser(opts);
    }
  }

  /**
   * 
   * @param {*} opts - values to add
   */
  addCommandParser(opts) {
    if (Array.isArray(opts)) {
      opts.forEach((command_parser) => {
        this.command_set.push({
          command: command_parser.command,
          name: command_parser.name,
          parse: command_parser.parser
        })
      })
    } else {
      this.commands.push({
        command: opts.command,
        name: opts.name,
        parse: opts.parser
      });
    }
  }

  /**
   * 
   * @param {*} opts - expected response emitter from modem object
   * @param {*} opts.command - command that was issued
   * @param {*} opts.response - raw modem response
   */
  parseCommandResponse(opts) {
    let command_parser = this.command_set.find((element) => {
      return element.command == opts.command;
    });
    let parsed_response;
    let response = {};
    if (command_parser) {
      parsed_response = command_parser.parse(opts.response);
    } else {
      throw(Error('command not found'));
    }
    response[command_parser.name] = parsed_response
    return response;
  }
}

export { CommandSetParser };