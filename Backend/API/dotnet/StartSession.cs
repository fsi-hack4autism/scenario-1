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
    public static class StartSession
    {
        [FunctionName("StartSession")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            [CosmosDB(ConnectionStringSetting = "hackathonCosmosDbConnection")] DocumentClient client,
            ILogger log)
        {
            try 
            {
                log.LogInformation("C# HTTP trigger function processed a request.");

                string sessionId = req.Query["session_id"]; 

                // First get the session
                var buttonSession = await Queries.GetSession(sessionId, client, log);

                buttonSession.start_time = DateTime.Now;

                // Save
                Uri driverCollectionUri = UriFactory.CreateDocumentCollectionUri(databaseId: "ButtonDeviceSessions", collectionId: "ButtonDeviceSessions");
                var options = new FeedOptions { EnableCrossPartitionQuery = true }; // Enable cross partition query

                var response = await client.UpsertDocumentAsync(driverCollectionUri, buttonSession);
                var upserted = response.Resource;

                return new OkObjectResult(upserted);
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
