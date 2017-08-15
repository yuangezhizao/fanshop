var login = "";
$(document).ready(function () {
    //保存需要返回的来源页
    //if (document.referrer != "" && document.referrer.indexOf("login") < 0 && document.referrer.indexOf("Register") < 0) {
    //    PageUrlConfig.SetUrl(document.referrer);
    //    localStorage.setItem(g_const_localStorage.BackURL, document.referrer)

    //}
    //else {
    //    localStorage.setItem(g_const_localStorage.BackURL, g_const_PageURL.AccountIndex)
    //}
    UserLogin.Check(Account.LoadInfo);

    if (IsDebug) {
        //清空本地缓存
        $(".copyright").on("click", function (e) {
            localStorage.clear();
            UserInfo.UploadCart();
           // alert("清空localStorage成功");
        });
    }
    $("#btnback").click(function () {
        //history.back();
        //location = g_const_PageURL.Index;//PageUrlConfig.BackTo();
        // window.location.replace(g_const_PageURL.Index);
        window.location.replace(PageUrlConfig.BackTo());
    });

    $("#atcHead").click(function () {
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            //location = g_const_PageURL.Login + "?t=" + Math.random();
            window.location.href = g_const_PageURL.Login + "?t=" + Math.random();
        }
        else {
            //location = g_const_PageURL.MyAccount + "?t=" + Math.random();
            window.location.href = g_const_PageURL.MyAccount + "?t=" + Math.random();

        }
    });

    $("#btnloginout").click(function () {
        if (localStorage.getItem(g_const_localStorage.IsnewReg) == 1) {
            Message.ShowConfirm("确定不修改密码直接退出吗？", "设置密码后可以直接提现哦", "divAlert", "确定", "UserInfo.UploadCart", "设置密码", "Account.SetPassword");
        }
        else {
            Message.ShowConfirm("确定要退出登录吗？", "", "divAlert", "确定", "UserInfo.UploadCart", "取消");
        }
        
    });
   

    
    $("#MyCouponUrl").on("click", function (e) {
        PageUrlConfig.SetUrl();
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            //去登录 
            UserRELogin.login(g_const_PageURL.MyCoupon + "?t=" + Math.random());
            return;
        }
        else {
            //location = g_const_PageURL.MyCoupon + "?t=" + Math.random();
            window.location.href = g_const_PageURL.MyCoupon + "?t=" + Math.random();

        }

    });
    $("#MyCollectionUrl").on("click", function (e) {
        PageUrlConfig.SetUrl();
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            //去登录
            UserRELogin.login(g_const_PageURL.MyCollection + "?t=" + Math.random());
            return;
        }
        else {
            //location = g_const_PageURL.MyCollection + "?t=" + Math.random();
            window.location.href = g_const_PageURL.MyCollection + "?t=" + Math.random();

        }
    });
    $("#MyViewHistoryUrl").on("click", function (e) {
        PageUrlConfig.SetUrl();
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            //去登录
            UserRELogin.login(g_const_PageURL.MyViewHistory + "?t=" + Math.random());
            return;
        }
        else {
            //location = g_const_PageURL.MyViewHistory + "?t=" + Math.random();
            window.location.href = g_const_PageURL.MyViewHistory + "?t=" + Math.random();

        }
    });
    $("#Feedback_IndexUrl").on("click", function (e) {
        PageUrlConfig.SetUrl();
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            //去登录
            UserRELogin.login(g_const_PageURL.Feedback_Index + "?t=" + Math.random());
            return;
        }
        else {
            //location = g_const_PageURL.Feedback_Index + "?t=" + Math.random();
            window.location.href = g_const_PageURL.Feedback_Index + "?t=" + Math.random();

        }
    });

    //我的订单
    $("#MyOrder_List_All").on("click", function (e) {
        PageUrlConfig.SetUrl();
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            //去登录
            UserRELogin.login(g_const_PageURL.MyOrder_List + "?paytype=ALL" + "&t=" + Math.random());
            return;
        }
        else {
            //location = g_const_PageURL.MyOrder_List + "?paytype=ALL" + "&t=" + Math.random();
            window.location.href = g_const_PageURL.MyOrder_List + "?paytype=ALL" + "&t=" + Math.random();

        }
    });
    $("#MyOrder_List_DFK").on("click", function (e) {
        PageUrlConfig.SetUrl();
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            //去登录
            UserRELogin.login(g_const_PageURL.MyOrder_List + "?paytype=DFK" + "&t=" + Math.random());
            return;
        }
        else {
            //location = g_const_PageURL.MyOrder_List + "?paytype=DFK" + "&t=" + Math.random();
            window.location.href = g_const_PageURL.MyOrder_List + "?paytype=DFK" + "&t=" + Math.random();

        }
    });

    $("#MyOrder_List_DFH").on("click", function (e) {
        PageUrlConfig.SetUrl();
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            //去登录
            UserRELogin.login(g_const_PageURL.MyOrder_List + "?paytype=DFH" + "&t=" + Math.random());
            return;
        }
        else {
            //location = g_const_PageURL.MyOrder_List + "?paytype=DFH" + "&t=" + Math.random();
            window.location.href = g_const_PageURL.MyOrder_List + "?paytype=DFH" + "&t=" + Math.random();

        }
    });
    $("#MyOrder_List_DSH").on("click", function (e) {
        PageUrlConfig.SetUrl();
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            //去登录
            UserRELogin.login(g_const_PageURL.MyOrder_List + "?paytype=DSH" + "&t=" + Math.random());
            return;
        }
        else {
            //location = g_const_PageURL.MyOrder_List + "?paytype=DSH" + "&t=" + Math.random();
            window.location.href = g_const_PageURL.MyOrder_List + "?paytype=DSH" + "&t=" + Math.random();

        }
    });
    $("#MyOrder_List_JYCG").on("click", function (e) {
        PageUrlConfig.SetUrl();
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            //去登录
            UserRELogin.login(g_const_PageURL.MyOrder_List + "?paytype=JYCG" + "&t=" + Math.random());
            return;
        }
        else {
            //location = g_const_PageURL.MyOrder_List + "?paytype=JYCG" + "&t=" + Math.random();
            window.location.href = g_const_PageURL.MyOrder_List + "?paytype=JYCG" + "&t=" + Math.random();

        }
    });

    //退款售后列表--3.9.4
    $("#MyOrder_List_TKSH").on("click", function (e) {
        PageUrlConfig.SetUrl();
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            //去登录
            UserRELogin.login(g_const_PageURL.MyTKSH_List + "?t=" + Math.random());
            return;
        }
        else {
            //location = g_const_PageURL.MyOrder_List + "?paytype=JYCG" + "&t=" + Math.random();
            window.location.href = g_const_PageURL.MyTKSH_List + "?paytype=TKSH" + "&t=" + Math.random();

        }
    });



});

function OpenApp() {

    var ua = navigator.userAgent.toLowerCase();
    //增加收集跳转应用宝点击数  开始
    var leixing = "web";
    if (ua.indexOf("micromessenger") > 0 || ua.match(/micromessenger/i) == "micromessenger") {
        //微信
        leixing = "weixin";
    }
    else if (ua.indexOf("weibo") > 0 || ua.match(/micromessenger/i) == "weibo") {
        //微博
        leixing = "weibo";
    }
    else if (ua.indexOf("qq") > 0 || ua.indexOf("QQ") > 0) {
        //QQ
        leixing = "qq";
    }

    //增加收集跳转应用宝点击数  开始
    var ILData_group = "||";
    try {
        //搜狐接口获得客户端IP 
        var ILData_group = returnCitySN["cid"] + "|" + returnCitySN["cip"] + "|" + returnCitySN["cname"] //城市ID+“|”+IP+“|”+所在地名称;
    } catch (e) { }
    ILData_group = ILData_group + "|" + leixing;
    
    try {
        var source = window.location.href;
        var clienttype = "web";
        //var ua = navigator.userAgent.toLowerCase();

        if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
            clienttype = "ios";
        }
        else if (/android/i.test(navigator.userAgent)) {
            clienttype = "android";
        }
        SaveClickNum.save(source, clienttype, ILData_group);
    } catch (e) { }

    //增加收集跳转应用宝点击数  结束


    if (/android/i.test(navigator.userAgent)) {

        var openUrl = window.location.search;
        try {
            openUrl = openUrl.substring(1, openUrl.length);
            openUrl = openUrl.substring(7);
        } catch (e) { }

        //var downloadurl = 'http://www.ichsy.cn/apps/?from=singlemessage&isappinstalled=1';
        //window.location = "huijiayou://huijiayou.com?" + openUrl + "#Intent;scheme=http;package=com.jiayou.qianheshengyun.app;end";//打开某手机上的某个app应用
        //window.location = "http://a.app.qq.com/o/simple.jsp?pkgname=com.jiayou.qianheshengyun.app&g_f=991850";

        the_href="http://a.app.qq.com/o/simple.jsp?pkgname=com.jiayou.qianheshengyun.app&g_f=991850";
        setTimeout(function () {
            //window.location = the_href;//如果超时就跳转到app下载页
            window.location.href = the_href;

        }, 500);
    }
    else if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
        //// 否则打开a标签的href链接
        //var ifr = document.createElement('iframe');
        ////ifr.src = 'itms-apps://itunes.apple.com/app/hui-jia-you.-wei-gong-she/id641952456?mt=8';
        //ifr.src = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.jiayou.qianheshengyun.app&g_f=991850';
        
        //ifr.style.display = 'none';
        //document.body.appendChild(ifr);
        //window.setTimeout(function () {
        //    document.body.removeChild(ifr);
        //}, 500)

        //location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.jiayou.qianheshengyun.app&g_f=991850';
        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.jiayou.qianheshengyun.app&g_f=991850';

    }
    else {
        //location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.jiayou.qianheshengyun.app&g_f=991850';
        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.jiayou.qianheshengyun.app&g_f=991850';

    }

}

var Account = {
    LoadInfo: function () {
        var body = "";
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            $("#atcHead").attr("class", "portrait-hd");
            body += "<p class=\"user-index-login\">登录/注册</p>";
            $("#divUser").html(body);
            $("#btnloginout").hide();
        }
        else {
            $("#atcHead").attr("class", "portrait-hd user-sudcess");
            MemberInfo.GetList();
            
            OrderNumber.GetList();
            //微公社余额
            //IchsyInfo.GetMoney();

            //if (!IsInWeiXin.check()) {
            $("#btnloginout").show();
            //}
            //else {
            //    $("#btnloginout").hide();
            //}

            //判断是否有新的售后
            MyTKSH_List.GetList(1);
        }
        Message.Operate('', "divAlert");
    },
    SetPassword: function () {
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.ResetPassword+ "?t=" + Math.random();
    }
};
var MemberInfo = {
    api_target: "com_cmall_familyhas_api_ApiMemberInfoCf",
    api_input: {},
    api_response: {},
    GetList: function () {
        var s_api_input = JSON.stringify(MemberInfo.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": MemberInfo.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL_User;//g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {

            if (msg.resultCode == g_const_Success_Code) {
                MemberInfo.Load_Result(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (result) {
        var body = "";
        if (result.nickName.length>0) {
            body += "<p class=\"user-index-login\">Hi, " + result.nickName + "</p>";
        }
        else {
            body += "<p class=\"user-index-login\">Hi, " + (UserLogin.LoginName.substr(0, 3) + "****" + UserLogin.LoginName.substr(7, 4)) + "</p>";
        }
        if (result.headPhoto.length > 0) {
            $(".user-portrait").attr("style", "background:url(" + result.headPhoto + ");background-size: 100%;");
        }
        body += "<p class=\"user-edit-address\">修改密码、收货地址</p>";
        $("#divUser").html(body);
    },
}

var OrderNumber = {
    api_target: "com_cmall_familyhas_api_ApiOrderNumber",
    api_input: { "version": 1.0, "channelId": "" },
    GetList: function () {
        OrderNumber.api_input.channelId = g_const_ChannelID;
        var s_api_input = JSON.stringify(OrderNumber.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": OrderNumber.api_target, "api_token": 1 };
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
                OrderNumber.Load_List(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    SetNumber: function (count) {
        if (count>99) {
            return "99+";
        }
        else {
            return count;
        }
    },
    Load_List: function (msg) {
        if (msg.couponCount>0) {
            $("#divCouponCount").html("<em>" + msg.couponCount + " 张</em>");
        }
        else {
            $("#divCouponCount").html("<em>暂无优惠券</em>");
        }
        $.each(msg.list, function (i, n) {
            switch (n.orderStatus) {
                case g_const_orderStatus.DFK:
                    if (n.number>0) {
                        $("#divDFK").html("<em>" + OrderNumber.SetNumber(n.number) + "</em>");
                    }
                    break;
                case g_const_orderStatus.DFH:
                    if (n.number>0) {
                        $("#divDFH").html("<em>" + OrderNumber.SetNumber(n.number) + "</em>");
                    }
                    break;
                case g_const_orderStatus.DSH:
                    if (n.number>0) {
                        $("#divYFH").html("<em>" + OrderNumber.SetNumber(n.number) + "</em>");
                    }
                    break;
                case g_const_orderStatus.JYCG:
                    if (n.number>0) {
                        $("#divJYCG").html("<em>" + OrderNumber.SetNumber(n.number) + "</em>");
                    }
                    break;
            }
        });
        
    },

};

var IchsyInfo = {
    api_target: "com_cmall_groupcenter_account_api_ApiAccountByMobile",
    api_input: { "mobile": "" },
    GetMoney: function () {
        IchsyInfo.api_input.mobile = UserLogin.LoginName;
        var s_api_input = JSON.stringify(IchsyInfo.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": IchsyInfo.api_target, "api_token": 1 };
        var purl = g_Group_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultCode == g_const_Success_Code) {
                IchsyInfo.Load_List(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_List: function (msg) {
        $("#divIchsyMoney").html("<em>￥" + msg.withdrawMoney + "</em>");
    },

};


var UserInfo = {
    UploadCart: function () {
        //退出登录中
        $("#atcHead").attr("class", "portrait-hd");
        body = "<p class=\"user-index-login\">退出登录中，请稍候</p>";
        $("#divUser").html(body);
        $("#btnloginout").hide();

        

        Message.ShowLoading("退出登录中，请稍候", "divAlert");

        g_type_cart.Upload(UserInfo.Logout);
    },
    Logout: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=userlogout",
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode == g_const_Success_Code) {
                UserInfo.Load_List(msg);
            }
            else {
                ShowMesaage(msg.resultmessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_List: function (msg) {
        UserLogin.LoginStatus = g_const_YesOrNo.NO;
        g_const_localStorage.Member = null;
        var OrderFrom = '';
        var OrderFromParam = '';
        if (localStorage[g_const_localStorage.OrderFrom] != null) {
            if (localStorage[g_const_localStorage.OrderFrom] != "") {
                OrderFrom = localStorage[g_const_localStorage.OrderFrom];
            }
        }
        if (localStorage[g_const_localStorage.OrderFromParam] != null) {
            if (localStorage[g_const_localStorage.OrderFromParam] != "") {
                OrderFromParam = localStorage[g_const_localStorage.OrderFromParam];
            }
        }
        localStorage.clear();
        if (OrderFrom!='') {
            localStorage[g_const_localStorage.OrderFrom] = OrderFrom;
        }
        if (OrderFromParam != '') {
            localStorage[g_const_localStorage.OrderFromParam] = OrderFromParam;
        }
        
        g_type_cart.Clear();
        //增加微信授权
        //var backurl = g_const_PageURL.AccountIndex + "?showwxpaytitle=1";
        //window.location.replace(g_const_PageURL.OauthLogin + "?oauthtype=WeiXin&returnurl=" + encodeURIComponent(backurl) + "&scope=b");
        location.reload();
    },

};

//我的退款售后列表【用于判断是否有最新的售后】
var _TKSH_ShowNum = 0;//未完成数量
//var _PageNo = 1;

var MyTKSH_List = {
    api_target: "com_cmall_familyhas_api_ApiForAftermarketList",
    api_input: { "page": "" },
    
    GetList: function (_PageNo) {

        var all_sel_order_list = "";
        var _LasePageNo = $("#sel_nextPage").val();
        //for (var pageno = 1; parseInt(pageno) <= parseInt(_LasePageNo) ; pageno = parseInt(pageno) + 1) {
        //赋值
        MyTKSH_List.api_input.page = _PageNo;//1;// _PageNo;

        if (_PageNo==1) {
            _TKSH_ShowNum = 0;//未完成数量
        }

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
                if (msg.countPage == 0) {
                    //无售后信息
                    $("#divTKSH").html("");
                }
                else {
                    ////有售后，判断第一条是否和localStorage["first_sh"]一致，不同则显示红点
                    //var temp_e = msg.orderList[0].orderCode+"_"+msg.orderList[0].afterCode + "_" + msg.orderList[0].afterStatus;
                    //if (temp_e != localStorage["first_sh"]) {
                    //    $("#divTKSH").html("<em></em>");
                    //    localStorage["first_sh"] = temp_e;

                    //}
                    //else {
                    //    $("#divTKSH").html("");
                    //}

                    //记录售后单状态数量
                    $.each(msg.orderList, function (i, n) {
                        switch (n.afterStatus) {
                            case "退款中"://g_const_afterStatus.TKZ://退款中
                            case "等待审核"://g_const_afterStatus.DDSH://等待审核
                            case "退换货中"://g_const_afterStatus.THHZ://退换货中
                            case "待完善物流"://g_const_afterStatus.DWSWL://待完善物流
                                _TKSH_ShowNum += 1;
                                break;
                        }
                    });

                    //判断是否有下一页
                    if (msg.nowPage < msg.countPage) {
                        _PageNo = parseInt(msg.nowPage) + 1;
                        MyTKSH_List.GetList(_PageNo);
                    }
                    else {
                        MyTKSH_List.Show();
                    }
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
    /*最终显示*/
    Show: function () {
        if (_TKSH_ShowNum > 0) {
            $("#divTKSH").html("<em>" + _TKSH_ShowNum + "</em>");
        }
        else {
            $("#divTKSH").html("");
        }
    }

};