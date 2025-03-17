@description('The name of the private endpoint')
param name string

@description('The location for all resources')
param location string = resourceGroup().location

@description('The resource ID of the resource to connect to')
param privateConnectionResourceId string

@description('The group ID of the resource to connect to')
param groupId string

@description('The subnet ID to deploy the private endpoint in')
param subnetId string

@description('The private DNS zone ID to link with the private endpoint')
param privateDnsZoneId string = ''

@description('Tags to apply to the resources')
param tags object = {}

resource privateEndpoint 'Microsoft.Network/privateEndpoints@2023-05-01' = {
  name: name
  location: location
  tags: tags
  properties: {
    privateLinkServiceConnections: [
      {
        name: name
        properties: {
          privateLinkServiceId: privateConnectionResourceId
          groupIds: [
            groupId
          ]
        }
      }
    ]
    subnet: {
      id: subnetId
    }
  }
}

// Only create DNS zone group if a DNS zone ID is provided
resource privateDnsZoneGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2023-05-01' = if (!empty(privateDnsZoneId)) {
  parent: privateEndpoint
  name: 'default'
  properties: {
    privateDnsZoneConfigs: [
      {
        name: 'config1'
        properties: {
          privateDnsZoneId: privateDnsZoneId
        }
      }
    ]
  }
}

output id string = privateEndpoint.id
output name string = privateEndpoint.name
