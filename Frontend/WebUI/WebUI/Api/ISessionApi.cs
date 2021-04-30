using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebUI.Models;

namespace WebUI.Api
{
    public interface ISessionApi
    {
        public Task<List<Session>> GetSessions();

        public Task SaveSession(Session session);

    }
}
