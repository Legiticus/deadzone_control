"""
    Author: Levi Smith
    Version: 3.0
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

TOWERSCONNECTED = {}
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

async def updateDashboardTower(id):
	if len(DASHBOARDSCONNECTED) != 0:
		#print("updating dashboards for tower" + str(id))
		for dashboard in DASHBOARDSCONNECTED:
			result = await sendData(dashboard.getSocket(), master.exportTower(id))
			if result == False:
				DASHBOARDSCONNECTED.remove(dashboard)


async def updateTowers():
	if len(TOWERSCONNECTED) != 0:
		print("updating towers")
		for id, tower in TOWERSCONNECTED.items():
			result = await sendData(tower.getSocket(), master.exportTowerForESP(id))
			# if result == False:
			# 	master.updateTowerStatus(tower.getID(), "disabled")
			# 	TOWERSCONNECTED.remove(tower)
			# 	updateDashboards()
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
	if event["type"] == "init":
		if event["device"] == "tower":
			id = event["id"]
			#checks to see if there is a duplicate id
			if id in TOWERSCONNECTED:
				print(f"Error: Tower with ID {id} is already connected! <bad stuff is gonna happen now because that means they have the same statically assigned address ):<")
				await websocket.send(json.dumps({"type":"error", "error": "Duplicate ID"}))
				await websocket.close(code=4001, reason="Duplicate ID")
				return

			#updates local storage of active towers
			print("test")
			tower = Tower(websocket, id)
			TOWERSCONNECTED[id] = tower
			master.updateTowerData(tower.getID(), event["signal"])
			master.updateTowerStatus(tower.getID(), "enabled")
			await sendData(tower.getSocket(), master.exportTowerForESP(tower.getID()))
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
			await dashboard.getSocket().send(master.exportInitFile())
			await dashboardHandler(dashboard)



async def dashboardHandler(dashboard):
	async for message in dashboard.getSocket():
		event = json.loads(message)
		if event["type"] == "masterFile":
			master.updateDoc(event)
			await updateDashboards()
			await updateTowers()

	try:
		await dashboard.getSocket().wait_closed()
	finally:
		print(f"dashboard {dashboard.getID()} disconnected")
		DASHBOARDSCONNECTED.remove(dashboard)


async def towerHandler(tower):
	id = tower.getID()
	print("tower handler called")
	print(f"tower{id} connected")
	try:
		async for message in tower.getSocket():
			
			event = json.loads(message)
			print("tower [" + str(id) + "]: " + message)
			if (event["type"] == "data"):
				master.updateTowerSignal(id, event["signal"])
				await updateDashboardTower(id)
	except websockets.exceptions.ConnectionClosedError as e:
		print(f"tower{id} disconnected with error: {e}")
	except Exception as e:
		print(f"unexpected error with tower{id} connection: {e}")
	finally:
		master.updateTowerStatus(id, "disabled")
		master.updateTowerSignal(id, -999)
		del TOWERSCONNECTED[id]
		print(f"tower{id} removed")
		await updateDashboards()
		

async def main():
	ip = socket.gethostbyname(socket.gethostname())
	print(f"Starting server at:\t{ip} : {PORT}")
	async with serve(handler, "192.168.0.100", PORT, ping_interval=2, ping_timeout=2, close_timeout=1) as server:
		await server.serve_forever()


if __name__ == "__main__":
	asyncio.run(main())








