using com.hjy.fan.FrameWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace com.hjy.fan.WebTouch.Account
{
    public partial class LoginTo : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string gourl = "/index.html";
            if (Request["key"] != null) {
                string mobile = "";
                double TotalSeconds = 0;
                string mac = "";

                string key = Request["key"].Trim();

                gourl = INITools.GetIniKeyValue("autologinurl", key + "_url") == "" ? "" : INITools.GetIniKeyValue("autologinurl", key + "_url");
                string LoginMD5_key = INITools.GetIniKeyValue("autologinurl", key + "_md5key") == "" ? "" : INITools.GetIniKeyValue("autologinurl", key + "_md5key");

               
                if (LoginMD5_key != "" && gourl!="")
                {
                    //判断登录状态
                    if (Session["UserName"] != null)
                    {
                        mobile = Session["UserName"].ToString();
                    }
                    TimeSpan ts = DateTime.Now - DateTime.Parse("1970-1-1");
                    TotalSeconds = ts.TotalSeconds;

                    //验签码
                    mac = mobile.Trim() + TotalSeconds + LoginMD5_key;
                    mac = DESHelper.Md5(mac);
                    //tiao转连接
                    if (gourl.IndexOf('?') == -1)
                    {
                        gourl += "?p=" + mobile;
                    }
                    else {
                        gourl += "&p=" + mobile; 
                    }
                    gourl += "&tt=" + TotalSeconds.ToString() + "&mac=" + mac+"&hxfrom=web";

                }

            }

            Response.Redirect(gourl);
        }
    }
}