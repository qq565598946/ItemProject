"use strict";function GetQueryString(t){var s=new RegExp("(^|&)"+t+"=([^&]*)(&|$)"),e=window.location.search.substr(1).match(s);return null!=e?unescape(e[2]):null}var statusID=GetQueryString("status"),xhsdk=new Xhsdk(appID,appSecretKey);xhsdk.setGetaWayUrl(GetaWay_url),xhsdk.setToken(TokenCode),xhsdk.setReqType("app"),xhsdk.setUserInfo(null),$("#schedule .layui-col-md2").each(function(t,s){$(this).attr("data-id",t);var e=$(this).data("id");statusID==e&&($(this).addClass("startStyle"),$(this).prevAll().addClass("startStyle"))}),$("#schedule .layui-col-md2").click(function(){xhsdk.ajax({type:"post",url:solution+"/projectinfo/find",contentType:"application/json",dataType:"json",data:JSON.stringify(idJson),success:function(t){if(200==t.code){var s=t.data;initdata(s)}else layer.msg("请求出现错误!!")},error:function(t){layer.msg("请求出现错误!!")}})});