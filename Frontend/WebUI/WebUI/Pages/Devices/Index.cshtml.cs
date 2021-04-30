using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using WebUI.Api;
using WebUI.Models;

namespace WebUI.Pages.Devices
{
    public class ViewModel : PageModel
    {
        public List<Device> Devices { get; set; }

        private readonly IDeviceApi deviceApi;

        public ViewModel(IDeviceApi deviceApi)
        {
            this.deviceApi = deviceApi;
        }

        public async Task OnGetAsync()
        {
            Devices = await deviceApi.GetDevices();
        }
    }
}
