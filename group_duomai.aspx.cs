using com.hjy.fan.FrameWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace com.hjy.fan.WebTouch
{
    public partial class group_duomai : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

            if (!IsPostBack)
            {
                StringBuilder paramStr = new StringBuilder();
                string from = "";
                if (Request["union_id"] != null)
                {
                    from = Request["union_id"];
                    paramStr.Append("&union_id=" + Request["from"] + "&from=" + from);

                }
                string feedback = "";
                if (Request["feedback"] != null)
                {
                    paramStr.Append("&feedback=" + Request["feedback"]);
                    feedback = Request["feedback"].ToString();
                }
                if (Request["mid"] != null)
                {
                    paramStr.Append("&mid=" + Request["mid"]);
                }

                string to = "";
                if (Request["to"] != null)
                {
                    to = HttpUtility.UrlDecode(Request["to"]);
                    paramStr.Append("&to=" + Request["to"]);
                }

                string fromurl = "";
                if (Request.UrlReferrer != null)
                {
                    fromurl = HttpUtility.UrlEncode(Request.UrlReferrer.ToString());
                }
                else
                {
                    fromurl = HttpUtility.UrlEncode(Request.Url.AbsoluteUri);
                }
                if (fromurl.IndexOf("feedback") == -1)
                {
                    fromurl += HttpUtility.UrlEncode("&feedback=" + feedback);
                }
                if (fromurl.IndexOf("union_id") == -1)
                {
                    fromurl += HttpUtility.UrlEncode("&union_id=" + from);
                }

                paramStr.Append("&fromurl=" + fromurl);

                if (to.IndexOf('?') > -1)
                {
                    Response.Redirect(to + "&t=" + RandHelper.Next(10000000, 99999999).ToString() + paramStr, true);
                }
                else
                {
                    Response.Redirect(to + "?t=" + RandHelper.Next(10000000, 99999999).ToString() + paramStr, true);
                }


            }
        }
    }
}