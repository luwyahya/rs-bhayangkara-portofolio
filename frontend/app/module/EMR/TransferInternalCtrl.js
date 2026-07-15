define(["initialize"], function (initialize) {
  "use strict";

  initialize.controller("TransferInternalCtrl", [
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
      $scope.cc.emrfk = 2078;

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
      $scope.tipemodul = "transferinternal";

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
          $scope.cc.namadpjp = chacePeriode[16];
          $scope.cc.pgId = chacePeriode[17];
          $scope.cc.alamat = chacePeriode[15];
          $scope.cc.nohp = chacePeriode[35];
          $scope.cc.namaibu = chacePeriode[36];
          $scope.cc.namaayah = chacePeriode[37];
          $scope.cc.ruangakakhir = chacePeriode[24];
          $scope.cc.norec_emr = "-";
          $scope.cc.jenisemr = "transferinternal";
          paramSearch = "noregistrasi=" + $scope.cc.noregistrasi;
          
          init();
        }
        if (medifirstService.getKelompokUser() == 'admin' || medifirstService.getKelompokUser() == 'operator') {
          $scope.isAdmin = true
        }
      }
      var chekedd = false;

      function init() {
        $scope.isLoading = true;

        medifirstService.get("emr/get-riwayat-transfer-internal?noregistrasi=" + $scope.cc.noregistrasi, true).then(function(dat) {
                $scope.isRouteLoading = false;                        
                let data = dat.data
                for(let i = 0; i < data.length; i++) {
                    data[i].no = i + 1;
                }
                $scope.dataRiwayatTransferInternal = new kendo.data.DataSource({
                    data: data,
                    schema: {
                        model: {
                        }
                    },
                    pageSize: 10,
                    total: data.length,
                    serverPaging: false,
                   
                });  
            })
        $scope.item.obj = [];
        $scope.item.obj2 = [];
        $scope.item.obj[1147] = moment($scope.cc.tglregistrasi).format("YYYY-MM-DD HH:mm");
        paramSearch = "noregistrasi=" + $scope.cc.noregistrasi;
        getPenunjang('noregistrasi=' + $scope.cc.noregistrasi);

        medifirstService.get("emr/get-combo").then(function (data) {
          $scope.listPegawai = data.data.pegawai;
          $scope.listRuangan = data.data.ruangan;
        });
        medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=transferinternal", true).then(function (dat) {
          $scope.isRouteLoading = false;
          nomorEMRSS = "";
          if (dat.data.data.length > 0) {
            for (let i = 0; i < dat.data.data.length; i++) {
              if (dat.data.data[i].jenisemr == "transferinternal") {
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
              $scope.cc.emrfk = 2078;
              setobjectToModel(nomorEMRSS, $scope.cc.emrfk);
            }
          } else {
            $scope.item.obj[1901304997] = $scope.cc.nocm;
            $scope.item.obj[1901304998] = $scope.cc.namapasien;
            $scope.item.obj[1901304999] = $scope.cc.tglLahir;
            $scope.item.obj[1901305003] = $scope.cc.kelompokpasien;
            $scope.item.obj[1901305000] = $scope.cc.namaruangan;
            $scope.item.obj[1901305011] = $scope.cc.ruangakakhir;
            $scope.item.obj[1901305094] = { id: $scope.cc.pgId, namalengkap: $scope.cc.namadpjp };
            if ($scope.cc.jeniskelamin == "LAKI-LAKI") {
                $scope.item.obj[1901305001] = true;
                $scope.item.obj[1901305002] = false;
            } else {
                $scope.item.obj[1901305001] = false;
                $scope.item.obj[1901305002] = true;
            }

            valueOtomatis();
            getValueSPRI();
            loadOrderPenunjang();
            loadOrderFarmasi(); // Fungsi ini sekarang kosong agar tidak memanggil API
          }
        });
        $scope.isLoading = false;
      }

      function setobjectToModel(nomorEMRSS, emrfk) {
        let namaPegawai = "";
        let namaPegawai2 = "";
        let namaPegawai3 = "";

        $scope.item.obj = {}; 
        $scope.item.obj2 = {};
        $scope.user.poto = null;

        medifirstService.get("emr/get-emr-transaksi-detail-new?noemr=" + nomorEMRSS + "&emrfk=" + emrfk, true).then(function (dat) {
          
          $scope.isLoading = false;
          var chekedd = false;
          dataLoad = dat.data.data;
          for (var i = 0; i <= dataLoad.length - 1; i++) {
            if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
              if (dataLoad[i].type == "textbox" || !dataLoad[i].type) {
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
              } else if (dataLoad[i].type == "photo") {
                $scope.user.poto = dataLoad[i].value;
              } else if (dataLoad[i].type == "image") {
                $scope.user.poto = dataLoad[i].value;
              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305075") {
                  var str = dataLoad[i].value
                  var res = str.split("~");
                  $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305076") {
                  var str = dataLoad[i].value
                  var res = str.split("~");
                  $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305077") {
                  var str = dataLoad[i].value
                  var res = str.split("~");
                  $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305078") {
                  var str = dataLoad[i].value
                  var res = str.split("~");
                  $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305079") {
                  var str = dataLoad[i].value
                  var res = str.split("~");
                  $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
              }  else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305080") {
                  var str = dataLoad[i].value
                  var res = str.split("~");
                  $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
              }  else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305081") {
                  var str = dataLoad[i].value
                  var res = str.split("~");
                  $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305082") {
                  var str = dataLoad[i].value
                  var res = str.split("~");
                  $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
              }  else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305083") {
                  var str = dataLoad[i].value
                  var res = str.split("~");
                  $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
              }  else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305084") {
                  var str = dataLoad[i].value
                  var res = str.split("~");
                  $scope.item.obj[dataLoad[i].emrdfk] = { value: res[0], text: res[1] }
              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305094") {
                  var str = dataLoad[i].value
                  var res = str.split("~");
                  namaPegawai = res[0];
                  $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: res[1] }
              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305095") {
                  var str = dataLoad[i].value
                  var res = str.split("~");
                  namaPegawai2 = res[0];
                  $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: res[1] }

              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901305096") {
                  var str = dataLoad[i].value
                  var res = str.split("~");
                  namaPegawai3 = res[0];
                  $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: res[1] }

              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901304996") {
                  var str = dataLoad[i].value
                  var res = str.split("~");
                  namaPegawai3 = res[0];
                  $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namalengkap: res[1] }

              } else if (dataLoad[i].type == "combobox" && dataLoad[i].emrdfk == "1901304995") {
                  var str = dataLoad[i].value
                  var res = str.split("~");
                  namaPegawai3 = res[0];
                  $scope.item.obj[dataLoad[i].emrdfk] = { id: res[0], namaruangan: str }

              }
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
          if (namaPegawai2) {
            medifirstService.get("report/create-qr?namaPegawai=" + encodeURIComponent(namaPegawai))
              .then(function (et) {
                $scope.item.qr2 = et.data.data;
              })
              .catch(function (error) {
                console.error("QR Error:", error);
              });
          }
          if (namaPegawai3) {
            medifirstService.get("report/create-qr?namaPegawai=" + encodeURIComponent(namaPegawai))
              .then(function (et) {
                $scope.item.qr3 = et.data.data;
              })
              .catch(function (error) {
                console.error("QR Error:", error);
              });
          }

          // FIX: Scan data untuk mengatasi baris yang "bolong" (gap)
          $scope.listBarisObat = [];
          let baseIdAwal = 1901305097; 
          let maxRow = 9; // Default minimal render sampai index 9 (yaitu 10 baris)

          for (let r = 0; r < 50; r++) {
              let bId = baseIdAwal + (r * 5);
              let adaIsian = $scope.item.obj[bId] || 
                             $scope.item.obj[bId + 1] || 
                             $scope.item.obj[bId + 2] || 
                             $scope.item.obj[bId + 3] || 
                             $scope.item.obj[bId + 4];
                             
              if (adaIsian) {
                  if (r > maxRow) {
                      maxRow = r; // Update batas baris tertinggi yang harus di-render
                  }
              }
          }

          // 2. Render baris dari index 0 sampai maxRow
          for (let i = 0; i <= maxRow; i++) {
              let baseId = baseIdAwal + (i * 5);
              $scope.listBarisObat.push({
                  no: i + 1,
                  idNamaObat: baseId,
                  idSediaan: baseId + 1,
                  idTglJam: baseId + 2,
                  idDosis: baseId + 3,
                  idRute: baseId + 4
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
        $scope.isUpdateCetak = false;
        $scope.isLoading = true;
        var photo = "";
        kendo.drawing
          .drawDOM($(".surface"))
          .then(function (group) {
            return kendo.drawing.exportImage(group);
          })
          .done(function (data) {
            photo = data;
          });

        $scope.item.obj[1239] = moment($scope.item.obj[1239]).format("YYYY-MM-DD");
        var arrobj = Object.keys($scope.item.obj);
        var arrSave = [];
        
        for (let i = arrobj.length - 1; i >= 0; i--) {
            var currentId = arrobj[i];
            var currentObj = $scope.item.obj[parseInt(currentId)];
            
            if (currentObj != undefined && currentObj !== "") {
                if (currentId == 1901305094 || currentId == 1901305095 || currentId == 1901305096 || currentId == 1901304996) {
                    arrSave.push({ id: currentId, values: currentObj ? { value: currentObj.id, text: currentObj.namalengkap } : null });
                } else if (currentId == 1901304995) {
                    arrSave.push({ id: currentId, values: currentObj ? { value: currentObj.id, text: currentObj.namaruangan } : null });
                } else {
                    arrSave.push({ id: currentId, values: currentObj });
                }
            }
        }
            
        $scope.cc.jenisemr = "transferinternal";
        var jsonSave = {
          head: $scope.cc,
          data: arrSave,
          image: $scope.item.image != undefined && $scope.item.image != "../app/images/svg/no-image.svg" ? $scope.item.image : null,
        };
        medifirstService.post("emr/save-emr-new", jsonSave).then(function (e) {
          $scope.isSave = false;
          $scope.isUpdate = true;
          $scope.isUpdateCetak = true;
          $scope.noemr = e.data.data.noemr;
          medifirstService.postLogging("EMR", "norec emrpasien_t", e.data.data.norec, "Pengkajian Persetujuan Restrain " + " dengan No EMR - " + e.data.data.noemr + " pada No Registrasi " + $scope.cc.noregistrasi).then(function (res) {
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
                  $scope.item.obj[1901305005] = value[i].value;
                }
                //keterangan pemeriksaan fisik
                if (value[i].emrdfk == 2423) {
                   $scope.item.obj[1901305006] = value[i].value;
                }
                //diagnosa kerja
                if (value[i].emrdfk == 2426) {
                 $scope.item.obj[1901305008] = value[i].value;
                }
                if (value[i].emrdfk == 1901300313) {
                 $scope.item.obj[1901305009] = value[i].value;
                }
              }
            }
          });
        }
      }

      function loadOrderPenunjang() {
          medifirstService.get('emr/get-order-penunjang-to-cppt?norec_pd=' + $scope.cc.norec_pd).then(function(dat) {
              
              if (dat.data && dat.data.length > 0) {
                  let textLab = "";
                  let textRad = "";
                  let textResep = "";
                  
                  let adaLab = false;
                  let adaRad = false;
                  let adaResep = false;

                  for (let i = 0; i < dat.data.length; i++) {
                      let item = dat.data[i];
                      
                      if (item.namaproduk != null) {
                          
                          if (item.keteranganorder == "Order Laboratorium") {
                              if (!adaLab) {
                                  textLab += "LAB :\n";
                                  adaLab = true;
                              }
                              textLab += " - " + item.namaproduk + "\n";
                          } 
                          
                          else if (item.keteranganorder == "Order Radiologi") {
                              if (!adaRad) {
                                  textRad += "RAD :\n";
                                  adaRad = true;
                              }
                              textRad += " - " + item.namaproduk + "\n";
                          } 
                          
                          else if (item.keteranganorder == "Order Farmasi") {
                              if (!adaResep) {
                                  textResep += "E-resep :\n";
                                  adaResep = true;
                              }
                              let aturan = item.aturanpakai ? " " + item.aturanpakai : "";
                              textResep += " - " + item.namaproduk + aturan + "\n";
                          }
                      }
                  }

                  let hasilAkhir = "";
                  if (adaLab) hasilAkhir += textLab + "\n";
                  if (adaRad) hasilAkhir += textRad + "\n";
                  if (adaResep) hasilAkhir += textResep;

                  if (!$scope.item) $scope.item = {};
                  if (!$scope.item.obj) $scope.item.obj = {};

                  $scope.item.obj[1901305007] = hasilAkhir.trim(); 
              }
          });
      }

      // FIX: Inisialisasi awal 10 baris obat 
      $scope.listBarisObat = [];
      let baseIdAwal = 1901305097;

      function buatBarisBaru(index) {
          let baseId = baseIdAwal + (index * 5);
          return {
              no: index + 1,
              idNamaObat: baseId,
              idSediaan: baseId + 1,
              idTglJam: baseId + 2,
              idDosis: baseId + 3,
              idRute: baseId + 4
          };
      }

      // Looping sebanyak 10 kali (karena kita hanya butuh 10 row default)
      for (let i = 0; i < 10; i++) {
          $scope.listBarisObat.push(buatBarisBaru(i));
      }

      $scope.tambahBarisManual = function() {
          let indexBaru = $scope.listBarisObat.length;
          $scope.listBarisObat.push(buatBarisBaru(indexBaru));
      };

      // FIX: Kosongkan fungsi loadOrderFarmasi agar obat tidak termuat otomatis dari API
      function loadOrderFarmasi() {
         // API fetching di-nonaktifkan agar tabel tampil kosong dengan 10 baris saja.
      }

       $scope.listGcs = [
                { text: "E", value: 1},
                { text: "M", value: 2},
                { text: "V", value: 3}
            ];
            $scope.listGcsE = [
                { text: "1", value: 1},
                { text: "2", value: 2},
                { text: "3", value: 3},
                { text: "4", value: 4},
                { text: "-", value: 5}
            ];
            $scope.listGcsM = [
                { text: "1", value: 1},
                { text: "2", value: 2},
                { text: "3", value: 3},
                { text: "4", value: 4},
                { text: "5", value: 5},
                { text: "6", value: 6},
                { text: "-", value: 7}
            ];
            $scope.listGcsV = [
                { text: "1", value: 1},
                { text: "2", value: 2},
                { text: "3", value: 3},
                { text: "4", value: 4},
                { text: "5", value: 5},
                { text: "-", value: 6},
                { text: "Afasia", value: 7},
                { text: "Terintubasi", value: 8}
            ];

          $scope.listKondisiUmum = [
            { text: "Ringan", value: 1 },
            { text: "Sedang", value: 2 },
            { text: "Berat", value: 3 },
          ];  

      $scope.listKesadaran = [
            { text: "Compos Mentis", value: 1 },
            { text: "Apatis", value: 2 },
            { text: "Delirium", value: 3 },
            { text: "Somnolent", value: 4 },
            { text: "Sopor", value: 5 },
            { text: "Semi Coma", value: 6 },
            { text: "Coma", value: 7 },
          ];

       $scope.listRoute = [
          { text: "PO", value: 1 },
          { text: "IV", value: 2 },
          { text: "IT", value: 3 },
          { text: "SC", value: 4 },
          { text: "IM", value: 5 },
          { text: "TETES HIDUNG", value: 6 },
          { text: "TETES TELINGA", value: 7 },
          { text: "TETES MATA", value: 8 },
          { text: "SUP", value: 9 },
          { text: "OLEH DI KULIT", value: 10 },
          { text: "OLEH DI BIBIR/MULUT", value: 11 },
          { text: "NEBULISASI", value: 12 },
          { text: "HISAP", value: 13 },
          { text: "SEMPROT", value: 14 },
          { text: "KUMUR-KUMUR", value: 15 },
      ];

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
                                $scope.item.obj[1901305004] = value[i].value
                            }
                        }
                    }
                } else {
                }
            })
        }


$scope.getLinkQr = function(namaPegawai){
    if (!namaPegawai || namaPegawai === '-') return ''; 
    return 'report/create-qr?namaPegawai=' + encodeURIComponent(namaPegawai);
}

$scope.persiapanCetak = function() {
    $scope.isLoading = true;

    // 1. Cek Cetakan 1
    $scope.showCetakan1 = $scope.item.obj[1901302019] ? true : false; 

    // --- Helper: Ambil Nama ---
    function getNamaLengkap(data) {
        if (!data) return '-';
        if (typeof data === 'object') {
            return data.namalengkap || data.text || '-';
        }
        return data;
    }

    // --- Helper: Ambil Tanggal/Jam Aman ---
    function getSafeDate(data, format) {
        if (!data) return null;
        var m = moment(data);
        if (!m.isValid()) {
             // Coba parse manual jika format string jam "HH:mm"
             if(typeof data === 'string' && data.match(/^\d{2}:\d{2}$/)) return data; 
             return null;
        }
        return m.format(format); // Format ulang biar aman
    }

    // --- Helper: Ambil Nilai Combobox (Rute/GCS) ---
    function getComboValue(data) {
        if (!data) return '';
        if (typeof data === 'object') {
            return data.text || data.value || ''; 
        }
        return data;
    }

    var qrPromises = [];


    var namaPemberi = getNamaLengkap($scope.item.obj[1901302065]);
    $scope.namaPemberiCetak = namaPemberi;
    if(namaPemberi && namaPemberi !== '-'){
        qrPromises.push(
            medifirstService.get("report/create-qr?namaPegawai=" + encodeURIComponent(namaPemberi)).then(function(res){
                $scope.qrPemberi = res.data.data;
            })
        );
    }

    // 2. Mapping Data Tabel Kimia
    $scope.item.monitoringKimia = [];
    var startIdKimia = 1901302066; 
    var colsKimia = 13; 
    
    for (var i = 0; i < 11; i++) {
        var baseId = startIdKimia + (i * colsKimia);
        
        // Cek Keberadaan Data
        if ($scope.item.obj[baseId] || $scope.item.obj[baseId + 1] || $scope.item.obj[baseId + 2]) {
            
            // Ambil Nama Petugas
            var petugasRaw = $scope.item.obj[baseId + 12]; // Index ke-12 (0-12 = 13 kolom)
            var petugasFix = getNamaLengkap(petugasRaw);

            let rowData = {
                tanggal: getSafeDate($scope.item.obj[baseId], 'DD-MM-YYYY'),
                jam: getSafeDate($scope.item.obj[baseId + 1], 'HH:mm'), // Pastikan format jam
                namaObat: $scope.item.obj[baseId + 2] || '',
                dosis: $scope.item.obj[baseId + 3] || '',
                rute: getComboValue($scope.item.obj[baseId + 4]), // Combobox Rute
                
                gcs: $scope.item.obj[baseId + 5] || '', // INI GCS (Textbox)
                
                t: $scope.item.obj[baseId + 6] || '',
                n: $scope.item.obj[baseId + 7] || '',
                r: $scope.item.obj[baseId + 8] || '',
                s: $scope.item.obj[baseId + 9] || '',
                vas: $scope.item.obj[baseId + 10] || '',
                statusMental: $scope.item.obj[baseId + 11] || '',
                petugas: petugasFix,
                qrCode: null 
            };
            
            $scope.item.monitoringKimia.push(rowData);

            if(petugasFix && petugasFix !== '-') {
                (function(row){ 
                    qrPromises.push(
                        medifirstService.get("report/create-qr?namaPegawai=" + encodeURIComponent(row.petugas)).then(function(res){
                            row.qrCode = res.data.data;
                        })
                    );
                })(rowData);
            }
        }
    }
    $scope.showCetakan2 = $scope.item.monitoringKimia.length > 0;


    // 3. Mapping Data Tabel Fisik
    $scope.item.monitoringFisik = [];
    var startIdFisik = 1901302209; 
    var colsFisik = 16; 
    
    for (var j = 0; j < 11; j++) {
        var baseIdF = startIdFisik + (j * colsFisik);
        
        if ($scope.item.obj[baseIdF] || $scope.item.obj[baseIdF + 2]) {
            
            var petugasFisikRaw = $scope.item.obj[baseIdF + 15]; // Index ke-15
            var petugasFisikFix = getNamaLengkap(petugasFisikRaw);

            let rowDataFisik = {
                tanggal: getSafeDate($scope.item.obj[baseIdF], 'DD-MM-YYYY'),
                jam: getSafeDate($scope.item.obj[baseIdF + 1], 'HH:mm'),
                
                tanganKa: $scope.item.obj[baseIdF + 2],
                tanganKi: $scope.item.obj[baseIdF + 3],
                kakiKa: $scope.item.obj[baseIdF + 4],
                kakiKi: $scope.item.obj[baseIdF + 5],
                lainLain: $scope.item.obj[baseIdF + 6] || '',
                
                gcs: $scope.item.obj[baseIdF + 7] || '', // INI GCS (Textbox)
                
                t: $scope.item.obj[baseIdF + 8] || '',
                n: $scope.item.obj[baseIdF + 9] || '',
                r: $scope.item.obj[baseIdF + 10] || '',
                s: $scope.item.obj[baseIdF + 11] || '',
                vas: $scope.item.obj[baseIdF + 12] || '',
                luka: $scope.item.obj[baseIdF + 13] || '',
                statusMental: $scope.item.obj[baseIdF + 14] || '',
                petugas: petugasFisikFix,
                qrCode: null
            };

            $scope.item.monitoringFisik.push(rowDataFisik);

            if(petugasFisikFix && petugasFisikFix !== '-') {
                (function(row){
                    qrPromises.push(
                        medifirstService.get("report/create-qr?namaPegawai=" + encodeURIComponent(row.petugas)).then(function(res){
                            row.qrCode = res.data.data;
                        })
                    );
                })(rowDataFisik);
            }
        }
    }
    $scope.showCetakan3 = $scope.item.monitoringFisik.length > 0;

    $q.all(qrPromises).then(function() {
        $scope.isLoading = false;
        $scope.popUpCetak.center().open();
    }, function(err){
        $scope.isLoading = false;
        $scope.popUpCetak.center().open();
    });
}

$scope.columnRiwayatTransferInternal = [
            {
                "field": "no",  
                "title": "No",
                "width": "5px",
                "template": "<span class='style-center'>#: no #</span>",
            },  
            {
                "field": "tglemr",
                "title": "Tanggal Transfer",
                "width": "20px"
            },               
            {
                "field": "namalengkap",
                "title": "Petugas",
                "width": "30px",
            },
            {
                "title": "Hapus",
                "width": "10px",
                "template": "<button class=\"k-button custom-button\" ng-click=\"hapusGrid(dataSelectedRiwayatTransferInternal)\" style=\"margin:0 0 5px\">Hapus</button>"
            }
        ];

         $scope.BuatBaru = function () {
            var chekedd = false;
            
            $scope.item.obj = {};
            $scope.item.obj2 = {};
            
            nomorEMRSS = '';
            $scope.cc.norec_emr = '-';
            $scope.isSave = true;
            $scope.isUpdate = false; 
            $scope.isUpdateCetak = false;
            
            $scope.item.obj[1147] = moment($scope.now).format('YYYY-MM-DD HH:mm');
            $scope.item.obj[43] = moment($scope.now).format('YYYY-MM-DD');

            $scope.item.obj[1901304997] = $scope.cc.nocm;
            $scope.item.obj[1901304998] = $scope.cc.namapasien;
            $scope.item.obj[1901304999] = $scope.cc.tglLahir;
            $scope.item.obj[1901305003] = $scope.cc.kelompokpasien;
            $scope.item.obj[1901305000] = $scope.cc.namaruangan;
            $scope.item.obj[1901305011] = $scope.cc.ruangakakhir;
            $scope.item.obj[1901305094] = { id: $scope.cc.pgId, namalengkap: $scope.cc.namadpjp };

            if ($scope.cc.jeniskelamin == "LAKI-LAKI") {
                $scope.item.obj[1901305001] = true;
                $scope.item.obj[1901305002] = false;
            } else {
                $scope.item.obj[1901305001] = false;
                $scope.item.obj[1901305002] = true;
            }

            valueOtomatis();
            getValueSPRI();
            getPenunjang("noregistrasi=" + $scope.cc.noregistrasi);
            loadOrderPenunjang();
            
            // FIX: Buat Baru sekarang memastikan ada 10 baris tetap
            $scope.listBarisObat = [];
            let baseIdAwal = 1901305097;
            for (let i = 0; i < 10; i++) {
                let baseId = baseIdAwal + (i * 5);
                $scope.listBarisObat.push({
                    no: i + 1,
                    idNamaObat: baseId,
                    idSediaan: baseId + 1,
                    idTglJam: baseId + 2,
                    idDosis: baseId + 3,
                    idRute: baseId + 4
                });
            }
            
            loadOrderFarmasi(); 
        };

        $scope.EditLihat = function () {
            if ($scope.dataSelectedRiwayatTransferInternal == undefined) {
                alert("Pilih Tanggal Transfer Yang Mau di Edit / Lihat !!")
                return;
            }

            console.log('Selected Transfer:', $scope.dataSelectedRiwayatTransferInternal);
            
            $scope.isRouteLoading = true
            var noemr = '&noemr=' + $scope.dataSelectedRiwayatTransferInternal.noemr;
            var paramSearch = 'noregistrasi=' + $scope.cc.noregistrasi;
            medifirstService.get("emr/get-emr-transaksi?" + paramSearch + "&jenisEmr=transferinternal" + noemr, true).then(function(dat) {
                $scope.isRouteLoading = false
                    $scope.noemr = dat.data.data[0].noemr
                    $scope.cc.norec_emr = dat.data.data[0].noemr
                    nomorEMRSS = ''
                    nomorEMRSS = dat.data.data[0].noemr
                    nomorEMR = nomorEMRSS
                    $scope.cc.emrfk = 2078;
                    setobjectToModel(nomorEMRSS, $scope.cc.emrfk)
            })
        }

        $scope.hapusGrid = function(dataSelectedRiwayatTransferInternal) {
            
            if($scope.dataSelectedRiwayatTransferInternal==null || $scope.dataSelectedRiwayatTransferInternal=='undefined') {
                toastr.error("Pilih data yang akan dihapus");
                return;
            }

            var item = {
                "norec": $scope.dataSelectedRiwayatTransferInternal.norec
            }

            var confirm = $mdDialog.confirm()
            .title('Peringatan')
            .textContent('Peringatan, Anda yakin akan menghapus riwayat transfer internal yang dipilih?')
            .ariaLabel('Lucky day')
            .cancel('Tidak')
            .ok('Ya')
            $mdDialog.show(confirm).then(function () {
                medifirstService.post('emr/delete-riwayat-transfer-internal/delete', item).then(function(e) {
                                                        
                    init()
                });
            })
        }

        // Fungsi untuk membuat id baris baru secara otomatis (+5 dari id sebelumnya)
      function buatBarisBaru(index) {
            let baseIdAwal = 1901305097;
            let baseId = baseIdAwal + (index * 5);
            return {
                no: index + 1,
                idNamaObat: baseId,
                idSediaan: baseId + 1,
                idTglJam: baseId + 2,
                idDosis: baseId + 3,
                idRute: baseId + 4
            };
        }

        // Fungsi yang dipanggil saat tombol di-klik
        $scope.tambahBarisManual = function() {
            let indexBaru = $scope.listBarisObat.length;
            $scope.listBarisObat.push(buatBarisBaru(indexBaru));
        };
    },
  ]);
});