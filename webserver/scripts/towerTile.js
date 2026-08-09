/*
	Author: Levi Smith
	Version: Alpha
	Date: 07/28/2025
*/

export class TowerTile {

	constructor(id) {
		this._id = id;
		this._element = document.createElement("div");
		this._status = "disabled";
		this._signal = -999;
		this._color = "none";
		this._transition = "instant";
		this._effect = "solid";

		//false if tower has not yet been configured, true otherwise
		this._configured = false;


		//Element Properites
		this._element.className = "tower";
		this._element.id = "tower" + id;

		//Title
		let title = document.createElement("h3");
		title.className = "tileid";
		title.innerHTML = " " + id;
		this._element.append(title);

		//Tower Image
		let imgDiv = document.createElement("div");
		imgDiv.className = "imgdiv";
		this._element.append(imgDiv);

		//image
		let towerImage = document.createElement("img");
		towerImage.src = "../images/lamp.png";
		imgDiv.append(towerImage);

		//tower data
		let towerData = document.createElement("p");
		towerData.className = "towerdata";
		towerData.innerHTML = this._color + "<br>" + this._transition + "<br>" + this._effect;
		imgDiv.append(towerData);

		//Connection
		let connectionDiv = document.createElement("div");
		this._element.append(connectionDiv);

		//connection label and display
		let connectionLabel = document.createElement("p");
		connectionLabel.className = "connectionlabel";
		connectionLabel.innerHTML = "Status: ";

		let connectionDisplay = document.createElement("span");
		connectionDisplay.className = "connectiondisplay";
		connectionDisplay.innerHTML = this._status;

		connectionLabel.appendChild(connectionDisplay);
		connectionDiv.append(connectionLabel);

		//Signal
		let signalDiv = document.createElement("div");
		this._element.append(signalDiv);

		//signal label and display
		let signalLabel = document.createElement("p");
		signalLabel.className = "signallabel";
		signalLabel.innerHTML = "Signal: ";

		let signalDisplay = document.createElement("span");
		signalDisplay.className = "signaldisplay";
		signalDisplay.innerHTML = this._signal;

		signalLabel.appendChild(signalDisplay);
		signalDiv.append(signalLabel);

		//SELECTIONS
		let selectionDiv = document.createElement("div");
		selectionDiv.className = "selectiondiv";
		this._element.append(selectionDiv);

		//Color
		let colorDiv = document.createElement("div");
		selectionDiv.append(colorDiv);

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
		let selPurple = document.createElement("option");
		selPurple.value = "purple";
		selPurple.innerHTML = "Purple";
		let selNone = document.createElement("option");
		selNone.value = "none";
		selNone.innerHTML = "None";

		colorSelect.append(selRed, selGreen, selBlue, selLamp, selPurple, selNone);

		colorDiv.append(colorLabel);
		colorDiv.append(colorSelect);

		//Transition
		let transitionDiv = document.createElement("div");
		selectionDiv.append(transitionDiv);

		//transition selection
		let transitionLabel = document.createElement("transitionlabel");
		transitionLabel.className = "transitionlabel";
		transitionLabel.setAttribute("for", "transitionselect" + id);
		transitionLabel.innerHTML = "Trans:".strike();

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

		transitionDiv.append(transitionLabel);
		transitionDiv.append(transitionSelect);

		//Effect
		let effectDiv = document.createElement("div");
		selectionDiv.append(effectDiv);

		//effect selection
		let effectLabel = document.createElement("effectlabel");
		effectLabel.className = "effectlabel";
		effectLabel.setAttribute("for", "effectselect" + id);
		effectLabel.innerHTML = "Effect:";

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

		effectDiv.append(effectLabel);
		effectDiv.append(effectSelect);

		//update button
		let updateButton = document.createElement("button");
		updateButton.className = "updatebutton";
		updateButton.id = "updatebutton" + id;
		updateButton.append("update");
		updateButton.addEventListener("click", () => {
			this.update();
		});

		this._element.append(updateButton);

		this.configure(this._status, this._signal, this._color, this._transition, this._effect);

	}

	//Takes the given arguments and updates the local tower info and applies the changes to the screen
	configure(status, signal, color, transition, effect) {

		this._status = status;
		this._color = color;
		this._transition = transition;
		this._effect = effect;

		this.setStatus(status);
		this.setSignal(signal);
		this.setColor(color);
		this.setTransition(transition);
		this.setEffect(effect);

		this._configured = true;

	}

	//Takes the given arguments and updates the local tower info and applies the changes to the screen (except the labels)
	configureNS(status, signal, color, transition, effect) {

		this._status = status;
		this._color = color;
		this._transition = transition;
		this._effect = effect;

		this.setStatus(status);
		this.setSignal(signal);
		this.setColorNS(color);
		this.setTransitionNS(transition);
		this.setEffectNS(effect);

		this._configured = true;

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

	updateTowerData() {
		let towerData = this._element.querySelector(".towerdata");
		towerData.innerHTML = this._color + "<br>" + this._transition + "<br>" + this._effect;
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

	get signal() {
		return this._signal;
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

		let titleID = this._element.querySelector(".tileid");
		let connectionLabel = this._element.querySelector(".connectionlabel");
		connectionLabel.innerHTML = "Status: " + this._status;

		if (this._status == "enabled") {
			titleID.style.color = "green";
		} else {
			titleID.style.color = "red";
		}
	}

	setSignal(signal) {
		this._signal = signal;

		let signaldisplay = this._element.querySelector(".signaldisplay");
		signaldisplay.innerHTML = signal;
		if (signal >= -30) {
			signaldisplay.style.color = "lime";
		}else if (signal >= -67) {
			signaldisplay.style.color = "green";
		}else if (signal >= -70) {
			signaldisplay.style.color = "yellow";
		}else if (signal >= -80) {
			signaldisplay.style.color = "red";
		}else {
			signaldisplay.style.color = "maroon";
		}

	}

	//Sets tower and selector

	setColor(color) {
		this._color = color;
		this._element.querySelector("img").style.backgroundColor = color;
		if (color == "none") {
			this._element.querySelector("img").style.backgroundColor = "";
		}

		let colorSelect = this._element.querySelector(".colorselect");
		colorSelect.value = color;
		this.updateTowerData();
	}

	setTransition(transition) {
		this._transition = transition;
		let transitionSelect = this._element.querySelector(".transitionselect");
		transitionSelect.value = transition;
		this.updateTowerData();
	}

	setEffect(effect) {
		this._effect = effect;
		let effectSelect = this._element.querySelector(".effectselect");
		effectSelect.value = effect;
		this.updateTowerData();
	}

	//Sets tower not selector

	setColorNS(color) {
		this._color = color;
		this._element.querySelector("img").style.backgroundColor = color;
		if (color == "none") {
			this._element.querySelector("img").style.backgroundColor = "";
		}
		this.updateTowerData();
	}

	setTransitionNS(transition) {
		this._transition = transition;
		this.updateTowerData();
	}

	setEffectNS(effect) {
		this._effect = effect;
		this.updateTowerData();
	}



	// Just sets the color selector
	setColorSelector(color) {
		let colorSelect = this._element.querySelector(".colorselect");
		colorSelect.value = color;
	}

}