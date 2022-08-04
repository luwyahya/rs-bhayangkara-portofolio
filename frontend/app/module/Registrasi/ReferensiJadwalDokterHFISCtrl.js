define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('ReferensiJadwalDokterHFISCtrl', ['$rootScope', '$scope', '$state', 'MedifirstService',
        function ($rootScope, $scope, $state, medifirstService) {
            $scope.now = new Date();
            $scope.myVar = 0;
            $scope.nav = function (state) {
                // debugger;
                $scope.currentState = state;
                $state.go(state, $state.params);
                console.log($scope.currentState);
            }
            $scope.item = {
                tglRencanaKontrol: new Date(),
                tglAwal: new Date(),
                tglAkhir: new Date()
            }
            $scope.listFilter = [{ kode: 2, nama: 'Tgl Rencana Kontrol' }, { kode: 1, nama: 'Tgl Entri' }]
            $scope.item.filter = $scope.listFilter[0]
            $scope.item.start = 1
            $scope.item.limit = 10
            $scope.isShowPembuatanSep = false;
            $scope.isShowPotensi = true;
            $scope.isShowApproval = false;
            $scope.isShowTglPulang = false;
            $scope.isShowIntegrasi = false;
            $scope.enabledDetail = false;
            var ppkRumahSakit = ''
            var data = []
            $scope.isRouteLoading = false

            medifirstService.get("rawatjalan/get-data-combo-dokter", false).then(function (data) {
                var datas = []
                for (let i = 0; i < data.data.ruanganKiosk.length; i++) {
                    const element = data.data.ruanganKiosk[i];
                    datas.push({ id: element.kdinternal ? element.kdinternal : i, namaruangan: element.namaruangan })
                }

                var datasdokter = []
                for (let i = 0; i < data.data.dokter.length; i++) {
                    const element = data.data.dokter[i];
                    datasdokter.push({ id: element.idhafis ? element.idhafis : i, namalengkap: element.namalengkap })
                }
                $scope.listSpesialis = datas
                $scope.listDokter = datasdokter
                $scope.isRouteLoading = false
            });

            // $scope.dataset = [
            //     {
            //         "no": 1,
            //         "kodesubspesialis": "ANA",
            //         "hari": 4,
            //         "kapasitaspasien": 54,
            //         "libur": 0,
            //         "namahari": "KAMIS",
            //         "jadwal": "08:00 - 12:00",
            //         "namasubspesialis": "ANAK",
            //         "namadokter": "DR. OKTORA WAHYU WIJAYANTO, SP.A",
            //         "kodepoli": "ANA",
            //         "namapoli": "Anak",
            //         "kodedokter": 33690
            //     }, {
            //         "kodesubspesialis": "ANA",
            //         "hari": 4,
            //         "kapasitaspasien": 20,
            //         "libur": 0,
            //         "namahari": "KAMIS",
            //         "jadwal": "13:00 - 17:00",
            //         "namasubspesialis": "ANAK",
            //         "namadokter": "DR. OKTORA WAHYU WIJAYANTO, SP.A",
            //         "kodepoli": "ANA",
            //         "namapoli": "Anak",
            //         "kodedokter": 33690
            //     }
            // ]

            $scope.cari = function () {
                init()
            }

            function init() {
                if ($scope.item.spesialis === undefined) {
                    toastr.error('Spesialis belum dipilih :(')
                    return
                }

                $scope.isRouteLoading = true
                var kodepoli = $scope.item.spesialis.id
                var tanggal = new moment($scope.now).format('YYYY-MM-DD')

                medifirstService.get(`bridging/bpjs2/mjkn/antrian/getjadwal?kodepoli=${kodepoli}&tanggal=${tanggal}`, false).then(function (data) {
                    // console.log(data)
                    if (data.data.metaData.code === 201) {
                        $scope.isRouteLoading = false;
                        toastr.error(data.data.metaData.message)
                    }
                    $scope.daftarJadwalDokter = new kendo.data.DataSource({
                        data: data.data.response,
                        // data: $scope.dataset,
                        // pageSize: 10
                    })
                    $scope.isRouteLoading = false;
                })
            }

            $scope.columnDaftarJadwalDokter = {
                columns: [
                    {
                        "field": "no",
                        "title": "#",
                        "width": "10%",
                        "attributes": { align: "center" }

                    },
                    {
                        "field": "kodesubspesialis",
                        "title": "Kode Sub Spesialis",
                        "width": "30%"
                    },
                    {
                        "field": "namasubspesialis",
                        "title": "Nama Sub Spesialis",
                        "width": "30%"
                    },
                    {
                        "field": "jadwal",
                        "title": "Jadwal",
                        "width": "30%"
                    },
                    {
                        "field": "kapasitaspasien",
                        "title": "Kapasitas",
                        "width": "30%"
                    },
                    {
                        "field": "libur",
                        "title": "Libur",
                        "width": "30%"
                    },
                    {
                        "field": "namahari",
                        "title": "Nama Hari",
                        "width": "30%"
                    },
                    {
                        "field": "namadokter",
                        "title": "Dokter",
                        "width": "30%"
                    },
                    {
                        "field": "kodepoli",
                        "title": "Kode Poli",
                        "width": "30%"
                    },
                    {
                        "field": "namapoli",
                        "title": "Nama Poli",
                        "width": "30%"
                    },
                    {
                        "field": "kodedokter",
                        "title": "Kode Dokter",
                        "width": "30%"
                    }
                ]
            }

            $scope.submit = function () {
                if ($scope.item.ruangan === undefined) {
                    toastr.error('Ruangan belum dipilih :(')
                    return
                }
                if ($scope.item.dokter === undefined) {
                    toastr.error('Dokter belum dipilih :(')
                    return
                }
                // $scope.daftarJadwal._data = []

                var obj = {
                    hari: $scope.item.hari.id,
                    namahari: $scope.item.hari.namahari,
                    buka: new moment($scope.item.buka).format('HH:mm'),
                    tutup: new moment($scope.item.tutup).format('HH:mm')
                }

                data.push(obj)

                $scope.daftarJadwal = new kendo.data.DataSource({
                    data: data
                })

            }

            $scope.listHari = [
                { id: 1, namahari: "SENIN" },
                { id: 2, namahari: "SELASA" },
                { id: 3, namahari: "RABU" },
                { id: 4, namahari: "KAMIS" },
                { id: 5, namahari: "JUM'AT" },
                { id: 6, namahari: "SABTU" },
                { id: 7, namahari: "MINGGU" }
            ]

            $scope.columnJadwal = {
                columns: [
                    {
                        "field": "namahari",
                        "title": "Hari",
                        "width": "30%"
                    },
                    {
                        "field": "buka",
                        "title": "Buka",
                        "width": "30%"
                    },
                    {
                        "field": "tutup",
                        "title": "Tutup",
                        "width": "30%"
                    }
                ]
            }

            $scope.hapus = function () {
                data = []
                $scope.daftarJadwal = new kendo.data.DataSource({
                    data: data
                })
            }

            $scope.update = function () {
                var isOk = confirm('Apakah anda yakin dengan semua ini?')
                if (!isOk) return
                var newdata = [];
                if (data === 0) {
                    toastr.error('Data masih kosong')
                } else {
                    for (var i = 0; i < data.length; i++) {
                        var obj = {
                            hari: data[i].hari,
                            buka: data[i].buka,
                            tutup: data[i].tutup
                        }
                        newdata.push(obj);
                    }
                }

                // var obj = {
                //     data: {
                //         kodepoli: $scope.item.ruangan.id,
                //         kodesubspesialis: $scope.item.ruangan.id,
                //         kodedokter: $scope.item.dokter.id,
                //         jadwal: newdata
                //     }
                // }

                var json = {
                    "data": {
                        "kodepoli": $scope.item.ruangan.id,
                        "kodesubspesialis": $scope.item.ruangan.id,
                        "kodedokter": $scope.item.dokter.id,
                        "jadwal": newdata
                    }
                }
                medifirstService.postNonMessage("bridging/bpjs2/mjkn/antrian/updatejadwal", json).then(function (e) {

                    if (e.data.metadata.code === 200) {
                        toastr.success(e.data.metadata.message)
                    } else {
                        toastr.error(e.data.metadata.message)
                    }
                })
                // console.log(obj)
                // medifirstService.postNo('bridging/bpjs/antrean/v2/update-jadwal-dokter', obj).then(function (e) {
                //     toastr.error(e.data.metadata.message)
                //     // console.log(e)
                // })
            }



        }
    ]);
});