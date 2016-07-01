
class CMD {
	constructor(method, context) {
		this._method = parseInt(method);
		this._context = null;

		if(typeof context != undefined) {
			this._context = context;
		}
	}

	getSystemCmd(cmd, r) {
		return "ob_start();system('" + cmd + "');$" + r + "=ob_get_contents();ob_end_clean();";
	}

	getShellExecCmd(cmd, r) {
		return "$" + r + "=shell_exec('" + cmd + "');";
	}

	createCmd(cmd, r) {
		let contexter = "", shellCmd;

		if(this._context != null) {
			contexter = "cd " + this._context + " && ";
		}

		shellCmd = contexter + cmd;

		switch(this._method) {
			case 0:
				shellCmd = this.getSystemCmd(shellCmd, r);
				break;
			case 1:
				shellCmd = this.getShellExecCmd(shellCmd, r);
				break;
		}

		return shellCmd;
	}

	listDir(dir) {
		let context, lsFolder, lsFile, ls;

		if(typeof dir != "undefined" && dir != null) {
			context = "cd " + dir + " && ";
		}

		lsFolder = context + "ls -d */";
		lsFile = context + "find . -maxdepth 1 -type f";

		lsFolder = this.createCmd(lsFolder, "fo");
		lsFile = this.createCmd(lsFile, "fi");

		ls = lsFolder + lsFile + "$r=json_encode(array('folder' => urlencode($fo), 'files' => urlencode($fi)));";

		return this.send(ls);
	}

	getFileContent(fileName) {
		let cat;

		if(typeof fileName == "undefined" || fileName == null) {
			return;
		}

		cat = "cat " + fileName;
		cat = CMD.createCmd(cat, "r");

		return cat;
	}

	send(cmd) {
		logger.log("info", "FINISH - Building new request: \n %s \n", cmd);
		return cmd;
	}
}

module.exports = CMD;
