const d = new Date();
const id = d.getFullYear() + "-" + (d.getMonth()+1) + "-" + d.getDate() + "T" + d.getHours() + "-" + d.getMinutes();

const winston = require('winston');
const logger = new (winston.Logger)({
  transports: [
    //new (winston.transports.File)({ json: false, prettyPrint: true, filename: './app/logs/log_' + id + '.log' }),
    new (winston.transports.Console)()
  ]
});

const EventEmitterInterface = require('events');
const EventListener = new EventEmitterInterface();

const AppServiceInterface = require('./app/core/AppService');
const AppService = new AppServiceInterface();
