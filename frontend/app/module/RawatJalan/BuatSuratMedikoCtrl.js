define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('BuatSuratMedikoCtrl', ['$q', '$rootScope', '$scope', '$mdDialog', 'ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService',
        function ($q, $rootScope, $scope, $mdDialog, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {

            $scope.isRouteLoading = false;
            $scope.item = {};
            getdataCombo();
            $scope.item.statusKeluar = moment($scope.from).format('yyyy-MM-dd HH:mm:ss');

            $scope.disabledStatus = true;

            $scope.item.namaPembawaPulang = $state.norecAPD;

            var noregistrasi = cacheHelper.get("noreg");
            var nocmfk = cacheHelper.get("nocmfk");
            var tglsrt = cacheHelper.get("tgl_regis");


            LoadData();

            function getdataCombo() {


                medifirstService.get("sysadmin/general/get-data-combo-surat").then(function (data) {
                    $scope.listSurat = data.data.jenisSurat;
                    $scope.listDokter = data.data.listPegawai;
                    $scope.username = medifirstService.getPegawaiLogin().namaLengkap
                });


            }

            function LoadData() {
                medifirstService.get("sysadmin/general/get-data-pasien-byNoreg/" + noregistrasi)
                    .then(function (e) {
                        $scope.item.noregistrasi = e.data[0].noregistrasi;
                        $scope.item.nocm = e.data[0].nocm;
                        $scope.item.namapasien = e.data[0].namapasien;
                        $scope.item.tglregistrasi = e.data[0].tglregistrasi;
                        $scope.item.jeniskelamin = e.data[0].jeniskelamin;
                        $scope.item.tgllahir = e.data[0].tgllahir;
                        $scope.item.alamatlengkap = e.data[0].alamatlengkap;
                        $scope.item.namakelas = e.data[0].namakelas;
                        $scope.item.namaruangan = e.data[0].namaruangan;
                        $scope.item.tglSurat = e.data[0].tglregistrasi;
                        $scope.item.norec_pd = e.data[0].norec_pd;

                        //    $scope.item.pendidikan = e.data[0].namapasien;
                        //    $scope.item.pekerjaan = e.data[0].namapasien;
                        //    $scope.item.notelepon = e.data[0].namapasien;
                        //    $scope.item.jenispelayanan = e.data[0].namapasien;
                        //    $scope.item.noidentitas = e.data[0].namapasien;

                    })


            }
            $scope.showSurat = false
            $scope.$watch('item.surat', function (e) {
                if (e === undefined) return;
                $scope.showSurat = true
                $scope.item.suratHTML = e.template
            });



            $scope.optionEdit = {
                tools: [
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "justifyLeft",
                    "justifyCenter",
                    "justifyRight",
                    "justifyFull",
                    "insertUnorderedList",
                    "insertOrderedList",
                    "indent",
                    "outdent",
                    "createLink",
                    "unlink",
                    "insertImage",
                    "insertFile",
                    "subscript",
                    "superscript",
                    "tableWizard",
                    "createTable",
                    "addRowAbove",
                    "addRowBelow",
                    "addColumnLeft",
                    "addColumnRight",
                    "deleteRow",
                    "deleteColumn",
                    "mergeCellsHorizontally",
                    "mergeCellsVertically",
                    "splitCellHorizontally",
                    "splitCellVertically",
                    "viewHtml",
                    "formatting",
                    "cleanFormatting",
                    "copyFormat",
                    "applyFormat",
                    "foreColor",
                    "backColor",
                    "print"],
                resizable: {
                    content: true,
                    toolbar: true
                }
            };

            $scope.Save = function () {
                var nR = "";
                if ($scope.item.norec != undefined) {
                    nR = $scope.item.norec
                }

                if ($scope.item.surat == undefined) {
                    toastr.error('Jenis Surat harus di isi')
                    return
                }

                if ($scope.item.dokter == undefined) {
                    toastr.error('Dokter harus di isi')
                    return
                }

                if ($scope.item.tglSurat == undefined) {
                    toastr.error('Tanggal surat harus di isi')
                    return
                }
                if ($scope.item.suratHTML == undefined || $scope.item.suratHTML == '') {
                    toastr.error('Template surat harus di isi')
                    return
                }

                var objSave = {
                    'norec': nR,
                    'pasiendaftarfk': $scope.item.norec_pd,
                    'namapegID': $scope.userID,
                    'dokterID': $scope.item.dokter.id,
                    'jenissuratID': $scope.item.surat.id,
                    // 'nosurat':$scope.model.skdp,
                    // "namadistribusi": $scope.popUp.namadistribusi,
                    // "penilaianwaktufk": $scope.popUp.penilaian.id,
                    // "pegawaifk": $scope.popUp.namapeg.id,
                    "keterangan": $scope.item.ket,
                    "tglsurat": moment($scope.item.tglSurat).format('YYYY-MM-DD HH:mm'),
                    "surat": $scope.item.suratHTML
                }

                medifirstService.post('rawatjalan/save-daftar-surat').then(function (e) {
                    window.history.back()
                })





            }

            $scope.Next = function () {
             window.history.back()
            }

            //End
        }
    ]);
});