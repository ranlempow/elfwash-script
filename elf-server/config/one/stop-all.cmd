@setlocal
@call :CtrlCToProcessName "mysqld"
@call :CtrlCToProcessName "mongod"
@call :CtrlCToProcessName "node"
@call :CtrlCToProcessName "node"
@endlocal

:CtrlCToProcessName
@set PID=
@set PROCESS_NAME=%~1
@for /f "usebackq" %%a in (`@PowerShell -Command "Get-Process | ? {$_.ProcessName -eq '%PROCESS_NAME%'} | ForEach-Object { echo $_.Id }"`) do @set PID=%%a
@if not "%PID%" == "" @start "" SendSignalCtrlC.exe %PID%
@goto :eof


