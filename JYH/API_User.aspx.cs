using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Configuration;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using com.hjy.fan.BusinessLayer.JYHAPI;
using com.hjy.fan.FrameWork;

namespace com.hjy.fan.WebTouch.JYH
{
    public partial class API_User : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string outString = "";
            try
            {
                RequestBLL.Request_Common(Request["api_target"], Request["api_input"], Request["api_token"], ConfigurationManager.AppSettings["JYHAPI_url_account"], out outString);
            }
            catch (Exception ex)
            {

            }
            Response.Write(outString);
        }
    }
}