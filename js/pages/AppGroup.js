$(document).ready(function () {

    ////=======接收参数=========================
    //app名称
    var app = GetUrlParam.up_urlparam("app");//GetQueryString("app")
    //来源android或ios
    var from = GetUrlParam.up_urlparam("from");//GetQueryString("from")
    //登录：login，注册：register，重置密码：resetPassword
    var to = GetQueryString("to")
    //微信授权号，不需要微信登录可传空
    var wxopenid = GetUrlParam.up_urlparam("wxopenid");//GetQueryString("wxopenid")

    //=======业务处理===========================
    AppGroup.GoTo(app,from, to, wxopenid);

});

var AppGroup = {
    /*后台处理【暂时放弃，直接跳转】*/
    Main: function (app,from,to,wxopenid) {
        //var purl = g_INAPIUTL;
        //var request = $.ajax({
        //    url: purl,
        //    cache: false,
        //    method: g_APIMethod,
        //    data: "t=" + Math.random() + "&action=appgroup&app="+app+"&from=" + from + "&to=" +to+"&wxopenid="+wxopenid,
        //    dataType: g_APIResponseDataType
        //});

        //request.done(function (msg) {
        //    if (msg.resultcode) {
        //        if (msg.resultcode == g_const_Success_Code) {
        //            AppGroup.Load_Result(JSON.parse(msg.resultmessage));
        //        }
        //        else {
        //            if (g_const_API_Message[msg.resultcode]) {
        //                ShowMesaage(g_const_API_Message[msg.resultcode]);
        //            }
        //            else {
        //                ShowMesaage(msg.resultmessage);
        //            }
        //        }
        //    }
        //});

        //request.fail(function (jqXHR, textStatus) {
        //    ShowMesaage(g_const_API_Message["7001"]);
        //});
    },
    Load_Result: function (msg) {
        //if (IsInWeiXin.check()) {
        //}
        //msg.returnurl = PageUrlConfig.BackTo();
        //var str_loginjs = JSON.stringify(msg);
        //g_type_loginjs.Execute(str_loginjs);
    },
    /*跳转*/
    GoTo: function (app, from, to, wxopenid) {
        //
        var tt = "&app=" + app + "&from=" + from + "&to=" + to + "&wxopenid=" + wxopenid;
        switch(to){
            case "login"://登录
                window.location.href = g_const_PageURL.Login + "?t=" + Math.random() + tt;
                break;
            case "register"://注册
                window.location.href = g_const_PageURL.Reg + "?t=" + Math.random() + tt;
                break;
            case "resetPassword"://重置密码
                window.location.href = g_const_PageURL.ResetPassword + "?t=" + Math.random() + tt;
                break;
        }
    },
};
