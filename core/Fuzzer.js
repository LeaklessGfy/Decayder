var axios = require('axios')

function Fuzzer(url, port, header, method) {
	this.url = url;
	this.port = port;
	this.header = header;
	this.method = method;
}

Fuzzer.prototype.getResponse = function getResponse() {
	let response;

	switch(method) {
		case 0: 
			response = "header('" + Fuzzer.header + ":' . $r);";
			break;
		case 1:
			response = "exit(echo($r));";
			break;
	}

	return response;
}

Fuzzer.prototype.send = function send(request, onSuccess, onFail) {
	let success = Fuzzer.handleResult;
	let fail = Fuzzer.handleError;

	if(typeof onSuccess == "function") {
		success = onSuccess;
	}

	if(typeof onError == "function") {
		fail = onFail;
	}

	request = request + Fuzzer.getResponse();

	axios({
	  	method: 'get',
	 	url: Fuzzer.url,
	  	headers: {Fuzzer.header : request}
	})
	.then(success)
	.catch(fail);
}

Fuzzer.prototype.handleResult = function handleResult(result) {
}

Fuzzer.prototype.handleError = function handleError(error) {
}

module.exports = Fuzzer;
