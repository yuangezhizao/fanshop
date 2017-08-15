var verifyFlag = g_const_SMSPic_Flag;
var smstype = 2
$(document).ready(function () {
    //判断是否来源于app的请求
    fromApp = CheckFromApp.Check();


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

    if (CheckFromApp.param.app != "") {
        //来源于App的,且不传wxopenid的，隐藏微信登录
        if (CheckFromApp.param.wxopenid == "") {
            $(".d_other_login").hide();
        }
    }


    //微信登录
    $("#weixin_login").click(function () {
        window.location.replace("/Account/OauthLogin.aspx?oauthtype=WeiXin&gobackurlaa=" + $("#gobackurl").val());
    });


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
        UserLogin_aa.Main()
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
        UserLogin_aa.PhoneLogin()
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
        if (CheckFromApp.param.app == "") {
            window.location.replace(g_const_PageURL.Login + "?t=" + Math.random());
        }
        else {
            //App使用
            var ttt = CheckFromApp.UrlAddParam();
            window.location.replace(g_const_PageURL.Login + "?t=" + Math.random() + ttt);
        }

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
//编辑地址信息
var UserLogin_aa = {
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
                    WeiXinLogin.Check(UserLogin_aa.Load_Result);
                }
                else {
                    // UserLogin_aa.Load_Result();
                    WeiXinLogin.Check(UserLogin_aa.Load_Result);
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
                    //if (IsInWeiXin.check()) {
                    //    WeiXinLogin.Check(UserLogin_aa.Load_Result);
                    //}
                    //else {
                    //    // UserLogin_aa.Load_Result();
                    //    WeiXinLogin.Check(UserLogin_aa.Load_Result);
                    //}
                    //if (msg.resultmessage.length > 0) {
                    //    localStorage[g_const_localStorage.Member] = msg.resultmessage;
                    //}
                    UserLogin_aa.Load_Result(JSON.parse(msg.resultmessage));
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
        if (CheckFromApp.param.app != ""){
            //第三方使用，通过token获取用户信息
            GetMemberInfoByToken.userlogin(msg.Member.token, $("#txtPhoneNo").val());

        }
        else{
            msg.returnurl = PageUrlConfig.BackTo();
            var str_loginjs = JSON.stringify(msg);
            g_type_loginjs.Execute(str_loginjs);
        }
    },
    Load_Page: function () {
        var pageurl = PageUrlConfig.BackTo();
        Message.ShowToPage(g_const_API_Message["100025"], pageurl, 2000, "");
    },
};

