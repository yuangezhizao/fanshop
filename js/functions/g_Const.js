/*商户活动下载APP提示语JS*/
var merchant_act_js = "http://tj.ichsy.com/UpImg/jyhshop/merchant_act.js";

/*上传图片后前端访问文件服务器图片域名*/
var g_const_pic_ym = "http://fan.test.lacues.cn";

/*优惠券跳转类型*/
var g_const_coupon_actionType = {
    /*商品详情页*/"PRODUCTDETAIL": "4497471600280001",
    /*wap页*/"WAP": "4497471600280002"
};

/*用户类型*/
var g_const_buyerType = {
    /*注册会员*/"REGMEMBER": "4497469400050002",
    /*内购会员*/"SELFMEMBER": "4497469400050001"
};

/*成功码*/
var g_const_Success_Code = 1;
/*内部错误码*/
var g_const_Error_Code = {
    "UnLogin": "999",
    "NoAddress": "1000",
};
/*内部接口成功码*/
var g_const_Success_Code_IN = 0;

/*是否被收藏*/
var g_const_collectionProduct = {
    /*已收藏*/"YES": 1,
    /*未收藏*/"NO": 0
};

/*是否需要api_token*/
var g_const_api_token = {
    /*需要发送*/"Wanted": "1",
    /*不需要发送*/"Unwanted": ""
};
/*是否*/
var g_const_YesOrNo = {
    /*是*/"YES": 1,
    /*否*/"NO": 0
}
var g_const_seconds = 1000;
var g_const_minutes = g_const_seconds * 60;
var g_const_hours = g_const_minutes * 60;
var g_const_days = g_const_hours * 24;
var g_const_years = g_const_days * 365;
/*模板替换正则*/
var g_const_regex_template = /(?:\{\{)([a-zA-z][^\s\}]+)(?:\}\})/g;

/*LocalStorage名称定义*/
var g_const_localStorage = {
    /*购物车精简版*/
    "Cart": "Cart",
    /*立即购买商品列表*/
    "ImmediatelyBuy": "ImmediatelyBuy",
    /*订单确认(提交的购物列表)*/
    "OrderConfirm": "OrderConfirm",
    /*订单确认(提交的购物价格)*/
    "OrderPrice": "OrderPrice",
    /*立即购买的商品属性*/
    "GoodsInfo": "GoodsInfo",
    /*订单类型*/
    "OrderType": "OrderType",
    /*发票*/
    "FaPiao": "FaPiao",
    /*发票内容*/
    "FaPiaoNR": "FaPiaoNR",
    /*优惠券*/
    "CouponCodes": "CouponCodes",
    /*返回地址*/
    "BackURL": "BackURL",
    /*返回地址列表*/
    "BackURLList": "BackURLList",
    /*指定配置的返回地址*/
    "PageUrlConfig": "PageUrlConfig",
    /*页面路径*/
    "PagePathList": "PagePathList",
    /*购物车完整版*/
    "CartFull": "CartFull",
    /*浏览历史*/
    "History": "History",
    /*新注册用户标志*/
    "IsnewReg": "IsnewReg",
    /*优惠头条信息*/
    "CartSalesAdv": "CartSalesAdv",

    ///*来源和时间*/
    //"ScrollTime": "[]",

    /*地址三级联动的缓存*/
    "StoreDistrict": "StoreDistrict",
    //"JSAPI_Ticket": "JSAPI_Ticket",
    //"JSAPI_Access_token": "JSAPI_Access_token",
    "OrderAddress": "OrderAddress",
    /*限时抢购提醒商品缓存*/
    "FlashActive": "FlashActive",
    /*推广来源ID*/
    "OrderFrom": "OrderFrom",
    /*推广来源参数*/
    "OrderFromParam": "OrderFromParam",
    /*扫码购产品ID*/
    "SMG_ProductID": "SMG_ProductID",
    /*登陆会员信息*/
    "Member": "Member",//{Member:{"phone":"","uid":"","accounttype":0}}
    /*卡券ID*/
    "Card_Key": "Card_Key",
    //用户在商品详情页选择默认收货城市,例如：{cityID : "110100",cityName : "北京市"}
    "DefaultCity": "DefaultCity",
    /*推广来源时间*/
    "OrderFromTime": "OrderFromTime",
    /*推广来源url*/
    "OrderFromRefer": "OrderFromRefer",
    /*多麦推广来源url失效时间*/
    "Expires_duomai": "Expires_duomai",
    /*用户归属地*/
    "MemberClient": "MemberClient",
};
/*账号绑定类型*/
var g_const_accounttype = {
    /*微信*/
    WeiXin: 13,
    /*微博*/
    WeiBo: 12,
    /*QQ*/
    QQ: 11,
    /*支付宝*/
    AliPay: 15,
    /*微公社*/
    ICHSY: 14
}

/*LocalStorage名称定义-- 结束*/

/*优惠卷状态[0：未使用；1：已使用；2：已过期]*/
var g_Coupon_Status = {
    /*未使用*/
    "CanUse": "0",
    /*已使用*/
    "Used": "1",
    /*已过期*/
    "Expired": "2"
};


/*订单类型定义*/
var g_order_Type = {
    /*试用订单*/
    "Try": "449715200003",
    /*闪购订单*/
    "Quick": "449715200004",
    /*普通订单*/
    "Common": "449715200005",
    /*内购订单*/
    "Inner": "449715200007",
    /*扫码购订单*/
    "QRCode": "449715200010",
};
/*订单类型定义-- 结束*/

/*订单来源定义*/
var g_order_Souce = {
    /*微信订单*/
    "Weixin": "449715190006",
    /*扫码购订单*/
    "QRCode": "449715190007",
};
/*订单类型定义-- 结束*/


/*支付类型定义*/
var g_pay_Type = {
    /*在线支付*/
    "Online": "449716200001",
    /*支付宝*/
    "Alipay": "449746280003",
    /*货到付*/
    "Getpay": "449716200002",
    /*微信支付*/
    "WXpay": "449746280005",
    GetPayTypeText: function (PayType) {
        switch (PayType) {
            case g_pay_Type.Alipay:
                return "支付宝";
            case g_pay_Type.WXpay:
                return "微信支付";
            case g_pay_Type.Online:
                return "在线支付";
            case g_pay_Type.Getpay:
                return "货到付款";
            default:
                return "";
        }
    }
};
/*支付类型定义-- 结束*/

/*发票类型*/
var g_const_bill_Type = {
    /*普通发票*/
    "Normal": "449746310001",
    /*增值税发票*/
    "ZengZhi": "449746310002",
    /*不开发票*/
    "NotNeed": "0"
};
/*默认产品图片*/
var g_goods_Pic = "http://wap-family.syserver.ichsy.com/cfamily/resources/cfamily/zzz_js/monthSales_bg.png";
/*默认品牌特惠图片*/
var g_brand_Pic = "http://wap-family.syserver.ichsy.com/cfamily/resources/cfamily/zzz_js/bg.png";
/*默认会员头像图片*/
var g_member_Pic = "/img/w_img/portrait.png";
/*栏目类型*/
var g_const_columnType = {
    /*轮播广告*/
    "swipeSlide": "4497471600010001",
    /*导航*/
    "Navigation": "4497471600010004",
    /*两栏广告*/
    "TwoADs": "4497471600010003",
    /*闪购*/
    "FastBuy": "4497471600010011",
    /*通屏广告(一栏广告)*/
    "CommonAD": "4497471600010002",
    /*一栏推荐*/
    "RecommendONE": "4497471600010005",
    /*右两栏推荐*/
    "RecommendRightTwo": "4497471600010006",
    /*左两栏推荐*/
    "RecommendLeftTwo": "4497471600010007",
    /*商品推荐*/
    "RecommendProduct": "4497471600010008",
    /*两栏多行推荐(热门市场)*/
    "RecommendHot": "4497471600010009",
    /*TV直播*/
    "TVLive": "4497471600010010",
    //通知模版
    Notify: "4497471600010012",
    //三栏两行推荐 
    Recommend3L2H: "4497471600010013",
    //两栏两行推荐  
    Recommend2L2H: "4497471600010014",
    //楼层模板 
    Floor: "4497471600010015"
};
/*‘显示更多’链接类型*/
var g_const_showmoreLinktype = {
    /*超链接*/
    "URL": "4497471600020001",
    /*关键字搜索*/
    "KeyWordSearch": "4497471600020002",
    /*商品分类*/
    "ProductType": "4497471600020003",
    /*商品详情*/
    "ProductDetail": "4497471600020004",
    //显示浮层 
    ShowLayer: "4497471600020005",
    //抽奖
    Award: "4497471600020006",
    //396 显示首页H5弹层
    IndexH5: "4497471600020007"
};
/*是否显示更多*/
var g_const_isShowmore = {
    /*是*/
    "YES": "449746250001",
    /*否*/
    "NO": "449746250002",
    /*未知*/
    "Unknown": ""
};
/*阶梯价类型*/
var g_const_event_product_sortType = {
    /*时间(分钟)*/
    "Time": "4497473400010001",
    /*销量*/
    "SaleCount": "4497473400010002",
    /*活动商品*/
    "Other": ""
};
/*是否阶梯价*/
var g_const_event_product_priceIs = g_const_isShowmore;

/*订单状态编号
4497153900010001	下单成功-未付款
4497153900010002	下单成功-未发货
4497153900010003	已发货（待收货）
4497153900010004	已收货(目前系统中  已收货 就是 交易成功)
4497153900010005	交易成功
4497153900010006	交易失败(交易关闭)
*/
var g_const_orderStatus = {
    "DFK": "4497153900010001",
    "DFH": "4497153900010002",
    "DSH": "4497153900010003",
    "YSH": "4497153900010004",
    "JYCG": "4497153900010005",
    "JYSB": "4497153900010006"
};

var g_const_mobilecz_orderStatus = {
    "DZF": "DZF",//待付款
    "ZFCG": "ZFCG",//支付成功
    "DCZ": "DCZ",//待充值
    "CZCG": "CZCG",//充值成功
    "CZSB": "CZSB"//充值失败
};

/*支付宝支付地址*/
var g_Alipay_url = "http://api.test-dlq.ycp8.cn/cdlq/payOrder/";
/*惠家有webpay支付地址*/
var g_HJYWebPay_url = "http://api.test-dlq.ycp8.cn/cdlq/webPay/";
/*TV购物排序*/
var g_const_tvlive_sort = {
    /*正序*/
    "ASC": "0",
    /*倒序*/
    "DESC": "1"
}
;
/*商品状态*/
var g_const_productStatus = {
    /*上架*/"Common": "4497153900060002",
    /*抢光了*/"SaleOver": "4497471600050002"
};
/*最大历史记录数量*/
var g_const_MaxHistoryCount = 50;

/*活动类型类型*/
var g_const_ActivityType = {
    /*今日新品*/
    "Todaynew": "467703130008000100040001",
    /*品牌特惠*/
    "BrandPreference": "467703130008000100030001",
    /*海外购*/
    "ImportProduct": "467703130008000100090001",
};
/*活动类型类型*/
var g_const_ActivityName = {
    /*今日新品*/
    "Todaynew": "今日新品",
    /*品牌特惠*/
    "BrandPreference": "品牌特惠",
    /*海外购*/
    "ImportProduct": "海外购",
};
/*最大历史记录数量*/
var g_const_MaxScroll = 1000;

/*我的优惠卷查询类型类型*/
var g_const_couponLocation = {
    /*0代表未使用优惠券，*/
    "NoUse": "0",
    /*1代表历史优惠券*/
    "Used": "1",
};

/*跳转页面集合*/
var g_const_PageURL = {
    /*首页*/
    "Index": "/index.html",
    /*普通登录页*/
    "Login": "/Account/login.html",
    /*授权登陆发起页*/
    "OauthLogin": "/Account/OauthLogin.aspx",
    /*分类页*/
    "Category": "/Category.html",
    /*购物车*/
    "Cart": "/cart.html",

    /*查询页*/
    "Search": "/Search.html",

    /*注册页*/
    "Reg": "/Account/Register.html",
    /*手机登录页*/
    "PhoneLogin": "/Account/login_m.html",

    /*设定推荐人*/
    "Recom": "/Order/OrderRecom.html",
    /*支付成功页*/
    "OrderSuccess": "/Order/OrderSuccess.html",
    /*支付失败页*/
    "OrderFail": "/Order/OrderFail.html",
    /*订单确认页*/
    "OrderConfirm": "/order/OrderConfirm.html",
    //"OrderConfirm": "/OC.html",
    /*订单确认前置页*/
    "PreOrderConfirm": "/order/PreOrderConfirm.html",
    /*商品列表*/
    "Product_List": "/Product_List.html",
    /*商品详情*/
    "Product_Detail": "/Product_Detail.html",

    /*意见与反馈入口*/
    "Feedback_Index": "/Feedback_Index.html",
    /*提交意见与反馈*/
    "Feedback": "/Feedback.html",
    /*品牌特惠列表页*/
    "BrandPreferenceList": "/Sale/BrandPreferenceList.html",
    /*品牌特惠详情页*/
    "BrandPreferenceDetail": "/Sale/BrandPreferenceDetail.html",
    /*优惠卷页*/
    "Coupon_you": "/Coupon_you.html",
    /*编辑优惠券页*/
    "CouponCodes": "/Order/CouponCodes.html",
    /*微公社*/
    "Ichsy": "/Ichsy.html",



    /*账户中心*/
    "AccountIndex": "/Account/index.html",
    /*手机充值*/
    "MobileCZ": "/order/CZ.html",
    /*我的手机充值订单支付*/
    "MyMobileCZOrder_pay": "/order/CZ_Pay.html",
    /*手机充值列表*/
    "MobileCZList": "/Account/MyMobileCZ_Order_List.html",

    /*我的账户中心*/
    "MyAccount": "/Account/MyAccount.html",
    /*我的收藏*/
    "MyCollection": "/Account/MyCollection.html",
    /*我的浏览历史*/
    "MyViewHistory": "/Account/MyViewHistory.html",
    /*我的优惠券页*/
    "MyCoupon": "/Account/MyCoupon.html",
    /*兑换优惠券页*/
    "MyCoupon_DH": "/Account/MyCoupon_DH.html",
    /*我的昵称*/
    "MyNickName": "/Account/MyNickName.html",

    /*我的订单*/
    "MyOrder_List": "/Account/MyOrder_List.html",
    /*我的订单--订单详情*/
    "MyOrder_detail": "/Account/MyOrder_detail.html",
    /*我的订单--订单物流*/
    "MyOrder_List_ckwl": "/Account/MyOrder_List_ckwl.html",
    /*我的订单--订单支付*/
    "MyOrder_pay": "/order/MyOrder_pay.html",
    /*编辑收货地址*/
    "AddressEdit": "/Account/AddressEdit.html",
    /*收货地址列表*/
    "AddressList": "/Account/AddressList.html",
    /*重置密码*/
    "ResetPassword": "/Account/ResetPassword.html",
    /*发票*/
    "fapiao": "/Order/fapiao.html",
    /*软件许可及服务协议*/
    "xieyi": "/xy.html",
    /*优惠卷使用说明*/
    "shiyongshuoming": "/Coupon_shuoming.html",


    /*领取返现特权-操作*/
    "Lqfxtq_Op": "/LQFX/LQ/Step.html",
    /*领取返现特权-结果*/
    "Lqfxtq_Rs": "/LQFX/Down/Result.html",
    /*扫码购引导页面*/
    "SMG_Index": "/smg_v3/index.html",
    //评论发布页面
    "ReviewRelease": "/Review/ReviewRelease.html",
    //评论列表页面
    "ReviewList": "/Review/ReviewList.html",
    //满减活动页面
    "FullCut": "/Sale/FullCut.html",
    /*我的退款售后列表*/
    "MyTKSH_List": "/Account/MyTKSH_List.html",
    /*我的退款售后详情*/
    "MyTKSH_Detail": "/Account/MyTKSH_Detail.html",
    /*我的退款售后申请页*/
    "MyTKSH_SQ": "/Account/MyTKSH_SQ.html",
    /*售后填写物流信息页*/
    "MyTKSH_TXWL": "/Account/MyTKSH_TXWL.html",
    /*快速领取优惠券*/
    "Coupon_KSLQ": "/Account/Coupon_KSLQ.html",
    /*快速领取优惠券*/
    "Coupon_KSLQ_Mobile": "/Account/Coupon_KSLQ_Mobile.html",
    /*我的头像*/
    "MyAvatar": "/Account/MyAvatar.html",
    

};
/*接口提示信息集合 1 接口返回  9-接口返回错误 8-系统返回错误 7-页面提示错误*/
var g_const_API_Message = {
    "1": "操作成功",
    "934105101": "您还没有注册哦，请注册后再登录",
    "934105102": "账户号码和密码不匹配",
    "8801": "验证码错误",
    "8802": "验证码已过期或者不存在，请重新获取验证码",
    "8803": "验证码发送太频繁，请1小时后再试",
    "8804": "验证码请求太频繁，请稍后再试",
    "8805": "验证码输入错误次数过多，请重新获取验证码",
    "8806": "当日发送验证码已达上限，请明日再试",
    "8901": "您已是注册用户，请直接登录",
    "8902": "您已是注册用户",
    "8903": "图片验证码错误",
    "8904": "请输入图片验证码",
    "7001": "亲，堵车了，请稍后重试哦~",
    "7002": "注册成功.",
    "7003": "密码修改成功.",
    "7004": "评价成功",
    "7801": "已发送短信验证码",
    "7802": "请填写验证码",
    "7901": "请填写手机号码",
    "7902": "请填写正确的手机号码",
    "7903": "请输入密码",
    "7904": "请输入6-16位字符且不能包含空格",
    "100001": "您还没有登录或者已经超时",
    "100002": "系统繁忙,同步购物车失败,请稍后重试.",
    "100003": "收藏添加成功",
    "100004": "删除收藏成功",
    "100005": "地址信息保存成功",
    "100006": "默认地址设定成功",
    "100007": "请填写收货人姓名",
    "100009": "请选择区",
    "100010": "请填写详细地址",
    "100011": "收货人姓名请输入2-10个汉字",
    "100012": "详细地址字数需控制在5-40之间哦",
    "100013": "请输入优惠码",
    "100014": "您目前还没有优惠券.",
    "100015": "您还没有选择要使用的优惠券",
    "100016": "请您输入优惠券兑换码",
    "100017": "优惠券兑换成功",
    "100018": "请您选择发票类型和发票抬头",
    "100019": "请您填写公司名称",
    "100020": "已收到您的建议",
    "100021": "没有更多的猜你喜欢了",
    "100022": "读取猜你喜欢时系统繁忙,请稍后再试",
    "100023": "请填写登录手机号",
    "100024": "请填写登录密码",
    "100025": "登录成功",
    "100026": "没有更多数据了",
    "100027": "请选择要删除的商品",
    "100028": "您已取消本次微信支付，请选择其他方式支付.",
    "100029": "亲，堵车了，请稍后哦~",//"网络连接失败，请重新尝试.",
    "100030": "请填写收货人信息",
    "100031": "请选择支付类型",
    "100032": "推荐人手机号不能为空",
    "100033": "上级设定成功",
    "100034": "密码不能为空",
    "100035": "密码设定成功",
    "100036": "对不起,您选择的商品无货,请您重新选择.",
    "100037": "活动配置有误",
    "100038": "最多保留收货地址数量:",
    "100039": "已达到限购数量，看看其他的商品吧~",
    "100040": "为了保证账户安全，请尽快去“个人中心”设置密码哦~",
    "100041": "请选择省",
    "100042": "请选择市",
    "100043": "数据加载中",
    "100044": "密码格式为6-16不包含空格的字符",
    "100045": "推荐人手机号不能是本人",
    "100046": "已有上级，不能再次添加",
    "108903": "验证码已发至您的手机，马上就能享受返现特权啦！",
    "108904": "只差一步就能享受返现特权啦！",
    "107901": "请输入手机号",
    "107902": "请输入11位有效手机号",
    "107802": "请输入验证码",
    "106001": "海外购商品需要您的身份证！",
    "106002": "已有身份证信息不能删除！",
    "106003": "请您核对身份证信息！",
    "106004": "昵称提交成功！",
    "106005": "昵称不符合格式",
    "106006": "您还没有修改昵称哦！",
    "106007": "设置个性昵称",
    "106008": "请选择取消订单原因",
    "106009": "选择商品信息有误，请重新申请售后",
    "106010": "最多上传5张图片",
    "106011": "请输入正确的售后金额",
    "106012": "请选择售后原因",
    "106013": "请输入正确的售后数量",
    "106014": "请输入快递单号",
    "106015": "请选择快递公司",
    "106016": "提交物流信息成功",
    "106017": "领取成功",
    "106018": "缺少活动编码，不能领取优惠券",
    "106019": "没有活动内容",
    "106020": "申请售后成功",
    "106021": "头像提交成功！",

};

var g_const_BackUrlList = [];

/*页面跳转配置*/
var g_const_PagePathList = [];

/*跳转页面集合*/
var g_const_Phone = {
    /*售后电话*/
    "sh": "400-867-8210",
}

/*验证码倒计时*/
var g_const_ValidCodeTime = 59;
/*产品购买状态*/
var g_const_buyStatus = {
    /*允许购买*/
    YES: 1,
    /*活动未开始*/
    ActNotStart: 2,
    /*活动已结束*/
    ActIsEnd: 3,
    /*活动进行中,但是不可购买*/
    No: 4,
    /*其他状态*/
    Other: 5
};
/*微信分享类型*/
var g_const_wx_share_type = {
    /*音乐*/
    music: "music",
    /*视频*/
    video: "video",
    /*链接*/
    link: "link"
};
/*微信JSAPI接口*/
var g_const_wx_jsapi = {
    /*分享到朋友圈*/
    onMenuShareTimeline: "onMenuShareTimeline",
    /*分享给朋友*/
    onMenuShareAppMessage: "onMenuShareAppMessage",
    /*分享到QQ*/
    onMenuShareQQ: "onMenuShareQQ",
    /*分享到腾讯微博*/
    onMenuShareWeibo: "onMenuShareWeibo",
    /*分享到QQ空间*/
    onMenuShareQZone: "onMenuShareQZone",
    /*打开扫一扫*/
    scanQRCode: "scanQRCode",
    /*获取地理位置接口*/
    getLocation: "geoLocation"

};
/*微信JSAPI全部分享方法*/
var g_const_wx_AllShare = g_const_wx_jsapi.onMenuShareAppMessage + "," + g_const_wx_jsapi.onMenuShareQQ + "," + g_const_wx_jsapi.onMenuShareQZone + "," + g_const_wx_jsapi.onMenuShareTimeline + "," + g_const_wx_jsapi.onMenuShareWeibo;
/*品牌专题内容广告位置*/
var g_const_brandLocation = {
    /*头部*/
    Header: 1,
    /*尾部*/
    Footer: 2
};
/*商品状态*/
var g_const_EventProductType = {
    /*闪购*/"Flash": "20150701001",
    /*特价*/"Event": "20150701002"
};
/*订单渠道ID*/
var g_const_ChannelID = "449747430003";
//是否分享
var g_const_shareFlag = {
    YES: "449747110002",
    NO: "449747110001"
};
//分享默认值
var g_const_Share = {
    DefaultTitle: "饭好了",
    DefaultDesc: "饭好了",
    DefaultImage: g_goods_Pic
};
//展示平台
var g_const_viewType = {
    //客户端
    APP: "4497471600100001",
    //微信商城
    WXSHOP: "4497471600100002",
    //PC版
    PCWeb: "4497471600100003"
};
/*成功码*/
var g_const_Exchange_Code_ZHY = [
    ["30", "摇一摇1,摇一摇2,摇一摇3,摇一摇4,摇一摇5,摇一摇6,摇一摇7,摇一摇8"],
    ["20", "yaoyiyao1"],
    ["10", "yaoyiyao2"]
];

/*扫描购更新时间*/
var g_const_SMG_ChangeDate = "2016-5-9 19:00:00";
var g_const_SMG_EndDate = "2016-5-10 19:00:00";

var g_const_OrderConfirmRefer = ["product_detail", "cart", "preorderconfirm", "mobilechz_order", "myorder_list", "myorder_detail", "login", "login_m"];

var g_const_Merchant_Group_Android = "betagroup";
var g_const_Merchant_Group_Ios = "igroup";
var g_const_Merchant_MT = "mt";
//多麦
var g_const_Merchant_duomai = "duomai";


/*短信类型*/
var g_const_SMSType = [
    ["saveaddress", "1"],
    ["phonelogin", "2"],
    ["bindmobileandmobilereg", "3"],
    ["phoneregister", "4"],
    ["passwordreset", "5"],
    ["lqfxtq", "6"],
    ["freeusesq", "7"],
    ["couponcodeexchange_jygw", "9"],
    ["couponcodeexchange_xzq", "10"],
    ["couponcodeexchange_xzqsd", "11"],
    ["couponcodeexchange_xzqjs", "12"],
    ["couponcodeexchange_anmyzw", "13"],
    ["couponcodeexchange_ahmyz", "13"],
    ["couponcodeexchange_wy", "8"],
    ["couponcodeexchange_wyt8", "8"],
    ["couponcodeexchange_wyapp", "14"],
    ["couponcodeexchange_wyt8app", "14"],
];
/*短信图片验证码开[1]关[0]*/
var g_const_SMSPic_Flag = 1;
/*引导页 商户号，金额，兑换码，唯一兑换标志（对卡券有效）*/
var g_Exchange_Guide = [
    ["jygw", "客户端\"优惠券\"中输入<br>\"100\"立获100元购物红包", "1", ""],
    ["wy", "下载app 后输入<br>\"摇啊摇\"兑换30元优惠券", "0", "/Act151118/img/guide_yyy_2.png"],
    ["wyt8", "下载app 后输入<br>\"摇啊摇\"兑换30元优惠券", "0", "/Act151118/img/guide_yyy_2.png"],
    ["wyapp", "30元优惠券仅在app使用", "0", "/Act151118/img/guide_yyy_1.png"],
    ["wyt8app", "30元优惠券仅在app使用", "0", "/Act151118/img/guide_yyy_1.png"],
    ["xzq", "客户端“优惠券”中输入<br>\"惠买惠花\"立获30元红包", "1", "/img/w_img/guide_xzq.png"],
    ["xzqsd", "客户端“优惠券”中输入<br>\"惠买惠花\"立获30元红包", "1", "/img/w_img/guide_xzq.png"],
    ["xzqjs", "客户端“优惠券”中输入<br>\"惠买惠花\"立获30元红包", "1", "/img/w_img/guide_xzq.png"],
    ["anmyzw", "客户端“优惠券”中输入<br>\"领红包\"立获30元红包", "1", "/img/w_img/guide_anmyzw.png"],
    ["ahmyz", "客户端“优惠券”中输入<br>\"领红包\"立获30元红包", "1", "/img/w_img/guide_anmyzw.png"],
    ["adks", "", "1", ""],
    ["hjysms", "下载APP 输入<br>\"大礼包\"领取组合购物红包", "1", ""],
];
/*商户活动链接域名*/
var g_merchant_Act_Host = "http://tj.ichsy.com";
//活动类型
var g_const_Act_Event_Type = {
    //秒杀
    SecKill: "4497472600010001",
    //特价
    SpecialPrice: "4497472600010002",
    //拍卖
    Auction: "4497472600010003",
    //扫码购
    SMG: "4497472600010004",
    //闪购
    FastBuy: "4497472600010005",
    //内购
    Insourced: "4497472600010006",
    //TV专场
    TV: "4497472600010007",
    //满减
    ManJian: "4497472600010008",
};
var cdn_path = "";
//商品标签
var g_const_ProductLabel = {
    //生鲜
    Fresh: { name: "生鲜商品", value: "LB160108100002", picture: cdn_path + "/img/xxh_txbtn.png", spicture: cdn_path + "/img/icon_msg_fresh.png" },
    //TV商品
    TV: { name: "TV商品", value: "LB160108100003", picture: "", spicture: "" },
    //海外购商品
    OverSea: { name: "海外购商品", value: "LB160108100004", picture: cdn_path + "/img/hwg_txbtn.png", spicture: cdn_path + "/img/icon_msg_haiwaigou.png" },
    //查找
    find: function (ProductLabelValue) {
        for (var k in g_const_ProductLabel) {
            var pl = g_const_ProductLabel[k];
            if (pl.value == ProductLabelValue)
                return pl;
        }
        return null;
    },
    isOverSea: function (ProductLabelValue) {
        if (ProductLabelValue == g_const_ProductLabel.OverSea.value) {
            return true;
        }
        else {
            return false;
        }
    },
};
//操作标识
var g_const_operFlag = {
    //商品详情
    productdetail: "productdetail",
    //订单详情
    orderdetail: "orderdetail",
    //猜你喜欢
    maybelove: "maybelove",
    //支付成功
    paysuccess: "paysuccess"
}

/*售后订单状态编号
4497477800050001	退款中
4497477800050002	退款成功
4497477800050003	等待审核
4497477800050004	拒绝申请
4497477800050005	退换货中
4497477800050006	退货成功
4497477800050007	退货失败
4497477800050008	换货成功
4497477800050009	换货失败
4497477800050010	待完善物流
*/
var g_const_afterStatus = {
    "TKZ": "4497477800050001",
    "TKCG": "4497477800050002",
    "DDSH": "4497477800050003",
    "JUSQ": "4497477800050004",
    "THHZ": "4497477800050005",
    "THCG": "4497477800050006",
    "THSB": "4497477800050007",
    "HHCG": "4497477800050008",
    "HHSB": "4497477800050009",
    "DWSWL": "4497477800050010"
};
/*售后订单支持的按钮类型
4497477800080001	填写退换货物流
4497477800080002	取消订单
4497477800080003	付款
4497477800080004	取消发货
4497477800080005	查看物流
4497477800080006	电话退款
4497477800080007	确认收货
4497477800080008	售后
4497477800080009	评价晒单
4497477800080010	删除订单
4497477800080011	售后进度
*/
var g_const_afterButtonCode = {
    "TXTHKWL": "4497477800080001",
    "QXDD": "4497477800080002",
    "FK": "4497477800080003",
    "QXFH": "4497477800080004",
    "CKWL": "4497477800080005",
    "DHTH": "4497477800080006",
    "QRSH": "4497477800080007",
    "SH": "4497477800080008",
    "PJSD": "4497477800080009",
    "SCDD": "4497477800080010",
    "SHJD": "4497477800080011"
};
/*售后类型编号
4497477800030001-退货退款 
4497477800030002-仅退款 
4497477800030003-换货
*/
var g_const_afterReimburseType = {
    "THTK": "4497477800030001",
    "JTK": "4497477800030002",
    "HH": "4497477800030003"
};
/*售后是否收到货
4497476900040001收到 
4497476900040002 未收到
*/
var g_const_afterIsGetProduce = {
    "SD": "4497476900040001",
    "WSD": "4497476900040002"
};


/*售后订单详情身份
4497477800070001 客服 
4497477800070002 用户
*/
var g_const_AfterSaleInfo_identity = {
    "KF": "4497477800070001",
    "YH": "4497477800070002"
};
/*售后订单详情背景颜色
1 红色 
2 黄色 
3 白色
*/
var g_const_AfterSaleInfo_bgColor = {
    "RED": "4497477800100001",
    "YELLOW": "4497477800100002",
    "WHITE": "4497477800100003"
};
/*售后订单详情待完善物流信息
待完善物流信息：002 
其他 001
*/
var g_const_AfterSaleInfo_statusType = {
    "DWSWL": "002",
    "OTHER": "001"
};
/*售后是否过期
1：过期 
0：未过期
*/
var g_const_AfterOutDateFlag = {
    "GQ": "1",
    "WGQ": "0"
};

/*公告类型
4497477800010001 申请售后页
*/
var g_const_notice_show_place = {
    "SQSH": "4497477800010001"
};

/*模板类型
449747500001  轮播模版
449747500002  两栏两行模版
449747500003  一栏多行模版
449747500004  视频模板
449747500005  标题模板
449747500006  两栏广告
449747500007  优惠券(一行两栏)
449747500008  优惠券（一行一栏）
*/
var g_const_templeteType = {
    //轮播模版
    "LB": "449747500001",
    //两栏两行模版
    "LLLH": "449747500002",
    //一栏多行模版
    "YLDH": "449747500003",
    //视频模板
    "SP": "449747500004",
    //标题模板
    "BT": "449747500005",
    //两栏广告
    "LLGG": "449747500006",
    //优惠券(一行两栏)
    "YHJYHLL": "449747500007",
    //优惠券（一行一栏）
    "YHJYHYL": "449747500008"
};

//等待效果
//$(function () {
	try{
		//$('section,article,.nosearch').hide();
		var oDeg = 180;
		var timer;
		var flag = false;
		clearInterval(timer);
		$('#fan_rotate_logo').css('WebkitTransform', 'perspective(100px) rotateY(' + 90 + 'deg)');
		$('#fan_rotate_logo').animate({ opacity: '0.1' }, 100);
		setInterval(function () {
			if (flag) {
				$('#fan_rotate_logo').css('WebkitTransform', 'perspective(100px) rotateY(' + oDeg + 'deg)');
				$('#fan_rotate_logo').animate({ opacity: '0.1' });
				flag = false;
				oDeg += 90;
			} else {
				$('#fan_rotate_logo').css('WebkitTransform', 'perspective(100px) rotateY(' + oDeg + 'deg)');
				$('#fan_rotate_logo').animate({ opacity: '1' });
				flag = true;
				oDeg += 90;
			}
		}, 400)
	}
	catch(e){
		
	}
//})
