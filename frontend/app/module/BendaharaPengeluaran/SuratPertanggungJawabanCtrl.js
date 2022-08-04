define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('SuratPertanggungJawabanCtrl', ['$scope', 'DateHelper', '$mdDialog','MedifirstService',
        function ($scope, dateHelper, $mdDialog,medifirstService) {
            $scope.dataVOloaded = true;
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.item.periodeTahun = $scope.now;
            $scope.item.periodeTahuns = $scope.now;
            $scope.dataAnggaranSelected = {};
            $scope.dataSelected = {};
            // $scope.item.saldoRms = 0;
            // $scope.item.saldoBlus = 0;

            medifirstService.get("sysadmin/general/get-combo-pegawai", true, true, 20).then(function (data) {
                $scope.listPegawai = data.data;
            });

            $scope.monthSelectorOptions = function () {
                return {
                    start: "decade",
                    depth: "decade"
                }
            }

            $scope.listRevisiKe = [
                {
                    "id": 1, "name": "I"
                }, {
                    "id": 2, "name": "II"
                }, {
                    "id": 3, "name": "III"
                }, {
                    "id": 4, "name": "IV"
                }, {
                    "id": 5, "name": "V"
                }
            ];

            // $scope.item.revisiKe = $scope.listRevisiKe[2];

            loadTreeview();

            $scope.findData = function () {
                loadTreeview();
                // $scope.popupDokter.center().open();
            }
            $scope.listIsOperasional = [{id:"0",namaoperasional:"I. BIAYA OPERASIONAL"},
                                         {id:"1",namaoperasional:"II. BIAYA NON OPERASIONAL"}]
            $scope.listJenisBiaya = [{id:"1",namajenisbiaya:"A. BIAYA PEGAWAI"},
                                    {id:"2",namajenisbiaya:"B. BIAYA UMUM DAN ADMINISTRASI"},
                                    {id:"3",namajenisbiaya:"C. BIAYA MODAL"}]

            medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                $scope.listHead = e.data.kelompokhead
                //$scope.listPertama = e.data.kelompokpertama
                // $scope.listKedua=e.data.kelompokkedua
                // $scope.listKetiga=e.data.kelompokketiga
                // $scope.listKeempat = 
                // $scope.listKelima =
                // $scope.listKeenam = 
                // $scope.listKetujuh =
                $scope.listPengendali = e.data.pengendali
                $scope.listPengendali1 = e.data.pengendali
                //$scope.listKeempat=e.data.kelompokkeempat
            });

            $scope.getParentPertama = function(){
                var idparent1 = 'idparent1='+$scope.item.kelompokHead.id
                medifirstService.get("perencanaan/get-data-combo-by-parent-pertama?"
                + idparent1, true).then(function (dat) {
                     $scope.listPertama = dat.data.kelompokpertama
                });
            }

            $scope.getParentKedua = function(){
                var idparent2 = 'idparent2='+$scope.item.kelompokPertama.id
                medifirstService.get("perencanaan/get-data-combo-by-parent-kedua?"
                + idparent2, true).then(function (dat) {
                     $scope.listKedua = dat.data.kelompokkedua
                });
            }

            $scope.getParentKetiga = function(){
                var idparent3 = 'idparent3='+$scope.item.kelompokKedua.id
                medifirstService.get("perencanaan/get-data-combo-by-parent-ketiga?"
                + idparent3, true).then(function (dat) {
                     $scope.listKetiga = dat.data.kelompokketiga
                });
            }

            $scope.getParentKeempat = function(){
                var idparent4 = 'idparent4='+$scope.item.kelompokKetiga.id
                medifirstService.get("perencanaan/get-data-combo-by-parent-keempat?"
                + idparent4, true).then(function (dat) {
                     $scope.listKeempat = dat.data.kelompokkeempat
                });
            }

            $scope.getParentKelima = function(){
                var idparent5 = 'idparent5='+$scope.item.kelompokKeempat.id
                medifirstService.get("perencanaan/get-data-combo-by-parent-kelima?"
                + idparent5, true).then(function (dat) {
                     $scope.listKelima = dat.data.kelompokkelima
                });
            }

            $scope.getParentKeenam = function(){
                var idparent6 = 'idparent6='+$scope.item.kelompokKelima.id
                medifirstService.get("perencanaan/get-data-combo-by-parent-keenam?"
                + idparent6, true).then(function (dat) {
                     $scope.listKeenam = dat.data.kelompokkeenam
                });
            }

            $scope.getCekTurunanKetujuh = function(){
                var jumlah
                var konfirmasi
                medifirstService.get("perencanaan/get-cek-turunan-ketujuh?idturunanke6="+$scope.item.kelompokKeenam.id
                , true).then(function (dat) {
                    jumlah = dat.data.data[0].jumlah
                    if (jumlah > 0) {//&& moment(x.data.tglregistrasi).format('YYYY-MM-DD') != moment($scope.now).format('YYYY-MM-DD')){

                        var confirm = $mdDialog.confirm()
                            .title('Peringatan')
                            .textContent('Peringatan, Kode Rekening ' + $scope.item.kelompokKeenam.nama + ' sudah pernah diinputkan. Apakah mau melanjutkan?')
                            .ariaLabel('Lucky day')
                            .cancel('Tidak')
                            .ok('Ya')
                        $mdDialog.show(confirm).then(function () {
                            $scope.getParentKetujuh();
                        })

                    } else {
                        $scope.getParentKetujuh()
                    }
                });
            }

            $scope.getParentKetujuh = function(){
                var idparent7 = 'idparent7='+$scope.item.kelompokKeenam.id
                medifirstService.get("perencanaan/get-data-combo-by-parent-ketujuh?"
                + idparent7, true).then(function (dat) {
                     $scope.listKetujuh = dat.data.kelompokketujuh
                });
            }

            $scope.getCekTurunanKedelapan = function(){
                var jumlah
                var konfirmasi
                medifirstService.get("perencanaan/get-cek-turunan-kedelapan?idturunanke7="+$scope.item.kelompokKetujuh.id
                , true).then(function (dat) {
                    jumlah = dat.data.data[0].jumlah
                    if (jumlah > 0) {//&& moment(x.data.tglregistrasi).format('YYYY-MM-DD') != moment($scope.now).format('YYYY-MM-DD')){

                        var confirm = $mdDialog.confirm()
                            .title('Peringatan')
                            .textContent('Peringatan, Kode Rekening ' + $scope.item.kelompokKetujuh.nama + ' sudah pernah diinputkan. Apakah mau melanjutkan?')
                            .ariaLabel('Lucky day')
                            .cancel('Tidak')
                            .ok('Ya')
                        $mdDialog.show(confirm).then(function () {
                            //$scope.getParentKedelapan();
                        })

                    } else {
                        //$scope.getParentKedelapan()
                    }
                });
            }

            $scope.getParentKedelapan = function(){
                var idparent7 = 'idparent7='+$scope.item.kelompokKeenam.id
                medifirstService.get("perencanaan/get-data-combo-by-parent-ketujuh?"
                + idparent7, true).then(function (dat) {
                     $scope.listKetujuh = dat.data.kelompokketujuh
                });
            }
            

            // medifirstService.get("perencanaan/get-data-combo").then(function (e) {
            //     $scope.listHead = e.data.kelompokhead
            //     $scope.listPertama = e.data.kelompokpertama
            //     // $scope.listKedua=e.data.kelompokkedua
            //     // $scope.listKetiga=e.data.kelompokketiga
            //     // $scope.listPengendali = e.data.pengendali
            //     // $scope.listPengendali1 = e.data.pengendali
            //     // $scope.listKeempat=e.data.kelompokkeempat
            // });
            medifirstService.get("sdm/get-data-combo-sdm?", true).then(function (dat) {
                    var dataCombo = dat.data
                    $scope.listPengendali = dataCombo.jabatan;
                    $scope.listPengendali1 = dataCombo.jabatan;
            });

            medifirstService.get("perencanaan/get-data-combo-satuan-anggaran?", true).then(function (dat) {
                    var dataCombo = dat.data
                    $scope.listSatuan = dataCombo
                    $scope.item.pengali = 1
            });


            

            

            function loadTreeview() {
                $scope.isRouteLoading = true;
            
                var tahunAnggaran = ""
                if ($scope.item.periodeTahun != undefined) {
                    tahunAnggaran = "tahun=" + moment($scope.item.periodeTahun).format('YYYY')
                }
                    medifirstService.get("bendaharapengeluaran/get-daftar-realisasi-anggaran?"
                        + tahunAnggaran, true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            for (var i = 0; i < dat.data.data.length; i++) {
                                dat.data.data[i].nomor = i + 1
                                var presentase = dat.data.data[i].presentase
                                dat.data.data[i].presentase = Number(presentase).toFixed(2)
                                dat.data.data[i]._ = dat.data.data[i].isbiayaoperasional
                                dat.data.data[i].__ = dat.data.data[i].jenisbiaya
                                dat.data.data[i].___ = dat.data.data[i].turunankelima
                                dat.data.data[i].____ = dat.data.data[i].turunankeenam
                                // blu = blu + parseFloat(dat.data.data[i].totalblu)
                                // rm = rm + parseFloat(dat.data.data[i].totalrm)
                                if (dat.data.data[i].kd == '4.'){
                                    pendapatan = pendapatan + parseFloat(dat.data.data[i].totalrm) + parseFloat(dat.data.data[i].totalblu)
                                }
                                if (dat.data.data[i].kd == '5.'){
                                    rm = rm + parseFloat(dat.data.data[i].totalrm) + parseFloat(dat.data.data[i].totalblu)
                                    blu = blu + parseFloat(dat.data.data[i].totalblu)
                                }
                                // if (dat.data.data[i].no == 2){
                                //     dat.data.data[i].kd = '\u2666\xa0\xa0' + dat.data.data[i].kd
                                // }
                                // if (dat.data.data[i].no == 3){
                                //     dat.data.data[i].kd = '\u2666\xa0\u2666\xa0\xa0' + dat.data.data[i].kd
                                // }
                                // if (dat.data.data[i].no == 4){
                                //     dat.data.data[i].kd = '\u2666\xa0\u2666\xa0\u2666\xa0\xa0' + dat.data.data[i].kd
                                // }
                                // if (dat.data.data[i].no == 5){
                                //     dat.data.data[i].kd = '\u2666\xa0\u2666\xa0\u2666\xa0\u2666\xa0\xa0' + dat.data.data[i].kd
                                // }
                                // if (dat.data.data[i].no == 6){
                                //     dat.data.data[i].kd = '\u2666\xa0\u2666\xa0\u2666\xa0\u2666\xa0\u2666\xa0\xa0' + dat.data.data[i].kd
                                // }
                                // if (dat.data.data[i].no == 7){
                                //     dat.data.data[i].kd = '\u2666\xa0\u2666\xa0\u2666\xa0\u2666\xa0\u2666\xa0\u2666\xa0\xa0' + dat.data.data[i].kd
                                // }
                            }                        
                            if (dat.data.data.length == 0) {
                                $scope.totalRM = 0
                                $scope.totalBLU = 0
                                $scope.totalPendapatan = 0
                                toastr.error('Data tidak ada', 'Informasi');
                            }
                            // $scope.totalRM = rm;
                            // $scope.totalBLU = blu;
                            // $scope.totalPendapatan = pendapatan;

                            $scope.dataSourceAnggaranBLUD = new kendo.data.DataSource({
                                data: dat.data.data,
                                // schema: $scope.schema,
                                // group: $scope.group,
                                // aggregate: $scope.aggregate,
                                pageable: false,
                                pagesize: 10,
                                schema:{
                                    model: {
                                        fields: {
                                            totalblu: {type: "number"},
                                            realisasi: {type: "number"},
                                            sisa: {type: "number"},
                                            presentase: {type: "number"}
                                        }
                                    }
                                },
                                group: [
                                {field: "_", dir: "asc"},
                                {field: "__", dir: "asc"},
                                {field: "___", dir: "asc"},
                                {
                                     field: "____", agrregates: [
                                        { field: "totalblu", agrregate: "sum" },
                                        { field: "realisasi", aggregate: "sum"},
                                        { field: "sisa", aggregate: "sum"},
                                        { field: "presentase", aggregate: "average"}
                                    ]
                                }],
                                aggregate: [
                                    { field: "totalblu", aggregate: "sum"},
                                    { field: "realisasi", aggregate: "sum"},
                                    { field: "sisa", aggregate: "sum"},
                                    { field: "presentase", aggregate: "average"}
                                ]

                            })

                        },function(err){
                            $scope.isRouteLoading = false;
                        });

            }

            $scope.columnAnggaranBLUD = {
                            dataSource: $scope.dataSourceAnggaranBLUD,
                            
                            pageable: false,
                            selectable: "row",
                            columns: [
                                {
                                    "field": "kd",
                                    "title": "Kode",
                                    "width": "80px",
                                    "template": "<span style='font-weight: bold;'>#: kd #</span>",
                                },
                                {
                                    "field": "desk",
                                    "title": "Mata Anggaran",
                                    "width": "250px"
                                },
                                {
                                    "field": "totalblu",
                                    "title": "Jumlah (Rp)",
                                    "width": "80px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: totalblu #', '')}}</span>",
                                    aggregates: ["sum"],
                                    footerTemplate: "<span class='style-right'>Total: {{formatRupiah('#= data.totalblu.sum #', '')}}</span>"
                                },
                                {
                                    "field": "realisasi",
                                    "title": "Realisasi (Rp)",
                                    "width": "80px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: realisasi #', '')}}</span>",
                                    aggregates: ["sum"],
                                    footerTemplate: "<span class='style-right'>Total: {{formatRupiah('#= data.realisasi.sum #', '')}}</span>"
                                },
                                {
                                    "field": "sisa",
                                    "title": "Sisa (Rp)",
                                    "width": "80px",
                                    "template": "<span class='style-right'>{{formatRupiah('#: sisa #', '')}}</span>",
                                    aggregates: ["sum"],
                                    footerTemplate: "<span class='style-right'>Total: {{formatRupiah('#= data.sisa.sum #', '')}}</span>"
                                },
                                {
                                    "field": "presentase",
                                    "title": "Presentase (%)",
                                    "width": "80px",
                                    "template": "<span class='style-center'>#: presentase #</span>",
                                    aggregates: ["average"],
                                    footerTemplate: "<span class='style-right'>Rata-rata: #= data.presentase.average.toFixed(2) #</span>    "
                                }
                            ]
                            
                        };
            //   $scope.group = {
            //     field: "kode",
            //     aggregates: [
            //     // {
            //     //     field: "pasien",
            //     //     aggregate: "count"
            //     // }, 
            //     {
            //         field: "kode",
            //         aggregate: "count"
            //     }]
            // };

            function onChange(e) {
                var currentItem = e.sender.dataItem(e.node),
                    modelItem = findModelItem($scope.treeData, currentItem.id);

                var dataSource = [{
                    "id0": currentItem.id0,
                    "id1": currentItem.id1,
                    "id2": currentItem.id2,
                    "id3": currentItem.id3,
                    "id4": currentItem.id4,
                    "kode": currentItem.kode,
                    "mataanggaran": currentItem.mataanggaran,
                    "totalrm": currentItem.totalrm,
                    "totalblu": currentItem.totalblu,

                }]
                $scope.dataSourceAnggaran = dataSource
                // updateChecked($scope.treeData, e.sender.dataSource.data());

            }
            function findModelItem(model, id) {
                for (var i = 0; i < model.length; i++) {
                    var currentItem = model[i];
                    if (currentItem.id === id) {
                        return currentItem;
                    }
                    if (currentItem.child) {
                        var found = findModelItem(currentItem.child, id);
                        if (found) {
                            return found;
                        }
                    }
                }
            }

            $scope.simpan = function () {
                var periodeTahuns = ""
                if ($scope.item.periodeTahuns != undefined)
                    periodeTahuns = moment($scope.item.periodeTahuns).format('YYYY')

                var revisiKes = null
                if ($scope.item.revisiKes != undefined)
                    revisiKes = $scope.item.revisiKes.name

                var kelompokHead = null
                if ($scope.item.kelompokHead != undefined)
                    kelompokHead = $scope.item.kelompokHead.id

                var kelompokPertama = null
                if ($scope.item.kelompokPertama != undefined)
                    kelompokPertama = $scope.item.kelompokPertama.id

                var kelompokKedua = null
                if ($scope.item.kelompokKedua != undefined)
                    kelompokKedua = $scope.item.kelompokKedua.id

                var kelompokKetiga = null
                if ($scope.item.kelompokKetiga != undefined)
                    kelompokKetiga = $scope.item.kelompokKetiga.id

                var kelompokKeempat = null
                if ($scope.item.kelompokKeempat != undefined)
                    kelompokKeempat = $scope.item.kelompokKeempat.id

                  var kelompokKelima = null
                if ($scope.item.kelompokKelima != undefined)
                    kelompokKelima = $scope.item.kelompokKelima.id

                      var kelompokKeenam = null
                if ($scope.item.kelompokKeenam  != undefined)
                    kelompokKeenam  = $scope.item.kelompokKeenam.id

                var kelompokKetujuh = null
                if ($scope.item.kelompokKetujuh  != undefined)
                    kelompokKetujuh  = $scope.item.kelompokKetujuh.id

                var saldoBLU = 0
                if ($scope.item.saldoBlus != undefined)
                    saldoBLU = $scope.item.saldoBlus

                var saldoRM = 0
                if ($scope.item.saldoRms != undefined)
                    saldoRM = $scope.item.saldoRms

                var pengendali = null
                if ($scope.item.Pengendali != undefined) {
                    pengendali = $scope.item.Pengendali.id
                }

                var isoperasional = null
                if ($scope.item.isoperasional != undefined) {
                    isoperasional = $scope.item.isoperasional.id
                }

                var jenisbiaya = null
                if ($scope.item.jenisbiaya != undefined) {
                    jenisbiaya = $scope.item.jenisbiaya.namajenisbiaya
                }

                var volume = null
                if ($scope.item.volume != undefined) {
                    volume = $scope.item.volume
                }

                var pengali = null
                if ($scope.item.pengali != undefined) {
                    pengali = $scope.item.pengali
                }

                var satuan = null
                if ($scope.item.satuan != undefined) {
                    satuan = $scope.item.satuan.reportdisplay
                }

                var hargasatuan = null
                if ($scope.item.hargasatuan != undefined) {
                    hargasatuan = $scope.item.hargasatuan.toString().replace(/\./g,"")
                }

                var jsonSave = {
                    "norec": "",
                    "objectheadfk": kelompokHead,
                    "objectchildpertamafk": kelompokPertama,
                    "objectchildkeduafk": kelompokKedua,
                    "objectchildketigafk": kelompokKetiga,
                    "objectchildkeempatfk": kelompokKeempat,
                    "objectchildkelimafk": kelompokKelima,
                    "objectchildkeenamfk": kelompokKeenam,
                    "objectchildketujuhfk": kelompokKetujuh,
                    "mataanggaran": $scope.item.mataAnggarans,
                    "revisidivake": revisiKes,
                    "objectasalprodukfk": null,
                    "saldoawalblu": saldoBLU,
                    "saldoawalrm": saldoRM,
                    "tahun": periodeTahuns,
                    "pengendali": pengendali,
                    "isoperasional": isoperasional,
                    "jenisbiaya": jenisbiaya,
                    "volume": volume,
                    "pengali": pengali,
                    "satuan": satuan,
                    "hargasatuan": hargasatuan
                }
                medifirstService.post('perencanaan/save-child',jsonSave).then(function (e) {
                    kosongkan();
                    loadTreeview();
                })

            }
            $scope.edit = function () {
                var periodeTahuns = ""
                if ($scope.item.periodeTahuns != undefined)
                    periodeTahuns = moment($scope.item.periodeTahuns).format('YYYY')

                var revisiKes = ""
                if ($scope.item.revisiKes != undefined)
                    revisiKes = $scope.item.revisiKes.name

                var kelompokHead = ""
                if ($scope.item.kelompokHead != undefined)
                    kelompokHead = $scope.item.kelompokHead.id

                var kelompokPertama = ""
                if ($scope.item.kelompokPertama != undefined)
                    kelompokPertama = $scope.item.kelompokPertama.id

                var kelompokKedua = ""
                if ($scope.item.kelompokKedua != undefined)
                    kelompokKedua = $scope.item.kelompokKedua.id

                var kelompokKetiga = ""
                if ($scope.item.kelompokKetiga != undefined)
                    kelompokKetiga = $scope.item.kelompokKetiga.id

                var kelompokKeempat = ""
                if ($scope.item.kelompokKeempat != undefined)
                    kelompokKeempat = $scope.item.kelompokKeempat.id

                var saldoBLU = 0
                if ($scope.item.saldoBlus != undefined)
                    saldoBLU = $scope.item.saldoBlus

                var saldoRM = 0
                if ($scope.item.saldoRms != undefined)
                    saldoRM = $scope.item.saldoRms

                var jsonSave = {
                    "norec": $scope.norecMA,
                    "objectheadfk": kelompokHead,
                    "objectchildpertamafk": kelompokPertama,
                    "objectchildkeduafk": kelompokKedua,
                    "objectchildketigafk": kelompokKetiga,
                    "objectchildkeempatfk": kelompokKeempat,
                    "mataanggaran": $scope.item.mataAnggarans,
                    "revisidivake": revisiKes,
                    "objectasalprodukfk": null,
                    "saldoawalblu": saldoBLU,
                    "saldoawalrm": saldoRM,
                    "tahun": periodeTahuns,

                }
                medifirstService.post('perencanaan/save-child',jsonSave).then(function (e) {
                    kosongkan();
                    loadTreeview();
                })

            }
            function kosongkan() {
                $scope.item.saldoBlu = ""
                $scope.item.saldoRm = ""
                // $scope.item.childMataAnggaran=""
                // $scope.item.kelompokHead=""
                // $scope.item.kelompokPertama=""
                // $scope.item.kelompokKedua=""
                // $scope.item.kelompokKetiga=""
                // $scope.item.kelompokKeempat=""
                $scope.item.saldoBlus = 0
                $scope.item.saldoRms = 0
                $scope.item.mataAnggarans = ""

            }


            $scope.klikGrid = function (dataAnggaranSelected) {
                if (dataAnggaranSelected != undefined) {
                    $scope.item.kodeAnggaran = dataAnggaranSelected.kode
                    // $scope.item.namaMataAnggaran=dataAnggaranSelected.desc
                    // $scope.popUpTreeView.center().open();
                }
            }
            var tahunPriode = dateHelper.formatDate($scope.item.periodeTahun, 'YYYY');

            $scope.columnAnggaran = {
                dataSource: $scope.dataSourceAnggaran,
                pageable: false,
                selectable: "row",
                columns: [
                    {
                        "field": "nomor",
                        "title": "No. ",
                        "template": "<span class='style-center'>#: nomor #</span>",
                        "width": "15px"
                    },
                    {
                        "field": "kd",
                        "title": "Kode",
                        "width": "80px",
                        "template": "<span style='font-weight: bold;'>#: kd #</span>",
                    },
                    {
                        "field": "desk",
                        "title": "Mata Anggaran",
                        "width": "200px"
                    },
                    {
                        "field": "totalrm",
                        "title": "Saldo Awal APBD",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalrm #', 'Rp.')}}</span>"
                    },
                    {
                        "field": "totalblu",
                        "title": "Saldo Awal BLUD",
                        "width": "80px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalblu #', 'Rp.')}}</span>"
                    },
                    //  { 
                    //     "command": ["edit"],
                    //     title: " ",
                    //     width: "80px" 
                    // }

                ]//,
                // toolbar: [
                //     {
                //         "name": "edit",
                //         "text": "Edit Data",
                //         "template": '<a ng-click="editGrid()" class="k-button k-button-icontext k-grid-upload">Edit Data</a>'
                //     },
                //     {
                //         "name": "add",
                //         "text": "Hapus Data",
                //         "template": '<a ng-click="hapusGrid()" class="k-button k-button-icontext k-grid-upload">Hapus Data</a>'
                //     }
                // ]
            }

            $scope.columnDetailAnggaranAPBD = {
                dataSource: $scope.dataSourceAnggaran,
                pageable: false,
                selectable: "row",
                columns: [
                    {
                        "field": "nomor",
                        "title": "No. ",
                        "template": "<span class='style-center'>#: nomor #</span>",
                        "width": "30px"
                    },
                    {
                        "field": "kd",
                        "title": "Kode",
                        "width": "80px",
                        "template": "<span style='font-weight: bold;'>#: kd #</span>",
                    },
                    {
                        "field": "desk",
                        "title": "Mata Anggaran",
                        "width": "180px"
                    },
                    {
                        "field": "totalrm",
                        "title": "Saldo Awal APBD",
                        "width": "90px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalrm #', 'Rp.')}}</span>"
                    },
                    {
                        "field": "totalblu",
                        "title": "Saldo Awal BLUD",
                        "width": "90px",
                        "template": "<span class='style-right'>{{formatRupiah('#: totalblu #', 'Rp.')}}</span>"
                    },
                    {
                       //"field": "totalblu",
                        "title": "Revisi ke",
                        "width": "80px",
                        //"template": "<span class='style-right'>{{formatRupiah('#: totalblu #', 'Rp.')}}</span>"
                    },
                    {
                       //"field": "totalblu",
                        "title": "Pengedit",
                        "width": "80px",
                        //"template": "<span class='style-right'>{{formatRupiah('#: totalblu #', 'Rp.')}}</span>"
                    },
                    {
                       //"field": "totalblu",
                        "title": "Tanggal edit",
                        "width": "80px",
                        //"template": "<span class='style-right'>{{formatRupiah('#: totalblu #', 'Rp.')}}</span>"
                    },
                    {
                       //"field": "totalblu",
                        "title": "Keterangan",
                        "width": "80px",
                        //"template": "<span class='style-right'>{{formatRupiah('#: totalblu #', 'Rp.')}}</span>"
                    },
                    //  { 
                    //     "command": ["edit"],
                    //     title: " ",
                    //     width: "80px" 
                    // }

                ],
                toolbar: [
                    {
                        "name": "edit",
                        "text": "Edit Data",
                        "template": '<a ng-click="editAnggaranAPBD()" class="k-button k-button-icontext k-grid-upload">Edit Data</a>'
                    },
                    {
                        "name": "add",
                        "text": "Hapus Data",
                        "template": '<a ng-click="hapusAnggaranAPBD()" class="k-button k-button-icontext k-grid-upload">Hapus Data</a>'
                    }
                ]
            }

            $scope.hapusAnggaranAPBD = function () {
                //var arrNorec = $scope.dataAnggaranSelected.kode.split('~');
                var arrNorec = $scope.dataDetailAnggaranSelected.norec;
                $scope.popUpDetailAPBD.close()
                if (arrNorec[1] == undefined) {
                    toastr.error('Hanya child terbawah yang bisa di Hapus', 'Informasi');
                    return
                } else {
                    var confirm = $mdDialog.confirm()
                        .title('Peringatan')
                        .textContent('Yakin mau menghapus data?')
                        .ariaLabel('Lucky day')
                        .cancel('Tidak')
                        .ok('Ya')
                    $mdDialog.show(confirm).then(function () {
                       var itemDelete = {
                            "norec": arrNorec,
                        }
                        medifirstService.post('perencanaan/delete-child',itemDelete).then(function (e) {
                            if (e.status === 201) {
                                loadTreeview();
                            }
                        }) 
                    })
                }
            }

            $scope.editAnggaranAPBD = function () {
                if ($scope.dataDetailAnggaranSelected.no == undefined) {
                    toastr.error("Pilih data apbd terlebih dahulu!")
                    return
                }
                $scope.popUpEditDetailAPBD.center().open();
                $scope.item.editvolume = parseInt($scope.dataDetailAnggaranSelected.volume)
                $scope.item.editpengali = parseInt($scope.dataDetailAnggaranSelected.pengali)
                $scope.item.editsatuan = {reportdisplay: $scope.dataDetailAnggaranSelected.satuan}
                $scope.item.edithargasatuan = $scope.dataDetailAnggaranSelected.hargasatuan
                $scope.item.editsaldoRms = parseInt($scope.dataDetailAnggaranSelected.totalrm)
                $scope.item.editsaldoblu = parseInt($scope.dataDetailAnggaranSelected.totalblu)
                medifirstService.get("tatarekening/get-data-login", true, true, 20).then(function (data) {
                    medifirstService.get("emr/get-pegawai-parts?id=" + data.data.datalogin.userData.namauser, true, true, 20).then(function (data) {
                        $scope.item.editpegawai = data.data[0];
                    });
                });
            }

            $scope.simpanAnggaranPerubahanAPBD = function () {
                var itemSave = {
                    "norec": $scope.dataDetailAnggaranSelected.norec,
                    "kode": $scope.dataDetailAnggaranSelected.kdori,
                    "tahun": $scope.dataDetailAnggaranSelected.tahun,
                    "pengedit": $scope.item.editpegawai.id,
                    "tgledit": $scope.now,
                    "keterangan": $scope.item.editketerangan,
                    "volumeawal": $scope.dataDetailAnggaranSelected.volume,
                    "volumeakhir": $scope.item.editvolume,
                    "pengaliawal": $scope.dataDetailAnggaranSelected.pengali,
                    "pengaliakhir": $scope.item.editpengali,
                    "satuanawal": $scope.dataDetailAnggaranSelected.satuan,
                    "satuanakhir": $scope.item.editsatuan.reportdisplay,
                    "hargasatuanawal": $scope.dataDetailAnggaranSelected.hargasatuan,
                    "hargasatuanakhir": $scope.item.edithargasatuan,
                    "saldormawal": $scope.dataDetailAnggaranSelected.totalrm,
                    "saldormakhir": $scope.item.editsaldoRms,
                    "saldobluawal": $scope.dataDetailAnggaranSelected.totalblu,
                    "saldobluakhir": $scope.item.editsaldoblu
                }
                medifirstService.post('perencanaan/save-edit-detail-mataanggaran',itemSave).then(function (e) {
                    if (e.data.status === 201) {
                        loadTreeview();
                        $scope.popUpEditDetailAPBD.close()
                        $scope.popUpDetailAPBD.close()
                    }
                })
            }

            $scope.hapusGrid = function () {
                //var arrNorec = $scope.dataAnggaranSelected.kode.split('~');
                var arrNorec = $scope.dataAnggaranSelected.kd;
                if (arrNorec[1] == undefined) {
                    toastr.error('Hanya child terbawah yang bisa di Hapus', 'Informasi');
                    return
                } else {
                    var itemDelete = {
                        "norec": arrNorec[1],
                    }
                    medifirstService.post('perencanaan/delete-child',itemDelete).then(function (e) {
                        if (e.status === 201) {
                            loadTreeview();
                        }
                    })
                }
            }
            $scope.editGrid = function () {
                //var arrNorec = $scope.dataAnggaranSelected.kode.split('~');
                //var arrNorec = $scope.dataAnggaranSelected.no;
                medifirstService.get("perencanaan/get-data-combo").then(function (e) {
                    $scope.listHead = e.data.kelompokhead
                    $scope.listPertama = e.data.kelompokpertama
                    $scope.listKedua= e.data.kelompokkedua
                    $scope.listKetiga= e.data.kelompokketiga
                    $scope.listKeempat = e.data.kelompokkeempat
                    $scope.listKelima = e.data.kelompokkelima
                    $scope.listKeenam = e.data.kelompokkeenam
                    $scope.listKetujuh = e.data.kelompokketujuh
                    $scope.listPengendali = e.data.pengendali
                    $scope.listPengendali1 = e.data.pengendali
                    //$scope.listKeempat=e.data.kelompokkeempat
                });

                // if ($scope.dataAnggaranSelected.no < $scope.maxchild) {
                //     toastr.error('Hanya child terbawah yang bisa di edit', 'Informasi');
                //     return
                // } else {
                    //$scope.norecMA = arrNorec[1];
                    medifirstService.get("perencanaan/get-child-byNoName?no=" +
                        $scope.dataAnggaranSelected.no + "&desk="+ $scope.dataAnggaranSelected.desk
                    )
                        .then(function (dat) {
                            // $scope.getParentPertama = function(){
                            //     var idparent1 = 'idparent1='+$scope.item.kelompokHead.id
                            //     medifirstService.get("perencanaan/get-data-combo-by-parent-pertama?"
                            //     + idparent1, true).then(function (dat) {
                            //          $scope.listPertama = dat.data.kelompokpertama
                            //     });
                            // }

                            // $scope.getParentKedua = function(){
                            //     var idparent2 = 'idparent2='+$scope.item.kelompokPertama.id
                            //     medifirstService.get("perencanaan/get-data-combo-by-parent-kedua?"
                            //     + idparent2, true).then(function (dat) {
                            //          $scope.listKedua = dat.data.kelompokkedua
                            //     });
                            // }

                            // $scope.getParentKetiga = function(){
                            //     var idparent3 = 'idparent3='+$scope.item.kelompokKedua.id
                            //     medifirstService.get("perencanaan/get-data-combo-by-parent-ketiga?"
                            //     + idparent3, true).then(function (dat) {
                            //          $scope.listKetiga = dat.data.kelompokketiga
                            //     });
                            // }

                            // $scope.getParentKeempat = function(){
                            //     var idparent4 = 'idparent4='+$scope.item.kelompokKetiga.id
                            //     medifirstService.get("perencanaan/get-data-combo-by-parent-keempat?"
                            //     + idparent4, true).then(function (dat) {
                            //          $scope.listKeempat = dat.data.kelompokkeempat
                            //     });
                            // }

                            // $scope.getParentKelima = function(){
                            //     var idparent5 = 'idparent5='+$scope.item.kelompokKeempat.id
                            //     medifirstService.get("perencanaan/get-data-combo-by-parent-kelima?"
                            //     + idparent5, true).then(function (dat) {
                            //          $scope.listKelima = dat.data.kelompokkelima
                            //     });
                            // }

                            // $scope.getParentKeenam = function(){
                            //     var idparent6 = 'idparent6='+$scope.item.kelompokKelima.id
                            //     medifirstService.get("perencanaan/get-data-combo-by-parent-keenam?"
                            //     + idparent6, true).then(function (dat) {
                            //          $scope.listKeenam = dat.data.kelompokkeenam
                            //     });
                            // }

                            // $scope.getParentKetujuh = function(){
                            //     var idparent7 = 'idparent7='+$scope.item.kelompokKetujuh.id
                            //     medifirstService.get("perencanaan/get-data-combo-by-parent-ketujuh?"
                            //     + idparent7, true).then(function (dat) {
                            //          $scope.listKetujuh = dat.data.kelompokketujuh
                            //     });
                            // }
                            var listhead=$scope.listHead
                            var listpertama=$scope.listPertama

                            $scope.item.kelompokHead = { id: dat.data.data[0].id0, kelompokhead: dat.data.data[0].kelompokhead };
                            $scope.item.kelompokPertama = { id: dat.data.data[0].id1, childpertama: dat.data.data[0].childpertama };
                            $scope.item.kelompokKedua = { id: dat.data.data[0].id2, childkedua: dat.data.data[0].childkedua };
                            $scope.item.kelompokKetiga = { id: dat.data.data[0].id3, childketiga: dat.data.data[0].childketiga };
                            $scope.item.kelompokKeempat = { id: dat.data.data[0].id4, childkeempat: dat.data.data[0].childkeempat };
                            $scope.item.kelompokKelima = { id: dat.data.data[0].id5, childkelima: dat.data.data[0].childkelima };
                            $scope.item.kelompokKeenam = { id: dat.data.data[0].id6, childkeenam: dat.data.data[0].childkeenam };
                            $scope.item.kelompokKetujuh = { id: dat.data.data[0].id7, childketujuh: dat.data.data[0].childketujuh };
                            // $scope.item.revisiKes={id:dat.data.data[0].id3,name:dat.data.data[0].revisidivake}

                            
                            // medifirstService.get("perencanaan/get-kel-keempat-part?childkeempat="
                            //     + dat.data.data[0].childkeempat, true, true, 10)
                            //     .then(function (data) {
                            //         $scope.listKeempat.add(data[0])
                            //         $scope.item.kelompokKeempat = data[0];

                            //     })
                        })

                    // $scope.item.kelompokKeempat={id:dataItem.id4,childkeempat:dataItem.childkeempat};  
                    $scope.item.mataAnggarans = $scope.dataAnggaranSelected.desc;
                    if ($scope.dataAnggaranSelected.totalblu == null) {
                        $scope.dataAnggaranSelected.totalblu = 0;
                    }
                    if ($scope.dataAnggaranSelected.totalrm == null) {
                        $scope.dataAnggaranSelected.totalrm = 0;
                    }
                    $scope.item.saldoBlus = parseFloat($scope.dataAnggaranSelected.totalblu);
                    $scope.item.saldoRms = parseFloat($scope.dataAnggaranSelected.totalrm);

                    $scope.popUpWin.center().open();
                //}
            }

            // $("#gridAnggaranBLUD").kendoGrid({
            //     dataSource: {
            //         dataSource: $scope.dataSourceAnggaranBLUD,
            //         // pageable: false,
            //         // selectable: "row",
            //         type: "odata",
            //         transport: {
            //             read: "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Products"
            //         },
            //         schema:{
            //             model: {
            //                 fields: {
            //                     totalblu: {type:'number'}
            //                 }
            //             }
            //         },
            //         pageSize: 10,
            //         group: [{field: "isbiayaoperasional", dir: "asc"},
            //                 {field: "jenisbiaya", dir: "asc"},
            //                 {field: "turunankelima", dir: "asc"},
            //                 {field: "turunankeenam", dir: "asc", 
            //                     aggregates: [
            //                         {field:'totalblu', aggregate: 'sum'}
            //                     ] 

            //                 }], 

            //             // {
            //             //      field: "UnitsInStock", aggregates: [
            //             //         { field: "ProductName", aggregate: "count" },
            //             //         { field: "UnitPrice", aggregate: "sum"},
            //             //         { field: "UnitsOnOrder", aggregate: "average" },
            //             //         { field: "UnitsInStock", aggregate: "count" }
            //             //      ]
            //             //    },

            //         aggregate: [ {field:'totalblu', aggregate: 'sum'}
            //                       //   { field: "ProductName", aggregate: "count" },
            //                       // { field: "UnitPrice", aggregate: "sum" },
            //                       // { field: "UnitsOnOrder", aggregate: "average" },
            //                       // { field: "UnitsInStock", aggregate: "min" },
            //                       // { field: "UnitsInStock", aggregate: "max" }
            //                       ]
            //     },
            //     sortable: true,
            //     scrollable: false,
            //     pageable: true,
            //     columns: [
            //         {
            //             "field": "isbiayaoperasional",
            //             "title": "isbiayaoperasional",
            //             "width": "200px"
            //         },
            //         {
            //             "field": "jenisbiaya",
            //             "title": "jenisbiaya",
            //             "width": "200px"
            //         },
            //         {
            //             "field": "nomor",
            //             "title": "No. ",
            //             "template": "<span class='style-center'>#: nomor #</span>",
            //             "width": "15px"
            //         },
            //         {
            //             "field": "kd",
            //             "title": "Kode",
            //             "width": "80px",
            //             "template": "<span style='font-weight: bold;'>#: kd #</span>",
            //         },
            //         {
            //             "field": "desk",
            //             "title": "Mata Anggaran",
            //             "width": "200px"
            //         },
            //         {
            //             "field": "volume",
            //             "title": "Volume",
            //             "width": "60px"
            //         },
            //         {
            //             "field": "pengali",
            //             "title": "Pengali",
            //             "width": "40px"
            //         },
            //         {
            //             "field": "satuan",
            //             "title": "Satuan",
            //             "width": "100px"
            //         },
            //         {
            //             "field": "hargasatuan",
            //             "title": "Harga Satuan",
            //             "width": "80px"
            //         },
            //         {
            //             "field": "totalblu",
            //             "title": "Jumlah",
            //             "width": "80px",
            //             "template": "<span class='style-right'>{{formatRupiah('#: totalblu #', 'Rp.')}}</span>",
            //             "aggregates": ["sum"],
            //             "groupHeaderColumnTemplate": "Sum: #=sum#"
            //         },
            //         {
            //             "field": "reportdisplay",
            //             "title": "Pengendali",
            //             "width": "80px"
            //         },
            //         //  { 
            //         //     "command": ["edit"],
            //         //     title: " ",
            //         //     width: "80px" 
            //         // }

            //     ],
            //     toolbar: [
            //         {
            //             "name": "edit",
            //             "text": "Edit Data",
            //             "template": '<a ng-click="editGrid()" class="k-button k-button-icontext k-grid-upload">Edit Data</a>'
            //         },
            //         {
            //             "name": "add",
            //             "text": "Hapus Data",
            //             "template": '<a ng-click="hapusGrid()" class="k-button k-button-icontext k-grid-upload">Hapus Data</a>'
            //         }
            //     ]
            // });

            $scope.schema = [
                {
                    model: {
                        fields: {
                            totalblu: {type:"number"}
                        }
                    }

                }
            ];
             $scope.group = [
                //{
                        // field: "isbiayaoperasional", aggregates: [
                        //     { field: "jenisbiaya", agrregates: [
                        //         { field: "turunankelima", agrregates: [
                                    { field: "turunankeenam", agrregates: [
                                        { field: "totalblu", agrregate: "sum" }
                                    ]}
                        //         ]}
                        //         ]
                        //     }
                        // ]
                    //}
             ];
            $scope.aggregate = [
                {field:"totalblu", aggregate: "sum"}
                // {
                //     field: "pasien",
                //     aggregate: "count"
                // }, 
                // {
                //     field: "isbiayaoperasional",
                //     aggregate: "count"
                // }
                ]
            

            $scope.formatRupiah = function (value, currency) {
                if (value == "null")
                    value = 0
                //return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                return currency + " " + value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };

            // if ($scope.item.jenisbiaya == undefined){
            //     $scope.$watch("item.hargasatuan", function(xnewVal3, xoldVal3) {
            //     var newVal3 = xnewVal3.toString().replace(/\./g,"")
            //     var oldVal3 = xoldVal3.toString().replace(/\./g,"")
            //     if (newVal3 != oldVal3) {
            //         $scope.item.saldoRms = $scope.item.volume * $scope.item.pengali * newVal3;
            //         $scope.item.saldoBlus = 0;
            //       }
            //     });
            // }

            $scope.$watch("item.jenisbiaya", function(newVal, oldVal) {
                if (newVal != oldVal){
                    if (newVal != undefined ) {
                        $scope.$watch("item.hargasatuan", function(xnewVal2, xoldVal2) {
                        var newVal2 = xnewVal2.toString().replace(/\./g,"")
                        var oldVal2 = xoldVal2.toString().replace(/\./g,"")
                        if (newVal2 != oldVal2) {
                            $scope.item.saldoRms = 0;
                            $scope.item.saldoBlus = $scope.item.volume * $scope.item.pengali * newVal2;
                          }
                        });
                    }else{
                         $scope.$watch("item.hargasatuan", function(xnewVal3, xoldVal3) {
                        var newVal3 = xnewVal3.toString().replace(/\./g,"")
                        var oldVal3 = xoldVal3.toString().replace(/\./g,"")
                        if (newVal3 != oldVal3) {
                            $scope.item.saldoRms = $scope.item.volume * $scope.item.pengali * newVal3;
                            $scope.item.saldoBlus = 0;
                          }
                        });      
                    }
                }
                
            });

            function loadDetailAnggaran() {
                $scope.isRouteLoading = true;
                var tahunAnggaran = ""
                if ($scope.item.periodeTahun != undefined) {
                    tahunAnggaran = "tahun=" + moment($scope.item.periodeTahun).format('YYYY')
                }
                var revisiKe = ""
                if ($scope.item.revisiKe != undefined) {
                    revisiKe = "&revisike=" + $scope.item.revisiKe.name
                }
                var turunanPertama = ""
                if ($scope.item.turunanPertama != undefined) {
                    turunanPertama = "&childPertama=" + $scope.item.turunanPertama.id
                }

                var turunanKedua = ""
                if ($scope.item.turunanKedua != undefined) {
                    turunanKedua = "&childKedua=" + $scope.item.turunanKedua.id
                }

                var turunanKetiga = ""
                if ($scope.item.turunanKetiga != undefined) {
                    turunanKetiga = "&childKetiga=" + $scope.item.turunanKetiga.id
                }

                var turunanKeempat = ""
                if ($scope.item.turunanKeempat != undefined) {
                    turunanKeempat = "&childKeempat=" + $scope.item.turunanKeempat.id
                }

                var childTerakhir = ""
                if ($scope.item.childTerakhir != undefined) {
                    childTerakhir = "&childMataAnggaran=" + $scope.item.childTerakhir
                }

                var Pengendali = ""
                if ($scope.item.Pengendali1 != undefined) {
                    Pengendali = "&Pengendali=" + $scope.item.Pengendali1.id
                }
                var turunan = '&turunan=' + $scope.dataAnggaranSelected.no
                var kd = '&kd=' + $scope.dataAnggaranSelected.kdori

                var blu = 0;
                var rm = 0;
                var pendapatan = 0;
                $scope.treeSourceAnggaran = [];
                medifirstService.get("perencanaan/get-detail-daftar-mataanggaran-new?"
                    + tahunAnggaran
                    + turunan
                    + kd, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        $scope.maxchild = 0;
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].nomor = i + 1
                            dat.data.data[i].kdori = dat.data.data[i].kd
                            // blu = blu + parseFloat(dat.data.data[i].totalblu)
                            // rm = rm + parseFloat(dat.data.data[i].totalrm)
                            if (dat.data.data[i].kd == '4.'){
                                pendapatan = pendapatan + parseFloat(dat.data.data[i].totalrm) + parseFloat(dat.data.data[i].totalblu)
                            }
                            if (dat.data.data[i].kd == '5.'){
                                rm = rm + parseFloat(dat.data.data[i].totalrm) + parseFloat(dat.data.data[i].totalblu)
                                blu = blu + parseFloat(dat.data.data[i].totalblu)
                            }
                            if (dat.data.data[i].no == 2){
                                dat.data.data[i].kd = '\u2666\xa0\xa0' + dat.data.data[i].kd
                            }
                            if (dat.data.data[i].no == 3){
                                dat.data.data[i].kd = '\u2666\xa0\u2666\xa0\xa0' + dat.data.data[i].kd
                            }
                            if (dat.data.data[i].no == 4){
                                dat.data.data[i].kd = '\u2666\xa0\u2666\xa0\u2666\xa0\xa0' + dat.data.data[i].kd
                            }
                            if (dat.data.data[i].no == 5){
                                dat.data.data[i].kd = '\u2666\xa0\u2666\xa0\u2666\xa0\u2666\xa0\xa0' + dat.data.data[i].kd
                            }
                            if (dat.data.data[i].no == 6){
                                dat.data.data[i].kd = '\u2666\xa0\u2666\xa0\u2666\xa0\u2666\xa0\u2666\xa0\xa0' + dat.data.data[i].kd
                            }
                            if (dat.data.data[i].no == 7){
                                dat.data.data[i].kd = '\u2666\xa0\u2666\xa0\u2666\xa0\u2666\xa0\u2666\xa0\u2666\xa0\xa0' + dat.data.data[i].kd
                            }
                            if (dat.data.data[i].no > $scope.maxchild){
                                $scope.maxchild = dat.data.data[i].no
                            } 
                        }                        
                        if (dat.data.data.length == 0) {
                            $scope.totalRM = 0
                            $scope.totalBLU = 0
                            $scope.totalPendapatan = 0
                            toastr.error('Data tidak ada', 'Informasi');
                        }
                        $scope.totalRM = rm;
                        $scope.totalBLU = blu;
                        $scope.totalPendapatan = pendapatan;

                        $scope.dataSourceDetailAnggaran = new kendo.data.DataSource({
                            data: dat.data.data,
                            // group: $scope.group,
                            pageable: false,
                            pagesize: 10,

                        })

                        $scope.treeSourceAnggaran.push(dat.data.data);



                    },function(err){
                        $scope.isRouteLoading = false;
                    });
            }

            $scope.detailAnggaranAPBD = function() {
                if ($scope.dataAnggaranSelected.no == undefined) {
                    toastr.error("Pilih data apbd terlebih dahulu!")
                    return
                }
                loadDetailAnggaran();
                $scope.popUpDetailAPBD.center().open();
            }

            function loadRiwayatAnggaran() {
                $scope.isRouteLoading = true;
                medifirstService.get("perencanaan/get-riwayat-detail-mataanggaran?kode=" +
                        $scope.dataAnggaranSelected.kdori + "&tahun="+ $scope.dataAnggaranSelected.tahun
                    ).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.data.length; i++) {
                            dat.data.data[i].revisike = dat.data.data.length - i
                            dat.data.data[i].kdori = dat.data.data[i].kd
                            dat.data.data[i].tgledit = dat.data.data[i].tgledit.substring(0, 16)
                        }                        

                        $scope.dataSourceRiwayatAnggaran = new kendo.data.DataSource({
                            data: dat.data.data,
                            pageable: false,
                            pagesize: 10,

                        })
                    })
            }

            $scope.columnRiwayatAnggaranAPBD = {
                dataSource: $scope.dataSourceRiwayatAnggaran,
                pageable: false,
                selectable: "row",
                columns: [
                    {
                        "field": "revisike",
                        "title": "Revisi ke",
                        "template": "<span class='style-center'>#: revisike #</span>",
                        "width": "50px"
                    },
                    {
                        "field": "kode",
                        "title": "Kode",
                        "width": "80px",
                        "template": "<span style='font-weight: bold;'>#: kode #</span>",
                    },
                    // {
                    //     "field": "desk",
                    //     "title": "Mata Anggaran",
                    //     "width": "180px"
                    // },
                    {
                        "field": "saldormawal",
                        "title": "Saldo Awal APBD",
                        "width": "90px",
                        "template": "<span class='style-right'>{{formatRupiah('#: saldormawal #', 'Rp.')}}</span>"
                    },
                    {
                        "field": "saldormakhir",
                        "title": "Saldo Akhir APBD",
                        "width": "90px",
                        "template": "<span class='style-right'>{{formatRupiah('#: saldormakhir #', 'Rp.')}}</span>"
                    },
                    {
                        "field": "saldobluawal",
                        "title": "Saldo Awal BLUD",
                        "width": "90px",
                        "template": "<span class='style-right'>{{formatRupiah('#: saldobluawal #', 'Rp.')}}</span>"
                    },
                    {
                        "field": "saldobluakhir",
                        "title": "Saldo Akhir BLUD",
                        "width": "90px",
                        "template": "<span class='style-right'>{{formatRupiah('#: saldobluakhir #', 'Rp.')}}</span>"
                    },
                    {
                       "field": "namalengkap",
                        "title": "Pengedit",
                        "width": "80px",
                    },
                    {
                       "field": "tgledit",
                        "title": "Tanggal edit",
                        "width": "80px",
                    },
                    {
                       "field": "keterangan",
                        "title": "Keterangan",
                        "width": "80px",
                    }
                ]
            }

            $scope.riwayatAnggaranAPBD = function() {
                if ($scope.dataAnggaranSelected.no == undefined) {
                    toastr.error("Pilih data apbd terlebih dahulu!")
                    return
                }

                loadRiwayatAnggaran()
                $scope.popUpRiwayat.center().open();
            }

            function formatNumberField() {
                // unformat the value
                var value = this.value.replace(/[^\d,]/g, '');

                // split value into (leading digits, 3*x digits, decimal part)
                // also allows numbers like ',5'; if you don't want that,
                // use /^(\d{1,3})((?:\d{3})*))((?:,\d*)?)$/ instead
                var matches = /^(?:(\d{1,3})?((?:\d{3})*))((?:,\d*)?)$/.exec(value);

                if (!matches) {
                    // invalid format; deal with it however you want to
                    // this just stops trying to reformat the value
                    return;
                }

                // add a space before every group of three digits
                var spaceified = matches[2].replace(/(\d{3})/g, '.$1');

                // now splice it all back together
                this.value = [matches[1], spaceified, matches[3]].join('');
            }

            $scope.$watch("item.hargasatuan", function(newVal, oldVal) {
                if (newVal != oldVal){
                    $('#hargasatuan').on('keyup', formatNumberField);
            }    
            });

            


            
            // function addChildren(e){
            //     e.preventDefault();
            //       var grid = this;
            //       var row = $(e.currentTarget).closest("tr");
            //       var tr = $(e.target).closest("tr");
            //       var dataItem = this.dataItem(tr); 
            //       $scope.tempDataTindakan = $scope.dataSourceAnggaran
            //       .filter(function(el){
            //         return el.name !== grid[0].name;
            //       });
            //       grid.removeRow(row);
            //       var data ={};
            //       if (dataItem != undefined){
            //           for (var i = data2.length - 1; i >= 0; i--) {
            //               if (data2[i].rowNumber ==  dataItem.rowNumber){ 
            //                   data2.splice(i, 1);
            //                   for (var i = data2.length - 1; i >= 0; i--) {

            //                       data2[i].rowNumber = i+1
            //                   }
            //                   $scope.dataTindakan = new kendo.data.DataSource({
            //                       data: data2
            //                   });
            //               }
            //           }
            //       }
            //   }
            //   function editChild(e){
            //      e.preventDefault();
            //           var grid = this;
            //           var row = $(e.currentTarget).closest("tr");
            //           var tr = $(e.target).closest("tr");
            //           var dataItem = this.dataItem(tr);   

            //           if (dataItem!=undefined){
            //               $scope.norec=dataItem.norec;
            //            medifirstService.get("perencanaan/get-child-bynorec?norec="+
            //                   dataItem.norec
            //                   )
            //               .then(function(dat){
            //                   $scope.item.kelompokHead={id:dat.data.data[0].id0,kelompokhead:dat.data.data[0].kelompokhead};
            //                   $scope.item.kelompokPertama={id:dat.data.data[0].id1,childpertama:dat.data.data[0].childpertama};
            //                   $scope.item.kelompokKedua={id:dat.data.data[0].id2,childkedua:dat.data.data[0].childkedua};
            //                   $scope.item.kelompokKetiga={id:dat.data.data[0].id3,childketiga:dat.data.data[0].childketiga};
            //                   // $scope.item.revisiKes={id:dat.data.data[0].id3,name:dat.data.data[0].revisidivake}
            //               })

            //               modelItemAkuntansi.getDataTableTransaksi("perencanaan/get-kel-keempat-part?childkeempat="
            //                   +dataItem.childkeempat, true, true, 10)
            //                   .then(function(data) {

            //                   $scope.listKeempat.add(data[0])
            //                   $scope.item.kelompokKeempat = data[0];

            //               })
            //               // $scope.item.kelompokKeempat={id:dataItem.id4,childkeempat:dataItem.childkeempat};  
            //               $scope.item.mataAnggarans=dataItem.mataanggaran;
            //               if (dataItem.totalblu==null)
            //               {
            //                   dataItem.totalblu=0;
            //               }
            //               if (dataItem.totalrm==null)
            //               {
            //                   dataItem.totalrm=0;
            //               }
            //               $scope.item.saldoBlus=parseFloat(dataItem.totalblu);
            //               $scope.item.saldoRms=parseFloat(dataItem.totalrm);
            //           }

            //            $scope.popUpWin.center().open();
            //   }
            // function hapusChild(e){
            //        e.preventDefault();
            //         var grid = this;
            //         var row = $(e.currentTarget).closest("tr");
            //         var tr = $(e.target).closest("tr");
            //         var dataItem = this.dataItem(tr); 

            //         var itemDelete = {
            //                     "norec": dataItem.norec,    
            //                 }
            //          manageServicePhp.hapusChildAnggaran(itemDelete).then(function(e){
            //             if(e.status === 201){
            //                  loadTreeview();
            //                     grid.removeRow(row);
            //             }
            //         })
            // }


            /////////////////////////////////////////////////////////////////////
        }
    ]);
});