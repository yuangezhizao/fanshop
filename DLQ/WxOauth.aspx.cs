using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using com.hjy.fan.BusinessLayer;

namespace com.hjy.fan.WebTouch.DLQ
{
    public partial class WxOauth : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string dlqUrl = new DLQ_WxBLL().GetDLQUrl(Request["QRcode_Scene_str"], Request["openid"]);
            ProjectLogBLL.NotifyProjectLog(string.Format("from:{0} openid:{1} dlqUrl:{2}", Request["QRcode_Scene_str"], Request["openid"], Request["dlqUrl"]), "dlqwx");
            Response.Redirect(dlqUrl, true);
        }
    }
}