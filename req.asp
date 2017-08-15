<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312">
<title>传递参数值</title>
<style type="text/css">
<!--
body,td,th {
	font-size: 12px;
	color: #000000;
}
body {
	margin-left: 5px;
	margin-top: 5px;
	margin-right: 5px;
	margin-bottom: 5px;
}
-->
</style></head>
<body>
<form action="req.asp" method="post" enctype="application/x-www-form-urlencoded" target="_self" name="frm_main">
<textarea name="inputValue" style="width:100%; height:200px;"><%=request("inputValue")%></textarea>
<input name="btn_post" type="submit" value="POST" /><input name="btn_get" type="button" value="原始GET" onclick="window.location='req.asp?inputValue='+frm_main.inputValue.value;";/><input name="btn_mothod_get" type="button" value="method-GET" onclick="frm_main.method='get';frm_main.submit();";/>
</form>
<%
	response.write(application("theConnection"))
	response.write("<span style='color:red'>querystring:</span><br><span style='color:green'>" & request.querystring & "</span><br>")
	response.write("<span style='color:red'>form:</span><br><span style='color:green'>" & request.form & "</span><br>")
	response.write("<h1><b>Get:</b></h1>")
	For Each x In request.querystring
		Response.Write(x & "<b> = </b><span style='color:green'>" & request(x) & "</span><br>")
	Next
	response.write("<hr><h1><b>Post:</b></h1>")
	For Each x In request.form
		Response.Write(x & "<b> = </b><span style='color:green'>" & request(x) & "</span><br>")
	Next
	response.write("<hr><h1><b>ServerVariables:</b></h1>")
	For Each x In Request.ServerVariables
		Response.Write(x & "<b> = </b><span style='color:green'>" & request(x) & "</span><br>")
	Next
%>
</body>
</html>
