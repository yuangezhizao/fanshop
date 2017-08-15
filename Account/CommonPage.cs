using System;
using System.Web;
using System.Web.Compilation;
using System.Linq;
using Starsoft.Core;
using Starsoft.Core.Encoders;
using Starsoft.Web;
using com.hjy.fan.EntityFacade;
using System.Collections.Specialized;
using System.Collections.Generic;

namespace com.hjy.fan.WebTouch
{
    public class CommonPage : Starsoft.Web.Page
    {
        protected override void OnInit(EventArgs e)
        {
            try
            {
                string varID = Request["v"];
                if (!string.IsNullOrEmpty(varID))
                {
                    Session["FromSiteVarID"] = varID;
                }
            }
            catch
            {
                Session["FromSiteVarID"] = "0";
                Session["FromSiteName"] = "";
            }
        }

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            #region 注:以下代码只对登录页面/member/login.aspx继承
            if (Request.Url.LocalPath.ToLower().Contains("/member/login.aspx"))
            {
                if (IsPost)
                {
                    if (this.IsLogin)
                    {
                        this.Redirect();
                    }
                }

                if (string.IsNullOrEmpty(Request.Form["opreate"]))
                {
                    //检查是否有其它post数据需要跟传,利用ViewStat存放
                    if (Request.Form.Count > 0)
                    {
                        string postdata = null;
                        foreach (string key in Request.Form.Keys)
                        {
                            if (key != "text_username" || key != "text_password")
                            {
                                postdata += (postdata == null ? "" : "&") + key + "=" + Request.Form[key];
                            }
                        }
                        this.Values["hide_postdata"] = postdata;
                    }
                }
            }
            #endregion
        }

        //根据请求URL重定向,如果Post请示中有postdata项则帮登录前的页转Post请求并重定向,无则使用普通重定向
        private void Redirect()
        {
            string url = Request.QueryString["returnurl"];
            if (!string.IsNullOrEmpty(Request.Form["hide_postdata"]))
            {
                string formHtml = " <html><body><form name=\"form_postdata\" id=\"form_postdata\" method=\"post\" action='" + (string.IsNullOrWhiteSpace(url) ? "/member/index.aspx" : url) + "'>";
                Dictionary<string, string> dict = new Dictionary<string, string>();
                Request.Form["hide_postdata"].ToString().Split('&').ToList().ForEach(p => dict.Add(p.Split('=')[0], p.Split('=')[1]));
                foreach (string key in dict.Keys)
                {
                    formHtml += "<input type=hidden name ='" + key + "' value='" + dict[key] + "'> ";
                }
                formHtml += "</form>";
                formHtml += "<script language='javascript'>document.forms[\"form_postdata\"].submit();</script></body></html>";

                Response.Clear();
                Response.Write(formHtml);
                Response.End();
            }
            else
            {
                Response.Redirect(string.IsNullOrWhiteSpace(url) ? "/member/index.aspx" : url);
                Response.End();
            }
        }

        #region 基础属性
        /// <summary>
        /// 是否登录
        /// </summary>
        protected bool IsLogin
        {
            get { return true; }
        }

        /// <summary>
        /// 来源是否是App
        /// </summary>
        protected bool IsFromApp
        {
            get 
            {
                if (FromSiteName == "i" || FromSiteName == "a")
                {
                    return true;
                }
                return false;
            }
        }

        /// <summary>
        /// 来源网站名称
        /// </summary>
        protected string FromSiteName
        {
            get
            {
                return Session["FromSiteName"] == null ? "" : Session["FromSiteName"].ToString();
            }
        }

        /// <summary>
        /// 根据webvar计算规则，会员实际所属的varid编号
        /// </summary>
        protected int VarID
        {
            get
            {
                //if (Recommend_Member.CurrentMem != null)
                //{                    
                //    return Recommend_Member.CurrentMem.WebVarID;
                //}
                //else
                //{
                //    return FromVarID;
                //}
                return FromVarID;
            }
        }

        /// <summary>
        /// 来源网站所属的VARID
        /// </summary>
        protected int FromVarID
        {
            get
            {
                try
                {
                    return int.Parse(Session["fromvarid"].ToString());
                }
                catch
                {
                    return 0;
                }
                //try
                //{
                //    if (Session["FromSiteVarID"] != null)
                //    {
                //        return int.Parse(Session["FromSiteVarID"].ToString());
                //    }
                //    else
                //    {
                //        if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request["varid"]))
                //        {
                //            Session["FromSiteVarID"] = int.Parse(System.Web.HttpContext.Current.Request["varid"]);
                //            return int.Parse(System.Web.HttpContext.Current.Request["varid"]);
                //        }
                //        else if (!string.IsNullOrEmpty(System.Web.HttpContext.Current.Request["v"]))
                //        {
                //            Session["FromSiteVarID"] = int.Parse(System.Web.HttpContext.Current.Request["v"]);
                //            return int.Parse(System.Web.HttpContext.Current.Request["v"]);
                //        }
                //        else
                //            return 0;
                //    }
                //}
                //catch
                //{
                //    return 0;
                //}
            }
        }

        protected string SiteName { get { return System.Configuration.ConfigurationManager.AppSettings["SiteName"]; } }
        #endregion

        #region 配置属性
        //private string _systemmainurl = null;
        ///// <summary>
        ///// 系统所在根目录
        ///// </summary>
        //public string SystemMainUrl
        //{
        //    get
        //    {
        //        try
        //        {
        //            _systemmainurl = System.Configuration.ConfigurationManager.AppSettings["SystemMainUrl"];
        //        }
        //        catch
        //        {
        //            _systemmainurl = "";
        //        }
        //        return _systemmainurl;
        //    }
        //}

        ///// <summary>
        ///// 前台UI对应API路径
        ///// </summary>
        //public string LotteryAPIPath
        //{
        //    get
        //    {
        //        return SiteConfig.LotteryAPIPath;
        //    }
        //}

        ///// <summary>
        ///// 静态资源地址
        ///// </summary>
        //public string LotteryAPIData { get { return SiteConfig.LotteryAPIData; } }

        ///// <summary>
        ///// 静态资源地址
        ///// </summary>
        //public string LotteryNews { get { return SiteConfig.LotteryNews; } }

        /// <summary>
        /// 本站点使用的域，用于js交互
        /// </summary>
        public string DomainUrl
        {
            get
            {
                return System.Configuration.ConfigurationManager.AppSettings["DomainUrl"];
            }
        }

        /// <summary>
        /// 和账户中心交互参数的aes加密key
        /// </summary>
        public string AccountWebSiteParamsKey
        {
            get
            {
                return System.Configuration.ConfigurationManager.AppSettings["AccountWebSiteParamsKey"];
            }
        }

        /// <summary>
        /// 论坛地址
        /// </summary>
        public string LotteryBBS
        {
            get
            {
                return System.Configuration.ConfigurationManager.AppSettings["LotteryBBS"];
            }
        }

        /// <summary>
        /// 新闻资讯板块
        /// </summary>
        public string LotteryNewsUrl
        {
            get
            {
                return System.Configuration.ConfigurationManager.AppSettings["LotteryNewsUrl"];
            }
        }

        /// <summary>
        /// 账户中心地址
        /// </summary>
        public string AccountCenterUrl
        {
            get
            {
                return System.Configuration.ConfigurationManager.AppSettings["AccountCenterUrl"];
            }
        }

        /// <summary>
        /// 新闻详情地址
        /// </summary>
        public string WebNewsFilePath
        {
            get
            {
                return System.Configuration.ConfigurationManager.AppSettings["WebNewsFilePath"];
            }
        }

        #endregion

        #region 全局消息对话框

        /// <summary>
        /// 全局消息对话框
        /// </summary>
        /// <param name="message">提示消息</param>
        public virtual void Notify(string message)
        {
            Notify(message, false);
        }

        public virtual void Notify(string title, string message)
        {
            Notify(title, message, null, null, null, false);
        }

        /// <summary>
        /// 全局消息对话框
        /// </summary>
        /// <param name="message">提示消息</param>
        /// <param name="showback">是否显示返回上一页</param>
        public virtual void Notify(string message, bool showback)
        {
            Notify(null, message, null, null, null, showback);
        }

        /// <summary>
        /// 全局消息对话框
        /// </summary>
        /// <param name="title">提示标题</param>
        /// <param name="message">提示消息</param>
        /// <param name="javascript">要呈现的客户端脚本</param>
        /// <param name="links">链接地址结构体，结构体形式如：链接文本;链接Url;链接目标，注意中间用英文分号分隔，多个结构体用|分隔</param>
        /// <param name="autojump">自动跳转的地址，为空表示不自动跳转，为“back”表示跳转回本页地址</param>
        /// <param name="showback">是否显示返回上一页链接</param>
        protected virtual void Notify(string title, string message, string javascript, string links, string autoJump, bool showBack)
        {
            //Response.Clear();
            //Type ctrlType = BuildManager.GetCompiledType("~/Notify/Default.aspx");
            //NotifyPage viewPage = Activator.CreateInstance(ctrlType) as NotifyPage;
            //if (viewPage != null)
            //{
            //    viewPage.Prompt.Title = title;
            //    viewPage.Prompt.Message = message;
            //    viewPage.Prompt.Javascript = javascript;
            //    viewPage.Prompt.Links = links;
            //    viewPage.Prompt.Autojump = autoJump;
            //    viewPage.Prompt.ShowBack = showBack;

            //    viewPage.RenderView(this.Context);
            //}
            //else
            //{
            //    throw new InvalidOperationException("The Page must derive from NotifyPage");
            //}

            //Response.End();
        }

        /// <summary>
        /// 全局消息对话框
        /// </summary>
        /// <param name="pageurl">提示页地址</param>
        /// <param name="title">提示标题</param>
        /// <param name="message">提示消息</param>
        /// <param name="javascript">要呈现的客户端脚本</param>
        /// <param name="links">链接地址结构体，结构体形式如：链接文本;链接Url;链接目标，注意中间用英文分号分隔，多个结构体用|分隔</param>
        /// <param name="autojump">自动跳转的地址，为空表示不自动跳转，为“back”表示跳转回本页地址</param>
        /// <param name="showback">是否显示返回上一页链接</param>
        protected virtual void Notify(string pageurl, string title, string message, string javascript, string links, string autoJump, bool showBack)
        {
            //try
            //{
            //    Response.Clear();
            //}
            //catch 
            //{
            //}

            //Type ctrlType = BuildManager.GetCompiledType(pageurl);
            //NotifyPage viewPage = Activator.CreateInstance(ctrlType) as NotifyPage;
            //if (viewPage != null)
            //{
            //    viewPage.Prompt.Title = title;
            //    viewPage.Prompt.Message = message;
            //    viewPage.Prompt.Javascript = javascript;
            //    viewPage.Prompt.Links = links;
            //    viewPage.Prompt.Autojump = autoJump;
            //    viewPage.Prompt.ShowBack = showBack;

            //    viewPage.RenderView(this.Context);
            //}
            //else
            //{
            //    throw new InvalidOperationException("The Page must derive from NotifyPage");
            //}

            //try
            //{
            //    Response.End();
            //}
            //catch
            //{
            //    throw new Exception("noerr");
            //}
        }


        /// <summary>
        /// 当前页呈现JS消息
        /// </summary>
        /// <param name="element">验证元素的名称</param>
        /// <returns></returns>
        protected string RenderScriptMessage(string element)
        {
            string result = "";
            if (!string.IsNullOrEmpty(element))
            {
                if (this.MessageValues != null && !string.IsNullOrEmpty(this.MessageValues[element]))
                {
                    //return "<script>$(function(){noty({text:\"" + this.MessageValues[element] + "\"});});</script>";
                    return "<script>ShowMesaage(\"" + this.MessageValues[element] + "\")</script>";
                }
            }
            return result;
        }

        /// <summary>
        /// 当前页呈现提示消息
        /// </summary>
        /// <param name="element">验证元素的名称</param>
        /// <returns></returns>
        protected string RenderNotifyMessage(string element)
        {
            string result = "";
            if (!string.IsNullOrEmpty(element))
            {
                if (this.MessageValues != null && !string.IsNullOrEmpty(this.MessageValues[element]))
                {
                    return string.Format("<span>{0}</span>", this.MessageValues[element]);
                }
            }
            return result;
        }
        #endregion

        #region 其它属性
        /// <summary>
        /// 值集合
        /// </summary>
        public NameValueCollection Values
        {
            set;
            get;
        }

        /// <summary>
        /// 提示消息集合
        /// </summary>
        public NameValueCollection MessageValues
        {
            set;
            get;
        }
        #endregion

       
    }
}
