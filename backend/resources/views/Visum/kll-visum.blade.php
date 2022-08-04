<html>
<head>
  <title>
    Report
  </title>
  <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
</head>
<style type="text/css" media="print">
@page:first {
    margin: -70px 0px 70px; 
}
@page {
    margin: 70px 0px 70px; 
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
  .bayangprint{
    /* background: url("/img/logorspolri.png");width:100%;
   
    height:180px;
    margin:30px 50px;
    background-color:#ffffff;
    border:1px solid black;
    opacity:0.5;
    filter:alpha(opacity=50); */
    /* background-image: url('/img/logorspolri.png');
    background-size: cover;
    background-repeat: round; */
  }
  .txtpenting::after {
  border-bottom: 2px dashed black;
  content: '';
  display: block;
  margin-top: -5px;
  margin-left: 5px;
  
  }
</style>
<body style="background-color: #FFFFFF">
  <div align="center">
    <table class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0">
      <tbody>
       

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
                                <td valign="top"></td>
                              </tr>
                              <tr>
                                <td bordercolor="#808080" height="13" >
                                    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:3%;">
                                        <tbody>
                                        <tr>
                                            <td width="120" align="right" class="contoh3">
                                                <font style="font-size: 12pt; color: #FF0905" face="Arial">
                                            {{ $raw->nosurat }}
                                            </font>
                                            </td>
                                        </tr>
                                    </table>        
                                </td>
                            </tr>
                              <tr>
                                <td valign="top">
                                  <table  cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tbody>
                                    <td align="center">
                                    <b> <br>
                                        </b>
                                        <b> <br>
                                        </b>
                                        <tr>
        <br>
        </br>
                                    </td>
                                    <td align="left">
                                    <p align="left">
                                        <img src="{{ asset('img/Lambang_Polri.png') }}" style="width: 80px; margin-left:24%;" border="0">
                                    </p>  
                                        <b>
                                            <font style="font-size: 14pt; margin-right: 340px;" color="#000000">RUMAH SAKIT BHAYANGKARA TK.I R. SAID SUKANTO</font>
                                        <br>
                                        </b>
                                        <b>
                                            <font style="font-size: 14pt; margin-right: 340px;" color="#000000">INSTALASI KEDOKTERAN FORENSIK</font>
                                        <br>
                                        </b>
                                        <font style="font-size: 12pt; margin-right: 340px;" color="#000000">JL. RAYA BOGOR, KRAMAT JATI, JAKARTA 13510</font>
                                    </td>
                                    
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
  <div style="margin-top: -10px; margin-right: 350px;">
    <hr style="border:1px solid #000;">
    <hr style="border:2px solid #000;margin-bottom:0px;margin-top: -1%;">
  </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tbdody>
                        <tr>
                                <td bordercolor="#808080" height="13">
                                    <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tbody>
                                        <p>
                                        <br>
                                        <tr>
                                            <td width="85" class="contoh3" align="left">
                                                <font style="font-size: 12pt;" face="Arial">
                                                        Nomor
                                            </font>
                                            <td>:</td>
                                            <td width="700"><font style="font-size: 12pt;" face="Arial" > {{ $raw->nosurat }} </font></td>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="85" class="contoh3" align="left">
                                                <font style="font-size: 12pt;" face="Arial">
                                                       Lampiran
                                            </font>
                                            <td>:</td>
                                            <td width="700"><font style="font-size: 12pt" face="Arial"> - </font></td>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="85" class="contoh3" align="left">
                                                <font style="font-size: 12pt;" face="Arial">
                                            Perihal
                                            </font>
                                            <td>:</td>
                                            <td width="700"><font style="font-size: 12pt" face="Arial"> Visum et Repertum </font></td>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="85" class="contoh3" align="left">
                                                <font style="font-size: 12pt;" face="Arial">
                                            
                                            </font>
                                            <td></td>
                                            <td width="700"><font style="font-size: 12pt" face="Arial"><b><u> {{ $raw->namapasien }} </u></b></font></td>
                                            </td>
                                        </tr>
                                        </p>
                                    </table>  
                                </td>
                            </tr>
                            <tr>
                                <td bordercolor="#808080" height="13" >
                                    <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tbody>
                                        <tr>
                                            <td width="120" class="contoh3">
                                                <font style="font-size: 12pt;" face="Arial">
                                            <b>PRO JUSTITIA</b>
                                            </font>
                                            </td>
                                            <td width="120" align="right" class="contoh3">
                                                <font style="font-size: 12pt;" face="Arial">
                                            <p>Jakarta, {{ App\Traits\Valet::getDateIndo(date('Y-m-d H:i'))  }}</p>
                                            </font>
                                            </td>
                                        </tr>
                                    </table>        
                                </td>
                            </tr>
                            <tr>
                                <td bordercolor="#808080" height="13" >
                                    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:3%;">
                                        <tbody>
                                        <tr>
                                            <td width="120" align="center" class="contoh3">
                                                <font style="font-size: 12pt;" face="Arial">
                                            <b><u>VISUM ET REPERTUM</u></b>
                                            </font>
                                            </td>
                                        </tr>
                                    </table>        
                                </td>
                            </tr>
                            <tr>
                                <td bordercolor="#808080" height="13" >
                                    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:3%;">
                                        <tbody>
                                        <tr>
                                            <td width="120" align="justify" class="contoh3">
                                                <font style="font-size: 12pt;" face="Arial">
                                                    <div style="margin-left:2px; font-size: 14pt; display: flow-root "><span style="background-color: rgba(255, 255, 255); " class="txtpenting">Saya yang bertanda tangan dibawah ini {{ $raw->dokter }}, dokter di Rumah Sakit Bhayangkara
                                             Tk. I R. Said Sukanto {{ $raw->formatkonsultan }} , berdasarkan permintaan tertulis dari Kepolisian {{ $raw->permintaan }}
                                             dengan surat nomor {{ $raw->nosuratpermintaan }}, tertanggal {{ App\Traits\Valet::getDateHuruf($raw->tglpermintaan).' '.substr($raw->tglpermintaan,1,0)   }} mengenai
                                             permintaan visum tersebut di atas, maka dengan ini menerangkan bahwa pada tanggal {{ App\Traits\Valet::getDateHuruf2(date('Y-m-d H:i'))  }}
                                             Waktu Indonesia Barat, bertempat di Ruang Pemeriksaan Pusat Pelayanan Perempuan dan Anak Terpadu Rumah
                                             Sakit Bhayangkara TK. I R. Said Sukanto telah melakukan pemeriksaan atas korban yang menurut
                                             surat permintaan visum tersebut adalah :<span></div>
                                            </font>
                                            </td>
                                        </tr>
                                    </table>        
                                </td>
                            </tr>
                            <tr>
                                <td bordercolor="#808080" height="13">
                                    <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tbody>
                                        <p>
                                        <br>
                                        <tr>
                                            <td width="150" class="contoh3" align="left">
                                                <font style="font-size: 12pt;" face="Arial">
                                                        Nama
                                            </font>
                                            <td>:</td>
                                            <td width="700"><font style="font-size: 12pt;" face="Arial" ><div style="margin-left:2px; font-size: 14pt; display: flow-root "><span style="background-color: rgba(255, 255, 255); " class="txtpenting"> {{ $raw->namapasien2 }} </span></div></font></td>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="150" class="contoh3" align="left">
                                                <font style="font-size: 12pt;" face="Arial">
                                                       Tempat, Tgl. Lahir
                                            </font>
                                            <td>:</td>
                                            <td width="700"><font style="font-size: 12pt" face="Arial"><div style="margin-left:2px; font-size: 14pt; display: flow-root "><span style="background-color: rgba(255, 255, 255); " class="txtpenting"> {{ $raw->ttl }} </span></div></font></td>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="150" class="contoh3" align="left">
                                                <font style="font-size: 12pt;" face="Arial">
                                            Jenis Kelamin
                                            </font>
                                            <td>:</td>
                                            <td width="700"><font style="font-size: 12pt" face="Arial"><div style="margin-left:2px; font-size: 14pt; display: flow-root "><span style="background-color: rgba(255, 255, 255); " class="txtpenting"> {{ $raw->jeniskelamin }} </span></div></font></td>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="150" class="contoh3" align="left">
                                                <font style="font-size: 12pt;" face="Arial">
                                            Agama
                                            </font>
                                            <td>:</td>
                                            <td width="700"><font style="font-size: 12pt" face="Arial"><div style="margin-left:2px; font-size: 14pt; display: flow-root "><span style="background-color: rgba(255, 255, 255); " class="txtpenting"> {{ $raw->agama }} </span></div></font></td>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="150" class="contoh3" align="left">
                                                <font style="font-size: 12pt;" face="Arial">
                                            Warga Negara
                                            </font>
                                            <td>:</td>
                                            <td width="700"><font style="font-size: 12pt" face="Arial"><div style="margin-left:2px; font-size: 14pt; display: flow-root "><span style="background-color: rgba(255, 255, 255); " class="txtpenting"> {{ $raw->namanegara }} </span></div></font></td>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="150" class="contoh3" align="left">
                                                <font style="font-size: 12pt;" face="Arial">
                                            Pekerjaan
                                            </font>
                                            <td>:</td>
                                            <td width="700"><font style="font-size: 12pt" face="Arial"><div style="margin-left:2px; font-size: 14pt; display: flow-root "><span style="background-color: rgba(255, 255, 255); " class="txtpenting"> {{ $raw->pekerjaan }} </span></div></font></td>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="150" class="contoh3" align="left">
                                                <font style="font-size: 12pt;" face="Arial">
                                            Alamat
                                            </font>
                                            <td>:</td>
                                            <td width="700"><font style="font-size: 12pt" face="Arial"><div style="margin-left:2px; font-size: 14pt; display: flow-root "><span style="background-color: rgba(255, 255, 255); " class="txtpenting"> {{ $raw->alamat }} </span></div></font></td>
                                            </td>
                                        </tr>
                                        </p>
                                    </table>  
                                </td>
                            </tr>
                            <tr>
                                <td bordercolor="#808080" height="13" >
                                    <table cellspacing="0" cellpadding="0" border="0" width="100%" height="20%">
                                        <tbody>
                                        <tr>
                                        <td width="120" align="left">
                                            @php
                                        $exper = explode('~',$raw->kllprint);
                                        //dd($exper);
                                        $datas =[];
                                        foreach ($exper as $r){
                                            $datas [] = array(
                                                'ket' =>(string)  $r
                                            );
                                        }
                                    // dd($datas);
                        
                                    @endphp
                                    <div style="text-align: left;font-size: 14pt; text-align: justify;" face="Arial">
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
                                    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top:3%;">
                                        <tbody>
                                        <tr>
                                            <td width="120" align="justify" class="contoh3">
                                                <font style="font-size: 14pt;" face="Arial">
                                                    <div style="margin-left:2px; font-size: 14pt; display: flow-root "><span style="background-color: rgba(255, 255, 255); " class="txtpenting">Demikianlah Visum et Repertum ini saya buat dengan sebenarnya dan menggunakan keilmuan saya yang
                                                        sebaik-baiknya, mengingat sumpah sesuai dengan Kitab Undang-Undang Hukum Acara Pidana.
                                                    </span></div>
                                            </font>
                                            </td>
                                        </tr>
                                    </table>        
                                </td>
                            </tr>
                            <tr>
                                <td bordercolor="#808080" height="13">
                                    <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-top: 0px;">
                                        <tbody>
                                        <tr>
                                            <td style="text-align: right">
                                            <br><br><br>
                                                <font style="font-size: 14pt;" face="Arial">
                                            Dokter tersebut di atas
                                            </font>
                                            <br><br><br><br>
                                                <font style="font-size: 14pt; margin-left: 30px;" face="Arial">
                                            {{ $raw->dokter }}
                                            </font>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bordercolor="#808080" height="13">
                                    <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-top: 0px;">
                                        <tbody>
                                        <tr>
                                            <td style="text-align: right">
                                            <br><br><br>
                                                <font style="font-size: 14pt;" face="Arial">
                                            {{ $raw->mengetahuikonsulen }}
                                            </font>
                                            <br>
                                                <font style="font-size: 14pt; margin-left: 30px;" face="Arial">
                                            {{ $raw->formatkonsulen }}
                                            </font>
                                            <br><br><br>
                                            <font style="font-size: 14pt; margin-left: 30px;" face="Arial">
                                                {{ $raw->konsulen }}
                                                </font>
                                            <br>
                                            
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bordercolor="#808080" height="13">
                                    <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-top: 0px;">
                                        <tbody>
                                        <tr>
                                            <td style="text-align: right">
                                                <font style="font-size: 14pt; margin-left: 30px;" face="Arial">
                                            {{ $raw->formatkonsulen2 }}
                                            </font>
                                            <br><br><br><br>
                                            <font style="font-size: 14pt; margin-left: 30px;" face="Arial">
                                                {{ $raw->konsulen2 }}
                                                </font>
                                            <br>
                                            
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td bordercolor="#808080" height="13">
                                    <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-top: 0px;">
                                        <tbody>
                                        <tr>
                                            <td style="text-align: right">
                                                <font style="font-size: 14pt; margin-left: 30px;" face="Arial">
                                            {{ $raw->formatkonsulen3 }}
                                            </font>
                                            <br><br><br><br>
                                            <font style="font-size: 14pt; margin-left: 30px;" face="Arial">
                                                {{ $raw->konsulen3 }}
                                                </font>
                                            <br>
                                            
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                    </tbody>
                </table>
                
              </p>
            </div>
          </td>

        </tr>

      </tbody>
    </table>
  </div>
</body>
</html>