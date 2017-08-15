/*成功码 商户号，金额，兑换码，唯一兑换标志（对卡券有效）0:不唯一 1：唯一，是否活动兑换 0：否 1：是*/
var act_Exchange_Code = [
    ["jygw", "30", "摇一摇1,摇一摇2,摇一摇3,摇一摇4,摇一摇5,摇一摇6,摇一摇7,摇一摇8","1","0"],
    ["wy", "30", "微摇", "0", "0"],
    ["xzq", "20", "新掌趣1", "1", "0"],
    ["xzq", "", "新掌趣2", "1", "0"],
    ["xzqsd", "", "新掌趣2", "1", "0"],
    ["xzqjs", "", "新掌趣2", "1", "0"]
    ["ahmyz", "20", "芈月传", "1", "0"],
    ["anmyzw", "", "芈月传", "1", "0"],
    ["wy", "", "微信摇", "0", "0"],
    ["wyt8", "", "微信摇", "0", "0"],
    ["wyapp", "", "摇微信", "0", "0"],
    ["wyt8app", "", "摇微信", "0", "0"],
];
/*兑换后的跳转地址 商户号，微信跳转代码，跳转地址附加参数，金额，跳转页面*/
var act_Exchange_URL = [
    ["jygw", "jygw", "", "30", "/tvlive.html"],
    ["wy", "wy", "", "30", "/index.html"],
    ["xzq", "xzq1", "&id=HJY151207100011", "20", "/Sale/BrandPreferenceDetail.html"],
    ["xzq", "xzq2", "", "", "/index.html"],
    ["xzqsd", "xzqsd", "", "", "/index.html"],
    ["xzqjs", "xzqsd", "", "", "/index.html"],
    ["ahmyz", "ahmyz", "&id=HJY151214100002", "20", "/Sale/BrandPreferenceDetail.html"],
    ["anmyzw", "anmyzw", "&id=HJY151214100002", "", "/Sale/BrandPreferenceDetail.html"],
    ["wy", "wy", "", "", "/index.html"],
    ["wyt8", "wyt8", "", "", "/index.html"],
    ["wyapp", "wyapp", "", "", "/index.html"],
    ["wyt8app", "wyt8app", "", "", "/index.html"],
];