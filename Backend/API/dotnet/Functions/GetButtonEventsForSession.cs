using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using AutismHack.Backend.API.Helpers;
using AutismHack.Backend.API.Model;

namespace AutismHack.Backend.API.Functions
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

                string sessionId = req.Query["session_id"];


                if (String.IsNullOrEmpty(sessionId))
                {
                    return new BadRequestResult();
                }

                var buttonSession = await Queries.GetSession(sessionId, client, log);
                if (buttonSession == null)
                {
                    return new NotFoundResult();
                }

                // Then get the events
                var options = new FeedOptions { EnableCrossPartitionQuery = true }; // Enable cross partition query
                Uri eventsUri = UriFactory.CreateDocumentCollectionUri(databaseId: "ButtonDeviceSessions", collectionId: "ButtonDeviceEvents");

                var sessionStartLinuxTime = ToLinuxTimeStamp(buttonSession.start_time);
                log.LogInformation("sessionStartLinuxTime: " + sessionStartLinuxTime);
                var sessionEndLinuxTime = ToLinuxTimeStamp(buttonSession.end_time);
                log.LogInformation("sessionStartLinuxTime: " + sessionEndLinuxTime);

                IDocumentQuery<ButtonDeviceEvent> query = client.CreateDocumentQuery<ButtonDeviceEvent>(eventsUri, options)
                                                    .Where(evt => evt.device_id == buttonSession.device_id
                                                            && evt.start_time >= sessionStartLinuxTime
                                                            && evt.end_time <= sessionEndLinuxTime
                                                        )
                                                    .AsDocumentQuery();

                var result = await Queries.ExecuteQuery<ButtonDeviceEvent>(query);
                return new OkObjectResult(result);
            }
            catch (Exception e)
            {
                return new ObjectResult(e.ToString())
                {
                    StatusCode = StatusCodes.Status500InternalServerError
                };
            }
        }

        private static int ToLinuxTimeStamp(DateTime datetime)
        {
            return (int)(datetime.Subtract(new DateTime(1970, 1, 1))).TotalSeconds;                        
        }

        private static DateTime FromLinuxTimeStamp(long timestamp)
        {
            System.DateTime dtDateTime = new DateTime(1970,1,1,0,0,0,0,System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(timestamp).ToLocalTime();
            return dtDateTime;
        }
    }
}
