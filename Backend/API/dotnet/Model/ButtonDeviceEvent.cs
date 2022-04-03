namespace AutismHack.Backend.API.Model 
{
    public class ButtonDeviceEvent
    {
        public string event_id { get; set; }
        public int device_id { get; set; }
        public int button_id { get; set; }
        public int start_time { get; set; }
        public int end_time { get; set; }
    }
}