using ABA_Therapy_Tracker.ViewModels.Tracking;
using ABA_Therapy_Tracker.WebRepo;

using System;
using System.Collections.Generic;
using System.Text;

namespace ABA_Therapy_Tracker.ViewModels
{
    public class TrackingViewModel : BaseViewModel
    {
        private FakeApiHelper _webApiHelper = new FakeApiHelper();

        public TrackingViewModel()
        {
            Title = "Tracking";
            LoadPatientsAsync();
        }

        private async void LoadPatientsAsync()
        {
            Patients = await _webApiHelper.GetPatientsAsync();
        }

        List<Patient> patients = new List<Patient>();
        public List<Patient> Patients
        {
            get { return patients; }
            set { SetProperty(ref patients, value); }
        }
    }
}
