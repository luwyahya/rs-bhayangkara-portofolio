
define(['initialize'], function(initialize) {
    'use strict';
    initialize.controller('DaftarPasienMeninggalJCtrl', ['$state', '$rootScope', '$scope', 'DateHelper', 'MedifirstService',
        function($state, $rootScope, $scope, dateHelper, medifirstService) {
            $scope.title = "Daftar Pasien Meninggal";
            $scope.dataVOloaded = false;
            $scope.isRouteLoading=false;
            $scope.now = new Date();
            $scope.item = {
                from: $scope.now,
                until: $scope.now
            };
            $scope.findData = function() {
                $scope.isRouteLoading=true;
                var tglAwal = moment($scope.item.from).format('YYYY-MM-DD');
                var tglAkhir = moment($scope.item.until).format('YYYY-MM-DD');

                var reg =""
                if ($scope.item.noReg != undefined){
                    var reg ="&noReg=" +$scope.item.noReg
                }
                var rm =""
                if ($scope.item.noRm != undefined){
                    var rm ="&noCm=" +$scope.item.noRm
                }  
                 var nama =""
                if ($scope.item.namaPasien != undefined){
                    var nama ="&namaPasien=" +$scope.item.namaPasien
                }   

                medifirstService.get("jenazah/get-daftar-pasien-meninggal?"+
                    "tglAwal="+tglAwal+
                    "&tglAkhir="+tglAkhir
                    +reg
                    +rm
                    +nama).then(function(e){
                      $scope.isRouteLoading=false;
                      var datas =e.data.data;
                      for (var i = datas.length - 1; i >= 0; i--) {
                            datas[i].no = i + 1
                      }
                      $scope.dataPasienBatal = new kendo.data.DataSource({
                        data: datas,
                        pageable: true,
                        pageSize: 10,
                        total: datas.length,
                        serverPaging: false,                       
                    });
                  })

                }
                $scope.formatTanggal = function(tanggal){
                    return moment(tanggal).format('DD-MMM-YYYY HH:mm');
                }
                $scope.findData();
                $scope.mainGridOptions = {
                    toolbar:["excel"],
                    excel: {
                        fileName:"Data Laporan Pasien Meninggal.xlsx",
                        allPages: true,
                    },
                    selectable: 'row',
                    pageable: true,
                    editable: false,
                    columns: [
                        {
                            field: "no",
                            title: "No",
                            width: "45px" 
                        },
                        {
                            field: "tglmeninggal",
                            title: "Tgl Meninggal",
                            template: "<span class='style-left'>{{formatTanggal('#: tglmeninggal #')}}</span>"

                        },
                        {
                            field: "noregistrasi",
                            title: "No Reg",
                            hidden: false
                        },
                        {
                            field: "nocm",
                            title: "No Rm",
                            hidden: false
                        },  
                        {
                            field: "namapasien",
                            title: "Nama Pasien"
                        },
                        {
                            field: "penyebabkematian",
                            title: "Penyebab Kematian"
                        },
                        {
                            field: "namaruangan",
                            title: "Ruangan Terakhir"
                        }
                    ],
                    selectable: "row",
                    sortable: true
                }
            }
            ]);

});