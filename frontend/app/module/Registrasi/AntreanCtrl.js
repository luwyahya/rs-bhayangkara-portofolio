define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('AntreanCtrl', ['$rootScope', '$scope', '$state', 'DateHelper', 'MedifirstService',
        function ($rootScope, $scope, $state, DateHelper, medifirstService) {
            $scope.now = new Date();
            $scope.myVar = 0;
            $scope.nav = function (state) {
                // debugger;
                $scope.currentState = state;
                $state.go(state, $state.params);
                // console.log($scope.currentState);
            }
            $scope.jenisPencarian = [{
                "id": 1, "nama": "Pasien Baru"
            }, {
                "id": 0, "nama": "Pasien Lama"
            }];
            $scope.isRouteLoading = false
            $scope.item = {
                isbaru: 0
            }
            $scope.isShowPotensi = true;
            $scope.listJenisPasien = [
                { "id": 1, "jenispasien": "JKN" },
                { "id": 2, "jenispasien": "NON JKN" }];

            // $scope.listJamPraktek = [{
            //     "id": 1, "nama": "08:00 - 12:00", "kode": "08:00 - 12:00"
            // }];

            medifirstService.get("bridging/bpjs2/mjkn/antrian/get-asal-rujukan-bpjs").then(function (data) {
                $scope.listKunjungan = data.data.data;
            })

            medifirstService.get("bridging/bpjs/get-ruangan-rj").then(function (data) {
                $scope.listSpesialis = data.data.data;
            })

            $scope.getIsiComboDPJP = function (e) {
                if (!e) return;
                // medifirstService.get("bridging/bpjs/get-ref-dokter-dpjp?jenisPelayanan=2"
                //     + "&tglPelayanan=" + moment(new Date()).format('YYYY-MM-DD') + "&kodeSpesialis=" + e.kdinternal).then(function (e) {
                //         if (e.data.metaData.code == 200) {
                //             $scope.listDPJP = e.data.response.list;
                //         } else {
                //             $scope.listDPJP = null;
                //             toastr.info('Dokter DPJP tidak ada', 'Info')
                //         }
                // });
                var kodepoli = e.kdinternal
                var tanggal = moment($scope.item.tgldiperiksa).format('YYYY-MM-DD')

                medifirstService.get(`bridging/bpjs2/mjkn/antrian/getjadwal?kodepoli=${kodepoli}&tanggal=${tanggal}`, false).then(function (data) {
                    // medifirstService.get(`bridging/bpjs/antrean/v2/get-jadwal-dokter?kodepoli=${kodepoli}&tanggal=${tanggal}`, false).then(function (data) {
                    if (data.data.metaData.code === 201) {
                        $scope.isRouteLoading = false;
                        toastr.error(data.data.metaData.message)
                        return
                    }

                    var data = data.data.response
                    var tampungdata = [];
                    var jadwalpratek = [];
                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        const found = tampungdata.some(el => el.nama === element.namadokter);
                        if (!found) {
                            tampungdata.push({ kode: element.kodedokter, nama: element.namadokter })
                            jadwalpratek.push({ id: i, nama: element.jadwal, kode: element.jadwal })
                        }
                    }
                    $scope.listDPJP = tampungdata
                    $scope.listJamPraktek = jadwalpratek;
                })

            }

            $scope.getIsiComboJP = function (e) {
                // if (!e) return;
                // var kodepoli = $scope.item.poliKontrol.kdinternal
                // var tanggal = new moment($scope.now).format('YYYY-MM-DD')

                // let json  = {
                //     "url": "jadwaldokter/kodepoli/"+kodepoli+"/tanggal/"+tanggal,
                //     "jenis": "antrean",
                //     "method": "GET",
                //     "data": null
                // }
                // medifirstService.postNonMessage('bridging/bpjs/tools',json).then(function (data) {
                // // medifirstService.get(`bridging/bpjs/antrean/v2/get-jadwal-dokter?kodepoli=${kodepoli}&tanggal=${tanggal}`, false).then(function (data) {
                //     if (data.data.metaData.code === 201) {
                //         $scope.isRouteLoading = false;
                //         toastr.error(data.data.metaData.message)
                //         return
                //     }

                //     var data = data.data.response
                //     var jadwalpratek = [];
                //     for(var i=0; i < data.length; i++) {
                //         const element =  data.data.response[i];
                //         if(element.kodedokter == e.kode){
                //             jadwalpratek.push({id:i, nama:element.jadwal, kode: element.jadwal})
                //         }
                //     }
                //     $scope.listJamPraktek = data.data.response;
                // })

            }

            $scope.cariPasien = function () {
                if ($scope.item.norm == undefined) return
                medifirstService.get("bridging/bpjs2/mjkn/antrian/cek-rm?rm=" + $scope.item.norm).then(function (e) {
                    console.log(e);
                    if (e.data.data !== null) {
                        $scope.item.noKartu = e.data.data.nobpjs
                        $scope.item.nik = e.data.data.noidentitas
                        $scope.item.nama = e.data.data.namapasien
                        $scope.item.nohp = e.data.data.nohp
                        $scope.item.jeniskelamin = e.data.data.jeniskelamin

                        var tanggal = $scope.now;
                        var tanggalLahir = new Date(e.data.data.tgllahir);
                        var umur = DateHelper.CountAge(tanggalLahir, tanggal);
                        umur = umur.year + ' thn ' + umur.month + ' bln ' + umur.day + ' hari';
                        $scope.item.umur = umur

                    } else {
                        $scope.item.noKartu = null
                        $scope.item.nik = null
                        $scope.item.nama = null
                        $scope.item.nohp = null
                        $scope.item.jeniskelamin = null
                        $scope.item.umur = null
                        toastr.error('Nomor Rekam Medis ' + $scope.item.norm + ' tidak ditemukan.')
                    }
                })
            }

            $scope.save = function () {
                if ($scope.item.noKartu == undefined) {
                    toastr.error('No Kartu Belum di isi !')
                    return
                }
                if ($scope.item.nama == undefined) {
                    toastr.error('Nama Pasien  Belum di isi !')
                    return
                }
                if ($scope.item.nik == undefined) {
                    toastr.error('NIK  Belum di isi !')
                    return
                }
                if ($scope.item.nohp == undefined) {
                    toastr.error('No HP  Belum di isi !')
                    return
                }

                if ($scope.item.tgldiperiksa == undefined) {
                    toastr.error('Tanggal diperiksa belum diisi !')
                    return
                }
                if ($scope.item.jenispasien == undefined) {
                    toastr.error('Jenis Pasien belum dipilih !')
                    return
                }
                if ($scope.item.jeniskunjungan == undefined) {
                    toastr.error('Jenis Kunjungan belum dipilih !')
                    return
                }
                if ($scope.item.poliKontrol == undefined) {
                    toastr.error('Spesialis belum dipilih !')
                    return
                }
                if ($scope.item.kodeDokter == undefined) {
                    toastr.error('DPJP belum dipilih !')
                    return
                }
                if ($scope.item.jampraktek == undefined) {
                    toastr.error('Jam Praktek belum dipilih !')
                    return
                }
                if ($scope.item.nomorreferensi == undefined) {
                    toastr.error('No Referensi belum diisi !')
                    return
                }
                if ($scope.item.keterangan == undefined) {
                    toastr.error('Keterangan belum diisi !')
                    return
                }

                var objSave = {
                    jenispasien: $scope.item.jenispasien.jenispasien,
                    nomorkartu: $scope.item.noKartu,
                    nik: $scope.item.nik,
                    nohp: $scope.item.nohp,
                    kodepoli: $scope.item.poliKontrol.kdinternal,
                    namapoli: $scope.item.poliKontrol.namaruangan,
                    pasienbaru: $scope.item.isbaru,
                    norm: $scope.item.norm ? $scope.item.norm : "-",
                    nama: $scope.item.nama,
                    tanggalperiksa: moment($scope.item.tgldiperiksa).format('YYYY-MM-DD'),
                    kodedokter: $scope.item.kodeDokter.kode,
                    namadokter: $scope.item.kodeDokter.nama,
                    jampraktek: $scope.item.jampraktek.nama,
                    jeniskunjungan: $scope.item.jeniskunjungan.id,
                    nomorreferensi: $scope.item.nomorreferensi,
                    keterangan: $scope.item.keterangan
                }
                var objData = {
                    "data": objSave
                }
                // console.log(objSave)
                medifirstService.postNonMessage('bridging/bpjs2/mjkn/antrian/tambahantrian', objData).then(function (data) {
                    // alert
                    if (data.data.metadata.code === 201) {
                        toastr.error(data.data.metadata.message)
                    } else {
                        toastr.info(data.data.metadata.message)
                    }

                })
            }

            $scope.batalkan = function () {
                if ($scope.item.kodebooking === undefined) {
                    toastr.error('kodebooking kosong')
                    return
                }
                if ($scope.item.keterangan === undefined) {
                    toastr.error('keterangan kosong')
                    return
                }

                var obj = {
                    data: {
                        kodebooking: $scope.item.kodebooking,
                        keterangan: $scope.item.keterangan
                    }
                }

                // console.log(obj)
                medifirstService.post('bridging/bpjs2/mjkn/antrian/batalantrian', obj).then(function (e) {
                    toastr.info(e.data.metadata.message)
                    // console.log(e)
                })
            }



        }
    ]);
});