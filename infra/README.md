# n8n MSP AI - Azure Infrastructure

This directory contains Bicep templates to deploy the n8n MSP AI solution in Azure using Container Apps with a PostgreSQL database. This infrastructure is designed to provide a secure, scalable environment for running n8n workflows that integrate with MSP tools and AI services.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fadamhancock%2Fn8n-nodes-msp-automation%2Fmain%2Finfra%2Fazuredeploy.json)

> **Note:** To use the "Deploy to Azure" button, ensure your Bicep files are compiled to ARM templates and pushed to your repository.

### Preparing the "Deploy to Azure" Button

1. Compile the Bicep files to an ARM template:
   - On Linux/macOS: `chmod +x build-arm-template.sh && ./build-arm-template.sh`
   - On Windows: `build-arm-template.cmd`

2. Push the generated `azuredeploy.json` file to the GitHub repository

## Architecture

The infrastructure consists of:

- **Azure Container App**: Hosts the n8n MSP AI application, allowing you to run workflows that integrate with ConnectWise Manage and other MSP tools
- **Azure Container App Environment**: Provides the hosting environment for the Container App with managed networking and logging
- **Azure PostgreSQL Flexible Server**: Database for storing n8n workflows, credentials, and execution data
- **Private Endpoint**: Securely connects to the PostgreSQL database without exposing it to the public internet
- **Private DNS Zone**: Resolves the private endpoint DNS name for secure database connectivity
- **Virtual Network**: Simplified network infrastructure with a subnet for private endpoints
- **Log Analytics Workspace**: For monitoring and logging of the n8n MSP AI application

This architecture uses a simplified networking approach:
- Container App Environment uses Azure's managed VNet feature
- A minimal VNet is created only for the private endpoint to the PostgreSQL database

## Security Features

- **Private Endpoints**: The PostgreSQL database is deployed with private endpoints, ensuring that database traffic stays within the Azure network and doesn't traverse the public internet.
- **No Public Access**: The PostgreSQL server has public network access disabled, enhancing security.
- **Network Isolation**: Container Apps and database resources are deployed in separate subnets.
- **Secure Credentials Storage**: Sensitive information like API keys and passwords are stored securely in the database.

## Benefits for MSP Operations

- **Scalable Automation**: Deploy n8n workflows that can scale with your MSP operations
- **Secure Integration**: Connect to ConnectWise Manage and other MSP tools securely
- **Reliable Infrastructure**: Azure Container Apps provide reliable, managed infrastructure
- **Cost-Effective**: Pay only for the resources you use with flexible scaling options
- **Monitoring**: Built-in logging and monitoring for your automation workflows

## Prerequisites

- Azure CLI installed and logged in
- Subscription with permissions to create resources
- (Optional) Azure Key Vault for storing secrets

## Deployment

### 1. Update Parameters

Edit the `main.parameters.json` file to set your desired configuration:

- `baseName`: Base name for all resources (default: "n8n")
- `location`: Azure region to deploy to (default: "westeurope")
- `postgresAdminUsername`: PostgreSQL admin username
- `postgresAdminPassword`: PostgreSQL admin password (preferably from Key Vault)
- `n8nEncryptionKey`: Encryption key for n8n (preferably from Key Vault)
- `n8nContainerImage`: n8n container image to use (default: "docker.io/n8nio/n8n:latest")
- `tags`: Resource tags

### 2. Deploy Using Azure CLI

```bash
# Create a resource group if you don't have one
az group create --name rg-n8n-msp --location westeurope

# Deploy the Bicep template
az deployment group create \
  --resource-group rg-n8n-msp \
  --template-file main.bicep \
  --parameters @main.parameters.json
```

### 3. For Local Testing with Explicit Parameters

```bash
# Deploy with explicit parameters (not recommended for production)
az deployment group create \
  --resource-group rg-n8n-msp \
  --template-file main.bicep \
  --parameters baseName=n8n-msp \
  --parameters postgresAdminUsername=n8nadmin \
  --parameters postgresAdminPassword=YourStrongPassword123! \
  --parameters n8nEncryptionKey=YourEncryptionKey123!
```

### 4. Using the Deployment Scripts

For convenience, you can use the provided deployment scripts:

#### On Linux/macOS:
```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

#### On Windows:
```cmd
# Run the deployment
deploy.cmd
```

Both scripts support the same command-line parameters:
```
  -g, --resource-group    Resource group name (default: rg-n8n)
  -l, --location          Azure region (default: westeurope)
  -n, --name              Deployment name (default: n8n-deployment)
  -p, --parameters        Parameters file (default: main.parameters.json)
  -h, --help              Show help message
```

## Module Structure

- `main.bicep`: Main deployment file that orchestrates all modules
- `modules/`: Directory containing modular Bicep templates
  - `container-app-environment.bicep`: Container App Environment
  - `n8n-container-app.bicep`: n8n Container App
  - `postgresql.bicep`: PostgreSQL Flexible Server
  - `networking.bicep`: Virtual Network and Subnets
  - `log-analytics.bicep`: Log Analytics Workspace
  - `private-endpoint.bicep`: Private Endpoint for secure connectivity
  - `private-dns-zone.bicep`: Private DNS Zone for name resolution

## Security Considerations

- The PostgreSQL server is configured with private endpoints for secure access
- Public network access is disabled for the PostgreSQL server
- For additional security, consider:
  - Implementing network security groups
  - Setting up Azure AD authentication
  - Using managed identities for Container Apps

## Customization

- Adjust the SKU sizes in the parameters to match your performance requirements
- Modify the container image to use a specific n8n version
- Update environment variables in the n8n Container App module to configure n8n behavior
- Add additional ConnectWise Manage specific environment variables as needed

## Post-Deployment Setup

After deployment:

1. Access the n8n URL provided in the deployment outputs
2. Set up your ConnectWise Manage credentials in n8n
3. Import or create workflows for your MSP automation needs
4. Configure webhooks for real-time integration with ConnectWise Manage

## Outputs

After deployment, you'll receive:
- n8n URL (access this to start creating your MSP automation workflows)
- PostgreSQL server FQDN
- PostgreSQL server name
- PostgreSQL database name
