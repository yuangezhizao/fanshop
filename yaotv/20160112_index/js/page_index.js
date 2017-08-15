/// <reference path="jquery.js" />
/// <reference path="https://wximg.gtimg.com/shake_tv/include/js/jsapi.js" />
var page_index = {
    Init: function () {
        page_index.protocolSeting();
        page_index.SetWX();        

        $(".down").on("click", function () {
            window.location.replace("http://a.app.qq.com/o/simple.jsp?pkgname=com.jiayou.qianheshengyun.app&g_f=991850");
        });
        $(".enter").on("click", function () {
            page_index.GetTVLiveProduct();
        });
        
    },
    protocolSeting: function () {
        if (window.location.protocol == "http:") {
            $("#mainimg").attr("src", "http://s.jyh.com/yaotv/20160112_index/img/wza_img/biggim6.png");
            page_index.ApiURL = "http://s.jyh.com/Ajax/JsonP_Api.aspx";
        }
        else {
            $("#mainimg").attr("src", "https://mm.ichsy.com/yaotv/20160112_index/img/wza_img/biggim6.png");
            page_index.ApiURL = "https://mm.ichsy.com/Ajax/JsonP_Api.aspx";
        }
    },
    ApiURL:"",
    SetWX: function () {
        shaketv.subscribe({
            appid: "wx7c73f526ee2324e8",
            selector: "#footer_subscribe_area",
            type: 2
        }, function (returnData) {
            //一键关注bar消失后会调用回调函数，在此处理bar消失后带来的样式问题
            if (returnData.errorCode == "-1002") {
                
            }
            console.log(JSON.stringify(returnData));            
        });
    },
    GetTVLiveProduct: function () {
        var request = $.ajax({
            url: page_index.ApiURL,
            async: false,
            cache: false,
            method: "get",
            data: { apitype: "yaotvproductid" },
            dataType: "jsonp",
            jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
            jsonpCallback: "productCallback",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
        });
        request.done(function (msg) {
            //console.log(JSON.stringify(msg));
            try{
                var productCode = msg.productCode;
                var surl = "http://s.jyh.com/Product_Detail.html?pid=" + productCode + "&from_smg=1&from=jygw&t=" + Math.random().toString();               
                window.location.replace(surl);  
            }
            catch (e) {               
                page_index.OnError();                
            }
        });
        request.fail(function (jqXHR, textStatus) {          
            page_index.OnError();            
        });
    },
    OnError: function () {
        window.location.replace("http://s.jyh.com/tvlive.html");
    }
}