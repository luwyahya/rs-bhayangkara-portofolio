define(['initialize', 'Configuration'], function (initialize, configuration) {
    'use strict';
    initialize.controller('AbsensiPegawaiRevCtrl', ['$q', '$timeout', 'fileUpload', 'MedifirstService', 'DateHelper', 'ModelItem', '$state', '$rootScope', '$scope', '$mdDialog',
        function ($q, $timeout, fileUpload, medifirstService, dateHelper, modelItem, $state, $rootScope, $scope, $mdDialog) {
            $scope.isRouteLoading = false;
            $scope.ruanganKerja = [213, 217, 362, 57, 106, 105]; // daftar ruangan dengan otoritas penuh
            $scope.dataShiftPegawai = [] /* temp array data shift pegawai yang akan di simpan ke backend */
            $scope.simpan = true;
            $scope.item = {};
            var listpegawai = [];
            var listminggu = [];
            FormLoad();

            function FormLoad() {
                medifirstService.get("sdm/get-combo-jadwal", true).then(function (dat) {
                    var dataCombo = dat.data
                    $scope.now = new Date();
                    $scope.item.TanggalAwal = new Date(moment($scope.now).format('YYYY-MM-DD 00:00'));
                    $scope.item.TanggalAkhir = new Date(moment($scope.now).format('YYYY-MM-DD 23:59'));
                    $scope.listUnitKerja = dataCombo.dataunitkerja;
                    $scope.listJadwal = dataCombo.jamkerja;
                    $scope.listShiftKerja = dataCombo.jamkerja;
                });
            }

            $scope.listTahun = [];
            if (new Date().getMonth() == 11) {
                for (var i = new Date().getFullYear() - 5; i <= new Date().getFullYear() + 1; i++)
                    $scope.listTahun.push({ id: i });
            } else {
                for (var i = new Date().getFullYear() - 5; i <= new Date().getFullYear(); i++)
                    $scope.listTahun.push({ id: i });
            }
            $scope.listMonth = [];
            for (var i = 0; i <= 11; i++)
                $scope.listMonth.push({
                    id: i,
                    name: dateHelper.toMonth(i)
                });

            var getDaysInMonth = function (month, year) {
                // Here January is 1 based  
                //Day 0 is the last day in the previous month  
                return new Date(year, month + 1, 0).getDate();
                // Here January is 0 based  
                // return new Date(year, month+1, 0).getDate();  
            }
            $scope.showAlert = function (message) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(false)
                        .title('Input Jadwal')
                        .textContent(message)
                        .ok('OK')
                );
            };

            $scope.checkUnitKerja = function () {
                var obj = {
                    status: false,
                    message: "Unauthorized"
                }
                var str = $scope.currentUserLogin.jabatanInternal;
                if (!str) {
                    $scope.showAlert('Unauthorized');
                    return;
                }
                // for (var i = $scope.dSource.length - 1; i >= 0; i--) {
                //     $scope.dSource[i].isCanCreateJadwal==true
                obj.status = true;
                obj.message = 'Authorized';
                return obj;
                //     break
                // }
            }

            $scope.checkRuanganKerja = function (e, daftarRuangan) {
                var obj = {
                    status: false,
                    message: "Unauthorized"
                }
                if (daftarRuangan.includes(e)) {
                    obj = {
                        status: true,
                        message: "Authorized"
                    }
                    return obj;
                } else {
                    var str = $scope.currentUserLogin.jabatanInternal;
                    if (!str) {
                        $scope.showAlert('Unauthorized');
                        return;
                    }
                    // for (var i = $scope.dSource.length - 1; i >= 0; i--) {
                    //     $scope.dSource[i].isCanCreateJadwal==true
                    obj.status = true;
                    obj.message = 'Authorized';
                    return obj;
                    //     break
                    // }

                }

            }
            let pegawais = JSON.parse(localStorage.getItem('pegawai'))




            $scope.changeShift = function (item, tgl) {
                if (tgl.kehadiranKerja !== undefined) {
                    window.messageContainer.info('Data kehadiran sudah terisi');
                    return;
                }

                // if (modelItem.getPegawai().ruangan) {
                // var objValid = $scope.checkRuanganKerja(modelItem.getPegawai().ruangan.id, $scope.ruanganKerja);
                // } else {
                var objValid = { status: true }
                // }

                if (objValid.status) {
                    $scope.selectedShift = tgl;
                    $scope.selectedPegawai = item;

                    $scope.daftarShiftPegawai = tgl.shiftKerja;


                    tgl.popupEditor = false;

                } else {
                    $scope.showAlert(objValid.message);
                    return;
                }

            }
            $scope.shiftChanged = function (pegawai, shift) {
                // if (shift.shiftKerja.flagKetidakhadiran == true) {
                //     toastr.warning('Status ketidakhadiran tidak bisa dipilih', 'Warning')
                //     var data = {
                //         id: shift.idParent,
                //         // ruangan: {
                //         //     id: pegawai.unitKerja.unitKerjaId
                //         // },
                //         pegawai: {
                //             id: pegawai.id
                //         },
                //         shift: {
                //             id: shift.shiftSebelum.id
                //         },
                //         tanggal: {
                //             id: shift.date
                //         }
                //     }
                //     $scope.dataShiftPegawai.push(data);

                //     shift.shiftKerja = shift.shiftSebelum
                //     shift.popupEditor = true;
                // } else {
                if (shift.shiftKerja.id == null) return
                shift.popupEditor = true;
                for (var i = 0; i < $scope.dataShiftPegawai.length; i++) {
                    if ($scope.dataShiftPegawai[i].pegawai.id == pegawai.id && $scope.dataShiftPegawai[i].tanggal.id.toDateString() == shift.date.toDateString())
                        $scope.dataShiftPegawai.splice(i, 1);
                }
                var data = {
                    // id: shift.idParent,
                    // ruangan: {
                    //     id: pegawai.unitKerja.unitKerjaId
                    // },
                    pegawai: {
                        id: pegawai.id
                    },
                    shift: {
                        id: shift.shiftKerja.id
                    },
                    tanggal: {
                        id: shift.date,
                        dateformat: moment(shift.date).format('YYYY-MM-DD')
                    }
                }
                $scope.dataShiftPegawai.push(data);

                // }

            }
            $scope.getClassDay = function (item, tgl) {
                if (tgl.shiftKerja && tgl.shiftKerja.kodeExternal == "L") {
                    return "holiday";
                } else {
                    return "in";
                }

            }

            var tahunIni = new Date().getFullYear() - 5;
            if (new Date().getMonth() == 11) {
                tahunIni = $scope.listTahun.length - 2
            } else {
                tahunIni = $scope.listTahun.length - 1
            }

            $scope.item = {
                selectedBulan: $scope.listMonth[new Date().getMonth()],
                selectedTahun: $scope.listTahun[tahunIni]
            };

            $scope.initialize = function (item, tgl) {
                var arrLibur = [];
                tgl.isLibur = arrLibur.indexOf(tgl.date.getDay()) !== -1;
                tgl.popupEditor = true;

            }
            $scope.Save = function () {
                $scope.simpan = false;
                if ($scope.dataShiftPegawai.length > 0) {
                    $scope.isRouteLoading = true;
                    var json = {
                        'unitkerjafk': $scope.item.unitKerja.id,
                        'data': $scope.dataShiftPegawai
                    }
                    medifirstService.post('sdm/save-jadwal-kerja-pegawai', json).then(function (e) {
                        $scope.simpan = true;
                        $scope.isRouteLoading = false;
                    }, (err) => {
                        $scope.isRouteLoading = false;
                        $scope.simpan = true;
                        throw err;
                    });
                    // manageSdmNew.saveData($scope.dataShiftPegawai, "pegawai/save-all-jadwal-pegawai-rev2/").then(function (e) {                    
                    //     var msg = e.data.messages;
                    //     if (msg['label-success'] === "SUKSES") {
                    //         window.messageContainer.log(msg['label-success']);
                    //         $scope.dataShiftPegawai = [];
                    //         $scope.simpan = true;
                    //     }
                    //     $scope.isRouteLoading = false;
                    //     //  $scope.isNext = true;
                    //     $rootScope.doneLoad = true;
                    // }, (err) => {
                    //     $scope.isRouteLoading = false;
                    //     $scope.simpan = true;
                    //     throw err;
                    // });
                } else {
                    messageContainer.error('Tidak ada perubahan jadwal dinas pegawai!');
                    $scope.simpan = true;
                }
            };


            $scope.refresh = function () {

                var listRawRequired = [
                    "item.selectedBulan|k-ng-model|Bulan",
                    "item.selectedTahun|k-ng-model|Tahun",
                    "item.unitKerja|k-ng-model|unit Kerja",
                    // "item.subUnitKerja|k-ng-model|sub unit kerja"
                ];
                var isValid = modelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    $scope.listData = [];
                    $scope.dataFound = false;
                    $scope.isRouteLoading = true;
                    if ($scope.item.selectedTahun !== undefined && $scope.item.selectedBulan !== undefined) {
                        $scope.listDay = [];
                        var max = getDaysInMonth($scope.item.selectedBulan.id, $scope.item.selectedTahun.id);
                        for (var i = 1; i <= max; i++) {
                            $scope.listDay.push({
                                id: i,
                                day: dateHelper.DescDay(new Date($scope.item.selectedTahun.id, $scope.item.selectedBulan.id, i)),
                                display: dateHelper.DescDay(new Date($scope.item.selectedTahun.id, $scope.item.selectedBulan.id, i), true),
                                date: new Date($scope.item.selectedTahun.id, $scope.item.selectedBulan.id, i)
                            });
                        }
                    }
                    if ($scope.item.selectedBulan === undefined || $scope.item.selectedTahun === undefined || $scope.item.unitKerja === undefined) {
                        return;
                    }
                    // if ($scope.item.subUnitKerja.id + "" + $scope.item.selectedTahun.id + "" + $scope.item.selectedBulan.id === $scope.temp)
                    //     return;


                    // $rootScope.doneLoad = false;
                    // $scope.temp = $scope.item.subUnitKerja.id + "" + $scope.item.selectedTahun.id + "" + $scope.item.selectedBulan.id;
                    // findPegawai.getjadwalPegawai($scope.item.subUnitKerja.id, $scope.item.selectedTahun.id, $scope.item.selectedBulan.id + 1).then(function(e) {
                    var bulan = $scope.item.selectedBulan.id + 1;
                    if (bulan.toString().length == 1) {
                        bulan = "0" + bulan.toString()
                    }
                    $scope.isKosongkan = true
                    var bulanTahun = $scope.item.selectedTahun.id.toString() + '-' + bulan
                    medifirstService.get("sdm/get-pegawai-by-unitkerja?unitkerjaid=" + $scope.item.unitKerja.id
                        + "&tahun=" + $scope.item.selectedTahun.id + "&bulan=" + bulan + "&bulantahun=" + bulanTahun).then(function (e) {
                            var arr = [];
                            // $rootScope.doneLoad = true;
                            $scope.dataFound = true;
                            // var listIdNonShift = [1, 2];
                            if (e.data.length == 0) {
                                $scope.isRouteLoading = false;
                                return
                            }
                            $scope.isKosongkan = false
                            for (var i = 0; i < e.data.length; i++) {

                                var element = e.data[i];
                                element.listDay = [];
                                for (var j = 0; j < $scope.listDay.length; j++) {
                                    // var shiftKerja = undefined;
                                    // var tanggal = undefined;
                                    // var idParent = undefined;
                                    // if (element.pegawai.shiftKerja) {
                                    // var pegawaiNonShift = element.pegawai.shiftKerja ? element.pegawai.shiftKerja.id : null;

                                    // if (element.jadwal !== undefined) {

                                    //     var filter = _.find(element.jadwal, function (e) {
                                    //         return e.tanggal.tanggal === $scope.listDay[j].date.getTime();
                                    //     });

                                    //     if (filter != undefined) {
                                    //         var jadwalPraktek = filter.shift;
                                    //         //kehadiranKerja = filter.statusKehadiran;
                                    //         var praktek = _.find(element.pegawai.shiftKerja.detail, function (data) {
                                    //             return data["id"] === jadwalPraktek["id"];
                                    //         });

                                    //         tanggal = filter.tanggal;
                                    //         shiftKerja = praktek;
                                    //         idParent = filter.id;
                                    //     }
                                    // }

                                    element.listDay.push({
                                        id: $scope.listDay[j].id,
                                        day: $scope.listDay[j].day,
                                        // display: $scope.listDay[j].display,
                                        date: $scope.listDay[j].date,
                                        // tanggal: {id: $scope.listDay[j].id},
                                        shiftKerja: { id: 0 }//, detail: $scope.listJadwal },
                                        // shiftSebelum:  $scope.listJadwal,

                                        // idParent: 0//idParent
                                    });

                                    // push data jadwal non shift ke model array jadwal pegawai
                                    // if (listIdNonShift.includes(pegawaiNonShift) && (!idParent && shiftKerja !== undefined)) {
                                    //     var data = {
                                    //         pegawai: {
                                    //             id: element.idPegawai
                                    //         },
                                    //         shift: {
                                    //             id: shiftKerja ? shiftKerja.id : null
                                    //         },
                                    //         tanggal: {
                                    //             id: tanggal.id
                                    //         }
                                    //     }
                                    //     $scope.dataShiftPegawai.push(data);
                                    // }
                                    for (let k = 0; k < element.jadwalkerja.length; k++) {
                                        const elementTwo = element.jadwalkerja[k];
                                        // let tanggalss= new Date(elementTwo.tanggal + ' 00:00')
                                        if (new Date(elementTwo.tanggal + ' 00:00').toString() == $scope.listDay[j].date.toString()) {
                                            element.listDay[j].popupEditor = true
                                            element.listDay[j].shiftKerja.kode = elementTwo.kode
                                            var data = {
                                                pegawai: {
                                                    id: element.id
                                                },
                                                shift: {
                                                    id: elementTwo.jadwalkerjafk
                                                },
                                                tanggal: {
                                                    id: new Date(elementTwo.tanggal),
                                                    dateformat: elementTwo.tanggal
                                                }
                                            }
                                            $scope.dataShiftPegawai.push(data);
                                        }
                                    }
                                    // }
                                }
                                arr.push(element);
                            }
                            // $scope.isNext = false;
                            $scope.listData = arr;
                            $scope.setElementCss();
                            // $rootScope.doneLoad = true;
                            $scope.isRouteLoading = false;
                            $timeout(function () {

                                renderingDone();
                            });
                        }, function (err) {
                            toastr.warning('Something went wrong');
                            throw err;
                        }).then(function () {

                        });
                } else {
                    $scope.isRouteLoading = false;
                    modelItem.showMessages(isValid.messages);
                }
            } //end refresh

            $scope.$watch('item.unitKerja', function (newVal, oldVal) {
                if (!newVal) return;
                if ((newVal && oldVal) && newVal.id == oldVal.id) return;
                // $scope.isRouteLoading = true;

            });

            $scope.setElementCss = function () {
                var element = angular.element(document.querySelector('#jadwalDinas'));
                if ($scope.listData.length < 8) {
                    element.css('overflow', 'hidden');
                } else {
                    element.css('overflow', 'auto');
                }
            }
            function renderingDone() {
                var row = $('#tabelJadwal').find(' tbody tr td:first');
                var rowWidth = row.width();
                var rowthead = $('#tabelJadwal').find(' thead tr:first>th:first');
                rowthead.css({ 'width': rowWidth });
            }

            $scope.monthNameToNum = function (monthname) {
                var month = $scope.listMonth.indexOf(monthname);
                return month ? month + 2 : 0;
            }
            /***Upload Excel */
            $("#upload").kendoUpload({
                localization: {
                    "select": "Pilih File Excel..."
                },

                select: function (e) {
                    var ALLOWED_EXTENSIONS = [".xlsx"];
                    var extension = e.files[0].extension.toLowerCase();
                    if (ALLOWED_EXTENSIONS.indexOf(extension) == -1) {
                        toastr.error('Mohon Pilih File Excel (.xls)')
                        e.preventDefault();
                        // return
                    }


                    for (var i = 0; i < e.files.length; i++) {
                        var file = e.files[i].rawFile;

                        if (file) {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var data = e.target.result;
                                var workbook = XLSX.read(data, {
                                    type: 'binary'
                                });

                                workbook.SheetNames.forEach(function (sheetName) {
                                    // Here is your object
                                    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                                    var json_object = JSON.stringify(XL_row_object);
                                    for (var i = 0; i < XL_row_object.length; i++) {
                                        XL_row_object[i].kodeshift = Object.values(XL_row_object[i])
                                        XL_row_object[i].tanggal = Object.keys(XL_row_object[i])
                                    }

                                    for (var i = 0; i < XL_row_object.length; i++) {
                                        for (var j = 0; j < XL_row_object[i].tanggal.length; j++) {
                                            var bulan = new Date($scope.item.selectedTahun.id + '-'
                                                + ($scope.item.selectedBulan.id + 1) + '-'
                                                + XL_row_object[i].tanggal[j])
                                            bulan = moment(bulan).format('YYYY-MM-DD')
                                            XL_row_object[i].tanggal[j] = bulan
                                        }
                                    }
                                    for (var i = 0; i < XL_row_object.length; i++) {
                                        // for (var j = 0; j <  XL_row_object[i].kodeshift.length; j++) {
                                        XL_row_object[i].kodeshift.splice(-2)
                                        // }
                                    }
                                    var objSave =
                                    {
                                        data: XL_row_object

                                    }
                                    if ($scope.item.selectedTahun !== undefined && $scope.item.selectedBulan !== undefined) {
                                        $scope.listDay = [];
                                        var max = getDaysInMonth($scope.item.selectedBulan.id, $scope.item.selectedTahun.id);
                                        for (var i = 1; i <= max; i++) {
                                            $scope.listDay.push({
                                                id: i,
                                                day: dateHelper.DescDay(new Date($scope.item.selectedTahun.id, $scope.item.selectedBulan.id, i)),
                                                display: dateHelper.DescDay(new Date($scope.item.selectedTahun.id, $scope.item.selectedBulan.id, i), true),
                                                date: new Date($scope.item.selectedTahun.id, $scope.item.selectedBulan.id, i)
                                            });
                                        }
                                    }
                                    if ($scope.item.selectedBulan === undefined || $scope.item.selectedTahun === undefined) {
                                        return;
                                    }

                                    //ieu asli tah
                                    managePhp.postData(objSave, 'sdm/get-jadwal-absensi-fromexcel').then(function (e) {

                                        var arr = [];
                                        $rootScope.doneLoad = true;
                                        $scope.dataFound = true;
                                        var listIdNonShift = [1, 2];

                                        for (var i = 0; i < e.data.data.length; i++) {
                                            var element = e.data.data[i];
                                            element.listDay = [];
                                            for (var j = 0; j < $scope.listDay.length; j++) {
                                                var shiftKerja = undefined;
                                                var tanggal = undefined;
                                                var kehadiranKerja = undefined;
                                                var idParent = undefined;
                                                if (element.shift) {
                                                    // var pegawaiNonShift = element.pegawai.shiftKerja ? element.pegawai.shiftKerja.id : null;

                                                    var pegawaiNonShift = 3

                                                    if (element.shift !== undefined) {
                                                        //element.jadwal = modelItem.beforePost(element.jadwal, true);
                                                        var filter = _.find(element.shift, function (e) {
                                                            return e.tanggal === $scope.listDay[j].date.getTime();
                                                        });

                                                        if (filter != undefined) {

                                                            tanggal = filter.tanggal;
                                                            shiftKerja = filter;

                                                        }
                                                    }

                                                    element.listDay.push({
                                                        id: $scope.listDay[j].id,
                                                        day: $scope.listDay[j].day,
                                                        display: $scope.listDay[j].display,
                                                        date: $scope.listDay[j].date,
                                                        tanggal: tanggal,
                                                        shiftKerja: shiftKerja,
                                                        shiftSebelum: shiftKerja,
                                                        //kehadiranKerja: kehadiranKerja,
                                                        // idParent: idParent
                                                    });

                                                    // push data jadwal non shift ke model array jadwal pegawai
                                                    if (listIdNonShift.includes(pegawaiNonShift) && (!idParent && shiftKerja !== undefined)) {
                                                        var data = {
                                                            id: idParent,
                                                            // ruangan: {
                                                            //     id: element.pegawai.unitKerja.unitKerjaId
                                                            // },
                                                            pegawai: {
                                                                id: element.idPegawai
                                                            },
                                                            shift: {
                                                                id: shiftKerja ? shiftKerja.id : null
                                                            },
                                                            tanggal: {
                                                                id: tanggal.id
                                                            }
                                                        }
                                                        $scope.dataShiftPegawai.push(data);
                                                    }
                                                }
                                            }
                                            arr.push(element);
                                        }
                                        $scope.isNext = false;
                                        $scope.listData = arr;
                                        $scope.setElementCss();
                                    })



                                })

                            };

                            reader.onerror = function (ex) {
                                console.log(ex);
                            };

                            reader.readAsBinaryString(file);
                        }
                    }
                },

            })
            /***END Upload Excel */

            $scope.exportTableToExcel = function (tableID, filename = '') {
                var downloadLink;
                var dataType = 'application/vnd.ms-excel';
                var tableSelect = document.getElementById(tableID);
                var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

                // Specify file name
                filename = filename ? filename + '.xls' : 'excel_data.xls';

                // Create download link element
                downloadLink = document.createElement("a");

                document.body.appendChild(downloadLink);

                if (navigator.msSaveOrOpenBlob) {
                    var blob = new Blob(['\ufeff', tableHTML], {
                        type: dataType
                    });
                    navigator.msSaveOrOpenBlob(blob, filename);
                } else {
                    // Create a link to the file
                    downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

                    // Setting the file name
                    downloadLink.download = filename;

                    //triggering the function
                    downloadLink.click();
                }
            }

            $scope.InputMingguan = function () {
                $scope.isRouteLoading = true;
                if ($scope.item.unitKerja == undefined) {
                    toastr.error("Unit Kerja Belum Diisi !!!");
                    return;
                }

                var bulan = $scope.item.selectedBulan.id + 1;
                if (bulan.toString().length == 1) {
                    bulan = "0" + bulan.toString()
                }                
                var bulanTahun = $scope.item.selectedTahun.id.toString() + '-' + bulan
                medifirstService.get("sdm/get-pegawai-by-unitkerja?unitkerjaid=" + $scope.item.unitKerja.id
                    + "&tahun=" + $scope.item.selectedTahun.id + "&bulan=" + bulan + "&bulantahun=" + bulanTahun).then(function (e) {
                        $scope.isRouteLoading = false;
                        var arr = [];                        
                        var datas = e.data;                        
                        for (let i = 0; i < datas.length; i++) {
                            const element = datas[i];                            
                            listpegawai.push(element)
                        }                        
                        $scope.popUpJadwal.center().open();
                    });
            }

            $scope.BatalJM = function () {
                $scope.item.TanggalAwal = moment($scope.now).format('YYYY-MM-DD 00:00');
                $scope.item.TanggalAkhir = moment($scope.now).format('YYYY-MM-DD 23:59');
                $scope.item.ShiftKerja = undefined;
                $scope.popUpJadwal.close();
            }

            $scope.SimpanJM = function () {
                if ($scope.item.ShiftKerja == undefined) {
                    toastr.error("Shift Kerja Belum Diisi !!!");
                    return;
                }

                if ($scope.item.unitKerja == undefined) {
                    toastr.error("Unit Kerja Belum Diisi !!!");
                    return;
                }
                
                var dua = moment($scope.item.TanggalAwal, "YYYY-MM-DD HH:mm").add('days', 1);
                var tiga = moment($scope.item.TanggalAwal, "YYYY-MM-DD HH:mm").add('days', 2);
                var empat = moment($scope.item.TanggalAwal, "YYYY-MM-DD HH:mm").add('days', 3);
                var lima = moment($scope.item.TanggalAwal, "YYYY-MM-DD HH:mm").add('days', 4);
                var enam = moment($scope.item.TanggalAwal, "YYYY-MM-DD HH:mm").add('days', 5);
                var tujuh = moment($scope.item.TanggalAwal, "YYYY-MM-DD HH:mm").add('days', 6);
                var tglSatu = moment($scope.item.TanggalAwal).format('YYYY-MM-DD');
                var tglDua = moment(dua).format('YYYY-MM-DD');
                var tglTiga = moment(tiga).format('YYYY-MM-DD');
                var tglEmpat = moment(empat).format('YYYY-MM-DD');
                var tglLima = moment(lima).format('YYYY-MM-DD');
                var tglEnam = moment(enam).format('YYYY-MM-DD');
                var tglTujuh = ''
                if (moment($scope.item.TanggalAkhir).format('YYYY-MM-DD') != moment($scope.item.TanggalAwal).format('YYYY-MM-DD')) {
                    tglTujuh = moment($scope.item.TanggalAkhir).format('YYYY-MM-DD');
                }else{
                    tglTujuh = moment(tujuh).format('YYYY-MM-DD');
                }
                
                var data = [
                    {tanggal : tglSatu},
                    {tanggal : tglDua},
                    {tanggal : tglTiga},
                    {tanggal : tglEmpat},
                    {tanggal : tglLima},
                    {tanggal : tglEnam},
                    {tanggal : tglTujuh},
                ]                            
                listminggu.push(data);

                var objSave = {
                    listpegawai: listpegawai,
                    unitkerja: $scope.item.unitKerja.id,
                    jamkerja: $scope.item.ShiftKerja.id,
                    tanggal: listminggu,                    
                }

                medifirstService.post('sdm/save-jadwal-kerja-pegawai-mingguan', objSave).then(function (e) {

                });
            }


        }

    ])
});