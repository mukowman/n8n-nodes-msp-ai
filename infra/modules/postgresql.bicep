@description('The name of the PostgreSQL server')
param serverName string

@description('The location for all resources')
param location string = resourceGroup().location

@description('The administrator username for the PostgreSQL server')
param administratorLogin string

@description('The administrator password for the PostgreSQL server')
@secure()
param administratorLoginPassword string

@description('The subnet ID for the PostgreSQL server')
param subnetId string

@description('The private DNS zone ID for PostgreSQL')
param privateDnsZoneId string

@description('The PostgreSQL version')
param version string = '16'

@description('Server Edition')
param serverEdition string = 'Burstable'

@description('Virtual machine name')
param vmName string = 'Standard_B1ms'

@description('The storage size in GB')
param storageSizeGB int = 32

@description('The backup retention days')
@minValue(7)
@maxValue(35)
param backupRetentionDays int = 7

@description('Enable/disable geo-redundant backup')
param geoRedundantBackup string = 'Disabled'

@description('Enable/disable high availability')
param haEnabled string = 'Disabled'

@description('Availability zone')
param availabilityZone string = ''

@description('Standby availability zone')
param standbyAvailabilityZone string = ''

@description('Enable/disable storage autogrow')
param storageAutogrow string = 'Enabled'

@description('The database name')
param databaseName string = 'n8n'

@description('Tags to apply to the resources')
param tags object = {}

resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2022-12-01' = {
  name: serverName
  location: location
  tags: tags
  sku: {
    name: vmName
    tier: serverEdition
  }
  properties: {
    version: version
    administratorLogin: administratorLogin
    administratorLoginPassword: administratorLoginPassword
    storage: {
      storageSizeGB: storageSizeGB
    }
    backup: {
      backupRetentionDays: backupRetentionDays
      geoRedundantBackup: geoRedundantBackup
    }
    highAvailability: {
      mode: haEnabled
      standbyAvailabilityZone: standbyAvailabilityZone
    }
    availabilityZone: availabilityZone
    network: {
      delegatedSubnetResourceId: subnetId
      privateDnsZoneArmResourceId: privateDnsZoneId
      firewallRules: [
        {
          name: 'AllowAll'
          startIpAddress: '0.0.0.0'
          endIpAddress: '255.255.255.255'
        }
      ]
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

var serverHash = split(postgresServer.name, '-')[last(range(0, length(split(postgresServer.name, '-'))))]

output connectionString string = 'postgresql://${administratorLogin}:${administratorLoginPassword}@${serverHash}.private.postgres.database.azure.com:5432/${databaseName}'
output serverName string = postgresServer.name
output serverFqdn string = '${serverHash}.private.postgres.database.azure.com'
output databaseName string = database.name
