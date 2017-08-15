
var page_yaotv = {
    Init: function () {
        $("body").css("background-color", "black");
        page_yaotv.LoadHeader();
        page_yaotv.LoadContainer();
        page_yaotv.LoadFooter();
        page_yaotv.fontSize();
        page_yaotv.SetWX();
        page_yaotv.LoadData();
        
        window.onresize = page_yaotv.fontSize;
    },
    LoadData: function () {       
        var senddata = {
            url: page_yaotv.ApiURL(),
            async: false,
            cache: false,
            method: "get",
            data: { apitype: "getwxcardtype", httpprotocol: window.location.protocol },
            dataType: "jsonp",
            jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
            jsonpCallback: "getcardtype",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
        };
        var request = $.ajax(senddata);

        request.done(function (msg) {
            page_yaotv.GetAwardLevel = msg.awardlevel;
            page_yaotv.SetBackGroud(msg.card.card_img);
            
            $('.coup').on("click", function () {
                var sdomain = page_yaotv.GetRedirectDomian();
                window.location.replace(sdomain + "/yaotv/youhuiquan.html?AwardLevel=" + page_yaotv.GetAwardLevel.toString());
            });
        });
        request.fail(function (jqXHR, textStatus) {
            //上线时换成正确的图形
            var err_imgurl = page_yaotv.GetPDomain() + "yaotv/img/wza_img/yaoyiyao3.png";            
            page_yaotv.SetBackGroud(err_imgurl);
        });
        
    },
    GetPDomain: function () {
        if (window.location.hostname.indexOf("qq.com")==-1)
            return "/";
        var p = window.location.protocol;
        if (p == "http:") {
            return "http://s.jyh.com/";
        }
        else {
            return "https://mm.ichsy.com/";
        }
    },
    //设定优惠券图形
    SetBackGroud: function (imgurl) {
        imgurl = "url(\""+imgurl+"\")";
        $(".coup").css("background-image", imgurl);
    },
    SetWX: function () {
        shaketv.subscribe({
            appid: "wx7c73f526ee2324e8",
            selector: "#div_subscribe_area",
            type: 1
        }, function (returnData) {
            //一键关注bar消失后会调用回调函数，在此处理bar消失后带来的样式问题
            if (returnData.errorCode == "-1002") {
                //alert(JSON.stringify(returnData));
                //$("#div_subscribe_area").css("display", "none");
            }
            console.log(JSON.stringify(returnData));
            //alert(JSON.stringify(returnData));
        });
    },
    fontSize: function () {
        document.documentElement.style.fontSize = 10 * (document.documentElement.clientWidth / 320) + 'px';
    },
    LoadHeader: function () {
        //$('#header').html('');       
    },
    LoadContainer: function () {
        $('#container').html('<div class="coup">		<div class="pojoWrap">			<a href="javascript:;" class="pojo"></a>		</div>		<div class="receive"></div>		<p></p>		<div><a href="javascript:;" class="close"></a></div>	</div>');

    },
    LoadFooter: function () {
        $('#footer').html('<div class="from">本页面内容由家有购物 & 提供</div><div class="bottom"><div id="div_subscribe_area" class="div_subscribe_area_class"></div></div>');
    },
    ApiURL: function () {
        var url = "Ajax/JsonP_Api.aspx";
        return page_yaotv.GetPDomain() + url;
    },
    
    //获取奖等
    GetAwardLevel: -1,
    //获取从minnum到maxnum的随机整数
    GetRandomNum: function (minnum, maxnum) {
        return parseInt(Math.random() * maxnum + minnum).toString();
    },
    //获取要转向的域名
    GetRedirectDomian: function () {
        var shost = window.location.host.toLowerCase();
        if (shost.indexOf("qq.com") != -1) {
            return "http://s.jyh.com";
        }
        else
        {
            return window.location.protocol +"//"+shost;
        }
    }

};