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

                // TODO : I'm sure there's a better way of composing this, but I don't know C# or CosmosDB well enough...

                var options = new FeedOptions { EnableCrossPartitionQuery = true }; // Enable cross partition query

                // First get the session
                string sessionId = req.Query["session_id"]; 
                Uri sessionsUri = UriFactory.CreateDocumentCollectionUri(databaseId: "ButtonDeviceSessions", collectionId: "ButtonDeviceSessions");

                IDocumentQuery<ButtonDeviceSession> sessionQuery = client.CreateDocumentQuery<ButtonDeviceSession>(sessionsUri, options)
                                                    .Where(session => session.session_id == sessionId)
                                                    .AsDocumentQuery();

                ButtonDeviceSession buttonSession = null;
            
                while (sessionQuery.HasMoreResults)
                {
                    foreach (ButtonDeviceSession nextButtonDeviceSession in await sessionQuery.ExecuteNextAsync())
                    {
                        buttonSession = nextButtonDeviceSession;
                    }
                }                       


                // Then get the events
                Uri eventsUri = UriFactory.CreateDocumentCollectionUri(databaseId: "ButtonDeviceSessions", collectionId: "ButtonDeviceEvents");
                var buttonDeviceEvents = new List<ButtonDeviceEvent>();

                IDocumentQuery<ButtonDeviceEvent> query = client.CreateDocumentQuery<ButtonDeviceEvent>(eventsUri, options)
                                                    .Where( evt => evt.device_id == buttonSession.device_id 
                                                            && evt.start_time >= buttonSession.start_time 
                                                            && evt.end_time <= buttonSession.end_time
                                                          )
                                                    .AsDocumentQuery();
            
            
                while (query.HasMoreResults)
                {
                    foreach (ButtonDeviceEvent nextEvent in await query.ExecuteNextAsync())
                    {
                        if(nextEvent != null)
                            buttonDeviceEvents.Add(nextEvent);
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
}
