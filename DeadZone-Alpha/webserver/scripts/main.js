/*
	Author: Levi Smith
	Version: Alpha
	Date: 07/09/2025
*/

import { TowerTile } from "./towerTile.js";
import { MasterFile } from "./masterFile.js";



const TOWERCOUNT = 12;
let TOWERS = [];
let masterFile = new MasterFile();

window.addEventListener("DOMContentLoaded", () => {

	const websocket = new WebSocket("ws://localhost:8001");
	websocket.onclose = (event) => {
		console.log("Websocket connection closed");
		//reconnectSocket(websocket);
	}

	//TODO: handle what happens with the socket disconnects

	const body = document.querySelector("body");
	setTimeout(() => initSocket(websocket), 1000);

	//Initialize the UI
	const map = document.querySelector("#towermap");
	createMap(map, TOWERCOUNT);

	let buttons = document.querySelectorAll('button');
	buttons.forEach(button => {
		console.log("adding listeners");
		button.addEventListener('click', () => handleButtonClick(button, websocket));
	});

})


//FUNCTIONS
function createMap(map, count) {
	for (let i = 1; i <= count; i++) {

		//create the tower object
		let tower = new TowerTile(i);
		TOWERS.push(tower);

		map.append(tower.element);

	}
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

function receiveData(websocket) {
	websocket.addEventListener("message", ({ data }) => {
		console.log(data);
		const event = JSON.parse(data);
		if (event["type"] == "masterFile") {
			masterFile.loadFile(event);
			for (var i = 1; i <= TOWERCOUNT; i++) {
				let tower = TOWERS[i - 1];
				let towerSection = event["tower" + i];
				tower.configure(towerSection["status"], towerSection["color"], towerSection["transition"], towerSection["effect"]);
				masterFile.updateTower(tower);
			}
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

	websocket.send(masterFile.export());
}

function reconnectSocket(websocket) {
	if (websocket.readyState == WebSocket.OPEN) {
		console.log("websocket connected");
	}else {
		setTimeout(reconnectSocket(websocket), 3000);
	}
}