using System;
using System.Configuration;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using com.hjy.fan.EntityFacade;
using com.hjy.fan.FrameWork;
using com.hjy.fan.BusinessLayer.JYHAPI;
using com.hjy.fan.BusinessLayer;

namespace com.hjy.fan.WebTouch
{
    public partial class group : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                GetPage();
            }
        }
        protected void GetPage()
        {

             
            if (Request["from"]!= ConfigurationManager.AppSettings["mt_id"])
            {
                if (Request["act"] == "p" || Request["act"] == "c" || (!string.IsNullOrEmpty(Request["app_version"])))
                {
                    Session["group_key"] = Request["from"];
                }
                Session["group_back"] = Request["from"];
            }
            new LoginBLL().CheckLoginAPI(Request["mobile"], "999999");
            string param_wxPhone = "", param_fromshare = "";
            if (!string.IsNullOrEmpty(Request["wxPhone"]))
            {
                if (ValidateHelper.IsMobile(Request["wxPhone"]))
                {
                    param_wxPhone = "&wxPhone=" + StringHelper.base64encode(Request["wxPhone"]);
                }
            }
            StringBuilder paramStr = new StringBuilder();
            foreach (string key in Request.QueryString.Keys)
            {
                if (key.ToLower()!="act")
                {
                    if (key.ToLower() != "wxphone")
                    {
                        paramStr.AppendFormat("&{0}={1}", key, Request.QueryString[key]);
                    }
                    else
                    {
                        paramStr.AppendFormat("&{0}={1}", key, StringHelper.base64encode(Request.QueryString[key]));
                    }
                }

            }
            if (Request["act"]!="p"&& (!string.IsNullOrEmpty(Request["app_version"])))
            {
                paramStr.AppendFormat("&Title={0}", INITools.GetIniKeyValue("Group", "acttitle_" + Request["act"]));
            }
            Response.Redirect(INITools.GetIniKeyValue("Group", "actpage_"+ Request["act"])+ "?t=" + RandHelper.Next(10000000, 99999999).ToString()+ paramStr,true);

            //switch (Request["act"])
            //{
            //    case "p":
                    
            //        Response.Redirect("Product_Detail.html?pid=" + Request["pid"] + "&t=" + RandHelper.Next(10000000, 99999999).ToString() + "&from=" + Request["from"].ToString() + param_fromshare + param_wxPhone);

            //        break;
            //    case "c":
            //        Response.Redirect("Category.html?t=" + RandHelper.Next(10000000, 99999999).ToString() + "&from=" + Request["from"].ToString());
            //        break;

            //}
            
        }
    }
}