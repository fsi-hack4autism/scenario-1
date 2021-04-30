using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;

namespace AutismHack.Backend.API
{
    public static class GetSessionsForSubject
    {
        [FunctionName("GetSessionsForPatient")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            [CosmosDB(ConnectionStringSetting = "hackathonCosmosDbConnection")] DocumentClient client,
            ILogger log)
        {
            try 
            {
                log.LogInformation("C# HTTP trigger function processed a request.");

                // TODO : I'm sure there's a better way of composing this, but I don't know C# or CosmosDB well enough...

                Uri driverCollectionUri = UriFactory.CreateDocumentCollectionUri(databaseId: "ButtonDeviceSessions", collectionId: "ButtonDeviceSessions");
                var options = new FeedOptions { EnableCrossPartitionQuery = true }; // Enable cross partition query

                // First get the session
                string patientId = req.Query["patient_id"]; 

                IDocumentQuery<ButtonDeviceSession> sessionQuery = client.CreateDocumentQuery<ButtonDeviceSession>(driverCollectionUri, options)
                                                    .Where(session => session.patient_id == patientId)
                                                    .AsDocumentQuery();

                var buttonSessions = new List<ButtonDeviceSession>();
            
                while (sessionQuery.HasMoreResults)
                {
                    foreach (ButtonDeviceSession nextButtonDeviceSession in await sessionQuery.ExecuteNextAsync())
                    {
                        buttonSessions.Add(nextButtonDeviceSession);
                    }
                }                       

                return new OkObjectResult(buttonSessions);
            } catch (Exception e)
            {
                return new ObjectResult(e.ToString())
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
        }
    }
}
