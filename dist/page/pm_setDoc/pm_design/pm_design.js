"use strict";var layer=layui.layer,form=layui.form,upload=layui.upload;function GetQueryString(e){var r=new RegExp("(^|&)"+e+"=([^&]*)(&|$)"),a=window.location.search.substr(1).match(r);return null!=a?unescape(a[2]):null}var TokenCode=GetQueryString("TokenCode"),xhsdk=new Xhsdk(appID,appSecretKey);xhsdk.setGetaWayUrl(GetaWay_url),xhsdk.setToken(TokenCode),xhsdk.setReqType("app"),xhsdk.setUserInfo(null);var moduleId=GetQueryString("moduleId"),flag=GetQueryString("flag"),help=GetQueryString("help");