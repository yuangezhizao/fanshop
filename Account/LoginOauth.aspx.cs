using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Collections.Specialized;
using Starsoft.Core;
using Starsoft.Web;
using com.hjy.fan.EntityFacade;
using com.hjy.fan.BusinessLayer;
using com.hjy.fan.FrameWork;
using com.hjy.fan.QueryFacade;
using com.hjy.fan.EntityFacade.Json;
namespace com.hjy.fan.WebTouch.Account
{
    public partial class LoginOauth : CommonPage
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
        private  Login_Set_Js loginjs;
        protected string str_loginjs = "";      
        protected void Page_Load(object sender, EventArgs e)
        {

            Init_DecodeParam();
            if (IsPost && !string.IsNullOrEmpty(Request.Form["opreate"]))
            {
                User_Login(Request["returnurl"]);
            }
            else
            {
                if (OrderNo.StartsWith("b") && (accountType == EnumAccountType.ULogin_WeiXin))
                {
                    Session["wxOpenid"] = uid;
                    Session["HeadImageURL"] = HeadImageURL;
                    Session["wxOpenidList"] = hidWxOpenID.Value;
                    string gotoural = string.Format("/index.html?tc={0}", TradeCode);
                    User_Login_AlreadyBind(accountType, uid, Request["returnurl"]);
                    //Response.Redirect(gotoural, true);
                    jsStr = string.Format("<script>LoginOauth.GotoURL()</script>");

                }
                else
                {
                    //jsStr = string.Format("<script>LoginOauth.GotoURL('{0}')</script>", "/index.html");
                    if (this.MessageValues.Count == 0)
                    {
                        JYH_Phone_IchsyBind bind = new JYH_Phone_IchsyBindDAL().GetModel(uid, accountType);
                        User_Login_AlreadyBind(accountType, uid, Request["returnurl"], bind.PhoneNo);
                    }
                }
            }
            
        }

        #region 方法
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
        /// <summary>
        /// 初始化及解析参数
        /// </summary>
        private void Init_DecodeParam()
        {
            loginjs = new Login_Set_Js();
            loginjs.calls = new List<string>();
            loginjs.returnurl = "";
            loginjs.Member = new Login_Js_Member();
            base.Values = new NameValueCollection();
            base.MessageValues = new NameValueCollection();
            //清除用户上次登录信息
            if (base.IsLogin)
            {
                Session["UserName"] = null;
                Session["UserToken"] = null;
            }
            if (string.IsNullOrEmpty(Request["TradeCode"]) || string.IsNullOrEmpty(Request["openid"]) || string.IsNullOrEmpty(Request["mac"]) || string.IsNullOrEmpty(Request["GetInfoTime"]))
            {
                this.MessageValues.Add("login_error", "非法进入页面");
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
                this.MessageValues.Add("login_error", "签名错误");
                return;
            }
            string OauthTime = Request.QueryString["GetInfoTime"] ?? "";
            if (!ValidateHelper.IsDateTime(OauthTime))
            {
                this.MessageValues.Add("login_error", "错误的授权时间");
                return;
            }
            int OauthExpireMinute = int.Parse(INITools.GetIniKeyValue("MessageGateWay", "OauthExpireMinute"));
            if (DateTime.Now > DateTime.Parse(OauthTime).AddMinutes(OauthExpireMinute))
            {
                this.MessageValues.Add("login_error", "授权已过期");
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
                hidWxOpenID.Value = "{\"Member\":{\"phone\":\"" + MobilePhone + "\",\"uid\":\"" + uid + "\",\"accounttype\":" + ((int)accountType).ToString() + "}}";
                string phonenofromsession = Session["UserName"] == null ? "" : Session["UserName"].ToString();
                ResultPacket rp = LoginBLL.RecordBindInfo(phonenofromsession, uid, HeadImageURL, accountType, access_token, refresh_token, expires_in, memberFrom);
                //LoginBLL.WriteMemLog(EnumLogType.ULogin, EnumClientType.WebTouch, EnumLogStatus.Fail, MobilePhone, string.Format("{0},{1}登陆失败", accountType, uid), "检查参数[" + rp.Description.ToString() + "]");
            }
           // LoginBLL.WriteMemLog(EnumLogType.ULogin, EnumClientType.WebTouch, EnumLogStatus.Fail, MobilePhone, string.Format("{0},{1}登陆失败", accountType, uid), "检查参数[" + OrderNo + "]");
            
            //hidToken.Value = "{JSAPI_Access_token:{access_token:\""+access_token+"\",expires_in:"+expires_in+",refresh_token:\""+refresh_token+"\"}}";
            
        }

        /// <summary>
        /// 用户登录 
        /// </summary>
        private void User_Login(string returnurl)
        {
            string mobile = this.Values["text_mobile"] = Request.Form["text_mobile"] ?? "";
            string captcha_mobile = Request.Form["text_captcha_mobile"] ?? "";
            ResultPacket result = new ResultPacket();
            if (string.IsNullOrEmpty(mobile))
            {
                this.MessageValues.Add("login_error", "请输入您的手机号");
                return;
            }

            if (string.IsNullOrEmpty(captcha_mobile))
            {
                this.MessageValues.Add("login_error", "请输入手机验证码");
                return;
            }
            if (this.MessageValues.Count == 0)
            {
                
                result = SMSBll.CheckValidCode(mobile, captcha_mobile, JYH_SMSCode.EnumSMSTradeType.BindMobileAndMobileReg);
                if (result.IsError)
                {
                    this.MessageValues.Add("login_error", "验证码有误或者已过期");
                    return;
                }

                if (!LoginBLL.CheckPhoneExist(mobile))
                {
                    //注册会员
                    string seamil = "";

                    DateTime birthday = DateTime.Today;

                    //result = MemberBLL.MemberQuickReg(mobile, captcha_mobile, seamil, HeadImageURL, Name, NickName, birthday, sexType,
                    //    EnumAccountStatus.Normal, accountType, EnumRegSource.WebTouchQuick, base.VarID, out member);
                    result = new LoginBLL().CheckLoginAPI(mobile, captcha_mobile);
                    if (result.IsError)
                    {
                        this.MessageValues.Add("login_error", result.Description);
                        return;
                    }

                }
                //else
                //    member = LoginBLL.GetMemberByMobilePhone(mobile);

                //if (Scope!="snsapi_base")
                //{
                    #region 添加三方绑定
                result = LoginBLL.MemBindInfo(mobile, uid, accountType);
                    if (result.IsError)
                    {
                        this.MessageValues.Add("login_error", result.Description);
                        return;
                    }
                    #endregion
                    #region 登陆
                    User_Login_AlreadyBind(accountType, uid, returnurl, mobile);
                    #endregion
                //}
                //else
                //{
                //    string gotoural = "/Product_List.html";
                //    Response.Redirect(gotoural, true);
                //}
            }
            
        }
        #endregion

        /// <summary>
        /// 已绑定用户登陆
        /// </summary>
        /// <param name="accountType">账号类型</param>
        /// <param name="uid">第三方唯一Openid</param>
        /// <param name="returnurl">登陆成功后跳转URL</param>
        private void User_Login_AlreadyBind(EnumAccountType accountType, string uid, string returnurl, string phoneNo)
        {
            JYH_Phone_IchsyBind bind = new JYH_Phone_IchsyBind();
            bind.AccountType = accountType;
            bind.UID = uid;
            bind.PhoneNo = phoneNo;
            //if (string.IsNullOrEmpty(phoneNo))
            //{
            //    this.MessageValues.Add("login_error", "请输入您的手机号来完成绑定.");
            //    return;
            //}
            if (!LoginBLL.MemberbindIsExist(bind))
            {
                this.MessageValues.Add("login_error", "请输入您的手机号来完成绑定.");
                return;
            }
            Session["wxOpenid"] = uid;
            Session["HeadImageURL"] = HeadImageURL;
            //if (string.IsNullOrEmpty(phoneNo))
            //{
            //   // this.MessageValues.Add("login_error", "请输入您的手机号来完成绑定.");
            //    return;
            //}
            ResultPacket result = LoginBLL.MemberULogin(accountType, uid, base.VarID, Request.ServerVariables["REMOTE_ADDR"], EnumClientType.WebTouch, phoneNo, out bind);
            if (result.IsError)
            {
              //  hidWxOpenID.Value = result.Description;
                this.MessageValues.Add("login_error", result.Description);
                return;
            }
            string gotoural = returnurl == null ? "/index.html" : returnurl;//;Session["weixinbackgourl"] == null ? "/Index.html" : Session["weixinbackgourl"].ToString();
            //gotoural = gotoural == "" ? "/Index.html" : gotoural;
            //jsStr = string.Format("<script>LoginOauth.GotoURL()</script>");
            //Response.Redirect(gotoural, true);
            RunJS(bind);
        }

        /// <summary>
        /// 根据UID登录
        /// </summary>
        /// <param name="accountType"></param>
        /// <param name="uid"></param>
        /// <param name="returnurl"></param>
        private void User_Login_AlreadyBind(EnumAccountType accountType, string uid, string returnurl)
        {
            JYH_Phone_IchsyBind bind = new JYH_Phone_IchsyBind();
            bind.AccountType = accountType;
            bind.UID = uid;
            Session["wxOpenid"] = uid;
            Session["HeadImageURL"] = HeadImageURL;
            bind = new JYH_Phone_IchsyBindDAL().GetModel(uid, accountType);
            if (bind != null)
            {
                string strPhoneNo = bind.PhoneNo;


                    if (Session["AddUserByOrder"] != null)
                    {
                        if (!string.IsNullOrEmpty(Session["AddUserByOrder"].ToString()))
                        {
                            strPhoneNo = Session["AddUserByOrder"].ToString();
                        }
                    }


                if (!string.IsNullOrEmpty(strPhoneNo))
                {
                    ResultPacket result = LoginBLL.MemberULogin(accountType, uid, base.VarID, Request.ServerVariables["REMOTE_ADDR"], EnumClientType.WebTouch, strPhoneNo, out bind);
                    hidWxOpenID.Value = uid;
                    if (result.IsError)
                    {
                        this.MessageValues.Add("login_error", result.Description);
                        return;
                    }
                    string gotoural = returnurl ?? "";
                    gotoural = gotoural == "" ? "/Index.html" : gotoural;
                    jsStr = string.Format("<script>LoginOauth.GotoURL()</script>");
                    //Response.Redirect(gotoural, true);
                }
                else
                {
                    string gotoural = returnurl ?? "";
                    gotoural = gotoural == "" ? "/Index.html" : gotoural;
                   // Response.Redirect(gotoural, true);
                }
            }
            RunJS(bind);
        }
        /// <summary>
        /// 登陆后需要运行的JS
        /// </summary>
        private void RunJS(JYH_Phone_IchsyBind bind)
        {
            //loginjs.calls.Add("g_type_cart.Upload()");//把本地购物车同步到云端
            //loginjs.calls.Add("g_type_loginjs.SetMemberInfo()");//设定登陆会员绑定信息到前台缓存
            //以上2个方法已在js中写死，必定调用，无须再加调用
           // string sreturnurl = Request["returnurl"] ?? "";
            string sreturnurl = Request["returnurl"] ?? "";
            string s_sessionurl =Session["weixinbackgourl"]== null ? "/Index.html" : Session["weixinbackgourl"].ToString();
            sreturnurl = sreturnurl == "" ? s_sessionurl : sreturnurl;//Request["returnurl"]的优先级高级Session["weixinbackgourl"]
                //Session["weixinbackgourl"] == null ? "/Index.html" : Session["weixinbackgourl"].ToString();
            if (sreturnurl.ToLower().Contains("orderconfirm"))
            {
                if (sreturnurl.ToLower().Contains("?"))
                {
                    sreturnurl += "&showwxpaytitle=1";
                }
                else
                {
                    sreturnurl += "?showwxpaytitle=1";
                }
            }
            loginjs.returnurl = sreturnurl;
            if (bind != null)
            {
                loginjs.Member.accounttype = bind.AccountType;
                string[] arrOrderNo = OrderNo.Split(new char[] { '~' }, StringSplitOptions.RemoveEmptyEntries);
                if (arrOrderNo.Length > 2)
                    loginjs.Member.from = arrOrderNo[1].Trim();
                if (Session["AddUserByOrder"] == null)
                {
                    loginjs.Member.phone = StringHelper.base64encode(bind.PhoneNo.Trim(),"utf-8");
                }
                else
                {
                    loginjs.Member.phone = StringHelper.base64encode(Session["AddUserByOrder"].ToString());
                }
                loginjs.Member.uid = bind.UID.Trim();
            }
            str_loginjs = JsonHelper.ToJsonString(loginjs);
        }
    }
}