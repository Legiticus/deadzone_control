/*
	@author: Levi Smith
	@version: Beta
	@date: 08/10/2025
*/

export class GlobalTile {

	constructor(TOWERS) {
		this._element = document.createElement("div");
		this._towerList = TOWERS;
		this._globalColor = "none";
		this._globalTransition = "inst";
		this._globalEffect = "solid";

		//Element Properites
		this._element.className = "grouptile";
		this._element.id = "globaltile";

		//Title
		let title = document.createElement("h3");
		title.className = "groupselector";
		title.innerHTML = "Global Select";
		this._element.append(title);

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
		colorLabel.setAttribute("for", "globalcolorselect");
		colorLabel.innerHTML = "Color:";

		let colorSelect = document.createElement("select");
		colorSelect.className = "colorselect";
		colorSelect.id = "globalcolorselect";

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

		colorDiv.append(colorLabel);
		colorDiv.append(colorSelect);

		//Transition
		let transitionDiv = document.createElement("div");
		selectionDiv.append(transitionDiv);

		//transition selection
		let transitionLabel = document.createElement("transitionlabel");
		transitionLabel.className = "transitionlabel";
		transitionLabel.setAttribute("for", "globaltransitionselect");
		transitionLabel.innerHTML = "Trans:".strike();

		let transitionSelect = document.createElement("select");
		transitionSelect.className = "transitionselect";
		transitionSelect.id = "globaltransitionselect";

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
		effectLabel.setAttribute("for", "globaleffectselect");
		effectLabel.innerHTML = "Effect:";

		let effectSelect = document.createElement("select");
		effectSelect.className = "effectselect";
		effectSelect.id = "globaleffectselect";

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
		updateButton.id = "globalupdatebutton";
		updateButton.append("update");
		updateButton.addEventListener("click", () => {
			this.updateTowers();
		});

		this._element.append(updateButton);

	}

	updateTowers() {
		for (let tower of this._towerList) {
			tower.configure(tower.status, tower.signal, this._globalColor, this._globalTransition, this._globalEffect);
			
		}
	}


}