/// <reference path="../functions/g_Const.js" />
/// <reference path="../jquery-2.1.4.js" />
var page_yaotv_product_detail = {
    //商品详情数据
    productDetailData: {},
    //商品活动数据（价格相关）
    productActInfoData: {},
    //前置商品编号
    productCode: "",
    Init: function () {
        $(".bottom span").on("click", function () {
            page_yaotv_product_detail.tostIsCall();
        });
        $("#mainbuy").on("click", function (e) {
            if ($("#mainbuy").attr("class") != "gray")
                page_yaotv_product_detail.OpenSKULayer($(e.target).attr("operate"));
        });
        $(".ch-bn").on("click", function () {
            window.location.reload(true);
        });

        page_yaotv_product_detail.SetWX();
        page_yaotv_product_detail.GetData();
    },
    SetWX: function () {
        shaketv.subscribe({
            appid: "wx7c73f526ee2324e8",
            selector: "#div_subscribe_area",
            type: 2
        }, function (returnData) {
            //一键关注bar消失后会调用回调函数，在此处理bar消失后带来的样式问题
            if (returnData.errorCode == "-1002") {
                //alert(JSON.stringify(returnData));
                //$("#div_subscribe_area").css("display", "none");
            }
            console.log(JSON.stringify(returnData));
            //alert(JSON.stringify(returnData));
        });
    },
    tostIsCall: function () {
        $("#mask").show();
        $(".ftel").show();
    },
    exitCall: function () {
        setTimeout(function () {
            $("#mask").hide();
            $(".ftel").hide();
        }, 300);
    },
    /*弹出SKU层*/
    OpenSKULayer: function (opentype) {
        $("#bodycontent").on("touchstart", function (e) {
            e.preventDefault();

        });
        $("#bodycontent").on("touchmove", function (e) {
            e.preventDefault();

        });
        $("#bodycontent").on("touchend", function (e) {
            e.preventDefault();
        });

        var fth = $('.botline').offset().top - 40;
        $('.tabw').animate({ 'height': '100%' }, 300);
        $('#mask').css({ 'display': 'block', 'height': fth + 'px' });
        $('.tabw footer').css('display', 'block');

        if (opentype == "stylechoose") {
            $("#sku_buy").text("立即购买");
        }
        else {
            $("#sku_buy").text("确定");
        }

    },
    /*关闭SKU层*/
    CloseSKULayer: function () {
        $("#bodycontent").off("touchstart");
        $("#bodycontent").off("touchmove");
        $("#bodycontent").off("touchend");

        $('.tabw').css('height', '0');
        $('#mask').css('display', 'none');
        $('.tabw footer').css('display', 'none');
        $('.mainw').css({ 'height': '100%', 'overflow': 'auto' });
        self.setTimeout('$(".bottom").css("display", "");', 300);
    },
    //标签切换
    TabnavSelect: function (n) {
        var menu = document.getElementById("menu");
        var menuli = menu.getElementsByTagName("li");
        for (var i = 0; i < menuli.length; i++) {
            menuli[i].className = "";
            menuli[n].className = "on";
            document.getElementById("tabc" + i).className = "no";
            document.getElementById("tabc" + n).className = "tabc";
        }
    },
    DefaultData: function () {
        page_yaotv_product_detail.productCode = "8016445626";
        page_yaotv_product_detail.productDetailData = { "resultLast": "2015-11-27 14:59:55", "resultCache": 60, "resultCode": 1, "resultMessage": "", "productCode": "8016445626", "productName": "罗马尼亚小鳄鱼酥脆饼干100g/袋*4袋", "sellPrice": 42, "marketPrice": 49, "flagSale": 0, "productStatus": "4497153900060004", "videoUrl": "", "brandName": "无", "brandCode": "44971602100029", "mainpicUrl": { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24df5/e37dd758951643c6b0878e5e5d94ce31.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24e57/081ec33086ad4f689357628dc0b67106.jpg", "width": 0, "height": 1080, "oldWidth": 0, "oldHeight": 0 }, "productComment": [], "highPraiseRate": "", "commentSumCounts": 0, "pcPicList": [{ "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24df5/e37dd758951643c6b0878e5e5d94ce31.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24e57/081ec33086ad4f689357628dc0b67106.jpg", "width": 0, "height": 1080, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24df5/60a6ae90ef3d4f0da5cfabd4be81c782.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24e57/9fcb9de95b2a47b688bdcc25093493b3.jpg", "width": 0, "height": 1080, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24df5/2717089cedea485b96a7f8ebb27341bb.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24e57/afa07c0a15414e238d4eeddf2385bbc5.jpg", "width": 0, "height": 1080, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24df5/9459d04bb32841b5af61805d503cf295.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24e57/b288c72bcbb14a49bafca38d41691a44.jpg", "width": 0, "height": 1080, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24df5/9c97cdfc0d6e4f688c28aa288b78e1fe.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24e57/7aa8d3c8c856453da42b4b51baee01bf.jpg", "width": 0, "height": 1080, "oldWidth": 0, "oldHeight": 0 }], "discriptPicList": [{ "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24df5/f07c412410634135b197ef7c95c17352.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24e57/7b96cafcf07446c0b5a53d28072b88f1.jpg", "width": 0, "height": 14342, "oldWidth": 0, "oldHeight": 0 }], "skuList": [{ "skuCode": "8019772264", "skuName": "罗马尼亚小鳄鱼酥脆饼干100g/袋*4袋", "keyValue": "4497462000010001=0&4497462000020001=0", "stockNumSum": 20, "sellPrice": 42, "marketPrice": 49, "activityInfo": [], "vipSpecialPrice": "0", "disMoney": 0.42, "skuMaxBuy": 99, "miniOrder": 1, "limitBuy": 99 }], "discriptInfo": ".", "labelsList": [""], "maxBuyCount": 99, "propertyList": [{ "propertyKeyCode": "4497462000010001", "propertyKeyName": "颜色", "propertyValueList": [{ "propertyValueCode": "0", "propertyValueName": "共同" }] }, { "propertyKeyCode": "4497462000020001", "propertyKeyName": "款式", "propertyValueList": [{ "propertyValueCode": "0", "propertyValueName": "共同" }] }], "propertyInfoList": [{ "propertykey": "商品编码", "propertyValue": "8016445626" }, { "propertykey": "商品名称", "propertyValue": "罗马尼亚小鳄鱼酥脆饼干100g/袋*4袋" }, { "propertykey": "口味", "propertyValue": "椒盐酥/棒酥/芝士味/披萨味" }, { "propertykey": "规格", "propertyValue": "100g/袋*4袋" }, { "propertykey": "配料", "propertyValue": "小麦粉、棕榈油、白砂糖、食盐、酵母等" }, { "propertykey": "保质期", "propertyValue": "12个月" }, { "propertykey": "贮存方法", "propertyValue": "置于阴凉干燥处储存" }, { "propertykey": "产地", "propertyValue": "罗马尼亚" }], "flagCheap": 0, "exitVideo": 0, "flagIncludeGift": 0, "gift": "", "authorityLogo": [{ "logoContent": "正品保障", "logoPic": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24abe/86eadab0ed714ef28500c0da94ecf201.png", "logoLocation": 5 }, { "logoContent": "全场包邮", "logoPic": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24abe/2097b594abc749e2a3f19fbb6cc7dce3.png", "logoLocation": 4 }, { "logoContent": "7天无理由退货", "logoPic": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24abe/e6a858e2206d4c149eadd8bc82461586.png", "logoLocation": 3 }], "endTime": "", "familyPriceName": "家有价", "discount": 7.00, "disMoney": 0.42, "shareUrl": "http://share.ichsy.com/s/p/8016445626", "saleNum": "0", "collectionProduct": 0, "vipSpecialActivity": 0, "vipSpecialTip": "", "vipSpecialPrice": "0", "limitBuyTip": "限购99件", "priceLabel": "", "vipSecKill": 0, "buttonMap": { "buyBtn": 1, "shopCarBtn": 1, "callBtn": 0 }, "minSellPrice": "42", "maxSellPrice": "42", "sysDateTime": "2015-11-27 14:59:55", "otherShow": [], "flagTheSea": "0", "commonProblem": [] };
        page_yaotv_product_detail.productActInfoData = { "resultCode": 1, "resultMessage": "", "skus": [{ "skuCode": "8019772264", "sellPrice": 42.00, "sellNote": "", "sourcePrice": 49.00, "sourceNote": "市场价", "skuPrice": 42.00, "buttonText": "商品下架", "buyStatus": 6, "maxBuy": 20, "minBuy": 1, "limitStock": 20, "limitBuy": 99, "limitSecond": -1, "itemCode": "", "eventCode": "", "eventType": "", "productCode": "8016445626", "productPicUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24df5/e37dd758951643c6b0878e5e5d94ce31.jpg", "smallSellerCode": "SF03100071", "validateFlag": "Y", "skuKeyvalue": "颜色=共同&款式=共同", "skuPicUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24df5/e37dd758951643c6b0878e5e5d94ce31.jpg", "skuName": "罗马尼亚小鳄鱼酥脆饼干100g/袋*4袋" }], "events": [], "buttonControl": 1, "saleMessage": [], "marketPrice": "49.00", "sellPrice": "42.00", "skuPrice": "42.00", "buttonText": "商品下架", "buyStatus": 6, "limitSecond": -1 };
    },

    //获取数据
    GetData: function () {
        var request = $.ajax({
            url: "https://mm.ichsy.com/Ajax/JsonP_Api.aspx",
            async: false,
            cache: false,
            method: "get",
            data: { apitype: "yaotvproductdetail" },
            dataType: "jsonp",
            jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
            jsonpCallback: "productdetailCallback",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
        });
        request.done(function (msg) {
            //console.log(JSON.stringify(msg));
            page_yaotv_product_detail.productCode = msg.productCode;
            page_yaotv_product_detail.productDetailData = msg.productDetailData;
            page_yaotv_product_detail.productActInfoData = msg.productActInfoData;
            if (!page_yaotv_product_detail.productDetailData.hasOwnProperty("productCode") || !page_yaotv_product_detail.productActInfoData.hasOwnProperty("skus") || page_yaotv_product_detail.productCode == "") {
                page_yaotv_product_detail.DefaultData();
            }
            page_yaotv_product_detail.LoadData();
        });
        request.fail(function (jqXHR, textStatus) {
            page_yaotv_product_detail.DefaultData();
            page_yaotv_product_detail.LoadData();
        });

    },
    //加载数据
    LoadData: function () {
        if (page_yaotv_product_detail.IsSoldOut()) {
            $("#div_productStatus").empty();
            $("#div_productStatus").append("没货啦,下次早点来哦~");
            $("#mainbuy").attr("class", "gray");
        }
        if (page_yaotv_product_detail.productDetailData.productStatus != g_const_productStatus.Common) {
            $("#div_productStatus").empty();
            $("#div_productStatus").append("该商品已下架,下次早点来哦~");
            $("#mainbuy").attr("class", "gray");
        }
        $("#productName").html(page_yaotv_product_detail.productDetailData.productName.trim());
        $(".bianh").html("商品编号：<span>" + page_yaotv_product_detail.productDetailData.productCode + "</span>");
        $(".num-toal").html("<div>月销<span><b>" + page_yaotv_product_detail.productDetailData.saleNum + "</b> 件</span></div>");
        $(".sc .bh").html(page_yaotv_product_detail.productDetailData.productCode);

        page_yaotv_product_detail.Load_pcPicList(page_yaotv_product_detail.productDetailData);
        page_yaotv_product_detail.LoadPrice(page_yaotv_product_detail.productDetailData);
        page_yaotv_product_detail.LoadflagCheap(page_yaotv_product_detail.productDetailData);
        page_yaotv_product_detail.LoadPromotion(page_yaotv_product_detail.productDetailData);
        page_yaotv_product_detail.LoadProductProperty(page_yaotv_product_detail.productDetailData);
        page_yaotv_product_detail.LoadAuthorityLogo(page_yaotv_product_detail.productDetailData);
        page_yaotv_product_detail.LoadDiscriptPicList(page_yaotv_product_detail.productDetailData);
        page_yaotv_product_detail.LoadPropertyInfoList(page_yaotv_product_detail.productDetailData);

        page_yaotv_product_detail.LoadActPriceInfo();
        page_yaotv_product_detail.AutoRefresh();
    },
    /*判断是否有库存(抢光了)*/
    IsSoldOut: function () {
        var bsoldout = true;
        var skuSecKill = page_yaotv_product_detail.productActInfoData;
        if (skuSecKill != null) {
            if (skuSecKill.buyStatus == g_const_buyStatus.YES || skuSecKill.buyStatus == g_const_buyStatus.ActNotStart) {
                for (var i = 0; i < skuSecKill.skus.length; i++) {
                    var _sku = skuSecKill.skus[i];
                    if (_sku.maxBuy != 0)
                        return false;
                }
                bsoldout = true;
            }
            else
                bsoldout = true;
        }
        else
            bsoldout = false;
        return bsoldout;
    },
    /*读取轮播图*/
    Load_pcPicList: function (msg) {
        var objpcPicList = $("#idSlider2");
        var picCount = msg.pcPicList.length;
        objpcPicList.empty();
        //活动轮播图
        $("#idNum").empty();
        $("#idSlider2").css("width", (picCount * 100) + "%");
        $(".pic-num1").css("width", (picCount * 30) + "px");

        var html = "";
        for (var i = 0; i < picCount; i++) {
            var objpcPic = msg.pcPicList[i];
            html += "<li ><a><img src='" + page_yaotv_product_detail.g_GetPictrue(objpcPic.picNewUrl) + "' /></a></li>";
        }
        objpcPicList.append(html);


        var forEach = function (array, callback) {
            for (var i = 0, len = array.length; i < len; i++) { callback.call(this, array[i], i); }
        }
        st = createPicMove("idContainer2", "idSlider2", picCount);	//图片数量更改后需更改此数值
        var nums = [];
        //插入数字
        for (var i = 0, n = st._count - 1; i <= n; i++) {
            var li = document.createElement("li");
            nums[i] = document.getElementById("idNum").appendChild(li);
        }
        //如果只有一幅图则隐藏idNum
        if (picCount <= 1)
            $("#idNum").css("display", "none");
        //设置按钮样式
        st.onStart = function () {
            //forEach(nums, function(o, i){ o.className = ""})
            forEach(nums, function (o, i) { o.className = st.Index == i ? "new-tbl-cell on" : "new-tbl-cell"; })
        }
        // 重新设置浮动
        $("#idSlider2").css("position", "relative");
        st.Run();
        resetScrollEle();
    },
    /*读取价格信息*/
    LoadPrice: function (msg) {

        var html = '';
        if (msg.vipSpecialActivity == g_const_YesOrNo.YES)
            html += '<em class="nprice"><em>￥</em>' + msg.vipSpecialPrice + '</em>';
        else {
            if (msg.minSellPrice == msg.maxSellPrice)
                html += '<em class="nprice"><em>￥</em>' + msg.minSellPrice + '</em>';
            else
                html += '<em class="nprice"><em>￥</em>' + msg.minSellPrice + "-" + msg.maxSellPrice + '</em>';
        }
        html += '<span><em>￥</em>' + msg.marketPrice;
        if (msg.priceLabel != "")//page_yaotv_product_detail.GetShowType() == page_yaotv_product_detail.ShowType.SecKill && msg.vipSecKill==g_const_YesOrNo.YES&&
            html += '<font>' + msg.priceLabel + '</font>';
        html += '</span>';
        $(".price")[0].innerHTML = html;
    },
    /*读取闪购信息*/
    LoadflagCheap: function (msg) {
        if (msg.flagCheap == g_const_YesOrNo.YES) {
            $("#div_left_time").empty();
            $("#div_left_time").css("display", "");
            $("#mainaddtocart").css("display", "none");
            $("#sku_addtocart").css("display", "none");
            page_yaotv_product_detail.flagCheapInterval = self.setInterval("page_yaotv_product_detail.ShowLeftTime();", g_const_seconds);
        }
    },
    flagCheapInterval: 0,
    ShowLeftTime: function () {
        var date_last = Date.Parse(page_yaotv_product_detail.productDetailData.endTime);
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

        $("#div_left_time")[0].innerHTML = "剩 " + hourstring + ":" + minutestring + ":" + secondstring;
        if (hours == 0 && minutes == 0 && seconds == 0)
            self.clearInterval(page_yaotv_product_detail.flagCheapInterval);
    },
    /*读取促销信息*/
    LoadPromotion: function (msg) {
        $(".sales").empty();
        var html = "";
        var saleshtml = '<div class="lid"><em>#类别#</em><div>#说明#</div></div>';
        var temp = "";
        if (msg.flagIncludeGift == g_const_YesOrNo.YES) {
            temp = saleshtml.replace("#类别#", "赠品");
            temp = temp.replace("#说明#", msg.gift);
            html += temp;
        }
        if (msg.flagCheap == g_const_YesOrNo.YES) {
            if (page_yaotv_product_detail.productDetailData.skuList.length > 0) {
                for (var k in page_yaotv_product_detail.productDetailData.skuList[0].activityInfo) {
                    var activity = page_yaotv_product_detail.productDetailData.skuList[0].activityInfo[k];
                    temp = saleshtml.replace("#类别#", activity.activityName);
                    temp = temp.replace("#说明#", activity.remark);
                    html += temp;
                }
            }
            else {
                temp = saleshtml.replace("#类别#", "闪购中");
                temp = temp.replace("#说明#", "本时段享超值优惠");
                html += temp;
            }
        }

        temp = "";
        if (msg.priceLabel.trim() != "" && msg.priceLabel.trim() != "闪购") {
            var arrpriceLabel = msg.priceLabel.trim().split(",");
            for (var kkk in arrpriceLabel) {
                temp = saleshtml.replace("#类别#", arrpriceLabel[kkk]);
                temp = temp.replace("#说明#", "&nbsp;");
                html += temp;
            }
        }
        if (msg.otherShow.length > 0) {
            var arrotherShow = msg.otherShow;
            for (var kkk in arrotherShow) {
                if (arrotherShow[kkk] != "" && arrotherShow[kkk] != "赠品")
                    temp = saleshtml.replace("#类别#", arrotherShow[kkk]);
                temp = temp.replace("#说明#", "&nbsp;");
                html += temp;
            }
        }
        $(".sales").append(html);
        if (html == "") {
            $(".sales").css("display", "none");
        }
    },
    /*读取商品属性信息*/
    LoadProductProperty: function (msg) {
        $(".box.sizes").empty();
        var html = "";
        var temp = '<div class="lid"><span class="fr jt">跳转</span><em>查看：</em>';
        for (var i = 0; i < msg.propertyList.length; i++) {
            temp += msg.propertyList[i].propertyKeyName + " ";
        }
        temp += "</div>";
        if (msg.propertyList.length > 0) {
            html = temp;
            $(".box.sizes").on("click", function () {
                if ($("#mainbuy").attr("class") != "gray")
                    page_yaotv_product_detail.OpenSKULayer("stylechoose");
            });
        }
        $(".box.sizes").append(html);
        var tmpl = $("#tpl_sku")[0].innerHTML;

        var data = {
            "productpic": page_yaotv_product_detail.g_GetPictrue(msg.mainpicUrl.picNewUrl.trim()),
            "productName": msg.productName.trim(),
            "sellPrice": page_yaotv_product_detail.GetSalePrice(),
            "productStyleName": function () {
                var s = "";
                for (var i = 0; i < msg.propertyList.length; i++) {
                    s += "<span>" + msg.propertyList[i].propertyKeyName + "</span>";
                }
                return s;
            }(),
            "productStyleList": function () {
                var html = '';
                for (var i = 0; i < msg.propertyList.length; i++) {
                    //测试for (var k = 0; k < 3; k++) {
                    var propertyList = msg.propertyList[i];
                    html += '<div class="sel">';
                    html += '   <div class="tdiv">' + propertyList.propertyKeyName + '</div>';
                    html += '       <div class="sdiv" data="' + propertyList.propertyKeyCode + '" index="' + i.toString() + '">';
                    for (var j = 0; j < propertyList.propertyValueList.length; j++) {
                        var propertyValueList = propertyList.propertyValueList[j];
                        html += '       <a data="' + propertyValueList.propertyValueCode + '" datatext="' + propertyValueList.propertyValueName.trim() + '"><b>&nbsp;</b>' + propertyValueList.propertyValueName + '</a>';
                    }
                    //测试html += '<a data="' + (propertyValueList.propertyValueCode+1) + '" datatext="' + propertyValueList.propertyValueName.trim()+"1" + '"><b>&nbsp;</b>' + propertyValueList.propertyValueName+"1" + '</a>'
                    html += '   </div>';
                    html += '</div>';
                    //}
                }

                return html;
            }()
        };
        html = page_yaotv_product_detail.renderTemplate(tmpl, data);
        $("body").append(html);


        $('.tabw .btn-close').on("click", function () {
            page_yaotv_product_detail.CloseSKULayer();
        });

        /*数量减一*/
        $(".btn-minus").on("click", function (e) {

            var buycount = $("#buycount").val();
            var icount = parseInt(buycount, 10);
            if (icount == "NaN") {
                icount = 1;
            }
            if (icount <= 1)
                icount = 1;
            else
                icount = icount - 1;
            if (page_yaotv_product_detail.SelectSku.stockNumSum == 0 || page_yaotv_product_detail.productDetailData.maxBuyCount == 0)
                icount = 0;
            $("#buycount").attr("value", icount.toString());
        });
        /*数量加一*/
        $(".btn-add").on("click", function (e) {
            var buycount = $("#buycount").val();
            var icount = parseInt(buycount, 10);
            if (icount == "NaN") {
                icount = 1;
            }
            if (page_yaotv_product_detail.SelectSku.stockNumSum == 0)
                icount = 0;
            if (icount >= 99)
                icount = 99;
            else
                icount = icount + 1;
            if (icount > page_yaotv_product_detail.SelectSku.stockNumSum) {
                page_yaotv_product_detail.ShowMesaage("对不起,您不能购买更多了.");
                icount = page_yaotv_product_detail.SelectSku.stockNumSum;
            }
            if (icount > page_yaotv_product_detail.SelectSku.skuMaxBuy) {
                page_yaotv_product_detail.ShowMesaage("对不起,您已达到限购数量上限.");
                icount = page_yaotv_product_detail.SelectSku.skuMaxBuy;
            }
            $("#buycount").attr("value", icount.toString());
        });

        $(".btn-buy").on("click", page_yaotv_product_detail.OnBuyClick);

        for (var i = 0; i < msg.propertyList.length; i++) {
            var propertyList = msg.propertyList[i];
            var objgroup = $(".sdiv[data='" + propertyList.propertyKeyCode.trim() + "']").children("a[class!='nosel']");
            objgroup.on("click", function (e) {
                var objthis = e.target;
                if ($(this).attr("class") == "nosel")
                    return;
                var obj_group = $(this).parent().children("a[class!='nosel']");
                obj_group.attr("class", "");
                $(this).attr("class", "on");
                page_yaotv_product_detail.StyleSelect($(this).parent().attr("index"), $(this).parent().attr("data"), $(this).attr("data"), $(this).attr("datatext"));
            });
        }
        if (msg.propertyList.length == 1) {
            page_yaotv_product_detail.SetStockInfo("");
        }
        /*如果只有1种sku则隐藏sku选择器*/
        if (msg.skuList.length == 1) {
            $(".pop-c .sel").css("display", "none");
            $(".pop-c .selnum").css("display", "");
            $(".imgr .size").css("display", "none");
            page_yaotv_product_detail.SelectSku = msg.skuList[0];
            page_yaotv_product_detail.RefershPrice(page_yaotv_product_detail.SelectSku.keyValue);
        }
    },
    /*读取权威标志*/
    LoadAuthorityLogo: function (msg) {
        $(".bz").empty();
        var html = "";
        for (var i = 0; i < msg.authorityLogo.length; i++) {
            var authorityLogo = msg.authorityLogo[i];
            html += "<span><b style=\"background: url(" + authorityLogo.logoPic.trim() + ") no-repeat left top;background-size: 100% auto;\">&nbsp;</b>" + authorityLogo.logoContent.trim() + "</span>";

        }
        $(".bz").append(html);
    },
    /*读取图文详情*/
    LoadDiscriptPicList: function (msg) {
        $("#tabc0").empty();
        var html = '<div class="imgs">';
        for (var i = 0; i < msg.discriptPicList.length; i++) {
            var discriptPicList = msg.discriptPicList[i];
            html += '<img src="' + discriptPicList.picNewUrl + '" style="width:100%" />';
        }
        html += '</div>';
        $("#tabc0").append(html);
    },
    /*读取规格参数*/
    LoadPropertyInfoList: function (msg) {
        $("#tabc1").empty();
        var html = '<div class="param">';
        for (var i = 0; i < msg.propertyInfoList.length; i++) {
            var propertyInfoList = msg.propertyInfoList[i];
            html += '<p><span class="st">【' + propertyInfoList.propertykey + '】</span><span>' + propertyInfoList.propertyValue + '</span></p>';
        }
        html += '</div>';
        $("#tabc1").append(html);
    },
    //读取活动接口价格信息
    LoadActPriceInfo: function () {
        var msg = page_yaotv_product_detail.productActInfoData;
        $("#mainbuy").text(msg.buttonText);
        var skulist = page_yaotv_product_detail.productDetailData.skuList;
        var seckillskulist = msg.skus;
        for (var k in skulist) {
            var sku = skulist[k];
            var bfind = false;
            for (var kk in seckillskulist) {
                var seckillsku = seckillskulist[kk];
                if (sku.skuCode.trim() == seckillsku.skuCode.trim()) {
                    page_yaotv_product_detail.productDetailData.skuList[k].sellPrice = seckillsku.sellPrice;
                    page_yaotv_product_detail.productDetailData.skuList[k].skuMaxBuy = seckillsku.maxBuy;
                    page_yaotv_product_detail.productDetailData.skuList[k].itemCode = seckillsku.itemCode;
                    page_yaotv_product_detail.productDetailData.skuList[k].limitBuyTip = "已达购买限制数" + seckillsku.limitBuy + "件";
                    bfind = true;
                    break;
                }
            }
            if (!bfind) {
                page_yaotv_product_detail.productDetailData.skuList[k].stockNumSum = 0;
                page_yaotv_product_detail.productDetailData.skuList[k].itemCode = "";
            }
        }
        page_yaotv_product_detail.productDetailData.skuList = skulist;
        if (page_yaotv_product_detail.productDetailData.skuList.length == 1) {
            //只有1种样式
            page_yaotv_product_detail.SelectSku.sellPrice = page_yaotv_product_detail.productDetailData.skuList[0].sellPrice;
            page_yaotv_product_detail.SelectSku.skuMaxBuy = page_yaotv_product_detail.productDetailData.skuList[0].skuMaxBuy;
            page_yaotv_product_detail.RefershPrice(page_yaotv_product_detail.SelectSku.keyValue);
            $(".nprice").empty();
            $(".nprice").append("<em>￥" + page_yaotv_product_detail.productDetailData.skuList[0].sellPrice + "</em>");
            $(".pprice").empty();
            $(".pprice").append("<b>￥</b>" + page_yaotv_product_detail.productDetailData.skuList[0].sellPrice);
        }

    },
    /*根据选中的样式查找SKU信息*/
    FindSku: function (style) {
        var skuList = page_yaotv_product_detail.productDetailData.skuList;
        for (var i = 0; i < skuList.length; i++) {
            var sku = skuList[i];
            if (sku.keyValue == style) {
                return sku;
            }
        }
        return null;
    },
    /*点击购买或者加入购物车时的操作*/
    OnBuyClick: function (e) {
        var objthis = e.target;
        var buycount = 0;
        $(".bottom").css("display", "none");
        var selectstylecount = $(".sdiv .on").length;
        var maxstylecount = page_yaotv_product_detail.productDetailData.propertyList.length;

        if (page_yaotv_product_detail.productDetailData.skuList.length > 1 && selectstylecount != maxstylecount) {
            page_yaotv_product_detail.ShowMesaage("请您选择你要购买的商品样式.");
            return;
        }
        buycount = parseInt($("#buycount").val(), 10);
        if (buycount > page_yaotv_product_detail.SelectSku.stockNumSum) {
            page_yaotv_product_detail.ShowMesaage("库存不足,请您修改购买数量.");
            return;
        }
        if (buycount > page_yaotv_product_detail.SelectSku.skuMaxBuy || buycount == 0) {
            page_yaotv_product_detail.ShowMesaage("对不起,您已达到限购数量上限.");
            return;
        }

        var objcart = {
            /*商品数量*/
            "sku_num": buycount,
            /*地区编号,可不填写，添加购物车不再需要区域编号*/
            "area_code": "",
            /*商品编号*/
            "product_code": page_yaotv_product_detail.productCode,//page_yaotv_product_detail.productDetailData.productCode,
            /*sku编号*/
            "sku_code": page_yaotv_product_detail.SelectSku.skuCode,
        };

        var objcartfull = {
            /*购买数量*/
            sku_num: 0,
            /*地区编号,可不填写，添加购物车不再需要区域编号*/
            area_code: "",
            /*商品编号*/
            product_code: "",
            /*sku编号*/
            sku_code: "",
            /*商品属性,商品规格,商品款式*/
            sku_property: [],
            /*其他相关显示语,比如赠品*/
            otherShow: "",
            /*商品价格*/
            sku_price: 0.0,
            /*促销描述*/
            sales_info: "",
            /*库存*/
            sku_stock: 0,
            /*促销种类*/
            sales_type: "",
            /*商品图片链接*/
            pic_url: "",
            /*每单限购数量*/
            limit_order_num: 0,
            /*库存是否足够*/
            flag_stock: g_const_YesOrNo.NO,
            /*商品活动相关显示语*/
            activitys: [],
            /*是否有效商品*/
            flag_product: g_const_YesOrNo.NO,
            /*商品名称(包含选中的SKU)*/
            sku_name: ""
        };
        var objcartlist = [];
        objcartfull.sku_num = buycount;
        objcartfull.area_code = "";
        if (page_yaotv_product_detail.GetShowType() == page_yaotv_product_detail.ShowType.Normal) {
            objcartfull.product_code = page_yaotv_product_detail.productCode;
            objcartfull.sku_code = page_yaotv_product_detail.SelectSku.skuCode;
        }
        else {
            objcartfull.product_code = page_yaotv_product_detail.productDetailData.productCode;
            objcartfull.sku_code = page_yaotv_product_detail.SelectSku.itemCode;
            objcart.sku_code = objcartfull.sku_code;
            objcart.product_code = objcartfull.product_code;

        }

        objcartfull.otherShow = page_yaotv_product_detail.productDetailData.otherShow;
        objcartfull.sku_price = page_yaotv_product_detail.SelectSku.sellPrice;
        objcartfull.sku_stock = page_yaotv_product_detail.SelectSku.stockNumSum;
        objcartfull.pic_url = page_yaotv_product_detail.productDetailData.mainpicUrl.picNewUrl.trim();
        objcartfull.limit_order_num = page_yaotv_product_detail.SelectSku.skuMaxBuy;
        objcartfull.flag_stock = g_const_YesOrNo.YES;
        objcartfull.flag_product = g_const_YesOrNo.YES;
        objcartfull.sku_name = page_yaotv_product_detail.SelectSku.skuName;//page_yaotv_product_detail.productDetailData.productName.trim() + " " + $(".imgr .size span").text();
        objcartfull.sales_type = "";//已过时,不再用
        objcartfull.sales_info = "";//已过时,不再用

        var arrpricelabel = page_yaotv_product_detail.productDetailData.priceLabel.split(",");
        for (var i in arrpricelabel) {
            var pricelabel = arrpricelabel[i];
            if (pricelabel != "") {
                var activity = {
                    activity_name: pricelabel,
                    activity_info: ""
                };
                objcartfull.activitys.push(activity);
            }
        }
        var arrstyle = page_yaotv_product_detail.SelectSku.keyValue.split("&");
        for (var i in arrstyle) {
            var s_style = arrstyle[i];
            if (s_style.indexOf("=") != -1) {
                var arr_s_style = s_style.split("=");
                var objp = page_yaotv_product_detail.FindProperty(arr_s_style[0], arr_s_style[1]);
                var PcPropertyinfoForFamily = { sku_code: objcartfull.sku_code, propertyKey: objp.propertyKey, propertyValue: objp.propertyValue };
                objcartfull.sku_property.push(PcPropertyinfoForFamily);
            }
        }

        // objcartfull.activitys
        var objcarts = {
            "GoodsInfoForAdd": []
        };

        if ($(objthis).attr("operate") == "orderconfim") {
            //立即购买
            objcarts = {
                "GoodsInfoForAdd": [objcart]
            };
            //localStorage[g_const_localStorage.ImmediatelyBuy] = JSON.stringify(objcarts);
            //localStorage[g_const_localStorage.OrderConfirm] = localStorage[g_const_localStorage.ImmediatelyBuy];

            objcartlist.push(objcartfull);
            //localStorage[g_const_localStorage.GoodsInfo] = JSON.stringify(objcartlist);

            window.location.href = "http://s.jyh.com" + g_const_PageURL.PreOrderConfirm + "?t=" + Math.random() + "&showwxpaytitle=1" + "&c=" + encodeURIComponent(JSON.stringify(objcartlist));

        }
        page_yaotv_product_detail.CloseSKULayer();
    },
    /*查询样式信息*/
    FindProperty: function (propertyKeyCode, propertyValueCode) {
        var objp = { propertyKey: "", propertyValue: "" };
        for (var i = 0; i < page_yaotv_product_detail.productDetailData.propertyList.length; i++) {
            var property = page_yaotv_product_detail.productDetailData.propertyList[i];
            if (property.propertyKeyCode == propertyKeyCode) {
                objp.propertyKey = property.propertyKeyName;
                for (var j in property.propertyValueList) {
                    var propertyValue = property.propertyValueList[j];
                    if (propertyValue.propertyValueCode == propertyValueCode) {
                        objp.propertyValue = propertyValue.propertyValueName;
                        break;
                    }
                }
                break;
            }
        }
        return objp;
    },
    /*选中的样式编号串*/
    ChoosedStyle: "",
    /*选中的样式名称串*/
    ChoosedStyleName: "",
    /*样式选择方法*/
    StyleSelect: function (selectindex, propertyKeyCode, propertyValue, propertyValueName) {
        var sprice = "<b>￥</b>";
        if (selectindex == 0) {
            page_yaotv_product_detail.ChoosedStyle = "";
            page_yaotv_product_detail.ChoosedStyleName = "已选择：";
            $(".pprice").empty();
            sprice += page_yaotv_product_detail.GetSalePrice();
            $(".pprice").append(sprice);
        }
        var stylename = page_yaotv_product_detail.ChoosedStyleName;
        var style = page_yaotv_product_detail.ChoosedStyle;
        var arrstyle = style.split("&");
        var maxselectcount = page_yaotv_product_detail.productDetailData.propertyList.length;


        for (var i = 0; i < maxselectcount; i++) {

            if (i > selectindex) {
                //把所选样式下面的样式组设为未选择
                var objgroup = $(".sdiv[index='" + i.toString() + "']").children("a");
                objgroup.attr("class", "");
            }
        }

        var selectstyles = $(".sdiv .on");
        var islength = selectstyles.length;
        style = "";
        stylename = "已选择：";
        productstylevalue = "";
        for (var i = 0; i < islength ; i++) {
            var ss = selectstyles[i];
            if (i != (islength - 1)) {
                style += $(ss).parent().attr("data") + "=" + $(ss).attr("data") + "&";

            }
            else {

                style += $(ss).parent().attr("data") + "=" + $(ss).attr("data");
                if (i == (maxselectcount - 2)) {
                    //只剩一项未选择
                    if (selectindex == i) {
                        //未选择的是倒数第2个
                        page_yaotv_product_detail.SetStockInfo(style);

                    }
                }
            }
            stylename += "<span class=\"fred\">" + $(ss).attr("datatext") + "</span>";

        }

        page_yaotv_product_detail.ChoosedStyle = style;

        $(".size").empty();
        $(".size").append(stylename);

        if (islength == maxselectcount)
            page_yaotv_product_detail.RefershPrice(style);

    },
    /*设定默认库存显示*/
    SetStockInfo: function (style) {
        var maxselectcount = page_yaotv_product_detail.productDetailData.propertyList.length;
        var lastsyles = $(".sdiv[index='" + (maxselectcount - 1).toString() + "'] a");

        var skuList = page_yaotv_product_detail.productDetailData.skuList;

        for (var istylecount = 0; istylecount < lastsyles.length; istylecount++) {
            var laststyle = lastsyles[istylecount];
            var fullstyle = style + "&" + $(laststyle).parent().attr("data") + "=" + $(laststyle).attr("data");
            if (style == "")
                fullstyle = $(laststyle).parent().attr("data") + "=" + $(laststyle).attr("data");
            if (page_yaotv_product_detail.IsSkuCanSold(fullstyle))
                $(laststyle).attr("class", "");
            else
                $(laststyle).attr("class", "nosel");
        }
    },
    /*查找制定样式的sku是否有货*/
    IsSkuCanSold: function (fullstyle) {
        var skuList = page_yaotv_product_detail.productDetailData.skuList;
        var bcansold = false;
        for (var iskuindex = 0; iskuindex < skuList.length; iskuindex++) {
            var sku = skuList[iskuindex];
            if (sku.keyValue.indexOf(fullstyle) != -1) {
                //$(laststyle).attr("class", "nosel");
                bcansold = true;
                if (sku.stockNumSum <= 0)
                    bcansold = false;
                break;
            }
        }
        return bcansold;
    },
    /*根据单个的SKU信息更新页面*/
    RefershPrice: function (style) {
        var sprice = "<b>￥</b>";
        //获取对应的sku信息
        var sku = page_yaotv_product_detail.FindSku(style);
        if (sku != null) {
            page_yaotv_product_detail.SelectSku = sku;
            $(".pprice").empty();

            sprice += sku.sellPrice.toString();
            $(".pprice").append(sprice);
            $(".bnum.fr span").empty();
            var limitcount = 0;
            if (sku.skuMaxBuy >= sku.stockNumSum)
                limitcount = sku.stockNumSum;
            else
                limitcount = sku.skuMaxBuy;
            var slimitbuy = limitcount >= 99 ? "" : "限购" + limitcount.toString() + "件";
            if (sku.skuMaxBuy <= 0 && sku.limitBuyTip.indexOf("已达购买限制数") != -1)
                slimitbuy = sku.limitBuyTip;
            $(".bnum.fr span").append(slimitbuy);
            if (sku.stockNumSum <= 0) {
                page_yaotv_product_detail.ShowMesaage("对不起,您选择的商品无货,请您重新选择.");
            }
        }
        else {
            $(".pprice").empty();
            sprice += page_yaotv_product_detail.GetSalePrice();
            $(".pprice").append(sprice);
            $(".sdiv .on").attr("class", "");

            $(".size").empty();
            $(".size").append("请选择：");
            page_yaotv_product_detail.ShowMesaage(g_const_API_Message["100036"]);
        }
    },
    /*选中的SKU*/
    SelectSku: {},
    /*取销售价格*/
    GetSalePrice: function () {
        var msg = page_yaotv_product_detail.productDetailData;
        if (msg.vipSpecialActivity == g_const_YesOrNo.YES)
            return msg.vipSpecialPrice.toString();
        else {
            if (msg.minSellPrice == msg.maxSellPrice)
                return msg.minSellPrice.toString();
            else
                return msg.minSellPrice.toString() + "-" + msg.maxSellPrice.toString();
        }
    },
    g_GetPictrue: function (picurl) {
        if (picurl == "")
            return g_goods_Pic;
        else
            return picurl;
    },
    renderTemplate: function (template, data) {
        var s = template.replace(g_const_regex_template, function (fullMatch, capture) {
            if (data[capture])
                return data[capture];
            else
                return "";
        });
        return s;
    },
    ShowMesaage: function (sMessage) {
        new Toast({ context: $('body'), message: sMessage, top: '50%' }).show();
    },
    GetQueryString: function (name) {
        var results = new RegExp('[\\?&]' + name + '=([^&#]*)', "ig").exec(window.location.href);
        if (results != null)
            return results[1];
        else
            return "";
    },
    AutoRefresh: function () {
        var objInterval = window.setTimeout(function () {
            console.log("自动刷新");
            window.location.reload(true);

        }, 5 * g_const_minutes);
    },
    /*显示模板类型*/
    ShowType: {
        /*普通(特价,闪购)*/
        Normal: 1,
        /*秒杀*/
        SecKill: 2,
        /*扫码购*/
        Qrcode: 3
    },
    /*获取显示类型*/
    GetShowType: function () {
        if (page_yaotv_product_detail.productCode.indexOf("IC_SMG_") == 0)
            return page_yaotv_product_detail.ShowType.Qrcode;
        else if (page_yaotv_product_detail.productCode.indexOf("IC") == 0)
            return page_yaotv_product_detail.ShowType.SecKill;
        else
            return page_yaotv_product_detail.ShowType.Normal;
    }
};