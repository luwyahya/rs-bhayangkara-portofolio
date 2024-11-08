define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('DaftarFormulirAntemortemCtrl', ['$mdDialog', 'CacheHelper', '$scope', '$state', 'MedifirstService', 'DateHelper', '$window',
        function ($mdDialog, cacheHelper, $scope, $state, medifirstService, dateHelper, $window) {
            $scope.dataVOloaded = true;
            $scope.isRouteLoading = true;
            $scope.dataSelectedAntemortem = {};
            $scope.istempatLaporan = true;
            $scope.item = {};
            $scope.model = {};
            $scope.now = new Date();
            $scope.buttonasli = true;
            var temp = '';
            var norec_dvi = '';
            loadCombo();
            var foto = [];
            var foto2 = [];
            var foto3 = [];
            var foto4 = [];
            var foto5 = [];
            var foto6 = [];

            function loadCombo() {
                medifirstService.get('jenazah/get-data-for-combo').then(function (dat) {
                    debugger
                    $scope.listJenisBencana = dat.data.jenisbencana
                    $scope.item.jenisbencana = { id: dat.data.jenisbencana[0].id, jenisbencana: dat.data.jenisbencana[0].jenisbencana }
                    $scope.listJenisKelamin = dat.data.jeniskelamin
                    $scope.listSidikJari = dat.data.sidikjari
                    $scope.listGigi = dat.data.gigi
                    $scope.listDNA = dat.data.dna
                    $scope.listHubunganKeluarga = dat.data.hubunganKeluarga
                    $scope.listSuku = dat.data.suku
                    $scope.listPetugas = dat.data.petugas

                    $scope.isRouteLoading = false;
                    loadData()
                })
            }
            $scope.cari = function () {
                loadData()
            }
            $scope.$watch('model.cekpilihManual', function (value) {
                if (value == true) {
                    $scope.petugasdalam = false;
                    $scope.petugasluar = true;
                } else {
                    $scope.petugasdalam = true;
                    $scope.petugasluar = false;
                }
            })

            function loadData() {
                var jenisbencana = ""
                if ($scope.item.jenisbencana != undefined) {
                    jenisbencana = "jenisbencana=" + $scope.item.jenisbencana.id
                } else {
                    jenisbencana = ""
                }
                var namakorban = ""
                if ($scope.item.carikorban != undefined) {
                    namakorban = "&namakorban=" + $scope.item.carikorban
                } else {
                    namakorban = ""
                }
                var namapelapor = ""
                if ($scope.item.caripelapor != undefined) {
                    namapelapor = "&namapelapor=" + $scope.item.caripelapor
                } else {
                    namapelapor = ""
                }
                medifirstService.get("jenazah/dvi/get-daftar-formulir-antemortem?" + jenisbencana + namakorban + namapelapor).then(function (data) {
                    debugger;
                    $scope.isRouteLoading = false;
                    var antemortem = data.data
                    $scope.sourceAntemortem = new kendo.data.DataSource({
                        data: antemortem,
                        pageSize: 50,
                        total: data.length,
                        serverPaging: false,
                        schema: {
                            model: {
                                fields: {

                                }
                            }
                        }
                    });
                    $scope.formatTanggal = function (tanggal) {
                        return moment(tanggal).format('DD-MMM-YYYY');
                    }
                    $scope.columnAntemortem = {
                        scrollable: true,
                        selectable: "row",
                        pageable: true,
                        columns: [{
                            "field": "tglinput",
                            "title": "Tgl Input",
                            "width": "50px",
                        },
                        {
                            "field": "noregistrasi",
                            "title": "No Registrasi",
                            "width": "50px",
                        },
                        {
                            "field": "namapelapor",
                            "title": "Nama Pelapor",
                            "width": "50px",
                        },
                        {
                            "field": "namadilaporkan",
                            "title": "Nama Dilaporkan",
                            "width": "50px",
                        },
                        {
                            "field": "jeniskelamin",
                            "title": "Jenis Kelamin",
                            "width": "50px",
                        },
                        {
                            "field": "tgllahir",
                            "title": "Tgl Lahir",
                            "width": "50px",
                            "template": "<span class='style-right'>{{formatTanggal('#: tgllahir #')}}</span>"
                        },
                        {
                            "field": "alamat",
                            "title": "Alamat",
                            "width": "50px",
                        },
                        {
                            "field": "statusdaftar",
                            "title": "Status",
                            "width": "50px",
                            attributes: {
                                class: "#=statusdaftar == 'Online' ? 'hejo' : 'green' #"
                            },
                        },
                        ]
                    }
                })
            }
            $scope.cetak = function () {
                if ($scope.dataSelectedAntemortem.noregistrasi == undefined) {
                    toastr.error('Data Belum Dipilih !')
                    $scope.isRouteLoading = false;
                    return;
                }
                debugger
                if ($scope.dataSelectedAntemortem.objectpetugaswawancarafk != null && $scope.dataSelectedAntemortem.petugaswawancaraluar == null) {
                    if ($scope.dataSelectedAntemortem.petugaswawancara == undefined || $scope.dataSelectedAntemortem.penginput == undefined || $scope.dataSelectedAntemortem.notelppetugaswawancara == undefined || $scope.dataSelectedAntemortem.tglwawancara == undefined || $scope.dataSelectedAntemortem.notelppenginput == undefined) {
                        if ($scope.dataSelectedAntemortem.petugaswawancara == undefined) {
                            toastr.error('Petugas Wawancara Belum Diinput !')

                        }
                        if ($scope.dataSelectedAntemortem.penginput == undefined) {
                            toastr.error('Petugas Input Data Belum Diinput !')

                        }
                        if ($scope.dataSelectedAntemortem.notelppetugaswawancara == undefined) {
                            toastr.error('No Telepon Petugas Wawancara Belum Diinput !')

                        }
                        if ($scope.dataSelectedAntemortem.tglwawancara == undefined) {
                            toastr.error('Tanggal Wawancara Belum Diinput !')

                        }
                        if ($scope.dataSelectedAntemortem.notelppenginput == undefined) {
                            toastr.error('No Telepon Penginput Data Belum Diinput !')
                        }
                        return
                    } else {

                    }
                } else if ($scope.dataSelectedAntemortem.objectpetugaswawancarafk != null && $scope.dataSelectedAntemortem.petugaswawancaraluar == null) {
                    if ($scope.dataSelectedAntemortem.petugaswawancaraluar == undefined || $scope.dataSelectedAntemortem.penginput == undefined || $scope.dataSelectedAntemortem.notelppetugaswawancara == undefined || $scope.dataSelectedAntemortem.tglwawancara == undefined || $scope.dataSelectedAntemortem.notelppenginput == undefined) {
                        if ($scope.dataSelectedAntemortem.petugaswawancaraluar == undefined) {
                            toastr.error('Petugas Wawancara Belum Diinput !')

                        }
                        if ($scope.dataSelectedAntemortem.penginput == undefined) {
                            toastr.error('Petugas Input Data Belum Diinput !')

                        }
                        if ($scope.dataSelectedAntemortem.notelppetugaswawancara == undefined) {
                            toastr.error('No Telepon Petugas Wawancara Belum Diinput !')

                        }
                        if ($scope.dataSelectedAntemortem.tglwawancara == undefined) {
                            toastr.error('Tanggal Wawancara Belum Diinput !')

                        }
                        if ($scope.dataSelectedAntemortem.notelppenginput == undefined) {
                            toastr.error('No Telepon Penginput Data Belum Diinput !')
                        }
                        return
                    } else {

                    }
                } else {
                    if ($scope.dataSelectedAntemortem.petugaswawancaraluar == undefined || $scope.dataSelectedAntemortem.petugaswawancara == undefined || $scope.dataSelectedAntemortem.penginput == undefined || $scope.dataSelectedAntemortem.notelppetugaswawancara == undefined || $scope.dataSelectedAntemortem.tglwawancara == undefined || $scope.dataSelectedAntemortem.notelppenginput == undefined) {
                        if ($scope.dataSelectedAntemortem.petugaswawancaraluar == undefined || $scope.dataSelectedAntemortem.petugaswawancara == undefined) {
                            toastr.error('Petugas Wawancara Belum Diinput !')

                        }
                        if ($scope.dataSelectedAntemortem.penginput == undefined) {
                            toastr.error('Petugas Input Data Belum Diinput !')

                        }
                        if ($scope.dataSelectedAntemortem.notelppetugaswawancara == undefined) {
                            toastr.error('No Telepon Petugas Wawancara Belum Diinput !')

                        }
                        if ($scope.dataSelectedAntemortem.tglwawancara == undefined) {
                            toastr.error('Tanggal Wawancara Belum Diinput !')

                        }
                        if ($scope.dataSelectedAntemortem.notelppenginput == undefined) {
                            toastr.error('No Telepon Penginput Data Belum Diinput !')
                        }
                        return
                    } else {

                    }
                }
                if ($scope.dataSelectedAntemortem.penginput == undefined || $scope.dataSelectedAntemortem.notelppetugaswawancara == undefined || $scope.dataSelectedAntemortem.tglwawancara == undefined || $scope.dataSelectedAntemortem.notelppenginput == undefined) {

                    if ($scope.dataSelectedAntemortem.penginput == undefined) {
                        toastr.error('Petugas Input Data Belum Diinput !')

                    }
                    if ($scope.dataSelectedAntemortem.notelppetugaswawancara == undefined) {
                        toastr.error('No Telepon Petugas Wawancara Belum Diinput !')

                    }
                    if ($scope.dataSelectedAntemortem.tglwawancara == undefined) {
                        toastr.error('Tanggal Wawancara Belum Diinput !')

                    }
                    if ($scope.dataSelectedAntemortem.notelppenginput == undefined) {
                        toastr.error('No Telepon Penginput Data Belum Diinput !')
                    }
                    return
                } else {

                }
                // if ($scope.dataSelectedAntemortem.petugaswawancara == undefined || $scope.dataSelectedAntemortem.penginput == undefined || $scope.dataSelectedAntemortem.notelppetugaswawancara == undefined || $scope.dataSelectedAntemortem.tglwawancara == undefined || $scope.dataSelectedAntemortem.notelppenginput == undefined) {
                //     if ($scope.dataSelectedAntemortem.petugaswawancara == undefined) {
                //         toastr.error('Petugas Wawancara Belum Diinput !')

                //     }
                //     if ($scope.dataSelectedAntemortem.penginput == undefined) {
                //         toastr.error('Petugas Input Data Belum Diinput !')

                //     }
                //     if ($scope.dataSelectedAntemortem.notelppetugaswawancara == undefined) {
                //         toastr.error('No Telepon Petugas Wawancara Belum Diinput !')

                //     }
                //     if ($scope.dataSelectedAntemortem.tglwawancara == undefined) {
                //         toastr.error('Tanggal Wawancara Belum Diinput !')

                //     }
                //     if ($scope.dataSelectedAntemortem.notelppenginput == undefined) {
                //         toastr.error('No Telepon Penginput Data Belum Diinput !')
                //     }
                //     return
                // } else {

                // }


                debugger;
                $scope.isRouteLoading = true;
                var data = {
                    "gambarLogo": "logodokkes.jpg",
                    "paramKey": ["noregistrasi"],
                    "paramValue": [$scope.dataSelectedAntemortem.noregistrasi],
                    "paramType": [""] // "paramType" : ["","date"] selain date, isinya kosong saja
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
                    xhr.open('POST', 'http://192.168.0.62:1002/generic/report/antemortemnew.pdf');
                } else if (window.location.hostname.indexOf('192.168.88.56') > -1) {
                    xhr.open('POST', 'http://192.168.88.56:8797/generic/report/antemortemnew.pdf');
                } else if (window.location.hostname.indexOf('192.168.100.254') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/antemortemnew.pdf');
                } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
                    xhr.open('POST', '/jasper1/generic/report/antemortemnew.pdf');
                } else if (window.location.hostname.indexOf('simrs-rspusatpolri') > -1) {
                    xhr.open('POST', 'http://36.92.186.59:1002/generic/report/antemortemnew.pdf');
                } else if (window.location.hostname.indexOf('172.10.3.68') > -1) {
                    xhr.open('POST', 'http://172.10.3.68:8797/generic/report/antemortemnew.pdf');
                } else if (window.location.hostname.indexOf('103.93.237.70') > -1) {
                    xhr.open('POST', 'http://103.93.237.70:1002/generic/report/antemortemnew.pdf');
                } else {
                    xhr.open('POST', 'http://127.0.0.1:8797/generic/report/antemortemnew.pdf');
                }
                // set `Content-Type` header
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
                xhr.responseType = 'blob';
                // send rquest with JSON payload
                xhr.send(JSON.stringify(data));
                $scope.isRouteLoading = false;
            }
            $scope.edit = function () {
                $scope.isRouteLoading = true;
                if ($scope.dataSelectedAntemortem.noregistrasi == undefined) {
                    toastr.error('Data Belum Dipilih !')
                    $scope.isRouteLoading = false;
                    return
                }
                loadEdit()
                $scope.buttonasli = false;
                $scope.isi = true;
            }

            function loadEdit() {
                medifirstService.get('jenazah/dvi/get-data-edit-antemortem?noregistrasi=' + $scope.dataSelectedAntemortem.noregistrasi).then(function (dat) {
                    debugger
                    $scope.isRouteLoading = true;
                    temp = dat.data.dataAntemortem[0].noregistrasi
                    norec_dvi = dat.data.dataAntemortem[0].dvipelaporfk
                    $scope.item.pelapor = dat.data.dataAntemortem[0].namapelapor
                    $scope.item.dilapor = dat.data.dataAntemortem[0].namadilaporkan
                    $scope.item.panggilan = dat.data.dataAntemortem[0].namapanggilan
                    $scope.item.jeniskelamin = { id: dat.data.dataAntemortem[0].jeniskelaminfk, jeniskelamin: dat.data.dataAntemortem[0].jeniskelamin }
                    $scope.item.hubungan = { id: dat.data.dataAntemortem[0].hubungankeluargafk, hubungankeluarga: dat.data.dataAntemortem[0].hubungankeluarga }
                    $scope.item.tgllahir = dat.data.dataAntemortem[0].tgllahir
                    $scope.item.warganegara = dat.data.dataAntemortem[0].objectkebangsaanfk
                    $scope.item.suku = { id: dat.data.dataAntemortem[0].sukufk, suku: dat.data.dataAntemortem[0].suku }
                    $scope.item.telphp = dat.data.dataAntemortem[0].notelepon
                    $scope.item.alamat = dat.data.dataAntemortem[0].alamat
                    $scope.item.sumbersidikjari = { id: dat.data.dataAntemortem[0].sumbersidikjarifk, sumber: dat.data.dataAntemortem[0].sumbersidikjari }
                    $scope.item.uraiansidikjari = dat.data.dataAntemortem[0].uraiansidikjari
                    $scope.item.keterangansidikjari = dat.data.dataAntemortem[0].keterangansidikjari
                    $scope.item.sumbergigi = { id: dat.data.dataAntemortem[0].sumbergigifk, sumber: dat.data.dataAntemortem[0].sumbergigi }
                    $scope.item.uraiangigi = dat.data.dataAntemortem[0].uraiangigi
                    $scope.item.keterangangigi = dat.data.dataAntemortem[0].keterangangigi
                    $scope.item.sumberdna = { id: dat.data.dataAntemortem[0].sumberdnafk, sumber: dat.data.dataAntemortem[0].sumberdna }
                    $scope.item.uraiandna = dat.data.dataAntemortem[0].uraiandna
                    $scope.item.keterangandna = dat.data.dataAntemortem[0].keterangandna
                    $scope.item.ciricirifisik = dat.data.dataAntemortem[0].ciricirifisik
                    $scope.item.keteranganfisik = dat.data.dataAntemortem[0].keteranganfisik
                    $scope.item.barangkepemilikan = dat.data.dataAntemortem[0].barangkepemilikan
                    $scope.item.keteranganbarang = dat.data.dataAntemortem[0].keteranganbarang
                    if (dat.data.dataAntemortem[0].objectpetugaswawancarafk != null) {
                        $scope.model.cekpilihManual = false;
                        $scope.petugasdalam = true;
                        $scope.petugasluar = false;
                        $scope.item.petugaswawancara = { id: dat.data.dataAntemortem[0].idpetugaswawancara, namalengkap: dat.data.dataAntemortem[0].petugaswawancara }
                    } else {
                        $scope.model.cekpilihManual = true;
                        $scope.petugasdalam = false;
                        $scope.petugasluar = true;
                        $scope.item.petugaswawancaraluar = dat.data.dataAntemortem[0].petugaswawancaraluar
                    }
                    $scope.item.teleponwawancara = dat.data.dataAntemortem[0].notelppetugaswawancara
                    $scope.item.tglwawancara = dat.data.dataAntemortem[0].tglwawancara
                    if (dat.data.dataAntemortem[0].penginput == undefined) {
                        $scope.item.petugasinputdata = { id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap }
                    } else {
                        $scope.item.petugasinputdata = { id: dat.data.dataAntemortem[0].idpenginput, namalengkap: dat.data.dataAntemortem[0].penginput }
                    }
                    $scope.item.teleponinputdata = dat.data.dataAntemortem[0].notelppenginput
                    //   $scope.item.jenisbencana.id
                    debugger
                    $scope.images = [];
                    var fotoantemortem = dat.data.fotoLampiran
                    for (let i = 0; i < fotoantemortem.length; i++) {
                        $scope.images.push({
                            dataURL: fotoantemortem[i].foto,
                            norec: fotoantemortem[i].norec
                        });
                    }
                    $scope.images2 = [];
                    var fotosidikjari = dat.data.fotoSidikJari
                    for (let i = 0; i < fotosidikjari.length; i++) {
                        $scope.images2.push({
                            dataURL2: fotosidikjari[i].foto,
                            norec: fotosidikjari[i].norec
                        });
                    }
                    $scope.images3 = [];
                    var fotogigi = dat.data.fotoGigi
                    for (let i = 0; i < fotogigi.length; i++) {
                        $scope.images3.push({
                            dataURL3: fotogigi[i].foto,
                            norec: fotogigi[i].norec
                        });
                    }
                    $scope.images4 = [];
                    var fotodna = dat.data.fotoDna
                    for (let i = 0; i < fotodna.length; i++) {
                        $scope.images4.push({
                            dataURL4: fotodna[i].foto,
                            norec: fotodna[i].norec
                        });
                    }
                    $scope.images5 = [];
                    var fotocirifisik = dat.data.fotoCiriFisik
                    for (let i = 0; i < fotocirifisik.length; i++) {
                        $scope.images5.push({
                            dataURL5: fotocirifisik[i].foto,
                            norec: fotocirifisik[i].norec
                        });
                    }
                    $scope.images6 = [];
                    var fotobarangkepemilikan = dat.data.fotoBarangKepemilikan
                    for (let i = 0; i < fotobarangkepemilikan.length; i++) {
                        $scope.images6.push({
                            dataURL6: fotobarangkepemilikan[i].foto,
                            norec: fotobarangkepemilikan[i].norec
                        });
                    }
                    $scope.isRouteLoading = false;
                })
            }
            $scope.deletefoto = function (image) {
                debugger
                var save = {
                    norec: image.norec
                }
                medifirstService.post('jenazah/dvi/delete-foto-antemortem', save).then(function (e) {
                    $scope.dataSelectedAntemortem.noregistrasi = temp
                    loadEdit()
                })
            }
            var handleFileSelect = function (file) {
                var files = document.getElementById('filePicker').files;
                debugger
                for (var i = 0; i < files.length; i++) {
                    //cek filenya
                    if (files[i].size > 4194304) {
                        alert('Ukuran foto tidak boleh lebih dari 4 MB !')
                        $scope.button = false;
                        return
                    } else {
                        $scope.button = true;
                    }
                }
                if (files.length > 0) {
                    for (var i = 0; i < files.length; i++) {
                        getBase64(files[i]);
                    }
                }
            };

            if (window.File && window.FileReader && window.FileList && window.Blob) {
                document.getElementById('filePicker').addEventListener('change', handleFileSelect, false);
            } else {
                alert('The File APIs are not fully supported in this browser.');
            }

            function getBase64(file) {
                debugger

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    //    tes.push(reader)
                    console.log(reader.result)
                    foto.push({ foto: (reader.result), id: 4 })
                };
                reader.onerror = function (error) {
                    console.log('Error: ', error);
                };
            }
            var handleFileSelect = function (file) {
                var files = document.getElementById('filePicker2').files;
                debugger
                for (var i = 0; i < files.length; i++) {
                    //cek filenya
                    if (files[i].size > 4194304) {
                        alert('Ukuran foto tidak boleh lebih dari 4 MB !')
                        $scope.button = false;
                        return
                    } else {
                        $scope.button = true;
                    }
                }
                if (files.length > 0) {
                    for (var i = 0; i < files.length; i++) {
                        getBase642(files[i]);
                    }
                }
            };

            if (window.File && window.FileReader && window.FileList && window.Blob) {
                document.getElementById('filePicker2').addEventListener('change', handleFileSelect, false);
            } else {
                alert('The File APIs are not fully supported in this browser.');
            }

            function getBase642(file) {
                debugger

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    //    tes.push(reader)
                    console.log(reader.result)
                    foto2.push({ foto: (reader.result), id: 1 })
                };
                reader.onerror = function (error) {
                    console.log('Error: ', error);
                };
            }
            var handleFileSelect = function (file) {
                var files = document.getElementById('filePicker3').files;
                debugger
                for (var i = 0; i < files.length; i++) {
                    //cek filenya
                    if (files[i].size > 4194304) {
                        alert('Ukuran foto tidak boleh lebih dari 4 MB !')
                        $scope.button = false;
                        return
                    } else {
                        $scope.button = true;
                    }
                }
                if (files.length > 0) {
                    for (var i = 0; i < files.length; i++) {
                        getBase643(files[i]);
                    }
                }
            };

            if (window.File && window.FileReader && window.FileList && window.Blob) {
                document.getElementById('filePicker3').addEventListener('change', handleFileSelect, false);
            } else {
                alert('The File APIs are not fully supported in this browser.');
            }

            function getBase643(file) {
                debugger

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    //    tes.push(reader)
                    console.log(reader.result)
                    foto3.push({ foto: (reader.result), id: 2 })
                };
                reader.onerror = function (error) {
                    console.log('Error: ', error);
                };
            }
            var handleFileSelect = function (file) {
                var files = document.getElementById('filePicker4').files;
                debugger
                for (var i = 0; i < files.length; i++) {
                    //cek filenya
                    if (files[i].size > 4194304) {
                        alert('Ukuran foto tidak boleh lebih dari 4 MB !')
                        $scope.button = false;
                        return
                    } else {
                        $scope.button = true;
                    }
                }
                if (files.length > 0) {
                    for (var i = 0; i < files.length; i++) {
                        getBase644(files[i]);
                    }
                }
            };

            if (window.File && window.FileReader && window.FileList && window.Blob) {
                document.getElementById('filePicker4').addEventListener('change', handleFileSelect, false);
            } else {
                alert('The File APIs are not fully supported in this browser.');
            }

            function getBase644(file) {
                debugger

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    //    tes.push(reader)
                    console.log(reader.result)
                    foto4.push({ foto: (reader.result), id: 3 })
                };
                reader.onerror = function (error) {
                    console.log('Error: ', error);
                };
            }
            var handleFileSelect = function (file) {
                var files = document.getElementById('filePicker5').files;
                debugger
                for (var i = 0; i < files.length; i++) {
                    //cek filenya
                    if (files[i].size > 4194304) {
                        alert('Ukuran foto tidak boleh lebih dari 4 MB !')
                        $scope.button = false;
                        return
                    } else {
                        $scope.button = true;
                    }
                }
                if (files.length > 0) {
                    for (var i = 0; i < files.length; i++) {
                        getBase645(files[i]);
                    }
                }
            };

            if (window.File && window.FileReader && window.FileList && window.Blob) {
                document.getElementById('filePicker5').addEventListener('change', handleFileSelect, false);
            } else {
                alert('The File APIs are not fully supported in this browser.');
            }

            function getBase645(file) {
                debugger

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    //    tes.push(reader)
                    console.log(reader.result)
                    foto5.push({ foto: (reader.result), id: 4 })
                };
                reader.onerror = function (error) {
                    console.log('Error: ', error);
                };
            }
            var handleFileSelect = function (file) {
                var files = document.getElementById('filePicker6').files;
                debugger
                for (var i = 0; i < files.length; i++) {
                    //cek filenya
                    if (files[i].size > 4194304) {
                        alert('Ukuran foto tidak boleh lebih dari 4 MB !')
                        $scope.button = false;
                        return
                    } else {
                        $scope.button = true;
                    }
                }
                if (files.length > 0) {
                    for (var i = 0; i < files.length; i++) {
                        getBase646(files[i]);
                    }
                }
            };

            if (window.File && window.FileReader && window.FileList && window.Blob) {
                document.getElementById('filePicker6').addEventListener('change', handleFileSelect, false);
            } else {
                alert('The File APIs are not fully supported in this browser.');
            }

            function getBase646(file) {
                debugger

                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    //    tes.push(reader)
                    console.log(reader.result)
                    foto6.push({ foto: (reader.result), id: 5 })
                };
                reader.onerror = function (error) {
                    console.log('Error: ', error);
                };
            }
            $scope.batalEdit = function () {
                $scope.buttonasli = true;
                $scope.isi = false;
                $scope.item.petugaswawancara = undefined;
                $scope.item.petugaswawancaraluar = undefined;
            }
            $scope.saveEdit = function () {
                debugger
                if ($scope.model.cekpilihManual == true) {
                    $scope.item.petugaswawancara = {
                        id: null
                    };
                } else {
                    $scope.item.petugaswawancaraluar = undefined
                }
                var tanggal = $scope.now;
                var tanggalLahir = new Date($scope.item.tgllahir);
                var umurs = dateHelper.CountAge(tanggalLahir, tanggal);
                umurs = umurs.year + ' Tahun ' + umurs.month + ' Bulan ' + umurs.day + ' Hari'
                var save = {
                    noregistrasi: temp,
                    dvipelaporfk: norec_dvi,
                    foto: foto,
                    foto2: foto2,
                    foto3: foto3,
                    foto4: foto4,
                    foto5: foto5,
                    foto6: foto6,
                    namapelapor: $scope.item.pelapor,
                    namadilaporkan: $scope.item.dilapor,
                    namapanggilan: $scope.item.panggilan,
                    jeniskelamin: $scope.item.jeniskelamin.id,
                    hubungankeluarga: $scope.item.hubungan.id,
                    umur: umurs,
                    tanggallahir: moment($scope.item.tgllahir).format('YYYY-MM-DD HH:mm:ss'),
                    suku: $scope.item.suku.id,
                    notelepon: $scope.item.telphp,
                    alamat: $scope.item.alamat,
                    sumbersidikjari: $scope.item.sumbersidikjari.id,
                    uraiansidikjari: $scope.item.uraiansidikjari,
                    keterangansidikjari: $scope.item.keterangansidikjari,
                    sumbergigi: $scope.item.sumbergigi.id,
                    uraiangigi: $scope.item.uraiangigi,
                    keterangangigi: $scope.item.keterangangigi,
                    sumberdna: $scope.item.sumberdna.id,
                    uraiandna: $scope.item.uraiandna,
                    keterangandna: $scope.item.keterangandna,
                    ciricirifisik: $scope.item.ciricirifisik,
                    keteranganfisik: $scope.item.keteranganfisik,
                    barangkepemilikan: $scope.item.barangkepemilikan,
                    keteranganbarang: $scope.item.keteranganbarang,
                    kebangsaan: $scope.item.warganegara,
                    petugaswawancara: $scope.item.petugaswawancara.id,
                    petugaswawancaraluar: $scope.item.petugaswawancaraluar,
                    notelpwawancara: $scope.item.teleponwawancara,
                    tglwawancara: $scope.item.tglwawancara,
                    petugasinput: $scope.item.petugasinputdata.id,
                    notelpinput: $scope.item.teleponinputdata
                }
                medifirstService.post('jenazah/dvi/save-edit-antemortem', save).then(function (e) {
                    $scope.isi = false;
                    $scope.buttonasli = true;
                    loadCombo();
                })
            }
            $scope.release = function () {
                if ($scope.dataSelectedAntemortem.noregistrasi == undefined) {
                    toastr.error('Pilih Data Dahulu !')
                    return;
                }
                medifirstService.get('jenazah/dvi/cek-sudah-release?noregistrasi=' + $scope.dataSelectedAntemortem.noregistrasi).then(function (dat) {
                    if (dat.data.length > 0) {
                        toastr.error('Data Sudah di Release !')
                        return
                    } else {
                        var arrStr = {
                            0: $scope.dataSelectedAntemortem.noregistrasi,
                            1: $scope.dataSelectedAntemortem.namadilaporkan,
                            2: $scope.dataSelectedAntemortem.tgllahir,
                            3: $scope.dataSelectedAntemortem.namapelapor,
                            4: $scope.dataSelectedAntemortem.notelepon,
                            5: $scope.dataSelectedAntemortem.alamat,
                            6: $scope.dataSelectedAntemortem.hubungankeluarga,
                            7: $scope.dataSelectedAntemortem.idhubungankeluarga,
                            8: $scope.dataSelectedAntemortem.idjenisbencana
                        }
                        cacheHelper.set('ReleaseDvi', arrStr);
                        $state.go('ReleaseDvi')
                    }
                })
            }
            /*Batas Suci*/

        }
    ])
})