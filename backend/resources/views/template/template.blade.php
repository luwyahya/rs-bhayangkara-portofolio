\<html>
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
    <table class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="{{$pageWidth}}">
      <tbody>
        <tr>
          <td style="padding: 30px">
            <div align="center">
              <p align="right">
                <!--                        <a href="#"><font face="Arial"><img src="image/report_print.png" onclick="window.print()" height="40" border="0" width="39"></font></a>-->
                <!--                        <a href="#"><font face="Arial"><img src="image/report_pdf.png" height="40" border="0" width="39"></font></a>-->
                <!--                        <a href="#"><font face="Arial"><img src="image/report_close.png" onclick="window.close()" height="40" border="0" width="39"></font></a>-->
                <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" height="133" border="0" width="100%" style="text-align: center">
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
                                  <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tbody>
                                      <tr>
                                        <td width="105">
                                          <p align="left">
                                            <!-- <img src="{{ asset('/img/logo.jpg') }}" style="width: 80px" border="0"> -->
                                              <img src="{{ asset('service/img/logo.jpg') }}" style="width: 120px" border="0">
                                             <!-- ‘service/img/namagambar’ -->
                                          </p>
                                        </td>
                                        <td align="center">
                                         
                                          <b>
                                            <font style="font-size: 18pt" color="#000000">RS BHAYANGKARA TK IV CIANJUR</font>
                                            <br>
                                          </b>
                                          <font size="3" color="#000000" style="font-weight: bold">Jl. Suroso, Solokpandan, Kec. Cianjur, Kabupaten Cianjur, Jawa Barat 43211<font>

{{--                                          <font style="font-size: 11pt" color="#000000"> : Jl. Ir. Djuanda No. 106 Km. 2--}}
{{--                                            Rancabango Kota--}}
{{--                                            Tasikmalaya<br>--}}
{{--                                            TAHUN AKADEMIK {{ $thn }}</font>--}}
                                        </td>
                                      </tr>
                                      <tr>
                                        <td width="105">&nbsp;</td>
                                        <td>&nbsp;</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
  <div style="margin-top: -10px">
    <hr style="border:1px solid #000;margin-bottom:0px;border-style: solid">
    <hr style="border:0.5px solid #000;margin-top:2px">
  </div>
                      </td>
                    </tr>


                    @include('template.content')
    @include('template.footer')

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
