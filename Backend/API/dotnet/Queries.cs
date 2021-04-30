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
    public static class Queries {
         public static async Task<ButtonDeviceSession> GetSession(string sessionId, DocumentClient client, ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            var options = new FeedOptions { EnableCrossPartitionQuery = true }; // Enable cross partition query
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

            return buttonSession;
        }
    }
}