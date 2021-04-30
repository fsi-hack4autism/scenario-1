using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebUI.Models
{
    public class Session
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string PatientId { get; set; }
        public string PatientName { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
