using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Collections.Specialized;
using System.Configuration;
using com.hjy.fan.BusinessLayer;
using com.hjy.fan.BusinessLayer.JYHAPI;
using com.hjy.fan.BusinessLayer.WxPayAPI;
using com.hjy.fan.BusinessLayer.WxJsApi;
using com.hjy.fan.FrameWork;
using com.hjy.fan.EntityFacade;
using com.hjy.fan.EntityFacade.Json;
using System.IO;
using LitJson;
using com.hjy.fan.EntityFacade.Order;

namespace com.hjy.fan.WebTouch.Ajax
{
    public partial class API : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            int paygate = 0;
            EnumOrderPayMent PayMent = EnumOrderPayMent.Unkonwn;
            int OrderPayMentAccountPaygate = 0;

            JYH_Order order;
            JYH_MobileDeposit order_cz;
            string outString = "";
            string phoneno = "";
            string yqStr = "";
            string qst = "";
            double LoginMaxSecond = 120;
            double TotalSeconds = 0;
            string LoginMD5_key = "";
            string fileName = "";

            bool wxdebug = false;
            if (!bool.TryParse(Request["debug"] ?? "", out wxdebug))
                wxdebug = false;

            Json_Response_Base.UploadPic_resultPackage jrb = new Json_Response_Base.UploadPic_resultPackage();

            try
            {

                ResultPacket rp = new ResultPacket();
                Json_Response_Base.resultPackage jrp = new Json_Response_Base.resultPackage();
                switch (Request["action"])
                {
                    //收货地址验证码
                    case "addressvalidcode":
                        rp = SMSBll.MakeSMSCodeAndSend(Request["mobileno"], JYH_SMSCode.EnumSMSTradeType.SaveAddress);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //收货地址验证码
                    case "loginvalidcode":
                        rp = SMSBll.MakeSMSCodeAndSend(Request["mobileno"], (int)JYH_SMSCode.EnumSMSTradeType.PhoneLogin, Request["piccode"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //收货地址验证码
                    case "oauthvalidcode":
                        rp = SMSBll.MakeSMSCodeAndSend(Request["mobileno"], JYH_SMSCode.EnumSMSTradeType.BindMobileAndMobileReg);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //手机注册验证码
                    case "registervalidcode":
                        rp = SMSBll.MakeSMSCodeAndSend(Request["mobileno"], (int)JYH_SMSCode.EnumSMSTradeType.PhoneRegister, Request["piccode"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //重置密码验证码
                    case "resetpasswordvalidcode":
                        phoneno = Session["UserName"] == null ? (Request["mobileno"] ?? "") : Session["UserName"].ToString();
                        rp = SMSBll.MakeSMSCodeAndSend(phoneno, (int)JYH_SMSCode.EnumSMSTradeType.PasswordReset, Request["piccode"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //手机注册验证码
                    case "lqfxtqvalidcode":
                        rp = SMSBll.MakeSMSCodeAndSend(Request["mobileno"], (int)JYH_SMSCode.EnumSMSTradeType.LQFXTQ, Request["piccode"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //摇一摇兑换
                    case "couponcodeexchange_wy":
                        rp = SMSBll.MakeSMSCodeAndSend(Request["mobileno"], (int)JYH_SMSCode.EnumSMSTradeType.CouponCodeExchange, Request["piccode"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //真惠摇兑换
                    case "couponcodeexchange_jygw":
                        rp = SMSBll.MakeSMSCodeAndSend(Request["mobileno"], (int)JYH_SMSCode.EnumSMSTradeType.CouponCodeExchange_ZHY, Request["piccode"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //真惠摇兑换
                    case "couponcodeexchange_xzq":
                        rp = SMSBll.MakeSMSCodeAndSend(Request["mobileno"], (int)JYH_SMSCode.EnumSMSTradeType.CouponCodeExchange_XZQ, Request["piccode"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    case "couponcodeexchange":
                        rp = SMSBll.MakeSMSCodeAndSend(Request["mobileno"], byte.Parse(Request["smstype"]), Request["piccode"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //核销卡券
                    case "exchangecoupon_wxapi":
                        rp = Message_TemplateBLL.ExchangeCouponAPI(int.Parse(Request["cardid"]), int.Parse(Request["result"]), Request["code"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //检查卡券
                    case "wxcard_check":
                        rp = Message_TemplateBLL.CheckCardAPI(int.Parse(Request["cardid"]));
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //新增收货地址
                    case "addressadd":
                        rp = new OrderBLL().AddAddressForOrder(Request["api_input"], Request["validcode"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //修改收货地址
                    case "addressedit":
                        rp = new OrderBLL().EditAddressForOrder(Request["api_input"], Request["validcode"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //修改收货地址
                    case "getidnumber":
                        rp = new OrderBLL().GetIDNumber(Request["idnumber"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //手机登录
                    case "phonelogin":
                        jrp = new LoginBLL().CheckPhoneLogin(Request["phoneno"], Request["validcode"]);
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //只使用手机号直接登录,from=web的需要验签，安卓和ios直接登录
                    case "phoneloginauto":
                        if (Request["type"] == "web")
                        {
                            try
                            {
                                //测试
                                //jrp = new LoginBLL().CheckPhoneLoginApp(Request["phoneno"]);
                                //outString = JsonHelper.ToJsonString(jrp);



                                //验签
                                if (Request["phoneno"] != null && Request["tt"] != null && Request["mac"] != null)
                                {
                                    //判断时间是否自有效期内
                                    LoginMaxSecond = INITools.GetIniKeyValue("autologinurl", "LoginMaxSecond") == "" ? 0 : double.Parse(INITools.GetIniKeyValue("autologinurl", "LoginMaxSecond"));// ConfigurationManager.AppSettings["LoginMaxSecond"] == null ? 120 : double.Parse(ConfigurationManager.AppSettings["LoginMaxSecond"].ToString());

                                    qst = Request["tt"];
                                    if (qst == "")
                                    {
                                        jrp.resultcode = "99";
                                        jrp.resultmessage = "缺少参数";

                                    }
                                    else
                                    {
                                        TimeSpan ts = DateTime.Now - DateTime.Parse("1970-1-1");
                                        TotalSeconds = ts.TotalSeconds;
                                        TotalSeconds = TotalSeconds - double.Parse(qst);

                                        if (TotalSeconds >= LoginMaxSecond || TotalSeconds < 0)
                                        {
                                            jrp.resultcode = "99";
                                            jrp.resultmessage = "已失效";

                                        }
                                        else
                                        {
                                            LoginMD5_key = INITools.GetIniKeyValue("autologinurl", "LoginMD5_key") == "" ? "" : INITools.GetIniKeyValue("autologinurl", "LoginMD5_key");
                                            yqStr = Request["phoneno"] + qst + LoginMD5_key;
                                            //验签通过
                                            if (DESHelper.Md5(yqStr) == Request["mac"].ToString())
                                            {
                                                //判断是否有手机号
                                                if (Request["phoneno"] != "")
                                                {
                                                    
                                                }
                                                else
                                                {
                                                    jrp.resultcode = "99";
                                                    jrp.resultmessage = "缺少手机号";

                                                }
                                            }
                                            else
                                            {
                                                jrp.resultcode = "99";
                                                jrp.resultmessage = "签名错误";
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    jrp.resultcode = "99";
                                    jrp.resultmessage = "缺少参数";
                                }


                            }
                            catch (Exception edf)
                            {
                                jrp.resultcode = "99";
                                jrp.resultmessage = "程序异常";

                            }

                            if (jrp.resultcode != "99")
                            {
                                //登录
                                jrp = new LoginBLL().CheckPhoneLoginApp(Request["phoneno"]);
                                outString = JsonHelper.ToJsonString(jrp);
                            }
                            else
                            {
                                //用户注销
                                try
                                {
                                    new LoginBLL().UserLoginOut();
                                }
                                catch (Exception sse)
                                {

                                }

                            }
                        }
                        else
                        {
                            jrp = new LoginBLL().CheckPhoneLoginApp(Request["phoneno"]);

                        }
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //手机注册
                    case "phonereg":
                        jrp = new LoginBLL().CheckPhoneReg(Request["phoneno"], Request["validcode"], Request["password"]);
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    case "phonereg_lqfxtq":
                        jrp = new LoginBLL().CheckPhoneReg(Request["phoneno"], Request["validcode"], Request["password"], JYH_SMSCode.EnumSMSTradeType.LQFXTQ, Request["sharephone"]);
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //摇一摇注册
                    case "phonereg_exchange_wy":
                        rp = new LoginBLL().LoginAndExchange(Request["phoneno"], Request["validcode"], Request["mercode"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //真惠摇注册
                    case "phonereg_exchange_jygw":
                        rp = new LoginBLL().LoginAndExchange_ZHY(Request["phoneno"], Request["validcode"], Request["mercode"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //新掌趣注册
                    case "phonereg_exchange_xzq":
                        rp = new LoginBLL().LoginAndExchange(Request["phoneno"], Request["validcode"], Request["mercode"], (int)JYH_SMSCode.EnumSMSTradeType.CouponCodeExchange_XZQ);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    case "phonereg_exchange":
                        rp = new LoginBLL().LoginAndExchange(Request["phoneno"], Request["validcode"], Request["mercode"], int.Parse(Request["smstype"]));
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    case "couponcode_api":
                        rp = new RequestBLL().InitRequest_ApiSendList(Request["couponcode"], Request["apiinput"], Request["apitarget"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //重新设置密码
                    case "passwordreset":
                        phoneno = Session["UserName"] == null ? (Request["phoneno"] ?? "") : Session["UserName"].ToString();
                        jrp = new LoginBLL().ResetPassWord(phoneno, Request["validcode"], Request["password"]);
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //获取默认收货地址
                    case "addressdefault":
                        string addressDetail = "";
                        rp = new OrderBLL().GetAddressDefault(out addressDetail);
                        if (rp.IsError)
                        {
                            jrp.resultcode = rp.ResultCode;
                            jrp.resultmessage = rp.Description;
                            outString = JsonHelper.ToJsonString(jrp);
                        }
                        else
                        {
                            outString = addressDetail;
                            if (outString == "")
                            {
                                jrp.resultcode = "1000";
                                jrp.resultmessage = "收货地址已删除，请重新设置收货地址";
                                outString = JsonHelper.ToJsonString(jrp);
                            }

                        }
                        break;
                    //根据id获得地址
                    case "getaddressbyid":
                        string addressByID = "";
                        rp = new OrderBLL().GetAddressByID(Request["addressid"], out addressByID);
                        if (rp.IsError)
                        {
                            jrp.resultcode = rp.ResultCode;
                            jrp.resultmessage = rp.Description;
                            outString = JsonHelper.ToJsonString(jrp);
                        }
                        else
                        {
                            outString = addressByID;
                            if (outString == "")
                            {
                                jrp.resultcode = "1000";
                                jrp.resultmessage = "收货地址已删除，请重新设置收货地址";
                                outString = JsonHelper.ToJsonString(jrp);
                            }

                        }
                        break;
                    case "addresslist":
                        string addressList = "";
                        rp = new OrderBLL().GetAddressList(out addressList);
                        if (rp.IsError)
                        {
                            jrp.resultcode = rp.ResultCode;
                            jrp.resultmessage = rp.Description;
                            outString = JsonHelper.ToJsonString(jrp);
                        }
                        else
                        {
                            outString = addressList;
                        }
                        break;
                    case "checkuseridentity":
                        string checkresult = "";
                        rp = new OrderBLL().CheckUserIdentityInfo(Request["idnumber"]);
                        jrp.resultcode = rp.ResultCode;
                        jrp.resultmessage = rp.Description;
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //检测是否登录
                    case "checklogin":
                        jrp = new LoginBLL().CheckLoginSession();
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //获得
                    case "getwxopenid":
                        jrp = new LoginBLL().GetWxOpenID();
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //获得
                    case "getwxopenidbyphone":
                        jrp = new LoginBLL().GetWxOpenIDByPhone(Request["phone_no"]);
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //去支付
                    case "topayment":
                        new OrderBLL().ToPayment(Request["order_code"], Request["paytype"]);
                        break;
                    //用户登录
                    case "userlogin":
                        try
                        {
                            jrp = new LoginBLL().CheckLogin(Request["username"], Request["password"]);
                            outString = JsonHelper.ToJsonString(jrp);
                        }
                        catch (Exception ex)
                        {
                            jrp.resultcode = "98";
                            jrp.resultmessage = ex.ToString();
                            outString = JsonHelper.ToJsonString(jrp);
                        }

                        break;
                    //用户注销
                    case "userlogout":
                        jrp = new LoginBLL().UserLoginOut();
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //修改密码
                    //case "changepwd":
                    //    jrp = new LoginBLL().ChangePassWord(Request["password"]);
                    //    outString = JsonHelper.ToJsonString(jrp);
                    //    break;
                    //设定上级推荐人
                    case "setrecom":
                        jrp = new LoginBLL().SetRecommend(Request["phoneno"]);
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    case "alipaycheck":
                        SortedDictionary<string, string> sPara = GetRequestGet();
                        sPara.Remove("_");
                        sPara.Remove("t");
                        sPara.Remove("action");
                        Notify aliNotify = new Notify();
                        bool verifyResult = aliNotify.Verify(sPara, Request.QueryString["notify_id"], Request.QueryString["sign"]);
                        if (verifyResult)
                        {
                            jrp.resultcode = "0";
                            jrp.resultmessage = "验证成功";
                        }
                        else
                        {
                            jrp.resultcode = "99";
                            jrp.resultmessage = "验证失败";
                        }
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    case "wxpay":
                        try
                        {
                            JsApiPay jsApiPay = new JsApiPay(this);
                            jsApiPay.openid = Session["wxPayOpenid"].ToString();//"oz1WBs_FPv5qbh1cyyoN9fzNZgUw";
                            jsApiPay.total_fee = (int)(decimal.Parse(Request["total_fee"].ToString()) * 100);
                            jsApiPay.orderid = Request["orderid"];
                            WxPayData unifiedOrderResult = jsApiPay.GetUnifiedOrderResult();
                            outString = jsApiPay.GetJsApiParameters();
                            FileHelper.WriteLogFile(Server.MapPath("log"), "wxOpenid", jsApiPay.openid);
                        }
                        catch (Exception ex)
                        {
                            FileHelper.WriteLogFile(Server.MapPath("log"), "wxOpenid", ex.ToString());
                        }


                        break;
                    case "wxshare"://微信内JSAPI分享
                        WX_JSAPI_Config jaapiconfig = new WX_JSAPI_Config();
                        jaapiconfig.resultcode = "0";
                        jaapiconfig.resultmessage = "操作成功";
                        string jsApiList = Request["jsApiList"] ?? "";
                        string url = Request["surl"] ?? "";
                        if (jsApiList == "")
                        {
                            jaapiconfig.resultcode = "1";
                            jaapiconfig.resultmessage = "要调用的接口不能为空";
                        }

                        else if (url == "")
                        {
                            jaapiconfig.resultcode = "2";
                            jaapiconfig.resultmessage = "当前页面的url不能为空";
                        }
                        else
                        {
                            WX_JSAPI_Ticket_Response ticket = WxJsApiData.GetJsApiTicket("jsapi");
                            if (ticket == null)
                            {
                                jaapiconfig.resultcode = "3";
                                jaapiconfig.resultmessage = "获取ticket失败.";
                            }
                            else
                            {
                                jaapiconfig.appId = WxPayConfig.APPID;
                                jaapiconfig.debug = wxdebug;
                                jaapiconfig.jsApiList = jsApiList.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                                jaapiconfig.nonceStr = WxPayApi.GenerateNonceStr();
                                jaapiconfig.timestamp = WxPayApi.GenerateTimeStamp();
                                jaapiconfig.ticket = ticket.ticket;
                                jaapiconfig.url = url;
                                jaapiconfig.signature = WxJsApiData.getSign(jaapiconfig);
                            }

                        }
                        outString = JsonHelper.ToJsonString(jaapiconfig);
                        break;

                    case "wxaddcard"://微信内JSAPI批量添加卡券
                        WX_JSAPI_AddCard wx_jsapi_addcard = new WX_JSAPI_AddCard();
                        wx_jsapi_addcard.resultcode = "0";
                        wx_jsapi_addcard.resultmessage = "操作成功";
                        string wx_cardID = Request["wxcardid"] ?? "";

                        if (wx_cardID == "")
                        {
                            wx_jsapi_addcard.resultcode = "2";
                            wx_jsapi_addcard.resultmessage = "微信卡券ID不能为空";
                        }
                        else
                        {
                            WX_JSAPI_Ticket_Response ticket = WxJsApiData.GetJsApiTicket("wx_card");
                            if (ticket == null)
                            {
                                wx_jsapi_addcard.resultcode = "3";
                                wx_jsapi_addcard.resultmessage = "获取card_ticket失败.";
                            }
                            else
                            {
                                wx_jsapi_addcard.cardList = new List<WX_JSAPI_card>();
                                WX_JSAPI_card wx_jsapi_card = new WX_JSAPI_card();
                                wx_jsapi_card.cardId = wx_cardID;
                                WX_JSAPI_cardExt wx_jsapi_cardext = new WX_JSAPI_cardExt();
                                wx_jsapi_cardext.nonce_str = "";// WxPayApi.GenerateNonceStr();
                                wx_jsapi_cardext.timestamp = WxPayApi.GenerateTimeStamp();
                                wx_jsapi_cardext.signature = WxJsApiData.getSign(wx_cardID, ticket, wx_jsapi_cardext);
                                wx_jsapi_card.cardExt = JsonHelper.ToJsonString(wx_jsapi_cardext);
                                wx_jsapi_addcard.cardList.Add(wx_jsapi_card);
                            }

                        }
                        outString = JsonHelper.ToJsonString(wx_jsapi_addcard);
                        break;
                    //手机登录
                    case "phoneexist":
                        if (LoginBLL.CheckPhoneExist(Request["phoneno"]))
                        {
                            jrp.resultcode = "99";
                            jrp.resultmessage = "已存在";
                        }
                        else
                        {
                            jrp.resultcode = "1";
                            jrp.resultmessage = "不存在";
                        }
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    case "wxtpmsg":
                        // Session["wxOpenid"] = "ofw0Nj-k1lrH8jZoYuRVmdfJQMyQ";
                        if (Session["wxOpenid"] != null)
                        {
                            rp = Message_TemplateBLL.SendWXAPIMsg(Session["wxopenid"].ToString(), Request["fixtime"], Request["productname"], Request["productmoney"], Request["productid"]);
                            jrp.resultcode = rp.ResultCode;
                            jrp.resultmessage = rp.Description;
                        }
                        else
                        {
                            jrp.resultcode = "95";
                            jrp.resultmessage = "请用微信授权登录系统";
                        }
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    case "sourceclicknum"://收集打开客户端来源点击数
                        if (Request["source"] != null && Request["clienttype"] != null && Request["other"] != null)
                        {
                            rp = JYH_Source_ClickNumBLL.SaveClient(Request["source"].ToString(), Request["clienttype"].ToString(), Request["other"]);
                            outString = "1";
                        }
                        else
                        {
                            outString = "";
                        }
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    case "getguideconfig":
                        outString = new GuideConfigBLL().GetApiData(Request["shopid"].ToString());
                        break;
                    case "merchant_check":
                        Merchant_PageBLL checkBll = new Merchant_PageBLL();
                        foreach (string key in Request.Form.Keys)
                        {
                            checkBll._paramList.Add(key, HttpUtility.UrlDecode(Request.Form[key]));
                        }
                        string from = Request["merchantcode"].ToString();
                        if (!string.IsNullOrEmpty(from))
                        {
                            outString = checkBll.NotifyMerchantApiData();
                            if (outString == "-1")
                            {
                                from = "";
                            }
                            else
                            {
                                if (JsonHelper.JsonToObject<Json_Response_Base.resultPackage>(outString).resultcode != "1")
                                {
                                    from = "";
                                }
                            }
                        }
                        checkBll.CheckMerchantValid(Request["host"].ToString(), Request["refer"].ToString(), from);
                        if (Session["MerchantID_HJY"] != null)
                        {
                            jrp.resultcode = "1";
                            jrp.resultmessage = from;
                        }
                        else
                        {
                            jrp.resultcode = "99";
                            jrp.resultmessage = "已失效";
                        }
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    case "merchant_valid":
                        if (Session["MerchantID_HJY"] != null)
                        {
                            jrp.resultcode = "1";
                            jrp.resultmessage = "正常";
                        }
                        else
                        {
                            jrp.resultcode = "99";
                            jrp.resultmessage = "已失效";
                        }
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    case "merchant_clear":
                        Session["MerchantID_HJY"] = null;
                        jrp.resultcode = "1";
                        jrp.resultmessage = "正常";

                        outString = JsonHelper.ToJsonString(jrp);

                        break;
                    case "merchant_order":
                        if (Session["MerchantID_HJY"] != null)
                        {
                            Merchant_OrderBLL orderBll = new Merchant_OrderBLL();
                            foreach (string key in Request.Form.Keys)
                            {
                                orderBll._paramList.Add(key, HttpUtility.UrlDecode(Request.Form[key]));
                            }
                            outString = orderBll.NotifyMerchantApiData();
                            if (outString == "-1")
                            {
                                jrp.resultcode = "99";
                                jrp.resultmessage = "通知失败";
                                outString = JsonHelper.ToJsonString(jrp);
                            }
                        }
                        else
                        {
                            jrp.resultcode = "98";
                            jrp.resultmessage = "已失效";
                            outString = JsonHelper.ToJsonString(jrp);
                        }
                        break;
                    case "merchant_phone":
                        if (Session["MerchantID_HJY"] != null)
                        {
                            Merchant_PhoneBLL phoneBll = new Merchant_PhoneBLL();
                            foreach (string key in Request.Form.Keys)
                            {
                                phoneBll._paramList.Add(key, HttpUtility.UrlDecode(Request.Form[key]));

                            }
                            outString = phoneBll.NotifyMerchantApiData();
                            if (outString == "-1")
                            {
                                jrp.resultcode = "99";
                                jrp.resultmessage = "通知失败";
                                outString = JsonHelper.ToJsonString(jrp);
                            }
                        }
                        else
                        {
                            jrp.resultcode = "98";
                            jrp.resultmessage = "已失效";
                            outString = JsonHelper.ToJsonString(jrp);
                        }
                        break;
                    case "merchant_act":

                        Merchant_ActBLL actBll = new Merchant_ActBLL();
                        foreach (string key in Request.Form.Keys)
                        {
                            actBll._paramList.Add(key, HttpUtility.UrlDecode(Request.Form[key]));

                        }
                        outString = actBll.NotifyMerchantApiData();
                        if (outString == "-1")
                        {
                            jrp.resultcode = "99";
                            jrp.resultmessage = "通知失败";
                            outString = JsonHelper.ToJsonString(jrp);
                        }
                        Net_Merchant_Act model = new Net_Merchant_Act();
                        model = (Net_Merchant_Act)JsonHelper.FromJsonString(model, outString);
                        break;
                    case "merchant_actlinkurl":

                        Merchant_ActBLL actlinkBll = new Merchant_ActBLL();
                        actlinkBll._paramList.Add("action", HttpUtility.UrlDecode("merchant_actlinkurl"));
                        actlinkBll._paramList.Add("merchantcode", HttpUtility.UrlDecode(""));
                        actlinkBll._paramList.Add("paramlist", HttpUtility.UrlDecode(""));
                        actlinkBll._paramList.Add("mc", "rtlbq");
                        actlinkBll._paramList.Add("cf", "pjaSfw_19ZwN4QC4heO6pu2yVi6Q");
                        actlinkBll._paramList.Add("pc", "jyhshop");
                        actlinkBll._paramList.Add("col", "LinkUrl");
                        string api_result = actlinkBll.NotifyMerchantApiData();
                        AddressResult result = new AddressResult();
                        result = (AddressResult)JsonHelper.FromJsonString(result, api_result);
                        string aa = result.resultMessage;
                        break;
                    case "merchant_page":

                        if (Session["MerchantID_HJY"] != null || (!string.IsNullOrEmpty(Request["recordact"])))
                        {
                            Merchant_PageBLL pageBll = new Merchant_PageBLL();
                            foreach (string key in Request.Form.Keys)
                            {
                                //if (key=="paramlist")
                                //{
                                //    pageBll._paramList.Add(key, HttpUtility.UrlDecode(Request.Form[key] + "@test^1"));
                                //}
                                //else if (key == "webpage")
                                //{
                                //    pageBll._paramList.Add(key, HttpUtility.UrlDecode(Request.Form[key] + "_test"));
                                //}
                                //else
                                //{
                                    pageBll._paramList.Add(key, HttpUtility.UrlDecode(Request.Form[key]));
                               // }
                            }

                            outString = pageBll.NotifyMerchantApiData();
                            if (outString == "-1")
                            {
                                jrp.resultcode = "99";
                                jrp.resultmessage = "通知失败";
                                outString = JsonHelper.ToJsonString(jrp);
                            }
                        }
                        else
                        {
                            if (Request["recordact"].ToString() != "")
                            {

                            }
                            jrp.resultcode = "98";
                            jrp.resultmessage = "已失效";
                            outString = JsonHelper.ToJsonString(jrp);
                        }
                        break;
                    case "group_check":
                        if (Session["group_key"] != null)
                        {
                            jrp.resultcode = "1";
                            jrp.resultmessage = "正常";
                        }
                        else
                        {
                            jrp.resultcode = "99";
                            jrp.resultmessage = "已失效";
                        }
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    case "group_back":
                        if (Session["group_back"] != null)
                        {
                            jrp.resultcode = "1";
                            jrp.resultmessage = "正常";
                        }
                        else
                        {
                            jrp.resultcode = "99";
                            jrp.resultmessage = "已失效";
                        }
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    case "act_selfpassword":
                        string nickname = Request["nickname"] ?? "";
                        if (nickname.Trim() == "")
                        {
                            jrp.resultcode = "1";
                            jrp.resultmessage = "昵称缺失。";
                        }
                        else
                        {
                            ACT_SelfPassword act_selfpassword = ACT_SelfPasswordBLL.GetACTData(nickname);
                            if (act_selfpassword == null)
                            {
                                jrp.resultcode = "2";
                                jrp.resultmessage = "昵称不存在。";
                            }
                            else
                            {
                                if (act_selfpassword.Act_Status != EnumCommonStatus._Valid)
                                {
                                    jrp.resultcode = "3";
                                    jrp.resultmessage = "状态不正确。";
                                }
                                else
                                {
                                    jrp.resultcode = "0";
                                    jrp.resultmessage = JsonHelper.ToJsonString(act_selfpassword);
                                }
                            }
                        }
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //埋点统计
                    case "gas":
                        RequestBLL.Request_GAS(Request["api_target"], Request["api_input"], "", out outString);
                        break;
                    case "getcardinfo":
                        outString = AwardConfigBLL.GetConfigByAwardLevel(Request["awardlevel"]);
                        break;
                    //多麦--订单推送
                    case "duomai_cps_sendorder":
                        string WebUrl = ConfigurationManager.AppSettings["duomai_sendurl"];
                        string duomai_hash = ConfigurationManager.AppSettings["duomai_hash"];
                        StringBuilder url_duomai = new StringBuilder();
                        //订单参数
                        url_duomai.Append("hash=" + HttpUtility.UrlEncode(duomai_hash));
                        foreach (string key in Request.Form.Keys)
                        {
                            if (key == "t" || key == "action")
                            {
                                continue;
                            }
                            else
                            {
                                if (key == "euid")
                                {
                                    url_duomai.Append("&euid=" + Request["euid"]);
                                }
                                else
                                {
                                    url_duomai.Append("&" + key + "=" + HttpUtility.UrlEncode(Request[key], Encoding.UTF8));
                                }

                                //url_duomai.Append("&" + key + "=" + Request[key]);
                            }
                        }
                        //是否测试订单
                        url_duomai.Append("&test=" + ConfigurationManager.AppSettings["istest"]);
                        string errMsg = "";
                        string appret = Utils.GetPageContent(WebUrl, url_duomai.ToString(), "utf-8", "Post", false, out errMsg);
                        //if (errMsg!="")
                        //{
                        //    appret = errMsg;
                        //}
                        string savelog = System.Configuration.ConfigurationManager.AppSettings["saveGetPagelog"] == null ? "0" : System.Configuration.ConfigurationManager.AppSettings["saveGetPagelog"];
                        //记录接口返回
                        if (savelog == "1")
                        {
                            try
                            {
                                FileHelper.WriteLogFile("jiekou", "提交地址：" + WebUrl + ",接口返回：" + appret + "请求参数：" + url_duomai.ToString());
                            }
                            catch (Exception ex1)
                            {
                                FileHelper.WriteLogFile("jiekou_err", "提交地址：" + WebUrl + ",描述：" + ex1.ToString());
                            }
                        }
                        outString = errMsg;
                        break;
                    /*上传图片*/
                    //case "uploadimg":
                    //    //====使用服务器物理路径，可实现上传========================================
                    //    ProjectLogBLL.NotifyProjectLog(string.Format("异常0:{0}", "处理开始"), "wxapi-uploadimg");

                    //    //获取图片控件
                    //    string file_ID = Request["fileid"];//.Split('|');
                    //    string return_img_path = "";
                    //    //for (int i = 0; i < file_ID_group.Length; i++)
                    //    //{
                    //    //var file = Request.Files[file_ID + "_imgshowUrl"];
                    //    var file = Request.Files[file_ID];

                    //        //上传图片文件路径
                    //        string temp_filePath = ConfigurationManager.AppSettings["UploadIMG"] == null ? "/upload/img" : ConfigurationManager.AppSettings["UploadIMG"];
                    //        //图片上传物理路径（当前服务器上）
                    //        string filePath =Server.MapPath(temp_filePath);

                    //        ProjectLogBLL.NotifyProjectLog(string.Format("记录1:{0}", filePath), "wxapi-" + Request["action"]);

                    //        int maxSize = 0;
                    //        string path = "";
                    //        if (file == null)
                    //        {
                    //            outString = "请上传图片信息！";
                    //        }
                    //        string fileName = file.FileName;

                    //        string exName = fileName.Substring(fileName.LastIndexOf('.'));

                    //        //重命名
                    //        //int seed = Guid.NewGuid().GetHashCode();
                    //        //var random = new System.Random(seed);
                    //        string newFileName = RandNum.GetRandNum(20)+"_"+ DateTime.Now.ToString("yyyyMMddHHmmssffff");

                    //        ProjectLogBLL.NotifyProjectLog(string.Format("记录2:{0}", newFileName), "wxapi-" + Request["action"]);

                    //        if (Directory.Exists(filePath) == false)
                    //        {
                    //            Directory.CreateDirectory(filePath);
                    //        }

                    //        path = filePath + "\\" + newFileName + exName;

                    //        file.SaveAs(path);

                    //        ProjectLogBLL.NotifyProjectLog(string.Format("记录3:{0}", "SaveAs后"), "wxapi-" + Request["action"]);

                    //        //图片访问路径
                    //        string baseurl = ConfigurationManager.AppSettings["UploadIMG_YM"];//Request.Url.Scheme + "://" + Request.Url.Host + ":" + Request.Url.Port;
                    //        //string baseurl = Request.Url.Scheme + "://" + Request.Url.Host + ":" + Request.Url.Port;

                    //        ProjectLogBLL.NotifyProjectLog(string.Format("记录4:{0}", baseurl), "wxapi-" + Request["action"]);

                    //        jrp.resultcode = "1"; 
                    //        jrp.resultmessage = baseurl + ConfigurationManager.AppSettings["UploadIMG_Path"] + "/" + newFileName + exName;
                    //    //}
                    //    outString = JsonHelper.ToJsonString(jrp);

                    //    break;

                    #region 上传图片*
                    /*上传图片*/
                    case "uploadimg":


                        //====使用服务器物理路径，可实现上传========================================

                        //获取图片控件
                        string file_ID = Request["fileid"];//.Split('|');
                                                           //string return_img_path = "";
                        var file = Request.Files[file_ID];
                        //var file =Request.Files[0];
                        //上传图片文件路径【通过虚拟目录获得对应的物理地址,虚拟目录地址需指向文件服务器的共享路径】
                        string temp_filePath = ConfigurationManager.AppSettings["UploadIMG"];
                        //图片上传物理路径（当前服务器上）
                        string filePath = new System.Web.UI.Page().Server.MapPath(temp_filePath);

                        ////图片上传物理路径（相对于文件服务器的地址）
                        //string filePath = ConfigurationManager.AppSettings["UploadIMG"];

                        int maxSize = 0;
                        string path = "";
                        string th_path = "";
                        if (file == null)
                        {
                            outString = "{\"resultCode\":\"1\",\"resultMessage\":\"请上传图片信息！\"}";
                        }
                        fileName = file.FileName;
                        string aaa = Encoding.UTF8.GetString(Encoding.Default.GetBytes(file.FileName));
                        string exName = "";
                        if (Path.GetExtension(aaa) == "")
                        {
                            exName = fileName.Substring(fileName.LastIndexOf('?')).Replace("?", ".");
                        }
                        else
                        {
                            exName = fileName.Substring(fileName.LastIndexOf('.'));
                        }

                        if (exName == "")
                        {
                            exName = "." + fileName.Substring(fileName.Length - 3, 3);
                        }
                        //重命名
                        //int seed = Guid.NewGuid().GetHashCode();
                        //var random = new System.Random(seed);
                        //string newFileName = DateTime.Now.ToString("yyyyMMddHHmmssffff") + "" + RandHelper.Next(100000, 999999);
                        string newFileName = System.Guid.NewGuid().ToString("N");
                        if (Directory.Exists(filePath) == false)
                        {
                            Directory.CreateDirectory(filePath);
                        }
                        //检验图片是否包含木马
                        string AllowedFilePath = CheckFileExtension.IsAllowedExtension(file, filePath);
                        if (AllowedFilePath == "")
                        {
                            //包含木马
                            outString = "{\"resultCode\":\"1\",\"resultMessage\":\"图片格式不正确【请选择JPG，gif，png,bmp图片】！\"}";
                        }
                        else
                        {
                            //压缩前的图片地址
                            string old_newFileName = System.Guid.NewGuid().ToString("N");
                            th_path = filePath + "\\" + old_newFileName + exName;

                            //压缩后图片名称
                            path = filePath + "\\" + newFileName + exName;

                            //保存图片
                            //file.SaveAs(path);
                            //转移图片
                            System.IO.File.Move(AllowedFilePath, th_path);
                            try
                            {
                                //删除临时图片
                                System.IO.File.Delete(AllowedFilePath);
                            }
                            catch (Exception eed)
                            {

                            }

                            int ThumImageMin = ConfigurationManager.AppSettings["ThumImageMin"] == null ? 200 : int.Parse(ConfigurationManager.AppSettings["ThumImageMin"].ToString());

                            if (file.ContentLength / 1000 > ThumImageMin)
                            {
                                //图片压缩比                                
                                long quality = ConfigurationManager.AppSettings["quality"] == null ? 50 : long.Parse(ConfigurationManager.AppSettings["quality"].ToString());
                                //缩小比例，1为原始尺寸
                                int multiple = ConfigurationManager.AppSettings["multiple"] == null ? 1 : int.Parse(ConfigurationManager.AppSettings["multiple"].ToString());

                                MakeThumImageHelpr.MakeThumImage(th_path, quality, multiple, path);
                                try
                                {
                                    //删除压缩前原图图片
                                    System.IO.File.Delete(th_path);
                                }
                                catch (Exception eed)
                                {

                                }
                            }
                            else
                            {
                                //不压缩
                                newFileName = old_newFileName;
                            }
                            //图片访问路径
                            string baseurl = "";
                            if (Request["saveFullPath"] != null)
                            {
                                baseurl = ConfigurationManager.AppSettings["UploadIMG_YM"];//Request.Url.Scheme + "://" + Request.Url.Host + ":" + Request.Url.Port;
                            }
                            jrb.resultmessage = baseurl + ConfigurationManager.AppSettings["UploadIMG_Path"] + newFileName + exName;
                            jrb.resultcode = "1";
                            outString = JsonHelper.ToJsonString(jrb);
                        }
                        break;
                    #endregion

                    case "getclientip":
                        outString = Request["city"];
                        Session["MemberClientCity"] = outString;
                        ProjectLogBLL.NotifyProjectLog(string.Format("用户客户端:{0}", (JsonMapper.ToObject(Session["MemberClientCity"].ToString()))["cname"].ToString()), "wxapi-" + Request["action"]);
                        break;

                    /*微信充值方式 1：本地jsapi  2、跳转网关，3：不使用支付网关，本地执行*/
                    case "GetWxPayRetflag":
                        string tempWxPayType = INITools.GetIniKeyValue("paygate", "wx_pay_retflag") == null ? "2" : INITools.GetIniKeyValue("paygate", "wx_pay_retflag");
                        outString = "{\"payretflag\":\"" + tempWxPayType + "\"}";

                        break;

                    /*使用支付网关支付*/
                    case "gopaygatepayment":
                        //取得支付网关的参数
                        try
                        {
                            string orderno = Request["OrderNo"] ?? "";
                            order = OrderBLL.GetModelByOrderNo(orderno);
                            if (order != null)
                            {
                                if (order.OrderPaygate == (int)EnumPaygate.WeiXin_JSAPI)
                                {
                                    if (Session["wxPayOpenid"] == null)
                                    {
                                        outString = "{\"resultcode\":\"99\",\"resultmessage\":\"获取OpenID失败，请重新登录\"}";
                                    }
                                    else
                                    {

                                        order.OpenID = Session["wxPayOpenid"].ToString();
                                        outString = PaygateBLL.GoToPayMent(order);
                                    }
                                }
                                else if(order.OrderPaygate == (int)EnumPaygate.Alipay_PnoneWeb)
                                {
                                    //支付宝Web
                                    outString = PaygateBLL.GoToPayMent(order);
                                }
                            }

                        }
                        catch (Exception ex)
                        {
                            outString = "{\"resultcode\":\"99\",\"resultmessage\":\"支付失败" + ex.Message + "\"}";
                        }
                        break;
                    /*使用支付网关支付*/
                    case "gopaygatepayment_mobileCZ":
                        //取得支付网关的参数
                        try
                        {
                            string orderno = Request["OrderNo"] ?? "";
                            order_cz = MemberChzBLL.GetModelByOrderNo(orderno);
                            if (order_cz != null)
                            {
                                if (order_cz.PayGate == (int)EnumPaygate.WeiXin_JSAPI)
                                {
                                    order_cz.OpenID = Session["wxPayOpenid"]==null?"":Session["wxPayOpenid"].ToString();
                                    if (order_cz.OpenID == "")
                                    {
                                        outString = "{\"resultcode\":\"99\",\"resultmessage\":\"获取OpenID失败，请重新登录\"}";
                                    }
                                    else
                                    {
                                        outString = PaygateBLL.GoToPayMent_MobileCZ(order_cz);
                                    }
                                }
                                else if (order_cz.PayGate == (int)EnumPaygate.Alipay_PnoneWeb)
                                {
                                    //支付宝Web
                                    order_cz.OpenID = "";
                                    outString = PaygateBLL.GoToPayMent_MobileCZ(order_cz);
                                }
                            }

                        }
                        catch (Exception ex)
                        {
                            outString = "{\"resultcode\":\"99\",\"resultmessage\":\"支付失败" + ex.Message + "\"}";
                        }
                        break;

                    /*396 本地保存订单*/
                    case "saveordertodb":
                        //记录支付方式
                        if (!int.TryParse(Request["orderpaygate"], out paygate))
                        {
                            jrp.resultcode = "1";
                            jrp.resultmessage = "支付方式错误。";
                        }
                        else if (!int.TryParse(Request["paygatetypeaccount"], out OrderPayMentAccountPaygate))
                        {
                            jrp.resultcode = "2";
                            jrp.resultmessage = "支付接口帐号错误。";
                        }
                        else if (!Enum.TryParse(Request["paygatetype"], out PayMent) || !Enum.IsDefined(typeof(EnumOrderPayMent), PayMent))
                        {
                            jrp.resultcode = "3";
                            jrp.resultmessage = "支付接口类型错误。";
                        }
                        else
                        {
                            order = OrderBLL.GetModelByOrderNo(Request["orderno"]);
                            if (order != null)
                            {
                                jrp.resultcode = "0";
                                jrp.resultmessage = "订单已存在。";
                            }
                            else
                            {
                                if (OrderBLL.InitPayment(Request["orderno"], decimal.Parse(Request["orderamount"]), Request["buyer_name"], Request["buyer_address"],
                                    Request["buyer_postcode"], int.Parse(Request["orderpaytype"]), int.Parse(Request["orderpayment"]), int.Parse(Request["orderpaygate"]), int.Parse(Request["paygatetype"]), Request["productid"], int.Parse(Request["paygatetypeaccount"])))
                                {
                                    jrp.resultcode = "0";
                                    jrp.resultmessage = "记录在线支付信息成功。";
                                }
                                else
                                {
                                    jrp.resultcode = "5";
                                    jrp.resultmessage = "记录在线支付信息失败。";
                                }
                            }

                        }
                        outString = JsonHelper.ToJsonString(jrp);
                        break;
                    //APP使用微信商城登录后，保存用户信息
                    case "SaveLoginInfoForAppLogin":
                        try
                        {
                            outString =LoginBLL.SetLoginSessionForApp(Request["token"], Request["username"], Request["password"], Request["wxopenid"]);
                        }
                        catch (Exception ex)
                        {
                            outString ="{\"resultcode\":\"99\",\"resultmessage\":\"失败" + ex.Message + "\"}";
                        }

                        break;
                    //向惠家有创建订单，成功后，本地保存订单，发起网关支付
                    case "com_cmall_familyhas_api_APiCreateOrder":
                        try
                        {
                            //var obj_data = { eramount": _pay_money, "buyer_name": $("#spaddressuser").html(), "buyer_address": _addressStreet, "buyer_postcode": "", "orderpaytype": temp_pay_type, "orderpayment": orderpayment, "orderpaygate": orderpaygate, "paygatetype": paygatetype, "productid": productCode, "paygatetypeaccount": orderpaygate };
                            //public ResultPacket HJY_OrderCreate(string api_input, string orderamount, string buyer_name, string buyer_address, string buyer_postcode, string orderpaytype, string orderpayment, string orderpaygate, string paygatetype, string productid, string paygatetypeaccount)
                            if (string.IsNullOrEmpty(Request["api_input"])
                                || string.IsNullOrEmpty(Request["orderamount"]) 
                                || string.IsNullOrEmpty(Request["orderpaytype"])
                                || string.IsNullOrEmpty(Request["orderpayment"])
                                || string.IsNullOrEmpty(Request["orderpaygate"])
                                || string.IsNullOrEmpty(Request["paygatetype"])
                                || string.IsNullOrEmpty(Request["productid"])
                                )
                            {
                                outString = "{\"resultcode\":\"99\",\"resultmessage\":\"缺少参数\"}";
                            }
                            else
                            {
                                rp = new OrderBLL().HJY_OrderCreate(Request["api_input"], Request["orderamount"], Request["buyer_name"], Request["buyer_address"], Request["buyer_postcode"], Request["orderpaytype"], Request["orderpayment"], Request["orderpaygate"], Request["paygatetype"], Request["productid"], Request["paygatetypeaccount"]);
                                jrp.resultcode = rp.ResultCode;
                                jrp.resultmessage = rp.Description;
                                if (rp.IsError)
                                {
                                    outString = "{\"resultcode\":\""+ rp.ResultCode + "\",\"resultmessage\":\"" + rp.Description + "\"}";
                                }
                                else {
                                    outString = JsonHelper.ToJsonString(rp.Description);
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            outString = "{\"resultcode\":\"99\",\"resultmessage\":\"失败" + ex.Message + "\"}";
                        }

                        break;
                }
            }
            catch (Exception ex)
            {
                ProjectLogBLL.NotifyProjectLog(string.Format("异常:{0}", ex.ToString()), "api-"+ Request["action"]);
            }
            Response.Write(outString);
        }

        /// <summary>
        /// 获取支付宝GET过来通知消息，并以“参数名=参数值”的形式组成数组
        /// </summary>
        /// <returns>request回来的信息组成的数组</returns>
        public SortedDictionary<string, string> GetRequestGet()
        {
            int i = 0;
            SortedDictionary<string, string> sArray = new SortedDictionary<string, string>();
            NameValueCollection coll;
            //Load Form variables into NameValueCollection variable.
            coll = Request.QueryString;

            // Get names of all forms into a string array.
            String[] requestItem = coll.AllKeys;

            for (i = 0; i < requestItem.Length; i++)
            {
                sArray.Add(requestItem[i], Request.QueryString[requestItem[i]]);
            }

            return sArray;
        }
    }
}