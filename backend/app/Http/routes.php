<?php

//"Ever tried.
// Ever failed.
// No matter.
// Try Again.
// Fail again.
// Fail better".
// , Samuel Beckett

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

//yang pasti
Route::group(['middleware' => 'cors', 'prefix' => 'service'], function () {

    Route::group(['prefix' => 'medifirst2000'], function () {

        Route::group(['prefix' => 'auth'], function () {
            Route::post('sign-in', 'Auth\LoginController@loginUser');
            Route::post('sign-out', 'Auth\LoginController@signOut');
            Route::post('sign-in-andro', 'Auth\LoginController@loginAndro');
            Route::post('ubah-password', 'Auth\LoginController@ubahPassword');
            Route::post('sign-in-pelapor', 'Auth\LoginController@loginPelapor');
        });
        Route::group(['prefix' => 'fhir'], function () {
            Route::get('simrs', 'Auth\FhirController@bundle');
        });
        Route::group(['prefix' => 'report'], function () {
            Route::get('cetak-cuti', 'Report\ReportController@cetakCuti');
        });
        Route::group(['prefix' => 'akreditasi'], function () {

            Route::get('get-data-combo-akreditasi', 'Akuntansi\AkuntansiController@getComboAkreditasi');
            Route::get('get-daftar-kegiatan', 'Akuntansi\AkuntansiController@getDaftarKegiatan');
            Route::post('save-daftar-kegiatan', 'Akuntansi\AkuntansiController@saveDaftarKegiatan');
            Route::post('delete-daftar-kegiatan', 'Akuntansi\AkuntansiController@deleteDaftarKegiatan');
            Route::get('get-bab-daftar-kegiatan', 'Akuntansi\AkuntansiController@getBabDaftarKegiatan');
            Route::post('save-bab-daftar-kegiatan-otomatis', 'Akuntansi\AkuntansiController@saveBabOtomatis');
            Route::get('get-elemen-penilaian', 'Akuntansi\AkuntansiController@getElemenPenilaian');
            Route::post('save-elemen-penilaian-otomatis', 'Akuntansi\AkuntansiController@saveElemenPenilaianOtomatis');
            Route::post('save-elemen-row', 'Akuntansi\AkuntansiController@saveElemenRow');
            Route::get('get-dokumen-pendukung', 'Akuntansi\AkuntansiController@getDokumenPendukung');
            Route::get('get-dokumen', 'Akuntansi\AkuntansiController@getDokumen');
            Route::post('save-dokumen-pendukung', 'Akuntansi\AkuntansiController@saveDokumenPendukung');
            Route::get('get-bab-standar-akreditasi', 'Akuntansi\AkuntansiController@getBabStandarAkreditasi');
            Route::post('save-bab-standar', 'Akuntansi\AkuntansiController@saveBabStandar');
            Route::post('off-bab-standar', 'Akuntansi\AkuntansiController@offBabStandar');
            Route::get('get-elemen-penilaianm', 'Akuntansi\AkuntansiController@getElemenPenilaianM');
            Route::get('get-elemen-penilaiandm', 'Akuntansi\AkuntansiController@getElemenPenilaianDM');
            Route::post('save-elemen-penilaianm', 'Akuntansi\AkuntansiController@saveElemenPenilaianM');
            Route::post('save-elemen-penilaiandm', 'Akuntansi\AkuntansiController@saveElemenPenilaianDM');
            Route::get('get-length-bab', 'Akuntansi\AkuntansiController@getLengthBab');
            Route::post('save-tambahan-bab', 'Akuntansi\AkuntansiController@saveTambahanBab');
            Route::get('get-pokja-pegawai', 'Akuntansi\AkuntansiController@getPokjatoPegawai');
            Route::post('save-pokja-pegawai', 'Akuntansi\AkuntansiController@savePokjaPegawai');
            Route::get('get-pokja-pegawai-2', 'Akuntansi\AkuntansiController@getPokjatoPegawai2');
            Route::post('delete-dokumen', 'Akuntansi\AkuntansiController@deleteDokumen');
            Route::post('save-vic-akreditasi', 'Akuntansi\AkuntansiController@saveVicAkreditasi');
            Route::get('get-vic-akreditasi', 'Akuntansi\AkuntansiController@getVicAkreditasi');
            Route::post('save-luar-akreditasi', 'Akuntansi\AkuntansiController@saveLuarAkreditasi');
            Route::get('get-luar-akreditasi', 'Akuntansi\AkuntansiController@getLuarAkreditasi');
            Route::get('get-dashboard', 'Akuntansi\AkuntansiController@getDashboard');
            Route::get('get-persen-elemen', 'Akuntansi\AkuntansiController@getPersenElemenPenilaian');
            Route::post('update-elemen', 'Akuntansi\AkuntansiController@updateElemen');
            Route::post('update-elemen-d', 'Akuntansi\AkuntansiController@updateElemenD');
            Route::get('get-dokumen-akreditasi', 'Akuntansi\AkuntansiController@getDokumenAkreditasi');
        });
        Route::group(['prefix' => 'akuntansi'], function () {
            /*GET*/
            Route::get('get-data-combo-coa', 'Akuntansi\AkuntansiController@getDataCoa');
            Route::get('get-data-buku-besar-rev2/', 'Akuntansi\AkuntansiController@getDataBukuBesarRev2');
            Route::get('get-data-detail-buku-besar', 'Akuntansi\AkuntansiController@getDetailJurnalRev2018BukuBesar');
            Route::get('get-data-daftar-saldo-awal', 'Akuntansi\AkuntansiController@getDaftarSaldoAwal');
            Route::get('get-data-buku-besar-pembantu/', 'Akuntansi\AkuntansiController@getDataBukuBesarPembantu');
            Route::get('get-data-trial-balance', 'Akuntansi\AkuntansiController@getDataTrialBalance');
            Route::get('get-data-aruskas', 'Akuntansi\AkuntansiController@getDataArusKas');
            Route::get('get-data-combo-master', 'Akuntansi\AkuntansiController@getDataComboMasterAkun');
            Route::get('get-data-piutang-pasien', 'Akuntansi\AkuntansiController@getDataPiutangPasien');
            Route::get('get-data-daftar-master-coa', 'Akuntansi\AkuntansiController@getDaftarCoa');
            Route::get('get-data-detail-jurnal', 'Akuntansi\AkuntansiController@getDetailJurnalRev2018'); //done
            Route::get('get-data-detail-jurnal-posting', 'Akuntansi\AkuntansiController@getDetailJurnalPosting'); //done
            Route::get('get-data-combo-coa-part', 'Akuntansi\AkuntansiController@getCoaSaeutik');
            Route::get('get-data-jurnal-umum-2018', 'Akuntansi\AkuntansiController@getDataJurnalUmumRev2019'); //done
            Route::get('get-data-sal', 'Akuntansi\AkuntansiController@getDataSal'); //done
            Route::get('get-data-map-jurnal', 'Akuntansi\AkuntansiController@getDataMapJurnal'); //done
            /*END GET*/

            /*POST*/
            Route::post('save-data-saldo-awal', 'Akuntansi\AkuntansiController@SaveSaldoAwal');
            Route::post('save-hapus-saldo-awal', 'Akuntansi\AkuntansiController@SaveHapusSaldoAwal');
            Route::post('save-data-closing-jurnal', 'Akuntansi\AkuntansiController@SaveClosingJurnal');
            Route::post('save-batal-closing-jurnal', 'Akuntansi\AkuntansiController@SaveBatalClosingJurnal');
            Route::post('save-data-master-coa', 'Akuntansi\AkuntansiController@SaveDataChartOfAccount'); //done
            Route::post('hapus-data-master-coa', 'Akuntansi\AkuntansiController@HapusDataChartOfAccount'); //done
            Route::post('save-bengkel-jurnal', 'Akuntansi\AkuntansiController@BengkelJurnal');
            Route::post('save-hapus-double-jurnal', 'Akuntansi\AkuntansiController@HapusDoubleJurnal');
            //            Route::post('save-jurnal-pembayaran_tagihan', 'Akuntansi\AkuntansiController@PostingJurnal_pembayaran_tagihan');
            //            Route::post('save-jurnal-verifikasi_tarek', 'Akuntansi\AkuntansiController@PostingJurnal_strukpelayanan_t_verifikasi_tarek');
            Route::post('save-hapus-data-jurnal', 'Akuntansi\AkuntansiController@PostingHapusJurnal_entry'); //done
            Route::post('save-entry-jurnal', 'Akuntansi\AkuntansiController@PostingJurnal_entry');
            Route::post('save-entry-jurnal-bp', 'Akuntansi\AkuntansiController@PostingJurnal_entry_bp');
            Route::post('save-posting-jurnalv1', 'Akuntansi\AkuntansiController@PostingJurnalRev2018');
            Route::post('save-unposting-jurnalv1/', 'Akuntansi\AkuntansiController@UnPostingJurnalRev2018');
            Route::post('save-data-sal', 'Akuntansi\AkuntansiController@SaveDataSal'); //done
            Route::post('delete-data-sal', 'Akuntansi\AkuntansiController@deleteDataSal'); //done
            Route::post('save-map-jurnal', 'Akuntansi\AkuntansiController@saveMapJurnal');
            Route::post('save-map-jurnal-loop', 'Akuntansi\AkuntansiController@saveMapJurnalLoop');
            Route::post('hapus-map-jurnal', 'Akuntansi\AkuntansiController@hapusMapJurnal');
            Route::post('update-jurnalpenjamin', 'Akuntansi\AkuntansiController@updatejurnalpenjamin');
            /*END POST*/
        });
        Route::group(['prefix' => 'ambulance'], function () {
            Route::get('get-data-apd', 'Ambulance\AmbulanController@getDataApdAmbulance');
            Route::get('get-kelompok-user', 'Ambulance\AmbulanController@getKelompokUser');
            Route::get('get-data-for-combo', 'Ambulance\AmbulanController@GetDataForComboAmbulan');
            Route::get('get-data-order-ambulan', 'Ambulance\AmbulanController@getDaftarOrderAmbulan');

            Route::get('get-data-pasien-ambulan', 'Ambulance\AmbulanController@getPasienAmbulan');
            Route::post('simpan-data-pelayanan-ambulan', 'Ambulance\AmbulanController@savePelayananPasienAmbulan');
            Route::get('get-data-rincian-ambulan', 'Ambulance\AmbulanController@getRincianPelayananAmbulan');
            Route::get('get-data-pelayanan-ambulan', 'Ambulance\AmbulanController@getPelayananAmbulan');
            Route::get('get-data-jadwal-ambulan', 'Ambulance\AmbulanController@getJadwalAmbulan');
            Route::post('delete-order-pelayanan-ambulan', 'JAmbulance\AmbulanController@hapusOrderPelayananAmbulan');
            Route::get('get-riwayat-order-ambulan', 'Ambulance\AmbulanController@getRiwayatOrderPelayananAmbulan');
            Route::get('get-order-pelayanan-ambulan', 'Ambulance\AmbulanController@getOrderPelayananAmbulan');
            Route::get('get-data-combo-operator', 'Ambulance\AmbulanController@getDataComboOperator');
            Route::get('get-data-diagnosa', 'Ambulance\AmbulanController@getDataDiagnosa');
            Route::post('save-apd', 'Ambulance\AmbulanController@saveAntrianPasien');
            Route::get('get-data-combo-labrad', 'Ambulance\AmbulanController@getDataComboLabRab');
            Route::post('delete-pelayanan-pasien', 'Ambulance\AmbulanController@deletePelayananPasien');
            Route::get('get-data-registrasi-pasien-ambulan', 'Ambulance\AmbulanController@getDaftarRegistrasiPasienAmbulan');
            Route::post('save-order-pelayanan-ambulan', 'Ambulance\AmbulanController@saveOrderAmbulan');
            Route::post('delete-order-pelayanan-ambulan', 'Ambulance\AmbulanController@hapusOrderPelayananAmbulan');
            Route::get('get-data-produk', 'Ambulance\AmbulanController@getDataProduk');
            Route::post('save-input-non-layanan', 'Ambulance\AmbulanController@SaveInputTagihan');
            Route::get('daftar-tagihan-non-layanan', 'Ambulance\AmbulanController@daftarTagihanNonLayanan');
            Route::get('detail-tagihan-non-layanan', 'Ambulance\AmbulanController@detailTagihanNonLayanan');
            Route::post('save-pasien-ambulance', 'Ambulance\AmbulanController@savePasienAmbulance');
            Route::post('save-suratjalan', 'Ambulance\AmbulanController@savesuratjalan');
            Route::get('get-suratjalan', 'Ambulance\AmbulanController@getsuratjalan');
            Route::post('save-surat-kematian', 'Ambulance\AmbulanController@SaveSuratKematian');
            Route::get('get-inputan-kematian', 'Ambulance\AmbulanController@getInputanKematian');
            Route::post('save-surat-kematian-registrasi', 'Ambulance\AmbulanController@SaveSuratKematianOperator');
            Route::get('get-data-for-combo-emr', 'Ambulance\AmbulanController@GetDataForComboAmbulanEmr');
            Route::get('get-status-kependudukan', 'Ambulance\AmbulanController@GetStatusKependudukan');
            Route::post('save-surat-kematian-resume', 'Ambulance\AmbulanController@SaveSuratKematianResume');
            Route::get('get-status-kematian', 'Ambulance\AmbulanController@GetStatusKematian');
            Route::get('get-umur-kematian', 'Ambulance\AmbulanController@GetUmurKematian');

            //--ash 2024-01-29
            Route::get('get-cetak-pertama-surat-kematian', 'Ambulance\AmbulanController@getcetakPertamaSuratKematian');
            Route::get('get-nopol', 'Ambulance\AmbulanController@getNopol');
            Route::post('batal-cetak-kematian', 'Ambulance\AmbulanController@BatalCetakKematian');
        });
        Route::group(['prefix' => 'askep'], function () {});
        Route::group(['prefix' => 'bedah'], function () {
            Route::get('get-data-combo-dokter', 'Bedah\BedahController@getDataComboDokter');
            Route::get('get-daftar-antrian-bedah', 'Bedah\BedahController@getDaftarRegistrasiDokterBedah');
            Route::get('get-dokters-combos', 'Bedah\BedahController@getDokters');
            Route::get('get-data-rinciankomponen', 'Bedah\BedahController@getRinciankomponen');
            Route::post('save-update-dokter-antrian', 'Bedah\BedahController@updateDokterAntrian');
        });
        Route::group(['prefix' => 'bedmonitor'], function () {
            Route::get('get-data-view-bed', 'BedMonitor\BedMonitorController@getKetersediaanTempatTidurViewBM');
            Route::get('get-view-bed', 'BedMonitor\BedMonitorController@viewBedBM');
            Route::get('get-profile-login', 'BedMonitor\BedMonitorController@getDataProfileLogin');
            Route::get('cek-bed-ruangan-tujuan', 'BedMonitor\BedMonitorController@cekBedRuanganTujuan');
        });
        Route::group(['prefix' => 'bendaharapenerimaan'], function () {
            //**GET**//
            Route::get('get-data-combo', 'BendaharaPenerimaan\BendaharaPenerimaanController@getDataCombo');
            Route::get('get-daftar-sbm', 'BendaharaPenerimaan\BendaharaPenerimaanController@getDaftarSBM');
            Route::get('get-daftar-penerimaan-bank', 'BendaharaPenerimaan\BendaharaPenerimaanController@daftarBKU');
            Route::get('get-trial-balance', 'BendaharaPenerimaan\BendaharaPenerimaanController@getTrialBalanceBendahara');
            Route::get('get-list-target-kinerja', 'BendaharaPenerimaan\BendaharaPenerimaanController@getTargetKinerja');
            Route::get('get-daftar-sbm-deposit', 'BendaharaPenerimaan\BendaharaPenerimaanController@getDaftarSBMDeposit');
            Route::get('get-data-laporan-penerimaan-detail', 'BendaharaPenerimaan\BendaharaPenerimaanController@getDataLaporanPenerimaanDetail');
            Route::get('get-monitoring-klaim-per-bulan', 'BendaharaPenerimaan\BendaharaPenerimaanController@getDataMonitoringKlaim');
            Route::get('get-monitoring-klaim-per-bulan-jaspel', 'BendaharaPenerimaan\BendaharaPenerimaanController@getDataMonitoringKlaimJaspel');
            Route::get('get-daftar-setoran-kasir', 'BendaharaPenerimaan\BendaharaPenerimaanController@daftarSetoranKasir');
            Route::get('get-daftar-kelompok-transaksi', 'BendaharaPenerimaan\BendaharaPenerimaanController@daftarKelompokTransaksi');

            Route::get('get-penjamin', 'BendaharaPenerimaan\BendaharaPenerimaanController@getobjeectkelompokpasienlast');

            //ash
            Route::get('get-bku', 'BendaharaPenerimaan\BendaharaPenerimaanController@getBKU');
            //**GET**//

            //**POST**//
            Route::post('setoran-kasir', 'BendaharaPenerimaan\BendaharaPenerimaanController@simpanSetoranKasir');
            Route::post('setoran-kasir-persbm', 'BendaharaPenerimaan\BendaharaPenerimaanController@simpanSetoranKasirpersbm');
            Route::post('verif-kasir-persbm', 'BendaharaPenerimaan\BendaharaPenerimaanController@simpanVerifKasirpersbm');
            Route::post('batal-setoran-kasir', 'BendaharaPenerimaan\BendaharaPenerimaanController@batalSetoranKasir');
            Route::post('batal-verif-kasir', 'BendaharaPenerimaan\BendaharaPenerimaanController@batalVerifKasir');
            Route::post('simpan-penerimaan-bank', 'BendaharaPenerimaan\BendaharaPenerimaanController@simpanBKU');
            Route::post('save-temp-bku', 'BendaharaPenerimaan\BendaharaPenerimaanController@saveTempBukuKasUmum');
            Route::post('save-temp-beritaacara', 'BendaharaPenerimaan\BendaharaPenerimaanController@saveBeritaAcara');
            Route::post('save-lampiran-beritaacara', 'BendaharaPenerimaan\BendaharaPenerimaanController@saveTempLampiranBA');
            Route::post('hapus-bku', 'BendaharaPenerimaan\BendaharaPenerimaanController@hapusBKU');
            Route::post('verifikasi-Setoran', 'BendaharaPenerimaan\BendaharaPenerimaanController@verifikasiSetoran');
            Route::post('save-target-kinerja', 'BendaharaPenerimaan\BendaharaPenerimaanController@saveTargetKinerja');
            Route::post('setoran-kasir-deposit', 'BendaharaPenerimaan\BendaharaPenerimaanController@simpanSetoranKasirDeposit');
            Route::post('batal-setoran-kasir-deposit', 'BendaharaPenerimaan\BendaharaPenerimaanController@batalSetoranKasir');
            Route::post('save-monitoringklaim', 'BendaharaPenerimaan\BendaharaPenerimaanController@saveMonitoringKlaim');
            Route::post('save-monitoringklaimjaspel', 'BendaharaPenerimaan\BendaharaPenerimaanController@saveMonitoringKlaimJaspel');
            Route::post('save-verifikasi-jaspel', 'BendaharaPenerimaan\BendaharaPenerimaanController@saveVerifikasiJaspel');
            Route::post('save-verifikasi-jaspelnonbpjs', 'BendaharaPenerimaan\BendaharaPenerimaanController@saveVerifikasiJaspelnonbpjs');
            Route::post('unverifikasi-Setoran', 'BendaharaPenerimaan\BendaharaPenerimaanController@unverifikasiSetoran');

            //ash

            Route::post('simpan-kelompoktransaksi', 'BendaharaPenerimaan\BendaharaPenerimaanController@simpanKelompokTransaksi');
            //**POST**//
        });
        Route::group(['prefix' => 'bendaharapengeluaran'], function () {
            //**GET**//
            Route::get('get-data-combo', 'BendaharaPengeluaran\BendaharaPengeluaranController@getDataCombo');
            Route::get('get-daftar-pembayaran', 'BendaharaPengeluaran\BendaharaPengeluaranController@GetDaftarPembayaran');
            Route::get('get-data-tagihan-suplier', 'BendaharaPengeluaran\BendaharaPengeluaranController@GetDaftarTagihanSuplier');
            Route::get('get-detail-tagihan-suplier', 'BendaharaPengeluaran\BendaharaPengeluaranController@GetDetailTagihanSupplier');
            Route::get('get-riwayat-pembayaran-suplier', 'BendaharaPengeluaran\BendaharaPengeluaranController@GetRiwayatPembayaran');
            Route::get('get-data-penerimaan-kas-kecil', 'BendaharaPengeluaran\BendaharaPengeluaranController@getDaftarPenerimaanKasKecil');
            Route::get('get-daftar-bku-bk', 'BendaharaPengeluaran\BendaharaPengeluaranController@daftarBKUPengeluaran');
            Route::get('get-data-combo-bk', 'BendaharaPengeluaran\BendaharaPengeluaranController@getDataComboBk');
            Route::get('get-daftar-buku-kas-tunai', 'BendaharaPengeluaran\BendaharaPengeluaranController@daftarBukuKasTunai');
            Route::get('get-daftar-realisasi-anggaran', 'BendaharaPengeluaran\BendaharaPengeluaranController@getDaftarRealisasiAnggaran');
            Route::get('get-data-spj', 'BendaharaPengeluaran\BendaharaPengeluaranController@getDataSPJ');
            Route::get('get-daftar-kelompok-transaksi-penentuan-hutang', 'BendaharaPengeluaran\BendaharaPengeluaranController@daftarKelompokTransaksiPenentuanHutang');
            Route::get('get-daftar-kelompok-transaksi-pengeluaran', 'BendaharaPengeluaran\BendaharaPengeluaranController@daftarKelompokTransaksiPengeluaran');

            //**GET**//

            //**POST**//
            Route::post('save-pembayaran-tagihan-suplier', 'BendaharaPengeluaran\BendaharaPengeluaranController@savePembayaranTagihanSuplier');
            Route::post('simpan-pengeluaran-bku', 'BendaharaPengeluaran\BendaharaPengeluaranController@simpanBKUBk');
            Route::post('hapus-buku-kas-tunai', 'BendaharaPengeluaran\BendaharaPengeluaranController@hapusBukuKasTunai');
            Route::get('get-data-sbk', 'BendaharaPengeluaran\BendaharaPengeluaranController@getdaftarretur');
            Route::post('simpan-penentuan-hutang', 'BendaharaPengeluaran\BendaharaPengeluaranController@simpanPenentuanHutang');
            Route::post('simpan-retur', 'BendaharaPengeluaran\BendaharaPengeluaranController@simpanhistory');
            Route::post('verifikasi-Hutang', 'BendaharaPengeluaran\BendaharaPengeluaranController@verifikasiHutang');

            //**POST**//
        });
        Route::group(['prefix' => 'bridging'], function () {
            Route::group(['prefix' => 'bios'], function () {
                Route::post('get-token', 'Bridging\BridgingBiosController@getToken');
                Route::post('post-ranap', 'Bridging\BridgingBiosController@jumlahpasienrawatinap2');
                Route::get('get-kesehatan', 'Bridging\BridgingBiosController@getKesehatan');
                Route::get('get-kesehatanrs', 'Bridging\BridgingBiosController@getKesehatanrs');
                Route::get('get-kesehatanrsdetail', 'Bridging\BridgingBiosController@getKesehatanrsdetail');
                Route::get('get-kesehatanrskirim', 'Bridging\BridgingBiosController@getKesehatanrskirim');
                Route::get('get-listakun', 'Bridging\BridgingBiosController@getListAkun');
                Route::post('post-penerimaan', 'Bridging\BridgingBiosController@simpanpenerimaan');
                Route::get('get-penerimaan', 'Bridging\BridgingBiosController@getPenerimaan');
                Route::post('post-pengeluaran', 'Bridging\BridgingBiosController@simpanpengeluaran');
                Route::get('get-pengeluaran', 'Bridging\BridgingBiosController@getPengeluaran');
                Route::get('get-listbank', 'Bridging\BridgingBiosController@getListBank');
                Route::get('get-listrekening', 'Bridging\BridgingBiosController@getListRekening');
                Route::post('post-saldo', 'Bridging\BridgingBiosController@simpansaldoawal');
                Route::get('get-saldo', 'Bridging\BridgingBiosController@getSaldo');
            });
            Route::group(['prefix' => 'phs'], function () {
                Route::post('tools', 'Bridging\PHSController@ihsTools');
                Route::post('generate-token', 'Bridging\PHSController@generateToken');
                Route::post('Organization', 'Bridging\PHSController@Organization');
                Route::post('Location', 'Bridging\PHSController@Location');
                Route::post('Encounter', 'Bridging\PHSController@Encounter');
                Route::post('Condition', 'Bridging\PHSController@Condition');
                Route::post('Practitioner', 'Bridging\PHSController@Practitioner');
                Route::post('update-ihs-pasien', 'Bridging\PHSController@updateIHSPasien');
                Route::post('Location-bed', 'Bridging\PHSController@LocationBed');
                Route::post('map-fhir-room', 'Bridging\PHSController@MapRoom');
                Route::post('map-fhir-bed', 'Bridging\PHSController@MapBed');
                Route::post('post-all-patient-inap', 'Bridging\PHSController@PostAllPatientInap');
                Route::post('post-all-diagnosa', 'Bridging\PHSController@PostAllDiagnosa');
                Route::post('post-all-patient-lab', 'Bridging\PHSController@PostAllPatientLab');
                Route::post('post-all-patient-inap-pulang', 'Bridging\PHSController@PostAllPatientInapPulang');
                Route::post('post-all-patient-igd', 'Bridging\PHSController@PostAllPatientIGD');
                Route::post('post-all-patient-rj', 'Bridging\PHSController@PostAllPatientRJ');
            });

            Route::group(['prefix' => 'radiologi'], function () {
                Route::post('post-order', 'Bridging\BridgingRadiologiController@postorderradiologi');
                Route::post('post-order-2', 'Bridging\BridgingRadiologiController@postOrderPacsOtomatis');
                Route::post('post-expertise', 'Bridging\BridgingRadiologiController@postexpertiseradiologi');
                Route::post('update-pacs', 'Bridging\BridgingRadiologiController@updateOrderPacsInPP');
            });

            Route::group(['prefix' => 'anta'], function () {
                Route::post('post-ekyc', 'Bridging\BridgingAntaController@SaveEkyc');
                Route::get('get-ekyc', 'Bridging\BridgingAntaController@getEkyc');
                Route::get('get-ekyc-pernorec', 'Bridging\BridgingAntaController@getEkycpernorec');
                Route::get('get-print-noantrian', 'Bridging\BridgingAntaController@getPrintNoantrian');
                Route::get('get-print-sep', 'Bridging\BridgingAntaController@getPrintSEP');
                Route::get('get-print-noantrianruangan', 'Bridging\BridgingAntaController@getPrintNoantrianRuangan');
            });

            Route::group(['prefix' => 'bpjs2'], function () {
                //**Referensi V2***
                Route::get('get-poli', 'Bridging\BridgingBPJSV2Controller@getPoli');
                Route::get('get-ref-diagnosa', 'Bridging\BridgingBPJSV2Controller@getDiagnosa');
                Route::get('get-ref-diagnosa-part', 'Bridging\BridgingBPJSV2Controller@getDiagnosaPart');
                Route::get('get-ref-faskes', 'Bridging\BridgingBPJSV2Controller@getFaskes');
                Route::get('get-ref-faskes-part', 'Bridging\BridgingBPJSV2Controller@getFaskesSaeutik');
                Route::get('get-ref-diagnosatindakan', 'Bridging\BridgingBPJSV2Controller@getProcedureDiagnosaTindakan');
                Route::get('get-ref-diagnosatindakan-part', 'Bridging\BridgingBPJSV2Controller@getProcedureDiagnosaTindakanPart');
                Route::get('get-ref-kelasrawat', 'Bridging\BridgingBPJSV2Controller@getKelasRawat');
                Route::get('get-ref-dokter', 'Bridging\BridgingBPJSV2Controller@getDokter');
                Route::get('get-ref-spesialistik', 'Bridging\BridgingBPJSV2Controller@getSpesialistik');
                Route::get('get-ref-ruangrawat', 'Bridging\BridgingBPJSV2Controller@getRuangRawat');
                Route::get('get-ref-carakeluar', 'Bridging\BridgingBPJSV2Controller@getCaraKeluar');
                Route::get('get-ref-pascapulang', 'Bridging\BridgingBPJSV2Controller@getPascaPulang');
                Route::get('get-ref-diagnosa-contoh', 'Bridging\BridgingBPJSV2Controller@getDiagnosaReferen');
                Route::get('get-ref-dokter-part', 'Bridging\BridgingBPJSV2Controller@getDokterSaeutik');
                Route::get('get-poli-part', 'Bridging\BridgingBPJSV2Controller@getPoliSaeutik');
                Route::get('get-ref-dokter-dpjp', 'Bridging\BridgingBPJSV2Controller@getDokterDPJP');
                Route::get('get-ref-propinsi', 'Bridging\BridgingBPJSV2Controller@getPropinsi');
                Route::get('get-ref-kabupaten', 'Bridging\BridgingBPJSV2Controller@getKabupaten');
                Route::get('get-ref-kecamatan', 'Bridging\BridgingBPJSV2Controller@getKecamatan');
                Route::get('get-cari-nomor-suratkontrol', 'Bridging\BridgingBPJSV2Controller@getSuratKontrol');
                Route::get('get-programPRB', 'Bridging\BridgingBPJSV2Controller@getprogramPRB');
                Route::get('get-obatprb', 'Bridging\BridgingBPJSV2Controller@getobatPRB');
                Route::get('get-data-induk-kecelakaan', 'Bridging\BridgingBPJSV2Controller@getDataIndukKecelakaan');
                Route::get('get-rujukan-pcare-nokartu-multi', 'Bridging\BridgingBPJSV2Controller@getRujukanNoKartuMulti');
                Route::get('get-rujukan-rs-nokartu-multi', 'Bridging\BridgingBPJSV2Controller@getRujukanNoKartuMultiRS');
                Route::get('get-rujukan-pcare-nokartu', 'Bridging\BridgingBPJSV2Controller@getNoRujukanPcareNoKartu');
                Route::get('get-rujukan-rs-nokartu', 'Bridging\BridgingBPJSV2Controller@getNoRujukanRsNoKartu');
                Route::post('icare', 'Bridging\BridgingBPJSV2Controller@Icare');

                //*End Fer V2*
                //** Rujukan */
                Route::get('get-rujukan-pcare', 'Bridging\BridgingBPJSV2Controller@getNoRujukanPcare');
                Route::get('get-rujukan-rs', 'Bridging\BridgingBPJSV2Controller@getNoRujukanRs');
                Route::post('insert-rujukan-v2', 'Bridging\BridgingBPJSV2Controller@insertRujukan');
                Route::get('get-cari-nomor-rujukan-keluar', 'Bridging\BridgingBPJSV2Controller@getSuratRujukanKeluar');
                Route::post('insert-prb', 'Bridging\BridgingBPJSV2Controller@insertPRB');
                //*PESERTA
                Route::get('get-no-peserta', 'Bridging\BridgingBPJSV2Controller@getNoPeserta');
                Route::get('get-nik', 'Bridging\BridgingBPJSV2Controller@getNIK');
                Route::get('get-no-peserta-v1', 'Bridging\BridgingBPJSV2Controller@getNoPesertaV1');
                //** End Peserta */
                //**SEP
                Route::post('insert-sep', 'Bridging\BridgingBPJSV2Controller@insertSEP');
                Route::get('cek-sep', 'Bridging\BridgingBPJSV2Controller@cekSep');
                Route::delete('delete-sep', 'Bridging\BridgingBPJSV2Controller@deleteSEP');
                Route::put('update-sep', 'Bridging\BridgingBPJSV2Controller@updateSEP');
                Route::post('post-pengajuan', 'Bridging\BridgingBPJSV2Controller@postPengajuan');
                Route::post('post-aprovalSEP', 'Bridging\BridgingBPJSV2Controller@postApprovalPengajuanSep');
                Route::put('update-tglpulang', 'Bridging\BridgingBPJSV2Controller@updateTglPulang');
                Route::get('get-integrasi-inacbg', 'Bridging\BridgingBPJSV2Controller@getIntegrasiSepInaCbg');
                Route::get('get-suplesi-jasaraharja', 'Bridging\BridgingBPJSV2Controller@getSuplesiJasaRaharja');
                Route::post('insert-sep-v1.1', 'Bridging\BridgingBPJSV2Controller@insertSepV11');
                Route::put('update-sep-v1.1', 'Bridging\BridgingBPJSV2Controller@updateSepV11');
                Route::get('generateskdp', 'Bridging\BridgingBPJSV2Controller@generateNoSKDP');
                Route::post('insert-sep-v2', 'Bridging\BridgingBPJSV2Controller@insertSepV2');
                Route::post('insert-spri', 'Bridging\BridgingBPJSV2Controller@insertSpri');
                Route::get('get-fingerprint', 'Bridging\BridgingBPJSV2Controller@getFingerPrint');
                Route::get('get-fingerprint-list', 'Bridging\BridgingBPJSV2Controller@getFingerPrintList');
                //End SEP
                // kontrol
                Route::post('insert-spri-v2', 'Bridging\BridgingBPJSV2Controller@insertSPRIV2');
                Route::post('update-spri-v2', 'Bridging\BridgingBPJSV2Controller@updateSPRIV2');
                Route::get('cari-rencana-kontrol-sep-v2', 'Bridging\BridgingBPJSV2Controller@cariRencanaKontrolSEPV2');
                Route::get('cari-rencana-kontrol-v2', 'Bridging\BridgingBPJSV2Controller@cariRencanaKontrolV2');
                Route::get('cari-rencana-kontrol-v2-all', 'Bridging\BridgingBPJSV2Controller@cariRencanaKontrolV2All');
                Route::delete('hapus-rencana-kontrol-v2', 'Bridging\BridgingBPJSV2Controller@hapusRencanaKontrolV2');
                Route::post('insert-rencana-kontrol-v2', 'Bridging\BridgingBPJSV2Controller@insertRencanaKontrolV2');
                Route::put('update-rencana-kontrol-v2', 'Bridging\BridgingBPJSV2Controller@updateRencanaKontrolV2');
                Route::get('monitoring/HistoriPelayanan/NoKartu/{noKartu}', 'Bridging\BridgingBPJSV2Controller@getMonitoringHistori');
                Route::get('listsuratkontrol-berdasarkan/NoKartu/{noKartu}', 'Bridging\BridgingBPJSV2Controller@getListRencanaKontrolBerdasarkanNoKartu');
                Route::get('listsuratkontrol-duabulan/NoKartu/{noKartu}', 'Bridging\BridgingBPJSV2Controller@cariListHistoriSuratKontrol');
                Route::get('monitoring/HistoriPelayanan-duabulan/NoKartu/{noKartu}', 'Bridging\BridgingBPJSV2Controller@getMonitoringHistoriDuaBulan');
                Route::post('monitoring/HistoriPelayanan-duabulan/noSep', 'Bridging\BridgingBPJSV2Controller@kirimNoSEP');
                Route::get('cari-jumlah-sep-rujukan', 'Bridging\BridgingBPJSV2Controller@carijumlahsep');

                //##MJKN
                Route::get('mjkn/antrian/getRefPoli', 'Bridging\BridgingBPJSV2Controller@mjknRefPoli');
                Route::get('mjkn/antrian/getRefDokter', 'Bridging\BridgingBPJSV2Controller@mjknRefDokter');
                Route::get('mjkn/antrian/getjadwal', 'Bridging\BridgingBPJSV2Controller@AntrianRSjadwaldokter');
                Route::post('mjkn/antrian/updatejadwal', 'Bridging\BridgingBPJSV2Controller@UpdateAntrianRSjadwaldokter');
                Route::post('mjkn/antrian/tambahantrian', 'Bridging\BridgingBPJSV2Controller@TambahAntreanApiJkn');
                Route::post('mjkn/antrian/UpdateWaktuTaskId', 'Bridging\BridgingBPJSV2Controller@UpdateWaktuTaskId');
                Route::post('mjkn/antrian/batalantrian', 'Bridging\BridgingBPJSV2Controller@BatalAntreanApiJkn');
                Route::post('mjkn/antrian/statusantrian', 'Bridging\BridgingBPJSV2Controller@StatusAntrianMjknAles');
                Route::post('mjkn/antrian/waktuTaskid', 'Bridging\BridgingBPJSV2Controller@WaktuTaskId');
                Route::post('mjkn/antrian/dashboardPerTgl', 'Bridging\BridgingBPJSV2Controller@DashboardPerTgl');
                Route::post('mjkn/antrian/dashboardPerBln', 'Bridging\BridgingBPJSV2Controller@DashboardPerBln');
                Route::post('mjkn/antrian/getantrian', 'Bridging\BridgingBPJSV2Controller@GetAntrianMjknAlesNew');
                Route::post('mjkn/antrian/GetSisaAntrian', 'Bridging\BridgingBPJSV2Controller@GetSisaAntrianMjknAles');
                Route::post('mjkn/antrian/BatalAntrian', 'Bridging\BridgingBPJSV2Controller@BatalAntrianMjkn');
                Route::post('mjkn/antrian/CekinAntrian', 'Bridging\BridgingBPJSV2Controller@CekinAntrianMjkn');
                Route::post('mjkn/antrian/GetJadwalOprasiAll', 'Bridging\BridgingBPJSV2Controller@GetJadwalOprasiAll');
                Route::post('mjkn/antrian/GetJadwalOprasiSatu', 'Bridging\BridgingBPJSV2Controller@GetJadwalOprasiSatu');
                Route::post('mjkn/antrian/SavePasien', 'Bridging\BridgingBPJSV2Controller@SavePasienMjkn');
                Route::get('mjkn/antrian/Authentication', 'Auth\LoginController@AuthenticationMjkn');
                Route::post('mjkn/antrian/UpdateWaktuTaskId', 'Bridging\BridgingBPJSV2Controller@UpdateWaktuTaskId');
                Route::post('mjkn/antrian/UpdateWaktuTaskIdRombongan', 'Bridging\BridgingBPJSV2Controller@UpdateWaktuTaskIdRombongan');

                Route::get('mjkn/antrian/getDokterDPJPLokal', 'Bridging\BridgingBPJSV2Controller@getDokterDPJPLokal');
                Route::get('mjkn/antrian/get-asal-rujukan-bpjs', 'Bridging\BridgingBPJSV2Controller@getAsalRujukanBPJS');
                Route::get('mjkn/antrian/cek-rm', 'Bridging\BridgingBPJSV2Controller@getPasien');

                //##END JKN

                Route::get('get-diagnosa-saeutik', 'Bridging\BridgingBPJSV2Controller@getDiagnosaSaeutik');
                Route::get('get-diagnosa-tindakan-saeutik', 'Bridging\BridgingBPJSV2Controller@getDiagnosaTindakanSaeutik');
                Route::get('get-ruangan-ri', 'Bridging\BridgingBPJSV2Controller@getRuanganRI');
                Route::get('get-ruangan-rj', 'Bridging\BridgingBPJSV2Controller@getRuanganRJ');
                Route::get('get-sep-bynoregistrasi', 'Bridging\BridgingBPJSV2Controller@getSepByNoregistrasi');
                Route::post('insert-rujukan-khusus-v2', 'Bridging\BridgingBPJSV2Controller@insertRujukanKhususV2');
                // Monitoring
                Route::get('get-monitoring-kunjungan', 'Bridging\BridgingBPJSV2Controller@getMonitoringKunjungan');
                Route::get('get-monitoring-klaim', 'Bridging\BridgingBPJSV2Controller@getMonitoringKlaim');
                Route::get('monitoring/HistoriPelayanan/NoKartu/{noKartu}', 'Bridging\BridgingBPJSV2Controller@getMonitoringHistori');
                Route::get('get-monitoring-klaim-jasaraharja', 'Bridging\BridgingBPJSV2Controller@getMonitoringJasaRaharja');
                Route::get('get-monitoring-historipelayanan-peserta', 'Bridging\BridgingBPJSV2Controller@getHistoryPelayananPeserta');
                Route::get('get-monitoring-klaim-per-bulan', 'Bridging\BridgingBPJSV2Controller@getMonitoringKlaimPerBulan');

                // aplicares
                Route::get('aplicaresws/get-tt-push', 'Bridging\BridgingBPJSV2Controller@getKetersediaanTTNewPush');
                Route::get('aplicaresws/get-tt', 'Bridging\BridgingBPJSV2Controller@getKetersediaanTTNew');
                Route::get('aplicaresws/rest/ref/kelas', 'Bridging\BridgingBPJSV2Controller@getReferensiKamar');
                Route::post('aplicaresws/rest/bed/update/{kodeppk}', 'Bridging\BridgingBPJSV2Controller@updateKetersediaanTT');
                Route::post('aplicaresws/rest/bed/create/{kodeppk}', 'Bridging\BridgingBPJSV2Controller@postRuanganBaru');
                Route::get('aplicaresws/rest/bed/read/{kodeppk}/{start}/{limit}', 'Bridging\BridgingBPJSV2Controller@getKetersedianKamarRS');
                Route::post('aplicaresws/rest/bed/delete/{kodeppk}', 'Bridging\BridgingBPJSV2Controller@hapusRuangan');
                Route::post('aplicaresws/rest/bed/update/push', 'Bridging\BridgingBPJSV2Controller@updateKetersediaanTTPush');
                // 
            });
            Route::group(['prefix' => 'bpjs'], function () {
                Route::get('get-signature', 'Bridging\BridgingBPJSController@getSignature');
                Route::get('get-has-code', 'Bridging\BridgingBPJSController@getHasCode');
                //**Referensi***
                Route::get('get-poli', 'Bridging\BridgingBPJSController@getPoli');
                Route::get('get-ref-diagnosa', 'Bridging\BridgingBPJSController@getDiagnosa');
                Route::get('get-ref-diagnosa-part', 'Bridging\BridgingBPJSController@getDiagnosaPart');
                Route::get('get-ref-faskes', 'Bridging\BridgingBPJSController@getFaskes');
                Route::get('get-ref-faskes-part', 'Bridging\BridgingBPJSController@getFaskesSaeutik');
                Route::get('get-ref-diagnosatindakan', 'Bridging\BridgingBPJSController@getProcedureDiagnosaTindakan');
                Route::get('get-ref-diagnosatindakan-part', 'Bridging\BridgingBPJSController@getProcedureDiagnosaTindakanPart');
                Route::get('get-ref-kelasrawat', 'Bridging\BridgingBPJSController@getKelasRawat');
                Route::get('get-ref-dokter', 'Bridging\BridgingBPJSController@getDokter');
                Route::get('get-ref-spesialistik', 'Bridging\BridgingBPJSController@getSpesialistik');
                Route::get('get-ref-ruangrawat', 'Bridging\BridgingBPJSController@getRuangRawat');
                Route::get('get-ref-carakeluar', 'Bridging\BridgingBPJSController@getCaraKeluar');
                Route::get('get-ref-pascapulang', 'Bridging\BridgingBPJSController@getPascaPulang');
                Route::get('get-ref-diagnosa-contoh', 'Bridging\BridgingBPJSController@getDiagnosaReferen');
                Route::get('get-ref-dokter-part', 'Bridging\BridgingBPJSController@getDokterSaeutik');
                Route::get('get-poli-part', 'Bridging\BridgingBPJSController@getPoliSaeutik');
                Route::get('get-ref-dokter-dpjp', 'Bridging\BridgingBPJSController@getDokterDPJP');
                Route::get('get-ref-propinsi', 'Bridging\BridgingBPJSController@getPropinsi');
                Route::get('get-ref-kabupaten', 'Bridging\BridgingBPJSController@getKabupaten');
                Route::get('get-ref-kecamatan', 'Bridging\BridgingBPJSController@getKecamatan');
                Route::get('get-cari-nomor-suratkontrol', 'Bridging\BridgingBPJSController@getSuratKontrol');
                Route::get('get-programPRB', 'Bridging\BridgingBPJSController@getprogramPRB');
                Route::get('get-obatprb', 'Bridging\BridgingBPJSController@getobatPRB');
                Route::get('get-data-induk-kecelakaan', 'Bridging\BridgingBPJSV2Controller@getDataIndukKecelakaan');
                Route::post('insert-rujukan-khusus-v2', 'Bridging\BridgingBPJSV2Controller@insertRujukanKhususV2');
                Route::get('list-rujukan-khusus-v2', 'Bridging\BridgingBPJSV2Controller@listRujukanKhususV2');
                Route::get('list-spesialistik-rujukan-khusus-v2', 'Bridging\BridgingBPJSV2Controller@listSpesialistikRujukanKhususV2');
                Route::get('list-sasaran-v2', 'Bridging\BridgingBPJSV2Controller@listSasaranV2');
                // Route::get('cari-rencana-kontrol-v2', 'Bridging\BridgingBPJSV2Controller@cariRencanaKontrolV2');
                // Route::get('cari-rencana-kontrol-sep-v2', 'Bridging\BridgingBPJSV2Controller@cariRencanaKontrolSEPV2');
                // Route::delete('hapus-rencana-kontrol', 'Bridging\BridgingBPJSV2Controller@hapusRencanaKontrolV2');
                // Route::post('insert-rencana-kontrol-v2', 'Bridging\BridgingBPJSV2Controller@insertRencanaKontrolV2');
                // Route::post('insert-spri-v2', 'Bridging\BridgingBPJSV2Controller@insertSPRIV2');
                // Route::put('update-spri-v2', 'Bridging\BridgingBPJSV2Controller@updateSPRIV2');
                Route::get('get-data-sep-internal', 'Bridging\BridgingBPJSV2Controller@getDataSEPInternal');
                Route::put('update-rencana-kontrol-v2', 'Bridging\BridgingBPJSV2Controller@updateRencanaKontrolV2');
                Route::delete('delete-sep-internal-v2', 'Bridging\BridgingBPJSController@deleteSEPInternalV2');
                //*End Ref


                // VCLAIM V2 Trisno
                Route::get('get-v2', 'Bridging\BridgingBPJSV2Controller@getV2');



                // surat kontrol
                Route::post('insert-surat-kontrol', 'Bridging\BridgingBPJSController@insertSuratKontrol');
                // 
                //**SEP
                Route::post('insert-sep', 'Bridging\BridgingBPJSController@insertSEP');
                Route::get('cek-sep', 'Bridging\BridgingBPJSController@cekSep');
                Route::delete('delete-sep', 'Bridging\BridgingBPJSController@deleteSEP');
                Route::put('update-sep', 'Bridging\BridgingBPJSController@updateSEP');
                Route::post('post-pengajuan', 'Bridging\BridgingBPJSController@postPengajuan');
                Route::post('post-aprovalSEP', 'Bridging\BridgingBPJSController@postApprovalPengajuanSep');
                Route::put('update-tglpulang', 'Bridging\BridgingBPJSController@updateTglPulang');
                Route::get('get-integrasi-inacbg', 'Bridging\BridgingBPJSController@getIntegrasiSepInaCbg');
                Route::get('get-suplesi-jasaraharja', 'Bridging\BridgingBPJSController@getSuplesiJasaRaharja');
                Route::post('insert-sep-v1.1', 'Bridging\BridgingBPJSController@insertSepV11');
                Route::put('update-sep-v1.1', 'Bridging\BridgingBPJSController@updateSepV11');
                Route::get('generateskdp', 'Bridging\BridgingBPJSController@generateNoSKDP');
                Route::post('insert-sep-v2', 'Bridging\BridgingBPJSController@insertSepV2');
                Route::post('insert-spri', 'Bridging\BridgingBPJSController@insertSpri');
                //End SEP
                // PRB
                Route::post('insert-prb', 'Bridging\BridgingBPJSController@insertPRB');
                // 
                //*PESERTA
                Route::get('get-no-peserta', 'Bridging\BridgingBPJSController@getNoPeserta');
                Route::get('get-nik', 'Bridging\BridgingBPJSController@getNIK');
                Route::get('get-no-peserta-v1', 'Bridging\BridgingBPJSController@getNoPesertaV1');
                //** End Peserta */
                //##Rujukan
                Route::get('get-rujukan-rs', 'Bridging\BridgingBPJSController@getNoRujukanRs');
                Route::get('get-rujukan-pcare', 'Bridging\BridgingBPJSController@getNoRujukanPcare');
                Route::get('get-rujukan-rs-nokartu', 'Bridging\BridgingBPJSController@getNoRujukanRsNoKartu');
                Route::get('get-rujukan-pcare-nokartu', 'Bridging\BridgingBPJSController@getNoRujukanPcareNoKartu');
                Route::post('insert-rujukan', 'Bridging\BridgingBPJSController@insertRujukan');
                Route::put('update-rujukan', 'Bridging\BridgingBPJSController@updateRujukan');
                Route::delete('delete-rujukan', 'Bridging\BridgingBPJSController@deleteRujukan');
                Route::get('get-rujukan-pcare-nokartu-multi', 'Bridging\BridgingBPJSController@getRujukanNoKartuMulti');
                Route::get('get-rujukan-rs-nokartu-multi', 'Bridging\BridgingBPJSController@getRujukanNoKartuMultiRS');
                Route::get('get-rujukanbytglrujukan', 'Bridging\BridgingBPJSController@getRujukanByTglRujukan');
                Route::get('get-rujukanbytglrujukan-rs', 'Bridging\BridgingBPJSController@getRujukanByTglRujukanRS');
                Route::get('data-dokter', 'Bridging\BridgingBPJSController@dataDokter');
                //##End Rujukan
                //##Lembar Pengajuan Klaim
                Route::post('insert-lpk', 'Bridging\BridgingBPJSController@insertLPK');
                Route::put('update-lpk', 'Bridging\BridgingBPJSController@updateLPK');
                Route::delete('delete-lpk', 'Bridging\BridgingBPJSController@deleteLPK');
                Route::get('data-lpk', 'Bridging\BridgingBPJSController@dataLPK');
                //##End Lembar Pengajuan Klaim
                //##Monitoring
                Route::get('get-monitoring-kunjungan', 'Bridging\BridgingBPJSController@getMonitoringKunjungan');
                Route::get('get-monitoring-klaim', 'Bridging\BridgingBPJSController@getMonitoringKlaim');
                Route::get('monitoring/HistoriPelayanan/NoKartu/{noKartu}', 'Bridging\BridgingBPJSController@getMonitoringHistori');
                Route::get('get-monitoring-klaim-jasaraharja', 'Bridging\BridgingBPJSController@getMonitoringJasaRaharja');
                Route::get('get-monitoring-historipelayanan-peserta', 'Bridging\BridgingBPJSController@getHistoryPelayananPeserta');
                Route::get('get-monitoring-klaim-per-bulan', 'Bridging\BridgingBPJSController@getMonitoringKlaimPerBulan');
                //##End Monitoring
                Route::get('get-diagnosa-saeutik', 'Bridging\BridgingBPJSController@getDiagnosaSaeutik');
                Route::get('get-diagnosa-tindakan-saeutik', 'Bridging\BridgingBPJSController@getDiagnosaTindakanSaeutik');
                Route::get('get-ruangan-ri', 'Bridging\BridgingBPJSController@getRuanganRI');
                Route::get('get-ruangan-rj', 'Bridging\BridgingBPJSController@getRuanganRJ');
                Route::get('get-sep-bynoregistrasi', 'Bridging\BridgingBPJSController@getSepByNoregistrasi');

                Route::post('save-bpjs-klaim', 'Bridging\BridgingBPJSController@simpanBpjsKlaim');
                Route::post('save-bpjs-klaim-gagal-hitung', 'Bridging\BridgingBPJSController@simpanGagalHitungBpjsKlaim');
                Route::get('get-checklist-klaim', 'Bridging\BridgingBPJSController@getChecklistKlaim');
                Route::post('save-rujukan', 'Bridging\BridgingBPJSController@simpanLokalRujukan');
                Route::get('get-daftar-rujukan', 'Bridging\BridgingBPJSController@getLokalRujukan');

                Route::get('get-daftar-poli-internal', 'Bridging\BridgingBPJSController@getRuanganBPJSInternal');
                Route::get('get-nosep-by-norec-pd/{norec_pd}', 'Bridging\BridgingBPJSController@getNoSEPByNorecPd');

                Route::get('aplicaresws/get-tt', 'Bridging\BridgingBPJSController@getKetersediaanTTNew');
                Route::get('aplicaresws/rest/ref/kelas', 'Bridging\BridgingBPJSController@getReferensiKamar');
                Route::post('aplicaresws/rest/bed/update/{kodeppk}', 'Bridging\BridgingBPJSController@updateKetersediaanTT');
                Route::post('aplicaresws/rest/bed/create/{kodeppk}', 'Bridging\BridgingBPJSController@postRuanganBaru');
                Route::get('aplicaresws/rest/bed/read/{kodeppk}/{start}/{limit}', 'Bridging\BridgingBPJSController@getKetersedianKamarRS');
                Route::post('aplicaresws/rest/bed/delete/{kodeppk}', 'Bridging\BridgingBPJSController@hapusRuangan');
                Route::post('dukcapil/get-nik', 'Bridging\BridgisysadminngBPJSController@getInformasiDukcapilFromNIK');
                //##YANKES
                Route::get('yankes-get-kunjungan', 'Bridging\BridgingYankesController@getKunjungan');
                Route::post('yankes-update-kunjungan', 'Bridging\BridgingYankesController@updateKunjungan');
                Route::get('yankes-count-kunjungan-pasien', 'Bridging\BridgingYankesController@countKunjungan');
                Route::post('yankes-insert-kunjungan', 'Bridging\BridgingYankesController@insertKunjungan');
                Route::get('yankes-get-rujukan', 'Bridging\BridgingYankesController@getRujukan');
                Route::post('yankes-update-rujukan', 'Bridging\BridgingYankesController@updateRujukan');
                Route::post('yankes-insert-rujukan', 'Bridging\BridgingYankesController@insertRujukan');
                //##END YANKES
                // prb
                Route::get('get-prb-by-tanggal', 'Bridging\BridgingBPJSController@getCariPRBbyTanggal');
                // 


                Route::get('get-status-bed', 'Bridging\BridgingMabesPolri@getStatusBed');

                //##MJKN
                Route::get('mjkn/antrian/getjadwal', 'Bridging\BridgingBPJSController@AntrianRSjadwaldokter');
                Route::post('mjkn/antrian/updatejadwal', 'Bridging\BridgingBPJSController@UpdateAntrianRSjadwaldokter');
                Route::post('mjkn/antrian/tambahantrian', 'Bridging\BridgingBPJSController@TambahAntreanApiJkn');
                Route::post('mjkn/antrian/UpdateWaktuTaskId', 'Bridging\BridgingBPJSController@UpdateWaktuTaskId');
                Route::post('mjkn/antrian/batalantrian', 'Bridging\BridgingBPJSController@BatalAntreanApiJkn');
                Route::post('mjkn/antrian/statusantrian', 'Bridging\BridgingBPJSController@StatusAntrianMjkn');
                Route::post('mjkn/antrian/waktuTaskid', 'Bridging\BridgingBPJSController@WaktuTaskId');
                Route::get('mjkn/antrian/dashboardPerTgl', 'Bridging\BridgingBPJSController@DashboardPerTgl');
                Route::get('mjkn/antrian/dashboardPerBln', 'Bridging\BridgingBPJSController@DashboardPerBln');
                Route::post('mjkn/antrian/getantrian', 'Bridging\BridgingBPJSController@GetAntrianMjkn');
                Route::post('mjkn/antrian/GetSisaAntrian', 'Bridging\BridgingBPJSController@GetSisaAntrianMjkn');
                Route::post('mjkn/antrian/BatalAntrian', 'Bridging\BridgingBPJSController@BatalAntrianMjkn');
                Route::post('mjkn/antrian/CekinAntrian', 'Bridging\BridgingBPJSController@CekinAntrianMjkn');
                Route::post('mjkn/antrian/GetJadwalOprasiAll', 'Bridging\BridgingBPJSController@GetJadwalOprasiAll');
                Route::post('mjkn/antrian/GetJadwalOprasiSatu', 'Bridging\BridgingBPJSController@GetJadwalOprasiSatu');
                Route::post('mjkn/antrian/SavePasien', 'Bridging\BridgingBPJSController@SavePasienMjkn');
                Route::get('mjkn/antrian/Authentication', 'Auth\LoginController@AuthenticationMjkn');

                Route::get('mjkn/antrian/getDokterDPJPLokal', 'Bridging\BridgingBPJSController@getDokterDPJPLokal');


                //##END JKN

                //##apotek online
                Route::get('apotek/getDPHO', 'Bridging\BridgingBPJSController@getDPHO');
                Route::get('apotek/getfaskes', 'Bridging\BridgingBPJSController@getFaskesapotek');
                Route::get('apotek/getnosep', 'Bridging\BridgingBPJSController@getNosep');
                Route::get('apotek/getspesialistik', 'Bridging\BridgingBPJSController@getSpesialistikapotek');
                Route::get('apotek/getdaftarpelayananobat', 'Bridging\BridgingBPJSController@getdafatarpelayananobat');
                Route::delete('apotek/delethapuspelayananapotek', 'Bridging\BridgingBPJSController@deleteSEPApotek');
                Route::get('apotek/getmonitoringclaim', 'Bridging\BridgingBPJSController@getmonitoringclaimapotek');
                Route::get('apotek/getriwayatpelayananobat', 'Bridging\BridgingBPJSController@getriwayatpelayananobat');
                Route::get('apotek/getpencarianobat', 'Bridging\BridgingBPJSController@getpencarianobat');
                Route::post('apotek/insertsep', 'Bridging\BridgingBPJSController@insertSEPresep');
                Route::post('apotek/simpanobatnonracikan', 'Bridging\BridgingBPJSController@simpanobatnonracikan');
                Route::post('apotek/simpanobatracikan', 'Bridging\BridgingBPJSController@simpanobatracikan');
                Route::post('apotek/getDaftarResep', 'Bridging\BridgingBPJSController@getDaftarResep');
                Route::delete('apotek/deleteResep', 'Bridging\BridgingBPJSController@deleteResep');
                Route::get('apotek/getReferensiApotek', 'Bridging\BridgingBPJSController@getReferensiApotek');
                Route::get('apotek/getReferensiPoli', 'Bridging\BridgingBPJSController@getReferensiPoli');



                //## END JKN
            });

            Route::group(['prefix' => 'inacbg'], function () {
                Route::get('get-daftar-pasien-inacbg', 'Bridging\InaCbgController@getDaftarPasien');
                Route::get('get-daftar-pasien-inacbgV2', 'Bridging\InaCbgController@getDaftarPasienV2');
                Route::post('save-bridging-inacbg', 'Bridging\InaCbgController@saveBridgingINACBG');
                Route::post('save-bridging-inacbg-idrg', 'Bridging\InaCbgController@saveBridgingINACBGIDRG');
                Route::get('get-combo', 'Bridging\InaCbgController@getComboInaCbg');

                Route::get('get-cari-daftar-pasien', 'Bridging\InaCbgController@getCariDaftarPasien');
                Route::get('get-cari-history-daftar-pasien', 'Bridging\InaCbgController@getCariHistoryDaftarPasien');
                Route::get('get-cari-history-daftar-pasien-idrg', 'Bridging\InaCbgController@getCariHistoryDaftarPasienIDRG');
                Route::get('get-cari-set-form-inacbg', 'Bridging\InaCbgController@getCariSetFormInacbg');
                Route::get('get-cari-set-form-inacbg-idrg', 'Bridging\InaCbgController@getCariSetFormInacbgIdrg');
                Route::get('get-cari-daftar-pasien-sendClaim', 'Bridging\InaCbgController@getCariDaftarSendClaim');
                Route::get('get-cari-daftar-pasien-belumClaim', 'Bridging\InaCbgController@getCariDaftarBelumClaim');

                Route::get('get-daftar-informasi-tanggungan', 'Bridging\InaCbgController@getDaftarPasienInformasiTanggungan');
                Route::post('save-proposi-bridging-inacbg', 'Bridging\InaCbgController@saveProposiBridgingINACBG');
                Route::get('get-daftar-pasien-statusnaikkelas', 'Bridging\InaCbgController@getStatusNaikKelas');
                Route::post('save-informasi-tanggungan', 'Bridging\InaCbgController@saveInformasiTanggungan');
                Route::post('update-status-bridging-inacbg', 'Bridging\InaCbgController@updateStatusBridgingINACBG');
                Route::get('get-status-bridging-inacbg', 'Bridging\InaCbgController@getStatusBridgingINACBG');
                Route::post('update-status-kondisi-khusus', 'Bridging\InaCbgController@updateStatusKondisiKhusus');
                Route::post('save-pengajuan-klaim', 'Transaksi\Pelayanan\InaCbgController@savePengajuanKlaim');
                Route::get('get-daftar-purif-mandiri', 'Bridging\InaCbgController@getDaftarPurifMandiri');
                Route::post('save-beratbadanbayi', 'Bridging\InaCbgController@saveBeratBadan');
                Route::post('save-tekananDarah', 'Bridging\InaCbgController@saveTekananDarah');
                Route::post('save-persalinan', 'Bridging\InaCbgController@savePersalinan');
                Route::post('save-dializer', 'Bridging\InaCbgController@saveDializer');
            });
            Route::group(['prefix' => 'farmasi'], function () {

                Route::get('referensi/dpho', 'Bridging\BridgingFarmasiController@getRefDPHO');
                Route::get('referensi/ppk/{jenis}/{nama}', 'Bridging\BridgingFarmasiController@getFaskes');
                Route::get('referensi/spesialistik', 'Bridging\BridgingFarmasiController@getSpesialistik');
                Route::get('sep/{sep}', 'Bridging\BridgingFarmasiController@getKunjunganSEP');
                Route::get('pelayanan/obat/daftar/{sep}', 'Bridging\BridgingFarmasiController@getDatfarPelObat');
                Route::get('riwayatobat/{tglawal}/{tglakhir}/{nokartu}', 'Bridging\BridgingFarmasiController@getRiwayatPelObat');
                Route::get('referensi/settingppk/read/{kode}', 'Bridging\BridgingFarmasiController@refSettingApotik');
                Route::get('referensi/poli/{kodenama}', 'Bridging\BridgingFarmasiController@refPoli');

                /*
                    "Parameter 1 : jenis obat (format 1 : obat prb, 2 : obat kronis belum stabil, 3 : obat kemoterapi )
                    Parameter 2 : tanggal pelayanan (format yyyy-mm-dd)
                    Parameter 3 : nama obat/kode obat (minimal 3 digit)"
                */
                Route::get('referensi/obat/{jenis}/{tgl}/{namakode}', 'Bridging\BridgingFarmasiController@getCariObat');

                /*
                *
                "Parameter 1 : bulan (harus 2 digit)
                Parameter 2 : tahun (harus 4 digit)
                Parameter 3 : jenis obat (0 : semua, 1 : obat prb, 2: obat kronis belum stabil, 3 : obat kemo)
                Parameter 4 : status (0 : belum verifikasi, 1 : sudah verifikasi)"
                */

                Route::get('monitoring/klaim/{bln}/{tahun}/{jenisobat}/{status}', 'Bridging\BridgingFarmasiController@getMonitoringDataKlaim');

                Route::post('pelayanan/obat/hapus', 'Bridging\BridgingFarmasiController@hapusPelObat');
                Route::post('sjpresep/insert', 'Bridging\BridgingFarmasiController@simpanSEPResep');
                Route::post('obatnonracikan/insert', 'Bridging\BridgingFarmasiController@simpanObatNonRacikan');
                Route::post('obatracikan/insert', 'Bridging\BridgingFarmasiController@simpanObatRacikan');
                Route::post('hapusresep', 'Bridging\BridgingFarmasiController@hapusResep');
                Route::post('daftarresep', 'Bridging\BridgingFarmasiController@daftarResep');

                Route::post('save-consis-d', 'Bridging\BridgingFarmasiController@SimpanBridgingConsisD');
            });

            Route::group(['prefix' => 'sisrute'], function () {
                Route::get('referensi/faskes', 'Bridging\BridgingSisruteController@getFaskes');
                Route::get('referensi/faskes-paging', 'Bridging\BridgingSisruteController@getFaskesPaging');
                Route::get('referensi/alasanrujukan', 'Bridging\BridgingSisruteController@getAlasanRujukan');
                Route::get('referensi/diagnosa', 'Bridging\BridgingSisruteController@getDiagnosa');
                Route::get('referensi/diagnosa-paging', 'Bridging\BridgingSisruteController@getDiagnosaPaging');
                Route::get('rujukan/get', 'Bridging\BridgingSisruteController@getRujukan');
                Route::get('get-pasien-nocm', 'Bridging\BridgingSisruteController@getPasienByNoCMSisrute');
                Route::get('get-combo', 'Bridging\BridgingSisruteController@getComboSisrute');

                Route::post('rujukan/post', 'Bridging\BridgingSisruteController@postRujukan');
                Route::put('rujukan/put', 'Bridging\BridgingSisruteController@putRujukan');
                Route::put('rujukan/jawab', 'Bridging\BridgingSisruteController@jawabRujukan');
                Route::put('rujukan/batal', 'Bridging\BridgingSisruteController@batalRujukan');
                Route::put('rujukan/notif', 'Bridging\BridgingSisruteController@notifRujukan');

                // rsonline

                Route::get('get-pasien-masuk-covid', 'Bridging\BridgingSisruteController@getPasienMasukCovid');
                Route::get('referensi/tempat-tidur', 'Bridging\BridgingSisruteController@getRefTempatTidur');
                Route::get('data-tempat-tidur', 'Bridging\BridgingSisruteController@getDataTempatTidur');
                Route::get('data-pasien-komorbid', 'Bridging\BridgingSisruteController@getDataPasienKomorbid');
                Route::get('get-combo-sdm', 'Bridging\BridgingSisruteController@getComboSdm');
                Route::get('get-combo-data-sdm', 'Bridging\BridgingSisruteController@getDataSdm');
                Route::post('post-sdm', 'Bridging\BridgingSisruteController@postSdm');
                Route::post('put-sdm', 'Bridging\BridgingSisruteController@putSdm');
                Route::get('get-combo-alkes', 'Bridging\BridgingSisruteController@getComboAlkes');
                Route::get('get-combo-data-alkes', 'Bridging\BridgingSisruteController@getDataAlkes');
                Route::post('post-alkes', 'Bridging\BridgingSisruteController@postAlkes');
                Route::post('put-alkes', 'Bridging\BridgingSisruteController@putAlkes');
                Route::get('push-pasien-masuk', 'Bridging\BridgingSisruteController@pushPasienMasuk');
                Route::get('push-pasien-komorbid', 'Bridging\BridgingSisruteController@pushPasienKomorbid');
                Route::get('push-pasien-nonkomorbid', 'Bridging\BridgingSisruteController@pushPasienNonKomorbid');
                Route::get('push-pasien-keluar', 'Bridging\BridgingSisruteController@pushPasienPulang');
                Route::post('bridging/post-pasien', 'Bridging\BridgingSisruteController@postDataPasienCovid');
            });
            Route::group(['prefix' => 'penunjang'], function () {
                Route::post('save-bridging-zeta', 'Bridging\BridgingPenunjangController@saveBridgingZeta');
                Route::post('save-bridging-sysmex', 'Bridging\BridgingPenunjangController@saveBridgingSysmex');
                Route::post('save-bridging-vans-lab', 'Bridging\BridgingPenunjangController@saveBridgingVansLab');

                Route::get('get-hasil-vans-lab', 'Bridging\BridgingPenunjangController@getHasilLaborat');
            });
            Route::group(['prefix' => 'dukcapil'], function () {
                Route::get('get-identitas-by-nik/{nik}', 'Bridging\BridgingDukcapilController@getIdentitasByNIK');
                Route::get('get-nik/{nik}', 'Bridging\BridgingDukcapilController@getNIKwilayahProv');
                Route::get('get-nik-indo/{nik}', 'Bridging\BridgingDukcapilController@getNikNasional');
            });

            // ROUTE BRIDGING SATU SEHAT
            Route::group(['prefix' => 'ihs'], function () {
                Route::post('tools', 'Bridging\IHSController@ihsTools');
                Route::post('generate-token', 'Bridging\IHSController@generateToken');
                Route::post('Organization', 'Bridging\IHSController@Organization');
                Route::post('Location', 'Bridging\IHSController@Location');
                Route::post('Encounter', 'Bridging\IHSController@Encounter');
                Route::post('Condition', 'Bridging\IHSController@Condition');
                Route::post('Practitioner', 'Bridging\IHSController@Practitioner');
                Route::post('update-ihs-pasien', 'Bridging\IHSController@updateIHSPasien');
                Route::post('Medication', 'Bridging\IHSController@Medication');
                Route::post('MedicationRequest', 'Bridging\IHSController@MedicationRequest');
                Route::post('MedicationDispense', 'Bridging\IHSController@MedicationDispense');
                Route::post('MedicationDispenseObatBebas', 'Bridging\IHSController@MedicationDispenseObatBebas');
                Route::post('Observation', 'Bridging\IHSController@Observation');
                Route::post('ObservationRajal', 'Bridging\IHSController@ObservationRajal');
                Route::post('ObservationRanap', 'Bridging\IHSController@ObservationRanap');
                Route::post('Procedure', 'Bridging\IHSController@Procedure');
                Route::post('Immunization', 'Bridging\IHSController@Immunization');
                Route::post('Composition', 'Bridging\IHSController@Composition');
                Route::post('ServiceRequest', 'Bridging\IHSController@ServiceRequest');
                Route::post('Specimen', 'Bridging\IHSController@Specimen');
                Route::post('ObservationLab', 'Bridging\IHSController@ObservationLab');
                Route::post('ObservationRad', 'Bridging\IHSController@ObservationRad');
                Route::post('DiagnosticReport', 'Bridging\IHSController@DiagnosticReport');
                Route::post('ObservationLabDiagnos', 'Bridging\IHSController@ObservationLabDiagnos');
                Route::post('AllergyIntolerance', 'Bridging\IHSController@AllergyIntolerance');
                Route::post('ClinicalImpression', 'Bridging\IHSController@ClinicalImpression');
                Route::post('ObservationKesadaran', 'Bridging\IHSController@ObservationKesadaran');
                Route::post('ProcedureEdukasi', 'Bridging\IHSController@ProcedureEdukasi');
                Route::post('ConditionSaatMeninggalkanRS', 'Bridging\IHSController@ConditionSaatMeninggalkanRS');
                Route::get('get-pasien', 'Bridging\IHSController@getPasienByIHSId');

                Route::post('Encounter-tes', 'Bridging\IHSController@Encountertes');
                Route::get('get-list', 'Bridging\IHSController@getList');
                Route::get('Encounter-list', 'Bridging\IHSController@EncounterList');
            });
        });
        Route::group(['prefix' => 'CSSD'], function () {
            //****CSSD****
            Route::post('simpan-bundel', 'CSSD\transaksiController@SimpanBundel');
            Route::get('get-bundel', 'CSSD\transaksiController@getBundel');
            Route::post('disabled-bundel', 'CSSD\transaksiController@hapusBundel');
            Route::get('get-combo', 'CSSD\transaksiController@getCombo');
            Route::get('get-map_paket-to-produk', 'CSSD\transaksiController@getMapPaket');
            Route::get('get-map-paket', 'CSSD\transaksiController@getMapPaket');
            Route::get('get-paket', 'CSSD\transaksiController@getComboPaket');
            Route::get('get-produk-cssd', 'CSSD\transaksiController@getProdukCssd');
            Route::post('Unmapping', 'CSSD\transaksiController@unMapping');
            Route::post('mapping', 'CSSD\transaksiController@SimpanMapping');
            Route::get('get-Carasterilisasi', 'CSSD\transaksiController@getCarasterilisasi');
            Route::get('get-Prosessterilisasi', 'CSSD\transaksiController@getProsessterilisasi');
            Route::post('save-permintaan-cssd', 'CSSD\transaksiController@SimpanPermintaanSterilisasi');
            Route::get('cssd-sterilisasi/list-sterilisasi', 'CSSD\transaksiController@getPermintaanSterilisasiDetail');
            Route::get('get-Daftarpermintaansterilisasi', 'CSSD\transaksiController@getPermintaanSterilisasi');
            Route::get('bundlesetalat/get-bundle-set-alat', 'CSSD\BMHPController@getBundel');
            Route::post('mapping-bmhp-to-set-alat/save-all-mapping-bmhp-to-set-alat', 'CSSD\BMHPController@SaveAllMapping');
            Route::get('mapping-bmhp-to-set-alat/get-bundle-set-bmhp-by-id', 'CSSD\BMHPController@getById');
            Route::get('mapping-bmhp-to-set-alat/get-alat', 'CSSD\BMHPController@getAlat');
            Route::post('mapping-bmhp-to-set-alat/unMapping', 'CSSD\BMHPController@unMapping');
            Route::get('cssd-uji-swap/detail-uji-swap/', 'CSSD\UjiSWABController@getDetailUji');
            Route::post('cssd-uji-swap/save-uji-swap', 'CSSD\UjiSWABController@saveDetailUji');
            Route::get('cssd-decontaminasi/detail-decontaminasi/', 'CSSD\DecontaminasiController@getDetailDecontaminasi');
            Route::post('cssd-decontaminasi/save-decontaminasi/', 'CSSD\DecontaminasiController@SaveDecontaminasi');
            Route::get('cssd-monitoring-eo/detail-monitoring-eo', 'CSSD\DecontaminasiEOController@getDetailEO');
            Route::post('cssd-monitoring-eo/save-monitoring-eo', 'CSSD\DecontaminasiEOController@SaveDetailEO');
            Route::get('cssd-monitoring-steam/detail-monitoring-steam', 'CSSD\DecontaminasiSteamController@getDetailSteam');
            Route::post('cssd-monitoring-steam/save-monitoring-steam', 'CSSD\DecontaminasiSteamController@SaveDetailSteam');
            Route::get('cssd-sterilisasi/get-produk-cssd', 'CSSD\transaksiController@getProdukCssd');
            Route::get('get-permintaan-pernoorder', 'CSSD\transaksiController@getPengemasanDetail');
            Route::post('cssd-pengemasan/save-pengemasan', 'CSSD\transaksiController@SimpanPengemasan');
            Route::post('cssd-steril/save-steril', 'CSSD\transaksiController@SimpanSterilisasi');
            Route::post('cssd-steril/update-kondisi', 'CSSD\transaksiController@UpdateKondisi');
            Route::post('cssd-penyimpanan/save-penyimpanan', 'CSSD\transaksiController@SimpanPenyimpanan');
            Route::get('get-penyimpanan-permintaan-pernoorder', 'CSSD\transaksiController@getPenyimpananDetail');
            Route::post('cssd-distribusi/save-distribusi', 'CSSD\transaksiController@SimpanDistribusi');
            Route::get('cssd-sterilisasi/get-paket-by-jenis-paket', 'CSSD\transaksiController@getComboPaket');
            Route::get('cssd-sterilisasi/get-jenis-paket', 'CSSD\transaksiController@getCombo');
            Route::get('cssd-sterilisasi/get-map-paket-to-produk', 'CSSD\transaksiController@getMapPaket');
            Route::post('cssd-sterilisasi/save-all-map-paket-to-produk', 'CSSD\transaksiController@SimpanMapping');
            Route::post('cssd-sterilisasi/unmapping-paket-to-produk', 'CSSD\transaksiController@unMapping');
            //****END****	   
        });
        Route::group(['prefix' => 'eis'], function () {
            Route::get('get-count-pasien', 'EIS\EISController@countPasienRS');
            Route::get('get-count-pasien-terlayani', 'EIS\EISController@countPasienRSTerlayani');
            Route::get('get-tempattidur-terpakai', 'EIS\EISController@getTempatTidurTerpakai');
            Route::get('get-tempattidur-perkelas', 'EIS\EISController@getKetersediaanTempatTidurPerkelas');
            Route::get('get-tempattidur-perkelas-covid', 'EIS\EISController@getKetersediaanTempatTidurPerkelasCovid');
            Route::get('get-info-kunjungan-rawatjalan', 'EIS\EISController@getInfoKunjunganRawatJalanPerhari');
            Route::get('get-borlostoi', 'EIS\EISController@getBorLosToi');
            Route::get('get-borlostoi-polri', 'EIS\EISController@getBorLosToiPolri');
            Route::get('get-borlostoi-polri-tahun', 'EIS\EISController@getBorLosToiPolritahun');
            Route::get('get-trend-kunjungan-rawatjalan', 'EIS\EISController@getTrendKunjunganPasienRajal');
            Route::get('get-pasien-perjenis-penjadwalan', 'EIS\EISController@getPasienPerjenisPenjadwalan');
            Route::get('get-kunjungan-rs', 'EIS\EISController@getKunjunganRS');
            Route::get('get-kunjungan-perjenispasien', 'EIS\EISController@getKunjunganRSPerJenisPasien');
            Route::get('get-topten-asalperujuk-bpjs', 'EIS\EISController@getTopTenAsalPerujukBPJS');
            Route::get('get-topten-diagnosa', 'EIS\EISController@getTopTenDiagnosa');
            Route::get('get-kunjungan-jenis-pelayanan', 'EIS\EISController@getKunjunganPerJenisPelayanan');
            Route::get('get-kunjungan-rawatinap', 'EIS\EISController@getKunjunganRuanganRawatInap');
            Route::get('get-pendapatan-rs', 'EIS\EISController@getPendapatanRumahSakit');
            Route::get('get-penerimaan-rs', 'EIS\EISController@getPenerimaanKasir');
            Route::get('get-realisasitarget', 'EIS\EISController@getPenerimaanRealisasiTarget');
            Route::get('get-realisasitarget-farmasi', 'EIS\EISController@getRealisasiTargetFarmasi');
            Route::get('get-realisasitarget-usahalain', 'EIS\EISController@getUsahaLainnya');
            Route::get('get-realisasitarget-grid', 'EIS\EISController@getPenerimaanRealisasiTargetGrid');
            Route::get('get-count-pegawai', 'EIS\EISController@getCountPegawai');
            Route::get('get-detail-layanan', 'EIS\EISController@getLaporanLayanan');
            Route::get('get-info-stok', 'EIS\EISController@getInfoStok');
            Route::get('get-pemakaianobat', 'EIS\EISController@getTrendPemakaianObat');
            Route::get('detail-pasien-rj', 'EIS\EISController@detailPasienRJ');
            Route::get('get-regiter-summary', 'EIS\EISController@getRegisterSummary');
            Route::get('get-kunjungan-berdasarkan-param', 'EIS\EISController@getKunjunganBerdasarkanParameter');
            Route::get('get-laporan-obat', 'EIS\EISController@getLaporanPemakaianObat');
            Route::get('get-daftar-penerimaan', 'EIS\EISController@getDaftarPenerimaanSuplier');
            Route::get('get-daftar-distribusi-barang-perunit', 'EIS\EISController@getDaftarDistribusiBarangPerUnit');
            Route::get('get-combo-address', 'EIS\EISController@getComboAddressEIS');
            Route::get('get-propinsi', 'EIS\EISController@getPropinsi');
            Route::get('get-kecamatan', 'EIS\EISController@getKecamatan');
            Route::get('get-kota', 'EIS\EISController@getKota');
            Route::get('detail-pasien-teralayani/{idDept}', 'EIS\EISController@detailPasienTerlayani');
            Route::get('get-info-absen', 'EIS\EISController@getInfoAbsen');
            Route::get('get-kepatuhan-cuci-tangan', 'EIS\EISController@getKepatuhanCuciTangan');
            Route::get('get-detail-pendapatan', 'EIS\EISController@getDetailPendapatan');
            Route::get('get-trend-laundry', 'EIS\EISController@getTrendLaundry');
            Route::get('get-trend-sanitasi', 'EIS\EISController@getTrendBackOff');
            Route::get('get-trend-diklat', 'EIS\EISController@getTrendDiklat');
            Route::get('get-trend-gizi', 'EIS\EISController@getTrendGizi');
            Route::get('get-data-asset', 'EIS\EISController@getDataAsset');
            Route::get('get-kunjungan-perjenispasienrekanan', 'EIS\EISController@getLaporanKunjunganPolri');
            Route::get('get-kunjungan-perjenispasiengolongan', 'EIS\EISController@getLaporanGolonganPolri');
            Route::get('get-kunjungan-perjenispasiencsr', 'EIS\EISController@getLaporanCsrPolri');
            Route::get('get-kunjungan-satker', 'EIS\EISController@getLaporanSatker');
            Route::get('get-kunjungan-perjenispasiengolongancovid', 'EIS\EISController@getLaporanGolonganPolriCovid');
            Route::get('get-trend-kunjungan-covid', 'EIS\EISController@getTrendKunjunganPasienCovid');
            Route::get('get-trend-kunjungan-covid-pulang', 'EIS\EISController@getTrendKunjunganPasienCovidPulang');
            Route::get('get-trend-Perbulan', 'EIS\EISController@getTrendPerbulan');
            Route::get('get-data-realisasi', 'EIS\EISController@getDataRealisasi');
            Route::get('get-laporan-realisasi', 'EIS\EISController@getLaporanRealisasi');
            Route::get('get-eis-polri', 'EIS\EISController@getEisPolri');
            Route::get('detail-get-eis-polri', 'EIS\EISController@getEisPolriDetail');
        });
        Route::group(['prefix' => 'emr'], function () {

            Route::get('get-value-pengkajian-awal-medis-ri', 'EMR\EMRController@getValuePengkajianAwalMedisRI');
            Route::post('save-emr-new', 'EMR\EMRController@SaveTransaksiEMRNewVer');
            Route::post('update-final-emr', 'EMR\EMRController@updateFinalEMR');
            Route::get('get-emr-transaksi-detail-new', 'EMR\EMRController@getEMRTransaksiDetailNew');
            Route::get('get-indikasi-ranap', 'EMR\EMRController@getComboIndikasiRanap');
            Route::get('get-riwayat-order-penunjang-lab-rad', 'EMR\EMRController@getRiwayatOrderPenunjangLabRad');
            Route::get('get-combo-dokter-new', 'EMR\EMRController@getComboDokter');
            Route::get('get-riwayat-transfer-internal', 'EMR\EMRController@getRiwayatTransferInternal');
            Route::post('delete-riwayat-transfer-internal/{method}', 'EMR\EMRController@deleteRiwayatLaporanTransferInternal');

            //2023-11-01 By Toha
            Route::get('get-detail-dokter-cppt-new', 'EMR\EMRController@getDetailDokterCpptNew');
            Route::get('get-detail-perawat-cppt-new', 'EMR\EMRController@getDetailPerawatCpptNew');
            Route::get('get-total-pasien-cppt', 'EMR\EMRController@getTotalPasienCppt');
            Route::get('get-total-pasien-kunjungan', 'EMR\EMRController@getTotalPasienKunjungan');

            Route::get('get-ttd-ppa', 'EMR\EMRController@getTtdPpa');

            //2019-12 penambahan arif awal
            Route::get('get-radiologi-by-no-transaksi', 'EMR\EMRController@getRadiologiByNotransaksi');
            Route::get('get-lab-by-no-transaksi', 'EMR\EMRController@getLabByNotransaksi');
            Route::get('get-diagnosa-by-no-transaksi', 'EMR\EMRController@getDiagnosaByNotransaksi');
            Route::get('get-resume-medis-db-lama/{notransaksi}', 'EMR\EMRController@getResumeMedisDbLama');
            Route::get('get-menu-rekam-medis-dynamic-db-lama', 'EMR\EMRController@getMenuRekamMedisAtuhDbLama');
            //2019-12 penambahan arif akhir

            Route::post('save-data-rekam-medis', 'EMR\EMRController@saveRekamMedis');
            Route::get('get-data-rekam-medis', 'EMR\EMRController@getRekamMedis');
            Route::get('get-combo', 'EMR\EMRController@getComboRekMed');
            Route::get('get-combo-cppt', 'EMR\EMRController@getComboCppt');
            Route::get('get-diagnosa', 'EMR\EMRController@getDiagnosaPasien');
            Route::get('get-combolistaskep', 'EMR\EMRController@getComboListAskep');
            Route::get('get-dataaskep', 'EMR\EMRController@getDataAskep');
            Route::get('get-info-pasien', 'EMR\EMRController@getInfoPasien');
            Route::get('get-data-master-pap', 'EMR\EMRController@getMasterPAP');
            Route::get('get-master-diagnosa-kep', 'EMR\EMRController@getDiagnosaKeperawatan');
            Route::get('get-detail-diagnosa-kep-by-id/{id}', 'EMR\EMRController@getDetailDiagnosaKeperawatan');
            Route::get('get-data-rekam-medis-dp', 'EMR\EMRController@getHistoryDiagnosaKeperawatan');
            Route::get('get-histori-diagnosa-kep', 'EMR\EMRController@getHistoriDiagnosaKeperawatan');
            Route::get('get-rekammedis-dokter', 'EMR\EMRController@getRekamMedisDokter');
            Route::post('save-rekammedis-dokter', 'EMR\EMRController@saveRekamMedisDokter');
            Route::post('hapus-rekammedis-dokter', 'EMR\EMRController@hapusRekamMedisDokter');
            Route::post('post-anamnesis/{method}', 'EMR\EMRController@postAnamnesis');
            Route::get('get-anamnesis', 'EMR\EMRController@getAnamnesis');
            Route::post('post-riwayat/{method}', 'EMR\EMRController@postRiwayatPengobatan');
            Route::get('get-riwayat', 'EMR\EMRController@getRiwayatPengobatan');
            Route::post('post-pemeriksaanumum/{method}', 'EMR\EMRController@postPemeriksaanUmum');
            Route::get('get-pemeriksaanumum', 'EMR\EMRController@getPemeriksaanUmum');
            Route::post('post-edukasi/{method}', 'EMR\EMRController@postEdukasi');
            Route::get('get-edukasi', 'EMR\EMRController@getEdukasi');
            Route::post('post-rencana/{method}', 'EMR\EMRController@postRencana');
            Route::get('get-rencana', 'EMR\EMRController@getRencana');
            Route::post('post-perjanjian/{method}', 'EMR\EMRController@postPerjanjianPasien');
            Route::get('get-perjanjian', 'EMR\EMRController@getPasienPerjanjian');
            Route::post('post-cppt/{method}', 'EMR\EMRController@postCPPT');
            Route::get('get-cppt', 'EMR\EMRController@getCPPT');
            Route::get('get-apd/{norec}', 'EMR\EMRController@getAntrianPasienDiperiksa');
            Route::post('save-pengkajianpasien', 'EMR\EMRController@savePengkajianPasien');
            Route::get('get-pengkajianpasien', 'EMR\EMRController@getPengkajianPasien');
            Route::post('hapus-pengkajianpasien', 'EMR\EMRController@hapusPengkajianPasien');
            Route::post('post-diagnosa-kep/{method}', 'EMR\EMRController@postMasterDiagnosaKeperawatan');
            Route::post('post-resume-medis/{method}', 'EMR\EMRController@saveResumeMedis');
            Route::get('get-resume-medis/{nocm}', 'EMR\EMRController@getResumeMedis');
            Route::get('get-resume-medis-igd/{noregistrasi}', 'EMR\EMRController@getResumeMedisIGD'); //key add from polri 11-01-2024
            Route::get('get-pelayanan-from-temp-resume', 'EMR\EMRController@getPelayananFromTempResume'); //key add from polri 11-01-2024
            Route::post('post-resume-medis-inap/{method}', 'EMR\EMRController@postResumeMedisInap');
            Route::post('hapus-resume-medis-inap', 'EMR\EMRController@hapusResumeRI'); //key 08-01-2024
            Route::get('get-resume-medis-inap/{nocm}', 'EMR\EMRController@getResumeMedisInap');
            Route::get('get-resume-medis-inap-noregistrasi/{noregistrasi}', 'EMR\EMRController@getResumeMedisInapNoRegistrasi');
            Route::get('get-resume-medis-jalan-noregistrasi/{noregistrasi}', 'EMR\EMRController@getResumeMedisJalanNoRegistrasi');
            Route::get('get-resume-medis-igd-noregistrasi/{noregistrasi}', 'EMR\EMRController@getResumeMedisIGDNoRegistrasi');
            Route::post('post-konsultasi', 'EMR\EMRController@saveOrderKonsul');
            Route::get('get-order-konsul', 'EMR\EMRController@getOrderKonsul');
            Route::post('disabled-konsultasi', 'EMR\EMRController@disabledOrderKonsul');
            Route::post('save-konsul-from-order', 'EMR\EMRController@saveKonsulFromOrder');
            Route::get('get-data-pengkajian-medis-pasien', 'EMR\EMRController@getDataPasienPengkajianMedis');
            Route::get('get-rekam-medis-dynamic', 'EMR\EMRController@getRekamMedisAtuh');
            Route::get('get-rekam-medis-askep', 'EMR\EMRController@getRekamMedisAskep');

            Route::get('get-rekam-medis-dynamic-polri', 'EMR\EMRController@getRekamMedisAtuhPolri');
            Route::get('get-menu-rekam-medis-dynamic', 'EMR\EMRController@getMenuRekamMedisAtuh');
            Route::get('get-menu-rekam-medis-dynamic-nav', 'EMR\EMRController@getMenuRekamMedisAtuhNav');
            Route::get('get-menu-rekam-medis-dynamicv2', 'EMR\EMRController@getMenuRekamMedisAtuhv2');
            Route::get('get-menu-rekam-medis-dynamic-grid', 'EMR\EMRController@getMenuRekamMedisAtuhGrid');
            Route::post('save-emr-dinamis', 'EMR\EMRController@SaveTransaksiEMRBackup');
            Route::post('save-emr-igd', 'EMR\EMRController@saveemrigd');
            Route::get('get-temp-igd', 'EMR\EMRController@gettempigd');
            Route::get('get-data-konsul-rehab', 'EMR\EMRController@getDataKonsulRehab');
            Route::post('save-konsul-rehab', 'EMR\EMRController@saveKonsulRehab');
            Route::get('get-data-tanggal-konsul-rehab', 'EMR\EMRController@getDataTglKonsulRehab');
            Route::post('save-tanggal-konsul-rehab', 'EMR\EMRController@saveTglKonsulRehab');
            Route::post('ttd-pasien-konsul-rehab', 'EMR\EMRController@ttdPasienKonsulRehab');
            Route::get('get-history-new/{norec}', 'EMR\EMRController@getHistoryEmrNew');

            Route::post('delete-edukasi', 'EMR\EMRController@deleteEdukasi'); //ash 03-08-2023

            Route::get('get-image-from-jenis-surat-bedah', 'EMR\EMRController@getImageFromJenisSuratBedah'); //key 23-11-2023 ambil dari sumedang ash 2023-10-09

            Route::get('get-image-from-jenis-surat', 'EMR\EMRController@getImageFromJenisSurat');
            Route::get('get-combo-diagnosa-keperawatan', 'EMR\EMRController@getComboDiagnosaKeperawatan');
            Route::get('get-combo-diagnosa-keperawatan-new', 'EMR\EMRController@getComboDiagnosaKeperawatanNew');
            Route::get('get-combo-anyar-hehe', 'EMR\EMRController@getComboAnyarHehe');
            Route::get('get-rekonsiliasi-obat', 'EMR\EMRController@getRekonsiliasiObat');
            Route::post('delete-rekonsiliasi-obat/{method}', 'EMR\EMRController@deleteRekonsiliasiObat');
            Route::post('save-rekonsiliasi-obat', 'EMR\EMRController@saveRekonsiliasiObat');
            Route::get('get-vital-sign-2', 'EMR\EMRController@getVitalSign2');
            Route::get('get-combo-cppt-p', 'EMR\EMRController@getComboCpptP');
            Route::get('get-order-penunjang-lab', 'EMR\EMRController@getOrderPenunjangLab');
            Route::get('get-order-penunjang-rad', 'EMR\EMRController@getOrderPenunjangRad');
            Route::get('get-history-ews', 'EMR\EMRController@getHistoryEws');
            Route::get('get-resiko-jatuh/{nocm}', 'EMR\EMRController@getResikoJatuh');
            Route::get('get-risk-down', 'EMR\EMRController@getRiskDown');
            Route::get('get-risk-down-pengkajian', 'EMR\EMRController@getRiskDownPengkajian');
            Route::get('get-dpjp-for-spri', 'EMR\EMRController@getDpjpForSpri');
            Route::get('get-value-from-pengkajian-awal', 'EMR\EMRController@getValueFromPengkajianAwal');
            Route::get('get-value-from-pengkajian-awal-2', 'EMR\EMRController@getValueFromPengkajianAwal2');
            Route::get('get-value-from-pengkajian-awal-last', 'EMR\EMRController@getValueFromPengkajianAwalLast');
            Route::get('get-value-from-pengkajian-awal-3', 'EMR\EMRController@getValueFromPengkajianAwal3');
            Route::get('get-pengkajian-awal-medis-ranap', 'EMR\EMRController@getPengkajianAwalMedisRawatInap');
            Route::get('get-value-from-cppt', 'EMR\EMRController@getValueCppt');
            Route::get('get-value-from-cppt-dok', 'EMR\EMRController@getValueCpptDok'); //key
            Route::get('get-value-from-ass-igd', 'EMR\EMRController@getValueAssIGD'); //key
            Route::get('get-value-asesmen-rehab', 'EMR\EMRController@getValueAssRehab'); //key
            Route::get('get-value-triase', 'EMR\EMRController@getValueTriaseIGD'); //key
            Route::get('get-value-resume-medis', 'EMR\EMRController@getValueResumeMedis'); //key
            Route::get('get-value-pengkajian-medis-igd', 'EMR\EMRController@getValuePengkajianMedisIGD'); //key
            Route::get('get-diagnosa-from-pengkajian-awal', 'EMR\EMRController@getDiagnosaFromPengkajianAwal');
            Route::get('get-diagnosa-from-pengkajian-mata', 'EMR\EMRController@getDiagnosaFromPengkajianMata');
            Route::get('get-value-from-pengkajian-kep-mata', 'EMR\EMRController@getValueFromPengkajianKepMata');
            Route::get('get-bio-pasien-byCm', 'EMR\EMRController@getPasienByCm');
            Route::get('get-otomatis', 'EMR\EMRController@getApaAjaYangBisaOtomatisResumeRj');
            Route::get('get-lab-resume-rj', 'EMR\EMRController@getLabResumeRj');
            Route::get('get-lab-resume-rj-deleted', 'EMR\EMRController@getLabResumeRjDeleted');
            Route::get('get-rad-resume-rj', 'EMR\EMRController@getRadResumeRj');
            Route::post('save-resume-medis-rj', 'EMR\EMRController@saveResumeMedisRj');
            Route::get('get-resume-medis-rj/{noregistrasi}', 'EMR\EMRController@getResumeMedisRJ');
            Route::post('save-resume-medis-igd', 'EMR\EMRController@saveResumeMedisIgd'); // key add from polri 01-11-2024
            Route::get('get-penunjang-resume-ranap', 'EMR\EMRController@getDataPenunjangCetakanResumeRanap');
            Route::post('save-resume-medis-ri', 'EMR\EMRController@saveResumeMedisRanap');
            Route::get('get-reaksi-obat-resume-ranap', 'EMR\EMRController@getDataReaksiObatResumeMedis'); //key
            Route::get('get-combo-edukasi-pasien', 'EMR\EMRController@getComboEdukasiPasien');
            Route::get('get-edukasi-pasien', 'EMR\EMRController@getEdukasiPasien');
            Route::post('save-edukasi-pasien', 'EMR\EMRController@saveEdukasiPasien');
            Route::get('get-pengkajianpasienriall/{nocm}', 'EMR\EMRController@getPengkajianPasieniriall');
            Route::get('get-pengkajianpasienriallperawat/{nocm}', 'EMR\EMRController@getPengkajianPasieniriallperawat');
            Route::get('get-daftarpengkajianrawatinap', 'EMR\EMRController@getDaftarPengkajian');
            Route::get('get-pengkajianpasienrj/{nocm}/{emrfk}', 'EMR\EMRController@getPengkajianPasienirj');
            Route::post('save-ttv', 'EMR\EMRController@savettv');
            Route::get('get-ttv', 'EMR\EMRController@getttv');
            Route::post('save-emr-heml-anastesi', 'EMR\EMRController@SaveEmrHtmlAnestesi');

            //ash 03-08-2023 Farmasi Meso
            Route::get('get-combo-meso', 'EMR\EMRController@getComboMeso'); //ash 03-08-2023
            Route::get('get-meso-cek-ruangan', 'EMR\EMRController@getMesoCheckRuangan'); //ash 03-08-2023
            Route::get('get-obat-detail-pasien', 'EMR\EMRController@getObatDetailPasien');
            Route::post('save-obat-detail-pasien', 'EMR\EMRController@saveObatDetailPasien');
            Route::post('delete-obat-detail-pasien', 'EMR\EMRController@saveObatDetailPasien');
            Route::get('get-meso-pasien', 'EMR\EMRController@getMesoPasien');
            Route::post('save-meso-pasien', 'EMR\EMRController@saveMesoPasien');
            Route::post('update-meso-pasien', 'EMR\EMRController@updateMesoPasien');
            Route::post('delete-meso-pasien/{method}', 'EMR\EMRController@deleteMesoPasien');
            Route::get('get-edit-meso-pasien', 'EMR\EMRController@getEditMesoPasien');

            Route::post('save-obat-pasien', 'EMR\EMRController@saveObatPasien');
            Route::get('get-obat-pasien', 'EMR\EMRController@getObatPasien');
            Route::post('delete-obat-pasien/{method}', 'EMR\EMRController@deleteObatPasien');

            //rekonsiliasi       
            Route::get('get-rekonsiliasi-pasien', 'EMR\EMRController@getRekonsiliasiPasien');
            Route::get('get-rekonsiliasi-obat-pasien', 'EMR\EMRController@getRekonsiliasiObatPasien');
            Route::get('get-rekonsiliasi-obat-mandiri-pasien', 'EMR\EMRController@getRekonsiliasiObatMandiri');
            Route::get('get-combo-rekonsiliasi', 'EMR\EMRController@getComboRekonsiliasi'); //ash 03-08-2023
            Route::post('save-rekonsiliasi-pasien', 'EMR\EMRController@saveRekonsiliasiPasien');
            Route::get('get-edit-rekonsiliasi-pasien', 'EMR\EMRController@getEditRekonsiliasiPasien');
            Route::post('save-rekonsiliasi-obat-pasien', 'EMR\EMRController@saveRekonsiliasiObatPasien');
            Route::post('save-rekonsiliasi-obat-mandiri-pasien', 'EMR\EMRController@saveRekonsiliasiObatMandiri');
            Route::post('delete-rekonsiliasi-pasien/{method}', 'EMR\EMRController@deleteRekonsiliasiPasien');
            Route::post('delete-rekonsiliasi-detail-pasien/{method}', 'EMR\EMRController@deleteRekonsiliasiObatPasien');
            Route::post('delete-rekonsiliasi-detail-mandiri-pasien/{method}', 'EMR\EMRController@deleteRekonsiliasiObatMandiri');
            Route::post('update-rekonsiliasi-pasien', 'EMR\EMRController@updateRekonsiliasiPasien');

            //ash 21-08-2023 Asupan Gizi
            Route::get('get-combo-asupan-gizi', 'EMR\EMRController@getComboMeso'); //ash 21-08-2023
            Route::get('get-gizi-pasien', 'EMR\EMRController@getGiziPasien');
            Route::get('get-hiji-gizi-pasien', 'EMR\EMRController@getHijiGiziPasien'); //key 02-11-2023
            Route::post('save-gizi-pasien', 'EMR\EMRController@saveGiziPasien');
            Route::post('update-gizi-pasien', 'EMR\EMRController@updateGiziPasien'); //key 02-11-2023
            Route::post('delete-gizi-pasien/{method}', 'EMR\EMRController@deleteGiziPasien'); //key 02-11-2023
            Route::get('get-combo-gizi', 'EMR\EMRController@getComboGizi');
            Route::post('save-gizi-detail-pasien', 'EMR\EMRController@saveGiziDetailPasien'); //key 28-12-2023
            Route::get('get-gizi-detail-pasien', 'EMR\EMRController@getGiziDetailPasien'); //key 28-12-2023

            //            Route::post('save-emr-dinamis', 'EMR\EMRController@SaveTransaksiEMR');
            Route::get('get-id-pegawai', 'EMR\EMRController@ambilIdPegawai');
            Route::get('get-emr-transaksi', 'EMR\EMRController@getEMRTransaksiRiwayat');
            Route::post('delete-emr-transaksi', 'EMR\EMRController@deleteEws');
            Route::get('get-emr-transaksi-check', 'EMR\EMRController@getEMRTransaksiRiwayatCheck');
            Route::get('get-emr-transaksi-detail', 'EMR\EMRController@getEMRTransaksiDetail');
            Route::get('get-emr-transaksi-detailaskep', 'EMR\EMRController@getEMRTransaksiDetailaskep');
            Route::get('get-emr-transaksi-detail-polri', 'EMR\EMRController@getEMRTransaksiDetailPolri');
            Route::get('get-emr-transaksi-detail-polri-umum', 'EMR\EMRController@getEMRTransaksiDetailPolriUmum');
            Route::get('get-datacombo-part-pegawai', 'EMR\EMRController@getDataComboPegawaiPart');
            Route::get('get-datacombo-part-ruangan', 'EMR\EMRController@getDataComboRuanganPart');
            Route::get('get-datacombo-part-diagnosa', 'EMR\EMRController@getDataComboDiagnosaPart');
            Route::get('get-datacombo-part-tindakan', 'EMR\EMRController@getDataComboTindakanPart');
            Route::get('get-datacombo-part-dokter', 'EMR\EMRController@getDataComboDokterPart');
            Route::get('get-datacombo-part-ruangan-pelayanan', 'EMR\EMRController@getDataComboRuanganPelayananPart');
            Route::get('get-datacombo-part-jk', 'EMR\EMRController@getDataComboJKPart');
            Route::get('get-datacombo-part-jenisdiagnosa', 'EMR\EMRController@getComboJensiDiagnosaPart');
            Route::get('get-datacombo-part-diagnosa-tindakan', 'EMR\EMRController@getDataComboDiagnosa9Part');
            Route::get('get-data-diagnosis', 'EMR\EMRController@getDataDiagnosis');
            Route::post('save-data-odontogram', 'EMR\EMRController@SaveTransaksiEMROdontogram');
            Route::get('get-data-odontogram', 'EMR\EMRController@getDataOdontogram');
            Route::post('hapus-emr-transaksi', 'EMR\EMRController@hapusEMRTransaksi');
            Route::get('get-daftar-dokumen-rekmed', 'EMR\EMRController@getDaftarDokumenRekamMedis');
            Route::get('get-combo-dokumen-rekmed', 'EMR\EMRController@getComboDokRekMed');
            Route::post('save-dokumen-rekmed', 'EMR\EMRController@saveDokumenRekamMedis');
            Route::get('get-histori-dokumen-rekmed/{nocm}', 'EMR\EMRController@getHistoriDokumenRekmed');
            Route::get('get-ruangan-part', 'EMR\EMRController@getRuanganPart');
            Route::get('get-daftar-dokumen-rekmed-ruangan', 'EMR\EMRController@getDaftarDokumenRekamMedisRuangan');
            Route::post('save-dokumen-rekmed-ruangan', 'EMR\EMRController@saveDokumenRekamMedisRuangan');
            Route::get('get-data-keterangan-pengkajianicu', 'EMR\EMRController@getDataPengakajianICU');
            Route::get('get-data-combo-emr', 'EMR\EMRController@getDataComboERM');
            Route::post('save-data-emr-icu', 'EMR\EMRController@SaveTransaksiEMRICU');
            Route::post('save-data-emr-intra-anestesi', 'EMR\EMRController@SaveEMRIntraAnestesi');
            Route::get('get-data-riwayat-emr-icu', 'EMR\EMRController@getDataRiwayatERMICU');
            Route::get('get-data-detail-emr-icu', 'EMR\EMRController@getDataDetailEMRICU');
            Route::get('get-data-riwayat-emr-icu-detail', 'EMR\EMRController@getDataRiwayatERMICUDetail');
            Route::get('get-data-pasien/{nocm}', 'EMR\EMRController@getDataPasien');
            Route::get('get-datacombo-part-asalrujukan', 'EMR\EMRController@getDataComboAsalRujukan');
            Route::get('get-datacombo-part-kelompokpasien', 'EMR\EMRController@getDataComboKelompokpPasien');
            Route::post('save-data-emr-pemeriksaanfisik-igd', 'EMR\EMRController@saveRekamMedisPemeriksaanFisik');
            Route::get('get-data-riwayat-emr-pemeriksaan-fisik', 'EMR\EMRController@getDataRiwayatERMPemeriksaanFisik');
            Route::get('get-data-pasien-new', 'EMR\EMRController@getDataPasien');
            Route::get('get-intervensi', 'EMR\EMRController@getDiagnisaKepIntervensi');
            Route::get('get-evaluasi', 'EMR\EMRController@getDiagnisaKepEvaluasi');
            Route::get('get-implementasi', 'EMR\EMRController@getDiagnisaKepImplemen');
            Route::post('post-{table}-diagnosakeperawatan/{method}', 'EMR\EMRController@postDetailDiagnoaKep');
            Route::get('get-data-riwayat-emr', 'EMR\EMRController@getDataRiwayatEMR');
            Route::post('update-data-emrpasien', 'EMR\EMRController@updateNoCmInEmrPasien');
            Route::post('update-data-emrpasien-pd', 'EMR\EMRController@updatePdInEmrPasien');
            Route::get('get-data-riwayat-pengkajiankeperawatan', 'EMR\EMRController@getDataPasienPengkajianKeperawatan');
            Route::get('get-datacombo-part-agama', 'EMR\EMRController@getDataComboAgama');
            Route::get('get-datacombo-metode', 'EMR\EMRController@getDataMetodebelajar');
            Route::get('get-datacombo-diagnosa-jiwa', 'EMR\EMRController@getDataDiagnosaJiwa');
            Route::get('get-datacombo-pendidikan', 'EMR\EMRController@getDataPendidikan');
            Route::get('get-datacombo-perkawinan', 'EMR\EMRController@getDataPerkawinan');
            Route::get('get-datacombo-pekerjaan', 'EMR\EMRController@getDataPekerjaan');
            Route::get('get-emrbyid', 'EMR\EMRController@getMenuEmrById');
            Route::get('get-emr-transaksi-detailekg', 'EMR\EMRController@getEMRTransaksiDetailEkg');
            Route::post('save-emr-dinamis-new', 'EMR\EMRController@SaveTransaksiEMRnew');
            Route::post('update-noemr', 'EMR\EMRController@updatenoemricu');
            Route::get('get-datacombo-part-skala', 'EMR\EMRController@getSkala');
            Route::post('save-emr-dinamis-igd', 'EMR\EMRController@SaveTransaksiEMRIGD');
            Route::get('get-datacombo-part-dokter-perawat', 'EMR\EMRController@getDataComboDokterPerawatPart');
            Route::get('get-datacombo-part-dokter-perawathd', 'EMR\EMRController@getDataComboDokterPerawatPartHD');

            // key 12-12-2023
            Route::post('delete-icu', 'EMR\EMRController@deleteICU');

            // key
            Route::get('get-data-riwayat-emr-icu-detail-obat', 'EMR\EMRController@getDataRiwayatERMICUDetailObat');

            //2019-12 penambahan arif awal
            Route::get('get-antrian-pasien-norec-db-lama/{notransaksi}', 'EMR\EMRController@getAntrianPasienDiperiksaDbLama');
            //2019-12 penambahan arif akhir

            Route::get('get-antrian-pasien-norec/{norec}', 'EMR\EMRController@getAntrianPasienDiperiksa');
            Route::get('get-antrian-pasien-norec-grid/{norec}', 'EMR\EMRController@getAntrianPasienDiperiksaGrid');
            Route::get('get-antrian-pasien-norec-gridnew/{norec}', 'EMR\EMRController@getAntrianPasienDiperiksaGridNew'); //ash
            Route::get('get-antrian-pasien-norec-griddetail/{norec}', 'EMR\EMRController@getAntrianPasienDiperiksaGridDetail'); //ash
            Route::post('post-anamnesis/{method}', 'EMR\EMRController@postAnamnesis');
            Route::get('get-anamnesis', 'EMR\EMRController@getAnamnesis');
            Route::post('post-riwayat/{method}', 'EMR\EMRController@postRiwayatPengobatan');
            Route::get('get-riwayat', 'EMR\EMRController@getRiwayatPengobatan');
            Route::get('get-emr-transaksi-detail-partograf-wirasakti', 'EMR\EMRController@getEMRTransaksiDetailPartograf');
            Route::post('post-pemeriksaanumum/{method}', 'EMR\EMRController@postPemeriksaanUmum');
            Route::get('get-pemeriksaanumum', 'EMR\EMRController@getPemeriksaanUmum');
            Route::post('post-edukasi/{method}', 'EMR\EMRController@postEdukasi');
            Route::get('get-edukasi', 'EMR\EMRController@getEdukasi');
            Route::post('post-rencana/{method}', 'EMR\EMRController@postRencana');
            Route::get('get-rencana', 'EMR\EMRController@getRencana');
            Route::post('post-perjanjian/{method}', 'EMR\EMRController@postPerjanjianPasien');
            Route::get('get-perjanjian', 'EMR\EMRController@getPasienPerjanjian');
            Route::post('post-cppt/{method}', 'EMR\EMRController@postCPPT');
            Route::get('get-cppt', 'EMR\EMRController@getCPPT');

            Route::get('get-data-riwayat-pengkajiankeperawatan', 'EMR\EMRController@getDataPasienPengkajianKeperawatan');
            Route::get('daftar-riwayat-registrasi', 'EMR\EMRController@getDaftarRiwayatRegistrasi');
            Route::get('get-pasien', 'EMR\EMRController@getDaftarPasien');
            // Route::post('save-order-pelayanan', 'EMR\EMRController@saveOrderPelayanan');
            Route::get('get-combo-icd9', 'EMR\EMRController@getIcd9');
            Route::get('get-combo-icd10', 'EMR\EMRController@getDiagnosaIcd10Part');
            Route::get('get-combo-icd10-new', 'EMR\EMRController@getDiagnosaIcd10PartNew');
            Route::get('get-combo-icd9-idrg', 'EMR\EMRController@getIcd9IDRG');
            Route::get('get-combo-icd10-idrg', 'EMR\EMRController@getDiagnosaIcd10PartIdrg');
            Route::get('get-icd10', 'EMR\EMRController@getDiagnosaIcd10');
            Route::get('get-combo-diagnosis', 'EMR\EMRController@getComboDiagnosis');
            Route::get('get-diagnosapasienbynoregicd9', 'EMR\EMRController@getDiagnosaPasienByNoregICD9');
            Route::get('get-diagnosapasienbynoregicd9-rm', 'EMR\EMRController@getDiagnosaPasienByNoregICD9RM');
            Route::get('get-obat-resep-akhir', 'EMR\EMRController@getObatResepAkhir');
            Route::get('get-obat-obat', 'EMR\EMRController@getObatObat');
            Route::get('get-diagnosapasienbynoreg', 'EMR\EMRController@getDiagnosaPasienByNoreg');
            Route::get('get-diagnosapasienbynoreg-rm', 'EMR\EMRController@getDiagnosaPasienByNoregRM');
            Route::post('save-diagnosa-tindakan-pasien', 'EMR\EMRController@saveDiagnosaTindakanPasien');
            Route::post('save-diagnosa-tindakan-pasien-rm', 'EMR\EMRController@saveDiagnosaTindakanPasienRM');
            Route::post('delete-diagnosa-tindakan-pasien', 'EMR\EMRController@deleteDiagnosaTindakanPasien');
            Route::post('save-diagnosa-pasien', 'EMR\EMRController@saveDiagnosaPasien');
            Route::post('save-diagnosa-pasien-rm', 'EMR\EMRController@saveDiagnosaPasienRM');
            Route::post('delete-diagnosa-pasien', 'EMR\EMRController@deleteDiagnosaPasien');

            Route::get('get-combo-resep-emr', 'EMR\EMRController@getDataComboResepEMR');
            Route::get('get-combo-resep-emr-2', 'EMR\EMRController@getDataComboResepEMR2');
            Route::get('get-vital-sign-igd', 'EMR\EMRController@getVitalSignIgd');
            Route::get('get-daftar-detail-order', 'EMR\EMRController@getDaftarDetailOrder');
            Route::get('get-info-stok', 'EMR\EMRController@getInformasiStok');
            Route::get('get-produkdetail', 'Farmasi\PelayananResepController@getProdukDetail');
            Route::get('get-jenis-obat', 'EMR\EMRController@getJenisObat');
            Route::post('simpan-order-pelayananobatfarmasi', 'EMR\EMRController@SimpanOrderPelayananObat');

            // resep master
            Route::post('simpan-resep-master', 'EMR\EMRController@simpanResepMaster');
            Route::post('save-resep-master-detail', 'EMR\EMRController@simpanDetailToMasterResep');
            Route::post('ubah-resep-master-detail', 'EMR\EMRController@ubahDetailMasterResep');
            Route::post('hapus-resep-master', 'EMR\EMRController@hapusResepMaster');
            Route::post('hapus-resep-master-detail', 'EMR\EMRController@hapusResepMasterDetail');


            Route::post('ubah-nama-resep-master', 'EMR\EMRController@ubahNamaResepMaster');


            Route::get('get-detail-resep-master', 'EMR\EMRController@getDetailResepMaster');
            // Route::get('get-detail-resep-master-fromfk', 'EMR\EMRController@getDetailResepMaster');


            Route::get('get-transaksi-pelayanan', 'Farmasi\PelayananResepController@getTransaksiPelayananApotik');
            Route::get('get-combo-penunjang', 'EMR\EMRController@getComboPenunjangOrder');
            Route::get('get-riwayat-order-penunjang', 'EMR\EMRController@getRiwayatOrderPenunjang');
            Route::post('save-order-pelayanan', 'EMR\EMRController@saveOrderPelayananLabRad');
            Route::post('jagain-order-pelayanan', 'EMR\EMRController@jagainOrderPelayananLabRad');
            Route::post('delete-order-pelayanan', 'EMR\EMRController@hapusOrderPelayananLabRad');
            Route::get('get-riwayat-order-radiologi', 'EMR\EMRController@getRiwayatOrderRad');
            Route::get('get-riwayat-order-elektro', 'EMR\EMRController@getRiwayatOrderElektro');

            Route::get('get-data-combo-surveilans', 'EMR\EMRController@getComboSurveilans');
            Route::get('get-data-history-surveilans', 'EMR\EMRController@getHistorySurveilans');
            Route::get('get-detail-history-surveilans', 'EMR\EMRController@getHistoryDetailSurveilans');
            Route::post('save-data-surveilans', 'EMR\EMRController@saveDataSurveilans');
            Route::post('hapus-data-surveilans', 'EMR\EMRController@hapusDataSurveilans');

            Route::get('get-data-ecg-epic', 'EMR\EMRController@getDataECG');
            Route::post('save-data-ecg', 'EMR\EMRController@SaveTransaksiECG');
            Route::get('get-daftar-ecg-epic', 'EMR\EMRController@getDaftarECG');
            Route::get('get-order-ok', 'EMR\EMRController@getOrderOK');

            Route::get('get-pegawai-parts', 'EMR\EMRController@getPegawaiParts');
            Route::post('hapus-order-pelayananobatfarmasi', 'EMR\EMRController@hapusOrderResep');

            Route::get('get-data-kepatuhan-apd-bulanan', 'EMR\EMRController@getDataKepatuhanAPDBulanan');
            Route::get('get-data-kepatuhan-apd-bulanan-tahun', 'EMR\EMRController@getDataKepatuhanAPDBulananTahun');
            Route::get('get-data-kepatuhan-apd-indikasi', 'EMR\EMRController@getDataKepatuhanAPDIndikasi');
            Route::get('get-data-kepatuhan-handhygiene-bulanan', 'EMR\EMRController@getDataKepatuhanHandHygieneBulanan');
            Route::get('get-data-kepatuhan-handhygiene-bulanan-tahun', 'EMR\EMRController@getDataKepatuhanHandHygieneBulananTahun');
            Route::get('get-data-kepatuhan-handhygiene-indikasi', 'EMR\EMRController@getDataKepatuhanHandHygieneIndikasi');

            Route::get('get-daftar-obat-sering-diresepkan', 'EMR\EMRController@getObatSeringDiresepkanDokter');
            Route::get('get-datacombo-part-kelompokpasien', 'EMR\EMRController@getDataComboKelompokPaisnePart');
            Route::get('get-datacombo-part-kelas', 'EMR\EMRController@getDataComboKelasPart');

            Route::post('save-data-delegasi-obat', 'EMR\EMRController@SimpanDelegasiPemberiObat');
            Route::get('get-daftar-delegasi', 'EMR\EMRController@getDaftarDelegasiObat');
            Route::get('get-delegasi-obat', 'EMR\EMRController@getDelegasiObat');
            Route::get('get-data-kepatuhan-cuci-tangan', 'EMR\EMRController@getDataKepatuhanCuciTangan');
            Route::post('hapus-delegasi-obat', 'EMR\EMRController@hapusDelegasiObat');
            Route::get('get-rekap-delegasi-obat', 'EMR\EMRController@getRekapDelegasiObat');

            Route::get('get-emr-transaksi-detail-form', 'EMR\EMRController@getEMRTransaksiDetailForm');
            Route::post('hapus-emr-transaksi-norec', 'EMR\EMRController@hapusEMRtransaksiNorec');
            Route::post('save-verif-cppt-dokter', 'EMR\EMRController@saveVerifCPPTEmr');
            Route::post('save-kepatuhancuci', 'EMR\EMRController@saveDataKepatuhanCuci');
            Route::get('get-data-kepatuhan-cuci-tanganload', 'EMR\EMRController@getDataKepatuhanCuciTanganload');
            Route::post('batal-kepatuhan-cuci-tangan', 'EMR\EMRController@saveBatalKepatuhanCuciTangan');
            Route::post('save-kepatuhanhandhygiene', 'EMR\EMRController@saveDataKepatuhanHandHygiene');
            Route::post('save-kepatuhanhandhygiene-array', 'EMR\EMRController@saveDataKepatuhanHandHygieneArray');
            Route::post('save-kepatuhanapd-array', 'EMR\EMRController@saveDataKepatuhanAPDArray');
            Route::post('batal-kepatuhan-apd', 'EMR\EMRController@saveBatalKepatuhanAPD');
            Route::get('get-data-kepatuhan-apd', 'EMR\EMRController@getDataKepatuhanAPD');
            Route::get('get-data-kepatuhan-handhygiene', 'EMR\EMRController@getDataKepatuhanHandHygiene');
            Route::get('get-data-kepatuhan-handhygiene-pegawai', 'EMR\EMRController@getDataKepatuhanHandHygienePegawai');
            Route::get('get-data-kepatuhan-apd-pegawai', 'EMR\EMRController@getDataKepatuhanAPDPegawai');
            Route::get('get-data-kepatuhan-handhygiene-perruangan', 'EMR\EMRController@getDataKepatuhanHandHygienePerRuangan');
            Route::post('batal-kepatuhan-handhygiene', 'EMR\EMRController@saveBatalKepatuhanHandHygiene');
            Route::get('get-nilai-statis-igd', 'EMR\EMRController@getNilaiStatisIGD');
            Route::post('disable-emr-details', 'EMR\EMRController@disableEMRdetail');
            Route::get('get-data-dg-primary/{Noregistrasi}', 'EMR\EMRController@getDataDiagnosaPrimary');
            Route::post('update-jawaban-konsultasi', 'EMR\EMRController@jawabKonsul');
            Route::get('get-data-kepatuhan-handhygiene-ipcn', 'EMR\EMRController@getDataKepatuhanHandHygieneIPCN');
            Route::get('get-vital-sign', 'EMR\EMRController@getVitalSign');
            Route::get('get-info-emr-pasien', 'EMR\EMRController@getInfoEMRPasien');
            Route::post('save-keterangan-delegasi-obat-detail', 'EMR\EMRController@SaveKeteranganDelegasiObatDetail');
            Route::post('save-perawat-delegasi-obat-detail', 'EMR\EMRController@SavePerawatDelegasiObatDetail');
            Route::post('save-perawat-delegasi-obat', 'EMR\EMRController@SavePerawatDelegasiObat');
            Route::post('save-hasil-radiologi-dokter', 'EMR\EMRController@saveHasilRadiologiDokter');
            Route::get('get-pasien-telemedicine', 'EMR\EMRController@getPasienTelemedicine');
            Route::post('tolak-order-konsultasi', 'EMR\EMRController@tolakOrderKonsul');
            Route::get('get-temp-emr', 'EMR\EMRController@getTempEmr');
            Route::post('save-catatan-keperawatan', 'EMR\EMRController@SaveCatatanKeperawatan');
            Route::post('save-catatan-dokter', 'EMR\EMRController@SaveCatatanDokter');
            Route::post('save-rencana-askep', 'EMR\EMRController@SaveRencana');
            Route::get('get-emr-transaksi-detail-polri-2', 'EMR\EMRController@getEMRTransaksiDetailPolri2');
            Route::post('save-tatalaksana', 'EMR\EMRController@savetatalaksana');
            Route::post('save-masalah', 'EMR\EMRController@savemasalah');
            Route::post('save-soap', 'EMR\EMRController@savesoap');
            Route::post('delete-tatalaksana', 'EMR\EMRController@deletetatalaksana');
            Route::get('get-laksana', 'EMR\EMRController@gettatalaksana');
            Route::get('get-masalah', 'EMR\EMRController@getmasalah');
            Route::get('get-soapicu', 'EMR\EMRController@getsoapicu');

            Route::get('get-masalahhead', 'EMR\EMRController@getmasalahhead');
            Route::get('get-soapkelompok', 'EMR\EMRController@getsoapkelompok');
            Route::get('get-masalah2', 'EMR\EMRController@getmasalah2');
            Route::get('get-apd', 'EMR\EMRController@getAPD');
            Route::get('get-rmi', 'EMR\EMRController@getRMI');
            Route::post('save-data-emr-pasca-anestesi', 'EMR\EMRController@SaveEMRPascaAnestesi');
            Route::get('get-history-intra-anestesi', 'EMR\EMRController@getHistoryIntraAnestesi');
            Route::get('get-history-pasca-anestesi', 'EMR\EMRController@getHistoryPascaAnestesi');
            Route::get('get-history-cppt', 'EMR\EMRController@getHistoryCPPT');
            Route::get('get-history-rencana', 'EMR\EMRController@getHistoryRencana');

            Route::get('get-cppt-edit', 'EMR\EMRController@getCPPTEdit');
            Route::get('get-rencana-edit', 'EMR\EMRController@getrenacanaedit');
            Route::post('edit-rencana-askep', 'EMR\EMRController@EditRencanaAskep');
            Route::post('edit-catatan-dokter', 'EMR\EMRController@EditCatatanDokter');
            Route::get('get-history-cpt', 'EMR\EMRController@getHistoryCPT');
            Route::get('get-cpt-edit', 'EMR\EMRController@getCPPTEdit');
            Route::post('edit-catatan-keperawatan', 'EMR\EMRController@EditCatatanKeperawatan');
            Route::get('get-status-verif', 'EMR\EMRController@cekStatusVerif');
            Route::post('save-verifikasi-dokter-cppt', 'EMR\EMRController@saveVerifikasiDokterCppt');
            Route::get('get-temp-emricu', 'EMR\EMRController@getTempEmricu');
            Route::post('save-unverifikasi-dokter-cppt', 'EMR\EMRController@saveUnverifikasiDokterCppt');
            Route::post('save-head-emr', 'EMR\EMRController@saveHeadEmr');
            Route::post('save-soap-rj', 'EMR\EMRController@saveSoapRj');
            Route::get('get-temp-soap', 'EMR\EMRController@getSoapRj');
            Route::get('get-hasil-lab', 'EMR\EMRController@getHasillab');
            Route::get('get-combo-diagnosa-pengkajian', 'EMR\EMRController@getComboDiagnosaPengkajian');
            Route::get('get-vital-sign-pengkajian', 'EMR\EMRController@getVitalSignForPengkajian');
            Route::get('get-vital-sign-pengkajian-new', 'EMR\EMRController@getVitalSignForPengkajianNewVer');
            Route::get('get-norecIGD', 'EMR\EMRController@getnorecIGD');
            Route::get('get-norecLast', 'EMR\EMRController@getnorecruanganlast');
            Route::get('get-combo-ruangan/{noregistrasi}', 'EMR\EMRController@getcomboruangan');
            Route::post('update-ruangan', 'EMR\EMRController@updateRuangan');

            Route::post('save-terapi-cairan', 'EMR\EMRController@saveTerapiCairan'); //ash  
            Route::get('get-terapi-cairan', 'EMR\EMRController@getTerapiCairan'); //ash
            Route::post('delete-terapi-cairan', 'EMR\EMRController@deleteTerapi'); //ash
            Route::get('get-riwayat-pemberian-cairan', 'EMR\EMRController@getRiwayatPemantauanCairan');
            Route::get('get-riwayat-monitoring-tranfusi-darah', 'EMR\EMRController@getRiwayatMonitoringTranfusiDarah');
            Route::post('save-update-golongandarah-pasien', 'EMR\EMRController@updateGolonganDarahPasien');
            Route::post('hapus-monitoring-tranfusi-darah', 'EMR\EMRController@hapusMonitoringTranfusiDarah');
            Route::post('save-verifikasi-monitoring-tranfusi-darah', 'EMR\EMRController@saveVerifikasiMonitoringTranfusiDarah');
            Route::post('save-unverifikasi-monitoring-tranfusi-darah', 'EMR\EMRController@saveUnVerifikasiMonitoringTranfusiDarah');

            Route::get('get-verifikasi-cppt', 'EMR\EMRController@getVerifikasiCppt');
            Route::post('update-verifikasi-cppt', 'EMR\EMRController@updateVerifikasiCppt');
            Route::post('delete-order-bedah', 'EMR\EMRController@deleteOrderBedah');
            Route::post('update-is-cppt', 'EMR\EMRController@updateIsCppt');
            Route::get('get-order-penunjang-to-cppt', 'EMR\EMRController@getOrderPenunjangToCppt');



            //ash -- 2023-09-01
            Route::get('get-riwayat-laporan-operasi', 'EMR\EMRController@getRiwayatLaporanOperasi');
            Route::post('delete-riwayat-laporan-operasi/{method}', 'EMR\EMRController@deleteRiwayatLaporanOperasi');
            Route::get('get-image-anestesi', 'EMR\EMRController@getImageAnestesi');
            Route::get('get-image-bedah', 'EMR\EMRController@getImageBedah');
            Route::get('get-image-mata', 'EMR\EMRController@getImageMata');
            Route::get('get-image-medis-igd', 'EMR\EMRController@getImageMedisIgd');
            Route::get('get-dokumen-upload', 'EMR\EMRController@getDokumenUpload');
            Route::post('hapus-dokumen-upload', 'EMR\EMRController@deleteDokumen');
            Route::get('get-riwayat-anestesi', 'EMR\EMRController@getRiwayatAnestesi');

            Route::get('get-kepentingan-resume-rj', 'EMR\EMRController@getKepentinganResumeRj');

            Route::get('get-combo-cppt', 'EMR\EMRController@getComboCppt');

            //Route::get('get-dokumen-emr-manual', 'EMR\EMRController@getDokumenEmrManual');
            Route::get('get-dokumen-emr-manual', 'EMR\EMRController@getDataListDokumen');
            Route::post('ubah-tanggal-dokumen', 'EMR\EMRController@ubahTanggalDokumen');
            Route::post('hapus-cpt', 'EMR\EMRController@HapusCpt'); //key 25-11-2023

            Route::get('get-dokumen-rekam-medis', 'EMR\EMRController@getDokumenRekamMedis');

            Route::get('get-riwayat-order-penunjang-rad', 'EMR\EMRController@getRiwayatOrderPenunjangRad');
            Route::get('get-tindakan-for-cppt', 'EMR\EMRController@getTindakanForCppt');
            Route::post('delete-cppt', 'EMR\EMRController@deleteCppt');

            Route::get('get-pengkajian-awal-medis', 'EMR\EMRController@getPengkajianAwalMedis');
            Route::get('get-pengkajian-awal-medisD', 'EMR\EMRController@getPengkajianAwalMedisD');
            Route::get('get-pengkajian-awal-medis-igd', 'EMR\EMRController@getPengkajianAwalMedisIGD');
            Route::get('get-pengkajian-awal-medis-igd-tata-laksana', 'EMR\EMRController@getPengkajianAwalMedisIGDTataLaksana');
            Route::get('get-pengkajian-awal-medis-kebidanan', 'EMR\EMRController@getPengkajianAwalMedisKebidanan');
            Route::get('get-pengkajian-awal-medis-mata', 'EMR\EMRController@getPengkajianAwalMedisMata');

            Route::get('get-obat-pulang', 'EMR\EMRController@getObatPulang');
            Route::post('cek-otomatis-penunjang-resume-igd', 'EMR\EMRController@cekOtomatisPenunjangResumeIgd');
            Route::post('update-tgl-cetak-resume', 'EMR\EMRController@updateTglCetakResume');

            Route::get('get-temp-resume', 'EMR\EMRController@getTempResume');
            Route::get('get-temp-resume-ri', 'EMR\EMRController@getTempResumeRi');
            Route::post('update-final-resume-ri', 'EMR\EMRController@updateFinalResumeRI');
            Route::post('update-item-for-resume', 'EMR\EMRController@updateItemForResume');
            Route::get('get-vital-sign-terakhir', 'EMR\EMRController@getLastVitalSign');
            Route::get('get-obat-pulang-ri', 'EMR\EMRController@getObatPulangRI');
            Route::get('get-navigasi-emr', 'EMR\EMRController@getNavigasiEmr');
            Route::post('save-mapping-navigasi', 'EMR\EMRController@saveMappingNavigasi');
            Route::post('save-mapping-navigasi-penunjang', 'EMR\EMRController@saveMappingNavigasiPenunjang');
            Route::post('delete-mapping-navigasi', 'EMR\EMRController@deleteMappingNavigasiEmr');
            Route::post('update-jenis-pegawai', 'EMR\EMRController@UpdateJenisPegawai');

            Route::get('get-combo-alergi', 'EMR\EMRController@getComboAlergi');
            Route::post('post-alergi-intoleren', 'EMR\EMRController@saveAlergiIntoleren');
            Route::post('disabled-alergi-intoleren', 'EMR\EMRController@deleteAlergiIntoleren');
            Route::get('get-alergi-intoleren', 'EMR\EMRController@getAlergiDataIntoleren');

            // add by key 06-12-2023 from polri
            // laporan EMR Ranap
            Route::group(['prefix' => 'laporan'], function () {
                Route::get('get-laporan-sudah-isi-cppt-emr-ri', 'EMR\EMRController@getLaporanCpptRI');
                Route::get('get-laporan-sudah-isi-cppt-emr-ri-detail', 'EMR\EMRController@getLaporanCpptRIDetail');
                Route::get('get-laporan-sudah-isi-cppt-emr-ri-harian', 'EMR\EMRController@getLaporanCpptRIHarian');
                Route::get('get-laporan-sudah-isi-cppt-emr-ri-detail-harian', 'EMR\EMRController@getLaporanCpptRIDetailHarian');
                Route::get('get-laporan-sudah-isi-pengkajian-awal-ri', 'EMR\EMRController@getLaporanPengkajianAwalKeperawatanRI');
                Route::get('get-laporan-sudah-isi-formulir-edukasi-ri', 'EMR\EMRController@getLaporanFormulirEdukasiRI');
                Route::get('get-laporan-sudah-isi-catatan-keperawatan-ri', 'EMR\EMRController@getLaporanCatatanKeperawatanRI');
                Route::get('get-laporan-sudah-isi-askep-ri', 'EMR\EMRController@getLaporanAskepRI');
                Route::get('get-laporan-sudah-isi-pengkajian-medis-ri', 'EMR\EMRController@getLaporanPengkajianMedisRI');
                Route::get('get-laporan-sudah-isi-resume-medis-rj', 'EMR\EMRController@getLaporanResumeRJ');
                Route::get('get-laporan-sudah-isi-resume-medis-rj-detail', 'EMR\EMRController@getLaporanSudahIsiResumeMedisRJDetail');
                Route::get('get-laporan-sudah-isi-resume-medis-rj', 'EMR\LaporanEMRController@getLaporanResumeRJ');
                Route::get('get-laporan-sudah-isi-resume-medis-rj-detail', 'EMR\LaporanEMRController@getLaporanSudahIsiResumeMedisRJDetail');
                Route::get('get-laporan-sudah-isi-resume-medis-ri', 'EMR\LaporanEMRController@getLaporanResumeRI');
                Route::get('get-laporan-sudah-isi-resume-medis-ri-detail', 'EMR\LaporanEMRController@getLaporanSudahIsiResumeMedisRIDetail');
            });
        });
        Route::post('cp/save-cp-dinamis', 'ClinicalPathway\CPController@SaveTransaksiCP');
        Route::get('cp/get-cp-transaksi-detail', 'ClinicalPathway\CPController@getEMRTransaksiDetail');
        Route::get('cp/get-detail-diagnosa-pasien', 'ClinicalPathway\CPController@getDiagnosaPasien');
        Route::get('cp/get-list-cp', 'ClinicalPathway\CPController@getListCP');
        Route::get('cp/get-list-diagnosa-cp', 'ClinicalPathway\CPController@getListDiagnosaCP');
        Route::get('cp/get-produk-part', 'ClinicalPathway\CPController@getProduk');
        Route::get('cp/get-form-target', 'ClinicalPathway\CPController@getFormTarget');
        Route::post('cp/save-mapping', 'ClinicalPathway\CPController@saveMapping');
        Route::post('cp/save-caption', 'ClinicalPathway\CPController@saveCaption');
        Route::get('cp/get-mapping', 'ClinicalPathway\CPController@getMapping');
        Route::get('cp/get-caption', 'ClinicalPathway\CPController@getCaption');
        Route::post('cp/hapus-mapping', 'ClinicalPathway\CPController@hapusMapping');
        Route::get('cp/get-colorchk', 'ClinicalPathway\CPController@getColorCheckBox');
        Route::get('cp/get-kegiatan-uraian', 'ClinicalPathway\CPController@getKegiatanDanUraiannya');

        Route::group(['prefix' => 'farmasi'], function () {
            Route::get('get-produkdetail', 'Farmasi\PelayananResepController@getProdukDetail');
            Route::get('get-transaksi-pelayanan', 'Farmasi\PelayananResepController@getTransaksiPelayananApotik');
            Route::get('get-transaksi-pelayanan-resume-rj', 'Farmasi\PelayananResepController@getTransaksiPelayananApotikResumeRJ');
            Route::post('save-antrian', 'Farmasi\PelayananResepController@simpanantrian');
            Route::post('updateantrianclear', 'Farmasi\PelayananResepController@updateantrianclear');
            Route::post('updateantrian', 'Farmasi\PelayananResepController@updateantrian');
            Route::get('get-daftar-order', 'Farmasi\ResepElektronikController@getDaftarOrder');
            Route::get('get-daftar-detail-order', 'Farmasi\ResepElektronikController@getDaftarDetailOrder');
            Route::post('save-status-resepelektonik', 'Farmasi\ResepElektronikController@saveStatusResepElektronik');
            Route::get('get-daftar-pasien-farmasi-antrian-belum', 'Farmasi\FarmasiController@getDaftarPasienAntrianBelum');
            Route::post('save-data-skrining-farmasi', 'Farmasi\ResepElektronikController@saveSkriningFarmasi');
            Route::get('get-histori-skrining', 'Farmasi\ResepElektronikController@getDataSkriningFarmasi');

            Route::get('get-datacombo_dp', 'Farmasi\FarmasiController@getDataComboDaftarPasien');
            Route::get('get-daftar-pasien-farmasi', 'Farmasi\FarmasiController@getDaftarPasien');
            Route::get('get-daftar-pasien-farmasi-antrian', 'Farmasi\FarmasiController@getDaftarPasienAntrian');

            Route::get('get-detailPD', 'Farmasi\PelayananResepController@getDataPengkajian');
            Route::get('get-transaksi-pelayanan', 'Farmasi\PelayananResepController@getTransaksiPelayananApotik');
            Route::get('get-transaksi-pelayanan-etiket', 'Farmasi\PelayananResepController@getTransaksiPelayananApotikEtiket');
            Route::get('get-obat-rm', 'Farmasi\PelayananResepController@getObatRM');
            Route::get('get-transaksi-dosis-rm', 'Farmasi\PelayananResepController@getTransaksiDosisRM');
            Route::get('get-transaksi-dosis-pulang-rm', 'Farmasi\PelayananResepController@getTransaksiDosisPulangRM');
            Route::get('get-transaksi-dosis-rm-pop', 'Farmasi\PelayananResepController@getTransaksiDosisRMPop');
            Route::get('get-transaksi-dosis-pulang-rm-pop', 'Farmasi\PelayananResepController@getTransaksiDosisPulangRMPop');
            Route::get('get-transaksi-status-dosis-rm', 'Farmasi\PelayananResepController@getTransaksiStatusDosisRM');
            Route::post('save-transaksi-dosis-rm', 'Farmasi\PelayananResepController@saveTransaksiDosisRM');
            Route::post('save-transaksi-dosis-pulang-rm', 'Farmasi\PelayananResepController@saveTransaksiDosisPulangRM');
            // Route::put('put-transaksi-dosis-rm', 'Farmasi\PelayananResepController@putTransaksiDosisRM');
            Route::get('get-detail-reg-farmasi', 'Farmasi\PelayananResepController@getDetailRegApotik');
            Route::get('get-daftar-paket-obat-pasien', 'Farmasi\PelayananResepController@getDaftarPaketObatPasien');
            Route::post('save-hapus-pelayananobat', 'Farmasi\PelayananResepController@DeletePelayananObat');
            Route::post('save-hapus-pelayananobatperitem', 'Farmasi\PelayananResepController@DeletePelayananObatPerItem');
            Route::post('save-hapus-pelayananobatperitemtap', 'Farmasi\PelayananResepController@DeletePelayananObatPerItemtap');

            Route::post('save-hapus-pelayananobatperitemt23', 'Farmasi\PelayananResepController@DeletePelayananObatPerItem23');
            Route::get('get-histori-obat', 'Farmasi\PelayananResepController@getHistoriObat');



            Route::get('get-datacombo', 'Farmasi\PelayananResepController@getDataCombo');
            Route::get('get_detail-resep', 'Farmasi\PelayananResepController@getDetailResep');
            Route::get('get-detail-order', 'Farmasi\PelayananResepController@getDetailOrder');
            Route::get('get-info-stok', 'Farmasi\PelayananResepController@getInformasiStok');
            Route::get('get-info-stok-showup', 'Farmasi\PelayananResepController@getInformasiStokByNoterima');
            Route::get('get-produkdetail', 'Farmasi\PelayananResepController@getProdukDetail');
            Route::get('get-produkdata', 'Farmasi\PelayananResepController@getProdukData');
            Route::post('save-stock-merger', 'Farmasi\PelayananResepController@StokMerger');
            Route::get('get-jenis-obat', 'Farmasi\PelayananResepController@getJenisObat');
            Route::post('save-pelayananobat', 'Farmasi\PelayananResepController@SimpanPelayananObat');
            Route::post('save-diskonobat', 'Farmasi\PelayananResepController@SimpanDiskonObat');

            // trisno
            Route::post('update-tanggal-resep', 'Farmasi\PelayananResepController@updateTanggalResep');

            Route::get('get-data-combo-transfer', 'Farmasi\PaketObatController@getDataComboTransfer');
            Route::get('get-detail-ruangan-apd', 'Farmasi\PaketObatController@getRuanganFromAPD');
            Route::get('get-detail-kirim-barang', 'Farmasi\PaketObatController@getDetailKirimBarang');
            Route::get('get-detail-order-for-kirim-barang', 'Farmasi\PaketObatController@getDetailOrderBarangForKirim');
            Route::post('save-kirim-barang', 'Farmasi\PaketObatController@saveKirimBarang');

            Route::get('get-daftar-pasien-farmasi-ri', 'Farmasi\FarmasiController@getDaftarPasienRI');
            Route::get('get-daftar-resep', 'Farmasi\FarmasiController@getDaftarResep');
            Route::get('get-daftar-retur-obat', 'Farmasi\FarmasiController@getDaftarReturObat');
            Route::get('get-daftar-paket-obat-pasien', 'Farmasi\FarmasiController@getDaftarPaketObatPasien');


            Route::get('get-norec_bebas', 'Farmasi\PelayananObatBebasController@GetNorecResepBebas');
            Route::get('get-detail-obat-bebas', 'Farmasi\PelayananObatBebasController@getDetailResepBebas');
            Route::get('get-detail-pasien', 'Farmasi\PelayananObatBebasController@getDetailPasien');
            Route::post('save-input-non-layanan-obat', 'Farmasi\PelayananObatBebasController@SaveInputTagihanObat');
            Route::get('get-daftar-jual-bebas', 'Farmasi\PelayananObatBebasController@getDaftarPenjualanBebas');
            Route::post('hapus-resep_ob', 'Farmasi\PelayananObatBebasController@DeleteResepOB');
            Route::post('delete-terima-barang-suplier', 'SysAdmin\GeneralController@DeletePenerimaanSuplier');

            Route::get('get-data-grid-sasaran-mutu', 'Farmasi\SasaranMutuController@getDataGrid');
            Route::get('get-combo-sasaranmutu', 'Farmasi\SasaranMutuController@getDataCombo');

            Route::get('get-hasil_consis-d', 'Farmasi\BridgingMinir45Controller@getConsisD');

            Route::post('save-data-skrining-farmasi', 'Farmasi\ResepElektronikController@saveSkriningFarmasi');
            Route::get('get-histori-skrining', 'Farmasi\ResepElektronikController@getDataSkriningFarmasi');
            Route::get('get-alamat', 'Farmasi\ResepElektronikController@getAlamat');
            Route::post('save-retur-obat-non-layanan', 'Farmasi\PelayananObatBebasController@saveReturTagihanObat');
            Route::get('get-laporan-pengeluaran-obat', 'Farmasi\PelayananObatBebasController@getLaporanPengeluaranObat');
            Route::get('get-daftar-retur-obat-detail', 'Farmasi\FarmasiController@getDaftarReturObatDetail');
            Route::get('get-laporan-penyerahan-obat', 'Farmasi\PelayananObatBebasController@getLaporanPenyerahanObat');
            Route::get('get-data-waktuminum-resep', 'Farmasi\PelayananResepController@getDataWaktuMinum');
            Route::get('get-laporan-rekapitulasi-pelayanan', 'Farmasi\PelayananObatBebasController@getLaporanRekapitulasiPelayanan');
            Route::get('get-nostruk-kasir', 'Farmasi\PelayananResepController@getNoStrukKasir');
            Route::post('batal-verifikasi-order-resep', 'Farmasi\PelayananResepController@saveBatalVerifikasiResep');
            Route::post('save-pelayanan-obat-kronis', 'Farmasi\PelayananResepController@SimpanPelayananObatKronis');
            Route::get('get-transaksi-pelayanan-obat-kronis', 'Farmasi\PelayananResepController@getTransaksiPelayananObatKronis');
            Route::get('get-transaksi-pelayanan-obat-tap', 'Farmasi\PelayananResepController@getTransaksiPelayananObatTap');
            Route::post('save-ubahdokter', 'Farmasi\PelayananResepController@ubahdokter');
            Route::post('save-ubahdepo', 'Farmasi\PelayananResepController@ubahdepo');
            Route::get('get-lap-pemakaian-obat', 'Farmasi\FarmasiController@getLapPemakaianObat');


            Route::get('cek-obat-psikotropika', 'Farmasi\PelayananResepController@cekObatPsikotropika');
            Route::get('get-pengkajian-pasien', 'Farmasi\PelayananResepController@getDataPengkajianNew');

            Route::group(['prefix' => 'produksi'], function () {
                Route::get('get-daftar-produksi-obat', 'Farmasi\ProduksiBarangController@getDaftarProduksiObat');
                Route::post('hapus-produksi-barang', 'Farmasi\ProduksiBarangController@hapusObatProduksi');
                Route::get('get-data-combo-produksi', 'Farmasi\ProduksiBarangController@getDataComboProduksi');
                Route::get('get-detail-master-barang-produksi', 'Farmasi\ProduksiBarangController@getDetailMasterProduksi');
                Route::get('get-info-stok-detail', 'Farmasi\ProduksiBarangController@getInformasiStokDetail');
                Route::post('save-input-sisa-produksi-barang', 'Farmasi\ProduksiBarangController@saveInputSisaProduksiBarang');
                Route::get('get-daftar-master-barang-produksi', 'Farmasi\ProduksiBarangController@getDaftarBarangProduksi');
                Route::get('get-detail-master-barang-produksi', 'Farmasi\ProduksiBarangController@getDetailMasterProduksi');
                Route::post('save-produksi-barang', 'Farmasi\ProduksiBarangController@saveProduksiBarang');
                Route::get('get-daftar-produksi-obat-detail', 'Farmasi\ProduksiBarangController@getDaftarProduksiObatDetail');
            });
        });
        Route::group(['prefix' => 'gizi'], function () {
            Route::get('get-pertanyaan-pmkp', 'Gizi\GiziController@getPertanyaanPMKP');
            Route::post('save-pertanyaan-pmkp', 'Gizi\GiziController@savePertanyaanPMKP');
            Route::get('get-produk-menudiet', 'Gizi\GiziController@getProdukMenu');
            Route::post('save-order-gizi', 'Gizi\GiziController@saveOrderGizi');
            Route::post('save-order-giziperitem', 'Gizi\GiziController@saveOrderGiziEdit');
            Route::get('get-daftar-order', 'Gizi\GiziController@getDaftarOrderGizi');
            Route::get('get-daftar-order2', 'Gizi\GiziController@getDaftarOrderGizi2');
            Route::get('get-daftar-order2x', 'Gizi\GiziController@getDaftarOrderGizi2x');
            Route::get('get-daftar-order3', 'Gizi\GiziController@getDaftarOrderGizi3');
            Route::get('get-daftar-order3x', 'Gizi\GiziController@getDaftarOrderGizi3x');
            Route::get('get-daftar-order-detail', 'Gizi\GiziController@getDaftarOrderGiziDetail');
            Route::get('get-combo', 'Gizi\GiziController@getDataComboBox');
            Route::post('delete-orderpelayanan-gizi', 'Gizi\GiziController@deleteOrderPelayananGizi');
            Route::post('save-kirimmenu-gizi', 'Gizi\GiziController@saveKirimMenuGizi');
            Route::get('get-daftar-kirim', 'Gizi\GiziController@getDaftarKirim');
            Route::post('update-orderpelayanan-gizi', 'Gizi\GiziController@updateOrderPelayananGizi');
            Route::get('get-daftar-kirim', 'Gizi\GiziController@getDaftarKirim');
            Route::post('batal-kirim', 'Gizi\GiziController@deleteKirimMenu');
            Route::post('hapus-order-gizi', 'Gizi\GiziController@hapusOrderGzi');
            Route::post('hapus-peritem-order', 'Gizi\GiziController@hapusOrderGziPeritem');
            Route::post('update-peritem-order', 'Gizi\GiziController@updateOrderGizi');

            Route::post('hapus-peritem-menugizi', 'Gizi\GiziController@hapusOrderGziMenugizi');
        });
        Route::group(['prefix' => 'humas'], function () {
            // GET //
            Route::get('get-daftar-tarif-layanan', 'Humas\HumasController@getDaftarTarif');
            Route::get('get-daftar-combo', 'Humas\HumasController@getDataComboHumas');
            Route::get('get-daftar-data-produk', 'Humas\HumasController@getDataproduk');
            Route::get('get-daftar-tarif-layanan-detail', 'Humas\HumasController@getDaftarTarifDetail');
            Route::get('get-data-view-bed', 'Humas\HumasController@getDataViewBed');
            Route::get('get-data-view-bed2', 'Humas\HumasController@getDataViewBed2');
            Route::get('get-ketersediaan-tempat-tidur-view', 'Humas\HumasController@getKetersediaanTempatTidurView');
            Route::get('get-daftar-combo-pegawai', 'Humas\HumasController@getDataPegawai');
            Route::get('get-daftar-jadwal-dokter', 'Humas\HumasController@getJadwalDokter');
            Route::get('get-ruangan-part', 'Humas\HumasController@getRuanganPart');
            Route::get('get-combo-dokter', 'Humas\HumasController@getComboDokter');
            Route::get('get-jadwal-perbulan', 'Humas\HumasController@getJadwalBulananDokter');
            Route::get('get-daftar-registrasi-pasien', 'Humas\HumasController@getDaftarRegistrasiPasien');
            Route::get('get-data-norec-apd', 'Humas\HumasController@getDataAntrianPasien');
            Route::get('get-data-informasi-pasien-pulang', 'Humas\HumasController@getDataInformasiPasienPulang');
            Route::get('get-data-informasi-pasien', 'Humas\HumasController@getDataInformasiPasien');
            Route::get('get-data-informasi-riwayat-registrasi', 'Humas\HumasController@getDataInformasiRiwayatRegistrasi');
            Route::get('get-data-informasi-pasien-dalam-perawatan', 'Humas\HumasController@getInformasiDataPasienDalamPerawatan');;
            Route::get('get-data-informasi-pasien-perjanjian', 'Humas\HumasController@getDataInformasiPasienPerjanjian');
            Route::get('get-data-keluhan-pelanggan', 'Humas\HumasController@getDaftarKeluhan');
            Route::get('get-data-detail-pasien', 'Humas\HumasController@getDetailPasien');
            Route::get('get-penanganan-keluhan-pelanggan', 'Humas\HumasController@getDaftarPenanganKeluhan');
            Route::get('get-combo-pegawai', 'Humas\HumasController@getDataPegawaiAll');
            Route::get('get-data-informasi-pasien-dalam-perawatan-keswamas', 'Humas\HumasController@getInformasiDataPasienDalamPerawatanKeswamas');
            Route::get('get-evaluasi-pasien-kontrol', 'Humas\HumasController@getDataEvaluasiPasienKontrol');
            Route::get('laporan-pasien-kontrol', 'Humas\HumasController@getLaporanPasienKontrol');

            // trisno 
            Route::post('save-jadwal-mingguan', 'Humas\HumasController@saveJadwalMingguan');
            Route::post('delete-jadwal-dokter-mingguan', 'Humas\HumasController@deleteJawdalDokterMingguan');
            Route::get('get-jadwal-mingguan', 'Humas\HumasController@getJadwalMingguanDokter');

            // POST //
            Route::post('save-jadwal-perbulan', 'Humas\HumasController@saveJadwalBulanan');
            Route::post('save-keluhan-pelanggan', 'Humas\HumasController@SaveKeluhanPelanggan');
            Route::post('save-batal-penangankeluhan', 'Humas\HumasController@saveBatalPenangananKeluhan');
            Route::post('save-keluhan-penanganan-pelanggan', 'Humas\HumasController@savePenangananKeluhan');
            Route::post('delete-jadwal-dokter-perbulan', 'Humas\HumasController@deleteJawdalDokterBulanan');
        });
        Route::group(['prefix' => 'igd'], function () {
            Route::get('get-data-combo', 'IGD\IGDController@getCombo');
            Route::get('get-daftar-pasien', 'IGD\IGDController@getAntrianPasienGawatDarurat');
            Route::get('get-pemeriksaan-triage', 'IGD\IGDController@GetPemeriksaanTriage');
            Route::get('get-kategori-triage', 'IGD\IGDController@GetKategoriTriage');
            Route::get('get-hasil-triase', 'IGD\IGDController@GetHasilTriase');
            Route::get('get-combo-triase', 'IGD\IGDController@getComboTriase');
            Route::post('simpan-triage', 'IGD\IGDController@SimpanHasilTriase');
            Route::get('get-data-pasien', 'IGD\IGDController@getDaftarPasien');
            Route::get('get-data-pasien/{nocm}', 'IGD\IGDController@getDataPasien');
        });
        Route::group(['prefix' => 'jenazah'], function () {
            Route::get('get-data-antemortem', 'Jenazah\JenazahController@GetDataantemortem');
            Route::get('get-data-for-combo', 'Jenazah\JenazahController@GetDataForCombo');
            Route::get('get-data-pasien', 'Jenazah\JenazahController@GetDataPasien');
            Route::post('simpan-data-pengambilan-jenazah', 'Jenazah\JenazahController@SimpanDataPengambilanJenazah');
            Route::get('get-data-jenazah', 'Jenazah\JenazahController@GetDataJenazah');
            Route::get('get-data-order-jenazah', 'Jenazah\JenazahController@getDaftarOrderJenazah');
            Route::get('get-data-pasien-forensikMedikolegal', 'Jenazah\JenazahController@getPasienForensikMedikolegal');
            Route::post('simpan-data-pelayanan-Jenazah', 'Jenazah\JenazahController@savePelayananPasienJenazah');
            Route::get('get-data-registrasi-pasien-Jenazah', 'Jenazah\JenazahController@getDaftarRegistrasiPasienJenazah');
            Route::get('get-data-rincian-pasien-Jenazah', 'Jenazah\JenazahController@getRincianPelayananJenazah');
            Route::get('get-order-pelayanan-jenazah', 'Jenazah\JenazahController@getOrderPelayananJenazah');
            Route::post('save-order-pelayanan-jenazah', 'Jenazah\JenazahController@saveOrderJenazah');
            Route::post('delete-order-pelayanan-jenazah', 'Jenazah\JenazahController@hapusOrderPelayananJenazah');
            Route::get('get-riwayat-order-jenazah', 'Jenazah\JenazahController@getRiwayatOrderPelayananJenazah');
            Route::get('get-daftar-pasien-meninggal', 'Jenazah\JenazahController@getDaftarPasienMeninggal');
            Route::get('get-data-combo-operator', 'Jenazah\JenazahController@getDataComboOperator');
            Route::get('get-data-diagnosa', 'Jenazah\JenazahController@getDataDiagnosa');
            Route::post('save-apd', 'Jenazah\JenazahController@saveAntrianPasien');
            Route::get('get-data-combo-labrad', 'Jenazah\JenazahController@getDataComboLabRab');
            Route::post('delete-pelayanan-pasien', 'Jenazah\JenazahController@deletePelayananPasien');
            Route::get('get-lap-pasien-meninggal', 'Jenazah\JenazahController@getLaporanPasienMeninggal');
            Route::get('get-lap-pemulasaran-jenazah', 'Jenazah\JenazahController@getLaporanPemulasaranJenazah');
            Route::post('batal-meninggal-pasien', 'Jenazah\JenazahController@BatalMeninggalPasien');
            Route::post('save-permohonan-pelayanan-jenazah', 'Jenazah\JenazahController@savePermohonanPelayananJenazah');
            Route::get('get-data-permohonan-pelayanan-jenazah', 'Jenazah\JenazahController@getDataPermohonanPelayananJenazah');
            Route::post('hapus-permohonan-pelayanan-jenazah', 'Jenazah\JenazahController@HapusPermohonanPelayananJenazah');
            Route::post('save-pasien-jenazah', 'Jenazah\JenazahController@savePasienJenazah');
            Route::get('get-pelayanan-pasien', 'Jenazah\JenazahController@getPelayananPasien');
            Route::post('simpan-batal-periksa', 'Jenazah\JenazahController@SimpanBatalPeriksa');
            Route::post('save-logging-batal-periksa', 'Jenazah\JenazahController@saveLoggingBatalPeriksa');
            Route::get('get-apd', 'Jenazah\JenazahController@getAPD');
            Route::post('save-forensik-new', 'Jenazah\JenazahController@saveForensikNew');
            Route::get('get-angka-titik', 'Jenazah\JenazahController@getAngkaTitik');
            Route::get('get-blabla', 'Jenazah\JenazahController@getBlaBla');
            Route::get('get-format-tanggal-cuy', 'Jenazah\JenazahController@formatTanggalPakeHurufCoy');

            Route::group(['prefix' => 'dvi'], function () {
                Route::post('save-postmortem', 'Jenazah\JenazahController@savePostmortem');
                Route::post('save-mapping-jenis-bencana', 'Jenazah\JenazahController@saveMappingJenisBencana');
                Route::get('get-mapping-jenis-bencana', 'Jenazah\JenazahController@getMappingJenisBencana');
                Route::get('get-mapping-jenis-bencana-to-formulir-antemortem', 'Jenazah\JenazahController@getMappingJenisBencanaToFormulirAntemortem');
                Route::post('save-formulir-antemortem', 'Jenazah\JenazahController@saveFormulirAntemortem');
                Route::get('get-daftar-formulir-antemortem', 'Jenazah\JenazahController@getFormulirAntemortem');
                Route::get('get-foto-antemortem', 'Jenazah\JenazahController@getFotoAntemortem');
                Route::get('get-postmortem', 'Jenazah\JenazahController@getPostmortem');
                Route::post('save-penerimaan-jenazah-dvi', 'Jenazah\JenazahController@savePenerimaanJenazah');
                Route::get('get-foto-postmortem', 'Jenazah\JenazahController@getFotoPostmortem');
                Route::post('save-formulir-antemortemweb', 'Jenazah\JenazahController@saveFormulirAntemortemWeb');
                Route::get('get-antemortem', 'Jenazah\JenazahController@getAntemortem');
                Route::get('get-foto-identifikasi-antemortem', 'Jenazah\JenazahController@getFotoIdentifikasiAntemortem');
                Route::get('get-identifikasi-postmortem', 'Jenazah\JenazahController@getIdentifikasiPostmortem');
                Route::get('get-foto-identifikasi-postmortem', 'Jenazah\JenazahController@getFotoIdentifikasiPostmortem');
                Route::post('save-identifikasi-jenazah', 'Jenazah\JenazahController@saveIdentifikasiJenazah');
                Route::get('get-laporan-akhir', 'Jenazah\JenazahController@getLaporanAkhirDvi');
                Route::get('get-laporan-postmortem', 'Jenazah\JenazahController@getLaporanPostmortem');
                Route::get('get-laporan-antemortem', 'Jenazah\JenazahController@getLaporanAntemortem');
                Route::get('get-laporan-akhir-2', 'Jenazah\JenazahController@getLaporanAkhirDvi2');
                Route::get('get-laporan-akhir-detail', 'Jenazah\JenazahController@getLaporanDviDetail');
                Route::get('get-verifikasi-keluarga', 'Jenazah\JenazahController@getVerifikasiKeluarga');
                Route::post('save-verifikasi-keluarga-korban', 'Jenazah\JenazahController@saveVerifikasiKeluargaKorban');
                Route::post('save-verifikasi-jenis-bencana', 'Jenazah\JenazahController@saveVerifikasiJenisBencana');
                Route::post('save-batal-verifikasi-jenis-bencana', 'Jenazah\JenazahController@saveBatalVerifikasiJenisBencana');
                Route::get('get-data-identifikasi-antemortem', 'Jenazah\JenazahController@getDataIdentifikasiAntemortem');
                Route::get('get-data-identifikasi-postmortem', 'Jenazah\JenazahController@getDataIdentifikasiPostmortem');
                Route::get('get-lihat-data-postmortem', 'Jenazah\JenazahController@getLihatPostmortem');
                Route::post('delete-foto-postmortem', 'Jenazah\JenazahController@deleteFotoPostmortem');
                Route::post('edit-postmortem', 'Jenazah\JenazahController@editPostmortem');
                Route::get('get-data-edit-antemortem', 'Jenazah\JenazahController@getDataEditAntemortem');
                Route::post('delete-foto-antemortem', 'Jenazah\JenazahController@deleteFotoAntemortem');
                Route::post('save-edit-antemortem', 'Jenazah\JenazahController@saveEditAntemortem');
                Route::get('get-laporan-penerimaan-jenazah-dvi', 'Jenazah\JenazahController@getLaporanPenerimaanJenazahDvi');
                Route::get('get-laporan-teridentifikasi-jenazah', 'Jenazah\JenazahController@getLaporanTeridentifikasiJenazah');
                Route::get('get-foto-antemortem-new', 'Jenazah\JenazahController@getFotoAntemortemNew');
                Route::get('get-foto-postmortem-new', 'Jenazah\JenazahController@getFotoPostmortemNew');
                Route::post('save-release-dvi', 'Jenazah\JenazahController@saveReleaseDvi');
                Route::get('cek-sudah-release', 'Jenazah\JenazahController@cekSudahRelease');
                Route::get('get-release-dvi', 'Jenazah\JenazahController@getReleaseDvi');
            });
        });
        Route::group(['prefix' => 'kasir'], function () {
            // GET

            Route::get('get-data-combo-kasir', 'Kasir\KasirController@getDataComboKasir');
            Route::get('get-laporan-pendapatan', 'Kasir\KasirController@getLaporanPendapatan');
            Route::get('get-rekap-pendapatan', 'Kasir\KasirController@getRekaPendapatan');
            Route::get('get-rekap-pendapatan-keuangan', 'Kasir\KasirController@getLaporanPendapatan');
            Route::get('get-data-combo-kasir-select', 'Kasir\KasirController@getDataComboKasirSelect');
            Route::get('get-data-combo-kasir1', 'Kasir\KasirController@getDataComboKasir1');
            Route::get('daftar-tagihan-non-layanan', 'Kasir\KasirController@daftarTagihanNonLayanan');
            Route::get('get-data-produk', 'Kasir\KasirController@getDataProduk');
            Route::get('detail-tagihan-non-layanan', 'Kasir\KasirController@detailTagihanNonLayanan');
            Route::get('daftar-tagihan-pasien', 'Kasir\KasirController@daftarTagihanPasien');
            Route::get('detail-tagihan-pasien', 'Kasir\KasirController@detailTagihanPasien');
            Route::get('daftar-piutang-layanan', 'Kasir\KasirController@daftarPiutang');
            Route::get('daftar-pasien-aktif', 'Kasir\KasirController@daftarPasienAktif');
            Route::get('data-daftar-sbm', 'Kasir\KasirController@daftarSBM');
            Route::get('data-daftar-sbm-rajal', 'Kasir\KasirController@daftarSBMRajal');
            Route::get('data-daftar-sbm-rajal-non-layanan', 'Kasir\KasirController@daftarSBMRajalNonLayanan');
            Route::get('data-daftar-sbm-igd', 'Kasir\KasirController@daftarSBMIgd');
            Route::get('data-daftar-sbm-igd-non-layanan', 'Kasir\KasirController@daftarSBMIgdNonLayanan');
            Route::get('get-data-lap-penerimaan-kasir-harian', 'Kasir\KasirController@getDataLaporanPenerimaanKasirHarian');
            Route::get('get-data-lap-penerimaan-kasir-perusahaan', 'Kasir\KasirController@getDataLaporanPenerimaanKasirPerusahaan');
            Route::get('get-data-lap-pendapatan', 'Kasir\KasirController@getDataLapPendapatan');
            Route::get('get-data-lap-pendapatan-ruangan', 'Kasir\KasirController@getDataLaporanPendapatanRuangan');
            Route::get('get-data-lap-pendapatan-ruanganNew', 'Kasir\KasirController@getDataLaporanPendapatanRuanganNew');
            Route::get('get-data-lap-piutang-penjamin', 'Kasir\KasirController@getDataLaporanPiutangPenjamin');
            Route::get('get-data-pembayaran', 'Kasir\KasirController@pembayaran');
            Route::get('detail-pasien-deposit/{noRegister}', 'Kasir\KasirController@detailPasienDeposit');
            //            Route::get('get-data-lap-perincian-penerimaan', 'Kasir\KasirController@getDataLaporanPenerimaan');
            Route::get('get-data-lap-perincian-penerimaan', 'Kasir\KasirController@getDataLaporanPenerimaanRev202011');
            Route::get('get-data-lap-perincian-penerimaan-detail', 'Kasir\KasirController@getDataLaporanPenerimaanDetailRev202011');
            Route::get('get-data-map-penerimaan', 'Kasir\KasirController@get1MapLaporanPenerimaan');
            Route::get('get-data-combo-penerimaan', 'Kasir\KasirController@get1DataComboLaporanPenerimaan');
            Route::post('save-maplap-penerimaan', 'Kasir\KasirController@updateMapLapPenerimaan');
            Route::get('get-data-lap-rekap-pendapatan-harian', 'Kasir\KasirController@getDataLaporanRekapPendapatanHarian');
            //all

            Route::get('get-data-lap-rekap-pendapatan-all-new', 'Kasir\KasirController@getPendapatanAll');
            Route::get('get-data-lap-rekap-pendapatan-all-new-sync1', 'Kasir\KasirController@getPendapatanAllSync1');
            Route::get('get-data-lap-rekap-pendapatan-all-new-sync2', 'Kasir\KasirController@getPendapatanAllSync2');
            Route::get('get-data-lap-rekap-pendapatan-all-new-sync3', 'Kasir\KasirController@getPendapatanAllSync3');
            Route::post('save-list-data-temporary-bp', 'Kasir\KasirController@SaveListDataTemporaryBP');

            Route::get('get-data-lap-perincian-penerimaan-mingguan', 'Kasir\KasirController@getDataLaporanPenerimaanMingguan');
            Route::get('get-data-lap-rekap-retribusi-daerah', 'Kasir\KasirController@getDataLaporanRekapHasilRetribusiDaerah');
            Route::get('get-data-lap-target-realisasi-pendapatan', 'Kasir\KasirController@getDataLaporanTargetRealisasiPendapatan');
            Route::get('get-data-lap-opd-administrasi', 'Kasir\KasirController@getDataLaporanOPDAdministrasi');
            Route::get('get-data-lap-opd-fungsional', 'Kasir\KasirController@getDataLaporanOPDFungsional');
            Route::get('get-data-lap-penerimaan-rekening', 'Kasir\KasirController@getDataLaporanPerRekening');
            Route::get('get-data-lap-non-layanan', 'Kasir\KasirController@getDataLaporanPendapatanDiklat');
            Route::get('get-data-rekap-diklat', 'Kasir\KasirController@getDataRekapDiklat');
            Route::get('detail-piutang-pasien/{norecSPP}', 'Kasir\KasirController@detailPiutangPasien');
            // GET

            // POST
            Route::post('save-input-non-layanan', 'Kasir\KasirController@SaveInputTagihan');
            Route::post('save-log-batal-bayar', 'Kasir\KasirController@saveLogBatalBayar');
            Route::post('save-ubah-cara-bayar', 'Kasir\KasirController@UbahCaraBayar');
            Route::post('save-batal-bayar', 'Kasir\KasirController@deletePembayaranTagihan');
            Route::post('simpan-data-pembayaran', 'Kasir\KasirController@simpanPembayaran');  //done
            Route::post('save-batal-pulang', 'Kasir\KasirController@HapusTglPulang');  //done
            Route::post('save-batal-pulang-bed', 'Kasir\KasirController@HapusTglPulangDanBed');
            Route::post('hapus-transaksi-non-layanan', 'Kasir\KasirController@BatalInputTagihanNonLayanan');
            Route::post('save-anggaran-lap-opd-fungsional', 'Kasir\KasirController@SaveAnggaranLaporanOPDFungsional');
            Route::post('save-kelompok-transaksi-kasir', 'Kasir\KasirController@SaveKelompokTransaksiKasir');
            // POST
        });
        Route::group(['prefix' => 'kiosk'], function () {
            Route::post('save-antrian', 'KiosK\KiosKController@saveAntrianTouchscreen');
            Route::post('save-antrian-online', 'KiosK\KiosKController@saveAntrianTouchscreenAntrol');
            Route::post('save-antrian-online-jkn', 'KiosK\KiosKController@saveAntrianTouchscreenAntrolJKN');
            Route::get('get-ruanganbykode/{kode}', 'KiosK\KiosKController@getRuanganByKodeInternal');
            Route::get('get-diagnosabykode/{kode}', 'KiosK\KiosKController@getDiagnosaByKode');
            Route::get('get-view-bed-tea', 'KiosK\KiosKController@getKetersediaanTempatTidurView');
            Route::get('get-view-bed', 'KiosK\KiosKController@viewBed');
            Route::get('get-view-dpjp', 'KiosK\KiosKController@viewDpjp');
            Route::get('get-view-dpjp-ruangan', 'KiosK\KiosKController@viewDpjpRuangan');
            Route::get('get-combo', 'KiosK\KiosKController@getDataCombo');
            Route::get('get-tarif', 'KiosK\KiosKController@getDaftarTarif');
            Route::get('get-jumlah-bed-terisi', 'KiosK\KiosKController@getJumlahBedTerisi');
        });
        Route::group(['prefix' => 'laboratorium'], function () {
            Route::get('get-hasil-lab', 'Laboratorium\LaboratoriumController@getHasilLab');
            Route::get('get-hasil-lab-vans', 'Laboratorium\LaboratoriumController@getHasilLaborat');
            Route::get('get-datfar-pasien-ri-lab', 'Laboratorium\LaboratoriumController@getDaftarRIlabRad');
            Route::get('get-detail-reg-lab-rad', 'Laboratorium\LaboratoriumController@getDetailRegLabRad');
            Route::get('get-hasil-lab-fire', 'Laboratorium\LaboratoriumController@getHasilLabVans');
            Route::get('get-hasil-lab-manual', 'Laboratorium\LaboratoriumController@getHasilLabManual');
            Route::get('get-hasil-lab-manuallast', 'Laboratorium\LaboratoriumController@getHasilLabManuallast');
            Route::get('get-combo-dokter-lab', 'Laboratorium\LaboratoriumController@getDokter');
            Route::get('get-riwayat-lab-manual', 'Laboratorium\LaboratoriumController@getRiwayatHasil');
            Route::get('get-pasien-lab-manual', 'Laboratorium\LaboratoriumController@getDataPsn');
            Route::get('get-for-update-nilainormal', 'Laboratorium\LaboratoriumController@getForUpdateNilaiNormal');
            Route::get('get-laporan-lab-all', 'Laboratorium\LaboratoriumController@getLaporanTindakan');
            Route::get('get-laporan-lab-all-rekap', 'Laboratorium\LaboratoriumController@getLaporanRekapTindakan');
            Route::get('get-laporan-lab-tat', 'Laboratorium\LaboratoriumController@getLaporanTAT');
            Route::get('get-master-produk', 'Laboratorium\LaboratoriumController@getMasterProduk');
            Route::get('get-data-satuan-hasil', 'Laboratorium\LaboratoriumController@getSatuanHasil');
            Route::get('get-data-nilai-normal', 'Laboratorium\LaboratoriumController@getNilaiNormal');
            Route::get('get-map-hasil-lab', 'Laboratorium\LaboratoriumController@getMapHasilLab');
            Route::get('get-map-hasil-lab-no', 'Laboratorium\LaboratoriumController@getNoUrutJenis');
            Route::get('get-map-hasil-lab-bantu', 'Laboratorium\LaboratoriumController@getMapLabBantu');
            Route::get('get-combo-map-lab', 'Laboratorium\LaboratoriumController@getComboMapLab');
            Route::get('get-data-jenis-pemeriksaan', 'Laboratorium\LaboratoriumController@getJenisPemeriksaan');
            Route::get('get-master-produk', 'Laboratorium\LaboratoriumController@getMasterProduk');
            Route::get('get-riwayat-bayar', 'Laboratorium\LaboratoriumController@getRiwayatBayar');
            Route::get('get-nomor', 'Laboratorium\LaboratoriumController@getNomor');
            Route::get('get-hasil-lab-pa', 'Laboratorium\LaboratoriumController@getHasilLabPA');
            Route::get('get-hasil-lab-gdt', 'Laboratorium\LaboratoriumController@getHasilLabGDT');
            Route::get('get-hasil-penyakit-menular', 'Laboratorium\LaboratoriumController@getHasilPenyakitMenular');
            Route::get('get-nomor-surat', 'Laboratorium\LaboratoriumController@getNomorSurat');
            Route::get('get-hasil-bebas-HIV', 'Laboratorium\LaboratoriumController@getHasilBebasHIV');
            Route::get('get-hasil-tidak-hamil', 'Laboratorium\LaboratoriumController@getHasilTidakHamil');
            Route::get('get-hasil-keterangan-medis', 'Laboratorium\LaboratoriumController@getHasilKeteranganMedis');
            Route::get('get-hasil-pemeriksaan-berkala', 'Laboratorium\LaboratoriumController@getHasilPemeriksaanBerkala');
            Route::get('get-hasil-badan-sehat', 'Laboratorium\LaboratoriumController@getHasilBadanSehat');
            Route::get('get-hasil-kesehatan-jiwa', 'Laboratorium\LaboratoriumController@getHasilKesehatanJiwa');
            Route::get('get-hasil-bebas-narkoba', 'Laboratorium\LaboratoriumController@getHasilBebasNarkoba');
            Route::get('get-hasil-bebas-narkoba-v2', 'Laboratorium\LaboratoriumController@getHasilBebasNarkobav2');
            Route::get('get-emr', 'Laboratorium\LaboratoriumController@getemr');
            Route::get('get-riwayat-pemeriksaan-mcu', 'Laboratorium\LaboratoriumController@getRiwayatPemeriksaanMcu');
            Route::get('get-mappinglab', 'Laboratorium\LaboratoriumController@getMapHasillab2');
            Route::get('get-mappinglab2', 'Laboratorium\LaboratoriumController@getMapHasillab2a');
            Route::post('save-hasil-lab-pa', 'Laboratorium\LaboratoriumController@saveHasilLabPA');
            Route::post('save-hasil-lab-gdt', 'Laboratorium\LaboratoriumController@saveHasilLabGDT');
            Route::post('save-hasil-badan-sehat', 'Laboratorium\LaboratoriumController@saveHasilBadanSehat');
            Route::post('save-hasil-keterangan-medis', 'Laboratorium\LaboratoriumController@saveHasilKeteranganMedis');
            Route::post('save-hasil-pemeriksaan-berkala', 'Laboratorium\LaboratoriumController@saveHasilPemeriksaanBerkala');
            Route::post('edit-hasil-badan-sehat', 'Laboratorium\LaboratoriumController@editHasilBadanSehat');
            Route::post('save-hasil-kesehatan-jiwa', 'Laboratorium\LaboratoriumController@saveHasilKesehatanJiwa');
            Route::post('edit-hasil-kesehatan-jiwa', 'Laboratorium\LaboratoriumController@editHasilKesehatanJiwa');
            Route::post('save-hasil-penyakit-menular', 'Laboratorium\LaboratoriumController@saveHasilPenyakitMenular');
            Route::post('edit-hasil-penyakit-menular', 'Laboratorium\LaboratoriumController@editHasilPenyakitMenular');
            Route::post('save-hasil-bebas-HIV', 'Laboratorium\LaboratoriumController@saveHasilBebasHIV');
            Route::post('edit-hasil-bebas-HIV', 'Laboratorium\LaboratoriumController@editHasilBebasHIV');
            Route::post('save-hasil-pemeriksaan-covid', 'Laboratorium\LaboratoriumController@saveHasilPemeriksaanCovid');
            Route::post('save-hasil-pemeriksaan-covid-luar-negeri', 'Laboratorium\LaboratoriumController@saveHasilPemeriksaanCovidLN');
            Route::get('get-hasil-pemeriksaan-covid', 'Laboratorium\LaboratoriumController@getHasilPemeriksaanCovid');
            Route::get('get-hasil-pemeriksaan-covid-luar-negeri', 'Laboratorium\LaboratoriumController@getHasilPemeriksaanCovidLN');
            Route::post('save-hasil-tidak-hamil', 'Laboratorium\LaboratoriumController@saveHasilTidakHamil');
            Route::post('edit-hasil-tidak-hamil', 'Laboratorium\LaboratoriumController@editHasilTidakHamil');
            Route::post('save-hasil-bebas-narkoba', 'Laboratorium\LaboratoriumController@saveHasilBebasNarkoba');
            Route::post('edit-hasil-bebas-narkoba', 'Laboratorium\LaboratoriumController@editHasilBebasNarkoba');
            Route::post('save-hasil-bebas-narkoba-v2', 'Laboratorium\LaboratoriumController@saveHasilBebasNarkobav2');
            Route::get('get-combo-diagnosa', 'Laboratorium\LaboratoriumController@getComboDiagnosa');
            Route::post('save-update-nilainormal', 'Laboratorium\LaboratoriumController@saveUpdateNilaiNormal');
            Route::post('save-detail-jenis', 'Laboratorium\LaboratoriumController@saveDetailJenis');
            Route::post('save-satuan', 'Laboratorium\LaboratoriumController@saveSatuanHasil');
            Route::post('save-nilai-normal', 'Laboratorium\LaboratoriumController@saveNilaiNormal');
            Route::post('save-map-hasil-lab', 'Laboratorium\LaboratoriumController@saveMapHasilLab');
            Route::post('delete-hasil-lab', 'Laboratorium\LaboratoriumController@deleteMapHasilLab');
            Route::post('save-update-map-hasil-lab', 'Laboratorium\LaboratoriumController@saveUpdateMapHasilLabVB');
            Route::post('hapus-map-hasil-lab', 'Laboratorium\LaboratoriumController@hapusMapHasilLab');
            Route::post('update-produk', 'Laboratorium\LaboratoriumController@updateProduk');
            Route::post('save-hasil-lab-manual', 'Laboratorium\LaboratoriumController@saveHasilLabManual');
            Route::post('save-map-hasil-lab-bantu', 'Laboratorium\LaboratoriumController@saveMapHasilLabVB');
            Route::post('save-apd-darah', 'Laboratorium\LaboratoriumController@saveAntrianPasienDarah');
            Route::post('save-update-nilainormal', 'Laboratorium\LaboratoriumController@saveUpdateNilaiNormal');
            Route::post('save-map-hasil-labmap2', 'Laboratorium\LaboratoriumController@saveMapHasilLab2');
            Route::post('delete-map-hasil-labmap2', 'Laboratorium\LaboratoriumController@deleteMapHasilLab2');

            // updatean
            Route::post('update-tgl-pengambilan-hasil-lab', 'Laboratorium\LaboratoriumController@updateTanggalPengambilanHasilLab');
            Route::get('get-tanggal-pengambilan', 'Laboratorium\LaboratoriumController@getTanggalPengambilan');





            // dashboard
            Route::get('get-all-permintaan-operasi-jkn3', 'Laboratorium\LaboratoriumController@getAllPermintaanOperasiJkn3');
            Route::get('get-all-permintaan-operasi-jkn3detail', 'Laboratorium\LaboratoriumController@getAllPermintaanOperasidetail');
            Route::get('get-all-permintaan-operasi-jkn4', 'Laboratorium\LaboratoriumController@getAllPermintaanOperasiJkn4');
            Route::get('get-all-permintaan-operasi-jkn5', 'Laboratorium\LaboratoriumController@getAllPermintaanOperasiJkn5');
            Route::post('save-jadwal-operasi', 'Laboratorium\LaboratoriumController@saveJadwalOperasi');
            Route::post('save-jadwal-operasi-gabung', 'Laboratorium\LaboratoriumController@saveJadwalOperasiGabung');
            Route::post('unverif-jadwal-operasi', 'Laboratorium\LaboratoriumController@unVerif');
            Route::post('delete-jadwal-operasi', 'Laboratorium\LaboratoriumController@delete');

            Route::post('hapus-jadwal-operasi', 'Laboratorium\LaboratoriumController@hapusJadwalOperasi');
            Route::post('update-jadwal-operasi', 'Laboratorium\LaboratoriumController@updateJadwalOperasi');
            Route::get('poli-bpjs', 'Laboratorium\LaboratoriumController@getPoliBpjs');
            Route::get('get-data-nilai-kritis', 'Laboratorium\LaboratoriumController@getNilaiKritis');
            Route::post('save-nilai-kritis', 'Laboratorium\LaboratoriumController@saveNilaiKritis');
            Route::post('delete-nilai-kritis', 'Laboratorium\LaboratoriumController@deleteNilaiKritis');
            Route::get('get-data-nilai-kritis', 'Laboratorium\LaboratoriumController@getNilaiKritis');
            Route::post('save-nilai-kritis', 'Laboratorium\LaboratoriumController@saveNilaiKritis');
            Route::post('delete-nilai-kritis', 'Laboratorium\LaboratoriumController@deleteNilaiKritis');
        });


        Route::get('report/cetak-semua-inacbg-newtes', 'Report\ReportController@TescetakSemuaInaCbg');
        Route::get('report/cetak-semua-inacbg-newtes-donwload', 'Report\ReportController@TescetakSemuaInaCbgDonwload');
        Route::get('report/cetak-ekspertise', 'Report\ReportController@cetakEkspertise');
        Route::get('report/cetak-ekspertise-kemkes', 'Report\ReportController@cetakEkspertiseKemkes');
        Route::get('report/cetak-hasil-lab-histopatologi', 'Report\ReportController@cetakHispatologi');
        Route::get('report/cetak-ekspertise-kemkes-2', 'Report\ReportController@cetakEkspertiseKemkes2');
        Route::get('report/cetak-badan-sehat', 'Report\ReportController@cetakBadanSehat');
        Route::get('report/cetak-bebas-narkoba', 'Report\ReportController@cetakBebasNarkoba');
        Route::get('report/cetak-kesehatan-jiwa', 'Report\ReportController@cetakKesehatanJiwa');
        Route::get('report/cetak-pemeriksaan-covid', 'Report\ReportController@cetakPemeriksaanCovid');
        Route::get('report/cetak-pemeriksaan-covid-ln', 'Report\ReportController@cetakPemeriksaanCovidLn');
        Route::get('report/cetak-bebas-narkobav2', 'Report\ReportController@cetakBebasNarkobav2');
        Route::get('report/cetak-bebas-penyakit-menular', 'Report\ReportController@cetakBebasPenyakitMenular');
        Route::get('report/cetak-bebas-HIV', 'Report\ReportController@cetakBebasHIV');
        Route::get('report/cetak-hasil-tidak-hamil', 'Report\ReportController@cetakHasilTidakHamil');
        Route::get('report/cetak-forensik', 'Report\ReportController@cetakForensik');
        Route::get('report/cetak-gambar-forensik', 'Report\ReportController@cetakGambarForensik');
        Route::get('report/cetak-lab', 'Report\ReportController@cetakLab');
        Route::get('report/cetak-kematian', 'Report\ReportController@cetakKematian');
        Route::get('report/cetak-dokter', 'Report\ReportController@cetakDokter');
        Route::get('report/cetak-doktermenerangkan', 'Report\ReportController@doktermenerangkan');
        Route::get('report/cetak-dokterdiagnosis', 'Report\ReportController@dokterdiagnosis');
        Route::get('report/cetak-pasien', 'Report\ReportController@cetakPasien');
        Route::get('report/cetak-kll-visum', 'Report\ReportController@cetakKllVisum');
        Route::get('report/cetak-kll-visum-koreksi-ii', 'Report\ReportController@cetakKllVisumKoreksiII');
        Route::get('report/cetak-kll-visum-koreksi-spesialis', 'Report\ReportController@cetakKllVisumKoreksiSpesialis');
        Route::get('report/cetak-visum', 'Report\ReportController@cetakKllVisum2');
        Route::get('report/cetak-kfd-visum', 'Report\ReportController@cetakKfdVisum');
        Route::get('report/cetak-kfd-visum-koreksi-ii', 'Report\ReportController@cetakKfdVisumKoreksiII');
        Route::get('report/cetak-kfd-visum-koreksi-spesialis', 'Report\ReportController@cetakKfdVisumKoreksiSpesialis');
        Route::get('report/cetak-visum-kfd', 'Report\ReportController@cetakKfdVisum2');
        Route::get('report/cetak-ksd-visum', 'Report\ReportController@cetakKsdVisum');
        Route::get('report/cetak-ksd-visum-koreksi-ii', 'Report\ReportController@cetakKsdVisumKoreksiII');
        Route::get('report/cetak-ksd-visum-koreksi-spesialis', 'Report\ReportController@cetakKsdVisumKoreksiSpesialis');
        Route::get('report/cetak-visum-ksd', 'Report\ReportController@cetakKsdVisum2');
        Route::get('report/cetak-ksd-visum-koreksi-instalasi', 'Report\ReportController@cetakKsdVisumKoreksiInstalasi');
        Route::get('report/cetak-kfd-visum-koreksi-instalasi', 'Report\ReportController@cetakKfdVisumKoreksiInstalasi');
        Route::get('report/cetak-kll-visum-koreksi-instalasi', 'Report\ReportController@cetakKllVisumKoreksiInstalasi');
        Route::get('report/cetak-antrian', 'Report\ReportController@cetakAntrianKiosk');
        Route::get('report/cetak-sep', 'Report\ReportController@cetakSEP');
        Route::get('report/cetak-ttd-new', 'Report\ReportController@cetakTtd');
        Route::get('report/cetak-ttd-anestesi', 'Report\ReportController@cetakTTDAnestesi');
        Route::get('report/cetak-ttd-fleksibel', 'Report\ReportController@cetakTtdFleksibel');
        Route::get('report/cetak-laporan-triase', 'Report\ReportController@cetakLaporanTriase');

        Route::get('report/cetak-bukti-pendaftaran', 'Report\ReportController@cetakBuktiPendaftaran');
        Route::get('report/cetak-visum-new', 'Report\ReportController@cetakVisumNew');
        Route::get('report/cetak-ttd-anestesi-lokal', 'Report\ReportController@cetakTTDAnestesiLokal');
        Route::get('report/cetak-ttd-anestesi-lokal-2', 'Report\ReportController@cetakTTDAnestesiLokal2');

        Route::group(['prefix' => 'laundry'], function () {
            //Route::get('get-combo-logistik','Laundry\LaundryController@getComboLaundry');
            Route::get('get-combo-laundry', 'Laundry\LaundryController@getComboLaundry');
            Route::get('get-daftar-kirim-laundry', 'Laundry\LaundryController@getDaftarKirimLaundry');
            Route::get('get-detail-kirim-laundry-ruangan', 'Laundry\LaundryController@getDetailKirimLaundry');
            Route::get('get-daftar-order-laundry-ruangan', 'Laundry\LaundryController@getDaftarOrderLaundry');
            Route::get('get-detail-order-laundry-ruangan', 'Laundry\LaundryController@getDetailOrderLaundry');
            Route::get('get-detail-order-for-kirim-laundry', 'Laundry\LaundryController@getDetailOrderLaundryForKirim');
            Route::get('get-daftar-barang-batal-laundry', 'Laundry\LaundryController@getDaftarProdukToBatalLaundry');
            Route::get('get-daftar-cuci-laundry', 'Laundry\LaundryController@getDaftartCuciLaundry');
            Route::get('get-stok-ruangan-linen', 'Laundry\LaundryController@getDataStokRuanganDetailLaundry');
            Route::get('get-detail-registrasi-linen', 'Laundry\LaundryController@getDetailRegistrasiLinen');
            Route::get('get-produkdetail', 'Laundry\LaundryController@getProdukDetailLaundry');
            Route::get('get-data-laporan-penerimaan-linen', 'Laundry\LaundryController@getDataLaporanPenerimaanLinen');
            Route::get('get-data-laporan-distribusi-linen', 'Laundry\LaundryController@getDataLaporanDistribusiLinen');
            Route::get('get-data-laporan-pencucian-linen', 'Laundry\LaundryController@getDataLaporanPencucianLinen');

            Route::post('save-kirim-linen-ruangan', 'Laundry\LaundryController@saveKirimLinen');
            Route::post('save-batal-terima', 'Laundry\LaundryController@saveBatalKirim');
            Route::post('save-order-laundry-ruangan', 'Laundry\LaundryController@saveOrderLaundry');
            Route::post('save-batal-order', 'Laundry\LaundryController@saveBatalOrder');
            Route::post('delete-order-laundry-ruangan', 'Laundry\LaundryController@deleteOrderLaundry');
            Route::post('save-terima-laundry', 'Laundry\LaundryController@saveTerimaLaundry');
            Route::post('cek-terima-laundry', 'Laundry\LaundryController@CekProdukKirimLaundry');
            Route::post('batal-kirim-terima-laundry', 'Laundry\LaundryController@BatalKirimTerimaLaundry');
            Route::post('save-pencucian-linen', 'Laundry\LaundryController@saveCuciLinen');
            Route::post('save-registrasi-linen', 'Laundry\LaundryController@saveRegistrasiLinen');
        });
        Route::group(['prefix' => 'logistik'], function () {
            // GET //
            Route::get('get-combo-logistik', 'Logistik\LogistikController@getComboLogistik');
            Route::get('get-combo-logistik-select', 'Logistik\LogistikController@getComboLogistikSelect');
            Route::get('get-no-spk', 'Logistik\LogistikController@getNospk');
            Route::get('get-stok-ruangan-detail', 'Logistik\LogistikController@getDataStokRuanganDetail');
            Route::get('get-stok-ruangan-detailmaster', 'Logistik\LogistikController@getDataStokRuanganDetailmaster');
            Route::get('get-stok-ruangan-kadaluarsa', 'Logistik\LogistikController@getDataStokRuanganKadaluarsa');
            Route::get('get-stok-ruangan-detail-akhir', 'Logistik\LogistikController@getDataStokRuanganDetailakhir');
            Route::get('get-combo-barang-logistik', 'Logistik\LogistikController@getDataProdukLogistik');
            Route::get('get-combo-barang-logistik2', 'Logistik\LogistikController@getDataProdukLogistik2');
            Route::get('get-data-produk-detail', 'Logistik\LogistikController@getDataProdukDetail');
            Route::get('get-data-produk-detailall', 'Logistik\LogistikController@getDataProdukDetailall');
            Route::get('get-combo-pegawai-logistik', 'Logistik\LogistikController@getDataPegawaiPart');
            Route::get('get-combo-rekanan-logistik', 'Logistik\LogistikController@getDataRekananPart');
            Route::get('get-combo-detail-jenis-logistik', 'Logistik\LogistikController@getdetailjenisproduk');
            Route::get('get-data-kartu-stok', 'Logistik\LogistikController@GetDataKartuStok');
            Route::get('get-fast-moving', 'Logistik\LogistikController@getFastMoving');
            Route::get('get-slow-moving', 'Logistik\LogistikController@getSlowMoving');
            Route::get('get-stok-ruangan-so', 'Logistik\LogistikController@getStokRuanganSO');
            Route::get('get-stok-ruangan-soharga', 'Logistik\LogistikController@getStokRuanganSOharga');
            Route::get('get-data-monitoring-usulan', 'Logistik\LogistikController@getDaftarMonitoringUsulan');
            Route::get('get-daftar-usulan-permintaan-barang-ruangan', 'Logistik\LogistikController@getDaftarUsulanPermintaan');
            Route::get('get-daftar-rencana-usulan-permintaan-barang-ruangan', 'Logistik\LogistikController@getDaftarRencanaUsulanPermintaan');
            Route::get('get-nomor-usulan', 'Logistik\LogistikController@getNoUsulan');
            Route::get('get-data-detail-rencana-usulan-ajukan', 'Logistik\LogistikController@getDetailDataRencanaUsulan');
            Route::get('get-data-detail-rencana-usulan', 'Logistik\LogistikController@getDetailRUPB');
            Route::get('get-data-detail-usulan', 'Logistik\LogistikController@getDataDetailUsulanPermintaanBarangRuangan');
            Route::get('get-data-harga', 'Logistik\LogistikController@getHargaTerakhir');
            Route::get('get-daftar-permintaaan-barang-ruangan', 'Logistik\LogistikController@getDaftarPermintaanBarangRuangan');
            Route::get('get-daftar-sppb', 'Logistik\LogistikController@getDaftarSPPB');
            Route::get('get-detail-sppb', 'Logistik\LogistikController@getDetailDataSPPB');
            Route::get('get-detail-rekanan', 'Logistik\LogistikController@getDataDetailRekanan');
            Route::get('get-nomor-sppb', 'Logistik\LogistikController@getNomorSPPB');
            Route::get('get-nomor-terima', 'Logistik\LogistikController@getNoTerimaGenerate');
            Route::get('get-nomor-terima-residu', 'Logistik\LogistikController@getNoTerimaGenerateResidu');
            Route::get('get-nomor-terima-matlog', 'Logistik\LogistikController@getNoTerimaGenerateMatlog');
            Route::get('get-detail-penerimaan', 'Logistik\LogistikController@getDetailPenerimaanBarang');
            Route::get('get-detail-spk', 'Logistik\LogistikController@getDetailDataSPk');
            Route::get('get-detail-sppb-peritem', 'Logistik\LogistikController@getDetailSPPBPerItem');
            Route::get('get-data-detail-sppb', 'Logistik\LogistikController@getDaftarSPPBDetail');
            Route::get('get-daftar-spk', 'Logistik\LogistikController@getDaftarSPK');
            Route::get('get-data-spkkeupk', 'Logistik\LogistikController@getDaftarUPKKeSPK');
            Route::get('get-daftar-penerimaan', 'Logistik\LogistikController@getDaftarPenerimaanSuplier');
            Route::get('get-daftar-penerimaan-matlog', 'Logistik\LogistikController@getDaftarPenerimaanSuplierMatlog');
            Route::get('get-daftar-penerimaan-residu', 'Logistik\LogistikController@getDaftarPenerimaanResidu');
            Route::get('get-daftar-penerimaan-perunit', 'Logistik\LogistikController@getDaftarPenerimaanSuplierPerUnit');
            Route::get('get-daftar-pemakaian-ruangan', 'Logistik\LogistikController@getDaftarPemakaianStokRuangan');
            Route::get('get-detail-pemakaian-ruangan', 'Logistik\LogistikController@getPemakaianStokRuanganByNorec');
            Route::get('get-detail-order-barang-ruangan', 'Logistik\LogistikController@getDetailOrderBarang');
            Route::get('get-produkdetail', 'Logistik\LogistikController@getProdukDetail');
            Route::get('get-data-order-barang-ruangan', 'Logistik\LogistikController@getDaftarOrderBarang');
            Route::get('get-detail-kirim-barang-ruangan', 'Logistik\LogistikController@getDetailKirimBarang');
            Route::get('get-detail-order-for-kirim-barang', 'Logistik\LogistikController@getDetailOrderBarangForKirim');
            Route::get('get-daftar-penerimaan-barang-perunit', 'Logistik\LogistikController@getDaftarPenerimaanBarangPerUnit');
            // @all
            Route::get('get-laporan-distribusi-barang', 'Logistik\LogistikController@getLaporanDistribusi');
            Route::get('get-laporan-distribusi-barang', 'Logistik\LogistikController@getLaporanDistribusi');
            Route::get('get-laporan-distribusi-barang-total', 'Logistik\LogistikController@getLaporanDistribusiTotal');
            Route::get('get-laporan-rekap-penerimaan-suplier', 'Logistik\LogistikController@getRekapLaporanPenerimaanSuplier');
            Route::get('get-laporan-rekap-bukti-penerimaan', 'Logistik\LogistikController@getRekapBuktiPenerimaanPembalianBelumTf');
            Route::get('get-daftar-distribusi-barang', 'Logistik\LogistikController@getDaftarDistribusiBarang');
            Route::get('get-daftar-barang-batal', 'Logistik\LogistikController@getDaftarProdukToBatal');
            Route::get('get-daftar-distribusi-barang-perunit', 'Logistik\LogistikController@getDaftarDistribusiBarangPerUnit');
            Route::get('get-daftar-mutasi-barang-expired', 'Logistik\LogistikController@getDaftarMutasiBarangKadaluarsa');
            Route::get('get-daftar-amprahan-hpp', 'Logistik\LogistikController@getDaftarAmprahanHpp');
            Route::get('get-barang-for-regis', 'Logistik\LogistikController@getDetailBarang');
            Route::get('get-detail-registrasiasset', 'Logistik\LogistikController@getDetailBarangRegisterAset');
            Route::get('get-daftar-asset', 'Logistik\LogistikController@getDataBarangRegisterAset');
            Route::get('get-data-produkforkirim', 'Logistik\LogistikController@getDataProdukKirim');
            Route::get('get-nomor-asset', 'Logistik\LogistikController@getNoAsset');
            Route::get('get-data-detail-asset', 'Logistik\LogistikControllerr@getProdukDetailAsset');
            Route::get('get-daftar-retur-distribusi-ruangan', 'Logistik\LogistikController@getDaftarReturDistribusiBarang');
            Route::get('get-daftar-retur-penerimaan', 'Logistik\LogistikController@getDaftarReturPenerimaanSuplier');
            Route::get('get-nomor-faktur', 'Logistik\LogistikController@getNoFaktur');
            Route::get('get-nomor-struk', 'Logistik\LogistikController@getNoTerima');
            Route::get('get-data-to-retur', 'Logistik\LogistikController@getDaftarProdukToReturPenerimaan');
            Route::get('get-daftar-stock-flow', 'Logistik\LogistikController@getDaftarStockFlowDetailRev1');
            Route::get('get-daftar-stock-flowperhari', 'Logistik\LogistikController@getDaftarStockFlowDetailRev1perhari');
            Route::get('get-daftar-stock-flowperhariget', 'Logistik\LogistikController@getDaftarStockFlowDetailRev1perhariget');
            Route::get('get-daftar-stock-getbarangharam', 'Logistik\LogistikController@getbarangharam');
            Route::get('get-daftar-stock-flow-perharga', 'Logistik\LogistikController@getDaftarStockFlowDetailRev1perharga');
            //            Route::get('get-daftar-stock-flow', 'Logistik\LogistikController@getDaftarStockFlowDetailRev2');
            Route::get('get-daftar-produkkadaluarsa', 'Logistik\LogistikController@getDataComboKadaluarsa');
            Route::get('get-daftar-barang-kadaluarsa', 'Logistik\LogistikController@getBarangKadaluarsa');
            Route::get('get-daftar-retur-penerimaan-detail', 'Logistik\LogistikController@getDaftarReturPenerimaanSuplierDetail');
            Route::get('get-daftar-so', 'Logistik\LogistikController@getDaftarStokRuanganSO');
            Route::get('get-daftar-so-detail', 'Logistik\LogistikController@getDaftarStokRuanganSODetail');
            Route::get('get-daftar-combo-anggaran', 'Logistik\LogistikController@getDataComboMataAnggaran');
            Route::get('get-stok-minimum_global', 'Logistik\LogistikController@getStokMinimumGlobal');
            Route::get('get-combo-rekanan-logistik', 'Logistik\LogistikController@getDataRekananLogistik');
            Route::get('get-produk-by-ruangans', 'Logistik\LogistikController@getProdukByRuangan');
            Route::get('get-data-stock-flow', 'Logistik\LogistikController@getDataComboStockFlow');
            Route::get('get-neraca-persediaan', 'Logistik\NeracaPersediaanController@Neraca');
            Route::get('get-daftar-produk-by-kodebmn', 'Logistik\LogistikController@getDaftarProduk');
            Route::get('get-daftar-distribusi-barang-aset', 'Logistik\LogistikController@getDataDistribusiBarangAset');
            Route::get('get-laporanobattap', 'Logistik\LogistikController@getLaporanObatTap');
            Route::get('get-combo-nofaktur', 'Logistik\LogistikController@getNofakturvalidasi');
            Route::get('get-combo-totalfaktur', 'Logistik\LogistikController@getTotalfakturvalidasi');
            Route::get('get-daftar-tukarfaktur', 'Logistik\LogistikController@getDaftarTukarFaktur');
            Route::get('get-daftar-pengajuanfaktur', 'Logistik\LogistikController@getPengajuanFaktur');
            Route::get('totalperencanaan', 'Logistik\LogistikController@gettotalperencanaan');

            // GET //

            // POST //
            Route::post('save-validasi-faktur', 'Logistik\LogistikController@saveverifikasifaktur');
            Route::post('save-unvalidasi-faktur', 'Logistik\LogistikController@saveunverifikasifaktur');
            Route::post('save-tukfarfaktur', 'Logistik\LogistikController@simpantukarfaktur');
            Route::post('hapus-tukfarfaktur', 'Logistik\LogistikController@hapustukarfaktur');
            Route::post('save-verifikasipengajuanfaktur', 'Logistik\LogistikController@simpanpengajuantukarfaktur');
            Route::post('save-unverifikasipengajuanfaktur', 'Logistik\LogistikController@hapuspengajuantukarfaktur');
            Route::post('save-ubah-total', 'Logistik\LogistikController@simpanubahtotal');

            Route::post('get-stok-ruangan-so-from-file', 'Logistik\LogistikController@getStokRuanganSOFromFile');
            Route::post('get-stok-ruangan-so-from-fileexcel', 'Logistik\LogistikController@getStokRuanganSOFromFileExcel');
            Route::post('delete-terima-barang-suplier', 'Logistik\LogistikController@DeletePenerimaanSuplier');
            Route::post('delete-data-usulan-ruangan', 'Logistik\LogistikController@saveBatalUsulanPermintaanBarang');
            Route::post('delete-data-rencana-usulan-ruangan', 'Logistik\LogistikController@hapusDataRUPB');
            Route::post('save-data-rencana-usulan', 'Logistik\LogistikController@saveRencanaUsulanPermintaanNew');
            Route::post('save-verifikasi-direktur-keuangan', 'Logistik\LogistikController@saveVerifikasiDK');
            Route::post('save-verifikasi-pengelola-urusan', 'Logistik\LogistikController@saveVerifikasiPengelolaUrusan');
            Route::post('save-verifikasi-kepala-instalasi', 'Logistik\LogistikController@saveVerifikasiKepalaInstalasi');
            Route::post('save-data-usulan-permintaan-barang-ruangan', 'Logistik\LogistikController@saveUsulanPermintaan');
            Route::post('save-perbaiki-kartu-stok', 'Logistik\LogistikController@savePerbaikiKartuStok');
            Route::post('save-edit-stok', 'Logistik\LogistikController@saveEditStok');
            Route::post('save-updatedosis', 'Logistik\LogistikController@updatedosis');
            Route::post('save-updateudd', 'Logistik\LogistikController@updateudd');
            Route::post('save-updateketerangan', 'Logistik\LogistikController@updateketerangan');

            Route::post('save-data-sppb', 'Logistik\LogistikController@SaveSPPB');
            Route::post('save-data-penerimaan', 'Logistik\LogistikController@saveTerimaBarangSuplier');
            Route::post('save-data-penerimaan-residu', 'Logistik\LogistikController@saveTerimaBarangResidu');
            Route::post('update-data-penerimaan', 'Logistik\LogistikController@updateTerimaBarangSuplier');
            // all
            Route::post('update-data-penerimaan-all', 'Logistik\LogistikController@updateStrukPisah');
            Route::post('save-data-penerimaan-revisi', 'Logistik\LogistikController@saveTerimaBarangSuplieRepisi');
            // 
            Route::post('save-ubah-status-spk', 'Logistik\LogistikController@UpdateStatusUPK');
            Route::post('delete-data-spk', 'Logistik\LogistikController@DeleteSPK');
            Route::post('save-data-spk', 'Logistik\LogistikController@SaveSPK');
            Route::post('delete-data-penerimaan', 'Logistik\LogistikController@DeletePenerimaanBarangSupplier');
            Route::post('delete-data-penerimaan-residu', 'Logistik\LogistikController@DeletePenerimaanBarangSupplierResidu');
            Route::post('delete-pemakaian-ruangan', 'Logistik\LogistikController@hapusPemakaianStokRuangan');
            Route::post('save-pemakaian-ruangan', 'Logistik\LogistikController@savePemakaianStokRuangan');
            Route::post('save-order-barang-ruangan', 'Logistik\LogistikController@saveOrderBarang');
            Route::post('delete-order-barang-ruangan', 'Logistik\LogistikController@saveBatalOrderBarang');
            Route::post('save-kirim-barang-ruangan', 'Logistik\LogistikController@saveKirimBarangRuangan');
            Route::post('cek-kirim-barang-ruangan', 'Logistik\LogistikController@CekProdukKirim');
            Route::post('batal-kirim-terima-barang', 'Logistik\LogistikController@BatalKirimTerima');
            Route::post('batal-kirim-terima-barang-peritem', 'Logistik\LogistikController@BatalKirimTerimaPerItem');
            Route::post('simpan-detail-regisaset', 'Logistik\LogistikController@SimpanDetailRegisterAset');
            Route::post('simpan-penyusutan-aset', 'Logistik\LogistikController@SimpanPenyusutanAset');
            Route::post('simpan-delete-penyusutan-aset', 'Logistik\LogistikController@SimpanDeletePenyusutanAset');
            Route::post('simpan-kirimbarang-aset', 'Logistik\LogistikController@saveKirimBarangAsset');
            Route::post('retur-distribusi-barang-ruangan', 'Logistik\LogistikController@SaveReturDistribusi');
            Route::post('retur-penerimaan-barang-supplier', 'Logistik\LogistikController@SaveReturPenerimaan');
            Route::post('save-closing-persediaan', 'Logistik\LogistikController@SaveClosingPersediaan');
            Route::post('save-barang-kadaluarsa', 'Logistik\LogistikController@saveBarangKadaluarsa');
            Route::post('save-data-stock-opname', 'Logistik\LogistikController@saveStockOpname');
            Route::post('save-data-stock-opnameharga', 'Logistik\LogistikController@saveStockOpnameharga');
            Route::post('delete-barang-kadaluarsa', 'Logistik\LogistikController@DeleteBarangKadaluarsa');
            Route::post('save-data-verifikasi', 'Logistik\LogistikController@saveVerifikasiAnggaran');
            Route::get('get-data-penyusutan-asset', 'Logistik\LogistikController@getDataPenyusutan');
            Route::get('get-daftar-history-pindah-asset', 'Logistik\LogistikController@getDaftarHistoryAsset');
            Route::post('update-tglkadaluarsa-spd', 'Logistik\LogistikController@updateBarangKadaluarsa');
            Route::post('save-harga-produk', 'Logistik\LogistikController@saveHargaProduk');
            Route::post('save-adjusment-stok', 'Logistik\LogistikController@saveAdjustmentStok');
            Route::post('save-adjusment-stok2', 'Logistik\LogistikController@saveAdjustmentStok2');
            Route::post('save-adjusment-stok3', 'Logistik\LogistikController@saveAdjustmentStok3');
            Route::post('update-hapus-tglkadaluarsa-spd', 'Logistik\LogistikController@updateTglBarangKadaluarsa');
            Route::get('get-daftar-stock-flowcekstok', 'Logistik\LogistikController@getDaftarStockFlowDetailRev1cekstok');
            Route::get('get-daftar-stock-flowcekstok2', 'Logistik\LogistikController@getDaftarStockFlowDetailRev1cekstok2');
            Route::post('save-perbaiki-kartu-stok2', 'Logistik\LogistikController@savePerbaikiKartuStoksaldonoterima');
            Route::post('save-perbaiki-kartu-stok3', 'Logistik\LogistikController@savePerbaikiKartuStoksaldonoterima2');
            Route::post('tanggal-closing', 'Logistik\LogistikController@tanggalclosing');
            Route::post('save-updateharga', 'Logistik\LogistikController@saveUpdateHarga');

            Route::post('save-pelayananobattap', 'Logistik\LogistikController@SimpanPelayananObatTap');
            Route::get('get-produkdetailtap', 'Logistik\LogistikController@getProdukDetailTap');
            Route::get('get-cekstok', 'Logistik\LogistikController@cekstok');
            Route::get('get-cekstok1', 'Logistik\LogistikController@cekstok1');
            Route::get('get-cekstok2', 'Logistik\LogistikController@cekstok2');
            Route::get('get-cekstokaja', 'Logistik\LogistikController@cekstokaja');
            Route::get('get-produkdetail', 'Logistik\LogistikController@getProdukDetail');
            Route::post('cekstoksebelumsimpan', 'Logistik\LogistikController@cekstoksebelumsimpan');
            // POST //
        });
        Route::group(['prefix' => 'asset'], function () {
            Route::post('save-data-jadwal-kalibrasi', 'Asset\AssetController@SaveDataJadwalAssetKalibrasi');
            Route::post('save-data-jadwal-pemeliharaan', 'Asset\AssetController@SaveDataJadwalAssetPemeliharaan');
            Route::get('get-data-jadwal-kalibrasi', 'Asset\AssetController@getDaftarKalibrasi');
            Route::get('get-data-jadwal-pemeliharaan', 'Asset\AssetController@getDaftarPemeliharaan');
            Route::get('get-jadwal-kalibrasi', 'Asset\AssetController@getJadwalKalibrasi');
            Route::get('get-jadwal-pemeliharaan', 'Asset\AssetController@getJadwalPemeliharaan');
            Route::get('get-produk-asset-part', 'Asset\AssetController@getDataProduk');
        });
        Route::group(['prefix' => 'microservice'], function () {
            Route::get('get-notiforder', 'MicroService\MicroServiceController@getOrderNotif');
            Route::get('get-listnotif', 'MicroService\MicroServiceController@getListNotif');
            Route::post('updatenotif', 'MicroService\MicroServiceController@updatenotif');
            Route::post('savenotif', 'MicroService\MicroServiceController@savenotif');
            Route::post('delete-notif', 'MicroService\MicroServiceController@deleteNotif');
            Route::get('get-notif-los', 'MicroService\MicroServiceController@getNotifLOS');
            Route::get('get-notif-tarif', 'MicroService\MicroServiceController@getNotifTarif');
            Route::post('delete-notif-tarif', 'MicroService\MicroServiceController@deleteNotifTarif');
            Route::group(['prefix' => 'pendaftaran'], function () {
                /*GET*/
                Route::get('get-bukti-pendaftaran', 'MicroService\MicroServiceController@GetBuktiPendaftaran');
                /*END GET*/
            });
        });
        Route::group(['prefix' => 'perawatanintensive'], function () {});
        Route::group(['prefix' => 'perencanaan'], function () {
            Route::get('get-data-realisasi', 'Perencanaan\PerencanaanController@getDataRealisasi');
            Route::get('get-data-combo', 'Perencanaan\PerencanaanController@getDataCombo');
            Route::get('get-kel-keempat-part', 'Perencanaan\PerencanaanController@getKelAnggaranKeempat');
            Route::get('get-kel-ketiga-part', 'Perencanaan\PerencanaanController@getKelAnggaranKeTiga');
            Route::get('get-kel-kedua-part', 'Perencanaan\PerencanaanController@getKelAnggaranKedua');
            Route::get('get-child-bynorec', 'Perencanaan\PerencanaanController@getChildByNorec');
            Route::get('get-child-byNoName', 'Perencanaan\PerencanaanController@getChildByNoName');
            Route::get('get-daftar-mataanggaran', 'Perencanaan\PerencanaanController@getDaftarMataAnggaran');
            Route::get('get-daftar-mataanggaran-new', 'Perencanaan\PerencanaanController@getDaftarMataAnggaranNew');
            Route::get('get-daftar-mataanggaran-new-blud', 'Perencanaan\PerencanaanController@getDaftarMataAnggaranNewBLUD');
            Route::get('get-daftar-monitoring-mataanggaran', 'Perencanaan\PerencanaanController@getDaftarMonitoringAnggaran');
            Route::get('get-daftar-riwayat-realisasi', 'Perencanaan\PerencanaanController@getDaftarRiwayatRealisasi');
            Route::get('get-daftar-usulan-anggaran', 'Perencanaan\PerencanaanController@getDaftarUsulanAnggaran');
            Route::get('get-daftar-mataanggaran-upk', 'Perencanaan\PerencanaanController@getDaftarMataAnggaranForUpk');
            Route::get('get-kel-kelima-part', 'Perencanaan\PerencanaanController@getKelAnggaranKelima');
            Route::get('get-kel-keenam-part', 'Perencanaan\PerencanaanController@getKelAnggaranKeenam');
            Route::get('get-kel-ketujuh-part', 'Perencanaan\PerencanaanController@getKelAnggaranKetujuh');
            Route::get('get-data-combo-satuan', 'Perencanaan\PerencanaanController@getDataComboSatuan');
            Route::get('get-data-combo-by-parent', 'Perencanaan\PerencanaanController@getDataComboKelompokAnggaranByParent');
            Route::get('get-data-combo-by-parent-pertama', 'Perencanaan\PerencanaanController@getDataComboParentKelompokPertama');
            Route::get('get-data-combo-by-parent-kedua', 'Perencanaan\PerencanaanController@getDataComboParentKelompokKedua');
            Route::get('get-data-combo-by-parent-ketiga', 'Perencanaan\PerencanaanController@getDataComboParentKelompokKetiga');
            Route::get('get-data-combo-by-parent-keempat', 'Perencanaan\PerencanaanController@getDataComboParentKelompokKeempat');
            Route::get('get-data-combo-by-parent-kelima', 'Perencanaan\PerencanaanController@getDataComboParentKelompokKelima');
            Route::get('get-data-combo-by-parent-keenam', 'Perencanaan\PerencanaanController@getDataComboParentKelompokKeenam');
            Route::get('get-data-combo-by-parent-ketujuh', 'Perencanaan\PerencanaanController@getDataComboParentKelompokKetujuh');
            Route::get('get-info-mata-anggaran', 'Perencanaan\PerencanaanController@getInfoMataAnggaran');
            Route::get('get-data-combo-satuan-anggaran', 'Perencanaan\PerencanaanController@getDataComboSatuanAnggaran');
            Route::get('get-detail-daftar-mataanggaran-new', 'Perencanaan\PerencanaanController@getDetailDaftarMataAnggaranNew');
            Route::get('get-detail-daftar-mataanggaran-new-detail', 'Perencanaan\PerencanaanController@getDetailDaftarMataAnggaranNewdetail');
            Route::get('get-laporan-realisasi', 'Perencanaan\PerencanaanController@getLaporanRealisasi');
            Route::get('get-cek-turunan-ketujuh', 'Perencanaan\PerencanaanController@getCekTurunanKetujuh');
            Route::get('get-cek-turunan-kedelapan', 'Perencanaan\PerencanaanController@getCekTurunanKedelapan');
            Route::get('get-riwayat-detail-mataanggaran', 'Perencanaan\PerencanaanController@getRiwayatDetailMataAnggaran');
            Route::get('get-realsiasi', 'Perencanaan\PerencanaanController@getRealisasi');
            Route::post('delete-realisasi', 'Perencanaan\PerencanaanController@deleteRealisasi');

            Route::post('save-child', 'Perencanaan\PerencanaanController@saveChild');
            Route::post('delete-child', 'Perencanaan\PerencanaanController@deleteChildAnggaran');
            Route::post('save-kel-head-anggaran', 'Perencanaan\PerencanaanController@saveKelHead');
            Route::post('save-kel-pertama-anggaran', 'Perencanaan\PerencanaanController@saveKelPertama');
            Route::post('save-kel-kedua-anggaran', 'Perencanaan\PerencanaanController@saveKelKedua');
            Route::post('save-kel-ketiga-anggaran', 'Perencanaan\PerencanaanController@saveKelKetiga');
            Route::post('save-kel-keempat-anggaran', 'Perencanaan\PerencanaanController@saveKelKeempat');
            Route::post('delete-kel-head-anggaran', 'Perencanaan\PerencanaanController@deleteKelompokHead');
            Route::post('delete-kel-pertama-anggaran', 'Perencanaan\PerencanaanController@deleteKelompokPertama');
            Route::post('delete-kel-kedua-anggaran', 'Perencanaan\PerencanaanController@deleteKelompokKedua');
            Route::post('delete-kel-ketiga-anggaran', 'Perencanaan\PerencanaanController@deleteKelompokKetiga');
            Route::post('delete-kel-keempat-anggaran', 'Perencanaan\PerencanaanController@deleteKelompokKeempat');

            Route::post('delete-kel-anggaran', 'Perencanaan\PerencanaanController@deleteKelompokAnggaran');
            Route::post('save-kel-anggaran', 'Perencanaan\PerencanaanController@saveKelompokAnggaran');
            Route::post('save-edit-detail-mataanggaran', 'Perencanaan\PerencanaanController@saveEditDetailMataAnggaran');

            Route::post('save-edit-realisasi', 'Perencanaan\PerencanaanController@saveEditRealisasi');

            Route::get('get-data-kegiatan', 'Perencanaan\PerencanaanController@getDataKegiatan');
            Route::get('get-pegawai-departemen', 'Perencanaan\PerencanaanController@getPegawaiDepartemen');
            Route::post('save-kegiatan-unit', 'Perencanaan\PerencanaanController@saveKegiatanUnit');
            Route::post('delete-kegiatan-unit', 'Perencanaan\PerencanaanController@deleteKegiatanUnit');
        });
        Route::group(['prefix' => 'piutang'], function () {
            /*GET*/
            Route::get('get-data-combo-piutang', 'Piutang\PiutangController@getDataComboPiutang');
            Route::get('daftar-piutang-layanan', 'Piutang\PiutangController@daftarPiutang');
            Route::get('daftar-collected-piutang-layanan', 'Piutang\PiutangController@daftarCollectedPiutang');
            Route::get('collected-piutang-layanan/{noposting}', 'Piutang\PiutangController@collectedPiutang');
            Route::get('collecting-from-txt-inacbgs', 'Piutang\PiutangController@CollectingFromTxtInaCbgs');
            Route::get('batal-collected-piutang-layanan', 'Piutang\PiutangController@batalCollectingPiutang');
            Route::get('detail-piutang-pasien-collect/{noPosting}', 'Piutang\PiutangController@detailPiutangPasienCollecting');
            Route::get('get-daftar-kartupiutang', 'Piutang\PiutangController@daftarKartuPiutang');
            Route::get('daftar-pembayaran-piutang-perusahaan-periode', 'Piutang\PiutangController@daftarPembayaranPiutangPeriode');
            Route::get('get-data-histori-piutang', 'Piutang\PiutangController@getDaftarHistoriPiutang');
            Route::get('rekap-klaim-by-diagnosa/', 'Piutang\PiutangController@RekapKlainDiagnosaTXT');
            Route::get('get-checklist-klaim', 'Piutang\PiutangController@getChecklistKlaim');
            Route::get('get-data-grid-jurnal', 'Piutang\PiutangController@gridJurnal');
            /*END GET*/

            /*POST*/
            Route::post('collecting-piutang-layanan', 'Piutang\PiutangController@collectingPiutang');
            Route::post('collecting-piutang-layanan-jurnal', 'Piutang\PiutangController@collectingPiutangJurnal');
            Route::post('save-bpjs-klaim-gagal-hitung', 'Piutang\PiutangController@simpanGagalHitungBpjsKlaim');
            Route::post('save-bpjs-klaim', 'Piutang\PiutangController@simpanBpjsKlaim');
            /*END POST*/
        });
        Route::group(['prefix' => 'pmkp'], function () {
            /*GET*/
            Route::get('get-riwayat', 'PMKP\PMKPController@getRiwayat');
            Route::get('get-data-laporan-dokter-pelayanan-poliklinik', 'PMKP\PMKPController@getDataLaporanDokterPelayananPoliklinik');
            Route::get('get-data-laporan-dokter-rawat-inap', 'PMKP\PMKPController@getDataLaporanDokterPelayananRanap');
            Route::get('get-data-combo-pmkp', 'PMKP\PMKPController@getDataCombo');
            Route::get('get-data-laporan-dokter-penanggungjawab-rawat-inap', 'PMKP\PMKPController@getDataLaporanDokterPenanggungJawabRanap');
            Route::get('get-data-laporan-jamvisite-dokter-rawat-inap', 'PMKP\PMKPController@getLaporanJamVisiteDokter');
            Route::get('get-data-laporan-kematian-pasien-ranap', 'PMKP\PMKPController@getLaporanKematianPasienRanap');
            Route::get('get-data-laporan-pasien-pulang-paksa', 'PMKP\PMKPController@getLaporanPasienPulangPaksa');
            Route::get('get-data-laporan-lama-hari-perawatan-pasien', 'PMKP\PMKPController@getLaporanLamaHariPerawatanPasien');
            Route::get('get-data-laporan-data-perawat-d3', 'PMKP\PMKPController@getPerawatMinimalD3');
            Route::get('get-data-laporan-data-kematian', 'PMKP\PMKPController@getLaporanKematianPasienIgd');
            Route::get('get-data-combo-indikator-mutu', 'PMKP\PMKPController@getComboIndikatorMutu');
            Route::get('get-data-indikator-departemen', 'PMKP\PMKPController@getDaftarIndikator');
            Route::get('pasien-kembali-ke-icu-diagnosa-sama', 'PMKP\PMKPController@pasienKembaliKeIcuDiagnosaSama');
            Route::get('pasien-spesi', 'PMKP\PMKPController@pasienSpesi');
            Route::get('kamatian-rawat-icu-kurang48', 'PMKP\PMKPController@kematianRawatICUKurang48');
            Route::get('kamatian-rawat-iccu-kurang48', 'PMKP\PMKPController@kematianRawatICCUKurang48');
            Route::get('kamatian-igd-kurang8', 'PMKP\PMKPController@kematianIGDKurang8');
            Route::get('kepatuhan-triase-igd', 'PMKP\PMKPController@kepatuhanTriaseIGD');
            Route::get('respon-time-pelayanan-igd', 'PMKP\PMKPController@responTimePelayananIGD');
            Route::get('transfer-pasien-igd-ke-ruangan', 'PMKP\PMKPController@transferPasienIGDkeRuangan');
            Route::get('kejadian-reaksi-tranfusi-igd', 'PMKP\PMKPController@kejadianReaksiTranfusiIGD');
            Route::get('kejadian-pasien-jatuh-igd', 'PMKP\PMKPController@kejadianPasienJatuhIGD');
            Route::get('waktu-lapor-hasil-tes-kritis-radiologi', 'PMKP\PMKPController@waktuLaporhasilTesKritisRadiologi');
            Route::get('waktu-tunggu-hasil-pelayanan-foto-thorax', 'PMKP\PMKPController@waktuTungguHasilPelayananFotoThorax');
            Route::get('pelaksana-ekspertisi-hasil-pemeriksaan-rontgen', 'PMKP\PMKPController@PelaksanaEkspertisiHasilPemeriksaanRontgen');
            Route::get('waktu-tunggu-pemeriksaan-usg-rawat-inap', 'PMKP\PMKPController@WaktuTungguPemeriksaanUSGRawatInap');
            Route::get('waktu-tunggu-pemeriksaan-cito-radiologi', 'PMKP\PMKPController@WaktuTungguPemeriksaanCitoRadiologi');
            Route::get('get-data-indikator-departemen-pmkp', 'PMKP\PMKPController@getDaftarIndikatorPMKP');
            Route::get('insiden-terlepasnya-jarum-vena', 'PMKP\PMKPController@insidenTerlepasnyaJarumVena');
            Route::get('kejadian-clotting-durante', 'PMKP\PMKPController@kejadianClottingDurante');
            Route::get('presentase-pasien-hd-terapi-esa', 'PMKP\PMKPController@presentasePasienHDTerapiEsa');
            Route::get('get-ppi', 'PMKP\PMKPController@getPPI');
            Route::get('asi-eksklusif', 'PMKP\PMKPController@asiEksklusif');
            Route::get('get-kepatuhan-jam-visit-dokter-spesialis', 'PMKP\PMKPController@getKepatuhanJamVisitDokterSpesialis');
            Route::get('get-angka-perawatan-ulang', 'PMKP\PMKPController@getAngkaPerawatanUlang');
            Route::get('get-kejadian-pulang-atas-permintaan-sendiri', 'PMKP\PMKPController@getKejadianPulangAtasPermintaanSendiri');
            Route::get('get-kesalahan-diit-pasien', 'PMKP\PMKPController@getKesalahanDiitPasien');
            Route::get('get-ketidak-lengkapan-laporan-anestesi', 'PMKP\PMKPController@getKetidakLengkapanLaporanAnestesi');
            Route::get('get-ketidak-lengkapan-laporan-operasi', 'PMKP\PMKPController@getKetidakLengkapanLaporanOperasi');
            Route::get('get-sisa-makanan-siang-non-diit', 'PMKP\PMKPController@getSisaMakananSiangNonDiit');
            Route::get('get-proporsi-pasien-tb-paru-terkonfirmasi-bakteriologis', 'PMKP\PMKPController@getProporsiPasienTBParuTerkonfirmasiBakteriologis');
            Route::get('get-iadp', 'PMKP\PMKPController@getIADP');
            Route::get('get-hap-and-dekubitus', 'PMKP\PMKPController@getHapAndDekubitus');
            Route::get('get-indikator-manual', 'PMKP\PMKPController@getIndikatorManual');
            Route::get('get-indikator-ppi-null', 'PMKP\PMKPController@getIndikatorPPINull');
            Route::get('get-kejadian-reaksi-tranfusi', 'PMKP\PMKPController@getKejadianReaksiTranfusi');
            Route::get('get-data-sasaran-mutu', 'PMKP\PMKPController@getDataSasaranMutu');
            Route::get('get-data-sasaran-mutu-pmkp', 'PMKP\PMKPController@getDataSasaranMutu');
            Route::get('get-data-investigasi-sederhana', 'PMKP\PMKPController@GetDaftarLembarInvestigasiSederhana');
            Route::get('get-data-insiden-internal', 'PMKP\PMKPController@GetDaftarLaporanInsidenInternal');
            Route::get('get-data-insiden-keselamatan-pasien', 'PMKP\PMKPController@GetDaftarInsidenKeselamatanPasien');
            Route::get('get-data-sasaran-mutu-bulanan', 'PMKP\PMKPController@getDataRekapSasaranMutu');
            Route::get('get-data-pasien-registrasi', 'PMKP\PMKPController@getDataPasienRegistrasi');
            Route::get('get-data-identifikasi-risiko', 'PMKP\PMKPController@GetDaftarLaporanIdentifikasiRisiko');
            Route::get('get-data-risk-register', 'PMKP\PMKPController@GetDaftarLaporanRiskRegister');
            Route::get('get-data-laporan-sensus-keselamatan-pasien', 'PMKP\PMKPController@getLaporanSensusKeselamatanPasienBulanan');
            Route::get('get-detail-identifikasi-risiko', 'PMKP\PMKPController@GetDetailLaporanIdentifikasiRisiko');
            Route::get('get-lap-indikator-mutu', 'PMKP\PMKPController@getLapIndikatorMutu');
            Route::get('get-lap-indikator-mutu-forchart', 'PMKP\PMKPController@getLapIndikatorMutuForChart');
            Route::get('get-lap-indikator-mutu-forchart-pmkp', 'PMKP\PMKPController@getLapIndikatorMutuForChartPMKP');
            Route::get('get-lap-indikator-mutu-pmkp', 'PMKP\PMKPController@getLapIndikatorMutuPMKP');
            Route::get('get-chart-jenis-keselamatan', 'PMKP\PMKPController@getChartJenisKeselamatan');
            Route::get('get-chart-grading', 'PMKP\PMKPController@getChartGrading');
            Route::get('get-lembar-kerja-investigasi', 'PMKP\PMKPController@getLembarKerjaInvestigasi');
            Route::get('get-form-lembar-kerja-investigasi', 'PMKP\PMKPController@getFormLembarKerjaInvestigasi');
            Route::get('get-data-insiden-internal-baru', 'PMKP\PMKPController@GetDaftarLaporanInsidenInternalBaru');
            Route::get('get-capaian-indikator', 'PMKP\PMKPController@getCapaianIndikator');
            Route::get('get-capaian-indikator-pmkp', 'PMKP\PMKPController@getCapaianIndikatorPMKP');
            /*END GET*/

            /*POST*/
            Route::post('save-data-pmkp', 'PMKP\PMKPController@saveRiwayat');
            Route::post('delete-data-pmkp', 'PMKP\PMKPController@hapusRiwayat');
            Route::post('save-data-sasaran-mutu', 'PMKP\PMKPController@saveSasaranMutu');
            Route::post('save-data-sasaran-verif', 'PMKP\PMKPController@verif');
            Route::post('save-data-lembar-investigasi', 'PMKP\PMKPController@saveLembarKerjaInvestigasi');
            Route::post('delete-data-lembar-investigasi', 'PMKP\PMKPController@hapusDataLembarInvestigasi');
            Route::post('save-data-insiden-internal', 'PMKP\PMKPController@saveLaporanInsidenInternal');
            Route::post('delete-data-insiden-internal', 'PMKP\PMKPController@hapusDataLaporanInsidenInternal');
            Route::post('save-insiden-keselamatan-pasien', 'PMKP\PMKPController@saveInsidenKeselamatan');
            Route::post('delete-insiden-keselamatan-pasien', 'PMKP\PMKPController@hapusInsidenKeselamatan');
            Route::post('save-data-analisa-sasaran-mutu', 'PMKP\PMKPController@saveAnalisaSasaranMutu');
            Route::post('save-data-identifikasi-risiko', 'PMKP\PMKPController@saveIdentifikasiRisiko');
            Route::post('hapus-data-identifikasi-risiko', 'PMKP\PMKPController@hapusIdentifikasiRisiko');
            Route::post('save-data-risk-register', 'PMKP\PMKPController@saveRiskRegister');
            Route::post('hapus-data-risk-register', 'PMKP\PMKPController@hapusRiskRegister');
            /*END POST*/
        });
        Route::group(['prefix' => 'radiologi'], function () {
            Route::get('get-data-combo-labrad', 'Radiologi\RadiologiController@getDataComboLabRab');
            // all
            Route::get('get-laporan-rekap-tindakan', 'Radiologi\RadiologiController@getLaporanRekapPemeriksaan');
            //
            Route::get('get-rincian-pelayanan', 'Radiologi\RadiologiController@getRincianPelayanan');



            Route::get('get-waktu-pelayanan-rad', 'Radiologi\RadiologiController@getWaktuPelayananRadiologi');
            Route::get('get-laporan-dokter-baca', 'Radiologi\RadiologiController@getLaporanDokterBaca');
            Route::get('get-laporan-tindakan-usg', 'Radiologi\RadiologiController@getLaporanTindakanUSG');
            Route::get('get-laporan-kinerja-pertindakan', 'Radiologi\RadiologiController@getLaporanKinerjaPelaksanaPertindakan');


            Route::get('get-rincian-pelayanan-emr', 'Radiologi\RadiologiController@getRincianPelayananEMR');
            Route::get('get-rincian-pelayanan-rad', 'Radiologi\RadiologiController@getRincianPelayananRad');
            Route::get('get-rincian-pelayanan-lab', 'Radiologi\RadiologiController@getRincianPelayananLab');
            // trisno
            Route::get('get-hasil-radiologi-claim', 'Radiologi\RadiologiController@getHasilRadiologiClaim');
            Route::get('get-hasil-lab-claim', 'Radiologi\RadiologiController@getHasilLabClaim');
            Route::get('get-rincian-pelayanan-lab-ana-inacbg', 'Radiologi\RadiologiController@getRincianPelayananLabAnaInaCbg');
            Route::get('get-rincian-pelayanan-emr-all', 'Radiologi\RadiologiController@getRincianPelayananEMRAll'); //kholid
            // trisno
            Route::get('get-rincian-pelayanan-lab-rm', 'Radiologi\RadiologiController@getRincianPelayananLabRM');
            Route::get('get-rincian-pelayanan-lab-rm2', 'Radiologi\RadiologiController@getRincianPelayananLabRM2');
            Route::get('get-rincian-pelayanan-lab-rm2hasil', 'Radiologi\RadiologiController@getRincianPelayananLabRM2hasil');
            Route::get('get-rincian-pelayanan-inacbg', 'Radiologi\RadiologiController@getRincianPelayananInaCbg');
            Route::get('get-rincian-pelayanan-labs', 'Radiologi\RadiologiController@getRincianPelayananLabs');
            Route::get('get-rincian-pelayanan-rad-inacbg', 'Radiologi\RadiologiController@getRincianPelayananRadInaCbg');
            Route::get('get-rincian-pelayanan-lab-inacbg', 'Radiologi\RadiologiController@getRincianPelayananLabInaCbg');
            Route::get('get-lab-inacbg-grid-claim', 'Radiologi\RadiologiController@getLabInaCbgGridClaim');
            Route::get('get-lab-inacbg-grid-rm', 'Radiologi\RadiologiController@getLabInaCbgGridRM');
            Route::get('get-lab-inacbg-grid-bedah', 'Radiologi\RadiologiController@getLabInaCbgGridBedah');
            Route::post('save-file-dna', 'Radiologi\RadiologiController@saveFileDna');
            Route::get('get-file-dna', 'Radiologi\RadiologiController@getFileDna');
            Route::post('save-order-pelayanan', 'Radiologi\RadiologiController@saveOrderPelayananLabRad');
            Route::post('delete-pelayanan-pasien', 'Radiologi\RadiologiController@deletePelayananPasien');
            Route::get('get-acc-number', 'Radiologi\RadiologiController@getAccNumberRadiologi');
            Route::get('get-combo', 'Radiologi\RadiologiController@getComboRad');
            Route::get('get-daftar-pasien-penunjang', 'Radiologi\RadiologiController@getDaftarPasienPenunjang');
            Route::post('update-jenis-kelamin', 'Radiologi\RadiologiController@updateJenisKelaminPasien');
            Route::post('update-gol-darah', 'Radiologi\RadiologiController@updateGolonganDarah');
            Route::get('get-combo-regis', 'Radiologi\RadiologiController@getComboRegs');
            Route::get('get-daftar-pasien-labrad', 'Radiologi\RadiologiController@getDaftarRegistrasiPasienLabRad');
            Route::get('get-daftar-pasien-labrad-lab', 'Radiologi\RadiologiController@getDaftarRegistrasiPasienLabRadLab');
            Route::get('get-antrian', 'Radiologi\RadiologiController@getAntrian');
            Route::get('get-apd', 'Radiologi\RadiologiController@getAPD');
            Route::post('save-apd', 'Radiologi\RadiologiController@saveAntrianPasien');
            Route::get('get-daftar-order', 'Radiologi\RadiologiController@getDaftarOrderPenunjang');
            Route::get('get-daftar-orderverif', 'Radiologi\RadiologiController@getDaftarOrderPenunjangverif');
            Route::get('get-diagnosapasienbynoreg', 'Radiologi\RadiologiController@getDiagnosaRad');
            Route::get('get-order-pelayanan', 'Radiologi\RadiologiController@getOrderPelayanan');
            Route::post('save-pelayanan-pasien', 'Radiologi\RadiologiController@savePelayananPasien');
            Route::post('delete-order-pelayanan', 'Radiologi\RadiologiController@deleteOrderPelayanan');
            Route::post('delete-order-penunjang', 'Radiologi\RadiologiController@hapusOrderPenunjang');
            Route::post('save-hasil-radiologi', 'Radiologi\RadiologiController@saveHasilRadiologi');
            Route::post('save-hasil-radiologi-before-edit', 'Radiologi\RadiologiController@saveHasilRadiologiBeforeEdit');
            Route::get('get-hasil-radiologi', 'Radiologi\RadiologiController@getHasilRadiologi');
            Route::get('get-pelayananpasien-radiologi', 'Radiologi\RadiologiController@getPelPasienRad');
            Route::get('get-detail-verifikasi', 'Radiologi\RadiologiController@getDetailVerifLabRad');
            Route::get('get-nokantong', 'Radiologi\RadiologiController@getnokantong');
            Route::post('simpan-nokantong', 'Radiologi\RadiologiController@savenokantong');
            Route::get('get-alamat', 'Radiologi\RadiologiController@getAlamat');
            Route::get('get-running-number', 'Radiologi\RadiologiController@getRunningNumber');
            Route::post('update-running-number', 'Radiologi\RadiologiController@updateRunningNumber');
            Route::post('update-acc-number', 'Radiologi\RadiologiController@updateAccNumberInPp');
            Route::get('get-laporan-kunjungan-radiologi', 'Radiologi\RadiologiController@getLaporanKunjunganRadiologi');
            Route::get('get-rekanan', 'Radiologi\RadiologiController@getRekananKelompok');
            Route::get('get-daftar-orderverif-rincian', 'Radiologi\RadiologiController@getDaftarOrderPenunjangverifRincian');
            Route::post('update-modality', 'Radiologi\RadiologiController@updatemodality');
            Route::get('get-data-combo-luarlab', 'Radiologi\RadiologiController@getDataComboLuarLab');
        });
        Route::group(['prefix' => 'rawatinap'], function () {
            Route::get('get-kab-kota', 'RawatInap\RawatInapController@getKabKota');
            Route::post('save-id-sirs-pasien', 'RawatInap\RawatInapController@saveIdSirsPasien');
            Route::get('get-data-combo-dokter', 'RawatInap\RawatInapController@getDataComboDokter');
            Route::post('save-kelurahan-from-sirs', 'RawatInap\RawatInapController@saveKelurahanFromSirs');
            Route::post('save-kelurahan-from-sirs-all', 'RawatInap\RawatInapController@saveKelurahanFromSirsAll');
            Route::post('save-kelurahan-id-from-sirs', 'RawatInap\RawatInapController@saveKelurahanIdSirs');
            Route::get('get-combo-baru', 'RawatInap\RawatInapController@getComboBaru');
            Route::get('get-data-combo-dokter-select', 'RawatInap\RawatInapController@getDataComboDokterSelect');
            Route::get('get-daftar-antrian-ranap', 'RawatInap\RawatInapController@getDaftarRegistrasiDokterRanap');
            Route::get('get-daftar-antrian-ranapbedah', 'RawatInap\RawatInapController@getDaftarRegistrasiDokterRanapOrderbedah');
            Route::get('get-daftar-antrian-ranapbedahpernoreg', 'RawatInap\RawatInapController@getDaftarRegistrasiPernoreg');
            Route::get('get-dokters-combos', 'RawatInap\RawatInapController@getDokters');
            Route::post('save-update-dokter-antrian', 'RawatInap\RawatInapController@updateDokterAntrian');
            Route::post('simpan-update-dokter', 'RawatInap\RawatInapController@simpanUpdateDokter');
            Route::get('get-daftar-bed-ranap-dokkes', 'RawatInap\RawatInapController@getDaftarRegistrasiBedRanapDokkes');
            Route::get('get-daftar-bed', 'RawatInap\RawatInapController@getTotalBed');
            Route::get('get-daftar-bed-isi', 'RawatInap\RawatInapController@getTotalBedIsi');
            Route::get('get-daftar-bed-kosong', 'RawatInap\RawatInapController@getTotalBedKosong');
            Route::get('get-ruangan-last', 'RawatInap\RawatInapController@getRuanganLast');
            Route::post('save-pasien-jatuh', 'RawatInap\RawatInapController@saveIndikatorPasienJatuh');
            Route::get('get-combo-pindahpasien', 'RawatInap\PindahPulangController@getComboPindahPulang');
            Route::get('get-pasien-bynorec/{norec_pd}/{norec_apd}', 'RawatInap\PindahPulangController@getPindahPasienByNoreg');
            Route::get('get-daftar-viewer-bed-new', 'RawatInap\RawatInapController@getViewerbedNew');
            Route::get('get-pelayanan/{norec_pd}/{norec_apd}', 'RawatInap\PindahPulangController@getPelayanan');
            Route::get('get-pelayanan-2/{norec_pd}', 'RawatInap\PindahPulangController@getPelayanan2');
            Route::get('get-kelasbyruangan', 'RawatInap\PindahPulangController@getKelasByRuangan');
            Route::get('get-kamarbyruangankelas', 'RawatInap\PindahPulangController@getKamarByKelasRuangan');
            Route::get('get-nobedbykamar', 'RawatInap\PindahPulangController@getNoBedByKamar');
            Route::get('get-nosep-by-norec-pd/{norec_pd}', 'Bridging\BridgingBPJSController@getNoSEPByNorecPd');
            Route::post('save-akomodasi-tea', 'RawatInap\RawatInapController@saveAkomodasiOtomatis');
            Route::post('hapus-akomodasi-tea', 'RawatInap\RawatInapController@hapusAkomodasiOtomatis');
            Route::get('get-kamar-ruangan-ibu', 'RawatInap\RawatInapController@getKamarIbuLast');
            Route::post('save-pulang-pasien', 'RawatInap\PindahPulangController@savePulangPasien');
            Route::post('save-pindah-pasien', 'RawatInap\PindahPulangController@savePindahPasien');
            Route::get('get-daftar-pasien-masih-dirawat', 'RawatInap\RawatInapController@getPasienMasihDirawat');
            Route::post('save-rujuk-pasien', 'RawatInap\PindahPulangController@saveRujukPasien');
            Route::post('save-logging-meninggal', 'RawatInap\PindahPulangController@saveLoggingMeninggal');
            Route::post('save-logging-meninggal2', 'RawatInap\PindahPulangController@saveLoggingMeninggal2');
            Route::post('save-logging-ubah-penjamin', 'RawatInap\PindahPulangController@saveLoggingUbahPenjamin');
            Route::post('save-pulang-pasien-eklaim', 'RawatInap\PindahPulangController@savePulangPasienEklaim');
            Route::post('save-cara-masuk-eklaim', 'RawatInap\PindahPulangController@saveCaraMasukEklaim');
            Route::post('save-cara-naikkelas-eklaim', 'RawatInap\PindahPulangController@saveCaraNaikKelasEklaim');
            // trisno
            Route::get('get-ruangan-blok-depo', 'RawatInap\RawatInapController@getRuanganBlokDepo');
            Route::get('get-sensus-pasien-masih-dirawat', 'RawatInap\RawatInapController@getSensusPasienMasihDirawat');
            Route::get('get-pasien-pernah-dirawat', 'RawatInap\RawatInapController@getPasienPernahDirawat');
            Route::post('update-tanggal-terimapasien', 'Farmasi\RawatInapController@updateTanggalTerimaPasien');

            Route::get('get-combo-pasien-masih-dirawat', 'RawatInap\RawatInapController@getComboPasienMasihDirawat');
            Route::get('get-antrian-pasien-diperiksa', 'RawatInap\RawatInapController@getDetailAntrianPasienDiperiksa');
            Route::post('save-batal-rawat-inap', 'RawatInap\RawatInapController@saveBatalRanap');
            Route::post('save-batal-pindah-ruangan', 'RawatInap\RawatInapController@saveBatalPindahRuangan');
            Route::post('update-kamar', 'RawatInap\RawatInapController@updateKamar');
            Route::get('get-daftar-pasien-rencana-pindah', 'RawatInap\RawatInapController@getDaftarRencanaPindahPasien');
            Route::get('get-data-pasien-pindah', 'RawatInap\RawatInapController@getDataPasienPindah');
            Route::get('get-pasien-jatuh', 'RawatInap\RawatInapController@getIndikatorPasienJatuh');
            Route::post('save-pasien-jatuh', 'RawatInap\RawatInapController@saveIndikatorPasienJatuh');
            Route::get('get-combo-pasien-jatuh', 'RawatInap\RawatInapController@getComboPasienJatuh');
            Route::get('get-combo-gizi', 'RawatInap\RawatInapController@getDataComboBoxGizi');

            Route::get('get-combo-filter', 'Gizi\GiziController@getDataComboBox2');
            Route::get('get-pasien-ranap-gizi', 'RawatInap\RawatInapController@getPasienDirawatGizi');
            Route::post('save-data-edukasi', 'RawatInap\RawatInapController@saveEdukasiIpcln');
            Route::get('get-data-ipcln', 'RawatInap\RawatInapController@getDataIPCLN');
            Route::post('hapus-jadwal-perbulan-pegawai', 'RawatInap\RawatInapController@hapusJadwalBulananPegawai');
            Route::get('get-combo-surveilan', 'RawatInap\RawatInapController@getDataComboSurv');
            Route::get('get-data-surveilans', 'RawatInap\RawatInapController@getDataSurveilans');
            Route::get('get-data-harian-surveilans', 'RawatInap\RawatInapController@getDataHarianSurveilans');
            Route::get('get-data-ido-surveilans', 'RawatInap\RawatInapController@getDataIdoSurveilans');
            Route::post('save-data-apd', 'RawatInap\RawatInapController@saveCheklisApd');
            Route::get('get-data-cheklis-apd', 'RawatInap\RawatInapController@getDataCheklisApd');
            Route::get('get-daftar-pasien-masih-dirawat-dpjp', 'RawatInap\RawatInapController@getPasienMasihDirawatbyDpjp');
            Route::get('get-laporan-mpp', 'RawatInap\RawatInapController@getLaporanMPP');
            Route::get('get-data-sensus', 'RawatInap\RawatInapController@getDataSensus');
            Route::get('get-data-for-sidopak', 'RawatInap\RawatInapController@getDataForSidopak');

            Route::get('get-ruanganranap-for-aplicare', 'RawatInap\RawatInapController@getRuanganRanapForAplicare');
            Route::get('get-kelasruangan-for-aplicare', 'RawatInap\RawatInapController@getKelasRuanganForAplicare');
            Route::get('get-jumlahtt-for-aplicare', 'RawatInap\RawatInapController@getJumlahTTForAplicare');
        });
        Route::group(['prefix' => 'rawatjalan'], function () {
            Route::get('get-data-combo-dokter', 'RawatJalan\RawatJalanController@getDataComboDokter');
            Route::get('get-dokters-combos', 'RawatJalan\RawatJalanController@getDokters');
            Route::get('get-combo-surat', 'RawatJalan\RawatJalanController@getDataComboSurat');
            Route::get('get-data-combo-operator', 'RawatJalan\RawatJalanController@getDataComboOperator');
            Route::get('get-daftar-antrian-rajal', 'RawatJalan\RawatJalanController@getDaftarRegistrasiDokterRajal');
            // start tris
            Route::get('get-daftar-antrian-rajal-datas', 'RawatJalan\RawatJalanController@getDaftarRegistrasiDokterRajalDatas');
            Route::get('get-daftar-antrian-rajal-data-tindak', 'RawatJalan\RawatJalanController@getDaftarRegistrasiDokterRajalDataTindak');
            Route::get('get-daftar-antrian-rajal-data-konsul', 'RawatJalan\RawatJalanController@getDaftarRegistrasiDokterRajalDataKonsul');
            Route::get('get-daftar-antrian-rajal-data-dikonsul', 'RawatJalan\RawatJalanController@getDaftarRegistrasiDokterRajalDatadiKonsul');
            Route::get('get-daftar-antrian-rajal-data-dokumen', 'RawatJalan\RawatJalanController@getDaftarRegistrasiDokterRajalDataDokumen');
            // end
            Route::get('get-daftar-antrian-rajal-tindak', 'RawatJalan\RawatJalanController@getDaftarRegistrasiDokterRajalTindak');
            Route::get('get-daftar-antrian-rajal-konsul', 'RawatJalan\RawatJalanController@getDaftarRegistrasiDokterRajalKonsul');
            Route::get('get-daftar-antrian-rajal-dikonsul', 'RawatJalan\RawatJalanController@getDaftarRegistrasiDokterRajalDiKonsul');
            Route::post('save-batal-panggil', 'RawatJalan\RawatJalanController@pasienBatalPanggil');
            Route::post('update-status-pulang', 'RawatJalan\RawatJalanController@updateStatusPulang');
            Route::post('update-batal-konsul', 'RawatJalan\RawatJalanController@updateBatalKonsul');
            Route::post('save-update-dokter-antrian', 'RawatJalan\RawatJalanController@updateDokterAntrian');
            Route::post('save-pasien-jatuh', 'RawatJalan\RawatJalanController@saveIndikatorPasienJatuh');
            Route::post('save-panggil', 'RawatJalan\RawatJalanController@savePanggilDokter');
            Route::post('save-daftar-surat', 'RawatJalan\RawatJalanController@saveDaftarSurat');
            Route::get('get-detail-pasien-surat', 'RawatJalan\RawatJalanController@getDetailpasienSurat');
            Route::get('get-daftar-surat', 'RawatJalan\RawatJalanController@getDaftarSurat');
            Route::get('get-daftarpasien-by-diagnosa', 'RawatJalan\RawatJalanController@getDaftarSurat');
            Route::get('get-order-konsul', 'RawatJalan\RawatJalanController@getOrderKonsul');
            Route::get('get-dokter-kesehatan-jiwa', 'RawatJalan\RawatJalanController@getDokterKesehatanJiwa');
            Route::get('get-dokter-MCU', 'RawatJalan\RawatJalanController@getDokterMCU');
            Route::post('save-konsul-from-order', 'RawatJalan\RawatJalanController@saveKonsulFromOrder');
            Route::get('get-combo', 'RawatJalan\RawatJalanController@getComboS');
            Route::get('get-pemeriksaan-keluar-lab', 'RawatJalan\RawatJalanController@getPemeriksaanKeluarLab');
            Route::post('save-pasien-kompleks', 'RawatJalan\RawatJalanController@savePasienKompleks');
            Route::post('save-pasien-mpp', 'RawatJalan\RawatJalanController@savePasienMPP');
            Route::post('save-update-residence', 'RawatJalan\RawatJalanController@saveResidence');
            Route::get('get-daftar-konsul-from-order', 'RawatJalan\RawatJalanController@getDaftarKonsulFromOrder');
            Route::post('save-periksa', 'RawatJalan\RawatJalanController@saveSelesaiPeriksa');
            Route::post('save-update-dokter-antrian-konsul', 'RawatJalan\RawatJalanController@updateDokterAntrianKonsul');
            Route::post('decline-konsul', 'RawatJalan\RawatJalanController@declineKonsul');
            Route::post('unverifikasi-konsultasidokter-fromorder', 'RawatJalan\RawatJalanController@saveBatalKonsulFromOrder');
            Route::get('get-data-konsul-combo', 'RawatJalan\RawatJalanController@getComboKonsul');
            Route::get('get-order-konsul-count', 'RawatJalan\RawatJalanController@getOrderKonsulCount');
            Route::post('update-diagnosa-fretext', 'RawatJalan\RawatJalanController@updateDiagnosaFreText');
            Route::post('save-dipanggil-suster', 'RawatJalan\RawatJalanController@saveDipanggilSusterRajal');
            Route::get('get-laporan-persediaan', 'RawatJalan\RawatJalanController@getLaporanPersediaan');
            Route::get('get-pasien-eks-rajal', 'RawatJalan\RawatJalanController@getPasienEksekutifHalu');
            Route::get('get-rujukan-keluar-lab', 'RawatJalan\RawatJalanController@getPemeriksaanRujukLab');
        });
        Route::group(['prefix' => 'registrasi'], function () {
            Route::get('get-data-combo-jenisdokumen', 'Registrasi\RegistrasiController@getDataComboJenisDokumen');
            Route::post('save-diagnosa-idrg9', 'Registrasi\RegistrasiController@saveDiagnosaIdrg9');
            Route::post('save-diagnosa-tindakan-pasien-target-idrg', 'Registrasi\RegistrasiController@saveDiagnosaTindakanPasienTargetIDRG');
            // 2021-02 penambahan trisno
            Route::get('get-combo-baru', 'Registrasi\LaporanRegistrasiController@getComboBaru');
            Route::get('get-apd-baru', 'Registrasi\RegistrasiController@getApdLembarMasukRI');
            Route::get('get-ruangan-combo', 'Registrasi\LaporanRegistrasiController@getRuanganCombo');
            Route::get('get-ruangan-perawatan-online', 'Registrasi\RegistrasiController@getRuanganPerawatanOnline');
            Route::get('get-hapus-pelayanan', 'Registrasi\RegistrasiController@getHapusPelayanan');
            Route::get('get-departemen', 'Registrasi\RegistrasiController@getDepartemen');
            Route::get('get-tindakan-penunjang', 'Registrasi\RegistrasiController@getTindakanPenunjang');
            Route::get('get-map-ruangan-user', 'Registrasi\RegistrasiController@getMapRuanganUser');
            Route::get('get-laporan-covid', 'Registrasi\RegistrasiController@getLaporanCovid');
            Route::get('get-laporan-covid-karyawan', 'Registrasi\RegistrasiController@getLaporanCovidKaryawan');
            Route::get('get-karyawan-isoman', 'Registrasi\RegistrasiController@getKaryawanIsoman');
            Route::get('get-jumlah-isoman-karyawan', 'Registrasi\RegistrasiController@getJumlahIsomanKaryawan');
            Route::get('get-jumlah-covid-karyawan', 'Registrasi\RegistrasiController@getJumlahCovidKaryawan');
            Route::get('get-laporan-covid-pulang', 'Registrasi\RegistrasiController@getLaporanCovidPulang');
            Route::get('get-daftar-pasien-eclaim', 'Registrasi\RegistrasiController@getDaftarPasienEClaim');
            Route::get('get-laporan-covid-hasil-lab', 'Registrasi\RegistrasiController@getLaporanCovidHasilLab');
            Route::get('get-laporan-covid-diagnosa', 'Registrasi\RegistrasiController@getLaporanCovidDiagnosa');
            Route::get('get-laporan-covid-ventilator', 'Registrasi\RegistrasiController@getLaporanCovidVentilator');
            // 2019-12 penambahan arif awal
            Route::get('get-daftar-pasien-spri', 'Registrasi\RegistrasiController@getDaftarPasienSPRI');
            Route::get('get-daftar-pasien-rencana-kontrol', 'Registrasi\RegistrasiController@getDaftarPasienRencanaKontrol');
            Route::get('get-apd-db-lama', 'Registrasi\RegistrasiController@getAntrianPasienDbLama');
            // 2019-12 penambahan arif akhir
            Route::get('get-pasien-pernah-daftar/{nocm}', 'Registrasi\RegistrasiController@getPasienPernahDaftar');
            Route::get('get-pasienbynocm', 'Registrasi\RegistrasiController@getPasienByNoCm');
            Route::get('get-data-combo', 'Registrasi\RegistrasiController@getDataCombo');
            Route::get('get-data-combo-reg-lama', 'Registrasi\RegistrasiController@getDataComboRegLama');
            Route::get('get-kelasbyruangan', 'Registrasi\RegistrasiController@getKelasByRuangan');
            Route::get('get-kamarbyruangankelas', 'Registrasi\RegistrasiController@getKamarByKelasRuangan');
            Route::get('get-nobedbykamar', 'Registrasi\RegistrasiController@getNoBedByKamar');
            Route::post('save-registrasipasien', 'Registrasi\RegistrasiController@saveRegistrasiPasien');
            Route::post('save-createpasienonline', 'Registrasi\RegistrasiController@createtaskidchecking');
            // noname
            Route::post('save-pasienisoman', 'Registrasi\RegistrasiController@simpanPasienIsoman');
            Route::post('save-simpaneisall', 'Registrasi\RegistrasiController@simpaneisall');
            Route::post('save-simpaneisallloop', 'Registrasi\RegistrasiController@simpaneisallloop');
            Route::get('get-geteisall', 'Registrasi\RegistrasiController@geteisall');
            Route::get('get-geteisallperinstalasi', 'Registrasi\RegistrasiController@geteisallperinstalasi');
            Route::get('get-datapasieneis', 'Registrasi\RegistrasiController@datapasieneis');
            Route::get('get-geteisperrs', 'Registrasi\RegistrasiController@geteisperrs');
            Route::get('geteisperrstotalinstalasi', 'Registrasi\RegistrasiController@geteisperrstotalinstalasi');
            Route::get('get-ruangan-pasien', 'Registrasi\RegistrasiController@getRuanganPasien');



            Route::post('hapus-pasienisoman', 'Registrasi\RegistrasiController@hapusPasienIsoman');
            Route::post('upload-dokumen', 'Registrasi\RegistrasiController@uploadDokumen');
            Route::post('upload-dokumen-registrasi', 'Registrasi\RegistrasiController@uploadDokumenRegistrasi');
            Route::get('get-pasienisoman', 'Registrasi\RegistrasiController@getPasienIsoman');
            Route::get('get-data-list-dokumen', 'Registrasi\RegistrasiController@getDataListDokumen');
            Route::get('get-data-list-dokumen-registrasi', 'Registrasi\RegistrasiController@getDataListDokumenRegistrasi');
            Route::get('get-history-noregistrasi', 'Registrasi\RegistrasiController@getHistoryNoregistrasi');
            Route::get('get-pasienisoman-satu', 'Registrasi\RegistrasiController@getPasienIsomanSatu');
            Route::get('get-pasienisomanAll', 'Registrasi\RegistrasiController@getPasienIsomanAll');
            Route::post('aktipkan-pasien-tidak-datang', 'Registrasi\RegistrasiController@aktipkanTidakDatang');
            //  end noname
            Route::post('save-registrasijenazah', 'Registrasi\RegistrasiController@saveRegistrasiJenazah');
            Route::get('get-rekanan-saeutik', 'Registrasi\RegistrasiController@getRekananSaeutik');
            Route::get('get-pasienbynorec-pd', 'Registrasi\RegistrasiController@getPasienByNoRecPD');
            Route::get('get-diagnosa-saeutik', 'Registrasi\RegistrasiController@getDiagnosaSaeutik');
            Route::post('save-asuransipasien', 'Registrasi\RegistrasiController@saveAsuransiPasien');
            Route::get('get-penjaminbykelompokpasien', 'Registrasi\RegistrasiController@getPenjaminByKelompokPasien');
            Route::get('get-asuransipasienbynocm', 'Registrasi\RegistrasiController@getAsuransiPasienByNoCm');
            Route::get('get-pasien-bynorec/{norec_pd}/{norec_apd}', 'Registrasi\RegistrasiController@getPasienByNoreg');
            Route::get('get-history-pemakaianasuransi', 'Registrasi\RegistrasiController@getHistoryPemakaianAsuransi');
            Route::get('get-pasien', 'Registrasi\RegistrasiController@getDaftarPasien');
            Route::get('get-tglpulang-pasien', 'Registrasi\RegistrasiController@cekTglPulangPasien');
            Route::get('get-apd', 'Registrasi\RegistrasiController@getAntrianPasien');
            Route::get('get-history-pemakaianasuransi2', 'Registrasi\RegistrasiController@getHistoryPemakaianAsuransi2');
            Route::get('cek-pasien-daftar-duakali', 'Registrasi\RegistrasiController@cekPasienDaftarDuaKali');
            Route::get('cek-noregistrasi', 'Registrasi\RegistrasiController@cekNoregistrasi');
            Route::get('update-noregistrasi', 'Registrasi\RegistrasiController@updateNoregis');
            Route::post('update-kelas-ditanggung', 'Registrasi\RegistrasiController@updateAsuransiPasien');
            Route::get('get-combo-kelas', 'Registrasi\RegistrasiController@getComboKelas');
            Route::get('get-pemakaian-asuransi', 'Registrasi\RegistrasiController@getPemakaianAsuransi');
            Route::get('get-rencana-kontrol', 'Registrasi\RegistrasiController@getRencanaKontrol');
            Route::get('get-rencana-kontrol-dari-sep', 'Registrasi\RegistrasiController@getRencanaKontrolDariSEP');
            Route::get('get-surat-kontrol-dan-norujukan', 'Registrasi\RegistrasiController@getSuratKontroldanNorujukan');
            Route::get('get-bynocm', 'Registrasi\RegistrasiController@getPsnByNoCm');
            Route::get('get-history-pemakaianasuransi-new', 'Registrasi\RegistrasiController@getHistoryPemakaianAsuransiNew');
            Route::get('get-pasienonline-bynorec/{norecReservasi}', 'Registrasi\RegistrasiController@getPasienOnlineByNorec');
            Route::get('generate-noregistrasi', 'Registrasi\RegistrasiController@getMaxNoregistrasi');
            Route::post('batal-periksa-delete', 'Registrasi\RegistrasiController@batalPeriksaDelete');
            Route::get('get-combo-registrasi', 'Registrasi\RegistrasiController@getComboRegBaru');
            Route::get('get-combo-address', 'Registrasi\RegistrasiController@getComboAddress');
            Route::post('update-norujukan', 'Registrasi\RegistrasiController@updateNorujukan');
            Route::post('update-flag-apr', 'Registrasi\RegistrasiController@updateFlagAPR');
            Route::get('get-desa-kelurahan-paging', 'Registrasi\RegistrasiController@getDesaKelurahanPaging');
            Route::post('save-pasien-fix', 'Registrasi\RegistrasiController@savePasienFix');
            Route::post('save-pasien-fixmcu', 'Registrasi\RegistrasiController@savePasienFixmcu');
            Route::post('save-faskes-pasien', 'Registrasi\RegistrasiController@saveFaskesPasien');
            Route::post('save-mr-manual', 'Registrasi\RegistrasiController@saveMrManual');
            Route::post('save-pasien-before-foto', 'Registrasi\RegistrasiController@saveIdPasienDoang');
            Route::get('get-data-combo-new', 'Registrasi\RegistrasiController@getDataComboNEW');
            Route::get('get-dokter-part', 'Registrasi\RegistrasiController@getComboDokterPart');
            Route::get('get-pegawai-use', 'Registrasi\RegistrasiController@getComboPegawai');
            Route::get('get-data-detail-pasien', 'Registrasi\RegistrasiController@getPasienDetailTea');
            Route::post('save-batal-ranap', 'Registrasi\RegistrasiController@saveBatalRanap');
            Route::get('cek-pasien-bayar/{nocm}', 'Registrasi\RegistrasiController@cekPasienBayar');
            Route::get('daftar-riwayat-registrasi', 'Registrasi\RegistrasiController@getDaftarRiwayatRegistrasi');
            Route::post('save-batal-ranap-rev', 'Registrasi\RegistrasiController@saveBatalRanapRev');
            Route::post('save-batal-pindah-ruangan', 'Registrasi\RegistrasiController@saveBatalPindahRuangan');
            Route::get('get-combo-pemakaian-asuransi', 'Registrasi\RegistrasiController@getDataComboAsuransiPasien');
            Route::get('get-daftar-combo-pegawai-all', 'Registrasi\RegistrasiController@getDataPegawaiAll');
            Route::get('cek-piutang-pasien/{nocm}', 'Registrasi\RegistrasiController@cekPiutangPasien');
            Route::get('get-titelbytgllahir', 'Registrasi\RegistrasiController@getTitelPasienByTanggalLahir');
            Route::get('cek-nobpjs', 'Registrasi\RegistrasiController@cekNoBPJSpasienBaru');
            Route::get('cek-nik', 'Registrasi\RegistrasiController@cekNIKpasienBaru');
            Route::get('close-faktur-all', 'Registrasi\RegistrasiController@closeFakturAll');
            Route::get('close-faktur-all-10', 'Registrasi\RegistrasiController@closeFakturAll10');
            Route::post('save-biaya-karcis', 'Registrasi\RegistrasiController@saveBiayaKarcis');
            Route::post('save-biaya-konsul', 'Registrasi\RegistrasiController@saveBiayaKonsul');
            Route::post('save-kasus-penyakit', 'Registrasi\RegistrasiController@saveKasusPenyakit');
            Route::get('get-callantrian', 'Registrasi\RegistrasiController@callAntrian');
            Route::post('post-callantrian', 'Registrasi\RegistrasiController@savecallAntrian');
            Route::post('post-callantrian-ulang', 'Registrasi\RegistrasiController@savecallAntrianUlang');
            Route::post('save-dokter-melayani', 'Registrasi\RegistrasiController@saveDokterMelayani');
            Route::post('batal-periksa-kiosk', 'Registrasi\RegistrasiController@batalPeriksaKiosk');
            Route::get('get-data-combo-dokumen', 'Registrasi\RegistrasiController@getDataComboDokumen');
            // MABA
            Route::post('save-pasien-maba-mcu', 'Registrasi\RegistrasiController@saveMabaMcu');
            Route::get('get-data-combo-maba', 'Registrasi\RegistrasiController@getDataComboMaba');
            Route::get('get-cek-nik-maba', 'Registrasi\RegistrasiController@getCekNikMaba');
            // MERGE
            Route::post('save-Merge', 'Registrasi\RegistrasiController@simpanMerge');
            Route::post('save-registrasipisahfaktur', 'Registrasi\RegistrasiController@savePisahFaktur');
            Route::post('save-pisah-faktur-beda-instalasi', 'Registrasi\RegistrasiController@savePisahFakturBedaInstalasi');
            //###BAYI
            Route::get('get-nocm-ibu', 'Registrasi\RegistrasiController@getNoCmIbu');
            Route::get('get-desakelurahan-part', 'Registrasi\RegistrasiController@getDesaKelurahanPart');
            Route::get('get-kecamatan-part', 'Registrasi\RegistrasiController@getKecamatanPart');
            Route::get('get-kotakabupaten-part', 'Registrasi\RegistrasiController@getKotaKabupatenPart');
            Route::get('get-propinsi-part', 'Registrasi\RegistrasiController@getPropinsiPart');
            Route::get('get-alamat-bykodepos', 'Registrasi\RegistrasiController@getAlamatByKodePos');
            Route::get('get-negara-part', 'Registrasi\RegistrasiController@getNegaraPart');
            Route::post('save-bayi', 'Registrasi\RegistrasiController@savePasienBayi');
            Route::post('generate-nocm', 'Registrasi\RegistrasiController@saveGenerateNocm');
            Route::get('cek-table-generate-nocm', 'Registrasi\RegistrasiController@getNoCmBelumDipake');
            Route::post('update-idibu', 'Registrasi\RegistrasiController@saveIdIbu');
            Route::get('get-dokumen-penunjang', 'Registrasi\RegistrasiController@getDokumenPenunjang');

            Route::post('save-pasien', 'Registrasi\RegistrasiController@savePasien');
            Route::post('update-pasien', 'Registrasi\RegistrasiController@updatePasien');
            Route::post('save-list-no-control-n-spri-from-bpjs', 'Registrasi\RegistrasiController@saveListNoControlNSPRIFromBPJS');
            Route::post('update-false-pasien', 'Registrasi\RegistrasiController@updateStatusEnabledPasien');
            Route::get('cek-pasien-bpjs-daftar', 'Registrasi\RegistrasiController@cekPasienBPJSDaftar');
            Route::get('get-apd-detail/{noregistrasi}/{ruanganlast}', 'Registrasi\RegistrasiController@getApdDetail');
            Route::get('get-kecamatanbydesa/{idDesa}', 'Registrasi\RegistrasiController@getKecamatanByDesaKelurahan');

            Route::get('identifikasi-label', 'Registrasi\RegistrasiController@IdentifikasiLabel');
            Route::get('identifikasi-buktiLayanan', 'Registrasi\RegistrasiController@IdentifikasiBuktiLayanan');
            Route::get('identifikasi-buktiLayanan', 'Registrasi\RegistrasiController@IdentifikasiBuktiLayanan');
            Route::get('identifikasi-sum-list', 'Registrasi\RegistrasiController@IdentifikasiSummaryList');
            Route::get('identifikasi-tracer', 'Registrasi\RegistrasiController@IdentifikasiTracer');
            Route::post('identifikasi-tracer-perjanjian', 'Registrasi\RegistrasiController@IdentifikasiTracerPerjanjian');
            Route::get('identifikasi-sep', 'Registrasi\RegistrasiController@IdentifikasiSEP');
            Route::get('identifikasi-label', 'Registrasi\RegistrasiController@IdentifikasiLabel');
            Route::get('identifikasi-kartu-pasien', 'Registrasi\RegistrasiController@IdentifikasiKartuPasien');
            Route::get('identifikasi-rmk', 'Registrasi\RegistrasiController@IdentifikasiRMK');
            Route::get('get-kelas-penjamin', 'Registrasi\RegistrasiController@getKelasPenjamin');

            Route::post('save-diagnosa-rmk', 'Registrasi\RegistrasiController@saveDiagnosaPasienRMK');
            Route::post('save-master-faskes', 'Registrasi\RegistrasiController@saveMasterFaskes'); //done
            Route::post('update-data-emrpasien', 'Registrasi\RegistrasiController@updateNoCmInEmrPasienReg');
            Route::post('confirm-pasien-online', 'Registrasi\RegistrasiController@ConfirmOnline');
            Route::post('update-data-emrpasien-pd', 'Registrasi\RegistrasiController@updatePdInEmrPasien');
            Route::get('get-data-pasien-reservasi', 'Registrasi\RegistrasiController@getPasienPerjanjian');
            Route::get('get-combo-perjanjian', 'Registrasi\RegistrasiController@getComboPasienPerjanjian');
            Route::get('get-data-pasien-reservasi-vaksinasi', 'Registrasi\RegistrasiController@getPasienPerjanjianVaksinasi');

            Route::get('daftar-antrian-pasien/get-combo-caramasukinacbg', 'Registrasi\RegistrasiController@getComboCaraMasukInacbg');
            Route::get('daftar-antrian-pasien/get-combo', 'Registrasi\RegistrasiController@getComboAntrianPasienOperator');
            Route::get('daftar-antrian-pasien/get-diagnosa', 'Registrasi\RegistrasiController@getDiagnosaDaftarAntrian');
            Route::get('daftar-antrian-pasien/get-daftar-antrian-pasien', 'Registrasi\RegistrasiController@getDaftarAntrianPasienDiperiksa');
            Route::get('daftar-antrian-pasien/get-data-pasien-mau-batal', 'Registrasi\RegistrasiController@getDataPasienMauBatal');
            Route::get('daftar-antrian-pasien/get-data-pasien-mau-bataludahkso', 'Registrasi\RegistrasiController@getDataPasienMauBataludahkso');
            Route::get('daftar-antrian-pasien/benerintabel', 'Registrasi\RegistrasiController@benerintabel');
            Route::post('daftar-antrian-pasien/save-batal-registrasi', 'Registrasi\RegistrasiController@SimpanBatalPeriksa');
            Route::post('daftar-antrian-pasien/save-batal-panggil', 'Registrasi\RegistrasiController@pasienBatalPanggil');
            Route::get('daftar-antrian-pasien/get-diagnosa-pasien-by-norecapd', 'Registrasi\RegistrasiController@getDiagnosaPasienByNorecAPD');
            Route::post('daftar-antrian-pasien/delete-diagnosa-pasien', 'Registrasi\RegistrasiController@deleteDiagnosaPasien');
            Route::post('daftar-antrian-pasien/delete-diagnosa-pasien-target', 'Registrasi\RegistrasiController@deleteDiagnosaPasienTarget');
            Route::post('daftar-antrian-pasien/delete-diagnosa-pasien-target-idrg', 'Registrasi\RegistrasiController@deleteDiagnosaPasienTargetIDRG');
            Route::post('daftar-antrian-pasien/delete-diagnosa-inacbg10', 'Registrasi\RegistrasiController@deleteDiagnosaInacbg10');
            Route::post('daftar-antrian-pasien/delete-diagnosa-inacbg9', 'Registrasi\RegistrasiController@deleteDiagnosaInacbg9');
            Route::post('daftar-antrian-pasien/set-primary-diagnosa-pasien-target', 'Registrasi\RegistrasiController@setPrimaryDiagnosaPasienTarget');
            Route::get('daftar-antrian-pasien/get-data-diagnosa-pasien', 'Registrasi\RegistrasiController@getDiagnosaPasienByNoreg');
            Route::post('daftar-antrian-pasien/save-diagnosa-array', 'Registrasi\RegistrasiController@saveArrDiagnosaPasien');
            Route::post('daftar-antrian-pasien/update-kelas-antrian', 'Registrasi\RegistrasiController@saveUpdateKelasAPD');
            Route::get('daftar-antrian-pasien/get-dokters-combos', 'Registrasi\RegistrasiController@getDokters');

            Route::get('get-pelayanan-pasien', 'Registrasi\RegistrasiController@getPelayananPasienNonDetail');
            Route::get('get-jenis-pelayanan/{norec_pd}', 'Registrasi\RegistrasiController@getJenisPelayananByNorecPd');
            Route::get('get-status-close/{noregistrasi}', 'Registrasi\RegistrasiController@getStatusClosePeriksa');
            Route::get('tindakan/get-combo', 'Registrasi\RegistrasiController@getComboTindakanPendaftaran');
            Route::post('simpan-mutasi-pasien', 'Registrasi\RegistrasiController@saveMutasiPasien');

            Route::get('get-daftar-pasienbatal', 'Registrasi\RegistrasiController@getDaftarPasienBatal');
            Route::get('get-daftar-pasien-meninggal', 'Registrasi\RegistrasiController@getDaftarPasienMeninggal');
            Route::get('get-bayi-baru-lahir', 'Registrasi\RegistrasiController@getBayiBaruLahir');
            Route::get('get-daftar-pasienbatalAntrian', 'Registrasi\RegistrasiController@getDaftarPasienBatalAntrian');

            Route::get('get-combo-riwayat-regis', 'Registrasi\RegistrasiController@getComboRiwayatRegis');
            Route::get('get-pasien-by-nocm-riwayat-regis', 'Registrasi\RegistrasiController@getPasienByNoCmRiwayatRegis');
            Route::get('get-antrian-by-nocm-rev', 'Registrasi\RegistrasiController@getAntrianPasienByNocmRev');
            Route::get('get-icd-9', 'Registrasi\RegistrasiController@getIcd9');
            Route::get('get-diagnosa-9-by-noreg', 'Registrasi\RegistrasiController@getDiagnosaPasienByNoregICD9');
            Route::get('get-diagnosa-10-by-noreg', 'Registrasi\RegistrasiController@getDiagnosaPasienByNoreg');
            Route::get('get-diagnosa-10-by-noregrirj', 'Registrasi\RegistrasiController@getDiagnosaPasienByNoregrirj');

            Route::post('save-spri', 'Registrasi\RegistrasiController@saveSPRI');
            Route::post('save-rencanakontrol', 'Registrasi\RegistrasiController@saveRencanaKontrol');
            Route::get('get-pasien-daftar-by-noreg', 'Registrasi\RegistrasiController@getPasienDaftarByNoreg');
            Route::get('get-surat-kontrol', 'Registrasi\RegistrasiController@getSuratKontrol');
            Route::get('get-antrian-pasien-diperiksa-by-noreg', 'Registrasi\RegistrasiController@getAntrianPasienDiperiksaByNoreg');
            Route::post('delete-diagnosa-tindakan-pasien', 'Registrasi\RegistrasiController@deleteDiagnosaTindakanPasien');
            Route::post('save-diagnosa-pasien', 'Registrasi\RegistrasiController@saveDiagnosaPasien');
            Route::post('save-diagnosa-pasien-target', 'Registrasi\RegistrasiController@saveDiagnosaPasienTarget');
            Route::post('save-diagnosa-pasien-target-idrg', 'Registrasi\RegistrasiController@saveDiagnosaPasienTargetIDRG');
            Route::post('save-diagnosa-tindakan-pasien', 'Registrasi\RegistrasiController@saveDiagnosaTindakanPasien');
            Route::post('save-diagnosa-tindakan-pasien-target', 'Registrasi\RegistrasiController@saveDiagnosaTindakanPasienTarget');
            Route::get('get-anamnesis', 'Registrasi\RegistrasiController@getAnamnesis');
            Route::get('get-resume-medis-inap/{nocm}', 'Registrasi\RegistrasiController@getResumeMedisInap');
            Route::post('save-diagnosa-inacbg', 'Registrasi\RegistrasiController@saveDiagnosaInacbg');
            Route::post('save-diagnosa-inacbg9', 'Registrasi\RegistrasiController@saveDiagnosaInacbg9');
            Route::post('save-diagnosa-idrg', 'Registrasi\RegistrasiController@saveDiagnosaIdrg');
            Route::post('daftar-antrian-pasien/save-primary-diagnosa-pasien', 'Registrasi\RegistrasiController@saveAsPrimaryDiagnosaPasien');

            Route::get('get-image', 'Registrasi\RegistrasiController@getImage');
            Route::get('store-image-to-folder/{nocm}', 'Registrasi\RegistrasiController@storeImageToFolder');
            Route::post('save-image', 'Registrasi\RegistrasiController@saveImage');
            Route::post('hapus-pemakaian-asuransi', 'Registrasi\RegistrasiController@hapusPemakaianAsuransi');
            Route::get('get-hasil-pengunjung', 'Registrasi\RegistrasiController@getHasilRegistrasi');

            Route::post('merge-nomor-rm', 'Registrasi\RegistrasiController@saveMergeNoRM');
            Route::post('save-log-mergenocm', 'Registrasi\RegistrasiController@saveLoggingMergeNocm');
            Route::post('update-sep-igd', 'Registrasi\RegistrasiController@updateSEPIGD');
            Route::get('get-foto-by-id/{idpasien}', 'Registrasi\RegistrasiController@getFotoById');
            Route::get('get-jumlahpasien-dokterdpjp', 'Registrasi\LaporanPengunjungController@getJumlahPasienDokterDPJP');
            Route::get('get-data-pasien-masuk-sentra-visum', 'Registrasi\RegistrasiController@getPasienMasukSentraVisum');
            Route::post('save-pasien-to-draft', 'Registrasi\RegistrasiController@savePasienToDraft');
            Route::get('get-draft-pasien-sentra-visum', 'Registrasi\RegistrasiController@getDraftPasienSentraVisum');
            Route::post('save-hasil-satu-visum', 'Registrasi\RegistrasiController@saveHasilSatuVisum');
            Route::get('get-koreksi-i-pasien-sentra-visum', 'Registrasi\RegistrasiController@getKoreksiIPasienSentraVisum');
            Route::post('save-catatan-visum', 'Registrasi\RegistrasiController@saveCatatanVisum');
            Route::get('get-hasil-i-pasien-sentra-visum', 'Registrasi\RegistrasiController@getHasilSatuPasienSentraVisum');
            Route::post('save-hasil-dua-visum', 'Registrasi\RegistrasiController@saveHasilDuaVisum');
            Route::get('get-koreksi-ii-pasien-sentra-visum', 'Registrasi\RegistrasiController@getKoreksiIIPasienSentraVisum');
            Route::get('get-koreksi-i', 'Registrasi\RegistrasiController@getKoreksiI');
            Route::post('save-to-spesialis', 'Registrasi\RegistrasiController@saveToSpesialis');
            Route::get('get-spesialis-pasien-sentra-visum', 'Registrasi\RegistrasiController@getSpesialisPasienSentraVisum');
            Route::post('save-spesialis-visum', 'Registrasi\RegistrasiController@saveSpesialisVisum');
            Route::get('get-hasil-spesialis-pasien-sentra-visum', 'Registrasi\RegistrasiController@getHasilSpesialisPasienSentraVisum');
            Route::post('save-hasil-spesialis-visum', 'Registrasi\RegistrasiController@saveHasilSpesialisVisum');
            Route::post('save-to-print-admin', 'Registrasi\RegistrasiController@saveToPrintAdmin');
            Route::get('get-print-pasien-sentra-visum', 'Registrasi\RegistrasiController@getPrintPasienSentraVisum');
            Route::get('git-tinggil-hirif', 'Registrasi\RegistrasiController@getDateHuruf');
            Route::post('save-koreksi-i-to-spesialis', 'Registrasi\RegistrasiController@saveKoreksiIToSpesialis');
            Route::post('save-to-koreksi-ii', 'Registrasi\RegistrasiController@saveToKoreksiII');
            Route::get('get-ruangan-login-user', 'Registrasi\RegistrasiController@getRuanganLoginUser');
            Route::get('get-detail-pasien-sentra-visum', 'Registrasi\RegistrasiController@getDetailPasienSentraVisum');
            Route::post('save-to-ka-instalasi', 'Registrasi\RegistrasiController@saveToKaInstalasi');
            Route::get('get-ka-instalasi-pasien-sentra-visum', 'Registrasi\RegistrasiController@getKaInstalasiPasienSentraVisum');
            Route::get('get-logging-sentra-visum', 'Registrasi\RegistrasiController@getLoggingSentraVisum');
            Route::post('save-to-diserahkan', 'Registrasi\RegistrasiController@saveToDiserahkan');
            Route::get('get-diserahkan-pasien-sentra-visum', 'Registrasi\RegistrasiController@getDiserahkanPasienSentraVisum');
            Route::post('save-data-diserahkan', 'Registrasi\RegistrasiController@saveDataDiserahkan');
            Route::post('save-draft-visum', 'Registrasi\RegistrasiController@saveDraft');
            Route::get('get-draft-visum', 'Registrasi\RegistrasiController@getDraftVisum');
            Route::post('save-catatan', 'Registrasi\RegistrasiController@simpanCatatan');
            Route::get('get-catatan-visum', 'Registrasi\RegistrasiController@getCatatanVisum');
            Route::get('get-angka-titik', 'Registrasi\RegistrasiController@getAngkaTitik');
            Route::post('updatenocmlamakebaru', 'Registrasi\RegistrasiController@updatenocmlamakebaru');
            Route::get('get-pegawai-part-2', 'Registrasi\RegistrasiController@getPegawaiPart2');
            Route::get('get-ttd-ppa-all', 'Registrasi\RegistrasiController@getTandaTanganPpaAll');
            Route::post('delete-ttd-ppa', 'Registrasi\RegistrasiController@deleteTtdPpa');
            Route::get('get-ttd-ppa-1', 'Registrasi\RegistrasiController@getTtdPpa');
            Route::post('save-ttd-ppa', 'Registrasi\RegistrasiController@saveTandaTanganPpa');
            Route::get('get-pasien-antrol', 'Registrasi\RegistrasiController@getPasienAntrol');

            Route::group(['prefix' => 'daftar-registrasi'], function () {
                // 2019-12 penambahan arif awal                
                Route::get('get-daftar-registrasi-pasien-db-lama', 'Registrasi\RegistrasiController@getDaftarRegistrasiPasienOperatordblama');
                Route::get('get-riwayat-pasien-db-lama-by-rm', 'Registrasi\RegistrasiController@getRiwayatPasiendblamaByRm');
                Route::get('get-data-combo-operator-db-lama', 'Registrasi\RegistrasiController@getDataComboOperatordblama');
                // 2019-12 penambahan arif akhir
                Route::get('get-daftar-pasien-rawat', 'Registrasi\RegistrasiController@getDaftarPasienRawat');
                Route::get('get-daftar-pasien-dokter', 'Registrasi\RegistrasiController@getDaftarPasienDokter');
                Route::get('get-pd-from-apd', 'Registrasi\RegistrasiController@getPDFromAPD');
                Route::get('get-daftar-pasien-rawat-dua', 'Registrasi\RegistrasiController@getDaftarPasienRawatDua');
                Route::get('get-hasil-lab-rawat', 'Registrasi\RegistrasiController@getHasilLabRawat');
                Route::get('get-hasil-rad-rawat', 'Registrasi\RegistrasiController@getHasilRadRawat');
                Route::get('get-rawat-detail', 'Registrasi\RegistrasiController@getDataPasienPoldaDetail');
                Route::get('get-daftar-registrasi-pasien', 'Registrasi\RegistrasiController@getDaftarRegistrasiPasienOperator');
                Route::get('get-daftar-registrasi-pasien-purif-mandiri', 'Registrasi\RegistrasiController@getDaftarRegistrasiPasienOperatorPurifMandiri');
                Route::get('get-daftar-pasien-non-rujukan', 'Registrasi\RegistrasiController@getDaftarPasienNonRujukan');
                Route::get('get-data-combo-operator', 'Registrasi\RegistrasiController@getDataComboOperator');
                Route::get('get-data-combo-operator-select', 'Registrasi\RegistrasiController@getDataComboOperatorSelect');
                Route::get('get-data-combo-faskes', 'Registrasi\RegistrasiController@getDataComboFaskes');
                Route::get('get-data-diagnosa', 'Registrasi\RegistrasiController@getDiagnosaDaftarAntrian');
                Route::post('update-tgl-pulang', 'Registrasi\RegistrasiController@updateTanggalPulang');
                Route::post('update-nosep', 'Registrasi\RegistrasiController@updateNoSEP');
                Route::post('update-dokter', 'Registrasi\RegistrasiController@simpanUpdateDokters');
                Route::get('get-data-diagnosa-pasien', 'Registrasi\RegistrasiController@getDiagnosaPasienByNoreg');
                Route::post('save-diagnosa-rmk', 'Registrasi\RegistrasiController@saveDiagnosaPasienRMK');
                Route::get('get-data-pasien-mau-batal', 'Registrasi\RegistrasiController@getDataPasienMauBatal');
                Route::get('get-data-pasien-mau-bataludahkso', 'Registrasi\RegistrasiController@getDataPasienMauBataludahkso');
                Route::post('save-batal-registrasi', 'Registrasi\RegistrasiController@SimpanBatalPeriksa');
                Route::get('get-acc-number-radiologi', 'Registrasi\RegistrasiController@getAccNumberRadiologi');
                Route::get('get-apd', 'Registrasi\RegistrasiController@getAPD');
                Route::get('get-hasil-lab', 'Registrasi\RegistrasiController@getHasilLab');
                // trisno
                Route::get('get-hasil-lab-inacbg', 'Registrasi\RegistrasiController@getHasilLabInaCbg');
                Route::get('get-status-claim-pd', 'Registrasi\RegistrasiController@getStatusClaimPd');
                Route::get('get-daftar-order-hasil-lab', 'Registrasi\RegistrasiController@getDaftarHasilLab');
                Route::get('get-daftar-order-hasil-rad', 'Registrasi\RegistrasiController@getDaftarHasilRad');
                Route::get('get-status-claim-pp', 'Registrasi\RegistrasiController@getStatusClaimPp');
                Route::get('get-status-rm-pp', 'Registrasi\RegistrasiController@getStatusRMPp');
                Route::get('get-daftar-rm-pp', 'Registrasi\RegistrasiController@getDaftarRMPp');
                Route::get('get-daftar-bedah-pp', 'Registrasi\RegistrasiController@getDaftarBedahPp');
                Route::get('get-daftar-tahun-pajak', 'Registrasi\RegistrasiController@getDaftarTahunPajak');
                Route::get('get-daftar-registrasi-pasien-antrol', 'Registrasi\RegistrasiController@r');
            });
            Route::group(['prefix' => 'dokumenrm'], function () {
                Route::get('get-pasien-by-nocm', 'Registrasi\KendaliDokumenRMController@getPasienByNoCm');
                Route::get('get-daftar-registrasi', 'Registrasi\KendaliDokumenRMController@getPasienDaftar');
                Route::get('get-daftar-kendali-dokumen', 'Registrasi\KendaliDokumenRMController@getDaftarKendaliDokumen');
                Route::post('save-kendali-dokumen', 'Registrasi\KendaliDokumenRMController@saveKendaliDokRM');
                Route::post('update-kendali-dokumen', 'Registrasi\KendaliDokumenRMController@updateKendaliDokRM');
                Route::get('get-data-combo-kdrm', 'Registrasi\KendaliDokumenRMController@getDataCombo');
                Route::get('get-data-kendali', 'Registrasi\KendaliDokumenRMController@getDataTambahKendali');
                Route::get('get-data', 'Registrasi\KendaliDokumenRMController@getDataKendali');
                Route::get('get-laporan-tracer', 'Registrasi\KendaliDokumenRMController@getLaporanTracer');

                Route::get('get-cekdata', 'Registrasi\KendaliDokumenRMController@getCekNorm');
                Route::get('get-combo-dokumen-rekmed', 'EMR\EMRController@getComboDokRekMed');
                Route::get('get-daftar-dokumen-rekmed', 'Registrasi\KendaliDokumenRMController@getDaftarDokumenRekamMedis');
                Route::get('get-daftar-dokumen-rekmed-rjri', 'Registrasi\KendaliDokumenRMController@getDaftarDokumenRekamMedisRjRi');
                Route::get('get-daftar-dokumen-rekmed-rjri-2', 'Registrasi\KendaliDokumenRMController@getDaftarDokumenRekamMedisRjRi2');
                Route::get('get-rekap-dokumen-rekmed', 'Registrasi\KendaliDokumenRMController@getRekapDokumenRekamMedis');
                Route::get('get-daftar-dokumen-rekmed-belumkembali', 'Registrasi\KendaliDokumenRMController@getDaftarDokumenRekamMedisBelumKembali');


                Route::get('get-histori-dokumen-rekmed/{nocm}', 'Registrasi\KendaliDokumenRMController@getHistoriDokumenRekmed');
                Route::post('updatetglterima', 'Registrasi\KendaliDokumenRMController@updateDokumenTerima');
                Route::post('alamat', 'Registrasi\KendaliDokumenRMController@perbaikannocm');
                Route::post('save-dokumen-rekmed', 'Registrasi\KendaliDokumenRMController@saveDokumenRekamMedis');
                Route::post('hapuskendali', 'Registrasi\KendaliDokumenRMController@hapuskendali');
                Route::post('cetakTracer', 'Registrasi\KendaliDokumenRMController@cetakTracer');


                // Route::get('get-combo-cppt', 'EMR\EMRController@getComboCppt');

            });
            Route::group(['prefix' => 'orderlabel'], function () {
                Route::get('get-pasienbynoreg', 'Registrasi\OrderLabelController@getPasienDaftarByNoreg');
                Route::post('save-order-label', 'Registrasi\OrderLabelController@saveOrderLabel');
                Route::post('delete-order-label', 'Registrasi\OrderLabelController@deleteOrderLabel');
                Route::get('get-daftar-permintaan', 'Registrasi\OrderLabelController@getDaftarPermintaan');
                Route::get('get-data-combo', 'Registrasi\OrderLabelController@getDataCombo');
                Route::post('save-update-order-label', 'Registrasi\OrderLabelController@simpanUpdatePenerimaLabel');
            });
            Route::group(['prefix' => 'laporan'], function () {
                Route::get('get-operasi', 'Registrasi\LaporanRegistrasiController@getOperasi');
                Route::get('get-data-combo-laporan', 'Registrasi\LaporanRegistrasiController@getDataCombo');
                Route::get('get-data-combo-laporan-select', 'Registrasi\LaporanRegistrasiController@getDataComboSelect');
                Route::get('get-combo-polda', 'Registrasi\LaporanRegistrasiController@getComboPolda');
                Route::get('get-laporan-pasien-daftar', 'Registrasi\LaporanRegistrasiController@getDataLaporanPasienDaftar');
                Route::get('get-data-pasien-masuk-ranap', 'Registrasi\LaporanRegistrasiController@getDataLaporanPasienMasukRawatInap');
                Route::get('get-data-pasien-masuk-ranapri', 'Registrasi\LaporanRegistrasiController@getDataLaporanPasienMasukRawatInapri');
                Route::get('get-data-pasien-keluar-ruangan-ranap', 'Registrasi\LaporanRegistrasiController@getDataLaporanPasienKeluarRuanganRawatInap');
                Route::get('get-data-pasien-pindahan', 'Registrasi\LaporanRegistrasiController@getDataLaporanPasienPindahan');
                Route::get('get-data-pasien-meninggal', 'Registrasi\LaporanRegistrasiController@getDataLaporanPasienMeninggalRuangan');
                Route::get('get-data-pasien-meninggal-doa', 'Registrasi\LaporanRegistrasiController@getDataLaporanPasienMeninggalDOA');
                Route::get('get-data-pasien-informasi-ruangan', 'Registrasi\LaporanRegistrasiController@getDataLaporanInformasiRuangan');
                Route::get('get-data-pasien-dipindahan', 'Registrasi\LaporanRegistrasiController@getDataLaporanPasienDipindahankan');
                Route::get('get-laporan-pasien-pulang', 'Registrasi\LaporanRegistrasiController@getDataLaporanPasienPulang');
                Route::get('get-laporan-pasien-pulangNew', 'Registrasi\LaporanRegistrasiController@getDataLaporanPasienPulangNew');
                Route::get('get-laporan-pasien-pulangCsr', 'Registrasi\LaporanRegistrasiController@getDataLaporanPasienPulangCsr');
                Route::get('get-rekap-csr', 'Registrasi\LaporanRegistrasiController@getRekapCsr');
                Route::post('post-laporan-pasien-pulang', 'Registrasi\LaporanRegistrasiController@CetakLaporanPasienPulang');
                Route::get('get-data-lap-pendapatan-poli', 'Registrasi\LaporanRegistrasiController@getDataLaporanPendapatanPoli');
                Route::get('get-detail-layanan', 'Registrasi\LaporanRegistrasiController@getLaporanLayanan');
                Route::get('get-data-jadwaldokter-lap', 'Registrasi\LaporanRegistrasiController@getJadwalDokter');
                Route::post('post-laporan-layanan', 'Registrasi\LaporanRegistrasiController@CetakLaporanLayanan');
                Route::get('get-produk-part', 'Registrasi\LaporanRegistrasiController@getDataProduk');
                Route::get('get-data-lap-pasien-baru-lama', 'Registrasi\LaporanRegistrasiController@GetLaporanPasienBaruLama');
                Route::get('get-laporan-cetak-kartu', 'Registrasi\LaporanRegistrasiController@GetLaporanCetakKartu');
                Route::get('get-laporan-pasien-daftar2', 'Registrasi\LaporanRegistrasiController@getDataLaporanPasienDaftar2');
                Route::get('get-detail-jaspel-cianjur', 'Registrasi\LaporanRegistrasiController@getLaporanJaspelCianjur');
                // all
                Route::get('get-laporan-pasien-daftar-kesatuan', 'Registrasi\LaporanRegistrasiController@getDataLaporanPasienDaftarBkesatuan');
                Route::get('get-data-bridging-dinkes', 'Registrasi\LaporanRegistrasiController@getDataBridgingDinkes');
                Route::post('send-data-bridging-dinkes', 'Registrasi\LaporanRegistrasiController@sendDataBridgingDinkes');
                Route::get('get-data-diagnosa-bridging', 'Registrasi\LaporanRegistrasiController@getDataDiagnosaBridging');
                Route::post('send-data-diagnosa-bridging-dinkes', 'Registrasi\LaporanRegistrasiController@sendDataDiagnosaBridgingDinkes');
                Route::get('get-laporan-pasien-daftar-user', 'Registrasi\LaporanRegistrasiController@getDataLaporanPasienDaftarUser');
                Route::get('get-laporan-pasien-daftar-unand', 'Registrasi\LaporanRegistrasiController@getDataLaporanPasienDaftarUnand');
                Route::get('get-laporan-pelayanan-pasien', 'Registrasi\LaporanRegistrasiController@getDataLaporanPelayananPasien');
                Route::post('save-ruangan-data', 'Registrasi\LaporanRegistrasiController@saveRuanganData');
                Route::post('save-edit-ruangan', 'Registrasi\LaporanRegistrasiController@saveEditRuangan');
                Route::post('save-delete-ruangan', 'Registrasi\LaporanRegistrasiController@saveDeleteRuangan');


                Route::get('get-data-combo-tindakan', 'Registrasi\LaporanRegistrasiController@getTindakan');
                Route::get('get-data-combo-tindakan-all', 'Registrasi\LaporanRegistrasiController@getTindakanAll');
                Route::get('get-harga-komponen', 'Registrasi\LaporanRegistrasiController@getHargaKomponen');
                Route::get('get-laporan-sudah-isi-cppt-emr-igd', 'Registrasi\LaporanRegistrasiController@GetLaporanCPPTIGD');
                Route::get('get-laporan-sudah-isi-cppt-emr', 'Registrasi\LaporanRegistrasiController@GetLaporanCPPT');
                Route::get('get-laporan-sudah-isi-cppt-emr-new', 'Registrasi\LaporanRegistrasiController@GetLaporanCPPTNew');
                Route::get('get-laporan-sudah-isi-cppt-emr-new-2', 'Registrasi\LaporanRegistrasiController@getLaporanCpptNew2');
                Route::get('get-laporan-sudah-isi-triase-igd', 'Registrasi\LaporanRegistrasiController@GetLaporanTriaseIgd');

                Route::get('get-produk-mapping-rl', 'Registrasi\LaporanRekamMedisController@getProdukMapLaporanRL');
                Route::get('get-mapping-rl', 'Registrasi\LaporanRekamMedisController@getMapLaporanRL');
                Route::get('get-laporan-rekap-pengunjung-detail-ri', 'Registrasi\LaporanRekamMedisController@getLaporanPengunjungPolriDetailRI');
                Route::get('get-laporan-rekap-pengunjung-ri', 'Registrasi\LaporanRekamMedisController@getLaporanPengunjungPolriRI');
                Route::post('save-mapping-rl', 'Registrasi\LaporanRekamMedisController@SaveMappingRl');
                Route::post('delete-mapping-rl', 'Registrasi\LaporanRekamMedisController@deleteMapProdukToLaporanRL');
                Route::get('get-combo-mapping-rl', 'Registrasi\LaporanRekamMedisController@getComboMappingRL');
                Route::post('delete-kelompokproduk-rl', 'Registrasi\LaporanRekamMedisController@deleteKelompokLaporan');
                Route::post('simpan-kelompokproduk-rl', 'Registrasi\LaporanRekamMedisController@simpanKelompokLaporan');

                Route::get('get-laporan-rl12', 'Registrasi\LaporanRekamMedisController@getDataRL31RawatInap');
                Route::get('get-laporan-rl31', 'Registrasi\LaporanRekamMedisController@getDataRL31RawatInap');
                Route::get('get-laporan-rl32', 'Registrasi\LaporanRekamMedisController@getLaporanRL32RawatDarurat');
                Route::get('get-laporan-rl33', 'Registrasi\LaporanRekamMedisController@getKegiatanKesehatanGigidanMulut');
                Route::get('get-laporan-rl34', 'Registrasi\LaporanRekamMedisController@getLaporanRL34Kebidanan');
                Route::get('get-laporan-rl35', 'Registrasi\LaporanRekamMedisController@getLaporanRL35Perinatologi');
                Route::get('get-laporan-rl36', 'Registrasi\LaporanRekamMedisController@getLaporanRL36Pembedahan');
                Route::get('get-laporan-rl37', 'Registrasi\LaporanRekamMedisController@getLaporanRL37');
                Route::get('get-laporan-rl38', 'Registrasi\LaporanRekamMedisController@getPemeriksaanLab');
                Route::get('get-laporan-rl39', 'Registrasi\LaporanRekamMedisController@getPelayananRehab');
                Route::get('get-laporan-rl310', 'Registrasi\LaporanRekamMedisController@getLaporanRL310Khusus');
                Route::get('get-laporan-rl311', 'Registrasi\LaporanRekamMedisController@getLaporanRL311KesehatanJiwa');
                Route::get('get-laporan-rl312', 'Registrasi\LaporanRekamMedisController@getLaporanRL312KeluargaBerencana');
                Route::get('get-laporan-rl313', 'Registrasi\LaporanRekamMedisController@getPengadaanObat');
                Route::get('get-laporan-rl313-2', 'Registrasi\LaporanRekamMedisController@getPelayananResep');
                Route::get('get-laporan-rl314', 'Registrasi\LaporanRekamMedisController@getRL314Rujukan');
                Route::get('get-laporan-rl315', 'Registrasi\LaporanRekamMedisController@getRL315CaraBayar');
                Route::get('get-laporan-rl4a', 'Registrasi\LaporanRekamMedisController@getLaporanRL4aRawatInap');
                Route::get('get-laporan-rl4a-new', 'Registrasi\LaporanRekamMedisController@getLaporanRL4aRawatInapnew');
                Route::get('get-laporan-rl4a-new-menular', 'Registrasi\LaporanRekamMedisController@getLaporanRL4aRawatInapnewMenular');
                Route::get('get-laporan-rl4b', 'Registrasi\LaporanRekamMedisController@getLaporanRL4b');
                Route::get('get-laporan-rl4b-new', 'Registrasi\LaporanRekamMedisController@getLaporanRL4bnew');
                Route::get('get-laporan-rl4b-new-menular', 'Registrasi\LaporanRekamMedisController@getLaporanRL4bnewMenular');
                Route::get('get-laporan-rl51', 'Registrasi\LaporanRekamMedisController@getDataLaporanRL51');
                Route::get('get-laporan-rl52', 'Registrasi\LaporanRekamMedisController@getDataLaporanRL52');
                Route::get('get-laporan-rl53', 'Registrasi\LaporanRekamMedisController@getDataLaporanRL53');
                Route::get('get-laporan-rl54', 'Registrasi\LaporanRekamMedisController@getDataLaporanRL54');
                Route::get('get-edit-diagnosa', 'Registrasi\LaporanRekamMedisController@getEditDiagnosa');
                Route::get('get-combo-edit-diagnosa', 'Registrasi\LaporanRekamMedisController@getComboEditDiagnosa');
                Route::post('save-hasil-edit-diagnosa', 'Registrasi\LaporanRekamMedisController@saveHasilEditDiagnosa');
                Route::get('get-laporan-rekap-kunjungan', 'Registrasi\LaporanRekamMedisController@getLaporanKunjunganPolri');
                Route::get('get-laporan-rekap-kunjungan-radiologi', 'Registrasi\LaporanRekamMedisController@getLaporanKunjunganPolriRadiologi');
                Route::get('get-laporan-rekap-pengunjung', 'Registrasi\LaporanRekamMedisController@getLaporanPengunjungPolri');
                Route::get('get-laporan-rekap-pengunjung-kso', 'Registrasi\LaporanRekamMedisController@getLaporanPengunjungPolriKso');
                Route::get('get-laporan-rekap-pengunjung-ksoverif', 'Registrasi\LaporanRekamMedisController@getLaporanPengunjungPolriKsoverif');
                Route::get('get-laporan-rekap-pengunjung-ksoverifv2', 'Registrasi\LaporanRekamMedisController@getLaporanPengunjungPolriKsoverifv2');
                Route::get('get-laporan-rekap-pengunjung-detail', 'Registrasi\LaporanRekamMedisController@getLaporanPengunjungPolriDetail');
                Route::get('get-laporan-rekap-pengunjung-detail2', 'Registrasi\LaporanRekamMedisController@getLaporanPengunjungPolriDetail2');
                Route::get('get-laporan-rekap-pengunjung-detailverif', 'Registrasi\LaporanRekamMedisController@getLaporanPengunjungPolriDetailverif');
                Route::get('get-laporan-rekap-pengunjung-detailveriftemp', 'Registrasi\LaporanRekamMedisController@getLaporanPengunjungPolriDetailveriftemp');
                Route::get('get-laporan-rekap-pengunjung-detailverifcek', 'Registrasi\LaporanRekamMedisController@getLaporanPengunjungPolriDetailverifcek');
                Route::get('get-laporan-rekap-pengunjung-detailverifdeletetemp', 'Registrasi\LaporanRekamMedisController@getLaporanPengunjungPolriDetailverifdeletetemp');
                Route::get('get-laporan-rekap-pengunjung-detailverifdelete', 'Registrasi\LaporanRekamMedisController@getLaporanPengunjungPolriDetailverifdelete');
                Route::get('get-laporan-rekap-pengunjung-detailverifcari', 'Registrasi\LaporanRekamMedisController@getLaporanPengunjungPolriDetailverifcari');
                Route::get('get-laporan-rekap-pengunjung-detailverifcariselisih', 'Registrasi\LaporanRekamMedisController@getLaporanPengunjungPolriDetailverifcariselisih');
                Route::get('get-kso', 'Registrasi\LaporanRekamMedisController@getLaporanKso');
                Route::get('get-ksononbpjs', 'Registrasi\LaporanRekamMedisController@getLaporanKsononbpjs');
                Route::get('get-Laporan-Monitoring-Klaim', 'Registrasi\LaporanRekamMedisController@getLaporanMonitoringKlaim');
                // testing
                Route::get('get-Testing', 'Registrasi\LaporanRekamMedisTestingController@getTesting');

                Route::get('get-laporan-rekap-golongan', 'Registrasi\LaporanRekamMedisController@getLaporanGolonganPolri');
                Route::get('get-laporan-rekap-bayar', 'Registrasi\LaporanRekamMedisController@getLaporanBayarPolri');
                Route::get('get-laporan-rekap-kunjungan-detail', 'Registrasi\LaporanRekamMedisController@getLaporanKunjunganPolriDetail');
                // Tambahan dari trisno
                Route::get('get-laporan-pasien-covid', 'Registrasi\LaporanRekamMedisController@getLaporanPasienCovid');

                Route::get('get-data-lap-pasien-masuk', 'Registrasi\LaporanRekamMedisController@getDataLaporanPasienMasuk');
                Route::get('get-data-lap-pasien-keluar', 'Registrasi\LaporanRekamMedisController@getDataLaporanPasienKeluar');
                Route::get('get-data-lap-pasien-pindahan', 'Registrasi\LaporanRekamMedisController@getLaporanPasienPindahan');
                Route::get('get-data-lap-rincian-pelayanan', 'Registrasi\LaporanRegistrasiController@getDataLaporanRincianPelayanan');
                Route::get('get-data-lap-pengunjung', 'Registrasi\LaporanPengunjungController@getLaporanPengunjung');
                Route::get('get-data-lap-pengunjung-2', 'Registrasi\LaporanPengunjungController@getLaporanPengunjung2');
                Route::get('get-daftar-hasil-rikkes', 'Registrasi\LaporanPengunjungController@getDaftarHasilRikkes');
                Route::get('get-pegawai-belum-rikkes', 'Registrasi\LaporanPengunjungController@getPegawaiBelumRikkes');
                Route::get('get-hasil-lab-rikkes', 'Registrasi\LaporanPengunjungController@getHasilLabRikkes');
                Route::get('get-combo-box-laporan-pengunjung', 'Registrasi\LaporanPengunjungController@getDataCombo');

                Route::get('get-combo-box-laporan-summary', 'Registrasi\RegistrasiController@getDataComboSummary');
                Route::get('get-ruangan-perawatan-covid-combo', 'Registrasi\RegistrasiController@getRuanganPerawatanCovidCombo');
                Route::get('get-combo-buat-surat', 'Registrasi\RegistrasiController@getComboBuatSurat');
                Route::get('get-hasil-lab-surat', 'Registrasi\RegistrasiController@getHasilLabSurat');
                Route::get('get-template', 'Registrasi\RegistrasiController@getTemplateBuatSurat');
                Route::get('get-ruangan-perawatan-covid', 'Registrasi\RegistrasiController@getRuanganPerawatanCovid');
                Route::get('get-data-lap-summary-kunjungandetail', 'Registrasi\RegistrasiController@getLaporanSummaryKunjungangerdetail');
                Route::get('get-data-lap-summary-kunjungandetailruangan', 'Registrasi\RegistrasiController@getLaporanSummaryKunjungangerdetairuanganl');
                Route::get('get-data-lap-summary-kunjungan', 'Registrasi\RegistrasiController@getLaporanSummaryKunjungan');
                Route::get('get-data-lap-summary-ger', 'Registrasi\RegistrasiController@getLaporanSummaryKunjunganger');
                Route::get('get-data-lap-summary-ger2', 'Registrasi\RegistrasiController@getLaporanSummaryKunjunganger2');
                Route::get('get-data-lap-summary-pendidikan', 'Registrasi\RegistrasiController@getLaporanSummaryPendidikan');
                Route::get('get-data-lap-summary-daerah', 'Registrasi\RegistrasiController@getLaporanSummaryDaerah');
                Route::get('get-data-lap-summary-daerahkecamatan', 'Registrasi\RegistrasiController@getLaporanSummaryDaerahkecamatan');
                Route::get('get-data-lap-summary-pekerjaan', 'Registrasi\RegistrasiController@getLaporanSummaryPekerjaan');
                Route::get('get-data-lap-summary-agama', 'Registrasi\RegistrasiController@getLaporanSummaryAgama');
                Route::get('get-data-lap-pengunjung-tindakan', 'Registrasi\LaporanPengunjungController@getLaporanPengunjungTindakan');
                Route::get('get-data-lap-kegiatan-rj', 'Registrasi\RegistrasiController@getLaporanKegiatanRJ');
                Route::get('get-data-lap-pengunjung-pemeriksaan', 'Registrasi\LaporanPengunjungController@getLaporanPengunjungPemeriksaan');
                Route::get('get-laporan-topten-diagnosa', 'Registrasi\RegistrasiController@getTopTenDiagnosa');
                Route::get('get-detail-topten-diagnosa', 'Registrasi\RegistrasiController@getDetailDiagnosa');
                Route::get('get-data-lap-kinerja-bayar-rj', 'Registrasi\RegistrasiController@getLaporanKinerjaBayarRJ');
                Route::get('get-sensus-harian-detail', 'Registrasi\RegistrasiController@getSensusHarianDetail');
                Route::get('get-data-lap-kinerja-bayar-ri', 'Registrasi\RegistrasiController@getLaporanKinerjaBayarRI');
                Route::get('get-sensus-harian', 'Registrasi\RegistrasiController@getSensusHarian');
                Route::get('get-data-lap-kinerja-kun-igd', 'Registrasi\RegistrasiController@getLaporanKinerjaKunjunganIGD');
                Route::get('get-data-lap-kinerja-pengunjung', 'Registrasi\RegistrasiController@getLaporanKinerjaPengunjung');
                Route::get('get-data-pasien-polda', 'Registrasi\RegistrasiController@getDataPasienPolda');
                Route::get('get-data-pasien-polda-sudah-pulang', 'Registrasi\RegistrasiController@getDataPasienPoldaSudahPulang');
                Route::get('get-data-pasien-polda-belum-pulang', 'Registrasi\RegistrasiController@getDataPasienPoldaBelumPulang');
                Route::get('get-data-lap-respon-time-tracer', 'Registrasi\RegistrasiController@getLaporanResponTimeTracer');
                Route::get('get-data-respon-time-poliklinik', 'Registrasi\RegistrasiController@getResponTimePoliklinik');
                Route::get('get-data-lap-kinerja-kunjungan', 'Registrasi\RegistrasiController@getLaporanKinerjaKunjungan');
                Route::get('get-data-lap-kinerja-rawat-inap', 'Registrasi\RegistrasiController@getLaporanKinerjaRawatInap');
                Route::get('get-data-lap-summary-usia', 'Registrasi\RegistrasiController@getLaporanSummaryUsia');
                Route::get('get-laporan-topten-diagnosa-detail', 'Registrasi\RegistrasiController@getTopTenDiagnosaDetail');

                Route::get('get-pasien-pemeriksaan-kedokteran-forensik', 'Registrasi\RegistrasiController@getPasienPemeriksaanKedokteranForensik');
                Route::get('get-pegawai-all', 'Registrasi\RegistrasiController@getPegawaiAll');
                Route::post('save-pemeriksaan-dokter-forensik', 'Registrasi\RegistrasiController@savePemeriksaanDokterForensik');
                Route::get('get-pemeriksaan-dokter-forensik', 'Registrasi\RegistrasiController@getPemeriksaanDokterForensik');
                Route::get('get-data-lap-demografi-ri-kel', 'Registrasi\RegistrasiController@getLaporanDemoRIKelompok');
                Route::get('get-data-lap-demografi-ri-pen', 'Registrasi\RegistrasiController@getLaporanDemoRIPendidikan');
                Route::get('get-data-lap-demografi-ri-daer', 'Registrasi\RegistrasiController@getLaporanDemoRIDaerah');
                Route::get('get-data-lap-demografi-ri-daerkec', 'Registrasi\RegistrasiController@getLaporanDemoRIDaerahRI');
                Route::get('get-data-lap-demografi-ri-pek', 'Registrasi\RegistrasiController@getLaporanDemoRIPekerjaan');
                Route::get('get-data-lap-demografi-ri-usia', 'Registrasi\RegistrasiController@getLaporanDemoRIUsia');
                Route::get('get-data-lap-demografi-ri-agama', 'Registrasi\RegistrasiController@getLaporanDemoRIAgama');
                Route::get('get-data-lap-demografi-ri-item', 'Registrasi\RegistrasiController@getLaporanDemoRIItem');
                Route::get('get-data-lap-target-realisasi', 'Registrasi\RegistrasiController@getLaporanTargetRealisasi');
                Route::get('get-data-lap-indikator-pelayanan', 'Registrasi\RegistrasiController@getLaporanIndikatorPelayanan');
                Route::get('get-data-lap-jumlah-pasien-cara', 'Registrasi\RegistrasiController@getLaporanJumlahPasienDanCaraBayar');
                Route::get('get-data-lap-jumlah-pasien-cara-igd', 'Registrasi\RegistrasiController@getLaporanJumlahPasienDanCaraBayarIGD');
                Route::get('get-kinerja-pelayanan-ranap', 'Registrasi\LaporanRegistrasiController@getKinerjaPelayananRanap');
                Route::get('get-kinerja-pelayanan-ranap-tahunan', 'Registrasi\LaporanRegistrasiController@getKinerjaPelayananRanapTahunan');
                Route::get('get-data-lap-tindakan-ruangan', 'Registrasi\LaporanPengunjungController@getLaporanTindakanRuangan');
                Route::get('get-data-lap-pasien-dokter', 'Registrasi\LaporanPengunjungController@getLaporanJumlahPasienDokter');
                Route::get('get-rekap-pasien-online', 'Registrasi\LaporanRegistrasiController@getLaporanRekapPasienOnline');
                Route::get('get-rekap-pasien-online-poli', 'Registrasi\LaporanRegistrasiController@getRekapPasienOnlinePoli');
                Route::get('get-respon-time-tracer-online', 'Registrasi\RegistrasiController@getResponTimeTracerOnline');
                Route::get('get-respon-time-tracer-online-total', 'Registrasi\RegistrasiController@getResponTimeTracerOnlineTotal');
                Route::get('get-respon-time-poliklinik-online', 'Registrasi\RegistrasiController@getResponTimePoliklinikOnline');
                Route::get('get-respon-time-poliklinik-online-total', 'Registrasi\RegistrasiController@getResponTimePoliklinikOnlineTotal');
            });
        });
        Route::group(['prefix' => 'remunerasi'], function () {
            Route::get('get-combo', 'Remunerasi\RemunerasiController@getCombo');
            Route::get('get-jasa-layanan-pagu-rev2', 'Remunerasi\RemunerasiController@getRemunerasiJP1_rev2');
            Route::get('get-hitung-jasa-pelayanan-satu-rev2', 'Remunerasi\RemunerasiController@getHitungJP1Rev2');
            Route::get('get-daftar-jasa-layanan-pagu-rev2', 'Remunerasi\RemunerasiController@getDaftarJP1Rev2');
            Route::get('get-detail-jasa-layanan-pagu', 'Remunerasi\RemunerasiController@getDetailJP1');
            Route::get('get-list-pegawai', 'Remunerasi\RemunerasiController@getListPegawai');
            Route::get('get-data-combo', 'Remunerasi\RemunerasiController@getDataCombo');
            Route::get('get-detail-pot-remun', 'Remunerasi\RemunerasiController@getDetailPotonganRemunPegawai');
            Route::get('get-list-pegawai-perjenispagu', 'Remunerasi\RemunerasiController@getPegawaiByJenisPagu');
            Route::get('get-list-pegawai-perdetailjenispagu', 'Remunerasi\RemunerasiController@getPegawaiByDetailJenisPagu');
            Route::get('get-hitung-jasa-pelayanan-satu', 'Remunerasi\RemunerasiController@getHitungJP1');
            Route::get('get-daftar-remunerasi-pegawai', 'Remunerasi\RemunerasiController@getDaftarRemunPegawai');
            Route::get('get-daftar-closing', 'Remunerasi\RemunerasiController@getDataClosing');
            Route::get('get-detail-remun_rc', 'Remunerasi\RemunerasiController@getDetailRemunRCCC');
            Route::get('get-komponenharga-pelayanan', 'Remunerasi\RemunerasiController@getKomponenHargaPelayanan');
            //noname
            Route::get('get-komponenharga-pelayanan-keuangan', 'Remunerasi\RemunerasiController@getKomponenHargaPelayananKeuangan');
            Route::get('get-detail-remun-pegawai', 'Remunerasi\RemunerasiController@GetDetailRemunPegawai');
            Route::get('get-daftar-index-pegawai', 'Remunerasi\RemunerasiController@getDaftarPerhitunganIndexPegawai');
            Route::get('get-data-combo-laporan', 'Remunerasi\RemunerasiController@getDataComboLaporanRemun');
            Route::get('get-detail-laporan-remun', 'Remunerasi\RemunerasiController@getDataDetailLaporanRemunerasi');
            Route::get('get-rekap-laporan-remun', 'Remunerasi\RemunerasiController@getDataRekapLaporanRemunerasi');
            Route::get('get-detail-laporan-remun-dokter', 'Remunerasi\RemunerasiController@getDataDetailLaporanRemunerasiDokter');
            Route::get('get-detail-laporan-remun-paramedis', 'Remunerasi\RemunerasiController@getDataDetailLaporanRemunerasiParamedis');
            Route::get('get-daftar-remunerasi-kelompok', 'Remunerasi\RemunerasiController@getDaftarRemunKelompok');
            Route::get('get-combo-rem', 'Remunerasi\RemunerasiController@getComboRem');
            Route::get('get-detail-kelompok', 'Remunerasi\RemunerasiController@getDetailKelompok');
            Route::get('detail-jasapelayanan', 'Remunerasi\RemunerasiController@getPelayananjasa');
            Route::get('detail-jasapelayanan-ruangan', 'Remunerasi\RemunerasiController@getRuanganPelayananjasa');
            Route::get('total-tarif-pelayan-all', 'Remunerasi\RemunerasiController@getRekapPelayananAll');
            Route::get('detail-tarif-pelayan-all', 'Remunerasi\RemunerasiController@getDetailPelayananAll');
            Route::get('detail-tarif-pelayan-allnodistinct', 'Remunerasi\RemunerasiController@getDetailPelayananAllnodistinct');
            Route::get('detail-jasapelayananpenjamin', 'Remunerasi\RemunerasiController@getPelayananjasapenjamin');

            Route::post('save-closing-jasa-pelayanan-satu', 'Remunerasi\RemunerasiController@saveDetailPegawaiPagu');
            Route::post('save-hapus-map-jenis-pagu', 'Remunerasi\RemunerasiController@hapusMapJenisPagutoPegawai');
            Route::post('save-potongan-remun', 'Remunerasi\RemunerasiController@savePotonganRemun');
            //            Route::post('save-struk-pagu-rev2', 'Remunerasi\RemunerasiController@saveStrukPaguWithDetailRev2');
            //            Route::post('save-closing-pr', 'Remunerasi\RemunerasiController@saveClosingPOSTREMUN');
            //            Route::post('save-closing-rcd', 'Remunerasi\RemunerasiController@saveClosingRCDokter');
            //            Route::post('save-closing-rc', 'Remunerasi\RemunerasiController@saveClosingRC');
            //            Route::post('save-closing-cc', 'Remunerasi\RemunerasiController@saveClosingCC');
            //            Route::post('save-closing-ccs', 'Remunerasi\RemunerasiController@saveClosingCCStaff');
            Route::post('save-struk-pagu-rev2', 'Remunerasi\RemunerasiController@saveRemunerasiJP1_rev3_2020');

            Route::post('save-closing-pr', 'Remunerasi\RemunerasiController@saveClosingDireksi');
            Route::post('save-closing-rcd', 'Remunerasi\RemunerasiController@saveClosingJPL');
            Route::post('save-closing-rc', 'Remunerasi\RemunerasiController@saveClosingStruktural');
            Route::post('save-closing-cc', 'Remunerasi\RemunerasiController@saveClosingJPTL');
            Route::post('save-closing-ccs', 'Remunerasi\RemunerasiController@saveClosingGabungan');
            Route::post('save-closing-potongan', 'Remunerasi\RemunerasiController@saveClosingPotongan');
            Route::post('save-detail-kelompok', 'Remunerasi\RemunerasiController@saveDetailKelompok');

            Route::post('save-map-jenis-pagu-topegawai', 'Remunerasi\RemunerasiController@saveMapJenisPaguToPegawai');
            Route::post('save-jasapelayanandokter', 'Remunerasi\RemunerasiController@saveJasaPelayananNewLoop');
            Route::post('save-jasapelayanandokterdeletinsert', 'Remunerasi\RemunerasiController@saveJasaPelayananNewLoop2');

            Route::post('save-jasapelayanan-inacbg', 'Remunerasi\RemunerasiController@saveJasaPelayananNewLoopEclaim');
            Route::post('save-jasapelayanan-inacbgv2', 'Remunerasi\RemunerasiController@saveJasaPelayananNewLoopEclaimv2');

            Route::post('save-jasapelayanan-inacbgcopy', 'Remunerasi\RemunerasiController@saveJasaPelayananNewLoopKeuangancopy');

            Route::post('delete-jasapelayanandokter', 'Remunerasi\RemunerasiController@deletejasapelayanan');
            Route::post('saveupdate-jasadokter', 'Remunerasi\RemunerasiController@saveupdatejasapelayanan');
            Route::post('delete-jasadokterpernorec', 'Remunerasi\RemunerasiController@deletejasapelayanannorec');
            Route::post('delete-jasadokterbanyaknorec', 'Remunerasi\RemunerasiController@deletejasapelayanannorecbanyak');
            Route::post('save-tindakanjasa', 'Remunerasi\RemunerasiController@saveTindakan');
            Route::post('ubahrekanan-jasapelayanandokter', 'Remunerasi\RemunerasiController@ubahrekanan');
            Route::post('berkasrs', 'Remunerasi\RemunerasiController@berkasrs');

            Route::post('update-jasapelayanandokter', 'Remunerasi\RemunerasiController@updatetindakanjasa');
            Route::post('update-jumlah', 'Remunerasi\RemunerasiController@editjumlah');

            // berkasrsKeuangan
            Route::get('getkomponenhargagif', 'Remunerasi\RemunerasiController@loadHargaKomponen');
            Route::post('getkomponenhargabermasalah', 'Remunerasi\RemunerasiController@kembalikanHargaKomponenPertanggalget');
            Route::post('berkasrsKeuangan', 'Remunerasi\RemunerasiController@berkasrsKeuangan');
            Route::post('kembalikankomponenjasa', 'Remunerasi\RemunerasiController@kembalikanHargaKomponen');

            Route::post('updatekomponen', 'Remunerasi\RemunerasiController@simpanUpdateDiskonKomponen');


            Route::post('save-jasapelayanandoktersatuan', 'Remunerasi\RemunerasiController@saveJasaPelayananNewSatuan');
            Route::post('save-jasapelayanandoktersatuan-keuangan', 'Remunerasi\RemunerasiController@saveJasaPelayananNewLoopKeuangan');
            Route::post('save-tindakan', 'Remunerasi\RemunerasiController@saveTindakan');
            Route::post('updatetglverif', 'Remunerasi\RemunerasiController@updatetglverif');

            Route::post('updatediskon', 'Remunerasi\RemunerasiController@updatediskon');
            Route::post('updatediskonptt', 'Remunerasi\RemunerasiController@updatediskonptt');
            Route::post('update-harga-komponen-jaspel', 'Remunerasi\RemunerasiController@updateHargaKomponenJaspel');
            Route::post('save-setor-pajak', 'Remunerasi\RemunerasiController@saveSetorPajak');
            Route::get('get-total', 'Remunerasi\RemunerasiController@getTotalSetor');
            Route::get('get-tgl-setor', 'Remunerasi\RemunerasiController@getTglSetor');
            Route::post('save-verif-rekap-pajak', 'Remunerasi\RemunerasiController@saveVerifRekapPajak');
            Route::get('get-pajak', 'Remunerasi\RemunerasiController@getPajak');
            Route::get('get-total-rekap', 'Remunerasi\RemunerasiController@getTotalRekap');
            Route::get('get-total-rincian', 'Remunerasi\RemunerasiController@getTotalRincian');
            Route::get('get-info-verif', 'Remunerasi\RemunerasiController@getInfoVerif');
        });
        Route::group(['prefix' => 'reservasionline'], function () {
            Route::post('delete-slotting', 'ReservasiOnline\ReservasiOnlineController@deleteSlotting');
            Route::post('daftar-jkn', 'ReservasiOnline\ReservasiOnlineController@GetNoAntrianMobileJKN');
            Route::post('rekap-jkn', 'ReservasiOnline\ReservasiOnlineController@GetRekapMobileJKN');
            Route::post('kode-booking-operasi', 'ReservasiOnline\ReservasiOnlineController@GetKodeBookingOperasi');
            Route::post('list-operasi', 'ReservasiOnline\ReservasiOnlineController@GetListOperasi');
            Route::get('get-list-data', 'ReservasiOnline\ReservasiOnlineController@getComboReservasi');
            Route::get('get-daftar-slotting', 'ReservasiOnline\ReservasiOnlineController@getDaftarSlotting');
            Route::post('save-slotting', 'ReservasiOnline\ReservasiOnlineController@saveSlotting');
            Route::post('update-data-status-reservasi', 'ReservasiOnline\ReservasiOnlineController@UpdateStatConfirm');
            Route::get('get-list-data-android', 'ReservasiOnline\ReservasiOnlineController@getListDataAndroid');
            Route::post('update-nocmfk-antrian-registrasi', 'ReservasiOnline\ReservasiOnlineController@updateNoCmInAntrianRegistrasi');
            Route::get('get-history', 'ReservasiOnline\ReservasiOnlineController@getHistoryReservasi');
            Route::get('get-history2', 'ReservasiOnline\ReservasiOnlineController@getHistoryReservasi2');
            Route::get('get-history-vaksin', 'ReservasiOnline\ReservasiOnlineController@getHistoryVaksin');
            Route::get('get-history-mcu', 'ReservasiOnline\ReservasiOnlineController@getHistoryReservasiMCU');
            Route::get('get-pasien/{nocm}/{tgllahir}', 'ReservasiOnline\ReservasiOnlineController@getPasienByNoCmTglLahir');
            Route::get('get-pasien-kiosk/{nocm}/{tgllahir}', 'ReservasiOnline\ReservasiOnlineController@getPasienByNoCmTglLahirKiosk');
            Route::get('get-pasien-kioskcekin/{nocm}/{tgllahir}', 'ReservasiOnline\ReservasiOnlineController@getPasienByNoCmTglLahirKioskCekin');
            Route::get('get-pasien-android/{nocm}/{tgllahir}', 'ReservasiOnline\ReservasiOnlineController@getPasienByNoCmTglLahirAndroid');
            Route::get('get-libur', 'ReservasiOnline\ReservasiOnlineController@getLiburSlotting');
            Route::get('get-bank-account', 'ReservasiOnline\ReservasiOnlineController@getNomorRekening');
            Route::post('save', 'ReservasiOnline\ReservasiOnlineController@saveReservasi');
            Route::post('save-vaksin', 'ReservasiOnline\ReservasiOnlineController@saveVaksin');
            Route::post('delete', 'ReservasiOnline\ReservasiOnlineController@deleteReservasi');
            Route::post('delete-vaksin', 'ReservasiOnline\ReservasiOnlineController@deleteReservasiVaksin');
            Route::post('simpan-vaksin-test', 'ReservasiOnline\ReservasiOnlineController@simpanVaksin');
            Route::get('cek-reservasi-satu', 'ReservasiOnline\ReservasiOnlineController@cekReservasiDipoliYangSama');
            Route::get('get-slotting-by-ruangan-new/{kode}/{tgl}', 'ReservasiOnline\ReservasiOnlineController@getSlottingByRuanganNew');
            Route::get('get-slotting-vaksin/{tgl}', 'ReservasiOnline\ReservasiOnlineController@getSlottingVaksin');
            Route::get('get-slotting-by-ruangan-newpoli/{kode}/{tgl}', 'ReservasiOnline\ReservasiOnlineController@getSlottingByRuanganNewpoli');
            Route::get('get-history-vaksin/{nik}', 'ReservasiOnline\ReservasiOnlineController@getHistoryVaksin');
            Route::get('get-history-vaksin-noreservasi/{noreservasi}', 'ReservasiOnline\ReservasiOnlineController@getHistoryVaksinnoreservasi');
            Route::get('get-slot-available', 'ReservasiOnline\ReservasiOnlineController@getDaftarSlottingAktif');
            Route::get('tagihan/get-pasien/{noregistrasi}', 'ReservasiOnline\ReservasiOnlineController@getPasienByNoRegistrasi'); //done
            Route::get('get-tagihan-pasien/{noregistasi}', 'ReservasiOnline\ReservasiOnlineController@getTagihanEbilling');
            Route::get('get-setting', 'ReservasiOnline\ReservasiOnlineController@getSetting');
            Route::post('sudah-vaksin', 'ReservasiOnline\ReservasiOnlineController@sudahSelesaiVaksin');
            Route::get('daftar-riwayat-registrasi', 'ReservasiOnline\ReservasiOnlineController@getDaftarRiwayatRegistrasi');
            Route::get('cek-pasien-baru-by-nik/{nik}', 'ReservasiOnline\ReservasiOnlineController@cekPasienByNik');
            Route::post('save-libur', 'ReservasiOnline\ReservasiOnlineController@saveLibur');
            Route::post('delete-libur', 'ReservasiOnline\ReservasiOnlineController@deleteLibur');
            Route::post('save-foto', 'ReservasiOnline\ReservasiOnlineController@saveFoto');
            Route::get('get-status-bed', 'ReservasiOnline\ReservasiOnlineController@getStatusBed');
            Route::get('get-jadwal-mingguan', 'ReservasiOnline\ReservasiOnlineController@getJadwalMingguanDokter');
            Route::get('cekversi', 'ReservasiOnline\ReservasiOnlineController@getVersi');
            Route::get('get-jadwal-dokter', 'ReservasiOnline\ReservasiOnlineController@getJadwalDokter');
            Route::get('get-list-news', 'ReservasiOnline\ReservasiOnlineController@getNewsReservasi');
            Route::get('get-jadwal-dokterall', 'ReservasiOnline\ReservasiOnlineController@getJadwalDokterall');
            Route::post('edit', 'ReservasiOnline\ReservasiOnlineController@editReservasi');
            Route::post('edit-ro', 'ReservasiOnline\ReservasiOnlineController@editReservasiRo');
            Route::post('batal', 'ReservasiOnline\ReservasiOnlineController@batalReservasi');
            Route::post('batal-ro', 'ReservasiOnline\ReservasiOnlineController@batalReservasiRo');
            Route::post('save-ro', 'ReservasiOnline\ReservasiOnlineController@saveRoPenjagaan'); //saveRo ini di ganti pake ini yg udah ada penjagaanya
            Route::post('save-rotest', 'ReservasiOnline\ReservasiOnlineController@saveRoTest'); //ini untuk reservasi web
            Route::get('get-paket-mcu', 'ReservasiOnline\ReservasiOnlineController@getPaketMcu');
            Route::post('save-mcu', 'ReservasiOnline\ReservasiOnlineController@saveReservasiMcu');
            Route::post('save-mcu-pasienbaru', 'ReservasiOnline\ReservasiOnlineController@saveReservasiMcuPasienBaru');
            Route::post('save-pelapor', 'ReservasiOnline\ReservasiOnlineController@savePelapor');
            Route::post('save-penjagaan', 'ReservasiOnline\ReservasiOnlineController@saveRoPenjagaan');
            Route::get('get-kamarbyruangankelas-android', 'ReservasiOnline\ReservasiOnlineController@getKamarByKelasRuanganAndroid');
            Route::post('save-ranap-pasienbaru', 'ReservasiOnline\ReservasiOnlineController@saveReservasiRanapPasienBaru');
            Route::post('save-booking-pasienbaru', 'ReservasiOnline\ReservasiOnlineController@saveReservasiBookBedPasienBaru');
            Route::get('get-pasien-androidRanap/{nocm}/{tgllahir}', 'ReservasiOnline\ReservasiOnlineController@getPasienByNoCmTglLahirAndroid2');
            Route::get('get-history-bookingbed', 'ReservasiOnline\ReservasiOnlineController@getHistoryReservasiBookingBed');
            Route::post('save-booking-pasienlama', 'ReservasiOnline\ReservasiOnlineController@saveReservasiBookBedPasienLama');
            Route::get('get-history-poli-ranap', 'ReservasiOnline\ReservasiOnlineController@getHistoryReservasiPoliRanap');
            Route::post('batal-booking-bed', 'ReservasiOnline\ReservasiOnlineController@batalReservasiBookingBed');
            Route::get('get-list-spesialis', 'ReservasiOnline\ReservasiOnlineController@getSpesialis');
            Route::post('save-booking-ranap-web', 'ReservasiOnline\ReservasiOnlineController@saveReservasiBookBedPasienLamaWeb');
            Route::post('cek-versi-app', 'ReservasiOnline\ReservasiOnlineController@cekVersi');
            Route::post('save-android-baru', 'ReservasiOnline\ReservasiOnlineController@saveRoAndroidBaru');

            Route::get('cek-pemakaianasuransi', 'ReservasiOnline\ReservasiOnlineController@geCekPemakaianAsuransi');


            Route::get('get-kelurahan', 'ReservasiOnline\ReservasiOnlineController@getKelurahan');
        });
        Route::group(['prefix' => 'sanitasi'], function () {
            Route::get('get-tempat-tidur', 'Sanitasi\SanitasiController@getTempatTidur');
            Route::post('save-signdate', 'Sanitasi\SanitasiController@SaveDataSignDate');
            Route::post('save-alokasistaff', 'Sanitasi\SanitasiController@SaveDataAlokasiStaff');
            Route::post('save-worklist', 'Sanitasi\SanitasiController@SaveDataWorkList');
            Route::post('save-inspeksi', 'Sanitasi\SanitasiController@SaveDataInspeksi');
            Route::post('save-startdate', 'Sanitasi\SanitasiController@SaveDataStartDate');
            Route::post('save-duedate', 'Sanitasi\SanitasiController@SaveDataDueDate');
            Route::post('save-tambah-kegiatan', 'Sanitasi\SanitasiController@saveTambahKegiatan');
            Route::get('get-data-sanitasi', 'Sanitasi\SanitasiController@getDataSanitasi');
            Route::get('get-combo-sanitasi', 'Sanitasi\SanitasiController@getComboSanitasi');
            Route::get('get-combo-pegawai', 'Sanitasi\SanitasiController@getDataPegawaiGeneral');
            Route::get('get-combo-jenispek', 'Sanitasi\SanitasiController@getDataCombo');
            Route::post('save-data-signdate', 'Sanitasi\SanitasiController@SaveSignDate');
            Route::post('save-data-alokasistaff', 'Sanitasi\SanitasiController@SaveAlokasistaff');
            Route::post('save-data-worklist', 'Sanitasi\SanitasiController@SaveWorklist');
            Route::post('save-data-startdate', 'Sanitasi\SanitasiController@SaveStartDate');
            Route::get('get-jenis-layanan-sanitasi', 'Sanitasi\SanitasiController@getJenisLayananSanitasi');
            Route::post('save-permohonan-sanitasi', 'Sanitasi\SanitasiController@SavePermohonanSanitasi');
            Route::get('get-daftar-permohonan-sanitasi', 'Sanitasi\SanitasiController@getDaftarPermohonanSanitasi');
            Route::post('save-jenis-layanan-sanitasi', 'Sanitasi\SanitasiController@SaveDataJenisLayananSanitasi');
            Route::get('get-status-pekerjaan-sanitasi', 'Sanitasi\SanitasiController@getStatusPekerjaanSanitasi');
            Route::post('hapus-permohonan-sanitasi', 'Sanitasi\SanitasiController@HapusPermohonanSanitasi');
        });
        Route::group(['prefix' => 'rumahtangga'], function () {
            Route::get('get-tempat-tidur', 'RumahTangga\RumahTanggaController@getTempatTidur');
            Route::post('save-signdate', 'RumahTangga\RumahTanggaController@SaveDataSignDate');
            Route::post('save-alokasistaff', 'RumahTangga\RumahTanggaController@SaveDataAlokasiStaff');
            Route::post('save-worklist', 'RumahTangga\RumahTanggaController@SaveDataWorkList');
            Route::post('save-inspeksi', 'RumahTangga\RumahTanggaController@SaveDataInspeksi');
            Route::post('save-startdate', 'RumahTangga\RumahTanggaController@SaveDataStartDate');
            Route::post('save-duedate', 'RumahTangga\RumahTanggaController@SaveDataDueDate');
            Route::post('save-tambah-kegiatan', 'RumahTangga\RumahTanggaController@saveTambahKegiatan');
            Route::get('get-data-rumahtangga', 'RumahTangga\RumahTanggaController@getDataRumahTangga');
            Route::get('get-combo-rumahtangga', 'RumahTangga\RumahTanggaController@getComboRumahTangga');
            Route::get('get-combo-pegawai', 'RumahTangga\RumahTanggaController@getDataPegawaiGeneral');
            Route::get('get-combo-jenispek', 'RumahTangga\RumahTanggaController@getDataCombo');
            Route::post('save-data-signdate', 'RumahTangga\RumahTanggaController@SaveSignDate');
            Route::post('save-data-alokasistaff', 'RumahTangga\RumahTanggaController@SaveAlokasistaff');
            Route::post('save-data-worklist', 'RumahTangga\RumahTanggaController@SaveWorklist');
            Route::post('save-data-startdate', 'RumahTangga\RumahTanggaController@SaveStartDate');
            Route::get('get-jenis-layanan-rumahtangga', 'RumahTangga\RumahTanggaController@getJenisLayananRumahTangga');
            Route::post('save-permohonan-rumahtangga', 'RumahTangga\RumahTanggaController@SavePermohonanRumahTangga');
            Route::get('get-daftar-permohonan-rumahtangga', 'RumahTangga\RumahTanggaController@getDaftarPermohonanRumahTangga');
            Route::post('save-jenis-layanan-rumahtangga', 'RumahTangga\RumahTanggaController@SaveDataJenisLayananRumahTangga');
            Route::get('get-status-pekerjaan-rumahtangga', 'RumahTangga\RumahTanggaController@getStatusPekerjaanRumahTangga');
            Route::post('hapus-permohonan-rumahtangga', 'RumahTangga\RumahTanggaController@HapusPermohonanRumahTangga');
        });
        Route::group(['prefix' => 'ipsrs'], function () {
            Route::get('get-daftar-permohonan', 'IPSRS\IPSRSController@getDaftarIPSRS');
            Route::post('save-permohonan', 'IPSRS\IPSRSController@SavePermohonan');
            Route::post('save-alokasistaff', 'IPSRS\IPSRSController@SaveDataAlokasiStaff');
            Route::post('save-worklist', 'IPSRS\IPSRSController@SaveDataWorkList');
            Route::post('save-inspeksi', 'IPSRS\IPSRSController@SaveDataInspeksi');
            Route::post('save-identifikasi-kerusakan', 'IPSRS\IPSRSController@SaveDataIdentifikasi');
            Route::post('save-jenis-kerusakan', 'IPSRS\IPSRSController@SaveDataJenisKerusakan');
            Route::get('get-jenis-pekerjaan', 'IPSRS\IPSRSController@getJenisPekerjaan');
            Route::get('get-status-pekerjaan', 'IPSRS\IPSRSController@getStatusPekerjaan');
            Route::post('save-status-pekerjaan', 'IPSRS\IPSRSController@SaveDataStatus');
            Route::get('send-notif-whatsapp', 'IPSRS\IPSRSController@sendNotifWhatsapp');
            Route::get('get-jenis-alat', 'IPSRS\IPSRSController@getJenisAlat');
            Route::post('save-jenis-alat', 'IPSRS\IPSRSController@SaveDataJenisAlat');
            Route::post('hapus-permohonan-ipsrs', 'IPSRS\IPSRSController@HapusPermohonanIPSRS');
            Route::post('save-nomor-hasil-pekerjaan', 'IPSRS\IPSRSController@SaveDataNomorHasilPekerjaan');
        });
        Route::group(['prefix' => 'sdm'], function () {
            // trisno 1889
            Route::get('get-file-str', 'SDM\SumberDayaManusiaController@getFileStr');
            Route::get('get-file-sip', 'SDM\SumberDayaManusiaController@getFileSip');
            Route::get('get-combo-sip-str', 'SDM\SumberDayaManusiaController@getComboSipStr');
            Route::get('get-masa-berlaku-sipstr-pegawai', 'SDM\SumberDayaManusiaController@getMasaBerlakuSipStrPegawai');
            Route::get('get-data-pegawai-all-pp', 'SDM\SumberDayaManusiaController@getDaftarPegawaiPP');
            Route::get('get-data-pajak-penghasilan-pegawai', 'SDM\SumberDayaManusiaController@getPajakPenghasilanPegawai');
            Route::post('save-rekam-data-pajak-penghasilan', 'SDM\SumberDayaManusiaController@saveDataRekamDataPajakPenghasilan');
            /*GET*/
            Route::get('get-data-combo-sdm', 'SDM\SumberDayaManusiaController@getComboPegawaiSdm');
            Route::get('get-rekening-pegawai', 'SDM\SumberDayaManusiaController@getRekeningPegawai');
            Route::get('get-rekening-pegawai2', 'SDM\SumberDayaManusiaController@getRekeningPegawai2');
            Route::get('get-update-pegawai', 'SDM\SumberDayaManusiaController@getUpdatePegawai');
            Route::get('cek-sudah-update', 'SDM\SumberDayaManusiaController@cekSudahUpdate');
            Route::post('save-transfer-gaji', 'SDM\SumberDayaManusiaController@saveTransferGaji');
            Route::post('save-edit-data', 'SDM\SumberDayaManusiaController@saveEditData');
            Route::get('get-laporan-pegawai', 'SDM\SumberDayaManusiaController@getLaporanPegawai');
            Route::get('get-edit-update-pegawai', 'SDM\SumberDayaManusiaController@getEditUpdatePegawai');

            Route::get('get-katagori-pegawai', 'SDM\SumberDayaManusiaController@getKatagoriPegawai');
            Route::get('get-combo-honor', 'SDM\SumberDayaManusiaController@getComboHonor');
            Route::get('get-pembayaran-honor-ptt', 'SDM\SumberDayaManusiaController@getPembayaranHonorPtt');
            Route::get('get-pembayaran-rekap', 'SDM\SumberDayaManusiaController@getPembayaranRekap');
            Route::get('get-personil-rekap', 'SDM\SumberDayaManusiaController@getPersonilRekap');
            Route::get('get-jumlah-pembayaran-ptt', 'SDM\SumberDayaManusiaController@getJumlahPembayaranPtt');
            Route::get('get-total-pembayaran-ptt', 'SDM\SumberDayaManusiaController@getTotalPembayaranPtt');
            Route::get('get-jumlah-pembayaran-kelompok-ptt', 'SDM\SumberDayaManusiaController@getJumlahPembayaranKelompokPtt');
            Route::get('get-data-pegawai-all-sdm', 'SDM\SumberDayaManusiaController@getDaftarPegawai');
            Route::get('get-data-detail-pegawai', 'SDM\SumberDayaManusiaController@getDetailPegawai');
            Route::get('get-data-urut-kepangakatan-pegawai', 'SDM\SumberDayaManusiaController@getDataDaftarUrutKepangkatan');
            Route::get('get-data-jadwal-kerja-pegawai-ruangan', 'SDM\SumberDayaManusiaController@getDataJadwalKerjaRuangan');
            Route::get('get-data-sip', 'SDM\SumberDayaManusiaController@getDataSip');
            Route::get('get-data-sip-pegawai', 'SDM\SumberDayaManusiaController@getDataSipPegawai');
            Route::get('get-data-pegawai-pasien', 'SDM\SumberDayaManusiaController@getDataPegawaiPasien');
            Route::get('get-data-seminar', 'SDM\SumberDayaManusiaController@getDataSeminar');
            Route::get('get-data-spkk', 'SDM\SumberDayaManusiaController@getDataSpkk');
            Route::get('get-data-dikjur', 'SDM\SumberDayaManusiaController@getDataDikjur');
            Route::get('get-data-tanda-jasa', 'SDM\SumberDayaManusiaController@getDataTandaJasa');
            Route::get('get-data-kecakapan-bahasa', 'SDM\SumberDayaManusiaController@getDataKecakapanBahasa');
            Route::get('get-data-organisasi-profesi', 'SDM\SumberDayaManusiaController@getDataOrganisasiProfesi');
            Route::get('get-riwayat-rikesla', 'SDM\SumberDayaManusiaController@getRiwayatRikesla');
            Route::get('get-riwayat-kepangkatan', 'SDM\SumberDayaManusiaController@getDataRiwayatKepangkatan');
            Route::get('get-riwayat-kepangkatan-pegawai', 'SDM\SumberDayaManusiaController@getRiwayatKepangkatan');
            //noname
            Route::get('get-data-habiskontrak', 'SDM\SumberDayaManusiaController@getDataPegawaiHabisKontrak');
            //

            Route::get('get-data-str', 'SDM\SumberDayaManusiaController@getDataStr');
            Route::get('get-data-str-pegawai', 'SDM\SumberDayaManusiaController@getDataStrPegawai');
            Route::get('download-data-sipstr', 'SDM\SumberDayaManusiaController@downloadFileSipStr');
            Route::get('data-pegawai-sudah-pensiun', 'SDM\SumberDayaManusiaController@getPegawaiSudahPensiun');
            Route::get('get-data-pensiun', 'SDM\SumberDayaManusiaController@getPegawaiPensiun');
            Route::get('data-combo-pensiun', 'SDM\SumberDayaManusiaController@getComboPensiun');
            Route::get('get-jadwal-perbulan-pegawai', 'SDM\SumberDayaManusiaController@getJadwalBulananPegawai');
            Route::get('get-combo-pegawai-jadwal-all', 'SDM\SumberDayaManusiaController@getComboPegawaiJadwal');
            Route::get('get-monitoring-absensi-pegawai', 'SDM\SumberDayaManusiaController@getMonitoringAbsensiPegawai');
            Route::get('get-data-keluarga-pegawai', 'SDM\SumberDayaManusiaController@getDataKeluarga');
            Route::get('get-rekap-pegawai', 'SDM\SumberDayaManusiaController@getRekapPegawai');
            Route::get('get-data-urut-informasi-jabatan', 'SDM\SumberDayaManusiaController@getDataInformasijabatanStruktural');
            Route::get('get-pegawai-all', 'SDM\SumberDayaManusiaController@getPegawaiAll');
            Route::get('get-permohonan-cuti', 'SDM\SumberDayaManusiaController@getPermohonanCuti');
            Route::get('get-absensi-pegawai', 'SDM\SumberDayaManusiaController@getAbsesnsiPegawai');
            Route::get('get-pegawai-by-unitkerja', 'SDM\SumberDayaManusiaController@getPegawaiByUnitKerja');
            Route::get('get-combo-jadwal', 'SDM\SumberDayaManusiaController@getJadwalAbasensiCbo');
            Route::get('download-sip-str', 'SDM\SumberDayaManusiaController@createZipSipStr');
            Route::get('get-data-sk', 'SDM\SumberDayaManusiaController@getSuratKeputusan');
            Route::get('get-list-shift-kerja', 'SDM\SumberDayaManusiaController@getShiftKerja');
            Route::get('get-list-pegawai', 'SDM\SumberDayaManusiaController@getComboPegawai');
            Route::get('get-mapping-pegawai', 'SDM\SumberDayaManusiaController@getMappingPegawai');
            Route::get('get-list-jam-kerja', 'SDM\SumberDayaManusiaController@getJamKerja');
            Route::get('get-petugas-diklat', 'SDM\SumberDayaManusiaController@getPetugasDiklat');
            Route::get('get-map-pegawai-to-atasan', 'SDM\SumberDayaManusiaController@getMapPegawaiToAtasan');
            Route::get('get-permohonan-cuti-verif', 'SDM\SumberDayaManusiaController@getPermohonanCutiVerif');
            Route::get('get-jabatan-login', 'SDM\SumberDayaManusiaController@getJabatanLogin');
            Route::get('get-foto-default', 'SDM\SumberDayaManusiaController@getFotoProfileDefault');
            Route::get('get-istri-suami', 'SDM\SumberDayaManusiaController@getIstriSuami');
            Route::get('get-jumlah-anak', 'SDM\SumberDayaManusiaController@getJumlahAnak');
            Route::get('get-anak', 'SDM\SumberDayaManusiaController@getAnak');
            Route::get('get-ttl-indo', 'SDM\SumberDayaManusiaController@getTtlIndo');
            Route::get('get-pendidikan', 'SDM\SumberDayaManusiaController@getPendidikan');
            Route::get('get-telp', 'SDM\SumberDayaManusiaController@getTelp');
            Route::get('get-dikjur', 'SDM\SumberDayaManusiaController@getDikJur');
            Route::get('get-sisanya', 'SDM\SumberDayaManusiaController@getSisanya');
            Route::get('get-vic-to-data-pegawai', 'SDM\SumberDayaManusiaController@getVicDataPegawai');
            Route::get('get-kalak-ruangan', 'SDM\SumberDayaManusiaController@getKalakRuangan');
            Route::get('get-anggota', 'SDM\SumberDayaManusiaController@getAnggota');
            Route::get('get-str-pegawai', 'SDM\SumberDayaManusiaController@getStrPegawai');
            Route::get('get-sip-pegawai', 'SDM\SumberDayaManusiaController@getSipPegawai');
            Route::get('get-login-user', 'SDM\SumberDayaManusiaController@getLoginUserById');
            Route::get('get-dokumen-pegawai-all', 'SDM\SumberDayaManusiaController@getDokumenPegawai');
            Route::get('get-instalasi-unit-kerja', 'SDM\SumberDayaManusiaController@getInstalasiFromUnitKerja');
            Route::get('get-ruangan-instalasi', 'SDM\SumberDayaManusiaController@getRuanganFromInstalasi');
            Route::get('get-kedudukan-pegawai', 'SDM\SumberDayaManusiaController@getKedudukanPegawai');
            Route::get('get-pegawai-isi', 'SDM\SumberDayaManusiaController@getPegawaiSudahIsi');
            Route::get('get-combo-2', 'SDM\SumberDayaManusiaController@getCombo2');
            Route::get('get-data-pendidikan', 'SDM\SumberDayaManusiaController@getDataPendidikan');
            Route::get('get-data-pelatihan', 'SDM\SumberDayaManusiaController@getDataPelatihan');
            Route::get('get-data-jabatan', 'SDM\SumberDayaManusiaController@getDataJabatan');
            Route::get('get-data-sip-2', 'SDM\SumberDayaManusiaController@getDataSip2');
            Route::get('get-data-str-2', 'SDM\SumberDayaManusiaController@getDataStr2');
            Route::get('get-data-spkk-2', 'SDM\SumberDayaManusiaController@getDataSpkk2');
            Route::get('get-data-seminar-2', 'SDM\SumberDayaManusiaController@getDataSeminar2');
            Route::get('get-data-dikjur-2', 'SDM\SumberDayaManusiaController@getDataDikjur2');
            Route::get('get-data-jasa-2', 'SDM\SumberDayaManusiaController@getDataTandaJasa2');
            Route::get('get-data-bahasa-2', 'SDM\SumberDayaManusiaController@getDataBahasa2');
            Route::get('get-data-organisasi-2', 'SDM\SumberDayaManusiaController@getDataOrganisasi2');
            Route::get('get-rekap-pegawai-sudah-input', 'SDM\SumberDayaManusiaController@getRekapPegawaiSudahInput');
            Route::get('get-rekap-pegawai-sip', 'SDM\SumberDayaManusiaController@getRekapPegawaiSip');
            Route::get('get-rekap-pegawai-str', 'SDM\SumberDayaManusiaController@getRekapPegawaiStr');
            Route::get('get-status-pegawai', 'SDM\SumberDayaManusiaController@getStatusPegawai');
            Route::get('get-rekap-data-pegawai', 'SDM\SumberDayaManusiaController@getRekapDataPegawai');
            Route::get('get-rekap-data-pegawai-detail', 'SDM\SumberDayaManusiaController@getRekapDataPegawaiDetail');
            /*END GET*/

            /*POST*/
            Route::post('update-idfinger-pegawai', 'SDM\SumberDayaManusiaController@updateDataIdFingerPrint');
            Route::post('upload-data-spkk', 'SDM\SumberDayaManusiaController@simpanSpkk');
            Route::post('upload-data-seminar', 'SDM\SumberDayaManusiaController@simpanSeminar');
            Route::post('delete-data-spkk', 'SDM\SumberDayaManusiaController@deleteSpkk');
            Route::post('delete-data-keluarga-pegawai', 'SDM\SumberDayaManusiaController@deleteDataKeluarga');
            Route::post('delete-data-sipstr', 'SDM\SumberDayaManusiaController@deleteDataSipStr');
            Route::post('save-rekam-data-pegawai', 'SDM\SumberDayaManusiaController@saveDataRekamDataPegawai');
            Route::post('upload-data-sipstr', 'SDM\SumberDayaManusiaController@simpanSipStr');
            Route::post('update-data-pegawai-form-pensiun', 'SDM\SumberDayaManusiaController@updateDataPegawaiFormPensiun');
            Route::post('save-data-pensiun-pegawai', 'SDM\SumberDayaManusiaController@SavePensiunPegawai');
            Route::post('save-jadwal-perbulan-pegawai', 'SDM\SumberDayaManusiaController@saveJadwalBulananPegawai');
            Route::post('hapus-jadwal-perbulan-pegawai', 'SDM\SumberDayaManusiaController@hapusJadwalBulananPegawai');
            Route::post('save-data-keluarga-pegawai', 'SDM\SumberDayaManusiaController@saveDataKeluarga');
            Route::post('save-permohonan-cuti', 'SDM\SumberDayaManusiaController@savePermohonanCuti');
            Route::post('delete-permohonan-cuti', 'SDM\SumberDayaManusiaController@deletePermohonanCuti');
            Route::post('verifkasi-cuti1', 'SDM\SumberDayaManusiaController@verifCuti');
            Route::post('verifkasi-cuti', 'SDM\SumberDayaManusiaController@verifCuti1');
            Route::post('unverif-permohonan-cuti', 'SDM\SumberDayaManusiaController@unverifCuti');
            Route::post('save-permohonan-cuti-bersama', 'SDM\SumberDayaManusiaController@savePermohonanCutiBersama');
            Route::post('save-absensi-pegawai', 'SDM\SumberDayaManusiaController@saveAbsensi');
            Route::post('delete-data-sk', 'SDM\SumberDayaManusiaController@deleteSuratKeputusan');
            Route::post('save-data-sk', 'SDM\SumberDayaManusiaController@saveSuratKeputusan');
            Route::post('save-shift-kerja', 'SDM\SumberDayaManusiaController@saveShiftKerja');
            Route::post('save-map-pegawai-to-unit', 'SDM\SumberDayaManusiaController@saveMapPegawaiToUnit');
            Route::post('delete-map-pegawai-to-unit', 'SDM\SumberDayaManusiaController@DeleteMapPegawaiToUnit');
            Route::post('save-jadwal-kerja-pegawai', 'SDM\SumberDayaManusiaController@saveJadwalKerjaPegawai');
            Route::post('save-jam-kerja', 'SDM\SumberDayaManusiaController@saveJamKerja');
            Route::post('save-jadwal-kerja-pegawai-mingguan', 'SDM\SumberDayaManusiaController@saveJadwalKerjaPegawaiMingguan');
            Route::post('update-sip-str', 'SDM\SumberDayaManusiaController@updateSIPSTR');
            Route::post('save-atasan1', 'SDM\SumberDayaManusiaController@saveAtasan1');
            Route::post('save-atasan2', 'SDM\SumberDayaManusiaController@saveAtasan2');
            Route::post('verif-cuti-per-tingkat', 'SDM\SumberDayaManusiaController@verifCutiPerTingkat');
            Route::post('save-edit-gaji', 'SDM\SumberDayaManusiaController@saveEditGaji');
            Route::post('upload-data-dikjur', 'SDM\SumberDayaManusiaController@simpanDikJur');
            Route::post('upload-data-tanda-jasa', 'SDM\SumberDayaManusiaController@simpanTandaJasa');
            Route::post('upload-data-kecakapan-bahasa', 'SDM\SumberDayaManusiaController@simpanKecakapanBahasa');
            Route::post('upload-data-organisasi-profesi', 'SDM\SumberDayaManusiaController@simpanOrganisasiProfesi');
            Route::post('save-mapping-vic', 'SDM\SumberDayaManusiaController@saveVicDataPegawai');
            Route::post('delete-vic', 'SDM\SumberDayaManusiaController@deleteVic');
            Route::post('save-anggota-kalak', 'SDM\SumberDayaManusiaController@saveAnggotaKalak');
            Route::post('delete-anggota', 'SDM\SumberDayaManusiaController@deleteAnggota');
            Route::post('save-kedudukan-pegawai', 'SDM\SumberDayaManusiaController@saveKedudukanPegawai');
            Route::post('delete-pendidikan-pegawai', 'SDM\SumberDayaManusiaController@deletePendidikan');
            Route::post('delete-jabatan-pegawai', 'SDM\SumberDayaManusiaController@deleteJabatan');
            /*END POST*/
            Route::group(['prefix' => 'pelatihan'], function () {
                /*GET*/
                Route::get('get-combo-pelatihan', 'SDM\PelatihanController@getComboPelatihan');
                Route::get('get-daftar-monitoring-pengajuan-pelatihan', 'SDM\PelatihanController@GetDaftarMonitoringPengajuanPelatihan');
                Route::get('get-data-pengajuan-pelatihan', 'SDM\PelatihanController@GetDaftarPengajuanPelatihan');
                Route::get('get-detail-pengajuan-pelatihan', 'SDM\PelatihanController@getDetailPengajuanPenelitian');
                Route::get('get-combo-data-pelatihan', 'SDM\PelatihanController@getComboDataPelatihan');
                Route::get('get-data-peserta-pelatihan', 'SDM\PelatihanController@GetDaftarPesertaPelatihan');
                Route::get('get-daftar-kehadiran-peserta-pelatihan', 'SDM\PelatihanController@GetDaftarKehadiranPesertaPelatihan');
                Route::get('get-daftar-rekapitulasi-kehadiran-peserta-pelatihan', 'SDM\PelatihanController@GetDaftarRekapitulasiKehadiranPesertaPelatihan');
                Route::get('get-detail-kehadiran-peserta-pelatihan', 'SDM\PelatihanController@GetDetailKehadiranPesertaPelatihan');
                Route::get('get-data-pelaksanaan-pelatihan', 'SDM\PelatihanController@GetDaftarPelaksanaanPelatihan');
                Route::get('get-data-detail-evaluasi-penyelenggara', 'SDM\PelatihanController@getDetailEvaluasiPenyelenggara');
                Route::get('get-detail-evaluasi-narasumber-kompetensi', 'SDM\PelatihanController@getDetailEvaluasiNarasumber');
                Route::get('get-penyelengara-kategory', 'SDM\PelatihanController@getPenyelenggaraKategory');
                Route::get('get-daftar-evaluasi-penyelenggara', 'SDM\PelatihanController@getDaftarEvaluasiPenyelenggara');
                Route::get('get-daftar-evaluasi-narasumber', 'SDM\PelatihanController@getDaftarEvaluasiNarasumber');
                Route::get('get-daftar-narasumber', 'SDM\PelatihanController@getDataNarasumber');
                /*END GET*/

                /*POST*/
                Route::post('verifikasi-pengajuan-pelatihan', 'SDM\PelatihanController@saveVerifikasiPengajuan');
                Route::post('unverifikasi-pengajuan-pelatihan', 'SDM\PelatihanController@saveUnverifikasiPengajua');
                Route::post('hapus-pengajuan-pelatihan', 'SDM\PelatihanController@hapusDataPengajuanPelatihan');
                Route::post('save-pengajuan-pelatihan', 'SDM\PelatihanController@savePengajuanPelatihan');
                Route::post('delete-data-seminar', 'SDM\SumberDayaManusiaController@deleteDataSeminar');
                Route::post('delete-data-dikjur', 'SDM\SumberDayaManusiaController@deleteDataDikjur');
                Route::post('delete-data-tanda-jasa', 'SDM\SumberDayaManusiaController@deleteDataTandaJasa');
                Route::post('delete-data-kecakapan-bahasa', 'SDM\SumberDayaManusiaController@deleteDataKecakapanBahasa');
                Route::post('delete-data-organisasi-profesi', 'SDM\SumberDayaManusiaController@deleteDataOrganisasiProfesi');
                Route::post('save-kehadiran-peserta-pelatihan', 'SDM\PelatihanController@saveKehadiranPesertaPelatihan');
                Route::post('save-evaluasi-penyelenggara', 'SDM\PelatihanController@saveEvaluasiPenyelenggara');
                Route::post('save-evaluasi-narasumber', 'SDM\PelatihanController@saveEvaluasiNarasumber');
                Route::post('delete-data-pelatihan', 'SDM\SumberDayaManusiaController@deleteDataPelatihan');
                Route::post('hapus-evaluasi-penyelenggara', 'SDM\PelatihanController@hapusDataEvaluasiPenyelenggara');
                Route::post('hapus-evaluasi-narasumber', 'SDM\PelatihanController@hapusDataEvaluasiNarasumberKompetensi');
                Route::post('save-daftar-penyelenggara-kategory', 'SDM\PelatihanController@savePenyelenggaraKategory');
                Route::post('save-data-narasumber', 'SDM\PelatihanController@saveDataNarasumber');
                Route::post('hapus-data-narasumber', 'SDM\PelatihanController@hapusNarasumber');
                /*END POST*/
            });
            Route::group(['prefix' => 'pendidikan'], function () {
                Route::get('get-daftar-diklat-kategory', 'SDM\SumberDayaManusiaController@getDaftarDiklatKategory');
                Route::get('get-institusi-diklat-kategory', 'SDM\SumberDayaManusiaController@getInstitusiDiklatKategory');
                Route::get('get-fakultas-kategory', 'SDM\SumberDayaManusiaController@getFakultasKategory');
                Route::get('get-jurusan-kategory', 'SDM\SumberDayaManusiaController@getJurusanKategory');
                Route::get('get-daftar-diklat-jurusan', 'SDM\SumberDayaManusiaController@getDaftarDiklatJurusan');
                Route::get('get-combo-map-kategori', 'SDM\SumberDayaManusiaController@getDataComboMapKategoriPendidikanToProgramPendidikan');
                Route::get('get-dcbo-pesertadidik', 'SDM\SumberDayaManusiaController@getDataComboPesertaDidik');
                Route::get('get-daftar-pesertadidik', 'SDM\SumberDayaManusiaController@getDaftarPesertaDidik');
                Route::get('get-cbo-tenagapengajar', 'SDM\SumberDayaManusiaController@getDataComboTenagaPengajar');
                Route::get('get-daftar-tenagapengajar', 'SDM\SumberDayaManusiaController@getDaftarTenagaPengajar');
                Route::get('get-detail-tenagapengajar', 'SDM\SumberDayaManusiaController@getDetailTenagaPengajar');

                Route::post('save-tenagapengajar', 'SDM\SumberDayaManusiaController@saveTenagaPengajar');
                Route::post('hapus-tenagapengajar', 'SDM\SumberDayaManusiaController@hapusTenagaPengajar');
                Route::post('save-daftar-diklat-jurusan', 'SDM\SumberDayaManusiaController@saveDiklatJurusan');
                Route::post('save-daftar-diklat-kategory', 'SDM\SumberDayaManusiaController@saveDiklatKategory');
                Route::post('save-daftar-institusi-kategory', 'SDM\SumberDayaManusiaController@saveInstitusiKategory');
                Route::post('save-daftar-fakultas-kategory', 'SDM\SumberDayaManusiaController@saveFakultasKategory');
                Route::post('save-daftar-jurusan-kategory', 'SDM\SumberDayaManusiaController@saveJurusanKategory');
                Route::post('save-pesertadidik', 'SDM\SumberDayaManusiaController@savePesertaDidik');
                Route::post('hapus-peserta-didik', 'SDM\SumberDayaManusiaController@hapusPesertaDidik');
            });
            Route::group(['prefix' => 'penelitian'], function () {
                Route::get('get-data-combo-penelitian', 'SDM\PenelitianController@getDataComboPenelitian');
                Route::post('save-kegiatan-penelitian-eksternal', 'SDM\PenelitianController@saveKegiatanPenelitianExternal');
                Route::get('get-daftar-penelitian-eksternal', 'SDM\PenelitianController@getDaftarPenelitianKegiatanEksternal');
                Route::post('batal-kegiatan-penelitian-eksternal', 'SDM\PenelitianController@saveBatalPenelitianEksternal');
                Route::get('get-detail-penelitian-eksternal', 'SDM\PenelitianController@getDetailPenelitianKegiatanEksternal');
                Route::post('save-kegiatan-penelitian-pegawai', 'SDM\PenelitianController@saveKegiatanPenelitianPegawai');
                Route::post('batal-kegiatan-penelitian-pegawai', 'SDM\PenelitianController@saveBatalPenelitianPegawai');
                Route::get('get-data-pegawai', 'SDM\PenelitianController@getDaftarPegawai');
                Route::get('get-daftar-penelitian-pegawai', 'SDM\PenelitianController@getDaftarPenelitianKegiatanPegawai');
                Route::get('get-detail-penelitian-pegawai', 'SDM\PenelitianController@getDetailPenelitianKegiatanPegawai');
            });
        });
        Route::group(['prefix' => 'rensar'], function () {
            Route::get('get-indikator-rensar', 'EIS\EISController@getIndikatorRensar');
        });
        Route::group(['prefix' => 'sysadminpaket'], function () {
            Route::get('get-expired-pass-user', 'Auth\LoginController@getExpiredPassUser');
            Route::get('get-list-combo', 'SysAdmin\SysAdminPaketController@getlistCombo');
            Route::get('get-map-ruangantojenis', 'SysAdmin\SysAdminPaketController@getDataMapping');
            Route::post('save-map-ruangantojenis', 'SysAdmin\SysAdminPaketController@saveMapRuanganToJenis');
            Route::get('get-combo-paket', 'SysAdmin\SysAdminPaketController@getComboPaket');
            Route::get('get-mapping-paket', 'SysAdmin\SysAdminPaketController@getMappingPaket');
            Route::post('save-map-paket-to-produk', 'SysAdmin\SysAdminPaketController@saveMapPaketToProduk');
            Route::post('delete-map-paket-to-produk', 'SysAdmin\SysAdminPaketController@deleteMapPaketToProduk');
            Route::post('save-map-paket-to-produk-ruangan', 'SysAdmin\SysAdminPaketController@saveMapPaketToProdukRuangan');
            Route::get('get-combo-mkttbku', 'SysAdmin\SysAdminPaketController@getComboMKTTBKU');
            Route::get('get-mapping-mkttbku', 'SysAdmin\SysAdminPaketController@getMappingMKTTBKU');
            Route::post('save-data-mkttbku', 'SysAdmin\SysAdminPaketController@saveMapMKTTBKU');
            Route::get('get-paket-obat', 'SysAdmin\SysAdminPaketController@getDataPaketObat');
            Route::get('get-id-user-login/{id}', 'SysAdmin\SysAdminPaketController@getIdUserLogin');
            Route::post('save-data-paket-obat', 'SysAdmin\SysAdminPaketController@savePaketObat');
            Route::post('delete-data-paket-obat', 'SysAdmin\SysAdminPaketController@DeletePaketObat');
            Route::post('delete-data-mkttbku', 'SysAdmin\SysAdminPaketController@DeleteMapMKTTBKU');
            Route::get('get-master-diagnosa', 'SysAdmin\SysAdminPaketController@getMasterDiagnosa');
            Route::post('update-master-diagnosa', 'SysAdmin\SysAdminPaketController@UpdateMasterDiagnosa');
            Route::get('get-detail-master-paket', 'SysAdmin\SysAdminPaketController@getDetailMasterPaket');
            //dari farmasi/PelayananResepController
            Route::get('get-produkdetail', 'SysAdmin\SysAdminPaketController@getProdukDetail');
        });

        Route::group(['prefix' => 'sysadmin'], function () {
            Route::get('get-list-combo', 'SysAdmin\SysAdminController@getlistCombo');
            Route::get('get-map-ruangantojenis', 'SysAdmin\SysAdminController@getDataMapping');
            Route::post('save-map-ruangantojenis', 'SysAdmin\SysAdminController@saveMapRuanganToJenis');
            Route::get('get-combo-paket', 'SysAdmin\SysAdminController@getComboPaket');
            Route::get('get-mapping-paket', 'SysAdmin\SysAdminController@getMappingPaket');
            Route::post('save-map-paket-to-produk', 'SysAdmin\SysAdminController@saveMapPaketToProduk');
            Route::post('delete-map-paket-to-produk', 'SysAdmin\SysAdminController@deleteMapPaketToProduk');
            Route::get('get-combo-mkttbku', 'SysAdmin\SysAdminController@getComboMKTTBKU');
            Route::get('get-mapping-mkttbku', 'SysAdmin\SysAdminController@getMappingMKTTBKU');
            Route::post('save-data-mkttbku', 'SysAdmin\SysAdminController@saveMapMKTTBKU');
            Route::post('delete-data-mkttbku', 'SysAdmin\SysAdminController@DeleteMapMKTTBKU');
            Route::group(['prefix' => 'menu'], function () {
                Route::get('get-menu-dinamis', 'SysAdmin\ModulAplikasiController@getMenuDinamis');
                Route::get('get-all-default-objek-modul', 'SysAdmin\ModulAplikasiController@getAllDefaultObjectModul');
                Route::get('get-modul-check', 'SysAdmin\ModulAplikasiController@getModulCheck'); //ash untuk cek modul
                //                Route::get('get-menu-dinamis', 'SysAdmin\ModulAplikasiController@getMenuDinamis');
                Route::get('get-objek-modul-aplikasi', 'SysAdmin\ModulAplikasiController@getObjekModulAplikasiStandar');
                Route::get('get-map-modul-to-objek-modul-aplikasi', 'SysAdmin\ModulAplikasiController@getMapModulToObjekModul');
                Route::post('save-modul-aplikasi', 'SysAdmin\ModulAplikasiController@saveModulAplikasi');
                Route::get('get-daftar-objek-modul-aplikasi', 'SysAdmin\ModulAplikasiController@getDaftarObjekModulAplikasi');
                Route::post('save-objek-modul-aplikasi', 'SysAdmin\ModulAplikasiController@saveObjekModulAplikasi');
                Route::get('get-map-login-to-modul-aplikasi', 'SysAdmin\ModulAplikasiController@getMapLoginToModulApp');
                Route::get('save-map-login-to-modul-aplikasi', 'SysAdmin\ModulAplikasiController@saveMapLoginToModulApp');
                Route::get('delete-map-login-to-modul-aplikasi', 'SysAdmin\ModulAplikasiController@deleteMapLoginToModulApp');
                Route::post('save-map-modul-to-objek-modul-aplikasi', 'SysAdmin\ModulAplikasiController@saveMapModultoObjekModulApp');
                Route::post('save-objek-modul-from-json', 'SysAdmin\ModulAplikasiController@saveObjekModulAplikasiFromJson');
                Route::post('save-waktu-login', 'SysAdmin\ModulAplikasiController@saveEndWaktuLogin');
                Route::get('get-waktu-login', 'SysAdmin\ModulAplikasiController@getEndWaktuLogin');
                Route::post('delete-end-waktu-login', 'SysAdmin\ModulAplikasiController@deleteEndWaktuLogin');
                Route::post('save-new-user', 'SysAdmin\ModulAplikasiController@saveNewUser');
                Route::get('get-pegawai-part', 'SysAdmin\ModulAplikasiController@getPegawaiPart');
                Route::get('get-daftar-user', 'SysAdmin\ModulAplikasiController@getDaftarUser');
                Route::post('delete-new-user', 'SysAdmin\ModulAplikasiController@deleteNewUser');
                Route::get('get-master-modul-aplikasi', 'SysAdmin\ModulAplikasiController@getMasterModulAplikasi');
                Route::post('update-status-public-user', 'SysAdmin\ModulAplikasiController@updateStatusPublicUser');

                Route::get('data', 'SysAdmin\HakAksesPegawaiController@getData');
                Route::post('simpan-modul-aplikasi', 'SysAdmin\HakAksesPegawaiController@modulAplikasi');
                Route::post('hapus-modul-aplikasi', 'SysAdmin\HakAksesPegawaiController@HapusModulAplikasi');
                Route::post('simpan-objek-modul-aplikasi', 'SysAdmin\HakAksesPegawaiController@objekModulAplikasi');
                Route::post('hapus-objek-modul-aplikasi', 'SysAdmin\HakAksesPegawaiController@HapusObjekModulAplikasi');
                Route::post('hapus-map-objek-modul-aplikasi', 'SysAdmin\HakAksesPegawaiController@HapusMAPObjekModulAplikasi');
                Route::post('map-objek-modultokelompok-user', 'SysAdmin\HakAksesPegawaiController@mapObjekModulToKelompokUser');
                Route::post('hapus-objek-modultokelompok-user', 'SysAdmin\HakAksesPegawaiController@HapusmapObjekModulToKelompokUser');
                Route::get('data-map-login-usertoruangan', 'SysAdmin\HakAksesPegawaiController@getMapLoginUsertoRuangan');
                Route::post('map-login-usertoruangan', 'SysAdmin\HakAksesPegawaiController@MapLoginUsertoRuangan');
                Route::delete('map-login-usertoruangan', 'SysAdmin\HakAksesPegawaiController@HapusMapLoginUsertoRuangan');
                Route::get('data-subsitem-modul-menu', 'SysAdmin\HakAksesPegawaiController@getDataSubsitemModulMenu');
                Route::get('data-ruangan/{id}', 'SysAdmin\HakAksesPegawaiController@getRuangan');
                Route::get('svc-modul', 'SysAdmin\HakAksesPegawaiController@getalldata');
                Route::post('svc-modul/add', 'SysAdmin\HakAksesPegawaiController@addAlldata');
                Route::get('svc-ruang', 'SysAdmin\HakAksesPegawaiController@getdataRuangAll');
                Route::post('svc-ruang/add', 'SysAdmin\HakAksesPegawaiController@addMapUserRuang');
                Route::get('data-pegawai', 'SysAdmin\HakAksesPegawaiController@getallPegawai');
                Route::get('get-recursive-ruangan', 'SysAdmin\HakAksesPegawaiController@getRecursiveRuangan');
                Route::get('get-recursive-modul', 'SysAdmin\HakAksesPegawaiController@getRecursiveModul');

                Route::get('save-map-luRuangan', 'SysAdmin\HakAksesPegawaiController@saveMapLoginUser');
                Route::get('save-hapus-map-luRuangan', 'SysAdmin\HakAksesPegawaiController@saveHapusMapLoginUser');
                Route::get('hash-password', 'SysAdmin\HakAksesPegawaiController@hasPassword');
                Route::get('get-child-idhead', 'SysAdmin\HakAksesPegawaiController@getChildIdHead');
                Route::get('get-kelompok-user', 'SysAdmin\HakAksesPegawaiController@getKelompokUser');
            });
            Route::group(['prefix' => 'logging'], function () {
                Route::get('save-log-verifikasi-tarek', 'SysAdmin\LoggingController@saveLoggingVerifTarek');
                Route::get('save-log-unverifikasi-tarek', 'SysAdmin\LoggingController@saveLoggingUnverifTarek');
                Route::post('save-log-input-tindakan', 'SysAdmin\LoggingController@saveLoggingInputTindakan');
                Route::post('save-log-hapus-tindakan', 'SysAdmin\LoggingController@saveLogHapusTindakan');
                Route::get('save-log-konsul', 'SysAdmin\LoggingController@saveLoggingKonsulRuangan');
                Route::get('save-log-input-resep', 'SysAdmin\LoggingController@saveLogInputResep');

                //trisno
                Route::post('save-log-ganti-tanggal-resep', 'SysAdmin\LoggingController@saveLogGantiTanggalResep');

                Route::get('save-log-hapus-resep', 'SysAdmin\LoggingController@saveLogHapusResep');
                Route::get('save-log-ubah-rekanan', 'SysAdmin\LoggingController@saveLogUbahRekanan');
                Route::get('save-log-pendaftaran-pasien', 'SysAdmin\LoggingController@saveLogPasienDaftar');
                Route::get('save-log-pindah-ruangan', 'SysAdmin\LoggingController@saveLogPindahKamar');
                Route::get('save-log-pulang-pasien', 'SysAdmin\LoggingController@saveLogPulanginPasien');
                Route::get('save-log-batal-bayar', 'SysAdmin\LoggingController@saveLogBatalBayar');
                Route::get('save-log-retur-resep', 'SysAdmin\LoggingController@saveLogReturResep');
                Route::get('Daftar-log-user', 'SysAdmin\LoggingController@getDaftarLog');
                Route::get('save-log-all', 'SysAdmin\LoggingController@saveLoggingAll');
                Route::get('get-data-combo', 'SysAdmin\LoggingController@getCombo');
                Route::get('get-aktivitas-user', 'SysAdmin\LoggingController@getAktivitasUser');
                Route::get('save-log-bayar', 'SysAdmin\LoggingController@saveLogBayartTagihanPasien');
                Route::post('save-log-cetak-emr', 'SysAdmin\LoggingController@saveLoggingCetakEMR');

                Route::post('save-log-ubah-harga', 'SysAdmin\LoggingController@saveLoggingUbahHarga');
            });
            Route::group(['prefix' => 'settingdatafixed'], function () {
                Route::get('get-settingdatafixed', 'SysAdmin\Master\SettingDataFixedController@getDataFixed');
                Route::get('get-settingdatafixedbyid/{id}', 'SysAdmin\Master\SettingDataFixedController@getSettingById');
                Route::post('post-settingdatafixe', 'SysAdmin\Master\SettingDataFixedController@SaveSettingDataFixed');
                Route::post('hapus-settingdatafixe', 'SysAdmin\Master\SettingDataFixedController@HapusSettingDataFixed');
                Route::post('tambah-settingdatafixe', 'SysAdmin\Master\SettingDataFixedController@TambahSettingDataFixed');
                Route::post('delete', 'SysAdmin\Master\SettingDataFixedController@deleteSetting');
                Route::get('update-status-enabled', 'SysAdmin\Master\SettingDataFixedController@updateStatuEnabled');
                Route::get('get-kelompok-setting', 'SysAdmin\Master\SettingDataFixedController@getKelompokSettingDataFix');
                Route::get('get-setting-detail', 'SysAdmin\Master\SettingDataFixedController@getSettingDetail');
                Route::get('get-setting-combo', 'SysAdmin\Master\SettingDataFixedController@getComboPart');
                Route::post('update-setting', 'SysAdmin\Master\SettingDataFixedController@updateSettingDataFix');
                Route::get('get-table', 'SysAdmin\Master\SettingDataFixedController@getTable');
                Route::get('get-field-table', 'SysAdmin\Master\SettingDataFixedController@getFieldTable');
                Route::get('get-data-from-table', 'SysAdmin\Master\SettingDataFixedController@getDataFromTable');
                Route::get('get-report-display', 'SysAdmin\Master\SettingDataFixedController@getReportDisplayTable');
                Route::get('get/{namaField}', 'SysAdmin\Master\SettingDataFixedController@getSettingDataFixedGeneric');
                Route::get('get-report', 'SysAdmin\Master\SettingDataFixedController@getReport');
            });
            Route::group(['prefix' => 'general'], function () {
                // GET //
                Route::get("get-data-pasien-byNoreg/{noreg}", "SysAdmin\GeneralController@getDataPasienByNoreg2");
                Route::get('get-data-combo-surat', 'SysAdmin\GeneralController@getDataComboSurat');
                Route::get('get-daftar-template', 'SysAdmin\GeneralController@getTemplate');
                // all
                Route::get('get-daftar-template-hasil', 'SysAdmin\GeneralController@getTemplateHasil');
                Route::post('save-template-hasil', 'SysAdmin\GeneralController@saveTempalteHasil');
                //
                Route::get('identifikasi-sep', 'SysAdmin\GeneralController@IdentifikasiSEP');
                Route::get('get-sudah-posting', 'SysAdmin\GeneralController@getStatusPostingTgl');
                Route::get('get-status-close/{noregistrasi}', 'SysAdmin\GeneralController@getStatusClosePeriksa');
                Route::get('get-status-konsul/{noregistrasi}/{ruanganfk}', 'SysAdmin\GeneralController@getStatusKonsul');
                Route::get('get-tgl-posting', 'SysAdmin\GeneralController@getPostingTgl');
                Route::get('get-combo-pegawai', 'SysAdmin\GeneralController@getDataPegawaiGeneral');
                Route::get('get-combo-sirs', 'SysAdmin\GeneralController@getDataSIRS');
                Route::get('get-combo-address', 'SysAdmin\GeneralController@getComboAddressGeneral');
                Route::get('get-desa-kelurahan', 'SysAdmin\GeneralController@getDesaKelurahanGeneral');
                Route::get('get-alamat-bykodepos', 'SysAdmin\GeneralController@getAlamatByKodePosGeneral');
                Route::get('get-datacombo-ruangan', 'SysAdmin\GeneralController@getDataComboRuanganGeneral');
                Route::get('get-datacombo-rekanan', 'SysAdmin\GeneralController@getDataComboRekananGeneral');
                Route::get('get-sudah-verif', 'SysAdmin\GeneralController@getVerifikasiNoregistrasiGeneral');
                Route::get('view-bed', 'SysAdmin\GeneralController@viewBed');
                Route::get('get-datacombo-produk', 'SysAdmin\GeneralController@getProdukPart');
                Route::get('get-datacombo-icd10', 'SysAdmin\GeneralController@getIcd10');
                Route::get('get-jenis-pelayanan/{norec_pd}', 'SysAdmin\GeneralController@getJenisPelayananByNorecPd');
                Route::get('get-tindakan', 'SysAdmin\GeneralController@getTindakanPart');
                Route::get('get-komponenharga', 'SysAdmin\GeneralController@getKomponenHarga');
                Route::get('get-komponenharga-paket', 'SysAdmin\GeneralController@getKomponenHargaPaket');
                Route::get('get-acc-number-radiologi', 'SysAdmin\GeneralController@getAccNumberRadiologi');
                Route::get('get-produk', 'SysAdmin\GeneralController@getDataProduk');
                Route::get('get-master-diagnosa-kep', 'SysAdmin\GeneralController@getDiagnosaKeperawatan');
                Route::get('get-ruangan-part', 'SysAdmin\GeneralController@getRuanganPartgetRuanganPart');
                Route::get('get-combo-pegawai', 'SysAdmin\GeneralController@getComboPegawai');
                Route::get('get-icd9-part', 'SysAdmin\GeneralController@getPartIcd9');
                Route::get('get-icd10-part', 'SysAdmin\GeneralController@getPartIcd10');
                Route::get('get-terbilang/{number}', 'SysAdmin\GeneralController@getTerbilangGeneral');                // GET //
                Route::get('get-icd9-part', 'SysAdmin\GeneralController@getPartIcd9');
                Route::get('get-icd10-part', 'SysAdmin\GeneralController@getPartIcd10');
                Route::get('settingdatafixed/get/{namaField}', 'SysAdmin\Master\SettingDataFixedController@getSettingDataFixedGeneric');
                Route::get('get-paket-tindakan', 'SysAdmin\GeneralController@getPaketTindakan');
                Route::get('get-combo-registrasi-general', 'SysAdmin\GeneralController@getComboRegGeneral');
                Route::get('get-data-bynocm', 'SysAdmin\GeneralController@getPsnByNoCmGeneral');
                Route::get('get-combo-ruangan', 'SysAdmin\GeneralController@getRuangan');
                Route::get('get-combo-akomdasi', 'SysAdmin\GeneralController@getComboAkomodasi');
                Route::get('get-combo-ruangan-general', 'SysAdmin\GeneralController@getComboRuanganGeneral');
                Route::get('get-dokter-general', 'SysAdmin\GeneralController@getcomboDokterPart');
                Route::get('get-diagnosa-pasien', 'SysAdmin\GeneralController@getDiagnosaPasien');
                Route::get('get-data-produk-detail', 'SysAdmin\GeneralController@getDataProdukDetail');
                Route::get('get-datacombo-departemen', 'SysAdmin\GeneralController@getDataComboDepartemenGeneral');
                Route::get('get-data-detail-pasien-general', 'SysAdmin\GeneralController@getDetailPasienGeneral');
                Route::get('get-datacombo-handhygiene-general', 'SysAdmin\GeneralController@getDataComboHandHygieneGeneral');
                Route::get('get-datacombo-indikasi-general', 'SysAdmin\GeneralController@getDataComboIndikasiGeneral');
                Route::get('get-datacombo-jenispegawai-general', 'SysAdmin\GeneralController@getDataComboJenisPegawaiGeneral');
                Route::get('get-datacombo-jenispegawai-cppt', 'SysAdmin\GeneralController@getDataComboJenisPegawaiCPPT');
                Route::get('get-daftar-permohonan-simrs', 'SysAdmin\GeneralController@getDaftarPermohonanSIMRS');
                Route::get('get-jenis-pekerjaan-simrs', 'SysAdmin\GeneralController@getJenisPekerjaanSIMRS');
                Route::get('get-status-pekerjaan-simrs', 'SysAdmin\GeneralController@getStatusPekerjaanSIMRS');
                Route::get('get-combo-pegawai-simrs', 'SysAdmin\GeneralController@getDataPegawaiGeneralSIMRS');
                Route::get('get-combo-jabatan', 'SysAdmin\GeneralController@getComboJabatanPegawai');
                Route::get('get-tindakan-with-details', 'SysAdmin\GeneralController@getTindakanWithDetail');
                // GET //

                // POST //
                Route::post('hapus-jurnal-penerimaan-barang', 'SysAdmin\GeneralController@PostingHapusJurnal_Penerimaan');
                Route::post('save-jurnal-penerimaan-barang', 'SysAdmin\GeneralController@PostingJurnal_terimabarang');
                Route::post('save-jurnal-amprahan-barang-all', 'SysAdmin\GeneralController@PostingJurnal_amprahanForDaftar');
                Route::post('hapus-jurnal-amprahan-barang', 'SysAdmin\GeneralController@PostingHapusJurnal_BatalKirim');
                Route::post('update-jurnal-batalkirim-peritem', 'SysAdmin\GeneralController@UpdatePostingJurnal_BatalKirimPerItem');
                Route::post('hapus-jurnal-pembayarantagihan', 'SysAdmin\GeneralController@hapusJurnalpembayaranTagihanNoBatch');
                Route::post('save-jurnal-verifikasi_tarek', 'SysAdmin\GeneralController@PostingJurnal_strukpelayanan_t_verifikasi_tarek');
                Route::post('save-jurnal-pelayananpasien_t', 'SysAdmin\GeneralController@PostingJurnal_pelayananpasien_t');
                Route::post('save-jurnal-pembayarantagihan', 'SysAdmin\GeneralController@PostingJurnal_pembayaranTagihanNoBatch');
                Route::post('save-jurnal-pembayaran_tagihan', 'SysAdmin\GeneralController@PostingJurnal_pembayaran_tagihan');
                Route::post('save-jurnal-setorankasir', 'SysAdmin\GeneralController@PostingJurnal_setoranKasir');
                Route::post('hapus-jurnal-setorankasir', 'SysAdmin\GeneralController@hapusJurnalSetoranKasir');
                Route::post('post-diagnosa-kep', 'SysAdmin\GeneralController@postMasterDiagnosaKeperawatan');
                Route::post('post-{table}-diagnosakeperawatan/{method}', 'SysAdmin\GeneralController@postDetailDiagnoaKep');
                Route::post('save-map-akomodasi', 'SysAdmin\GeneralController@saveMappingAkomodasiCuy');
                Route::post('save-permohonan-simrs', 'SysAdmin\GeneralController@SavePermohonanSIMRS');
                Route::post('save-jenis-kerusakan-simrs', 'SysAdmin\GeneralController@SaveDataJenisKerusakanSIMRS');
                Route::post('hapus-permohonan-simrs', 'SysAdmin\GeneralController@HapusPermohonanSIMRS');
                // POST //
                Route::post('save-template-dok', 'SysAdmin\GeneralController@saveTempalteDok');
                Route::get('get-apd-general', 'SysAdmin\GeneralController@getAPD');
                Route::group(['prefix' => 'rensar'], function () {
                    /*GET*/
                    Route::get('get-data-combo', 'EIS\EISController@getCombo');
                    Route::get('get-data-ruangan-cari', 'EIS\EISController@getComboDataRuangan');
                    Route::get('get-data-indikator', 'EIS\EISController@getDaftarIndikatorRensar');
                    Route::get('get-jenis-indikator', 'EIS\EISController@getJenisIndikator');
                    Route::get('get-indikator-rensar-m', 'EIS\EISController@getIndikatorRensar_M');
                    Route::get('get-ruangan-indikator', 'EIS\EISController@getRuanganIndikatorRensar');
                    Route::get('get-indikator-rensar', 'EIS\EISController@getIndikatorRensar');
                    Route::get('get-kelompok-transaksi', 'EIS\EISController@getKelompokTransaksi');
                    Route::get('get-kelompok-akun', 'EIS\EISController@getAkunTransaksi');
                    Route::get('get-tipe-layanan', 'EIS\EISController@getTipeLayanan');
                    Route::get('get-mapping-bank', 'EIS\EISController@getMappingBank');

                    Route::get('get-jenis-indikator', 'EIS\EISController@getJenisIndikator');
                    Route::get('get-target-indikator', 'EIS\EISController@getTargetIndikator');
                    Route::get('get-indikator-ikt', 'EIS\EISController@getIndikatorIKT');
                    /*END GET*/

                    /*POST*/
                    Route::post('save-indikator-rensar-m', 'EIS\EISController@saveIndikatorRensar_M');
                    Route::post('delete-master-indikator', 'EIS\EISController@deleteIndikatorRensar');
                    Route::post('save-master-indikator', 'EIS\EISController@saveIndikatorRensar_M');
                    Route::post('delete-master-indikator-new', 'EIS\EISController@deleteIndikatorRensar_M');
                    Route::post('save-jenis-indikator', 'EIS\EISController@saveJenisInidkator');
                    Route::post('save-target-indikator', 'EIS\EISController@saveTargetIndikator');
                    Route::post('delete-target-indikator', 'EIS\EISController@deleteTargetIndikator');
                    Route::post('post-waktu-tunggu-pelayanan-lab', 'EIS\EISController@postWaktuTungguPelayananLab');
                    Route::post('post-waktu-tunggu-pelayanan-rad', 'EIS\EISController@postWaktuTungguPelayananRad');
                    Route::post('save-indikator', 'EIS\EISController@saveIndikatorRensar');
                    Route::post('delete-indikator', 'EIS\EISController@deleteIndikatorRensar');
                    Route::post('post-ketepatan-jam-visite', 'EIS\EISController@postKetepatanJamVisite');
                    Route::post('post-kejadian-pasien-jatuh', 'EIS\EISController@postPasienJatuh');
                    Route::post('post-tindakan-nicu', 'EIS\EISController@postTindakanOperasiNICU');
                    Route::post('post-keluhan-pelanggan', 'EIS\EISController@postKeluhanPelanggan');
                    Route::post('post-pengembalian-dok-rm', 'EIS\EISController@postPengembalianRekamMedik');
                    Route::post('post-waktu-tunggu-rj', 'EIS\EISController@postWaktuTungguRawatJalan');
                    Route::post('save-kelompok-transaksi', 'EIS\EISController@saveKelompokTransaksi');

                    Route::post('save-tipelayanan', 'EIS\EISController@saveTipelayanan');
                    Route::post('save-mapakunbank', 'EIS\EISController@saveMapAkunBank');
                    Route::post('save-kelompok-transaksi-new', 'EIS\EISController@saveKelompokTransaksiNew'); //ash

                    /*POST*/
                });
            });
            Route::group(['prefix' => 'master'], function () {
                // GET //
                Route::get('get-data-produk', 'SysAdmin\Master\MasterController@getListProduk');
                Route::get('get-produkbyid', 'SysAdmin\Master\MasterController@getProdukbyId');
                Route::get('get-jenis-produk', 'SysAdmin\Master\MasterController@getjenisproduk');
                Route::get('get-detail-jenis-produk', 'SysAdmin\Master\MasterController@getDetailjenisprodukbyIdjenisproduk');
                Route::get('get-data-combo-master', 'SysAdmin\Master\MasterController@getDataComboMaster');
                Route::get('get-data-combo-rekanan', 'SysAdmin\Master\MasterController@getDataRekananMaster');
                Route::get('get-detail-produk-kelompok', 'SysAdmin\Master\MasterController@getDataProdukbyDetailProduk');
                Route::get('get-data-produk-kelompok', 'SysAdmin\Master\MasterController@getDataKelompok');
                Route::get('get-data-produk-perkode', 'SysAdmin\Master\MasterController@getDataProdukPerKode');
                Route::get('get-konversi-satuan', 'SysAdmin\Master\MasterController@getKonversiSatuan');
                Route::get('get-data-barang-konversi', 'SysAdmin\Master\MasterController@getBarangKonversi');
                Route::get('get-data-rekanan', 'SysAdmin\Master\MasterController@getDataRekanan');
                Route::get('get-rekanan-perkode', 'SysAdmin\Master\MasterController@getRekananById');
                Route::get('get-tempattidur', 'SysAdmin\Master\MasterController@getDataTempattidur');
                Route::post('delete-bed', 'SysAdmin\Master\MasterController@deletebed');
                Route::get('get-list_table', 'SysAdmin\Master\MasterController@getKelompokTableMaster');
                Route::get('get-table-detail', 'SysAdmin\Master\MasterController@getTableDetail');
                Route::get('get-table-row-detail', 'SysAdmin\Master\MasterController@getTableRowDetail');
                Route::get('get-setting-combo', 'SysAdmin\Master\MasterController@getComboPartTable');

                Route::get('get-kelompok-user', 'SysAdmin\Master\MasterController@getKelompokUser');
                Route::get('get-tarif-harganettoprodukbykelas', 'SysAdmin\Master\MasterController@view_harganettoprodukbykelas');
                Route::get('get-tarif-harganettoprodukbykelas_d', 'SysAdmin\Master\MasterController@view_harganettoprodukbykelasD');
                Route::get('get-tarif-produk', 'SysAdmin\Master\MasterController@GetTarifProduk');
                Route::get('get-combo-tarif', 'SysAdmin\Master\MasterController@getComboHargaNetto');
                Route::get('get-list-komponen', 'SysAdmin\Master\MasterController@ListMaster');

                Route::get('get-data-mapping-ruangan-to-produk', 'SysAdmin\Master\MasterController@getDataMapRuanganToProduk');
                Route::get('get-produkbyIdformap', 'SysAdmin\Master\MasterController@getProdukbyIdformap');

                Route::get('get-ruanganbyidDepart/{id}', 'SysAdmin\Master\MasterController@getRuanganbyIddepartemen');
                Route::get('list-produk/{limit?}', 'SysAdmin\Master\MasterController@getListProdukMap');
                Route::get('list-produk-penjamin/{limit?}', 'SysAdmin\Master\MasterController@getListProdukMapPenjamin');
                Route::get('list-produk-penjamin-isi/{limit?}', 'SysAdmin\Master\MasterController@getListProdukMapPenjaminisi');

                Route::get('get-kelompok-produk', 'SysAdmin\Master\MasterController@getkelompokproduk');
                Route::get('get-daftar-jenisdiet', 'SysAdmin\Master\MasterController@getDaftarJenisDiet');
                Route::get('get-daftar-jeniswaktu', 'SysAdmin\Master\MasterController@getDaftarJenisWaktu');
                Route::get('get-departemen', 'SysAdmin\Master\MasterController@getDepartemen');

                Route::get('get-daftar-kategorydiet', 'SysAdmin\Master\MasterController@getKategoryDiet');
                Route::get('get-combo-siklus-gizi', 'SysAdmin\Master\MasterController@getComboSiklus');
                Route::get('get-daftar-siklus-gizi', 'SysAdmin\Master\MasterController@getDaftarSiklusGizi');
                Route::get('get-cek-harga-produk', 'SysAdmin\Master\MasterController@getCekHargaProduk');

                Route::get('get-mapruangantokelas', 'SysAdmin\Master\MasterController@getMapRuanganToKelas');
                Route::post('delete-mapruangantokelas', 'SysAdmin\Master\MasterController@deleteMapRuanganToKelas');
                Route::post('update-mapruangantokelas', 'SysAdmin\Master\MasterController@updateMapRuanganToKelas');
                Route::post('save-mapruangantokelas', 'SysAdmin\Master\MasterController@saveMapRuanganToKelas');

                Route::get('get-dataruangan', 'SysAdmin\Master\MasterController@getDataRuangan');
                Route::post('update-ruangan', 'SysAdmin\Master\MasterController@updateRuangan');
                Route::post('save-ruangan', 'SysAdmin\Master\MasterController@saveRuangan');

                Route::get('get-datakamar', 'SysAdmin\Master\MasterController@getDataKamar');
                Route::post('update-kamar', 'SysAdmin\Master\MasterController@updateKamar');
                Route::post('save-kamar', 'SysAdmin\Master\MasterController@saveKamar');

                Route::post('save-map-account-bank', 'SysAdmin\Master\MasterController@saveMapAccountBank');
                Route::get('get-dataaccountbank', 'SysAdmin\Master\MasterController@getDataAccountBank');
                Route::post('hapus-map-account-bank', 'SysAdmin\Master\MasterController@hapusMapAccountBank');

                Route::get('get-datamaptipelayanan', 'SysAdmin\Master\MasterController@getDataMapTipeLayanan');
                Route::post('update-tipe-layanan', 'SysAdmin\Master\MasterController@updateTipeLayanan');

                Route::post('update-kelasmapruangan', 'SysAdmin\Master\MasterController@updateKelasMapRuangan');
                //master menu gizi
                Route::get('get-daftar-menu-gizi', 'SysAdmin\Master\MasterController@getMappingMenu');
                Route::post('save-menu-gizi', 'Gizi\GiziController@saveMenuGizi');
                Route::post('delete-Menu-gizi', 'Gizi\GiziController@deleteMenuGizi');
                Route::post('updateberat-menu-gizi', 'Gizi\GiziController@updateberatgizi');

                Route::get('get-daftar-menu-gizi-transaksi', 'SysAdmin\Master\MasterController@getmenugizi');
                Route::post('save-menu', 'Gizi\GiziController@saveTindakan');
                Route::get('get-daftar-transaksi', 'Gizi\GiziController@gettransaksigizi');
                Route::get('get-daftar-transaksi2', 'Gizi\GiziController@gettransaksigizi2');

                Route::get('get-detailbahan', 'SysAdmin\Master\MasterController@getbahan');

                //SATU SEHAT
                Route::get('get-daftar-master-pegawai', 'SysAdmin\Master\MasterController@getDataMasterPegawai');
                Route::get('get-daftar-master-departemen', 'SysAdmin\Master\MasterController@getDataMasterDepartemen');
                Route::get('get-daftar-master-ruangan', 'SysAdmin\Master\MasterController@getDataMasterRuangan');
                Route::get('get-data-produkapotik', 'SysAdmin\Master\MasterController@getListProdukApotik');
                Route::get('get-data-combo-master-rev', 'SysAdmin\Master\MasterController@getDataComboMasterRev');

                Route::post('save-data-produk-apotik', 'SysAdmin\Master\MasterController@saveDataProdukApotik');
                Route::post('save-data-master-departemen', 'SysAdmin\Master\MasterController@saveDataMasterDepartemen');
                Route::post('delete-data-master-departemen', 'SysAdmin\Master\MasterController@deleteDataDepartemen');
                // GET //

                // POST //
                Route::post('save-siklus-gizi', 'Gizi\GiziController@saveSiklusGizi');
                Route::post('delete-siklus-gizi', 'Gizi\GiziController@deleteSiklusGizi');
                Route::post('save-statusenabled-produk', 'SysAdmin\Master\MasterController@UpdateStatusEnabledProduk');
                Route::post('save-data-produk', 'SysAdmin\Master\MasterController@saveDataProduk');
                Route::post('save-kelompok-produk-bpjs', 'SysAdmin\Master\MasterController@SaveKelompokProduk');
                Route::post('save-konversi-satuan', 'SysAdmin\Master\MasterController@SaveKonversiSatuan');
                Route::post('delete-konversi-satuan', 'SysAdmin\Master\MasterController@hapusKonversiSatuan');
                Route::post('save-statusenabled-rekanan', 'SysAdmin\Master\MasterController@UpdateStatusEnabledRekanan');
                Route::post('save-data-rekanan', 'SysAdmin\Master\MasterController@saveDataRekanan');

                Route::post('save-table-row', 'SysAdmin\Master\MasterController@saveTable');
                Route::post('hapus-tarif-harganetto', 'SysAdmin\Master\MasterController@hapusHargaNettoByKelas');
                //                Route::post('save-harganettoprodukbykelas', 'SysAdmin\Master\MasterController@saveharganettoprodukbykelas_kelasD');
                Route::post('save-harganettoprodukbykelas', 'SysAdmin\Master\MasterController@saveharganettoprodukbykelasM_D');
                Route::post('mapping-ruangan-to-produk-disable', 'SysAdmin\Master\MasterController@tombolDisable');
                Route::post('delete-mapping-ruangan-to-produk', 'SysAdmin\Master\MasterController@DeleteMappingProdukToRuangan');

                Route::post('save-data-mapproduktoruangan', 'SysAdmin\Master\MasterController@addProdukToRuangan');
                Route::post('save-data-mapproduktopenjamin', 'SysAdmin\Master\MasterController@addProdukToPenjamin');

                Route::post('save-data-bed', 'SysAdmin\Master\MasterController@saveBed');
                Route::post('save-jenisdiet', 'SysAdmin\Master\MasterController@saveJenisDiet');
                Route::post('delete-jenisdiet', 'SysAdmin\Master\MasterController@deleteJenisDiet');
                Route::post('save-jeniswaktu', 'SysAdmin\Master\MasterController@saveJenisWaktu');
                Route::post('delete-jeniswaktu', 'SysAdmin\Master\MasterController@deleteJenisWaktu');
                Route::post('save-kategorydiet', 'SysAdmin\Master\GiziController@saveKategoryDiet');
                Route::post('delete-kategorydiet', 'SysAdmin\Master\GiziController@deleteKategoryDiet');
                Route::post('updatekekuatan', 'SysAdmin\Master\MasterController@updatekekuatan');
                // POST //
            });
        });
        Route::group(['prefix' => 'tatarekening'], function () {

            Route::get('daftar-pasien-pulang-papj-new', 'TataRekening\TagihanController@daftarPasienPulangPapjNew');

            // trisno 2324
            Route::get('get-combo-baru', 'TataRekening\TagihanController@getComboBaru');
            Route::post('update-petugas-pelaksana', 'TataRekening\TagihanController@updatePetugasPelaksana');
            Route::post('save-petugas-pelaksana', 'TataRekening\TagihanController@savePetugasPelaksana');

            //Send PAPJ sartika
            //2026/05/07
            Route::post('save-papj-kirim', 'TataRekening\TagihanController@savePapjKirim');
            Route::post('save-papj-verif', 'TataRekening\TagihanController@savePapjVerif');
            Route::post('save-papj-klaim', 'TataRekening\TagihanController@savePapjKlaim');
            Route::post('save-papj-tidak-layak', 'TataRekening\TagihanController@savePapjTidakLayak');
            Route::post('save-papj-dirajalkan', 'TataRekening\TagihanController@savePapjDirajalkan');
            Route::post('save-papj-pending', 'TataRekening\TagihanController@savePapjPending');
            Route::post('save-papj-dikembalikan', 'TataRekening\TagihanController@savePapjDikembalikan');
            Route::post('save-papj-batalverif', 'TataRekening\TagihanController@savePapjBatalVerif');
            Route::post('save-papj-batalsiapklaim', 'TataRekening\TagihanController@savePapjBatalSiapKlaim');
            Route::post('save-papj-kirim-ulang', 'TataRekening\TagihanController@savePapjKirimUlang');
            Route::post('save-papj-kadaluarsa', 'TataRekening\TagihanController@savePapjKadaluarsa');

            // sartika 2026/05/07
            Route::get('daftar-pasien-pulang-papj', 'TataRekening\TagihanController@daftarPasienPulangPapj'); //done
            Route::get('daftar-pasien-pulang-papj-kirim', 'TataRekening\TagihanController@daftarPasienPulangPapjKirim'); //done
            Route::get('daftar-pasien-pulang-papj-verif', 'TataRekening\TagihanController@daftarPasienPulangPapjVerif'); //done
            Route::get('daftar-pasien-pulang-papj-klaim', 'TataRekening\TagihanController@daftarPasienPulangPapjKlaim'); //done
            Route::get('daftar-pasien-pulang-papj-tidak-layak', 'TataRekening\TagihanController@daftarPasienPulangPapjTidakLayak'); //key
            Route::get('daftar-pasien-pulang-papj-dirajalkan', 'TataRekening\TagihanController@daftarPasienPulangPapjDirajalkan'); //key
            Route::get('daftar-pasien-pulang-papj-pending', 'TataRekening\TagihanController@daftarPasienPulangPapjPending'); //key

            Route::post('save-akomodasi-tea', 'TataRekening\TagihanController@saveAkomodasiOtomatis');
            Route::get('get-rekap-dokpol2', 'TataRekening\TagihanController@getRekapKedokteranForensik');
            Route::get('get-ruangan-bed', 'TataRekening\TagihanController@getRuanganBed');
            Route::get('get-kedokteran-forensik-combo', 'TataRekening\TagihanController@getKedokteranForensikCombo');
            Route::post('save-update-kedokteran-forensik', 'TataRekening\TagihanController@simpanUpdateKedokteranForensik');
            Route::post('save-kedokteran-forensik', 'TataRekening\TagihanController@simpanUpdateKedokteranForensik2');
            Route::get('get-pasien-kedokteran-forensik', 'TataRekening\TagihanController@getPasienKedokteranForensik');
            Route::get('get-detail_apd', 'TataRekening\TagihanController@getDetailpasien');
            Route::get('get-combo-detail-regis', 'TataRekening\TagihanController@getDataComboDetailRegis');
            Route::get('get-combo-detail-regis-select', 'TataRekening\TagihanController@getDataComboDetailRegisSelect');
            Route::get('get-pasca-ranap', 'TataRekening\TagihanController@getPascaRanap');
            Route::get('get-detail-pasien', 'TataRekening\TagihanController@getAPD');
            Route::get('get-data-master', 'TataRekening\TagihanController@getTableMaster');  //done
            Route::get('get-data-master-select', 'TataRekening\TagihanController@getTableMasterSelect');  //done
            Route::get('get-sudah-verif', 'TataRekening\TagihanController@getVerifikasiNoregistrasi');
            Route::post('save-konsul-keruangan', 'TataRekening\TagihanController@simpanInsertAPD');
            Route::post('save-update-dokter_apd', 'TataRekening\TagihanController@simpanUpdateDokterAPD');
            Route::post('save-update-rekanan_pd', 'TataRekening\TagihanController@simpanUpdateRekananPD');
            Route::post('hapus-antrian-pasien', 'TataRekening\TagihanController@hapusAPD');
            Route::post('ubah-tgl-detailregistrasi', 'TataRekening\TagihanController@ubahTanggalDetailRegis');
            Route::get('get-status-close-pemeriksaan', 'TataRekening\TagihanController@getStatusClosePemeriksaan');
            Route::get('get-data-login', 'TataRekening\TagihanController@getLogin');  //done
            Route::get('detail-tagihan/{noRegister}', 'TataRekening\TagihanController@detailTagihan');
            Route::get('detail-tagihanv3/{noRegister}', 'TataRekening\TagihanController@detailTagihanEMR');
            Route::get('detail-asuransi/{noregistrasifk}', 'TataRekening\TagihanController@detailasuransi');
            Route::get('detail-tagihanv2/{noRegister}', 'TataRekening\TagihanController@detailTagihan2');  //done
            Route::get('detail-tagihan-polri', 'TataRekening\TagihanController@detailTagihanLaporanPolri');  //done
            Route::post('save-update-dokter_ppp', 'TataRekening\TagihanController@simpanUpdateDokterPPP');
            Route::post('save-update-tanggal_pelayanan', 'TataRekening\TagihanController@simpanUpdateTglPelayanan');
            Route::post('save-update-tanggal_pelayanan_all', 'TataRekening\TagihanController@simpanUpdateTglPelayananAll');
            Route::post('save-update-harga-diskon-komponen', 'TataRekening\TagihanController@simpanUpdateDiskonKomponen');
            Route::post('save-update-harga-diskon-proposi', 'TataRekening\TagihanController@simpanUpdateDiskonProposi');
            Route::post('save-diskon-tagihan', 'TataRekening\TagihanController@simpanDiskonTagihan');
            Route::get('get-data-login-cetakan', 'TataRekening\TagihanController@getSumJmlByrObat');  //done
            Route::post('save-komorbid', 'TataRekening\TagihanController@simpanKomorbid');
            Route::post('update-rawat-titipan', 'TataRekening\TagihanController@updateRawatTitipan');
            // getSumJmlByrResepObat
            Route::get('get-data-sum-resep', 'TataRekening\TagihanController@getSumJmlByrResepObat');
            Route::get('get-data-sum-resep-rajal', 'TataRekening\TagihanController@getSumJmlByrResepObatRajal');
            Route::get('get-data-sum-resep-rajal-2', 'TataRekening\TagihanController@getSumJmlByrResepObatRajal2');
            Route::get('get-data-sum-resep-kronis', 'TataRekening\TagihanController@getSumJmlByrResepObatKronis');
            Route::get('get-data-login-cetakan-ruangan-last', 'TataRekening\TagihanController@getRuanganLast');  //done
            Route::get('get-sum-obat-alkes', 'TataRekening\TagihanController@getRuanganLast');  //done
            Route::get('get-pegawai-saeutik', 'TataRekening\TagihanController@getPegawaiSaeutik');  //done
            Route::get('get-combo-jenis-petugas', 'TataRekening\TagihanController@getComboJenisPetugasPel');
            Route::get('get-petugasbypelayananpasien', 'TataRekening\TagihanController@getPelPetugasByPelPasien');
            Route::post('save-ppasienpetugas', 'TataRekening\TagihanController@simpanDokterPPP');
            Route::post('hapus-ppasienpetugas', 'TataRekening\TagihanController@hapusPPP');
            Route::post('update-harga-pelayanan-pasien', 'TataRekening\TagihanController@UpdateHargaPelayananPasien');
            Route::post('delete-pelayanan-pasien', 'TataRekening\TagihanController@deletePelayananPasien');
            Route::post('pindah-pelayanan-pasien', 'TataRekening\TagihanController@pindahPelayananPasien');
            Route::post('ganti-ruangan-terakhir', 'TataRekening\TagihanController@gantiRuanganTerakhir');
            Route::post('ganti-ruangan-jaspel', 'TataRekening\TagihanController@gantiRuanganJaspel');
            Route::get('get-komponenharga-pelayanan', 'TataRekening\TagihanController@getKomponenHargaPelayanan');
            Route::get('detail-tindakan-takterklaim', 'TataRekening\TagihanController@getTindakanTakTerklaim');  //done
            Route::post('close-pemeriksaan', 'TataRekening\TagihanController@closePemeriksaan');  //done
            Route::get('get-data-combo-order', 'TataRekening\TagihanController@getDataComboOrder');  //done
            Route::get('get-tindakan', 'TataRekening\TagihanController@getTindakanParts');  //done
            Route::get('get-tindakan-order-penunjang', 'TataRekening\TagihanController@getTindakanOrderPenunjang');  //done
            Route::post('pindah-history-apd', 'TataRekening\TagihanController@pindahHistoryAPD');
            Route::post('pindah-history-apd-detail', 'TataRekening\TagihanController@pindahHistoryAPDdetail');

            Route::get('get-header-data-pasien/{noregistrasi}', 'TataRekening\TagihanController@getHeaderRekapTagihan'); //done
            Route::get('get-rekap-tagihan-pasien/{noregistrasi}', 'TataRekening\TagihanController@getRekapTagihan'); //done
            Route::get('get-pasien-bynorec/{norec_pd}/{norec_apd}', 'TataRekening\TagihanController@getPasienBynorecpdapd'); //done


            Route::get('get-status-verif-piutang', 'TataRekening\TagihanController@getStatusVerifPiutang'); //done
            Route::get('get-rekap-billing', 'TataRekening\TagihanController@getRekapBilling');
            Route::get('get-billing', 'TataRekening\TagihanController@getBilling');
            Route::post('save-log-unverifikasi-tarek', 'TataRekening\TagihanController@saveLoggingUnverifTarek');
            Route::get('get-kamar-bed', 'TataRekening\TagihanController@getKamarBed');
            Route::get('get-bed-sama', 'TataRekening\TagihanController@getBedSama');
            Route::post('save-log-closing', 'TataRekening\TagihanController@saveLoggingClosing');
            Route::post('save-log-unclosing', 'TataRekening\TagihanController@saveLoggingUnclosing');
            Route::get('daftar-pasien-pulang', 'TataRekening\TagihanController@daftarPasienPulang'); //done
            Route::post('save-selesai-transaksi', 'TataRekening\TagihanController@closePemeriksaanPD'); //done
            // Trisno
            Route::post('save-selesai-transaksi-faktur', 'TataRekening\TagihanController@closePemeriksaanFakturPD'); //done
            Route::post('save-log-closing-faktur', 'TataRekening\TagihanController@saveLoggingClosingFaktur');
            Route::post('save-log-unclosing-faktur', 'TataRekening\TagihanController@saveLoggingUnclosingFaktur');
            Route::post('save-selesai-transaksi-claim', 'TataRekening\TagihanController@selesaiTransaksiClaim'); //done
            Route::post('save-log-claim', 'TataRekening\TagihanController@saveLoggingClaim');
            Route::post('save-log-pemotongan-pajak', 'TataRekening\TagihanController@saveLoggingPemotonganPajak');
            Route::post('save-log-mergenocm', 'TataRekening\TagihanController@saveLoggingMergeNocm');
            Route::post('save-log-unclaim', 'TataRekening\TagihanController@saveLoggingUnClaim');
            Route::post('save-selesai-transaksi-claim-pp', 'TataRekening\TagihanController@selesaiTransaksiClaimPP'); //done
            Route::post('save-selesai-transaksi-add-rm', 'TataRekening\TagihanController@selesaiTransaksiAddRM'); //done
            Route::post('save-KlikCuyy', 'TataRekening\TagihanController@selesaiKlikCuyy'); //done
            Route::post('save-selesai-transaksi-add-bedah', 'TataRekening\TagihanController@selesaiTransaksiAddBedah'); //done
            Route::post('save-selesai-transaksi-obat-rm', 'TataRekening\TagihanController@selesaiTransaksiObatRM'); //done
            Route::post('save-selesai-transaksi-obat-rm-pulang', 'TataRekening\TagihanController@selesaiTransaksiObatRMPulang'); //done

            Route::get('get-struk-pelayanan/{noRegister}', 'TataRekening\TagihanController@getStrukPelayanan');
            Route::get('get-status-verif-piutang', 'TataRekening\TagihanController@getStatusVerifPiutang');
            Route::post('batal-verifikasi-tagihan', 'TataRekening\TagihanController@batalVerifikasiTagihan');
            Route::get('verifikasi-tagihan2/{noRegister}', 'TataRekening\TagihanController@verifikasiTagihan2');
            Route::get('detail-tagihan-verifikasi/{noRegister}', 'TataRekening\TagihanController@detailTagihanVerifikasi');
            Route::get('detail-tagihan-verifikasipenjamin/{noRegister}', 'TataRekening\TagihanController@detailTagihanVerifikasipenjamin');
            Route::get('detail-tagihan-getfrommamppinganpenjamin/{noRegister}', 'TataRekening\TagihanController@getfrommamppinganpenjamin');

            Route::post('simpan-verifikasi-tagihan/{noRegister}', 'TataRekening\TagihanController@simpanVerifikasiTagihan');
            Route::post('simpan-verifikasi-tagihan-tatarekening', 'TataRekening\TagihanController@simpanVerifikasiTagihanTatarekening');
            Route::post('simpan-verifikasi-tagihan-inacbg/{noRegister}', 'Transaksi\TataRekening\TagihanRev2Controller@simpanVerifikasiTagihanInacbg');  //done
            Route::get('detail-tagihan-verifikasi/{noRegister}', 'TataRekening\TagihanController@detailTagihanVerifikasiTatarekening');
            Route::get('get-data-combo-daftarregpasien', 'TataRekening\TagihanController@getDataComboDaftarRegPasien');
            Route::get('get-combo-penjamin', 'TataRekening\TagihanController@getComboPenjamin');
            Route::post('save-update-penjamin', 'TataRekening\TagihanController@simpanUpdatePenjamin');
            Route::post('save-update-penyakit-ponek-igd', 'TataRekening\TagihanController@simpanPenyakitPonekIgd');
            Route::post('save-update-penjamin-lab', 'TataRekening\TagihanController@simpanUpdatePenjaminLab');
            Route::get('get-penjaminbykelompokpasien', 'TataRekening\TagihanController@getPenjaminByKelompokPasien');
            Route::post('save-update-rekanan_pd', 'TataRekening\TagihanController@simpanUpdateRekananPD');
            Route::get('daftar-piutang-pasien', 'TataRekening\TagihanController@daftarPiutangPasien');
            Route::post('verify-piutang-pasien', 'TataRekening\TagihanController@verifyPiutangPasien');
            Route::post('cancel-verify-piutang-pasien', 'TataRekening\TagihanController@cancelVerifyPiutangPasien');
            Route::get('get-daftar-registrasi-pasien', 'TataRekening\TagihanController@getDaftarRegistrasiPasien');
            Route::get('get-norec-apd', 'TataRekening\TagihanController@getNorecAPD');
            Route::post('save-update-dokter', 'TataRekening\TagihanController@simpanUpdateDokter');
            Route::post('save-update-dokter_apd', 'TataRekening\TagihanController@simpanUpdateDokterAPD');
            Route::post('save-pemakaian-asuransi', 'TataRekening\TagihanController@simpanPemakaianAsuransi');
            Route::get('get-data-apd', 'TataRekening\TagihanController@getAntrianPasien');
            Route::get('get-daftar-deposit-pasien', 'TataRekening\TagihanController@getDaftarDepositPasien');
            Route::get('get-pasien-dalam-perawatan', 'TataRekening\TagihanController@getLapPasienDalamPerawatan');
            Route::get('get-data-lap-pendapatan-perkelas', 'TataRekening\TagihanController@getDataLaporanPendapatanPerkelas');
            Route::get('get-list-laporan-volume', 'TataRekening\TagihanController@getDataLaporanVolumeKegiatan');
            Route::get('get-laporan-rehab', 'TataRekening\TagihanController@getLaporanRehab');
            Route::get('get-data-diagnosa-pasien', 'TataRekening\TagihanController@getDataLaporanDiagnosaPasien');
            Route::get('get-data-diagnosa-pasien-rekap', 'TataRekening\TagihanController@getDataLaporanDiagnosaPasienRekap');
            Route::get('get-data-penyakit-ponek-igd', 'TataRekening\TagihanController@getDataPenyakitPonekIGD');
            Route::get('get-data-penyakit-ponek-igd-rekap', 'TataRekening\TagihanController@getDataPenyakitPonekIGDRekap');
            Route::post('save-plapon', 'TataRekening\TagihanController@simpanPlapon');
            Route::post('simpan-verifikasi-tagihan-tatarekening-penjamin-pertindakan', 'TataRekening\TagihanController@simpanVerifikasiTagihanPenjaminPertindakan');
            Route::post('save-pemeriksaan-luar-lab', 'TataRekening\TagihanController@simpanPemeriksaanLuarLab');

            // @all 
            Route::get('get-data-passien-batal', 'TataRekening\TagihanController@getDataLaporanPasienBatalRegis');
            Route::get('get-data-passien-unclose-faktur', 'TataRekening\TagihanController@getDataLaporanPasienUncloseFaktur');
            //

            Route::get('get-penerimaan-deposit', 'TataRekening\TagihanController@getDepositPasienPulang');
            Route::get('get-rekapkunjungan-rawatjalan', 'TataRekening\TagihanController@getRekapKunjunganRJ');
            Route::get('get-rekappembayaran-jasapelayanan', 'TataRekening\TagihanController@getRekapPembayaranJasaPelayanan');
            Route::get('get-detail-rekappembayaran-jasapelayanan', 'TataRekening\TagihanController@getDetailJasaPelayanan');
            Route::get('get-laporankegiatanoperasional', 'TataRekening\TagihanController@getLaporanKegiatanOperasionalRJ');
            Route::get('get-detail-laporankegiatan', 'TataRekening\TagihanController@getLaporanKegiatanOperasionalDetail');
            Route::get('get-laporankegiatanoperasional-detail', 'TataRekening\TagihanController@getLaporanKegiatanOperasionalRuangan');
            Route::get('data-pasien-perjanjian/{noRegister}', 'TataRekening\TagihanController@getDataPasienPerjanjian');
            Route::get('list-kelompok-pasienperjanjian', 'TataRekening\TagihanController@getJenisPasienPerjanjian');
            Route::get('get-data-detail-verifikasi', 'TataRekening\TagihanController@getDataDetailVerifikasi');
            Route::post('hapus-flag-tindakan', 'TataRekening\TindakanController@hapusFlagTindakan');
            Route::get('get-laporan-pendapatan-instalasi', 'TataRekening\TagihanController@getPendapatanInstalasi');
            Route::get('get-laporan-pendapatan-perpasien', 'TataRekening\TagihanController@getPendapatanPerPasien');
            Route::get('get-list-pertanyaan', 'TataRekening\TindakanController@getListPertanyaan');
            //*****END*****
            Route::get('get-daftar-sync-trans', 'TataRekening\TagihanController@getDatfarSyncTrans');
            Route::post('sync-trandata-pasien', 'TataRekening\TagihanController@saveSyncTrans');
            Route::post('sync-trandata-pasien-emr', 'TataRekening\TagihanController@saveSyncTransEMR');
            Route::post('sync-trandata-alamat-pasien', 'TataRekening\TagihanController@saveSyncAlamat');

            Route::post('sync-trandata-new', 'TataRekening\TagihanController@saveSyncTransNEW');

            Route::get('detail-tagihankomponen/{noRegister}', 'TataRekening\TagihanController@detailTagihankomponen');
            Route::get('get-daftar-registrasi-pasienjasapelayanan', 'TataRekening\TagihanController@getDaftarRegistrasiPasienJasapelayanan');
            //all
            Route::get('get-daftar-registrasi-pasienjasapelayanan-bynoregistrasi', 'TataRekening\TagihanController@getDaftarRegistrasiPasienJasapelayananByNoRegAll');

            Route::group(['prefix' => 'tindakan'], function () {
                // trisno 2450
                Route::get('get-combo-map', 'TataRekening\TindakanController@getComboMap');
                Route::get('get-pegawaibyjenispetugas-map', 'TataRekening\TindakanController@getPegawaiByJenisPetugasPeMap');
                //                Route::get('get-tindakan', 'TataRekening\TindakanController@getTindakan');
                Route::get('get-indikator-daily', 'TataRekening\TindakanController@getIndikatorDaily');
                Route::post('update-tanggal-ppi', 'TataRekening\TindakanController@updateTanggalPPI');
                Route::get('get-combo', 'TataRekening\TindakanController@getCombo');
                Route::get('get-combo-baru', 'TataRekening\TindakanController@getComboBaru');
                Route::get('get-combo-select', 'TataRekening\TindakanController@getComboSelect');
                Route::get('get-pegawaibyjenispetugas', 'TataRekening\TindakanController@getPegawaiByJenisPetugasPe');
                Route::post('save-tindakan', 'TataRekening\TindakanController@saveTindakan');
                Route::post('save-tindakan-ppi', 'TataRekening\TindakanController@saveTindakanPPI');
                Route::get('get-komponenharga', 'TataRekening\TindakanController@getKomponenHarga');
                Route::post('update-dokter-pel-pasien', 'TataRekening\TindakanController@updateDokterAll');
                Route::get('get-komponenharga-jasa-medis', 'TataRekening\TindakanController@getKomponenHargaJasaMedis');
                Route::post('update-dokter-pel-pasien-new', 'Tattransaksi-detailekgaRekening\TindakanController@updateDokterppp');
                Route::get('get-pegawai-byjenispetugas-byapd', 'TataRekening\TindakanController@getPegawaiByJnsPetugasByAPD');
                Route::get('get-data-login-pegawai', 'TataRekening\TindakanController@getDataLogin');
                Route::get('get-pelayanan-pasien', 'TataRekening\TindakanController@getPelayananPasienNonDetail');
                Route::post('hapus-pelayanan-pasien', 'TataRekening\TindakanController@hapusPelayananPasien');
                Route::post('save-tindakan-tidak-terklaim', 'TataRekening\TindakanController@saveTindakanTidakTerklaim');
                Route::post('hapus-tindakan-tidak-terklaim', 'TataRekening\TindakanController@hapusPelayananPasienTidakTerklaim');
                Route::get('get-riwayat-tindakan', 'TataRekening\TindakanController@getRiwayarRuanganPerAntrian');
                Route::get('get-pegawaipenginput', 'TataRekening\TindakanController@GetPegawaiPenginputTindakan');
                Route::get('get-tindakan', 'TataRekening\TindakanController@getTindakanPart');
                Route::post('hapus-flag-tindakan', 'TataRekening\TindakanController@hapusFlagTindakan');
                Route::get('get-list-pertanyaan', 'TataRekening\TindakanController@getListPertanyaan');
                Route::get('get-jenis-pelayanan/{norec_pd}', 'TataRekening\TindakanController@getJenisPelayananByNorecPd');
                Route::get('get-tanggal-posting', 'TataRekening\TindakanController@getPostingTgl');
                Route::get('get-pasien-bynorec/{norec_pd}/{norec_apd}', 'TataRekening\TindakanController@getHeaderInputTindakan');
                Route::post('update-dokter-pel-pasien', 'TataRekening\TindakanController@updateDokterAll');
                Route::post('update-dokter-pel-pasien-new', 'TataRekening\TindakanController@updateDokterppp');
                Route::post('cektindakan', 'TataRekening\TindakanController@cektindakan');
            });
        });
        Route::group(['prefix' => 'desktopservice'], function () {
            Route::get('get-antrian-display', 'DesktopService\DesktopServiceController@getDataDisplayAntrian');
            Route::get('get-data-for-rs', 'DesktopService\DesktopServiceController@getDataForRecordSet');
            Route::get('save-data-for-rs', 'DesktopService\DesktopServiceController@saveDataFromRecordSet');
        });

        Route::post('bni/create-billing', 'Bridging\BridgingBNIController@createBilling');
        Route::post('bni/inquiry-billing', 'Bridging\BridgingBNIController@inquiryBilling');
        Route::post('bni/update-transaction', 'Bridging\BridgingBNIController@updateTransaction');
        Route::post('bni/callback-payment', 'Bridging\BridgingBNIController@callBackPayment');
        Route::post('bni/create-billing-sms', 'Bridging\BridgingBNIController@createBillingSMS');
        Route::post('bni/check-callback', 'Bridging\BridgingBNIController@checkCallBackPayment');

        Route::post('bank-agi/transfer-out-va-inquiry', 'Bridging\BridgingAGIController@inquiryOut');
        Route::post('bank-agi/transfer-out-va', 'Bridging\BridgingAGIController@transferOut');
        Route::post('bank-agi/transfer-incoming-va-inquiry', 'Bridging\BridgingAGIController@inquiryIncomingVA');
        Route::post('bank-agi/notif-transfer', 'Bridging\BridgingAGIController@notifTransfer');
        Route::post('bank-agi/transfer-out-real-inquiry', 'Bridging\BridgingAGIController@transferOutRealAccount');
        Route::post('bank-agi/transfer-out-real', 'Bridging\BridgingAGIController@transferBankLain');
        Route::post('bank-agi/inquiry-balance', 'Bridging\BridgingAGIController@accounInfo');
        Route::post('bank-agi/history-transaction', 'Bridging\BridgingAGIController@historyTransaction');
        Route::post('bank-agi/transfer-out-va-inquiry-test', 'Bridging\BridgingAGIController@inquiryOutTEST');

        Route::post('dinkes-jkt/post-bed', 'Bridging\BridgingSiranapController@postBedDinkesJKT');
        Route::get('dinkes-jkt/get-bed', 'Bridging\BridgingSiranapController@getBedDinkes');
        Route::get('dinkes-jkt/delete-bed', 'Bridging\BridgingSiranapController@deleteBedDinkes');
        Route::post('bridging/post-pasien', 'Bridging\BridgingSiranapController@postDataPasienCovid');
        Route::post('bridging/get-tokens', 'Bridging\BridgingSiranapController@getTokensSirs');
        Route::post('bridging/post-pasien-covid', 'Bridging\BridgingSisruteController@postPasienCovid');
        Route::post('post-pasien-v3', 'Bridging\BridgingSisruteController@postDataPasienCovid');
        Route::get('get-master-kelurahan-v3', 'Bridging\BridgingSisruteController@getMasterKelurahanSirs');
        Route::post('get-token', 'Auth\LoginController@getTokens');
    });


    Route::get('logistik/get-stok-minimum_global', 'Logistik\LogistikController@getStokMinimumGlobal');
    Route::get('logistik/get-topten-obat', 'Logistik\LogistikController@getTrendPemakaianObat');
    Route::get('logistik/get-produk', 'Logistik\LogistikController@getProdukAvailable');
    Route::group(['prefix' => 'sign'], function () {
        Route::post('get-token', 'Auth\LoginController@getTokens');
    });

    /*
     * Dokter Keluarga
     */
    Route::post('api/generate-token', 'Auth\LoginController@getSignature2');
    Route::get('api/detail-pasien', 'Bridging\DokterKeluargaController@getDetailPasien');
    Route::get('api/get-kesehatan-umum', 'Bridging\DokterKeluargaController@getKesehatanUmum');
    Route::get('api/get-perawatan', 'Bridging\DokterKeluargaController@getPerawatan');
    Route::get('api/get-alergi', 'Bridging\DokterKeluargaController@getAlergi2');
    Route::get('api/get-pengobatan', 'Bridging\DokterKeluargaController@getPengobatan');
    Route::get('api/get-imunisasi', 'Bridging\DokterKeluargaController@getAlergi');
    Route::get('api/get-observasi-kesehatan', 'Bridging\DokterKeluargaController@getObservasiKesehatan');
    Route::get('api/get-prosedur', 'Bridging\DokterKeluargaController@getProsedur');
    Route::get('api/get-pertemuan-mendatang', 'Bridging\DokterKeluargaController@getPertemuanMendatang');
    Route::get('api/get-rekomendasi', 'Bridging\DokterKeluargaController@getRencanaRekomen');
    Route::get('api/get-elektrokardiogram', 'Bridging\DokterKeluargaController@getECG');
    Route::get('api/get-radiologi', 'Bridging\DokterKeluargaController@getRadiologi');
    Route::get('api/get-hasil-lab', 'Bridging\DokterKeluargaController@getHasilLab');
    Route::get('api/get-observasi-kesehatan', 'Bridging\DokterKeluargaController@getObservasiKesehatan');
    Route::get('api/get-list-pasien', 'Bridging\DokterKeluargaController@getDaftarPasienDK');
});

Route::get('encode-base64/{data}', function ($data) {
    return  base64_encode($data);
});
Route::get('decode-base64/{data}', function ($data) {
    return  base64_decode($data);
});
Route::get('', function () {
    $profile = \App\Web\Profile::where('statusenabled', true)->first();
    return view('welcome', compact('profile'));
    //    return view('welcome');
});

Route::get('a/b/c/d', function () {
    return view('welcome');
});

Route::get('storage/{type}/{group}/{filename}', function ($type, $group, $filename) {
    $path = storage_path($type . '/' . $group . '/' . $filename);

    if (!File::exists($path)) {
        abort(404);
    }

    $file = File::get($path);
    $type = File::mimeType($path);

    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);

    return $response;
});


Route::get('storage/app/photo/{filename}', function ($filename) {
    $path = storage_path('public/' . $filename);

    if (!File::exists($path)) {
        abort(404);
    }

    $file = File::get($path);
    $type = File::mimeType($path);

    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);

    return $response;
});
Route::get('storage/sdm/sip-str/{norec}/{filename}', function ($norec, $filename) {
    $path = public_path('SDM/FileSipStr/' . $norec . '/' . $filename);

    if (!File::exists($path)) {
        echo "File belum di unggah";
    }

    $file = File::get($path);
    $type = File::mimeType($path);

    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);

    return $response;
});

Route::get('storage/sdm/sk/{id}/{filename}', function ($id, $filename) {
    $path = public_path('SDM/SuratKeputusan/' . $id . '/' . $filename);

    if (!File::exists($path)) {
        abort(404);
    }

    $file = File::get($path);
    $type = File::mimeType($path);

    $response = Response::make($file, 200);
    $response->header("Content-Type", $type);

    return $response;
});
Route::get('storage/sdm/sk-view', function (Illuminate\Http\Request $r) {

    $path = public_path('SDM/SuratKeputusan/' . $r['id'] . '/' . $r['filename']);
    if (!\File::exists($path)) {
        $exp = explode('/', $r['filename']);
        if (count($exp) > 0) {
            $path = public_path('SDM/SuratKeputusan/' . $r['id'] . '/' . $exp[count($exp) - 1]);
            if (!\File::exists($path)) {
                abort(404);
            }
        } else {
            abort(404);
        }
    }
    //dd($path);
    $file = \File::get($path);
    $type = \File::mimeType($path);
    $fileName   = \File::name($path);

    $b64Doc = chunk_split(base64_encode($file));
    $sourcePdf = "data:application/pdf;base64," . $b64Doc;
    $sk = \DB::table('suratkeputusan_m as sk')->where('id', $r['id'])->first();
    //    dd( $sk );
    return  view('report.preview-pdf', compact('sourcePdf', 'sk'));
});
Route::get('storage/sdm/sip-str-view', function (Illuminate\Http\Request $r) {

    $path = public_path('SDM/FileSipStr/' . $r['norec'] . '/' . $r['namafile']);
    if (!\File::exists($path)) {
        $exp = explode('/', $r['namafile']);
        if (count($exp) > 0) {
            $path = public_path('SDM/FileSipStr/' . $r['norec'] . '/' . $exp[count($exp) - 1]);
            if (!\File::exists($path)) {
                abort(404);
            }
        } else {
            abort(404);
        }
    }
    //dd($path);
    $file = \File::get($path);
    $type = \File::mimeType($path);
    $fileName   = \File::name($path);

    $b64Doc = chunk_split(base64_encode($file));
    $sourcePdf = "data:application/pdf;base64," . $b64Doc;
    $sk = '-';
    //    dd( $sk );
    return  view('report.preview-pdf-sip', compact('sourcePdf', 'r'));
});



Route::get('storage/test', function () {
    return var_dump('test');
});

Route::group(['middleware' => 'cors'], function () {
    Route::get('bor', 'Bridging\BridgingSiranapController@getdataBOR');
    Route::get('diagnosa_iri', 'Bridging\BridgingSiranapController@getDiagnosaRanap');
    Route::get('diagnosa_irj', 'Bridging\BridgingSiranapController@getDiagnosaRajal');
    Route::get('bedmonitor', 'Bridging\BridgingSiranapController@getBedMonitor');
    Route::get('{instalasi}', 'Bridging\BridgingSiranapController@getKunjungan');
    Route::get('hapus-bed/{kode_tipe_pasien}/{kode_kelas_ruang}', 'Bridging\BridgingSiranapController@hapusBed');

    Route::post('LapV2/PasienMasuk/{method}', 'Bridging\BridgingSiranapController@PasienMasuk');
    Route::post('LapV2/PasienDirawatKomorbid/{method}', 'Bridging\BridgingSiranapController@Komorbid');
    Route::post('LapV2/PasienDirawatTanpaKomorbid/{method}', 'Bridging\BridgingSiranapController@NonKomorbid');
    Route::post('LapV2/PasienKeluar/{method}', 'Bridging\BridgingSiranapController@PasienKeluar');

    Route::post('Referensi/usia_meninggal_probable', 'Bridging\BridgingSiranapController@getRefUsia');
    Route::post('Referensi/tempat_tidur', 'Bridging\BridgingSiranapController@getRefTT');
    Route::post('Fasyankes/{method}', 'Bridging\BridgingSiranapController@Fasyankes');
    Route::post('Fasyankestt/{method}', 'Bridging\BridgingSiranapController@Fasyankestt');
    Route::post('Fasyankessatuan/{method}', 'Bridging\BridgingSiranapController@Fasyankessatuan');
    Route::get('Fasyankesbedrs/{method}', 'Bridging\BridgingSiranapController@getJumlahBed');
    Route::get('Fasyankesbedrsbelummaping/{method}', 'Bridging\BridgingSiranapController@getJumlahBed2');
    Route::post('Fasyankesbed/{method}', 'Bridging\BridgingSiranapController@Fasyankesbedrs');
    Route::post('Fasyankesupdatesirsbed/{method}', 'Bridging\BridgingSiranapController@updatekodesirs');

    Route::post('Referensi/kebutuhan_sdm', 'Bridging\BridgingSiranapController@getReffSDM');
    Route::post('Fasyankes/sdm/{method}', 'Bridging\BridgingSiranapController@FasyankesSDM');

    Route::post('Referensi/kebutuhan_apd', 'Bridging\BridgingSiranapController@getReffAPD');
    Route::post('Fasyankes/apd/{method}', 'Bridging\BridgingSiranapController@FasyankesAPD');
});
