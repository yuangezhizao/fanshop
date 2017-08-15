


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
    //手机充值接口充值成功后通知页面，此页面中更新订单状态
    public partial class result_CZ : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string returl = "";
            string temp = "";
            bool isok = false;
            JYH_MobileCZ_ReceiveLogDAL ReceiveLogDAL = new JYH_MobileCZ_ReceiveLogDAL();
            JYH_MobileCZ_ReceiveLog ReceiveLog = new JYH_MobileCZ_ReceiveLog();

            //http://wx.lacues.cn/MobileCZ/result_CZ.aspx?resultcode=0&OrderNo=ichsy000001-And20150930142000943&OrderStatus=100&YMD=20151008182745&CHZAmount=10.0000&PayAmount=9.9950&mac=jSQs98WY6VnFmCcYRUNFbmv5T2GjDR0jUtf5EjCIWipcL8%2fEZ9%2foHX7wJ95be6jsYc27fdi8CKyBXxf%2bZ%2fnqHjY25D2%2f9nAWztNOPDRy5uTi3ylCSJjQLcUY1G%2b%2fHLUpJM0dcnS2sEcFSg05%2fiCWNncXnC0kyTY%2fcS9eeG%2fWGc4%3d
            PaygateBLL paydll = new PaygateBLL();

            ResultPacket resultpage=new ResultPacket(true,"90","参数错误");

            string orderno = Request.Params["OrderNo"];
            if (orderno != null)
            {
                ReceiveLog.TradeType = "mobilechz";
                ReceiveLog.TradeDesp = "支付网关通知";
                ReceiveLog.ReceiveData = Request.Params.ToString();
                ReceiveLog.Receivetime = DateTime.Now;
                ReceiveLog.OrderNo = orderno;
                ReceiveLogDAL.Insert(ReceiveLog);

                //验签
                resultpage = paydll.DoVerify_rsa(Request.Params);

                //if (orderno.IndexOf('-') > -1)
                //{
                //    orderno = orderno.Split('-')[1];
                //}

               

                if (resultpage.IsError)
                {
                    returl = ReturnUrl("fail", resultpage.Description);
                }
                else
                {
                    JYH_MobileDepositDAL mobiledepositdal = new JYH_MobileDepositDAL();
                    JYH_MobileDeposit mobiledeposit = mobiledepositdal.GetObjectByOrderNo(orderno);
                    if (mobiledeposit == null)
                    {
                        returl = ReturnUrl("success", "充值订单信息未找到");
                        temp = "充值订单信息未找到";
                    }
                    else
                    {
                        if (byte.Parse(Request["OrderStatus"].ToString()) == (byte)JYH_MobileDeposit.EnumStatus.BackMoneyFinish)
                        {
                            //已退款
                            mobiledeposit.Status = JYH_MobileDeposit.EnumStatus.BackMoneyFinish;
                            mobiledeposit.DealMemo += "," + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "手机充值接口通知充值结果：已退款，订单状态：" + Request["OrderStatus"];
                            mobiledeposit.CZNotifTime = QueryBase.GetDataBaseDate();
                            mobiledepositdal.UpdateCZNotifTime(mobiledeposit);

                            returl = ReturnUrl("success", "");
                        }
                        else if (mobiledeposit.Status != JYH_MobileDeposit.EnumStatus.SendBack && mobiledeposit.Status != JYH_MobileDeposit.EnumStatus.Backing && mobiledeposit.Status != JYH_MobileDeposit.EnumStatus.ChargeOK && mobiledeposit.Status != JYH_MobileDeposit.EnumStatus.Chargeing)
                        {
                            returl = ReturnUrl("success", "充值订单状态错误");
                            temp = "充值订单状态错误,status:" + mobiledeposit.Status.ToString();

                        }
                        else if (mobiledeposit.OrderMoney != decimal.Parse(Request["CHZAmount"]))
                        {
                            returl = ReturnUrl("success", "订单金额不一致");
                            temp = "订单金额不一致,数据库:" + mobiledeposit.OrderMoney.ToString() + ",通知：" + Request["CHZAmount"];

                        }
                        else
                        {
                            //if (byte.Parse(Request["OrderStatus"].ToString()) != (byte)JYH_MobileDeposit.EnumStatus.CZOK)
                            //{
                                //充值成功，
                                mobiledeposit.Status = JYH_MobileDeposit.EnumStatus.CZOK;
                            //}
                            //else
                            //{
                            //    //充值失败，
                            //    mobiledeposit.Status = JYH_MobileDeposit.EnumStatus.ChargeFail;
                            //    mobiledeposit.DealMemo += "," + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "手机充值接口通知充值结果：充值失败，订单状态：" + Request["OrderStatus"];

                            //}
                            mobiledeposit.CZNotifTime = QueryBase.GetDataBaseDate();
                            mobiledepositdal.UpdateCZNotifTime(mobiledeposit);

                            isok = true;
                            //页面输出，表示接口已通知成功
                            returl = ReturnUrl("success", "");
                        }
                    }
                }

                ReceiveLog.ResponseData = returl;
                ReceiveLog.ResponseTime = DateTime.Now;
            }
            else
            {
                returl = ReturnUrl("fail", "缺少订单号");
                temp = "按订单号未查到数据";

                ReceiveLog.ResponseData = returl;
                ReceiveLog.ResponseTime = DateTime.Now;
                ReceiveLog.TradeType = "mobilechz";
                ReceiveLog.TradeDesp = "支付网关通知";
                ReceiveLog.ReceiveData = Request.Params.ToString();
                ReceiveLog.Receivetime = DateTime.Now;
                ReceiveLog.OrderNo = "";
                ReceiveLogDAL.Insert(ReceiveLog);

            }

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
                ReceiveLog.ResultMessage = "通知成功，充值成功";
            }
            else
            {
                if (byte.Parse(Request["OrderStatus"].ToString()) == (byte)JYH_MobileDeposit.EnumStatus.BackMoneyFinish)
                {
                    ReceiveLog.ResultMessage = "通知成功，接收到已退款通知";
                }
                else
                {
                    ReceiveLog.ResultMessage = "通知成功，数据处异常" + temp;
                }
            }
            ReceiveLogDAL.Update(ReceiveLog);

            Response.Write(returl);
            
        }

        private string ReturnUrl(string result, string reURL)
        {
            return string.Format("{0}", result);
        }
    }

}
