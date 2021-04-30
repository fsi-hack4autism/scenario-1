using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using WebUI.Api;
using WebUI.Models;

namespace WebUI.Pages.Sessions
{
    public class IndexModel : PageModel
    {
        public IList<Session> Sessions { get; set; }

        private readonly ISessionApi sessionApi;
        public IndexModel(ISessionApi sessionApi)
        {
            this.sessionApi = sessionApi;
        }

        public async Task OnGetAsync()
        {
            Sessions = await sessionApi.GetSessions();
        }
    }
}
