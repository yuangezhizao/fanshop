//滑动屏幕加载数据
var _stop = true;

$(document).ready(function () {
    //返回
    $(".go-back").on("tap", function () {
        //alert("后退");
        //history.back();
        //window.location.href = g_const_PageURL.AccountIndex;
        //window.location.replace(g_const_PageURL.AccountIndex + "?t=" + Math.random());
        window.location.replace(PageUrlConfig.BackTo());

    });
    //兑换优惠卷
    $(".back-right").on("tap", function () {
        window.location.href = g_const_PageURL.MyCoupon_DH + "?t=" + Math.random();
        //window.location.replace(g_const_PageURL.MyCoupon_DH);

    });
    

    //未使用优惠卷
    $("#li_weishiyong").on("tap", function () {
        if (MyCoupon.IsFinish) {
            MyCoupon.IsFinish = false;
            $("#hid_couponLocation").val("0");

            $("#li_lishi").removeClass("curr");
            $("#li_weishiyong").attr("class", "curr");

            $("#section_weishiyong").show();
            $("#section_lishi").hide();

            if (parseInt($("#hid_pagenum_weishiyong").val()) == 1) {
                //我的优惠卷
                MyCoupon.GetCouponCodes();
            }
        }
        else {
            ShowMesaage("网速太慢了，请稍后重试");
        }
    });
    //历史优惠卷
    $("#li_lishi").on("tap", function () {
        if (MyCoupon.IsFinish) {
            MyCoupon.IsFinish = false;
            $("#hid_couponLocation").val("1");

            $("#li_weishiyong").removeClass("curr");
            $("#li_lishi").attr("class", "curr");

            $("#section_weishiyong").hide();
            $("#section_lishi").show();


            if (parseInt($("#hid_pagenum_lishi").val()) == 1) {
                //我的优惠卷
                MyCoupon.GetCouponCodes();
            }
        }
        else {
            ShowMesaage("网速太慢了，请稍后重试");
        }
    });
    //注册的滚动事件
    $(window).scroll(scrollHandler);

    //我的优惠卷
    MyCoupon.GetCouponCodes();
    //下拉刷新监听
    ScrollReload.Listen("ScrollArea", "div_scrolldown", "MyCoupon", "6", MyCoupon.ScollDownCallBack);


});

//向上滚动加载下一页
var scrollHandler = function () {
    myScroll = $(window).scrollTop();
    //隐藏下拉回调层
    $("#div_scrolldown").hide();

    var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
    if ($(document).height() <= totalheight) {
        if (_stop == true) {
            var jiazai = false;

            var _PageNo = "1";
            if ($("#hid_couponLocation").val() == "0") {
                _PageNo = $("#hid_pagenum_weishiyong").val();
            }
            else {
                _PageNo = $("#hid_pagenum_lishi").val();
            }

            if ($("#hid_couponLocation").val() == g_const_couponLocation.NoUse) {
                //未使用区域
                if ((parseInt(_PageNo) + 1) <= parseInt($("#hid_sumpage_weishiyong").val())) {
                    jiazai = true;
                }
            }
            else {
                //历史区远
                if ((parseInt(_PageNo) + 1) <= parseInt($("#hid_sumpage_lishi").val())) {
                    jiazai = true;
                }
            }

            if (jiazai) {
                _stop = false;
                _PageNo = (parseInt(_PageNo) + 1).toString();

                if ($("#hid_couponLocation").val() == "0") {
                    $("#hid_pagenum_weishiyong").val(_PageNo);
                }
                else {
                    $("#hid_pagenum_lishi").val(_PageNo);
                }
                //加载多页
                MyCoupon.GetCouponCodes();

                ////显示“至顶部”
                //$('.ch-up').show();
                _stop = true;
            }
        }
    }
};

var MyCoupon = {
    /*接口完成标志*/
    IsFinish:true,
    /*可用优惠劵使用查询*/
    api_target: "com_cmall_familyhas_api_ApiGetAllCoupon",
    /*输入参数*/
    api_input: { "couponLocation": 0, "pageNum": 1, "channelId": "" },
    /*接口响应对象*/
    api_response: {},
    /*下滑重新加载*/
    ScollDownCallBack: function () {
        //赋值
        if ($("#hid_couponLocation").val() == "0") {
            $("#hid_pagenum_weishiyong").val("1");
        }
        else {
            $("#hid_pagenum_lishi").val("1");
        }

        MyCoupon.api_input.couponLocation = $("#hid_couponLocation").val();
        MyCoupon.api_input.pageNum = "1";
        MyCoupon.api_input.channelId = g_const_ChannelID;

        var s_api_input = JSON.stringify(MyCoupon.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": MyCoupon.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            //CouponCodes.api_response = msg;
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //Session失效，重新登录，传递回调地址
                    UserRELogin.login(g_const_PageURL.MyCoupon)
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                if (msg.pagination == 0) {
                    var showStr = "";
                    if ($("#hid_couponLocation").val() == g_const_couponLocation.NoUse) {
                        //无未使用优惠卷
                        showStr = "<article class=\"no-data\"><p>暂无优惠券~</p></article>";
                        $("#section_weishiyong").html(showStr);
                    }
                    else {
                        //无历史优惠卷
                        showStr = "<article class=\"no-data\"><p>暂无历史优惠券~</p></article>";
                        $("#section_lishi").html(showStr);
                    }
                }
                else {
                    var showStr = MyCoupon.Load_Result(msg);
                    if ($("#hid_couponLocation").val() == "0") {
                        //未使用区域
                        if (parseInt($("#hid_pagenum_weishiyong").val()) > 1) {
                            $("#ul_weishiyong").append(showStr);
                        }
                        else {
                            $("#ul_weishiyong").html(showStr);
                        }
                    }
                    else {
                        //历史区域
                        if (parseInt($("#hid_pagenum_lishi").val()) > 1) {
                            $("#ul_lishi").append(showStr);
                        }
                        else {
                            $("#ul_lishi").html(showStr);
                        }
                    }
                }
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
            //隐藏下拉层
            $("#div_scrolldown").hide();
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    /*获取优惠劵*/
    GetCouponCodes: function () {
        //赋值
        MyCoupon.api_input.couponLocation = $("#hid_couponLocation").val();
        if ($("#hid_couponLocation").val() == "0") {
            MyCoupon.api_input.pageNum = $("#hid_pagenum_weishiyong").val();
        }
        else {
            MyCoupon.api_input.pageNum = $("#hid_pagenum_lishi").val();
        }

        MyCoupon.api_input.channelId = g_const_ChannelID;
        var s_api_input = JSON.stringify(MyCoupon.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": MyCoupon.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            //CouponCodes.api_response = msg;
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //Session失效，重新登录，传递回调地址
                    UserRELogin.login(g_const_PageURL.MyCoupon)
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    MyCoupon.IsFinish = true;
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                

                if (msg.pagination == 0) {
                    var showStr = "";
                    if ($("#hid_couponLocation").val() == g_const_couponLocation.NoUse) {
                        //无未使用优惠卷
                        showStr = "<article class=\"no-data\"><p>暂无优惠券~</p></article>";
                        $("#section_weishiyong").html(showStr);
                        $("#section_weishiyong").show();
                        $("#section_lishi").hide();

                        $("#hid_sumpage_weishiyong").val("0");
                        MyCoupon.IsFinish = true;
                    }
                    else{
                        //无历史优惠卷
                        showStr = "<article class=\"no-data\"><p>暂无历史优惠券~</p></article>";
                        $("#section_lishi").html(showStr);
                        $("#section_weishiyong").hide();
                        $("#section_lishi").show();
                        $("#hid_sumpage_lishi").val("0");
                        MyCoupon.IsFinish = true;

                    }
                }
                else{
                    var showStr = MyCoupon.Load_Result(msg);
                    if ($("#hid_couponLocation").val() == g_const_couponLocation.NoUse) {
                        $("#hid_sumpage_weishiyong").val(msg.pagination);

                        //未使用区域
                        if (parseInt($("#hid_pagenum_weishiyong").val()) > 1) {
                            $("#ul_weishiyong").append(showStr);
                        }
                        else {
                            $("#ul_weishiyong").html(showStr);
                        }
                        $("#section_weishiyong").show();
                        $("#section_lishi").hide();

                    }
                    else {
                        $("#hid_sumpage_lishi").val(msg.pagination);

                        //历史区域
                        if (parseInt($("#hid_pagenum_lishi").val()) > 1) {
                            $("#ul_lishi").append(showStr);
                        }
                        else {
                            $("#ul_lishi").html(showStr);
                        }
                        $("#section_weishiyong").hide();
                        $("#section_lishi").show();

                    }
                    MyCoupon.IsFinish = true;
                }
            }
            else {
                ShowMesaage(msg.resultMessage);
                MyCoupon.IsFinish = true;
            }
        });
        request.fail(function (jqXHR, textStatus) {
            MyCoupon.IsFinish = true;
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //接口返回成功后的处理
    Load_Result: function (resultlist) {
        var wlxx = "";
        var kk = 0;
        var li_css = "";
        $.each(resultlist.couponInfoList, function (i, n) {
            var sh = n.limitExplain==""?"none":"";
            var tt = 1;

            //判断优惠券是否可以跳转
            var actionValue = "";
            if (n.actionType == g_const_coupon_actionType.PRODUCTDETAIL || n.actionType == g_const_coupon_actionType.WAP) {
                actionValue = n.actionValue;
            }

            var css = "coupon-info clearfix";
            //历史优惠卷状态样式
            if ($("#hid_couponLocation").val()=="1") {
                if (n.status == g_Coupon_Status.Used) {
                    //已使用
                    css = "coupon-info apply clearfix";
                    actionValue = "";
                }
                else {
                    //过期
                    css = "coupon-info expired clearfix";
                    actionValue = "";
                }
            }

            if ($("#hid_couponLocation").val() == g_const_couponLocation.Used) {
                li_css = "class=\"coupon-history\"";
                actionValue = "";
            }

            

            wlxx += "<li " + li_css + ">"
					+ "<div class=\"" + css + "\" onclick=\"MyCoupon.GoTo('"+n.actionType+"','" + actionValue + "')\">"
						+ "<div class=\"coupon-price\">"
							+ "<span><i>¥</i>" + n.initialMoney.toFixed(0) + "</span>";
            if (parseInt(n.limitMoney) == 0) {
                wlxx += "<em>不限</em>";
            }
            else {
                wlxx += "<em>满" + n.limitMoney.toFixed(0) + "元可用</em>";
            }

            var useLimit = n.useLimit;
            //限平台
            if (n.channelLimit=="1") {
                useLimit += "<lable class=\"xianpingtai\">微信专享</lable>";
            }

			wlxx += "</div>"
						+ "<h1 class=\"coupon-txt\">" + useLimit + "</h1>"
						+ "<p class=\"coupon-time\">"
							+ "<span>使用期限：</span>" + getFormatDate(n.startTime, "yyyy-MM-dd") + "~" + getFormatDate(n.endTime, "yyyy-MM-dd")
						+ "</p>"
					+ "</div>"
					+ "<div id=\"" + $("#hid_couponLocation").val() + "_" + kk.toString() + "\" class=\"coupon-caption\" onclick=\"MyCoupon.ShowCouponDIV('" + $("#hid_couponLocation").val() + "_" + kk.toString() + "')\" style=\"display:"+sh+"\">"
						+ "<a class=\"coupon-btn\" id=\"aa_" + $("#hid_couponLocation").val() + "_" + kk.toString() + "\"></a>"
						+ "<p id=\"p_" + $("#hid_couponLocation").val() + "_" + kk.toString() + "\" style=\"display:none;\">" + n.limitExplain.replace("\n", "<br>") + "</p>"
					+"</div>"
				+"</li>";
            kk+=1;
        });

        return wlxx
    },
    /*优惠卷展开*/
    ShowCouponDIV: function (id) {
        if ($("#" + id).attr("class") == "coupon-caption") {
            //展开说明层
            $("#" + id).attr("class", "");
            $("#aa_" + id).attr("class", "coupon-btn curr");
            //$("#p_" + id).show();
            $("#p_" + id).attr("style","");
            

        }
        else {
            //隐藏说明层
            $("#" + id).attr("class", "coupon-caption");
            $("#aa_" + id).attr("class", "coupon-btn");
            //$("#p_" + id).hide();
            $("#p_" + id).attr("style", "display:none;");
        }
    },
    /*优惠券跳转*/
    GoTo: function (actionType, actionValue) {
        if (actionValue != "") {
            if (actionType == g_const_coupon_actionType.PRODUCTDETAIL) {
                PageUrlConfig.SetUrl(g_const_PageURL.MyCoupon);
                //跳转商品详情
                window.location.href = "/Product_Detail.html?pid=" + actionValue + "&_r=" + Math.random().toString();
            }
            else if (actionType == g_const_coupon_actionType.WAP) {
                PageUrlConfig.SetUrl(g_const_PageURL.MyCoupon);
                //跳转WAP页
                window.location.href = actionValue;
            }
        }
    },
}

