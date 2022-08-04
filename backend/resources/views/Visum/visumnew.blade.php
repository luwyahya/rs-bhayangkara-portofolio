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
    background-image: url('/img/logorspolri.png');
    background-size: cover;
    background-repeat: round;
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
                    <tbody>
                            <tr>
                                <td bordercolor="#808080" height="13">
                                    <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <tbody>
                                        <p>
                                        <br>
                                        <tr>
                                            <td width="225" class="contoh3" align="left">
                                                <font style="font-size: 12pt;" face="Arial">
                                                        No Surat Visum
                                            </font>
                                            <td>:</td>
                                            <td width="700"><font style="font-size: 12pt;" face="Arial" > {{ $raw->nosurat }} </font></td>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="225" class="contoh3" align="left">
                                                <font style="font-size: 12pt;" face="Arial">
                                                       Tanggal Keluar Hasil
                                            </font>
                                            <td>:</td>
                                            <td width="700"><font style="font-size: 12pt" face="Arial"> {{ App\Traits\Valet::getDateIndo($raw->tglhasil).' '.substr($raw->tglhasil,1,0)   }} </font></td>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="225" class="contoh3" align="left">
                                                <font style="font-size: 12pt;" face="Arial">
                                            No Surat Permintaan Visum
                                            </font>
                                            <td>:</td>
                                            <td width="700"><font style="font-size: 12pt" face="Arial"> {{ $raw->nosuratpermintaan }} </font></td>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="225" class="contoh3" align="left">
                                                <font style="font-size: 12pt;" face="Arial">
                                            Asal Permintaan Visum
                                            </font>
                                            <td>:</td>
                                            <td width="700"><font style="font-size: 12pt" face="Arial"> {{ $raw->permintaan }} </font></td>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width="225" class="contoh3" align="left">
                                                <font style="font-size: 12pt;" face="Arial">
                                            Tanggal Permintaan Visum
                                            </font>
                                            <td>:</td>
                                            <td width="700"><font style="font-size: 12pt" face="Arial"> {{ App\Traits\Valet::getDateIndo($raw->tglpermintaan).' '.substr($raw->tglpermintaan,1,0)   }} </font></td>
                                            </td>
                                        </tr>
                                        </p>
                                    </table>  
                                </td>
                            </tr>
                            <tr>
                                <td bordercolor="#808080" height="13" >
                                    <table cellspacing="0" cellpadding="0" border="0" width="75%" style="margin-top:3%;">
                                        <tbody>
                                        <tr>
                                            <td width="120" align="center" class="contoh3">
                                                <font style="font-size: 14pt;" face="Arial">
                                                    <p><b>
                                                      BAHWA BENAR HASIL PEMERIKSAAN VISUM INI DIKELUARKAN DARI RUMAH SAKIT BHAYANGKARA TK. I R. SAID SUKANTO. TANGGAL {{ App\Traits\Valet::getDateIndo($raw->tglhasil).' '.substr($raw->tglhasil,1,0)   }}
                                                    </b>
                                                    </p>
                                            </font>
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
