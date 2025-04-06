@description('The name of the Container App')
param name string

@description('The location for all resources')
param location string = resourceGroup().location

@description('The Container App Environment ID')
param containerAppEnvironmentId string

@description('The n8n container image to use')
param containerImage string = 'docker.io/n8nio/n8n:latest'

@description('The CPU cores allocated to the container app')
param cpuCore string = '1.0'

@description('The memory allocated to the container app in GB')
param memorySize string = '2.0'

@description('The minimum number of replicas')
param minReplicas int = 1

@description('The maximum number of replicas')
param maxReplicas int = 3

@description('The PostgreSQL server FQDN')
param postgresServerFqdn string

@description('The PostgreSQL database name')
param postgresDbName string

@description('The PostgreSQL admin username')
param postgresAdminUsername string

@description('The PostgreSQL admin password')
@secure()
param postgresAdminPassword string

@description('The storage account name')
param storageAccountName string

@description('The storage share name')
param storageShareName string

@description('The encryption key for n8n')
@secure()
param encryptionKey string

@description('Tags to apply to the resources')
param tags object = {}

@description('The port that n8n listens on')
param port int = 5678

@description('Whether to enable ingress for the container app')
param ingressEnabled bool = true

@description('The target port for ingress')
param targetPort int = port

@description('The ingress traffic type')
@allowed([
  'external'
  'internal'
])
param ingressTrafficType string = 'external'

@description('The ingress transport protocol')
@allowed([
  'http'
  'http2'
  'auto'
])
param ingressTransport string = 'auto'

@description('Whether to allow insecure connections')
param ingressAllowInsecure bool = false

resource containerApp 'Microsoft.App/containerApps@2023-05-01' = {
  name: name
  location: location
  tags: tags
  properties: {
    managedEnvironmentId: containerAppEnvironmentId
    configuration: {
      activeRevisionsMode: 'Single'
      ingress: ingressEnabled
        ? {
            targetPort: targetPort
            allowInsecure: ingressAllowInsecure
            external: ingressTrafficType == 'external'
            transport: ingressTransport
            traffic: [
              {
                latestRevision: true
                weight: 100
              }
            ]
            corsPolicy: {
              allowedOrigins: ['*']
              allowedMethods: ['*']
              allowedHeaders: ['*']
            }
          }
        : null
      secrets: [
        {
          name: 'encryption-key'
          value: encryptionKey
        }
      ]
      registries: []
      volumes: [
        {
          name: 'n8n-data'
          storageName: storageAccountName
          storageType: 'AzureFile'
          shareName: storageShareName
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'n8n'
          image: containerImage
          resources: {
            cpu: json(cpuCore)
            memory: '${memorySize}Gi'
          }
          volumeMounts: [
            {
              volumeName: 'n8n-data'
              mountPath: '/home/node/.n8n'
            }
          ]
          env: [
            {
              name: 'DB_TYPE'
              value: 'postgresdb'
            }
            {
              name: 'DB_POSTGRESDB_DATABASE'
              value: postgresDbName
            }
            {
              name: 'DB_POSTGRESDB_HOST'
              value: postgresServerFqdn
            }
            {
              name: 'DB_POSTGRESDB_PORT'
              value: '5432'
            }
            {
              name: 'DB_POSTGRESDB_USER'
              value: postgresAdminUsername
            }
            {
              name: 'DB_POSTGRESDB_PASSWORD'
              value: postgresAdminPassword
            }
            {
              name: 'DB_POSTGRESDB_SSL_ENABLED'
              value: 'true'
            }
            {
              name: 'N8N_ENCRYPTION_KEY'
              secretRef: 'encryption-key'
            }
            {
              name: 'N8N_PORT'
              value: string(port)
            }
            {
              name: 'N8N_PROTOCOL'
              value: 'https'
            }
            {
              name: 'NODE_ENV'
              value: 'production'
            }
            {
              name: 'N8N_RUNNERS_ENABLED'
              value: 'true'
            }
            {
              name: 'WEBHOOK_URL'
              value: 'https://${name}.${reference(containerAppEnvironmentId, '2023-05-01').defaultDomain}'
            }
            {
              name: 'GENERIC_TIMEZONE'
              value: 'UTC'
            }
          ]
        }
      ]
      scale: {
        minReplicas: minReplicas
        maxReplicas: maxReplicas
        rules: [
          {
            name: 'http-rule'
            custom: {
              type: 'http'
              metadata: {
                concurrentRequests: '10'
              }
            }
          }
          {
            name: 'azure-http'
            http: {
              metadata: {
                concurrentRequests: '100'
              }
            }
          }
        ]
      }
    }
  }
}

output id string = containerApp.id
output name string = containerApp.name
output fqdn string = ingressEnabled && ingressTrafficType == 'external'
  ? containerApp.properties.configuration.ingress.fqdn
  : ''
output url string = ingressEnabled && ingressTrafficType == 'external'
  ? 'https://${containerApp.properties.configuration.ingress.fqdn}'
  : ''
