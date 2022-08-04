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
                                <td valign="top"></td>
                              </tr>
                              <tr>
                                <td valign="top">
                                  <table  cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tbody>
                                    
                                    <td align="center">
                                    <img src="{{ asset('img/Lambang_Polri.png') }}" style="width: 80px; " border="0">
                                    <br>
                                        <b>
                                            <font style="font-size: 14pt; " color="#000000">RUMAH SAKIT BHAYANGKARA TK.I R SAID SUKANTO</font>
                                        <br>
                                        </b>
                                        <b>
                                            <font style="font-size: 14pt; " color="#000000">INSTALASI KEDOKTERAN FORENSIK</font>
                                        <br>
                                        </b>
                                        <font style="font-size: 12pt; " color="#000000">Jl. Raya Bogor, Kramat Jati, Jakarta 13510</font>
                                    </td>
                                    
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
  <div style="margin-top: -10px; margin-right: 350px;">
  </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br><br><br>
                @include('forensiktemplate.content2')
                
              </p>
            </div>
          </td>

        </tr>

      </tbody>
    </table>
  </div>
</body>
</html>
