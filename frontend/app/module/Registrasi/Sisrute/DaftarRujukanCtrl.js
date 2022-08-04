define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarRujukanCtrl', ['$q', '$scope', 'ModelItem', 'DateHelper', 'CacheHelper', '$state', 'MedifirstService',
        function ($q, $scope, ModelItem, dateHelper, cacheHelper, $state, medifirstService) {
            $scope.item = {};
            $scope.now = new Date();
            $scope.currentKeterangan = [];
            // $scope.item.tglRujukan = new Date();
            $scope.isRouteLoading = false;

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.dataLogin = JSON.parse(localStorage.getItem('pegawai'))
            getCombo()
            function getCombo() {
                $scope.listStatus = [{ id: 0, name: 'Tidak Diterima' }, { id: 1, name: 'Diterima' }]
                $q.all([
                 medifirstService.get("bridging/sisrute/get-combo"),

                ]).then(function (result) {
                    if (result[0].statResponse) {
                        $scope.listDokter = result[0].data.dokter
                        $scope.listPetugas = result[0].data.pegawai
                    }

                })

            }
            LoadData()

            function LoadData() {
                $scope.isRouteLoading = true;

                var tglRujukan = ""
                if ($scope.item.tglRujukan != undefined) {
                    tglRujukan = moment($scope.item.tglRujukan).format('YYYY-MM-DD')
                }

                var noRujukan = "";
                if ($scope.item.noRujukan != undefined) {
                    noRujukan = $scope.item.noRujukan
                }
                var create = "";
                if ($scope.item.create == true) {
                    create = $scope.item.create
                }
             medifirstService.get("bridging/sisrute/rujukan/get?"
                    + "create=" + true
                    + "&nomor=" + noRujukan
                    + "&tanggal=" + tglRujukan
                ).then(function (dat) {
                    if (dat.data.total > 0) {
                        toastr.info(dat.data.total + ' ' + dat.data.detail, 'Success')
                        var datas = dat.data.data;
                        for (let i = 0; i < datas.length; i++) {
                            datas[i].no = i + 1
                            datas[i].nocm = datas[i].PASIEN.NORM
                            datas[i].namapasien = datas[i].PASIEN.NAMA
                            datas[i].norujukan = datas[i].RUJUKAN.NOMOR
                            datas[i].tglrujukan = datas[i].RUJUKAN.TANGGAL
                            datas[i].faskesasal = datas[i].RUJUKAN.FASKES_ASAL.NAMA
                            datas[i].faskestujuan = datas[i].RUJUKAN.FASKES_TUJUAN.NAMA
                            datas[i].status = datas[i].RUJUKAN.STATUS.NAMA
                            var kontak = ''
                            if (datas[i].PASIEN.KONTAK != null && datas[i].PASIEN.KONTAK != ' ')
                                kontak = ' / ' + datas[i].PASIEN.KONTAK
                            if (datas[i].PASIEN.JENIS_KELAMIN != null) {
                                datas[i].namakontak = datas[i].PASIEN.NAMA
                                    + kontak
                                    + ' / ' + datas[i].PASIEN.JENIS_KELAMIN.NAMA
                                    + ' / ' + datas[i].PASIEN.TANGGAL_LAHIR
                            } else {
                                datas[i].namakontak = datas[i].PASIEN.NAMA
                                    + kontak
                                    + ' / ' + datas[i].PASIEN.TANGGAL_LAHIR
                            }

                            datas[i].tglasal = datas[i].RUJUKAN.TANGGAL + ' / ' + datas[i].RUJUKAN.FASKES_TUJUAN.NAMA
                            if (datas[i].RUJUKAN.DIAGNOSA != null)
                                datas[i].diagnosa = datas[i].RUJUKAN.DIAGNOSA.NAMA
                            else
                                datas[i].diagnosa = '-'
                            datas[i].alasan = datas[i].RUJUKAN.ALASAN.NAMA + ' / ' + datas[i].RUJUKAN.ALASAN_LAINNYA
                            datas[i].infobalik = ''
                        }
                    }
                    else
                        toastr.error(dat.data.detail, 'Info')

                    $scope.isRouteLoading = false;
                    $scope.sourceGrid = new kendo.data.DataSource({
                        data: datas,
                        pageSize: 20,
                        // group: [
                        //     { field: "nocm" }
                        // ],
                    });
                })
            }


            $scope.columnRujukan = [
                { field: "no", title: "No", width: "30px" },
                { field: "norujukan", title: "No Rujukan", width: "100px" },
                { field: "namakontak", title: "Nama / No Kontak", width: "200px" },
                { field: "tglasal", title: "Tgl / Tujuan RS", width: "150px" },
                { field: "alasan", title: "Alasan Merujuk", width: "180px" },
                { field: "diagnosa", title: "Diagnosa", width: "100px" },
                // { field: "infobalik", title: "Tgl / Info Balik", width: "150px" },
                { field: "status", title: "Status", width: "80px" },
                {
                    "command": [
                        { text: "Edit", click: edit, imageClass: "k-icon k-i-pencil" },
                        // { text: "Jawab Rujukan", click: jawabRujukan, imageClass: "k-icon k-i-download" },
                        { text: "Batal", click: batalRujuk, imageClass: "k-icon k-i-cancel" },
                    ],
                    title: "",
                    width: "150px",
                }
            ];

            function edit(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (dataItem) {
                    cacheHelper.set('cacheEditRujukan', dataItem);
                    cacheHelper.set('cacheRujukan', 'keluar');
                    $state.go('RujukanKeluar')
                }
            }

            function jawabRujukan(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

                if (dataItem.RUJUKAN.FASKES_ASAL.NAMA.indexOf('RSAB Harapan Kita') > -1) {
                    toastr.error('Jawab Rujukan hanya untuk merespon rujukan yang masuk !', 'Error')
                    return
                }
                $scope.noRujukanSelect = dataItem.RUJUKAN.NOMOR
                $scope.winJawabRujukan.center().open()
            }
            function batalRujuk(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var json = {
                    "PETUGAS": {
                        "NIK": $scope.dataLogin.noIdentitas,
                        "NAMA": $scope.dataLogin.namaLengkap
                    }
                }
                var data = {
                    "data": json
                }
                medifirstService.putNonMessage('bridging/sisrute/rujukan/batal?nomor=' + dataItem.RUJUKAN.NOMOR, data).then(function (res) {
                    if (res.data.success == true) {
                        toastr.success(res.data.detail + ' No. ' + dataItem.RUJUKAN.NOMOR, 'Success')
                        LoadData()
                    }

                })
            }
            $scope.SearchData = function () {
                LoadData();
            }
            $scope.reset = function () {
                delete $scope.item.tglRujukan
                delete $scope.item.noRujukan
                delete $scope.item.create
            }
            $scope.batalJawabRujukan = function () {
                delete $scope.item.petugas
                delete $scope.item.keterangan
                delete $scope.item.status
            }
            $scope.saveJawabRujukan = function () {
                var json = {
                    "DITERIMA": $scope.item.status.id,
                    "KETERANGAN": $scope.item.keterangan,
                    "PETUGAS": {
                        "NIK": $scope.item.petugas.noidentitas,
                        "NAMA": $scope.item.petugas.namalengkap
                    }
                }
                var data = {
                    "data": json
                }
                medifirstService.putNonMessage('brigding/sisrute/rujukan/jawab?nomor=' + $scope.noRujukanSelect, data).then(function (res) {
                    if (res.data.success == true)
                        toastr.success(res.data.detail, 'Success')
                })
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
                // var stt = 'false'
                // if (confirm('View Bukti Penerimaan? ')) {
                //     // Save it!
                //     stt='true';
                // } else {
                //     // Do nothing!
                //     stt='false'
                // }

                // var client = new HttpClient();
                // client.get('http://127.0.0.1:1237/printvb/logistik?cetak-bukti-penerimaan=1&nores='+$scope.dataSelected.norec+'&pegawaiPenerima='+pegawai2+'&pegawaiPenyerahan='+pegawai1+'&pegawaiMengetahui='+pegawai3
                //     +'&jabatanPenerima='+jabatan2+'&jabatanPenyerahan='+jabatan1+'&jabatanMengetahui='+jabatan3+'&view='+stt+'&user='+pegawaiUser.userData.namauser, function(response) {
                //     //aadc=response; 

                // });                                       
            }

            $scope.kl = function (dataSelected) {
                if ($scope.dataSelected != undefined) {
                    toastr.info('Data Terpilih dengan pasien ' + $scope.dataSelected.namapasien, ' Info!');
                    $scope.dataSelected = dataSelected;
                    var datas = $scope.dataSelected;

                    debugger;

                    // Header
                    $scope.labelRb = datas.RUJUKAN.FASKES_ASAL.NAMA;
                    $scope.labelMerujuk = "-";
                    $scope.labelPropinsi = "-";
                    $scope.labelDokter = datas.RUJUKAN.DOKTER.NAMA
                    $scope.labelBagian = "-";
                    $scope.labelRumahsakit = datas.RUJUKAN.FASKES_TUJUAN.NAMA;
                    $scope.labelNorujukan = "No. " + datas.norujukan
                    // End Header

                    // Pasien
                    var data_pasien = $scope.dataSelected.PASIEN
                    $scope.labelNamaPasien = data_pasien.NAMA;
                    $scope.labelTanggalLahir = data_pasien.TANGGAL_LAHIR;
                    $scope.labelJenisKelamin = data_pasien.JENIS_KELAMIN.NAMA;
                    $scope.labelAlamat = data_pasien.ALAMAT;
                    $scope.labelNoKtp = data_pasien.NIK;
                    $scope.labelHubKeluarga = "-";
                    $scope.labelTelpRsPenerima = datas.faskestujuan;
                    // End Pasien



                    // Pemeriksaan
                    $scope.labelAnamnesa = datas.KONDISI_UMUM.ANAMNESIS_DAN_PEMERIKSAAN_FISIK
                    $scope.labelPemeriksaanFisik = "Alergi :" + datas.KONDISI_UMUM.ALERGI + ", Keadaan Umum :" + datas.KONDISI_UMUM.KEADAAN_UMUM +
                        ", Nyeri :" + datas.KONDISI_UMUM.NYERI.NAMA + ", Kesadaran :" + datas.KONDISI_UMUM.KESADARAN.NAMA
                        + ", Tekanan Darah :" + datas.KONDISI_UMUM.TEKANAN_DARAH + " mmHg, Nad :" + datas.KONDISI_UMUM.FREKUENSI_NADI +
                        " x/menit, Suhu :" + datas.KONDISI_UMUM.TEKANAN_DARAH + "°C, Pernapasan :" + datas.KONDISI_UMUM.PERNAPASAN + " x/menit"
                    $scope.labelPemeriksaanLab = datas.PENUNJANG.LABORATORIUM
                    $scope.labelFoto = "_";
                    $scope.labelLainnya = datas.alasan;
                    $scope.labelDiagnosa = datas.RUJUKAN.DIAGNOSA.KODE + " " + datas.RUJUKAN.DIAGNOSA.NAMA;
                    $scope.labelObat = "-";
                    // End Pemeriksaan

                    // Dokter
                    $scope.labelDokterMerawat = datas.RUJUKAN.PETUGAS.NAMA
                    $scope.labelDokterPerawat = datas.RUJUKAN.DOKTER.NAMA
                    $scope.labelNipDokter1 = "NIP. " + datas.RUJUKAN.PETUGAS.NIK
                    $scope.labelNipDokter2 = "NIP. " + datas.RUJUKAN.DOKTER.NIK
                    // End Dokter
                }
            }

            $scope.listKeterangan = [
                {
                    "id": 1,
                    "nama": "Keterangan diisi oleh Konsulen",
                    "detail": [
                        { "id": 1, "nama": "Konsul selesai" },
                        { "id": 2, "nama": "Perlu kontrol lagi" },
                        { "id": 3, "nama": "Perlu dirawat" }
                    ]
                }
            ]

            $scope.addListKeterangan = function (bool, data) {
                var index = $scope.currentKeterangan.indexOf(data);
                if (_.filter($scope.currentKeterangan, {
                    id: data.id
                }).length === 0)
                    $scope.currentKeterangan.push(data);
                else {
                    $scope.currentKeterangan.splice(index, 1);
                }

            }

            $scope.CetakRujukan = function () {
                if ($scope.dataSelected == undefined) {
                    toastr.warning("Belum ada yang dipilih, Peringatan!");
                    return;
                }

                // this.namaProfile = this.authGuard.getUserDto().profile.NamaLengkap;
                // this.kelaminProfile = this.authGuard.getUserDto().profile.KelaminLengkap;
                let printContents, popupWin;
                printContents = document.getElementById('diaglog').innerHTML;
                popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
                popupWin.document.open();
                popupWin.document.write(`
                        <html>                           
                            <body onload="window.print();window.close()">${printContents}</body>
                         </html>
                         `
                );

                // $scope.winCetakRujukan.center().open().maximize()
                // $("#dialog").data("kendoWindow").open().maximize();
            }
        }
    ]);
});