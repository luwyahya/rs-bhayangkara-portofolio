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

    .rotated {
        transform: rotate(90deg);
    }
</style>
{{----}}

<body style="background-color: #CCCCCC;margin: 0" onLoad="window.print();setTimeout('window.close()',10000);return false;" >
    <div align="left" class="rotated">
        <table class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="{{$pageWidth}}">
            <tbody>
                <tr>
                    <td width="2%"></td>
                    <td width="16%">
                        <p align="left">
                            <img src="{{ asset('service/img/logo_bpjs.png') }}" style="width: 200px" border="0" />
                        </p>
                    </td>
                    <td width="82%">
                        <p align="center">
                            <br />
                            <font style="font-size: 12pt;" color="#000000" face="Tahoma"><b>SURAT ELIGIBILITAS PESERTA</b></font><br>
                            <font style="font-size: 12pt;" color="#000000" face="Tahoma"><b>{{$dataReport['namaprofile']}}</b></font><br>
                            <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['alamat']}}</font><br>
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="{{$pageWidth}}" style="margin-top: -25px">
            <tbody>
                <tr>
                    <td style="padding: 30px;text-align: left">
                        <table ccellspacing="0" cellpadding="0" border="0" bgcolor="#FFFFFF" width="100%" align="left">
                            <tr>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">No SEP</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['nosep']}}</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">No RM</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['norm']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">Tgl SEP</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['tanggalsep']}}</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">No Pendaftaran</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['noregistrasi']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">No Kartu</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['nokepesertaan']}}</font>
                                </td>


                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">Jenis Peserta</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['jenispeserta']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">Nama Peserta</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['namapeserta']}}</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">COB</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['cob']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">Tgl Lahir</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['tgllahir']}}</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">Jenis Rawat</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['jenisrawat']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">Jenis Kelamin</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['jeniskelamin']}}</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">Kelas Rawat</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['namakelas']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">Poli/ Ruangan Tujuan</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['namaruangan']}}</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">Pasien/ Keluarga Pasien</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">Petugas Bpjs Kesehatan</font>
                                </td>
                            </tr>
                            <tr>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">Asal Faskes TK I</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['nmprovider']}}</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;text-align: left;" face="Tahoma">No. Antrian</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;text-align: left;" face="Tahoma">{{$dataReport['noantrian']}}</font>
                                </td>
                            </tr>
                            <tr>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">Diagnosa Awal</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['namadiagnosa']}}</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 12pt;text-align: left;" face="Tahoma">&nbsp;</font>
                                </td>
                                <td height="5" width="2%">
                                    <font style="font-size: 12pt;text-align: left;" face="Tahoma">&nbsp;</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 12pt;text-align: left;" face="Tahoma">&nbsp;</font>
                                </td>
                            </tr>
                            <tr>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">Catatan</font>
                                </td>
                                <td height="5" width="2%">
                                    <font size="1">:</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['catatan']}}</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 12pt;text-align: left;" face="Tahoma">_________________</font>
                                </td>
                                <td height="5" width="2%">
                                    <font style="font-size: 12pt;text-align: left;" face="Tahoma">&nbsp;</font>
                                </td>
                                <td height="5" width="24%">
                                    <font style="font-size: 12pt;text-align: left;" face="Tahoma">_________________</font>
                                </td>
                            </tr>
                            <tr>
                                <table ccellspacing="0" cellpadding="0" border="0" bgcolor="#FFFFFF" width="100%" align="left">
                                    <tr>
                                        <td height="5" width="100%">
                                            <font style="font-size: 10pt;" color="#000000" face="Tahoma">*Saya Menyetujui BPJS Kesehatan menggunakan informasi Medis Pasien jika diperlukan.</font><br />
                                            <font style="font-size: 10pt;" color="#000000" face="Tahoma">*SEP bukan sebagai bukti penjaminan peserta</font><br />
                                            <font style="font-size: 10pt;" color="#000000" face="Tahoma">Cetakan Ke 1 {{$dataReport['tanggal']}}</font><br />
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