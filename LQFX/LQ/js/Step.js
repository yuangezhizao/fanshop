var verifyFlag = g_const_SMSPic_Flag;
var smstype = 6
$(document).ready(function () {
    if (verifyFlag == 1) {
        $("#li_Verify").show();
        $("#Verify_codeImag").attr("src", "/Ajax/LoginHandler.ashx?action=code");

    }
    else {
        $("#li_Verify").hide();
        $("#Verify_codeImag").attr("src", "");
    }
    if (GetQueryString("sharephone")!="") {
        sharephone = Base64.base64decode(decodeURIComponent(GetQueryString("sharephone")));
    }
    $("#div_step1").show();
    $("#div_step2").hide();
    $("#a_step1").click(function () {
        if ($("#txtPhoneNo").val().length == 0) {
            ShowMesaage(g_const_API_Message["107901"]);
            return;
        }
        if (!isMobile($("#txtPhoneNo").val())) {
            ShowMesaage(g_const_API_Message["107902"]);
            return;
        }
        Step1.Submit();
    });
    $("#a_step2").click(function () {
        if ($("#txtPhoneNo").val().length == 0) {
            ShowMesaage(g_const_API_Message["107901"]);
            return;
        }
        if (!isMobile($("#txtPhoneNo").val())) {
            ShowMesaage(g_const_API_Message["107902"]);
            return;
        }
        if ($("#txtValidCode").val().length == 0) {
            ShowMesaage(g_const_API_Message["107802"]);
            return;
        }
        if ($("#txtPass").val().length == 0) {
            ShowMesaage(g_const_API_Message["7903"]);
            return;
        }
        if ($("#txtPass").val().length < 6 || $("#txtPass").val().length > 16 || $("#txtPass").val().indexOf(' ') > -1) {
            ShowMesaage(g_const_API_Message["7904"]);
            return;
        }
        Register.PhoneRegister();
    });
    $("#btnCode").click(function () {
        var piccode = $("#txtPicCode").val();
        if (verifyFlag == 1) {
            if (piccode.length == 0) {
                ShowMesaage(g_const_API_Message["8904"]);
                return;
            }
        }
        var phoneNo = $("#txtPhoneNo").val();
        if (phoneNo.length == 0) {
            ShowMesaage(g_const_API_Message["107901"]);
            return;
        }
        if (!isMobile(phoneNo)) {
            ShowMesaage(g_const_API_Message["107902"]);
            return;
        }
        var phoneNo = $("#txtPhoneNo").val();
        var action = "lqfxtqvalidcode";
        Send_ValidCode.SendCodeImgEx(action, phoneNo, piccode, smstype);
    });
});

var Step1 = {
    Submit: function () {
        Register.PhoneCheck();

    },
}

var sharephone = "";

//注册
var Register = {
    PhoneCheck: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=phoneexist&phoneno=" + $("#txtPhoneNo").val(),
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {
                    $("#div_step1").hide();
                    $("#div_step2").show();
                   // $("#p_code").html(g_const_API_Message["108903"]);
                    //var phoneNo = $("#txtPhoneNo").val();
                    //var action = "lqfxtqvalidcode";
                    //Send_ValidCode.SendCode(action, phoneNo);
                    
                    
                }
                else {
                    var pageurl = g_const_PageURL.Lqfxtq_Rs + "?t=" + Math.random();
                    location.href = pageurl;
                   // Message.ShowToPage(g_const_API_Message["8902"], pageurl, 2000, "");
                  //  ShowMesaage(g_const_API_Message["8901"]);
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    PhoneRegister: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=phonereg_lqfxtq&phoneno=" + $("#txtPhoneNo").val() + "&validcode=" + $("#txtValidCode").val() + "&password=" + $("#txtPass").val() + "&sharephone=" + sharephone,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {
                    Register.Load_Result();
                }
                else {
                    ShowMesaage(g_const_API_Message[msg.resultcode]);
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function () {
        var pageurl = g_const_PageURL.Lqfxtq_Rs + "?t=" + Math.random();
        Message.ShowToPage(g_const_API_Message["7002"], pageurl, 2000, "");
    },
};

var Message = {
    ShowToPage: function (message, pageurl, time, str_callback) {
        var backurl = window.location.href;
        if (str_callback != "") {
            if (backurl.indexOf("?") != -1) {
                backurl += "&callback=" + encodeURIComponent(str_callback);
            }
            else {
                backurl += "callback=" + encodeURIComponent(str_callback);
            }
        }

        localStorage[g_const_localStorage.BackURL] = backurl;
        ShowMesaage(message);
        setTimeout("window.location.replace(\"" + pageurl + "\");", time);
    }
};