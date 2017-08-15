var guidelist = "{\"list\":[";
guidelist += "{\"start_time\":\"2014-10-01 00:00:00\",\"end_time\":\"2015-10-01 00:00:00\",\"ImgPath\":\"/img/w_img/guide.png\",\"TitleStr\":\"买买买买\"},";
guidelist += "{\"start_time\":\"2015-10-01 00:00:00\",\"end_time\":\"2015-10-08 00:00:00\",\"ImgPath\":\"/img/w_img/guide_pwjj.png\",\"TitleStr\":\"品味家居\"},";
guidelist += "{\"start_time\":\"2015-10-08 00:00:00\",\"end_time\":\"2015-10-15 00:00:00\",\"ImgPath\":\"/img/w_img/guide_yxtm.png\",\"TitleStr\":\"优选特卖\"},";
guidelist += "{\"start_time\":\"2015-10-15 00:00:00\",\"end_time\":\"2015-10-22 00:00:00\",\"ImgPath\":\"/img/w_img/guide_pwjj.png\",\"TitleStr\":\"购物返利\"},";
guidelist += "{\"start_time\":\"2015-10-22 00:00:00\",\"end_time\":\"2015-11-01 00:00:00\",\"ImgPath\":\"/img/w_img/guide_pwjj.png\",\"TitleStr\":\"限时抢购\"}";
guidelist += "]}";
function SetHtmlByDate() {
    //var JsonGuidelist = JSON.parse(guidelist);
    //var DateNow = new Date().getTime();
    //var DateStart = new Date().getTime();
    //var DateEnd = new Date().getTime();
    //$("#sp_guide").html("买买买买");
    //$.each(JsonGuidelist.list, function (i, n) {
    //    DateStart = new Date(n.start_time.replace(/-/g, "/"));
    //    DateEnd = new Date(n.end_time.replace(/-/g, "/"));
    //    if (DateNow > DateStart && DateNow < DateEnd) {
    //        $("#sp_guide").html(n.TitleStr);
    //        if ($("#img_guide")) {
    //            $("#img_guide").attr("src", n.ImgPath);
    //        }
    //    }
    //});
    
    Guide.Main();
}

var Guide = {
    Main: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getguideconfig&shopid=hjy",
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.list) {
                if ($("#sp_guide")) {
                    var sp_flag = 0;
                    $.each(g_Exchange_Guide, function (k, o) {
                        if (GetQueryString("from") == o[0] && localStorage[g_const_localStorage.OrderFrom] == o[0]) {
                            if (o[1]=="") {
                                $("#sp_guide").html("客户端“优惠券”中输入<br>" + msg.list[0].TitleStr);
                            }
                            else {
                                $("#sp_guide").html(o[1]);
                            }
                            if (o[2] == "1" && $("#div_app")) {
                                $("#div_app").show();
                            }
                            sp_flag = 1;
                        }
                    });
                    if (sp_flag == 0 && msg.list[0].TitleStr) {
                        $("#sp_guide").html("客户端“优惠券”中输入<br>"+msg.list[0].TitleStr);
                    }
                    //if (GetQueryString("from") == "wy" || localStorage[g_const_localStorage.OrderFrom] == "wy") {
                    //    $("#sp_guide").html("\"摇一摇\"立获30元红包");

                    //}
                    //else if (GetQueryString("from") == "jygw" || localStorage[g_const_localStorage.OrderFrom] == "jygw") {
                    //    $("#sp_guide").html("\"真惠摇\"立获30元红包");
                    //}
                    //else if (GetQueryString("from") == "xzq" || localStorage[g_const_localStorage.OrderFrom] == "xzq"
                    //        || GetQueryString("from") == "xzqsd" || localStorage[g_const_localStorage.OrderFrom] == "xzqsd"
                    //        || GetQueryString("from") == "xzqjs" || localStorage[g_const_localStorage.OrderFrom] == "xzqjs") {
                    //    $("#sp_guide").html("\"惠买惠花\"立获30元红包");
                    //    if ($("#div_app")) {
                    //        $("#div_app").show();
                    //    }
                    //}
                    //else {
                    //    if (msg.list[0].TitleStr) {
                    //        $("#sp_guide").html(msg.list[0].TitleStr);
                    //    }

                    //}
                }
                if ($("#img_guide")) {
                    var img_flag = 0;
                    $.each(g_Exchange_Guide, function (k, o) {
                        if (GetQueryString("from") == o[0] && localStorage[g_const_localStorage.OrderFrom] == o[0]) {
                            if (o[3] == "") {
                                var item;
                                item = sessionStorage.getItem('val');
                                if (!item && $('.hongbao')) {
                                    document.body.scrollTop = 0;
                                    $('.hongbao').show();
                                }
                                else {
                                    $('.hongbao').hide();
                                }
                            }
                            else {
                                $("#img_guide").attr("src", o[3]);
                            }
                            img_flag = 1;
                        }
                    });
                    if (img_flag == 0) {
                        if (msg.list[0].ImgPath) {
                            $("#img_guide").attr("src", msg.list[0].ImgPath);
                        }
                        else {
                            $('.mask,.guide-app').hide();
                        }
                    }

                    //if (GetQueryString("from") == "wy" || localStorage[g_const_localStorage.OrderFrom] == "wy") {
                    //    $("#img_guide").attr("src", "/img/w_img/guide_yyy.png");
                    //}
                    //else if (GetQueryString("from") == "jygw" || localStorage[g_const_localStorage.OrderFrom] == "jygw") {
                    //    // $("#img_guide").attr("src", "/img/w_img/guide_zhy.png");
                    //    var item;
                    //    item = sessionStorage.getItem('val');
                    //    if (!item && $('.hongbao')) {
                    //        document.body.scrollTop = 0;
                    //        $('.hongbao').show();
                    //    }
                    //    else {
                    //        $('.hongbao').hide();
                    //    }
                    //}
                    //else if (GetQueryString("from") == "xzq" || localStorage[g_const_localStorage.OrderFrom] == "xzq") {
                    //    if ($("#img_guide")) {
                    //        $("#img_guide").attr("src", "/img/w_img/guide_xzq.png");
                    //    }
                    //}
                    //else if (GetQueryString("from") == "xzqsd" || localStorage[g_const_localStorage.OrderFrom] == "xzqsd") {
                    //    if ($("#img_guide")) {
                    //        $("#img_guide").attr("src", "/img/w_img/guide_xzq.png");
                    //    }
                    //}
                    //else if (GetQueryString("from") == "xzqjs" || localStorage[g_const_localStorage.OrderFrom] == "xzqjs") {
                    //    if ($("#img_guide")) {
                    //        $("#img_guide").attr("src", "/img/w_img/guide_xzq.png");
                    //    }
                    //}
                    //else {
                    //    if (msg.list[0].ImgPath) {
                    //        $("#img_guide").attr("src", msg.list[0].ImgPath);
                    //    }
                    //    else {
                    //        $('.mask,.guide-app').hide();
                    //    }
                    //}
                }
            }
            else {
                $('.mask,.guide-app').hide();
            }
        });

        request.fail(function (jqXHR, textStatus) {
        });
    },
};