"""
    Author: Levi Smith
    Version: Alpha
    Date: 07/29/2025
"""

class Counter:
    def __init__(self):
        self.count = 0
    def increment(self):
        self.count += 1
    def value(self):
        return self.count