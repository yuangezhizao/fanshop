using com.hjy.fan.BusinessLayer;
using com.hjy.fan.EntityFacade.Order;
using com.hjy.fan.FrameWork;
using com.hjy.fan.QueryFacade.Order;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace com.hjy.fan.WebTouch.PayResult
{
    //支付网关支付成功后的通知地址，修改订单状态为“支付成功”
    public partial class result : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string returl = "";
            string errstr = "";
            bool isok = false;
            JYH_Pay_ReceiveLogDAL ReceiveLogDAL = new JYH_Pay_ReceiveLogDAL();
            JYH_Pay_ReceiveLog ReceiveLog = new JYH_Pay_ReceiveLog();

            PaygateBLL paydll = new PaygateBLL();
            ResultPacket resultpage = paydll.DoVerify(Request.Params);

            string ReceiveData = "c_mid=" + Request.Params["c_mid"] + "&c_order=" + Request.Params["c_order"] + "&c_orderamount=" + Request.Params["c_orderamount"] + "&c_ymd=" + Request.Params["c_ymd"] + "&c_transnum=" + Request.Params["c_transnum"] + "&c_succmark=" + Request.Params["c_succmark"] + "&c_cause=" + Request.Params["c_cause"] + "&c_moneytype=" + Request.Params["c_moneytype"] + "&dealtime=" + Request.Params["dealtime"] + "&c_memo1=" + Request.Params["c_memo1"] + "&c_memo2=" + Request.Params["c_memo2"] + "&c_signstr=" + Request.Params["c_signstr"] + "&c_paygate=" + Request.Params["c_paygate"] + "&c_version=" + Request.Params["c_version"];

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
                //    memlog.MemID = 0;// Order_List.MemID;
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
                JYH_OrderDAL Order_ListDAL = new JYH_OrderDAL();
                JYH_Order Order_List = Order_ListDAL.GetModel(Request["c_order"]);
                if (Order_List == null)
                {
                    returl = ReturnUrl(0, "充值订单信息未找到");
                }
                else
                {
                    if (!(Order_List.OrderStatus == EntityFacade.EnumOrderStatus.Paying))
                    {
                        returl = ReturnUrl(0, "支付订单状态错误");
                    }
                    else if (Order_List.Buyer_Name != Request["c_memo2"])
                    {
                        returl = ReturnUrl(0, "订单信息与网关信息不符");
                    }
                    else if (Order_List.OrderAmount  != decimal.Parse(Request["c_orderamount"]))
                    {
                        returl = ReturnUrl(0, "订单金额不一致,数据库:" + Order_List.OrderAmount.ToString() + ",通知：" + Request["c_orderamount"]);
                    }
                    else
                    {
                        //页面输出，表示网关已通知成功
                        returl = ReturnUrl(1, "");

                        DataAccess da = new DataAccess();
                        da.BeginTransaction();
                        try
                        {
                            //网关支付成功
                            Order_List.OrderStatus =EntityFacade.EnumOrderStatus.Payed;
                            Order_List.Pay_ResponseTime = DateTime.Now;
                            Order_List.PayGate_Pay_OrderNo = Request["c_transnum"].ToString();
                            int yy = Order_ListDAL.UpdateForPayResult(Order_List, da);

                            if (yy != 1)
                            {
                                returl = ReturnUrl(0, resultpage.Description);
                            }
                            else
                            {
                                    isok = true;
                            }

                            da.Commit();
                        }
                        catch (Exception edd)
                        {
                            da.Rollback();
                            //向综合后台增加日志
                            errstr = "网关通知成功，执行后续操作异常,描述：" + edd.ToString();

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
            else
            {
                ReceiveLog.ResultMessage = "通知成功，增加充值日志异常,描述：" + errstr;
                //向综合后台增加日志
                ProjectLogBLL.NotifyProjectLog("通知成功，增加充值日志异常,描述：" + errstr, "pay_result_err");
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