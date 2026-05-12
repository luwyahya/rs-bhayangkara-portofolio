define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('InputDiagnosaDokterAllCtrl', ['$scope', '$q','ModelItem', '$state', 'CacheHelper', 'DateHelper', 'MedifirstService','$rootScope',
        function ($scope,$q, ModelItem, $state, cacheHelper, dateHelper, medifirstService,$rootScope) {

            $scope.item = {};
            // $scope.chk = {};
            $scope.now = new Date();
            $scope.dataVOloaded = true
            $scope.findBy = "1"
            var norec_apd = ''
            var norec_pd = ''
            var nocm_str = ''
            var detail = ''
            var isranap = false
            var iskelas = 'BPJS'
            $scope.poneks = {};
            $scope.showTombol = false
            $scope.item.kasusbaru = true
            $scope.item.kasuslama = false
            $scope.poneks.penyakitponekigd = null;
            $scope.dataParams = JSON.parse($state.params.dataPasien);

            var responData = "";
            $scope.hasilgrouping = false
            $scope.tarifrs = ''
            $scope.biayanaikkelas = ''
            $scope.tarifinacbg = ''
            $scope.dpfk = ''
            var noreg = ''
            var tampungKodeDiagnosa = ''
            var tampungKodeDiagnosaTindakan = ''
            $scope.formatRupiah = function (value, currency) {
                return currency + " " + parseFloat(value).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            }

            LoadCache();
              getdatagrouping();
            function LoadCache() {
                LoadCombo();
                var chacePeriode = cacheHelper.get('InputDiagnosaDokterAllCtrl');
                debugger;
                if (chacePeriode != undefined) {
                    //var arrPeriode = chacePeriode.split(':');
                    $scope.item.noMr = chacePeriode[0]
                    $scope.item.namaPasien = chacePeriode[1]
                    $scope.item.jenisKelamin = chacePeriode[2]
                    $scope.item.noregistrasi = chacePeriode[3]
                    noreg = $scope.item.noregistrasi 
                    $scope.item.umur = chacePeriode[4]
                    iskelas = $scope.item.kelompokPasien = chacePeriode[5]
                    $scope.item.tglRegistrasi = chacePeriode[6]
                    norec_apd = chacePeriode[7]
                    norec_pd = chacePeriode[8]
                    $scope.item.idKelas = chacePeriode[9]
                    $scope.item.kelas = chacePeriode[10]
                    $scope.item.idRuangan = chacePeriode[11]
                    $scope.poneks.idRuangan = chacePeriode[11]
                    $scope.item.namaRuangan = chacePeriode[12]
                    $scope.item.isNoRegis = chacePeriode[13]
                    if ($scope.item.namaRuangan.substr($scope.item.namaRuangan.length - 1) == '`') {
                        $scope.showTombol = true
                    }
                }
                // medifirstService.get("tatarekening/get-data-login?noRegistrasi=" + $scope.dataParams.noRegistrasi).then(function (e) {

                //     dataLogin = e.data.datalogin;
                //     KelompokUser = e.data.kelompokuser;
                //     $scope.listRuangAPD = e.data.listRuangan
                //     $scope.item.PegawaiLoginfk = e.data.pegawailoginfk;
                //     var brs = e.data.listRuangan.length
                //     ruangaan2 = { id: e.data.listRuangan[brs - 1].id, namaruangan: e.data.listRuangan[brs - 1].namaruangan }
                //     $scope.item.ruang2 = ruangaan2


                   
                // })
                debugger
                $scope.ponek = false;
                if($scope.poneks.idRuangan == 309 || $scope.poneks.idRuangan == 715) {
                    $scope.ponek = true;
                }
                loadGrid($scope.dataParams.noRegistrasi, $scope.item.idRuangan, 'layanan')
                getPasienByNorecPD()
            }

            function getPasienByNorecPD() {
                medifirstService.get("registrasi/get-pasienbynorec-pd?norecPD=" + norec_pd + "&norecAPD=" + norec_apd)
                    .then(function(his) {
                        if (his.data.data[0].israwatinap == 'true') {
                            isranap = true
                        } else {
                            isranap = false
                        }
                    });
                    console.log(iskelas)
            }

            function loadGrid(noreg, idRuangan, jenisdata) {
                if (jenisdata == undefined)
                    jenisdata = 'layanan'
                $scope.isRouteLoading = true;
                $q.all([
                    medifirstService.getServiceArray("tatarekening/detail-tagihan/" + noreg + '?jenisdata=' + jenisdata + '&idruangan=' + idRuangan)
                ])
                    .then(function (data) {

                        if (data[0].statResponse) {
                           
                            $scope.item = data[0];
                            
                        }
                        $scope.isRouteLoading = false;

                    });
            }

            function LoadCombo() {
                $scope.isLoadingDiagnosis = true;
                medifirstService.getPart("emr/get-combo-icd9-idrg", true, true, 10).then(function (data) {
                    $scope.listDiagnosaTindakan = data;
                });
                medifirstService.getPart("emr/get-combo-icd10", true, true, 10).then(function (data) {
                    $scope.listDiagnosa = data;
                });
                medifirstService.get('emr/get-combo-diagnosis').then(function (data) {
                    $scope.listJenisDiagnosa = data.data.jenisdiagnosa;
                });

                //   ModelItem.getDataDummyGeneric("JenisDiagnosa", true, true, 10).then(function (data) {
                //     $scope.listJenisDiagnosa = data;
                // });

                // ModelItem.getDataDummyGeneric("Diagnosa", true, true, 10).then(function(data) {
                //     $scope.listDiagnosa = data;
                // });

            }

            $scope.klikIcd9 = function (dataIcd9Selected) {
                $scope.item.diagnosaTindakan = {
                    id: dataIcd9Selected.id,
                    namaDiagnosaTindakan: dataIcd9Selected.namadiagnosatindakan,
                    kodeNama: dataIcd9Selected.kddiagnosatindakan + ' - ' +  dataIcd9Selected.namadiagnosatindakan,
                    kdDiagnosaTindakan: dataIcd9Selected.kddiagnosatindakan
                }
                $scope.item.ketTindakan = dataIcd9Selected.keterangantindakan
                $scope.findBy = "1";
            }
            $scope.klikIcd10 = function (dataIcd10Selected) {
                $scope.item.jenisDiagnosis = {
                    id: dataIcd10Selected.objectjenisdiagnosafk,
                    jenisDiagnosa: dataIcd10Selected.jenisdiagnosa
                }

                $scope.item.diagnosa = {
                    id: dataIcd10Selected.id,
                    namaDiagnosa: dataIcd10Selected.namadiagnosa,
                    kdDiagnosa: dataIcd10Selected.kddiagnosa,
                    kodeNama: dataIcd10Selected.kddiagnosa + ' - ' +dataIcd10Selected.namadiagnosa    
                }
                $scope.poneks.penyakitponekigd = dataIcd10Selected.penyakitponekigd
                $scope.item.keterangan = dataIcd10Selected.keterangan
                if (dataIcd10Selected.iskasusbaru == '1') {
                    $scope.item.kasusbaru = true
                    $scope.item.kasuslama = false
                } else {
                    $scope.item.kasusbaru = false
                    $scope.item.kasuslama = true
                }
                // if (dataIcd10Selected.iskasuslama = '1') {
                //     $scope.item.kasuslama = true
                //     $scope.item.kasusbaru = false
                // }else{
                //     $scope.item.kasuslama = false
                //     $scope.item.kasusbaru = true
                // }

                $scope.findBy = "1";
            }
            $scope.checkboxClicked = function (dat) {
                if ($scope.item.kasusbaru == true) {
                    $scope.item.kasusbaru = true
                    $scope.item.kasuslama = false
                } else {
                    $scope.item.kasusbaru = false
                    $scope.item.kasuslama = true
                }
            }

            $scope.checkboxClicked2 = function (dat) {
                if ($scope.item.kasuslama == false) {
                    $scope.item.kasusbaru = true
                    $scope.item.kasuslama = false
                } else {
                    $scope.item.kasusbaru = false
                    $scope.item.kasuslama = true
                }
            }
            $rootScope.getRekamMedisCheck = function (bool) {
                if (bool) {
                    $scope.isRouteLoading = true;
                    var param = "noReg=" + $scope.item.noregistrasi;
                    medifirstService.get("emr/get-diagnosapasienbynoregicd9?"
                    + param
                        ).then(function (data) {
                            $scope.isRouteLoading = false;
                            var dataICD9 = data.data.datas;
                            $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
                                data: dataICD9,
                                pageSize: 10
                            });
                        });

                        medifirstService.get("emr/get-diagnosapasienbynoreg?"
                            + param
                        ).then(function (data) {
                            // $scope.isRouteLoading = false;
                            var dataICD10 = data.data.datas;
                            $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
                                data: dataICD10,
                                pageSize: 10
                            });
                        });
                }
                else {
                    $scope.isRouteLoading = true;
                    var param = "noCm=" + $scope.item.noMr;
                    medifirstService.get("emr/get-diagnosapasienbynoregicd9?"
                    + param
                        ).then(function (data) {
                            $scope.isRouteLoading = false;
                            var dataICD9 = data.data.datas;
                            $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
                                data: dataICD9,
                                pageSize: 10
                            });
                        });

                        medifirstService.get("emr/get-diagnosapasienbynoreg?"
                            + param
                        ).then(function (data) {
                            // $scope.isRouteLoading = fals e;
                            var dataICD10 = data.data.datas;
                            $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
                                data: dataICD10,
                                pageSize: 10
                            });
                        });
                   
                }
            }
            $scope.riwayatResep = function () {
                $scope.popUpResep.center().open();
                loadResep();   
            }
           

            loadDiagnosa();
            function loadDiagnosa() {
                $scope.isRouteLoading = true;
                var param =""
                // if($scope.dataParams.noRegistrasi == true)
                   param = "noReg=" + $scope.dataParams.noRegistrasi;
                // else
                //   param = "noCm=" + $scope.item.noCm;
              
                medifirstService.get("emr/get-diagnosapasienbynoregicd9?"
                    + param
                ).then(function (data) {
                    $scope.isRouteLoading = false;
                    var dataICD9 = data.data.datas;
                    $scope.dataSourceDiagnosaIcd9 = new kendo.data.DataSource({
                        data: dataICD9,
                        pageSize: 10
                    });
                });

                medifirstService.get("emr/get-diagnosapasienbynoreg?"
                    + param
                ).then(function (data) {
                    let penyakitponekigd = data.data.datas.filter(poneks => poneks.penyakitponekigd == 'gynaecology' || poneks.penyakitponekigd == 'obstetric');
                    if(penyakitponekigd.length > 0) {
                        $scope.poneks.poneksudah = true;
                    } else {
                        $scope.poneks.poneksudah = false;
                    }
                    // $scope.isRouteLoading = false;
                    var dataICD10 = data.data.datas;
                    $scope.dataSourceDiagnosaIcd10 = new kendo.data.DataSource({
                        data: dataICD10,
                        pageSize: 10
                    });
                });
            }

            $scope.columnDiagnosaIcd9 = [{
                "title": "No",
                "template": "{{dataSourceDiagnosaIcd9.indexOf(dataItem) + 1}}",
                "width": "30px"
            }, 
            {
                "field": "noregistrasi",
                "title": "No Registrasi",
                "width": "100px"
            }, {
                "field": "kddiagnosatindakan",
                "title": "Kode ICD 9",
                "width": "100px"
            }, {
                "field": "namadiagnosatindakan",
                "title": "Nama ICD 9",
                "width": "300px"
            }, {
                "field": "keterangantindakan",
                "title": "Keterangan",
                "width": "200px"
            }, {
                "field": "namaruangan",
                "title": "Ruangan",
                "width": "200px"
            },
            {
                "field": "namalengkap",
                "title": "Penginput",
                "width": "200px"
            },
            {
                "field": "tglinputdiagnosa",
                "title": "Tgl Input",
                "width": "200px"
            }];
            $scope.columnDiagnosaIcd10 = [{
                "title": "No",
                "template": "{{dataSourceDiagnosaIcd10.indexOf(dataItem) + 1}}",
                "width": "30px"
            }, 
            {
                "field": "noregistrasi",
                "title": "No Registrasi",
                "width": "100px"
            },{
                "field": "jenisdiagnosa",
                "title": "Jenis Diagnosis",
                "width": "150px"
            }, {
                "field": "kddiagnosa",
                "title": "Kode ICD 10",
                "width": "100px"
            }, {
                "field": "namadiagnosa",
                "title": "Nama ICD 10",
                "width": "300px"
            }, {
                "field": "keterangan",
                "title": "Keterangan",
                "width": "200px"
            }, {
                "field": "namaruangan",
                "title": "Ruangan",
                "width": "150px"
            },
            {
                "field": "namalengkap",
                "title": "Penginput",
                "width": "200px"
            },
            {
                "field": "tglinputdiagnosa",
                "title": "Tgl Input",
                "width": "200px"
            }];

            
            function loadResep() {
                $scope.isRouteLoading = true;
                medifirstService.get("emr/get-transaksi-pelayanan?noReg=" +$scope.item.noregistrasi
                // nocm=" + $scope.item.noMr
                    // + "&noregistrasifk=" + norec_apd
                    , true).then(function (dat) {
                        let group = [];
                        if (dat.statResponse == true) {
                            for (var i = 0; i < dat.data.length; i++) {
                                dat.data[i].no = i + 1                                
                                dat.data[i].total = parseFloat(dat.data[i].jumlah) * (parseFloat(dat.data[i].hargasatuan) - parseFloat(dat.data[i].hargadiscount));
                                dat.data[i].total = parseFloat(dat.data[i].total) + parseFloat(dat.data[i].jasa);
                                if (dat.data[i].reseppulang == '1') {
                                    dat.data[i].cekreseppulang = "✔"
                                }else{
                                    dat.data[i].cekreseppulang = "-"
                                }
                            }
                            var array = dat.data;
                            let sama = false

                            for (let i in array) {
                                array[i].count = 1
                                sama = false
                                for (let x in group) {
                                    if (group[x].noresep == array[i].noresep) {
                                        sama = true;
                                        group[x].count = parseFloat(group[x].count) + parseFloat(array[i].count)

                                    }
                                }
                                if (sama == false) {
                                    var dataDetail0 = [];
                                    for (var f = 0; f < array.length; f++) {
                                        if (array[i].noresep == array[f].noresep) {
                                            dataDetail0.push(array[f]);
                                        };
                                    }
                                    let result = {
                                        noregistrasi: array[i].noregistrasi,
                                        tglpelayanan: array[i].tglpelayanan,
                                        noresep: array[i].noresep,
                                        aturanpakai: array[i].aturanpakai,
                                        namaruangandepo: array[i].namaruangandepo,
                                        namaruangan: array[i].namaruangan,
                                        dokter: array[i].dokter,
                                        count: array[i].count,
                                        cekreseppulang : array[i].cekreseppulang,
                                        details: dataDetail0
                                    }
                                    group.push(result)
                                }
                            }
                        }

                        $scope.dataGridResep = group
                        console.log(group)
                        $scope.isRouteLoading = false;
                    });
            }
            $scope.columnGridResep = [

                {
                    "field": "noresep",
                    "title": "No.Resep",
                    "width": "100px",
                },
                {
                    "field": "tglpelayanan",
                    "title": "Tgl Resep",
                    "width": "120px",
                },
                {
                    "field": "noregistrasi",
                    "title": "No.Registrasi",
                    "width": "100px",
                },
                {
                    "field": "dokter",
                    "title": "Penulis Resep",
                    "width": "170px",
                },
                {
                    "field": "namaruangan",
                    "title": "Ruangan",
                    "width": "100px",
                },
                {
                    "field": "namaruangandepo",
                    "title": "Depo",
                    "width": "90px",
                },
                {
                    "field": "cekreseppulang",
                    "title": "Resep Pulang",
                    "width": "90px",
                     "template": "<span class='style-center'>#: cekreseppulang #</span>"
                }
            ];
            $scope.data2 = function (dataItem) {
                // debugger
                for (var i = 0; i < dataItem.details.length; i++) {
                    dataItem.details[i].no = i + 1

                }
                return {
                    dataSource: new kendo.data.DataSource({
                        data: dataItem.details,

                    }),
                    columns: [
                        {
                            "field": "no",
                            "title": "No",
                            "width": "15px",
                        },
                        {
                            "field": "namaproduk",
                            "title": "Deskripsi",
                            "width": "200px",
                        },
                        {
                            "field": "aturanpakai",
                            "title": "Aturan Pakai",
                            "width": "80px",
                        },
                        {
                            "field": "satuanstandar",
                            "title": "Satuan",
                            "width": "80px",
                        },
                        {
                            "field": "jumlah",
                            "title": "Qty",
                            "width": "40px",
                        },
                        {
                            "field": "kekuatan",
                            "title": "Kekuatan",
                            "width": "80px",                            
                        }

                    ]
                }
            };
           
            $scope.batal = function () {
                delete $scope.item.diagnosaTindakan;
                delete $scope.item.ketTindakan;
                delete $scope.item.jenisDiagnosis;
                delete $scope.item.diagnosa;
                delete $scope.item.keterangan;
            }

            function validasi() {
                var listRawRequired = [
                    "item.diagnosaTindakan|k-ng-model|kode / Nama Diagnosa"
                ]
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var norec_diagnosapasien = "";
                    if ($scope.dataIcd9Selected != undefined) {
                        norec_diagnosapasien = $scope.dataIcd9Selected.norec_diagnosapasien
                    }
                    var ketTindakans = "";
                    if ($scope.item.ketTindakan != undefined) {
                        ketTindakans = $scope.item.ketTindakan
                    }
                    var data = {
                        norec_dp: norec_diagnosapasien,
                        objectpasienfk: norec_apd,
                        tglpendaftaran: moment($scope.item.tglMasuk).format('YYYY-MM-DD hh:mm:ss'),
                        objectdiagnosatindakanfk: $scope.item.diagnosaTindakan.id,
                        keterangantindakan: ketTindakans
                    }

                    $scope.objSave =
                        {
                            detaildiagnosatindakanpasien: data,
                        }
                } else {
                    ModelItem.showMessages(isValid.messages)
                }
            }

            // $scope.saveIcd9Lama = function () {
            //     //  if(medifirstService.getPegawai().jenisPegawai != undefined && medifirstService.getPegawai().jenisPegawai.jenispegawai !='DOKTER'){
            //     //     toastr.error('Hanya Dokter yang bisa mengisi Diagnosis','Peringatan')
            //     //     return
            //     // }
            //     validasi();
            //     console.log(JSON.stringify($scope.objSave));
            //     medifirstService.post('emr/save-diagnosa-tindakan-pasien', $scope.objSave).then(function (e) {

            //         medifirstService.postLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', e.data.data.norec,
            //             'Input Diagnosis ICD 9 ( ' + $scope.item.diagnosaTindakan.kdDiagnosaTindakan + '-' + $scope.item.diagnosaTindakan.namaDiagnosaTindakan + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
            //             + '/ ' + $scope.item.noMr

            //         ).then(function (res) {
            //         })
            //         delete $scope.item.diagnosaTindakan;
            //         delete $scope.item.ketTindakan;
            //         delete $scope.dataIcd9Selected;
            //         loadDiagnosa()
            //     })
            // }

            $scope.saveIcd9 = async function () {
                try {
                    tampungKodeDiagnosa = ''
                    tampungKodeDiagnosaTindakan = ''
                    validasi()
                    console.log(JSON.stringify($scope.objSave))

                    let e = await medifirstService.post('emr/save-diagnosa-tindakan-pasien', $scope.objSave)
                    console.log(e)

                    let x = await getdatagrouping()
                    console.log(x)

                    if (isranap == true && iskelas == 'BPJS') {
                        $scope.dpfk = e.data.data.norec
                        debugger
                        if ($scope.item.diagnosa != undefined) {
                            let result = await $scope.groupingMasal()
                            console.log(result)
                            debugger
                        }
                    }

                    await medifirstService.postLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', e.data.data.norec,
                        'Input Diagnosis ICD 9 ( ' + $scope.item.diagnosaTindakan.kdDiagnosaTindakan + '-' + $scope.item.diagnosaTindakan.namaDiagnosaTindakan + ' )' + ' No Registrasi ' + $scope.item.noregistrasi + '/ ' + $scope.item.noMr
                    )

                    delete $scope.item.diagnosaTindakan
                    delete $scope.item.ketTindakan
                    delete $scope.dataIcd9Selected
                    loadDiagnosa()
                } catch (error) {
                    console.error(error)
                    debugger
                }
            };

            $scope.deleteIcd9 = function () {
                if ($scope.item.diagnosaTindakan == undefined) {
                    alert("Pilih data yang mau di hapus!!")
                    return
                }
                var diagnosa = {
                    norec_dp: $scope.dataIcd9Selected.norec_diagnosapasien
                }
                var objDelete =
                {
                    diagnosa: diagnosa,
                }
                medifirstService.post('emr/delete-diagnosa-tindakan-pasien', objDelete).then(function (e) {
                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaTindakanPasien_T', '',
                        'Hapus Diagnosis ICD 9 ( ' + $scope.dataIcd9Selected.kddiagnosatindakan + '-' + $scope.dataIcd9Selected.namadiagnosatindakan + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
                        + '/ ' + $scope.item.noMr

                    ).then(function (res) {
                    })
                    delete $scope.item.diagnosaTindakan;
                    delete $scope.item.ketTindakan;
                    delete $scope.dataIcd9Selected
                    loadDiagnosa()

                })
            }
            function validasiIcd10() {
                var listRawRequired = [
                    "item.diagnosa|k-ng-model|kode / Nama Diagnosa",
                    "item.jenisDiagnosis|k-ng-model|kode / Jenis Diagnosa"
                ]
                var isValid = ModelItem.setValidation($scope, listRawRequired);
                if (isValid.status) {
                    var norec_diagnosapasien = "";
                    var tglinput = "";
                    if ($scope.dataIcd10Selected != undefined) {
                        norec_diagnosapasien = $scope.dataIcd10Selected.norec_diagnosapasien
                        tglinput = $scope.dataIcd10Selected.tglinputdiagnosa
                    } else {
                        tglinput = moment($scope.now).format('YYYY-MM-DD hh:mm:ss')
                    }
                    var keterangan = "";
                    if ($scope.item.keterangan == undefined) {
                        keterangan = "-"
                    }
                    else {
                        keterangan = $scope.item.keterangan
                    }

                    $scope.now = new Date();
                    debugger;
                    var data = {
                        norec_dp: norec_diagnosapasien,
                        noregistrasifk: norec_apd,
                        tglregistrasi: moment($scope.item.tglMasuk).format('YYYY-MM-DD hh:mm:ss'),
                        objectdiagnosafk: $scope.item.diagnosa.id,
                        objectjenisdiagnosafk: $scope.item.jenisDiagnosis.id,
                        tglinputdiagnosa: tglinput,
                        keterangan: keterangan,
                        kasusbaru: $scope.item.kasusbaru,
                        kasuslama: $scope.item.kasuslama,
                        penyakitponekigd: $scope.poneks.penyakitponekigd
                    }

                    $scope.objSave =
                        {
                            detaildiagnosapasien: data,
                        }
                } else {
                    ModelItem.showMessages(isValid.messages)
                }
            }

            // $scope.saveIcd10Lama = function () {
            //     // if(medifirstService.getPegawai().jenisPegawai != undefined && medifirstService.getPegawai().jenisPegawai.jenispegawai !='DOKTER'){
            //     //     toastr.error('Hanya Dokter yang bisa mengisi Diagnosis','Peringatan')
            //     //     return
            //     // }
            //     if($scope.poneks.idRuangan == 309 || $scope.poneks.idRuangan == 715) {
            //         if($scope.poneks.penyakitponekigd == null && $scope.item.jenisDiagnosis.id == 1) {
            //             toastr.error('Jenis Penyakit Ponek IGD Harus diPilih !')
            //             return
            //         }
            //     } 
            //     tampungKodeDiagnosa = ''
            //     tampungKodeDiagnosaTindakan = ''
            //     validasiIcd10();
            //     console.log(JSON.stringify($scope.objSave));
                
            //     medifirstService.post('emr/save-diagnosa-pasien', $scope.objSave).then(function (e) {
            //         if (isranap == true && iskelas == 'BPJS') {
            //             $scope.dpfk = e.data.norec_dp
            //             $scope.groupingMasal()
            //         }
            //         $scope.savePeriksaDokter()
            //         medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', e.data.data.norec,
            //             'Input Diagnosis ICD 10 ( ' + $scope.item.diagnosa.kdDiagnosa + '-' + $scope.item.diagnosa.namaDiagnosa + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
            //             + '/ ' + $scope.item.noMr
            //         ).then(function (res) {     

            //         })

            //              $scope.hasilgrouping = true
            //         delete $scope.item.jenisDiagnosis;
            //         // delete $scope.item.diagnosa;
            //         delete $scope.item.keterangan;
            //         delete $scope.dataIcd10Selected;
            //         delete $scope.poneks.penyakitponekigd;
            //         loadDiagnosa()
            //     })
            // }

            $scope.saveIcd10 = async function () {
                try {
                    if($scope.poneks.idRuangan == 309 || $scope.poneks.idRuangan == 715) {
                        if($scope.poneks.penyakitponekigd == null && $scope.item.jenisDiagnosis.id == 1) {
                            toastr.error('Jenis Penyakit Ponek IGD Harus diPilih !')
                            return
                        }
                    } 

                    tampungKodeDiagnosa = ''
                    tampungKodeDiagnosaTindakan = ''
                    validasiIcd10();
                    console.log(JSON.stringify($scope.objSave));

                    let e = await medifirstService.post('emr/save-diagnosa-pasien', $scope.objSave)
                    console.log(e)

                    let x = await getdatagrouping()
                    console.log(x)

                    if (isranap == true && iskelas == 'BPJS') {
                        $scope.dpfk = e.data.norec_dp
                        debugger
                        let result = await $scope.groupingMasal()
                        console.log(result)
                    }

                    await medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', e.data.data.norec,
                        'Input Diagnosis ICD 10 ( ' + $scope.item.diagnosa.kdDiagnosa + '-' + $scope.item.diagnosa.namaDiagnosa + ' )' + ' No Registrasi ' + $scope.item.noregistrasi + '/ ' + $scope.item.noMr
                    )

                    $scope.hasilgrouping = true
                    delete $scope.item.jenisDiagnosis;
                    delete $scope.item.keterangan;
                    delete $scope.dataIcd10Selected;
                    delete $scope.poneks.penyakitponekigd;
                    loadDiagnosa()
                } catch (error) {
                    console.error(error)
                    debugger
                }
            };

            $scope.savePeriksaDokter=  function(){
                
                    var kelompokUser = medifirstService.getKelompokUser()
                    // var chacePeriode = cacheHelper.get('InputTindakanPelayananDokterRevCtrl');
                    if(kelompokUser== 'dokter' ){
                        var data ={
                        "norec_apd" :norec_apd,
                        "kelompokUser" : kelompokUser
                    }
                    medifirstService.postNonMessage('rawatjalan/save-periksa',data)
                    .then(function (res) {
                    })
                    }
                }
            $scope.deleteIcd10 = function () {
                if ($scope.item.diagnosa == undefined) {
                    alert("Pilih data yang mau di hapus!!")
                    return
                }
                var diagnosa = {
                    norec_dp: $scope.dataIcd10Selected.norec_diagnosapasien
                }
                var objDelete =
                {
                    diagnosa: diagnosa,
                }
                medifirstService.post('emr/delete-diagnosa-pasien', objDelete).then(function (e) {
                    medifirstService.postLogging('Diagnosis', 'Norec DiagnosaPasien_T', '',
                        'Hapus Diagnosis ICD 10 ( ' + $scope.dataIcd10Selected.kddiagnosa + '-' + $scope.dataIcd10Selected.namadiagnosa + ' )' + ' No Registrasi ' + $scope.item.noregistrasi
                        + '/ ' + $scope.item.noMr

                    ).then(function (res) {
                    })
                    delete $scope.item.jenisDiagnosis;
                    delete $scope.item.diagnosa;
                    delete $scope.item.keterangan;
                    delete $scope.dataIcd10Selected;
                    delete $scope.poneks.penyakitponekigd;
                    loadDiagnosa()
                    getdatagrouping()
                })
            }


            $scope.back = function () {
                $state.go('DaftarAntrianDokterRajal')
            }
            $scope.showInputDiagnosaDokter = function () {
                var arrStr = cacheHelper.get('CacheInputDiagnosaDokter');
                cacheHelper.set('CacheInputDiagnosaDokter', arrStr);
                $state.go('InputDiagnosaDokter')
            }
            $scope.resep = function () {
                var arrStr = cacheHelper.get('CacheInputDiagnosaDokter');
                cacheHelper.set('InputResepApotikOrderRevCtrl', arrStr);
                $state.go('InputResepApotikOrderRev')
            }
            $scope.inputTindakanDokter = function () {
                var arrStr = cacheHelper.get('CacheInputDiagnosaDokter')
                cacheHelper.set('InputTindakanPelayananDokterRevCtrl', arrStr);
                $state.go('InputTindakanPelayananDokterRev', {
                    norecPD: norec_pd,
                    norecAPD: norec_apd,

                });
            }
            $scope.laboratorium = function () {
                var arrStr = cacheHelper.get('CacheInputDiagnosaDokter')
                cacheHelper.set('TransaksiPelayananLaboratoriumDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananLaboratoriumDokterRev')
            }
            $scope.radiologi = function () {
                var arrStr = cacheHelper.get('CacheInputDiagnosaDokter')
                cacheHelper.set('TransaksiPelayananRadiologiDokterRevCtrl', arrStr);
                $state.go('TransaksiPelayananRadiologiDokterRev')
            }
            $scope.rekamMedisElektronik = function () {
                var arrStr = cacheHelper.get('CacheInputDiagnosaDokter');
                cacheHelper.set('cacheRMelektronik', arrStr);
                $state.go('RekamMedisElektronik')
            }
            $scope.inputCPPT = function () {
                var arrStr = cacheHelper.get('CacheInputDiagnosaDokter');
                cacheHelper.set('cacheCPPT', arrStr);
                $state.go('CPPT')
            }
            async function getdatagrouping() {
                tampungKodeDiagnosa = ''
                tampungKodeDiagnosaTindakan = ''
                var reg = noreg
                medifirstService.get("bridging/inacbg/get-daftar-informasi-tanggungan?noreg=" +  reg +"&kelId=2" 
				).then(function (data) { 
					$scope.isRouteLoading = false;
					$scope.datagroup = data.data[0] 
                    $scope.hasilgrouping = true 
                    $scope.tarifrs = $scope.formatRupiah($scope.datagroup.totaltagihan, 'Rp.')
                    $scope.biayanaikkelas = $scope.datagroup.biayanaikkelas == null ? $scope.formatRupiah(0, 'Rp.') :  $scope.formatRupiah($scope.datagroup.biayanaikkelas, 'Rp.');
                    $scope.tarifinacbg = $scope.datagroup.totalpiutangpenjamin == null ? $scope.formatRupiah(0, 'Rp.'): $scope.formatRupiah($scope.datagroup.totalpiutangpenjamin, 'Rp.');
                    var diff = Math.abs(new Date() - new Date($scope.datagroup.tglregistrasi))
                    var lamadirawat = Math.ceil(diff / 1000 / 60 / 60 / 24) + ' hari'
                    $scope.datagroup.lamadirawat = lamadirawat 
                    var jenis_rawat = 1 //ranap
                    if ($scope.datagroup.deptid != 16) {
                        jenis_rawat = 2
                    }
                    var upgrade_class_ind = 0
                    var upgrade_class_class = ''
                    var add_payment_pct = 0
                    if ($scope.datagroup.nokelasdijamin > $scope.datagroup.nokelasdaftar) {
                        upgrade_class_ind = 1
                        upgrade_class_class = $scope.datagroup.namakelasdaftar
                        add_payment_pct = 0
                    } 
                    var discharge_status = 0
                    if ($scope.datagroup.objectstatuspulangfk == 1 || $scope.datagroup.objectstatuspulangfk == 6) {
                        discharge_status = 1
                    } else if ($scope.datagroup.objectstatuspulangfk == 4 || $scope.datagroup.objectstatuspulangfk == 5 || $scope.datagroup.objectstatuspulangfk == 10 ||
                        $scope.datagroup.objectstatuspulangfk == 11) {
                        discharge_status = 2
                    } else if ($scope.datagroup.objectstatuspulangfk == 2 || $scope.datagroup.objectstatuspulangfk == 8 || $scope.datagroup.objectstatuspulangfk == 3) {
                        discharge_status = 3
                    } else if ($scope.datagroup.objectstatuspulangfk == 9) {
                        discharge_status = 4
                    } else {
                        discharge_status = 5
                    }
                    if (jenis_rawat == 2) {
                        $scope.datagroup.nokelasdijamin = ''
                    }
                    $scope.datagroup = {
                        "nomor_sep": $scope.datagroup.nosep,    //"0901R001TEST0001",    
                        "nomor_kartu": $scope.datagroup.nokepesertaan,    //"233333",    
                        "tgl_masuk": $scope.datagroup.tglregistrasi,    //"2017-11-20 12:55:00",    
                        "tgl_pulang": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),//$scope.datagroup.tglpulang,    //"2017-12-01 09:55:00",    
                        "jenis_rawat": jenis_rawat,    //"1",    
                        "kelas_rawat": $scope.datagroup.nokelasdijamin,    //"1",    
                        "adl_sub_acute": '',    //"15",    
                        "adl_chronic": '',    //"12",    
                        "icu_indikator": '',    //"1",    
                        "icu_los": '',    //"2",    
                        "ventilator_hour": '',    //"5",    
                        "upgrade_class_ind": upgrade_class_ind,    //"1",    
                        "upgrade_class_class": upgrade_class_class,    //"vip",    
                        "upgrade_class_los": '',    //"5",    
                        "add_payment_pct": '',    //"35",    
                        "birth_weight": '',    //"0",    
                        "discharge_status": discharge_status,    //"1",    
                        "diagnosa": $scope.datagroup.icd10,    //"S71.0#A00.1",    
                        "procedure": $scope.datagroup.icd9,    //"81.52#88.38",    
                        "tarif_rs": {
                            "prosedur_non_bedah": $scope.datagroup.tarif_rs.prosedur_non_bedah,    //"300000",      
                            "prosedur_bedah": $scope.datagroup.tarif_rs.prosedur_bedah,    //"20000000",      
                            "konsultasi": $scope.datagroup.tarif_rs.konsultasi,    //"300000",      
                            "tenaga_ahli": $scope.datagroup.tarif_rs.tenaga_ahli,    //"200000",      
                            "keperawatan": $scope.datagroup.tarif_rs.keperawatan,    // "80000",      
                            "penunjang": $scope.datagroup.tarif_rs.penunjang,    //"1000000",      
                            "radiologi": $scope.datagroup.tarif_rs.radiologi,    //"500000",      
                            "laboratorium": $scope.datagroup.tarif_rs.laboratorium,    //"600000",      
                            "pelayanan_darah": $scope.datagroup.tarif_rs.pelayanan_darah,    //"150000",      
                            "rehabilitasi": $scope.datagroup.tarif_rs.rehabilitasi,    //"100000",      
                            "kamar": $scope.datagroup.tarif_rs.kamar,    //"6000000",      
                            "rawat_intensif": $scope.datagroup.tarif_rs.rawat_intensif,    //"2500000",      
                            "obat": $scope.datagroup.tarif_rs.obat,    //"2000000",      
                            "obat_kronis": $scope.datagroup.tarif_rs.obat_kronis,    //"2000000",      
                            "obat_kemoterapi": $scope.datagroup.tarif_rs.obat_kemoterapi,    //"2000000",      
                            "alkes": $scope.datagroup.tarif_rs.alkes,    //"500000",      
                            "bmhp": $scope.datagroup.tarif_rs.bmhp,    //"400000",      
                            "sewa_alat": $scope.datagroup.tarif_rs.sewa_alat,    //"210000"    
                        },
                        "tarif_poli_eks": 0,    //"100000",    
                        "nama_dokter": $scope.datagroup.namadokter,    //"RUDY, DR",    
                        "kode_tarif": $scope.datagroup.kodetarif,    //'RSAB',    //"AP",    
                        "payor_id": '3',    //"3",    
                        "payor_cd": 'JKN',    //"JKN",    
                        "cob_cd": '#',    //"0001",    
                        "coder_nik": $scope.datagroup.codernik,    //"123123123123"  
                        "nomor_rm": $scope.datagroup.nocm,    //"123-45-28",
                        "nama_pasien": $scope.datagroup.namapasien,    //"Efan Andrian",
                        "tgl_lahir": $scope.datagroup.tgllahir,    //"1985-01-01 02:00:00",
                        "gender": $scope.datagroup.objectjeniskelaminfk,    //"2"
                        "norec_pd": $scope.datagroup.norec
                    }
                       
                   
                 
					 
                })
            }

            // $scope.groupingMasalLama = function () {
			// 	$scope.isRouteLoading = true;

			// 	var dt1 = {}
			// 	var dt2 = []

			// 		dt1 = {
			// 			"metadata": {
			// 				"method": "new_claim"
			// 			},
			// 			"data": {
			// 				"nomor_kartu": $scope.datagroup.nomor_kartu,
			// 				"nomor_sep": $scope.datagroup.nomor_sep,
			// 				"nomor_rm": $scope.datagroup.nomor_rm,
			// 				"nama_pasien": $scope.datagroup.nama_pasien,
			// 				"tgl_lahir": $scope.datagroup.tgl_lahir,
			// 				"gender": $scope.datagroup.gender
			// 			}
			// 		}
			// 		dt2.push(dt1)

			// 	var objData = {
			// 		"data": dt2
			// 	}
			// 	// medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function(e)
			// 	medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
            //                 // LoadData();
            //                 var dt1 = {}
            //                 var dt2 = []


            //                 dt1 = {
            //                     "metadata": {
            //                         "method": "set_claim_data",
            //                         "nomor_sep": $scope.datagroup.nomor_sep
            //                     },
            //                     "data": {
            //                         "nomor_sep": $scope.datagroup.nomor_sep,    //"0901R001TEST0001",    
            //                         "nomor_kartu": $scope.datagroup.nomor_kartu,    //"233333",    
            //                         "tgl_masuk": $scope.datagroup.tgl_masuk,    //"2017-11-20 12:55:00",    
            //                         "tgl_pulang": $scope.datagroup.tgl_pulang,    //"2017-12-01 09:55:00",    
            //                         "jenis_rawat": $scope.datagroup.jenis_rawat,    //"1",    
            //                         "kelas_rawat": $scope.datagroup.kelas_rawat,    //ini adalah kelas tanggungan BPJS   
            //                         "adl_sub_acute": $scope.datagroup.adl_sub_acute,    //"15",    
            //                         "adl_chronic": $scope.datagroup.adl_chronic,    //"12",    
            //                         "icu_indikator": $scope.datagroup.icu_indikator,    //"1",    
            //                         "icu_los": $scope.datagroup.icu_los,    //"2",    
            //                         "ventilator_hour": $scope.datagroup.ventilator_hour,    //"5",    
            //                         "upgrade_class_ind": $scope.datagroup.upgrade_class_ind,    //"1",    
            //                         "upgrade_class_class": $scope.datagroup.upgrade_class_class,    //"vip",    
            //                         "upgrade_class_los": $scope.datagroup.upgrade_class_los,    //"5",    
            //                         "add_payment_pct": "75",    //"35",    
            //                         "birth_weight": $scope.datagroup.birth_weight,    //"0",    
            //                         "discharge_status": $scope.datagroup.discharge_status,    //"1",    
            //                         "diagnosa":$scope.item.diagnosa.kdDiagnosa,    //"S71.0#A00.1",    
			// 					"procedure": $scope.datagroup.procedure,    //"81.52#88.38",    
            //                         "tarif_rs": {
            //                             "prosedur_non_bedah": $scope.datagroup.tarif_rs.prosedur_non_bedah,    //"300000",      
            //                             "prosedur_bedah": $scope.datagroup.tarif_rs.prosedur_bedah,    //"20000000",      
            //                             "konsultasi": $scope.datagroup.tarif_rs.konsultasi,    //"300000",      
            //                             "tenaga_ahli": $scope.datagroup.tarif_rs.tenaga_ahli,    //"200000",      
            //                             "keperawatan": $scope.datagroup.tarif_rs.keperawatan,    // "80000",      
            //                             "penunjang": $scope.datagroup.tarif_rs.penunjang,    //"1000000",      
            //                             "radiologi": $scope.datagroup.tarif_rs.radiologi,    //"500000",      
            //                             "laboratorium": $scope.datagroup.tarif_rs.laboratorium,    //"600000",      
            //                             "pelayanan_darah": $scope.datagroup.tarif_rs.pelayanan_darah,    //"150000",      
            //                             "rehabilitasi": $scope.datagroup.tarif_rs.rehabilitasi,    //"100000",      
            //                             "kamar": $scope.datagroup.tarif_rs.kamar,    //"6000000",      
            //                             "rawat_intensif": $scope.datagroup.tarif_rs.rawat_intensif,    //"2500000",      
            //                             "obat": $scope.datagroup.tarif_rs.obat,    //"2000000",  
            //                             "obat_kronis": "0",
            //                             "obat_kemoterapi": "0",
            //                             "alkes": $scope.datagroup.tarif_rs.alkes,    //"500000",      
            //                             "bmhp": $scope.datagroup.tarif_rs.bmhp,    //"400000",      
            //                             "sewa_alat": $scope.datagroup.tarif_rs.sewa_alat,    //"210000"    
            //                         },
            //                         "tarif_poli_eks": $scope.datagroup.tarif_poli_eks,    //"100000",    
            //                         "nama_dokter": $scope.datagroup.nama_dokter,    //"RUDY, DR",    
            //                         "kode_tarif": $scope.datagroup.kode_tarif,    //"AP",    
            //                         "payor_id": $scope.datagroup.payor_id,    //"3",    
            //                         "payor_cd": $scope.datagroup.payor_cd,    //"JKN",    
            //                         "cob_cd": $scope.datagroup.cob_cd,    //"0001",    
            //                         "coder_nik": "123123123123"
            //                     }
            //                 }
            //                 dt2.push(dt1)
    
            //             var objData = {
            //                 "data": dt2
            //             }
            //             medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
            //                 // LoadData();	
            //                 var dt1 = {}
            //                 var dt2 = []
    
            //                     dt1 = {
            //                         "metadata": {
            //                             "method": "grouper",
            //                             "stage": "1"
            //                         },
            //                         "data": {
            //                             "nomor_sep": $scope.datagroup.nomor_sep
            //                         }
            //                     }
            //                     dt2.push(dt1) 



            //                 var objData = {
            //                     "data": dt2
            //                 }
            //                 medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
            //                     var proporsiPush = []
            //                     var dijamin = "0"
                                
            //                     for (var x = e.data.dataresponse.length - 1; x >= 0; x--) {
            //                         if (e.data.dataresponse[x].dataresponse.metadata.code != 400) {
            //                             if ($scope.datagroup.nomor_sep == e.data.dataresponse[x].datarequest.data.nomor_sep) {
            //                                 dijamin = e.data.dataresponse[x].dataresponse.response.cbg.tariff
            //                                 if (dijamin == undefined) { dijamin = "0" }
                                            
            //                                 var dataproposi = {
            //                                     "noregistrasifk": $scope.datagroup.norec_pd,
            //                                     "totalDijamin": dijamin,//e.data.dataresponse[x].dataresponse.response.cbg.tariff,
            //                                     "biayaNaikkelas": "0",
            //                                     "diagnosa": $scope.item.diagnosa.kdDiagnosa,
            //                                     "tglcek": moment($scope.now).format('YYYY-MM-DD'),
            //                                     "norec_dpfk": $scope.dpfk
            //                                 }
            //                                 proporsiPush.push(dataproposi) 
            //                                 delete $scope.item.diagnosa;
            //                             }
            //                         }
            //                     } 
            //                     var objData = {
            //                         "data": proporsiPush
            //                     }
            //                     var objData2 = {
            //                         "proporsi": proporsiPush
            //                     }
            //                     if (objData.data.length == 0) {
            //                         var dt1 = {}
            //                         var dt2 = []
                        
            //                             dt1 = {
            //                                 "metadata": {
            //                                     "method": "delete_claim"
            //                                 },
            //                                 "data": {
            //                                     "nomor_sep": $scope.datagroup.nomor_sep,///$scope.dataPasienSelected.nosep,
            //                                     "coder_nik": '123123123123',//$scope.datagroup.coder_nik   
            //                                 }
            //                             }
            //                             dt2.push(dt1)
                                    
            //                         var objData = {
            //                             "data": dt2
            //                         }
            //                         medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
            //                             //
            //                             $scope.isRouteLoading = false;
            //                             responData = e.data.dataresponse;
            //                             toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
            //                             getdatagrouping();
            //                         })
            //                     } else {
            //                         // medifirstService.saveInformasiTanggungan(objData).then(function (e)
            //                         medifirstService.post('bridging/inacbg/save-informasi-tanggungan', objData2).then(function (e) {

            //                             //ini untuk proposional kan utang per tindakan
            //                             var dt1 = {}
            //                             var dt2 = []
            //                             // for (var i = dataSave.length - 1; i >= 0; i--) {
            //                                 dt1 = {
            //                                     "metadata": {
            //                                         "method": "delete_claim"
            //                                     },
            //                                     "data": {
            //                                         "nomor_sep": $scope.datagroup.nomor_sep,///$scope.dataPasienSelected.nosep,
            //                                         "coder_nik": '123123123123',//$scope.datagroup.coder_nik   
            //                                     }
            //                                 }
            //                                 dt2.push(dt1)
            //                             // }
            //                             var objData = {
            //                                 "data": dt2
            //                             }
            //                             medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) { 
            //                                 getdatagrouping();
            //                                 $scope.isRouteLoading = false;
            //                                 responData = e.data.dataresponse;
            //                                 toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
            //                             })
            //                         })
            //                     }
            //                     // loadData()
            //                 })
            //             })

			// 	})
			// }

            $scope.groupingMasal = function () {
                return new Promise(function (resolve, reject) {
                    $scope.isRouteLoading = true;

                    var datas = {}
                    var dt1 = {}
                    var dt2 = []

                        dt1 = {
                            "metadata": {
                                "method": "new_claim"
                            },
                            "data": {
                                "nomor_kartu": $scope.datagroup.nomor_kartu,
                                "nomor_sep": $scope.datagroup.nomor_sep,
                                "nomor_rm": $scope.datagroup.nomor_rm,
                                "nama_pasien": $scope.datagroup.nama_pasien,
                                "tgl_lahir": $scope.datagroup.tgl_lahir,
                                "gender": $scope.datagroup.gender
                            }
                        }
                        dt2.push(dt1)

                    var objData = {
                        "data": dt2
                    }
                    // medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function(e)
                    medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                        debugger
                        datas = {
                            "data_new_claim": e.data.dataresponse[0]
                        }
                        tampungKodeDiagnosa = $scope.datagroup.diagnosa ? $scope.datagroup.diagnosa : ''
                        tampungKodeDiagnosaTindakan = $scope.datagroup.procedure ? $scope.datagroup.procedure : ''
                        console.log(tampungKodeDiagnosa)
                        console.log(tampungKodeDiagnosaTindakan)

                        if (e.data.dataresponse[0].dataresponse.metadata.error_no == 'E2007') {
                            var dt1 = {}
                            var dt2 = []

                                dt1 = {
                                    "metadata": {
                                        "method": "update_patient",
                                        "nomor_rm": $scope.datagroup.nomor_rm
                                    },
                                    "data": {
                                        "nomor_kartu": $scope.datagroup.nomor_kartu,
                                        "nomor_rm": $scope.datagroup.nomor_rm,
                                        "nama_pasien": $scope.datagroup.nama_pasien,
                                        "tgl_lahir": $scope.datagroup.tgl_lahir,
                                        "gender": $scope.datagroup.gender
                                    }
                                }
                                dt2.push(dt1)

                            var objData = {
                                "data": dt2
                            }

                            medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                                debugger
                                        datas = {
                                    "update_patient": e.data.dataresponse[0]
                                }

                                // LoadData();
                                var dt1 = {}
                                var dt2 = []

                                    dt1 = {
                                        "metadata": {
                                            "method": "set_claim_data",
                                            "nomor_sep": $scope.datagroup.nomor_sep
                                        },
                                        "data": {
                                            "nomor_sep": $scope.datagroup.nomor_sep,    //"0901R001TEST0001",    
                                            "nomor_kartu": $scope.datagroup.nomor_kartu,    //"233333",    
                                            "tgl_masuk": $scope.datagroup.tgl_masuk,    //"2017-11-20 12:55:00",    
                                            "tgl_pulang": $scope.datagroup.tgl_pulang,    //"2017-12-01 09:55:00",    
                                            "jenis_rawat": $scope.datagroup.jenis_rawat,    //"1",    
                                            "kelas_rawat": $scope.datagroup.kelas_rawat,    //ini adalah kelas tanggungan BPJS   
                                            "adl_sub_acute": $scope.datagroup.adl_sub_acute,    //"15",    
                                            "adl_chronic": $scope.datagroup.adl_chronic,    //"12",    
                                            "icu_indikator": $scope.datagroup.icu_indikator,    //"1",    
                                            "icu_los": $scope.datagroup.icu_los,    //"2",    
                                            "ventilator_hour": $scope.datagroup.ventilator_hour,    //"5",    
                                            "upgrade_class_ind": $scope.datagroup.upgrade_class_ind,    //"1",    
                                            "upgrade_class_class": $scope.datagroup.upgrade_class_class,    //"vip",    
                                            "upgrade_class_los": $scope.datagroup.upgrade_class_los,    //"5",    
                                            "add_payment_pct": "75",    //"35",    
                                            "birth_weight": $scope.datagroup.birth_weight,    //"0",    
                                            "discharge_status": $scope.datagroup.discharge_status,    //"1",    
                                            "diagnosa": tampungKodeDiagnosa,    //"S71.0#A00.1",    
                                            "procedure": tampungKodeDiagnosaTindakan,    //"81.52#88.38",    
                                            "tarif_rs": {
                                                "prosedur_non_bedah": $scope.datagroup.tarif_rs.prosedur_non_bedah,    //"300000",      
                                                "prosedur_bedah": $scope.datagroup.tarif_rs.prosedur_bedah,    //"20000000",      
                                                "konsultasi": $scope.datagroup.tarif_rs.konsultasi,    //"300000",      
                                                "tenaga_ahli": $scope.datagroup.tarif_rs.tenaga_ahli,    //"200000",      
                                                "keperawatan": $scope.datagroup.tarif_rs.keperawatan,    // "80000",      
                                                "penunjang": $scope.datagroup.tarif_rs.penunjang,    //"1000000",      
                                                "radiologi": $scope.datagroup.tarif_rs.radiologi,    //"500000",      
                                                "laboratorium": $scope.datagroup.tarif_rs.laboratorium,    //"600000",      
                                                "pelayanan_darah": $scope.datagroup.tarif_rs.pelayanan_darah,    //"150000",      
                                                "rehabilitasi": $scope.datagroup.tarif_rs.rehabilitasi,    //"100000",      
                                                "kamar": $scope.datagroup.tarif_rs.kamar,    //"6000000",      
                                                "rawat_intensif": $scope.datagroup.tarif_rs.rawat_intensif,    //"2500000",      
                                                "obat": $scope.datagroup.tarif_rs.obat,    //"2000000",  
                                                "obat_kronis": "0",
                                                "obat_kemoterapi": "0",
                                                "alkes": $scope.datagroup.tarif_rs.alkes,    //"500000",      
                                                "bmhp": $scope.datagroup.tarif_rs.bmhp,    //"400000",      
                                                "sewa_alat": $scope.datagroup.tarif_rs.sewa_alat,    //"210000"    
                                            },
                                            "tarif_poli_eks": $scope.datagroup.tarif_poli_eks,    //"100000",    
                                            "nama_dokter": $scope.datagroup.nama_dokter,    //"RUDY, DR",    
                                            "kode_tarif": $scope.datagroup.kode_tarif,    //"AP",    
                                            "payor_id": $scope.datagroup.payor_id,    //"3",    
                                            "payor_cd": $scope.datagroup.payor_cd,    //"JKN",    
                                            "cob_cd": $scope.datagroup.cob_cd,    //"0001",    
                                            "coder_nik": "123123123123"
                                        }
                                    }
                                    dt2.push(dt1)

                                var objData = {
                                    "data": dt2
                                }
                                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                                    debugger
                                    if (e.data.dataresponse[0].dataresponse.metadata.code == 200) {
                                        toastr.info(e.data.dataresponse[0].dataresponse.metadata.message, 'INACBG')
                                    } else {
                                        toastr.error(e.data.dataresponse[0].dataresponse.metadata.message, 'INACBG')
                                    }
                                    datas = {
                                        "set_claim_data": e.data.dataresponse[0]
                                    }

                                    // LoadData();	
                                    var dt1 = {}
                                    var dt2 = []

                                        dt1 = {
                                            "metadata": {
                                                "method": "grouper",
                                                "stage": "1"
                                            },
                                            "data": {
                                                "nomor_sep": $scope.datagroup.nomor_sep
                                            }
                                        }
                                        dt2.push(dt1) 

                                    var objData = {
                                        "data": dt2
                                    }
                                    medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                                        debugger
                                        if (e.data.dataresponse[0].dataresponse.metadata.code == 200) {
                                            toastr.info(e.data.dataresponse[0].dataresponse.metadata.message, 'INACBG')
                                        } else {
                                            toastr.error(e.data.dataresponse[0].dataresponse.metadata.message, 'INACBG')
                                        }
                                        datas = {
                                            "grouper": e.data.dataresponse[0]
                                        }

                                        var proporsiPush = []
                                        var dijamin = "0"
                                        
                                        for (var x = e.data.dataresponse.length - 1; x >= 0; x--) {
                                            if (e.data.dataresponse[x].dataresponse.metadata.code != 400) {
                                                if ($scope.datagroup.nomor_sep == e.data.dataresponse[x].datarequest.data.nomor_sep) {
                                                    dijamin = e.data.dataresponse[x].dataresponse.response.cbg.tariff
                                                    if (dijamin == undefined) { dijamin = "0" }
                                                    
                                                    var dataproposi = {
                                                        "noregistrasifk": $scope.datagroup.norec_pd,
                                                        "totalDijamin": dijamin,//e.data.dataresponse[x].dataresponse.response.cbg.tariff,
                                                        "biayaNaikkelas": "0",
                                                        "diagnosa": tampungKodeDiagnosa,
                                                        "tglcek": moment($scope.now).format('YYYY-MM-DD'),
                                                        "norec_dpfk": $scope.dpfk
                                                    }
                                                    proporsiPush.push(dataproposi) 
                                                    delete $scope.item.diagnosa;
                                                }
                                            }
                                        } 
                                        var objData = {
                                            "data": proporsiPush
                                        }
                                        var objData2 = {
                                            "proporsi": proporsiPush
                                        }
                                        if (objData.data.length == 0) {
                                            var dt1 = {}
                                            var dt2 = []

                                                dt1 = {
                                                    "metadata": {
                                                        "method": "delete_claim"
                                                    },
                                                    "data": {
                                                        "nomor_sep": $scope.datagroup.nomor_sep,///$scope.dataPasienSelected.nosep,
                                                        "coder_nik": '123123123123',//$scope.datagroup.coder_nik   
                                                    }
                                                }
                                                dt2.push(dt1)
                                            
                                            var objData = {
                                                "data": dt2
                                            }
                                            medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                                                debugger
                                                datas = {
                                                    "delete_claim": e.data.dataresponse[0]
                                                }

                                                //
                                                $scope.isRouteLoading = false;
                                                responData = e.data.dataresponse;
                                                toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
                                                toastr.info(responData[0].dataresponse.response_inagrouper.drg_description, 'INACBG');
                                                getdatagrouping();
                                            })
                                        } else {
                                            // medifirstService.saveInformasiTanggungan(objData).then(function (e)
                                            medifirstService.post('bridging/inacbg/save-informasi-tanggungan', objData2).then(function (e) {
                                                debugger

                                                //ini untuk proposional kan utang per tindakan
                                                var dt1 = {}
                                                var dt2 = []
                                                // for (var i = dataSave.length - 1; i >= 0; i--) {
                                                    dt1 = {
                                                        "metadata": {
                                                            "method": "delete_claim"
                                                        },
                                                        "data": {
                                                            "nomor_sep": $scope.datagroup.nomor_sep,///$scope.dataPasienSelected.nosep,
                                                            "coder_nik": '123123123123',//$scope.datagroup.coder_nik   
                                                        }
                                                    }
                                                    dt2.push(dt1)
                                                // }
                                                var objData = {
                                                    "data": dt2
                                                }
                                                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) { 
                                                    debugger
                                                    datas = {
                                                        "delete_claim": e.data.dataresponse[0]
                                                    }

                                                    getdatagrouping();
                                                    $scope.isRouteLoading = false;
                                                    responData = e.data.dataresponse;
                                                    toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
                                                    toastr.info(responData[0].dataresponse.response_inagrouper.drg_description, 'INACBG');
                                                })
                                            })
                                        }
                                        // loadData()
                                    })
                                })
                            })
                        } else {
                            // LoadData();
                            var dt1 = {}
                            var dt2 = []

                                dt1 = {
                                    "metadata": {
                                        "method": "set_claim_data",
                                        "nomor_sep": $scope.datagroup.nomor_sep
                                    },
                                    "data": {
                                        "nomor_sep": $scope.datagroup.nomor_sep,    //"0901R001TEST0001",    
                                        "nomor_kartu": $scope.datagroup.nomor_kartu,    //"233333",    
                                        "tgl_masuk": $scope.datagroup.tgl_masuk,    //"2017-11-20 12:55:00",    
                                        "tgl_pulang": $scope.datagroup.tgl_pulang,    //"2017-12-01 09:55:00",    
                                        "jenis_rawat": $scope.datagroup.jenis_rawat,    //"1",    
                                        "kelas_rawat": $scope.datagroup.kelas_rawat,    //ini adalah kelas tanggungan BPJS   
                                        "adl_sub_acute": $scope.datagroup.adl_sub_acute,    //"15",    
                                        "adl_chronic": $scope.datagroup.adl_chronic,    //"12",    
                                        "icu_indikator": $scope.datagroup.icu_indikator,    //"1",    
                                        "icu_los": $scope.datagroup.icu_los,    //"2",    
                                        "ventilator_hour": $scope.datagroup.ventilator_hour,    //"5",    
                                        "upgrade_class_ind": $scope.datagroup.upgrade_class_ind,    //"1",    
                                        "upgrade_class_class": $scope.datagroup.upgrade_class_class,    //"vip",    
                                        "upgrade_class_los": $scope.datagroup.upgrade_class_los,    //"5",    
                                        "add_payment_pct": "75",    //"35",    
                                        "birth_weight": $scope.datagroup.birth_weight,    //"0",    
                                        "discharge_status": $scope.datagroup.discharge_status,    //"1",    
                                        "diagnosa": tampungKodeDiagnosa,    //"S71.0#A00.1",    
                                        "procedure": tampungKodeDiagnosaTindakan,    //"81.52#88.38",    
                                        "tarif_rs": {
                                            "prosedur_non_bedah": $scope.datagroup.tarif_rs.prosedur_non_bedah,    //"300000",      
                                            "prosedur_bedah": $scope.datagroup.tarif_rs.prosedur_bedah,    //"20000000",      
                                            "konsultasi": $scope.datagroup.tarif_rs.konsultasi,    //"300000",      
                                            "tenaga_ahli": $scope.datagroup.tarif_rs.tenaga_ahli,    //"200000",      
                                            "keperawatan": $scope.datagroup.tarif_rs.keperawatan,    // "80000",      
                                            "penunjang": $scope.datagroup.tarif_rs.penunjang,    //"1000000",      
                                            "radiologi": $scope.datagroup.tarif_rs.radiologi,    //"500000",      
                                            "laboratorium": $scope.datagroup.tarif_rs.laboratorium,    //"600000",      
                                            "pelayanan_darah": $scope.datagroup.tarif_rs.pelayanan_darah,    //"150000",      
                                            "rehabilitasi": $scope.datagroup.tarif_rs.rehabilitasi,    //"100000",      
                                            "kamar": $scope.datagroup.tarif_rs.kamar,    //"6000000",      
                                            "rawat_intensif": $scope.datagroup.tarif_rs.rawat_intensif,    //"2500000",      
                                            "obat": $scope.datagroup.tarif_rs.obat,    //"2000000",  
                                            "obat_kronis": "0",
                                            "obat_kemoterapi": "0",
                                            "alkes": $scope.datagroup.tarif_rs.alkes,    //"500000",      
                                            "bmhp": $scope.datagroup.tarif_rs.bmhp,    //"400000",      
                                            "sewa_alat": $scope.datagroup.tarif_rs.sewa_alat,    //"210000"    
                                        },
                                        "tarif_poli_eks": $scope.datagroup.tarif_poli_eks,    //"100000",    
                                        "nama_dokter": $scope.datagroup.nama_dokter,    //"RUDY, DR",    
                                        "kode_tarif": $scope.datagroup.kode_tarif,    //"AP",    
                                        "payor_id": $scope.datagroup.payor_id,    //"3",    
                                        "payor_cd": $scope.datagroup.payor_cd,    //"JKN",    
                                        "cob_cd": $scope.datagroup.cob_cd,    //"0001",    
                                        "coder_nik": "123123123123"
                                    }
                                }
                                dt2.push(dt1)
        
                            var objData = {
                                "data": dt2
                            }
                            medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                                debugger
                                if (e.data.dataresponse[0].dataresponse.metadata.code == 200) {
                                    toastr.info(e.data.dataresponse[0].dataresponse.metadata.message, 'INACBG')
                                } else {
                                    toastr.error(e.data.dataresponse[0].dataresponse.metadata.message, 'INACBG')
                                }
                                datas = {
                                    "set_claim_data": e.data.dataresponse[0]
                                }

                                // LoadData();	
                                var dt1 = {}
                                var dt2 = []
        
                                    dt1 = {
                                        "metadata": {
                                            "method": "grouper",
                                            "stage": "1"
                                        },
                                        "data": {
                                            "nomor_sep": $scope.datagroup.nomor_sep
                                        }
                                    }
                                    dt2.push(dt1) 



                                var objData = {
                                    "data": dt2
                                }
                                medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                                    debugger
                                    if (e.data.dataresponse[0].dataresponse.metadata.code == 200) {
                                        toastr.info(e.data.dataresponse[0].dataresponse.metadata.message, 'INACBG')
                                    } else {
                                        toastr.error(e.data.dataresponse[0].dataresponse.metadata.message, 'INACBG')
                                    }
                                    datas = {
                                        "grouper": e.data.dataresponse[0]
                                    }

                                    var proporsiPush = []
                                    var dijamin = "0"
                                    
                                    for (var x = e.data.dataresponse.length - 1; x >= 0; x--) {
                                        if (e.data.dataresponse[x].dataresponse.metadata.code != 400) {
                                            if ($scope.datagroup.nomor_sep == e.data.dataresponse[x].datarequest.data.nomor_sep) {
                                                dijamin = e.data.dataresponse[x].dataresponse.response.cbg.tariff
                                                if (dijamin == undefined) { dijamin = "0" }
                                                
                                                var dataproposi = {
                                                    "noregistrasifk": $scope.datagroup.norec_pd,
                                                    "totalDijamin": dijamin,//e.data.dataresponse[x].dataresponse.response.cbg.tariff,
                                                    "biayaNaikkelas": "0",
                                                    "diagnosa": tampungKodeDiagnosa,
                                                    "tglcek": moment($scope.now).format('YYYY-MM-DD'),
                                                    "norec_dpfk": $scope.dpfk
                                                }
                                                proporsiPush.push(dataproposi) 
                                                delete $scope.item.diagnosa;
                                            }
                                        }
                                    } 
                                    var objData = {
                                        "data": proporsiPush
                                    }
                                    var objData2 = {
                                        "proporsi": proporsiPush
                                    }
                                    if (objData.data.length == 0) {
                                        var dt1 = {}
                                        var dt2 = []
                            
                                            dt1 = {
                                                "metadata": {
                                                    "method": "delete_claim"
                                                },
                                                "data": {
                                                    "nomor_sep": $scope.datagroup.nomor_sep,///$scope.dataPasienSelected.nosep,
                                                    "coder_nik": '123123123123',//$scope.datagroup.coder_nik   
                                                }
                                            }
                                            dt2.push(dt1)
                                        
                                        var objData = {
                                            "data": dt2
                                        }
                                        medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) {
                                            debugger
                                            datas = {
                                                "delete_claim": e.data.dataresponse[0]
                                            }

                                            //
                                            $scope.isRouteLoading = false;
                                            responData = e.data.dataresponse;
                                            toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
                                            toastr.info(responData[0].dataresponse.response_inagrouper.drg_description, 'INACBG');
                                            getdatagrouping();
                                        })
                                    } else {
                                        // medifirstService.saveInformasiTanggungan(objData).then(function (e)
                                        medifirstService.post('bridging/inacbg/save-informasi-tanggungan', objData2).then(function (e) {
                                            debugger

                                            //ini untuk proposional kan utang per tindakan
                                            var dt1 = {}
                                            var dt2 = []
                                            // for (var i = dataSave.length - 1; i >= 0; i--) {
                                                dt1 = {
                                                    "metadata": {
                                                        "method": "delete_claim"
                                                    },
                                                    "data": {
                                                        "nomor_sep": $scope.datagroup.nomor_sep,///$scope.dataPasienSelected.nosep,
                                                        "coder_nik": '123123123123',//$scope.datagroup.coder_nik   
                                                    }
                                                }
                                                dt2.push(dt1)
                                            // }
                                            var objData = {
                                                "data": dt2
                                            }
                                            medifirstService.post('bridging/inacbg/save-bridging-inacbg', objData).then(function (e) { 
                                                debugger
                                                datas = {
                                                    "delete_claim": e.data.dataresponse[0]
                                                }

                                                getdatagrouping();
                                                $scope.isRouteLoading = false;
                                                responData = e.data.dataresponse;
                                                toastr.info(responData[0].dataresponse.metadata.message, 'INACBG');
                                                toastr.info(responData[0].dataresponse.response_inagrouper.drg_description, 'INACBG');
                                            })
                                        })
                                    }
                                    // loadData()
                                })
                            })
                        }
                    })
                    resolve(datas);
                });
            };

        }

    ]);
});