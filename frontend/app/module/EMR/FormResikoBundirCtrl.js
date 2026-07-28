define(["initialize"], function (initialize) {
  "use strict";

  initialize.controller("FormResikoBundirCtrl", [
    "$mdDialog",
    "$q",
    "$rootScope",
    "$scope",
    "ModelItem",
    "$state",
    "CacheHelper",
    "DateHelper",
    "MedifirstService",
    function ($mdDialog, $q, $rootScope, $scope, ModelItem, $state, cacheHelper, dateHelper, medifirstService) {
      $scope.item = {};
      $scope.user = {};
      $scope.noCM = $state.params.noCM;
      $scope.tombolSimpanVis = true;
      $scope.isCetak = true;
      $scope.isKembali = true;
      $scope.noRecPap = cacheHelper.get("noRecPap");
      $scope.totalSkor = 0;
      $scope.totalSkor2 = 0;
      $scope.cc = {};
      var nomorEMR = "-";
      var nomorEMRSS = "";
      var paramSearch = "";
      $scope.isAdmin = false
      $scope.item.qrnama = ''
      $scope.isSave = true;
      $scope.isUpdate = false;
      $scope.isUpdateCetak = false;

      //inisialisasi untuk id emr pada pengkajian medis pasien ctrl
      $scope.cc.emrfk = 2061;

      $scope.now = new Date();
      var dataLoad = [];
      $scope.listData1 = [];
      $scope.listData2 = [];
      $scope.listData3 = [];
      $scope.item.objcbo = [];
      $scope.dataSource = [];
      $scope.item.obj = [];
      $scope.item.obj2 = [];
      $scope.item.image = "../app/images/svg/no-image.svg";
      $scope.InputLab = true;
      $scope.InputRadiologi = true;
      $scope.InputObat = true;

      //UNTUK KOMUNIKASI PARENT DENGAN CHILD
      $scope.tipemodul = "risikobundir";

      var lanjut = false;
      LoadCacheHelper();
      function LoadCacheHelper() {
        var chacePeriode = cacheHelper.get("cacheRMelektronik");
        if (chacePeriode != undefined) {
          $scope.cc.nocm = chacePeriode[0];
          $scope.cc.namapasien = chacePeriode[1];
          $scope.cc.jeniskelamin = chacePeriode[2];
          $scope.cc.noregistrasi = chacePeriode[3];
          $scope.cc.umur = chacePeriode[4];
          $scope.cc.kelompokpasien = chacePeriode[5];
          $scope.cc.tglregistrasi = chacePeriode[6];
          $scope.cc.norec = chacePeriode[7];
          $scope.cc.norec_pd = chacePeriode[8];
          $scope.cc.objectkelasfk = chacePeriode[9];
          $scope.cc.namakelas = chacePeriode[10];
          $scope.cc.objectruanganfk = chacePeriode[11];
          $scope.cc.namaruangan = chacePeriode[12];
          $scope.cc.DataNoregis = chacePeriode[13];
          $scope.cc.tglLahir = chacePeriode[14];
          $scope.cc.pgId = chacePeriode[17];
          $scope.cc.alamat = chacePeriode[15];
          $scope.cc.nohp = chacePeriode[35];
          $scope.cc.namaibu = chacePeriode[36];
          $scope.cc.namaayah = chacePeriode[37];
          $scope.cc.norec_emr = "-";
          $scope.cc.jenisemr = "risikobundir";
          paramSearch = "noregistrasi=" + $scope.cc.noregistrasi;
          debugger;
          init();
        }
        if (medifirstService.getKelompokUser() == 'admin' || medifirstService.getKelompokUser() == 'operator') {
          $scope.isAdmin = true
        }
      }
      var chekedd = false;

      function init() {
        $scope.isLoading = true;
        $scope.item.obj = [];
        $scope.item.obj2 = [];
        $scope.item.obj[1147] = moment($scope.cc.tglregistrasi).format("YYYY-MM-DD HH:mm");
        paramSearch = "noregistrasi=" + $scope.cc.noregistrasi;
        getPenunjang('noregistrasi=' + $scope.cc.noregistrasi);
        // medifirstService.getPart("emr/get-datacombo-part-dokter", true, true, 20).then(function (data) {
        //   $scope.listPegawai = data;
        // });
        medifirstService.get("emr/get-combo").then(function (data) {
          $scope.listPegawai = data.data.pegawai
          $scope.listDokter = data.data.dokter
          $scope.listPerawatBidan = data.data.perawatBidan
        });
        medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=risikobundir", true).then(function (dat) {
          $scope.isRouteLoading = false;
          debugger;
          nomorEMRSS = "";
          if (dat.data.data.length > 0) {
            for (let i = 0; i < dat.data.data.length; i++) {
              if (dat.data.data[i].jenisemr == "risikobundir") {
                lanjut = true;
              }
            }
            if (lanjut == true) {
              $scope.isSave = false;
              $scope.isUpdate = true;
              $scope.isUpdateCetak = true;
              $scope.cc.noemr = dat.data.data[0].noemr;
              $scope.cc.norec_emr = dat.data.data[0].noemr;
              nomorEMRSS = dat.data.data[0].noemr;
              nomorEMR = nomorEMRSS;
              $scope.cc.emrfk = 2061;
              setobjectToModel(nomorEMRSS, $scope.cc.emrfk);
            }
          } else {
            $scope.item.obj[43] = moment($scope.now).format("YYYY-MM-DD HH:mm");
            $scope.item.obj[68] = moment($scope.now).format("YYYY-MM-DD HH:mm");
            $scope.item.obj[39] = { id: medifirstService.getPegawaiLogin().id, namalengkap: medifirstService.getPegawaiLogin().namaLengkap };
            valueOtomatis();
            getValueSPRI()
          }
        });
        $scope.isLoading = false;
      }

      function setobjectToModel(nomorEMRSS, emrfk) {
        let namaPegawai = "";
        medifirstService.get("emr/get-emr-transaksi-detail-new?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
          debugger;
          $scope.isLoading = false;
          var chekedd = false;
          dataLoad = dat.data.data;
          for (var i = 0; i <= dataLoad.length - 1; i++) {
            if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
              if (dataLoad[i].type == "textbox") {
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
              } else if (dataLoad[i].type == "checkbox") {
                chekedd = false;
                if (dataLoad[i].value == "1") {
                  chekedd = true;
                }
                $scope.item.obj[dataLoad[i].emrdfk] = chekedd;
              } else if (dataLoad[i].type == "datetime") {
                $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD HH:mm')
              } else if (dataLoad[i].type == "time") {
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
              } else if (dataLoad[i].type == "date") {
                $scope.item.obj[dataLoad[i].emrdfk] = moment(dataLoad[i].value).format('YYYY-MM-DD')
              } else if (dataLoad[i].type == "checkboxtextbox") {
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
                $scope.item.obj2[dataLoad[i].emrdfk] = true;
              } else if (dataLoad[i].type == "textarea") {
                $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
              } else if (dataLoad[i].type == "combobox") {
                  var idFk = dataLoad[i].emrdfk.toString(); 

                  var listIdPegawai = [
                      "129", "130", "1901302603", "1901302449", "1901302450", 
                      "1901302451", "1901302452", "1901302453", "1901302454", 
                      "1901302455", "1901302456", "1901303145", "1901303146", 
                      "1901303147", "1901303148", "1901303149", "1901303150", 
                      "1901303151", "1901303152", "1901303153"
                  ];

                  if (idFk == "39" || listIdPegawai.includes(idFk)) {
                      var str = dataLoad[i].value;
                      if (str) {
                          var res = str.split("~");
                          $scope.item.obj[idFk] = {
                              id: res[0],
                              namalengkap: res[1]
                          };
                      }
                  }
              } else if (dataLoad[i].type == "photo") {
                $scope.user.poto = dataLoad[i].value;
              } else if (dataLoad[i].type == "image") {
                $scope.user.poto = dataLoad[i].value;
              }
              // if (dataLoad[i].emrdfk == "39") {
              //   var str = dataLoad[i].value;
              //   var res = str.split("~");
              //   console.log("res", res);
              //   if (res.length >= 2) {
              //     namaPegawai = res[1];
              //     $scope.item.obj[dataLoad[i].emrdfk] = {
              //       id: res[0],
              //       namalengkap: res[1]
              //     };
              //   }
              // }
            }
          }
          if (namaPegawai) {
            medifirstService.get("report/create-qr?namaPegawai=" + encodeURIComponent(namaPegawai))
              .then(function (et) {
                $scope.item.qr = et.data.data;
              })
              .catch(function (error) {
                console.error("QR Error:", error);
              });
          }
        });
      }

      $scope.kembali = function () {
        $rootScope.showRiwayat();
      };

      $scope.Save = function () {
        var confirm = $mdDialog.confirm().title("Konfirmasi").textContent("Apakah Anda yakin akan menyimpan data?").ariaLabel("Lucky day").cancel("Tidak").ok("Ya");
        $mdDialog.show(confirm).then(function () {
          $scope.Saveok();
        });
      };

      $scope.Saveok = function () {
        // if ($scope.item.obj[1257].value != $scope.cc.pgId) {
        //   toastr.warning("DPJP tidak sesuai, harap disesuaikan!")
        //   return
        // }
        $scope.isUpdateCetak = false;
        $scope.isLoading = true;
        var photo = "";
        kendo.drawing
          .drawDOM($(".surface"))
          .then(function (group) {
            debugger;
            return kendo.drawing.exportImage(group);
          })
          .done(function (data) {
            photo = data;
            debugger;
          });

        $scope.item.obj[1239] = moment($scope.item.obj[1239]).format("YYYY-MM-DD");

        var arrobj = Object.keys($scope.item.obj);
        var arrSave = [];
        debugger;
        for (var i = arrobj.length - 1; i >= 0; i--) {
          var targetIds = [
            39, 130, 1901302603, // ID bawaan sebelumnya
            1901302449, 1901302450, 1901302451, 1901302452, 1901302453, 1901302454, 1901302455, 1901302456, 
            1901303145, 1901303146, 1901303147, 1901303148, 1901303149, 1901303150, 1901303151, 1901303152, 1901303153
          ];

          var currentId = parseInt(arrobj[i]);

          if (targetIds.includes(currentId)) {
            var selectedItem = $scope.item.obj[currentId];
            
            if (selectedItem && selectedItem.id) { 
              arrSave.push({ 
                id: arrobj[i], 
                values: selectedItem.id + "~" + selectedItem.namalengkap 
              });
            }
          } else if (arrobj[i] == 2241 || arrobj[i] == 2242 || arrobj[i] == 2243) {
            arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text });
          } else if (arrobj[i] == 1168) {
            if (typeof $scope.item.obj[parseInt(arrobj[i])] === 'object') {
                arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])].text })
            } else {
                arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] })
            }
          } else {
            arrSave.push({ id: arrobj[i], values: $scope.item.obj[parseInt(arrobj[i])] });
          }
        }
        // arrSave.push({ id: "2320", values: photo });
        $scope.cc.jenisemr = "risikobundir";
        var jsonSave = {
          head: $scope.cc,
          data: arrSave,
        };
        medifirstService.post("emr/save-emr-new", jsonSave).then(function (e) {
          $scope.isSave = false;
          $scope.isKembali = false;
          $scope.isUpdateCetak = true;
          $scope.noemr = e.data.data.noemr;
          medifirstService.postLogging("EMR", "norec emrpasien_t", e.data.data.norec, "Pengkajian Medis Pasien Rawat Inap " + " dengan No EMR - " + e.data.data.noemr + " pada No Registrasi " + $scope.cc.noregistrasi).then(function (res) {
            var arrStr = {
              0: $scope.noemr,
            };
            cacheHelper.set("cacheNomorEMR", arrStr);
            LoadCacheHelper();
            $scope.isLoading = false;
          });
        });
      };

      $scope.cetakPdf = function () {
        $scope.popUpCetak.center().open();
      };
      $scope.tutupSurat = function () {
        $scope.popUpCetak.close();
      };

      function valueOtomatis() {
        if ($scope.cc.noregistrasi == null || $scope.cc.noregistrasi == undefined || $scope.cc.noregistrasi == "") {
          toastr.error("Ada kesalahan saat ambil isian Pengkajian Medis IGD, Mohon refresh kembali!");
        } else {
          medifirstService.get("emr/get-value-pengkajian-medis-igd?noRegistrasi=" + $scope.cc.noregistrasi).then(function (e) {
            if (e.data.messageCode == 200) {
              var value = e.data.data;
              for (let i = 0; i < value.length; i++) {
                //penyakit sekarang
                if (value[i].emrdfk == 2408) {
                  $scope.item.obj[372] = value[i].value;
                }
                //riwayat penyakit dahulu 
                if (value[i].emrdfk == 1901300306) {
                  $scope.item.obj[1334] = (value[i].value == "1");
                }
                if (value[i].emrdfk == 1901300305) {
                 $scope.item.obj[1335] = (value[i].value == "1");
                }
                if (value[i].emrdfk == 1901300299) {
                  $scope.item.obj[1901301910] = value[i].value;
                }
                //TTV
                if (value[i].emrdfk == 2409) {
                  $scope.item.obj[225] = value[i].value;
                }
                if (value[i].emrdfk == 2412) {
                  $scope.item.obj[226] = value[i].value;
                }
                if (value[i].emrdfk == 2411) {
                  $scope.item.obj[228] = value[i].value;
                }
                if (value[i].emrdfk == 2410) {
                  $scope.item.obj[229] = value[i].value;
                }

                if (value[i].emrdfk == 1901300297) {
                  $scope.item.obj[34] = value[i].value
                }
                if (value[i].emrdfk == 1901300314) {
                  $scope.item.obj[843] = value[i].value
                }
                if (value[i].emrdfk == 2426) {
                  $scope.item.obj[383] = value[i].value
                }
                if (value[i].emrdfk == 1901300313) {
                  $scope.item.obj[844] = value[i].value
                }
                if (value[i].emrdfk == 2638 || value[i].emrdfk == 2639) {
                    if (value[i].value) {
                        if ($scope.item.obj[2188]) {
                            $scope.item.obj[2188] += "\n\n" + value[i].value;
                        } else {
                            $scope.item.obj[2188] = value[i].value;
                        }
                    }
                }
                if (value[i].emrdfk == 2414) {
                  var rawData = value[i].value; 
                  
                  var parts = rawData.split('~'); 
                  
                  var textKesadaran = parts.length > 1 ? parts[1].trim() : rawData;
                  
                  textKesadaran = textKesadaran.toLowerCase();

                  if (textKesadaran.includes("compos mentis")) {
                      $scope.item.obj[30] = true;
                  } 
                  else if (textKesadaran.includes("apatis")) {
                      $scope.item.obj[31] = true;
                  }
                  else if (textKesadaran.includes("somnolent")) {
                      $scope.item.obj[40] = true;
                  }
                  else if (textKesadaran.includes("sopor") || textKesadaran.includes("delirium")) {
                      $scope.item.obj[42] = true;
                  }
                  else if (textKesadaran.includes("coma")) {
                      $scope.item.obj[44] = true;
                  }
                }
                if (value[i].emrdfk == 2415) {
                  if (value[i].value == "sakit ringan") {
                    $scope.item.obj[45] = true;
                  } else if (value[i].value == "sakit sedang") {
                    $scope.item.obj[46] = true;
                  } else if (value[i].value == "sakit berat") {
                    $scope.item.obj[47] = true;
                  }
                }
              }
            }
          });
        }
      }

      //Isian Default
      $scope.item.obj[238] = 'TAK';
      $scope.item.obj[239] = 'TAK';
      $scope.item.obj[242] = 'TAK';
      $scope.item.obj[243] = 'TAK';
      $scope.item.obj[244] = 'TAK';
      $scope.item.obj[245] = 'TAK';
      $scope.item.obj[247] = 'TAK';
      $scope.item.obj[248] = 'TAK';
      $scope.item.obj[249] = 'TAK';
      $scope.item.obj[250] = 'TAK';
      $scope.item.obj[251] = 'TAK';
      $scope.item.obj[254] = 'TAK';
      $scope.item.obj[255] = 'TAK';
      $scope.item.obj[255] = 'TAK';
      $scope.item.obj[257] = 'TAK';
      $scope.item.obj[259] = 'TAK';
      $scope.item.obj[260] = 'TAK';
      //end Isian Default

      function getPenunjang(paramSearch) {
          medifirstService.get('emr/get-riwayat-order-penunjang-lab-rad?' + paramSearch).then(function (e) {

              let daftar = e.data.daftar || [];

              // Masukkan nomor urut
              for (var i = daftar.length - 1; i >= 0; i--) {
                  daftar[i].no = i + 1;
              }

              // Ambil semua details → namaproduk
              let semuaProduk = [];

              daftar.forEach(item => {
                  if (item.details && item.details.length > 0) {
                      item.details.forEach(det => {
                          semuaProduk.push(det.namaproduk);
                      });
                  }
              });

              // Gabungkan ke textarea
              // Pisahkan dengan enter (\n)
              if (semuaProduk.length > 0) {
                  $scope.item.obj[261] = semuaProduk.join('\n');
              }

              // Masukkan ke grid
              $scope.dataGridRiwayat = new kendo.data.DataSource({
                  data: daftar,
                  pageSize: 10
              });

          });
      }

      function getValueSPRI() {
            medifirstService.get('emr/get-value-spri?noRegistrasi=' + $scope.cc.noregistrasi).then(function (e) {
                let pemeriksaanfisik = '';
                if (e.data.messageCode == 200) {
                    var value = e.data.data
                    if (value.length > 0) {
                        for (let i = 0; i < value.length; i++) {
                            if (value[i].emrdfk == 358) {
                                $scope.item.obj[382] = value[i].value
                            }
                            if (value[i].emrdfk == 379) {
                                $scope.item.obj[2187] = value[i].value
                            }
                        }
                    }
                } else {
                }
            })
        }

       $scope.hitungSkor = function() {
            // Memastikan object item dan obj sudah ada
            if (!$scope.item) $scope.item = {};
            if (!$scope.item.obj) $scope.item.obj = {};

            // Mapping ID berdasarkan HTML yang Anda berikan
            var konfigurasiSkor = [
                { // Kolom 1
                    idTotal: 1901302441, 
                    checkboxes: [
                        { id: 1901302393, bobot: 1 },  { id: 1901302401, bobot: 2 },
                        { id: 1901302409, bobot: 6 },  { id: 1901302417, bobot: 10 },
                        { id: 1901302425, bobot: 10 }, { id: 1901302433, bobot: 4 }
                    ]
                },
                { // Kolom 2
                    idTotal: 1901302442, 
                    checkboxes: [
                        { id: 1901302394, bobot: 1 },  { id: 1901302402, bobot: 2 },
                        { id: 1901302410, bobot: 6 },  { id: 1901302418, bobot: 10 },
                        { id: 1901302426, bobot: 10 }, { id: 1901302434, bobot: 4 }
                    ]
                },
                { // Kolom 3
                    idTotal: 1901302443, 
                    checkboxes: [
                        { id: 1901302395, bobot: 1 },  { id: 1901302403, bobot: 2 },
                        { id: 1901302411, bobot: 6 },  { id: 1901302419, bobot: 10 },
                        { id: 1901302427, bobot: 10 }, { id: 1901302435, bobot: 4 }
                    ]
                },
                { // Kolom 4
                    idTotal: 1901302444, 
                    checkboxes: [
                        { id: 1901302396, bobot: 1 },  { id: 1901302404, bobot: 2 },
                        { id: 1901302412, bobot: 6 },  { id: 19013024020, bobot: 10 }, // Catatan: Ada typo ID di HTML Anda
                        { id: 1901302428, bobot: 10 }, { id: 1901302436, bobot: 4 }
                    ]
                },
                { // Kolom 5
                    idTotal: 1901302445, 
                    checkboxes: [
                        { id: 1901302397, bobot: 1 },  { id: 1901302405, bobot: 2 },
                        { id: 1901302413, bobot: 6 },  { id: 1901302421, bobot: 10 },
                        { id: 1901302429, bobot: 10 }, { id: 1901302437, bobot: 4 }
                    ]
                },
                { // Kolom 6
                    idTotal: 1901302446, 
                    checkboxes: [
                        { id: 1901302398, bobot: 1 },  { id: 1901302406, bobot: 2 },
                        { id: 1901302414, bobot: 6 },  { id: 1901302422, bobot: 10 },
                        { id: 1901302430, bobot: 10 }, { id: 1901302438, bobot: 4 }
                    ]
                },
                { // Kolom 7
                    idTotal: 1901302447, 
                    checkboxes: [
                        { id: 1901302399, bobot: 1 },  { id: 1901302407, bobot: 2 },
                        { id: 1901302415, bobot: 6 },  { id: 1901302423, bobot: 10 },
                        { id: 1901302431, bobot: 10 }, { id: 1901302439, bobot: 4 }
                    ]
                },
                { // Kolom 8
                    idTotal: 1901302448, 
                    checkboxes: [
                        { id: 1901302400, bobot: 1 },  { id: 1901302408, bobot: 2 },
                        { id: 1901302416, bobot: 6 },  { id: 1901302424, bobot: 10 },
                        { id: 1901302432, bobot: 10 }, { id: 1901302440, bobot: 4 }
                    ]
                }
            ];

            // Proses perhitungan masing-masing kolom
            angular.forEach(konfigurasiSkor, function(kolom) {
                var totalSkor = 0;
                
                angular.forEach(kolom.checkboxes, function(cb) {
                    if ($scope.item.obj[cb.id] === true) {
                        totalSkor += cb.bobot;
                    }
                });
                
                // Memasukkan hasil ke Textbox Total
                // Jika nilainya 0, Anda bisa memilih menampilkan 0 atau mengosongkannya (null)
                $scope.item.obj[kolom.idTotal] = totalSkor; 
            });
        };

        $scope.formatTanggalManual = function (dateStr) {
            if (!dateStr) return "";
            let d = new Date(dateStr);
            d = new Date(d.getTime() + 7 * 60 * 60000); // nambah 7 jam buat WIB
            let pad = (n) => n.toString().padStart(2, "0");
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
        };
    },
  ]);
});
