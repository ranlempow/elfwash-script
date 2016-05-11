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
@call %ONE_BASE%\set-env.cmd


@set CMDSCRIPT=
@set CMDSCRIPT=!CMDSCRIPT! set PATH=!PATH_ADDED!%PATH%^&
@set CMDSCRIPT=!CMDSCRIPT! set PROMPT=$C!TITLE!$F$S$P$G^&
@set CMDSCRIPT=!CMDSCRIPT! type %ONE_BASE%\help.txt^&


@if [%1] EQU [] goto StartShell

:Excute
@set CMDSCRIPT=!CMDSCRIPT! %1^&
start "[%TITLE%]" cmd.exe /U /C "%CMDSCRIPT%"
@goto quit

:StartShell
start "[%TITLE%]" cmd.exe /U /K "%CMDSCRIPT%"
@goto quit


:quit
@endlocal
