provider "azurerm" {
  features {}
}

terraform {
  backend "azurerm" {
    resource_group_name  = "terraform-state-rg"
    storage_account_name = "fsihack21terraformstate"
    container_name       = "terraform-state"
    key                  = "terraform.tfstate"
  }
}

resource "azurerm_resource_group" "hackathon-rg" {
    name = "hackathon-rg" 
    location = var.location
    tags = var.tags
}

resource "azurerm_iotcentral_application" "iotcentral" {
    name                = "hackathon-iotcentral-app"
    resource_group_name = azurerm_resource_group.hackathon-rg.name
    location            = var.location
    sub_domain          = "iothackathon"

    display_name = "hackathon-iotcentral-app"
    sku          = "ST1"
    #template     = "custom"
        
    tags = var.tags
}

resource "azurerm_iothub" "iothub" {
    name                = "iothubhackathon"
    resource_group_name = azurerm_resource_group.hackathon-rg.name
    location            = var.location

    sku {
        name     = "F1"
        capacity = 1
    }

}

resource "azurerm_eventhub_namespace" "eventhub-namespace" {
    name                = "eventhub-hackathon-namespace"
    location            = var.location
    resource_group_name = azurerm_resource_group.hackathon-rg.name
    sku                 = "Standard"
    capacity            = 1

}

resource "azurerm_eventhub" "eventhub" {
    name                = "eventhub-hackathon"
    namespace_name      = azurerm_eventhub_namespace.eventhub-namespace.name
    resource_group_name = azurerm_resource_group.hackathon-rg.name
    partition_count     = 2
    message_retention   = 1
}

resource "azurerm_storage_account" "function-storage" {
  name                     = "iothackathonstorage"
  resource_group_name      = azurerm_resource_group.hackathon-rg.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_app_service_plan" "function-asp" {
  name                = "hackathon-function-asp"
  location            = var.location
  resource_group_name = azurerm_resource_group.hackathon-rg.name

  sku {
    tier = "Free"
    size = "F1"
  }

}

resource "azurerm_function_app" "function" {
  name                       = "hackathon-function-iot-2021"
  location                   = var.location
  resource_group_name        = azurerm_resource_group.hackathon-rg.name
  app_service_plan_id        = azurerm_app_service_plan.function-asp.id
  storage_account_name       = azurerm_storage_account.function-storage.name
  storage_account_access_key = azurerm_storage_account.function-storage.primary_access_key
}

resource "azurerm_api_management" "api-mgmt" {
  name                = "hackathon-apim"
  location            = var.location
  resource_group_name = azurerm_resource_group.hackathon-rg.name
  publisher_name      = "Microsoft Hackathon"
  publisher_email     = "pvandenderen@microsoft.com"

  sku_name = "Developer_1"

  policy {
    xml_content = <<XML
    <policies>
      <inbound />
      <backend />
      <outbound />
      <on-error />
    </policies>
    XML

  }
}

resource "azurerm_cosmosdb_account" "cosmos-db" {
  name                = "hackathon-cosmos-db"
  location            = var.location
  resource_group_name = azurerm_resource_group.hackathon-rg.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  enable_automatic_failover = false

#  capabilities {
#    name = "EnableAggregationPipeline"
#  }

#  capabilities {
#    name = "mongoEnableDocLevelTTL"
#  }

#  capabilities {
#    name = "MongoDBv3.4"
#  }

  consistency_policy {
    consistency_level       = "Eventual"
    max_interval_in_seconds = 10
    max_staleness_prefix    = 200
  }

  geo_location {
    location          = "eastus"
    failover_priority = 1
  }

  geo_location {
    location          = var.location
    failover_priority = 0
  }
}

resource "azurerm_stream_analytics_job" "stream-analytics" {
  name                                     = "hackathon-stream-analytics"
  resource_group_name                      = azurerm_resource_group.hackathon-rg.name
  location                                 = var.location
  compatibility_level                      = "1.1"
  events_late_arrival_max_delay_in_seconds = 60
  events_out_of_order_max_delay_in_seconds = 50
  events_out_of_order_policy               = "Adjust"
  output_error_policy                      = "Drop"
  streaming_units                          = 3

  transformation_query = <<QUERY
    SELECT 
    I1.device_id,I2.StudentName,I2.TherapistName,I2.StartDateTime,I2.EndDateTime
    ,I1.value
    ,GetRecordPropertyValue(I2.Configuration.ConfigurationKVPair, UPPER(I1.value))
    --,I2.Configuration.ConfigurationName
    --,I2.Configuration.ConfigurationKVPair
    INTO
    MyFirst
    FROM TherapyEvents I1 TIMESTAMP BY I1.timestamp
    LEFT JOIN TestRef1 I2 ON I1.device_id = I2.Configuration.DeviceId
    --WHERE I1.timestamp='2020-05-21 14:55:02.059121'
    QUERY

}