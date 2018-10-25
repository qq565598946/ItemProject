if (typeof jQuery !== "undefined" && typeof saveAs !== "undefined") {
    (function($) {
        $.fn.wordExport = function(fileName) {
            fileName = typeof fileName !== 'undefined' ? fileName : "实施方案";
            var static1 = {
                mhtml: {
                    top: "Mime-Version: 1.0\nContent-Base: " + location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + location.href + "\n\n<!DOCTYPE html>\n<html>\n_html_</html>",
                    head: "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\n_styles_\n</style>\n</head>\n",
                    body: "<body>_body_</body>"
                }
            };
            var options = {
                maxWidth: 624
            };
            // Clone selected element before manipulating it
            var markup = $(this).clone();

            // Remove hidden elements from the output
            markup.each(function() {
                var self = $(this);
                if (self.is(':hidden'))
                    self.remove();
            });

            // Embed all images using Data URLs
            var images = Array();
            var img = markup.find('img');
            for (var i = 0; i < img.length; i++) {
                // Calculate dimensions of output image
                var w = Math.min(img[i].width, options.maxWidth);
                var h = img[i].height * (w / img[i].width);
                // Create canvas for converting image to data URL
                var canvas = document.createElement("CANVAS");
                canvas.width = w;
                canvas.height = h;
                // Draw image to canvas
                var context = canvas.getContext('2d');
                context.drawImage(img[i], 0, 0, w, h);
                // Get data URL encoding of image
                var uri = canvas.toDataURL("image/png");
                $(img[i]).attr("src", img[i].src);
                img[i].width = w;
                img[i].height = h;
                // Save encoded image to array
                images[i] = {
                    type: uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")),
                    encoding: uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")),
                    location: $(img[i]).attr("src"),
                    data: uri.substring(uri.indexOf(",") + 1)
                };
            }

            // Prepare bottom of mhtml file with image data
            var mhtmlBottom = "\n";
            for (var i = 0; i < images.length; i++) {
                mhtmlBottom += "--NEXT.ITEM-BOUNDARY\n";
                mhtmlBottom += "Content-Location: " + images[i].location + "\n";
                mhtmlBottom += "Content-Type: " + images[i].type + "\n";
                mhtmlBottom += "Content-Transfer-Encoding: " + images[i].encoding + "\n\n";
                mhtmlBottom += images[i].data + "\n\n";
            }
            mhtmlBottom += "--NEXT.ITEM-BOUNDARY--";

            //TODO: load css from included stylesheet
            var styles = `
            /** layui-v2.2.6 MIT License By https://www.layui.com */
.layui-inline, img {
    display: inline-block;
    vertical-align: middle
}

h1, h2, h3, h4, h5, h6 {
    font-weight: 400
}

.layui-edge, .layui-header, .layui-inline, .layui-main {
    position: relative
}

.layui-btn, .layui-edge, .layui-inline, img {
    vertical-align: middle
}

.layui-btn, .layui-disabled, .layui-icon, .layui-unselect {
    -webkit-user-select: none;
    -ms-user-select: none;
    -moz-user-select: none
}

blockquote, body, button, dd, div, dl, dt, form, h1, h2, h3, h4, h5, h6, input, li, ol, p, pre, td, textarea, th, ul {
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0)
}

a:active, a:hover {
    outline: 0
}

img {
    border: none
}

li {
    list-style: none
}

table {
    border-collapse: collapse;
    border-spacing: 0
}

h4, h5, h6 {
    font-size: 100%
}

button, input, optgroup, option, select, textarea {
    font-family: inherit;
    font-size: inherit;
    font-style: inherit;
    font-weight: inherit;
    outline: 0
}

pre {
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word
}

body {
    line-height: 24px;
    font: 14px Helvetica Neue, Helvetica, PingFang SC, \\5FAE\\8F6F\\96C5\\9ED1, Tahoma, Arial, sans-serif
}

hr {
    height: 1px;
    margin: 10px 0;
    border: 0;
    clear: both
}

a {
    color: #333;
    text-decoration: none
}

a:hover {
    color: #777
}

a cite {
    font-style: normal;
    *cursor: pointer
}

.layui-border-box, .layui-border-box * {
    box-sizing: border-box
}

.layui-box, .layui-box * {
    box-sizing: content-box
}

.layui-clear {
    clear: both;
    *zoom: 1
}

.layui-clear:after {
    content: '\\20';
    clear: both;
    *zoom: 1;
    display: block;
    height: 0
}

.layui-inline {
    *display: inline;
    *zoom: 1
}

.layui-edge {
    display: inline-block;
    width: 0;
    height: 0;
    border-width: 6px;
    border-style: dashed;
    border-color: transparent;
    overflow: hidden
}

.layui-edge-top {
    top: -4px;
    border-bottom-color: #999;
    border-bottom-style: solid
}

.layui-edge-right {
    border-left-color: #999;
    border-left-style: solid
}

.layui-edge-bottom {
    top: 2px;
    border-top-color: #999;
    border-top-style: solid
}

.layui-edge-left {
    border-right-color: #999;
    border-right-style: solid
}

.layui-elip {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap
}

.layui-disabled, .layui-disabled:hover {
    color: #d2d2d2 !important;
    cursor: not-allowed !important
}

.layui-circle {
    border-radius: 100%
}

.layui-show {
    display: block !important
}

.layui-hide {
    display: none !important
}

@font-face {
    font-family: layui-icon;
    src: url(../font/iconfont.eot?v=226_rc2);
    src: url(../font/iconfont.eot?v=226_rc2#iefix) format('embedded-opentype'), url(../font/iconfont.svg?v=226_rc2#iconfont) format('svg'), url(../font/iconfont.woff?v=226_rc2) format('woff'), url(../font/iconfont.ttf?v=226_rc2) format('truetype')
}

.layui-icon {
    font-family: layui-icon !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale
}

.layui-icon-duihua:before {
    content: "\\e611"
}

.layui-icon-shezhi:before {
    content: "\\e614"
}

.layui-icon-yinshenim:before {
    content: "\\e60f"
}

.layui-icon-search:before {
    content: "\\e615"
}

.layui-icon-fenxiang1:before {
    content: "\\e641"
}

.layui-icon-shezhi1:before {
    content: "\\e620"
}

.layui-icon-yinqing:before {
    content: "\\e628"
}

.layui-icon-close:before {
    content: "\\1006"
}

.layui-icon-close-fill:before {
    content: "\\1007"
}

.layui-icon-baobiao:before {
    content: "\\e629"
}

.layui-icon-star:before {
    content: "\\e600"
}

.layui-icon-yuandian:before {
    content: "\\e617"
}

.layui-icon-chat:before {
    content: "\\e606"
}

.layui-icon-logo:before {
    content: "\\e609"
}

.layui-icon-list:before {
    content: "\\e60a"
}

.layui-icon-tubiao:before {
    content: "\\e62c"
}

.layui-icon-ok-circle:before {
    content: "\\1005"
}

.layui-icon-huanfu2:before {
    content: "\\e61b"
}

.layui-icon-On-line:before {
    content: "\\e610"
}

.layui-icon-biaoge:before {
    content: "\\e62d"
}

.layui-icon-right:before {
    content: "\\e602"
}

.layui-icon-left:before {
    content: "\\e603"
}

.layui-icon-cart-simple:before {
    content: "\\e698"
}

.layui-icon-cry:before {
    content: "\\e69c"
}

.layui-icon-smile:before {
    content: "\\e6af"
}

.layui-icon-survey:before {
    content: "\\e6b2"
}

.layui-icon-tree:before {
    content: "\\e62e"
}

.layui-icon-iconfont17:before {
    content: "\\e62f"
}

.layui-icon-tianjia:before {
    content: "\\e61f"
}

.layui-icon-download-circle:before {
    content: "\\e601"
}

.layui-icon-xuanzemoban48:before {
    content: "\\e630"
}

.layui-icon-gongju:before {
    content: "\\e631"
}

.layui-icon-face-surprised:before {
    content: "\\e664"
}

.layui-icon-bianji:before {
    content: "\\e642"
}

.layui-icon-speaker:before {
    content: "\\e645"
}

.layui-icon-down:before {
    content: "\\e61a"
}

.layui-icon-wenjian:before {
    content: "\\e621"
}

.layui-icon-layouts:before {
    content: "\\e632"
}

.layui-icon-duigou:before {
    content: "\\e618"
}

.layui-icon-tianjia1:before {
    content: "\\e608"
}

.layui-icon-yaoyaozhibofanye:before {
    content: "\\e633"
}

.layui-icon-read:before {
    content: "\\e705"
}

.layui-icon-404:before {
    content: "\\e61c"
}

.layui-icon-lunbozutu:before {
    content: "\\e634"
}

.layui-icon-help:before {
    content: "\\e607"
}

.layui-icon-daima1:before {
    content: "\\e635"
}

.layui-icon-jinshui:before {
    content: "\\e636"
}

.layui-icon-username:before {
    content: "\\e66f"
}

.layui-icon-find-fill:before {
    content: "\\e670"
}

.layui-icon-about:before {
    content: "\\e60b"
}

.layui-icon-location:before {
    content: "\\e715"
}

.layui-icon-up:before {
    content: "\\e619"
}

.layui-icon-pause:before {
    content: "\\e651"
}

.layui-icon-riqi:before {
    content: "\\e637"
}

.layui-icon-uploadfile:before {
    content: "\\e61d"
}

.layui-icon-delete:before {
    content: "\\e640"
}

.layui-icon-play:before {
    content: "\\e652"
}

.layui-icon-top:before {
    content: "\\e604"
}

.layui-icon-haoyouqingqiu:before {
    content: "\\e612"
}

.layui-icon-refresh-3:before {
    content: "\\e9aa"
}

.layui-icon-weibiaoti1:before {
    content: "\\e605"
}

.layui-icon-chuangkou:before {
    content: "\\e638"
}

.layui-icon-comiisbiaoqing:before {
    content: "\\e60c"
}

.layui-icon-zhengque:before {
    content: "\\e616"
}

.layui-icon-dollar:before {
    content: "\\e659"
}

.layui-icon-iconfontwodehaoyou:before {
    content: "\\e613"
}

.layui-icon-wenjianxiazai:before {
    content: "\\e61e"
}

.layui-icon-tupian:before {
    content: "\\e60d"
}

.layui-icon-lianjie:before {
    content: "\\e64c"
}

.layui-icon-diamond:before {
    content: "\\e735"
}

.layui-icon-jilu:before {
    content: "\\e60e"
}

.layui-icon-liucheng:before {
    content: "\\e622"
}

.layui-icon-fontstrikethrough:before {
    content: "\\e64f"
}

.layui-icon-unlink:before {
    content: "\\e64d"
}

.layui-icon-bianjiwenzi:before {
    content: "\\e639"
}

.layui-icon-sanjiao:before {
    content: "\\e623"
}

.layui-icon-danxuankuanghouxuan:before {
    content: "\\e63f"
}

.layui-icon-danxuankuangxuanzhong:before {
    content: "\\e643"
}

.layui-icon-juzhongduiqi:before {
    content: "\\e647"
}

.layui-icon-youduiqi:before {
    content: "\\e648"
}

.layui-icon-zuoduiqi:before {
    content: "\\e649"
}

.layui-icon-gongsisvgtubiaozongji22:before {
    content: "\\e626"
}

.layui-icon-gongsisvgtubiaozongji23:before {
    content: "\\e627"
}

.layui-icon-refresh-2:before {
    content: "\\1002"
}

.layui-icon-loading-1:before {
    content: "\\e63e"
}

.layui-icon-return:before {
    content: "\\e65c"
}

.layui-icon-jiacu:before {
    content: "\\e62b"
}

.layui-icon-uploading:before {
    content: "\\e67c"
}

.layui-icon-liaotianduihuaimgoutong:before {
    content: "\\e63a"
}

.layui-icon-video:before {
    content: "\\e6ed"
}

.layui-icon-headset:before {
    content: "\\e6fc"
}

.layui-icon-wenjianjiafan:before {
    content: "\\e624"
}

.layui-icon-shouji:before {
    content: "\\e63b"
}

.layui-icon-tianjia2:before {
    content: "\\e654"
}

.layui-icon-wenjianjia:before {
    content: "\\e7a0"
}

.layui-icon-biaoqing:before {
    content: "\\e650"
}

.layui-icon-html:before {
    content: "\\e64b"
}

.layui-icon-biaodan:before {
    content: "\\e63c"
}

.layui-icon-cart:before {
    content: "\\e657"
}

.layui-icon-camera-fill:before {
    content: "\\e65d"
}

.layui-icon-25:before {
    content: "\\e62a"
}

.layui-icon-emwdaima:before {
    content: "\\e64e"
}

.layui-icon-fire:before {
    content: "\\e756"
}

.layui-icon-set:before {
    content: "\\e716"
}

.layui-icon-zitixiahuaxian:before {
    content: "\\e646"
}

.layui-icon-sanjiao1:before {
    content: "\\e625"
}

.layui-icon-tips:before {
    content: "\\e702"
}

.layui-icon-tupian-copy-copy:before {
    content: "\\e64a"
}

.layui-icon-more-vertical:before {
    content: "\\e671"
}

.layui-icon-zhuti2:before {
    content: "\\e66c"
}

.layui-icon-loading:before {
    content: "\\e63d"
}

.layui-icon-xieti:before {
    content: "\\e644"
}

.layui-icon-refresh-1:before {
    content: "\\e666"
}

.layui-icon-rmb:before {
    content: "\\e65e"
}

.layui-icon-home:before {
    content: "\\e68e"
}

.layui-icon-user:before {
    content: "\\e770"
}

.layui-icon-notice:before {
    content: "\\e667"
}

.layui-icon-login-weibo:before {
    content: "\\e675"
}

.layui-icon-voice:before {
    content: "\\e688"
}

.layui-icon-download:before {
    content: "\\e681"
}

.layui-icon-login-qq:before {
    content: "\\e676"
}

.layui-icon-snowflake:before {
    content: "\\e6b1"
}

.layui-icon-yemian1:before {
    content: "\\e655"
}

.layui-icon-template:before {
    content: "\\e663"
}

.layui-icon-auz:before {
    content: "\\e672"
}

.layui-icon-console:before {
    content: "\\e665"
}

.layui-icon-app:before {
    content: "\\e653"
}

.layui-icon-prev:before {
    content: "\\e65a"
}

.layui-icon-website:before {
    content: "\\e7ae"
}

.layui-icon-next:before {
    content: "\\e65b"
}

.layui-icon-component:before {
    content: "\\e857"
}

.layui-icon-more:before {
    content: "\\e65f"
}

.layui-icon-login-wechat:before {
    content: "\\e677"
}

.layui-icon-shrink-right:before {
    content: "\\e668"
}

.layui-icon-spread-left:before {
    content: "\\e66b"
}

.layui-icon-camera:before {
    content: "\\e660"
}

.layui-icon-note:before {
    content: "\\e66e"
}

.layui-icon-refresh:before {
    content: "\\e669"
}

.layui-icon-nv:before {
    content: "\\e661"
}

.layui-icon-nan:before {
    content: "\\e662"
}

.layui-icon-password:before {
    content: "\\e673"
}

.layui-icon-senior:before {
    content: "\\e674"
}

.layui-icon-theme:before {
    content: "\\e66a"
}

.layui-icon-tread:before {
    content: "\\e6c5"
}

.layui-icon-praise:before {
    content: "\\e6c6"
}

.layui-icon-star-fill:before {
    content: "\\e658"
}

.layui-icon-template-1:before {
    content: "\\e656"
}

.layui-icon-loading-2:before {
    content: "\\e66d"
}

.layui-icon-vercode:before {
    content: "\\e679"
}

.layui-icon-cellphone:before {
    content: "\\e678"
}

.layui-main {
    width: 1140px;
    margin: 0 auto
}

.layui-header {
    z-index: 1000;
    height: 60px
}

.layui-header a:hover {
    transition: all .5s;
    -webkit-transition: all .5s
}

.layui-side {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 999;
    width: 200px;
    overflow-x: hidden
}

.layui-side-scroll {
    position: relative;
    width: 220px;
    height: 100%;
    overflow-x: hidden
}

.layui-body {
    position: absolute;
    left: 200px;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 998;
    width: auto;
    overflow: hidden;
    overflow-y: auto;
    box-sizing: border-box
}

.layui-layout-body {
    overflow: hidden
}

.layui-layout-admin .layui-header {
    background-color: #23262E
}

.layui-layout-admin .layui-side {
    top: 60px;
    width: 200px;
    overflow-x: hidden
}

.layui-layout-admin .layui-body {
    top: 60px;
    bottom: 44px
}

.layui-layout-admin .layui-main {
    width: auto;
    margin: 0 15px
}

.layui-layout-admin .layui-footer {
    position: fixed;
    left: 200px;
    right: 0;
    bottom: 0;
    height: 44px;
    line-height: 44px;
    padding: 0 15px;
    background-color: #eee
}

.layui-layout-admin .layui-logo {
    position: absolute;
    left: 0;
    top: 0;
    width: 200px;
    height: 100%;
    line-height: 60px;
    text-align: center;
    color: #009688;
    font-size: 16px
}

.layui-layout-admin .layui-header .layui-nav {
    background: 0 0
}

.layui-layout-left {
    position: absolute !important;
    left: 200px;
    top: 0
}

.layui-layout-right {
    position: absolute !important;
    right: 0;
    top: 0
}

.layui-container {
    position: relative;
    margin: 0 auto;
    padding: 0 15px;
    box-sizing: border-box
}

.layui-fluid {
    position: relative;
    margin: 0 auto;
    padding: 0 15px
}

.layui-row:after, .layui-row:before {
    content: '';
    display: block;
    clear: both
}

.layui-col-lg1, .layui-col-lg10, .layui-col-lg11, .layui-col-lg12, .layui-col-lg2, .layui-col-lg3, .layui-col-lg4, .layui-col-lg5, .layui-col-lg6, .layui-col-lg7, .layui-col-lg8, .layui-col-lg9, .layui-col-md1, .layui-col-md10, .layui-col-md11, .layui-col-md12, .layui-col-md2, .layui-col-md3, .layui-col-md4, .layui-col-md5, .layui-col-md6, .layui-col-md7, .layui-col-md8, .layui-col-md9, .layui-col-sm1, .layui-col-sm10, .layui-col-sm11, .layui-col-sm12, .layui-col-sm2, .layui-col-sm3, .layui-col-sm4, .layui-col-sm5, .layui-col-sm6, .layui-col-sm7, .layui-col-sm8, .layui-col-sm9, .layui-col-xs1, .layui-col-xs10, .layui-col-xs11, .layui-col-xs12, .layui-col-xs2, .layui-col-xs3, .layui-col-xs4, .layui-col-xs5, .layui-col-xs6, .layui-col-xs7, .layui-col-xs8, .layui-col-xs9 {
    position: relative;
    display: block;
    box-sizing: border-box
}

.layui-col-xs1, .layui-col-xs10, .layui-col-xs11, .layui-col-xs12, .layui-col-xs2, .layui-col-xs3, .layui-col-xs4, .layui-col-xs5, .layui-col-xs6, .layui-col-xs7, .layui-col-xs8, .layui-col-xs9 {
    float: left
}

.layui-col-xs1 {
    width: 8.33333333%
}

.layui-col-xs2 {
    width: 16.66666667%
}

.layui-col-xs3 {
    width: 25%
}

.layui-col-xs4 {
    width: 33.33333333%
}

.layui-col-xs5 {
    width: 41.66666667%
}

.layui-col-xs6 {
    width: 50%
}

.layui-col-xs7 {
    width: 58.33333333%
}

.layui-col-xs8 {
    width: 66.66666667%
}

.layui-col-xs9 {
    width: 75%
}

.layui-col-xs10 {
    width: 83.33333333%
}

.layui-col-xs11 {
    width: 91.66666667%
}

.layui-col-xs12 {
    width: 100%
}

.layui-col-xs-offset1 {
    margin-left: 8.33333333%
}

.layui-col-xs-offset2 {
    margin-left: 16.66666667%
}

.layui-col-xs-offset3 {
    margin-left: 25%
}

.layui-col-xs-offset4 {
    margin-left: 33.33333333%
}

.layui-col-xs-offset5 {
    margin-left: 41.66666667%
}

.layui-col-xs-offset6 {
    margin-left: 50%
}

.layui-col-xs-offset7 {
    margin-left: 58.33333333%
}

.layui-col-xs-offset8 {
    margin-left: 66.66666667%
}

.layui-col-xs-offset9 {
    margin-left: 75%
}

.layui-col-xs-offset10 {
    margin-left: 83.33333333%
}

.layui-col-xs-offset11 {
    margin-left: 91.66666667%
}

.layui-col-xs-offset12 {
    margin-left: 100%
}

@media screen and (max-width: 768px) {
    .layui-hide-xs {
        display: none !important
    }

    .layui-show-xs-block {
        display: block !important
    }

    .layui-show-xs-inline {
        display: inline !important
    }

    .layui-show-xs-inline-block {
        display: inline-block !important
    }
}

@media screen and (min-width: 768px) {
    .layui-container {
        width: 750px
    }

    .layui-hide-sm {
        display: none !important
    }

    .layui-show-sm-block {
        display: block !important
    }

    .layui-show-sm-inline {
        display: inline !important
    }

    .layui-show-sm-inline-block {
        display: inline-block !important
    }

    .layui-col-sm1, .layui-col-sm10, .layui-col-sm11, .layui-col-sm12, .layui-col-sm2, .layui-col-sm3, .layui-col-sm4, .layui-col-sm5, .layui-col-sm6, .layui-col-sm7, .layui-col-sm8, .layui-col-sm9 {
        float: left
    }

    .layui-col-sm1 {
        width: 8.33333333%
    }

    .layui-col-sm2 {
        width: 16.66666667%
    }

    .layui-col-sm3 {
        width: 25%
    }

    .layui-col-sm4 {
        width: 33.33333333%
    }

    .layui-col-sm5 {
        width: 41.66666667%
    }

    .layui-col-sm6 {
        width: 50%
    }

    .layui-col-sm7 {
        width: 58.33333333%
    }

    .layui-col-sm8 {
        width: 66.66666667%
    }

    .layui-col-sm9 {
        width: 75%
    }

    .layui-col-sm10 {
        width: 83.33333333%
    }

    .layui-col-sm11 {
        width: 91.66666667%
    }

    .layui-col-sm12 {
        width: 100%
    }

    .layui-col-sm-offset1 {
        margin-left: 8.33333333%
    }

    .layui-col-sm-offset2 {
        margin-left: 16.66666667%
    }

    .layui-col-sm-offset3 {
        margin-left: 25%
    }

    .layui-col-sm-offset4 {
        margin-left: 33.33333333%
    }

    .layui-col-sm-offset5 {
        margin-left: 41.66666667%
    }

    .layui-col-sm-offset6 {
        margin-left: 50%
    }

    .layui-col-sm-offset7 {
        margin-left: 58.33333333%
    }

    .layui-col-sm-offset8 {
        margin-left: 66.66666667%
    }

    .layui-col-sm-offset9 {
        margin-left: 75%
    }

    .layui-col-sm-offset10 {
        margin-left: 83.33333333%
    }

    .layui-col-sm-offset11 {
        margin-left: 91.66666667%
    }

    .layui-col-sm-offset12 {
        margin-left: 100%
    }
}

@media screen and (min-width: 992px) {
    .layui-container {
        width: 970px
    }

    .layui-hide-md {
        display: none !important
    }

    .layui-show-md-block {
        display: block !important
    }

    .layui-show-md-inline {
        display: inline !important
    }

    .layui-show-md-inline-block {
        display: inline-block !important
    }

    .layui-col-md1, .layui-col-md10, .layui-col-md11, .layui-col-md12, .layui-col-md2, .layui-col-md3, .layui-col-md4, .layui-col-md5, .layui-col-md6, .layui-col-md7, .layui-col-md8, .layui-col-md9 {
        float: left
    }

    .layui-col-md1 {
        width: 8.33333333%
    }

    .layui-col-md2 {
        width: 20.666667%;
    }

    .layui-col-md3 {
        width: 25%
    }

    .layui-col-md4 {
        width: 33.33333333%
    }

    .layui-col-md5 {
        width: 41.66666667%
    }

    .layui-col-md6 {
        width: 50%
    }

    .layui-col-md7 {
        width: 58.33333333%
    }

    .layui-col-md8 {
        width: 66.66666667%
    }

    .layui-col-md9 {
        width: 75%
    }

    .layui-col-md10 {
        width: 83.33333333%
    }

    .layui-col-md11 {
        width: 91.66666667%
    }

    .layui-col-md12 {
        width: 100%
    }

    .layui-col-md-offset1 {
        margin-left: 8.33333333%
    }

    .layui-col-md-offset2 {
        margin-left: 16.66666667%
    }

    .layui-col-md-offset3 {
        margin-left: 25%
    }

    .layui-col-md-offset4 {
        margin-left: 33.33333333%
    }

    .layui-col-md-offset5 {
        margin-left: 41.66666667%
    }

    .layui-col-md-offset6 {
        margin-left: 50%
    }

    .layui-col-md-offset7 {
        margin-left: 58.33333333%
    }

    .layui-col-md-offset8 {
        margin-left: 66.66666667%
    }

    .layui-col-md-offset9 {
        margin-left: 75%
    }

    .layui-col-md-offset10 {
        margin-left: 83.33333333%
    }

    .layui-col-md-offset11 {
        margin-left: 91.66666667%
    }

    .layui-col-md-offset12 {
        margin-left: 100%
    }
}

@media screen and (min-width: 1200px) {
    .layui-container {
        width: 1170px
    }

    .layui-hide-lg {
        display: none !important
    }

    .layui-show-lg-block {
        display: block !important
    }

    .layui-show-lg-inline {
        display: inline !important
    }

    .layui-show-lg-inline-block {
        display: inline-block !important
    }

    .layui-col-lg1, .layui-col-lg10, .layui-col-lg11, .layui-col-lg12, .layui-col-lg2, .layui-col-lg3, .layui-col-lg4, .layui-col-lg5, .layui-col-lg6, .layui-col-lg7, .layui-col-lg8, .layui-col-lg9 {
        float: left
    }

    .layui-col-lg1 {
        width: 8.33333333%
    }

    .layui-col-lg2 {
        width: 16.66666667%
    }

    .layui-col-lg3 {
        width: 25%
    }

    .layui-col-lg4 {
        width: 33.33333333%
    }

    .layui-col-lg5 {
        width: 41.66666667%
    }

    .layui-col-lg6 {
        width: 50%
    }

    .layui-col-lg7 {
        width: 58.33333333%
    }

    .layui-col-lg8 {
        width: 66.66666667%
    }

    .layui-col-lg9 {
        width: 75%
    }

    .layui-col-lg10 {
        width: 83.33333333%
    }

    .layui-col-lg11 {
        width: 91.66666667%
    }

    .layui-col-lg12 {
        width: 100%
    }

    .layui-col-lg-offset1 {
        margin-left: 8.33333333%
    }

    .layui-col-lg-offset2 {
        margin-left: 16.66666667%
    }

    .layui-col-lg-offset3 {
        margin-left: 25%
    }

    .layui-col-lg-offset4 {
        margin-left: 33.33333333%
    }

    .layui-col-lg-offset5 {
        margin-left: 41.66666667%
    }

    .layui-col-lg-offset6 {
        margin-left: 50%
    }

    .layui-col-lg-offset7 {
        margin-left: 58.33333333%
    }

    .layui-col-lg-offset8 {
        margin-left: 66.66666667%
    }

    .layui-col-lg-offset9 {
        margin-left: 75%
    }

    .layui-col-lg-offset10 {
        margin-left: 83.33333333%
    }

    .layui-col-lg-offset11 {
        margin-left: 91.66666667%
    }

    .layui-col-lg-offset12 {
        margin-left: 100%
    }
}

.layui-col-space1 {
    margin: -.5px
}

.layui-col-space1 > * {
    padding: .5px
}

.layui-col-space3 {
    margin: -1.5px
}

.layui-col-space3 > * {
    padding: 1.5px
}

.layui-col-space5 {
    margin: -2.5px
}

.layui-col-space5 > * {
    padding: 2.5px
}

.layui-col-space8 {
    margin: -3.5px
}

.layui-col-space8 > * {
    padding: 3.5px
}

.layui-col-space10 {
    margin: -5px
}

.layui-col-space10 > * {
    padding: 5px
}

.layui-col-space12 {
    margin: -6px
}

.layui-col-space12 > * {
    padding: 6px
}

.layui-col-space15 {
    margin: -7.5px
}

.layui-col-space15 > * {
    padding: 7.5px
}

.layui-col-space18 {
    margin: -9px
}

.layui-col-space18 > * {
    padding: 9px
}

.layui-col-space20 {
    margin: -10px
}

.layui-col-space20 > * {
    padding: 10px
}

.layui-col-space22 {
    margin: -11px
}

.layui-col-space22 > * {
    padding: 11px
}

.layui-col-space25 {
    margin: -12.5px
}

.layui-col-space25 > * {
    padding: 12.5px
}

.layui-col-space30 {
    margin: -15px
}

.layui-col-space30 > * {
    padding: 15px
}

.layui-btn, .layui-input, .layui-select, .layui-textarea, .layui-upload-button {
    outline: 0;
    -webkit-appearance: none;
    transition: all .3s;
    -webkit-transition: all .3s;
    box-sizing: border-box
}

.layui-elem-quote {
    margin-bottom: 10px;
    padding: 15px;
    line-height: 22px;
    border-left: 5px solid #009688;
    border-radius: 0 2px 2px 0;
    background-color: #f2f2f2
}

.layui-quote-nm {
    border-style: solid;
    border-width: 1px 1px 1px 5px;
    background: 0 0
}

.layui-elem-field {
    margin-bottom: 10px;
    padding: 0;
    border-width: 1px;
    border-style: solid
}

.layui-elem-field legend {
    margin-left: 20px;
    padding: 0 10px;
    font-size: 20px;
    font-weight: 300
}

.layui-field-title {
    margin: 10px 0 20px;
    border-width: 1px 0 0
}

.layui-field-box {
    padding: 10px 15px
}

.layui-field-title .layui-field-box {
    padding: 10px 0
}

.layui-progress {
    position: relative;
    height: 6px;
    border-radius: 20px;
    background-color: #e2e2e2
}

.layui-progress-bar {
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    max-width: 100%;
    height: 6px;
    border-radius: 20px;
    text-align: right;
    background-color: #5FB878;
    transition: all .3s;
    -webkit-transition: all .3s
}

.layui-progress-big, .layui-progress-big .layui-progress-bar {
    height: 18px;
    line-height: 18px
}

.layui-progress-text {
    position: relative;
    top: -20px;
    line-height: 18px;
    font-size: 12px;
    color: #666
}

.layui-progress-big .layui-progress-text {
    position: static;
    padding: 0 10px;
    color: #fff
}

.layui-collapse {
    border-width: 1px;
    border-style: solid;
    border-radius: 2px
}

.layui-colla-content, .layui-colla-item {
    border-top-width: 1px;
    border-top-style: solid
}

.layui-colla-item:first-child {
    border-top: none
}

.layui-colla-title {
    position: relative;
    height: 42px;
    line-height: 42px;
    padding: 0 15px 0 35px;
    color: #333;
    background-color: #f2f2f2;
    cursor: pointer;
    font-size: 14px;
    overflow: hidden
}

.layui-colla-content {
    display: none;
    padding: 10px 15px;
    line-height: 22px;
    color: #666
}

.layui-colla-icon {
    position: absolute;
    left: 15px;
    top: 0;
    font-size: 14px
}

.layui-card-body, .layui-card-header, .layui-form-label, .layui-form-mid, .layui-form-select, .layui-input-block, .layui-input-inline, .layui-textarea {
    position: relative
}

.layui-card {
    margin-bottom: 15px;
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05)
}

.layui-card:last-child {
    margin-bottom: 0
}

.layui-card-header {
    height: 42px;
    line-height: 42px;
    padding: 0 15px;
    border-bottom: 1px solid #f6f6f6;
    color: #333;
    border-radius: 2px 2px 0 0;
    font-size: 14px
}

.layui-bg-black, .layui-bg-blue, .layui-bg-cyan, .layui-bg-green, .layui-bg-orange, .layui-bg-red {
    color: #fff !important
}

.layui-card-body {
    padding: 10px 15px;
    line-height: 24px
}

.layui-card-body[pad15] {
    padding: 15px
}

.layui-card-body[pad20] {
    padding: 20px
}

.layui-card-body .layui-table {
    margin: 5px 0
}

.layui-card .layui-tab {
    margin: 0
}

.layui-panel-window {
    position: relative;
    padding: 15px;
    border-radius: 0;
    border-top: 5px solid #E6E6E6;
    background-color: #fff
}

.layui-bg-red {
    background-color: #FF5722 !important
}

.layui-bg-orange {
    background-color: #FFB800 !important
}

.layui-bg-green {
    background-color: #009688 !important
}

.layui-bg-cyan {
    background-color: #2F4056 !important
}

.layui-bg-blue {
    background-color: #1E9FFF !important
}

.layui-bg-black {
    background-color: #393D49 !important
}

.layui-bg-gray {
    background-color: #eee !important;
    color: #666 !important
}

.layui-badge-rim, .layui-colla-content, .layui-colla-item, .layui-collapse, .layui-elem-field, .layui-form-pane .layui-form-item[pane], .layui-form-pane .layui-form-label, .layui-input, .layui-layedit, .layui-layedit-tool, .layui-quote-nm, .layui-select, .layui-tab-bar, .layui-tab-card, .layui-tab-title, .layui-tab-title .layui-this:after, .layui-textarea {
    border-color: #e6e6e6
}

.layui-timeline-item:before, hr {
    background-color: #e6e6e6
}

.layui-text {
    line-height: 22px;
    font-size: 14px;
    color: #666
}

.layui-text h1, .layui-text h2, .layui-text h3 {
    font-weight: 500;
    color: #333
}

.layui-text h1 {
    font-size: 30px
}

.layui-text h2 {
    font-size: 24px
}

.layui-text h3 {
    font-size: 18px
}

.layui-text a:not(.layui-btn) {
    color: #01AAED
}

.layui-text a:not(.layui-btn):hover {
    text-decoration: underline
}

.layui-text ul {
    padding: 5px 0 5px 15px
}

.layui-text ul li {
    margin-top: 5px;
    list-style-type: disc
}

.layui-text em, .layui-word-aux {
    color: #999 !important;
    padding: 0 5px !important
}

.layui-btn {
    display: inline-block;
    height: 38px;
    line-height: 38px;
    padding: 0 18px;
    background-color: #009688;
    color: #fff;
    white-space: nowrap;
    text-align: center;
    font-size: 14px;
    border: none;
    border-radius: 2px;
    cursor: pointer
}

.layui-btn:hover {
    opacity: .8;
    filter: alpha(opacity=80);
    color: #fff
}

.layui-btn:active {
    opacity: 1;
    filter: alpha(opacity=100)
}

.layui-btn + .layui-btn {
    margin-left: 10px
}

.layui-btn-container {
    font-size: 0
}

.layui-btn-container .layui-btn {
    margin-right: 10px;
    margin-bottom: 10px
}

.layui-btn-container .layui-btn + .layui-btn {
    margin-left: 0
}

.layui-table .layui-btn-container .layui-btn {
    margin-bottom: 9px
}

.layui-btn-radius {
    border-radius: 100px
}

.layui-btn .layui-icon {
    margin-right: 3px;
    font-size: 18px;
    vertical-align: bottom;
    vertical-align: middle \\9
}

.layui-btn-primary {
    border: 1px solid #C9C9C9;
    background-color: #fff;
    color: #555
}

.layui-btn-primary:hover {
    border-color: #009688;
    color: #333
}

.layui-btn-normal {
    background-color: #1E9FFF
}

.layui-btn-warm {
    background-color: #FFB800
}

.layui-btn-danger {
    background-color: #FF5722
}

.layui-btn-disabled, .layui-btn-disabled:active, .layui-btn-disabled:hover {
    border: 1px solid #e6e6e6;
    background-color: #FBFBFB;
    color: #C9C9C9;
    cursor: not-allowed;
    opacity: 1
}

.layui-btn-lg {
    height: 44px;
    line-height: 44px;
    padding: 0 25px;
    font-size: 16px
}

.layui-btn-sm {
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    font-size: 12px
}

.layui-btn-sm i {
    font-size: 16px !important
}

.layui-btn-xs {
    height: 22px;
    line-height: 22px;
    padding: 0 5px;
    font-size: 12px
}

.layui-btn-xs i {
    font-size: 14px !important
}

.layui-btn-group {
    display: inline-block;
    vertical-align: middle;
    font-size: 0
}

.layui-btn-group .layui-btn {
    margin-left: 0 !important;
    margin-right: 0 !important;
    border-left: 1px solid rgba(255, 255, 255, .5);
    border-radius: 0
}

.layui-btn-group .layui-btn-primary {
    border-left: none
}

.layui-btn-group .layui-btn-primary:hover {
    border-color: #C9C9C9;
    color: #009688
}

.layui-btn-group .layui-btn:first-child {
    border-left: none;
    border-radius: 2px 0 0 2px
}

.layui-btn-group .layui-btn-primary:first-child {
    border-left: 1px solid #c9c9c9
}

.layui-btn-group .layui-btn:last-child {
    border-radius: 0 2px 2px 0
}

.layui-btn-group .layui-btn + .layui-btn {
    margin-left: 0
}

.layui-btn-group + .layui-btn-group {
    margin-left: 10px
}

.layui-btn-fluid {
    width: 100%
}

.layui-input, .layui-select, .layui-textarea {
    height: 38px;
    line-height: 1.3;
    line-height: 38px \\9;
    border-width: 1px;
    border-style: solid;
    background-color: #fff;
    border-radius: 2px
}

.layui-input::-webkit-input-placeholder, .layui-select::-webkit-input-placeholder, .layui-textarea::-webkit-input-placeholder {
    line-height: 1.3
}

.layui-input, .layui-textarea {
    display: block;
    width: 100%;
    padding-left: 10px
}

.layui-input:hover, .layui-textarea:hover {
    border-color: #D2D2D2 !important
}

.layui-input:focus, .layui-textarea:focus {
    border-color: #C9C9C9 !important
}

.layui-textarea {
    min-height: 100px;
    height: auto;
    line-height: 20px;
    padding: 6px 10px;
    resize: vertical
}

.layui-select {
    padding: 0 10px
}

.layui-form input[type=checkbox], .layui-form input[type=radio], .layui-form select {
    display: none
}

.layui-form [lay-ignore] {
    display: initial
}

.layui-form-item {
    margin-bottom: 15px;
    clear: both;
    *zoom: 1
}

.layui-form-item:after {
    content: '\\20';
    clear: both;
    *zoom: 1;
    display: block;
    height: 0
}

.layui-form-label {
    float: left;
    display: block;
    padding: 9px 15px;
    width: 80px;
    font-weight: 400;
    line-height: 20px;
    text-align: right
}

.layui-form-label-col {
    display: block;
    float: none;
    padding: 9px 0;
    line-height: 20px;
    text-align: left
}

.layui-form-item .layui-inline {
    margin-bottom: 5px;
    margin-right: 10px
}

.layui-input-block {
    margin-left: 110px;
    min-height: 36px
}

.layui-input-inline {
    display: inline-block;
    vertical-align: middle
}

.layui-form-item .layui-input-inline {
    float: left;
    width: 190px;
    margin-right: 10px
}

.layui-form-text .layui-input-inline {
    width: auto
}

.layui-form-mid {
    float: left;
    display: block;
    padding: 9px 0 !important;
    line-height: 20px;
    margin-right: 10px
}

.layui-form-danger + .layui-form-select .layui-input, .layui-form-danger:focus {
    border-color: #FF5722 !important
}

.layui-form-select .layui-input {
    padding-right: 30px;
    cursor: pointer
}

.layui-form-select .layui-edge {
    position: absolute;
    right: 10px;
    top: 50%;
    margin-top: -3px;
    cursor: pointer;
    border-width: 6px;
    border-top-color: #c2c2c2;
    border-top-style: solid;
    transition: all .3s;
    -webkit-transition: all .3s
}

.layui-form-select dl {
    display: none;
    position: absolute;
    left: 0;
    top: 42px;
    padding: 5px 0;
    z-index: 999;
    min-width: 100%;
    border: 1px solid #d2d2d2;
    max-height: 300px;
    overflow-y: auto;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12);
    box-sizing: border-box
}

.layui-form-select dl dd, .layui-form-select dl dt {
    padding: 0 10px;
    line-height: 36px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
}

.layui-form-select dl dt {
    font-size: 12px;
    color: #999
}

.layui-form-select dl dd {
    cursor: pointer
}

.layui-form-select dl dd:hover {
    background-color: #f2f2f2
}

.layui-form-select .layui-select-group dd {
    padding-left: 20px
}

.layui-form-select dl dd.layui-select-tips {
    padding-left: 10px !important;
    color: #999
}

.layui-form-select dl dd.layui-this {
    background-color: #5FB878;
    color: #fff
}

.layui-form-checkbox, .layui-form-select dl dd.layui-disabled {
    background-color: #fff
}

.layui-form-selected dl {
    display: block
}

.layui-form-checkbox, .layui-form-checkbox *, .layui-form-switch {
    display: inline-block;
    vertical-align: middle
}

.layui-form-selected .layui-edge {
    margin-top: -9px;
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
    margin-top: -3px \\9
}

:root .layui-form-selected .layui-edge {
    margin-top: -9px \\0/ IE9
}

.layui-form-selectup dl {
    top: auto;
    bottom: 42px
}

.layui-select-none {
    margin: 5px 0;
    text-align: center;
    color: #999
}

.layui-select-disabled .layui-disabled {
    border-color: #eee !important
}

.layui-select-disabled .layui-edge {
    border-top-color: #d2d2d2
}

.layui-form-checkbox {
    position: relative;
    height: 30px;
    line-height: 28px;
    margin-right: 10px;
    padding-right: 30px;
    border: 1px solid #d2d2d2;
    cursor: pointer;
    font-size: 0;
    border-radius: 2px;
    -webkit-transition: .1s linear;
    transition: .1s linear;
    box-sizing: border-box
}

.layui-form-checkbox:hover {
    border: 1px solid #c2c2c2
}

.layui-form-checkbox span {
    padding: 0 10px;
    height: 100%;
    font-size: 14px;
    background-color: #d2d2d2;
    color: #fff;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis
}

.layui-form-checkbox:hover span {
    background-color: #c2c2c2
}

.layui-form-checkbox i {
    position: absolute;
    right: 0;
    width: 30px;
    color: #fff;
    font-size: 20px;
    text-align: center
}

.layui-form-checkbox:hover i {
    color: #c2c2c2
}

.layui-form-checked, .layui-form-checked:hover {
    border-color: #5FB878
}

.layui-form-checked span, .layui-form-checked:hover span {
    background-color: #5FB878
}

.layui-form-checked i, .layui-form-checked:hover i {
    color: #5FB878
}

.layui-form-item .layui-form-checkbox {
    margin-top: 4px
}

.layui-form-checkbox[lay-skin=primary] {
    height: auto !important;
    line-height: normal !important;
    border: none !important;
    margin-right: 0;
    padding-right: 0;
    background: 0 0
}

.layui-form-checkbox[lay-skin=primary] span {
    float: right;
    padding-right: 15px;
    line-height: 18px;
    background: 0 0;
    color: #666
}

.layui-form-checkbox[lay-skin=primary] i {
    position: relative;
    top: 0;
    width: 16px;
    height: 16px;
    line-height: 16px;
    border: 1px solid #d2d2d2;
    font-size: 12px;
    border-radius: 2px;
    background-color: #fff;
    -webkit-transition: .1s linear;
    transition: .1s linear
}

.layui-form-checkbox[lay-skin=primary]:hover i {
    border-color: #5FB878;
    color: #fff
}

.layui-form-checked[lay-skin=primary] i {
    border-color: #5FB878;
    background-color: #5FB878;
    color: #fff
}

.layui-checkbox-disbaled[lay-skin=primary] span {
    background: 0 0 !important;
    color: #c2c2c2
}

.layui-checkbox-disbaled[lay-skin=primary]:hover i {
    border-color: #d2d2d2
}

.layui-form-item .layui-form-checkbox[lay-skin=primary] {
    margin-top: 10px
}

.layui-form-switch {
    position: relative;
    height: 22px;
    line-height: 22px;
    width: 42px;
    padding: 0 5px;
    margin-top: 8px;
    border: 1px solid #d2d2d2;
    border-radius: 20px;
    cursor: pointer;
    background-color: #fff;
    -webkit-transition: .1s linear;
    transition: .1s linear
}

.layui-form-switch i {
    position: absolute;
    left: 5px;
    top: 3px;
    width: 16px;
    height: 16px;
    border-radius: 20px;
    background-color: #d2d2d2;
    -webkit-transition: .1s linear;
    transition: .1s linear
}

.layui-form-switch em {
    position: absolute;
    right: 5px;
    top: 0;
    width: 25px;
    padding: 0 !important;
    text-align: center !important;
    color: #999 !important;
    font-style: normal !important;
    font-size: 12px
}

.layui-form-onswitch {
    border-color: #5FB878;
    background-color: #5FB878
}

.layui-form-onswitch i {
    left: 32px;
    background-color: #fff
}

.layui-form-onswitch em {
    left: 5px;
    right: auto;
    color: #fff !important
}

.layui-checkbox-disbaled {
    border-color: #e2e2e2 !important
}

.layui-checkbox-disbaled span {
    background-color: #e2e2e2 !important
}

.layui-checkbox-disbaled:hover i {
    color: #fff !important
}

[lay-radio] {
    display: none
}

.layui-form-radio, .layui-form-radio * {
    display: inline-block;
    vertical-align: middle
}

.layui-form-radio {
    line-height: 28px;
    margin: 6px 10px 0 0;
    padding-right: 10px;
    cursor: pointer;
    font-size: 0
}

.layui-form-radio * {
    font-size: 14px
}

.layui-form-radio > i {
    margin-right: 8px;
    font-size: 22px;
    color: #c2c2c2
}

.layui-form-radio > i:hover, .layui-form-radioed > i {
    color: #5FB878
}

.layui-radio-disbaled > i {
    color: #e2e2e2 !important
}

.layui-form-pane .layui-form-label {
    width: 110px;
    padding: 8px 15px;
    height: 38px;
    line-height: 20px;
    border-width: 1px;
    border-style: solid;
    border-radius: 2px 0 0 2px;
    text-align: center;
    background-color: #FBFBFB;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    box-sizing: border-box
}

.layui-form-pane .layui-input-inline {
    margin-left: -1px
}

.layui-form-pane .layui-input-block {
    margin-left: 110px;
    left: -1px
}

.layui-form-pane .layui-input {
    border-radius: 0 2px 2px 0
}

.layui-form-pane .layui-form-text .layui-form-label {
    float: none;
    width: 100%;
    border-radius: 2px;
    box-sizing: border-box;
    text-align: left
}

.layui-form-pane .layui-form-text .layui-input-inline {
    display: block;
    margin: 0;
    top: -1px;
    clear: both
}

.layui-form-pane .layui-form-text .layui-input-block {
    margin: 0;
    left: 0;
    top: -1px
}

.layui-form-pane .layui-form-text .layui-textarea {
    min-height: 100px;
    border-radius: 0 0 2px 2px
}

.layui-form-pane .layui-form-checkbox {
    margin: 4px 0 4px 10px
}

.layui-form-pane .layui-form-radio, .layui-form-pane .layui-form-switch {
    margin-top: 6px;
    margin-left: 10px
}

.layui-form-pane .layui-form-item[pane] {
    position: relative;
    border-width: 1px;
    border-style: solid
}

.layui-form-pane .layui-form-item[pane] .layui-form-label {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    border-width: 0 1px 0 0
}

.layui-form-pane .layui-form-item[pane] .layui-input-inline {
    margin-left: 110px
}

@media screen and (max-width: 450px) {
    .layui-form-item .layui-form-label {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap
    }

    .layui-form-item .layui-inline {
        display: block;
        margin-right: 0;
        margin-bottom: 20px;
        clear: both
    }

    .layui-form-item .layui-inline:after {
        content: '\\20';
        clear: both;
        display: block;
        height: 0
    }

    .layui-form-item .layui-input-inline {
        display: block;
        float: none;
        left: -3px;
        width: auto;
        margin: 0 0 10px 112px
    }

    .layui-form-item .layui-input-inline + .layui-form-mid {
        margin-left: 110px;
        top: -5px;
        padding: 0
    }

    .layui-form-item .layui-form-checkbox {
        margin-right: 5px;
        margin-bottom: 5px
    }
}

.layui-layedit {
    border-width: 1px;
    border-style: solid;
    border-radius: 2px
}

.layui-layedit-tool {
    padding: 3px 5px;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    font-size: 0
}

.layedit-tool-fixed {
    position: fixed;
    top: 0;
    border-top: 1px solid #e2e2e2
}

.layui-layedit-tool .layedit-tool-mid, .layui-layedit-tool .layui-icon {
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    font-size: 14px
}

.layui-layedit-tool .layui-icon {
    position: relative;
    width: 32px;
    height: 30px;
    line-height: 30px;
    margin: 3px 5px;
    color: #777;
    cursor: pointer;
    border-radius: 2px
}

.layui-layedit-tool .layui-icon:hover {
    color: #393D49
}

.layui-layedit-tool .layui-icon:active {
    color: #000
}

.layui-layedit-tool .layedit-tool-active {
    background-color: #e2e2e2;
    color: #000
}

.layui-layedit-tool .layui-disabled, .layui-layedit-tool .layui-disabled:hover {
    color: #d2d2d2;
    cursor: not-allowed
}

.layui-layedit-tool .layedit-tool-mid {
    width: 1px;
    height: 18px;
    margin: 0 10px;
    background-color: #d2d2d2
}

.layedit-tool-html {
    width: 50px !important;
    font-size: 30px !important
}

.layedit-tool-b, .layedit-tool-code, .layedit-tool-help {
    font-size: 16px !important
}

.layedit-tool-d, .layedit-tool-face, .layedit-tool-image, .layedit-tool-unlink {
    font-size: 18px !important
}

.layedit-tool-image input {
    position: absolute;
    font-size: 0;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .01;
    filter: Alpha(opacity=1);
    cursor: pointer
}

.layui-layedit-iframe iframe {
    display: block;
    width: 100%
}

#LAY_layedit_code {
    overflow: hidden
}

.layui-laypage {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    vertical-align: middle;
    margin: 10px 0;
    font-size: 0
}

.layui-laypage > a:first-child, .layui-laypage > a:first-child em {
    border-radius: 2px 0 0 2px
}

.layui-laypage > a:last-child, .layui-laypage > a:last-child em {
    border-radius: 0 2px 2px 0
}

.layui-laypage > :first-child {
    margin-left: 0 !important
}

.layui-laypage > :last-child {
    margin-right: 0 !important
}

.layui-laypage a, .layui-laypage button, .layui-laypage input, .layui-laypage select, .layui-laypage span {
    border: 1px solid #e2e2e2
}

.layui-laypage a, .layui-laypage span {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    vertical-align: middle;
    padding: 0 15px;
    height: 28px;
    line-height: 28px;
    margin: 0 -1px 5px 0;
    background-color: #fff;
    color: #333;
    font-size: 12px
}

.layui-laypage a:hover {
    color: #009688
}

.layui-laypage em {
    font-style: normal
}

.layui-laypage .layui-laypage-spr {
    color: #999;
    font-weight: 700
}

.layui-laypage a {
    text-decoration: none
}

.layui-laypage .layui-laypage-curr {
    position: relative
}

.layui-laypage .layui-laypage-curr em {
    position: relative;
    color: #fff
}

.layui-laypage .layui-laypage-curr .layui-laypage-em {
    position: absolute;
    left: -1px;
    top: -1px;
    padding: 1px;
    width: 100%;
    height: 100%;
    background-color: #009688
}

.layui-laypage-em {
    border-radius: 2px
}

.layui-laypage-next em, .layui-laypage-prev em {
    font-family: Sim sun;
    font-size: 16px
}

.layui-laypage .layui-laypage-count, .layui-laypage .layui-laypage-limits, .layui-laypage .layui-laypage-skip {
    margin-left: 10px;
    margin-right: 10px;
    padding: 0;
    border: none
}

.layui-laypage .layui-laypage-limits {
    vertical-align: top
}

.layui-laypage select {
    height: 22px;
    padding: 3px;
    border-radius: 2px;
    cursor: pointer
}

.layui-laypage .layui-laypage-skip {
    height: 30px;
    line-height: 30px;
    color: #999
}

.layui-laypage button, .layui-laypage input {
    height: 30px;
    line-height: 30px;
    border-radius: 2px;
    vertical-align: top;
    background-color: #fff;
    box-sizing: border-box
}

.layui-laypage input {
    display: inline-block;
    width: 40px;
    margin: 0 10px;
    padding: 0 3px;
    text-align: center
}

.layui-laypage input:focus, .layui-laypage select:focus {
    border-color: #009688 !important
}

.layui-laypage button {
    margin-left: 10px;
    padding: 0 10px;
    cursor: pointer
}

.layui-table, .layui-table-view {
    margin: 10px 0
}

.layui-flow-more {
    margin: 10px 0;
    text-align: center;
    color: #999;
    font-size: 14px
}

.layui-flow-more a {
    height: 32px;
    line-height: 32px
}

.layui-flow-more a * {
    display: inline-block;
    vertical-align: top
}

.layui-flow-more a cite {
    padding: 0 20px;
    border-radius: 3px;
    background-color: #eee;
    color: #333;
    font-style: normal
}

.layui-flow-more a cite:hover {
    opacity: .8
}

.layui-flow-more a i {
    font-size: 30px;
    color: #737383
}

.layui-table {
    width: 100%;
    background-color: #fff;
    color: #666
}

.layui-table tr {
    transition: all .3s;
    -webkit-transition: all .3s
}

.layui-table th {
    text-align: left;
    font-weight: 400
}

.layui-table tbody tr:hover, .layui-table thead tr, .layui-table-click, .layui-table-header, .layui-table-hover, .layui-table-mend, .layui-table-patch, .layui-table-tool, .layui-table[lay-even] tr:nth-child(even) {
    background-color: #f2f2f2
}

.layui-table td, .layui-table th, .layui-table-fixed-r, .layui-table-header, .layui-table-page, .layui-table-tips-main, .layui-table-tool, .layui-table-view, .layui-table[lay-skin=line], .layui-table[lay-skin=row] {
    border-width: 1px;
    border-style: solid;
    border-color: #e6e6e6
}

.layui-table td, .layui-table th {
    position: relative;
    padding: 9px 15px;
    min-height: 20px;
    line-height: 20px;
    font-size: 14px
}

.layui-table[lay-skin=line] td, .layui-table[lay-skin=line] th {
    border-width: 0 0 1px
}

.layui-table[lay-skin=row] td, .layui-table[lay-skin=row] th {
    border-width: 0 1px 0 0
}

.layui-table[lay-skin=nob] td, .layui-table[lay-skin=nob] th {
    border: none
}

.layui-table img {
    max-width: 100px
}

.layui-table[lay-size=lg] td, .layui-table[lay-size=lg] th {
    padding: 15px 30px
}

.layui-table-view .layui-table[lay-size=lg] .layui-table-cell {
    height: 40px;
    line-height: 40px
}

.layui-table[lay-size=sm] td, .layui-table[lay-size=sm] th {
    font-size: 12px;
    padding: 5px 10px
}

.layui-table-view .layui-table[lay-size=sm] .layui-table-cell {
    height: 20px;
    line-height: 20px
}

.layui-table[lay-data] {
    display: none
}

.layui-table-box, .layui-table-view {
    position: relative;
    overflow: hidden
}

.layui-table-view .layui-table {
    position: relative;
    width: auto;
    margin: 0
}

.layui-table-body, .layui-table-header .layui-table, .layui-table-page {
    margin-bottom: -1px
}

.layui-table-view .layui-table[lay-skin=line] {
    border-width: 0 1px 0 0
}

.layui-table-view .layui-table[lay-skin=row] {
    border-width: 0 0 1px
}

.layui-table-view .layui-table td, .layui-table-view .layui-table th {
    padding: 5px 0;
    border-top: none;
    border-left: none
}

.layui-table-view .layui-table td {
    cursor: default
}

.layui-table-view .layui-form-checkbox[lay-skin=primary] i {
    width: 18px;
    height: 18px
}

.layui-table-header {
    border-width: 0 0 1px;
    overflow: hidden
}

.layui-table-sort {
    width: 10px;
    height: 20px;
    margin-left: 5px;
    cursor: pointer !important
}

.layui-table-sort .layui-edge {
    position: absolute;
    left: 5px;
    border-width: 5px
}

.layui-table-sort .layui-table-sort-asc {
    top: 4px;
    border-top: none;
    border-bottom-style: solid;
    border-bottom-color: #b2b2b2
}

.layui-table-sort .layui-table-sort-asc:hover {
    border-bottom-color: #666
}

.layui-table-sort .layui-table-sort-desc {
    bottom: 4px;
    border-bottom: none;
    border-top-style: solid;
    border-top-color: #b2b2b2
}

.layui-table-sort .layui-table-sort-desc:hover {
    border-top-color: #666
}

.layui-table-sort[lay-sort=asc] .layui-table-sort-asc {
    border-bottom-color: #000
}

.layui-table-sort[lay-sort=desc] .layui-table-sort-desc {
    border-top-color: #000
}

.layui-table-cell {
    height: 28px;
    line-height: 28px;
    padding: 0 15px;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-sizing: border-box
}

.layui-table-cell .layui-form-checkbox[lay-skin=primary] {
    top: -1px;
    vertical-align: middle
}

.layui-table-cell .layui-table-link {
    color: #01AAED
}

.laytable-cell-checkbox, .laytable-cell-numbers, .laytable-cell-space {
    padding: 0;
    text-align: center
}

.layui-table-body {
    position: relative;
    overflow: auto;
    margin-right: -1px
}

.layui-table-body .layui-none {
    line-height: 40px;
    text-align: center;
    color: #999
}

.layui-table-fixed {
    position: absolute;
    left: 0;
    top: 0
}

.layui-table-fixed .layui-table-body {
    overflow: hidden
}

.layui-table-fixed-l {
    box-shadow: 0 -1px 8px rgba(0, 0, 0, .08)
}

.layui-table-fixed-r {
    left: auto;
    right: -1px;
    border-width: 0 0 0 1px;
    box-shadow: -1px 0 8px rgba(0, 0, 0, .08)
}

.layui-table-fixed-r .layui-table-header {
    position: relative;
    overflow: visible
}

.layui-table-mend {
    position: absolute;
    right: -49px;
    top: 0;
    height: 100%;
    width: 50px
}

.layui-table-tool {
    position: relative;
    width: 100%;
    height: 50px;
    line-height: 30px;
    padding: 10px 15px;
    border-width: 0 0 1px
}

.layui-table-page {
    position: relative;
    width: 100%;
    padding: 7px 7px 0;
    border-width: 1px 0 0;
    height: 41px;
    font-size: 12px
}

.layui-table-page > div {
    height: 26px
}

.layui-table-page .layui-laypage {
    margin: 0
}

.layui-table-page .layui-laypage a, .layui-table-page .layui-laypage span {
    height: 26px;
    line-height: 26px;
    margin-bottom: 10px;
    border: none;
    background: 0 0
}

.layui-table-page .layui-laypage a, .layui-table-page .layui-laypage span.layui-laypage-curr {
    padding: 0 12px
}

.layui-table-page .layui-laypage span {
    margin-left: 0;
    padding: 0
}

.layui-table-page .layui-laypage .layui-laypage-prev {
    margin-left: -7px !important
}

.layui-table-page .layui-laypage .layui-laypage-curr .layui-laypage-em {
    left: 0;
    top: 0;
    padding: 0
}

.layui-table-page .layui-laypage button, .layui-table-page .layui-laypage input {
    height: 26px;
    line-height: 26px
}

.layui-table-page .layui-laypage input {
    width: 40px
}

.layui-table-page .layui-laypage button {
    padding: 0 10px
}

.layui-table-page select {
    height: 18px
}

.layui-table-view select[lay-ignore] {
    display: inline-block
}

.layui-table-patch .layui-table-cell {
    padding: 0;
    width: 30px
}

.layui-table-edit {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 0 14px 1px;
    border-radius: 0;
    box-shadow: 1px 1px 20px rgba(0, 0, 0, .15)
}

.layui-table-edit:focus {
    border-color: #5FB878 !important
}

select.layui-table-edit {
    padding: 0 0 0 10px;
    border-color: #C9C9C9
}

.layui-table-view .layui-form-checkbox, .layui-table-view .layui-form-radio, .layui-table-view .layui-form-switch {
    top: 0;
    margin: 0;
    box-sizing: content-box
}

.layui-table-view .layui-form-checkbox {
    top: -1px;
    height: 26px;
    line-height: 26px
}

body .layui-table-tips .layui-layer-content {
    background: 0 0;
    padding: 0;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .1)
}

.layui-table-tips-main {
    margin: -44px 0 0 -1px;
    max-height: 150px;
    padding: 8px 15px;
    font-size: 14px;
    overflow-y: scroll;
    background-color: #fff;
    color: #333
}

.layui-code, .layui-upload-list {
    margin: 10px 0
}

.layui-table-tips-c {
    position: absolute;
    right: -3px;
    top: -12px;
    width: 18px;
    height: 18px;
    padding: 3px;
    text-align: center;
    font-weight: 700;
    border-radius: 100%;
    font-size: 14px;
    cursor: pointer;
    background-color: #666
}

.layui-table-tips-c:hover {
    background-color: #999
}

.layui-upload-file {
    display: none !important;
    opacity: .01;
    filter: Alpha(opacity=1)
}

.layui-upload-drag, .layui-upload-form, .layui-upload-wrap {
    display: inline-block
}

.layui-upload-choose {
    padding: 0 10px;
    color: #999
}

.layui-upload-drag {
    position: relative;
    padding: 30px;
    border: 1px dashed #e2e2e2;
    background-color: #fff;
    text-align: center;
    cursor: pointer;
    color: #999
}

.layui-upload-drag .layui-icon {
    font-size: 50px;
    color: #009688
}

.layui-upload-drag[lay-over] {
    border-color: #009688
}

.layui-upload-iframe {
    position: absolute;
    width: 0;
    height: 0;
    border: 0;
    visibility: hidden
}

.layui-upload-wrap {
    position: relative;
    vertical-align: middle
}

.layui-upload-wrap .layui-upload-file {
    display: block !important;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    font-size: 100px;
    width: 100%;
    height: 100%;
    opacity: .01;
    filter: Alpha(opacity=1);
    cursor: pointer
}

.layui-code {
    position: relative;
    padding: 15px;
    line-height: 20px;
    border: 1px solid #ddd;
    border-left-width: 6px;
    background-color: #F2F2F2;
    color: #333;
    font-family: Courier New;
    font-size: 12px
}

.layui-tree {
    line-height: 26px
}

.layui-tree li {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap
}

.layui-tree li .layui-tree-spread, .layui-tree li a {
    display: inline-block;
    vertical-align: top;
    height: 26px;
    *display: inline;
    *zoom: 1;
    cursor: pointer
}

.layui-tree li a {
    font-size: 0
}

.layui-tree li a i {
    font-size: 16px
}

.layui-tree li a cite {
    padding: 0 6px;
    font-size: 14px;
    font-style: normal
}

.layui-tree li i {
    padding-left: 6px;
    color: #333;
    -moz-user-select: none
}

.layui-tree li .layui-tree-check {
    font-size: 13px
}

.layui-tree li .layui-tree-check:hover {
    color: #009E94
}

.layui-tree li ul {
    display: none;
    margin-left: 20px
}

.layui-tree li .layui-tree-enter {
    line-height: 24px;
    border: 1px dotted #000
}

.layui-tree-drag {
    display: none;
    position: absolute;
    left: -666px;
    top: -666px;
    background-color: #f2f2f2;
    padding: 5px 10px;
    border: 1px dotted #000;
    white-space: nowrap
}

.layui-tree-drag i {
    padding-right: 5px
}

.layui-nav {
    position: relative;
    padding: 0 20px;
    background-color: #393D49;
    color: #fff;
    border-radius: 2px;
    font-size: 0;
    box-sizing: border-box
}

.layui-nav * {
    font-size: 14px
}

.layui-nav .layui-nav-item {
    position: relative;
    display: inline-block;
    *display: inline;
    *zoom: 1;
    vertical-align: middle;
    line-height: 60px
}

.layui-nav .layui-nav-item a {
    display: block;
    padding: 0 20px;
    color: #fff;
    color: rgba(255, 255, 255, .7);
    transition: all .3s;
    -webkit-transition: all .3s
}

.layui-nav .layui-this:after, .layui-nav-bar, .layui-nav-tree .layui-nav-itemed:after {
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 5px;
    background-color: #5FB878;
    transition: all .2s;
    -webkit-transition: all .2s
}

.layui-nav-bar {
    z-index: 1000
}

.layui-nav .layui-nav-item a:hover, .layui-nav .layui-this a {
    color: #fff
}

.layui-nav .layui-this:after {
    content: '';
    top: auto;
    bottom: 0;
    width: 100%
}

.layui-nav-img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    border-radius: 50%
}

.layui-nav .layui-nav-more {
    content: '';
    width: 0;
    height: 0;
    border-style: solid dashed dashed;
    border-color: #fff transparent transparent;
    overflow: hidden;
    cursor: pointer;
    transition: all .2s;
    -webkit-transition: all .2s;
    position: absolute;
    top: 50%;
    right: 3px;
    margin-top: -3px;
    border-width: 6px;
    border-top-color: rgba(255, 255, 255, .7)
}

.layui-nav .layui-nav-mored, .layui-nav-itemed > a .layui-nav-more {
    margin-top: -9px;
    border-style: dashed dashed solid;
    border-color: transparent transparent #fff
}

.layui-nav-child {
    display: none;
    position: absolute;
    left: 0;
    top: 65px;
    min-width: 100%;
    line-height: 36px;
    padding: 5px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12);
    border: 1px solid #d2d2d2;
    background-color: #fff;
    z-index: 100;
    border-radius: 2px;
    white-space: nowrap
}

.layui-nav .layui-nav-child a {
    color: #333
}

.layui-nav .layui-nav-child a:hover {
    background-color: #f2f2f2;
    color: #000
}

.layui-nav-child dd {
    position: relative
}

.layui-nav .layui-nav-child dd.layui-this a, .layui-nav-child dd.layui-this {
    background-color: #5FB878;
    color: #fff
}

.layui-nav-child dd.layui-this:after {
    display: none
}

.layui-nav-tree {
    width: 200px;
    padding: 0
}

.layui-nav-tree .layui-nav-item {
    display: block;
    width: 100%;
    line-height: 45px
}

.layui-nav-tree .layui-nav-item a {
    position: relative;
    height: 45px;
    line-height: 45px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap
}

.layui-nav-tree .layui-nav-item a:hover {
    background-color: #4E5465
}

.layui-nav-tree .layui-nav-bar {
    width: 5px;
    height: 0;
    background-color: #009688
}

.layui-nav-tree .layui-nav-child dd.layui-this, .layui-nav-tree .layui-nav-child dd.layui-this a, .layui-nav-tree .layui-this, .layui-nav-tree .layui-this > a, .layui-nav-tree .layui-this > a:hover {
    background-color: #009688;
    color: #fff
}

.layui-nav-tree .layui-this:after {
    display: none
}

.layui-nav-itemed > a, .layui-nav-tree .layui-nav-title a, .layui-nav-tree .layui-nav-title a:hover {
    color: #fff !important
}

.layui-nav-tree .layui-nav-child {
    position: relative;
    z-index: 0;
    top: 0;
    border: none;
    box-shadow: none
}

.layui-nav-tree .layui-nav-child a {
    height: 40px;
    line-height: 40px;
    color: #fff;
    color: rgba(255, 255, 255, .7)
}

.layui-nav-tree .layui-nav-child, .layui-nav-tree .layui-nav-child a:hover {
    background: 0 0;
    color: #fff
}

.layui-nav-tree .layui-nav-more {
    right: 10px
}

.layui-nav-itemed > .layui-nav-child {
    display: block;
    padding: 0;
    background-color: rgba(0, 0, 0, .3) !important
}

.layui-nav-itemed > .layui-nav-child > .layui-this > .layui-nav-child {
    display: block
}

.layui-nav-side {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    overflow-x: hidden;
    z-index: 999
}

.layui-bg-blue .layui-nav-bar, .layui-bg-blue .layui-nav-itemed:after, .layui-bg-blue .layui-this:after {
    background-color: #93D1FF
}

.layui-bg-blue .layui-nav-child dd.layui-this {
    background-color: #1E9FFF
}

.layui-bg-blue .layui-nav-itemed > a, .layui-nav-tree.layui-bg-blue .layui-nav-title a, .layui-nav-tree.layui-bg-blue .layui-nav-title a:hover {
    background-color: #007DDB !important
}

.layui-breadcrumb {
    visibility: hidden;
    font-size: 0
}

.layui-breadcrumb > * {
    font-size: 14px
}

.layui-breadcrumb a {
    color: #999 !important
}

.layui-breadcrumb a:hover {
    color: #5FB878 !important
}

.layui-breadcrumb a cite {
    color: #666;
    font-style: normal
}

.layui-breadcrumb span[lay-separator] {
    margin: 0 10px;
    color: #999
}

.layui-tab {
    margin: 10px 0;
    text-align: left !important
}

.layui-tab[overflow] > .layui-tab-title {
    overflow: hidden
}

.layui-tab-title {
    position: relative;
    left: 0;
    height: 40px;
    white-space: nowrap;
    font-size: 0;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    transition: all .2s;
    -webkit-transition: all .2s
}

.layui-tab-title li {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    vertical-align: middle;
    font-size: 14px;
    transition: all .2s;
    -webkit-transition: all .2s;
    position: relative;
    line-height: 40px;
    min-width: 65px;
    padding: 0 15px;
    text-align: center;
    cursor: pointer
}

.layui-tab-title li a {
    display: block
}

.layui-tab-title .layui-this {
    color: #000
}

.layui-tab-title .layui-this:after {
    position: absolute;
    left: 0;
    top: 0;
    content: '';
    width: 100%;
    height: 41px;
    border-width: 1px;
    border-style: solid;
    border-bottom-color: #fff;
    border-radius: 2px 2px 0 0;
    box-sizing: border-box;
    pointer-events: none
}

.layui-tab-bar {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 10;
    width: 30px;
    height: 39px;
    line-height: 39px;
    border-width: 1px;
    border-style: solid;
    border-radius: 2px;
    text-align: center;
    background-color: #fff;
    cursor: pointer
}

.layui-tab-bar .layui-icon {
    position: relative;
    display: inline-block;
    top: 3px;
    transition: all .3s;
    -webkit-transition: all .3s
}

.layui-tab-item {
    display: none
}

.layui-tab-more {
    padding-right: 30px;
    height: auto !important;
    white-space: normal !important
}

.layui-tab-more li.layui-this:after {
    border-bottom-color: #e2e2e2;
    border-radius: 2px
}

.layui-tab-more .layui-tab-bar .layui-icon {
    top: -2px;
    top: 3px \\9;
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg)
}

:root .layui-tab-more .layui-tab-bar .layui-icon {
    top: -2px \\0/ IE9
}

.layui-tab-content {
    padding: 10px
}

.layui-tab-title li .layui-tab-close {
    position: relative;
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 20px;
    margin-left: 8px;
    top: 1px;
    text-align: center;
    font-size: 14px;
    color: #c2c2c2;
    transition: all .2s;
    -webkit-transition: all .2s
}

.layui-tab-title li .layui-tab-close:hover {
    border-radius: 2px;
    background-color: #FF5722;
    color: #fff
}

.layui-tab-brief > .layui-tab-title .layui-this {
    color: #009688
}

.layui-tab-brief > .layui-tab-more li.layui-this:after, .layui-tab-brief > .layui-tab-title .layui-this:after {
    border: none;
    border-radius: 0;
    border-bottom: 2px solid #5FB878
}

.layui-tab-brief[overflow] > .layui-tab-title .layui-this:after {
    top: -1px
}

.layui-tab-card {
    border-width: 1px;
    border-style: solid;
    border-radius: 2px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .1)
}

.layui-tab-card > .layui-tab-title {
    background-color: #f2f2f2
}

.layui-tab-card > .layui-tab-title li {
    margin-right: -1px;
    margin-left: -1px
}

.layui-tab-card > .layui-tab-title .layui-this {
    background-color: #fff
}

.layui-tab-card > .layui-tab-title .layui-this:after {
    border-top: none;
    border-width: 1px;
    border-bottom-color: #fff
}

.layui-tab-card > .layui-tab-title .layui-tab-bar {
    height: 40px;
    line-height: 40px;
    border-radius: 0;
    border-top: none;
    border-right: none
}

.layui-tab-card > .layui-tab-more .layui-this {
    background: 0 0;
    color: #5FB878
}

.layui-tab-card > .layui-tab-more .layui-this:after {
    border: none
}

.layui-timeline {
    padding-left: 5px
}

.layui-timeline-item {
    position: relative;
    padding-bottom: 20px
}

.layui-timeline-axis {
    position: absolute;
    left: -5px;
    top: 0;
    z-index: 10;
    width: 20px;
    height: 20px;
    line-height: 20px;
    background-color: #fff;
    color: #5FB878;
    border-radius: 50%;
    text-align: center;
    cursor: pointer
}

.layui-timeline-axis:hover {
    color: #FF5722
}

.layui-timeline-item:before {
    content: '';
    position: absolute;
    left: 5px;
    top: 0;
    z-index: 0;
    width: 1px;
    height: 100%
}

.layui-timeline-item:last-child:before {
    display: none
}

.layui-timeline-item:first-child:before {
    display: block
}

.layui-timeline-content {
    padding-left: 25px
}

.layui-timeline-title {
    position: relative;
    margin-bottom: 10px
}

.layui-badge, .layui-badge-dot, .layui-badge-rim {
    position: relative;
    display: inline-block;
    padding: 0 6px;
    font-size: 12px;
    text-align: center;
    background-color: #FF5722;
    color: #fff;
    border-radius: 2px
}

.layui-badge {
    height: 18px;
    line-height: 18px
}

.layui-badge-dot {
    width: 8px;
    height: 8px;
    padding: 0;
    border-radius: 50%
}

.layui-badge-rim {
    height: 18px;
    line-height: 18px;
    border-width: 1px;
    border-style: solid;
    background-color: #fff;
    color: #666
}

.layui-btn .layui-badge, .layui-btn .layui-badge-dot {
    margin-left: 5px
}

.layui-nav .layui-badge, .layui-nav .layui-badge-dot {
    position: absolute;
    top: 50%;
    margin: -8px 6px 0
}

.layui-tab-title .layui-badge, .layui-tab-title .layui-badge-dot {
    left: 5px;
    top: -2px
}

.layui-carousel {
    position: relative;
    left: 0;
    top: 0;
    background-color: #f8f8f8
}

.layui-carousel > [carousel-item] {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden
}

.layui-carousel > [carousel-item]:before {
    position: absolute;
    content: '\\e63d';
    left: 50%;
    top: 50%;
    width: 100px;
    line-height: 20px;
    margin: -10px 0 0 -50px;
    text-align: center;
    color: #c2c2c2;
    font-family: layui-icon !important;
    font-size: 30px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale
}

.layui-carousel > [carousel-item] > * {
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #f8f8f8;
    transition-duration: .3s;
    -webkit-transition-duration: .3s
}

.layui-carousel-updown > * {
    -webkit-transition: .3s ease-in-out up;
    transition: .3s ease-in-out up
}

.layui-carousel-arrow {
    display: none \\9;
    opacity: 0;
    position: absolute;
    left: 10px;
    top: 50%;
    margin-top: -18px;
    width: 36px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    font-size: 20px;
    border: 0;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, .2);
    color: #fff;
    -webkit-transition-duration: .3s;
    transition-duration: .3s;
    cursor: pointer
}

.layui-carousel-arrow[lay-type=add] {
    left: auto !important;
    right: 10px
}

.layui-carousel:hover .layui-carousel-arrow[lay-type=add], .layui-carousel[lay-arrow=always] .layui-carousel-arrow[lay-type=add] {
    right: 20px
}

.layui-carousel[lay-arrow=always] .layui-carousel-arrow {
    opacity: 1;
    left: 20px
}

.layui-carousel[lay-arrow=none] .layui-carousel-arrow {
    display: none
}

.layui-carousel-arrow:hover, .layui-carousel-ind ul:hover {
    background-color: rgba(0, 0, 0, .35)
}

.layui-carousel:hover .layui-carousel-arrow {
    display: block \\9;
    opacity: 1;
    left: 20px
}

.layui-carousel-ind {
    position: relative;
    top: -35px;
    width: 100%;
    line-height: 0 !important;
    text-align: center;
    font-size: 0
}

.layui-carousel[lay-indicator=outside] {
    margin-bottom: 30px
}

.layui-carousel[lay-indicator=outside] .layui-carousel-ind {
    top: 10px
}

.layui-carousel[lay-indicator=outside] .layui-carousel-ind ul {
    background-color: rgba(0, 0, 0, .5)
}

.layui-carousel[lay-indicator=none] .layui-carousel-ind {
    display: none
}

.layui-carousel-ind ul {
    display: inline-block;
    padding: 5px;
    background-color: rgba(0, 0, 0, .2);
    border-radius: 10px;
    -webkit-transition-duration: .3s;
    transition-duration: .3s
}

.layui-carousel-ind li {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin: 0 3px;
    font-size: 14px;
    background-color: #e2e2e2;
    background-color: rgba(255, 255, 255, .5);
    border-radius: 50%;
    cursor: pointer;
    -webkit-transition-duration: .3s;
    transition-duration: .3s
}

.layui-carousel-ind li:hover {
    background-color: rgba(255, 255, 255, .7)
}

.layui-carousel-ind li.layui-this {
    background-color: #fff
}

.layui-carousel > [carousel-item] > .layui-carousel-next, .layui-carousel > [carousel-item] > .layui-carousel-prev, .layui-carousel > [carousel-item] > .layui-this {
    display: block
}

.layui-carousel > [carousel-item] > .layui-this {
    left: 0
}

.layui-carousel > [carousel-item] > .layui-carousel-prev {
    left: -100%
}

.layui-carousel > [carousel-item] > .layui-carousel-next {
    left: 100%
}

.layui-carousel > [carousel-item] > .layui-carousel-next.layui-carousel-left, .layui-carousel > [carousel-item] > .layui-carousel-prev.layui-carousel-right {
    left: 0
}

.layui-carousel > [carousel-item] > .layui-this.layui-carousel-left {
    left: -100%
}

.layui-carousel > [carousel-item] > .layui-this.layui-carousel-right {
    left: 100%
}

.layui-carousel[lay-anim=updown] .layui-carousel-arrow {
    left: 50% !important;
    top: 20px;
    margin: 0 0 0 -18px
}

.layui-carousel[lay-anim=updown] > [carousel-item] > *, .layui-carousel[lay-anim=fade] > [carousel-item] > * {
    left: 0 !important
}

.layui-carousel[lay-anim=updown] .layui-carousel-arrow[lay-type=add] {
    top: auto !important;
    bottom: 20px
}

.layui-carousel[lay-anim=updown] .layui-carousel-ind {
    position: absolute;
    top: 50%;
    right: 20px;
    width: auto;
    height: auto
}

.layui-carousel[lay-anim=updown] .layui-carousel-ind ul {
    padding: 3px 5px
}

.layui-carousel[lay-anim=updown] .layui-carousel-ind li {
    display: block;
    margin: 6px 0
}

.layui-carousel[lay-anim=updown] > [carousel-item] > .layui-this {
    top: 0
}

.layui-carousel[lay-anim=updown] > [carousel-item] > .layui-carousel-prev {
    top: -100%
}

.layui-carousel[lay-anim=updown] > [carousel-item] > .layui-carousel-next {
    top: 100%
}

.layui-carousel[lay-anim=updown] > [carousel-item] > .layui-carousel-next.layui-carousel-left, .layui-carousel[lay-anim=updown] > [carousel-item] > .layui-carousel-prev.layui-carousel-right {
    top: 0
}

.layui-carousel[lay-anim=updown] > [carousel-item] > .layui-this.layui-carousel-left {
    top: -100%
}

.layui-carousel[lay-anim=updown] > [carousel-item] > .layui-this.layui-carousel-right {
    top: 100%
}

.layui-carousel[lay-anim=fade] > [carousel-item] > .layui-carousel-next, .layui-carousel[lay-anim=fade] > [carousel-item] > .layui-carousel-prev {
    opacity: 0
}

.layui-carousel[lay-anim=fade] > [carousel-item] > .layui-carousel-next.layui-carousel-left, .layui-carousel[lay-anim=fade] > [carousel-item] > .layui-carousel-prev.layui-carousel-right {
    opacity: 1
}

.layui-carousel[lay-anim=fade] > [carousel-item] > .layui-this.layui-carousel-left, .layui-carousel[lay-anim=fade] > [carousel-item] > .layui-this.layui-carousel-right {
    opacity: 0
}

.layui-fixbar {
    position: fixed;
    right: 15px;
    bottom: 15px;
    z-index: 9999
}

.layui-fixbar li {
    width: 50px;
    height: 50px;
    line-height: 50px;
    margin-bottom: 1px;
    text-align: center;
    cursor: pointer;
    font-size: 30px;
    background-color: #9F9F9F;
    color: #fff;
    border-radius: 2px;
    opacity: .95
}

.layui-fixbar li:hover {
    opacity: .85
}

.layui-fixbar li:active {
    opacity: 1
}

.layui-fixbar .layui-fixbar-top {
    display: none;
    font-size: 40px
}

body .layui-util-face {
    border: none;
    background: 0 0
}

body .layui-util-face .layui-layer-content {
    padding: 0;
    background-color: #fff;
    color: #666;
    box-shadow: none
}

.layui-util-face .layui-layer-TipsG {
    display: none
}

.layui-util-face ul {
    position: relative;
    width: 372px;
    padding: 10px;
    border: 1px solid #D9D9D9;
    background-color: #fff;
    box-shadow: 0 0 20px rgba(0, 0, 0, .2)
}

.layui-util-face ul li {
    cursor: pointer;
    float: left;
    border: 1px solid #e8e8e8;
    height: 22px;
    width: 26px;
    overflow: hidden;
    margin: -1px 0 0 -1px;
    padding: 4px 2px;
    text-align: center
}

.layui-util-face ul li:hover {
    position: relative;
    z-index: 2;
    border: 1px solid #eb7350;
    background: #fff9ec
}

.layui-anim {
    -webkit-animation-duration: .3s;
    animation-duration: .3s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both
}

.layui-anim.layui-icon {
    display: inline-block
}

.layui-anim-loop {
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite
}

.layui-trans, .layui-trans a {
    transition: all .3s;
    -webkit-transition: all .3s
}

@-webkit-keyframes layui-rotate {
    from {
        -webkit-transform: rotate(0)
    }
    to {
        -webkit-transform: rotate(360deg)
    }
}

@keyframes layui-rotate {
    from {
        transform: rotate(0)
    }
    to {
        transform: rotate(360deg)
    }
}

.layui-anim-rotate {
    -webkit-animation-name: layui-rotate;
    animation-name: layui-rotate;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-timing-function: linear;
    animation-timing-function: linear
}

@-webkit-keyframes layui-up {
    from {
        -webkit-transform: translate3d(0, 100%, 0);
        opacity: .3
    }
    to {
        -webkit-transform: translate3d(0, 0, 0);
        opacity: 1
    }
}

@keyframes layui-up {
    from {
        transform: translate3d(0, 100%, 0);
        opacity: .3
    }
    to {
        transform: translate3d(0, 0, 0);
        opacity: 1
    }
}

.layui-anim-up {
    -webkit-animation-name: layui-up;
    animation-name: layui-up
}

@-webkit-keyframes layui-upbit {
    from {
        -webkit-transform: translate3d(0, 30px, 0);
        opacity: .3
    }
    to {
        -webkit-transform: translate3d(0, 0, 0);
        opacity: 1
    }
}

@keyframes layui-upbit {
    from {
        transform: translate3d(0, 30px, 0);
        opacity: .3
    }
    to {
        transform: translate3d(0, 0, 0);
        opacity: 1
    }
}

.layui-anim-upbit {
    -webkit-animation-name: layui-upbit;
    animation-name: layui-upbit
}

@-webkit-keyframes layui-scale {
    0% {
        opacity: .3;
        -webkit-transform: scale(.5)
    }
    100% {
        opacity: 1;
        -webkit-transform: scale(1)
    }
}

@keyframes layui-scale {
    0% {
        opacity: .3;
        -ms-transform: scale(.5);
        transform: scale(.5)
    }
    100% {
        opacity: 1;
        -ms-transform: scale(1);
        transform: scale(1)
    }
}

.layui-anim-scale {
    -webkit-animation-name: layui-scale;
    animation-name: layui-scale
}

@-webkit-keyframes layui-scale-spring {
    0% {
        opacity: .5;
        -webkit-transform: scale(.5)
    }
    80% {
        opacity: .8;
        -webkit-transform: scale(1.1)
    }
    100% {
        opacity: 1;
        -webkit-transform: scale(1)
    }
}

@keyframes layui-scale-spring {
    0% {
        opacity: .5;
        transform: scale(.5)
    }
    80% {
        opacity: .8;
        transform: scale(1.1)
    }
    100% {
        opacity: 1;
        transform: scale(1)
    }
}

.layui-anim-scaleSpring {
    -webkit-animation-name: layui-scale-spring;
    animation-name: layui-scale-spring
}

@-webkit-keyframes layui-fadein {
    0% {
        opacity: 0
    }
    100% {
        opacity: 1
    }
}

@keyframes layui-fadein {
    0% {
        opacity: 0
    }
    100% {
        opacity: 1
    }
}

.layui-anim-fadein {
    -webkit-animation-name: layui-fadein;
    animation-name: layui-fadein
}

@-webkit-keyframes layui-fadeout {
    0% {
        opacity: 1
    }
    100% {
        opacity: 0
    }
}

@keyframes layui-fadeout {
    0% {
        opacity: 1
    }
    100% {
        opacity: 0
    }
}

.layui-anim-fadeout {
    -webkit-animation-name: layui-fadeout;
    animation-name: layui-fadeout
}
            
            
            
            
                    *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
    list-style: none;
}
html,body{
    width: 100%;
    min-height: 100%;
    background-color: #f1f1f1;
}
.loading-box1 {
    width: 39px;
    height: 39px;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -19px;
    margin-top: -19px;
    z-index: 999;
}
.pm-model{
    width:100%;
}
.pm-header{
    width:100%;
    height:65px;
    background-color: #295496;
}
.pm-header p{
    width: 1000px;
    height: 100%;
    margin: 0 auto;
    color: #fff;
    font-size: 24px;
    line-height: 65px;
}
.pm-body{
    width: 100%;
    /*width: 1200px;*/
    margin: 0 auto;
    /* display: flex; */
    /* flex-direction: row; */
}

/* ��ߵ��� */

.leftAnchor{
    min-height: 100%;
    background-color: #fff;
    /* flex: 9; */
    margin-right: 10px;
    padding: 15px 0;
    position:  fixed;
    z-index:  8;
    width: 284px;
}
.pjprogress{
    font-family: "΢���ź�";
    margin-bottom: 20px;
    padding:0 15px;
}
.pjprogress_txt{
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    font-weight: 600;
    font-size: 15px;
}
.pjprogress_txt a{
    color: #1188db;
}

.pjprogress_txt p span{
    color: #1E9FFF;
    font-size: 16px;
}
.anchorNav ul li{
    position: relative;
}
.anchorNav ul li a{
    height:50px;
    line-height: 30px;
    padding:10px 15px;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    cursor: pointer;
    position: relative;
}
.anchorNav ul li .nav-left{
    font-weight: 600;
    color: #999;
}
.anchorNav ul li:after{
    content:"";
    width:3px;
    height: 0;
    display: inline-block;
    background-color: #295496;
    transition: all .3s;
    position: absolute;
    right:0;
    top:0;
}

.anchorNav ul li:hover{
    background-color: #f1f1f1;
    color:#fff;
}
.anchorNav ul li:hover:after{
    height: 100%;
}
.anchorNav ul li:hover .nav-left{
    font-weight: 600;
    color: #295496!important;
}
.anchorNav ul li>p>span{
    vertical-align: 1px;
    margin-left:3px;
}

.addCapture{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 2.5;
    font-size: 16px;
    color: #999;
    cursor: pointer;
    margin-top:10px;
}
.addCapture i{
    margin-right:6px;
    font-size: 18px;
}
.addCapture:hover{
    color:#fff;
    background-color: #295496;
}

.save-btn{
    width: 100%;
    text-align: center;
    margin-top:10px;
}
/* ������ɫ�� */
.font-red{
    color:#ff6a6a!important;
}
.font-zq{
    color: #295496!important;
}
.font-zq span{
    font-weight: 600;
}


/* �ұ����� */
.pj-item{
    margin-bottom: 15px;
}
.rightContent{
    /* flex: 10; */
    height:auto;
    background-color: #fff;
    padding:15px;
    margin-left: 295px;
    /*width: 775px;*/
}
.pj-item-header{
    display: flex;
    justify-content: space-between;
}
.pj-item-header-left{
    display: flex;
    flex-direction: row;
}
.pj-item-header-left p:nth-of-type(1){
    height: 40px;
    text-align: center;
    line-height: 40px;
    background-color: #eee;
    font-size: 18px;
    display: inline-block;
    padding: 0px 18px;
}
.pj-item-header-left p:nth-of-type(2){
    padding-top:20px;
    margin-left:10px;
    color: #ee8a39;
    cursor: pointer;
}
.pj-item-header-left p:nth-of-type(2) span{
    vertical-align: 1px;
}

.pj-item-header-right{
    color: #999;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 13px;
}
.pj-item-header-right i{
    font-size: 18px;
    vertical-align:0px;
}
.pj-item-header-right .removeItem{
    margin-right:15px;
    color: #295496;
    cursor: pointer;

}
.pj-item-header-right .addItem{
    cursor: pointer;
}




.secLevel{
    margin-bottom:15px;
}
.pj-item-body-top{
    width:100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 16px;
    line-height: 2;
    color:#333;
    margin-bottom:5px;
    /*position: relative;*/
}
.pj-item-body-top .editOprate,.updata-file{
    font-size: 14px;
    color: #295496;
    /*font-weight: 600;*/
    cursor: pointer;

    display: flex;
    flex-direction: row;

}
.pj-item-body-top .editOprate .remove{
    margin-right:15px;
}
.pj-item-body-bottom{
    width: 100%;
    /*min-height: 150px;*/
    /* background-color: #f1f1f1; */
    position: relative;
    text-indent: 10px;
    padding-top: 10px;
    border: 1px dashed #d2c9c9;
}
.pj-item-body-bottom .fillInCon{
    font-size: 18px;
    /*color:#a1a4a9;*/
    color:#d0cdcd;
    /*font-weight: 600;*/
    cursor: pointer;
    position: absolute;
    top:42%;
    left:42%;
    font-family: serif;
}
.pj-item-body-bottom .fillInCon i{
    font-size: 20px;
    vertical-align: -1px;
}
.pj-item-body-bottom .fillInCon:hover{
    color: #295496;
}
.levelTips{
    width:100%;
    height:50px;
    text-align: center;
    line-height: 50px;
    border: 1px solid #eee;
    color: #ddd;
}

/* ���ض��� */
.returnTop{
    position: fixed;
    right: 20px;
    bottom: 150px;
    cursor: pointer;
}
.returnTop img{
    width: 45px;
}

/* �����ı༭�� */

.popUpbox,.addModuleTwo,.editConbox,.addModuleOne{
    width: 100%;
    height:100%;
    background-color: rgba(0, 0, 0, .5);
    position: fixed;
    top: 0;
    left:0;
    z-index: 999;
}
.editContent{
    width:500px;
    height:500px;
    background-color: #fff;
    padding:20px 30px;
    position: absolute;
    top:50%;
    left:50%;
    margin-left:-250px;
    margin-top:-250px;
}
.editContent .modelline{
    width: 100%;
    height: 40px;
    background-color: #295496;
    line-height: 40px;
    padding-left:15px;
    font-size: 15px;
    font-family: "΢���ź�";
    margin-bottom: 20px;
    color: #fff;
    font-size: 16px;
    border-radius: 5px;
}
.editContent #editbox{
    width: 100%;
    height:328px;
}
.btn-group{
    float: right;
    margin-top:10px;
}

/* ����ģ������ */
.addModuleTwo{
    display: none;
}
.addInfo{
    width: 600px;
    height:300px;
    background-color: #fff;

    position: absolute;
    top: 50%;
    left:50%;
    margin-left:-300px;
    margin-top:-150px;

    padding:20px 25px;
}
.addModuleTwo .layui-input-block{
    margin-left:110px;
}
.addModuleTwo .layui-form-label{
    width:110px;
    font-size: 16px;
}
.addTitle{
    width: 100%;
    height:40px;
    background-color: #295496;
    color: #fff;
    line-height: 40px;
    padding-left:15px;
    margin-bottom:15px;
}

/* �޸�����ʱ�༭����ʽ */
.editContent{
    height:530px;
}
.editConbox .layui-input-block{
    margin-left:110px;
}
.editConbox .layui-form-label{
    width:110px;
    font-size: 16px;
}
.editContent #editAlreadyBox{
    width: 100%;
    height: 328px;
}

/* ���һ��ģ�� */
.addModuleOne .editContent{
    width: 500px;
    height:300px;
    margin-left:-250px;
    margin-top:-150px;
}
.addModuleOne .modelline{
    border-radius: 5px;
    height: 40px;
    line-height: 40px;
    margin-bottom:20px;
}
.addModuleOne .layui-input-block{
    margin-left:110px;
}
.addModuleOne .layui-form-label{
    width:110px;
    font-size: 16px;
}



/* table ��ʽ */
table {
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
}
table td,
table th {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 3px 5px;
}
table th {
    border-bottom: 2px solid #ccc;
    text-align: center;
}

/* blockquote ��ʽ */
blockquote {
    display: block;
    border-left: 8px solid #d0e5f2;
    padding: 5px 10px;
    margin: 10px 0;
    line-height: 1.4;
    font-size: 100%;
    background-color: #f1f1f1;
}

/* code ��ʽ */
code {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    background-color: #f1f1f1;
    border-radius: 3px;
    padding: 3px 5px;
    margin: 0 3px;
}
pre code {
    display: block;
}

/* ul ol ��ʽ */
ul, ol {
    /*margin: 10px 0 10px 20px;*/
    /*margin: 0px 0 10px 20px;*/
}

.right-sp {
    text-align: right;
    height: 30px;
}
.editOprate div {
    display: inline-block;
    margin-right: 10px;
}
.common {
    color: #908a8a;
}

.common_service {
    margin:10px 0px;
    border: 1px dashed #ccc;
    line-height: 36px;
    /*text-indent: 15px;*/
    display: flex;
    flex-wrap: wrap;
    padding: 13px 0px
}
.common_service ul li{
    color: #8e8686;
    display: inline-block;
    background: #f1f1f1;
    margin: 3px 6px;
    padding: 0px 6px;
    position:relative;
}
.common_service  ul {
    display: inline-table;
}
.del-btn-con{

    cursor: pointer;
}
.del-template{
    position: absolute;
    right: 25px;
    top: 18px;
    cursor: pointer;
}
.common_service .icon-icon:before{
    font-size: 15px;
    margin-left: 5px;
}
.addservice {
    color: #565252;
    cursor: pointer;
    margin-left: 16px;
    padding-top: 4px;
}
.layui-input-inline.option-left {
    /*position: absolute;*/
    /*left: 81px;*/
    /*top: -4px;*/
    font-size: 15px;
    width: 155px;
    margin-left: 7px
}
/*微服务设计选择*/
.popUpbox-tip, .addModuleTwo, .editConbox, .addModuleOne {
    width: 100%;
    height: 100%;
    /*background-color: rgba(0, 0, 0, .5);*/
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
}

.editContent1 {
    width: 600px;
    height: 425px;
    background-color: #fff;
    padding: 20px 30px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -300px;
    margin-top: -212px;
    box-shadow: -3px 3px 40px 5px #ccc;
    -mox-box-shadow: -3px 3px 40px 5px #ccc;
    -webkit-box-shadow: -3px 3px 40px 5px #ccc;
    -moz-box-shadow: -3px 3px 40px 5px #ccc;
}
.editContent1 .left-ft-box{
    flex: 1;
    height: 256px;
}

.editContent .modelline {
    width: 100%;
    height: 40px;
    background-color: #295496;
    line-height: 40px;
    padding-left: 15px;
    font-size: 15px;
    font-family: "΢���ź�";
    margin-bottom: 20px;
    color: #fff;
    font-size: 16px;
    border-radius: 5px;
}

.editContent #editbox {
    width: 100%;
    height: 328px;
}

.btn-group {
    float: right;
    margin-top: 10px;
}

.left-right-box {
    display: flex;
    justify-content: space-between;
    margin-top: 45px;
}

.left-ft-box {
    flex: 1;
    /*width: 260px;*/
    height: 310px

}

.right-ft-box {
    flex: 1;
    /*width: 260px;*/
    height: 279px;
    border: 1px solid #e6e6e6;
    margin-left: 11px;

}

.ry-option {
    border: 1px solid #e6e6e6;
    width: 100%;
    height: 232px;
    margin-top: 9px;
    overflow: scroll;
}

.layui-btn-primary:hover {
    border-color: #009688;
    color: #333;
    background: #136cf3;
    color: #fff;
}

.option-checkbox {
    margin-left: 42px;
}

.ry-label {
    float: left;
    margin-top: 8px;
    margin-left: 13px;
    margin-right: 13px;
}

.header-ft-box {
    height: 38px;
    background: #e6e6e6;
    line-height: 38px;
}

.header-ft-box span:first-child {
    margin-left: 10px;
}

.header-ft-box span:last-child {
    float: right;
    margin-right: 10px;
    cursor: pointer;
}

.checkbox-box {
    padding-top: 15px;
}

.checkbox-box ul li {
    line-height: 27px;
    padding-left: 10px;
    position: relative;
}

.checkbox-box ul li:hover {
    background: #e6e6e6;
}

.layui-form-checked[lay-skin=primary] i {
    border-color: #295596;
    background-color: #295596;
    color: #fff;
}

.iconfont.icon-icon.del-i {
    margin-right: 18px;
    cursor: pointer;
    position: absolute;
    right: 0px;
}

.box-right-renyuan {
    position: absolute;
    right: 12px;
    top: 4px;
    cursor: pointer;
}

.submit-box div {
    display: inline-block;
    text-align: center;
}

.submit-box {
    text-align: center;
}

#submit {
    width: 100px;
    height: 30px;
    line-height: 30px;
    background: #295596;
    color: #fff;
    cursor: pointer;
}

.updata-box {
    text-align: right
}

button#testListAction {
    background: #295596;
}

i.layui-icon.layui-icon-search.right-box-search {
    position: absolute;
    right: 8px;
    font-size: 27px;
    color: #8c8585;
    top: 7px;
    cursor: pointer;
}
#page-button {
    width: 300px;
    text-align: center;
}
.layui-laypage .layui-laypage-curr .layui-laypage-em {
    position: absolute;
    left: -1px;
    top: -1px;
    padding: 1px;
    width: 100%;
    height: 100%;
    background-color: #295496;
}
.norm div {
    color: #333;
    width: 100%;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 1;  /*限制在一个块元素显示的文本的行数*/
    -webkit-box-orient: vertical;
    overflow: hidden;
    position: relative;
}
.norm  a{
    position: absolute;
    color: #1E9FFF;
    cursor: pointer;
    right: 0px;

}

.show-content {
    padding: 17px;
}
.fillInCon1{
    font-size: 18px;
    color: #d0cdcd;
    cursor: pointer;
    position: absolute;
    top: 42%;
    left: 42%;
    font-family: serif;
}
.layui-upload-list{text-align: center;}
.layui-upload-list img {
    display: inline-block;

}
.deploy {
    display: inline-block;
    margin-right: 20px;
}
.deploy p {
    display: inline-block;
}
.option-box {
    display: inline-block;
    margin-left: 5px;
}
.option-checkbox-txt.layui-form {
    position: absolute;
    bottom: 15px;
    right: 10px;
}
.layui-form-select dl dd.layui-this {
    background-color: #295496;
    color: #fff;
}
.editOprate{
    font-size: 13px;
    color: #295496;
    cursor: pointer;
    display: flex;
    flex-direction: row;
}
.layui-btn-normal {
    background-color: #295496;
}

.addItem-box{cursor: pointer}
#project-overview-box{
    /*display: none;*/
}

.pj-item-body-bottom.service-sj textarea {
    border: 0px;
}
.pj-item-body.service-list {
    margin-top: 20px;
    padding: 20px;
    position: relative;
    border-top:1px solid #fff;
    border-left:1px solid #fff;
    border-right:1px solid #fff;
    border-bottom:8px solid #eee;

}
.service-list:hover{
    border-top:1px solid #ccc;
    border-left:1px solid #ccc;
    border-right:1px solid #ccc;
    border-bottom:1px solid #ccc;
}
.line-box {
    height: 10px;
    background: #f1f1f1;
    margin-top: 10px;
}
.deploy-box-tip {
    border: 1px solid red;
    padding: 19px;
    height: 140px;
}

.pj-item-body-bottom p {
    line-height: 28px;
    padding: 10px;
}
.editCon-box {
    display: inline-block;
    top: -35px;
    right: 10px;
    cursor: pointer;
}
.editCon-box-btn {
    display: inline-block;
    top: -35px;
    right: 10px;
    cursor: pointer;
    position: absolute;
}
.btn-center{
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    display: inline-block;
    background-color: #295496;
    color: #fff;
    white-space: nowrap;
    text-align: center;
    font-size: 14px;
    border: none;
    border-radius: 2px;
    cursor: pointer;
}
.box-tip {
    border: 1px solid #f90c0c;
    padding: 20px;
}
.sumbit-button{margin-top: 20px}
.info-box {
    border: 1px solid #fff;
    position: relative;
    overflow: hidden;
}
.info-box:hover{
    border: 1px solid #CCCCCC;
}
.center-box {
    /*height: 100px;*/
    margin-top: 12px;
}
.change-btn,.edit-btn{
    position: absolute;
    right: 52px;
    top: 20px;
    cursor: pointer;
}
.btn-del {
    position: absolute;
    right: 15px;
    top: 18px;
    cursor: pointer;
}
.edit-con-box-btn{
    cursor: pointer;
    display: none;
}
.change-btn:hover{
    color: #295496;
}
.center-box input{
    border: 0px;
}

.pj-item-body-bottom textarea {
    border: 0px;
    width: 100%;

}
.sumbit-button-box {
    text-align: center;
}
.show-box{
    display: block;
}
.hide-box{
    display: none;
}
.add-solution-box{
    border:1px solid red;
    padding: 20px;
}
.add-staff-box {
    border: 1px solid red;
    height: 150px;
    padding: 20px;
}
.staff-center-box {
    display: inherit;
    text-align: center;
}
.add-staff-box .sumbit-button-box{
    margin-top: 30px;
}

.edit-staff-content {
    margin-top: 20px;
}
.edit-staff-box {
    height: 85px;
    border: 1px solid #fff;
    position: relative;
}
.staff-box-edit-done{border: 1px solid #fff}
.editTitle {
    font-size: 16px;
}


.add-deploy-box {
    height: 100px;
    padding: 10px;
    position: relative;
    border: 1px solid #fff;
}
#demo1 {
    width: 40%;
    height: auto;
}

.layui-form-item .layui-input-inline {
    float: left;
    width: 190px;
    margin-right: -27px;
}
.layui-form-item.organ-box .layui-inline {
    margin-right: 100px;
}
.layui-input-block {
    margin-left: 108px;
    min-height: 36px;
}

.layui-input{
    height: 38px;
    line-height: 21.3;
    background-color: #fff;
    border-radius: 2px;
}

.line-red {
    border: 1px solid red;
    padding: 20px;
}
.line-red .pj-item-body-bottom {
    border: 0px;
}

.line-red .secLevel textarea{
    border: 1px solid #e6e6e6;
}

/*.edit-back-box .secLevel .pj-item-body-bottom {*/
/*min-height: 150px;*/
/*}*/
.edit-back-box {
    position: relative;
    padding: 20px;
    border: 1px solid #fff;
}
.edit-back-box:hover{
    border: 1px solid #CCCCCC;
}

#project-overview-box{
    display: none;
}

.icon-tianjia:before{
    font-size: 13px;
}

.pj-basic-info .layui-form-label{
    width: 130px;
}

/**审核意见盒子**/
.audit-box{
    cursor: pointer;
    margin-right: 200px;
    margin-top: 3px;
    color: #ff2140;
    position: relative;
    display: none;
}
.show-audit-box {
    width: 200px;
    position: absolute;
    background: #ccc;
    opacity: 0.9;
    color: #fff;
    text-align: left;
    padding: 20px;
    left: 0;
    display: none;
    z-index: 10;
}
.show-audit-box ul li{
    line-height: 20px;
}

#pj-solution .editOprate{
    display: none;
}

.edit-solution-box{
    border: 1px solid #fff;
    padding: 20px;
    display: none;
}
.edit-solution-box:hover{
    border: 1px solid #cccccc;

}
.app-service-box ul li {
    color: #8e8686;
    display: inline-block;
    background: #f1f1f1;
    margin: 3px 6px;
    padding: 0px 15px;
    position: relative;
}

.editOprate a{
    color: #295496;
}

.serviceName {
    font-size: 16px;
    margin-left: 9px;
    font-weight: 500;
}

.applicationName {
    margin-left: 15px;
}
.name-app {
    position: absolute;
    left: 100px;
}

a.docExport {
    color: #1188db;
    float: right;
    display: inline-block;
    padding: 10px;

    border: 1px solid #ece8e8;
    margin-bottom: 12px;
}

a.docExport:hover{
        background: #4f80ca;
    color: #fff;
}    



/*
 *
 *   H+ - 后台主题UI框架
 *   version 4.0
 *
*/

h1,
h2,
h3,
h4,
h5,
h6 {
    font-weight: 100;
}

h1 {
    font-size: 30px;
}

h2 {
    font-size: 24px;
}

h3 {
    font-size: 16px;
}

h4 {
    font-size: 14px;
}

h5 {
    font-size: 12px;
}

h6 {
    font-size: 10px;
}

h3,
h4,
h5 {
    margin-top: 5px;
    font-weight: 600;
}

a:focus {
    outline: none;
}

.nav > li > a {
    color: #a7b1c2;
    font-weight: 600;
    padding: 14px 20px 14px 25px;
}

.nav li>a {
    display: block;
    /*white-space: nowrap;*/
}

.nav.navbar-right > li > a {
    color: #999c9e;
}

.nav > li.active > a {
    color: #ffffff;
}

.navbar-default .nav > li > a:hover,
.navbar-default .nav > li > a:focus {
    background-color: #293846;
    color: white;
}

.nav .open > a,
.nav .open > a:hover,
.nav .open > a:focus {
    background: #fff;
}

.nav > li > a i {
    margin-right: 6px;
}

.navbar {
    border: 0;
}

.navbar-default {
    background-color: transparent;
    border-color: #2f4050;
    position: relative;
}

.navbar-top-links li {
    display: inline-block;
}

.navbar-top-links li:last-child {
    margin-right: 30px;
}

body.body-small .navbar-top-links li:last-child {
    margin-right: 10px;
}

.navbar-top-links li a {
    padding: 20px 10px;
    min-height: 50px;
}

.dropdown-menu {
    border: medium none;
    display: none;
    float: left;
    font-size: 12px;
    left: 0;
    list-style: none outside none;
    padding: 0;
    position: absolute;
    text-shadow: none;
    top: 100%;
    z-index: 1000;
    border-radius: 0;
    box-shadow: 0 0 3px rgba(86, 96, 117, 0.3);
}

.dropdown-menu > li > a {
    border-radius: 3px;
    color: inherit;
    line-height: 25px;
    margin: 4px;
    text-align: left;
    font-weight: normal;
}

.dropdown-menu > li > a.font-bold {
    font-weight: 600;
}

.navbar-top-links .dropdown-menu li {
    display: block;
}

.navbar-top-links .dropdown-menu li:last-child {
    margin-right: 0;
}

.navbar-top-links .dropdown-menu li a {
    padding: 3px 20px;
    min-height: 0;
}

.navbar-top-links .dropdown-menu li a div {
    white-space: normal;
}

.navbar-top-links .dropdown-messages,
.navbar-top-links .dropdown-tasks,
.navbar-top-links .dropdown-alerts {
    width: 310px;
    min-width: 0;
}

.navbar-top-links .dropdown-messages {
    margin-left: 5px;
}

.navbar-top-links .dropdown-tasks {
    margin-left: -59px;
}

.navbar-top-links .dropdown-alerts {
    margin-left: -123px;
}

.navbar-top-links .dropdown-user {
    right: 0;
    left: auto;
}

.dropdown-messages,
.dropdown-alerts {
    padding: 10px 10px 10px 10px;
}

.dropdown-messages li a,
.dropdown-alerts li a {
    font-size: 12px;
}

.dropdown-messages li em,
.dropdown-alerts li em {
    font-size: 10px;
}

.nav.navbar-top-links .dropdown-alerts a {
    font-size: 12px;
}

.nav-header {
    padding: 33px 25px;
    background: url("patterns/header-profile.png") no-repeat;
}

.pace-done .nav-header {
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
}

.nav > li.active {
    border-left: 4px solid #19aa8d;
    background: #293846;
}

.nav.nav-second-level > li.active {
    border: none;
}

.nav.nav-second-level.collapse[style] {
    height: auto !important;
}

.nav-header a {
    color: #DFE4ED;
}

.nav-header .text-muted {
    color: #8095a8;
}

.minimalize-styl-2 {
    padding: 4px 12px;
    margin: 14px 5px 5px 20px;
    font-size: 14px;
    float: left;
}

.navbar-form-custom {
    float: left;
    height: 50px;
    padding: 0;
    width: 200px;
    display: inline-table;
}

.navbar-form-custom .form-group {
    margin-bottom: 0;
}

.nav.navbar-top-links a {
    font-size: 14px;
}

.navbar-form-custom .form-control {
    background: none repeat scroll 0 0 rgba(0, 0, 0, 0);
    border: medium none;
    font-size: 14px;
    height: 60px;
    margin: 0;
    z-index: 2000;
}

.count-info .label {
    line-height: 12px;
    padding: 1px 5px;
    position: absolute;
    right: 6px;
    top: 12px;
}

.arrow {
    float: right;
    margin-top: 2px;
}

.fa.arrow:before {
    content: "\\f104";
}

.active > a > .fa.arrow:before {
    content: "\\f107";
}

.nav-second-level li,
.nav-third-level li {
    border-bottom: none !important;
}

.nav-second-level li a {
    padding: 7px 15px 7px 10px;
    padding-left: 52px;
}

.nav-third-level li a {
    padding-left: 62px;
}

.nav-second-level li:last-child {
    margin-bottom: 10px;
}

body:not(.fixed-sidebar):not(.canvas-menu).mini-navbar .nav li:hover > .nav-second-level,
.mini-navbar .nav li:focus > .nav-second-level {
    display: block;
    border-radius: 0 2px 2px 0;
    min-width: 140px;
    height: auto;
}

body.mini-navbar .navbar-default .nav > li > .nav-second-level li a {
    font-size: 12px;
    border-radius: 0 2px 2px 0;
}

.fixed-nav .slimScrollDiv #side-menu {
    padding-bottom: 60px;
    position: relative;
}

.slimScrollDiv >* {
    overflow: hidden;
}

.mini-navbar .nav-second-level li a {
    padding: 10px 10px 10px 15px;
}

.canvas-menu.mini-navbar .nav-second-level {
    background: #293846;
}

.mini-navbar li.active .nav-second-level {
    left: 65px;
}

.navbar-default .special_link a {
    background: #1ab394;
    color: white;
}

.navbar-default .special_link a:hover {
    background: #17987e !important;
    color: white;
}

.navbar-default .special_link a span.label {
    background: #fff;
    color: #1ab394;
}

.navbar-default .landing_link a {
    background: #1cc09f;
    color: white;
}

.navbar-default .landing_link a:hover {
    background: #1ab394 !important;
    color: white;
}

.navbar-default .landing_link a span.label {
    background: #fff;
    color: #1cc09f;
}

.logo-element {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: white;
    display: none;
    padding: 18px 0;
}

.pace-done .navbar-static-side,
.pace-done .nav-header,
.pace-done li.active,
.pace-done #page-wrapper,
.pace-done .footer {
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
}

.navbar-fixed-top {
    background: #fff;
    -webkit-transition-duration: 0.5s;
    transition-duration: 0.5s;
    z-index: 2030;
}

.navbar-fixed-top,
.navbar-static-top {
    background: #f3f3f4;
}

.fixed-nav #wrapper {
    padding-top: 60px;
    box-sizing: border-box;
}

.fixed-nav .minimalize-styl-2 {
    margin: 14px 5px 5px 15px;
}

.body-small .navbar-fixed-top {
    margin-left: 0px;
}

body.mini-navbar .navbar-static-side {
    width: 70px;
}

body.mini-navbar .profile-element,
body.mini-navbar .nav-label,
body.mini-navbar .navbar-default .nav li a span {
    display: none;
}

body.canvas-menu .profile-element {
    display: block;
}

body:not(.fixed-sidebar):not(.canvas-menu).mini-navbar .nav-second-level {
    display: none;
}

body.mini-navbar .navbar-default .nav > li > a {
    font-size: 16px;
}

body.mini-navbar .logo-element {
    display: block;
}

body.canvas-menu .logo-element {
    display: none;
}

body.mini-navbar .nav-header {
    padding: 0;
    background-color: #1ab394;
}

body.canvas-menu .nav-header {
    padding: 33px 25px;
}

body.mini-navbar #page-wrapper {
    margin: 0 0 0 70px;
}

body.canvas-menu.mini-navbar #page-wrapper,
body.canvas-menu.mini-navbar .footer {
    margin: 0 0 0 0;
}

body.fixed-sidebar .navbar-static-side,
body.canvas-menu .navbar-static-side {
    position: fixed;
    width: 220px;
    z-index: 2001;
    height: 100%;
}

body.fixed-sidebar.mini-navbar .navbar-static-side {
    width: 70px;
}

body.fixed-sidebar.mini-navbar #page-wrapper {
    margin: 0 0 0 70px;
}

body.body-small.fixed-sidebar.mini-navbar #page-wrapper {
    margin: 0 0 0 70px;
}

body.body-small.fixed-sidebar.mini-navbar .navbar-static-side {
    width: 70px;
}

.fixed-sidebar.mini-navbar .nav li> .nav-second-level {
    display: none;
}

.fixed-sidebar.mini-navbar .nav li.active {
    border-left-width: 0;
}

.fixed-sidebar.mini-navbar .nav li:hover > .nav-second-level,
.canvas-menu.mini-navbar .nav li:hover > .nav-second-level {
    position: absolute;
    left: 70px;
    top: 0px;
    background-color: #2f4050;
    padding: 10px 10px 0 10px;
    font-size: 12px;
    display: block;
    min-width: 140px;
    border-radius: 2px;
}

body.fixed-sidebar.mini-navbar .navbar-default .nav > li > .nav-second-level li a {
    font-size: 12px;
    border-radius: 3px;
}

body.canvas-menu.mini-navbar .navbar-default .nav > li > .nav-second-level li a {
    font-size: 13px;
    border-radius: 3px;
}

.fixed-sidebar.mini-navbar .nav-second-level li a,
.canvas-menu.mini-navbar .nav-second-level li a {
    padding: 10px 10px 10px 15px;
}

.fixed-sidebar.mini-navbar .nav-second-level,
.canvas-menu.mini-navbar .nav-second-level {
    position: relative;
    padding: 0;
    font-size: 13px;
}

.fixed-sidebar.mini-navbar li.active .nav-second-level,
.canvas-menu.mini-navbar li.active .nav-second-level {
    left: 0px;
}

body.canvas-menu nav.navbar-static-side {
    z-index: 2001;
    background: #2f4050;
    height: 100%;
    position: fixed;
    display: none;
}

body.canvas-menu.mini-navbar nav.navbar-static-side {
    display: block;
    width: 70px;
}

.top-navigation #page-wrapper {
    margin-left: 0;
}

.top-navigation .navbar-nav .dropdown-menu > .active > a {
    background: white;
    color: #1ab394;
    font-weight: bold;
}

.white-bg .navbar-fixed-top,
.white-bg .navbar-static-top {
    background: #fff;
}

.top-navigation .navbar {
    margin-bottom: 0;
}

.top-navigation .nav > li > a {
    padding: 15px 20px;
    color: #676a6c;
}

.top-navigation .nav > li a:hover,
.top-navigation .nav > li a:focus {
    background: #fff;
    color: #1ab394;
}

.top-navigation .nav > li.active {
    background: #fff;
    border: none;
}

.top-navigation .nav > li.active > a {
    color: #1ab394;
}

.top-navigation .navbar-right {
    padding-right: 10px;
}

.top-navigation .navbar-nav .dropdown-menu {
    box-shadow: none;
    border: 1px solid #e7eaec;
}

.top-navigation .dropdown-menu > li > a {
    margin: 0;
    padding: 7px 20px;
}

.navbar .dropdown-menu {
    margin-top: 0px;
}

.top-navigation .navbar-brand {
    background: #1ab394;
    color: #fff;
    padding: 15px 25px;
}

.top-navigation .navbar-top-links li:last-child {
    margin-right: 0;
}

.top-navigation.mini-navbar #page-wrapper,
.top-navigation.body-small.fixed-sidebar.mini-navbar #page-wrapper,
.mini-navbar .top-navigation #page-wrapper,
.body-small.fixed-sidebar.mini-navbar .top-navigation #page-wrapper,
.canvas-menu #page-wrapper {
    margin: 0;
}

.top-navigation.fixed-nav #wrapper,
.fixed-nav #wrapper.top-navigation {
    margin-top: 50px;
}

.top-navigation .footer.fixed {
    margin-left: 0 !important;
}

.top-navigation .wrapper.wrapper-content {
    padding: 40px;
}

.top-navigation.body-small .wrapper.wrapper-content,
.body-small .top-navigation .wrapper.wrapper-content {
    padding: 40px 0px 40px 0px;
}

.navbar-toggle {
    background-color: #1ab394;
    color: #fff;
    padding: 6px 12px;
    font-size: 14px;
}

.top-navigation .navbar-nav .open .dropdown-menu > li > a,
.top-navigation .navbar-nav .open .dropdown-menu .dropdown-header {
    padding: 10px 15px 10px 20px;
}

@media (max-width: 768px) {
    .top-navigation .navbar-header {
        display: block;
        float: none;
    }
}

.menu-visible-lg,
.menu-visible-md {
    display: none !important;
}

@media (min-width: 1200px) {
    .menu-visible-lg {
        display: block !important;
    }
}

@media (min-width: 992px) {
    .menu-visible-md {
        display: block !important;
    }
}

@media (max-width: 767px) {
    .menu-visible-md {
        display: block !important;
    }
    .menu-visible-lg {
        display: block !important;
    }
}

.btn {
    border-radius: 3px;
}

.float-e-margins .btn {
    margin-bottom: 5px;
}

.btn-w-m {
    min-width: 120px;
}

.btn-primary.btn-outline {
    color: #1ab394;
}

.btn-success.btn-outline {
    color: #1c84c6;
}

.btn-info.btn-outline {
    color: #23c6c8;
}

.btn-warning.btn-outline {
    color: #f8ac59;
}

.btn-danger.btn-outline {
    color: #ed5565;
}

.btn-primary.btn-outline:hover,
.btn-success.btn-outline:hover,
.btn-info.btn-outline:hover,
.btn-warning.btn-outline:hover,
.btn-danger.btn-outline:hover {
    color: #fff;
}

.btn-primary {
    background-color: #1ab394;
    border-color: #1ab394;
    color: #FFFFFF;
}

.btn-primary:hover,
.btn-primary:focus,
.btn-primary:active,
.btn-primary.active,
.open .dropdown-toggle.btn-primary {
    background-color: #18a689;
    border-color: #18a689;
    color: #FFFFFF;
}

.btn-primary:active,
.btn-primary.active,
.open .dropdown-toggle.btn-primary {
    background-image: none;
}

.btn-primary.disabled,
.btn-primary.disabled:hover,
.btn-primary.disabled:focus,
.btn-primary.disabled:active,
.btn-primary.disabled.active,
.btn-primary[disabled],
.btn-primary[disabled]:hover,
.btn-primary[disabled]:focus,
.btn-primary[disabled]:active,
.btn-primary.active[disabled],
fieldset[disabled] .btn-primary,
fieldset[disabled] .btn-primary:hover,
fieldset[disabled] .btn-primary:focus,
fieldset[disabled] .btn-primary:active,
fieldset[disabled] .btn-primary.active {
    background-color: #1dc5a3;
    border-color: #1dc5a3;
}

.btn-success {
    background-color: #1c84c6;
    border-color: #1c84c6;
    color: #FFFFFF;
}

.btn-success:hover,
.btn-success:focus,
.btn-success:active,
.btn-success.active,
.open .dropdown-toggle.btn-success {
    background-color: #1a7bb9;
    border-color: #1a7bb9;
    color: #FFFFFF;
}

.btn-success:active,
.btn-success.active,
.open .dropdown-toggle.btn-success {
    background-image: none;
}

.btn-success.disabled,
.btn-success.disabled:hover,
.btn-success.disabled:focus,
.btn-success.disabled:active,
.btn-success.disabled.active,
.btn-success[disabled],
.btn-success[disabled]:hover,
.btn-success[disabled]:focus,
.btn-success[disabled]:active,
.btn-success.active[disabled],
fieldset[disabled] .btn-success,
fieldset[disabled] .btn-success:hover,
fieldset[disabled] .btn-success:focus,
fieldset[disabled] .btn-success:active,
fieldset[disabled] .btn-success.active {
    background-color: #1f90d8;
    border-color: #1f90d8;
}

.btn-info {
    background-color: #23c6c8;
    border-color: #23c6c8;
    color: #FFFFFF;
}

.btn-info:hover,
.btn-info:focus,
.btn-info:active,
.btn-info.active,
.open .dropdown-toggle.btn-info {
    background-color: #21b9bb;
    border-color: #21b9bb;
    color: #FFFFFF;
}

.btn-info:active,
.btn-info.active,
.open .dropdown-toggle.btn-info {
    background-image: none;
}

.btn-info.disabled,
.btn-info.disabled:hover,
.btn-info.disabled:focus,
.btn-info.disabled:active,
.btn-info.disabled.active,
.btn-info[disabled],
.btn-info[disabled]:hover,
.btn-info[disabled]:focus,
.btn-info[disabled]:active,
.btn-info.active[disabled],
fieldset[disabled] .btn-info,
fieldset[disabled] .btn-info:hover,
fieldset[disabled] .btn-info:focus,
fieldset[disabled] .btn-info:active,
fieldset[disabled] .btn-info.active {
    background-color: #26d7d9;
    border-color: #26d7d9;
}

.btn-default {
    background-color: #c2c2c2;
    border-color: #c2c2c2;
    color: #FFFFFF;
}

.btn-default:hover,
.btn-default:focus,
.btn-default:active,
.btn-default.active,
.open .dropdown-toggle.btn-default {
    background-color: #bababa;
    border-color: #bababa;
    color: #FFFFFF;
}

.btn-default:active,
.btn-default.active,
.open .dropdown-toggle.btn-default {
    background-image: none;
}

.btn-default.disabled,
.btn-default.disabled:hover,
.btn-default.disabled:focus,
.btn-default.disabled:active,
.btn-default.disabled.active,
.btn-default[disabled],
.btn-default[disabled]:hover,
.btn-default[disabled]:focus,
.btn-default[disabled]:active,
.btn-default.active[disabled],
fieldset[disabled] .btn-default,
fieldset[disabled] .btn-default:hover,
fieldset[disabled] .btn-default:focus,
fieldset[disabled] .btn-default:active,
fieldset[disabled] .btn-default.active {
    background-color: #cccccc;
    border-color: #cccccc;
}

.btn-warning {
    background-color: #f8ac59;
    border-color: #f8ac59;
    color: #FFFFFF;
}

.btn-warning:hover,
.btn-warning:focus,
.btn-warning:active,
.btn-warning.active,
.open .dropdown-toggle.btn-warning {
    background-color: #f7a54a;
    border-color: #f7a54a;
    color: #FFFFFF;
}

.btn-warning:active,
.btn-warning.active,
.open .dropdown-toggle.btn-warning {
    background-image: none;
}

.btn-warning.disabled,
.btn-warning.disabled:hover,
.btn-warning.disabled:focus,
.btn-warning.disabled:active,
.btn-warning.disabled.active,
.btn-warning[disabled],
.btn-warning[disabled]:hover,
.btn-warning[disabled]:focus,
.btn-warning[disabled]:active,
.btn-warning.active[disabled],
fieldset[disabled] .btn-warning,
fieldset[disabled] .btn-warning:hover,
fieldset[disabled] .btn-warning:focus,
fieldset[disabled] .btn-warning:active,
fieldset[disabled] .btn-warning.active {
    background-color: #f9b66d;
    border-color: #f9b66d;
}

.btn-danger {
    background-color: #ed5565;
    border-color: #ed5565;
    color: #FFFFFF;
}

.btn-danger:hover,
.btn-danger:focus,
.btn-danger:active,
.btn-danger.active,
.open .dropdown-toggle.btn-danger {
    background-color: #ec4758;
    border-color: #ec4758;
    color: #FFFFFF;
}

.btn-danger:active,
.btn-danger.active,
.open .dropdown-toggle.btn-danger {
    background-image: none;
}

.btn-danger.disabled,
.btn-danger.disabled:hover,
.btn-danger.disabled:focus,
.btn-danger.disabled:active,
.btn-danger.disabled.active,
.btn-danger[disabled],
.btn-danger[disabled]:hover,
.btn-danger[disabled]:focus,
.btn-danger[disabled]:active,
.btn-danger.active[disabled],
fieldset[disabled] .btn-danger,
fieldset[disabled] .btn-danger:hover,
fieldset[disabled] .btn-danger:focus,
fieldset[disabled] .btn-danger:active,
fieldset[disabled] .btn-danger.active {
    background-color: #ef6776;
    border-color: #ef6776;
}

.btn-link {
    color: inherit;
}

.btn-link:hover,
.btn-link:focus,
.btn-link:active,
.btn-link.active,
.open .dropdown-toggle.btn-link {
    color: #1ab394;
    text-decoration: none;
}

.btn-link:active,
.btn-link.active,
.open .dropdown-toggle.btn-link {
    background-image: none;
}

.btn-link.disabled,
.btn-link.disabled:hover,
.btn-link.disabled:focus,
.btn-link.disabled:active,
.btn-link.disabled.active,
.btn-link[disabled],
.btn-link[disabled]:hover,
.btn-link[disabled]:focus,
.btn-link[disabled]:active,
.btn-link.active[disabled],
fieldset[disabled] .btn-link,
fieldset[disabled] .btn-link:hover,
fieldset[disabled] .btn-link:focus,
fieldset[disabled] .btn-link:active,
fieldset[disabled] .btn-link.active {
    color: #cacaca;
}

.btn-white {
    color: inherit;
    background: white;
    border: 1px solid #e7eaec;
}

.btn-white:hover,
.btn-white:focus,
.btn-white:active,
.btn-white.active,
.open .dropdown-toggle.btn-white {
    color: inherit;
    border: 1px solid #d2d2d2;
}

.btn-white:active,
.btn-white.active {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15) inset;
}

.btn-white:active,
.btn-white.active,
.open .dropdown-toggle.btn-white {
    background-image: none;
}

.btn-white.disabled,
.btn-white.disabled:hover,
.btn-white.disabled:focus,
.btn-white.disabled:active,
.btn-white.disabled.active,
.btn-white[disabled],
.btn-white[disabled]:hover,
.btn-white[disabled]:focus,
.btn-white[disabled]:active,
.btn-white.active[disabled],
fieldset[disabled] .btn-white,
fieldset[disabled] .btn-white:hover,
fieldset[disabled] .btn-white:focus,
fieldset[disabled] .btn-white:active,
fieldset[disabled] .btn-white.active {
    color: #cacaca;
}

.form-control,
.form-control:focus,
.has-error .form-control:focus,
.has-success .form-control:focus,
.has-warning .form-control:focus,
.navbar-collapse,
.navbar-form,
.navbar-form-custom .form-control:focus,
.navbar-form-custom .form-control:hover,
.open .btn.dropdown-toggle,
.panel,
.popover,
.progress,
.progress-bar {
    box-shadow: none;
}

.btn-outline {
    color: inherit;
    background-color: transparent;
    -webkit-transition: all .5s;
    transition: all .5s;
}

.btn-rounded {
    border-radius: 50px;
}

.btn-large-dim {
    width: 90px;
    height: 90px;
    font-size: 42px;
}

button.dim {
    display: inline-block;
    color: #fff;
    text-decoration: none;
    text-transform: uppercase;
    text-align: center;
    padding-top: 6px;
    margin-right: 10px;
    position: relative;
    cursor: pointer;
    border-radius: 5px;
    font-weight: 600;
    margin-bottom: 20px !important;
}

button.dim:active {
    top: 3px;
}

button.btn-primary.dim {
    box-shadow: inset 0px 0px 0px #16987e, 0px 5px 0px 0px #16987e, 0px 10px 5px #999999;
}

button.btn-primary.dim:active {
    box-shadow: inset 0px 0px 0px #16987e, 0px 2px 0px 0px #16987e, 0px 5px 3px #999999;
}

button.btn-default.dim {
    box-shadow: inset 0px 0px 0px #b3b3b3, 0px 5px 0px 0px #b3b3b3, 0px 10px 5px #999999;
}

button.btn-default.dim:active {
    box-shadow: inset 0px 0px 0px #b3b3b3, 0px 2px 0px 0px #b3b3b3, 0px 5px 3px #999999;
}

button.btn-warning.dim {
    box-shadow: inset 0px 0px 0px #f79d3c, 0px 5px 0px 0px #f79d3c, 0px 10px 5px #999999;
}

button.btn-warning.dim:active {
    box-shadow: inset 0px 0px 0px #f79d3c, 0px 2px 0px 0px #f79d3c, 0px 5px 3px #999999;
}

button.btn-info.dim {
    box-shadow: inset 0px 0px 0px #1eacae, 0px 5px 0px 0px #1eacae, 0px 10px 5px #999999;
}

button.btn-info.dim:active {
    box-shadow: inset 0px 0px 0px #1eacae, 0px 2px 0px 0px #1eacae, 0px 5px 3px #999999;
}

button.btn-success.dim {
    box-shadow: inset 0px 0px 0px #1872ab, 0px 5px 0px 0px #1872ab, 0px 10px 5px #999999;
}

button.btn-success.dim:active {
    box-shadow: inset 0px 0px 0px #1872ab, 0px 2px 0px 0px #1872ab, 0px 5px 3px #999999;
}

button.btn-danger.dim {
    box-shadow: inset 0px 0px 0px #ea394c, 0px 5px 0px 0px #ea394c, 0px 10px 5px #999999;
}

button.btn-danger.dim:active {
    box-shadow: inset 0px 0px 0px #ea394c, 0px 2px 0px 0px #ea394c, 0px 5px 3px #999999;
}

button.dim:before {
    font-size: 50px;
    line-height: 1em;
    font-weight: normal;
    color: #fff;
    display: block;
    padding-top: 10px;
}

button.dim:active:before {
    top: 7px;
    font-size: 50px;
}

.label {
    background-color: #d1dade;
    color: #5e5e5e;
    font-size: 10px;
    font-weight: 600;
    padding: 3px 8px;
    text-shadow: none;
}

.badge {
    background-color: #d1dade;
    color: #5e5e5e;
    font-size: 11px;
    font-weight: 600;
    padding-bottom: 4px;
    padding-left: 6px;
    padding-right: 6px;
    text-shadow: none;
}

.label-primary,
.badge-primary {
    background-color: #1ab394;
    color: #FFFFFF;
}

.label-success,
.badge-success {
    background-color: #1c84c6;
    color: #FFFFFF;
}

.label-warning,
.badge-warning {
    background-color: #f8ac59;
    color: #FFFFFF;
}

.label-warning-light,
.badge-warning-light {
    background-color: #f8ac59;
    color: #ffffff;
}

.label-danger,
.badge-danger {
    background-color: #ed5565;
    color: #FFFFFF;
}

.label-info,
.badge-info {
    background-color: #23c6c8;
    color: #FFFFFF;
}

.label-inverse,
.badge-inverse {
    background-color: #262626;
    color: #FFFFFF;
}

.label-white,
.badge-white {
    background-color: #FFFFFF;
    color: #5E5E5E;
}

.label-white,
.badge-disable {
    background-color: #2A2E36;
    color: #8B91A0;
}


/* TOOGLE SWICH */

.onoffswitch {
    position: relative;
    width: 64px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

.onoffswitch-checkbox {
    display: none;
}

.onoffswitch-label {
    display: block;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid #1ab394;
    border-radius: 2px;
}

.onoffswitch-inner {
    width: 200%;
    margin-left: -100%;
    -webkit-transition: margin 0.3s ease-in 0s;
    transition: margin 0.3s ease-in 0s;
}

.onoffswitch-inner:before,
.onoffswitch-inner:after {
    float: left;
    width: 50%;
    height: 20px;
    padding: 0;
    line-height: 20px;
    font-size: 12px;
    color: white;
    font-family: Trebuchet, Arial, sans-serif;
    font-weight: bold;
    box-sizing: border-box;
}

.onoffswitch-inner:before {
    content: "ON";
    padding-left: 10px;
    background-color: #1ab394;
    color: #FFFFFF;
}

.onoffswitch-inner:after {
    content: "OFF";
    padding-right: 10px;
    background-color: #FFFFFF;
    color: #999999;
    text-align: right;
}

.onoffswitch-switch {
    width: 20px;
    margin: 0px;
    background: #FFFFFF;
    border: 2px solid #1ab394;
    border-radius: 2px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 44px;
    -webkit-transition: all 0.3s ease-in 0s;
    transition: all 0.3s ease-in 0s;
}

.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner {
    margin-left: 0;
}

.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch {
    right: 0px;
}


/* CHOSEN PLUGIN */

.chosen-container-single .chosen-single {
    background: #ffffff;
    box-shadow: none;
    -moz-box-sizing: border-box;
    background-color: #FFFFFF;
    border: 1px solid #CBD5DD;
    border-radius: 2px;
    cursor: text;
    height: auto !important;
    margin: 0;
    min-height: 30px;
    overflow: hidden;
    padding: 4px 12px;
    position: relative;
    width: 100%;
}

.chosen-container-multi .chosen-choices li.search-choice {
    background: #f1f1f1;
    border: 1px solid #ededed;
    border-radius: 2px;
    box-shadow: none;
    color: #333333;
    cursor: default;
    line-height: 13px;
    margin: 3px 0 3px 5px;
    padding: 3px 20px 3px 5px;
    position: relative;
}


/* PAGINATIN */

.pagination > .active > a,
.pagination > .active > span,
.pagination > .active > a:hover,
.pagination > .active > span:hover,
.pagination > .active > a:focus,
.pagination > .active > span:focus {
    background-color: #f4f4f4;
    border-color: #DDDDDD;
    color: inherit;
    cursor: default;
    z-index: 2;
}

.pagination > li > a,
.pagination > li > span {
    background-color: #FFFFFF;
    border: 1px solid #DDDDDD;
    color: inherit;
    float: left;
    line-height: 1.42857;
    margin-left: -1px;
    padding: 4px 10px;
    position: relative;
    text-decoration: none;
}


/* TOOLTIPS */

.tooltip-inner {
    background-color: #2F4050;
}

.tooltip.top .tooltip-arrow {
    border-top-color: #2F4050;
}

.tooltip.right .tooltip-arrow {
    border-right-color: #2F4050;
}

.tooltip.bottom .tooltip-arrow {
    border-bottom-color: #2F4050;
}

.tooltip.left .tooltip-arrow {
    border-left-color: #2F4050;
}


/* EASY PIE CHART*/

.easypiechart {
    position: relative;
    text-align: center;
}

.easypiechart .h2 {
    margin-left: 10px;
    margin-top: 10px;
    display: inline-block;
}

.easypiechart canvas {
    top: 0;
    left: 0;
}

.easypiechart .easypie-text {
    line-height: 1;
    position: absolute;
    top: 33px;
    width: 100%;
    z-index: 1;
}

.easypiechart img {
    margin-top: -4px;
}

.jqstooltip {
    box-sizing: content-box;
}


/* FULLCALENDAR */

.fc-state-default {
    background-color: #ffffff;
    background-image: none;
    background-repeat: repeat-x;
    box-shadow: none;
    color: #333333;
    text-shadow: none;
}

.fc-state-default {
    border: 1px solid;
}

.fc-button {
    color: inherit;
    border: 1px solid #e7eaec;
    cursor: pointer;
    display: inline-block;
    height: 1.9em;
    line-height: 1.9em;
    overflow: hidden;
    padding: 0 0.6em;
    position: relative;
    white-space: nowrap;
}

.fc-state-active {
    background-color: #1ab394;
    border-color: #1ab394;
    color: #ffffff;
}

.fc-header-title h2 {
    font-size: 16px;
    font-weight: 600;
    color: inherit;
}

.fc-content .fc-widget-header,
.fc-content .fc-widget-content {
    border-color: #e7eaec;
    font-weight: normal;
}

.fc-border-separate tbody {
    background-color: #F8F8F8;
}

.fc-state-highlight {
    background: none repeat scroll 0 0 #FCF8E3;
}

.external-event {
    padding: 5px 10px;
    border-radius: 2px;
    cursor: pointer;
    margin-bottom: 5px;
}

.fc-ltr .fc-event-hori.fc-event-end,
.fc-rtl .fc-event-hori.fc-event-start {
    border-radius: 2px;
}

.fc-event,
.fc-agenda .fc-event-time,
.fc-event a {
    padding: 4px 6px;
    background-color: #1ab394;
    /* background color */
    border-color: #1ab394;
    /* border color */
}

.fc-event-time,
.fc-event-title {
    color: #717171;
    padding: 0 1px;
}

.ui-calendar .fc-event-time,
.ui-calendar .fc-event-title {
    color: #fff;
}


/* Chat */

.chat-activity-list .chat-element {
    border-bottom: 1px solid #e7eaec;
}

.chat-element:first-child {
    margin-top: 0;
}

.chat-element {
    padding-bottom: 15px;
}

.chat-element,
.chat-element .media {
    margin-top: 15px;
}

.chat-element,
.media-body {
    overflow: hidden;
}

.media-body {
    display: block;
    width: auto;
}

.chat-element > .pull-left {
    margin-right: 10px;
}

.chat-element img.img-circle,
.dropdown-messages-box img.img-circle {
    width: 38px;
    height: 38px;
}

.chat-element .well {
    border: 1px solid #e7eaec;
    box-shadow: none;
    margin-top: 10px;
    margin-bottom: 5px;
    padding: 10px 20px;
    font-size: 11px;
    line-height: 16px;
}

.chat-element .actions {
    margin-top: 10px;
}

.chat-element .photos {
    margin: 10px 0;
}

.right.chat-element > .pull-right {
    margin-left: 10px;
}

.chat-photo {
    max-height: 180px;
    border-radius: 4px;
    overflow: hidden;
    margin-right: 10px;
    margin-bottom: 10px;
}

.chat {
    margin: 0;
    padding: 0;
    list-style: none;
}

.chat li {
    margin-bottom: 10px;
    padding-bottom: 5px;
    border-bottom: 1px dotted #B3A9A9;
}

.chat li.left .chat-body {
    margin-left: 60px;
}

.chat li.right .chat-body {
    margin-right: 60px;
}

.chat li .chat-body p {
    margin: 0;
    color: #777777;
}

.panel .slidedown .glyphicon,
.chat .glyphicon {
    margin-right: 5px;
}

.chat-panel .panel-body {
    height: 350px;
    overflow-y: scroll;
}


/* LIST GROUP */

a.list-group-item.active,
a.list-group-item.active:hover,
a.list-group-item.active:focus {
    background-color: #1ab394;
    border-color: #1ab394;
    color: #FFFFFF;
    z-index: 2;
}

.list-group-item-heading {
    margin-top: 10px;
}

.list-group-item-text {
    margin: 0 0 10px;
    color: inherit;
    font-size: 12px;
    line-height: inherit;
}

.no-padding .list-group-item {
    border-left: none;
    border-right: none;
    border-bottom: none;
}

.no-padding .list-group-item:first-child {
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-top: none;
}

.no-padding .list-group {
    margin-bottom: 0;
}

.list-group-item {
    background-color: inherit;
    border: 1px solid #e7eaec;
    display: block;
    margin-bottom: -1px;
    padding: 10px 15px;
    position: relative;
}

.elements-list .list-group-item {
    border-left: none;
    border-right: none;
    /*border-top: none;*/
    padding: 15px 25px;
}

.elements-list .list-group-item:first-child {
    border-left: none;
    border-right: none;
    border-top: none !important;
}

.elements-list .list-group {
    margin-bottom: 0;
}

.elements-list a {
    color: inherit;
}

.elements-list .list-group-item.active,
.elements-list .list-group-item:hover {
    background: #f3f3f4;
    color: inherit;
    border-color: #e7eaec;
    /*border-bottom: 1px solid #e7eaec;*/
    /*border-top: 1px solid #e7eaec;*/
    border-radius: 0;
}

.elements-list li.active {
    -webkit-transition: none;
    transition: none;
}

.element-detail-box {
    padding: 25px;
}


/* FLOT CHART  */

.flot-chart {
    display: block;
    height: 200px;
}

.widget .flot-chart.dashboard-chart {
    display: block;
    height: 120px;
    margin-top: 40px;
}

.flot-chart.dashboard-chart {
    display: block;
    height: 180px;
    margin-top: 40px;
}

.flot-chart-content {
    width: 100%;
    height: 100%;
}

.flot-chart-pie-content {
    width: 200px;
    height: 200px;
    margin: auto;
}

.jqstooltip {
    position: absolute;
    display: block;
    left: 0px;
    top: 0px;
    visibility: hidden;
    background: #2b303a;
    background-color: rgba(43, 48, 58, 0.8);
    color: white;
    text-align: left;
    white-space: nowrap;
    z-index: 10000;
    padding: 5px 5px 5px 5px;
    min-height: 22px;
    border-radius: 3px;
}

.jqsfield {
    color: white;
    text-align: left;
}

.h-200 {
    min-height: 200px;
}

.legendLabel {
    padding-left: 5px;
}

.stat-list li:first-child {
    margin-top: 0;
}

.stat-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.stat-percent {
    float: right;
}

.stat-list li {
    margin-top: 15px;
    position: relative;
}


/* DATATABLES */

table.dataTable thead .sorting,
table.dataTable thead .sorting_asc:after,
table.dataTable thead .sorting_desc,
table.dataTable thead .sorting_asc_disabled,
table.dataTable thead .sorting_desc_disabled {
    background: transparent;
}

table.dataTable thead .sorting_asc:after {
    float: right;
    font-family: fontawesome;
}

table.dataTable thead .sorting_desc:after {
    content: "\\f0dd";
    float: right;
    font-family: fontawesome;
}

table.dataTable thead .sorting:after {
    content: "\\f0dc";
    float: right;
    font-family: fontawesome;
    color: rgba(50, 50, 50, 0.5);
}

.dataTables_wrapper {
    padding-bottom: 30px;
}


/* CIRCLE */

.img-circle {
    border-radius: 50%;
}

.btn-circle {
    width: 30px;
    height: 30px;
    padding: 6px 0;
    border-radius: 15px;
    text-align: center;
    font-size: 12px;
    line-height: 1.428571429;
}

.btn-circle.btn-lg {
    width: 50px;
    height: 50px;
    padding: 10px 16px;
    border-radius: 25px;
    font-size: 18px;
    line-height: 1.33;
}

.btn-circle.btn-xl {
    width: 70px;
    height: 70px;
    padding: 10px 16px;
    border-radius: 35px;
    font-size: 24px;
    line-height: 1.33;
}

.show-grid [class^="col-"] {
    padding-top: 10px;
    padding-bottom: 10px;
    border: 1px solid #ddd;
    background-color: #eee !important;
}

.show-grid {
    margin: 15px 0;
}


/* ANIMATION */

.css-animation-box h1 {
    font-size: 44px;
}

.animation-efect-links a {
    padding: 4px 6px;
    font-size: 12px;
}

#animation_box {
    background-color: #f9f8f8;
    border-radius: 16px;
    width: 80%;
    margin: 0 auto;
    padding-top: 80px;
}

.animation-text-box {
    position: absolute;
    margin-top: 40px;
    left: 50%;
    margin-left: -100px;
    width: 200px;
}

.animation-text-info {
    position: absolute;
    margin-top: -60px;
    left: 50%;
    margin-left: -100px;
    width: 200px;
    font-size: 10px;
}

.animation-text-box h2 {
    font-size: 54px;
    font-weight: 600;
    margin-bottom: 5px;
}

.animation-text-box p {
    font-size: 12px;
    text-transform: uppercase;
}


/* PEACE */

.pace {
    -webkit-pointer-events: none;
    pointer-events: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.pace-inactive {
    display: none;
}

.pace .pace-progress {
    background: #1ab394;
    position: fixed;
    z-index: 2000;
    top: 0;
    width: 100%;
    height: 2px;
}

.pace-inactive {
    display: none;
}


/* WIDGETS */

.widget {
    border-radius: 5px;
    padding: 15px 20px;
    margin-bottom: 10px;
    margin-top: 10px;
}

.widget.style1 h2 {
    font-size: 30px;
}

.widget h2,
.widget h3 {
    margin-top: 5px;
    margin-bottom: 0;
}

.widget-text-box {
    padding: 20px;
    border: 1px solid #e7eaec;
    background: #ffffff;
}

.widget-head-color-box {
    border-radius: 5px 5px 0px 0px;
    margin-top: 10px;
}

.widget .flot-chart {
    height: 100px;
}

.vertical-align div {
    display: inline-block;
    vertical-align: middle;
}

.vertical-align h2,
.vertical-align h3 {
    margin: 0;
}

.todo-list {
    list-style: none outside none;
    margin: 0;
    padding: 0;
    font-size: 14px;
}

.todo-list.small-list {
    font-size: 12px;
}

.todo-list.small-list > li {
    background: #f3f3f4;
    border-left: none;
    border-right: none;
    border-radius: 4px;
    color: inherit;
    margin-bottom: 2px;
    padding: 6px 6px 6px 12px;
}

.todo-list.small-list .btn-xs,
.todo-list.small-list .btn-group-xs > .btn {
    border-radius: 5px;
    font-size: 10px;
    line-height: 1.5;
    padding: 1px 2px 1px 5px;
}

.todo-list > li {
    background: #f3f3f4;
    border-left: 6px solid #e7eaec;
    border-right: 6px solid #e7eaec;
    border-radius: 4px;
    color: inherit;
    margin-bottom: 2px;
    padding: 10px;
}

.todo-list .handle {
    cursor: move;
    display: inline-block;
    font-size: 16px;
    margin: 0 5px;
}

.todo-list > li .label {
    font-size: 9px;
    margin-left: 10px;
}

.check-link {
    font-size: 16px;
}

.todo-completed {
    text-decoration: line-through;
}

.geo-statistic h1 {
    font-size: 36px;
    margin-bottom: 0;
}

.glyphicon.fa {
    font-family: "FontAwesome";
}


/* INPUTS */

.inline {
    display: inline-block !important;
}

.input-s-sm {
    width: 120px;
}

.input-s {
    width: 200px;
}

.input-s-lg {
    width: 250px;
}

.i-checks {
    padding-left: 0;
}

.form-control,
.single-line {
    background-color: #FFFFFF;
    background-image: none;
    border: 1px solid #e5e6e7;
    border-radius: 1px;
    color: inherit;
    display: block;
    padding: 6px 12px;
    -webkit-transition: border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s;
    transition: border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s;
    width: 100%;
    font-size: 14px;
}

.form-control:focus,
.single-line:focus {
    border-color: #1ab394 !important;
}

.has-success .form-control {
    border-color: #1ab394;
}

.has-warning .form-control {
    border-color: #f8ac59;
}

.has-error .form-control {
    border-color: #ed5565;
}

.has-success .control-label {
    color: #1ab394;
}

.has-warning .control-label {
    color: #f8ac59;
}

.has-error .control-label {
    color: #ed5565;
}

.input-group-addon {
    background-color: #fff;
    border: 1px solid #E5E6E7;
    border-radius: 1px;
    color: inherit;
    font-size: 14px;
    font-weight: 400;
    line-height: 1;
    padding: 6px 12px;
    text-align: center;
}

.spinner-buttons.input-group-btn .btn-xs {
    line-height: 1.13;
}

.spinner-buttons.input-group-btn {
    width: 20%;
}

.noUi-connect {
    background: none repeat scroll 0 0 #1ab394;
    box-shadow: none;
}

.slider_red .noUi-connect {
    background: none repeat scroll 0 0 #ed5565;
    box-shadow: none;
}


/* UI Sortable */

.ui-sortable .ibox-title {
    cursor: move;
}

.ui-sortable-placeholder {
    border: 1px dashed #cecece !important;
    visibility: visible !important;
    background: #e7eaec;
}

.ibox.ui-sortable-placeholder {
    margin: 0px 0px 23px !important;
}


/* Tabs */

.tabs-container .panel-body {
    background: #fff;
    border: 1px solid #e7eaec;
    border-radius: 2px;
    padding: 20px;
    position: relative;
}

.tabs-container .nav-tabs > li.active > a,
.tabs-container .nav-tabs > li.active > a:hover,
.tabs-container .nav-tabs > li.active > a:focus {
    border: 1px solid #e7eaec;
    border-bottom-color: transparent;
    background-color: #fff;
}

.tabs-container .nav-tabs > li {
    float: left;
    margin-bottom: -1px;
}

.tabs-container .tab-pane .panel-body {
    border-top: none;
}

.tabs-container .nav-tabs > li.active > a,
.tabs-container .nav-tabs > li.active > a:hover,
.tabs-container .nav-tabs > li.active > a:focus {
    border: 1px solid #e7eaec;
    border-bottom-color: transparent;
}

.tabs-container .nav-tabs {
    border-bottom: 1px solid #e7eaec;
}

.tabs-container .tab-pane .panel-body {
    border-top: none;
}

.tabs-container .tabs-left .tab-pane .panel-body,
.tabs-container .tabs-right .tab-pane .panel-body {
    border-top: 1px solid #e7eaec;
}

.tabs-container .nav-tabs > li a:hover {
    background: transparent;
    border-color: transparent;
}

.tabs-container .tabs-below > .nav-tabs,
.tabs-container .tabs-right > .nav-tabs,
.tabs-container .tabs-left > .nav-tabs {
    border-bottom: 0;
}

.tabs-container .tabs-left .panel-body {
    position: static;
}

.tabs-container .tabs-left > .nav-tabs,
.tabs-container .tabs-right > .nav-tabs {
    width: 20%;
}

.tabs-container .tabs-left .panel-body {
    width: 80%;
    margin-left: 20%;
}

.tabs-container .tabs-right .panel-body {
    width: 80%;
    margin-right: 20%;
}

.tabs-container .tab-content > .tab-pane,
.tabs-container .pill-content > .pill-pane {
    display: none;
}

.tabs-container .tab-content > .active,
.tabs-container .pill-content > .active {
    display: block;
}

.tabs-container .tabs-below > .nav-tabs {
    border-top: 1px solid #e7eaec;
}

.tabs-container .tabs-below > .nav-tabs > li {
    margin-top: -1px;
    margin-bottom: 0;
}

.tabs-container .tabs-below > .nav-tabs > li > a {
    border-radius: 0 0 4px 4px;
}

.tabs-container .tabs-below > .nav-tabs > li > a:hover,
.tabs-container .tabs-below > .nav-tabs > li > a:focus {
    border-top-color: #e7eaec;
    border-bottom-color: transparent;
}

.tabs-container .tabs-left > .nav-tabs > li,
.tabs-container .tabs-right > .nav-tabs > li {
    float: none;
}

.tabs-container .tabs-left > .nav-tabs > li > a,
.tabs-container .tabs-right > .nav-tabs > li > a {
    min-width: 74px;
    margin-right: 0;
    margin-bottom: 3px;
}

.tabs-container .tabs-left > .nav-tabs {
    float: left;
    margin-right: 19px;
}

.tabs-container .tabs-left > .nav-tabs > li > a {
    margin-right: -1px;
    border-radius: 4px 0 0 4px;
}

.tabs-container .tabs-left > .nav-tabs .active > a,
.tabs-container .tabs-left > .nav-tabs .active > a:hover,
.tabs-container .tabs-left > .nav-tabs .active > a:focus {
    border-color: #e7eaec transparent #e7eaec #e7eaec;
    *border-right-color: #ffffff;
}

.tabs-container .tabs-right > .nav-tabs {
    float: right;
    margin-left: 19px;
}

.tabs-container .tabs-right > .nav-tabs > li > a {
    margin-left: -1px;
    border-radius: 0 4px 4px 0;
}

.tabs-container .tabs-right > .nav-tabs .active > a,
.tabs-container .tabs-right > .nav-tabs .active > a:hover,
.tabs-container .tabs-right > .nav-tabs .active > a:focus {
    border-color: #e7eaec #e7eaec #e7eaec transparent;
    *border-left-color: #ffffff;
    z-index: 1;
}


/* SWITCHES */

.onoffswitch {
    position: relative;
    width: 54px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

.onoffswitch-checkbox {
    display: none;
}

.onoffswitch-label {
    display: block;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid #1AB394;
    border-radius: 3px;
}

.onoffswitch-inner {
    display: block;
    width: 200%;
    margin-left: -100%;
    -webkit-transition: margin 0.3s ease-in 0s;
    transition: margin 0.3s ease-in 0s;
}

.onoffswitch-inner:before,
.onoffswitch-inner:after {
    display: block;
    float: left;
    width: 50%;
    height: 16px;
    padding: 0;
    line-height: 16px;
    font-size: 10px;
    color: white;
    font-family: Trebuchet, Arial, sans-serif;
    font-weight: bold;
    box-sizing: border-box;
}

.onoffswitch-inner:before {
    content: "ON";
    padding-left: 7px;
    background-color: #1AB394;
    color: #FFFFFF;
}

.onoffswitch-inner:after {
    content: "OFF";
    padding-right: 7px;
    background-color: #FFFFFF;
    color: #919191;
    text-align: right;
}

.onoffswitch-switch {
    display: block;
    width: 18px;
    margin: 0px;
    background: #FFFFFF;
    border: 2px solid #1AB394;
    border-radius: 3px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 36px;
    -webkit-transition: all 0.3s ease-in 0s;
    transition: all 0.3s ease-in 0s;
}

.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner {
    margin-left: 0;
}

.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch {
    right: 0px;
}


/* Nestable list */

.dd {
    position: relative;
    display: block;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 13px;
    line-height: 20px;
}

.dd-list {
    display: block;
    position: relative;
    margin: 0;
    padding: 0;
    list-style: none;
}

.dd-list .dd-list {
    padding-left: 30px;
}

.dd-collapsed .dd-list {
    display: none;
}

.dd-item,
.dd-empty,
.dd-placeholder {
    display: block;
    position: relative;
    margin: 0;
    padding: 0;
    min-height: 20px;
    font-size: 13px;
    line-height: 20px;
}

.dd-handle {
    display: block;
    margin: 5px 0;
    padding: 5px 10px;
    color: #333;
    text-decoration: none;
    border: 1px solid #e7eaec;
    background: #f5f5f5;
    border-radius: 3px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
}

.dd-handle span {
    font-weight: bold;
}

.dd-handle:hover {
    background: #f0f0f0;
    cursor: pointer;
    font-weight: bold;
}

.dd-item > button {
    display: block;
    position: relative;
    cursor: pointer;
    float: left;
    width: 25px;
    height: 20px;
    margin: 5px 0;
    padding: 0;
    text-indent: 100%;
    white-space: nowrap;
    overflow: hidden;
    border: 0;
    background: transparent;
    font-size: 12px;
    line-height: 1;
    text-align: center;
    font-weight: bold;
}

.dd-item > button:before {
    content: '+';
    display: block;
    position: absolute;
    width: 100%;
    text-align: center;
    text-indent: 0;
}

.dd-item > button[data-action="collapse"]:before {
    content: '-';
}

#nestable2 .dd-item > button {
    font-family: FontAwesome;
    height: 34px;
    width: 33px;
    color: #c1c1c1;
}

#nestable2 .dd-item > button:before {
    content: "\\f067";
}

#nestable2 .dd-item > button[data-action="collapse"]:before {
    content: "\\f068";
}

.dd-placeholder,
.dd-empty {
    margin: 5px 0;
    padding: 0;
    min-height: 30px;
    background: #f2fbff;
    border: 1px dashed #b6bcbf;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
}

.dd-empty {
    border: 1px dashed #bbb;
    min-height: 100px;
    background-color: #e5e5e5;
    background-image: -webkit-linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff), -webkit-linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff);
    background-image: linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff), linear-gradient(45deg, #ffffff 25%, transparent 25%, transparent 75%, #ffffff 75%, #ffffff);
    background-size: 60px 60px;
    background-position: 0 0, 30px 30px;
}

.dd-dragel {
    position: absolute;
    z-index: 9999;
    pointer-events: none;
}

.dd-dragel > .dd-item .dd-handle {
    margin-top: 0;
}

.dd-dragel .dd-handle {
    box-shadow: 2px 4px 6px 0 rgba(0, 0, 0, 0.1);
}


/**
* Nestable Extras
*/

.nestable-lists {
    display: block;
    clear: both;
    padding: 30px 0;
    width: 100%;
    border: 0;
    border-top: 2px solid #ddd;
    border-bottom: 2px solid #ddd;
}

#nestable-menu {
    padding: 0;
    margin: 10px 0 20px 0;
}

#nestable-output,
#nestable2-output {
    width: 100%;
    font-size: 0.75em;
    line-height: 1.333333em;
    font-family: lucida grande, lucida sans unicode, helvetica, arial, sans-serif;
    padding: 5px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
}

#nestable2 .dd-handle {
    color: inherit;
    border: 1px dashed #e7eaec;
    background: #f3f3f4;
    padding: 10px;
}

#nestable2 .dd-handle:hover {
    /*background: #bbb;*/
}

#nestable2 span.label {
    margin-right: 10px;
}

#nestable-output,
#nestable2-output {
    font-size: 12px;
    padding: 25px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
}


/* CodeMirror */

.CodeMirror {
    border: 1px solid #eee;
    height: auto;
}

.CodeMirror-scroll {
    overflow-y: hidden;
    overflow-x: auto;
}


/* Google Maps */

.google-map {
    height: 300px;
}


/* Validation */

label.error {
    color: #cc5965;
    display: inline-block;
    margin-left: 5px;
}

.form-control.error {
    border: 1px dotted #cc5965;
}


/* ngGrid */

.gridStyle {
    border: 1px solid #d4d4d4;
    width: 100%;
    height: 400px;
}

.gridStyle2 {
    border: 1px solid #d4d4d4;
    width: 500px;
    height: 300px;
}

.ngH eaderCell {
    border-right: none;
    border-bottom: 1px solid #e7eaec;
}

.ngCell {
    border-right: none;
}

.ngTopPanel {
    background: #F5F5F6;
}

.ngRow.even {
    background: #f9f9f9;
}

.ngRow.selected {
    background: #EBF2F1;
}

.ngRow {
    border-bottom: 1px solid #e7eaec;
}

.ngCell {
    background-color: transparent;
}

.ngHeaderCell {
    border-right: none;
}


/* Toastr custom style */

#toast-container > .toast {
    background-image: none !important;
}

#toast-container > .toast:before {
    position: fixed;
    font-family: FontAwesome;
    font-size: 24px;
    line-height: 24px;
    float: left;
    color: #FFF;
    padding-right: 0.5em;
    margin: auto 0.5em auto -1.5em;
}

#toast-container > div {
    box-shadow: 0 0 3px #999;
    opacity: .9;
    -ms-filter: alpha(opacity=90);
    filter: alpha(opacity=90);
}

#toast-container >:hover {
    box-shadow: 0 0 4px #999;
    opacity: 1;
    -ms-filter: alpha(opacity=100);
    filter: alpha(opacity=100);
    cursor: pointer;
}

.toast {
    background-color: #1ab394;
}

.toast-success {
    background-color: #1ab394;
}

.toast-error {
    background-color: #ed5565;
}

.toast-info {
    background-color: #23c6c8;
}

.toast-warning {
    background-color: #f8ac59;
}

.toast-top-full-width {
    margin-top: 20px;
}

.toast-bottom-full-width {
    margin-bottom: 20px;
}


/* Image cropper style */

.img-container,
.img-preview {
    overflow: hidden;
    text-align: center;
    width: 100%;
}

.img-preview-sm {
    height: 130px;
    width: 200px;
}


/* Forum styles  */

.forum-post-container .media {
    margin: 10px 10px 10px 10px;
    padding: 20px 10px 20px 10px;
    border-bottom: 1px solid #f1f1f1;
}

.forum-avatar {
    float: left;
    margin-right: 20px;
    text-align: center;
    width: 110px;
}

.forum-avatar .img-circle {
    height: 48px;
    width: 48px;
}

.author-info {
    color: #676a6c;
    font-size: 11px;
    margin-top: 5px;
    text-align: center;
}

.forum-post-info {
    padding: 9px 12px 6px 12px;
    background: #f9f9f9;
    border: 1px solid #f1f1f1;
}

.media-body > .media {
    background: #f9f9f9;
    border-radius: 3px;
    border: 1px solid #f1f1f1;
}

.forum-post-container .media-body .photos {
    margin: 10px 0;
}

.forum-photo {
    max-width: 140px;
    border-radius: 3px;
}

.media-body > .media .forum-avatar {
    width: 70px;
    margin-right: 10px;
}

.media-body > .media .forum-avatar .img-circle {
    height: 38px;
    width: 38px;
}

.mid-icon {
    font-size: 66px;
}

.forum-item {
    margin: 10px 0;
    padding: 10px 0 20px;
    border-bottom: 1px solid #f1f1f1;
}

.views-number {
    font-size: 24px;
    line-height: 18px;
    font-weight: 400;
}

.forum-container,
.forum-post-container {
    padding: 30px !important;
}

.forum-item small {
    color: #999;
}

.forum-item .forum-sub-title {
    color: #999;
    margin-left: 50px;
}

.forum-title {
    margin: 15px 0 15px 0;
}

.forum-info {
    text-align: center;
}

.forum-desc {
    color: #999;
}

.forum-icon {
    float: left;
    width: 30px;
    margin-right: 20px;
    text-align: center;
}

a.forum-item-title {
    color: inherit;
    display: block;
    font-size: 18px;
    font-weight: 600;
}

a.forum-item-title:hover {
    color: inherit;
}

.forum-icon .fa {
    font-size: 30px;
    margin-top: 8px;
    color: #9b9b9b;
}

.forum-item.active .fa {
    color: #1ab394;
}

.forum-item.active a.forum-item-title {
    color: #1ab394;
}

@media (max-width: 992px) {
    .forum-info {
        margin: 15px 0 10px 0px;
        /* Comment this is you want to show forum info in small devices */
        display: none;
    }
    .forum-desc {
        float: none !important;
    }
}


/* New Timeline style */

.vertical-container {
    /* this class is used to give a max-width to the element it is applied to, and center it horizontally when it reaches that max-width */
    width: 90%;
    max-width: 1170px;
    margin: 0 auto;
}

.vertical-container::after {
    /* clearfix */
    content: '';
    display: table;
    clear: both;
}

#vertical-timeline {
    position: relative;
    padding: 0;
    margin-top: 2em;
    margin-bottom: 2em;
}

#vertical-timeline::before {
    content: '';
    position: absolute;
    top: 0;
    left: 18px;
    height: 100%;
    width: 4px;
    background: #f1f1f1;
}

.vertical-timeline-content .btn {
    float: right;
}

#vertical-timeline.light-timeline:before {
    background: #e7eaec;
}

.dark-timeline .vertical-timeline-content:before {
    border-color: transparent #f5f5f5 transparent transparent;
}

.dark-timeline.center-orientation .vertical-timeline-content:before {
    border-color: transparent transparent transparent #f5f5f5;
}

.dark-timeline .vertical-timeline-block:nth-child(2n) .vertical-timeline-content:before,
.dark-timeline.center-orientation .vertical-timeline-block:nth-child(2n) .vertical-timeline-content:before {
    border-color: transparent #f5f5f5 transparent transparent;
}

.dark-timeline .vertical-timeline-content,
.dark-timeline.center-orientation .vertical-timeline-content {
    background: #f5f5f5;
}

@media only screen and (min-width: 1170px) {
    #vertical-timeline.center-orientation {
        margin-top: 3em;
        margin-bottom: 3em;
    }
    #vertical-timeline.center-orientation:before {
        left: 50%;
        margin-left: -2px;
    }
}

@media only screen and (max-width: 1170px) {
    .center-orientation.dark-timeline .vertical-timeline-content:before {
        border-color: transparent #f5f5f5 transparent transparent;
    }
}

.vertical-timeline-block {
    position: relative;
    margin: 2em 0;
}

.vertical-timeline-block:after {
    content: "";
    display: table;
    clear: both;
}

.vertical-timeline-block:first-child {
    margin-top: 0;
}

.vertical-timeline-block:last-child {
    margin-bottom: 0;
}

@media only screen and (min-width: 1170px) {
    .center-orientation .vertical-timeline-block {
        margin: 4em 0;
    }
    .center-orientation .vertical-timeline-block:first-child {
        margin-top: 0;
    }
    .center-orientation .vertical-timeline-block:last-child {
        margin-bottom: 0;
    }
}

.vertical-timeline-icon {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 16px;
    border: 3px solid #f1f1f1;
    text-align: center;
}

.vertical-timeline-icon i {
    display: block;
    width: 24px;
    height: 24px;
    position: relative;
    left: 50%;
    top: 50%;
    margin-left: -12px;
    margin-top: -9px;
}

@media only screen and (min-width: 1170px) {
    .center-orientation .vertical-timeline-icon {
        width: 50px;
        height: 50px;
        left: 50%;
        margin-left: -25px;
        -webkit-transform: translateZ(0);
        -webkit-backface-visibility: hidden;
        font-size: 19px;
    }
    .center-orientation .vertical-timeline-icon i {
        margin-left: -12px;
        margin-top: -10px;
    }
    .center-orientation .cssanimations .vertical-timeline-icon.is-hidden {
        visibility: hidden;
    }
}

.vertical-timeline-content {
    position: relative;
    margin-left: 60px;
    background: white;
    border-radius: 0.25em;
    padding: 1em;
}

.vertical-timeline-content:after {
    content: "";
    display: table;
    clear: both;
}

.vertical-timeline-content h2 {
    font-weight: 400;
    margin-top: 4px;
}

.vertical-timeline-content p {
    margin: 1em 0;
    line-height: 1.6;
}

.vertical-timeline-content .vertical-date {
    float: left;
    font-weight: 500;
}

.vertical-date small {
    color: #1ab394;
    font-weight: 400;
}

.vertical-timeline-content::before {
    content: '';
    position: absolute;
    top: 16px;
    right: 100%;
    height: 0;
    width: 0;
    border: 7px solid transparent;
    border-right: 7px solid white;
}

@media only screen and (min-width: 768px) {
    .vertical-timeline-content h2 {
        font-size: 18px;
    }
    .vertical-timeline-content p {
        font-size: 13px;
    }
}

@media only screen and (min-width: 1170px) {
    .center-orientation .vertical-timeline-content {
        margin-left: 0;
        padding: 1.6em;
        width: 45%;
    }
    .center-orientation .vertical-timeline-content::before {
        top: 24px;
        left: 100%;
        border-color: transparent;
        border-left-color: white;
    }
    .center-orientation .vertical-timeline-content .btn {
        float: left;
    }
    .center-orientation .vertical-timeline-content .vertical-date {
        position: absolute;
        width: 100%;
        left: 122%;
        top: 2px;
        font-size: 14px;
    }
    .center-orientation .vertical-timeline-block:nth-child(even) .vertical-timeline-content {
        float: right;
    }
    .center-orientation .vertical-timeline-block:nth-child(even) .vertical-timeline-content::before {
        top: 24px;
        left: auto;
        right: 100%;
        border-color: transparent;
        border-right-color: white;
    }
    .center-orientation .vertical-timeline-block:nth-child(even) .vertical-timeline-content .btn {
        float: right;
    }
    .center-orientation .vertical-timeline-block:nth-child(even) .vertical-timeline-content .vertical-date {
        left: auto;
        right: 122%;
        text-align: right;
    }
    .center-orientation .cssanimations .vertical-timeline-content.is-hidden {
        visibility: hidden;
    }
}

.sidebard-panel {
    width: 220px;
    background: #ebebed;
    padding: 10px 20px;
    position: absolute;
    right: 0;
}

.sidebard-panel .feed-element img.img-circle {
    width: 32px;
    height: 32px;
}

.sidebard-panel .feed-element,
.media-body,
.sidebard-panel p {
    font-size: 12px;
}

.sidebard-panel .feed-element {
    margin-top: 20px;
    padding-bottom: 0;
}

.sidebard-panel .list-group {
    margin-bottom: 10px;
}

.sidebard-panel .list-group .list-group-item {
    padding: 5px 0;
    font-size: 12px;
    border: 0;
}

.sidebar-content .wrapper,
.wrapper.sidebar-content {
    padding-right: 240px !important;
}

#right-sidebar {
    background-color: #fff;
    border-left: 1px solid #e7eaec;
    border-top: 1px solid #e7eaec;
    overflow: hidden;
    position: fixed;
    top: 60px;
    width: 260px !important;
    z-index: 1009;
    bottom: 0;
    right: -260px;
}

#right-sidebar.sidebar-open {
    right: 0;
}

#right-sidebar.sidebar-open.sidebar-top {
    top: 0;
    border-top: none;
}

.sidebar-container ul.nav-tabs {
    border: none;
}

.sidebar-container ul.nav-tabs.navs-4 li {
    width: 25%;
}

.sidebar-container ul.nav-tabs.navs-3 li {
    width: 33.3333%;
}

.sidebar-container ul.nav-tabs.navs-2 li {
    width: 50%;
}

.sidebar-container ul.nav-tabs li {
    border: none;
}

.sidebar-container ul.nav-tabs li a {
    border: none;
    padding: 12px 10px;
    margin: 0;
    border-radius: 0;
    background: #2f4050;
    color: #fff;
    text-align: center;
    border-right: 1px solid #334556;
}

.sidebar-container ul.nav-tabs li.active a {
    border: none;
    background: #f9f9f9;
    color: #676a6c;
    font-weight: bold;
}

.sidebar-container .nav-tabs > li.active > a:hover,
.sidebar-container .nav-tabs > li.active > a:focus {
    border: none;
}

.sidebar-container ul.sidebar-list {
    margin: 0;
    padding: 0;
}

.sidebar-container ul.sidebar-list li {
    border-bottom: 1px solid #e7eaec;
    padding: 15px 20px;
    list-style: none;
    font-size: 12px;
}

.sidebar-container .sidebar-message:nth-child(2n+2) {
    background: #f9f9f9;
}

.sidebar-container ul.sidebar-list li a {
    text-decoration: none;
    color: inherit;
}

.sidebar-container .sidebar-content {
    padding: 15px 20px;
    font-size: 12px;
}

.sidebar-container .sidebar-title {
    background: #f9f9f9;
    padding: 20px;
    border-bottom: 1px solid #e7eaec;
}

.sidebar-container .sidebar-title h3 {
    margin-bottom: 3px;
    padding-left: 2px;
}

.sidebar-container .tab-content h4 {
    margin-bottom: 5px;
}

.sidebar-container .sidebar-message > a > .pull-left {
    margin-right: 10px;
}

.sidebar-container .sidebar-message > a {
    text-decoration: none;
    color: inherit;
}

.sidebar-container .sidebar-message {
    padding: 15px 20px;
}

.sidebar-container .sidebar-message .message-avatar {
    height: 38px;
    width: 38px;
    border-radius: 50%;
}

.sidebar-container .setings-item {
    padding: 15px 20px;
    border-bottom: 1px solid #e7eaec;
}

body {
    font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 13px;
    color: #676a6c;
    overflow-x: hidden;
}

html,
body {
    height: 100%;
}

body.full-height-layout #wrapper,
body.full-height-layout #page-wrapper {
    height: 100%;
}

#page-wrapper {
    min-height: auto;
}

body.boxed-layout {
    background: url('patterns/shattered.png');
}

body.boxed-layout #wrapper {
    background-color: #2f4050;
    max-width: 1200px;
    margin: 0 auto;
}

.top-navigation.boxed-layout #wrapper,
.boxed-layout #wrapper.top-navigation {
    max-width: 1300px !important;
}

.block {
    display: block;
}

.clear {
    display: block;
    overflow: hidden;
}

a {
    cursor: pointer;
}

a:hover,
a:focus {
    text-decoration: none;
}

.border-bottom {
    border-bottom: 1px solid #e7eaec !important;
}

.font-bold {
    font-weight: 600;
}

.font-noraml {
    font-weight: 400;
}

.text-uppercase {
    text-transform: uppercase;
}

.b-r {
    border-right: 1px solid #e7eaec;
}

.hr-line-dashed {
    border-top: 1px dashed #e7eaec;
    color: #ffffff;
    background-color: #ffffff;
    height: 1px;
    margin: 20px 0;
}

.hr-line-solid {
    border-bottom: 1px solid #e7eaec;
    background-color: rgba(0, 0, 0, 0);
    border-style: solid !important;
    margin-top: 15px;
    margin-bottom: 15px;
}

video {
    width: 100% !important;
    height: auto !important;
}


/* GALLERY */

.gallery > .row > div {
    margin-bottom: 15px;
}

.fancybox img {
    margin-bottom: 5px;
    /* Only for demo */
    width: 24%;
}


/* Summernote text editor  */

.note-editor {
    height: auto!important;
    min-height: 100px;
    border: solid 1px #e5e6e7;
}


/* MODAL */

.modal-content {
    background-clip: padding-box;
    background-color: #FFFFFF;
    border: 1px solid rgba(0, 0, 0, 0);
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    outline: 0 none;
}

.modal-dialog {
    z-index: 1200;
}

.modal-body {
    padding: 20px 30px 30px 30px;
}

.inmodal .modal-body {
    background: #f8fafb;
}

.inmodal .modal-header {
    padding: 30px 15px;
    text-align: center;
}

.animated.modal.fade .modal-dialog {
    -webkit-transform: none;
    -ms-transform: none;
    transform: none;
}

.inmodal .modal-title {
    font-size: 26px;
}

.inmodal .modal-icon {
    font-size: 84px;
    color: #e2e3e3;
}

.modal-footer {
    margin-top: 0;
}


/* WRAPPERS */

#wrapper {
    width: 100%;
    overflow-x: hidden;
    background-color: #2f4050;
}

.wrapper {
    padding: 0 20px;
}

.wrapper-content {
    padding: 20px;
}

#page-wrapper {
    padding: 0 15px;
    position: inherit;
    margin: 0 0 0 220px;
}

.title-action {
    text-align: right;
    padding-top: 30px;
}

.ibox-content h1,
.ibox-content h2,
.ibox-content h3,
.ibox-content h4,
.ibox-content h5,
.ibox-title h1,
.ibox-title h2,
.ibox-title h3,
.ibox-title h4,
.ibox-title h5 {
    margin-top: 5px;
}

ul.unstyled,
ol.unstyled {
    list-style: none outside none;
    margin-left: 0;
}

.big-icon {
    font-size: 160px;
    color: #e5e6e7;
}


/* FOOTER */

.footer {
    background: none repeat scroll 0 0 white;
    border-top: 1px solid #e7eaec;
    overflow: hidden;
    padding: 10px 20px;
    margin: 0 -15px;
    height: 36px;
}

.footer.fixed_full {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 10px 20px;
    background: white;
    border-top: 1px solid #e7eaec;
}

.footer.fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 10px 20px;
    background: white;
    border-top: 1px solid #e7eaec;
    margin-left: 220px;
}

body.mini-navbar .footer.fixed,
body.body-small.mini-navbar .footer.fixed {
    margin: 0 0 0 70px;
}

body.mini-navbar.canvas-menu .footer.fixed,
body.canvas-menu .footer.fixed {
    margin: 0 !important;
}

body.fixed-sidebar.body-small.mini-navbar .footer.fixed {
    margin: 0 0 0 220px;
}

body.body-small .footer.fixed {
    margin-left: 0px;
}


/* PANELS */

.page-heading {
    border-top: 0;
    padding: 0px 20px 20px;
}

.panel-heading h1,
.panel-heading h2 {
    margin-bottom: 5px;
}


/*CONTENTTABS*/

.content-tabs {
    position: relative;
    height: 42px;
    background: #fafafa;
    line-height: 40px;
}

.content-tabs .roll-nav,
.page-tabs-list {
    position: absolute;
    width: 40px;
    height: 40px;
    text-align: center;
    color: #999;
    z-index: 2;
    top: 0;
}

.content-tabs .roll-left {
    left: 0;
    border-right: solid 1px #eee;
}

.content-tabs .roll-right {
    right: 0;
    border-left: solid 1px #eee;
}

.content-tabs button {
    background: #fff;
    border: 0;
    height: 40px;
    width: 40px;
    outline: none;
}

.content-tabs button:hover {
    background: #fafafa;
}

nav.page-tabs {
    margin-left: 40px;
    width: 100000px;
    height: 40px;
    overflow: hidden;
}

nav.page-tabs .page-tabs-content {
    float: left;
}

.page-tabs a {
    display: block;
    float: left;
    border-right: solid 1px #eee;
    padding: 0 15px;
}

.page-tabs a i:hover {
    color: #c00;
}

.page-tabs a:hover,
.content-tabs .roll-nav:hover {
    color: #777;
    background: #f2f2f2;
    cursor: pointer;
}

.roll-right.J_tabRight {
    right: 140px;
}

.roll-right.btn-group {
    right: 60px;
    width: 80px;
    padding: 0;
}

.roll-right.btn-group button {
    width: 80px;
}

.roll-right.J_tabExit {
    background: #fff;
    height: 40px;
    width: 60px;
    outline: none;
}

.dropdown-menu-right {
    left: auto;
}

#content-main {
    height: calc(100% - 140px);
    overflow: hidden;
}

.fixed-nav #content-main {
    height: calc(100% - 80px);
    overflow: hidden;
}


/* TABLES */

.table-bordered {
    border: 1px solid #EBEBEB;
}

.table-bordered > thead > tr > th,
.table-bordered > thead > tr > td {
    background-color: #F5F5F6;
    border-bottom-width: 1px;
}

.table-bordered > thead > tr > th,
.table-bordered > tbody > tr > th,
.table-bordered > tfoot > tr > th,
.table-bordered > thead > tr > td,
.table-bordered > tbody > tr > td,
.table-bordered > tfoot > tr > td {
    border: 1px solid #e7e7e7;
}

.table > thead > tr > th {
    border-bottom: 1px solid #DDDDDD;
    vertical-align: bottom;
}

.table > thead > tr > th,
.table > tbody > tr > th,
.table > tfoot > tr > th,
.table > thead > tr > td,
.table > tbody > tr > td,
.table > tfoot > tr > td {
    border-top: 1px solid #e7eaec;
    line-height: 1.42857;
    padding: 8px;
    vertical-align: middle;
}


/* PANELS */

.panel.blank-panel {
    background: none;
    margin: 0;
}

.blank-panel .panel-heading {
    padding-bottom: 0;
}

.nav-tabs > li.active > a,
.nav-tabs > li.active > a:hover,
.nav-tabs > li.active > a:focus {
    -moz-border-bottom-colors: none;
    -moz-border-left-colors: none;
    -moz-border-right-colors: none;
    -moz-border-top-colors: none;
    background: none;
    border-color: #dddddd #dddddd rgba(0, 0, 0, 0);
    border-bottom: #f3f3f4;
    -webkit-border-image: none;
    -o-border-image: none;
    border-image: none;
    border-style: solid;
    border-width: 1px;
    color: #555555;
    cursor: default;
}

.nav.nav-tabs li {
    background: none;
    border: none;
}

.nav-tabs > li > a {
    color: #A7B1C2;
    font-weight: 600;
    padding: 10px 20px 10px 25px;
}

.nav-tabs > li > a:hover,
.nav-tabs > li > a:focus {
    background-color: #e6e6e6;
    color: #676a6c;
}

.ui-tab .tab-content {
    padding: 20px 0px;
}


/* GLOBAL  */

.no-padding {
    padding: 0 !important;
}

.no-borders {
    border: none !important;
}

.no-margins {
    margin: 0 !important;
}

.no-top-border {
    border-top: 0 !important;
}

.ibox-content.text-box {
    padding-bottom: 0px;
    padding-top: 15px;
}

.border-left-right {
    border-left: 1px solid #e7eaec;
    border-right: 1px solid #e7eaec;
    border-top: none;
    border-bottom: none;
}

.border-left {
    border-left: 1px solid #e7eaec;
    border-right: none;
    border-top: none;
    border-bottom: none;
}

.border-right {
    border-left: none;
    border-right: 1px solid #e7eaec;
    border-top: none;
    border-bottom: none;
}

.full-width {
    width: 100% !important;
}

.link-block {
    font-size: 12px;
    padding: 10px;
}

.nav.navbar-top-links .link-block a {
    font-size: 12px;
}

.link-block a {
    font-size: 10px;
    color: inherit;
}

body.mini-navbar .branding {
    display: none;
}

img.circle-border {
    border: 6px solid #FFFFFF;
    border-radius: 50%;
}

.branding {
    float: left;
    color: #FFFFFF;
    font-size: 18px;
    font-weight: 600;
    padding: 17px 20px;
    text-align: center;
    background-color: #1ab394;
}

.login-panel {
    margin-top: 25%;
}

.page-header {
    padding: 20px 0 9px;
    margin: 0 0 20px;
    border-bottom: 1px solid #eeeeee;
}

.fontawesome-icon-list {
    margin-top: 22px;
}

.fontawesome-icon-list .fa-hover a {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    color: #222222;
    line-height: 32px;
    height: 32px;
    padding-left: 10px;
    border-radius: 4px;
}

.fontawesome-icon-list .fa-hover a .fa {
    width: 32px;
    font-size: 14px;
    display: inline-block;
    text-align: right;
    margin-right: 10px;
}

.fontawesome-icon-list .fa-hover a:hover {
    background-color: #1d9d74;
    color: #ffffff;
    text-decoration: none;
}

.fontawesome-icon-list .fa-hover a:hover .fa {
    font-size: 30px;
    vertical-align: -6px;
}

.fontawesome-icon-list .fa-hover a:hover .text-muted {
    color: #bbe2d5;
}

.feature-list .col-md-4 {
    margin-bottom: 22px;
}

.feature-list h4 .fa:before {
    vertical-align: -10%;
    font-size: 28px;
    display: inline-block;
    width: 1.07142857em;
    text-align: center;
    margin-right: 5px;
}

.ui-draggable .ibox-title {
    cursor: move;
}

.breadcrumb {
    background-color: #ffffff;
    padding: 0;
    margin-bottom: 0;
}

.breadcrumb > li a {
    color: inherit;
}

.breadcrumb > .active {
    color: inherit;
}

code {
    background-color: #F9F2F4;
    border-radius: 4px;
    color: #ca4440;
    font-size: 90%;
    padding: 2px 4px;
    white-space: nowrap;
}

.ibox {
    clear: both;
    margin-bottom: 25px;
    margin-top: 0;
    padding: 0;
}

.ibox.collapsed .ibox-content {
    display: none;
}

.ibox.collapsed .fa.fa-chevron-up:before {
    content: "\\f078";
}

.ibox.collapsed .fa.fa-chevron-down:before {
    content: "\\f077";
}

.ibox:after,
.ibox:before {
    display: table;
}

.ibox-title {
    -moz-border-bottom-colors: none;
    -moz-border-left-colors: none;
    -moz-border-right-colors: none;
    -moz-border-top-colors: none;
    background-color: #ffffff;
    border-color: #e7eaec;
    -webkit-border-image: none;
    -o-border-image: none;
    border-image: none;
    border-style: solid solid none;
    border-width: 4px 0px 0;
    color: inherit;
    margin-bottom: 0;
    padding: 14px 15px 7px;
    min-height: 48px;
}

.ibox-content {
    background-color: #ffffff;
    color: inherit;
    padding: 15px 20px 20px 20px;
    border-color: #e7eaec;
    -webkit-border-image: none;
    -o-border-image: none;
    border-image: none;
    border-style: solid solid none;
    border-width: 1px 0px;
}

table.table-mail tr td {
    padding: 12px;
}

.table-mail .check-mail {
    padding-left: 20px;
}

.table-mail .mail-date {
    padding-right: 20px;
}

.star-mail,
.check-mail {
    width: 40px;
}

.unread td a,
.unread td {
    font-weight: 600;
    color: inherit;
}

.read td a,
.read td {
    font-weight: normal;
    color: inherit;
}

.unread td {
    background-color: #f9f8f8;
}

.ibox-content {
    clear: both;
}

.ibox-heading {
    background-color: #f3f6fb;
    border-bottom: none;
}

.ibox-heading h3 {
    font-weight: 200;
    font-size: 24px;
}

.ibox-title h5 {
    display: inline-block;
    font-size: 14px;
    margin: 0 0 7px;
    padding: 0;
    text-overflow: ellipsis;
    float: left;
}

.ibox-title .label {
    float: left;
    margin-left: 4px;
}

.ibox-tools {
    display: inline-block;
    float: right;
    margin-top: 0;
    position: relative;
    padding: 0;
}

.ibox-tools a {
    cursor: pointer;
    margin-left: 5px;
    color: #c4c4c4;
}

.ibox-tools a.btn-primary {
    color: #fff;
}

.ibox-tools .dropdown-menu > li > a {
    padding: 4px 10px;
    font-size: 12px;
}

.ibox .open > .dropdown-menu {
    left: auto;
    right: 0;
}


/* BACKGROUNDS */

.gray-bg {
    background-color: #f3f3f4;
}

.white-bg {
    background-color: #ffffff;
}

.navy-bg {
    background-color: #1ab394;
    color: #ffffff;
}

.blue-bg {
    background-color: #1c84c6;
    color: #ffffff;
}

.lazur-bg {
    background-color: #23c6c8;
    color: #ffffff;
}

.yellow-bg {
    background-color: #f8ac59;
    color: #ffffff;
}

.red-bg {
    background-color: #ed5565;
    color: #ffffff;
}

.black-bg {
    background-color: #262626;
}

.panel-primary {
    border-color: #1ab394;
}

.panel-primary > .panel-heading {
    background-color: #1ab394;
    border-color: #1ab394;
}

.panel-success {
    border-color: #1c84c6;
}

.panel-success > .panel-heading {
    background-color: #1c84c6;
    border-color: #1c84c6;
    color: #ffffff;
}

.panel-info {
    border-color: #23c6c8;
}

.panel-info > .panel-heading {
    background-color: #23c6c8;
    border-color: #23c6c8;
    color: #ffffff;
}

.panel-warning {
    border-color: #f8ac59;
}

.panel-warning > .panel-heading {
    background-color: #f8ac59;
    border-color: #f8ac59;
    color: #ffffff;
}

.panel-danger {
    border-color: #ed5565;
}

.panel-danger > .panel-heading {
    background-color: #ed5565;
    border-color: #ed5565;
    color: #ffffff;
}

.progress-bar {
    background-color: #1ab394;
}

.progress-small,
.progress-small .progress-bar {
    height: 10px;
}

.progress-small,
.progress-mini {
    margin-top: 5px;
}

.progress-mini,
.progress-mini .progress-bar {
    height: 5px;
    margin-bottom: 0px;
}

.progress-bar-navy-light {
    background-color: #3dc7ab;
}

.progress-bar-success {
    background-color: #1c84c6;
}

.progress-bar-info {
    background-color: #23c6c8;
}

.progress-bar-warning {
    background-color: #f8ac59;
}

.progress-bar-danger {
    background-color: #ed5565;
}

.panel-title {
    font-size: inherit;
}

.jumbotron {
    border-radius: 6px;
    padding: 40px;
}

.jumbotron h1 {
    margin-top: 0;
}


/* COLORS */

.text-navy {
    color: #1ab394;
}

.text-primary {
    color: inherit;
}

.text-success {
    color: #1c84c6;
}

.text-info {
    color: #23c6c8;
}

.text-warning {
    color: #f8ac59;
}

.text-danger {
    color: #ed5565;
}

.text-muted {
    color: #888888;
}

.simple_tag {
    background-color: #f3f3f4;
    border: 1px solid #e7eaec;
    border-radius: 2px;
    color: inherit;
    font-size: 10px;
    margin-right: 5px;
    margin-top: 5px;
    padding: 5px 12px;
    display: inline-block;
}

.img-shadow {
    box-shadow: 0px 0px 3px 0px #919191;
}


/* For handle diferent bg color in AngularJS version */

.dashboards\\.dashboard_2 nav.navbar,
.dashboards\\.dashboard_3 nav.navbar,
.mailbox\\.inbox nav.navbar,
.mailbox\\.email_view nav.navbar,
.mailbox\\.email_compose nav.navbar,
.dashboards\\.dashboard_4_1 nav.navbar {
    background: #fff;
}


/* For handle diferent bg color in MVC version */

.Dashboard_2 .navbar.navbar-static-top,
.Dashboard_3 .navbar.navbar-static-top,
.Dashboard_4_1 .navbar.navbar-static-top,
.ComposeEmail .navbar.navbar-static-top,
.EmailView .navbar.navbar-static-top,
.Inbox .navbar.navbar-static-top {
    background: #fff;
}

a.close-canvas-menu {
    position: absolute;
    top: 10px;
    right: 15px;
    z-index: 1011;
    color: #a7b1c2;
}

a.close-canvas-menu:hover {
    color: #fff;
}


/* FULL HEIGHT */

.full-height {
    height: 100%;
}

.fh-breadcrumb {
    height: calc(100% - 196px);
    margin: 0 -15px;
    position: relative;
}

.fh-no-breadcrumb {
    height: calc(100% - 99px);
    margin: 0 -15px;
    position: relative;
}

.fh-column {
    background: #fff;
    height: 100%;
    width: 240px;
    float: left;
}

.modal-backdrop {
    z-index: 2040 !important;
}

.modal {
    z-index: 2050 !important;
}

.spiner-example {
    height: 200px;
    padding-top: 70px;
}


/* MARGINS & PADDINGS */

.p-xxs {
    padding: 5px;
}

.p-xs {
    padding: 10px;
}

.p-sm {
    padding: 15px;
}

.p-m {
    padding: 20px;
}

.p-md {
    padding: 25px;
}

.p-lg {
    padding: 30px;
}

.p-xl {
    padding: 40px;
}

.m-xxs {
    margin: 2px 4px;
}

.m-xs {
    margin: 5px;
}

.m-sm {
    margin: 10px;
}

.m {
    margin: 15px;
}

.m-md {
    margin: 20px;
}

.m-lg {
    margin: 30px;
}

.m-xl {
    margin: 50px;
}

.m-n {
    margin: 0 !important;
}

.m-l-none {
    margin-left: 0;
}

.m-l-xs {
    margin-left: 5px;
}

.m-l-sm {
    margin-left: 10px;
}

.m-l {
    margin-left: 15px;
}

.m-l-md {
    margin-left: 20px;
}

.m-l-lg {
    margin-left: 30px;
}

.m-l-xl {
    margin-left: 40px;
}

.m-l-n-xxs {
    margin-left: -1px;
}

.m-l-n-xs {
    margin-left: -5px;
}

.m-l-n-sm {
    margin-left: -10px;
}

.m-l-n {
    margin-left: -15px;
}

.m-l-n-md {
    margin-left: -20px;
}

.m-l-n-lg {
    margin-left: -30px;
}

.m-l-n-xl {
    margin-left: -40px;
}

.m-t-none {
    margin-top: 0;
}

.m-t-xxs {
    margin-top: 1px;
}

.m-t-xs {
    margin-top: 5px;
}

.m-t-sm {
    margin-top: 10px;
}

.m-t {
    margin-top: 15px;
}

.m-t-md {
    margin-top: 20px;
}

.m-t-lg {
    margin-top: 30px;
}

.m-t-xl {
    margin-top: 40px;
}

.m-t-n-xxs {
    margin-top: -1px;
}

.m-t-n-xs {
    margin-top: -5px;
}

.m-t-n-sm {
    margin-top: -10px;
}

.m-t-n {
    margin-top: -15px;
}

.m-t-n-md {
    margin-top: -20px;
}

.m-t-n-lg {
    margin-top: -30px;
}

.m-t-n-xl {
    margin-top: -40px;
}

.m-r-none {
    margin-right: 0;
}

.m-r-xxs {
    margin-right: 1px;
}

.m-r-xs {
    margin-right: 5px;
}

.m-r-sm {
    margin-right: 10px;
}

.m-r {
    margin-right: 15px;
}

.m-r-md {
    margin-right: 20px;
}

.m-r-lg {
    margin-right: 30px;
}

.m-r-xl {
    margin-right: 40px;
}

.m-r-n-xxs {
    margin-right: -1px;
}

.m-r-n-xs {
    margin-right: -5px;
}

.m-r-n-sm {
    margin-right: -10px;
}

.m-r-n {
    margin-right: -15px;
}

.m-r-n-md {
    margin-right: -20px;
}

.m-r-n-lg {
    margin-right: -30px;
}

.m-r-n-xl {
    margin-right: -40px;
}

.m-b-none {
    margin-bottom: 0;
}

.m-b-xxs {
    margin-bottom: 1px;
}

.m-b-xs {
    margin-bottom: 5px;
}

.m-b-sm {
    margin-bottom: 10px;
}

.m-b {
    margin-bottom: 15px;
}

.m-b-md {
    margin-bottom: 20px;
}

.m-b-lg {
    margin-bottom: 30px;
}

.m-b-xl {
    margin-bottom: 40px;
}

.m-b-n-xxs {
    margin-bottom: -1px;
}

.m-b-n-xs {
    margin-bottom: -5px;
}

.m-b-n-sm {
    margin-bottom: -10px;
}

.m-b-n {
    margin-bottom: -15px;
}

.m-b-n-md {
    margin-bottom: -20px;
}

.m-b-n-lg {
    margin-bottom: -30px;
}

.m-b-n-xl {
    margin-bottom: -40px;
}

.space-15 {
    margin: 15px 0;
}

.space-20 {
    margin: 20px 0;
}

.space-25 {
    margin: 25px 0;
}

.space-30 {
    margin: 30px 0;
}

body.modal-open {
    padding-right: inherit !important;
}


/* SEARCH PAGE */

.search-form {
    margin-top: 10px;
}

.search-result h3 {
    margin-bottom: 0;
    color: #1E0FBE;
}

.search-result .search-link {
    color: #006621;
}

.search-result p {
    font-size: 12px;
    margin-top: 5px;
}


/* CONTACTS */

.contact-box {
    background-color: #ffffff;
    border: 1px solid #e7eaec;
    padding: 20px;
    margin-bottom: 20px;
}

.contact-box a {
    color: inherit;
}


/* INVOICE */

.invoice-table tbody > tr > td:last-child,
.invoice-table tbody > tr > td:nth-child(4),
.invoice-table tbody > tr > td:nth-child(3),
.invoice-table tbody > tr > td:nth-child(2) {
    text-align: right;
}

.invoice-table thead > tr > th:last-child,
.invoice-table thead > tr > th:nth-child(4),
.invoice-table thead > tr > th:nth-child(3),
.invoice-table thead > tr > th:nth-child(2) {
    text-align: right;
}

.invoice-total > tbody > tr > td:first-child {
    text-align: right;
}

.invoice-total > tbody > tr > td {
    border: 0 none;
}

.invoice-total > tbody > tr > td:last-child {
    border-bottom: 1px solid #DDDDDD;
    text-align: right;
    width: 15%;
}


/* ERROR & LOGIN & LOCKSCREEN*/

.middle-box {
    max-width: 400px;
    z-index: 100;
    margin: 0 auto;
    padding-top: 40px;
}

.lockscreen.middle-box {
    width: 200px;
    padding-top: 110px;
}

.loginscreen.middle-box {
    width: 300px;
}

.loginColumns {
    max-width: 800px;
    margin: 0 auto;
    padding: 100px 20px 20px 20px;
}

.passwordBox {
    max-width: 460px;
    margin: 0 auto;
    padding: 100px 20px 20px 20px;
}

.logo-name {
    color: #e6e6e6;
    font-size: 180px;
    font-weight: 800;
    letter-spacing: -10px;
    margin-bottom: 0px;
}

.middle-box h1 {
    font-size: 170px;
}

.wrapper .middle-box {
    margin-top: 140px;
}

.lock-word {
    z-index: 10;
    position: absolute;
    top: 110px;
    left: 50%;
    margin-left: -470px;
}

.lock-word span {
    font-size: 100px;
    font-weight: 600;
    color: #e9e9e9;
    display: inline-block;
}

.lock-word .first-word {
    margin-right: 160px;
}


/* DASBOARD */

.dashboard-header {
    border-top: 0;
    padding: 20px 20px 20px 20px;
}

.dashboard-header h2 {
    margin-top: 10px;
    font-size: 26px;
}

.fist-item {
    border-top: none !important;
}

.statistic-box {
    margin-top: 40px;
}

.dashboard-header .list-group-item span.label {
    margin-right: 10px;
}

.list-group.clear-list .list-group-item {
    border-top: 1px solid #e7eaec;
    border-bottom: 0;
    border-right: 0;
    border-left: 0;
    padding: 10px 0;
}

ul.clear-list:first-child {
    border-top: none !important;
}


/* Intimeline */

.timeline-item .date i {
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px;
    width: 30px;
    text-align: center;
    border-top: 1px solid #e7eaec;
    border-bottom: 1px solid #e7eaec;
    border-left: 1px solid #e7eaec;
    background: #f8f8f8;
}

.timeline-item .date {
    text-align: right;
    width: 110px;
    position: relative;
    padding-top: 30px;
}

.timeline-item .content {
    border-left: 1px solid #e7eaec;
    border-top: 1px solid #e7eaec;
    padding-top: 10px;
    min-height: 100px;
}

.timeline-item .content:hover {
    background: #f6f6f6;
}


/* PIN BOARD */

ul.notes li,
ul.tag-list li {
    list-style: none;
}

ul.notes li h4 {
    margin-top: 20px;
    font-size: 16px;
}

ul.notes li div {
    text-decoration: none;
    color: #000;
    background: #ffc;
    display: block;
    height: 140px;
    width: 140px;
    padding: 1em;
    position: relative;
}

ul.notes li div small {
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 10px;
}

ul.notes li div a {
    position: absolute;
    right: 10px;
    bottom: 10px;
    color: inherit;
}

ul.notes li {
    margin: 10px 40px 50px 0px;
    float: left;
}

ul.notes li div p {
    font-size: 12px;
}

ul.notes li div {
    text-decoration: none;
    color: #000;
    background: #ffc;
    display: block;
    height: 140px;
    width: 140px;
    padding: 1em;
    /* Firefox */
    /* Safari+Chrome */
    /* Opera */
    box-shadow: 5px 5px 2px rgba(33, 33, 33, 0.7);
}

ul.notes li div {
    -webkit-transform: rotate(-6deg);
    -o-transform: rotate(-6deg);
    -moz-transform: rotate(-6deg);
}

ul.notes li:nth-child(even) div {
    -o-transform: rotate(4deg);
    -webkit-transform: rotate(4deg);
    -moz-transform: rotate(4deg);
    position: relative;
    top: 5px;
}

ul.notes li:nth-child(3n) div {
    -o-transform: rotate(-3deg);
    -webkit-transform: rotate(-3deg);
    -moz-transform: rotate(-3deg);
    position: relative;
    top: -5px;
}

ul.notes li:nth-child(5n) div {
    -o-transform: rotate(5deg);
    -webkit-transform: rotate(5deg);
    -moz-transform: rotate(5deg);
    position: relative;
    top: -10px;
}

ul.notes li div:hover,
ul.notes li div:focus {
    -webkit-transform: scale(1.1);
    -moz-transform: scale(1.1);
    -o-transform: scale(1.1);
    position: relative;
    z-index: 5;
}

ul.notes li div {
    text-decoration: none;
    color: #000;
    background: #ffc;
    display: block;
    height: 210px;
    width: 210px;
    padding: 1em;
    box-shadow: 5px 5px 7px rgba(33, 33, 33, 0.7);
    -webkit-transition: -webkit-transform 0.15s linear;
}


/* FILE MANAGER */

.file-box {
    float: left;
    width: 220px;
}

.file-manager h5 {
    text-transform: uppercase;
}

.file-manager {
    list-style: none outside none;
    margin: 0;
    padding: 0;
}

.folder-list li a {
    color: #666666;
    display: block;
    padding: 5px 0;
}

.folder-list li {
    border-bottom: 1px solid #e7eaec;
    display: block;
}

.folder-list li i {
    margin-right: 8px;
    color: #3d4d5d;
}

.category-list li a {
    color: #666666;
    display: block;
    padding: 5px 0;
}

.category-list li {
    display: block;
}

.category-list li i {
    margin-right: 8px;
    color: #3d4d5d;
}

.category-list li a .text-navy {
    color: #1ab394;
}

.category-list li a .text-primary {
    color: #1c84c6;
}

.category-list li a .text-info {
    color: #23c6c8;
}

.category-list li a .text-danger {
    color: #EF5352;
}

.category-list li a .text-warning {
    color: #F8AC59;
}

.file-manager h5.tag-title {
    margin-top: 20px;
}

.tag-list li {
    float: left;
}

.tag-list li a {
    font-size: 10px;
    background-color: #f3f3f4;
    padding: 5px 12px;
    color: inherit;
    border-radius: 2px;
    border: 1px solid #e7eaec;
    margin-right: 5px;
    margin-top: 5px;
    display: block;
}

.file {
    border: 1px solid #e7eaec;
    padding: 0;
    background-color: #ffffff;
    position: relative;
    margin-bottom: 20px;
    margin-right: 20px;
}

.file-manager .hr-line-dashed {
    margin: 15px 0;
}

.file .icon,
.file .image {
    height: 100px;
    overflow: hidden;
}

.file .icon {
    padding: 15px 10px;
    text-align: center;
}

.file-control {
    color: inherit;
    font-size: 11px;
    margin-right: 10px;
}

.file-control.active {
    text-decoration: underline;
}

.file .icon i {
    font-size: 70px;
    color: #dadada;
}

.file .file-name {
    padding: 10px;
    background-color: #f8f8f8;
    border-top: 1px solid #e7eaec;
}

.file-name small {
    color: #676a6c;
}

.corner {
    position: absolute;
    display: inline-block;
    width: 0;
    height: 0;
    line-height: 0;
    border: 0.6em solid transparent;
    border-right: 0.6em solid #f1f1f1;
    border-bottom: 0.6em solid #f1f1f1;
    right: 0em;
    bottom: 0em;
}

a.compose-mail {
    padding: 8px 10px;
}

.mail-search {
    max-width: 300px;
}


/* PROFILE */

.profile-content {
    border-top: none !important;
}

.feed-activity-list .feed-element {
    border-bottom: 1px solid #e7eaec;
}

.feed-element:first-child {
    margin-top: 0;
}

.feed-element {
    padding-bottom: 15px;
}

.feed-element,
.feed-element .media {
    margin-top: 15px;
}

.feed-element,
.media-body {
    overflow: hidden;
}

.feed-element > .pull-left {
    margin-right: 10px;
}

.feed-element img.img-circle,
.dropdown-messages-box img.img-circle {
    width: 38px;
    height: 38px;
}

.feed-element .well {
    border: 1px solid #e7eaec;
    box-shadow: none;
    margin-top: 10px;
    margin-bottom: 5px;
    padding: 10px 20px;
    font-size: 11px;
    line-height: 16px;
}

.feed-element .actions {
    margin-top: 10px;
}

.feed-element .photos {
    margin: 10px 0;
}

.feed-photo {
    max-height: 180px;
    border-radius: 4px;
    overflow: hidden;
    margin-right: 10px;
    margin-bottom: 10px;
}


/* MAILBOX */

.mail-box {
    background-color: #ffffff;
    border: 1px solid #e7eaec;
    border-top: 0;
    padding: 0px;
    margin-bottom: 20px;
}

.mail-box-header {
    background-color: #ffffff;
    border: 1px solid #e7eaec;
    border-bottom: 0;
    padding: 30px 20px 20px 20px;
}

.mail-box-header h2 {
    margin-top: 0px;
}

.mailbox-content .tag-list li a {
    background: #ffffff;
}

.mail-body {
    border-top: 1px solid #e7eaec;
    padding: 20px;
}

.mail-text {
    border-top: 1px solid #e7eaec;
}

.mail-text .note-toolbar {
    padding: 10px 15px;
}

.mail-body .form-group {
    margin-bottom: 5px;
}

.mail-text .note-editor .note-toolbar {
    background-color: #F9F8F8;
}

.mail-attachment {
    border-top: 1px solid #e7eaec;
    padding: 20px;
    font-size: 12px;
}

.mailbox-content {
    background: none;
    border: none;
    padding: 10px;
}

.mail-ontact {
    width: 23%;
}


/* PROJECTS */

.project-people,
.project-actions {
    text-align: right;
    vertical-align: middle;
}

dd.project-people {
    text-align: left;
    margin-top: 5px;
}

.project-people img {
    width: 32px;
    height: 32px;
}

.project-title a {
    font-size: 14px;
    color: #676a6c;
    font-weight: 600;
}

.project-list table tr td {
    border-top: none;
    border-bottom: 1px solid #e7eaec;
    padding: 15px 10px;
    vertical-align: middle;
}

.project-manager .tag-list li a {
    font-size: 10px;
    background-color: white;
    padding: 5px 12px;
    color: inherit;
    border-radius: 2px;
    border: 1px solid #e7eaec;
    margin-right: 5px;
    margin-top: 5px;
    display: block;
}

.project-files li a {
    font-size: 11px;
    color: #676a6c;
    margin-left: 10px;
    line-height: 22px;
}


/* FAQ */

.faq-item {
    padding: 20px;
    margin-bottom: 2px;
    background: #fff;
}

.faq-question {
    font-size: 18px;
    font-weight: 600;
    color: #1ab394;
    display: block;
}

.faq-question:hover {
    color: #179d82;
}

.faq-answer {
    margin-top: 10px;
    background: #f3f3f4;
    border: 1px solid #e7eaec;
    border-radius: 3px;
    padding: 15px;
}

.faq-item .tag-item {
    background: #f3f3f4;
    padding: 2px 6px;
    font-size: 10px;
    text-transform: uppercase;
}


/* Chat view */

.message-input {
    height: 90px !important;
}

.chat-avatar {
    white: 36px;
    height: 36px;
    float: left;
    margin-right: 10px;
}

.chat-user-name {
    padding: 10px;
}

.chat-user {
    padding: 8px 10px;
    border-bottom: 1px solid #e7eaec;
}

.chat-user a {
    color: inherit;
}

.chat-view {
    z-index: 20012;
}

.chat-users,
.chat-statistic {
    margin-left: -30px;
}

@media (max-width: 992px) {
    .chat-users,
    .chat-statistic {
        margin-left: 0px;
    }
}

.chat-view .ibox-content {
    padding: 0;
}

.chat-message {
    padding: 10px 20px;
}

.message-avatar {
    height: 48px;
    width: 48px;
    border: 1px solid #e7eaec;
    border-radius: 4px;
    margin-top: 1px;
}

.chat-discussion .chat-message:nth-child(2n+1) .message-avatar {
    float: left;
    margin-right: 10px;
}

.chat-discussion .chat-message:nth-child(2n) .message-avatar {
    float: right;
    margin-left: 10px;
}

.message {
    background-color: #fff;
    border: 1px solid #e7eaec;
    text-align: left;
    display: block;
    padding: 10px 20px;
    position: relative;
    border-radius: 4px;
}

.chat-discussion .chat-message:nth-child(2n+1) .message-date {
    float: right;
}

.chat-discussion .chat-message:nth-child(2n) .message-date {
    float: left;
}

.chat-discussion .chat-message:nth-child(2n+1) .message {
    text-align: left;
    margin-left: 55px;
}

.chat-discussion .chat-message:nth-child(2n) .message {
    text-align: right;
    margin-right: 55px;
}

.message-date {
    font-size: 10px;
    color: #888888;
}

.message-content {
    display: block;
}

.chat-discussion {
    background: #eee;
    padding: 15px;
    height: 400px;
    overflow-y: auto;
}

.chat-users {
    overflow-y: auto;
    height: 400px;
}

.chat-message-form .form-group {
    margin-bottom: 0;
}


/* jsTree */

.jstree-open > .jstree-anchor > .fa-folder:before {
    content: "\\f07c";
}

.jstree-default .jstree-icon.none {
    width: 0;
}


/* CLIENTS */

.clients-list {
    margin-top: 20px;
}

.clients-list .tab-pane {
    position: relative;
    height: 600px;
}

.client-detail {
    position: relative;
    height: 620px;
}

.clients-list table tr td {
    height: 46px;
    vertical-align: middle;
    border: none;
}

.client-link {
    font-weight: 600;
    color: inherit;
}

.client-link:hover {
    color: inherit;
}

.client-avatar {
    width: 42px;
}

.client-avatar img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
}

.contact-type {
    width: 20px;
    color: #c1c3c4;
}

.client-status {
    text-align: left;
}

.client-detail .vertical-timeline-content p {
    margin: 0;
}

.client-detail .vertical-timeline-icon.gray-bg {
    color: #a7aaab;
}

.clients-list .nav-tabs > li.active > a,
.clients-list .nav-tabs > li.active > a:hover,
.clients-list .nav-tabs > li.active > a:focus {
    border-bottom: 1px solid #fff;
}


/* BLOG ARTICLE */

.blog h2 {
    font-weight: 700;
}

.blog h5 {
    margin: 0 0 5px 0;
}

.blog .btn {
    margin: 0 0 5px 0;
}

.article h1 {
    font-size: 48px;
    font-weight: 700;
    color: #2F4050;
}

.article p {
    font-size: 15px;
    line-height: 26px;
}

.article-title {
    text-align: center;
    margin: 60px 0 40px 0;
}

.article .ibox-content {
    padding: 40px;
}


/* ISSUE TRACKER */

.issue-tracker .btn-link {
    color: #1ab394;
}

table.issue-tracker tbody tr td {
    vertical-align: middle;
    height: 50px;
}

.issue-info {
    width: 50%;
}

.issue-info a {
    font-weight: 600;
    color: #676a6c;
}

.issue-info small {
    display: block;
}


/* TEAMS */

.team-members {
    margin: 10px 0;
}

.team-members img.img-circle {
    width: 42px;
    height: 42px;
    margin-bottom: 5px;
}


/* AGILE BOARD */

.sortable-list {
    padding: 10px 0;
}

.agile-list {
    list-style: none;
    margin: 0;
}

.agile-list li {
    background: #FAFAFB;
    border: 1px solid #e7eaec;
    margin: 0px 0 10px 0;
    padding: 10px;
    border-radius: 2px;
}

.agile-list li:hover {
    cursor: pointer;
    background: #fff;
}

.agile-list li.warning-element {
    border-left: 3px solid #f8ac59;
}

.agile-list li.danger-element {
    border-left: 3px solid #ed5565;
}

.agile-list li.info-element {
    border-left: 3px solid #1c84c6;
}

.agile-list li.success-element {
    border-left: 3px solid #1ab394;
}

.agile-detail {
    margin-top: 5px;
    font-size: 12px;
}


/* DIFF */

ins {
    background-color: #c6ffc6;
    text-decoration: none;
}

del {
    background-color: #ffc6c6;
}

#small-chat {
    position: fixed;
    bottom: 50px;
    right: 26px;
    z-index: 100;
}

#small-chat .badge {
    position: absolute;
    top: -3px;
    right: -4px;
}

.open-small-chat {
    height: 38px;
    width: 38px;
    display: block;
    background: #1ab394;
    padding: 9px 8px;
    text-align: center;
    color: #fff;
    border-radius: 50%;
}

.open-small-chat:hover {
    color: white;
    background: #1ab394;
}

.small-chat-box {
    display: none;
    position: fixed;
    bottom: 50px;
    right: 80px;
    background: #fff;
    border: 1px solid #e7eaec;
    width: 230px;
    height: 320px;
    border-radius: 4px;
}

.small-chat-box.ng-small-chat {
    display: block;
}

.body-small .small-chat-box {
    bottom: 70px;
    right: 20px;
}

.small-chat-box.active {
    display: block;
}

.small-chat-box .heading {
    background: #2f4050;
    padding: 8px 15px;
    font-weight: bold;
    color: #fff;
}

.small-chat-box .chat-date {
    opacity: 0.6;
    font-size: 10px;
    font-weight: normal;
}

.small-chat-box .content {
    padding: 15px 15px;
}

.small-chat-box .content .author-name {
    font-weight: bold;
    margin-bottom: 3px;
    font-size: 11px;
}

.small-chat-box .content > div {
    padding-bottom: 20px;
}

.small-chat-box .content .chat-message {
    padding: 5px 10px;
    border-radius: 6px;
    font-size: 11px;
    line-height: 14px;
    max-width: 80%;
    background: #f3f3f4;
    margin-bottom: 10px;
}

.small-chat-box .content .chat-message.active {
    background: #1ab394;
    color: #fff;
}

.small-chat-box .content .left {
    text-align: left;
    clear: both;
}

.small-chat-box .content .left .chat-message {
    float: left;
}

.small-chat-box .content .right {
    text-align: right;
    clear: both;
}

.small-chat-box .content .right .chat-message {
    float: right;
}

.small-chat-box .form-chat {
    padding: 10px 10px;
}


/*
 *  Usage:
 *
 *    <div class="sk-spinner sk-spinner-rotating-plane"></div>
 *
 */

.sk-spinner-rotating-plane.sk-spinner {
    width: 30px;
    height: 30px;
    background-color: #1ab394;
    margin: 0 auto;
    -webkit-animation: sk-rotatePlane 1.2s infinite ease-in-out;
    animation: sk-rotatePlane 1.2s infinite ease-in-out;
}

@-webkit-keyframes sk-rotatePlane {
    0% {
        -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg);
        transform: perspective(120px) rotateX(0deg) rotateY(0deg);
    }
    50% {
        -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
        transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
    }
    100% {
        -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
        transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
    }
}

@keyframes sk-rotatePlane {
    0% {
        -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg);
        transform: perspective(120px) rotateX(0deg) rotateY(0deg);
    }
    50% {
        -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
        transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
    }
    100% {
        -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
        transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
    }
}


/*
 *  Usage:
 *
 *    <div class="sk-spinner sk-spinner-double-bounce">
 *      <div class="sk-double-bounce1"></div>
 *      <div class="sk-double-bounce2"></div>
 *    </div>
 *
 */

.sk-spinner-double-bounce.sk-spinner {
    width: 40px;
    height: 40px;
    position: relative;
    margin: 0 auto;
}

.sk-spinner-double-bounce .sk-double-bounce1,
.sk-spinner-double-bounce .sk-double-bounce2 {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #1ab394;
    opacity: 0.6;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-animation: sk-doubleBounce 2s infinite ease-in-out;
    animation: sk-doubleBounce 2s infinite ease-in-out;
}

.sk-spinner-double-bounce .sk-double-bounce2 {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
}

@-webkit-keyframes sk-doubleBounce {
    0%,
    100% {
        -webkit-transform: scale(0);
        transform: scale(0);
    }
    50% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}

@keyframes sk-doubleBounce {
    0%,
    100% {
        -webkit-transform: scale(0);
        transform: scale(0);
    }
    50% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}


/*
 *  Usage:
 *
 *    <div class="sk-spinner sk-spinner-wave">
 *      <div class="sk-rect1"></div>
 *      <div class="sk-rect2"></div>
 *      <div class="sk-rect3"></div>
 *      <div class="sk-rect4"></div>
 *      <div class="sk-rect5"></div>
 *    </div>
 *
 */

.sk-spinner-wave.sk-spinner {
    margin: 0 auto;
    width: 50px;
    height: 30px;
    text-align: center;
    font-size: 10px;
}

.sk-spinner-wave div {
    background-color: #1ab394;
    height: 100%;
    width: 6px;
    display: inline-block;
    -webkit-animation: sk-waveStretchDelay 1.2s infinite ease-in-out;
    animation: sk-waveStretchDelay 1.2s infinite ease-in-out;
}

.sk-spinner-wave .sk-rect2 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
}

.sk-spinner-wave .sk-rect3 {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
}

.sk-spinner-wave .sk-rect4 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
}

.sk-spinner-wave .sk-rect5 {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
}

@-webkit-keyframes sk-waveStretchDelay {
    0%,
    40%,
    100% {
        -webkit-transform: scaleY(0.4);
        transform: scaleY(0.4);
    }
    20% {
        -webkit-transform: scaleY(1);
        transform: scaleY(1);
    }
}

@keyframes sk-waveStretchDelay {
    0%,
    40%,
    100% {
        -webkit-transform: scaleY(0.4);
        transform: scaleY(0.4);
    }
    20% {
        -webkit-transform: scaleY(1);
        transform: scaleY(1);
    }
}


/*
 *  Usage:
 *
 *    <div class="sk-spinner sk-spinner-wandering-cubes">
 *      <div class="sk-cube1"></div>
 *      <div class="sk-cube2"></div>
 *    </div>
 *
 */

.sk-spinner-wandering-cubes.sk-spinner {
    margin: 0 auto;
    width: 32px;
    height: 32px;
    position: relative;
}

.sk-spinner-wandering-cubes .sk-cube1,
.sk-spinner-wandering-cubes .sk-cube2 {
    background-color: #1ab394;
    width: 10px;
    height: 10px;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-animation: sk-wanderingCubeMove 1.8s infinite ease-in-out;
    animation: sk-wanderingCubeMove 1.8s infinite ease-in-out;
}

.sk-spinner-wandering-cubes .sk-cube2 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
}

@-webkit-keyframes sk-wanderingCubeMove {
    25% {
        -webkit-transform: translateX(42px) rotate(-90deg) scale(0.5);
        transform: translateX(42px) rotate(-90deg) scale(0.5);
    }
    50% {
        /* Hack to make FF rotate in the right direction */
        -webkit-transform: translateX(42px) translateY(42px) rotate(-179deg);
        transform: translateX(42px) translateY(42px) rotate(-179deg);
    }
    50.1% {
        -webkit-transform: translateX(42px) translateY(42px) rotate(-180deg);
        transform: translateX(42px) translateY(42px) rotate(-180deg);
    }
    75% {
        -webkit-transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);
        transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);
    }
    100% {
        -webkit-transform: rotate(-360deg);
        transform: rotate(-360deg);
    }
}

@keyframes sk-wanderingCubeMove {
    25% {
        -webkit-transform: translateX(42px) rotate(-90deg) scale(0.5);
        transform: translateX(42px) rotate(-90deg) scale(0.5);
    }
    50% {
        /* Hack to make FF rotate in the right direction */
        -webkit-transform: translateX(42px) translateY(42px) rotate(-179deg);
        transform: translateX(42px) translateY(42px) rotate(-179deg);
    }
    50.1% {
        -webkit-transform: translateX(42px) translateY(42px) rotate(-180deg);
        transform: translateX(42px) translateY(42px) rotate(-180deg);
    }
    75% {
        -webkit-transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);
        transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);
    }
    100% {
        -webkit-transform: rotate(-360deg);
        transform: rotate(-360deg);
    }
}


/*
 *  Usage:
 *
 *    <div class="sk-spinner sk-spinner-pulse"></div>
 *
 */

.sk-spinner-pulse.sk-spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto;
    background-color: #1ab394;
    border-radius: 100%;
    -webkit-animation: sk-pulseScaleOut 1s infinite ease-in-out;
    animation: sk-pulseScaleOut 1s infinite ease-in-out;
}

@-webkit-keyframes sk-pulseScaleOut {
    0% {
        -webkit-transform: scale(0);
        transform: scale(0);
    }
    100% {
        -webkit-transform: scale(1);
        transform: scale(1);
        opacity: 0;
    }
}

@keyframes sk-pulseScaleOut {
    0% {
        -webkit-transform: scale(0);
        transform: scale(0);
    }
    100% {
        -webkit-transform: scale(1);
        transform: scale(1);
        opacity: 0;
    }
}


/*
 *  Usage:
 *
 *    <div class="sk-spinner sk-spinner-chasing-dots">
 *      <div class="sk-dot1"></div>
 *      <div class="sk-dot2"></div>
 *    </div>
 *
 */

.sk-spinner-chasing-dots.sk-spinner {
    margin: 0 auto;
    width: 40px;
    height: 40px;
    position: relative;
    text-align: center;
    -webkit-animation: sk-chasingDotsRotate 2s infinite linear;
    animation: sk-chasingDotsRotate 2s infinite linear;
}

.sk-spinner-chasing-dots .sk-dot1,
.sk-spinner-chasing-dots .sk-dot2 {
    width: 60%;
    height: 60%;
    display: inline-block;
    position: absolute;
    top: 0;
    background-color: #1ab394;
    border-radius: 100%;
    -webkit-animation: sk-chasingDotsBounce 2s infinite ease-in-out;
    animation: sk-chasingDotsBounce 2s infinite ease-in-out;
}

.sk-spinner-chasing-dots .sk-dot2 {
    top: auto;
    bottom: 0px;
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
}

@-webkit-keyframes sk-chasingDotsRotate {
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

@keyframes sk-chasingDotsRotate {
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

@-webkit-keyframes sk-chasingDotsBounce {
    0%,
    100% {
        -webkit-transform: scale(0);
        transform: scale(0);
    }
    50% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}

@keyframes sk-chasingDotsBounce {
    0%,
    100% {
        -webkit-transform: scale(0);
        transform: scale(0);
    }
    50% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}


/*
 *  Usage:
 *
 *    <div class="sk-spinner sk-spinner-three-bounce">
 *      <div class="sk-bounce1"></div>
 *      <div class="sk-bounce2"></div>
 *      <div class="sk-bounce3"></div>
 *    </div>
 *
 */

.sk-spinner-three-bounce.sk-spinner {
    margin: 0 auto;
    width: 70px;
    text-align: center;
}

.sk-spinner-three-bounce div {
    width: 18px;
    height: 18px;
    background-color: #1ab394;
    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-threeBounceDelay 1.4s infinite ease-in-out;
    animation: sk-threeBounceDelay 1.4s infinite ease-in-out;
    /* Prevent first frame from flickering when animation starts */
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}

.sk-spinner-three-bounce .sk-bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
}

.sk-spinner-three-bounce .sk-bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
}

@-webkit-keyframes sk-threeBounceDelay {
    0%,
    80%,
    100% {
        -webkit-transform: scale(0);
        transform: scale(0);
    }
    40% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}

@keyframes sk-threeBounceDelay {
    0%,
    80%,
    100% {
        -webkit-transform: scale(0);
        transform: scale(0);
    }
    40% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}


/*
 *  Usage:
 *
 *    <div class="sk-spinner sk-spinner-circle">
 *      <div class="sk-circle1 sk-circle"></div>
 *      <div class="sk-circle2 sk-circle"></div>
 *      <div class="sk-circle3 sk-circle"></div>
 *      <div class="sk-circle4 sk-circle"></div>
 *      <div class="sk-circle5 sk-circle"></div>
 *      <div class="sk-circle6 sk-circle"></div>
 *      <div class="sk-circle7 sk-circle"></div>
 *      <div class="sk-circle8 sk-circle"></div>
 *      <div class="sk-circle9 sk-circle"></div>
 *      <div class="sk-circle10 sk-circle"></div>
 *      <div class="sk-circle11 sk-circle"></div>
 *      <div class="sk-circle12 sk-circle"></div>
 *    </div>
 *
 */

.sk-spinner-circle.sk-spinner {
    margin: 0 auto;
    width: 22px;
    height: 22px;
    position: relative;
}

.sk-spinner-circle .sk-circle {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
}

.sk-spinner-circle .sk-circle:before {
    content: '';
    display: block;
    margin: 0 auto;
    width: 20%;
    height: 20%;
    background-color: #1ab394;
    border-radius: 100%;
    -webkit-animation: sk-circleBounceDelay 1.2s infinite ease-in-out;
    animation: sk-circleBounceDelay 1.2s infinite ease-in-out;
    /* Prevent first frame from flickering when animation starts */
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}

.sk-spinner-circle .sk-circle2 {
    -webkit-transform: rotate(30deg);
    -ms-transform: rotate(30deg);
    transform: rotate(30deg);
}

.sk-spinner-circle .sk-circle3 {
    -webkit-transform: rotate(60deg);
    -ms-transform: rotate(60deg);
    transform: rotate(60deg);
}

.sk-spinner-circle .sk-circle4 {
    -webkit-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
}

.sk-spinner-circle .sk-circle5 {
    -webkit-transform: rotate(120deg);
    -ms-transform: rotate(120deg);
    transform: rotate(120deg);
}

.sk-spinner-circle .sk-circle6 {
    -webkit-transform: rotate(150deg);
    -ms-transform: rotate(150deg);
    transform: rotate(150deg);
}

.sk-spinner-circle .sk-circle7 {
    -webkit-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    transform: rotate(180deg);
}

.sk-spinner-circle .sk-circle8 {
    -webkit-transform: rotate(210deg);
    -ms-transform: rotate(210deg);
    transform: rotate(210deg);
}

.sk-spinner-circle .sk-circle9 {
    -webkit-transform: rotate(240deg);
    -ms-transform: rotate(240deg);
    transform: rotate(240deg);
}

.sk-spinner-circle .sk-circle10 {
    -webkit-transform: rotate(270deg);
    -ms-transform: rotate(270deg);
    transform: rotate(270deg);
}

.sk-spinner-circle .sk-circle11 {
    -webkit-transform: rotate(300deg);
    -ms-transform: rotate(300deg);
    transform: rotate(300deg);
}

.sk-spinner-circle .sk-circle12 {
    -webkit-transform: rotate(330deg);
    -ms-transform: rotate(330deg);
    transform: rotate(330deg);
}

.sk-spinner-circle .sk-circle2:before {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
}

.sk-spinner-circle .sk-circle3:before {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
}

.sk-spinner-circle .sk-circle4:before {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
}

.sk-spinner-circle .sk-circle5:before {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
}

.sk-spinner-circle .sk-circle6:before {
    -webkit-animation-delay: -0.7s;
    animation-delay: -0.7s;
}

.sk-spinner-circle .sk-circle7:before {
    -webkit-animation-delay: -0.6s;
    animation-delay: -0.6s;
}

.sk-spinner-circle .sk-circle8:before {
    -webkit-animation-delay: -0.5s;
    animation-delay: -0.5s;
}

.sk-spinner-circle .sk-circle9:before {
    -webkit-animation-delay: -0.4s;
    animation-delay: -0.4s;
}

.sk-spinner-circle .sk-circle10:before {
    -webkit-animation-delay: -0.3s;
    animation-delay: -0.3s;
}

.sk-spinner-circle .sk-circle11:before {
    -webkit-animation-delay: -0.2s;
    animation-delay: -0.2s;
}

.sk-spinner-circle .sk-circle12:before {
    -webkit-animation-delay: -0.1s;
    animation-delay: -0.1s;
}

@-webkit-keyframes sk-circleBounceDelay {
    0%,
    80%,
    100% {
        -webkit-transform: scale(0);
        transform: scale(0);
    }
    40% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}

@keyframes sk-circleBounceDelay {
    0%,
    80%,
    100% {
        -webkit-transform: scale(0);
        transform: scale(0);
    }
    40% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}


/*
 *  Usage:
 *
 *    <div class="sk-spinner sk-spinner-cube-grid">
 *      <div class="sk-cube"></div>
 *      <div class="sk-cube"></div>
 *      <div class="sk-cube"></div>
 *      <div class="sk-cube"></div>
 *      <div class="sk-cube"></div>
 *      <div class="sk-cube"></div>
 *      <div class="sk-cube"></div>
 *      <div class="sk-cube"></div>
 *      <div class="sk-cube"></div>
 *    </div>
 *
 */

.sk-spinner-cube-grid {
    /*
   * Spinner positions
   * 1 2 3
   * 4 5 6
   * 7 8 9
   */
}

.sk-spinner-cube-grid.sk-spinner {
    width: 30px;
    height: 30px;
    margin: 0 auto;
}

.sk-spinner-cube-grid .sk-cube {
    width: 33%;
    height: 33%;
    background-color: #1ab394;
    float: left;
    -webkit-animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
    animation: sk-cubeGridScaleDelay 1.3s infinite ease-in-out;
}

.sk-spinner-cube-grid .sk-cube:nth-child(1) {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
}

.sk-spinner-cube-grid .sk-cube:nth-child(2) {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
}

.sk-spinner-cube-grid .sk-cube:nth-child(3) {
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s;
}

.sk-spinner-cube-grid .sk-cube:nth-child(4) {
    -webkit-animation-delay: 0.1s;
    animation-delay: 0.1s;
}

.sk-spinner-cube-grid .sk-cube:nth-child(5) {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
}

.sk-spinner-cube-grid .sk-cube:nth-child(6) {
    -webkit-animation-delay: 0.3s;
    animation-delay: 0.3s;
}

.sk-spinner-cube-grid .sk-cube:nth-child(7) {
    -webkit-animation-delay: 0s;
    animation-delay: 0s;
}

.sk-spinner-cube-grid .sk-cube:nth-child(8) {
    -webkit-animation-delay: 0.1s;
    animation-delay: 0.1s;
}

.sk-spinner-cube-grid .sk-cube:nth-child(9) {
    -webkit-animation-delay: 0.2s;
    animation-delay: 0.2s;
}

@-webkit-keyframes sk-cubeGridScaleDelay {
    0%,
    70%,
    100% {
        -webkit-transform: scale3D(1, 1, 1);
        transform: scale3D(1, 1, 1);
    }
    35% {
        -webkit-transform: scale3D(0, 0, 1);
        transform: scale3D(0, 0, 1);
    }
}

@keyframes sk-cubeGridScaleDelay {
    0%,
    70%,
    100% {
        -webkit-transform: scale3D(1, 1, 1);
        transform: scale3D(1, 1, 1);
    }
    35% {
        -webkit-transform: scale3D(0, 0, 1);
        transform: scale3D(0, 0, 1);
    }
}


/*
 *  Usage:
 *
 *    <div class="sk-spinner sk-spinner-wordpress">
 *      <span class="sk-inner-circle"></span>
 *    </div>
 *
 */

.sk-spinner-wordpress.sk-spinner {
    background-color: #1ab394;
    width: 30px;
    height: 30px;
    border-radius: 30px;
    position: relative;
    margin: 0 auto;
    -webkit-animation: sk-innerCircle 1s linear infinite;
    animation: sk-innerCircle 1s linear infinite;
}

.sk-spinner-wordpress .sk-inner-circle {
    display: block;
    background-color: #fff;
    width: 8px;
    height: 8px;
    position: absolute;
    border-radius: 8px;
    top: 5px;
    left: 5px;
}

@-webkit-keyframes sk-innerCircle {
    0% {
        -webkit-transform: rotate(0);
        transform: rotate(0);
    }
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

@keyframes sk-innerCircle {
    0% {
        -webkit-transform: rotate(0);
        transform: rotate(0);
    }
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}


/*
 *  Usage:
 *
 *    <div class="sk-spinner sk-spinner-fading-circle">
 *      <div class="sk-circle1 sk-circle"></div>
 *      <div class="sk-circle2 sk-circle"></div>
 *      <div class="sk-circle3 sk-circle"></div>
 *      <div class="sk-circle4 sk-circle"></div>
 *      <div class="sk-circle5 sk-circle"></div>
 *      <div class="sk-circle6 sk-circle"></div>
 *      <div class="sk-circle7 sk-circle"></div>
 *      <div class="sk-circle8 sk-circle"></div>
 *      <div class="sk-circle9 sk-circle"></div>
 *      <div class="sk-circle10 sk-circle"></div>
 *      <div class="sk-circle11 sk-circle"></div>
 *      <div class="sk-circle12 sk-circle"></div>
 *    </div>
 *
 */

.sk-spinner-fading-circle.sk-spinner {
    margin: 0 auto;
    width: 22px;
    height: 22px;
    position: relative;
}

.sk-spinner-fading-circle .sk-circle {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
}

.sk-spinner-fading-circle .sk-circle:before {
    content: '';
    display: block;
    margin: 0 auto;
    width: 18%;
    height: 18%;
    background-color: #1ab394;
    border-radius: 100%;
    -webkit-animation: sk-circleFadeDelay 1.2s infinite ease-in-out;
    animation: sk-circleFadeDelay 1.2s infinite ease-in-out;
    /* Prevent first frame from flickering when animation starts */
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}

.sk-spinner-fading-circle .sk-circle2 {
    -webkit-transform: rotate(30deg);
    -ms-transform: rotate(30deg);
    transform: rotate(30deg);
}

.sk-spinner-fading-circle .sk-circle3 {
    -webkit-transform: rotate(60deg);
    -ms-transform: rotate(60deg);
    transform: rotate(60deg);
}

.sk-spinner-fading-circle .sk-circle4 {
    -webkit-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
}

.sk-spinner-fading-circle .sk-circle5 {
    -webkit-transform: rotate(120deg);
    -ms-transform: rotate(120deg);
    transform: rotate(120deg);
}

.sk-spinner-fading-circle .sk-circle6 {
    -webkit-transform: rotate(150deg);
    -ms-transform: rotate(150deg);
    transform: rotate(150deg);
}

.sk-spinner-fading-circle .sk-circle7 {
    -webkit-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    transform: rotate(180deg);
}

.sk-spinner-fading-circle .sk-circle8 {
    -webkit-transform: rotate(210deg);
    -ms-transform: rotate(210deg);
    transform: rotate(210deg);
}

.sk-spinner-fading-circle .sk-circle9 {
    -webkit-transform: rotate(240deg);
    -ms-transform: rotate(240deg);
    transform: rotate(240deg);
}

.sk-spinner-fading-circle .sk-circle10 {
    -webkit-transform: rotate(270deg);
    -ms-transform: rotate(270deg);
    transform: rotate(270deg);
}

.sk-spinner-fading-circle .sk-circle11 {
    -webkit-transform: rotate(300deg);
    -ms-transform: rotate(300deg);
    transform: rotate(300deg);
}

.sk-spinner-fading-circle .sk-circle12 {
    -webkit-transform: rotate(330deg);
    -ms-transform: rotate(330deg);
    transform: rotate(330deg);
}

.sk-spinner-fading-circle .sk-circle2:before {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
}

.sk-spinner-fading-circle .sk-circle3:before {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
}

.sk-spinner-fading-circle .sk-circle4:before {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
}

.sk-spinner-fading-circle .sk-circle5:before {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
}

.sk-spinner-fading-circle .sk-circle6:before {
    -webkit-animation-delay: -0.7s;
    animation-delay: -0.7s;
}

.sk-spinner-fading-circle .sk-circle7:before {
    -webkit-animation-delay: -0.6s;
    animation-delay: -0.6s;
}

.sk-spinner-fading-circle .sk-circle8:before {
    -webkit-animation-delay: -0.5s;
    animation-delay: -0.5s;
}

.sk-spinner-fading-circle .sk-circle9:before {
    -webkit-animation-delay: -0.4s;
    animation-delay: -0.4s;
}

.sk-spinner-fading-circle .sk-circle10:before {
    -webkit-animation-delay: -0.3s;
    animation-delay: -0.3s;
}

.sk-spinner-fading-circle .sk-circle11:before {
    -webkit-animation-delay: -0.2s;
    animation-delay: -0.2s;
}

.sk-spinner-fading-circle .sk-circle12:before {
    -webkit-animation-delay: -0.1s;
    animation-delay: -0.1s;
}

@-webkit-keyframes sk-circleFadeDelay {
    0%,
    39%,
    100% {
        opacity: 0;
    }
    40% {
        opacity: 1;
    }
}

@keyframes sk-circleFadeDelay {
    0%,
    39%,
    100% {
        opacity: 0;
    }
    40% {
        opacity: 1;
    }
}

body.rtls {
    /* Theme config */
}

body.rtls #page-wrapper {
    margin: 0 220px 0 0;
}

body.rtls .nav-second-level li a {
    padding: 7px 35px 7px 10px;
}

body.rtls .ibox-title h5 {
    float: right;
}

body.rtls .pull-right {
    float: left !important;
}

body.rtls .pull-left {
    float: right !important;
}

body.rtls .ibox-tools {
    float: left;
}

body.rtls .stat-percent {
    float: left;
}

body.rtls .navbar-right {
    float: left !important;
}

body.rtls .navbar-top-links li:last-child {
    margin-left: 40px;
    margin-right: 0;
}

body.rtls .minimalize-styl-2 {
    float: right;
    margin: 14px 20px 5px 5px;
}

body.rtls .feed-element > .pull-left {
    margin-left: 10px;
    margin-right: 0;
}

body.rtls .timeline-item .date {
    text-align: left;
}

body.rtls .timeline-item .date i {
    left: 0;
    right: auto;
}

body.rtls .timeline-item .content {
    border-right: 1px solid #e7eaec;
    border-left: none;
}

body.rtls .toast-close-button {
    float: left;
}

body.rtls #toast-container > .toast:before {
    margin: auto -1.5em auto 0.5em;
}

body.rtls #toast-container > div {
    padding: 15px 50px 15px 15px;
}

body.rtls .center-orientation .vertical-timeline-icon i {
    margin-left: 0;
    margin-right: -12px;
}

body.rtls .vertical-timeline-icon i {
    right: 50%;
    left: auto;
    margin-left: auto;
    margin-right: -12px;
}

body.rtls .file-box {
    float: right;
}

body.rtls ul.notes li {
    float: right;
}

body.rtls .chat-users,
body.rtls .chat-statistic {
    margin-right: -30px;
    margin-left: auto;
}

body.rtls .dropdown-menu > li > a {
    text-align: right;
}

body.rtls .b-r {
    border-left: 1px solid #e7eaec;
    border-right: none;
}

body.rtls .dd-list .dd-list {
    padding-right: 30px;
    padding-left: 0;
}

body.rtls .dd-item > button {
    float: right;
}

body.rtls .skin-setttings {
    margin-right: 40px;
    margin-left: 0;
}

body.rtls .skin-setttings {
    direction: ltr;
}

body.rtls .footer.fixed {
    margin-right: 220px;
    margin-left: 0;
}

@media (max-width: 992px) {
    body.rtls .chat-users,
    body.rtls .chat-statistic {
        margin-right: 0px;
    }
}

body.rtls.mini-navbar .footer.fixed,
body.body-small.mini-navbar .footer.fixed {
    margin: 0 70px 0 0;
}

body.rtls.mini-navbar.fixed-sidebar .footer.fixed,
body.body-small.mini-navbar .footer.fixed {
    margin: 0 0 0 0;
}

body.rtls.top-navigation .navbar-toggle {
    float: right;
    margin-left: 15px;
    margin-right: 15px;
}

.body-small.rtls.top-navigation .navbar-header {
    float: none;
}

body.rtls.top-navigation #page-wrapper {
    margin: 0;
}

body.rtls.mini-navbar #page-wrapper {
    margin: 0 70px 0 0;
}

body.rtls.mini-navbar.fixed-sidebar #page-wrapper {
    margin: 0 0 0 0;
}

body.rtls.body-small.fixed-sidebar.mini-navbar #page-wrapper {
    margin: 0 220px 0 0;
}

body.rtls.body-small.fixed-sidebar.mini-navbar .navbar-static-side {
    width: 220px;
}

.body-small.rtls .navbar-fixed-top {
    margin-right: 0px;
}

.body-small.rtls .navbar-header {
    float: right;
}

body.rtls .navbar-top-links li:last-child {
    margin-left: 20px;
}

body.rtls .top-navigation #page-wrapper,
body.rtls.mini-navbar .top-navigation #page-wrapper,
body.rtls.mini-navbar.top-navigation #page-wrapper {
    margin: 0;
}

body.rtls .top-navigation .footer.fixed,
body.rtls.top-navigation .footer.fixed {
    margin: 0;
}

@media (max-width: 768px) {
    body.rtls .navbar-top-links li:last-child {
        margin-left: 20px;
    }
    .body-small.rtls #page-wrapper {
        position: inherit;
        margin: 0 0 0 0px;
        min-height: 1000px;
    }
    .body-small.rtls .navbar-static-side {
        display: none;
        z-index: 2001;
        position: absolute;
        width: 70px;
    }
    .body-small.rtls.mini-navbar .navbar-static-side {
        display: block;
    }
    .rtls.fixed-sidebar.body-small .navbar-static-side {
        display: none;
        z-index: 2001;
        position: fixed;
        width: 220px;
    }
    .rtls.fixed-sidebar.body-small.mini-navbar .navbar-static-side {
        display: block;
    }
}

.rtls .ltr-support {
    direction: ltr;
}


/*
 *
 *   This is style for skin config
 *   Use only in demo theme
 *
*/

.skin-setttings .title {
    background: #efefef;
    text-align: center;
    text-transform: uppercase;
    font-weight: 600;
    display: block;
    padding: 10px 15px;
    font-size: 12px;
}

.setings-item {
    padding: 10px 30px;
}

.setings-item.nb {
    border: none;
}

.setings-item.skin {
    text-align: center;
}

.setings-item .switch {
    float: right;
}

.skin-name a {
    text-transform: uppercase;
}

.setings-item a {
    color: #fff;
}

.default-skin,
.blue-skin,
.ultra-skin,
.yellow-skin {
    text-align: center;
}

.default-skin {
    font-weight: 600;
    background: #1ab394;
}

.default-skin:hover {
    background: #199d82;
}

.blue-skin {
    font-weight: 600;
    background: url("patterns/header-profile-skin-1.png") repeat scroll 0 0;
}

.blue-skin:hover {
    background: #0d8ddb;
}

.yellow-skin {
    font-weight: 600;
    background: url("patterns/header-profile-skin-3.png") repeat scroll 0 100%;
}

.yellow-skin:hover {
    background: #ce8735;
}

.content-tabs {
    border-bottom: solid 2px #2f4050;
}

.page-tabs a {
    color: #999;
}

.page-tabs a i {
    color: #ccc;
}

.page-tabs a.active {
    background: #2f4050;
    color: #a7b1c2;
}

.page-tabs a.active:hover,
.page-tabs a.active i:hover {
    background: #293846;
    color: #fff;
}


/*
 *
 *   SKIN 1 - H+ - 后台主题UI框架
 *   NAME - Blue light
 *
*/

.skin-1 .minimalize-styl-2 {
    margin: 14px 5px 5px 30px;
}

.skin-1 .navbar-top-links li:last-child {
    margin-right: 30px;
}

.skin-1.fixed-nav .minimalize-styl-2 {
    margin: 14px 5px 5px 15px;
}

.skin-1 .spin-icon {
    background: #0e9aef !important;
}

.skin-1 .nav-header {
    background: #0e9aef;
    background: url('patterns/header-profile-skin-1.png');
}

.skin-1.mini-navbar .nav-second-level {
    background: #3e495f;
}

.skin-1 .breadcrumb {
    background: transparent;
}

.skin-1 .page-heading {
    border: none;
}

.skin-1 .nav > li.active {
    background: #3a4459;
}

.skin-1 .nav > li > a {
    color: #9ea6b9;
}

.skin-1 .nav > li.active > a {
    color: #fff;
}

.skin-1 .navbar-minimalize {
    background: #0e9aef;
    border-color: #0e9aef;
}

body.skin-1 {
    background: #3e495f;
}

.skin-1 .navbar-static-top {
    background: #ffffff;
}

.skin-1 .dashboard-header {
    background: transparent;
    border-bottom: none !important;
    border-top: none;
    padding: 20px 30px 10px 30px;
}

.fixed-nav.skin-1 .navbar-fixed-top {
    background: #fff;
}

.skin-1 .wrapper-content {
    padding: 30px 15px;
}

.skin-1 #page-wrapper {
    background: #f4f6fa;
}

.skin-1 .ibox-title,
.skin-1 .ibox-content {
    border-width: 1px;
}

.skin-1 .ibox-content:last-child {
    border-style: solid solid solid solid;
}

.skin-1 .nav > li.active {
    border: none;
}

.skin-1 .nav-header {
    padding: 35px 25px 25px 25px;
}

.skin-1 .nav-header a.dropdown-toggle {
    color: #fff;
    margin-top: 10px;
}

.skin-1 .nav-header a.dropdown-toggle .text-muted {
    color: #fff;
    opacity: 0.8;
}

.skin-1 .profile-element {
    text-align: center;
}

.skin-1 .img-circle {
    border-radius: 5px;
}

.skin-1 .navbar-default .nav > li > a:hover,
.skin-1 .navbar-default .nav > li > a:focus {
    background: #39aef5;
    color: #fff;
}

.skin-1 .nav.nav-tabs > li.active > a {
    color: #555;
}

.skin-1 .content-tabs {
    border-bottom: solid 2px #39aef5;
}

.skin-1 .nav.nav-tabs > li.active {
    background: transparent;
}

.skin-1 .page-tabs a.active {
    background: #39aef5;
    color: #fff;
}

.skin-1 .page-tabs a.active:hover,
.skin-1 .page-tabs a.active i:hover {
    background: #0e9aef;
    color: #fff;
}


/*
 *
 *   SKIN 3 - H+ - 后台主题UI框架
 *   NAME - Yellow/purple
 *
*/

.skin-3 .minimalize-styl-2 {
    margin: 14px 5px 5px 30px;
}

.skin-3 .navbar-top-links li:last-child {
    margin-right: 30px;
}

.skin-3.fixed-nav .minimalize-styl-2 {
    margin: 14px 5px 5px 15px;
}

.skin-3 .spin-icon {
    background: #ecba52 !important;
}

body.boxed-layout.skin-3 #wrapper {
    background: #3e2c42;
}

.skin-3 .nav-header {
    background: #ecba52;
    background: url('patterns/header-profile-skin-3.png');
}

.skin-3.mini-navbar .nav-second-level {
    background: #3e2c42;
}

.skin-3 .breadcrumb {
    background: transparent;
}

.skin-3 .page-heading {
    border: none;
}

.skin-3 .nav > li.active {
    background: #38283c;
}

.fixed-nav.skin-3 .navbar-fixed-top {
    background: #fff;
}

.skin-3 .nav > li > a {
    color: #948b96;
}

.skin-3 .nav > li.active > a {
    color: #fff;
}

.skin-3 .navbar-minimalize {
    background: #ecba52;
    border-color: #ecba52;
}

body.skin-3 {
    background: #3e2c42;
}

.skin-3 .navbar-static-top {
    background: #ffffff;
}

.skin-3 .dashboard-header {
    background: transparent;
    border-bottom: none !important;
    border-top: none;
    padding: 20px 30px 10px 30px;
}

.skin-3 .wrapper-content {
    padding: 30px 15px;
}

.skin-3 #page-wrapper {
    background: #f4f6fa;
}

.skin-3 .ibox-title,
.skin-3 .ibox-content {
    border-width: 1px;
}

.skin-3 .ibox-content:last-child {
    border-style: solid solid solid solid;
}

.skin-3 .nav > li.active {
    border: none;
}

.skin-3 .nav-header {
    padding: 35px 25px 25px 25px;
}

.skin-3 .nav-header a.dropdown-toggle {
    color: #fff;
    margin-top: 10px;
}

.skin-3 .nav-header a.dropdown-toggle .text-muted {
    color: #fff;
    opacity: 0.8;
}

.skin-3 .profile-element {
    text-align: center;
}

.skin-3 .img-circle {
    border-radius: 5px;
}

.skin-3 .navbar-default .nav > li > a:hover,
.skin-3 .navbar-default .nav > li > a:focus {
    background: #38283c;
    color: #fff;
}

.skin-3 .nav.nav-tabs > li.active > a {
    color: #555;
}

.skin-3 .nav.nav-tabs > li.active {
    background: transparent;
}

.skin-3 .content-tabs {
    border-bottom: solid 2px #3e2c42;
}

.skin-3 .nav.nav-tabs > li.active {
    background: transparent;
}

.skin-3 .page-tabs a.active {
    background: #3e2c42;
    color: #fff;
}

.skin-3 .page-tabs a.active:hover,
.skin-3 .page-tabs a.active i:hover {
    background: #38283c;
    color: #fff;
}

@media (min-width: 768px) {
    .navbar-top-links .dropdown-messages,
    .navbar-top-links .dropdown-tasks,
    .navbar-top-links .dropdown-alerts {
        margin-left: auto;
    }
}

@media (max-width: 768px) {
    body.fixed-sidebar .navbar-static-side {
        display: none;
    }
    body.fixed-sidebar.mini-navbar .navbar-static-side {
        width: 70px;
    }
    .lock-word {
        display: none;
    }
    .navbar-form-custom {
        display: none;
    }
    .navbar-header {
        display: inline;
        float: left;
    }
    .sidebard-panel {
        z-index: 2;
        position: relative;
        width: auto;
        min-height: 100% !important;
    }
    .sidebar-content .wrapper {
        padding-right: 0px;
        z-index: 1;
    }
    .fixed-sidebar.body-small .navbar-static-side {
        display: none;
        z-index: 2001;
        position: fixed;
        width: 220px;
    }
    .fixed-sidebar.body-small.mini-navbar .navbar-static-side {
        display: block;
    }
    .ibox-tools {
        float: none;
        text-align: right;
        display: block;
    }
    .content-tabs {
        display: none;
    }
    #content-main {
        height: calc(100% - 100px);
    }
    .fixed-nav #content-main {
        height: calc(100% - 38px);
    }
}

.navbar-static-side {
    background: #2f4050;
}

.nav-close {
    padding: 10px;
    display: block;
    position: absolute;
    right: 5px;
    top: 5px;
    font-size: 1.4em;
    cursor: pointer;
    z-index: 10;
    display: none;
    color: rgba(255, 255, 255, .3);
}

@media (max-width: 350px) {
    body.fixed-sidebar.mini-navbar .navbar-static-side {
        width: 0;
    }
    .nav-close {
        display: block;
    }
    #page-wrapper {
        margin-left: 0!important;
    }
    .timeline-item .date {
        text-align: left;
        width: 110px;
        position: relative;
        padding-top: 30px;
    }
    .timeline-item .date i {
        position: absolute;
        top: 0;
        left: 15px;
        padding: 5px;
        width: 30px;
        text-align: center;
        border: 1px solid #e7eaec;
        background: #f8f8f8;
    }
    .timeline-item .content {
        border-left: none;
        border-top: 1px solid #e7eaec;
        padding-top: 10px;
        min-height: 100px;
    }
    .nav.navbar-top-links li.dropdown {
        display: none;
    }
    .ibox-tools {
        float: none;
        text-align: left;
        display: inline-block;
    }
}


/*JQGRID*/

.ui-jqgrid-titlebar {
    height: 40px;
    line-height: 24px;
    color: #676a6c;
    background-color: #F9F9F9;
    text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
}

.ui-jqgrid .ui-jqgrid-title {
    float: left;
    margin-left: 5px;
    font-weight: 700;
}

.ui-jqgrid .ui-jqgrid-titlebar {
    position: relative;
    border-left: 0px solid;
    border-right: 0px solid;
    border-top: 0px solid;
}


/* Social feed */

.social-feed-separated .social-feed-box {
    margin-left: 62px;
}

.social-feed-separated .social-avatar {
    float: left;
    padding: 0;
}

.social-feed-separated .social-avatar img {
    width: 52px;
    height: 52px;
    border: 1px solid #e7eaec;
}

.social-feed-separated .social-feed-box .social-avatar {
    padding: 15px 15px 0 15px;
    float: none;
}

.social-feed-box {
    /*padding: 15px;*/
    border: 1px solid #e7eaec;
    background: #fff;
    margin-bottom: 15px;
}

.article .social-feed-box {
    margin-bottom: 0;
    border-bottom: none;
}

.article .social-feed-box:last-child {
    margin-bottom: 0;
    border-bottom: 1px solid #e7eaec;
}

.article .social-feed-box p {
    font-size: 13px;
    line-height: 18px;
}

.social-action {
    margin: 15px;
}

.social-avatar {
    padding: 15px 15px 0 15px;
}

.social-comment .social-comment {
    margin-left: 45px;
}

.social-avatar img {
    height: 40px;
    width: 40px;
    margin-right: 10px;
}

.social-avatar .media-body a {
    font-size: 14px;
    display: block;
}

.social-body {
    padding: 15px;
}

.social-body img {
    margin-bottom: 10px;
}

.social-footer {
    border-top: 1px solid #e7eaec;
    padding: 10px 15px;
    background: #f9f9f9;
}

.social-footer .social-comment img {
    width: 32px;
    margin-right: 10px;
}

.social-comment:first-child {
    margin-top: 0;
}

.social-comment {
    margin-top: 15px;
}

.social-comment textarea {
    font-size: 12px;
}

.checkbox input[type=checkbox],
.checkbox-inline input[type=checkbox],
.radio input[type=radio],
.radio-inline input[type=radio] {
    margin-top: -4px;
}


/* Only demo */

@media (max-width: 1000px) {
    .welcome-message {
        display: none;
    }
}


/* ECHARTS  */

.echarts {
    height: 240px;
}

.checkbox-inline,
.radio-inline,
.checkbox-inline+.checkbox-inline,
.radio-inline+.radio-inline {
    margin: 0 15px 0 0;
}

.navbar-toggle {
    background-color: #fff;
}

.J_menuTab {
    -webkit-transition: all .3s ease-out 0s;
    transition: all .3s ease-out 0s;
}

::-webkit-scrollbar-track {
    background-color: #F5F5F5;
}

::-webkit-scrollbar {
    width: 6px;
    background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb {
    background-color: #999;
}


/*GO HOME*/

.gohome {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 100;
}

.gohome a {
    height: 38px;
    width: 38px;
    display: block;
    background: #2f4050;
    padding: 9px 8px;
    text-align: center;
    color: #fff;
    border-radius: 50%;
    opacity: .5;
}

.gohome a:hover {
    opacity: 1;
}

@media only screen and (-webkit-min-device-pixel-ratio : 2){
    #content-main {
        -webkit-overflow-scrolling: touch;
    }
}

.navbar-header {
    width: 60%;
}

.bs-glyphicons {
    margin: 0 -10px 20px;
    overflow: hidden
}

.bs-glyphicons-list {
    padding-left: 0;
    list-style: none
}

.bs-glyphicons li {
    float: left;
    width: 25%;
    height: 115px;
    padding: 10px;
    font-size: 10px;
    line-height: 1.4;
    text-align: center;
    background-color: #f9f9f9;
    border: 1px solid #fff
}

.bs-glyphicons .glyphicon {
    margin-top: 5px;
    margin-bottom: 10px;
    font-size: 24px
}

.bs-glyphicons .glyphicon-class {
    display: block;
    text-align: center;
    word-wrap: break-word
}

.bs-glyphicons li:hover {
    color: #fff;
    background-color: #1ab394;
}

@media (min-width: 768px) {
    .bs-glyphicons {
        margin-right: 0;
        margin-left: 0
    }
    .bs-glyphicons li {
        width: 12.5%;
        font-size: 12px
    }
}


            `;



            // Aggregate parts of the file together
            var fileContent = static1.mhtml.top.replace("_html_", static1.mhtml.head.replace("_styles_", styles) + static1.mhtml.body.replace("_body_", markup.html())) + mhtmlBottom;

            // Create a Blob with the file contents
            var blob = new Blob([fileContent], {
                type: "application/msword;charset=utf-8"
            });
            saveAs(blob, fileName + ".doc");
        };
    })(jQuery);
} else {
    if (typeof jQuery === "undefined") {
        console.error("jQuery Word Export: missing dependency (jQuery)");
    }
    if (typeof saveAs === "undefined") {
        console.error("jQuery Word Export: missing dependency (FileSaver.js)");
    }
}
