/// <reference path="../functions/g_Type.js" />
/// <reference path="../functions/g_Const.js" />
/// <reference path="../g_header.js" />
/// <reference path="../jquery-2.1.4.js" />



function test_item(n) {
    var menu = document.getElementById("menu");
    var menuli = menu.getElementsByTagName("li");
    for (var i = 0; i < menuli.length; i++) {
        menuli[i].className = "";
        menuli[n].className = "on";
        document.getElementById("tabc" + i).className = "no";
        document.getElementById("tabc" + n).className = "tabc";
    }
}


var _sharephone = "";
var _temp_sku_price = "";

$(document).ready(function () {
	$("#img_gd_name").hide();	
	$("#div_left_time").empty();
	$("#img_gd_name").attr("src","");
    _temp_sku_price = "";

    UserLogin.Check(Product_Detail.AddToHsitory);
    if (window.parent && window.parent.location.href != window.location)
        window.parent.location = window.location;
    $(".app-close").on("click", function (e) {
        $(e.target).parent().css("display", "none");
    });
    $("#btnOpenApp1").click(function () {
        PageUrlConfig.SetUrl();
        openApp();
    });
    $("#btnOpenApp2").click(function () {
        PageUrlConfig.SetUrl();
        openApp();
    });
    $("#btnOpenApp3").click(function () {
        PageUrlConfig.SetUrl();
        openApp();
    });
    $("#btnlqfxtq").click(function () {
        location.href = g_const_PageURL.Lqfxtq_Op + "?t=" + Math.random() + "&sharephone=" + _sharephone;
    });
});

//通过判断wxfrom=web，记录返回页面，实现从专题页面来的，在微信商城中点后退时可以正常返回
if (GetQueryString("wxfrom") != "") {
    try {
        //保存来源页
        PageUrlConfig.SetUrl(document.referrer);
    }
    catch (e) {

    }
}

    //396 保存sku对应图片
var skupicurl_data = [];

var Product_Detail = {
    /*396 点击SKU后，替换显示图片*/
    ChangeSkuPic: function (skuName) {
        var unfind = true;
        for (var i = 0; i < skupicurl_data.length; i++) {
            //获取选中的sku
            if (skuName == skupicurl_data[i].skuName) {
                $("#img_skupic").attr("src", skupicurl_data[i].skuPicUrl);
                unfind = false;
                break;
            }
        }
        //没有找到，显示默认图片
        if (unfind) {
            $("#img_skupic").attr("src", $("#hid_defaultSkuPic").val());
        }
    },
    /*秒杀更新sku价格和限购信息*/
    UpdateSkuListBySecKill: function (msg) {

        //396 新增sku对应图片  开始
        skupicurl_data = [];
        //396 新增sku对应图片  结束

        //396 活动图片  开始
        var ProductActivity396=msg.events;
        for (var k = 0; k < ProductActivity396.length; k++) {
            if (ProductActivity396[0].productEventPic != "") {
                //设置背景图
                //$("#img_spec_class_pic_1").attr("src",ProductActivity396[0].productEventPic);
                //$("#div_spec_class_notshangou").show();

                $("#div_spec_class").attr("style", "background:url('" + ProductActivity396[0].productEventPic + "') no-repeat; background-size:100% 100%;");
                $("#div_spec_396").show();


            }
            break;
        }
        //396 活动图片  开始

        if (Product_Detail.SkuSecKillLoaded) {

            var skulist = Product_Detail.api_response.skuList;
            var seckillskulist = msg.skus;
            for (var k = 0; k < skulist.length; k++) {
                var sku = skulist[k];
                var bfind = false;
                for (var kk = 0; kk < seckillskulist.length; kk++) {
                    var seckillsku = seckillskulist[kk];
                    if (sku.skuCode.Trim() == seckillsku.skuCode.Trim()) {
                        Product_Detail.api_response.skuList[k].sellPrice = seckillsku.sellPrice;
                        Product_Detail.api_response.skuList[k].skuMaxBuy = seckillsku.maxBuy;
                        Product_Detail.api_response.skuList[k].stockNumSum = seckillsku.limitStock;
                        Product_Detail.api_response.skuList[k].itemCode = seckillsku.itemCode;
                        Product_Detail.api_response.skuList[k].limitBuyTip = "已达购买限制数" + seckillsku.limitBuy + "件";

                        //396 记录sku对应的图片
                        var temp_skupic = {};
                        temp_skupic.skuName = seckillsku.skuKeyvalue;
                        temp_skupic.skuPicUrl = seckillsku.skuPicUrl.Trim();
                        skupicurl_data.push(temp_skupic);
                        //396 增加结束

                        bfind = true;
                        break;
                    }
                }
                if (!bfind) {
                    Product_Detail.api_response.skuList[k].stockNumSum = 0;
                    Product_Detail.api_response.skuList[k].itemCode = "";
                }
            }
            Product_Detail.api_response.skuList = skulist;
            if (Product_Detail.api_response.skuList.length == 1) {
                //只有1种样式
                Product_Detail.SelectSku = Product_Detail.api_response.skuList[0];
                Product_Detail.RefershPrice(Product_Detail.SelectSku.keyValue);
                $(".nprice").empty();
                $(".nprice").append("<em>￥" + Product_Detail.api_response.skuList[0].sellPrice + "</em>");
                $(".pprice").empty();
                $(".pprice").append("<b>￥</b>" + Product_Detail.api_response.skuList[0].sellPrice);
            }
            Product_Detail.AfterLoadDetail(Product_Detail.api_response);
        }
    },
    /*刷新秒杀库存信息*/
    RefreshSecKill: function () {

        if (Product_Detail.GetShowType() == Product_Detail.ShowType.SecKill) {
            var objInterval = window.setInterval(function () { Product_Detail.LoadSecKillInfo() }, 5 * g_const_minutes);
            Product_Detail.IntervalArr.push(objInterval);
        }
    },
    /*Interval*/
    IntervalArr: [],
    /*读取秒杀信息*/
    LoadSecKillInfo: function (msg) {

        Product_Detail.SkuSecKillLoaded = false;

        if (UserLogin.LoginStatus == g_const_YesOrNo.YES)
            g_type_api.api_token = g_const_api_token.Wanted;
        else
            g_type_api.api_token = g_const_api_token.Unwanted;
        g_type_api.api_input = {
            version: 1.0,
            /*用逗号分隔,传入活动明细编号IC开头的编号*/
            code: Product_Detail.api_input.productCode,
            /*用户编号，除非特别要求下默认情况下请传空*/
            memberCode: "",
            /*地址区域编号，用于分仓分库存使用，默认情况下传空*/
            areaCode: "",
            /*来源编号,用于分来源显示不同价格，默认情况下传空*/
            sourceCode: ""
        };
        g_type_api.api_target = "com_srnpr_xmasproduct_api_ApiSkuInfo";
        g_type_api.api_url = g_APIUTL;
        g_type_api.LoadData(Product_Detail.LoadSecKill, "");
    },
    /*分享而来时的操作*/
    FromShare: function () {
        var fromshare = GetQueryString("fromshare");
        var smember = localStorage[g_const_localStorage.Member];

        var phoneno = decodeURIComponent(GetQueryString("wxPhone"));
        if (phoneno == "")
            phoneno = decodeURIComponent(GetQueryString("phoneno"));
        _sharephone = encodeURIComponent(phoneno);
        if (fromshare.Trim() == g_const_YesOrNo.YES.toString()) {
            if (phoneno != "") {
                try {
                    phoneno = Base64.base64decode(phoneno);
                }
                catch (e) {
                    phoneno = "";
                }

                if (phoneno.length == 11) {
                    phoneno = phoneno.substr(0, 3) + "****" + phoneno.substr(7, 4);
                }
                $("#sharephone").text(phoneno);
            }
            $("#bodycontent .top").css("display", "block");
            $("#bodycontent .btn-close").on("click", function (e) {
                $("#bodycontent .top").css("display", "none");
            });
            $("#bodycontent .app").css("display", "none");
        }
        else {
            if (GetQueryString("from") != g_const_Merchant_Group_Android && GetQueryString("from") != g_const_Merchant_Group_Ios) {
                $("#bodycontent .app").css("display", "block");
            }
        }
    },
    /*设定微信分享按钮*/
    SetWXShare: function () {
        if (IsInWeiXin.check()) {
            var phoneno = "";
            var shareurl = "http://" + window.location.host + window.location.pathname;
            var shareparam = "pid=" + Product_Detail.api_input.productCode;
            shareparam += "&fromshare=" + g_const_YesOrNo.YES.toString();
            shareparam += "&_r=" + Math.random().toString();
            var smember = localStorage[g_const_localStorage.Member];
            var member = null;
            if (typeof (smember) != "undefined") {
                member = JSON.parse(smember);
            }
            if (member != null)
                shareparam += "&wxPhone=" + encodeURIComponent(member.Member.phone);
            WX_JSAPI.wx = wx;
            WX_JSAPI.wxparam.debug = false;
            WX_JSAPI.dataUrl = "";
            WX_JSAPI.desc = Product_Detail.api_response.productName;
            WX_JSAPI.imgUrl = Product_Detail.api_response.mainpicUrl.picNewUrl;
            WX_JSAPI.link = shareurl + "?" + shareparam;
            WX_JSAPI.title = g_const_Share.DefaultTitle;
            WX_JSAPI.type = g_const_wx_share_type.link;
            WX_JSAPI.LoadParam(g_const_wx_AllShare);
        }
    },
    /*初始化*/
    Init: function () {

        Product_Detail.FromShare();

        $(".fl.jt").on("click", function () {
            //var gobackurl=PageUrlConfig.BackTo(1);
            //while(gobackurl.indexOf("OrderConfirm")>0 || gobackurl.indexOf("Product_Detail")>0){
            //    gobackurl=PageUrlConfig.BackTo(1);
            //}

            Merchant_Group.Back();
        });
        //$(".bottom span").on("click", function () {
        //    Product_Detail.tostIsCall();
        //});
        //$("#maintelbuy").on("click", function () {
        //    Product_Detail.tostIsCall();
        //});

        $("#mainaddtocart").on("click", function (e) {
            if ($("#mainaddtocart").attr("class").indexOf("gray") == -1)
                Product_Detail.OpenSKULayer($(e.target).attr("operate"));
        });
        $("#mainbuy").on("click", function (e) {
            if ($("#mainbuy").attr("class").indexOf("gray") == -1)
                Product_Detail.OpenSKULayer($(e.target).attr("operate"));
        });

        switch (Product_Detail.GetShowType()) {
            case Product_Detail.ShowType.SecKill:
                $("#mainbuy").css("display", "none");
                $("#mainaddtocart").css("display", "none");
                //$("#maintelbuy").css("display", "none");
                $("#mainseckillbuy").css("display", "");
                $(".ch-icon .ch01").css("display", "none");
                $("#app_com").css("display", "");
                $("#app_smg").css("display", "none");
                $("#bottom_div").attr("style", "bottom:0px");
                break;
            case Product_Detail.ShowType.Normal:
                $("#mainbuy").css("display", "");
                $("#mainaddtocart").css("display", "");
                //$("#maintelbuy").css("display", "");
                $("#mainseckillbuy").css("display", "none");
                $(".ch-icon .ch01").css("display", "");
                $("#app_com").css("display", "");
                $("#app_smg").css("display", "none");
                $("#bottom_div").attr("style", "bottom:0px");
                break;
            case Product_Detail.ShowType.Qrcode:
                $("#mainbuy").css("display", "");
                $("#mainbuy").attr("class", "star");
                $("#sku_buy").attr("class", "star");
                //$("#maintelbuy").css("display", "none");
                $("#mainaddtocart").css("display", "none");
                $("#mainseckillbuy").css("display", "none");
                $(".ch-icon .ch01").css("display", "");
                $("#app_com").css("display", "none");
                $("#app_smg").css("display", "");
                $("#bottom_div").attr("style", "bottom:51px");
                $("#sp_dismoney").parent().css("display", "none");
                //$("#div_wxsmg").hide();
                break;
        }
        if (GetQueryString("fromshare")=="1") {
            $("#app_com").css("display", "none");
            $("#bottom_div").attr("style", "bottom:0px");
        }
        $("#mask").css("display", "block");
        $("#pageloading").css("display", "block");
        Product_Detail.GetCartCount();
    },
    /*获取购物车的中商品的数量*/
    "GetCartCount": function () {
        $(".ch-icon .ch02").empty();
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
        var html = "<i>" + scount + "</i>";
        if (icount == 0)
            html = "";
        $(".ch-icon .ch02").append(html);
        $(".ch-icon .ch02").on("click", function (e) {

            //  localStorage[g_const_localStorage.BackURL] = location.href;

            PageUrlConfig.SetUrl();
            window.location.href = g_const_PageURL.Cart + "?t=" + Math.random();
        });
    },
    /*记录浏览历史*/
    AddToHsitory: function () {
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            //g_type_history.ObjHistory.marketPrice = Product_Detail.SkuKillResponse.marketPrice.toString();
            //g_type_history.ObjHistory.picture = Product_Detail.api_response.mainpicUrl.picNewUrl.Trim();
            //g_type_history.ObjHistory.pname = Product_Detail.api_response.productName.Trim();
            g_type_history.ObjHistory.product_code = Product_Detail.api_response.productCode;
            //g_type_history.ObjHistory.saleNum = Product_Detail.api_response.saleNum;
            //g_type_history.ObjHistory.SalePrice = Product_Detail.GetSalePrice();
            g_type_history.ADD(g_type_history.ObjHistory);
        }
    },
    /*是否使用Event接口*/
    IsUseEventAPI: function () {
        if (Product_Detail.GetShowType() != Product_Detail.ShowType.Normal) {
            return true;
        }
        else
            return true;
    },
    /*获取显示类型*/
    GetShowType: function () {
        var re = new RegExp("IC_(\\S+)_(\\d+)", "i");
        //if (Product_Detail.api_input.productCode.indexOf("IC_SMG_") == 0 || Product_Detail.api_input.productCode.indexOf("IC_DM_") == 0)
        if (re.test(Product_Detail.api_input.productCode))
            return Product_Detail.ShowType.Qrcode;
        else if (Product_Detail.api_input.productCode.indexOf("IC") == 0)
            return Product_Detail.ShowType.SecKill;
        else
            return Product_Detail.ShowType.Normal;
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
    /*接口名称*/
    api_target: "",
    /*输入参数*/
    api_input: { "picWidth": 0, "productCode": "", "buyerType": "", "version": 1.0 },
    /*用户Token*/
    api_token: "",
    /*接口响应对象*/
    api_response: {},
    /*获取商品详情*/
    GetDetail: function () {
        var s_api_input = JSON.stringify(Product_Detail.api_input);
        if (Product_Detail.IsUseEventAPI())
            Product_Detail.api_target = "com_cmall_familyhas_api_ApiGetEventSkuInfoNew";
        if (UserLogin.LoginStatus == g_const_YesOrNo.YES)
            Product_Detail.api_token = g_const_api_token.Wanted;
        else
            Product_Detail.api_token = g_const_api_token.Unwanted;
        var obj_data = { "api_input": s_api_input, "api_target": Product_Detail.api_target, "api_token": Product_Detail.api_token };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            $("#mask").css("display", "none");
            $("#pageloading").css("display", "none");
            Product_Detail.api_response = msg;
            if (msg.resultCode == g_const_Success_Code) {
                Product_Detail.LoadSecKillInfo(msg);
                Product_Detail.LoadProductProperty(msg);
                Product_Detail.Load_Recommend();
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            $("#mask").css("display", "none");
            $("#pageloading").css("display", "none");
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //调用商品详情接口后
    AfterLoadDetail: function (msg) {
        if (Product_Detail.IsSoldOut()) {
            $("#div_productStatus").empty();
            $("#div_productStatus").append("没货啦,下次早点来哦~");
            $("#mainaddtocart").addClass("gray");
            $("#mainbuy").addClass("gray");
        }
        if (Product_Detail.api_response.productStatus != g_const_productStatus.Common) {
            $("#div_productStatus").empty();
            $("#div_productStatus").append("该商品已下架,下次早点来哦~");
            $("#mainaddtocart").addClass("gray");
            $("#mainbuy").addClass("gray");
        }
        Product_Detail.SetWXShare();

        //商品名称
        $("#productName").html(msg.productName.Trim());
        //买点信息
        if (msg.sellingPoint != "") {
            $("#div_good_tip").html(msg.sellingPoint);
            $("#div_good_tip").show();
        }
        else {
            $("#div_good_tip").hide();
        }

        //  $(".bianh")[0].innerHTML = "商品编号：<span>" + msg.productCode + "</span>";
        $("#sp_month").html(msg.saleNum);
        $("#sp_dismoney").html("￥" + msg.disMoney + (UserLogin.LoginStatus == g_const_YesOrNo.YES ? "" : " 起"));
        $(".sc .bh").html(msg.productCode);
        //3.9.4 从接口获取图片
        if (msg.labelsPic != "" && !(msg.labelsPic == undefined)) {
            $("#img_gd_name").attr("src", msg.labelsPic);
            $("#img_gd_name").show();
        }
        else
            $("#img_gd_name").hide();



        Product_Detail.LoadCollection(msg);
        Product_Detail.Load_pcPicList(msg);
        Product_Detail.LoadPrice(msg);
        Product_Detail.LoadflagCheap(msg);
        Product_Detail.LoadPromotion(msg);
        Product_Detail.InitSkySelecter();

        Product_Detail.LoadAuthorityLogo(msg);
        Product_Detail.LoadDiscriptPicList(msg);
        Product_Detail.LoadPropertyInfoList(msg);
        Product_Detail.LoadproductComment(msg);
        Product_Detail.Load_Address(msg);
        Product_Detail.SetSecKill();
        Product_Detail.AddToHsitory();
        Product_Detail.LoadCommonQuestion(msg);
        var _callback = decodeURIComponent(GetQueryString("callback"));
        if (_callback != "")
            eval(_callback);


    },
    //更新底部按钮
    LoadBtnInfo: function (msg) {
        var control = msg.buttonControl;
        //1：加入购物车，立即购买，2：电话订购+加入购物车+立即购买，3：电话订购+立即购买，4：立即购买，5：按钮上带倒计时的立即购买
        switch (control) {
            case 1:
                //$("#maintelbuy").hide();
                break;
            case 2:
                break;
            case 3:
                $("#mainaddtocart").hide();
                break;
            case 4:
                //$("#maintelbuy").hide();
                $("#mainaddtocart").hide();
                break;
            case 5:
                //$("#maintelbuy").hide();
                $("#mainbuy").hide();
                $("#mainaddtocart").hide();
                $("#mainseckillbuy").show();
                break;
        }
    },
    /*判断是否有库存(抢光了)*/
    IsSoldOut: function () {
        var bsoldout = true;
        var skuSecKill = Product_Detail.SkuKillResponse;
        if (skuSecKill != null) {
            if (skuSecKill.buyStatus == g_const_buyStatus.ActIsEnd || skuSecKill.buyStatus == g_const_buyStatus.No || skuSecKill.buyStatus == g_const_buyStatus.Other)
                bsoldout = true;
            else
                bsoldout = false;
        }
        else
            bsoldout = false;
        return bsoldout;
    },
    LoadCommonQuestion: function (msg) {
        if (msg.flagTheSea == 1) {
            var strhtml = "";
            $.each(msg.commonProblem, function (i, n) {
                strhtml += "<li><h4>" + n.title + "</h4>";
                strhtml += "<p>" + n.content + "</p></li>";
            });
            $("#div_commonquestion").html(strhtml);
            //$("#div_detaillist").attr("class", "box overseas");
            if (strhtml != "") {
                $("#li_commonquestion").show();
            }
            else {
                $("#li_commonquestion").hide();
            }
        }
        else {
            $("#li_commonquestion").hide();
        }

    },
    /*秒杀价格和库存接口响应对象*/
    SkuKillResponse: null,
    /*解析秒杀商品SKU的价格和库存*/
    LoadSecKill: function (msg) {
        Product_Detail.SkuKillResponse = msg;



        Product_Detail.SkuSecKillLoaded = true;

        Product_Detail.UpdateSkuListBySecKill(msg);

        Product_Detail.LoadBtnInfo(msg);

    },
    //设定秒杀
    SetSecKill: function () {
        var msg = Product_Detail.SkuKillResponse;
        $("#mainseckillbuy").text(msg.buttonText);
        $("#sku_seckill_button").text(msg.buttonText);
        //$("#div_productStatus").empty();
        switch (msg.buyStatus) {
            case g_const_buyStatus.YES:
                $("#mainseckillbuy").attr("class", "star");
                $("#mainseckillbuy").off("click");
                $("#mainseckillbuy").on("click", function (e) {
                    if ($(this).attr("class").indexOf("end") == -1)
                        Product_Detail.OpenSKULayer($(e.target).attr("operate"));
                });

                $("#sku_seckill_button").attr("class", "ch-seckill curr");
                $("#sku_seckill_button").off("click");
                $("#sku_seckill_button").on("click", function (e) {
                    if ($(this).attr("class") != "ch-seckill")
                        Product_Detail.OnBuyClick(e);
                });
                Product_Detail.SetSecKillButton();
                break;
            case g_const_buyStatus.ActNotStart:
                Product_Detail.SetSecKillButton();
                $("#mainseckillbuy").attr("class", "end");
            default:
                $("#mainseckillbuy").attr("class", "end");
                break;
        }
    },
    //设定秒杀活动按钮
    SetSecKillButton: function () {

        var msg = Product_Detail.SkuKillResponse;
        if (Product_Detail.GetShowType() == Product_Detail.ShowType.SecKill) {
            for (var k in Product_Detail.TimeOutArr) {
                window.clearTimeout(Product_Detail.TimeOutArr[k].value);
            }
            Product_Detail.TimeOutArr = [];

            var endTime = Date.Parse(Product_Detail.api_response.sysDateTime).AddSeconds(msg.limitSecond);
            Product_Detail.ShowLeftTimeButton(endTime, msg.buyStatus, $("#mainseckillbuy"));
            Product_Detail.ShowLeftTimeButton(endTime, msg.buyStatus, $("#sku_seckill_button"));
        }
    },
    /*是否读取完毕秒杀价*/
    SkuSecKillLoaded: false,
    /*秒杀倒计时*/
    ShowLeftTimeButton: function (date_last, buystatus, objbutton) {
        var showtext, fintval = 100;

        var date_now = new Date();
        var ts = date_last.getTime() - date_now.getTime();  //时间差的毫秒数             

        var days = Math.floor(ts / g_const_days);
        var leftmillionseconds = ts % g_const_days;

        var hours = Math.floor(leftmillionseconds / g_const_hours);
        leftmillionseconds = leftmillionseconds % g_const_hours;

        var minutes = Math.floor(leftmillionseconds / g_const_minutes);
        leftmillionseconds = leftmillionseconds % g_const_minutes;

        var seconds = Math.floor(leftmillionseconds / g_const_seconds);

        //leftmillionseconds = leftmillionseconds % 100;
        var mseconds = Math.floor(leftmillionseconds / 100);


        var hourstring = "0" + hours.toString();
        hourstring = hourstring.substr(hourstring.length - 2, 2);
        var minutestring = "0" + minutes.toString();
        minutestring = minutestring.substr(minutestring.length - 2, 2);

        var secondstring = "0" + seconds.toString();
        secondstring = secondstring.substr(secondstring.length - 2, 2);
        var msecondstring = mseconds.toString();
        msecondstring = msecondstring.substr(msecondstring.length - 1, 1);

        showtext = days.toString() + "天" + hourstring + ":" + minutestring + ":" + secondstring + "." + msecondstring;
        switch (buystatus) {
            case g_const_buyStatus.YES:
                showtext += "后结束,立即购买"
                break;
            case g_const_buyStatus.ActNotStart:
                showtext += "后开始"
                break;
            case g_const_buyStatus.ActIsEnd:
                showtext = "已结束"
                break;
        }
        objbutton.text(showtext);
        if ((days != 0 || hours != 0 || minutes != 0 || seconds != 0 || mseconds != 0) && 1 == 1) {
            var objtimeout = { id: objbutton.attr("id"), value: 0 };
            objtimeout.value = window.setTimeout(function () { Product_Detail.ShowLeftTimeButton(date_last, buystatus, objbutton) }, fintval);
            var bexist = false;
            for (var k in Product_Detail.TimeOutArr) {
                if (Product_Detail.TimeOutArr[k].id == objtimeout.id) {
                    Product_Detail.TimeOutArr[k].value = objtimeout.value;
                    bexist = true;
                }
            }
            if (!bexist)
                Product_Detail.TimeOutArr.push(objtimeout);


        }
        else {
            switch (buystatus) {
                case g_const_buyStatus.YES:
                    showtext = "已结束"
                    if (objbutton.attr("id") == "mainseckillbuy")
                        objbutton.attr("class", "gray");
                    else
                        objbutton.attr("class", "ch-seckill");
                    break;
                case g_const_buyStatus.ActNotStart:
                    showtext = "已开始,立即购买"
                    if (objbutton.attr("id") == "mainseckillbuy")
                        objbutton.attr("class", "");
                    else
                        objbutton.attr("class", "ch-seckill curr");
                    break;
                    break;

            }
            objbutton.text(showtext);

            //396 闪购倒计时 开始
            $("#div_spec_class_time").html("<p>" + showtext + "</p>");
            $("#div_spec_class").show();
            //396 闪购倒计时 结束

        }
    },
    /*TimeOut数组*/
    TimeOutArr: [],
    /*读取收藏信息*/
    LoadCollection: function (msg) {
        if (msg.collectionProduct == g_const_collectionProduct.NO)
            $("#a_Collection").attr("class", "gr");
        $("#a_Collection").on("click", function (e) {
            var operate;
            if ($("#a_Collection").attr("class") == "gr")
                operate = "add";
            else
                operate = "cancel";
            Product_Detail.OperateCollection(operate);
        });
    },
    /*添加或者取消收藏*/
    OperateCollection: function (operate) {


        var productCode = ["" + Product_Detail.api_response.productCode + ""];
        var objcollecttion = $("#a_Collection");
        var str_callback = encodeURIComponent("Product_Detail.OperateCollection('" + operate + "')");
        if (objcollecttion.attr("class") == "gr") {
            //添加收藏 
            if (operate == "add") {
                Collection.Add(productCode, function () {
                    objcollecttion.attr("class", "sc");
                }, str_callback);
            }
            else {
                ShowMesaage("您已经取消收藏此商品。");
            }
        }
        else {
            //取消收藏
            if (operate == "cancel") {
                Collection.Delete(productCode, function () {
                    objcollecttion.attr("class", "gr");
                }, str_callback);
            }
            else {
                ShowMesaage("您已经收藏此商品。");
            }
        }
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
            html += "<li ><a><img src='" + g_GetPictrue(objpcPic.picNewUrl) + "' /></a></li>";
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

        var html = "";
        var priceLabel = Product_Detail.GetSaleLabel();
        /*396需求 活动图片  开始*/
        if (!(msg.eventLabelPic == undefined)) {
            if (msg.eventLabelPic.picNewUrl != "") {
                //存在图片，表示需要显示396新增内容
                $("#img_festival_img").attr("src", msg.eventLabelPic.picNewUrl);
                if (msg.eventLabelPicSkip != "") {
                    //注册点击事件
                    $("#img_festival_img").on("click", function () {
                        PageUrlConfig.SetUrl();
                        window.location.href = msg.eventLabelPicSkip;
                    });

                }
                //显示图片层
                $("#div_festival").show();
            }

            //显示396 价格
            var showprice396 = Product_Detail.SkuKillResponse.sellPrice;
            var newPrice=0;
            if (isNaN(showprice396)) {
                $("#div_spec_price_396").html("<i>￥</i>" + showprice396 + "<i>");
            }
            else {
                var wsdxc = ((parseFloat(showprice396).toFixed(2)) * 100) % 100;
                if (parseInt(wsdxc)==0) {
                    wsdxc = "00";
                }
                else if (parseInt(wsdxc)<10) {
                    wsdxc = "0"+wsdxc;
                }
                $("#div_spec_price_396").html("<i>￥</i>" + parseInt(showprice396) + ".<i>" + wsdxc + "</i>");
            }


            if ($("#div_spec_396").is(':hidden')) {
                //无396活动时，限时售价
                newPrice=Product_Detail.GetSalePrice();
                html = '<i class="rmb">￥</i><i class="count" id="nprice">' + newPrice + '</i>';
                if (priceLabel != "")
                    html += '<font>' + msg.priceLabel + '</font>';

            }
            else {
                //sku无活动时价格
                newPrice=Product_Detail.SkuKillResponse.skuPrice;
                html = '<i class="count03" id="nprice">￥' + Product_Detail.SkuKillResponse.skuPrice + '</i>';
            }
        }
        else {

            //无396活动时，限时售价
            newPrice=Product_Detail.GetSalePrice();
            html = '<i class="rmb">￥</i><i class="count" id="nprice">' + newPrice + '</i>';
            if (priceLabel != "")
                html += '<font>' + msg.priceLabel + '</font>';


        }
        
           

        //var guoneilabel = "&nbsp;国内:";
        //if (msg.flagTheSea == "1") {
        //    html += guoneilabel;
        //}

        html += '<i class="count02">￥' + Product_Detail.SkuKillResponse.marketPrice + '</i>';

        //折扣
        var zhekou = "";
        if (!isNaN(newPrice) && !isNaN(Product_Detail.SkuKillResponse.marketPrice) && newPrice != Product_Detail.SkuKillResponse.marketPrice) {
            if (parseFloat(Product_Detail.SkuKillResponse.marketPrice)>0) {
                zhekou = (parseFloat(newPrice) * 10 / parseFloat(Product_Detail.SkuKillResponse.marketPrice)).toFixed(1);
                if (parseFloat(zhekou) > 0) {
                    html += "<b>" + zhekou + "折</b>";
                }
            }
        }

        $("#price")[0].innerHTML = html;
    },
    /*读取闪购信息*/
    LoadflagCheap: function (msg) {
        var actevent = Product_Detail.GetSaleEvent();
        if (actevent != null && actevent.eventType == g_const_Act_Event_Type.FastBuy) {
            $("#div_left_time").empty();
            $("#div_left_time").css("display", "");
            //$("#mainaddtocart").css("display", "none");
            //$("#sku_addtocart").css("display", "none");

            ////396 闪购倒计时 开始
            //if (!$("#div_spec_396").is(':hidden')) {
            //    //396 闪购倒计时  精确到0.1秒
            //    Product_Detail.flagCheapInterval = self.setInterval("Product_Detail.ShowLeftTime();", 100);
            //}
            //else {
            //    //平时倒计时 精确到秒
            //    Product_Detail.flagCheapInterval = self.setInterval("Product_Detail.ShowLeftTime();", g_const_seconds);
            //}

            //396 闪购倒计时  精确到0.1秒
            Product_Detail.flagCheapInterval = self.setInterval("Product_Detail.ShowLeftTime();", 100);

        }
    },
    flagCheapInterval: 0,
    ShowLeftTime: function () {

        var date_last = Date.Parse(Product_Detail.api_response.sysDateTime).AddSeconds(Product_Detail.SkuKillResponse.limitSecond);
        var date_now = new Date();
        var ts = date_last.getTime() - date_now.getTime();  //时间差的毫秒数

        var days = Math.floor(ts / g_const_days);
        var leftmillionseconds = ts % g_const_days;

        var hours = Math.floor(leftmillionseconds / g_const_hours);
        leftmillionseconds = leftmillionseconds % g_const_hours;

        var minutes = Math.floor(leftmillionseconds / g_const_minutes);
        leftmillionseconds = leftmillionseconds % g_const_minutes;

        var seconds = Math.floor(leftmillionseconds / g_const_seconds);

        //leftmillionseconds = leftmillionseconds % 100;
        var mseconds = Math.floor(leftmillionseconds / 100);


        var hourstring = "0" + hours.toString();
        hourstring = hourstring.substr(hourstring.length - 2, 2);
        var minutestring = "0" + minutes.toString();
        minutestring = minutestring.substr(minutestring.length - 2, 2);

        var secondstring = "0" + seconds.toString();
        secondstring = secondstring.substr(secondstring.length - 2, 2);

        var msecondstring = mseconds.toString();
        msecondstring = msecondstring.substr(msecondstring.length - 1, 1);

        //原有倒计时
        //var showtext = "剩余" + days.toString() + "天" + hourstring + "小时" + minutestring + "分钟" + secondstring + "秒";
        
        //396后精确到0.1秒
        hourstring = parseInt(days) * 24 + hours;
        if (parseInt(hourstring) < 10) {
            hourstring = "0" + hourstring.toString();
        }
        var showtext = "<div class='d_remain' id='div_left_time'>剩余 <i class='d_remain_time'>" + hourstring + ":" + minutestring + ":" + secondstring + "." + msecondstring + "</i>";
        if (_temp_sku_price != "") {
            showtext += " 恢复：￥" + _temp_sku_price;
        }
        showtext +="</div>";

        $("#div_left_time").html(showtext);
        if (days == 0 && hours == 0 && minutes == 0 && seconds == 0)
            self.clearInterval(Product_Detail.flagCheapInterval);


        //396 闪购倒计时 开始
        if (!$("#div_spec_396").is(':hidden')) {
            //精确到秒
            //$("#div_spec_class_time").html("<p><b>" + days.toString() + "</b>:<b>" + hourstring + "</b>:<b>" + minutestring + "</b>:<b>" + secondstring + "</b></p>");
            
            $("#div_spec_class_time").html("<p><b>" + hourstring + "</b>:<b>" + minutestring + "</b>:<b>" + secondstring + "." + msecondstring + "</b></p>");
            $("#div_spec_class").show();

            //有396活动，隐藏平时的倒计时
            $("#div_left_time").hide();
        }
        //396 闪购倒计时 结束


    },
    /*读取促销信息*/LoadPromotion: function (msg) {
        $(".sales").empty();
        var act_title = "";
        var html = "";
        html += '<div class="d_act_del"><span>活动详情</span></div>';
        var saleshtml = '<div class="lid"><em>#类别#</em><div>#说明#</div></div>';
        var temp = "";
        if (msg.flagIncludeGift == g_const_YesOrNo.YES) {
            temp = saleshtml.replace("#类别#", "赠品");
            temp = temp.replace("#说明#", msg.gift);
            html += temp;
            act_title += "<em>赠品</em>";
        }
        var actevent = Product_Detail.GetSaleEvent();
        if (actevent != null && actevent.eventType == g_const_Act_Event_Type.FastBuy) {
            if (Product_Detail.api_response.skuList.length > 0) {
                if (Product_Detail.api_response.skuList[0].activityInfo.length == 0) {
                    temp = saleshtml.replace("#类别#", "闪购中");
                    temp = temp.replace("#说明#", "本时段享超值优惠");
                    html += temp;
                } else {
                    for (var k in Product_Detail.api_response.skuList[0].activityInfo) {
                        var activity = Product_Detail.api_response.skuList[0].activityInfo[k];
                        temp = saleshtml.replace("#类别#", activity.activityName);
                        temp = temp.replace("#说明#", activity.remark);
                        html += temp;
                        act_title += "<em>" + ctivity.activityName + "</em>";
                    }
                }
            }
            else {
                temp = saleshtml.replace("#类别#", "闪购中");
                temp = temp.replace("#说明#", "本时段享超值优惠");
                html += temp;
            }
            act_title += "<em>闪购中</em>";
        }

        temp = "";
        if (msg.priceLabel.Trim() != "" && msg.priceLabel.Trim() != "闪购" && msg.priceLabel.Trim() != "特价") {
            var arrpriceLabel = msg.priceLabel.Trim().split(",");
            for (var kkk in arrpriceLabel) {
                temp = saleshtml.replace("#类别#", arrpriceLabel[kkk]);
                temp = temp.replace("#说明#", "&nbsp;");
                html += temp;
                act_title += "<em>" + arrpriceLabel[kkk] + "</em>";
            }
        }
        if (msg.otherShow.length > 0) {
            var arrotherShow = msg.otherShow;
            for (var kkk in arrotherShow) {
                if (arrotherShow[kkk] != "" && arrotherShow[kkk] != "赠品")
                    temp = saleshtml.replace("#类别#", arrotherShow[kkk]);
                temp = temp.replace("#说明#", "&nbsp;");
                html += temp;
                act_title += "<em>" + arrotherShow[kkk] + "</em>";
            }
        }
        //增加满减活动
        for (var k in Product_Detail.SkuKillResponse.saleMessage) {
            var activity = Product_Detail.SkuKillResponse.saleMessage[k];
            temp = saleshtml.replace("#类别#", activity.eventName);
            temp = temp.replace("#说明#", activity.saleMessage);
            html += "<span onclick=\"Product_Detail.OpenFullCut('" + activity.eventCode + "','" + activity.beginTime + "','" + activity.endTime + "')\">" + temp + "</span>";
            act_title += "<em>" + activity.eventName + "</em>";
           
        }
        $(".sales").append(html);
        $("#d_act_ts").html(act_title);
        if (act_title == "") {
            $("#d_act_ts").hide();
            $(".sales").css("display", "none");
        }
    },

    OpenActLayer: function () {

        $("#d_act_ts").hide();
        $(".sales").show();
    },

    CloseActLayer: function () {

        $("#d_act_ts").show();
        $(".sales").hide();
    },

    OpenFullCut: function (activityCode, startTime, endTime) {
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.FullCut
                                    + "?t=" + Math.random()
                                    + "&activitycode=" + activityCode
                                    + "&begintime=" + startTime
                                    + "&endtime=" + endTime;
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

        try {
            var fth = "";
            if (!($('.botline').offset().top == undefined)) {
                fth = $('.botline').offset().top - 40;
                $('.tabw').animate({ 'height': '100%' }, 300);
                $('#mask').css({ 'display': 'block', 'height': fth + 'px' });
                $('.tabw footer').css('display', 'block');
            }
        }
        catch (eee) {

        }


        if (Product_Detail.GetShowType() == Product_Detail.ShowType.SecKill) {
            $("footer .ch-seckill").css("display", "");
            $("footer .btn-buy").css("display", "none");
        }
        else if (Product_Detail.GetShowType() == Product_Detail.ShowType.Qrcode) {
            $("footer .ch-seckill").css("display", "none");
            $("#sku_addtocart").css("display", "none");
            $("#sku_buy").attr("class", "ch-seckill curr");
            $("#sku_buy").css("display", "");
        }
        else {

            $("footer .ch-seckill").css("display", "none");
            $("#sku_buy").css("width", "50%");
            $("#sku_addtocart").css("width", "50%");

            //加入购物车时
            if (opentype == "addtocart") {
                $("#sku_addtocart").text("确  定");
                $("#sku_buy").css("display", "none");
                $("#sku_addtocart").css("display", "");
            }
            else if (opentype == "stylechoose" || opentype == "changearea") {
                $("#sku_addtocart").text("加入购物车");
                $("#sku_addtocart").css("display", "");
                $("#sku_buy").text("立即购买");
                $("#sku_buy").css("display", "");

            }
            else {
                $("#sku_addtocart").css("display", "none");
                $("#sku_buy").css("display", "");
                $("#sku_buy").text("确  定");
            }
            //如果是闪购,隐藏加入购物车
            var actevent = Product_Detail.GetSaleEvent();
            if (actevent != null && actevent.eventType == g_const_Act_Event_Type.FastBuy) {
                $("#sku_addtocart").css("display", "none");
            }
            if ($("#sku_addtocart").css("display") == "none") {
                $("#sku_buy").css("width", "100%");
                $("#sku_addtocart").css("width", "0%");
            }
            if ($("#sku_buy").css("display") == "none") {
                $("#sku_buy").css("width", "0%");
                $("#sku_addtocart").css("width", "100%");
            }
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
        self.setTimeout('$(".bottom").css("display", "");', 100);
    },
    /*取销售价格*/
    GetSalePrice: function () {
        if (Product_Detail.SkuKillResponse != null && !(Product_Detail.SkuKillResponse == undefined)) {
            if (!(Product_Detail.SkuKillResponse.skuPrice == undefined)) {
                _temp_sku_price = Product_Detail.SkuKillResponse.skuPrice;
            }
        }

        if (Product_Detail.SkuSecKillLoaded) {
            if (Product_Detail.SkuKillResponse.events.length > 0) {
                var jyhactevents = Product_Detail.SkuKillResponse.events;
                var jyhactevent = jyhactevents[0];
                if (jyhactevent.eventType == g_const_Act_Event_Type.Insourced)
                    return Product_Detail.SkuKillResponse.skuPrice;
                else
                    return Product_Detail.SkuKillResponse.sellPrice;
            }
            else
                return Product_Detail.SkuKillResponse.sellPrice;
        } else {
            return "";
        }

    },
    //取价格标签
    GetSaleLabel: function () {
        if (Product_Detail.SkuKillResponse.events.length > 0) {
            var jyhactevents = Product_Detail.SkuKillResponse.events;
            var jyhactevent = jyhactevents[0];
            return jyhactevent.eventName;
        }
        else
            return Product_Detail.api_response.priceLabel;

    },
    //取活动事件
    GetSaleEvent: function () {
        if (Product_Detail.SkuKillResponse.events.length > 0) {
            var jyhactevents = Product_Detail.SkuKillResponse.events;
            var jyhactevent = jyhactevents[0];
            return jyhactevent;
        }
        else
            return null;
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
                if ($("#mainbuy").attr("class").indexOf("gray") == -1)
                    Product_Detail.OpenSKULayer("stylechoose");
            });
        }
        $(".box.sizes").append(html);
        var tmpl = $("#tpl_sku")[0].innerHTML;
        var defaultprov = Product_Detail.GetDefaultProv();

        //396 保存默认sku图片  开始
        var default_productpic = g_GetPictrue(msg.mainpicUrl.picNewUrl.Trim());
        $("#hid_defaultSkuPic").val(default_productpic);
        //396 保存默认sku图片  开始

        $(".txt01").html(msg.productName.Trim());

        var data = {
            "productpic": default_productpic,//g_GetPictrue(msg.mainpicUrl.picNewUrl.Trim()),
            "productName": msg.productName.Trim(),
            "sellPrice": Product_Detail.GetSalePrice(),
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
                    html += '       <div class="sdiv" data="' + propertyList.propertyKeyCode + '" datatext="' + propertyList.propertyKeyName + '" index="' + i.toString() + '">';
                    for (var j = 0; j < propertyList.propertyValueList.length; j++) {
                        var propertyValueList = propertyList.propertyValueList[j];
                        html += '       <a data="' + propertyValueList.propertyValueCode + '" datatext="' + propertyValueList.propertyValueName.Trim() + '"><b>&nbsp;</b>' + propertyValueList.propertyValueName + '</a>';
                    }
                    //测试html += '<a data="' + (propertyValueList.propertyValueCode+1) + '" datatext="' + propertyValueList.propertyValueName.Trim()+"1" + '"><b>&nbsp;</b>' + propertyValueList.propertyValueName+"1" + '</a>'
                    html += '   </div>';
                    html += '</div>';
                    //}
                }

                return html;
            }(),
            selectarea_pro: function () {
                if (defaultprov != null)
                    return defaultprov.provinceName;
                else
                    return "";
            }(),
            selectarea_city: Product_Detail.FindAera(Product_Detail.GetDefaultAddress().cityID, msg.addressList) ? Product_Detail.GetDefaultAddress().cityName : Product_Detail.LoadDefaultCity().cityName,
            arealist: Product_Detail.LoadCityList(defaultprov),
            provlist: Product_Detail.LoadProvList(defaultprov)
        };
        html = renderTemplate(tmpl, data);
        $("body").append(html);
    },
    //初始化样式选择器
    InitSkySelecter: function () {
        var msg = Product_Detail.api_response;
        $("p.pprice").html("￥" + Product_Detail.GetSalePrice());
        if (msg.addressList.length == 0)
            $(".sale_area").hide();

        $('.tabw .btn-close').off("click")
        $('.tabw .btn-close').on("click", function () {
            Product_Detail.CloseSKULayer();
        });

        //订单起订数量默认值
        if(!(Product_Detail.SelectSku.miniOrder==undefined)){
            
            if(Product_Detail.SelectSku.miniOrder>1){
                $("#buycount").attr("value", Product_Detail.SelectSku.miniOrder.toString());
            }
        }



        /*数量减一*/
        $('.btn-minus').off("click")
        $(".btn-minus").on("click", function (e) {

            var buycount = $("#buycount").val();
            var icount = parseInt(buycount, 10);
            if (icount == "NaN") {
                icount = 1;
            }
            if (icount <= 1){
                icount = 1;
            }
            else{
                icount = icount - 1;

            }
            if(!(Product_Detail.SelectSku.miniOrder==undefined)){
                //订单起订数量判断
                if (Product_Detail.SelectSku.miniOrder > icount) {
                    icount=Product_Detail.SelectSku.miniOrder;
                }
            }

            if (Product_Detail.SelectSku.stockNumSum == 0 || Product_Detail.api_response.maxBuyCount == 0)
                icount = 0;
            $("#buycount").attr("value", icount.toString());
        });

        /*数量加一*/
        $('.btn-add').off("click")
        $(".btn-add").on("click", function (e) {
            var buycount = $("#buycount").val();
            var icount = parseInt(buycount, 10);
            if (icount == "NaN") {
                icount = 1;
            }
            if (Product_Detail.SelectSku.stockNumSum == 0)
                icount = 0;


            if (icount >= 99)
                icount = 99;
            else
                icount = icount + 1;
            if (icount > Product_Detail.SelectSku.stockNumSum) {
                ShowMesaage("对不起,您不能购买更多了.");
                icount = Product_Detail.SelectSku.stockNumSum;
            }
            if (icount > Product_Detail.SelectSku.skuMaxBuy) {
                ShowMesaage("对不起,您已达到限购数量上限.");
                icount = Product_Detail.SelectSku.skuMaxBuy;
            }

            if (!(Product_Detail.SelectSku.miniOrder == undefined)) {
                //订单起订数量判断
                if (Product_Detail.SelectSku.miniOrder > icount) {
                    icount = Product_Detail.SelectSku.miniOrder;
                }
            }


            $("#buycount").attr("value", icount.toString());
        });

        $('.btn-buy').off("click")
        $(".btn-buy").on("click", Product_Detail.OnBuyClick);
        //地区选择层
        $('.sale_area p').off("click")
        $(".sale_area p").on("click", function () {
            $(this).hide();
            $("#provlist").hide();
            $("#arealist").show();
            $('.select_add').show();
        });
        //返回省
        $('.select_add h3 a').off("click")
        $(".select_add h3 a").on("click", function () {
            //alert("返回省");
            $(".select_add h3 span").html("");
            $("#provlist").show();
            $("#arealist").hide();
        });
        var citychange = function () {
            //alert("选择市");
            var cityid = $(this).attr("cityid");
            var cityname = $(this).text();
            var city = {
                cityID: cityid,
                cityName: cityname
            };
            $(".sale_area p").html(cityname);
            $(".select_add h3 span").html(cityname);
            localStorage[g_const_localStorage.DefaultCity] = JSON.stringify(city);
            $(".sale_area p").show();
            $(".select_add").hide();
            $(".change").hide();
        }
        //选择市
        $('#arealist li').off("click")
        $("#arealist li").on("click", citychange);
        //选择省
        $('#provlist li').off("click")
        $("#provlist li").on("click", function () {
            var provid = $(this).attr("provid");
            var provname = $(this).text();
            var prov = {
                provinceID: provid,
                provinceName: provname
            };
            $("#provlist").hide();
            var html = Product_Detail.LoadCityList(prov);
            $("#arealist").html(html);
            $("#arealist li").off("click");
            $("#arealist li").on("click", citychange);

            $("#arealist").show();

        });

        for (var i = 0; i < msg.propertyList.length; i++) {
            var propertyList = msg.propertyList[i];
            var objgroup = $(".sdiv[data='" + propertyList.propertyKeyCode.Trim() + "']").children("a[class!='nosel']");
            objgroup.off("click")
            objgroup.on("click", function (e) {
                var objthis = e.target;
                if ($(this).attr("class") == "nosel")
                    return;
                var obj_group = $(this).parent().children("a[class!='nosel']");
                obj_group.attr("class", "");
                $(this).attr("class", "on");
                Product_Detail.StyleSelect($(this).parent().attr("index"), $(this).parent().attr("data"), $(this).attr("data"), $(this).attr("datatext"));
            });
        }
        if (msg.propertyList.length == 1) {
            Product_Detail.SetStockInfo("");
        }
        /*如果只有1种sku则隐藏sku选择器*/
        if (msg.skuList.length == 1) {
            $(".pop-c .sel").css("display", "none");
            $(".pop-c .selnum").css("display", "");
            $(".imgr .size").css("display", "none");
            Product_Detail.SelectSku = msg.skuList[0];
            Product_Detail.RefershPrice(Product_Detail.SelectSku.keyValue)
        }
    },
    /*点击购买或者加入购物车时的操作*/
    OnBuyClick: function (e) {
        var objthis = e.target;
        var buycount = 0;
        $(".bottom").css("display", "none");
        var selectstylecount = $(".sdiv .on").length;
        var maxstylecount = Product_Detail.api_response.propertyList.length;

        if (Product_Detail.api_response.skuList.length > 1 && selectstylecount != maxstylecount) {
            ShowMesaage("请您选择你要购买的商品样式.");
            return;
        }
        buycount = parseInt($("#buycount").val(), 10);
        if (buycount > Product_Detail.SelectSku.stockNumSum) {
            ShowMesaage("库存不足,请您修改购买数量.");
            return;
        }
        if (buycount > Product_Detail.SelectSku.skuMaxBuy || buycount == 0) {
            ShowMesaage("对不起,您已达到限购数量上限.");
            return;
        }

        var objcart = {
            /*商品数量*/
            "sku_num": buycount,
            /*地区编号,可不填写，添加购物车不再需要区域编号*/
            "area_code": "",
            /*商品编号*/
            "product_code": Product_Detail.api_input.productCode,//Product_Detail.api_response.productCode,
            /*sku编号*/
            "sku_code": Product_Detail.SelectSku.skuCode,
            //是否选择
            chooseFlag: g_const_YesOrNo.NO.toString(),
        };

        var objcartfull = g_type_cart.objCartFull;
        var objcartlist = [];
        objcartfull.sku_num = buycount;
        objcartfull.area_code = "";

        objcartfull.product_code = Product_Detail.api_response.productCode;
        objcartfull.sku_code = Product_Detail.SelectSku.itemCode.trim() == "" ? Product_Detail.SelectSku.skuCode : Product_Detail.SelectSku.itemCode;
        objcart.sku_code = objcartfull.sku_code;
        objcart.product_code = objcartfull.product_code;

        objcartfull.otherShow = Product_Detail.api_response.otherShow;
        objcartfull.sku_price = Product_Detail.SelectSku.sellPrice;
        objcartfull.sku_stock = Product_Detail.SelectSku.stockNumSum;
        objcartfull.pic_url = Product_Detail.api_response.mainpicUrl.picNewUrl.Trim();
        objcartfull.limit_order_num = Product_Detail.SelectSku.skuMaxBuy;
        objcartfull.flag_stock = g_const_YesOrNo.YES;
        objcartfull.flag_product = g_const_YesOrNo.YES;
        objcartfull.sku_name = Product_Detail.SelectSku.skuName;//Product_Detail.api_response.productName.Trim() + " " + $(".imgr .size span").text();
        objcartfull.sales_type = "";//已过时,不再用
        objcartfull.sales_info = "";//已过时,不再用
        objcartfull.flagTheSea = Product_Detail.api_response.flagTheSea;
        objcartfull.chooseFlag = objcart.chooseFlag;

        var arrpricelabel = Product_Detail.api_response.priceLabel.split(",");
        for (var i = 0; i < arrpricelabel.length; i++) {
            var pricelabel = arrpricelabel[i];
            if (pricelabel != "") {
                var activity = {
                    activity_name: pricelabel,
                    activity_info: ""
                };
                objcartfull.activitys.push(activity);
            }
        }

        var arrstyle = Product_Detail.SelectSku.keyValue.split("&");
        for (var i = 0; i < arrstyle.length; i++) {
            var s_style = arrstyle[i];
            if (s_style.indexOf("=") != -1) {
                var arr_s_style = s_style.split("=");
                var objp = Product_Detail.FindProperty(arr_s_style[0], arr_s_style[1]);
                var PcPropertyinfoForFamily = { sku_code: objcartfull.sku_code, propertyKey: objp.propertyKey, propertyValue: objp.propertyValue };
                objcartfull.sku_property.push(PcPropertyinfoForFamily);
            }
        }

        // objcartfull.activitys
        var objcarts = {
            "GoodsInfoForAdd": []
        };

        if ($(objthis).attr("operate") == "addtocart") {
            //加入购物车   
            g_type_cart.ADD(objcartfull, false);
            localStorage[g_const_localStorage.OrderConfirm] = localStorage[g_const_localStorage.Cart];
            Product_Detail.GetCartCount();
        }
        else if ($(objthis).attr("operate") == "orderconfim") {
            //立即购买
            objcarts = {
                "GoodsInfoForAdd": [objcart]
            };
            localStorage[g_const_localStorage.ImmediatelyBuy] = JSON.stringify(objcarts);
            localStorage[g_const_localStorage.OrderConfirm] = localStorage[g_const_localStorage.ImmediatelyBuy];

            //objcartlist.push(objcartfull);
            //localStorage[g_const_localStorage.GoodsInfo] = JSON.stringify(objcartlist);

            PageUrlConfig.SetUrl();

            window.location.href = g_const_PageURL.OrderConfirm + "?t=" + Math.random() + "&showwxpaytitle=1";

        }
        Product_Detail.CloseSKULayer();
    },
    /*查询样式信息*/
    FindProperty: function (propertyKeyCode, propertyValueCode) {
        var objp = { propertyKey: "", propertyValue: "" };
        for (var i = 0; i < Product_Detail.api_response.propertyList.length; i++) {
            var property = Product_Detail.api_response.propertyList[i];
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
            Product_Detail.ChoosedStyle = "";
            Product_Detail.ChoosedStyleName = "已选择：";
            $(".pprice").empty();
            sprice += Product_Detail.GetSalePrice();
            $(".pprice").append(sprice);
        }
        var stylename = Product_Detail.ChoosedStyleName;
        var style = Product_Detail.ChoosedStyle;
        var arrstyle = style.split("&");
        var maxselectcount = Product_Detail.api_response.propertyList.length;

        //if (style.indexOf(propertyKeyCode + "=" + propertyValue) != -1)
        //    return;
        //else
        //{
        //    if(style.indexOf(propertyKeyCode + "=")!=-1){
        //        //把旧的用新的替换
        //        var regex = new RegExp(propertyKeyCode + "=" + "\\d+(&|$)", "ig");
        //        style = style.replace(regex, function (fullMatch, capture) {                    
        //            if (fullMatch.indexOf("&") != -1)
        //                return propertyKeyCode + "=" + propertyValue + "&";
        //            else
        //                return propertyKeyCode + "=" + propertyValue;
        //        });
        //        Product_Detail.RefershPrice(style);
        //    }
        //    else{
        //        if (arrstyle.length < maxselectcount) {
        //            style += propertyKeyCode + "=" + propertyValue + "&";
        //            //stylename += "<span class=\"fred\">" + propertyValueName + "</span>";
        //        }
        //        else if (arrstyle.length == maxselectcount) {
        //            style += propertyKeyCode + "=" + propertyValue;
        //            //stylename += "<span class=\"fred\">" + propertyValueName + "</span>";
        //            Product_Detail.RefershPrice(style);
        //        }
        //    }
        //}
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
        // 396 新增选择属性名称  开始
        var styleName = "";
        // 396 新增选择属性名称  结束

        stylename = "已选择：";
        productstylevalue = "";
        for (var i = 0; i < islength ; i++) {
            var ss = selectstyles[i];
            if (i != (islength - 1)) {
                style += $(ss).parent().attr("data") + "=" + $(ss).attr("data") + "&";
                // 396 新增选择属性名称  开始
                styleName += $(ss).parent().attr("datatext") + "=" + $(ss).attr("datatext") + "&";
                // 396 新增选择属性名称  结束
            }
            else {

                style += $(ss).parent().attr("data") + "=" + $(ss).attr("data");
                // 396 新增选择属性名称  开始
                styleName += $(ss).parent().attr("datatext") + "=" + $(ss).attr("datatext");
                // 396 新增选择属性名称  结束

                if (i == (maxselectcount - 2)) {
                    //只剩一项未选择
                    if (selectindex == i) {
                        //未选择的是倒数第2个
                        Product_Detail.SetStockInfo(style);

                    }
                }
            }
            stylename += "<span class=\"fred\">" + $(ss).attr("datatext") + "</span>";
            //_productinfo.productstylevalue += $(ss).attr("datatext") + ",";
        }
        //stylename = function (style) {
        //    var arrstyles = style.split("&");
        //    var s = "已选择：";
        //    for (var i = 0; i < arrstyles.length; i++) {
        //        var style = arrstyles[i];
        //        if (style.indexOf("=") != -1) {
        //            var arrstyle = style.split("=");
        //            var propertyKeyCode = arrstyle[0]
        //            var propertyValueCode = arrstyle[1];
        //            var msg = Product_Detail.api_response;
        //            for (var j = 0; j < msg.propertyList.length; j++) {                        
        //                var propertyList = msg.propertyList[j];
        //                if (propertyList.propertyKeyCode.toString().Trim() == propertyKeyCode.Trim()) {
        //                    for (var k = 0; k < propertyList.propertyValueList.length; k++) {
        //                        var propertyValueList = propertyList.propertyValueList[k];
        //                        if (propertyValueList.propertyValueCode.toString().Trim() == propertyValueCode.Trim()) {
        //                            s += "<span class=\"fred\">" + propertyValueList.propertyValueName.Trim() + "</span>";
        //                            break;
        //                        }
        //                    }
        //                    break;
        //                }
        //            }
        //        }
        //    }
        //    return s;
        //}(style);
        Product_Detail.ChoosedStyle = style;
        //ShowMesaage(style);
        $(".size").empty();
        $(".size").append(stylename);
        // productstylevalue = stylename 
        if (islength == maxselectcount)
            Product_Detail.RefershPrice(style);

        //396 改变sku显示图片  开始
        Product_Detail.ChangeSkuPic(styleName);
        //396 改变sku显示图片  结束


    },
    /*设定默认库存显示*/
    SetStockInfo: function (style) {
        var maxselectcount = Product_Detail.api_response.propertyList.length;
        var lastsyles = $(".sdiv[index='" + (maxselectcount - 1).toString() + "'] a");

        var skuList = Product_Detail.api_response.skuList;

        for (var istylecount = 0; istylecount < lastsyles.length; istylecount++) {
            var laststyle = lastsyles[istylecount];
            var fullstyle = style + "&" + $(laststyle).parent().attr("data") + "=" + $(laststyle).attr("data");
            if (style == "")
                fullstyle = $(laststyle).parent().attr("data") + "=" + $(laststyle).attr("data");
            if (Product_Detail.IsSkuCanSold(fullstyle))
                $(laststyle).attr("class", "");
            else
                $(laststyle).attr("class", "nosel");
        }
    },
    /*查找制定样式的sku是否有货*/
    IsSkuCanSold: function (fullstyle) {
        var skuList = Product_Detail.api_response.skuList;
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
        var sku = Product_Detail.FindSku(style);
        if (sku != null) {
            Product_Detail.SelectSku = sku;
            $(".pprice").empty();
            //if (sku.activityInfo.length > 0) {
            //    for (var i = 0; i < sku.activityInfo.length ; i++) {
            //        var objactivityInfo = sku.activityInfo[i];

            //    }
            //}
            sprice += sku.sellPrice.toString();
            $(".pprice").append(sprice);
            $(".bnum.fr span").empty();
            var limitcount = 0;
            if (sku.skuMaxBuy >= sku.stockNumSum)
                limitcount = sku.stockNumSum;
            else
                limitcount = sku.skuMaxBuy;

            var temp_xg=limitcount.toString();
            if(sku.miniOrder<limitcount){
                temp_xg=sku.miniOrder.toString() +" - "+ limitcount.toString();
            }
            var slimitbuy = limitcount >= 99 ? "" : "限购" + temp_xg + "件";
            if (sku.skuMaxBuy <= 0 && sku.limitBuyTip.indexOf("已达购买限制数") != -1)
                slimitbuy = sku.limitBuyTip;
            $(".bnum.fr span").append(slimitbuy);
            if (sku.stockNumSum <= 0) {
                ShowMesaage("对不起,您选择的商品无货,请您重新选择.");
            }
        }
        else {
            $(".pprice").empty();
            sprice += Product_Detail.GetSalePrice();
            $(".pprice").append(sprice);
            $(".sdiv .on").attr("class", "");

            $(".size").empty();
            $(".size").append("请选择：");
            ShowMesaage(g_const_API_Message["100036"]);
            // ShowMesaage("对不起,您选择的商品无货,请您重新选择.");
        }
    },
    /*选中的SKU*/
    SelectSku: {},
    /*读取权威标志*/LoadAuthorityLogo: function (msg) {
        $(".bz").empty();
        var html = "";
        for (var i = 0; i < msg.authorityLogo.length; i++) {
            var authorityLogo = msg.authorityLogo[i];
            html += "<span><b style=\"background: url(" + authorityLogo.logoPic.Trim() + ") no-repeat left top;background-size: 100% auto;\">&nbsp;</b>" + authorityLogo.logoContent.Trim() + "</span>";
        }
        $(".bz").append(html);
    },
    /*读取图文详情*/
    LoadDiscriptPicList: function (msg) {
        $("#tabc0").empty();
        var html = "";
        //提示语
        var tsy_str = "";
        if (!(msg.tips == undefined)) {
            if (msg.tips.length > 0) {
                //html += '<div class="detials01">'
                for (var i = 0; i < msg.tips.length; i++) {
                    tsy_str += msg.tips[i];
                }
                //html += '</div>';
                $("#tsy").html(tsy_str);
                $("#tsy").show();
                $("#tsy_k").show();
            }
        }
		
        html += '<div class="imgs">';
        for (var i = 0; i < msg.discriptPicList.length; i++) {
            var discriptPicList = msg.discriptPicList[i];
            if (discriptPicList.picNewUrl != "") {
                html += '<img src="' + discriptPicList.picNewUrl + '" />';
            }
        }
        html += '</div>';
        $("#tabc0").append(html);
    },
    /*读取规格参数*/LoadPropertyInfoList: function (msg) {
        $("#tabc1").empty();
        var html = '<table>';
        for (var i = 0; i < msg.propertyInfoList.length; i++) {
            var propertyInfoList = msg.propertyInfoList[i];
            html += '<tr><td class="w22">' + propertyInfoList.propertykey + '</td><td class="w76">' + propertyInfoList.propertyValue + '</td></tr>';
        }
        html += '</table>';
        $("#tabc1").append(html);
    },
    //读取评价
    LoadproductComment: function (msg) {
        //console.log(msg.productComment);
        var productCommenthtml = "";
        var html = "";
        var stpl = $("#tpl_productComment").html();
        if (msg.productComment.length > 0) {
            var stpl_list = $("#tpl_productComment_list").html();
            var productComment = msg.productComment;
            for (var i = 0; i < productComment.length; i++) {
                var Comment = productComment[i];
                var CommentData = {
                    userFace: Comment.userFace || g_member_Pic,
                    grade: "f" + Comment.grade,
                    userMobile: Comment.userMobile,
                    commentContent: Comment.commentContent,
                    commentTime: Comment.commentTime,
                    skuStyle: Comment.skuStyle
                };
                productCommenthtml += renderTemplate(stpl_list, CommentData);
            }
            $("#div_commodity_review_no").hide();
        }
        else {
            $("#div_commodity_review").hide();
        }
        var data = {
            highPraiseRate: msg.highPraiseRate,
            commentSumCounts: msg.commentSumCounts.toString(),
            productCommentList: productCommenthtml,
        }
        html = renderTemplate(stpl, data);
        $("#div_commodity_review").html(html);

        $("#div_commodity_review h2 a").on("click", function () {
            window.location.replace(g_const_PageURL.ReviewList + "?pid=" + Product_Detail.api_response.productCode);
        });
    },
    /*根据选中的样式查找SKU信息*/
    FindSku: function (style) {
        var skuList = Product_Detail.api_response.skuList;
        for (var i = 0; i < skuList.length; i++) {
            var sku = skuList[i];
            if (sku.keyValue == style) {
                return sku;
            }
        }
        return null;
    },
    tostIsCall: function () {
        $("#mask").show();
        $(".ftel").show();
    },
    exitCall: function () {
        setTimeout(function () {
            $("#mask").hide();
            $(".ftel").hide();
        }, 100);
    },
    Load_Product: function () {
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.Cart + "?t=" + Math.random();
    },
    //读取相关推荐 【作废】
    Load_Recommend: function () {
        //g_type_api.api_target = "com_cmall_familyhas_api_ApiRecProductInfo";
        //g_type_api.api_input = {
        //    uid: GetQueryString("uid"),
        //    buyerType: GetQueryString("buyerType"),
        //    pageSize: 20,
        //    sequenceNO: "",
        //    channelNO: "",
        //    operFlag: g_const_operFlag.productdetail,
        //    pageIndex: 1,
        //    version: 1.0
        //};
        if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
            g_type_api.api_token = g_const_api_token.Wanted;
        }
        else
            g_type_api.api_token = g_const_api_token.Unwanted;

        g_type_api.LoadData(Product_Detail.AfterLoad_Recommend, "");
    },
    //读取相关推荐后
    AfterLoad_Recommend: function (msg) {
        //console.log("相关推荐" + JSON.stringify(msg));       
        var sptl_list = $("#tpl_recommend_list").html();
        var stpl = $("#tpl_recommend").html();
        var html_list = "";
        var html = "";
        if (!(msg.productMaybeLove == undefined)) {
            for (var i = 0; i < msg.productMaybeLove.length; i++) {
                var product = msg.productMaybeLove[i];
                var data_list = {
                    productlink: product.procuctCode,
                    productpicture: g_GetPictrue(product.mainpic_url),
                    productlabelpicture: function () {
                        //原有本地图片，3.9.4后注销
                        //if (product.labelsList.length > 0) {
                        //    var plabel = g_const_ProductLabel.find(product.labelsList[0]);
                        //    var stpl_list1 = "";
                        //    if (plabel != null)
                        //        stpl_list1 = '<span><img src="' + plabel.spicture + '" alt=""></span>';
                        //    return stpl_list1;
                        //}
                        //3.9.4 从接口获取图片
                        if (product.labelsPic != "" && !(product.labelsPic == undefined)) {
                            return '<img src="' + product.labelsPic + '" alt="" style="width:2rem; height:2rem; position:absolute; left:0; top:0;" />';
                        }
                        else
                            return "";
                    }(),
                    productname: product.productNameString,
                    productprice: product.productPrice
                };
                html_list += renderTemplate(sptl_list, data_list);
            }

            var data = {
                recBarName: msg.recBarName,
                ulwidth: "width:" + (msg.productMaybeLove.length * 8.5).toString() + "rem",
                recommendlist: html_list,
            };
            html = renderTemplate(stpl, data);
            $(".relevant").html(html);
            if (msg.productMaybeLove.length == 0) {
                $(".relevant").hide();
            }
        }
        else {
            $(".relevant").hide();
        }
    },
    Load_RecommendDetail: function myfunction(pid) {
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.Product_Detail + "?pid=" + pid + "&t=" + Math.random();
    },
    //根据地址决定是否有货
    Load_Address: function (msg) {
        var defaultcity = Product_Detail.GetDefaultAddress();
        var bfind = Product_Detail.FindAera(defaultcity.cityID, msg.addressList);
        if (!bfind) {
            $(".change").css("display", "");
            $(".change span").html(defaultcity.cityName);
        }

        $(".change a").on("click", function () {
            if ($("#mainbuy").attr("class").indexOf("gray") == -1)
                Product_Detail.OpenSKULayer("changearea");
        });
    },
    GetDefaultAddress: function () {
        var l_defaultcitycode = localStorage[g_const_localStorage.DefaultCity];
        var defaultcity = {
            cityID: "",
            cityName: ""
        };
        if (typeof (l_defaultcitycode) != "undefined") {
            defaultcity = JSON.parse(l_defaultcitycode);
        } else {
            defaultcity = Product_Detail.api_response.defaultAddress;
        }
        return defaultcity;
    },
    //指定的市是否在可售区域中
    FindAera: function (cityid, addressList) {
        if (addressList.length == 0)
            return true;
        var provid = cityid.trim().substr(0, 2) + "0000";
        for (var i = 0; i < addressList.length; i++) {
            var address = addressList[i];
            if (address.provinceID.trim() == provid.trim()) {
                for (var j = 0; j < address.cityList.length; j++) {
                    var city = address.cityList[j];
                    if (city.cityID.trim() == cityid.trim()) {
                        return true;
                    }
                    continue;
                }
            }
            continue;
        }
        return false;
    },
    //查找省
    findProv: function (provid, addressList) {
        for (var i = 0; i < addressList.length; i++) {
            var address = addressList[i];
            if (address.provinceID.trim() == provid.trim())
                return address;
        }
        return null;
    },
    //获取默认省份
    GetDefaultProv: function () {
        var defaultcity = Product_Detail.GetDefaultAddress();
        var msg = Product_Detail.api_response;
        var prov;
        if (Product_Detail.FindAera(defaultcity.cityID, msg.addressList)) {
            var provid = defaultcity.cityID.substr(0, 2) + "0000";
            prov = Product_Detail.findProv(provid, msg.addressList);
        }
        else {
            if (msg.addressList.length > 0)
                prov = msg.addressList[0];
            else
                prov = null;
        }
        return prov;
    },
    LoadDefaultCity: function () {
        var addressList = Product_Detail.api_response.addressList;
        var city = {
            cityID: "",
            cityName: ""
        }
        if (addressList.length > 0)
            if (addressList[0].cityList.length > 0)
                city = addressList[0].cityList[0];
        return city;
    },
    //加载可售区域的市
    LoadCityList: function (defaultprov) {
        var html = "";

        if (defaultprov == null)
            return html;
        var msg = Product_Detail.api_response;
        var stpl = "<li cityid=\"{{cityID}}\">{{cityName}}</li>";
        for (var i = 0; i < msg.addressList.length; i++) {
            var address = msg.addressList[i];
            if (address.provinceID == defaultprov.provinceID) {
                for (var j = 0; j < address.cityList.length; j++) {
                    var city = address.cityList[j];
                    var data = {
                        cityID: city.cityID,
                        cityName: city.cityName
                    };
                    html += renderTemplate(stpl, data);
                }
            }
            continue;
        }
        return html;
    },
    //加载可售区域的省
    LoadProvList: function (defaultprov) {
        var html = "";
        if (defaultprov == null)
            defaultprov = {
                provinceID: "",
                provinceName: "",
                cityList: []
            };
        var msg = Product_Detail.api_response;
        var stpl = "<li provid=\"{{provID}}\">{{provName}}</li>";
        for (var i = 0; i < msg.addressList.length; i++) {
            var address = msg.addressList[i];
            //if (address.provinceID == defaultprov.provinceID) {

            //} else {

            //}
            var data = {
                provID: address.provinceID,
                provName: address.provinceName
            };
            html += renderTemplate(stpl, data);

        }
        return html;
    }
};


