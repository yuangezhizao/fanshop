using System;
using System.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using com.hjy.fan.BusinessLayer;
using com.hjy.fan.FrameWork;

namespace com.hjy.fan.WebTouch.Account
{
    public partial class CardOauth : System.Web.UI.Page
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
            string card_key = "";
            string exchangedCode = "";
            string merchantFrom = "";
            ResultPacket rp = Message_TemplateBLL.DealWXCard(rc,out card_id,out card_key, out exchangedCode,out merchantFrom);
            if (rp.IsError)
            {
                Response.Redirect("/index.html",true);
            }
            else
            {
                try
                {
                    Merchant_PageBLL pageBll = new Merchant_PageBLL();
                    pageBll._paramList.Add("action", HttpUtility.UrlDecode("merchant_page"));
                    pageBll._paramList.Add("merchantcode", HttpUtility.UrlDecode(merchantFrom));
                    pageBll._paramList.Add("paramlist", HttpUtility.UrlDecode(""));
                    if (rp.ResultCode == "01")
                    {
                        pageBll._paramList.Add("webpage", HttpUtility.UrlDecode(HttpContext.Current.Request.Url.Host+ "/Act151118/html/exChange1.html"));
                    }
                    if (rp.ResultCode == "02")
                    {
                        pageBll._paramList.Add("webpage", HttpUtility.UrlDecode(HttpContext.Current.Request.Url.Host + "/Account/CardOauth.aspx"));
                    }
                    
                    pageBll.NotifyMerchantApiData();
                }
                catch
                {

                }
                if (rp.ResultCode=="01")
                {
                    Response.Redirect("/Act/default.htm?cardid=" + card_id.ToString()+ "&cardkey=" + card_key + "&exchangedcode=" + exchangedCode + "&from=" + merchantFrom, true);
                }
                if (rp.ResultCode == "02")
                {
                    hidcardid.Value = card_id.ToString();
                    hidcardkey.Value = card_key;
                    hidexchangedcode.Value = exchangedCode;
                    hidmerchant.Value = merchantFrom;
                }
            }
            //处理微摇数据

        }
    }
}