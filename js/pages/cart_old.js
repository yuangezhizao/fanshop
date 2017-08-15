var isEdit = 0; //编辑状态 0 否定 1 肯定
var selectNum = 0;
$(document).ready(function () {
    CartInfo.SetIng = 1;
    UserLogin.Check(CartInfo.LoadData);
    //后退
    //$("#btnBack").click(function () {
    //    window.location.replace(PageUrlConfig.BackTo());
    //});
    $("#btnBack").on("tap", function () {
        window.location.replace(PageUrlConfig.BackTo());
    });

    //去登录
    //$("#btnLogin").click(function () {
    //    PageUrlConfig.SetUrl();
    //    window.location.href= g_const_PageURL.Login + "?t=" + Math.random();
    //});
    $("#btnLogin").on("tap", function () {
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.Login + "?t=" + Math.random();
    });

    //去首页
    //$("#btnIndex").click(function () {
    //    window.location.replace(g_const_PageURL.Index + "?t=" + Math.random());
    //});
    $("#btnIndex").on("tap", function () {
        window.location.replace(g_const_PageURL.Index + "?t=" + Math.random());
    });

    //完成编辑
    //$("#btnFinish").click(function () {
    //    isEdit = 0;
    //    CartInfo.EditSelect();
    //    CartInfo.LoadData();
    //});
    $("#btnFinish").on("tap", function () {
        isEdit = 0;
        CartInfo.EditSelect();
        CartInfo.LoadData();

        $("#btnSubmit_wait").hide();
        $("#btnSubmit").show();
        //CartInfo.SetIng = 1;
        //更新购物车服务端数据
        //CartInfo.LoadData();
    });

    //编辑
    //$("#btnEdit").click(function () {
    //    isEdit = 1;
    //    CartInfo.LoadData();
    //});
    $("#btnEdit").on("tap", function () {
        isEdit = 1;
        CartInfo.LoadData();
    });

    //全选
    //$("#lblAllSelView").click(function () {
    //    CartInfo.SelectAll(this);
    //});
    $("#lblAllSelView").on("tap", function () {
        //CartInfo.SetIng = 1;
        if (CartInfo.SetIng == 1) {
            CartInfo.SelectAll(this);
        }
    });

    //$("#lblAllSelEdit").click(function () {
    //    CartInfo.SelectAll(this);
    //});
    $("#lblAllSelEdit").on("tap", function () {
        if (CartInfo.SetIng == 1) {
            CartInfo.SelectAll(this);
        }
    });

    //删除
    //$("#btnDel").click(function () {
    //    if (selectNum>0) {
    //        Message.ShowConfirm("确定从购物车中删除所有选中商品？", "", "divAlert", "确定", "CartInfo.DeleteSelect", "取消");
    //    }
    //    //CartInfo.DeleteSelect();
    //});
    $("#btnDel").on("tap", function () {
        if (selectNum > 0) {
            Message.ShowConfirm("确定从购物车中删除所有选中商品？", "", "divAlert", "确定", "CartInfo.DeleteSelect", "取消");
        }
    });

    //$("#btnSubmit").click(function () {
    //    if (selectNum>0) {
    //        UserLogin.Check(CartInfo.SubmitSelect);
    //    }
    //});
    $("#btnSubmit").on("tap", function () {
        if (selectNum > 0) {
            UserLogin.Check(CartInfo.SubmitSelect);
        }
    });

    //$("#btnClear").click(function () {
    //    Message.ShowConfirm("确定要清空失效商品吗？", "", "divAlert", "确定", "CartInfo.DeleteInvalid", "取消");
    //});
    $("#btnClear").on("tap", function () {
        Message.ShowConfirm("确定要清空失效商品吗？", "", "divAlert", "确定", "CartInfo.DeleteInvalid", "取消");
    });

    //下拉重新加载
    ScrollReload.Listen("divCartList", "div_scrolldown", "Cart", "10", CartInfo.LoadData);
    ScrollReload.Listen("divCartNull", "div_scrolldown", "Cart", "10", CartInfo.LoadData);
});

//显示购物车信息
var CartInfo = {
    //提交购物车信息【作废】
    UploadDate: function () {
        var api_input = { "goodsList": g_type_cart.LocalCart().GoodsInfoForAdd, "channelId": g_const_ChannelID };
        var api_target = "com_cmall_familyhas_api_APiShopCartForCache";
        var s_api_input = JSON.stringify(api_input);
        var obj_data = { "api_input": s_api_input, "api_target": api_target, "api_token": "1" };
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
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //获取购物车信息【提交本地并获取服务端数据】
    LoadData: function () {
        CartInfo.SetIng = 0;

        var objcarts = [];
        if (g_type_cart.LocalCart()) {
            objcarts = g_type_cart.LocalCart().GoodsInfoForAdd;
        }
        CartInfo.checkLogin = UserLogin.LoginStatus;
        CartInfo.checkLoginname = UserLogin.LoginName;
        if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
            //登录后
            $("#btnLogin").hide();
        }
        var api_input = { "goodsList": objcarts, "channelId": g_const_ChannelID };
        var api_target = "com_cmall_familyhas_api_APiShopCartForCache";
        var s_api_input = JSON.stringify(api_input);
        var obj_data = { "api_input": s_api_input, "api_target": api_target, "api_token": (CartInfo.checkLogin == g_const_YesOrNo.YES ? "1" : "") };
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
                $("#divCartNull").show();
                CartInfo.ShowView();
                Message.Operate("", "divAlert");
                CartInfo.SetIng = 1;

            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },

    ShowView: function () {
        if (isEdit == 0) {
            $("#btnEdit").show();
            $("#btnFinish").hide();
            $("#divFootView").show();
            $("#divFootEdit").hide();
            // $("#btnClear").hide();
        }
        else {
            $("#btnEdit").hide();
            $("#btnFinish").show();
            $("#divFootView").hide();
            $("#divFootEdit").show();
            //  $("#btnClear").show();
        }

    },
    //设置页面信息
    SetCartList: function (msg) {
        $("#btnClear").hide();
        //g_type_cart.Clear();
        var goodsnum = 0;
        var goodsprice = 0.00;
        //是否全部选中
        var allsel = true;
        if (msg.acount_num > 0) {
            var divHtml = "";
            var divInvalid = "";
            var special_price = "";
            var special_price_manjian = "";
            var invalidnum = 0;
            var selectClass = "";
            $("#divTitle").html(msg.salesAdv);
            // var objcart = g_type_cart.LocalCart().GoodsInfoForAdd[i];
            $.each(msg.shoppingCartList, function (k, o) {
                divHtml += "<div class=\"ch-box\" >";
                if (o.event.tagname.length > 0) {
                    divHtml += "<h2 onclick=\"CartInfo.OpenFullCut('" + o.eventCode + "','" + o.start_time + "','" + o.end_time + "')\"><a><em>" + o.event.tagname + "</em><span class=\"content\">" + o.event.description + "</span>";
                    ////满减
                    //if (o.type == g_const_Act_Event_Type.ManJian) {
                    //    //判断是否需要凑单
                    //    if (o.flagAddOrder == g_const_FullCut_FlagAddOrder.Yes) {
                    //        divHtml += "<span class=\"go\">去凑单</span>";
                    //    }
                    //}
                    divHtml += "</a></h2>";
                }
                divHtml += "<ul>";


                $.each(o.goods, function (i, n) {
                    //objcart.product_code = n.product_code;
                    //objcart.sku_code = n.sku_code;
                    //objcart.sku_num = n.sku_num;
                    //objcart.chooseFlag = n.chooseFlag;
                    //g_type_cart.ADD(objcart, true);
                    special_price = "";
                    selectClass = "";
                    $.each(n.activitys, function (j, m) {
                        if (m.activity_name == "特价" || m.activity_name == "闪购") {
                            special_price = "<em>" + m.activity_name + "</em>";
                        }
                        else if (m.activity_name) {
                            special_price = "<em>" + m.activity_name + "</em>";
                        }
                    });
                    $.each(n.otherShow, function (j, m) {
                        //special_price = "<em>" + m + "</em>";
                    });

                    if (n.chooseFlag == "1") {
                        selectClass = "class=\"curr\"";
                    }
                    else {
                        selectClass = "";
                        allsel = false;
                    }
                    if (n.otherShow.length > 0) {
                        divHtml += "<li class=\"on\" style=\"\"><em style=\"\">" + n.otherShow[0] + "</em></li>";
                    }
                    if (isEdit == 0) {
                        divHtml += "<li id=\"liProduct_" + n.product_code + "_" + n.sku_code + "\" " + selectClass + ">";
                    }
                    else {
                        divHtml += "<li id=\"liProduct_" + n.product_code + "_" + n.sku_code + "\" " + selectClass + ">";
                    }
                    //单选独立区域
                    divHtml += "<b class=\"lf_btn\" onclick=\"CartInfo.SelectProduct('" + n.product_code + "','" + n.sku_code + "')\"></b>";
                    //3.9.4 从接口获取图片
                    if (n.labelsPic != "" && !(n.labelsPic == undefined)) {
                        divHtml += '<img class="d_add_ys" src="' + n.labelsPic + '" alt="" />';
                    }

                    divHtml += "<img src=\"" + g_GetPictrue(n.pic_url) + "\" alt=\"\">";
                    if (n.flag_stock == "0") {
                        divHtml += "<strong>库存不足</strong>";
                    }
                    divHtml += "<font>";
                    if (isEdit == 0) {
                        divHtml += "<b onclick=\"CartInfo.Load_Product('" + n.product_code + "')\">" + String.DelHtmlTag(n.sku_name) + "</b>";
                    }
                    else {
                        divHtml += " <label><i onclick=\"CartInfo.SetSkuNum('" + n.product_code + "','" + n.sku_code + "',-1)\">-</i><input readonly=\"readonly\" id=\"txtSkuNum_" + n.product_code + "_" + n.sku_code + "\" onkeyup=\"CartInfo.SetSkuNum('" + n.product_code + "','" + n.sku_code + "',0)\" type=\"tel\" value=\"" + n.sku_num + "\"><i onclick=\"CartInfo.SetSkuNum('" + n.product_code + "','" + n.sku_code + "',1)\">+</i></label>";
                    }
                    $.each(n.sku_property, function (j, m) {
                        divHtml += "<em>" + m.propertyKey + "：" + m.propertyValue + "</em>";
                    });
                    divHtml += "</font>";
                    divHtml += "<input type=\"hidden\" id=\"hidNum_" + n.product_code + "_" + n.sku_code + "\" value=\"" + n.sku_num + "\" />";
                    divHtml += "<span>￥" + n.sku_price + "<i>x" + n.sku_num + "</i>";
                    divHtml += special_price;
                    divHtml += "</span>";
                    ////降价提醒
                    //if (n.sub_price_title != "" && !(n.sub_price_title == undefined)) {
                    //    divHtml += "<b class='changePrice'>" + n.sub_price_title + "</b>";
                    //}
                    divHtml += "</li>";

                    divHtml += "<input type=\"hidden\" id=\"hidPrice_" + n.product_code + "_" + n.sku_code + "\" value=\"" + (n.sku_price * n.sku_num) + "\" />";
                    divHtml += "<input type=\"hidden\" id=\"hidlimit_" + n.product_code + "_" + n.sku_code + "\" value=\"" + n.limit_order_num + "\" />";
                    divHtml += "<input type=\"hidden\" id=\"hidPriceUnit_" + n.product_code + "_" + n.sku_code + "\" value=\"" + n.sku_price + "\" />";
                });
                divHtml += "</ul>";
                if (o.event.tagname.length > 0) {
                    divHtml += "<div class=\"bottom\"><span>小计：￥" + o.payMoney + "</span>立减：￥" + o.derateMoney + "</div>";
                }
                divHtml += "</div>";
            });
            $.each(msg.disableGoods, function (i, n) {
                selectClass = "class=\"curr\"";
                divInvalid += "<li id=\"liInvalid_" + n.product_code + "_" + n.sku_code + "\">";
                divInvalid += "<img src=\"" + n.pic_url + "\" alt=\"\">";
                divInvalid += "<font>";
                divInvalid += "<b>" + n.sku_name + "</b>";
                $.each(n.sku_property, function (j, m) {
                    divInvalid += "<em>" + m.propertyKey + "：" + m.propertyValue + "</em>";
                });
                divInvalid += "</font>";
                divInvalid += "<span>￥" + n.sku_price + "</span>";
                divInvalid += "</li>";
                divInvalid += "";
                invalidnum++;
            });

            $("#spinvalidnum").html(invalidnum);
            if (invalidnum > 0) {
                $("#h3_invalid").show();
                if (isEdit == 1) {
                    $("#btnClear").show();
                }
                $("#divCartInvalid li").find("img").each(function () {
                    //  grayscale($(this));
                });
            }
            else {
                $("#btnClear").hide();
            }
            $("#divCartList").html(divHtml);
            $("#divCartList").show();
            $("#divCartNull").hide();
            $("#divCartInvalid").html(divInvalid);

            //CartInfo.SetGoodsNum();
            $("#spEdit").show();
            $("#divCart").show();
            CartInfo.ShowView();
            if (invalidnum > 0) {
                $("#divCartInvalid li").find("img").each(function () {
                    //   grayscale($(this));
                });
            }
        }
        else {
            acount_num = false;
            isEdit = 0;
            CartInfo.ShowView();
            $("#divCartList").html("");
            $("#divCartNull").show();
            $("#divCart").hide();
            $("#btnClear").hide();
            $("#btnFinish").hide();
            $("#spEdit").hide();

        }

        //判断是否全选
        if (allsel) {
            if (isEdit == 0) {
                $("#lblAllSelView").prop("class", "curr");
            }
            else {
                $("#lblAllSelEdit").prop("class", "curr");
            }

        }
        else {
            if (isEdit == 0) {
                $("#lblAllSelView").removeClass("curr");
            }
            else {
                $("#lblAllSelEdit").removeClass("curr");
            }

        }

        selectNum = msg.chooseGoodsNum;
        $("#sp_total").html("(" + msg.chooseGoodsNum + ")");
        $("#sp_price").html(msg.allPayMoney);
        if (msg.allDerateMoney > 0) {
            $("#font_money").html("总计：￥" + msg.allNormalMoney + " 优惠：￥" + msg.allDerateMoney);
        }
        else {
            $("#font_money").html("总计：￥" + msg.allNormalMoney);
        }
        setTimeout("$(\"#div_scrolldown\").hide()", 1000);
        Message.Operate("", "divAlert");

        $("#btnSubmit_wait").hide();
        $("#btnSubmit").show();
        if (CartInfo.SetIng == 0) {
            CartInfo.SetIng = 1;
        }


    },
    //OpenFullCut: function (forwardType, forwardVal, activityCode, startTime, endTime) {
    OpenFullCut: function (activityCode, startTime, endTime) {
            PageUrlConfig.SetUrl();
        //if (forwardType == g_const_FullCut_Type.zhuanti) {
        //    //新专题页
        //    window.location.href = forwardVal + "?t=" + Math.random();
        //}
        //else if (forwardType == g_const_FullCut_Type.huodong) {
            //原有满减活动页
            window.location.href = g_const_PageURL.FullCut
                                        + "?t=" + Math.random()
                                        + "&activitycode=" + activityCode
                                        + "&begintime=" + startTime
                                        + "&endtime=" + endTime;
        //}
    },
    //设置/去除选中
    SelectProduct: function (product_code, sku_code) {
        if (CartInfo.SetIng == 0) {
            return;
        }
        $("#btnSubmit").hide();
        $("#btnSubmit_wait").show();

        //CartInfo.SetIng = 0;
        var pid = "#liProduct_" + product_code + "_" + sku_code;
        if ($(pid).attr("class") == "curr") {
            $(pid).attr("class", "");
            CartInfo.SetChooseFlag(product_code, sku_code, g_const_YesOrNo.NO.toString());
        }
        else {
            $(pid).attr("class", "curr");
            CartInfo.SetChooseFlag(product_code, sku_code, g_const_YesOrNo.YES.toString());
        }
        CartInfo.SetGoodsNum();
    },
    //设置全选
    SelectAll: function (obj) {
        if (CartInfo.SetIng == 0) {
            return;
        }
        //$("#btnSubmit").hide();
        //$("#btnSubmit_wait").show();

        //CartInfo.SetIng = 0;
        var objcarts = g_type_cart.LocalCart();
        if ($(obj).attr("class") == "curr") {
            $(obj).attr("class", "");
            $("#divCartList ul").find("li").each(function () {
                if (!($(this).attr("id") == undefined)) {
                    $(this).attr("class", "");
                }
            });
            for (var i = 0; i < objcarts.GoodsInfoForAdd.length; i++) {
                objcarts.GoodsInfoForAdd[i].chooseFlag = "0";
            }
        }
        else {
            $(obj).attr("class", "curr");
            $("#divCartList ul").find("li").each(function () {
                if (!($(this).attr("id") == undefined)) {
                    $(this).attr("class", "curr");
                }
            });
            for (var i = 0; i < objcarts.GoodsInfoForAdd.length; i++) {
                objcarts.GoodsInfoForAdd[i].chooseFlag = "1";
            }
        }
        localStorage[g_const_localStorage.Cart] = JSON.stringify(objcarts);
        CartInfo.SetGoodsNum();
    },
    //设置缓存选中
    SetChooseFlag: function (product_code, sku_code, choose_flag) {
        var objcarts = g_type_cart.LocalCart();
        for (var i = 0; i < objcarts.GoodsInfoForAdd.length; i++) {
            var objcart = objcarts.GoodsInfoForAdd[i];
            if (objcart.product_code == product_code && objcart.sku_code == sku_code) {
                objcarts.GoodsInfoForAdd[i].chooseFlag = choose_flag;
            }
        }
        localStorage[g_const_localStorage.Cart] = JSON.stringify(objcarts);
    },
    //设置缓存选中
    SetCartSkuNum: function (product_code, sku_code, sku_num) {
        var objcarts = g_type_cart.LocalCart();
        for (var i = 0; i < objcarts.GoodsInfoForAdd.length; i++) {
            var objcart = objcarts.GoodsInfoForAdd[i];
            if (objcart.product_code == product_code && objcart.sku_code == sku_code) {
                objcarts.GoodsInfoForAdd[i].sku_num = sku_num;
            }
        }
        localStorage[g_const_localStorage.Cart] = JSON.stringify(objcarts);
    },
    //设置数量信息
    SetGoodsNum: function () {
        if (CartInfo.SetIng == 1) {
            //选中同步服务器
            CartInfo.LoadData();
            return;
        }

        //由于本地无法计算满减，所以所有操作都需要提交服务器
        //var goodrecordnum = 0;
        //var goodsnum = 0;
        //var goodsprice = 0.00;
        //var curr_product_code = "";
        //var curr_sku_code = "";
        //var not_sp_li_num = 0;//不是商品的LI【目前发现有赠品标志】
        //$("#divCartList ul").find("li").each(function () {
        //    if (!($(this).attr("id") == undefined)) {
        //        if ($(this).attr("class") == "curr") {
        //            goodrecordnum++;
        //            curr_product_code = $(this).attr("id").split('_')[1];
        //            curr_sku_code = $(this).attr("id").split('_')[2];
        //            goodsnum += parseInt($("#hidNum_" + curr_product_code + "_" + curr_sku_code).val());
        //            goodsprice += parseFloat($("#hidPrice_" + curr_product_code + "_" + curr_sku_code).val(), 10);

        //        }
        //    }
        //    else {
        //        not_sp_li_num++;
        //    }
        //});

        //goodrecordnum = goodrecordnum+ not_sp_li_num;

        //$("#sp_total").html(goodsnum);
        //$("#sp_price").html(goodsprice.toFixed(2));
        //if (goodrecordnum == $("#divCartList ul").find("li").length) {
        //    $("#lblAllSelView").attr("class", "curr");
        //    $("#lblAllSelEdit").attr("class", "curr");
        //}
        //else {
        //    $("#lblAllSelView").attr("class", "");
        //    $("#lblAllSelEdit").attr("class", "");
        //}
        //if (goodsnum == 0) {
        //    $("#btnSubmit").attr("class", "curr");
        //    $("#btnDel").attr("class", "curr");
        //    $('#btnSubmit').attr('disabled', 'disabled');
        //    $('#btnDel').attr('disabled', 'disabled');

        //}
        //else {
        //    $("#btnSubmit").attr("class", "");
        //    $("#btnDel").attr("class", "");
        //    $('#btnSubmit').attr('disabled', false);
        //    $('#btnDel').attr('disabled', false);
        //}
        //selectNum = goodsnum;

        //$("#btnSubmit").show();
        //$("#btnSubmit_wait").hide();

    },
    SetIng: 1,
    //修改购物车数量
    SetSkuNum: function (product_code, sku_code, num) {
        var pid = "#txtSkuNum_" + product_code + "_" + sku_code;
        if (!isInteger($(pid).val())) {
            $(pid).val("1")
        }
        var result = parseInt($(pid).val()) + num;
        if (result < 1) {
            result = 1;
        }
        if (result > 99) {
            result = 99;
        }
        $(pid).val(result);
        CartInfo.SetCartSkuNum(product_code, sku_code, result);
    },
    checkLogin: 0,
    checkLoginname: "",
    //删除选择
    DeleteSelect: function () {
        Message.ShowLoading(g_const_API_Message["100043"], "divAlert");
        var del_product_code = "";
        var del_sku_code = "";
        var del_list = [];

        $("#btnFinish").hide();
        if (CartInfo.checkLogin == 1) {
            //登录
            $("#divCartList ul").find("li").each(function () {
                if ($(this).attr("class") == "curr") {
                    del_product_code = $(this).attr("id").split('_')[1];
                    del_sku_code = $(this).attr("id").split('_')[2];
                    del_list.push([del_product_code, del_sku_code]);
                }
            });
            g_type_cart.BatchRemoveWithCloud(del_list);
        }
        else {
            //未登录
            $("#divCartList ul").find("li").each(function () {
                if ($(this).attr("class") == "curr") {
                    del_product_code = $(this).attr("id").split('_')[1];
                    del_sku_code = $(this).attr("id").split('_')[2];
                    g_type_cart.Remove(del_product_code, del_sku_code);
                }
            });
        }
        CartInfo.LoadData();
    },

    EditSelect: function () {
        var del_product_code = "";
        var del_sku_code = "";
        var sku_num = 0;
        var pid = "";
        for (var i = 0; i < g_type_cart.LocalCart().GoodsInfoForAdd.length; i++) {
            var objcart = g_type_cart.LocalCart().GoodsInfoForAdd[i];
            pid = "#txtSkuNum_" + objcart.product_code + "_" + objcart.sku_code;
            if (!isInteger($(pid).val())) {
                sku_num = 1;
            }
            sku_num = parseInt($(pid).val());
            objcart.sku_num = sku_num;
            g_type_cart.ADD(objcart, true);
        }
        if (CartInfo.checkLogin == 1) {
            g_type_cart.Upload();
        }
    },
    //提交选择
    SubmitSelect: function () {

        localStorage[g_const_localStorage.OrderConfirm] = "";
        var sub_product_code = "";
        var sub_sku_code = "";
        var orderconfirmlist = "";
        var orderpricelist = "";
        var limitordernum = 0;
        var unitprice = 0;
        var objcartfull = [];
        $("#divCartList ul").find("li").each(function () {
            if ($(this).attr("class") == "curr") {
                sub_product_code = $(this).attr("id").split('_')[1];
                sub_sku_code = $(this).attr("id").split('_')[2];
                limitordernum = parseInt($("#hidlimit_" + sub_product_code + "_" + sub_sku_code).val());
                unitprice = parseFloat($("#hidPriceUnit_" + sub_product_code + "_" + sub_sku_code).val())
                for (var i = 0; i < g_type_cart.LocalCart().GoodsInfoForAdd.length; i++) {
                    var objcart = g_type_cart.LocalCart().GoodsInfoForAdd[i];
                    if (objcart.product_code == sub_product_code && objcart.sku_code == sub_sku_code) {
                        if (limitordernum < objcart.sku_num) {
                            ShowMesaage("[" + objcart.sku_name + "]" + g_const_API_Message["100039"]);
                            return false;
                        }
                        orderconfirmlist += JSON.stringify(objcart) + ",";
                        orderpricelist += "{ \"sku_price\": " + unitprice + ", \"product_code\": \"" + objcart.product_code + "\", \"sku_code\": \"" + objcart.sku_code + "\" },";
                    }
                }
                for (var i = 0; i < g_type_cart.LocalCart().GoodsInfoForAdd.length; i++) {
                    var objcart = g_type_cart.LocalCart().GoodsInfoForAdd[i];
                    if (objcart.product_code == sub_product_code && objcart.sku_code == sub_sku_code) {
                        objcartfull.push(g_type_cart.LocalCart().GoodsInfoForAdd[i]);
                    }
                }
            }
        });
        localStorage[g_const_localStorage.OrderConfirm] = "{ \"GoodsInfoForAdd\": [" + orderconfirmlist.substr(0, orderconfirmlist.length - 1) + "] }";
        localStorage[g_const_localStorage.OrderPrice] = "{ \"GoodsInfoPrice\": [" + orderpricelist.substr(0, orderpricelist.length - 1) + "] }";
        localStorage[g_const_localStorage.GoodsInfo] = JSON.stringify(objcartfull);
        //if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
        //    //Message.ShowToPage(g_const_API_Message[100001], g_const_PageURL.Login, 2000, "", g_const_PageURL.OrderConfirm);
        //    Message.ShowToPage("", g_const_PageURL.Login, 2000, "", g_const_PageURL.OrderConfirm);
        //    return;
        //}
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.OrderConfirm + "?t=" + Math.random();
        // localStorage[g_const_localStorage.GoodsInfo] = JSON.stringify(objcartfull);
    },
    //清除失效商品
    DeleteInvalid: function () {
        var del_product_code = "";
        var del_sku_code = "";
        var del_list = [];
        $("#divCartInvalid").find("li").each(function () {
            del_product_code = $(this).attr("id").split('_')[1];
            del_sku_code = $(this).attr("id").split('_')[2];
            del_list.push([del_product_code, del_sku_code]);
        });
        g_type_cart.BatchRemoveWithCloud(del_list);
        CartInfo.LoadData();
        $("#btnClear").hide();
        $("#h3_invalid").hide();
    },
    //读取商品信息
    Load_Product: function (pid) {
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.Product_Detail + "?pid=" + pid + "&t=" + Math.random();
    }
}