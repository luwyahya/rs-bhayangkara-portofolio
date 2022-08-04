@extends('template.template')
@section('content-body')
{{--<hr>--}}

<tr>
    <td bordercolor="#808080" height="13"></td>
</tr>
<tr>

    <td bordercolor="#808080" height="13">
        <table cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0">
            <tbody>
                <tr>
                    <td height="20" width="110">
                        <font style="font-size: 11pt" face="Arial">No Radiologi</font>
                    </td>
                    <td>:</td>
                    <td height="20" width="401">
                        <font style="font-size: 11pt" face="Arial"> {{ $raw->noregistrasi }}</font></b>
                    </td>
                    <td height="20" width="105">
                        <font style="font-size: 11pt" face="Arial">No Foto</font>
                    </td>
                    <td>:</td>
                    <td height="25">
                        <font style="font-size: 11pt" face="Arial">{{ $raw->nofoto  }}</font>
                    </td>

                </tr>
                <tr>
                    <td height="20" width="110">
                        <font style="font-size: 11pt" face="Arial">No RM</font>
                    </td>
                    <td>:</td>
                    <td height="20" width="401">
                        <font style="font-size: 11pt" face="Arial">{{ $raw->nocm }} </font>
                    </td>
                    <td height="20" width="105">
                        <font style="font-size: 11pt" face="Arial">Nama</font>
                    </td>
                    <td>:</td>
                    <td height="25">
                        <font style="font-size: 11pt" face="Arial">{{ $raw->namapasien    }} </font>
                    </td>

                </tr>
                <tr>
                    <td height="20" width="82">
                        <font style="font-size: 11pt" face="Arial">Kelamin</font>
                    </td>
                    <td>:</td>
                    <td height="20" width="401">
                        <font style="font-size: 11pt" face="Arial">{{ $raw->jeniskelamin  }} </font>
                    </td>
                    <td height="20" width="105">
                        <font style="font-size: 11pt" face="Arial">Umur</font>
                    </td>
                    <td>:</td>
                    <td height="25">
                        <font style="font-size: 11pt" face="Arial">{{ $raw->umur }} </font>
                    </td>

                </tr>
                <tr>
                    <td height="20" width="82">
                        <font style="font-size: 11pt" face="Arial">No Kartu</font>
                    </td>
                    <td>:</td>
                    <td height="20" width="401">
                        <font style="font-size: 11pt" face="Arial">{{ $raw->nokepesertaan }} </font>
                    </td>
                    <td height="20" width="105">
                        <font style="font-size: 11pt" face="Arial">No SEP</font>
                    </td>
                    <td>:</td>
                    <td height="25">
                        <font style="font-size: 11pt" face="Arial">{{ $raw->nosep }} </font>
                    </td>

                </tr>
                <tr>
                    <td height="20" width="92">
                        <font style="font-size: 11pt" face="Arial">Cara Bayar</font>
                    </td>
                    <td>:</td>
                    <td height="20" width="401">
                        <font style="font-size: 11pt" face="Arial">{{ $raw->kelompokpasien  }} </font>
                    </td>
                    <td height="20" width="105">
                        <font style="font-size: 11pt" face="Arial">Asal Pasien</font>
                    </td>
                    <td>:</td>
                    <!-- <td height="25"><font style="font-size: 11pt" face="Arial">{{ $raw->namaruangan  }}  </font></td> -->
                    <td height="25">
                        <font style="font-size: 11pt" face="Arial">{{ $raw->ruanganasal  }} </font>
                    </td>

                </tr>
                <tr>
                    <td height="20" width="92">
                        <font style="font-size: 11pt" face="Arial">DR.Perujuk</font>
                    </td>
                    <td>:</td>
                    <!-- <td height="20" width="401"><font style="font-size: 11pt" face="Arial">{{ $raw->perujuk }} </font></td> -->
                    <td height="20" width="401">
                        <font style="font-size: 11pt" face="Arial">{{ $raw->namalengkap }} </font>
                    </td>
                    <td height="20" width="105">
                        <font style="font-size: 11pt" face="Arial">Tgl Transaksi</font>
                    </td>
                    <td>:</td>
                    <td height="20" width="401">
                        <font style="font-size: 11pt" face="Arial">{{ App\Traits\Valet::getDateIndo($raw->tanggal).' '.substr($raw->tanggal,10,9)   }} </font>
                    </td>


                </tr>
                <tr>
                    <td height="20" width="92">
                        <font style="font-size: 11pt" face="Arial">Tgl Cetaks</font>
                    </td>
                    <td>:</td>
                    <!-- <td height="25"><font style="font-size: 11pt" face="Arial">{{ App\Traits\Valet::getDateIndo(date('Y-m-d')).date(' H:i:s')   }}  </font></td> -->
                    <td height="25">
                        <font style="font-size: 11pt" face="Arial">{{ App\Traits\Valet::getDateIndo($raw->tanggalcetak).' '.substr($raw->tanggalcetak,10,9)   }} </font>
                    </td>

                    <td height="20" width="92">
                        <font style="font-size: 11pt" face="Arial">Tgl Baca</font>
                    </td>
                    <td>:</td>
                    <!-- <td height="25"><font style="font-size: 11pt" face="Arial">{{ App\Traits\Valet::getDateIndo(date('Y-m-d')).date(' H:i:s')   }}  </font></td> -->
                    <td height="25">
                        <font style="font-size: 11pt" face="Arial">{{ App\Traits\Valet::getDateIndo($raw->tanggalbacaradiologi).' '.substr($raw->tanggalbacaradiologi,10,9)   }} </font>
                    </td>

                </tr>
                <tr>
                    <td height="20" width="105">
                        <font style="font-size: 11pt" face="Arial">Alamat</font>
                    </td>
                    <td>:</td>
                    <td height="20" colspan="4">
                        <font style="font-size: 11pt" face="Arial">{{ $raw->alamatlengkap  }} </font>
                    </td>
                </tr>
            </tbody>
        </table>

    </td>
</tr>

<tr>
    <td bordercolor="#808080" height="13"></td>
</tr>
<tr>

    <td bordercolor="#808080" height="13">
        <font style="font-size: 11pt" face="Arial" color="#000000">
            <span style="font-weight: 700;font-size: 11pt">
                HASIL PEMERIKSAAN RADIOLOGI
            </span>
        </font>
    </td>
</tr>
<tr>
    <td bordercolor="#808080" height="14" style="padding:10px ">
        <!-- <p style="text-align: left;font-weight: bold"> Hasil Pemeriksaan</p> -->
        <hr>
        <!-- <p style="text-align: left;font-weight: bold;font: Arial:font-size: 12pt">{{ (string) $raw->namaproduk}}</p> -->
        <p style="text-align: left;font-weight: bold;font: Arial;font-size: 12pt">{{ (string) $raw->namaproduk}}</p>

        @php
        $exper = explode('~',$raw->keterangan);
        //dd($exper);
        $datas =[];
        foreach ($exper as $r){
        $datas [] = array(
        'ket' =>(string) $r
        );
        }
        // dd($datas);//

        @endphp
        <div style="text-align: left;font-size: 12pt ;font: Arial ">
            @foreach($datas as $e => $val)
            @php
            $val['ket'] = str_replace('','',$val['ket'] );
            @endphp
            <p style="margin-bottom:0cm;margin-bottom:.0001pt;line-height:normal;font: Arial">
                {!! nl2br(str_replace('~','<br />',$val['ket'] )) !!}
                {{-- {!! nl2br(str_replace(" ", " &nbsp;", $val['ket'])) !!}--}}
            </p>

            @endforeach
        </div>

        <!-- <hr> -->
        {{-- <table style="border-collapse: collapse" cellspacing="0" cellpadding="0" bordercolor="#000000" border="1" width="100%">--}}
        {{-- <tbody>--}}
        {{-- <tr>--}}
        {{-- <td ><b style="font-size: 11pt" face="Arial" color="#000000">&nbsp;<b></b> {{ (string) $raw->namaproduk}}</b>
    </td>--}}
    {{-- </tr>--}}
    {{-- <tr>--}}
    {{-- <td ><font style="font-size: 8pt" face="Arial" color="#000000">&nbsp; {{ (string) $raw->keterangan}}</font>
    </td>--}}
    {{-- </tr>--}}
    {{-- </tbody>--}}
    {{-- </table>--}}
    </td>
</tr>
<!--  <tr>
            <td>
                 <font style="font-size: 11pt" face="Arial">Tanggal Cetak : {{ (string) $now }}</font>
            <td>
        </tr> -->
<tr>
    <td>
        <table style="margin-top:5px;">
            <tr>
                <td width="550"></td>
            </tr>
            <tr>
                <td></td>
                <td style="text-align: center">
                    <!-- <font style="font-size: 11pt" face="Arial">Jakarta, {{ App\Traits\Valet::getDateIndo(date('Y-m-d'))   }}</font> -->
                    <br>
                    <font style="font-size: 11pt;" face="Arial">Pemeriksa</font>
                </td>
            </tr>

            <tr>
                <td height="100">Cetakan ke:{{ $raw2->cetakanke}}</td>
                <td>
                    @if (file_exists(public_path('img/radiologi/'.$raw->pgid.'.jpeg')))
                    <img src="{{ asset('service/img/radiologi/'.$raw->pgid.'.jpeg') }}" style="max-width:200px;height:100px;margin-top: -40px;" border="0">
                    @endif
                    <br>
                    <font face="Arial" style="font-size: 9pt"><b>{{ '( '. $raw->dokterrad .' )'}} </b><br><i>SIP : {{ $raw->nosip != null? $raw->nosip:'-' }} </i></font>
                </td>
            </tr>
        </table>
    </td>
</tr>


@endsection