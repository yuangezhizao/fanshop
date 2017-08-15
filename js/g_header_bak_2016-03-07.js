/// <reference path="jquery-2.1.4.js" />
/// <reference path="functions/g_Const.js" />
/// <reference path="functions/g_Type.js" />

//接口相关参数--开始
/*接口外部地址*/var g_APIUTL = "/JYH/API.aspx";
/*接口外部临时地址*/var g_Temp_APIUTL = "/JYH/API_Temp.aspx";
/*接口内部地址*/var g_INAPIUTL = "/Ajax/API.aspx";
/*接口Method*/var g_APIMethod = "POST";
/*接口响应数据格式*/var g_APIResponseDataType = "json";
//接口相关参数--结束

/*是否是测试*/var IsDebug = false;
if (IsDebug) {
    g_APIUTL = "/JYH/API.aspx";
}

String.prototype.Trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

String.Replace = function (postStr) {
    postStr = postStr.replace(/%/g, "%25");
    postStr = postStr.replace(/\&/g, "%26");
    postStr = postStr.replace(/\+/g, "%2B");
    postStr = postStr.replace(/\//g, "%2f");
    return postStr;
}

String.DelHtmlTag = function (str) {
    return str.replace(/<[^>]+>/g, "");//去掉所有的html标记
}


Date.prototype.Format = function (fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
Date.prototype.AddDays = function (days) {
    var day = 86400000;
    return new Date(this.getTime() + days * day);
}
Date.prototype.AddMinutes = function (minutes) {
    var minute = g_const_minutes;
    return new Date(this.getTime() + minutes * minute);
}
Date.prototype.AddSeconds = function (seconds) {
    var second = g_const_seconds;
    return new Date(this.getTime() + seconds * second);
}
Date.Parse = function (sdatetime) {
    var day = 86400000;
    //"yyyy-MM-dd HH:mm:ss";
    var arrDate = sdatetime.split(/-|:| /ig);   
    var objDate = new Date(parseInt(arrDate[0], 10), parseInt(arrDate[1], 10) - 1, parseInt(arrDate[2], 10), parseInt(arrDate[3], 10), parseInt(arrDate[4], 10), parseInt(arrDate[5], 10));
    return objDate;
}

function ShowMesaage(sMessage) {
    new Toast({ context: $('body'), message: sMessage, top: '50%' }).show();
}
function GetQueryString(name) {
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)', "ig").exec(window.location.href);
    if (results != null)
        return results[1];
    else
        return "";
}
function renderTemplate(template, data) {
    var s = template.replace(g_const_regex_template, function (fullMatch, capture) {
        if (data[capture])
           return data[capture];
        else
           return "";
    });
    return s;
}
function FormatText(s, l) {
    if (s == "") {
        return "&nbsp;";
    } else {
        return s;
    }

    //if (s.Trim().length > l)
    //    return s.substr(0, l) + "...";
    //else
    //    return s;
}
/*根据链接类型转换链接地址,t:‘显示更多’链接类型(g_const_showmoreLinktype),u:目标*/
var g_GetLocationByShowmoreLinktype= function(t,u){
    var _r = Math.random().toString();
    var sreturn = "";
    if (u.Trim().length > 0) {
        switch (t) {
            case g_const_showmoreLinktype.URL:                
                sreturn = u;
                break;
            case g_const_showmoreLinktype.ProductDetail:
                sreturn = "/Product_Detail.html?pid=" + u;
                break;
            case g_const_showmoreLinktype.ProductType:
                sreturn = "/Product_List.html?showtype=category&keyword=" + u;
            case g_const_showmoreLinktype.KeyWordSearch:
                sreturn = "/Product_List.html?keyword=" + encodeURIComponent(u);
                break;
            case g_const_showmoreLinktype.ShowLayer: 
            default:
                return "javascript:void(0);";
        }
    
        if (sreturn.indexOf("?") != -1)
            sreturn += "&_r=" + _r;
        else
            sreturn += "?_r=" + _r;
    }
    else
        sreturn = "javascript:void(0);";
    return sreturn;
}
function g_GetPictrue(picurl) {
    if (picurl == "")
        return g_goods_Pic;
    else
        return picurl;
}
function g_GetBrandPictrue(picurl) {
    if (picurl == "")
        return g_brand_Pic;
    else
        return picurl;
}

function g_GetMemberPictrue(picurl) {
    if (picurl == "")
        return g_member_Pic;
    else
        return picurl;
}
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}

function getFormatDate(dateDstr, formatStr) {
    var str = dateDstr.replace(/-/g, "/");
    return date = new Date(str).Format(formatStr);
}
var PageBack = {
    //传入地址
    SetUrl: function (url) {
        //if (localStorage.getItem(g_const_localStorage.BackURLList) != null) {
        //    g_const_BackUrlList = localStorage.getItem(g_const_localStorage.BackURLList).split(',');
        //}
        ////判断左后一个页面是否和传入的url一致，不同时保存，相同则忽略
        //if (g_const_BackUrlList[g_const_BackUrlList.length - 1] != url) {
        //    g_const_BackUrlList.push(url);
        //    localStorage[g_const_localStorage.BackURLList] = g_const_BackUrlList;
        //}
        //    location = pageurl;
    },
    //传入步骤
    BackTo: function (num) {
        var pageurl = "/index.html";
        //if (localStorage.getItem(g_const_localStorage.BackURLList) != null) {
        //    g_const_BackUrlList = localStorage.getItem(g_const_localStorage.BackURLList).split(',');
        //}
        //if (g_const_BackUrlList.length > 0) {
        //    if (!num) {
        //        num = 1;
        //    }
        //    pageurl = g_const_BackUrlList[g_const_BackUrlList.length - num];
        //    for (var i = 0; i < num; i++) {
        //        g_const_BackUrlList.pop();
        //    }
        //    localStorage[g_const_localStorage.BackURLList] = g_const_BackUrlList.join(",");;
        //}
        //// location = pageurl;
        return pageurl;
    },
    //传入地址
    Clear: function () {
        //g_const_BackUrlList = [];
        //g_const_BackUrlList.push("/index.html");
        //localStorage[g_const_localStorage.BackURLList] = g_const_BackUrlList.join(",");;
    },
};
var PageUrlConfig = {
    //获取跳转地址
    GetSource: function (source, currurl) {
        $.each(g_const_PageUrlConfig, function (i, item) {
            if (item[0] == source && item[1] == currurl) {
                localStorage[g_const_localStorage.PageUrlConfig] = item[0];
            }
        })
        
    },
    //获取返回地址
    GetBack: function (url) {
        // location = pageurl;
        return localStorage[g_const_localStorage.PageUrlConfig];
    },
    //传入地址
    SetUrl: function (url) {
        if (url==null||url=="") {
            url = location.pathname+location.search;
        }
        if (localStorage.getItem(g_const_localStorage.PagePathList) != null && localStorage.getItem(g_const_localStorage.PagePathList).length>0) {
            g_const_PagePathList = localStorage.getItem(g_const_localStorage.PagePathList).split(',');
        }

        if (g_const_PagePathList[g_const_PagePathList.length - 1] != url) {
            g_const_PagePathList.push(url);
            localStorage[g_const_localStorage.PagePathList] = g_const_PagePathList;
        }
    },
    //传入步骤
    //传入步骤
    BackTo: function (num) {
        var pageurl = "/index.html";
        if (localStorage.getItem(g_const_localStorage.PagePathList) != null) {
            g_const_PagePathList = localStorage.getItem(g_const_localStorage.PagePathList).split(',');
        }
        if (g_const_PagePathList.length > 0) {
            if (!num) {
                num = 1;
            }
            pageurl = g_const_PagePathList[g_const_PagePathList.length - num];
            for (var i = 0; i < num; i++) {
                if (!(pageurl == "/index.html" || pageurl == "/")) {
                    g_const_PagePathList.pop();
                }
            }
            localStorage[g_const_localStorage.PagePathList] = g_const_PagePathList.join(",");;
        }
        // location = pageurl;
        return pageurl;
    },
    //传入地址
    Clear: function () {
        g_const_PagePathList = ["/index.html"];
        localStorage[g_const_localStorage.PagePathList] = g_const_PagePathList.join(",");;
        localStorage["selpaytype"] = "";
    },
};
var WxInfo = {
    GetPayID: function (url) {
        var backurl = url + "&showwxpaytitle=1";
        window.location.replace(g_const_PageURL.OauthLogin + "?oauthtype=WeiXin&returnurl=" + encodeURIComponent(backurl) + "&scope=b&ispay=1");
    },
};

//保存跳转支付宝点击数
var SaveClickNum = {
    save: function (url,clienttype,other) {
        var source = url;
        $.ajax({
            type: "POST",//用POST方式传输
            dataType: "text",//数据格式:JSON
            url: '/Ajax/API.aspx',//目标地址
            data: "t=" + Math.random() +
                    "&action=sourceclicknum" +
                    "&source=" + escape(source) +
                    "&clienttype=" + escape(clienttype)+
                    "&other=" + escape(other),
            beforeSend: function () { },//发送数据之前
            complete: function () {  },//接收数据完毕
            success: function (data) {
            }
        });
    },
};
var web_refer = document.referrer;
var web_host = window.location.host;
var web_from = GetQueryString("from");
var web_fromparam = "etc_s=" + GetQueryString("etc_s")
                            + "&etc_k=" +GetQueryString("etc_k")
                            + "&etc_g=" +GetQueryString("etc_g")
                            + "&etc_c=" +GetQueryString("etc_c")
                            + "&etc_d=" + GetQueryString("etc_d");
var web_fromparam_lkt = web_from + "|" + GetQueryString("a_id")
                                 + "|" + GetQueryString("m_id")
                                 + "|" + GetQueryString("c_id")
                                 + "|" + GetQueryString("l_id")
                                 + "|" + GetQueryString("l_type1")
                                 + "|" + decodeURI(GetQueryString("url"));



$(document).ready(function () {
    if (localStorage[g_const_localStorage.OrderFrom]==null) {
        localStorage[g_const_localStorage.OrderFrom] = "";
    }
    if (localStorage[g_const_localStorage.OrderFromParam] == null) {
        localStorage[g_const_localStorage.OrderFromParam] = "";
    }
    //alert(web_fromparam_lkt);
        Merchant1.RecordCheck(Merchant1.RecordPage);
});
//判断终端
var CheckMachine = {
    	versions:function(){ 
    	var u = navigator.userAgent, app = navigator.appVersion; 
    	return {trident: u.indexOf("Trident") > -1, 
    		presto: u.indexOf("Presto") > -1, 
    		webKit: u.indexOf("AppleWebKit") > -1, 
    		gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, 
    		mobile: !!u.match(/AppleWebKit.*Mobile.*/), 
    		ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), 
    		android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1,
    		iPhone: u.indexOf("iPhone") > -1 , 
    		iPad: u.indexOf("iPad") > -1, 
    		webApp: u.indexOf("Safari") == -1 
    		};
	}(),
	language:(navigator.browserLanguage || navigator.language).toLowerCase()
} 
if (CheckMachine.versions.mobile) {
    //alert("WAP");
    if (localStorage["OrderFrom"]) {
        if (localStorage["OrderFrom"] == "adks") {
            var _trc_ = _trc_ || {}, _prm_ = _prm_ || {}; (function () { var e = document.createElement("script"); e.src = "//trac.imarvelous.cn/tracking.js?ebf2f803b2e9f2ba8316112dbafc79bb"; var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(e, s); })();
        }
    }
    else if (GetQueryString("from") == "adks") {
        var _trc_ = _trc_ || {}, _prm_ = _prm_ || {}; (function () { var e = document.createElement("script"); e.src = "//trac.imarvelous.cn/tracking.js?ebf2f803b2e9f2ba8316112dbafc79bb"; var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(e, s); })();
    }  
}
else {
    //alert("PC");
   // var _trc_ = _trc_ || {}, _prm_ = _prm_ || {}; (function () { var e = document.createElement("script"); e.src = "//trac.imarvelous.cn/tracking.js?5f92ad3ebeea31785f10e860ba7bdc04"; var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(e, s); })();
}

var Merchant1 = {
    Code: "adks",
    Host: "wx.lacues.cn",
    RecordCheck: function (callback) {
        $.ajax({
            type: "POST",//用POST方式传输
            dataType: "json",//数据格式:JSON
            url: '/Ajax/API.aspx',//目标地址
            data: "t=" + Math.random() +
                    "&action=merchant_check" +
                    "&host=" + web_host +
                    "&refer=" + web_refer +
                    "&merchantcode=" + web_from,
            beforeSend: function () { },//发送数据之前
            complete: function () { },//接收数据完毕
            success: function (msg) {
                if (msg.resultcode) {
                    if (msg.resultcode == g_const_Success_Code) {
                        if (msg.resultmessage != localStorage[g_const_localStorage.OrderFrom] && msg.resultmessage!="") {
                            localStorage[g_const_localStorage.OrderFrom] = msg.resultmessage;
                            localStorage[g_const_localStorage.OrderFromParam] = "";
                            if (web_from=="adks") {
                                localStorage[g_const_localStorage.OrderFromParam] = web_fromparam;
                            }
                            if (web_from == "linktech") {
                                localStorage[g_const_localStorage.OrderFromParam] = web_fromparam_lkt;
                            }
                            
                            $('.mask,.guide-app').hide();
                        }
                        if (web_from == g_const_Merchant_Group_Android || web_from == g_const_Merchant_Group_Ios) {
                            if ($(".app")) {
                                $(".app").hide();
                            }
                            if ($("#btnBack_cg")) {
                                $("#btnBack_cg").hide();
                            }
                        }
                        
                        if (typeof (callback) == "function")
                            callback(msg);
                    }
                    else {
                        localStorage[g_const_localStorage.OrderFrom] = "";
                        localStorage[g_const_localStorage.OrderFromParam] = "";
                    }
                    try {
                        SetHtmlByDate();
                    } catch (e) {

                    }
                    
                }
            }
        });
    },
    RecordValid: function (callback) {
        $.ajax({
            type: "POST",//用POST方式传输
            dataType: "json",//数据格式:JSON
            url: '/Ajax/API.aspx',//目标地址
            data: "t=" + Math.random() +
                    "&action=merchant_valid",
            beforeSend: function () { },//发送数据之前
            complete: function () { },//接收数据完毕
            success: function (msg) {
                if (msg.resultcode) {
                    if (msg.resultcode != g_const_Success_Code) {
                        localStorage[g_const_localStorage.OrderFrom] = "";
                        localStorage[g_const_localStorage.OrderFromParam] = "";
                    }
                    else {
                        if (typeof (callback) == "function")
                            callback(msg);
                    }
                }
            }
        });
    },
    RecordPage: function () {
        //if (localStorage[g_const_localStorage.OrderFrom] == "") {
        //    localStorage[g_const_localStorage.OrderFrom] = GetQueryString("from");
        //    localStorage[g_const_localStorage.OrderFromParam] = "etc_s=" + GetQueryString("etc_s")
        //                                                        + "&etc_k=" + GetQueryString("etc_k")
        //                                                        + "&etc_g=" + GetQueryString("etc_g")
        //                                                        + "&etc_c=" + GetQueryString("etc_c")
        //                                                        + "&etc_d=" + GetQueryString("etc_d");
            var web_pathname = window.location.pathname;
            if (web_pathname == "/") {
                web_pathname += "index.html";
            }
            var web_search = window.location.search;
            if (web_from == "adks") {
                web_search = web_fromparam;
            }
            else if (web_from == "linktech") {
                web_search = web_fromparam_lkt;
            }
            else {
                web_search = window.location.search;
            }
           // if (window.location.search.indexOf("from") > -1) {
                if (localStorage[g_const_localStorage.OrderFrom] != "") {
                    $.ajax({
                        type: "POST",//用POST方式传输
                        dataType: "json",//数据格式:JSON
                        url: '/Ajax/API.aspx',//目标地址
                        data: "t=" + Math.random() +
                                "&action=merchant_page" +
                                "&merchantcode=" + escape(localStorage[g_const_localStorage.OrderFrom]) +
                                "&paramlist=" + escape(web_search.replace(/&/g, "@").replace(/=/g, "^")) +
                                "&webpage=" + escape(web_host + web_pathname),
                        beforeSend: function () { },//发送数据之前
                        complete: function () { },//接收数据完毕
                        success: function (msg) {
                            if (msg.resultcode) {
                                if (msg.resultcode != g_const_Success_Code) {
                                    localStorage[g_const_localStorage.OrderFrom] = "";
                                }
                            }
                        }
                    });
              //  }
            }
        //}
    },
    RecordReg: function () {
        try {
            if (localStorage[g_const_localStorage.OrderFrom] != "") {
                if (localStorage[g_const_localStorage.OrderFrom] == Merchant1.Code) {
                    //if (CheckMachine.versions.mobile) {
                        _prm_['eventId'] = 478; _trc_.sendCl(this);
                        //  alert(478);
                    //}
                    //else {
                    //    _prm_['eventId'] = 471; _trc_.sendCl(this);
                    //    //    alert(471);
                    //}
                }
            }
        } catch (e) {

        }

    },
    RecordBuy: function () {
        try {
            if (localStorage[g_const_localStorage.OrderFrom] != "") {
                if (localStorage[g_const_localStorage.OrderFrom] == Merchant1.Code) {
                  //  if (CheckMachine.versions.mobile) {
                        _prm_['eventId'] = 479; _trc_.sendCl(this);
                        //   alert(479);
                    //}
                    //else {
                    //    _prm_['eventId'] = 472; _trc_.sendCl(this);
                    //    //    alert(472);
                    //}
                }
            }
        } catch (e) {

        }

    },
    productid: "",
    productname: "",
    productprice: "",
    orderid: "",
    orderprice: "",
    RecordOrder: function (productid, productname, productprice, orderid, orderprice) {
        try {
            if (localStorage[g_const_localStorage.OrderFrom] != "") {
                if (localStorage[g_const_localStorage.OrderFrom] == Merchant1.Code) {
                    //if (CheckMachine.versions.mobile) {
                    //    _prm_['productId'] = productid; _prm_['productName'] = productname; _prm_['productPrice'] = productprice; _prm_['orderId'] = orderid; _prm_['orderPrice'] = orderprice; _trc_.sendCv(this);
                    //    //   alert("o_wap");
                    //}
                    //else {
                    _prm_['productId'] = Merchant1.productid;
                    _prm_['productName'] = Merchant1.productname;
                    _prm_['productPrice'] = Merchant1.productprice;
                    _prm_['orderId'] = Merchant1.orderid;
                    _prm_['orderPrice'] = Merchant1.orderprice;
                    _trc_.sendCv(this);
                    //       alert("o_pc");
                    //  }
                }
            }
        } catch (e) {

        }

    },
    RecordDownLoad: function () {
        try {
            if (localStorage[g_const_localStorage.OrderFrom] != null) {
                if (localStorage[g_const_localStorage.OrderFrom] == Merchant1.Code) {
                    if (CheckMachine.versions.mobile) {
                        _prm_['eventId'] = 481; _trc_.sendCl(this);
                        //   alert(481);
                    }
                    else {

                    }
                }
            }
        } catch (e) {

        }

    },
    RecordContine: function () {
        try {
            if (localStorage[g_const_localStorage.OrderFrom] != null) {
                if (localStorage[g_const_localStorage.OrderFrom] == Merchant1.Code) {
                    if (CheckMachine.versions.mobile) {
                        _prm_['eventId'] = 482; _trc_.sendCl(this);
                        //    alert(482);
                    }
                    else {

                    }
                }
            }
        } catch (e) {

        }

    },
    RecordPageAct: function (code,type) {
        var web_pathname = window.location.pathname;
        $.ajax({
            type: "POST",//用POST方式传输
            dataType: "json",//数据格式:JSON
            url: '/Ajax/API.aspx',//目标地址
            data: "t=" + Math.random() +
                    "&recordact=" +code+
                    "&action=merchant_page" +
                    "&merchantcode=" + escape(code) +
                    "&paramlist=" + 
                    "&webpage=" + escape(web_host + web_pathname + type),
            beforeSend: function () { },//发送数据之前
            complete: function () { },//接收数据完毕
            success: function (msg) {
                if (msg.resultcode) {
                    if (msg.resultcode != g_const_Success_Code) {
                        localStorage[g_const_localStorage.OrderFrom] = "";
                    }
                }
            }
        });
    },
};

var Merchant_LKT = {
    Code: "linktech",
    order_code: "",
    product_code: "",
    product_price: "",
    product_count: "",
    product_cd: "",
    RecordOrder: function () {
        try {
            if (localStorage[g_const_localStorage.OrderFrom] != "") {
                if (localStorage[g_const_localStorage.OrderFrom] == Merchant_LKT.Code) {
                    //var url = "/LKT/CPS_API.aspx?" + "t=" + Math.random() +
                    //            "&action=merchant_order" +
                    //            "&order_code=" + Merchant_LKT.order_code +
                    //            "&product_code=" + Merchant_LKT.product_code +
                    //            "&product_price=" + Merchant_LKT.product_price +
                    //            "&product_count=" + Merchant_LKT.product_count +
                    //            "&product_cd=" + Merchant_LKT.product_cd;
                    //$("#if_lkt").attr("src", url);


                    $.ajax({
                        type: "POST",//用POST方式传输
                        dataType: "text",//数据格式:text
                        url: '/LKT/CPS_API.aspx',//目标地址
                        data: "t=" + Math.random() +
                                "&action=merchant_order" +
                                "&a_id=" + localStorage[g_const_localStorage.OrderFromParam] +
                                "&order_code=" + Merchant_LKT.order_code +
                                "&product_code=" + Merchant_LKT.product_code +
                                "&product_price=" + Merchant_LKT.product_price +
                                "&product_count=" + Merchant_LKT.product_count +
                                "&product_cd=" + Merchant_LKT.product_cd,
                        beforeSend: function () { },//发送数据之前
                        complete: function () { },//接收数据完毕
                        success: function (msg) {
                         //   $("#sclkt").attr("src", msg);
                            //alert(11111);
                        }
                    });
                }
            }
        } catch (e) {

        }

    },
};

var Merchant_MT = {
    Code: "mt",
    mt_umobile: "",
    productcode: "",
    orderno: "",
    moneypay: "",
    express_name: "",
    express_mobile: "",
    express_address: "",
    Paymethod:"",
    ispay: "",
    RecordOrder: function () {
        try {
            if (localStorage[g_const_localStorage.OrderFrom] != "") {
                if (localStorage[g_const_localStorage.OrderFrom] == Merchant_MT.Code) {
                    if (Merchant_MT.Paymethod == "在线支付") {
                        if (IsInWeiXin.check()) {
                            Merchant_MT.Paymethod = "微信支付";
                        }
                        else {
                            Merchant_MT.Paymethod = "支付宝";
                        }
                    }
                   // alert(Merchant_MT.Paymethod);
                    $.ajax({
                        type: "POST",//用POST方式传输
                        dataType: "text",//数据格式:text
                        url: '/MT/CPS_API.aspx',//目标地址
                        data: "t=" + Math.random() +
                                "&action=merchant_order" +
                                "&mt_umobile=" + 
                                "&productcode=" + Merchant_MT.productcode +
                                "&orderno=" + Merchant_MT.orderno +
                                "&moneypay=" + Merchant_MT.moneypay +
                                "&express_name=" + Merchant_MT.express_name +
                                "&express_mobile=" + Merchant_MT.express_mobile +
                                "&express_address=" + Merchant_MT.express_address +
                                "&paymethod=" + Merchant_MT.Paymethod +
                                "&ispay=" + Merchant_MT.ispay,
                        beforeSend: function () { },//发送数据之前
                        complete: function () { },//接收数据完毕
                        success: function (msg) {
                            //   $("#sclkt").attr("src", msg);
                            //alert(11111);
                        }
                    });
                }
            }
        } catch (e) {

        }

    },
};

var Merchant_Group = {
    Back: function () {
        try {
            $.ajax({
                type: "POST",//用POST方式传输
                dataType: "json",//数据格式:JSON
                url: '/Ajax/API.aspx',//目标地址
                data: "t=" + Math.random() +
                        "&action=group_back",
                beforeSend: function () { },//发送数据之前
                complete: function () { },//接收数据完毕
                success: function (msg) {
                    if (msg.resultcode) {
                        if (msg.resultcode == g_const_Success_Code) {
                            if (CheckMachine.versions.android) {
                                // window.location.replace("/index.html");

                                window.notify.notifyOnAndroid("{\"type\":\"close_window\",\"obj\":{\"pid\":\"\"}}");
                            }
                            else if (CheckMachine.versions.ios || CheckMachine.versions.iPhone || CheckMachine.versions.iPad) {
                                window.location.href = "/group.html?closeGoodsView";
                            }
                        }
                        else {
                            window.location.replace(PageUrlConfig.BackTo());
                        }
                    }
                },
                fail:function (jqXHR, textStatus) {
                    var aa = jqXHR;
                }
            });
        } catch (ex) {
            var aa = ex.toString();
        }

    },
};