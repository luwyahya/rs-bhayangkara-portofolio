<?php
namespace App\Transformers\Master;

use App\Transformers\Transformer;

class PasienTransformer extends Transformer{
    protected $list = [
        "id"       => "id",
                "kdprofile"       => "kdProfile",
                "statusenabled"       => "statusEnabled",
                "kodeexternal"       => "kodeExternal",
                "namaexternal"       => "namaExternal",
                "norec"       => "noRec",
                "reportdisplay"       => "reportDisplay",
                "objectagamafk"       => "agamaFk",
                "agama.agama"       => "agama",
                "objectgolongandarahfk"       => "golonganDarahFk",
                "golongan_darah.golongandarah"       => "golonganDarah",
                "objectjeniskelaminfk"       => "jenisKelaminFk",
                "jenis_kelamin.jeniskelamin"       => "jenisKelamin",
                "namapasien"       => "namaPasien",
                "nocm"       => "noCm",
                "objectpekerjaanfk"       => "pekerjaanFk",
                "pekerjaan.pekerjaan"       => "pekerjaan",
                "objectpendidikanfk"       => "pendidikanFk",
                "pendidikan.pendidikan"       => "pendidikan",
                "qpasien"       => "qpasien",
                "objectstatusperkawinanfk"       => "statusPerkawinanFk",
                "status_perkawinan.statusperkawinan"       => "statusPerkawinan",
                "tgldaftar"       => "tglDaftar",
                "tgllahir"       => "tglLahir",
                "namaibu"       => "namaIbu",
                "notelepon"       => "noTelepon",
                "noidentitas"       => "noIdEntitas",
                "tglmeninggal"       => "tglMeninggal",
                "noaditional"       => "noAditional",
                "paspor"       => "paspor",
                "objectnegarafk"       => "negaraFk",
                "negara.namanegara"       => "namaNegara",
                "namadepan"       => "namaDepan",
                "namabelakang"       => "namaBelakang",
                "namaayah"       => "namaAYaH",
                "namasuamiistri"       => "namaSuamiistri",
                "noasuransilain"       => "noAsuransilain",
                "nobpjs"       => "noBpjs",
                "nohp"       => "noHp",
                "tempatlahir"       => "tempatLahir",
        //        "objecttitlefk"     => "titleFk",
        //        "title_pasien.titlepasien"     => "titlePasien",
        //        "objectkebangsaanfk"     => "kebangsaanFk",
        //        "kebangsaan.kebangsaan"     => "kebangsaan",
        //        "dokumenrekammedis"     => "dokumenRekammedis",
        //        "dokumen.dokumen"     => "dokumen",
        
    ];
 }
 