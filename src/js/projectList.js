var laypage = layui.laypage;
var form = layui.form;
var projectName=null;//项目名称

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var accessToken = sessionStorage.getItem("access_token");

 // TokenCode = GetQueryString('access_token');

var xhsdk = new Xhsdk(appID,appSecretKey);

//设置网关
xhsdk.setGetaWayUrl(GetaWay_url);

//设置token
xhsdk.setToken(accessToken);

//设置类型
xhsdk.setReqType("app");

xhsdk.setUserInfo(null);


//项目列表
init(1,10);
    function init(current,size) {

        var projectJson = {
            "accessToken":accessToken,
            "query":{
                "projectName_LIKE":""

            },
            "page":{
                "current": current,
                "size": size
            }
        };

        $(".loading-box1").show();

        xhsdk.ajax({
            type:"post",
            url:solution+"/projectinfo/list",
            contentType:"application/json",
            dataType: "json",
            data:JSON.stringify(projectJson),
            beforeSend:function () {
                $(".loading-box1").show();
            },
            success:function(res){
                // console.log(res)
                if(res.errorCode==405){
                    layer.msg("请重新登录!");
                    $(".loading-box1").hide();
                    return;
                }
                if(res.code==200){

                    var datalist = res.data.records;
                    var total = res.data.total;
                    var pagecur = res.data.current;
                    if(total<=10){

                            $("#page-button").hide();

                    }else{
                            $("#page-button").show();

                    }
                    renderData(datalist);
                    $(".loading-box1").hide();
                    laypage.render({
                        elem: 'page-button',
                        // count:Math.ceil(totalPage),
                        count:Math.ceil(total),
                        limit:size,
                        // limits:total,
                        groups: total,
                        layout: ['prev', 'page', 'next'],
                        curr: pagecur, //当前页,
                        jump: function(obj, first) {                                //触发分页后的回调
                            // initdata(data)
                            if(!first){
                                // $(".loading-box1").show();
                                init(obj.curr,size);
                                // var pageJson ={
                                // 	"accessToken":accessToken,
                                //     "query":{
                                //         "projectName_LIKE":""
                                //     },
                                //     "page":{
                                //         "current": obj.curr,
                                //         "size": size
                                //     }
                                // }
                                // xhsdk.ajax({
                                //     type:"post",
                                //     url:solution+"/projectinfo/list",
                                //     contentType:"application/json",
                                //     dataType: "json",
                                //     data:JSON.stringify(pageJson),
                                //     beforeSend:function () {
                                //         $(".loading-box1").show();
                                //     },
                                //     success:function(res){
                                //         if(res.code==200){
                                //             var datalist = res.data.records;
                                //             renderData(datalist)
                                //
                                //         }else{
                                //             layer.msg(res.data);
                                //
                                //         }
                                //     },
                                //     complete: function () {
                                //         $(".loading-box1").hide()
                                //
                                //     },
                                //     error:function(msg){
                                //         layer.msg("请求出现错误!!");
                                //         console.log("Error:",msg);
                                //
                                //     }
                                // });
                            }

                        }
                    })
                }else{
                    layer.msg(res.data);
                    $(".loading-box1").hide()
                }
            },
            complete: function () {
                $(".loading-box1").hide()


            },
            error:function(msg){
                layer.msg("请求出现错误!!");
                console.log("Error:",msg);
                $(".loading-box1").hide()

            }
        });

    }

//填入数据
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
            htmlbox = '<a onclick="editproject(this)" title="编辑" data-id="'+data[i].id+'" data-status="'+data[i].auditStatus+'" data-name="'+data[i].projectName+'"><i class="iconfont icon-bianji"></i></a>'+
                '<a href="#"  title="查看" data-id="'+data[i].id+'" data-status="'+data[i].auditStatus+'" onclick="Itemdetails(this)" class="destail-button"><i class="iconfont icon-chakan"></i></a>';
        }else if(status==2||status==1){
            htmlbox = '<a href="#" title="查看" data-id="'+data[i].id+'" data-status="'+data[i].auditStatus+'" onclick="Itemdetails(this)" class="destail-button"><i class="iconfont icon-chakan"></i></a>';
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
            '<td  class="status-btn" data-status="'+data[i].auditStatus+'"><i></i><span>'+statusText+'</span></td>'+
            '<td><div class="show-box">'+htmlbox+'</div></td></tr>';
        $(tablehtml).appendTo('.itemCon');
    }
}



//打开项目详情
function Itemdetails(_this) {
    var deatailId = $(_this).data("id");    // 项目ID
    var status = $(_this).data("status");   // 项目状态
     projectName = $(_this).parent().find("td").eq(3).text();
    layer.open({
        type: 2,
        title: '项目详情',
        shadeClose: true,
        area: ['100%', '100%'],
        content: './page/projectProgramme/projectProgramme.html?deatailId=' + deatailId+"&status="+status+"&TokenCode="+accessToken,
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
        content: './page/projectApply/projectApply.html?deatailId='+deatailId+'&tag=2'+"&status="+status+"&TokenCode="+accessToken
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
        content: './page/projectApply/projectApply.html?tag=1'+"&TokenCode="+accessToken
    });
});

// 查看项目进度

function search_result(_this) {
        var statusID = $(_this).data("status");
    layer.open({
        type: 2,
        title: '项目进度',
        shadeClose: true,
        area: ['100%', '100%'],
        content: './page/pLogisticsTracking/pLogisticsTracking.html?status='+statusID+"&TokenCode="+accessToken
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
