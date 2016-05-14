@setlocal EnableDelayedExpansion
@setlocal

@call %~dp0base.cmd

@set SPLITSTR=%PROJECT_BASE%
:nextVar
   @for /F tokens^=1*^ delims^=^\ %%a in ("%SPLITSTR%") do @(
      set LAST=%%a
      set SPLITSTR=%%b
   )
@if defined SPLITSTR goto nextVar
@set TITLE=%LAST%

@set PATH=%ONE_BASE%\bin;%PATH%
@set PATH=%PROJECT_BASE%\bin\ansi\x64;%PATH%
@set PROMPT=$C!TITLE!$F$S$P$G
@call %ONE_BASE%\set-env.cmd


@set CMDSCRIPT=
@rem set CMDSCRIPT=!CMDSCRIPT! set PROMPT=$C!TITLE!$F$S$P$G^&
@set CMDSCRIPT=!CMDSCRIPT! type %ONE_BASE%\help.txt^&

@if not [%ONE_ERROR%] EQU [] goto IfError
@if [%1] EQU [] goto StartShell

:Excute
@set CMDSCRIPT=!CMDSCRIPT! %1^&
start "[%TITLE%]" ansicon.exe cmd.exe /C "%CMDSCRIPT%"
@goto quit

:StartShell
start "[%TITLE%]" ansicon.exe cmd.exe /K "%CMDSCRIPT%"
@goto quit

:IfError
@echo %ONE_ERROR%

:quit
@endlocal
