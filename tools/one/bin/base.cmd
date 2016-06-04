@if not %~d0 == C: @(
    @REM python venv 必須被安裝在C槽, 否則他不執行
    @set ONE_ERROR=啟動失敗: 必須是在C槽
    @goto IF_ERROR
)

:: 確定資料夾是否含有非英文路徑
@ECHO %~dp0| findstr /R /C:"^[a-zA-Z0-9~.\\:_-]*$">nul 2>&1
@IF errorlevel 1 (
    @set ONE_ERROR=啟動失敗: 所在的路徑不能有中文或是特殊標點符號
    @goto IF_ERROR
)

:SetOneBase
@pushd %~dp0..
@set ONE_BASE=%cd%
@popd


:SetProjectBase
@if not "%PROJECT_BASE%" == "" @goto :SetAppsBase
@pushd %~dp0..\..\..
@set PROJECT_BASE=%cd%
@popd


:SetAppsBase
@if not "%APPS_BASE%" == "" @goto :SetOneConfigBase
@pushd %PROJECT_BASE%\bin\apps
@set APPS_BASE=%cd%
@popd


:SetOneConfigBase
@if not "%ONE_CONFIG_BASE%" == "" @goto :eof
@pushd %PROJECT_BASE%\config\one
@set ONE_CONFIG_BASE=%cd%
@popd



:IF_ERROR
