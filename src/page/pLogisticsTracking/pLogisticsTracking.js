function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

var statusID =  GetQueryString('status');    //项目状态（0草稿 1审核中 2通过 3驳回 4下线 5删除）

var xhsdk = new Xhsdk(appID,appSecretKey);

//设置网关
xhsdk.setGetaWayUrl(GetaWay_url);

//设置token
xhsdk.setToken(TokenCode);

//设置类型
xhsdk.setReqType("app");

xhsdk.setUserInfo(null);

$("#schedule .layui-col-md2").each(function (i,n) {
    $(this).attr("data-id",i)
    var statusData = $(this).data("id");
    if(statusID==statusData){
            $(this).addClass("startStyle");
            $(this).prevAll().addClass("startStyle");
    }

})
//点击查看
$("#schedule .layui-col-md2").click(function () {
        console.log($(this).data("id"))
    xhsdk.ajax({
        type:"post",
        url:solution+"/projectinfo/find",
        contentType:"application/json",
        dataType: "json",
        data:JSON.stringify(idJson),
        success:function(res){
            console.log(res)
            if(res.code==200){
                var detailsData = res.data;
                initdata(detailsData)
            }else{
                layer.msg("请求出现错误!!");
            }
        },
        error:function(msg){
            layer.msg("请求出现错误!!");
            console.log("Error:",msg);
        }
    });
})

