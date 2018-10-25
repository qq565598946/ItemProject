let Eureka = require('eureka-client').Eureka;

function init(ip,port,appServiresName,eurekaServiceUrl){
    console.log(ip,port,appServiresName,eurekaServiceUrl);
    let client = new Eureka({
        instance: {
            app: appServiresName,//注册本服务名称
            //instanceId: require('uuid').v1(),//注册本服务实例编号，此处可随机生成一个
            instanceId: ip+":"+port,
            hostName: ip,//本服务IP地址
            ipAddr: ip,//本服务IP地址
            statusPageUrl: "http://"+ip+":"+port,//本服务IP地址和端口号
            healthCheckUrl: "http://"+ip+":"+port+"/health",//本服务IP地址和端口号
            //healthCheckUrl: "http://127.0.0.1:5566/health",//本服务IP地址和端口号
            port: {
                '$': port,//服务端口号
                '@enabled': 'true',
            },
            vipAddress: appServiresName,//注册应用名称
            dataCenterInfo: {
                '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                name: 'MyOwn',
            },
        },
        eureka: {
            serviceUrl: eurekaServiceUrl,//eureka的地址
        },
    });
    client.start(function(error) {
        if(error){
            eurekaUrl = null;
            console.log('注册Eureka失败');
            reject(error)
        }else{
            console.log('服务已成功注册Eureka');
        }
    });
}

module.exports = {
    init: init
};
