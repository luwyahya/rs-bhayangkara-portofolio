define(['initialize', 'Configuration'], function (initialize, config) {

    'use strict';
    initialize.controller('DaftarPasienEClaimCtrl', ['MedifirstService', '$scope', '$state',
        function (medifirstService, $scope, $state) {
            $scope.title = "Daftar Pasien E-Claim";
            $scope.dataVOloaded = false;
            $scope.isRouteLoading = false;
            $scope.istempatLaporan = true;
            $scope.now = new Date();
            // $scope.data = {};
            $scope.item = {
                from: $scope.now,
                until: $scope.now
            };
            $scope.findData = function () {
                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.from).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.item.until).format('YYYY-MM-DD');

                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noReg=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noRm != undefined) {
                    var rm = "&noCm=" + $scope.item.noRm
                }
                var nama = ""
                if ($scope.item.namaPasien != undefined) {
                    var nama = "&namaPasien=" + $scope.item.namaPasien
                }
                medifirstService.get("registrasi/get-daftar-pasien-eclaim?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    reg +
                    rm +
                    nama).then(function (e) {
                        $scope.isRouteLoading = false;

                        $scope.dataPasienBatal = new kendo.data.DataSource({
                            data: e.data.data,
                            pageable: true,
                            pageSize: 1000,
                            total: e.data.data.length,
                            serverPaging: false,
                            // group: {
                            //     field: "tglmeninggal",
                            //     aggregates: [{
                            //         field: "noregistrasi",
                            //         aggregate: "count"
                            //     }, {
                            //         field: "namapasien",
                            //         aggregate: "count"
                            //     }]
                            // }
                        });
                    })

            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.findData();
            $scope.mainGridOptions = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarPasienMeninggal.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:F1"];
                    sheet.name = "Reservasi";

                    var myHeaders = [{
                        value: "Daftar Pasien Meninggal",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [{
                    field: "tglregistrasi",
                    title: "Tgl Registrasi",
                    template: "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>",
                    width: "180px",

                },
                {
                    field: "noregistrasi",
                    title: "No Reg",
                    hidden: false,
                    width: "100px",
                },
                {
                    field: "nocm",
                    title: "No Rm",
                    hidden: false,
                    width: "100px",
                },
                {
                    field: "namapasien",
                    title: "Nama Pasien",
                    width: "250px",
                },
                {
                    field: "namaruangan",
                    title: "Nama Ruangan",
                    width: "200px",
                },
                {
                    "field": "namadokter",
                    "title": "Nama Dokter",
                    "width": "200px",
                    "template": '# if( namadokter==null) {# - # } else {# #= namadokter # #} #'
                },
                {
                    "field": "kelompokpasien",
                    "title": "Kelompok Pasien",
                    "width": "100px",
                    "template": "<span class='style-left'>#: kelompokpasien #</span>"
                },
                {
                    "field": "namarekanan",
                    "title": "Penjamin",
                    "width": "200px",
                    "template": '# if( namarekanan==null) {# - # } else {# #= namarekanan # #} #'
                }
                ],
                selectable: "row",
                sortable: true
            }

            $scope.show = function () {
                if ($scope.data) {
                    $scope.popUpShow.center().open();
                } else {
                    messageContainer.error('Pasien belum di pilih')
                }
            }

            $scope.tutuPopUpShow = function () {
                $scope.popUpShow.center().close();
            }

            $scope.cetakSEP = function (x) {
                debugger;
                if ($scope.data.noregistrasi != undefined && $scope.data.kelompokpasien !== "Umum/Pribadi") {

                    // //##save identifikasi sep
                    // medifirstService.get("registrasi/identifikasi-sep?norec_pd="
                    //     + $scope.cacheNorecPD
                    // ).then(function (data) {
                    //     var datas = data.data;
                    // })
                    // //##end

                    // // var noSep = e.data.data === null ? "2423432" : e.data.data;
                    // // var fixUrlLaporan = cetakHelper.open("asuransi/asuransiBPJS?noSep=" + $scope.model.noSep);
                    // // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    // //http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep=1&norec=1708000087&view=true   
                    // //cetakan langsung service VB6 by grh    
                    // var client = new HttpClient();
                    // client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-sep-new=1&norec=' + $scope.cacheNoRegistrasi + '&view=false', function (response) {
                    //     // do something with response
                    // });
                    medifirstService.get("sysadmin/settingdatafixed/get-report?namareport=sep" +
                        '&norec=' + $scope.data.noregistrasi
                    ).then(function (data) {
                        debugger;
                        var data = data.data.data;
                        $("#nosepx").text(data[0].nosep);
                        $("#nopendaftaran").text(data[0].noregistrasi);
                        $("#tglsep").text(data[0].tanggalsep);
                        $("#peserta").text(data[0].jenispeserta);
                        $("#nokartu").text(data[0].nokepesertaan + ' / ' + data[0].nocm);
                        // $("#cob").text(data[0].penjaminlaka);
                        $("#namapeserta").text(data[0].namapeserta);
                        $("#jenisrawat").text(data[0].jenisrawat);
                        $("#tgllahir").text((moment(data[0].tgllahir).format('YYYY-MM-DD')));
                        $("#kelasrawat").text(data[0].namakelas);
                        $("#notelepon").text(data[0].notelpmobile);
                        $("#penjamin").text(data[0].penjaminlakalantas);
                        $("#politujuan").text(data[0].namaruanganfix);
                        $("#prolanis").text(data[0].prolanisprb);
                        $("#faskesperujuk").text(data[0].nmprovider);
                        $("#diagnosaawal").text(data[0].namadiagnosa);
                        $("#catatan").text(data[0].catatan);
                        $("#cetakanke").text(1);
                        $("#namadjpjmelayani").text(data[0].namadjpjpmelayani);

                        var printdata = document.getElementById(x);
                        printdata = printdata.innerHTML;
                        // var editor = $("#editor").data("kendoEditor");
                        // editor.value(printdata);

                        var htmlStart =
                            '<!DOCTYPE html>' +
                            '<html style="border:none;border-color: white">' +
                            '<head style="border:none;border-color: white">' +
                            // '<div class="header" style="position: fixed;top: 0;">'+
                            // header +
                            '<style>' +
                            'html { font: 11pt sans-serif; }' +
                            '.k-grid { border-top-width: 0; }' +
                            '.k-grid, .k-grid-content { height: auto !important; }' +
                            '.k-grid-content { overflow: visible !important; }' +
                            '.k-grid .k-grid-header th { border-top: none; }' +
                            '.k-grid-toolbar, .k-grid-pager > .k-link { display: none; }' +
                            '</style>' +
                            '</div>' +
                            '</head>' +
                            '<body onload="window.print();window.close()" style="border:none; border-color: white">' +
                            '<table  style="border:none; border-color: white">' +
                            '<thead style="border:none;border-color: white">' +
                            '<tr style="border:none;border-color: white">' +
                            '<td style="border:none;border-color: white">' +
                            // '<div class="page-header-space"></div>' +
                            '<div style="border:none;border-color: white">' +
                            // header +                                
                            '</div>' +
                            '</td>' +
                            '</tr>' +
                            '</thead>' +
                            '<tbody>' +
                            '<tr>' +
                            '<td>'
                        var htmlEnd =
                            '</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</body>' +
                            '</div>' +


                            '</html>';
                        var printdata = document.getElementById(x);
                        printdata = printdata.innerHTML;
                        printdata = htmlStart + printdata + htmlEnd;
                        // var editor = $("#editor").data("kendoEditor");
                        // editor.value(printdata);

                        // var cetakan=htmlStart + printableContent + htmlEnd;
                        var WindowObject = window.open('', 'PrintWindow', 'width=1200,height=800,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');


                        WindowObject.document.writeln(printdata);
                        WindowObject.document.close();
                        WindowObject.focus();

                    })
                } else {
                    toastr.warning("Pasien Selain Bpjs Tidak Bisa Cetak Sep!");
                    return;
                }
            }


            $scope.cetakApotikJasper = function () {
                debugger

                $scope.isRouteLoading = true;

                var ruanganLast = "";
                var total = "";
                var namauser = "anto";

                // medifirstService.get("tatarekening/detail-tagihan/" + $scope.data.noregistrasi + '?jenisdata=bill').then(function (dat) {
                medifirstService.get("tatarekening/get-data-login-cetakan-ruangan-last?noregistrasi=" + $scope.data.noregistrasi, true).then(function (dat) {
                    ruanganLast = dat.data[0].namaruangan;
                    medifirstService.get("tatarekening/get-data-login-cetakan?noregistrasi=" + $scope.data.noregistrasi, true).then(function (dat) {
                        total = "Rp." + " " + parseFloat(dat.data[0].total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        var data = {
                            "gambarLogo": "logo_rs.jpg",
                            "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi", "lastruangan", "total"],
                            "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "1980-12-25 00:00:00", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", namauser, $scope.data.noregistrasi,
                                ruanganLast, total
                            ],
                            "paramType": ["", "date", "", "", "", "", ""]
                        };

                        var xhr = new XMLHttpRequest();
                        xhr.onreadystatechange = function () {
                            if (this.readyState == 4 && this.status == 200) {
                                //this.response is what you're looking for
                                // handler(this.response);
                                console.log(this.response, typeof this.response);
                                //var res = this.response
                                //var file = new Blob( [res], {type: 'application/pdf'});
                                debugger;
                                var url = window.URL.createObjectURL(this.response)
                                var pdf = document.getElementById('tempatLaporan');
                                pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                                var win = window.open(url, '_blank');
                                win.focus();
                            }
                        }

                        if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                            xhr.open('POST', 'http://192.168.0.62:1002/generic/report/rekapbillingApotik.pdf');
                        } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                            xhr.open('POST', 'http://192.168.88.56:1002/generic/report/rekapbillingApotik.pdf');
                        } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                            xhr.open('POST', 'http://10.10.20.167:1002/generic/report/rekapbillingApotik.pdf');
                        } else {
                            xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingApotik.pdf');
                        }

                        // set `Content-Type` header
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                        xhr.responseType = 'blob';
                        // send rquest with JSON payload
                        xhr.send(JSON.stringify(data));
                        $scope.isRouteLoading = false;
                    });

                });
                // });
            }


            $scope.cetakEkspertise = function () {
                debugger
                medifirstService.get('radiologi/get-hasil-radiologi-claim?noregistrasi=' + $scope.data.noregistrasi).then(function (e) {
                    // if (e.data.length > 0) {
                    for (let i = 0; i < e.data.length; i++) {
                        $scope.norecHasilRadiologi = e.data[i].norec
                        $scope.item.nofoto = e.data[i].nofoto
                        $scope.item.tglInput = new Date(e.data[i].tanggal)
                        $scope.item.dokter = { id: e.data[i].pegawaifk, namalengkap: e.data[i].namalengkap }
                        $scope.item.keterangan = e.data[i].keterangan; //.replace(/~/g, "\n")

                        $scope.item.dokterperujuk = { id: e.data[i].dokterperujuk, namalengkap: e.data[i].namadokterperujuk }
                        $scope.item.ruanganperujuk = { id: e.data[i].ruanganperujukfk, namaruangan: e.data[i].namaruangan }


                        if ($scope.norecHasilRadiologi != '') {
                            var local = JSON.parse(localStorage.getItem('profile'))
                            var nama = medifirstService.getPegawaiLogin().namaLengkap
                            if (local != null) {
                                var profile = local.id;
                                window.open(config.baseApiBackend + "report/cetak-ekspertise?norec=" + $scope.norecHasilRadiologi + '&kdprofile=' + profile +
                                    '&nama=' + nama, '_blank');
                            }
                        }
                    }
                    // }
                })

            }

            $scope.cetakLaboratorium = function () {
                debugger
                const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                const firstDate = new Date($scope.data.tgllahir);
                const secondDate = new Date($scope.data.tglregistrasi);
                var umurDay = Math.round(Math.abs((firstDate - secondDate) / oneDay));
                medifirstService.get('radiologi/get-hasil-lab-claim?noregistrasi=' + $scope.data.noregistrasi).then(function (e) {
                    // if (e.data.length > 0) {
                    var dataCetakFix = '';
                    // var tglpp = '';
                    var cetak = true;
                    var tglpp = moment($scope.item.from).format('YYYY-MM-DD HH:mm');
                    for (let i = 0; i < e.data.length; i++) {
                        // $scope.norecHasilRadiologi = e.data[i].norec
                        // $scope.item.nofoto = e.data[i].nofoto
                        // $scope.item.tglInput = new Date(e.data[i].tanggal)
                        // $scope.item.dokter = { id: e.data[i].pegawaifk, namalengkap: e.data[i].namalengkap }
                        // $scope.item.keterangan = e.data[i].keterangan;//.replace(/~/g, "\n")

                        const element = e.data[i];
                        if (e.data[i].tglpelayanan === tglpp) {
                            if (e.data.length == 1) {
                                dataCetakFix = "'" + element.norec_pp + "'"
                            } else if (e.data.length == i + 1) {
                                dataCetakFix = dataCetakFix + "" + "'" + element.norec_pp + "'" + ""
                            } else {
                                dataCetakFix = dataCetakFix + "" + "'" + element.norec_pp + "'" + ","
                            }
                            cetak = false;
                        } else {
                            var dataCetakFix = "'" + element.norec_pp + "'";
                            tglpp = e.data[i].tglpelayanan;
                            cetak = true;
                            // } else {
                            //     var dataCetakFix = "'" + element.norec_pp + "'";
                        }




                        if (cetak === true) {

                            // medifirstService.get("radiologi/get-rincian-pelayanan?noReg=" + $scope.item.noregistrasi).then(function (data) {
                            //     debugger
                            //     if(data.data.datas == undefined)
                            //     {
                            //         diagnosa= "-";
                            //     }else{
                            //        if(data.data.datas[0].namadiagnosa != null){
                            //         diagnosa= data.data.datas[0].namadiagnosa;
                            //        }else
                            //        {
                            //         diagnosa= "-";
                            //        }

                            //     }
                            // });

                            var diagnosa = "";
                            medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + $scope.data.noregistrasi).then(function (data) {
                                debugger
                                if (data.data.datas == undefined) {
                                    diagnosa = "-";
                                } else {
                                    if (data.data.datas[0].namadiagnosa != null) {
                                        diagnosa = data.data.datas[0].namadiagnosa;
                                    } else {
                                        diagnosa = "-";
                                    }
                                }
                            });


                            var user = medifirstService.getPegawaiLogin();

                            var tgl = moment(element.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                            var tglhasil = moment(element.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                            var dokterpengirim = element.dokterpengirim
                            var ruangan = element.namaruangan;
                            var dokterperiksa = element.dokterpemeriksa;
                            var catatan = "-";


                            var x = "WHERE (pp.noregistrasifk = '" + element.norec_apd + "')and (pp.norec in (" + element.norec_pp + ')) and hh.flag is not null'
                            var y = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg=" + $scope.data.noregistrasi
                            // var data = {
                            //     "gambarLogo": "logodokkes.jpg",
                            //     "paramKey": ["namaRS", "namaRSS","namaRSSS","tgllahir","alamatRS","printedBy","norecapd","umur","jeniskelamin","tglpelayanan","tglhasil","dokter","ruangan","analis","linkqr","diagnosa","dokterPeriksa"],
                            //     "paramValue": ["", "RUMAH SAKIT UNIVERSITAS ANDALAS","INSTALASI LABORATORIUM","1980-12-25 00:00:00","Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176, Telp. (0751)8465000, Psw. 177",user.namaLengkap,
                            //                     x,umurDay,$scope.data.objectjeniskelaminfk,tgl,tglhasil,dokterpengirim,ruangan,y,diagnosa.toString(),dokterperiksa.toString()],
                            //     "paramType" : ["","","","date","","","","","","","","","","","","",""]
                            // };
                            var data = {
                                "gambarLogo": "logodokkes.jpg",
                                "paramKey": ["namaRS", "namaRSS", "namaRSSS", "tgllahir", "alamatRS", "printedBy", "norecapd", "umur", "jeniskelamin", "tglpelayanan", "tglhasil", "dokter", "ruangan", "linkqr", "diagnosa", "dokterPeriksa", "catatan"],
                                "paramValue": ["", "RUMAH SAKIT UNIVERSITAS ANDALAS", "INSTALASI LABORATORIUM", "1980-12-25 00:00:00", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176, Telp. (0751)8465000, Psw. 177", user.namaLengkap,
                                    x, umurDay, $scope.data.objectjeniskelaminfk, tgl, tglhasil, dokterpengirim, ruangan, y, diagnosa.toString(), dokterperiksa.toString(), catatan
                                ],
                                "paramType": ["", "", "", "date", "", "", "", "", "", "", "", "", "", "", "", "", ""]
                            };

                            var xhr = new XMLHttpRequest();
                            xhr.onreadystatechange = function () {
                                if (this.readyState == 4 && this.status == 200) {
                                    //this.response is what you're looking for
                                    // handler(this.response);
                                    console.log(this.response, typeof this.response);
                                    //var res = this.response
                                    //var file = new Blob( [res], {type: 'application/pdf'});
                                    debugger;
                                    var url = window.URL.createObjectURL(this.response)
                                    var pdf = document.getElementById('tempatLaporan');
                                    pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                                    var win = window.open(url, '_blank');
                                    win.focus();
                                }
                            }
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/hasillabKlinik.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/hasillabKlinik.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/hasillabKlinik.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/hasillabKlinik.pdf');
                            }
                            // set `Content-Type` header
                            xhr.setRequestHeader('Content-Type', 'application/json');
                            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                            xhr.responseType = 'blob';
                            // send rquest with JSON payload
                            xhr.send(JSON.stringify(data));
                            // var client = new HttpClient();
                            // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=1&norec=' + $scope.norecAPD
                            //     + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                            //     + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan+
                            //      '&tglpelayanan=' + tgl+ '&tglhasil=' + tglhasil+ '&ruangan=' + ruangan, function (response) {

                            // var xhr = new XMLHttpRequest();
                            // xhr.onreadystatechange = function(){
                            //     if (this.readyState == 4 && this.status == 200){
                            //         //this.response is what you're looking for
                            //         // handler(this.response);
                            //         console.log(this.response, typeof this.response);
                            //         //var res = this.response
                            //         //var file = new Blob( [res], {type: 'application/pdf'});
                            //         debugger;
                            //         var url = window.URL.createObjectURL(this.response)
                            //         var pdf = document.getElementById('tempatLaporan');
                            //         pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                            //         var win = window.open(url, '_blank');
                            //         win.focus();
                            //     }
                            // }
                            // if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                            //     xhr.open('POST', 'http://192.168.0.62:8797/generic/report/hasillabmikrobiologi2.pdf');
                            // }else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                            //     xhr.open('POST', 'http://192.168.88.56:8797/generic/report/hasillabmikrobiologi2.pdf');
                            // }else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                            //     xhr.open('POST', 'http://10.10.20.167:8797/generic/report/hasillabmikrobiologi2.pdf');
                            // }else{
                            //     xhr.open('POST', 'http://127.0.0.1:8797/generic/report/hasillabmikrobiologi2.pdf');
                            // }
                            // // set `Content-Type` header
                            // xhr.setRequestHeader('Content-Type', 'application/json');
                            // xhr.setRequestHeader('Access-Control-Allow-Origin','*');
                            // xhr.responseType = 'blob';
                            // // send rquest with JSON payload
                            // xhr.send(JSON.stringify(data));	
                            // // var client = new HttpClient();
                            // // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=1&norec=' + $scope.norecAPD
                            // //     + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                            // //     + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan+
                            // //      '&tglpelayanan=' + tgl+ '&tglhasil=' + tglhasil+ '&ruangan=' + ruangan, function (response) {

                            // //     });
                        } else if (i < e.data.length) {

                            var diagnosa = "";
                            medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + $scope.data.noregistrasi).then(function (data) {
                                debugger
                                if (data.data.datas == undefined) {
                                    diagnosa = "-";
                                } else {
                                    if (data.data.datas[0].namadiagnosa != null) {
                                        diagnosa = data.data.datas[0].namadiagnosa;
                                    } else {
                                        diagnosa = "-";
                                    }

                                }
                            });


                            var user = medifirstService.getPegawaiLogin();

                            var tgl = moment(element.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                            var tglhasil = moment(element.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                            var dokterpengirim = element.dokterpengirim
                            var ruangan = element.namaruangan;
                            var dokterperiksa = element.dokterpemeriksa;
                            var catatan = "-";


                            var x = "WHERE (pp.noregistrasifk = '" + element.norec_apd + "')and (pp.norec in (" + element.norec_pp + ')) and hh.flag is not null'
                            var y = "http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg=" + $scope.data.noregistrasi
                            var data = {
                                "gambarLogo": "logodokkes.jpg",
                                "paramKey": ["namaRS", "namaRSS", "namaRSSS", "tgllahir", "alamatRS", "printedBy", "norecapd", "umur", "jeniskelamin", "tglpelayanan", "tglhasil", "dokter", "ruangan", "linkqr", "diagnosa", "dokterPeriksa", "catatan"],
                                "paramValue": ["", "RUMAH SAKIT UNIVERSITAS ANDALAS", "INSTALASI LABORATORIUM", "1980-12-25 00:00:00", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176, Telp. (0751)8465000, Psw. 177", user.namaLengkap,
                                    x, umurDay, $scope.data.objectjeniskelaminfk, tgl, tglhasil, dokterpengirim, ruangan, y, diagnosa.toString(), dokterperiksa.toString(), catatan
                                ],
                                "paramType": ["", "", "", "date", "", "", "", "", "", "", "", "", "", "", "", "", ""]
                            };
                            var xhr = new XMLHttpRequest();
                            xhr.onreadystatechange = function () {
                                if (this.readyState == 4 && this.status == 200) {
                                    //this.response is what you're looking for
                                    // handler(this.response);
                                    console.log(this.response, typeof this.response);
                                    //var res = this.response
                                    //var file = new Blob( [res], {type: 'application/pdf'});
                                    debugger;
                                    var url = window.URL.createObjectURL(this.response)
                                    var pdf = document.getElementById('tempatLaporan');
                                    pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                                    var win = window.open(url, '_blank');
                                    win.focus();
                                }
                            }
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/hasillabKlinik.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/hasillabKlinik.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/hasillabKlinik.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/hasillabKlinik.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/hasillabKlinik.pdf');
                            }
                            // set `Content-Type` header
                            xhr.setRequestHeader('Content-Type', 'application/json');
                            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                            xhr.responseType = 'blob';
                            // send rquest with JSON payload
                            xhr.send(JSON.stringify(data));
                            // var client = new HttpClient();
                            // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=1&norec=' + $scope.norecAPD
                            //     + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                            //     + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan+
                            //      '&tglpelayanan=' + tgl+ '&tglhasil=' + tglhasil+ '&ruangan=' + ruangan, function (response) {

                            // var xhr = new XMLHttpRequest();
                            // xhr.onreadystatechange = function(){
                            //     if (this.readyState == 4 && this.status == 200){
                            //         //this.response is what you're looking for
                            //         // handler(this.response);
                            //         console.log(this.response, typeof this.response);
                            //         //var res = this.response
                            //         //var file = new Blob( [res], {type: 'application/pdf'});
                            //         debugger;
                            //         var url = window.URL.createObjectURL(this.response)
                            //         var pdf = document.getElementById('tempatLaporan');
                            //         pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                            //         var win = window.open(url, '_blank');
                            //         win.focus();
                            //     }
                            // }
                            // if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                            //     xhr.open('POST', 'http://192.168.0.62:8797/generic/report/hasillabmikrobiologi2.pdf');
                            // }else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                            //     xhr.open('POST', 'http://192.168.88.56:8797/generic/report/hasillabmikrobiologi2.pdf');
                            // }else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                            //     xhr.open('POST', 'http://10.10.20.167:8797/generic/report/hasillabmikrobiologi2.pdf');
                            // }else{
                            //     xhr.open('POST', 'http://127.0.0.1:8797/generic/report/hasillabmikrobiologi2.pdf');
                            // }
                            // // set `Content-Type` header
                            // xhr.setRequestHeader('Content-Type', 'application/json');
                            // xhr.setRequestHeader('Access-Control-Allow-Origin','*');
                            // xhr.responseType = 'blob';
                            // // send rquest with JSON payload
                            // xhr.send(JSON.stringify(data));	
                            // // var client = new HttpClient();
                            // // client.get('http://127.0.0.1:1237/printvb/bridging?cetak-hasil-lab=1&norec=' + $scope.norecAPD
                            // //     + '&objectjeniskelaminfk=' + $scope.item.objectjeniskelaminfk + '&umur=' + $scope.item.umurDay
                            // //     + '&strIdPegawai=' + user.namaLengkap + '&strNorecPP=' + $scope.item.norecPP + '&view=' + stt + '&doketr=' + dokter.namalengkap + '&catatan=' + $scope.item.catatan+
                            // //      '&tglpelayanan=' + tgl+ '&tglhasil=' + tglhasil+ '&ruangan=' + ruangan, function (response) {

                            // //     });

                        }

                        // var dataCetakFix = '';
                        // const element = e.data[i];
                        // if (e.data.length == 1) {
                        //     dataCetakFix = "'" + element.norec_pp + "'"
                        // } else if (e.data.length == i + 1) {
                        //     dataCetakFix = dataCetakFix + "" + "'" + element.norec_pp + "'" + ""
                        // } else {
                        //     dataCetakFix = dataCetakFix + "" + "'" + element.norec_pp + "'" + ","
                        // }



                        // if ($scope.norecHasilRadiologi != '') {
                        //     var local = JSON.parse(localStorage.getItem('profile'))
                        //     var nama = medifirstService.getPegawaiLogin().namaLengkap
                        //     if (local != null) {
                        //         var profile = local.id;
                        //         window.open(config.baseApiBackend + "report/cetak-ekspertise?norec=" + $scope.norecHasilRadiologi + '&kdprofile=' + profile
                        //             + '&nama=' + nama, '_blank');
                        //     }
                        // }
                    }
                    // }
                })

                // if ($scope.norecHasilRadiologi != '') {
                //     var local = JSON.parse(localStorage.getItem('profile'))
                //     var nama = medifirstService.getPegawaiLogin().namaLengkap
                //     if (local != null) {
                //         var profile = local.id;
                //         window.open(config.baseApiBackend + "report/cetak-ekspertise?norec=" + $scope.norecHasilRadiologi + '&kdprofile=' + profile
                //             + '&nama=' + nama, '_blank');
                //     }
                // }
            }

            // $scope.cetakEkspertise = function () {

            //     if ($scope.norecHasilRadiologi != '') {
            //         var local = JSON.parse(localStorage.getItem('profile'))
            //         var nama = medifirstService.getPegawaiLogin().namaLengkap
            //         if (local != null) {
            //             var profile = local.id;
            //             window.open(config.baseApiBackend + "report/cetak-ekspertise?norec=" + $scope.norecHasilRadiologi + '&kdprofile=' + profile
            //                 + '&nama=' + nama, '_blank');
            //         }
            //     }
            // }

            $scope.cetakRekapBillingJasper = function () {
                debugger

                var user = medifirstService.getPegawaiLogin();
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/detail-tagihan/" + $scope.data.noregistrasi + '?jenisdata=bill').then(function (dat) {
                    var billing = "Rp " + parseFloat(dat.data.billing).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    var deposit = "Rp " + parseFloat(dat.data.deposit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");

                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var kelas = dat.data.kelasRawat;
                        var sisa = "Rp 0,00";
                        var bayar = "Rp " + parseFloat(dat.data.bayar).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        if (bayar == "Rp NaN") {
                            bayar = "Rp 0,00";
                        }
                        if (dat.data.jenisPasien != "Umum/Pribadi") {
                            kelas = dat.data.kelasPenjamin
                            // bayar = "0"
                        }

                        if (dat.data.deposit > 0) {
                            sisa = dat.data.deposit - parseFloat(dat.data.bayar)
                            if (sisa > 0) {
                                sisa = "Rp " + parseFloat(sisa).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            } else {
                                sisa = "RP 0,00";
                            }
                        }
                        var nosep = "-";
                        if (dat.data.nosep != "" && dat.data.nosep != null) {
                            nosep = dat.data.nosep
                        }
                        debugger;

                        var data = {
                            "gambarLogo": "logodokkes.jpg",
                            "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi", "nocm", "namapasien", "lastruangan", "namakamar", "kelas", "jmlbiaya", "deposit", "sisa", "isi", "terbilang", "bayar", "nosep"],
                            "paramValue": ["RUMAH SAKIT UNIVERSITAS ANDALAS", "1980-12-25 00:00:00", "Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176", user.namaLengkap, dat.data.noRegistrasi,
                                dat.data.noCm, dat.data.namaPasien, dat.data.lastRuangan, dat.data.namakamar, kelas, billing, deposit, sisa, dat.data.isi, dat.data.terbilang, bayar, nosep
                            ],
                            "paramType": ["", "date", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
                        };

                        var xhr = new XMLHttpRequest();
                        xhr.onreadystatechange = function () {
                            if (this.readyState == 4 && this.status == 200) {
                                //this.response is what you're looking for
                                // handler(this.response);
                                console.log(this.response, typeof this.response);
                                //var res = this.response
                                //var file = new Blob( [res], {type: 'application/pdf'});
                                debugger;
                                var url = window.URL.createObjectURL(this.response)
                                var pdf = document.getElementById('tempatLaporan');
                                pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                                var win = window.open(url, '_blank');
                                win.focus();
                            }
                        }
                        if (dat.data.jenisPasien == "BPJS") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                            }
                        } else if (dat.data.jenisPasien == "Umum/Pribadi") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                            }
                        } else if (dat.data.jenisPasien == "KEMENKES RI") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                            }
                        } else if (dat.data.namaPenjamin == "JASA RAHARJA, PT (BPJS KESEHATAN)") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                            }
                        } else if (dat.data.namaPenjamin == "JASA RAHARJA, PT (UMUM)") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                            }
                        } else {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingaSURANSIv2.pdf');
                            }
                        }
                        // set `Content-Type` header
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                        xhr.responseType = 'blob';
                        // send rquest with JSON payload
                        xhr.send(JSON.stringify(data));
                        $scope.isRouteLoading = false;
                    })
                })
            }


            // $scope.inputTindakan = function () {
            //     debugger;
            //     if ($scope.data) {
            //         $state.go('InputTindakan', {
            //             norecPD: $scope.data.norec_pd,
            //             norecAPD: $scope.data.norec_apd,
            //         });
            //     } else {
            //         messageContainer.error('Pasien belum di pilih')
            //     }
            // }

            // $scope.detailTagihan = function () {
            //     if ($scope.data.noregistrasi != undefined) {
            // 		var obj = {
            // 			noRegistrasi: $scope.data.noregistrasi
            // 		}

            // 		$state.go('RincianTagihan', {
            // 			dataPasien: JSON.stringify(obj)
            // 		});
            // 	}
            // }
        }
    ]);

});