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
}
