@rem simply redirect to dev-XXX.cmd

@setlocal EnableDelayedExpansion
@call %~dp0base.cmd


@if [%1] EQU [] @goto ShowHelp

:RedirectCall
@call %~dp0dev-%1.cmd
@goto :Quit

:ShowHelp
@call %~dp0dev-help.cmd
@goto :Quit


:Quit
@endlocal
