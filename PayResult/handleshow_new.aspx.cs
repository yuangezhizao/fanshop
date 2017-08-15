using com.hjy.fan.BusinessLayer;
using com.hjy.fan.EntityFacade;
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
    public partial class handleshow_new : System.Web.UI.Page
    {
        public static string ShowResult = "";
        public static string OrderNo = "";

        RequestCollection rc = new RequestCollection();

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {

                //{ reurl}?c_succmark ={ c_succmark}
                //&resultmsg ={ resultmsg}
                //&c_order ={ c_order}
                //&c_mid ={ c_mid}
                //&orderid ={ orderid}

                string merchantid = INITools.GetIniKeyValue("MobileCZ", "merchantid");

                string showstr = "";
                if (Request.Params["c_order"] == null)
                {
                    ShowResult = "<h2>无效的充值订单信息</h2>";
                }
                else
                {
                    OrderNo = Request.Params["c_order"];
                    hid_orderno.Value = OrderNo;

                    JYH_OrderDAL Order_ListDAL = new JYH_OrderDAL();
                    JYH_Order Order_List = Order_ListDAL.GetModel(Request["c_order"]);

                    string paytype = "";
                    if (Order_List.PayGateType == EnumPaygateType.alipay_app || Order_List.PayGateType == EnumPaygateType.alipay_wap || Order_List.PayGateType == EnumPaygateType.alipay_web)
                    {
                        paytype = "alipay";
                    }
                    else if (Order_List.PayGateType == EnumPaygateType.wx)
                    {
                        paytype = "wxpay";
                    }

                    if (Request.Params["c_succmark"] != "Y")
                    {
                        ShowResult = "支付失败";
                        //Response.Redirect("/Order/OrderDetail.html?oid="+ OrderNo, true);
                        string restr = "/Order/OrderFail.html?orderid=" + OrderNo + "&out_trade_no=" + Request.Params["orderid"] + "&paytype=" + paytype;
                        Response.Redirect(restr, true);
                        return;

                    }
                    else
                    {
                        //更新本地订单状态
                        //DataAccess da = new DataAccess();
                        //da.BeginTransaction();
                        //try
                        //{
                        //    //网关支付成功
                        //    //Order_List.OrderStatus = EntityFacade.EnumOrderStatus.Payed;
                        //    //Order_List.Pay_ResponseTime = DateTime.Now;
                        //    //Order_List.PayGate_Pay_OrderNo = Request["c_transnum"].ToString();
                        //    //int yy = Order_ListDAL.UpdateForPayResult(Order_List);

                        //    //da.Commit();
                        //}
                        //catch (Exception edd)
                        //{
                        //    //da.Rollback();
                        //}

                        string restr = "/Order/OrderSuccess.html?orderid=" + OrderNo + "&out_trade_no=" + Request.Params["orderid"] + "&paytype=" + paytype;

                        Response.Redirect(restr, true);
                        return;

                    }
                }
            }
        }

    }
}