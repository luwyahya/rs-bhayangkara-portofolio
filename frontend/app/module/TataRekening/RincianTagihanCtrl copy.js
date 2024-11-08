define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RincianTagihanCtrl', ['MedifirstService', '$state', '$q', '$scope', '$window', '$mdDialog', 'CacheHelper',
        function (medifirstService, $state, $q, $scope, window, $mdDialog, cacheHelper) {
            $scope.now = new Date();

            $scope.dataParams = JSON.parse($state.params.dataPasien);

            $scope.showBilling = false;

            var tempData = [];
            var logData = [];
            var dataDel = [];
            $scope.item = {};
            $scope.model = {};
            $scope.button = true;
            $scope.item.tidakDitemukan = false;
            $scope.billing = true;
            $scope.cetak = true;
            $scope.DiskonKM = false;
            $scope.ubahTanggal = false;
            $scope.FilterData = false;
            var statusPosting = true;
            $scope.istempatLaporan = true;
            var statusHapus = "";
            var dibayar = 0
            var verifTotal = 0
            $scope.item.norecPp = '';


            $scope.isRouteLoading = false;
            var norec_ppd = ''
            var norec_pp = ''
            var norec_pd = ''
            var strukfk = ''
            var hargasatuan = '';
            var data3 = [];
            var dataLogin = [];
            var KelompokUser = [];
            var idKelompokPasienLastfk = "";

            var dataLayanan = [];
            var dataResep = [];
            var ruangaan2 = {};
            $scope.departemen = ''
            var tgltgltgltgl = ''
            var tglkpnaja = []
            var statusOtomatis = "";
            $scope.selectedData2 = [];
            var data2 = [];
            var dataTampil = 'layanan';
            $scope.item.PegawaiLoginfk = '';
            $scope.item.PegawaiPenindak = '';
            $scope.statusSelesaiPeriksa = false
            var statusOtomatisGet = cacheHelper.get('statusOtomatis');
            if (statusOtomatisGet == "YA") {
                statusOtomatis = "YA";
                cacheHelper.set('statusOtomatis', "TIDAK");

            } else {
                statusOtomatis = "TIDAK";
            }

            $scope.listNum = [
                { id: 1, nama: 'NUM' }, //#
                { id: 2, nama: 'DENUM' },
            ]

            if (statusOtomatis == "YA") {

                LoadData();
                LoadDataClosingFaktur();
                loadpertama();
                statusOtomatis = "TIDAK";
            } else {
                statusHapus = "HAPUS";
                LoadData();
                LoadDataClosingFaktur();
                loadpertama();
            }



            function
                LoadDataClosingFaktur() {
                medifirstService.get("tatarekening/get-status-close-pemeriksaan?noregistrasi=" +
                    $scope.dataParams.noRegistrasi, true).then(function (dat) {
                        $scope.statusSelesaiPeriksa = dat.data.data
                        debugger;
                    });
            }

            function loadpertama() {

                medifirstService.get("tatarekening/get-data-login?noRegistrasi=" + $scope.dataParams.noRegistrasi).then(function (e) {

                    dataLogin = e.data.datalogin;
                    idKelompokPasienLastfk = e.data.listRuangan[0].objectkelompokpasienlastfk;
                    KelompokUser = e.data.kelompokuser;
                    $scope.listRuangAPD = e.data.listRuangan
                    $scope.item.PegawaiLoginfk = e.data.pegawailoginfk;
                    var brs = e.data.listRuangan.length
                    ruangaan2 = { id: e.data.listRuangan[brs - 1].id, namaruangan: e.data.listRuangan[brs - 1].namaruangan }
                    $scope.item.ruang2 = ruangaan2


                    var objSave = {
                        noregistrasi: $scope.dataParams.noRegistrasi
                    }
                    if (statusHapus != "HAPUS") {
                        medifirstService.post('tatarekening/save-akomodasi-tea', objSave).then(function (data) {
                            $scope.IsDataResep = false
                            loadGrid($scope.dataParams.noRegistrasi, $scope.item.ruang2.id)
                        });
                    } else {
                        loadGrid($scope.dataParams.noRegistrasi, $scope.item.ruang2.id)
                    }
                })
            }

            function LoadData() {
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/tindakan/get-tanggal-posting", true).then(function (dat) {
                    tgltgltgltgl = dat.data.mindate[0].max
                    tglkpnaja = dat.data.datedate

                })
                $scope.selectedData = [];
                $scope.selectedData2 = [];
                dataLayanan = [];
                dataResep = [];
                $scope.dataRincianTagihan = new kendo.data.DataSource({
                    data: []
                });
                medifirstService.get("tatarekening/get-sudah-verif?noregistrasi=" +
                    $scope.dataParams.noRegistrasi, true).then(function (dat) {
                        $scope.item.statusVerif = dat.data.status
                    });

                // medifirstService.get("tatarekening/get-status-close-pemeriksaan?noregistrasi=" +
                // 	$scope.dataParams.noRegistrasi, true).then(function (dat) {
                // 		$scope.statusSelesaiPeriksa = dat.data.data
                // 		debugger;
                // 	});
                // 	debugger;
                medifirstService.get("tatarekening/get-data-login?noRegistrasi=" + $scope.dataParams.noRegistrasi).then(function (e) {

                    dataLogin = e.data.datalogin;
                    idKelompokPasienLastfk = e.data.listRuangan[0].objectkelompokpasienlastfk;
                    KelompokUser = e.data.kelompokuser;
                    $scope.listRuangAPD = e.data.listRuangan
                    $scope.item.PegawaiLoginfk = e.data.pegawailoginfk;
                    var brs = e.data.listRuangan.length
                    ruangaan2 = { id: e.data.listRuangan[brs - 1].id, namaruangan: e.data.listRuangan[brs - 1].namaruangan }
                    $scope.item.ruang2 = ruangaan2


                    var objSave = {
                        noregistrasi: $scope.dataParams.noRegistrasi
                    }
                    $scope.isRouteLoading = false;
                    // medifirstService.post('tatarekening/save-akomodasi-tea', objSave).then(function (data) {
                    // 	$scope.IsDataResep = false
                    // 	loadGrid($scope.dataParams.noRegistrasi, $scope.item.ruang2.id)
                    // });
                })

                $scope.klikGrid = function (item) {
                    // loadCombo();
                    // $scope.item.periodeAwal = dateHelper.setJamAwal(new Date());
                    // $scope.item.periodeAkhir = $scope.now;
                    if (item != undefined) {
                        $scope.item.pilihDokter = { id: item.pgpjid, namalengkap: item.namadokter }
                    }
                }
            }

            function loadGrid(noreg, idRuangan, jenisdata) {
                if (jenisdata == undefined)
                    jenisdata = 'layanan'
                $scope.isRouteLoading = true;
                $q.all([
                    medifirstService.getServiceArray("tatarekening/detail-tagihanv2/" + noreg + '?jenisdata=' + jenisdata + '&idruangan=' + idRuangan)
                ])
                    .then(function (data) {
                        // debugger;
                        if (data[0].statResponse) {
                            dataLayanan = [];
                            dataResep = [];
                            dibayar = 0
                            verifTotal = 0
                            for (var i = data[0].details.length - 1; i >= 0; i--) {
                                if (data[0].details[i].strukfk != null) {
                                    if (data[0].details[i].strukfk.length > 20) {
                                        dibayar = dibayar + data[0].details[i].total
                                    }
                                    if (data[0].details[i].strukfk.length < 20 && data[0].details[i].strukfk.length > 5) {
                                        verifTotal = verifTotal + data[0].details[i].total
                                    }
                                }
                                if (data[0].details[i].aturanpakai == null) {
                                    // dataLayanan[] = data[0].details[i]
                                    dataLayanan.push(data[0].details[i])
                                } else {
                                    dataResep.push(data[0].details[i])
                                    // dataResep[] = data[0].details[i]
                                }
                                if (data[0].details[i].namaPelayanan) {
                                    if (data[0].details[i].namaPelayanan.indexOf('Konsul') > -1 && data[0].details[i].dokter == '-' || data[0].details[i].dokter == null) {
                                        toastr.warning('Mohon isi Dokter Pemeriksa pada layanan ' +
                                            data[0].details[i].namaPelayanan, 'Peringatan !')
                                    }
                                }
                                if (data[0].details[i].iscito == "1") {
                                    data[0].details[i].statuscito = "✔"
                                } else {
                                    data[0].details[i].statuscito = ""
                                }

                                if (data[0].details[i].isparamedis == "1") {
                                    data[0].details[i].paramedis = "✔"
                                } else {
                                    data[0].details[i].paramedis = ""
                                }
                            }
                            data[0].bayar = data[0].dibayar
                            data[0].verifTotal = data[0].diverif //verifTotal
                            data[0].sisa = parseFloat(data[0].billing) - data[0].dibayar - parseFloat(data[0].deposit)
                            $scope.item = data[0];
                            norec_pd = data[0].norec_pd
                            $scope.item.tglPulang = $scope.formatTanggal($scope.item.tglPulang);
                            $scope.item.tglMasuk = $scope.formatTanggal($scope.item.tglMasuk);
                            $scope.item.tgllahir = $scope.formatTanggal($scope.item.tgllahir);
                            data3 = data[0].details
                            if ($scope.IsDataResep) {
                                dataLayanan = dataResep
                            }
                            $scope.dataRincianTagihan = new kendo.data.DataSource({
                                data: dataLayanan, //details,
                                group: [
                                    //{field: "ruanganTindakan"}
                                ],
                                pageSize: 20,

                                // pageSize: 10,
                            });
                            $scope.item.ruang2 = ruangaan2
                        } else {
                            $scope.item.bayar = 0
                            $scope.item.billing = 0
                            $scope.item.deposit = 0
                            $scope.item.sisa = 0
                            $scope.dataRincianTagihan = new kendo.data.DataSource({
                                data: [],
                            });
                        }
                        $scope.isRouteLoading = false;

                    });

                debugger
                medifirstService.get("tatarekening/get-pasca-ranap?noregistrasi=" +
                    $scope.dataParams.noRegistrasi, true).then(function (dat) {
                        // $scope.item.statusVerif = dat.data.status
                        if (dat.status == 200) {
                            if (dat.data.data.length > 0) {
                                $scope.indikator = dat.data.data;
                                popupPilihanIndikator(0)
                            }
                        }
                    });

                if (idRuangan == 44) {

                } else {
                    medifirstService.get("tatarekening/tindakan/get-indikator-daily?noregistrasi=" +
                        noreg + '&idruangan=' + idRuangan).then(function (xl) {
                            if (xl.data.data.length > 0) {
                                $scope.indikator = xl.data.data;
                                popupPilihanIndikator(0);
                            }
                        })
                }
            }

            function popupPilihanIndikator(x) {
                debugger
                $scope.item.objectsasaranmutufk = $scope.indikator[x].objectsasaranmutufk;
                $scope.item.norec_ipp = $scope.indikator[x].norec_ipp;
                $scope.item.norecApd = $scope.indikator[x].norec_apd;
                $scope.item.norecPp = $scope.indikator[x].norec_pp;
                $scope.item.asalruanganfk = $scope.indikator[x].asalruanganfk;
                // for(x; x < $scope.indikator.length; x++) {
                medifirstService.get("tatarekening/tindakan/get-list-pertanyaan?objectmappingindikatortoprodukfk=" +
                    $scope.indikator[x].objectmappingindikatortoprodukfk
                ).then(function (dat) {
                    $scope.item.indikator = dat.data.data[0].indikator;
                    $scope.item.tidakDitemukan = false;
                    // $scope.item.norecPp = dat.data.data[0].norec_pp;
                    $scope.awal = x;
                    $scope.next = x + 1;
                    if (dat.data.data[0].id_indikator == '88') {
                        $scope.item.note = 'Infus';
                    } else if (dat.data.data[0].id_indikator == '89') {
                        $scope.item.note = 'Catheter';
                    } else if (dat.data.data[0].id_indikator == '91') {
                        $scope.item.note = 'Intubasi';
                    } else if (dat.data.data[0].id_indikator == '92') {
                        $scope.item.note = 'Umbilical';
                    }
                    for (var i = 0; i < dat.data.data.length; i++) {
                        dat.data.data[i].status = false;
                    }
                    if (dat.data.data[0].id_indikator == '90') {
                        $scope.biasa = true;
                        $scope.operasi = false;
                    } else {
                        $scope.biasa = false;
                        $scope.operasi = true;
                    }

                    if (dat.data.data[0].id_indikator == '89' || dat.data.data[0].id_indikator == '88') {
                        $scope.copot = false;
                    } else {
                        $scope.copot = true;
                    }

                    for (var i = 0; i < dat.data.data.length; i++) {
                        if (dat.data.data[i].flag == '1') {
                            dat.data.data[i].flagtrue = false;
                            dat.data.data[i].flagfalse = true;
                        } else {
                            dat.data.data[i].flagtrue = true;
                            dat.data.data[i].flagfalse = false;
                        }
                    }

                    $scope.listPertanyaan = dat.data.data;

                    $scope.popupPilihanIndikator.center().open();
                })
                // }
            }

            $scope.tutupPopUpIndikator = function (x) {
                debugger
                if ($scope.next < $scope.indikator.length) {
                    if (x == false) {
                        toastr.error('Pop Up ini Tidak Bisa diClose, Isi Lalu Simpan')
                        popupPilihanIndikator($scope.awal)
                    }
                }
            }

            $scope.SavePertanyaan = function () {
                debugger
                var ada = false;
                var dataIndikators = [];
                var statVariable = false;
                var persentase = 0;
                if ($scope.listPertanyaan.length > 0) {
                    for (var i = 0; i < $scope.listPertanyaan.length; i++) {

                        if ($scope.listPertanyaan[i].status == true) {
                            ada = true;
                            persentase = persentase + parseInt($scope.listPertanyaan[i].bobot);
                        } else {
                            $scope.listPertanyaan[i].status == false;
                        }
                        if ($scope.item.tidakDitemukan == false) {
                            if (persentase >= 50) {
                                statVariable = true;
                            }
                        }
                    }
                }

                if (ada == false && $scope.item.tidakDitemukan == false) {
                    toastr.error('Pertanyaan harus di isi')
                    return
                }

                debugger
                dataIndikators.push({
                    "arrayIndikator": $scope.listPertanyaan,
                    "tglpelayanan": moment($scope.now).format('YYYY-MM-DD HH:mm'),
                    "id_indikator": $scope.listPertanyaan[0].id_indikator,
                    "objectruanganfk": $scope.item.details[0].ruid,
                    "mipfk": $scope.listPertanyaan[0].mipfk,
                    "norec_pp": $scope.item.norecPp,
                    "objectdepartemenfk": $scope.item.details[0].objectdepartemenfk,
                    "statVariable": statVariable
                })

                var objSaves = {
                    "datas": dataIndikators,
                    "norec_apd": $scope.item.norec_apd
                }

                if ($scope.item.asalruanganfk == 44) {
                    var objSaveas = {
                        'arrayIndikator': $scope.listPertanyaan,
                        'norec_apd': $scope.item.norecApd,
                        'norec_ipp': $scope.item.norec_ipp,
                        'asalruanganfk': $scope.item.asalruanganfk,
                        'tgl_indikator': moment($scope.now).format('YYYY-MM-DD HH:mm')
                    }
                    medifirstService.postNonMessage('tatarekening/tindakan/update-tanggal-ppi', objSaveas).then(function (data) { })
                }

                if ($scope.item.deptid == 18) {
                    var objSaveas = {
                        'arrayIndikator': $scope.listPertanyaan,
                        'norec_apd': $scope.item.norecApd,
                        'norec_ipp': $scope.item.norec_ipp,
                        'asalruanganfk': $scope.item.asalruanganfk,
                        'tgl_indikator': moment($scope.now).format('YYYY-MM-DD HH:mm')
                    }
                    medifirstService.postNonMessage('tatarekening/tindakan/update-tanggal-ppi', objSaveas).then(function (data) { })
                }

                medifirstService.postNonMessage('tatarekening/tindakan/save-tindakan-ppi', objSaves).then(function (data) {
                    if ($scope.next < $scope.indikator.length) {
                        popupPilihanIndikator($scope.next)
                    } else {
                        $scope.popupPilihanIndikator.close()
                    }
                })

                // medifirstService.post('tatarekening/tindakan/cektindakan',JSON.stringify(objSave)).then(function(x){
                // if(x.data.data == 'lolos'){
                // 	medifirstService.post('tatarekening/tindakan/save-tindakan', JSON.stringify(objSave)).then(function (e) {
                // 	debugger

                // 	if(e.data.PP.length > 0) {
                // 		var objSaves = {
                // 		"datas": e.data.PP,
                // 		'norec_apd': $scope.currentNorecAPD
                // 		}
                // 		medifirstService.postNonMessage('tatarekening/tindakan/save-tindakan-ppi', objSaves).then(function (data) {
                // 		})
                // 	}
                // 	medifirstService.postNonMessage('sysadmin/logging/save-log-input-tindakan', objSave).then(function (data) {
                // 	})
                // 	$scope.hapusAll();
                // 	$scope.hideSimpan = false

                // 	}, function (error) {
                // 	$scope.hideSimpan = false
                // 	})
                // }else{
                // 	$scope.hideSimpan = false
                // 	alert(x.data.data);
                // 	return;
                // }                       
                // })
            }

            $scope.hapusTindakanInd = function () {
                debugger

                var json = {
                    'norec_ipp': $scope.item.norec_ipp,
                    'close': false
                }
                debugger;
                medifirstService.post('tatarekening/tindakan/hapus-flag-tindakan', json).then(function (e) {
                    // if (e.status === 201) {
                    // 	debugger;
                    // 	medifirstService.post('tatarekening/save-log-closing-faktur', json).then(function (e) {
                    // 		LoadDataClosingFaktur();
                    // 	})
                    // }
                })

                if ($scope.next < $scope.indikator.length) {
                    popupPilihanIndikator($scope.next)
                } else {
                    $scope.popupPilihanIndikator.close()
                }
                // medifirstService.get("tatarekening/tindakan/hapus-flag-tindakan" + $scope.item.norec_apd).then(function (dat) {
                // 	// for (var i = 0; i < dat.data.details.length; i++)
                // 	// {	
                // 	// 	if(dat.data.details[i].dokter == '' || dat.data.details[i].dokter == undefined || dat.data.details[i].dokter=="-" )
                // 	// 	{
                // 	// 		if(dat.data.details[i].norec != null){
                // 	// 			alert('data belum lengkap (Dokter Pemeriksa Belum Diisi lengkapi Data terlebihdahulu )!!' + 'pelayanan :' + dat.data.details[i].namaPelayanan + 'ruangan :' +  dat.data.details[i].ruanganTindakan + 'tgl.peelayanan :' +  dat.data.details[i].tglPelayanan)
                // 	// 			return
                // 	// 		}
                // 	// 	}
                // 	// }
                // 	// if($scope.item.deptidlast === '16') {
                // 	// 	$scope.popUpclosing.center().open();
                // 	// } else {
                // 	// 	var stt = 'false'
                // 	// 	if (confirm('Pasien yang sudah ditutup Faktur tidak bisa mendapat tindakan lagi. \nApakah Anda Yakin Ingin Menutup Faktur? ')) {
                // 	// 		// Save it!
                // 	// 		stt = 'true';
                // 	// 	} else {
                // 	// 		// Do nothing!
                // 	// 		stt = 'false'
                // 	// 	}	

                // 	// 	if (stt == 'true') {
                // 	// 		$scope.closingTagihan();
                // 	// 	}
                // 	// }
                // })
                // $scope.item.norec_apd = $scope.item.norec_apd;
            };

            $scope.dropDownNum = function (container, options) {
                debugger;
                var editor = $('<input kendo-combo-box required k-data-text-field="\'nama\'" k-data-value-field="\'nama\'" k-filter="\'contains\'" k-data-source="listNum" data-bind="id:' + options.nama + '"/>')
                    .appendTo(container);
            };

            $scope.SaveIndikaor = function () {
                debugger
                // if($scope.item.objectruanganfk == undefined || $scope.item.objectruanganfk.value == undefined) {
                // 	toastr.error('Pilih Bangsal Terlebih dahulu');
                // 	return
                // }
                // if($scope.item.objectjenispegawaifk == undefined || $scope.item.objectjenispegawaifk.value == undefined) {
                // 	toastr.error('Pilih Pforesi Terlebih dahulu');
                // 	return
                // }
                // if($scope.item.objectpegawaifk == undefined || $scope.item.objectpegawaifk.value == undefined) {
                // 	toastr.error('Pilih Pegawai Terlebih dahulu');
                // 	return
                // }
                var dataArray = [];
                for (let i = 0; i < $scope.dataIPCLN._data.length; i++) {
                    var norec = '';
                    if ($scope.dataIPCLN._data[i].objecthygienefk != undefined && $scope.dataIPCLN._data[i].objecthygienefk.value != '-') {
                        debugger
                        var langkah = 0;
                        if ($scope.dataIPCLN._data[i].objecthygienefk.value != 3) {
                            langkah = 2;
                        }
                        if ($scope.dataIPCLN._data[i].norec == undefined || $scope.dataIPCLN._data[i].norec == null || $scope.dataIPCLN._data[i].norec.length != 32) {
                            norec = '';
                        } else {
                            norec = $scope.dataIPCLN._data[i].norec;
                        }

                        dataArray.push({
                            "norec": norec,
                            "tanggal": moment($scope.tanggal).format('YYYY-MM-DD HH:mm'),
                            "objectruanganfk": $scope.item.objectruanganfk != undefined ? $scope.item.objectruanganfk.value : null,
                            "objectjenispegawaifk": $scope.item.objectjenispegawaifk != undefined ? $scope.item.objectjenispegawaifk.value : null,
                            "objectpegawaifk": $scope.item.objectpegawaifk != undefined ? $scope.item.objectpegawaifk.value : null,
                            "objectindikasifk": $scope.dataIPCLN._data[i].objectindikasifk.value != undefined ? $scope.dataIPCLN._data[i].objectindikasifk.value : null,
                            "objecthygienefk": $scope.dataIPCLN._data[i].objecthygienefk.value != undefined ? $scope.dataIPCLN._data[i].objecthygienefk.value : null,
                            "langkah": langkah,
                            "kesempatan": $scope.item.kesempatan != undefined ? $scope.item.kesempatan : 0,
                        });
                    }
                }


                if (dataArray.length !== 0) {
                    var objSave = {
                        "datas": dataArray
                    }
                    medifirstService.post("emr/save-kepatuhanhandhygiene-array", objSave).then(function (e) {
                        // $scope.item = {};
                        // init();
                        // loadData();
                        // $scope.dataIPCLN = {};
                    });
                }
                $scope.isRouteLoading = false;

            }

            $scope.Batal = function () {
                // $scope.item = {}
                $scope.dialogPopup.close();
            }

            $scope.listIPCLN = {
                // editable: true,
                editable: "incell",
                columns: [{
                    field: "indikator",
                    title: "Temuan",
                    width: "50%",
                },
                {
                    field: "nama",
                    title: "Status",
                    width: "45%",
                    editor: $scope.dropDownNum,
                    template: "#=status.nama#"
                },
                ]
            };
            $scope.loadDataResep = function () {
                $scope.IsDataResep = true
                loadGrid($scope.item.noRegistrasi, $scope.item.ruang2.id, 'resep')

            }
            $scope.loadDataLayanan = function () {
                $scope.IsDataResep = false
                loadGrid($scope.item.noRegistrasi, $scope.item.ruang2.id, 'layanan')
            }

            $scope.ubahDokterPemeriksa = function () {
                $scope.cboDokter = true
            }
            $scope.ubahTanggal = function () {

                if (moment(tgltgltgltgl).format('YYYY-MM-DD 00:00:00') < $scope.dataSelected.tglPelayanan) {
                    for (var i = tglkpnaja.length - 1; i >= 0; i--) {
                        if (tglkpnaja[i] == parseFloat(moment($scope.dataSelected.tglPelayanan).format('D'))) {
                            alert('Data Sudah di Posting, Hubungi Bagian Akuntansi.');
                            return;
                        }

                    }
                } else {
                    alert('Data Sudah di Posting, Hubungi Bagian Akuntansi.');
                    return;
                }
                $scope.dtTanggal = true
            }
            $scope.batalTanggal = function () {
                $scope.dtTanggal = false;
                $scope.item.tanggalPelayanan = "";
            }
            $scope.batalDokterPemeriksa = function () {
                $scope.cboDokter = false
            }
            $scope.FilterDataCMD = function () {
                $scope.FilterData = true
            }
            $scope.BatalFilter = function () {
                $scope.FilterData = false
                $scope.item.namaPelayanan = ''
                $scope.item.namaruangan = {}
            }
            // $scope.CariFilter = function(){
            $scope.$watch('item.filter', function (newValue, oldValue) {
                var layananFilter = [];
                var txtnaonwelah = '';

                if (dataTampil == 'layanan') {

                    for (var i = dataLayanan.length - 1; i >= 0; i--) {
                        txtnaonwelah = ' ' + dataLayanan[i].namaPelayanan;
                        txtnaonwelah = txtnaonwelah.toUpperCase()
                        if (txtnaonwelah != null) {
                            if (parseFloat(txtnaonwelah.indexOf($scope.item.filter.toUpperCase())) > 0) {
                                layananFilter.push(dataLayanan[i])
                            }
                        }

                    }
                    if ($scope.item.filter == '') {
                        layananFilter = dataLayanan
                    }
                    $scope.dataRincianTagihan = new kendo.data.DataSource({
                        data: layananFilter,
                        pageSize: 20,
                        group: [
                            //{field: "ruanganTindakan"}
                        ],
                    });
                } else {
                    var resepFilter = [];
                    for (var i = dataResep.length - 1; i >= 0; i--) {
                        txtnaonwelah = ' ' + dataResep[i].namaPelayanan;
                        txtnaonwelah = txtnaonwelah.toUpperCase()
                        if (txtnaonwelah != null) {
                            if (parseFloat(txtnaonwelah.indexOf($scope.item.filter.toUpperCase())) > 0) {
                                resepFilter.push(dataResep[i])
                            }
                        }

                    }
                    if ($scope.item.filter == '') {
                        resepFilter = dataResep
                    }
                    $scope.dataRincianTagihan = new kendo.data.DataSource({
                        data: resepFilter,
                        pageSize: 20,
                        group: [
                            //{field: "ruanganTindakan"}
                        ],
                    });
                }

            });
            $scope.CariFilterRuangan = function () {
                if ($scope.IsDataResep)
                    var jenisdata = 'resep'
                else
                    var jenisdata = 'layanan'

                var strRUanganFilter = '';
                if ($scope.item.ruang2 != null) {
                    strRUanganFilter = '&jenisdata=layanan&idruangan=' + $scope.item.ruang2.id
                    ruangaan2 = { id: $scope.item.ruang2.id, namaruangan: $scope.item.ruang2.namaruangan }
                } else {
                    ruangaan2 = {}
                }

                $scope.selectedData = [];

                dataLayanan = [];
                dataResep = [];
                var objSave = {
                    noregistrasi: $scope.item.noRegistrasi
                }
                // medifirstService.post('sysadmin/general/save-jurnal-pelayananpasien_t', objSave).then(function (data) {
                // })

                loadGrid($scope.item.noRegistrasi, $scope.item.ruang2 != null ? $scope.item.ruang2.id : '', jenisdata)
            }
            $scope.CariNoreg = function () {
                $scope.IsDataResep = false
                $scope.selectedData = [];

                medifirstService.get("tatarekening/get-data-login?noRegistrasi=" + $scope.item.noRegistrasi).then(function (e) {
                    dataLogin = e.data.datalogin;
                    KelompokUser = e.data.kelompokuser;
                    $scope.listRuangAPD = e.data.listRuangan
                    if (e.data.listRuangan.length > 0) {
                        ruangaan2 = { id: e.data.listRuangan[0].id, namaruangan: e.data.listRuangan[0].namaruangan }
                        $scope.item.ruang2 = ruangaan2
                    }

                    dataLayanan = [];
                    dataResep = [];
                    var objSave = {
                        noregistrasi: $scope.item.noRegistrasi
                    }
                    // medifirstService.post('akuntansi/save-jurnal-pelayananpasien_t', objSave).then(function (data) {
                    // })
                    // medifirstService.post('tatarekening/save-akomodasi-tea', objSave).then(function (data) {
                    // 	loadGrid($scope.item.noRegistrasi, $scope.item.ruang2 != null ? $scope.item.ruang2.id : '', 'layanan')
                    // })
                })


            }
            $scope.simpanDokterPemeriksa = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih pelayanan dahulu!");
                    return;
                }
                var objSave = {
                    norec_pp: $scope.dataSelected.norec,
                    objectpegawaifk: $scope.item.namaDokter.id,
                    norec_apd: $scope.dataSelected.norec_apd
                }
                medifirstService.post('tatarekening/save-update-dokter_ppp', objSave).then(function (data) {
                    LoadData()
                });
                $scope.DiskonKM = false;
            }
            $scope.saveLogging = function (jenis, referensi, noreff, ket) {
                medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis +
                    "&referensi=" + referensi +
                    "&noreff=" + noreff +
                    "&keterangan=" + ket
                ).then(function (data) {

                })
            }
            $scope.simpanTanggal = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih pelayanan dahulu!");
                    return;
                }

                var objSave = {
                    norec_pp: $scope.dataSelected.norec,
                    tanggalPelayanan: moment($scope.item.tanggalPelayanan).format('YYYY-MM-DD HH:mm:ss')
                }
                medifirstService.post('tatarekening/save-update-tanggal_pelayanan', objSave).then(function (data) {
                    $scope.saveLogging('Ubah Tgl Pelayanan', 'norec Pelayanan Pasien', $scope.dataSelected.norec, 'menu Detail Tagihan')
                    LoadData()
                });
                $scope.dtTanggal = false;
            }

            function showButton() {
                $scope.showBtnKembali = true;
                $scope.showBtnCetak = true;
            }


            $scope.pilihHargaByKelas = function () {
                $scope.item.harga = $scope.item.kelas.hargasatuan
            }

            showButton();

            $scope.dataVOloaded = true;
            $scope.now = new Date();


            $scope.rowNumber = 0;
            $scope.renderNumber = function () {
                return ++$scope.rowNumber;
            }
            $scope.klikDetail = function (data) {

                if (data.komponenharga != "Jasa Sarana") {
                    $scope.button = false;
                    $scope.billing = false;
                    $scope.cetak = false;
                    $scope.dtTanggal = false;
                    $scope.FilterData = false;
                    $scope.DiskonKM = true;
                    $scope.label = data.komponenharga;
                    $scope.item.komponenDis = data.hargasatuan;
                    $scope.item.persenDiscount = "";
                    $scope.item.diskonKomponen = "";
                    norec_ppd = data.norec
                    norec_pp = data.norec_pp
                    strukfk = data.strukfk
                    hargasatuan = data.hargasatuan
                } else if (data.komponenharga == "Jasa Sarana") {
                    $scope.button = true;
                    $scope.billing = true;
                    $scope.cetak = true;
                    $scope.dtTanggal = false;
                    $scope.FilterData = false;
                    $scope.DiskonKM = false;
                }
            }

            $scope.$watch('item.persenDiscount', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if ($scope.item.persenDiscount > 100) {
                        $scope.item.persenDiscount = "";
                    }
                    $scope.item.diskonKomponen = ((parseFloat($scope.item.komponenDis)) * $scope.item.persenDiscount) / 100
                }
            })

            $scope.UpdateDiskon = function () {
                if (strukfk != " / ") {
                    alert('Sudah di Verifikasi Tatarekening tidak bisa diskon!')
                    return
                }
                // if (KelompokUser[0].id != 52) {
                // 	alert('Hanya TataRekening/Admin yg boleh memberikan diskon!')
                // 	return
                // }
                if ($scope.item.password != "jambalroti") {
                    toastr.error("Password Salah!")
                    return;
                }
                if ($scope.item.diskonKomponen > hargasatuan) {
                    alert('Diskon tidak boleh lebih besar dari total jasa!!!')
                } else {
                    var objSave = {
                        norec_ppd: norec_ppd,
                        norec_pp: norec_pp,
                        hargadiskon: $scope.item.diskonKomponen,
                        hargakomponen: $scope.item.komponenDis,
                        hargajasa: $scope.item.JasaKomponen,
                    }
                    medifirstService.post('tatarekening/save-update-harga-diskon-komponen', objSave).then(function (data) {
                        LoadData()
                        $scope.saveLogging('Diskon Layanan', 'norec Pelayanan Pasien', norec_pp, 'menu Detail Tagihan')
                        loadKomponen();
                    });
                    // $scope.BatalDiskon();
                    // $scope.DiskonKM = false;
                    $scope.button = true;
                    $scope.billing = true;
                    $scope.cetak = true;
                    $scope.dtTanggal = false;
                    var dataz = {};
                    if ($scope.dataSelectedKomponen != undefined) {
                        if ($scope.dataSelected.namaPelayanan == $scope.item.namaPelayanans) {
                            if ($scope.label == $scope.dataSelectedKomponen.komponenharga) {
                                dataz.hargadiscount = $scope.item.diskonKomponen
                                $scope.dataSelectedKomponen.hargadiscount = $scope.item.diskonKomponen
                            }
                        }
                    }
                }
            }
            $scope.BatalDiskon = function () {
                // LoadData()
                $scope.popupKomponen.center().close();
            }
            // $scope.BatalDiskon = function(){
            // 	$scope.DiskonKM = false;
            // 	$scope.button = true;
            // 	$scope.billing = true;
            // 	$scope.cetak = true;
            // }

            $scope.$watch('item.namaPelayanan', function (newValue, oldValue) {
                var data2 = [];
                var data = {};
                for (var i = data3.length - 1; i >= 0; i--) {
                    if (data3[i].namaPelayanan.match(newValue)) {
                        data = data3[i];
                        data2.push(data)
                    }
                }
                $scope.dataRincianTagihan = new kendo.data.DataSource({
                    data: data2
                });
            })
            $scope.$watch('item.namaruangan.ruanganTindakan', function (newValue, oldValue) {
                var data2 = [];
                var data = {};
                for (var i = data3.length - 1; i >= 0; i--) {
                    if (data3[i].ruanganTindakan.match(newValue)) {
                        data = data3[i];
                        data2.push(data)
                    }
                }
                $scope.dataRincianTagihan = new kendo.data.DataSource({
                    data: data2,
                    group: [
                        //{field: "ruanganTindakan"}
                    ],
                });
            })

            $scope.CetakBuktiLayanan = function () {
                // $mdDialog.show(confirm).then(function() {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih pelayanan dahulu!");
                    return;
                }
                var NoStruk = $scope.dataRincianTagihan;
                var struk = "";
                var kwitansi = "";
                var stt = 'false'
                if (confirm('View Rincian Biaya? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                    var client = new HttpClient();
                    //client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
                    client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-ruangan=1&norec=' + $scope.item.noRegistrasi + '&strIdPegawai=' + e.data[0].id + '&strIdRuangan=' + $scope.dataSelected.ruid + '&view=' + stt, function (response) {
                        //http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-ruangan=1&norec=1707000166&strIdPegawai=1&strIdRuangan=&view=true
                        // do something with response
                    });
                })

                // client.get('http://127.0.0.1:1237/printvb/kasir?cetak-billing=1&noregistrasi=' + $scope.item.noRegistrasi + '&strIdPegawai='+ $scope.Pegawai.id + '&view=' + stt, function(response) {
                //     // do something with response
                // });
                // })


                // $scope.showBilling = true;
                // $scope.showBtnCetak = false;
            }
            $scope.CetakBuktiLayananPerTindakan = function () {
                var daftarCetak = [];
                if ($scope.selectedData.length > 0) {
                    $scope.selectedData.forEach(function (items) {
                        daftarCetak.push(items)
                    })
                    var resultCetak = daftarCetak.map(a => a.norec).join("|");
                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var client = new HttpClient();
                        if (daftarCetak[0].ruid == 44) {
                            client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayananBedah-norec_apd=1&norec=' + resultCetak + '&strIdPegawai=' + e.data[0].id + '&strIdRuangan=-&view=true', function (response) {
                                // do something with response
                            });
                        } else {
                            client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-norec_apd=1&norec=' + resultCetak + '&strIdPegawai=' + e.data[0].id + '&strIdRuangan=-&view=true', function (response) {
                                // do something with response
                            });
                        }
                    });
                } else {
                    messageContainer.error('Data belum dipilih')
                }


            }

            $scope.CetakBuktiLayananJasa = function () {
                var daftarCetak = [];
                if ($scope.selectedData.length > 0) {
                    $scope.selectedData.forEach(function (items) {
                        daftarCetak.push(items)
                    })
                    var resultCetak = daftarCetak.map(a => a.norec).join("|");
                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var client = new HttpClient();
                        client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-buktilayanan-jasa-norec_apd=1&norec=' + resultCetak + '&strIdPegawai=' + e.data[0].id + '&strIdRuangan=-&view=true', function (response) {
                            // do something with response
                        });
                    });
                } else {
                    messageContainer.error('Data belum dipilih')
                }
            }

            $scope.Cetak = function () {
                // $mdDialog.show(confirm).then(function() {
                // debugger
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noRegistrasi + '?jenisdata=bill').then(function (dat) {
                    for (var i = 0; i < dat.data.details.length; i++) {
                        if (dat.data.details[i].dokter == '' || dat.data.details[i].dokter == undefined || dat.data.details[i].dokter == "-") {
                            if (dat.data.details[i].norec != null) {
                                alert('data belum lengkap (Dokter Pemeriksa Belum Diisi lengkapi Data terlebihdahulu )!!' + 'pelayanan :' + dat.data.details[i].namaPelayanan + 'ruangan :' + dat.data.details[i].ruanganTindakan + 'tgl.peelayanan :' + dat.data.details[i].tglPelayanan)
                                return
                            }
                        }
                    }


                    $scope.isRouteLoading = false;
                    var NoStruk = $scope.dataRincianTagihan;
                    var struk = "";
                    var kwitansi = "";
                    var stt = 'false'
                    if (confirm('View Rincian Biaya? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    // if ($scope.item.jenisPasien != "BPJS") {
                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var client = new HttpClient();
                        debugger;
                        client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&cetakan=' + $scope.item.cetakx + '&view=' + stt, function (response) {
                            // do something with response
                        });
                    })
                    // }else{
                    // 	medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                    //              	var client = new HttpClient(); 
                    //               client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
                    //                   // do something with response
                    //               });
                    //           	})
                    // }
                });
            }
            $scope.Cetakv2 = function () {
                $scope.popupCetak2.center().open();
            }

            $scope.CetakRincianRanap = function () {
                // $mdDialog.show(confirm).then(function() {
                // debugger
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noRegistrasi + '?jenisdata=bill').then(function (dat) {
                    for (var i = 0; i < dat.data.details.length; i++) {
                        if (dat.data.details[i].dokter == '' || dat.data.details[i].dokter == undefined || dat.data.details[i].dokter == "-") {
                            if (dat.data.details[i].norec != null) {
                                alert('data belum lengkap (Dokter Pemeriksa Belum Diisi lengkapi Data terlebihdahulu )!!' + 'pelayanan :' + dat.data.details[i].namaPelayanan + 'ruangan :' + dat.data.details[i].ruanganTindakan + 'tgl.peelayanan :' + dat.data.details[i].tglPelayanan)
                                return
                            }
                        }
                    }
                    $scope.isRouteLoading = false;
                    var NoStruk = $scope.dataRincianTagihan;
                    var struk = "";
                    var kwitansi = "";
                    var stt = 'false'
                    if (confirm('View Rincian Biaya Rawat Inap? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    // if ($scope.item.jenisPasien != "BPJS") {
                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var client = new HttpClient();
                        client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapRincianBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&view=' + stt, function (response) {
                            // do something with response
                        });
                    })
                    // }else{
                    // 	medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                    //              	var client = new HttpClient(); 
                    //               client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
                    //                   // do something with response
                    //               });
                    //           	})
                    // }
                });
            }
            $scope.CetakRincianRanapv2 = function () {
                $scope.popupCetak.center().open();

            }
            $scope.cetakdetailrincian = function () {
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noRegistrasi + '?jenisdata=bill').then(function (dat) {
                    for (var i = 0; i < dat.data.details.length; i++) {
                        if (dat.data.details[i].dokter == '' || dat.data.details[i].dokter == undefined || dat.data.details[i].dokter == "-") {
                            if (dat.data.details[i].norec != null) {
                                alert('data belum lengkap (Dokter Pemeriksa Belum Diisi lengkapi Data terlebihdahulu )!!' + 'pelayanan :' + dat.data.details[i].namaPelayanan + 'ruangan :' + dat.data.details[i].ruanganTindakan + 'tgl.peelayanan :' + dat.data.details[i].tglPelayanan)
                                return
                            }
                        }
                    }
                    $scope.isRouteLoading = false;
                    var NoStruk = $scope.dataRincianTagihan;
                    var struk = "";
                    var kwitansi = "";
                    var stt = 'false'
                    if (confirm('View Rincian Biaya Rawat Inap? ')) {
                        // Save it!
                        stt = 'true';
                    } else {
                        // Do nothing!
                        stt = 'false'
                    }
                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var client = new HttpClient();
                        debugger;
                        client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapRincianBiayav2=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&cetakan=' + $scope.item.cetakz + '&view=' + stt, function (response) {
                            // do something with response
                        });
                    })
                });
            }

            $scope.RincianObat = function () {
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noRegistrasi + '?jenisdata=bill').then(function (dat) {
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
                        client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiayaObatAlkes=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&kdruangan=' + "" + '&view=' + stt, function (response) {
                            // do something with response
                        });
                    })
                });

            }
            $scope.RincianObatApt = function () {
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noRegistrasi + '?jenisdata=bill').then(function (dat) {
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
                        client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiayaObatAlkesApt=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&kdruangan=' + "" + '&view=' + stt + '&apt=1', function (response) {
                            // do something with response
                        });
                    })
                });

            }


            // c
            $scope.CetakBillingNaikKelas = function () {
                // $mdDialog.show(confirm).then(function() {
                debugger
                var NoStruk = $scope.dataRincianTagihan;
                var struk = "";
                var kwitansi = "";
                var stt = 'false'
                if (confirm('View Rincian Biaya? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya-kelas-dijamin=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&view=' + stt, function (response) {
                        // do something with response
                    });
                })
            }
            $scope.CetakBillingTotal = function () {
                // $mdDialog.show(confirm).then(function() {
                debugger
                var NoStruk = $scope.dataRincianTagihan;
                var struk = "TOTALTOTALTOTAL";
                var kwitansi = "";
                var stt = 'false'
                if (confirm('View Rincian Biaya? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                // if ($scope.item.jenisPasien != "BPJS") {
                medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                    var client = new HttpClient();
                    client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&view=' + stt, function (response) {
                        // do something with response
                    });
                })
                // }else{
                // medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                //             	var client = new HttpClient(); 
                //              client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapBiaya=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi +  '&strIdPegawai='+ e.data[0].namalengkap + '&view=' + stt, function(response) {
                //                  // do something with response
                //              });
                //          	})
                // }




            }
            $scope.cetakJasper = function () {
                debugger

                var billing = "Rp " + parseFloat($scope.item.billing).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                var deposit = "Rp " + parseFloat($scope.item.deposit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noRegistrasi + '?jenisdata=bill').then(function (dat) {

                    for (var i = 0; i < dat.data.details.length; i++) {
                        if (dat.data.details[i].dokter == '' || dat.data.details[i].dokter == undefined || dat.data.details[i].dokter == "-") {
                            if (dat.data.details[i].norec != null) {
                                alert('data belum lengkap (Dokter Pemeriksa Belum Diisi lengkapi Data terlebihdahulu )!!' + 'pelayanan :' + dat.data.details[i].namaPelayanan + 'ruangan :' + dat.data.details[i].ruanganTindakan + 'tgl.peelayanan :' + dat.data.details[i].tglPelayanan)
                                return
                            }
                        }
                    }

                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var kelas = $scope.item.kelasRawat;
                        var sisa = "Rp 0,00";
                        var bayar = "Rp " + parseFloat($scope.item.bayar).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        if (bayar == "Rp NaN") {
                            bayar = "Rp 0,00";
                        }
                        if ($scope.item.jenisPasien == "BPJS") {
                            kelas = $scope.item.kelasPenjamin
                            // bayar = "0"
                        }
                        if ($scope.item.deposit > 0) {
                            sisa = $scope.item.deposit - parseFloat($scope.item.bayar)
                            if (sisa > 0) {
                                sisa = "Rp " + parseFloat(sisa).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            } else {
                                sisa = "RP 0,00";
                            }
                        }
                        var nosep = "-";
                        if ($scope.item.nosep != "" && $scope.item.nosep != null) {
                            nosep = $scope.item.nosep
                        }
                        debugger;

                        var data = {
                            "gambarLogo": "logodokkes.jpg",
                            "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi", "nocm", "namapasien", "lastruangan", "namakamar", "kelas", "jmlbiaya", "deposit", "sisa", "isi", "terbilang", "bayar", "nosep"],
                            "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", e.data[0].namalengkap, $scope.item.noRegistrasi,
                                $scope.item.noCm, $scope.item.namaPasien, $scope.item.lastRuangan, $scope.item.namakamar, kelas, billing, deposit, sisa, $scope.item.isi, $scope.item.terbilang, bayar, nosep
                            ],
                            "paramType": ["", "date", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
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
                        if ($scope.item.jenisPasien == "BPJS" && trim($scope.item.namaPenjamin) != "'BPJS KETENAGAKERJAAN, PT'") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbilling.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbilling.pdf');
                            }
                        } else if ($scope.item.jenisPasien == "Umum/Pribadi") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbilling.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbilling.pdf');
                            }
                        } else if ($scope.item.jenisPasien == "KEMENKES RI") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbilling.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbilling.pdf');
                            }
                        } else if ($scope.item.namaPenjamin == "JASA RAHARJA, PT (BPJS KESEHATAN)") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbilling.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbilling.pdf');
                            }
                        } else if ($scope.item.namaPenjamin == "JASA RAHARJA, PT (UMUM)") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbilling.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbilling.pdf');
                            }
                        } else if (trim($scope.item.namaPenjamin) == "BPJS KETENAGAKERJAAN, PT") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbillingaSURANSI.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbillingaSURANSI.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbillingaSURANSI.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingaSURANSI.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingaSURANSI.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingaSURANSI.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingaSURANSI.pdf');
                            }
                        } else {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbillingaSURANSI.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbillingaSURANSI.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbillingaSURANSI.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingaSURANSI.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingaSURANSI.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingaSURANSI.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingaSURANSI.pdf');
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
                })
            }

            $scope.cetakJasperv2 = function () {
                debugger

                if ($scope.statusSelesaiPeriksa == null || $scope.statusSelesaiPeriksa == false) {
                    messageContainer.error("Tutup Faktur Terlebih Dahulu!");
                    return;
                }

                var user = medifirstService.getPegawaiLogin();

                var billing = "Rp " + parseFloat($scope.item.totalbilljs).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                var deposit = "Rp " + parseFloat($scope.item.deposit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/detail-tagihanv2/" + $scope.item.noRegistrasi + '?jenisdata=bill').then(function (dat) {

                    for (var i = 0; i < dat.data.details.length; i++) {
                        if (dat.data.details[i].dokter == '' || dat.data.details[i].dokter == undefined || dat.data.details[i].dokter == "-") {
                            if (dat.data.details[i].norec != null) {
                                alert('data belum lengkap (Dokter Pemeriksa Belum Diisi lengkapi Data terlebihdahulu )!!' + 'pelayanan :' + dat.data.details[i].namaPelayanan + 'ruangan :' + dat.data.details[i].ruanganTindakan + 'tgl.peelayanan :' + dat.data.details[i].tglPelayanan)
                                return
                            }
                        }
                    }

                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var kelas = $scope.item.kelasRawat;
                        var sisa = "Rp 0,00";
                        var bayar = "Rp " + parseFloat($scope.item.dibayarjs).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        if (bayar == "Rp NaN") {
                            bayar = "Rp 0,00";
                        }
                        if ($scope.item.jenisPasien != "Umum/Pribadi") {
                            kelas = $scope.item.kelasPenjamin
                            // bayar = "0"
                        }

                        if ($scope.item.deposit > 0) {
                            sisa = $scope.item.deposit - parseFloat($scope.item.dibayarjs)
                            if (sisa > 0) {
                                sisa = "Rp " + parseFloat(sisa).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            } else {
                                sisa = "RP 0,00";
                            }
                        }
                        var nosep = "-";
                        if ($scope.item.nosep != "" && $scope.item.nosep != null) {
                            nosep = $scope.item.nosep
                        }
                        debugger;

                        var data = {
                            "gambarLogo": "logodokkes.jpg",
                            "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi", "nocm", "namapasien", "lastruangan", "namakamar", "kelas", "jmlbiaya", "deposit", "sisa", "isi", "terbilang", "bayar", "nosep"],
                            "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", user.namaLengkap, $scope.item.noRegistrasi,
                                $scope.item.noCm, $scope.item.namaPasien, $scope.item.lastRuangan, $scope.item.namakamar, kelas, billing, deposit, sisa, $scope.item.isi, $scope.item.terbilang, bayar, nosep
                            ],
                            "paramType": ["", "date", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
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
                        if ($scope.item.jenisPasien == "BPJS") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingv2bmhp.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2bmhp.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2bmhp.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2bmhp.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2bmhp.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2bmhp.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2bmhp.pdf');
                            }
                        } else if ($scope.item.jenisPasien == "Umum/Pribadi") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                            }
                        } else if ($scope.item.jenisPasien == "KEMENKES RI") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingv2bmhp.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2bmhp.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2bmhp.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2bmhp.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2bmhp.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2bmhp.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2bmhp.pdf');
                            }
                        } else if ($scope.item.namaPenjamin == "JASA RAHARJA, PT (BPJS KESEHATAN)") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingv2bmhp.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2bmhp.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2bmhp.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2bmhp.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2bmhp.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2bmhp.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2bmhp.pdf');
                            }
                        } else if ($scope.item.namaPenjamin == "JASA RAHARJA, PT (UMUM)") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingv2.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                            }
                        } else {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:1001/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:1001/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:1001/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', 'http://202.51.105.98:1001/generic/report/rekapbillingaSURANSIv2.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingaSURANSIv2.pdf');
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
                })
            }
            $scope.CetakRincianRanapjasper = function () {
                debugger

                var billing = "Rp " + parseFloat($scope.item.billing).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                var deposit = "Rp " + parseFloat($scope.item.deposit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/detail-tagihanv2/" + $scope.item.noRegistrasi + '?jenisdata=bill').then(function (dat) {

                    for (var i = 0; i < dat.data.details.length; i++) {
                        if (dat.data.details[i].dokter == '' || dat.data.details[i].dokter == undefined || dat.data.details[i].dokter == "-") {
                            if (dat.data.details[i].norec != null) {
                                alert('data belum lengkap (Dokter Pemeriksa Belum Diisi lengkapi Data terlebihdahulu )!!' + 'pelayanan :' + dat.data.details[i].namaPelayanan + 'ruangan :' + dat.data.details[i].ruanganTindakan + 'tgl.peelayanan :' + dat.data.details[i].tglPelayanan)
                                return
                            }
                        }
                    }

                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var kelas = $scope.item.kelasRawat;
                        var sisa = "Rp 0,00";
                        var bayar = "Rp " + parseFloat($scope.item.bayar).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");


                        if (bayar == "Rp NaN") {
                            bayar = "Rp 0,00";
                        }
                        if ($scope.item.jenisPasien != "Umum/Pribadi") {
                            kelas = $scope.item.kelasPenjamin
                            // di tambahkan ini request dari hari dan kasir mbak dewi
                            bayar = "Rp " + parseFloat($scope.item.dibayarjs).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            // bayar = "0"
                        }

                        if ($scope.item.deposit > 0) {
                            sisa = $scope.item.deposit - parseFloat($scope.item.bayar)
                            if (sisa > 0) {
                                sisa = "Rp " + parseFloat(sisa).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            } else {
                                sisa = "RP 0,00";
                            }
                        }
                        var nosep = "-";
                        if ($scope.item.nosep != "" && $scope.item.nosep != null) {
                            nosep = $scope.item.nosep
                        }
                        debugger;

                        var data = {
                            "gambarLogo": "logodokkes.jpg",
                            "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi", "nocm", "namapasien", "lastruangan", "namakamar", "kelas", "jmlbiaya", "deposit", "sisa", "isi", "terbilang", "bayar", "nosep"],
                            "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", e.data[0].namalengkap, $scope.item.noRegistrasi,
                                $scope.item.noCm, $scope.item.namaPasien, $scope.item.lastRuangan, $scope.item.namakamar, kelas, billing, deposit, sisa, $scope.item.isi, $scope.item.terbilang, bayar, nosep
                            ],
                            "paramType": ["", "date", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
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
                        // if($scope.item.jenisPasien=="BPJS" ){
                        if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                            xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rincianrekap.pdf');
                        } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                            xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rincianrekap.pdf');
                        } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                            xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rincianrekap.pdf');
                        } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                            xhr.open('POST', '/jasper1/generic/report/rincianrekap.pdf');
                        } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                            xhr.open('POST', '/jasper1/generic/report/rincianrekap.pdf');
                        } else {
                            xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rincianrekap.pdf');
                        }
                        // }
                        // else if($scope.item.jenisPasien=="Umum/Pribadi" ){
                        // 	if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                        // 		xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbillingv2.pdf');
                        // 	}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                        // 		xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbillingv2.pdf');
                        // 	}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                        // 		xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbillingv2.pdf');
                        // 	}else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                        // 		xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                        // 	}else if(window.location.hostname.indexOf('10.8.8.8') > -1){
                        // 		xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                        // 	}else{
                        // 		xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                        // 	}
                        // }else if($scope.item.jenisPasien=="KEMENKES RI" ){
                        // 	if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                        // 		xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbillingv2.pdf');
                        // 	}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                        // 		xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbillingv2.pdf');
                        // 	}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                        // 		xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbillingv2.pdf');
                        // 	}else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                        // 		xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                        // 	}else if(window.location.hostname.indexOf('10.8.8.8') > -1){
                        // 		xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                        // 	}else{
                        // 		xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                        // 	}
                        // }
                        // else if($scope.item.namaPenjamin =="JASA RAHARJA, PT (BPJS KESEHATAN)" ){
                        // 	if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                        // 		xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbillingv2.pdf');
                        // 	}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                        // 		xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbillingv2.pdf');
                        // 	}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                        // 		xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbillingv2.pdf');
                        // 	}else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                        // 		xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                        // 	}else if(window.location.hostname.indexOf('10.8.8.8') > -1){
                        // 		xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                        // 	}else{
                        // 		xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                        // 	}
                        // }
                        // else if($scope.item.namaPenjamin =="JASA RAHARJA, PT (UMUM)" ){
                        // 	if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                        // 		xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbillingv2.pdf');
                        // 	}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                        // 		xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbillingv2.pdf');
                        // 	}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                        // 		xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbillingv2.pdf');
                        // 	}else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                        // 		xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                        // 	}else if(window.location.hostname.indexOf('10.8.8.8') > -1){
                        // 		xhr.open('POST', '/jasper1/generic/report/rekapbillingv2.pdf');
                        // 	}else{
                        // 		xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingv2.pdf');
                        // 	}
                        // }

                        // else
                        // {
                        // 	if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                        // 		xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbillingaSURANSIv2.pdf');
                        // 	}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                        // 		xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbillingaSURANSIv2.pdf');
                        // 	}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                        // 		xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbillingaSURANSIv2.pdf');
                        // 	}else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                        // 		xhr.open('POST', '/jasper1/generic/report/rekapbillingaSURANSIv2.pdf');
                        // 	}else if(window.location.hostname.indexOf('10.8.8.8') > -1){
                        // 		xhr.open('POST', '/jasper1/generic/report/rekapbillingaSURANSIv2.pdf');
                        // 	}else{
                        // 		xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingaSURANSIv2.pdf');
                        // 	}
                        // }
                        // set `Content-Type` header
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                        xhr.responseType = 'blob';
                        // send rquest with JSON payload
                        xhr.send(JSON.stringify(data));
                        $scope.isRouteLoading = false;
                    })
                })
            }

            $scope.CetakRincianBilling = function () {
                debugger
                // var billing = "Rp " + parseFloat($scope.item.billing).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                var deposit = "Rp " + parseFloat($scope.item.deposit).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                $scope.isRouteLoading = true;
                var y = ''
                if ($scope.item.cetakx == undefined) {
                    y = ''
                } else if ($scope.item.cetakx == "sudah") {
                    y = '&cetakx=sudah'
                } else if ($scope.item.cetakx == "belum") {
                    y = '&cetakx=belum'
                }
                medifirstService.get("tatarekening/detail-tagihanv2/" + $scope.item.noRegistrasi + '?jenisdata=bill' + y).then(function (dat) {
                    debugger
                    for (var i = 0; i < dat.data.details.length; i++) {
                        if (dat.data.details[i].dokter == '' || dat.data.details[i].dokter == undefined || dat.data.details[i].dokter == "-") {
                            if (dat.data.details[i].norec != null) {
                                alert('data belum lengkap (Dokter Pemeriksa Belum Diisi lengkapi Data terlebihdahulu )!!' + 'pelayanan :' + dat.data.details[i].namaPelayanan + 'ruangan :' + dat.data.details[i].ruanganTindakan + 'tgl.peelayanan :' + dat.data.details[i].tglPelayanan)
                                return
                            }
                        }
                    }
                    debugger;
                    var billing = "Rp " + parseFloat(dat.data.billing).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                    var terbilang = dat.data.terbilang
                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var kelas = $scope.item.kelasRawat;
                        var sisa = "Rp 0,00";
                        var bayar = "Rp " + parseFloat($scope.item.bayar).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        if (bayar == "Rp NaN") {
                            bayar = "Rp 0,00";
                        }
                        if ($scope.item.jenisPasien == "BPJS") {
                            kelas = $scope.item.kelasPenjamin
                            // bayar = "0"
                        }
                        if ($scope.item.deposit > 0) {
                            sisa = $scope.item.deposit - parseFloat($scope.item.bayar)
                            if (sisa > 0) {
                                sisa = "Rp " + parseFloat(sisa).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            } else {
                                sisa = "RP 0,00";
                            }
                        }
                        var nosep = "-";
                        if ($scope.item.nosep != "" && $scope.item.nosep != null) {
                            nosep = $scope.item.nosep
                        }
                        var x = "";
                        if ($scope.item.cetakx == "sudah") {
                            x = " nokwitansi is not null and noregistrasi= '" + $scope.item.noRegistrasi + "' and tglpelayanan is not null and namaproduk not in ('Biaya Administrasi','Biaya Materai') order by jenisproduk,ruangantindakan,tglpelayanan,namaproduk"
                        } else if ($scope.item.cetakx == "belum") {
                            x = " nokwitansi is null and noregistrasi= '" + $scope.item.noRegistrasi + "' and tglpelayanan is not null and namaproduk not in ('Biaya Administrasi','Biaya Materai') order by jenisproduk,ruangantindakan,tglpelayanan,namaproduk"
                        } else {
                            x = " noregistrasi='" + $scope.item.noRegistrasi + "' and tglpelayanan is not null and namaproduk not in ('Biaya Administrasi','Biaya Materai') order by jenisproduk,ruangantindakan,tglpelayanan,namaproduk"
                        }
                        debugger;

                        var data = {
                            "gambarLogo": "logodokkes.jpg",
                            "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi", "nocm", "namapasien", "lastruangan", "namakamar", "kelas", "jmlbiaya", "deposit", "sisa", "isi", "terbilang", "bayar", "nosep", "where"],
                            "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", dataLogin.userData.namauser.toString(), $scope.item.noRegistrasi,
                                $scope.item.noCm, $scope.item.namaPasien, $scope.item.lastRuangan, $scope.item.namakamar, kelas, billing, deposit, sisa, $scope.item.isi, terbilang, bayar, nosep, x
                            ],
                            "paramType": ["", "date", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
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
                        if ($scope.item.jenisPasien == "BPJS") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rincianbilling.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rincianbilling.pdf');
                            }
                        } else if ($scope.item.jenisPasien == "Umum/Pribadi") {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rincianbilling.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rincianbilling.pdf');
                            }
                        } else {
                            if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                                xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rincianbilling.pdf');
                            } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                xhr.open('POST', '/jasper1/generic/report/rincianbilling.pdf');
                            } else {
                                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rincianbilling.pdf');
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
                })
            }


            $scope.cetakJasperKwitansi = function () {
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                    var kelas = $scope.item.kelasRawat;
                    var sisa = $scope.item.sisa;
                    if ($scope.item.jenisPasien == "BPJS") {
                        kelas = $scope.item.kelasPenjamin
                        if ($scope.item.deposit > 0) {
                            sisa = $scope.item.deposit - parseFloat($scope.item.bayar)
                        }
                    }
                    var y = ''
                    if ($scope.item.cetakx == undefined) {
                        y = ''
                    } else if ($scope.item.cetakx == "sudah") {
                        y = '&cetakx=sudah'
                    } else if ($scope.item.cetakx == "belum") {
                        y = '&cetakx=belum'
                    }

                    debugger
                    medifirstService.get("tatarekening/detail-tagihanv2/" + $scope.item.noRegistrasi + '?jenisdata=bill' + y).then(function (dat) {
                        for (var i = 0; i < dat.data.details.length; i++) {
                            if (dat.data.details[i].dokter == '' || dat.data.details[i].dokter == undefined || dat.data.details[i].dokter == "-") {
                                if (dat.data.details[i].norec != null) {
                                    alert('data belum lengkap (Dokter Pemeriksa Belum Diisi lengkapi Data terlebihdahulu )!!' + 'pelayanan :' + dat.data.details[i].namaPelayanan + 'ruangan :' + dat.data.details[i].ruanganTindakan + 'tgl.peelayanan :' + dat.data.details[i].tglPelayanan)
                                    return
                                }
                            }
                        }
                        // var keterangan = $scope.item.namaPasien.$scope.item.noCm ;
                        var keterangan = "";
                        debugger;
                        var data = {
                            "gambarLogo": "logo_rs.jpg",
                            "paramKey": ["namaRS", "alamatRS", "printedBy", "noRegistrasi", "terimaDari", "nominal", "terbilang", "noKwitansi", "petugas", "tujuan"],
                            "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", $scope.item.namaPasien.toString(), $scope.item.noRegistrasi.toString(), "untuk masukan keterangan".toString(), $scope.item.billing.toString(), $scope.item.terbilang.toString(), "noKwitansi".toString(), dataLogin.userData.namauser.toString(), "tujuan".toString()],
                            "paramType": ["", "", "", "", "", "", "", "", "", ""]
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
                            xhr.open('POST', 'http://192.168.0.62:8797/generic/report/kw1.pdf');
                        } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                            xhr.open('POST', 'http://192.168.88.56:8797/generic/report/kw1.pdf');
                        } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                            xhr.open('POST', 'http://10.10.20.167:8797/generic/report/kw1.pdf');
                        } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                            xhr.open('POST', '/jasper1/generic/report/kw1.pdf');
                        } else {
                            xhr.open('POST', 'http://127.0.0.1:8797/generic/report/kw1.pdf');
                        }
                        // set `Content-Type` header
                        xhr.setRequestHeader('Content-Type', 'application/json');
                        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                        xhr.responseType = 'blob';
                        // send rquest with JSON payload
                        xhr.send(JSON.stringify(data));
                        $scope.isRouteLoading = false;
                    })
                })
            }
            $scope.CetakRekap = function () {

                if ($scope.statusSelesaiPeriksa == null || $scope.statusSelesaiPeriksa == false) {
                    messageContainer.error("Tutup Faktur Terlebih Dahulu!");
                    return;
                }

                // $mdDialog.show(confirm).then(function() {
                debugger
                var NoStruk = $scope.dataRincianTagihan;
                var struk = "";
                var kwitansi = "";
                var stt = 'false'
                if (confirm('View Rekap Biaya? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noRegistrasi + '?jenisdata=bill').then(function (dat) {
                    for (var i = 0; i < dat.data.details.length; i++) {
                        if (dat.data.details[i].dokter == '' || dat.data.details[i].dokter == undefined || dat.data.details[i].dokter == "-") {
                            if (dat.data.details[i].norec != null) {
                                alert('data belum lengkap (Dokter Pemeriksa Belum Diisi lengkapi Data terlebihdahulu )!!' + 'pelayanan :' + dat.data.details[i].namaPelayanan + 'ruangan :' + dat.data.details[i].ruanganTindakan + 'tgl.peelayanan :' + dat.data.details[i].tglPelayanan)
                                return
                            }
                        }
                    }

                    medifirstService.get("tatarekening/get-data-login-cetakan").then(function (e) {
                        var client = new HttpClient();
                        client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RekapBiayaPelayanan=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&view=' + stt, function (response) {
                            // do something with response
                        });
                    })
                })

            }

            $scope.CetakRekapRincianLama = function () {
                $scope.isRouteLoading = true;
                medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noRegistrasi + '?jenisdata=bill').then(function (dat) {
                    for (var i = 0; i < dat.data.details.length; i++) {
                        if (dat.data.details[i].dokter == '' || dat.data.details[i].dokter == undefined || dat.data.details[i].dokter == "-") {
                            if (dat.data.details[i].norec != null) {
                                alert('data belum lengkap (Dokter Pemeriksa Belum Diisi lengkapi Data terlebihdahulu )!!' + 'pelayanan :' + dat.data.details[i].namaPelayanan + 'ruangan :' + dat.data.details[i].ruanganTindakan + 'tgl.peelayanan :' + dat.data.details[i].tglPelayanan)
                                return
                            }
                        }
                    }
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
                        client.get('http://127.0.0.1:1237/printvb/kasir?cetak-RincianBiayaRanap=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&strNoStruk=' + struk + '&strNoKwitansi=' + kwitansi + '&strIdPegawai=' + e.data[0].namalengkap + '&view=' + stt, function (response) {
                            // do something with response
                        });
                    })
                });
            }

            $scope.$watch('item.qty', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.subTotal = parseFloat($scope.item.qty) * (parseFloat($scope.item.harga) - parseFloat($scope.item.diskon))
                }
            });
            $scope.$watch('item.diskon', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.subTotal = parseFloat($scope.item.qty) * (parseFloat($scope.item.harga) - parseFloat($scope.item.diskon))
                }
            });
            $scope.$watch('item.harga', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.item.subTotal = parseFloat($scope.item.qty) * (parseFloat($scope.item.harga) - parseFloat($scope.item.diskon))
                }
            });
            $scope.selectedData = [];
            $scope.onClick = function (e) {
                var element = $(e.currentTarget);

                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#grid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                // $scope.selectedData[dataItem.noRec] = checked;
                if (checked) {
                    var result = $.grep($scope.selectedData, function (e) {
                        return e.norec == dataItem.norec;
                    });
                    if (result.length == 0) {
                        $scope.selectedData.push(dataItem);
                    } else {
                        for (var i = 0; i < $scope.selectedData.length; i++)
                            if ($scope.selectedData[i].norec === dataItem.norec) {
                                $scope.selectedData.splice(i, 1);
                                break;
                            }
                        $scope.selectedData.push(dataItem);
                    }
                    row.addClass("k-state-selected");
                } else {
                    for (var i = 0; i < $scope.selectedData.length; i++)
                        if ($scope.selectedData[i].norec === dataItem.norec) {
                            $scope.selectedData.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
            }
            $scope.columnRincianTagihan = [
                /*{
                    "field": "no",
                    "title": "No",
                    "width":"50px",
                    "template": "<span> {{renderNumber()}} </span>"
                },*/
                {
                    "template": "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
                    "width": 40,
                    "title": "✔"
                },
                {
                    "field": "tglPelayanan",
                    "title": "Tanggal",
                    "width": "100px",
                    "template": "<span class='style-left'>{{formatTanggal('#: tglPelayanan #')}}</span>"
                    // "template": "#= new moment(new Date(tglPelayanan)).format('DD-MM-YYYY HH:mm') #",
                },
                {
                    "field": "namaPelayanan",
                    "title": "Nama Pelayanan",
                    "width": "200px",
                },
                {
                    "field": "kelasTindakan",
                    "title": "Kelas",
                    "width": "70px",
                },
                {
                    "field": "dokter",
                    "title": "Dokter/Pelaksana",
                    "width": "170px",
                },
                {
                    "field": "paramedis",
                    "title": "P",
                    "width": "30px",
                },
                {
                    "field": "ruanganTindakan",
                    "title": "Ruangan",
                    "width": "200px",
                },
                {
                    "field": "jumlah",
                    "title": "Qty",
                    "width": "50px",
                    "template": "<span class='style-right'>#: jumlah #</span>"
                },
                {
                    "field": "harga",
                    "title": "Harga",
                    "width": "120px",
                    "template": "<span class='style-right'>{{formatRupiah('#: harga #', '')}}</span>"
                },
                {
                    "field": "diskon",
                    "title": "Harga Diskon",
                    "width": "120px",
                    "template": "<span class='style-right'>{{formatRupiah('#: diskon #', '')}}</span>"
                },
                {
                    "field": "jasa",
                    "title": "Jasa",
                    "width": "100px",
                    "template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>"
                },
                {
                    "field": "total",
                    "title": "Total",
                    "width": "120px",
                    "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
                },
                {
                    "field": "statuscito",
                    "title": "Status Cito",
                    "width": "80px",
                    "attributes": { class: "text-center" },
                },
                {
                    "field": "strukfk",
                    "title": "NoStruk/NoSbm",
                    "width": "120px"
                },
                {
                    "field": "",
                    "title": "✓",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"verifikasigrid(dataItem)\"  style=\"margin:0 0 5px\">✓</button> ",
                    "width": "70px"
                },
                {
                    "field": "",
                    "title": "X",
                    "template": "<button class=\"k-button custom-button\" ng-click=\"verifikasigridbatal(dataItem)\"  style=\"margin:0 0 5px\">X</button> ",
                    "width": "70px"
                }
            ];
            // $scope.data2 = function(dataItem) {
            // 	return {
            // 		dataSource: new kendo.data.DataSource({
            // 			data: dataItem.komponen
            // 		}),
            //            		columns: [
            // 			{
            // 				"field": "komponenharga",
            // 				"title": "Komponen",
            // 				"width" : "150px",
            // 			},
            // 			{
            // 				"field": "jumlah",
            // 				"title": "Jumlah",
            // 				"width" : "50px"
            // 			},
            // 			{
            // 				"field": "hargasatuan",
            // 				"title": "Harga Satuan",
            // 				"width" : "50px",
            // 				"template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>"
            // 			},
            // 			{
            // 				"field": "hargadiscount",
            // 				"title": "Diskon",
            // 				"width" : "50px",
            // 				"template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>"
            // 			},
            // 			{
            // 				"width" : "50px"
            // 			}
            // 		]
            // 	}
            // };	

            $scope.inputDokterPelaksana = function () {
                debugger
                if ($scope.dataSelected == undefined) {
                    messageContainer.error("Pilih pelayanan dahulu!");
                    return;
                }
                var user = medifirstService.getPegawaiLogin();

                if (user.id == 890 || user.id == 320263) {
                    SeeDokterPelaksana();
                    $scope.item.tglPelayanans = $scope.dataSelected.tglPelayanan;
                    $scope.item.namaPelayanans = $scope.dataSelected.namaPelayanan;
                    if ($scope.dataSelected.isparamedis == true)
                        $scope.item.paramedis = true
                    else
                        $scope.item.paramedis = false
                    $scope.popup_editor.center().open();
                } else {
                    if ($scope.dataSelected.isobat == '1') {
                        messageContainer.error("Detail Dokter Hanya Untuk Tindakan!");
                        return;
                    } else {
                        SeeDokterPelaksana();
                        $scope.item.tglPelayanans = $scope.dataSelected.tglPelayanan;
                        $scope.item.namaPelayanans = $scope.dataSelected.namaPelayanan;
                        if ($scope.dataSelected.isparamedis == true)
                            $scope.item.paramedis = true
                        else
                            $scope.item.paramedis = false
                        $scope.popup_editor.center().open();
                    }
                }
            }
            $scope.verifikasigrid = function (dataPasienSelected) {
                debugger;
                var pelayananpasienpetugas = {
                    "norec_pp": dataPasienSelected.norec
                }
                var objverif = {
                    "pelayananpasienpetugas": pelayananpasienpetugas,

                };
                medifirstService.post('remunerasi/saveupdate-jasadokter', objverif).then(function (e) {
                    // loadData();          
                })


            }
            $scope.verifikasigridbatal = function (dataPasienSelected) {
                debugger;
                var objverif = {
                    "norec": dataPasienSelected.norec
                }
                //   var objverif = {
                //         "pelayananpasienpetugas": pelayananpasienpetugas,

                // };
                medifirstService.post('remunerasi/delete-jasadokterpernorec', objverif).then(function (e) {
                    // loadData();          
                })

            }
            $scope.click = function (dataDokterSelected) {
                if (dataDokterSelected != undefined) {
                    // var id = $scope.dataDokterSelected.jpp_id;
                    // medifirstService.get("pelayananpetugas/get-pegawaibyjenispetugaspe?objectjenispetugaspefk="+id).then(function(data){
                    //         $scope.dataSource = data.data.pegawai;

                    //     });
                    medifirstService.get("tatarekening/get-pegawai-saeutik?namapegawai=" + dataDokterSelected.namalengkap, true, true, 10)
                        .then(function (data) {

                            $scope.listPegawaiPemeriksa.add(data.data[0])
                            $scope.model.pegawais = data.data[0];

                        })
                    $scope.model.jenisPelaksana = { id: dataDokterSelected.jpp_id, jenisPetugasPelaksana: dataDokterSelected.jenispetugaspe }
                    // $scope.model.pegawais={
                    // 	id:dataDokterSelected.pg_id,
                    // 	namalengkap:dataDokterSelected.namalengkap,


                    // }
                }
            }

            function SeeDokterPelaksana() {
                medifirstService.get("tatarekening/get-combo-jenis-petugas").then(function (data) {
                    $scope.listJenisPelaksana = data.data.jenispetugaspelaksana;
                    // $scope.listPegawaiPemeriksa = data.data.pegawai;

                });
                medifirstService.getPart("tatarekening/get-pegawai-saeutik", true, true, 10).then(function (data) {
                    $scope.listPegawaiPemeriksa = data;

                });
                // $scope.isRouteLoading=true;
                medifirstService.get("tatarekening/get-petugasbypelayananpasien?norec_pp=" + $scope.dataSelected.norec).
                    then(function (data) {
                        $scope.sourceDokterPelaksana = data.data.data;
                        // $scope.isRouteLoading=false;

                    });
            }


            $scope.columnDokters = [{
                field: "jenispetugaspe",
                title: "Jenis Pelaksana",
                width: "100px",
                // template: "#= jenisPetugas.jenisPelaksana #"
            },
            {
                field: "namalengkap",
                title: "Nama Pegawai",
                width: "200px",
                // template: multiSelectArrayToString
            }
            ];
            $scope.simpanDokterPelaksana = function () {
                if ($scope.model.jenisPelaksana == undefined && $scope.item.paramedis == undefined) {
                    if ($scope.model.jenisPelaksana == undefined) {
                        messageContainer.error("Jenis Pelaksana Tidak Boleh Kosong")
                        return
                    }
                    if ($scope.model.pegawais == undefined) {
                        messageContainer.error("Pegawai Tidak Boleh Kosong")
                        return
                    }
                }


                var norec_ppp = "";
                if ($scope.dataDokterSelected != undefined) {
                    norec_ppp = $scope.dataDokterSelected.norec_ppp
                }

                if (norec_ppp == "") {
                    if ($scope.sourceDokterPelaksana != undefined && $scope.sourceDokterPelaksana.length > 0 && $scope.model.jenisPelaksana != undefined) {
                        for (let i = 0; i < $scope.sourceDokterPelaksana.length; i++) {
                            if ($scope.sourceDokterPelaksana[i].jenispetugaspe == $scope.model.jenisPelaksana.jenisPetugasPelaksana
                                // && $scope.sourceDokterPelaksana[i].pg_id ==$scope.model.pegawais.id
                            ) {
                                messageContainer.error("Jenis Pelaksana yg sama sudah ada !")
                                return
                            }
                        }
                    }
                }


                var pelayananpasienpetugas = {
                    norec_ppp: norec_ppp,
                    norec_pp: $scope.dataSelected.norec,
                    norec_apd: $scope.dataSelected.norec_apd,
                    objectjenispetugaspefk: $scope.model.jenisPelaksana != undefined ? $scope.model.jenisPelaksana.id : undefined,
                    objectpegawaifk: $scope.model.pegawais != undefined ? $scope.model.pegawais.id : undefined,
                    isparamedis: $scope.item.paramedis,
                }

                var objSave = {
                    pelayananpasienpetugas: pelayananpasienpetugas,

                }

                medifirstService.post('tatarekening/save-ppasienpetugas', objSave).then(function (e) {
                    var jenis = 'Input/Ubah Petugas Layanan';
                    var norec = e.data.data.norec
                    $scope.saveLogging(jenis, 'norec Pelayanan Pasien Petugas', norec, '')
                    SeeDokterPelaksana();
                    // LoadData();


                    var data = {};
                    if ($scope.dataSelected != undefined && $scope.model.jenisPelaksana != undefined && $scope.model.jenisPelaksana.id == 4) {
                        if ($scope.dataSelected.namaPelayanan == $scope.item.namaPelayanans) {
                            data.dokter = $scope.model.pegawais.namalengkap
                            $scope.dataSelected.dokter = data.dokter

                        }
                    }

                    if ($scope.sourceDokterPelaksana != undefined && $scope.sourceDokterPelaksana.length > 0) {
                        for (var i = $scope.sourceDokterPelaksana.length - 1; i >= 0; i--) {
                            if ($scope.sourceDokterPelaksana[i].jpp_id == '4' && $scope.item.paramedis != true && $scope.model.pegawais == undefined) {
                                $scope.dataSelected.dokter = $scope.sourceDokterPelaksana[i].namalengkap
                                break
                            }

                        }
                    }
                    if ($scope.item.paramedis == true) {
                        $scope.dataSelected.paramedis = "✔"

                    } else {
                        $scope.dataSelected.paramedis = ""

                    }
                    $scope.model.jenisPelaksana = undefined;
                    $scope.model.pegawais = undefined;
                    $scope.dataDokterSelected = undefined;
                    // debugger;
                    // medifirstService.post('remunerasi/saveupdate-jasadokter', objSave).then(function (e) {

                    // })
                })

            }


            $scope.hapusDokterPelaksana = function () {
                if ($scope.dataDokterSelected == undefined) {
                    messageContainer.error("Pilih data Pegawai dulu!!")
                    return
                }

                var pelayananpasienpetugas = {
                    norec_ppp: $scope.dataDokterSelected.norec_ppp,
                    norec_pp: $scope.dataSelected.norec,

                }

                var objSave = {
                    pelayananpasienpetugas: pelayananpasienpetugas,

                }
                medifirstService.post('tatarekening/hapus-ppasienpetugas', objSave).then(function (e) {
                    SeeDokterPelaksana();
                    // LoadData();
                    $scope.model.jenisPelaksana = "";
                    $scope.model.pegawais = "";
                    $scope.dataDokterSelected = undefined;
                    // medifirstService.post('remunerasi/saveupdate-jasadokter', objSave).then(function (e) {

                    // })
                })
                var data = {};
                if ($scope.dataSelected != undefined && $scope.model.jenisPelaksana.id == 4) {
                    if ($scope.dataSelected.namaPelayanan == $scope.item.namaPelayanans) {
                        $scope.dataSelected.dokter = "-"

                    }
                }
            }

            $scope.batalDokterPelaksana = function () {
                // LoadData();
                $scope.model.jenisPelaksana = "";
                $scope.model.pegawais = "";
                $scope.dataDokterSelected = undefined;
                $scope.popup_editor.center().close();


            }

            $scope.Save = function () {
                window.messageContainer.log("Sukses");
                $scope.showBtnSimpan = false;
            }

            $scope.Back = function () {
                if ($scope.showBilling) {
                    $scope.showBilling = false;
                    $scope.showBtnCetak = true;
                } else {
                    window.history.back();
                    //$state.go('DaftarPasienPulang', {});
                }

            }

            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY HH:mm');
            }
            $scope.formatTanggalAjah = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.klik = function (current) {
                // manageTataRekening.getDataTableTransaksi("akutansi/get-sudah-posting?tgl="+
                //                 current.tglPelayanan, true).then(function(dat){
                //                     statusPosting = dat.data.status
                //                 }
                //             )
                // $scope.item.tanggalPelayanan=current.tglPelayanan;
                // $scope.item.jenisPetugas={id:current.jppid,jenispetugaspe:current.jenispetugaspe};
                // $scope.item.petugas={id:current.pgid,paramedis:current.dokter};
                // $scope.item.ruangan={id:current.ruid,ruanganTindakan:current.ruanganTindakan};

                // medifirstService.get("tatarekening/get-produkbyruangan?objectruanganfk="+current.ruid).then(function(data){
                //                $scope.listPelayanan = data;
                //                $scope.item.pelayanan={id:current.prid,namaPelayanan:current.namaPelayanan};
                //                medifirstService.get("tatarekening/get-kelasbyproduk?objectprodukfk="+current.prid).then(function(data){
                //                 $scope.listKelas = data;
                //                 $scope.item.kelas={id:current.klid,kelasTindakan:current.kelasTindakan};
                //             });
                //            });

                // $scope.item.qty=current.jumlah;
                // $scope.item.harga=current.harga;
                // $scope.item.diskon=current.diskon;
                // $scope.item.subTotal=current.total;
            }

            $scope.batal = function () {
                $scope.item.tanggalPelayanan = $scope.now;
                $scope.item.jenisPetugas = '';
                $scope.item.petugas = '';
                $scope.item.ruangan = '';
                $scope.item.pelayanan = '';
                $scope.item.kelas = '';

                $scope.item.qty = 0;
                $scope.item.harga = 0;
                $scope.item.subTotal = 0;
            }

            $scope.UpdateHarga = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih pelayanan dahulu!");
                    return;
                }
                if ($scope.dataSelected.strukfk != null) {
                    alert("Pelayanan yang sudah di Verif tidak bisa di ubah!");
                    return;
                }
                if ($scope.item.qty == undefined) {
                    alert("Jumlah belum di isi!");
                    return;
                }
                if ($scope.item.harga == undefined) {
                    alert("Harga belum di isi!");
                    return;
                }
                if ($scope.item.subTotal == undefined) {
                    alert("SubTotal belum di isi!");
                    return;
                }
                var objSave = {
                    "norec": $scope.dataSelected.norec,
                    "jumlah": $scope.item.qty,
                    "harga": $scope.item.harga,
                    "total": $scope.item.subTotal
                };
                medifirstService.post('tatarekening/update-harga-pelayanan-pasien', objSave).then(function (e) {
                    //initModulAplikasi(); 
                    LoadData();
                })

            }
            $scope.diskon = function () {
                if ($scope.dataSelected == undefined) {
                    alert("Pilih pelayanan dahulu!");
                } else {
                    var confirm = $mdDialog.confirm()
                        .title('Informasi')
                        .textContent('Apakah anda yakin memberikan diskon semua jasa kecuali jasa sarana ?')
                        .ok('Ya')
                        .cancel('Tidak')
                    $mdDialog.show(confirm).then(function () {
                        var dat = $scope.dataSelected.komponen;
                        var i = 0;
                        var objSave = [];
                        dat.forEach(function (value) {
                            var data = {
                                norec_ppd: value.norec,
                                norec_pp: value.norec_pp,
                                hargadiskon: value.hargasatuan
                            }
                            objSave[i] = data;
                            i++;
                        })
                        medifirstService.post('tatarekening/save-update-harga-diskon-komponen', objSave).then(function (data) {
                            LoadData()
                        })
                    });
                }

            }
            $scope.verif_tarek = function () {
                if (KelompokUser[0].id != 52) {
                    alert('Menu ini khusus untuk akses user TataRekening/Admin!')
                    return
                }
                var obj = {
                    noRegistrasi: $scope.item.noRegistrasi
                }
                $state.go("VerifikasiTagihan", {
                    dataPasien: JSON.stringify(obj)
                });
            }
            $scope.kwitansiTotal = function () {

                var stt = 'false'
                if (confirm('View Kwitansi? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var sudahTerimaDari = ''
                if ($scope.item.STD != undefined) {
                    sudahTerimaDari = $scope.item.STD
                }
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-kwitansiv2=1&noregistrasi=KWITANSITOTAL' + $scope.item.noRegistrasi + '&idPegawai=' + dataLogin.userData.namauser + '&STD=' + $scope.item.billing + '&view=' + stt, function (response) {
                    // do something with response
                });

            }
            $scope.HapusTindakan = function () {
                debugger;
                if ($scope.selectedData.length == 0 || $scope.selectedData.length == undefined) {
                    toastr.warning('Checklist Data Yang Akan Dihapus, Peringatan!');
                    return;
                }

                for (var i = 0; i < $scope.selectedData.length; i++) {
                    if ($scope.selectedData[i].strukfk != ' / ') {
                        toastr.warning('Pelayanan yang sudah dibayarkan tidak dapat dihapus');
                        return;
                    }
                }

                if ($scope.IsDataResep == true) {
                    window.messageContainer.error("Data Resep Tidak Bisa Dihapus, Harap Hubungi Farmasi!");
                    return;
                }
                var idPegawai = medifirstService.getPegawaiLogin().id
                medifirstService.get('registrasi/get-ruangan-login-user?idPegawai=' + idPegawai).then(function (dat) {
                    debugger
                    var tampungan = 'Anda hanya dapat menghapus tindakan di ruangan : '
                    var ruangan = ''
                    if (dat.data.length > 0) {
                        for (var i = 0; i < dat.data.length; i++) {
                            if (dat.data[i].objectruanganfk == 1 || dat.data[i].objectruanganfk == 673 || dat.data[i].objectruanganfk == 677 || dat.data[i].objectruanganfk == 693 || dat.data[i].objectruanganfk == 679 || dat.data[i].objectruanganfk == 684 || dat.data[i].objectruanganfk == 698) {
                                $scope.popUpHapus.center().open();
                                return
                            }
                        }
                        for (var m = 0; m < dat.data.length; m++) {
                            ruangan = ruangan + ' ' + dat.data[m].namaruangan
                            for (var n = 0; n < $scope.selectedData.length; n++) {
                                if (dat.data[m].objectruanganfk == $scope.selectedData[n].ruid) {
                                    $scope.popUpHapus.center().open();
                                    return
                                }
                            }
                        }
                        alert(tampungan + ruangan);
                        return
                    } else {
                        alert('Akun ini belum dimapping ke ruangan. Tidak dapat hapus tindakan !')
                    }
                })

                // $scope.popUpHapus.center().open();
            }


            $scope.HapusTindakan2 = function () {
                // if ($scope.item.strukfk != undefined || $scope.dataSelected.strukfk != ' / ') {
                // 	window.messageContainer.error("Pelayanan yang sudah di Verif tidak bisa di ubah!");
                //                 return;
                // }
                if ($scope.statusSelesaiPeriksa != false) {
                    messageContainer.error("Sudah Tutup Faktur Tidak Bisa Dihapus!");
                    return;
                }

                if ($scope.IsDataResep == true) {
                    window.messageContainer.error("Data Resep Tidak Bisa Dihapus, Harap Hubungi Farmasi!");
                    return;
                }
                // if ($scope.item.statusVerif == true) {
                // 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!!");
                //     return;
                // }
                // if (statusPosting == true) {
                //     window.messageContainer.error('Data Sudah di Posting, Hubungi Bagian Akuntansi.')
                //     return;
                // }

                // if ($scope.dataSelected == undefined) {
                // 	alert("Pilih pelayanan dahulu!");
                //                 return;
                // }
                // if ($scope.dataSelected.strukfk.indexOf("/") <= 0 ) {
                // 	alert("Pelayanan yang sudah di Verif tidak bisa di ubah!");
                //                 return;
                // }
                // if (KelompokUser[0].id != 52 && KelompokUser[0].id != 5) {
                // 	alert('Hanya TataRekening/Admin/Dokter Penginput yg boleh menghapus!')
                // 	return
                // }
                // if($scope.item.qty == undefined){
                //                 alert("Jumlah belum di isi!");
                //                 return;
                //             }
                // if($scope.item.harga == undefined){
                //                 alert("Harga belum di isi!");
                //                 return;
                //             }
                // if($scope.item.subTotal == undefined){
                //                 alert("SubTotal belum di isi!");
                //                 return;
                //             }
                //         	var objSave = [{
                // 	"noRec": $scope.dataSelected.norec,
                //                 "noRecStruk": $scope.dataSelected.norec_sp === null ? "" : $scope.dataSelected.norec_sp
                // }];
                // managePasien.hapusTindakan(objSave).then(function(e){
                //                 LoadData();
                //             })


                // 			var tempData = [];
                // var logData=[];
                // var dataDel = []
                var tglajah = ''

                if ($scope.selectedData.length == 0 || $scope.selectedData.length == undefined) {
                    debugger;
                    toastr.warning('Checklist Data Yang Akan Dihapus, Peringatan!');
                    return;
                }

                if ($scope.selectedData.length > 0) {
                    debugger;
                    //  $scope.selectedData.forEach(function(items){
                    //      daftarCetak.push(items)
                    //  })
                    // }

                    $scope.selectedData.forEach(function (items) {
                        debugger;
                        if (items.strukfk != " / ") {
                            alert("Pelayanan yang sudah di Verif tidak bisa di ubah!");
                            return;
                        }

                        medifirstService.get("tatarekening/tindakan/get-pegawaipenginput?norec_pp=" + items.norec).
                            then(function (data) {
                                // $scope.item.PegawaiLoginfk =13;		                 
                                var datas = data.data.data[0];
                                var dataLogin = data.data.datalogin.objectpegawaifk;
                                $scope.item.PegawaiLoginfk = dataLogin;
                                // $scope.item.PegawaiPenindak = datas.objectpegawaifk;

                                if (moment(tgltgltgltgl).format('YYYY-MM-DD 00:00:00') < items.tglPelayanan) {
                                    for (var i = tglkpnaja.length - 1; i >= 0; i--) {
                                        if (tglkpnaja[i] == parseFloat(moment(items.tglPelayanan).format('D'))) {
                                            alert("Pelayanan yang sudah di Posting tidak bisa di Hapus!");
                                            return;
                                        }
                                    }
                                } else {
                                    tglajah = moment(items.tglPelayanan).format('YYYY-MM-DD 00:00:00')
                                    medifirstService.get("akutansi/get-sudah-posting-blm?tgl=" + tglajah, true).then(function (dat) {
                                        if (dat.data.sudahblm == true) {
                                            alert("Pelayanan yang sudah di Posting tidak bisa di Hapus!");
                                            return;
                                        }
                                    })
                                }

                                // if ($scope.item.PegawaiLoginfk != $scope.item.PegawaiPenindak){
                                // 		toastr.warning('Maaf Anda Tidak Memiliki Kewenangan Untuk Menghapus, Hubungi ' 
                                //         + datas.namalengkap + ' Sebagai User Penginput Bila Ingin Tetap Menghapus, Peringatan!');
                                //         return;				                	
                                // }else {

                                var item = {
                                    "noRec": items.norec,
                                    "noRecStruk": null
                                }
                                logData.push(items);
                                tempData.push(item);

                                // del pel pasien 
                                var objDel = {
                                    "norec_pp": items.norec,
                                }
                                dataDel.push(objDel)
                                // end
                                debugger;
                                HapuskanTindkan();

                                // }		
                            })


                    })

                }
                LoadData();
                LoadDataClosingFaktur();
                statusHapus = "HAPUS";
                loadpertama();
                // if (dataDel.length == 0) {
                // 	alert('Checklist yang akan di hapus!')
                // 	return;
                // }

            }

            $scope.tagihanClosing = function () {
                debugger
                var y = ''
                if ($scope.item.cetakx == undefined) {
                    y = ''
                } else if ($scope.item.cetakx == "sudah") {
                    y = '&cetakx=sudah'
                } else if ($scope.item.cetakx == "belum") {
                    y = '&cetakx=belum'
                }
                medifirstService.get("tatarekening/detail-tagihanv2/" + $scope.item.noRegistrasi + '?jenisdata=bill' + y).then(function (dat) {
                    for (var i = 0; i < dat.data.details.length; i++) {
                        if (dat.data.details[i].dokter == '' || dat.data.details[i].dokter == undefined || dat.data.details[i].dokter == "-") {
                            if (dat.data.details[i].norec != null) {
                                alert('data belum lengkap (Dokter Pemeriksa Belum Diisi lengkapi Data terlebihdahulu )!!' + 'pelayanan :' + dat.data.details[i].namaPelayanan + 'ruangan :' + dat.data.details[i].ruanganTindakan + 'tgl.peelayanan :' + dat.data.details[i].tglPelayanan)
                                return
                            }
                        }
                    }
                    if ($scope.item.deptidlast === '16') {
                        $scope.popUpclosing.center().open();
                    } else {
                        var stt = 'false'
                        if (confirm('Pasien yang sudah ditutup Faktur tidak bisa mendapat tindakan lagi. \nApakah Anda Yakin Ingin Menutup Faktur? ')) {
                            // Save it!
                            stt = 'true';
                        } else {
                            // Do nothing!
                            stt = 'false'
                        }

                        if (stt == 'true') {
                            $scope.closingTagihan();
                        }
                    }
                })
            }

            $scope.closingTagihan = function () {
                debugger
                if ($scope.item.deptidlast === '16') {
                    if ($scope.item.password != "ditutup") {
                        toastr.error("Password Salah!")
                        return;
                    }
                }

                // var stt = 'false'
                // if (confirm('Tutup Faktur? ')) {
                // 	// Save it!
                // 	stt = 'true';
                // } else {
                // 	// Do nothing!
                // 	stt = 'false'
                // }	

                // if (stt == 'true') {
                var json = {
                    'noregistrasi': $scope.dataParams.noRegistrasi,
                    'close': true
                }
                debugger;
                medifirstService.post('tatarekening/save-selesai-transaksi-faktur', json).then(function (e) {
                    if (e.status === 201) {
                        debugger;
                        medifirstService.post('tatarekening/save-log-closing-faktur', json).then(function (e) {
                            LoadDataClosingFaktur();
                        })
                    }
                })
                // $scope.popUpclosing.close()
                // }
            }

            $scope.pisahTindakan = function () {
                if ($scope.selectedData.length == 0) {
                    toastr.error("Tindakan belum di pilih!")
                    return;
                }
                $scope.popUppisahTindakan.center().open()
            }
            $scope.cariNoRegistrasi = function () {
                $scope.isRouteLoading = true
                var norReg = "noReg=" + $scope.item.noregistrasiTujuan;
                medifirstService.get("registrasi/get-antrian-pasien-diperiksa-by-noreg?" +
                    norReg
                ).then(function (dat) {
                    $scope.isRouteLoading = false
                    $scope.listRuangAPDBedaNoRegistrasi = dat.data.data
                    $scope.item.ruangTujuanPindahBedaNoRegistrasi = { id: $scope.listRuangAPDBedaNoRegistrasi[0].objectruanganfk, namaruangan: $scope.listRuangAPDBedaNoRegistrasi[0].namaruangan }
                    $scope.popPindahTindakanBedaNomorRegistrasi.center().open();
                });
            }
            $scope.PindahTindakanBedaNomorRegistrasi2 = function () {
                $scope.isRouteLoading = true
                debugger
                var nama = medifirstService.getPegawaiLogin().namaLengkap
                var objDelete = {
                    "detail_tindakan": $scope.selectedData,
                    "norec_apd_tujuan": $scope.item.ruangTujuanPindahBedaNoRegistrasi.details[0].norec_apd,
                    "alasan": $scope.item.alasanPindah,
                    "pegawai": nama
                };
                medifirstService.post('tatarekening/pindah-history-apd-detail', objDelete).then(function (e) {
                    //  managePasien.hapusTindakan(tempData).then(function(e){
                    if (e.status === 201) {

                        LoadData();
                        $scope.popUppisahTindakan.close();
                    }
                    $scope.isRouteLoading = false
                    // LoadData();
                })
            }
            $scope.batalClosing = function () {
                $scope.popUpUnclosing.center().open()
            }
            $scope.saveUnclosing = function () {
                debugger;
                if ($scope.item.password != "dibuka") {
                    toastr.error("Password Salah!")
                    return;
                }
                if ($scope.item.batalClosing == undefined || $scope.item.batalClosing == " ") {
                    toastr.error("Alasan Batal Closing Harus Diisi !")
                    return;
                }
                debugger;
                var json = {
                    'alasanbatalclosing': $scope.item.batalClosing,
                    'noregistrasi': $scope.dataParams.noRegistrasi,
                    'close': false
                }
                medifirstService.post('tatarekening/save-selesai-transaksi-faktur', json).then(function (e) {
                    if (e.status === 201) {
                        debugger;
                        medifirstService.post('tatarekening/save-log-unclosing-faktur', json).then(function (e) {
                            debugger;
                            LoadDataClosingFaktur();

                        })
                    }
                })
                $scope.popUpUnclosing.close()
            }

            function HapuskanTindkan() {
                debugger;
                $scope.isRouteLoading = true
                var objLog = {
                    pelayananpasiendelete: logData

                }
                var nama = medifirstService.getPegawaiLogin().namaLengkap
                var objDelete = {
                    "dataDel": dataDel,
                    "noregistrasi": $scope.item.noRegistrasi,
                    "alasan": $scope.item.alasan,
                    "pegawai": nama
                };
                if (dataDel.length != 0) {
                    debugger;
                    medifirstService.post('tatarekening/delete-pelayanan-pasien', objDelete).then(function (e) {
                        //  managePasien.hapusTindakan(tempData).then(function(e){
                        if (e.status === 201) {
                            medifirstService.post('sysadmin/logging/save-log-hapus-tindakan', objLog).then(function (e) {

                            })
                            $scope.popUpHapus.close();
                        }
                        $scope.isRouteLoading = false
                        LoadData();

                    })
                    LoadData();
                }
                LoadData();
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
            $scope.TESTCETAK = function () {

                var client = new HttpClient();
                client.get('http://localhost:8080/cetak-antrian?cetak=1&norec=ff8081815d9810c2015d984db6790010', function (response) {
                    // do something with response
                });
            }

            $scope.simpanDokter = function () {
                debugger;
                // var listRawRequired = [
                //     "items.pilihDokter|k-ng-model|Dokter"
                // ];
                // var isValid = ModelItem.setValidation($scope, listRawRequired);

                // if(isValid.status){
                // munculkan nama dokter di grid
                // items.pilihDokter = data.data.dokter.namalengkap;

                // save dokter yang dipilih
                var tmpData = {
                    norec_apd: $scope.item.norec_apd,
                    // iddokter: dataPasienSelected.pilihDokter.id
                    iddokter: $scope.item.pilihDokter.id
                }
                if ($scope.item.deptid === '16' || $scope.item.deptid === '17' || $scope.item.deptid === '35') {
                    medifirstService.post('rawatinap/save-update-dokter-antrian', tmpData).then(function (e) {
                        // update status antrian
                        $scope.winDialogss.close();
                        // loadGrid($scope.dataParams.noRegistrasi, $scope.item.ruang2.id);
                        LoadData();
                        // $scope.findData(); 
                        $scope.item.pilihDokter = '';

                    });
                    // } else {
                    //     ModelItem.showMessages(isValid.messages);
                    // }
                } else {
                    medifirstService.post('rawatjalan/save-update-dokter-antrian', tmpData).then(function (e) {
                        // update status antrian
                        $scope.winDialogss.close();
                        // loadGrid($scope.dataParams.noRegistrasi, $scope.item.ruang2.id);
                        loadData();
                        // $scope.findData(); 
                        $scope.item.pilihDokter = '';

                    });
                }
            }

            $scope.inputTindakanBeta = function (item, data) {
                // loaddata();
                debugger;
                $scope.hideBtnSimpan = true;
                if ($scope.item.deptid === '16' || $scope.item.deptid === '17' || $scope.item.deptid === '35') {
                    if ($scope.item.pgpjid === undefined || $scope.item.pgpjid === '' || $scope.item.pgpjid === '1' || $scope.item.pgpjid === null) {
                        // $scope.UbahDokter = function (item, data) {
                        if (data === undefined)
                            data = $scope.item;

                        $scope.item = data;
                        medifirstService.get("rawatinap/get-dokters-combos", false).then(function (data) {
                            $scope.listDokter = data.data.dokter;
                        })
                        // show popup untuk pilih dokter
                        $scope.winDialogss.center().open();
                        // }
                        // toastr.error('Dokter Belum Di Pilih', 'Peringatan');
                        $scope.hideBtnSimpan = false;
                        return;
                    }
                } else {
                    if ($scope.item.pgpjid === undefined || $scope.item.pgpjid === '' || $scope.item.pgpjid === '1' || $scope.item.pgpjid === null) {
                        // $scope.UbahDokter = function (item, data) {
                        if (data === undefined)
                            data = $scope.item;

                        $scope.item = data;
                        medifirstService.get("rawatjalan/get-dokters-combos", false).then(function (data) {
                            $scope.listDokter = data.data.dokter;
                        })
                        // show popup untuk pilih dokter
                        $scope.winDialogss.center().open();
                        // }
                        // toastr.error('Dokter Belum Di Pilih', 'Peringatan');
                        $scope.hideBtnSimpan = false;
                        return;
                    }
                }
                // debugger;

                // if ($scope.item.objectkelasdijaminfk === null && $scope.item.objectkelompokpasienlastfk != 1) {
                //     alert('Kelas Tanggungan Belum di isi, Hubungi Admisi Untuk Mengisinya')
                //     return;
                // }

                // * Validasi Untuk Sekali Bayar
                // if ($scope.item.statusVerif == true) {
                // 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!!");
                //return;
                // }
                // * Validasi Untuk Sekali Bayar


                // if ($scope.item.strukfk != undefined || $scope.dataSelected.strukfk != ' / ') {
                // 	window.messageContainer.error("Pelayanan yang sudah di Verif tidak bisa di ubah!");
                //return;
                // }

                if ($scope.dataSelected == undefined) {
                    window.messageContainer.error("Pilih pelayanan dahulu!");
                    return;
                }

                // if ($scope.dataSelected.strukfk != ' / ') {
                // 	window.messageContainer.error("Pelayanan yang sudah di Verif tidak bisa di ubah!");
                //return;
                // }

                if ($scope.item) {
                    $state.go('InputTindakanDiagnosa', {
                        norecPD: $scope.item.norec_pd,
                        norecAPD: $scope.dataSelected.norec_apd,

                    });
                } else {
                    messageContainer.error('Pasien belum di pilih')
                }
            }
            // $scope.simpanDokter = function () {
            // 	debugger;
            //     // 
            //     // var listRawRequired = [
            //     //     "items.pilihDokter|k-ng-model|Dokter"
            //     // ];
            //     // var isValid = ModelItem.setValidation($scope, listRawRequired);

            //     // if(isValid.status){
            //     // munculkan nama dokter di grid
            //     // items.pilihDokter = data.data.dokter.namalengkap;

            //     // save dokter yang dipilih
            //     var tmpData = {
            //         norec_apd: $scope.item.norec_apd,
            //         // iddokter: dataPasienSelected.pilihDokter.id
            //         iddokter: $scope.item.pilihDokter.id
            //     }
            //     medifirstService.post('rawatinap/save-update-dokter-antrian', tmpData).then(function (e) {
            //         // update status antrian
            //         $scope.winDialogss.close();
            //         loadData();
            //         // $scope.findData(); 
            //         $scope.item.pilihDokter = '';

            //     });
            //     // } else {
            //     //     ModelItem.showMessages(isValid.messages);
            //     // }
            // }



            $scope.UbahDokterResep = function () {

                if ($scope.dataSelected == undefined) {
                    window.messageContainer.error("Pilih pelayanan dahulu!");
                    return;
                }


                if ($scope.item) {
                    var chacePeriode = {
                        0: new moment($scope.item.tglMasuk).format('YYYY-MM-DD 00:00'),
                        1: new moment($scope.now).format('YYYY-MM-DD 23:59'),
                        2: $scope.item.noRegistrasi,
                        3: '',
                        4: '',
                        5: '',
                        6: ''
                    }
                    cacheHelper.set('DaftarResepCtrl2', chacePeriode);
                    $state.go('DaftarResep');
                    // $state.go('InputTindakanDiagnosa', {
                    // 	norecPD: $scope.item.norec_pd,
                    // 	norecAPD: $scope.dataSelected.norec_apd,

                    // });
                } else {
                    messageContainer.error('Pasien belum di pilih')
                }
            }

            $scope.diagnosa = function () {
                debugger;
                if ($scope.dataSelected == undefined) {
                    window.messageContainer.error("Pilih pelayanan dahulu!");
                    return;
                }
                // $scope.Detail = function () {
                if ($scope.item.noRegistrasi != undefined) {

                    var obj = {
                        noRegistrasi: $scope.item.noRegistrasi
                    }
                    var arrStr = {
                        0: $scope.item.noCm,
                        1: $scope.item.namaPasien,
                        2: $scope.item.jenisKelamin,
                        3: $scope.item.noRegistrasi,
                        4: $scope.item.umur,
                        5: $scope.item.jenisPasien,
                        6: $scope.item.tglMasuk,
                        7: $scope.dataSelected.norec_apd,
                        8: $scope.item.norec_pd,
                        9: $scope.item.kelasId,
                        10: $scope.item.kelasRawat,
                        11: $scope.dataSelected.ruid,
                        12: $scope.item.lastRuangan
                    }
                    cacheHelper.set('InputDiagnosaDokterAllCtrl', arrStr);
                    $state.go('InputDiagnosaDokterAll', {
                        dataPasien: JSON.stringify(obj)
                    });
                } else {
                    toastr.error('Data belum dipilih', 'Info');
                }
            }

            $scope.DaftarRuangan = function () {
                debugger;
                if ($scope.dataSelected === undefined) {
                    messageContainer.error("Pilih data terlebih dahulu");
                    return
                } else {
                    if ($scope.item.deptid == 18) {
                        if ($scope.dataSelected.ruid != 322) {
                            if ($scope.item.namekendali == 'Belum Di Kirim') {
                                alert('Dokumen Belum Dikirim')
                                return;
                            }
                            if ($scope.item.namekendali == 'DIKIRIM') {
                                alert('Terima Dokumen Terlebih Dahulu')
                                return;
                            }
                            medifirstService.getServiceArray("tatarekening/get-combo-detail-regis").then(function (data) {
                                debugger;
                                $scope.listRuanganDokter = data.ruangan;
                                $scope.listRuanganKonsul = data.dataRuanganKonsul;

                                // medifirstService.get("registrasi/get-kelasbyruangan?idRuangan=" + ruanganId)
                                // .then(function (dat) {
                                //     $scope.listKelas = dat.data.kelas;

                                // });
                                // $scope.listKelas = data.kelas
                                $scope.listDokter = data.dokter;
                                // $scope.item.kelasKonsul = {id:$scope.item.kelasId,namakelas:$scope.item.kelasRawat}
                                $scope.popUpSx.center().open()

                                // dat.data.kelas = '';
                                $scope.cboDokter = false;
                                $scope.cboUbahDokter = false;
                                $scope.cboKonsul = true;
                                $scope.showUbahTanggal = false;
                            });
                        } else {
                            medifirstService.getServiceArray("tatarekening/get-combo-detail-regis").then(function (data) {
                                debugger;
                                $scope.listRuanganDokter = data.ruangan;
                                $scope.listRuanganKonsul = data.dataRuanganKonsul;

                                // medifirstService.get("registrasi/get-kelasbyruangan?idRuangan=" + ruanganId)
                                // .then(function (dat) {
                                //     $scope.listKelas = dat.data.kelas;

                                // });
                                // $scope.listKelas = data.kelas
                                $scope.listDokter = data.dokter;
                                // $scope.item.kelasKonsul = {id:$scope.item.kelasId,namakelas:$scope.item.kelasRawat}
                                $scope.popUpSx.center().open()

                                // dat.data.kelas = '';
                                $scope.cboDokter = false;
                                $scope.cboUbahDokter = false;
                                $scope.cboKonsul = true;
                                $scope.showUbahTanggal = false;
                            });
                        }
                    } else {
                        medifirstService.getServiceArray("tatarekening/get-combo-detail-regis").then(function (data) {
                            debugger;
                            $scope.listRuanganDokter = data.ruangan;
                            $scope.listRuanganKonsul = data.dataRuanganKonsul;

                            // medifirstService.get("registrasi/get-kelasbyruangan?idRuangan=" + ruanganId)
                            // .then(function (dat) {
                            //     $scope.listKelas = dat.data.kelas;

                            // });
                            // $scope.listKelas = data.kelas
                            $scope.listDokter = data.dokter;
                            // $scope.item.kelasKonsul = {id:$scope.item.kelasId,namakelas:$scope.item.kelasRawat}
                            $scope.popUpSx.center().open()

                            // dat.data.kelas = '';
                            $scope.cboDokter = false;
                            $scope.cboUbahDokter = false;
                            $scope.cboKonsul = true;
                            $scope.showUbahTanggal = false;
                        });
                    }
                }
            }

            $scope.pilihRuangan = function (id) {
                debugger;
                $scope.item.kelas = ""
                $scope.item.kelasKonsul = "";

                var ruanganId = $scope.item.ruanganKonsul.id;
                // debugger;
                medifirstService.get("registrasi/get-kelasbyruangan?idRuangan=" + ruanganId)
                    .then(function (dat) {
                        debugger;
                        $scope.listKelas = dat.data.kelas;

                    });
            }
            $scope.batalKonsul = function () {
                $scope.popUpSx.close();
            }

            $scope.simpanKonsul = function () {
                debugger;
                if ($scope.item.ruanganKonsul === undefined || $scope.item.ruanganKonsul === undefined || $scope.item.ruanganKonsul === "") {
                    messageContainer.error("Ruangan Belum Di Pilih")
                    return
                }
                if ($scope.item.namaDokter === undefined || $scope.item.namaDokter === undefined || $scope.item.namaDokter === "") {
                    messageContainer.error("Dokter Belum Di Pilih")
                    return
                }
                if ($scope.item.kelasKonsul === undefined || $scope.item.kelasKonsul === undefined || $scope.item.kelasKonsul === "") {
                    messageContainer.error("Kelas Belum Di Pilih")
                    return
                }
                if ($scope.item.ruanganKonsul.id === '44' || $scope.item.ruanganKonsul.id === '20') {
                    $scope.item.kelasKonsul.id = $scope.item.kelasId;
                }
                debugger;
                var length = 0
                var dataKonsul = {
                    "asalrujukanfk": 6,
                    "kelasfk": $scope.item.kelasKonsul.id,
                    "noantrian": length,
                    "norec_pd": $scope.dataSelected.norec_pd,
                    "dokterfk": $scope.item.namaDokter.id,
                    "objectruangantujuanfk": $scope.item.ruanganKonsul.id,
                    "objectruanganasalfk": $scope.dataSelected.ruid
                }
                medifirstService.post('tatarekening/save-konsul-keruangan', dataKonsul).then(function (e) {
                    // LoadData();
                    // $scope.saveLogKonsul();
                    debugger;
                    var dokterId = "";
                    if ($scope.item.namaDokter.id == undefined || $scope.item.dokter == "") {
                        dokterId = null;
                    } else
                        dokterId = $scope.item.namaDokter.id;
                    var json = {
                        'noregistrasi': $scope.item.noRegistrasi,
                        'jenispasien': idKelompokPasienLastfk,
                        'idruangan': $scope.item.ruanganKonsul.id,
                        'norec_apd': e.data.data.norec,
                        'idpegawai': dokterId,
                        'keteranganlain': 'Karcis Otomatis Rincian Tagihan'
                    }
                    medifirstService.post('registrasi/save-biaya-konsul', json).then(function (x) {
                        // 
                    });
                    $scope.now = new Date();
                    var data = {
                        "norec_kdr": '',
                        "objectruangantujuanfk": $scope.item.ruanganKonsul.id,
                        "objectruanganasalfk": $scope.dataSelected.ruid,
                        "tglupdate": moment($scope.now).format('YYYY-MM-DD HH:mm:ss'), //items.tglUpdate,//.getTime(), 
                        "objectstatuskendalidokumenfk": 2,
                        "nocmfk": $scope.item.pasienID,
                        "tglkeluar": moment($scope.now).format('YYYY-MM-DD HH:mm:ss'),
                        "catatan": "",
                        "noregistrasifk": e.data.data.norec
                        //"tglkembali": tglkembali
                    };
                    medifirstService.post('registrasi/dokumenrm/save-kendali-dokumen', data).then(function (e) {
                        $scope.batalKonsul();
                    });
                })
            }
            // **Show Komponen **//

            $scope.showKomponenHarga = function () {
                if ($scope.dataSelected == undefined) {
                    messageContainer.error("Pilih pelayanan dahulu!");
                    return;
                }
                // 
                loadKomponen();
                $scope.item.tglPelayanans = moment(new Date($scope.dataSelected.tglPelayanan)).format('DD-MM-YYYY HH:mm')
                $scope.item.namaPelayanans = $scope.dataSelected.namaPelayanan;
                $scope.popupKomponen.center().open();
                // Get current actions
                var actions = $scope.popupKomponen.options.actions;
                // Remove "Close" button
                actions.splice(actions.indexOf("Close"), 1);
                // Set the new options
                $scope.popupKomponen.setOptions({ actions: actions });

            }

            function loadKomponen() {
                medifirstService.get("tatarekening/get-komponenharga-pelayanan?norec_pp=" + $scope.dataSelected.norec).
                    then(function (data) {
                        $scope.sourceKomponens = new kendo.data.DataSource({
                            data: data.data.data,
                            serverPaging: false,
                            pageSize: 10,
                            schema: {
                                model: {
                                    fields: {
                                        komponenharga: { type: "string" },
                                        jumlah: { type: "number" },
                                        hargasatuan: { type: "number" },
                                        hargadiscount: { type: "number" },
                                        jasa: { type: "number" },

                                    }
                                }
                            },
                            aggregate: [
                                { field: 'hargasatuan', aggregate: 'sum' },
                                { field: 'hargadiscount', aggregate: 'sum' },
                                { field: 'jasa', aggregate: 'sum' },
                            ]


                        });
                        // $scope.sourceKomponens = data.data.data;

                    });
            }
            $scope.klikKomponen = function (dataSelectedKomponen) {
                if (dataSelectedKomponen.komponenharga != "Jasa Sarana") {
                    // $scope.button = false;
                    // $scope.billing = false;
                    // $scope.cetak = false;
                    // $scope.dtTanggal = false;
                    // $scope.FilterData = false;
                    $scope.DiskonKM = true;
                    $scope.label = dataSelectedKomponen.komponenharga;
                    $scope.item.komponenDis = dataSelectedKomponen.hargasatuan;
                    $scope.item.persenDiscount = "";
                    $scope.item.diskonKomponen = "";
                    $scope.item.JasaKomponen = dataSelectedKomponen.jasa;
                    norec_ppd = dataSelectedKomponen.norec
                    norec_pp = dataSelectedKomponen.norec_pp
                    strukfk = $scope.dataSelected.strukfk
                    hargasatuan = dataSelectedKomponen.hargasatuan
                } else {
                    $scope.DiskonKM = false;
                }
            }

            $scope.columnKomponens = {
                sortable: true,
                // pageable: true,
                selectable: "row",
                columns: [{
                    "field": "komponenharga",
                    "title": "Komponen",
                    "width": "100px",
                },
                {
                    "field": "jumlah",
                    "title": "Jumlah",
                    "width": "50px"
                },
                {
                    "field": "hargasatuan",
                    "title": "Harga Satuan",
                    "width": "80px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargasatuan #', '')}}</span>",
                    aggregates: ["sum"],
                    footerTemplate: "<span class='style-right'> {{formatRupiah('#:data.hargasatuan.sum  #', '')}}</span>"
                },
                {
                    "field": "hargadiscount",
                    "title": "Diskon",
                    "width": "80px",
                    "template": "<span class='style-right'>{{formatRupiah('#: hargadiscount #', '')}}</span>",
                    aggregates: ["sum"],
                    footerTemplate: "{{formatRupiah('#:data.hargadiscount.sum  #', '')}}"
                },
                {
                    "field": "jasa",
                    "title": "Jasa Cito",
                    "width": "80px",
                    "template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>",
                    aggregates: ["sum"],
                    footerTemplate: "<span class='style-right'>{{formatRupiah('#:data.jasa.sum  #', '')}}</span>"
                },
                ],
                sortable: {
                    mode: "single",
                    allowUnsort: false,
                },
            };

            // **end ShowKomponen
            $scope.cetakSurat = function () {
                // $mdDialog.show(confirm).then(function() {
                debugger
                var stt = 'false'
                if (confirm('View Surat Tagihan? ')) {
                    // Save it!
                    stt = 'true';
                } else {
                    // Do nothing!
                    stt = 'false'
                }
                var total = $scope.item.billing
                var deposit = $scope.item.deposit
                var client = new HttpClient();
                client.get('http://127.0.0.1:1237/printvb/kasir?cetak-suratTagihanDeposit=1&strNoregistrasi=' + $scope.item.noRegistrasi + '&total=' + total + '&deposit=' + deposit + '&view=' + stt, function (response) {
                    // do something with response
                });
            }

            $scope.TambahTindakanTerKlaim = function () {

                // if (KelompokUser[0].id != 52) {
                // 	alert('Hanya TataRekening/Admin yg boleh mengklaim!')
                // 	return
                // }

                var tempData = [];
                var logData = [];
                var dataDel = [];
                var tglajah = '';
                var dataKlaim = [];
                if ($scope.selectedData.length > 0) {

                    $scope.selectedData.forEach(function (items) {
                        dataKlaim.push(items);
                        if (items.strukfk != " / ") {
                            alert("Pelayanan yang sudah di Verif tidak bisa di klaim!");
                            return;
                        }

                        // if (moment(tgltgltgltgl).format('YYYY-MM-DD 00:00:00') < items.tglPelayanan) {
                        // 	for (var i = tglkpnaja.length - 1; i >= 0; i--) {
                        // 		if (tglkpnaja[i] == parseFloat(moment(items.tglPelayanan).format('D'))) {
                        // 			alert("Pelayanan yang sudah di Posting tidak bisa di klaim!");
                        // 			return;
                        // 		}

                        // 	}
                        // } else {
                        // 	tglajah = moment(items.tglPelayanan).format('YYYY-MM-DD 00:00:00')
                        // 	medifirstService.get("akutansi/get-sudah-posting-blm?tgl=" + tglajah, true).then(function (dat) {
                        // 		if (dat.data.sudahblm == true) {
                        // 			alert("Pelayanan yang sudah di Posting tidak bisa di klaim!");
                        // 			return;
                        // 		}
                        // 	})
                        // }
                    })

                }
                if (dataKlaim.length == 0) {
                    alert('Checklist yang akan di hapus!')
                    return;
                }

                var objKlaim = {
                    "pelayananpasien": dataKlaim,
                    "tglregistrasi": moment($scope.item.tglMasuk).format('YYYY-MM-DD HH:mm:ss')
                };

                medifirstService.post('tatarekening/tindakan/save-tindakan-tidak-terklaim', objKlaim).then(function (e) {
                    // LoadData(); 
                    loadListTindakanTakTerklaim();
                    $scope.popupList.center().open();
                });

            }

            function loadListTindakanTakTerklaim() {
                medifirstService.get("tatarekening/detail-tindakan-takterklaim?noregistrasi=" +
                    $scope.dataParams.noRegistrasi).then(function (data) {
                        data2 = data.data.data
                        var total = 0;
                        for (var i = 0; i < data2.length; i++) {
                            total = parseFloat(total) + parseFloat(data2[i].total);
                        }
                        $scope.item.TotalTakterklaim = parseFloat(total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        $scope.sourceTindakan = new kendo.data.DataSource({
                            data: data2
                        });
                    });
            }

            $scope.ListTindakanTakTerklaim = function () {
                loadListTindakanTakTerklaim();
                $scope.popupList.center().open();
            }

            $scope.selectedData2 = [];
            $scope.onClickSatu = function (e) {
                var element = $(e.currentTarget);
                var checked = element.is(':checked'),
                    row = element.closest('tr'),
                    grid = $("#Kgrid").data("kendoGrid"),
                    // grid = $("#grid").data("kendoGrid"),
                    dataItem = grid.dataItem(row);

                // $scope.selectedData[dataItem.noRec] = checked;
                if (checked) {
                    var result = $.grep($scope.selectedData2, function (e) {
                        return e.norec == dataItem.norec;
                    });
                    if (result.length == 0) {
                        $scope.selectedData2.push(dataItem);
                    } else {
                        for (var i = 0; i < $scope.selectedData2.length; i++)
                            if ($scope.selectedData2[i].norec === dataItem.norec) {
                                $scope.selectedData2.splice(i, 1);
                                break;
                            }
                        $scope.selectedData2.push(dataItem);
                    }
                    row.addClass("k-state-selected");
                } else {
                    for (var i = 0; i < $scope.selectedData2.length; i++)
                        if ($scope.selectedData2[i].norec === dataItem.norec) {
                            $scope.selectedData2.splice(i, 1);
                            break;
                        }
                    row.removeClass("k-state-selected");
                }
            }

            $scope.HapusTindakanTakTerklaim = function () {
                var dataHapus = [];
                var tempData = [];
                // if ($scope.selectedData2 != undefined){            	 	
                //       for (var i = data2.length - 1; i >= 0; i--) {
                //       	for (var j = $scope.selectedData2.length - 1; j >=0; j--) {
                //       		if ($scope.selectedData2[j].norec === data2[i].norec){                            
                //               dataHapus.push[$scope.selectedData2[j]]                           	                                
                //        	}
                //           }
                //       }
                //       $scope.sourceTindakan = new kendo.data.DataSource({
                //           data: data2
                //       }); 
                //   }
                if ($scope.selectedData2.length > 0) {
                    $scope.selectedData2.forEach(function (items) {
                        dataHapus.push(items);
                        tempData.push(items);
                    });
                }
                var objKlaim = {
                    "pelayananpasiendelete": dataHapus,
                    "tglregistrasi": moment($scope.item.tglMasuk).format('YYYY-MM-DD HH:mm:ss')
                };

                medifirstService.post('tatarekening/tindakan/hapus-tindakan-tidak-terklaim', objKlaim).then(function (e) {
                    // LoadData(); 
                    loadListTindakanTakTerklaim();
                    $scope.popupList.center().open();
                });

            }
            $scope.cetakJasperRincianAptk = function () {
                // getDepartemen();
                // debugger
                medifirstService.get('registrasi/get-departemen?idruangan=' + $scope.item.lastRuangan).then(function (dat) {
                    $scope.departemen = dat.data[0].objectdepartemenfk
                    debugger;
                    if ($scope.departemen == 18) {


                        debugger;
                        $scope.isRouteLoading = true;
                        var ruanganLast = "";
                        // var total ="";
                        // var totalDiscount ="";
                        // var totalBayar ="";
                        var namauser = "";
                        var umur = $scope.item.umur;
                        var kelas = $scope.item.kelasrawat
                        if ($scope.item.kelompokPasien != "Umum/Pribadi") {
                            kelas = $scope.item.kelasPenjamin
                        }
                        var namakamar = $scope.item.namakamar;
                        debugger;
                        namauser = medifirstService.getPegawaiLogin().namaLengkap;
                        // medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noregistrasi + '?jenisdata=bill').then(function (dat) {
                        medifirstService.get("tatarekening/get-data-login-cetakan-ruangan-last?noregistrasi=" + $scope.item.noRegistrasi, true).then(function (dat) {
                            debugger;
                            ruanganLast = dat.data[0].namaruangan;
                            // medifirstService.get("tatarekening/get-data-sum-resep-rajal?noregistrasi="+$scope.item.noRegistrasi,true).then(function (dat) {
                            // 	debugger;
                            // 	for (var i = 0; i < dat.data.length; i++) {
                            // total =  "Rp."  + " " + parseFloat(dat.data[i].totalharga).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            // totalBayar =  "Rp."  + " " + parseFloat(dat.data[i].totalBiaya).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            // totalDiscount =  "Rp."  + " " + parseFloat(dat.data[i].totaldiscound).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                            medifirstService.get("tatarekening/get-data-sum-resep-rajal-2?noregistrasi=" + $scope.item.noRegistrasi, true).then(function (dat) {
                                debugger;
                                var norecobat = dat.data[0].norec
                                for (var i = 0; i < dat.data.length; i++) {
                                    var ruangan = dat.data[i].ruanganpasien
                                    var total = "Rp." + " " + parseFloat(dat.data[i].totalharga).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                                    var totalBayar = "Rp." + " " + parseFloat(dat.data[i].totalBiaya).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                                    var totalDiscount = "Rp." + " " + parseFloat(dat.data[i].totaldiscound).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");


                                    debugger;
                                    var data = {
                                        "gambarLogo": "logo_rs.jpg",
                                        "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi", "lastruangan", "total", "kelas", "namakamar", "norec", "totalAkhir", "discount", "umur"],
                                        "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", namauser, $scope.item.noRegistrasi,
                                            ruangan, total, kelas, namakamar, norecobat, totalBayar, totalDiscount, umur
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
                                        xhr.open('POST', 'http://192.168.0.62:1002/generic/report/cetakResepRIncianRajal.pdf');
                                    } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                                        xhr.open('POST', 'http://192.168.88.56:1002/generic/report/cetakResepRIncianRajal.pdf');
                                    } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                        xhr.open('POST', 'http://10.10.20.167:1002/generic/report/cetakResepRIncianRajal.pdf');
                                    } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                        xhr.open('POST', '/jasper1/generic/report/cetakResepRIncianRajal.pdf');
                                    } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                        xhr.open('POST', '/jasper1generic/report/cetakResepRIncianRajal.pdf');
                                    } else {
                                        xhr.open('POST', 'http://127.0.0.1:8797/generic/report/cetakResepRIncianRajal.pdf');
                                    }

                                    // set `Content-Type` header
                                    xhr.setRequestHeader('Content-Type', 'application/json');
                                    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                                    xhr.responseType = 'blob';
                                    // send rquest with JSON payload
                                    xhr.send(JSON.stringify(data));
                                    $scope.isRouteLoading = false;
                                }
                            });
                            // }
                            //  });

                        });

                        // $scope.isRouteLoading = true;

                        //                 var ruanganLast ="";
                        //                 var total ="";
                        //                 var namauser = "";
                        //                 // if ($scope.dataSelected == undefined || $scope.dataSelected == "")
                        //                 // {
                        //                 //     alert("Klik Salah Sutu Data!!")
                        //                 //     return;
                        //                 // }else
                        //                 // {
                        //                 //      namauser = $scope.dataSelected.detail.userData.namauser;
                        //                 // }
                        //                 medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noRegistrasi + '?jenisdata=bill').then(function (dat) {
                        //                 medifirstService.get("tatarekening/get-data-login-cetakan-ruangan-last?noregistrasi="+$scope.item.noRegistrasi,true).then(function (dat) {
                        //                     ruanganLast = dat.data[0].namaruangan;
                        //                     medifirstService.get("tatarekening/get-data-login-cetakan?noregistrasi="+$scope.item.noRegistrasi,true).then(function (dat) {
                        //                         total =  "Rp."  + " " + parseFloat(dat.data[0].total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                        // 			namauser=dataLogin.userData.namauser;
                        // 			var data = {
                        //                             "gambarLogo": "logo_rs.jpg",
                        //                             "paramKey": ["namaRS", "tgllahir","alamatRS","printedBy","noregistrasi","lastruangan","total"],
                        //                             "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00","Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211",namauser,$scope.item.noRegistrasi,
                        //                             ruanganLast,total],
                        //                             "paramType" : ["","date","","","","",""]
                        //                         };

                        //                     var xhr = new XMLHttpRequest();
                        //                     xhr.onreadystatechange = function(){
                        //                         if (this.readyState == 4 && this.status == 200){
                        //                             //this.response is what you're looking for
                        //                             // handler(this.response);
                        //                             console.log(this.response, typeof this.response);
                        //                             //var res = this.response
                        //                             //var file = new Blob( [res], {type: 'application/pdf'});
                        //                             debugger;
                        //                             var url = window.URL.createObjectURL(this.response)
                        //                             var pdf = document.getElementById('tempatLaporan');
                        //                             pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                        //                             var win = window.open(url, '_blank');
                        //                             win.focus();
                        //                         }
                        //                     }

                        //                             // if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                        //                             //     xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbillingApotik.pdf');
                        //                             // }else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                        //                             //     xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbillingApotik.pdf');
                        //                             // }else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                        //                             //     xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbillingApotik.pdf');
                        //                             // }else{
                        //                             //     xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingApotik.pdf');
                        // 				// }

                        // 				if (window.location.hostname.indexOf('192.168.0.62') > -1) {
                        // 					xhr.open('POST', 'http://192.168.0.62:8797/generic/report/rekapbillingApotik.pdf');
                        // 				}else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                        // 					xhr.open('POST', 'http://192.168.88.56:8797/generic/report/rekapbillingApotik.pdf');
                        // 				}else if(window.location.hostname.indexOf('10.10.20.167') > -1){
                        // 					xhr.open('POST', 'http://10.10.20.167:8797/generic/report/rekapbillingApotik.pdf');
                        // 				}else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                        // 					xhr.open('POST', '/jasper1/generic/report/rekapbillingApotik.pdf');
                        // 				}else if(window.location.hostname.indexOf('10.8.8.8') > -1){
                        // 					xhr.open('POST', '/jasper1/generic/report/rekapbillingApotik.pdf');
                        // 				}else{
                        // 					xhr.open('POST', 'http://127.0.0.1:8797/generic/report/rekapbillingApotik.pdf');
                        // 				}

                        //                     // set `Content-Type` header
                        //                     xhr.setRequestHeader('Content-Type', 'application/json');
                        //                     xhr.setRequestHeader('Access-Control-Allow-Origin','*');
                        //                     xhr.responseType = 'blob';
                        //                     // send rquest with JSON payload
                        //                     xhr.send(JSON.stringify(data));	
                        //                     $scope.isRouteLoading = false;
                        //                      });

                        //                  });
                        //                 });




                    } else {
                        debugger

                        $scope.isRouteLoading = true;

                        var ruanganLast = "";
                        var total = "";
                        var namauser = "";
                        // if ($scope.dataSelected == undefined || $scope.dataSelected == "")
                        // {
                        //     alert("Klik Salah Sutu Data!!")
                        //     return;
                        // }else
                        // {
                        //      namauser = $scope.dataSelected.detail.userData.namauser;

                        // }

                        var kelas = $scope.item.kelasrawat
                        if ($scope.item.kelompokPasien != "Umum/Pribadi") {
                            kelas = $scope.item.kelasPenjamin
                        }
                        var namakamar = $scope.item.namakamar
                        // medifirstService.get("tatarekening/detail-tagihan/" + $scope.item.noregistrasi + '?jenisdata=bill').then(function (dat) {
                        medifirstService.get("tatarekening/get-data-login-cetakan-ruangan-last?noregistrasi=" + $scope.item.noRegistrasi, true).then(function (dat) {
                            ruanganLast = dat.data[0].namaruangan;
                            medifirstService.get("tatarekening/get-data-login-cetakan?noregistrasi=" + $scope.item.noRegistrasi, true).then(function (dat) {
                                total = "Rp." + " " + parseFloat(dat.data[0].total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                                debugger;
                                var data = {
                                    "gambarLogo": "logo_rs.jpg",
                                    "paramKey": ["namaRS", "tgllahir", "alamatRS", "printedBy", "noregistrasi", "lastruangan", "total", "kelas", "namakamar"],
                                    "paramValue": ["RS BHAYANGKARA TK IV CIANJUR", "1980-12-25 00:00:00", "Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211", namauser, $scope.item.noRegistrasi,
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
                                } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                                    xhr.open('POST', '/jasper1/generic/report/rekapbillingApotik.pdf');
                                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                                    xhr.open('POST', '/jasper1generic/report/rekapbillingApotik.pdf');
                                } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
                                    xhr.open('POST', 'http://10.10.20.167:1002/generic/report/rekapbillingApotik.pdf');
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
                    }
                })
            }

            $scope.SimpanTindakanTakTerklaim = function () {
                // if ($scope.item.statusVerif == true) {
                // 	window.messageContainer.error("Data Sudah Diclosing, Hubungi Tatarekening!!!!");
                //     return;
                // }

                if (KelompokUser[0].id != 52) {
                    alert('Hanya TataRekening/Admin yg boleh mengklaim!')
                    return
                }

                var tempData = [];
                var logData = [];
                var dataDel = [];
                var tglajah = '';
                var dataKlaim = [];
                if ($scope.selectedData2.length > 0) {

                    $scope.selectedData2.forEach(function (items) {
                        if (items.strukfk != " / ") {
                            alert("Pelayanan yang sudah di Verif tidak bisa di klaim!");
                            return;
                        }

                        if (moment(tgltgltgltgl).format('YYYY-MM-DD 00:00:00') < items.tglPelayanan) {
                            for (var i = tglkpnaja.length - 1; i >= 0; i--) {
                                if (tglkpnaja[i] == parseFloat(moment(items.tglPelayanan).format('D'))) {
                                    alert("Pelayanan yang sudah di Posting tidak bisa di klaim!");
                                    return;
                                }

                            }
                        } else {
                            tglajah = moment(items.tglPelayanan).format('YYYY-MM-DD 00:00:00')
                            medifirstService.get("akutansi/get-sudah-posting-blm?tgl=" + tglajah, true).then(function (dat) {
                                if (dat.data.sudahblm == true) {
                                    alert("Pelayanan yang sudah di Posting tidak bisa di klaim!");
                                    return;
                                }
                            })
                        }
                    })
                }

                if (data2.length == 0) {
                    alert('Checklist yang akan di hapus!')
                    return;
                }

                var objKlaim = {
                    "pelayananpasien": data2,
                    "tglregistrasi": moment($scope.item.tglMasuk).format('YYYY-MM-DD HH:mm:ss')
                };

                manageTataRekening.post('tatarekening/tindakan/save-tindakan-tidak-terklaim', objKlaim).then(function (e) {
                    //    if(e.status === 201){
                    //         manageTataRekening.saveLogHapusTindakan(objLog).then(function(e){
                    //	  })
                    //        }
                    LoadData();
                });

            }

            $scope.columnTindakan = [{
                "template": "<input type='checkbox' class='checkbox' ng-click='onClickSatu($event)' />",
                "width": 40
            },
            {
                "field": "tglPelayanan",
                "title": "Tanggal",
                "width": "100px",
                "template": "<span class='style-left'>{{formatTanggal('#: tglPelayanan #')}}</span>"
                // "template": "#= new moment(new Date(tglPelayanan)).format('DD-MM-YYYY HH:mm') #",
            },
            {
                "field": "namaPelayanan",
                "title": "Nama Pelayanan",
                "width": "200px",
            },
            {
                "field": "kelasTindakan",
                "title": "Kelas",
                "width": "100px",
            },
            {
                "field": "dokter",
                "title": "Dokter",
                "width": "170px",
            },
            {
                "field": "ruanganTindakan",
                "title": "Ruangan",
                "width": "200px",
            },
            {
                "field": "jumlah",
                "title": "Qty",
                "width": "50px",
                "template": "<span class='style-right'>#: jumlah #</span>"
            },
            {
                "field": "harga",
                "title": "Harga",
                "width": "120px",
                "template": "<span class='style-right'>{{formatRupiah('#: harga #', '')}}</span>"
            },
            {
                "field": "diskon",
                "title": "Harga Diskon",
                "width": "120px",
                "template": "<span class='style-right'>{{formatRupiah('#: diskon #', '')}}</span>"
            },
            {
                "field": "jasa",
                "title": "Jasa",
                "width": "100px",
                "template": "<span class='style-right'>{{formatRupiah('#: jasa #', '')}}</span>"
            },
            {
                "field": "total",
                "title": "Total",
                "width": "120px",
                "template": "<span class='style-right'>{{formatRupiah('#: total #', '')}}</span>"
            }
            ];

            $scope.selesaiPeriksa = function () {
                var confirm = $mdDialog.confirm()
                    .title('Informasi')
                    .textContent('Selesai Periksa akan menutup tagihan pasien, Lanjut simpan ?')
                    .ok('Ya')
                    .cancel('Tidak')
                $mdDialog.show(confirm).then(function () {
                    var json = {
                        'norec_pd': norec_pd
                    }
                    manageTataRekening.post('tatarekening/close-pemeriksaan', json).then(function (e) {

                    });
                })
            }

        }
    ]);
});