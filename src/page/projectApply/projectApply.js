var form = layui.form;
var upload = layui.upload; //文件上传
var laypage = layui.laypage; //分页
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
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

var tag = GetQueryString('tag'); // 1 新增 2 修改

var deatailId = GetQueryString('deatailId'); // 项目ID

var status = GetQueryString('status');       // 项目状态

var loadingtip =  $(".loading-box");        // 加载中...

if (tag == 2) {                             // 判断进入修改页面else是进入新增页面

    $(".itemDes").text("项目立项修改");

    $(".right-sp span:eq(1)").text("修改项目");
	
    // 判断状态 0:保存状态3:驳回状态 才能修改
    var editHtml = null;
    if (status == 0) {

        editHtml = `<div class="submitbutton" lay-submit="" lay-filter="sumbitApply" id="submit">提交申请</div>
                        <div class="savebutton" id="save" onclick="projectinfo()">保存</div>`;
        $(".submit-box").html(editHtml)

    } else if (status == 3) {

        editHtml = `<div class="submitbutton" lay-submit="" lay-filter="sumbitApply" id="submit">提交申请</div>`;

        $(".submit-box").html(editHtml)
    }
    detailsData()
} else { // 项目申请并保存
    editHtml = `<div class="submitbutton" lay-submit="" lay-filter="sumbitApply" id="submit">提交申请</div>
                    <div class="savebutton"  id="save" onclick="projectinfo()">保存</div>`;
    $(".submit-box").html(editHtml);
    InitbuildUnit();
}


// 建设单位和项目负责人
function InitbuildUnit() {

    var idJson = {
            "accessToken": accessToken,
    }

    xhsdk.ajax({
        type: "post",
        url: solution + "/projectinfo/getBuildUnitLeader",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(idJson),
        success: function (res) {
            console.log(res)
            if (res.code == 200) {

                    var detailsData = res.data;
                    $("#buildUnit").val(res.data.deptName);
                    $("#staffvalue").val(res.data.userName);
                    $("#staffvalue").attr("data-userId",res.data.userId);
                    $("#buildUnit").attr("data-code",res.data.deptCode);
                    sessionStorage.setItem("deptName",res.data.deptName);  // 单位
                    sessionStorage.setItem("developLeader",res.data.deptCode);

            } else {

                layer.msg(res.data);
            }
        },
        error: function (msg) {

            // layer.msg("请求出现错误!!");
            // console.log("Error:", msg);
        }
    });
}


//项目详情
function detailsData() {
    var idJson = {
        "query": {
            "accessToken": accessToken,
            "id": deatailId,
            "projectName_LIKE": parent.projectName
        }
    };
    loadingtip.show();
    xhsdk.ajax({
        type: "post",
        url: solution + "/projectinfo/find",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(idJson),
        success: function (res) {
            console.log(res)
            if (res.code == 200) {

                var detailsData = res.data;
                initdata(detailsData);

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


//填入数据
function initdata(data) {
    loadingtip.hide();
    $("#project_Name").val(data.projectName);
    $("#project_code").val(data.projectCode);
    $("#buildUnit").val(data.buildUnitName);
    $("#project_Background").text(data.projectDesc);
    $(".file-name").text(data.remark);
    $(".fileUrl").text(data.projectFile);
    $(".download-file").attr("href", data.projectFile);
    $("#staffvalue").val(data.buildUnitLeaderName);
	
	$("#staffvalue").attr("data-userId",data.buildUnitLeader); // 项目负责人ID
	$("#buildUnit").attr("data-code",data.buildUnit)           // 建设单位ID


}

$(".ProgrammeList li").hover(function () {
    $(this).addClass("layui-this").siblings().removeClass("layui-this");
})



upload.render({
    elem: '#project_Enclosure',
    auto:false,
    accept: 'file', //普通文件
    choose:function(obj){
        obj.preview(function(index, file, result){

            $(".file-name").text(file.name);
            uploadingFiles()
        });
    }
});

// 上传附件
function uploadingFiles(){

    var fileName = $("#project_Enclosure")[0].files[0],
        newFormData = new FormData(); // 要上传的文件
    newFormData.append("fileList",fileName);
    newFormData.append("userId",$("#staffvalue").data("userId"));
    newFormData.append("userName",$("#staffvalue").val());
    newFormData.append("terminalType",1);
    newFormData.append("organization",$("#buildUnit").val());
    newFormData.append("organizationId",$("#buildUnit").data("code"));
    loadingtip.show();
    xhsdk.ajax({
        url:fileService_Url+"/s3/file/uploadByIStream",
        type:"POST",
        contentType: false,
        processData: false,
        mimeType:"multipart/form-data",
        data:newFormData,
        success:function(res){
            // console.log(res);
            var res = JSON.parse(res);
            if(res.code == 200){
                loadingtip.hide();
                if(!!res.data){
                    $(".fileUrl").text(res.data[0].fileUrl);
                }

            }else{
                layer.msg("附件上传失败，请重新上传！");
                loadingtip.hide();


            }
        },
        error:function(){
            loadingtip.hide();
            layer.msg("请求出现错误!!");
        }

    });

}


//提交验证
$(".submitbutton").click(function () {
    //验证是否为空
    $(".layui-col-md10 .layui-form-item").each(function (i, n) {
        var inputLength = $(".verify-value").eq(i).val().length;
        if (inputLength < 1) {
            if (i == 3) {
                return
            }
            $(".ProgrammeList li .box-veirfy").eq(i).empty();
            $(".ProgrammeList li .box-veirfy").eq(i).append('<span class="font-red"><i class="iconfont icon-bitian" style="margin:-5px"></i><span>必填</span></span>')
        } else {
            $(".ProgrammeList li .box-veirfy").eq(i).empty();
            $(".ProgrammeList li .box-veirfy").eq(i).append('<span class="correct"><i class="layui-icon-ok layui-icon" style="margin:-5px;font-size: 18px">&#xe605;</i></span>')
            // layer.msg("提交成功")
        }

    })

})


// 保存修改 但不提交申请
var saveFlag = false; // 防止重复点击
        function projectinfo() {

            if (saveFlag==false){
                saveFlag = true;
                var project_Name = $("#project_Name").val().length;
                var project_code = $("#project_code").val().length;
                if(project_Name>30){
                    layer.msg("项目名称字数过多");
                    return
                }
                if(project_code>30){
                    layer.msg("项目编码字数过多");
                    return
                }
                var saveJson = {};
                if (tag == 2) {
                    saveJson.id = deatailId;
                }
                saveJson.accessToken = accessToken;
                saveJson.projectName = $("#project_Name").val();
                saveJson.projectCode =  $("#project_code").val();
                saveJson.buildUnitName =$("#buildUnit").val();
                saveJson.buildUnitLeaderName = $("#staffvalue").val();
                saveJson.projectDesc = $("#project_Background").val();
                saveJson.projectFile = $(".fileUrl").text();
                saveJson.createBy = $("#staffvalue").val();
                saveJson.updateBy = $("#staffvalue").val();
                saveJson.buildUnitLeader = $("#staffvalue").data("userid");
                saveJson.buildUnit = $("#buildUnit").data("code");
                saveJson.remark =$(".file-name").text();
                loadingtip.show();
                xhsdk.ajax({
                    type: "POST",
                    url: solution + "/projectinfo/save",
                    contentType: "application/json",
                    datatype: 'json',
                    timeout:1000,
                    data: JSON.stringify(saveJson),
                    success: function (res) {
                        if (res.code == 200) {

                            loadingtip.hide();
                            layer.msg("完成!", {
                                icon: 1,
                                time: 600
                            }, function () {
                                parent.location.reload();
                            });
                        } else {
                            saveFlag = false
                            loadingtip.hide();
                            layer.msg(res.data)
                        }
                    },
                    error: function (data, textStatus) {
                        loadingtip.hide();
                        layer.msg('失败！');
                    }
                });

            }else{
                    return;
            }



    }







form.verify({
    project_Name: function (value) {
        if (value.length < 1) {
            return '请输入项目名称';
        }else if(value.length>30){
            return '字数过长,请重新输入!'
        }
    },
    project_code: function (value) {
        if (value.length < 1) {
            return '请输入项目编码';
        }else if(value.length>30){
            return '字数过长,请重新输入!'
        }
    },
    project_Background: function (value) {
        if (value.length < 1) {
            return '请输入项目背景';
        }
    }

});

// 提交修改并申请
var applyflag = 0 ; // 防止重复提交
form.on('submit(sumbitApply)', function (data) {
    if(applyflag==0){
        projectapply();
        applyflag = 1;
    }
    return false
});

// 防止重复添加
function projectapply() {
    var applyJson = {
        "accessToken": accessToken,
        "projectName": $("#project_Name").val(),
        "projectCode": $("#project_code").val(),
        "buildUnitName": $("#buildUnit").val(),
        "buildUnitLeaderName": $("#staffvalue").val(),
        "projectDesc": $("#project_Background").val(),
        "projectFile": $(".fileUrl").text(),
        "createBy":$("#staffvalue").val(),
        "updateBy": $("#staffvalue").val(),
        "buildUnitLeader":$("#staffvalue").data("userid"),
        "buildUnit":$("#buildUnit").data("code"),
        "remark": $(".file-name").text(),
        "id": deatailId
    };
    loadingtip.show();
    xhsdk.ajax({
        type: "POST",
        url: solution + "/projectinfo/save",
        contentType: "application/json",
        datatype: 'json',
        data: JSON.stringify(applyJson),
        success: function (res) {
            if (res.code == 200) {
                loadingtip.hide();
                var applyID = res.data;
                if(applyID==null){
                        layer.msg("提交申请失败,请重试....")
                        applyflag = 0;
                         return
                }
                itemapplyID(applyID);

            } else {
                layer.msg(res.data);
                applyflag = 0;
                loadingtip.hide();
            }
        },
        error: function (data, textStatus) {
            loadingtip.hide();
            layer.msg('失败！');
        }
    });

}

// 项目初审申请
function itemapplyID(applyID) {
    var applyIDJson = {
        "accessToken": accessToken,
        "id": applyID,
        "applyBy":$("#staffvalue").val()
    }

    loadingtip.show();
    xhsdk.ajax({
        type: "POST",
        url: solution + "/projectinfo/apply",
        contentType: "application/json",
        datatype: 'json',
        data: JSON.stringify(applyIDJson),
        success: function (res) {
            if (res.code == 200) {
                loadingtip.hide();

                layer.msg("完成!", {
                    icon: 1,
                    time: 600
                }, function () {
                    parent.location.reload();
                });
            } else {

                loadingtip.hide();
                layer.msg(res.data)
            }
        },
        error: function () {
            loadingtip.hide();
            layer.msg('请求失败！');
        }
    });

}

