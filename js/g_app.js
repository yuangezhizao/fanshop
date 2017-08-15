//客户端类型
var ClientType = {
    //微信
    WeiXin: 1,
    //苹果客户端
    JYH_Android: 2,
    //安卓客户端
    JYH_iOS: 3,
    //浏览器
    Other: 4
}


var GetClientType = function () {
    var ua = navigator.userAgent;
    if (ua.match(/MicroMessenger/i) !== null)
        return ClientType.WeiXin;
    else if (ua.match(/hjy-android/i) !== null)
        return ClientType.JYH_Android;
    else if (ua.match(/hjy-ios/i) !== null)
        return ClientType.JYH_iOS;
    else
        return ClientType.Other;
}