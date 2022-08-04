
@extends('template.template')
@section('content-body')
<style>
@page {
    margin-top: 0px;
    margin-bottom: 170px;
    margin-left: 0px;
    margin-right: 0px;
    size: A4 
}
</style>
    {{--<hr--}}
    <tr>

        <td bordercolor="#808080" height="13">
            <font style="font-size: 11pt" face="Arial" color="#000000">
                    <span style="font-weight: 700;font-size: 12pt">
                        HASIL PEMERIKSAAN LABORATORIUM PATOLOGI ANATOMIK
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
                <tbody>
                <tr>
{{--                    <td height="25" width="82">--}}
{{--                        <font style="font-size: 11pt" face="Arial">No Foto</font>--}}
{{--                    </td>--}}
{{--                    <td>:</td>--}}
{{--                    <td height="25" width="401"><b><font style="font-size: 11pt" face="Arial"> {{ $raw->nofoto }}</font></b></td>--}}
                    <td width="82">
                        <font style="font-size: 11pt" face="Arial">No Registrasi</font>
                    </td>
                    <td>:</td>
                    <td><b><font style="font-size: 11pt" face="Arial">{{   $raw->noregistrasi  }}</font></b></td>
                    <td width="105">
                        <font style="font-size: 11pt" face="Arial">Jenis Kelamin</font>
                    </td>
                    <td>:</td>
                    <td><b><font style="font-size: 11pt" face="Arial">{{  $raw->jeniskelamin    }} </font></b></td>

                </tr>
                <tr>
                    <td width=120">
                        <font style="font-size: 11pt" face="Arial">No Rekam Medis</font>
                    </td>
                    <td>:</td>
                    <td width="351"><b><font style="font-size: 11pt" face="Arial">{{   $raw->nocm }} </font></b></td>
                    <td width="105">
                        <font style="font-size: 11pt" face="Arial">Cara Bayar</font>
                    </td>
                    <td>:</td>
                    <td><b><font style="font-size: 11pt" face="Arial">{{ $raw->kelompokpasien  }}  </font></b></td>

                </tr>
                <tr>
                    <td width="82">
                        <font style="font-size: 11pt" face="Arial">No PA</font>
                    </td>
                    <td>:</td>
                    <td width="351"><b><font style="font-size: 11pt" face="Arial">{{   $raw->nomorpa }} </font></b></td>
                    <td width="105">
                        <font style="font-size: 11pt" face="Arial">Cetak</font>
                    </td>
                    <td>:</td>
                    <td><b><font style="font-size: 11pt" face="Arial">{{ App\Traits\Valet::getDateIndo(date('Y-m-d')).date(' H:i:s')   }}  </font></b></td>
                </tr>
                <tr>
                    <td width="82">
                        <font style="font-size: 11pt" face="Arial">Nama</font>
                    </td>
                    <td>:</td>
                    <td width="300"><b><font style="font-size: 11pt" face="Arial">{{ $raw->namapasien   }} </font></b></td>
    
                    <td width="105">
                        <font style="font-size: 11pt" face="Arial">Topografi</font>
                    </td>
                    <td>:</td>
                    <td><b><font style="font-size: 11pt" face="Arial">{{ $raw->topologi  }}  </font></b></td>

                </tr>
                <tr>
                    <td width="92">
                        <font style="font-size: 11pt" face="Arial">Umur</font>
                    </td>
                    <td>:</td>
                    <td width="351"><b><font style="font-size: 11pt" face="Arial">{{ $raw->umur  }} </font></b></td>
                    <td width="105">
                        <font style="font-size: 11pt" face="Arial">Morfologi</font>
                    </td>
                    <td>:</td>
                    <td><b><font style="font-size: 11pt" face="Arial">{{ $raw->morfologi  }}  </font></b></td>

                </tr>
                <tr>
                    <td width="92">
                        <font style="font-size: 11pt" face="Arial">Asal Pasien</font>
                    </td>
                    <td>:</td>
                    <td width="351"><b><font style="font-size: 11pt" face="Arial">{{ $raw->namaruangan }} </font></b></td>
                    <td width="105">
                        <font style="font-size: 11pt" face="Arial">Tgl Jawab</font>
                    </td>
                    <td>:</td>
                    <td><b><font style="font-size: 11pt" face="Arial">{{ App\Traits\Valet::getDateIndo($raw->tanggal_jawab).' '.substr($raw->tanggal_jawab,10,9)   }} </font></b></td>

                </tr>
                
                <tr>
                <td width="92">
                        <font style="font-size: 11pt" face="Arial">Tgl Terima</font>
                    </td>
                    <td>:</td>
                    <td width=351"><b><font style="font-size: 11pt" face="Arial">{{ App\Traits\Valet::getDateIndo($raw->tanggal_terima).' '.substr($raw->tanggal_terima,10,9)   }} </font></b></td>
                    <td width="120">
                        <font style="font-size: 11pt" face="Arial">Dokter Pengirim</font>
                    </td>
                    <td>:</td>
                    <td><b><font style="font-size: 11pt" face="Arial">{{ $raw->dokterperujuk  }}  </font></b></td>
                    <!-- <td height="25" width="105">
                        <font style="font-size: 11pt" face="Arial">Tgl Transaksi</font>
                    </td>
                    <td>:</td>
                    <td height="25"><b><font style="font-size: 11pt" face="Arial">{{ App\Traits\Valet::getDateIndo($raw->tanggal).' '.substr($raw->tanggal_terima,10,9)   }} </font></b></td>
                     -->

                </tr>
                <tr>
                <td width="120">
                        <font style="font-size: 11pt" face="Arial">Dokter Pengirim Luar</font>
                    </td>
                    <td>:</td>
                    <td><b><font style="font-size: 11pt" face="Arial">{{ $raw->dokterperujukluar  }}  </font></b></td>    
                    
                </tr>
                <!-- <tr>
                    <td height="25" width="92">
                        <font style="font-size: 11pt" face="Arial">Tgl Jawab</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><b><font style="font-size: 11pt" face="Arial">{{ App\Traits\Valet::getDateIndo($raw->tanggal_jawab).' '.substr($raw->tanggal_jawab,10,9)   }} </font></b></td> -->
                    
                </tr>
                </tbody>
                
            </table>
            <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tbody>
            <tr>
                    <td width="15%">
                        <font style="font-size: 11pt" face="Arial">Alamat</font>
                    </td>
                    <td>:</td>
                    <td width="100%"><b><font style="font-size: 11pt" face="Arial">{{  $raw->alamatlengkap }} </font></b></td>
                </tr>
                </tbody>
            </table>

        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13"></td>
    </tr>
    <tr >
        <td bordercolor="#808080" height="13" style="padding:10">
            <p style="text-align: left;font-weight: bold"> Hasil Pemeriksaan</p>
            <hr>
            <!-- <p  style="text-align: left;font-weight: bold;font-size: 10pt"><u>{{ (string) $raw->namaproduk}}</u></p> -->

            @php
                $exper = explode('~',$raw->expertise);
                //dd($exper);
                $datas =[];
                foreach ($exper as $r){
                    $datas [] = array(
                        'ket' =>(string)  $r
                    );
                }
            // dd($datas);

            @endphp
            <div style="text-align: left;font-size: 11pt">
                @foreach($datas as $e => $val)
                    @php
                        $val['ket'] = str_replace('','',$val['ket'] );
                    @endphp
                    <p style="margin-block-start: 0px;
                margin-block-end: 0px;
                margin-inline-start: 0px;
                margin-inline-end: 0px;">
                        {!!  nl2br(str_replace('~','<br/>',$val['ket'] )) !!}
                        {{--                    {!! nl2br(str_replace(" ", " &nbsp;", $val['ket'])) !!}--}}
                    </p>

                @endforeach
            </div>

            <!-- <hr> -->

        </td>
    </tr>

    <tr >
        <td>
            <table style="margin-top:100px;table-layout:fixed;">
                <tr>
                    <td width="600"></td>
                </tr>
                <tr>
                    <td ></td>
                    <td style="text-align: center">
                        <!-- <font style="font-size: 11pt" face="Arial">Jakarta, {{ App\Traits\Valet::getDateIndo(date('Y-m-d'))   }}</font> -->
                        <br>
                        <font style="font-size: 11pt;" face="Arial">Dokter Pemeriksa</font>
                    </td>
                </tr>

                <tr>
                    <td height="200"></td>
                    <td width="300" style="text-align: center">
                        @if (file_exists(public_path('img/radiologi/'.$raw->pgid.'.jpeg')))
                            <img src="{{ asset('service/img/radiologi/'.$raw->pgid.'.jpeg') }}"
                                 style="max-width:200px;height:100px;margin-top: -40px;" border="0">
                        @endif
                        <br>
                        <font face="Arial" style="font-size: 11pt;"><b>{{ ' '. $raw->dokterrad .' '}} </b><br>
                        <!-- <i>NIP :  {{ $raw->nippns != null? $raw->nippns:'-' }} </i> -->
                        </font>
                    </td>
                </tr>
            </table>
        </td>
    </tr>


@endsection
