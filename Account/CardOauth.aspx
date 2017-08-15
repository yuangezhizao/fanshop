<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="CardOauth.aspx.cs" Inherits="com.hjy.fan.WebTouch.Account.CardOauth" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <link rel="stylesheet" href="/Act151118/css/base.css" />
    <style>
*{padding: 0px; margin: 0px;}
html{ font-size: 10px;}
.werification{ position:fixed; left:0; top:0; width:100%;  }
.werification header{ height:6.65rem; }
.werification header a{ height:4rem; width:4rem; margin-top: 1.325rem; margin-left:0.75rem; float:left;}
.werification .con{float:left; margin-left: 0.9rem;}
.werification .c{ font-size:1.6rem; }
.werification .cen{font-size:1rem; margin:0 0.7rem 0 0.8rem; line-height:7rem;}

.weri li{ height:4.65rem; border:0.1rem solid #e5e5e5; position: relative;}
.w_send input{ margin-left:1rem; height:4.65rem; width:50%; line-height:4.65rem; font-size:1.3rem; outline:none; border:none; color:#968c88;}
.w_send a{  position: absolute; right:1rem; top:0.575rem; width:9.5rem; height:3.5rem; background:#dc0f50; border-radius:0.4rem;text-align:center; line-height:3.5rem; color:#FFF; font-size:1.1rem; }
.weri .in{ margin-left:1rem; width:100%; line-height:4.65rem; font-size:1.3rem; outline:none; border:none; color:#968c88;}
.atOnce{ display:block; width:93%; height:3.75rem; margin:0 auto; margin-top:7.4rem; background:#dc0f50; border-radius:0.4rem; font-size:1.4rem; color:#FFF; text-align:center; line-height:3.75rem;}
/*成功*/
.open{ position:fixed; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.7);display: none; }
.open .close{ color:#FFF; font-size:1.5rem;  position:absolute; top:1.5rem; right:2rem;}

.open .success{ width:23.25rem; height:20.2rem; background:url(/Act151118/img/yes.png)no-repeat; background-size:100%;  margin:0 auto; margin-top: 14%;}
.open .converted{ width:23.25rem; height:20.2rem; background:url(/Act151118/img/converted.png)no-repeat; background-size:100%;  margin:0 auto; margin-top: 14%; }
.open .failed{ width:23.25rem; height:24.2rem; background:url(/Act151118/img/no.png)no-repeat; background-size:100%;  margin:0 auto; margin-top: 14%; }

/*增加商户类型*/
.open .re_jygw{ width:23.25rem; height:4.25rem; background:url(/Act151118/img/pic2.png)no-repeat; background-size:100%;  margin:0 auto; margin-top: 18%;}
.open .re_xzq{ width:23.25rem; height:4.25rem; background:url(/Act151118/img/pic3.png)no-repeat; background-size:100%;  margin:0 auto; margin-top: 18%;}
.open .re_xzqsd{ width:23.25rem; height:4.25rem; background:url(/Act151118/img/pic3.png)no-repeat; background-size:100%;  margin:0 auto; margin-top: 18%;}
.open .re_xzqjs{ width:23.25rem; height:4.25rem; background:url(/Act151118/img/pic3.png)no-repeat; background-size:100%;  margin:0 auto; margin-top: 18%;}
.open .re_anmyzw{ width:23.25rem; height:4.25rem; background:url(/Act151118/img/pic4.png)no-repeat; background-size:100%;  margin:0 auto; margin-top: 18%;}
.open .re_ahmyz{ width:23.25rem; height:4.25rem; background:url(/Act151118/img/pic4.png)no-repeat; background-size:100%;  margin:0 auto; margin-top: 18%;}
.open .re_wy{ width:23.25rem; height:4.25rem; background:url(/Act151118/img/pic6.png)no-repeat; background-size:100%;  margin:0 auto; margin-top: 18%;}
.open .re_wyt8{ width:23.25rem; height:4.25rem; background:url(/Act151118/img/pic6.png)no-repeat; background-size:100%;  margin:0 auto; margin-top: 18%;}
.open .re_wyapp{ width:23.25rem; height:4.25rem; background:url(/Act151118/img/pic5.png)no-repeat; background-size:100%;  margin:0 auto; margin-top: 18%;}
.open .re_wyt8app{ width:23.25rem; height:4.25rem; background:url(/Act151118/img/pic5.png)no-repeat; background-size:100%;  margin:0 auto; margin-top: 18%;}
.open .re_failed{ width:23.25rem; height:4.25rem; background:url(/Act151118/img/re_fail.png)no-repeat; background-size:100%;  margin:0 auto; margin-top: 18%;}

.open .a_open_jygw{display:block; width:100%; height:3.95rem; background:url(/Act151118/img/open.png)no-repeat; background-size:100%; }
.open .a_open_xzq{display:block; width:100%; height:3.95rem; background:url(/Act151118/img/open.png)no-repeat; background-size:100%; }
.open .a_open_xzqsd{display:block; width:100%; height:3.95rem; background:url(/Act151118/img/open.png)no-repeat; background-size:100%; }
.open .a_open_xzqjs{display:block; width:100%; height:3.95rem; background:url(/Act151118/img/open.png)no-repeat; background-size:100%; }
.open .a_open_anmyzw{display:block; width:100%; height:3.95rem; background:url(/Act151118/img/open.png)no-repeat; background-size:100%; }
.open .a_open_ahmyz{display:block; width:100%; height:3.95rem; background:url(/Act151118/img/open.png)no-repeat; background-size:100%; }
.open .a_open_wy{display:block; width:100%; height:3.95rem; background:url(/Act151118/img/open_2.png)no-repeat; background-size:100%; }
.open .a_open_wyt8{display:block; width:100%; height:3.95rem; background:url(/Act151118/img/open_2.png)no-repeat; background-size:100%; }
.open .a_open_wyapp{display:block; width:100%; height:3.95rem; background:url(/Act151118/img/open_1.png)no-repeat; background-size:100%; }
.open .a_open_wyt8app{display:block; width:100%; height:3.95rem; background:url(/Act151118/img/open_1.png)no-repeat; background-size:100%; }
.open .toOpen{ width:85%; margin:0 auto; margin-top: 3%;}
/*验证码失败提示框*/
    </style>
    <style>
        #mask {display: block;}
        /*加载页面*/
        .wrap-wait{position: absolute;top:33%;left:50%;margin-left:-50px;z-index:10;}
        .wrap-wait .img { width: 100px; height: 100px; margin: 32% auto 0; }
        .wrap-wait .img img { width: 100%; height: auto; }
        .wrap-wait p { width: 100%; font-size: 12px; line-height: 18px; text-align: center; padding: 10px 0 0; color: #222; display: block; }
    </style>
    <script src="../act151118/js/act.js"></script>
    <script>document.write('<scri' + 'pt type="text/javascript" src="' + merchant_act_js + '"></scr' + 'ipt>');</script>
        <script src="/js/cdn.js"></script>
    <script type="text/javascript">
        var staticlist = [[], ["/js/jquery-2.1.4-min.js", "/js/g_header.js", "/js/functions/g_Const.js", "/JS/functions/g_Type.js", "/js/shareGoodsDetail.js"]];
        WriteStatic(staticlist);
    </script>
</head>
<body>
    <form id="form1" runat="server">
        <div id="divAlert"></div>
    <div class="open" id="open">
            <div id="btnclose" class="close">关闭</div>
            <div id="div_success" class="success"></div>
            <div id="div_failed" class="failed"></div>
            <div id="div_converted" class="converted"></div>
            <div id="div_re" ></div>
            <div id="btnopen" class="toOpen"><a id="a_open" href="javascript:;"></a></div>

        </div>
        <input runat="server" id="hidcardid" type="hidden" />
        <input runat="server" id="hidcardkey" type="hidden" />
        <input runat="server" id="hidexchangedcode" type="hidden" />
        <input runat="server" id="hidmerchant" type="hidden" />
    </form>
    <script>
        var url_web = "/index.html";
      //  var param = "";
        $(document).ready(function () {
            //Merchant.ActGet();
            //$.each(act_Exchange_URL, function (i, n) {
            //    if ($("#hidmerchant").val() == n[0]) {
            //        url_web = n[4];
            //        param = n[2];
            //        return false;
            //    }
            //});
            //$("#div_success").attr("class", "success_" + $("#hidmerchant").val());
            //$("#div_failed").attr("class", "failed_" + $("#hidmerchant").val());
            //$("#div_converted").attr("class", "converted_" + $("#hidmerchant").val());
            //$("#div_re").attr("class", "re_" + $("#hidmerchant").val());
            //$("#a_open").attr("class", "a_open_" + $("#hidmerchant").val());
            Message.ShowLoading("优惠券兑换中", "divAlert");
            $("#btnclose").on('click', function () {
                window.location.replace(url_web);
            });
            $("#btnopen").on('click', function () {
                openApp();
            });
            localStorage[g_const_localStorage.Card_Key] = $("#hidcardkey").val();

            var DateNow = new Date().getTime();
            var DateStart = new Date().getTime();
            var DateEnd = new Date().getTime();
            window.location.search;
            localStorage["actlist"] = "";
            $.each(actlist.ResultTable, function (i, n) {
                if ($("#hidmerchant").val() == n.merchantcode && (n.cardflag.indexOf($("#hidcardkey").val()) > -1 || n.cardflag.length == 0)) {
                    DateStart = new Date(n.starttime.replace(/-/g, "/"));
                    DateEnd = new Date(n.endtime.replace(/-/g, "/"));
                    if (DateNow > DateStart && DateNow < DateEnd) {
                        localStorage["actlist"] = JSON.stringify(n);
                        if (n.actpage != "") {
                            location.replace(n.actpage + "?from=" + n.merchantcode + "&cardkey=" + $("#hidcardkey").val() + "&cardid=" + $("#hidcardid").val() + "&iscard=1");
                        }
                        return false;
                    }

                }
            });

            //$.each(actlist.ResultTable, function (i, n) {
            //    if ($("#hidmerchant").val() == n.merchantcode && (n.cardflag.indexOf($("#hidcardkey").val()) > -1 || n.cardflag.length==0)) {
            //        if (n.linkurl.indexOf('?') > -1) {
            //            url_web = n.linkurl + "&from=" + $("#hidmerchant").val() + "&t=" + Math.random();
            //        }
            //        else {
            //            url_web = n.linkurl + "?from=" + $("#hidmerchant").val() + "&t=" + Math.random();
            //        }
            //        //   param = n[2];
            //        smstype = n.smstype;
            //        $("#div_re").attr("style", "width:23.25rem; height:4.25rem;background:url(" + g_merchant_Act_Host + n.img_re + ")no-repeat; background-size:100%;  margin:0 auto; margin-top: 18%;");
            //        $("#a_open").attr("style", "display:block; width:100%; height:3.95rem;background:url(" + g_merchant_Act_Host + n.img_open + ")no-repeat; background-size:100%;");
            //        CouponCodeExchange.GetList();
            //        return false;
            //    }
            //});
        });

        var Merchant = {
            ActData: [],
            ActGet: function () {
                var mc = $("#hidmerchant").val();
                var pc = "hjy_shop";
                if (mc != "") {
                    $.ajax({
                        type: "POST",//用POST方式传输
                        dataType: "JSON",//数据格式:JSON
                        url: '/Ajax/API.aspx',//目标地址
                        data: "t=" + Math.random() +
                                "&action=merchant_act" +
                                "&merchantcode=" + 
                                "&paramlist=" +
                                "&mc=" + mc +
                                "&pc=hjy_shop",
                        beforeSend: function () { },//发送数据之前
                        complete: function () { },//接收数据完毕
                        success: function (data) {
                            if (data.resultCode) {
                                if (data.resultCode == "1") {
                                    ActData = JSON.parse(data.resultMessage);
                                    //url_wx = n[1];
                                    if (ActData.ResultTable[0].linkurl.indexOf('?') > -1) {
                                        url_web = ActData.ResultTable[0].linkurl + "&from=" + $("#hidmerchant").val() + "&t=" + Math.random();
                                    }
                                    else {
                                        url_web = ActData.ResultTable[0].linkurl + "?from=" + $("#hidmerchant").val() + "&t=" + Math.random();
                                    }
                                    $("#div_re").attr("style", "width:23.25rem; height:4.25rem;background:url(" + g_merchant_Act_Host + Merchant.ActData.ResultTable[0].img_re + ")no-repeat; background-size:100%;  margin:0 auto; margin-top: 18%;");
                                    $("#a_open").attr("style", "display:block; width:100%; height:3.95rem;background:url(" + g_merchant_Act_Host + Merchant.ActData.ResultTable[0].img_open + ")no-repeat; background-size:100%;");
                                    //   param = n[2];
                                    // smstype = ActData.ResultTable[0].smstype;
                                    CouponCodeExchange.GetList();
                                }
                            }

                        }
                    });
                }
                else {
                }
            },
        };

        function fontSize() {
            document.documentElement.style.fontSize = 10 * (document.documentElement.clientWidth / 320) + 'px';
        }
        fontSize();
        //优惠码兑换
        var CouponCodeExchange = {
            api_target: "com_cmall_familyhas_api_ApiForCouponCodeExchange",
            api_input: { "version": 1, "couponCode": "" },
            ExchangeCode: "",
            GetList: function () {
                var s_api_input = "";
                var obj_data = [];
                $.each(actlist.ResultTable, function (k, o) {
                    if ($("#hidmerchant").val() == o.merchantcode && (o.cardflag.indexOf($("#hidcardkey").val()) > -1 || o.cardflag.length == 0)) {
                        if (o.apitype == "1") {
                            //口令兑换
                            CouponCodeExchange.api_target = "com_cmall_familyhas_api_ApiForCouponCodeExchange";
                            CouponCodeExchange.api_input = { "version": 1, "couponCode": "" };
                            $.each(o.couponcode.split(','), function (i, n) {
                                if (o.exchangetimes == "1") {
                                    if ($("#hidexchangedcode").val().indexOf(n) == -1) {
                                        CouponCodeExchange.api_input.couponCode = Base64.base64encode(Base64.utf16to8(n));
                                        CouponCodeExchange.ExchangeCode = n;
                                        return false;
                                    }
                                }
                                else {
                                    CouponCodeExchange.api_input.couponCode = Base64.base64encode(Base64.utf16to8(n));
                                    CouponCodeExchange.ExchangeCode = n;
                                    return false;
                                }
                            });


                        }
                        else {
                            //活动兑换
                            CouponCodeExchange.api_target = "com_cmall_familyhas_api_ApiForActivityCoupon";
                            CouponCodeExchange.api_input = { "version": 1, "activityCode": "", "mobile": "", "validateFlag": "" };
                            CouponCodeExchange.api_input.activityCode = o.couponcode;
                            CouponCodeExchange.api_input.mobile = Register.PhoneNo;
                            if (o.exchangetimes == "1") {
                                CouponCodeExchange.api_input.validateFlag = "2";
                            }
                            else {
                                CouponCodeExchange.api_input.validateFlag = "1";
                            }

                        }
                    }
                });
                var obj_data = { "api_input": JSON.stringify(CouponCodeExchange.api_input), "api_target": CouponCodeExchange.api_target, "api_token": g_const_api_token.Wanted };
                var purl = g_APIUTL;
                var request = $.ajax({
                    url: purl,
                    cache: false,
                    method: g_APIMethod,
                    data: obj_data,
                    dataType: g_APIResponseDataType
                });
                request.done(function (msg) {
                    if (msg.resultCode == g_const_Success_Code) {
                        CouponCodeExchange.Load_Result(1);
                    }
                    else if (msg.resultCode == "939301311" || msg.resultCode == "939301303") {//已兑换过
                        CouponCodeExchange.Load_Result(2);
                    }
                    else {
                        CouponCodeExchange.Load_Result(0);
                    }
                });
                //接口异常
                request.fail(function (jqXHR, textStatus) {
                    ShowMesaage(g_const_API_Message["7001"]);
                });
            },
            //接口返回成功后的处理
            Load_Result: function (type) {
                document.getElementById('div_failed').style.display = 'none';
                document.getElementById('div_success').style.display = 'none';
                document.getElementById('div_converted').style.display = 'none';
                switch (type) {
                    case 1:
                        document.getElementById('div_success').style.display = 'block';
                        break;
                    case 2:
                        document.getElementById('div_converted').style.display = 'block';
                        break;
                    case 0:
                        $("#div_re").attr("class", "re_failed");
                        document.getElementById('div_failed').style.display = 'block';
                        break;
                }
                document.getElementById('open').style.display = 'block';
                //通知接口兑换结果
                CouponCodeExchange.NoticeAPI(type);

            },
            //接口返回失败后的处理
            NoticeAPI: function (type) {
                var purl = g_INAPIUTL;
                var request = $.ajax({
                    url: purl,
                    cache: false,
                    method: g_APIMethod,
                    data: "t=" + Math.random() + "&action=exchangecoupon_wxapi&cardid=" + $("#hidcardid").val() + "&result=" + type + "&code=" + CouponCodeExchange.ExchangeCode,
                    dataType: g_APIResponseDataType
                });

                request.done(function (msg) {
                    setTimeout("window.location.replace(\"" + url_web + "\");", 5000);
                });

                request.fail(function (jqXHR, textStatus) {
                    setTimeout("window.location.replace(\"" + url_web + "\");", 5000);
                });
            },
        };
        
</script>   
</body>
</html>