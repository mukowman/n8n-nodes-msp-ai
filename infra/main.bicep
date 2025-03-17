@description('The base name for all resources')
param baseName string = 'n8n'

@description('The location for all resources')
param location string = resourceGroup().location

@description('The administrator username for the PostgreSQL server')
param postgresAdminUsername string

@description('The administrator password for the PostgreSQL server')
@secure()
param postgresAdminPassword string

@description('The encryption key for n8n')
@secure()
param n8nEncryptionKey string = newGuid()

@description('The n8n container image to use')
param n8nContainerImage string = 'docker.io/n8nio/n8n:latest'

@description('Tags to apply to all resources')
param tags object = {
  application: 'n8n'
  environment: 'production'
}

// Generate unique names for resources
var uniqueSuffix = uniqueString(resourceGroup().id)
var vnetName = '${baseName}-vnet-${uniqueSuffix}'
var logAnalyticsName = '${baseName}-logs-${uniqueSuffix}'
var containerAppEnvName = '${baseName}-env-${uniqueSuffix}'
var postgresServerName = '${baseName}-pg-${uniqueSuffix}'
var n8nContainerAppName = '${baseName}-app-${uniqueSuffix}'
var postgresDnsZoneName = 'privatelink.postgres.database.azure.com'
var postgresPrivateEndpointName = '${baseName}-pg-pe-${uniqueSuffix}'

// Deploy networking resources (simplified - only for private endpoints)
module networking './modules/networking.bicep' = {
  name: 'networking-deployment'
  params: {
    vnetName: vnetName
    location: location
    tags: tags
  }
}

// Deploy Log Analytics workspace
module logAnalytics './modules/log-analytics.bicep' = {
  name: 'log-analytics-deployment'
  params: {
    name: logAnalyticsName
    location: location
    tags: tags
  }
}

// Deploy Container App Environment (using managed VNet)
module containerAppEnvironment './modules/container-app-environment.bicep' = {
  name: 'container-app-environment-deployment'
  params: {
    name: containerAppEnvName
    location: location
    logAnalyticsWorkspaceId: logAnalytics.outputs.id
    // Not providing infrastructureSubnetId to use managed VNet
    tags: tags
  }
}

// Deploy PostgreSQL database
module postgresql './modules/postgresql.bicep' = {
  name: 'postgresql-deployment'
  params: {
    serverName: postgresServerName
    location: location
    administratorLogin: postgresAdminUsername
    administratorLoginPassword: postgresAdminPassword
    databaseName: 'n8n'
    tags: tags
  }
}

// Deploy Private DNS Zone for PostgreSQL
module postgresDnsZone './modules/private-dns-zone.bicep' = {
  name: 'postgres-dns-zone-deployment'
  params: {
    name: postgresDnsZoneName
    vnetId: networking.outputs.vnetId
    tags: tags
  }
}

// Deploy Private Endpoint for PostgreSQL
module postgresPrivateEndpoint './modules/private-endpoint.bicep' = {
  name: 'postgres-private-endpoint-deployment'
  params: {
    name: postgresPrivateEndpointName
    location: location
    privateConnectionResourceId: postgresql.outputs.id
    groupId: 'postgresqlServer'
    subnetId: networking.outputs.privateEndpointsSubnetId
    privateDnsZoneId: postgresDnsZone.outputs.id
    tags: tags
  }
}

// Deploy n8n Container App
module n8nContainerApp './modules/n8n-container-app.bicep' = {
  name: 'n8n-container-app-deployment'
  dependsOn: [
    postgresPrivateEndpoint // Ensure private endpoint is created before container app
  ]
  params: {
    name: n8nContainerAppName
    location: location
    containerAppEnvironmentId: containerAppEnvironment.outputs.id
    containerImage: n8nContainerImage
    postgresConnectionString: postgresql.outputs.connectionString
    encryptionKey: n8nEncryptionKey
    tags: tags
  }
}

// Outputs
output n8nUrl string = n8nContainerApp.outputs.url
output postgresServerFqdn string = postgresql.outputs.serverFqdn
output postgresServerName string = postgresql.outputs.serverName
output postgresDatabaseName string = postgresql.outputs.databaseName
