var express = require('express');
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var server = require('http').createServer(app);
app.use('/', express.static(__dirname + '/dist'));
server.listen(7788, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("listen "+host+":"+port);
});



//
//获取系统网卡信息
var ipconfig = require('os').networkInterfaces();
// console.log(ipconfig);
var address;
//获取当前操作系统
var type = require('os').type();
if(type == "Linux"){
    address = ipconfig.eth0[0].address;
}else{
    address = get_object_first_attribute(ipconfig)[1].address;
}
console.log(address);
//配置 app名称  和 注册地址
var appServiresName = "xinghuo-apaas-node-projectms";
var eurekaServiceUrl =[];
if(true){
    // eurekaServiceUrl = ["http://68.61.8.133:1001/eureka/apps/","http://68.61.8.134:1001/eureka/apps/","http://68.61.8.135:1001/eureka/apps/"]; // 正式环境注册中心地址
    eurekaServiceUrl = ["http://xh-registry-center-1:8001/eureka/apps/","http://xh-registry-center-2:8001/eureka/apps/","http://xh-registry-center-3:8001/eureka/apps/"]; // 测试环境注册中心地址
}

//注册服务
var resgEureka = require('./src/js/resgEureka.js');
resgEureka.init(address,server.address().port,appServiresName,eurekaServiceUrl);
//心跳接口
app.get('/health', (req, res) => {
    res.json({
        status: 'UP'
    });
});

// 访问端口
app.get('/', (req, res, next) => {
    res.json({status: true,message:"It's works!"});
});


function get_object_first_attribute(data){
    for (var key in data)
        return data[key];
}

