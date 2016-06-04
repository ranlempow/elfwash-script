setlocal

rd /Q /S %PROJECT_BASE%\bin\apps
rd /Q /S %PROJECT_BASE%\bower_components
rd /Q /S %PROJECT_BASE%\node_modules
rd /Q /S %PROJECT_BASE%\dist

git gc
if "%1" == "--deep" (
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
) 

endlocal
