
//微信支付参数
var _wxJsApiParam = {};

$(document).ready(function () {
    $("#hid_uid").val(GetQueryString("uid"));
    //返回
    $(".go-back").click(function () {
        window.location.replace(PageUrlConfig.BackTo());

    });

    $("#btn_pay").click(function () {
        //$("#btn_pay").removeAttr("onclick");
        $("#btn_pay").hide();
        $("#btn_pay_wait").show();
        MyOrderPay.checklogin();
    });

    //获得传递的订单号
    if (GetQueryString("order_code") == "" && !(localStorage["my_order_code"] == undefined) && localStorage["my_order_code"] != "") {
        $("#hid_order_code").val(localStorage["my_order_code"]);
        localStorage["my_order_code"] = "";
    }
    else {
        $("#hid_order_code").val(GetQueryString("order_code"));
    }
    ////获得传递的金额
    //$("#hid_order_money").val(GetQueryString("order_money"));

    //获取订单详情
    MyOrder_detaile.GetList();
    //加载在线支付方式
    onlinePayType.getList();

    //396 获取微信支付方式
    WxPay.GetWxPayType();

});

function SavePayType11(paytype) {

    $("#alpayicq").removeClass();
    $("#weixinicq").removeClass();
    $("#yinlianicq").removeClass();
    //$("selother").attr("class", "");

    switch (paytype) {
        case "alipay":
            $("#alpayicq").attr("class", "curr");
            //保存支付方式对应代码
            $("#hid_selpaytype").val("alipay");
            MyOrderPay.selpayT = "alipay";
            break;
        case "weixin":
            $("#weixinicq").attr("class", "curr");
            //保存支付方式对应代码
            $("#hid_selpaytype").val("weixin");
            MyOrderPay.selpayT = "weixin";

            break;
        case "yinlian":
            $("#yinlianicq").attr("class", "curr");
            //保存支付方式对应代码
            $("#hid_selpaytype").val("yinlian");
            MyOrderPay.selpayT = "yinlian";

            break;

            //case "other":
            //    $("#selother").attr("class", "curr");
            //    //保存支付方式对应代码
            //    $("#hid_selpaytype").val("other");
            //    break;
    }

}

//我的订单--订单详情
var MyOrder_detaile = {
    //家有汇--订单配送轨迹查询接口
    api_target: "com_cmall_familyhas_api_ApiOrderDetails",
    api_input: { "order_code": "" },
    GetList: function () {
        //赋值
        MyOrder_detaile.api_input.order_code = $("#hid_order_code").val();

        //组织提交参数
        var s_api_input = JSON.stringify(this.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": MyOrder_detaile.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });
        //正常返回
        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //Session失效，重新登录，传递回调地址
                    UserRELogin.login(g_const_PageURL.MyOrder_pay + "?order_code=" + $("#hid_order_code").val())
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                MyOrder_detaile.Load_Result(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //接口返回成功后的处理
    Load_Result: function (resultlist) {
        //订单金额
        $("#hid_order_money").val(resultlist.order_money);
        //金额
        var order_money = "<dt>请支付：<em><i>￥</i>" + $("#hid_order_money").val() + "</em></dt>";
        ////支付方式
        //$("#hid_oldpaytype").val(resultlist.pay_type);
    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },

};

//在线支付包含的支付方式
var onlinePayType = {
    api_target: "com_cmall_familyhas_api_ApiPaymentTypeAll",
    api_input: { "order_code": "", "version": "20161017" },

    getList: function () {
        //赋值
        onlinePayType.api_input.order_code = $("#hid_order_code").val();

        //组织提交参数
        var s_api_input = JSON.stringify(this.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": onlinePayType.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });
        //正常返回
        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    PageUrlConfig.SetUrl();
                    //Session失效，重新登录，传递回调地址
                    UserRELogin.login(g_const_PageURL.MyOrder_pay + "?order_code=" + $("#hid_order_code").val())
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                onlinePayType.Load_Result(msg);
            }
            else {
                if (msg.resultMessage.indexOf("用户尚未登陆") > -1) {
                    PageUrlConfig.SetUrl();
                    UserRELogin.login(g_const_PageURL.MyOrder_pay + "?order_code=" + $("#hid_order_code").val())
                }
                else {
                    ShowMesaage(msg.resultMessage);
                }
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //接口返回成功后的处理
    Load_Result: function (result) {
        //金额
        var order_money = "<dt>请支付：<em><i>￥</i>" + $("#hid_order_money").val() + "</em></dt>";

        //支付方式
        var all_pay_type = "";
        //判断是否在为新内置浏览器
        var sel = "curr";
        $.each(result.paymentTypeAll, function (i, n) {
            switch (n) {
                case g_pay_Type.Alipay:
                    if (IsInWeiXin.check() == false) {
                        //all_pay_type += "<dd id=\"selalipay\" onclick=\"javascript: $('#alpayicq').removeClass(); $('#weixinicq').removeClass();$('#alpayicq').attr('class', 'curr');$('#hid_selpaytype').val('alipay');\" ><em class=\"alipay\"></em>支付宝<a id=\"alpayicq\" href=\"#\" class='" + sel + "' ></a></dd>";
                        all_pay_type += "<dd id=\"selalipay\" onclick=\"SavePayType11('alipay');\" ><em class=\"alipay\"></em>支付宝<a id=\"alpayicq\" href=\"#\" class='" + sel + "' ></a></dd>";
                        if (sel != "") {
                            $("#hid_selpaytype").val("alipay");
                            MyOrderPay.selpayT = "alipay";
                            sel = "";
                        }
                    }
                    break;
                case g_pay_Type.WXpay:
                    if (IsInWeiXin.check() == true) {
                        //all_pay_type += "<dd id=\"selweixin\" onclick=\"javascript:$('#alpayicq').removeClass(); $('#weixinicq').removeClass();$('#weixinicq').attr('class', 'curr');$('#hid_selpaytype').val('weixin');\" ><em class=\"weixin\"></em>微信支付<a id=\"weixinicq\" href=\"#\" class='" + sel + "' ></a></dd>";
                        all_pay_type += "<dd id=\"selweixin\" onclick=\"SavePayType11('weixin');\" ><em class=\"weixin\"></em>微信支付<a id=\"weixinicq\" href=\"#\" class='" + sel + "' ></a></dd>";
                        if (sel != "") {
                            $("#hid_selpaytype").val("weixin");
                            MyOrderPay.selpayT = "weixin";
                            sel = "";
                        }
                    }
                    break;
                case g_pay_Type.YinLianpay:
                    //all_pay_type += "<dd id=\"selyinlian\" onclick=\"javascript:$('#alpayicq').removeClass(); $('#weixinicq').removeClass();$('#yinlianicq').attr('class', 'curr');$('#hid_selpaytype').val('yinlian');\" ><em class=\"yinlian\"></em>银联支付<a id=\"yinlianicq\" href=\"#\" class='" + sel + "' ></a></dd>";
                    all_pay_type += "<dd id=\"selyinlian\" onclick=\"SavePayType11('yinlian');\" ><em class=\"blank\"></em>银联支付<a id=\"yinlianicq\" href=\"#\" class='" + sel + "' ></a></dd>";
                    if (sel != "") {
                        $("#hid_selpaytype").val("yinlian");
                        MyOrderPay.selpayT = "yinlian";
                        sel = "";
                    }
                    break;
            }
        });
        $(".pay-method").html(order_money + all_pay_type);

    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
};


//订单支付
var MyOrderPay = {
    selpayT: "",
    api_target: "com_cmall_familyhas_api_ApiForCouponCodeExchange",
    api_input: { "version": 1, "couponCode": "" },
    checklogin: function () {
        _orderid = $("#hid_order_code").val();
        //$("#sporderid").html(_orderid);
        //ShowMesaage(_orderid);
        //判断当前Session是否存在，不存在重新登录
        UserLogin.Check(MyOrderPay.ToPay);
    },
    //支付
    ToPay: function () {

        _orderid = $("#hid_order_code").val();
        //$("#sporderid").html(_orderid);
        //ShowMesaage(_orderid);
        //判断当前Session是否存在，不存在重新登录
        //if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
        //    //重新登录，并按链接回调
        //    UserRELogin.login(g_const_PageURL.MyOrder_pay + "?order_code=" + $("#hid_order_code").val())
        //    return;
        //}
        _pay_type = g_pay_Type.Alipay;


        switch (MyOrderPay.selpayT) {
            case "alipay":
                _pay_type = g_pay_Type.Alipay;
                break;
            case "weixin":
                _pay_type = g_pay_Type.WxPay;
                break;
            case "yinlian"://银联支付
                _pay_type = g_pay_Type.YinLianpay;
                break;
        }

        var openidStr = "";
        if (MyOrderPay.selpayT == "weixin") {
            openidStr = "?openID=" + $("#hid_uid").val();
            _pay_type = g_pay_Type.WXpay;
        }

        window.location.replace(g_HJYWebPay_url + _orderid + "/" + _pay_type + openidStr);

    },
    /*不提交网关，使用统一下单接口，本地处理*/
    WxPay: function (total_fee) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=wxpay&total_fee=" + total_fee + "&orderid=" + _orderid,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            _wxJsApiParam = msg
            callpay();// weixin/paypage.js中的方法
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    /*396 跳转网关支付*/
    GoPayGatePay: function (orderNo) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=gopaygatepayment&OrderNo=" + orderNo,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultcode == "0") {
                if (IsInWeiXin.check()) {
                    if ($("#hid_wxpaytype").val() == "1") {
                        ////本地jsapi处理
                        //_wxJsApiParam = JSON.parse(msg.resultmessage).jsapiparam;
                        //Message.Operate('', "divAlert");
                        //callpay();
                        ShowMesaage("不支持此支付方式");
                    }
                    else if ($("#hid_wxpaytype").val() == "2") {
                        //跳转网关处理
                        window.location.replace(msg.resultmessage);
                    }

                }
                else {
                    //跳转网关处理
                    window.location.replace(msg.resultmessage);
                }
            } else {
                ShowMesaage(msg.resultmessage);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    /*惠家有webPay接口，直接提交支付网关，本地不创建订单*/
    HJYWebPay: function (orderNo, paytype) {

        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=HJYWebPay&OrderNo=" + orderNo + "&paytype=" + paytype,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            try {
                msg = JSON.parse(msg);
            }
            catch (e) { }
            if (msg.resultcode) {
                $("#btn_pay_wait").hide();

                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    //Message.Operate('', "divAlert");
                    $("#btn_pay").show();
                    return;
                }
                else {
                    var jurl = g_HJYWebPay_url + orderNo + "/" + msg.paytype;
                    if (msg.paytype == g_pay_Type.WXpay) {
                        jurl += "?openID=" + msg.openid;
                    }
                    window.location.replace(jurl);

                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },

};

function jsApiCall() {
    WeixinJSBridge.invoke(
    'getBrandWCPayRequest',
     _wxJsApiParam,//josn串
     function (res) {
         //$("#btn_pay").click(function () {
         //    $("#btn_pay").removeAttr("onclick");
         //    MyOrderPay.checklogin();
         //});
         $("#btn_pay_wait").hide();
         $("#btn_pay").show();

         //WeixinJSBridge.log(res.err_msg);
         //alert(res.err_code + res.err_desc + res.err_msg);
         if (res.err_msg == "get_brand_wcpay_request:ok") {
             window.location.replace(g_const_PageURL.OrderSuccess + "?&paytype=wxpay&orderid=" + _orderid + "&t=" + Math.random());
         }
         if (res.err_msg == "get_brand_wcpay_request:cancel") {
             ShowMesaage(g_const_API_Message["100028"]);
         }
         if (res.err_msg == "get_brand_wcpay_request:fail") {
             window.location.replace(g_const_PageURL.OrderFail + "?&paytype=wxpay&orderid=" + _orderid + "&t=" + Math.random());
         }
     }
     );
}

/*396 微信支付支持可配置*/
var WxPay = {
    //获得微信支付方式
    GetWxPayType: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=GetWxPayRetflag",
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {

            $("#hid_wxpaytype").val(msg.payretflag);

        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
}