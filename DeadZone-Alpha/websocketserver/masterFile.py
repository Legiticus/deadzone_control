"""
	Author: Levi Smith
	Version: Alpha
	Date: 07/29/2025
"""

import json
from defaults import DEFAULT_COLOR, DEFAULT_STATUS, DEFAULT_TRANSITION, DEFAULT_EFFECT
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

	def exportTower(self, id):
		towerDoc = {
			"color": COLORS[self.doc["tower" + str(id)]["color"]],
			"transition": self.doc["tower" + str(id)]["transition"],
			"effect": self.doc["tower" + str(id)]["effect"]
		}
		return json.dumps(towerDoc)
	
	def getDoc(self):
		return self.doc
	
	def overwrite(self, doc):
		self.doc = doc
	
	def updateDoc(self, file):
		for i in range(self.numTowers):
			id = i + 1
			self.configureTower(id, file["tower" + str(id)]["color"], file["tower" + str(id)]["transition"], file["tower" + str(id)]["effect"])
			
	def resetTower(self, id):
		self.doc["tower" + str(id)] = {"status": DEFAULT_STATUS, "color": DEFAULT_COLOR, "transition":DEFAULT_TRANSITION, "effect":DEFAULT_EFFECT}
	
	def configureTower(self, id, color, transition, effect):
		self.doc["tower" + str(id)]["color"] = color
		self.doc["tower" + str(id)]["transition"] = transition
		self.doc["tower" + str(id)]["effect"] = effect

	def updateTower(self, id, status, color, transition, effect):
		self.doc["tower" + str(id)] = {"status": status, "color": color, "transition":transition, "effect":effect}
	
	def updateTowerStatus(self, id, status):
		self.doc["tower" + str(id)]["status"] = status

	def updateTowerColor(self, id, color):
		self.doc["tower" + str(id)]["color"] = color
	
	def updateTowerTransition(self, id, transition):
		self.doc["tower" + str(id)]["transition"] = transition
	
	def updateTowerEffect(self, id, effect):
		self.doc["tower" + str(id)]["effect"] = effect