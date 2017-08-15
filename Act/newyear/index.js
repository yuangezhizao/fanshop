//var url_wx = "wy";
var url_web = "/index.html";
// var param = "";
var smstype = "";
var verifyFlag = g_const_SMSPic_Flag;
var actObj = [];
$(document).ready(function () {
        
    if (verifyFlag == 1) {
        $("#li_Verify").show();
        $("#Verify_codeImag").attr("src", "/Ajax/LoginHandler.ashx?action=code");

    }
    else {
        $("#li_Verify").hide();
        $("#Verify_codeImag").attr("src", "");
    }
    $("#hidcardid").val(GetQueryString("cardid"));
    $("#hidcardkey").val(GetQueryString("cardkey"));
    $("#hidexchangedcode").val(GetQueryString("exchangedcode"));
    localStorage[g_const_localStorage.Card_Key] = $("#hidcardkey").val();
    if (GetQueryString("merchant")!="") {
        $("#hidmerchant").val(GetQueryString("merchant"));
    }
    if (GetQueryString("from") != "") {
        $("#hidmerchant").val(GetQueryString("from"));
    }
    if (localStorage["actlist"]!=null) {
        if (localStorage["actlist"] != "") {
            actObj = JSON.parse(localStorage["actlist"]);
            url_web = actObj.linkurl + "&from=" + $("#hidmerchant").val() + "&t=" + Math.random();
            smstype = actObj.smstype;

            $("#atOnce").html("领取100元红包<i>▶</i>");

            $("#lbl_succ_0").html("查看年货 &gt;&gt;");
            $("#lbl_succ_1").html("年货红包");
            $("#lbl_succ_2").html("领取成功！");
            $("#lbl_succ_3").html("下载惠家有，查看红包");


            $("#lbl_have_0").html("查看年货 &gt;&gt;");
            $("#lbl_have_1").html("你已领取过了！");
           // $("#lbl_have_2").html("移动APP下单及时查看订单状态哦！");
            $("#lbl_have_3").html("下载惠家有，查看红包");
            $("#lbl_have_4").html("新人还有大礼包哦！");

            $("#lbl_fail_0").html("查看年货 &gt;&gt;");
            $("#lbl_fail_1").html("领取失败了~");
            $("#lbl_fail_2").html("不用担心，直接下载APP<br>送新人大礼包！");
            $("#lbl_fail_3").html("下载惠家有，查看红包");

            
            
        }
    }

    if ($("#hidcardid").val() != "") {
        CouponCodeExchange.CheckAPI();
    }
    var defaultValue = $("#txtNum").val();
    var oIn_defaultValue = $("#in").val();
    var oPc_defaultValue = $("#txtPicCode").val();
    $("#txtNum").on('click', function () {
        if ($("#txtNum").val() == defaultValue) {
            $("#txtNum").val('');
        }
    });
    $("#txtNum").on('blur', function () {
        if ($("#txtNum").val() == '') {
            $("#txtNum").val('请输入11位有效手机号');
        }
    });
    //......
    $("#in").on('click', function () {
        if ($("#in").val() == oIn_defaultValue) {
            $("#in").val('');
        }
    });
    $("#in").on('blur', function () {
        if ($("#in").val() == '') {
            $("#in").val( '请输入验证码');
        }
    });

    $("#txtPicCode").on('click', function () {
        if ($("#txtPicCode").val() == oPc_defaultValue) {
            $("#txtPicCode").val('');
        }
    });
    $("#txtPicCode").on('blur', function () {
        if ($("#txtPicCode").val() == '') {
            $("#txtPicCode").val('请输入图片验证码');
        }
    });

    var timer = null;
    $("#btnCode").on('click', function () {


            



        if (sendflag == 1) {
            return;
        }
        var _this = this;
        clearInterval(timer);



        var piccode = $("#txtPicCode").val();
        if (verifyFlag == 1) {
            if (piccode.length == 0 || piccode == oPc_defaultValue) {
                ShowMesaage(g_const_API_Message["8904"]);
                return;
            }
        }
        var tel = $("#txtNum").val();
        if (tel.length == 0 || tel == defaultValue) {
            //flag.innerHTML = g_const_API_Message["107901"];
            //flag.style.display = 'block';
            ShowMesaage(g_const_API_Message["107901"] );
            return;
        }
        if (!isMobile(tel)) {
            //flag.innerHTML = g_const_API_Message["107902"];
            //flag.style.display = 'block';
            ShowMesaage(g_const_API_Message["107902"]);
            return;
        }
        if (localStorage["ValidCodeTime"]) {
            var oldtime = localStorage["ValidCodeTime"];
            var newtime = new Date().getTime();
            var check = newtime - oldtime;
            if (check < 0 * 1000) {
                ShowMesaage("发送短信太频繁");
                return;
            }
        }
        localStorage["ValidCodeTime"] = new Date().getTime();
        localStorage["ValidCodeTime"] = new Date().getTime();
        var action = "couponcodeexchange";
        Send_ValidCode.MerchantID = $("#hidmerchant").val();
        Send_ValidCode.SendCodeImgEx(action, tel, piccode, smstype);
    });
    $("#atOnce").on('click', function () {
        var tel = $("#txtNum").val();
        var code = $("#in").val();
        if (tel.length == 0) {
            //flag.innerHTML = g_const_API_Message["107901"];
            //flag.style.display = 'block';
            ShowMesaage(g_const_API_Message["107901"]);
            return;
        }
        if (!isMobile(tel)) {
            //flag.innerHTML = g_const_API_Message["107902"];
            //flag.style.display = 'block';
            ShowMesaage(g_const_API_Message["107902"]);
            return;
        }

        if ($("#in").val().length == 0) {
            //flag.innerHTML = g_const_API_Message["107802"];
            //flag.style.display = 'block';
            ShowMesaage(g_const_API_Message["107802"]);
            return;
        }
        Merchant1.RecordPageAct($("#hidmerchant").val(), "_exchange");
        Register.PhoneNo = tel;
        Register.ValidCode = code;
        Register.PhoneRegister();
        //this.parentNode.style.display='none';
        //open.style.display='block';
    });
    $("#btnclose").on('click', function () {
        if (IsInWeiXin.check()) {
            var retstr = $("#hidmerchant").val();
            if ($("#hidcardid").val() != "") {
                CouponCodeExchange.CheckAPI();
            }
            window.location.replace("/Account/OauthLogin.aspx?oauthtype=WeiXin&returnurl=" + GetReturnParam() + "&isreg=1");
        }
        else {
            window.location.replace(url_web);
        }
    });
});
//跳转活动页面
function CloseAct() {
    if (IsInWeiXin.check()) {
        var retstr = $("#hidmerchant").val();
        if ($("#hidcardid").val() != "") {
            CouponCodeExchange.CheckAPI();
        }
        window.location.replace("/Account/OauthLogin.aspx?oauthtype=WeiXin&returnurl=" + GetReturnParam() + "&isreg=1");
    }
    else {
        window.location.replace(url_web);
    }
}
//获得微信跳转参数
function GetReturnParam() {
    var retstr = $("#hidmerchant").val();
    if ($("#hidcardid").val() != "") {
        retstr = $("#hidcardid").val();
    }
    return retstr;
}

function ResultApp() {
    Merchant1.RecordPageAct($("#hidmerchant").val(), "_openapp");
    openApp();
}
var sendflag = 0;
function ShowMesaage(sMessage) {
    alert(sMessage);
    //new ToastEx({ context: $('body'), message: sMessage, top: '50%' }).show();
}
var ToastEx = function (config) {
    this.context = config.context == null ? $('body') : config.context;//上下文  
    this.message = config.message;//显示内容  
    this.time = config.time == null ? 5000 : config.time;//持续时间  
    this.left = config.left;//距容器左边的距离  
    this.top = config.top;//距容器上方的距离  
    this.init();
}
var msgEntity;
ToastEx.prototype = {
    //初始化显示的位置内容等  
    init: function () {
        $("#toastMessage").remove();
        //设置消息体  
        var msgDIV = new Array();
        msgDIV.push('<div id="hahaWrap">');
        msgDIV.push('<div id="toastMessage">');
        msgDIV.push('<span class="stxt">' + this.message + '</span>');
        msgDIV.push('<span class="sbg">&nbsp;</span></div></div>');
        msgEntity = $(msgDIV.join('')).appendTo(this.context);
        //设置消息样式  
        var left = this.left == null ? this.context.width() / 2 - msgEntity.find('span').width() / 2 - 12 : this.left;
        var top = this.top == null ? '20px' : this.top;
        //msgEntity.css({position:'fixed',top:top,'z-index':'9999',left:left,'background-color':'black',color:'white','font-size':'1em',padding:'10px',margin:'10px'});  
        msgEntity.css({ top: top});
        msgEntity.hide();
    },
    //显示动画  
    show: function () {
        //msgEntity.fadeIn(this.time/2);  
        //msgEntity.fadeOut(this.time/2); 
        msgEntity.fadeIn(this.time / 5);
        msgEntity.fadeOut(this.time / 5);
    }

};

//注册
var Register = {
    PhoneNo:"",
    ValidCode:"",
    PhoneRegister: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=phonereg_exchange" + "&phoneno=" + Register.PhoneNo + "&validcode=" + Register.ValidCode + "&mercode=" + $("#hidmerchant").val() + "&smstype=" + smstype,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {
                    Register.Load_Result(msg);
                }
                else {
                    //flag.innerHTML = g_const_API_Message[msg.resultcode];
                    //flag.style.display = 'block';
                    ShowMesaage(g_const_API_Message[msg.resultcode]);
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            //flag.innerHTML = g_const_API_Message["7001"];
            //flag.style.display = 'block';
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (msg) {
        if (msg.resultmessage == "isnew") {
            localStorage[g_const_localStorage.IsnewReg] = 1;
            g_type_loginjs.Member.phone = Register.PhoneNo;
            localStorage[g_const_localStorage.Member] = JSON.stringify(g_type_loginjs);
        }
        else {
            localStorage[g_const_localStorage.IsnewReg] = 0;
        }
        CouponCodeExchange.GetList();
    },
};

//优惠码兑换
var CouponCodeExchange = {
    api_target: "com_cmall_familyhas_api_ApiForCouponCodeExchange",
    api_input: { "version": 1, "couponCode": "" },
    ExchangeCode: "",
    GetList: function () {
        var s_api_input = "";
        var obj_data = [];
        if (actObj.apitype == "1") {
            //口令兑换
            CouponCodeExchange.api_target = "com_cmall_familyhas_api_ApiForCouponCodeExchange";
            CouponCodeExchange.api_input = { "version": 1, "couponCode": "" };
            $.each(actObj.couponcode.split(','), function (i, n) {
                CouponCodeExchange.api_input.couponCode = Base64.base64encode(Base64.utf16to8(n));
                CouponCodeExchange.ExchangeCode = n;
                return false;
            });


        }
        else {
            //活动兑换
            CouponCodeExchange.api_target = "com_cmall_familyhas_api_ApiForActivityCoupon";
            CouponCodeExchange.api_input = { "version": 1, "activityCode": "", "mobile": "", "validateFlag": "" };
            CouponCodeExchange.api_input.activityCode = actObj.couponcode;
            CouponCodeExchange.api_input.mobile = Register.PhoneNo;
            if (actObj.exchangetimes == "1") {
                CouponCodeExchange.api_input.validateFlag = "2";
            }
            else {
                CouponCodeExchange.api_input.validateFlag = "1";
            }
                    
        }
        var obj_data = { "api_input": JSON.stringify(CouponCodeExchange.api_input), "api_target": CouponCodeExchange.api_target, "api_token": g_const_api_token.Wanted };
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
                CouponCodeExchange.Load_Result(1);
            }
            else if (msg.resultCode == "939301311" || msg.resultCode == "939301303") {//已兑换过
                CouponCodeExchange.Load_Result(2);
            }
            else {
                CouponCodeExchange.Load_Result(0);
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //接口返回成功后的处理
    Load_Result: function (type) {
        document.getElementById('div_failed').style.display = 'none';
        document.getElementById('div_success').style.display = 'none';
        document.getElementById('div_converted').style.display = 'none';
        switch (type) {
            case 1:
                document.getElementById('div_success').style.display = 'block';
                break;
            case 2:
                document.getElementById('div_converted').style.display = 'block';
                break;
            case 0:
                $("#div_re").attr("class", "re_failed");
                document.getElementById('div_failed').style.display = 'block';
                break;
        }

        document.getElementById('atOnce').parentNode.style.display = 'none';
        document.getElementById('open').style.display = 'block';
        if ($("#hidcardid").val()!="") {
            //通知接口兑换结果
            CouponCodeExchange.NoticeAPI(type);
        }
        else {
            if (IsInWeiXin.check()) {
                setTimeout("window.location.replace(\"/Account/OauthLogin.aspx?oauthtype=WeiXin&returnurl=" + GetReturnParam() + "&isreg=1\");", 5000);
            }
            else {
                setTimeout("window.location.replace(\"" + url_web + "\");", 5000);
            }
        }
    },
    //接口返回失败后的处理
    NoticeAPI: function (type) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=exchangecoupon_wxapi&cardid=" + $("#hidcardid").val() + "&result=" + type + "&code=" + CouponCodeExchange.ExchangeCode,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (IsInWeiXin.check()) {
                setTimeout("window.location.replace(\"/Account/OauthLogin.aspx?oauthtype=WeiXin&returnurl=" + GetReturnParam() + "&isreg=1\");", 5000);
            }
            else {
                setTimeout("window.location.replace(\"" + url_web + "\");", 5000);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            if (IsInWeiXin.check()) {
                setTimeout("window.location.replace(\"/Account/OauthLogin.aspx?oauthtype=WeiXin&returnurl=" + GetReturnParam() + "&isreg=1\");", 5000);
            }
            else {
                setTimeout("window.location.replace(\"" + url_web + "\");", 5000);
            }
        });
    },
    //接口返回失败后的处理
    CheckAPI: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=wxcard_check&cardid=" + $("#hidcardid").val(),
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode != g_const_Success_Code_IN.toString()) {
                location.replace(g_const_PageURL.Index);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            location.replace(g_const_PageURL.Index);
        });
    },
};

function hjy() {
    // window.location.replace("/Account/OauthLogin.aspx?oauthtype=WeiXin&returnurl=" + GetReturnParam() + "&isreg=1");
}