/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../iscroll.js" />
/// <reference path="../g_header.js" />
/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />

var Page_Index = {
    /*接口名称*/
    api_target: "com_cmall_familyhas_api_ApiHomeColumn",
    /*输入参数*/
    api_input: { "sysDateTime": new Date().Format("yyyy-MM-dd hh:mm:ss"), "buyerType": "", "maxWidth": "", "version": 1.0, "viewType": g_const_viewType.WXSHOP },
    /*接口响应对象*/
    api_response: {},
    /*初始化*/
    "Init": function () {
        //清除浏览路径
        PageUrlConfig.Clear();
        PageUrlConfig.SetUrl();
        $(".header .hd-search").on("click", function (e) {
            PageUrlConfig.SetUrl();
            window.location.href = g_const_PageURL.Search + "?t=" + Math.random();;//"search.html";
        });
        $(".header .hd-classify").on("click", function (e) {
            PageUrlConfig.SetUrl();
            window.location.href = g_const_PageURL.Category + "?t=" + Math.random();
        });
        $(".header .user-content").on("click", function (e) {
            PageUrlConfig.SetUrl();
            window.location.href = g_const_PageURL.AccountIndex + "?t=" + Math.random();//"Account/index.html";
        });
        $(".app-close").on("click", function (e) {
            $(e.target).parent().css("display", "none");
        });

        Page_Index.GetCartCount();
        Page_Index.GetWXOpenID();

        if (IsInWeiXin.check()) {
            //判断是否登录，若已登录，更新用户位置
            UserLogin.CheckForIndexGetLocation(UpdateMemberCurrentAddress.Update);
        }
        //396 H5弹层  开始
        Action396H5.Show();

        $("#h5close").on("click", function (e) {
            Action396H5.CloseDIV();
        });
        //396 H5弹层  结束

    },
    /*获取购物车的中商品的数量*/
    "GetCartCount": function () {
        UserLogin.Check(CartInfo.LoadData);
    },
    "GetWXOpenID": function () {
        if (GetQueryString("tc") == "WeiXin") {
            var purl = g_INAPIUTL;
            var request = $.ajax({
                url: purl,
                cache: false,
                method: g_APIMethod,
                data: "t=" + Math.random() + "&action=getwxopenid",
                dataType: "json"
            });
            request.done(function (msg) {
                if (msg.resultcode == g_const_Success_Code_IN) {
                    localStorage[g_const_localStorage.Member] = msg.resultmessage;
                }
            });
            request.fail(function (jqXHR, textStatus) {
            });
        }
    },
    /*从接口获取数据*/
    "LoadData": function () {
        var s_api_input = JSON.stringify(Page_Index.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": Page_Index.api_target };
        var purl = g_APIUTL;
        //g_APIMethod = "get";
        //purl = "/JYH/index1.txt";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            //$("#pageloading").css("display", "none");
            Page_Index.api_response = msg;
            if (msg.resultCode == g_const_Success_Code) {
                $("#bodycontent").html("");
                Page_Index.LoadTop3();
                Page_Index.LoadOther();
                //猜你喜欢
                Page_Index.LoadGuessYourLikeData();

            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            //$("#pageloading").css("display", "none");
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },    
    /*读取静态文件*/
    LoadDataStaitc: function () {
        Page_Index.api_response = wap_index;
        if (Page_Index.api_response.resultCode == g_const_Success_Code) {
            $("#bodycontent").html("");
            Page_Index.LoadTop3();
            Page_Index.LoadOther();
            //猜你喜欢
            Page_Index.LoadGuessYourLikeData();

        }
        else {
            ShowMesaage(Page_Index.api_response.resultMessage);
        }
    },
    /*读取Top3*/
    LoadTop3: function () {
        var top3list = Page_Index.api_response.topThreeColumn.topThreeColumnList;
        $(".menu-list.clearfix").css("display", "none");
        $(".index-ad.clearfix").css("display", "none");
        for (var i = 0; i < top3list.length; i++) {
            var top3 = top3list[i];
            switch (top3.columnType) {
                /*轮播广告*/
                case g_const_columnType.swipeSlide:
                    $(".swipe-slide").empty();
                    if (top3.contentList.length > 0) {
                        var swipehtml = " <ul>";
                        var swipeNum = " <div class='swipe-num'> ";
                        // <li><a href=""><img src="./img/w-demo/demo-15.jpg"></a></li>
                        for (var iswipe = 0; iswipe < top3.contentList.length; iswipe++) {
                            var swipe = top3.contentList[iswipe];
                            var surl = Page_Index.GetLocationByShowmoreLinktype(swipe.showmoreLinktype, swipe.showmoreLinkvalue);
                            if (swipe.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                                /*396 h5弹窗类型*/
                                swipehtml += '<li><a onclick="' + surl + '"><img src="' + g_GetPictrue(swipe.picture) + '"></a></li>';
                            }
                            else {
                                if (swipe.isShare == g_const_isShowmore.YES) {
                                    surl += "&wx_st=" + encodeURIComponent(swipe.shareTitle);
                                    surl += "&wx_sc=" + encodeURIComponent(swipe.shareContent);
                                    surl += "&wx_si=" + encodeURIComponent(swipe.sharePic);
                                }
                                swipehtml += '<li><a href="' + surl + '"><img src="' + g_GetPictrue(swipe.picture) + '"></a></li>';
                            }
                            swipeNum += '<a href="javascript:;"></a>';
                        }
                        swipehtml += "</ul>";
                        swipeNum += "</div>";
                        $(".swipe-slide").append(swipehtml).append(swipeNum);
                    }
                    break;
                /*两栏广告*/
                case g_const_columnType.TwoADs:
                    var twoadshtml = "";
                    $(".index-ad.clearfix").empty();
                    $(".index-ad.clearfix").css("display", "");
                    if (top3.contentList.length == 2) {
                        for (var itwoads = 0; itwoads < top3.contentList.length; itwoads++) {
                            var ad = top3.contentList[itwoads];
                            if (ad.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                                /*396 h5弹窗类型*/
                                twoadshtml += '<li><a <a onclick="' + Page_Index.GetLocationByShowmoreLinktype(ad.showmoreLinktype, ad.showmoreLinkvalue) + '" title=""><img src="' + g_GetPictrue(ad.picture) + '" alt=""></a></li>';
                            }
                            else {
                                twoadshtml += '<li><a <a href="' + Page_Index.GetLocationByShowmoreLinktype(ad.showmoreLinktype, ad.showmoreLinkvalue) + '" title=""><img src="' + g_GetPictrue(ad.picture) + '" alt=""></a></li>';
                            }
                        }
                        $(".index-ad.clearfix").append(twoadshtml);
                    }
                    break;
                /*导航*/
                case g_const_columnType.Navigation:
                    var navhtml = "";
                    $(".menu-list.clearfix").empty();
                    $(".menu-list.clearfix").css("display", "");
                    if (top3.contentList.length > 0) {
                        for (var inav = 0; inav < top3.contentList.length; inav++) {
                            var nav = top3.contentList[inav];
                            if (nav.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                                /*396 h5弹窗类型*/
                                navhtml += '<li class="clearfix"><a onclick="' + Page_Index.GetLocationByShowmoreLinktype(nav.showmoreLinktype, nav.showmoreLinkvalue) + '" title=""><img src="' + g_GetPictrue(nav.picture) + '" alt=""><em>' + nav.title + '</em></a></li>';
                            }
                            else {

                                navhtml += '<li class="clearfix"><a href="' + Page_Index.GetLocationByShowmoreLinktype(nav.showmoreLinktype, nav.showmoreLinkvalue) + '" title=""><img src="' + g_GetPictrue(nav.picture) + '" alt=""><em>' + nav.title + '</em></a></li>';
                            }
                        }
                        $(".menu-list.clearfix").append(navhtml);
                    }
                    else
                        $(".menu-list.clearfix").css("display", "none");
                    break;

                /*通屏广告(一栏广告)*/
                case g_const_columnType.CommonAD:
                    var commonAD = top3.contentList[0];
                    stpl = $("#tpl_commonAD")[0].innerHTML;
                    var temp_asdfgghhh = Page_Index.GetLocationByShowmoreLinktype(commonAD.showmoreLinktype, commonAD.showmoreLinkvalue);
                    if (commonAD.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                        /*396 h5弹窗类型*/
                        temp_asdfgghhh = 'onclick="' + temp_asdfgghhh + '"';
                    }
                    else {
                        if (temp_asdfgghhh.indexOf("href=") == -1) {
                            temp_asdfgghhh = 'href="' + temp_asdfgghhh + '"';
                        }
                    }

                    data = {
                        "showmoreLink": temp_asdfgghhh,
                        "picture": g_GetPictrue(commonAD.picture),
                        "showTitle": top3.showName == g_const_isShowmore.YES ? "" : "style='display:none;'",
                        "columnName": top3.columnName == "" ? "" : "<i class=\"left\"></i>" + top3.columnName + "<i class=\"right\"></i>"//commonAD.title
                    };
                    html = renderTemplate(stpl, data);
                    $("#bodycontent").append(html);
                    break;

            }
        }
        /* @ 首页焦点图 */
        $('.swipe-slide').swipeSlide({
            continuousScroll: true,
            speed: 3000,
            transitionType: 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
            callback: function (i) {
                $('.swipe-num').children().eq(i).addClass('curr').siblings().removeClass('curr');
            }
        });
    },
    /*根据链接类型转换链接地址*/
    GetLocationByShowmoreLinktype: function (t, u) {
        //PageUrlConfig.SetUrl();
        return g_GetLocationByShowmoreLinktype(t, u);
    },
    /*读取其它模板*/
    LoadOther: function () {
        var otherlist = Page_Index.api_response.columnList;
        var stpl = "";//页面模板内容
        var data = {};//渲染模板时的对象
        var html = "";
        for (var i = 0; i < otherlist.length; i++) {
            //$("#bodycontent").append("<div class=\"space\"></div>");

            var other = otherlist[i];
            switch (other.columnType) {
                /*两栏广告*/
                case g_const_columnType.TwoADs:
                    var twoadshtml = "";
                    $(".index-ad.clearfix").empty();
                    $(".index-ad.clearfix").css("display", "");
                    if (other.contentList.length == 2) {
                        for (var itwoads = 0; itwoads < other.contentList.length; itwoads++) {
                            var ad = other.contentList[itwoads];
                            if (ad.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                                /*396 h5弹窗类型*/
                                twoadshtml += '<li><a <a onclick="' + Page_Index.GetLocationByShowmoreLinktype(ad.showmoreLinktype, ad.showmoreLinkvalue) + '" title=""><img src="' + g_GetPictrue(ad.picture) + '" alt=""></a></li>';
                            }
                            else {
                                twoadshtml += '<li><a <a href="' + Page_Index.GetLocationByShowmoreLinktype(ad.showmoreLinktype, ad.showmoreLinkvalue) + '" title=""><img src="' + g_GetPictrue(ad.picture) + '" alt=""></a></li>';
                            }
                        }
                        $(".index-ad.clearfix").append(twoadshtml);
                    }
                    break;
                //闪购
                case g_const_columnType.FastBuy:
                    Page_Index.FastBuy = other;
                    html = "";

                    stpl = $("#tpl_fastbuy_productList")[0].innerHTML;
                    for (var j = 0; j < other.contentList.length; j++) {
                        var other_content = other.contentList[j];
                        var temp_asdfgghhh = Page_Index.GetLocationByShowmoreLinktype(other_content.showmoreLinktype, other_content.showmoreLinkvalue);
                        if (other_content.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                            /*396 h5弹窗类型*/
                            temp_asdfgghhh = 'onclick="' + temp_asdfgghhh + '"';
                        }
                        else {
                            if (temp_asdfgghhh.indexOf("href=") == -1) {
                                temp_asdfgghhh = 'href="' + temp_asdfgghhh + '"';
                            }
                        }

                        data = {
                            "showmoreLink": temp_asdfgghhh,
                            "picture": g_GetPictrue(other_content.picture),
                            "discount": other_content.productInfo.discount,
                            "productName": FormatText(other_content.productInfo.productName, 9),
                            "sellPrice": other_content.productInfo.sellPrice
                        };
                        html += renderTemplate(stpl, data);
                    }

                    stpl = $("#tpl_fastbuy")[0].innerHTML;
                    var temp_asdfgghhh = Page_Index.GetLocationByShowmoreLinktype(other.showmoreLinktype, other.showmoreLinkvalue);
                    if (other.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                        /*396 h5弹窗类型*/
                        temp_asdfgghhh = 'onclick="' + temp_asdfgghhh + '"';
                    }
                    else {
                        if (temp_asdfgghhh.indexOf("href=") == -1) {
                            temp_asdfgghhh = 'href="' + temp_asdfgghhh + '"';
                        }
                    }

                    data = {
                        "columnName": other.columnName == "" ? "" : "<i class=\"left\"></i>" + other.columnName + "<i class=\"right\"></i>",//other.columnName,
                        "showmoreLink": temp_asdfgghhh,
                        "showmoreTitle": other.showmoreTitle,
                        "CountDown": '<i>距离结束</i><em class=""></em><b>:</b><em class=""></em><b>:</b><em class=""></em>',
                        "productList": html
                    };
                    html = renderTemplate(stpl, data);

                    $("#bodycontent").append(html);
                    Page_Index.flagCheapInterval = self.setInterval("Page_Index.ShowLeftTime();", g_const_seconds);
                    //<i>距离结束</i><em class="">15</em><b>:</b><em class="">20</em><b>:</b><em class="">30</em>
                    break;

                /*通屏广告(一栏广告)*/
                case g_const_columnType.CommonAD:
                    var commonAD = other.contentList[0];
                    stpl = $("#tpl_commonAD")[0].innerHTML;
                    var temp_asdfgghhh = Page_Index.GetLocationByShowmoreLinktype(commonAD.showmoreLinktype, commonAD.showmoreLinkvalue);
                    if (commonAD.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                        /*396 h5弹窗类型*/
                        temp_asdfgghhh = 'onclick="' + temp_asdfgghhh + '"';
                    }
                    else {
                        if (temp_asdfgghhh.indexOf("href=") == -1) {
                            temp_asdfgghhh = 'href="' + temp_asdfgghhh + '"';
                        }
                    }

                    data = {
                        "showmoreLink": temp_asdfgghhh,
                        "picture": g_GetPictrue(commonAD.picture),
                        "showTitle": other.showName == g_const_isShowmore.YES ? "" : "style='display:none;'",
                        "columnName": other.columnName == "" ? "" : "<i class=\"left\"></i>" + other.columnName + "<i class=\"right\"></i>"// commonAD.title
                    };
                    html = renderTemplate(stpl, data);

                    $("#bodycontent").append(html);
                    break;

                /*一栏推荐*/
                case g_const_columnType.RecommendONE:
                    stpl = $("#tpl_recommendone")[0].innerHTML;

                    var temp_asdfgghhh = Page_Index.GetLocationByShowmoreLinktype(other.showmoreLinktype, other.showmoreLinkvalue);
                    if (other.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                        /*396 h5弹窗类型*/
                        temp_asdfgghhh = 'onclick="' + temp_asdfgghhh + '"';
                    }
                    else {
                        if (temp_asdfgghhh.indexOf("href=") == -1) {
                            temp_asdfgghhh = 'href="' + temp_asdfgghhh + '"';
                        }
                    }

                    var temp_asdfgghhh_1 = Page_Index.GetLocationByShowmoreLinktype(other.contentList[0].showmoreLinktype, other.contentList[0].showmoreLinkvalue);
                    if (other.contentList[0].showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                        /*396 h5弹窗类型*/
                        temp_asdfgghhh_1 = 'onclick="' + temp_asdfgghhh_1 + '"';
                    }
                    else {
                        temp_asdfgghhh_1 = 'href="' + temp_asdfgghhh_1 + '"';
                    }

                    data = {
                        "histyle": (Page_Index.showmoreTitle(other) == "" || Page_Index.showmoreTitle(other) == "&nbsp;") ? "display:none" : "",
                        "columnName": other.columnName == "" ? "" : "<i class=\"left\"></i>" + other.columnName + "<i class=\"right\"></i>",//other.columnName,
                        "showmoreLink": temp_asdfgghhh,
                        "showmoreTitle": Page_Index.showmoreTitle(other),
                        "classmore": Page_Index.classmore(other),
                        "pshowmoreLink": temp_asdfgghhh_1,
                        "titleColor": "color:" + other.contentList[0].titleColor,
                        "title": FormatText(other.contentList[0].title, 6),
                        "descriptionColor": "color:" + other.contentList[0].descriptionColor,
                        "description": FormatText(other.contentList[0].description, 10),
                        "picture": g_GetPictrue(other.contentList[0].picture)
                    };
                    html = renderTemplate(stpl, data);
                    $("#bodycontent").append(html);
                    break;
               /*右两栏推荐*/
                case g_const_columnType.RecommendRightTwo:
                    html = "";
                    var temp_asdfgghhh = Page_Index.GetLocationByShowmoreLinktype(other.showmoreLinktype, other.showmoreLinkvalue);
                    if (other.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                        /*396 h5弹窗类型*/
                        temp_asdfgghhh = 'onclick="' + temp_asdfgghhh + '"';
                    }
                    else {
                        if (temp_asdfgghhh.indexOf("href=") == -1) {
                            temp_asdfgghhh = 'href="' + temp_asdfgghhh + '"';
                        }
                    }

                    if (other.columnName=="") {
                        html = "<section class=\"fan-foodBoxWrap\">"
                        + "<div class=\"fan-foodBox02 clearfix\">";
                    }
                    else {
                        html = "<section class=\"fan-foodBoxWrap\">"
                        + "<h3 class=\"clearfix fan-h3\"><span><i  class=\"left\"></i>" + other.columnName + "<i class=\"right\"></i></span></h3>"
                        + "<div class=\"fan-foodBox02 clearfix\">";
                    }

                    for (var j = 0; j < other.contentList.length; j++) {
                        var one = "";
                        var other_content = other.contentList[j];
                        var temp_asdfgghhh1 = Page_Index.GetLocationByShowmoreLinktype(other_content.showmoreLinktype, other_content.showmoreLinkvalue);
                        if (other_content.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                            /*396 h5弹窗类型*/
                            temp_asdfgghhh1 = 'onclick="' + temp_asdfgghhh1 + '"';
                        }
                        else {
                            if (temp_asdfgghhh1.indexOf("href=")== -1) {
                                temp_asdfgghhh1 = 'href="' + temp_asdfgghhh1 + '"';
                            }
                        }
                        if(j==0){
                            html += "<a " + temp_asdfgghhh1 + "><img class=\"lt-img\" src=\"" + g_GetPictrue(other_content.picture) + "\"></a>";
                                    
                        }
                        else if (j == 1) {
                            html += "<div class=\"l-goods-wrap\"><a " + temp_asdfgghhh1 + "><div class=\"l-goods clearfix\">"
                            if (other_content.title!= "" && other_content.description != "") {
                                html += "<div class=\"l-goods-txt\">"
                                    + "<p class=\"txt01\"><span>" + FormatText(other_content.title, 5) + "</span>"
                                    + "<span class=\"txt04\"><i class=\"rmb\">￥</i><i class=\"count\">" + FormatText(other_content.description, 9) + "</i></span></p>"
                                + "</div>";
                            }
                            html += "<img src=\"" + g_GetPictrue(other_content.picture) + "\">"
                            + "</div></a>";
                        }
                        else {
                            html += "<a " + temp_asdfgghhh1 + "><div class=\"l-goods bott clearfix\">"
                            if (other_content.title != "" && other_content.description != "") {
                                html += "<div class=\"l-goods-txt\">"
                                    + "<p class=\"txt01\"><span>" + FormatText(other_content.title, 5) + "</span>"
                                    + "<span class=\"txt04\"><i class=\"rmb\">￥</i><i class=\"count\">" + FormatText(other_content.description, 9) + "</i></span></p>"
                                + "</div>";
                            }
                            html += "<img src=\"" + g_GetPictrue(other_content.picture) + "\">"
                            + "</div></a></div>";
                            
                        }

                    }
                    html += "</div>";
                    if (Page_Index.showmoreTitle(other) != "&nbsp;") {
                        html += "<a " + temp_asdfgghhh + "><div class=\"fan-foodBox02-more clearfix\"><span>" + Page_Index.showmoreTitle(other) + "</span></div></a>";
                    }
                    html += "</section><div class=\"space\"></div>";

                    
                    $("#bodycontent").append(html);
                    break;
                /*左两栏推荐*/
                case g_const_columnType.RecommendLeftTwo:
                    //html = "";
                    //stpl = $("#tpl_recommend_leftorright_two_product")[0].innerHTML;
                    //for (var j = 0; j < other.contentList.length; j++) {
                    //    var other_content = other.contentList[j];
                    //    var temp_asdfgghhh = Page_Index.GetLocationByShowmoreLinktype(other_content.showmoreLinktype, other_content.showmoreLinkvalue);
                    //    if (other_content.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                    //        /*396 h5弹窗类型*/
                    //        temp_asdfgghhh = 'onclick="' + temp_asdfgghhh + '"';
                    //    }
                    //    else {
                    //        temp_asdfgghhh = 'href="' + temp_asdfgghhh + '"';
                    //    }

                    //    data = {
                    //        "showmoreLink": temp_asdfgghhh,
                    //        "picture": g_GetPictrue(other_content.picture),
                    //        "titleColor": "color:" + other_content.titleColor,
                    //        "title": FormatText(other_content.title, 5),
                    //        "descriptionColor": "color:" + other_content.descriptionColor,
                    //        "description": FormatText(other_content.description, 9)
                    //    };
                    //    html += renderTemplate(stpl, data);
                    //}

                    //stpl = $("#tpl_recommend_leftorright_two")[0].innerHTML;
                    //var temp_asdfgghhh = Page_Index.GetLocationByShowmoreLinktype(other.showmoreLinktype, other.showmoreLinkvalue);
                    //if (other.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                    //    /*396 h5弹窗类型*/
                    //    temp_asdfgghhh = 'onclick="' + temp_asdfgghhh + '"';
                    //}
                    //else {
                    //    temp_asdfgghhh = 'href="' + temp_asdfgghhh + '"';
                    //}


                    //data = {
                    //    "columnName": other.columnName,
                    //    "showmoreLink": temp_asdfgghhh,
                    //    "classmore": Page_Index.classmore(other),
                    //    "showmoreTitle": Page_Index.showmoreTitle(other),
                    //    "classcolumn": g_const_columnType.RecommendLeftTwo == other.columnType ? "fan-foodBox02" : "fan-foodBox03",
                    //    "productList": html
                    //};
                    //html = renderTemplate(stpl, data);
                    //$("#bodycontent").append(html);

                    html = "";
                    var temp_asdfgghhh = Page_Index.GetLocationByShowmoreLinktype(other.showmoreLinktype, other.showmoreLinkvalue);
                    if (other.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                        /*396 h5弹窗类型*/
                        temp_asdfgghhh = 'onclick="' + temp_asdfgghhh + '"';
                    }
                    else {
                        if (temp_asdfgghhh.indexOf("href=") == -1) {
                            temp_asdfgghhh = 'href="' + temp_asdfgghhh + '"';
                        }
                    }

                    if (other.columnName == "") {
                        html = "<section class=\"fan-foodBoxWrap\">"
                        + "<div class=\"fan-foodBox03 clearfix\">";
                    }
                    else {
                        html = "<section class=\"fan-foodBoxWrap\">"
                        + "<h3 class=\"clearfix fan-h3\"><span><i  class=\"left\"></i>" + other.columnName + "<i class=\"right\"></i></span></h3>"
                        + "<div class=\"fan-foodBox03 clearfix\">";
                    }
                    for (var j = 0; j < other.contentList.length; j++) {
                        var one = "";
                        var other_content = other.contentList[j];
                        var temp_asdfgghhh1 = Page_Index.GetLocationByShowmoreLinktype(other_content.showmoreLinktype, other_content.showmoreLinkvalue);
                        if (other_content.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                            /*396 h5弹窗类型*/
                            temp_asdfgghhh1 = 'onclick="' + temp_asdfgghhh + '"';
                        }
                        else {
                            if (temp_asdfgghhh1.indexOf("href=") == -1) {
                                temp_asdfgghhh1 = 'href="' + temp_asdfgghhh1 + '"';
                            }
                        }
                        if (j == 2) {
                            html += "<a " + temp_asdfgghhh1 + "><img class=\"lt-img\" src=\"" + g_GetPictrue(other_content.picture) + "\"></a>"
                                    + "</div>"
                        }
                        else if (j == 0) {
                            html += "<div class=\"l-goods-wrap\"><a " + temp_asdfgghhh1 + "><div class=\"l-goods noTop clearfix\">";
                            if (other_content.title != "" && other_content.description != "") {
                                html += "<div class=\"l-goods-txt\">"
                                    + "<p class=\"txt01\"><span>" + FormatText(other_content.title, 5) + "</span>"
                                    + "<span class=\"txt04\"><i class=\"rmb\">￥</i><i class=\"count\">" + FormatText(other_content.description, 9) + "</i></spaan></p>"
                                + "</div>";
                            }
                            html += "<img src=\"" + g_GetPictrue(other_content.picture) + "\">"
                            + "</div></a>";
                        }
                        else {
                            html += "<a " + temp_asdfgghhh1 + "><div class=\"l-goods bott clearfix\">"
                            if (other_content.title!= "" && other_content.description!= "") {
                                html += "<div class=\"l-goods-txt\">"
                                    + "<p class=\"txt01\"><span>" + FormatText(other_content.title, 5) + "</span>"
                                    + "<span class=\"txt04\"><i class=\"rmb\">￥</i><i class=\"count\">" + FormatText(other_content.description, 9) + "</i></span></p>"
                                + "</div>";
                            }
                            html += "<img src=\"" + g_GetPictrue(other_content.picture) + "\">"
                            + "</div></a></div>";

                        }

                    }
                    html += "</div>";
                    if (Page_Index.showmoreTitle(other) != "&nbsp;") {
                        html += "<a " + temp_asdfgghhh + "><div class=\"fan-foodBox02-more clearfix\"><span>" + Page_Index.showmoreTitle(other) + "</span></div></a>";
                    }
                    html += "</section><div class=\"space\"></div>";

                    $("#bodycontent").append(html);

                    break;



                /*商品推荐*/
                case g_const_columnType.RecommendProduct:
                    html = "";
                    stpl = $("#tpl_recommend_product_product")[0].innerHTML;
                    for (var j = 0; j < other.contentList.length; j++) {
                        var other_content = other.contentList[j];
                        var temp_asdfgghhh = Page_Index.GetLocationByShowmoreLinktype(other_content.showmoreLinktype, other_content.showmoreLinkvalue);
                        if (other_content.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                            /*396 h5弹窗类型*/
                            temp_asdfgghhh = 'onclick="' + temp_asdfgghhh + '"';
                        }
                        else {
                            if (temp_asdfgghhh.indexOf("href=") == -1) {
                                temp_asdfgghhh = 'href="' + temp_asdfgghhh + '"';
                            }
                        }

                        data = {
                            "showmoreLink": temp_asdfgghhh,
                            "picture": g_GetPictrue(other_content.productInfo.mainpicUrl),
                            "productName": FormatText(other_content.productInfo.productName, 10),
                            "sellPrice": other_content.productInfo.sellPrice,

                        };
                        html += renderTemplate(stpl, data);
                    }

                    stpl = $("#tpl_recommend_product")[0].innerHTML;
                    var temp_asdfgghhh = Page_Index.GetLocationByShowmoreLinktype(other.showmoreLinktype, other.showmoreLinkvalue);
                    if (other.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                        /*396 h5弹窗类型*/
                        temp_asdfgghhh = 'onclick="' + temp_asdfgghhh + '"';
                    }
                    else {
                        if (temp_asdfgghhh.indexOf("href=") == -1) {
                            temp_asdfgghhh = 'href="' + temp_asdfgghhh + '"';
                        }
                    }
                    if (Page_Index.showmoreTitle(other)=="&nbsp;") {
                        temp_asdfgghhh=" style='display:none;'"
                    }

                    data = {
                        "columnName": other.columnName == "" ? "" : "<i class=\"left\"></i>" + other.columnName + "<i class=\"right\"></i>",// other.columnName,
                        "showmoreLink": temp_asdfgghhh,
                        "showmoreTitle": Page_Index.showmoreTitle(other),
                        "productList": html,
                        "touchwrapid": "touchwrapid_" + i.toString()
                    };
                    html = renderTemplate(stpl, data);
                    $("#bodycontent").append(html);
                    Page_Index.touchInit(data.touchwrapid);
                    break;

                /*两栏多行推荐(热门市场)*/
                case g_const_columnType.RecommendHot:
                    html = "";
                    stpl = $("#tpl_RecommendHot_product")[0].innerHTML;
                    for (var j = 0; j < other.contentList.length; j++) {
                        var other_content = other.contentList[j];
                        var temp_asdfgghhh = Page_Index.GetLocationByShowmoreLinktype(other_content.showmoreLinktype, other_content.showmoreLinkvalue);
                        if (other_content.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                            /*396 h5弹窗类型*/
                            temp_asdfgghhh = 'onclick="' + temp_asdfgghhh + '"';
                        }
                        else {
                            if (temp_asdfgghhh.indexOf("href=") == -1) {
                                temp_asdfgghhh = 'href="' + temp_asdfgghhh + '"';
                            }
                        }
                        var titleshow="";
                        if(other_content.title==""){
                            titleshow="display:none;"
                        }
                        var descriptionshow="";
                        if(other_content.description==""){
                            descriptionshow="display:none;"
                        }
                        data = {
                            "showmoreLink": temp_asdfgghhh,
                            "picture": g_GetPictrue(other_content.picture),
                            "titleColor": "color:" + other_content.titleColor,
                            "title": FormatText(other_content.title, 5),
                            "descriptionColor": "color:" + other_content.descriptionColor,
                            "description": FormatText(other_content.description, 9),
                            "titleshow":titleshow,
                            "descriptionshow":descriptionshow
                        };
                        html += renderTemplate(stpl, data);
                    }
                    stpl = $("#tpl_RecommendHot")[0].innerHTML;
                    var temp_asdfgghhh = Page_Index.GetLocationByShowmoreLinktype(other.showmoreLinktype, other.showmoreLinkvalue);
                    if (other.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                        /*396 h5弹窗类型*/
                        temp_asdfgghhh = 'onclick="' + temp_asdfgghhh + '"';
                    }
                    else {
                        if (temp_asdfgghhh.indexOf("href=") == -1) {
                            temp_asdfgghhh = 'href="' + temp_asdfgghhh + '"';
                        }
                    }
                    data = {
                        "columnName": other.columnName == "" ? "" : "<i class=\"left\"></i>" + other.columnName + "<i class=\"right\"></i>",//other.columnName,
                        "showStyle": other.columnName == "" ? 'style="display:none"' : '',
                        "showmoreLink": temp_asdfgghhh,
                        "classmore": Page_Index.classmore(other),
                        "showmore": Page_Index.classmore(other) == "" ? 'style="display:none"' : '',
                        "showmoreTitle": Page_Index.showmoreTitle(other),
                        "productList": html
                    };
                    html = renderTemplate(stpl, data);
                    $("#bodycontent").append(html);
                    break;

                /*TV直播*/
                case g_const_columnType.TVLive:
                    //原有效果[轮播图]
                    /*
                    html = "";
                    var numhtml = "";
                    var numstpl = "";
                    //<i class="f18">{{sellPrice}}</i>.<i class="f14">10</i>
                    stpl = $("#tpl_tvlive_product")[0].innerHTML;
                    numstpl = $("#tpl_tvlive_num")[0].innerHTML;
                    for (var j = 0; j < other.contentList.length; j++) {
                        var other_content = other.contentList[j];
                        data = {
                            "showmoreLink": Page_Index.GetLocationByShowmoreLinktype(other_content.showmoreLinktype, other_content.showmoreLinkvalue),
                            "picture": g_GetPictrue(other_content.picture),
                            "productName": FormatText(other_content.productInfo.productName, 25),
                            "sellPrice": function (sellPrice) {
                                var arrmoney = sellPrice.split(".");
                                if (arrmoney.length = 1)
                                    return '<i class="f18">' + sellPrice + '</i>';
                                else if (arrmoney.length = 2)
                                    return '<i class="f18">' + arrmoney[0] + '</i>.<i class="f14">' + arrmoney[1] + '</i>';
                                else
                                    return '<i class="f18">' + sellPrice + '</i>';

                            }(other_content.productInfo.sellPrice),
                            "startTime": Date.Parse(other_content.startTime).Format("hh:mm"),
                            "endTime": Date.Parse(other_content.endTime).Format("hh:mm")
                        };
                        html += renderTemplate(stpl, data);
                        data = {
                            "classcurr": "class=\"\""
                        };
                        numhtml += renderTemplate(numstpl, data);
                    }
                    if (other.contentList.length <= 1) {
                        numhtml = "&nbsp;"
                    }
                    stpl = $("#tpl_tvlive")[0].innerHTML;
                    data = {
                        "columnName": other.columnName,
                        "showmoreLink": "/tvlive.html",//Page_Index.GetLocationByShowmoreLinktype(other.showmoreLinktype, other.showmoreLinkvalue),
                        "classmore": Page_Index.classmore(other),
                        "showmoreTitle": Page_Index.showmoreTitle(other),
                        "productList": html,
                        "NumList": numhtml
                    };
                    html = renderTemplate(stpl, data);
                    $("#bodycontent").append(html);
                    //* @ 首页焦点图
                    $('.module-live').swipeSlide({
                        continuousScroll: true,
                        speed: 3000,
                        transitionType: 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
                        callback: function (i) {
                            $('.live-goods-num').children().eq(i).addClass('curr').siblings().removeClass('curr');
                        }
                    });

                    //重置li的高度
                    var sumHeight = 0;
                    $("#index_tvzb").find("li div a img").each(function () {
                        if ($(this).height() > sumHeight) {
                            sumHeight = $(this).height();
                    }
                    });
                    if (sumHeight > 0) {
                        $("#index_tvzb").height(sumHeight+80);
                    }
                    //原有结束
                    */


                    //396 多个视频直播--改为横栏多商品形式--开始
                    html = "";
                    var numhtml = "";
                    var numstpl = "";
                    stpl = $("#tpl_tvlive_product")[0].innerHTML;//未开始模板
                    stpl_1 = $("#tpl_tvlive_product_1")[0].innerHTML;//直播中模板
                    numstpl = $("#tpl_tvlive_num")[0].innerHTML;
                    for (var j = 0; j < other.contentList.length; j++) {
                        var other_content = other.contentList[j];
                        var temp_asdfgghhh = Page_Index.GetLocationByShowmoreLinktype(other_content.showmoreLinktype, other_content.showmoreLinkvalue);
                        if (other_content.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                            /*396 h5弹窗类型*/
                            temp_asdfgghhh = 'onclick="' + temp_asdfgghhh + '"';
                        }
                        else {
                            if (temp_asdfgghhh.indexOf("href=") == -1) {
                                temp_asdfgghhh = 'href="' + temp_asdfgghhh + '"';
                            }
                        }

                        data = {
                            "showmoreLink": temp_asdfgghhh,
                            "picture": g_GetPictrue(other_content.picture),
                            "productName": FormatText(other_content.productInfo.productName, 25),
                            "sellPrice": function (sellPrice) {
                                return sellPrice;
                                //var arrmoney = sellPrice.split(".");
                                //if (arrmoney.length = 1)
                                //    return sellPrice ;
                                //else if (arrmoney.length = 2)
                                //    return '<i class="f18">' + arrmoney[0] + '</i>.<i class="f14">' + arrmoney[1] + '</i>';
                                //else
                                //    return '<i class="f18">' + sellPrice + '</i>';

                            }(other_content.productInfo.sellPrice),
                            "startTime": Date.Parse(other_content.startTime).Format("hh:mm"),
                            "endTime": Date.Parse(other_content.endTime).Format("hh:mm")
                        };
                        if (My_DateCheck.CheckEX_1("<=", other.sysTime, other_content.startTime) && My_DateCheck.CheckEX_1(">", other.sysTime, other_content.endTime)) {
                            //正在直播
                            html += renderTemplate(stpl_1, data);
                        }
                        else if (My_DateCheck.CheckEX_1(">", other.sysTime, other_content.startTime)) {
                            //未开始的
                            html += renderTemplate(stpl, data);
                        }
                    }
                    if (other.contentList.length <= 1) {
                        numhtml = "&nbsp;"
                    }
                    stpl = $("#tpl_tvlive")[0].innerHTML;
                    data = {
                        "columnName": other.columnName == "" ? "" : "<i class=\"left\"></i>" + other.columnName + "<i class=\"right\"></i>",//other.columnName,
                        "showmoreLink": "/tvlive.html",//Page_Index.GetLocationByShowmoreLinktype(other.showmoreLinktype, other.showmoreLinkvalue),
                        "classmore": Page_Index.classmore(other),
                        "showmoreTitle": Page_Index.showmoreTitle(other),
                        "productList": html
                    };
                    html = renderTemplate(stpl, data);
                    $("#bodycontent").append(html);

                    ////* @ 首页焦点图
                    //$('.module-live').swipeSlide({
                    //    continuousScroll: true,
                    //    speed: 3000,
                    //    transitionType: 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
                    //    callback: function (i) {
                    //        $('.live-goods-num').children().eq(i).addClass('curr').siblings().removeClass('curr');
                    //    }
                    //});

                    //重置li的高度
                    var sumHeight = 0;
                    $("#index_tvzb").find("li div a img").each(function () {
                        if ($(this).height() > sumHeight) {
                            sumHeight = $(this).height();
                        }
                    });
                    if (sumHeight > 0) {
                        $("#index_tvzb").height(sumHeight + 80);
                    }
                    //重置UL的宽度other.contentList.length
                    var ul_width = 90 * other.contentList.length;
                    $("#index_tvzb").attr("style", "width:" + ul_width + "px;");

                    //396 多个视频直播--改为横栏多商品形式--结束

                    break;

                //通知模版
                case g_const_columnType.Notify:
                    html = "";
                    stpl = $("#tpl_notify").html();
                    var listhtml = "";
                    var liststpl = $("#tpl_notify_list").html();
                    for (var j = 0; j < other.contentList.length; j++) {
                        var notify = other.contentList[j];

                        var temp_asdfgghhh = g_GetLocationByShowmoreLinktype(notify.showmoreLinktype, notify.showmoreLinkvalue, notify);
                        if (notify.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                            /*396 h5弹窗类型*/
                            temp_asdfgghhh = 'onclick="' + temp_asdfgghhh + '"';
                        }
                        else {
                            if (temp_asdfgghhh.indexOf("href=") == -1) {
                                temp_asdfgghhh = 'href="' + temp_asdfgghhh + '"';
                            }
                        }

                        var listdata = {
                            notifypic: notify.picture,
                            notifytext: "<span style='color:" + notify.titleColor + "'>" + notify.title + "<span>",
                            notifylink: temp_asdfgghhh,
                            notifytype: notify.showmoreLinktype,
                            notifybody: "<span style='color:" + notify.descriptionColor + "'>" + notify.description + "<span>"
                        };
                        listhtml += renderTemplate(liststpl, listdata);
                    }
                    data = {
                        notifylist: listhtml,
                        notifyid: "marqueebox_" + other.columnID
                    }
                    html = renderTemplate(stpl, data);
                    $("#bodycontent").append(html);

                    Page_Index.Startmarquee(50, 50, other.intervalSecond * g_const_seconds, data.notifyid);

                    $("div.headline li").off("click");
                    $("div.headline li").on("click", function () {
                        var notifytype = $(this).attr("notifytype");
                        var notifytitle = $(this).attr("notifytitle");
                        var notifybody = $(this).attr("notifybody");
                        if (notifytype == g_const_showmoreLinktype.ShowLayer) {
                            $("#div_notice").css("display", "");
                            $("#notice_title").html(notifytitle);
                            $("#notice_body").html(notifybody);
                        }
                    });
                    $("#div_notice").off("click");
                    $("#div_notice").on("click", function () {
                        $(this).css("display", "none");
                    });

                    break;

                /*2栏2行推荐*/
                case g_const_columnType.Recommend2L2H:
                    html = "";
                    stpl = $("#tpl_2L2H").html();
                    var listhtml = "";
                    var liststpl = $("#tpl_2L2H_productList").html();
                    for (var j = 0; j < other.contentList.length; j++) {
                        var product = other.contentList[j];

                        var temp_asdfgghhh = g_GetLocationByShowmoreLinktype(product.showmoreLinktype, product.showmoreLinkvalue);
                        if (product.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                            /*396 h5弹窗类型*/
                            temp_asdfgghhh = 'onclick="' + temp_asdfgghhh + '"';
                        }
                        else {
                            if (temp_asdfgghhh.indexOf("href=") == -1) {
                                temp_asdfgghhh = 'href="' + temp_asdfgghhh + '"';
                            }
                        }

                        var listdata = {
                            ProductDetailURL: temp_asdfgghhh,
                            picture: g_GetPictrue(product.productInfo.mainpicUrl),
                            SoldOut: "",
                            discount: product.productInfo.discount,
                            productNameString: product.productInfo.productName,
                            productPrice: product.productInfo.sellPrice
                        };
                        listhtml += renderTemplate(liststpl, listdata);
                    }

                    var temp_asdfgghhh = g_GetLocationByShowmoreLinktype(other.showmoreLinktype, other.showmoreLinkvalue);
                    if (other.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                        /*396 h5弹窗类型*/
                        temp_asdfgghhh = 'onclick="' + temp_asdfgghhh + '"';
                    }
                    else {
                        if (temp_asdfgghhh.indexOf("href=") == -1) {
                            temp_asdfgghhh = 'href="' + temp_asdfgghhh + '"';
                        }
                    }


                    data = {
                        columnName: other.columnName == "" ? "" : "<i class=\"left\"></i>" + other.columnName + "<i class=\"right\"></i>",//other.columnName,
                        showmoreLink: temp_asdfgghhh,
                        classmore: Page_Index.classmore(other),
                        showmoreTitle: Page_Index.showmoreTitle(other),
                        productList: listhtml
                    }
                    html = renderTemplate(stpl, data);
                    $("#bodycontent").append(html);
                    break;

                /*三栏两行推荐*/
                case g_const_columnType.Recommend3L2H:
                    html = "";
                    stpl = $("#tpl_3L2H").html();
                    var listhtml = "";
                    var liststpl = $("#tpl_3L2H_productList").html();
                    for (var j = 0; j < other.contentList.length; j++) {
                        var product = other.contentList[j];

                        var temp_asdfgghhh = g_GetLocationByShowmoreLinktype(product.showmoreLinktype, product.showmoreLinkvalue);
                        if (product.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                            /*396 h5弹窗类型*/
                            temp_asdfgghhh = 'onclick="' + temp_asdfgghhh + '"';
                        }
                        else {
                            if (temp_asdfgghhh.indexOf("href=") == -1) {
                                temp_asdfgghhh = 'href="' + temp_asdfgghhh + '"';
                            }
                        }


                        var listdata = {
                            ProductDetailURL: temp_asdfgghhh,
                            picture: g_GetPictrue(product.productInfo.mainpicUrl),
                            SoldOut: "",
                            discount: product.productInfo.discount,
                            productNameString: product.productInfo.productName,
                            productPrice: product.productInfo.sellPrice
                        };
                        listhtml += renderTemplate(liststpl, listdata);
                    }

                    var temp_asdfgghhh = g_GetLocationByShowmoreLinktype(other.showmoreLinktype, other.showmoreLinkvalue);
                    if (other.showmoreLinktype == g_const_showmoreLinktype.IndexH5) {
                        /*396 h5弹窗类型*/
                        temp_asdfgghhh = 'onclick="' + temp_asdfgghhh + '"';
                    }
                    else {
                        if (temp_asdfgghhh.indexOf("href=") == -1) {
                            temp_asdfgghhh = 'href="' + temp_asdfgghhh + '"';
                        }
                    }


                    data = {
                        columnName: other.columnName == "" ? "" : "<i class=\"left\"></i>" + other.columnName + "<i class=\"right\"></i>",//other.columnName,
                        showmoreLink: temp_asdfgghhh,
                        classmore: Page_Index.classmore(other),
                        showmoreTitle: Page_Index.showmoreTitle(other),
                        productList: listhtml
                    }
                    html = renderTemplate(stpl, data);
                    $("#bodycontent").append(html);
                    break;
                    break;
            }
        }
    },
    //通知轮播
    Startmarquee: function (lh, speed, delay, id) {
        var p = false;
        var t;
        var o = $("#" + id)[0];
        o.innerHTML += o.innerHTML;
        o.style.marginTop = 0;
        o.onmouseover = function () { p = true; }
        o.onmouseout = function () { p = false; }

        function start() {
            t = setInterval(scrolling, speed);
            if (!p) o.style.marginTop = parseInt(o.style.marginTop) - 1 + "px";
        }

        function scrolling() {
            if (parseInt(o.style.marginTop) % lh != 0) {
                o.style.marginTop = parseInt(o.style.marginTop) - 1 + "px";
                if (Math.abs(parseInt(o.style.marginTop)) >= o.scrollHeight / 2) o.style.marginTop = 0;
            } else {
                clearInterval(t);
                setTimeout(start, delay);
            }
        }
        setTimeout(start, delay);
    },
    /*横向滚动初始化*/
    touchInit: function (touchwrapid) {
        var iWidth = $(window).innerWidth();
        var wrap = $('.touch-wrap');
        var goodsWrap = $('.goods-recomd');
        goodsWrap.each(function () {
            var aLi = $(this).find('li');
            var len = aLi.length;
            aLi.css({
                'width': Math.ceil(iWidth / 3)
            });
            $(this).css({
                'width': Math.ceil(aLi.outerWidth()) * aLi.length+78
            });
        });

        wrap.css({
            'width': iWidth,
            'overflow': 'hidden'
        });

        var myscroll = new IScroll("#" + touchwrapid, {
            scrollX: true, scrollY: false, mouseWheel: true, preventDefault: false
        });
    },
    /*快速购买数据*/
    FastBuy: {},
    /*倒计时*/
    ShowLeftTime: function () {
        var date_last = Date.Parse(Page_Index.FastBuy.endTime);
        var date_now = new Date();
        var ts = date_last.getTime() - date_now.getTime();  //时间差的毫秒数              

        var hours = Math.floor(ts / g_const_hours);
        var leftmillionseconds = ts % g_const_hours;
        var minutes = Math.floor(leftmillionseconds / g_const_minutes);
        leftmillionseconds = leftmillionseconds % g_const_minutes;
        var seconds = Math.floor(leftmillionseconds / g_const_seconds);

        var hourstring = "0" + hours.toString();
        hourstring = hourstring.substr(hourstring.length - 2, 2);
        var minutestring = "0" + minutes.toString();
        minutestring = minutestring.substr(minutestring.length - 2, 2);

        var secondstring = "0" + seconds.toString();
        secondstring = secondstring.substr(secondstring.length - 2, 2);
        $(".count-down")[0].innerHTML = '<i>距离结束</i><em class="">' + hourstring + '</em><b>:</b><em class="">' + minutestring + '</em><b>:</b><em class="">' + secondstring + '</em>';
        if (hours == 0 && minutes == 0 && seconds == 0)
            self.clearInterval(Page_Index.flagCheapInterval);
    },
    flagCheapInterval: 0,
    /*获取更多的Class*/
    classmore: function (other) {
        if (other.isShowmore == g_const_isShowmore.YES) {
            return other.showmoreTitle == "" ? "" : "more";
        }
        else
            return "";
    },
    /*更多的文字标题*/
    showmoreTitle: function (other) {
        if (other.isShowmore == g_const_isShowmore.YES) {
            return other.showmoreTitle == "" ? "&nbsp;" : other.showmoreTitle;
        }
        else
            return "&nbsp;";

    },
    /*猜你喜欢当前页数*/
    GuessYourLike_pageNum: 1,
    /*猜你喜欢总页数*/
    GuessYourLike_TotalPages: 1,
    /*猜你喜欢响应对象*/
    GuessYourLike_api_response: 1,
    /*防止重复*/
    GuessYourLike_check: 1,
    /*获取猜你喜欢数据*/
    "LoadGuessYourLikeData": function () {
        if (Page_Index.GuessYourLike_check == 0) {
            return;
        }
        Page_Index.GuessYourLike_check = 0;
        Page_Index.api_input = { pageSize: "6", operFlag: "maybelove", version: 1.0, pageIndex: Page_Index.GuessYourLike_pageNum };
        Page_Index.api_target = "com_cmall_familyhas_api_ApiRecProductInfo";
        //  Page_Index.api_input.picWidth = 500;
        var s_api_input = JSON.stringify(Page_Index.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": Page_Index.api_target };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            //$("#pageloading").css("display", "none");
            Page_Index.GuessYourLike_api_response = msg;
            if (msg.resultCode == g_const_Success_Code) {
                if (Page_Index.Pagination == -1)
                    Page_Index.Pagination = msg.pagination
                if (Page_Index.GuessYourLike_pageNum <= Page_Index.Pagination || Page_Index.Pagination == -1) {
                    Page_Index.LoadGuessYourLike();
                    Page_Index.GuessYourLike_pageNum++;
                }
                else {
                    //ShowMesaage(g_const_API_Message["100021"]);
                }
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
            Page_Index.GuessYourLike_check = 1;
        });

        request.fail(function (jqXHR, textStatus) {
            //$("#pageloading").css("display", "none");
            ShowMesaage(g_const_API_Message["100022"]);
        });
    },
    /*猜你喜欢的总页数*/
    Pagination: -1,
    /*渲染猜你喜欢*/
    LoadGuessYourLike: function () {
        var html = "";
        var stpl = $("#tpl_GuessYourLike_product")[0].innerHTML;
        var guessyoulike = Page_Index.GuessYourLike_api_response;
        for (var j = 0; j < guessyoulike.productMaybeLove.length; j++) {
            var productMaybeLove = guessyoulike.productMaybeLove[j];
            var markHtml = "";
            //原有本地图片，3.9.4后注销
            //if (productMaybeLove.labelsList.length >= 1) {
            //    var label = g_const_ProductLabel.find(productMaybeLove.labelsList[0]);
            //    if (label) {
            //        if (label.spicture != "") {
            //            markHtml = '<img class="d_add_ys" src="' + label.spicture + '" alt="" />';
            //        }
            //    }
            //}
            //3.9.4 从接口获取图片
            if (productMaybeLove.labelsPic != "" && !(productMaybeLove.labelsPic == undefined)) {
                markHtml = '<img class="d_add_ys" src="' + productMaybeLove.labelsPic + '" alt="" />';
            }

            data = {
                "mark": markHtml,
                "ProductDetailURL": Page_Index.GetLocationByShowmoreLinktype(g_const_showmoreLinktype.ProductDetail, productMaybeLove.procuctCode),
                "picture": g_GetPictrue(productMaybeLove.mainpic_url),
                //"discount": function (a, b) {
                //    var float_a = parseFloat(a);
                //    var float_b = parseFloat(b);
                //    var float_c = float_a / float_b * 10;
                //    var s = float_c.toFixed(1).toString();
                //    if (s == "10.0" || s == "Infinity")
                //        s = "&nbsp;";
                //    return s;
                //}(productMaybeLove.productPrice, productMaybeLove.market_price),
                "productNameString": FormatText(productMaybeLove.productNameString, 10),
                "productPrice": productMaybeLove.productPrice,
                "market_price": productMaybeLove.market_price
            };
            html += renderTemplate(stpl, data);
        }
        if (Page_Index.GuessYourLike_pageNum == 1) {
            stpl = $("#tpl_GuessYourLike")[0].innerHTML;
            data = {
                "productList": html
            };
            html = renderTemplate(stpl, data);
            var iheight;
            if (Page_Index.GuessYourLike_pageNum == 1) {
                iheight = $(document).height();
            }
            //$("#ichsy_jyh_wrapper").css("top", iheight-90);
            $("#bodycontent").append(html);
            Page_Index.InitScroll();
        }
        else {
            $("#ichsy_jyh_scroller").append(html);
        }
    },
    InitScroll: function () {
        var iHeight = 0;
        var winHeight = $(window).height();
        $(window).on('scroll', function () {
            var el = $(this);
            var iScrollTop = el.scrollTop();
            iHeight = $('body').height();
            if ((iScrollTop + winHeight) >= iHeight) {
                if (Page_Index.GuessYourLike_pageNum <= Page_Index.Pagination) {
                    Page_Index.LoadGuessYourLikeData();
                } else {
                    //ShowMesaage(g_const_API_Message["100021"]);
                }
            }

            //搜索栏换css
            if ($(document).scrollTop() > 100) {
                $(".header").addClass("on");
            } else {
                $(".header").removeClass("on");
            }
        });
    }
};

/*更新用户地址*/
var UpdateMemberCurrentAddress = {
    api_target: "com_cmall_familyhas_api_ApiUpdateMemberCurrentAddress",
    api_input: { "sqNum": "", "longitude": "", "latitude": "" },
    Update: function () {

        if (localStorage["mylocation_temp"] != "" && !(localStorage["mylocation_temp"] == undefined) && UserLogin.LoginStatus == g_const_YesOrNo.YES) {
            var tttm = localStorage["mylocation_temp"].split('_');
            if (tttm.length == 2) {
                //赋值
                UpdateMemberCurrentAddress.api_input.sqNum = "LSH" + Math.random();
                UpdateMemberCurrentAddress.api_input.longitude = tttm[0];
                UpdateMemberCurrentAddress.api_input.latitude = tttm[1];

                //组织提交参数
                var s_api_input = JSON.stringify(this.api_input);
                //提交接口[api_token不为空，公用方法会从sission中获取]
                var obj_data = { "api_input": s_api_input, "api_target": UpdateMemberCurrentAddress.api_target, "api_token": g_const_api_token.Wanted };
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
                    if (msg.resultcode == g_const_Error_Code.UnLogin) {
                        //PageUrlConfig.SetUrl();
                        //UserRELogin.login(g_const_PageURL.Index + "?t=" + Math.random());
                        return;
                    }

                    if (msg.resultCode == g_const_Success_Code) {
                        UpdateMemberCurrentAddress.Load_Result(msg, longitude, latitude);
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
        }
    },
    //接口返回成功后的处理
    Load_Result: function (msg, longitude, latitude) {
        //记录是否已获得过当前地址
        //localStorage["mylocation"] = longitude + "_" + latitude;
    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
};

/*396 活动H5*/
var h5_eventUrl;
var Action396H5 = {
    api_target: "com_cmall_familyhas_api_ApiFhAppHomeDialog",
    api_input: { "version": 1 },
    Show: function () {

        //组织提交参数
        var s_api_input = JSON.stringify(this.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": Action396H5.api_target, "api_token": g_const_api_token.Unwanted };
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
                Action396H5.Load_Result(msg);
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
    Load_Result: function (msg) {
        var isshow = false;
        //判断有效性
        if (msg.eventUrl != "") {
            h5_eventUrl = msg.eventUrl;
            //时间判断
            if (My_DateCheck.CheckEX_1("<=", msg.curentTime, msg.startTime) && My_DateCheck.CheckEX_1(">", msg.curentTime, msg.endTime)) {
                //缓存判断
                if (localStorage["index_h5"] == undefined) {
                    //第一次加载时显示
                    isshow = true;
                }
                else if (localStorage["index_h5"] != (msg.startTime + msg.endTime + msg.eventUrl)) {
                    //活动有变化时重新显示
                    isshow = true;
                }
            }
        }
        if (isshow) {
            localStorage["index_h5"] = msg.startTime + msg.endTime + msg.eventUrl;
            //显示H5
            //判断url是否是图片
            var asdfff = msg.eventUrl.substr(msg.eventUrl.length - 4).toLocaleLowerCase();
            if (asdfff == ".jpg" || asdfff == ".png" || asdfff == ".gif" || asdfff == "jpeg") {
                $("#img_ifr").attr("src", msg.eventUrl);
                $("#img_ifr").show();
                $("#index_ifr").hide();
            }
            else {
                $("#index_ifr").attr("src", msg.eventUrl);
                $("#index_ifr").show();
                $("#img_ifr").hide();
            }
            $("#div_h5_396").show();

        }
    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
    /*关闭弹层*/
    CloseDIV: function () {
        $("#div_h5_396").hide();
    },
    ShowH5: function () {
        if (!(h5_eventUrl == undefined)) {
            var asdfff = h5_eventUrl.substr(h5_eventUrl.length - 4).toLocaleLowerCase();
            if (asdfff == ".jpg" || asdfff == ".png" || asdfff == ".gif" || asdfff == "jpeg") {
                $("#img_ifr").attr("src", h5_eventUrl);
                $("#img_ifr").show();
                $("#index_ifr").hide();
            }
            else {
                $("#index_ifr").attr("src", h5_eventUrl);
                $("#index_ifr").show();
                $("#img_ifr").hide();
            }
            $("#div_h5_396").show();
        }
    },
};

//显示购物车信息
var CartInfo = {
    //获取购物车信息【提交本地并获取服务端数据】
    LoadData: function () {
        //登录状态从接口获取数量
        if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
            var objcarts = [];
            var api_input = { "goodsList": objcarts, "channelId": g_const_ChannelID };
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
                    $(".shop-cart").empty();
                    var icount = 0;
                    if (msg.shoppingCartList.length > 0) {
                        $.each(msg.shoppingCartList, function (j, m) {
                            $.each(m.goods, function (i, n) {
                                icount += n.sku_num;
                            });
                        });
                    }
                    if (icount > 99)
                        scount = "99+";
                    else
                        scount = icount.toString();
                    var html = "";
                    if (icount != 0)
                        html = "<i>" + scount + "</i>";
                    $(".ch02").append(html);
                }
                else {
                }
            });

            request.fail(function (jqXHR, textStatus) {
                ShowMesaage(g_const_API_Message["7001"]);
            });
        }
        else {
            //非登录状态从缓存中获取
            $(".shop-cart").empty();
            var sCart = localStorage[g_const_localStorage.Cart];
            var objCart = null;
            if (typeof (sCart) != "undefined") {
                objCart = JSON.parse(sCart);
            }
            var icount = 0;
            var scount = ""
            if (objCart != null) {
                for (var i = 0; i < objCart.GoodsInfoForAdd.length; i++) {
                    var GoodsInfo = objCart.GoodsInfoForAdd[i];
                    icount += GoodsInfo.sku_num;
                }
            }
            if (icount > 99)
                scount = "99+";
            else
                scount = icount.toString();
            var html = "";
            if (icount != 0)
                html = "<i>" + scount + "</i>";
            $(".ch02").append(html);
        }
    },
}