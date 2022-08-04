<html>
<head>
    <title>
        Report
    </title>
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
</head>
<style>
    tr td {
        padding: 1px 2px 1px 2px;
    }
</style>
<body style="background-color: #CCCCCC">
<div align="center">
    <table class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="{{$pageWidth}}">
        <tbody>
        <tr>
            <td style="padding: 30px">
                <div align="center">


                    </div>
                </td>
            </tr>

        <tr>
            <td bordercolor="#808080" height="13">
                <font style="font-size: 11pt" face="Arial" color="#000000">
                        <span style="font-weight: 700">
                            KEGIATAN RAWAT INAP
                        </span>
                    <p> Bulan : {{ $r['bulan'] }}</p>
                </font>
            </td>
        </tr>
        <tr>
             <td bordercolor="#808080" height="13"></td>
        </tr>

        <tr>
         <td bordercolor="#808080" height="13"></td>
        </tr>
         <tr>
        <td bordercolor="#808080" height="13">
            <table style="border-collapse: collapse" cellspacing="0" cellpadding="0" bordercolor="#000000" border="1" width="100%">
                <tbody>
                <tr>
                    <td  bgcolor="#666666" align="center" height="25" width="20%">
                        <font style="font-size: 9pt" face="Arial" color="#FFFFFF"><b>URAIAN</b></font>
                    </td>

                    @foreach($ruangan as $ru)
                        <td bgcolor="#666666" align="center" height="25" width="1%">
                            <font style="font-size: 9pt" face="Arial" color="#FFFFFF"><b>
                                    {{ $ru->namaruangan }}</b>
                            </font>
                        </td>
                    @endforeach
                </tr>
                @php

                    $mhs= [];
                @endphp
{{--                @foreach ($mhs as $key => $value)--}}
                    <tr>
                        <td align="center">
                            <font style="font-size: 8pt" face="Arial" color="#000000"> Awal</font>
                        </td>
                        @foreach($ruangan as $ru)
                            <td align="center">
                                <font style="font-size: 8pt" face="Arial" color="#000000">
                                    {{ \App\Http\Controllers\Report\ReportController::getPasienAwal($ru->id,$r['bulan'],$r['kdprofile']) }}</font>
                            </td>
                        @endforeach
{{--                        <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; {{$value->nim}}</td></td>--}}
{{--                        <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; {{$value->nama_lengkap}}</td></td>--}}


{{--                        @php--}}
{{--                            $jmlhadir =0;--}}
{{--                            $jmlsakit =0;--}}
{{--                            $jmlijin =0;--}}
{{--                            $jmlalpa =0;--}}
{{--                            $jmlkerja =0;--}}
{{--                        @endphp--}}
{{--                        @foreach ($value->detail as $keys => $details)--}}
{{--                            @if($details['ket'] =='v')--}}
{{--                                @php--}}
{{--                                    $jmlhadir = $jmlhadir + 1;--}}
{{--                                @endphp--}}
{{--                            @elseif($details['ket'] =='s')--}}
{{--                                @php--}}
{{--                                    $jmlsakit = $jmlsakit + 1;--}}
{{--                                @endphp--}}
{{--                            @elseif($details['ket'] =='a')--}}
{{--                                @php--}}
{{--                                    $jmlalpa = $jmlalpa + 1;--}}
{{--                                @endphp--}}
{{--                            @elseif($details['ket'] =='i')--}}
{{--                                @php--}}
{{--                                    $jmlijin= $jmlijin + 1;--}}
{{--                                @endphp--}}
{{--                            @elseif($details['ket'] =='k')--}}
{{--                                @php--}}
{{--                                    $jmlkerja= $jmlkerja + 1;--}}
{{--                                @endphp--}}
{{--                            @endif--}}

{{--                            <td style='background-color: {{$details['warna']}} ' align='center'>{{$details['ket'] }}</td>--}}
{{--                        @endforeach--}}

{{--                        @if($jmlhadir == 0)--}}
{{--                            @php--}}
{{--                                $jmlhadir ='';--}}
{{--                            @endphp--}}
{{--                        @endif--}}
{{--                        @if($jmlsakit == 0)--}}
{{--                            @php--}}
{{--                                $jmlsakit ='';--}}
{{--                            @endphp--}}
{{--                        @endif--}}
{{--                        @if($jmlijin == 0)--}}
{{--                            @php--}}
{{--                                $jmlijin ='';--}}
{{--                            @endphp--}}
{{--                        @endif--}}
{{--                        @if($jmlalpa == 0)--}}
{{--                            @php--}}
{{--                                $jmlalpa ='';--}}
{{--                            @endphp--}}
{{--                        @endif--}}
{{--                        @if($jmlkerja == 0)--}}
{{--                            @php--}}
{{--                                $jmlkerja ='';--}}
{{--                            @endphp--}}
{{--                        @endif--}}

{{--                        <td align="center">{{$jmlhadir}}</td>--}}
{{--                        <td align="center">{{$jmlsakit}}</td>--}}
{{--                        <td align="center">{{$jmlijin}}</td>--}}
{{--                        <td align="center">{{$jmlalpa}}</td>--}}
{{--                        <td align="center">{{$jmlkerja}}</td>--}}

                    </tr>
{{--                @endforeach--}}

                </tbody>
            </table>

        </td>
        </tr>
    </tbody>
    </table>

</div>
</body>
</html>

