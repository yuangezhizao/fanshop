var cateresultlist;

$(document).ready(function () {
    
    try {
        //if (!(web_category == undefined)) {
        //    //从静态文件获取数据
        //    //Hotword.LoadDataStaitc();
        //    My_LoadDataStaitc.LoadStaitc(web_category, Category.Load_Result, Category.GetList, web_category.scs, true);
        //}
        //else {
            //从接口获取数据
            Category.GetList();
        //}
    }
    catch (e) {
        //从接口获取数据
        Category.GetList();
    }


    $("#txtSearch").keyup(function () {
        if ($("#txtSearch").length > 0) {
            $("#divHotwordout").hide();
            $("#divAssociateout").show();
            Associate.GetList();
        }
        else {
            $("#divHotwordout").show();
            $("#divAssociateout").hide();
        }
    });
    $("#btnSearch").click(function () {
        PageUrlConfig.SetUrl();
        window.location.href=g_const_PageURL.Search + "?t=" + Math.random();
    });
    $("#btnBack_cg").click(function () {
        window.location.replace(PageUrlConfig.BackTo());

    });
});

//加载热词
var Category = {
    api_target: "com_cmall_familyhas_api_APiForCategory",
    api_input: {  },
    GetList: function () {
        var s_api_input = JSON.stringify(this.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": this.api_target };
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
                Category.Load_Result(msg.scs);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (resultlist) {
        cateresultlist = resultlist
        var body = "";
        var classstr="";
        $.each(resultlist, function (i, n) {
            if (i==0) {
                classstr = "class = \"curr\"";
            }
            else {
                classstr = "";
            }
            body += "<li id=\"li_level_"+i+"\"><a onclick=\"Category.Load_SubLevel(" + i + ")\">" + n.categoryName + "</a></li>";
        });
        $("#divlevel1").html(body);
        Category.Load_SubLevel(0);
        

        setScroll();
    },
    Load_SubLevel: function (index) {
        if (cateresultlist[index].advPic.length > 0) {
            if (cateresultlist[index].advUrl == "") {
                $("#divCatePic").html("<img src=\"" + g_GetPictrue(cateresultlist[index].advPic) + "\" alt=\"\">");
            }
            else {
                $("#divCatePic").html("<a href=\"" + cateresultlist[index].advUrl + "\"><img src=\"" + g_GetPictrue(cateresultlist[index].advPic) + "\" alt=\"\"></a>");
            }
        }
        else {
            $("#divCatePic").html("");
        }
        var body = "";
        $.each(cateresultlist[index].scs, function (i, n) {
            body += "<a onclick=\"Category.Load_ProductList('category','" + n.categoryName + "')\"><img src=\"" + g_GetPictrue(n.categoryPic) + "\" alt=\"\"><span>" + n.categoryName + "</span></a>";
        });
        $("#divlevel2").html(body);
        var info = "";
        $.each(cateresultlist[index].brands, function (i, n) {
            info += "<a onclick=\"Category.Load_ProductList('brand','" + n.brandZNName + "')\"><img src=\"" + g_GetPictrue(n.brandPic) + "\" alt=\"\"></a>";
        });
        $(".curr").attr("class", "");
        $("#divlevel3").html(info);
        $("#li_level_" + index).attr("class", "curr");
    },
    Load_ProductList: function (showtype, keyword) {
        PageUrlConfig.SetUrl();
        window.location.href=g_const_PageURL.Product_List + "?showtype=" + showtype + "&keyword=" + keyword + "&t=" + Math.random();
    },
    /*读取静态文件*/
    LoadDataStaitc: function () {
        var msg = web_category;
        if (msg.resultCode == g_const_Success_Code) {
            Category.Load_Result(msg.scs);
        }
        else {
            ShowMesaage(msg.resultMessage);
        }
    },
};