
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
<style type="text/css">
   .letter-20{ letter-spacing: -20px; }
   .letter-1{ letter-spacing: -1px; }
   .letter1 { letter-spacing: 1px; }
   .letter5 { letter-spacing: 5px; }
   
   .word-20{ word-spacing: -20px; }
   .word-1{ word-spacing: -1px; }  
   .word1 { word-spacing: 1px; }  
   .word5 { word-spacing: 5px; }    

   .contoh1 { font-size:16px; }
   .contoh2 { font-size:16px; line-height: 20px;}
   .contoh3 { font-size:14px; line-height: 1.20;}
   .contoh4 { font-size:14px; line-height: 1.20;  align="right";}
</style>
    <tr>

        <td bordercolor="#808080" height="13" align="center">
            <font style="font-size: 11pt" face="Arial" color="#000000">
                    <span style="font-weight: 700;font-size: 12pt">
                        <u>SURAT KETERANGAN BERBADAN SEHAT</u>
                    </span>
            </font>
        </td>
    </tr>
    <tr>

        <td bordercolor="#808080" height="13" align="center">
            <font style="font-size: 11pt" face="Arial" color="#000000">
                    <span style="font-weight: 700;font-size: 11pt">
                        Nomor: {{ $raw->noSurat }}
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
                    <td width="120" align="justify" class="contoh3">
                        <font style="font-size: 12pt; margin-left:60px; margin-right:135px;" face="Arial">
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
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:100px;">
                <tbody>
                <p>
                <br>
                <tr>
                    <td width="250" class="contoh3">
                        <font style="font-size: 12pt; margin-left:20px;" face="Arial">
                                Nama
                    </font>
                    <td>:</td>
                    <td width="500"><font style="font-size: 12pt;font-weight: bold" face="Arial" > {{ $raw->namapasien }} </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="250" class="contoh3">
                        <font style="font-size: 12pt; margin-left:20px;" face="Arial">
                               Jenis Kelamin
                    </font>
                    <td>:</td>
                    <td width="500"><font style="font-size: 12pt" face="Arial"> {{ $raw->jeniskelamin }} </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="250" class="contoh3">
                        <font style="font-size: 12pt; margin-left:20px;" face="Arial">
                    Tempat/Tgl.Lahir
                    </font>
                    <td>:</td>
                    <td width="500"><font style="font-size: 12pt" face="Arial"> {{ App\Traits\Valet::getDateIndo($raw->tgllahir).' '.substr($raw->tgllahir,1,0)   }} </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="250" class="contoh3">
                        <font style="font-size: 12pt; margin-left:20px;" face="Arial">
                    Alamat
                    </font>
                    <td>:</td>
                    <td width="500" align="justify"><font style="font-size: 12pt" face="Arial"> {{ $raw->alamatlengkap }} </font></td>
                    </td>
                </tr>
                </p>
            </table>  
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:40px;">
                <tbody>
                    <br>
                <tr>
                    <td width="12" align="justify" class="contoh3">
                        <font style="font-size: 12pt; margin-left:60px;" face="Arial">
                    Bahwa hasil pemeriksaan kesehatan pada saat ini, yang bersangkutan adalah Sehat / Tidak Sehat
                    dan setelah dilakukan pemeriksaan sebagai berikut :
                    </font>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:100px;">
                <tbody>
               
                <tr>
                <td width="500" class="contoh3">
                        <font style="font-size: 12pt;margin-left:20px;" face="Arial">
                    1. Tinggi Badan
                    </font>
                    <td width="250"><font style="font-size: 12pt;margin-left:-20px;" face="Arial">:</font></td>
                    <td width="500"><font style="font-size: 12pt;margin-left:-135px;" face="Arial">{{ $raw->tinggibadan }}</font></td>
                    <td width="250"><font style="font-size: 12pt;margin-left:-300px;" face="Arial">cm</font></td>
                    </td>
                </tr>
                <tr>
                <td width="500" class="contoh3" >
                        <font style="font-size: 12pt;margin-left:20px; " face="Arial">
                    2. Berat Badan
                    </font>
                    <td width="250"><font style="font-size: 12pt;margin-left:-20px;" face="Arial">:</font></td>
                    <td width="500"><font style="font-size: 12pt;margin-left:-135px;" face="Arial">{{ $raw->beratbadan }} </font></td>
                    <td><font style="font-size: 12pt;margin-left:-300px;" face="Arial">kg</font></td>
                    </td>
                </tr>
                <tr>
                <td width="500" class="contoh3" >
                    <font style="font-size: 12pt;margin-left:20px; " face="Arial">
                    3. Tensi Darah
                    </font>
                    <td width="250"><font style="font-size: 12pt;margin-left:-20px;" face="Arial">:</font></td>
                    <td width="500"><font style="font-size: 12pt;margin-left:-135px;" face="Arial">{{ $raw->tensidarah }}</font></td>
                    <td ><font style="font-size: 12pt;margin-left:-300px;" face="Arial">mmHg</font></td>
                   
                    </td>
                </tr>
                <tr>
                <td width="500" class="contoh3" >
                        <font style="font-size: 12pt;margin-left:20px;" face="Arial">
                    4. Suhu Tubuh
                    </font> 
                </td>
                    <td width="250"><font style="font-size: 12pt;margin-left:-20px;" face="Arial">:</font></td>
                    <td  width="250"><font style="font-size: 12pt;margin-left:-135px;" face="Arial">{{ $raw->suhutubuh }}</font></td>
                    <td  width="250"><font style="font-size: 12pt;margin-left:-300px;" face="Arial">&deg;C</font></td>
                </tr>
               
            </table>  
        </td>
    </tr>  
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="90%" >
                <tbody>
                    <br>
                <tr>
                    <td width="12" align="left" class="contoh3">
                        <font style="font-size: 12pt; margin-left:40px;" face="Arial">
                    Surat Keterangan Kesehatan ini digunakan untuk Persyaratan {{ $raw->persyaratan }}
                    </font>
                    </td>
                </tr>
                
            </table>
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="90%">
                <tbody>
                    <br>
                <tr>
                    <td width="12" align="left" class="contoh3">
                        <font style="font-size: 12pt; margin-left:40px;" face="Arial">
                    Demikian surat keterangan kesehatan ini di buat dengan mengingat sumpah jabatan.
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
                        <font style="font-size: 12pt; margin-left:400px;" face="Arial">
                    Jakarta, {{ App\Traits\Valet::getDateIndo(date('Y-m-d'))   }}
                    </font>
                    <br>
                    <font style="font-size: 12pt; margin-left:400px;" face="Arial">
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
                    <td  class="contoh5">
                    <br><br><br>
                        <font style="font-size: 12pt; margin-left:480px;" face="Arial">
                    <u>{{ $raw->namadokter }}</u>
                    </font> 
                                    
                </tr>
                 <tr>
                    <td  class="contoh5">
                    </font> 
                        <font style="font-size: 12pt; margin-left:380px;" face="Arial">
                    {{ $raw->nippns }}
                    </font>               
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
    
@endsection
