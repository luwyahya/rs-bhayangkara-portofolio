<html>
<head>
    <title>
        Report
    </title>
    <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
</head>
<style type="text/css" media="print">
    @media print
    {
        @page
        {
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
    .borderss{
        border-bottom: 1px solid black;
    }
    body{
        font-family: Tahoma, Geneva, sans-serif;
    }
</style>
{{----}}
<body style="background-color: #CCCCCC;margin: 0" onLoad="window.print()">
    <div align="left">
        <table  cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="365">
            <tbody>
            <tr>
                <td style="padding: 30px;text-align: left">
                    <font style="font-size: 11pt;" color="#000000" face="Tahoma"><b>{{$dataReport['namaprofile']}}</b></font><br>
                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['alamat']}}</font><br>
                    <hr style="margin-top: 6px;"/><hr />
                    <table  cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="365">
                        <tr>
                            <td  style="text-align: left">
                                <font style="font-size: 12pt;text-align: left;" face="Tahoma">Tanggal : {{$dataReport['tanggal']}}</font>
                            </td>
                        </tr>
                        <tr>
                            <td  style="text-align: left">
                                <font style="font-size: 12pt;text-align: left;" face="Tahoma">&nbsp;</font>
                            </td>
                        </tr>
                        <tr>
                            <td  style="text-align: left">
                                <font style="font-size: 21t;text-align: left;" face="Tahoma"><b>Nomor Antrian :</b></font>
                            </td>
                        </tr>
                        <tr>
                            <td  style="text-align: center">
                                <font style="font-size: 21pt;text-align: left;" face="Tahoma"><b>{{$dataReport['noantrian']}}</b></font>
                            </td>
                        </tr>
                        <tr>
                            <td  style="text-align: left">
                                <font style="font-size: 21t;text-align: left;" face="Tahoma"><b>{{$dataReport['jenis']}}</b></font>
                            </td>
                        </tr>
                        <tr>
                            <td  style="text-align: left">
                                <font style="font-size: 12pt;text-align: left;" face="Tahoma">&nbsp;</font>
                            </td>
                        </tr>
                        <tr>
                            <td  style="text-align: left">
                                <font style="font-size: 9t;text-align: left;" face="Tahoma">
                                    Silahkan menunggu nomor Anda dipanggil <br/>
                                    Antrian yang belum dipanggil {{$dataReport['jmlantrian']}} Orang</font>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    </body>
</html>