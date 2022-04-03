using System;

namespace AutismHack.Backend.API.Model 
{
    public class ButtonDeviceSession
    {
        public string id { get; set;}
        public string patient_id {get; set; }
        public string session_id { get; set; }
        public int device_id { get; set; }
        public DateTime start_time { get; set; }
        public DateTime end_time { get; set; }

        // This property hasn't been tested. Remove if it causes issues.
        public ButtonMapping button_mappings { get; set; }
    }
}
