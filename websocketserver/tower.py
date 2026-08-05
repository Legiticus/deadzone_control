"""
    Author: Levi Smith
    Version: Alpha
    Date: 07/10/2025
"""

import json

class Tower:

    def __init__(self, websocket, id):
        self.id = id
        self.websocket = websocket
    
    def configure(self, color, transition, effect):
        self.color = color
        self.transition = transition
        self.effect = effect
    
    def update(self, color, transition, effect):

        self.configure(color, transition, effect)
        
        event = {
            "type": "update",
            "color": color,
            "transition": transition,
            "effect": effect
        }
        self.websocket.send(json.dumps(event))
    
    def getID(self):
        return self.id
    
    def getSocket(self):
        return self.websocket

    def getColor(self):
        return self.color

    def getTransition(self):
        return self.transition

    def getEffect(self):
        return self.effect
    
    def setColor(self, color):
        self.color = color

    def setTransition(self, transition):
        self.transition = transition
    
    def setEffect(self, effect):
        self.effect = effect
    