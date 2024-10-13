define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('TransaksiPelayananApotikCtrl', ['SaveToWindow', '$rootScope', '$scope', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', '$mdDialog', 'CetakHelper', 'MedifirstService', '$q',
        function (saveToWindow, $rootScope, $scope, ModelItem, $state, cacheHelper, DateHelper, $mdDialog, cetakHelper, medifirstService, $q) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            var norec_apd = ''
            var statusPosting = true
            $scope.isRouteLoading = false;
            // var pegawaiUser = {}
            $scope.istempatLaporan = true;
            var detail = '';
            $scope.tempdata = '';
            // $scope.item.tglAwal = $scope.now;
            // $scope.item.tglAkhir = $scope.now;
            var statusschedule = ''
            LoadCache();

            function LoadCache() {
                var chacePeriode = cacheHelper.get('TransaksiPelayananApotikCtrl');
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.noMr = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    $scope.item.umur = chacePeriode[4]
                    $scope.listKelas = ([{ id: chacePeriode[5], namakelas: chacePeriode[6] }])
                    $scope.item.kelas = { id: chacePeriode[5], namakelas: chacePeriode[6] }
                    $scope.item.tglRegistrasi = chacePeriode[7]
                    $scope.item.kelompokpasienid = chacePeriode[10]
                    norec_apd = chacePeriode[8]
                    detail = chacePeriode[9]
                    statusschedule = chacePeriode[11]
                    medifirstService.get("farmasi/get-detailPD?norec_apd=" + norec_apd, true).then(function (data_ih) {
                        $scope.item.jenisPenjamin = data_ih.data.detailPD[0].namarekanan
                        $scope.item.kelompokPasien = data_ih.data.detailPD[0].kelompokpasien
                        $scope.item.beratBadan = data_ih.data.detailPD[0].beratbadan
                        $scope.item.Norec_Pd = data_ih.data.detailPD[0].norec_pd
                        $scope.item.dokterdpjp = { id: data_ih.data.detailPD[0].pgid, namalengkap: data_ih.data.detailPD[0].namadokterdpjp }
                        $scope.item.kelasPenjamin = data_ih.data.detailPD[0].namakelas
                        $scope.item.kelasrawat = data_ih.data.detailPD[0].kelasrawat
                        $scope.item.namakamar = data_ih.data.detailPD[0].namakamar


                        // pegawaiUser = data_ih.data.datalogin[0]
                    });
                    init()
                } else {

                }
            }

            function init() {
                //debugger;
                $scope.isRouteLoading = true;
                medifirstService.get("farmasi/get-datacombo", true).then(function (dat) {
                    $scope.listRuangan = dat.data.ruangan;
                });
                if (detail == "detail") {
                    medifirstService.get("farmasi/get-transaksi-pelayanan?noReg=" + $scope.item.noregistrasi + "&noregistrasifk=" + norec_apd, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                            dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                        }
                        $scope.tempdata = dat.data;
                        $scope.dataGrid = dat.data;

                    });

                    medifirstService.get("farmasi/get-transaksi-pelayanan-obat-kronis?noReg=" + $scope.item.noregistrasi + "&noregistrasifk=" + norec_apd, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        if (dat != undefined) {
                            for (var i = 0; i < dat.data.length; i++) {
                                dat.data[i].no = i + 1
                                dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                                dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                            }
                            $scope.dataGridOK = dat.data;
                        }
                    });
                    medifirstService.get("farmasi/get-transaksi-pelayanan-obat-tap?nocm=" + $scope.item.noMr + "&noregistrasifk=" + norec_apd, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            // dat.data[i].total = parseFloat(dat.data[i].qty) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                            dat.data[i].total = parseFloat(dat.data[i].total)
                        }
                        $scope.dataGridTap = dat.data;
                    });
                } else if (detail == "resep") {
                    var chacePeriode = cacheHelper.get('DaftarResepCtrl');
                    if (chacePeriode != undefined) {
                        var noresep = chacePeriode[0]
                        medifirstService.get("farmasi/get-transaksi-pelayanan?noReg=" + $scope.item.noregistrasi + "&norec_resep=" + noresep, true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            for (var i = 0; i < dat.data.length; i++) {
                                dat.data[i].no = i + 1
                                dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                                dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                            }
                            $scope.dataGrid = dat.data;
                            $scope.tempdata = dat.data;

                        });

                        medifirstService.get("farmasi/get-transaksi-pelayanan-obat-kronis?noReg=" + $scope.item.noregistrasi + "&noregistrasifk=" + norec_apd, true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            if (dat != undefined) {
                                for (var i = 0; i < dat.data.length; i++) {
                                    dat.data[i].no = i + 1
                                    dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                                    dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                                }
                                $scope.dataGridOK = dat.data;
                            }
                        });
                        medifirstService.get("farmasi/get-transaksi-pelayanan-obat-tap?nocm=" + $scope.item.noMr + "&noregistrasifk=" + norec_apd, true).then(function (dat) {
                            $scope.isRouteLoading = false;
                            for (var i = 0; i < dat.data.length; i++) {
                                dat.data[i].no = i + 1
                                // dat.data[i].total = parseFloat(dat.data[i].qty) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                                dat.data[i].total = parseFloat(dat.data[i].total)
                            }
                            $scope.dataGridTap = dat.data;
                        });
                    }

                } else {
                    medifirstService.get("farmasi/get-transaksi-pelayanan?noReg=" + $scope.item.noregistrasi, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                            dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                        }
                        $scope.dataGrid = dat.data;
                        $scope.tempdata = $scope.dataGrid;
                    });

                    medifirstService.get("farmasi/get-transaksi-pelayanan-obat-kronis?noReg=" + $scope.item.noregistrasi + "&noregistrasifk=" + norec_apd, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        if (dat != undefined) {
                            for (var i = 0; i < dat.data.length; i++) {
                                dat.data[i].no = i + 1
                                dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                                dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                            }
                            $scope.dataGridOK = dat.data;
                        }
                    });
                    medifirstService.get("farmasi/get-transaksi-pelayanan-obat-tap?nocm=" + $scope.item.noMr + "&noregistrasifk=" + norec_apd, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            // dat.data[i].total = parseFloat(dat.data[i].qty) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                            dat.data[i].total = parseFloat(dat.data[i].total)
                        }
                        $scope.dataGridTap = dat.data;
                    });
                }
            }

            $scope.klikOK = function (dataSelectedOK) {
                if (dataSelectedOK != undefined) {
                    $scope.dataSelectedOK = dataSelectedOK;
                }
            }
            $scope.klikTap = function (dataSelectedTap) {
                if (dataSelectedTap != undefined) {
                    $scope.dataSelectedTap = dataSelectedTap;
                }
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.selectedData2 = [];

            $scope.selectedData3 = [];
            $scope.selectedDataKronis = [];
            $scope.selectedDatatap = [];
            $scope.onClickKronis = function (e) {
                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGridKronis").data("kendoGrid"),
                    // grid = $("#grid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                // $scope.selectedData[dataItem.noRec] = checked;
                if (checked) {
                    var result = $.grep($scope.selectedDataKronis, function (e) {
                        return e.produkfk == dataItem.produkfk;
                    });
                    if (result.length == 0) {
                        $scope.selectedDataKronis.push(dataItem);
                    } else {
                        for (var i = 0; i < $scope.selectedDataKronis.length; i++)
                            if ($scope.selectedDataKronis[i].produkfk === dataItem.produkfk) {
                                $scope.selectedDataKronis.splice(i, 1);
                                break;
                            }
                        $scope.selectedDataKronis.push(dataItem);
                    }
                    row.addClass("k-state-selected");
                } else {
                    for (var i = 0; i < $scope.selectedDataKronis.length; i++)
                        if ($scope.selectedDataKronis[i].produkfk === dataItem.produkfk) {
                            $scope.selectedDataKronis.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
            }

            $scope.onClick = function (e) {

                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGrid").data("kendoGrid"),
                    // grid = $("#grid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                // $scope.selectedData[dataItem.noRec] = checked;
                if (checked) {
                    var result = $.grep($scope.selectedData2, function (e) {
                        return e.produkfk == dataItem.produkfk;
                    });
                    if (result.length == 0) {
                        $scope.selectedData2.push(dataItem);
                    } else {
                        for (var i = 0; i < $scope.selectedData2.length; i++)
                            if ($scope.selectedData2[i].produkfk === dataItem.produkfk) {
                                $scope.selectedData2.splice(i, 1);
                                break;
                            }
                        $scope.selectedData2.push(dataItem);
                    }
                    row.addClass("k-state-selected");
                } else {
                    for (var i = 0; i < $scope.selectedData2.length; i++)
                        if ($scope.selectedData2[i].produkfk === dataItem.produkfk) {
                            $scope.selectedData2.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
            }
            $scope.onClickall = function (e) {
                $scope.selectedData2 = [];
                if (e == true) {

                    // $scope.tempdata = $scope.dataGrid;
                    for (var i = 0; i < $scope.dataGrid.length; i++) {
                        // dataItem = $scope.dataGrid[i];
                        $scope.selectedData2.push($scope.tempdata[i])
                    }



                }
                $scope.dataGrid = $scope.tempdata;
                // $scope.dataGrid = new kendo.data.DataSource({
                //     data: $scope.tempdata
                // });

            }
            $scope.onClickall2 = function (e) {
                $scope.selectedData2 = [];
                var element = $(e.currentTarget);

                var checked = element.is(':checked')

                if (checked) {

                    // $scope.tempdata = $scope.dataGrid;
                    for (var i = 0; i < $scope.dataGrid.length; i++) {
                        // dataItem = $scope.dataGrid[i];
                        $scope.selectedData2.push($scope.tempdata[i])
                    }



                }
                $scope.dataGrid = $scope.tempdata;
                // $scope.dataGrid = new kendo.data.DataSource({
                //     data: $scope.tempdata
                // });

            }
            $scope.onClick2 = function (e) {

                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kgridetiket").data("kendoGrid"),
                    // grid = $("#grid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                // $scope.selectedData[dataItem.noRec] = checked;
                if (checked) {
                    var result = $.grep($scope.selectedData3, function (e) {
                        return e.norecpp == dataItem.norecpp;
                    });
                    if (result.length == 0) {
                        $scope.selectedData3.push(dataItem);
                    } else {
                        for (var i = 0; i < $scope.selectedData3.length; i++)
                            if ($scope.selectedData3[i].norecpp === dataItem.norecpp) {
                                $scope.selectedData3.splice(i, 1);
                                break;
                            }
                        $scope.selectedData3.push(dataItem);
                    }
                    row.addClass("k-state-selected");
                } else {
                    for (var i = 0; i < $scope.selectedData3.length; i++)
                        if ($scope.selectedData3[i].norecpp === dataItem.norecpp) {
                            $scope.selectedData3.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
            }
            $scope.onClickpagi = function (e) {
                debugger;
                var udd = '';
                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kgridetiket").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                if (checked) {
                    udd = 1;
                } else {
                    udd = 0;
                }
                debugger;
                var objSave = {
                    "norec": dataItem.norecpp,
                    "udd": 'pagi',
                    "status": udd
                }
                medifirstService.post('logistik/save-updateudd', objSave).then(function (e) {
                    // alert('yoyoyyy');
                })
            }
            $scope.onClicksiang = function (e) {
                debugger;
                var udd = '';
                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kgridetiket").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                if (checked) {
                    udd = 1;
                } else {
                    udd = 0;
                }
                debugger;
                var objSave = {
                    "norec": dataItem.norecpp,
                    "udd": 'siang',
                    "status": udd
                }
                medifirstService.post('logistik/save-updateudd', objSave).then(function (e) {
                    // alert('yoyoyyy');
                })
            }
            $scope.onClicksore = function (e) {
                debugger;
                var udd = '';
                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kgridetiket").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                if (checked) {
                    udd = 1;
                } else {
                    udd = 0;
                }
                debugger;
                var objSave = {
                    "norec": dataItem.norecpp,
                    "udd": 'sore',
                    "status": udd
                }
                medifirstService.post('logistik/save-updateudd', objSave).then(function (e) {
                    // alert('yoyoyyy');
                })
            }
            $scope.getdetails = function (e) {
                debugger;
                var objSave = {
                    "norec": dataItem.norecpp,
                    "udd": 'malam',
                    "status": udd
                }
                medifirstService.post('logistik/save-updateudd', objSave).then(function (e) {
                    // alert('yoyoyyy');
                })
            }

            $scope.onClickmalam = function (e) {
                debugger;
                var udd = '';
                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kgridetiket").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                if (checked) {
                    udd = 1;
                } else {
                    udd = 0;
                }
                debugger;
                var objSave = {
                    "norec": dataItem.norecpp,
                    "udd": 'malam',
                    "status": udd
                }
                medifirstService.post('logistik/save-updateudd', objSave).then(function (e) {
                    // alert('yoyoyyy');
                })
            }
            $scope.onClickTap = function (e) {
                debugger;
                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kGridTap").data("kendoGrid"),
                    // grid = $("#grid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                // $scope.selectedData[dataItem.noRec] = checked;
                if (checked) {
                    var result = $.grep($scope.selectedDatatap, function (e) {
                        return e.produkfk == dataItem.produkfk;
                    });
                    if (result.length == 0) {
                        $scope.selectedDatatap.push(dataItem);
                    } else {
                        for (var i = 0; i < $scope.selectedDatatap.length; i++)
                            if ($scope.selectedDatatap[i].produkfk === dataItem.produkfk) {
                                $scope.selectedDatatap.splice(i, 1);
                                break;
                            }
                        $scope.selectedDatatap.push(dataItem);
                    }
                    row.addClass("k-state-selected");
                } else {
                    for (var i = 0; i < $scope.selectedDatatap.length; i++)
                        if ($scope.selectedDatatap[i].produkfk === dataItem.produkfk) {
                            $scope.selectedDatatap.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
            }
            $scope.columnGrid = [{
                "title": "<input type='checkbox' class='checkbox' ng-click='onClickall2($event)' />",
                "template": "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
                "width": 40
            },
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
                "field": "noregistrasi",
                "title": "No.Registrasi",
                "width": "100px",
            },
            {
                "field": "noresep",
                "title": "No.Resep",
                "width": "100px",
            },
            {
                "field": "namaruangandepo",
                "title": "Depo",
                "width": "100px",
            },
            {
                "field": "rke",
                "title": "R/ke",
                "width": "30px",
            },
            {
                "field": "jeniskemasan",
                "title": "Kemasan",
                "width": "80px",
            },
            {
                "field": "namaproduk",
                "title": "Deskripsi",
                "width": "200px",
            },
            {
                "field": "satuanstandar",
                "title": "Satuan",
                "width": "80px",
            },
            {
                "field": "jumlah",
                "title": "Qty",
                "width": "40px",
            },
            {
                "field": "hargasatuan",
                "title": "Harga Satuan",
                "width": "100px",
                "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
            },
            {
                "field": "hargadiscount",
                "title": "Harga Discount",
                "width": "100px",
                "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
            },
            {
                "field": "jasa",
                "title": "Jasa",
                "width": "70px",
                "template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>"
            },
            {
                "field": "total",
                "title": "Total",
                "width": "100px",
                "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
            },
            {
                "field": "nostruk",
                "title": "No Struk",
                "width": "100px"
            },
            {
                "field": "tglkadaluarsa",
                "title": "TGL Kadaluarsa",
                "width": "100px",
                attributes: {
                    class: "#=kadaluarsa == 'sebulan' ? 'red' : 'hejo' #"
                },
            },
            {
                "field": "namauser",
                "title": "USER",
                "width": "100px",
                // "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
            }
            ];
            $scope.columnGrid2 = [
                // {
                //     "title": "<input type='checkbox' class='checkbox' ng-click='onClickall2($event)' />",
                //     "template": "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
                //     "width": 40
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
                    "field": "noregistrasi",
                    "title": "No.Registrasi",
                    "width": "100px",
                },
                {
                    "field": "noresep",
                    "title": "No.Resep",
                    "width": "100px",
                },
                {
                    "field": "namaruangandepo",
                    "title": "Depo",
                    "width": "100px",
                },
                {
                    "field": "rke",
                    "title": "R/ke",
                    "width": "30px",
                },
                {
                    "field": "jeniskemasan",
                    "title": "Kemasan",
                    "width": "80px",
                },
                {
                    "field": "namaproduk",
                    "title": "Deskripsi",
                    "width": "200px",
                },
                {
                    "field": "satuanstandar",
                    "title": "Satuan",
                    "width": "80px",
                },
                {
                    "field": "jumlah",
                    "title": "Qty",
                    "width": "40px",
                },
                {
                    "field": "hargasatuan",
                    "title": "Harga Satuan",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
                },
                {
                    "field": "hargadiscount",
                    "title": "Harga Discount",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
                },
                {
                    "field": "jasa",
                    "title": "Jasa",
                    "width": "70px",
                    "template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>"
                },
                {
                    "field": "total",
                    "title": "Total",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                },
                {
                    "field": "nostruk",
                    "title": "No Struk",
                    "width": "100px"
                },
                {
                    "field": "tglkadaluarsa",
                    "title": "TGL Kadaluarsa",
                    "width": "100px",
                    attributes: {
                        class: "#=kadaluarsa == 'sebulan' ? 'red' : 'hejo' #"
                    },
                },
                {
                    "field": "namauser",
                    "title": "USER",
                    "width": "100px",
                    // "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                }
            ];
            $scope.columnPopUpetiket = {
                selectable: 'row',
                pageable: true,
                editable: true,
                serverPaging: true,
                // dataBound: onDataBound,
                dataBound: function (e) {
                    debugger
                    var grid = this;
                    var rows = grid.items();

                    $(rows).each(function (e) {
                        var row = this;
                        var dataItem = grid.dataItem(row);

                        if (dataItem.isSiang == 1) {
                            grid.select(row);
                        }

                    });
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:H1"];
                    sheet.name = "Hasil";

                    var myHeaders = [

                        {
                            value: "Hasil Laboratorium",
                            fontSize: 15,
                            textAlign: "center",
                            background: "#c1d2d2",
                            // color:"#ffffff"
                        }
                    ];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                columns: [{
                    "template": "<input type='checkbox' class='checkbox' ng-click='onClick2($event)' />",
                    "width": 40
                },
                // {
                //     "field": "no",
                //     "title": "No",
                //     "width": "30px",
                // },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Pelayanan",
                    "width": "90px",
                },
                // {
                //     "field": "noregistrasi",
                //     "title": "No.Registrasi",
                //     "width": "100px",
                // },
                {
                    "field": "noresep",
                    "title": "No.Resep",
                    "width": "80px",
                },
                // {
                //     "field": "rke",
                //     "title": "Rke",
                //     "width": "25px",
                // },
                // {
                //     "field": "jeniskemasan",
                //     "title": "Jenis Kemasan",
                //     "width": "50px",
                // },
                // {
                //     "field": "namaruangandepo",
                //     "title": "Depo",
                //     "width": "80px",
                // },

                {
                    "field": "namaproduk",
                    "title": "Deskripsi",
                    "width": "200px",
                },

                {
                    "field": "ispagi",
                    "title": "Pagi",
                    "width": "50px",
                    "template": "<input ng-model = 'dataItem.ispagi' type='checkbox' ng-click='onClickpagi($event)' />",
                },

                {
                    "field": "issiang",
                    "title": "Siang",
                    "width": "50px",
                    "template": "<input ng-model = 'dataItem.issiang' type='checkbox' ng-click='onClicksiang($event)' />",
                },

                {
                    "field": "issore",
                    "title": "Sore",
                    "width": "50px",
                    "template": "<input ng-model = 'dataItem.issore' type='checkbox' ng-click='onClicksore($event)' />",

                },

                {
                    "field": "ismalam",
                    "title": "Malam",
                    "width": "50px",
                    "template": "<input ng-model = 'dataItem.ismalam' type='checkbox' ng-click='onClickmalam($event)' />",

                },
                {
                    "field": "keteranganpakai",
                    "title": "Keterangan",
                    "width": "80px",
                    "template": "<span class='style-right' ng-click='onClickmalam2($event) ng-keypress='($event.which == 13)? onClickmalam2($event):keteranganpakai' >'#: keteranganpakai #'</span>",
                    // "template": "<input c-text-box type='input'  class='k-textbox' ng-model='item.keteranganpakai' value='#: keteranganpakai #'  ng-keypress='($event.which == 13)? SearchData():item.noReg' ",
                    // "template": "<input ng-model = 'data.Item.keteranganpakai' type='checkbox' ng-blur='keterangan' />",

                },
                {
                    "field": "",
                    "title": "",
                    "width": "80px",
                    "template": "<button class='btnTemplate1' ng-click='onClickmalam2($event)'>Ubah Keterangan</button>"

                },
                    // {
                    //     "field": "jumlah",
                    //     "title": "Qty",
                    //     "width": "40px",
                    // }
                ]
            };
            $scope.columnGridOK = [{
                "template": "<input type='checkbox' class='checkbox' ng-click='onClickKronis($event)' />",
                "width": 40
            },
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
                "field": "noregistrasi",
                "title": "No.Registrasi",
                "width": "100px",
            },
            {
                "field": "noresepok",
                "title": "No.Resep",
                "width": "100px",
            },
            {
                "field": "namaruangandepo",
                "title": "Depo",
                "width": "100px",
            },
            {
                "field": "rke",
                "title": "R/ke",
                "width": "30px",
            },
            {
                "field": "jeniskemasan",
                "title": "Kemasan",
                "width": "80px",
            },
            {
                "field": "namaproduk",
                "title": "Deskripsi",
                "width": "200px",
            },
            {
                "field": "satuanstandar",
                "title": "Satuan",
                "width": "80px",
            },
            {
                "field": "jumlah",
                "title": "Qty",
                "width": "75px",
            },
            {
                "field": "hargasatuan",
                "title": "Harga Satuan",
                "width": "100px",
                "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
            },
            {
                "field": "hargadiscount",
                "title": "Harga Discount",
                "width": "100px",
                "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
            },
            {
                "field": "jasa",
                "title": "Jasa",
                "width": "70px",
                "template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>"
            },
            {
                "field": "total",
                "title": "Total",
                "width": "100px",
                "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
            },
            {
                "field": "nostruk",
                "title": "No Struk",
                "width": "100px"
            }
            ];
            $scope.columnGridTap = [{
                "template": "<input type='checkbox' class='checkbox' ng-click='onClickTap($event)' />",
                "width": 40
            },
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
                "field": "noresep",
                "title": "No.Copy Resep",
                "width": "100px",
            },
            {
                "field": "namaruangandepo",
                "title": "Depo",
                "width": "100px",
            },

            // {
            //     "field": "jeniskemasan",
            //     "title": "Kemasan",
            //     "width": "80px",
            // },
            {
                "field": "namaproduk",
                "title": "Deskripsi",
                "width": "200px",
            },
            {
                "field": "jumlah",
                "title": "Qty",
                "width": "75px",
            },
            {
                "field": "harga",
                "title": "Harga Satuan",
                "width": "100px",
                "template": "<span class='style-right'>{{formatRupiah('#: harga #', '')}}</span>"
            },
            {
                "field": "total",
                "title": "Total",
                "width": "100px",
                "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
            }

            ];

            $scope.columnPopUp = [{
                "field": "no",
                "title": "No",
                "width": "20px"
            },
            {
                "field": "tglstruk",
                "title": "Tgl Struk",
                "width": "50px"
            },
            {
                "field": "nostruk",
                "title": "NoTerima",
                "width": "60px"
            },
            {
                "field": "namaruanganasal",
                "title": "Nama Ruangan Asal",
                "width": "100px"
            },
            {
                "field": "namaruangantujuan",
                "title": "Nama Ruangan Tujuan",
                "width": "100px"
            },
            {
                "field": "petugas",
                "title": "Petugas",
                "width": "100px"
            },
            {
                "field": "keterangan",
                "title": "Keterangan",
                "width": "100px"
            }
            ];
            $scope.columnPopUpAPD = [{
                "field": "no",
                "title": "No",
                "width": "20px"
            },
            {
                "field": "tglregistrasi",
                "title": "Tgl Registrasi",
                "width": "100px"
            },
            {
                "field": "namaruangan",
                "title": "Ruangan",
                "width": "100px"
            },
            {
                "field": "namadokter",
                "title": "Dokter",
                "width": "100px"
            },
            {
                "field": "namakelas",
                "title": "Kelas",
                "width": "100px"
            },
            {
                "field": "tglmasuk",
                "title": "Tgl Masuk",
                "width": "100px"
            },
            {
                "field": "tglkeluar",
                "title": "Tgl Keluar",
                "width": "100px"
            }
            ];
            $scope.data2 = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details
                    }),
                    columns: [{
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
            $scope.back = function () {
                //$state.go("DaftarPasienApotik")
                window.history.back();
            }
            $scope.BridgingMiniR45 = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih Resep terlebih dahulu!!")
                    return
                } //
                if ($scope.dataSelected.jeniskemasan != 'Racikan/Puyer') {
                    alert("Harus Racikan puyer!!")
                    return
                }
                var objSave = {
                    strukresep: $scope.dataSelected.norec_resep,
                    rke: $scope.dataSelected.rke
                }

                medifirstService.postbridgingminir45(objSave).then(function (e) {

                })
            }
            $scope.BridgingConsisD = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih Resep terlebih dahulu!!")
                    return
                }
                if ($scope.dataSelected.jeniskemasan != 'Non Racikan') {
                    alert("Harus Non Racikan!!")
                    return
                }
                var kampret = prompt("Input Counter ID", "1");
                var objSave = {
                    strukresep: $scope.dataSelected.norec_resep,
                    counterid: kampret
                }

                medifirstService.post('bridging/farmasi/save-consis-d', objSave).then(function (e) {

                })
            }
            $scope.TambahObat = function () {
                // if ($scope.dataSelected.nostruk != undefined) {
                //     alert('Sudah verifikasi Tatarekening Tidak Bisa Menambah Obat!')
                //     return;
                // }
                //debugger;
                if ($scope.dataSelectedPopUpAPD == undefined) {
                    toastr.error('Pilih Ruangan Asal Pasien', 'Peringatan!')
                    return;
                }
                if ($scope.dataSelectedPopUpAPD != undefined) {
                    var a = new Date();
                    var x = Date.parse(a);
                    var data = {
                        kodebooking: statusschedule,
                        taskid: 7,
                        waktu: x
                    }
                    var objSave = {
                        data: data
                    }
                    medifirstService.post('bridging/bpjs2/mjkn/antrian/UpdateWaktuTaskId', objSave).then(function (e) {
                        debugger

                    })
                    // * Validasi Untuk Sekali Bayar
                    //medifirstService.getDataTableTransaksi("tatarekening/get-sudah-verif?noregistrasi="+
                    //$scope.dataSelected.noregistrasi, true).then(function(dat){                           
                    // if (dat.data.status == true) {
                    //     window.messageContainer.error('Data Sudah Diclosing, Hubungi Tatarekening!!!!')
                    //     return;
                    // }else{

                    //  ** cek status closing
                    medifirstService.get("sysadmin/general/get-status-close/" + $scope.item.noregistrasi, false).then(function (rese) {
                        if (rese.data.status == true) {
                            toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                            $scope.isSelesaiPeriksa = true
                        } else {

                            //** */
                            debugger;
                            var arrStr = {
                                0: $scope.item.noMr,
                                1: $scope.item.namaPasien,
                                2: $scope.item.jenisKelamin,
                                3: $scope.item.noregistrasi,
                                4: $scope.item.umur,
                                5: $scope.item.kelas.id,
                                6: $scope.item.kelas.namakelas,
                                7: $scope.item.tglRegistrasi,
                                8: $scope.dataSelectedPopUpAPD.norec,
                                9: '',
                                10: $scope.item.jenisPenjamin,
                                11: $scope.item.kelompokPasien,
                                12: $scope.item.beratBadan,
                                13: $scope.item.AlergiYa,
                                14: '',
                                15: { id: $scope.dataSelectedPopUpAPD.pgid, namalengkap: $scope.dataSelectedPopUpAPD.namadokter },
                                16: $scope.item.kelompokpasienid,
                                17: $scope.dataSelectedPopUpAPD.tglmasuk,
                                18: $scope.dataSelectedPopUpAPD.tglkeluar,
                                19: $scope.dataSelectedPopUpAPD.objectdepartemenfk,
                                20: $scope.dataSelectedPopUpAPD.namaruangan,
                            }
                            cacheHelper.set('InputResepApotikCtrl', arrStr);
                            $state.go('InputResepApotik')
                            // }
                            // });
                            // * Validasi Untuk Sekali Bayar
                        }
                    })
                    //  ** cek status closing
                } else {

                    // * Validasi Untuk Sekali Bayar
                    // medifirstService.getDataTableTransaksi("tatarekening/get-sudah-verif?noregistrasi="+
                    //     $scope.item.noregistrasi, true).then(function(dat){
                    //     if (dat.data.status == true) {
                    //         window.messageContainer.error('Data Sudah Diclosing, Hubungi Tatarekening!!!!')
                    //         return;
                    //     }else{
                    //  ** cek status closing
                    medifirstService.get("sysadmin/general/get-status-close/" + $scope.item.noregistrasi, false).then(function (rese) {
                        if (rese.data.status == true) {
                            toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                            $scope.isSelesaiPeriksa = true
                        } else {
                            debugger

                            //** */
                            var arrStr = {
                                0: $scope.item.noMr,
                                1: $scope.item.namaPasien,
                                2: $scope.item.jenisKelamin,
                                3: $scope.item.noregistrasi,
                                4: $scope.item.umur,
                                5: $scope.item.kelas.id,
                                6: $scope.item.kelas.namakelas,
                                7: $scope.item.tglRegistrasi,
                                8: norec_apd,
                                9: '',
                                10: $scope.item.jenisPenjamin,
                                11: $scope.item.kelompokPasien,
                                12: $scope.item.beratBadan,
                                13: $scope.item.AlergiYa,
                                14: '',
                                15: $scope.item.dokterdpjp,
                                16: $scope.item.kelompokpasienid,
                                17: $scope.dataSelectedPopUpAPD.tglmasuk,
                                18: $scope.dataSelectedPopUpAPD.tglkeluar,
                                19: $scope.dataSelectedPopUpAPD.objectdepartemenfk,
                                20: $scope.dataSelectedPopUpAPD.namaruangan,
                            }
                            cacheHelper.set('InputResepApotikCtrl', arrStr);
                            $state.go('InputResepApotik')
                            //     }
                            // });
                            // * Validasi Untuk Sekali Bayar         
                        }
                    })
                    //  ** cek status closing           
                }

            }
            $scope.TambahObat2 = function () {
                if ($scope.dataSelectedPopUpAPD != undefined) {
                    medifirstService.get("sysadmin/general/get-status-close/" + $scope.item.noregistrasi, false).then(function (rese) {
                        if (rese.data.status == true) {
                            toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                            $scope.isSelesaiPeriksa = true
                        } else {

                            //** */
                            debugger;
                            var arrStr = {
                                0: $scope.item.noMr,
                                1: $scope.item.namaPasien,
                                2: $scope.item.jenisKelamin,
                                3: $scope.item.noregistrasi,
                                4: $scope.item.umur,
                                5: $scope.item.kelas.id,
                                6: $scope.item.kelas.namakelas,
                                7: $scope.item.tglRegistrasi,
                                8: $scope.dataSelectedPopUpAPD.norec,
                                9: '',
                                10: $scope.item.jenisPenjamin,
                                11: $scope.item.kelompokPasien,
                                12: $scope.item.beratBadan,
                                13: $scope.item.AlergiYa,
                                14: '',
                                15: { id: $scope.dataSelectedPopUpAPD.pgid, namalengkap: $scope.dataSelectedPopUpAPD.namadokter },
                                16: $scope.item.kelompokpasienid
                            }
                            cacheHelper.set('InputResepApotikTapCtrl', arrStr);
                            $state.go('InputResepApotikTap')
                            // }
                            // });
                            // * Validasi Untuk Sekali Bayar
                        }
                    })
                    //  ** cek status closing
                } else {

                    // * Validasi Untuk Sekali Bayar
                    // medifirstService.getDataTableTransaksi("tatarekening/get-sudah-verif?noregistrasi="+
                    //     $scope.item.noregistrasi, true).then(function(dat){
                    //     if (dat.data.status == true) {
                    //         window.messageContainer.error('Data Sudah Diclosing, Hubungi Tatarekening!!!!')
                    //         return;
                    //     }else{
                    //  ** cek status closing
                    // $scope.RincianObatApt = function () {
                    //     $scope.isRouteLoading = true;
                    //     medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noRegistrasi + '?jenisdata=bill').then(function (dat) {
                    //         $scope.isRouteLoading = false;
                    //         var struk = "";
                    //         var kwitansi = "";
                    //         var stt = 'false'
                    //         if (confirm('View Rincian Obat & Alkes? ')) {
                    //             // Save it!
                    //             stt = 'true';
                    //         } else {
                    //             // Do nothing!
                    //             stt = 'false'
                    //         }
                    //         // if ($scope.item.jenisPasien != "BPJS") {
                    //         medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                    //             var client = new HttpClient();
                    //             client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiayaObatAlkesApt=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk='  + '&strNoKwitansi='  + '&strIdPegawai=' + e.data[0].namalengkap + '&kdruangan=' + "" + '&view=' + stt + '&apt=1', function (response) {
                    //                 // do something with response
                    //             });
                    //         })
                    //     });

                    // }
                    medifirstService.get("sysadmin/general/get-status-close/" + $scope.item.noregistrasi, false).then(function (rese) {
                        if (rese.data.status == true) {
                            toastr.error('Pemeriksaan sudah ditutup tanggal ' + moment(new Date(rese.data.tglclosing)).format('DD-MMM-YYYY HH:mm'), 'Peringatan!')
                            $scope.isSelesaiPeriksa = true
                        } else {

                            //** */
                            var arrStr = {
                                0: $scope.item.noMr,
                                1: $scope.item.namaPasien,
                                2: $scope.item.jenisKelamin,
                                3: $scope.item.noregistrasi,
                                4: $scope.item.umur,
                                5: $scope.item.kelas.id,
                                6: $scope.item.kelas.namakelas,
                                7: $scope.item.tglRegistrasi,
                                8: norec_apd,
                                9: '',
                                10: $scope.item.jenisPenjamin,
                                11: $scope.item.kelompokPasien,
                                12: $scope.item.beratBadan,
                                13: $scope.item.AlergiYa,
                                14: '',
                                15: $scope.item.dokterdpjp,
                                17: $scope.dataSelectedPopUpAPD.tglmasuk,
                                18: $scope.dataSelectedPopUpAPD.tglkeluar,
                                19: $scope.dataSelectedPopUpAPD.objectdepartemenfk,
                                20: $scope.dataSelectedPopUpAPD.namaruangan,
                            }
                            cacheHelper.set('InputResepApotikCtrl', arrStr);
                            $state.go('InputResepApotik')
                            //     }
                            // });
                            // * Validasi Untuk Sekali Bayar         
                        }
                    })
                    //  ** cek status closing           
                }

            }
            $scope.munculetiket = function () {
                medifirstService.get("farmasi/get-transaksi-pelayanan-etiket?noReg=" + $scope.item.noregistrasi, true).then(function (dat) {
                    $scope.isRouteLoading = false;
                    for (var i = 0; i < dat.data.length; i++) {
                        dat.data[i].no = i + 1
                        // dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                        // dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                        dat.data[i].isPagi = true;


                    }
                    $scope.dataGridEtiket = dat.data;
                    for (let i = 0; i < $scope.dataGridEtiket.length; i++) {
                        const element = $scope.dataGridEtiket[i];
                        if (element.ispagi == "pagi") element.ispagi = true
                        else element.ispagi = false

                        if (element.issiang == "siang") element.issiang = true
                        else element.issiang = false

                        if (element.issore == "sore") element.issore = true
                        else element.issore = false

                        if (element.ismalam == "malam") element.ismalam = true
                        else element.ismalam = false
                    }
                    $scope.dataPopUpetiket = $scope.dataGridEtiket;

                    // $scope.dataSelectedPopUpetiket = new kendo.data.DataSource({
                    // 	pageSize: 10,
                    // 	data: $scope.dataGrid
                    // });
                });

                $scope.popupEtiket.center().open();

            }

            $scope.munculdiskon = function () {
                $scope.item.persen = 'rupiah';
                $scope.item.total = 0;
                for (var i = 0; i < $scope.selectedData2.length; i++) {
                    $scope.item.total = $scope.item.total + $scope.selectedData2[i].total
                }
                $scope.dataGriddiskon = new kendo.data.DataSource({
                    data: $scope.selectedData2
                });
                $scope.popupDiskon.center().open();

            }
            $scope.simpanbataldiskon = function () {
                $scope.popupDiskon.close();
            }
            $scope.simpandiskon = function () {
                var diskon = 0;
                var total = 0;
                var temptotal = 0;
                total = $scope.item.total;

                if ($scope.item.persen == 'rupiah') {
                    // diskon = (parseFloat($scope.item.total) * parseFloat($scope.item.diskon)) / 100
                    // $scope.item.diskon = diskon;
                    for (var i = $scope.selectedData2.length - 1; i >= 0; i--) {
                        debugger;
                        $scope.selectedData2[i].hargadiscount = parseFloat($scope.item.diskon) / total * $scope.selectedData2[i].hargasatuan
                        $scope.selectedData2[i].hargadiscount.toFixed(2)
                        // $scope.selectedData2[i].hargadiscount = (parseFloat($scope.selectedData2[i].hargasatuan) * parseFloat($scope.item.diskon)) / 100;
                        // $scope.selectedData2[i].hargadiscount = parseFloat($scope.item.diskon) / total * $scope.selectedData2[i].hargasatuan
                        // $scope.selectedData2[i].hargadiscount = (Math.round($scope.selectedData2[i].hargadiscount));
                        $scope.selectedData2[i].total = (parseFloat($scope.selectedData2[i].jumlah) * ($scope.selectedData2[i].hargasatuan - $scope.selectedData2[i].hargadiscount)) + parseFloat($scope.selectedData2[i].jasa)

                    }

                } else {
                    for (var i = $scope.selectedData2.length - 1; i >= 0; i--) {
                        $scope.selectedData2[i].hargadiscount = (parseFloat($scope.selectedData2[i].hargasatuan) * parseFloat($scope.item.diskon)) / 100;
                        $scope.selectedData2[i].total = (parseFloat($scope.selectedData2[i].jumlah) * ($scope.selectedData2[i].hargasatuan - $scope.selectedData2[i].hargadiscount)) + parseFloat($scope.selectedData2[i].jasa)

                    }

                }

                var subTotal = 0;
                for (var i = $scope.selectedData2.length - 1; i >= 0; i--) {
                    subTotal = subTotal + parseFloat($scope.selectedData2[i].total)
                    // $scope.selectedData2[i].no = i + 1
                }
                // $scope.item.hasil = subTotal;
                // data2.length = data2.length -1
                $scope.dataGriddiskon = new kendo.data.DataSource({
                    data: $scope.selectedData2
                });

                $scope.item.hasil = parseFloat(subTotal).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
                var objSave = {
                    detail: $scope.selectedData2,
                }
                medifirstService.post('farmasi/save-diskonobat', objSave).then(function (e) {

                });

            }
            $scope.tambahtenaga = function () {
                $scope.popupDetailRegistrasi.center().open();
                $scope.dataPopUpAPD = [];
                $scope.isRouteLoading = true;
                medifirstService.get("farmasi/get-detail-reg-farmasi?" +
                    "noregistrasi=" + $scope.item.noregistrasi, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                        }
                        $scope.dataPopUpAPD = dat.data;
                        // $scope.dataPopUp212 = new kendo.data.DataSource({
                        //     data: dat.data.daftar
                        // });
                        // $scope.dataPopUpPaketObat = dat.data.daftar;

                    });
            }
            $scope.tambahtenaga2 = function () {
                $scope.popupDetailRegistrasi2.center().open();
                $scope.dataPopUpAPD = [];
                $scope.isRouteLoading = true;
                medifirstService.get("farmasi/get-detail-reg-farmasi?" +
                    "noregistrasi=" + $scope.item.noregistrasi, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                        }
                        $scope.dataPopUpAPD = dat.data;
                        // $scope.dataPopUp212 = new kendo.data.DataSource({
                        //     data: dat.data.daftar
                        // });
                        // $scope.dataPopUpPaketObat = dat.data.daftar;

                    });
            }
            $scope.paketObat = function () {

                $scope.popupPaketObat.center().open();
                $scope.dataPopUp = [];
                medifirstService.get("farmasi/get-daftar-paket-obat-pasien?" +
                    "noregistrasi=" + $scope.item.noregistrasi, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.daftar.length; i++) {
                            dat.data.daftar[i].no = i + 1
                        }
                        $scope.dataPopUp = dat.data.daftar;
                        // $scope.dataPopUp212 = new kendo.data.DataSource({
                        //     data: dat.data.daftar
                        // });
                        // $scope.dataPopUpPaketObat = dat.data.daftar;

                    });
            }
            $scope.onClickmalam2 = function (e) {
                debugger;
                var udd = '';
                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#kgridetiket").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                debugger;
                $scope.item.norecubah = dataItem.norecpp
                $scope.item.keteranganubah = dataItem.keteranganpakai

                $scope.popupketerangan.center().open()
            }
            $scope.CetakPopUp = function () {
                var objSave = {
                    "norec": $scope.item.norecubah,
                    "keterangan": $scope.item.keteranganubah,
                }
                medifirstService.post('logistik/save-updateketerangan', objSave).then(function (e) {
                    // alert('yoyoyyy');
                    medifirstService.get("farmasi/get-transaksi-pelayanan?noReg=" + $scope.item.noregistrasi, true).then(function (dat) {
                        $scope.isRouteLoading = false;
                        for (var i = 0; i < dat.data.length; i++) {
                            dat.data[i].no = i + 1
                            dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount))
                            dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa)
                            dat.data[i].isPagi = true;


                        }
                        $scope.dataGrid = dat.data;
                        for (let i = 0; i < $scope.dataGrid.length; i++) {
                            const element = $scope.dataGrid[i];
                            if (element.ispagi == "1") element.ispagi = true
                            else element.ispagi = false

                            if (element.issiang == "1") element.issiang = true
                            else element.issiang = false

                            if (element.issore == "1") element.issore = true
                            else element.issore = false

                            if (element.ismalam == "1") element.ismalam = true
                            else element.ismalam = false
                        }
                        $scope.dataPopUpetiket = $scope.dataGrid;

                        // $scope.dataSelectedPopUpetiket = new kendo.data.DataSource({
                        // 	pageSize: 10,
                        // 	data: $scope.dataGrid
                        // });
                    });
                    $scope.popupketerangan.close()
                })
            }
            $scope.CetakPopUpclose = function () {
                $scope.popupketerangan.close()
            }
            $scope.baruPopUp = function () {
                // * Validasi Untuk Sekali Bayar
                //medifirstService.getDataTableTransaksi("tatarekening/get-sudah-verif?noregistrasi="+
                //$scope.item.noregistrasi, true).then(function(dat){
                // if (dat.data.status == true) {
                //     window.messageContainer.error('Data Sudah Diclosing, Hubungi Tatarekening!!!!')
                //     return;
                // }else{
                var arrStr = {
                    0: $scope.item.noMr,
                    1: $scope.item.namaPasien,
                    2: $scope.item.jenisKelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umur,
                    5: $scope.item.kelas.id,
                    6: $scope.item.kelas.namakelas,
                    7: $scope.item.tglRegistrasi,
                    8: norec_apd,
                    9: '',
                    10: $scope.item.jenisPenjamin,
                    11: $scope.item.kelompokPasien,
                    12: $scope.item.beratBadan,
                    13: $scope.item.AlergiYa,
                    14: '',
                    15: ''
                }
                cacheHelper.set('PaketObatPasienCtrl', arrStr);
                $state.go('PaketObatPasien')
                //     }
                // })
                // * Validasi Untuk Sekali Bayar                
            }

            $scope.ubahPopUp = function () {
                if ($scope.dataSelectedPopUp == undefined) {
                    alert("Pilih yg akan di ubah!!")
                    return;
                }
                var chacePeriode = {
                    0: $scope.item.noMr,
                    1: $scope.item.namaPasien,
                    2: $scope.item.jenisKelamin,
                    3: $scope.item.noregistrasi,
                    4: $scope.item.umur,
                    5: $scope.item.kelas.id,
                    6: $scope.item.kelas.namakelas,
                    7: $scope.item.tglRegistrasi,
                    8: norec_apd,
                    9: '',
                    10: $scope.item.jenisPenjamin,
                    11: $scope.item.kelompokPasien,
                    12: $scope.item.beratBadan,
                    13: $scope.item.AlergiYa,
                    14: 'EditKirim',
                    15: $scope.dataSelectedPopUp.norec,
                    16: $scope.item.kelompokpasienid
                }
                cacheHelper.set('PaketObatPasienCtrl', chacePeriode);
                $state.go('PaketObatPasien')
            }

            $scope.EditResep = function () {
                debugger
                // * Validasi Untuk Sekali Bayar
                // if ($scope.dataSelected.nostruk != undefined) {
                //     window.messageContainer.error('Data Sudah Diclosing, Hubungi Tatarekening!!!!')
                //     return;
                // }
                // * Validasi Untuk Sekali Bayar

                // if (statusPosting == true) {
                //     window.messageContainer.error('Data Sudah di Posting, Hubungi Bagian Akuntansi.')
                //     return;
                // }

                // medifirstService.getDataTableTransaksi("tatarekening/get-sudah-verif?noregistrasi="+
                //     $scope.dataSelected.noregistrasi, true).then(function(dat){
                if ($scope.dataSelected.nostruk != undefined) {
                    window.messageContainer.error('Sudah verifikasi Tatarekening Tidak Bisa mengubah Obat!')
                    return;
                } else {
                    var arrStr = {
                        0: $scope.item.noMr,
                        1: $scope.item.namaPasien,
                        2: $scope.item.jenisKelamin,
                        3: $scope.dataSelected.noregistrasi,
                        4: $scope.item.umur,
                        5: $scope.item.kelas.id,
                        6: $scope.item.kelas.namakelas,
                        7: $scope.item.tglRegistrasi,
                        8: norec_apd,
                        9: 'EditResep',
                        10: $scope.item.jenisPenjamin,
                        11: $scope.item.kelompokPasien,
                        12: $scope.item.beratBadan,
                        13: $scope.item.AlergiYa,
                        14: $scope.dataSelected.norec_resep,
                        15: $scope.item.dokterdpjp,
                        16: $scope.item.kelompokpasienid,
                        19: $scope.dataSelected.objectdepartemenfk,
                        21: $scope.dataSelected.tglpelayanan,
                    }
                    cacheHelper.set('InputResepApotikCtrl', arrStr);
                    $state.go('InputResepApotik')
                }
                // });
                //debugger;

            }
            $scope.klikgrid = function () {
                medifirstService.get("sysadmin/general/get-sudah-posting?tgl=" +
                    $scope.dataSelected.tglpelayanan, true).then(function (dat) {
                        statusPosting = dat.data.status
                    })
            }

            $scope.Retur = function () {
                if ($scope.dataSelected.nostruk != undefined) {
                    window.messageContainer.error('Data Sudah Diclosing, Hubungi Tatarekening.')
                    return;
                }

                // * Validasi Untuk Sekali Bayar
                // if (statusPosting == true) {
                //     window.messageContainer.error('Data Sudah di Posting, Hubungi Bagian Akuntansi.')
                //     return;
                // }
                // * Validasi Untuk Sekali Bayar

                // medifirstService.getDataTableTransaksi("tatarekening/get-sudah-verif?noregistrasi="+
                // $scope.dataSelected.noregistrasi, true).then(function(dat){
                if ($scope.dataSelected.nostruk != undefined) {
                    window.messageContainer.error('Sudah verifikasi Tatarekening Tidak Bisa retur Obat!')
                    return;
                } else {
                    var arrStr = {
                        0: $scope.item.noMr,
                        1: $scope.item.namaPasien,
                        2: $scope.item.jenisKelamin,
                        3: $scope.dataSelected.noregistrasi,
                        4: $scope.item.umur,
                        5: $scope.item.kelas.id,
                        6: $scope.item.kelas.namakelas,
                        7: $scope.item.tglRegistrasi,
                        8: norec_apd,
                        9: 'EditResep',
                        10: $scope.item.jenisPenjamin,
                        11: $scope.item.kelompokPasien,
                        12: $scope.item.beratBadan,
                        13: $scope.item.AlergiYa,
                        14: $scope.dataSelected.norec_resep,
                        15: $scope.item.kelompokpasienid
                    }
                    cacheHelper.set('InputResepApotikReturCtrl', arrStr);
                    $state.go('InputResepApotikRetur')
                }
                // });
                //debugger;

            }

            $scope.orderApotik = function () {
                $state.go("InputResepApotikOrder")
            }
            $scope.HapusResepPerItem = function () {
                debugger;
                if ($scope.dataSelected.nostruk != undefined) {
                    window.messageContainer.error('Sudah verifikasi Tatarekening tidak dapat di hapus!')
                    return;
                }
                $scope.selectedData2.forEach(function (items) {
                    if (items.nostruk != undefined) {
                        window.messageContainer.error('Sudah verifikasi Tatarekening Tidak Bisa hapus Obat!')
                        return;
                    }
                    // medifirstService.get("logistik/get-cekstokaja?"+
                    // "produkfk="+ items.produkfk+
                    // "&ruanganfk="+  items.depoid , true).then(function(dat1){
                    //         medifirstService.get("logistik/get-cekstok?"+
                    //         "produkfk="+ items.produkfk +
                    //         "&ruanganfk="+ items.depoid , true).then(function(dat2){

                    //             var currentDate='';
                    //             if (parseFloat(dat1.data.datastok[0].qty) != parseFloat(dat2.data.kartustoklast[0].saldoawal) ){
                    //                 if(dat2.data.kartustoksebelum.length == 0){
                    //                     currentDate = dat2.data.kartustoklast[0].created_at;
                    //                 }else{
                    //                     currentDate = dat2.data.kartustoksebelum[0].created_at;
                    //                 }
                    //                 var objSave = {
                    //                     "ruanganfk": items.depoid,
                    //                     "produkfk": items.produkfk,
                    //                     "tglawal": moment(currentDate).format('YYYY-MM-DD 00:00:00')
                    //                 }
                    //                 medifirstService.post('logistik/save-perbaiki-kartu-stok',objSave).then(function (e) {
                    //                     // alert('yoyoyyy');
                    //                 })
                    //             }
                    //         });

                    // });
                });
                if ($scope.dataSelected.nostruk != undefined) {
                    window.messageContainer.error('Sudah verifikasi Tatarekening Tidak Bisa hapus Obat!')
                    return;
                } else {
                    var stt = 'false'
                    if (confirm('Hapus Obat Dari Ruangan ' + $scope.dataSelected.namaruangandepo)) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        return;
                        stt = 'false'
                    }

                    // var objDelete = {norec:$scope.dataSelected.norec_resep}
                    var objDelete = {
                        produk: $scope.selectedData2,
                        datalogin: $scope.dataSelected.detail.userData
                    }
                    medifirstService.post('farmasi/save-hapus-pelayananobatperitem', objDelete).then(function (e) {
                        medifirstService.get("sysadmin/logging/save-log-hapus-resep?norec_resep=" +
                            $scope.dataSelected.norec_resep

                        ).then(function (data) {
                            LoadCache()
                        })



                    })
                    //##save Logging user

                    //##end 
                }
                // });

            }
            $scope.CetakResep23Jasper = function () {
                if ($scope.dataSelectedOK == undefined) {
                    alert('Pilih resep yg akan di cetak')
                    return;
                }
                var stt = 'false'
                if (confirm('Cetak obat kronis 23? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                $scope.isRouteLoading = true;
                // var ruanganLast ="";
                var total = "";
                // var totalDiscount ="";
                // var totalBayar ="";
                var namauser = "";
                // var umur = $scope.item.umur;
                //  var kelas = $scope.item.kelasrawat
                //     if($scope.item.kelompokPasien!="Umum/Pribadi"){
                //             kelas = $scope.item.kelasPenjamin
                //     }
                var namakamar = $scope.item.namakamar;
                debugger
                namauser = $scope.dataSelectedOK.detail.userData.namauser;
                debugger
                // medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noregistrasi + '?jenisdata=bill').then(function (dat) {
                medifirstService.get("tatarekening/get-data-login-cetakan-ruangan-last?noregistrasi=" + $scope.item.noregistrasi, true).then(function (dat) {
                    // ruanganLast = dat.data[0].namaruangan;
                    medifirstService.get("tatarekening/get-data-sum-resep-kronis?norec=" + $scope.dataSelectedOK.norec_resep, true).then(function (dat) {
                        debugger;
                        total = "Rp." + " " + parseFloat(dat.data[0].total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        // totalBayar =  "Rp."  + " " + parseFloat(dat.data[0].totalBiaya).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        // totalDiscount =  "Rp."  + " " + parseFloat(dat.data[0].totaldiscound).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        var data = {
                            "gambarLogo": "logodokkes.jpg",
                            "paramKey": ["namaRS", "alamatRS", "printedBy", "noregistrasi", "total", "norec"],
                            "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", namauser, $scope.item.noregistrasi,
                                total, $scope.dataSelectedOK.norec_resep
                            ],
                            "paramType": ["", "", "", "", "", "", ""]
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

                        if (window.location.hostname.indexOf('localhost') > -1) {
                            xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetak23kronis.pdf');
                        } else {
                            xhr.open('POST', '/jasper1/generic/report/cetak23kronis.pdf');
                        }

                        // set `Content-Type` header
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                        xhr.responseType = 'blob';
                        // send rquest with JSON payload
                        xhr.send(JSON.stringify(data));
                        $scope.isRouteLoading = false;
                    });

                });

            }
            $scope.HapusResepPerItemTap = function () {
                debugger;

                $scope.selectedDatatap.forEach(function (items) {


                    var stt = 'false'
                    if (confirm('Hapus Obat Dari Ruangan ' + $scope.selectedDatatap.namaruangandepo)) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        return;
                        stt = 'false'
                    }
                    debugger;
                    // var objDelete = {norec:$scope.dataSelected.norec_resep}
                    var objDelete = {
                        produk: $scope.selectedDatatap,
                        datalogin: $scope.dataLogin
                    }
                    medifirstService.post('farmasi/save-hapus-pelayananobatperitemtap', objDelete).then(function (e) {
                        LoadCache()
                        init()
                    })
                    //##save Logging user
                    // medifirstService.get("logging/save-log-hapus-resep?norec_resep="
                    //      + $scope.selectedDatatap.norec_resep

                    //  ).then(function(data) {
                    //  }) 
                })
                //##end 

                // });

            }
            $scope.HapusResepPerItem23 = function () {
                debugger;

                $scope.selectedDataKronis.forEach(function (items) {


                    var stt = 'false'
                    if (confirm('Yakin Hapus obat?')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        return;
                        stt = 'false'
                    }
                    debugger;
                    if (stt == 'true') {
                        var objDelete = {
                            produk: $scope.selectedDataKronis,
                            datalogin: $scope.dataLogin
                        }
                        medifirstService.post('farmasi/save-hapus-pelayananobatperitemt23', objDelete).then(function (e) {
                            LoadCache()
                            init()
                        })
                    }



                })
                //##end 

                // });

            }
            $scope.HapusResep = function () {
                if ($scope.dataSelected.nostruk != undefined) {
                    window.messageContainer.error('Sudah verifikasi Tatarekening tidak dapat di hapus!')
                    return;
                }

                // * Validasi Untuk Sekali Bayar
                // if (statusPosting == true) {
                //     window.messageContainer.error('Data Sudah di Posting, Hubungi Bagian Akuntansi.')
                //     return;
                // }
                // * Validasi Untuk Sekali Bayar

                if ($scope.dataSelected.nostruk != undefined) {
                    window.messageContainer.error('Sudah verifikasi Tatarekening Tidak Bisa hapus Obat!')
                    return;
                } else {
                    var stt = 'false'
                    if (confirm('Hapus resep? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        return;
                        stt = 'false'
                    }
                    var objDelete = { norec: $scope.dataSelected.norec_resep }
                    medifirstService.post('farmasi/save-hapus-pelayananobat', objDelete).then(function (e) {
                        medifirstService.get("sysadmin/logging/save-log-hapus-resep?norec_resep=" +
                            $scope.dataSelected.norec_resep

                        ).then(function (data) {
                            LoadCache()
                        })


                    })
                    //##save Logging user

                    //##end 
                }
                // });

            }
            $scope.cetakEtiket = function () {
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=' + $scope.dataSelected.norec_resep + '&cetak=1', function (response) {
                    // aadc=response;
                });
            }
            $scope.cetakResep = function () {
                if ($scope.dataSelected == undefined) {
                    alert('Pilih resep yg akan di cetak')
                    return;
                }
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                    // aadc=response;
                });
            }
            $scope.cetakLabelResep = function () {
                // if ($scope.dataSelected == undefined || ) {
                //     alert('Pilih resep yg akan di cetak')
                //     return;
                // }
                if ($scope.selectedData2.length != 0) {

                    var stt = 'false'
                    if (confirm('View Label resep? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }

                    var Produkfk = ''
                    for (var i = $scope.selectedData2.length - 1; i >= 0; i--) {
                        Produkfk = Produkfk + ',' + $scope.selectedData2[i].produkfk
                    }

                    var norec = $scope.selectedData2[0].norec_resep
                    var user = $scope.selectedData2[0].detail.userData.namauser

                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiCeklis=' + norec + '&Produkfk=' + Produkfk + '&view=' + stt + '&user=' + user, function (response) {
                        // aadc=response;
                    });


                } else {
                    var stt = 'false'
                    if (confirm('View Label resep? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasi=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                        // aadc=response;
                    });
                }


            }


            $scope.cetakLabelIdentitas = function () {
                var stt = 'false'
                if (confirm('View Label Indentitas Pasien? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelIdentitasPasien=' + $scope.dataSelected.noregistrasi + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                    // aadc=response;
                });
            }


            $scope.cetakLabelResepAdm = function () {
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
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiAdmin=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                    // aadc=response;
                });
            }
            $scope.cetakLabelResepKemo = function () {
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
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiKemo=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                    // aadc=response;
                });
            }
            $scope.cetakLabelResepTPN = function () {
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
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiTPN=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                    // aadc=response;
                });
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

            $scope.CetakSEP = function (x) {
                if ($scope.item.noregistrasi != undefined && $scope.item.kelompokPasien !== "Umum/Pribadi") {

                    //##save identifikasi sep
                    medifirstService.get("sysadmin/settingdatafixed/get-report?namareport=sep" +
                        '&norec=' + $scope.item.noregistrasi
                    ).then(function (data) {
                        debugger;
                        var data = data.data.data;
                        $("#nosepx").text(data[0].nosep);
                        $("#nopendaftaran").text(data[0].noregistrasi);
                        $("#tglsep").text(data[0].tanggalsep);
                        $("#peserta").text(data[0].jenispeserta);
                        $("#nokartu").text(data[0].nokepesertaan + ' / ' + data[0].nocm);
                        // $("#cob").text(data[0].penjaminlaka);
                        $("#namapeserta").text(data[0].namapeserta);
                        $("#jenisrawat").text(data[0].jenisrawat);
                        $("#tgllahir").text((moment(data[0].tgllahir).format('YYYY-MM-DD')));
                        $("#kelasrawathak").text(data[0].namakelashak);
                        $("#kelasrawat").text(data[0].namakelas);
                        $("#notelepon").text(data[0].notelpmobile);
                        $("#penjamin").text(data[0].penjaminlakalantas);
                        $("#politujuan").text(data[0].namaruanganfix);
                        $("#prolanis").text(data[0].prolanisprb);
                        $("#faskesperujuk").text(data[0].nmprovider);
                        $("#diagnosaawal").text(data[0].namadiagnosa);
                        $("#catatan").text(data[0].catatan);
                        $("#cetakanke").text(1);
                        $("#namadjpjmelayani").text(data[0].namadjpjpmelayani);

                        var printdata = document.getElementById(x);
                        printdata = printdata.innerHTML;
                        // var editor = $("#editor").data("kendoEditor");
                        // editor.value(printdata);

                        var htmlStart =
                            '<!DOCTYPE html>' +
                            '<html style="border:none;border-color: white">' +
                            '<head style="border:none;border-color: white">' +
                            // '<div class="header" style="position: fixed;top: 0;">'+
                            // header +
                            '<style>' +
                            'html { font: 11pt sans-serif; }' +
                            '.k-grid { border-top-width: 0; }' +
                            '.k-grid, .k-grid-content { height: auto !important; }' +
                            '.k-grid-content { overflow: visible !important; }' +
                            '.k-grid .k-grid-header th { border-top: none; }' +
                            '.k-grid-toolbar, .k-grid-pager > .k-link { display: none; }' +
                            '</style>' +
                            '</div>' +
                            '</head>' +
                            '<body onload="window.print();window.close()" style="border:none; border-color: white">' +
                            '<table  style="border:none; border-color: white">' +
                            '<thead style="border:none;border-color: white">' +
                            '<tr style="border:none;border-color: white">' +
                            '<td style="border:none;border-color: white">' +
                            // '<div class="page-header-space"></div>' +
                            '<div style="border:none;border-color: white">' +
                            // header +                                
                            '</div>' +
                            '</td>' +
                            '</tr>' +
                            '</thead>' +
                            '<tbody>' +
                            '<tr>' +
                            '<td>'
                        var htmlEnd =
                            '</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</body>' +
                            '</div>' +


                            '</html>';
                        var printdata = document.getElementById(x);
                        printdata = printdata.innerHTML;
                        printdata = htmlStart + printdata + htmlEnd;
                        // var editor = $("#editor").data("kendoEditor");
                        // editor.value(printdata);

                        // var cetakan=htmlStart + printableContent + htmlEnd;
                        var WindowObject = window.open('', 'PrintWindow', 'width=1200,height=800,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes');


                        WindowObject.document.writeln(printdata);
                        WindowObject.document.close();
                        WindowObject.focus();

                    })
                }
            }

            $scope.cetakLabeKecil = function () {
                if ($scope.selectedData2.length != 0) {

                    var stt = 'false'
                    if (confirm('View Label resep? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }

                    var Produkfk = ''
                    for (var i = $scope.selectedData2.length - 1; i >= 0; i--) {
                        Produkfk = Produkfk + ',' + $scope.selectedData2[i].produkfk
                    }

                    var norec = $scope.selectedData2[0].norec_resep
                    var user = $scope.selectedData2[0].detail.userData.namauser

                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiKecil-ceklis=' + norec + '&Produkfk=' + Produkfk + '&view=' + stt + '&user=' + user, function (response) {
                        // aadc=response;
                    });


                } else {
                    var stt = 'false'
                    if (confirm('View Label resep? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiKecil=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                        // aadc=response;
                    });
                }
            }
            $scope.RincianObat = function () {
                // if ($scope.selectedData2.length != 0) {

                var stt = 'false'
                if (confirm('View Label resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                var Produkfk = ''
                // for (var i = $scope.selectedData2.length - 1; i >= 0; i--) {
                //     Produkfk = Produkfk + ',' + $scope.selectedData2[i].produkfk
                // }

                var norec = $scope.dataSelected.norec_resep
                var user = $scope.dataSelected.detail.userData.namauser

                var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiKecil-ceklis=' + norec + '&Produkfk=' + Produkfk + '&view=' + stt + '&user=' + user, function (response) {
                //     // aadc=response;
                // });
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresepceklis=1&nores=' + $scope.dataSelected.noregistrasi + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser + '&produkfk=' + Produkfk, function (response) {
                    // aadc=response;
                });


                // } else {
                //     var stt = 'false'
                //     if (confirm('View Label resep? ')) {
                //         // Save it!
                //         stt = 'true';
                //     } else {
                //         // Do nothing!
                //         stt = 'false'
                //     }
                //     var client = new HttpClient();
                //     client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiKecil=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                //         // aadc=response;
                //     });
                // }
            }
            // $scope.RincianObatApt = function () {
            //     // if ($scope.selectedData2.length != 0) {

            //         var stt = 'false'
            //         if (confirm('View Label resep? ')) {
            //             // Save it!
            //             stt = 'true';
            //         } else {
            //             // Do nothing!
            //             stt = 'false'
            //         }

            //         var Produkfk = ''
            //         // for (var i = $scope.selectedData2.length - 1; i >= 0; i--) {
            //         //     Produkfk = Produkfk + ',' + $scope.selectedData2[i].produkfk
            //         // }

            //         var norec = $scope.dataSelected.norec_resep
            //         var user = $scope.dataSelected.detail.userData.namauser

            //         var client = new HttpClient();
            //         // client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiKecil-ceklis=' + norec + '&Produkfk=' + Produkfk + '&view=' + stt + '&user=' + user, function (response) {
            //         //     // aadc=response;
            //         // });
            //         client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiayaObatAlkesApt=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&kdruangan=' + "" + '&view=' + stt + '&apt=1', function (response) {
            //                 // do something with response
            //             });


            //     // } else {
            //     //     var stt = 'false'
            //     //     if (confirm('View Label resep? ')) {
            //     //         // Save it!
            //     //         stt = 'true';
            //     //     } else {
            //     //         // Do nothing!
            //     //         stt = 'false'
            //     //     }
            //     //     var client = new HttpClient();
            //     //     client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiKecil=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
            //     //         // aadc=response;
            //     //     });
            //     // }
            // }

            $scope.cetakLabelRekap = function () {
                // if ($scope.selectedData2.length != 0) {

                var stt = 'false'
                if (confirm('View Label resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }

                //     var Produkfk = ''
                //     for (var i = $scope.selectedData2.length - 1; i >= 0; i--) {
                //         Produkfk = Produkfk + ',' + $scope.selectedData2[i].produkfk
                //     }

                //     var norec = $scope.selectedData2[0].norec_resep
                //     var user = $scope.selectedData2[0].detail.userData.namauser

                //     var client = new HttpClient();
                //     client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap-ceklis=' + norec + '&Produkfk=' + Produkfk + '&view=' + stt + '&user=' + user, function (response) {
                //         // aadc=response;
                //     });
                // } else {
                medifirstService.get("farmasi/get-data-waktuminum-resep?Norec_sr=" + $scope.dataSelected.norec_resep).then(function (dat) {
                    $scope.datas = dat.data;
                    var JmlPagi = 0;
                    var JmlSiang = 0;
                    var JmlSore = 0;
                    var JmlMalam = 0;
                    $scope.datas.forEach(function (element) {
                        var customData = {};
                        for (var key in element) {
                            switch (key) {
                                case "pagi":
                                    if (element.pagi != '-') {
                                        if (JmlPagi < 1) {
                                            JmlPagi = parseFloat(JmlPagi) + 1;
                                            // var stt = 'false'
                                            var isPagi = 'Pagi';
                                            var client = new HttpClient();
                                            client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + $scope.dataSelected.norec_resep + '&waktuMinum=' + isPagi + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) { });
                                        }
                                    }
                                    break;
                                case "siang":
                                    if (element.siang != '-') {
                                        if (JmlSiang < 1) {
                                            JmlSiang = parseFloat(JmlSiang) + 1;
                                            // var stt = 'false'
                                            var isSiang = 'Siang';
                                            var client = new HttpClient();
                                            client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + $scope.dataSelected.norec_resep + '&waktuMinum=' + isSiang + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) { });
                                        }
                                    }
                                    break;
                                case "sore":
                                    if (element.sore != '-') {
                                        if (JmlSore < 1) {
                                            JmlSore = parseFloat(JmlSore) + 1;
                                            // var stt = 'false'
                                            var isSore = 'Sore';
                                            var client = new HttpClient();
                                            client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + $scope.dataSelected.norec_resep + '&waktuMinum=' + isSore + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) { });
                                        }
                                    }
                                    break;
                                case "malam":
                                    if (element.malam != '-') {
                                        if (JmlMalam < 1) {
                                            JmlMalam = parseFloat(JmlMalam) + 1;
                                            // var stt = 'false'
                                            var isMalam = 'Malam';
                                            var client = new HttpClient();
                                            client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiRekap=' + $scope.dataSelected.norec_resep + '&waktuMinum=' + isMalam + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) { });
                                        }
                                    }
                                    break;
                                default:
                                    customData[key] = element[key];
                                    break;
                            }
                        };
                    });
                })
                // }
            }

            $scope.cetakNoAntrianFarmasi = function () {
                var stt = 'false'
                if (confirm('View Antrian Farmasi? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-buktiantrianfarmasi=' + $scope.dataSelected.noresep + '&noregistrasi=' + $scope.dataSelected.noregistrasi + '&view=' + stt, function (response) {
                    // aadc=response;
                });
            }

            $scope.cetakLabelRekapRajal = function () {
                // var stt = 'false'
                // if (confirm('View Label resep? ')) {
                //     // Save it!
                //     stt = 'true';
                // } else {
                //     // Do nothing!
                //     stt = 'false'
                // }
                // var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-labelrekap-rajal=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                //     // aadc=response;
                // });


                $scope.isRouteLoading = true;

                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "norec"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", $scope.dataSelected.norec_resep],
                    "paramType": ["", "date", "", ""]
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/eresep.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1002/generic/report/eresep.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/eresep.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', 'http://192.168.100.254:8797/generic/report/eresep.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', 'http://36.93.6.186:8797/generic/report/eresep.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/eresep.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/eresep.pdf');
                }

                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }
            $scope.baruPopUp = function () {
                // var stt = 'false'
                // if (confirm('View Label resep? ')) {
                //     // Save it!
                //     stt = 'true';
                // } else {
                //     // Do nothing!
                //     stt = 'false'
                // }
                // var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-labelrekap-rajal=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                //     // aadc=response;
                // });
                var norectemp = ''
                for (var i = $scope.selectedData3.length - 1; i >= 0; i--) {
                    if (norectemp == "") {
                        norectemp = "'" + $scope.selectedData3[i].norecpp + "'"
                    } else {
                        norectemp = norectemp + ',' + "'" + $scope.selectedData3[i].norecpp + "'"
                    }
                }
                $scope.isRouteLoading = true;
                debugger;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "norec"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", norectemp],
                    "paramType": ["", "date", "", ""]
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetakEtiket.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1001/generic/report/cetakEtiket.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1001/generic/report/cetakEtiket.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', 'http://192.168.100.254:8797/generic/report/cetakEtiket.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', 'http://36.93.6.186:8797/generic/report/cetakEtiket.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetakEtiket.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetakEtiket.pdf');
                }

                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }
            $scope.baruPopUp2 = function () {
                // var stt = 'false'
                // if (confirm('View Label resep? ')) {
                //     // Save it!
                //     stt = 'true';
                // } else {
                //     // Do nothing!
                //     stt = 'false'
                // }
                // var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-labelrekap-rajal=' + $scope.dataSelected.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelected.detail.userData.namauser, function (response) {
                //     // aadc=response;
                // });
                var norectemp = ''
                for (var i = $scope.selectedData3.length - 1; i >= 0; i--) {
                    if (norectemp == "") {
                        norectemp = "'" + $scope.selectedData3[i].norecpp + "'"
                    } else {
                        norectemp = norectemp + ',' + "'" + $scope.selectedData3[i].norecpp + "'"
                    }
                }
                $scope.isRouteLoading = true;
                debugger;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "norec"],
                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", norectemp],
                    "paramType": ["", "date", "", ""]
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetakEtiket2.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:1001/generic/report/cetakEtiket2.pdf');
                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                    xhr.open('POST', 'http://10.10.20.167:1001/generic/report/cetakEtiket2.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                    xhr.open('POST', 'http://192.168.100.254:8797/generic/report/cetakEtiket2.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', 'http://36.93.6.186:8797/generic/report/cetakEtiket2.pdf');
                } else if (window.location.hostname.indexOf('simrs') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/cetakEtiket2.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetakEtiket2.pdf');
                }

                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;

            }
            $scope.CetakResep23 = function () {
                if ($scope.dataSelectedOK == undefined) {
                    alert('Pilih resep yg akan di cetak')
                    return;
                }
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep-ok=1&nores=' + $scope.dataSelectedOK.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelectedOK.detail.userData.namauser, function (response) {
                    // aadc=response;
                });
            }

            $scope.CetakResepTap = function () {
                if ($scope.dataSelectedTap == undefined) {
                    alert('Pilih resep yg akan di cetak')
                    return;
                }
                var stt = 'false'
                if (confirm('View resep? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep-tap=1&nores=' + $scope.dataSelectedTap.noresep + '&view=' + stt + '&user=' + $scope.dataSelectedTap.detail.userData.namauser, function (response) {
                    // aadc=response;
                });
            }
            $scope.RincianObatOld = function () {
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noregistrasi + '?jenisdata=bill').then(function (dat) {
                    $scope.isRouteLoading = false;
                    var struk = "";
                    var kwitansi = "";
                    var stt = 'false'
                    if (confirm('View Rincian Obat & Alkes? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    // if ($scope.item.jenisPasien != "BPJS") {
                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var client = new HttpClient();
                        client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiayaObatAlkes=1&strnoregistrasi=' + $scope.item.noregistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&view=' + stt, function (response) {
                            // do something with response
                        });
                    })
                });

            }
            $scope.RincianObatDetail = function () {

                $scope.popupCetak.center().open()

            }
            $scope.cetakrincianz = function () {
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noregistrasi + '?jenisdata=bill').then(function (dat) {
                    $scope.isRouteLoading = false;
                    var struk = "";
                    var kwitansi = "";
                    var stt = 'false'
                    var kdruangan = ""
                    debugger
                    if ($scope.item.ruangan != undefined) {
                        kdruangan = $scope.item.ruangan.namaruangan;
                    }
                    if (confirm('View Rincian Obat & Alkes? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    // if ($scope.item.jenisPasien != "BPJS") {
                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var client = new HttpClient();
                        client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiayaObatAlkes=1&strnoregistrasi=' + $scope.item.noregistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&kdruangan=' + kdruangan + '&view=' + stt, function (response) {
                            // do something with response
                        });
                        $scope.popupCetak.close()
                    })
                });
            }

            $scope.RincianObatApt = function () {
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noregistrasi + '?jenisdata=bill').then(function (dat) {
                    $scope.isRouteLoading = false;
                    var struk = "";
                    var kwitansi = "";
                    var stt = 'false'
                    var kdruangan = ""
                    debugger
                    if ($scope.item.ruangan != undefined) {
                        kdruangan = $scope.item.ruangan.namaruangan;
                    }
                    if (confirm('View Rincian Obat & Alkes? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    // if ($scope.item.jenisPasien != "BPJS") {
                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var client = new HttpClient();
                        medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                            var client = new HttpClient();
                            client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiayaObatAlkesApt=1&strNoregistrasi=' + $scope.item.noregistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&kdruangan=' + "" + '&view=' + stt + '&apt=1', function (response) {
                                // do something with response
                            });
                        })
                    })
                });
            }
            $scope.RincianObatTap = function () {
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noregistrasi + '?jenisdata=bill').then(function (dat) {
                    $scope.isRouteLoading = false;
                    var struk = "";
                    var kwitansi = "";
                    var stt = 'false'
                    if (confirm('View Rincian Obat & Alkes? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    // if ($scope.item.jenisPasien != "BPJS") {
                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var client = new HttpClient();
                        client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiayaObatAlkesTap=1&strnoregistrasi=' + $scope.item.noregistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&view=' + stt, function (response) {
                            // do something with response
                        });
                    })
                });

            }
            $scope.RincianObatTapjs = function () {
                $scope.isRouteLoading = true;
                var ruanganLast = "";
                var total = "";
                var namauser = "";
                var kelas = $scope.item.kelasrawat
                if ($scope.item.kelompokPasien != "Umum/Pribadi") {
                    kelas = $scope.item.kelasPenjamin
                }
                var namakamar = $scope.item.namakamar
                // medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noregistrasi + '?jenisdata=bill').then(function (dat) {
                medifirstService.get("tatarekening/get-data-login-cetakan-ruangan-last?noregistrasi=" + $scope.item.noregistrasi, true).then(function (dat) {
                    ruanganLast = dat.data[0].namaruangan;
                    medifirstService.get("tatarekening/get-data-login-cetakan?noregistrasi=" + $scope.item.noregistrasi, true).then(function (dat) {
                        total = "Rp." + " " + parseFloat(dat.data[0].total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        var data = {
                            "gambarLogo": "logodokkes.jpg",
                            "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi", "lastruangan", "total", "kelas", "namakamar"],
                            "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", namauser, $scope.item.noregistrasi,
                                ruanganLast, total, kelas, namakamar
                            ],
                            "paramType": ["", "date", "", "", "", "", "", "", ""]
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
                            xhr.open('POST', 'http://192.168.0.62:1002/generic/report/rekapbillingApotiktap.pdf');
                        } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                            xhr.open('POST', 'http://192.168.88.56:1002/generic/report/rekapbillingApotiktap.pdf');
                        } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                            xhr.open('POST', 'http://10.10.20.167:1002/generic/report/rekapbillingApotiktap.pdf');
                        } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                            xhr.open('POST', 'http://192.168.100.254:8797/generic/report/rekapbillingApotiktap.pdf');
                        } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                            xhr.open('POST', 'http://36.93.6.186:8797/generic/report/rekapbillingApotiktap.pdf');
                        } else {
                            xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingApotiktap.pdf');
                        }

                        // set `Content-Type` header
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                        xhr.responseType = 'blob';
                        // send rquest with JSON payload
                        xhr.send(JSON.stringify(data));
                        $scope.isRouteLoading = false;
                    });

                });

            }

            $scope.RincianesepObatJs = function () {
                $scope.isRouteLoading = true;
                var ruanganLast = "";
                var total = "";
                var totalDiscount = "";
                var totalBayar = "";
                var namauser = "";
                var umur = $scope.item.umur;
                var kelas = $scope.item.kelasrawat
                var totaljumlah = 0;
                if ($scope.item.kelompokPasien != "Umum/Pribadi") {
                    kelas = $scope.item.kelasPenjamin
                }
                var namakamar = $scope.item.namakamar;
                namauser = $scope.dataSelected.detail.userData.namauser;
                // medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noregistrasi + '?jenisdata=bill').then(function (dat) {
                medifirstService.get("tatarekening/get-data-login-cetakan-ruangan-last?noregistrasi=" + $scope.item.noregistrasi, true).then(function (dat) {
                    ruanganLast = dat.data[0].namaruangan;
                    medifirstService.get("tatarekening/get-data-sum-resep?norec=" + $scope.dataSelected.norec_resep, true).then(function (dat) {
                        debugger;
                        total = "Rp." + " " + parseFloat(dat.data[0].totalharga).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        // totalBayar = "Rp." + " " + parseFloat(dat.data[0].totalBiaya).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        totalDiscount = "Rp." + " " + parseFloat(dat.data[0].totaldiscound).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        totaljumlah = parseFloat(dat.data[0].totalharga) - parseFloat(dat.data[0].totaldiscound);
                        totalBayar = "Rp." + " " + totaljumlah.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        var data = {
                            "gambarLogo": "logodokkes.jpg",
                            "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi", "lastruangan", "total", "kelas", "namakamar", "norec", "totalAkhir", "discount", "umur"],
                            "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", namauser, $scope.item.noregistrasi,
                                ruanganLast, total, kelas, namakamar, $scope.dataSelected.norec_resep, totalBayar, totalDiscount, umur
                            ],
                            "paramType": ["", "date", "", "", "", "", "", "", "", "", "", "", ""]
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
                            xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetakResepRIncian.pdf');
                        } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                            xhr.open('POST', 'http://192.168.88.56:1002/generic/report/cetakResepRIncian.pdf');
                        } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                            xhr.open('POST', 'http://10.10.20.167:1002/generic/report/cetakResepRIncian.pdf');
                        } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                            xhr.open('POST', 'http://192.168.100.254:8797/generic/report/cetakResepRIncian.pdf');
                        } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                            xhr.open('POST', 'http://36.93.6.186:8797/report/cetakResepRIncian.pdf');
                        } else if (window.location.hostname.indexOf('simrs') > -1) {
                            xhr.open('POST', '/jasper1/generic/report/cetakResepRIncian.pdf');
                        } else {
                            xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetakResepRIncian.pdf');
                        }

                        // set `Content-Type` header
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                        xhr.responseType = 'blob';
                        // send rquest with JSON payload
                        xhr.send(JSON.stringify(data));
                        $scope.isRouteLoading = false;
                    });

                });

            }
            $scope.cetakLabelResep23 = function () {
                if ($scope.selectedDataKronis.length != 0) {
                    var stt = 'false'
                    if (confirm('View Label resep? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }

                    var Produkfk = ''
                    for (var i = $scope.selectedDataKronis.length - 1; i >= 0; i--) {
                        Produkfk = Produkfk + ',' + $scope.selectedDataKronis[i].produkfk
                    }

                    var norec = $scope.selectedDataKronis[0].norec_resep
                    var user = $scope.selectedDataKronis[0].detail.userData.namauser

                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasiCeklis-Ok=' + norec + '&Produkfk=' + Produkfk + '&view=' + stt + '&user=' + user, function (response) {
                        // aadc=response;
                    });

                } else {
                    var stt = 'false'
                    if (confirm('View Label resep? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/farmasi?cetak-LabelFarmasi-ok=' + $scope.dataSelectedOK.norec_resep + '&view=' + stt + '&user=' + $scope.dataSelectedOK.detail.userData.namauser, function (response) {
                        // aadc=response;
                    });
                }
            }
            $scope.cetakJasper = function () {
                debugger

                $scope.isRouteLoading = true;

                var ruanganLast = "";
                var total = "";
                var namauser = "";
                if ($scope.dataSelected == undefined || $scope.dataSelected == "") {
                    alert("Klik Salah Sutu Data!!")
                    return;
                } else {
                    namauser = $scope.dataSelected.detail.userData.namauser;
                }

                var kelas = $scope.item.kelasrawat
                if ($scope.item.kelompokPasien != "Umum/Pribadi") {
                    kelas = $scope.item.kelasPenjamin
                }
                var namakamar = $scope.item.namakamar
                medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noregistrasi + '?jenisdata=bill').then(function (dat) {
                    medifirstService.get("tatarekening/get-data-login-cetakan-ruangan-last?noregistrasi=" + $scope.item.noregistrasi, true).then(function (dat) {
                        ruanganLast = dat.data[0].namaruangan;
                        medifirstService.get("tatarekening/get-data-login-cetakan?noregistrasi=" + $scope.item.noregistrasi, true).then(function (dat) {
                            total = "Rp." + " " + parseFloat(dat.data[0].total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            var data = {
                                "gambarLogo": "logodokkes.jpg",
                                "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi", "lastruangan", "total", "kelas", "namakamar"],
                                "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", namauser, $scope.item.noregistrasi,
                                    ruanganLast, total, kelas, namakamar
                                ],
                                "paramType": ["", "date", "", "", "", "", "", "", ""]
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
                                xhr.open('POST', 'http://192.168.0.62:1002/generic/report/rekapbillingApotik.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:1002/generic/report/rekapbillingApotik.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:1002/generic/report/rekapbillingApotik.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', 'http://192.168.100.254:8797/generic/report/rekapbillingApotik.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://36.93.6.186:8797/generic/report/rekapbillingApotik.pdf');
                            } else if (window.location.hostname.indexOf('simrs') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingApotik.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingApotik.pdf');
                            }

                            // set `Content-Type` header
                            xhr.setRequestHeader('Content-Type', 'application/json');
                            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                            xhr.responseType = 'blob';
                            // send rquest with JSON payload
                            xhr.send(JSON.stringify(data));
                            $scope.isRouteLoading = false;
                        });

                    });
                });




            }
            //***********************************
        }
    ]);
});

// http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1