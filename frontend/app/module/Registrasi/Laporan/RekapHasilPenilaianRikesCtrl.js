define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RekapHasilPenilaianRikesCtrl', ['$state', '$mdDialog', '$q', '$scope', 'CacheHelper', 'MedifirstService',
    function ($state, $mdDialog, $q, $scope, cacheHelper, medifirstService) {
        $scope.dataVOloaded1 = true;
        $scope.item = {};
        $scope.item.periodeAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
        $scope.item.periodeAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));
        loadData();
        $scope.isRouteLoading = false;
        var noregistrasi = '';
        var noregistrasi1 = "";

        $scope.Cari = function () {
            $scope.isRouteLoading = true;
            loadData()
        }

        function loadData() {
            var tglAwal = moment($scope.item.periodeAwal).format('YYYY-MM-DD HH:mm:ss');
            var tglAkhir = moment($scope.item.periodeAkhir).format('YYYY-MM-DD HH:mm:ss');

            if ($scope.item.norm == undefined){
                var norm = ""
            } else {
                var norm = "&nocm=" + $scope.item.norm
            }
            if ($scope.item.noregistrasi == undefined){
                var noreg = ""
            } else {
                var noreg = "&noReg=" + $scope.item.noregistrasi
            }
            medifirstService.get("registrasi/laporan/get-daftar-hasil-rikkes?"
            + "tglAwal=" + tglAwal 
            + "&tglAkhir=" + tglAkhir 
            + norm + noreg).then(function (g) {
                debugger;
                for(let i = 0; i < g.data.data.length; i++) {
                    if (g.data.data.length == 1) {
                        noregistrasi = g.data.data[i].noregistrasi
                    }
                    if (g.data.data.length > 1) {
                        noregistrasi = noregistrasi + ',' + g.data.data[i].noregistrasi
                    }
                }
                noregistrasi1 = noregistrasi.slice(1, noregistrasi.length);
                medifirstService.get('registrasi/laporan/get-hasil-lab-rikkes?noregistrasi=' + noregistrasi1).then(function(dat) {
                    debugger
                for(let j = 0; j < g.data.data.length; j++) {
                    g.data.data[j].hasillab = g.data.data[j].kesimpulan
                    for (let m = 0; m < dat.data.length; m++) {
                        if (g.data.data[j].noregistrasi == dat.data[m].noregistrasi) {
                            g.data.data[j].hasillab = g.data.data[j].hasillab + ',' + dat.data[m].detailpemeriksaan + ',' + dat.data[m].hasil
                        } else {
                        
                        }
                    }
                }
                debugger
                var data = g.data.data
                var dataanjay = []
                dataanjay.push(data[0])
                for (var i = 1; i < data.length; i++){
                    var podo = false
                    var noregistrasi = data[i].noregistrasi
                    var noregistrasireal = dataanjay[dataanjay.length - 1].noregistrasi
                    if (noregistrasi == noregistrasireal) {
                        podo = true
                    }
                    if (podo == false) {
                        dataanjay.push(data[i])
                    }
                }
                $scope.isRouteLoading = false;
                $scope.dataRHPR = new kendo.data.DataSource({

                    data: dataanjay,
                    pageSize: 20,
                    total: g.data.length,
                    serverPaging: false
                })
            })
        });
            $scope.columnRHPR = {

                toolbar: ["excel"],

                excel: {
                    fileName: "Rekapitulasi Hasil Penilaian Rikkes Berkala.xlsx",
                    allPages: true,
                },

                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value : "REKAPITULASI HASIL PENILAIAN RIKKES BERSKALA POLRI", background: "#fffff"}]
                    });
                },

                scrollable: true,
                selectable: 'row',
                pageable: true,
                columns: [
                    {
                        // "field": "nomorurut",
                        "title": "No Urut",
                        "width": "60px",
                        "template": "<span class='style-left'>#: nomorurut #</span>"
                    },
                    {
                        "field": "nomor2",
                        "title": "No Surat",
                        "width": "100px",
                        "template": "<span class='style-left'>#: nomor2 #</span>"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "130px",
                        "template": "<span class='style-left'>#: namapasien #</span>"
                    },
                    {
                        "field": "pangkat",
                        "title": "Pangkat",
                        "width": "90px",
                        "template": "<span class='style-left'>#: pangkat #</span>"
                    },
                    {
                        "field": "nipnrp",
                        "title": "NRP/NIP",
                        "width": "80px",
                        "template": "<span class='style-left'>#: nipnrp #</span>"
                    },
                    {
                        "field": "jeniskelamin",
                        "title": "L/P",
                        "width": "40px",
                        "template": "<span class='style-left'>#: jeniskelamin #</span>"
                    },
                    {
                        "field": "intensif",
                        "title": "Intensif",
                        "width": "100px",
                        "template": "<span class='style-center'>#: intensif #</span>"
                    },
                    {
                        "field": "satuankerjapasien",
                        "title": "Satfung",
                        "width": "100px",
                        "template": "<span class='style-left'>#: satuankerjapasien #</span>"
                    },
                    {
                        "field": "tinggibadan",
                        "title": "TB",
                        "width": "50px",
                        "template": "<span class='style-left'>#: tinggibadan #</span>"
                    },
                    {
                        "field": "beratbadan",
                        "title": "BB",
                        "width": "50px",
                        "template": "<span class='style-left'>#: beratbadan #</span>"
                    },
                    {
                        "title": "Tek Darah",
                        "width": "100px",
                        headerAttributes: { style: "text-align : center " },
                        columns:
                        [
                            {
                                "field": "tensisist",
                                "title": "Sist",
                                "width": "50px",
                                "template": "<span class='style-left'>#: tensisist #</span>"
                            },
                            {
                                "field": "tensidias",
                                "title": "Dias",
                                "width": "50px",
                                "template": "<span class='style-left'>#: tensidias #</span>"
                            },
                        ]
                    },
                    {
                        "field": "nadi",
                        "title": "Nadi",
                        "width": "60px",
                        "template": "<span class='style-left'>#: nadi #</span>"
                    },
                    {
                        "field": "hasillab",
                        "title": "Kelainan Fisik/EKG/LAB/GIGI/DLL",
                        "width": "350px",
                        "template": "<span class='style-left'>#: hasillab #</span>"
                    },
                    {
                        "title": "Nilai",
                        "width": "100px",
                        headerAttributes: { style: "text-align : center " },
                        columns:
                        [
                            {
                                "field": "kualitatif",
                                "title": "Kual",
                                "width": "50px",
                                "template": "<span class='style-left'>#: kualitatif #</span>"
                            },
                            {
                                "field": "kuantitatif",
                                "title": "Kuan",
                                "width": "50px",
                                "template": "<span class='style-left'>#: kuantitatif #</span>"
                            }
                        ]
                    }
                ]
            }
        }
    }
])
})