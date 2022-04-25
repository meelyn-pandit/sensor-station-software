// Import Statements
import MenuItem from "./menu-item";
import MenuManager from "./menu-manager"

// Tasks
import {IpAddressTask} from "./tasks/ip-address-task";
import {CellularIds, CellularCarrier} from "./tasks/cellular-task";
import {GpsTask} from "./tasks/gps-task";
import {SensorTemperatureTask} from "./tasks/sensor-temp-task";
import {SensorVoltageTask} from "./tasks/sensor-voltage-task";
import {ServerConnectRequest} from "./tasks/server-task";
import {SystemImageTask, SystemIdsTask, SystemMemoryTask, SystemUptimeTask} from "./tasks/system-about-task";
import {SystemRestartTask} from "./tasks/system-restart-task";
import {SystemTimeTask} from "./tasks/system-time-task";
import {UsbDownloadTask} from "./tasks/usb-download-task";
import {MountUsbTask} from "./tasks/usb-mount-task";
import {UnmountUsbTask} from "./tasks/usb-unmount-task";
import {UsbWifiUploadTask} from "./tasks/usb-wifi-upload-task";
import {LedTask} from "./tasks/led-task";
import {HostnameTask} from "./tasks/hostname-task";
import {InternetTask} from "./tasks/internet-task";
import {QaqcRequest} from './tasks/qaqc-task';

// Require Statements
var Gpio = require('onoff').Gpio; // RaspberryPI Gpio functions

// App Config

const host = 'http://localhost:3000';
const UP_BUTTON = 4;
const DOWN_BUTTON = 5;
const SELECT_BUTTON = 6;
const BACK_BUTTON = 7;

/*
    Build the menu: Each item MUST be given:
        A) 'name' for selecting/traversings menu-items on the screen
        B) A task to be rendered when the menu item is 'selected'
            Note: If item is a submenu, set view to null as the next menu will
                be rendered in-leui of a task.
        C) List of children, which must be of type MenuItem
            Note: If item has no children, set to []

    Note: All menu items must have unique names!
*/ 

let items = new MenuItem("main", null, [
    new MenuItem("File Transfer", null,[
        new MenuItem("Mount Usb", new MountUsbTask(host), []),
        new MenuItem("Unmount Usb", new UnmountUsbTask(host), []),
        new MenuItem("Download", new UsbDownloadTask(host), []),
        new MenuItem("Get WiFi", new UsbWifiUploadTask(host), [])
    ]),
    new MenuItem("System", null, [
        new MenuItem("About", null, [
            new MenuItem("Image", new SystemImageTask(host), []),
            new MenuItem("Ids", new SystemIdsTask(host), []),
            new MenuItem("Memory", new SystemMemoryTask(host), []),
            new MenuItem("Uptime", new SystemUptimeTask(host), [])
        ]),
        new MenuItem("QAQC", new QaqcRequest(host), []),
        new MenuItem("Time", new SystemTimeTask(host), []),
        new MenuItem("Restart", new SystemRestartTask(), [])
    ]),
    new MenuItem("Network", null, [
        new MenuItem("Cellular", null, [
            new MenuItem("Ids", new CellularIds(host), []),
            new MenuItem("Carrier", new CellularCarrier(host), [])
        ]),
        new MenuItem("Ping", new InternetTask(host), []),
        new MenuItem("Hostname", new HostnameTask(), []),
        new MenuItem("Ip Address", new IpAddressTask(), [])
    ]),
    new MenuItem("Server", new ServerConnectRequest(host), []),
    new MenuItem("Power", new SensorVoltageTask(host), []),
    new MenuItem("Temperature", new SensorTemperatureTask(host), []),
    new MenuItem("Location", new GpsTask(host), []),
    new MenuItem("Led", null, [
        new MenuItem("Diagnostic A", null, [
            new MenuItem("On", new LedTask(host, {header: "Diagnostic A", endpoint:'led/diag/a', state:'on'}), []),
            new MenuItem("Off", new LedTask(host, {header: "Diagnostic A", endpoint:'led/diag/a', state:'off'}), []),
            new MenuItem("Toggle", new LedTask(host, {header: "Diagnostic A", endpoint:'led/diag/a', state:'toggle'}), []),
            new MenuItem("Blink", new LedTask(host, {header: "Diagnostic A", endpoint:'led/diag/a', state:'blink'}), [])
        ]),
        new MenuItem("Diagnostic B", null, [
            new MenuItem("On", new LedTask(host, {header: "Diagnostic B", endpoint:'led/diag/b', state:'on'}), []),
            new MenuItem("Off", new LedTask(host, {header: "Diagnostic B", endpoint:'led/diag/b', state:'off'}), []),
            new MenuItem("Toggle", new LedTask(host, {header: "Diagnostic B", endpoint:'led/diag/b', state:'toggle'}), []),
            new MenuItem("Blink", new LedTask(host, {header: "Diagnostic B", endpoint:'led/diag/b', state:'blink'}), [])
        ]),
        new MenuItem("Gps", null, [
            new MenuItem("On", new LedTask(host, {header: 'Gps', endpoint:'led/gps', state:'on'}), []),
            new MenuItem("Off", new LedTask(host, {header: 'Gps', endpoint:'led/gps', state:'off'}), []),
            new MenuItem("Toggle", new LedTask(host, {header: 'Gps', endpoint:'led/gps', state:'toggle'}), []),
            new MenuItem("Blink", new LedTask(host, {header: 'Gps', endpoint:'led/gps', state:'blink'}), [])
        ])
    ])
]);  


/*
    Instantiate a menu manager that operates on a list of 
    menu items organized within a hierarchical structure.
    The manager is capable of traversing the menu items using
    the following commands:
        A) up()     - Traverse 'up' a list of items in a dir
        B) down()   - Traverse 'down' a list of items in a dir
        C) select() - Enters a dir within a menu.
        D) back()   - Exits a dir within a menu.
*/

let menu = new MenuManager(items);
menu.init();

/*
    Configure Pi buttons and mount callbacks for when they are pushed.
    The push callbacks will trigger menu operations corresponding to 
    the specific buttons pressed. 
    
    Note: Debounce is common feature to prevent buttons from being 
    pressed multiple times in rapid sucession.
*/

const button_up = new Gpio(UP_BUTTON, 'in', 'rising', {debounceTimeout: 50});
button_up.watch((err, value) => {
    if (err) {
      throw err;
    }
    menu.up();
});

const button_down = new Gpio(DOWN_BUTTON, 'in', 'rising', {debounceTimeout: 50});
button_down.watch((err, value) => {
    if (err) {
      throw err;
    }
    menu.down();
});

const button_select = new Gpio(SELECT_BUTTON, 'in', 'rising', {debounceTimeout: 50});
button_select.watch((err, value) => {
    if (err) {
      throw err;
    }
    menu.select();
});

const button_back = new Gpio(BACK_BUTTON, 'in', 'rising', {debounceTimeout: 50});
button_back.watch((err, value) => {
    if (err) {
      throw err;
    }
    menu.back();
});