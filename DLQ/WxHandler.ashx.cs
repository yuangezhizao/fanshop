using System;
using System.Data;
using System.Web;
using System.Collections;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Web.SessionState;
using System.Drawing;
using System.IO;
using System.Drawing.Imaging;
using com.ichsy.jyh.EntityFacade;
using com.ichsy.jyh.BusinessLayer;

namespace com.ichsy.jyh.WebTouch.Ajax
{
    /// <summary>
    /// WxHandler 的摘要说明
    /// </summary>
    public class WxHandler : IHttpHandler, IRequiresSessionState
    {

        public void ProcessRequest(HttpContext context)
        {
            //不让浏览器缓存
            context.Response.Buffer = true;
            context.Response.ExpiresAbsolute = DateTime.Now.AddDays(-1);
            context.Response.AddHeader("pragma", "no-cache");
            context.Response.AddHeader("cache-control", "");
            context.Response.CacheControl = "no-cache";
            context.Response.ContentType = "text/plain";
            JYH_DLQ_WxOpenBind dlqMod = new JYH_DLQ_WxOpenBind();
            dlqMod.MerchantKey = context.Request["from"];
            dlqMod.WxOpen_ID = context.Request["openid"];
            DLQ_WxBLL.Insert(dlqMod);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}