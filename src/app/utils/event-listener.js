logger.on('logging', function (transport, level, msg, meta) {
  //Handling log interface
  //console.log(meta);
});

EventListener.on('event', (arg) => {
  alert(arg);
});

EventListener.on('fuzzer', (buffer) => {
	console.log(buffer);
});

EventListener.on('listDir', (json) => {
	AppService.getPage("finder", function() {
		AppService.finder(json);
	});
});
