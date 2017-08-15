(function () {
    var dr = {};
    dr.api_target = "com_cmall_familyhas_api_ApiGetProductCommentListCf",
    dr.api_input = { "screenWidth": "0", "productCode": "", "gradeType": "全部", "paging": { "limit": "10", "offset": "0" }, "version": "" };
    dr.InitData = function () {
        dr.api_input.productCode = GetQueryString("pid");
        var s_api_input = JSON.stringify(dr.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": dr.api_target };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultCode == g_const_Success_Code) {
                dr.LoadResult(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    };
    dr.LoadResult = function (msg) {
        var data = msg.productComment[0];
        var html = "";
        if (data) {
            html += '' + msg.highPraiseRate;
            html += '' + msg.commentSumCounts;
            html += '' + this.userFace;
            html += '' + this.userMobile;
            html += '' + this.this.commentTime + this.commentContent;
            html += '' + '&emsp;款式：' + this.skuColor + '&emsp;规格：' + this.skuStyle;
        }
        else {
            html += "暂无评价";
        }
        $("#review").html(html);
    };
    dr.InitEvent = function () {
        $("#gradeType a").on("click", function () {
            
        });
    };
    (dr.Init = function () {
        $(function () {
            dr.InitData();
            dr.InitEvent();
        });
    })();
})();