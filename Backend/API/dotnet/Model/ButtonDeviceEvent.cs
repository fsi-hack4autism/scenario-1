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

namespace AutismHack.Backend.API {
    public class ButtonDeviceEvent
    {
        public string event_id { get; set; }
        public int device_id { get; set; }
        public int button_id { get; set; }
        public int start_time { get; set; }
        public int end_time { get; set; }
    }
}