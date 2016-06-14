var axios = require('axios')

var Fuzzer = {
	url: null,
	port: null,
	header: null,

	init: function(url, port, header) {
		Fuzzer.url = url;
		Fuzzer.port = port;
		Fuzzer.header = header;
	},

	send: function(request) {
		axios({
		  method: 'get',
		  url: Fuzzer.url,
		  headers: {Fuzzer.header : request}
		}).then(Fuzzer.handleResult);
	},

	handleResult: function(result) {
		console.log(result);
	}
}

module.exports = Fuzzer;
