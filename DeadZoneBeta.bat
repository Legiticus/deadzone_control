start "DeadZone Web Server" powershell.exe -NoExit -Command "cd webserver; python -m http.server"
start "Python Server" powershell.exe -NoExit -Command "cd websocketserver; python app.py"
start "" http://192.168.0.100:8000/