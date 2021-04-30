using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebUI.Api;
using WebUI.Models;

namespace WebUI.Mock
{
    public class DeviceApiMock : IDeviceApi
    {
        public async Task<List<Device>> GetDevices()
        {
            return await Task.FromResult(new List<Device>
            {
                new Device()
                {
                    Id = "1",
                    Name = "Test Device"
                }
            });
        }
    }
}
