
(function () {
    var slider = {};
    slider.tag = $(document);
    slider.index = 1;
    slider.direction = "mid"
    slider.sPoint = {};
    slider.ePoint = {};
    slider.isScrolling = 0;
    slider.touchStart = function () {
        slider.tag.on("touchstart", function (e) {
            slider.direction = "mid";
            slider.ePoint = {};
            var touchS = e.originalEvent.targetTouches[0];
            slider.sPoint = { x: touchS.pageX, y: touchS.pageY };

            slider.tag.on("touchmove", function (e) {
                if (e.originalEvent.targetTouches > 1 || e.originalEvent.scale && e.originalEvent.scale !== 1) return;
                var touchM = e.originalEvent.targetTouches[0];
                slider.ePoint = { x: touchM.pageX - slider.sPoint.x, y: touchM.pageY - slider.sPoint.y };
                slider.isScrolling = Math.abs(slider.ePoint.x) < Math.abs(slider.ePoint.y) ? 1 : 0; //isScrolling为1时，表示纵向滑动，0为横向滑动
                if (slider.isScrolling === 0) {
                    //event.preventDefault(); //阻止触摸事件的默认行为，即阻止滚屏
                   // var offset = Math.abs(slider.ePoint.x);
                    if (slider.ePoint.x > 0) {
                        slider.direction = "left";
                    }
                    if (slider.ePoint.x < 0) {
                        slider.direction = "right";
                    }
                }
            });
            slider.tag.on("touchend", function (e) {
                if (slider.isScrolling === 0) { //当为水平滚动时
                    //当偏移量大于10时执行
                    var offset = Math.abs(slider.ePoint.x);
                    var scrollflag = 0;
                    if (offset > 10) {
                        if (slider.direction == "right" && slider.index >= 1 && slider.index != 5) {
                            ++slider.index;
                            scrollflag = 1;
                        }
                        if (slider.direction == "left" && slider.index <= 5 && slider.index != 1) {
                            --slider.index;
                            scrollflag = 1;
                        }
                        if (slider.direction == "mid") {
                            return false;
                        }
                        if (scrollflag == 0) {
                            return false;
                        }
                        $("#gradeType").find("a[num='" + slider.index + "']").addClass("curr").siblings().removeClass("curr");
                        $("#reviewList").empty();
                        reviewList.PageNum = "0";
                        reviewList.InitData();
                    }
                }
                //解绑事件
                slider.tag.unbind("touchmove");
                slider.tag.unbind("touchend");
            });
        });
    };
    var reviewList = {};
    //评价类型
    var reviewType = {
        all: "全部",
        good: "好评",
        middle: "中评",
        bad: "差评",
        pic: "有图"
    };
    //评价无消息
    var reviewNoMessage = {
        all: "暂无评价",
        good: "暂无好评",
        middle: "暂无中评",
        bad: "暂无差评",
        pic: "暂无评价"
    };

    reviewList.api_target = "com_cmall_familyhas_api_ApiGetProductCommentListCf",
    //页码
    reviewList.PageNum = 0;
    //最大页数
    reviewList.MaxNum = 0;
    //产品id
    reviewList.product_code = "";
    reviewList.NoMessage = "暂无评价";
    reviewList.api_input = { "screenWidth": "0", "productCode": "115178", "gradeType": "全部", "paging": { "limit": "10", "offset": "0" }, "version": "" };

    //初始化服务器数据到本地
    reviewList.InitData = function () {
        reviewList.product_code = GetQueryString("pid");
        var currentType = $("#gradeType a[class=curr]").attr("gradeType");
        reviewList.api_input.gradeType = reviewType[currentType];
        reviewList.NoMessage = reviewNoMessage[currentType];
        reviewList.api_input.paging.offset = reviewList.PageNum;
        reviewList.api_input.productCode = reviewList.product_code;

        var s_api_input = JSON.stringify(reviewList.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": reviewList.api_target };
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
                reviewList.LoadResult(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    };
    //加载服务器返回数据
    reviewList.LoadResult = function (msg) {
        reviewList.LoadCount(msg);
        if (msg.commentSumCounts == 0) {
            $("#reviewNo").show();
            $(".comm_tip").hide();
            
        }
        else {
            $("#gradeType").show();
            if (msg.paged.total > 0) {
                reviewList.MaxNum = parseInt((msg.paged.total + 10 - 1) / 10);
                $("#reviewNo").hide();
                reviewList.LoadReview(msg);
                $("#reviewList").show();
            }
            else {
                $("#reviewNo").html(reviewList.NoMessage);
                $("#reviewNo").show();
                $("#reviewList").hide();
            }
        }
    };
    //加载评论数量
    reviewList.LoadCount = function (msg) {
        $("#gradeType a").each(function () {
            var self = $(this);
            var type = self.attr("gradeType");
            var typeText = reviewType[type];
            switch (type) {
                case "all": //全部数量
                    self.text(typeText + "(" + msg.commentSumCounts + ")");
                    break;
                case "good"://好评数量
                    self.text(typeText + "(" + (msg.highPraiseCounts > 999 ? "999+" : msg.highPraiseCounts) + ")");
                    break;
                case "middle"://中评数量
                    self.text(typeText + "(" + (msg.commonPraiseCounts > 999 ? "999+" : msg.commonPraiseCounts) + ")");
                    break;
                case "bad"://差评数量
                    self.text(typeText + "(" + (msg.lowPraiseCounts > 999 ? "999+" : msg.lowPraiseCounts) + ")");
                    break;
                case "pic": //有图数量
                    self.text(typeText + "(" + (msg.pictureCounts > 999 ? "999+" : msg.pictureCounts) + ")");
                    break;
                default:
                    self.text(typeText + "(0)");
                    break;
            }
        });
    };
    //渲染评论列表
    reviewList.LoadReview = function (msg) {
        var data = msg.productComment;
        var html = "";
        var stpl = $("#tmpReview").html();
        var dataTemp = {};
        $(data).each(function () {
            dataTemp.userFace = this.userFace || g_member_Pic;
            dataTemp.grade = "f" + this.grade;
            dataTemp.userMobile = this.userMobile;
            dataTemp.commentContent = this.commentContent;
            dataTemp.commentTime = this.commentTime;
            dataTemp.attribute = (this.skuColor.length == 0 ? '' : '&emsp;款式：' + this.skuColor) + (this.skuStyle.length == 0 ? '' : '&emsp;规格：' + this.skuStyle);
            var imgs = "";
            $(this.commentPhotoList).each(function () {
                //smallPicInfo 小图
                //bigPicInfo 大图
                //picInfo 原图
                if (this.smallPicInfo.picUrl) {
                    imgs += '<img src="' + this.smallPicInfo.picUrl + '" big="' + this.bigPicInfo.picUrl + '" alt="">';
                }
            });
            var imgHtml = '';
            if (imgs) {
                imgHtml += '<div class="img">';
                imgHtml += imgs;
                imgHtml += '</div>';
            }
            dataTemp.imgs = imgHtml;
            if (this.replyContent) {
                dataTemp.replyContent = this.replyContent;
                dataTemp.replyTime = this.replyTime.indexOf("回复于") > -1 ? this.replyTime : "回复于" + this.replyTime;
            }
            html = renderTemplate(stpl, dataTemp);
            $("#reviewList").append(html);
        });
    };
    //页面事件初始化
    reviewList.InitEvent = function () {
        //点击tap不同评论类型
        $("#gradeType a").on("click", function () {
            $(this).addClass("curr").siblings().removeClass("curr");
            $("#reviewList").empty();
            reviewList.PageNum = "0";
            reviewList.InitData();
        });

        //滑动事件
        var iHeight = 0;
        var winHeight = $(window).height();
        $(window).on('scroll', function () {
            var el = $(this);
            var iScrollTop = el.scrollTop();
            iHeight = $('body').height();
            if ((iScrollTop + winHeight) >= iHeight) {
                ++reviewList.PageNum;
                if (reviewList.PageNum < reviewList.MaxNum && reviewList.MaxNum != 0) {
                    reviewList.InitData();
                } else {
                    ShowMesaage(g_const_API_Message["100026"]);
                }
            }
        });
        //图片点击(大图)
        $(".img").on("click", function () {
            //为弹出大图轮播初始素材
            var html = "";
            $(this).find("img").each(function () {
                var imgSrc = $(this).attr("big");
                html += '<img src="' + imgSrc + '" alt=""/>';
            });
            //$("#").html(html);

            //自定义轮播事件启动
            //...
        });
        $(".go-back").on("click", function () {
            window.location.href = g_const_PageURL.Product_Detail + "?pid=" + reviewList.product_code + "&t=" + Math.random();
        });
    };
    //主方法初始化
    (reviewList.Init = function () {
        $(function () {
            reviewList.InitData();
            reviewList.InitEvent();
            slider.touchStart();
        });
    })();
})();

