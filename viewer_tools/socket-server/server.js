#!/usr/bin/env node
require("amd-loader");

//var sql = require("mssql");
//var sql = require("pgsql");
var config = require('./setting');
var HashMap = require('hashmap');
var express = require('express');
var fs = require('fs');
var app = express(); //require('../app');
var compression = require('compression');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var RabbitHole = require('./rabbitHole');
var Storage = require('node-storage');
var webPush = require('web-push');

const publicVapidKey = "BKg-JjiryYZNMJSb2VrmVhchqVMQh048v0uaktugBPmDNMIBVkGk_XJh6804nYr7ih5TQy6ShM4iI9KPeqLw2XM";
const privateVapidKey = "QhlzIkne0CoBTte09KIcWcGqyEtHbm0bQCY4tC1P1kY";

webPush.setVapidDetails('mailto:syamsu.rizal@jasamedika.co.id', publicVapidKey, privateVapidKey);

app.use(compression());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
}); 

const cors = require('cors');
const whitelist = ["*"];
const corsOptions = {
    credentials: true, // This is important.
    origin: (origin, callback) => {
        if (whitelist.includes(origin))
            return callback(null, true)

        callback(new Error('Not allowed by CORS'));
    }
}

app.use(cors(corsOptions));

app.set('port', 8881);

var server = null

if (config.mode == 'https') {
    console.log('HTTPS')

    var privateKey = fs.readFileSync('/etc/apache2/ssl/transmedic.co.id.key', 'utf8');
    var certificate = fs.readFileSync('/etc/apache2/ssl/transmedic.co.id.crt', 'utf8');
    var chain = fs.readFileSync('/etc/apache2/ssl/transmedic.co.id.csr', 'utf8');

    var credentials = { key: privateKey, cert: certificate , ca:chain};
    var https = require('https');
    server = https.createServer(credentials, app);
} else {
    console.log('HTTP')
    var http = require('http');
    server = http.createServer(app);
}

console.log('RabbitMQ Server Host : %s', config.rabbitMQHost);

server.listen(app.get('port'), function () {
    console.log('Express Server for HTPP / HTTPS Server & Notification Server, listening on port ' + server.address().port);
});

// var io = require('socket.io')(server, { origins: '*'});
var io = require('socket.io')(server, {
    credentials: true, // This is important.
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    },
    allowEIO3: true,
});


//var connectTo = () => {
//   sql.connect(config.pgsql, function (err) {
//       setTimeout(connectTo, 4000);
//        console.log('Broadcast viewer.absensi')
//       if (err) {
//           console.log("connect SQL : " + err);
//           sql.close();
//       } else {
//          var request = new sql.Request();
//          request.query('select KdProfile, TglUpdate from ViewerAbsensi', function (err, result) {
//             if (err) {
//                console.log("request SQL : " + err);
//            } else {    
//               for (let i=0; i<result.recordset.length; i++){
//                     io.emit('viewer.absensi.' + result.recordset[i].KdProfile,JSON.stringify(result.recordset[i]));
//                }
//            }
//            sql.close();
//        });
//     }
//  });
//};

//setTimeout(connectTo, 1000);

// Server ini hanya dari Node ke Browser, dari Browser ke BackEnd lewat RabbitMQ, biar notif tidak hilang di jalan kalau belum login..

var storage = new Storage('./notif.dat');
var desktop = new Storage('./desktop.dat');

var kumpulanSocketByKdRuangan = new HashMap();
var rabbitConnByKdRuangan = new HashMap();
var notifJSONByKdRuangan = new HashMap();

var kdRuanganBySocketId = new HashMap();


var kumpulanSocketByKdJabatan = new HashMap();
var rabbitConnByKdJabatan = new HashMap();
var notifJSONByKdJabatan = new HashMap();

var kdJabatanBySocketId = new HashMap();
var timeupdate = 0;


var notifBroadCast = function (data) {
    //console.log('ada yg daftar ' + data)
    let all = desktop.get('listsub');
    if (all === undefined || all === null) {
        all = [];
    } else {
        all = JSON.parse(all);
    }

    if (all.indexOf(data) < 0) {
        //console.log('ada yg daftar baru' + data)

        let curData = JSON.parse(data);
        let payload = JSON.stringify({
            title: 'HRIS - Bottis',
            body: 'Notifikasi HRIS telah diaktifkan',
            icon: 'https://hris.bottis.co.id/assets/layout/images/logo-bottis-hris.png',
            tag: 'notif-haris-awal',
            data: { url: 'https://hris.bottis.co.id/' }, //the url which we gonna use later
            actions: [{ action: 'open_url', title: 'Browse' }],
            requireInteraction: true,
        });

        webPush.sendNotification(curData.subscription, payload)
            .catch(error => console.error(error));

        all.push(data);
    } else {
        console.log('sudah ada ini');
    }

    desktop.put('listsub', JSON.stringify(all));
};

var sendAllDesktopNotif = function (notif, kdRuangan, kdJabatan) {

    let all = JSON.parse(desktop.get('listsub'));
    if (all !== undefined || all !== null) {
        for (let i = 0; i < all.length; i++) {
            if (all[i] !== undefined && all[i] !== null) {
                let curData = JSON.parse(all[i]);
                let payload = JSON.stringify({
                    title: 'HRIS - Bottis :: Notif',
                    body: notif,
                    icon: 'https://hris.bottis.co.id/assets/layout/images/logo-bottis-hris.png',
                    tag: 'notif-haris-awal-' + (kdRuangan == undefined || kdRuangan == null) ? kdJabatan : kdRuangan
                });

                webPush.sendNotification(curData.subscription, payload)
                    .catch(error => console.error(error));
            }
        }
    }
};


io.on('connection', function (socket) {

    console.log(socket.conn.remoteAddress + " connected");

    socket.on('notif.desktop', notifBroadCast);


    socket.on('klinik.register.server', function (data) {
        console.log('dari server - klinik.register.server : ' + JSON.stringify(data));
        io.emit('klinik.register.client', data);
    });

    socket.on('klinik.register.server.balasan', function (data) {
        console.log('dari client - klinik.register.server.balasan : ' + JSON.stringify(data));
        io.emit('klinik.register.client.balasan', data);
    });

    socket.on('klinik.monitoring.antrian.registrasi.batal.server', function (data) {
        console.log('dari client - klinik.monitoring.antrian.registrasi.batal.server : ' + JSON.stringify(data));
        io.emit('klinik.monitoring.antrian.registrasi.batal.client', data);
    });

    socket.on('performance.progress.bar', function (data) {
        io.emit('performance.progress.bar.frontend', data);
    })

    // Notifikasi Lama

    socket.on('broadcast', function (data) {
        console.log(data);
    });

    socket.on('subscribe', function (data) {
        console.log("ini dia");
        console.log(data);
        try {
            if (data.to === undefined) {
                var arr = data.split('#');
                if (arr.length == 3) {
                    console.log('send to ' + arr[0] + " >> " + arr[1] + '#' + arr[2]);
                    socket.broadcast.emit(arr[0], {
                        message: arr[1] + '#' + arr[2]
                    });

                } else
                    if (arr.length == 2) {
                        console.log('send to ' + arr[0] + " >> " + arr[1]);
                        socket.broadcast.emit(arr[0], {
                            message: arr[1]
                        });

                    } else
                        console.log('kemana yeeeh');
            } else {
                socket.broadcast.emit(data.to, {
                    message: data.message
                });
            }
        } catch (e) {

        }

    });
    // Notifikasi Baru
    // using localstorage

    socket.on('disconnect', function () {
        clearRuangan();
        clearJabatan();
    });

    socket.on('login', function (data) {

        try {
            var peg = JSON.parse(data);
            console.log('User %s berhasil login', peg.namaLengkap);
            socket.broadcast.emit('login', peg);
            // socket.broadcast.emit('loginsaha', peg);  
        } catch (err) {
        }
    });

    socket.on('logout', function (data) {
        try {
            var peg = JSON.parse(data);
            console.log('User %s telah logout', peg.namaLengkap);
            socket.broadcast.emit('logout', peg);
        } catch (err) {
        }
        socket.disconnect();
    });

    socket.on('deleteNotif', function (data) {

        var jsonNotif = JSON.parse(data);

        var cKdRuangan = jsonNotif.kdRuangan;
        var notif = jsonNotif.notif;

        console.log("Notification ruangan yang akan dibuang %s ", JSON.stringify(notif));

        var notifMsg = notifJSONByKdRuangan.get(cKdRuangan);
        console.log("ruangan", JSON.stringify(notifMsg));

        if (notifMsg == undefined || notifMsg == null || notifMsg.length <= 0) {
            notifMsg = storage.get('kdRuangan.' + cKdRuangan);
        }

        if (!(notifMsg == undefined || notifMsg == null || notifMsg.length <= 0)) {

            notifJSONByKdRuangan.set(cKdRuangan, notifMsg);
            var idx = notifMsg.indexOf(notif);
            console.log("Notification idx yang akan dihapus %s ", idx);
            notifMsg.splice(idx, 1);
            console.log("Notification idx yang dihapus %s ", idx);
            storage.put('kdRuangan.' + cKdRuangan, notifMsg);
            io.emit('listNotif.ruangan.' + cKdRuangan, JSON.stringify(notifMsg));

        }

        /////////////////////////////////////////////////////////////

        var cKdJabatan = jsonNotif.kdJabatan;
        var notif = jsonNotif.notif;

        console.log("Notification jabatan yang akan dibuang %s ", JSON.stringify(notif));

        var notifMsg = notifJSONByKdJabatan.get(cKdJabatan);
        console.log("jabatan", JSON.stringify(notifMsg));

        if (notifMsg == undefined || notifMsg == null || notifMsg.length <= 0) {
            notifMsg = storage.get('kdJabatan.' + cKdJabatan);
        }

        if (!(notifMsg == undefined || notifMsg == null || notifMsg.length <= 0)) {
            notifJSONByKdJabatan.set(cKdJabatan, notifMsg);
            var idx = notifMsg.indexOf(notif);
            console.log("Notification idx yang akan dihapus %s ", idx);
            notifMsg.splice(idx, 1);
            console.log("Notification idx yang dihapus %s ", idx);
            storage.put('kdJabatan.' + cKdJabatan, notifMsg);
            io.emit('listNotif.jabatan.' + cKdJabatan, JSON.stringify(notifMsg));
        }
    });

    //////////////////// RUANGAN /////////////////////////////////

    var clearRuangan = function () {

        console.log('socket dan ruangan dibersihkan');

        kdRuanganBySocketId.set(socket.id, cKdRuangan);
        var cKdRuangan = kdRuanganBySocketId.get(socket.id);

        var totalSocket = kumpulanSocketByKdRuangan.get(cKdRuangan);
        var rabbit = {};

        if (totalSocket == undefined || totalSocket == null) {
            rabbit = rabbitConnByKdRuangan.get(cKdRuangan);
            if (rabbit == undefined || rabbit == null) {
                return;
            }
            rabbit.disconnect();
            rabbitConnByKdRuangan.set(cKdRuangan, null);
            return;
        }

        var idx = totalSocket.indexOf(socket.id);
        totalSocket.splice(idx, 1);

        if (totalSocket.length <= 0) {
            kumpulanSocketByKdRuangan.set(cKdRuangan, null);
            rabbit = rabbitConnByKdRuangan.get(cKdRuangan);
            if (rabbit == undefined || rabbit == null) {
                return;
            }
            rabbit.disconnect();
            rabbitConnByKdRuangan.set(cKdRuangan, null);
        }
    }

    //////////////////// JABATAN /////////////////////////////////

    var clearJabatan = function () {

        console.log('socket dan jabatan dibersihkan');

        kdJabatanBySocketId.set(socket.id, cKdJabatan);
        var cKdJabatan = kdJabatanBySocketId.get(socket.id);

        var totalSocket = kumpulanSocketByKdJabatan.get(cKdJabatan);
        var rabbit = {};

        if (totalSocket == undefined || totalSocket == null) {
            rabbit = rabbitConnByKdJabatan.get(cKdJabatan);
            if (rabbit == undefined || rabbit == null) {
                return;
            }
            rabbit.disconnect();
            rabbitConnByKdJabatan.set(cKdJabatan, null);
            return;
        }

        var idx = totalSocket.indexOf(socket.id);
        totalSocket.splice(idx, 1);

        if (totalSocket.length <= 0) {
            kumpulanSocketByKdJabatan.set(cKdJabatan, null);
            rabbit = rabbitConnByKdJabatan.get(cKdJabatan);
            if (rabbit == undefined || rabbit == null) {
                return;
            }
            rabbit.disconnect();
            rabbitConnByKdJabatan.set(cKdJabatan, null);
        }
    }

    //////////////////// RUANGAN /////////////////////////////////  

    socket.on('kdRuangan', function (data) {

        var cKdRuangan = data;

        console.log(" [*] ada user dari  ruangan : %s ...", cKdRuangan);

        kdRuanganBySocketId.set(socket.id, cKdRuangan);

        var notifMsg = notifJSONByKdRuangan.get(cKdRuangan);

        if (notifMsg == undefined || notifMsg == null || notifMsg.length <= 0) {
            notifMsg = storage.get('kdRuangan.' + cKdRuangan);
        }

        if (notifMsg == undefined || notifMsg == null || notifMsg.length <= 0) {
            notifMsg = [];
            storage.put('kdRuangan.' + cKdRuangan, notifMsg);
        }

        notifJSONByKdRuangan.set(cKdRuangan, notifMsg);


        var totalSocket = kumpulanSocketByKdRuangan.get(cKdRuangan);

        if (totalSocket == undefined || totalSocket == null || totalSocket.length <= 0) {
            totalSocket = [];
            kumpulanSocketByKdRuangan.set(cKdRuangan, totalSocket);
        }

        if (notifMsg.length > 0) {
            console.log("kirimkan notif yang sudah ada donk.." + 'listNotif.ruangan.' + cKdRuangan);
            socket.emit('listNotif.ruangan.' + cKdRuangan, JSON.stringify(notifMsg));
            //for (let i=0; i<notifMsg.length; i++){
            //    sendAllDesktopNotif(JSON.stringify(notifMsg[i]));
            //}
        }

        totalSocket.push(socket.id);
        var rabbit = rabbitConnByKdRuangan.get(cKdRuangan);

        if (rabbit == undefined || rabbit == null) {
            rabbit = new RabbitHole();
            rabbitConnByKdRuangan.set(cKdRuangan, rabbit);

            rabbit.connect(config.rabbitMQHost, function (conn) {
                conn.createChannel().then(function (ch) {
                    try {
                        console.log(" [*] Menunggu pesan dari Queue : %s ...", cKdRuangan);


                        var callbackConsume = function (msg) {
                            //console.log(" [x] Ruangan : %s Menerima pesan %s", cKdRuangan, msg.content.toString());

                            var totalSocket = kumpulanSocketByKdRuangan.get(cKdRuangan);

                            if (totalSocket == undefined || totalSocket == null || totalSocket.length <= 0) {
                                ch.nack(msg, false, true);
                                rabbit.disconnect();
                                rabbitConnByKdRuangan.set(cKdRuangan, null);
                            } else {


                                var notif = msg.content.toString();
                                ch.ack(msg);
                                sendAllDesktopNotif(notif);

                                var notifMsgLocal = notifJSONByKdRuangan.get(cKdRuangan);


                                console.log('simpan notif ke penyimpanan %s', 'kdRuangan.' + cKdRuangan);

                                notifMsgLocal.push(JSON.parse(notif));


                                storage.put('kdRuangan.' + cKdRuangan, notifMsgLocal);

                                //                                console.log('kirim pesan ke ruangan %d isinya %s', cKdRuangan, JSON.stringify(notifMsg));

                                io.emit('listNotif.ruangan.' + cKdRuangan, JSON.stringify(notifMsgLocal));
                            }
                        };

                        var common_options = { durable: true, noAck: false };

                        console.log('consume ruangan %s', cKdRuangan);

                        ch.assertQueue(cKdRuangan, common_options).then();
                        ch.consume(cKdRuangan, callbackConsume, common_options);

                    } catch (err) {
                        console.error('Ada error saat baca Channel, abaikan. Errornya : %s', err)
                    }
                }).then(null, function (err) {
                    console.error('Gagal bikin channel karena %s ', err);
                });
            });
        }
    });

    //////////////////// JABATAN /////////////////////////////////

    socket.on('kdJabatan', function (data) {

        var cKdJabatan = data;

        console.log(" [*] ada user dengan jabatan : %s ...", cKdJabatan);

        kdJabatanBySocketId.set(socket.id, cKdJabatan);

        var notifMsg = notifJSONByKdJabatan.get(cKdJabatan);

        if (notifMsg == undefined || notifMsg == null || notifMsg.length <= 0) {
            notifMsg = storage.get('kdJabatan.' + cKdJabatan);
        }

        if (notifMsg == undefined || notifMsg == null || notifMsg.length <= 0) {
            notifMsg = [];
            storage.put('kdJabatan.' + cKdJabatan, notifMsg);
        }

        notifJSONByKdJabatan.set(cKdJabatan, notifMsg);

        var totalSocket = kumpulanSocketByKdJabatan.get(cKdJabatan);

        if (totalSocket == undefined || totalSocket == null || totalSocket.length <= 0) {
            totalSocket = [];
            kumpulanSocketByKdJabatan.set(cKdJabatan, totalSocket);
        }

        if (notifMsg.length > 0) {
            console.log("kirimkan notif yang sudah ada donk.. " + 'listNotif.jabatan.' + cKdJabatan);
            socket.emit('listNotif.jabatan.' + cKdJabatan, JSON.stringify(notifMsg));
            //for (let i=0; i<notifMsg.length; i++){
            //    sendAllDesktopNotif(JSON.stringify(notifMsg[i]));
            //}
        }

        totalSocket.push(socket.id);
        var rabbit = rabbitConnByKdJabatan.get(cKdJabatan);

        if (rabbit == undefined || rabbit == null) {
            rabbit = new RabbitHole();
            rabbitConnByKdJabatan.set(cKdJabatan, rabbit);

            rabbit.connect(config.rabbitMQHost, function (conn) {
                conn.createChannel().then(function (ch) {
                    try {
                        console.log(" [*] Menunggu pesan dari Queue : %s ...", cKdJabatan);


                        var callbackConsume = function (msg) {
                            //console.log(" [x] Ruangan : %s Menerima pesan %s", cKdJabatan, msg.content.toString());

                            var totalSocket = kumpulanSocketByKdJabatan.get(cKdJabatan);

                            if (totalSocket == undefined || totalSocket == null || totalSocket.length <= 0) {
                                ch.nack(msg, false, true);
                                rabbit.disconnect();
                                rabbitConnByKdJabatan.set(cKdJabatan, null);
                            } else {


                                var notif = msg.content.toString();
                                ch.ack(msg);
                                sendAllDesktopNotif(notif);

                                var notifMsgLocal = notifJSONByKdJabatan.get(cKdJabatan);

                                console.log('simpan notif ke penyimpanan %s', 'kdJabatan.' + cKdJabatan);

                                //                               var dataNotif = JSON.parse(notif);

                                // if ((dataNotif.data === undefined || dataNotif.data === null) || (dataNotif.tipe !== 1)) {
                                //     return;
                                // }

                                notifMsgLocal.push(JSON.parse(notif));
                                storage.put('kdJabatan.' + cKdJabatan, notifMsgLocal);

                                console.log('kirim pesan ke %s isinya %s', 'listNotif.jabatan.' + cKdJabatan, JSON.stringify(notifMsg));

                                io.emit('listNotif.jabatan.' + cKdJabatan, JSON.stringify(notifMsgLocal));
                            }
                        };

                        var common_options = { durable: true, noAck: false };

                        console.log('consume jabatan %s', cKdJabatan);

                        ch.assertQueue(cKdJabatan, common_options).then();
                        ch.consume(cKdJabatan, callbackConsume, common_options);

                    } catch (err) {
                        console.error('Ada error saat baca Channel, abaikan. Errornya : %s', err)
                    }
                }).then(null, function (err) {
                    console.error('Gagal bikin channel karena %s ', err);
                });
            });
        }
    });
      socket.on('load-caller', function (data) {

        var dataCaller = data;

        console.log(" [*] load list no antrian ");

        io.emit('get-list-antrian', JSON.stringify(dataCaller));

    });
    socket.on('call-antrian-poli', function (data) {

        var dataCaller = data;

        console.log(" [*] ada panggilan poli dengan data : %s ...", dataCaller);

        io.emit('tampilkan-antrian-poli', JSON.stringify(dataCaller));

    });
    
    socket.on('refresh-form-dokter-perawat', function () {
        console.log(" [*] ada pasien yang daftar poli dengan data ");
        io.emit('gas-refresh-form-dokter-perawat');
    });
    socket.on('call-antrian-farmasi', function (data) {

        var dataCaller = data;

        console.log(" [*] ada panggilan farmasi dengan data : %s ...", dataCaller);

        io.emit('tampilkan-antrian-farmasi', JSON.stringify(dataCaller));

    });
    socket.on('send-notif', function (data) {
        try {
        
            console.log(" [*] ada notif : %s ...", data);
            io.emit('terima-notif', JSON.stringify(data));
        } catch (err) {
            console.log(" [*] error notif : %s ...", err);
        }
      
     
    });
    socket.on('list-notif', function (data) {
        socket.emit('list-notif', JSON.stringify(data));
    });

    socket.on('panggil-antrian', function (data) {

        var dataCaller = data;

        console.log(" [*] ada panggilan farmasi dengan data : %s ...", dataCaller);

        io.emit('tampilkan-antrian-apotik', JSON.stringify(dataCaller));

    });
    socket.on('reload-antrianapotik', function (data) {

        var dataCaller = data;

        console.log(" munculih", dataCaller);

        io.emit('reload-antriancoy', JSON.stringify(dataCaller));

    });
    
});
