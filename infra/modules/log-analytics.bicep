@description('The name of the Log Analytics workspace')
param name string

@description('The location for all resources')
param location string = resourceGroup().location

@description('The SKU of the Log Analytics workspace')
@allowed([
  'PerGB2018'
  'Free'
  'Standalone'
  'PerNode'
  'Standard'
  'Premium'
])
param sku string = 'PerGB2018'

@description('The number of days to retain data in the Log Analytics workspace')
param retentionInDays int = 30

@description('Tags to apply to the resources')
param tags object = {}

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: name
  location: location
  tags: tags
  properties: {
    sku: {
      name: sku
    }
    retentionInDays: retentionInDays
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
    workspaceCapping: {
      dailyQuotaGb: -1
    }
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

output id string = logAnalyticsWorkspace.id
output name string = logAnalyticsWorkspace.name
