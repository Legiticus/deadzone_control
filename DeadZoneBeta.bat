start "Web Server" powershell.exe -NoExit -Command "cd webserver; python -m http.server"
start "Python Server" powershell.exe -NoExit -Command "cd websocketserver; python app.py"