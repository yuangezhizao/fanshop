/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../g_header.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../functions/g_Const.js" />
var page_yaotv_youhuiquan = {
    //初始化
    Init: function () {
        page_yaotv_youhuiquan.LoadData();       
    },
    //获取数据
    LoadData: function () {
        var senddata = {
            action: "getcardinfo",
            awardlevel: GetQueryString("AwardLevel")
        };
        g_type_self_api.LoadData(senddata, page_yaotv_youhuiquan.AfterLoadData, "");
    },
    //获取到数据后
    AfterLoadData: function (msg) {
        WX_JSAPI.WX_Card_ID = msg.card.card_id;
        page_yaotv_youhuiquan.SetBackGroud(msg.card.card_img);
        //console.log(WX_JSAPI.WX_Card_ID);
        if (IsInWeiXin.check()) {

            WX_JSAPI.wx = wx;
            WX_JSAPI.wxparam.debug = false;
            WX_JSAPI.func_CallBack = WX_JSAPI.WX_CardReady;
            WX_JSAPI.LoadParam("addCard");

            $("#btn_addcard").on("click", WX_JSAPI.WX_CardReady)
            $(".close").on("click", function () {
                if (WX_JSAPI.IsTest())
                    $("#btn_addcard").css("display", "none");
            });

        }
    },
    //设定优惠券图形
    SetBackGroud: function (imgurl) {
        imgurl = "url(\"" + imgurl + "\")";
        $(".coup").css("background-image", imgurl);
    },
};