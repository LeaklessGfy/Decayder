var Workers = {
	menuAction: function(elem) {
		axios({
			method: 'get',
			url: "./views/" + elem + ".html"
		}).then(function(data) {
			let content = document.getElementById('content');
			content.innerHTML = data.data;
		}).catch(function() {
			alert("error");
		});
	},

	checkSetup: function(form) {
		let error = [];
		let data = {
			//host: form.get("host"),
			host: "http://localhost/decayder.php",
			method: form.get("method"),
			parameter: form.get("parameter"),
			crypt: form.get("crypt"),
			shell: form.get("shell")
		};

		if(typeof form.get("host") == undefined || !form.get("host")) {
			//error.push("host");
		}

		if(typeof form.get("parameter") == undefined || !form.get("parameter")) {
			data.parameter = "Dec";
		}

		if(error.length > 0) {
			alert("Fields are missing!");
			return;
		}

		return data;
	}
}

module.exports = Workers;
