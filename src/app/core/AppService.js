const axios = require('axios');
const CMDInterface = require('./CMD');
const FuzzerInterface = require('./Fuzzer');
const DomHandlerInterface = require('./../utils/dom-handler');

class AppService {
	constructor() {
		this._Fuzzer = null;
		this._CMD = null;
		this.views_dir = `${__dirname}` + "/../res/views/";
		this.views_extension = ".html";
		this._DomHandler = new DomHandlerInterface();
	}

	getPage(page, callback) {
		axios({
			method: 'get',
			url: this.views_dir + page + this.views_extension
		}).then(function(data) {
			let content = document.getElementById('content');
			content.innerHTML = data.data;

			if(typeof callback == "function") {
				callback();
			}
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
			return this._Fuzzer.send(r, {success:"listDir"});
		}
	}

	getConfig(form) {
		let error = [];
		let data = {
			host: form.get("host") || "http://localhost/hack.php",
			method: form.get("method"),
			parameter: form.get("parameter"),
			crypt: form.get("crypt"),
			shell: form.get("shell"),
			proxy: form.get("proxy") //|| "http://127.0.0.1:8080"
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

	finder(data) {
		let rawFolders = data[0];
		let rawFiles = decodeURIComponent(data[1]);

		let folders = rawFolders.split('%2F%0A');
		let files = rawFiles.split('%2F%0A');
		folders.splice(-1,1);

		let doc = document.getElementById('site-map').getElementsByTagName('tbody')[0];

		for(let folder of folders) {
			let ligne = this._DomHandler.createLigne(folder, 0);
			doc.appendChild(ligne);
		}

		for(let file of files) {

		}
	}
}

module.exports = AppService;
