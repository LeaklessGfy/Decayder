const axios = require('axios');
const CMDInterface = require('./../core/CMD');
const FuzzerInterface = require('./../core/Fuzzer');

class AppService {
	constructor() {
		this._Fuzzer = null;
		this._CMD = null;
		this.views_dir = `${__dirname}` + "/../res/views/";
		this.views_extension = ".html";
	}

	getPage(page) {
		axios({
			method: 'get',
			url: this.views_dir + page + this.views_extension
		}).then(function(data) {
			let content = document.getElementById('content');
			content.innerHTML = data.data;
		}).catch(function() {
			alert("error");
			throw new Error("Page not found!");
		});
	}

	initSetup(form) {
		let $s = this.getConfig(form);

		if($s) {
			if(this._CMD != null || this._Fuzzer != null) {
				delete this._CMD;
				delete this._Fuzzer;
			}

			this._Fuzzer = new FuzzerInterface($s);
			this._CMD = new CMDInterface($s.shell);

			let r = this._CMD.listDir("./");
			this._Fuzzer.send(r);
		}
	}

	getConfig(form) {
		let error = [];
		let data = {
			host: form.get("host") || "http://localhost/decayder.php",
			method: form.get("method"),
			parameter: form.get("parameter"),
			crypt: form.get("crypt"),
			shell: form.get("shell"),
			proxy: form.get("proxy") || "http://127.0.0.1:8080"
		};

		if(typeof data.host == undefined || !data.host) {
			error.push("host");
		}

		if(typeof data.parameter == undefined || !data.parameter) {
			data.parameter = "Dec";
		}

		if(error.length > 0) {
			alert("Fields are missing!");

			throw new Error("Fields are missing!");
		}

		return data;
	}

}

module.exports = AppService;
