const gator = require('gator');
const AppServiceInterface = require('./app-service');
const AppService = new AppServiceInterface();

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
	alert("Will generate php file");
 });

 gator(document).on('click', '.menu-item', function(e) {
 	e.preventDefault();
	AppService.getPage(this.dataset.item);
 });
