using System;
using System.Collections.ObjectModel;
using System.Net.Http;
using ABA_Therapy_Tracker.Helpers;
using ABA_Therapy_Tracker.Models;
using Newtonsoft.Json;

namespace ABA_Therapy_Tracker.WebRepo
{
    public class WebRepo
    {
        System.Net.Http.HttpClient client;

        public ObservableCollection<Session> sessions;

        public string WebAPIUrl
        {
            get; private set;
        }

        public WebRepo()
        {
            client = new System.Net.Http.HttpClient();
        }

        #region Methods
        public async System.Threading.Tasks.Task<Session> GetSessionAsync(string sessionId)
        {
            WebAPIUrl = Contants.webApiUrl + Contants.getSessionsApi + sessionId; // Set your REST API url here
            var uri = new Uri(WebAPIUrl);
            try
            {
                var response = await client.GetAsync(uri);

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var session = JsonConvert.DeserializeObject<Session>(content);
                    return session;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return null;
        }

        public async System.Threading.Tasks.Task<String> PostSessionAsync(Session session)
        {
            WebAPIUrl = Contants.webApiUrl + Contants.postSessionsApi; // Set your REST API url here
            var uri = new Uri(WebAPIUrl);
            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(new {
                    id = session.Id,
                    start = session.Start,
                    therapistId = session.TherapistId,
                    patientId = session.PatientId
                }));

                var result = await client.PostAsync(uri, content);

                if (result.IsSuccessStatusCode)
                {
                    return await result.Content.ReadAsStringAsync();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return "";
        }
        #endregion
    }
}
