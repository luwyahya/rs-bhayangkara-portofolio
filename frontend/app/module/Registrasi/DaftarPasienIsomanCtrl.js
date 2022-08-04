define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarPasienIsomanCtrl', ['MedifirstService', 'CacheHelper', '$scope', 'DateHelper', '$state', 'ModelItem', '$mdDialog',
        function (medifirstService, cacheHelper, $scope, DateHelper, $state, ModelItem, $mdDialog) {
            //Inisial Variable 
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            $scope.dataSelected = {};
            $scope.item = {};
            $scope.itemD = {};
            $scope.isRouteLoading = false;
            $scope.item.tglawal = $scope.now;
            $scope.item.tglakhir = $scope.now;
            $scope.tglMeninggal = '';
            $scope.Page = {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            }
            var kelompokUserLogin = ModelItem.getStatusUser()
            if (kelompokUserLogin == 'radiologi' || kelompokUserLogin == 'laborat') {
                $scope.isPenunjang = true
            }
            loadFirst()
            function loadFirst() {
                cacheHelper.set('cacheStatusPasien', undefined);
                var chacePeriode = cacheHelper.get('RegistrasiPasienLamaRevCtrl');
                if (chacePeriode != undefined) {
                    var arrPeriode = chacePeriode.split('~');
                    $scope.item.periodeAwal = new Date(arrPeriode[0]);
                    $scope.item.periodeAkhir = new Date(arrPeriode[1]);

                } else {
                    $scope.item.periodeAwal = $scope.now;
                    $scope.item.periodeAkhir = $scope.now;
                }
            }
            loadData()
            $scope.SearchData = function () {
                loadData()
            }
            $scope.SearchEnter = function () {
                loadData()
            }
            $scope.SearchNoRm = function () {
                loadData()
            }
            $scope.SearchTglLahir = function () {
                loadData()
            }
            function loadData() {

                $scope.isRouteLoading = true;


                // var rm = ""
                // if ($scope.item.noRM != undefined) {
                //     rm = "&norm=" + $scope.item.noRM
                // }

                var pasien = ""
                if ($scope.item.namaPasien != undefined) {
                    pasien = "&namaPasien=" + $scope.item.namaPasien
                }
             

                medifirstService.get("registrasi/get-pasienisomanAll?" +
                    pasien 
                    )
                    .then(function (data) {
                        $scope.isRouteLoading = false;

                        $scope.dataSourceGrid = new kendo.data.DataSource({
                            data: data.data.data,
                            pageSize: 10,
                            total: data.data.data.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }

                        });
                    });

            };



            $scope.columnGrid = {
                pageable: true,
                columns: [
                    {
                        "field": "nocm",
                        "title": "No Rekam Medis",
                        "width": "80px",
                        // "template": "<span class='style-center'>#: nocm #</span>"
                    },
                    {
                        "field": "namapasien",
                        "title": "Nama Pasien",
                        "width": "150px",
                        // "template": "<span class='style-center'>#: namapasien #</span>"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruangan Kerja",
                        "width": "80px",
                        // "template": "<span class='style-center'>#: jeniskelamin #</span>"
                    },
                    {
                        "field": "pekerjaan",
                        "title": "Pekerjaan",
                        "width": "80px",
                        // "template": "<span class='style-center'>#: jeniskelamin #</span>"
                    },
                    {
                        "field": "namakeluarga",
                        "title": "Nama  Keluarga",
                        "width": "80px",
                        // "template": "<span class='style-center'>#: jeniskelamin #</span>"
                    },

                    {
                        "field": "statuscovid",
                        "title": "Status Covid",
                        "width": "100px",
                        // "template": '# if( namaayah==null) {# - # } else {# #= namaayah # #} #'
                        // "template": "<span class='style-center'>#: namaayah #</span>"
                    },
                    {
                        "field": "tglpositif",
                        "title": "Tanggal Positif",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglpositif #')}}</span>"
                    },
                    
                    {
                        "field": "tglisoman",
                        "title": "Tanggal Isoma",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglisoman #')}}</span>"
                    },
                    {
                        "field": "tgltestlabkembali",
                        "title": "Tanggal Periksa Lab",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tgltestlabkembali #')}}</span>"
                    },
                    {
                        "field": "hasiltestlab",
                        "title": "Hasil Pemeriksaan",
                        "width": "100px",
                        // "template": '# if( namaayah==null) {# - # } else {# #= namaayah # #} #'
                        // "template": "<span class='style-center'>#: namaayah #</span>"
                    }
                    // lisoman, tglselesaiisoman, tgltestlabkembali, hasiltestlab, statuscovid

                ]
            };

            $scope.klikGrid = function (dataPasienSelected) {
                if (dataPasienSelected != undefined) {
                    $scope.nocm = dataPasienSelected.nocm;
                    $scope.id = dataPasienSelected.id;
                    $scope.nocmfk = dataPasienSelected.nocmfk;
               
                }
            }
          
            $scope.tutupManual = function () {
               
                $scope.popUpRegisManual.close()
            }
            $scope.bukaManual = function () {
                // /RegistrasiPasienIsomanLangsung
                cacheHelper.set('pasien','');
                $state.go("RegistrasiPasienIsomanLangsung")
            }
            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }
            $scope.formatTanggaljam = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY hh:mm:ss');
            }
            $scope.$on("kendoWidgetCreated", function (event, widget) {
                if (widget === $scope.grid) {
                    $scope.grid.element.on('dblclick', function (e) {
                        if ($scope.nocm != undefined) {
                            $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                                noCm: $scope.nocm
                            })
                            var cacheSet = undefined;
                            cacheHelper.set('CacheRegistrasiPasien', cacheSet);

                        }
                    })

                }

            })


            $scope.RegistrasiPasien = function () {

                debugger;
                if ($scope.nocm == undefined) {
                    toastr.warning('Pilih data dulu!')
                    return
                }

                if ($scope.tglMeninggal != undefined) {
                    toastr.warning('Pasien Sudah Meninggal Tidak Bisa Didaftarkan, Peringatan !')
                    return
                }
                if ($scope.objectagamafk === undefined || $scope.objectagamafk === '0' || $scope.objectagamafk === null) {
                    toastr.error('Agama Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                    return
                }
                if ($scope.objectpendidikanfk === undefined || $scope.objectpendidikanfk === '13' || $scope.objectpendidikanfk === null) {
                    toastr.error('Pendidikan Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                    return
                }
                if ($scope.objectpekerjaanfk === undefined || $scope.objectpekerjaanfk === null) {
                    toastr.error('Pekerjaan Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                    return
                }
                if ($scope.objectdesakelurahanfk === undefined || $scope.objectdesakelurahanfk === null) {
                    toastr.error('Kelurahan Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                    return
                }
                if ($scope.nohp === undefined || $scope.nohp === '-') {
                    toastr.error('No HandPhone Belum Di Isi, Silahkan Edit Data Pasien, Peringatan !')
                    return
                }
                
                if ($scope.objectpekerjaanfk === '6') {
                    if ($scope.objectkesatuanfk === undefined || $scope.objectkesatuanfk === null || $scope.objectkesatuanfk === '3' || $scope.objectkesatuanfk === '7') {
                        toastr.error('Kesatuan Tidak Boleh Lain Nya, Silahkan Edit Data Pasien, Peringatan !')
                        return
                    }
                    if ($scope.objectsatuankerjafk === undefined || $scope.objectsatuankerjafk === null) {
                        toastr.error('Satuan Kerja Tidak Kosong, Silahkan Edit Data Pasien, Peringatan !')
                        return
                    }
                }

                cacheHelper.set('cacheStatusPasien', 'LAMA');
                if (!$scope.isPenunjang) {
                    cacheHelper.set('isPenunjang', undefined);
                    $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                        noCm: $scope.nocm
                    })
                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cacheSetss = undefined;
                    cacheHelper.set('CacheRegisOnline', cacheSetss);

                } else {
                    cacheHelper.set('isPenunjang', true);
                    $state.go("UmVnaXN0cmFzaVJ1YW5nYW4=", {
                        noCm: $scope.nocm
                    })
                    var cacheSet = undefined;
                    cacheHelper.set('CacheRegistrasiPasien', cacheSet);
                    var cacheSetss = undefined;
                    cacheHelper.set('CacheRegisOnline', cacheSetss);
                }
            }
            $scope.RegistrasiPasienPegawai = function () {

                debugger;

                    cacheHelper.set('pasien', $scope.id);
                    $state.go("RegistrasiPasienIsomanLangsung")
                   
             
            }
            $scope.HapusRegistrasiPasienPegawai = function () {

                debugger;
                if ($scope.id == undefined) {
                    toastr.warning('Pilih data dulu!')
                    return
                }
                var confirm = $mdDialog.confirm()
                .title('Peringatan')
                .textContent('Yakin mau menghapus data?')
                .ariaLabel('Lucky day')
                .cancel('Tidak')
                .ok('Ya')
            $mdDialog.show(confirm).then(function () {
                if ($scope.id != undefined) {
                    var item = {
                        idpasien: $scope.id
                    }

                    medifirstService.post('registrasi/hapus-pasienisoman', item).then(function (e) {
                        loadData();
                    })

                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            })

              
               
            }
            $scope.EditPasien = function () {
                if ($scope.nocm != undefined) {

                    cacheHelper.set('CacheRegisBayi', undefined);
                    $state.go('RegistrasiPasienBaru', {
                        noRec: 0,
                        idPasien: $scope.idPasien
                    })


                } else {
                    messageContainer.error("Pilih data dulu!")
                }
            }
            $scope.HapusPasien = function () {
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Yakin mau menghapus data?')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    if ($scope.idPasien != undefined) {
                        var item = {
                            idpasien: $scope.idPasien
                        }

                        medifirstService.post('registrasi/update-false-pasien', item).then(function (e) {
                            loadData();
                        })

                    } else {
                        messageContainer.error("Pilih data dulu!")
                    }
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
            $scope.formatNum = {
				format: "#.#",
				decimals: 0
			}
            $scope.labelpasien = function () {
				// if($scope.item != undefined){
				//     var fixUrlLaporan = cetakHelper.open("reporting/labelPasien?noCm=" + $scope.item.pasien.noCm);
				//     window.open(fixUrlLaporan, '', 'width=800,height=600')
				// }
				$scope.dats = {
					qty: 0
				}
				$scope.dialogCetakLabel.center().open();
			}
			$scope.pilihQty = function (data) {
                debugger;
				var listRawRequired = [
					"dats.qty|k-ng-model|kuantiti"
				];
				var isValid = ModelItem.setValidation($scope, listRawRequired);

				if (isValid.status) {
					var qty = data.qty;
					var qtyhasil = data.qty * 2;
					if (qty !== undefined) {
						// var fixUrlLaporan = cetakHelper.open("reporting/labelPasien?noCm=" + $scope.item.pasienDaftar.noRegistrasi + "&qty=" + qty);
						// window.open(fixUrlLaporan, '', 'width=800,height=600')
						//cetakan langsung service VB6 by grh

						//##save identifikasi label pasien
						medifirstService.get("registrasi/identifikasi-label?norec_pd="
							+ $scope.dataPasienSelected.nocm + '&islabel=' + qtyhasil
						).then(function (data) {
							var datas = data.data;
						})
						//##end

						var client = new HttpClient();
						client.get('http://127.0.0.1:1237/printvb/Pendaftaran?cetak-labelpasien-satu=1&norec=' + $scope.dataPasienSelected.nocm + '&view=false&qty=' + qty, function (response) {
							// do something with response
						});

					}
					$scope.dialogCetakLabel.close();
				} else {
					ModelItem.showMessages(isValid.messages);
				}
			};

            $scope.pasienBaru = function () {
                // body...
                $state.go("RegistrasiPasienBaru", {
                    noRec: 0,
                    idPasien: 0
                })
            }


            $scope.columnRiwayatRegistrasi = {
                toolbar: [
                    "excel",

                ],
                excel: {
                    fileName: "DaftarRiwayatRegistrasi.xlsx",
                    allPages: true,
                },
                excelExport: function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.frozenRows = 2;
                    sheet.mergedCells = ["A1:K1"];
                    sheet.name = "Orders";

                    var myHeaders = [{
                        value: "Daftar Registrasi Pasien",
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
                        "field": "newno",
                        "title": "No",
                        "width": "30px",
                    },
                    {
                        "field": "tglregistrasi",
                        "title": "Tgl Registrasi",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggaljam('#: tglregistrasi #')}}</span>"
                    },
                    {
                        "field": "noregistrasi",
                        "title": "No Registrasi",
                        "width": "90px"
                    },
                    {
                        "field": "namaruanganasal",
                        "title": "Ruanganan Layanan Asal",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namaruanganasal #</span>"
                    },
                    {
                        "field": "namaruangan",
                        "title": "Ruanganan Layanan",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namaruangan #</span>"
                    },
                    {
                        "field": "namarekanan",
                        "title": "Kelompok Pasien",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namarekanan #</span>"
                    },
                    {
                        "field": "namadokter",
                        "title": "Nama Dokter",
                        "width": "150px",
                        "template": "<span class='style-left'>#: namadokter #</span>"
                    },
                    {
                        "field": "tglpulang",
                        "title": "Tgl Pulang",
                        "width": "80px",
                        "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },
                    {
                        "field": "lamarawat",
                        "title": "Lama Dirawat",
                        "width": "80px"
                        // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },
                    {
                        "field": "statuspulang",
                        "title": "Status Pulang",
                        "width": "100px"
                        // "template": "<span class='style-left'>{{formatTanggal('#: tglpulang #')}}</span>"
                    },
                    {
                        "field": "isdiagnosis",
                        "title": "Diagnosis",
                        "width": "300px",
                        "template": '# if( isdiagnosis==false) {# - # } else {# #= isdiagnosis # #} #'
                    },
                    {
                        "field": "kesatuanpasien",
                        "title": "Kesatuan Pasien",
                        "width": "100px",
                        "template": '# if( kesatuanpasien==false) {# - # } else {# #= kesatuanpasien # #} #'
                    },
                ]
            };

            $scope.RiwayatRegistrasi = function () {
                debugger;
                if ($scope.dataPasienSelected == undefined) {
                    messageContainer.error("Pilih data dulu!")
                }
                $scope.itemD.noRM = $scope.dataPasienSelected.nocm;
                $scope.itemD.namaPasien = $scope.dataPasienSelected.namapasien;
                $scope.itemD.tglLahir = moment($scope.dataPasienSelected.tgllahir).format('DD-MM-YYYY');
                loadDataRiwayat();
                $scope.popUpRiwayatRegistrasi.center().open();
                var actions = $scope.popUpRiwayatRegistrasi.options.actions;
                actions.splice(actions.indexOf("Close"), 1);
                $scope.popUpRiwayatRegistrasi.setOptions({ actions: actions });
            }

            $scope.TutupPopUp = function () {
                $scope.itemD.noRM = undefined;
                $scope.itemD.namaPasien = undefined;
                $scope.itemD.tglLahir = undefined;
                $scope.itemD.noRegistrasi = undefined;
                $scope.itemD.JumlahRawat = undefined;
                $scope.dataRiwayatRegistrasi = new kendo.data.DataSource({
                    data: []
                });
                $scope.popUpRiwayatRegistrasi.close();
            }

            function loadDataRiwayat() {
                $scope.isRouteLoading = true;
                var rm = ""
                if ($scope.itemD.noRM != undefined) {
                    rm = "&norm=" + $scope.itemD.noRM
                }

                var pasien = ""
                if ($scope.itemD.namaPasien != undefined) {
                    pasien = "&namaPasien=" + $scope.itemD.namaPasien
                }

                var tglLahirs = ""
                if ($scope.itemD.tglLahir != undefined) {
                    tglLahirs = "tglLahir=" + moment($scope.itemD.tglLahir).format('YYYY-MM-DD HH:mm:ss');
                }

                var noReg = ""
                if ($scope.itemD.noRegistrasi != undefined) {
                    noReg = "&noReg=" + $scope.itemD.noRegistrasi;
                }

                medifirstService.get("registrasi/daftar-riwayat-registrasi?" +
                    tglLahirs + rm + noReg + pasien)
                    .then(function (data) {
                        debugger;
                        $scope.isRouteLoading = false;
                        var jumlahRawat = 0;
                        var dRiwayatReg = data.data.daftar;
                        for (var i = 0; i < dRiwayatReg.length; i++) {
                            dRiwayatReg[i].no = i + 1
                            if (dRiwayatReg[i].statusinap == 1) {
                                jumlahRawat = jumlahRawat + 1;
                                if (dRiwayatReg[i].tglpulang != undefined) {
                                    var umur = DateHelper.CountAge(new Date(dRiwayatReg[i].tglregistrasi), new Date(dRiwayatReg[i].tglpulang));
                                    var bln = umur.month,
                                        thn = umur.year,
                                        day = umur.day
                                    dRiwayatReg[i].lamarawat = day + " Hari";
                                } else {
                                    var umur = DateHelper.CountAge(new Date(dRiwayatReg[i].tglregistrasi), new Date($scope.now));
                                    var bln = umur.month,
                                        thn = umur.year,
                                        day = umur.day
                                    dRiwayatReg[i].lamarawat = day + " Hari";
                                }
                            }
                        }
                        dRiwayatReg.sort((d1, d2) => new Date(d2.tglregistrasi).getTime() - new Date(d1.tglregistrasi).getTime());
                        for (var x = 0; x < dRiwayatReg.length; x++) {
                            dRiwayatReg[x].newno = x + 1
                        }

                        $scope.itemD.JumlahRawat = jumlahRawat;
                        $scope.dataRiwayatRegistrasi = new kendo.data.DataSource({
                            data: dRiwayatReg,
                            pageSize: 10,
                            total: dRiwayatReg.length,
                            serverPaging: false,
                            schema: {
                                model: {
                                    fields: {
                                    }
                                }
                            }
                        });
                    });
            }

            $scope.SearchEnterDetail = function () {
                loadDataRiwayat();
            }
            function saveBase64AsFile(base64, fileName) {

                var link = document.createElement("a");

                link.setAttribute("href", base64);
                link.setAttribute("download", fileName);
                link.click();
            }
            $scope.saveImage = function () {
                saveBase64AsFile($scope.item.image, 'asa.jpg')
                // var img = document.getElementById('embedImage');
                // img.src = $scope.item.image
                // window.location.href = img.src.replace('image/png', 'image/octet-stream');
            }
            window.addEventListener('DOMContentLoaded', () => {

                var img = document.getElementById('embedImage');
                img.src = $scope.item.image

                img.addEventListener('load', () => button.removeAttribute('disabled'));

                const button = document.getElementById('saveImage');
                button.addEventListener('click', () => {
                    window.location.href = img.src.replace('image/jpg', 'image/octet-stream');
                });
            });
            $scope.inputRMManual = function () {
                $scope.popUpManual.center().open()
            }
            $scope.saveNormManual = function () {
                if($scope.item.normManual.length<8){
                    toastr.warning('Nomor Rekam Medis Harus 8 Digit')
                    return
                }
                var rm = ""
                if ($scope.item.normManual != undefined) {
                    rm = "&norm=" + $scope.item.normManual
                }
                medifirstService.get("registrasi/get-pasien?" + rm)
                    .then(function (data) {
                        debugger;
                        if(data.data.daftar.length!=0){
                            toastr.warning('Nomor Rekam Medis Sudah Di Pakai')
                            return
                        }else{
                            var post = {
                                normmanual: $scope.item.normManual
                            }
                            medifirstService.post('registrasi/save-mr-manual', post).then(function (e) {
                                debugger;
                                if(e.data.data=="false"){
                                    toastr.warning('Nomor Rekam Medis Lebih Besar Dari Nomor RM Terakhir')
                                    return
                                }else{
                                    $scope.saveLogging('NoRM Manual', 'Id Pasien',e.data.data.kodeexternal, 'Input NoRM Manual ')
                                    cacheHelper.set('CacheRegisBayi', undefined);
                                    $state.go('RegistrasiPasienBaru', {
                                        noRec: 0,
                                        idPasien: e.data.data.kodeexternal
                                    })
                                }
                            })
                        }
                    });
            }

            $scope.saveLogging = function (jenis, referensi, noreff, ket) {
                medifirstService.get("sysadmin/logging/save-log-all?jenislog=" + jenis
                    + "&referensi=" + referensi
                    + "&noreff=" + noreff
                    + "&keterangan=" + ket
                ).then(function (data) {

                })
            }

            $scope.gabungkanNoRM = function () {
                if ($scope.dataPasienSelected == undefined) {
                    toastr.error("Pilih data dulu!")
                }
                $scope.item.idRmAsal = $scope.dataPasienSelected.nocmfk
                $scope.item.rmAsal = $scope.dataPasienSelected.nocm
                $scope.item.namaPasienAsal = $scope.dataPasienSelected.namapasien
                $scope.popUpGabungkan.center().open()
            }
            $scope.saveGabungkan = function () {
                if ($scope.item.rmTujukan == undefined) return;
                if ($scope.item.idRmAsal == undefined) return;
                if ($scope.item.password != "donatelo") {
                    toastr.error("Password Salah!")
                    return;
                }
                var confirm = $mdDialog.confirm()
                    .title('Peringatan')
                    .textContent('Apakah Anda yakin menggabungkan No RM ' + $scope.item.rmAsal + ' Ke ' + $scope.item.rmTujukan + ' ?!')
                    .ariaLabel('Lucky day')
                    .cancel('Tidak')
                    .ok('Ya')
                $mdDialog.show(confirm).then(function () {
                    var data = {
                        idasal: $scope.item.idRmAsal,
                        nocmasal: $scope.item.rmAsal.trim(),
                        nocmtujuan: $scope.item.rmTujukan.trim(),
                    }
                    medifirstService.post('registrasi/merge-nomor-rm', data).then(function (e) {
                        if (e.status === 201) {
                        debugger;
                        medifirstService.post('registrasi/save-log-mergenocm', data).then(function (e) {
                            })
                        }
                        $scope.popUpGabungkan.close()
                        $scope.item.idRmAsal = undefined
                        loadData()

                    })
                })
            }

            ///////////////////////////////////////////////////////////////////////////////////////////
        }
    ]);
});