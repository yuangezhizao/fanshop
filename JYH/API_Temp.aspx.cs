using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using com.hjy.fan.BusinessLayer.JYHAPI;
using com.hjy.fan.FrameWork;

namespace com.hjy.fan.WebTouch.JYH
{
    public partial class API_Temp : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string outString = "";
            try
            {
                RequestBLL.Request_Common_Temp(Request["api_target"], Request["api_input"], Request["api_token"], out outString);
            }
            catch (Exception ex)
            {

            }
            Response.Write(outString);
        }
    }
}