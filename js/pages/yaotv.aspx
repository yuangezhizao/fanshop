<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="yaotv.aspx.cs" Inherits="com.hjy.fan.WebTouch.js.pages.yaotv" %>

//<script>
    var page_yaotv_product_detail = {
        //商品详情数据
        productDetailData: {},
        //商品活动数据（价格相关）
        productActInfoData: {},
        //前置商品编号
        productCode:"",
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
            page_yaotv_product_detail.GetData();
            page_yaotv_product_detail.LoadData();
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
        //获取数据
        GetData: function () {
            page_yaotv_product_detail.productCode = "<%=productCode%>";
            page_yaotv_product_detail.productDetailData = {<%=productDetailData%> };
            page_yaotv_product_detail.productActInfoData = {<%=productActInfoData%> };
            if (!page_yaotv_product_detail.productDetailData.hasOwnProperty("productCode") || !page_yaotv_product_detail.productActInfoData.hasOwnProperty("skus") || page_yaotv_product_detail.productCode=="") {
                page_yaotv_product_detail.productCode = "134024";
                page_yaotv_product_detail.productDetailData = { "resultLast": "2015-11-23 15:56:18", "resultCache": 60, "resultCode": 1, "resultMessage": "", "productCode": "134024", "productName": "澳格菲薰衣草精油洗护4件组（柔顺洗发露、亮泽护发乳、舒缓沐浴露、嫩白身体乳）", "sellPrice": 49, "marketPrice": 74, "flagSale": 1, "productStatus": "4497153900060002", "videoUrl": "", "brandName": "澳格菲", "brandCode": "44971602100343", "mainpicUrl": { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/21777d7925ec400f8f5eb3c877f5bed7.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/15c7fe8415414f2995de6edaa60e038b.jpg", "width": 0, "height": 1080, "oldWidth": 0, "oldHeight": 0 }, "productComment": [], "highPraiseRate": "", "commentSumCounts": 0, "pcPicList": [{ "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/21777d7925ec400f8f5eb3c877f5bed7.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/15c7fe8415414f2995de6edaa60e038b.jpg", "width": 0, "height": 1080, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/5e3468aff7574a66b409bc26f4f3d57f.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/b3d9756cf45246f88b1a9f46bfa4f196.jpg", "width": 0, "height": 1080, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/99de0bb9cbfb497aae0a0956bad3c0a6.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/ca71700e30e44a79b3580ecb17a1d4e8.jpg", "width": 0, "height": 1080, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/0b7d68e1a040481084aa23979efb2105.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/df47cbfd93024adfb765c8945349e191.jpg", "width": 0, "height": 1080, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/3b2fd40dd8514c7e95290594a251c670.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/464c1f2cb290448eaa5f9f2f9ae7d465.jpg", "width": 0, "height": 1080, "oldWidth": 0, "oldHeight": 0 }], "discriptPicList": [{ "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/a02add233b9a4271a9b3bc9a42ec6332.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/435824a5b287499d99a989b22a7b7e9e.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/c46ee0e423154ca5a0b883527c951f08.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/bffaccf2abee4fba91e0d1a82202be1f.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/e7d4d2d988b8430fb08c17de94501084.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/35a25a738ae648b4ab0e22256d034f45.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/6c7691998f994e86b7bb10ecce746fb0.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/06c2e12de72f4be3a6978a3b87600adb.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/fa252c65a5774cc3a59c07e7b286f409.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/a0f0c1b20ca34ff8aaf00e3f4e56f254.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/419c3c873d484d39980b0edc92499a4a.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/10e36c53e2214fa7a8caf4b93552cc7a.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/287349c5083943f1879201f28b9fd878.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/2c2a891bf09d4212aa2a912210383a1a.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/3c0d6c4532bc42248be9873335b26498.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/889a8d5193e3499a9ab882fc9ced1473.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/b94606b177d64eb0a70f28afdb1af2f1.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/f40b907da7fb4e619d632fcc5669dbfe.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/4b0ca8758f5b456db6e18241f25ec7f4.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/d0247ce893de46258dc75275bef6ad87.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/e51ebbb16da94451890373db15aefbff.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/a7bb075604e84bbc80dd16cb8d887864.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/291a313bb8994b43b412715ad4ab3dd8.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/8a8f5526e1074019824de22170e3fab6.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/89edd8e5947b423eae1a1f4c2cccdb4c.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/838131982eaf4e95b88981cd60c3d752.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/2af7206c1b81434e8309911b8b203aec.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/4cf60e9833914976840672e75ada32f2.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/3187d813a8004027bc5f6b0bc8bee28a.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/edfd214eae1c4175ba7eeb810ac82093.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/632f1ea11ce54c6bb74bfadcaf44cb46.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/fc5080d7ce274ddc859642dc12058467.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/bc730fe3d3a140f08af189a96909a398.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/76e32d888b39448aafa34af8524ee9a0.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/2909f9403ebd43a8b3ce3e0a253b3b5a.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/2cf99e0e6fd04b01b8e8379beb026ed4.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/4e82798aade64b88aa224e0985eac3fc.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/e74105a33d7e48ef80a1e7ddc0f80ee4.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/afc1114a43cf46199f78476e9ec5a5ed.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/d1e7a7a1febb4c10b78e06a148cc2bfe.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/94ff37ed732d4f1ab7cc65502cec89ea.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/d1f6eb174b9440a2ae600f9e3fef8b16.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/ee4093053f624486861fe317e2644e93.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/19f71633f6e74ed8844b6403720690e5.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/a1821246985c419a9f796912bca17810.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/931565a8565540f99841322993d68cb7.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/c1b9eebc412b4b31a97c9359b66dc557.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/2c9ce8bfcaba453cb3b9b2b7a4118bbb.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }, { "picOldUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/024e098232e649ef949feb6f2b43b411.jpg", "picNewUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/imzoom/24dee/791d67f9edff40a99d7b48956462bfce.jpg", "width": 0, "height": 338, "oldWidth": 0, "oldHeight": 0 }], "skuList": [{ "skuCode": "134024", "skuName": "澳格菲薰衣草精油洗护4件组（柔顺洗发露、亮泽护发乳、舒缓沐浴露、嫩白身体乳）", "keyValue": "color_id=0&style_id=0", "stockNumSum": 9834, "sellPrice": 49, "marketPrice": 74, "activityInfo": [], "vipSpecialPrice": "0", "disMoney": 0.49, "skuMaxBuy": 99, "miniOrder": 1, "limitBuy": 99 }], "discriptInfo": "澳格菲薰衣草精油丝质柔顺洗发露：含有名贵的薰衣草精油，在洁净头皮和发丝的同时滋养头皮，滋润发丝。令发丝充盈饱满富有弹性。独有的去屑成份能长时间抑制头屑的产生，防止头痒，令秀发更健康更清爽。 澳格菲薰衣草精油锁色亮泽护发乳：蕴含名贵的薰衣草精油和维他命等营养成份，滋养秀发，修护发丝，均衡补充头发营养，令发丝充盈有弹性；特效丝滑配方，防止头发毛糙打结。使秀发柔顺，动感飘逸。 澳格菲薰衣草精油水嫩舒缓沐浴露：温和清洁肌肤，去除老化角质，含有名贵的薰衣草精油成分，改善肤质防止瘙痒及干燥脱皮问题，提升肌肤透明度及光泽，令肌肤更健康清爽。泡沫丰富，温和，无滑腻感。浴后留有淡淡的馨香，让您倍感舒适，更添无限魅力。 澳格菲薰衣草精油舒缓嫩白身体乳：蕴含薰衣草精油，能快速滋养肌肤，平衡油脂分泌，促进肌肤养分摄取，舒缓肌肤并合理补充水分，使肌肤得到长时间的滋润，时刻展现晶莹剔透的亮丽肤色；使肌肤既柔软又具活力，令肌肤光彩润泽。", "labelsList": [""], "maxBuyCount": 99, "propertyList": [{ "propertyKeyCode": "color_id", "propertyKeyName": "颜色", "propertyValueList": [{ "propertyValueCode": "0", "propertyValueName": "共同" }] }, { "propertyKeyCode": "style_id", "propertyKeyName": "款式", "propertyValueList": [{ "propertyValueCode": "0", "propertyValueName": "共同" }] }], "propertyInfoList": [{ "propertykey": "商品编码", "propertyValue": "134024" }, { "propertykey": "明细", "propertyValue": "澳格菲薰衣草精油丝质柔顺洗发露200ml*1;\n澳格菲薰衣草精油锁色亮泽护发乳200ml*1;\n澳格菲薰衣草精油水嫩舒缓沐浴露200ml*1;\n澳格菲薰衣草精油舒缓嫩白身体乳200ml*1\n" }, { "propertykey": "保质期", "propertyValue": "3年" }, { "propertykey": "建议", "propertyValue": "在使用本品之前进行防敏测试，如有异常请停止使用。" }, { "propertykey": "商品信息", "propertyValue": "品名：澳格菲薰衣草精油洗护四件套\n商品组成：澳格菲薰衣草精油丝质柔顺洗发露200ml*1;\n澳格菲薰衣草精油锁色亮泽护发乳200ml*1;\n澳格菲薰衣草精油水嫩舒缓沐浴露200ml*1;\n澳格菲薰衣草精油舒缓嫩白身体乳200ml*1\n品牌：澳格菲\n保质期:3年\n建议：在使用本品之前进行防敏测试，如有异常请停止使用。" }], "flagCheap": 0, "exitVideo": 0, "flagIncludeGift": 0, "gift": "", "authorityLogo": [{ "logoContent": "正品保障", "logoPic": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24abe/86eadab0ed714ef28500c0da94ecf201.png", "logoLocation": 5 }, { "logoContent": "全场包邮", "logoPic": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24abe/2097b594abc749e2a3f19fbb6cc7dce3.png", "logoLocation": 4 }, { "logoContent": "7天无理由退货", "logoPic": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24abe/e6a858e2206d4c149eadd8bc82461586.png", "logoLocation": 3 }], "endTime": "", "familyPriceName": "家有价", "discount": 25.00, "disMoney": 0.49, "shareUrl": "http://share.ichsy.com/s/p/134024", "saleNum": "274", "collectionProduct": 0, "vipSpecialActivity": 0, "vipSpecialTip": "", "vipSpecialPrice": "0", "limitBuyTip": "限购99件", "priceLabel": "", "vipSecKill": 0, "buttonMap": { "buyBtn": 1, "shopCarBtn": 1, "callBtn": 1 }, "minSellPrice": "49", "maxSellPrice": "49", "sysDateTime": "2015-11-23 15:56:18", "otherShow": [], "flagTheSea": "0", "commonProblem": [] };
                page_yaotv_product_detail.productActInfoData = { "resultCode": 1, "resultMessage": "", "skus": [{ "skuCode": "134024", "sellPrice": 49.00, "sellNote": "", "sourcePrice": 74.00, "sourceNote": "市场价", "skuPrice": 49.00, "buttonText": "立即购买", "buyStatus": 1, "maxBuy": 0, "minBuy": 1, "limitStock": 9834, "limitBuy": 99, "limitSecond": -1, "itemCode": "", "eventCode": "", "eventType": "", "productCode": "134024", "productPicUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24d13/21777d7925ec400f8f5eb3c877f5bed7.jpg", "smallSellerCode": "SI2003", "validateFlag": "N", "skuKeyvalue": "颜色=共同&款式=共同", "skuPicUrl": "http://image.sycdn.ichsy.com/cfiles/staticfiles/upload/24b8f/b202d78650934ed59793fe82c83e715e.jpg", "skuName": "澳格菲薰衣草精油洗护4件组（柔顺洗发露、亮泽护发乳、舒缓沐浴露、嫩白身体乳）" }], "events": [], "buttonControl": 2, "marketPrice": "74.00", "sellPrice": "49.00", "skuPrice": "49.00", "buttonText": "立即购买", "buyStatus": 1, "limitSecond": -1 };
            }
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
//</script>