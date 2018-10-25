var laypage = layui.laypage;
var pageButton = null; // 分页区分 1：立项 2：实施方案
var Commonurl = null;  //请求地址
var project = {}; // 审核列表参数
var typedata = null;  // 类型区分
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// TokenCode = GetQueryString('access_token');

var   accessToken = sessionStorage.getItem("access_token");

var loadingtip =  $(".loading-box");   // 加载中。。。

var xhsdk = new Xhsdk(appID,appSecretKey);


//设置网关
xhsdk.setGetaWayUrl(GetaWay_url);

//设置token
xhsdk.setToken(accessToken);

//设置类型
xhsdk.setReqType("app");

xhsdk.setUserInfo(null);

//审核信息筛选
$("#audit_btn button").click(function () {
    var _this = $(this).index();
    $("#audit_btn button ").eq(_this).addClass("active").siblings().removeClass("active");
    typedata = null;
    switch (_this){    // 数据筛选 typedata:  1 待审核  2 已审核  3 已驳回 4 全部
        case 0:
            typedata = 1;
            init(1, 10);
            break;
        case 1:
            typedata = 2;
            init(1, 10);
            break;
        case 2:
            typedata = 3;
            init(1, 10);
            break;
        case 3:
            typedata = 4;
            init(1, 10);
            break;
        default:
            console.log("类型错误")
    }

});

$(function () {
    typedata = 1;
    init(1, 10);

});

function init(current, size) {
        // 项目审核
        Commonurl = solution + "/xhWorkOrder/list";
        switch (typedata){      // 项目类型审核参数  1 待审核  2 已审核  3 已驳回  4 全部
            case 1:
                project = {};
                project.query = {"auditStatus": "1"};
                project.accessToken = accessToken;
                project.page = {"current": current, "size": size};
                break;
            case 2:
                project = {};
                project.query = {"auditStatus": "2"};
                project.accessToken = accessToken;
                project.page = {"current": current, "size": size};
                break;
            case 3:
                project = {};
                project.query = {"auditStatus": "3"};
                project.accessToken = accessToken;
                project.page = {"current": current, "size": size};
                break;
            case 4:
                project = {};
                project.query = {};
                project.accessToken = accessToken;
                project.page = {"current": current, "size": size};
                break;
            default:
                project = {};
                project.query = {};
                project.accessToken = accessToken;
                project.page = {"current": current, "size": size};
        }


    loadingtip.show();
    xhsdk.ajax({
        type: "post",
        url:Commonurl,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(project),
        success: function (res) {
            // console.log(res)
            if(res.errorCode==405){
                layer.msg("请重新登录！");
                return
            }
            if (res.code == 200) {

                var datalist = res.data.records;

                var total = res.data.total;
                var pagecur = res.data.current;
                auditData(datalist);
                laypage.render({
                    elem: "page-button2",
                    count: Math.ceil(total),
                    limit: size,
                    groups: total,
                    layout: ['count', 'prev', 'page', 'next', 'skip'],
                    curr: pagecur, //当前页,
                    jump: function (obj, first) {                                //触发分页后的回调
                        if (!first) {
                            init(obj.curr, size)
                            //     switch (typedata){      // 项目类型审核参数  1 待审核  2 已审核  3 已驳回
                            //         case 1:
                            //             project.query = {"auditStatus": "1"};
                            //             project.accessToken = accessToken;
                            //             project.page = {"current": obj.curr, "size": size};
                            //             break;
                            //         case 2:
                            //             project.query = {"auditStatus": "2"};
                            //             project.accessToken = accessToken;
                            //             project.page = {"current": obj.curr, "size": size};
                            //             break;
                            //         case 3:
                            //             project.query = {"auditStatus": "3"};
                            //             project.accessToken = accessToken;
                            //             project.page = {"current": obj.curr, "size": size};
                            //             break;
                            //         default:
                            //             project.query = {};
                            //             project.accessToken = accessToken;
                            //             project.page = {"current": obj.curr, "size": size};
                            //     }
                            //
                            // loadingtip.show();
                            // xhsdk.ajax({
                            //     type: "post",
                            //     url: Commonurl,
                            //     contentType: "application/json",
                            //     dataType: "json",
                            //     data: JSON.stringify(project),
                            //     success: function (res) {
                            //         if (res.code == 200) {
                            //             loadingtip.hide();
                            //             var datalist = res.data.records;
                            //                 auditData(datalist);
                            //         } else {
                            //             layer.msg("请求出现错误!!");
                            //             loadingtip.hide();
                            //         }
                            //     },
                            //     error: function (msg) {
                            //         loadingtip.hide();
                            //         layer.msg("请求出现错误!!");
                            //         console.log("Error:", msg);
                            //     }
                            // });
                        }

                    }
                })
            } else {
                layer.msg("请求出现错误!!");
                loadingtip.hide();
            }
        },
        complete: function () {
            $(".loading-box").hide()


        },
        error: function (msg) {
            loadingtip.hide();
            layer.msg("请求出现错误!!");
            console.log("Error:", msg);
        }
    });

}




// 审核数据渲染
function auditData(data) {

    $(".project-implem").empty();
    $(".itemCon").empty();
    for (var i = 0; i < data.length; i++) {

        var status = data[i].auditStatus;             // 状态（0草稿 1审核中 2通过 3驳回 4下线 5删除）

        var ItemType = data[i].type;                  // 工单类型（ 1 项目立项 2 项目实施方案）

        var solutionStage = data[i].auditStage;        // 审核阶段

        var typeTXT = "";                             // 类型名称

        var statusText = "";                          // 状态名称

        // var solutionStageTxt = "";                     // 审核人

        if(ItemType==1){

            typeTXT = "项目立项"

        } else{

            typeTXT = "项目实施方案"

        }

        // switch (solutionStage){
        //     case "0":
        //         solutionStageTxt = '无';
        //
        //         break;
        //     case "1":
        //         solutionStageTxt = "建设单位科技管理责任人";
        //         break;
        //     case "2":
        //         solutionStageTxt = "建设单位科技管理负责人";
        //         break;
        //     case "5":
        //         solutionStageTxt = "科信委立项审核";
        //         break;
        //     case "3":
        //         solutionStageTxt = "平台审核组";
        //         break;
        //     case "4":
        //         solutionStageTxt = "市局科信委";
        //         break;
        //     default:
        //         solutionStageTxt = '-';
        // }


        switch (status) {
            case "0":
                statusText = '<span style="color:#b5b5b5">已过期</span>';
                break;
            case "1":
                statusText = '<span style="color: #ccb75f;">待审核</span>';
                break;
            case "2":
                statusText = '<span style="color:#2dca33">已审核</span>';
                break;
            case "3":
                statusText = '<span style="color:#CCCCCC">驳回</span>';
                break;
            case "4":
                statusText = '<span style="color:#b5b5b5">下线</span>';
                break;
            case "5":
                statusText = '删除';
                break;
            default:
                statusText = '-';
        }




        var tablehtml = '<tr>' +
            '<td>' + (i+1) + ' </td>' +
            '<td>' + typeTXT + ' </td>' +
            '<td>' + data[i].projectName + '</td>' +
            '<td>' + data[i].projectCode + '</td>' +
            '<td>' + data[i].version + '</td>' +
            '<td><i></i><span>' + statusText + '</span></td>'+
            '<td>'+data[i].applyName+'</td>'+
            '<td>'+data[i].auditName+'</td>'+
            '<td>'+data[i].applyTime+'</td>'+
            '<td data-solutionid="'+data[i].solutionId+ '" data-status="'+data[i].auditStatus+'"   data-id="'+data[i].projectId+'" data-auditstatus="'+data[i].auditStage+'" data-applyBy="'+data[i].applyBy+'"  data-type="'+data[i].type+'"  data-applyname="'+data[i].applyName+'" onclick="itemaudit(this)" class="destail-button">详情</td>' +
            '</tr>';
        $(tablehtml).appendTo('.project-implem');

    }
}


// 打开项目审核详情
function itemaudit(_this) {

    var projectType = $(_this).data("type");                   // 项目类型
    var projectID = $(_this).data("id");                       // 项目ID
    var moduleid = $(_this).data("solutionid");                // 实施方案id
    var status = $(_this).data("status");                     // 项目状态
    var solutionstage = $(_this).data("auditstatus");         // 审核人权限状态
    var applyName = $(_this).data("applyname");               // 提交人姓名

    if(projectType==1){                                  // 工单类型（1项目立项 2项目实施方案）

        layer.open({
            type: 2,
            title: '项目立项审核',
            shadeClose: true,
            area: ['100%', '100%'],
            content: '../projectProgramme_Audit/projectProgramme_Audit.html?deatailId=' + projectID+"&status="+status+"&TokenCode="+accessToken,
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                body.find("#applyName").val(applyName);
            }
        });

    }else{

        layer.open({
            type: 2,
            title: '项目实施审核',
            shadeClose: true,
            area: ['100%', '100%'],
            content: '../projectAudit_destail/projectAudit_destail.html?moduleid=' + moduleid+"&status="+status+"&projectID="+projectID+"&TokenCode="+accessToken+"&solutionstage="+solutionstage,
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                var applyBy = $(_this).data("applyBy");                 // 申请人
                body.find(".applyBy").val(applyBy);
            }
        });

    }
}


//格式化时间
function add0(m){return m<10?'0'+m:m }
function formatTime(shijianchuo){
    //shijianchuo是整数，否则要parseInt转换
    var time = new Date(shijianchuo);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y+'-'+add0(m)+'-'+add0(d)+ ' '+ add0(h) +':'+add0(mm)+':'+add0(s);
}