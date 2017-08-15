
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using System.Collections.Specialized;
using System.Configuration;
using com.hjy.fan.BusinessLayer;
using com.hjy.fan.BusinessLayer.JYHAPI;
using com.hjy.fan.BusinessLayer.WxPayAPI;
using com.hjy.fan.BusinessLayer.WxJsApi;
using com.hjy.fan.FrameWork;
using com.hjy.fan.EntityFacade;
using com.hjy.fan.EntityFacade.Json;
using com.hjy.fan.QueryFacade;

namespace com.hjy.fan.WebTouch.Ajax
{
    public partial class MobileCZAPI : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string outString = "";
            string FQmobile = "";
            try
            {
                ResultPacket rp = new ResultPacket();
                Json_Response_Base.resultPackage jrp = new Json_Response_Base.resultPackage();
                switch (Request["action"])
                {
                    //获得产品[]
                    case "getcplist":
                        //临时生成RSA公钥和私钥
                        //string rsa_public_key="";
                        //string rsa_private_key="";
                        //RSAHelper.CreateKey(out rsa_public_key,out  rsa_private_key, 1024);
                        
                        if(Request["cztype"]==null){
                            outString="缺少充值类型";
                        }
                        else if (Request["allChzAmount"] == null)
                        {
                            outString = "缺少面值数据";
                        }
                        else if (Request["mobileno"] == null)
                        {
                            outString = "缺少手机号";
                        }
                        else if (Request["clientType"] == null)
                        {
                            outString = "缺少来源类型";
                        }
                        else
                        {
                            string orderno = "";
                            DataTable dt_t=new DataTable();
                            string [] group=Request["allChzAmount"].Split('|');
                            string temp="";
                            switch (Request["cztype"])
                            {
                                case "00001":
                                    //充值金额【单个返回参数：折扣率|销售价格|运营商|省份名字|面额|产品销售状态(0产品不存在,1正常销售,2暂停销售)|产品编号（发起充值时的产品编号）|产品名称|提交订单号 】
                                    for(int i=0;i<group.Length;i++){
                                        //生成查询商品的提交订单号，流量充值产品查询接口需要
                                        orderno = RunProcedure.Exec_CreateSerialNoForCZ(byte.Parse(Request["clientType"].ToString()));

                                        temp = "";
                                        com.hjy.fan.BusinessLayer.MobileCZAPI.RequestBLL.Request_MobileSearchProduct(orderno,Request["mobileno"], "", "", group[i], "00001", out temp);
                                        outString += temp + "^";
                                    }
                                    outString = outString.TrimEnd('^');
                                    break;
                                case "00002":
                                    //充值流量【单个返回参数：折扣率|销售价格|运营商|省份名字|面额|产品销售状态(0产品不存在,1正常销售,2暂停销售) |产品编号（发起充值时的产品编号）|产品名称|提交订单号】
                                    for (int i = 0; i < group.Length; i++)
                                    {
                                        //生成查询商品的提交订单号，流量充值产品查询接口需要
                                        orderno = RunProcedure.Exec_CreateSerialNoForCZ(byte.Parse(Request["clientType"].ToString()));
                                        temp = "";
                                        com.hjy.fan.BusinessLayer.MobileCZAPI.RequestBLL.Request_MobileSearchProduct_LiuLiang(orderno,Request["mobileno"], "", "", group[i], "00002", out temp);
                                        outString += temp + "^";
                                    }
                                    outString = outString.TrimEnd('^');
                                    break;
                            }
                        }
                        break;
                    //提交至网关[作废]
                    case "cztopaygate":
                        outString = "";
                        string payGateOrderNo = "";
                        string notifyurl = "";
                        if (Request["paymoney"] == "" || Request["orderno"] == "" || Request["cztype"] == "" || Request["paygate"] == "" || Request["clienttype"] == "" || Request["fqmobile"] == "" || Request["czmobile"] == "" || Request["czmoney"] == "")
                        {
                            //outString = "缺少参数";
                            outString = string.Format("{\"result\":90,\"msg\":\"缺少参数\",\"orderno\":\"\",\"orderamount\":\"\"}");

                        }
                        else {
                            if (!ValidateHelper.IsMobile(Request["fqmobile"]) || !ValidateHelper.IsMobile(Request["czmobile"]))
                            {
                                //outString = "手机号错误";
                                outString = string.Format("{\"result\":90,\"msg\":\"手机号错误\",\"orderno\":\"" + Request["orderno"] + "\",\"orderamount\":" + decimal.Parse(Request["czmoney"]).ToString("f2").Trim() + "}");

                            }
                            else {
                                //记录支付网关请求
                                int sendlogid = 0;
                                if (Request["paytype"] == "1")
                                {
                                    //支付宝，提交之网关--使用程序提交
                                    rp = MemberChzBLL.BeginChzToWG_AliPay(Request["memo"], Request["paymoney"],EnumPaygateType.alipay_web, Request["orderno"], (EnumClientType)byte.Parse(Request["clienttype"]), Request["cztype"], Request["paygate"], Request["fqmobile"], Request["czmobile"], Request["productID"], decimal.Parse(Request["czmoney"]), out payGateOrderNo, out notifyurl);
                                    //outString = string.Format("{\"result\":" + rp.ResultCode + ",\"msg\":" + rp.Description + ",\"orderno\":\"" + Request["orderno"] + "\",\"orderamount\":" + decimal.Parse(Request["czmoney"]).ToString("f2").Trim() + "}");
                                    outString = rp.Description;
                                }
                                else
                                {
                                    //微信浏览器中，提交之网关--使用jsapi提交
                                    //测试代码
                                    //Session["wxPayOpenid"] = "oz1WBs6OYkSq33fYnvInFWU2ENZE";
                                    string c_orderno = Request["orderno"];
                                    string c_orderamount = Request["paymoney"]; //Request["czmoney"];

                                    string url = MemberChzBLL.BeginChzToWG_JSAPI(Request["memo"],Request["paymoney"],Session["wxPayOpenid"].ToString(), EnumPaygateType.wx, Request["orderno"], (EnumClientType)byte.Parse(Request["clienttype"]), Request["cztype"], Request["paygate"], Request["fqmobile"], Request["czmobile"], Request["productID"], decimal.Parse(Request["czmoney"]), out payGateOrderNo, out notifyurl, out sendlogid);
                                    if (url.IndexOf("?") > -1)
                                    {
                                        //抓取结果
                                        url = Utils.GetPageContent(url, "", "utf-8", "post", true);


                                        
                                        //更新Sendlog，记录网关返回
                                        JYH_MobileCZ_API_SendLog model = new JYH_MobileCZ_API_SendLog();
                                        model.ID = sendlogid;
                                        model.ResponseTime = DateTime.Now;
                                        model.ResponseData = url;
                                        model.DecodeResponseBodyData = url;
                                        model.DecodeResponseBodyData = url;
                                        model.ResultCode = "0";
                                        model.ResultMessage = "网关返回成功,orderno:" + Request["orderno"] + ",money:" + c_orderamount;
                                        new JYH_MobileCZ_API_SendLogDAL().Update(model);

                                        outString = "{\"result\":0,\"msg\":" + url + ",\"orderno\":\"" + c_orderno + "\",\"orderamount\":" + c_orderamount + "}";

                                    }
                                    else
                                    {
                                        outString = string.Format("{\"result\":90,\"msg\":" + url + ",\"orderno\":\"" + Request["orderno"] + "\",\"orderamount\":" + c_orderamount + "}");
                                    }
                                }
                            }
                        }
                        

                        break;
                    //创建充值订单
                    case "createOrder_mobileCZ":
                        outString = "";
                        if (Request["paymoney"] == "" || Request["orderno"] == "" || Request["cztype"] == "" || Request["paygate"] == "" || Request["clienttype"] == "" || Request["fqmobile"] == "" || Request["czmobile"] == "" || Request["czmoney"] == "")
                        {
                            //outString = "缺少参数";
                            outString = string.Format("{\"result\":90,\"msg\":\"缺少参数\",\"orderno\":\"\",\"orderamount\":\"\"}");

                        }
                        else
                        {
                            if (!ValidateHelper.IsMobile(Request["fqmobile"]) || !ValidateHelper.IsMobile(Request["czmobile"]))
                            {
                                //outString = "手机号错误";
                                outString = string.Format("{\"result\":90,\"msg\":\"手机号错误\",\"orderno\":\"" + Request["orderno"] + "\",\"orderamount\":" + decimal.Parse(Request["czmoney"]).ToString("f2").Trim() + "}");

                            }
                            else
                            {
                                rp= MemberChzBLL.CreateOrder( Request["paymoney"], EnumPaygateType.alipay_web, Request["orderno"], (EnumClientType)byte.Parse(Request["clienttype"]), Request["cztype"], Request["paygate"], Request["fqmobile"], Request["czmobile"], Request["productID"], decimal.Parse(Request["czmoney"]));
                                if (rp.IsError)
                                {
                                    outString = string.Format("{\"result\":" + rp.ResultCode + ",\"msg\":" + rp.Description + "}");
                                }

                            }
                        }


                        break;
                    //网关支付成功，调用手机充值接口
                    case "mobilecz":
                        //rp = SMSBll.MakeSMSCodeAndSend(Request["mobileno"], JYH_SMSCode.EnumSMSTradeType.PhoneRegister);
                        //jrp.resultcode = rp.ResultCode;
                        //jrp.resultmessage = rp.Description;
                        //outString = JsonHelper.ToJsonString(jrp);
                        if (Request["mobileno"] == "" || Request["Orderno"] == "" || Request["ChzAmount"] == "" || Request["ProductID"] == "")
                        {
                            //outString = "缺少参数";
                            outString = string.Format("{\"result\":90,\"msg\":缺少参数,\"orderno\":\"\",\"orderamount\":\"\"}");
                        }
                        else
                        {
                            //获取订单信息

                            rp = com.hjy.fan.BusinessLayer.MobileCZAPI.RequestBLL.Request_MobileCZ(Request["ProductID"], Request["mobileno"], Request["Orderno"], Request["ChzAmount"], out outString);
                            if(rp.IsError){
                                outString = string.Format("{\"result\":" + rp.ResultCode+ ",\"msg\":"+rp.Description+",\"orderno\":\"\",\"orderamount\":}");
                            }
                        }

                        break;
                    //账户中心查询用户充值订单
                    case "getmobileczorder":
                        if (HttpContext.Current.Session["UserName"] == null)
                        {
                            //outString = "需登录";
                            outString = string.Format("{\"resultcode\":80,\"msg\":\"需登录\",\"orderno\":\"\",\"orderamount\":\"\"}");
                        }
                        else
                        {
                            FQmobile = HttpContext.Current.Session["UserName"].ToString();
                            if (Request["status"] != null && Request["page"] != null && Request["pagesize"] != null && Request["ordercol"] != null && Request["ordertype"] != null)
                            {
                                string order_status = "";
                                switch (Request["status"])
                                {
                                    case "DZF":
                                        order_status = "0";
                                        break;
                                    case "DCZ":
                                        order_status = "110,190";
                                        break;
                                    case "CZCG":
                                        order_status = "1";
                                        break;
                                    case "CZSB":
                                        order_status = "100,200";
                                        break;
                                    case "":
                                        order_status = "";
                                        break;
                                }
                                int recordcount = 0;
                                DataSet ds_MobileDeposit = new JYH_MobileDepositDAL().GetListByFQMobile(order_status, FQmobile, int.Parse(Request["page"]), int.Parse(Request["pagesize"]), Request["ordercol"], Request["ordertype"], out recordcount);
                                DataTable dt_one = ds_MobileDeposit.Tables[0];
                                ds_MobileDeposit.Dispose();
                                EnumHelper.SetEnumCNNameInTable(ref dt_one, typeof(JYH_MobileDeposit.EnumStatus), "Status", "EnumStatus");
                                string jsonData = JsonHelper.DataTableToJson("ResultTable", dt_one);
                                int countPage = recordcount / int.Parse(Request["pagesize"]);
                                if (recordcount % int.Parse(Request["pagesize"])>0)
                                {
                                    countPage = countPage + 1;
                                }
                                outString = jsonData.TrimEnd('}') + "," + "\"RowsCount\":" + recordcount + "," + "\"countPage\":" + countPage + ",\"resultcode\":1}";
                                dt_one.Dispose();

                            }
                            else
                            {
                                outString = string.Format("{\"resultcode\":90,\"msg\":\"缺少参数\",\"orderno\":\"\",\"orderamount\":\"\"}");

                            }
                        }

                        

                        break;
                    //账户中心查询用户充值订单数量
                    case "getmobileczordernum":
                        if (HttpContext.Current.Session["UserName"] == null)
                        {
                            outString = "需登录";
                        }
                        else
                        {
                            FQmobile = HttpContext.Current.Session["UserName"].ToString();
                            if (Request["status"] != null)
                            {
                                //string order_status = "";
                                //switch (Request["status"])
                                //{
                                //    case "DZF":
                                //        order_status = "0";
                                //        break;
                                //    case "DCZ":
                                //        order_status = "110,190";
                                //        break;
                                //    case "CZCG":
                                //        order_status = "1";
                                //        break;
                                //    case "CZSB":
                                //        order_status = "200";
                                //        break;
                                //    case "":
                                //        order_status = "";
                                //        break;
                                //}
                                DataTable dt_num = new DataTable();
                                dt_num.Columns.Add("orderStatus");
                                dt_num.Columns.Add("number");

                                int num = new JYH_MobileDepositDAL().GetListNumByFQMobileAndStatus(FQmobile,"0");
                                DataRow dr = dt_num.NewRow();
                                dr["orderStatus"] = "DZF";
                                dr["number"] = num.ToString();
                                dt_num.Rows.Add(dr);

                                num = new JYH_MobileDepositDAL().GetListNumByFQMobileAndStatus(FQmobile, "110,190");
                                dr = dt_num.NewRow();
                                dr["orderStatus"] = "DCZ";
                                dr["number"] = num.ToString();
                                dt_num.Rows.Add(dr);

                                num = new JYH_MobileDepositDAL().GetListNumByFQMobileAndStatus(FQmobile, "1");
                                dr = dt_num.NewRow();
                                dr["orderStatus"] = "CZCG";
                                dr["number"] = num.ToString();
                                dt_num.Rows.Add(dr);

                                num = new JYH_MobileDepositDAL().GetListNumByFQMobileAndStatus(FQmobile, "100,200");
                                dr = dt_num.NewRow();
                                dr["orderStatus"] = "CZSB";
                                dr["number"] = num.ToString();
                                dt_num.Rows.Add(dr);

                                num = new JYH_MobileDepositDAL().GetListNumByFQMobileAndStatus(FQmobile, "");
                                dr = dt_num.NewRow();
                                dr["orderStatus"] = "";
                                dr["number"] = num.ToString();
                                dt_num.Rows.Add(dr);

                                outString = JsonHelper.DataTableToJson("ResultTable", dt_num);
                                //outString = num.ToString();
                                //outString = string.Format("{\"orderStatus\":\""+Request["status"]+"\",\"number\":\""+num.ToString()+"\"}");

                                
                            }
                            else
                            {
                                outString = "缺少参数";

                            }
                        }
                        break;

                    //查询用户充值订单
                    case "getmobileczorderbyorderno":
                        if (HttpContext.Current.Session["UserName"] == null)
                        {
                            outString = "需登录";
                        }
                        else
                        {
                            FQmobile = HttpContext.Current.Session["UserName"].ToString();
                            if (Request["orderno"] != null)
                            {
                                DataTable dt_one = new JYH_MobileDepositDAL().GetListByOrderNo(Request["orderno"]);
                                EnumHelper.SetEnumCNNameInTable(ref dt_one, typeof(JYH_MobileDeposit.EnumStatus), "Status", "EnumStatus");
                                outString = JsonHelper.DataTableToJson("ResultTable", dt_one);
                                //outString = jsonData.TrimEnd('}') + "," + "\"RowsCount\":" + recordcount + "}";
                                dt_one.Dispose();

                            }
                            else
                            {
                                outString = "缺少参数";
                            }
                        }


                        break;
                    //case "wxshare"://微信内JSAPI分享
                    //    WX_JSAPI_Config jaapiconfig = new WX_JSAPI_Config();
                    //    jaapiconfig.resultcode = "0";
                    //    jaapiconfig.resultmessage = "操作成功";
                    //    bool debug = false;
                    //    if (!bool.TryParse(Request["debug"] ?? "", out debug))
                    //        debug = false;
                    //    string jsApiList = Request["jsApiList"] ?? "";

                    //    string url = Request["surl"] ?? "";
                       
                            
                       
                    //    if (jsApiList == "")
                    //    {
                    //        jaapiconfig.resultcode = "1";
                    //        jaapiconfig.resultmessage = "要调用的接口不能为空";
                    //    }
                        
                    //    else if (url == "")
                    //    {
                    //        jaapiconfig.resultcode = "2";
                    //        jaapiconfig.resultmessage = "当前页面的url不能为空";
                    //    } 
                    //    else
                    //    {
                    //        WX_JSAPI_Ticket_Response ticket = WxJsApiData.GetJsApiTicket();
                    //        if (ticket == null)
                    //        {
                    //            jaapiconfig.resultcode = "3";
                    //            jaapiconfig.resultmessage = "获取ticket失败.";
                    //        }
                    //        else
                    //        {
                    //            jaapiconfig.appId = WxPayConfig.APPID;
                    //            jaapiconfig.debug = debug;
                    //            jaapiconfig.jsApiList = jsApiList.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                    //            jaapiconfig.nonceStr = WxPayApi.GenerateNonceStr();
                    //            jaapiconfig.timestamp = long.Parse(WxPayApi.GenerateTimeStamp());
                    //            jaapiconfig.ticket = ticket.ticket;
                    //            jaapiconfig.url = url;
                    //            jaapiconfig.signature = WxJsApiData.getSign(jaapiconfig);
                    //        }                          
                            
                    //    }
                    //    outString = JsonHelper.ToJsonString(jaapiconfig);
                    //    break;
                    
                }
            }
            catch (Exception ex)
            {
                outString = ex.Message;
            }
            Response.Write(outString);
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