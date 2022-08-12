define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PembayaranHonorPTTCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper) {
            $scope.dataVOloaded1 = true;
            $scope.now = new Date()
            $scope.dataPasienSelected = {};
            $scope.item = {};
            $scope.istempatLaporan = true;
            $scope.item.periode = new Date(moment($scope.now).format('YYYY-MM-01 00:00'));
            // debugger;
            // $scope.item.tanggal = new Date(moment($scope.now).format('MMM-YYYY'));
            loadData()
            loadCombo()
            loadCombo2()

            function loadCombo() {
                medifirstService.get("sdm/get-data-combo-sdm?").then(function (dat) {
                    var dataCombo = dat.data
                    $scope.listRuangan = dataCombo.ruangan;
                    $scope.ListStatusPegawai = dataCombo.kategorypegawai;

                })
            }

            function loadCombo2() {
                medifirstService.get("sdm/get-combo-honor").then(function (o) {
                    debugger;
                    $scope.listKedudukan = o.data
                })
            }

            $scope.Search = function () {
                $scope.isRouteLoading = true;
                loadData()
            }

            function loadData() {
                debugger;
                var bulan = moment($scope.item.periode).format('MM')
                var tahun = moment($scope.item.periode).format('YYYY')
                if ($scope.item.ruangan == undefined) {
                    var ruangan = ""
                } else {
                    var ruangan = "ruangan=" + $scope.item.ruangan.id
                }
                if ($scope.item.statuspegawai == undefined) {
                    var sp = ""
                } else {
                    var sp = "&spg=" + $scope.item.statuspegawai.id
                }

                $scope.isRouteLoading = true;
                medifirstService.get('sdm/get-pembayaran-honor-ptt?' + ruangan + sp + "&bulan=" + bulan + "&tahun=" + tahun).then(function (dat) {
                    $scope.isRouteLoading = false;
                    debugger;
                    for (var i = 0; i < dat.data.length; i++) {
                        dat.data[i].no = i + 1
                    }
                    $scope.dataSourceRek = {
                        data: dat.data,
                        pageSize: 20,
                        total: dat.data.length,
                        serverPaging: false,
                    }
                    $scope.columnGridRek = {
                        // toolbar: ["excel"],

                        // excel: {
                        //     fileName: "DaftarTransferGaji.xlsx",
                        //     allPages: true,
                        // },
                        // excelExport: function (e) {
                        //     var sheet = e.workbook.sheets[0];
                        //         sheet.frozenRows = 2;
                        //         sheet.mergedCells = ["A1:D1"];
                        //         sheet.name = "DAFTAR TRANSFER GAJI";

                        //         var myHeaders = [

                        //             {
                        //                 value: "DAFTAR TRANSFER GAJI ",
                        //                 fontSize: 15,
                        //                 textAlign: "center",
                        //                 background: "#c1d2d2",
                        //                 // color:"#ffffff"
                        //             }];

                        //         sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });

                        // },

                        selectable: 'row',
                        sortable: false,
                        reorderable: true,
                        filterable: false,
                        pageable: true,
                        columnMenu: false,
                        resizable: true,
                        scrollable: false,
                        columns: [{
                            "field": "no",
                            "title": "No",
                            "width": "15px"
                        },
                        {
                            "field": "namalengkap",
                            "title": "Nama",
                            "width": "200px",
                            "template": "<span class='style-center'>#:namalengkap #</span>"
                        },
                        {
                            "field": "namaruangan2",
                            "title": "Nama Ruangan",
                            "width": "100px",
                            "template": "<span class='style-center'>#:namaruangan2 #</span>"
                        },
                        {
                            "field": "pendidikan2",
                            "title": "Pendidikan",
                            "width": "100px",
                            "template": "<span class='style-center'>#:pendidikan2 #</span>"
                        },
                        {
                            "field": "tglmasuk",
                            "title": "TMT",
                            "width": "100px",
                            "template": "<span class='style-center'>{{formatTanggal('#:tglmasuk #', '')}}</span>"
                        },
                        {
                            "field": "salary",
                            "title": "Jumlah Nominal",
                            "width": "100px",
                            "template": "<span class='style-center'>{{formatRupiah2('#:salary #', '')}}</span>"
                        }
                        ]
                    }

                    // medifirstService.get('sdm/get-jumlah-pembayaran-ptt?' + ruangan).then(function (dat) {
                    //     debugger;
                    //     var total = dat.data;
                    //     for (var i = 0; i < total.length; i ++){
                    //         $scope.item.salary2 = total[i].salary2
                    //     }
                    // })

                    if ($scope.item.ruangan == undefined && $scope.item.statuspegawai == undefined) {
                        medifirstService.get('sdm/get-total-pembayaran-ptt?' + "&bulan=" + bulan + "&tahun=" + tahun).then(function (a) {
                            debugger;
                            var total1 = a.data;
                            $scope.item.salary2 = "Rp. " + parseFloat(total1[0].salary2).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        })
                    } else if ($scope.item.ruangan != undefined && $scope.item.statuspegawai == undefined) {
                        medifirstService.get('sdm/get-jumlah-pembayaran-ptt?' + ruangan + "&bulan=" + bulan + "&tahun=" + tahun).then(function (dat) {
                            debugger;
                            var total = dat.data;
                            for (var i = 0; i < total.length; i++) {
                                $scope.item.salary2 = "Rp. " + parseFloat(total[i].salary2).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            }
                        })
                    } else if ($scope.item.ruangan == undefined && $scope.item.statuspegawai != undefined) {
                        medifirstService.get('sdm/get-jumlah-pembayaran-kelompok-ptt?' + sp + "&bulan=" + bulan + "&tahun=" + tahun).then(function (dat) {
                            debugger;
                            var total = dat.data;
                            for (var i = 0; i < total.length; i++) {
                                $scope.item.salary2 = "Rp. " + parseFloat(total[i].salary2).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            }
                        })
                    }

                    $scope.formatRupiah2 = function (value, currency) {
                        return currency + "Rp. " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    }
                    $scope.formatTanggal = function (tanggal) {
                        return moment(tanggal).format('DD-MMM-YYYY');
                    }

                })

                medifirstService.get('sdm/get-pembayaran-rekap?' + "&bulan=" + bulan + "&tahun=" + tahun).then(function (dat) {
                    debugger;
                    var anjay = dat.data[0]
                    $scope.jumlah = "Rp. " + parseFloat(anjay.salary2).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                })
                medifirstService.get('sdm/get-personil-rekap?' + "&bulan=" + bulan + "&tahun=" + tahun).then(function (dat) {
                    debugger;
                    var anjay2 = dat.data[0]
                    $scope.personil = anjay2.personil
                })
            }
            // $scope.yearUngkul = {
            //     start: "year",
            //     depth: "year"
            // }
            $scope.cetakJasperRekap = function () {
                var user = medifirstService.getPegawaiLogin();
                var stt = 'false'
                if (confirm('View Rekap Gaji? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                // var diagnosa ="";
                // medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + $scope.item.noregistrasi).then(function (data) {
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

                // var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                // var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                // var dokter = $scope.item.DataPegawai
                // var ruangan = $scope.item.Ruangan.namaruangan;
                // var dokterPeriksa =  $scope.item.DataPegawaiPemeriksa.namalengkap;
                // var catatan = "-";
                // if ($scope.item.catatan != undefined) {
                //     catatan = $scope.item.catatan;
                // }
                var jumlah = $scope.jumlah
                var personil = $scope.personil
                // var tanggal = $scope.item.tanggal
                // var tanggal = moment($scope.now).format('MMM YYYY');
                var tanggal = moment($scope.item.periode).format('MMM YYYY');
                var bulan = moment($scope.item.periode).format('MM');
                var tahun = moment($scope.item.periode).format('YYYY');
                // var idruangan = $scope.item.ruangan.id

                // var x= "WHERE (pp.noregistrasifk = '"+ $scope.norecAPD +"')and (pp.norec in ("+$scope.item.norecPP+ ')) and hh.flag is not null'
                // var y="http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg="+$scope.item.noregistrasi
                debugger;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["jumlah", "personil", "tanggal", "bulan", "tahun"],
                    // , "namaRSS","namaRSSS","tgllahir","alamatRS","printedBy","norecapd","umur","jeniskelamin","tglpelayanan","tglhasil","dokter","ruangan","linkqr","diagnosa","dokterPeriksa","catatan"],
                    "paramValue": [jumlah, personil, tanggal, bulan, tahun],
                    // "RUMAH SAKIT UNIVERSITAS ANDALAS","INSTALASI LABORATORIUM","1980-12-25 00:00:00","Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176, Telp. (0751)8465000, Psw. 177",user.namaLengkap,
                    // x,$scope.item.umurDay,$scope.item.objectjeniskelaminfk,tgl,tglhasil,dokter.namalengkap,ruangan,y,diagnosa.toString(),dokterPeriksa.toString(),catatan],
                    "paramType": ["", "", "", "", ""]
                    // ,"","","date","","","","","","","","","","","","",""]
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
                    xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekappembayaranptt.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekappembayaranptt.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekappembayaranptt.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/rekappembayaranptt.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/rekappembayaranptt.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:8797/generic/report/rekappembayaranptt.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekappembayaranptt.pdf');
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

                //     });
                // tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                // var tglcetak = moment($scope.item.tglcetak).format('YYYY-MM-DD HH:mm:ss')

                // var statusUpdate =1;
                // if($scope.item.cekUpdate == true)
                // {
                //    statusUpdate = 2
                // }

                //    var objSave = {
                //        norec_pp: editkenNorecPP,
                //        tanggalPelayanan: tgl,
                //        tglcetak:tglcetak,
                //        tglhasil:tglhasil,
                //        dokterkirim:dokter.id,
                //        status: statusUpdate
                //    }

                //    medifirstService.post('tatarekening/save-update-tanggal_pelayanan_all', objSave).then(function (data) {
                //        $scope.saveLogging('Ubah Tgl Pelayanan', 'norec Pelayanan Pasien', $scope.dataSelected.norec, 'menu Detail Tagihan')
                //        LoadData()
                //    });

            }

            $scope.cetakJasperRuangan = function () {
                var user = medifirstService.getPegawaiLogin();
                var stt = 'false'
                if (confirm('View Rekap Gaji? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                // var diagnosa ="";
                // medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + $scope.item.noregistrasi).then(function (data) {
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

                // var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                // var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                // var dokter = $scope.item.DataPegawai
                // var ruangan = $scope.item.Ruangan.namaruangan;
                // var dokterPeriksa =  $scope.item.DataPegawaiPemeriksa.namalengkap;
                // var catatan = "-";
                // if ($scope.item.catatan != undefined) {
                //     catatan = $scope.item.catatan;
                // }
                var jumlah = $scope.item.salary2
                // var tanggal = $scope.item.tanggal
                // var tanggal = moment($scope.now).format('MMM YYYY');
                var tanggal = moment($scope.item.periode).format('MMM YYYY');
                var bulan = moment($scope.item.periode).format('MM');
                var tahun = moment($scope.item.periode).format('YYYY');
                var idruangan = $scope.item.ruangan.id

                // var x= "WHERE (pp.noregistrasifk = '"+ $scope.norecAPD +"')and (pp.norec in ("+$scope.item.norecPP+ ')) and hh.flag is not null'
                // var y="http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg="+$scope.item.noregistrasi
                debugger;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["ruangan", "jumlah", "tanggal", "idruangan", "bulan", "tahun"],
                    // , "namaRSS","namaRSSS","tgllahir","alamatRS","printedBy","norecapd","umur","jeniskelamin","tglpelayanan","tglhasil","dokter","ruangan","linkqr","diagnosa","dokterPeriksa","catatan"],
                    "paramValue": [$scope.item.ruangan.namaruangan.toString(), jumlah, tanggal, idruangan, bulan, tahun],
                    // "RUMAH SAKIT UNIVERSITAS ANDALAS","INSTALASI LABORATORIUM","1980-12-25 00:00:00","Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176, Telp. (0751)8465000, Psw. 177",user.namaLengkap,
                    // x,$scope.item.umurDay,$scope.item.objectjeniskelaminfk,tgl,tglhasil,dokter.namalengkap,ruangan,y,diagnosa.toString(),dokterPeriksa.toString(),catatan],
                    "paramType": ["", "", "", "", "", ""]
                    // ,"","","date","","","","","","","","","","","","",""]
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
                    xhr.open('POST', 'http://192.168.0.62:8797/generic/report/daftarPembayaranHonorPtt.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/daftarPembayaranHonorPtt.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/daftarPembayaranHonorPtt.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/daftarPembayaranHonorPtt.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/daftarPembayaranHonorPtt.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:8797/generic/report/daftarPembayaranHonorPtt.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/daftarPembayaranHonorPtt.pdf');
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

                //     });
                // tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                // var tglcetak = moment($scope.item.tglcetak).format('YYYY-MM-DD HH:mm:ss')

                // var statusUpdate =1;
                // if($scope.item.cekUpdate == true)
                // {
                //    statusUpdate = 2
                // }

                //    var objSave = {
                //        norec_pp: editkenNorecPP,
                //        tanggalPelayanan: tgl,
                //        tglcetak:tglcetak,
                //        tglhasil:tglhasil,
                //        dokterkirim:dokter.id,
                //        status: statusUpdate
                //    }

                //    medifirstService.post('tatarekening/save-update-tanggal_pelayanan_all', objSave).then(function (data) {
                //        $scope.saveLogging('Ubah Tgl Pelayanan', 'norec Pelayanan Pasien', $scope.dataSelected.norec, 'menu Detail Tagihan')
                //        LoadData()
                //    });

            }
            $scope.cetakJasperKelompok = function () {
                var user = medifirstService.getPegawaiLogin();
                var stt = 'false'
                if (confirm('View Rekap Gaji? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                // var diagnosa ="";
                // medifirstService.get("registrasi/daftar-registrasi/get-data-diagnosa-pasien?noReg=" + $scope.item.noregistrasi).then(function (data) {
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

                // var tgl = moment($scope.item.tglpelayanan).format('YYYY-MM-DD HH:mm:ss')
                // var tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                // var dokter = $scope.item.DataPegawai
                // var ruangan = $scope.item.Ruangan.namaruangan;
                // var dokterPeriksa =  $scope.item.DataPegawaiPemeriksa.namalengkap;
                // var catatan = "-";
                // if ($scope.item.catatan != undefined) {
                //     catatan = $scope.item.catatan;
                // }
                var jumlah = $scope.item.salary2
                // var tanggal = $scope.item.tanggal
                // var tanggal = moment($scope.now).format('MMM YYYY');
                var tanggal = moment($scope.item.periode).format('MMM YYYY');
                var bulan = moment($scope.item.periode).format('MM');
                var tahun = moment($scope.item.periode).format('YYYY');
                var idkelompokjabatan = $scope.item.statuspegawai.id

                // var x= "WHERE (pp.noregistrasifk = '"+ $scope.norecAPD +"')and (pp.norec in ("+$scope.item.norecPP+ ')) and hh.flag is not null'
                // var y="http://202.51.105.98:9000/service/medifirst2000/report/cetak-lab?reg="+$scope.item.noregistrasi
                debugger;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["jumlah", "tanggal", "idkelompokjabatan", "bulan", "tahun"],
                    // , "namaRSS","namaRSSS","tgllahir","alamatRS","printedBy","norecapd","umur","jeniskelamin","tglpelayanan","tglhasil","dokter","ruangan","linkqr","diagnosa","dokterPeriksa","catatan"],
                    "paramValue": [jumlah, tanggal, idkelompokjabatan, bulan, tahun],
                    // "RUMAH SAKIT UNIVERSITAS ANDALAS","INSTALASI LABORATORIUM","1980-12-25 00:00:00","Komp Kampus Unand Jalan Universitas Andalas, Limau Manis, Kec. Pauh, Kota Padang, Sumatera Barat 25176, Telp. (0751)8465000, Psw. 177",user.namaLengkap,
                    // x,$scope.item.umurDay,$scope.item.objectjeniskelaminfk,tgl,tglhasil,dokter.namalengkap,ruangan,y,diagnosa.toString(),dokterPeriksa.toString(),catatan],
                    "paramType": ["", "", "", "", ""]
                    // ,"","","date","","","","","","","","","","","","",""]
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
                    xhr.open('POST', 'http://192.168.0.62:8797/generic/report/daftarPembayaranHonorKelompokPtt.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/daftarPembayaranHonorKelompokPtt.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/daftarPembayaranHonorKelompokPtt.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/daftarPembayaranHonorKelompokPtt.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/daftarPembayaranHonorKelompokPtt.pdf');
                } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
                    xhr.open('POST', 'http://202.51.105.98:8797/generic/report/daftarPembayaranHonorKelompokPtt.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/daftarPembayaranHonorKelompokPtt.pdf');
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

                //     });
                // tglhasil = moment($scope.item.tglhasil).format('YYYY-MM-DD HH:mm:ss')
                // var tglcetak = moment($scope.item.tglcetak).format('YYYY-MM-DD HH:mm:ss')

                // var statusUpdate =1;
                // if($scope.item.cekUpdate == true)
                // {
                //    statusUpdate = 2
                // }

                //    var objSave = {
                //        norec_pp: editkenNorecPP,
                //        tanggalPelayanan: tgl,
                //        tglcetak:tglcetak,
                //        tglhasil:tglhasil,
                //        dokterkirim:dokter.id,
                //        status: statusUpdate
                //    }

                //    medifirstService.post('tatarekening/save-update-tanggal_pelayanan_all', objSave).then(function (data) {
                //        $scope.saveLogging('Ubah Tgl Pelayanan', 'norec Pelayanan Pasien', $scope.dataSelected.norec, 'menu Detail Tagihan')
                //        LoadData()
                //    });

            }
            $scope.BulanTahunAja = {
                start: "year",
                depth: "year"
            }
        }
    ])
})