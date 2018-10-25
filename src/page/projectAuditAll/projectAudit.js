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

TokenCode = sessionStorage.getItem("access_token");

var loadingtip =  $(".loading-box");   // 加载中。。。

var xhsdk = new Xhsdk(appID,appSecretKey);


//设置网关
xhsdk.setGetaWayUrl(GetaWay_url);

//设置token
xhsdk.setToken(TokenCode);

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
            init(1, 10, 2);
            break;
        case 1:
            typedata = 2;
            init(1, 10, 2);
            break;
        case 2:
            typedata = 3;
            init(1, 10, 2);
            break;
        case 3:
            typedata = 4;
            init(1, 10, 2);
            break;
        default:
            console.log("类型错误")
    }

});




// 导航列表
$(".ProgrammeList").on('click', 'li', function () {

    var _this = $(this).index();
    $(this).addClass("layui-this").siblings().removeClass("layui-this");
    $(".layui-col-md10 .table-box ").eq(_this).css("display", "block").siblings().css("display", "none");


    if (_this == 0) {           // 1 项目管理  2 项目审核列表
        project = {};
        init(1, 10, 1);         //  (页码,显示页数,区分)

    }else{
        project = {};
        typedata = 1;
        init(1,10,2);
    }

});

$(function () {
    init(1, 10, 1);
});


function init(current, size, page) {

    if (page == 1) {

        project = {};
        pageButton = "page-button";
        project.query = {"projectName_LIKE":""};
        project.accessToken = accessToken;
        project.page = { "current": current,"size": size};
        Commonurl = solution+"/projectinfo/list";

    } else {
        // 项目审核
        project = {};
        pageButton = "page-button2";
        Commonurl = solution + "/xhWorkOrder/list";
        project.query = {};
        project.accessToken = accessToken;
        project.page = {"current": current, "size": size};

        switch (typedata){      // 项目类型审核参数  1 待审核  2 已审核  3 已驳回 4 全部
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
            if(res.errorCode==403){
                layer.msg(res.msg);
                return
            }

            if (res.code == 200) {

                var datalist = res.data.records;
                var total = res.data.total;
                var pagecur = res.data.current;
                // if (total <= 10) {
                //     $("#page-button").hide();
                //     $("#page-button2").hide();
                //
                // } else {
                //     $("#page-button").show();
                //     $("#page-button2").show();
                //
                // }
                if(page==1){
                    renderData(datalist);
                }else{
                    auditData(datalist);
                }
                laypage.render({
                    elem: pageButton,
                    count: Math.ceil(total),
                    limit: size,
                    groups: total,
                    layout: ['count', 'prev', 'page', 'next', 'skip'],
                    curr: pagecur, //当前页,
                    jump: function (obj, first) {                                //触发分页后的回调
                        if (!first) {
                            if(page==1){
                                Commonurl = solution+"/projectinfo/list";
                                project = {
                                    "accessToken":accessToken,
                                    "page": {
                                        "current": obj.curr,
                                        "size": size
                                    }
                                };

                            }else{

                                Commonurl = solution + "/xhWorkOrder/list";
                                switch (typedata){      // 项目类型审核参数  1 待审核  2 已审核  3 已驳回
                                    case 1:
                                        project.query = {"auditStatus": "1"};
                                        project.accessToken = accessToken;
                                        project.page = {"current": obj.curr, "size": size};
                                        break;
                                    case 2:
                                        project.query = {"auditStatus": "2"};
                                        project.accessToken = accessToken;
                                        project.page = {"current": obj.curr, "size": size};
                                        break;
                                    case 3:
                                        project.query = {"auditStatus": "3"};
                                        project.accessToken = accessToken;
                                        project.page = {"current": obj.curr, "size": size};
                                        break;
                                    default:
                                        project.query = {};
                                        project.accessToken = accessToken;
                                        project.page = {"current": obj.curr, "size": size};
                                }


                                // project.query = {};
                                // project.accessToken = accessToken;
                                // project.page = { "current": obj.curr,"size": size};
                            }
                            loadingtip.show();
                            xhsdk.ajax({
                                type: "post",
                                url: Commonurl,
                                contentType: "application/json",
                                dataType: "json",
                                data: JSON.stringify(project),
                                success: function (res) {
                                    console.log(res)
                                    if (res.code == 200) {
                                        loadingtip.hide();
                                        var datalist = res.data.records;
                                        if(page==1){
                                            renderData(datalist);
                                        }else{
                                            auditData(datalist);
                                        }
                                    } else {
                                        layer.msg("请求出现错误!!");
                                        loadingtip.hide();
                                    }
                                },
                                error: function (msg) {
                                    loadingtip.hide();
                                    layer.msg("请求出现错误!!");
                                    console.log("Error:", msg);
                                }
                            });
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


//项目管理
function renderData(data) {
    $(".itemCon").empty();
    if(data==undefined){
        layer.msg("暂无数据");
        return false
    }

    for(var i=0;i<data.length;i++){
        var status = data[i].auditStatus;        //状态（0草稿 1审核中 2通过 3驳回 4下线 5删除）
        var statusText = "";
        // var createTime = new Date().Format(data[i].createTime);
        var htmlbox = "";
        if(status==0||status==3){
            htmlbox = '<a onclick="editproject(this)" data-id="'+data[i].id+'" data-status="'+data[i].auditStatus+'" data-name="'+data[i].projectName+'"><i class="iconfont icon-bianji"></i></a>'+
                '<a href="#" data-id="'+data[i].id+'" data-status="'+data[i].auditStatus+'" onclick="Itemdetails(this)" class="destail-button"><i class="iconfont icon-chakan"></i></a>';
        }else if(status==2||status==1){
            htmlbox = '<a href="#" data-id="'+data[i].id+'" data-status="'+data[i].auditStatus+'" onclick="Itemdetails(this)" class="destail-button"><i class="iconfont icon-chakan"></i></a>';
        }
        switch (status){
            case 0:
                statusText = '草稿';
                break;
            case 1:
                statusText = '<span style="color: #cc940b;">审核中</span>';
                break;
            case 2:
                statusText = '<span style="color:#15ca15">通过</span>';
                break;
            case 3:
                statusText = '<span style="color:#CCCCCC">驳回</span>';
                break;
            case 4:
                statusText = '下线';
                break;
            case 5:
                statusText =  '删除';
                break;
            default:
                statusText = '-';
        }
        var tablehtml = '<tr>' +
            '<td>'+data[i].projectCode+'</td>' +
            '<td>'+data[i].projectName+'</td>' +
            '<td>1.0</td>' +
            '<td>'+data[i].buildUnitName+'</td>' +
            '<td>'+data[i].buildUnitLeaderName+'</td>' +
            '<td  class="status-btn" data-status="'+data[i].auditStatus+'" onclick="search_result(this)"><i></i><span>'+statusText+'</span></td>'+
            '<td><div class="show-box">'+htmlbox+'</div></td></tr>';
        $(tablehtml).appendTo('.itemCon');
    }
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

        var solutionStageTxt = "";                     // 审核人

        if(ItemType==1){

            typeTXT = "项目立项"

        } else{

            typeTXT = "项目实施方案"

        }

        switch (solutionStage){
            case "0":
                solutionStageTxt = '无';

                break;
            case "1":
                solutionStageTxt = "建设单位科技管理责任人";
                break;
            case "2":
                solutionStageTxt = "建设单位科技管理负责人";
                break;
            case "5":
                solutionStageTxt = "科信委立项审核";
                break;
            case "3":
                solutionStageTxt = "平台审核组";
                break;
            case "4":
                solutionStageTxt = "市局科信委";
                break;
            default:
                solutionStageTxt = '-';
        }


        switch (status) {
            case "0":
                statusText = '草稿';
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
            content: '../projectProgramme_Audit/projectProgramme_Audit.html?deatailId=' + projectID+"&status="+status+"&TokenCode="+TokenCode,
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
            content: '../projectAudit_destail/projectAudit_destail.html?moduleid=' + moduleid+"&status="+status+"&projectID="+projectID+"&TokenCode="+TokenCode+"&solutionstage="+solutionstage,
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                var applyBy = $(_this).data("applyBy");                 // 申请人

                body.find(".applyBy").val(applyBy);
            }
        });

    }
}



//
// // 打开项目立项详情
// function Itemdetails(_this) {
//     var deatailId = $(_this).data("id");    // 项目ID
//     var status = $(_this).data("status");   // 项目状态
//     projectName = $(_this).parent().find("td").eq(1).text();
//     layer.open({
//         type: 2,
//         title: '项目详情审核',
//         shadeClose: true,
//         area: ['100%', '100%'],
//         content: '../projectProgramme_Audit/projectProgramme_Audit.html?deatailId=' + deatailId+"&status="+status+"&TokenCode="+TokenCode,
//         success: function (layero, index) {
//             var body = layer.getChildFrame('body', index);
//         }
//     });
// }





//打开项目管理详情
function Itemdetails(_this) {
    var deatailId = $(_this).data("id");    // 项目ID
    var status = $(_this).data("status");   // 项目状态
    projectName = $(_this).parent().find("td").eq(3).text();

    layer.open({
        type: 2,
        title: '项目详情',
        shadeClose: true,
        area: ['100%', '100%'],
        content: '../../page/projectProgramme/projectProgramme.html?deatailId=' + deatailId+"&status="+status+"&TokenCode="+TokenCode,
        //  content: '../projectProgramme_Audit/projectProgramme_Audit.html?deatailId=' + deatailId,
        success: function(layero, index){
            var body = layer.getChildFrame('body', index);
        }
    });

}


//修改项目
function editproject(_this) {
    var deatailId = $(_this).data("id");    // 项目ID
    var status = $(_this).data("status");   // 项目状态
    projectName = $(_this).data("name");
    // console.log(projectName)
    layer.open({
        type: 2,
        title: '修改项目',
        shadeClose: true,
        area: ['100%', '100%'],
        content: '../../page/projectApply/projectApply.html?deatailId='+deatailId+'&tag=2'+"&status="+status+"&TokenCode="+TokenCode
    });
}

//添加项目
$("#add-item").click(function () {
    layer.open({
        anim: 5,
        maxmin: true,
        type: 2,
        skin: 'layui-layer-molv',
        title: '添加项目',
        shadeClose: true,
        area: ['100%', '100%'],
        content: './page/projectApply/projectApply.html?tag=1'+"&TokenCode="+TokenCode
    });
});

//查看项目进度
function search_result(_this) {
    var statusID = $(_this).data("status");
    layer.open({
        type: 2,
        title: '项目进度',
        shadeClose: true,
        area: ['100%', '100%'],
        content: './page/pLogisticsTracking/pLogisticsTracking.html?status='+statusID+"&TokenCode="+TokenCode
    });
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