using './main.bicep'

param namePrefix = 'agentrc'
param enableSharing = true
param enableAppInsights = true
param containerStartupStrategy = 'scale-to-zero'
param tags = {
  application: 'agentrc-webapp'
  managedBy: 'bicep'
  environment: 'production'
}
