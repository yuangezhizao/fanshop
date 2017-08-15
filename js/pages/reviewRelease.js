var callBack = function () {
    var source = GetQueryString("s");
    var order_code = GetQueryString("order_code");
    if (source == "d") {
        window.location.href = g_const_PageURL.MyOrder_detail + "?order_code=" + order_code + "&paytype=&t=" + Math.random();
    }
    else {
        window.location.href = g_const_PageURL.MyOrder_List + "?paytype=JYCG&t=" + Math.random();
    }
};
(function () {
    var reviewRelease = {};
    var reviewGrade = {
        "1": "不满意",
        "2": "一般",
        "3": "还可以",
        "4": "比较满意",
        "5": "非常满意"
    };

    reviewRelease.api_target = "com_cmall_familyhas_api_ApiProductCommentAddCf",
    reviewRelease.api_input = { "comments": [], "version": "" };
    reviewRelease.order_code = "";
    //发布事件
    reviewRelease.Release = function () {
        $("#btnRelease").hide();
        reviewRelease.InitParameter();
        var s_api_input = JSON.stringify(reviewRelease.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": reviewRelease.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode == g_const_Error_Code.UnLogin) {
                //Session失效，重新登录，传递回调地址
                UserRELogin.login(g_const_PageURL.ReviewRelease + "?order_code=" + reviewRelease.order_code + "&t=" + Math.random());
                return;
            }
            if (msg.resultCode == g_const_Success_Code) {
                g_type_Evaluate.changeCommented(reviewRelease.order_code);
                ShowMesaage(g_const_API_Message["7004"]);
                window.setTimeout(callBack, 1000);
            }
            else {
                $("#btnRelease").show();
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    };
    //为发布评价post数据整理
    reviewRelease.InitParameter = function () {
        var par = {};
        $("#productList li").each(function () {
            var textArea = $(this).find("textarea");
            par.order_code = reviewRelease.order_code;
            par.sku_code = $(this).attr("sku_code");
            par.product_code = $(this).attr("product_Code");
            par.grade = $(this).find("font").attr("grade");
            par.comment_content = $(textArea).val() || "没有填写评价！";
            par.comment_photo = [];
            reviewRelease.api_input.comments.push(par);
        });
    };
    //获取该订单下面的产品数据
    reviewRelease.GetProductList = function () {
        var api_target = "com_cmall_familyhas_api_ApiOrderDetails";
        reviewRelease.order_code = GetQueryString("order_code");
        var api_input = { "buyer_code": "", "order_code": reviewRelease.order_code, "version": "" };
        var s_api_input = JSON.stringify(api_input);
        var obj_data = { "api_input": s_api_input, "api_target": api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode == g_const_Error_Code.UnLogin) {
                //Session失效，重新登录，传递回调地址
                UserRELogin.login(g_const_PageURL.ReviewRelease + "?order_code=" + reviewRelease.order_code + "&t=" + Math.random());
                return;
            }
            if (msg.resultCode == g_const_Success_Code) {
                reviewRelease.LoadProductList(msg.orderSellerList);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    };
    //渲染需要评价的商品列表
    reviewRelease.LoadProductList = function (result) {
        var html = "";
        var temHtml = $("#tmpReviewProduct").html();
        var temData = {};
        $(result).each(function () {
            temData.ProductCode = this.productCode;
            temData.SkuCode = "";
            temData.ProductImg = this.mainpicUrl;
            temData.ProductName = this.productName;
            html += renderTemplate(temHtml, temData);
        });
        $("#productList").html(html);

        reviewRelease.InitEvent();
    };
    //页面元素事件绑定初始化
    reviewRelease.InitEvent = function () {
        //发布事件
        $("#btnRelease").on("click", function () {
            reviewRelease.Release();
        });
        //评星事件
        $("em").on("click", function () {
            var grade = $(this).attr("grade");
            var parentFont = $(this).parent().parent();
            $(parentFont).attr("class", "f" + grade).attr("grade", grade);
            $(parentFont).find("span").text(reviewGrade[grade]);
        });
        //返回事件
        $(".go-back").on("click", function () {
            Message.ShowConfirm("评价未完成，确定放弃吗？", "", "fbox_freview", "确定", "callBack", "取消");
        });
    };
    //初始化主程序
    (reviewRelease.Init = function () {
        $(function () {
            reviewRelease.GetProductList();
        });
    })();
})();