var verifyFlag = g_const_SMSPic_Flag;
var smstype = 2
$(document).ready(function () {

    //专题页码
    $("#hid_page_number").val(GetQueryString("page_number"));
    $("#hid_activityCode").val(GetQueryString("activityCode"));
    $("#hid_validateFlag").val(GetQueryString("validateFlag"));

    //与接口开发人员确认后，validateFlag始终传1
    //if($("#hid_validateFlag").val()!="1"){
    $("#hid_validateFlag").val("1");
    //}



    //调用g_Type中UserLogin方法的判断是否登录，若已登录，直接兑换优惠券[在跳转前已经判断了]
    //UserLogin.CheckForCoupon_KSLQ_Mobile(ActivityCoupon.GetCoupon);


    if (verifyFlag == 1) {
        $("#li_Verify").show();
        $("#Verify_codeImag").attr("src", "/Ajax/LoginHandler.ashx?action=code");

    }
    else {
        $("#li_Verify").hide();
        $("#Verify_codeImag").attr("src", "");
    }
    if (GetQueryString("gobackurl") != "") {
        $("#gobackurl").val(GetQueryString("gobackurl"));
    }


    $("#btnToLogin").on("click", function () {
        if ($("#txtLogin").val().length == 0) {
            ShowMesaage(g_const_API_Message["100023"]);
            return;
        }
        if ($("#txtPass").val().length == 0) {
            ShowMesaage(g_const_API_Message["100024"]);
            return;
        }
        if ($("#txtPass").val().length < 6 || $("#txtPass").val().length > 16 || $("#txtPass").val().indexOf(' ') > -1) {
            ShowMesaage(g_const_API_Message["7904"]);
            return;
        }
        UserLogin_KSLQ_Mobile.Main()
    });

    $("#btnPhoneLogin").on("click", function () {
        if ($("#txtPhoneNo").val().length == 0) {
            ShowMesaage(g_const_API_Message["100023"]);
            return;
        }
        if ($("#txtValidCode").val().length == 0) {
            ShowMesaage(g_const_API_Message["7802"]);
            return;
        }
        UserLogin_KSLQ_Mobile.PhoneLogin()
    });

    $("#btnCode").on("click", function () {
        var phoneNo = $("#txtPhoneNo").val();
        var action = "loginvalidcode";
        var piccode = $("#txtPicCode").val();
        if (verifyFlag == 1) {
            if (piccode.length == 0) {
                ShowMesaage(g_const_API_Message["8904"]);
                return;
            }
        }
        if (phoneNo.length == 0) {
            ShowMesaage(g_const_API_Message["7901"]);
            return;
        }
        if (!isMobile(phoneNo)) {
            ShowMesaage(g_const_API_Message["7902"]);
            return;
        }
        Send_ValidCode.SendCodeImgEx(action, phoneNo, piccode, smstype);
    });


    //返回
    $(".d_go_back").on("click", function () {
        //history.back();
        window.location.replace(g_const_PageURL.Coupon_KSLQ + "?page_number=" + $("#hid_page_number").val()+ "&t=" + Math.random());
    });
    //协议
    $("#span_xy").on("click", function () {
        window.location.replace(g_const_PageURL.xieyi + "?t=" + Math.random());
    });


    //输入显示清除内容
    $("#txtPhoneNo").on("click", function () {
        //只能输入数字
        this.value = this.value.replace(/\D/g, '')
        if ($("#txtPhoneNo").val() != "") {
            $("#d_close_tel").show();
        }
        else {
            $("#d_close_tel").hide();
        }
    });

    $("#txtPhoneNo").on("click", function () {
        //只能输入数字
        this.value = this.value.replace(/\D/g, '')
        if ($("#txtPhoneNo").val() != "") {
            $("#d_close_tel").show();
        }
        else {
            $("#d_close_tel").hide();
        }
    });

    //点击清除
    $("#d_close_tel").on("click", function () {
        $("#txtPhoneNo").val("");
        $("#d_close_tel").hide();
    });


    //输入显示清除内容
    $("#txtValidCode").keyup(function () {
        if ($("#txtValidCode").val() != "") {
            $("#d_close").show();
        }
        else {
            $("#d_close").hide();
        }
    });

    $("#txtValidCode").on("click", function () {
        if ($("#txtValidCode").val() != "") {
            $("#d_close").show();
        }
        else {
            $("#d_close").hide();
        }
    });

    //点击清除
    $("#d_close").on("click", function () {
        $("#txtValidCode").val("");
        $("#d_close").hide();
    });

    $("#txtPhoneNo").focus();
});



//
var UserLogin_KSLQ_Mobile = {
    Main: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=userlogin&username=" + String.Replace($("#txtLogin").val()) + "&password=" + String.Replace($("#txtPass").val()),
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (IsInWeiXin.check()) {
                    WeiXinLogin.Check(UserLogin_KSLQ_Mobile.Load_Result);
                }
                else {
                    // UserLogin_KSLQ_Mobile.Load_Result();
                    WeiXinLogin.Check(UserLogin_KSLQ_Mobile.Load_Result);
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    PhoneLogin: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=phonelogin&phoneno=" + $("#txtPhoneNo").val() + "&validcode=" + $("#txtValidCode").val(),
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {
                    UserLogin_KSLQ_Mobile.Load_Result(JSON.parse(msg.resultmessage));
                }
                else {
                    if (g_const_API_Message[msg.resultcode]) {
                        ShowMesaage(g_const_API_Message[msg.resultcode]);
                    }
                    else {
                        ShowMesaage(msg.resultmessage);
                    }
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (msg) {

        //msg.returnurl = PageUrlConfig.BackTo();
        //var str_loginjs = JSON.stringify(msg);
        //g_type_loginjs.Execute(str_loginjs);

        //兑换优惠券
        ActivityCoupon.GetCoupon($("#txtPhoneNo").val());
    },
    Load_Page: function () {
        var pageurl = PageUrlConfig.BackTo();
        Message.ShowToPage(g_const_API_Message["100025"], pageurl, 2000, "");
    },
};

//领取活动优惠券
var ActivityCoupon = {
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
                    UserRELogin.login(g_const_PageURL.Coupon_KSLQ + "?page_number="+$("#hid_page_number").val()+"&activityCode="+$("#hid_activityCode").val()+"&t=" + Math.random());
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

            setTimeout(function () {
                //location = g_const_PageURL.Feedback_Index;//"/Feedback_Index.html";
                //window.location.replace(g_const_PageURL.Index + "?t=" + Math.random());
                window.location.replace(g_const_PageURL.Coupon_KSLQ + "?page_number=" + $("#hid_page_number").val() + "&t=" + Math.random());

            }, 2000);

        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};