

//滑动屏幕加载数据
var _PageNo = 1;
var _stop = true;
var OrderStr = "";
var _paytype = ""


var scrollHandler = function () {

    localStorage["qxfhyy_selval"] = ""
    localStorage["qxfhyy"] = ""

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
                MyTKSH_List.GetListByPage();
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

$(document).ready(function () {

    UserLogin.Check();
    //返回
    $("#a_go_back").on("tap", function () {
        //Merchant_Group.Back();
        window.location.replace(PageUrlConfig.BackTo());
    });
    /* @ 返回顶部 */
    $('.scroll-top').on('click', function () {
        document.body.scrollTop = 0;
        $(this).hide();
    });

    //退款售后原因提交
    $(".orderMask_submit").on("tap", function () {
        MyOrder_detaile.tkshSubmit();
    });

    //我的退款售后
    MyTKSH_List.GetList();

    //下拉重新加载
    ScrollReload.Listen("MyTKSH_list_article", "div_scrolldown", "MyTKSH_list", "6", MyTKSH_List.ScollDownCallBack);
    //上拉加载
    $(window).scroll(scrollHandler);


});

//我的退款售后列表
var MyTKSH_List = {
    api_target: "com_cmall_familyhas_api_ApiForAftermarketList",
    api_input: { "page": "" },
    //加载多页
    GetListByPage: function () {

        var all_sel_order_list = "";
        var _LasePageNo = $("#sel_nextPage").val();
        //for (var pageno = 1; parseInt(pageno) <= parseInt(_LasePageNo) ; pageno = parseInt(pageno) + 1) {
        //赋值
        MyTKSH_List.api_input.page = _PageNo;

        //组织提交参数
        var s_api_input = JSON.stringify(MyTKSH_List.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": MyTKSH_List.api_target, "api_token": g_const_api_token.Wanted };
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
                    UserRELogin.login(g_const_PageURL.MyTKSH_List);
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                var temp_OrderStr = "";
                $("#hid_sumpage").val(msg.countPage);
                if (msg.countPage == 0) {
                    $("#MyTKSH_list_article").attr("class", "no-data");
                    //没有数据
                    var emptyStr = "<article class=\"my-order\">"
                         + "<div class=\"order-nodata\">"
                             + "<p>暂无退款售后订单</p>"
                         + "</div>"
                     + "</article>";
                    $("#waitdiv").hide();
                    $(".my-order").html(emptyStr);
                }
                else {
                    $("#MyTKSH_list_article").attr("class", "my-order pb-55");

                    temp_OrderStr = MyTKSH_List.Load_Result(msg);
                    $("#waitdiv").hide();
                    //追加下一页页全部内容
                    $(".my-order").append(temp_OrderStr);

                }
            }
            else {
                ShowMesaage(msg.resultMessage);
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
        MyTKSH_List.api_input.page = $("#sel_nextPage").val();

        //组织提交参数
        var s_api_input = JSON.stringify(MyTKSH_List.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": MyTKSH_List.api_target, "api_token": g_const_api_token.Wanted };
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
                    UserRELogin.login(g_const_PageURL.MyTKSH_List);
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                //隐藏下拉回调层
                $("#div_scrolldown").hide();
                $("#hid_sumpage").val(msg.countPage);
                if (msg.orderList.length == 0) {
                    $("#MyTKSH_list_article").attr("class", "no-data");

                    //没有数据
                    var emptyStr = "<p>暂无退款售后订单</p>";
                    $("#MyTKSH_list_article").html(emptyStr);
                }
                else {
                    $("#MyTKSH_list_article").attr("class", "my-order pb-55");

                    OrderStr = "<ul id=\"my_tksh_list_str\" class=\"my-order-list\">";
                    OrderStr += MyTKSH_List.Load_Result(msg);
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
        //清空判断是否评价缓存
        //g_type_Evaluate.clear();
        $.each(resultlist.orderList, function (i, n) {
            //每个订单的商品信息
            OrderStrTemp = MyTKSH_List.Load_apiSellerList(n);

            OrderStr += OrderStrTemp;
        });

        return OrderStr;

    },
    //每个订单的商品信息
    Load_apiSellerList: function (resultlist) {
        var temp = "";

        var afterStatusTemp = "";
        var kgks = "";//规格款式
        var button_list = "";//订单下方按钮

        ////售后状态
        //switch (resultlist.afterStatus) {
        //    case g_const_afterStatus.TKZ:
        //        afterStatusTemp = "退款中";
        //        break;
        //    case g_const_afterStatus.TKCG:
        //        afterStatusTemp = "退款成功";
        //        break;
        //    case g_const_afterStatus.DDSH:
        //        afterStatusTemp = "等待审核";
        //        break;
        //    case g_const_afterStatus.JJSQ:
        //        afterStatusTemp = "拒绝申请";
        //        break;
        //    case g_const_afterStatus.THHZ:
        //        afterStatusTemp = "退换货中";
        //        break;
        //    case g_const_afterStatus.THCG:
        //        afterStatusTemp = "退货成功";
        //        break;
        //    case g_const_afterStatus.THSB:
        //        afterStatusTemp = "退货失败";
        //        break;
        //    case g_const_afterStatus.HHCG:
        //        afterStatusTemp = "换货成功";
        //        break;
        //    case g_const_afterStatus.HHSB:
        //        afterStatusTemp = "换货失败";
        //        break;
        //    case g_const_afterStatus.DWSWL:
        //        afterStatusTemp = "待完善物流";
        //        break;
        //}

        var totalnum = 0;
        temp = "<li>"
            + "<h3 class=\"order-number\"><em class=\"fl\">售后单号:" + resultlist.afterCode + "</em><i class=\"fr\">" + resultlist.afterStatus + "</i></h3>";

        //循环显示定单商品
        var product_code = "";
        $.each(resultlist.productList, function (iii, nnn) {
            product_code = nnn.product_code;

            temp += "<div class=\"order-info\" module='202071' onclick=\"MyTKSH_List.GoToDetail('','" + resultlist.orderCode + "','" + resultlist.afterCode + "','" + resultlist.afterStatus + "')\">";
            temp += "<a href=\"#\" title=\"" + nnn.product_name + "\">";
            //3.9.4 从接口获取图片
            if (nnn.lablesPic != "" && !(nnn.lablesPic == undefined)) {
                temp += '<img class="d_add_ys" src="' + nnn.lablesPic + '" alt="" />';
            }

            temp += "<div class=\"order-shop-img\"><img src=\"" + nnn.mainpic_url + "\" alt=\"\"></div>";
            temp += "<div class=\"order-shop-info\">";
            temp += "<h1><span>" + nnn.product_name + "</span><em>￥" + nnn.sell_price + "</em></h1>";
            temp += "<h3>x " + nnn.product_number + "</h3>";
            //循环规格款式
            kgks = "";
            $.each(nnn.standardAndStyleList, function (ii, nn) {
                kgks += "<p>" + nn.standardAndStyleKey + "：" + nn.standardAndStyleValue + "</p>"
            });

            temp += kgks
            temp += "</div></a></div>";

            totalnum = parseInt(totalnum) + parseInt(nnn.product_number);
        });
        + "<div class=\"order-service\">";

        //订单支持的按钮
        if (resultlist.orderButtonList.length > 0) {
            button_list = "<div class=\"anbtn clearfix\">";
            $.each(resultlist.orderButtonList, function (i, n) {
                button_list += "<a class=\"service-btn\" onclick=\"MyTKSH_List.btncaozuo('" + n.buttonCode + "','" + n.buttonTitle + "','" + resultlist.orderCode + "','" + resultlist.afterCode + "','" + product_code + "')\">" + n.buttonTitle + "</a>";
            });
            temp += button_list;
        }
        temp += "</div></div></li>";
        return temp;
    },
    //下拉回调
    ScollDownCallBack: function (resultlist) {
        //重新查询默认第一页
        $("#sel_nextPage").val("1")
        $(".order-menu-list").hide();

        //我的订单
        MyTKSH_List.GetList();

    },

    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
    //各种状态下按钮操作
    btncaozuo: function (buttonCode, btnname, order_code, afterCode,skuCode) {
        $("#sel_btn_name").val(btnname);
        switch (buttonCode) {
            case g_const_afterButtonCode.TXTHKWL://填写退换货物流
                PageUrlConfig.SetUrl();
                if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
                    
                    //去登录
                    UserRELogin.login(g_const_PageURL.MyTKSH_TXWL + "?order_code=" + order_code + "&afterCode=" + afterCode + "&t=" + Math.random());
                    return;
                }
                else {
                    window.location.href = g_const_PageURL.MyTKSH_TXWL + "?order_code=" + order_code + "&afterCode=" + afterCode + "&t=" + Math.random();
                }
                break;

            case g_const_afterButtonCode.QXDD://取消订单【待定处理流程】
                break;

            case g_const_afterButtonCode.QXFH://取消发货
                $("#hid_order_code").val(order_code);
                QHFHYHReason.GetList();
                break;

            case g_const_afterButtonCode.CKWL://查看物流
                PageUrlConfig.SetUrl();
                if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
                    //去登录
                    UserRELogin.login(g_const_PageURL.MyTKSH_Detail + "?order_code=" + order_code + "&afterCode=" + afterCode + "&t=" + Math.random());
                    return;
                }
                else {
                    window.location.href = g_const_PageURL.MyTKSH_Detail + "?order_code=" + order_code + "&afterCode=" + afterCode + "&t=" + Math.random();
                }
                break;
            case g_const_afterButtonCode.DHTK://电话退款
                window.location = "tel:" + g_const_Phone.sh + "#mp.weixin.qq.com";
                return false;
                break;

            case g_const_afterButtonCode.SH://售后
                PageUrlConfig.SetUrl();
                if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
                    //去登录
                    UserRELogin.login(g_const_PageURL.MyTKSH_SQ + "?order_code=" + order_code + "&skuCode=" + afterCode + "&t=" + Math.random());
                    return;
                }
                else {
                    window.location.href = g_const_PageURL.MyTKSH_SQ + "?order_code=" + order_code + "&skuCode=" + afterCode + "&t=" + Math.random();
                }
                break;
            case g_const_afterButtonCode.SCDD://删除订单【待定处理流程】
                break;

            case g_const_afterButtonCode.SHJD://售后进度
                PageUrlConfig.SetUrl();
                if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
                    //去登录
                    UserRELogin.login(g_const_PageURL.MyTKSH_Detail + "?order_code=" + order_code + "&afterCode=" + afterCode + "&t=" + Math.random());
                    return;
                }
                else {
                    window.location.href = g_const_PageURL.MyTKSH_Detail + "?order_code=" + order_code + "&afterCode=" + afterCode + "&t=" + Math.random();
                }

                break;
        }
    },
    //跳转至详情页
    GoToDetail: function (btnname, order_code, afterCode, afterStatus) {
        //if (btnname == "") {
        //    PageUrlConfig.SetUrl();
        //    window.location.href = g_const_PageURL.MyTKSH_Detail + "?order_code=" + order_code + "&afterCode=" + afterCode + "&t=" + Math.random();
        //}

        //switch (afterStatus) {
        //    case g_const_afterStatus.TKZ://退款中
        //    case g_const_afterStatus.TKCG://退款成功
        //    case g_const_afterStatus.DDSH://等待审核
        //    case g_const_afterStatus.JJSQ://拒绝申请
        //    case g_const_afterStatus.THHZ://退换货中
        //    case g_const_afterStatus.THCG://退货成功
        //    case g_const_afterStatus.THSB://退货失败
        //    case g_const_afterStatus.HHCG://换货成功
        //    case g_const_afterStatus.HHSB://换货失败
        //    case g_const_afterStatus.DWSWL://待完善物流
                    PageUrlConfig.SetUrl();
                    window.location.href = g_const_PageURL.MyTKSH_Detail + "?order_code=" + order_code + "&afterCode=" + afterCode + "&t=" + Math.random();
                //break;
        //}
    },
};

/*取消发货*/
var QHFX = {
    api_target: "com_cmall_familyhas_api_ApiForCancelShipments",
    api_input: { "orderCode": "", "reason": "" },

    Submit: function () {
        //赋值
        QHFX.api_input.orderCode = $("#hid_order_code").val();
        QHFX.api_input.reason = $("#hid_sel_val").val();

        //组织提交参数
        var s_api_input = JSON.stringify(QHFX.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": QHFX.api_target, "api_token": g_const_api_token.Wanted };
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
                    UserRELogin.login(g_const_PageURL.MyTKSH_List);
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                MyTKSH_List.GetList();
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
        QHFX.tkshHide();
        MyTKSH_List.GetList();
    },
    /*退货原因隐藏*/
    tkshHide: function () {
        $("#hid_sel_val").val("");
        $("#hid_order_code").val("");

        $("#div_orderMask").hide();
    },
    /*退货原因选择*/
    tkshSel: function (selval) {
        $("#hid_sel_val").val(selval);

    },

};

/*取消发货原因*/
var QHFHYHReason = {
    //家有汇--订单配送轨迹查询接口
    api_target: "com_cmall_familyhas_api_ApiForCancelShipmentsReason",
    api_input: { "version": "1" },
    GetList: function () {

        if (localStorage["qxfhyy"] != "" && !(localStorage["qxfhyy"] == undefined)) {

            $("#ul_thyy").html(localStorage["qxfhyy"]);
            hid_sel_val.val(localStorage["qxfhyy_selval"]);

            //弹层显示
            $("#div_orderMask").show();

        }
        else {
            //组织提交参数
            var s_api_input = JSON.stringify(this.api_input);
            //提交接口[api_token不为空，公用方法会从sission中获取]
            var obj_data = { "api_input": s_api_input, "api_target": CancelShipmentsReason.api_target, "api_token": g_const_api_token.Unwanted };
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
                if (msg.resultCode == g_const_Success_Code) {
                    CancelShipmentsReason.Load_Result(msg);
                }
                else {
                    ShowMesaage(msg.resultMessage);
                }
            });
            //接口异常
            request.fail(function (jqXHR, textStatus) {
                ShowMesaage(g_const_API_Message["7001"]);
            });
        }
    },
    //接口返回成功后的处理
    Load_Result: function (resultlist) {

        var li_str = "";
        var selectStr = "";
        var radioStr = "";
        $.each(resultlist.reasonList, function (s, m) {
            if (s == 0) {
                selectStr = " checked=\"checked\" ";
                radioStr = "radio on";
                hid_sel_val.val(m.reason_code);
                //保存默认选项
                localStorage["qxfhyy_selval"] = m.reason_code;

            }
            else {
                selectStr = "";
                radioStr = "radio";

            }
            li_str += "<li class=\"clearfix\">"
                    + "<div class=\"" + radioStr + "\">"
                         + "<input type=\"radio\" data-role=\"none\" name=\"select\" value=\"1\" " + selectStr + " onclick=\"QHFX.tkshSel('" + m.reason_code + "')\" />"
                     + "</div>"
                     + "<div class=\"choiceTxt\">" + m.reson_content + "</div>"
                 + "</li>";
        });
        $("#ul_thyy").html(li_str);
        localStorage["qxfhyy"] = li_str;

        //弹层显示
        $("#div_orderMask").show();

    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
};