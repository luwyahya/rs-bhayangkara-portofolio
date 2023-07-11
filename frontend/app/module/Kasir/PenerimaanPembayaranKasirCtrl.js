define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('PenerimaanPembayaranKasirCtrl', ['$mdDialog', '$state', '$q', '$scope', 'MedifirstService',
        function ($mdDialog, $state, $q, $scope, medifirstService) {
            $scope.dataParams = JSON.parse($state.params.dataPasien);
            var tampungruangan = $scope.dataParams.ruangan
            $scope.now = new Date();
            $scope.showCC = false;
            $scope.item = {};
            $scope.dataPrevPage = {};
            $scope.defaultPage = "";
            $scope.istempatLaporan = true;
            $scope.istempatLaporan2 = true;
            var buttonDisabled = false;
            var dataPegawai = [];
            $scope.dataDaftarBayarSelected = {};
            $scope.daftarBayar = new kendo.data.DataSource({
                data: []
            });
             $scope.tipelayanan='';
            FormLoad();
            showButton();

            function showButton() {
                $scope.showBtnSimpan = true;
                $scope.showBtnKembali = true;
            }
             

            function FormLoad() {
               
                var idPegawai = medifirstService.getPegawaiLogin().id
                medifirstService.get('registrasi/get-ruangan-login-user?idPegawai=' + idPegawai).then(function (dat) {
                    $scope.tampungidruangan = dat.data[0].objectruanganfk
                })
                //#############	
                medifirstService.get('kasir/get-data-combo-kasir').then(function (dat) {
                    dataPegawai = dat.data.datakasir;
                    if (dataPegawai != undefined) {
                        $scope.item.kasir = dataPegawai.namalengkap;
                    } else {
                        $scope.item.kasir = "";
                    }
                });

                $scope.item.ketaranganlain = "Pembayaran Tagihan Pasien";
            }

            $scope.columnDaftarBayar = [{
                "field": "caraBayar",
                "title": "Cara Bayar",
                "width": "200px",
                "template": "<span class='style-left'>#: caraBayar #</span>"
            },
            {
                "field": "nominal",
                "title": "Nominal",
                "width": "50px",
                "template": "<span class='style-right'>{{formatRupiah('#: nominal #', 'Rp.')}}</span>"
            },
            {
                "width": "50px",
                "title": "Action",
                "template": "<span class='style-center'><button class='btnHapus' ng-click='hapusDataBayar()'>Hapus</button></span>"
            },

            ];

            $scope.detailGridOptions = function (dataItem) {
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.detailPembayaran
                    }),
                    columns: [{
                        field: "noKartu",
                        title: "No. Kartu"
                    },
                    {
                        field: "namaKartu",
                        title: "Nama Kartu"
                    },
                    {
                        field: "jenisKartu.namaExternal",
                        title: "Jenis Kartu"
                    }
                    ]
                };
            };

            $scope.tambahCaraBayar = function () {
                var listRawRequired = [
                    "item.caraBayar|k-ng-model|Cara bayar",
                    "item.nominal|ng-model|Nominal"
                ]

                var isValid = medifirstService.setValidation($scope, listRawRequired);

                if (isValid.status) {
                    var tempDataCaraBayar = {
                        "id": $scope.item.caraBayar.id,
                        "caraBayar": $scope.item.caraBayar.namaExternal,
                        "nominal": $scope.item.nominal
                    }

                    if ($scope.showCC) {
                        tempDataCaraBayar.detailPembayaran = [{
                            "noKartu": $scope.item.noKartu,
                            "namaKartu": $scope.item.namaKartu,
                            "jenisKartu": $scope.item.jenisKartu
                        }]

                        $scope.item.noKartu = "";
                        $scope.item.namaKartu = "";
                        $scope.item.jenisKartu = "";
                        $scope.item.namaBank = "";
                        $scope.item.namaBankKe = "";
                    } else if ($scope.showTransfer) {
                        tempDataCaraBayar.detailPembayaran = [{
                            "noKartu": $scope.item.noKartu,
                            "namaBank": $scope.item.namaBank,
                            "namaKartu": $scope.item.namaKartu,
                            "namaBankKe": $scope.item.namaBankKe,
                        }]

                        $scope.item.noKartu = "";
                        $scope.item.namaKartu = "";
                        $scope.item.jenisKartu = "";
                        $scope.item.namaBank = "";
                        $scope.item.namaBankKe = "";
                    } else {
                        tempDataCaraBayar.detailPembayaran = [{}]
                    }


                    var isExist = _.find($scope.daftarBayar._data, function (dataExist) { return dataExist.id == tempDataCaraBayar.id; });

                    if (isExist == undefined) {
                        $scope.daftarBayar.add(tempDataCaraBayar);
                        $scope.item.totalFixBayar = 0;
                        for (var i = 0; i < $scope.daftarBayar._data.length; i++) {
                            $scope.item.totalFixBayar = parseFloat($scope.item.totalFixBayar) + parseFloat($scope.daftarBayar._data[i].nominal);
                        }

                        $scope.item.nominal = $scope.setDefaultNominal();

                    } else {
                        var confirm = $mdDialog.confirm()
                            .title('Peringatan!')
                            .textContent('Metode pembayaran ' + tempDataCaraBayar.caraBayar + " sudah ada")
                            .ariaLabel('Lucky day')
                            .ok('Ok')

                        $mdDialog.show(confirm).then(function () {

                        });
                    }
                } else {
                    medifirstService.showMessages(isValid.messages);
                }
            }

            $scope.setDefaultNominal = function () {
                return $scope.item.jumlahBayarFix - $scope.item.totalFixBayar;
            }

            $scope.hapusDataBayar = function () {
                if ($scope.dataDaftarBayarSelected) {
                    if (this.dataItem.id != $scope.dataDaftarBayarSelected.id) {
                        var confirm = $mdDialog.confirm()
                            .title('Peringatan!')
                            .textContent('Silahkan pilih baris data terlebih dahulu')
                            .ariaLabel('Lucky day')
                            .ok('Ok')

                        $mdDialog.show(confirm).then(function () {

                        });
                    } else {
                        var isExist = _.find($scope.daftarBayar._data, function (dataExist) { return dataExist.id == $scope.dataDaftarBayarSelected.id; });
                        if (isExist != undefined) {
                            $scope.daftarBayar.remove(isExist);
                            $scope.item.totalFixBayar = 0;
                            for (var i = 0; i < $scope.daftarBayar._data.length; i++) {
                                $scope.item.totalFixBayar = parseInt($scope.item.totalFixBayar) + parseInt($scope.daftarBayar._data[i].nominal);
                            }

                            $scope.item.nominal = $scope.setDefaultNominal();
                        }
                    }
                }
            }




            var urlGetDataDetail = "";
            switch ($scope.dataParams.pageFrom) {
         
                case "PembayaranTagihanLayananKasir": 
                    $scope.tipelayanan  = 'Pembayaran Tagihan Layanan Kasir'
                    $scope.dataPrevPage = {
                        noRecStrukPelayanan: $scope.dataParams.noRegistrasi,
                        tipePembayaran: "tagihanPasien",
                    }
                    $scope.tagihan = true;
                    $scope.item.ketaranganlain = "PELAYANAN TINDAKAN";
                    $scope.defaultPage = "DaftarPasienPulangKasir";
                    urlGetDataDetail = "kasir/get-data-pembayaran?noRecStrukPelayanan=" + $scope.dataParams.noRegistrasi + "&tipePembayaran=tagihanPasien";
                    break;
                case "PembayaranTagihanNonLayananKasir":
                     $scope.tipelayanan  = 'Pembayaran Tagihan Non Layanan Kasir'
                    $scope.dataPrevPage = {
                        noRecStrukPelayanan: $scope.dataParams.noRegistrasi,
                        tipePembayaran: "tagihanNonLayanan",
                    }
                    $scope.defaultPage = "DaftarNonLayananKasir";
                    urlGetDataDetail = "kasir/get-data-pembayaran?noRecStrukPelayanan=" + $scope.dataParams.noRegistrasi + "&tipePembayaran=tagihanPasien";
                    break;
                case "InputTagihanNonLayanan":
                    debugger;
                    $scope.tipelayanan  = 'Tagihan Non Layanan'
                    $scope.dataPrevPage = {
                        noRecStrukPelayanan: $scope.dataParams.noRegistrasi,
                        tipePembayaran: "tagihanNonLayanan",
                    }
                    $scope.defaultPage = "DaftarNonLayananKasir";
                    urlGetDataDetail = "kasir/get-data-pembayaran?noRecStrukPelayanan=" + $scope.dataParams.noRegistrasi + "&tipePembayaran=tagihanPasien";
                    break;
                case "DaftarNonLayananKasir":
                    debugger;
                    $scope.tipelayanan  = 'Daftar Non LayananKasir'
                    $scope.dataPrevPage = {
                        noRecStrukPelayanan: $scope.dataParams.noRegistrasi,
                        tipePembayaran: "tagihanNonLayanan",
                    }
                    $scope.defaultPage = "DaftarNonLayananKasir";
                    urlGetDataDetail = "kasir/get-data-pembayaran?noRecStrukPelayanan=" + $scope.dataParams.noRegistrasi + "&tipePembayaran=tagihanPasien";
                    break;
                case "DaftarPenjualanApotekKasir/terimaUmum":
                    debugger;
                    $scope.tipelayanan  = 'Dafta rPenjualan Apotek Kasir' 
                    $scope.dataPrevPage = {
                        noRecStrukPelayanan: $scope.dataParams.noRegistrasi,
                        tipePembayaran: "tagihanNonLayanan",
                    }
                    $scope.defaultPage = "DaftarPenjualanApotekKasir/terimaUmum";
                    urlGetDataDetail = "kasir/get-data-pembayaran?noRecStrukPelayanan=" + $scope.dataParams.noRegistrasi + "&tipePembayaran=tagihanPasien";
                    break;

                case "DaftarPenjualanApotekKasir/obatBebas":
                    debugger;
                    
                    $scope.tipelayanan  = 'Daftar Penjualan Apotek Kasir' 
                    $scope.dataPrevPage = {
                        noRecStrukPelayanan: $scope.dataParams.noRegistrasi,
                        tipePembayaran: "tagihanNonLayanan",
                    }
                    $scope.defaultPage = "DaftarPenjualanApotekKasir/obatBebas";
                    urlGetDataDetail = "kasir/get-data-pembayaran?noRecStrukPelayanan=" + $scope.dataParams.noRegistrasi + "&tipePembayaran=tagihanPasien";
                    break;
                case "PenyetoranDepositKasir":
                     $scope.tipelayanan  = 'Penyetoran Deposit Kasir' 
                    $scope.dataPrevPage = {
                        noRegistrasi: $scope.dataParams.noRegistrasi,
                        tipePembayaran: "depositPasien",
                        jumlahBayar: $scope.dataParams.jumlahBayar
                    }
                    $scope.defaultPage = "DaftarPasienAktif";
                    urlGetDataDetail = "kasir/get-data-pembayaran?noRegistrasi=" + $scope.dataParams.noRegistrasi + "&tipePembayaran=depositPasien&jumlahBayar=" + $scope.dataParams.jumlahBayar;
                    break;
                case "PenyetoranDepositKasirKembali":
                     $scope.tipelayanan  = 'Penyetoran Deposit Kasir Kembali' 
                    $scope.dataPrevPage = {
                        noRegistrasi: $scope.dataParams.noRegistrasi,
                        tipePembayaran: "PenyetoranDepositKasirKembali",
                        jumlahBayar: $scope.dataParams.jumlahBayar
                    }
                    $scope.defaultPage = "DaftarPasienAktif";
                    urlGetDataDetail = "kasir/get-data-pembayaran?noRegistrasi=" + $scope.dataParams.noRegistrasi + "&tipePembayaran=depositPasien&jumlahBayar=" + $scope.dataParams.jumlahBayar;
                    break;
                case "PembayaranPiutangKasir":
                     $scope.tipelayanan  = 'Pembayaran Piutang Kasir' 

                    $scope.dataPrevPage = {
                        noRecStrukPelayanan: $scope.dataParams.noRegistrasi,
                        tipePembayaran: "cicilanPasien",
                        jumlahBayar: $scope.dataParams.jumlahBayar,
                        namaPasien: $scope.dataParams.namaPasien

                    }
                    debugger
                    //$scope.defaultPage = "DaftarPasienPulangKasir";
                    $scope.defaultPage = "DaftarPiutangKasir";
                    urlGetDataDetail = "kasir/get-data-pembayaran?noRecStrukPelayanan=" + $scope.dataParams.noRegistrasi + "&namaPasien=" + $scope.dataParams.namaPasien + "&tipePembayaran=cicilanPasien&jumlahBayar=" + $scope.dataParams.jumlahBayar;
                    break;
            }

            $q.all([
                medifirstService.get(urlGetDataDetail),
                medifirstService.get('kasir/get-data-combo-kasir'),
            ])
                .then(function (data) {

                    if (data[0].statResponse) {
                        $scope.item = data[0].data;
                        $scope.item.biayaAdministrasi = 0;
                        $scope.item.diskon = 0;
                        $scope.item.totalTagihan = $scope.item.jumlahBayar;
                        $scope.item.namaPasien = $scope.dataParams.namaPasien;
                        $scope.item.jumlahBayarFix = ($scope.item.totalTagihan - $scope.item.diskon) + $scope.item.biayaAdministrasi;
                        $scope.item.totalFixBayar = 0
                        $scope.item.nominal = $scope.setDefaultNominal();
                    }

                    if (data[1].statResponse) {
                        $scope.listJenisKartu = data[1].data.jeniskartu;
                        $scope.listCaraBayar = data[1].data.carabayar
                        $scope.listNamaBank = data[1].data.listBankKe;
                    }
                    $scope.item.TglBayar = moment($scope.now).format('YYYY-MM-DD HH:mm')
                });

            $scope.$watch('item.jumlahBayarFix', function (newValue, oldValue) {
                if (newValue < 0) {
                    newValue = (newValue) * -1
                }
                medifirstService.get("sysadmin/general/get-terbilang/" + newValue).then(
                    function (dat) {
                        $scope.item.terbilang = dat.data.terbilang;
                    })
            });
            $scope.$watch('item.namaBankKe', function (e) {
                if (e === undefined) return;
                $scope.item.namaAccount = e.namaaccount
            });

            $scope.Save = function () {
                $scope.showBtnSimpan = false;

                var listRawRequired = [
                    "item.biayaAdministrasi|ng-model|Administrasi",
                    "item.diskon|ng-model|Diskon",
                    "item.jumlahBayarFix|ng-model|Jumlah bayar"
                ];
                var isValid = medifirstService.setValidation($scope, listRawRequired);

                if (isValid.status) {
                    if ($scope.item.jumlahBayarFix != $scope.item.totalFixBayar) {
                        var confirm = $mdDialog.confirm()
                            .title('Peringatan!')
                            .textContent('jumlah yang dibayarkan tidak sesuai dengan total tagihan')
                            .ariaLabel('Lucky day')
                            .ok('Ok')

                        $mdDialog.show(confirm).then(function () {

                        });
                    } else {
                        var dataObjPost = {};
                        var diterimadari = $scope.item.namaPasien;;
                        debugger;
                        if (diterimadari == undefined) {
                            diterimadari = "-";
                        } else {
                            diterimadari = $scope.item.namaPasien;;
                        }
                        dataObjPost = {
                            parameterTambahan: $scope.dataPrevPage,
                            noRec: $scope.item.noRec,
                            jumlahBayar: $scope.item.jumlahBayarFix,
                            biayaAdministrasi: $scope.item.biayaAdministrasi,
                            diskon: $scope.item.diskon,
                            tglsbm: moment($scope.item.TglBayar).format('YYYY-MM-DD HH:mm'),
                            diterimadari: diterimadari,
                            keteranganlainya: $scope.item.ketaranganlain,
                            pembayaran: []
                        }

                        var arrObjPembayaran = [];
                        for (var i = 0; i < $scope.daftarBayar._data.length; i++) {
                            var objPembayaran = {};
                            if ($scope.daftarBayar._data[i].id == 3) {
                                if ($scope.daftarBayar._data[i].detailPembayaran[0].noKartu != undefined) {
                                    objPembayaran.nominal = $scope.daftarBayar._data[i].nominal;

                                    objPembayaran.caraBayar = {
                                        id: $scope.daftarBayar._data[i].id
                                    };


                                    objPembayaran.detailBank = {
                                        noKartu: $scope.daftarBayar._data[i].detailPembayaran[0].noKartu,
                                        namaBank: $scope.daftarBayar._data[i].detailPembayaran[0].namaBank.id,
                                        namaKartu: $scope.daftarBayar._data[i].detailPembayaran[0].namaKartu,
                                        namaBankKe: $scope.daftarBayar._data[i].detailPembayaran[0].namaBankKe.id,
                                    }
                                } else {

                                    objPembayaran.nominal = $scope.daftarBayar._data[i].nominal;

                                    objPembayaran.caraBayar = {
                                        id: $scope.daftarBayar._data[i].id
                                    };

                                }
                            } else {
                                if ($scope.daftarBayar._data[i].detailPembayaran[0].noKartu != undefined) {
                                    objPembayaran.nominal = $scope.daftarBayar._data[i].nominal;

                                    objPembayaran.caraBayar = {
                                        id: $scope.daftarBayar._data[i].id
                                    };

                                    var jenisKartu = {
                                        id: $scope.daftarBayar._data[i].detailPembayaran[0].jenisKartu.id
                                    }

                                    objPembayaran.detailBank = {
                                        noKartu: $scope.daftarBayar._data[i].detailPembayaran[0].noKartu,
                                        namaKartu: $scope.daftarBayar._data[i].detailPembayaran[0].namaKartu,
                                        jenisKartu: jenisKartu
                                    }
                                } else {

                                    objPembayaran.nominal = $scope.daftarBayar._data[i].nominal;

                                    objPembayaran.caraBayar = {
                                        id: $scope.daftarBayar._data[i].id
                                    };

                                }
                            }
                            arrObjPembayaran.push(objPembayaran);
                        }
                        dataObjPost.pembayaran = arrObjPembayaran;
                        medifirstService.cekEnableDisableButton(buttonDisabled);
                        buttonDisabled = true;

                        medifirstService.post('kasir/simpan-data-pembayaran', dataObjPost)
                            .then(function (e) {

                                var nosbm = {
                                    "nosbm": e.data.noSBM
                                }
                                // medifirstService.get("kasir/data-daftar-sbm?"
                                // 	+ "&nosbm=" + e.data.noSBM[0]).then(function (data) {
                                // 		debugger;
                                // 		var spjgn = data;
                                // 		CetakRegJasper(spjgn);
                                // })


                                debugger
                                $scope.item.noSbmBayar = e.data.noSBM[0]
                                $scope.saveLogging('Pembayaran Tagihan', 'NoRegistrasi Pasien Daftar',
                                    e.data.noReg, 'Pembayaran Tagihan No SBM - ' + $scope.item.noSbmBayar + ' pada No Registrasi ' + e.data.noReg)
                                // save jurnal pembayaran 
                                medifirstService.post('sysadmin/general/save-jurnal-pembayarantagihan', nosbm).then(function (res) {

                                })
                                // end jurnal pembayaran 


                                $scope.showBtnSimpan = false;
                                medifirstService.cekEnableDisableButton(buttonDisabled);
                                buttonDisabled = false;
                                // CetakKwL();
                                $scope.showPageCetak(e.data.noSBM, e.data.noReg);
                                medifirstService.get("kasir/data-daftar-sbm?" +
                                    "&nosbm=" + e.data.noSBM[0]).then(function (data) {
                                        debugger;
                                        var spjgn = data;
                                        CetakRegJasper(spjgn, e.data.noReg);
                                    })
                            }, function () {
                                medifirstService.cekEnableDisableButton(buttonDisabled);
                                buttonDisabled = false;
                            });
                    }
                } else {
                    medifirstService.showMessages(isValid.messages);
                }


            }

            function CetakRegJasper(spjgn, noreg) {
                debugger
                $scope.isRouteLoading = true;

                if (spjgn.data[0].noSbm == undefined) {
                    var alertDialog = modelItemAkuntansi.showAlertDialog("Informasi",
                        "transaksi belum dipilih", "Ok");
                    $mdDialog.show(alertDialog).then(function () { });
                } else {
                    var noTransaksi = "";
                    var sudahTerimaDari = '';
                    var terbilang = "";
                    var keterangan = "";
                    var keteranganD = "";
                    var untukPembayaran = "";
                    var uang = spjgn.data[0].totalPenerimaan;
                    var totalUang = $scope.formatRupiah(uang, '');
                    if ($scope.item.STD != undefined) {
                        sudahTerimaDari = $scope.item.STD
                    } else {
                        sudahTerimaDari = spjgn.data[0].namapasien;
                    }
                    if (spjgn.data[0].noregistrasi == null) {
                        noTransaksi = "-";
                    } else {
                        noTransaksi = spjgn.data[0].noregistrasi;
                    }
                    var newValue = spjgn.data[0].totalPenerimaan;

                    medifirstService.get("sysadmin/general/get-terbilang/" + newValue).then(
                        function (dat) {
                            terbilang = dat.data.terbilang.toUpperCase();
                        })
                    var pegawai = '-'


                    medifirstService.get("tatarekening/get-data-login-cetakan?noregistrasi=" + noreg).then(function (e) {
                        var kelas = $scope.item.kelasRawat;
                        var sisa = $scope.item.sisa;
                        if ($scope.item.jenisPasien == "BPJS") {
                            kelas = $scope.item.kelasPenjamin
                            if ($scope.item.deposit > 0) {
                                sisa = $scope.item.deposit - parseFloat($scope.item.bayar)
                            }
                        }
                        // var keterangan = $scope.item.namaPasien.$scope.item.noCm ;
                        if (noTransaksi != "-") {
                            if ($scope.tampungidruangan == 673) {
                                keteranganD = "RM - NAMA/NO.REG/KET  : " + spjgn.data[0].namapasien + "/" + spjgn.data[0].noregistrasi + "/" + spjgn.data[0].keterangan;
                                untukPembayaran = spjgn.data[0].keterangan + " / " + tampungruangan + " / Umum / Diri Sendiri";
                                debugger;
                                var data = {
                                    "gambarLogo": "logodokkes.jpg",
                                    "paramKey": ["namaRS", "alamatRS", "printedBy", "noRegistrasi", "terimaDari", "nominal", "terbilang", "noKwitansi", "petugas", "tujuan", "keteranganD", "pembayaran"],
                                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", pegawai, noTransaksi.toString(), spjgn.data[0].keterangan.toString(), totalUang.toString(), terbilang.toString(), spjgn.data[0].noSbm.toString(), spjgn.data[0].namaPenerima.toString(), spjgn.data[0].keterangan.toString(), keteranganD.toString(), untukPembayaran.toString()],
                                    "paramType": ["", "", "", "", "", "", "", "", "", "", "", ""]
                                };
                            } else {
                                keteranganD = "RM - NAMA/NO.REG/KET  : " + spjgn.data[0].namapasien + "/" + spjgn.data[0].noregistrasi + "/" + spjgn.data[0].keterangan;
                                debugger;
                                var data = {
                                    "gambarLogo": "logodokkes.jpg",
                                    "paramKey": ["namaRS", "alamatRS", "printedBy", "noRegistrasi", "terimaDari", "nominal", "terbilang", "noKwitansi", "petugas", "tujuan", "keteranganD"],
                                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", pegawai, noTransaksi.toString(), spjgn.data[0].keterangan.toString(), totalUang.toString(), terbilang.toString(), spjgn.data[0].noSbm.toString(), spjgn.data[0].namaPenerima.toString(), spjgn.data[0].keterangan.toString(), keteranganD.toString()],
                                    "paramType": ["", "", "", "", "", "", "", "", "", "", ""]
                                };
                            }
                        } else {
                            keteranganD = "RM - NAMA/NO.REG/KET  : " + spjgn.data[0].namapasien_klien + "/" + noTransaksi + "/" + spjgn.data[0].keterangan;
                            debugger;
                            var data = {
                                "gambarLogo": "logodokkes.jpg",
                                "paramKey": ["namaRS", "alamatRS", "printedBy", "noRegistrasi", "terimaDari", "nominal", "terbilang", "noKwitansi", "petugas", "tujuan", "keteranganD"],
                                "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", pegawai, noTransaksi.toString(), spjgn.data[0].namapasien_klien.toString(), totalUang.toString(), terbilang.toString(), spjgn.data[0].noSbm.toString(), spjgn.data[0].namaPenerima.toString(), spjgn.data[0].keterangan.toString(), keteranganD.toString()],
                                "paramType": ["", "", "", "", "", "", "", "", "", "", ""]
                            };
                        }
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
                                var pdf = document.getElementById('tempatLaporan2');
                                pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                                var win = window.open(url, '_blank');
                                win.focus();
                            }
                        }
                        if (noTransaksi != "-") {
                            if ($scope.tampungidruangan == 673) {
                                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/kwSbmTotalRajal.pdf');
                                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/kwSbmTotalRajal.pdf');
                                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/kwSbmTotalRajal.pdf');
                                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                    xhr.open('POST', 'http://192.168.100.209:8797/generic/report/kwSbmTotalRajal.pdf');
                                } else if (window.location.hostname.indexOf('simrs') > -1) {
                                    xhr.open('POST', '/jasper1/generic/report/kwSbmTotalRajal.pdf');
                                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                    xhr.open('POST', 'http://36.93.6.186:8797/generic/report/kwSbmTotalRajal.pdf');
                                } else {
                                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/kwSbmTotalRajal.pdf');
                                }
                            } else {
                                if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/kwSbmTotal.pdf');
                                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/kwSbmTotal.pdf');
                                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                    xhr.open('POST', 'http://10.10.20.167:8797/generic/report/kwSbmTotal.pdf');
                                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                    xhr.open('POST', 'http://36.93.6.186:8797/generic/report/kwSbmTotal.pdf');
                                } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                    xhr.open('POST', 'http://192.168.100.209:8797/generic/report/kwSbmTotal.pdf');
                                } else if (window.location.hostname.indexOf('simrs') > -1) {
                                    xhr.open('POST', '/jasper1/generic/report/kwSbmTotal.pdf');
                                } else {
                                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/kwSbmTotal.pdf');
                                }
                            }

                        } else {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1002/generic/report/kwSbmTotalNonLayanan.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/kwSbmTotalNonLayanan.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/kwSbmTotalNonLayanan.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://36.93.6.186:8797/generic/report/kwSbmTotalNonLayanan.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.209') > -1) {
                                xhr.open('POST', 'http://192.168.100.209:8797/generic/report/kwSbmTotalNonLayanan.pdf');
                            } else if (window.location.hostname.indexOf('simrs') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/kwSbmTotalNonLayanan.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/kwSbmTotalNonLayanan.pdf');
                            }
                        }
                        // set `Content-Type` header
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                        xhr.responseType = 'blob';
                        // send rquest with JSON payload
                        xhr.send(JSON.stringify(data));
                        $scope.isRouteLoading = false;
                    })




                }

            }
            $scope.saveLogging = function (jenis, referensi, noreff, ket) {
                medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis +
                    "&referensi=" + referensi +
                    "&noreff=" + noreff +
                    "&keterangan=" + ket
                ).then(function (data) {

                })
            }
            //*endlog Batal Bayar*

            $scope.Cetak = function () {

            }

            $scope.Kembali = function () {

                switch ($scope.dataParams.pageFrom) {
                    case "PembayaranTagihanLayananKasir":
                        if ($scope.showBtnSimpan) {
                            $scope.changePage("PembayaranTagihanLayananKasir");
                        } else {
                            $state.go("DaftarPasienPulangKasir", {});
                        }
                        break;
                    case "PembayaranTagihanNonLayananKasir":
                        $scope.changePage("PembayaranTagihanNonLayananKasir");
                        break;
                    case "InputTagihanNonLayanan":
                        $scope.changePage("InputTagihanNonLayanan");
                        break;
                    case "DaftarNonLayananKasir":
                        $scope.changePage("DaftarNonLayananKasir");
                        break;
                    case "DaftarPenjualanApotekKasir/terimaUmum":
                        $state.go("DaftarPenjualanApotekKasir", { dataFilter: "terimaUmum" });
                        break;
                    case "DaftarPenjualanApotekKasir/obatBebas":
                        $state.go("DaftarPenjualanApotekKasir", { dataFilter: "obatBebas" });
                        break;
                    case "PenyetoranDepositKasir":
                        $scope.changePage("PenyetoranDepositKasir");
                        break;
                    case "PenyetoranDepositKasirKembali":
                        $scope.changePage("PenyetoranDepositKasirKembali");
                        break;
                    case "PembayaranPiutangKasir":
                        if ($scope.showBtnSimpan) {
                            $scope.changePage("PembayaranPiutangKasir");
                        } else {
                            $state.go("DaftarPiutangKasir", {});
                        }
                        break;
                }
            }

            $scope.changePage = function (stateName) {
                var obj = {
                    noRegistrasi: $scope.dataParams.noRegistrasi
                }

                $state.go(stateName, {
                    dataPasien: JSON.stringify(obj)
                });
            }
            $scope.$watch('item.caraBayar', function (newValue, oldValue) {
                if (newValue.id == 3) {
                    $scope.showTransfer = true
                } else {
                    $scope.showTransfer = false
                }
            });

            $scope.$watch('item.biayaAdministrasi', function (newValue, oldValue) {
                $scope.item.jumlahBayarFix = ($scope.item.totalTagihan - $scope.item.diskon) + parseInt(newValue);
            });

            $scope.$watch('item.diskon', function (newValue, oldValue) {
                $scope.item.jumlahBayarFix = ($scope.item.totalTagihan - newValue) + parseInt($scope.item.biayaAdministrasi);
            });

            $scope.$watch('item.caraBayar', function (newValue, oldValue) {
                if (newValue != undefined && newValue.namaExternal == "KARTU KREDIT") {
                    $scope.showCC = true;
                } else {
                    $scope.showCC = false;
                }
            });

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

            // function CetakKwL() {
            //     var client = new HttpClient();
            //     client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansi-layanan=1&norec=' + $scope.dataParams.noRegistrasi + '&keterangan=' + '' + '&strIdPegawai=' + $scope.item.kasir + '&strIdRuangan=-&view=false', function(response) {
            //         // do something with response
            //     });
            // }

            $scope.showPageCetak = function (noSBM, noReg) {
                switch ($scope.dataParams.pageFrom) {
                    case "PembayaranTagihanLayananKasir":
                        var sudahTerimaDari = ''
                        if ($scope.item.terimaDari != undefined) {
                            sudahTerimaDari = $scope.item.terimaDari
                        }
                        var iydeeVegawhai = "";
                        iydeeVegawhai = medifirstService.getPegawaiLogin();
                        // var client = new HttpClient();
                        // client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=' + noReg + $scope.dataParams.noRegistrasi + '&idPegawai=' + iydeeVegawhai + '&STD=' + sudahTerimaDari + '&view=false', function(response) {
                        //     // do something with response
                        // });
                        $state.go('DaftarPasienPulangKasir');
                        break;
                    case "PembayaranTagihanNonLayananKasir":
                        var sudahTerimaDari = ''
                        if ($scope.item.terimaDari != undefined) {
                            sudahTerimaDari = $scope.item.terimaDari
                        }
                        var iydeeVegawhai = "";
                        iydeeVegawhai = medifirstService.getPegawaiLogin();
                        // var client = new HttpClient();
                        // client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=' + noSBM + '&idPegawai=' + iydeeVegawhai + '&STD=' + sudahTerimaDari + '&view=false', function(response) {
                        //     // do something with response
                        // });
                        break;
                    case "InputTagihanNonLayanan":
                        var sudahTerimaDari = ''
                        if ($scope.item.terimaDari != undefined) {
                            sudahTerimaDari = $scope.item.terimaDari
                        }
                        var iydeeVegawhai = "";
                        iydeeVegawhai = medifirstService.getPegawaiLogin();
                        // var client = new HttpClient();
                        // client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=' + noSBM + '&idPegawai=' + iydeeVegawhai + '&STD=' + sudahTerimaDari + '&view=false', function(response) {
                        //     // do something with response
                        // });
                        break;
                    case "DaftarNonLayananKasir":
                        var sudahTerimaDari = ''
                        if ($scope.item.terimaDari != undefined) {
                            sudahTerimaDari = $scope.item.terimaDari
                        }
                        var iydeeVegawhai = "";
                        iydeeVegawhai = medifirstService.getPegawaiLogin();;
                        // var client = new HttpClient();
                        // client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=' + noSBM + '&idPegawai=' + iydeeVegawhai + '&STD=' + sudahTerimaDari + '&view=false', function(response) {
                        //     // do something with response
                        // });
                        break;
                    case "DaftarPenjualanApotekKasir/terimaUmum":
                        var obj = {
                            noRegistrasi: noSBM,
                            backPage: $scope.defaultPage,
                            jenis: $scope.dataParams.pageFrom,
                            noREG: noReg
                        }

                        $state.go("CetakKwitansi", {
                            dataPasien: JSON.stringify(obj)
                        });
                        break;
                    case "DaftarPenjualanApotekKasir/obatBebas":
                        var obj = {
                            noRegistrasi: noSBM,
                            backPage: $scope.defaultPage,
                            jenis: $scope.dataParams.pageFrom,
                            noREG: noReg
                        }

                        $state.go("CetakKwitansi", {
                            dataPasien: JSON.stringify(obj)
                        });
                        break;
                    case "PenyetoranDepositKasir":
                        var sudahTerimaDari = ''
                        if ($scope.item.terimaDari != undefined) {
                            sudahTerimaDari = $scope.item.terimaDari
                        }
                        var iydeeVegawhai = "";
                        iydeeVegawhai = medifirstService.getPegawaiLogin();
                        // var client = new HttpClient();
                        // client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=DEPOSIT' + noSBM + '&idPegawai=' + iydeeVegawhai + '&STD=' + sudahTerimaDari + '&view=false', function(response) {
                        //     // do something with response
                        // });
                        $state.go('DaftarPasienAktif');
                        break;
                    case "PembayaranPiutangKasir":
                        var obj = {
                            noRegistrasi: noSBM,
                            backPage: $scope.defaultPage,
                            jenis: $scope.dataParams.pageFrom,
                            noREG: noReg
                        }

                        $state.go("CetakKwitansi", {
                            dataPasien: JSON.stringify(obj)
                        });
                        break;
                    case "PenyetoranDepositKasirKembali":
                        var sudahTerimaDari = ''
                        if ($scope.item.terimaDari != undefined) {
                            sudahTerimaDari = $scope.item.terimaDari
                        }
                        var iydeeVegawhai = "";
                        // manageKasir.getDataTableTransaksi("get-data-login", true).then(function(dat){
                        // 	iydeeVegawhai = dat.data[0].namalengkap;

                        // })
                        iydeeVegawhai = medifirstService.getPegawaiLogin();
                        //  		var client = new HttpClient();
                        // client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi='+$scope.dataParams.noRegistrasi+'&idPegawai='+iydeeVegawhai+'&STD='+sudahTerimaDari+'&view=false', function(response) {
                        //     // do something with response
                        // });
                        // var client = new HttpClient();
                        // client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2-kembali-deposit=1&noregistrasi=KEMBALIDEPOSIT' + noSBM + '&idPegawai=' + iydeeVegawhai + '&STD=' + sudahTerimaDari + '&view=false&noregistrasi=' + $scope.dataParams.noRegistrasi, function(response) {
                        //     // do something with response
                        // });
                        $state.go('DaftarPasienPulangKasir');
                        break;
                }

            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

        }
    ]);
});