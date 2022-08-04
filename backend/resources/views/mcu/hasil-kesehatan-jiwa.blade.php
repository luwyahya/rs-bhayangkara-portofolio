
@extends('template-mcu.header')
@section('content-body')
<style>
@page {
    margin-top: 0px;
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
                        <u>SURAT KETERANGAN DOKTER KESEHATAN JIWA</u>
                    </span>
            </font>
        </td>
    </tr>
    <tr>

        <td bordercolor="#808080" height="13" align="center">
            <font style="font-size: 11pt" face="Arial" color="#000000">
                    <span style="font-weight: 700;font-size: 11pt">
                        Nomor: {{ $raw->nomor2 }}
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
                    Yang bertanda tangan dibawah ini Dokter Ahli Kesehatan Jiwa di Rumah Sakit Bhayangkara Tk.I R. Said Sukanto :
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
                        <font style="font-size: 14pt; margin-left:60px;" face="Arial">
                    Nama
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt" face="Arial">{{   $raw->namadokter }} </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:60px;" face="Arial">
                    Pangkat/NRP
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt" face="Arial">{{   $raw->pangkatnrp }} </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:60px;" face="Arial">
                    Jabatan
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt" face="Arial">Dokter Ahli Kedokteran Jiwa Rumah Sakit Bhayangkara Tk.I R. Said Sukanto </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:60px;" face="Arial">
                    Kesatuan
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt" face="Arial">Rumah Sakit Bhayangkara Tk.I R. Said Sukanto </font></td>
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
                    Menerangkan Bahwa telah melakukan pemeriksaan: test MMPI dan 
                    Wawancara Psikiatrik pada tanggal {{ App\Traits\Valet::getDateIndo(date('Y-m-d'))   }} terhadap :
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
                        <font style="font-size: 14pt; margin-left:40px;" face="Arial">
                    Nama
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt" face="Arial">{{   $raw->namapasien }} </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:40px;" face="Arial">
                        Jenis Kelamin
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt" face="Arial">{{   $raw->jeniskelamin }} </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:40px;" face="Arial">
                    Tempat/Tanggal Lahir
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt" face="Arial">{{ App\Traits\Valet::getDateIndo($raw->tgllahir).' '.substr($raw->tgllahir,1,0)   }} </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:40px;" face="Arial">
                    Alamat
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt" face="Arial">{{   $raw->alamatlengkap }} </font></td>
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
                        <font style="font-size: 14pt;" face="Arial">
                    Hasilnya pada saat ini tidak ditemukan adanya gejala gangguan jiwa (psikopatologi) 
                    bermakna yang mengganggu fungsi dan aktivitas sehari-hari
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
                        <font style="font-size: 14pt;" face="Arial">
                    Demikian surat keterangan ini dibuat dengan sebenarnya untuk Persyaratan {{    $raw->persyaratan    }}.
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
                    Jakarta, {{ App\Traits\Valet::getDateIndo(date('Y-m-d'))   }}
                    </font>
                    <br>
                    <font style="font-size: 14pt; margin-left:400px;" face="Arial">
                    <b>DOKTER SPESIALIS KEDOKTERAN JIWA</b>
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
                        <font style="font-size: 14pt; margin-left:300px;" face="Arial">
                    <u>{{ $raw->namadokter }}</u>
                    </font>
                    <div style="margin-top: 0px; margin-right: 60px; margin-left: 360px;">
                        
                    </div>
                    <font style="font-size: 14pt; margin-left:300px;" face="Arial">
                    {{ $raw->pangkatnrp }}
                    </font>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
@endsection
