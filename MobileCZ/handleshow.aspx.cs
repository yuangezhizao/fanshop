

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
using System.Linq;
using System.Text;

using com.hjy.fan.BusinessLayer;
using com.hjy.fan.FrameWork;
using com.hjy.fan.QueryFacade;
using com.hjy.fan.EntityFacade;

namespace com.hjy.fan.WebTouch.MobileCZ
{
    public partial class handleshow : System.Web.UI.Page
    {

        protected string ChzMoney = "0";
        public string backurl = "";
        public static string ShowResult = "";
        RequestCollection rc = new RequestCollection();

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                string merchantid = INITools.GetIniKeyValue("MobileCZ", "merchantid");

                PaygateBLL paydll = new PaygateBLL();
                string showstr = "";
                //ResultPacket resultpackge = paydll.DoVerify(Request.Params);
                //if (!resultpackge.IsError)
                //{

                
                if (Request.Params["c_order"] == null)
                {
                    ShowResult = "<h2>无效的充值订单信息</h2>";
                }
                else
                {
                    string orderno = Request.Params["c_order"];
                    //if (orderno.IndexOf('-') > -1)
                    //{
                    //    orderno = orderno.Split('-')[1];
                    //}

                    JYH_MobileDepositDAL mobiledepositdal = new JYH_MobileDepositDAL();
                    JYH_MobileDeposit mobiledeposit = mobiledepositdal.GetObjectByOrderNo(orderno);
                    if (mobiledeposit == null)
                    {
                        //resultpackge.IsError = true;
                        //resultpackge.Description = "无效的充值订单信息";
                        ShowResult = "<h2>无效的充值订单信息</h2>";
                    }
                    else
                    {
                        string[] ord_group = mobiledeposit.OrderNo.Split('-');
                        string ord = mobiledeposit.OrderNo;
                        if (ord_group.Length > 1)
                        {
                            ord = ord_group[1];
                        }
                        string show_mobile = mobiledeposit.CZMobile.Substring(0, 3) + "****" + mobiledeposit.CZMobile.Substring(7, 4);

                        //if (mobiledeposit.FQMobile.ToString() != Request["c_memo1"])
                        //{
                        //    //resultpackge.IsError = true;
                        //    //resultpackge.Description = "订单信息与网关信息不符";
                        //    showstr = "订单信息与网关信息不符";
                        //}
                        if (mobiledeposit.PayMoney != decimal.Parse(Request["c_orderamount"]))
                        {
                            //resultpackge.IsError = true;
                            //resultpackge.Description = "订单金额不一致";
                            ShowResult = "<h2>订单金额不一致</h2>";
                        }
                        else if (INITools.GetIniKeyValue("MobileCZ", "merchantid") == null)
                        {
                            //resultpackge.IsError = true;
                            //resultpackge.Description = "读取商户编号失败";
                            ShowResult = "<h2>读取商户编号失败</h2>";
                        }
                        else
                        {
                            StringBuilder res = new StringBuilder();

                            //if (Request["wxpay"] != null)
                            //{
                            //    if (Request["wxpay"] == "ok")
                            //    {
                            //        //微信支付成功
                            //        showstr = "充值成功";
                            //        if (mobiledeposit.Status == JYH_MobileDeposit.EnumStatus.Chargeing && mobiledeposit.Status == JYH_MobileDeposit.EnumStatus.ChargeOK && mobiledeposit.Status == JYH_MobileDeposit.EnumStatus.ChargeFail)
                            //        {
                            //            //resultpackge.Description = "订单支付成功，充值进行中";
                            //            showstr = "订单支付成功，充值进行中";

                            //        }
                            //        else if (mobiledeposit.Status == JYH_MobileDeposit.EnumStatus.CZOK)
                            //        {
                            //            //resultpackge.Description = "充值成功";
                            //            showstr = "充值成功";
                            //        }
                            //        else if (mobiledeposit.Status == JYH_MobileDeposit.EnumStatus.Init)
                            //        {
                            //            //resultpackge.Description = "充值成功";
                            //            showstr = "待付款";
                            //        }
                            //        else
                            //        {
                            //            //resultpackge.Description = "充值订单状态异常失败";
                            //            showstr = "充值订单状态异常";
                            //        }

                            //        //res.AppendFormat("支付成功！充值手机号{0}，充值数额{1}{3}，实际支付{2}元，{4}", mobiledeposit.CZMobile, mobiledeposit.OrderMoney, mobiledeposit.PayMoney, mobiledeposit.CZType == "00001" ? "元" : "M", showstr);

                            //        res.AppendFormat("<h2>{3}</h2><p>订单号：{4}，</p><p>充值手机号{0}，</p><p>充值数额{1}元，</p><p>实际支付{2}元</p><p></p>", show_mobile, mobiledeposit.OrderMoney, mobiledeposit.PayMoney, showstr, ord);

                            //    }
                            //    else
                            //    {
                            //        //微信支付失败
                            //        showstr = "<h2>支付失败</h2>";
                            //        res.AppendFormat("{0}", showstr);
                            //    }
                            //}
                            //else
                            //{
                            if (mobiledeposit.Status == JYH_MobileDeposit.EnumStatus.CZOK)
                                {
                                    //resultpackge.Description = "充值成功";
                                    showstr = "订单充值成功";
                                    res.AppendFormat("<h2>{2}</h2><p>订单号：{3}，</p><p>充值手机号：{0}，</p><p>选择商品：{1},</p><p>实际支付：{4}元</p><p></p>", show_mobile, mobiledeposit.Memo, showstr, ord, mobiledeposit.PayMoney.ToString("0.00"));
                                }
                            else if (mobiledeposit.Status == JYH_MobileDeposit.EnumStatus.Chargeing || mobiledeposit.Status == JYH_MobileDeposit.EnumStatus.ChargeOK)
                                {
                                    //resultpackge.Description = "订单支付成功，充值进行中";
                                    showstr = "订单支付成功，充值进行中";
                                    res.AppendFormat("<h2>{2}</h2><p>订单号：{3}，</p><p>充值手机号：{0}，</p><p>选择商品：{1},</p><p>实际支付：{4}元</p><p></p>", show_mobile, mobiledeposit.Memo, showstr, ord, mobiledeposit.PayMoney.ToString("0.00"));

                                }
                            else if (mobiledeposit.Status == JYH_MobileDeposit.EnumStatus.BackMoneyFinish)
                            {
                                //resultpackge.Description = "订单支付成功，充值进行中";
                                showstr = "已退款";
                                res.AppendFormat("<h2>{2}</h2><p>订单号：{3}，</p><p>充值手机号：{0}，</p><p>选择商品：{1},</p><p>实际支付：{4}元</p><p></p>", show_mobile, mobiledeposit.Memo, showstr, ord, mobiledeposit.PayMoney.ToString("0.00"));

                            }
                            else if (mobiledeposit.Status == JYH_MobileDeposit.EnumStatus.Backing || mobiledeposit.Status == JYH_MobileDeposit.EnumStatus.SendBack)
                            {
                                //resultpackge.Description = "订单支付成功，充值进行中";
                                showstr = "退款中";
                                res.AppendFormat("<h2>{2}</h2><p>订单号：{3}，</p><p>充值手机号：{0}，</p><p>选择商品：{1},</p><p>实际支付：{4}元</p><p></p>", show_mobile, mobiledeposit.Memo, showstr, ord, mobiledeposit.PayMoney.ToString("0.00"));

                            }

                                else if(mobiledeposit.Status == JYH_MobileDeposit.EnumStatus.ChargeFail){
                                    showstr = "订单充值失败";
                                    res.AppendFormat("<h2>{2}</h2><p>订单号：{3}，</p><p>充值手机号：{0}，</p><p>选择商品：{1}</p><p></p>", show_mobile, mobiledeposit.Memo, showstr, ord);
                                }
                                
                                else if (mobiledeposit.Status == JYH_MobileDeposit.EnumStatus.Init)
                                {
                                    //resultpackge.Description = "充值成功";
                                    showstr = "订单待付款";
                                    res.AppendFormat("<h2>{2}</h2><p>订单号：{3}，</p><p>充值手机号：{0}，</p><p>选择商品：{1}</p><p></p>", show_mobile, mobiledeposit.Memo, showstr, ord);

                                }
                                else
                                {
                                    //resultpackge.Description = "充值订单状态异常失败";
                                    showstr = "订单状态异常";
                                    res.AppendFormat("<h2>{2}</h2><p>订单号：{3}，</p><p>充值手机号：{0}，</p><p>选择商品：{1}</p><p></p>", show_mobile, mobiledeposit.Memo, showstr, ord);

                                }

                                //res.AppendFormat("<h2>{2}</h2><p>订单号：{3}，</p><p>充值手机号：{0}，</p><p>充值面额：{1}元,</p><p>实际支付：{4}元</p><p></p>", show_mobile, mobiledeposit.OrderMoney.ToString("0.00"), showstr, ord, mobiledeposit.PayMoney.ToString("0.00"));
                            //}
                            ShowResult = res.ToString();
                        }
                    }

                    //  }

                }
            }
        }

        private void SetMac(string Signtype)
        {
            string[] src = new string[rc.Keys.Length];
            for (int i = 0; i < rc.Keys.Length; i++)
            {
                src[i] = rc[i].Trim();
            }
            var srcordered = src.OrderBy(s => s);
            string mac = "";
            if (Signtype == "MD5")
            {
                mac = string.Join("", srcordered) + INITools.GetIniKeyValue("MobileCZ", "MD5_key").Trim();
                rc.Set("mac", DESHelper.ComputeMD5Hash(mac));
            }
            else
            {
                mac = string.Join("", srcordered);
                rc.Set("mac", RSAHelper.SignWithSHA1(INITools.GetIniKeyValue("MobileCZ", "RSA_private_key").Trim(), mac));
            }
        }
    }
}
