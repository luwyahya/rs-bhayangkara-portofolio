//Owari Start here....
//“Good programmer write code for machine, great programmer write code for other programmer”, laravel
define(['initialize'], function (initialize) {
	'use strict';
	initialize.controller('SetoranKasirCtrl', ['$q', '$scope', 'DateHelper', 'CacheHelper', 'MedifirstService',
		function ($q, $scope, dateHelper, cacheHelper, medifirstService) {
			$scope.isRouteLoading = false;
			$scope.now = new Date();
			$scope.item = {};
			$scope.total = {};
			$scope.dataLogin = medifirstService.getPegawai();
			var addDataDetail = [];
			var addDataDetailD = [];
			$scope.item.tanggalAwal = $scope.now
			$scope.item.tanggalAkhir = $scope.now
			$scope.item.tglsetor = $scope.now
			$scope.item.tglsetorD = $scope.now
			var status = ""
			var status2 = ""
			var ttlSsetor = 0;
			var ttlSsetorD = 0;
			var objKasir = {}
			loadCombo();
			var dataLogin = {};

			var dataLogin2 = {};
			// dataLogin = medifirstService.getUserLogin();
			//loadData();

			dataLogin2 = JSON.parse(window.localStorage.getItem('pegawai'));
			function loadCombo() {
				$scope.listKetSetoran = [{ id: 1, status: 'Belum Setor' }, { id: 2, status: 'Setor' }]
				$scope.listNamabankAccount = [{ "id": "1", "namaExternal": "BRI 001" }, { "id": "2", "namaExternal": "BRI 002" }, { "id": "3", "namaExternal": "BRI 003" }]
				var chacePeriode = cacheHelper.get('SetoranKasirCtrl');
				if (chacePeriode != undefined) {
					var arrPeriode = chacePeriode.split('~');
					$scope.item.tanggalAwal = new Date(arrPeriode[0]);
					$scope.item.tanggalAkhir = new Date(arrPeriode[1]);
					$scope.item.tanggalAwal2 = new Date(arrPeriode[2]);
					$scope.item.tanggalAkhir2 = new Date(arrPeriode[3]);
					$scope.item.tanggalAwal3 = new Date(arrPeriode[4]);
					$scope.item.tanggalAkhir3 = new Date(arrPeriode[5]);
				} else {
					$scope.item.tanggalAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00:00'));
					$scope.item.tanggalAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59:59'));
				}

				medifirstService.get("bendaharapenerimaan/get-data-combo").then(function (e) {
					$scope.listCaraSetor = e.data.carasetor;
					$scope.listNamaKasir = e.data.datakasir;
				});

				medifirstService.get("kasir/get-data-combo-kasir").then(function (dat) {
					$scope.listCaraBayarMain = dat.data.dataCB;
				});

				$scope.listStatus = [{ "id": "1", "namaExternal": "Semua" }, { "id": "2", "namaExternal": "Verifikasi" }, { "id": "3", "namaExternal": "Closing" }]
			}

			$scope.SearchData1 = function () {
				// if ($scope.item.namaKasir == undefined) {
				// 	toastr.error("Kasir belum dipilih");
				// } else {
				status = "-"
				status2 = "-"
				loadData();
				addDataDetail = [];
				addDataDetailD = [];
				// }
			}

			function loadData() {
				$scope.isRouteLoading = true;
				var tglAwal = moment($scope.item.tanggalAwal).format('YYYY-MM-DD HH:mm');
				var tglAkhir = moment($scope.item.tanggalAkhir).format('YYYY-MM-DD HH:mm');

				var chacePeriode = tglAwal + "~" + tglAkhir + "~";
				cacheHelper.set('SetoranKasirCtrl', chacePeriode);
				var Skasir = "";
				if ($scope.item.namaKasir != undefined) {
					Skasir = "&idPegawai=" + $scope.item.namaKasir.id;
				}
				var Setor = ""
				if ($scope.item.KetSetor != undefined) {
					Setor = "&KetSetor=" + $scope.item.KetSetor.id
				}
				var ScaraBayar = "";
				if ($scope.item.caraBayar != undefined) {
					ScaraBayar = "&idCaraBayar=" + $scope.item.caraBayar.id;
				}
				// var isDeposit = ""
				// if ($scope.item.isNotDeposit != undefined) {
				// 	isDeposit = "&isNotDeposit=" + $scope.item.isNotDeposit
				// }
				$q.all([
					medifirstService.get("bendaharapenerimaan/get-daftar-sbm?"
						+ "dateStartTglSbm=" + tglAwal
						+ "&dateEndTglSbm=" + tglAkhir
						+ "" + Skasir + Setor + ScaraBayar
						// + isDeposit
					),
					medifirstService.get("bendaharapenerimaan/get-daftar-sbm-deposit?"
						+ "dateStartTglSbm=" + tglAwal
						+ "&dateEndTglSbm=" + tglAkhir
						+ "" + Skasir + Setor + ScaraBayar
						// + isDeposit
					)
				],
				).then(function (data) {
					if (data[0].statResponse) {
						$scope.isRouteLoading = false;
						var result = data[0].data.data;
						var result2 = data[1].data.data;
						var ttlPasien = 0;
						var ttlKlaim = 0;
						var ttlPasien2 = 0;
						var ttlKlaim2 = 0;
						for (var x = 0; x < result.length; x++) {
							var element = result[x];
							element.tglSbm = moment(result[x].tglSbm).format('DD-MM-YYYY HH:mm');
							if (element.nocm == null) {
								element.nocm = '-'
							}
							if (element.namapasien == null) {
								element.namapasien = '-'
							}
							if (element.namapasien_klien == null) {
								element.namapasien_klien = '-'
							}
							element.namapasien = element.nocm + ' - ' + element.namapasien
							if (element.namaruangan == null) {
								element.namaruangan = "-"
							}
							if (element.noClosing != null) {
								element.status = 'Setor';

							} else {
								element.status = 'Belum Setor';
								element.noClosing = '-';
							}
							ttlPasien = ttlPasien + 1;
							ttlKlaim = ttlKlaim + parseFloat(result[x].totalPenerimaan);
						}

						if (status == "-") {
							$scope.dataSetoranKasir = {
								data: result,
								selectable: true,
								refresh: true,
								pageSize: 10,
								aggregate: [
									{ field: 'totalPenerimaan', aggregate: 'sum' },
								]
							};

							$scope.item.totalSubTotal2 = "Rp. " + parseFloat(ttlKlaim).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
						}

						for (var e = 0; e < result2.length; e++) {
							var element = result2[e];
							element.tglSbm = moment(result2[e].tglSbm).format('DD-MM-YYYY HH:mm');
							if (element.nocm == null) {
								element.nocm = '-'
							}
							if (element.namapasien == null) {
								element.namapasien = '-'
							}
							if (element.namapasien_klien == null) {
								element.namapasien_klien = '-'
							}
							element.namapasien = element.nocm + ' - ' + element.namapasien
							if (element.namaruangan == null) {
								element.namaruangan = "-"
							}
							if (element.noClosing != null) {
								element.status = 'Setor';

							} else {
								element.status = 'Belum Setor';
								element.noClosing = '-';
							}
							ttlPasien2 = ttlPasien2 + 1;
							ttlKlaim2 = ttlKlaim2 + parseInt(result2[e].totalPenerimaan);
						}

						if (status2 == "-") {
							$scope.dataSetoranKasirD = {
								data: result2,
								selectable: true,
								refresh: true,
								pageSize: 10,
								aggregate: [
									{ field: 'totalPenerimaan', aggregate: 'sum' },
								]
							};

							$scope.item.totalSubTotal2D = "Rp. " + parseFloat(ttlKlaim2).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
						}
					};
					Total();
					TotalDeposit();
					loadCombo();
				});
			}

			$scope.add = function () {
				if ($scope.item.jumlah == 0 || $scope.item.jumlah == '') {
					toastr.error('Jumlah tidak boleh kosong')
					return
				}
				if ($scope.item.caraSetor == undefined) {
					toastr.error('Silahkan Pilih Ulang Cara Setor')
					return
				}

				var nomor = 0
				if (addDataDetail.length == 0) {
					nomor = 1
				} else {
					nomor = addDataDetail.length + 1
				}
				var arrayS = {};
				arrayS = {
					no: nomor,
					idCaraBayar: $scope.item.caraBayar.id,
					caraBayar: $scope.item.caraBayar.namaLengkap,
					idCaraSetor: $scope.item.caraSetor.id,
					caraSetor: $scope.item.caraSetor.carasetor,
					// idBankAccount:$scope.item.bankAccount.id,
					// bankAccount:$scope.item.bankAccount.bankAccountNama,
					jumlah: $scope.item.jumlah
				};
				addDataDetail.push(arrayS);
				Total();
				$scope.item.cekSetorAll = false;
				$scope.item.caraSetor = undefined;
				$scope.item.caraBayar = undefined;
			};

			$scope.addD = function () {
				if ($scope.item.jumlahD == 0 || $scope.item.jumlahD == '') {
					toastr.error('Jumlah tidak boleh kosong')
					return
				}

				var nomor = 0
				if (addDataDetailD.length == 0) {
					nomor = 1
				} else {
					nomor = addDataDetailD.length + 1
				}
				var arrayS = {};
				arrayS = {
					no: nomor,
					idCaraBayar: $scope.item.caraBayarD.id,
					caraBayar: $scope.item.caraBayarD.namaLengkap,
					idCaraSetor: $scope.item.caraSetorD.id,
					caraSetor: $scope.item.caraSetorD.carasetor,
					// idBankAccount:$scope.item.bankAccount.id,
					// bankAccount:$scope.item.bankAccount.bankAccountNama,
					jumlah: $scope.item.jumlahD
				};
				addDataDetailD.push(arrayS);
				TotalDeposit();
				$scope.item.cekSetorAllD = false;
				$scope.item.caraBayarD = undefined;
				$scope.item.caraSetorD = undefined;
			};

			$scope.delete = function () {
				if ($scope.dataDetailSelect != undefined) {
					if (addDataDetail.length > 0) {
						for (var i = addDataDetail.length - 1; i >= 0; i--) {
							if (addDataDetail[i].no == $scope.dataDetailSelect.no) {
								addDataDetail.splice(i, 1);
							}
						}
					} else {
						toastr.error('Data sudah di CLosing')
					}
				} else {
					toastr.error('Pilih data detail dulu')
				}
				Total()
			}

			$scope.deleteD = function () {
				if ($scope.dataSelectedCaraBayar2D != undefined) {
					if (addDataDetailD.length > 0) {
						for (var i = addDataDetailD.length - 1; i >= 0; i--) {
							if (addDataDetailD[i].no == $scope.dataSelectedCaraBayar2D.no) {
								addDataDetailD.splice(i, 1);
							}
						}
					} else {
						toastr.error('Data sudah di CLosing')
					}
				} else {
					toastr.error('Pilih data detail dulu')
				}
				TotalDeposit()
			}

			$scope.$watch('item.jumlah', function (newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.item.jumlah < 0) {
						$scope.item.jumlah = "";
					}
				}
			})

			$scope.$watch('item.cekSetorAll', function (newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.item.cekSetorAll) {
						if ($scope.item.caraBayar != undefined) {
							for (var i = 0; i < $scope.dataCaraBayar.length; i++) {
								if ($scope.dataCaraBayar[i].caraBayar == $scope.item.caraBayar.namaLengkap) {
									$scope.item.jumlah = parseFloat($scope.dataCaraBayar[i].totalPenerimaan)
								}
							}
						} else {
							toastr.error('Pilih cara bayar dulu');
							$scope.item.cekSetorAllD = false;

						}
					} else {
						$scope.item.jumlah = '';
					}
				}
			});

			$scope.$watch('item.cekSetorAllD', function (newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.item.cekSetorAllD) {
						if ($scope.item.caraBayarD != undefined) {
							for (var i = 0; i < $scope.dataCaraBayarD.length; i++) {
								if ($scope.dataCaraBayarD[i].caraBayar == $scope.item.caraBayarD.namaLengkap) {
									$scope.item.jumlahD = parseFloat($scope.dataCaraBayarD[i].totalPenerimaan)
								}
							}
						} else {
							toastr.error('Pilih cara bayar dulu');
							$scope.item.cekSetorAll = false;

						}
					} else {
						$scope.item.jumlahD = '';
					}
				}
			})

			$scope.$watch('item.cekSetor100', function (newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.item.cekSetor100) {
						$scope.disabledCaraBayar = true;
						if ($scope.item.caraSetor != undefined) {
							var jumlah = 0;
							for (var i = 0; i < $scope.dataCaraBayar.length; i++) {
								var total = $scope.dataCaraBayar[i].totalPenerimaan
								jumlah = jumlah + total
							}
							$scope.item.jumlah = jumlah;
						} else {
							toastr.error('Pilih cara setor dulu');
							$scope.item.cekSetor100 = false;
							$scope.disabledCaraBayar = false;

						}
					} else {
						$scope.item.jumlah = '';
					}
				}
			})

			$scope.$watch('item.cekSetor100D', function (newValue, oldValue) {
				if (newValue != oldValue) {
					if ($scope.item.cekSetor100D) {
						$scope.disabledCaraBayarD = true;
						if ($scope.item.caraSetorD != undefined) {
							var jumlah = 0;
							for (var i = 0; i < $scope.dataCaraBayarD.length; i++) {
								var total = $scope.dataCaraBayarD[i].totalPenerimaan
								jumlah = jumlah + tota
							}
							$scope.item.jumljumlahDah = jumlah;
						} else {
							toastr.error('Pilih cara setor dulu');
							$scope.item.cekSetor100D = false;
							$scope.disabledCaraBayarD = false;

						}
					} else {
						$scope.item.jumlahD = '';
					}
				}
			})

			$scope.klikDetail = function (dataSelectedCaraBayar2) {
				$scope.dataDetailSelect = dataSelectedCaraBayar2;
			}

			$scope.klikDetailD = function (dataSelectedCaraBayar2D) {
				$scope.dataSelectedCaraBayar2D = dataSelectedCaraBayar2D;
			}

			$scope.klikGridHeadD = function (dataSelectedCaraBayarD) {
				if (dataSelectedCaraBayarD != undefined) {
					$scope.dataSelectedCaraBayarD = dataSelectedCaraBayarD
					$scope.item.caraBayarD = { id: $scope.dataSelectedCaraBayarD.idCaraBayar, namaLengkap: $scope.dataSelectedCaraBayarD.caraBayar }
					$scope.item.caraSetorD = { id: $scope.dataSelectedCaraBayarD.idCaraSetor, carasetor: $scope.dataSelectedCaraBayarD.caraSetor }
					$scope.item.jumlahD = $scope.dataSelectedCaraBayarD.totalPenerimaan;
				}
			}

			$scope.klikGridHead = function (dataSelectedCaraBayar) {
				if (dataSelectedCaraBayar != undefined) {
					$scope.dataSelectedCaraBayar = dataSelectedCaraBayar
					$scope.item.caraBayar = { id: $scope.dataSelectedCaraBayar.idCaraBayar, namaLengkap: $scope.dataSelectedCaraBayar.caraBayar }
					$scope.item.caraSetor = { id: $scope.dataSelectedCaraBayar.idCaraSetor, carasetor: $scope.dataSelectedCaraBayar.caraSetor }
					$scope.item.jumlah = $scope.dataSelectedCaraBayar.totalPenerimaan;
					if ($scope.dataSelectedCaraBayar.caraSetor == undefined) {
						delete $scope.item.caraSetor
					}
				}
			}

			function TotalDeposit() {
				var ttlPasien = 0;
				var ttlKlaim = 0;
				ttlSsetorD = 0;
				var dataDetail = [];
				var dataDetail2 = [];
				var caraBayararr = [];
				var caraBayararr1 = [];
				var adaDetail = 0;
				var jmlSetor = 0;
				var dataResult = [];
				if ($scope.dataSetoranKasirD != undefined) {
					for (let k = 0; k < $scope.dataSetoranKasirD.data.length; k++) {
						const element = $scope.dataSetoranKasirD.data[k];
						dataResult.push(element)
					}

					for (var x = dataResult.length - 1; x >= 0; x--) {
						if (dataResult[x].status == 'Setor') {
							dataResult.splice([x], 1)
						}
					}

					for (var i = 0; i < dataResult.length; i++) {

						ttlPasien = ttlPasien + 1;
						adaDetail = 0

						for (var x = 0; x < dataDetail2.length; x++) {
							if (dataDetail2[x].caraBayar == dataResult[i].caraBayar) {
								dataDetail2[x].totalPenerimaan = parseFloat(dataDetail2[x].totalPenerimaan) + parseFloat(dataResult[i].totalPenerimaan)
								adaDetail = 1;
							}
						};
						if (adaDetail == 0) {
							jmlSetor = 0;
							caraBayararr = { id: dataResult[i].idCaraBayar, namaLengkap: dataResult[i].caraBayar };
							var dataDetail0 = [];
							for (var f = 0; f < addDataDetailD.length; f++) {
								if (dataResult[i].caraBayar == addDataDetailD[f].caraBayar) {
									dataDetail0.push(addDataDetailD[f]);
									jmlSetor += parseFloat(addDataDetailD[f].jumlah);
								};
							}
							if (dataDetail0.length > 0) {
								dataDetail = {
									caraBayar: dataResult[i].caraBayar,
									idCaraBayar: dataResult[i].idCaraBayar,
									totalPenerimaan: dataResult[i].totalPenerimaan,
									totalSetor: jmlSetor,
									sisa: dataResult[i].totalPenerimaan,
									detail: dataDetail0
								};
							} else {
								/*get dari serive*/
								var detailSetorans = [];
								for (var z = 0; z < dataResult[i].details.length; z++) {
									if (dataResult[i].caraBayar == dataResult[i].details[z].carabayar) {
										dataResult[i].details[z].caraBayar = dataResult[i].details[z].carabayar;
										dataResult[i].details[z].caraSetor = dataResult[i].details[z].carasetor;
										detailSetorans.push(dataResult[i].details[z]);
										jmlSetor += parseFloat(dataResult[i].details[z].jumlah);
									};
								}
								dataDetail = {
									caraBayar: dataResult[i].caraBayar,
									idCaraBayar: dataResult[i].idCaraBayar,
									totalPenerimaan: dataResult[i].totalPenerimaan,
									totalSetor: jmlSetor,
									sisa: dataResult[i].totalPenerimaan,
									detail: detailSetorans
								};
								/*end*/
							}

							dataDetail2.push(dataDetail);
							caraBayararr1.push(caraBayararr);
						}
					};

					for (var i = 0; i < dataDetail2.length; i++) {
						dataDetail2[i].sisa = parseFloat(dataDetail2[i].totalPenerimaan) - parseFloat(dataDetail2[i].totalSetor)
						ttlKlaim += parseInt(dataDetail2[i].totalPenerimaan);
						ttlSsetorD += parseInt(dataDetail2[i].totalSetor);
					}
					$scope.dataCaraBayarD = dataDetail2
					$scope.listCaraBayarD = caraBayararr1;
				};
				$scope.item.totalSubTotalD = "Rp. " + parseFloat(ttlKlaim).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
				$scope.item.totalSetoranD = "Rp. " + parseFloat(ttlSsetorD).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
				$scope.item.sisaD = "Rp. " + parseFloat(ttlKlaim - ttlSsetorD).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

				$scope.item.jumlahD = '';
			}

			function Total() {
				var ttlPasien = 0;
				var ttlKlaim = 0;
				ttlSsetor = 0;
				var dataDetail = [];
				var dataDetail2 = [];
				var caraBayararr = [];
				var caraBayararr1 = [];
				var adaDetail = 0;
				var jmlSetor = 0;
				var dataResult = [];
				if ($scope.dataSetoranKasir != undefined) {
					for (let k = 0; k < $scope.dataSetoranKasir.data.length; k++) {
						const element = $scope.dataSetoranKasir.data[k];
						if (element.keterangan != 'Pembayaran Deposit Pasien') {
							dataResult.push(element)
						}
					}

					for (var x = dataResult.length - 1; x >= 0; x--) {
						if (dataResult[x].status == 'Setor') {
							dataResult.splice([x], 1)
						}
					}

					for (var i = 0; i < dataResult.length; i++) {

						ttlPasien = ttlPasien + 1;
						adaDetail = 0

						for (var x = 0; x < dataDetail2.length; x++) {
							if (dataDetail2[x].caraBayar == dataResult[i].caraBayar) {
								dataDetail2[x].totalPenerimaan = parseFloat(dataDetail2[x].totalPenerimaan) + parseFloat(dataResult[i].totalPenerimaan)
								adaDetail = 1;
							}
						};
						if (adaDetail == 0) {
							jmlSetor = 0;
							caraBayararr = { id: dataResult[i].idCaraBayar, namaLengkap: dataResult[i].caraBayar };
							var dataDetail0 = [];
							for (var f = 0; f < addDataDetail.length; f++) {
								if (dataResult[i].caraBayar == addDataDetail[f].caraBayar) {
									dataDetail0.push(addDataDetail[f]);
									jmlSetor += parseFloat(addDataDetail[f].jumlah);
								};
							}
							if (dataDetail0.length > 0) {
								dataDetail = {
									caraBayar: dataResult[i].caraBayar,
									idCaraBayar: dataResult[i].idCaraBayar,
									totalPenerimaan: dataResult[i].totalPenerimaan,
									totalSetor: jmlSetor,
									sisa: dataResult[i].totalPenerimaan,
									detail: dataDetail0
								};
							} else {
								/*get dari serive*/
								var detailSetorans = [];
								for (var z = 0; z < dataResult[i].details.length; z++) {
									if (dataResult[i].caraBayar == dataResult[i].details[z].carabayar) {
										dataResult[i].details[z].caraBayar = dataResult[i].details[z].carabayar;
										dataResult[i].details[z].caraSetor = dataResult[i].details[z].carasetor;
										detailSetorans.push(dataResult[i].details[z]);
										jmlSetor += parseFloat(dataResult[i].details[z].jumlah);
									};
								}
								dataDetail = {
									caraBayar: dataResult[i].caraBayar,
									idCaraBayar: dataResult[i].idCaraBayar,
									totalPenerimaan: dataResult[i].totalPenerimaan,
									totalSetor: jmlSetor,
									sisa: dataResult[i].totalPenerimaan,
									detail: detailSetorans
								};
								/*end*/
							}

							dataDetail2.push(dataDetail);
							caraBayararr1.push(caraBayararr);
						}
					};

					for (var i = 0; i < dataDetail2.length; i++) {
						dataDetail2[i].sisa = parseFloat(dataDetail2[i].totalPenerimaan) - parseFloat(dataDetail2[i].totalSetor)
						ttlKlaim += parseInt(dataDetail2[i].totalPenerimaan);
						ttlSsetor += parseInt(dataDetail2[i].totalSetor);
					}
					$scope.dataCaraBayar = dataDetail2
					$scope.listCaraBayar = caraBayararr1;
				};
				$scope.item.totalSubTotal = "Rp. " + parseFloat(ttlKlaim).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
				$scope.item.totalSetoran = "Rp. " + parseFloat(ttlSsetor).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
				$scope.item.sisa = "Rp. " + parseFloat(ttlKlaim - ttlSsetor).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")

				$scope.item.jumlah = '';
			};
			$scope.Simpan = function () {
				$scope.popUpPasswprd.center().open();
			}
			$scope.savePassword = function () {
				debugger;
				if ($scope.item.password != "karambia") {
					toastr.error("Password Salah!")
					return;
				}
				var a = 0;
				var yeuh = 0;
				var awal = 0;
				debugger;
				var objSave = [];
				var objData = [];
				var objRegis = [];
				var objStr = {};
				var objstr2 = {};
				for (var i = 0; i < $scope.dataCaraBayar.length; i++) {
					for (var j = 0; j < $scope.dataCaraBayar[i].detail.length; j++) {
						objStr = {
							"kdCaraBayar": $scope.dataCaraBayar[i].detail[j].idCaraBayar,
							"totalPenerimaan": $scope.dataCaraBayar[i].detail[j].jumlah,
							"kdAccountBank": $scope.dataCaraBayar[i].detail[j].idBankAccount,
							"idCaraSetor": $scope.dataCaraBayar[i].detail[j].idCaraSetor,

						}
						objData.push(objStr)
					}

				}
				var objSBM = []
				for (let j = 0; j < objData.length; j++) {
					const Datas = objData[j];
					for (let x = 0; x < $scope.dataSetoranKasir.data.length; x++) {
						const element = $scope.dataSetoranKasir.data[x];
						if (element.idCaraBayar == Datas.kdCaraBayar) {
							objSBM.push({
								'norec_sbm': element.noRec,
								'noregistrasi': element.noregistrasi,
								'objectkelompokpasienlastfk': element.objectkelompokpasienlastfk
							})
						}
					}
				}

				var tgl = moment($scope.item.tanggalAwal).format('YYYY-MM-DD')
				var tglAwal = moment($scope.item.tanggalAwal).format('YYYY-MM-DD HH:mm')
				var tglAkhir = moment($scope.item.tanggalAkhir).format('YYYY-MM-DD HH:mm')
				var tglSetor = moment($scope.item.tglsetor).format('YYYY-MM-DD HH:mm')
				objSave = {
					"tglPenerimaan": tgl,
					"tglAwal": tglAwal,
					"tglAkhir": tglAkhir,
					"tglsetor": tglSetor,
					"kdPegawai": $scope.item.namaKasir != undefined ? $scope.item.namaKasir.id : $scope.dataLogin.id,
					"kdPegawaiLu": $scope.item.namaKasir != undefined ? $scope.item.namaKasir.luid : $scope.dataLogin.id,
					"totalSetoran": ttlSsetor,
					"detailSetoran": objData,
					"detailSBM": objSBM
				}
				medifirstService.post('bendaharapenerimaan/setoran-kasir', objSave).then(function () {
					debugger;
					var data = {
						'tglAwal': tglAwal,
						'tglAkhir': tglAkhir,
						'idKasir': $scope.item.namaKasir ? $scope.item.namaKasir.id : $scope.dataLogin.id,
					}
					for (let i = 0; i < objSBM.length; i++) {
						var aya = 1;
						if (objSBM[i].noregistrasi != null) {
							for (let r = 0; r < objRegis.length; r++) {
								if (objSBM[i].noregistrasi == objRegis[r].noregistrasi) {
									var aya = 0;
								}
							}
							if (aya == 1) {
								objstr2 = {
									"noregistrasi": objSBM[i].noregistrasi,
									"objectkelompokpasienlastfk": objSBM[i].objectkelompokpasienlastfk,
								}
								objRegis.push(objstr2)
							}

						}
					}
					// for (let i = 0; i < objSBM.length; i++) {
					// 	if(objSBM[i].noregistrasi != null){	
					// 	 	var json = {
					//             'noregistrasi': objSBM[i].noregistrasi,
					//             'close': true
					//          }					
					//             medifirstService.post('tatarekening/save-selesai-transaksi', json).then(function (e) {

					//     		})
					// 	}
					// }
					// for (let i = 0; i < objSBM.length; i++) {
					// 	if(objSBM[i].noregistrasi != null){
					// 		var tglclosing = new Date();
					//            tglclosing =  moment(tglclosing).format('YYYY-MM-DD HH:mm:ss');
					//            var objverif = {
					//                        "tglclosing" : tglSetor,
					//                        // "tglnk": tglnk, 
					//                        "pegawaiverif": dataLogin2.id,
					//                        "noregistrasi": objSBM[i].noregistrasi
					//                };

					// 	    // var objverif = {
					//      //                 "pegawaiverif": dataLogin.id,
					//      //                 "noregistrasi": $scope.dataSelected.noregistrasi
					//      //           };

					//          	medifirstService.post('remunerasi/delete-jasapelayanandokter',objverif).then(function(e){
					//                   // LoadData();          
					//             })
					//            medifirstService.post('remunerasi/save-jasapelayanandokter',objverif).then(function(e){     

					//            })   

					// 	}

					// }
					var totalnoregis = 0;
					for (let i = 0; i < objRegis.length; i++) {
						if (objRegis[i].noregistrasi != null && objRegis[i].objectkelompokpasienlastfk == 1) {
							totalnoregis = totalnoregis + 1;
						}
					}
					for (let i = 0; i < objRegis.length; i++) {
						if (objRegis[i].noregistrasi != null && objRegis[i].objectkelompokpasienlastfk == 1) {
							var tglclosing = new Date();
							tglclosing = moment(tglclosing).format('YYYY-MM-DD HH:mm:ss');
							var objverif = {
								"tglclosing": tglSetor,
								// "tglnk": tglnk, 
								"pegawaiverif": dataLogin2.id,
								"noregistrasi": objRegis[i].noregistrasi
							};

							// var objverif = {
							//                 "pegawaiverif": dataLogin.id,
							//                 "noregistrasi": $scope.dataSelected.noregistrasi
							//           };
							yeuh = a;
							awal = a;
							var lengthakhir = totalnoregis;
							var lop = true;
							// medifirstService.post('remunerasi/delete-jasapelayanandokter',objverif).then(function(e){
							// 	debugger;
							//     var tglclosing = new Date();
							// tglclosing =  moment(tglclosing).format('YYYY-MM-DD HH:mm:ss');
							// var objverif = {
							//             "tglclosing" : tglSetor,
							//             // "tglnk": tglnk, 
							//             "pegawaiverif": dataLogin2.id,
							//             "noregistrasi": e.data[0].noRegistrasi
							//     };

							// var objverif = {
							//                 "pegawaiverif": dataLogin.id,
							//                 "noregistrasi": $scope.dataSelected.noregistrasi
							//           };


							medifirstService.post('remunerasi/save-jasapelayanandokterdeletinsert', objverif).then(function (e) {
								yeuh = yeuh + 1;
								var ini = (yeuh / lengthakhir) * 100;
								var elem = document.getElementById("myBar");
								var width = 0;
								awal = awal + 1;
								var id = setInterval(frame, 1);
								function frame() {
									if (width >= ini) {
										clearInterval(id);
									} else {
										width++;
										elem.style.width = width + "%";
										elem.innerHTML = width + "%";
									}
								}
							})
							// })


						}

					}

					// yeuh =a;
					//             awal =a;
					// var lengthakhir = totalnoregis;
					//             var lop = true;
					// for (let i = 0; i < objSBM.length; i++) {
					// 	if(objSBM[i].noregistrasi != null){
					// 		var tglclosing = new Date();
					//            tglclosing =  moment(tglclosing).format('YYYY-MM-DD HH:mm:ss');
					//            var objverif = {
					//                        "tglclosing" : tglSetor,
					//                        // "tglnk": tglnk, 
					//                        "pegawaiverif": dataLogin2.id,
					//                        "noregistrasi": objSBM[i].noregistrasi
					//                };

					// 	    // var objverif = {
					//      //                 "pegawaiverif": dataLogin.id,
					//      //                 "noregistrasi": $scope.dataSelected.noregistrasi
					//      //           };


					//            medifirstService.post('remunerasi/save-jasapelayanandokter',objverif).then(function(e){     
					//            		yeuh =yeuh+1;
					//                       var ini = (yeuh/lengthakhir)*100;
					//                       var elem = document.getElementById("myBar");
					//                       var width = 0;
					//                       awal = awal +1;
					//                       var id = setInterval(frame, 1);
					//                       function frame() {
					//                           if (width >= ini) {
					//                               clearInterval(id);
					//                           } else {
					//                               width++;
					//                               elem.style.width = width + "%";
					//                               elem.innerHTML = width + "%";
					//                           }
					//                       }
					//            })   

					// 	}

					// }

					for (let i = 0; i < objSBM.length; i++) {
						if (objSBM[i].noregistrasi != null) {
							var json = {
								'noregistrasi': objSBM[i].noregistrasi,
								'close': true
							}
							medifirstService.post('tatarekening/save-log-closing', json).then(function (e) {

							})
						}


					}
					// medifirstService.post('sysadmin/general/save-jurnal-setorankasir', data).then(function (e) {})
					loadData();
					$scope.popUpPasswprd.close();
					$scope.item.password = "";
				})
			};

			$scope.SimpanD = function () {
				var objSave = [];
				var objData = [];
				var objStr = {};
				for (var i = 0; i < $scope.dataCaraBayarD.length; i++) {
					for (var j = 0; j < $scope.dataCaraBayarD[i].detail.length; j++) {
						objStr = {
							"kdCaraBayar": $scope.dataCaraBayarD[i].detail[j].idCaraBayar,
							"totalPenerimaan": $scope.dataCaraBayarD[i].detail[j].jumlah,
							"kdAccountBank": $scope.dataCaraBayarD[i].detail[j].idBankAccount,
							"idCaraSetor": $scope.dataCaraBayarD[i].detail[j].idCaraSetor,

						}
						objData.push(objStr)
					}

				}
				var objSBM = []
				for (let j = 0; j < objData.length; j++) {
					const Datas = objData[j];
					for (let x = 0; x < $scope.dataSetoranKasirD.data.length; x++) {
						const element = $scope.dataSetoranKasirD.data[x];
						if (element.idCaraBayar == Datas.kdCaraBayar) {
							objSBM.push({ 'norec_sbm': element.noRec })
						}
					}
				}

				var tgl = moment($scope.item.tanggalAwal).format('YYYY-MM-DD')
				var tglAwal = moment($scope.item.tanggalAwal).format('YYYY-MM-DD HH:mm')
				var tglAkhir = moment($scope.item.tanggalAkhir).format('YYYY-MM-DD HH:mm')
				var tglSetor = moment($scope.item.tglsetorD).format('YYYY-MM-DD HH:mm')
				objSave = {
					"tglPenerimaan": tgl,
					"tglAwal": tglAwal,
					"tglAkhir": tglAkhir,
					"tglsetor": tglSetor,
					"kdPegawai": $scope.item.namaKasir != undefined ? $scope.item.namaKasir.id : $scope.dataLogin.id,
					"kdPegawaiLu": $scope.item.namaKasir != undefined ? $scope.item.namaKasir.luid : $scope.dataLogin.id,
					"totalSetoran": ttlSsetor,
					"detailSetoran": objData,
					"detailSBM": objSBM
				}
				medifirstService.post('bendaharapenerimaan/setoran-kasir-deposit', objSave).then(function () {
					var data = {
						'tglAwal': tglAwal,
						'tglAkhir': tglAkhir,
						'idKasir': $scope.item.namaKasir ? $scope.item.namaKasir.id : $scope.dataLogin.id,
					}
					// medifirstService.post('sysadmin/general/save-jurnal-setorankasir', data).then(function (e) {})
					loadData();
				})
			};

			$scope.columnSetoranKasir = {
				columns: [
					{
						"field": "noSbm",
						"title": "NoSbm",
						"template": "<span class='style-center'>#: noSbm #</span>",
						"width": "60px"
					},
					{
						"field": "namaruangan",
						"title": "Nama Ruangan",
						"template": "<span class='style-left'>#: namaruangan #</span>",
						"width": "100px"
					},
					{
						"field": "tglSbm",
						"title": "Tanggal",
						"template": "<span class='style-center'>#: tglSbm #</span>",
						"width": "50px"
					},
					{
						"field": "namapasien",
						"title": "Nama",
						"template": "<span class='style-left'>#: namapasien #</span>",
						"width": "80px"
					},
					{
						"field": "namapasien_klien",
						"title": "Deskripsi",
						"template": "<span class='style-left'>#: namapasien_klien #</span>",
						"width": "70px"
					},
					{
						"field": "keterangan",
						"title": "Keterangan",
						"template": "<span class='style-left'>#: keterangan #</span>",
						"width": "80px"
					},
					{
						"field": "caraBayar",
						"title": "Cara Bayar",
						"template": "<span class='style-center'>#: caraBayar #</span>",
						"width": "70px",
						// footerTemplate:"<span>Sub Total :</span>",
					},
					{
						"field": "totalPenerimaan",
						"title": "Total Penerimaan",
						"template": "<span class='style-right'>{{formatRupiah('#: totalPenerimaan #', 'Rp.')}}</span>",
						"width": "100px",

						// footerTemplate:"<span>Rp. {{formatRupiah('#:totalPenerimaan.sum  #', '')}}</span>",
						// aggregates:["sum"]

					},
					{
						"field": "namaPenerima",
						"title": "Kasir",
						"template": "<span class='style-center'>#: namaPenerima #</span>",
						"width": "80px"
					},
					{
						"field": "status",
						"title": "Status",
						"template": "<span class='style-center'>#: status #</span>",
						"width": "50px"
					},
					// {
					// 	"field": "noClosing",
					// 	"title": "No Closing",
					// 	"template": "<span class='style-center'>#: noClosing #</span>",
					// 	"width":"50px"
					// }
				],
				sortable: {
					mode: "single",
					allowUnsort: false,
				}
				,
				pageable: {
					messages: {
						// display: "Menampilkan {2} data"
						display: "Menampilkan {0} - {1} data dari {2} data"
					}
				},
			};

			$scope.columnSetoranKasirD = {
				columns: [
					{
						"field": "noSbm",
						"title": "NoSbm",
						"template": "<span class='style-center'>#: noSbm #</span>",
						"width": "60px"
					},
					{
						"field": "namaruangan",
						"title": "Nama Ruangan",
						"template": "<span class='style-left'>#: namaruangan #</span>",
						"width": "100px"
					},
					{
						"field": "tglSbm",
						"title": "Tanggal",
						"template": "<span class='style-center'>#: tglSbm #</span>",
						"width": "50px"
					},
					{
						"field": "namapasien",
						"title": "Nama",
						"template": "<span class='style-left'>#: namapasien #</span>",
						"width": "80px"
					},
					{
						"field": "namapasien_klien",
						"title": "Deskripsi",
						"template": "<span class='style-left'>#: namapasien_klien #</span>",
						"width": "70px"
					},
					{
						"field": "keterangan",
						"title": "Keterangan",
						"template": "<span class='style-left'>#: keterangan #</span>",
						"width": "80px"
					},
					{
						"field": "caraBayar",
						"title": "Cara Bayar",
						"template": "<span class='style-center'>#: caraBayar #</span>",
						"width": "70px",
						// footerTemplate:"<span>Sub Total :</span>",
					},
					{
						"field": "totalPenerimaan",
						"title": "Total Penerimaan",
						"template": "<span class='style-right'>{{formatRupiah('#: totalPenerimaan #', 'Rp.')}}</span>",
						"width": "100px",

						// footerTemplate:"<span>Rp. {{formatRupiah('#:totalPenerimaan.sum  #', '')}}</span>",
						// aggregates:["sum"]

					},
					{
						"field": "namaPenerima",
						"title": "Kasir",
						"template": "<span class='style-center'>#: namaPenerima #</span>",
						"width": "80px"
					},
					{
						"field": "status",
						"title": "Status",
						"template": "<span class='style-center'>#: status #</span>",
						"width": "50px"
					},
					// {
					// 	"field": "noClosing",
					// 	"title": "No Closing",
					// 	"template": "<span class='style-center'>#: noClosing #</span>",
					// 	"width":"50px"
					// }
				],
				sortable: {
					mode: "single",
					allowUnsort: false,
				}
				,
				pageable: {
					messages: {
						// display: "Menampilkan {2} data"
						display: "Menampilkan {0} - {1} data dari {2} data"
					}
				},
			};

			$scope.columnCaraBayar = [
				{
					"field": "caraBayar",
					"title": "Cara Bayar"
				},
				{
					"field": "totalPenerimaan",
					"title": "Total Penerimaan",
					"template": "<span class='style-right'>{{formatRupiah('#: totalPenerimaan #', 'Rp.')}}</span>",

				},
				{
					"field": "totalSetor",
					"title": "Total Setor",
					"template": "<span class='style-right'>{{formatRupiah('#: totalSetor #', 'Rp.')}}</span>",
				},
				{
					"field": "sisa",
					"title": "Sisa",
					"template": "<span class='style-right'>{{formatRupiah('#: sisa #', 'Rp.')}}</span>",
				}

			];

			$scope.columnCaraBayarD = [
				{
					"field": "caraBayar",
					"title": "Cara Bayar"
				},
				{
					"field": "totalPenerimaan",
					"title": "Total Penerimaan",
					"template": "<span class='style-right'>{{formatRupiah('#: totalPenerimaan #', 'Rp.')}}</span>",

				},
				{
					"field": "totalSetor",
					"title": "Total Setor",
					"template": "<span class='style-right'>{{formatRupiah('#: totalSetor #', 'Rp.')}}</span>",
				},
				{
					"field": "sisa",
					"title": "Sisa",
					"template": "<span class='style-right'>{{formatRupiah('#: sisa #', 'Rp.')}}</span>",
				}

			];

			$scope.formatRupiah = function (value, currency) {
				if (value == "null")
					value = 0
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
			}

			$scope.dataCaraBayar2 = function (dataItem) {
				return {
					dataSource: new kendo.data.DataSource({
						data: dataItem.detail
					}),
					columns: [
						{
							"field": "no",
							"title": "No",
							"width": "15px",
							"hidden": true
						},
						{
							"field": "caraBayar",
							"title": "Cara Bayar",
							"width": "100px"
						},
						{
							"field": "caraSetor",
							"title": "Cara Setor",
							"width": "100px"
							//,"template": "<input kendo-combo-box k-ng-model='dataModelGrid[#: id #].NamabankAccount' k-data-text-field=\"'namaExternal'\" k-data-value-field=\"'id'\" k-filter=\"'contains'\" k-auto-bind='false' k-data-source='listNamabankAccount' />"
						},
						{
							"field": "jumlah",
							"title": "Total Setor",
							"width": "100px",
							"template": "<span class='style-right'>{{formatRupiah('#: jumlah #', 'Rp.')}}</span>",

							//,"template": "<input c-text-box type='input' ng-model='dataModelGrid[#: id #].total' filter='numeric' class='k-textbox'  style='text-align: right;'/>"
						},
						{
							"field": "pegawaipenerima",
							"title": "Penerima",
							"width": "100px"
						}
					]
				}
			};

			$scope.formatRupiah = function (value, currency) {
				return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
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
				$scope.pegawai = JSON.parse(window.localStorage.getItem('pegawai'));
				var Skasir = "";
				if ($scope.item.namaKasir != undefined) {
					Skasir = $scope.item.namaKasir.id;
					var tglAwal = moment($scope.item.tanggalAwal).format('YYYY-MM-DD HH:mm');
					var tglAkhir = moment($scope.item.tanggalAkhir).format('YYYY-MM-DD HH:mm');
					//cetakan langsung service VB6 by grh
					var client = new HttpClient();
					client.get('http://127.0.0.1:1237/printvb/kasir?cetak-setoranKasir=1&tglAwal=' + tglAwal
						+ '&tglAkhir=' + tglAkhir + '&kasirId=' + Skasir + '&strIdPegawai=' + $scope.pegawai.namaLengkap + '&view=true', function (response) {
						})
				}
			}

			$scope.BatalSetor = function () {
				var tgl = moment($scope.item.tanggalAwal).format('YYYY-MM-DD')
				var tglAwal = moment($scope.item.tanggalAwal).format('YYYY-MM-DD HH:mm')
				var tglAkhir = moment($scope.item.tanggalAkhir).format('YYYY-MM-DD HH:mm')
				// var objSave = {
				// 	"tglAwal": tglAwal,
				// 	"tglAkhir": tglAkhir,
				// 	"kdPegawai": $scope.item.namaKasir.id,
				// 	"kdPegawaiLu": $scope.item.namaKasir.luid,
				// }
				var total = 0
				var objSbm = []
				if ($scope.dataSetoranKasir == undefined) {
					toastr.error('Belum ada data yang di setor')
					return
				}
				for (let i = 0; i < $scope.dataSetoranKasir.data.length; i++) {
					const element = $scope.dataSetoranKasir.data[i];
					if (element.tglverifbendahara != null) {
						toastr.error('Setoran Sudah Diverifikasi Bendahara, Tidak Bisa Batal setor')
						return
					}
					if (element.status == 'Setor') {
						total = total + parseFloat(element.totalPenerimaan)
						objSbm.push({
							'norec_sbm': element.noRec,
							'noclosing': element.noClosing
						})
					}
				}
				if (objSbm.length == 0) {
					toastr.error('Belum ada data yang di setor')
					return
				}
				total = "Rp. " + parseFloat(total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
				var objSaveNew = {
					"details": objSbm
				}
				var stt = '';
				if (confirm('Yakin Mau Batal Setor Sejumlah : ' + total + ' ?')) {
					stt = 'true';
				} else {
					return;
				}
				medifirstService.post('bendaharapenerimaan/batal-setoran-kasir',
					objSaveNew
					// objSave
				).then(function () {
					var data = $scope.dataSetoranKasir.data
					var listNoClos = ""
					if (data.length != 0) {
						var a = ""
						var b = ""
						for (var i = data.length - 1; i >= 0; i--) {
							var c = data[i].noClosing
							b = "," + c
							a = a + b
						}
						listNoClos = a.slice(1, a.length)
					}
					var objBatal = {
						'noclosing': listNoClos
					}
					// medifirstService.get('sysadmin/general/hapus-jurnal-setorankasir', objBatal).then(function () { })
					loadData();
				})
			}

			$scope.BatalSetorD = function () {
				var tgl = moment($scope.item.tanggalAwal).format('YYYY-MM-DD')
				var tglAwal = moment($scope.item.tanggalAwal).format('YYYY-MM-DD HH:mm')
				var tglAkhir = moment($scope.item.tanggalAkhir).format('YYYY-MM-DD HH:mm')
				// var objSave = {
				// 	"tglAwal": tglAwal,
				// 	"tglAkhir": tglAkhir,
				// 	"kdPegawai": $scope.item.namaKasir.id,
				// 	"kdPegawaiLu": $scope.item.namaKasir.luid,
				// }
				var total = 0
				var objSbm = []
				if ($scope.dataSetoranKasirD == undefined) {
					toastr.error('Belum ada data yang di setor')
					return
				}
				for (let i = 0; i < $scope.dataSetoranKasirD.data.length; i++) {
					const element = $scope.dataSetoranKasirD.data[i];
					if (element.status == 'Setor') {
						total = total + parseFloat(element.totalPenerimaan)
						objSbm.push({
							'norec_sbm': element.noRec,
							'noclosing': element.noClosing
						})
					}
				}
				if (objSbm.length == 0) {
					toastr.error('Belum ada data yang di setor')
					return
				}
				total = "Rp. " + parseFloat(total).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
				var objSaveNew = {
					"details": objSbm
				}
				var stt = '';
				if (confirm('Yakin Mau Batal Setor Sejumlah : ' + total + ' ?')) {
					stt = 'true';
				} else {
					return;
				}
				medifirstService.post('bendaharapenerimaan/batal-setoran-kasir',
					objSaveNew
					// objSave
				).then(function () {
					var data = $scope.dataSetoranKasirD.data
					var listNoClos = ""
					if (data.length != 0) {
						var a = ""
						var b = ""
						for (var i = data.length - 1; i >= 0; i--) {
							var c = data[i].noClosing
							b = "," + c
							a = a + b
						}
						listNoClos = a.slice(1, a.length)
					}
					var objBatal = {
						'noclosing': listNoClos
					}
					// medifirstService.get('sysadmin/general/hapus-jurnal-setorankasir', objBatal).then(function () { })
					loadData();
				})
			}

			$scope.CetakLaporanPenerimaanHarian = function () {
				var Sins = ''
				var dokter = ''
				if ($scope.item.namaPegawai != undefined) {
					dokter = $scope.item.namaPegawai.id
				}
				var ruanganId = ''
				if ($scope.item.ruangan != undefined) {
					ruanganId = $scope.item.ruangan.id
				}
				var idPegawai = ''
				if ($scope.item.namaKasir != undefined) {
					idPegawai = $scope.item.namaKasir.id
				}
				var tglAwal = moment($scope.item.tanggalAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.tanggalAkhir).format('YYYY-MM-DD HH:mm:ss');
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-kasir-lama=' + $scope.dataLogin.namaLengkap + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idPegawai=' + idPegawai + '&idDept=' + Sins + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&view=true', function (response) {
				});
				// client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-kasir-lama=' + $scope.dataLogin.namaLengkap + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idPegawai=' + idPegawai + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&view=true', function (response) {
				// });
			}
			$scope.CetakLaporanPenerimaanHarianMondok = function () {
				var Sins = ''
				var dokter = ''
				if ($scope.item.namaPegawai != undefined) {
					dokter = $scope.item.namaPegawai.id
				}
				var ruanganId = ''
				if ($scope.item.ruangan != undefined) {
					ruanganId = $scope.item.ruangan.id
				}
				var idPegawai = ''
				if ($scope.item.namaKasir != undefined) {
					idPegawai = $scope.item.namaKasir.id
				}
				var tglAwal = moment($scope.item.tanggalAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.tanggalAkhir).format('YYYY-MM-DD HH:mm:ss');
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-kasir-lamamondok=' + $scope.dataLogin.namaLengkap + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idPegawai=' + idPegawai + '&idDept=' + Sins + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&view=true', function (response) {
				});
				// client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-kasir-lama=' + $scope.dataLogin.namaLengkap + '&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idPegawai=' + idPegawai + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&view=true', function (response) {
				// });
			}

			$scope.CetaklapPenerimaanPertransaksi = function () {
				var dokter = ''
				if ($scope.item.namaPegawai != undefined) {
					dokter = $scope.item.namaPegawai.id
				}
				var ruanganId = ''
				if ($scope.item.ruangan != undefined) {
					ruanganId = $scope.item.ruangan.id
				}

				var kasirId = ''
				if ($scope.item.namaKasir != undefined) {
					kasirId = $scope.item.namaKasir.id
				}
				var tglAwal = moment($scope.item.tanggalAwal).format('YYYY-MM-DD HH:mm:ss');
				var tglAkhir = moment($scope.item.tanggalAkhir).format('YYYY-MM-DD HH:mm:ss');;
				var client = new HttpClient();
				client.get('http://127.0.0.1:1237/printvb/kasir?cetak-laporan-penerimaan-pertransaksi=' + kasirId +
					'&tglAwal=' + tglAwal + '&tglAkhir=' + tglAkhir + '&idRuangan=' + ruanganId + '&idDokter=' + dokter + '&strIdPegawai=' + $scope.dataLogin.namaLengkap + '&view=true', function (response) {

					});
			}
			///////////////////////////// -TAMAT- ///////////////////////////
		}
	]);
});