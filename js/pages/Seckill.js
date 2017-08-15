/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../g_header.js" />
/// <reference path="../jquery-2.1.4.js" />

//http://qhbeta-cevent.qhw.yshqi.com/cevent/web/productSeKill/product_secKill_list.html?pageCode=ZT150804100005
//http://qhbeta-cevent.qhw.yshqi.com/cevent/web/productSeKill/product_secKill_salesCnt.html?pageCode=ZT150804100004
//http://qhbeta-cevent.qhw.yshqi.com/cevent/web/productSeKill/product_secKill_time.html?pageCode=ZT150804100002
/*
请开发同学注意轮播图促销活动配置：
第一张：非阶梯秒杀
第二张：秒杀按销量
第三张：秒杀按销量即将开始，正在进行，已结束
第四张：特价正在进行；第五张：特价已结束 ；
第六张：秒杀按时间即将开始，正在进行，已结束
第七张：特价即将开始

*/
var page_seckill = {
    /*秒杀类型*/
    event_product_sortType: g_const_event_product_sortType.Other,
    /*显示类型*/
    ShowType: {
        /*进行中*/
        On: "NowOnSale",
        /*即将进行*/
        Will: "WillSale",
        /*已经结束*/
        Stop: "StopSale"
    },
    /*初始化*/
    Init: function () {
        switch (page_seckill.event_product_sortType) {
            case g_const_event_product_sortType.Time:
                $(".btn-close").on("click", function (e) {
                    $(this).parent().css("display", "none");
                });
                break;
        }
        g_type_event_product_list.LoadData(page_seckill.LoadPrice);
        $("#btnBack").click(function () {
            //window.location.href = PageUrlConfig.BackTo();
            //window.location.replace(PageUrlConfig.BackTo());
            Merchant_Group.Back();

        });
    },
    /*定时刷新*/
    Refresh: function () {       
        window.setInterval(function () { g_type_event_product_list.LoadData(page_seckill.LoadPrice); }, 5 * g_const_minutes);
        //g_type_event_product_list.LoadData(page_seckill.LoadPrice);
    },
    /*读取价格信息*/
    LoadPrice: function (msg) {
        //把数据按时间分组
        var dtnow = Date.Parse(g_type_event_product_list.api_response.sysTime);
        var sitemCode = [];
        page_seckill.NowOnSaleList = [];
        page_seckill.StopSaleList = [];
        page_seckill.WillSaleList = [];
        page_seckill.PriceList = {};
        for (var k in g_type_event_product_list.api_response.eventProduct) {
            var Product = g_type_event_product_list.EventProduct;
            Product = g_type_event_product_list.api_response.eventProduct[k];
            var dtbegin = Date.Parse(Product.beginTime);
            var dtend = Date.Parse(Product.endTime);
            //if (Product.priceIs==g_const_event_product_priceIs.YES)
                sitemCode.unshift(Product.itemCode);
            if (dtnow < dtbegin)
                page_seckill.WillSaleList.unshift(Product);
            else if (dtnow >= dtbegin && dtnow <= dtend)
                page_seckill.NowOnSaleList.unshift(Product);
            else
                page_seckill.StopSaleList.unshift(Product);
        }
        $(".title").empty();
        var html = "";
        if (g_type_event_product_list.api_response.imgTopUrl != "") {
            if (g_type_event_product_list.api_response.imgTopUrlHref != "") {
                html = '<a onclick=\"page_seckill.Load_Top(\'' + g_GetLocationByShowmoreLinktype(g_const_showmoreLinktype.URL, g_type_event_product_list.api_response.imgTopUrlHref) + '\')\"><img src="' + g_type_event_product_list.api_response.imgTopUrl + '"></a>';
            }
            else {
                html = '<a><img src="' + g_type_event_product_list.api_response.imgTopUrl + '"></a>';
            }
            $(".title").append(html);
        }
        $(".titlefoot").empty();
        if (g_type_event_product_list.api_response.imgTailUrl != "") {
            if (g_type_event_product_list.api_response.imgTailUrlHref != "") {
                html = '<a onclick=\"page_seckill.Load_Top(\'' + g_GetLocationByShowmoreLinktype(g_const_showmoreLinktype.URL, g_type_event_product_list.api_response.imgTailUrlHref) + '\')\"><img src="' + g_type_event_product_list.api_response.imgTailUrl + '"></a>';
            }
            else {
                html = '<a><img src="' + g_type_event_product_list.api_response.imgTailUrl + '"></a>';
            }
            $(".titlefoot").append(html);
        }
        if (sitemCode.length > 0) {
            g_type_event_product_price.api_input.itemCode = sitemCode.join(",");
            g_type_event_product_price.LoadData(page_seckill.RenderIsPriceHtml);
        }
        else {
            ShowMesaage(g_const_API_Message["100037"]);
        }
    },
    Load_Top: function (url) {
        PageUrlConfig.SetUrl();
        //location = url + "&t=" + Math.random();
        window.location.href =url + "&t=" + Math.random();

    },
    ShowDetail: function (itemCode) {
        LoadProductDetail(itemCode);
    },
    /*渲染阶梯价数据*/
    RenderIsPriceHtml: function (msg) {
        var html = "";
        page_seckill.PriceList = msg.productPrice;
        html += page_seckill.RenderNowOnSale();
        html += page_seckill.RenderWillSale();
        html += page_seckill.RenderStopSale();
        $("#div_main").empty();
        $("#div_main").append(html);
    },    
    /*价格信息*/
    PriceList: {},    
    /*渲染正在进行中*/
    RenderNowOnSale: function () {
        var html = "";
        var stpl = "";
        var data = {};
        
        for (var k in page_seckill.NowOnSaleList) {
            var obj_product = page_seckill.NowOnSaleList[k];
            html += page_seckill.RenderSingleProduct(obj_product, page_seckill.ShowType.On, k.toString());
        }
        if (page_seckill.NowOnSaleList.length >0) {
            switch (page_seckill.event_product_sortType) {
                case g_const_event_product_sortType.Time:
                case g_const_event_product_sortType.SaleCount:
                case g_const_event_product_sortType.Other:
                    stpl = $("#tpl_seckill_time")[0].innerHTML;
                    data = {h2class: ";",timetype: "正在进行",productList: html};
                        break;

            }
            html = renderTemplate(stpl, data);
        }
            
        return html;
    },
    /*渲染即将开始*/
    RenderWillSale: function () {
        var html = "";
        var stpl = "";
        var data = {};

        for (var k in page_seckill.WillSaleList) {
            var obj_product = page_seckill.WillSaleList[k];
            html += page_seckill.RenderSingleProduct(obj_product, page_seckill.ShowType.Will, k.toString());
        }

        if (page_seckill.WillSaleList.length>0) {
           switch (page_seckill.event_product_sortType) {
                case g_const_event_product_sortType.Time:
                case g_const_event_product_sortType.SaleCount:
                case g_const_event_product_sortType.Other:
                    stpl = $("#tpl_seckill_time")[0].innerHTML;
                    data = {
                        h2class: "h2",
                        timetype: "即将开始",
                        productList: html
                };
                    break;
            }
            html = renderTemplate(stpl, data);
        }        
        return html;
    },
    /*渲染已经结束*/
    RenderStopSale: function () {
        var html = "";
        var stpl = "";
        var data = {};

        for (var k in page_seckill.StopSaleList) {
            var obj_product = page_seckill.StopSaleList[k];
            html += page_seckill.RenderSingleProduct(obj_product, page_seckill.ShowType.Stop, k.toString());
        }
        if (page_seckill.StopSaleList.length>0) {
            switch (page_seckill.event_product_sortType) {
                case g_const_event_product_sortType.Time:
                case g_const_event_product_sortType.SaleCount:
                case g_const_event_product_sortType.Other:
                    stpl = $("#tpl_seckill_time")[0].innerHTML;
                    data = { h2class: "h3",timetype: "已结束",productList: html};
                        break;
            }
            html = renderTemplate(stpl, data);
        }        
        return html;
    },
    /*渲染单个产品*/
    RenderSingleProduct:function(obj_product,srtype,k){
        var html = "";
        var stpl = "";
        var data = {};
       
        //obj_product = g_type_event_product_list.EventProduct;//测试用,不测试时需要注释
        stpl = $("#tpl_seckill_time_product")[0].innerHTML;
        if (page_seckill.event_product_sortType != g_const_event_product_sortType.Other) {
            data = {
                //productlink: g_GetLocationByShowmoreLinktype(g_const_showmoreLinktype.ProductDetail, obj_product.itemCode),
                productlink:obj_product.itemCode,
                fontid: "font_" + srtype + "_" + k,
                picture: obj_product.mainpicUrl == "" ? g_goods_Pic : obj_product.mainpicUrl,
                isSoldOut_style: obj_product.salesVolume == 0 ? "" : "display:none;",
                spanid: "span_" + srtype + "_" + k,
                pname: FormatText(obj_product.skuName, 22),
                ccurpricelist: page_seckill.GetccurPriceListHMTL(obj_product, srtype),
                timeleftpercent_style: "width:" + page_seckill.GetLeftTimePercent(obj_product, srtype) + "%;",
                salesVolume: obj_product.salesVolume.toString(),
                labelid: "label_" + srtype + "_" + k,
                ccurtimelist: page_seckill.Getccurtimeornumlist(obj_product)
            };
        }
        else {
            var objprice = eval("page_seckill.PriceList." + obj_product.itemCode);
            data = {
                //productlink: g_GetLocationByShowmoreLinktype(g_const_showmoreLinktype.ProductDetail, obj_product.itemCode),
                productlink: obj_product.itemCode,
                fontid: "font_" + srtype + "_" + k,
                picture: obj_product.mainpicUrl == "" ? g_goods_Pic : obj_product.mainpicUrl,
                isSoldOut_style: obj_product.salesVolume == 0 ? "" : "display:none;",
                spanid: "span_" + srtype + "_" + k,
                pname: FormatText(obj_product.skuName, 22),
                saleprice: objprice.favorablePrice,
                marketprice: objprice.marketPrice,
                leftcount: page_seckill.GetLeftCount(obj_product, srtype, k)
            };
        }
        html = renderTemplate(stpl, data);
        switch (page_seckill.event_product_sortType) {
            case g_const_event_product_sortType.Time:                
                window.setTimeout(function () {
                    if (srtype == page_seckill.ShowType.On) {
                        $("#" + data.labelid + " em[ichsydata='" + page_seckill.curStepPrice.btime.Format("yyyy-MM-dd hh:mm:ss") + "']").attr("class", "curr");
                        $("#" + data.labelid + " em[ichsydata='" + page_seckill.curStepPrice.etime.Format("yyyy-MM-dd hh:mm:ss") + "']").attr("class", "curr");
                    }
                    page_seckill.ShowLeftTime(obj_product, srtype, $("#" + data.fontid), $("#" + data.spanid));
                }, 100);
                break;
            case g_const_event_product_sortType.SaleCount:                
                window.setTimeout(function () {
                    if (srtype == page_seckill.ShowType.On) {
                        $("#" + data.labelid + " em[ichsydata='" + page_seckill.curStepPrice.bcount.toString() + "']").attr("class", "curr");
                        $("#" + data.labelid + " em[ichsydata='" + page_seckill.curStepPrice.ecount.toString() + "']").attr("class", "curr");
                    }
                    page_seckill.ShowLeftTime(obj_product, srtype, $("#" + data.fontid), $("#" + data.spanid));
                }, 100);
                break;
            case g_const_event_product_sortType.Other:
                window.setTimeout(function () {                    
                    page_seckill.ShowLeftTime(obj_product, srtype, $("#" + data.fontid), $("#" + data.spanid));
                }, 100);
                break;
        }
        
        return html;
    },
    /*取得非阶梯剩余数量*/
    GetLeftCount: function (obj_product, srtype,k) {
        var html = "";
        switch (srtype) {
            case page_seckill.ShowType.On:
                var percent = (obj_product.salesVolume / obj_product.salesNum * 100).toFixed(2);
                html = '<span id="spanleft_' + srtype + '_' + k + '"><i style="height:' + percent.toString() + '%;"></i><em>剩余<br><strong>' + obj_product.salesVolume + '</strong>件</em></span>';
                break;
            case page_seckill.ShowType.Will:
                html = "&nbsp;";
                break;
            case page_seckill.ShowType.Stop:
                var salecount = obj_product.salesNum - obj_product.salesVolume;
                var ts = Date.Parse(obj_product.endTime).getTime() - Date.Parse(obj_product.beginTime).getTime();
                var hours = Math.floor(ts / g_const_hours);
                var leftmillionseconds = ts % g_const_hours;
                var minutes = Math.floor(leftmillionseconds / g_const_minutes);
                leftmillionseconds = leftmillionseconds % g_const_minutes;
                var seconds = Math.floor(leftmillionseconds / g_const_seconds);

                var hourstring = "0" + hours.toString();
                hourstring = hourstring.substr(hourstring.length - 2, 2);
                var minutestring = "0" + minutes.toString();
                minutestring = minutestring.substr(minutestring.length - 2, 2);

                var secondstring = "0" + seconds.toString();
                secondstring = secondstring.substr(secondstring.length - 2, 2);
                html = "<font>" + hourstring + "时" + minutestring + "分" + secondstring + "秒 抢光了" + salecount.toString() + "件</font>";
                break;
        }
        return html;
    },
    /*取得时间或者数量阶梯*/
    Getccurtimeornumlist: function (obj_product) {
        var objprice = eval("page_seckill.PriceList." + obj_product.itemCode);
        var html = "";
        switch (page_seckill.event_product_sortType) {
            case g_const_event_product_sortType.Time:
                var starttime = Date.Parse(obj_product.beginTime);
                var endtime = Date.Parse(obj_product.endTime);
                var ts_total = endtime.getTime() - starttime.getTime();
                var dtnow = Date.Parse(g_type_event_product_list.api_response.sysTime);
                html = '<em style="left:0;" ichsydata="' + starttime.Format("yyyy-MM-dd hh:mm:ss") + '">' + starttime.Format("hh:mm") + '</em>';

                for (var k in objprice.list) {
                    var l = objprice.list[k];
                    for (var key in l) {
                        var iminutes = parseInt(key, 10);
                        var totime = starttime.AddMinutes(iminutes);
                        var fpercent = iminutes * g_const_minutes / ts_total;
                        var spercent = (fpercent.toFixed(2) * 100).toString();
                        html += '<em style="left:' + spercent + '%" ichsydata="' + totime.Format("yyyy-MM-dd hh:mm:ss") + '">' + totime.Format("hh:mm") + '</em>';
                    }
                }
                html += '<em style="left:100%;" ichsydata="' + endtime.Format("yyyy-MM-dd hh:mm:ss") + '">' + endtime.Format("hh:mm") + '</em>';
                break;
            case g_const_event_product_sortType.SaleCount:
                var bcount = 0;
                var ecount = obj_product.salesNum;
                var salecount = obj_product.salesNum - obj_product.salesVolume;
                html = '<em style="left:0;" ichsydata="' + bcount.toString() + '">' + bcount.toString() + '</em>';
                for (var k in objprice.list) {
                    var l = objprice.list[k];
                    for (var key in l) {
                        var icount = parseInt(key, 10);
                        var tocount = bcount + icount;
                        var fpercent = icount / ecount;
                        var spercent = (fpercent * 100).toFixed(2).toString();
                        html += '<em style="left:' + spercent + '%" ichsydata="' + tocount.toString() + '">' + tocount.toString() + '</em>';
                    }
                }
                html += '<em style="left:100%;" ichsydata="' + ecount.toString() + '">' + ecount.toString() + '</em>';
                break;
        }        
        return html;
    },    
    /*取得剩余时间所占百分比*/
    GetLeftTimePercent: function (obj_product, srtype) {
        if (srtype == page_seckill.ShowType.On) {
            switch (page_seckill.event_product_sortType) {
                case g_const_event_product_sortType.Time:
                    var starttime = Date.Parse(obj_product.beginTime);
                    var endtime = Date.Parse(obj_product.endTime);
                    var ts_total = endtime.getTime() - starttime.getTime();
                    var dtnow = Date.Parse(g_type_event_product_list.api_response.sysTime);
                    var ts_left = endtime.getTime() - dtnow.getTime();
                    var fpercent = (ts_left / ts_total).toFixed(2) * 100;
                    var spercent = fpercent.toString();
                    return spercent;
                case g_const_event_product_sortType.SaleCount:                    
                    var fpercent = (obj_product.salesVolume / obj_product.salesNum).toFixed(2) * 100;
                    var spercent = fpercent.toString();
                    return spercent;
                    break;
            }
            
        }
        else if (srtype == page_seckill.ShowType.Will)
            return "100";
        else if (srtype == page_seckill.ShowType.Stop)
            return "0";
        else
            return "";
    },    
    /*梯架数组*/
    arrStepPrice: [],
    /*当前阶梯价*/
    curStepPrice:{},
    /*取得价格列表HTML*/
    GetccurPriceListHMTL: function (obj_product, srtype) {
        var html = "";
        //obj_product = g_type_event_product_list.EventProduct;//测试用,不测试时需要注释
        //{"resultCode":1,"resultMessage":"","productPrice":{"IC150804100030":{"list":[{"10":"70"},{"25":"60"}],"sellingPrice":"100.00","favorablePrice":"100.00","marketPrice":"253.50","priceValue":35},"IC150804100031":{"list":[{"10":"50"},{"20":"37"}],"sellingPrice":"100.00","favorablePrice":"100.00","marketPrice":"448.50","priceValue":30},"IC150804100029":{"list":[{"10":"80"},{"20":"60"}],"sellingPrice":"100.00","favorablePrice":"100.00","marketPrice":"553.50","priceValue":30}}}
        var objprice = eval("page_seckill.PriceList." + obj_product.itemCode);
        
        var starttime = Date.Parse(obj_product.beginTime);
        var endtime = Date.Parse(obj_product.endTime);
        var ts_total = objprice.priceValue;//总的分钟数
        var dtnow = Date.Parse(g_type_event_product_list.api_response.sysTime);
        var arrstepprice = [];
        //var obj_price = {
        //    /*开始时间*/
        //    btime: starttime,
        //    /*结束时间*/
        //    etime: endtime,
        //    /*分钟数*/
        //    mins: ts_total,
        //    /*比重*/
        //    percent:"100",
        //    /*价格*/
        //    price: 0
        //};
        var maxlength = objprice.list.length + 1;       
        var fprice = 0.0;
        var flastprice = parseFloat(objprice.favorablePrice);
        switch (page_seckill.event_product_sortType) {
            case g_const_event_product_sortType.Time:
                var btime = starttime;
                var etime;
                var iminutes = 0;
                var ilastminutes = 0;
                for (var i = 0; i < maxlength; i++) {
                    if (i < objprice.list.length) {
                        var ol = objprice.list[i];
                        for (var key in ol) {
                            iminutes = parseInt(key, 10);
                            fprice = parseFloat(ol[key]);
                        }
                        var obj_price_temp = {
                            mins: iminutes - ilastminutes,
                            btime: btime,
                            etime: etime,
                            price: flastprice,
                            percent: ""
                        }
                        obj_price_temp.etime = obj_price_temp.btime.AddMinutes(obj_price_temp.mins);
                        obj_price_temp.percent = ((obj_price_temp.mins / ts_total) * 100).toFixed(2).toString();
                        etime = obj_price_temp.etime;
                        arrstepprice.push(obj_price_temp);
                    }
                    else {
                        var obj_price_temp = {
                            mins: ts_total - ilastminutes,
                            btime: btime,
                            etime: endtime,
                            price: flastprice,
                            percent: ""
                        }
                        obj_price_temp.percent = ((obj_price_temp.mins / ts_total) * 100).toFixed(2).toString();
                        arrstepprice.push(obj_price_temp);
                    }
                    ilastminutes = iminutes;
                    flastprice = fprice;
                    btime = etime;
                }
                for (var k in arrstepprice) {
                    var stepprice = arrstepprice[k];
                    if (dtnow >= stepprice.btime && dtnow < stepprice.etime) {
                        html += '<i class="i' + i + ' curr" style="width:' + stepprice.percent + '%;"><span>¥<strong>' + stepprice.price + '</strong>（当前价）</span></i>';
                        page_seckill.curStepPrice = stepprice;
                    }
                    else {
                        html += '<i class="i' + i + '" style="width:' + stepprice.percent + '%;"><span>¥' + stepprice.price + '</span></i>';
                    }
                }
                break;
            case g_const_event_product_sortType.SaleCount:
                var bcount = 0;
                var ecount = obj_product.salesNum;
                ts_total = obj_product.salesNum;
                var icount = 0;
                var ilastcount = 0;
                var salecount = ts_total-obj_product.salesVolume;
                for (var i = 0; i < maxlength; i++) {
                    if (i < objprice.list.length) {
                        var ol = objprice.list[i];
                        for (var key in ol) {
                            icount = parseInt(key, 10);
                            fprice = parseFloat(ol[key]);
                        }
                        var obj_price_temp = {
                            /*开始数量*/
                            bcount: bcount,
                            /*结束数量*/
                            ecount: ecount,
                            /*差额数*/
                            diffcounts: icount - ilastcount,
                            /*比重*/
                            percent: "100",
                            /*价格*/
                            price: flastprice
                        };
                        obj_price_temp.ecount = obj_price_temp.bcount + obj_price_temp.diffcounts;
                        obj_price_temp.percent = ((obj_price_temp.diffcounts / ts_total) * 100).toFixed(2).toString();
                        ecount = obj_price_temp.ecount;
                        arrstepprice.push(obj_price_temp);
                    }
                    else {                  
                        var obj_price_temp = {
                            /*开始数量*/
                            bcount: bcount,
                            /*结束数量*/
                            ecount: ts_total,
                            /*差额数*/
                            diffcounts: ts_total - ilastcount,
                            /*比重*/
                            percent: "",
                            /*价格*/
                            price: flastprice
                        };
                        obj_price_temp.percent = ((obj_price_temp.diffcounts / ts_total) * 100).toFixed(2).toString();
                        arrstepprice.push(obj_price_temp);
                    }                        
                    ilastcount = icount;
                    flastprice = fprice;
                    bcount = ecount;
                }
                for (var k in arrstepprice) {
                    var stepprice = arrstepprice[k];
                    if (salecount >= stepprice.bcount && salecount < stepprice.ecount && srtype == page_seckill.ShowType.On) {
                        html += '<i class="i' + i + ' curr" style="width:' + stepprice.percent + '%;"><span>¥<strong>' + stepprice.price + '</strong>（当前价）</span></i>';
                        page_seckill.curStepPrice = stepprice;
                    }
                    else {
                        html += '<i class="i' + i + '" style="width:' + stepprice.percent + '%;"><span>¥' + stepprice.price + '</span></i>';
                    }
                }
                break;
        }                 
        page_seckill.arrStepPrice = arrstepprice;
        return html;
    },
    /*是否在数组内*/
    ExistInArray:function(obj,arr){
        for (var i in arr) {
            var o = arr[i];
            if (obj.begintime == o.begintime && obj.endtime == o.endtime)
                return o;
        }
        return null;
    },
    /*正在进行中的销售列表*/
    NowOnSaleList: [],
    /*即将开始的销售列表*/
    WillSaleList: [],
    /*已经停止的销售列表*/
    StopSaleList: [],
    /*显示倒计时*/
    ShowLeftTime: function (obj_product, srtype,obj_fontid, obj_spanid) {
        //obj_product = g_type_event_product_list.EventProduct;//测试用,不测试时需要注释
        var date_last,showtext,endshowtext;
        switch (srtype) {
            case page_seckill.ShowType.On:
                date_last = Date.Parse(obj_product.endTime);
                endshowtext = "已结束";
                showtext = "结束";
                break;
            case page_seckill.ShowType.Will:
                date_last = Date.Parse(obj_product.beginTime);
                endshowtext = "已开始";
                showtext = "开始";
                break;
            case page_seckill.ShowType.Stop:
                endshowtext = "已结束";
                obj_fontid[0].innerHTML = "活动日期" + Date.Parse(obj_product.beginTime).Format("MM月dd日");
                obj_spanid[0].innerHTML = "<i>" + endshowtext + "</i>";
                obj_spanid[0].style.display = "";
                return;
        }        
        
        var date_now = new Date();
        var ts = date_last.getTime() - date_now.getTime();  //时间差的毫秒数              

        var days = Math.floor(ts / g_const_days);
        var leftmillionseconds = ts % g_const_days;

        var hours = Math.floor(leftmillionseconds / g_const_hours);
        leftmillionseconds = leftmillionseconds % g_const_hours;

        var minutes = Math.floor(leftmillionseconds / g_const_minutes);
        leftmillionseconds = leftmillionseconds % g_const_minutes;

        var seconds = Math.floor(leftmillionseconds / g_const_seconds);
        
        var hourstring = "0" + hours.toString();
        hourstring = hourstring.substr(hourstring.length - 2, 2);
        var minutestring = "0" + minutes.toString();
        minutestring = minutestring.substr(minutestring.length - 2, 2);

        var secondstring = "0" + seconds.toString();
        secondstring = secondstring.substr(secondstring.length - 2, 2);
        obj_fontid[0].innerHTML = "<i>" + days.toString() + "天" + hourstring + "时" + minutestring + "分" + secondstring + "秒</i>后" + showtext;
        if (days != 0 || hours != 0 || minutes != 0 || seconds != 0) {            
            window.setTimeout(function () { page_seckill.ShowLeftTime(obj_product, srtype, obj_fontid, obj_spanid) }, 1000);
        }
        else {
            obj_spanid[0].innerHTML = "<i>" + endshowtext + "</i>";
            obj_spanid[0].style.display = "";
            if (page_seckill.event_product_sortType == g_const_event_product_sortType.Other && srtype == page_seckill.ShowType.On) {
                var k = obj_spanid.attr("id").split("_")[2];
                $("#spanleft_" + srtype + "_" + k ).attr("class", "curr");
            }

        }
           
    }

}