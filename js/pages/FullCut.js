var _activityCode = "";
var _beginTime = "";
var _endTime = "";
var _pageNo = "0";
var _pageSize = "10";
var _sortType = "1";
var _productData = {};
var _issort = 0;
var _stop = true;
$(window).scroll(function () {
        totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
        if ($(document).height() <= totalheight) {
            if (_stop == true) {
                _stop = false;
                _pageSize = (parseInt(_pageSize) + 10).toString();
                Product.GetList();
                _stop = true;
            }
        }
    if ($(window).scrollTop() > 2000) {
        $(".scroll-top").fadeIn(500);
    } else {
        $(".scroll-top").fadeOut(500);
    }
});

$(document).ready(function () {
    _activityCode = GetQueryString("activitycode");
    _beginTime = GetQueryString("begintime");
    _endTime = GetQueryString("endtime");
    //_activityCode = "CX2016011100005";
    //_beginTime = "2015-01-01";
    //_endTime = "2017-01-01";
    Product.GetList();

    $("#btnBack").click(function () {
        window.location.replace(PageUrlConfig.BackTo());
    });

    $("#btnCar").click(function () {
        PageUrlConfig.SetUrl();
        window.location.replace(g_const_PageURL.Cart + "?t=" + Math.random());
    });

    $(".scroll-top").click(function () {
        $('body,html').animate({ scrollTop: 0 }, 1000);
        return false;
    });

    //去首页
    $("#btnIndex").click(function () {
        window.location.replace(g_const_PageURL.Index + "?t=" + Math.random());
    });
});

var Product = {

    api_target: "com_cmall_familyhas_api_ApiEventFullCutProdcut",
    api_input: { "activityCode": "", "pageNo": 0, "pageSize": 10, "sortType": 1, "beginTime": "", "endTime": "" },
    GetList: function () {
        $("#waitdiv").show();
        Product.api_input.activityCode = _activityCode;
        Product.api_input.pageNo = _pageNo;
        Product.api_input.pageSize = _pageSize;
        Product.api_input.sortType = _sortType;
        Product.api_input.beginTime = _beginTime;
        Product.api_input.endTime = _endTime;
        var s_api_input = JSON.stringify(this.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": this.api_target };
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
                _productData = msg.fullCutProduct;
                $("#div_fullCutDescription").html(msg.fullCutDescription);
                if (msg.fullCutDescription.length==0) {
                    $("#div_fullCutDescription").hide();
                }
                else {
                    $("#div_fullCutDescription").show();
                }
                if (_productData.length>0) {
                    $("#atData").show();
                    $("#atDataNo").hide();
                }
                else {
                    $("#atDataNo").show();
                    $("#atData").hide();
                }
                Product.Load_Result();
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
            $("#waitdiv").hide();
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Data: function () {
        if (_productData.number == "1") {
            Product.Load_Result(_productData.item);
        }
        else {
            Product.Load_Recom(_productData.item);
        }
        _issort = 0;
    },
    Load_Result: function () {
        var limitStockTotal = 0;
        var bodyList = "";
        $.each(_productData, function (i, n) {



            bodyList += "<li onclick=\"Product.Load_Product('" + n.commodityCode + "')\">";
          //  bodyList += "<a href=\"\">";
            bodyList += "<div class=\"goods-item\">";
            //原有本地图片，3.9.4后注销
            //if (n.labelsList.length >= 1) {
            //    var label = g_const_ProductLabel.find(n.labelsList[0]);
            //    if (label) {
            //        bodyList += '<img class="d_add_ys" src="' + label.spicture + '" alt="" />';
            //    }
            //}
            //3.9.4 从接口获取图片
            if (n.labelsPic != "" && !(n.labelsPic == undefined)) {
                bodyList += '<img class="d_add_ys" src="' + n.labelsPic + '" alt="" />';
            }

            bodyList += "<img src=\"" + g_GetPictrue(n.commodityPic) + "\" style=\"width:102px;height:102px\">";
            var limitStockTotal = 0;
            $.each(n.skuList, function (j, m) {
                limitStockTotal += m.limitStock;
            });
            if (limitStockTotal==0) {
                bodyList += "<span class=\"sold-out\"><em>抢光了</em></span>";
            }
            bodyList += "</div>";
            bodyList += "<h1 class=\"goods-item-tit\">" + n.commodityName + "</h1>";
            bodyList += "<span class=\"goods-item-price\"><i>¥</i>" + n.currentPrice + "</span>";
            bodyList += "<p class=\"scale-num\">月销" + n.saleNum + "件</p>";
           // bodyList += "</a>";
           // bodyList += "<a href class=\"car\">购物车</a>";
            bodyList += "</li>";
        });
        $("#divResultList").html(bodyList);
    },
    Load_Product: function (pid) {
        $.ajax({
            type: "POST",//用POST方式传输
            dataType: "json",//数据格式:JSON
            url: '/Ajax/API.aspx',//目标地址
            data: "t=" + Math.random() +
                    "&action=group_check",
            beforeSend: function () { },//发送数据之前
            complete: function () { },//接收数据完毕
            success: function (msg) {
                if (msg.resultcode) {
                    if (msg.resultcode == g_const_Success_Code) {
                        if (CheckMachine.versions.android) {
                            window.notify.notifyOnAndroid("{\"type\":\"goodsdetail\",\"obj\":{\"pid\":\"" + pid + "\"}}");
                        }
                        else if (CheckMachine.versions.ios || CheckMachine.versions.iPhone || CheckMachine.versions.iPad) {
                            window.location.href = "/group.html?pid//" + pid;
                        }
                    }
                    else {
                        PageUrlConfig.SetUrl();
                        window.location.href = g_const_PageURL.Product_Detail + "?pid=" + pid + "&t=" + Math.random();
                    }
                }
            }
        });



    },
    Change_Sort: function (tid) {
        _issort = 1;
        $("#liot1").attr("class", "");
        $("#liot2").attr("class", "");
        _sortType = tid;
        $("#liot" + tid).attr("class", "curr");
        _pageSize = "10";
        Product.GetList();
    },
};