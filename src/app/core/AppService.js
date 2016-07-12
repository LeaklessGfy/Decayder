const axios = require('axios');
const CMDInterface = require('./CMD');
const FuzzerInterface = require('./Fuzzer');
const DomHandlerInterface = require('./../utils/dom-handler');

/**
 * @author LeakLessGfy
 */
class AppService {
	constructor() {
		this.Fuzzer = null;
		this.CMD = null;
	}

	getPage(page, callback) {
		let viewsDirectory = `${__dirname}` + '/../res/views/';
		let viewsExtension = '.html';

		axios({
			method: 'get',
			url: viewsDirectory + page + viewsExtension
		}).then(function(data) {
			let content = document.getElementById('content');
			content.innerHTML = data.data;

			let navs = document.getElementById('bs-example-navbar-collapse-1').getElementsByTagName('li');
			for(let a of navs) {
				a.className = "";
			}

			let active = document.querySelectorAll('[data-item="' + page + '"]')[0];
			active.parentNode.className = "active";

			if(typeof callback == "function") {
				callback();
			}
		}).catch(function(e) {
			alert("error");
			throw new Error(e);
		});
	}

	initSetup() {
		let form = new FormData(document.getElementById("setup-form"));
		let $s = this.getConfig(form);

		if($s) {
			if(this.CMD != null || this.Fuzzer != null) {
				delete this.CMD;
				delete this.Fuzzer;
			}

			this.Fuzzer = new FuzzerInterface($s);
			this.CMD = new CMDInterface($s.shell);

			let r = this.CMD.listDir("./");
			return this.Fuzzer.send(r)
							.then(this.getPage("finder"))
							.then(this.finder);
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
		//Bit tricky here
		data = JSON.parse(decodeURIComponent(data));
		console.log(data);

		let rawFolders = data[0];
		let rawFiles = data[1];

		//Get proper buffer array
		let folders = rawFolders.split('%2F%0A');
		let files = rawFiles.split('%0A');

		//Delete uncessary buffers
		folders.splice(-1,1);
		files.splice(-1,1);
		files.splice(0, 1);

		let doc = document.getElementById('site-map').getElementsByTagName('tbody')[0];
		let domHandler = new DomHandlerInterface();

		for(let folder of folders) {
			let ligne = domHandler.createLigne(folder, 0);
			doc.appendChild(ligne);
		}

		console.log(files);
		for(let file of files) {
			let ligne = domHandler.createLigne(file, 1);
			doc.appendChild(ligne);
		}
	}
}

module.exports = AppService;
