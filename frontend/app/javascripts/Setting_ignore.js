define([], function () {
    'use strict';
    if (window.location.hostname.indexOf('36.89') > -1) {
        return { 

            // BaseUrl: 'http://localhost:2222/app/data/GetRouting',
            // RouteUrl: 'http://localhost:2222/app/data/GetRouting',
            UrlDataConfig: 'http://localhost:2222/app/data/GetRequireConfig',         
            urlSocket: 'http://localhost:2222',
            baseUrlData: "http://localhost:2222/app/data/",         
            urlRoute: 'http://localhost:2222/app/data/GetRouting',
            urlRoutePelayanan: 'http://localhost:2222/app/data/GetRoutingPelayanan',
            urlRouteSarpras: 'http://localhost:2222/app/data/GetRoutingSarpras',
            urlRouteKeuangan: 'http://localhost:2222/app/data/GetRoutingKeuangan',
            urlRouteManagemen: 'http://localhost:2222/app/data/GetRoutingManagemen',
            urlRouteSDM: 'http://localhost:2222/app/data/GetRoutingSDM',

            baseUrlLogin: "http://localhost:8000/service/medifirst2000/auth/sign-in",
            baseUrlLogout: "http://localhost:8000/service/medifirst2000/auth/sign-out",
            baseApiBackend: 'http://localhost:8000/service/medifirst2000/',
            baseProfileMenu: 1, 

            rabbitMQHost: 'amqp://rsab:rsab@192.168.12.2'

        };
    } else {
        return {
           // BaseUrl: 'http://localhost:2222/app/data/GetRouting',
            // RouteUrl: 'http://localhost:2222/app/data/GetRouting',
            UrlDataConfig: 'http://localhost:2222/app/data/GetRequireConfig',         
            urlSocket: 'http://localhost:2222',
            baseUrlData: "http://localhost:2222/app/data/",         
            urlRoute: 'http://localhost:2222/app/data/GetRouting',
            urlRoutePelayanan: 'http://localhost:2222/app/data/GetRoutingPelayanan',
            urlRouteSarpras: 'http://localhost:2222/app/data/GetRoutingSarpras',
            urlRouteKeuangan: 'http://localhost:2222/app/data/GetRoutingKeuangan',
            urlRouteManagemen: 'http://localhost:2222/app/data/GetRoutingManagemen',
            urlRouteSDM: 'http://localhost:2222/app/data/GetRoutingSDM',

            baseUrlLogin: "http://localhost:8000/service/medifirst2000/auth/sign-in",
            baseUrlLogout: "http://localhost:8000/service/medifirst2000/auth/sign-out",
            baseApiBackend: 'http://localhost:8000/service/medifirst2000/',
            baseProfileMenu: 1, 

            rabbitMQHost: 'amqp://rsab:rsab@192.168.12.2'

        };
    }
});