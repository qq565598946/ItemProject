
var formSelects = layui.formSelects;  // 下拉多选
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var accessToken = GetQueryString('TokenCode');    // 获取 access_token

var xhsdk = new Xhsdk(appID, appSecretKey);

//设置网关
xhsdk.setGetaWayUrl(GetaWay_url);

//设置token
xhsdk.setToken(accessToken);

//设置类型
xhsdk.setReqType("app");

xhsdk.setUserInfo(null);

var form = layui.form;

var moduleId = GetQueryString('moduleid');           // 实施方案模块ID

var projectID = GetQueryString('projectID');         // 实施方案id

var status = GetQueryString('status');               // 项目审核状态 (0未提交审核 1审核中 2审核通过 3审核驳回)

var solutionstage = GetQueryString("solutionstage"); // 实施方案阶段（-1删除 0草稿 1方案初审 2负责人审核 3合规审核 4立项审核 5科信委）.

console.log("实施方案审核阶段",solutionstage);

var  loadingTip = $(".loading-box1"); // 加载中..

$(function () {
    showAuditBoxCon();
    // showserviceApp()

})

switch (status) {
    case "1":
        auditbtn();
        break;
    case "2":
        $(".box-right-edit").hide();
        break;
    case "3":
        $(".box-right-edit").hide();
        break;
    default:
        $(".box-right-edit").hide();

}

// 审核
function auditbtn() {
    var auditHTML = `<div class="box-audit"> 

                        <button class="layui-btn layui-btn-danger layui-btn-sm" style="width:100px" id="disagree" onclick="showauditbox()">不同意</button>
                        
                        <button onclick="isagredd(2)" class="layui-btn layui-btn-sm" id="agressd" style="width:100px;background-color:#295596;">同意</button>
                        
                        </div>`;

    $(".box-audit").html(auditHTML)

}


var moduleAuditID = "";
var applicationdesignList = ""; // 应用设计
var microserviceList = "";  // 微服务设计
var saveDeployrun = "";  // 服務部署与运行资源


var applicationdesignAuditList = "";  // 应用设计审核意见
var microserviceAuditList = "";   // 微服务设计审核意见
// var deployrunAuditAuditList="";  //应服務部署与运行资源审核意见
$(function () {
    init(true);
})

$(".ProgrammeList").on('click', 'li', function () {
    $(this).addClass("layui-this").siblings().removeClass("layui-this");
});

// 审核意见
function edit(_this, i_this) {
    init(false, i_this);
    moduleId1 = $(i_this).attr("data-audit");
    loadingTip.show();
    xhsdk.ajax({
        type: "POST",
        url: solution + "/solutionAudit/getSolutionAudit",
        contentType: "application/json",
        dataType: "json",
        data: '{"id":"' + moduleId + '","moduleId":"' + moduleId1 + '"}',
        success: function (res) {

            if (res.code == 200) {

                for (var i = 0; i < res.data.length; i++) {

                    if (res.data[i].effect == 0) {

                        moduleAuditID = res.data[i].id;

                        // console.log("----->",moduleAuditID)
                    }

                }

                loadingTip.hide();
                // console.log(moduleAuditID);
                switch (_this) {
                    case 1:
                        auditoverview("#overview", ".overview", moduleAuditID, 0, i_this);
                        break;
                    case 2:
                        auditoverview("#pj-demandAnalysis", ".demanalysisList", moduleAuditID, 1, i_this);
                        break;
                    case 3:
                        auditoverview("#pj-design", ".saveArchidesign", moduleAuditID, 2, i_this);
                        break;
                    case 4:
                        auditnormalize();
                        break;
                    case 5:
                        auditoverview("#pj-application", ".applicationdesignList", moduleAuditID, 4, i_this);
                        break;
                    case 6:
                        auditoverview("#pj-service", ".microserviceList", moduleAuditID, 5, i_this);
                        break;
                    case 7:
                        auditoverview("#pj-deploy", ".deployrunList", moduleAuditID, 6, i_this);
                        break;
                    case 8:
                        auditoverview("#pj-solution", ".risksolutionList", moduleAuditID, 7, i_this);
                        break;
                    case 9:
                        break;
                    default:
                        console.error("没有此方法!")
                }
                console.log(moduleAuditID);
            } else {
                loadingTip.hide();
                layer.msg("数据异常！");
            }
        },
        error: function (msg) {
            loadingTip.hide();
            layer.msg("请求出现错误!!");
        }
    });


}

//项目概述审核意见
var overcont = null;
var auditid = null;

function auditoverview(elem, childElem, moduleAudit_ID, index, i_this) {

    auditid = $(i_this).data("audit");
    overcont = $(childElem).text();
    var audittipHTML = `  <div class="editContent">
                        <p><span>审批处理</span></p>
                        <div class="box-content-audit layui-form">
                            <div class="layui-form-item layui-form-text">
                                <label class="layui-form-label">意见说明 :</label>
                                <div class="layui-input-block">
                                    <textarea placeholder="请输入内容" class="layui-textarea opinion" id="textOpinion" style="height: 205px;"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="btn-group">
                            <button class="layui-btn layui-btn-primary cancelEditor" onclick="closefn()">取消</button>
                            <button class="layui-btn layui-btn-primary getDocData">确定</button>
                        </div>
                    </div>`;
    $(".popUpbox").html(audittipHTML);
    $(".popUpbox").show();

    $(".getDocData").click(function () {
        var n_textarea = $("#textOpinion").val().length;
        sumbitoverview(elem, moduleAudit_ID, index, n_textarea, i_this);

    });

}

// 提交审核
function sumbitoverview(elem, moduleAudit_ID, index, len, i_this) {
    if (len !== 0) {
        var overviewJson = {

            "accessToken": accessToken,
            "id": moduleAudit_ID,
            "solutionStage": solutionstage,
            "applyBy": $(".applyBy").val(),
            "solutionModule": overcont,
            "moduleId": auditid,
            "auditBy":$("#applyName").val(),
            "opinion": $(".opinion").val(),
            "solutionId": moduleId
        };

        loadingTip.show();
        xhsdk.ajax({
            type: "POST",
            url: solution + "/solutionAudit/moduleAudit",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(overviewJson),
            success: function (res) {
                if (res.code == 200) {
                    // init();
                    loadingTip.hide();
                    $(i_this).siblings(".audit-cont").html('<span class="audit-txt">意见:' + $(".opinion").val() + '</span>');
                    $(".opinion-box ul li:eq(" + index + ") span").text($(".opinion").val());
                    $(".opinion-box ul li:eq(" + index + ")").show();
                    $(".popUpbox").hide();
                    $(".popUpbox").empty();

                    overcont = null;
                    auditid = null;


                } else {
                    loadingTip.hide();
                    layer.msg("数据异常！");
                }
            },
            error: function (msg) {

                loadingTip.hide();
                layer.msg("请求出现错误!!");

            }
        });

    } else {
        layer.msg("意见不能为空！");
    }
}


// 实施方案模块
var navJson = {
    "accessToken": accessToken,
    "solutionId": moduleId
}

function init(isInit) {
    loadingTip.show();
    xhsdk.ajax({
        type: "POST",
        url: solution + "/projectManagement/list",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(navJson),
        success: function (res) {
            if (res.code == 200) {
                loadingTip.hide();
                var solutioninfoList = res.data.solutioninfoList; // 基本信息
                var overviewList = res.data.overviewList; // 项目概述
                var demanalysisList = res.data.demanalysisList; // 需求分析
                var saveArchidesign = res.data.archidesignList; // 架构设计
                applicationdesignList = res.data.applicationdesignList; // 应用设计
                microserviceList = res.data.microserviceList;  // 微服务设计
                saveDeployrun = res.data.deployrunList;  // 服務部署与运行资源
                var risksolutionList = res.data.risksolutionList;       // 风险解决方案

                var overviewaAuditList = res.data.overviewaAuditList; // 项目概述 意见
                var demanalysisAuditList = res.data.demanalysisAuditList; // 需求分析意见
                var archidesignAuditList = res.data.archidesignAuditList; // 架构设计意见
                applicationdesignAuditList = res.data.applicationdesignAuditList; // 应用设计意见
                microserviceAuditList = res.data.microserviceAuditList;  //微服务设计审核意见
                // deployrunAuditAuditList = res.data.deployrunAuditAuditList; // 应服務部署与运行资源审核意见意见
                var risksolutionAuditList = res.data.risksolutionAuditList; // 风险解决方案审核意见
                //          var developer = res.data.risksolutionList;       // 开发人员
                if (isInit) { // 初始化
                    basicinfo(solutioninfoList);
                    projectDetail(overviewList);
                    DetailDemanalysis(demanalysisList);
                    DetailArchidesign(saveArchidesign);
                    Detailmicroservice(microserviceList);
                    Detailapplicationdesign(applicationdesignList);
                    Detaildeployrun(risksolutionList);
//		            console.log( $("#pj-service .box-right-edit"));
                    if (overviewaAuditList.length !== 0) {
                        auditOpinion(overviewaAuditList, "#overview", 0);
                        $("#overview").find(".audit-i-box").show();
                        // $("#overview").find(".audit_opinion").show()
                    }
                    if (demanalysisAuditList.length !== 0) {
                        auditOpinion(demanalysisAuditList, "#pj-demandAnalysis", 0);
                        $("#pj-demandAnalysis").find(".audit-i-box").show()
                        // $("#pj-demandAnalysis").find(".audit_opinion").show()
                    }
                    if (archidesignAuditList.length !== 0) {
                        auditOpinion(archidesignAuditList, "#pj-design", 0);
                        $("#pj-design").find(".audit-i-box").show()
                        // $("#pj-design").find(".audit_opinion").show()
                    }
                    if (risksolutionAuditList.length !== 0) {
                        auditOpinion(risksolutionAuditList, "#pj-solution", 0);
                        $("#pj-solution").find(".audit-i-box").show()
                        // $("#pj-solution").find(".audit_opinion").show()
                    }
                    if (microserviceAuditList.length !== 0) {
                        for (var j = 0; j < microserviceList.length; j++) {
                            var OpinionData = "";
                            for (var i = 0; i < microserviceAuditList.length; i++) {
                                if (microserviceAuditList[i].moduleId == microserviceList[j].id) {
                                    OpinionData = `<li>` + (i + 1) + `、` + microserviceAuditList[i].opinion + `</li> <div>审核人 : <span>` + microserviceAuditList[i].auditName + `</span></div>
                            <div>审核时间 : <span>` + microserviceAuditList[i].auditTime + `</span></div>`;
                                    $("#pj-service").find(".OpinionList").eq(j).append(OpinionData);
                                    // $("#pj-service").find(".audit_opinion").eq(j).show();
                                    $("#pj-service").find(".audit-i-box").eq(j).show();
                                }
                            }

                        }
                    }
                    if (applicationdesignAuditList.length !== 0) {
                        for (var j = 0; j < applicationdesignList.length; j++) {
                            var OpinionData = "";
                            for (var i = 0; i < applicationdesignAuditList.length; i++) {
                                if (applicationdesignAuditList[i].moduleId == applicationdesignList[j].id) {
                                    OpinionData = `<li>` + (i + 1) + `、` + applicationdesignAuditList[i].opinion + `</li> <div>审核人 : <span>` + applicationdesignAuditList[i].auditName + `</span></div>
                            <div>审核时间 : <span>` + applicationdesignAuditList[i].auditTime + `</span></div>`;
                                    $("#pj-application").find(".OpinionList").eq(j).append(OpinionData);
                                    // $("#pj-application").find(".audit_opinion").eq(j).show();
                                    $("#pj-application").find(".audit-i-box").eq(j).show();
                                }
                            }
                        }
                    }
                }
                if (overviewaAuditList.length !== 0) {
//	            	moduleAuditID1 = overviewaAuditList[0].id;
                    $("#overview").find(".audit-cont").html("");
                    $("#overview").find(".audit-cont").append(overviewaAuditList[0].opinion);
                    auditOpinion(overviewaAuditList);
                }
                if (demanalysisAuditList.length !== 0) {
//	            	moduleAuditID2 = demanalysisAuditList[0].id;
                    $("#pj-demandAnalysis").find(".audit-cont").html("");
                    $("#pj-demandAnalysis").find(".audit-cont").append(demanalysisAuditList[0].opinion);
                    auditOpinion(demanalysisAuditList);
                }
                if (archidesignAuditList.length !== 0) {
//	            	moduleAuditID3 = archidesignAuditList[0].id;
                    $("#pj-design").find(".audit-cont").html("");
                    $("#pj-design").find(".audit-cont").append(archidesignAuditList[0].opinion);
                }
                if (risksolutionAuditList.length !== 0) {
//	            	moduleAuditID7 = risksolutionAuditList[0].id;
                    $("#pj-solution").find(".audit-cont").html("");
                    $("#pj-solution").find(".audit-cont").append(risksolutionAuditList[0].opinion);
                }
                if (applicationdesignAuditList.length !== 0) {
                    if(status==2||status==3){
                        $(".box-right-edit").hide();
                    }
                    for (var i = 0; i < applicationdesignAuditList.length; i++) {
                        if (applicationdesignAuditList[i].moduleId == applicationdesignList[i].id) {
                            $("#pj-application .audit-cont").eq(i).html("");
                            $("#pj-application .audit-cont").eq(i).append(applicationdesignAuditList[i].opinion);
                        }
                    }
                }
                if (microserviceAuditList.length !== 0) {
                    if(status==2||status==3){
                        $(".box-right-edit").hide();
                    }
                    for (var i = 0; i < microserviceAuditList.length; i++) {
                        if (microserviceAuditList[i].moduleId == microserviceList[i].id) {
                            $("#pj-service .audit-cont").eq(i).html("");
                            $("#pj-service .audit-cont").eq(i).append(microserviceAuditList[i].opinion);
                        }
                    }
                }

//              if(deployrunAuditAuditList !== 0){
//		        	for(var i = 0; i<deployrunAuditAuditList.length; i++){
//		             	if( deployrunAuditAuditList[i].moduleId == saveDeployrun[i].id){
//		             		$("#pj-deploy .audit-cont").eq(i).html("");
//		             		$("#pj-deploy .audit-cont").eq(i).append(deployrunAuditAuditList[i].opinion);
//		             	}
//		            }
//		        }

            } else {
                layer.msg("请求出现错误!!");
            }
        },
        error: function (msg) {
            layer.msg("请求出现错误!!");

        }
    });

}

// 显示审核意见
function showAuditBoxCon() {

    $(".audit-i-box").hover(function () {
        $(this).parent().parent().find(".audit_opinion").show();
    }, function () {
        $(this).parent().parent().find(".audit_opinion").hide();
    })
}

// 显示 微服务和应用设计 意见信息
    function showserviceApp() {
        console.log("微服务")
        $(".service-box .audit-i-box").hover(function () {
            $(this).parents().find(".audit_opinion").show();
        }, function () {
            $(this).parents().find(".audit_opinion").hide();
        })
    }

// 项目审核意见 列表

function auditOpinion(data, elem, index) {
    $(elem).find(".OpinionList").html("");
    var OpinionData = "";
    for (var i = 0; i < data.length; i++) {
        OpinionData += `<li>`+(i+1)+"、"+`` + "审核意见:" + ` ` + (i + 1) + ` : ` + data[i].opinion + `</li>
                            <div>审核人 : <span>` + data[i].auditName + `</span></div>
                            <div>审核时间 : <span>` + data[i].auditTime + `</span></div>`;
    }
    $(elem).find(".OpinionList").eq(index).append(OpinionData);
}

// 基本信息详情
function basicinfo(solutioninfoList) {
    for (var i = 0; i < solutioninfoList.length; i++) {
        $(".project_Name").val(solutioninfoList[i].solutionName);
        $(".developOrgan ").val(solutioninfoList[i].makeUnit);
        $(".solutionVersion ").val(solutioninfoList[i].solutionVersion);
        $(".staffvalue ").val(solutioninfoList[i].developLeaderName);
        $(".kfdevelopOrgan").val(solutioninfoList[i].developOrgan);

        $(".applyBy").val(solutioninfoList[i].applyBy);
        $(".applyName").val(solutioninfoList[i].applyName)



        $("#pj-staffvalue").find(".staffvalue-box p").text(solutioninfoList[i].developerName)


    }
}

// 项目概述详情
function projectDetail(overviewList) {

    for (var i = 0; i < overviewList.length; i++) {
        $("#overview").find(".box-right-edit").attr("data-audit", overviewList[i].id);
        $("#pj-background").children("p").text(overviewList[i].projectBackground);
        $("#systemCurrent").children("p").text(overviewList[i].systemCurrent);
        $("#buildGoal").children("p").text(overviewList[i].buildGoal);
        $("#buildContent").children("p").text(overviewList[i].buildContent);
    }

    var OpinionBox = '<div class="audit_opinion"><ul class="OpinionList"></ul></div>';


    $("#overview").append(OpinionBox);
}

// 需求分析
function DetailDemanalysis(demanalysisList) {
    for (var i = 0; i < demanalysisList.length; i++) {
        $("#pj-demandAnalysis").find(".box-right-edit").attr("data-audit", demanalysisList[i].id);
        $("#functionalRoleAnalysis").children("p").text(demanalysisList[i].functionalRoleanalysis);
        $("#businessRequirements").children("p").text(demanalysisList[i].businessRequirements);
        $("#dataIntegration").children("p").text(demanalysisList[i].dataIntegration);
    }

    var OpinionBox = '<div class="audit_opinion"><ul class="OpinionList"></ul></div>';
    $("#pj-demandAnalysis").append(OpinionBox);
}

// 架构设计
function DetailArchidesign(saveArchidesign) {
    for (var i = 0; i < saveArchidesign.length; i++) {
        $("#pj-design").find(".box-right-edit").attr("data-audit", saveArchidesign[i].id);
        var designHtml = `
                           <div class="item-box">
                                <div class="item-destail">
                                    <span>总体架构</span>
                                        <p>` + saveArchidesign[i].frameworkDesign + `</p>
                                </div>
                            </div>  
                    
                     <div class="item-box">
                                <div class="item-destail">
                                    <span>网络拓扑图</span>
                                    <img src="` + saveArchidesign[i].topologicalPic + `" alt="">
                                </div>
                            </div>  
                   
                     <div class="item-box">
                                <div class="item-destail">
                                    <span>系统建设原则及路线</span>
                                        <p>` + saveArchidesign[i].principlesRoutes + `</p>
                                </div>
                            </div>  
                    
                    
                    `;
        $(designHtml).appendTo(".design-box")

    }
    var OpinionBox = '<div class="audit_opinion"><ul class="OpinionList"> </ul></div>';
    $("#pj-design").append(OpinionBox);
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


// 微服务设计
function Detailmicroservice(microserviceList) {


    for (var i = 0; i < microserviceList.length; i++) {
        var generalServicelabe = microserviceList[i].generalService.split(","); //   基础服务
        var basicServicelable = microserviceList[i].basicService.split(",");  // 通用业务服务
        var DetailmicroHtml = `
                <div class="app-list layui-form">
                    <div class="item-box">
                        <div class="item-destail">
	                              <span>服务名称</span>
	                              <span class="audit-cont"></span>
	                               <i class="iconfont icon-bitian audit-i-box"></i>
	                              <i class="iconfont icon-bianji box-right-edit" data-isadd="true" onclick="edit(6,this)" data-audit="` + microserviceList[i].id + `"></i>
                              
                            <p>` + microserviceList[i].serviceName + `</p>
                        </div>
                    </div>
                    <div class="item-box">
                        <div class="item-destail">
                            <span>服务类型</span>
                            <div style="width: 160px;margin: 10px 0px;">
                                    <select name="quiz" class="serviceType` + i + `" disabled>
                                        <option value="1">基础技术服务</option>
                                        <option value="2">通用业务服务</option>
                                        <option value="3">应用服务</option>
                                    </select>
                                </div>
                          
                        </div>
                    </div>
                    <div class="item-box">
                        <div class="item-destail">
                            <span>服务设计</span>
                                <p>` + microserviceList[i].serviceDesign + `</p>
                        </div>
                    </div>
                      <div class="item-box">
                        <div class="item-destail">
                            <span>通用业务服务</span>
                                <!--<p>` + microserviceList[i].generalService + `</p>-->
                                 <div class="box-select-business layui-input-inline" style="margin:20px 0px; width: 100%">
                                <select xm-select="business_des`+i+`" disabled>
                                               
                                </select>
                            </div>
                        </div>
                    </div>
                     <div class="item-box">
                        <div class="item-destail">
                            <span>基础技术服务</span>
                                <!--<p>` + microserviceList[i].basicService + `</p>-->
                                  <div class="box-select-technical layui-input-inline" style="margin:20px 0px;width: 100%">
                                <select xm-select="technical_des`+i+`" disabled>
                                                 
                                </select>
                            </div>
                        </div>
                    </div>
                    
                       <div class="item-box">
                        
                            <div class="item-destail"><span>部署环境和运行资源</span>
                             <div class="hj-box"><strong>部署环境:</strong><strong>`+microserviceList[i].deploymentEnvironment+`</strong></div>
                            <div class="hj-box"><strong>运行资源:</strong><strong>`+microserviceList[i].runResource+`</strong></div>
                            </div>

                        </div>
                </div>
`;
        $(DetailmicroHtml).appendTo(".service-box");
        $(".serviceType" + i + " option[value = " + microserviceList[i].serviceType + "]").attr("selected", "selected");

        GetserviceData('business_des'+i+'','technical_des'+i+'',basicServicelable,generalServicelabe,3);


        form.render();
    }
    var OpinionBox = '<div class="audit_opinion"><ul class="OpinionList"></ul></div>';
    $("#pj-service").find(".app-list").append(OpinionBox);

    // 显示审核意见
    $(".service-box .audit-i-box").hover(function () {
        $(this).parent().parent().parent().parent().find(".audit_opinion").show();
    }, function () {
        $(this).parents().parent().parent().parent().find(".audit_opinion").hide();
    })


}

// 应用设计
function Detailapplicationdesign(applicationdesignList) {
    for (var i = 0; i < applicationdesignList.length; i++) {
        var selcetValue = applicationdesignList[i].frontIntegration.split(",");

        var apphtml = ` <div class="app-list">
                        <div class="item-box">
                                <div class="item-destail">
                                    <span>应用名称</span>
                                      <span class="audit-cont"></span>
                                        <i class="iconfont icon-bitian audit-i-box"></i>
                                      <i class="iconfont icon-bianji box-right-edit" data-isadd="true" onclick="edit(5,this)" data-audit="` + applicationdesignList[i].id + `"></i>
                                  
                                        <p>` + applicationdesignList[i].applicationName + `</p>
                                    </div>
                                    
                                    </div>
	                        <div class="item-box">
	                            <div class="item-destail">
	                                   <span>项目概述</span>
                                     
	                                <p>` + applicationdesignList[i].applicationOverview + `</p>
	                            </div>
	                        </div>
	                         <div class="item-box">
	                            <div class="item-destail">
	                                    <span>应用UI/UE规划</span>
	                                <p>` + applicationdesignList[i].applicationPlanning + `</p>
	                            </div>
	                        </div>
	                         <div class="item-box">
	                            <div class="item-destail">
	                                    <span>应用功能逻辑</span>
	                                <p>` + applicationdesignList[i].applyLogicdiagram + `</p>
	                            </div>
	                        </div>
	                        <div class="item-box">
	                                
	                            <div class="item-destail">
	                                    <span>前端服务化能力集成</span>
	                                       <div class="" style="width: 100%;margin: 20px 0px">
                                         
                                            <select xm-select="select-id`+i+`" disabled="disabled" class="frontIntegration`+i+`">
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
	                                <!--<p>` + applicationdesignList[i].frontIntegration + `</p>-->
	                            </div>
	                        </div>
                        </div>`;
        $(apphtml).appendTo(".box-app");
        formSelects.render('select-id'+i+'');
        formSelects.value('select-id'+i+'', selcetValue, true);
    }

    var OpinionBox = '<div class="audit_opinion"><ul class="OpinionList"></ul></div>';
    $("#pj-application .app-list").append(OpinionBox);

    // 显示审核意见
    $("#pj-application .audit-i-box").hover(function () {
        $(this).parent().parent().parent().parent().find(".audit_opinion").show();
    }, function () {
        $(this).parent().parent().parent().parent().find(".audit_opinion").hide();
    })
}



// 服務部署与运行资源
function Detailarchidesign(archidesignList) {
    console.log(archidesignList);
    for (var i = 0; i < archidesignList.length; i++) {
        var zy = `
                    <div class="item-box app-list">
                        <div class="item-destail">
                            <h3>
                              <span>部署环境</span>
                              <span class="audit-cont"></span>
                              <i class="iconfont icon-bianji box-right-edit" data-isadd="true" onclick="edit(7,this)" data-audit="` + archidesignList[i].id + `"></i>
                            </h3>
                            <p>` + archidesignList[i].deploymentEnvironment + `</p>
                        </div>
                         <div class="item-destail">
                            <span>运行资源(cpu/内存/磁盘): </span>
                            <p>` + archidesignList[i].runResource + `</p>
                        </div>
                    </div>
`;
        $(zy).appendTo(".deploy-box")

    }
}


// 风险解决方案
function Detaildeployrun(deployrunList) {

    for (var i = 0; i < deployrunList.length; i++) {
        $("#pj-solution").find(".box-right-edit").attr("data-audit", deployrunList[i].id);
        var solutionHtml = `
                 <div class="item-box">
                        <div class="item-destail">
                            <span>风险解决方案</span>
                                <p>` + deployrunList[i].riskSolution + `</p>
                        </div>
                    </div>             
    `;
        $(solutionHtml).appendTo("#pj-solution .solution-box")
    }

    var OpinionBox = '<div class="audit_opinion"><ul class="OpinionList"></ul></div>';
    $("#pj-solution").append(OpinionBox);
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


// 是否同意审核 (2 审核通过 3 审核驳回)
var  indexloading;
var auditURL = null;
function isagredd(flag) {
             // 审核接口
    switch (solutionstage) {        // 项目审核人步骤( 1 方案初审 2 负责人审核  3 科信委立项   4 平台组 5 科信委审)
        case "1" :
            auditURL = solution + "/solutionAudit/audit";
            break;
        case "2":
            auditURL = solution + "/solutionAudit/audit1";
            break;
        case "5":
            auditURL = solution + "/solutionAudit/audit4";
            break;
        case "3":
            auditURL = solution + "/solutionAudit/audit2";
            break;
        case "4":
            auditURL = solution + "/solutionAudit/audit3";
            break;
        default:
            console.log("没有其他审核人")

    }

    var auditStatus = null;

    var audittxt = null;

    if (flag == 2) {
        auditStatus = 2;
        audittxt = "同意"
    } else {
        auditStatus = 3;
        audittxt = "不同意"
    }
    layer.confirm(audittxt, {
        title: '审核',
        btn: ['确认', '取消'] //按钮
    }, function () {
    indexloading = layer.load(2, {shade: false});

        var ApplyJson = {
            "accessToken": accessToken,
            "id": moduleId,
            "solutionStage": solutionstage,
            "auditStatus": auditStatus,
            "applyBy": $(".applyBy").val(),
            "applyName": $(".applyName").val(),
            "moduleId": moduleId
        };

        xhsdk.ajax({
            url: auditURL,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(ApplyJson),
            success: function (res) {
                if (res.code == 200) {
                    layer.close(indexloading);
                    if (flag == 2) {
                        layer.msg("审核通过");
                        setTimeout(function () {
                            parent.init(1, 10, 2);
                            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                            parent.layer.close(index); //再执行关闭
                        }, 500)
                    } else {
                        layer.msg("审核不通过");
                        setTimeout(function () {
                            init(1, 10, 2);
                            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                            parent.layer.close(index); //再执行关闭
                        }, 500)
                    }
                }else{
                        layer.msg(res.data)
                        layer.close(indexloading);
                }
            },
            error: function (data) {
                layer.close(indexloading);
                layer.msg("网络错误")
            }
        })

    }, function () {

        layer.msg('已取消');
    });

}


//取消
function closefn() {
    $(".popUpbox").hide();
}

// 显示不同意框
function showauditbox() {

    switch (solutionstage) {        // 项目审核人步骤( 1 方案初审 2 负责人审核 3 平台组 4 科信委审)
        case "1" :
            auditURL = solution + "/solutionAudit/audit";
            break;
        case "2":
            auditURL = solution + "/solutionAudit/audit1";
            break;
        case "5":
            auditURL = solution + "/solutionAudit/audit4";
            break;
        case "3":
            auditURL = solution + "/solutionAudit/audit2";
            break;
        case "4":
            auditURL = solution + "/solutionAudit/audit3";
            break;
        default:
            console.log("没有其他审核人")

    }
    $(".audit-box-tip").show();
}

// 保存不同意审核
$(".btn-group").on("click", ".getDocData", function () {
    var opinionCon = $("#opinion-val").val().length;
    if (opinionCon < 1) {
        layer.msg("请输入审核意见");
        return
    }
    var ApplyJson = {
        "accessToken": accessToken,
        "id": moduleId,
        "auditStatus": "3",
        "solutionStage": solutionstage,
        "opinion": $("#opinion-val").val(),
        "applyBy": $(".applyBy").val(),
        "applyName": $(".applyName").val(),
    };
    loadingTip.show();
    xhsdk.ajax({
        url: auditURL,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(ApplyJson),
        success: function (res) {
            if (res.code == 200) {
                loadingTip.hide();
                layer.msg("审核成功");
                setTimeout(function () {
                    parent.init();
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭
                    // parent.location.reload();
                    // $(".audit-box-tip").hide();
                }, 500)
            } else {
                layer.msg(res.data);
                loadingTip.hide();
            }
        },
        error: function (data) {
            loadingTip.hide();
        }
    })
})

// 删除审核意见
function del(_this) {
    $(_this).hide();
}

$(".opinion-box ul li .del-i").click(function () {
    $(this).parent().hide()
})



// 关闭不同意提示框
$(".btn-group").on("click", ".cancelEditor", function () {
    $(".audit-box-tip").hide();
});



