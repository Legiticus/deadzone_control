"""
    Author: Levi Smith
    Version: Alpha
    Date: 07/28/2025
"""

import json

class Dashboard:

    def __init__(self):
        self.configured = False
    
    def configure(self, websocket, id):
        self.websocket = websocket
        self.id = id
        self.configured = True
    
    def update(self, color, transition):

        self.configure(color, transition)
        
        event = {
            "type": "update",
            "color": color,
            "transition": transition
        }
        self.websocket.send(json.dumps(event))

    def isConfigured(self):
        return self.configured
    
    def getID(self):
        return self.id
    
    def getSocket(self):
        return self.websocket

    def getColor(self):
        return self.color

    def getTransition(self):
        return self.transition
    
    def setColor(self, color):
        self.color = color

    def setTransition(self, transition):
        self.transition = transition
    