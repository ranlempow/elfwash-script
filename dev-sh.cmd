@set SCRIPT_SOURCE=%~dp0
@if "%SCRIPT_SOURCE:~-1%"=="\" @set SCRIPT_SOURCE=%SCRIPT_SOURCE:~0,-1%
@set PROJECT_BASE=%SCRIPT_SOURCE%
@call %SCRIPT_SOURCE%\tools\one\bin\dev-sh.cmd
