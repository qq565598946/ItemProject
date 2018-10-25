var form = layui.form;
var laydate = layui.laydate;
//拖动初始化
$( function() {
    $( "#sortable" ).sortable();
    $( "#sortable" ).disableSelection();
} );

var  accessToken = sessionStorage.getItem("accessToken");

var xhsdk = new Xhsdk(appID,appSecretKey);

//设置网关
xhsdk.setGetaWayUrl(GetaWay_url);

//设置token
xhsdk.setToken(accessToken);

//设置类型
xhsdk.setReqType("app");

xhsdk.setUserInfo(null);

//日期
laydate.render({
    elem: '#date'
    ,type: 'datetime'
});
laydate.render({
    elem: '#date1'
    ,type: 'datetime'
});
$("#sortable .layui-form-item").each(function (i,n) {
            $(this).attr("data-id",i)
})
$(".ProgrammeList").on('click', 'li', function () {
    $(this).addClass("layui-this").siblings().removeClass("layui-this");
});

var i =2;

var delFlag=null;

//添加实施方案模板
function addProject(flag) {
        if(flag==1){        //区分项目实施回退方案还是变更实施方案删除1:变更实施方案2:项目实施回退方案
            delFlag =1
        }else{
            delFlag =2
            }
    var num = i++;
   var  templateHtml = `<div class="layui-form-item" data-id="`+num+`">
                                    <div class="layui-input-inline" >
                                        <select name="quiz1">
                                            <option value="" selected="" lay-verify="required">请选择</option>
                                             <option value="DP" >DP</option>
                                              <option value="APP">APP</option>
                                  
                                        </select>
                                    </div>
                                    <div class="layui-input-inline">
                                        <select name="quiz2">
                                            <option value="" selected="" lay-verify="required">请选择</option>
                                            <option value="执行">执行</option>
                                            <option value="发布">发布</option>
                                        </select>
                                    </div>
                                <div class="layui-input-inline" style="width:335px">
                                        <input type="text" name="username" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
                                    </div>
                                <div class="box-del" onclick="delbox(this,`+delFlag+`)"><i class="iconfont icon-icon"></i></div>
                        </div>`;
    if(flag==1){
        $(templateHtml).appendTo(".box-change");
    }else if(flag==2){
        $(templateHtml).appendTo(".box-change-back");
    }
    form.render()
}

//删除实施方案模板
function delbox(_this,flag) {
        var templateArr = [];
        var templateArrBack = [];
    if(flag==2) {
        $(".box-change-back .layui-form-item").each(function (i, n) {
            templateArrBack.push(i)
        })
        if (templateArrBack.length <= 1) {
            layer.msg("至少保留一项")
        } else {
            $(_this).parent().remove()
        }
    }else{

        $(".box-change .layui-form-item").each(function (i,n) {
            templateArr.push(i)
        })
        if (templateArr.length <= 1) {
            layer.msg("至少保留一项")
        } else {
            $(_this).parent().remove()
        }
    }

}
//监听提交
form.on('submit(submitCheck)', function (data) {
    projectinfo();
    return false;
});


function projectinfo() {
    var saveJson = {
        "projectName": $("#project_Name").val(),
        "projectCode": "8008208820",
        "status": 0,
        "constructOrgan":"深圳星火电子",
        "constructOrganLeader":$("#staffvalue").val(),
        "projectDescription": $("#project_Background").val(),
        "projectFile": $(".fileUrl").text(),
        "createBy": "huangyuxuan",
        "lastUpdateBy": "huangyuxuan",
        "remark": "备注"
    };
    xhsdk.ajax({
        type: "POST",
        url: solution + "/projectinfo/save",
        contentType: "application/json",
        datatype: 'json',
        data: JSON.stringify(saveJson),
        success: function (res) {
            console.log(res)
            layer.msg("新增成功!", {
                icon: 1,
                time: 600
            }, function () {
                parent.location.reload();
            });
        },
        error: function (data, textStatus) {
            layer.msg('新增失败！');
        }
    });
}












