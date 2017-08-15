<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WyOauth.aspx.cs" Inherits="com.ichsy.jyh.WebTouch.Account.WyOauth" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <link rel="stylesheet" href="/Act151102/css/base.css" />
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
.open{ position:fixed; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display: none; }
.open .close{ color:#FFF; font-size:1.5rem;  position:absolute; top:1.5rem; right:2rem;}
.open .success{ width:23.25rem; height:20.2rem; background:url(/Act151102/img/yes.png)no-repeat; background-size:100%;  margin:0 auto; margin-top: 14%;}
.open .converted{ width:23.25rem; height:20.2rem; background:url(/Act151102/img/converted.png)no-repeat; background-size:100%;  margin:0 auto; margin-top: 14%;}
.open .failed{ width:23.25rem; height:24.2rem; background:url(/Act151102/img/no.png)no-repeat; background-size:100%;  margin:0 auto; margin-top: 14%;}
.open .re{ width:23.25rem; height:4.25rem; background:url(/Act151102/img/pic2.png)no-repeat; background-size:100%;  margin:0 auto; margin-top: 18%;}
.open .toOpen a{display:block; width:100%; height:3.95rem; background:url(/Act151102/img/open.png)no-repeat; background-size:100%; }
.open .toOpen{ width:85%; margin:0 auto; margin-top: 3%;}
    </style>
    <script src="/js/jquery-2.1.4.js"></script>
    <script src="/js/g_header.js"></script>
    <script src="/js/functions/g_Const.js"></script>
    <script src="/JS/functions/g_Type.js"></script>
    <script type="text/javascript" src="/js/shareGoodsDetail.js"></script>
    
</head>
<body>
    <form id="form1" runat="server">
    <div class="open" id="open">
            <div id="btnclose" class="close">关闭</div>
            <div id="div_success" class="success"></div>
            <div id="div_failed" class="failed"></div>
            <div id="div_converted" class="converted"></div>
            <div class="re"></div>
            <div id="btnopen" class="toOpen"><a href="javascript:;"></a></div>

        </div>
        <input runat="server" id="hidcardid" type="hidden" />
        <input runat="server" id="hidcardmoney" type="hidden" />
        <input runat="server" id="hidexchangedcode" type="hidden" />
    </form>
    <script>
        $(document).ready(function () {

            $("#btnclose").on('click', function () {
                window.location.replace(g_const_PageURL.Index + "?exchange=1&from=wy");
            });
            $("#btnopen").on('click', function () {
                Merchant1.RecordPageAct("wy", "_openapp");
                openApp();
            });
        });
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
                CouponCodeExchange.api_input.couponCode = Base64.base64encode(Base64.utf16to8("微摇"));

                var s_api_input = JSON.stringify(this.api_input);
                var obj_data = { "api_input": s_api_input, "api_target": CouponCodeExchange.api_target, "api_token": g_const_api_token.Wanted };
                var purl = g_APIUTL;
                var request = $.ajax({
                    url: purl,
                    cache: false,
                    method: g_APIMethod,
                    data: obj_data,
                    dataType: g_APIResponseDataType
                });
                //正常返回
                request.done(function (msg) {
                    if (msg.resultCode == g_const_Success_Code) {
                        CouponCodeExchange.Load_Result(1);
                    }
                    else if (msg.resultCode == "939301311") {//已兑换过
                        CouponCodeExchange.Load_Result(2);
                    }
                    else {
                        CouponCodeExchange.Load_Result(0);
                        //flag.innerHTML = msg.resultMessage;
                        //flag.style.display = 'block';
                        //ShowMesaage(msg.resultMessage);
                        //CouponCodeExchange.Load_Result();
                    }
                });
                //接口异常
                request.fail(function (jqXHR, textStatus) {
                    //flag.innerHTML = g_const_API_Message["7001"];
                    //flag.style.display = 'block';
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
                    data: "t=" + Math.random() + "&action=exchangecoupon_wyapi&cardid=" + $("#hidcardid").val() + "&result=" + type + "&code=" + CouponCodeExchange.ExchangeCode,
                    dataType: g_APIResponseDataType
                });

                request.done(function (msg) {
                    setTimeout("window.location.replace(\"" + g_const_PageURL.Index + "?exchange=1&from=wy\");", 5000);
                });

                request.fail(function (jqXHR, textStatus) {
                    setTimeout("window.location.replace(\"" + g_const_PageURL.Index + "?exchange=1&from=wy\");", 5000);
                });
            },
        };
        CouponCodeExchange.GetList();
</script>   
</body>
</html>
