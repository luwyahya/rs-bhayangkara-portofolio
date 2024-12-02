define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DokumenRekamMedisCtrl', ['$q', '$rootScope', '$scope', 'ModelItem', '$state','CacheHelper', 'DateHelper', 'MedifirstService',
    function($q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService, FormGroup, FormArray, FormBuilder) {
        $scope.now = new Date();
        $scope.item = {};
        $scope.cc = {};

        LoadCacheHelper();
        loadData();

        function LoadCacheHelper() {

            var chacePeriode = cacheHelper.get('cacheRMelektronik');
            if (chacePeriode != undefined) {
                //var arrPeriode = chacePeriode.split(':');
                $scope.cc.nocm = chacePeriode[0]
                $scope.cc.namapasien = chacePeriode[1]
                $scope.cc.jeniskelamin = chacePeriode[2] 
                $scope.cc.noregistrasi = chacePeriode[3]
                $scope.cc.umur = chacePeriode[4]
                $scope.cc.kelompokpasien = chacePeriode[5]
                $scope.cc.tglregistrasi = chacePeriode[6]
                $scope.cc.norec = chacePeriode[7]
                $scope.cc.norec_pd = chacePeriode[8]
                $scope.cc.objectkelasfk = chacePeriode[9]
                $scope.cc.namakelas = chacePeriode[10]
                $scope.cc.objectruanganfk = chacePeriode[11]
                $scope.cc.namaruangan = chacePeriode[12]
                $scope.cc.DataNoregis = chacePeriode[13]
                $scope.cc.norec_emr = '-'
                $scope.item.kdKelompokPasien = chacePeriode[19]
                $scope.cc.objectrekananfk = chacePeriode[22]
                $scope.cc.objectdepartemenfk = chacePeriode[23]
                $scope.cc.nocmfk = chacePeriode[25]
            }
        }

        function loadData() {
            medifirstService.get('emr/get-dokumen-emr-manual?nocmfk=' + $scope.cc.nocmfk).then(function(dat) {                
            //medifirstService.get("registrasi/get-data-list-dokumen?nocmfk=" + $scope.cc.nocmfk).then(function(dat) {    

                debugger
                let dokumen = dat.data.data;
                $scope.sourceDrm = new kendo.data.DataSource({
                    data: dokumen,
                    pageSize: 10,
                    serverPaging: false,
                    schema: {
                        model: {
                            fields: {}
                        }
                    }
                })
                $scope.columnDrm = {
                    selectable: 'row',
                    pageable: true,
                    scrollable: true,
                    columns: [
                        {
                            "field": "namaruangan",
                            "title": "Nama Ruangan",
                            "width": "100px"
                        },
                        /*{
                            "field": "noregistrasi",
                            "title": "No Registrasi",
                            "width": "150px"
                        },*/
                        {
                            "field": "tgldokumen",
                            "title": "Tgl Dokumen",
                            "width": "150px"
                        },
                        {
                            field: "detail",
                            title: "Dokumen Yang Sudah Di Upload",
                            width: "80%",
                            "template": "<button class=\"k-button custom-button\" ng-click=\"setLihatDokumen(dataItem)\"  style=\"margin:0 0 5px\">#:  detail #</button> ",
                        }
                        /*{
                            field: "detail",
                            title: "Dokumen Yang Sudah Di Upload",
                            width: "80%", 
                            "template": "# for(var i=0; i < detail.length;i++){# <span class=\"button-details\" )\" >#= detail[i].jenisdokumen #  <em class=\"k-button k-button-icon k-primary\"" +
                            " style=\" margin: 3px;padding-left: .4em;padding-right: .4em;\"  ng-click=\"detail('#=detail[i].jenisdokumen#','#=detail[i].norec_dokumen#') \" > <span class=\"k-sprite k-icon k-i-search\"  style=\"float: left;margin-top: 0.3em;padding-bottom: 2px;\" >Dokumen</span></em></span> #}#",
                        }*/
                    ]
                };
            })
        }
        $scope.setLihatDokumen = (dataItem) => {
            console.log(dataItem);
            medifirstService.get('emr/get-dokumen-rekam-medis?norec=' + dataItem.norec).then(function(dat) {
                var dokumen = dat.data[0].uploadfile;
                var type = dat.data[0].namafile;
                var typeFile = type.split(".")
                var extension = typeFile[1];
                let extensionFile;
                console.log(extension)
                if(extension == "jpg"){
                    extensionFile = "image/webp";
                } else{
                    extensionFile = "application/pdf";
                }
                // console.log(extension);
                const win = window.open("","_blank");
                let html = '';

                html += '<html>';
                html += '<body style="margin:0!important">';
                html += '<embed width="100%" height="100%" src="'+dokumen+'" type="'+extensionFile+'" />';
                html += '</body>';
                html += '</html>';

                setTimeout(() => {
                win.document.write(html);
                }, 0);
            });
        }
        
        $scope.detail = function (norec_dokumen) {
            medifirstService.get('emr/get-dokumen-upload?norec=' + norec_dokumen).then(function(dat) {
                let dokumen = dat.data
                for(let i = 0; i < dokumen.length; i++) {
                    const win = window.open("","_blank");
                        let html = '';
        
                        html += '<html>';
                        html += '<body style="margin:0!important">';
                        html += '<embed width="100%" height="100%" src="'+dokumen[i].dokumen+'" type="application/pdf" />';
                        html += '</body>';
                        html += '</html>';
        
                        setTimeout(() => {
                        win.document.write(html);
                        }, 0);
                }
            })
        }
        $scope.ubahTanggalDokumen = function () {
            if ($scope.dataSelected == undefined) {
                toastr.error('Pilih Dahulu Datanya !')
                return
            }
            $scope.item.ubahTanggal = moment($scope.dataSelected.tgldokumen).format('YYYY-MM-DD HH:mm')
            $scope.popUpUbahTanggal.center().open();
        }
        $scope.ubahTanggalDokumen2 = function () {
            var objSave = {
                tanggalNew: moment($scope.item.ubahTanggal).format('YYYY-MM-DD HH:mm'),
                norec: $scope.dataSelected.norec
            }
            medifirstService.post('emr/ubah-tanggal-dokumen', objSave).then(function (e) {
                loadData()
                $scope.popUpUbahTanggal.close();
            })
        }
    }
])
})