/**
 *
 * Please note:
 * This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * Do not edit this file manually.
 *
 */

@file:Suppress(
    "ArrayInDataClass",
    "EnumEntryName",
    "RemoveRedundantQualifierName",
    "UnusedImport"
)

package org.openapitools.client.models


import com.squareup.moshi.Json

/**
 * 
 *
 * @param patientId 
 * @param surname 
 * @param firstName 
 */


data class Patient (

    @Json(name = "patientId")
    val patientId: java.math.BigDecimal,

    @Json(name = "surname")
    val surname: kotlin.String,

    @Json(name = "firstName")
    val firstName: kotlin.String? = null

)
