
var layer = layui.layer;
var form = layui.form;

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
var TokenCode = GetQueryString('TokenCode');

var xhsdk = new Xhsdk(appID,appSecretKey);

//设置网关
xhsdk.setGetaWayUrl(GetaWay_url);

//设置token
xhsdk.setToken(TokenCode);

//设置类型
xhsdk.setReqType("app");

xhsdk.setUserInfo(null);

var moduleId = GetQueryString('moduleId'); // 实施方案ID

var flag = GetQueryString('flag'); // 区分是编辑还是新增(1新增2编辑)

var help = GetQueryString('help'); // 帮助

// if(help==1){
//     $(".sumbit-button").remove();
//     var infoJson = {
//         "query":{
//             "accessToken":accessToken,
//             "type":1
//         }
//     }
//     xhsdk.ajax({
//         type: "post",
//         url: solution + "/demanalysis/find",
//         contentType: "application/json",
//         dataType: "json",
//         data: JSON.stringify(infoJson),
//         success: function (res) {
//             if (res.code==200) {
//                 $("#functionalRoleAnalysis").children("textarea").val(res.data.functionalRoleanalysis);
//                 $("#businessRequirements").children("textarea").val(res.data.businessRequirements);
//                 $("#dataIntegration").children("textarea").val(res.data.dataIntegration);
//             } else {
//                 layer.msg(res.data)
//             }
//         },
//         error: function (msg) {
//             layer.msg("请求出现错误!!");
//         }
//     });
// }




