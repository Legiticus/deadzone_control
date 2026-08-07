"""
	Author: Levi Smith
	Version: Alpha
	Date: 07/29/2025
"""

import json
from defaults import DEFAULT_COLOR, DEFAULT_STATUS, DEFAULT_TRANSITION, DEFAULT_EFFECT, DEFAULT_SIGNAL
from colors import COLORS

class MasterFile:

	def __init__(self, numTowers):
		self.numTowers = numTowers
		self.doc = {}
		self.doc["type"] = "masterFile"
		for i in range(numTowers):
			self.resetTower(i + 1)
	
	def export(self):
		return json.dumps(self.doc)
	
	def exportInitFile(self):
		initDoc = self.doc
		initDoc["type"] = "masterFile"
		return json.dumps(initDoc)

	def exportTower(self, id):
		towerSection = self.doc["tower" + str(id)]
		towerDoc = {
			"type": "towerfile",
			"id": id,
			"status": towerSection["status"],
			"signal": towerSection["signal"],
			"color": towerSection["color"],
			"transition": towerSection["transition"],
			"effect": towerSection["effect"]
		}
		return json.dumps(towerDoc)
	
	def exportTowerForESP(self, id):
		towerSection = self.doc["tower" + str(id)]
		towerDoc = {
			"type": "update",
			"color": COLORS[towerSection["color"]],
			"transition": towerSection["transition"],
			"effect": towerSection["effect"]
		}
		return json.dumps(towerDoc)
	
	def getDoc(self):
		return self.doc
	
	def overwrite(self, doc):
		self.doc = doc
	
	def updateDoc(self, file):
		for i in range(self.numTowers):
			id = i + 1
			towerSection = file["tower" + str(id)]
			self.configureTower(id, towerSection["color"], towerSection["transition"], towerSection["effect"])
			
	def resetTower(self, id):
		self.doc["tower" + str(id)] = {"status": DEFAULT_STATUS, "color": DEFAULT_COLOR, "transition":DEFAULT_TRANSITION, "effect":DEFAULT_EFFECT, "signal":DEFAULT_SIGNAL}
	
	def configureTower(self, id, color, transition, effect):
		towerSection = self.doc["tower" + str(id)]
		towerSection["color"] = color
		towerSection["transition"] = transition
		towerSection["effect"] = effect

	def updateTower(self, id, status, color, transition, effect, signal):
		self.doc["tower" + str(id)] = {"status": status, "color": color, "transition":transition, "effect":effect, "signal":signal}
	
	def updateTowerStatus(self, id, status):
		self.doc["tower" + str(id)]["status"] = status
		
	def updateTowerSignal(self, id, signal):
		self.doc["tower" + str(id)]["signal"] = signal

	def updateTowerColor(self, id, color):
		self.doc["tower" + str(id)]["color"] = color
	
	def updateTowerTransition(self, id, transition):
		self.doc["tower" + str(id)]["transition"] = transition
	
	def updateTowerEffect(self, id, effect):
		self.doc["tower" + str(id)]["effect"] = effect

	def updateTowerData(self, id, signal):
		self.doc["tower" + str(id)]["signal"] = signal