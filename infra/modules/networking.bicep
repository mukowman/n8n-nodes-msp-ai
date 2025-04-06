@description('The name of the virtual network')
param vnetName string

@description('The location for all resources')
param location string = resourceGroup().location

@description('The address prefix for the virtual network')
param vnetAddressPrefix string = '10.0.0.0/16'

@description('The address prefix for the container apps subnet')
param containerAppsSubnetAddressPrefix string = '10.0.0.0/23'

@description('The address prefix for the PostgreSQL subnet')
param postgresSubnetAddressPrefix string = '10.0.2.0/24'

@description('The address prefix for the private endpoints subnet')
param privateEndpointsSubnetAddressPrefix string = '10.0.3.0/24'

@description('Tags to apply to the resources')
param tags object = {}

resource virtualNetwork 'Microsoft.Network/virtualNetworks@2023-05-01' = {
  name: vnetName
  location: location
  tags: tags
  properties: {
    addressSpace: {
      addressPrefixes: [
        vnetAddressPrefix
      ]
    }
    subnets: [
      {
        name: 'container-apps-subnet'
        properties: {
          addressPrefix: containerAppsSubnetAddressPrefix
          privateEndpointNetworkPolicies: 'Enabled'
          privateLinkServiceNetworkPolicies: 'Enabled'
        }
      }
      {
        name: 'postgres-subnet'
        properties: {
          addressPrefix: postgresSubnetAddressPrefix
          delegations: [
            {
              name: 'Microsoft.DBforPostgreSQL.flexibleServers'
              properties: {
                serviceName: 'Microsoft.DBforPostgreSQL/flexibleServers'
              }
            }
          ]
        }
      }
      {
        name: 'private-endpoints-subnet'
        properties: {
          addressPrefix: privateEndpointsSubnetAddressPrefix
          privateEndpointNetworkPolicies: 'Disabled'
        }
      }
    ]
  }
}

resource containerAppsSubnet 'Microsoft.Network/virtualNetworks/subnets@2023-05-01' existing = {
  parent: virtualNetwork
  name: 'container-apps-subnet'
}

resource postgresSubnet 'Microsoft.Network/virtualNetworks/subnets@2023-05-01' existing = {
  parent: virtualNetwork
  name: 'postgres-subnet'
}

resource privateEndpointsSubnet 'Microsoft.Network/virtualNetworks/subnets@2023-05-01' existing = {
  parent: virtualNetwork
  name: 'private-endpoints-subnet'
}

output vnetId string = virtualNetwork.id
output vnetName string = virtualNetwork.name
output containerAppsSubnetId string = containerAppsSubnet.id
output postgresSubnetId string = postgresSubnet.id
output privateEndpointsSubnetId string = privateEndpointsSubnet.id
