/// <reference path="../functions/g_Type.js" />
/// <reference path="../functions/g_Const.js" />

$(document).ready(function () {
   
});

//加载列表
var BrandPreference = {
    FromAPP: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/hjy-android/i) == 'hjy-android') {
            $(".d_sale_header").css("display", "none");
            $("head title").text("品牌特惠");
        }
    },
    Init: function () {
        BrandPreference.FromAPP();
        ServerTime.GetList();
        $("#btnBack").click(function () {
          //  window.location.replace(PageUrlConfig.BackTo());
            Merchant_Group.Back();
        });
    },
    api_target: "com_cmall_familyhas_api_ApiForBrandPreference",
    api_input: { "activity": ""},
    GetList: function () {
        BrandPreference.api_input.activity = g_const_ActivityType.BrandPreference;
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
                BrandPreference.Load_Result(msg.items);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (resultlist) {
        var body = "";
        $.each(resultlist, function (i, n) {
            body += "<div class=\"lid\" onclick=\"BrandPreference.Load_Detail('" + n.infoCode + "','" + n.shareFlag + "','" + n.share_info.share_title + "','" + n.share_info.share_content + "','" + n.share_info.share_img_url + "')\">";
            body += "<a>";
            if (Date.Parse(serverTime) > Date.Parse(n.downTime)) {
                body += "<b class=\"icob\">已结束</b>";
            }
            body += "<img src=\"" + g_GetBrandPictrue(n.img_url) + "\" alt='' /><span>";
            if (n.discount>0) {
                body += "<b>" + n.discount + "折起</b>";
            }
            body += n.item_name + "</span>";
            body += "</a>";
            body += "</div>";
        });
        $("#divBrandPreferenceList").html(body);
    },
    Load_Detail: function (pid, shareFlag, share_title, share_content, share_img_url) {
        try{
            PageUrlConfig.SetUrl();    
        }
        catch (e) {

        }
        var surl = g_const_PageURL.BrandPreferenceDetail + "?id=" + pid + "&t=" + Math.random();
        if (shareFlag == g_const_shareFlag.YES) {
            surl += "&wx_st=" + encodeURIComponent(share_title);
            surl += "&wx_sc=" + encodeURIComponent(share_content);
            surl += "&wx_si=" + encodeURIComponent(share_img_url);
        }

        window.location.href = surl;
    }
};
var serverTime = "";
var ServerTime = {
    api_target: "com_cmall_familyhas_api_ApiForGetServerTime",
    api_input: {},
    GetList: function () {
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
                ServerTime.Load_Result(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (result) {
        serverTime = result.serverTime;
        BrandPreference.GetList();
    },
};