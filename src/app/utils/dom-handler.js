class DomHandler {
	construct() {}

	getName(arr, type) {
		let before = "";
		let name = arr[arr.length - 1];
		let hName = document.createElement('td');

		if(type == 0) {
			before = '<i class="fa fa-caret-right"></i> ' + '<i class="fa fa-folder"></i> ';
		}

		hName.innerHTML = before + name;

		return hName;
	}

	getExtension(arr, type) {
		let extension;
		let hExtension = document.createElement('td');

		if(type == 0) {
			hExtension.innerHTML = "Folder";
			return hExtension;
		}

		return hExtension;
	}

	getRights(arr) {
		let rights = arr[0];
		let hRights = document.createElement('td');
		hRights.innerHTML = rights;

		return hRights;
	}

	getOwner(arr) {
		let owner = arr[5] || arr[6];
		let hOwner = document.createElement('td');
		hOwner.innerHTML = owner;

		return hOwner;
	}

	createLigne(obj, type) {
		let ligne = document.createElement('tr');
		let arr = obj.split("+");

		let name = this.getName(arr, type);
		let extension = this.getExtension(arr, type);
		let owner = this.getOwner(arr);
		let rights = this.getRights(arr);
			
		ligne.appendChild(name);
		ligne.appendChild(extension);
		ligne.appendChild(owner); 
		ligne.appendChild(rights);

		return ligne;
	}
}

module.exports = DomHandler;
