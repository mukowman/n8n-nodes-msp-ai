![n8n ConnectWise Manage Integration for MSP Automation](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n ConnectWise Manage Integration for MSP Automation

This repository contains a powerful n8n integration for ConnectWise Manage, specifically designed for MSPs (Managed Service Providers) to automate their workflows and operations. It includes both the ConnectWise Manage nodes for n8n and infrastructure code to deploy n8n with Azure Container Apps for a secure, scalable automation platform.

[![Deploy n8n with ConnectWise Manage Integration to Azure](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fadamhancock%2Fn8n-nodes-msp-automation%2Fmain%2Finfra%2Fazuredeploy.json)
[![Sponsor me](https://img.shields.io/static/v1?label=Sponsor&message=❤&logo=GitHub&color=ff69b4)](https://github.com/sponsors/adamhancock)

## 🚀 MSP Automation with ConnectWise Manage and n8n

Streamline your MSP operations by automating ConnectWise Manage workflows with n8n. This integration enables you to build powerful automation workflows that connect ConnectWise Manage with other tools in your MSP tech stack.

### 🔄 ConnectWise Manage Integration Features

This package provides comprehensive integration with ConnectWise Manage API, allowing you to:

- **Automate ticket management** - Create, update, and close service tickets automatically
- **Streamline client onboarding** - Automate company and contact creation
- **Track time efficiently** - Automate time entries for billing accuracy
- **Enhance project management** - Automate project tasks and updates
- **Improve sales processes** - Automate opportunity tracking and follow-ups
- **Real-time notifications** - Set up webhooks to trigger workflows based on ConnectWise Manage events
- **Custom workflow automation** - Build complex automation workflows specific to your MSP needs

### 📊 Supported ConnectWise Manage Resources

The integration supports comprehensive operations on these ConnectWise Manage resources:

- **Service Tickets** - Manage tickets, add notes, track status changes
- **Companies** - Create and update client companies
- **Contacts** - Manage client contacts
- **Time Entries** - Track billable and non-billable time
- **Projects** - Manage project details and tasks
- **Opportunities** - Track sales opportunities
- **Agreements** - Manage service agreements
- **Activities** - Track activities and follow-ups
- **Members** - Manage team members
- **Configurations** - Track client configurations
- **Invoices** - Manage billing and invoices
- **Expenses** - Track expenses
- **Purchase Orders** - Manage procurement
- **Product Catalog** - Access product information
- **Schedules** - Manage scheduling

## 🏗️ Azure Deployment Infrastructure

The `/infra` directory contains Bicep templates to deploy n8n in Azure using Container Apps with a PostgreSQL database, providing a secure and scalable environment for your MSP automation workflows.

### 🔒 Azure Infrastructure Features

- **Secure environment** - Private endpoints for database connectivity
- **Scalable architecture** - Azure Container Apps for flexible scaling
- **Cost-effective** - Pay-as-you-go pricing model
- **Managed services** - Reduced operational overhead
- **High availability** - Reliable platform for critical MSP workflows
- **Integrated logging** - Comprehensive monitoring and troubleshooting
- **Easy deployment** - One-click deployment with the "Deploy to Azure" button

## 🛠️ Prerequisites

To develop or use this integration, you need:

* [git](https://git-scm.com/downloads) - For source control
* **Node.js and pnpm** - Minimum version Node 18. Install using [nvm](https://github.com/nvm-sh/nvm) for Linux, Mac, and WSL. For Windows, follow Microsoft's guide to [Install NodeJS on Windows](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows).
* **n8n** - Install globally with:
  ```
  pnpm install n8n -g
  ```
* **ConnectWise Manage API credentials** - You'll need access to your ConnectWise Manage instance

## 📦 Installation Options

### 🧩 As a Community Node in n8n

The easiest way to use this integration is to install it directly from the n8n UI as a community node:

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install**
4. Enter `@adamhancock/n8n-nodes-msp-ai` in the "npm package name" field
5. Click **Install**
6. Reload n8n when prompted

After installation, the ConnectWise Manage nodes will be available in your n8n workflows.

### 📥 As an npm Package

To use this node in your existing n8n installation via npm:

```bash
npm install @adamhancock/n8n-nodes-msp-ai
```

Then restart your n8n instance to load the new nodes.

### 🧪 For Development

1. Clone the repository:
   ```
   git clone https://github.com/adamhancock/n8n-nodes-msp-ai.git
   ```
2. Install dependencies:
   ```
   cd n8n-nodes-msp-ai
   pnpm install
   ```
3. Build the code:
   ```
   pnpm build
   ```
4. Link to your n8n installation:
   ```
   npm link
   ```
   In your n8n installation directory:
   ```
   npm link @adamhancock/n8n-nodes-msp-ai
   ```

## ☁️ Azure Deployment Methods

### 🔘 One-Click Deployment

Click the "Deploy to Azure" button at the top of this README to deploy n8n with the ConnectWise Manage integration directly to your Azure subscription.

### ⌨️ Manual Deployment

1. Navigate to the `/infra` directory
2. Update parameters in `main.parameters.json`
3. Run the deployment script:
   - On Linux/macOS: `chmod +x deploy.sh && ./deploy.sh`
   - On Windows: `deploy.cmd`

For more detailed deployment instructions, see the [infrastructure README](/infra/README.md).

## 🔌 Using the ConnectWise Manage Integration

After installation, the ConnectWise Manage nodes will be available in your n8n instance:

### 🔄 ConnectWise Manage Node

Use this node in your workflows to interact with ConnectWise Manage resources. It supports operations like:

- Creating and updating tickets
- Managing companies and contacts
- Tracking time entries
- Handling projects and opportunities
- And much more

### 📡 ConnectWise Manage Trigger

Use this node to start workflows based on events in ConnectWise Manage, such as:

- New ticket created
- Ticket status changed
- New company added
- New contact created
- And many other events

## ⚙️ Configuration

To use the ConnectWise Manage integration, configure the ConnectWise Manage API credentials in n8n:

1. Go to Settings > Credentials
2. Create a new credential of type "ConnectWise Manage API"
3. Enter your ConnectWise Manage site URL, company ID, public key, and private key

## 📚 Resources

- [n8n Documentation](https://docs.n8n.io/)
- [ConnectWise Manage API Documentation](https://developer.connectwise.com/)
- [Azure Container Apps Documentation](https://docs.microsoft.com/en-us/azure/container-apps/)

## 📄 License

[MIT](LICENSE.md)
