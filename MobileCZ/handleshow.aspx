<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="handleshow.aspx.cs" Inherits="com.hjy.fan.WebTouch.MobileCZ.handleshow" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta charset="UTF-8">
    <title>饭好了</title>
    <meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta content="yes" name="apple-mobile-web-app-capable" />
    <meta content="black" name="apple-mobile-web-app-status-bar-style" />
    <meta content="telephone=no" name="format-detection" />
    <meta content="email=no" name="format-detection" />
	<meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="/css/style.css">
    <link rel="stylesheet" href="/css/index.css">

    <script src="/JS/jquery-2.1.4.js"></script>
   
    <link href="/css/sbc.css" rel="stylesheet" />
    <script src="/JS/g_header.js"></script>

    <script src="/JS/functions/g_Const.js"></script>
    <script src="/JS/functions/g_Type.js"></script>
    <script src="/JS/tost.js"></script>
    <script src="/JS/focus.js"></script>

</head>
 <body class="ddbg">
<header><span id="go-back" class="fl jt"></span>充值结果</header>
<div class="nodata2 pay-ok">
	<div class="img">
		<img src="/img/pay-ok.png" alt=""/>
	</div>
	<div class="txt_cen">
		<div>
            <%=ShowResult %>
			<%--<h2>支付成功！！</h2>
			<p>充值订单号：And20150930142000943，</p>
			<p>充值数额10元，</p>
			<p>实际支付9.99元，</p>
			<p>订单支付成功，充值进行中!</p>--%>
		</div>
	</div>
	<a href="/Account/MyMobileCZ_Order_List.html" class="btn">查看我的充值订单</a>
</div>

                     <!--底部-->
            <script src="/js/g_footer.js"></script>
            <script src="/js/pages/handleshow.js"></script>

</body>
</html>
