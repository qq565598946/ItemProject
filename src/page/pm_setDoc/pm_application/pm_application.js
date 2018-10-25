
var layer = layui.layer;
var form = layui.form;
var formSelects = layui.formSelects;
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

TokenCode = GetQueryString('TokenCode');

var xhsdk = new Xhsdk(appID,appSecretKey);

//设置网关
xhsdk.setGetaWayUrl(GetaWay_url);

//设置token
xhsdk.setToken(TokenCode);

//设置类型
xhsdk.setReqType("app");

xhsdk.setUserInfo(null);

var moduleId = GetQueryString('moduleId'); // 实施方案ID

var flag = GetQueryString('flag'); // 区分新增还是编辑(1新增2编辑)

var help = GetQueryString('help'); // 帮助

var appID = GetQueryString('appID'); // 修改当前数据ID




// if (help==1){
//     $(".sumbit-button").remove();
//     var infoJson = {
//         "query":{
//             "accessToken":accessToken,
//             "type":1
//         }
//     }
//     xhsdk.ajax({
//         type: "post",
//         url: solution + "/applicationdesign/find",
//         contentType: "application/json",
//         dataType: "json",
//         data: JSON.stringify(infoJson),
//         success: function (res) {
//             if (res.code==200) {
//                 $("#applicationOverview").children("textarea").val(res.data.applicationOverview);
//                 $("#applicationPlanning").children("textarea").val(res.data.applicationPlanning);
//                 $("#applyLogicdiagram").children("textarea").val(res.data.applyLogicdiagram);
//             } else {
//                 layer.msg(res.data)
//             }
//         },
//         error: function (msg) {
//             layer.msg("请求出现错误!!");
//         }
//     });
// }













