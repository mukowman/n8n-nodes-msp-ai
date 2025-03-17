#!/bin/bash

# Script to compile Bicep files to ARM templates

# Exit on error
set -e

echo "Compiling Bicep files to ARM templates..."

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "Error: Azure CLI is not installed. Please install it first."
    exit 1
fi

# Check if Bicep is installed
if ! az bicep version &> /dev/null; then
    echo "Installing Bicep..."
    az bicep install
fi

# Compile main.bicep to azuredeploy.json
echo "Compiling main.bicep to azuredeploy.json..."
az bicep build --file main.bicep --outfile azuredeploy.json

echo "Compilation completed successfully!"
echo "The ARM template has been saved as azuredeploy.json"
echo ""
echo "To use the 'Deploy to Azure' button, push this file to your GitHub repository"
echo "and update the URL in the README.md file with your GitHub username and repository name."
