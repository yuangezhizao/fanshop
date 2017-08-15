

//滑动屏幕加载数据
var _PageNo = 0;
var _stop = true;
var OrderStr = "";
var _paytype = ""


var scrollHandler = function () {
    //隐藏下拉回调层
    $("#div_scrolldown").hide();

    totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
    if ($(document).height() <= totalheight) {
        if (_stop == true) {
            var jiazai = false;

            _PageNo = $("#sel_nextPage").val();

            if ((parseInt(_PageNo) + 1) <= parseInt($("#hid_sumpage").val())) {
                jiazai = true;
            }

            if (jiazai) {
                $("#waitdiv").show();
                _stop = false;
                _PageNo = (parseInt(_PageNo) + 1).toString();
                $("#sel_nextPage").val(_PageNo);
                //加载多页
                MyMobileCZ_Order_List.GetListByPage();
                if ((parseFloat($(window).scrollTop()) / parseFloat($(window).height())) >= 3) {
                    //显示“至顶部”
                    $('.scroll-top').show();
                }
                else {
                    $('.scroll-top').hide();
                }
                _stop = true;
            }
        }
    }
};
/*
$(window).scroll(function () {
    //隐藏下拉回调层
    $("#div_scrolldown").hide();

    totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
    if ($(document).height() <= totalheight) {
        if (_stop == true) {
            var jiazai = false;

            _PageNo = $("#sel_nextPage").val();

            if ((parseInt(_PageNo) + 1) <= parseInt($("#hid_sumpage").val())) {
                jiazai = true;
            }

            if (jiazai) {
                _stop = false;
                _PageNo = (parseInt(_PageNo) + 1).toString();
                $("#sel_nextPage").val(_PageNo);
                //加载多页
                MyMobileCZ_Order_List.GetListByPage();
                //显示“至顶部”
                $('.ch-up').show();
                _stop = true;
            }
        }
    }
});
*/

$(document).ready(function () {

    /* @ 全部订单下拉 */
    $('.order-menu').on('click', function () {
        var _this = $(this);
        var parentChild = _this.parent();
        var listChild = parentChild.find('.order-menu-list');
        listChild.is(':hidden') ? listChild.show() : listChild.hide();
        listChild.is(':hidden') ? _this.removeClass('menu-curr') : _this.addClass('menu-curr');
    });
    /* @ 返回顶部 */
    $('.scroll-top').on('click', function () {
        document.body.scrollTop = 0;
        $(this).hide();
    });
    //订单状态切换
    $("#sel_all_num").on("tap", function () {
        SelOrderStatus("");
    });
    $("#sel_dzf_num").click(function () {
        SelOrderStatus(g_const_mobilecz_orderStatus.DZF);//代支付
    });
    $("#sel_dcz_num").click(function () {
        SelOrderStatus(g_const_mobilecz_orderStatus.DCZ);//代充值
    });
    $("#sel_czcg_num").click(function () {
        SelOrderStatus(g_const_mobilecz_orderStatus.CZCG);//充值成功
    });
    $("#sel_czsb_num").click(function () {
        SelOrderStatus(g_const_mobilecz_orderStatus.CZSB);//充值失败
    });

    //返回
    $(".go-back").on("tap", function () {
        window.location.replace(PageUrlConfig.BackTo());
    });
    //传递的订单状态
    _paytype = GetQueryString("paytype")
    switch (_paytype) {
        case ""://全部
        case "ALL"://全部
            SelOrderStatus("");
            break;
        case "DZF"://代支付
            SelOrderStatus(g_const_mobilecz_orderStatus.DZF);
            break;
        case "DCZ"://代充值
            SelOrderStatus(g_const_mobilecz_orderStatus.DCZ);
            break;
        case "CZCG"://充值成功
            SelOrderStatus(g_const_mobilecz_orderStatus.CZCG);
            break;
        case "CZSB"://充值失败
            SelOrderStatus(g_const_mobilecz_orderStatus.CZSB);
            break;
    }

    //下拉重新加载
    ScrollReload.Listen("MyOrder_list_article", "div_scrolldown", "MyMobileCZ_Order_List", "6", MyMobileCZ_Order_List.ScollDownCallBack);
    //上拉加载
    $(window).scroll(scrollHandler);

});

function gotourlaa(id) {
    if (id == "qgg") {//去充值
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.MobileCZ + "?t=" + Math.random();
    }
    //else if (id == "sc") {
    //    PageUrlConfig.SetUrl();
    //    window.location.href = g_const_PageURL.MyCollection + "?t=" + Math.random();
    //}
}

//确认层回调方法
function CancelOrder() {
    switch ($("#sel_btn_name").val()) {
        case "qxdd"://取消订单按钮弹出的
            //调用接口，删除订单，重新加载
            MyMobileCZ_Order_List_qxdd.GetList();
            break;
        case "tksh"://退款售后按钮弹出的
            //拨打电话
            window.location = "tel:" + g_const_Phone.sh + "#mp.weixin.qq.com";

            return false;
            break;

    }
}

//各种状态下按钮操作
function btncaozuo(btnname, order_code, order_money) {
    $("#sel_btn_name").val(btnname);
    switch (btnname) {
        case "qxdd"://取消订单
            $("#sel_order_code").val(order_code);

            Message.ShowConfirm("确定要取消订单吗？", "", "fbox_ftel", "确定", "CancelOrder", "取消");

            break;
        case "tksh"://退款售后
            Message.ShowConfirm("提示", "确定拨打电话" + g_const_Phone.sh + "？", "fbox_ftel", "确定", "CancelOrder", "取消");

            break;
        case "qfk"://去付款
            PageUrlConfig.SetUrl();
            if (IsInWeiXin.check()) {
                var wxUrl = g_const_PageURL.MyMobileCZOrder_pay + "?order_code=" + order_code + "&order_money=" + order_money + "&t=" + Math.random() + "&showwxpaytitle=1";
                WxInfo.GetPayID(wxUrl);

            }
            else {
                window.location.href = g_const_PageURL.MyMobileCZOrder_pay + "?order_code=" + order_code + "&order_money=" + order_money + "&t=" + Math.random();
            }
            break;


    }
}

//订单状态切换
function SelOrderStatus(selstr) {
    switch (selstr) {
        case "":
            $(".order-menu").html("全部订单");
            $("#sel_order_status").val("");
            break;
        case g_const_mobilecz_orderStatus.DZF:
            $(".order-menu").html("待付款");
            $("#sel_order_status").val(g_const_mobilecz_orderStatus.DZF);
            break;
        case g_const_mobilecz_orderStatus.DCZ:
            $(".order-menu").html("待充值");
            $("#sel_order_status").val(g_const_mobilecz_orderStatus.DCZ);
            break;
        case g_const_mobilecz_orderStatus.CZCG:
            $(".order-menu").html("充值成功");
            $("#sel_order_status").val(g_const_mobilecz_orderStatus.CZCG);
            break;
        case g_const_mobilecz_orderStatus.CZSB:
            $(".order-menu").html("充值失败");
            $("#sel_order_status").val(g_const_mobilecz_orderStatus.CZSB);
            break;
    }
    //重新查询默认第一页
    $("#sel_nextPage").val("1")
    $(".order-menu-list").hide();
    $('.order-menu').removeClass('menu-curr');

    //我的订单数量
    MyMobileCZOrder_Num.GetList();
    //我的订单
    MyMobileCZ_Order_List.GetList();
}

//我的订单数量
var MyMobileCZOrder_Num = {
    GetList: function () {
        var purl = "/Ajax/MobileCZAPI.aspx";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "action=getmobileczordernum&t=" + Math.random() + "&status=" + $("#sel_order_status").val(),
            type: "POST",
            dataType: "text"
        });
        //正常返回
        request.done(function (msg) {

            if (msg == "需登录") {
                    //Session失效，重新登录，传递回调地址
                UserRELogin.login(g_const_PageURL.MobileCZList + "?paytype=" + _paytype)
                    return;
                }
            else if (msg == "缺少参数") {
                ShowMesaage("缺少参数");
                    return;
                }

            else{
                MyMobileCZOrder_Num.Load_Result(msg);
            }


        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //接口返回成功后的处理
    Load_Result: function (resultlist) {
        $("#dzf_num").html("(0)");
        $("#dcz_num").html("(0)");
        $("#dczcg_num").html("(0)");
        $("#dczsb_num").html("(0)");

        var bodyList = "<em></em><span>全部订单</span>";

        resultlist=JSON.parse(resultlist);
        $.each(resultlist.ResultTable, function (i, n) {

            var showNum = parseInt(n.number) > 99 ? "99+" : n.number;

            switch (n.orderstatus) {
                case "DZF":
                    $("#dzf_num").html("(" + showNum + ")");
                    if (showNum.toString() == "0") {
                        $("#dzf_num").removeClass("red")
                    }
                    else {
                        $("#dzf_num").attr("class", "red")
                    }
                    break;
                case "DCZ":
                    $("#dcz_num").html("(" + showNum + ")");
                    if (showNum.toString() == "0") {
                        $("#dcz_num").removeClass("red")
                    }
                    else {
                        $("#dcz_num").attr("class", "red")
                    }

                    break;
                case "CZCG":
                    $("#czcg_num").html("(" + showNum + ")");
                    if (showNum.toString() == "0") {
                        $("#czcg_num").removeClass("red")
                    }
                    else {
                        $("#czcg_num").attr("class", "red")
                    }

                    break;
                case "CZSB":
                    $("#czsb_num").html("(" + showNum + ")");
                    if (showNum.toString() == "0") {
                        $("#czsb_num").removeClass("red")
                    }
                    else {
                        $("#czsb_num").attr("class", "red")
                    }

                    break;

            }
        });
    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
};

//我的订单列表
var MyMobileCZ_Order_List = {
    //加载多页
    GetListByPage: function () {

        var all_sel_order_list = "";
        var _LasePageNo = $("#sel_nextPage").val();
        //for (var pageno = 1; parseInt(pageno) <= parseInt(_LasePageNo) ; pageno = parseInt(pageno) + 1) {
        //赋值
        //MyMobileCZ_Order_List.api_input.nextPage = _PageNo;
        //MyMobileCZ_Order_List.api_input.order_status = $("#sel_order_status").val();

        var purl = "/Ajax/MobileCZAPI.aspx";;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "action=getmobileczorder&t=" + Math.random() + "&status=" + $("#sel_order_status").val() + "&page=" + _PageNo + "&pagesize=10&ordercol=id&ordertype=desc",
            type: "POST",
            dataType: "text"
        });
        //正常返回
        request.done(function (msg) {
            if (msg == "缺少参数") {
                ShowMesaage("缺少参数");
                return;
            }
            else {
                msg = JSON.parse(msg);
                
                if (msg.resultcode == "80") {
                        //Session失效，重新登录，传递回调地址
                    UserRELogin.login(g_const_PageURL.MobileCZList + "?paytype=" + _paytype);
                        return;
                    }
                if (msg.resultcode == "90") {
                        ShowMesaage(msg.resultmessage);
                        return;
                    }
               

                    if (msg.resultcode == "1") {
                    var temp_OrderStr = "";
                    $("#hid_sumpage").val(msg.countPage);
                    if (msg.countPage == 0) {
                        $("#MyOrder_list_article").attr("class", "no-data");
                        //没有数据
                        var emptyStr = "<article class=\"my-order\">"
                             + "<div class=\"order-nodata\">"
                                 + "<p>暂无该状态的订单信息<br></p>"
                                 + "<div class=\"order-nodata-btn\">"
                                     + "<a id=\"btnqgg\" onclick=\"gotourlaa('qcz')\">去充值</a>"
                                 + "</div>"
                             + "</div>"
                         + "</article>";
                        $("#waitdiv").hide();
                        $(".my-order").html(emptyStr);
                    }
                    else {
                        $("#MyOrder_list_article").attr("class", "my-order pb-55");

                        temp_OrderStr = MyMobileCZ_Order_List.Load_Result(msg);
                        $("#waitdiv").hide();
                        //追加下一页页全部内容
                        $(".my-order-list").append(temp_OrderStr);

                    }
                }
                else {
                    ShowMesaage(msg.resultMessage);
                }
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            $("#waitdiv").hide();
            ShowMesaage(g_const_API_Message["7001"]);
        });
        //}

    },
    //加载单页
    GetList: function () {
        //赋值
        //MyMobileCZ_Order_List.api_input.nextPage = $("#sel_nextPage").val();
        //MyMobileCZ_Order_List.api_input.order_status = $("#sel_order_status").val();

        var purl = "/Ajax/MobileCZAPI.aspx";;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "action=getmobileczorder&t=" + Math.random() + "&status=" + $("#sel_order_status").val() + "&page=0&pagesize=10&ordercol=id&ordertype=desc",
            type: "POST",
            dataType: "text"
        });
        //正常返回
        request.done(function (msg) {
            msg = JSON.parse(msg);
                
                if (msg.resultcode == "80") {
                    //Session失效，重新登录，传递回调地址
                    UserRELogin.login(g_const_PageURL.MobileCZList + "?paytype=" + _paytype);
                    return;
                }
                if (msg.resultcode == "90") {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
           

                if (msg.resultcode == "1") {
                //隐藏下拉回调层
                $("#div_scrolldown").hide();
                $("#hid_sumpage").val(msg.countPage);
                if (msg.countPage == 0) {
                    $("#MyOrder_list_article").attr("class", "no-data");

                    //没有数据
                    var emptyStr = "<p>暂无该状态的订单信息</p>"
			                 + "<div class=\"no-data-btn\">"
                                 + "<a id=\"btnqgg\" onclick=\"gotourlaa('qcz')\">去充值</a>"
			                 + "</div>";
                    $("#MyOrder_list_article").html(emptyStr);
                    //location = "/Feedback.html";
                }
                else {
                    $("#MyOrder_list_article").attr("class", "my-order pb-55");

                    OrderStr = "<ul id=\"my_order_list_str\" class=\"my-order-list\">";
                    OrderStr += MyMobileCZ_Order_List.Load_Result(msg);
                    OrderStr += " </ul>"
                    $(".my-order").html(OrderStr);

                }
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
    Load_Result: function (resultlist, pageno) {
        //组织商品列表
        var OrderStrTemp;
        var OrderStr_t = "";
        $.each(resultlist.ResultTable, function (i, n) {
            //每个订单的商品信息
            OrderStrTemp = MyMobileCZ_Order_List.Load_apiSellerList(n);

            OrderStr_t += OrderStrTemp;
        });

        return OrderStr_t;

    },
    //每个订单的商品信息
    Load_apiSellerList: function (resultlist) {
        var temp = "";

        var order_statusTemp = "";
        var kgks = "";//规格款式
        var payShow = "";//订单下方按钮

        switch (resultlist.status) {
            case "0":
                order_statusTemp = "待付款";
                break;
            case "110":
            case "190":
                order_statusTemp = "待充值";
                break;
            case "1":
                order_statusTemp = "充值成功";
                break;
            case "200":
            case "100":
                order_statusTemp = "充值失败";
                break;
        }
        var totalnum = 0;
        //temp = "<li>"
        //    + "<h3 class=\"order-number\"><em class=\"fl\">订单号:" + resultlist.orderno + "</em><i class=\"fr\">" + order_statusTemp + "</i></h3>";
        //temp += "<div class=\"order-price\">充值手机号：<i>" + resultlist.czmobile + "</i><span>面额:<i>" + resultlist.ordermoney + "</i></span></div>"
        //+ "<div class=\"order-service\">";
        ////根据状态显示不同内容
        //switch (resultlist.status) {
        //    case "0"://待付款
        //        payShow = "<a class=\"receipt\"  onclick=\"btncaozuo('qfk','" + resultlist.orderno + "','" + resultlist.ordermoney + "');\">付款</a>";
        //        break;
        //    case "110"://待充值
        //    case "190":
        //        payShow = "<a id=\"btn_tksh\">充值中</a>";
        //        break;
        //    case "1":
        //        payShow = "<a id=\"btn_tksh\" >充值成功</a>";
        //        break;
        //    case "200":
        //        payShow = "<a id=\"btn_tksh\" >充值失败</a>";
        //        break;

        //}

        //temp += payShow;
        //temp += "</div></li>";


        ////////////////////
        //根据状态显示不同内容
        var qq="";
        switch (resultlist.status) {
            case "0"://待付款
                payShow = "<a class=\"receipt\"  onclick=\"btncaozuo('qfk','" + resultlist.orderno + "','" + resultlist.ordermoney + "');\">付款</a>";
                qq="待付款";
                break;
            case "110"://待充值
            case "190":
                //payShow = "<a id=\"btn_tksh\">充值中</a>";
                qq="充值中";
                break;
            case "1":
                //payShow = "<a id=\"btn_tksh\" >充值成功</a>";
                qq="充值成功";
                break;
            case "200":
                //payShow = "<a id=\"btn_tksh\" >充值失败</a>";
                qq = "充值失败";
                break;
            case "100":
                //payShow = "<a id=\"btn_tksh\" >充值失败</a>";
                qq = "已退款";
                break;
        }
        var tt = resultlist.memo;//GetallChzAmountbymobile(resultlist.czmobile);
        var ord = resultlist.orderno.split('-');
        if (ord.length > 1) {
            ord = ord[1];
        }
        else {
            ord = ord[0];
        }
        temp = "<li>"
        + "<h3 class=\"order-number\"><em class=\"fl\">订单号:" + ord + "</em><i class=\"fr\">" + qq + "</i></h3>"
                + "<div class=\"order-info\">"
                + "<a>"
                        + "<div class=\"order-shop-img\"><img src=\"/img/hfcz.jpg\" alt=\"\"></div>"
                        + "<div class=\"order-shop-info\">"
                            + "<h1><span>" + tt + "</span><em>￥" + resultlist.ordermoney + "</em></h1>"
                            + "<h3>充值手机号：" + (resultlist.czmobile.substr(0, 3) + "****" + resultlist.czmobile.substr(7, 4)) + "</h3>"
                            + "<p></p>"
                            + "<p></p>"
                        + "</div>"
                    + "</a>"
                + "</div>"
                + "<div class=\"order-price\"><span>实付:<i>￥" + resultlist.paymoney + "</i></span></div>";
        if(payShow!=""){
            temp += "<div class=\"order-service\">";
            temp += payShow;
            temp += "</div>";
        }
        temp +="</li>";

        return temp;
    },
    //下拉回调
    ScollDownCallBack: function (resultlist) {
        selstr = $("#sel_order_status").val();
        switch (selstr) {
            case "":
                $(".order-menu").html("全部订单");
                $("#sel_order_status").val("");
                break;
            case g_const_mobilecz_orderStatus.DZF:
                $(".order-menu").html("待付款");
                $("#sel_order_status").val(g_const_mobilecz_orderStatus.DZF);
                break;
            case g_const_mobilecz_orderStatus.DCZ:
                $(".order-menu").html("待充值");
                $("#sel_order_status").val(g_const_mobilecz_orderStatus.DCZ);
                break;
            case g_const_mobilecz_orderStatus.CZCG:
                $(".order-menu").html("充值成功");
                $("#sel_order_status").val(g_const_mobilecz_orderStatus.CZCG);
                break;
            case g_const_mobilecz_orderStatus.CZSB:
                $(".order-menu").html("充值失败");
                $("#sel_order_status").val(g_const_mobilecz_orderStatus.CZSB);
                break;
        }
        //重新查询默认第一页
        $("#sel_nextPage").val("1")
        $(".order-menu-list").hide();

        //我的订单数量
        MyMobileCZOrder_Num.GetList();
        //我的订单
        MyMobileCZ_Order_List.GetList();

    },

    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
};

//获得流量产品
function GetallChzAmountbymobile(mobile) {
    var tt = "";
    var mobile = mobile.substr(0, 3);
    switch (mobile) {
        case "134":
        case "135":
        case "136":
        case "137":
        case "138":
        case "139":
        case "150":
        case "151":
        case "152":
        case "157":
        case "158":
        case "159":
        case "188":
            tt = "中国移动";
            break;
        case "130":
        case "131":
        case "132":
        case "155":
        case "156":
        case "186":
            tt = "中国联通";
            break;
        case "133":
        case "153":
        case "177":
        case "189":
            tt = "中国电信";
            break;
    }
    return tt;

}


////点击商品区域，跳转
//function GoToOrderDetail(btnname, order_code, order_money) {
//    if (btnname == "") {
//        PageUrlConfig.SetUrl();
//        //location = g_const_PageURL.MyOrder_detail + "?order_code=" + order_code + "&paytype=" + $("#sel_order_status").val();
//        window.location.href = g_const_PageURL.MyOrder_detail + "?order_code=" + order_code + "&paytype=" + $("#sel_order_status").val() + "&t=" + Math.random();

//    }

//    switch (btnname) {
//        case "qxdd"://取消订单
//            Message.ShowConfirm("确定要取消订单吗？", "", "fbox_ftel", "确定", "CancelOrder", "取消");

//            //$("#sc_jxtx").html("<span>确定要取消订单吗？</span>");
//            //$("#mask").show();
//            //$("#fbox_ftel").show();

//            break;
//        case "tksh"://退款售后
//            Message.ShowConfirm("提示", "确定拨打电话" + g_const_Phone.sh + "？", "fbox_ftel", "确定", "CancelOrder", "取消");

//            //$("#sc_jxtx").html("提示<span>确定拨打电话400-867-8210？</span>");
//            //$("#mask").show();
//            //$("#fbox_ftel").show();

//            break;
//        case "ckwl"://查看物流
//            PageUrlConfig.SetUrl();
//            //location = g_const_PageURL.MobileCZList + "?order_code=" + order_code;
//            window.location.href = g_const_PageURL.MobileCZList + "?order_code=" + order_code + "&t=" + Math.random();

//            break;
//        case "qrsh"://确认收货
//            $("#sel_order_code").val(order_code);
//            Message.ShowConfirm("确定收货吗？", "", "fbox_ftel", "确定", "CancelOrder", "取消");

//            break;
//        case "qfk"://去付款
//            PageUrlConfig.SetUrl();
//            //location = g_const_PageURL.MyOrder_pay + "?order_code=" + order_code + "&order_money=" + order_money;
//            // window.location.href = g_const_PageURL.MyOrder_pay + "?order_code=" + order_code + "&order_money=" + order_money;
//            if (IsInWeiXin.check()) {
//                var wxUrl = g_const_PageURL.MyOrder_pay + "?order_code=" + order_code + "&order_money=" + order_money + "&t=" + Math.random() + "&showwxpaytitle=1";
//                WxInfo.GetPayID(wxUrl);
//            }
//            else {
//                window.location.href = g_const_PageURL.MyOrder_pay + "?order_code=" + order_code + "&order_money=" + order_money + "&t=" + Math.random();
//            }
//            break;

//    }
//}


////我的订单列表--取消订单
//var MyMobileCZ_Order_List_qxdd = {
//    api_target: "com_cmall_familyhas_api_ApiCancelOrderForFamily",
//    api_input: { "order_code": "" },
//    GetList: function () {
//        //赋值
//        MyMobileCZ_Order_List_qxdd.api_input.order_code = $("#sel_order_code").val();

//        //组织提交参数
//        var s_api_input = JSON.stringify(MyMobileCZ_Order_List_qxdd.api_input);
//        //提交接口[api_token不为空，公用方法会从sission中获取]
//        var obj_data = { "api_input": s_api_input, "api_target": MyMobileCZ_Order_List_qxdd.api_target, "api_token": g_const_api_token.Wanted };
//        var purl = g_APIUTL;
//        var request = $.ajax({
//            url: purl,
//            cache: false,
//            method: g_APIMethod,
//            data: obj_data,
//            dataType: g_APIResponseDataType
//        });
//        //正常返回
//        request.done(function (msg) {
//            if (msg.resultcode) {
//                if (msg.resultcode == g_const_Error_Code.UnLogin) {
//                    //Session失效，重新登录，传递回调地址
//                    UserRELogin.login(g_const_PageURL.MobileCZList + "?paytype=" + _paytype);
//                    return;
//                }
//                if (msg.resultcode != g_const_Success_Code_IN) {
//                    ShowMesaage(msg.resultmessage);
//                    return;
//                }
//            }


//            if (msg.resultCode == g_const_Success_Code) {
//                //重新加载页面
//                $("#sel_nextPage").val("1");
//                MyMobileCZ_Order_List.GetList();
//            }
//            else {
//                ShowMesaage(msg.resultMessage);
//            }
//        });
//        //接口异常
//        request.fail(function (jqXHR, textStatus) {
//            ShowMesaage(g_const_API_Message["7001"]);
//        });
//    },
//};