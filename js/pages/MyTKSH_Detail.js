//用户默认头像
var userheadimg="/img/portrait.png";
//客服默认头像
var shopheadimg="/img/kefu@3x.png";


$(document).ready(function () {

    //自适应rem初始化设置
    function fontSize() {
        if (document.documentElement.clientWidth < 640) { //initial-scale=0.5是缩小一倍后适应屏幕宽。
            document.documentElement.style.fontSize = 10 * (document.documentElement.clientWidth / 320) + 'px';
        } else {
            document.documentElement.style.fontSize = '20px';
        }
    }
    fontSize();
    window.onresize = function () { fontSize(); };
    /*end*/

    //返回
    $("#a_go_back").on("tap", function () {
        window.location.replace(PageUrlConfig.BackTo());

    });

    //售后单号
    $("#hid_afterCode").val(GetQueryString("afterCode"));

    //判断是否已登录
    UserLogin.Check();

    //if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
    //    PageUrlConfig.SetUrl();
    //    //去登录
    //    UserRELogin.login(g_const_PageURL.MyTKSH_Detail + "?afterCode="+afterCode+ "&t=" + Math.random());
    //    return;
    //}
    //else {
    //    window.location.href = g_const_PageURL.MyTKSH_Detail + "?afterCode="+afterCode+ "&t=" + Math.random();
    //}
    //获取用户头像后读取售后详情
    GetMemberInfo.GetList();

    //联系客服
    $("#div_subBtn").on("tap", function () {
        MyTKSH_Detail.ToTel();
    });
});

//我的退款售后详情
var MyTKSH_Detail = {
    api_target: "com_cmall_familyhas_api_ApiForAfterSaleInfo",
    api_input: { "afterCode": "" },
    //加载单页
    GetList: function () {
        //赋值
        MyTKSH_Detail.api_input.afterCode = $("#hid_afterCode").val();

        //组织提交参数
        var s_api_input = JSON.stringify(MyTKSH_Detail.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": MyTKSH_Detail.api_target, "api_token": g_const_api_token.Wanted };
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
                    UserRELogin.login(g_const_PageURL.MyTKSH_Detail+"?afterCode="+$("#hid_afterCode").val());
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                if (msg.afterSaleList.length == 0) {
                    $("#MyTKSH_Detail_article").attr("class", "no-data");

                    //没有数据
                    var emptyStr = "<p>暂无退款售后订单</p>";
                    $("#MyTKSH_Detail_article").html(emptyStr);
                }
                else {
                    $("#MyTKSH_Detail_article").attr("class", "my-order pb-55");

                    //OrderStr = "<ul id=\"MyTKSH_Detail_list_str\" class=\"talksss\">";
                    MyTKSH_Detail.Load_Result(msg);
                    //OrderStr += " </ul>"
                    //$(".my-order").html(OrderStr);

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
        //
        var StrTemp="";
        var StrReturn="";
        //背景颜色
        var bgColor="";

        StrTemp+="<ul class=\"talksss\">";
        $.each(resultlist.afterSaleList, function (i, n) {
            switch (n.bgColor) {
                case g_const_AfterSaleInfo_bgColor.RED:
                    bgColor = "<div class=\"talk3\"><div class=\"jiao4\"></div>";
                    break;
                case g_const_AfterSaleInfo_bgColor.YELLOW:
                    bgColor = "<div class=\"talk\"><div class=\"jiao2\"></div>";
                    break;
                case g_const_AfterSaleInfo_bgColor.WHITE:
                    bgColor = "<div class=\"talk\"><div class=\"jiao2\"></div>";
                    break;
            }

            //用户
            if(n.identity==g_const_AfterSaleInfo_identity.YH){
                
                StrTemp+="<li class=\"customer\">"
                       +"<p class=\"time\">"+n.time+"</p>"
                       +"<div class=\"talk_box clearfix\">"
                           +"<div class=\"img_h\">"
                               +"<img src=\""+userheadimg+"\" />"
                           +"</div>";
                //背景颜色
                StrTemp += "<div class=\"talk\"><div class=\"jiao1\"></div>"; //bgColor;
                StrTemp += "<h3>" + n.title + "</h3>"
                               + "<ul class=\"talk_con\">";
                                   
                $.each(n.content.split('\n'), function (ik, nk) {
                    StrTemp +="<li>" + nk + "</li>";
                });
                

                if (n.picTitle != "") {
                    StrTemp += "<li class=\"tupianWrap clearfix\"><label>" + n.picTitle + ": </label>";


                    //凭证图片
                    StrTemp += "<ul class=\"tupian\">";
                    $.each(n.picUrl, function (iki, nkn) {
                        StrTemp += "<li><div><img src=\"" + nkn + "\"></div></li>";
                    });
                    StrTemp += "</ul></li>";
                }
                  
                StrTemp+="</ul></div></div></li>";
            }
            else{//客服
                
                StrTemp+="<li class=\"shop\">"
                        +"<p class=\"time\">"+n.time+"</p>"
                        +"<div class=\"talk_box\">"
                            +"<div class=\"img_h\">"
                                +"<img src=\""+shopheadimg+"\" />"
                            +"</div>";
                //背景颜色
                StrTemp+=bgColor;
                StrTemp+="<h3>"+n.title+"</h3>";

                if(n.statusType==g_const_AfterSaleInfo_statusType.DWSWL){
                    //待完善物流信息
                    StrTemp+="<div class=\"talk_con\">"
						                +"<a class=\"right\" onclick=\"MyTKSH_Detail.GoToWSWL()\">请填写您的退货物流</a>"
					                +"</div></div></div></li>";
                }
                else{
                    //其他
                    StrTemp += "<ul class=\"talk_con\">";
                    $.each(n.content.split('\n'), function (ik, nk) {
                        StrTemp += "<li>" + nk + "</li>";
                    });
                    StrTemp += "</ul></div></div></li>";
                }
            }

        });
        StrTemp+="</ul>";
        $("#div_sh_details").html(StrTemp);
        return StrReturn;
    },
    /*跳转至完善物流信息页面*/
    GoToWSWL: function () {
        var afterCode = $("#hid_afterCode").val();
        PageUrlConfig.SetUrl();
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            //去登录
            UserRELogin.login(g_const_PageURL.MyTKSH_TXWL + "?afterCode="+afterCode+ "&t=" + Math.random());
            return;
        }
        else {
            window.location.href = g_const_PageURL.MyTKSH_TXWL + "?afterCode="+afterCode+ "&t=" + Math.random();
        }
    },
    /*跳转至完善物流信息页面*/
    ToTel: function () {
        Message.ShowConfirm(g_const_Phone.sh, "", "fbox_ftel", "呼叫", "MyTKSH_Detail.CancelOrder", "取消");
    },
    CancelOrder: function () {
        var u = navigator.userAgent;

        if (u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1 || u.indexOf('iPad') > -1 || !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            //自动执行click事件
            $("#telhref").attr("href", "tel:+" + g_const_Phone.sh);
            $("#shtel").click();
        } else {
            window.location = "tel:" + g_const_Phone.sh + "#mp.weixin.qq.com";

        }

        //window.location = "tel:" + g_const_Phone.sh + "#mp.weixin.qq.com";
        return false;
    },
};
/*获取用户头像*/
var GetMemberInfo = {
    api_target: "com_cmall_familyhas_api_ApiMemberInfoCf",
    api_input: {},
    api_response: {},
    GetList: function () {
        var s_api_input = JSON.stringify(GetMemberInfo.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": GetMemberInfo.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL_User;//g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    PageUrlConfig.SetUrl();

                    //Session失效，重新登录，传递回调地址
                    UserRELogin.login(g_const_PageURL.MyTKSH_Detail+"?afterCode="+$("#hid_afterCode").val()+ "&t=" + Math.random());
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                GetMemberInfo.Load_Result(msg);
            }
            else {
                //获取详情
                MyTKSH_Detail.GetList();

                //ShowMesaage(msg.resultMessage);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            //ShowMesaage(g_const_API_Message["7001"]);
            //获取详情
            MyTKSH_Detail.GetList();

        });
    },
    Load_Result: function (result) {
        //var body = "";
        //if (result.nickName.length>0) {
        //    body += "<p class=\"user-index-login\">Hi, " + result.nickName + "</p>";
        //}
        //else {
        //    body += "<p class=\"user-index-login\">Hi, " + (UserLogin.LoginName.substr(0, 3) + "****" + UserLogin.LoginName.substr(7, 4)) + "</p>";
        //}
        //if (result.headPhoto.length > 0) {
        //    $(".user-portrait").attr("style", "background:url(" + result.headPhoto + ");background-size: 100%;");
        //}
        //body += "<p class=\"user-edit-address\">修改密码、收货地址</p>";
        //$("#divUser").html(body);
        if (result.headPhoto.length > 0) {
            userheadimg= result.headPhoto;

        }
        //获取售后详情
        MyTKSH_Detail.GetList();

    },
}

