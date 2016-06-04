@set MSI_FILE=%USERPROFILE%\desktop\mongodb-win32-x86_64-2008plus-ssl-3.3.6-signed.msi
@set TARGETDIR=%PROJECT_BASE%\bin\apps
@msiexec /a "%MSI_FILE%" /qb TARGETDIR="%TARGETDIR%\mongodb-win32-x86_64-2008plus-ssl-3.3.6"