/// <reference path="../functions/g_Type.js" />
/// <reference path="../functions/g_Const.js" />
/// <reference path="../g_header.js" />
/// <reference path="../jquery-2.1.4.js" />

//$(document).ready(function () {
//    BrandPreference.FromShare();
//    //BrandPreference.SetWXShare(null);
//    //BrandPreference.SetAPPShare();
//    BrandPreference.GetDetail(GetQueryString("id"));
//    $("#btnBack").click(function () {
//        window.location.replace(PageUrlConfig.BackTo());

//    });
    
//});
function callbackFunc(window, share_title, share_img_url, share_content, share_link, isShare) {
    window.share.shareOnAndroid(share_title, share_img_url, share_content, share_link, isShare);
}
//加载列表
var BrandPreference = {
    FromAPP: function (window) {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/hjy-android/i) == 'hjy-android') {
            $(".d_sale_header").css("display", "none");
            $("head title").text("品牌特惠");
        }        
    },
    Init: function (window) {        
        BrandPreference.FromShare();
        BrandPreference.FromAPP(window);
        BrandPreference.SetAPPShare(window);
        BrandPreference.GetDetail(GetQueryString("id"));
        $("#btnBack").click(function () {
           // window.location.replace(PageUrlConfig.BackTo());
            Merchant_Group.Back();
        });
        /* @ 顶部搜索框 */
        $(window).on('scroll', function () {
            var scrollBtn = $('.scroll-top');
            var top = document.body.scrollTop;
            //top <= 50 && header.removeAttr('style');
            top >= 750 ? scrollBtn.show() : scrollBtn.hide();
        });
        /* @ 返回顶部 */
        $('.scroll-top').on('click', function () {
            document.body.scrollTop = 0;
            $(this).hide();
        });
        //if (GetQueryString("from") =="" && localStorage[g_const_localStorage.OrderFrom] == "") {
        //    $("#btnBack").show();
        //}
        //else {
        //    $("#btnBack").hide();
        //}
        $(".app-close").on("click", function (e) {
            $(e.target).parent().css("display", "none");
        });
    },
    api_target: "com_cmall_familyhas_api_ApiForBrandPreferenceContent",
    api_input: { "infoCode": "" },
    GetDetail: function (infocode) {
        BrandPreference.api_input.infoCode = infocode;
        var s_api_input = JSON.stringify(this.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": this.api_target };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultCode == g_const_Success_Code) {
                BrandPreference.Load_Result(msg);
            }
            else {
                ShowMesaage(g_const_API_Message["7001"]);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (resultlist) {
        var body = "";
        var classstr = "";
        var sellover = "";
        $.each(resultlist.productList, function (i, n) {

            if (i % 2 == 0) {
                classstr = "fl";
            }
            else {
                classstr = "fr";
            }
            if (n.storeFlag == "0")
                sellover = "<span>&nbsp;</span>";
            else
                sellover = "";
            body += "<div class=\"lid " + classstr + "\" onclick=\"BrandPreference.Load_Product(" + n.procuctCode + ")\">";
            body += "<div class=\"imgd\">" + sellover + "<img src=\"" + g_GetBrandPictrue(n.pic) + "\" alt=\"\" /></div>";
            body += "<div class=\"txtd\">";
            body += "<h3>" + n.productName + "</h3>";
            body += "<div class=\"icod\"><span>" + n.discount + "折</span></div>";
            body += "<div class=\"price\"><b>¥</b>" + n.salePrice + "<span>¥" + n.marketPrice + "</span></div>";
            body += "</div>";
            body += "</div>";



        });
        $("#divBrandPreferenceDetail").html(body);

        for (var k in resultlist.brandPicList) {
            var brandPic = resultlist.brandPicList[k];
            var info = "";
            info += "<div class=\"pinp-ad\"><a onclick=\"BrandPreference.Load_Brand('" + g_GetLocationByShowmoreLinktype(brandPic.linkType, brandPic.linkValue) + "')\"><img src=\"" + g_GetPictrue(brandPic.brandPic) + "\"/></a></div>";

            if (brandPic.brandLocation.toString().Trim() == g_const_brandLocation.Header.toString()) {
                info += "<h1><b>&nbsp;</b>全场<span>" + resultlist.discount + "</span>折起</h1>";
                $("#divBrandPreferenceInfo").append(info);
            }
            else
                $("#adfooter").append(info);
        }

        
        try {
            BrandPreference.SetWXShare(resultlist);
        }
        catch (e) { }


    },
    Load_Product: function (pid) {
      //  PageUrlConfig.SetUrl();
      // window.location.href = g_const_PageURL.Product_Detail + "?pid=" + pid + "&t=" + Math.random();
        LoadProductDetail(pid);
    },
    Load_Brand: function (url) {
        if (url.length > 0) {
            window.location.href = url;
        }
    },
    /*分享而来时的操作*/
    FromShare: function () {
        var fromshare = GetQueryString("fromshare");
        if (fromshare.Trim() == g_const_YesOrNo.YES.toString() || GetQueryString("from") == g_const_Merchant_Group_Android || GetQueryString("from") == g_const_Merchant_Group_Ios) {
            $("header").css("display", "none");
        }
        else {
            $("header").css("display", "block");
        }
    },
    /*设定微信分享按钮*/
    SetWXShare: function (msg) {
        
        if (IsInWeiXin.check()) {            
            WX_JSAPI.wx = window.wx;
            
            WX_JSAPI.wxparam.debug = false;
            WX_JSAPI.dataUrl = "";
            var share_content = BrandPreference.share_content;
            WX_JSAPI.desc = share_content;
            var share_image = BrandPreference.share_image;
            WX_JSAPI.imgUrl = share_image;

            WX_JSAPI.title = BrandPreference.share_title;
            WX_JSAPI.link = BrandPreference.GetShareLink(window);
            
            WX_JSAPI.type = g_const_wx_share_type.link;
            WX_JSAPI.LoadParam(g_const_wx_AllShare);
        }
    },
    share_title: GetQueryString("wx_st") == "" ? g_const_Share.DefaultTitle : decodeURIComponent(GetQueryString("wx_st")),
    share_content: GetQueryString("wx_sc") == "" ? g_const_Share.DefaultDesc : decodeURIComponent(GetQueryString("wx_sc")),
    share_image: GetQueryString("wx_si") == "" ? g_const_Share.DefaultImage : decodeURIComponent(GetQueryString("wx_si")),
    GetShareLink: function () {
        var shareurl = "http://" + window.location.host + "/share.html?wxLink="// + window.location.pathname;
        
        var localurl = window.location.pathname;
        var localparam = "id=" + GetQueryString("id");
        localparam += "&fromshare=" + g_const_YesOrNo.YES.toString();
        localparam += "&_r=" + Math.random().toString();
        var share_title = BrandPreference.share_title;
        
        var shareparam = "&wxTilte=" + encodeURIComponent(share_title);
        try{
            if (typeof (localStorage[g_const_localStorage.Member]) != "undefined") {
                var smember = localStorage[g_const_localStorage.Member];
                var member = null;
                if (typeof (smember) != "undefined") {
                    member = JSON.parse(smember);
                }
                if (member != null)
                    shareparam += "&wxPhone=" + encodeURIComponent(member.Member.phone);
            }
        }
        catch (e) {

        }
        shareparam += "&wx_sc=" + encodeURIComponent(BrandPreference.share_content);
        shareparam += "&wx_si=" + encodeURIComponent(BrandPreference.share_image);
        return shareurl + encodeURIComponent(localurl + "?" + localparam) + shareparam;
    },
    //设置APP分享
    SetAPPShare: function (window) {
       
        try {                
            if (BrandPreference.share_title != "" || BrandPreference.share_content != "" || BrandPreference.share_image != "") {
                    
                
                var log = "";//typeof (window.share.shareOnAndroid);
                
                log += typeof (IsInAndroidAPP);
                //if (typeof (window.share.shareOnAndroid == "function")) {
                
                    //$("#divBrandPreferenceInfo").html(log);
                    //window.share.isNeedPullRefresh("true");
                    //log += "设定可刷新成功<br>";
                    //$("#divBrandPreferenceInfo").html(log);
                    log += "<br>BrandPreference.share_title=" + BrandPreference.share_title;
                    log += "<br>BrandPreference.share_image=" + BrandPreference.share_image;
                    log += "<br>BrandPreference.share_content=" + BrandPreference.share_content;
                    log += "<br>BrandPreference.GetShareLink=" + BrandPreference.GetShareLink();
                    //$("#divBrandPreferenceInfo").html(log);
                    callbackFunc(window, BrandPreference.share_title, BrandPreference.share_image, BrandPreference.share_content, BrandPreference.GetShareLink(), true);
                    //window.share.shareOnAndroid(BrandPreference.share_title, BrandPreference.share_image, BrandPreference.share_content, BrandPreference.GetShareLink(), true);
                    
                    log += "设定分享成功";
                    //$("#divBrandPreferenceInfo").html(log);

                    //window.share.showDialog("hello");
                    //log += "设定可showDialog成功";
                    //$("#divBrandPreferenceInfo").html(log);

                   
                //}
            }
        }
        catch (e) {
            BrandPreference.Error = e;
            //$("#divBrandPreferenceInfo").html(e);
        }        
    },
    Error: "",
    share: {}
};
