@description('The base name for all resources')
param baseName string = 'n8n'

@description('The location for all resources')
param location string = resourceGroup().location

@description('The administrator username for the PostgreSQL server')
param postgresAdminUsername string = 'n8nadmin'

@description('The administrator password for the PostgreSQL server')
@secure()
param postgresAdminPassword string = ''

@description('The encryption key for n8n')
@secure()
param n8nEncryptionKey string = ''

var generatedPostgresPassword = postgresAdminPassword == ''
  ? '${uniqueString(resourceGroup().id)}Pw1'
  : postgresAdminPassword
var generatedEncryptionKey = n8nEncryptionKey == '' ? uniqueString(resourceGroup().id) : n8nEncryptionKey

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
var storageAccountName = replace('${baseName}st${uniqueSuffix}', '-', '')

// Deploy networking resources
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

// Deploy Storage Account for n8n data
module storageAccount './modules/storage.bicep' = {
  name: 'storage-deployment'
  params: {
    name: storageAccountName
    location: location
    tags: tags
  }
}

// Deploy private DNS zone for PostgreSQL
module privateDnsZone './modules/private-dns-zone.bicep' = {
  name: 'private-dns-zone-deployment'
  params: {
    name: 'private.postgres.database.azure.com'
    vnetId: networking.outputs.vnetId
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
    administratorLoginPassword: generatedPostgresPassword
    version: '16'
    serverEdition: 'Burstable'
    vmName: 'Standard_B1ms'
    storageSizeGB: 32
    backupRetentionDays: 7
    geoRedundantBackup: 'Disabled'
    haEnabled: 'Disabled'
    availabilityZone: ''
    standbyAvailabilityZone: ''
    storageAutogrow: 'Enabled'
    subnetId: networking.outputs.postgresSubnetId
    privateDnsZoneId: privateDnsZone.outputs.id
    databaseName: 'n8n'
    tags: tags
  }
}

// Deploy Container App Environment
module containerAppEnvironment './modules/container-app-environment.bicep' = {
  name: 'container-app-environment-deployment'
  params: {
    name: containerAppEnvName
    location: location
    logAnalyticsWorkspaceId: logAnalytics.outputs.id
    infrastructureSubnetId: networking.outputs.containerAppsSubnetId
    tags: tags
  }
}

// Deploy n8n Container App
module n8nContainerApp './modules/n8n-container-app.bicep' = {
  name: 'n8n-container-app-deployment'
  params: {
    name: n8nContainerAppName
    location: location
    containerAppEnvironmentId: containerAppEnvironment.outputs.id
    containerImage: n8nContainerImage
    postgresServerFqdn: postgresql.outputs.serverFqdn
    postgresDbName: postgresql.outputs.databaseName
    postgresAdminUsername: postgresAdminUsername
    postgresAdminPassword: generatedPostgresPassword
    encryptionKey: generatedEncryptionKey
    ingressTrafficType: 'external'
    storageAccountName: storageAccount.outputs.name
    storageShareName: storageAccount.outputs.shareName
    tags: tags
  }
}

// Outputs
output n8nUrl string = n8nContainerApp.outputs.url
output postgresServerFqdn string = postgresql.outputs.serverFqdn
output postgresServerName string = postgresql.outputs.serverName
output postgresDatabaseName string = postgresql.outputs.databaseName
