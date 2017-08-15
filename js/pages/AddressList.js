$(document).ready(function () {

    //保存需要返回的来源页【用于返回】
    //if (document.referrer != "" && document.referrer.indexOf("login") < 0 && document.referrer.indexOf("Register") < 0 && document.referrer.indexOf("AddressEdit") < 0 && document.referrer.indexOf("OrderConfirm") < 0) {
    //    PageUrlConfig.SetUrl(document.referrer);
    //}


    if (!localStorage.getItem(g_const_localStorage.StoreDistrict)) {
        Address_All.GetList();
    }

    UserLogin.Check(Address_Info.GetList);
    $("#btnNewaddress").click(function () {
        if (_addressmax <= _addresstotal) {
            ShowMesaage(g_const_API_Message["100038"] + _addressmax);
        }
        else {
            //保存返回URL
            PageUrlConfig.SetUrl();
            window.location.replace(g_const_PageURL.AddressEdit+"?addressid=0&login=" + UserLogin.LoginStatus+ "&t=" + Math.random());
        }
    });
    $("#btnBack").click(function () {
        window.location.replace(PageUrlConfig.BackTo(1));
    });
    if (localStorage["fromOrderConfirm"] == "1") {
        $("#spoperate").html("选择");
    }
    else {
        $("#spoperate").html("管理");
    }
});

function DeleteAddress(addressid) {
    Message.ShowConfirm("确定删除该收货地址？", "", "divAlert", "确定", "Address_Del.DeleteByID('" + addressid + "')", "取消");
}

var _addressmax = 50;