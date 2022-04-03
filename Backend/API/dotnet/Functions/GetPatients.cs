using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using AutismHack.Backend.API.Model;
using AutismHack.Backend.API.Helpers;

namespace AutismHack.Backend.API.Functions
{
    public static class GetPatients
    {
        [FunctionName("GetPatients")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req, 
            [CosmosDB(ConnectionStringSetting = "hackathonCosmosDbConnection")] DocumentClient client,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            Uri driverCollectionUri = UriFactory.CreateDocumentCollectionUri(databaseId: "ButtonDeviceSessions", collectionId: "Patients");
                var options = new FeedOptions { EnableCrossPartitionQuery = true }; // Enable cross partition query

               
            IDocumentQuery<Patient> sessionQuery = client.CreateDocumentQuery<Patient>(driverCollectionUri, options)
                                                    .AsDocumentQuery();

            var result = await Queries.ExecuteQuery<Patient>(sessionQuery);
            return new OkObjectResult(result);   
        }
    }
}
