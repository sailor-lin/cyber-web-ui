@ECHO off

:_set
set /p v=Please enter the version number of the package: 

if "%v%" == "" goto _set

:_build
cd docker
call npm run build
call docker build -t %1:%v% .
call docker push %1:%v%
if errorlevel 1 goto _fail

echo Packaged successfully
echo Packaged path: %1
echo Packaged version: %v%
echo Packing completion time: %date% %time%
goto _end

:_fail
echo Packaging failure

:_end
