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
 * @param description The description of the objective
 * @param type 
 */


data class CreateObjectiveRequest (

    /* The description of the objective */
    @Json(name = "description")
    val description: kotlin.String,

    @Json(name = "type")
    val type: CreateObjectiveRequest.Type

) {

    /**
     * 
     *
     * Values: counter,duration,latency
     */
    enum class Type(val value: kotlin.String) {
        @Json(name = "Counter") counter("Counter"),
        @Json(name = "Duration") duration("Duration"),
        @Json(name = "Latency") latency("Latency");
    }
}

