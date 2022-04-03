using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Documents.Client;
using AutismHack.Backend.API.Helpers;

namespace AutismHack.Backend.API.Functions
{
    public static class EndSession
    {
        [FunctionName("EndSession")]
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

                buttonSession.end_time = DateTime.Now;

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
