

$(document).ready(function () {
   
    //自适应rem初始化设置
    //function fontSize(){
    //    if(document.documentElement.clientWidth<640){ //initial-scale=0.5是缩小一倍后适应屏幕宽。
    //        document.documentElement.style.fontSize = 10*(document.documentElement.clientWidth/320)+'px';
    //    }else{
    //        document.documentElement.style.fontSize='20px';
    //    }
    //}
    //fontSize();
    //window.onresize=function(){fontSize();};

    //专题页码
    $("#hid_page_number").val(GetQueryString("page_number"));

    //返回
    $("#a_go_back").on("tap", function () {
        //history.back();
        window.location.replace(g_const_PageURL.Index + "?t=" + Math.random());
    });

    /*领取优惠券*/
    ActivityCoupon.check();

});




//
var ActivityCoupon = {
    api_target: "com_cmall_familyhas_api_ApiGetTempletePageInfo",
    api_input: { "pageNum": "" },
    //登录判断,调用g_Type中UserLogin方法的判断是否登录，若已登录，直接兑换优惠券
    InputMobile: function (activityCode, validateFlag) {
        //PageUrlConfig.SetUrl();

        $("#hid_activityCode").val(activityCode);
        $("#hid_validateFlag").val(validateFlag);

        //调用g_Type中UserLogin方法的判断是否登录，若已登录，直接兑换优惠券
        UserLogin.CheckForCoupon_KSLQ_Mobile_n(ActivityCoupon_n.GetCoupon, ActivityCoupon.InputMobile_n);

    },
    //跳转
    InputMobile_n: function () {
        activityCode = $("#hid_activityCode").val();
        validateFlag = $("#hid_validateFlag").val();

        //登录、注册
        var tt = Base64.base64encode(g_const_PageURL.Coupon_KSLQ + "?page_number=" + $("#hid_page_number").val() + "&t=" + Math.random());
        window.location.href = g_const_PageURL.Coupon_KSLQ_Mobile + "?gobackurlaa=" + tt + "&activityCode=" + activityCode + "&validateFlag=" + validateFlag + "&page_number=" + $("#hid_page_number").val() + "&t=" + Math.random();

    },
    check: function () {
        if($("#hid_page_number").val()==""){
            //没有活动编码
            ShowMesaage(g_const_API_Message["106018"]);
            setTimeout(function () {
                window.location.replace(g_const_PageURL.Index + "?t=" + Math.random());
            }, 2000);
        }
        else{
            ActivityCoupon.ApiGetTempletePageInf();
        }
    },
    /*获取模版页面信息*/
    ApiGetTempletePageInf: function (activityCode, validateFlag, mobile) {

        ActivityCoupon.api_input.pageNum = $("#hid_page_number").val() //Base64.base64encode(suggestion);

        var s_api_input = JSON.stringify(ActivityCoupon.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": ActivityCoupon.api_target, "api_token": g_const_api_token.Unwanted };

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
                //ShowMesaage(g_const_API_Message["106017"]);

                //setTimeout(function () {
                //    //location = g_const_PageURL.Feedback_Index;//"/Feedback_Index.html";
                //    window.location.replace(g_const_PageURL.Feedback_Index + "?t=" + Math.random());
                //}, 2000);
                ActivityCoupon.Load_Result(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //接口返回失败后的处理
    Load_Result: function (msg) {

        $.each(msg.tempList, function (i, n) {
            //根据模板类型，替换页面图片
            switch(n.templeteType){
                case g_const_templeteType.YHJYHLL://优惠券(一行两栏)
                    var tt = "";
                    var activity_code = "";
                    $.each(n.pcList, function (ii, nn) {
                        if (activity_code == "") {
                            activity_code = nn.activity_code;
                        }
                        tt += "<div style=\"width:50%;float:left;\"><a onclick=\"ActivityCoupon.InputMobile('" + activity_code + "','" + nn.accountUseTime + "')\"><img src=\"" + nn.categoryImg + "\" /><div>";
                    });
                    $("#div_2").html(tt);
                    break;
                case g_const_templeteType.YHJYHYL://优惠券(一行一栏)
                    var tt = "<a onclick=\"ActivityCoupon.InputMobile('" + n.pcList[0].activity_code + "','" + n.pcList[0].accountUseTime + "')\"><img src=\"" + n.pcList[0].categoryImg + "\" />";
                    $("#div_1").html(tt);
                    break;
            }

        });

        if ($("#div_1").html() == "" && $("#div_2").html() == "") {
            //没有活动内容
            ShowMesaage(g_const_API_Message["106019"]);
            setTimeout(function () {
                window.location.replace(g_const_PageURL.Index + "?t=" + Math.random());
            }, 2000);

        }
    },
};


//领取活动优惠券
var ActivityCoupon_n = {
    api_target: "com_cmall_familyhas_api_ApiForActivityCoupon",
    api_input: { "activityCode": "", "validateFlag": "", "mobile": "" },

    //领取优惠券
    GetCoupon: function (mobile) {
        ActivityCoupon.api_input.activityCode = $("#hid_activityCode").val() //Base64.base64encode(suggestion);
        ActivityCoupon.api_input.validateFlag = $("#hid_validateFlag").val();
        ActivityCoupon.api_input.mobile = mobile;

        var s_api_input = JSON.stringify(ActivityCoupon.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": ActivityCoupon.api_target, "api_token": g_const_api_token.Wanted };

        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {

            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //PageUrlConfig.SetUrl();
                    //Session失效，重新登录，传递回调地址
                    UserRELogin.login(g_const_PageURL.Coupon_KSLQ + "?page_number=" + $("#hid_page_number").val() + "&activityCode=" + $("#hid_activityCode").val() + "&t=" + Math.random());
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                ShowMesaage(g_const_API_Message["106017"]);

            }
            else {
                ShowMesaage(msg.resultMessage);
            }

            //setTimeout(function () {
            //    //location = g_const_PageURL.Feedback_Index;//"/Feedback_Index.html";
            //    //window.location.replace(g_const_PageURL.Index + "?t=" + Math.random());
            //    window.location.replace(g_const_PageURL.Coupon_KSLQ + "?page_number=" + $("#hid_page_number").val() + "&t=" + Math.random());

            //}, 2000);

        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};