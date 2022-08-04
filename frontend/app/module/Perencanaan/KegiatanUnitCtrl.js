define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('KegiatanUnitCtrl', ['$scope', 'MedifirstService',
        function ($scope, medifirstService) {
            $scope.dataVOloaded = true;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.dataUnitSelected = {};
            loadDataGrid();
            FormLoad();
            function loadDataGrid() {
                $scope.isRouteLoading = true;
                // medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                //     $scope.isRouteLoading = false
                //     $scope.dataSourceHead = e.data.kelompokhead                    
                //     $scope.listPertama = e.data.kelompokpertama
                // })

                medifirstService.get("perencanaan/get-data-kegiatan").then(function (e) {
                    $scope.isRouteLoading = false
                    $scope.dataSourceHead = e.data.kegiatanunit
                    $scope.dataSourceKegiatanUnit = e.data.kegiatanunit                    
                    $scope.listPertama = e.data.kelompokpertama
                })
            }    

            function FormLoad() {
                
                //$scope.KelompokUser = medifirstService.getKelompokUser();
                //$scope.item.kodeHead =  medifirstService.getKelompokUser();
                medifirstService.get("tatarekening/get-data-login", true, true, 20).then(function (data) {
                    medifirstService.get("perencanaan/get-pegawai-departemen?id=" + data.data.datalogin.userData.id, true, true, 20).then(function (data) {
                        //$scope.item.kodeHead = data.data[0].id;
                        $scope.listRuangan = data.data;
                    });
                });
            }

            $scope.columnKelompokHead = [
                // {
                //     "field": "id",
                //     "title": "Id",
                //     "width": "50px"
                // },
                {
                    "field": "kdkelompokhead",
                    "title": "Kode",
                    "width": "80px"
                },
                {
                    "field": "kelompokhead",
                    "title": "Kelompok Pertama",
                    "width": "200px"
                }//,
                // {
                //     "field": "kodeexternal",
                //     "title": "Kode External",
                //     "width": "80px"
                // },
                // {
                //     "field": "namaexternal",
                //     "title": "Nama External",
                //     "width": "200px"
                // }
            ];
            $scope.columnKelompokPertama = [
                // {
                //     "field": "id",
                //     "title": "Id",
                //     "width": "50px"
                // },
                {
                    "field": "departemen",
                    "title": "Ruangan",
                    "width": "80px"
                },
                {
                    "field": "tahun",
                    "title": "Tahun",
                    "width": "80px"
                },
                {
                    "field": "namaexternal",
                    "title": "Kegiatan Unit",
                    "width": "200px"
                }//,
                // {
                //     "field": "namaexternal",
                //     "title": "Nama External",
                //     "width": "200px"
                // }
            ];
           


            $scope.saveHead = function () {
                var kdHead = ""
                if ($scope.item.kodeHead != undefined)
                    kdHead = $scope.item.kodeHead

                var namaHead = ""
                if ($scope.item.namaHead != undefined) {
                    namaHead = $scope.item.namaHead
                }
                else {
                    return;
                    toastr.error('Nama Kelompok Pertama harus di isi')
                }

                var kdExtern = ""
                if ($scope.item.kodeExternalHead != undefined)
                    kdExtern = $scope.item.kodeExternalHead

                var namaExtern = ""
                if ($scope.item.namaExternalHead != undefined)
                    namaExtern = $scope.item.namaExternalHead

                var id = ""
                if ($scope.idHead != undefined)
                    id = $scope.idHead

                var jsonSave = {
                    "id": id,
                    "kdkelompokhead": kdHead,
                    "kelompokhead": namaHead,
                    "kodeexternal": kdExtern,
                    "namaexternal": namaExtern,
                }
                medifirstService.post('perencanaan/save-kel-head-anggaran', jsonSave).then(function (e) {
                    $scope.batal();
                    FormLoad();
                })
            }
            $scope.saveKelPertama = function () {
                var tahun = ""
                if ($scope.item.tahun != undefined)
                    tahun = $scope.item.tahun

                var kegiatan = ""
                if ($scope.item.kegiatan != undefined) 
                    kegiatan = $scope.item.kegiatan
                


                var id = ""
                if ($scope.idPertama != undefined)
                    id = $scope.idPertama

                var departemen = ""
                if ($scope.item.Ruangan != undefined)
                    departemen = $scope.item.Ruangan.nama

                var iddepartemen = ""
                if ($scope.item.Ruangan != undefined)
                    iddepartemen = $scope.item.Ruangan.id

                var jsonSave = {
                    "id": id,
                    "tahun": tahun,
                    "namaexternal": kegiatan,                                    
                    "namadepartemen": departemen,                    
                    "iddepartemen": iddepartemen
                }
                medifirstService.post('perencanaan/save-kegiatan-unit', jsonSave).then(function (e) {
                    $scope.batal();
                    FormLoad();
                })
            }
            

          $scope.saveKel = function (id) {

              if(id == 5){
                   var jsonSave = {
                    "kelompok" :5,      
                    "id": $scope.idLima != undefined? $scope.idLima : '',
                    "kdkelompok": $scope.item.kodeKelompokLima != undefined?$scope.item.kodeKelompokLima :null,
                    "namakelompok": $scope.item.namaKelompokLima != undefined?$scope.item.namaKelompokLima :null,
                    "kodeexternal":  $scope.item.kodeExternalLima != undefined?$scope.item.kodeExternalLima :null,
                    "namaexternal":    $scope.item.namaExternalLima != undefined?$scope.item.namaExternalLima :null,
                    "idparent": $scope.item.kelompokKeempat != undefined?$scope.item.kelompokKeempat.id :null
                }
              }
               if(id == 6){
                 var jsonSave = {
                      "kelompok" :6,      
                    "id":  $scope.idEnam != undefined? $scope.idEnam : '',
                    "kdkelompok": $scope.item.kodeKelompokEnam != undefined?$scope.item.kodeKelompokEnam :null,
                    "namakelompok": $scope.item.namaKelompokEnam != undefined?$scope.item.namaKelompokEnam :null,
                    "kodeexternal":  $scope.item.kodeExternalEnam != undefined?$scope.item.kodeExternalEnam :null,
                    "namaexternal":    $scope.item.namaExternalEnam != undefined?$scope.item.namaExternalEnam :null,
                    "idparent": $scope.item.kelompokKelima != undefined?$scope.item.kelompokKelima.id :null
                }
               }
               if(id == 7){
                 var jsonSave = {
                      "kelompok" :7,      
                    "id":  $scope.idTujuh != undefined? $scope.idTujuh : '',
                    "kdkelompok": $scope.item.kodeKelompokTujuh != undefined?$scope.item.kodeKelompokTujuh :null,
                    "namakelompok": $scope.item.namaKelompokTujuh != undefined?$scope.item.namaKelompokTujuh :null,
                    "kodeexternal":  $scope.item.kodeExternalTujuh != undefined?$scope.item.kodeExternalTujuh :null,
                    "namaexternal":    $scope.item.namaExternalTujuh != undefined?$scope.item.namaExternalTujuh :null,
                    "idparent": $scope.item.kelompokKeenam != undefined?$scope.item.kelompokKeenam.id :null
                }
               }
              
               
                medifirstService.post('perencanaan/save-kel-anggaran', jsonSave).then(function (e) {
                    $scope.batal();
                    loadDataGrid();
                })
            }

            $scope.batal = function () {
                $scope.item = {};
                $scope.idHead = ""
                $scope.idPertama = ""
                $scope.idKedua = ""
                $scope.idKetiga = ""
                $scope.idKeempat = ""

            }


            $scope.klik = function (dataHeadSelected) {
                if (dataHeadSelected != undefined) {
                    $scope.idHead = dataHeadSelected.id
                    $scope.item.kodeHead = dataHeadSelected.kdkelompokhead
                    $scope.item.namaHead = dataHeadSelected.kelompokhead
                    $scope.item.kodeExternalHead = dataHeadSelected.kodeexternal
                    $scope.item.namaExternalHead = dataHeadSelected.namaexternal
                }
            }
            $scope.klikPertama = function (dataPertamaSelected) {
                if (dataPertamaSelected != undefined) {
                    $scope.idPertama = dataPertamaSelected.id
                    $scope.item.tahun = dataPertamaSelected.tahun        
                    $scope.item.kegiatan = dataPertamaSelected.namaexternal
                    
                    if (dataPertamaSelected.iddepartemen != null)
                        $scope.item.Ruangan = {id:dataPertamaSelected.iddepartemen, nama:dataPertamaSelected.departemen}
                    else
                        $scope.item.Ruangan = ""
                   
                   
                }
            }


             $scope.hapusKelompok = function (kode) {
                        var id = ''
                        if(kode == 5){
                            id = $scope.idLima
                        }
                         if(kode == 6){
                            id = $scope.idEnam
                        }
                        if(kode == 7){
                            id = $scope.idTujuh
                        }

                        if(id == '')return
                    var itemDelete = {
                        "id":id ,
                        "kelompok": kode,
                    }
                    medifirstService.post('perencanaan/delete-kel-anggaran', itemDelete).then(function (e) {
                        loadDataGrid();
                        $scope.idBerapa = ""
                        $scope.batal()
                    })
                
            }
            $scope.hapusHead = function () {
                if ($scope.idHead == undefined) {
                    toastr.error('Pilih Data Dulu', 'Informasi');
                    return
                } else {
                    var itemDelete = {
                        "id": $scope.idHead,
                    }
                    medifirstService.post('perencanaan/delete-kel-head-anggaran', itemDelete).then(function (e) {
                        loadDataGrid();
                        $scope.idHead = ""
                        $scope.batal()
                    })
                }
            }
            $scope.hapusKelPertama = function () {
                if ($scope.idPertama == undefined) {
                    toastr.error('Pilih Data Dulu', 'Informasi');
                    return
                } else {
                    var itemDelete = {
                        "id": $scope.idPertama,
                    }
                    medifirstService.post('perencanaan/delete-kegiatan-unit', itemDelete).then(function (e) {
                        loadDataGrid();
                        $scope.idPertama = "";
                        $scope.batal();
                    })
                }
            }

            
            
        }
    ]);
});