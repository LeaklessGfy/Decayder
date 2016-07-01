const gator = require('gator');

/*
 * DOM Event Listener
 */
 AppService.getPage('setup');

 gator(document).on('click', '#setup-submit', function(e) {
	e.preventDefault();
	form = new FormData(document.getElementById("setup-form"));
	AppService.initSetup(form);
 });

 gator(document).on('click', '#setup-generate-decoy', function(e) {
	e.preventDefault();
	EventListener.emit("event", "1");
	alert("Will generate php file");
 });

 gator(document).on('click', '.menu-item', function(e) {
 	e.preventDefault();
	AppService.getPage(this.dataset.item);
 });
