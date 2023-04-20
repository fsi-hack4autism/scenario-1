# org.openapitools.client - Kotlin client library for Scenario 1 API

This is the API to the FSI Autism Hackathon Scenario 1, IoT.

## Overview
This API client was generated by the [OpenAPI Generator](https://openapi-generator.tech) project.  By using the [openapi-spec](https://github.com/OAI/OpenAPI-Specification) from a remote server, you can easily generate an API client.

- API version: 1.0.0
- Package version: 
- Build package: org.openapitools.codegen.languages.KotlinClientCodegen

## Requires

* Kotlin 1.7.21
* Gradle 7.5

## Build

First, create the gradle wrapper script:

```
gradle wrapper
```

Then, run:

```
./gradlew check assemble
```

This runs all tests and packages the library.

## Features/Implementation Notes

* Supports JSON inputs/outputs, File inputs, and Form inputs.
* Supports collection formats for query parameters: csv, tsv, ssv, pipes.
* Some Kotlin and Java types are fully qualified to avoid conflicts with types defined in OpenAPI definitions.
* Implementation of ApiClient is intended to reduce method counts, specifically to benefit Android targets.

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *http://localhost*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*PatientsApi* | [**addPatient**](docs/PatientsApi.md#addpatient) | **POST** /patients | Creates a new patient
*PatientsApi* | [**createObjective**](docs/PatientsApi.md#createobjective) | **POST** /patients/{patientId}/objectives | Creates a new objective for the patient
*PatientsApi* | [**getObjective**](docs/PatientsApi.md#getobjective) | **GET** /patients/{patientId}/objectives/{objectiveId} | Retrieves a patient's particular objective
*PatientsApi* | [**getObjectives**](docs/PatientsApi.md#getobjectives) | **GET** /patients/{patientId}/objectives | Retrieves a list of all the patient's current objectives
*PatientsApi* | [**getPatients**](docs/PatientsApi.md#getpatients) | **GET** /patients | Returns a list of patients, ordered by surname, then first name
*PatientsApi* | [**recordObjectiveMetric**](docs/PatientsApi.md#recordobjectivemetric) | **POST** /patients/{patientId}/objectives/{objectiveId}/record | Records a new count for the patient's objective


<a name="documentation-for-models"></a>
## Documentation for Models

 - [org.openapitools.client.models.AddPatientRequest](docs/AddPatientRequest.md)
 - [org.openapitools.client.models.CreateObjective200Response](docs/CreateObjective200Response.md)
 - [org.openapitools.client.models.CreateObjectiveRequest](docs/CreateObjectiveRequest.md)
 - [org.openapitools.client.models.GetObjectives200Response](docs/GetObjectives200Response.md)
 - [org.openapitools.client.models.GetPatients200Response](docs/GetPatients200Response.md)
 - [org.openapitools.client.models.Metric](docs/Metric.md)
 - [org.openapitools.client.models.Objective](docs/Objective.md)
 - [org.openapitools.client.models.Patient](docs/Patient.md)
 - [org.openapitools.client.models.PatientDetails](docs/PatientDetails.md)
 - [org.openapitools.client.models.PatientDetailsAllOf](docs/PatientDetailsAllOf.md)
 - [org.openapitools.client.models.RecordObjectiveMetricRequest](docs/RecordObjectiveMetricRequest.md)
 - [org.openapitools.client.models.User](docs/User.md)


<a name="documentation-for-authorization"></a>
## Documentation for Authorization

All endpoints do not require authorization.