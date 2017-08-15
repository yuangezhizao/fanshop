$(document).ready(function(){
	var host = window.location.host;
	if(host.indexOf("ichsy.com") == -1){
		$("#top_id").css("display","block");
		$("#footer_id").css("display","block");
	}
	$("#top_nav").click(function(){
		$(".nav_top").toggle();
	});
	
});
function sendCommand(param){
	var url = "";
	var host = window.location.host;
	if(host == "weixin.jyh.com" || host == "m.jyh.com" || host == "m.jygw.com" || host == "weixin.jygw.com"){
		var productNo = param.substr(param.indexOf("goods_num:")+10);
		url="http://"+host+"/Home/Goods/goodsdetail/index/goodid/"+productNo+"/";
	}else{
		var productNo = param.substr(param.indexOf("goods_num:")+10);
		url="http://"+host+"/s/p/"+productNo+"?"+param;
	}
	top.location.href = url;
}
$(window).load(function() {
	top.postMessage({'do':'frameSize','value':{"height":document.documentElement.scrollHeight}},'*');
});
