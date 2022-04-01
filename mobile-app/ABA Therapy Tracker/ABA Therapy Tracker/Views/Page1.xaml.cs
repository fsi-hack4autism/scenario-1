using ABA_Therapy_Tracker.ViewModels.Tracking;
using ABA_Therapy_Tracker.WebRepo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace ABA_Therapy_Tracker.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class Page1 : ContentPage
    {
        private FakeApiHelper _webApiHelper = new FakeApiHelper();

        public List<Patient> Patients { get; set; }

        public Page1()
        {
            InitializeComponent();

            LoadPatientsAsync();
        }

        private async void LoadPatientsAsync()
        {
            Patients = await _webApiHelper.GetPatientsAsync();
        }
    }
}