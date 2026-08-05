/*
	Author: Levi Smith
	Version: Alpha
	Date: 07/28/2025
*/

export class TowerTile {

	constructor(id) {
		this._id = id;
		this._element = document.createElement("div");;
		this._transition = "instant";
		this._color = "none";
		this._status = "disabled";
		this._effect = "solid";


		//Element Properites
		this._element.className = "tower";
		this._element.id = "tower" + id;

		//title
		let title = document.createElement("h3");
		title.className = "titleid";
		title.innerHTML = " " + id;
		title.style.backgroundColor = "#2e2e2e";
		this._element.append(title);

		//connection label
		let connectionLabel = document.createElement("p");
		connectionLabel.className = "connectionlabel";
		connectionLabel.innerHTML = "Status: " + this._status;
		this._element.append(connectionLabel);

		//color selection
		let colorLabel = document.createElement("colorlabel");
		colorLabel.className = "colorlabel";
		colorLabel.setAttribute("for", "colorselect" + id);
		colorLabel.innerHTML = "Color:";

		let colorSelect = document.createElement("select");
		colorSelect.className = "colorselect";
		colorSelect.id = "colorselect" + id;

		let selRed = document.createElement("option");
		selRed.value = "red";
		selRed.innerHTML = "Red";
		let selGreen = document.createElement("option");
		selGreen.value = "green";
		selGreen.innerHTML = "Green";
		let selBlue = document.createElement("option");
		selBlue.value = "blue";
		selBlue.innerHTML = "Blue";
		let selLamp = document.createElement("option");
		selLamp.value = "orange";
		selLamp.innerHTML = "Lamp";
		let selNone = document.createElement("option");
		selNone.value = "none";
		selNone.innerHTML = "None";

		colorSelect.append(selRed, selGreen, selBlue, selLamp, selNone);

		this._element.append(colorLabel);
		this._element.append(colorSelect);

		//transition selection
		let transitionLabel = document.createElement("transitionlabel");
		transitionLabel.className = "transitionlabel";
		transitionLabel.setAttribute("for", "transitionselect" + id);
		transitionLabel.innerHTML = "Transition:";

		let transitionSelect = document.createElement("select");
		transitionSelect.className = "transitionselect";
		transitionSelect.id = "transitionselect" + id;

		let selFade = document.createElement("option");
		selFade.value = "fade";
		selFade.innerHTML = "Fade";
		let selInst = document.createElement("option");
		selInst.value = "instant";
		selInst.innerHTML = "Inst";

		transitionSelect.append(selFade, selInst);

		this._element.append(transitionLabel);
		this._element.append(transitionSelect)

		//effect selection
		let effectLabel = document.createElement("effectlabel");
		effectLabel.className = "effectlabel";
		effectLabel.setAttribute("for", "effectselect" + id);
		effectLabel.innerHTML = "effect:";

		let effectSelect = document.createElement("select");
		effectSelect.className = "effectselect";
		effectSelect.id = "effectselect" + id;

		let selSolid = document.createElement("option");
		selSolid.value = "solid";
		selSolid.innerHTML = "Solid";
		let selBlick = document.createElement("option");
		selBlick.value = "blink";
		selBlick.innerHTML = "Blink";
		let selPulse = document.createElement("option");
		selPulse.value = "pulse";
		selPulse.innerHTML = "Pulse";

		effectSelect.append(selSolid, selBlick, selPulse);

		this._element.append(effectLabel);
		this._element.append(effectSelect);;

		//update button
		let updateButton = document.createElement("button");
		updateButton.className = "updatebutton";
		updateButton.id = "updatebutton" + id;
		updateButton.append("update");
		updateButton.addEventListener("click", () => {
			this.update();
		});

		this._element.append(updateButton);

		this.configure(this._status, this._color, this._transition);

	}

	//Takes the given arguments and updates the local tower info and applies the changes to the screen
	configure(status, color, transition, effect) {

		this._status = status;
		this._color = color;
		this._transition = transition;
		this._effect = effect;

		this.setColor(color);
		this.setTransition(transition);
		this.setStatus(status);
		this.setEffect(effect);

	}

	//takes the settings on the screen and updates local information them applies them to the screen
	update() {

		console.log("updating tower " + this._id);

		let colorSelect = this._element.querySelector(".colorselect");
		let transitionSelect = this._element.querySelector(".transitionselect");
		let effectSelect = this._element.querySelector(".effectselect");

		this.setColor(colorSelect.value);
		this.setTransition(transitionSelect.value);
		this.setEffect(effectSelect.value);

	}

	//Getters and Setters
	get id() {
		return this._id;
	}

	get element() {
		return this._element;
	}

	get status() {
		return this._connection;
	}

	get color() {
		return this._color;
	}

	get transition() {
		return this._transition;
	}

	get effect() {
		return this._effect;
	}

	setStatus(status) {
		this._status = status;

		let titleID = this._element.querySelector(".titleid");
		let connectionLabel = this._element.querySelector(".connectionlabel");
		connectionLabel.innerHTML = "Status: " + this._status;

		if (this._status == "enabled") {
			titleID.style.color = "green";
		} else {
			titleID.style.color = "red";
		}
	}

	setColor(color) {
		this._color = color;
		this._element.style.backgroundColor = color;

		let colorSelect = this._element.querySelector(".colorselect");
		colorSelect.value = color;
	}

	setTransition(transition) {
		this._transition = transition;
		let transitionSelect = this._element.querySelector(".transitionselect");
		transitionSelect.value = transition;
	}

	setEffect(effect) {
		this._effect = effect;
		let effectSelect = this._element.querySelector(".effectselect");
		effectSelect.value = effect;
	}

}