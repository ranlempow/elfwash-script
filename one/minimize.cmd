setlocal
call %~dp0bin\base.cmd
call %~dp0set-env.cmd

rd /Q /S %PROJECT_BASE%\bin\node
rd /Q /S %PROJECT_BASE%\bower_components
rd /Q /S %PROJECT_BASE%\node_modules
rd /Q /S %PROJECT_BASE%\dist

endlocal
