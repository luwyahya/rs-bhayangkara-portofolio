define(['initialize'], function (initialize) {

    'use strict';
    initialize.controller('SensusHarianMutuCtrl', ['$state', 'MedifirstService', '$rootScope', '$scope', 'DateHelper', '$timeout',
        function ($state, medifirstService, $rootScope, $scope, dateHelper, $timeout) {
            $scope.titleButton = 'Input Edukasi'
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.arrDokter = [];
            $scope.selectedData = [];
            var dataGrid = [];
            var datana = [];
            var data_head = [];
            var dataARR = [];
            var norecSasaran = '';
            var dataTea = [];
            var arrGroup = [];
            var satu = true;
            $scope.userPPI = false;
            $scope.statusAktif = true;
            $scope.istempatLaporan = true;
            $scope.item2 = {};
            $scope.monthSelectorOptions = function () {
                return {
                    start: "year",
                    depth: "year",
                    format: "MMMM yyyy",
                }
            }
            FormLoad();

            // let user = medifirstService.getPegawai();
            let user = medifirstService.getMapLoginUserToRuangan();

            const ada = user.find(value => value.id == 328 || value.id == 662 || value.id == 304);

            if (ada != undefined) {
                if (ada.id == 328) {
                    $scope.userPPI = true;
                    $scope.item.isPPI = true;
                    $scope.item.isPMKP = false;
                } else if (ada.id == 662) {
                    $scope.userPPI = true;
                    $scope.item.isPPI = false;
                    $scope.item.isPMKP = true;
                } else if (ada.id == 304) {
                    $scope.userPPI = true;
                    $scope.item.isPPI = false;
                    $scope.item.isPMKP = true;
                } else {
                    $scope.item.isPPI = false;
                    $scope.item.isPMKP = false;
                }
            } else {
                $scope.item.isPPI = true;
                $scope.item.isPMKP = true;
            }

            function FormLoad() {
                $scope.item.bulan = $scope.now;
                $scope.item2.bulan = $scope.now;
                // $scope.monthOnly = {
                //     start: "year",
                //     depth: "year",
                //     format: "MMMM yyyy",
                // };
                LoadCombo();
            }

            function LoadCombo() {
                // medifirstService.get('sysadmin/general/get-combo-ruangan?departemenfk=16').then(function (e) {
                //     $scope.listRuangan = e;
                // });
                medifirstService.get('sysadmin/general/rensar/get-jenis-indikator').then(function (e) {
                    $scope.listJenis = e.data.data
                })
                var dadar = medifirstService.getMapLoginUserToRuangan();
                if (dadar.length > 0) {
                    if (dadar[0].objectdepartemenfk == 16) {
                        // dadar[0].departemen
                        // dadar[0].id
                        // dadar[0].namaruangan
                        $scope.statusAktif = false;
                        medifirstService.get('sysadmin/general/get-combo-pegawai').then(function (e) {
                            $scope.listPegawai = e.data
                        });
                        $scope.item.departemen = { id: dadar[0].objectdepartemenfk, departemen: dadar[0].departemen };
                        $scope.item2.departemen = { id: dadar[0].objectdepartemenfk, departemen: dadar[0].departemen };
                        $scope.item.ruangan = { id: dadar[0].id, ruangan: dadar[0].namaruangan };
                        $scope.item2.ruangan = { id: dadar[0].id, ruangan: dadar[0].namaruangan };

                    } else {
                        medifirstService.get('sysadmin/general/get-combo-pegawai').then(function (e) {
                            $scope.listPegawai = e.data
                        });

                        // medifirstService.getPart("sysadmin/general/get-datacombo-departemen", true, true, 20).then(function (data) {
                        //     $scope.listDepartemen = data;
                        // });

                        medifirstService.get("pmkp/get-data-combo-pmkp").then(function (data) {
                            var datas = data.data
                            $scope.listDepartemen = datas.listdept;
                        })
                    }
                } else {
                    medifirstService.get('sysadmin/general/get-combo-pegawai').then(function (e) {
                        $scope.listPegawai = e.data
                    });

                    // medifirstService.getPart("sysadmin/general/get-datacombo-departemen", true, true, 20).then(function (data) {
                    //     $scope.listDepartemen = data;
                    // });

                    medifirstService.get("pmkp/get-data-combo-pmkp").then(function (data) {
                        var datas = data.data
                        $scope.listDepartemen = datas.listdept;
                    })
                }

                $scope.item.first = new Date(moment($scope.now).format('YYYY-MM-DD'));
                $scope.item.last = new Date(moment($scope.now).format('YYYY-MM-DD'));

            }

            $scope.getIsiComboRuangan = function () {
                if ($scope.item.departemen == undefined) {
                    $scope.listRuangan = $scope.item2.departemen.ruangan
                } else {
                    $scope.listRuangan = $scope.item.departemen.ruangan
                }
            }

            $scope.cekAll = function (bool) {
                if (bool) {
                    $scope.listDokter.forEach(function (e) {
                        e.isChecked = true
                        $scope.arrDokter.push(e)
                    })
                } else {
                    $scope.listDokter.forEach(function (e) {
                        e.isChecked = false
                        $scope.arrDokter = []
                    })
                }

            }

            $("#calendar").kendoCalendar();
            var isCheckAll = false
            $scope.selectUnselectAllRow = function () {
                var tempData = $scope.dataSourceGrid._data;

                if (isCheckAll) {
                    isCheckAll = false;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = false;
                        $scope.selectedData = []
                    }
                } else {
                    isCheckAll = true;
                    for (var i = 0; i < tempData.length; i++) {
                        tempData[i].statCheckbox = true;
                        $scope.selectedData.push(tempData[i])
                    }
                }

                console.log($scope.selectedData)
                reloaddataSourceGrid(tempData);
            }

            function reloaddataSourceGrid(ds) {

                var newDs = new kendo.data.DataSource({
                    data: ds,
                    pageSize: 20,
                    total: ds.length,
                    serverPaging: true,

                });

                var grid = $('#kGrid').data("kendoGrid");

                grid.setDataSource(newDs);
                grid.refresh();

            }

            $scope.selectRow = function (dataItem) {
                var dataSelect = _.find($scope.dataSourceGrid._data, function (data) {
                    return data.id == dataItem.id;
                });

                if (dataSelect.statCheckbox) {
                    dataSelect.statCheckbox = false;
                    for (let i = 0; i < $scope.selectedData.length; i++) {
                        if (dataSelect.norec == $scope.selectedData[i].norec) {
                            $scope.selectedData.splice([i], 1)
                            break
                        }
                    }
                } else {
                    dataSelect.statCheckbox = true;
                    $scope.selectedData.push(dataSelect)
                }
                console.log($scope.selectedData)
            }


            $scope.formatTanggal = function (tanggal) {
                if (tanggal != "null")
                    return moment(tanggal).format('DD-MMM-YYYY HH:mm');
                else
                    return '-'
            }

            $scope.cariDokter = function () {
                $scope.listTempDokter = []
                if ($scope.item.cariDokter != undefined) {
                    var textbox = $scope.item.cariDokter.toLowerCase()
                    for (let i = 0; i < $scope.listDokterCari.length; i++) {
                        var arr = $scope.listDokterCari[i].namalengkap.toLowerCase()
                        if (arr.indexOf(textbox) != -1) {
                            $scope.listTempDokter.push($scope.listDokterCari[i])
                        }
                    }
                    $scope.listDokter = []
                    $scope.listDokter = $scope.listTempDokter
                }
                if ($scope.item.cariDokter == "" || $scope.item.cariDokter == undefined)
                    $scope.listDokter = $scope.listDokterCari
            }

            $scope.cariLaporan = function () {
                if ($scope.item.isPPI == false && $scope.item.isPMKP == false || $scope.item.isPPI == true && $scope.item.isPMKP == true) {
                    toastr.error('Harus Dipilih Salah Satu PPI / PMKP')
                    return
                }
                satu = true;
                // $("#gridLap").empty();
                // $scope.onDataBoundLap();
                $scope.selectedData = [];
                // dataARR = [];
                // dataTea = [];
                datana = [];
                dataTea = Array();
                dataARR = Array();
                // var dataGrid = [];
                // var data_head = [];
                // var norecSasaran = '';
                arrGroup = [];
                // $scope.mainGridLap = null;
                // $scope.sourceLaporan = null;
                // $scope.onDataBoundLap = null;
                // grid = $('#kGrid').data("kendoGrid");

                if ($scope.item2.bulan == undefined) {
                    toastr.error('Bulan Belum di pilih ')
                    return
                }
                if ($scope.item2.departemen == undefined) {
                    toastr.error('Departemen Belum di pilih ')
                    return
                }
                var bln = ''
                if ($scope.item2.bulan != undefined) {
                    bln = moment($scope.item2.bulan).format('YYYY-MM')
                }
                var idJenisIndikator = ''
                if ($scope.item2.jenisIndikator != undefined) {
                    idJenisIndikator = $scope.item2.jenisIndikator.id
                }

                if ($scope.item2.departemen == undefined) {
                    medifirstService.get('pmkp/get-lap-indikator-mutu?bln=' + bln + '&isPPI=' + $scope.item.isPPI + '&isPMKP=' + $scope.item.isPMKP + '&idJenisIndikator=' + idJenisIndikator).then(function (e) {
                        $scope.isRouteLoading = false;
                        $scope.generateTable2(e)
                        $scope.generateTable3(e)
                    })


                    medifirstService.get('pmkp/get-capaian-indikator?bln=' + bln + '&isPPI=' + $scope.item.isPPI + '&isPMKP=' + $scope.item.isPMKP + '&idJenisIndikator=' + idJenisIndikator).then(function (res) {
                        $scope.isRouteLoading = false;
                        if (res.statResponse) {
                            debugger
                            const data = res.data

                            // data.forEach(element => )

                            if (data.length > 0) {
                                for (let i = 0; i < data.length; i++) {
                                    data[i].no = i + 1;
                                    data[i].capaian = data[i].capaian + '%'
                                }
                            }
                            $scope.dataSourceCapaian = new kendo.data.DataSource({
                                data: data,
                                pageSize: 20,


                            })
                        }
                    })
                } else {


                    var idDept = ''
                    if ($scope.item2.departemen != undefined) {
                        idDept = $scope.item2.departemen.id
                    }
                    var idRuangan = ''
                    if ($scope.item2.ruangan != undefined) {
                        idRuangan = $scope.item2.ruangan.id
                    }
                    $scope.isRouteLoading = true;
                    //'pmkp/get-data-sasaran-mutu?bulan=' + bln + idDept
                    //pmkp/get-data-indikator-departemen?" + "idDept=" + $scope.item.Departemen.value        

                    // firstCI()
                    // .then(function(responseCapaianIndikator){
                    //         return capaianIndikator(idDept, bln, idRuangan, $scope.item.isPPI, $scope.item.isPMKP);
                    //     }).then(function(secondCapaianIndikator){
                    //         return getDataChart(idDept, bln, idRuangan, isPPI, isPMKP)
                    //     })
                    capaianIndikator(idDept, bln, idRuangan, $scope.item.isPPI, $scope.item.isPMKP);
                    if ($scope.item.isPPI == true && $scope.item.isPMKP == false) {
                        getDataChartPPI(idDept, bln, idRuangan, $scope.item.isPPI, $scope.item.isPMKP)
                        // createChartPPI(tglPPI, PLEBITIS, ISK, IDO, VAP, IADP, DEKUBITUS, HAP);
                    } else if ($scope.item.isPMKP == true && $scope.item.isPPI == false) {
                        getDataChartPMKP(idDept, bln, idRuangan, $scope.item.isPPI, $scope.item.isPMKP)
                        // createChartPMKP(tglPPI, PLEBITIS, ISK, IDO, VAP, IADP, DEKUBITUS, HAP);
                    }

                    medifirstService.get('pmkp/get-lap-indikator-mutu?departemenfk=' + idDept + '&bln=' + bln + '&idRuangan=' + idRuangan + '&isPPI=' + $scope.item.isPPI + '&isPMKP=' + $scope.item.isPMKP + '&idJenisIndikator=' + idJenisIndikator).then(function (e) {
                        $scope.isRouteLoading = false;
                        $scope.generateTable2(e)
                        $scope.generateTable3(e)
                    })

                }
            }

            function capaianIndikator(idDept, bln, idRuangan, isPPI, isPMKP) {
                medifirstService.get('pmkp/get-capaian-indikator?departemenfk=' + idDept + '&bln=' + bln + '&idRuangan=' + idRuangan + '&isPPI=' + isPPI + '&isPMKP=' + isPMKP).then(function (res) {
                    $scope.isRouteLoading = false;
                    debugger
                    if (res.statResponse) {
                        const data = res.data
                        const ppi = data.filter(value => value.keteranganmaster == 1);

                        // return ppi;
                        if (data.length > 0) {
                            for (let i = 0; i < data.length; i++) {
                                data[i].no = i + 1;
                                data[i].capaian = data[i].capaian + '%'
                            }
                        }
                        $scope.dataSourceCapaian = new kendo.data.DataSource({
                            data: data,
                            pageSize: 20,


                        })
                    }
                })
            }

            function getDataChartPPI(idDept, bln, idRuangan, isPPI, isPMKP, ppi) {
                medifirstService.get('pmkp/get-lap-indikator-mutu-forchart?departemenfk=' + idDept + '&bln=' + bln + '&idRuangan=' + idRuangan + '&isPPI=' + isPPI + '&isPMKP=' + isPMKP).then(function (e) {
                    debugger;
                    // let hasil = [];
                    // for (const item of ppi) {
                    //     hasil.push(e.data.map(x => x.capaian+item.indikator))
                    // }
                    // var indikator=[];
                    // for (const item of ppi) {
                    //     if (a =[]){
                    //         var indikator = e.data.map(x => x.capaian);
                    //     }else{
                    //         for (const item2 of indikator) {
                    //             if item2.
                    //         }
                    //     }
                    // }

                    $scope.isRouteLoading = false;
                    const PLEBITIS = e.data.map(x => x.capaianPLEBITIS);
                    const ISK = e.data.map(x => x.capaianISK);
                    const IDO = e.data.map(x => x.capaianIDO);
                    const VAP = e.data.map(x => x.capaianVAP);
                    const IADP = e.data.map(x => x.capaianIADP);
                    const DEKUBITUS = e.data.map(x => x.capaianDEKUBITUS);
                    const HAP = e.data.map(x => x.capaianHAP);
                    const tglPPI = e.data.map(x => x.tgl);
                    debugger
                    if (isPPI == true && isPMKP == false) {
                        createChartPPI(tglPPI, PLEBITIS, ISK, IDO, VAP, IADP, DEKUBITUS, HAP);
                    } else if (isPMKP == true && isPPI == false) {
                        createChartPMKP(tglPPI, PLEBITIS, ISK, IDO, VAP, IADP, DEKUBITUS, HAP);
                    }
                })
            }

            function getDataChartPMKP(idDept, bln, idRuangan, isPPI, isPMKP, ppi) {
                debugger
                medifirstService.get('pmkp/get-lap-indikator-mutu-forchart-pmkp?departemenfk=' + idDept + '&bln=' + bln + '&idRuangan=' + idRuangan + '&isPPI=' + isPPI + '&isPMKP=' + isPMKP).then(function (e) {
                    debugger;
                    // let hasil = [];
                    // for (const item of ppi) {
                    //     hasil.push(e.data.map(x => x.capaian+item.indikator))
                    // }
                    // var indikator=[];
                    // for (const item of ppi) {
                    //     if (a =[]){
                    //         var indikator = e.data.map(x => x.capaian);
                    //     }else{
                    //         for (const item2 of indikator) {
                    //             if item2.
                    //         }
                    //     }
                    // }

                    $scope.isRouteLoading = false;
                    const PLEBITIS = e.data.map(x => x.capaianPLEBITIS);
                    const ISK = e.data.map(x => x.capaianISK);
                    const IDO = e.data.map(x => x.capaianIDO);
                    const VAP = e.data.map(x => x.capaianVAP);
                    const IADP = e.data.map(x => x.capaianIADP);
                    const DEKUBITUS = e.data.map(x => x.capaianDEKUBITUS);
                    const HAP = e.data.map(x => x.capaianHAP);
                    const tglPPI = e.data.map(x => x.tgl);
                    debugger
                    createChartPPI(tglPPI, PLEBITIS, ISK, IDO, VAP, IADP, DEKUBITUS, HAP);
                    // if(isPPI == true && isPMKP == false) {
                    // } else if(isPMKP == true && isPPI == false) {
                    //     createChartPMKP(tglPPI, PLEBITIS, ISK, IDO, VAP, IADP, DEKUBITUS, HAP);
                    // }
                })
            }


            function createChartPPI(tglPPI, PLEBITIS, ISK, IDO, VAP, IADP, DEKUBITUS, HAP) {
                $("#chartPPI").kendoChart({
                    title: {
                        text: "Pencapaian PPI"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: PLEBITIS,
                        name: "PLEBITIS",
                        color: "#035AFB",
                        axis: "persentase"
                    }, {
                        type: "line",
                        data: ISK,
                        name: "ISK",
                        color: "#FB5D03",
                        axis: "persentase"
                    }, {
                        type: "line",
                        data: IDO,
                        name: "IDO",
                        color: "#06C41A",
                        axis: "persentase"
                    }, {
                        type: "line",
                        data: VAP,
                        name: "VAP",
                        color: "#FF0000",
                        axis: "persentase"
                    }, {
                        type: "line",
                        data: IDO,
                        name: "IDO",
                        color: "#1AAEA9",
                        axis: "persentase"
                    }, {
                        type: "line",
                        data: IADP,
                        name: "IADP",
                        color: "#7400CE",
                        axis: "persentase"
                    }, {
                        type: "line",
                        data: DEKUBITUS,
                        name: "DEKUBITUS",
                        color: "#E803A3",
                        axis: "persentase"
                    }, {
                        type: "line",
                        data: HAP,
                        name: "HAP",
                        color: "#987601",
                        axis: "persentase"
                    }],
                    valueAxes: [{
                        name: "persentase",
                        title: { text: "Persentase Indikator" },
                        min: 0,
                        max: 100
                    }],
                    categoryAxis: {
                        categories: tglPPI,
                        // Align the first two value axes to the left
                        // and the last two to the right.
                        //
                        // Right alignment is done by specifying a
                        // crossing value greater than or equal to
                        // the number of categories.
                        axisCrossingValues: [0, 0, 10, 10]
                    }
                });
            }

            function createChartPPI(tglPPI, PLEBITIS, ISK, IDO, VAP, IADP, DEKUBITUS, HAP) {
                $("#chartPPI").kendoChart({
                    title: {
                        text: "Pencapaian PPI"
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        type: "line",
                        data: PLEBITIS,
                        name: "PLEBITIS",
                        color: "#ec5e0a",
                        axis: "persentase"
                    }, {
                        type: "line",
                        data: ISK,
                        name: "ISK",
                        color: "#4e4141",
                        axis: "persentase"
                    }, {
                        type: "line",
                        data: IDO,
                        name: "IDO",
                        color: "#3DFF00",
                        axis: "persentase"
                    }, {
                        type: "line",
                        data: VAP,
                        name: "VAP",
                        color: "#FFA700",
                        axis: "persentase"
                    }, {
                        type: "line",
                        data: IDO,
                        name: "IDO",
                        color: "#1AAEA9",
                        axis: "persentase"
                    }, {
                        type: "line",
                        data: IADP,
                        name: "IADP",
                        color: "#AB1AAE",
                        axis: "persentase"
                    }, {
                        type: "line",
                        data: DEKUBITUS,
                        name: "DEKUBITUS",
                        color: "#E803A3",
                        axis: "persentase"
                    }, {
                        type: "line",
                        data: HAP,
                        name: "HAP",
                        color: "#E80303",
                        axis: "persentase"
                    }],
                    valueAxes: [{
                        name: "persentase",
                        title: { text: "Persentase Indikator" },
                        min: 0,
                        max: 100
                    }],
                    categoryAxis: {
                        categories: tglPPI,
                        // Align the first two value axes to the left
                        // and the last two to the right.
                        //
                        // Right alignment is done by specifying a
                        // crossing value greater than or equal to
                        // the number of categories.
                        axisCrossingValues: [0, 0, 10, 10]
                    }
                });
            }
            // $scope.generateTableKahiji = function (e) {

            //     $scope.columnnss = [
            //         {
            //             "field": "no",
            //             "title": "<h3 align=center>No.<h3>",
            //             "width": "48px",
            //             "filterable": false,
            //             attributes: {
            //                 "class": "table-cell",
            //                 style: "text-align: center;"
            //             }
            //         },
            //         {
            //             "field": "indikator",
            //             "title": "<h3 align=center>Indikator<h3>",
            //             "width": "210px",
            //             "filterable": false,
            //             attributes: {
            //                 "class": "table-cell",
            //                 style: "text-align: left;"
            //             }
            //         },
            //         {
            //             "field": "ND",
            //             "title": "<h3 align=center>Numerator Dan Denominator<h3>",
            //             "width": "250px",
            //             "filterable": false,
            //             attributes: {
            //                 "class": "table-cell",
            //                 style: "text-align: left;"
            //             }
            //         },
            //         {
            //             "field": "keterangan",
            //             "title": "<h3 align=center>Keterangan<h3>",
            //             "width": "210px",
            //             "filterable": false,
            //             attributes: {
            //                 "class": "table-cell",
            //                 style: "text-align: left;"
            //             }
            //         },
            //         {
            //             "title": "<h3 align=center>" + $scope.getBulan() + "<h3>",
            //             "columns": $scope.createColumn222(),
            //             "filterable": false,
            //             attributes: {
            //                 "class": "table-cell",
            //                 style: "text-align: center;"
            //             }
            //             // title: $scope.getBulan(),
            //             // columns: $scope.createColumn(),
            //         },
            //         {
            //             "field": "total",
            //             "title": "<h3 align=center>Total<h3>",
            //             "width": "410px",
            //             "filterable": false,
            //             attributes: {
            //                 "class": "table-cell",
            //                 style: "text-align: left;"
            //             },
            //         },
            //         // {
            //         //     "field": "denum",
            //         //     "title": "<h3 align=center>Denum (B)<h3>",
            //         //     "width": "410px",
            //         //     "filterable": false,
            //         //     attributes: {
            //         //         "class": "table-cell",
            //         //         style: "text-align: left;"
            //         //     }
            //         // },
            //         // {
            //         //     "field": "capaian",
            //         //     "title": "<h3 align=center>Capaian (%)<h3>",
            //         //     "width": "410px",
            //         //     "filterable": false,
            //         //     attributes: {
            //         //         "class": "table-cell",
            //         //         style: "text-align: left;"
            //         //     }
            //         // }
            //     ]
            //     // $scope.mainGridLap = {
            //     //     selectable: "row",
            //     //     // dataBound: $scope.onDataBound,
            //     //     // change: onChange,
            //     //     columns: $scope.columnnss

            //     // }
            //     var result = e.data
            //     let sama = false
            //     var noMor = 0;
            //     let arrGroup = [];
            //     for (let i = 0; i < result.length; i++) {
            //         sama = false
            //         for (let x = 0; x < arrGroup.length; x++) {
            //             if (arrGroup[x].indikator == result[i].indikator && arrGroup[x].keterangan == result[i].keterangan) {
            //                 arrGroup[x].keterangan = result[i].keterangan
            //                 // arrGroup[x].total = parseFloat(result[i].nilai) + parseFloat(arrGroup[x].nilai)
            //                 var tgls = new Date(result[i].tgl).getDate().toString()
            //                 arrGroup[x]['date' + tgls] = result[i].nilai
            //                 sama = true;
            //             }
            //         }

            //         if (sama == false) {
            //             noMor += 1;
            //             var tgls = new Date(result[i].tgl).getDate().toString()
            //             let data = {
            //                 'no' :noMor,
            //                 'id' :result[i].id,
            //                 // 'nilai': result[i].nilai,
            //                 // 'numeratordenominator': result[i].numeratordenominator,
            //                 // 'keterangan': result[i].keterangan,
            //                 // 'indikator': result[i].indikator,
            //                 // [tgls]: result[i].nilai
            //                 'tglnilai': result[i].tglnilai,
            //                 'tgl': result[i].tgl,
            //                 'nilai': result[i].nilai,
            //                 'num': result[i].num,
            //                 'denum': result[i].denum,
            //                 'capaian': result[i].capaian,
            //                 'keterangan': result[i].keterangan,
            //                 'indikator': result[i].indikator,
            //                 'denominator': result[i].denominator,
            //                 'numerator': result[i].numerator,
            //                 'numeratordenominator': result[i].numeratordenominator,
            //                 ['date' + tgls]: result[i].nilai
            //             }
            //             arrGroup.push(data)
            //         }
            //     }


            //     var grid = $("#gridLap").data("kendoGrid");
            //     if (grid != undefined) {
            //         grid.destroy();
            //         // grid.gridLap( $scope.sourceJadwalBulanan);
            //         $("#gridLap").empty().kendoGrid({
            //             dataSource: $scope.sourceLaporan,
            //             columns: $scope.columnnss,
            //             // selectable: "cell",
            //             // dataBound: $scope.onDataBound,
            //             // options: $scope.mainGridOptionss
            //         });
            //     }

            //     debugger
            //     for (let x = 0; x < arrGroup.length; x++) {
            //         const element = arrGroup[x];
            //         var totalNum = 0
            //         for (let l = 0; l <= $scope.createColumn222().length; l++) {
            //             for (var key in element) {
            //                 if (element.hasOwnProperty(key)) {
            //                     if (key == "date" + l) {
            //                         totalNum = totalNum +parseFloat( element["date"+l])
            //                     }
            //                 }
            //             }
            //         }
            //         element.no = x + 1
            //         element.total = totalNum
            //     }



            //     $scope.sourceLaporan = new kendo.data.DataSource({
            //         data: arrGroup,
            //     });

            // }
            $scope.generateTable2 = function (e) {

                $scope.columnnss = [{
                    "field": "no",
                    "title": "<h3 align=center>No.<h3>",
                    "width": "48px",
                    "filterable": false,
                    "locked": true,
                    "lockable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: center;"
                    }
                },
                {
                    "field": "indikator",
                    "title": "<h3 align=center>Indikator<h3>",
                    "width": "210px",
                    "filterable": false,
                    "locked": true,
                    "lockable": false,
                    attributes: {
                        // "class": "table-cell",
                        style: "text-align: left;",
                        class: "#=flag != 'Y' ? 'red' : 'green' #"
                    }
                },
                {
                    "field": "ND",
                    "title": "<h3 align=center>Formula<h3>",
                    "width": "100px",
                    "filterable": false,
                    "locked": true,
                    "lockable": false,
                    attributes: {
                        // "class": "table-cell",
                        style: "text-align: left;",
                        class: "#=flag != 'Y' ? 'red' : 'green' #"
                    }
                },
                {
                    "field": "keterangan",
                    "title": "<h3 align=center>KeteranganL<h3>",
                    "width": "210px",
                    "filterable": false,
                    "locked": true,
                    "lockable": false,
                    attributes: {
                        // "class": "table-cell",
                        style: "text-align: left;",
                        class: "#=flag != 'Y' ? 'red' : 'green' #"
                    },
                    // attributes: {
                    //     class: "#=flag != 'N' ? 'red' : 'green' #"
                    // },
                },
                {
                    "title": "<h3 align=center>" + $scope.getBulan2() + "<h3>",
                    "columns": $scope.createColumn222(),
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: center;"
                    }
                    // title: $scope.getBulan(),
                    // columns: $scope.createColumn(),
                },
                {
                    "field": "total",
                    "title": "<h3 align=center>Total<h3>",
                    "width": "410px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: left;"
                    },
                },
                    // {
                    //     "field": "denum",
                    //     "title": "<h3 align=center>Denum (B)<h3>",
                    //     "width": "410px",
                    //     "filterable": false,
                    //     attributes: {
                    //         "class": "table-cell",
                    //         style: "text-align: left;"
                    //     }
                    // },
                    // {
                    //     "field": "capaian",
                    //     "title": "<h3 align=center>Capaian (%)<h3>",
                    //     "width": "410px",
                    //     "filterable": false,
                    //     attributes: {
                    //         "class": "table-cell",
                    //         style: "text-align: left;"
                    //     }
                    // }
                ]

                // $scope.mainGridOptionss = {
                //     selectable: "cell",
                //     dataBound: $scope.onDataBound,
                //     // change: onChange,
                //     columns: $scope.column

                // }
                $scope.columnnss
                $scope.mainGridLap
                // $scope.onDataBoundLap = null;
                $scope.sourceLaporan

                // komen yang ini dulyu
                $scope.mainGridLap = {
                    selectable: "cell",
                    dataBound: $scope.onDataBoundLap,
                    // selectable: "row",
                    // dataBound: $scope.onDataBound,
                    // change: onChange,
                    columns: $scope.columnnss

                }


                let result = e.data
                let noMor = 0;
                let sama = false
                arrGroup = [];
                for (let i = 0; i < result.length; i++) {
                    sama = false
                    for (let x = 0; x < arrGroup.length; x++) {
                        if (arrGroup[x].indikator == result[i].indikator && arrGroup[x].keterangan == result[i].keterangan) {
                            arrGroup[x].keterangan = result[i].keterangan
                            arrGroup[x].flag = result[i].flag
                            // arrGroup[x].total = parseFloat(result[i].nilai) + parseFloat(arrGroup[x].nilai)
                            let tgls = new Date(result[i].tgl).getDate().toString()
                            arrGroup[x]['date' + tgls] = result[i].nilai
                            sama = true;
                        }
                    }

                    if (sama == false) {
                        let tgls = new Date(result[i].tgl).getDate().toString()
                        let data = {
                            'no': noMor,
                            'id': result[i].ind_id,
                            'tglnilai': result[i].tglnilai,
                            'tgl': result[i].tgl,
                            'nilai': result[i].nilai,
                            'num': result[i].num,
                            'denum': result[i].denum,
                            'capaian': result[i].capaian,
                            'keterangan': result[i].keterangan,
                            'flag': result[i].flag,
                            'indikator': result[i].indikator,
                            'denominator': result[i].denominator,
                            'numerator': result[i].numerator,
                            'ND': result[i].ND,
                            'numeratordenominator': result[i].ND,
                            ['date' + tgls]: result[i].nilai
                        }
                        arrGroup.push(data)
                    }
                }


                var grid = $("#gridLap").data("kendoGrid");
                if (grid != undefined) {
                    grid.destroy();
                    $("#gridLap").empty().kendoGrid({
                        // $("#gridLap").data("kendoGrid").refresh();
                        dataSource: $scope.sourceLaporan,
                        columns: $scope.columnnss,
                        selectable: "cell",
                        dataBound: $scope.onDataBoundLap
                        // options: $scope.mainGridOptionss
                    });
                }

                for (let x = 0; x < arrGroup.length; x++) {
                    const element = arrGroup[x];
                    var totalNum = 0
                    for (let l = 0; l <= $scope.createColumn222().length; l++) {
                        for (var key in element) {
                            if (element.hasOwnProperty(key)) {
                                if (key == "date" + l) {
                                    totalNum = totalNum + parseFloat(element["date" + l])
                                }
                            }
                        }
                    }
                    element.no = x + 1
                    element.total = totalNum
                }

                $scope.sourceLaporan = new kendo.data.DataSource({
                    data: arrGroup,
                });

            }
            $scope.generateTable3 = function (e) {

                $scope.columnnsss = [{
                    "field": "no",
                    "title": "No.",
                    "width": "48px",
                    "filterable": false,
                    "locked": true,
                    "lockable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: center;"
                    }
                },
                {
                    "field": "indikator",
                    "title": "Indikator",
                    "width": "210px",
                    "filterable": false,
                    "locked": true,
                    "lockable": false,
                    attributes: {
                        // "class": "table-cell",
                        style: "text-align: left;",
                        // class: "#=flag != 'Y' ? 'red' : 'green' #"
                    }
                },
                {
                    "field": "ND",
                    "title": "Numerator Dan Denominator",
                    "width": "100px",
                    "filterable": false,
                    "locked": true,
                    "lockable": false,
                    attributes: {
                        // "class": "table-cell",
                        style: "text-align: left;",
                        // class: "#=flag != 'Y' ? 'red' : 'green' #"
                    }
                },
                {
                    "field": "keterangan",
                    "title": "Keterangan",
                    "width": "210px",
                    "filterable": false,
                    "locked": true,
                    "lockable": false,
                    attributes: {
                        // "class": "table-cell",
                        style: "text-align: left;",
                        // class: "#=flag != 'Y' ? 'red' : 'green' #"
                    },
                    // attributes: {
                    //     class: "#=flag != 'N' ? 'red' : 'green' #"
                    // },
                },
                {
                    "title": $scope.getBulan2(),
                    "columns": $scope.createColumn2222(),
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: center;"
                    }
                    // title: $scope.getBulan(),
                    // columns: $scope.createColumn(),
                },
                {
                    "field": "total",
                    "title": "Total",
                    "width": "410px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: left;"
                    },
                },
                    // {
                    //     "field": "denum",
                    //     "title": "<h3 align=center>Denum (B)<h3>",
                    //     "width": "410px",
                    //     "filterable": false,
                    //     attributes: {
                    //         "class": "table-cell",
                    //         style: "text-align: left;"
                    //     }
                    // },
                    // {
                    //     "field": "capaian",
                    //     "title": "<h3 align=center>Capaian (%)<h3>",
                    //     "width": "410px",
                    //     "filterable": false,
                    //     attributes: {
                    //         "class": "table-cell",
                    //         style: "text-align: left;"
                    //     }
                    // }
                ]

                // $scope.mainGridOptionss = {
                //     selectable: "cell",
                //     dataBound: $scope.onDataBound,
                //     // change: onChange,
                //     columns: $scope.column

                // }

                // $scope.mainGridLap = {
                //     selectable: "cell",
                //     dataBound: $scope.onDataBoundLap,
                //     // selectable: "row",
                //     // dataBound: $scope.onDataBound,
                //     // change: onChange,
                //     columns: $scope.columnnss
                // }
                $scope.sourceLaporans
                $scope.columnnsss,
                    $scope.onDataBoundLaps
                // $scope.mainGridLaps
                $scope.mainGridLaps = {

                    dataSource: {
                        data: dataGrid,
                        aggregate: [
                            { field: "totalTindakan", aggregate: "sum" },
                            { field: "pointQty", aggregate: "sum" }
                        ]
                    },
                    toolbar: [
                        "excel",
                    ],
                    excel: {
                        fileName: "laporanipcln.xlsx",
                        allPages: true,
                    },
                    excelExport: function (e) {
                        // var sheet = e.workbook.sheets[0];
                        // sheet.frozenRows = 2;
                        // sheet.mergedCells = ["A1:AK1"];
                        // sheet.name = "Orders";

                        // var myHeaders = [{
                        //     value:"Logbook " + $scope.item.pegawai.namaLengkap + $scope.item.pegawai.namaLengkap  + " ( Periode " + dateHelper.getFormatMonthPicker($scope.item.periode) +" )",
                        //     fontSize: 20,
                        //     textAlign: "center",
                        //     background:"#ffffff",
                        //  // color:"#ffffff"
                        // }];

                        // sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 70});
                    },
                    editable: false,
                    scrollable: true,


                    selectable: "row",
                    // dataBound: $scope.onDataBound,
                    // change: onChange,
                    columns: $scope.columnnsss

                }


                $scope.sourceLaporans = [];
                var result = e.data
                var noMor = 0;
                let sama = false
                arrGroup = [];
                for (let i = 0; i < result.length; i++) {
                    sama = false
                    for (let x = 0; x < arrGroup.length; x++) {
                        if (arrGroup[x].indikator == result[i].indikator && arrGroup[x].keterangan == result[i].keterangan) {
                            arrGroup[x].keterangan = result[i].keterangan
                            arrGroup[x].flag = result[i].flag
                            // arrGroup[x].total = parseFloat(result[i].nilai) + parseFloat(arrGroup[x].nilai)
                            var tgls = new Date(result[i].tgl).getDate().toString()
                            arrGroup[x]['date' + tgls] = result[i].nilai
                            sama = true;
                        }
                    }

                    if (sama == false) {
                        var tgls = new Date(result[i].tgl).getDate().toString()
                        let data = {
                            'no': noMor,
                            'id': result[i].ind_id,
                            'tglnilai': result[i].tglnilai,
                            'tgl': result[i].tgl,
                            'nilai': result[i].nilai,
                            'num': result[i].num,
                            'denum': result[i].denum,
                            'capaian': result[i].capaian,
                            'keterangan': result[i].keterangan,
                            'flag': result[i].flag,
                            'indikator': result[i].indikator,
                            'denominator': result[i].denominator,
                            'numerator': result[i].numerator,
                            'ND': result[i].ND,
                            'numeratordenominator': result[i].ND,
                            ['date' + tgls]: result[i].nilai
                        }
                        arrGroup.push(data)
                    }
                }


                var grid = $("#gridLaps").data("kendoGrid");
                if (grid != undefined) {
                    grid.destroy();
                    // grid.gridLaps( $scope.sourceJadwalBulanan);
                    $("#gridLaps").empty().kendoGrid({
                        dataSource: $scope.sourceLaporans,
                        toolbar: [
                            "excel",
                        ],
                        excel: {
                            fileName: "laporanipcln.xlsx",
                            allPages: true,
                        },
                        excelExport: function (e) { },
                        columns: $scope.columnnsss,
                        // dataSource: $scope.sourceLaporan,
                        // columns: $scope.columnnsss,
                        // selectable: "cell",
                        // dataBound: $scope.onDataBoundLap,
                        // options: $scope.mainGridOptionss
                    });
                }

                for (let x = 0; x < arrGroup.length; x++) {
                    const element = arrGroup[x];
                    var totalNum = 0
                    for (let l = 0; l <= $scope.createColumn2222().length; l++) {
                        for (var key in element) {
                            if (element.hasOwnProperty(key)) {
                                if (key == "date" + l) {
                                    totalNum = totalNum + parseFloat(element["date" + l])
                                }
                            }
                        }
                    }
                    element.no = x + 1
                    element.total = totalNum
                }

                $scope.sourceLaporans = new kendo.data.DataSource({
                    data: arrGroup,
                });

            }

            $scope.inputJadwal = function () {
                $scope.isInput = !$scope.isInput
                dataARR = Array();
                dataTea = Array();
                var bln = moment($scope.item.bulan).format('YYYY-MM');
                // if ($scope.isInput) {
                //     $scope.titleButton = 'Hide Input Edukasi'                    
                // } else { $scope.titleButton = 'Input Edukasi' }     
                var deptID = ""
                if ($scope.item.departemen != undefined) {
                    deptID = $scope.item.departemen.id
                }

                var idRuangan = ""
                if ($scope.item.ruangan != undefined) {
                    idRuangan = $scope.item.ruangan.id
                }
                // if ($scope.item.departemen != undefined) {

                // } else {
                //     window.messageContainer.error("Departemen Masih Kosong");
                // }
                datana = [];
                medifirstService.get("pmkp/get-data-indikator-departemen-pmkp?idDept=" + deptID + "&idRuangan=" + idRuangan + '&bln=' + bln).then(function (e) {
                    var datas = e.data.data
                    for (let i = 0; i < datas.length; i++) {
                        datas[i].no = i + 1;
                    }
                    datana.push(datas);
                    $scope.generateTable()
                });
            }


            $scope.compair = function () {
                $scope.popSynchronize.center().open();
                // $scope.isInput = !$scope.isInput
                // dataARR = Array();
                // dataTea =Array();
                // var bln = moment($scope.item.bulan).format('YYYY-MM');
                // // if ($scope.isInput) {
                // //     $scope.titleButton = 'Hide Input Edukasi'                    
                // // } else { $scope.titleButton = 'Input Edukasi' } 

                // var deptID = "16" 
                // // if ($scope.item.departemen != undefined) {
                // //     deptID = $scope.item.departemen.id
                // // } else {
                // // 	toastr.warning('Pilih Departemen Terlebih Dahulu');
                // // 	return
                // // }
                // synchronize(16);

                // var idRuangan = ""
                // if($scope.item.ruangan != undefined) {
                //     idRuangan = $scope.item.ruangan.id
                // }
                // // if ($scope.item.departemen != undefined) {

                // // } else {
                // //     window.messageContainer.error("Departemen Masih Kosong");
                // // }
                // datana =[];

                // medifirstService.get("pmkp/get-data-indikator-departemen-pmkp?idDept=" + deptID + "&idRuangan=" + idRuangan + '&bln=' + bln).then(function (e) {
                //     var datas = e.data.data
                //     for (let i = 0; i < datas.length; i++) {
                //         datas[i].no = i + 1;
                //     }
                //     datana.push(datas);
                //     $scope.generateTable()
                // });
            }

            $scope.synchronous = function () {
                let month = moment($scope.item.first).format('YYYY-MM');
                let first = moment($scope.item.first).format('DD');
                let last = moment($scope.item.last).format('DD');
                sync(parseInt(first), parseInt(last), month)
            }


            function synchronize(e, last, month) {
                if (e > last) {
                    // $scope.isRouteLoading = false;
                    // $scope.popSynchronize.center().close();
                    // $scope.cariLaporan();
                    // break;
                } else {
                    // sync(e+1, last, month);
                    setTimeout(function () { sync(e + 1, last, month); }, 0);
                }
                $scope.isRouteLoading = true;
                let a = e.toString();
                // const month = moment($scope.item.bulan).format('YYYY-MM');
                const deptID = "16"
                let date
                let idRuangan = ""
                if ($scope.item.ruangan != undefined) {
                    idRuangan = $scope.item.ruangan.id
                }
                if (a.length === 1) {
                    date = `0${a}`;
                } else {
                    date = `${a}`;
                }

                let tgl = moment(month).format(`YYYY-MM-${date}`);
                let tglawal = moment(month).format(`YYYY-MM-${date} 00:00:00`);
                let tglakhir = moment(month).format(`YYYY-MM-${date} 23:59:59`);


                // const ppi = [88, 89, 90, 91, 92];
                // for (const iteratorPpi of ppi) {
                //     medifirstService.get("pmkp/get-ppi?idDept=" + deptID + "&idRuangan=" + idRuangan + '&bln=' + month + '&tgl=' + tgl + '&tglawal=' + tglawal + '&tglakhir=' + tglakhir + '&indikator=' + iteratorPpi).then(function (e) { });
                // }

                medifirstService.get("pmkp/get-ppi?idDept=" + deptID + "&idRuangan=" + idRuangan + '&bln=' + month + '&tgl=' + tgl + '&tglawal=' + tglawal + '&tglakhir=' + tglakhir).then(function (e) { });

                // const indikator_manual = [50, 96, 97, 98, 99, 101, 102, 104, 111, 114, 115, 122];
                // for (const iterator of indikator_manual) {
                //     medifirstService.get("pmkp/get-indikator-manual?idDept=" + deptID + "&idRuangan=" + idRuangan + '&bln=' + month + '&tgl=' + tgl + '&tglawal=' + tglawal + '&tglakhir=' + tglakhir + '&indikatorfk=' + iterator).then(function (e) { });
                // }
                medifirstService.get("pmkp/get-indikator-manual?idDept=" + deptID + "&idRuangan=" + idRuangan + '&bln=' + month + '&tgl=' + tgl + '&tglawal=' + tglawal + '&tglakhir=' + tglakhir).then(function (e) { });

                medifirstService.get("pmkp/get-kepatuhan-jam-visit-dokter-spesialis?idDept=" + deptID + "&idRuangan=" + idRuangan + '&bln=' + month + '&tgl=' + tgl + '&tglawal=' + tglawal + '&tglakhir=' + tglakhir).then(function (e) { });

                medifirstService.get("pmkp/get-angka-perawatan-ulang?idDept=" + deptID + "&idRuangan=" + idRuangan + '&bln=' + month + '&tgl=' + tgl + '&tglawal=' + tglawal + '&tglakhir=' + tglakhir).then(function (e) { });

                medifirstService.get("pmkp/get-kejadian-pulang-atas-permintaan-sendiri?idDept=" + deptID + "&idRuangan=" + idRuangan + '&bln=' + month + '&tgl=' + tgl + '&tglawal=' + tglawal + '&tglakhir=' + tglakhir).then(function (e) { });

                medifirstService.get("pmkp/get-kesalahan-diit-pasien?idDept=" + deptID + "&idRuangan=" + idRuangan + '&bln=' + month + '&tgl=' + tgl + '&tglawal=' + tglawal + '&tglakhir=' + tglakhir).then(function (e) { });

                // medifirstService.get("pmkp/get-kejadian-reaksi-tranfusi?idDept=" + deptID + "&idRuangan=" + idRuangan + '&bln=' + month + '&tgl=' + tgl + '&tglawal=' + tglawal + '&tglakhir=' + tglakhir).then(function (e) { });

                medifirstService.get("pmkp/get-ketidak-lengkapan-laporan-anestesi?idDept=" + deptID + "&idRuangan=" + idRuangan + '&bln=' + month + '&tgl=' + tgl + '&tglawal=' + tglawal + '&tglakhir=' + tglakhir).then(function (e) { });

                medifirstService.get("pmkp/get-ketidak-lengkapan-laporan-operasi?idDept=" + deptID + "&idRuangan=" + idRuangan + '&bln=' + month + '&tgl=' + tgl + '&tglawal=' + tglawal + '&tglakhir=' + tglakhir).then(function (e) { });

                medifirstService.get("pmkp/get-sisa-makanan-siang-non-diit?idDept=" + deptID + "&idRuangan=" + idRuangan + '&bln=' + month + '&tgl=' + tgl + '&tglawal=' + tglawal + '&tglakhir=' + tglakhir).then(function (e) { });

                // medifirstService.get("pmkp/get-proporsi-pasien-tb-paru-terkonfirmasi-bakteriologis?idDept=" + deptID + "&idRuangan=" + idRuangan + '&bln=' + month + '&tgl=' + tgl + '&tglawal=' + tglawal + '&tglakhir=' + tglakhir).then(function (e) { });

                // medifirstService.get("pmkp/get-iadp?idDept=" + deptID + "&idRuangan=" + idRuangan + '&bln=' + month + '&tgl=' + tgl + '&tglawal=' + tglawal + '&tglakhir=' + tglakhir).then(function (e) { });


                const ppis = [94, 93];
                for (const iteratorPpis of ppis) {
                    medifirstService.get("pmkp/get-hap-and-dekubitus?idDept=" + deptID + "&idRuangan=" + idRuangan + '&bln=' + month + '&tgl=' + tgl + '&tglawal=' + tglawal + '&tglakhir=' + tglakhir + '&indikator=' + iteratorPpis).then(function (e) { });
                }

            }

            function sync(e, last, month) {
                if (e > last) {
                    $scope.isRouteLoading = false;
                    $scope.popSynchronize.center().close();
                    $scope.cariLaporan();
                } else {
                    setTimeout(function () { synchronize(e, last, month); }, 0);
                }
            }



            $scope.Hide = function () {
                $scope.isInput = false;
                $scope.sourceJadwalBulanan = new kendo.data.DataSource({
                    data: [],
                });
                $scope.item.departemen = undefined;
            }

            $scope.generateTable = function () {
                $scope.column = [{
                    "field": "no",
                    "title": "<h3 align=center>No.<h3>",
                    "width": "48px",
                    "filterable": false,
                    "locked": true,
                    "lockable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: center;"
                    }
                },
                {
                    "field": "indikator",
                    "title": "<h3 align=center>Indikator<h3>",
                    "width": "210px",
                    "locked": true,
                    "lockable": false,
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: left;"
                    }
                },
                {
                    "field": "numeratordenominator",
                    "title": "<h3 align=center>Numerator Dan Denominator<h3>",
                    "width": "100px",
                    "locked": true,
                    "lockable": false,
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: left;"
                    }
                },
                {
                    "field": "keterangan",
                    "title": "<h3 align=center>Keterangan<h3>",
                    "width": "210px",
                    "locked": true,
                    "lockable": false,
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: left;"
                    }
                },
                {
                    // numeratordenominator
                    "title": "<h3 align=center>" + $scope.getBulan() + "<h3>",
                    "columns": $scope.createColumn(),
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: center;"
                    }
                    // title: $scope.getBulan(),
                    // columns: $scope.createColumn(),
                },
                    // {
                    //     "field": "num",
                    //     "title": "<h3 align=center>NUM (A)<h3>",
                    //     "width": "410px",
                    //     "filterable": false,
                    //     attributes: {
                    //         "class": "table-cell",
                    //         style: "text-align: left;"
                    //     },
                    // },
                    // {
                    //     "field": "denum",
                    //     "title": "<h3 align=center>Denum (B)<h3>",
                    //     "width": "410px",
                    //     "filterable": false,
                    //     attributes: {
                    //         "class": "table-cell",
                    //         style: "text-align: left;"
                    //     }
                    // },
                    // {
                    //     "field": "capaian",
                    //     "title": "<h3 align=center>Capaian (%)<h3>",
                    //     "width": "410px",
                    //     "filterable": false,
                    //     attributes: {
                    //         "class": "table-cell",
                    //         style: "text-align: left;"
                    //     }
                    // }
                ]
                $scope.mainGridOptionss = {
                    selectable: "cell",
                    dataBound: $scope.onDataBound,
                    // change: onChange,
                    columns: $scope.column

                }

                var grid = $("#gridBulan").data("kendoGrid");
                if (grid != undefined) {
                    grid.destroy();
                    // grid.setDataSource( $scope.sourceJadwalBulanan);
                    $("#gridBulan").empty().kendoGrid({
                        dataSource: $scope.sourceJadwalBulanan,
                        columns: $scope.column,
                        selectable: "cell",
                        //dipaman
                        dataBound: $scope.onDataBound,
                        // options: $scope.mainGridOptionss
                    });
                }
                for (let i = 0; i < datana[0].length; i++) {
                    const element = datana[0][i];
                    element.listTgl = []
                    element.detail = [];

                }
                dataARR = Array();
                dataARR = datana[0]
                $scope.kuntul = datana[0]



                var result = datana[0]
                var noMor = 0;
                let sama = false
                arrGroup = [];
                for (let i = 0; i < result.length; i++) {
                    sama = false

                    for (let x = 0; x < arrGroup.length; x++) {
                        if (arrGroup[x].indikator == result[i].indikator && arrGroup[x].keterangan == result[i].keterangan) {
                            arrGroup[x].keterangan = result[i].keterangan
                            // arrGroup[x].total = parseFloat(result[i].nilai) + parseFloat(arrGroup[x].nilai)
                            var tgls = new Date(result[i].tgl).getDate().toString()
                            arrGroup[x][tgls] = result[i].nilai
                            sama = true;
                        }
                    }
                    // head.id, head.indikator, head.denominator, head.numerator, 'DENUM' AS numeratordenominator, head.denominator AS keterangan, head.nourut, CASE WHEN sm.keterangan = 'DENUM' THEN SUM(CAST(sm.nilai AS INT)) 
                    // ELSE 0 END AS nilai
                    if (sama == false) {
                        noMor = noMor + 1;
                        var tgls = new Date(result[i].tgl).getDate().toString()
                        let data = {
                            'no': noMor,
                            'id': result[i].id,
                            'nilai': result[i].nilai,
                            'numeratordenominator': result[i].numeratordenominator,
                            'keterangan': result[i].keterangan,
                            'indikator': result[i].indikator,
                            [tgls]: result[i].nilai
                        }
                        arrGroup.push(data)
                    }
                }


                $scope.sourceJadwalBulanan = new kendo.data.DataSource({
                    data: arrGroup,
                });



            }

            $scope.bulanSelected = moment($scope.item.bulan).format("MMMM YYYY")

            $scope.getBulan = function () {
                $scope.bulanString = moment($scope.item.bulan).format("MMMM YYYY")
                return $scope.bulanString;
            }
            $scope.getBulan2 = function () {
                $scope.bulanString = moment($scope.item2.bulan).format("MMMM YYYY")
                return $scope.bulanString;
            }

            function getHeader() {
                var kolomTitle = "Capaian : " + DateHelper.getBulanFormatted(new Date($scope.item.bulan));
                return kolomTitle;
            }

            $scope.createColumn = function () {
                var year = parseInt(moment($scope.item.bulan).format("Y"))
                var month = parseInt(moment($scope.item.bulan).format("M"))
                var tempDate = new Date(year, month, 0);

                var list = [];

                for (var i = 0; i < tempDate.getDate(); i++) {
                    var data = {
                        field: "[" + (i + 1) + "]",
                        title: (i + 1).toString(),
                        format: "{0:n1}",
                        width: "50px"
                    };

                    list.push(data);
                }

                return list;
            }
            $scope.createColumn222 = function () {
                var year = parseInt(moment($scope.item2.bulan).format("Y"))
                var month = parseInt(moment($scope.item2.bulan).format("M"))
                var tempDate = new Date(year, month, 0);

                var list = [];

                for (var i = 0; i < tempDate.getDate(); i++) {
                    var data = {
                        field: "date" + (i + 1),
                        title: (i + 1).toString(),
                        format: "{0:n1}",
                        width: "50px"
                    };

                    list.push(data);
                }

                return list;

            }

            $scope.createColumn2222 = function () {
                var year = parseInt(moment($scope.item2.bulan).format("Y"))
                var month = parseInt(moment($scope.item2.bulan).format("M"))
                var tempDate = new Date(year, month, 0);

                var list = [];

                for (var i = 0; i < tempDate.getDate(); i++) {
                    var data = {
                        field: "date" + (i + 1),
                        title: (i + 1).toString(),
                        format: "{0:n1}",
                        width: "50px"
                    };

                    list.push(data);
                }

                return list;

            }

            $scope.addDokter = function (bool, data) {
                var index = $scope.arrDokter.indexOf(data);
                if (_.filter($scope.arrDokter, {
                    id: data.id
                }).length === 0 && bool)

                    $scope.arrDokter.push(data);
                else
                    $scope.arrDokter.splice(index, 1);
            }

            var ahUap = 0;
            $scope.onDataBound = function (e) {
                $scope.selectedData.id
                data_head = [];
                var grid = $("#gridBulan").data("kendoGrid");
                $(grid.tbody).on("click", "td", function (e) {
                    var row = $(this).closest("tr");
                    var colIdx = $("td", row).index(this);
                    var num = 0;
                    var denum = 0;
                    var capaian = 0;
                    data_head = [];
                    $scope.selectedData = grid.dataItem(row);
                    if (colIdx >= 0) {
                        var person = prompt("Masukan Nilai Sensus", "");
                        if (person != null) {
                            e.currentTarget.innerText = person
                            var colDateIdx = colIdx - 3;
                            if (colIdx > 33) {
                                var colMain = colIdx - 32
                                var colReal = 0;
                                if (colMain == 4) {
                                    colReal = colMain + 1
                                } else if (colMain == 3) {
                                    colReal = colMain + 2
                                } else if (colMain == 2) {
                                    colReal = colMain + 3
                                } else {
                                    colReal = colMain
                                }
                                var columns = grid.options.columns[colReal].title;
                                var field = grid.options.columns[colReal].field;
                                if (field == "num") {
                                    var totNum = 0;
                                    num = e.currentTarget.innerText
                                    $scope.numerator = parseFloat(totNum) + parseFloat(num)
                                } else if (field == "denum") {
                                    var totDen = 0;
                                    denum = e.currentTarget.innerText
                                    $scope.denumerator = parseFloat(totDen) + parseFloat(denum)
                                } else if (field == "capaian") {
                                    var totCap = 0;
                                    capaian = e.currentTarget.innerText
                                    $scope.Capaian = parseFloat(totCap) + parseFloat(capaian)
                                }
                            }
                        }
                        var colName = $('#gridBulan tr').eq(1).find('th').eq(colDateIdx).text();
                        if (colName.length == 1) {
                            colName = "0" + colName;
                        }
                        if (colName.length <= 3) {
                            // var date = dateHelper.getFormatMonthPicker($scope.item.bulan) + "-" + colName;  
                            var tgl = dateHelper.getFormatMonthPicker($scope.item.bulan);
                            var Tglset = "";
                            var tglTea = colDateIdx
                            if (tglTea.toString().length > 1) {
                                Tglset = colDateIdx
                            } else {
                                Tglset = '0' + colDateIdx
                            }
                            // $scope.selectedData.listTgl = dateHelper.getFormatMonthPicker($scope.item.bulan) + "-" + Tglset;
                            var date = null;
                            if (colDateIdx <= 31) {
                                var date = dateHelper.getFormatMonthPicker($scope.item.bulan) + "-" + Tglset //$scope.selectedData.listTgl
                            }
                            var date2 = null;
                                let jam = new Date().getHours();
                                let menit = new Date().getMinutes();
                                let detik = new Date().getSeconds();
                                debugger
                                if (colDateIdx <= 31) {
                                    var date2 = dateHelper.getFormatMonthPicker($scope.item2.bulan) + "-" + Tglset +" "+jam+":"+menit+":"+detik //$scope.selectedData.listTgl
                                }
                            $scope.pushKeArray($scope.selectedData.no, norecSasaran, $scope.selectedData.id, $scope.selectedData.indikator, $scope.selectedData.listTgl, date, date2, e.currentTarget.innerText, num, denum, capaian, $scope.selectedData.keterangan, $scope.selectedData.numeratordenominator);
                        }
                    }
                });
            }

            var ahUapLap = 0;
            $scope.onDataBoundLap = function (e) {
                if (satu === true) {
                    satu = false;
                    $scope.selectedData.id
                    data_head = [];
                    var grid
                    this
                    grid = $("#gridLap").data("kendoGrid");
                    $(grid.tbody).on("click", "td", function (e) {
                        var row = $(this).closest("tr");
                        var colIdx = $("td", row).index(this);
                        var num = 0;
                        var denum = 0;
                        var capaian = 0;
                        data_head = [];
                        $scope.selectedData = grid.dataItem(row);
                        if ($scope.selectedData.flag == 'Y') {
                            toastr.error("Data Tidak Bisa diUbah");
                            return
                        }
                        if ($scope.item2.ruangan === undefined || $scope.item2.ruangan === null) {
                            toastr.error("Pilih Ruangan Terlebih Dahulu, Lalu Klik Cari, Jika Ingin Merubah Nilai");
                            return
                        }
                        if (colIdx >= 0) {
                            var person = prompt("Masukan Nilai Sensus", "");
                            if (person != null) {
                                e.currentTarget.innerText = person
                                var colDateIdx = colIdx + 1;
                                if (colIdx > 33) {
                                    var colMain = colIdx - 32
                                    var colReal = 0;
                                    if (colMain == 4) {
                                        colReal = colMain + 1
                                    } else if (colMain == 3) {
                                        colReal = colMain + 2
                                    } else if (colMain == 2) {
                                        colReal = colMain + 3
                                    } else {
                                        colReal = colMain
                                    }
                                    var columns = grid.options.columns[colReal].title;
                                    var field = grid.options.columns[colReal].field;
                                    if (field == "num") {
                                        var totNum = 0;
                                        num = e.currentTarget.innerText
                                        $scope.numerator = parseFloat(totNum) + parseFloat(num)
                                    } else if (field == "denum") {
                                        var totDen = 0;
                                        denum = e.currentTarget.innerText
                                        $scope.denumerator = parseFloat(totDen) + parseFloat(denum)
                                    } else if (field == "capaian") {
                                        var totCap = 0;
                                        capaian = e.currentTarget.innerText
                                        $scope.Capaian = parseFloat(totCap) + parseFloat(capaian)
                                    }
                                }
                            }
                            let colName
                            if (colDateIdx === 1) {
                                colName = "";
                            } else {
                                colName = $('#gridLap tr').eq(1).find('th').eq(colDateIdx).text();
                            }
                            if (colName.length == 1) {
                                colName = "0" + colName;
                            }
                            if (colName.length <= 3) {
                                // var date = dateHelper.getFormatMonthPicker($scope.item.bulan) + "-" + colName;  
                                var tgl = dateHelper.getFormatMonthPicker($scope.item.bulan);
                                var Tglset = "";
                                var tglTea = colDateIdx
                                if (tglTea.toString().length > 1) {
                                    Tglset = colDateIdx
                                } else {
                                    Tglset = '0' + colDateIdx
                                }
                                // $scope.selectedData.listTgl = dateHelper.getFormatMonthPicker($scope.item.bulan) + "-" + Tglset;
                                var date = null;
                                if (colDateIdx <= 31) {
                                    var date = dateHelper.getFormatMonthPicker($scope.item.bulan) + "-" + Tglset //$scope.selectedData.listTgl
                                }
                                var date2 = null;
                                let jam = new Date().getHours();
                                let menit = new Date().getMinutes();
                                let detik = new Date().getSeconds();
                                debugger
                                if (colDateIdx <= 31) {
                                    var date2 = dateHelper.getFormatMonthPicker($scope.item2.bulan) + "-" + Tglset +" "+jam+":"+menit+":"+detik //$scope.selectedData.listTgl
                                }
                                $scope.pushKeArray($scope.selectedData.no, norecSasaran, $scope.selectedData.id, $scope.selectedData.indikator, $scope.selectedData.listTgl, date, date2, e.currentTarget.innerText, num, denum, capaian, $scope.selectedData.keterangan, $scope.selectedData.numeratordenominator);
                            }
                        }
                    });
                }
            }

            $scope.batal = function () {
                $scope.item.jumlahPengunjung = undefined;
            }
            $scope.unVerifPopUp = function () {
                if ($scope.item2.departemen == undefined) {
                    toastr.error('Departemen Tidak Boleh Kosong')
                    return
                }
                if ($scope.item2.ruangan == undefined) {
                    toastr.error('Ruangan Tidak Boleh Kosong')
                    return
                }
                $scope.popUpCetak.center().open();
            }
            $scope.verif = function () {

                if ($scope.item2.departemen == undefined) {
                    toastr.error('Departemen Tidak Boleh Kosong')
                    return
                }
                if ($scope.item2.ruangan == undefined) {
                    toastr.error('Ruangan Tidak Boleh Kosong')
                    return
                }

                var date = moment($scope.item.bulan).format('YYYY-MM'); //$scope.selectedData.listTgl

                var data = {

                    'departemenfk': $scope.item2.departemen != undefined ? $scope.item2.departemen.id : null,
                    'ruanganfk': $scope.item2.ruangan != undefined ? $scope.item2.ruangan.id : null,
                    'tgl': date,
                    'status': 1,
                }
                medifirstService.post('pmkp/save-data-sasaran-verif', data).then(function (e) {
                    // searchData()
                })
            }
            $scope.unVerif = function () {
                var date = moment($scope.item.bulan).format('YYYY-MM');
                if ($scope.item.password != "BUKA") {
                    toastr.error('password salah')
                    return
                }



                var data = {

                    'departemenfk': $scope.item2.departemen != undefined ? $scope.item2.departemen.id : null,
                    'ruanganfk': $scope.item2.ruangan != undefined ? $scope.item2.ruangan.id : null,
                    'tgl': date,
                    'status': 0,
                }
                medifirstService.post('pmkp/save-data-sasaran-verif', data).then(function (e) {
                    // searchData()
                })
            }

            $scope.pushKeArray = function (no, norec, id, indikator, list, date, date2, isi, num, denum, capaian, keterangan, ND) {
                for (let i = 0; i < arrGroup.length; i++) {
                    const element = arrGroup[i];
                    if (isi == '') {
                        if (element.id == id && element.keterangan == keterangan) {
                            for (let e = 0; e < element.listTgl.length; e++) {
                                // const element2 = element.listTgl[e];
                                if (element.listTgl[e] == date) {
                                    element.listTgl.splice([e])
                                }
                            }

                        }
                    } else {
                        if (element.id == id && element.keterangan == keterangan) {
                            // element.listTgl.push(date);
                            // var data = {
                            //     'norecSasaran': norec,
                            //     'isi': isi,
                            //     'tglnilai': date,
                            //     'tgl': date,
                            //     'num': num,
                            //     'denum': denum,
                            //     'capaian': capaian
                            // }
                            // element.detail.push(data)
                            // for (var o = dataARR.length - 1; o >= 0; o--) {
                            // if (element.id == id) {
                            var data = {
                                'indikatorfk': id,
                                'norecSasaran': norec,
                                'isi': isi,
                                'tglnilai': date2,
                                'tgl': date2,
                                'num': num,
                                'denum': denum,
                                'capaian': capaian,
                                'keterangan': keterangan,
                                
                            }
                            dataTea.push(data);
                            // dataARR[o].norec = norecSasaran;
                            // dataARR[o].isi = isi;                                   
                            // dataARR[o].listTgl = date;
                            // dataARR[o].tglnilai = date;
                            // dataARR[o].num = num;
                            // dataARR[o].denum = denum;
                            // dataARR[o].capaian = capaian;
                            // }
                            // }
                            // dataTea.push(dataARR);                   
                        }
                    }
                }
                console.log(dataTea)
            }

            $scope.save = function () {
                if ($scope.item2.departemen == undefined) {
                    toastr.error('Departemen Tidak Boleh Kosong')
                    return
                }
                var data2 = []
                // var isi = ' ';                
                // for (let i = 0; i < dataARR.length; i++) {
                //     for (let j = 0; j < dataARR[i].listTgl.length; j++) {
                //         for (let k = 0; k < dataARR[i].detail.length; j++) {
                //             data2.push({
                //                 'tgl': dataARR[i].listTgl[j],
                //                 'detail': dataARR[i].detail[k],
                //                 'indikatorfk': dataARR[i].id,
                //             })
                //         }
                //     }
                // }
                if (dataTea == undefined || dataTea.length == 0) {
                    // data2.push(dataTea);
                    toastr.error('Data Tidak Boleh Kosong')
                    return
                }
                var objSave = {
                    'departemenfk': $scope.item2.departemen != undefined ? $scope.item2.departemen.id : null,
                    'ruanganfk': $scope.item2.ruangan != undefined ? $scope.item2.ruangan.id : null,
                    'capaian': $scope.Capaian != undefined ? $scope.Capaian : 0,
                    'denumerator': $scope.denumerator != undefined ? $scope.denumerator : 0,
                    'numerator': $scope.numerator != undefined ? $scope.numerator : 0,
                    'data': dataTea
                }
                medifirstService.post('pmkp/save-data-sasaran-mutu', objSave).then(function (e) {
                    // $scope.cariLaporan()
                    // $state.go('SensusHarianMutu', {
                    //     // noRec: dataItem.norec,
                    //     // emr: "SensusHarianMutu",
                    // });
                })
            }

            function searchData() {
                dataTea = Array();
                var bln = moment($scope.item.bulan).format('YYYY-MM')
                var idDept = ''
                if ($scope.item.departemen != undefined) {
                    idDept = '&idDept=' + $scope.item.departemen.id
                }
                $scope.isRouteLoading = true;
                //'pmkp/get-data-sasaran-mutu?bulan=' + bln + idDept
                //pmkp/get-data-indikator-departemen?" + "idDept=" + $scope.item.Departemen.value             
                medifirstService.get('pmkp/get-data-indikator-departemen?' + idDept + '&bln=' + bln).then(function (e) {
                    $scope.isRouteLoading = false;
                    dataGrid = e.data.data;
                    for (let i = 0; i < dataGrid.length; i++) {
                        dataGrid[i].no = i + 1;
                    }

                    $("#gridOrder").kendoGrid({
                        dataSource: {
                            data: dataGrid,
                        },
                        toolbar: [
                            "excel",
                        ],
                        excel: {
                            fileName: "sensushariansasaranmutu.xlsx",
                            allPages: true,
                        },
                        excelExport: function (e) { },
                        editable: false,
                        scrollable: true,
                        selectable: "row",
                        columns: [{
                            "field": "no",
                            "title": "<h3 align=center>NO<h3>",
                            "width": "50px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            }
                        },
                        {
                            "field": "indikator",
                            "title": "<h3 align=center>Indikator<h3>",
                            "width": "600px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            }
                        },
                        {
                            "field": "keterangan",
                            "title": "<h3 align=center>Keterangan<h3>",
                            "width": "600px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            }
                        },
                        {
                            "title": "<h3 align=center>Tanggal<h3>",
                            "columns": $scope.createColumn(),
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: center;"
                            }
                        },
                        {
                            "field": "num",
                            "title": "<h3 align=center>NUM (A)<h3>",
                            "width": "410px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            },
                        },
                        {
                            "field": "denum",
                            "title": "<h3 align=center>Denum (B)<h3>",
                            "width": "410px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            }
                        },
                        {
                            "field": "capaian",
                            "title": "<h3 align=center>Capaian (%)<h3>",
                            "width": "410px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            }
                        }
                        ]
                    })

                    $scope.dataSource = new kendo.data.DataSource({
                        data: dataGrid,
                        total: dataGrid.length,
                        // group: { field: "jeniskeselamatan" },
                        schema: {
                            model: {}
                        }
                    });
                    GetLaporan();
                })
            }

            function GetLaporan() {
                var bln = moment($scope.item.bulan).format('MM.YYYY')
                var idDept = ''
                if ($scope.item.departemen != undefined) {
                    idDept = '&idDept=' + $scope.item.departemen.value
                }
                $scope.isRouteLoading = false;
                medifirstService.get('pmkp/get-data-sasaran-mutu?bulan=' + bln + idDept).then(function (e) {
                    $scope.datasSearch = e.data
                    for (var i = $scope.datasSearch.length - 1; i >= 0; i--) {
                        $scope.datasSearch[i].no = i + 1
                        if (parseFloat($scope.datasSearch[i].nilai) != 0) {
                            $scope.datasSearch[i].isian = parseFloat($scope.datasSearch[i].nilai)
                        } else {
                            $scope.datasSearch[i].isian = 0
                        }
                    }

                    if (!$scope.datasSearch) {
                        return toastr.success('Data tidak ditemukan', 'Info');
                    };

                    var Data = e.data.data;
                    var Datas = $scope.dataSource._data
                    $scope.datasSearch.forEach(function (element) {
                        var customData = {};
                        for (var key in element) {
                            switch (key) {
                                case "tgl":
                                    var tgl = element.tgl;
                                    var key = tgl.slice(-1);
                                    if (key[0] === "0") {
                                        customData[key] = element.isian;
                                    } else {
                                        customData[key] = element.isian;
                                    }
                                    break;
                                default:
                                    customData[key] = element[key];
                                    break;
                            }
                        };
                        dataGrid.push(customData);
                    });

                    $scope.mainGridOption = {
                        // $("#gridOrder").kendoGrid({
                        dataSource: {
                            data: dataGrid,

                        },
                        toolbar: [
                            "excel",
                        ],
                        excel: {
                            fileName: "sensushariansasaranmutu.xlsx",
                            allPages: true,
                        },
                        excelExport: function (e) { },
                        editable: false,
                        scrollable: true,
                        selectable: "row",
                        // sortable: true,
                        columns: [{
                            "field": "no",
                            "title": "<h3 align=center>NO<h3>",
                            "width": "50px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            }
                        },
                        {
                            "field": "keselamatan",
                            "title": "<h3 align=center>Insiden Keselamatan Pasien<h3>",
                            "width": "600px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            }
                        },
                        {
                            "field": "isian",
                            "title": "<h3 align=center>Tanggal<h3>",
                            "columns": $scope.createColumn(),
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: center;"
                            }
                        }, ,
                        {
                            "field": "num",
                            "title": "<h3 align=center>NUM (A)<h3>",
                            "width": "410px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            },
                        },
                        {
                            "field": "denum",
                            "title": "<h3 align=center>Denum (B)<h3>",
                            "width": "410px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            }
                        },
                        {
                            "field": "capaian",
                            "title": "<h3 align=center>Capaian (%)<h3>",
                            "width": "410px",
                            "filterable": false,
                            attributes: {
                                "class": "table-cell",
                                style: "text-align: left;"
                            }
                        }
                        ]
                    }
                    $scope.dataSource = new kendo.data.DataSource({
                        data: dataGrid,
                    });
                });
            }

            var timeoutPromise;
            $scope.$watch('item.cariDokters', function (newVal, oldVal) {
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter("namalengkap", newVal)
                    }
                }, 500)
            })

            $scope.cariDokterGrid = function () {
                applyFilter("namalengkap", $scope.item.cariDokters)
            }

            function applyFilter(filterField, filterValue) {
                var dataGrid = $("#kGrid").data("kendoGrid");
                var currFilterObject = dataGrid.dataSource.filter();
                var currentFilters = currFilterObject ? currFilterObject.filters : [];

                if (currentFilters && currentFilters.length > 0) {
                    for (var i = 0; i < currentFilters.length; i++) {
                        if (currentFilters[i].field == filterField) {
                            currentFilters.splice(i, 1);
                            break;
                        }
                    }
                }

                if (filterValue.id) {
                    currentFilters.push({
                        field: filterField,
                        operator: "eq",
                        value: filterValue.id
                    });
                } else {
                    currentFilters.push({
                        field: filterField,
                        operator: "contains",
                        value: filterValue
                    })
                }

                dataGrid.dataSource.filter({
                    logic: "and",
                    filters: currentFilters
                })
            }

            $scope.resetFilter = function () {
                var dataGrid = $("#kGrid").data("kendoGrid");
                dataGrid.dataSource.filter({});
                delete $scope.item.cariDokters;
            }

            $scope.hapusJadwal = function () {
                if ($scope.selectedData.length == 0) {
                    toastr.error('Ceklis data yang mau dihapus')
                    return
                }
                var json = {
                    'data': $scope.selectedData
                }
                medifirstService.post('rawatinap/hapus-jadwal-perbulan-pegawai', json).then(function (e) {
                    searchData()
                }, function error() {

                })
            }

            $scope.cari = function () {
                searchData();
            }

            $scope.generateTables = function () {
                $scope.columns = [{
                    "field": "no",
                    "title": "<h3 align=center>No.<h3>",
                    "width": "48px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: center;"
                    }
                },
                {
                    "field": "jeniskegiatan",
                    "title": "<h3 align=center>Jenis Kegiatan<h3>",
                    "width": "410px",
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: left;"
                    }
                },
                {
                    "field": "isian",
                    "title": "<h3 align=center>" + $scope.getBulan() + "<h3>",
                    "columns": $scope.createColumn(),
                    "filterable": false,
                    attributes: {
                        "class": "table-cell",
                        style: "text-align: center;"
                    }
                    // title: $scope.getBulan(),
                    // columns: $scope.createColumn(),
                }
                ]
            }

            $scope.generateGridColumn = function () {
                var year = $scope.item.bulan.getYear();
                var month = $scope.item.bulan.getMonth();
                var dateInMonth = new Date(year, month + 1, 0);
                var listDay = [];
                for (var i = 0; i < dateInMonth.getDate(); i++) {
                    var data = {
                        field: "[" + (i + 1) + "]",
                        title: (i + 1).toString(),
                        width: "50px",
                        attributes: { style: "text-align: right;" },
                        headerAttributes: { style: "text-align: center;  " }
                    };
                    listDay.push(data);
                }
                return listDay;
            }

            $scope.optionGridMaster = {
                pageable: true,
                columns: [
                    { field: "no", title: "No", width: '10%' },
                    { field: "indikator", title: "Indikator", width: '70%' },
                    { field: "capaian", title: "Capaian Persen", width: '20%' },
                    { field: "capaianmil", title: "capaian Mil", width: '20%' },
                ],
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

            $scope.Cetak = function () {
                var bln = ''
                if ($scope.item2.bulan != undefined) {
                    bln = moment($scope.item2.bulan).format('YYYY-MM')
                }

                var idDept = ''
                if ($scope.item2.departemen != undefined) {
                    idDept = $scope.item2.departemen.id
                }

                var idRuangan = ''
                if ($scope.item2.ruangan != undefined) {
                    idRuangan = $scope.item2.ruangan.id
                }

                var stt = 'false'
                if (confirm('View Laporan Indikator Mutu? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/pmkp?cetak-lap-sensus-indikator-mutu&tgl=' + bln + '&dept=' + idDept + '&idruangan=' + idRuangan + '&view=' + stt, function (response) {
                    // do something with response
                });
            }

            $scope.cetakJasper = function () {

                // const = 

                if ($scope.item2.bulan == undefined) {
                    toastr.error('Bulan Belum di pilih ')
                    return
                }
                if ($scope.item2.departemen == undefined) {
                    toastr.error('Departemen Belum di pilih ')
                    return
                }
                var bln = ''
                if ($scope.item2.bulan != undefined) {
                    bln = moment($scope.item2.bulan).format('YYYY-MM')
                }


                var idDept = ''
                if ($scope.item2.departemen != undefined) {
                    idDept = $scope.item2.departemen.id
                }
                var idRuangan = ''
                var Ruangan = ''
                if ($scope.item2.ruangan != undefined) {
                    idRuangan = $scope.item2.ruangan.id
                    Ruangan = $scope.item2.ruangan.ruangan
                } else {
                    if ($scope.item2.departemen != undefined) {
                        Ruangan = $scope.item2.departemen.departemen;
                    }
                }

                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "departemenfk", "tglnilai", "idRuangan", "namaRuangan"],
                    "paramValue": ["", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211, Telp. (0751)8465000", idDept, bln, idRuangan, Ruangan],
                    "paramType": ["", "", "", "", "", ""]
                };
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        //this.response is what you're looking for
                        // handler(this.response);
                        console.log(this.response, typeof this.response);
                        //var res = this.response
                        //var file = new Blob( [res], {type: 'application/pdf'});
                        var url = window.URL.createObjectURL(this.response)
                        var pdf = document.getElementById('tempatLaporan');
                        pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        var win = window.open(url, '_blank');
                        win.focus();
                    }
                }
                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetakSensusHarianSasaranMutu.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1003/generic/report/cetakSensusHarianSasaranMutu.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1003/generic/report/cetakSensusHarianSasaranMutu.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetakSensusHarianSasaranMutu.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/labelPasien.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetakSensusHarianSasaranMutu.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));


            }
            $scope.cetakJasper1 = function () {
                debugger
                if ($scope.item2.bulan == undefined) {
                    toastr.error('Bulan Belum di pilih ')
                    return
                }
                if ($scope.item2.departemen == undefined) {
                    toastr.error('Departemen Belum di pilih ')
                    return
                }
                var bln = ''
                if ($scope.item2.bulan != undefined) {
                    bln = moment($scope.item2.bulan).format('YYYY-MM')
                }


                var idDept = ''
                if ($scope.item2.departemen != undefined) {
                    idDept = $scope.item2.departemen.id
                }
                var idRuangan = ''
                var Ruangan = ''
                if ($scope.item2.ruangan != undefined) {
                    idRuangan = $scope.item2.ruangan.id
                    Ruangan = $scope.item2.ruangan.ruangan
                } else {
                    if ($scope.item2.departemen != undefined) {
                        Ruangan = $scope.item2.departemen.departemen;
                    }
                }

                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "alamatRS", "departemenfk", "tglnilai", "idRuangan", "namaRuangan"],
                    "paramValue": ["", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211, Telp. (0751)8465000", idDept, bln, idRuangan, Ruangan],
                    "paramType": ["", "", "", "", "", ""]
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetakSensusHarianSasaranMutuPMKP.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1003/generic/report/cetakSensusHarianSasaranMutuPMKP.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1003/generic/report/cetakSensusHarianSasaranMutuPMKP.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetakSensusHarianSasaranMutuPMKP.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetakSensusHarianSasaranMutuPMKP.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetakSensusHarianSasaranMutuPMKP.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));


            }
            //** BATAS SUCI */
        }
    ]);

});