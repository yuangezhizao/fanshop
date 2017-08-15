using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Text;
using System.Runtime.Serialization;
using com.hjy.fan.EntityFacade;
using com.hjy.fan.FrameWork;
using com.hjy.fan.BusinessLayer;
using com.hjy.fan.BusinessLayer.JYHAPI;

namespace com.hjy.fan.WebTouch.Account
{
    public partial class Login : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void btnlogin_Click(object sender, EventArgs e)
        {
           // ResultPacket rp = new LoginBLL().CheckLogin(txtLogin.Text,txtPass.Text);
            //lblMsg.Text = rp.Description;
        }
    }
}