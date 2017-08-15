var imgfileControls = {
    //
    fileImg1: { name: "控件1", id: "imgfile1", picture: "", imgshowcontrolID: "imgfile1_imgshowUrl" },
    fileImg2: { name: "控件2", id: "imgfile2", picture: "", imgshowcontrolID: "imgfile2_imgshowUrl" },
    fileImg3: { name: "控件3", id: "imgfile3", picture: "", imgshowcontrolID: "imgfile3_imgshowUrl" },
    //fileImg4: { name: "控件4", id: "imgfile4", picture: "", imgshowcontrolID: "imgfile4_imgshowUrl" },
    //fileImg5: { name: "控件5", id: "imgfile5", picture: "", imgshowcontrolID: "imgfile5_imgshowUrl" },
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


    //售后单号
    $("#hid_afterCode").val(GetQueryString("afterCode"));

    //微信中显示“扫描”
    if (IsInWeiXin.check()) {
        $("#span_danhao").show();
        $("#span_danhao").on("tap", function () {
            //调用微信jsapi，调用扫描
            //WX_JSAPI_T.LoadParam(g_const_wx_jsapi.scanQRCode);
            WX_JSAPI_T.LoadParam("scanQRCode");
            
        });

        MyTKSH_TXWL.SetWXScanQRCode();
    }
    else {
        $("#span_danhao").hide();
        $("#span_danhao").off("tap");
    }
    //判断是否已登录
    UserLogin.Check();

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
                    + "<div style=\"display:none;\"><input type=\"file\" name=\"" + fileid + "\" id=\"" + fileid + "\" value=\"aaa\"  onchange=\"Upload.UpLoadImg(imgfileControls,'" + fileid + "_formImg', '" + fileid + "', '" + fileid + "_imgshowUrl');\" style=\"\"></div>"
                    + "</form>"
                    + "<img src=\"/img/portrait.png\" data-url=\"\" id=\"" + fileid + "_imgshowUrl\" alt=\"\">"
                    + "<b class=\"deletPic\" onclick=\"Upload.DelImg(imgfileControls,'" + fileid + "')\"></b></li>";

                $("#li_uploadimg").before(temp_html);

                //初始值，避免点击取消后出现重名
                var tt = imgfileControls.find(fileid);
                if (tt != null) {
                    tt.picture = "asdfghjhjklkjhh";
                }

                //选择图片，自动执行click事件
                $("#" + fileid).trigger("click"); //
        }

        //不能上传图片时隐藏
        fileid = imgfileControls.findfree();

        if (fileid == undefined) {
            $("#li_uploadimg").hide();
            return;
        }

    });

    //选择快递公司
    $('#li_kd').on("tap", function () {
        if ($(".sl_list").is(':hidden')) {
            $(this).find('.sl_list').show();
        }
        else {
            //$('.sl_list').hide();
        }
        
        //return false;
    });

    ////点击其他位置隐藏层
    //$(document).click(function () {
    //    $('.sl_list').hide();
    //})

    if ($("#hid_afterCode").val() != "") {
        //完善退换货物流提示
        MyTKSH_TXWL_Tips.Show();
        /*快递公司*/
        MyTKSH_TXWL_KDGS.Show();

        //提交退款售后
        $("#div_submit").on("tap", function () {
            $("#div_submit").hide();
            $("#div_submit_o").show();
            imgfileControls.clear();

            MyTKSH_TXWL.Check();
        });
    }
    else {
        ShowMesaage("售后单编号不能为空");
        setTimeout(Merchant_Group.Back(), 5000);
    }
});
/*完善退换货物流提示*/
var MyTKSH_TXWL_Tips = {
    api_target: "com_cmall_familyhas_api_ApiForFillShipmentsTips",
    api_input: { "afterCode": "" },
    Show: function () {
        //赋值
        MyTKSH_TXWL_Tips.api_input.afterCode = $("#hid_afterCode").val();

        //组织提交参数
        var s_api_input = JSON.stringify(this.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": MyTKSH_TXWL_Tips.api_target, "api_token": g_const_api_token.Wanted };
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
                    UserRELogin.login(g_const_PageURL.MyTKSH_TXWL + "?afterCode=" + $("#hid_afterCode").val() + "&t=" + Math.random());
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                MyTKSH_TXWL_Tips.Load_Result(msg);
            }
            else {
                //ShowMesaage(msg.resultMessage);
                $("#div_submit").hide();
               //  setTimeout(Merchant_Group.Back(), 2000);

                ShowMesaageCallback(g_const_API_Message["7001"], Merchant_Group.Back, 3000);


            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //接口返回成功后的处理
    Load_Result: function (msg) {
        if (msg.tips != "" && !(msg.tips == undefined)) {
            $("#div_notice").html(msg.tips);
            $("#div_notice").show()
        }
        else {
            $("#div_notice").hide();
        }

    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
};

/*快递公司*/
var MyTKSH_TXWL_KDGS= {
    api_target: "com_cmall_familyhas_api_APiForExpressCompany",
    api_input: { "version": "1" },
    Show: function () {
        //赋值
        //MyTKSH_TXWL_KDGS.api_input.afterCode = $("#hid_afterCode").val();

        //组织提交参数
        var s_api_input = JSON.stringify(this.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": MyTKSH_TXWL_KDGS.api_target, "api_token": g_const_api_token.Unwanted };
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
                MyTKSH_TXWL_KDGS.Load_Result(msg);
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
        temp_kd = "";
        $.each(msg.companyList, function (s, m) {
            if (s == 0) {
                $("#span_sel_kd").html(m.logisticse_name);
                $("#hid_sel_kd").val(m.logisticse_code);
            }
            temp_kd += "<li onclick=\"MyTKSH_TXWL_KDGS.sel('" + m.logisticse_code + "','" + m.logisticse_name + "')\">" + m.logisticse_name + "</li>";
        });
        $("#ul_kd").html(temp_kd);

    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
    //选中项
    sel: function (selval,selectContent) {
        $("#span_sel_kd").html(selectContent);
        $("#hid_sel_kd").val(selval);
        $('.sl_list').hide();
    },
};

/*提交售后物流*/
var MyTKSH_TXWL = {
    api_target: "com_cmall_familyhas_api_ApiForFillShipments",
    api_input: { "logisticsCode": "", "logisticsCompanyName": "", "afterCode": "", "logisticsPic": ""},
    /*验证*/
    Check: function () {
        if ($("#txt_kddh").val().Trim() == "") {
            ShowMesaage(g_const_API_Message["106014"]);
            return;
        }
        if ($("#hid_sel_kd").val().Trim() == "") {
            ShowMesaage(g_const_API_Message["106015"]);
            return;
        }
        MyTKSH_TXWL.Submit();
    },
    /*提交*/
    Submit: function () {
        /*赋值*/
        //图片
        var logisticsPic = [];
        for (var k in imgfileControls) {
            var pl = imgfileControls[k];
            if (pl.picture != "" && !(pl.picture == undefined) && pl.picture != "asdfghjhjklkjhh") {
                logisticsPic.push(pl.picture);
            }
        }
        MyTKSH_TXWL.api_input.logisticsPic = logisticsPic;
        //快递单号
        MyTKSH_TXWL.api_input.logisticsCode = $("#txt_kddh").val().Trim();
        //快递公司编号
        MyTKSH_TXWL.api_input.logisticsCompanyName = $("#hid_sel_kd").val().Trim();
        //售后单号
        MyTKSH_TXWL.api_input.afterCode = $("#hid_afterCode").val().Trim();

        /*组织提交参数*/
        var s_api_input = JSON.stringify(this.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": MyTKSH_TXWL.api_target, "api_token": g_const_api_token.Wanted };
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
                    UserRELogin.login(g_const_PageURL.MyTKSH_TXWL + "?afterCode=" + $("#hid_afterCode").val()+ "&t=" + Math.random());
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                MyTKSH_TXWL.Load_Result(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        /*接口异常*/
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    /*接口返回成功后的处理*/
    Load_Result: function (msg) {
        ShowMesaageCallback(g_const_API_Message["106016"], MyTKSH_TXWL.GoToList, 3000);
    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
    /*跳转至列表页*/
    GoToList: function (resultlist) {
       // window.location.replace(g_const_PageURL.MyTKSH_List + "?t=" + Math.random());
        Merchant_Group.Back();
    },
    /*获取微信必要信息*/
    SetWXScanQRCode: function () {
        if (IsInWeiXin.check()) {
            WX_JSAPI_T.wx = wx;
            WX_JSAPI_T.wxparam.debug = false;
            WX_JSAPI_T.jsApiList = "scanQRCode";//g_const_wx_jsapi.scanQRCode;
            //点击按钮的回调方法
            WX_JSAPI.func_CallBack = function () {
                $("#span_danhao").on("tap", function () {
                    WX_JSAPI_T.WX_ScanQRCode();
                });
            };
           // WX_JSAPI_T.LoadParam(g_const_wx_jsapi.scanQRCode);
            //WX_JSAPI_T.LoadParam("scanQRCode");
            
        }
    },

    /*显示扫描结果*/
    ScanQRCodeResult: function (Str) {
        $("#txt_kddh").val(Str);
    },

};
