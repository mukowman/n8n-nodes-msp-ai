@description('The name of the private DNS zone')
param name string

@description('The ID of the virtual network to link with the private DNS zone')
param vnetId string

@description('Tags to apply to the resources')
param tags object = {}

resource privateDnsZone 'Microsoft.Network/privateDnsZones@2020-06-01' = {
  name: name
  location: 'global'
  tags: tags
}

resource virtualNetworkLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = {
  parent: privateDnsZone
  name: 'link-${uniqueString(vnetId)}'
  location: 'global'
  tags: tags
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: vnetId
    }
  }
}

output id string = privateDnsZone.id
output name string = privateDnsZone.name
