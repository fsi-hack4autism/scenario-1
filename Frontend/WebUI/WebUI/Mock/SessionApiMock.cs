using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebUI.Api;
using WebUI.Models;

namespace WebUI.Mock
{
    public class SessionApiMock : ISessionApi
    {
        // Just for mock so we can see result from save, shouldn't be used elsewhere
        private readonly static List<Session> sessions = new List<Session>()
        {
            new Session()
                {
                    Id = "1",
                    Title = "First Appointment",
                    PatientId = "1",
                    PatientName = "Joe",
                    StartDate = DateTime.Today.AddDays(-2),
                    EndDate = DateTime.Today.AddDays(-2).AddHours(-2)
                }
        };

        public async Task<List<Session>> GetSessions()
        {
            return await Task.FromResult(sessions);
        }

        public async Task SaveSession(Session session)
        {
            session.Id = Guid.NewGuid().ToString();
            sessions.Add(session);
            await Task.Delay(200);
        }
    }
}
