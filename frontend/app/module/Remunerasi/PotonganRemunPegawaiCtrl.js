define(['initialize'], function (initialize) {
    'use strict';
    // initialize.controller('KonversiSatuanCtrl', ['$q', '$rootScope', '$scope', 'manageTataRekening','$state','CacheHelper',
    initialize.controller('PotonganRemunPegawaiCtrl', ['$scope', 'MedifirstService','$timeout',
        function ($scope, medifirstService,$timeout) {
            $scope.item = {};
            $scope.dataVOloaded = true;
            $scope.now = new Date();
            var IDPEGAWAIKEPILIH = 0;
            var idpot = '';
            var dataLoadKeGridPegawaiHasilFilterBerdasarkanFilterBy = [];
            var dataLoadKeGridPegawaiHasilFilterBerdasarkanFilterByKlikGrid = [];

            $scope.item.filterBy = 1

           
            $scope.listDataFilterBy = [
                { id: 1, name: 'namakaryawan', desc: 'Nama' },
                { id: 2, name: 'jabatan', desc: 'Jabatan' },
                { id: 3, name: 'unitbagianinstalasi', desc: 'Bagian' },
                { id: 4, name: 'golongan', desc: 'Golongan' }
            ]
            $scope.Cari = function () {
                var jenispaguid = "&jenispagufk=-"
                if ($scope.item.jenisPagu != undefined) {
                    jenispaguid = "&jenispagufk=" + $scope.item.jenisPagu.id
                }
                var nilai = $scope.item.filterBy.toString()
                var filterBy = $scope.listDataFilterBy[nilai - 1].name
                var namadesc = ''
                if ($scope.item.nama != undefined) {
                    namadesc = $scope.item.nama
                }
                medifirstService.get("remunerasi/get-list-pegawai?field=" + filterBy + "&teks=" + namadesc +
                    jenispaguid
                    , true).then(function (dat) {
                        var data = dat.data.data
                        for (var i = 0; i < data.length; i++) {
                            data[i].no = i + 1
                        }
                        dataLoadKeGridPegawaiHasilFilterBerdasarkanFilterBy = data
                        $scope.dataGrid = dat.data.data;

                    })

                medifirstService.get("remunerasi/get-detail-pot-remun?pegawaifk=", true).then(function (ee) {
                    for (let i = 0; i < ee.data.data.length; i++) {
                        //    const element = array[i];
                        ee.data.data[i].no = i + 1
                    }
                    $scope.dataGridMap = ee.data.data
                })
            }
            Init();
            var timeoutPromise;
            $scope.$watch('item.filterNama', function (newVal, oldVal) {
                if (!newVal) return;
                $timeout.cancel(timeoutPromise);
                timeoutPromise = $timeout(function () {
                    if (newVal && newVal !== oldVal) {
                        applyFilter("namalengkap", newVal);
                    }
                }, 500)
            });

            function applyFilter(filterField, filterValue) {
				var dataGrid = $("#kGrid2").data("kendoGrid");
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
				var dataGrid = $("#kGrid2").data("kendoGrid");
				dataGrid.dataSource.filter({});
				$scope.item = {};
			}
            function Init() {

                $scope.item.potpersen = 0
                $scope.item.remunfix = 0
                medifirstService.get("remunerasi/get-data-combo", true).then(function (dat) {
                    $scope.listJenisPagu = dat.data.data

                })
                $scope.Cari()

            }

            $scope.klikGridMap = function (dataSelectedMap) {
                $scope.item.jenisPagu = { id: dataSelectedMap.jpid, jenispagu: dataSelectedMap.jenispagu }
                $scope.listDetailJenisPagu = [{ id: dataSelectedMap.objectdetailjenispagufk, detailjenispagu: dataSelectedMap.detailjenispagu }]
                $scope.item.detailjenispagu = { id: dataSelectedMap.objectdetailjenispagufk, detailjenispagu: dataSelectedMap.detailjenispagu }
                $scope.item.potpersen = dataSelectedMap.potpersen
                $scope.item.remunfix = dataSelectedMap.remunfixed
                idpot = dataSelectedMap.id
                var dtdt = { id: dataSelectedMap.jpid }
                TRalalaGetPegwaiPerJenisPagu(dtdt)

            }
            function KlikProduk() {
                // idProduk=$scope.dataSelectedProduk.id;
                // manageTataRekening.getDataTableTransaksi("logistik/get-konversi-satuan?produkfk="+idProduk, true).then(function(dat){
                //     for (var i = 0; i < dat.data.length; i++) {
                //         dat.data[i].no = i+1
                //         $scope.item.satuanstandar_asal = {id:dat.data[i].ssidasal,satuanstandar:dat.data[i].satuanstandar_asal}
                //     }
                //     $scope.dataGrid = dat.data;

                // });
                // kosong();
            }
            $scope.klikGrid = function (dataSelected) {
                IDPEGAWAIKEPILIH = dataSelected.idpegawai
                medifirstService.get("remunerasi/get-detail-pot-remun?pegawaifk=" + dataSelected.idpegawai, true).then(function (dat) {
                    for (let i = 0; i < dat.data.data.length; i++) {
                        //    const element = array[i];
                        dat.data.data[i].no = i + 1
                    }
                    $scope.dataGridMap = dat.data.data
                })
                // dataLoadKeGridPegawaiHasilFilterBerdasarkanFilterByKlikGrid =[dataSelected] 
                // $scope.item.satuanstandar_asal = {id:dataSelected.ssidasal,satuanstandar:dataSelected.satuanstandar_asal}
                // $scope.item.satuanstandar_tujuan = {id:dataSelected.ssidtujuan,satuanstandar:dataSelected.satuanstandar_tujuan}
                // $scope.item.nilaikonversi = dataSelected.nilaikonversi
                // $scope.item.norec = dataSelected.norec
            }

            $scope.tambahData = function () {
                if ($scope.item.jenisPagu == undefined) {
                    alert('Pilih jenis pagu!')
                    return;
                }
                var djpid = ''
                if ($scope.item.detailjenispagu != undefined) {
                    djpid = $scope.item.detailjenispagu.id
                }
                var objSave =
                {
                    data: dataLoadKeGridPegawaiHasilFilterBerdasarkanFilterByKlikGrid,
                    jenispaguid: $scope.item.jenisPagu.id,
                    detailjenispaguid: djpid
                }

                medifirstService.post('remunerasi/save-map-jenis-pagu-topegawai', objSave).then(function (e) {
                    TRalalaGetPegwaiPerDetailJenisPagu({ jpid: $scope.item.jenisPagu.id, djpid: djpid })
                })

            }
            $scope.savePot = function (method) {
                // if ($scope.item.jenisPagu == undefined) {
                //     alert('Pilih jenis pagu!')
                //     return;
                // }
                // if ($scope.item.detailjenispagu == undefined) {
                //     alert('Pilih jenis detailjenispagu!')
                //     return;
                // }
                if (method == 'delete' && idpot == '') {
                    alert('Pilih yang mau dihapus!')
                    return;
                }
                var potpersen = ''
                if ($scope.item.potpersen != undefined) {
                    potpersen = $scope.item.potpersen
                }
                var fixedremun = ''
                if ($scope.item.remunfix != undefined) {
                    fixedremun = $scope.item.remunfix
                }
                if (IDPEGAWAIKEPILIH == 0 && method != 'delete' ) {
                    alert('Pilih pegawai!')
                    return;
                }
                var objSave =
                {
                    idpot: idpot,
                    objectpegawaifk: IDPEGAWAIKEPILIH,
                    potpersen: potpersen,
                    remunfixed: fixedremun,
                    objectjenispagufk: $scope.item.jenisPagu != undefined ? $scope.item.jenisPagu.id : null,
                    objectdetailjenispagufk: $scope.item.detailjenispagu != undefined ? $scope.item.jenisPagu.id : null,
                    method: method
                }

                medifirstService.post('remunerasi/save-potongan-remun', objSave).then(function (e) {
                    medifirstService.get("remunerasi/get-detail-pot-remun?pegawaifk=" + IDPEGAWAIKEPILIH, true).then(function (dat) {
                        $scope.dataGridMap = dat.data.data
                    })
                    idpot = ''
                    $scope.item.potpersen = 0
                    $scope.item.remunfix = 0
                    // TRalalaGetPegwaiPerDetailJenisPagu({jpid:$scope.item.jenisPagu.id,djpid:djpid})
                })

            }

            $scope.formatTanggal = function (tanggal) {
                return moment(tanggal).format('DD-MMM-YYYY');
            }

            $scope.kosongkan = function () {
                kosong();
            }
            $scope.getPegawaiPerJenisPagu = function (data) {
                TRalalaGetPegwaiPerJenisPagu(data)
            }
            function TRalalaGetPegwaiPerJenisPagu(dat) {
                // remunerasi/get-list-pegawai-perjenispagu
                medifirstService.get("remunerasi/get-list-pegawai-perjenispagu?jpid=" + dat.id, true).then(function (dat) {
                    // var data2 = dat.data.data
                    // for (var i = 0; i < data2.length; i++) {
                    //     data2[i].no=i+1
                    // }
                    // $scope.dataGridMap = data2
                    $scope.listDetailJenisPagu = dat.data.detailjenispagu

                })
            }
            $scope.getPegawaiPerDetailJenisPagu = function (dat) {
                TRalalaGetPegwaiPerDetailJenisPagu({ jpid: $scope.item.jenisPagu.id, djpid: $scope.item.detailjenispagu.id })
            }
            function TRalalaGetPegwaiPerDetailJenisPagu(dat) {
                medifirstService.get("remunerasi/get-list-pegawai-perdetailjenispagu?jpid=" + dat.jpid + "&djpid=" + dat.djpid, true).then(function (dat) {
                    var data2 = dat.data.data
                    for (var i = 0; i < data2.length; i++) {
                        data2[i].no = i + 1
                    }
                    $scope.dataGridMap = data2
                    // $scope.listDetailJenisPagu = dat.data.detailjenispagu

                })
            }
            $scope.tambahDataAll = function () {
                if ($scope.item.jenisPagu == undefined) {
                    alert('Pilih jenis pagu!')
                    return;
                }
                var djpid = ''
                if ($scope.item.detailjenispagu != undefined) {
                    djpid = $scope.item.detailjenispagu.id
                }
                var objSave =
                {
                    data: dataLoadKeGridPegawaiHasilFilterBerdasarkanFilterBy,
                    jenispaguid: $scope.item.jenisPagu.id,
                    detailjenispaguid: djpid
                }

                medifirstService.post('remunerasi/save-map-jenis-pagu-topegawai', objSave).then(function (e) {
                    TRalalaGetPegwaiPerJenisPagu($scope.item.jenisPagu)
                })

            }
            $scope.HapusdariGridMappingJenisPaguYangSebelahKananYa = function () {
                if ($scope.dataSelectedMap == undefined) {
                    alert("Pilih Pegawai yang akan di hapus dari mapping!!")
                    return;
                }
                var objSave =
                {
                    norec: $scope.dataSelectedMap.norec
                }

                medifirstService.post('remunerasi/save-hapus-map-jenis-pagu', objSave).then(function (e) {
                    TRalalaGetPegwaiPerDetailJenisPagu({ jpid: $scope.item.jenisPagu.id, djpid: $scope.item.detailjenispagu.id })
                })
            }
            $scope.columnGrid = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "idpegawai",
                    "title": "IDPegawai",
                    "width": "30px",
                },
                {
                    "field": "namakaryawan",
                    "title": "Nama Pegawai",
                    "width": "80px",
                },
                {
                    "field": "jabatan",
                    "title": "Jabatan",
                    "width": "80px",
                },
                {
                    "field": "golongan",
                    "title": "Golongan",
                    "width": "80px",
                }
            ];

            $scope.columnGridMap = [
                {
                    "field": "no",
                    "title": "No",
                    "width": "20px",
                },
                {
                    "field": "namalengkap",
                    "title": "Pegawai",
                    "width": "100px",
                },
                {
                    "field": "potpersen",
                    "title": "Potongan %",
                    "width": "60px",
                },
                {
                    "field": "remunfixed",
                    "title": "Potongan Fixed",
                    "width": "60px",
                },
                {
                    "field": "jenispagu",
                    "title": "Jenis Pagu",
                    "width": "80px",
                },
            ];

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
            //***********************************

        }
    ]);
});
