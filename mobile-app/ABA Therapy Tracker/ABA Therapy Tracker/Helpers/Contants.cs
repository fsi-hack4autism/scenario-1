using System;
namespace ABA_Therapy_Tracker.Helpers
{
    public static class Contants
    {
        public const string webApiUrl = "https://autismhackathon2021apinet3.azurewebsites.net/api/";
        public const string getSessionsApi = "/v1/session/";
        public const string postSessionsApi = "/v1/sessions";
        public const string getPatientsApi = "/v1/patients";
        public const string getBehaviorsApi = "/v1/behaviors";
        public const string startSessionsApi = "v1/events/start?sessionId=";
        public const string endSessionsApi = "v1/events/end?sessionId=";
    }
}
