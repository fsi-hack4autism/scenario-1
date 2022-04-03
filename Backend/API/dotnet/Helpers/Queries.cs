using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using AutismHack.Backend.API.Model;

namespace AutismHack.Backend.API.Helpers
{
    public static class Queries 
    {
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

        public static async Task<IList<T>> ExecuteQuery<T>(IDocumentQuery<T> query)
        {
            var result = new List<T>();

            while (query.HasMoreResults)
            {
                foreach (T patient in await query.ExecuteNextAsync())
                {
                    result.Add(patient);
                }
            }       

            return result;
        }
    }
}