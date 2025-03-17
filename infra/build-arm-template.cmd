@echo off
setlocal

echo Compiling Bicep files to ARM templates...

:: Check if Azure CLI is installed
where az >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Azure CLI is not installed. Please install it first.
    exit /b 1
)

:: Check if Bicep is installed
az bicep version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Installing Bicep...
    az bicep install
)

:: Compile main.bicep to azuredeploy.json
echo Compiling main.bicep to azuredeploy.json...
az bicep build --file main.bicep --outfile azuredeploy.json

echo Compilation completed successfully!
echo The ARM template has been saved as azuredeploy.json
echo.
echo To use the 'Deploy to Azure' button, push this file to your GitHub repository
echo and update the URL in the README.md file with your GitHub username and repository name.

exit /b 0
