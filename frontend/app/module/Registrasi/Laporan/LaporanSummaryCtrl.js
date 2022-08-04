define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('LaporanSummaryCtrl', ['CacheHelper', '$scope', 'MedifirstService', 'DateHelper',
        function (cacheHelper, $scope, medifirstService, DateHelper,) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.isRouteLoading = false;

            loadCombo()
            LoadData()
            $scope.SearchData = function () {
                LoadData()
            }

            function loadCombo() {
                medifirstService.get("registrasi/laporan/get-combo-box-laporan-summary")
                    .then(function (data) {
                        $scope.listRuangans = data.data.ruanganrajal
                    })

                medifirstService.get("registrasi/laporan/get-data-combo-laporan", true).then(function (data) {
                    $scope.listKelompokPasien = data.data.kelompokpasien;
                })

            }

            $scope.CariLapPendapatanPoli = function () {
                LoadData()
            }

            function LoadData() {

                $scope.isRouteLoading = true;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;

                var tempRuanganId = ""
                if ($scope.item.ruangan != undefined) {
                    tempRuanganId = "&ruanganId=" + $scope.item.ruangan.id
                }

                var tempKelPasienId = "";
                if ($scope.item.kelompokPasien != undefined) {
                    tempKelPasienId = "&kelompokPasien=" + $scope.item.kelompokPasien.id;
                }



                var chacePeriode = {
                    0: tglAwal,
                    1: tglAkhir
                }
                cacheHelper.set('LaporanSummaryCtrl', chacePeriode);

                medifirstService.get("registrasi/laporan/get-data-lap-summary-kunjungan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId +
                    tempKelPasienId).then(function (data) {
                        // $scope.totallaki = 0;
                        // $scope.totalwanita = 0;
                        // $scope.totalbaru = 0;
                        // $scope.totallama = 0;
                        // $scope.jumlahkunjungan = 0;
                        var data = data.data
                        var group = []
                        var podo = false
                        for (var i = 0; i < data.length; i++) {
                            var element1 = data[i]
                            podo = false
                            for (var x = 0; x < group.length; x++) {
                                var element = group[x]
                                // var jumlah = 
                                group[x].no = x + 1
                                if (element.namaruangan == element1.namaruangan && element.kelompokpasien == element1.kelompokpasien) {

                                    // $scope.totallaki= $scope.totallaki + parseFloat(group[x].laki)
                                    // $scope.totalwanita= $scope.totalwanita + parseFloat(group[x].wanita)
                                    // $scope.totalbaru= $scope.totalbaru + parseFloat(group[x].baru)
                                    // $scope.totallama= $scope.totallama + parseFloat(group[x].lama)
                                    // $scope.totaljumlah = $scope.totaljumlah + parseFloat(group[x].jumlah)

                                    element.laki = parseFloat(element.laki) + parseFloat(element1.laki)
                                    element.wanita = parseFloat(element.wanita) + parseFloat(element1.wanita)
                                    element.baru = parseFloat(element.baru) + parseFloat(element1.baru)
                                    element.lama = parseFloat(element.lama) + parseFloat(element1.lama)
                                    // element.jumlah = parseFloat(element.laki) + parseFloat(element.wanita)
                                    // element.total = parseFloat(element.jumlah) + parseFloat(element1.jumlah)  
                                    podo = true
                                }
                            }
                            if (podo == false) {
                                var datass = {
                                    baru: element1.baru,
                                    kelompokpasien: element1.kelompokpasien,
                                    laki: element1.laki,
                                    lama: element1.lama,
                                    namaruangan: element1.namaruangan,
                                    wanita: element1.wanita,
                                }
                                group.push(datass)
                            }

                        }

                        for (var i = 0; i < group.length; i++) {
                            var elemn = group[i]
                            elemn.jumlah = parseFloat(elemn.laki) + parseFloat(elemn.wanita)
                            elemn.total = parseFloat(elemn.jumlah) + parseFloat(elemn.jumlah)
                        }
                        $scope.dataSourceGridK = {
                            // group: $scope.group,
                            data: group,
                            pageSize: 10,
                            total: group.length,
                            serverPaging: false,
                            schema:
                            // {
                            //     model: {
                            //         fields: {
                            //         }
                            //     }
                            // }
                            {
                                model: {
                                    fields: {
                                        namaruangan: { type: "string" },
                                        laki: { type: "number" },
                                        wanita: { type: "number" },
                                        baru: { type: "number" },
                                        lama: { type: "number" },
                                        jumlah: { type: "number" },
                                    }
                                }
                            },
                            pageSize: 200,
                            total: group.length,
                            serverPaging: false,
                            group: [{
                                field: "namaruangan",
                                aggregates: [
                                    { field: 'laki', aggregate: 'sum' },
                                    { field: "wanita", aggregate: 'sum' },
                                    { field: "baru", aggregate: 'sum' },
                                    { field: "lama", aggregate: 'sum' },
                                    { field: "jumlah", aggregate: 'sum' },
                                ]
                            },],
                            aggregate: [
                                { field: 'laki', aggregate: 'sum' },
                                { field: "wanita", aggregate: 'sum' },
                                { field: 'baru', aggregate: 'sum' },
                                { field: "lama", aggregate: 'sum' },
                                { field: "jumlah", aggregate: 'sum' },
                            ]


                        }
                        // $scope.isRouteLoading = false;
                    })

                medifirstService.get("registrasi/laporan/get-data-lap-summary-usia?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId +
                    tempKelPasienId).then(function (data) {
                        $scope.isRouteLoading = false;
                        var data2 = data.data;
                        for (var i = 0; i < data2.length; i++) {
                            data2[i].no = i + 1
                        }
                        $scope.dataSourceGridDUsia = new kendo.data.DataSource({
                            data: data2,
                            group: $scope.group,
                            pageSize: 100,
                            total: data2.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        jml: { type: "number" },
                                    }
                                }
                            },
                            aggregate: [
                                { field: "jml", aggregate: "sum" },
                            ]
                        });
                    });

                medifirstService.get("registrasi/laporan/get-data-lap-summary-pendidikan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId +
                    tempKelPasienId).then(function (data) {
                        // $scope.totallaki = 0;
                        // $scope.totalwanita = 0;
                        // $scope.totalbaru = 0;
                        // $scope.totallama = 0;
                        // $scope.jumlahkunjungan = 0;
                        var data = data.data
                        var group = []
                        var podo = false
                        for (var i = 0; i < data.length; i++) {
                            var element1 = data[i]
                            podo = false
                            for (var x = 0; x < group.length; x++) {
                                var element = group[x]
                                // var jumlah = 
                                group[x].no = x + 1
                                if (element.pendidikan == element1.pendidikan) {

                                    element.psikiatri = parseFloat(element.psikiatri) + parseFloat(element1.psikiatri)
                                    element.nonpsi = parseFloat(element.nonpsi) + parseFloat(element1.nonpsi)
                                    podo = true
                                }
                            }
                            if (podo == false) {
                                var datass = {
                                    pendidikan: element1.pendidikan,
                                    nonpsi: element1.nonpsi,
                                    psikiatri: element1.psikiatri,
                                }
                                group.push(datass)
                            }

                        }

                        for (var i = 0; i < group.length; i++) {
                            var elemn = group[i]
                            elemn.jumlah = parseFloat(elemn.psikiatri) + parseFloat(elemn.nonpsi)
                            elemn.total = parseFloat(elemn.jumlah) + parseFloat(elemn.jumlah)
                        }
                        $scope.dataSourceGridP = {
                            // group: $scope.group,
                            data: group,
                            pageSize: 10,
                            total: group.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        nonpsi: { type: "number" },
                                        psikiatri: { type: "number" },
                                        jumlah: { type: "number" },
                                    }
                                }
                            },
                            pageSize: 200,
                            total: group.length,
                            serverPaging: false,

                            aggregate: [
                                { field: 'nonpsi', aggregate: 'sum' },
                                { field: "psikiatri", aggregate: 'sum' },
                                { field: "jumlah", aggregate: 'sum' },
                            ]


                        }
                        // $scope.isRouteLoading = false;
                    })

                medifirstService.get("registrasi/laporan/get-data-lap-summary-daerah?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId +
                    tempKelPasienId).then(function (data) {
                        // $scope.totallaki = 0;
                        // $scope.totalwanita = 0;
                        // $scope.totalbaru = 0;
                        // $scope.totallama = 0;
                        // $scope.jumlahkunjungan = 0;
                        var data = data.data
                        var group = []
                        var podo = false
                        for (var i = 0; i < data.length; i++) {
                            var element1 = data[i]
                            podo = false
                            for (var x = 0; x < group.length; x++) {
                                var element = group[x]
                                // var jumlah = 
                                group[x].no = x + 1
                                if (element.namakotakabupaten == element1.namakotakabupaten) {

                                    element.psikiatri = parseFloat(element.psikiatri) + parseFloat(element1.psikiatri)
                                    element.nonpsi = parseFloat(element.nonpsi) + parseFloat(element1.nonpsi)
                                    podo = true
                                }
                            }
                            if (podo == false) {
                                var datass = {
                                    namakotakabupaten: element1.namakotakabupaten,
                                    nonpsi: element1.nonpsi,
                                    psikiatri: element1.psikiatri,
                                }
                                group.push(datass)
                            }

                        }

                        for (var i = 0; i < group.length; i++) {
                            var elemn = group[i]
                            elemn.jumlah = parseFloat(elemn.psikiatri) + parseFloat(elemn.nonpsi)
                            elemn.total = parseFloat(elemn.jumlah) + parseFloat(elemn.jumlah)
                        }
                        $scope.dataSourceGridD = {
                            // group: $scope.group,
                            data: group,
                            pageSize: 10,
                            total: group.length,
                            serverPaging: false,
                            schema:
                            // {
                            //     model: {
                            //         fields: {
                            //         }
                            //     }
                            // }
                            {
                                model: {
                                    fields: {
                                        // namaruangan: { type: "string" },
                                        nonpsi: { type: "number" },
                                        psikiatri: { type: "number" },
                                        jumlah: { type: "number" },
                                    }
                                }
                            },
                            pageSize: 200,
                            // total: group.length,
                            serverPaging: false,
                            aggregate: [
                                { field: 'nonpsi', aggregate: 'sum' },
                                { field: "psikiatri", aggregate: 'sum' },
                                { field: "jumlah", aggregate: 'sum' },
                            ]


                        }
                        // $scope.isRouteLoading = false;
                    })

                medifirstService.get("registrasi/laporan/get-data-lap-summary-daerahkecamatan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId +
                    tempKelPasienId).then(function (data) {
                        // $scope.totallaki = 0;
                        // $scope.totalwanita = 0;
                        // $scope.totalbaru = 0;
                        // $scope.totallama = 0;
                        // $scope.jumlahkunjungan = 0;
                        var data = data.data
                        var group = []
                        var podo = false
                        for (var i = 0; i < data.length; i++) {
                            var element1 = data[i]
                            podo = false
                            for (var x = 0; x < group.length; x++) {
                                var element = group[x]
                                // var jumlah = 
                                group[x].no = x + 1
                                if (element.namakotakabupaten == element1.namakotakabupaten) {

                                    element.psikiatri = parseFloat(element.psikiatri) + parseFloat(element1.psikiatri)
                                    element.nonpsi = parseFloat(element.nonpsi) + parseFloat(element1.nonpsi)
                                    podo = true
                                }
                            }
                            if (podo == false) {
                                var datass = {
                                    namakotakabupaten: element1.namakotakabupaten,
                                    namakecamatan: element1.namakecamatan,
                                    nonpsi: element1.nonpsi,
                                    psikiatri: element1.psikiatri,
                                }
                                group.push(datass)
                            }

                        }

                        for (var i = 0; i < group.length; i++) {
                            var elemn = group[i]
                            elemn.jumlah = parseFloat(elemn.psikiatri) + parseFloat(elemn.nonpsi)
                            elemn.total = parseFloat(elemn.jumlah) + parseFloat(elemn.jumlah)
                        }
                        $scope.dataSourceGridDkecamatan = {
                            // group: $scope.group,
                            data: group,
                            pageSize: 10,
                            total: group.length,
                            serverPaging: false,
                            schema:
                            // {
                            //     model: {
                            //         fields: {
                            //         }
                            //     }
                            // }
                            {
                                model: {
                                    fields: {
                                        // namaruangan: { type: "string" },
                                        nonpsi: { type: "number" },
                                        psikiatri: { type: "number" },
                                        jumlah: { type: "number" },
                                    }
                                }
                            },
                            pageSize: 200,
                            // total: group.length,
                            serverPaging: false,
                            aggregate: [
                                { field: 'nonpsi', aggregate: 'sum' },
                                { field: "psikiatri", aggregate: 'sum' },
                                { field: "jumlah", aggregate: 'sum' },
                            ]


                        }
                        // $scope.isRouteLoading = false;
                    })

                medifirstService.get("registrasi/laporan/get-data-lap-summary-pekerjaan?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId +
                    tempKelPasienId).then(function (data) {
                        // $scope.totallaki = 0;
                        // $scope.totalwanita = 0;
                        // $scope.totalbaru = 0;
                        // $scope.totallama = 0;
                        // $scope.jumlahkunjungan = 0;
                        var data = data.data
                        var group = []
                        var podo = false
                        for (var i = 0; i < data.length; i++) {
                            var element1 = data[i]
                            podo = false
                            for (var x = 0; x < group.length; x++) {
                                var element = group[x]
                                // var jumlah = 
                                group[x].no = x + 1
                                if (element.pekerjaan == element1.pekerjaan) {

                                    element.psikiatri = parseFloat(element.psikiatri) + parseFloat(element1.psikiatri)
                                    element.nonpsi = parseFloat(element.nonpsi) + parseFloat(element1.nonpsi)
                                    podo = true
                                }
                            }
                            if (podo == false) {
                                var datass = {
                                    pekerjaan: element1.pekerjaan,
                                    nonpsi: element1.nonpsi,
                                    psikiatri: element1.psikiatri,
                                }
                                group.push(datass)
                            }

                        }

                        for (var i = 0; i < group.length; i++) {
                            var elemn = group[i]
                            elemn.jumlah = parseFloat(elemn.psikiatri) + parseFloat(elemn.nonpsi)
                            elemn.total = parseFloat(elemn.jumlah) + parseFloat(elemn.jumlah)
                        }
                        $scope.dataSourceGridPek = {
                            // group: $scope.group,
                            data: group,
                            pageSize: 10,
                            total: group.length,
                            serverPaging: false,
                            schema:
                            // {
                            //     model: {
                            //         fields: {
                            //         }
                            //     }
                            // }
                            {
                                model: {
                                    fields: {
                                        // namaruangan: { type: "string" },
                                        nonpsi: { type: "number" },
                                        psikiatri: { type: "number" },
                                        jumlah: { type: "number" },
                                    }
                                }
                            },
                            pageSize: 200,
                            // total: group.length,
                            serverPaging: false,
                            aggregate: [
                                { field: 'nonpsi', aggregate: 'sum' },
                                { field: "psikiatri", aggregate: 'sum' },
                                { field: "jumlah", aggregate: 'sum' },
                            ]


                        }
                        // $scope.isRouteLoading = false;
                    })

                medifirstService.get("registrasi/laporan/get-data-lap-summary-agama?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId +
                    tempKelPasienId).then(function (data) {
                        // $scope.totallaki = 0;
                        // $scope.totalwanita = 0;
                        // $scope.totalbaru = 0;
                        // $scope.totallama = 0;
                        // $scope.jumlahkunjungan = 0;
                        var data = data.data
                        var group = []
                        var podo = false
                        for (var i = 0; i < data.length; i++) {
                            var element1 = data[i]
                            podo = false
                            for (var x = 0; x < group.length; x++) {
                                var element = group[x]
                                // var jumlah = 
                                group[x].no = x + 1
                                if (element.agama == element1.agama) {

                                    element.psikiatri = parseFloat(element.psikiatri) + parseFloat(element1.psikiatri)
                                    element.nonpsi = parseFloat(element.nonpsi) + parseFloat(element1.nonpsi)
                                    podo = true
                                }
                            }
                            if (podo == false) {
                                var datass = {
                                    agama: element1.agama,
                                    nonpsi: element1.nonpsi,
                                    psikiatri: element1.psikiatri,
                                }
                                group.push(datass)
                            }

                        }

                        for (var i = 0; i < group.length; i++) {
                            var elemn = group[i]
                            elemn.jumlah = parseFloat(elemn.psikiatri) + parseFloat(elemn.nonpsi)
                            elemn.total = parseFloat(elemn.jumlah) + parseFloat(elemn.jumlah)
                        }
                        $scope.dataSourceGridAg = {
                            // group: $scope.group,
                            data: group,
                            pageSize: 10,
                            total: group.length,
                            serverPaging: false,
                            schema:
                            // {
                            //     model: {
                            //         fields: {
                            //         }
                            //     }
                            // }
                            {
                                model: {
                                    fields: {
                                        // namaruangan: { type: "string" },
                                        nonpsi: { type: "number" },
                                        psikiatri: { type: "number" },
                                        jumlah: { type: "number" },
                                    }
                                }
                            },
                            pageSize: 200,
                            // total: group.length,
                            serverPaging: false,
                            aggregate: [
                                { field: 'nonpsi', aggregate: 'sum' },
                                { field: "psikiatri", aggregate: 'sum' },
                                { field: "jumlah", aggregate: 'sum' },
                            ]


                        }
                        // $scope.isRouteLoading = false;
                    })
                medifirstService.get("registrasi/laporan/get-data-lap-summary-ger?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId +
                    tempKelPasienId).then(function (data) {
                        // $scope.totallaki = 0;
                        // $scope.totalwanita = 0;
                        // $scope.totalbaru = 0;
                        // $scope.totallama = 0;
                        // $scope.jumlahkunjungan = 0;
                        var data = data.data
                        var group = []
                        var podo = false
                        debugger;
                        for (var i = 0; i < data.length; i++) {
                            var element1 = data[i]
                            podo = false
                            // debugger;
                            for (var x = 0; x < group.length; x++) {
                                var element = group[x]
                                // var jumlah = 
                                group[x].no = x + 1
                                if (element.namadepartemen == element1.namadepartemen) {
                                    if (element.jan)
                                        element.jan = parseFloat(element.jan) + parseFloat(element1.jan)
                                    element.feb = parseFloat(element.feb) + parseFloat(element1.feb)
                                    element.mar = parseFloat(element.mar) + parseFloat(element1.mar)
                                    element.apr = parseFloat(element.apr) + parseFloat(element1.apr)
                                    element.mei = parseFloat(element.mei) + parseFloat(element1.mei)
                                    element.jun = parseFloat(element.jun) + parseFloat(element1.jun)
                                    element.jul = parseFloat(element.jul) + parseFloat(element1.jul)
                                    element.agus = parseFloat(element.agus) + parseFloat(element1.agus)
                                    element.sep = parseFloat(element.sep) + parseFloat(element1.sep)
                                    element.okt = parseFloat(element.okt) + parseFloat(element1.okt)
                                    element.nov = parseFloat(element.nov) + parseFloat(element1.nov)
                                    element.des = parseFloat(element.des) + parseFloat(element1.des)
                                    // element.NONPSI = parseFloat(element.NONPSI) + parseFloat(element1.NONPSI)
                                    podo = true
                                }
                            }
                            if (podo == false) {
                                var datass = {
                                    namadepartemen: element1.namadepartemen,
                                    jan: element1.jan,
                                    feb: element1.feb,
                                    mar: element1.mar,
                                    apr: element1.apr,
                                    mei: element1.mei,
                                    jun: element1.jun,
                                    jul: element1.jul,
                                    agus: element1.agus,
                                    sep: element1.sep,
                                    okt: element1.okt,
                                    nov: element1.nov,
                                    des: element1.des,
                                }
                                group.push(datass)
                            }

                        }

                        for (var i = 0; i < group.length; i++) {
                            var elemn = group[i]
                            elemn.jumlah = parseFloat(elemn.jan) + parseFloat(elemn.feb) +
                                parseFloat(elemn.mar) +
                                parseFloat(elemn.apr) +
                                parseFloat(elemn.mei) +
                                parseFloat(elemn.jun) +
                                parseFloat(elemn.jul) +
                                parseFloat(elemn.agus) +
                                parseFloat(elemn.sep) +
                                parseFloat(elemn.okt) +
                                parseFloat(elemn.nov) +
                                parseFloat(elemn.des)
                            elemn.total = parseFloat(elemn.jumlah) + parseFloat(elemn.jumlah)
                        }
                        $scope.dataSourceGridGeri1 = {
                            data: group,
                            pageSize: 10,
                            total: group.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        // namaruangan: { type: "string" },
                                        jan: { type: "number" },
                                        feb: { type: "number" },
                                        mar: { type: "number" },
                                        apr: { type: "number" },
                                        mei: { type: "number" },
                                        jun: { type: "number" },
                                        jul: { type: "number" },
                                        agus: { type: "number" },
                                        sep: { type: "number" },
                                        okt: { type: "number" },
                                        nov: { type: "number" },
                                        des: { type: "number" },
                                        jumlah: { type: "number" },
                                    }
                                }
                            },
                            pageSize: 200,
                            // total: group.length,
                            serverPaging: false,
                            aggregate: [
                                { field: 'jan', aggregate: 'sum' },
                                { field: "feb", aggregate: 'sum' },
                                { field: 'mar', aggregate: 'sum' },
                                { field: "apr", aggregate: 'sum' },
                                { field: 'mei', aggregate: 'sum' },
                                { field: "jun", aggregate: 'sum' },
                                { field: 'jul', aggregate: 'sum' },
                                { field: "agus", aggregate: 'sum' },
                                { field: 'sep', aggregate: 'sum' },
                                { field: "okt", aggregate: 'sum' },
                                { field: 'nov', aggregate: 'sum' },
                                { field: "des", aggregate: 'sum' },
                                { field: "jumlah", aggregate: 'sum' },
                            ]


                        }
                    })

                medifirstService.get("registrasi/laporan/get-data-lap-summary-ger2?" +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    tempRuanganId +
                    tempKelPasienId).then(function (data) {
                        // $scope.totallaki = 0;
                        // $scope.totalwanita = 0;
                        // $scope.totalbaru = 0;
                        // $scope.totallama = 0;
                        // $scope.jumlahkunjungan = 0;
                        var data = data.data
                        var group = []
                        var podo = false
                        debugger;
                        for (var i = 0; i < data.length; i++) {
                            var element1 = data[i]
                            podo = false
                            // debugger;
                            for (var x = 0; x < group.length; x++) {
                                var element = group[x]
                                // var jumlah = 
                                group[x].no = x + 1
                                if (element.namaruangan == element1.namaruangan) {
                                    if (element.jan)
                                        element.jan = parseFloat(element.jan) + parseFloat(element1.jan)
                                    element.feb = parseFloat(element.feb) + parseFloat(element1.feb)
                                    element.mar = parseFloat(element.mar) + parseFloat(element1.mar)
                                    element.apr = parseFloat(element.apr) + parseFloat(element1.apr)
                                    element.mei = parseFloat(element.mei) + parseFloat(element1.mei)
                                    element.jun = parseFloat(element.jun) + parseFloat(element1.jun)
                                    element.jul = parseFloat(element.jul) + parseFloat(element1.jul)
                                    element.agus = parseFloat(element.agus) + parseFloat(element1.agus)
                                    element.sep = parseFloat(element.sep) + parseFloat(element1.sep)
                                    element.okt = parseFloat(element.okt) + parseFloat(element1.okt)
                                    element.nov = parseFloat(element.nov) + parseFloat(element1.nov)
                                    element.des = parseFloat(element.des) + parseFloat(element1.des)
                                    // element.NONPSI = parseFloat(element.NONPSI) + parseFloat(element1.NONPSI)
                                    podo = true
                                }
                            }
                            if (podo == false) {
                                var datass = {
                                    namaruangan: element1.namaruangan,
                                    jan: element1.jan,
                                    feb: element1.feb,
                                    mar: element1.mar,
                                    apr: element1.apr,
                                    mei: element1.mei,
                                    jun: element1.jun,
                                    jul: element1.jul,
                                    agus: element1.agus,
                                    sep: element1.sep,
                                    okt: element1.okt,
                                    nov: element1.nov,
                                    des: element1.des,
                                }
                                group.push(datass)
                            }

                        }

                        for (var i = 0; i < group.length; i++) {
                            var elemn = group[i]
                            elemn.jumlah = parseFloat(elemn.jan) + parseFloat(elemn.feb) +
                                parseFloat(elemn.mar) +
                                parseFloat(elemn.apr) +
                                parseFloat(elemn.mei) +
                                parseFloat(elemn.jun) +
                                parseFloat(elemn.jul) +
                                parseFloat(elemn.agus) +
                                parseFloat(elemn.sep) +
                                parseFloat(elemn.okt) +
                                parseFloat(elemn.nov) +
                                parseFloat(elemn.des)
                            elemn.total = parseFloat(elemn.jumlah) + parseFloat(elemn.jumlah)
                        }
                        $scope.dataSourceGridGeri2 = {
                            data: group,
                            pageSize: 10,
                            total: group.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                        // namaruangan: { type: "string" },
                                        jan: { type: "number" },
                                        feb: { type: "number" },
                                        mar: { type: "number" },
                                        apr: { type: "number" },
                                        mei: { type: "number" },
                                        jun: { type: "number" },
                                        jul: { type: "number" },
                                        agus: { type: "number" },
                                        sep: { type: "number" },
                                        okt: { type: "number" },
                                        nov: { type: "number" },
                                        des: { type: "number" },
                                        jumlah: { type: "number" },
                                    }
                                }
                            },
                            pageSize: 200,
                            // total: group.length,
                            serverPaging: false,
                            aggregate: [
                                { field: 'jan', aggregate: 'sum' },
                                { field: "feb", aggregate: 'sum' },
                                { field: 'mar', aggregate: 'sum' },
                                { field: "apr", aggregate: 'sum' },
                                { field: 'mei', aggregate: 'sum' },
                                { field: "jun", aggregate: 'sum' },
                                { field: 'jul', aggregate: 'sum' },
                                { field: "agus", aggregate: 'sum' },
                                { field: 'sep', aggregate: 'sum' },
                                { field: "okt", aggregate: 'sum' },
                                { field: 'nov', aggregate: 'sum' },
                                { field: "des", aggregate: 'sum' },
                                { field: "jumlah", aggregate: 'sum' },
                            ]


                        }
                    })

            }




            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }

            $scope.group = {
                field: "namaruangan",
                aggregates: [{
                    field: "namaruangan",
                    aggregate: "count"
                }]
            };
            $scope.columnGridK = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Kunjungan.xlsx",
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
                        cells: [{ value: "Summary Register Pendaftaran Instalasi (Kunjungan)", background: "#fffff" }]
                    });
                },
                columns: [

                    {
                        "field": "kelompokpasien",
                        "title": "Jenis Pasien",
                        "width": "200px",
                        groupFooterTemplate: "Jumlah",
                        footerTemplate: "Total"
                    },
                    {
                        "title": "Pengunjung",
                        "width": "200px",

                        "columns": [{
                            "field": "laki",
                            "title": "Laki-Laki",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.laki.sum  #",
                            footerTemplate: "#:data.laki.sum  #"

                        }, {
                            "field": "wanita",
                            "title": "Perempuan",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.wanita.sum  #",
                            footerTemplate: "#:data.wanita.sum  #"
                        }],

                    },

                    {
                        "title": "Kunjungan",
                        "width": "200px",
                        "columns": [{
                            "field": "baru",
                            "title": "Baru",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.baru.sum  #",
                            footerTemplate: "#:data.baru.sum  #"
                        }, {
                            "field": "lama",
                            "title": "Lama",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.lama.sum  #",
                            footerTemplate: "#:data.lama.sum  #"
                        }]
                    }, {
                        "field": "jumlah",
                        "title": "Jumlah Kunjungan",
                        "width": "200px",
                        groupFooterTemplate: "#=data.jumlah.sum  #",
                        footerTemplate: "#:data.jumlah.sum  #"

                    },
                    {
                        hidden: true,
                        field: "namaruangan",
                        title: "Nama Ruangan",
                        aggregates: ["count"],
                        groupHeaderTemplate: "   #= value #    "
                    }

                ]
            }


            $scope.columnGridP = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Pendidikan.xlsx",
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
                        cells: [{ value: "Summary Register Pendaftaran Instalasi (Pendidikan)", background: "#fffff" }]
                    });
                },
                columns: [

                    {
                        "field": "pendidikan",
                        "title": "Jenjang Pendidikan",
                        "width": "200px",
                        groupFooterTemplate: "Jumlah",
                        footerTemplate: "Total"
                    },
                    {
                        "title": "Instalasi Rawat Jalan",
                        "width": "200px",

                        "columns": [{
                            "field": "psikiatri",
                            "title": "Psikiatri",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.psikiatri.sum  #",
                            footerTemplate: "#:data.psikiatri.sum  #"

                        }, {
                            "field": "nonpsi",
                            "title": "Non Psikiatri",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.nonpsi.sum  #",
                            footerTemplate: "#:data.nonpsi.sum  #"
                        }],

                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "200px",
                        groupFooterTemplate: "#=data.jumlah.sum  #",
                        footerTemplate: "#:data.jumlah.sum  #"

                    },

                ]
            }

            //  $scope.group = {
            //     field: "namaruangan",
            //     aggregates: [
            //         {
            //             field: "namaruangan",
            //             aggregate: "count"
            //         }]
            // };


            $scope.aggregate = [{
                field: "jumlah",
                aggregate: "sum"
            }]

            $scope.columnGridD = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Daerah.xlsx",
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
                        cells: [{ value: "Summary Register Pendaftaran Instalasi (Daerah)", background: "#fffff" }]
                    });
                },
                columns: [

                    {
                        "field": "namakotakabupaten",
                        "title": "Kabupaten/Kota Madya",
                        "width": "200px",
                        groupFooterTemplate: "Jumlah",
                        footerTemplate: "Total"
                    },
                    {
                        "title": "Instalasi Rawat Jalan",
                        "width": "200px",

                        "columns": [{
                            "field": "psikiatri",
                            "title": "Psikiatri",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.psikiatri.sum  #",
                            footerTemplate: "#:data.psikiatri.sum  #"

                        }, {
                            "field": "nonpsi",
                            "title": "Non Psikiatri",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.nonpsi.sum  #",
                            footerTemplate: "#:data.nonpsi.sum  #"
                        }],

                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "200px",
                        groupFooterTemplate: "#=data.jumlah.sum  #",
                        footerTemplate: "#:data.jumlah.sum  #"

                    }

                ]
            }

            $scope.columnGridDkecamatan = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Daerah Kecamatan.xlsx",
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
                        cells: [{ value: "Summary Register Pendaftaran Instalasi (Daerah Kecamatan)", background: "#fffff" }]
                    });
                },
                columns: [

                    {
                        "field": "namakotakabupaten",
                        "title": "Kabupaten/Kota Madya",
                        "width": "200px",
                        groupFooterTemplate: "Jumlah",
                        footerTemplate: "Total"
                    },

                    {
                        "field": "namakecamatan",
                        "title": "Kecamatan",
                        "width": "200px",
                        groupFooterTemplate: "Jumlah",
                        footerTemplate: "Total"
                    },
                    {
                        "title": "Instalasi Rawat Jalan",
                        "width": "200px",

                        "columns": [{
                            "field": "psikiatri",
                            "title": "Psikiatri",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.psikiatri.sum  #",
                            footerTemplate: "#:data.psikiatri.sum  #"

                        }, {
                            "field": "nonpsi",
                            "title": "Non Psikiatri",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.nonpsi.sum  #",
                            footerTemplate: "#:data.nonpsi.sum  #"
                        }],

                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "200px",
                        groupFooterTemplate: "#=data.jumlah.sum  #",
                        footerTemplate: "#:data.jumlah.sum  #"

                    }

                ]
            }


            $scope.aggregate = [{
                field: "jumlah",
                aggregate: "sum"
            }]

            $scope.columnGridPek = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Pekerjaan.xlsx",
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
                        cells: [{ value: "Summary Register Pendaftaran Instalasi (Pekerjaan)", background: "#fffff" }]
                    });
                },
                columns: [

                    {
                        "field": "pekerjaan",
                        "title": "Pekerjaan",
                        "width": "200px",
                        groupFooterTemplate: "Jumlah",
                        footerTemplate: "Total"
                    },
                    {
                        "title": "Instalasi Rawat Jalan",
                        "width": "200px",

                        "columns": [{
                            "field": "psikiatri",
                            "title": "Psikiatri",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.psikiatri.sum  #",
                            footerTemplate: "#:data.psikiatri.sum  #"

                        }, {
                            "field": "nonpsi",
                            "title": "Non Psikiatri",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.nonpsi.sum  #",
                            footerTemplate: "#:data.nonpsi.sum  #"
                        }],

                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "200px",
                        groupFooterTemplate: "#=data.jumlah.sum  #",
                        footerTemplate: "#:data.jumlah.sum  #"

                    }

                ]
            }

            $scope.columnGridUsia = {
                toolbar: ["excel"],

                excel: {
                    fileName: "Summary Register Pendaftaran Jalan - Usia.xlsx",
                    allPages: true,

                },

                dataSource: $scope.dataExcel,
                sortable: true,
                pageable: true,
                resizable: true,
                excelExport: function (e) {
                    var rows = e.workbook.sheets[0].rows;
                    rows.unshift({
                        cells: [{ value: "Summary Register Pendaftaran Rawat Jalan (Usia)", background: "#fffff" }]
                    });
                },
                columns: [

                    {
                        "field": "no",
                        "title": "No",
                        "width": "75px",
                        footerTemplate: "Total",
                        attributes: {
                            "class": "table-cell",
                            style: "text-align: center;"
                        }
                    },
                    {
                        "field": "usia",
                        "title": "Usia",

                    },
                    {
                        "field": "jml",
                        "title": "Jumlah",
                        aggregates: ["sum"],
                        footerTemplate: "#: data.jml.sum #",

                    }
                ]

            }

            $scope.columnGridAg = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Agama.xlsx",
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
                        cells: [{ value: "Summary Register Pendaftaran Instalasi (Agama)", background: "#fffff" }]
                    });
                },
                columns: [

                    {
                        "field": "agama",
                        "title": "Agama",
                        "width": "200px",
                        groupFooterTemplate: "Jumlah",
                        footerTemplate: "Total"
                    },
                    {
                        "title": "Instalasi Rawat Jalan",
                        "width": "200px",

                        "columns": [{
                            "field": "psikiatri",
                            "title": "Psikiatri",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.psikiatri.sum  #",
                            footerTemplate: "#:data.psikiatri.sum  #"

                        }, {
                            "field": "nonpsi",
                            "title": "Non Psikiatri",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.nonpsi.sum  #",
                            footerTemplate: "#:data.nonpsi.sum  #"
                        }],

                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "200px",
                        groupFooterTemplate: "#=data.jumlah.sum  #",
                        footerTemplate: "#:data.jumlah.sum  #"

                    }

                ]
            }

            $scope.setjmlPasienBaru = function (dataPasienSelected, bulan) {
                debugger;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;
                var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-data-lap-summary-kunjungandetail?"


                medifirstService.get(link +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&bulan=" + bulan +
                    "&namadepartemen=" + dataPasienSelected.namadepartemen +
                    tempRuanganId).then(function (data) {
                        debugger;
                        $scope.popUpDetail.center().open();
                        $scope.isRouteLoading = false;
                        // details = data.data;
                        $scope.dataPasienDetail = {
                            data: data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            },
                            aggregate: [
                                // { field: 'jmlPasienBaru', aggregate: 'sum' },
                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                        // });
                    })
            }

            $scope.setjmlPasienBaru2 = function (dataPasienSelected, bulan) {
                debugger;
                var tglAwal = moment($scope.item.tglawal).format('YYYY-MM-DD HH:mm');
                var tglAkhir = moment($scope.item.tglakhir).format('YYYY-MM-DD HH:mm');;
                var tempRuanganId = "&idRuangan=" + dataPasienSelected.idruangan;
                var link = "registrasi/laporan/get-data-lap-summary-kunjungandetailruangan?"


                medifirstService.get(link +
                    "tglAwal=" + tglAwal +
                    "&tglAkhir=" + tglAkhir +
                    "&bulan=" + bulan +
                    "&namaruangan=" + dataPasienSelected.namaruangan +
                    tempRuanganId).then(function (data) {
                        debugger;
                        $scope.popUpDetail.center().open();
                        $scope.isRouteLoading = false;
                        // details = data.data;
                        $scope.dataPasienDetail = {
                            data: data.data,
                            pageSize: 10,
                            total: data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {}
                                }
                            },
                            aggregate: [
                                // { field: 'jmlPasienBaru', aggregate: 'sum' },
                            ],
                            refresh: true,
                            selectable: true,
                            refresh: true,
                            groupable: true,
                            allowCopy: true,
                        }
                        // });
                    })
            }
            $scope.columnGridGeri1 = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Agama.xlsx",
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
                        cells: [{ value: "Summary Register Pendaftaran Instalasi (Agama)", background: "#fffff" }]
                    });
                },
                columns: [

                    {
                        "field": "namadepartemen",
                        "title": "Instalasi",
                        "width": "200px",
                        // groupFooterTemplate: "Jumlah",
                        // footerTemplate: "Total"
                    },
                    {
                        "title": "GERIATRI",
                        "width": "200px",

                        "columns": [{
                            "field": "jan",
                            "title": "jan",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru(dataItem,'01')\"  style=\"margin:0 0 5px\">#:  jan #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.jan.sum  #",
                            footerTemplate: "#:data.jan.sum  #"

                        }, {
                            "field": "feb",
                            "title": "feb",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru(dataItem,2)\"  style=\"margin:0 0 5px\">#:  feb #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.feb.sum  #",
                            footerTemplate: "#:data.feb.sum  #"
                        }, {
                            "field": "mar",
                            "title": "mar",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru(dataItem,3)\"  style=\"margin:0 0 5px\">#:  mar #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.mar.sum  #",
                            footerTemplate: "#:data.mar.sum  #"
                        }, {
                            "field": "apr",
                            "title": "apr",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru(dataItem,4)\"  style=\"margin:0 0 5px\">#:  apr #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.apr.sum  #",
                            footerTemplate: "#:data.apr.sum  #"
                        }, {
                            "field": "mei",
                            "title": "mei",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru(dataItem,5)\"  style=\"margin:0 0 5px\">#:  mei #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.mei.sum  #",
                            footerTemplate: "#:data.mei.sum  #"
                        }, {
                            "field": "jun",
                            "title": "jun",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru(dataItem,6)\"  style=\"margin:0 0 5px\">#:  jun #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.jun.sum  #",
                            footerTemplate: "#:data.jun.sum  #"
                        }, {
                            "field": "jul",
                            "title": "jul",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru(dataItem,7)\"  style=\"margin:0 0 5px\">#:  jul #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.jul.sum  #",
                            footerTemplate: "#:data.jul.sum  #"
                        }, {
                            "field": "agus",
                            "title": "agus",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru(dataItem,8)\"  style=\"margin:0 0 5px\">#:  agus #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.agus.sum  #",
                            footerTemplate: "#:data.agus.sum  #"
                        }, {
                            "field": "sep",
                            "title": "sep",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru(dataItem,9)\"  style=\"margin:0 0 5px\">#:  sep #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.sep.sum  #",
                            footerTemplate: "#:data.sep.sum  #"
                        }, {
                            "field": "okt",
                            "title": "okt",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru(dataItem,10)\"  style=\"margin:0 0 5px\">#:  okt #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.okt.sum  #",
                            footerTemplate: "#:data.okt.sum  #"
                        }, {
                            "field": "nov",
                            "title": "nov",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru(dataItem,11)\"  style=\"margin:0 0 5px\">#:  nov #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.nov.sum  #",
                            footerTemplate: "#:data.nov.sum  #"
                        }, {
                            "field": "des",
                            "title": "des",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru(dataItem,12)\"  style=\"margin:0 0 5px\">#:  des #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.des.sum  #",
                            footerTemplate: "#:data.des.sum  #"
                        }],

                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "200px",
                        groupFooterTemplate: "#=data.jumlah.sum  #",
                        footerTemplate: "#:data.jumlah.sum  #"

                    }

                ]
            }

            $scope.columnGridGeri2 = {
                toolbar: ["excel"],
                // , "pdf"],

                excel: {
                    fileName: "Summary Register Pendaftaran Instalasi - Agama.xlsx",
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
                        cells: [{ value: "Summary Register Pendaftaran Instalasi (Agama)", background: "#fffff" }]
                    });
                },
                columns: [

                    {
                        "field": "namaruangan",
                        "title": "Ruangan",
                        "width": "200px",
                        // groupFooterTemplate: "Jumlah",
                        // footerTemplate: "Total"
                    },
                    {
                        "title": "GERIATRI",
                        "width": "200px",

                        "columns": [{
                            "field": "jan",
                            "title": "jan",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru2(dataItem,'01')\"  style=\"margin:0 0 5px\">#:  jan #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.jan.sum  #",
                            footerTemplate: "#:data.jan.sum  #"

                        }, {
                            "field": "feb",
                            "title": "feb",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru2(dataItem,2)\"  style=\"margin:0 0 5px\">#:  feb #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.feb.sum  #",
                            footerTemplate: "#:data.feb.sum  #"
                        }, {
                            "field": "mar",
                            "title": "mar",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru2(dataItem,3)\"  style=\"margin:0 0 5px\">#:  mar #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.mar.sum  #",
                            footerTemplate: "#:data.mar.sum  #"
                        }, {
                            "field": "apr",
                            "title": "apr",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru2(dataItem,4)\"  style=\"margin:0 0 5px\">#:  apr #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.apr.sum  #",
                            footerTemplate: "#:data.apr.sum  #"
                        }, {
                            "field": "mei",
                            "title": "mei",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru2(dataItem,5)\"  style=\"margin:0 0 5px\">#:  mei #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.mei.sum  #",
                            footerTemplate: "#:data.mei.sum  #"
                        }, {
                            "field": "jun",
                            "title": "jun",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru2(dataItem,6)\"  style=\"margin:0 0 5px\">#:  jun #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.jun.sum  #",
                            footerTemplate: "#:data.jun.sum  #"
                        }, {
                            "field": "jul",
                            "title": "jul",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru2(dataItem,7)\"  style=\"margin:0 0 5px\">#:  jul #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.jul.sum  #",
                            footerTemplate: "#:data.jul.sum  #"
                        }, {
                            "field": "agus",
                            "title": "agus",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru2(dataItem,8)\"  style=\"margin:0 0 5px\">#:  agus #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.agus.sum  #",
                            footerTemplate: "#:data.agus.sum  #"
                        }, {
                            "field": "sep",
                            "title": "sep",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru2(dataItem,9)\"  style=\"margin:0 0 5px\">#:  sep #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.sep.sum  #",
                            footerTemplate: "#:data.sep.sum  #"
                        }, {
                            "field": "okt",
                            "title": "okt",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru2(dataItem,10)\"  style=\"margin:0 0 5px\">#:  okt #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.okt.sum  #",
                            footerTemplate: "#:data.okt.sum  #"
                        }, {
                            "field": "nov",
                            "title": "nov",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru2(dataItem,11)\"  style=\"margin:0 0 5px\">#:  nov #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.nov.sum  #",
                            footerTemplate: "#:data.nov.sum  #"
                        }, {
                            "field": "des",
                            "title": "des",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setjmlPasienBaru2(dataItem,12)\"  style=\"margin:0 0 5px\">#:  des #</button> ",
                            aggregates: ["sum"],
                            groupFooterTemplate: "#=data.des.sum  #",
                            footerTemplate: "#:data.des.sum  #"
                        }],

                    },
                    {
                        "field": "jumlah",
                        "title": "Jumlah",
                        "width": "200px",
                        groupFooterTemplate: "#=data.jumlah.sum  #",
                        footerTemplate: "#:data.jumlah.sum  #"

                    }

                ]
            }


            $scope.columnPasienDetail = {
                toolbar: [
                    "excel",
                    "pdf",
                ],
                excel: {
                    fileName: "DetailLaporanRekapKunjunganGeriatri.xlsx",
                    allPages: true,
                },
                pdf: {

                    fileName: "DetailLaporanRekapKunjunganGeriatri.pdf",
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
                excelExport: function (e) {

                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:P1"];
                    sheet.name = "LAPORAN";

                    var myHeaders = [

                        {
                            value: "DETAIL REKAPITULASI GERIATRI BERDASARKAN DATA KUNJUNGAN " + DateHelper.formatDate($scope.item.tglawal, 'DD-MM-YY') + ' sampai ' +
                                DateHelper.formatDate($scope.item.tglakhir, 'DD-MM-YY'),
                            fontSize: 15,
                            textAlign: "center",
                            background: "#c1d2d2",
                            // color:"#ffffff"
                        }
                    ];

                    sheet.rows.splice(0, 0, { cells: myHeaders, type: "header", height: 50 });
                },
                selectable: 'row',
                sortable: false,
                reorderable: true,
                filterable: false,
                pageable: true,
                columnMenu: false,
                resizable: true,
                columns: [{
                    "field": "namaruangan",
                    "title": "POLIKLINIK",
                    "width": "50px"
                },
                {
                    "field": "tglregistrasi",
                    "title": "Tgl Registrasi",
                    "width": "50px"
                },
                {
                    "field": "noregistrasi",
                    "title": "NoRegistrasi",
                    "width": "50px"
                },
                {
                    "field": "nocm",
                    "title": "NoRM",
                    "width": "50px"
                },
                {
                    "field": "namapasien",
                    "title": "Nama Pasien",
                    "width": "50px"
                },

                {
                    "field": "tgllahir",
                    "title": "Tanggallahir",
                    "width": "50px"
                },
                {
                    "field": "umur",
                    "title": "Umur",
                    "width": "50px"
                },
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
                pageable: {
                    messages: {
                        display: "Menampilkan {0} - {1} data dari {2} data"
                    },
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
            };
            //fungsi clear kriteria search
            $scope.ClearSearch = function () {
                $scope.item = {};
                $scope.item.tglawal = $scope.now;
                $scope.item.tglakhir = $scope.now;
                $scope.CariLapPendapatanPoli();
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





            $scope.date = new Date();
            var tanggals = DateHelper.getDateTimeFormatted3($scope.date);

            //Tanggal Default
            $scope.item.tglawal = tanggals + " 00:00";
            $scope.item.tglakhir = tanggals + " 23:59";

            // Tanggal Inputan
            $scope.tglawal = $scope.item.tglawal;
            $scope.tglakhir = $scope.item.tglakhir;
            $scope.pegawai = medifirstService.getPegawai();


        }
    ]);
});