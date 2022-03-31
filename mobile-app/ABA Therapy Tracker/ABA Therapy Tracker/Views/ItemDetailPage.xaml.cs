using ABA_Therapy_Tracker.ViewModels;
using System.ComponentModel;
using Xamarin.Forms;

namespace ABA_Therapy_Tracker.Views
{
    public partial class ItemDetailPage : ContentPage
    {
        public ItemDetailPage()
        {
            InitializeComponent();
            BindingContext = new ItemDetailViewModel();
        }
    }
}