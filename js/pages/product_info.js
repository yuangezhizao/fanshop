function test_item(n) {
    //var menu = document.getElementById("menu");
    //var menuli = menu.getElementsByTagName("li");
    //for (var i = 0; i < menuli.length; i++) {
    //    menuli[i].className = "";
    //    menuli[n].className = "on";
    //    document.getElementById("tabc" + i).className = "no";
    //    document.getElementById("tabc" + n).className = "tabc";
    //}
}

var Product_Detail = {

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
    api_target: "com_cmall_familyhas_api_ApiGetEventSkuInfoNew",
    /*输入参数*/
    api_input: { "picWidth": 0, "productCode": "", "buyerType": "", "version": 1.0 },
    /*用户Token*/
    api_token: "",
    /*接口响应对象*/
    api_response: {},
    /*获取商品详情*/
    GetDetail: function () {
        var s_api_input = JSON.stringify(Product_Detail.api_input);
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
                Product_Detail.AfterLoadDetail(msg);
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
    AfterLoadDetail: function (msg) {
        Product_Detail.LoadDiscriptPicList(msg);
        Product_Detail.LoadPropertyInfoList(msg);
        Product_Detail.LoadCommonQuestion(msg);
    },
    LoadDiscriptPicList: function (msg) {
        $("#tabc0").empty();
        var html = "";
        //提示语
        if (!(msg.tips == undefined)) {
            if (msg.tips.length > 0) {
                html += '<div class="detials01">'
                for (var i = 0; i < msg.tips.length; i++) {
                    html += msg.tips[i];
                }
                html += '</div>';
            }
        }
        html += '<div class="imgs">';
        for (var i = 0; i < msg.discriptPicList.length; i++) {
            var discriptPicList = msg.discriptPicList[i];
            html += '<img src="' + discriptPicList.picNewUrl + ' />';
        }
        html += '</div>';
        $("#tabc0").append(html);
    },
    LoadPropertyInfoList: function (msg) {
        $("#tabc1").empty();
        var html = '<table>';
        for (var i = 0; i < msg.propertyInfoList.length; i++) {
            var propertyInfoList = msg.propertyInfoList[i];
            html += '<tr><td class="w22">' + propertyInfoList.propertykey + '</td><td class="w76">' + propertyInfoList.propertyValue + '</td></tr>';
        }
        html += '</table>';
        $("#tabc1").append(html);
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
            $("#li_commonquestion").show();
        }

    },
};


