Workers.menuAction("setup");

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

		$s.proxy = "http://127.0.0.1:8080";

		Fuzzer = new FuzzerInterface($s);
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
