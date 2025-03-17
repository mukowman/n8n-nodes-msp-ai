@description('The name of the Container App Environment')
param name string

@description('The location for all resources')
param location string = resourceGroup().location

@description('The Log Analytics workspace ID to use for logging')
param logAnalyticsWorkspaceId string

@description('The subnet ID to use for the Container App Environment')
param infrastructureSubnetId string = ''

@description('Tags to apply to the resources')
param tags object = {}

resource containerAppEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: name
  location: location
  tags: tags
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: reference(logAnalyticsWorkspaceId, '2021-06-01').customerId
        sharedKey: listKeys(logAnalyticsWorkspaceId, '2021-06-01').primarySharedKey
      }
    }
    infrastructureResourceGroup: '${resourceGroup().name}-infra'
    vnetConfiguration: !empty(infrastructureSubnetId)
      ? {
          infrastructureSubnetId: infrastructureSubnetId
          internal: false
        }
      : null
    zoneRedundant: false
  }
}

output id string = containerAppEnvironment.id
output name string = containerAppEnvironment.name
output defaultDomain string = containerAppEnvironment.properties.defaultDomain
