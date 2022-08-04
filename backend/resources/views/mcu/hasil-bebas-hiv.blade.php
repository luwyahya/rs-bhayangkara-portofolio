
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
                        <u>SURAT KETERANGAN BEBAS HIV</u>
                    </span>
            </font>
        </td>
    </tr>
    <tr>
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
        <td bordercolor="#808080" height="13" >
        <br>
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:40px;">
                <tbody>
                <tr>
                    <td width="120" align="justify">
                        <font style="font-size: 14pt; margin-left:60px; margin-right:135px;" face="Arial">
                    Yang bertanda tangan dibawah ini, dokter pada Rumah Sakit Bhayangkara Tk.I R. Said 
                    Sukanto Jakarta, telah memeriksa kesehatan seorang Laki - Laki / Perempuan :
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
                        <font style="font-size: 14pt; margin-left:20px;" face="Arial">
                    Nama
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt" face="Arial"> {{ $raw->namapasien }} </font></td>
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
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:40px;">
                <tbody>
                    <br>
                <tr>
                    <td width="12" align="justify">
                        <font style="font-size: 14pt; margin-left:60px;" face="Arial">
                    Pada saat ini berdasarkan hasil pemeriksaan laboratorium menggunakan test <b>Anti HIV</b>
                    metode imunokromatografi tertanggal {{ App\Traits\Valet::getDateIndo(date('Y-m-d'))   }} menunjukkan hasil :
                    
                    </font>
                    </td>
                </tr>
            </table>
        </td>
    </tr> 
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:-20px; margin-top: -21px;">
                <tbody>
                    <br>
                <tr>
                    <td width="12" align="justify">
                        <font style="font-size: 14pt; margin-left:60px;" face="Arial">
                    <b>REAKTIF / NON REAKTIF</b>
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
                    Surat Keterangan ini digunakan untuk Persyaratan {{ $raw->persyaratan }}
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
                    Demikian surat keterangan ini dibuat dengan mengingat sumpah jabatan.
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
                    <b>Dokter yang menerangkan</b>
                    </font>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-top: 40px; margin-bottom: 250px;">
                <tbody>
                <tr>
                    <td style="text-align: center">
                    <br><br><br>
                        <font style="font-size: 14pt; margin-left:400px;" face="Arial">
                    <u>{{ $raw->namadokter }}</u>
                    </font>
                    <br>
                    
                    </td>
                </tr>
            </table>
        </td>
    </tr>
@endsection
