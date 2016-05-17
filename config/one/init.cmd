setlocal
@rem call %~dp0bin\base.cmd
@rem call %~dp0set-env.cmd

set BINDIR=%PROJECT_BASE%\bin

if exist %BINDIR%\node goto InstallNodeNodule
set /P NodeZipPath=where is node-5.7.1-standalone.zip?
mkdir %BINDIR%
"C:\Program Files\7-Zip\7z.exe" x %NodeZipPath% -o%BINDIR%

:InstallNodeNodule
setlocal
  call npm install
endlocal

setlocal
  call bower install
endlocal

endlocal