

using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using com.hjy.fan.BusinessLayer;
using com.hjy.fan.FrameWork;
using com.hjy.fan.QueryFacade;
using com.hjy.fan.EntityFacade;


namespace com.hjy.fan.WebTouch.MobileCZ
{
    //支付网关支付成功后的通知地址，修改订单状态为“支付成功”
    public partial class result : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //FC_Members_Log memlog;
            //string str = "web页面充值";

            //memlog = new FC_Members_Log();
            //memlog.DateTime = DateTime.Now;
            //memlog.LogType = FC_Members_Log.EnumLogType.Recharge;
            //memlog.ChipinSourceType = EnumChipinClientType.Web;
            //memlog.DateTime = DateTime.Now;


            string returl = "";
            string errstr = "";
            bool isok = false;
            JYH_MobileCZ_ReceiveLogDAL ReceiveLogDAL = new JYH_MobileCZ_ReceiveLogDAL();
            JYH_MobileCZ_ReceiveLog ReceiveLog = new JYH_MobileCZ_ReceiveLog();

            PaygateBLL paydll = new PaygateBLL();
            ResultPacket resultpage = paydll.DoVerify(Request.Params);



            //验签---开始
            //string c_pass = INITools.GetIniKeyValue("paygate", "c_pass");
            //string c_returl = INITools.GetIniKeyValue("paygate", "c_returl_mobilecz");
            //string c_reurl = INITools.GetIniKeyValue("paygate", "c_reurl_mobilecz");

            //PayGateBase paygate = null;
            //if (Request.Params["c_paygate"].ToString() == ((int)EnumPaygate.Alipay).ToString()
            //      || Request.Params["c_paygate"].ToString() == ((int)EnumPaygate.Alipay_PnoneWeb).ToString()
            //      || Request.Params["c_paygate"].ToString() == ((int)EnumPaygate.Alipay_WAP).ToString()
            //    )
            //{
            //    paygate = PayGateBase.GetInstance(EnumPaygateType.alipay_web);
            //}
            //else if (Request.Params["c_paygate"].ToString() == ((int)EnumPaygate.WeiXin).ToString()
            //      || Request.Params["c_paygate"].ToString() == ((int)EnumPaygate.WeiXin_JSAPI).ToString()
            //      || Request.Params["c_paygate"].ToString() == ((int)EnumPaygate.WeiXin_WAP).ToString()
            //    )
            //{ 
            //        paygate = PayGateBase.GetInstance(EnumPaygateType.wx);
            //}

            //string srcStr = "";
            //string mac = "";
            //if (Request.Params["c_version"] == "v2.0")
            //{

            //    EntityFacade.Pay.RequestParam req = new EntityFacade.Pay.RequestParam();
            //    req.c_address = "";
            //    req.c_bankarea = "";
            //    req.c_bankcardno = "";
            //    req.c_email = "";
            //    req.c_idno = "";
            //    req.c_idnotype = "";
            //    req.c_language = "0";//中文
            //    req.c_memo1 = Request.Params["c_memo1"];
            //    req.c_memo2 = Request.Params["c_memo2"];
            //    req.c_mid = Request.Params["c_mid"];
            //    req.c_moneytype = "0";
            //    req.c_name = Request.Params["c_memo2"];
            //    req.c_order = Request.Params["c_order"];
            //    req.c_orderamount = Request.Params["c_orderamount"];
            //    req.c_paygate = Request.Params["c_paygate"];
            //    req.c_paygate_account = Request.Params["c_paygate"];
            //    req.c_paygate_type = Request.Params["c_paygate_type"];
            //    req.c_post = "";
            //    req.c_retflag = Request.Params["c_retflag"];
            //    req.c_returl = c_returl;
            //    req.c_tel = "";
            //    req.c_version = Request.Params["c_version"];
            //    req.c_ymd = Request.Params["c_ymd"];
            //    req.notifytype = Request.Params["notifytype"];
            //    req.c_openid = Request.Params["OpenID"];
            //    req.c_reurl = Request.Params["c_reurl"];
            //    srcStr = paygate.Pay_GetSignSourceData(req, c_pass);

            //    req.c_signstr = DESHelper.ComputeMD5Hash(srcStr, "utf-8");

            //    //sParaTemp.Add("c_signstr", req.c_signstr);
            //    mac = req.c_signstr;
            //}
            //else
            //{

            //    srcStr = Request.Params["c_mid"] + Request.Params["c_order"] + Request.Params["c_orderamount"] + Request.Params["c_ymd"] + Request.Params["c_moneytype"] + Request.Params["c_retflag"] + c_returl + Request.Params["c_paygate"] + Request.Params["c_memo1"] + Request.Params["c_memo2"] + Request.Params["notifytype"] + Request.Params["c_language"] + Request.Params["c_version"] + c_pass;
            //    mac = DESHelper.ComputeMD5Hash(srcStr, "utf-8");

            //}

            //if (mac != Request.Params["mac"]) {
            //    returl = ReturnUrl(0, "验签失败");
            //}
            //结束

            string ReceiveData = "c_mid="+Request.Params["c_mid"]+"&c_order="+Request.Params["c_order"]+"&c_orderamount="+Request.Params["c_orderamount"]+"&c_ymd="+Request.Params["c_ymd"]+"&c_transnum="+Request.Params["c_transnum"]+"&c_succmark="+Request.Params["c_succmark"]+"&c_cause="+Request.Params["c_cause"]+"&c_moneytype="+Request.Params["c_moneytype"]+"&dealtime="+Request.Params["dealtime"]+"&c_memo1="+Request.Params["c_memo1"]+"&c_memo2="+Request.Params["c_memo2"]+"&c_signstr="+Request.Params["c_signstr"]+"&c_paygate="+Request.Params["c_paygate"]+"&c_version="+Request.Params["c_version"];

            ReceiveLog.TradeType = "pay";
            ReceiveLog.TradeDesp = "支付网关通知";
            ReceiveLog.ReceiveData = ReceiveData; //;Request.Params.ToString();
            ReceiveLog.Receivetime = DateTime.Now;
            ReceiveLog.OrderNo = Request.Params["c_order"];
            ReceiveLogDAL.Insert(ReceiveLog);

            if (resultpage.IsError)
            {
                #region 记录用户操作日志
                //try
                //{
                //    memlog.Status = FC_Members_Log.EnumLogStatus.Fail;
                //    memlog.MemID = 0;// mobiledeposit.MemID;
                //    memlog.MerchantID ="00";
                //    memlog.Memo = "支付网关返回失败失败，描述：" + resultpage.Description;
                //    memlog.SessionID = "";
                //    memlog.IP = GetIP.GetRequestIP();
                //    memlog.RequestSerialNo = "";
                //    memlog.ResultMessage = "支付网关返回失败，描述：" + resultpage.Description;
                //    memlog.TradeMerchantID = "00"; // System.Utils.Common.INI.IniReadvalue("System", "MerchantID", _inifile);
                //    new FC_Members_LogDAL().Insert(memlog);
                //}
                //catch
                //{
                //}

                #endregion

                returl = ReturnUrl(0, resultpage.Description);
            }
            else
            {
                JYH_MobileDepositDAL mobiledepositdal = new JYH_MobileDepositDAL();
                JYH_MobileDeposit mobiledeposit = mobiledepositdal.GetObjectByOrderNo(Request["c_order"]);
                if (mobiledeposit == null)
                {
                    returl = ReturnUrl(0, "充值订单信息未找到");
                }
                else
                {
                    if (mobiledeposit.Status != JYH_MobileDeposit.EnumStatus.Init)
                    {
                        returl = ReturnUrl(0, "支付订单状态错误");
                    }
                    else if (mobiledeposit.CZMobile != Request["c_memo2"])
                    {
                        returl = ReturnUrl(0, "订单信息与网关信息不符");
                    }
                    else if (mobiledeposit.PayMoney != decimal.Parse(Request["c_orderamount"]))
                    {
                        returl = ReturnUrl(0, "订单金额不一致,数据库:" + mobiledeposit.PayMoney.ToString() + ",通知：" + Request["c_orderamount"]);
                    }
                    else
                    {
                        //网关支付成功
                        mobiledeposit.Status = JYH_MobileDeposit.EnumStatus.ChargeOK;
                        mobiledeposit.ResponseTime = QueryBase.GetDataBaseDate();
                        mobiledeposit.Succmark = "Y";
                        mobiledeposit.AccountTime = DateTime.ParseExact(Request["dealtime"], "yyyyMMddHHmmss", null);
                        mobiledeposit.GateOrderNo = mobiledeposit.OrderNo;
                        int yy = mobiledepositdal.UpdateGateOrderNo(mobiledeposit);

                        string CZ_mobile = string.IsNullOrEmpty(Request["c_memo2"]) ? "00" : Request["c_memo2"];

                        if (yy!=1)
                        {
                            returl = ReturnUrl(0, resultpage.Description);
                        }
                        else
                        {
                            //调用充值接口,保存，便于在handleshow.aspx中查询
                            string outStrin="";


                            string ProductID = mobiledeposit.ProductID;//.Split('|')[2].ToString().Trim();
                            string OrderNo = Request["c_order"];// INITools.GetIniKeyValue("MobileCZ", "merchantid").Trim() + "-" + Request["c_order"];
                            ResultPacket rp = com.hjy.fan.BusinessLayer.MobileCZAPI.RequestBLL.Request_MobileCZ(ProductID, mobiledeposit.CZMobile, OrderNo, Request["c_orderamount"], out outStrin);
                            if (rp.IsError)
                            {
                                mobiledeposit.Status = JYH_MobileDeposit.EnumStatus.ChargeFail;
                                mobiledeposit.DealMemo += "," + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "调用手机充值接口返回失败，产品编号：" + ProductID + "，订单号：" + Request["c_order"] == null ? "" : Request["c_order"] + "，充值手机号：" + Request["c_memo2"] == null ? "" : Request["c_memo2"] + "，金额：" + Request["c_orderamount"] == null ? "" : Request["c_orderamount"] + "，描述：" + rp.Description;
                                mobiledepositdal.Update(mobiledeposit);
                            }
                            else {
                                mobiledeposit.Status = JYH_MobileDeposit.EnumStatus.Chargeing;
                                mobiledepositdal.Update(mobiledeposit);
                            }
                            isok = true;
                            //页面输出，表示网关已通知成功
                            returl = ReturnUrl(1, INITools.GetIniKeyValue("paygate", "handleurl"));
                        }
                    }
                }
            }

            ReceiveLog.ResponseData = returl;
            ReceiveLog.ResponseTime = DateTime.Now;
            if (resultpage.IsError)
            {
                ReceiveLog.ResultCode = "0";
            }
            else
            {
                ReceiveLog.ResultCode = "1";
            }
            if (isok)
            {
                ReceiveLog.ResultMessage = "通知成功，发起充值成功";
            }
            else {
                ReceiveLog.ResultMessage = "通知成功，数据异常,描述：" + returl;
            }
            ReceiveLogDAL.Update(ReceiveLog);

            Response.Write(returl);
        }

        private string ReturnUrl(byte result, string reURL)
        {
            return string.Format("<result>{0}</result><reURL>{1}</reURL>", result, reURL);
        }
    }
}
