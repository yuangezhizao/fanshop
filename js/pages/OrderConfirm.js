//订单类型
var _order_type;
//订单类型
var _order_souce;
//区编码
var _area_code;
//优惠券
var _coupon_codes;
//商品列表
var _goods=[];
//商品价格
var _goodsprice;
//支付类型
var _pay_type = "";
//支付类型
var _fapiao;
//发票内容
var _fapiaonr;
//发票备注
var _fapiaobillRemark;
//应付金额
var _pay_money;
//应付金额
var _cash_money;
//送货地址ID
var _addressid = 0;
//微信支付参数
var _wxJsApiParam = {};
//订单编号
var _orderid = "";
var _issmg = 0;
//详细地址
var _addressStreet = "";
var of_status = 1;
var _orderfrom = "";
var _needVerifyIdNumber = 0;
//提交商品数据
var productCodeList = "";
var productNameList = "";
var productPriceList = "";
var productNumberList = "";

//多麦--订单需要的商品参数
var duomai_goods_id="";//商品编号
var duomai_goods_name="";//商品名称
var duomai_goods_price="";//商品单价
var duomai_goods_ta="";//商品数量
var duomai_goods_cate="";//商品分类编号
var duomai_totalPrice="";//每个商品实际支付金额
var duomai_SumPrice = "";//商品应付总金额
var duomai_manjianPrice = "";//商品满减金额


$(document).ready(function () {
    if (GetQueryString("noclear") == "") {
        //清空发票信息
        localStorage[g_const_localStorage.FaPiao] = "";
    }

    $("#hid_uid").val(GetQueryString("uid"));
    //点击保存支付方式至缓存
    $("#divalipay").click(function () {
        localStorage["selpaytype"] = "divalipay";
    });
    $("#divweixin").click(function () {
        localStorage["selpaytype"] = "divweixin";
    });
    $("#divgetpay").click(function () {
        localStorage["selpaytype"] = "divgetpay";
    });
    //if (localStorage[g_const_localStorage.OrderFrom] != null) {
    //    Merchant1.Check();
    //}
    _orderfrom = localStorage[g_const_localStorage.OrderFrom];
    // localStorage.setItem(g_const_localStorage.OrderConfirm, JSON.stringify({ "GoodsInfoForAdd": [{ "sku_num": 2, "area_code": "", "product_code": "120903", "sku_code": "120903" }] }))
    //localStorage.setItem(g_const_localStorage.CouponCodes, JSON.stringify({ "coupon_codes": [""] }))
    //localStorage.setItem(g_const_localStorage.FaPiao, JSON.stringify({ "BillInfo": { "bill_Type": "449746310001", "bill_detail": "明细", "bill_title": "个人" } }))
    if (localStorage.getItem(g_const_localStorage.OrderAddress) != null) {
        _addressid = localStorage.getItem(g_const_localStorage.OrderAddress);
    }
    if (!localStorage.getItem(g_const_localStorage.StoreDistrict)) {
        Address_All.GetList();
    }
    if (localStorage.getItem(g_const_localStorage.OrderConfirm)) {
        _goods = JSON.parse(localStorage[g_const_localStorage.OrderConfirm]).GoodsInfoForAdd;
    }
    if (_goods.length==0) {
        location.replace(PageUrlConfig.BackTo());
        return;
    }

    if (localStorage.getItem(g_const_localStorage.OrderPrice)) {
        _goodsprice = JSON.parse(localStorage.getItem(g_const_localStorage.OrderPrice)).GoodsInfoPrice;
    }
    if (localStorage.getItem(g_const_localStorage.CouponCodes)) {
        _coupon_codes = JSON.parse(localStorage.getItem(g_const_localStorage.CouponCodes)).coupon_codes;
    }
    if (localStorage.getItem(g_const_localStorage.FaPiao)) {
        _fapiao = JSON.parse(localStorage.getItem(g_const_localStorage.FaPiao)).BillInfo;
    }
    else {
        localStorage.setItem(g_const_localStorage.FaPiao, JSON.stringify({ "BillInfo": { "bill_Type": "0", "bill_detail": "明细", "bill_title": "个人" } }));
    }
    //有待修改
    _order_type = g_order_Type.Common;
    UserLogin.Check(SetLoginDiv);
    $("#btnSubmit").click(function () {
        //if ($("#spaddressdetail").html().length == 0) {
        //    ShowMesaage(g_const_API_Message["100030"]);
        //    return;
        //}
        //if (_needVerifyIdNumber == 1 && Address_Update.api_input.idNumber=="") {
        //    Message.ShowAlert(g_const_API_Message[106001], "", "divAlert", "确定", "SetIdNumFocus");
        //    return;
        //}
        //if (_pay_type.length == 0) {
        //    ShowMesaage(g_const_API_Message["100031"]);
        //    return;
        //}
        if (_needVerifyIdNumber == 1 && Address_Update.api_input.idNumber == "") {
            Message.ShowAlert(g_const_API_Message[106001], "", "divAlert", "确定", "SetIdNumFocus");
            return;
        }
        if (_needVerifyIdNumber == 1 && Address_Update.api_input.idNumber != "") {
            UserIdentity.Type = 3;
            UserIdentity.Check(Address_Update.api_input.idNumber);
        }
        else {
            OrderCreate.CreateToJYH();
        }
        // OrderCreate.CreateToJYH();
    });
    //编辑地址
    $("#divAddressLogin").click(function () {
        //保存返回地址
        PageUrlConfig.SetUrl();
        localStorage["fromOrderConfirm"] = "1"
        if (_addressid == "") {
            _addressid = "0";
        }
        window.location.href = g_const_PageURL.AddressList + "?addressid=" + _addressid + "&login=" + UserLogin.LoginStatus + "&t=" + Math.random();
    });
    //编辑地址
    $("#divAddressUnLogin").click(function () {
        //保存返回地址
        PageUrlConfig.SetUrl();
        localStorage["fromOrderConfirm"] = "1"
        if (_addressid == "") {
            _addressid = "0";
        }
        window.location.href = g_const_PageURL.AddressEdit + "?addressid=0&login=" + UserLogin.LoginStatus + "&t=" + Math.random();
    });
    //编辑发票
    $("#divfp").click(function () {
        localStorage.setItem(g_const_localStorage.FaPiaoNR, "{\"bills\":" + JSON.stringify(_fapiaonr) + ",\"billremark\":" + JSON.stringify(_fapiaobillRemark) + "}");
        window.location.href = g_const_PageURL.fapiao + "?uid=" + $("#hid_uid").val() + "&t=" + Math.random();
    });
    $("#btnToLogin").click(function () {
        //location.href = g_const_PageURL.Login;
        PageUrlConfig.SetUrl();
        //登录后自动回跳订单确认页
        UserRELogin.login(g_const_PageURL.OrderConfirm);
        if (_issmg == 1) {
            if (IsInWeiXin.check()) {
                var backurl = g_const_PageURL.Login + "?showwxpaytitle=1";
                window.location.replace(g_const_PageURL.OauthLogin + "?oauthtype=WeiXin&returnurl=" + encodeURIComponent(backurl) + "&scope=b");
            }
        }
    });
    //编辑优惠券
    $("#divyhq").click(function () {
        //localStorage.setItem(g_const_localStorage.FaPiaoNR, "{\"bills\":" + JSON.stringify(_fapiaonr) + "}");
        PageUrlConfig.SetUrl();
        location.href = g_const_PageURL.CouponCodes + "?shouldPay=" + _pay_money + "&t=" + Math.random();
    });

    //后退至商品详情页
    $("#btnBack").click(function () {
        //清除缓存支付方式
        localStorage["selpaytype"] = "";
        localStorage[g_const_localStorage.CouponCodes] = "";
        Message.ShowConfirm("确定要取消订单吗？", "稍后商品可能会被抢走哦～", "divAlert", "取消订单", "CancelOrder", "继续购买");
    });

    //396 获取微信支付方式
    WxPay.GetWxPayType();

});
function CreateOrder() {
    if (_needVerifyIdNumber == 1 && Address_Update.api_input.idNumber == "") {
        Message.ShowAlert(g_const_API_Message[106001], "", "divAlert", "确定", "SetIdNumFocus");
        return;
    }
    if (_needVerifyIdNumber == 1 && Address_Update.api_input.idNumber != "") {
        UserIdentity.Type = 3;
        UserIdentity.Check(Address_Update.api_input.idNumber);
    }
    else {
        OrderCreate.CreateToJYH();
    }
}
function SetLoginDiv() {
    Merchant1.RecordBuy();
    if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
        $("#divLogin").hide();
        if (_addressid == 0 || _addressid == "") {
            Address_Default.GetObj();
        }
        else {
            Address_Info.GetByID(_addressid);
        }
    }
    else {
        $("#divLogin").show();
        CartInfo.LoadData();
    }
}
function setPaytype(type, obj) {
    $("#btnAlipay").attr("class", "sela");
    $("#btnGetpay").attr("class", "sela");
    $("#btnWeixin").attr("class", "sela");
    $(obj).attr("class", "sela on");
    switch (type) {
        case 1:
            _pay_type = g_pay_Type.Alipay;
            break;
        case 0:
            _pay_type = g_pay_Type.Getpay;
            break;
        case 2:
            _pay_type = g_pay_Type.WXpay;
            break;
    }
}

function CancelOrder() {
    //回退到商品详情页
    window.location.replace(PageUrlConfig.BackTo());
}

function SetIdNumFocus() {
    $("#txtIDNum").focus();
}
var CartInfo = {
    //获取购物车信息
    LoadData: function () {
        var api_input = { "goodsList": _goods };
        var api_target = "com_cmall_familyhas_api_APiShopCartForCache";
        var s_api_input = JSON.stringify(api_input);
        var obj_data = { "api_input": s_api_input, "api_target": api_target, "api_token": (UserLogin.LoginStatus == g_const_YesOrNo.YES ? "1" : "") };
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
                CartInfo.SetCartList(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //设置页面信息
    SetCartList: function (msg) {
        if (msg.acount_num > 0) {
            var sku_price_unit = 0.00;
            var sku_price_total = 0.00;
            var divHtml = "";
            $.each(msg.shoppingCartList, function (k, o) {
                divHtml += "<div class=\"ch-box\" >";
                //if (o.event.tagname.length > 0) {
                //    divHtml += "<h2><em>" + o.event.tagname + "</em>" + o.event.description + "</h2>";
                //}
                divHtml += "<ul>";
                $.each(o.goods, function (i, n) {

                    divHtml += "<div class=\"sbox spro\">";
                    //原有本地图片，3.9.4后注销
                    //if (n.labelsList.length >= 1) {
                    //    var label = g_const_ProductLabel.find(n.labelsList[0]);
                    //    if (label) {
                    //        divHtml += '<img class="d_add_ys" src="' + label.spicture + '" alt="" />';
                    //    }
                    //}
                    //3.9.4 从接口获取图片
                    if (n.labelsPic != "" && !(n.labelsPic == undefined)) {
                        divHtml += '<img class="d_add_ys" src="' + n.labelsPic + '" alt="" />';
                    }

                    divHtml += "    <img src=\"" + g_GetPictrue(n.pic_url) + "\" alt=\"\" />";
                    divHtml += "    <div class=\"imgr\">";
                    divHtml += "        <p class=\"pt\">" + String.DelHtmlTag(n.sku_name) + "</p>";
                    $.each(n.sku_property, function (j, m) {
                        if (m.length > 0) {
                            divHtml += "        <p>" + m.propertyKey + "：" + m.propertyValue + "</p>";
                        }
                    });
                    divHtml += "    </div>";
                    divHtml += "    <div class=\"imgrr\">";
                    divHtml += "        <p class=\"price\"><b>￥</b>" + n.sku_price + "</p>";
                    divHtml += "        <p class=\"pnum\">x" + n.sku_num + "</p>";
                    $.each(n.activitys, function (j, m) {
                        if (m.activity_name) {
                            divHtml += "        <p class=\"ptag\"><span class=\"tag\">" + m.activity_name + "</span></p>";
                        }
                    });

                    divHtml += "    </div>";
                    divHtml += "</div>";
                    sku_price_unit += n.sku_price;
                    sku_price_total += n.sku_price * n.sku_num;
                    if (localStorage[g_const_localStorage.SMG_ProductID].indexOf("IC_SMG_") > -1) {
                        _issmg = 1;
                    }
                });
                divHtml += "</ul>";
                divHtml += "</div>";
            });
            $("#divGoodsList").html(divHtml);
            $("#spcost_money").html(sku_price_total);
            $("#p_sub_money").hide();
            $("#spsub_money").html("0");
            $("#spsent_money").html("0");
            $("#spcoupons").html("0");
            var tmpl = $("#tpl_order")[0].innerHTML;
            var data = {
                "sppay_money": sku_price_total
            };
            html = renderTemplate(tmpl, data);
            $("body").append(html);
            Address_Default.ShowAddressDiv(0);
            $("#divdisRemarks").html("<span>注：</span>新疆、西藏地区每单收24元运费");
        }
    },
}
function SetGoodUnLogin() {
    if (localStorage.getItem(g_const_localStorage.GoodsInfo)) {
        var goodsInfo = JSON.parse(localStorage.getItem(g_const_localStorage.GoodsInfo));
        var sku_price_unit = 0.00;
        var sku_price_total = 0.00;
        var divHtml = "";
        $.each(goodsInfo, function (i, n) {
            divHtml += "<div class=\"sbox spro\">";
            divHtml += "    <img src=\"" + n.pic_url + "\" alt=\"\" />";
            //divHtml += "    <img class=\"d_add_ys\" src=\"../../img/d_hwg_tb.png\" alt=\"\" />";
            divHtml += "    <div class=\"imgr\">";
            divHtml += "        <p class=\"pt\">" + n.sku_name + "</p>";
            $.each(n.sku_property, function (j, m) {
                if (m.length > 0) {
                    divHtml += "        <p>" + m.propertyKey + "：" + m.propertyValue + "</p>";
                }

            });
            divHtml += "    </div>";
            divHtml += "    <div class=\"imgrr\">";
            divHtml += "        <p class=\"price\"><b>￥</b>" + n.sku_price + "</p>";
            divHtml += "        <p class=\"pnum\">x" + n.sku_num + "</p>";
            $.each(n.activitys, function (j, m) {
                divHtml += "        <p class=\"ptag\"><span class=\"tag\">" + m.activity_name + "</span></p>";
            });

            divHtml += "    </div>";
            divHtml += "</div>";
            sku_price_unit += n.sku_price;
            sku_price_total += n.sku_price * n.sku_num;
            if (n.sku_code.indexOf("IC_SMG_") > -1) {
                _issmg = 1;
            }
        });

        $("#divGoodsList").html(divHtml);
        $("#spcost_money").html(sku_price_total);
        $("#p_sub_money").hide();
        $("#spsub_money").html("0");
        $("#spsent_money").html("0");
        $("#spcoupons").html("0");
        var tmpl = $("#tpl_order")[0].innerHTML;
        var data = {
            "sppay_money": sku_price_total
        };
        html = renderTemplate(tmpl, data);
        $("body").append(html);
        Address_Default.ShowAddressDiv(0);
        $("#divdisRemarks").html("<span>注：</span>新疆、西藏地区每单收24元运费");
        // localStorage[g_const_localStorage.GoodsInfo] = "";
    }

}

var Address_Update = {
    api_input: { "id": "", "mobile": "", "areaCode": "", "street": "", "name": "", "provinces": "", "isdefault": "", "idNumber": "" },
    EditInfo: function () {
        var s_api_input = JSON.stringify(Address_Update.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": Address_Update.api_target };
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=addressedit&api_input=" + s_api_input + "&validcode=",
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode != g_const_Success_Code) {
                    if (msg.resultcode == "916421182") {
                        Message.ShowAlert("您的身份证曾被海关退回", "为确保下单成功，请核对身份证！", "divAlert", "确定");
                    }
                    else {
                        ShowMesaage(msg.resultmessage);
                        Message.Operate('', "divAlert");
                    }
                    return;
                }
                else {
                    _needVerifyIdNumber = 0;
                    ShowMesaage("身份证提交成功");
                    Address_Info.GetByID(Address_Update.api_input.id);
                    Message.Operate('', "divAlert");
                }
            }
            //if (msg.resultcode) {
            //    if (msg.resultcode == g_const_Success_Code) {
            //        OrderDetail.OrderConfirm();
            //    }
            //    else {
            //        ShowMesaage(msg.resultmessage);
            //    }
            //}

            //  Message.Operate('', "divAlert");
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
            Message.Operate('', "divAlert");
        });
    },
};
//获取验证码
var Address_Default = {

    GetObj: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=addressdefault",
            dataType: "json"
        });

        request.done(function (msg) {
            if (msg.resultcode == g_const_Success_Code_IN) {
                if (msg.areaCode.length > 0) {
                    Address_Default.SetAddressInfo(msg);
                    Address_Default.ShowAddressDiv(1);
                }
                else {
                    Address_Default.ShowAddressDiv(0);
                }
            }
            else {
                Address_Default.ShowAddressDiv(0);
            }

            OrderDetail.OrderConfirm();
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    ShowAddressDiv: function (loginstatus) {
        if (loginstatus == 1) {
            $("#divAddressLogin").show();
            $("#divPaytype").show();
        }
        else {
            $("#divAddressUnLogin").show();
        }
    },
    SetAddressInfo: function (result) {
        $("#spaddressuser").html(result.name);
        $("#spaddressphone").html(result.mobile);
        $("#spaddressdetail").html(result.provinces + result.street);
        $("#spidnumber").html((result.idNumber.substr(0, 4) + (result.idNumber.length > 0 ? "**********" : "") + result.idNumber.substr(14)));
        _addressid = result.id;
        _area_code = result.areaCode;
        _addressStreet = result.street;

        Address_Update.api_input.id = result.id;
        Address_Update.api_input.mobile = result.mobile;
        Address_Update.api_input.areaCode = result.areaCode;
        Address_Update.api_input.street = result.street;
        Address_Update.api_input.name = result.name;
        Address_Update.api_input.provinces = result.provinces;
        Address_Update.api_input.idNumber = result.idNumber;
        Address_Update.api_input.isdefault = result.isdefault;
    },
};

var Address_Info = {
    GetByID: function (addressid) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getaddressbyid&addressid=" + addressid,
            dataType: "json"
        });

        request.done(function (msg) {
            if (msg.resultcode == g_const_Error_Code.NoAddress) {
                //按addressid没有找到收货地址，显示
                //Address_Default.ShowAddressDiv(0);
                Address_Default.GetObj();
                $("#divLogin").hide();
            }
            else if (msg.resultcode == g_const_Success_Code_IN) {
                if (msg.areaCode.length > 0) {
                    Address_Default.SetAddressInfo(msg);
                    Address_Default.ShowAddressDiv(1);
                    OrderDetail.OrderConfirm();
                }
                else {
                    // Address_Default.ShowAddressDiv(0);
                    Address_Default.GetObj();
                }
            }
            else {
                //Address_Default.ShowAddressDiv(0);
                Address_Default.GetObj();
            }
            //   OrderDetail.OrderConfirm();
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
}

var OrderDetail = {
    api_target: "com_cmall_familyhas_api_APiOrderConfirm",
    api_input: { "area_code": "", "coupon_codes": "", "goods": [], "buyer_code": "", "order_type": "", "channelId": "" },
    OrderConfirm: function () {
        //    Message.ShowLoading("订单努力确认中", "divAlert");
        OrderDetail.api_input.area_code = _area_code;
        OrderDetail.api_input.coupon_codes = _coupon_codes;
        OrderDetail.api_input.goods = _goods;
        OrderDetail.api_input.order_type = _order_type;
        OrderDetail.api_input.channelId = g_const_ChannelID;
        var s_api_input = JSON.stringify(OrderDetail.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": OrderDetail.api_target, "api_token": "1" };
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
                if (msg.resultcode != g_const_Success_Code) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }
            if (msg.resultCode) {
                if (msg.resultCode == g_const_Success_Code) {
                    OrderDetail.LoadOrderInfo(msg)
                }
                else {
                    //backurl = PageUrlConfig.BackTo();
                    //Message.ShowToPage(msg.resultMessage, backurl, 4000, "");
                    ////ShowMesaage(msg.resultMessage);
                    //Message.Operate('', "divAlert");

                    Message.ShowAlert("", msg.resultMessage, "divAlert", "确定", OrderDetail.BackGoTo);
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
            Message.Operate('', "divAlert");
        });
    },
    /*接口失败跳转*/
    BackGoTo:function(){
        backurl = PageUrlConfig.BackTo();
        window.location.replace(backurl);
    },
    //显示订单内容
    LoadOrderInfo: function (msg) {
        //温馨提示
        $("#div_notice").html("");
        $("#div_notice").hide();
        

        var noticeStr = "";
        $.each(msg.tips, function (j, m) {
            noticeStr += "<p>" + m + "</p>";
        });
        if (noticeStr != "") {
            //var noticeStr = "<p>" + msg.tips + "</p>";
            $("#div_notice").html(noticeStr);
            $("#div_notice").show();
            //按订单号保存提示信息，
            localStorage["tips"] = noticeStr;
        }


        Message.Operate('', "divAlert");
        OrderDetail.LoadVerifyIdNumber(msg);
        OrderDetail.LoadGoodsList(msg.resultGoodsInfo, msg.orders)
        OrderDetail.LoadOrderType(msg.resultGoodsInfo);
        OrderDetail.LoadMoney(msg);
        OrderDetail.LoadPayType(msg);
        OrderDetail.LoadFaPiao();
        OrderDetail.LoadCouponCodes(msg);
        //CouponCodes.GetCouponCodes();
        //  Message.Operate('', "divAlert");
    },

    LoadVerifyIdNumber: function (list) {

        if (list.isVerifyIdNumber == "1") {
            if (Address_Update.api_input.idNumber == "") {
                Message.ShowAlert(g_const_API_Message[106001], "", "divAlert", "确定", "SetIdNumFocus");
                $("#div_noidnum").show();
                $("#div_idnum").hide();
                _needVerifyIdNumber = 1;
            }
            else {
                UserIdentity.Type = 1;
                UserIdentity.Check(Address_Update.api_input.idNumber);
                $("#div_idnum").show();
                $("#div_noidnum").hide();
                _needVerifyIdNumber = 0;
            }
        }
    },
    LoadOrderType: function (list) {
        _order_souce = g_order_Souce.Weixin;
        _order_type = g_order_Type.Common;
        if (list) {
            if (list[0].sku_code.indexOf("IC_SMG_") > -1) {
                _order_souce = g_order_Souce.QRCode;
                _order_type = g_order_Type.QRCode;
            }
            else {
                $.each(list[0].activitys, function (j, m) {
                    if (m.activity_name == "闪购") {
                        _order_type = g_order_Type.Quick;
                    }
                    else if (m.activity_name == "内购") {
                        _order_type = g_order_Type.Inner;
                    }
                });
            }
        }
    },
    //显示商品列表
    LoadGoodsList: function (list, order) {
        var divHtml = "";
        var ordernum = 0;
        var pricemsg = "";

        //推送多麦CPS订单时需要的商品参数清空--开始
        duomai_goods_id = "";//商品编号
        duomai_goods_name = "";//商品名称
        duomai_goods_price = "";//商品单价
        duomai_goods_ta = "";//商品数量
        duomai_goods_cate = "";//商品分类编号
        duomai_totalPrice = "";//商品总净金额，商品总价减去此件商品使用的优惠券/现金券等其他非实付金额
        duomai_SumPrice = 0;//商品应付总金额
        //结束

        $.each(order, function (k, o) {

            ordernum = 0;


            $.each(list, function (i, n) {

                if (o.skuCodes.indexOf(n.sku_code) > -1 || list.length == 1) {
                    //存储推送多麦CPS订单时需要的商品参数--开始
                    //商品编号
                    if(duomai_goods_id==""){
                        duomai_goods_id=n.product_code
                    }
                    else{
                        duomai_goods_id+="|"+n.product_code
                    }

                    //商品名称
                    if(duomai_goods_name==""){
                        duomai_goods_name=n.sku_name
                    }
                    else{
                        duomai_goods_name+="|"+n.sku_name
                    }

                    //商品单价
                    if(duomai_goods_price==""){
                        duomai_goods_price=n.sku_price
                    }
                    else{
                        duomai_goods_price+="|"+n.sku_price
                    }

                    //商品数量
                    if(duomai_goods_ta==""){
                        duomai_goods_ta=n.sku_num
                    }
                    else{
                        duomai_goods_ta+="|"+n.sku_num
                    }

                    //商品分类编号
                    if(duomai_goods_cate==""){
                        duomai_goods_cate=n.sku_code
                    }
                    else{
                        duomai_goods_cate+="|"+n.sku_code
                    }

                    //商品总净金额
                    if(duomai_totalPrice==""){
                        duomai_totalPrice=(parseFloat(n.sku_price)*parseFloat(n.sku_num)).toFixed(2);
                    }
                    else{
                        duomai_totalPrice+="|"+(parseFloat(n.sku_price)*parseFloat(n.sku_num)).toFixed(2);
                    }

                    //全部商品应付金额
                    duomai_SumPrice = parseFloat(duomai_SumPrice) + parseFloat(n.sku_price) * parseFloat(n.sku_num);

                    //结束

                    productCodeList += '||' + n.sku_code;
                    productNameList += '||' + n.sku_name;
                    productPriceList += '||' + n.sku_price;
                    productNumberList += '||' + n.sku_num;
                    ordernum++;
                    divHtml += "<div style=\"margin: 0;border: none;\" class=\"sbox spro\">";
                    //原有本地图片，3.9.4后注销
                    //if (n.labelsList.length >= 1) {
                    //    var label = g_const_ProductLabel.find(n.labelsList[0]);
                    //    if (label) {
                    //        divHtml += '<img class="d_add_ys" src="' + label.spicture + '" alt="" />';
                    //    }
                    //}
                    //3.9.4 从接口获取图片
                    if (n.labelsPic != "" && !(n.labelsPic == undefined)) {
                        divHtml += '<img class="d_add_ys" src="' + n.labelsPic + '" alt="" />';
                    }


                    divHtml += "    <img src=\"" + n.pic_url + "\" alt=\"\" />";

                    divHtml += "    <div class=\"imgr\">";
                    divHtml += "        <p class=\"pt\">" + n.sku_name + "</p>";
                    if (n.alert != "") {
                        divHtml += "<font>" + n.alert + "</font>";
                    }
                    else {
                        $.each(n.sku_property, function (j, m) {
                            divHtml += "        <p>" + m.propertyKey + "：" + m.propertyValue + "</p>";
                        });
                    }

                    divHtml += "    </div>";
                    divHtml += "    <div class=\"imgrr\">";
                    divHtml += "        <p class=\"price\"><b>￥</b>" + n.sku_price + "</p>";
                    divHtml += "        <p class=\"pnum\">x" + n.sku_num + "</p>";
                    if (n.sales_type) {
                        if (n.sales_type == "满减") {
                            divHtml += "        <p class=\"ptag\"><span class=\"tag\">" + n.sales_type + "</span></p>";
                        }
                        else {
                            divHtml += "        <p class=\"ptag\"><span class=\"tag\">" + n.sales_type + "</span></p>";
                        }
                    }
                    $.each(n.otherShow, function (j, m) {
                        if (m != "赠品" && m != "满减") {
                            divHtml += "        <p class=\"ptag\"><span class=\"tag\">" + m + "</span></p>";
                        }

                    });
                    //divHtml += "        <p class=\"ptag\"><span class=\"tag1\">满减</span></p>";
                    //$.each(n.activitys, function (j, m) {
                    //    if (m.activity_name.indexOf("扫码") > -1) {
                    //        divHtml += "        <p class=\"ptag\"><span class=\"tag\">" + m.activity_name + "</span></p>";
                    //    }
                    //});
                    divHtml += "    </div>";



                    if (_goodsprice) {
                        $.each(_goodsprice, function (j, m) {
                            if (n.sku_code == m.sku_code && n.product_code == m.product_code && n.sku_price != m.sku_price) {
                                pricemsg += "商品" + n.sku_name + "的价格变为" + n.sku_price + "<br>";
                                return false;
                            }
                        });
                    }

                }
                divHtml += "</div>";
            });

            //多麦全部商品总价
            duomai_SumPrice = parseFloat(duomai_SumPrice).toFixed(2);



            if (o.tranMoney > 0) {
                divHtml += "<div class='shipment'>运费：" + o.tranMoney + "</div>";
            }
            else {
                if (order.length > 1) {
                    divHtml += "<div class='shipment'>运费：免邮</div>";
                }
            }

        });

        if (pricemsg.length > 0) {
            //   ShowMesaage(pricemsg);
            Message.ShowConfirm(pricemsg, "", "divAlertPrice", "取消订单", "CancelOrder", "继续购买");
        }
        localStorage[g_const_localStorage.OrderPrice] = "";
        $("#divGoodsList").html(divHtml);
    },
    //显示金额
    LoadMoney: function (moneymsg) {
        //多麦--记录满减金额
        duomai_manjianPrice = moneymsg.sub_money;
        //完

        $("#spcost_money").html(moneymsg.cost_money);
        $("#spsub_money").html(moneymsg.sub_money);
        if (moneymsg.sub_money > 0) {
            $("#p_sub_money").show();
        }
        else {
            $("#p_sub_money").hide();
        }
        //if (moneymsg.coupons.length > 0) {
        //    if (moneymsg.coupons[0].surplusMoney <= (moneymsg.cost_money - moneymsg.sub_money)) {
        //        $("#spcoupons").html(moneymsg.coupons[0].surplusMoney);
        //    }
        //    else {
        //        $("#spcoupons").html((moneymsg.cost_money - moneymsg.sub_money));
        //    }

        //    $("#p_coupons").show();
        //}
        //else {
            $("#p_coupons").hide();
        //}
        $("#spsent_money").html(moneymsg.sent_money);
        _pay_money = moneymsg.pay_money;
        _cash_money = moneymsg.cash_back

        if (moneymsg.disList) {

        }
        var monhtml = "";
        $.each(moneymsg.disList, function (j, m) {
            monhtml += "<p><span>" + (m.dis_type == "1" ? "+" : "-") + "  ￥<span>" + m.dis_price + "</span></span>" + m.dis_name + "：</p>"
            
        });
        $("#p_moneyinfo").html(monhtml);
        $("#divdisRemarks").html("<span>注：</span>" + moneymsg.disRemarks);

        var tmpl = $("#tpl_order")[0].innerHTML;
        var data = {
            "sppay_money": moneymsg.pay_money.toString()
        };
        html = renderTemplate(tmpl, data);
        $("body").append(html);
    },



    //显示支付类型
    LoadPayType: function (paymsg) {

        //获得缓存的支付方式
        var selpayType = "";
        if (localStorage["selpaytype"] != null && localStorage["selpaytype"] != "") {
            selpayType = localStorage["selpaytype"];

            $("#btnAlipay").attr("class", "sela");
            $("#btnGetpay").attr("class", "sela");
            $("#btnWeixin").attr("class", "sela");
            $("#btnAlipay").hide();
            $("#btnGetpay").hide();
            $("#btnWeixin").hide();



            if (paymsg.pay_type.indexOf(g_pay_Type.Online) > -1) {
                if (IsInWeiXin.check()) {
                    switch (selpayType) {
                        case "divweixin":
                            $("#divweixin").show();
                            $("#btnWeixin").attr("class", "sela on");
                            $("#btnWeixin").show();
                            _pay_type = g_pay_Type.WXpay;

                            break;
                    }
                }
                else {
                    switch (selpayType) {
                        case "divalipay":
                            $("#divalipay").show();
                            $("#btnAlipay").attr("class", "sela on");
                            $("#btnAlipay").show();
                            _pay_type = g_pay_Type.Alipay;
                            break;
                    }
                }

            }
            if (paymsg.pay_type.indexOf(g_pay_Type.Getpay) > -1) {
                if (IsInWeiXin.check()) {
                    $("#divweixin").show();
                    $("#btnWeixin").attr("class", "sela");
                    $("#btnWeixin").show();
                }
                else {
                    $("#divalipay").show();
                    $("#btnAlipay").attr("class", "sela");
                    $("#btnAlipay").show();
                }

                switch (selpayType) {
                    case "divgetpay":
                        _pay_type = g_pay_Type.Getpay;
                        $("#btnGetpay").attr("class", "sela on");
                        $("#btnGetpay").show();
                        break;
                }
                $("#divgetpay").show();
                $("#btnGetpay").show();

            }


        }
        else {
            if (paymsg.pay_type.indexOf(g_pay_Type.Online) > -1) {
                if (IsInWeiXin.check()) {
                    $("#divweixin").show();
                    _pay_type = g_pay_Type.WXpay;
                    $("#btnWeixin").attr("class", "sela on");
                }
                else {
                    $("#divalipay").show();
                    // $("#divweixin").show();
                    _pay_type = g_pay_Type.Alipay;
                    $("#btnAlipay").attr("class", "sela on");
                }

            }
            if (paymsg.pay_type.indexOf(g_pay_Type.Getpay) > -1) {
                if (IsInWeiXin.check()) {
                    $("#divweixin").show();
                    _pay_type = g_pay_Type.WXpay;
                    $("#btnWeixin").attr("class", "sela on");
                }
                else {
                    $("#divalipay").show();
                    //   $("#divweixin").show();
                    _pay_type = g_pay_Type.Alipay;
                    $("#btnAlipay").attr("class", "sela on");
                }
                $("#divgetpay").show();
            }
        }

        _fapiaonr = paymsg.bills;
        _fapiaobillRemark = paymsg.billRemark;
    },
    LoadFaPiao: function () {
        if (_fapiao != null) {
            switch (_fapiao.bill_Type) {
                case g_const_bill_Type.NotNeed:
                    $("#divfapiao").html("<span class=\"fr bky\">不开发票</span>");
                    break;
                default:
                    if (_fapiao.bill_detail == "null") {
                        _fapiao.bill_detail = "明细";
                    }
                    $("#divfapiao").html("<span class=\"kfp\">" + _fapiao.bill_title + "<em>" + _fapiao.bill_detail + "</em></span>");
                    break;

            }
        }
        else {
            $("#divfapiao").html("<span class=\"fr bky\">不开发票</span>");
        }
    },
    LoadCouponCodes: function (msg) {
        if (msg.coupons.length == 0) {
            if (msg.couponAbleNum == 0) {
                $("#divyhqnum").html("<span class=\"fr bky\">无可用</span>");
                $("#divyhq").attr("class", "sub order-couponno-");
            }
            else {
                $("#divyhqnum").html("<span class=\"qnum\">" + msg.couponAbleNum + "张可用</span>");
                $("#divyhq").attr("class", "sub");
            }
        }
        else {
            $("#divyhqnum").html("<span class=\"qnum\">已抵" + msg.coupons[0].surplusMoney + "元</span>");
            $("#divyhq").attr("class", "sub");
        }
    },
};



var ispay = 0;
var OrderCreate = {
    api_target: "com_cmall_familyhas_api_APiCreateOrder",
    api_input: { "check_pay_money": "", "buyer_address_id": "", "buyer_address_code": "", "goods": [], "buyer_mobile": "", "pay_type": "", "buyer_address": "", "billInfo": [], "app_vision": "1.0.0", "buyer_name": "", "order_type": "", "coupon_codes": "", "order_souce": "", "channelId": "", "os": "", "yygMac": "" },
    CreateToJYH: function () {
        //  alert(localStorage[g_const_localStorage.OrderFrom]);
        Message.ShowLoading("订单努力提交中", "divAlert");
        if ($("#spaddressdetail").html().length == 0) {
            ShowMesaage(g_const_API_Message["100030"]);
            Message.Operate('', "divAlert");
            return;
        }
        //if (_needVerifyIdNumber == 1) {
        //    Message.ShowAlert(g_const_API_Message[106001], "", "divAlert", "确定", "SetIdNumFocus");
        // //   Message.Operate('', "divAlert");
        //    return;
        //}
        if (_pay_type.length == 0) {
            ShowMesaage(g_const_API_Message["100031"]);
            Message.Operate('', "divAlert");
            return;
        }
        OrderCreate.api_input.check_pay_money = _pay_money;
        OrderCreate.api_input.buyer_address_id = _addressid;
        OrderCreate.api_input.buyer_address_code = _area_code;
        OrderCreate.api_input.goods = _goods;
        OrderCreate.api_input.buyer_mobile = $("#spaddressphone").html();
        OrderCreate.api_input.pay_type = _pay_type;
        OrderCreate.api_input.buyer_address = _addressStreet;
        OrderCreate.api_input.billInfo = _fapiao;
        OrderCreate.api_input.buyer_name = $("#spaddressuser").html();
        OrderCreate.api_input.order_type = _order_type;
        OrderCreate.api_input.coupon_codes = _coupon_codes;
        OrderCreate.api_input.order_souce = _order_souce;
        OrderCreate.api_input.channelId = g_const_ChannelID;
        OrderCreate.api_input.app_vision = "1.0.0";
        OrderCreate.api_input.os = "";
       // OrderCreate.api_input.yygMac = $.md5(_order_souce + _order_type + "hjyyygsynckey");
        if (of_status == "1") {
            if (localStorage[g_const_localStorage.OrderFrom] != null && localStorage[g_const_localStorage.OrderFrom] != "") {
                if (_order_type == g_order_Type.QRCode) {
                    OrderCreate.api_input.app_vision = "hjy_smg"
                }
                else {
                    OrderCreate.api_input.app_vision = localStorage[g_const_localStorage.OrderFrom];
                }
            }
            if (localStorage[g_const_localStorage.OrderFromParam] != null && localStorage[g_const_localStorage.OrderFromParam] != "") {
                if (_order_type == g_order_Type.QRCode) {
                    OrderCreate.api_input.os = "hjy_smg";
                }
                else {
                    OrderCreate.api_input.os = localStorage[g_const_localStorage.OrderFromParam];
                }
            }
        }


        var s_api_input = JSON.stringify(OrderCreate.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": OrderCreate.api_target, "api_token": "1" };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });
        
        request.done(function (msg) {
            try {
                msg = JSON.parse(msg);
            }
            catch (e) { }
            if (msg.resultcode) {
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    Message.Operate('', "divAlert");
                    return;
                }
            }
            if (msg.resultCode) {
                if (msg.resultCode == g_const_Success_Code) {

                    
                        OrderCreate.Record_From(msg);


                    /*以下代码转移到OrderCreate.Record_From中
                    //清除缓存支付方式
                    localStorage["selpaytype"] = "";
                    localStorage[g_const_localStorage.OrderConfirm] = "";
                    localStorage[g_const_localStorage.CouponCodes] = "";
                    localStorage[g_const_localStorage.OrderAddress] = null;
                    var del_list = [];

                    $.each(_goods, function (j, m) {
                        del_list.push([m.product_code, m.sku_code]);
                        g_type_cart.Remove(m.product_code, m.sku_code);
                        g_type_cart.Upload();
                    });
                    g_type_cart.BatchRemoveWithCloud(del_list);
                    OrderCreate.ToPay(msg);
                    // setTimeout(function () { OrderCreate.ToPay(msg); }, 1000);
                    */
                }
                else {
                    ShowMesaage(msg.resultMessage);
                    Message.Operate('', "divAlert");
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["100029"]);
            Message.Operate('', "divAlert");
        });
    },
    
    Record_From: function (paymsg) {
        if (_order_type == g_order_Type.QRCode) {
            OrderCreate.GoToPay(paymsg.order_code);
            return;
        }
        var OrderFrom_1 = localStorage[g_const_localStorage.OrderFrom];

        if (localStorage[g_const_localStorage.OrderFrom] != null) {
            if (localStorage[g_const_localStorage.OrderFrom] != "") {
                $.ajax({
                    type: "POST",//用POST方式传输
                    dataType: "json",//数据格式:JSON
                    url: '/Ajax/API.aspx',//目标地址
                    data: "t=" + Math.random() +
                            "&action=merchant_order" +
                            "&merchantcode=" + escape(localStorage[g_const_localStorage.OrderFrom]) +
                            "&paramlist=" + escape(localStorage[g_const_localStorage.OrderFromParam].replace(/&/g, "@").replace(/=/g, "^")) +
                            "&orderno=" + escape(paymsg.order_code),
                    beforeSend: function () { },//发送数据之前
                    complete: function () { },//接收数据完毕
                    success: function (data) {
                    }
                });
            }
        }

        //爱德
        if (OrderFrom_1 == Merchant1.Code) {
            try {
                productCodeList = productCodeList.substring(2);
                productNameList = productNameList.substring(2);
                productPriceList = productPriceList.substring(2);
                productNumberList = productNumberList.substring(2);
                //处理爱德数据
                Merchant1.productid = productCodeList.split('||')[0];
                Merchant1.productname = productNameList.split('||')[0];
                Merchant1.productprice = productPriceList.split('||')[0];
                Merchant1.orderid = paymsg.order_code;
                Merchant1.orderprice = _pay_money;//paymsg.order_money;
                Merchant1.RecordValid(Merchant1.RecordOrder);
            }
            catch (e) {
                OrderCreate.GoToPay(paymsg.order_code);

            }
        }
            //处理领克特
        else if (OrderFrom_1 == Merchant_LKT.Code) {
            try {
                //处理领克特
                Merchant_LKT.order_code = paymsg.order_code;
                //$.each(paymsg.orderSellerList, function (i, n) {
                //    Merchant_LKT.product_code += '||' + n.productCode;
                //    Merchant_LKT.product_price += '||' + n.price;
                //    Merchant_LKT.product_count += '||' + n.number;
                //    Merchant_LKT.product_cd += '||' + n.productCode;
                //})
                Merchant_LKT.product_code = productCodeList;
                Merchant_LKT.product_price = productPriceList;
                Merchant_LKT.product_count = productNumberList;
                Merchant_LKT.product_cd = productCodeList;
                Merchant_LKT.order_code = paymsg.order_code;
                Merchant_LKT.RecordOrder();
            }
            catch (e) {
                OrderCreate.GoToPay(paymsg.order_code);

            }
        }
            //多麦--订单推送
        else if (localStorage[g_const_localStorage.OrderFrom] == Merchant_duomai.Code && localStorage[g_const_localStorage.OrderFromRefer] != "") {
            try {
                //多麦--订单推送
                Merchant_duomai.order_sn = paymsg.order_code;//订单编号
                Merchant_duomai.order_time = Merchant1.GetNowTime();//用户下单时间
                if (parseFloat(duomai_manjianPrice) > 0) {
                    //对于满减的订单，此参数值为满减的金额；如若没有满减，则传0
                    Merchant_duomai.discount_amount = duomai_manjianPrice;//优惠金额=应付总金额-实际支付金额
                    Merchant_duomai.orders_price = (parseFloat(duomai_manjianPrice) + parseFloat(_pay_money)).toFixed(2);//订单金额包含满减金额
                }
                else {
                    Merchant_duomai.discount_amount = "0";
                    Merchant_duomai.orders_price = _pay_money;//订单金额包含满减金额

                }
                Merchant_duomai.order_status = "0";//订单状态,目前-1表示无效，0表示未支付状态，其它直接给出状态描述，或者使用1、2、3这样的正整数

                //一个订单，多个商品时，每个商品属性都用“|”分隔多个，
                Merchant_duomai.goods_id = duomai_goods_id;//商品编号
                Merchant_duomai.goods_name = duomai_goods_name;//商品名称
                Merchant_duomai.goods_price = duomai_goods_price;//商品单价
                Merchant_duomai.goods_ta = duomai_goods_ta;//商品数量
                Merchant_duomai.goods_cate = duomai_goods_cate;//商品分类编号
                Merchant_duomai.totalPrice = duomai_totalPrice;//商品总净金额，商品总价减去此件商品使用的优惠券/现金券等其他非实付金额
                Merchant_duomai.RecordOrder();
            }
            catch (e) {
                OrderCreate.GoToPay(paymsg.order_code);
            }

        }
        else {
            //一般订单
            OrderCreate.GoToPay(paymsg.order_code);
        }
    },
    GoToPay: function (order_code) {
        //跳转支付页面
        //清除缓存支付方式
        localStorage["selpaytype"] = "";
        localStorage[g_const_localStorage.OrderConfirm] = "";
        localStorage[g_const_localStorage.CouponCodes] = "";
        localStorage[g_const_localStorage.OrderAddress] = null;
        var del_list = [];

        $.each(_goods, function (j, m) {
            del_list.push([m.product_code, m.sku_code]);
            g_type_cart.Remove(m.product_code, m.sku_code);
            g_type_cart.Upload();
        });
        g_type_cart.BatchRemoveWithCloud(del_list);

        OrderCreate.ToPay(order_code);

    },
    //显示支付类型
    //ToPay: function (paymsg) {
    ToPay: function (order_code) {
        localStorage[g_const_localStorage.FaPiao] = "";
        _orderid = order_code;
        if (_pay_money == 0 || _pay_type == g_pay_Type.Getpay) {
            window.location.replace("/Order/OrderSuccess.html?paytype=getpay&orderid=" + _orderid + "&t=" + Math.random());
        }
        else {
            var openidStr = "";
            if (_pay_type == g_pay_Type.WXpay) {
                openidStr = "?openID=" + $("#hid_uid").val();
            }
			alert(g_HJYWebPay_url + order_code + "/" + _pay_type + openidStr);
            window.location.replace(g_HJYWebPay_url + order_code + "/" + _pay_type + openidStr);
        }
        //switch (_pay_type) {
        //    case g_pay_Type.Alipay:
        //        //396 支付修改 开始
        //        if ($("#hid_wxpaytype").val() == "3") {
        //            //原有本地支付
        //            if (_pay_money > 0) {
        //                window.location.replace(g_Alipay_url + _orderid + "/4497153900010001");
        //            }
        //            else {
        //                window.location.replace("/Order/OrderSuccess.html?paytype=alipay&orderid=" + _orderid + "&t=" + Math.random());
        //            }
        //        }
        //        else if ($("#hid_wxpaytype").val() == "2") {
        //            //提交网关处理，跳转至网关微信支付页面
        //            //OrderCreate.GoPayGatePay(order_code);
        //            //调用惠家有webpay接口
        //            OrderCreate.HJYWebPay(_orderid, g_pay_Type.Alipay);
        //        }
        //        break;
        //    case g_pay_Type.Getpay:
        //        window.location.replace("/Order/OrderSuccess.html?paytype=getpay&orderid=" + _orderid + "&t=" + Math.random());
        //        break;
        //    case g_pay_Type.WXpay:
        //        if (_pay_money > 0) {
        //            //396 微信支付修改 开始
        //            if (IsInWeiXin.check()) {
        //                if ($("#hid_wxpaytype").val() == "3") {
        //                    //不提交网关，本地处理
        //                    OrderCreate.WxPay(_pay_money);
        //                }
        //                else if ($("#hid_wxpaytype").val() == "2") {
        //                    //提交网关处理，跳转至网关微信支付页面
        //                    //OrderCreate.GoPayGatePay(order_code);
        //                    //调用惠家有webpay接口
        //                    OrderCreate.HJYWebPay(_orderid, g_pay_Type.Alipay);
        //                }
        //            }
        //            //396 微信支付修改  结束
        //            //原有代码
        //            //OrderCreate.WxPay(_pay_money);
        //        }
        //        else {
        //            window.location.replace("/Order/OrderSuccess.html?paytype=wxpay&orderid=" + _orderid + "&t=" + Math.random());
        //        }
        //        break;
        //}
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
            // alert(JSON.stringify(_wxJsApiParam));
            Message.Operate('', "divAlert");
            // alert(1111);
            callpay();
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    /*396 跳转网关支付*/
    //GoPayGatePay: function (orderNo) {
    //    var purl = g_INAPIUTL;
    //    var request = $.ajax({
    //        url: purl,
    //        cache: false,
    //        method: g_APIMethod,
    //        data: "t=" + Math.random() + "&action=gopaygatepayment&OrderNo=" + orderNo,
    //        dataType: g_APIResponseDataType
    //    });
    //    request.done(function (msg) {
    //        if (msg.resultcode == "0") {
    //            if (IsInWeiXin.check()) {
    //                if ($("#hid_wxpaytype").val() == "1") {
    //                    ////本地jsapi处理
    //                    //_wxJsApiParam = JSON.parse(msg.resultmessage).jsapiparam;
    //                    //Message.Operate('', "divAlert");
    //                    //callpay();
    //                    ShowMesaage("不支持此支付方式");
    //                }
    //                else if ($("#hid_wxpaytype").val() == "2") {
    //                    //跳转网关处理
    //                    window.location.replace(msg.resultmessage);
    //                }
    //            }
    //            else{
    //                //跳转网关处理
    //                window.location.replace(msg.resultmessage);
    //            }
    //        } else {
    //            ShowMesaage(msg.resultmessage);
    //        }
    //    });
    //    request.fail(function (jqXHR, textStatus) {
    //        ShowMesaage(g_const_API_Message["7001"]);
    //    });
    //},
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



var CouponCodes = {
    /*可用优惠劵使用查询*/
    api_target: "com_cmall_familyhas_api_ApiGetAvailableCoupon",
    /*输入参数*/
    api_input: { "shouldPay": 0, "goods": [], "skuCodeEntitylist": [], "version": 1.0, "channelId": "" },
    /*接口响应对象*/
    api_response: {},
    /*获取可用优惠劵*/
    GetCouponCodes: function () {
        $("#divyhqnum").html("<span class=\"fr bky\">仅限APP购物商城使用</span>");
        $("#divyhq").attr("class", "sub order-couponno-");
        return;
        CouponCodes.api_input.goods = _goods;
        CouponCodes.api_input.shouldPay = _pay_money;
        CouponCodes.api_input.channelId = g_const_ChannelID;
        var s_api_input = JSON.stringify(CouponCodes.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": CouponCodes.api_target, "api_token": g_const_api_token.Wanted };
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
                if (msg.couponCount == 0 && msg.disableCouponCount == 0) {
                    $("#divyhqnum").html("<span class=\"fr bky\">无可用优惠券</span>");
                    $("#divyhq").attr("class", "sub order-couponno-");
                }
                else {
                    $("#divyhqnum").html("<span class=\"qnum\">" + msg.couponCount + "张可用</span>");
                    $("#divyhq").attr("class", "sub");
                }
            }
            else {

                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};

var ApiPayment = {
    GetInfo: function (order_code, paytype) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=topayment&order_code=" + order_code + "&paytype=" + paytype,
            dataType: "json"
        });

        request.done(function (msg) {
            if (msg.resultcode == g_const_Success_Code_IN) {

            }
            else {

            }

        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};

var IDNumber = {
    ChangeIDnumber: function () {
        $("#txtIDNum").val(Address_Update.api_input.idNumber);
        $("#txtIDNum").focus();
        $("#div_idnum").hide();
        $("#div_noidnum").show();
    },
    ClearIDnumber: function () {
        $("#txtIDNum").val("");
    },
    EditIDnumber: function () {
        if ($("#txtIDNum").val().length == 0) {
            ShowMesaage(g_const_API_Message["106003"]);
            return;
        }
        Address_Update.api_input.idNumber = $("#txtIDNum").val();
        UserIdentity.Type = 2;
        UserIdentity.Check(Address_Update.api_input.idNumber);
    },
};


function jsApiCall() {
    WeixinJSBridge.invoke(
    'getBrandWCPayRequest',
     _wxJsApiParam,//josn串
     function (res) {
         //WeixinJSBridge.log(res.err_msg);
         //  alert(res.err_msg);
         if (res.err_msg == "get_brand_wcpay_request:ok") {
             window.location.replace("/Order/OrderSuccess.html?&paytype=wxpay&orderid=" + _orderid + "&t=" + Math.random());
         }
             //else if (res.err_msg == "get_brand_wcpay_request:cancel") {
             //    //  ShowMesaage(g_const_API_Message["100028"]);
             //  //  window.location.href = g_const_PageURL.MyOrder_List + "?paytype=DFK" + "&t=" + Math.random();
             //    window.location.replace("/Order/OrderFail.html?&paytype=wxpay&orderid=" + _orderid);
             //}
             //else if (res.err_msg == "get_brand_wcpay_request:fail") {
             //    window.location.replace("/Order/OrderFail.html?&paytype=wxpay&orderid=" + _orderid);
             //}
         else {
             window.location.replace("/Order/OrderFail.html?&paytype=wxpay&orderid=" + _orderid + "&t=" + Math.random());
         }
     }
     );
}

//在线支付包含的支付方式
var onlinePayType = {
    api_target: "com_cmall_familyhas_api_ApiPaymentTypeAll",
    api_input: { "order_code": "" },

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
                    //Session失效，重新登录，传递回调地址
                    UserRELogin.login(g_const_PageURL.MyOrder_pay + "?order_code=" + $("#hid_order_code").val() + "&order_money=" + $("#hid_order_money").val())
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
                ShowMesaage(msg.resultMessage);
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
                        all_pay_type += "<dd id=\"selalipay\" onclick=\"javascript: $('#alpayicq').removeClass(); $('#weixinicq').removeClass();$('#alpayicq').attr('class', 'curr');$('#hid_selpaytype').val('alipay');\" ><em class=\"alipay\"></em>支付宝<a id=\"alpayicq\" href=\"#\" class='" + sel + "' ></a></dd>";
                        if (sel != "") {
                            $("#hid_selpaytype").val("alipay");
                            sel = "";
                        }
                    }
                    break;
                case g_pay_Type.WXpay:
                    all_pay_type += "<dd id=\"selweixin\" onclick=\"javascript:$('#alpayicq').removeClass(); $('#weixinicq').removeClass();$('#weixinicq').attr('class', 'curr');$('#hid_selpaytype').val('weixin');\" ><em class=\"weixin\"></em>微信支付<a id=\"weixinicq\" href=\"#\" class='" + sel + "' ></a></dd>";
                    if (sel != "") {
                        $("#hid_selpaytype").val("weixin");
                        sel = "";
                    }
                    break;
                    //case 2:
                    //    all_pay_type += "<dd><em class=\"blank\"></em>银联支付<a href=\"javascript:;\" class=\"" + sel + "\" ></a></dd>";
                    //    sel = "";
                    //    break;
            }
        });
        $(".pay-method").html(order_money + all_pay_type);

    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
};

var UserIdentity = {
    api_target: "com_cmall_familyhas_api_ApiUserIdentityInfo",
    api_input: { "idNumber": "", "operFlag": "CHECK" },
    Type: 1,
    Check: function (idNumber) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=checkuseridentity&idnumber=" + idNumber,
            dataType: "json"
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {
                    if (UserIdentity.Type == 2) {
                        Address_Update.EditInfo();
                    }
                }
                else {
                    _needVerifyIdNumber = 1;
                    if (UserIdentity.Type == 1) {
                        // Message.ShowConfirm("您的身份证曾被海关退回，", "若继续使用，可能再次通关失败！", "divAlert", "修改身份证", "IDNumber.ChangeIDnumber", "继续使用");
                    }
                    else if (UserIdentity.Type == 3) {
                        Message.ShowConfirm("您的身份证曾被海关退回，", "若继续使用，可能再次通关失败！", "divAlertPrice", "修改身份证", "IDNumber.ChangeIDnumber", "继续购买", "OrderCreate.CreateToJYH");
                    }
                    else {
                        Message.ShowConfirm("您的身份证曾被海关退回，", "若继续使用，可能再次通关失败！", "divAlert", "修改身份证", "IDNumber.ChangeIDnumber", "继续购买", "Address_Update.EditInfo");
                    }
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
            Message.Operate('', "divAlert");
        });
    },
};

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

