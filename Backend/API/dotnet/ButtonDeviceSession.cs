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
    public class ButtonDeviceSession
    {
        public string patient_id {get; set; }
        public string session_id { get; set; }
        public string device_id { get; set; }
        public DateTime start_time { get; set; }
        public DateTime end_time { get; set; }
        // public IDictionary<string,string> semantics { get; set; }
    }
}
