<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PayPage.aspx.cs" Inherits="com.hjy.fan.WebTouch.Pay.WeiXin.PayPage" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>饭好了</title>
    <script src="../../js/pages/weixin/paypage.js"></script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    </div>
    </form>
    <script>
        function jsApiCall()
        {
            alert(<%=wxJsApiParam%>)
            WeixinJSBridge.invoke(
            'getBrandWCPayRequest',
            <%=wxJsApiParam%>,//josn串
             function (res)
             {
                 WeixinJSBridge.log(res.err_msg);
                 alert(res.err_code + res.err_desc + res.err_msg);
             }
             );
        }

    </script>
    <input type="button" value="支付" onclick="callpay();" />
</body>
</html>
