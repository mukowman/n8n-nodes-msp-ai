@echo off
setlocal enabledelayedexpansion

:: n8n Azure Infrastructure Deployment Script for Windows

:: Default values
set RESOURCE_GROUP=rg-n8n
set LOCATION=westeurope
set DEPLOYMENT_NAME=n8n-deployment
set PARAMETERS_FILE=main.parameters.json

:: Parse command line arguments
:parse_args
if "%~1"=="" goto :end_parse_args
if /i "%~1"=="-g" (
    set RESOURCE_GROUP=%~2
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="--resource-group" (
    set RESOURCE_GROUP=%~2
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="-l" (
    set LOCATION=%~2
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="--location" (
    set LOCATION=%~2
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="-n" (
    set DEPLOYMENT_NAME=%~2
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="--name" (
    set DEPLOYMENT_NAME=%~2
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="-p" (
    set PARAMETERS_FILE=%~2
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="--parameters" (
    set PARAMETERS_FILE=%~2
    shift
    shift
    goto :parse_args
)
if /i "%~1"=="-h" (
    goto :show_help
)
if /i "%~1"=="--help" (
    goto :show_help
)
echo Unknown option: %~1
goto :show_help

:end_parse_args

echo === n8n Azure Infrastructure Deployment ===
echo Resource Group: %RESOURCE_GROUP%
echo Location: %LOCATION%
echo Deployment Name: %DEPLOYMENT_NAME%
echo Parameters File: %PARAMETERS_FILE%
echo.

:: Check if Azure CLI is installed
where az >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Azure CLI is not installed. Please install it first.
    exit /b 1
)

:: Check if user is logged in to Azure
echo Checking Azure login status...
az account show >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo You are not logged in to Azure. Please run 'az login' first.
    exit /b 1
)

:: Create resource group if it doesn't exist
echo Creating resource group if it doesn't exist...
az group create --name "%RESOURCE_GROUP%" --location "%LOCATION%" --output none

:: Validate the deployment
echo Validating deployment...
az deployment group validate ^
    --resource-group "%RESOURCE_GROUP%" ^
    --template-file main.bicep ^
    --parameters "@%PARAMETERS_FILE%" ^
    --output none

if %ERRORLEVEL% neq 0 (
    echo Validation failed. Please check your template and parameters.
    exit /b 1
)

:: Deploy the infrastructure
echo Deploying infrastructure...
az deployment group create ^
    --resource-group "%RESOURCE_GROUP%" ^
    --name "%DEPLOYMENT_NAME%" ^
    --template-file main.bicep ^
    --parameters "@%PARAMETERS_FILE%"

if %ERRORLEVEL% neq 0 (
    echo Deployment failed.
    exit /b 1
)

:: Get the deployment outputs
echo.
echo === Deployment Outputs ===
az deployment group show ^
    --resource-group "%RESOURCE_GROUP%" ^
    --name "%DEPLOYMENT_NAME%" ^
    --query "properties.outputs" ^
    --output json

echo.
for /f "tokens=* USEBACKQ" %%g in (`az deployment group show --resource-group "%RESOURCE_GROUP%" --name "%DEPLOYMENT_NAME%" --query "properties.outputs.n8nUrl.value" --output tsv`) do (set "N8N_URL=%%g")
echo n8n URL: %N8N_URL%
echo.
echo Deployment completed successfully!
exit /b 0

:show_help
echo Usage: %0 [options]
echo.
echo Options:
echo   -g, --resource-group    Resource group name (default: %RESOURCE_GROUP%)
echo   -l, --location          Azure region (default: %LOCATION%)
echo   -n, --name              Deployment name (default: %DEPLOYMENT_NAME%)
echo   -p, --parameters        Parameters file (default: %PARAMETERS_FILE%)
echo   -h, --help              Show this help message
echo.
exit /b 0
