function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

var solution;           //项目地址
var fileService_Url;    //文件服务
var GetaWay_url;         // 网关地址

//测试环境	http://68.72.86.251/szga/			公安网
//测试环境	http://172.29.3.76:9238/szga/	    移动专网
//正式环境	http://68.61.8.125/szga/	        公安网
//正式环境	http://172.29.3.76:9219/szga/	    移动专网


// var access_token = GetQueryString('access_token');

sessionStorage.setItem("access_token","ea16c6bcc71e4cafa9678e89d09b3901");

var differentiateNetwork = 1 ;   // 公安网:0    移动专网:1

    if(differentiateNetwork==1){

        /*-------------------------------------------------------JMT------------------------------------------------------------*/

        solution = "xinghuo-apaas-pms-solution/pms/solution/v1";            // 服务名字
        // solution = "xinghuo-apaas-pms-solution-dev/pms/solution/v1";            // 服务名字

        var appID = "ed2c076f86834ee0bc3dfa54d0f2daf7";                     // 应用ID

        var appSecretKey = "D82AAE335BDFB4FDDB80BDDA20B064C6";              // 应用密钥

        GetaWay_url = "http://172.29.3.76:9238/szga/";                      // JMT环境地址

        fileService_Url = "xinghuo-apaas-s3fileservice/s3fileservice";      // 文件服务

    }else if(differentiateNetwork==0){

        /*--------------------------------------------------公安网测试环境------------------------------------------------------------*/

        solution = "xinghuo-apaas-pms-solution/pms/solution/v1";        // 服务名字

        GetaWay_url = "http://68.72.86.251/szga/";              	    // 公安网环境地址

        fileService_Url = "xinghuo-apaas-s3fileservice/s3fileservice";  // 文件服务

        var appID = "ed2c076f86834ee0bc3dfa54d0f2daf7";                 // 应用ID

        var appSecretKey = "D82AAE335BDFB4FDDB80BDDA20B064C6";          // 应用密钥


        // var appID = "f3295b7e695145509ce6f55de679f1e1";                 // 应用ID
        //
        // var appSecretKey = "D82AAE335BDFB4FDDB80BDDA20B064C6";          // 应用密钥

    }else{

        /*--------------------------------------------------公安网正式环境------------------------------------------------------------*/

        solution = "xinghuo-apaas-pms-solution/pms/solution/v1";        // 服务名字

        GetaWay_url = "http://68.61.8.125/szga/";              	    // 公安网环境地址

        fileService_Url = "xinghuo-apaas-s3fileservice/s3fileservice";  // 文件服务

        var appID = "ed2c076f86834ee0bc3dfa54d0f2daf7";                 // 应用ID

        var appSecretKey = "D82AAE335BDFB4FDDB80BDDA20B064C6";          // 应用密钥

    }




// #正式的
// # 应用
// appID=ed2c076f86834ee0bc3dfa54d0f2daf7
// appSecretKey=D82AAE335BDFB4FDDB80BDDA20B064C6






// fileService_Url = "http://172.28.0.56:9119/FileService";      // 文件服务
// authorization_Id = "f3295b7e695145509ce6f55de679f1e1";
// authorization_SecretKey = "30636034E3DFD48100C0E3DE40E3AF69";
