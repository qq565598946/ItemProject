var form = layui.form;

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

 var  accessToken = GetQueryString('TokenCode');

var xhsdk = new Xhsdk(appID,appSecretKey);

//设置网关
xhsdk.setGetaWayUrl(GetaWay_url);

//设置token
xhsdk.setToken(accessToken);

//设置类型
xhsdk.setReqType("app");

xhsdk.setUserInfo(null);

var deatailId = GetQueryString('deatailId'); // 项目详情ID

var status = GetQueryString('status'); // 项目审核状态(0未提交审核 1审核中 2审核通过 3审核驳回)

var loadingtip = $(".loading-box");

// 判断0草稿和驳回才能显示申请项目操作

if (status == 0 || status == 3) {

    // var applyHTML = `<button class="layui-btn layui-btn-danger layui-btn-sm" style="width:100px" id="appley_button" onclick="Projectapply(this)">申请</button>`;
    //
    // $(".box-audit").html(applyHTML)

} else if (status == 2) {

} else {

    // var auditHTML = `<div class="box-audit"> <button class="layui-btn layui-btn-danger layui-btn-sm" style="width:100px" id="disagree" onclick="isagredd(3)">不同意</button>
    //                     <button onclick="isagredd(2)" class="layui-btn layui-btn-sm" id="agressd" style="width:100px;background-color:#295596;">同意</button></div>`;
    var auditHTML = `<div class="box-audit"> <button class="layui-btn layui-btn-danger layui-btn-sm" style="width:100px" id="disagree" onclick="edit()">审核</button></div>`;
    $(".box-audit").html(auditHTML)
}

// 项目初审申请
function Projectapply(_this) {
    layer.confirm('项目申请', {
        title: '申请',
        btn: ['确认', '取消'] //按钮
    }, function () {
        var applyJson = {
            "id": deatailId,
            "applyBy": $("#applyName").val()
        };

        xhsdk.ajax({
            type: "post",
            url: solution + "/projectinfo/apply",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(applyJson),
            success: function (res) {

                if (res.code == 200) {
                    layer.msg("申请完成!", {
                        icon: 1,
                        time: 600
                    }, function () {
                        parent.location.reload();
                    });
                } else {
                    layer.msg("请求出现错误!!");
                }
            },
            error: function (msg) {
                layer.msg("请求出现错误!!");
            }
        });

    }, function () {
        layer.msg('已取消');
    });

}


$(function () {
    detailsData();
})

// 项目详情
function detailsData() {
    var idJson = {
        "query": {
            "id": deatailId,
            "projectName_LIKE": parent.projectName
        }
    }
    loadingtip.show();
    xhsdk.ajax({
        type: "post",
        url: solution + "/projectinfo/find",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(idJson),
        success: function (res) {
            if (res.code == 200) {
                var detailsData = res.data;
                initdata(detailsData);
                loadingtip.hide();
            } else {
                loadingtip.hide();
                layer.msg("请求出现错误!!");
            }
        },
        error: function (msg) {
            loadingtip.hide();
            layer.msg("请求出现错误!!");
            console.log("Error:", msg);
        }
    });
}

// 填入数据
function initdata(detailsData) {
    var data = detailsData;
    $(".projectName").text(data.projectName);
    $(".projectBackground").text(data.projectDesc);
    // $(".item_name").text(data.projectFile);
    $(".download-file").attr("href", data.projectFile);
    $(".projectResponsible").text(data.buildUnitLeaderName);
    $(".projectCode").text(data.projectCode);
    $(".buildUnitName").text(data.buildUnitName)

}




// 是否同意审核 2 审核通过 3 审核驳回
function isagredd(flag) {
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
        var ApplyJson = {
            "id": deatailId,
            "auditStatus": auditStatus,
            "auditBy": $("#applyName").val()
        };
    loadingtip.show();
        xhsdk.ajax({
            url: solution + "/projectinfo/audit",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(ApplyJson),
            success: function (res) {
                if (res.code==200) {
                    loadingtip.hide();
                    if (flag == 2) {

                        layer.msg("审核通过");
                        setTimeout(function () {
                            parent.location.reload();
                        }, 500)

                    } else {

                        layer.msg("审核不通过");

                        setTimeout(function () {
                            parent.location.reload();
                        }, 500)

                    }
                }
            },
            error: function (data) {
                loadingtip.hide();
            }
        })

    }, function () {
        layer.msg('已取消');

    });
}


$(".ProgrammeList").on('click', 'li', function () {

    var _this = $(this).index();

    $(this).addClass("layui-this").siblings().removeClass("layui-this");

    $(".layui-col-md10 .table-box ").eq(_this).css("display", "block").siblings().css("display", "none")
});

// 取消

$(".btn-group").on("click", ".cancelEditor", function () {
    $(".popUpbox").hide();
})


// 审核意见
var opinion = null;
form.on('radio(staffCheckbox)',function (data) {
        opinion = data.value;
        return false
});
// 保存
$(".btn-group").on("click", ".getDocData", function () {
    var opinionCon  =  $("#opinion").val().length;
     if(opinion==null){
         layer.msg("请选择审核意见！");
        return
     }
    if(opinion == 3){
        if(opinionCon<1){
            layer.msg("请输入审核意见");
            return
        }
    }
    var ApplyJson = {
        "accessToken":accessToken,
        "id": deatailId,
        "auditStatus": opinion,
        "opinion":$("#opinion").val(),
        "auditBy": $("#applyName").val()
    };
    loadingtip.show();
    xhsdk.ajax({
        url: solution + "/projectinfo/audit",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(ApplyJson),
        success: function (res) {
            if (res.code==200) {
                loadingtip.hide();
                layer.msg("审核成功");
                    setTimeout(function () {
                        parent.location.reload();
                    }, 500)
            }else{
                layer.msg(res.data)
                loadingtip.hide();
            }
        },
        error: function (data) {
            loadingtip.hide();
        }
    });
        $(".popUpbox").hide();
})


function edit(_this) {
    $(".popUpbox").show()
}

