<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="com.hjy.fan.WebTouch.Account.Login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>饭好了</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
        <table style="width:100%;">
            <tr>
                <td>用户名</td>
                <td><asp:TextBox ID="txtLogin" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>用户密码</td>
                <td><asp:TextBox ID="txtPass" runat="server"></asp:TextBox></td>
            </tr>
            <tr>
                <td>
                    <asp:Label ID="lblMsg" runat="server" Text=""></asp:Label></td>
                <td>
                    <asp:Button ID="btnlogin" runat="server" Text="Button" OnClick="btnlogin_Click" />
                </td>
            </tr>
        </table>
    
    </div>
    </form>
</body>
</html>
