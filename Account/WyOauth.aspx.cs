using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using com.ichsy.jyh.FrameWork;
using com.ichsy.jyh.BusinessLayer;

namespace com.ichsy.jyh.WebTouch.Account
{
    public partial class WyOauth : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //验证参数
            RequestCollection rc = new RequestCollection("utf-8");
            foreach (string key in Request.QueryString.Keys)
            {
                rc.Add(key, Request.QueryString[key]);
            }
            int card_id = 0;
            decimal card_money = 0;
            string exchangedCode = "";
            ResultPacket rp = Message_TemplateBLL.DealWyChange(rc, out card_id);
            if (rp.IsError)
            {
                Response.Redirect("/Act151118/html/exChange1.html", true);
            }
            else
            {
                try
                {
                    Merchant_PageBLL pageBll = new Merchant_PageBLL();
                    pageBll._paramList.Add("action", HttpUtility.UrlDecode("merchant_page"));
                    pageBll._paramList.Add("merchantcode", HttpUtility.UrlDecode(ConfigurationManager.AppSettings["merchant_wxwy"]));
                    pageBll._paramList.Add("paramlist", HttpUtility.UrlDecode(""));
                    if (rp.ResultCode == "01")
                    {
                        pageBll._paramList.Add("webpage", HttpUtility.UrlDecode(HttpContext.Current.Request.Url.Host + "/Act151102/html/exChange1.html"));
                    }
                    if (rp.ResultCode == "02")
                    {
                        pageBll._paramList.Add("webpage", HttpUtility.UrlDecode(HttpContext.Current.Request.Url.Host + "/Account/WyOauth.aspx"));
                    }

                    pageBll.NotifyMerchantApiData();
                }
                catch
                {

                }
                if (rp.ResultCode == "01")
                {
                    Response.Redirect("/Act151102/html/exChange1.html?cardid=" + card_id.ToString(), true);
                }
                if (rp.ResultCode == "02")
                {
                    hidcardid.Value = card_id.ToString();
                }
            }
            //处理微摇数据

        }
    }
}