var element = layui.element;
var layer = layui.layer;
var form = layui.form;
var laypage = layui.laypage; //分页
var upload = layui.upload; //文件上传
var formSelects = layui.formSelects;  // 下拉多选
var  loadingTip = $(".loading-box1"); // 自定义加载中..
var  indexloading; // 默认加载中..

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var accessToken = GetQueryString('TokenCode');   // access_token


var moduleId = null;
var additemId = null; // 新增所有实施方案模板ID
var flagid = GetQueryString('flagid'); // 从编辑页面打开 2 编辑
var projectid = GetQueryString('projectid'); // 项目ID
var userName = sessionStorage.getItem("userName"); // 用户名
var userId = sessionStorage.getItem("userId");      // 用户ID
var developLeaderID = sessionStorage.getItem("developLeader"); // 项目负责人ID
var developLeaderName = sessionStorage.getItem("developLeaderName");     // 项目负责人姓名
var oldflag = GetQueryString('oldflag');   // 升级

var xhsdk = new Xhsdk(appID, appSecretKey);

// 设置网关
xhsdk.setGetaWayUrl(GetaWay_url);

// 设置token
xhsdk.setToken(accessToken);

// 设置类型
xhsdk.setReqType("app");

xhsdk.setUserInfo(null);

if(oldflag==4){
$(".text-navy").text("实施方案升级")
}


// 已添加在编辑页面打开在新增模块传的 itemid  新添加 传的 addprojectID

if (flagid == 2) {

    var itemid = GetQueryString('itemID');              // 获取添加实施方案生成的ID

    additemId = itemid;

    $(".editOprate").show();

    $(".box-tip").hide();

    GetitemDestail(null,null);

    GetitemDestail(6,null);   // 6：旧版本

} else {

    var addprojectID = GetQueryString('addprojectID');     // 获取添加实施方案生成的ID

    additemId = addprojectID;

    $(".editOprate").hide();

    $(".box-tip").show();

    GetqueryUserBy("staffselect",null,null);
}

    $(function () {

    showAuditBox();

    $("#kfdevelopOrgan").val(developLeaderName); //

    $("#staffvalue").val(userName);

    $("#staffvalue").attr("userId", userId); // 用户ID

    returnTop();

    // initnormalize();

});


// 获取开发单位负责人 和分配开发人员 信息
function GetqueryUserBy(id,value,flaguser) {

    var projectJson = {
        "accessToken": accessToken,
        "deptCode": sessionStorage.getItem("deptCode")
    };

    xhsdk.ajax({
        type: "post",
        url: solution + "/solutioninfo/queryUserByDeptCode",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(projectJson),
        success: function (res) {

            if (res.code == 200) {

                if(res.data==null){
                    layer.msg("暂无人员数据");
                    return
                }

                var datalist = res.data;

                var queryUserByArr = []; // 开发单位负责人
                queryUserByArr.splice(0,queryUserByArr.length); // 清空数组


                for (var i = 0; i < datalist.length; i++) {

                    queryUserByArr.push({"name":datalist[i].userName,"value":datalist[i].id});

                }

                formSelects.data(id, 'local', {  // 插入新数据
                    arr:queryUserByArr
                });

                if(flaguser==1||flaguser==3){                 // 勾选已有数据

                    formSelects.value(id,value, true);

                }
                // formSelects.render("staffselect");

            } else {

                layer.msg("请求出现错误!!");
            }
        },
        error: function (msg) {
            layer.msg("请求出现错误!!");
            console.log("Error:", msg);
        }
    });
}


// 实施方案详情
function GetitemDestail(versionFlag,idFlag) {


    var navJson = {
        "accessToken": accessToken,
        "solutionId": additemId
    };
    loadingTip.show();
    xhsdk.ajax({
        type: "POST",
        url: solution + "/projectManagement/list",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(navJson),
        success: function (res) {
            if(res.errorCode==405){
                layer.msg("请重新登录!");
                return;
            }
            if (res.code==200) {

                var solutioninfoList = res.data.solutioninfoList; // 基本信息
                var overviewList = res.data.overviewList; // 项目概述
                var demanalysisList = res.data.demanalysisList; // 需求分析
                var saveArchidesign = res.data.archidesignList; // 架构设计
                var microserviceList = res.data.microserviceList;  // 微服务设计
                var applicationdesignList = res.data.applicationdesignList; // 应用设计
                var risksolutionList = res.data.risksolutionList;       // 风险解决方案

                var overviewaAuditList = res.data.overviewaAuditList;  //项目概述审核意见
                var demanalysisAuditList = res.data.demanalysisAuditList;  //需求分析审核意见
                var archidesignAuditList = res.data.archidesignAuditList;  //架构设计审核意见
                var microserviceAuditList = res.data.microserviceAuditList;  //微服务设计审核意见
                var applicationdesignAuditList = res.data.applicationdesignAuditList;  //应用设计审核意见
                var risksolutionAuditList = res.data.risksolutionAuditList;  //风险解决方案审核意见

                switch (idFlag) {
                    case 1 :
                        solutionDetail(solutioninfoList,versionFlag);
                        break;
                    case 2 :
                        projectDetail(overviewList, overviewaAuditList,versionFlag);
                        break;
                    case 3 :
                        DetailDemanalysis(demanalysisList, demanalysisAuditList,versionFlag);
                        break;
                    case 4 :
                        DetailArchidesign(saveArchidesign, archidesignAuditList,versionFlag);
                        break;
                    case 5 :
                        Detailmicroservice(microserviceList, microserviceAuditList,versionFlag);
                        break;
                    case 6 :
                        Detailapplicationdesign(applicationdesignList, applicationdesignAuditList,versionFlag);
                        break;
                    case 7 :
                        Detaildeployrun(risksolutionList, risksolutionAuditList,versionFlag);
                        break;
                    default:
                        solutionDetail(solutioninfoList,versionFlag);
                        projectDetail(overviewList, overviewaAuditList,versionFlag);
                        DetailDemanalysis(demanalysisList, demanalysisAuditList,versionFlag);
                        DetailArchidesign(saveArchidesign, archidesignAuditList,versionFlag);
                        Detailmicroservice(microserviceList, microserviceAuditList,versionFlag);
                        Detailapplicationdesign(applicationdesignList, applicationdesignAuditList,versionFlag);
                        Detaildeployrun(risksolutionList, risksolutionAuditList,versionFlag);

                }

                loadingTip.hide();

            } else {
                loadingTip.hide();
                layer.msg("请求出现错误!");
            }
        },
        error: function (msg) {
            loadingTip.hide();
            layer.msg("请求出现错误!");
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


// 验证填写是否完成
function verifyNum(num) {
    $(".anchorNav ul li:eq(" + num + ")").addClass("verify");
    $(".anchorNav ul li:eq(" + num + ") .font-red").html('<i class="layui-icon-ok layui-icon" style="margin:-5px;font-size: 18px;color:green"></i>');
    loadingverify(); // 验证进度
}


// 当前添加的时候 其它模块不能添加
function unadd(showflag) {

    $(".rightContent").each(function (i,n) {

        var addnum =  $(this).find(".addItem-box");

        if(showflag==0){

            addnum.css("display","none");

        }else{

            addnum.css("display","block");

        }

    })
}


/*********************************************************所有模块详情****************************************************************************/

//基本信息详情
function solutionDetail(solutioninfoList,versionFlag) {

    if (solutioninfoList.length < 1) {
        return;
    }
    verifyNum(0);
    if (versionFlag==6){
        $("#pj-basic-info-older .info-box").show();
    } else{
        $("#pj-basic-info .info-box").show();
    }

    for (var i = 0; i < solutioninfoList.length; i++) {
        var infohtml = `  <div class="center-box">
                                                <div class="layui-form-item">
                                                    <div class="layui-inline">
                                                        <label class="layui-form-label">方案名称:</label>
                                                        <div class="layui-input-inline">
                                                        <input type="tel" name="phone" autocomplete="off" class="layui-input project_Name" disabled value="` + solutioninfoList[i].solutionName + `">
                                                        </div>
                                                    </div>
                                                    <div class="layui-inline">
                                                        <label class="layui-form-label">编制单位:</label>
                                                        <div class="layui-input-inline">
                                                        <input type="tel" name="phone"  autocomplete="off" class="layui-input makeUnit"  disabled value="` + solutioninfoList[i].makeUnit + `" >
                                                         
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="layui-form-item" style="margin-top:-15px">
                                                    <div class="layui-inline">
                                                        <label class="layui-form-label">方案版本:</label>
                                                        <div class="layui-input-inline">
                                                        <input type="tel" name="phone"  autocomplete="off" class="layui-input solutionVersion"  disabled value="` + solutioninfoList[i].solutionVersion + `" >
                                                           
                                                        </div>
                                                    </div>
                                                            <div class="layui-inline">
                                                                <label class="layui-form-label">开发单位:</label>
                                                                <div class="layui-input-inline">
                                                                    <input type="tel" name="phone"  autocomplete="off"  disabled class="layui-input kfdevelopOrgan"  value="` + solutioninfoList[i].developOrgan + `">
                                                                </div>
                                                            </div>
                                                    <div class="layui-inline" style="margin-left:16px;">
                                                        <label class="layui-form-label" style="width: 130px">开发单位负责人:</label>
                                                        <div class="layui-input-inline">
                                                            <!--<div class="layui-input-inline" style="width: 250px">-->
                                                                             <!--<select xm-select="staffselect" xm-select-search="" xm-select-max="2">-->

                                                                                     <!--</select>-->
                                                                    <!--</div>-->
                                                            <input type="tel" name="phone"  autocomplete="off" class="layui-input staffvalue" disabled value="` + solutioninfoList[i].developLeaderName + `" >
                                                               
                                                        </div>
                                                    </div>
                                                </div>
                                            <div class="change-btn solutioneditID" onclick="editbasicinfo(this)" data-edit="` + solutioninfoList[i].id + `">
                                                <i class="iconfont icon-bianji"></i>
                                            </div>
                                        </div>`;
        if(versionFlag==6){

                $("#pj-basic-info-older .info-box").html(infohtml);
                $("#pj-basic-info-older .change-btn").remove();

        }else{
                $("#pj-basic-info .info-box").html(infohtml);

                var  developLeader = solutioninfoList[i].developLeader.split(",");
                GetqueryUserBy("staffselect",developLeader,1);
                showsolutionBtn()
        }



        var   staffVlaueCon = solutioninfoList[i].developerName;            // 分配开发人员姓名

        var staffVlaueConArr = solutioninfoList[i].developer.split(",");  // 分配开发人员id

        if(staffVlaueCon.length>0){         // 判断有值的话 就渲染分配开发人员DOM

            var staffHTML = `<div class="edit-staff-box">
                                <div class="edit-staff-content">
                                    <div class="layui-inline">
                                        <label class="layui-form-label">开发人员:</label>
                                        <div class="layui-input-inline" style="width:600px">
                                            <input type="tel" name="phone"  autocomplete="off" disabled style="border: 0px" class="layui-input verify-value staff-content"  value="`+solutioninfoList[i].developerName+`">
                                        </div>
                                    </div>
                                </div>
                            <div class="change-btn" onclick="editsatff(this)">
                                <i class="iconfont icon-bianji"></i>
                            </div>
                        </div>`;
            if(versionFlag==6){

                $("#pj-staffvalue-older .staff-box-edit-done").html(staffHTML);
                $("#pj-staffvalue-older .levelTips").hide();
                $("#pj-staffvalue-older .addItem-box").hide();
                $("#pj-staffvalue-older .change-btn").remove();

            }else{
                $("#pj-staffvalue .staff-box-edit-done").html(staffHTML);
                $("#pj-staffvalue .levelTips").hide();
                $("#pj-staffvalue .addItem-box").hide();
                showstaffbtn();
                GetqueryUserBy("developerName_select",staffVlaueConArr,3);       // 勾选已选数据

            }

            verifyNum(8);

        }

    }

}


// 项目概述详情
function projectDetail(overviewList, overviewaAuditList,versionFlag) {
    if (overviewList.length < 1) {
        return;
    }
    if(overviewaAuditList.length>0){
        auditContent("#pj-overview", overviewaAuditList);
    }
    if(versionFlag==6){                             // versionFlag  旧版本
        $("#pj-overview-older .levelTips").hide();
    }else{
        $("#pj-overview .levelTips").hide();
        $("#pj-overview .addItem-box").hide();
    }
    verifyNum(1);

    for (var i = 0; i < overviewList.length; i++) {
        var overviewHTML = `<div class="overview-box edit-back-box">
                                <div class="edit-con-box-btn">
                                    <div class="edit-btn" onclick="editOverview(this)" data-edit="` + overviewList[i].id + `"><i class="iconfont icon-bianji"></i></div>
                              </div> 
                            <div class="secLevel">
                                <div class="pj-item-body-top">
                                    <p class="editTitle">项目背景</p>
                                    <div class="editOprate">

                                    </div>
                                </div>
                                <div class="pj-item-body-bottom pj-background">
                                        <p>` + overviewList[i].projectBackground + `</p>
                                </div>
                            </div>
                            <div class="secLevel">
                                <div class="pj-item-body-top">
                                    <p class="editTitle">系统现状</p>
                                    <div class="editOprate">
                                    </div>
                                </div>
                                <div class="pj-item-body-bottom systemCurrent">
                                        <p>` + overviewList[i].systemCurrent + `</p>
                                </div>
                            </div>
                            <div class="secLevel">
                                <div class="pj-item-body-top">
                                    <p class="editTitle">建设目标</p>
                                    <div class="editOprate">

                                    </div>
                                </div>
                                <div class="pj-item-body-bottom buildGoal">
                                    <p>` + overviewList[i].buildGoal + `</p>
                                </div>
                            </div>
                            <div class="secLevel">
                                <div class="pj-item-body-top">
                                    <p class="editTitle">建设内容</p>

                                </div>
                                <div class="pj-item-body-bottom buildContent">
                                    <p>` + overviewList[i].buildContent + `</p>
                                </div>
                            </div>
                        </div>`;

        if(versionFlag==6){

             $("#edit-box-overview-older").html(overviewHTML);
             $("#edit-box-overview-older .edit-btn").hide()

        }else{
            showoverviewbtn();
            $("#edit-box-overview").html(overviewHTML);
        }


    }



}

// 需求分析详情
function DetailDemanalysis(demanalysisList, demanalysisAuditList,versionFlag) {

    var savebutton = $("#pj-demandAnalysis .addItem-box");

    if (demanalysisList.length < 1) {
        savebutton.show();
        return;
    }
    if(demanalysisAuditList.length>0){
        auditContent("#pj-demandAnalysis", demanalysisAuditList);
    }
if(versionFlag==6){

    $("#pj-demandAnalysis-older .levelTips").hide();

}else{
    $("#pj-demandAnalysis .levelTips").hide();
    savebutton.hide();
}

    verifyNum(2);
    for (var i = 0; i < demanalysisList.length; i++) {
        var demanHtml = `  <div class="box-content-deman edit-back-box">
                                <div class="edit-con-box-btn">
                                    <div class="edit-btn"  onclick="editdemanna(this)" data-edit="` + demanalysisList[i].id + `"><i class="iconfont icon-bianji"></i></div>
                                 </div> 
                                <div class="secLevel">
                                    <div class="pj-item-body-top">
                                        <p class="editTitle">功能角色分析</p>

                                    </div>
                                    <div class="pj-item-body-bottom">
                                        <p class="functionalRoleAnalysis">` + demanalysisList[i].functionalRoleanalysis + `</p>
                                    </div>
                                </div>
                                <div class="secLevel">
                                    <div class="pj-item-body-top">
                                        <p class="editTitle">业务需求</p>
                                    </div>
                                    <div class="pj-item-body-bottom">
                                        <p class=" businessRequirements">` + demanalysisList[i].businessRequirements + `</p>
                                    </div>
                                </div>
                                <div class="secLevel">
                                    <div class="pj-item-body-top">
                                        <p class="editTitle">数据资源整合</p>

                                    </div>

                                    <div class="pj-item-body-bottom">
                                        <p class="dataIntegration">` + demanalysisList[i].dataIntegration + `</p>
                                    </div>
                                </div>
                            </div>`;

        if(versionFlag==6){

            $("#edit-box-deman-older").html(demanHtml);
            $("#edit-box-deman-older .edit-btn").hide();

        }else{
            $("#edit-box-deman").html(demanHtml);
            showoverviewbtn();
        }



    }



}

// 架构设计详情
function DetailArchidesign(saveArchidesign, archidesignAuditList,versionFlag) {
    var savebutton = $("#pj-design .addItem-box");
    var editbutton = $("#pj-design .editCon-box-three");
    if (saveArchidesign.length < 1) {
        return;
    }
    savebutton.hide();
    if(versionFlag==6){
        $("#pj-design-older .levelTips").hide();
    }else{
        $("#pj-design .levelTips").hide();
        $("#new-add-design").hide();
        editbutton.show();
    }


    if(archidesignAuditList.length>0){
        auditContent("#pj-design", archidesignAuditList);
    }

    verifyNum(3);
    for (var i = 0; i < saveArchidesign.length; i++) {
        var designHTML = `<div class="new-add-destail edit-back-box">
                                     <div class="edit-con-box-btn">
                                    <div class="edit-btn" onclick="designEditdata(this)" data-edit="` + saveArchidesign[i].id + `"><i class="iconfont icon-bianji"></i></div>
                                 </div> 
                            <div class="secLevel">
                                <div class="pj-item-body-top">
                                    <p class="editTitle">总体架构</p>
                                </div>
                                <div class="pj-item-body-bottom">
                                    <p class="frameworkdesign">` + saveArchidesign[i].frameworkDesign + `</p>
                                </div>
                            </div>
                            <div class="secLevel">
                                <div class="pj-item-body-top" >
                                    <p class="editTitle">网络拓扑图</p>
                                </div>
                                <div class="pj-item-body-bottom">
                                    <p class="img-url" style="display: none"></p>
                                    <div class="layui-upload-list">
                                        <img class="layui-upload-img" src="` + saveArchidesign[i].topologicalPic + `" id="networkImg">
                                        <p class="demoText"></p>
                                    </div>
                                </div>
                            </div>
                            <div class="secLevel">
                                <div class="pj-item-body-top">
                                    <p class="editTitle">系统建设原则及路线</p>
                                </div>
                                <div class="pj-item-body-bottom">
                                    <p class="principlesroutes">` + saveArchidesign[i].principlesRoutes + `</p>
                                </div>
                            </div>

                        </div>`;
        if(versionFlag==6){

            $("#new-add-back-older").html(designHTML);
            $("#new-add-back-older .edit-btn").hide();
        }else{
            $("#new-add-back").html(designHTML);
            showoverviewbtn();
        }




    }


}

// 微服务设计详情
function Detailmicroservice(microserviceList, microserviceAuditList,versionFlag) {

    var serviceArr = []; // 服务类型集合

    var savebutton = $("#pj-service .addItem-box");

    var editbutton = $("#pj-service .editCon-box-four");

    var editbtnolder = $("#pj-service-older .edit-btn");


    if (microserviceList.length < 1) {
        return
    }

    if(microserviceAuditList.length>0){
        auditContent("#pj-service", microserviceAuditList,5);
    }

    var businessoptionID  = null;  // 通用业务服务
    var technicaloptionID  = null;  // 基础技术服务

    if(versionFlag==6){
        $("#pj-service .service-box").empty();
        editbtnolder.hide();
        $("#pj-service-older .levelTips").hide();
        businessoptionID = "business_desolder";
        technicaloptionID = "technical_desolder"
    }else{
        editbutton.show();
        $("#pj-service .service-box-new").empty();
        $("#pj-service .service-box-new").show();
        $("#pj-service .levelTips").hide();
        businessoptionID = "business_des";
        technicaloptionID = "technical_des"
    }

    verifyNum(5);

    for (var i = 0; i < microserviceList.length; i++) {

        var generalServicelabe = microserviceList[i].generalService.split(","); //   基础服务
        var basicServicelable = microserviceList[i].basicService.split(",");  // 通用业务服务
        //
        // console.log("通用业务服务",generalServicelabe);
        // console.log("基础服务",basicServicelable);
        serviceArr.push(microserviceList[i].serviceType);
        editbutton.attr("data-edit", microserviceList[i].id);
        var serviceHtml = `<div class="pj-item-body service-list layui-form microserviceList`+i+`" data-id="`+i+`">
                                
                              <div class="edit-con-box-btn">
                                <div class="edit-btn"  onclick="editservice(this)" data-edit="` + microserviceList[i].id + `"><a href="#pj-service"><i class="iconfont icon-bianji"></i></a></div>
                                <div class="del-template" onclick="delContent(this,1)" data-edit="` + microserviceList[i].id + `"><i class="iconfont icon-icon"></i></div>
                              </div>                  
                         <div class="secLevel">
                         <div class="pj-item-body-top layui-form">
                          <div class="deploy">
                        <p class="editTitle">服务名称</p>
                            <p class="serviceName">` + microserviceList[i].serviceName +  `</p>
                                        
                        </div>
                         </div>
                       
                    </div>
                    <div class="secLevel">
                        <div class="pj-item-body-top layui-form">
                            <div class="deploy">
                                <p class="editTitle">服务类型</p>
                                <div class="layui-input-inline option-left" style="width:180px" >
                                    <select name="quiz"  disabled class="serviceType` + i + `">
                                        <option value="3">应用服务</option>
                                        <option value="1">基础技术服务</option>
                                        <option value="2">通用业务服务</option>
                                       
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="secLevel">
                        <div class="pj-item-body-top">
                            <p class="editTitle">服务设计</p>
                        </div>
                        <div class="pj-item-body-bottom">
                                <p class="serviceDesign">` + microserviceList[i].serviceDesign + `</p>
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
                                <select xm-select="`+businessoptionID+``+i+`" disabled>
                                               
                                </select>
                            </div>
                        
                            <div class="common">基础技术服务(多选)</div>
                              <div class="box-select-technical layui-input-inline" style="margin:20px 0px;width: 100%">
                                <select xm-select="`+technicaloptionID+``+i+`" disabled>
                                                 
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
                                <p class="common">部署环境</p>
                                <div class="option-box">
                                <!--<p>` + microserviceList[i].deploymentEnvironment + `</p>-->
                                    <select name="quiz"  class="deploymentEnvironment" disabled>
                                        <option value="` + microserviceList[i].deploymentEnvironment + `">` + microserviceList[i].deploymentEnvironment + `</option>
                                    </select>
                                </div>
                            </div>
                            <div class="deploy">
                                <p class="common">运行资源</p>
                                <div class="option-box">
                                    <!--<p>` + microserviceList[i].runResource + `</p>-->
                                    <select name="quiz"  class="runResource" disabled>
                                        <option value="` + microserviceList[i].runResource + `">` + microserviceList[i].runResource + `</option>
                                    </select>
                                </div>
                            </div>            
                        </div>
                    </div>
                </div>
                </div>`;
        if(versionFlag==6){

            $(serviceHtml).appendTo("#pj-service-older .service-box");
            $("#pj-service-older .edit-con-box-btn").remove();
            GetserviceData(''+businessoptionID+''+i+'',''+technicaloptionID+''+i+'',basicServicelable,generalServicelabe,3);

        }else{

            $(serviceHtml).appendTo(".service-box-new");
            GetserviceData(''+businessoptionID+''+i+'',''+technicaloptionID+''+i+'',basicServicelable,generalServicelabe,3);
            editbth(i);
        }


        $(".serviceType" + i + " option[value = " + microserviceList[i].serviceType + "]").attr("selected", "selected");



        form.render();

    }
    // initnormalize()



}

// 显示编辑按钮
function editbth() {

    $(".service-list").hover(function () {
        $(this).find(".edit-con-box-btn").show()

    }, function () {

        $(this).find(".edit-con-box-btn").hide()
    })
}

// 应用设计详情
function Detailapplicationdesign(applicationdesignList, applicationdesignAuditList,versionFlag) {

    var editbtn = $("#pj-application .editCon-box-five");


    if (applicationdesignList.length < 1) {
        return;
    }

    if(applicationdesignAuditList.length>0){
        auditContent("#pj-application", applicationdesignAuditList,5);
    }

    var qdservice = null;   // 前端服务化集成ID

    if (versionFlag==6){
        $(" #pj-application .application-box").empty();
        $("#pj-application-older .levelTips").hide();

        qdservice = "qd_select_older";

    } else {
        $(" #pj-application .application-box-new").empty();
        $(" #pj-application .application-box-new").show();
        $("#pj-application .levelTips").hide();

        qdservice = "qd_select";
    }


    verifyNum(6);
    var   selcetValue = null;
    for (var i = 0; i < applicationdesignList.length; i++) {

        selcetValue = applicationdesignList[i].frontIntegration.split(",");

        var appHtml = `<div class="pj-item-body qdservice-box service-list layui-form appliction-list`+i+`"  data-id="`+i+`">
                <div class="edit-con-box-btn">
                  <div class="edit-btn" onclick="editapplication(this)" data-edit="` + applicationdesignList[i].id + `"><a href="#pj-application"><i class="iconfont icon-bianji"></i></a></div>
                  <div class="del-template" onclick="delContent(this,2)" data-edit="` + applicationdesignList[i].id + `"><i class="iconfont icon-icon"></i></div>
              </div>
                            <div class="secLevel">
                                    <div class="deploy">
                                      <p class="editTitle">应用名称</p>
                                        <p class="editTitle applicationName">` + applicationdesignList[i].applicationName + `</p>
                                            
                                    </div>
                             </div>   
        <div class="secLevel">
            <div class="pj-item-body-top">
                <p class="editTitle">应用概述</p>
            </div>
            <div class="pj-item-body-bottom">
              <p class="applicationOverview">` + applicationdesignList[i].applicationOverview + `</p>
            </div>
        </div>
        <div class="secLevel">
            <div class="pj-item-body-top">
                <p class="editTitle">应用UI/UE规划</p>
            </div>
            <div class="pj-item-body-bottom" id="">
             <div class="applicationPlanning">` + applicationdesignList[i].applicationPlanning + `</div>
            </div>
        </div>
        <div class="secLevel">
            <div class="pj-item-body-top">
                <p class="editTitle">应用功能逻辑</p>
            </div>
            <div class="pj-item-body-bottom" id="">
               <p class="applyLogicdiagram">` + applicationdesignList[i].applyLogicdiagram + `</p>
            </div>
        </div>
        <div class="secLevel">
            <div class="pj-item-body-top" style="margin-top:30px;">
                <div class="deploy" style="width:100%;margin-bottom: 20px">
                    <p class="editTitle">前端服务化能力集成</p>
                                     <div>
                                            <select xm-select="`+qdservice+``+i+`" disabled="disabled" class="frontIntegration`+i+`">
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
    </div>`;

       if(versionFlag==6){
           $(appHtml).appendTo("#pj-application-older .application-box");
           $("#pj-application-older .edit-con-box-btn").remove();
           formSelects.render(''+qdservice+''+i+'');
           formSelects.value(''+qdservice+''+i+'', selcetValue, true);

       }else{
           $(appHtml).appendTo(".application-box-new");
           formSelects.render(''+qdservice+''+i+'');
           formSelects.value(''+qdservice+''+i+'', selcetValue, true);
       }




    }

    editbth();

}

// 风险解决方案详情
function Detaildeployrun(risksolutionList, risksolutionAuditList,versionFlag) {

    var showbox = $("#pj-solution .edit-solution-box");

    var savebtn = $("#pj-solution .addItem-box");

    if (risksolutionList.length < 1) {
        savebtn.show();
        return
    }

    if(risksolutionAuditList.length>0){
        auditContent("#pj-solution", risksolutionAuditList);
    }

    if(versionFlag==6){
        $("#pj-solution-older .levelTips").hide();
        $("#pj-solution-older .sumbit-button-box").hide();
        showbox.show();
    }else{
        $("#pj-solution .levelTips").hide();
        $("#pj-solution .sumbit-button-box").hide();
        $("#pj-solution .editCon-btn").show();
        savebtn.hide();
        showbox.show();
    }


    verifyNum(7);
    for (var i = 0; i < risksolutionList.length; i++) {
        var deployHTMKL = `<div class="secLevel">
                            <div class="pj-item-body-top">
                                <p class="editTitle">风险解决方案</p>
                                <div class="editOprate">
                                      <div class="editCon-btn" onclick="editsolution(this)" data-edit="${risksolutionList[i].id}">
                                                   <i class="iconfont icon-bianji" style="font-weight: 300;"></i>
                                                    
                                                </div>
                                </div>
                            </div>
                            <div class="pj-item-body-bottom"> 
                                <p class="verify-value riskSolution" name="pj_background "  id="edit-riskSolution">` + risksolutionList[i].riskSolution + `</p>
                            </div>
                        </div>
                          `;
        if(versionFlag==6){
                $("#pj-solution-older .edit-solution-box").html(deployHTMKL);
                $("#pj-solution-older .editCon-btn").remove();
        }else{
                $("#pj-solution .edit-solution-box").html(deployHTMKL);
            showsolution()
        }


    }


}

// 显示风险解决方案编辑按钮
function showsolution() {
    $(".edit-solution-box").hover(function () {
        $(this).find(".editOprate .editCon-btn").show();
    },function () {
        $(this).find(".editOprate .editCon-btn").hide();
    })
}

// 开发规范详情
function initnormalize() {
    var normalize = {
        "accessToken": accessToken,
    };
    xhsdk.ajax({
        type: "post",
        url: solution + "/dictionary/find",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(normalize),
        success: function (res) {

            if (res.code == 200) {
                if (res.length < 1) {
                    return;
                }
                $(".norm-content").text(res.data[3].content);
                var zy = `<option value="` + res.data[2].content + `">` + res.data[2].content + `</option>`;  // 运行资源
                $(zy).appendTo("#service1");
                for (var i = 0; i <= res.data.length; i++) {                                                 // 部署环境
                    if (i == 2) {
                        return;
                    }
                    var deployContent = `<option value="` + res.data[i].content + `">` + res.data[i].content + `</option>`;
                    $(deployContent).appendTo("#service");
                    form.render();
                }

            } else {
                layer.msg(res.data);
            }
        },
        error: function (msg) {
            layer.msg("请求出现错误!!");

        }
    });

}

var readstatus = null; // 是否阅读开发规范
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
    // 监听是否阅读规范
    form.on('checkbox(haveRead)', function (data) {
        readstatus = data.value;
        $(".notread span").text("已阅读");
        layer.msg("已阅读!", {
            icon: 1,
            time: 600
        }, function () {
            verifyNum(4);
            var index = layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            layer.closeAll();
        });
    })
});

//滚动
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


//删除模块
function delContent(_this,url) {
    var delurl = null;
    var elemID = null;
    var  listArr = []; // 数量容器
    if (url == 1) {
        delurl = solution + "/projectManagement/removeMicroservice"; // 微服务删除
        elemID = ".service-box-new"
    } else {
        delurl = solution + "/projectManagement/removeApplicationdesign"; // 应用删除
        elemID = ".application-box-new"
    }
    $(elemID).find(".service-list").each(function (i,n) {
        listArr.push(i)
    });

    if(listArr.length<=1){
        layer.msg("至少保留一项");
        return
    }else{
        layer.confirm('确认删除模块吗？', {
            btn: ['确认', '取消'] //按钮
        }, function () {
            var delConID = $(_this).data("edit");
            var delJson = {
                "accessToken": accessToken,
                "id": delConID
            };
            loadingTip.show();
            xhsdk.ajax({
                type: "post",
                url: delurl,
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(delJson),
                success: function (res) {
                    if (res.code == 200) {
                        loadingTip.hide();
                        elemID = null;
                        layer.msg("删除完成!", {icon: 1, time: 600}, function () {
                            $(_this).parent().parent().remove();
                            // GetitemDestail();
                        });
                    } else {
                        layer.msg(res.data);
                        loadingTip.hide();
                    }
                },
                error: function (msg) {
                    layer.msg("请求出现错误!!");
                    loadingTip.hide();
                }
            });
            // $(_this).parent().parent().parent().remove();
            // layer.msg("已删除");
            layer.close()
        }, function () {
            layer.msg("已取消")
        });
    }

}

/*********************************************************基本信息新增****************************************************************************/

// 新增基本信息
var edit_id = null; // 修改当前模块ID
//自定义验证规则
form.verify({
    project_Name: function (value) {
        if (value.length < 1) {
            return '请输入方案名称';
        }
    },
    kfdevelopOrgan: function (value) {
        if (value.length < 1) {
            return '请输入开发单位';
        }
    },
    makeUnit: function (value) {
        if (value.length < 1) {
            return '请输入编制单位';
        }
    },
    solutionVersion: function (value) {
        if (value.length < 1) {
            return '请输入方案版本';
        }
    },
    staffvalue: function (value) {
        if (value.length < 1) {
            return '请选择开发负责人';
        }
    }

});

var infoflag = 0; // 防止重复添加
form.on('submit(sumbit-info)', function (data) {

    if(infoflag==0){
        var developLeaderName = formSelects.value('staffselect', 'valStr');
        if(developLeaderName.length<1){
            layer.msg("请选择开发单位负责人！")
            return false;
        }
        basicinfo();
        infoflag = 1;
    }
    return false;
});

function basicinfo() {

    var project_Name = $("#project_Name").val();
    var makeUnit = $("#makeUnit").val();
    var solutionVersion = $("#solutionVersion").val();
    var kfdevelopOrgan = $("#kfdevelopOrgan").val();
    var staffvalue = $("#staffvalue").val();

    $(".box-tip").hide();
    $(".info-box").show();

    var solutioninfoURL = null; // 请求地址
    var savejson = {};
    if (edit_id == null) {                          // 新增操作
        savejson.id = addprojectID;
        solutioninfoURL = solution + "/solutioninfo/add";
    } else {                                      // 修改操作
        savejson.id = edit_id;
        $(".change-btn").attr("data-edit", edit_id);
        solutioninfoURL = solution + "/solutioninfo/modify";
    }
    savejson.accessToken = accessToken;
    savejson.projectId = projectid;
    savejson.solutionName = $("#project_Name").val();
    savejson.makeUnit = $("#makeUnit").val();        // 编制单位
    savejson.makeUnitName = $("#makeUnit").val();
    savejson.solutionVersion = $("#solutionVersion").val();
    savejson.developOrgan = $("#kfdevelopOrgan-new").val();         // 开发单位
    savejson.developer = formSelects.value('developerName_select', 'valStr');   // 开发人员id
    savejson.createBy = userName;
    savejson.developLeaderName = formSelects.value('staffselect', 'nameStr'); // 项目负责人姓名
    savejson.developLeader = formSelects.value('staffselect', 'valStr');      // 项目负责人id
    savejson.developerName = formSelects.value('developerName_select', 'nameStr');       // 开发人员姓名
    loadingTip.show();
    xhsdk.ajax({
        type: "post",
        url: solutioninfoURL,
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(savejson),
        success: function (res) {
            if(res.data == false){
                infoflag = 0;
                loadingTip.hide();
                layer.msg("保存失败,请重试!");
                return
            }
            if (res.code == 200 && res.data!==null) {
                loadingTip.hide();
                if (edit_id == null) {
                    $(".change-btn").attr("data-edit", res.data);
                }
                layer.msg("保存完成!", {icon: 1, time: 600}, function () {
                    GetitemDestail(null,1);
                    $(".editOprate").show();
                    showsolutionBtn();
                    edit_id = null;
                    verifyNum(0);
                });

            } else {
                infoflag = 0;
                loadingTip.hide();
                layer.msg("保存失败,请重试!");
            }
        },
        error: function (msg) {
            infoflag = 0;
            loadingTip.hide();
            layer.msg("请求出现错误!!");
        }
    });
}

//显示基本信息编辑按钮
function showsolutionBtn(){
    $(".info-box").hover(function () {
        $(".change-btn").show();
    }, function () {
        $(".change-btn").hide();
    });
}



//修改基本信息
function editbasicinfo(_this) {
    infoflag = 0;
    var editid = $(_this).data("edit");
    edit_id = editid;
    $(".box-tip").show();
    $("#project_Name").val($(".project_Name").val());
    $("#makeUnit").val($(".makeUnit").val());
    $("#solutionVersion").val($(".solutionVersion").val());
    $("#staffvalue").val($(".staffvalue").val());
    $("#kfdevelopOrgan-new").val($(".kfdevelopOrgan").val());
    $(".close-deploy").show();
    $("#pj-basic-info .info-box").hide();
}

// 取消

function closebasicinfo() {

    $("#pj-basic-info .box-tip").hide();

    $("#pj-basic-info .info-box").show();
}

/*********************************************************分配开发人员新增****************************************************************************/

//  新增分配开发人员
$("#pj-staffvalue .addItem-box").click(function () {
    $("#pj-staffvalue .levelTips").hide();
    $(".add-staff-box").show();
    GetqueryUserBy("developerName_select",null,2)     // 插入分配开发人员数据
});


function savestaff() {
    var staffValue  = formSelects.value('developerName_select', 'nameStr');
    if (staffValue.length<1) {
        layer.msg("请分配开发人员!");
        return
    }
    $(".add-staff-box").hide();
    $(".staff-box-edit-done").show();
    edit_id =  $(".solutioneditID").data("edit"); // 基本信息ID 不为NULL 就是修改操作！！

    basicinfo();  // 拿到基本信息返回的ID  来进行新增和修改分配开发人员操作
    $("#pj-staffvalue .addItem-box").hide();
    verifyNum(8);
    showstaffbtn();


}

// 显示编辑按钮
function showstaffbtn() {
    $(".staff-box-edit-done").hover(function () {
        $(this).css("border", "1px solid #ccc");
        $(this).find(".change-btn").show()
    }, function () {
        $(this).css("border", "1px solid #fff");
        $(this).find(".change-btn").hide()
    });
}

// 修改开发人员
function editsatff(_this) {

    var editstaffid = $(_this).data("edit");
    $("#staffvalue_two").val($(".staff-content").val());

    $("#pj-staffvalue .staff-box-edit-done").hide();
    $("#pj-staffvalue .add-staff-box").show();


}

// 关闭弹出层
function closebox() {
    $(".add-staff-box").hide();
    $(".staff-box-edit-done").show();
}




/*********************************************************项目概述新增****************************************************************************/

//自定义验证规则
form.verify({
    pj_background: function (value) {
        if (value.length < 1) {
            return '请输入项目背景';
        }
    },
    systemCurrent: function (value) {
        if (value.length < 1) {
            return '请输入系统现状';
        }
    },
    buildGoal: function (value) {
        if (value.length < 1) {
            return '请输入建设目标';
        }
    },
    buildContent: function (value) {
        if (value.length < 1) {
            return '请输入建设内容';
        }
    }
    , content: function (value) {
        layedit.sync(editIndex);
    }
});

//监听提交
var overviewFlag = 0; // 防止重复添加
form.on('submit(save-sumbit)', function (data) {
    if(overviewFlag==0){
        overviewsumbit();
        overviewFlag = 1;
    }
    return false;
});

var overvieweditID = null;  // 项目概述修改ID
function overviewsumbit() {

    var bk = $("#pj-background").children("textarea").val();
    var systemCurrent = $("#systemCurrent").children("textarea").val();
    var buildGoal = $("#buildGoal").children("textarea").val();
    var buildContent = $("#buildContent").children("textarea").val();
    var infoJson = {};
    infoJson.solutionId = additemId;
    infoJson.projectBackground = bk;
    infoJson.systemCurrent = systemCurrent;
    infoJson.buildGoal = buildGoal;
    infoJson.buildContent = buildContent;
    infoJson.accessToken = accessToken;
    if (overvieweditID !== null) {
        infoJson.id = overvieweditID;
        // infoJson.solutionId=parent.itemid;
    }
    loadingTip.show();
    xhsdk.ajax({
        type: "post",
        url: solution + "/projectManagement/saveOverview",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(infoJson),
        success: function (res) {
            if (res.code == 200) {

                $("#project-overview-box").hide();
                $("#edit-box-overview").show();
                $(".editCon-box").attr("data-edit", res.data);    //修改 ID

                GetitemDestail(null,2);
                verifyNum(1);
                loadingTip.hide();
                layer.msg("保存完成!", {icon: 1, time: 600}, function () {
                });
            } else {
                overviewFlag = 0;
                layer.msg(res.data);
            }
        },
        error: function (msg) {
            overviewFlag = 0;
            layer.msg("请求出现错误!!");

        }
    });
}

//取消
$(".cancelEditor").click(function () {

    $("#project-overview-box").hide();
    $("#edit-box-overview").show();
})

// 项目概述修改
function editOverview(_this) {

    overviewFlag = 0;
    overvieweditID = $(_this).data("edit");
    var bk = $("#pj-background").children("textarea").val($(".pj-background").children("p").text());
    var systemCurrent = $("#systemCurrent").children("textarea").val($(".systemCurrent").children("p").text());
    var buildGoal = $("#buildGoal").children("textarea").val($(".buildGoal").children("p").text());
    var buildContent = $("#buildContent").children("textarea").val($(".buildContent").children("p").text());

    $("#project-overview-box").show();
    $("#edit-box-overview").hide();

}

// 显示项目概述编辑按钮
function showoverviewbtn() {

    $(".edit-back-box").hover(function () {
        $(this).find(".edit-con-box-btn").show();
    }, function () {
        $(this).find(".edit-con-box-btn").hide();
    })
}


// 添加项目概述
function additemTemplate() {

    $("#project-overview-box").show();
    $("#pj-overview .levelTips").hide();
}


/*********************************************************需求分析新增****************************************************************************/

//自定义验证规则
form.verify({
    RoleAnalysis: function (value) {
        if (value.length < 1) {
            return '请输入功能角色分析';
        }
    },
    Requirements: function (value) {
        if (value.length < 1) {
            return '请输入业务需求';
        }
    },
    dataIntegration: function (value) {
        if (value.length < 1) {
            return '请输入数据资源整合';
        }
    }
});

//监听提交
var demanFlag = 0; // 防止重复添加
form.on('submit(sumbit-deman)', function (data) {
    if(demanFlag==0){
        demansumbit();
        demanFlag = 1;
    }
    return false;

});

var demanEdit = null;  // 修改ID
function demansumbit() {
    var bk = $("#functionalRoleAnalysis").children("textarea").val();
    var systemCurrent = $("#businessRequirements").children("textarea").val();
    var buildGoal = $("#dataIntegration").children("textarea").val();


    var infoJson = {};
    infoJson.solutionId = additemId;
    infoJson.functionalRoleAnalysis = bk;
    infoJson.businessRequirements = systemCurrent;
    infoJson.dataIntegration = buildGoal;
    if (demanEdit !== null) {
        infoJson.id = demanEdit;
    }
    loadingTip.show();
    xhsdk.ajax({
        type: "post",
        url: solution + "/projectManagement/saveDemanalysis",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(infoJson),
        success: function (res) {
            if (res.code == 200) {
                GetitemDestail(null,3);
                $("#demandAnalysis-content-box").hide();
                $("#pj-demandAnalysis .addItem-box").css("display", "none");
                layer.msg("保存完成!", {icon: 1, time: 600}, function () {
                    verifyNum(2)
                });
            } else {
                demanFlag = 0;
                layer.msg(res.data);
                loadingTip.hide();

            }
        },
        error: function (msg) {
            demanFlag = 0;
            layer.msg("请求出现错误!!");
            loadingTip.hide();


        }
    });
}

// 需求分析修改
function editdemanna(_this) {

    demanFlag = 0;
    demanEdit = $(_this).data("edit");

    $("#functionalRoleAnalysis").children("textarea").val($(".functionalRoleAnalysis").text());

    $("#businessRequirements").children("textarea").val($(".businessRequirements").text());

    $("#dataIntegration").children("textarea").val($(".dataIntegration").text());


    $("#demandAnalysis-content-box").show();

    $("#pj-demandAnalysis .box-content-deman").hide();

}

// 需求分析新增
function adddemandAnalysis() {
    $("#pj-demandAnalysis .levelTips").hide();
    $("#demandAnalysis-content-box").show();
}

//取消
$("#demandAnalysis-content-box .close-deman-btn").click(function () {
    $("#demandAnalysis-content-box").hide();
    $("#pj-demandAnalysis .box-content-deman").show();
})


/*********************************************************架构设计新增****************************************************************************/



//自定义验证规则
form.verify({
    frameworkdesign: function (value) {
        if (value.length < 1) {
            return '请输入总体架构';
        }
    },
    principlesroutes: function (value) {
        if (value.length < 1) {
            return '请输入系统建设原则及路线';
        }
    }
});


// 监听提交
var designFlag = 0;  // 防止重复提交
form.on('submit(save-design)', function (data) {
    if(designFlag==0){
        designsumbitData();
        designFlag = 1;
    }
    return false;

});

var designEdit = null; // 修改ID
var fileURL = null;     // 图片地址
function designsumbitData() {
    var frameworkdesign = $("#frameworkdesign").children("textarea").val();
    var principlesroutes = $("#principlesroutes").children("textarea").val();


    var infoJson = {};
    // infoJson.solutionId=moduleId;
    infoJson.solutionId = additemId;
    infoJson.frameworkdesign = frameworkdesign;
    infoJson.topologicalpic = $("#topologicalpic").text();
    infoJson.principlesroutes = principlesroutes;
    infoJson.accessToken = accessToken;
    if (designEdit !== null) {
        infoJson.id = designEdit
    }
    loadingTip.show();
    xhsdk.ajax({
        type: "post",
        url: solution + "/projectManagement/saveArchidesign",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(infoJson),
        success: function (res) {
            if (res.code == 200) {
                GetitemDestail(null,4);
                $("#new-add-back").show();
                $("#new-add-design").hide();
                $("#pj-design .addItem-box").css("display", "none");
                layer.msg("保存完成!", {icon: 1, time: 600}, function () {
                    verifyNum(3)
                });
            } else {
                designFlag = 0;
                layer.msg(res.data);
                loadingTip.hide();
            }
        },
        error: function (msg) {
            designFlag = 0;
            layer.msg("请求出现错误!!");
            loadingTip.hide();

        }
    });
}


// 架构设计修改
function designEditdata(_this) {
    designFlag = 0;
    $("#new-add-design").show();
    $("#new-add-back").hide();
    designEdit = $(_this).data("edit");


    $("#frameworkdesign").children("textarea").val($(".frameworkdesign").text());
    $("#topologicalpic").text($("#networkImg")[0].src);     // 图片地址


    $("#demo1").attr("src", $("#networkImg")[0].src);
    $("#principlesroutes").children("textarea").val($(".principlesroutes").text())

}


//取消架构设计
$("#new-add-design .cancelEditor").click(function () {
    $("#new-add-design").hide();
    $("#new-add-back").show();
});

var fileListCon ;
// 网络结构图上传
upload.render({
    elem: '#uploadIMG',
    auto: false,
    exts: 'jpg|png|gif|bmp|jpeg',
    choose: function (obj) {
        obj.preview(function (index, file, result) {
            fileListCon = file;
            $('#demo1').attr('src', result); //图片链接（base64）
            $("#topologicalpic").attr("data-imgurl", file.name);
            uploadAppIcon();
        });
    }
});

function uploadAppIcon() {

    var formData = new FormData();
    formData.append("file",fileListCon);
    formData.append("serviceID","f3295b7e695145509ce6f55de679f1e1");



    loadingTip.show();
    xhsdk.ajax({
        url: "xinghuo-apaas-fileservice/breakMultiUploads",
        type: "POST",
        contentType: false,
        processData: false,
        mimeType: "multipart/form-data",
        data: formData,
        success: function (res) {

            var res = JSON.parse(res);

            if (res.code == 200) {

                $("#topologicalpic").text(res.result[0].data.fileUrl);

                loadingTip.hide();

            } else {
                loadingTip.hide();
                layer.msg("图片上传失败，请重新上传！");
                return

            }
        },
        error: function (msg) {
            loadingTip.hide();
            layer.msg("请求出现错误!!");
            console.log("Error:", msg);
        }
    });

}


//架构设计添加
function pjdesign() {
    $("#pj-design .levelTips").hide();
    $("#new-add-design").show();

}

/*********************************************************微服务设计新增****************************************************************************/


//自定义验证规则
form.verify({
    serviceName: function(value){
        if(value.length < 1){
            return '请输入服务名字';
        }
    },
    serviceType: function(value){
        if(value.length < 1){
            return '请选择服务类型';
        }
    },
    serviceDesign: function(value){
        if(value.length < 1){
            return '请输入服务设计';
        }
    },
    deploymentEnvironment: function(value){
        if(value.length < 1){
            return '请选择部署环境';
        }
    } ,
    runResource: function(value){
        if(value.length < 1){
            return '请选择运行资源';
        }
    }
    ,content: function(value){
        layedit.sync(editIndex);
    }
});





//监听提交
var servicerepeat = 0;  //防止重复提交
form.on('submit(save-sumbit-serivce)', function(data){
    if(servicerepeat==0){
        ServicesumbitData();
        servicerepeat = 1;
    }
    return false;
});

var serviceEdit = null;  // 微服务设计修改ID

function ServicesumbitData() {

    var infoJson = {};
    if(serviceEdit!==null){
        infoJson.id=serviceEdit
    }
    infoJson.solutionId=additemId;
    infoJson.serviceType= $(".serviceType").val();
    infoJson.serviceDesign=$("#serviceDesign").children("textarea").val();
    infoJson.basicService=formSelects.value('business_select', 'valStr');
    infoJson.generalService=formSelects.value('technical_select', 'valStr');
    infoJson.serviceName = $("#serviceName").val();
    infoJson.deploymentEnvironment = $(".deploymentEnvironment").val();
    infoJson.runResource =  $(".runResource").val();
    infoJson.accessToken = accessToken;
    loadingTip.show();
    xhsdk.ajax({
        type: "post",
        url: solution + "/projectManagement/saveMicroservice",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(infoJson),
        success: function (res) {
            if (res.code == 200) {
                layer.msg("保存完成!", {icon: 1, time: 600}, function () {
                    $("#pj-service .service-add-box").hide();
                    $("#pj-service .service-box").show();
                    GetitemDestail(null,5);
                    editbth();
                    verifyNum(5);

                });
            } else {
                servicerepeat = 0;
                loadingTip.hide();
                layer.msg(res.data);
            }
        },
        error: function (msg) {
            servicerepeat = 0;
            layer.msg("请求出现错误!!");
            loadingTip.hide();

        }
    });

}

// 取消微服务设计
function cancelselect(){

    $("#pj-service .service-box-new").show();
    $(" #pj-service .service-add-box").hide();

}



// 删除已选服务
function delservice(_this){
    $(_this).parent().remove();
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

//微服务设计添加
function pjservice(flag) {

    servicerepeat = 0;
    serviceEdit = null;
    GetserviceData("business_select","technical_select",null,null,1);

    // $(".service-add-box input").val("");
    $("#pj-service .service-add-box textarea").val("");
    $("#pj-service .levelTips").hide();
    $("#pj-service .service-add-box").show();


}

// 新增和修改微服务设计模块
function addserviceTemplate(name,type,design,business,technical,deploymentEnvironment,runResource,_this) {

    // console.log("通用业务服务",Businesslable)
    // console.log("基础技术服务",technicallable)
    var addHtml = `
                    <div class="secLevel">
                        <div class="deploy">
                            <p class="editTitle">服务名称</p>
                            <div class="layui-input-inline" style="width: 300px;margin-left: 7px;">
                                <input type="tel" name="phone" lay-verify="serviceName" autocomplete="off" class="layui-input" id="serviceName" value="`+name+`">
                            </div>
                        </div>
                    </div>
                    <div class="secLevel">
                        <div class="pj-item-body-top ">
                            <div class="deploy">
                                <p class="editTitle">服务类型</p>
                                <div class="layui-input-inline option-left" style="width: 300px">
                                    <select name="quiz"  class="serviceType" id="service-option" lay-verify="serviceType">
                                        <option value=""></option>
                                        <option value="1">基础技术服务</option>
                                        <option value="2">通用业务服务</option>
                                        <option value="3">应用服务</option>
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
                            <textarea class="layui-textarea serviceDesign" lay-verify="serviceDesign" placeholder="请输入服务设计">`+design+`</textarea>
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
                                <select xm-select="business_select">
                                                   
                                </select>
                            </div>
                             
                            <div class="common">基础技术服务(多选)</div> 
                             <div class="box-select-technical layui-input-inline" style="margin:20px 0px;width: 100%">
                                <select xm-select="technical_select">
                                                 
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
                                    <p class="common">部署环境</p>
                                    <div class="option-box">
                                        <select name="quiz"  id="new-deploy" class="deploymentEnvironment" lay-verify="deploymentEnvironment">
                                            <option value=""></option>
                                            <option value="移动信息网">移动信息网</option>
                                            <option value="公安信息网">公安信息网</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="deploy">
                                    <p class="common">运行资源</p>
                                    <div class="option-box">
                                        <select name="quiz" id="new-runResource"  class="runResource" lay-verify="runResource">
                                            <!--<option value=""></option>-->
                                            <option value="4G/6核">4G/6核</option>
                                        </select>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="sumbit-button">
                        <a class="btn-center" lay-submit="" lay-filter="save-sumbit-serivce">保存</a>
                        <a class="btn-center service-close-btn" onclick="cancelselect()">取消</a>
                    </div>
                `;

    $("#pj-service .service-add-box").html(addHtml);
    var Businesslable = business.split(",");   // 获取依赖的基础服务-通用业务服务
    var technicallable = technical.split(","); // 获取依赖的基础服务-基础技术服务
    GetserviceData("business_select","technical_select",Businesslable,technicallable,3);
    $("#service-option  option[value = " + type + "]").attr("selected", "selected");
    $("#new-deploy  option[value = " + deploymentEnvironment + "]").attr("selected", "selected");
    form.render("select");

}


//微服务修改
function editservice(_this) {

    servicerepeat = 0;
    $("#pj-service .service-box-new").hide();
    $("#pj-service .service-add-box").show();

    serviceEdit = $(_this).data("edit");

    var serviceName = $(_this).parent().parent().find(".serviceName").text();
    var serviceDesign = $(_this).parent().parent().find(".serviceDesign").text();
    var servicetype = $(_this).parent().parent().find(".option-left").children("select").val();
    var deploymentEnvironment = $(_this).parent().parent().find(".deploymentEnvironment").val();
    var runResource = $(_this).parent().parent().find(".runResource").val();

    var idnumber = $(_this).parent().parent().data("id");
    var  businCon   = formSelects.value('business_des'+idnumber+'', 'valStr');   // 通用业务服务
    var  technicalCon   = formSelects.value('technical_des'+idnumber+'', 'valStr');   // 基础技术服务

    addserviceTemplate(serviceName,servicetype,serviceDesign,businCon,technicalCon,deploymentEnvironment,runResource,_this);


}


/*********************************************************应用设计新增****************************************************************************/
// 应用规划新增
var E = window.wangEditor;
var editor = new E('#editor');

// editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片

var filecon = null;
editor.customConfig.customUploadImg = function (files, insert) {
    // files 是 input 中选中的文件列表
    // insert 是获取图片 url 后，插入到编辑器的方法
    filecon = files[0];
    var formData = new FormData();
    formData.append("file",filecon);
    formData.append("serviceID","f3295b7e695145509ce6f55de679f1e1");
    loadingTip.hide();
    xhsdk.ajax({
        url: "xinghuo-apaas-fileservice/breakMultiUploads",
        type: "POST",
        contentType: false,
        processData: false,
        mimeType: "multipart/form-data",
        data: formData,
        success: function (res) {

            var res = JSON.parse(res);

            if (res.code == 200) {

                var  fileurlCon =  res.result[0].data.fileUrl;

                insert(fileurlCon) // 图片插入富文本编辑器

            } else {

                layer.msg("图片上传失败，请重新上传！");

                return

            }
        },
        error: function (msg) {
            loadingTip.hide();
            layer.msg("请求出现错误!!");
            console.log("Error:", msg);
        }
    });
};
editor.create();

//自定义验证规则
form.verify({
    applicationName: function(value){
        if(value.length < 1){
            return '请输入应用名称';
        }
    },
    applicationOverview: function(value){
        if(value.length < 1){
            return '请输入应用概述';
        }
    },
    applicationPlanning: function(value){
        if(value.length < 1){
            return '请输入应用UI/UE规划';
        }
    },
    applyLogicdiagram: function(value){
        if(value.length < 1){
            return '请输入应用功能逻辑';
        }
    }
    ,content: function(value){
        layedit.sync(editIndex);
    }
});

//监听提交
var flagnumber = 0; // 防止重复点击添加
form.on('submit(save-sumbit-application)', function(data){
    if(flagnumber==0){
        applicationsumbitData();
        flagnumber = 1;
    }
    return false;
});



var appEditID = null; // 应用设计修改ID
function applicationsumbitData() {

    var infoJson = {};
    if(appEditID!==null){   // 修改操作
        infoJson.id = appEditID;
    }
    infoJson.solutionId=additemId;
    infoJson.applicationOverview=  $("#applicationOverview").children("textarea").val();
    infoJson.applicationPlanning    =   editor.txt.html();
    infoJson.applyLogicdiagram=$("#applyLogicdiagram").children("textarea").val();
    infoJson.frontIntegration = formSelects.value('select-id', 'valStr');
    infoJson.applicationName=$("#applicationName").val();
    infoJson.accessToken = accessToken;
    loadingTip.show();

    xhsdk.ajax({
        type: "post",
        url: solution + "/projectManagement/saveApplicationdesign",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(infoJson),
        success: function (res) {
            if (res.code==200) {

                layer.msg("保存完成!", {icon: 1, time: 600}, function () {
                    appEditID = null;


                    $(".add-application-box").hide();
                    $(".application-box").show();
                    GetitemDestail(null,6);
                    editbth();
                    verifyNum(6);

                });
            } else {
                flagnumber = 0;
                loadingTip.hide();
                layer.msg(res.data);
            }
        },
        error: function (msg) {
            flagnumber = 0;
            loadingTip.hide();
            layer.msg("请求出现错误!!");

        }
    });
}



//应用设计添加
function pjapplication(flag) {
    flagnumber = 0;

    // IntegrationValue = null;
    appEditID = null;
    $(".add-application-box textarea").val("");
    $("#applicationName").val("");
    $(".add-application-box input").attr("checked", false);
    $("#pj-application .levelTips").hide();
    $(".add-application-box").show();
    editor.txt.html(''); // 清空应用UI/UE规划
    formSelects.value('select-id',[]); // 清空选择

}

//应用模块新增

function applictionTemplate(applicationName,applicationOverview,appPlanningCon,applyLogicdiagram,frontIntegration) {

    var appHtml = `<div class="secLevel">
                        <div class="deploy">
                            <p class="editTitle">应用名称</p>
                            <div class="layui-input-inline" style="width: 500px;margin-left: 7px;">
                                <input type="tel" name="phone" lay-verify="applicationName" autocomplete="off" class="layui-input" id="applicationName" value="`+applicationName+`">
                            </div>
                        </div>
                    </div>
                    <div class="secLevel">
                        <div class="pj-item-body-top">
                            <p class="editTitle">应用概述</p>
                        </div>
                        <div class="pj-item-body-bottom" id="applicationOverview">
                            <textarea class="layui-textarea" lay-verify="applicationOverview" placeholder="请输入应用概述">`+applicationOverview+`</textarea>
                        </div>
                    </div>
                    <div class="secLevel">
                        <div class="pj-item-body-top">
                            <p class="editTitle">应用UI/UE规划</p>
                        </div>
                        <div class="pj-item-body-bottom" id="applicationPlanning">
                             <div id="editor"></div>
                        </div>
                    </div>
                    <div class="secLevel">
                        <div class="pj-item-body-top">
                            <p class="editTitle">应用功能逻辑</p>
                        </div>
                        <div class="pj-item-body-bottom" id="applyLogicdiagram">
                            <textarea class="layui-textarea" lay-verify="applyLogicdiagram" placeholder="请输入应用功能逻辑">`+applyLogicdiagram+`</textarea>
                        </div>
                    </div>
                    <div class="secLevel">
                        <div class="pj-item-body-top">
                            <div class="deploy">
                                <p class="editTitle">前端服务化能力集成</p>
                                
                                <div class="layui-input-inline" style="z-index: 999999" >
                                    <div class="qd-service-box" style="width:500px";>              
                                              <select xm-select="select-id" xm-select-search="">
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
                    <div class="sumbit-button">
                        <a class="btn-center" lay-submit="" lay-filter="save-sumbit-application">保存</a>
                        <a class="btn-center close-application-box" onclick="closeapplicationbox()">取消</a>
                    </div>`;

    $("#pj-application .add-application-box").html(appHtml);

    editor.create();
    editor.txt.html('<p>'+appPlanningCon+'</p>');

    formSelects.render("select-id");
    var froValue = frontIntegration.split(",");
    formSelects.value('select-id',froValue, true);
    form.render();

}


//应用设计修改
function editapplication(_this) {

    flagnumber = 0;

    $("#pj-application .application-box-new").hide();

    $("#pj-application .add-application-box").show();

    appEditID = $(_this).data("edit");

    var applicationName = $(_this).parent().parent().find(".applicationName").text();

    var applicationOverview = $(_this).parent().parent().find(".applicationOverview").text();

    var applicationPlanning = $(_this).parent().parent().find(".applicationPlanning");

    var appPlanningCon = [];

    $(applicationPlanning).each(function (i,n) {

        appPlanningCon.push($(this).html());
    });

    var applyLogicdiagram = $(_this).parent().parent().find(".applyLogicdiagram").text();

    var idnumber =  $(_this).parent().parent().data("id");

    var  frontIntegration   = formSelects.value('qd_select'+idnumber+'', 'valStr');

    applictionTemplate(applicationName,applicationOverview,appPlanningCon,applyLogicdiagram,frontIntegration);


}



// 取消应用设计
function closeapplicationbox() {
    $("#pj-application .application-box-new").show();
    $("#pj-application .add-application-box").hide();

}

// 显示编辑按钮
function showedit() {
    $(".add-deploy-box").hover(function () {
        $(this).find(".change-btn").show();
        $(this).css("border", "1px solid #ccc")
    }, function () {
        $(this).find(".change-btn").hide();
        $(this).css("border", "1px solid #fff")
    })
}

/*********************************************************风险解决方案新增****************************************************************************/


//自定义验证规则
form.verify({
    riskSolution: function(value){
        if(value.length < 1){
            return '请输入风险解决方案';
        }
    }
});

//监听提交
var RiskFalg = 0; // 防止重复点击添加
form.on('submit(save-sumbit-Risksolution)', function(data){
    if(RiskFalg==0){
        saveRisksolution();
        RiskFalg = 1;
    }
    return false;
});




// 实施方案新增修改风险解决方案模块
$("#pj-solution .addItem-box").click(function () {

    $("#pj-solution .levelTips").hide();

    $("#pj-solution .add-solution-box").show()
})

var solutionEditID = null; // 修改ID
function saveRisksolution() {
    var infojson = {};
    if (solutionEditID !== null) {
        infojson.id = solutionEditID;
    }
    infojson.solutionId = additemId;
    infojson.riskSolution = $("#riskSolution").val();
    infojson.accessToken = accessToken;
    $(".add-box-tip .editCon-btn").show();
    $("#pj-solution .editOprate").show();
    showsolution();
    loadingTip.show();
    xhsdk.ajax({
        type: "post",
        url: solution + "/projectManagement/saveRisksolution",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(infojson),
        success: function (res) {
            if (res.code == 200) {
                loadingTip.hide();
                solutionEditID = res.data;  // 拿到修改ID 进行修改
                GetitemDestail(7);
                $(".add-solution-box").hide();
                $("#pj-solution .addItem-box").hide();
                layer.msg("保存完成!", {icon: 1, time: 600}, function () {
                    verifyNum(7)
                });
            } else {
                RiskFalg = 0;
                loadingTip.hide();
                layer.alert('字数过多,请删减!', {
                    skin: 'layui-layer-molv' //样式类名
                    , closeBtn: 1,
                    shadeClose: true, //开启遮罩关闭
                });
            }
        },
        error: function (msg) {
            RiskFalg = 0;
            loadingTip.hide();
            layer.msg("请求出现错误!!");

        }
    });
}

$(".close-solution-box").click(function () {

    $("#pj-solution .add-solution-box").hide();
    $("#pj-solution .edit-solution-box").show();

});

//修改风险解决方案
function editsolution(_this) {
    RiskFalg = 0;
    var edit = $(_this).data("edit");
    solutionEditID = edit;
    $("#pj-solution .edit-solution-box").hide();
    $("#pj-solution .editCon-btn").hide();
    $("#pj-solution .add-solution-box").show();
    $("#pj-solution .sumbit-button-box").show();
    var editCont = $("#pj-solution #edit-riskSolution").text();
    $("#pj-solution #riskSolution").val(editCont);
}





// 进度监控
function loadingverify() {
    var classArr = [];
    $(".anchorNav ul li").each(function (i, n) {
        var isflag = $(this).hasClass("verify");
        classArr.push(isflag);
    });
    var trueArr = [];
    for (var i = 0; i < classArr.length; i++) {
        if (classArr[i] == true) {
            trueArr.push(classArr[i])
        }
    }
    if (trueArr.length >= 1) {
        var txtloaing = $(".pjprogress_txt span");
        var progressbar = $(".layui-progress-bar");
        switch (trueArr.length) {                   //监听进度
            case 1:
                txtloaing.text("10%");
                progressbar.css("width", "10%");
                break;
            case 2:
                txtloaing.text("25%");
                progressbar.css("width", "25%");
                break;
            case 3:
                txtloaing.text("30%");
                progressbar.css("width", "30%");
                break;
            case 4:
                txtloaing.text("45%");
                progressbar.css("width", "45%");
                break;
            case 5:
                txtloaing.text("60%");
                progressbar.css("width", "60%");
                break;
            case 6:
                txtloaing.text("65%");
                progressbar.css("width", "65%");
                break;
            case 7:
                txtloaing.text("75%");
                progressbar.css("width", "75%");
                break;
            case 8:
                txtloaing.text("90%");
                progressbar.css("width", "90%");
                break;
            case 9:
                txtloaing.text("100%");
                progressbar.css("width", "100%");
                break;
            // case 10:
            //     txtloaing.text("100%"); progressbar.css("width", "100%");
            //     break;
            default:
                txtloaing.text("0%");
                progressbar.css("width", "0%");
        }
    }
}


// 项目概述帮助
$("#pj-overview .pj-item-header-left p:nth-of-type(2)").click(function () {
    window.open("../../pm_setDoc/pm_overview/pm_overview.html?help=1&TokenCode="+accessToken)
});

// 需求分析帮助
$("#pj-demandAnalysis .pj-item-header-left p:nth-of-type(2)").click(function () {
    window.open("../../pm_setDoc/pm_demandAnalysis/pm_demandAnalysis.html?help=1&TokenCode="+accessToken);
});

// 架构设计帮助
$("#pj-design .pj-item-header-left p:nth-of-type(2)").click(function () {
    window.open("../../pm_setDoc/pm_design/pm_design.html?help=1&TokenCode="+accessToken);
});

// 微服务设计帮助
$("#pj-service .pj-item-header-left p:nth-of-type(2)").click(function () {
    window.open("../../pm_setDoc/pm_service/pm_service.html?help=1&TokenCode="+accessToken);
});

// 应用设计帮助
$("#pj-application .pj-item-header-left p:nth-of-type(2)").click(function () {
    window.open("../../pm_setDoc/pm_application/pm_application.html?help=1&TokenCode="+accessToken);
});
//风险解决方案帮助
$("#pj-solution .pj-item-header-left p:nth-of-type(2)").click(function () {
    window.open("../../pm_setDoc/pm_solution/pm_solution.html?help=1&TokenCode="+accessToken);
});


// 预览实施方案
function preview() {

    layer.open({
        type: 2,
        title: '实施方案详情',
        shadeClose: true,
        maxmin: true,
        area: ['100%', '100%'],
        content: '../pm_setDoc_deastail/pm_setDoc_deastail.html?tag=1' + "&itemID=" + additemId + "&TokenCode=" + accessToken
    });

}


//分配开发负责人 和 开发单位

var allocationFlag = null;  // 区分选择开发负责人还是开发单位
var Dep_URL;
function allocation(_this){
    allocationFlag = _this;
    $(".popUpbox").show();

    init(1, 5);

    function init(current, size) {
        $("#Personnel").empty();
        var projectJson = {
            "accessToken": accessToken,
            "deptCode": sessionStorage.getItem("deptCode")
        }
        indexloading = layer.load(2, {shade: false});
        Dep_URL = solution + "/solutioninfo/queryUserByDeptCode";
        // if(_this==1){
        //     projectJson = {};
        //     delete projectJson;
        //         Dep_URL = solution + "/solutioninfo/queryDeptByUnitType";
        //
        // }else{
        //         Dep_URL = solution + "/solutioninfo/queryUserByDeptCode";
        // }

        xhsdk.ajax({
            type: "post",
            url: Dep_URL,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(projectJson),
            success: function (res) {
                console.log(res)
                if (res.code == 200) {
                    layer.close(indexloading);
                    if(res.data==null){
                        layer.msg("暂无数据");
                        return
                    }
                    var datalist = res.data;
                    Personnel(datalist);

                } else {
                    layer.close(indexloading);
                    layer.msg("请求出现错误!!");
                }
            },
            error: function (msg) {
                layer.close(indexloading);
                layer.msg("请求出现错误!!");
                console.log("Error:", msg);
            }
        });

    }
}


//获取开发人员和开发单位
function Personnel(data) {

    $("#Personnel").empty();

    for (var i = 0; i < data.length; i++) {

        if(allocationFlag==2){
            var user_name = data[i].job;
        }else{
            var user_name = data[i].job;
          }
        var PersonnelHtml = '<div class="option-checkbox" data-id="' + i + '">' +
            '<input type="radio" name="like1[write]" lay-skin="primary" title="' + user_name + '"  value="' + user_name + '" lay-filter="staffCheckbox"></div>';
        $(PersonnelHtml).appendTo("#Personnel");
        form.render();
    }
}



// 选择分配人员
var staff = null;
form.on('radio(staffCheckbox)', function (data) {

    staff = data.value;

});
// 保存分配人员
$(".editContent").on("click", ".getDocData", function () {
    if (staff == null) {
        layer.msg("请选择!");
        return
    }
    var pvalue = null;  // 输入框的值

    if(allocationFlag==2){
        pvalue = $(".stafffzr").val();
    }else{
        pvalue =  $("#kfdevelopOrgan-new").val();
    }

    var fg =  pvalue.split(",");

    if(fg.length>1){                        // 控制只能添加两个负责人
        layer.msg("不能在添加了");
        return
    }else{

        $(".popUpbox").hide();

        if(allocationFlag==2){

            $(".stafffzr").val($(".stafffzr").val()+ ","+staff);

            $("#staffvalue").append(staff);

        }else{
            $("#kfdevelopOrgan-new").val(staff);

        }
        form.render();
    }

});

// 搜索开发人员

$(".right-box-search").click(function () {
    layer.msg("正在开发中...")
});

// 取消分配人员
$(".btn-group").on("click", ".cancelEditor", function () {
    $(".popUpbox").hide();
})





// 提交审核
function sumbitData(_this) {
    var classArr = [];
    $(".anchorNav ul li").each(function (i, n) {
        var isflag = $(this).hasClass("verify");
        classArr.push(isflag);
    })
    // if (readstatus == null || readstatus == "") {
    //     layer.msg("请阅读开发规范");
    //
    //     return;
    // }
    var trueArr = [];

    for (var i = 0; i < classArr.length; i++) {
        if (classArr[i] == true) {
            trueArr.push(classArr[i])
        }
    }

    if (trueArr.length < 8) {
        layer.alert('请把必填项填写完成!', {
            skin: 'layui-layer-molv' //样式类名
            , closeBtn: 1,
            shadeClose: true, //开启遮罩关闭
        });
        return
    }

    layer.confirm('确认提交审核吗？', {

        btn: ['确认', '取消'] //按钮

    }, function () {

        indexloading = layer.load(2, {shade: false});

        var auditJson = {
            "accessToken": accessToken,
            "id": additemId,
            "isRead": 1
        };

        xhsdk.ajax({
            type: "post",
            url: solution + "/solutioninfo/apply",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(auditJson),
            success: function (res) {
                if (res.code == 200) {
                    layer.close(indexloading);
                    layer.msg("提交完成!", {icon: 1, time: 600}, function () {
                        loadingTip.hide();
                        parent.location.reload();
                        // $(_this).remove();
                        layer.close()
                    });
                } else {
                    layer.close(indexloading);
                    layer.msg("请求错误!");
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


