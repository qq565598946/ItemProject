var form = layui.form;

var laypage = layui.laypage; //分页
var indexloading; //加载中..

function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}


var accessToken = GetQueryString('TokenCode');

var xhsdk = new Xhsdk(appID,appSecretKey);

//设置网关
xhsdk.setGetaWayUrl(GetaWay_url);

//设置token
xhsdk.setToken(accessToken);

//设置类型
xhsdk.setReqType("app");

xhsdk.setUserInfo(null);

var deatailId = GetQueryString('deatailId'); //项目详情ID

var statusID =  GetQueryString('status');    //项目状态

if(statusID==0||statusID==3||statusID==1){               // 草稿和驳回和审核中状态不能添加实施方案  审核通过的才能添加
    $("#addsolutionBtn").empty();
}else{
    $("#addsolutionBtn").html('<button class="layui-btn layui-btn-normal  layui-btn-sm" id="add-item" onclick="solutionData()">添加</button>');
}


$(function () {

    detailsData();
    GetprojectID();
});

// 新增实施方案时获取实施方案id
var AddprojectID=null;
var versionCon = null;  // 实施方案版本
var upgrade = null; // 大于一的就是升级操作
function GetprojectID(){
    var idJson = {
        "accessToken": accessToken,
        "projectId":deatailId
    }
    xhsdk.ajax({
        type: "post",
        url: solution + "/solutioninfo/getDevelopLeader",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(idJson),
        success: function (res) {
            if (res.code == 200) {
                upgrade = res.data.version;
                // upgrade = 2;
                if(statusID==2){    // 判断项目立项审核通过才能升级

                    if(parseInt(upgrade)>1){
                        var oldid = res.data.oldSolutioninfoId; // 拿到上一个版本ID 进行升级操作
                        var  btnhtml = `<button class="layui-btn layui-btn-normal  layui-btn-sm" id="add-item" onclick="solutionData(this,3,'`+oldid+`')">升级</button>`
                        $("#addsolutionBtn").html(btnhtml);
                    }
                }
                AddprojectID = res.data.id;
                versionCon = res.data.version +".0";
                // sessionStorage.setItem("userName",res.data.userName); // 开发单位
                sessionStorage.setItem("userName",res.data.userName); // 开发负责人
                sessionStorage.setItem("userId",res.data.userId); // 开发负责人ID
                sessionStorage.setItem("deptCode",res.data.deptCode);
            } else {
                layer.msg(res.data);
            }
        },
        error: function (msg) {
            layer.msg("请求出现错误!!");
            console.log("Error:", msg);
        }
    });
}

//项目详情
function detailsData() {
    var idJson = {
        accessToken:accessToken,
        "query":{
            "id":deatailId,
            "projectName_LIKE":''
        }
    }
    var  indexloading = layer.load(2, {shade: false});

    xhsdk.ajax({
        type:"post",
        url:solution+"/projectinfo/find",
        contentType:"application/json",
        dataType: "json",
        data:JSON.stringify(idJson),
        success:function(res){
            if(res.code==200){
                // var detailsData = res.data;
                layer.close(indexloading);
                initdata(res.data)
            }else{
                layer.close(indexloading);
                layer.msg("请求出现错误!!");
            }
        },
        error:function(msg){
            layer.close(indexloading);
            layer.msg("请求出现错误!!");
            console.log("Error:",msg);
        }
    });
}
//填入数据
function initdata(data){

    $(".projectName").text(data.projectName);
    $(".projectcode").text(data.projectCode);
    $(".projectBackground").text(data.projectDesc);
    $(".item_name").text(data.remark);
    $(".download-file").attr("href",data.projectFile);
    $(".projectResponsible").text(data.buildUnitLeaderName);
    $(".buildUnit").text(data.buildUnitName);

}




//正在进行的项目方案

var btnclass = $(".layui-tab-item button").hasClass("layui-btn-sm");

    if(btnclass==true){
        initPceed(1,5);
    }
function initPceed(current,size) {
    var projectJson = {
        accessToken:accessToken,
        "query":{
            "projectId":deatailId
        },
        "page":{
            "current":current,
            "size": size
        }
    };

    xhsdk.ajax({
        type:"post",
        url:solution+"/solutioninfo/list",
        contentType:"application/json",
        dataType: "json",
        data:JSON.stringify(projectJson),
        success:function(res){
            if(res.data.records.length<1){

                return;
            }
            if(res.code==200){

                var datalist = res.data.records;
                var total = res.data.total;
                var pagecur = res.data.current;
                if(total<=10){

                    $("#loading-button").hide();

                }else{

                    $("#loading-button").show();

                }
                proceedProject(datalist);
                laypage.render({
                    elem: 'loading-button',
                    // count:Math.ceil(totalPage),
                    count:Math.ceil(total),
                    limit:size,
                    // limits:total,
                    groups: total,
                    layout: ['prev', 'page', 'next'],
                    curr: pagecur, //当前页,
                    jump: function(obj, first) {                                //触发分页后的回调
                        if(!first){
                            initPceed(obj.curr,size)
                            // var pageJson ={
                            // 	"accessToken":accessToken,
                            //     "query":{
                            //         "projectId":deatailId
                            //     },
                            //     "page":{
                            //         "current": obj.curr,
                            //         "size": size
                            //     }
                            // };
                            // xhsdk.ajax({
                            //     type:"post",
                            //     url:solution+"/solutioninfo/list",
                            //     contentType:"application/json",
                            //     dataType: "json",
                            //     data:JSON.stringify(pageJson),
                            //     success:function(res){
                            //
                            //         if(res.code==200){
                            //             var datalist = res.data.records;
                            //
                            //             proceedProject(datalist)
                            //         }else{
                            //             layer.msg("请求出现错误!!");
                            //         }
                            //     },
                            //     error:function(msg){
                            //         layer.msg("请求出现错误!!");
                            //         console.log("Error:",msg);
                            //     }
                            // });
                        }

                    }
                })
            }else{

                layer.msg("请求出现错误!!");
            }
        },
        error:function(msg){

            layer.msg("请求出现错误!!");
            console.log("Error:",msg);
        }
    });
}

function proceedProject(data) {
    $(".loading-project-box").empty();
    $("#loading_box").show();
    for(var i=0;i<data.length;i++){
        var status = data[i].auditStatus;        // 状态（0草稿 1审核中 2通过 3驳回 4下线 5删除）
        var solutionStageinfo = data[i].solutionStage; // 实施方案阶段（-1删除 0草稿 1方案初审 2负责人审核 3合规审核 4立项审核）
        var solutionStageTxt = "";

        var statusText = "";
        var editHtml=null;
        // var createTime = new Date().Format(data[i].createTime);
        switch (status){
            case 0:
                statusText = '草稿';

                editHtml= '<a href="javascript:void(0)" data-moduleId="'+data[i].id+'" data-id="'+data[i].id+'"title="编辑" onclick="solutionData(this,2)"><i class="iconfont icon-bianji1"></i></a>'+
                          '<a href="javascript:void(0)" data-moduleid="'+data[i].id+'" title="删除" onclick="DelsolutionData(this)"><i class="iconfont icon-icon"></i></a>';
                break;
            case 1:
                statusText = '<span style="color: #cc940b;">审核中</span>';

                editHtml= '<a href="javascript:void(0)" data-id="'+data[i].id+'" title="详情" data-auditstatus="'+data[i].auditStatus+'" onclick="solutiondeatail(this)" ><i class="iconfont icon-icon-"></i></a>';
                break;
            case 2:
                statusText = '<span style="color:#15ca15">通过</span>';

                editHtml= '<a href="javascript:void(0)" data-id="'+data[i].id+'" title="详情" data-auditstatus="'+data[i].auditStatus+'" onclick="solutiondeatail(this)" ><i class="iconfont icon-icon-"></i></a>';
                break;
            case 3:
                statusText = '<span style="color:#CCCCCC">驳回</span>';

                editHtml= '<a href="javascript:void(0)" data-id="'+data[i].id+'" title="编辑" onclick="solutionData(this,2)"><i class="iconfont icon-bianji1"></i></a>' +
                    '<a href="javascript:void(0)" data-moduleid="'+data[i].id+'" title="删除" onclick="DelsolutionData(this)"><i class="iconfont icon-icon"></i></a>';
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
        switch (solutionStageinfo){
            case 0:
                solutionStageTxt = '无';
                break;
            case 1:
                solutionStageTxt = "建设单位科技管理责任人";
                break;
            case 2:
                solutionStageTxt = "建设单位科技管理负责人";
                break;
            case 5:
                solutionStageTxt = "科信委立项审核";
                break;
            case 3:
                solutionStageTxt = "平台审核组";
                break;
            case 4:
                solutionStageTxt = "市局科信委";
                break;
            default:
                solutionStageTxt = '-';
        }
        var tablehtml = '<tr>' +
            '<td>'+data[i].solutionName+'</td>' +
            '<td>'+data[i].solutionVersion+'</td>' +
            '<td class="plan-box" data-status="'+data[i].auditStatus+'">'+statusText+'</td>' +
            '<td>'+data[i].developOrgan+'</td>' +
            '<td>'+data[i].developLeaderName+'</td>' +
            '<td>'+solutionStageTxt+'</td>' +
            '<td  class="destail-button">' +
            '<div class="edit-box">'+editHtml+'</div></td>'+
            '</tr>';
        $(tablehtml).appendTo('.loading-project-box');

    }
}



// 删除实施方案
function DelsolutionData(_this){
    layer.confirm('确认删除吗？', {
        btn: ['确认', '取消'] //按钮
    }, function () {
        var auditJson = {
            "id":$(_this).data("moduleid"),
        }

        indexloading = layer.load(2, {shade: false});
        xhsdk.ajax({
            type: "post",
            url: solution + "/solutioninfo/remove",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(auditJson),
            success: function (res) {
                if (res.data==true) {
                    layer.close(indexloading);
                    // $(_this).hide();
                    layer.msg("删除完成!", {icon: 1, time: 600}, function () {
                        initPceed();
                        layer.close()
                    });
                } else {
                    layer.close(indexloading);
                        layer.msg(res.data);
                }
            },
            error: function (msg) {
                layer.close(indexloading);
                layer.msg("请求出现错误!!");
            }
        });

    }, function () {
        layer.close(indexloading);
        layer.msg("已取消")

    });
}



$(".ProgrammeList").on('click', 'li', function () {
    $(this).addClass("layui-this").siblings().removeClass("layui-this");
    if ($(this).attr("class").indexOf("now_Programme") >= 0) {
        $(".nowProgramme").show();
        $(".historyProgramme").hide();
    } else {
        $(".nowProgramme").hide();
        $(".historyProgramme").show();
    }
})


// 查看项目进度
// function search_result(_this) {
//         var checkplan = $(_this).data("status");
//
//     // layer.open({
//     //     type: 2,
//     //     title: '项目进度',
//     //     shadeClose: true,
//     //     area: ['100%', '100%'],
//     //     content: '../pLogisticsTracking/pLogisticsTracking.html?status='+checkplan+"&TokenCode="+TokenCode
//     // });
// }


// 添加实施方案 修改 , 详情 ,升级
function solutionData(_this,flagid,olid) {
    var moduleId = $(_this).data("moduleid");
    var itemID = $(_this).data("id");
    if(flagid==3){
        layer.open({
            type: 2,
            anim: 5,
            maxmin: true,
            title: '项目实施升级',
            shadeClose: false,
            area: ['100%', '100%'],
            content: '../pm_setDoc/pm_Change/project_Change.html?tag=1'+"&itemID="+olid+"&TokenCode="+accessToken +"&auditstatus="+2 +"&flagid=2"+"&projectid="+null+"&addprojectID="+null+"&oldflag=4",
            end:function () {
                initPceed();
                GetprojectID();
            }
        });
        return
    }

    layer.open({
        type: 2,
        anim: 5,
        maxmin: true,
        title: '添加项目实施',
        shadeClose: false,
        area: ['100%', '100%'],
        // content: '../pm_setDoc/pm_Change/pm_Change.html?tag=1'+"&itemID="+itemID+"&TokenCode="+accessToken +"&auditstatus="+2 +"&flagid=2"+"&projectid="+deatailId+"&addprojectID="+AddprojectID,
        content: '../pm_setDoc/pm_setDoc.html?tag=1'+"&addprojectID="+AddprojectID +"&projectid="+deatailId +"&moduleId="+moduleId+"&itemID="+itemID +"&flagid="+flagid+"&TokenCode="+accessToken+"&version="+versionCon,
        end:function () {
            initPceed();
            GetprojectID();
        }
    });


}

function solutiondeatail(_this){

    var itemid = $(_this).data("id");

    var auditstatus = $(_this).data("auditstatus");

    layer.open({
        type: 2,
        title: '实施方案详情',
        shadeClose: true,
        maxmin: true,
        area: ['100%', '100%'],
        content: '../pm_setDoc_deastail/pm_setDoc_deastail.html?tag=1'+"&itemID="+itemid+"&TokenCode="+accessToken +"&auditstatus="+auditstatus +"&projectid="+deatailId +"&addprojectID="+AddprojectID
        // content: '../pm_setDoc/pm_Change/pm_Change.html?tag=1'+"&itemID="+itemid+"&TokenCode="+accessToken +"&auditstatus="+auditstatus +"&flagid=2"+"&projectid="+deatailId+"&addprojectID="+AddprojectID
    });
}

// 格式化时间
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