/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../g_header.js" />
/// <reference path="../jquery-2.1.4.js" />

$(document).ready(function () {
    page_myviewhistory.Init();
});

var page_myviewhistory = {
    PageNum: 1,
    MaxNum: 0,
    /*初始化*/
    Init: function () {

        $("aside.fixed .btn").on("click", function (e) {
            g_type_history.ClearServer(page_myviewhistory.Clear);
            g_type_history.Clear();

        });
        $("#btnBack").click(function () {
            window.location.replace(PageUrlConfig.BackTo());
        });
        g_type_history.GetListFormServer(page_myviewhistory.PageNum, page_myviewhistory.LoadHistory);
        $("#btnqugg").on("click", function (e) {
            window.location.replace(g_const_PageURL.Index + "?t=" + Math.random());
        });

        //滑动事件
        var iHeight = 0;
        var winHeight = $(window).height();
        $(window).on('scroll', function () {
            var el = $(this);
            var iScrollTop = el.scrollTop();
            iHeight = $('body').height();
            if ((iScrollTop + winHeight) >= iHeight) {
                ++page_myviewhistory.PageNum;
                if (page_myviewhistory.PageNum <= page_myviewhistory.MaxNum && page_myviewhistory.MaxNum != 0) {
                    g_type_history.GetListFormServer(page_myviewhistory.PageNum, page_myviewhistory.LoadHistory);
                } else {
                    ShowMesaage(g_const_API_Message["100026"]);
                }
            }
        });
    },
    /*显示选择*/
    ChooseDisplay: function (bDisplay) {
        if (bDisplay) {
            $(".no-data").css("display", "none");
            $(".history.pb-55").css("display", "");
            $(".fixed").css("display", "");
        }
        else {
            $(".no-data").css("display", "");
            $(".history.pb-55").css("display", "none");
            $(".fixed").css("display", "none");
            $("#btnqugg").on("click", function (e) {
                window.location.href = g_const_PageURL.Index + "?t=" + Math.random();
            });
        }
    },
    /*读取历史数据*/
    LoadHistory: function (msg) {
        console.log(msg);
        if (msg.pagination == 0) {
            page_myviewhistory.ChooseDisplay(false);
        }
        else {
            page_myviewhistory.MaxNum = msg.pagination;
            //$("article .cols-one.clearfix").empty();
            var html = "";
            var objhistorys = msg.getBrowseHistory;
            var stpl = $("#tpl_h_p")[0].innerHTML;
            for (var k in objhistorys) {
                var objhistory = objhistorys[k];
                var data = {
                    product_code: objhistory.productCode,
                    purl: g_GetLocationByShowmoreLinktype(g_const_showmoreLinktype.ProductDetail, objhistory.productCode),
                    picture: g_GetPictrue(objhistory.mainpicUrl),
                    spicture: page_myviewhistory.Load_labelsList(objhistory.labelsPic, objhistory.productCode),
                    pname: FormatText(objhistory.productName, 25),
                    mprice: objhistory.marketPrice,
                    sprice: objhistory.sellPrice,
                    // salenum: objhistory.saleNum
                };
                html += renderTemplate(stpl, data);
            }
            $("article .cols-one.clearfix").append(html);
        }
    },
    Clear: function () {
        page_myviewhistory.ChooseDisplay(false);
    },
    Load_Product: function (url) {
        PageUrlConfig.SetUrl();
        window.location.href = url;
    },
    Load_labelsList: function (labelsPic) {
        //原有本地图片，3.9.4后注销
        //if (labelsList.length >= 1) {
        //    var label = g_const_ProductLabel.find(labelsList[0]);
        //    if (label) {
        //        return "<img class=\"d_add_ys\" src=\"" + label.spicture + "\" alt=\"\" />";
        //    }
        //}
        //3.9.4 从接口获取图片(记得修改调用方法中的传值labelsList替换为labelsPic)
        if (labelsPic != "" && !(labelsPic == undefined)) {
            return '<img class="d_add_ys" src="' + labelsPic + '" alt="" />';
        }


        return "";
    },
};