/*
	Author: Levi Smith
	Version: Alpha
	Date: 07/09/2025
*/

import { TowerTile } from "./towerTile.js";
import { MasterFile } from "./masterFile.js";



const TOWERCOUNT = 9;
let TOWERS = [];
let masterFile = new MasterFile();

window.addEventListener("DOMContentLoaded", () => {
	connectSocket();

	const body = document.querySelector("body");

	//Initialize the UI
	const map = document.querySelector("#towermap");
	createMap(map, TOWERCOUNT);

})


//FUNCTIONS
function connectSocket() {
	const websocket = new WebSocket("ws://192.168.0.100:8001");

	websocket.onopen = function () {

		let buttons = document.querySelectorAll('button');
		buttons.forEach(button => {
			console.log("adding listeners");
			button.addEventListener('click', () => handleButtonClick(button, websocket));
		});

		initSocket(websocket);

	};

	websocket.onmessage = function (e) {
		//console.log('Message:', e.data);
	};

	websocket.onclose = function (e) {
		console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
		setTimeout(function () {
			connectSocket();
		}, 1000);
	};

	websocket.onerror = function (err) {
		console.error('Socket encountered error: ', err.message, 'Closing socket');
		websocket.close();
	};
}

function initSocket(websocket) {
	const event = {
		type: "init",
		device: "dashboard"
	};
	websocket.send(JSON.stringify(event));
	receiveData(websocket);
	sendData(websocket);
}

function createMap(map, count) {
	for (let i = 1; i <= count; i++) {

		//create the tower object
		let tower = new TowerTile(i);
		TOWERS.push(tower);

		map.append(tower.element);

	}
}

function receiveData(websocket) {
	websocket.addEventListener("message", ({ data }) => {
		console.log(data);
		const event = JSON.parse(data);
		if (event["type"] == "initFile") {
			masterFile.loadFile(event);
			for (var i = 1; i <= TOWERCOUNT; i++) {
				let tower = TOWERS[i - 1];
				let towerSection = event["tower" + i];
				tower.configure(towerSection["status"], towerSection["signal"], towerSection["color"], towerSection["transition"], towerSection["effect"]);
				masterFile.updateTower(tower);
			}
		} else if (event["type"] == "masterFile") {
			masterFile.loadFile(event);
			for (var i = 1; i <= TOWERCOUNT; i++) {
				let tower = TOWERS[i - 1];
				let towerSection = event["tower" + i];
				tower.configureNS(towerSection["status"], towerSection["signal"], towerSection["color"], towerSection["transition"], towerSection["effect"]);
				masterFile.updateTower(tower);
			}
		} else if (event["type"] == "towerfile") {
			let id = event["id"];
			let tower = TOWERS[id - 1];
			tower.configureNS(event["status"], event["signal"], event["color"], event["transition"], event["effect"]);
		}
	});
}

function sendData(websocket) {
	console.log("sending data");
}

//buttons handler
function handleButtonClick(button, websocket) {
	console.log("button clicked");
	if (button.id == "updateallbutton") {
		for (let i = 0; i < TOWERCOUNT; i++) {
			let tower = TOWERS[i];
			tower.update();
			masterFile.updateTower(tower);
		}
	} else if (button.className == "updatebutton") {
		let tower = TOWERS[parseInt(button.id.replace("updatebutton", "")) - 1];
		masterFile.updateTower(tower);
	}

	// SHOULD BE REPLACED IN FUTURE VERSIONS BUT WORKS AS QUICK FIX
	else if (button.className == "updatecolorall") {
		color = button.id.replace("updateall", "").replace("button", "");
		//check for valid color
		if (["red", "green", "blue", "orange", "purple", "none"].includes(color)) {
			console.log("ERROR: \"" + color + "\" is not a valid color!")
		}else {
			console.log("updating towers to \"" + color + "\"");
			for (let i = 0; i < TOWERCOUNT; i++) {
				let tower = TOWERS[i];
				tower.setColor(color);
			}
		}
	}

	websocket.send(masterFile.export());
}