var old_nickname = '';
$(document).ready(function () {
    $("#txtnickname").focus();
    $('#close').click(function () {
        $(this).hide();
        $('#txtnickname').val('');
        save_flag = 0;
        $('#btnSave').attr("style", "color:grey");
    });
    $("#btnBack").click(function () {
        window.location.replace(PageUrlConfig.BackTo(1));
    });
    $('#txtnickname').click(function () {
        $('#close').show();
    });
    $('#btnSave').click(function () {
        if (save_flag == 0) {
            return;
        }
        if (old_nickname == $("#txtnickname").val()) {
            ShowMesaage(g_const_API_Message["106006"]);
            return;
        }
        if ($("#txtnickname").val().length < 2 || $("#txtnickname").val().length > 7) {
            ShowMesaage(g_const_API_Message["106005"]);
            return;
        }
        for (var i = 0; i < $("#txtnickname").val().length; i++) {
            var boo = false;
            var tempttt = $("#txtnickname").val().substr(i, 1);
            if (!isInteger(tempttt)) {
                if (!isEnglishStr(tempttt)) {
                    if (!isChinese(tempttt)) {
                            if (tempttt != "-" || tempttt != "-") {
                                boo = true;
                            }
                    }
                }
            }

            if (tempttt == "~" || tempttt == "！" || tempttt == "@" || tempttt == "#" || tempttt == "￥" || tempttt == "%" || tempttt == "……" || tempttt == "&" || tempttt == "*" || tempttt == "（" || tempttt == "）" || tempttt == "——" || tempttt == "+" || tempttt == "【" || tempttt == "】" || tempttt == "{" || tempttt == "}" || tempttt == "：" || tempttt == "“" || tempttt == "”" || tempttt == "，" || tempttt == "。" || tempttt == "、" || tempttt == "？") {
                boo = true;
            }

            if (boo) {
                ShowMesaage(g_const_API_Message["106005"]);
                return;
            }
        }
        
        MemberInfo.api_input_save.nickName = $("#txtnickname").val();
        MemberInfo.Save();
    });
    $('#txtnickname').keyup(function () {
        if ($("#txtnickname").val().length > 0) {
            save_flag = 1;
            $('#btnSave').attr("style", "color:black");
        }
        else {
            save_flag = 0;
            $('#btnSave').attr("style", "color:grey");
        }
    });

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
                    UserRELogin.login(g_const_PageURL.MyAccount)
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
            if ($("#txtnickname").val().length > 0) {
                save_flag = 1;
                $('#btnSave').attr("style", "color:black");
            }
            else {
                save_flag = 0;
                $('#btnSave').attr("style", "color:grey");
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (result) {
        // $("#img_headpic").attr("src", g_GetMemberPictrue(result.headPhoto));
        old_nickname = result.nickName;
        $("#txtnickname").val(result.nickName);
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

                Message.ShowToPage(g_const_API_Message["106004"], PageUrlConfig.BackTo(1), 2000, "");
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