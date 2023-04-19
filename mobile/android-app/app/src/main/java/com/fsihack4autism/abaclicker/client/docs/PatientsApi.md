# PatientsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addPatient**](PatientsApi.md#addPatient) | **POST** /patients | Creates a new patient
[**createObjective**](PatientsApi.md#createObjective) | **POST** /patients/{patientId}/objectives | Creates a new objective for the patient
[**getObjective**](PatientsApi.md#getObjective) | **GET** /patients/{patientId}/objectives/{objectiveId} | Retrieves a patient&#39;s particular objective
[**getObjectives**](PatientsApi.md#getObjectives) | **GET** /patients/{patientId}/objectives | Retrieves a list of all the patient&#39;s current objectives
[**getPatients**](PatientsApi.md#getPatients) | **GET** /patients | Returns a list of patients, ordered by surname, then first name
[**recordObjectiveMetric**](PatientsApi.md#recordObjectiveMetric) | **POST** /patients/{patientId}/objectives/{objectiveId}/record | Records a new count for the patient&#39;s objective


<a name="addPatient"></a>
# **addPatient**
> Patient addPatient(addPatientRequest)

Creates a new patient

### Example
```kotlin
// Import classes:
//import org.openapitools.client.infrastructure.*
//import org.openapitools.client.models.*

val apiInstance = PatientsApi()
val addPatientRequest : AddPatientRequest =  // AddPatientRequest | 
try {
    val result : Patient = apiInstance.addPatient(addPatientRequest)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling PatientsApi#addPatient")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling PatientsApi#addPatient")
    e.printStackTrace()
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **addPatientRequest** | [**AddPatientRequest**](AddPatientRequest.md)|  | [optional]

### Return type

[**Patient**](Patient.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="createObjective"></a>
# **createObjective**
> CreateObjective200Response createObjective(patientId, createObjectiveRequest)

Creates a new objective for the patient

### Example
```kotlin
// Import classes:
//import org.openapitools.client.infrastructure.*
//import org.openapitools.client.models.*

val apiInstance = PatientsApi()
val patientId : java.math.BigDecimal = 8.14 // java.math.BigDecimal | 
val createObjectiveRequest : CreateObjectiveRequest =  // CreateObjectiveRequest | 
try {
    val result : CreateObjective200Response = apiInstance.createObjective(patientId, createObjectiveRequest)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling PatientsApi#createObjective")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling PatientsApi#createObjective")
    e.printStackTrace()
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **patientId** | **java.math.BigDecimal**|  |
 **createObjectiveRequest** | [**CreateObjectiveRequest**](CreateObjectiveRequest.md)|  | [optional]

### Return type

[**CreateObjective200Response**](CreateObjective200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getObjective"></a>
# **getObjective**
> CreateObjective200Response getObjective(patientId, objectiveId)

Retrieves a patient&#39;s particular objective

### Example
```kotlin
// Import classes:
//import org.openapitools.client.infrastructure.*
//import org.openapitools.client.models.*

val apiInstance = PatientsApi()
val patientId : java.math.BigDecimal = 8.14 // java.math.BigDecimal | 
val objectiveId : java.math.BigDecimal = 8.14 // java.math.BigDecimal | 
try {
    val result : CreateObjective200Response = apiInstance.getObjective(patientId, objectiveId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling PatientsApi#getObjective")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling PatientsApi#getObjective")
    e.printStackTrace()
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **patientId** | **java.math.BigDecimal**|  |
 **objectiveId** | **java.math.BigDecimal**|  |

### Return type

[**CreateObjective200Response**](CreateObjective200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getObjectives"></a>
# **getObjectives**
> GetObjectives200Response getObjectives(patientId)

Retrieves a list of all the patient&#39;s current objectives

### Example
```kotlin
// Import classes:
//import org.openapitools.client.infrastructure.*
//import org.openapitools.client.models.*

val apiInstance = PatientsApi()
val patientId : java.math.BigDecimal = 8.14 // java.math.BigDecimal | 
try {
    val result : GetObjectives200Response = apiInstance.getObjectives(patientId)
    println(result)
} catch (e: ClientException) {
    println("4xx response calling PatientsApi#getObjectives")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling PatientsApi#getObjectives")
    e.printStackTrace()
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **patientId** | **java.math.BigDecimal**|  |

### Return type

[**GetObjectives200Response**](GetObjectives200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getPatients"></a>
# **getPatients**
> GetPatients200Response getPatients()

Returns a list of patients, ordered by surname, then first name

### Example
```kotlin
// Import classes:
//import org.openapitools.client.infrastructure.*
//import org.openapitools.client.models.*

val apiInstance = PatientsApi()
try {
    val result : GetPatients200Response = apiInstance.getPatients()
    println(result)
} catch (e: ClientException) {
    println("4xx response calling PatientsApi#getPatients")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling PatientsApi#getPatients")
    e.printStackTrace()
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**GetPatients200Response**](GetPatients200Response.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="recordObjectiveMetric"></a>
# **recordObjectiveMetric**
> recordObjectiveMetric(patientId, objectiveId, recordObjectiveMetricRequest)

Records a new count for the patient&#39;s objective

### Example
```kotlin
// Import classes:
//import org.openapitools.client.infrastructure.*
//import org.openapitools.client.models.*

val apiInstance = PatientsApi()
val patientId : java.math.BigDecimal = 8.14 // java.math.BigDecimal | 
val objectiveId : java.math.BigDecimal = 8.14 // java.math.BigDecimal | 
val recordObjectiveMetricRequest : RecordObjectiveMetricRequest =  // RecordObjectiveMetricRequest | 
try {
    apiInstance.recordObjectiveMetric(patientId, objectiveId, recordObjectiveMetricRequest)
} catch (e: ClientException) {
    println("4xx response calling PatientsApi#recordObjectiveMetric")
    e.printStackTrace()
} catch (e: ServerException) {
    println("5xx response calling PatientsApi#recordObjectiveMetric")
    e.printStackTrace()
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **patientId** | **java.math.BigDecimal**|  |
 **objectiveId** | **java.math.BigDecimal**|  |
 **recordObjectiveMetricRequest** | [**RecordObjectiveMetricRequest**](RecordObjectiveMetricRequest.md)|  | [optional]

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

