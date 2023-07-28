<html>

<head>
    <title>
        Report
    </title>
    <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
</head>
<style type="text/css" media="print">
    @media print {
        @page {
            size: auto;
            margin: 0;
            /* size: portrait; */
        }

        footer {
            display: none
        }

        header {
            display: none
        }

        body {
            -webkit-print-color-adjust: exact !important;
        }
    }

    tr td {
        /*padding:2px 4px 2px 4px;*/
    }

    .borderss {
        border-bottom: 1px solid black;
    }

    body {
        font-family: Tahoma, Geneva, sans-serif;
    }
</style>
{{----}}

<body style="background-color: #CCCCCC;margin: 0" onLoad="window.print()">
    <div align="left">
        <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="365">
            <tbody>
                <tr>
                    <td style="padding: 30px;text-align: left">
                        <font style="font-size: 12pt;" color="#000000" face="Tahoma"><b>{{$dataReport['namaprofile']}}</b></font><br>
                        <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['alamat']}}</font><br>
                        <hr style="margin-top: 6px;" />
                        <font style="font-size: 12pt;" color="#000000" face="Tahoma"><b>No Antrian : {{$dataReport['noantrian']}}</b></font><br />
                        <hr />
                        <table ccellspacing="0" cellpadding="0" border="0" width="100%" align="center">
                            <tr>
                                <td height="5" width="30%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">Tgl Registrasi</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="68%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">{{$dataReport['tglregistrasi']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td height="5" width="30%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">Noregistrasi</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="68%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">{{$dataReport['noregistrasi']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td height="5" width="30%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">No Rm</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="68%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">{{$dataReport['norm']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td height="5" width="30%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">Nama Pasien</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">{{$dataReport['namapasien']}}/{{$dataReport['jeniskelamin']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td height="5" width="30%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">Jenis Pasien</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="68%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">{{$dataReport['kelompokpasien']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td height="5" width="30%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">Status Pasien</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="68%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">{{$dataReport['statuspasien']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td height="5" width="30%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">Ruangan</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="68%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">{{$dataReport['ruangan']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td height="5" width="30%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">Tgl Reservasi</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="68%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">{{$dataReport['tanggalreservasi']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td height="5" width="30%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">Petugas</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="68%">
                                    <font style="font-size: 8pt;" color="#000000" face="Tahoma">{{$dataReport['namadokter']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <table ccellspacing="0" cellpadding="0" border="0" width="100%" align="center">
                                    <tr>
                                        <td style="text-align: center">
                                            <hr />
                                            <font style="font-size: 8pt;" color="#000000" face="Tahoma">{{$dataReport['statusonline']}}</font><br />
                                            <hr />
                                            <font style="font-size: 8pt;" color="#000000" face="Tahoma">{{$dataReport['status']}}</font>
                                        </td>

                                    </tr>
                                    <tr>
                                        <td>
                                            <font style="font-size: 8pt;" color="#000000" face="Tahoma">CATATAN : SILAHKAN MELAKUKAN PEMBAYARAN DI KASIR SEBELUM KE POLIKLINIK.</font>
                                            <hr />
                                        </td>
                                    </tr>
                                </table>
                            </tr>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>