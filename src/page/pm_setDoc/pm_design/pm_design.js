
var layer = layui.layer;
var form = layui.form;
var upload = layui.upload; //文件上传
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

var moduleId = GetQueryString('moduleId'); //实施方案ID

var flag = GetQueryString('flag'); //实施方案ID

var help = GetQueryString('help'); // 帮助

// if(help==1){
//
//     $(".sumbit-button").remove();
//
//     $("#uploadIMG").remove();
//
//     var infoJson = {
//         "query":{
//             "accessToken":accessToken,
//             "type":1
//         }
//     };
//     xhsdk.ajax({
//         type: "post",
//         url: solution + "/archidesign/find",
//         contentType: "application/json",
//         dataType: "json",
//         data: JSON.stringify(infoJson),
//         success: function (res) {
//             if (res.code==200) {
//                 $("#frameworkdesign").children("textarea").val(res.data.frameworkDesign);
//                 $("#principlesroutes").children("textarea").val(res.data.principlesRoutes);
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



