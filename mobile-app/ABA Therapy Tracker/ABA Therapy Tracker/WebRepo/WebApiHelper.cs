using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Net.Http;
using ABA_Therapy_Tracker.Helpers;
using ABA_Therapy_Tracker.Models;
using ABA_Therapy_Tracker.ViewModels.Tracking;
using Newtonsoft.Json;

namespace ABA_Therapy_Tracker.WebRepo
{
    public class WebApiHelper
    {
        System.Net.Http.HttpClient client;

        public ObservableCollection<Session> sessions;

        public string WebAPIUrl
        {
            get; private set;
        }

        public WebApiHelper()
        {
            client = new System.Net.Http.HttpClient();
        }

        #region Session Methods
        public async System.Threading.Tasks.Task<Session> GetSessionAsync(string sessionId)
        {
            WebAPIUrl = Contants.webApiUrl + Contants.getSessionsApi + sessionId; 
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
            WebAPIUrl = Contants.webApiUrl + Contants.postSessionsApi; 
            var uri = new Uri(WebAPIUrl);
            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(new {
                    id = session.Id,
                    start = session.Start,
                    therapistId = session.TherapistId,
                    patientId = session.PatientId
                }), encoding: System.Text.Encoding.UTF8, "application/json");

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

        public async System.Threading.Tasks.Task<String> StartSessionAsync(createSessionRequest session)
        {
            WebAPIUrl = Contants.webApiUrl + Contants.startSessionsApi + session.Id;
            var uri = new Uri(WebAPIUrl);
            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(new
                {
                    id = session.Id,
                    sessionId = session.Id,
                    behaviorId = session.BehaviorId,
                    time = session.Time
                }), encoding: System.Text.Encoding.UTF8, "application/json");

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

        public async System.Threading.Tasks.Task<String> StopSessionAsync(endSessionRequest session)
        {
            WebAPIUrl = Contants.webApiUrl + Contants.startSessionsApi + session.Id;
            var uri = new Uri(WebAPIUrl);
            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(new
                {
                    id = session.Id,
                    sessionId = session.Id,
                    time = session.Time
                }), encoding: System.Text.Encoding.UTF8, "application/json");

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

        #region Patient Methods
        public async System.Threading.Tasks.Task<List<Patient>> GetPatientsAsync()
        {
            WebAPIUrl = Contants.webApiUrl + Contants.getPatientsApi; // Set your REST API url here
            var uri = new Uri(WebAPIUrl);
            try
            {
                var response = await client.GetAsync(uri);

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var patients = JsonConvert.DeserializeObject<List<Patient>>(content);
                    return patients;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return null;
        }
        #endregion
    }
}
