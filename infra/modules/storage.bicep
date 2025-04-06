@description('The name of the Storage Account')
param name string

@description('The location for all resources')
param location string = resourceGroup().location

@description('Tags to apply to the resources')
param tags object = {}

resource storage 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: name
  location: location
  tags: tags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    supportsHttpsTrafficOnly: true
  }
}

resource fileServices 'Microsoft.Storage/storageAccounts/fileServices@2023-01-01' = {
  parent: storage
  name: 'default'
}

resource n8nShare 'Microsoft.Storage/storageAccounts/fileServices/shares@2023-01-01' = {
  parent: fileServices
  name: 'n8n-data'
  properties: {
    accessTier: 'TransactionOptimized'
    shareQuota: 100
  }
}

output name string = storage.name
output id string = storage.id
output shareName string = n8nShare.name
output shareId string = n8nShare.id
