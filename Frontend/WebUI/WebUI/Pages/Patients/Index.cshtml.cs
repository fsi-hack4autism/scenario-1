using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using WebUI.Api;
using WebUI.Models;

namespace WebUI.Pages.Patients
{
    public class ViewModel : PageModel
    {

        public List<Patient> Patients { get; set; }

        private readonly IPatientApi patientApi;

        public ViewModel(IPatientApi patientApi)
        {
            this.patientApi = patientApi;
        }

        public async Task OnGetAsync()
        {
            Patients = await patientApi.GetPatients();
        }
    }
}
