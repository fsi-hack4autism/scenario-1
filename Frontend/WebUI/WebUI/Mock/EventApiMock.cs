using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebUI.Api;
using WebUI.Models;

namespace WebUI.Mock
{
    public class EventApiMock : IEventApi
    {
        public async Task<List<Event>> GetEvents()
        {
            return await Task.FromResult(new List<Event>
            {
                new Event()
                {
                    Id = "1",
                    Name = "Test Event"
                }
            });
        }
    }
}
