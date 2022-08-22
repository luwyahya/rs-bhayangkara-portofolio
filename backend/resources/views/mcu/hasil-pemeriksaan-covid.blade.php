
@extends('template-mcu.header')
@section('content-body')
<style>
@page {
    margin-top: -30px;
    margin-bottom: 0px;
    margin-left: 0px;
    margin-right: 0px;
    text-align: justify;
}

</style>
    <tr>

        <td bordercolor="#808080" height="13" align="center">
            <font style="font-size: 11pt" face="Arial" color="#000000">
                    <span style="font-weight: 700;font-size: 14pt">
                        <u>SURAT KETERANGAN PEMERIKSAAN COVID-19</u>
                    </span>
            </font>
        </td>
    </tr>
    <tr>

        <td bordercolor="#808080" height="13" align="center">
            <font style="font-size: 11pt" face="Arial" color="#000000">
                    <span style="font-weight: 700;font-size: 11pt">
                        Nomor: {{ $raw->nomor3 }}
                    </span>
            </font>
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13"></td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13" >
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:40px;">
                <tbody>
                <tr>
                    <td width="120" align="justify">
                        <font style="font-size: 14pt; margin-left:60px; margin-right:135px;" face="Arial">
                    Yang bertanda tangan dibawah ini, dokter pada Rumah Sakit Bhayangkara TK. IV Cianjur
                    Jakarta, menerangkan pada Tanggal {{ App\Traits\Valet::getDateIndo($raw->tglcetak).' '.substr($raw->tglcetak,1,0)   }}
                    bertempat di Rumah Sakit Bhayangkara Tk. IV Cianjur telah melakukan pemeriksaan PCR Tes Covid-19 dengan 
                    keterangan sebagai berikut :
                    </font>
                    </td>
                </tr>
            </table>        
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:40px;">
                <tbody>
                <br>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:20px" face="Arial">
                    Nama
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt;font-weight: bold" face="Arial"> {{ $raw->namapasien }} </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:20px;" face="Arial">
                    Jenis Kelamin
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt" face="Arial"> {{ $raw->jeniskelamin }} </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:20px;" face="Arial">
                    Tempat/Tgl.Lahir
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt" face="Arial"> {{ App\Traits\Valet::getDateIndo($raw->tgllahir).' '.substr($raw->tgllahir,1,0)   }} </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:20px;" face="Arial">
                    Alamat
                    </font>
                    <td>:</td>
                    <td width="600" align="justify"><font style="font-size: 14pt" face="Arial"> {{ $raw->alamatlengkap }} </font></td>
                    </td>
                </tr>
            </table>  
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13" align="center">
            <font style="font-size: 11pt" face="Arial" color="#000000">
                <span style="font-weight: 700;font-size: 14pt">
                    <u>HASIL PEMERIKSAAN</u>
                </span>
            </font>
        </td>
    </tr>
    
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:40px;">
                <tbody>
                <br>
                <tr>
                    <td width="300">
                        <font style="font-size: 14pt; margin-left:20px;" face="Arial">
                    1. Wawancara
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt" face="Arial">Dalam Keadaan Sehat</font></td>
                    </td>
                </tr>
            </table>  
        </td>
    </tr>  
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:40px;">
                <tbody>
                <tr>
                    <td width="120" align="justify">
                        <font style="font-size: 14pt; margin-left:40px;" face="Arial">
                        ( tidak ada riwayat kontak dengan penderita (+) covid-19, tidak ada berpergian ke 
                    </font>
                    <font style="font-size: 14pt; margin-left:40px;" face="Arial">
                        daerah terpapar covid-19, tidak ada keluhan terkait gejala terpapar covid-19 )
                    </font>
                    </td>
                </tr>
            </table>        
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:40px;">
                <tbody>
                <br>
                <tr>
                    <td width="300">
                        <font style="font-size: 14pt; margin-left:20px;" face="Arial">
                    2. Pemeriksaan Fisik
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt" face="Arial">Tinggi Badan : {{ $raw->tinggibadan }} cm, Berat Badan : {{ $raw->beratbadan }} kg, Tensi Darah : {{ $raw->tensidarah }}</font>
                    </td>
                </tr>
            </table>  
        </td>
    </tr> 
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:40px;">
                <tbody>
                <tr>
                    <td width="120" align="justify">
                        <font style="font-size: 14pt; margin-left:40px;" face="Arial">
                        mmHg, Suhu Tubuh : {{ $raw->suhutubuh }} &deg;C ( tidak ditemukan gejala batuk pilek, demam tinggi dan
                    </font>
                    <font style="font-size: 14pt; margin-left:40px;" face="Arial">
                        sesak nafas )
                    </font>
                    </td>
                </tr>
            </table>        
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:40px;">
                <tbody>
                <br>
                <tr>
                    <td width="312">
                        <font style="font-size: 14pt; margin-left:20px;" face="Arial">
                    3. {{ $raw->jenispemeriksaan }}
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt" face="Arial">Negatif (-) / Positif (+)</font>
                    </td>
                </tr>
            </table>  
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:40px;">
                <tbody>
                    <br>
                <tr>
                    <td width="12" align="justify">
                        <font style="font-size: 14pt; margin-left:60px;" face="Arial">
                    Surat Keterangan pemeriksaan Covid - 19 ini digunakan untuk Persyaratan {{ $raw->persyaratan }}
                    </font>
                    </td>
                </tr>
                
            </table>
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:40px;">
                <tbody>
                    <br>
                <tr>
                    <td width="12" align="justify">
                        <font style="font-size: 14pt; margin-left:60px;" face="Arial">
                    Berdasarkan hasil pemeriksaan laboratorium saat ini, tidak ditemukan tanda-tanda atau gejala penyakit Covid-19
                    </font>
                    </td>
                </tr>
                
            </table>
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-top: 40px;">
                <tbody>
                <tr>
                    <td style="text-align: center">
                        <font style="font-size: 14pt; margin-left:400px;" face="Arial">
                    Cianjur, {{ App\Traits\Valet::getDateIndo(date('Y-m-d'))   }}
                    </font>
                    <br>
                    <font style="font-size: 14pt; margin-left:400px;" face="Arial">
                    <b>DOKTER PEMERIKSA</b>
                    </font>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="95%" style="margin-top: 100px;">
                <tbody>
                <tr>
                    <td style="text-align: center">
                        <font style="font-size: 14pt; margin-left:350px;" face="Arial">
                    <u>{{ $raw->namadokter }}</u>
                    </font>
                    <div style="margin-top: 0px; margin-right: 60px; margin-left: 360px;">
                        
                    </div>
                    <font style="font-size: 14pt; margin-left:350px;" face="Arial">
                    {{ $raw->pangkatnrp }}
                    </font>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
@endsection
