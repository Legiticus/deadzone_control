"""
    Author: Levi Smith
    Version: Alpha
    Date: 07/10/2025
"""

import socket #used to get local ip address
import asyncio
import json

from websockets.asyncio.server import serve
import websockets.exceptions

from tower import Tower
from dashboard import Dashboard
from masterFile import MasterFile
from counter import Counter
from defaults import DEFAULT_COLOR, DEFAULT_STATUS, DEFAULT_TRANSITION

MAXTOWERS = 24
PORT = 8001

TOWERSCONNECTED = []
DASHBOARDSCONNECTED = []
dashConnects = Counter()
master = MasterFile(MAXTOWERS)

async def updateDashboards():
	if len(DASHBOARDSCONNECTED) != 0:
		print("updating dashboards")
		for dashboard in DASHBOARDSCONNECTED:
			result = await sendData(dashboard.getSocket(), master.export())
			if result == False:
				DASHBOARDSCONNECTED.remove(dashboard)
				
	else:
		print("no dashboards are connected!")

async def updateTowers():
	if len(TOWERSCONNECTED) != 0:
		print("updating towers")
		for tower in TOWERSCONNECTED:
			result = await sendData(tower.getSocket(), master.exportTower(tower.getID()))
			if result == False:
				master.updateTowerStatus(tower.getID(), "disabled")
				TOWERSCONNECTED.remove(tower)
	else:
		print("no towers connected!")

async def sendData(websocket, data):
	try:
		await websocket.send(data)
	except websockets.exceptions.ConnectionClosedOK:
		print("Connection closed well")
		return False
	except websockets.exceptions.ConnectionClosedError:
		print("Connection closed with error")
		return False
	except Exception as e:
		print(f"Connection closed with unexpected error: {e} ")
		return False
	return True


async def handler(websocket):
	print("hander called")
	message = await websocket.recv()
	event = json.loads(message)
	print(event)
	assert event["type"] == "init"
	
	if event["device"] == "tower":
		#updates local storage of active towers
		tower = Tower(websocket, event["id"])
		master.updateTowerStatus(tower.getID(), "enabled")
		await sendData(tower.getSocket(), master.exportTower(tower.getID()))
		#passes the information to the webserver if the dashboard has connected
		await updateDashboards()
		await towerHandler(tower)

	elif event["device"] == "dashboard":
		#Configures the dashboard
		dashboard = Dashboard()
		dashConnects.increment()
		dashboard.configure(websocket, dashConnects.value())
		print(f"dashboard {dashConnects.value()} configured")

		DASHBOARDSCONNECTED.append(dashboard)

		#On connection, send the dashboard the masterfile
		print("updating dashboard")
		await dashboard.getSocket().send(master.export())
		await dashboardHandler(dashboard)


async def dashboardHandler(dashboard):
	async for message in dashboard.getSocket():
		event = json.loads(message)
		if event["type"] == "masterFile":
			print(event)
			master.updateDoc(event)
			await updateDashboards()
			await updateTowers()

	try:
		await dashboard.getSocket().wait_closed()
	finally:
		print(f"dashboard {dashboard.getID()} disconnected")
		DASHBOARDSCONNECTED.remove(dashboard)


async def towerHandler(tower):
	TOWERSCONNECTED.append(tower)
	print(f"tower{tower.getID()} connected")
	try:
		async for message in tower.getSocket():
			print("tower [" + tower.getID() + "]: " + message)
	except websockets.exceptions.ConnectionClosedError:
		print(f"tower{tower.getID()} disconnected with error")
	except Exception as e:
		print(f"unexpected error with tower{tower.getID()} connection: {e}")
	finally:
		print(f"tower{tower.getID()} removed")
		TOWERSCONNECTED.remove(tower)
		await updateDashboards()
		

async def main():
	ip = socket.gethostbyname(socket.gethostname())
	print(f"Starting server at:\t{ip} : {PORT}")
	async with serve(handler, "", PORT, ping_interval=3, ping_timeout=2) as server:
		await server.serve_forever()


if __name__ == "__main__":
	asyncio.run(main())








