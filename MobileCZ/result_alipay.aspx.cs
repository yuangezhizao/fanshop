
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
using com.ichsy.jyh.BusinessLayer;
using com.ichsy.jyh.FrameWork;
using com.ichsy.jyh.QueryFacade;
using com.ichsy.jyh.EntityFacade;


namespace com.ichsy.jyh.WebTouch
{
    //支付网关支付成功后的通知地址，修改订单状态为“支付成功”
    public partial class result_alipay : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

            string returl = "";

            PaygateBLL paydll = new PaygateBLL();
            ResultPacket resultpage = paydll.DoVerify(Request.Params);
            if (resultpage.IsError)
            {
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
                    else if (mobiledeposit.FQMobile != Request["c_memo1"])
                    {
                        returl = ReturnUrl(0, "订单信息与网关信息不符");
                    }
                    else if (mobiledeposit.OrderMoney != decimal.Parse(Request["c_orderamount"]))
                    {
                        returl = ReturnUrl(0, "订单金额不一致");
                    }
                    else
                    {
                        //网关支付成功
                        mobiledeposit.Status = JYH_MobileDeposit.EnumStatus.ChargeOK;
                        mobiledeposit.ResponseTime = QueryBase.GetDataBaseDate();
                        mobiledeposit.Succmark = "Y";
                        mobiledeposit.AccountTime = DateTime.ParseExact(Request["dealtime"], "yyyyMMddHHmmss", null);
                        int yy=mobiledepositdal.Update(mobiledeposit);

                        string FQ_CZ_mobile = string.IsNullOrEmpty(Request["c_memo2"]) ? "00" : Request["c_memo2"];

                        if (yy==1)
                        {
                            returl = ReturnUrl(0, resultpage.Description);
                        }
                        else
                        {
                            //调用充值接口,保存，便于在handleshow.aspx中查询
                            string outStrin="";
                            ResultPacket rp = com.ichsy.jyh.BusinessLayer.MobileCZAPI.RequestBLL.Request_MobileCZ(Request["c_memo1"],Request["c_order"], Request["c_orderamount"],out outStrin);
                            if (rp.IsError)
                            {
                                mobiledeposit.Status = JYH_MobileDeposit.EnumStatus.ChargeFail;
                                mobiledeposit.DealMemo += "," + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "调用手机充值接口返回失败，描述：" + rp.Description;
                                mobiledepositdal.Update(mobiledeposit);
                            }
                            else {
                                mobiledeposit.Status = JYH_MobileDeposit.EnumStatus.Chargeing;
                                mobiledepositdal.Update(mobiledeposit);
                            }

                            //页面输出，表示网关已通知成功
                            returl = ReturnUrl(1, INITools.GetIniKeyValue("paygate", "handleurl"));
                        }
                    }
                }
            }



            Response.Write(returl);
        }

        private string ReturnUrl(byte result, string reURL)
        {
            return string.Format("<result>{0}</result><reURL>{1}</reURL>", result, reURL);
        }
    }
}
