using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using com.hjy.fan.FrameWork;
namespace com.hjy.fan.WebTouch
{
    public partial class redirect : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            try {
                string pid = Page.RouteData.Values["pid"] == null ? "" : Page.RouteData.Values["pid"].ToString();
                string surl = Page.RouteData.Values["RounterRedirectPath"] == null ? "" : Page.RouteData.Values["RounterRedirectPath"].ToString();
                string sRounterFrom = Page.RouteData.Values["RounterFrom"] == null ? "" : Page.RouteData.Values["RounterFrom"].ToString();
                //http://s.jyh.com/Product_Detail.html?pid=IC_SMG_{0}&t={1}&from={2}
                surl = string.Format(surl, pid, RandNum.GetRandNum(15), sRounterFrom);
                Response.Redirect(surl, false);
            }
            catch(Exception ex)
            {
                Response.Redirect("/", false);
            }
        }
    }
}