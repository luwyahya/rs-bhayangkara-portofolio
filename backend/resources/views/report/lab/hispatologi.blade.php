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
        font-family: Tahoma, Geneva, sans-serif;
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
                                                        <img src="{{ asset('service/img/logo_rsud.png') }}"
                                                             style="width: 80px" border="0"/>
                                                    </p>
                                                 </td>
                                                <td align="center" >
                                                    <div style="margin-left: -80px">
                                                    <b>
                                                        <font style="font-size: 14pt" color="#000000">LABORATORIUM PATOLOGI ANATOMIK</font>
                                                        <br>
                                                    </b>
                                                        <font style="font-size: 12pt" color="#000000">Rumah Sakit Umum Daerah Cibinong</font>
                                                        <br>
                                                    <font size="3" color="#000000">
                                                        Jln. KSR Dadi Kusmayadi No. 27, Cibinong - 16914
                                                        <br>
                                                        Telp. (021) 8753487 - Fax. (021) 87906194
                                                       <font>
                                                    </div>
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

</td>
</tr>
    <tr>

        <td style="border-top:1px solid #000;border-bottom:1px solid #000;border-width: medium">
            <font style="font-size: 11pt"  color="#000000">
                    <span style="font-weight: 700;font-size: 12pt">
                        HASIL PEMERIKSAAN {{ $r['jenis'] =='his'? 'HISTOPATOLOGI' : 'SITOLOGI' }}
                    </span>
            </font>
        </td>

    </tr>
    <tr>
        <td bordercolor="#808080" height="13"></td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                <tbody valign="top">
                <p style="text-align: left;font-weight: bold"> DATA REGISTRASI</p>
                <tr>
                    <td height="25"  width="15%">
                        <font style="font-size: 10pt" >No. Rekam Medik</font>
                    </td>
                    <td >:</td>
                    <td height="25"  width="30%"><font style="font-size: 10pt" > {{ $raw->nocm }}</font></td>
                    <td height="25" width="16%">
                        <font style="font-size: 10pt" >No. PA</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 10pt" >{{ $raw->nomorpa  }}  </font></td>

                </tr>
                <tr>
                    <td height="25" width="82">
                        <font style="font-size: 10pt" >Tanggal Terima</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font style="font-size: 10pt" >{{   $raw->tglterima }} </font></td>


                    <td height="25" width="15%">
                        <font style="font-size: 10pt" >Nama Pasien</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 10pt" >{{   $raw->namapasien  }}</font></td>

                </tr>
                <tr>
                    <td height="25" width="92">
                        <font style="font-size: 10pt" >Tanggal Jawab</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font style="font-size: 10pt" >{{ $raw->tgljawab  }} </font></td>

                    <td height="25" width="105">
                        <font style="font-size: 10pt" >Jenis Kelamin / Umur</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 10pt" >{{  $raw->umur }} </font></td>

                </tr>
                <tr>
                    <td height="25" width="82">
                        <font style="font-size: 10pt" >Pembayaran</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font style="font-size: 10pt" >{{ $raw->kelompokpasien   }} </font></td>

                    <td height="25" width="105">
                        <font style="font-size: 10pt" >Alamat</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 10pt" >{{  $raw->alamatlengkap }} </font></td>

                </tr>

                <tr>
                    <td height="25" width="92">
                        <font style="font-size: 10pt" >Dokter Pengirim</font>
                    </td>
                    <td>:</td>
                    @php 
                        if (empty($raw->dokterluar)) {
                            $dokterPengirim = $raw->namadokterpengirim;
                        }
                        else {
                            $dokterPengirim = $raw->dokterluar;
                        }
                    @endphp
                    <td height="25" width="401"><font style="font-size: 10pt" >{{ $dokterPengirim }} </font></td>
                    <td height="25" width="105">
                        <font style="font-size: 10pt" >Ruangan</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 10pt" > {{ $raw->asal }}</font></td>

                </tr>
{{--                <tr>--}}
{{--                    <td height="25" width="92">--}}
{{--                        <font style="font-size: 10pt" >Asal Rujukan</font>--}}
{{--                    </td>--}}
{{--                    <td>:</td>--}}
{{--                    <td height="25" width="401"><font style="font-size: 10pt" >{{ $raw->asalrujukan }} </font></td>--}}


{{--                </tr>--}}
                <tr>
                    <td height="25" width="92">
                        <font style="font-size: 10pt" >Topografi</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font style="font-size: 10pt" >{{  $raw->topografi   }} </font></td>
                    <td height="25" width="105">
                        <font style="font-size: 10pt" >Morfologi</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 10pt" >{{ $raw->morfologi  }}  </font></td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>

    <tr>
        <td>
            <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 20px">
                <tbody valign="top" style="font-size: 10pt">
                <tr>
                    <td height="25" width="25%">
                       <b> DIAGNOSIS KLINIK</b>
                    </td>
                    <td>:</td>
                    <td height="35">
                        {{ $raw->diagnosaklinik  }}
                    </td>
                </tr>
                <tr>
                    <td height="25" >
                        <b>  KETERANGAN KLINIK</b>
                    </td>
                    <td>:</td>
                    <td height="35">
                        {{ $raw->keteranganklinik  }}
                    </td>
                </tr>
              @if($r['jenis'] =='his' &&  $raw->diagnosapb !=null)
                <tr>
                    <td height="25" >
                       <b> DIAGNOSIS PB</b>
                    </td>
                    <td>:</td>
                    <td height="35"> {{ $raw->diagnosapb  }}
                    </td>
                </tr>
                <tr>
                    <td height="25">
                        <b>KETERANGAN PB</b>
                    </td>
                    <td>:</td>
                    <td height="35"> {{ $raw->keteranganpb  }}
                    </td>
                </tr>
                @endif
                <tr>
                    <td height="25" >
                        <b> MAKROSKOPIK</b>
                    </td>
                    <td>:</td>
                    <td height="90">
                         {!!  nl2br(str_replace('~','<br/>',$raw->makroskopik )) !!}
                    </td>
                </tr>
                <tr>
                    <td height="25">
                        <b> MIKROSKOPIK</b>
                    </td>
                    <td>:</td>
                    <td height="90">
                        {!! nl2br(str_replace('~','<br/>',$raw->mikroskopik )) !!}
                    </td>
                </tr>
                <tr>
                    <td height="25" >
                        <b> KESIMPULAN</b>
                    </td>
                    <td>:</td>
                    <td height="90">
                      {!!  nl2br(str_replace('~','<br/>',$raw->kesimpulan ))!!}
                    </td>
                </tr>
                <tr>
                    <td height="25" >
                        <b> ANJURAN</b>
                    </td>
                    <td>:</td>
                    <td height="90">
                        {!!  nl2br(str_replace('~','<br/>',$raw->anjuran ))!!}
                    </td>
                </tr>
                </tbody>
            </table>
        </td>

    </tr>
    <tr>
        <td bordercolor="#808080" height="13"></td>
    </tr>
    <tr >
        <td>
            <table style="margin-top:15px;">
                <tr>
                    <td width="500"></td>
                </tr>
                <tr>
                    <td ></td>
                    <td style="text-align: center">
                        <font style="font-size: 10pt" >Cibinong, {{ App\Traits\Valet::getDateIndo(date('Y-m-d'))   }}</font>
                        <br>
{{--                        <font style="font-size: 10pt;" ></font>--}}
                    </td>
                </tr>
                <tr>
                    <td height="150"></td>
                    <td style="text-align: center">
                        <font  style="font-size: 10pt">
                            <u>{{  $raw->namapenanggungjawab }}</u>
                            <br>
                              {{ $raw->nosip != null? '('.$raw->nosip.')' :'-' }}
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
