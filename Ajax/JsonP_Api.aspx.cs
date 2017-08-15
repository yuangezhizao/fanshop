using com.hjy.fan.BusinessLayer.JYHAPI;
using com.hjy.fan.EntityFacade.Json;
using com.hjy.fan.FrameWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using com.hjy.fan.BusinessLayer;

namespace com.hjy.fan.WebTouch.Ajax
{
    public partial class JsonP_Api : System.Web.UI.Page
    {
        private string apitype = "";
        protected string outString = "";
        protected void Page_Load(object sender, EventArgs e)
        {
            
            try
            {
                apitype = Request["apitype"] ?? "";
                switch (apitype)
                {
                    case "yaotvproductdetail":
                        string productDetailData = "";
                        string productActInfoData = "";
                        string productCode = "";
                        string productDetail_Api_Name = "";
                        string tvliveData = "";                   
                        //获取最新的一条正在直播的商品
                        RequestBLL.Request_Common(INITools.GetIniKeyValue("System", "TVLIVE_API_NAME"), INITools.GetIniKeyValue("System", "TVLIVE_API_INPUT"), "", out tvliveData);
                        //outString = "{\"resultCode\":1,\"resultMessage\":\"\",\"products\":[{\"id\":\"128453\",\"name\":\"欧尔佳黑色头层牛皮女靴+黄棕色头层牛皮女鞋  \",\"markPrice\":\"758\",\"salePrice\":\"298\",\"discountPrice\":\"460\",\"discount\":\"39\",\"saleNo\":0,\"hasVideo\":0,\"productPic\":\"http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24df2/6aab193c455344fd999d23bd3b0a24bd.jpg\",\"playTime\":\"2015-11-24 16:00:00\",\"productFlag\":[\"牛皮女鞋\"],\"productDetail\":\"\",\"endTime\":\"2015-11-24 16:40:00\",\"playStatus\":1,\"stock\":1,\"flagStock\":\"有货\",\"activityList\":[],\"otherShow\":[],\"skuAdv\":\"\",\"saleNum\":1245}],\"paged\":{\"total\":24,\"count\":1,\"more\":1},\"banner_img\":\"http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24b8d/efe4480708364ccebd77205fcb38456c.jpg\",\"banner_name\":\"\",\"banner_link\":\"http://share.ichsy.com/index/csy.html\",\"systemDate\":\"2015-11-24 16:05:20\"}";
                        Json_Response_com_cmall_familyhas_api_ApiForGetTVData com_cmall_familyhas_api_apiforgettvdata_response = JsonHelper.FromJsonString<Json_Response_com_cmall_familyhas_api_ApiForGetTVData>(tvliveData);
                        if (com_cmall_familyhas_api_apiforgettvdata_response.products.Count > 0)
                        {
                            productCode = com_cmall_familyhas_api_apiforgettvdata_response.products[0].id.Trim();
                            string SMG_productCode="IC_SMG_"+productCode;
                            //调用商品详情接口
                            if (SMG_productCode.StartsWith("IC"))
                                productDetail_Api_Name = "com_cmall_familyhas_api_ApiGetEventSkuInfo";
                            else
                                productDetail_Api_Name = "com_cmall_familyhas_api_ApiGetSkuInfo";
                            RequestBLL.Request_Common(productDetail_Api_Name, INITools.GetIniKeyValue("System", "ProductDetail_API_INPUT").Replace("{productCode}", SMG_productCode), "", out productDetailData);
                            if (productDetailData.IndexOf("resultcode") != -1)
                                productDetailData = "";
                            else
                            {
                                productDetailData = productDetailData.Trim();
                                //productDetailData = productDetailData.Substring(1, productDetailData.Length - 2);
                            }

                            //调用商品活动价格接口
                            RequestBLL.Request_Common(INITools.GetIniKeyValue("System", "ProductDetailSkuInfo_API_NAME"), INITools.GetIniKeyValue("System", "ProductDetailSkuInfo_API_INPUT").Replace("{code}", SMG_productCode), "", out productActInfoData);
                            if (productActInfoData.IndexOf("resultcode") != -1)
                                productActInfoData = "";
                            {
                                productActInfoData = productActInfoData.Trim();
                                //productActInfoData = productActInfoData.Substring(1, productActInfoData.Length - 2);
                            }
                            outString = "productdetailCallback({productCode:\""+ productCode + "\",productDetailData:"+ productDetailData + ",productActInfoData:"+ productActInfoData + "})";
                        }
                        break;
                    case "yaotvproductid":
                        //获取最新的一条正在直播的商品
                        RequestBLL.Request_Common(INITools.GetIniKeyValue("System", "TVLIVE_API_NAME"), INITools.GetIniKeyValue("System", "TVLIVE_API_INPUT"), "", out tvliveData);
                        //outString = "{\"resultCode\":1,\"resultMessage\":\"\",\"products\":[{\"id\":\"128453\",\"name\":\"欧尔佳黑色头层牛皮女靴+黄棕色头层牛皮女鞋  \",\"markPrice\":\"758\",\"salePrice\":\"298\",\"discountPrice\":\"460\",\"discount\":\"39\",\"saleNo\":0,\"hasVideo\":0,\"productPic\":\"http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24df2/6aab193c455344fd999d23bd3b0a24bd.jpg\",\"playTime\":\"2015-11-24 16:00:00\",\"productFlag\":[\"牛皮女鞋\"],\"productDetail\":\"\",\"endTime\":\"2015-11-24 16:40:00\",\"playStatus\":1,\"stock\":1,\"flagStock\":\"有货\",\"activityList\":[],\"otherShow\":[],\"skuAdv\":\"\",\"saleNum\":1245}],\"paged\":{\"total\":24,\"count\":1,\"more\":1},\"banner_img\":\"http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24b8d/efe4480708364ccebd77205fcb38456c.jpg\",\"banner_name\":\"\",\"banner_link\":\"http://share.ichsy.com/index/csy.html\",\"systemDate\":\"2015-11-24 16:05:20\"}";
                        Json_Response_com_cmall_familyhas_api_ApiForGetTVData com_cmall_familyhas_api_apiforgettvdata_response1 = JsonHelper.FromJsonString<Json_Response_com_cmall_familyhas_api_ApiForGetTVData>(tvliveData);
                        if (com_cmall_familyhas_api_apiforgettvdata_response1.products.Count > 0)
                        {
                            string SMG_productCode = "IC_SMG_" + com_cmall_familyhas_api_apiforgettvdata_response1.products[0].id.Trim();
                            outString = "productCallback({productCode:\"" + SMG_productCode + "\"})";
                        }
                        break;
                    case "getwxcardtype":
                        outString = AwardConfigBLL.GetCardType(Request["callback"],Request["httpprotocol"]);
                        break;
                }
                Response.Write(outString);
            }
            catch (Exception ex)
            {
                try
                {
                    FileHelper.WriteLogFile("Jsonp接口", ex.ToString());
                }
                catch { }
            }
        }
    }
}