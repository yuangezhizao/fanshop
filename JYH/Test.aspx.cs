using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using com.hjy.fan.BusinessLayer.JYHAPI;
using com.hjy.fan.FrameWork;
using com.hjy.fan.BusinessLayer;
using System.Collections.Specialized;

namespace com.hjy.fan.WebTouch.JYH
{
    public partial class Test : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            SortedDictionary<string, string> sPara = GetRequestGet();
            Notify aliNotify = new Notify();
            bool verifyResult = aliNotify.Verify(sPara, Request.QueryString["notify_id"], Request.QueryString["sign"]);
        }

        protected void Button1_Click(object sender, EventArgs e)
        {
            //string sPara = "is_success=T&notify_id=RqPnCoPT3K9%252Fvwbh3InSPg1UANzSw%252F6OVmEzTRHnQctK6%252BxrC2u4tY6zULh9kF%252BSH3ec&notify_time=2015-07-28+16%3A26%3A10&notify_type=trade_status_sync&out_trade_no=OS150728100052&payment_type=1&seller_id=2088911718925902&service=alipay.wap.create.direct.pay.by.user&subject=%E5%95%86%E5%93%81&total_fee=1.00&trade_no=2015072800001000390011440906&trade_status=TRADE_SUCCESS&sign=ce9c2df146ab14194d89588ebf4306ba&sign_type=MD5";
            //Notify aliNotify = new Notify();
            //bool verifyResult = aliNotify.Verify(sPara, "RqPnCoPT3K9%252Fvwbh3InSPg1UANzSw%252F6OVmEzTRHnQctK6%252BxrC2u4tY6zULh9kF%252BSH3ec", "ce9c2df146ab14194d89588ebf4306ba");
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