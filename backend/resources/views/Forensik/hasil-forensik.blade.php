<html>
<head>
  <title>
    Report
  </title>
  <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
</head>
<style type="text/css" media="print">
  @page {
    size: auto;   /* auto is the initial value */
    margin: 0;  /* this affects the margin in the printer settings */
  }
  @page {
      margin-top: 30px;
  }
  body {
    counter-reset: section;
}
.header {
    
}
.header::after{
    margin-top: 30px;
    counter-increment: section;
    counter-reset: sections;
    content: "Halaman " counter(section) " dari 10"
}

#page-number::before {
  /* Increment "my-sec-counter" by 1 */
  counter-increment: my-sec-counter;
  content: "Page " counter(my-sec-counter) " of " counter(my-sec-counters);
}
@page :first{
    margin-top: 0px;
    margin-bottom: 0px;
}
.page-break {
 page-break-after: always;
 page-break-inside: avoid;
 counter-increment: page;
 content: counter(page) " of " counter(pages)
}
.siaasu {
    text-align: right;
}
</style>
<style>
     tr td {
    padding:2px 4px 2px 4px;
    }
  .borderss{
    border-bottom: 1px solid black;
  }
  body{
    font-family: Arial;
  }
</style>
<body style="background-color: #CCCCCC">
    
  <div align="center">
    <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0">
      <tbody>
        <tr>
          <td style="padding: 30px">
            <div align="center">
              <p align="right">
                <!--                        <a href="#"><font face="Arial"><img src="image/report_print.png" onclick="window.print()" height="40" border="0" width="39"></font></a>-->
                <!--                        <a href="#"><font face="Arial"><img src="image/report_pdf.png" height="40" border="0" width="39"></font></a>-->
                <!--                        <a href="#"><font face="Arial"><img src="image/report_close.png" onclick="window.close()" height="40" border="0" width="39"></font></a>-->
                <table cellspacing="0" cellpadding="0" height="133" border="0" width="100%" style="text-align: center">
                  <tbody>
                    <tr>
                    <td style="text-align:left">
                        <div align="center">
                          <table cellspacing="0" cellpadding="0" height="74" border="0" width="850">
                            <tbody>
                              <tr>
                              <div class="header siaasu">
                            {{ $raw->nomorsurat }}
                            <br>
                             </div>
                                <td valign="top"></td>
                              </tr>
                              <tr>
                                <td valign="top">
                                  <table  cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tbody>
                                    
                                    <td align="center">
                                    <img src="{{ asset('img/Lambang_Polri.png') }}" style="width: 80px; margin-left: -380px;" border="0">
                                    <br>
                                        <b>
                                            <font style="font-size: 14pt; margin-right: 340px;" color="#000000">RUMAH SAKIT BHAYANGKARA TK.I R SAID SUKANTO</font>
                                        <br>
                                        </b>
                                        <b>
                                            <font style="font-size: 14pt; margin-right: 340px;" color="#000000">INSTALASI KEDOKTERAN FORENSIK</font>
                                        <br>
                                        </b>
                                        <font style="font-size: 12pt; margin-right: 340px;" color="#000000">Jl. Raya Bogor, Kramat Jati, Jakarta 13510</font>
                                    </td>
                                    
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
  <div style="margin-top: -10px; margin-right: 350px;">
    <hr style="border:1px solid #000;margin-bottom:0px;">
  </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
<tr>
    <td bordercolor="#808080" height="13" >
        <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-top:-3%;">
            <tbody>
            <tr>
                <td width="120" align="justify">
                    <font style="font-size: 14pt; margin-left:60px; margin-right:135px;" face="Arial">
                    Nomor &emsp;&emsp;&nbsp;: {{ $raw->nomorsurat }}
                    </font>
                    <br>
                    <font style="font-size: 14pt; margin-left:60px; margin-right:135px;" face="Arial">
                    Lampiran &emsp;  : -
                    </font>
                    <br>
                    <font style="font-size: 14pt; margin-left:60px; margin-right:135px;" face="Arial">
                    Perihal &emsp;&emsp; : Visum et Repertum Jenazah
                    </font>
                    <br>
                    <font style="font-size: 14pt; margin-left:60px; margin-right:135px;" face="Arial">
                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; <u><b>A/n {{ $raw->namapasien }}</b></u>
                    </font>
                    <br><br>
                    <font style="font-size: 14pt; margin-left:60px; margin-right:135px;" face="Arial">
                    <b>PRO JUSTITIA</b>
                    </font>
                </td>
            </tr>
        </table>        
    </td>
</tr>
<tr>
<tr>
        <td bordercolor="#808080" height="13" >
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:180px; margin-bottom:30px;">
                <tbody>
                <tr>
                    <td width="120" align="right">
                        <font style="font-size: 14pt; margin-right:135px;" face="Arial">
                        {{ App\Traits\Valet::getDateIndo($raw->tanggalttd).' '.substr($raw->tanggalttd,1,0)   }}
                    </font>
                    </td>
                </tr>
            </table>        
        </td>
    </tr>
    
<td bordercolor="#808080" height="13" align="center">
    <font style="font-size: 11pt" face="Arial" color="#000000">
            <span style="font-weight: 700;font-size: 14pt">
                <u><b>VISUM ET REPERTUM</b></u>
            </span>
    </font>
</td>
</tr>
<tr>
        <td bordercolor="#808080" height="13" >
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:40px;">
                <tbody>
                <tr>
                    <td width="120" align="justify">
                        <font style="font-size: 14pt; margin-right:135px;" face="Arial">
                    Kami yang bertanda tangan dibawah ini {{ $raw->namalengkap1}} {{ $raw->namalengkap2}} {{ $raw->namalengkap3}} {{ $raw->namalengkap4}}
                    {{ $raw->namalengkap5}} {{ $raw->namalengkap6}}, di Rumah Sakit Bhayangkara Tk.I R. Said Sukanto, berdasarkan
                    permintaan tertulis dari {{ $raw->ataspermintaan }} dengan surat nomor {{ $raw->nomor2 }}, tertanggal {{ App\Traits\Valet::getDateHuruf($raw->tanggalpermintaan).' '.substr($raw->tanggalpermintaan,1,0)   }}
                    perihal permintaan Visum et Repertum, makan dengan ini menerangkan bahwa pada tanggal {{ App\Traits\Valet::getDateHuruf2(date('Y-m-d H:i'))  }} menit
                    Waktu Indonesia Barat, bertempat di Ruang Otopsi Rumah Sakit Bhayangkara Tk.I R.Said Sukanto telah melakukan
                    pemeriksaan luar atas jenazah yang menurut surat permintaan visum tersebut memiliki identitas sebagai berikut:
                    </font>
                    </td>
                </tr>
            </table>        
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:40px; text-align:justify;">
                <tbody>
                <br>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:20px;" face="Arial">
                    Nama
                    </font>
                    <td>:</td>
                    <td width="600"><div style="float: left; margin-right:10px; font-size: 14pt" face="Arial">{{ $raw->namapasien }} </div>
                    <hr style="margin-bottom:0px; border-top: 3px dashed  #000; ">
                    
                    </td>
                    </td>
                </tr>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:20px;" face="Arial">
                    Tempat/Tgl.Lahir
                    </font>
                    <td>:</td>
                    <td width="600"><div style="float: left; margin-right:10px; font-size: 14pt" face="Arial">{{ $raw->tempatlahir2 }}, {{ App\Traits\Valet::getDateIndo($raw->tgllahir2).' '.substr($raw->tgllahir2,1,0)   }} </div>
                    <hr style="margin-bottom:0px; border-top: 3px dashed  #000; "></td>
                    </td>
                </tr>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:20px;" face="Arial">
                    Agama
                    </font>
                    <td>:</td>
                    <td width="600"><div style="float: left; margin-right:10px; font-size: 14pt" face="Arial">{{ $raw->agama }} </div>
                    <hr style="margin-bottom:0px; border-top: 3px dashed  #000; "></td>
                    </td>
                </tr>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:20px;" face="Arial">
                    Jenis Kelamin
                    </font>
                    <td>:</td>
                    <td width="600"><div style="float: left; margin-right:10px; font-size: 14pt" face="Arial">{{ $raw->jeniskelamin }} </div>
                    <hr style="margin-bottom:0px; border-top: 3px dashed  #000; "></td>
                    </td>
                </tr>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:20px;" face="Arial">
                    Warga Negara
                    </font>
                    <td>:</td>
                    <td width="600" align="justify"><div style="float: left; margin-right:10px; font-size: 14pt" face="Arial">{{ $raw->namanegara }} </div>
                    <hr style="margin-bottom:0px; border-top: 3px dashed  #000; "></td>
                    </td>
                </tr>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:20px;" face="Arial">
                    Pekerjaan
                    </font>
                    <td>:</td>
                    <td width="600" align="justify"><div style="float: left; margin-right:10px; font-size: 14pt" face="Arial">{{ $raw->pekerjaan2 }} </div>
                    <hr style="margin-bottom:0px; border-top: 3px dashed  #000; "></td>
                    </td>
                </tr>
                <tr>
                    <td width="250">
                        <font style="font-size: 14pt; margin-left:20px;" face="Arial">
                    Alamat
                    </font>
                    <td>:</td>
                    <td width="600" align="justify"><div style="float: left; margin-right:10px; font-size: 14pt" face="Arial">{{ $raw->alamatlengkap}} </div>
                    <hr style="margin-bottom:0px; border-top: 3px dashed  #000; "></td>
                    </td>
                </tr>
            </table>  
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13" >
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:40px;">
                <tbody>
                <tr>
                    <td width="120" >
                    <div class="separator"><b>Hasil Pemeriksaan</b></div>
                    </td>
                </tr>
            </table>        
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13" >
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:40px;">
                <tbody>
                <tr>
                    <td width="10%" align="justify">
                    <div style="float: left; margin-right:10px; font-size: 14pt" face="Arial"><b>I. PEMERIKSAAN LUAR</b> </div>
                    <hr style="margin-bottom:0px; border-top: 3px dashed  #000; ">
                    </td>
                </tr>
            </table>        
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13" >
            <table cellspacing="0" cellpadding="0" border="0" width="90%" height="20%" style="margin-right:70px; margin-left:40px">
                <tbody>
                <tr>
                <td width="120" align="left">
                    @php
                $exper = explode('~',$raw->pemeriksaanluar);
                //dd($exper);
                $datas =[];
                foreach ($exper as $r){
                    $datas [] = array(
                        'ket' =>(string)  $r
                    );
                }
            // dd($datas);

            @endphp
            <div style="text-align: left;font-size: 14pt;" face="Arial">
                @foreach($datas as $e => $val)
                    @php
                        $val['ket'] = str_replace('','',$val['ket'] );
                    @endphp
                    <p style="margin-block-start: 0px;
                margin-block-end: 0px;
                margin-inline-start: 0px;
                margin-inline-end: 0px;">
                        {!!  nl2br(str_replace('~','<br/>',$val['ket'] )) !!}
                        {{--                    {!! nl2br(str_replace(" ", " &nbsp;", $val['ket'])) !!}--}}
                    </p>

                @endforeach
            </div>
                    </td>
                </tr>
            </table>        
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13" >
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:40px;">
                <tbody>
                <tr>
                <div class="page-break">
                    </div>
                <div class="header siaasu">
                </div>
                    <td width="120" align="left">
                    <div style="float: left; margin-right:10px; font-size: 14pt" face="Arial"><b>II. PEMERIKSAAN DALAM</b> </div>
                    <hr style="margin-bottom:0px; border-top: 3px dashed  #000; ">
                    </td>
                    
                </tr>
            </table>        
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13" >
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-left:40px;">
                <tbody>
                <tr>
                    <td width="120" align="left">
                    @php
                $exper = explode('~',$raw->pemeriksaandalam);
                //dd($exper);
                $datas =[];
                foreach ($exper as $r){
                    $datas [] = array(
                        'ket' =>(string)  $r
                    );
                }
            // dd($datas);

            @endphp
            <div style="text-align: left;font-size: 14pt;" face="Arial">
                @foreach($datas as $e => $val)
                    @php
                        $val['ket'] = str_replace('','',$val['ket'] );
                    @endphp
                    <p style="margin-block-start: 0px;
                margin-block-end: 0px;
                margin-inline-start: 0px;
                margin-inline-end: 0px;">
                        {!!  nl2br(str_replace('~','<br/>',$val['ket'] )) !!}
                        {{--                    {!! nl2br(str_replace(" ", " &nbsp;", $val['ket'])) !!}--}}
                    </p>

                @endforeach
            </div>
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
                    <td style="text-align: justify">
                    <br><br><br>
                        <font style="font-size: 14pt;" face="Arial">
                    <u>{{ $raw->namalengkap1 }}</u>
                    </font>
                        <font style="font-size: 14pt; margin-left: 30px;" face="Arial">
                    <u>{{ $raw->namalengkap2 }}</u>
                    </font>
                    <br>
                    
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
                    <td style="text-align: justify">
                    <br><br><br>
                    <font style="font-size: 14pt;" face="Arial">
                    <u>{{ $raw->namalengkap3 }}</u>
                    </font>
                        <font style="font-size: 14pt; margin-left: 30px;" face="Arial">
                    <u>{{ $raw->namalengkap4 }}</u>
                    </font>
                    <br>
                    
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
                    <td style="text-align: justify">
                    <br><br><br>
                    <font style="font-size: 14pt;" face="Arial">
                    <u>{{ $raw->namalengkap5 }}</u>
                    </font>
                        <font style="font-size: 14pt; margin-left: 30px;" face="Arial">
                    <u>{{ $raw->namalengkap6 }}</u>
                    </font>
                    <br>
                    
                    </td>
                </tr>
            </table>
        </td>
    </tr>
                
              </p>
            </div>
          </td>

        </tr>

      </tbody>
    </table>
  </div>
</body>
</html>
