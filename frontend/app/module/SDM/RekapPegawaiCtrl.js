define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RekapPegawaiCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper) {
            //Inisial Variable             
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;
            FormLoad();
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

            function FormLoad() {

                $scope.tglPelayanan = $scope.item.pelayanan;
                $scope.dokter = $scope.item.namaPegawai;
                $scope.date = new Date();
                var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

                //Tanggal Default
                $scope.item.tglawal = tanggals + " 00:00";
                $scope.item.tglakhir = tanggals + " 23:59";

                // Tanggal Inputan
                $scope.tglawal = $scope.item.tglawal;
                $scope.tglakhir = $scope.item.tglakhir;
                $scope.pegawai = medifirstService.getPegawai();

                medifirstService.get("sdm/get-data-combo-sdm?", true).then(function (dat) {
                    var dataCombo = dat.data
                    // var dataLogin = dat.datalogin[0];
                    $scope.listStatus = dataCombo.statuspegawai;
                    $scope.listJenisPegawai = dataCombo.jenispegawai;
                    $scope.listKategory = dataCombo.kategorypegawai;
                });
            }

            $scope.getIsiComboRuangan = function () {
                $scope.listRuangan = $scope.item.departement.ruangan
            }

            $scope.Search = function () {
                $scope.isLoadingData = true;
                LoadData();
            }

            function LoadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');
                //debugger;

                var kateg = "";
                if ($scope.item.kategory != undefined) {
                    kateg = "kategId=" + $scope.item.kategory.id;
                }
                var jenis = "";
                if ($scope.item.jenis != undefined) {
                    jenis = "&jenisPegId=" + $scope.item.jenis.id;
                }

                var status = "";
                if ($scope.item.status != undefined) {
                    status = "&statusPegId=" + $scope.item.status.id;
                }



                medifirstService.get("sdm/get-rekap-pegawai?"

                    + kateg
                    + jenis
                    + status).then(function (data) {
                        $scope.isLoadingData = false;
                        var datas = data.data.data
                        if ($scope.item.kategoryLap != undefined) {
                            for (let i = datas.length - 1;i >= 0; i--) {
                                const element = datas[i];
                                if ($scope.item.kategoryLap.nama != element.kategory)
                                    datas.splice(i, 1)
                            }
                        }

                        $scope.sourceLaporan = new kendo.data.DataSource({
                            data: datas,
                            pageSize: 20,
                            group: $scope.group,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        tipe: { type: "string" },
                                        kategory: { type: "string" },
                                        total: { type: "number" },
                                      
                                    }
                                }
                            },
                            selectable: true,
                            refresh: true,
                            // groupable:true,
                            group: [
                                {
                                    field: "kategory", aggregates: [
                                        { field: 'total', aggregate: 'sum' },
                                        // { field: "jumlah", aggregate: 'sum' },
                                        // { field: 'harga', aggregate: 'sum' },
                                    ]
                                },
                            ],
                            aggregate: [
                                { field: 'total', aggregate: 'sum' },
                           
                            ]
                          
                        });


                    })
            }

            $scope.Perbaharui = function () {
                $scope.ClearSearch();
            }

            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.Search();
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.formatJam = function (tanggal) {
                return moment(tanggal).format('HH:mm');
            }
            // $scope.group = {
            //     field: "kategory",
            //     aggregates: [

            //         {
            //             field: "kategory",
            //             aggregate: "count"
            //         }]
            // };
            // $scope.aggregate = [

            //     {
            //         field: "kategory",
            //         aggregate: "count"
            //     }]
            $scope.listKatLaporan = [{ nama: 'Jenis Kelamin' }, { nama: 'Jenis Kepegawaian' }, { nama: 'Agama' }, { nama: 'Pendidikan' }, { nama: 'Jenis Usia' }]
            $scope.columnLaporan = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "Rekap Pegawai.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "Rekapitulasi Pegawai";

                    var myHeaders = [{
                        value: "Rekapitulasi Pegawai",
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
                        "field": "tipe",
                        "title": "Keterangan",

                        "width": "60%",
                    },
                    {
                        "field": "total",
                        "title": "Jumlah",
                        "width": "30%",
                        aggregates: ["sum"],
                        groupFooterTemplate: "<span>Total : #=data.total.sum  # </span>",
                    },
                    {
                        width: '10%',
                        hidden: true,
                        field: "kategory",
                        title: "Kategory",
                        aggregates: ["count"],
                        // groupHeaderTemplate: " #= value # (Jumlah: #= count#)"
                    },

                ]
            };

            ///////////////////////////////////////////////////////////////////////
        }
    ]);
});