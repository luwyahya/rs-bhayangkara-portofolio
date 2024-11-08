define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarResepBebasCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, $mdDialog, cetakHelper, medifirstService, $q) {


            // initialize.controller('DaftarResepBebasCtrl', ['$q', '$rootScope', '$scope', 'medifirstService','$state','CacheHelper','DateHelper',
            //     function($q, $rootScope, $scope,medifirstService,$state,cacheHelper,dateHelper) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.isRouteLoading = false;
            $scope.istempatLaporan = true;
            var pegawaiUser = {}
            // $scope.item.tglAwal = $scope.now;
            // $scope.item.tglAkhir = $scope.now;
            LoadCache();
            loadCombo();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarResepBebasCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD 23:59');

                    init();
                } else {
                    $scope.item.tglAwal = new moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD 23:59');
                    init();
                }
            }

            function loadCombo() {
                // medifirstService.getDataTableTransaksi("logistik/get-datacombo_dp", true).then(function(dat){
                //     pegawaiUser = dat.data.datalogin
                // });
                // $scope.listJenisRacikan = [{id:1,jenisracikan:'Puyer'}]
            }

            function init() {
                $scope.isRouteLoading = true;
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&dpid=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruid=" + $scope.item.ruangan.id
                }
                // var Jra =""
                // if ($scope.item.jenisRacikan != undefined){
                //     var Jra ="&jenisobatfk=" +$scope.item.jenisRacikan.id
                // }
                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                medifirstService.get("farmasi/get-daftar-jual-bebas?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&nostruk=" + $scope.item.struk +
                    "&nocm=" + $scope.item.noMr +
                    "&namapasien=" + $scope.item.namaPasien, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                            // var tanggal = $scope.now;
                            // var tanggalLahir = new Date(dat.data.daftar[i].tgllahir);
                            // var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                            // dat.data.daftar[i].umur =umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'
                            //itungUsia(dat.data[i].tgllahir)
                        }
                        var data2 = dat.data.daftar;
                        $scope.dataGrid = new kendo.data.DataSource({
                            data: data2,
                            pageSize: 10,
                            total: data2[0].length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            }
                        });
                        pegawaiUser = dat.data.datalogin
                    });

                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarResepBebasCtrl', chacePeriode);


            }
            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }
            $scope.cariFilter = function () {

                init();
            }

            // $scope.TransaksiPelayanan = function(){
            //     debugger;
            //     var arrStr ={ 0 : $scope.dataSelected.nocm ,
            //         1 : $scope.dataSelected.namapasien,
            //         2 : $scope.dataSelected.jeniskelamin,
            //         3 : $scope.dataSelected.noregistrasi, 
            //         4 : $scope.dataSelected.umur,
            //         5 : $scope.dataSelected.klid,
            //         6 : $scope.dataSelected.namakelas,
            //         7 : $scope.dataSelected.tglregistrasi,
            //         8 : $scope.dataSelected.norec_apd,
            //         9 : 'resep'
            //     }
            //     cacheHelper.set('TransaksiPelayananApotikCtrl', arrStr);
            //     $state.go('TransaksiPelayananApotik')

            //     var arrStr2 ={ 0 : $scope.dataSelected.norec 
            //     }
            //     cacheHelper.set('DaftarResepCtrl', arrStr2);
            //     $state.go('DaftarResepCtrl')
            // }

            $scope.CetakBuktiLayanan = function () {
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=NonLayanan' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + pegawaiUser.userData.namauser, function (response) {
                    //aadc=response;
                });
            }
            $scope.EditResep = function () {
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'EditResep',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('InputResepApotikNonLayananCtrl', chacePeriode);
                $state.go('InputResepApotikNonLayanan')
            }

            $scope.HapusResep = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih Data terlebih dahulu!!")
                    return;
                }
                var objSave = {
                    norec_sp: $scope.dataSelected.norec,
                }
                medifirstService.post('farmasi/hapus-resep_ob', objSave).then(function (e) {
                    init()
                })
            }

            // $scope.tambah = function(){
            //  $state.go('Produk')
            // }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }


            $scope.columnGrid = [{
                "field": "no",
                "title": "No",
                "width": "20px",
            },
            {
                "field": "tglstruk",
                "title": "Tgl Struk",
                "width": "50px",
            },
            {
                "field": "nostruk",
                "title": "NoResep",
                "width": "60px",
            },
            {
                "field": "nostruk_intern",
                "title": "No MR",
                "width": "50px",
            },
            {
                "field": "namapasien_klien",
                "title": "Nama Pasien",
                "width": "120px",
            },
            {
                "field": "noteleponfaks",
                "title": "No Telp",
                "width": "120px",
            },
            {
                "field": "namaruangan",
                "title": "Nama Ruangan",
                "width": "100px",
            },
            {
                "field": "namalengkap",
                "title": "Dokter",
                "width": "100px"
            },
            {
                "field": "nosbm",
                "title": "SBM",
                "width": "100px"
            }
            ];
            $scope.data2 = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [{
                        "field": "resepke",
                        "title": "Rke",
                        "width": "30px",
                    },
                    {
                        "field": "jeniskemasan",
                        "title": "Jumlah",
                        "width": "50px"
                    },
                    {
                        "field": "namaproduk",
                        "title": "Nama Produk",
                        "width": "100px",
                    },
                    {
                        "field": "satuanstandar",
                        "title": "Satuan",
                        "width": "30px",
                    },
                    {
                        "field": "qtyproduk",
                        "title": "Qty",
                        "width": "30px",
                    },
                    {
                        "field": "hargasatuan",
                        "title": "Harga Satuan",
                        "width": "50px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                    },
                    {
                        "field": "hargadiscount",
                        "title": "Discount",
                        "width": "50px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                    },
                    {
                        "field": "hargatambahan",
                        "title": "Jasa",
                        "width": "50px",
                        "template": "<span class='style-right'>{{formatRupiah('#: hargatambahan #', '')}}</span>"
                    },
                    {
                        "field": "total",
                        "title": "Total",
                        "width": "70px",
                        "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                    }
                    ]
                }
            };
            // $scope.mainGridOptions = { 
            //     pageable: true,
            //     columns: $scope.columnProduk,
            //     editable: "popup",
            //     selectable: "row",
            //     scrollable: false
            // };
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD/MM/YYYY');
            }

            function itungUsia(tgl) {
                debugger;
                // var tg = parseInt(form.elements[0].value);
                // var bl = parseInt(form.elements[1].value);
                // var th = parseInt(form.elements[2].value);
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih / (1000 * 60 * 60 * 24 * 365));
                //var bln = Math.round((selisih % 365)/(1000*60*60*24));
                return thn + ' thn ' // + bln + ' bln'
            }
            var HttpClient = function () {
                this.get = function (aUrl, aCallback) {
                    var anHttpRequest = new XMLHttpRequest();
                    anHttpRequest.onreadystatechange = function () {
                        if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                            aCallback(anHttpRequest.responseText);
                    }

                    anHttpRequest.open("GET", aUrl, true);
                    anHttpRequest.send(null);
                }
            }

            $scope.LabelResep = function () {
                $scope.dataLoginUs = JSON.parse(window.localStorage.getItem('pegawai'));
                if ($scope.dataSelected == undefined) {
                    alert('Pilih resep yg akan di cetak')
                    return;
                }
                var stt = 'false'
                if (confirm('View Label resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                // cetak-LabelFarmasiOB 
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiOBKecil=' + $scope.dataSelected.norec + '&view=' + stt + '&user=' + $scope.dataLoginUs.namaLengkap, function (response) { });
            }
            debugger
            $scope.RincianresepObatJs = function () {

                $scope.isRouteLoading = true;
                $scope.dataSelected.norec
                var norec = $scope.dataSelected.norec
                var umur = $scope.item.umur;
                debugger
                medifirstService.get("tatarekening/get-data-sum-resep?norec=" + $scope.dataSelected.norec, true).then(function (dat) {
                    var total = "";
                    var totalBayar = "";
                    var totalDiscount = "";
                    var namauser = "";
                    namauser = pegawaiUser.userData.namauser;
                    // var umur = $scope.item.umur;
                    total = "Rp." + " " + parseFloat(dat.data[0].totalharga).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    totalBayar = "Rp." + " " + parseFloat(dat.data[0].totalBiaya).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    totalDiscount = "Rp." + " " + parseFloat(dat.data[0].totaldiscound).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    var data = {
                        "gambarLogo": "logodokkes.jpg",
                        "paramKey": ["namaRS", "alamatRS", "norec", "total", "totalAkhir", "discount", "printedBy"],
                        "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211",
                            $scope.dataSelected.norec.toString(), total, totalBayar, totalDiscount, namauser
                        ],
                        "paramType": ["", "", "", "", "", "", ""]
                    };
                    debugger
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            // cetakttd();
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
                    if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                        xhr.open('POST', 'http://36.93.6.186:8797/generic/report/penjualanbebas.pdf');
                    } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                        xhr.open('POST', 'http://192.168.100.254:8797/generic/report/penjualanbebas.pdf');
                    } else {
                        xhr.open('POST', 'http://127.0.0.1:8797/generic/report/penjualanbebas.pdf');
                    }
                    debugger
                    // set `Content-Type` header
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                    xhr.responseType = 'blob';
                    // send rquest with JSON payload
                    xhr.send(JSON.stringify(data));
                    $scope.isRouteLoading = false;
                });

            }
            // $scope.RincianresepObatJs = function () {
            //     $scope.isRouteLoading = false;
            //     var ruanganLast ="";
            //         var total ="";
            //         var totalDiscount ="";
            //         var totalBayar ="";
            //         var namauser = "";  
            //         var umur = $scope.item.umur;
            //         $scope.dataSelected.norec
            //         var norec = $scope.dataSelected.norec
            //      var kelas = $scope.item.kelasrawat
            //         if($scope.item.kelompokPasien!="Umum/Pribadi"){
            //                 kelas = $scope.item.kelasPenjamin
            //         }
            //         var namakamar = $scope.item.namakamar;
            //         namauser = $scope.dataSelected.detail.userData.namauser;
            //         // medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noregistrasi + '?jenisdata=bill').then(function (dat) {
            //         medifirstService.get("tatarekening/get-data-login-cetakan-ruangan-last?noregistrasi="+$scope.item.noregistrasi,true).then(function (dat) {
            //             ruanganLast = dat.data[0].namaruangan;
            //             medifirstService.get("tatarekening/get-data-sum-resep?norec="+$scope.dataSelected.norec,true).then(function (dat) {
            //                 debugger;
            //                 total =  "Rp."  + " " + parseFloat(dat.data[0].totalharga).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            //                 totalBayar =  "Rp."  + " " + parseFloat(dat.data[0].totalBiaya).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            //                 totalDiscount =  "Rp."  + " " + parseFloat(dat.data[0].totaldiscound).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            //                 var data = {
            //                     "gambarLogo": "logo_rs.jpg",
            //                     "paramKey": ["namaRS", "tgllahir","alamatRS","printedBy","noregistrasi","lastruangan","total","kelas","namakamar","norec","totalAkhir","discount","umur"],
            //                     "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00","Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211",namauser,$scope.item.noregistrasi,
            //                     ruanganLast,total,kelas,namakamar,$scope.dataSelected.norec.tostring(),totalBayar,totalDiscount,umur],
            //                     "paramType" : ["","date","","","","","","","","","","",""]
            //                 };
            //             var xhr = new XMLHttpRequest();
            //             xhr.onreadystatechange = function(){
            //                 if (this.readyState == 4 && this.status == 200){
            //                     //this.response is what you're looking for
            //                     // handler(this.response);
            //                     console.log(this.response, typeof this.response);
            //                     //var res = this.response
            //                     //var file = new Blob( [res], {type: 'application/pdf'});
            //                     debugger;
            //                     var url = window.URL.createObjectURL(this.response)
            //                     var pdf = document.getElementById('tempatLaporan');
            //                     pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
            //                     var win = window.open(url, '_blank');
            //                     win.focus();
            //                 }
            //             }

            //                     if (window.location.hostname.indexOf('192.168.0.62') > -1) {
            //                         xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetakResepRIncian.pdf');
            //                     }else if(window.location.hostname.indexOf('192.168.88.56') > -1){
            //                         xhr.open('POST', 'http://192.168.88.56:1002/generic/report/cetakResepRIncian.pdf');
            //                     }else if(window.location.hostname.indexOf('10.10.20.167') > -1){
            //                         xhr.open('POST', 'http://10.10.20.167:1002/generic/report/cetakResepRIncian.pdf');
            //                     }else if(window.location.hostname.indexOf('10.8.8.8') > -1){
            //                         xhr.open('POST', '/jasper1/generic/report/cetakResepRIncian.pdf');
            //                     }else if(window.location.hostname.indexOf('202.51.105.98') > -1){
            //                          xhr.open('POST', '/jasper1generic/report/cetakResepRIncian.pdf');
            //                     }else{
            //                         xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetakResepRIncian.pdf');
            //                     }

            //             // set `Content-Type` header
            //             xhr.setRequestHeader('Content-Type', 'application/json');
            //             xhr.setRequestHeader('Access-Control-Allow-Origin','*');
            //             xhr.responseType = 'blob';
            //             // send rquest with JSON payload
            //             xhr.send(JSON.stringify(data)); 
            //             $scope.isRouteLoading = false;
            //              });

            //          });

            // }
            $scope.ReturResep = function () {
                var chacePeriode = {
                    0: $scope.dataSelected.norec,
                    1: 'ReturResep',
                    2: '',
                    3: '',
                    4: '',
                    5: '',
                    6: ''
                }
                cacheHelper.set('cacheReturObatBebas', chacePeriode);
                $state.go('InputResepApotikNonLayananRetur')
            }
            //* BATAS SUCI *//
        }
    ]);
});