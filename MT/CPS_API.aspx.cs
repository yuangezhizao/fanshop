using System;
using System.Configuration;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using com.hjy.fan.FrameWork;
using com.hjy.fan.EntityFacade;
using com.hjy.fan.BusinessLayer;

namespace com.hjy.fan.WebTouch.MT
{
    public partial class CPS_API : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["MerchantID_HJY"] != null)
            {
                if (ConfigurationManager.AppSettings["mt_id"] == Session["MerchantID_HJY"].ToString())
                {
                    string script = "";
                    StringBuilder url = new StringBuilder();
                    //http://api.malltang.com/notify/familyhas_simple.ashx?pushcontent={"mt_umobile":"18203516266","productcode":"104596321","orderinfo":{"orderno":"1511211535021512586","moneypay":"102.06","express_name":"陈少华","express_mobile":"18203516266","express_address":"山西省太原市小店区长风街南一巷17 号佳境花园","ispay":"1"}}
                    switch (Request["action"])
                    {
                        case "merchant_order":
                            string WebUrl = "http://api.malltang.com/notify/familyhas_simple.ashx";
                            string errMsg = "";
                            url.Append("&pushcontent={");
                            url.Append("\"mt_umobile\":\"" + Session["UserName"].ToString() + "\",");
                            url.Append("\"productcode\":\"" + Request["productcode"] + "\",");
                            url.Append("\"orderinfo\":{\"orderno\":\"" + Request["orderno"] + "\",");
                            url.Append("\"moneypay\":\"" + Request["moneypay"] + "\",");
                            url.Append("\"express_name\":\"" + Request["express_name"] + "\",");
                            url.Append("\"express_mobile\":\"" + Request["express_mobile"] + "\",");
                            url.Append("\"express_address\":\"" + Request["express_address"] + "\",");
                            url.Append("\"paymethod\":\"" + Request["paymethod"] + "\",");
                            url.Append("\"ispay\":\"" + Request["ispay"] + "\"}}");
                            string aa = Utils.GetPageContent(WebUrl, url.ToString(), "utf-8", "Post", false, out errMsg);
                          //  LoginBLL.WriteMemLog(EnumLogType.ChangeLoginPassword, EnumClientType.WebTouch, EnumLogStatus.Fail, Session["UserName"].ToString(), Request["paymethod"], aa);
                            break;
                    }
                    Response.Write(script);
                }
            }
        }
    }
}