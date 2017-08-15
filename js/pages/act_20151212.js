/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../g_header.js" />

var page_act_20151212_index = {
    //初始化方法
    Init: function () {
        $(".downApp").on("click", function () {
            openApp();
        });
        page_act_20151212_index.GetImageDomian();
        page_act_20151212_index.GetActData();
        page_act_20151212_index.fontSize();
        window.onresize = page_act_20151212_index.fontSize;
    },
    //获取活动数据
    GetActData: function () {
        var obj_data = { action: "act_selfpassword", nickname: GetQueryString("nickname") };
        var request = $.ajax({
            url: g_INAPIUTL,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode == "0") {
                page_act_20151212_index.AfterGetActData(msg.resultmessage);
            }
            else {
                ShowMesaage(msg.resultmessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage("调用接口出错!")
        });
    },
    //显示活动数据
    AfterGetActData: function (jsonstring) {
        var actdata = JSON.parse(jsonstring);
        $("title").html(actdata.Act_Title);
        $(".coupons_type span").html(actdata.SelfPassword);
        $(".coupons_type2").html(actdata.SelfPassword);
        var html = "";
        var tpl = $("#tpl_moudle").text();
        for (var i = 0; i < actdata.Act_Pictrues.length; i++) {
            var Act_Pictrue = actdata.Act_Pictrues[i];
            var data = {
                picture: Act_Pictrue.ImageSrc
            };
            html += renderTemplate(tpl, data);
        }
        $(".moudel").html(html);
        page_act_20151212_index.SetWXShare(actdata);
        //console.log(jsonstring);
    },
    /*设定微信分享按钮*/
    SetWXShare: function (actdata) {
        if (IsInWeiXin.check()) {
            var phoneno = "";
            var shareurl = "http://" + window.location.host + "/ACTS/SelfCoupons/" + GetQueryString("nickname");
            WX_JSAPI.wx = wx;
            WX_JSAPI.wxparam.debug = false;
            WX_JSAPI.dataUrl = "";
            WX_JSAPI.desc = actdata.Act_Descrption.trim() == "" ? actdata.Act_Title : actdata.Act_Descrption;
            var shareimageurl = actdata.Act_Pictrues[0].ImageSrc;
            shareimageurl = shareimageurl.replace("Share/s", "Share/shares");
            shareimageurl = shareimageurl+".png";
            
            WX_JSAPI.imgUrl = shareimageurl;
            WX_JSAPI.link = shareurl;
            WX_JSAPI.title = actdata.Act_Title;
            WX_JSAPI.type = g_const_wx_share_type.link;
            WX_JSAPI.LoadParam(g_const_wx_AllShare);            
        }
    },
    fontSize: function () {
        if (document.documentElement.clientWidth < 1280) { //initial-scale=0.5是缩小一倍后适应屏幕宽。
            document.documentElement.style.fontSize = 10 * (document.documentElement.clientWidth / 320) + 'px';
        } else {
            document.documentElement.style.fontSize = '40px';
        }
    },
    GetImageDomian: function () {
        $("img").each(function (index,objimg) {
            var imgsrc = $(objimg).attr("src");
            if (imgsrc.indexOf("http://") != 0 && imgsrc.indexOf("https://")!=0) {
                imgsrc = "http://msg.ichsy.com/sysshop/ACTimg/1212pa/" + imgsrc;
                $(objimg).attr("src", imgsrc);
            }
        });
    }
};