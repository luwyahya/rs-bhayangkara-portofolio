define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('KelompokAnggaranCtrl', ['$scope', 'MedifirstService',
        function ($scope, medifirstService) {
            $scope.dataVOloaded = true;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.dataAnggaranSelected = {};
            loadDataGrid();
            function loadDataGrid() {
                $scope.isRouteLoading = true;
                medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                    $scope.isRouteLoading = false
                    $scope.dataSourceHead = e.data.kelompokhead
                    $scope.dataSourcePertama = e.data.kelompokpertama
                    $scope.dataSourceKedua = e.data.kelompokkedua
                    $scope.dataSourceKetiga = e.data.kelompokketiga
                    $scope.dataSourceKeempat = e.data.kelompokkeempat
                    $scope.dataSourceLima = e.data.kelompokkelima
                    $scope.dataSourceEnam = e.data.kelompokkeenam
                    $scope.dataSourceTujuh = e.data.kelompokketujuh
                    $scope.listHead = e.data.kelompokhead
                    $scope.listPertama = e.data.kelompokpertama
                    $scope.listKedua = e.data.kelompokkedua
                    $scope.listKetiga = e.data.kelompokketiga
                    $scope.listKeempat = e.data.kelompokkeempat
                    $scope.listKelima = e.data.kelompokkelima
                    $scope.listKeenam = e.data.kelompokkeenam
                })
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
                    "field": "kdchildpertama",
                    "title": "Kode",
                    "width": "80px"
                },
                {
                    "field": "childpertama",
                    "title": "Kelompok Kedua",
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
            $scope.columnKelompokKedua = [
                // {
                //     "field": "id",
                //     "title": "Id",
                //     "width": "50px"
                // },
                {
                    "field": "kdchildkedua",
                    "title": "Kode",
                    "width": "80px"
                },
                {
                    "field": "childkedua",
                    "title": "Kelompok Ketiga",
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
            $scope.columnKelompokKetiga = [
                // {
                //     "field": "id",
                //     "title": "Id",
                //     "width": "50px"
                // },
                {
                    "field": "kdchildketiga",
                    "title": "Kode",
                    "width": "80px"
                },
                {
                    "field": "childketiga",
                    "title": "Kelompok Keempat",
                    "width": "200px"
                },
                {
                    "field": "kodeexternal",
                    "title": "Kode External",
                    "width": "80px"
                }//,
                // {
                //     "field": "namaexternal",
                //     "title": "Nama External",
                //     "width": "200px"
                // }
            ];
            $scope.columnKelompokKeempat = [
                // {
                //     "field": "id",
                //     "title": "Id",
                //     "width": "50px"
                // },
                {
                    "field": "kdchildkeempat",
                    "title": "Kode",
                    "width": "80px"
                },
                {
                    "field": "childkeempat",
                    "title": "Kelompok Kelima",
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
              $scope.columnKelompokLima = [
                // {
                //     "field": "id",
                //     "title": "Id",
                //     "width": "50px"
                // },
                {
                    "field": "kdchildkelima",
                    "title": "Kode",
                    "width": "80px"
                },
                {
                    "field": "childkelima",
                    "title": "Kelompok Keenam",
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

            $scope.columnKelompokEnam = [
                // {
                //     "field": "id",
                //     "title": "Id",
                //     "width": "50px"
                // },
                {
                    "field": "kdchildkeenam",
                    "title": "Kode",
                    "width": "80px"
                },
                {
                    "field": "childkeenam",
                    "title": "Kelompok Ketujuh",
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

            $scope.columnKelompokTujuh = [
                // {
                //     "field": "id",
                //     "title": "Id",
                //     "width": "50px"
                // },
                {
                    "field": "kdchildketujuh",
                    "title": "Kode",
                    "width": "80px"
                },
                {
                    "field": "childketujuh",
                    "title": "Kelompok Kedelapan",
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
                if ($scope.idHead != undefined){
                    id = $scope.idHead
                }

                var jsonSave = {
                    "id": id,
                    "kdkelompokhead": kdHead,
                    "kelompokhead": namaHead,
                    "kodeexternal": kdExtern,
                    "namaexternal": namaExtern,
                }
                medifirstService.post('perencanaan/save-kel-head-anggaran', jsonSave).then(function (e) {
                    $scope.batal();
                    loadDataGrid();
                })
            }
            $scope.saveKelPertama = function () {
                var kdHead = ""
                if ($scope.item.kodeKelompokPertama != undefined)
                    kdHead = $scope.item.kodeKelompokPertama

                var namaHead = ""
                if ($scope.item.namaKelompokPertama != undefined) {
                    namaHead = $scope.item.namaKelompokPertama
                }
                else {
                    return;
                    toastr.error('Nama Kelompok Kedua harus di isi')
                }

                var kdExtern = ""
                if ($scope.item.kodeExternalPertama != undefined)
                    kdExtern = $scope.item.kodeExternalPertama

                var namaExtern = ""
                if ($scope.item.namaExternalPertama != undefined)
                    namaExtern = $scope.item.namaExternalPertama

                var id = ""
                if ($scope.idPertama != undefined)
                    id = $scope.idPertama

                var idparent = ""
                if ($scope.item.kelompokHead != undefined)
                    idparent = $scope.item.kelompokHead.id
                var jsonSave = {
                    "id": id,
                    "kdchildpertama": kdHead,
                    "childpertama": namaHead,
                    "kodeexternal": kdExtern,
                    "namaexternal": namaExtern,
                    "idparent": idparent
                }
                medifirstService.post('perencanaan/save-kel-pertama-anggaran', jsonSave).then(function (e) {
                    $scope.batal();
                    loadDataGrid();
                })
            }
            $scope.saveKelKedua = function () {
                var kdHead = ""
                if ($scope.item.kodeKelompokKedua != undefined)
                    kdHead = $scope.item.kodeKelompokKedua

                var namaHead = ""
                if ($scope.item.namaKelompokKedua != undefined) {
                    namaHead = $scope.item.namaKelompokKedua
                }
                else {
                    return;
                    toastr.error('Nama Kelompok Ketiga harus di isi')
                }

                var kdExtern = ""
                if ($scope.item.kodeExternalKedua != undefined)
                    kdExtern = $scope.item.kodeExternalKedua

                var namaExtern = ""
                if ($scope.item.namaExternalKedua != undefined)
                    namaExtern = $scope.item.namaExternalKedua

                var id = ""
                if ($scope.idKedua != undefined)
                    id = $scope.idKedua

                var idparent = ""
                if ($scope.item.kelompokPertama != undefined)
                    idparent = $scope.item.kelompokPertama.id

                var jsonSave = {
                    "id": id,
                    "kdchildkedua": kdHead,
                    "childkedua": namaHead,
                    "kodeexternal": kdExtern,
                    "namaexternal": namaExtern,
                    "idparent": idparent
                }
                medifirstService.post('perencanaan/save-kel-kedua-anggaran', jsonSave).then(function (e) {
                    $scope.batal();
                    loadDataGrid();
                })
            }
            $scope.saveKelKetiga = function () {
                var kdHead = ""
                if ($scope.item.kodeKelompokKetiga != undefined)
                    kdHead = $scope.item.kodeKelompokKetiga

                var namaHead = ""
                if ($scope.item.namaKelompokKetiga != undefined) {
                    namaHead = $scope.item.namaKelompokKetiga
                }
                else {
                    return;
                    toastr.error('Nama Kelompok Keempat harus di isi')
                }

                var kdExtern = ""
                if ($scope.item.kodeExternalKetiga != undefined)
                    kdExtern = $scope.item.kodeExternalKetiga

                var namaExtern = ""
                if ($scope.item.namaExternalKetiga != undefined)
                    namaExtern = $scope.item.namaExternalKetiga

                var id = ""
                if ($scope.idKetiga != undefined)
                    id = $scope.idKetiga

                var idparent = ""
                if ($scope.item.kelompokKedua != undefined)
                    idparent = $scope.item.kelompokKedua.id

                var jsonSave = {
                    "id": id,
                    "kdchildketiga": kdHead,
                    "childketiga": namaHead,
                    "kodeexternal": kdExtern,
                    "namaexternal": namaExtern,
                    "idparent": idparent
                }
                medifirstService.post('perencanaan/save-kel-ketiga-anggaran', jsonSave).then(function (e) {
                    $scope.batal();
                    loadDataGrid();
                })
            }
            $scope.saveKelKeempat = function () {
                var kdHead = ""
                if ($scope.item.kodeKelompokKeempat != undefined)
                    kdHead = $scope.item.kodeKelompokKeempat

                var namaHead = ""
                if ($scope.item.namaKelompokKeempat != undefined) {
                    namaHead = $scope.item.namaKelompokKeempat
                }
                else {
                    return;
                    toastr.error('Nama Kelompok Kelima harus di isi')
                }

                var kdExtern = ""
                if ($scope.item.kodeExternalKeempat != undefined)
                    kdExtern = $scope.item.kodeExternalKeempat

                var namaExtern = ""
                if ($scope.item.namaExternalKeempat != undefined)
                    namaExtern = $scope.item.namaExternalKeempat

                var id = ""
                if ($scope.idKeempat != undefined)
                    id = $scope.idKeempat

                var idparent = ""
                if ($scope.item.kelompokKetiga != undefined)
                    idparent = $scope.item.kelompokKetiga.id

                var jsonSave = {
                    "id": id,
                    "kdchildkeempat": kdHead,
                    "childkeempat": namaHead,
                    "kodeexternal": kdExtern,
                    "namaexternal": namaExtern,
                    "idparent": idparent
                }
                medifirstService.post('perencanaan/save-kel-keempat-anggaran', jsonSave).then(function (e) {
                    $scope.batal();
                    loadDataGrid();
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
                $scope.idLima = ""
                 $scope.idEnam = ""
                 $scope.idTujuh = ""

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
                    $scope.item.kodeKelompokPertama = dataPertamaSelected.kdchildpertama
                    if (dataPertamaSelected.idparent != null)
                        $scope.item.kelompokHead = {id:dataPertamaSelected.idparent, nama:dataPertamaSelected.nama}
                    else
                        $scope.item.kelompokHead = ""
                    if (dataPertamaSelected.kodeexternal != null)
                        $scope.item.kodeExternalPertama = dataPertamaSelected.kodeexternal
                    else
                        $scope.item.kodeExternalPertama = ""
                    if (dataPertamaSelected.namaexternal != null)
                        $scope.item.namaExternalPertama = dataPertamaSelected.namaexternal
                    else
                        $scope.item.namaExternalPertama = ""

                    $scope.item.namaKelompokPertama = dataPertamaSelected.childpertama
                }
            }

            $scope.klikKedua = function (dataKeduaSelected) {
                if (dataKeduaSelected != undefined) {
                    $scope.idKedua = dataKeduaSelected.id
                    $scope.item.kodeKelompokKedua = dataKeduaSelected.kdchildkedua
                    $scope.item.namaKelompokKedua = dataKeduaSelected.childkedua
                    if (dataKeduaSelected.idparent != null)
                        $scope.item.kelompokPertama = {id:dataKeduaSelected.idparent, nama:dataKeduaSelected.nama}
                    else
                        $scope.item.kelompokPertama = ""
                    if (dataKeduaSelected.kodeexternal != null)
                        $scope.item.kodeExternalKedua = dataKeduaSelected.kodeexternal
                    else
                        $scope.item.kodeExternalKedua = ""
                    if (dataKeduaSelected.namaexternal != null)
                        $scope.item.namaExternalKedua = dataKeduaSelected.namaexternal
                    else
                        $scope.item.namaExternalKedua = ""
                }
            }
            $scope.klikKetiga = function (dataKetigaSelected) {
                if (dataKetigaSelected != undefined) {
                    $scope.idKetiga = dataKetigaSelected.id
                    $scope.item.kodeKelompokKetiga = dataKetigaSelected.kdchildketiga
                    $scope.item.namaKelompokKetiga = dataKetigaSelected.childketiga
                    if (dataKetigaSelected.idparent != null)
                        $scope.item.kelompokKedua = {id:dataKetigaSelected.idparent, nama:dataKetigaSelected.nama}
                    else
                        $scope.item.kelompokKedua = ""
                    if (dataKetigaSelected.kodeexternal != null)
                        $scope.item.kodeExternalKetiga = dataKetigaSelected.kodeexternal
                    else
                        $scope.item.kodeExternalKetiga = ""
                    if (dataKetigaSelected.namaexternal != null)
                        $scope.item.namaExternalKetiga = dataKetigaSelected.namaexternal
                    else
                        $scope.item.namaExternalKetiga = ""
                }
            }

            $scope.klikKeempat = function (dataKeempatSelected) {
                if (dataKeempatSelected != undefined) {
                    $scope.idKeempat = dataKeempatSelected.id
                    $scope.item.kodeKelompokKeempat = dataKeempatSelected.kdchildkeempat
                    $scope.item.namaKelompokKeempat = dataKeempatSelected.childkeempat
                    if (dataKeempatSelected.idparent != null)
                        $scope.item.kelompokKetiga = {id:dataKeempatSelected.idparent, nama:dataKeempatSelected.nama}
                    else
                        $scope.item.kelompokKetiga = ""
                    if (dataKeempatSelected.kodeexternal != null)
                        $scope.item.kodeExternalKeempat = dataKeempatSelected.kodeexternal
                    else
                        $scope.item.kodeExternalKeempat = ""
                    if (dataKeempatSelected.namaexternal != null)
                        $scope.item.namaExternalKeempat = dataKeempatSelected.namaexternal
                    else
                        $scope.item.namaExternalKeempat = ""

                }
            }
             $scope.klikLima = function (dataLimaSelected) {
                if (dataLimaSelected != undefined) {
                    $scope.idLima = dataLimaSelected.id
                    $scope.item.kodeKelompokLima = dataLimaSelected.kdchildkelima
                    $scope.item.namaKelompokLima= dataLimaSelected.childkelima
                    if (dataLimaSelected.idparent != null)
                        $scope.item.kelompokKeempat = {id:dataLimaSelected.idparent, nama:dataLimaSelected.nama}
                    else
                        $scope.item.kelompokKeempat = ""
                    if (dataLimaSelected.kodeexternal != null)
                        $scope.item.kodeExternalLima = dataLimaSelected.kodeexternal
                    else
                        $scope.item.kodeExternalLima = ""
                    if (dataLimaSelected.namaexternal != null)
                        $scope.item.namaExternalLima = dataLimaSelected.namaexternal
                    else
                        $scope.item.namaExternalLima = ""

                }
            }

            $scope.klikEnam = function (dataEnamSelected) {
                if (dataEnamSelected != undefined) {
                    $scope.idEnam = dataEnamSelected.id
                    $scope.item.kodeKelompokEnam = dataEnamSelected.kdchildkeenam
                    $scope.item.namaKelompokEnam= dataEnamSelected.childkeenam
                    if (dataEnamSelected.idparent != null)
                        $scope.item.kelompokKelima = {id:dataEnamSelected.idparent, nama:dataEnamSelected.nama}
                    else
                        $scope.item.kelompokKelima = ""
                    if (dataEnamSelected.kodeexternal != null)
                        $scope.item.kodeExternalEnam = dataEnamSelected.kodeexternal
                    else
                        $scope.item.kodeExternalEnam = ""
                    if (dataEnamSelected.namaexternal != null)
                        $scope.item.namaExternalEnam = dataEnamSelected.namaexternal
                    else
                        $scope.item.namaExternalEnam = ""

                }
            }

            $scope.klikTujuh = function (dataTujuhSelected) {
                if (dataTujuhSelected != undefined) {
                    $scope.idTujuh = dataTujuhSelected.id
                    $scope.item.kodeKelompokTujuh = dataTujuhSelected.kdchildketujuh
                    $scope.item.namaKelompokTujuh= dataTujuhSelected.childketujuh
                    if (dataTujuhSelected.idparent != null)
                        $scope.item.kelompokKeenam = {id:dataTujuhSelected.idparent, nama:dataTujuhSelected.nama}
                    else
                        $scope.item.kelompokKeenam = ""
                    if (dataTujuhSelected.kodeexternal != null)
                        $scope.item.kodeExternalTujuh = dataTujuhSelected.kodeexternal
                    else
                        $scope.item.kodeExternalTujuh = ""
                    if (dataTujuhSelected.namaexternal != null)
                        $scope.item.namaExternalTujuh = dataTujuhSelected.namaexternal
                    else
                        $scope.item.namaExternalTujuh = ""

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
                    medifirstService.post('perencanaan/delete-kel-pertama-anggaran', itemDelete).then(function (e) {
                        loadDataGrid();
                        $scope.idPertama = ""
                        $scope.batal()
                    })
                }
            }
            $scope.hapusKelKedua = function () {
                if ($scope.idKedua == undefined) {
                    toastr.error('Pilih Data Dulu', 'Informasi');
                    return
                } else {
                    var itemDelete = {
                        "id": $scope.idKedua,
                    }
                    medifirstService.post('perencanaan/delete-kel-kedua-anggaran', itemDelete).then(function (e) {
                        loadDataGrid();
                        $scope.batal()
                        $scope.idKedua = ""
                    })
                }
            }
            $scope.hapusKelKetiga = function () {
                if ($scope.idKetiga == undefined) {
                    toastr.error('Pilih Data Dulu', 'Informasi');
                    return
                } else {
                    var itemDelete = {
                        "id": $scope.idKetiga,
                    }
                    medifirstService.post('perencanaan/delete-kel-ketiga-anggaran', itemDelete).then(function (e) {
                        loadDataGrid();
                        $scope.idKetiga = ""
                        $scope.batal()
                    })
                }
            }
            $scope.hapusKelKeempat = function () {
                if ($scope.idKeempat == undefined) {
                    toastr.error('Pilih Data Dulu', 'Informasi');
                    return
                } else {
                    var itemDelete = {
                        "id": $scope.idKeempat,
                    }
                    medifirstService.post('perencanaan/delete-kel-keempat-anggaran', itemDelete).then(function (e) {
                        loadDataGrid();
                        $scope.idKeempat = ""
                        $scope.batal()
                    })
                }
            }







            /////////////////////////////////////////////////////////////////////
        }
    ]);
});