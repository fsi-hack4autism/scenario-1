using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebUI.Models;

namespace WebUI.Api
{
    public interface IDeviceApi
    {
        public Task<List<Device>> GetDevices();
    }
}
