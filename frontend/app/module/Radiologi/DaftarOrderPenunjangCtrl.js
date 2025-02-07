define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarOrderPenunjangCtrl', ['$q', '$rootScope', '$scope', 'MedifirstService', '$state', 'CacheHelper', 'DateHelper', '$window','$mdDialog',
        function ($q, $rootScope, $scope, medifirstService, $state, cacheHelper, dateHelper, $window, $mdDialog) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item.tglAwal = $scope.now;
            $scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'));
            $scope.item.tglAkhir = $scope.now;
            $scope.btnSimpanVis = false;
            $scope.headerVerif = {}
            $scope.item.belumVerifikasi = true;
            $scope.popUp = {}
            var data2 =[]
            $scope.ruanganIdElektromedik = ''
            var idJenisPelayanan =''
            var kelompokUser=medifirstService.getKelompokUser()
            if(kelompokUser =='elektromedik'){
                medifirstService.get('sysadmin/general/settingdatafixed/get/kdRuanganElektromedik').then(function(e) {
                    $scope.ruanganIdElektromedik = e.data
                    LoadCache();
                  })
               
            }else{
                LoadCache();
            }
           
            var loginRadiologi = false
            if ($scope.item.belumVerifikasi)
                $scope.cekBelumVerifs = true;
            else
                $scope.cekBelumVerifs = false;

            $scope.cekbelumVerifikasi = function (data) {
                if (data === true) {
                    $scope.cekBelumVerifs = true;
                } else if (data === false || data === undefined) {
                    $scope.cekBelumVerifs = false;
                } else {
                    return;
                }
            }
            $scope.item.jmlRow = 100
            $scope.selected = function (data) {
                // toastr.info('No Order : ' + data.noorder + ' dipilih ', 'Info')
                $scope.dataSelected = data;
                medifirstService.get("radiologi/get-acc-number?noOrder=" + $scope.dataSelected.noorder)
                    .then(function (e) {
                        $scope.dataRisOrder = e.data.data[0]

                    })
                // if ($scope.dataSelected.norec_apd!=null){
                //     $scope.showBuktiLayanan=true
                // }
                medifirstService.get("radiologi/get-antrian?noregistrasi=" + $scope.dataSelected.noregistrasi
                    + "&noorder=" + $scope.dataSelected.noorder + "&idruangan=" + $scope.dataSelected.objectruangantujuanfk).then(function (e) {
                        $scope.norec_apd = e.data.data[0].norec
                    })
            }


            
            loadCombo();
            function LoadCache() {
                var chacePeriode = cacheHelper.get('DaftarOrderPenunjang');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.tglAwal = new Date(chacePeriode[0]);
                    $scope.item.tglAkhir = new Date(chacePeriode[1]);
                    $scope.item.namaPasien = chacePeriode[2];
                    $scope.item.noMr = chacePeriode[3];
                    $scope.item.noReg = chacePeriode[4];

                    init();
                }
                else {
                    $scope.item.tglAwal =new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                    $scope.item.tglAkhir =  new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));//$scope.now;
                    init();
                }
            }
            function loadCombo() {

                var kelompk = medifirstService.getKelompokUser()
                if (kelompk.indexOf('radiologi') > -1)/* KEl USER ITI*/ {
                    loginRadiologi = true
                }


                medifirstService.get('radiologi/get-combo-regis', false).then(function (dat) {
                    $scope.listDepartemen = dat.data.departemen;
                    $scope.listKelompokPasien = dat.data.kelompokpasien;
                    $scope.listDokter = dat.data.dokter
                    var kelompokUser=medifirstService.getKelompokUser()
                    
                        
                });
            }
            function init() {
                $scope.isRouteLoading = true;
                var ins = ""
                if ($scope.item.instalasi != undefined) {
                    var ins = "&deptId=" + $scope.item.instalasi.id
                }
                var rg = ""
                if ($scope.item.ruangan != undefined) {
                    var rg = "&ruangId=" + $scope.item.ruangan.id
                }
                var kp = ""
                if ($scope.item.kelompokPasien != undefined) {
                    var kp = "&kelId=" + $scope.item.kelompokPasien.id
                }
                var dok = ""
                if ($scope.item.dokter != undefined) {
                    var dok = "&pegId=" + $scope.item.dokter.id
                }

                var reg = ""
                if ($scope.item.noReg != undefined) {
                    var reg = "&noregistrasi=" + $scope.item.noReg
                }
                var rm = ""
                if ($scope.item.noMr != undefined) {
                    var rm = "&nocm=" + $scope.item.noMr
                }
                var nm = ""
                if ($scope.item.namaPasien != undefined) {
                    var nm = "&namapasien=" + $scope.item.namaPasien
                }
                var noOrderan = ""
                if ($scope.item.noOrderCari != undefined) {
                    var noOrderan = "&noOrders=" + $scope.item.noOrderCari
                }
                var isNotVerif = ""
                if ($scope.item.belumVerifikasi) {
                    var isNotVerif = "isNotVerif=" + true
                    var jmlRow = ""
                    if ($scope.item.jmlRow) {
                        jmlRow = "&jmlRow=" + $scope.item.jmlRow
                    }
                }
                var jmlRow = ""
                if ($scope.item.jmlRow) {
                    jmlRow = "&jmlRow=" + $scope.item.jmlRow
                }

                var tglAwal = ""
                var tglAkhir = ""
                if ($scope.cekBelumVerifs == false) {
                    tglAwal = "&tglAwal=" + moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                    tglAkhir = "&tglAkhir=" + moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                }
                // var ruanganTujuanId= ''
                // var kelompokUser=medifirstService.getKelompokUser()
                // if(kelompokUser =='elektromedik'){
                //     ruanganTujuanId =  "&ruanganTujuanId="+ $scope.ruanganIdElektromedik  
                // }
               
                medifirstService.get("radiologi/get-daftar-order?" +
                    isNotVerif +
                    tglAwal +
                    tglAkhir +
                    reg +
                    rm +
                    nm +
                    ins + rg + kp
                    + dok
                    + noOrderan
                    + jmlRow
                    // +ruanganTujuanId
                    , true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].no = i + 1
                            var tanggal = $scope.now;
                            var tanggalLahir = new Date(dat.data.data[i].tgllahir);
                            var umur = dateHelper.CountAge(tanggalLahir, tanggal);
                            dat.data.data[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari';

                        }

                        var data = dat.data.data
                        // $scope.totalMasuk = 0
                        var Warnaku = [];
                        for (var i = 0; i < dat.data.data.length; i++) {
                            switch (data[i].status) {
                                case "MASUK":
                                    // $scope.totalMasuk =   $scope.totalMasuk +1
                                    data[i].myStyle = { 'background-color': '#606572', 'color': '#F0FFFF' };
                                    break;
                                case "SELESAI":
                                    data[i].myStyle = { 'background-color': '#3CB27A', 'color': '#F0FFFF' };
                                    break;
                                case "PROSES":
                                    data[i].myStyle = { 'background-color': '#FF0000', 'color': '#F0FFFF' };
                                    break;

                            }
                        }

                        $scope.listDataPasien = new kendo.data.DataSource({
                            data: data,
                            // group: $scope.group,
                            pageSize: 20,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }

                        });

                        // $scope.listDataPasien.fetch(function (e) {
                        //     var temp = [];
                        //     for (var key in this._data) {
                        //         if (this._data.hasOwnProperty(key)) {
                        //             var element = this._data[key];
                        //             if (angular.isFunction(element) === false && key !== "_events" && key !== "length")
                        //                 temp.push(element);
                        //         }
                        //     }
                        //     $scope.listPasien = temp;
                        //     cacheHelper.set('listBedahSentral', temp);
                        // });
                    });

            }

            $scope.getRuangan = function () {
                $scope.listRuangan = $scope.item.instalasi.ruangan;
            }
            $scope.cariFilter = function () {

                init();

                var tglAwal = moment($scope.item.tglAwal).format('YYYY-MM-DD HH:mm:ss');
                var tglAkhir = moment($scope.item.tglAkhir).format('YYYY-MM-DD HH:mm:ss');
                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir,
                    2: $scope.item.namaPasien,
                    3: $scope.item.noMr,
                    4: $scope.item.noReg,
                    5: '',
                    6: ''
                }
                cacheHelper.set('DaftarPasienLaboratoriumCtrl', chacePeriode);
            }

            $scope.editOrder = function () {
                if ($scope.dataSelected.status == 'SELESAI') {
                    toastr.error('Data Sudah Di Verifikasi');
                    return
                }

                var arrStr = {
                    0: $scope.dataSelected.nocm,
                    1: $scope.dataSelected.namapasien,
                    2: $scope.dataSelected.jeniskelamin,
                    3: $scope.dataSelected.noregistrasi,
                    4: $scope.dataSelected.umur,
                    5: $scope.dataSelected.objectkelasfk,
                    6: $scope.dataSelected.namakelas,
                    7: $scope.dataSelected.tglregistrasi,
                    8: $scope.dataSelected.norec,
                    9: $scope.dataSelected.namaruangan,
                    10: $scope.dataSelected.objectruanganfk,
                    11: $scope.dataSelected.norec_pd,
                    12: $scope.dataSelected.norec_so,
                    13: $scope.dataSelected.kelompokpasien
                }
                cacheHelper.set('editOrderCache', arrStr);
                $state.go('TransaksiPelayananLabRad')
            }

            // $scope.tambah = function(){
            //  $state.go('Produk')
            // }

            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },

                {
                    "field": "noorder",
                    "title": "No Order",
                    "width": "120px",
                },
                {
                    "field": "tglorder",
                    "title": "Tgl Order",
                    "width": "120px",
                    "template": "<span class='style-center'>{{formatTanggal('#: tglorder #')}}</span>"
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": "100px",
                },
                {
                    "field": "nocm",
                    "title": "No MR",
                    "width": "70px",
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "150px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan Order",
                    "width": "130px",
                },
                {
                    "field": "ruangantujuan",
                    "title": "Ruangan Tujuan",
                    "width": "130px",
                },

                // {
                //     "field": "jeniskelamin",
                //     "title": "Jenis Kelamin",
                //     "width" : "70px",
                // },
                {
                    "field": "umur",
                    "title": "Umur",
                    "width": "100px"
                },
                {
                    "field": "pegawaiorder",
                    "title": "Pengorder",
                    "width": "100px"
                },
                {
                    "field": "kelompokpasien",
                    "title": "Kelompok Pasien",
                    "width" : "100px",
                },

                // {
                //     "field": "namakelas",
                //     "title": "Nama Kelas",
                //     "width" : "80px",
                // },
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "width": "100px",
                    "template": "<span class='style-center'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                },
                {
                    "field": "tglpulang",
                    "title": "Tgl Pulang",
                    "width": "100px",
                    "template": "<span class='style-center'>{{formatTanggal('#: tglpulang #')}}</span>"
                },
                {
                    "field": "keteranganlainnya",
                    "title": "Keterangan",
                    "width": "100px"
                },

                // {
                //     "field": "",
                //     "title": "No Verifikasi",
                //     "width" : "120px",
                // },
            ];
            $scope.data2 = function (dataItem) {
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1

                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,

                    }),
                    columns: [
                        {
                            "field": "tglpelayanan",
                            "title": "Tgl Pelayanan",
                            "width": "50px",
                            "template": "<span class='style-center'>{{formatTanggal('#: tglpelayanan #')}}</span>"
                        },
                        {
                            "field": "namaproduk",
                            "title": "Layanan",
                            "width": "150px",

                        },
                        {
                            "field": "qtyproduk",
                            "title": "Jumlah",
                            "width": "50px",

                        }

                    ]
                }
            };

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MM-YYYY HH:mm');
            }
            function itungUsia(tgl) {

                // var tg = parseInt(form.elements[0].value);
                // var bl = parseInt(form.elements[1].value);
                // var th = parseInt(form.elements[2].value);
                var tanggal = $scope.now;
                var tglLahir = new Date(tgl);
                var selisih = Date.parse(tanggal.toGMTString()) - Date.parse(tglLahir.toGMTString());
                var thn = Math.round(selisih / (1000 * 60 * 60 * 24 * 365));
                //var bln = Math.round((selisih % 365)/(1000*60*60*24));
                return thn + ' thn '// + bln + ' bln'
            }
            var urlHasilVansLab = ''
            medifirstService.get('sysadmin/settingdatafixed/get/urlHasilVansLab').then(function (dat) {
                urlHasilVansLab = dat.data

            })

            $scope.LihatHasil = function (data) {

                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
                if (loginRadiologi == true) {
                    if ($scope.dataRisOrder != undefined) {
                        $window.open("http://182.23.26.34:1111/URLCall.do?LID=dok&LPW=dok&LICD=003&PID=" + $scope.dataRisOrder.patient_id
                            + '&ACN=' + $scope.dataRisOrder.accession_num, "_blank");
                    } else {
                        toastr.info('Hasil Radiologi belum ada')
                    }
                } else {
                    if(urlHasilVansLab ==''){
                        toastr.error('Periksa Setting Data Fixed VANS LAB ')
                        return
                    }
                    if($scope.dataSelected.status!='SELESAI')
                    {
                        toastr.error('Belum Di verifikasi ')
                        return
                    }
                    $window.open(urlHasilVansLab + $scope.dataSelected.noorder, "_blank");
                       
                    // if ($scope.norec_apd != undefined) {
                    //     // $state.go(data ? data : 'DashboardLaboratoriumCtrlInputHasil', {
                    //     //     noRegistrasi: $scope.dataSelected.norec_pd,
                    //     //     noOrder: $scope.dataSelected.noorder ,
                    //     //     noAntrianPasien: $scope.norec_apd,
                    //     //     status : "hasil"
                    //     // })
                    //     var arrStr = {
                    //         0: $scope.dataSelected.nocm,
                    //         1: $scope.dataSelected.namapasien,
                    //         2: $scope.dataSelected.jeniskelamin,
                    //         3: $scope.dataSelected.noregistrasi,
                    //         4: $scope.dataSelected.umur,
                    //         5: $scope.dataSelected.kelompokpasien,
                    //         6: $scope.dataSelected.tglregistrasi,
                    //         7: $scope.norec_apd,
                    //         8: $scope.dataSelected.norec_pd,
                    //         9: $scope.dataSelected.objectkelasfk,
                    //         10: $scope.dataSelected.namakelas,
                    //         11: $scope.dataSelected.objectruanganfk,
                    //         12: $scope.dataSelected.namaruangan
                    //     }
                    //     cacheHelper.set('chaceHasilLab', arrStr);

                    //     $state.go('HasilLaboratorium', {
                    //         norecPd: $scope.dataSelected.norec_pd,
                    //         noOrder: $scope.dataSelected.noorder,
                    //         norecApd: $scope.norec_apd
                    //     })
                    // } else {
                    //     toastr.info('Hasil Lab belum ada')
                    // }

                }

            }

            $scope.verifikasi = function () {
                // isCheckAll = false
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
                if($scope.dataSelected.status =='SELESAI'){
                    toastr.error('Sudah di verifikasi');
                    return
                }
                // if ($scope.dataSelected.nostruk != null) {
                //     toastr.error('Data Sudah DiClosing Hubungi Tata Rekening');
                //     return
                // }
                // if ($scope.dataSelected.status == 'SELESAI DIPERIKSA') {
                //     toastr.error('Data Sudah Di Verifikasi');
                //     return
                // }
                delete $scope.item.dokterVerif
                $scope.btnSimpanVis = false
                $scope.headerVerif = $scope.dataSelected;
                $scope.item.noOrder = $scope.dataSelected.noorder;
                $scope.item.namaPasiens = $scope.dataSelected.namapasien;
                $scope.popUp.namaruangan=$scope.dataSelected.ruangantujuan
             
                $scope.listDokter.push({ id: $scope.dataSelected.objectpegawaiorderfk, namalengkap: $scope.dataSelected.pegawaiorder })
                $scope.item.dokterOrder = { id: $scope.dataSelected.objectpegawaiorderfk, namalengkap: $scope.dataSelected.pegawaiorder };
                loadDiagnosa($scope.dataSelected.noregistrasi)
                idJenisPelayanan = ''
                loadjenisPelayanan($scope.dataSelected.norec_pd,$scope.dataSelected.objectruangantujuanfk)
                $scope.popUpVerif.center().open();
                var actions = $scope.popUpVerif.options.actions;
				// Remove "Close" button
				actions.splice(actions.indexOf("Close"), 1);
				// Set the new options
				$scope.popUpVerif.setOptions({ actions: actions });

                loadDataVerif();

            }
            function loadjenisPelayanan(norec_pd,ruId){
                  medifirstService.get('registrasi/get-jenis-pelayanan/' + norec_pd).then(function (e) {
                      
                    idJenisPelayanan =  e.data.jenispelayanan
                        medifirstService.getDataDummyPHPV2("tatarekening/tindakan/get-tindakan?idRuangan="
                            + ruId
                            + "&idKelas="
                            + 6
                            + "&idJenisPelayanan="
                            +idJenisPelayanan, true, 10, 10)
                        .then(function (x) {
                            $scope.listLayanan = x;
                        })
                  })
                }
                $scope.$watch('popUp.layanan', function(newValue, oldValue) {
                    if (newValue != oldValue  ) {
                        delete $scope.popUp.hargaTindakan
                        $scope.listKomponen = []
                        $scope.popUp.qty = 0
                        if(newValue.id !=undefined){
                            medifirstService.get("sysadmin/general/get-komponenharga?idRuangan="
                            + $scope.dataSelected.objectruangantujuanfk
                            + "&idKelas=" + 6
                            + "&idProduk=" + newValue.id
                            + "&idJenisPelayanan=" + idJenisPelayanan
                        ).then(function (dat) {
                            if(dat.data.data.length > 0){
                                $scope.listKomponen = dat.data.data;
                                $scope.popUp.hargaTindakan = dat.data.data2[0].hargasatuan //$scope.item.namaProduk.hargasatuan;
                                $scope.popUp.qty = 1;
                            }
                          
                         })
                        }
                    }
                });
                // $scope.getHargaTindakan = function () {
                //     delete $scope.popUp.hargaTindakan
                //     $scope.listKomponen = []
                //     $scope.popUp.qty = 0
                //     if($scope.popUp.layanan!=undefined){
                //         medifirstService.get("sysadmin/general/get-komponenharga?idRuangan="
                //         + $scope.dataSelected.objectruangantujuanfk
                //         + "&idKelas=" + 6
                //         + "&idProduk=" + $scope.popUp.layanan.id
                //         + "&idJenisPelayanan=" + idJenisPelayanan
                //     ).then(function (dat) {
                //         if(dat.data.data.length > 0){
                //             $scope.listKomponen = dat.data.data;
                //             $scope.popUp.hargaTindakan = dat.data.data2[0].hargasatuan //$scope.item.namaProduk.hargasatuan;
                //             $scope.popUp.qty = 1;
                //         }
                      
                //      })
                //     }
                   
                // }
            function loadDiagnosa(noreg) {
                medifirstService.get("radiologi/get-diagnosapasienbynoreg?noReg=" + noreg
                ).then(function (data) {

                    var dataICD10 = data.data.datas;
                    if (dataICD10.length > 0) {
                        var diagnosa = ''
                        var a = ""
                        var b = ""
                        for (let i = 0; i < dataICD10.length; i++) {
                            const element = dataICD10[i];
                            var c = element.kddiagnosa + '-' + element.namadiagnosa
                            b = ", " + c
                            a = a + b
                        }
                        diagnosa = a.slice(1, a.length)
                        $scope.headerVerif.diagnosa = diagnosa
                    }
                });
            }
            function loadDataVerif() {
                data2 =[]
                medifirstService.get("radiologi/get-order-pelayanan?norec_so=" + $scope.dataSelected.norec_so
                    + "&objectkelasfk=" + $scope.dataSelected.objectkelasfk, true).then(function (dat) {

                        var dataSource = dat.data.data;
                        for (var i = 0; i < dataSource.length; i++) {
                            dataSource[i].statCheckbox = false;
                            dataSource[i].no = i + 1
                            dataSource[i].qtyproduk= parseFloat(  dataSource[i].qtyproduk)
                            $scope.popUp.idruangan = dataSource[i].idruangan
                            $scope.popUp.objectdepartemenfk = dataSource[i].objectdepartemenfk
                            data2.push(dataSource[i])
                        }
                     
                        $scope.sourceVerif = new kendo.data.DataSource({
                            data: data2,
                            pageSize: 10,
                            total: data2.length,
                            serverPaging: false,

                        });

                    });
            }
          

          
            $scope.add = function () {
              
                if ($scope.popUp.layanan == undefined) {
                    toastr.error("Pilih Layanan terlebih dahulu!!")
                    return;
                }
                if ($scope.popUp.qty == 0) {
                    toastr.error("Qty harus di isi!")
                    return;
                }
             
                var nomor = 0
                if ($scope.sourceVerif == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                if ($scope.popUp.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.popUp.no) {
                            data.no = $scope.popUp.no

                            data.prid = $scope.popUp.layanan.id
                            data.namaproduk = $scope.popUp.layanan.namaproduk
                            data.qtyproduk = parseFloat($scope.popUp.qty) 
                            data.hargasatuan =parseFloat($scope.popUp.hargaTindakan) 
                            data.details = $scope.listKomponen
                            data.ruangantujuan =   $scope.popUp.namaruangan
                            data.idruangan =  $scope.popUp.idruangan
                            data.objectdepartemenfk =  $scope.popUp.objectdepartemenfk 
                            data.tglpelayanan =moment(new Date()).format('YYYY-MM-DD HH:mm')
                            data2[i] = data;
                            $scope.sourceVerif = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }

                } else {
                    data = {
                        no: nomor,
                        prid :$scope.popUp.layanan.id,
                        namaproduk : $scope.popUp.layanan.namaproduk,
                        qtyproduk : parseFloat($scope.popUp.qty) ,
                        hargasatuan :parseFloat($scope.popUp.hargaTindakan) ,
                        details : $scope.listKomponen,
                        ruangantujuan : $scope.popUp.namaruangan,
                        tglpelayanan :moment(new Date()).format('YYYY-MM-DD HH:mm'),
                        idruangan : $scope.popUp.idruangan,
                        objectdepartemenfk :$scope.popUp.objectdepartemenfk 
                    }
                    data2.push(data)
                    // $scope.dataGrid.add($scope.dataSelected)
                    $scope.sourceVerif = new kendo.data.DataSource({
                        data: data2
                    });
                }
                $scope.cancel();
            }
            $scope.klikVerif = function (dataSelectedVerif) {
                var dataProduk = [];
                medifirstService.get("sysadmin/general/get-tindakan?idRuangan="+ dataSelectedVerif.idruangan+ "&idKelas=" + 6+ "&idJenisPelayanan="+idJenisPelayanan
                +"&idProduk="+dataSelectedVerif.prid)
                    .then(function (x) {

                        $scope.listLayanan.add(x.data[0])
                        // for (var i = $scope.listLayanan.length - 1; i >= 0; i--) {
                        //     if ($scope.listLayanan[i].id == dataSelectedVerif.prid) {
                        //         dataProduk = $scope.listLayanan[i]
                        //         break;
                        //     }
                        // }
                        $scope.popUp.layanan =x.data[0];
                        // $scope.listLayanan = x;
                })
                $scope.popUp.no = dataSelectedVerif.no
                // $scope.popUp.hargaTindakan = dataSelectedVerif.no
                $scope.popUp.qty = dataSelectedVerif.qtyproduk
                $scope.dataSelectedVerif = dataSelectedVerif
            }
            $scope.cancel = function () {
                $scope.popUp.layanan = ''
                $scope.popUp.qty = ''
                $scope.popUp.hargaTindakan = ''
                $scope.popUp.idruangan = ''
                $scope.popUp.no = undefined
            }
            $scope.del = function () {
                if ($scope.popUp.qty == 0) {
                    toastr.error("Qty harus di isi!")
                    return;
                }
              
                if ($scope.popUp.layanan == undefined) {
                    toastr.error("Pilih Layanan terlebih dahulu!!")
                    return;
                }
                var nomor = 0
                if ($scope.sourceVerif == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data2.splice(i, 1);
                            for (var i = data2.length - 1; i >= 0; i--) {
                                data2[i].no = i + 1
                            }
                            // data2[i] = data;
                            $scope.sourceVerif = new kendo.data.DataSource({
                                data: data2
                            });
                        }
                    }
                }
                $scope.cancel()
            }
            $scope.columnVerif = [
                // { 
                //     "title": "<input type='checkbox' class='checkbox' ng-click='selectUnselectAllRow()' />",
                //     template: "# if (statCheckbox) { #"+
                //     "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' checked />"+
                //     "# } else { #"+
                //     "<input type='checkbox' class='checkbox' ng-click='selectRow(dataItem)' />"+
                //     "# } #",
                //     width:"30px"
                // },
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Pelayanan",
                    "width": "90px",
                },
                {
                    "field": "namaproduk",
                    "title": "Layanan",
                    "width": "160px",
                },
                {
                    "field": "qtyproduk",
                    "title": "Jumlah",
                    "width": "40px",
                },
                {
                    "field": "ruangantujuan",
                    "title": "Ruangan Tujuan",
                    "width": "120px"
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "140px"
                },


            ];

            $scope.selectRow = function (dataItem) {

                var dataSelect = _.find($scope.sourceVerif._data, function (data) {
                    return data.prid == dataItem.prid;
                });

                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                }
                else {
                    dataSelect.statCheckbox = true;
                }

                $scope.tempCheckbox = dataSelect.statCheckbox;

                reloadDataGrid($scope.sourceVerif._data);

            }
            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
                var tempData = $scope.sourceVerif._data;

                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                    }
                }
                else {
                    isCheckAll = true;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = true;
                    }
                }

                reloadDataGrid(tempData);
            }
            //refresh data grid
            function reloadDataGrid(ds) {
                var newDs = new kendo.data.DataSource({
                    data: ds,
                    pageSize: 10,
                    total: ds.length,
                    serverPaging: false,

                });
                var grid = $('#kGrids').data("kendoGrid");

                grid.setDataSource(newDs);
                grid.refresh();
                // $scope.dataVOloaded = true;
            }

            $scope.batalVerif = function () {
                $scope.popUpVerif.close();
            }

            $scope.simpanVerifikasi = function () {
                if ($scope.item.dokterVerif == undefined) {
                    toastr.error('Dokter Verifikasi harus di isi')
                    return
                }
                var dataPost = [];
                for (var i = 0; i < $scope.sourceVerif._data.length; i++) {
                    // if($scope.sourceVerif._data[i].statCheckbox){
                    var datasys = {
                        "produkid": $scope.sourceVerif._data[i].prid,
                        "hargasatuan": $scope.sourceVerif._data[i].hargasatuan,
                        "qtyproduk": $scope.sourceVerif._data[i].qtyproduk,
                        "komponenharga": $scope.sourceVerif._data[i].details,
                    }
                    dataPost.push(datasys)
                    // }
                }
                var norec_pp = ''
                if ($scope.sourceVerif._data[0].norec_pp != null) {
                    norec_pp = $scope.sourceVerif._data[0].norec_pp
                }

                var itemsave = {
                    "bridging": dataPost,
                    "norec_pp": norec_pp,
                    "noorder": $scope.item.noOrder,
                    "norec_so": $scope.dataSelected.norec_so,
                    "objectkelasfk": $scope.dataSelected.objectkelasfk,
                    "norec_pd": $scope.dataSelected.norec_pd,
                    "objectruangantujuanfk": $scope.dataSelected.objectruangantujuanfk,
                    "objectpegawaiorderfk": $scope.dataSelected.objectpegawaiorderfk,
                    "iddokterverif": $scope.item.dokterVerif.id,
                    "namadokterverif": $scope.item.dokterVerif.namalengkap,
                    "iddokterorder": $scope.item.dokterOrder.id,
                    "namadokterorder": $scope.item.dokterOrder.namalengkap,
                }

                var jsonVansLab = {
                    "noorder": $scope.item.noOrder,                    
                    "iddokterverif": $scope.item.dokterVerif.id,
                    "namadokterverif": $scope.item.dokterVerif.namalengkap,
           
                }

                if (dataPost.length > 0) {
                    for (let i = 0; i < dataPost.length; i++) {
                        const element = dataPost[i];
                        if (element.komponenharga.length == 0) {
                            toastr.error('Tindakan Belum ada Komponen Harganya')
                            return
                        }
                    }

                    $scope.btnSimpanVis = true;
                    var departemen = $scope.sourceVerif._data[0].objectdepartemenfk;
                    if (departemen == 3) {/*lab */ 
                        // medifirstService.post('bridging/penunjang/save-bridging-sysmex', itemsave).then(function (e) {
                        medifirstService.post('bridging/penunjang/save-bridging-vans-lab', jsonVansLab).then(function (e) {
                                medifirstService.post('radiologi/save-pelayanan-pasien',itemsave)
                                .then(function (e) {
                                    init()
                                });
                        });
                       
                    } else if (departemen == 27 &&  $scope.dataSelected.objectruangantujuanfk !=    $scope.ruanganIdElektromedik ) {
                        medifirstService.post('bridging/penunjang/save-bridging-zeta', itemsave).then(function (e) {
                            medifirstService.post('radiologi/save-pelayanan-pasien',itemsave)
                            .then(function (e) {
                                init()
                            });
                        });
                        var client = new HttpClient();
                        client.get('http://127.0.0.1:1237/printvb/bridging?cetak-pacs-order=1&jenis=order&norec=' + itemsave.norec_so + '&view=true', function (response) {
                                // do something with response
                        });

                    }else{
                        medifirstService.post('radiologi/save-pelayanan-pasien',itemsave)
                        .then(function (e) {
                            init()
                        });
                    }

                 
                }
                else {
                    toastr.error('Belum ada data yang dipilih');
                }
            }
            $scope.hapusTindakan = function () {
                if ($scope.dataSelectedVerif == undefined) {
                    toastr.error('Pilih data dahulu!');
                    return;
                }

                var objDelete = {
                    "norec_op": $scope.dataSelectedVerif.norec_op,
                };
                medifirstService.post('radiologi/delete-order-pelayanan',objDelete).then(function (e) {
                    loadDataVerif()
                })
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

            $scope.cetakBuktiLayanan = function () {

                // if ($scope.dataSelected != undefined && $scope.norec_apd != null) {
                   if ($scope.dataSelected != undefined) {
                    // if ($scope.dataSelected.status != 'SELESAI DIPERIKSA') {
                    //     toastr.error('Pilih pasien yang sudah di verifikasi')
                    //     return
                    // }
                    // var fixUrlLaporan = cetakHelper.open("reporting/lapBuktiPelayanan?noRegistrasi=" + $scope.item.pasien.pasienDaftar.noRegistrasi);
                    // window.open(fixUrlLaporan, '', 'width=800,height=600')

                    //cetakan langsung service VB6 by grh
                    var stt = 'false'
                    if (confirm('View Bukti Layanan? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();                   
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-ruangan=1&norec=' +
                        $scope.dataSelected.noregistrasi + '&strIdPegawai=' + $scope.pegawai.id + '&strIdRuangan=' +
                        $scope.dataSelected.objectruangantujuanfk + '&view=' + stt, function (response) {
                        });

                }
            }
            var onDataBound = function () {
                $('td').each(function () {
                  if ($(this).text() == 'MASUK') {$(this).addClass('grey')}
                  if ($(this).text() == 'SELESAI') {$(this).addClass('green')}
                  if ($(this).text() == 'SAMPLE CHECKIN') {$(this).addClass('red')}
                 
                })
              }
            // var onDataBound = function (e) {
            //     var kendoGrid = $("#kGrid").data("kendoGrid"); // get the grid widget
            //     var rows = e.sender.element.find("tbody tr"); // get all rows

            //     // iterate over the rows and if the undelying dataitem's Status field is PPT add class to the cell
            //     for (var i = 0; i < rows.length; i++) {
            //         var row = rows[i];
            //         var status = kendoGrid.dataItem(row).status;
            //         switch (status) {
            //             case "MASUK":
            //                 $(row.cells).addClass("grey");
            //                 break;
            //             case "SELESAI DIPERIKSA":
            //                 $(row.cells).addClass("green");
            //                 break;
            //             case "SAMPLE CHECKIN":
            //                 $(row.cells).addClass("red");
            //                 break;

            //         }
                  
            //     }
            // }
            $scope.mainGridOptions = {
                pageable: true,
                scrollable: true,
                dataBound: onDataBound,
                selectable: 'row',
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "40px",
                    },
                    {
                        "field": "noorder",
                        "title": "No Order",
                        "width": "100px"
                    },
                    {
                        "field": "tglorder",
                        "title": "Tgl Order",
                        "template": "#= new moment(new Date(tglorder)).format('DD-MM-YYYY HH:mm') #",
                        "width": "80px"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "100px"
                    },
                    {
                        "field": "nocm",
                        "title": "No. Rekam Medis",
                        "width": "80px"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "150px"
                    },
                    {
                        "field": "tgllahir",
                        "title": "Tanggal Lahir",
                        "template": "#= new moment(new Date(tgllahir)).format('DD-MM-YYYY HH:mm') #",
                        "width": "80px"
                    },
                    {
                        "field": "namaruangan",
                        "title": " Ruangan Order",
                        "width": "130px"
                    },
                    {
                        "field": "namakelas",
                        "title": "Kelas",
                        "width": "60px"
                    },
                    {
                        "field": "ruangantujuan",
                        "title": "Ruangan Tujuan",
                        "width": "130px"
                    },
                    {
                        "field": "pegawaiorder",
                        "title": "Pengorder",
                        "width": "90px"
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "120px"
                    },
                    {
                        "field": "tglpulang",
                        "title": "Tgl Pulang",
                        "width": "100px"
                    },
                    {
                        "field": "keteranganlainnya",
                        "title": "Keterangan",
                        "width": "100px"
                    },
                    {
                        "field": "status",
                        "title": "Status",
                        "width": "80px"
                    },
                ]
            }
            $scope.hapusOrder = function(){
                if( $scope.dataSelected == undefined)return
                if ($scope.dataSelected.status == 'SELESAI') {
                    toastr.error('Data Sudah Di Verifikasi');
                    return
                }
                // if($scope.dataSelected.objectruangantujuanfk == 571  &&  medifirstService.getUserLogin().id != 2166 ){
                //     toastr.error('Tidak ada akses menghapus data');
                //    return
                // }
                var confirm = $mdDialog.confirm()
                .title('Peringatan')
                .textContent('Yakin mau menghapus data ?')
                .ariaLabel('Lucky day')
                .cancel('Tidak')
                .ok('OK')
                $mdDialog.show(confirm).then(function () {
                    medifirstService.post('radiologi/delete-order-penunjang',{norec: $scope.dataSelected.norec_so}).then(function(e){
                        init()
                    })
                })
               
            }

            $scope.pengkajianMedis = function(){
                if ($scope.dataSelected ==undefined)
                {
                     window.messageContainer.error("Pilih Dahulu Pasien!")
                     return
                 }
            
            medifirstService.get("registrasi/get-apd?noregistrasi="
                        + $scope.dataSelected.noregistrasi
                        + "&objectruanganlastfk=" + $scope.dataSelected.objectruanganfk
                    ).then(function (data) {
                        var dataAntrian = data.data.data[0];

             // debugger;
             var arrStr ={ 
                 0 : $scope.dataSelected.nocm,
                 1 : $scope.dataSelected.namapasien,
                 2 : $scope.dataSelected.jeniskelamin,
                 3 : $scope.dataSelected.noregistrasi, 
                 4 : $scope.dataSelected.umur,
                 5 : $scope.dataSelected.kelompokpasien,
                 6 : $scope.dataSelected.tglregistrasi,
                 7 :dataAntrian.norec_apd,
                 8 : $scope.dataSelected.norec_pd,
                 9 : $scope.dataSelected.objectkelasfk,
                 10 : $scope.dataSelected.namakelas,
                 11 : $scope.dataSelected.objectruanganfk,
                 12 : $scope.dataSelected.namaruangan + '`'
             }
                cacheHelper.set('cacheRMelektronik', arrStr);
                $state.go('RekamMedis',{
                    norecAPD:dataAntrian.norec_apd,
                    noRec: dataAntrian.norec_apd
                })
               })
            }
             $scope.columnGridVerif = {
                sortable: true,
                // pageable: true,
                selectable: "row",
                columns: [
                {
                    "field": "no",
                    "title": "No",
                    "width": "30px",
                },
                 {
                    "field": "tglpelayanan",
                    "title": "Tgl Pelayanan",
                    "template": "#= new moment(new Date(tglpelayanan)).format('DD-MM-YYYY HH:mm') #",
                    "width": "80px"
                },

                {
                    field: "namaproduk",
                    title: "Nama Produk",
                    width: "200px"
                },
                {
                    field: "jumlah",
                    title: "Jumlah",
                    width: "80px",
                    attributes: { style: "text-align:right;" },
                    // aggregates: ["sum"],
                    // footerTemplate: "<span > {{ #:data.jumlah.sum  # }}</span>"
                },
                {
                    field: "hargasatuan",
                    title: "Harga",
                    width: "100px",
                   "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', 'Rp. ')}}</span>",
                    // attributes: { style: "text-align:right;" },
                    // aggregates: ["sum"],
                    // footerTemplate: "<span >Rp. {{formatRupiah('#:data.hargasatuan.sum  #', '')}}</span>"
                },
                {
                    field: "total",
                    title: "Total",
                    width: "100px",
                   "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>",
                    aggregates: ["sum"],
                    footerTemplate: "<span >Rp. {{formatRupiah('#:data.total.sum  #', '')}}</span>"
                },
           
            ],
            sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
        };


            $scope.detailVerif = function(){
                if ($scope.dataSelected == undefined) {
                    toastr.error('Pilih data dulu');
                    return
                }
                if($scope.dataSelected.status !='SELESAI'){
                    toastr.error('Belum di verifikasi');
                    return
                }
              
                $scope.headerVerif = $scope.dataSelected;
                $scope.dataGridVerif = new kendo.data.DataSource({
                    data: [],
                    pageSize: 10
                });
                medifirstService.get('radiologi/get-detail-verifikasi?norec_so='+ $scope.dataSelected.norec_so).then(function(z){
                    for (var i = 0; i < z.data.data.length; i++) {
                       const el= z.data.data[i]
                       el.no = i+1
                    }
                   $scope.dataGridVerif = new kendo.data.DataSource({
                        data:  z.data.data,
                        serverPaging: false,
                        pageSize: 10,
                        schema: {
                            model: {
                                fields: {
                                    jumlah: { type: "number" },
                                    hargasatuan: { type: "number" },
                                  
                                    total: { type: "number" },
                                }
                            }
                        }, aggregate: [
                            { field: 'jumlah', aggregate: 'sum' },
                            { field: 'hargasatuan', aggregate: 'sum' },
                            { field: 'total', aggregate: 'sum' },
                        ]
                    });
                    $scope.popUpDetailVerif.center().open()
                })
                
            }

            //********************************  $scope.cekBelumVerifs=true;***

        }
    ]);
});
