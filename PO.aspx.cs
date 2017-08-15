using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace com.hjy.fan.WebTouch
{
    public partial class PO : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string uid = Request["openid"] ?? "";
            Session["wxPayOpenid"] = uid;
            string gotoural = Request["ru"];
            gotoural = gotoural == "" ? "/Index.html" : gotoural;

            if (Session["MerchantID_HJY"] != null)
            {
                if (gotoural.IndexOf('?') > -1)
                {
                    gotoural += "&from=" + Session["MerchantID_HJY"].ToString();
                }
                else
                {
                    gotoural += "?from=" + Session["MerchantID_HJY"].ToString();
                }
            }
            Response.Redirect(gotoural, true);
            //  hidgotoural.Value = gotoural;
        }
    }
}