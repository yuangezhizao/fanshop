using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using com.hjy.fan.FrameWork;
namespace com.hjy.fan.WebTouch.Account
{
    public partial class OauthLogin : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            RequestCollection rc = new RequestCollection("utf-8");
            if (Request["gobackurlaa"] != null)
            {
                if (Request["gobackurlaa"].ToString() != "")
                {
                    Session["weixinbackgourl"] = StringHelper.base64decode(Request["gobackurlaa"].ToString());
                }
            }
            string oauthtype = Request["oauthtype"] ?? "";
            string returnurl = Request["returnurl"] ?? "";
            string scope = Request["scope"] ?? "f";//授权权限(b为基本,其它为完整(高级))
            string from = Request["from"] ?? "";//从哪里来
            string MerchantKey = INITools.GetIniKeyValue("MessageGateWay", "APIMD5Key");
            string MerchantID = INITools.GetIniKeyValue("MessageGateWay", "MerchantID");
            string ReturlURL = INITools.GetIniKeyValue("MessageGateWay", "ReturlURL");
            if (Request["ispay"]!=null)
            {
                ReturlURL = INITools.GetIniKeyValue("MessageGateWay", "ReturlURL_Pay");
            }
            if (Request["isreg"] != null)
            {
                ReturlURL = INITools.GetIniKeyValue("MessageGateWay", "ReturlURL_Reg");
            }
            string CHNID = INITools.GetIniKeyValue("MessageGateWay", "ChnID");
            rc.Add("merchantid", MerchantID);
            rc.Add("tradetype", "oauth");
            rc.Add("orderno", scope + "~" + from);
            rc.Add("tradetime", DateTime.Now.ToString("yyyyMMddHHmmss"));
            rc.Add("sender", "");
            rc.Add("ChannelID", CHNID);
            if (oauthtype.Trim() == "WeiXin" || oauthtype.Trim() == "QQ" || oauthtype.Trim() == "AliPay" || oauthtype.Trim() == "WeiBo")
            {
                rc.Add("tradecode", oauthtype.Trim());
                rc.Add("CallBackURL", string.Format("{0}{1}", ReturlURL, returnurl == "" ? returnurl : "?returnurl=" + Server.UrlEncode(returnurl)));
               // rc.Add("CallBackURL", string.Format("{0}{1}", ReturlURL, returnurl == "" ? returnurl : "?ru=" + Server.UrlEncode(returnurl)));
            }
            else
            {
                Response.Write("错误的登录类型");
                Response.Redirect("login.aspx");
                return;
            }
            rc.Add("mac", DESHelper.ComputeMD5Hash(GetRequestSignatureSrc(rc, MerchantKey), "utf-8"));
            string gotourl = INITools.GetIniKeyValue("MessageGateWay", "APIUrl") + "?" + rc.ToQueryString();
            Response.Redirect(gotourl);
        }
        private string GetRequestSignatureSrc(RequestCollection rc, string key)
        {
            string[] src = new string[rc.Count];
            for (int i = 0; i < rc.Count; i++)
            {
                if (rc.Keys[i].ToLower() != "mac")
                    src[i] = rc[rc.Keys[i]].Trim();
                else
                    src[i] = "";
            }
            var srcordered = src.OrderBy(s => s);
            return string.Join("", srcordered) + key;
        }
    }
}