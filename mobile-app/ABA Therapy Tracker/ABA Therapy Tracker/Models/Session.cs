using System;
namespace ABA_Therapy_Tracker.Models
{
    public class Session
    {
        public string Id { get; set; }
        public string Start { get; set; }
        public string PatientId { get; set; }
        public string TherapistId { get; set; }
    }

    public class createSessionRequest {
        public string Id { get; set; }
        public string BehaviorId { get; set; }
        public string Time { get; set; }
    }

    public class endSessionRequest
    {
        public string Id { get; set; }
        public string Time { get; set; }
    }
}
