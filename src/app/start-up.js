require('./utils/dom-listener');

//const EventEmitterInterface = require('events');
/*const EventListener = new EventEmitterInterface();
EventListener.on('event', () => {
  console.log('an event occurred!');
});*/
//EventListener.emit('event');

logger.on('logging', function (transport, level, msg, meta) {
  //Handling log interface
  console.log(meta);
});
