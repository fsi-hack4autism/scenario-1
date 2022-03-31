using System;
using System.Windows.Input;
using Xamarin.Essentials;
using Xamarin.Forms;

namespace ABA_Therapy_Tracker.ViewModels
{
    public class ConnectViewModel : BaseViewModel
    {
        public ConnectViewModel()
        {
            Title = "Connect";
            OpenWebCommand = new Command(async () => await Browser.OpenAsync("https://aka.ms/xamarin-quickstart"));
        }

        public ICommand OpenWebCommand { get; }
    }
}