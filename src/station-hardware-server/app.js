var express = require('express');

var indexRouter = require('./routes/index');
var modemRouter = require('./routes/modem');
var sensorRouter = require('./routes/sensor');
var usbRouter = require('./routes/usb');
var gpsRouter = require('./routes/gps');
var ledRouter = require('./routes/led');
var internetRouter = require('./routes/internet');
var peripheralRouter = require('./routes/peripherals');
const radioRouter = require('./routes/radio-server');
const controlRouter = require('./routes/control');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/modem', modemRouter);
app.use('/sensor', sensorRouter);
app.use('/usb', usbRouter);
app.use('/gps', gpsRouter);
app.use('/led', ledRouter);
app.use('/peripherals', peripheralRouter);
app.use('/internet', internetRouter);
app.use('/radio', radioRouter);
app.use('/control', controlRouter);

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
