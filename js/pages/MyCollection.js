var _pageNo = 1;
//全部数据
var _productData = [];
//单页数据
var _productData_one = [];
var _editstatus = 0;
var _pidlist = [];
var _stop = true;
var _allpagenum = 1;
$(window).scroll(function () {
    totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
    if ($(document).height() <= totalheight && _allpagenum >= _pageNo) {
        if (_stop == true) {
            _stop = false;
            _pageNo++;
            Product.GetList();
            _stop = true;
        }
    }
});

$(document).ready(function () {
    Message.ShowLoading("数据加载中", "divAlert");
    Product.GetList();
    $("#btnback").click(function () {
        //history.back();
        window.location.replace(PageUrlConfig.BackTo());

    });
    $("#btnEdit").click(function () {
        _editstatus = 1;
        $("#asdClear").show();
        $("#btnEdit").hide();
        $("#atcList").attr("class", "collect pb-55");

        $("#btnCancel").show();
        Product.Load_Data_all();
    });

    $("#btnCancel").click(function () {
        _editstatus = 0;
        $("#asdClear").hide();
        $("#btnCancel").hide();
        $(".collect-edit").hide();
        $("#atcList").attr("class", "collect");


        $("#btnEdit").show();
        //Product.Load_Data();
    });

    $("#asdClear").click(function () {
        if (_pidlist.length == 0) {
            ShowMesaage(g_const_API_Message["100027"]);
            return;
        }
        _pageNo = 1;
        _productData = [];
        Collection.Delete(_pidlist, Product.GetList);
    });
    $("#btnAdd").click(function () {
        _pidlist = ["135899", "133956", "134233", "136062", "134179", "134180", "133205", "133816", "133957", "134202", "135916"]
        Collection.Add(_pidlist, Product.GetList);
    });
});
var api_target = "com_cmall_familyhas_api_APiGetMyCollectionProduct";
var Product = {
   // api_target: "com_cmall_familyhas_api_APiGetMyCollectionProduct",
    api_input: { "pageNum": "" },
    GetList: function () {
        Product.api_input.pageNum = _pageNo;
        var s_api_input = JSON.stringify(Product.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": api_target, "api_token": "1" };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            Message.Operate('', "divAlert");

            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //Message.ShowToPage("您还没有登录或者已经超时.", g_const_PageURL.Login, 2000);
                    Message.ShowToPage("", g_const_PageURL.Login, 500,"");
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }
            if (msg.resultCode == g_const_Success_Code) {
                _allpagenum = msg.pagination;
                if (_allpagenum==0) {
                    Product.Load_Recom();
                }
                _productData_one = [];
                $.each(msg.collectionProductList, function (i, n) {
                    _productData.push(n);
                    _productData_one.push(n);

                });
                Product.Load_Data();
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Data: function () {
        //if (_productData.length > 0) {
        //    Product.Load_Result(_productData);
        //}
        if (_productData_one.length > 0) {
            Product.Load_Result(_productData_one);
        }
    },
    Load_Result: function (resultlist) {
        $("#atcNull").hide();
        $("#atcList").show();
        var bodyList = "";
        $.each(resultlist, function (i, n) {
            bodyList += "<li onclick=\"Product.Load_Product('" + n.productCode + "')\">";
            bodyList += "<div class=\"goods-item\">";
            bodyList += "<img src=\"" + n.picture + "\" title=\"\">";
            //原有本地图片，3.9.4后注销
            //if (n.labelsList.length >= 1) {
            //    var label = g_const_ProductLabel.find(n.labelsList[0]);
            //    if (label) {
            //        bodyList += '<img class="d_add_ys" src="' + label.spicture + '" alt="" />';
            //    }
            //}
            //3.9.4 从接口获取图片
            if (n.labelsPic != "" && !(n.labelsPic == undefined)) {
                bodyList += '<img class="d_add_ys" src="' + n.labelsPic + '" alt="" />';
            }

            switch (n.productStatus) {
                case g_const_productStatus.Common:
                    bodyList += "";
                    break;
                case g_const_productStatus.SaleOver:
                    bodyList += "<span class=\"sold-out\"><em>抢光了</em></span>";
                    break;
                default:
                    bodyList += "<span class=\"sold-out\"><em>下架</em></span>";
                    break;
            }
            if (_editstatus == 1) {
                bodyList += "<em id=\"emEdit_" + n.productCode + "\" class=\"collect-edit\"></em>";
            }
            bodyList += "</div>";
            //var productName_t = n.productName.length > 19 ? n.productName.substring(0, 5)+"..." : n.productName;
            bodyList += "<h1 class=\"goods-item-tit\">" + n.productName + "</h1>";
            bodyList += "<span class=\"goods-item-price\"><i>¥</i>" + n.sellPrice + "<b>¥" + n.marketPrice + "</b></span>";
            bodyList += "</li>";

        });
        if (_pageNo==1) {
            $("#divColList").html(bodyList);
        }
        else {
            $("#divColList").append(bodyList);
        }
    },
    Load_Data_all: function () {
        if (_productData.length > 0) {
            Product.Load_Result_all(_productData);
        }
    },
    Load_Result_all: function (resultlist) {
        $("#atcNull").hide();
        $("#atcList").show();
        var bodyList = "";
        $.each(resultlist, function (i, n) {
            bodyList += "<li onclick=\"Product.Load_Product('" + n.productCode + "')\">";
            bodyList += "<div class=\"goods-item\">";
            bodyList += "<img src=\"" + n.picture + "\" title=\"\">";
            switch (n.productStatus) {
                case g_const_productStatus.Common:
                    bodyList += "";
                    break;
                case g_const_productStatus.SaleOver:
                    bodyList += "<span class=\"sold-out\"><em>抢光了</em></span>";
                    break;
                default:
                    bodyList += "<span class=\"sold-out\"><em>下架</em></span>";
                    break;
            }
            if (_editstatus == 1) {
                bodyList += "<em id=\"emEdit_" + n.productCode + "\" class=\"collect-edit\"></em>";
            }
            bodyList += "</div>";
            bodyList += "<h1 class=\"goods-item-tit\">" + n.productName + "</h1>";
            bodyList += "<span class=\"goods-item-price\"><i>¥</i>" + n.sellPrice + "<b>¥" + n.marketPrice + "</b></span>";
            bodyList += "</li>";

        });
        $("#divColList").html(bodyList);
    },

    Load_Recom: function () {
        $("#atcNull").show();
        $("#atcList").hide();
        $("#btnEdit").hide();
        $("#btnCancel").hide();
        
    },
    Load_Product: function (pid) {
        if (_editstatus == 1) {
            if ($("#emEdit_" + pid).attr("class") == "collect-edit") {
                $("#emEdit_" + pid).attr("class", "collect-edit ce-curr");
                _pidlist.push(pid);
            }
            else {
                $("#emEdit_" + pid).attr("class", "collect-edit");
                $.each(_pidlist, function (i, n) {
                    if (n==pid) {
                        _pidlist.splice(i, 1);
                        return false;
                    }
                });
            }
        }
        else {
            PageUrlConfig.SetUrl();
            window.location.href = g_const_PageURL.Product_Detail + "?pid=" + pid + "&t=" + Math.random();
        }
    },
    ReLoad_List: function () {
        $("#asdClear").hide();
        $("#btnEdit").show();
        $("#atcList").attr("class", "collect");
        _productData = [];
        Product.GetList();
    }
};

