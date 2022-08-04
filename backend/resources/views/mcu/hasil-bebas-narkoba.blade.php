
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
                        <u>SURAT KETERANGAN BEBAS NARKOBA</u>
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
                    Yang bertanda tangan dibawah ini Dokter Spesialis Kesehatan Jiwa pada Rumah Sakit
                    Bhayangkara Tk.I R. Said Sukanto Jakarta, menerangkan bahwa atas permintaan SENDIRI
                    bertempat di Instalasi MCU Rumah Sakit Bhayangkara Tk. I R. Said Sukanto Jakarta, pada
                    tanggal {{ App\Traits\Valet::getDateIndo(date('Y-m-d')).date(' H:i')   }} WIB melakukan pemeriksaan
                    dengan keterangan sebagai berikut
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
                    Tempat/Tgl.Lahir
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt" face="Arial"> {{ App\Traits\Valet::getDateIndo($raw->tgllahir).' '.substr($raw->tgllahir,1,0)   }} </font></td>
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
                        <font style="font-size: 14pt;" face="Arial">
                    <b>--------------------------------------------HASIL PEMERIKSAAN---------------------------------------------</b>
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
                    I. Keadaan Umum
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt" face="Arial"> Baik </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:20px;" face="Arial">
                    II. Pemeriksaan Urine
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt" face="Arial">  </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:40px;" face="Arial">
                    1. Cannabis
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt" face="Arial">Lot. THC &ensp; DOA19100059 &ensp; Right Sign &ensp; Hasil : (-) NEGATIF</font></td>
                    </td>
                </tr>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:40px;" face="Arial">
                    2. Morphin
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt" face="Arial">Lot. MOR &ensp;DOA19100059 &ensp; Right Sign &ensp; Hasil : (-) NEGATIF</font></td>
                    </td>
                </tr>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:40px;" face="Arial">
                    3. Amphetamine
                    </font>
                    <td>:</td>
                    <td width="600"><font style="font-size: 14pt" face="Arial">Lot. AMP &ensp;DOA19100059 &ensp; Right Sign &ensp; Hasil : (-) NEGATIF</font></td>
                    </td>
                </tr>
                <tr>
                    <td width="250">
                        <br><br>
                        <font style="font-size: 14pt; face="Arial">
                    <b>KESIMPULAN :</b>
                    </font>
                    <td></td>
                    <td width="600"><font style="font-size: 14pt" face="Arial"></font></td>
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
                    Pada pemeriksaan bahan sediaan air seni (urine), tidak ditemukan bahan Cannabis, 
                    Morphin, dan Amphetamine.------------------------------------------------------------------------------------
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
                    Demikianlah telah kami uraikan dengan sejujur - jujurnya dengan menggunakan
                    keilmuan saya yang sebaik - baiknya, mengingat sumpah sesuai dengan Kitab
                    Undang-Undang Hukum Acara Pidana----------------------------------------------------------------------------------
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
                    <b>DOKTER PEMERIKSA</b>
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
                    <br><br><br>
                        <font style="font-size: 14pt; margin-left:400px;" face="Arial">
                    <u>dr. KARJANA , Sp.KJ</u>
                    </font>
                    <br>
                    <font style="font-size: 14pt; margin-left:400px;" face="Arial">
                    KOMBES POL NRP . 65090803
                    </font>
                    
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
@endsection
