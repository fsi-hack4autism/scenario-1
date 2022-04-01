using ABA_Therapy_Tracker.ViewModels.Tracking;
using System;
using System.Collections.Generic;
using System.Text;

namespace ABA_Therapy_Tracker.WebRepo
{
    public class FakeApiHelper
    {
        public async System.Threading.Tasks.Task<List<Patient>> GetPatientsAsync()
        {
            var patients = new List<Patient>
            {
                new Patient
                {
                    Id = 1,
                    FirstName = "Jeremiah",
                    Surname = "Bullfrog"
                }
            };

            return patients;
        }
    }
}
