<html lang="en">

<head>
    <title>Report</title>
</head>

<style>
    body {
        font-family: Arial, Helvetica, sans-serif;
        background-color: #d3d3d3;
        margin: 0;
        padding: 0;
    }
    
    .receipt-container {
        background-color: #FFFFFF;
        width: 320px;
        margin: 20px;
        padding: 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    @media print {
        @page {
            size: 80mm auto;
            margin: 0; 
        }
        body {
            background-color: #FFFFFF;
        }
        .receipt-container {
            margin: 0;
            padding: 5px; 
            box-shadow: none;
            width: 100%;
        }
    }
</style>

<body>
    <div class="receipt-container">

    @php
    $kode = $dataReport['kode'] ?? '';
    $jenis = '';

    if ($kode == 'LU') {
    $jenis = 'Pasien Lama Umum';
    } elseif ($kode == 'B') {
    $jenis = 'Pasien Baru';
    } elseif ($kode == 'LB') {
    $jenis = 'Pasien Lama BPJS';
    } elseif ($kode == 'LA') {
    $jenis = 'Pasien Lansia & Anak';
    } elseif ($kode == 'PN') {
    $jenis = 'Pasien WNA';
    } elseif ($kode == 'RL' || $kode == 'RMJ') {
    $jenis = 'Pasien Reservasi Lama';
    } elseif ($kode == 'RA') {
    $jenis = 'Pasien Reservasi Lansia & Anak';
    } elseif ($kode == 'RB') {
    $jenis = 'Pasien Reservasi Baru';
    }
    @endphp


    @if ($jenis != '')

    <table width="250" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF"
        style="border-bottom: 2px solid black; margin-left: -30px; margin-top: -30px;">
        <tr>
            <th align="center">
                <img src="{{ asset('service/img/logodokesnew.png') }}" width="50px">
            </th>
            <th width="90%" align="center">
                <table width="100%" style="position:relative">
                    <tr>
                        <td class="label-strong" style="text-align:center; font-size: 11pt;">
                            <font>RUMAH SAKIT UMUM DAERAH<br><b>BALI MANDARA</b></font>
                        </td>
                    </tr>
                    <tr>
                        <td class="label-normal" style="text-align:center">
                            <font style="font-size: 10pt;">
                                {{ $dataReport['alamat'] ?? '' }} <br>
                                Telp. {{ $dataReport['fixedphone'] ?? '' }}&nbsp;Fax.
                                {{ $dataReport['faksimile'] ?? '' }}
                            </font>
                        </td>
                    </tr>
                </table>
            </th>
        </tr>
    </table>

    <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="250">
        <tbody>
            <tr>
                <td style="text-align: left">
                    <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0"
                        style="border-bottom: 2px solid black; margin-left: -30px;" width="250">

                        <tr>
                            <td style="text-align: center; padding-bottom: 10px; margin-top: 10px;" align="center">
                                <font style="font-size: 10pt;text-align: center;padding-bottom: 5px;">
                                    {{ $dataReport['nosep'] ?? '' }}
                                </font>
                            </td>
                        </tr>

                        <tr>
                            <td style="text-align: center">
                                <font style="font-size: 11pt;text-align: left;">
                                    {{ ucwords($dataReport['namaruangan'] ?? '') }}
                                </font>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <div style="width: 100%; text-align: center">
                                    <font style="font-size: 11pt;text-align: left;">
                                        <b>{{ ucwords($jenis) }}</b>
                                    </font>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td height="40">
                                <div style="width: 100%; text-align: center">
                                    <font style="font-size: 48pt;text-align: left;">
                                        <b>{{ $dataReport['noantrianloket'] ?? '' }}</b>
                                    </font>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <td style="text-align: center">
                                <font style="font-size: 11pt;text-align: left;">
                                    <b>{{ $dataReport['noreservasi'] ?? '' }}</b>
                                </font>
                            </td>
                        </tr>

                        @php
                        $norm = $dataReport['norm'] ?? '';
                        @endphp

                        <tr>
                            <td style="text-align: center">
                                @if ($norm != '')
                                <!-- <img src="https://barcode.tec-it.com/barcode.ashx?data={{ $norm }}&code=Code39&dpi=96&dataseparator="
                                            style="height: 50px;width: 200px;-webkit-user-select: none;cursor:pointer" /> -->
                                <!-- <img src="https://bwipjs-api.metafloor.com/?bcid=code39&text={{ $norm }}&scale=1&scaleY=1&scaleX=2"
                                          style="height: 50px;width: 200px;-webkit-user-select: none;cursor:pointer" /> -->
                                @endif
                            </td>
                        </tr>

                        <tr>
                            <td style="text-align: center" height="15"></td>
                        </tr>

                        <tr>
                            <td style="text-align: center">
                                <font style="font-size: 11pt;text-align: left;">
                                    {{ strtoupper($dataReport['namapasien'] ?? '') }}
                                </font>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </tbody>
    </table>

    <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="250">
        <tr>
            <td>
                <font style="font-size: 11pt;">
                    ANTRIAN SEBELUM ANDA {{ ($dataReport['jmlantrian'] ?? 1) - 1 }} NOMOR
                </font>
            </td>
        </tr>
        <tr>
            <td>
                <font style="font-size: 11pt;">&nbsp;</font>
            </td>
        </tr>
        <tr>
            <td>
                <font style="font-size: 9pt;"><b>
                        Apabila menggunakan BPJS atau asuransi mohon<br>
                        <span style="margin-left:7%">ke bagian pendaftaran terlebih dahulu</span>
                    </b></font>
            </td>
        </tr>
        <tr>
            <td>
                <font style="font-size: 11pt">&nbsp;</font>
            </td>
        </tr>
        <tr>
            <td style="text-align:center">
                <font style="font-size: 10pt; margin-left:-20%">-TERIMA KASIH-</font>
            </td>
        </tr>
        <tr>
            <td style="text-align: left">
                <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="250"
                    style="margin-top: 10px; margin-left:-9%">
                    <tr>
                        <td style="text-align: left" width="50%">
                            <font style="font-size: 9pt;text-align: left;">
                                {{ $dataReport['hari'] ?? '' }},
                                {{ isset($dataReport['tanggal']) ? date('d-m-Y', strtotime($dataReport['tanggal'])) : '' }}
                            </font>
                        </td>
                        <td style="text-align: right" width="50%">
                            <font style="font-size: 9pt;text-align: left;">Pukul {{ date('H:i') }}</font>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    @endif


    <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="300"
        style="margin-top: {{ $jenis != '' ? '40px' : '10px' }}; margin-left: 10px">
        <tbody>
            <tr>
                <td style="padding: -px;text-align: left">
                    <table width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                            <th>
                                <img src="{{ asset('service/img/logodokesnew.png') }}" width="50px">
                            </th>
                            <th width="90%">
                                <table width="100%" style="position:relative">
                                    <tr>
                                        <td class="label-strong"
                                            style="text-align:center; padding-left: 10px; font-size: 11pt;">
                                            <font><b>BUKTI PENDAFTARAN</b> <br> <span style="font-size: 11pt; white-space: nowrap;"><b>{{ $dataReport['namaprofile'] ?? '' }}</b></span></font>
                                        </td>
                                    </tr>
                                </table>
                            </th>
                        </tr>
                    </table>

                    <div style="border-top: 1px solid black; margin: 10px 0; width: 100%;"></div>

                    <table cellspacing="0" cellpadding="0" border="0" width="100%" align="center">
                        @php
                        $noregistrasi = $dataReport['noregistrasi'] ?? '';
                        @endphp

                        <tr>
                            <td height="10" colspan="2"></td>
                        </tr>

                        <tr>
                            <td height="5" colspan="2">
                                @if ($noregistrasi != '')
                                <!-- <img src="https://bwipjs-api.metafloor.com/?bcid=code39&text={{ $noregistrasi }}&scale=1&scaleY=1&scaleX=2"
                                        style="height: 40px;width: 200px;-webkit-user-select: none;cursor:pointer" /> -->
                                @endif
                                <span style="font-size: 10pt;" color="#000000">{{ $noregistrasi }}</span>
                            </td>
                        </tr>

                        @php
                        $hari = ['Sunday' => 'Minggu', 'Monday' => 'Senin', 'Tuesday' => 'Selasa', 'Wednesday' => 'Rabu', 'Thursday' => 'Kamis', 'Friday' => 'Jumat', 'Saturday' => 'Sabtu'];
                        $bulan = ['January' => 'Januari', 'February' => 'Februari', 'March' => 'Maret', 'April' => 'April', 'May' => 'Mei', 'June' => 'Juni', 'July' => 'Juli', 'August' => 'Agustus', 'September' => 'September', 'October' => 'Oktober', 'November' => 'November', 'December' => 'Desember'];
                        $tglStr = '';
                        if(isset($dataReport['tglregistrasi']) && $dataReport['tglregistrasi']) {
                        $timestamp = strtotime($dataReport['tglregistrasi']);
                        $dayName = $hari[date('l', $timestamp)] ?? date('l', $timestamp);
                        $monthName = $bulan[date('F', $timestamp)] ?? date('F', $timestamp);
                        $tglStr = $dayName . ', ' . date('j', $timestamp) . ' ' . $monthName . ' ' . date('Y', $timestamp);
                        }
                        @endphp
                        <tr>
                            <td height="5" colspan="2">
                                <span style="font-size: 10pt;" color="#000000">
                                    {{ $tglStr }}
                                </span>
                            </td>
                        </tr>

                        @php
                        $norm = $dataReport['norm'] ?? '';
                        @endphp

                        <tr>
                            <td height="5" colspan="2">
                                <br>
                                @if ($norm != '')
                                <!-- <img src="https://bwipjs-api.metafloor.com/?bcid=code39&text={{ $norm }}&scale=1&scaleY=1&scaleX=2"
                                        style="height: 45px;width: 170px;-webkit-user-select: none;cursor:pointer" /><br> -->
                                @endif
                                <span style="font-size: 10pt;" color="#000000">{{ $norm }}</span>
                            </td>
                        </tr>

                        <tr>
                            <td height="5" colspan="2">
                                <span style="font-size: 10pt;" color="#000000">
                                    {{ strtoupper($dataReport['namapasien'] ?? '') }}
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td height="5" colspan="2">
                                <span style="font-size: 10pt;" color="#000000">
                                    {{ $dataReport['umur'] ?? '' }}
                                </span>
                            </td>
                        </tr>
                    </table>

                    <div style="border-top: 1px solid black; margin: 10px 0; width: 100%;"></div>

                    <table cellspacing="0" cellpadding="0" border="0" width="100%" align="center">
                        <tr>
                            <td height="5" colspan="2" align="center">
                                <span style="font-size: 12pt;" color="#000000">
                                    <b>{{ $dataReport['namaruangan'] ?? '' }}</b>
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td height="5" colspan="2" align="center">
                                <span style="font-size: 11pt;" color="#000000">
                                    {{ $dataReport['namadokter'] ?? '' }}
                                </span>
                            </td>
                        </tr>

                        <tr>
                            <td height="10" colspan="2"></td>
                        </tr>

                        <tr>
                            <td height="5" colspan="2" align="center">
                                <span style="font-size: 10pt;" color="#000000">
                                    {{ $dataReport['kelompokpasien'] ?? '' }}
                                </span>
                            </td>
                        </tr>
                    </table>

                </td>
            </tr>
        </tbody>
    </table>
    </div>

    <script>
        window.onload = function() {
            window.print();
        };
    </script>
</body>

</html>

