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
        }

        private void connectBLE(object sender, EventArgs e)
        {
        
            ScanConfig scanConfig = new ScanConfig() { ServiceUuids = new List<Guid>() { new Guid("00afbae4-0000-4233-bb16-1e3500152342"),new Guid("a2075c7d-39b2-4750-aede-4bfc485547a2") } };

             CrossBleAdapter.Current.ScanForUniqueDevices().Subscribe(scanResult => {
                 scanResult.Connect();

                scanResult.WhenAnyCharacteristicDiscovered().Subscribe(characteristic => {
                    // read, write, or subscribe to notifications here
                    var result = characteristic.Read(); // use result.Data to see response
                    result.Subscribe(res =>
                    {
                      var DeviceMac = res.Data;
                       var DeviceUUID = res.Characteristic;
                        Console.WriteLine("Result------------", res);

                    });
                    
                    //characteristic.Write(bytes);
                    Console.WriteLine(result);
                    characteristic.EnableNotifications();
                    characteristic.WhenNotificationReceived().Subscribe(notification => {
                        //result.Data to get at response
                    });
                });
                 CrossBleAdapter.Current.StopScan();
            });

        }
    }
}