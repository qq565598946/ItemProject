"use strict";var layer=layui.layer,form=layui.form;function GetQueryString(e){var t=new RegExp("(^|&)"+e+"=([^&]*)(&|$)"),a=window.location.search.substr(1).match(t);return null!=a?unescape(a[2]):null}var TokenCode=GetQueryString("TokenCode"),xhsdk=new Xhsdk(appID,appSecretKey);xhsdk.setGetaWayUrl(GetaWay_url),xhsdk.setToken(TokenCode),xhsdk.setReqType("app"),xhsdk.setUserInfo(null);var moduleId=GetQueryString("moduleId"),flag=GetQueryString("flag"),help=GetQueryString("help");if(1==help){$(".sumbit-button").remove();var infoJson={query:{accessToken:accessToken,type:1}};xhsdk.ajax({type:"post",url:solution+"/overview/find",contentType:"application/json",dataType:"json",data:JSON.stringify(infoJson),success:function(e){200==e.code?($("#pj-background").children("textarea").val(e.data.projectBackground),$("#systemCurrent").children("textarea").val(e.data.systemCurrent),$("#buildGoal").children("textarea").val(e.data.buildGoal),$("#buildContent").children("textarea").val(e.data.buildContent)):layer.msg(e.data)},error:function(e){layer.msg("请求出现错误!!")}})}