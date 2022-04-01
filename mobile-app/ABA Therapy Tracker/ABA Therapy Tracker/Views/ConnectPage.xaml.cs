using Plugin.BluetoothLE;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace ABA_Therapy_Tracker.Views
{
    public partial class ConnectPage : ContentPage
    {
        public ConnectPage()
        {
            InitializeComponent();
            CrossBleAdapter.Current.Scan(new ScanConfig() { ServiceUuids = new List<Guid>() { new Guid("00afbae4-0000-4233-bb16-1e3500152342") } }).Subscribe(scanResult => {
                scanResult.Device.Connect();

                scanResult.Device.WhenAnyCharacteristicDiscovered().Subscribe(characteristic => {
                    // read, write, or subscribe to notifications here
                    var result = characteristic.Read(); // use result.Data to see response
                    //characteristic.Write(bytes);

                    characteristic.EnableNotifications();
                    characteristic.WhenNotificationReceived().Subscribe(notification => {
                        //result.Data to get at response
                    });
                });
            });
        }
    }
}