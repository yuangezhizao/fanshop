<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="group.aspx.cs" Inherits="com.hjy.fan.WebTouch.group" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
    <script src="/js/cdn.js"></script>
    <script type="text/javascript">
        var staticlist = [[], ["/js/jquery-2.1.4-min.js", "/js/functions/g_Const.js", "/js/g_header.js"]];
        WriteStatic(staticlist);
    </script>
     <script>

         var act = GetQueryString("act");
         var from = GetQueryString("from");
         if (GetQueryString("from") == g_const_Merchant_Group_Android || GetQueryString("from") == g_const_Merchant_Group_Ios || GetQueryString("from") == g_const_Merchant_MT) {
             if (act == "c") {
                 window.top.location.href="Category.html?t=" + Math.random() + "&from=" + from;
             }
             if (act == "p") {
                 var pid = GetQueryString("pid");
                 //$("#p_msg").html("from=" + GetQueryString("from")+
                 //                "&act=" + GetQueryString("act")+
                 //                "&pid=" + GetQueryString("pid")+
                 //                "&mobile=" + GetQueryString("mobile"))
                 window.top.location.href="Product_Detail.html?pid=" + pid + "&t=" + Math.random() + "&from=" + from;
             }
         }

    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    <p id="p_msg"></p>
    </div>
    </form>
</body>
</html>
