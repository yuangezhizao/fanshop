var _operFlag = "paysuccess";
$(document).ready(function () {

    //温馨提示
    $("#div_notice").html("");
    $("#div_notice").hide();
    if (localStorage["tips"] != "" && !(localStorage["tips"] == undefined)) {
        $("#div_notice").html(localStorage["tips"]);
        $("#div_notice").show();
        //清空缓存
        localStorage["tips"] = "";
    }

    pagetype = "succ";
    if (GetQueryString("paytype") == "getpay" || GetQueryString("paytype") == "wxpay") {
        orderid = GetQueryString("orderid");
        OrderInfo.LoadData();
        if (GetQueryString("paytype") == "getpay") {
            $("#spshow1").html("订单提交");
            $("#spshow2").html("下单");
            _operFlag = "orderdetail";
        }
        else {
            $("#spshow1").html("支付");
            $("#spshow2").html("支付");
            _operFlag = "paysuccess";
        }
    }
    else if (GetQueryString("paytype") == "alipay") {
        if (GetQueryString("out_trade_no") == "") {
            orderid = GetQueryString("orderid");
            OrderInfo.LoadData();
        }
        else {
            orderid = GetQueryString("out_trade_no");
            Alipay.Check();
        }

        $("#spshow1").html("支付");
        $("#spshow2").html("支付");
    }
    $("#btnOpenApp1").click(function () {
        PageUrlConfig.SetUrl();
        openApp();
    });
    $(".app-close").on("click", function (e) {
        $(e.target).parent().css("display", "none");
    });
    

    try {
        //if (!(web_maybelove == undefined)) {
        //    //从静态文件获取数据
        //    //Hotword.LoadDataStaitc();
        //    My_LoadDataStaitc.LoadStaitc(web_maybelove, Month_Top.StaticLoad, Month_Top.loadData, web_maybelove, true);
        //}
        //else {
            //从接口获取数据
            Month_Top.loadData();
        //}
    }
    catch (e) {
        //从接口获取数据
        Month_Top.loadData();
    }


    $("#btnTJR").click(function () {
        window.location.replace(g_const_PageURL.Recom + "?t=" + Math.random());
    });

    $("#btnOrderDetail").click(function () {
        //window.location.replace(g_const_PageURL.MyOrder_detail + "?order_code=" + orderid + "&t=" + Math.random());
        window.location.replace(g_const_PageURL.MyOrder_List + "?paytype=ALL&t=" + Math.random());
    });
    $("#btnBack").click(function () {
        if (localStorage.getItem(g_const_localStorage.IsnewReg) == 1) {

            Message.ShowConfirm("确定不填写推荐人吗？", "仅有这一次机会哦~", "divAlert", "确定", "OrderSuccess.GiveUp", "取消");
        }
        else {

            OrderSuccess.GiveUp();
        }
    });
    $("#btnSetPass").click(function () {
        if ($("#txtpassword").val().length == 0) {
            ShowMesaage(g_const_API_Message["100034"]);
            return;
        }
        PassWord.Change();
    });
    if (localStorage.getItem(g_const_localStorage.IsnewReg) == 1) {
        $("#divRecom").show();
    }
    else {
        $("#divRecom").hide();
    }

    //获取用户是否可以绑定上线
    //AccountInfo.Check();

    //判断是否显示下载APP
    FromActShow.ShowDownLoad();

});

var OrderSuccess = {
    LoadOrderInfo: function (paymsg) {

        $("#orderNoId").html(paymsg.order_code);
        $("#actualMoneyId").html(paymsg.order_money);
        //$("#toRebateMoneyId").html(paymsg.cashBackMoney);
        
        if (localStorage[g_const_localStorage.SMG_ProductID].indexOf("IC_SMG_") > -1) {
           // $("#toRebateMoneyId").parent().css("display", "none");
        }
        else {
            Merchant_MT.mt_umobile = "";
            Merchant_MT.productcode = paymsg.orderSellerList[0].productCode;
            Merchant_MT.orderno = paymsg.order_code;
            Merchant_MT.moneypay = parseFloat(paymsg.due_money).toFixed(2);
            Merchant_MT.express_name = paymsg.consigneeName;
            Merchant_MT.express_mobile = paymsg.consigneeTelephone;
            Merchant_MT.express_address = paymsg.consigneeAddress;
            Merchant_MT.ispay = 1;
            Merchant_MT.Paymethod = g_pay_Type.GetPayTypeText(paymsg.pay_type);
            Merchant_MT.RecordOrder();
        }
    },
    GiveUp: function () {
        localStorage[g_const_localStorage.IsnewReg] = "0";
        location = g_const_PageURL.MyOrder_detail + "?order_code=" + orderid + "&t=" + Math.random();
    },
};

var Month_Top = {
    api_target: "com_cmall_familyhas_api_ApiRecProductInfo",
    api_input: { "operFlag": "paysuccess", "pageIndex": "", "pageSize": "" },
    loadData: function () {
        Month_Top.api_input.pageIndex = "1";
        Month_Top.api_input.pageSize = "10";
        Month_Top.api_input.operFlag = _operFlag;
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
                $("#sp_recBarName").html(msg.recBarName);
                Month_Top.Load_Result(msg.productMaybeLove);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //读取静态JS
    StaticLoad: function (msg) {
        $("#sp_recBarName").html(msg.recBarName);
        Month_Top.Load_Result(msg.productMaybeLove);
    },
    Load_Result: function (resultlist) {
        var body = "";
        var classstr = "";
        var sellover = "";
        $.each(resultlist, function (i, n) {

            if (i % 2 == 0) {
                classstr = "fl";
            }
            else {
                classstr = "fr";
            }
            if (n.storeFlag == "0")
                sellover = "<span>&nbsp;</span>";
            else
                sellover = "";
            body += "<div class=\"lid " + classstr + "\" onclick=\"Month_Top.Load_Product(" + n.procuctCode + ")\">";

            body += "<div class=\"imgd\">" + sellover;
            //原有本地图片，3.9.4后注销
            //if (n.labelsList.length >= 1) {
            //    var label = g_const_ProductLabel.find(n.labelsList[0]);
            //    if (label) {
            //        body += '<img class="d_add_ys" src="' + label.spicture + '" alt="" />';
            //    }
            //}
            //3.9.4 从接口获取图片
            if (n.labelsPic != "" && !(n.labelsPic == undefined)) {
                body += '<img class="d_add_ys" src="' + n.labelsPic + '" alt="" />';
            }

            body += "<img src=\"" + n.mainpic_url + "\" alt=\"\" /></div>";
            body += "<div class=\"txtd\">";
            body += "<h3>" + n.productNameString + "</h3>";
            body += "<div class=\"price\"><b>¥</b>" + n.productPrice + "<span>¥" + n.market_price + "</span></div>";
            //body += "<div class=\"d_yx\">月销" + n.productNumber + "件</div>";
            body += "</div>";
            body += "</div>";
        });
        $("#MonthTopProduct").html(body);
        if (resultlist.length==0) {
            $("#h_recBarName").hide();
        }
    },
    Load_Product: function (pid) {
        location = g_const_PageURL.Product_Detail + "?pid=" + pid + "&t=" + Math.random()
    }
};

var PassWord = {
    Change: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=changepwd&password=" + $("#txtpassword").val(),
            dataType: "json"
        });
        request.done(function (msg) {
            if (msg.resultcode == g_const_Success_Code) {
                // $("#divPass").hide();
                ShowMesaage(g_const_API_Message["100035"]);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            //ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};

////获取用户是否可以绑定上线
//var AccountInfo = {
//    api_target: "com_cmall_groupcenter_account_api_ApiAccountInfoNew",
//    api_input: {},
//    Check: function () {

//        var s_api_input = JSON.stringify(AccountInfo.api_input);
//        var obj_data = { "api_input": s_api_input, "api_target": AccountInfo.api_target, "api_token": "1" };
//        var purl = g_APIUTL;
//        var request = $.ajax({
//            url: purl,
//            cache: false,
//            method: g_APIMethod,
//            data: obj_data,
//            dataType: g_APIResponseDataType
//        });

//        request.done(function (msg) {
//            if (msg.resultcode) {
//                if (msg.resultcode == g_const_Error_Code.UnLogin) {
//                    //Session失效，重新登录，传递回调地址
//                    if (_paytype_temp != "") {
//                        UserRELogin.login(g_const_PageURL.OrderFail + "?paytype=" + _paytype_temp + "&orderid" + _orderid_temp);
//                    }
//                    else {
//                        UserRELogin.login(g_const_PageURL.OrderFail + "?out_trade_no=" + _out_trade_no_temp);
//                    }
//                    return;
//                }
//                if (msg.resultcode != g_const_Success_Code_IN) {
//                    ShowMesaage(msg.resultmessage);
//                    return;
//                }
//            }
//            if (msg.resultCode) {
//                if (msg.resultCode == g_const_Success_Code) {
//                    if (parseInt(msg.flagRelation) == 1) {
//                        //绑定描述,1是可绑定上线 0是不可绑定
//                        $("#divRecom").show();
//                    }
//                    else {
//                        $("#divRecom").hide();
//                    }

//                }
//                else {
//                    ShowMesaage(msg.resultMessage);
//                }
//            }
//        });

//        request.fail(function (jqXHR, textStatus) {
//            ShowMesaage(g_const_API_Message["7001"]);
//        });
//    }
//};