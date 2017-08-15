var imgfileControls = {
    //
    fileImg1: { name: "控件1", id: "imgfile1", picture: "", imgshowcontrolID: "imgfile1_imgshowUrl" },
    fileImg2: { name: "控件2", id: "imgfile2", picture: "", imgshowcontrolID: "imgfile2_imgshowUrl" },
    fileImg3: { name: "控件3", id: "imgfile3", picture: "", imgshowcontrolID: "imgfile3_imgshowUrl" },
    fileImg4: { name: "控件4", id: "imgfile4", picture: "", imgshowcontrolID: "imgfile4_imgshowUrl" },
    fileImg5: { name: "控件5", id: "imgfile5", picture: "", imgshowcontrolID: "imgfile5_imgshowUrl" },
    //查找
    find: function (ControlID) {
        for (var k in imgfileControls) {
            var pl = imgfileControls[k];
            if (pl.id == ControlID)
                return pl;
        }
        return null;
    },
    //查找可用控件，返回id
    findfree: function () {
        for (var k in imgfileControls) {
            var pl = imgfileControls[k];
            if (pl.picture == "")
                return pl.id;
        }
        return null;
    },

    //删除picture时默认值的控件
    clear: function () {
        for (var k in imgfileControls) {
            var pl = imgfileControls[k];
            if (pl.picture == "asdfghjhjklkjhh") {
                Upload.DelImg(imgfileControls, pl.id)
            }
        }
        return null;
    },

};

$(document).ready(function () {
    //alert(document.referrer);

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
        Merchant_Group.Back();
    });

    //获得订单号
    $("#hid_order_code").val(GetQueryString("order_code"));
    //获得退款原因Code
    if (GetQueryString("CancelReason") != "") {
        $("#hid_CancelReason").val(GetQueryString("CancelReason"));
    }
    //售后类型
    if (GetQueryString("jtk") == "yes") {
        $("#hid_shlx").val(g_const_afterReimburseType.JTK);
        $("#span_selshlx").html("仅退款");
    }

    //获得SKUCode
    $("#hid_skuCode").val(GetQueryString("skuCode"));

    //判断是否已登录
    UserLogin.Check();


    /*退货原因限制字数*/
    $("#txtFeeddd").on("input propertychange", function () {
        var stxtFeeddd = $("#txtFeeddd").val().Trim();

        if (stxtFeeddd.length > 199) {
            var snew = stxtFeeddd.substr(0, 200);
            $("#txtFeeddd").val(snew);
            //$("#textlen").text(snew.length);
        }
        else {
            //$("#textlen").text(stxtFeeddd.length);
        }
    });

    /*点击上传图片操作，1：增加图片显示控件*/
    $("#li_uploadimg").on("tap", function () {
        imgfileControls.clear();

        //获得可用控件id
        var fileid = imgfileControls.findfree();

        if (fileid == undefined) {
            ShowMesaage(g_const_API_Message["106010"]);
            return;
        }
        else {
            $("#hid_freeimg_id").val(fileid);
            //新增控件
            var temp_html = "<li id=\"li_" + fileid + "\" style=\"display:none;\"><form id=\"" + fileid + "_formImg\" method=\"post\" action=\"/Ajax/API.aspx?action=uploadimg&fileid=" + fileid + "\" enctype=\"multipart/form-data\">"
                + "<div style=\"display:none;\"><input type=\"file\" name=\"" + fileid + "\" id=\"" + fileid + "\" value=\"\"  onchange=\"Upload.UpLoadImg(imgfileControls,'" + fileid + "_formImg', '" + fileid + "', '" + fileid + "_imgshowUrl');\" style=\"\"></div>"
                + "</form>"
                + "<img src=\"/img/portrait.png\" data-url=\"\" id=\"" + fileid + "_imgshowUrl\" alt=\"\">"
                +"<b class=\"deletPic\" onclick=\"Upload.DelImg(imgfileControls,'" + fileid + "')\"></b></li>";

            $("#li_uploadimg").before(temp_html);

            //初始值，避免点击取消后出现重名
            var tt = imgfileControls.find(fileid);
            if (tt != null) {
                tt.picture = "asdfghjhjklkjhh";
            }

            //选择图片，自动执行click事件
            $("#" + fileid).trigger("click");

        }

        //不能上传图片时隐藏
        fileid = imgfileControls.findfree();

        if (fileid == undefined) {
            $("#li_uploadimg").hide();
            return;
        }

    });
    

    //检查退款金额
    $('#txt_MaxPrice').on("input propertychange", function () {
        var temp = $("#txt_MaxPrice").val().Trim();
        if (isNaN(temp)) {
            $("#parseFloat").val(temp.substr(0, temp.length - 1));
            return;
        }
        else {

            if (parseFloat($("#hid_MaxPrice").val()) < parseFloat(temp)) {
                //var snew = temp.substr(0, temp.length - 1);
                //if (snew == "") {
                //    snew = "0.00"
                //}
                //else {
                //    snew = parseFloat(snew).toFixed(2);
                //}
                var snew = parseFloat($("#hid_MaxPrice").val()).toFixed(2);

                $("#txt_MaxPrice").val(snew)
            }
            else {
                $("#txt_MaxPrice").val(parseFloat(temp).toFixed(2));
            }

            if (isNaN($("#txt_MaxPrice").val())) {
                $("#txt_MaxPrice").val("0.00");
                return;
            }

        }
    });

    //检查售后数量
    $('#txt_goodsnum').on("input propertychange", function () {
        var temp = $("#txt_goodsnum").val().Trim();
        if (isNaN(temp)) {
            $("#txt_goodsnum").val(temp.substr(0, temp.length - 1));
            return;
        }
        else {
            if (parseInt($("#hid_GoodsMaxNum").val()) < parseInt(temp)) {
                //var snew = stxtFeeddd.substr(0, temp.length - 1);
                //if (snew == "") {
                //    snew = "0"
                //}
                //else {
                //    snew = parseInt(snew).toFixed(2);
                //}
                $("#txt_goodsnum").val($("#hid_GoodsMaxNum").val());
                if (isNaN($("#hid_GoodsMaxNum").val())) {
                    $("#txt_MaxPrice").val("0.00");
                }
                else {
                    var new_p = (parseFloat($("#hid_OnePrice").val()) * parseFloat($("#hid_GoodsMaxNum").val())).toFixed(2);
                    $("#txt_MaxPrice").val(new_p);
                }
                ShowMesaage("不能超出最大退/换货数量");

            }
            else {
                $("#txt_goodsnum").val(temp);

                var new_p = (parseFloat($("#hid_OnePrice").val()) * parseFloat(temp)).toFixed(2);
                $("#txt_MaxPrice").val(new_p);

            }
            if (isNaN($("#txt_MaxPrice").val())) {
                $("#txt_MaxPrice").val("0.00");
                return;
            }

        }
    });


    //选择售后类型
    $('#li_shlx').on("tap", function () {
        if ($("#ul_shlx").is(':hidden')) {
            //$(this).find('.sl_list').show();

            $("#ul_shlx").show();
            $("#ul_shyy").hide();
            $("#ul_sfsdh").hide();
            return false;
        }
        
    });
    //选择售后原因
    $('#li_shyy').on("tap", function () {
        if ($("#ul_shyy").is(':hidden')) {
            //$(this).find('.sl_list').show();
            $("#ul_shlx").hide();
            $("#ul_shyy").show();
            $("#ul_sfsdh").hide();
            return false;


        }
    });
    //选择是否收到货
    $('#li_sfsdh').on("tap", function () {
        if ($("#ul_sfsdh").is(':hidden')) {
            //$(this).find('.sl_list').show();
            $("#ul_shlx").hide();
            $("#ul_shyy").hide();
            $("#ul_sfsdh").show();
            return false;

        }
    });


    //点击其他位置隐藏层
    //$(document).click(function () {
    //    $('.sl_list').hide();
    //})

    //售后公告
    //ApiForNotice.Show();

    /*退换货前置信息退换货前置信息*/
    ReturnGoodsInfo.GetList();

    //提交退款售后
    $("#sh_submit").on("tap", function () {

        imgfileControls.clear();

        MyTKSH_SQ.Check();
    });

});
/*退换货前置信息退换货前置信息*/
var ReturnGoodsInfo = {
    api_target: "com_cmall_familyhas_api_ApiForReturnGoodsInfo",
    api_input: { "orderCode": "", "productCode": "" },
    GetList: function () {
        //赋值
        ReturnGoodsInfo.api_input.orderCode = $("#hid_order_code").val();
        ReturnGoodsInfo.api_input.productCode = $("#hid_skuCode").val();

        //组织提交参数
        var s_api_input = JSON.stringify(this.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": ReturnGoodsInfo.api_target, "api_token": g_const_api_token.Wanted };
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
                    UserRELogin.login(g_const_PageURL.MyTKSH_SQ + "?order_code=" + $("#hid_order_code").val() + "&CancelReason=" + $("#hid_CancelReason").val() + "&skuCode=" + $("#hid_skuCode").val() + "&t=" + Math.random());
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                ReturnGoodsInfo.Load_Result(msg);
            }
            else {

                ShowMesaageCallback(msg.resultMessage, Merchant_Group.Back, 3000);
                // ShowMesaage(msg.resultMessage);
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            //ShowMesaage(g_const_API_Message["7001"]);
            ShowMesaageCallback(g_const_API_Message["7001"], Merchant_Group.Back, 3000);

        });
    },
    //接口返回成功后的处理
    Load_Result: function (msg) {

        //判断过期
        if (msg.outDateFlag == g_const_AfterOutDateFlag.GQ) {
            //$("#div_notice").hide();
            //$("#ul_tuihuo").hide();
            //$("#article_ms").hide();
            
            $("#div_applycustomer").hide();
            $("#div_overdue_str").html(msg.outDateMsg);
            $("#div_overdue").show();

            setTimeout(Merchant_Group.Back, 3000);
            //弹出过期提示，返回来源
            //ShowMesaageCallback(msg.outDateMsg, "Merchant_Group.Back", 3000);
        }
        else {
            //$("#div_notice").show();
            //$("#ul_tuihuo").show();
            //$("#article_ms").show();
            //$("#div_uploadPic").show();
            //$("#sh_submit").show();

            $("#div_overdue_str").html("");
            $("#div_overdue").hide();
            $("#div_applycustomer").show();


            //售后类型
            var temp_shlx = "";
            var temp_default_code = "";
            var temp_default_txt = "";
            var temp_show_default = "";
            $.each(msg.reimburseType, function (s, m) {
                if (s == 0) {
                    temp_default_txt=m.reimburseContext;
                    temp_default_code=m.reimburseCode;
                }
                if ($("#hid_shlx").val() == m.reimburseCode) {
                    $("#span_selshlx").html(m.reimburseContext);
                    $("#hid_shlx").val(m.reimburseCode);
                    temp_show_default = "true";
                }
                temp_shlx += "<li id=\"li_" + m.reimburseCode + "\" onclick=\"SelectVal.sel('shlx','" + m.reimburseCode + "','" + m.reimburseContext + "')\">" + m.reimburseContext + "</li>";
            });


            if (temp_show_default == "") {
                $("#span_selshlx").html(temp_default_txt);
                $("#hid_shlx").val(temp_default_code);
            }

            $("#ul_shlx").html(temp_shlx);
            //只有一个售后类型时，隐藏下拉箭头和点击事件无效
            if (msg.reimburseType.length==1) {
                $("#span_cust_b").hide();
                $("#li_shlx").off("tap");
            }

            //退货原因
            temp_show_default = "";
            temp_thyy = "";
            $.each(msg.reimburseReason, function (s, m) {
                if (s == 0) {
                    $("#hid_thyy_li_first_txt").val(m.reson_content);
                    $("#hid_thyy_li_first_val").val(m.reason_code);
                }
                if (m.reason_code == $("#hid_CancelReason").val()) {
                    temp_show_default = "true";
                    $("#span_shyy").html(m.reson_content);
                }
                temp_thyy += "<li onclick=\"SelectVal.sel('shyy','" + m.reason_code + "','" + m.reson_content + "')\">" + m.reson_content + "</li>";
            });
            $("#hid_thyy_li").val(temp_thyy);
            if (temp_show_default=="") {
                $("#hid_CancelReason").val($("#hid_thyy_li_first_val").val());
            }


            //换货原因
            temp_hhyy = "";
            //$.each(msg.changeGoodsReason, function (s, m) {
            $.each(msg.reimburseReason, function (s, m) {
                    if (s == 0) {
                    $("#hid_hhyy_li_first_txt").val(m.reson_content);
                    $("#hid_hhyy_li_first_val").val(m.reason_code);
                }

                if (m.reason_code == $("#hid_CancelReason").val()) {
                    $("#span_shyy").html(m.reson_content);
                }
                temp_hhyy += "<li onclick=\"SelectVal.sel('shyy','" + m.reason_code + "','" + m.reson_content + "')\">" + m.reson_content + "</li>";
            });
            $("#hid_hhyy_li").val(temp_hhyy);

            //换货还是退货
            if ($("#hid_shlx").val() == g_const_afterReimburseType.HH) {
                //换货
                $("#ul_shyy").html($("#hid_hhyy_li").val());
                $("#li_sfsdh").show();

                //换货 隐藏退款金额
                $("#li_tkje").hide();
                $("#txt_MaxPrice").val("0.00");

            }
            else {
                if ($("#hid_shlx").val() == g_const_afterReimburseType.JTK) {
                    //仅退款 隐藏退货数量
                    $("#li_sfsdh").hide();
                }
                //退款退货
                $("#ul_shyy").html(temp_thyy);
                $("#li_tkje").show();

            }

            //最大退货数量
            
            $("#txt_goodsnum").val(msg.maxReturnNum);
            $("#hid_GoodsMaxNum").val(msg.maxReturnNum);

            //sku单价和最高总价
            $("#hid_OnePrice").val(msg.skuPrice);
            var allPrice = parseFloat(parseFloat(msg.skuPrice) * parseFloat(msg.maxReturnNum)).toFixed(2);
            $("#txt_MaxPrice").val(allPrice);
            $("#hid_MaxPrice").val(allPrice);

            //微公社价格
            //$("#span_ichsy").html(parseFloat(msg.wgsPrise).toFixed(2));
            //运费
            $("#span_yf").html(parseFloat(msg.freightPrise).toFixed(2));

        }

    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
    /*换货还是退货*/
    HHOrTH: function () {
        //根据默认售后类型决定售后原因
        if ($("#hid_shlx").val() == g_const_afterReimburseType.HH) {
            //换货
            $("#ul_shyy").html($("#hid_hhyy_li").val());
            //默认选项
            $("#span_shyy").html($("#hid_hhyy_li_first_txt").val());
            $("#hid_CancelReason").val($("#hid_hhyy_li_first_val").val());

            //换货 隐藏退款金额
            $("#li_tkje").hide();
            $("#txt_MaxPrice").val("0.00");
        }
        else {
            if ($("#hid_shlx").val() == g_const_afterReimburseType.JTK) {
                //仅退款 隐藏退货数量
                $("#li_sfsdh").hide();
            }
            else {
                //切换售后类型时，收货状态恢复默认
                $("#span_sfsdh").html("否");
                $("#hid_sfsdh").val(g_const_afterIsGetProduce.WSD);
                                    
                $("#li_sfsdh").show();
            }
            //退款退货
            $("#ul_shyy").html(temp_thyy);
            //默认选项
            $("#span_shyy").html($("#hid_thyy_li_first_txt").val());
            $("#hid_CancelReason").val($("#hid_thyy_li_first_val").val());

            $("#li_tkje").show();
        }
    },
};

/*公告*/
var ApiForNotice = {
    api_target: "com_cmall_familyhas_api_ApiForNotice",
    api_input: { "notice_show_place": "" },
    Show: function () {
        ApiForNotice.api_input.notice_show_place = g_const_notice_show_place.SQSH;

        //组织提交参数
        var s_api_input = JSON.stringify(this.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": ApiForNotice.api_target, "api_token": g_const_api_token.Unwanted };
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
                ApiForNotice.Load_Result(msg);
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
        var temp = "";
        $.each(msg.noticeList, function (s, m) {
            if (m.notice_show_place == g_const_notice_show_place.SQSH) {
               // temp += m.notice_content;
                $.each(m.notice_content.split('；'), function (ss, ms) {
                    if (ss <= 2) {
                        temp += "<li>" + ms + "</li>";
                    }
                });
            }
        });
        if (temp != "") {
            temp = "<ul>" + temp + "</ul>";
            $("#div_notice").html(temp);
            $("#div_notice").show();
        }
        else {
            $("#div_notice").hide();
        }

    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
};

///*退款退货原因[作废]*/
//var CancelShipmentsReason = {
//    api_target: "com_cmall_familyhas_api_ApiForCancelShipmentsReason",
//    api_input: { "version": "1" },
//    GetList: function () {

//        //组织提交参数
//        var s_api_input = JSON.stringify(this.api_input);
//        //提交接口[api_token不为空，公用方法会从sission中获取]
//        var obj_data = { "api_input": s_api_input, "api_target": CancelShipmentsReason.api_target, "api_token": g_const_api_token.Unwanted };
//        var purl = g_APIUTL;
//        var request = $.ajax({
//            url: purl,
//            cache: false,
//            method: g_APIMethod,
//            data: obj_data,
//            dataType: g_APIResponseDataType
//        });
//        //正常返回
//        request.done(function (msg) {
//            if (msg.resultCode == g_const_Success_Code) {
//                CancelShipmentsReason.Load_Result(msg);
//            }
//            else {
//                ShowMesaage(msg.resultMessage);
//            }
//        });
//        //接口异常
//        request.fail(function (jqXHR, textStatus) {
//            ShowMesaage(g_const_API_Message["7001"]);
//        });
//    },
//    //接口返回成功后的处理
//    Load_Result: function (resultlist) {

//        var li_str = "";
//        var CancelReasonCode = $("#hid_CancelReason").val();
//        $.each(resultlist.reasonList, function (s, m) {
//            if (m.reason_code == CancelReasonCode) {
//                $("#span_shyy").html(m.reson_content);
//            }
//            li_str += "<li onclick=\"SelectVal.sel('shyy','" + m.reason_code + "')\">" + m.reson_content + "</li>";
//        });
//        $("#li_shyy").html(li_str);

//    },
//    //接口返回失败后的处理
//    Load_ResultErr: function (resultlist) {
//    },
//};

/*选择内容*/
var SelectVal = {
    sel: function (type, selval,selectContent) {
        switch(type){
            case "shlx":/*售后类型*/
                $("#span_selshlx").html(selectContent);
                $("#hid_shlx").val(selval);
                ReturnGoodsInfo.HHOrTH();
                break;
            case "shyy":/*售后原因*/
                $("#span_shyy").html(selectContent);
                $("#hid_CancelReason").val(selval);
                break;
            case "sfsdh":/*是否收到货*/
                $("#span_sfsdh").html(selectContent);
                $("#hid_sfsdh").val(selval);
                break;
        }
        $('.sl_list').hide();
    },
};

/*提交售后请求*/
var MyTKSH_SQ = {
    api_target: "com_cmall_familyhas_api_ApiForReturnGoods",
    api_input: { "certificatePic": "", "reimburseMoney": "", "reimburseReason": "", "isGetProduce": "", "reimburseTips": "", "orderCode": "", "reimburseType": "", "produceNum": "", "skuCode": ""},
    /*验证*/
    Check: function () {

        if ($("#hid_CancelReason").val().Trim() == "") {
            ShowMesaage(g_const_API_Message["106012"]);
            return;
        }
        if (isNaN($("#txt_goodsnum").val().Trim()) || $("#txt_goodsnum").val().Trim()=="") {
            ShowMesaage(g_const_API_Message["106013"]);
            return;
        }
        if (isNaN($("#txt_MaxPrice").val().Trim()) || $("#txt_goodsnum").val().Trim() == "") {
            ShowMesaage(g_const_API_Message["106011"]);
            return;
        }

        $("#sh_submit").hide();
        $("#sh_submit_o").show();

        MyTKSH_SQ.tkshSubmit();
    },
    /*提交*/
    tkshSubmit: function () {
        /*赋值*/
        //退换货图片
        var certificatePic=[];
        for (var k in imgfileControls) {
            var pl = imgfileControls[k];
            if (pl.picture != "" && !(pl.picture == undefined) && pl.picture != "asdfghjhjklkjhh") {
                certificatePic.push(pl.picture);
            }
        }
        MyTKSH_SQ.api_input.certificatePic = certificatePic;
        //退款原因
        MyTKSH_SQ.api_input.reimburseMoney = $("#txt_MaxPrice").val().Trim();
        //退款金额
        MyTKSH_SQ.api_input.reimburseReason = $("#hid_CancelReason").val().Trim();
        //手否收到货
        MyTKSH_SQ.api_input.isGetProduce = $("#hid_sfsdh").val().Trim();
        //备注
        MyTKSH_SQ.api_input.reimburseTips = $("#txtFeeddd").val().Trim();
        //订单号
        MyTKSH_SQ.api_input.orderCode = $("#hid_order_code").val().Trim();
        //售后类型
        MyTKSH_SQ.api_input.reimburseType = $("#hid_shlx").val().Trim();
        //售后数量
        MyTKSH_SQ.api_input.produceNum = $("#txt_goodsnum").val().Trim();
        //售后类型
        MyTKSH_SQ.api_input.skuCode = $("#hid_skuCode").val().Trim();


        /*组织提交参数*/
        var s_api_input = JSON.stringify(this.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": MyTKSH_SQ.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });
        /*正常返回*/
        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    PageUrlConfig.SetUrl();

                    //Session失效，重新登录，传递回调地址
                    UserRELogin.login(g_const_PageURL.MyTKSH_SQ + "?order_code=" + $("#hid_order_code").val() + "&CancelReason=" + $("#hid_CancelReason").val() + "&skuCode=" + $("#hid_skuCode").val() + "&t=" + Math.random());
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    $("#sh_submit").show();
                    $("#sh_submit_o").hide();

                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                MyTKSH_SQ.Load_Result(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
                $("#sh_submit").show();
                $("#sh_submit_o").hide();

            }
        });
        /*接口异常*/
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
            $("#sh_submit").show();
            $("#sh_submit_o").hide();

        });
    },
    /*接口返回成功后的处理*/
    Load_Result: function (msg) {
        //弹出过期提示，返回来源
        ShowMesaageCallback(g_const_API_Message["106020"], MyTKSH_SQ.GoToList, 3000);
    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
    /*跳转至列表页*/
    GoToList: function (resultlist) {
        window.location.replace(g_const_PageURL.MyTKSH_List + "?t=" + Math.random());
    },

};
