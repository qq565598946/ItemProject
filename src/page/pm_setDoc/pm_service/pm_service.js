var element = layui.element;
var layer = layui.layer;
var form = layui.form;
var laypage = layui.laypage; //分页
var upload = layui.upload; //文件上传
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

$(function () {
    // service_zy();
});

var moduleId = GetQueryString('moduleId'); //实施方案ID

var flag = GetQueryString('flag');

var editserviceID = GetQueryString('editserviceID'); // 微服务修改ID

var help = GetQueryString('help'); // 帮助页面

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
//         url: solution + "/microservice/find",
//         contentType: "application/json",
//         dataType: "json",
//         data: JSON.stringify(infoJson),
//         success: function (res) {
//             if (res.code==200) {
//                 $("#serviceDesign").children("textarea").text(res.data.serviceDesign);
//                 $(".business ul").append(res.data.basicService);
//                 $(".technical ul").append(res.data.generalService);
//             } else {
//                 layer.msg(res.data)
//             }
//         },
//         error: function (msg) {
//             layer.msg("请求出现错误!!");
//                 }
//     });
// }



var num = null; // 2通用业务服务(多选) 3 基础技术服务(多选)

//选择服务
function addservice(flag) {

    if (flag == 2) {

        layer.open({
            type: 2,
            title: '添加依赖的服务',
            shadeClose: true,
            shade: [0.5, '#000'],
            anim: 0,
            maxmin: true, //开启最大化最小化按钮
            area: ['800px', '600px'],
            content: './choseRelySer/choseRelySer.html?flag=' + flag
        });

    } else {

        layer.open({
            type: 2,
            title: '添加依赖的服务',
            shadeClose: true,
            shade: [0.5, '#000'],
            anim: 0,
            maxmin: true, //开启最大化最小化按钮
            area: ['800px', '600px'],
            content: './choseRelySer/choseRelySer.html?flag=' + flag
        });

    }

}





