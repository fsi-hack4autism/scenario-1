using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebUI.Api;
using WebUI.Models;

namespace WebUI.Mock
{
    public class PatientApiMock : IPatientApi
    {
        public async Task<List<Patient>> GetPatients()
        {
            return await Task.FromResult(new List<Patient>
            {
                new Patient()
                {
                    Id = "1",
                    Name = "Joe",
                    Address = "Hong Kong"
                }
            });
        }
    }
}
