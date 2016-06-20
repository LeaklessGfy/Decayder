const gator = require('gator');

let CMDInterface = require('./core/CMD');
let FuzzerInterface = require('./core/Fuzzer');
let CMD = null;
let Fuzzer = null;

let Workers = require('./src/Workers');
Workers.menuAction("setup");

/*
 * APP Event Listener
 */
 logger.on('logging', function (transport, level, msg, meta) {
    // [msg] and [meta] have now been logged at [level] to [transport] 
    console.log(level);
    console.log(msg);
    console.log(transport);
  });

/*
 * DOM Event Listener
 */
 gator(document).on('click', '#setup-submit', function(e) {
	e.preventDefault();
    let form = document.getElementById("setup-form");
    form = new FormData(form);
    $s = Workers.checkSetup(form);

	if($s) {
		if(CMD != null || Fuzzer != null) {
			delete CMD;
			delete Fuzzer;
		}

		Fuzzer = new FuzzerInterface($s.host, $s.method, $s.parameter, $s.crypt);
		CMD = new CMDInterface($s.shell);

		let r = CMD.listDir("./");
		Fuzzer.send(r);
	}
 });

 gator(document).on('click', '#setup-generate-decoy', function(e) {
	e.preventDefault();
	alert("Will generate php file");
 });

 gator(document).on('click', '.menu-item', function(e) {
	Workers.menuAction(this.dataset.item);
 });
