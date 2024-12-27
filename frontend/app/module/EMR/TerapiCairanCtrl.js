define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('TerapiCairanCtrl', ['$mdDialog', '$timeout', '$parse', '$state', '$q', '$rootScope', '$scope', 'CacheHelper', 'DateHelper', 'MedifirstService',
    function ($mdDialog, $timeout, $parse, $state, $q, $rootScope, $scope, cacheHelper, dateHelper, medifirstService) {
        $scope.item = {}
        $scope.item.obj = {};
        $scope.dataSelected = {};
        $scope.cc = {};
        $scope.cc.emrfk = 893;
        $scope.now = new Date();     
        

        var paramSearch = ''
        var nomorEMRSS = '';
        var nomorEMR = ''
        var lanjut = false;
        var dataLoad = []
        $scope.istempatLaporan = true;
        $scope.isRouteLoading = false;

        Kosongkan()
        loadCombo()
        LoadCacheHelper()
        loadTerapi()

        

        function loadCombo() {
            medifirstService.get('emr/get-combo-edukasi-pasien?').then(function(dat) {
                $scope.listPegawai = dat.data.pegawai
            })
            medifirstService.get('emr/get-combo').then(function(dat) {
                $scope.listDokter = dat.data.dokter
				$scope.listRuangan = dat.data.ruanganrajal
				$scope.listJenisKelamin = dat.data.jeniskelamin
				$scope.listPenjamin = dat.data.rekanan
            })
        }
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
                $scope.cc.tglLahir = chacePeriode[14]
                $scope.cc.norec_emr = '-'
                $scope.cc.jenisemr = "terapicairan"
                paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
                init()
            }
        }
        
        function Kosongkan() {
            $scope.item.tgljamterapi = undefined
            $scope.item.jeniscairan = ''
            $scope.item.namaobat = ''
            $scope.item.volume = ''
            $scope.item.tetesan = ''
            $scope.item.lamaterapi = ''
            $scope.item.waktumulai = undefined
            $scope.item.waktuselesai = undefined
            $scope.item.namadokter = ''
            $scope.item.pegawaipasang = ''
            $scope.item.pegawaiverifikator = ''
            $scope.item.keterangan = ''            
        }
        function init() {
            $scope.isRouteLoading = true
            
			$scope.item.tgljamterapi = $scope.now
            
            paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi
            medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=terapicairan", true).then(function(dat) {
                $scope.isRouteLoading = false
                
                if (dat.data.data.length > 0) {
                    for (let i = 0; i < dat.data.data.length; i++) {
                        if (dat.data.data[i].jenisemr == 'terapicairan') {
                            lanjut = true;
                        }
                    }
                    if (lanjut == true) {
                            $scope.noemr = dat.data.data[0].noemr
                            $scope.cc.norec_emr = dat.data.data[0].noemr
                            nomorEMRSS = ''
                            nomorEMRSS = dat.data.data[0].noemr
                            nomorEMR = nomorEMRSS
                            $scope.cc.emrfk = 893;
                            setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
                    } else {

                    }
                } 
            })
            // loadData()
        }
        function setobjectToModel(nomorEMRSS, emrfk) {
            medifirstService.get("emr/get-emr-transaksi-detail-polri?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
                
                $scope.isLoading = false
                var chekedd = false
                $scope.item.obj = []
                $scope.item.obj2 = []
                // $scope.item.obj[68] = $scope.now
                dataLoad = dat.data.data
            })
        }
        function loadTerapi() {
            medifirstService.get('emr/get-terapi-cairan?norec=' + $scope.cc.norec_pd).then(function(dat) {
                for(let i = 0; i < dat.data.length; i++) {
                    dat.data[i].no = i + 1
                }
                $scope.sourceTerapi = new kendo.data.DataSource({
                    data: dat.data,
                    length: dat.data.length,
                    pageSize: 20
                });
            })
			$scope.gridTerapi = {
				pageable: true, 
				scrollable: true,
				columns: [
					{ field: "no", title: "No", width: 40 },
					{ field: "tgljam", title: "Tgl dan Jam Terapi", width: 180,template: "<span class='style-left'>#: tgljam #</span>"     },
					{ field: "jeniscairan", title: "Jenis Cairan", width: 200 },
					{ field: "namaobat", title: "Nama Obat", width: 200 },
					{ field: "volume", title: "Volume", width: 120 },
					{ field: "tetesan", title: "Tetesan", width: 120 },
					{ field: "lamaterapi", title: "Lama Terapi", width: 150 },
					{ field: "waktumulai", title: "Waktu Mulai", width: 150},
					{ field: "waktuselesai", title: "Waktu Selesai", width: 150 },
					{ field: "namadokter", title: "Program Dokter", width: 150 },
					{ field: "pegawaipasang", title: "Pegawai Pemasang", width: 150 },
					{ field: "pegawaiverifikator", title: "Pegawai Verifikator", width: 150 },
					{ field: "keterangan", title: "Keterangan", width: 180 },
				],
			};
        }
        function saveemr() {
            let tampung = '';
            // debugger
            $scope.item.obj
            var user = medifirstService.getPegawaiLogin();
            var arrobj = Object.keys($scope.item.obj) 
            var arrSave = [] 
            for (let i = arrobj.length - 1; i >= 0; i--) {
                if ($scope.item.obj[parseInt(arrobj[i])] != undefined) {
                    if (arrobj[i] == 2321) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].caption })
                    } else if (arrobj[i] == 2344) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].caption })
                    } else if (arrobj[i] == 2336) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].caption })
                    } else if (arrobj[i] == 2338) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].caption })
                    } else if (arrobj[i] == 2339) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].caption })
                    } else if (arrobj[i] == 2340) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].caption })
                    } else if (arrobj[i] == 2342) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].caption })
                    } else if (arrobj[i] == 2343) {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].caption })
                    } else {
                        arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
                    } 
                }
            }
            $scope.cc.jenisemr = 'terapicairan'
                var jsonSave = {
                    head: $scope.cc,
                    data: arrSave
                }
                medifirstService.post('emr/save-emr-dinamis', jsonSave).then(function (e) {
                    nomorEMR = e.data.data.noemr
                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Emr IGD ' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })

                    medifirstService.postLogging('EMR', 'norec emrpasien_t', e.data.data.norec,
                        'Emr IGD' + ' dengan No EMR - ' + e.data.data.noemr + ' pada No Registrasi '
                        + $scope.cc.noregistrasi).then(function (res) {
                        })                      
                    var arrStr = {
                        0: e.data.data.noemr
                    }
                    cacheHelper.set('cacheNomorEMR', arrStr);
                });
        }
        $scope.simpanTerapi = function() {
            let jeniscairan = ''
            let namaobat = ''
            let volume = ''
            let tetesan = ''
            let lamaterapi = ''
            let waktumulai = ''
            let waktuselesai = ''
            let namadokter = ''
            let pegawaipasang = ''
            let pegawaiverifikator = ''
            let keterangan = ''
            if ($scope.item.jeniscairan != undefined && $scope.item.jeniscairan != "") {
                jeniscairan = $scope.item.jeniscairan
            } else {
                toastr.error("Jenis Selang / Jenis Cairan tidak boleh kosong");
                return;
            }

            if (!Number.isInteger(Number($scope.item.volume))) {
                toastr.error("Isi Volume harus berisi angka!")
                return
            }
            if (!Number.isInteger(Number($scope.item.tetesan))) {
                toastr.error("Isi Tetesan harus berisi angka!")
                return
            }
            if (!Number.isInteger(Number($scope.item.lamaterapi))) {
                toastr.error("Isi Lama Terapi harus berisi angka!")
                return
            }
            if ($scope.item.namaobat != undefined) {
                namaobat = $scope.item.namaobat
            }
            if ($scope.item.volume != undefined) {
                volume = $scope.item.volume
            }
            if ($scope.item.tetesan != undefined) {
                tetesan = $scope.item.tetesan
            }
            if ($scope.item.lamaterapi != undefined) {
                lamaterapi = $scope.item.lamaterapi
            }
            if ($scope.item.waktumulai != undefined) {
                waktumulai = moment($scope.item.waktumulai).format('HH:mm')
            }
            if ($scope.item.waktuselesai != undefined) {
                waktuselesai = moment($scope.item.waktuselesai).format('HH:mm')
            }
            if ($scope.item.namadokter != undefined) {
                namadokter = $scope.item.namadokter.namalengkap
            }
            if ($scope.item.pegawaipasang != undefined) {
                pegawaipasang = $scope.item.pegawaipasang.namalengkap
            }
            if ($scope.item.pegawaiverifikator != undefined) {
                pegawaiverifikator = $scope.item.pegawaiverifikator.namalengkap
            }
            if ($scope.item.keterangan != undefined) {
                keterangan = $scope.item.keterangan
            }
            let objSave = {
                tgljamterapi: moment($scope.item.tgljamterapi).format('YYYY-MM-DD HH:mm'),
                jeniscairan: jeniscairan,
                namaobat: namaobat,
                volume: volume,
                tetesan: tetesan,
                lamaterapi: lamaterapi,
                waktumulai: waktumulai,
                waktuselesai: waktuselesai,
                namadokter: namadokter,
                pegawaipasang: pegawaipasang,
                pegawaiverifikator: pegawaiverifikator,
                keterangan: keterangan,
                noregistrasifk: $scope.cc.norec_pd
            }
            medifirstService.post('emr/save-terapi-cairan', objSave).then(function(e) {
                if (e.status == 201) {
                    Kosongkan()
                    saveemr()
                    loadTerapi()
                    init()
                }
            })
        }
        
        $scope.deleteTerapi = function() {
            if ($scope.dataSelected.norec == undefined) {
                toastr.error('Pilih Data Dahulu !')
                return
            }
            let objSave = {
                'norec': $scope.dataSelected.norec
            }
            medifirstService.post('emr/delete-terapi-cairan', objSave).then(function(e) {
                loadTerapi()
                init()
            })
        }

        $scope.formatTanggal = function (tanggal) {
            return moment(tanggal).format('DD-MMM-YYYY HH:MM:SS');
        }

        $scope.Cetak = function () {            

                var nama = $scope.cc.namapasien
                var nocm = $scope.cc.nocm
                var tgllahir = $scope.cc.tglLahir
                var jk = $scope.cc.jeniskelamin
                var umur = $scope.cc.umur
                var ruangan = $scope.cc.namaruangan
                var norecpd = $scope.cc.norec_pd
            var data = {
                "gambarLogo": "logodokkes.jpg",
                "paramKey": ["nomorEMR","noregistrasi","ruanganfk","nama","nocm","tgllahir","jeniskelamin","umur","ruangan","norecpd"],
                "paramValue": [nomorEMR,$scope.cc.noregistrasi,$scope.cc.objectruanganfk,nama,nocm,tgllahir,jk,umur,ruangan,norecpd],
                "paramType" : ["","","","","","","","","","",""]
            };
            
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200){                    
                    console.log(this.response, typeof this.response);
                    //var res = this.response
                    //var file = new Blob( [res], {type: 'application/pdf'});
                     ;
                    var url = window.URL.createObjectURL(this.response)
                    var pdf = document.getElementById('tempatLaporan');
                    pdf.innerHTML = '<embed src="' + url + '#view=FitH&toolbar=1" type="application/pdf" width="100%" height="100%"></embed>';
                    var win = window.open(url, '_blank');
                    win.focus();
                }
            }
            if (window.location.hostname.indexOf('192.168.1.7') > -1) {
                xhr.open('POST', 'http://192.168.1.7:8797/generic/report/TerapiCairan.pdf');
            }else if(window.location.hostname.indexOf('192.168.88.56') > -1){
                xhr.open('POST', 'http://192.168.88.56:8797/generic/report/TerapiCairan.pdf');
            }else if(window.location.hostname.indexOf('10.5.1.2') > -1){
                xhr.open('POST', 'http://10.5.1.2:8797/generic/report/TerapiCairan.pdf');
            }else if(window.location.hostname.indexOf('202.51.105.98') > -1){
                xhr.open('POST', 'http://202.51.105.98:8797/generic/report/TerapiCairan.pdf');
            } else if (window.location.hostname.indexOf('simrs-rspusatpolri.com') > -1) {
                xhr.open('POST', 'http://simrs-rspusatpolri.com:8797/generic/report/TerapiCairan.pdf');
            }else{
                xhr.open('POST', 'http://127.0.0.1:8797/generic/report/TerapiCairan.pdf');
            }            
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Access-Control-Allow-Origin','*');
            xhr.responseType = 'blob';            
            xhr.send(JSON.stringify(data));	
        }
    }
])
})