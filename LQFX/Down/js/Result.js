$(document).ready(function () {
    if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
        $("#btn_ap").show();
    }
    else if (/android/i.test(navigator.userAgent)) {
        $("#btn_an").show();
    }
    else {
        $("#btn_ap").show();
        $("#btn_an").show();
    }
    $("#btn_an").click(function () {
        DownLoad();
    });
    $("#btn_ap").click(function () {
        DownLoad();
    });
});
function DownLoad() {
    var ua = navigator.userAgent.toLowerCase();

    var leixing = "web";
    if (ua.indexOf("micromessenger") > 0 || ua.match(/micromessenger/i) == "micromessenger") {
        //微信
        leixing = "weixin";
    }
    else if (ua.indexOf("weibo") > 0 || ua.match(/micromessenger/i) == "weibo") {
        //微博
        leixing = "weibo";
    }
    else if (ua.indexOf("qq") > 0 || ua.indexOf("QQ") > 0) {
        //QQ
        leixing = "qq";
    }

    //增加收集跳转应用宝点击数  开始
    var ILData_group = "||";
    try {
        //搜狐接口获得客户端IP 
        var ILData_group = returnCitySN["cid"] + "|" + returnCitySN["cip"] + "|" + returnCitySN["cname"] //城市ID+“|”+IP+“|”+所在地名称;
    } catch (e) { }
    ILData_group = ILData_group + "|" + leixing;

    try {
        var source = window.location.href;
        var clienttype = "web";
        var ua = navigator.userAgent.toLowerCase();

        if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {
            clienttype = "ios";
        }
        else if (browser.versions.android) {
            clienttype = "android";
        }
        SaveClickNum.save(source, clienttype, ILData_group);
    } catch (e) { }
    //增加收集跳转应用宝点击数  结束

    
    //应用宝地址
    var app_Page = "http://a.app.qq.com/o/simple.jsp?pkgname=com.jiayou.qianheshengyun.app&g_f=991850";
    //AppStore
    var app_Store = "https://itunes.apple.com/cn/app/jia-you-gou-wu/id641952456?mt=8";
    //安卓应用包
    var apk_Down = "http://www.ichsy.com/apps/Hui_Jia_You_ichsy.apk";
    if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
        if (ua.indexOf("MicroMessenger") > 0 || ua.match(/MicroMessenger/i) == "micromessenger") {
            //微信
            window.location.replace(app_Store);
        }
        else if (ua.indexOf("qq") > 0 || ua.indexOf("QQ") > 0) {
            //QQ
            window.location.replace(app_Store);
        }
        else if (ua.indexOf("Weibo") > 0 || ua.match(/MicroMessenger/i) == "weibo") {
            //微博
            window.location.replace(app_Store);
        } else {
            //浏览器
            window.location.replace(app_Store);
        }
    }
    else if (/android/i.test(navigator.userAgent)) {
        if (ua.indexOf("MicroMessenger") > 0 || ua.match(/MicroMessenger/i) == "micromessenger") {
            //微信
            window.location.replace(app_Page);
        }
        else if (ua.indexOf("qq") > 0 || ua.indexOf("QQ") > 0) {
            //QQ
            window.location.replace(apk_Down);
        }
        else if (ua.indexOf("Weibo") > 0 || ua.match(/MicroMessenger/i) == "weibo") {
            //微博
            window.location.replace(app_Page);
        } else {
            //浏览器
            window.location.replace(apk_Down);
        }
    }
    else {
        window.location.replace(app_Page);

    }
}