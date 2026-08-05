/*
    Author: Levi Smith
    Version: Alpha
    Date: 07/29/2025
*/

export class MasterFile {
    constructor() {
        this.file = {};
    }

    loadFile(file) {
        this.file = file;
    }

    export() {
        console.log("exporting master file");
        return JSON.stringify(this.file)
    }

    updateTower(tower) {
        this.file["tower" + tower.id]["color"] = tower.color;
        this.file["tower" + tower.id]["transition"] = tower.transition
        this.file["tower" + tower.id]["effect"] = tower.effect;
    }

    updateTowerColor(id, color) {
        this.file["tower" + id]["color"] = color;
    }

    updateTowerTransition(id, transition) {
        this.file["tower" + id]["transition"] = transition;
    }

    updateTowerEffect(id, effect) {
        this.file["tower" + id]["effect"] = effect;
    }

    getTowerColor(id) {
        return this.file["tower" + id]["color"]
    }

    getTowerTransition(id) {
        return this.file["tower" + id]["transition"]
    }

    getTowerEffect(id) {
        return this.file["tower" + id]["effect"]
    }

    getTowerStatus(id) {
        return this.file["tower" + id]["status"]
    }

}