using ABA_Therapy_Tracker.Services;
using ABA_Therapy_Tracker.Views;
using System;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace ABA_Therapy_Tracker
{
    public partial class App : Application
    {

        public App()
        {
            InitializeComponent();

            DependencyService.Register<MockDataStore>();
            MainPage = new AppShell();
        }

        protected override void OnStart()
        {
        }

        protected override void OnSleep()
        {
        }

        protected override void OnResume()
        {
        }
    }
}
