
$(document).ready(function () {

    //返回
    $("#go-back").click(function () {
        window.location.replace(g_const_PageURL.MobileCZList);
    });

});

var OrderFail = {
    GoIndex: function () {
        window.location.replace(g_const_PageURL.Index + "?t=" + Math.random());
    },
    GoDetail: function (order_code) {
        window.location.replace(g_const_PageURL.MyOrder_List + "?paytype=ALL&t=" + Math.random());

    },
};


