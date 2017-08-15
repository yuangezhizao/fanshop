using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;
using com.hjy.fan.BusinessLayer;
using com.hjy.fan.EntityFacade;
namespace com.hjy.fan.WebTouch
{
    public class Global : System.Web.HttpApplication
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            //routes.Ignore("{resource}.axd/{*pathInfo}");
            
            List<JYH_Page_Router> list = PageRouterBLL.GetRoutes();
            foreach (JYH_Page_Router route in list)
            {
                RouteValueDictionary rvd_back = new RouteValueDictionary { { "pid", "" }, { "RounterRedirectPath", route.RounterRedirectPath}, { "RounterFrom", route.RounterFrom } };
                routes.MapPageRoute(route.RounterName, route.RounterKey, route.RounterPath, false, rvd_back);
            }
        }
        protected void Application_Start(object sender, EventArgs e)
        {
            RegisterRoutes(RouteTable.Routes);
        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}