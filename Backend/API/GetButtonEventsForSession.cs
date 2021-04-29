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

namespace AutismHackathon2021.ButtonSessionAPI
{
    public static class GetButtonEventsForSession
    {
        [FunctionName("GetButtonEventsForSession")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            [CosmosDB(ConnectionStringSetting = "hackathonCosmosDbConnection")] DocumentClient client,
            ILogger log)
        {
            try 
            {
                log.LogInformation("C# HTTP trigger function processed a request.");
                

                string eventId = req.Query["id"]; 
            
                Uri driverCollectionUri = UriFactory.CreateDocumentCollectionUri(databaseId: "ButtonDeviceSessions", collectionId: "ButtonDeviceEvents");
            
                var options = new FeedOptions { EnableCrossPartitionQuery = true }; // Enable cross partition query
            
                IDocumentQuery<ButtonDeviceEvent> query = client.CreateDocumentQuery<ButtonDeviceEvent>(driverCollectionUri, options)
                                                    .Where(evt => evt.event_id == eventId)
                                                    .AsDocumentQuery();
            
                var buttonDeviceEvents = new List<ButtonDeviceEvent>();
            
                while (query.HasMoreResults)
                {
                    foreach (ButtonDeviceEvent buttonDeviceEvent in await query.ExecuteNextAsync())
                    {
                        buttonDeviceEvents.Add(buttonDeviceEvent);
                    }
                }                       
            
                return new OkObjectResult(buttonDeviceEvents);
            } catch (Exception e)
            {
                return new OkObjectResult(e.ToString());
                throw;
            }
        }
    }

    public class ButtonDeviceEvent
    {
        public string event_id { get; set; }
        public string device_id { get; set; }
        public string button_id { get; set; }
        public string start_time { get; set; }
        public string end_time { get; set; }
    }
}
