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
    margin-top: -50px;
    margin-bottom: 0px;
    margin-left: 0px;
    margin-right: 0px;
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
    background: url("/img/logorspolri.jpg") no-repeat;
  }
</style>
<body style="background-color: #FFFFFF">
  <div align="center">
    <table class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0">
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
                                <td valign="top"></td>
                              </tr>
                              <tr>
                                <td valign="top">
                                  <table  cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tbody>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tbody>
    <tr>
        <td bordercolor="#808080" height="13" >
            <table cellspacing="0" cellpadding="0" border="0" width="90%">
                <tbody>
                <tr>
                    <td width="120" align="justify">
                    <font style="font-size: 14pt; face="Arial">
                    <b>To Whom it May Concern,
                    </b>
                    </font><br>
                    <font style="font-size: 14pt; face="Arial">
                    <i>Kepada yang berkepentingan,
                    </i>
                    </font>
                    </td>
                </tr>
            </table>        
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13" >
            <table cellspacing="0" cellpadding="0" border="0" width="90%">
                <tbody>
                <tr>
                    <td width="120" align="justify">
                    <font style="font-size: 14pt; face="Arial">
                    <b>This laboratory/health institution Rumah Sakit Bhayangkara TK I R. Said Sukanto
                    </b>
                    </font><br>
                    <font style="font-size: 14pt; face="Arial">
                    <i>Laboratorium/institusi kesehatan ini, yaitu Rumah Sakit Bhayangkara TK I R. Said Sukanto
                    </i>
                    </font>
                    </td>
                </tr>
            </table>        
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13"></td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13" >
            <table cellspacing="0" cellpadding="0" border="0" width="90%">
                <tbody>
                <tr>
                    <td width="120" align="justify">
                    <font style="font-size: 14pt; face="Arial">
                    <b>as a laboratory/health institution recognised or approved by the Government of the Republic of Indonesia hereby 
                        certifies that the following named person has a negative SARS-CoV-2 nucleic acid test.
                    </b>
                    </font><br>
                    <font style="font-size: 14pt; face="Arial">
                    <i>Sebagai institusi kesehatan yang diakui oleh Pemerintah Republik Indonesia dengan ini menyatakan bahwa orang dengan identitas 
                        di bawah ini telah melakukan tes nucleid acid SARS-CoV-2 (Covid-19) dengan hasil negatif.
                    </i>
                    </font>
                    </td>
                </tr>
            </table>        
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13" >
            <table cellspacing="0" cellpadding="0" border="0" width="90%">
                <tbody>
                <tr>
                    <td width="120" align="justify">
                    <font style="font-size: 14pt; face="Arial">
                    <b>Details are as follows:
                    </b>
                    </font><br>
                    <font style="font-size: 14pt; face="Arial">
                    <i>Detail sebagai berikut:
                    </i>
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
                    <td width="330">
                        <font style="font-size: 14pt;  face="Arial">
                    <b>Name of person tested</b>
                    </font><br>
                    <font style="font-size: 14pt;  face="Arial">
                    <i>Nama yang menjalani tes</i>
                    </font>
                    <td><b>:</b></td>
                    <td width="600"><font style="font-size: 14pt" face="Arial"> {{ $raw->namapasien }} </font></td>
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
                    <td width="330">
                        <font style="font-size: 14pt;"  face="Arial">
                    <b>Number Passport</b>
                    </font><br>
                    <font style="font-size: 14pt;  face="Arial">
                    <i>Nomor Paspor</i>
                    </font>
                    <td><b>:</b></td>
                    <td width="600"><font style="font-size: 14pt" face="Arial"> {{ $raw->nopasspor }} </font></td>
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
                    <td width="330">
                        <font style="font-size: 14pt;  face="Arial">
                    <b>Date and time of specimen collection</b>
                    </font><br>
                    <font style="font-size: 14pt;  face="Arial">
                    <i>Tanggal dan waktu pengambilan specimen</i>
                    </font>
                    <td><b>:</b></td>
                    <td width="600"><font style="font-size: 14pt" face="Arial">{{ App\Traits\Valet::getBulanAngka($raw->tglregistrasi).' '.substr($raw->tglregistrasi,11,8)   }} / {{ App\Traits\Valet::getBulanAngka($raw->tglambil).' '.substr($raw->tglambil,11,8)   }} </font></td>
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
                    <td width="330">
                        <font style="font-size: 14pt;  face="Arial">
                    <b>Test Conducted</b>
                    </font><br>
                    <font style="font-size: 14pt;  face="Arial">
                    <i>Jenis tes yang dilakukan</i>
                    </font>
                    <td><b>:</b></td>
                    <td width="600"><font style="font-size: 14pt" face="Arial"> <b>SARS-CoV-2 nucleic acid test</b> </font></td>
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
                    <td width="340">
                        <font style="font-size: 14pt;  face="Arial">
                    <b>Result</b>
                    </font><br>
                    <font style="font-size: 14pt;  face="Arial">
                    <i>Hasil</i>
                    </font>
                    <td><b>:</b></td>
                    <td width="600"><font style="font-size: 14pt" face="Arial"> <b>Negative</b> </font></td>
                    </td>
                </tr>
            </table>  
        </td>
    </tr>
      
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-top: 170px;">
                <tbody>
                <tr>
                    <td style="text-align: center">
                        <font style="font-size: 14pt; margin-left:400px;" face="Arial">
                    Jakarta, {{ App\Traits\Valet::getDateInggris(date('Y-m-d'))   }}
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
                    <br><br><br>
                        <font style="font-size: 14pt; margin-left:400px;" face="Arial">
                    <u>{{ $raw->namadokter }}</u>
                    </font>
                    <br>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center">0
                        <font style="font-size: 14pt; margin-left:400px;" face="Arial">
                    {{ $raw->nippns }}
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
