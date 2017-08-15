using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections.Specialized;
using Starsoft.Core;
using Starsoft.Web;
using System.Configuration;
using com.hjy.fan.EntityFacade;
using com.hjy.fan.BusinessLayer;
using com.hjy.fan.FrameWork;
using com.hjy.fan.QueryFacade;
using com.hjy.fan.EntityFacade.Json;

namespace com.hjy.fan.WebTouch.Account
{
    public partial class RegOauth : CommonPage
    {
        string TradeCode = "";
        string Gender = "";
        string HeadImageURL = "";
        string uid = "";
        string NickName = "";
        string Name = "";
        protected string MobilePhone = "";
        protected string SMSCodeSeperateTimes = INITools.GetIniKeyValue("SMS", "SMSCodeSeperateTimes");
        EnumAccountType accountType;
        EnumGender sexType;
        string OrderNo = "";
        string access_token = "";
        string expires_in = "";
        string refresh_token = "";
        protected string jsStr = "";
        private Login_Set_Js loginjs;
        protected string str_loginjs = "";
        protected void Page_Load(object sender, EventArgs e)
        {
            loginjs = new Login_Set_Js();
            loginjs.calls = new List<string>();
            loginjs.returnurl = "";
            loginjs.Member = new Login_Js_Member();
            base.Values = new NameValueCollection();
            base.MessageValues = new NameValueCollection();
            //清除用户上次登录信息
            if (string.IsNullOrEmpty(Request["TradeCode"]) || string.IsNullOrEmpty(Request["openid"]) || string.IsNullOrEmpty(Request["mac"]) || string.IsNullOrEmpty(Request["GetInfoTime"]))
            {
                return;
            }
            RequestCollection rc = new RequestCollection("utf-8");
            foreach (string key in Request.QueryString.Keys)
            {
                rc.Add(key, Request.QueryString[key]);
            }
            //string MerchantID = System.Configuration.ConfigurationSettings.AppSettings["MessageGatewayMerchantID"];
            //if(MerchantID!=Request.QueryString["MerchantID"])
            //{
            //    this.MessageValues.Add("login_error", "商户号错误");
            //    return;
            //}
            //LoginBLL.WriteMemLog(EnumLogType.ULogin, EnumClientType.WebTouch, EnumLogStatus.Fail, MobilePhone, string.Format("{0},{1}登陆失败", accountType, uid), "检查参数[" + OrderNo + "]");
            string MerchantKey = INITools.GetIniKeyValue("MessageGateWay", "APIMD5Key");
            string mysign = DESHelper.ComputeMD5Hash(GetRequestSignatureSrc(rc, MerchantKey), "utf-8");
            if (mysign.ToLower() != Request.QueryString["mac"].ToLower())
            {
                return;
            }
            string OauthTime = Request.QueryString["GetInfoTime"] ?? "";
            if (!ValidateHelper.IsDateTime(OauthTime))
            {
                return;
            }
            int OauthExpireMinute = int.Parse(INITools.GetIniKeyValue("MessageGateWay", "OauthExpireMinute"));
            if (DateTime.Now > DateTime.Parse(OauthTime).AddMinutes(OauthExpireMinute))
            {
                return;
            }

            Name = Request["Name"] ?? "";
            NickName = Request["NickName"] ?? "";
            TradeCode = Request["TradeCode"] ?? "";
            Gender = Request["Gender"] ?? "";
            HeadImageURL = Request["HeadImageURL"] ?? "";
            uid = Request["openid"] ?? "";
            MobilePhone = Request["MobilePhone"] ?? "";
            OrderNo = Request["OrderNo"] ?? "";
            access_token = Request["access_token"] ?? "";
            expires_in = Request["expires_in"] ?? "0";
            refresh_token = Request["refresh_token"] ?? "";

            switch (TradeCode)
            {
                case "WeiXin":
                    accountType = EnumAccountType.ULogin_WeiXin;
                    break;
                case "QQ":
                    accountType = EnumAccountType.ULogin_QQ;
                    break;
                case "AliPay":
                    accountType = EnumAccountType.ULogin_AliPay;
                    break;
                case "WeiBo":
                    accountType = EnumAccountType.ULogin_WeiBo;
                    break;
                default:
                    this.MessageValues.Add("login_error", "错误的登录类型");
                    return;
            }
            switch (Gender.Trim())
            {
                case "1":
                    sexType = EnumGender.Male;
                    break;
                case "2":
                    sexType = EnumGender.FeMale;
                    break;
                default:
                    sexType = EnumGender.Male;
                    break;
            }

            if (!IsPost)
            {
                string memberFrom = "";
                string[] arrOrderNo = OrderNo.Split(new char[] { '~' }, StringSplitOptions.RemoveEmptyEntries);
                if (arrOrderNo.Length > 2)
                {
                    memberFrom = arrOrderNo[1].Trim();
                }
                //hidWxOpenID.Value = "{\"Member\":{\"phone\":\"" + MobilePhone + "\",\"uid\":\"" + uid + "\",\"accounttype\":" + ((int)accountType).ToString() + "}}";
                string phonenofromsession = Session["UserName"] == null ? "" : Session["UserName"].ToString();
                ResultPacket rp = LoginBLL.RecordBindInfo(phonenofromsession, uid, HeadImageURL, accountType, access_token, refresh_token, expires_in, memberFrom);
                //LoginBLL.WriteMemLog(EnumLogType.ULogin, EnumClientType.WebTouch, EnumLogStatus.Fail, MobilePhone, string.Format("{0},{1}登陆失败", accountType, uid), "检查参数[" + rp.Description.ToString() + "]");
            }

            //string gotoural = INITools.GetIniKeyValue("WX_Card", Request["returnurl"]);
            string merchantcode = "", cardflag = "";
            if (ValidateHelper.IsNumbers(Request["returnurl"]))
            {
                JYH_WxCard_Log mod = new JYH_WxCard_LogDAL().GetModel(int.Parse(Request["returnurl"]));
                if (mod!=null)
                {
                    merchantcode = mod.MerchantKey;
                    cardflag = mod.Card_ID;
                }
            }
            else
            {
                merchantcode = Request["returnurl"].Split('|')[0];
                cardflag = Request["returnurl"].Split('|')[1];
            }


            Merchant_ActBLL actlinkBll = new Merchant_ActBLL();
            actlinkBll._paramList.Add("action", HttpUtility.UrlDecode("merchant_actlinkurl"));
            actlinkBll._paramList.Add("merchantcode", HttpUtility.UrlDecode(""));
            actlinkBll._paramList.Add("paramlist", HttpUtility.UrlDecode(""));
            actlinkBll._paramList.Add("mc", merchantcode);
            actlinkBll._paramList.Add("cf", cardflag);
            actlinkBll._paramList.Add("pc", ConfigurationManager.AppSettings["merchant_projectcode"]);
            actlinkBll._paramList.Add("col", "LinkUrl");
            string api_result = actlinkBll.NotifyMerchantApiData();
            AddressResult result = new AddressResult();
            result = (AddressResult)JsonHelper.FromJsonString(result, api_result);
            string gotoural = result.resultMessage;
            if (gotoural.IndexOf('?')>-1)
            {
                gotoural += "&from="+ merchantcode;
            }
            else
            {
                gotoural += "?from=" + merchantcode;
            }
            //Response.Write(actlinkBll._paramList.ToQueryString()+"++++"+result.resultMessage);
            Response.Redirect(gotoural, true);
            //if (gotoural.ToLower().IndexOf("index") > -1)
            //{

            //    Response.Redirect(gotoural + "?exchange=1&from=wy", true);
            //}
            //else if (gotoural.ToLower().IndexOf("tvlive") > -1)
            //{
            //    Response.Redirect(gotoural + "?exchange=2&from=jygw", true);
            //}
            //else if (gotoural.ToLower().IndexOf("brandpreferencedetail") > -1)
            //{
            //    Response.Redirect(gotoural + "?exchange=2&from=xzq&id=HJY151207100011", true);
            //}
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