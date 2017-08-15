var imgfileControls = {
    //
    fileImg1: { name: "控件1", id: "imgfile1", picture: "", imgshowcontrolID: "imgfile1_imgshowUrl" },

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
    clear: function (allClear) {
        for (var k in imgfileControls) {
            var pl = imgfileControls[k];
            if (allClear) {
                //强制清除
                Upload.DelImg(imgfileControls, pl.id, 'tp')
            }
            else {
                if (pl.picture == "asdfghjhjklkjhh_tp") {
                    Upload.DelImg(imgfileControls, pl.id, '')
                }
            }
        }
        return null;
    },

};

$(document).ready(function () {
    //返回
    $("#go_back").on("tap", function () {
        Merchant_Group.Back();
    });
    //判断是否已登录
    UserLogin.Check();

    /*点击上传图片操作，1：增加图片显示控件*/
    $("#li_uploadimg").on("tap", function () {
        //imgfileControls.clear(true);

        //获得可用控件id
        var fileid = "imgfile1";// imgfileControls.findfree();

        if (fileid == undefined) {
            ShowMesaage(g_const_API_Message["106010"]);
            return;
        }
        else {
            $("#hid_freeimg_id").val(fileid);
            //新增控件
            var temp_html = "<li id=\"li_" + fileid + "\" style=\"display:none;\"><form id=\"" + fileid + "_formImg\" method=\"post\" action=\"/Ajax/API.aspx?action=uploadimg&saveFullPath=1&fileid=" + fileid + "\" enctype=\"multipart/form-data\">"
                + "<div style=\"display:none;\"><input type=\"file\" name=\"" + fileid + "\" id=\"" + fileid + "\" value=\"\"  onchange=\"Upload.UpLoadImg(imgfileControls,'" + fileid + "_formImg', '" + fileid + "', '" + fileid + "_imgshowUrl');\" style=\"\"></div>"
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
            $("#" + fileid).trigger("click");

        }

        //不能上传图片时隐藏
        fileid = imgfileControls.findfree();

        if (fileid == undefined) {
            //$("#li_uploadimg").hide();
            return;
        }

    });

    //提交退款售后
    $("#sh_submit").on("tap", function () {

        imgfileControls.clear();

        //获取选择的图片
        var pic ="";
        var pl = imgfileControls[k];
        if (pl.picture != "" && !(pl.picture == undefined) && pl.picture != "asdfghjhjklkjhh") {
            pic=pl.picture;
        }

        MemberInfo.api_input_save.headPhoto =pic;
        MemberInfo.Save();
    });

    /*获取原有头像*/
    MemberInfo.GetList();
});

var save_flag = 1;

var MemberInfo = {
    api_target: "com_cmall_familyhas_api_ApiMemberInfoCf",
    api_input: {},
    api_response: {},
    GetList: function () {
        var s_api_input = JSON.stringify(MemberInfo.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": MemberInfo.api_target, "api_token": g_const_api_token.Wanted };
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
                    UserRELogin.login(g_const_PageURL.MyAvatar)
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                MemberInfo.Load_Result(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (result) {
        if (result.headPhoto != "") {

            $("#img_headpic").attr("src", result.headPhoto);
        }
    },

    api_input_save: { "nickName": "", "headPhoto": "" },
    Save: function () {
        var s_api_input = JSON.stringify(MemberInfo.api_input_save);
        var obj_data = { "api_input": s_api_input, "api_target": MemberInfo.api_target, "api_token": g_const_api_token.Wanted };
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
                    UserRELogin.login(g_const_PageURL.MyNickName)
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {

                Message.ShowToPage(g_const_API_Message["106021"], PageUrlConfig.BackTo(1), 2000, "");
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
}
