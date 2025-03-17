@description('The name of the PostgreSQL server')
param serverName string

@description('The location for all resources')
param location string = resourceGroup().location

@description('The administrator username for the PostgreSQL server')
param administratorLogin string

@description('The administrator password for the PostgreSQL server')
@secure()
param administratorLoginPassword string

@description('Tags to apply to the resources')
param tags object = {}

@description('The PostgreSQL version')
@allowed([
  '11'
  '12'
  '13'
  '14'
  '15'
])
param postgresqlVersion string = '14'

@description('The SKU name for the PostgreSQL server')
param skuName string = 'Standard_B1ms'

@description('The storage size for the PostgreSQL server in MB')
param storageSizeGB int = 32

@description('The backup retention days for the PostgreSQL server')
@minValue(7)
@maxValue(35)
param backupRetentionDays int = 7

@description('The database name')
param databaseName string = 'n8n'

resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2022-12-01' = {
  name: serverName
  location: location
  tags: tags
  sku: {
    name: skuName
    tier: contains(skuName, 'Burstable')
      ? 'Burstable'
      : contains(skuName, 'Standard') ? 'GeneralPurpose' : 'MemoryOptimized'
  }
  properties: {
    version: postgresqlVersion
    administratorLogin: administratorLogin
    administratorLoginPassword: administratorLoginPassword
    storage: {
      storageSizeGB: storageSizeGB
    }
    backup: {
      backupRetentionDays: backupRetentionDays
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
    network: {
      publicNetworkAccess: 'Disabled'
    }
  }
}

resource database 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2022-12-01' = {
  parent: postgresServer
  name: databaseName
  properties: {
    charset: 'UTF8'
    collation: 'en_US.utf8'
  }
}

@description('The connection string for the PostgreSQL database')
output connectionString string = 'postgresql://${administratorLogin}:${administratorLoginPassword}@${postgresServer.properties.fullyQualifiedDomainName}:5432/${databaseName}'
output serverName string = postgresServer.name
output serverFqdn string = postgresServer.properties.fullyQualifiedDomainName
output databaseName string = database.name
output id string = postgresServer.id
