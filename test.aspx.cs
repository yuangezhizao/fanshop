using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Configuration;
using com.hjy.fan.FrameWork;
using com.hjy.fan.BusinessLayer;
using com.hjy.fan.BusinessLayer.JYHAPI;
using com.hjy.fan.EntityFacade;

namespace com.hjy.fan.WebTouch
{
    public partial class test : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //string api_target = Request["api_target"] ?? "";
            //string obj1 = Request["api_input[name]"] ?? "";
            //string obj2 = Request["api_input[tel][]"] ?? "";
            //string api_input = Request["api_input"] ?? "";
            //string test = "{\"resultCode\":1,\"resultMessage\":\"\",\"productCode\":\"\",\"productName\":null,\"sellPrice\":0,\"marketPrice\":0,\"flagSale\":0,\"productStatus\":\"\",\"videoUrl\":\"\",\"brandName\":\"\",\"brandCode\":\"\",\"mainpicUrl\":{\"picOldUrl\":\"\",\"picNewUrl\":\"\",\"width\":0,\"height\":0,\"oldWidth\":0,\"oldHeight\":0},\"pcPicList\":[],\"discriptPicList\":[],\"skuList\":[],\"discriptInfo\":\"\",\"labelsList\":[],\"maxBuyCount\":0,\"propertyList\":[],\"propertyInfoList\":[],\"flagCheap\":0,\"exitVideo\":0,\"flagIncludeGift\":0,\"gift\":\"\",\"authorityLogo\":[],\"endTime\":\"\",\"familyPriceName\":\"\",\"discount\":0,\"disMoney\":0,\"shareUrl\":\"\",\"saleNum\":\"0\",\"collectionProduct\":0,\"vipSpecialActivity\":0,\"vipSpecialTip\":\"\",\"vipSpecialPrice\":\"0\",\"limitBuyTip\":\"限购99件\",\"priceLabel\":\"\",\"buttonMap\":{},\"sysDateTime\":\"2015-07-21 11:25:23\"}";
            //test = "{\"resultCode\":1,\"resultMessage\":\"\",\"productCode\":\"108577\",\"productName\":\"海鸥表自动机械表539.359\",\"sellPrice\":1,\"marketPrice\":20000,\"flagSale\":1,\"productStatus\":\"4497153900060002\",\"videoUrl\":\"\",\"brandName\":\"海鸥\",\"brandCode\":\"44971602100224\",\"mainpicUrl\":{\"picOldUrl\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24aba/6af1f4184a2847d78519183ce0f9ff4d.png\",\"picNewUrl\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24aba/6af1f4184a2847d78519183ce0f9ff4d.png\",\"width\":0,\"height\":0,\"oldWidth\":0,\"oldHeight\":0},\"pcPicList\":[{\"picOldUrl\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24aba/910bda426ad84a9f8af2760ef52aee0b.png\",\"picNewUrl\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24aba/910bda426ad84a9f8af2760ef52aee0b.png\",\"width\":0,\"height\":0,\"oldWidth\":0,\"oldHeight\":0}],\"discriptPicList\":[{\"picOldUrl\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24aba/fcb76de9eb17491087cf14e17ff535f7.png\",\"picNewUrl\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24aba/fcb76de9eb17491087cf14e17ff535f7.png\",\"width\":0,\"height\":0,\"oldWidth\":0,\"oldHeight\":0}],\"skuList\":[{\"skuCode\":\"108577\",\"skuName\":\"海鸥表自动机械表539.359\",\"keyValue\":\"color_id=0&style_id=0&self_id=0\",\"stockNumSum\":890,\"sellPrice\":1000,\"marketPrice\":20000,\"activityInfo\":[{\"activityCode\":\"SG150706100002\",\"activityName\":\"wrtds\",\"remark\":\"\",\"activityPrice\":1234.00,\"startTime\":\"2015-07-07 23:23:01\",\"endTime\":\"2015-07-25 19:22:01\",\"flagCheap\":1}],\"vipSpecialPrice\":\"0\",\"disMoney\":37.02}],\"discriptInfo\":\"\",\"labelsList\":[\"手表\"],\"maxBuyCount\":99,\"propertyList\":[{\"propertyKeyCode\":\"color_id\",\"propertyKeyName\":\"颜色\",\"propertyValueList\":[{\"propertyValueCode\":\"0\",\"propertyValueName\":\"共同\"},{\"propertyValueCode\":\"1\",\"propertyValueName\":\"红色\"}]},{\"propertyKeyCode\":\"style_id\",\"propertyKeyName\":\"款式\",\"propertyValueList\":[{\"propertyValueCode\":\"0\",\"propertyValueName\":\"共同\"},{\"propertyValueCode\":\"1\",\"propertyValueName\":\"男款\"}]},{\"propertyKeyCode\":\"self_id\",\"propertyKeyName\":\"自定义\",\"propertyValueList\":[{\"propertyValueCode\":\"0\",\"propertyValueName\":\"爱好\"},{\"propertyValueCode\":\"1\",\"propertyValueName\":\"喜欢\"}]}],\"propertyInfoList\":[],\"flagCheap\":1,\"exitVideo\":0,\"flagIncludeGift\":1,\"gift\":\"康宁锅一组；乐扣盒一组;\",\"authorityLogo\":[{\"logoContent\":\"【全场包邮】\",\"logoPic\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24a71/bb9c4a0bff13403689c01599b14267d7.png\",\"logoLocation\":6},{\"logoContent\":\"【正品保障】\",\"logoPic\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24a71/e3f1ce219b674ce48010f99e403e122f.png\",\"logoLocation\":5},{\"logoContent\":\"【7天无理由退货】\",\"logoPic\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24abe/aabe40459c43401eb464afa26fa00c71.png\",\"logoLocation\":4}],\"endTime\":\"2015-07-25 19:22:01\",\"familyPriceName\":\"家有价\",\"discount\":19999.00,\"disMoney\":37.02,\"shareUrl\":\"http://share-qhbeta-cfamily.qhw.yshqi.com/s/p/108577\",\"saleNum\":\"0\",\"collectionProduct\":0,\"vipSpecialActivity\":0,\"vipSpecialTip\":\"\",\"vipSpecialPrice\":\"0\",\"limitBuyTip\":\"限购99件\",\"priceLabel\":\"闪购\",\"buttonMap\":{\"buyBtn\":1,\"shopCarBtn\":0,\"callBtn\":1},\"minSellPrice\":\"1234\",\"maxSellPrice\":\"1234\",\"sysDateTime\":\"2015-07-21 15:58:58\"}";
            //test = "{\"resultCode\":1,\"resultMessage\":\"\",\"productCode\":\"108577\",\"productName\":\"海鸥表自动机械表539.359\",\"sellPrice\":1,\"marketPrice\":20000,\"flagSale\":1,\"productStatus\":\"4497153900060002\",\"videoUrl\":\"\",\"brandName\":\"海鸥\",\"brandCode\":\"44971602100224\",\"mainpicUrl\":{\"picOldUrl\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24aba/6af1f4184a2847d78519183ce0f9ff4d.png\",\"picNewUrl\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24aba/6af1f4184a2847d78519183ce0f9ff4d.png\",\"width\":0,\"height\":0,\"oldWidth\":0,\"oldHeight\":0},\"pcPicList\":[{\"picOldUrl\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24aba/910bda426ad84a9f8af2760ef52aee0b.png\",\"picNewUrl\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24aba/910bda426ad84a9f8af2760ef52aee0b.png\",\"width\":0,\"height\":0,\"oldWidth\":0,\"oldHeight\":0}],\"discriptPicList\":[{\"picOldUrl\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24aba/fcb76de9eb17491087cf14e17ff535f7.png\",\"picNewUrl\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24aba/fcb76de9eb17491087cf14e17ff535f7.png\",\"width\":0,\"height\":0,\"oldWidth\":0,\"oldHeight\":0}],\"skuList\":[{\"skuCode\":\"108577\",\"skuName\":\"海鸥表自动机械表539.359\",\"keyValue\":\"color_id=0&style_id=0\",\"stockNumSum\":890,\"sellPrice\":1000,\"marketPrice\":20000,\"activityInfo\":[{\"activityCode\":\"SG150706100002\",\"activityName\":\"wrtds\",\"remark\":\"\",\"activityPrice\":1234.00,\"startTime\":\"2015-07-07 23:23:01\",\"endTime\":\"2015-07-25 19:22:01\",\"flagCheap\":1}],\"vipSpecialPrice\":\"0\",\"disMoney\":37.02}],\"discriptInfo\":\"\",\"labelsList\":[\"手表\"],\"maxBuyCount\":99,\"propertyList\":[{\"propertyKeyCode\":\"color_id\",\"propertyKeyName\":\"颜色\",\"propertyValueList\":[{\"propertyValueCode\":\"0\",\"propertyValueName\":\"共同\"},{\"propertyValueCode\":\"1\",\"propertyValueName\":\"红色\"}]},{\"propertyKeyCode\":\"style_id\",\"propertyKeyName\":\"款式\",\"propertyValueList\":[{\"propertyValueCode\":\"0\",\"propertyValueName\":\"共同\"},{\"propertyValueCode\":\"1\",\"propertyValueName\":\"男款\"}]}],\"propertyInfoList\":[],\"flagCheap\":1,\"exitVideo\":0,\"flagIncludeGift\":1,\"gift\":\"康宁锅一组；乐扣盒一组;\",\"authorityLogo\":[{\"logoContent\":\"【全场包邮】\",\"logoPic\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24a71/bb9c4a0bff13403689c01599b14267d7.png\",\"logoLocation\":6},{\"logoContent\":\"【正品保障】\",\"logoPic\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24a71/e3f1ce219b674ce48010f99e403e122f.png\",\"logoLocation\":5},{\"logoContent\":\"【7天无理由退货】\",\"logoPic\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24abe/aabe40459c43401eb464afa26fa00c71.png\",\"logoLocation\":4}],\"endTime\":\"2015-07-25 19:22:01\",\"familyPriceName\":\"家有价\",\"discount\":19999.00,\"disMoney\":37.02,\"shareUrl\":\"http://share-qhbeta-cfamily.qhw.yshqi.com/s/p/108577\",\"saleNum\":\"0\",\"collectionProduct\":0,\"vipSpecialActivity\":0,\"vipSpecialTip\":\"\",\"vipSpecialPrice\":\"0\",\"limitBuyTip\":\"限购99件\",\"priceLabel\":\"闪购\",\"buttonMap\":{\"buyBtn\":1,\"shopCarBtn\":0,\"callBtn\":1},\"minSellPrice\":\"1234\",\"maxSellPrice\":\"1234\",\"sysDateTime\":\"2015-07-21 15:58:58\"}";
            ////test = "{\"resultCode\":1,\"resultMessage\":\"\",\"productCode\":\"108577\",\"productName\":\"海鸥表自动机械表539.359\",\"sellPrice\":1,\"marketPrice\":20000,\"flagSale\":1,\"productStatus\":\"4497153900060002\",\"videoUrl\":\"\",\"brandName\":\"海鸥\",\"brandCode\":\"44971602100224\",\"mainpicUrl\":{\"picOldUrl\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24aba/6af1f4184a2847d78519183ce0f9ff4d.png\",\"picNewUrl\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24aba/6af1f4184a2847d78519183ce0f9ff4d.png\",\"width\":0,\"height\":0,\"oldWidth\":0,\"oldHeight\":0},\"pcPicList\":[{\"picOldUrl\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24aba/910bda426ad84a9f8af2760ef52aee0b.png\",\"picNewUrl\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24aba/910bda426ad84a9f8af2760ef52aee0b.png\",\"width\":0,\"height\":0,\"oldWidth\":0,\"oldHeight\":0}],\"discriptPicList\":[{\"picOldUrl\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24aba/fcb76de9eb17491087cf14e17ff535f7.png\",\"picNewUrl\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24aba/fcb76de9eb17491087cf14e17ff535f7.png\",\"width\":0,\"height\":0,\"oldWidth\":0,\"oldHeight\":0}],\"skuList\":[{\"skuCode\":\"108577\",\"skuName\":\"海鸥表自动机械表539.359\",\"keyValue\":\"color_id=0\",\"stockNumSum\":890,\"sellPrice\":1000,\"marketPrice\":20000,\"activityInfo\":[{\"activityCode\":\"SG150706100002\",\"activityName\":\"wrtds\",\"remark\":\"\",\"activityPrice\":1234.00,\"startTime\":\"2015-07-07 23:23:01\",\"endTime\":\"2015-07-25 19:22:01\",\"flagCheap\":1}],\"vipSpecialPrice\":\"0\",\"disMoney\":37.02}],\"discriptInfo\":\"\",\"labelsList\":[\"手表\"],\"maxBuyCount\":99,\"propertyList\":[{\"propertyKeyCode\":\"color_id\",\"propertyKeyName\":\"颜色\",\"propertyValueList\":[{\"propertyValueCode\":\"0\",\"propertyValueName\":\"共同\"},{\"propertyValueCode\":\"1\",\"propertyValueName\":\"红色\"}]}],\"propertyInfoList\":[],\"flagCheap\":1,\"exitVideo\":0,\"flagIncludeGift\":1,\"gift\":\"康宁锅一组；乐扣盒一组;\",\"authorityLogo\":[{\"logoContent\":\"【全场包邮】\",\"logoPic\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24a71/bb9c4a0bff13403689c01599b14267d7.png\",\"logoLocation\":6},{\"logoContent\":\"【正品保障】\",\"logoPic\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24a71/e3f1ce219b674ce48010f99e403e122f.png\",\"logoLocation\":5},{\"logoContent\":\"【7天无理由退货】\",\"logoPic\":\"http://qhbeta-cfiles.qhw.srnpr.com/cfiles/staticfiles/upload/24abe/aabe40459c43401eb464afa26fa00c71.png\",\"logoLocation\":4}],\"endTime\":\"2015-07-25 19:22:01\",\"familyPriceName\":\"家有价\",\"discount\":19999.00,\"disMoney\":37.02,\"shareUrl\":\"http://share-qhbeta-cfamily.qhw.yshqi.com/s/p/108577\",\"saleNum\":\"0\",\"collectionProduct\":0,\"vipSpecialActivity\":0,\"vipSpecialTip\":\"\",\"vipSpecialPrice\":\"0\",\"limitBuyTip\":\"限购99件\",\"priceLabel\":\"闪购\",\"buttonMap\":{\"buyBtn\":1,\"shopCarBtn\":0,\"callBtn\":1},\"minSellPrice\":\"1234\",\"maxSellPrice\":\"1234\",\"sysDateTime\":\"2015-07-21 15:58:58\"}";
           
            //Response.Write(test);
            //Response.End();
        }

        protected void Button1_Click(object sender, EventArgs e)
        {
            RequestBLL.Request_ApiForStatic();
            //BaseUDPClient udp = new BaseUDPClient();
            //udp.Command = 4;
            //udp.EncryptKey = ConfigurationManager.AppSettings["UDPSecretKey"];
            //udp.RemoteIP = ConfigurationManager.AppSettings["UDPServerIP"];
            //udp.RemotePort = int.Parse(ConfigurationManager.AppSettings["UDPServerPort"]);
            //udp.Execute();
            //udp = new BaseUDPClient();
            //udp.Command = 5;
            //udp.EncryptKey = ConfigurationManager.AppSettings["UDPSecretKey"];
            //udp.RemoteIP = ConfigurationManager.AppSettings["UDPServerIP"];
            //udp.RemotePort = int.Parse(ConfigurationManager.AppSettings["UDPServerPort"]);
            //udp.Execute();
            //RequestBLL.Request_ApiBySendList(10, 5);    
            //Merchant_ActBLL actlinkBll = new Merchant_ActBLL();
            //actlinkBll._paramList.Add("action", HttpUtility.UrlDecode("merchant_actlinkurl"));
            //actlinkBll._paramList.Add("merchantcode", HttpUtility.UrlDecode(""));
            //actlinkBll._paramList.Add("paramlist", HttpUtility.UrlDecode(""));
            //actlinkBll._paramList.Add("mc", "rtlbq");
            //actlinkBll._paramList.Add("cf", "pjaSfw_19ZwN4QC4heO6pu2yVi6Q");
            //actlinkBll._paramList.Add("pc", "jyhshop");
            //actlinkBll._paramList.Add("col", "LinkUrl");
            //string api_result = actlinkBll.NotifyMerchantApiData();
            //AddressResult result = new AddressResult();
            //result = (AddressResult)JsonHelper.FromJsonString(result, api_result);
            //Label1.Text = result.resultMessage;
            //#region 调用消息网关
            ////string tradetype = "SendWX";
            ////string merchantid = INITools.GetIniKeyValue("MessageGateWay", "MerchantID");
            ////string tradecode = "Wx_SendMessage_Template";
            ////string _sender = "sender@ichsy.com";
            ////string receivers = "ofw0Nj-k1lrH8jZoYuRVmdfJQMyQ|0|#FF0000|http://www.ichsy.com";
            ////string message = "{\"first\":{\"color\":\"#336699\",\"value\":\"你好，你预约的活动即将开始。\"},\"keyword1\":{\"color\":\"#000000\",\"value\":\"张三\"},\"keyword2\":{\"color\":\"#FF0000\",\"value\":\"2015\\/9\\/2\"},\"remark\":{\"color\":\"#EEEEEE\",\"value\":\"感谢您的使用。\"}}";
            ////string expiretime = DateTime.Now.AddDays(1).ToString("yyyyMMddHHmmss");
            ////string maxsendcount = "1";
            ////string wxtype = "Message_Template";
            ////string tradekeyid = "";
            ////string channelid = INITools.GetIniKeyValue("MessageGateWay", "ChnID");
            ////string isfixtime = "1";
            ////string fixtime = DateTime.Now.AddMinutes(1).ToString("yyyyMMddHHmmss");
            ////ResultPacket result = SMSBll.SendWXAPI(tradetype, _sender, receivers, message, expiretime, maxsendcount, wxtype, tradekeyid, channelid, isfixtime, fixtime, tradecode);
            //string aa = DESHelper.AESEncrypt("140311199307062124", "mgepqfjdrkzdzxwp");
            //string bb = DESHelper.AESDecrypt("VRJDt6WR87DFTPhZvpiSjgJpJ2Yh2KXuiZCuEtC+2JU=", "mgepqfjdrkzdzxwp");
            //#endregion
        }
    }
}