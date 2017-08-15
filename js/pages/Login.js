

$(document).ready(function () {
    //判断是否来源于app的请求
    fromApp = CheckFromApp.Check();


    if (CheckFromApp.param.app != "") {
        //来源于App的,且不传wxopenid的，隐藏微信登录
        if (CheckFromApp.param.wxopenid=="") {
            $(".d_other_login").hide();
        }
        //判断APP使用时是否隐藏“手机快捷登录”
        if (CheckFromApp.param.showphonelogin == "0") {
            $("#btnPhoneReg").hide();
        }
    }

    /*调用微信jsapi获取当前位置--前置操作*/

    //GetLocation.SetWXGetLocation();

    
    if (document.referrer = "" || document.referrer.indexOf("login") > 0) {
        $("#gobackurl").val("");
    }
    else {
        $("#gobackurl").val(Base64.base64encode(document.referrer));
    }


    //微信登录
    $("#weixin_login").click(function () {
        //window.location.href = "/Account/OauthLogin.aspx?oauthtype=WeiXin&gobackurlaa=" + $("#gobackurl").val();
        window.location.replace("/Account/OauthLogin.aspx?oauthtype=WeiXin&gobackurlaa=" + $("#gobackurl").val() + "&t=" + Math.random());

    });
    //密码登录
    $("#btnToLogin").click(function () {
        if ($("#txtLogin").val().length == 0) {
            ShowMesaage(g_const_API_Message["7901"]);
            return;
        }
        if (!isMobile($("#txtLogin").val())) {
            ShowMesaage(g_const_API_Message["7902"]);
            return;
        }
        if ($("#txtPass").val().length == 0) {
            ShowMesaage(g_const_API_Message["7903"]);
            return;
        }
        if ($("#txtPass").val().length < 6 || $("#txtPass").val().length > 16 || $("#txtPass").val().indexOf(' ') > -1) {
            ShowMesaage(g_const_API_Message["7904"]);
            return;
        }
        if (CheckFromApp.param.app == "") {
            //微信商城使用
            UserLogin_aa.Main()
        }
        else {
            //App跳转使用
            AppLogin.userlogin(String.Replace($("#txtLogin").val()), String.Replace($("#txtPass").val()));
        }
    });
    //手机登录
    $("#btnPhoneLogin").click(function () {
        if ($("#txtPhoneNo").val().length == 0) {
            ShowMesaage(g_const_API_Message["7901"]);
            return;
        }
        if ($("#txtValidCode").val().length == 0) {
            ShowMesaage(g_const_API_Message["7802"]);
            return;
        }
        UserLogin_aa.PhoneLogin()
    });
    //获取验证码
    $("#btnCode").click(function () {
        var phoneNo = $("#txtPhoneNo").val();
        var action = "loginvalidcode";
        if (phoneNo.length == 0) {
            ShowMesaage(g_const_API_Message["7901"]);
            return;
        }
        if (!isMobile(phoneNo)) {
            ShowMesaage(g_const_API_Message["7902"]);
            return;
        }
        Send_ValidCode.SendCode(action, phoneNo);
    });
    //返回
    $(".d_go_back").click(function () {
        if (CheckFromApp.param.app == "") {
            //history.back();
            //window.location.href = PageUrlConfig.BackTo(1);
            window.location.replace(PageUrlConfig.BackTo(1));
        }
        else {
            //关闭窗口
            AppLogin.jsInvokeClient('{ "type": "close_window", "obj": {} }', 'true');
        }

    });
    //注册
    $("#btnReg").click(function () {
        if (CheckFromApp.param.app == "") {
        window.location.href = g_const_PageURL.Reg + "?t=" + Math.random();
        }
        else {
            //App使用
            var ttt = CheckFromApp.UrlAddParam();
            window.location.href = g_const_PageURL.Reg + "?t=" + Math.random() + ttt;
        }
    });
    //手机注册
    $("#btnPhoneReg").click(function () {
        //location.href = g_const_PageURL.PhoneLogin + "?gobackurlaa=" + $("#gobackurl").val();

        if (CheckFromApp.param.app == "") {
            window.location.href = g_const_PageURL.PhoneLogin + "?gobackurlaa=" + $("#gobackurl").val() + "&t=" + Math.random();
        }
        else {
            //App注册
            var ttt = CheckFromApp.UrlAddParam();
            window.location.href = g_const_PageURL.PhoneLogin + "?gobackurlaa=" + $("#gobackurl").val() + "&t=" + Math.random() + ttt;
        }

    });

    //忘记密码
    $("#btnForget").click(function () {
        if (CheckFromApp.param.app == "") {
            //location.href = g_const_PageURL.ResetPassword;
            window.location.href = g_const_PageURL.ResetPassword + "?t=" + Math.random();
        }
        else {
            //App登录
            var ttt = CheckFromApp.UrlAddParam();
            window.location.href = g_const_PageURL.ResetPassword + "?t=" + Math.random() + ttt;
        }

    });

    //密码是否可见
    $("#d_emp").click(function () {
        if ($("#txtPass").attr("type") == "password") {
            //密码可见
            $("#txtPass").attr("type", "text");
            $("#d_emp").removeClass("d_emp");
        }
        else {
            //密码隐藏
            $("#txtPass").attr("type", "password");
            $("#d_emp").attr("class", "d_emp");
        }
    });
    //输入显示清除内容
    $("#txtLogin").keyup(function () {
        //只能输入数字
        this.value = this.value.replace(/\D/g, '')
        if ($("#txtLogin").val() != "") {
            $("#d_close").show();
        }
        else {
            $("#d_close").hide();
        }
    });

    $("#txtLogin").click(function () {
        //只能输入数字
        this.value = this.value.replace(/\D/g, '')
        if ($("#txtLogin").val() != "") {
            $("#d_close").show();
        }
        else {
            $("#d_close").hide();
        }
    });

    //点击清除
    $("#d_close").click(function () {
        $("#txtLogin").val("");
        $("#d_close").hide();
    });


    //输入显示清除内容
    $("#txtPass").keyup(function () {
        if ($("#txtPass").val() != "") {
            $("#d_close_psw").show();
        }
        else {
            $("#d_close_psw").hide();
        }

    });

    $("#txtPass").click(function () {
        if ($("#txtPass").val() != "") {
            $("#d_close_psw").show();
        }
        else {
            $("#d_close_psw").hide();
        }
    });


    //点击清除
    $("#d_close_psw").click(function () {
        $("#txtPass").val("");
        $("#d_close_psw").hide();
    });



    //取消操作
    $(".btns a").on("click", function (e) {
        var objthis = e.target;
        switch ($(objthis).attr("operate")) {
            case "yes":
                //返回提交前的页面
                if (localStorage.getItem(g_const_localStorage.BackURL).length > 0) {
                    pageurl = localStorage.getItem(g_const_localStorage.BackURL);
                }
                else {
                    pageurl = "/";
                }
                //location = pageurl;
                window.location.replace(pageurl);

                break;

        }

    });

    $("#txtLogin").focus();

});
//登录
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
                if (msg.resultcode == g_const_Success_Code) {

                    try {
                        UserLogin.LoginStatus = g_const_YesOrNo.YES;
                        UserLogin.LoginName = $("#txtLogin").val();
                    }
                    catch (e) { }
                    //if (IsInWeiXin.check()) {
                    //    WeiXinLogin.Check(UserLogin_aa.Load_Result);
                    //}
                    //else {
                    UserLogin_aa.Load_Result(JSON.parse(msg.resultmessage));
                        //WeiXinLogin.Check(UserLogin_aa.Load_Result);
                    //}
                    //if (msg.resultmessage.length > 0) {
                    //    localStorage[g_const_localStorage.Member] = msg.resultmessage;
                    //}
                }
                else {
                    if (g_const_API_Message[msg.resultcode]) {
                        ShowMesaage(g_const_API_Message[msg.resultcode]);
                    }
                    else {
                        ShowMesaage(msg.resultmessage);
                    }
                    // ShowMesaage(msg.resultmessage);
                    //alert(msg.resultmessage);
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
                    try {
                        UserLogin.LoginStatus = g_const_YesOrNo.YES;
                        UserLogin.LoginName = $("#txtPhoneNo").val();
                    }
                    catch (e) { }
                    UserLogin_aa.Load_Result(JSON.parse(msg.resultmessage));
                }
                else {
                    ShowMesaage(msg.resultmessage);
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (msg) {
        if (IsInWeiXin.check()) {
            //获得当前地址
            WX_JSAPI_T.LoadParam(g_const_wx_jsapi.getLocation);
        }
        
        msg.returnurl = PageUrlConfig.BackTo();
        var str_loginjs = JSON.stringify(msg);
        g_type_loginjs.Execute(str_loginjs);
    },
    Load_Result_Phone: function () {
        $("#mask").css("display", "block");
        $(".fbox.ftel").css("display", "");
    },

};
var Message = {
    ShowToPage: function (message, pageurl, time, str_callback) {
        ShowMesaage(message);
        setTimeout("window.location.replace( \"" + pageurl + "\");", time);

    }
};


/*使用微信jsapi获取当前地址*/
var GetLocation = {
    /*获取当前地址*/
    SetWXGetLocation: function () {
        if (IsInWeiXin.check()) {
            WX_JSAPI_T.wx = wx;
            WX_JSAPI_T.wxparam.debug = false;
            WX_JSAPI_T.jsApiList = g_const_wx_jsapi.getLocation;
            //点击按钮的回调方法[不在此处执行回调]
            WX_JSAPI_T.func_CallBack = "";
            WX_JSAPI_T.LoadParam(g_const_wx_jsapi.getLocation);
        }
    },
};




