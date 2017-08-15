<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="handleshow_new.aspx.cs" Inherits="com.hjy.fan.WebTouch.PayResult.handleshow_new" %>


<html lang="en">
<head>
    <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta content="yes" name="apple-mobile-web-app-capable" />
    <meta content="black" name="apple-mobile-web-app-status-bar-style" />
    <meta content="telephone=no" name="format-detection" />
    <meta content="email=no" name="format-detection" />
    <meta charset="UTF-8">
    <title>饭好了</title>
    <script src="/js/cdn.js"></script>
    <%--<link href="/css/style.css" rel="stylesheet">
    <link href="/css/d_style.css" rel="stylesheet">
    <script src="/js/jquery-2.1.4.js"></script>
    <script src="/js/g_header.js"></script>
    <script src="/js/functions/g_Const.js"></script>
    <script src="/js/tost.js"></script>
    <script src="/JS/functions/g_Type.js"></script>--%>
   

    <script src="/JS/cdn.js"></script>
    <script type="text/javascript">
        var staticlist = [["/css/base.css","/css/d_style.css", "/css/style.css"], ["/JS/jquery-2.1.4-min.js", "/JS/g_header.js", "/JS/functions/g_Const.js", "/JS/functions/g_Type.js", "/JS/g_index.js", "/JS/pages/handleshow.js","/js/tost.js"]];
        WriteStatic(staticlist);
    </script>
    <style>
        #mask {
            display: block;
        }
    </style>
</head>
<body class="bgcfff">
    <input type="hidden" id="hid_orderno" value="" runat="server" />
    <header module="202065"><span class="fl jt" id="go-back">向左</span>支付失败</header>
    <div class="d_pay_fail" module="202065">

        <div class="d_pay_fail_img">
            <img src="/img/bg-nodata.png" alt="" />
        </div>
        <p class="d_pay_fail_p"><span id="spendtime"></span>支付未成功哦~</p>
        <div class="d_div_pay">
            <p>订单编号：<span id="orderNoId"><%=OrderNo %></span></p>
        </div>
        <a class="d_change_pay" onclick="OrderFail.GoDetail('<%=OrderNo %>')">查看我的订单</a>
        <a class="d_change_pay" onclick="OrderFail.GoIndex();">去首页</a>
    </div>
</body>
</html>

