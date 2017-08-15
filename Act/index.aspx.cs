using com.hjy.fan.EntityFacade;
using com.hjy.fan.FrameWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace com.hjy.fan.WebTouch.Act
{
    public partial class index : System.Web.UI.Page
    {
        private string defaulturl = "/";
        private string surl = "/";
        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                string actname=Page.RouteData.Values["actname"] == null ? "" : Page.RouteData.Values["actname"].ToString();

                string nickname = Page.RouteData.Values["nickname"] == null ? "" : Page.RouteData.Values["nickname"].ToString(); ;
                
                string sRounterFrom = Page.RouteData.Values["RounterFrom"] == null ? "" : Page.RouteData.Values["RounterFrom"].ToString();
                EnumActs acts = EnumActs.UnKown;

                if (Enum.TryParse<EnumActs>(actname, out acts))
                {
                    switch (acts)
                    {
                        case EnumActs.SelfCoupons:
                            surl = string.Format("~/Act/20151212/index.html?nickname={0}&t={1}&from={2}", nickname, RandNum.GetRandNum(15), sRounterFrom);
                            break;
                        default:
                            surl = defaulturl;
                            break;
                    }
                    //surl = string.Format(surl, pid, RandNum.GetRandNum(15), sRounterFrom);
                    Response.Redirect(surl, false);
                }
            }
            catch (Exception ex)
            {
                Response.Redirect(defaulturl, false);
            }
        }
    }
}