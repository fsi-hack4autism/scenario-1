using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using WebUI.Api;
using WebUI.Models;

namespace WebUI.Pages.Sessions
{
    public class NewModel : PageModel
    {
        [BindProperty]
        public Session Session { get; set; }

        public SelectList Patients { get; set; }

        private readonly ISessionApi sessionApi;
        private readonly IPatientApi patientApi;
        public NewModel(ISessionApi sessionApi, IPatientApi patientApi)
        {
            this.sessionApi = sessionApi;
            this.patientApi = patientApi;
        }

        public async Task OnGetAsync()
        {
            var patientsFromApi = await patientApi.GetPatients();

            Patients = new SelectList(patientsFromApi.ToList(), nameof(Patient.Id), nameof(Patient.Name));
        }

        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            await sessionApi.SaveSession(Session);

            return RedirectToPage("./Index");
        }
    }
}
