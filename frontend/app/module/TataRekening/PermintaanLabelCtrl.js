define(['initialize'], function (initialize, pasienServices) {
    'use strict';
    initialize.controller('PermintaanLabelCtrl', ['$q', '$scope', 'ModelItem', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $scope, ModelItem, cacheHelper, dateHelper, medifirstService) {
            $scope.isRouteLoading = false;
            var currentParams;
            $scope.item = {};
            $scope.items = {};
            var data2 = [];
            $scope.now = new Date();
            $scope.date = new Date();
            var tanggals = dateHelper.getDateTimeFormatted($scope.date);
            $scope.dataSelected = {};
            $scope.tombolSimpanVis = true;
            $scope.item.qtyLabel = 0;
            $scope.item = {
                from: $scope.now,
                until: $scope.now
            }
            FormLoad()
           
           
            $scope.batal = function () {
                $scope.from = $scope.until = $scope.now;
                delete $scope.item.noRegistrasi;
            }
            
            function FormLoad(){
                $scope.formatNum = {
                    format: "#.#",
                    decimals: 0
                }
    
                var tglPermintaan = moment($scope.item.tglPermintaan).format('YYYY-MM-DD HH:mm');
               
                
    
                //Tanggal Default
                $scope.item.tglPermintaan = tanggals;
                
                medifirstService.getPart("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                    $scope.listPegawai = data;
                });                    
            }
          
            $scope.cekPegawai = function (data) {
                $scope.item.pegawai = undefined;
                // debugger;
                if (data === true) {
                    // $scope.ruangans = modelItem.kendoHttpSource('/registrasi-pelayanan/get-all-ruangan-rawat-inap');
                    $scope.comboPegawai = true;
                    $scope.textPegawai = true;
                } else
                if (data === false || data === undefined) {
                    $scope.textPegawai = false;
                    $scope.comboPegawai = false;
                } else {
                    return;
                }
            }

            $scope.$watch('model.pegawai', function (data) {
                if (!data) {
                    $scope.textPegawai = false
                    $scope.comboPegawai = false
                } else
                    $scope.cekPegawai(data);
            })

            $scope.tambah = function () {
                if ($scope.item.dataPasien.nocm == undefined) {
                    alert("Cari data pasien dulu")
                    return;
                }
                if ($scope.item.ruangan.objectruanganfk == undefined) {
                    alert("Pilih ruangan dulu")
                    return;
                }

                var nomor = 0
                if ($scope.dataGrid == undefined) {
                    nomor = 1
                } else {
                    nomor = data2.length + 1
                }
                var data = {};               
                data = {
                    no: nomor,
                    nocm: $scope.item.dataPasien.nocm,                    
                    namapasien: $scope.item.dataPasien.namapasien,
                    noregistrasi: $scope.item.noRegis,
                    objectruanganfk: $scope.item.ruangan.id,
                    namaruangan: $scope.item.ruangan.namaruangan,
                    norec_apd: $scope.item.dataPasien.norec_apd,                    
                }
                data2.push(data)                
                $scope.dataGrid = new kendo.data.DataSource({
                    data: data2
                });               
                Kosongkan()                
            }

            $scope.klikGrid = function (dataSelected) {

                $scope.item.no = dataSelected.no
                $scope.item.ruangan = {
                    id: dataSelected.objectruanganfk,
                    namaruangan: dataSelected.namaruangan
                }
                $scope.item.noRegis = dataSelected.noregistrasi
                getPasienByNoreg()

            }

            $scope.hapus = function () {
                if ($scope.item.dataPasien.nocm == undefined) {
                    alert("Cari data pasien dulu")
                    return;
                }
                if ($scope.item.ruangan == undefined) {
                    alert("Pilih ruangan dulu")
                    return;
                }                
                var data = {};
                if ($scope.item.no != undefined) {
                    for (var i = data2.length - 1; i >= 0; i--) {
                        if (data2[i].no == $scope.item.no) {
                            data2.splice(i, 1);

                            var subTotal = 0;
                            for (var i = data2.length - 1; i >= 0; i--) {
                                subTotal = subTotal + parseFloat(data2[i].total)
                                data2[i].no = i + 1
                            }                            
                            $scope.dataGrid = new kendo.data.DataSource({
                                data: data2
                            });                           
                            $scope.item.totalSubTotal = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

                        }                        
                    }
                }
                Kosongkan()
            }

            $scope.simpan = function () {
                if ($scope.item.qtyLabel == undefined) {
                    alert("Jumlah tidak boleh kosong!!")
                    return
                }

                var pegawai = "";
                if ($scope.item.pegawai == undefined) {
                    pegawai = null;
                } else
                    pegawai = $scope.item.pegawai.id;

                var pegawaiManual = "";
                if ($scope.item.namaPengorder == undefined) {
                    pegawaiManual = null;
                } else
                    pegawaiManual = $scope.item.namaPengorder;

                var keterangan = "";
                if ($scope.item.keterangan == undefined) {
                    keterangan = null;
                } else
                    keterangan = $scope.item.keterangan;

                if (data2.length == 0) {
                    alert("Cari Pasien terlebih dahulu!!")
                    return
                }
                var permintaanlabel = {
                    tglpermintaan: moment($scope.item.tglPermintaan).format('YYYY-MM-DD hh:mm:ss'),
                    noregistrasifk: $scope.listRuangan[0].norec_apd, //norec_apd
                    pegawaiorderM: pegawaiManual,
                    pegawaiorderA: pegawai,
                    qtyorder: $scope.item.qtyLabel,
                    keterangan: $scope.item.keterangan,
                    permintaanlabeldetail: data2

                }

                var objSave = {
                    permintaanlabel: permintaanlabel,
                    //   permintaanlabeldetail: data2//$scope.dataGrid._data
                }
                $scope.tombolSimpanVis = false;
                medifirstService.post('registrasi/orderlabel/save-order-label',objSave).then(function (e) {
                    $scope.tombolSimpanVis = true;
                    $scope.item.resep = e.data.noresep.norec
                   

                })
                $scope.item = {};
                Kosongkan()
                $scope.dataGrid = {};
                $scope.item.tglPermintaan = tanggals;
            }


            $scope.columnGrid = [{
                    "field": "no",
                    "title": "No",
                    "width": 50
                },
                {
                    "field": "noregistrasi",
                    "title": "No Registrasi",
                    "width": 150
                }, {
                    "field": "nocm",
                    "title": "No RM",
                    "width": 150
                }, {
                    "field": "namapasien",
                    "title": "Nama Pasien"
                }, {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": 150
                }

            ];

            function Kosongkan() {
                $scope.item.dataPasien = ''
                $scope.item.ruangan = ''
                $scope.item.noRegis = ''
            }
            $scope.batal = function () {
                $scope.item = {};
                Kosongkan()
                $scope.item.tglPermintaan = tanggals;
                $scope.dataGrid = {};
            }
            // data dummy detil list registrasi
            $scope.listRegistrasiDetil = [];
            $scope.batal();

            $scope.findByRegistrasi = function () {
                $scope.isRouteLoading = true;
                getPasienByNoreg()

            }

            function getPasienByNoreg() {
                var norReg = "";
                if ($scope.item.noRegis != undefined) {
                    norReg = "noReg=" + $scope.item.noRegis;
                } else {
                    alert("No Registrasi tidak boleh kosong!")
                    return;
                }
                medifirstService.get("registrasi/orderlabel/get-pasienbynoreg?" +
                    norReg
                ).then(function (e) {
                    $scope.item.dataPasien = e.data.data[0];
                    $scope.item.dataPasien.tgllahir = new Date($scope.item.dataPasien.tgllahir);
                    $scope.listRuangan = e.data.data;
                    $scope.item.ruangan = {
                        // id: $scope.listRuangan[0].objectruanganfk,
                        namaruangan: $scope.listRuangan[0].namaruangan,
                        alamatlengkap: $scope.listRuangan[0].alamatlengkap,
                        namapasien: $scope.listRuangan[0].namapasien,
                        nocm: $scope.listRuangan[0].nocm,
                        norec_apd: $scope.listRuangan[0].norec_apd,
                        noregistrasi: $scope.listRuangan[0].noregistrasi,
                        objectruanganfk: $scope.listRuangan[0].objectruanganfk,
                        tgllahir: $scope.listRuangan[0].tgllahir,
                    }

                    $scope.isRouteLoading = false;
                });
            }

            // $scope.findBynoCM = function (noCm) {
            //     var listRawRequired = [
            //         "item.noCm|ng-model|No CM"
            //     ];
            //     var isValid = ModelItem.setValidation($scope, listRawRequired);
            //     if (isValid.status) {
            //         $scope.isRouteLoading = true;
            //         $q.all([findPasien.findByNoCM(noCm),
            //             findPasien.getDaftarRegistrasi(noCm, '', '', '')
            //         ]).then(function (e) {
            //             if (e[0].statResponse) {
            //                 $scope.item = e[0].data.data;
            //                 $scope.item.tglLahir = new Date($scope.item.tglLahir);
            //                 $scope.item.from = $scope.now;
            //                 $scope.item.until = $scope.now;
            //             }
            //             if (e[1].statResponse) {
            //                 $scope.listRegistrasi = new kendo.data.DataSource({
            //                     data: e[1].data.data,
            //                     pageable: true,
            //                     pagesize: 5
            //                 })
            //             }
            //             $scope.isRouteLoading = false;
            //             $scope.showDetail = false;
            //         }, function (err) {
            //             messageContainer.error(err);
            //             $scope.isRouteLoading = false;
            //         });
            //     } else {
            //         ModelItem.showMessages(isValid.messages);
            //     }
            //     $scope.cboDiagnosa = false;
            //     $scope.cboInputDiagnosa = true;
            // }


            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
        }
    ]);
});