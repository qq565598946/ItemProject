var element = layui.element;
var layer = layui.layer;
var form = layui.form;
var formSelects = layui.formSelects;  // 应用设计
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}


var itemID = GetQueryString('itemID');      //实施方案ID

var accessToken = GetQueryString('TokenCode');

var auditstatus = GetQueryString('auditstatus');

var projectid = GetQueryString('projectid');

var addprojectID = GetQueryString('addprojectID');


var xhsdk = new Xhsdk(appID,appSecretKey);

//设置网关
xhsdk.setGetaWayUrl(GetaWay_url);

//设置token
xhsdk.setToken(accessToken);

//设置类型
xhsdk.setReqType("app");

xhsdk.setUserInfo(null);

// var addprojectID = GetQueryString('addprojectID'); //实施方案ID
// console.log(moduleId)

$(function () {

    if (auditstatus==1||auditstatus==0){
        var changeBtn =  `<button class="layui-btn layui-btn-normal layui-btn-sm" onclick="projectchange(this)">变更申请</button>`;
        $(".save-btn").html(changeBtn)
    }else if(auditstatus==2){
        var changeBtn =  `<button class="layui-btn layui-btn-normal layui-btn-sm" onclick="projectchange(this)">变更申请</button>`;
        $(".save-btn").html(changeBtn)
    }else{
        // var changeBtn =  `<button class="layui-btn layui-btn-normal layui-btn-sm" onclick="projectchange(this)">变更申请</button>`;
        // $(".save-btn").html(changeBtn)
    }

    // $(".docExport").attr("href",GetaWay_url+solution+"/supplier/queryAndDownloadMyServer?accessToken="+accessToken+'&applyID='+appID+'&secretKey='+appSecretKey+'&requestType=app');

    returnTop();
    if(itemID==null){return;}
    initdata();
    // initnormalize();
    showAuditBox()

});

// 开发规范 部署环境 运行资源
function initnormalize() {
var normalize = {"name":"开发规范"};
    xhsdk.ajax({
        type: "post",
        url: solution + "/dictionary/find",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(normalize),
        success: function (res) {
            if (res.code==200) {
                $(".norm-content").text(res.data[3].content);
                var zy = `<option value="`+res.data[2].id+`">`+res.data[2].content+`</option>`;      // 运行资源
                $(zy).appendTo("#service1");
                for(var i=0;i<=res.data.length;i++){                                                 // 部署环境
                    if(i==2){
                        return;
                    }
                    var deployContent = `<option value="`+res.data[i].id+`">`+res.data[i].content+`</option>`;
                    $(deployContent).appendTo("#service");

                }
                form.render();
            } else {
                layer.msg(res.data);
            }
        },
        error: function (msg) {
            layer.msg("请求出现错误!!");

        }
    });

}
//阅读规范
$(".Read_specification").on("click", function () {
    var content = $(this).parent().find(".norm-content").text();
    layer.open({
        type: 1,
        area: ['500px', '300px'], //宽高
        title: '开发规范',
        shade: 0.2,
        closeBtn: 0,
        // skin: 'layui-layer-lan',
        shift: 4,
        shadeClose: true, //开启遮罩关闭
        content: '<div class="show-content">' + content + '<div class="option-checkbox-txt layui-form"><input type="checkbox" name="like1[write]" lay-skin="primary" title="已阅读" value="1" lay-filter="haveRead"></div></div>'
    });
    form.render();
    //监听是否阅读规范
    form.on('checkbox(haveRead)', function (data) {
        readstatus = data.value;
        $(".notread span").text("已阅读");
        layer.msg("已阅读!", {
            icon: 1,
            time: 600
        }, function () {
            var index = layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            layer.closeAll();
        });
    })
})

function initdata(){

// 实施方案模块
var navJson = {
    "solutionId":itemID
}

    var  indexloading = layer.load(2, {shade: false});

    xhsdk.ajax({
    type: "POST",
    url: solution + "/projectManagement/list",
    // url: "template.json",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(navJson),
    success: function (res) {

        if (res.code == 200) {
            layer.close(indexloading);
            var  solutioninfoList = res.data.solutioninfoList; // 基本信息
            var  overviewList = res.data.overviewList; // 项目概述
            var  demanalysisList = res.data.demanalysisList; // 需求分析
            var  saveArchidesign = res.data.archidesignList; // 架构设计
            var  microserviceList = res.data.microserviceList;  // 微服务设计
            var  applicationdesignList = res.data.applicationdesignList; // 应用设计
            // var  saveDeployrun = res.data.deployrunList;  // 服務部署与运行资源
            var  risksolutionList = res.data.risksolutionList;       // 风险解决方案



            var overviewaAuditList = res.data.overviewaAuditList;  //项目概述审核意见
            var demanalysisAuditList = res.data.demanalysisAuditList;  //需求分析审核意见
            var archidesignAuditList = res.data.archidesignAuditList;  //架构设计审核意见
            var microserviceAuditList = res.data.microserviceAuditList;  //微服务设计审核意见
            var applicationdesignAuditList = res.data.applicationdesignAuditList;  //应用设计审核意见
            var risksolutionAuditList = res.data.risksolutionAuditList;  //风险解决方案审核意见

            solutionDetail(solutioninfoList);
            projectDetail(overviewList, overviewaAuditList);
            DetailDemanalysis(demanalysisList, demanalysisAuditList);
            DetailArchidesign(saveArchidesign, archidesignAuditList);
            Detailmicroservice(microserviceList, microserviceAuditList);
            Detailapplicationdesign(applicationdesignList, applicationdesignAuditList);
            Detaildeployrun(risksolutionList, risksolutionAuditList);

        } else {
            layer.close(indexloading);
            layer.msg("请求出现错误!!");
        }
    },
    error: function (msg) {
        layer.close(indexloading);
        layer.msg("请求出现错误!!");
    }
});

}

// 所有模块的审核意见
function auditContent(elem,data,multiterm) {

    $(elem).find(".show-audit-box ul").empty();
    $(elem).find(".show-audit-box").empty();


    for (var i = 0; i < data.length; i++) {

        var liCont = `<div class="box-audit-content"><ul><li>` + "审核意见:" + ` ` + (i + 1) + ` : ` + data[i].opinion + `</li></ul>
                            <div>审核人 : <span>` + data[i].auditName + `</span></div>
                            <div>审核时间 : <span>` + data[i].auditTime + `</span></div>
                            </div>`;
        $(elem).find(".show-audit-box").append(liCont);
        $(elem).find(".audit-box").show();
        // if(multiterm==5){
        //
        //         $(elem).eq(i).find(".service-list .show-audit-box").append(liCont);
        //         $(elem).eq(i).find(".audit-box").show();
        // }else{
        //
        //
        // }

    }



}

// 显示审核意见
function showAuditBox() {
    $(".audit-box").hover(function () {
        $(this).find(".show-audit-box").show(600);
    }, function () {
        $(this).find(".show-audit-box").hide(300);
    })
}



//基本信息 详情
function solutionDetail(solutioninfoList) {
    if(solutioninfoList.length<1){
        return;
    }
    for(var i=0 ; i<solutioninfoList.length;i++){
           $(".project_Name").val(solutioninfoList[i].solutionName);
           $(".makeUnit").val(solutioninfoList[i].makeUnit);
           $(".solutionVersion").val(solutioninfoList[i].solutionVersion);
           $(".staffvalue").val(solutioninfoList[i].developLeaderName);
           $(".kfdevelopOrgan").val(solutioninfoList[i].developOrgan);

        var   staffVlaueCon = solutioninfoList[i].developerName;
        if(staffVlaueCon.length>0){
            $("#staffvalue_two").text(solutioninfoList[i].developerName);
            $("#pj-staffvalue .levelTips").hide();
            $("#pj-staffvalue .addItem-box").hide();
        }
    }
}

// 项目概述详情
function projectDetail(overviewList,overviewaAuditList) {
        for(var i=0;i<overviewList.length;i++){
                $("#pj-background").children("p").text(overviewList[i].projectBackground);
                $("#systemCurrent").children("p").text(overviewList[i].systemCurrent);
                $("#buildGoal").children("p").text(overviewList[i].buildGoal);
                $("#buildContent").children("p").text(overviewList[i].buildContent);
        }

    if(overviewaAuditList.length>0){
        auditContent("#pj-overview", overviewaAuditList);
    }



}
// 需求分析
function DetailDemanalysis(demanalysisList,demanalysisAuditList) {
    for(var i=0;i<demanalysisList.length;i++){
        $("#functionalRoleAnalysis").children("p").text(demanalysisList[i].functionalRoleanalysis);
        $("#businessRequirements").children("p").text(demanalysisList[i].businessRequirements);
        $("#dataIntegration").children("p").text(demanalysisList[i].dataIntegration);
    }

    if(demanalysisAuditList.length>0){
        auditContent("#pj-demandAnalysis", demanalysisAuditList);
    }



}
// 架构设计
function DetailArchidesign(saveArchidesign,archidesignAuditList) {
    for(var i=0;i<saveArchidesign.length;i++){
        $("#frameworkdesign").children("p").text(saveArchidesign[i].frameworkDesign);
        $("#demo1").attr("src",saveArchidesign[i].topologicalPic);
        $("#principlesroutes").children("p").text(saveArchidesign[i].principlesRoutes);
    }

    if(archidesignAuditList.length>0){
        auditContent("#pj-design", archidesignAuditList);
    }
}
// 微服务设计
function Detailmicroservice(microserviceList,microserviceAuditList) {

    if(microserviceAuditList.length>0){
        auditContent("#pj-service", microserviceAuditList,5);
    }

    for(var i=0;i<microserviceList.length;i++){


        var generalServicelabe = microserviceList[i].generalService.split(","); // 通用业务服务
        var basicServicelable = microserviceList[i].basicService.split(",");  //  基础服务

          var serviceHtml = ` <div class="pj-item-body service-list microserviceList`+i+`">
                          <div class="secLevel">
                                <div class="deploy">
                                    <p class="editTitle">服务名字</p>
                                    <div class="layui-input-inline" style="width: 500px;margin-left: 7px;">
                                        <input type="tel" name="phone" lay-verify="" autocomplete="off" class="layui-input" id="serviceName" disabled value="`+microserviceList[i].serviceName+`">
                                    </div>
                                </div>
                            </div>
                    <div class="secLevel">
                        <div class="pj-item-body-top layui-form">
                            <div class="deploy">
                                <p class="editTitle">服务类型</p>
                                <div class="layui-input-inline option-left">
                                    <select name="quiz" id="service-option" disabled class="serviceType`+i+`">
                                        <option value="1">基础技术服务</option>
                                        <option value="2">通用业务服务设计</option>
                                        <option value="3">应用服务设计</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="secLevel">
                        <div class="pj-item-body-top">
                            <p class="editTitle">服务设计</p>
                        </div>
                        <div class="pj-item-body-bottom" id="serviceDesign">
                                <p>`+microserviceList[i].serviceDesign+`</p>
                        </div>
                    </div>
                    <div class="secLevel">
                        <div class="pj-item-body-top">
                            <p class="editTitle">依赖的服务</p>
                            <div class="editOprate">
                                <div class="editCon">
                                    <!--<i class="iconfont icon-bianji"></i>-->
                                    <!--<span>编辑</span>-->
                                </div>
                            </div>
                        </div>
                        <div class="pj-item-body">
                            <div class="common">通用业务服务(多选)</div>
                            <div class="box-select-business layui-input-inline" style="margin:20px 0px; width: 100%">
                                <select xm-select="business_des`+i+`" disabled>
                                              
                                            
                                              
                                </select>
                            </div>
                          
                            <div class="common">基础技术服务(多选)</div>
                             <div class="box-select-technical layui-input-inline" style="margin:20px 0px;width: 100%">
                                <select xm-select="technical_des`+i+`" disabled>
                                         
                                </select>
                            </div>
                           
                        </div>
                    </div>
                      <!--部署环境和运行资源-->
                <div class="secLevel">
                    <div class="pj-item-body-top">
                        <p class="editTitle">部署环境和运行资源</p>
                    </div>
                    <div class="deploy-edit">
                        <div class="deploy-box-tip1">
                            <div class="deploy">
                                <p class="common">部署环境 :</p>
                                <div class="option-box">
                                  <p>`+microserviceList[i].deploymentEnvironment+`</p>
                                    <!--<select name="quiz" id="service" class="deploymentEnvironment">-->
                                        <!--<option value="请选择"></option>-->
                                    <!--</select>-->
                                </div>
                            </div>
                            <div class="deploy">
                                <p class="common">运行资源 :</p>
                                <div class="option-box">
                                <p>`+microserviceList[i].runResource+`</p>
                                    <!--<select name="quiz" id="service1" class="runResource">-->
                                        <!--<option value="请选择"></option>-->
                                    <!--</select>-->
                                </div>
                            </div>
            
                        </div>
                    </div>
                </div>
                </div>`;
        $(serviceHtml).appendTo("#service-box");
        $(".serviceType"+i+" option[value = "+ microserviceList[i].serviceType +"]").attr("selected","selected");
        form.render();
        GetserviceData('business_des'+i+'','technical_des'+i+'',basicServicelable,generalServicelabe,3);
    }

}

// 依赖服务
function GetserviceData(businessID,technicalID,businessValue,technicalValue,flag) {
    var serviceArr = [];
    xhsdk.ajax({
        url: solution +"/microservice/getServerList",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data:'{"accessToken":"'+ accessToken +'"}',
        success: function (res) {
            if (res.code == 200) {

                $(".allRelySerItem").html("");

                var  typeArr1 = res.data.resulList;


                // for (let i = 0; i < arrc.length; i++) {
                //
                //     var iftypevalue = arrc[i].type;
                //
                //     if (flag == 2) {
                //
                //         if (iftypevalue == 2) {
                //
                //             typeArr1.push({
                //                 "serverName": arrc[i].serverName,
                //                 "type": arrc[i].type,
                //                 "serverinfoID": arrc[i].serverinfoID
                //             });
                //
                //         }
                //
                //     } else {
                //
                //         if (iftypevalue == 3) {
                //
                //             typeArr1.push({
                //                 "serverName": arrc[i].serverName,
                //                 "type": arrc[i].type,
                //                 "serverinfoID": arrc[i].serverinfoID
                //             });
                //
                //         }
                //     }
                //
                //
                // }


                for (var i = 0; i < typeArr1.length; i++) {
                    serviceArr.push({"name":typeArr1[i].serverName,"value":typeArr1[i].serverinfoID});

                }
                formSelects.data(businessID, 'local', {
                    arr:serviceArr
                });
                formSelects.data(technicalID, 'local', {
                    arr:serviceArr
                });


                if(flag==1){    // 新增点击进来 下面代码不执行
                    return;
                }

                // formSelects.render(businessID);
                // formSelects.render(technicalID);

                formSelects.value(businessID, businessValue, true);
                formSelects.value(technicalID, technicalValue, true);


            } else {
                layer.msg("网络错误！")
            }
        },
        error: function (msg) {
            layer.msg("数据请求错误!");
            console.log("获取全部服务Error:", msg);
        }
    });




}


// 应用设计
function Detailapplicationdesign(applicationdesignList,applicationdesignAuditList) {

    var selcetValue = null;

    if(applicationdesignAuditList.length>0){
        auditContent("#pj-application", applicationdesignAuditList,5);
    }

    for(var i=0;i<applicationdesignList.length;i++){
        selcetValue = applicationdesignList[i].frontIntegration.split(",");
        var appHtml  = `  <div class="pj-item-body service-list appliction-list`+i+`">
                     <div class="secLevel">
                      <div class="pj-item-body-top" style="position: relative">
                <p class="editTitle">应用名称</p>
                <div class="name-app">` + applicationdesignList[i].applicationName + `</div>
            </div>
                                    <!--<div class="deploy">-->
                                      <!--<p class="editTitle">应用名称</p>-->
                                        <!---->
                                            <!---->
                                    <!--</div>-->
        <div class="secLevel">
            <div class="pj-item-body-top">
                <p class="editTitle">应用概述</p>
            </div>
            <div class="pj-item-body-bottom" id="applicationOverview">
              <p>`+applicationdesignList[i].applicationOverview+`</p>
            </div>
        </div>
        <div class="secLevel">
            <div class="pj-item-body-top">
                <p class="editTitle">应用UI/UE规划</p>
            </div>
            <div class="pj-item-body-bottom" id="applicationPlanning">
             <p>`+applicationdesignList[i].applicationPlanning+`</p>
            </div>
        </div>
        <div class="secLevel">
            <div class="pj-item-body-top">
                <p class="editTitle">应用功能逻辑</p>
            </div>
            <div class="pj-item-body-bottom" id="applyLogicdiagram">
               <p>`+applicationdesignList[i].applyLogicdiagram+`</p>
            </div>
        </div>
        <div class="secLevel">
            <div class="pj-item-body-top" style="margin-top:30px;">
                <div class="deploy" style="width: 100%">
                    <p class="editTitle">前端服务化能力集成</p>
            
                   
                         <div class="" style="margin: 14px 0px 5px 0px;">

                                            <select xm-select="select-id`+i+`" disabled="disabled">
                                                <option value="1">人脸识别服务</option>
                                                <option value="2">车牌识别服务</option>
                                                <option value="3">证件识别服务</option>
                                                <option value="4">扫一扫服务</option>
                                                <option value="5">证件识别服务</option>
                                                <option value="6">选择文件</option>
                                                <option value="7">电子签名</option>
                                                <option value="8">获取定位</option>
                                                <option value="9">获取手机状态（NFC、蓝牙、GPS、WIFI等）</option>
                                                <option value="10">设置手机状态（NFC、蓝牙、GPS、WIFI等）</option>
                                                <option value="11">获取海拔</option>
                                                <option value="12">图片压缩</option>
                                            </select>
                                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    $(appHtml).appendTo(".application-box");
        formSelects.render('select-id'+i+'');
        formSelects.value('select-id'+i+'', selcetValue, true);
    }
}

// 风险解决方案
function Detaildeployrun(risksolutionList,risksolutionAuditList) {
    if(risksolutionAuditList.length>0){
        auditContent("#pj-solution", risksolutionAuditList);
    }
    for(var i=0;i<risksolutionList.length;i++){
        $("#riskSolution").children("p").text(risksolutionList[i].riskSolution);
    }
}


function returnTop() {
    //当滚动条的位置处于距顶部100像素以下时，跳转链接出现，否则消失
    $(window).scroll(function () {
        if ($(window).scrollTop() > 100) {
            $(".returnTop").fadeIn(1000);
        } else {
            $(".returnTop").fadeOut(1000);
        }
    });
    //当点击跳转链接后，回到页面顶部位置
    $(".returnTop").click(function () {
        if ($('html').scrollTop()) {
            $('html').animate({scrollTop: 0}, 500);
            return false;
        }
        $('body').animate({scrollTop: 0}, 500);
        return false;
    });
}




// 项目变更




function projectchange() {

    // var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    // parent.layer.close(index); //再执行关闭

    layer.confirm('确认变更吗？', {

        btn: ['确认', '取消'] //按钮

    }, function () {

        window.open('../pm_setDoc/pm_Change/project_Change.html?tag=1'+"&itemID="+itemID+"&TokenCode="+accessToken +"&auditstatus="+auditstatus +"&flagid=2"+"&projectid="+projectid+"&addprojectID="+addprojectID);

        // layer.open({
        //     type: 2,
        //     title: '变更申请',
        //     shadeClose: true,
        //     area: ['100%', '100%'],
        //     // content: '../pm_setDoc/pm_Change/pm_Change.html?itemID='+itemID+'&flagid=2'+"&status="+status+"&TokenCode="+accessToken
        //     content: '../pm_setDoc/pm_Change/pm_Change.html?tag=1'+"&itemID="+itemID+"&TokenCode="+accessToken +"&auditstatus="+auditstatus +"&flagid=2"+"&projectid="+projectid+"&addprojectID="+addprojectID
        // });
    }, function () {

        layer.msg("已取消")
    });





}








