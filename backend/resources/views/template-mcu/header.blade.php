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
  .bayangprint{
    /* background: url("/img/logorspolri.png");width:100%;
   
    height:180px;
    margin:30px 50px;
    background-color:#ffffff;
    border:1px solid black;
    opacity:0.5;
    filter:alpha(opacity=50); */
    background-image: url('/img/logorspolri.jpg');
    background-size: cover;
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
                                    <td align="center">
                                        <b>
                                            <font style="font-size: 14pt; margin-right: 340px;" color="#000000">PUSAT KEDOKTERAN DAN KESEHATAN POLRI</font>
                                        <br>
                                        </b>
                                        <b>
                                            <font style="font-size: 14pt; margin-right: 340px;" color="#000000">RUMAH SAKIT BHAYANGKARA TK.I R SAID SUKANTO</font>
                                        <br>
                                        </b>
                                        <font style="font-size: 12pt; margin-right: 340px;" color="#000000">JL. RAYA BOGOR, KRAMAT JATI, JAKARTA TIMUR 13510</font>
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
                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tbdody>
                        <tr>
                            <td width="125">
                                <p align="left">
                                    <img src="{{ asset('img/Lambang_Polri.png') }}" style="width: 80px; margin-left: 380px; margin-top: 20px;" border="0">
                                </p>   
                            </td>
                        </tr>
                        @include('template-mcu.content')
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
