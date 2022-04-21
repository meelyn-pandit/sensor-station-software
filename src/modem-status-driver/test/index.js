import { ModemInterface } from '../modem-interface';
import { QuectelCommandSetParser } from '../quectel-command-set';

const Modem = new ModemInterface({
    uri: '/dev/station_modem_status',
    baud_rate: 115200,
    command_set_parser: QuectelCommandSetParser,
    poll_frequency_seconds: 10
});

Modem.open();