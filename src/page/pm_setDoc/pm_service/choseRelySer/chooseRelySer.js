var layer = layui.layer;
var form = layui.form;
$(function () {
    getRelySer();
})


function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var flag = GetQueryString('flag');   //   // 2通用业务服务(多选) 3 基础技术服务(多选)
TokenCode = GetQueryString('TokenCode');   // access_token

var xhsdk = new Xhsdk(appID, appSecretKey);

// 设置网关
xhsdk.setGetaWayUrl(GetaWay_url);

// 设置token
xhsdk.setToken(TokenCode);

// 设置类型
xhsdk.setReqType("app");

xhsdk.setUserInfo(null);
function getRelySer() {

    $(".loading-box1").show();
    xhsdk.ajax({
        url: solution +"/microservice/getServerList",
        // url: "tsconfig.json",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data:'{"accessToken":"'+ accessToken +'"}',
        success: function (res) {
            // console.log(res)
            // if(res.data==null){
            //     layer.msg("暂无服务数据");
            //     return
            // }
            if (res.code == 200) {
                $(".loading-box1").hide();
                $(".allRelySerItem").html("");

                var typeArr1 = res.data.resulList;



                // var typeArr1 = [];


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


                // for(var b = 0;b<parent.relySerArr.length;b++){
                //     for(var i=0;i<res.data.length;i++){
                //         if(parent.relySerArr[b].curr_id == res.data[i].serverinfoID){
                //             res.data[i].isCheck = true;
                //         }
                //     }
                // }

                for (var i = 0; i < typeArr1.length; i++) {
                    if (!!typeArr1[i].isCheck) {
                        $(".allRelySerItem").append("<li><input type='checkbox' name='labelItem' lay-skin='primary' title='" + typeArr1[i].serverName + "' value='" + typeArr1[i].serverinfoID + "' lay-filter='relySerItem' checked='true'></li>");
                        $(".currLabel").append('<li><a href="javscript:#;" id="' + typeArr1[i].serverinfoID + '">' + typeArr1[i].serverName + '</a><i class="layui-icon" onclick="removeLabel(this)">&#x1006;</i></li>');
                    } else {
                        $(".allRelySerItem").append("<li><input type='checkbox' name='labelItem' lay-skin='primary' title='" + typeArr1[i].serverName + "' value='" + typeArr1[i].serverinfoID + "' lay-filter='relySerItem'></li>")
                    }
                }
                form.render("checkbox", 'all_relyService');

            } else {
                parent.parent.errorCode(res.code);
                $(".loading-box1").hide();
            }
        },
        error: function (msg) {
            $(".loading-box1").hide();
            layer.msg("数据请求错误!");
            console.log("获取全部服务Error:", msg);
        }
    })


}


// 选择服务
form.on('checkbox(relySerItem)', function (data) {
    if (data.elem.checked) {
        $(".currLabel").append('<li><a href="javscript:#;" id="' + data.value + '">' + $(this).attr('title') + '</a><i class="layui-icon" onclick="removeLabel(this)">&#x1006;</i></li>');
    } else {
        $(".currLabel li a[id = " + data.value + "]").parent("li").remove();
    }
})


// 保存
form.on("submit(saveLabel)", function (data) {

    if ($(".currLabel").find("li").length == 0) {
        layer.msg("请选择依赖的服务！");
        return;
    }
    parent.relySerArr = [];
    parent.$(".alreadyRelySer").find("li").remove();
    var currLabel_Len = $(".currLabel").find("li").length;
    for (var i = 0; i < currLabel_Len; i++) {
        var currLabel_id = $(".currLabel").find("li:eq(" + i + ")").children("a").attr("id");
        var currLabel_text = $(".currLabel").find("li:eq(" + i + ")").children("a").text();
        if (flag == 2) {
            // 获取选中的标签
            parent.relySerArr.push({'curr_id': currLabel_id, 'text': currLabel_text});
            parent.$(".business ul").append('<li data-curr_id = ' + currLabel_id + '>' + currLabel_text + '<i class="del-btn-con iconfont icon-icon" onclick="delservice(this)"></i></li>');
        } else {
            // 获取选中的标签
            parent.relySerArr.push({'curr_id': currLabel_id, 'text': currLabel_text});
            parent.$(".technical ul").append('<li data-curr_id = ' + currLabel_id + '>' + currLabel_text + '<i class="del-btn-con iconfont icon-icon" onclick="delservice(this)"></i></li>');
        }

    }

    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭
    return false;
});


function removeLabel(_this) {
    var id = $(_this).siblings("a").attr("id");
    $(".allRelySerItem li input[value = " + id + "]").attr("checked", false);
    form.render("checkbox", 'all_relyService_box');
    $(_this).parents("li").remove();
}

function cancel() {
    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    parent.layer.close(index); //再执行关闭
}


