define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanMordibitasRehabCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemD = {};
            $scope.isRouteLoading = false;

            $scope.tglMeninggal = '';
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }
            var kelompokUserLogin = ModelItem.getStatusUser()
            if (kelompokUserLogin == 'radiologi' || kelompokUserLogin == 'laborat') {
                $scope.isPenunjang = true
            }
            loadCombo()
            function loadCombo() {
                medifirstService.get("registrasi/laporan/get-combo-box-laporan-pengunjung")
                    .then(function (data) {
                        $scope.listRuangans = data.data.ruangan
                        $scope.listDokter = data.data.dokter
                    })

                medifirstService.get("sysadmin/general/get-combo-address")
                    .then(function (data) {
                        $scope.listKotaKabupaten = data.data.kotakabupaten
                    })

            }
            loadFirst()
            function loadFirst() {
                var chacePeriode = cacheHelper.get('RegistrasiPasienLamaRevCtrl');
                if (chacePeriode != undefined) {
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);

                } else {
                    $scope.item.periodeAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                    $scope.item.periodeAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                }
            }
            loadData()
            $scope.SearchData = function () {
                loadData()
            }
            $scope.SearchEnter = function () {
                loadData()
            }
            $scope.SearchNoRm = function () {
                loadData()
            }
            $scope.SearchTglLahir = function () {
                loadData()
            }
            loadData()
            function loadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.periodeAwal).format('DD-MMM-YYYY HH:mm');
                var tglAkhir = moment($scope.item.periodeAkhir).format('DD-MMM-YYYY HH:mm');

                var rm = ""
                if ($scope.item.noRM != undefined) {
                    rm = "&nocm=" + $scope.item.noRM
                }

                var pasien = ""
                if ($scope.item.namaPasien != undefined) {
                    pasien = "&nama=" + $scope.item.namaPasien
                }

                var namaruangan = ""
                if ($scope.item.ruangan != undefined) {
                    namaruangan = "&ruanganId=" + $scope.item.ruangan.id
                }

                var dokter = ""
                if ($scope.item.dokter != undefined) {
                    dokter = "&dokter=" + $scope.item.dokter.id
                }

                var kotaKab = ""
                if ($scope.item.kabupaten != undefined) {
                    kotaKab = "&kotaKab=" + $scope.item.kabupaten.id
                }

                medifirstService.get("registrasi/laporan/get-data-lap-pengunjung?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    rm +
                    pasien +
                    namaruangan +
                    dokter + kotaKab)
                    .then(function (data) {
                        
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < data.data.data.length; i++) {
                            // data.data[i].no = i+1
                            var tanggal = new Date(data.data.data[i].tglregistrasi);
                            var tanggalLahir = new Date(data.data.data[i].tgllahir);
                            var umur = DateHelper.CountAge(tanggalLahir, tanggal);
                            data.data.data[i].umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari'

                        }
                        $scope.dataSourceGrid = new kendo.data.DataSource({
                            data: data.data.data,
                            pageSize: 10,
                            total: data.data.data.length,

                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }

                        });
                    });

            };



            $("#kGrid").kendoGrid({
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "LaporanPasienDaftar.xlsx",
                    allPages: true,

                },
                // pdf: {
                //     fileName: "LaporanPasienMasuk.pdf",
                //     allPages: true,
                // },

                dataSource: $scope.dataExcel,
                sortable: true,
                // reorderable: true,
                // filterable: true,
                pageable: true,
                // groupable: true,
                // columnMenu: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Laporan Pengunjung", background: "#fffff" }]
                    });
                },
                columns: [
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "150px",
                        "template": "<span class='style-center'>#: namapasien #</span>"
                    },
                    {
                        "field": "nocmfk",
                        "title": "No Rekam Medis",
                        "width": "80px",
                        "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "title": "STATUS GOLONGAN PASIEN",
                        "width": "180px",
                        headerAttributes: { style: "text-align : center" },
                        columns:
                            [
                                {
                                    "title": "POLRI",
                                    "width": "180px",
                                    headerAttributes: { style: "text-align : center" },
                                    columns:
                                        [
                                            {
                                                "title": "ANGGOTA",
                                                "width": "180px",
                                                headerAttributes: { style: "text-align : center" },
                                                columns:
                                                    [
                                                        {
                                                            "title": "MABES POLRI",
                                                            "width": "180px",
                                                            headerAttributes: { style: "text-align : center" },
                                                            
                                                            columns:
                                                                [
                                                                    {
                                                                        
                                                                        "title": "B",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:anggotamabespolribaru #</span>"
                                                                    },
                                                                    {
                                                                        "title": "L",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:anggotamabespolrilama #</span>"
                                                                        
                                                                    },
                                                                    {
                                                                        "title": "R",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:anggotamabespolrirujuk #</span>"
                                                                        
                                                                    },
                                                                ]
                                                        },
                                                        {
                                                            "title": "PMJ",
                                                            "width": "180px",
                                                            headerAttributes: { style: "text-align : center" },
                                                            columns:
                                                                [
                                                                    {   
                                                                        "title": "B",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:anggotapmjbaru #</span>"
                                                                        
                                                                    },
                                                                    {
                                                                        "title": "L",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:anggotapmjlama #</span>"
                                                                    },
                                                                    {
                                                                        "title": "R",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:anggotapmjrujuk #</span>"
                                                                    },
                                                                ]
                                                        },
                                                        {
                                                            "title": "POLDA LAIN",
                                                            "width": "180px",
                                                            headerAttributes: { style: "text-align : center" },
                                                            columns:
                                                                [
                                                                    {
                                                                        "title": "B",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:anggotapoldalainbaru #</span>"
                                                                    },
                                                                    {
                                                                        "title": "L",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:anggotapoldalainlama #</span>"
                                                                    },
                                                                    {
                                                                        "title": "R",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:anggotapoldalainrujuk #</span>"
                                                                    },
                                                                ]
                                                        }
                                                    ]
                                            },
                                            {
                                                "title": "SIPIL",
                                                "width": "180px",
                                                headerAttributes: { style: "text-align : center" },
                                                columns:
                                                    [
                                                        {
                                                            "title": "MABES POLRI",
                                                            "width": "180px",
                                                            headerAttributes: { style: "text-align : center" },
                                                            columns:
                                                                [
                                                                    {
                                                                        "title": "B",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:sipilmabespolribaru #</span>"
                                                                        
                                                                    },
                                                                    {
                                                                        "title": "L",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:sipilmabespolrilama #</span>"
                                                                    },
                                                                    {
                                                                        "title": "R",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:sipilmabespolrirujuk #</span>"
                                                                    },
                                                                ]
                                                        },
                                                        {
                                                            "title": "PMJ",
                                                            "width": "180px",
                                                            headerAttributes: { style: "text-align : center" },
                                                            columns:
                                                                [
                                                                    {
                                                                        "title": "B",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:sipilpmjbaru #</span>"
                                                                    },
                                                                    {
                                                                        "title": "L",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:sipilpmjlama #</span>"
                                                                    },
                                                                    {
                                                                        "title": "R",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:sipilpmjrujuk #</span>"
                                                                    },
                                                                ]
                                                        },
                                                        {
                                                            "title": "POLDA LAIN",
                                                            "width": "180px",
                                                            headerAttributes: { style: "text-align : center" },
                                                            columns:
                                                                [
                                                                    {
                                                                        "title": "B",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:sipilpoldalainbaru #</span>"
                                                                    },
                                                                    {
                                                                        "title": "L",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:sipilpoldalainlama #</span>"
                                                                    },
                                                                    {
                                                                        "title": "R",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:sipilpoldalainrujuk #</span>"
                                                                    },
                                                                ]
                                                        }
                                                    ]
                                            },
                                            {
                                                "title": "KELUARGA",
                                                "width": "180px",
                                                headerAttributes: { style: "text-align : center" },
                                                columns:
                                                    [
                                                        {
                                                            "title": "MABES POLRI",
                                                            "width": "180px",
                                                            headerAttributes: { style: "text-align : center" },
                                                            columns:
                                                                [
                                                                    {
                                                                        "title": "B",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:keluargamabespolribaru #</span>"
                                                                    },
                                                                    {
                                                                        "title": "L",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:keluargamabespolrilama #</span>"
                                                                    },
                                                                    {
                                                                        "title": "R",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:keluargamabespolrirujuk #</span>"
                                                                    },
                                                                ]
                                                        },
                                                        {
                                                            "title": "PMJ",
                                                            "width": "180px",
                                                            headerAttributes: { style: "text-align : center" },
                                                            columns:
                                                                [
                                                                    {
                                                                        "title": "B",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:keluargapmjbaru #</span>"
                                                                    },
                                                                    {
                                                                        "title": "L",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:keluargapmjlama #</span>"
                                                                    },
                                                                    {
                                                                        "title": "R",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:keluargapmjrujuk #</span>"
                                                                    },
                                                                ]
                                                        },
                                                        {
                                                            "title": "POLDA LAIN",
                                                            "width": "180px",
                                                            headerAttributes: { style: "text-align : center" },
                                                            columns:
                                                                [
                                                                    {
                                                                        "title": "B",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:keluargapoldalainbaru #</span>"
                                                                    },
                                                                    {
                                                                        "title": "L",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:keluargapoldalainlama #</span>"
                                                                    },
                                                                    {
                                                                        "title": "R",
                                                                        "width": "180px",
                                                                        "template": "<span class='style-center'>#:keluargapoldalainrujuk #</span>"
                                                                    },
                                                                ]
                                                        }
                                                    ]
                                            },
                                        ]
                                },
                            ]
                    },
                    {
                        "title": "KASUS BARU MENURUT GOL UMUR",
                        "width": "180px",
                        headerAttributes: { style: "text-align : center" },
                        columns:
                            [
                                {
                                    "title": "1-28 Hr",
                                    "width": "180px",
                                    "template": "<span class='style-center'>#:satusampaiduadelapanhr #</span>"
                                },
                                {
                                    "title": "29-1 Th",
                                    "width": "180px",
                                    "template": "<span class='style-center'>#:duasembilansampaitigaenamempathr #</span>"
                                },
                                {
                                    "title": "1-5 Th",
                                    "width": "180px",
                                    "template": "<span class='style-center'>#:satusampailimath #</span>"
                                },
                                {
                                    "title": "5-15 Th",
                                    "width": "180px",
                                    "template": "<span class='style-center'>#:limasampaisatulimath #</span>"
                                },
                                {
                                    "title": "15-25 Th",
                                    "width": "180px",
                                    "template": "<span class='style-center'>#:satulimasampaidualimath #</span>"
                                },
                                {
                                    "title": "25-45 Th",
                                    "width": "180px",
                                    "template": "<span class='style-center'>#:dualimasampaiempatlimath #</span>"
                                },
                                {
                                    "title": "45-55 Th",
                                    "width": "180px",
                                    "template": "<span class='style-center'>#:empatlimasampailimalimath #</span>"
                                },
                                {
                                    "title": "55 + Th",
                                    "width": "180px",
                                    "template": "<span class='style-center'>#:lebihlimalima #</span>"
                                },
                            ]
                    },
                    {
                        "title": "KASUS MENURUT SEKS",
                        "width": "180px",
                        headerAttributes: { style: "text-align : center" },
                        columns:
                        [
                            {
                                "title": "Lk",
                                "width": "180px",
                                "template": "<span class='style-center' id='LAKI'>#: laki #</span>"
                            },
                            {
                                "title": "Pr",
                                "width": "180px",
                                "template": "<span class='style-center' id='LAKI'>#: perempuan #</span>"
                            },
                        ]
                    },
                    {
                        "title": "JML Kasus BARU",
                        "width": "180px",
                        headerAttributes: { style: "text-align : center" },
                    },
                    {
                        "title": "JML Knj",
                        "width": "180px",
                        headerAttributes: { style: "text-align :center" },
                        columns:
                        [
                            {
                                "title": "BARU",
                                "width": "180px",
                                "template": "<span class='style-center'>#: baru #</span>"
                            },
                            {
                                "title": "LAMA",
                                "width": "180px",
                                "template": "<span class='style-center'>#: lama #</span>"
                            },
                        ]
                    },
                    {
                        "title": "DIAGNOSA",
                        "width": "180px",
                        headerAttributes: { style: "text-align : center" },
                        columns:
                        [
                            {
                                "title": " ",
                                "width": "180px",
                                "template": "<span class='style-center'>#: namadiagnosa #</span>"
                            },
                            {
                                "title": "Kode",
                                "width": "180px",
                                "template": "<span class='style-center'>#: kddiagnosa #</span>"
                            },
                        ]
                    },
                    {
                        "title": "MODALITAS FISIOTERAPI",
                        "width": "180px",
                        headerAttributes: { style: "text-align : center" },
                        columns:
                        [
                            {
                                "title": "IR",
                                "width": "180px",
                            },
                            {
                                "title": "DTH",
                                "width": "180px",
                            },
                            {
                                "title": "TEN",
                                "width": "180px",
                            },
                            {
                                "title": "NEB",
                                "width": "180px",
                            },
                            {
                                "title": "EXC",
                                "width": "180px",
                            },
                            {
                                "title": "FAR",
                                "width": "180px",
                            },
                            {
                                "title": "TRK",
                                "width": "180px",
                            },
                            {
                                "title": "US",
                                "width": "180px",
                            },
                            {
                                "title": "PAR",
                                "width": "180px",
                            },
                        ]
                    },
                    {
                        "title": "FISIOTERAPI",
                        "width": "180px",
                        headerAttributes: { style: "text-align:center" },
                    },
                    {
                        "title": "T   K   RM",
                        "width": "180px",
                        headerAttributes: { style: "text-align:center" },
                    },
                    {
                        "title": "KETERANGAN",
                        "width": "180px",
                        headerAttributes: { style: "text-align:center" },
                    }
                ]
            });

            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.nocm = dataPasienSelected.nocm;
                    $scope.idPasien = dataPasienSelected.nocmfk;
                    $scope.tglMeninggal = dataPasienSelected.tglmeninggal;
                    $scope.dataPasienSelected = dataPasienSelected;
                }
            }
            $scope.klikdua = function (dataPasienSelected) {
                if (dataPasienSelected.foto != null) {
                    $scope.item.image = dataPasienSelected.foto
                    $scope.popUpPhoto.center().open()

                }

            }
            $scope.tutupPhoto = function () {
                $scope.item.image = "../app/images/avatar.jpg"
                $scope.popUpPhoto.close()
            }
            $scope.formatJam = function (tanggal) {
                if (tanggal == 'null')
                    return ''
                else
                    return moment(tanggal).format('HH:mm');
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            // $scope.formatJam = function (tanggal) {
            //     return moment(tanggal).format('HH:mm');
            // }
            $scope.$on("kendoWidgetCreated", function (event, widget) {
                if (widget === $scope.grid) {
                    $scope.grid.element.on('dblclick', function (e) {
                        if ($scope.nocm != undefined) {
                            $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                                noCm: $scope.nocm
                            })
                            var cacheSet = undefined;
                            cacheHelper.set('CacheRegistrasiPasien', cacheSet);

                        }
                    })

                }

            })


            $scope.RegistrasiPasien = function () {

                if ($scope.nocm == undefined) {
                    toastr.warning('Pilih data dulu!')
                    return
                }

                if ($scope.tglMeninggal != undefined) {
                    toastr.warning('Pasien Sudah Meninggal Tidak Bisa Didaftarkan, Peringatan !')
                    return
                }


                if (!$scope.isPenunjang) {
                    cacheHelper.set('isPenunjang', undefined);
                    $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                        noCm: $scope.nocm
                    })
                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cacheSetss = undefined;
                    cacheHelper.set('CacheRegisOnline', cacheSetss);

                } else {
                    cacheHelper.set('isPenunjang', true);
                    $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                        noCm: $scope.nocm
                    })
                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cacheSetss = undefined;
                    cacheHelper.set('CacheRegisOnline', cacheSetss);
                }
            }
            $scope.EditPasien = function () {
                if ($scope.nocm != undefined) {

                    cacheHelper.set('CacheRegisBayi', undefined);
                    $state.go('RegistrasiPasienBaru', {
                        noRec: 0,
                        idPasien: $scope.idPasien
                    })


                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }
            $scope.HapusPasien = function () {
                if ($scope.idPasien != undefined) {
                    var item = {
                        idpasien: $scope.idPasien
                    }

                    medifirstService.post('registrasi/update-false-pasien', item).then(function (e) {
                        loadData();
                    })

                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }

            $scope.pasienBaru = function () {
                // body...
                $state.go("RegistrasiPasienBaru", {
                    noRec: 0,
                    idPasien: 0
                })
            }


            $scope.columnRiwayatRegistrasi = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarRiwayatRegistrasi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Registrasi Pasien",
                        fontSize: 20,
                        textAlign: "center",
                        background: "#ffffff",
                        // color:"#ffffff"
                    }];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70 });
                },
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        "field": "no",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglregistrasi #')}}</span>"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "90px"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruanganan Layanan",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namaruangan #</span>"
                    },
                    {
                        "field": "namadokter",
                        "title": "Nama Dokter",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namadokter #</span>"
                    },
                    {
                        "field": "tglpulang",
                        "title": "Tgl Pulang",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },
                    {
                        "field": "lamarawat",
                        "title": "Lama Dirawat",
                        "width": "80px"
                        // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    }
                ]
            };

            $scope.RiwayatRegistrasi = function () {
                if ($scope.dataPasienSelected == undefined) {
                    messageContainer.error("Pilih data dulu!")
                }
                $scope.itemD.noRM = $scope.dataPasienSelected.nocm;
                $scope.itemD.namaPasien = $scope.dataPasienSelected.namapasien;
                $scope.itemD.tglLahir = moment($scope.dataPasienSelected.tgllahir).format('DD-MM-YYYY');
                loadDataRiwayat();
                $scope.popUpRiwayatRegistrasi.center().open();
                var actions = $scope.popUpRiwayatRegistrasi.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpRiwayatRegistrasi.setOptions({ actions: actions });
            }

            $scope.TutupPopUp = function () {
                $scope.itemD.noRM = undefined;
                $scope.itemD.namaPasien = undefined;
                $scope.itemD.tglLahir = undefined;
                $scope.itemD.noRegistrasi = undefined;
                $scope.itemD.JumlahRawat = undefined;
                $scope.dataRiwayatRegistrasi = new kendo.data.DataSource({
                    data: []
                });
                $scope.popUpRiwayatRegistrasi.close();
            }

            function loadDataRiwayat() {
                $scope.isRouteLoading = true;
                var rm = ""
                if ($scope.itemD.noRM != undefined) {
                    rm = "&norm=" + $scope.itemD.noRM
                }

                var pasien = ""
                if ($scope.itemD.namaPasien != undefined) {
                    pasien = "&namaPasien=" + $scope.itemD.namaPasien
                }

                var tglLahirs = ""
                if ($scope.itemD.tglLahir != undefined) {
                    tglLahirs = "tglLahir=" + moment($scope.itemD.tglLahir).format('YYYY-MM-DD HH:mm:ss');
                }

                var noReg = ""
                if ($scope.itemD.noRegistrasi != undefined) {
                    noReg = "&noReg=" + $scope.itemD.noRegistrasi;
                }

                medifirstService.get("registrasi/daftar-riwayat-registrasi?" +
                    tglLahirs + rm + noReg + pasien)
                    .then(function (data) {
                        $scope.isRouteLoading = false;
                        var jumlahRawat = 0;
                        var dRiwayatReg = data.data.daftar;
                        for (var i = 0; i < dRiwayatReg.length; i++) {
                            dRiwayatReg[i].no = i + 1
                            if (dRiwayatReg[i].statusinap == 1) {
                                jumlahRawat = jumlahRawat + 1;
                                if (dRiwayatReg[i].tglpulang != undefined) {
                                    var umur = DateHelper.CountAge(new Date(dRiwayatReg[i].tglregistrasi), new Date(dRiwayatReg[i].tglpulang));
                                    var bln = umur.month,
                                        thn = umur.year,
                                        day = umur.day
                                    dRiwayatReg[i].lamarawat = day + " Hari";
                                } else {
                                    var umur = DateHelper.CountAge(new Date(dRiwayatReg[i].tglregistrasi), new Date($scope.now));
                                    var bln = umur.month,
                                        thn = umur.year,
                                        day = umur.day
                                    dRiwayatReg[i].lamarawat = day + " Hari";
                                }
                            }
                        }
                        $scope.itemD.JumlahRawat = jumlahRawat;
                        $scope.dataRiwayatRegistrasi = new kendo.data.DataSource({
                            data: dRiwayatReg,
                            pageSize: 10,
                            total: dRiwayatReg.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                    });
            }

            $scope.SearchEnterDetail = function () {
                loadDataRiwayat();
            }
            function saveBase64AsFile(base64, fileName) {

                var link = document.createElement("a");

                link.setAttribute("href", base64);
                link.setAttribute("download", fileName);
                link.click();
            }
            $scope.saveImage = function () {
                saveBase64AsFile($scope.item.image, 'asa.jpg')
                // var img = document.getElementById('embedImage');
                // img.src = $scope.item.image
                // window.location.href = img.src.replace('image/png', 'image/octet-stream');
            }
            window.addEventListener('DOMContentLoaded', () => {

                var img = document.getElementById('embedImage');
                img.src = $scope.item.image

                img.addEventListener('load', () => button.removeAttribute('disabled'));

                const button = document.getElementById('saveImage');
                button.addEventListener('click', () => {
                    window.location.href = img.src.replace('image/jpg', 'image/octet-stream');
                });
            });
            ///////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});