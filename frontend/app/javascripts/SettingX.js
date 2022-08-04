define([], function() {
    'use strict';
    return {
        BaseUrl: 'http://localhost:2222/app/data/GetRouting',
        RouteUrl: 'http://localhost:2222/app/data/GetRouting',
        UrlDataConfig: 'http://localhost:2222/app/data/GetRequireConfig',
        baseUrlSerelize: "http://localhost:2222/app/data/Form/",

        urlSocket: 'http://localhost:2222',
        
        urlPrinting: 'http://localhost:8000/jasamedika-web/',
        baseUrlListData: "http://localhost:8000/jasamedika-web/service/list-generic/?view=",
        baseApiUrlData: "http://localhost:8000/jasamedika-web/",
        baseApiPostData: "http://localhost:8000/jasamedika-web/",
        baseUrlData: "http://localhost:2222/app/data/",
        baseUrlAction: "http://localhost:8000/jasamedika-web/",
        baseUrlLogin: "http://localhost:8000/jasamedika-web/auth/sign-in",
        baseUrlLogout: "http://localhost:8000/jasamedika-web/auth/sign-out",
        baseBridiging: "http://172.16.16.56/Bridging/",
        urlRoute: 'http://localhost:2222/app/data/GetRouting',

        urlRoute_Akuntansi: 'http://localhost:2222/app/data/GetRoutingAkuntansi',
        urlDataGeneric_Akuntansi: 'http://192.168.0.246:8000/service/list-generic/?view=',
        urlDataTableMaster_Akuntansi: 'http://192.168.0.246:8000/service/master/',
        urlDataTableTransaksi_Akuntansi: 'http://192.168.0.246:8000/service/transaksi/',
        baseApiPostData_Akuntansi: 'http://192.168.0.246:8000/service/',

        rabbitMQHost : 'amqp://rsab:rsab@172.16.16.61'

    };
});