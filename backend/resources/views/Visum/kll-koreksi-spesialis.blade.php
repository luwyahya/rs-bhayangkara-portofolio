@extends('VisumTemplate.header')
@section('content-body')
<style>
@page :first{
    margin-top: -50px;
    margin-bottom: 50px;
}
@page {
      margin-top: 30px;
  }
</style>
<tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="90%">
                <tbody>
                <p>
                <br>
                <tr>
                    <td width="85" class="contoh3" align="left">
                        <font style="font-size: 12pt;" face="Arial">
                                Nomor
                    </font>
                    <td>:</td>
                    <td width="700"><font style="font-size: 12pt;" face="Arial" > {{ $raw->nosurat }} </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="85" class="contoh3" align="left">
                        <font style="font-size: 12pt;" face="Arial">
                               Lampiran
                    </font>
                    <td>:</td>
                    <td width="700"><font style="font-size: 12pt" face="Arial"> - </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="85" class="contoh3" align="left">
                        <font style="font-size: 12pt;" face="Arial">
                    Perihal
                    </font>
                    <td>:</td>
                    <td width="700"><font style="font-size: 12pt" face="Arial"> Visum et Repertum </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="85" class="contoh3" align="left">
                        <font style="font-size: 12pt;" face="Arial">
                    
                    </font>
                    <td></td>
                    <td width="700"><font style="font-size: 12pt" face="Arial"><b><u> {{ $raw->namapasien }} </u></b></font></td>
                    </td>
                </tr>
                </p>
            </table>  
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13" >
            <table cellspacing="0" cellpadding="0" border="0" width="90%">
                <tbody>
                <tr>
                    <td width="120" class="contoh3">
                        <font style="font-size: 12pt;" face="Arial">
                    <b>PRO JUSTITIA</b>
                    </font>
                    </td>
                    <td width="120" align="right" class="contoh3">
                        <font style="font-size: 12pt;" face="Arial">
                    <p>Jakarta, {{ App\Traits\Valet::getDateIndo(date('Y-m-d H:i'))  }}</p>
                    </font>
                    </td>
                </tr>
            </table>        
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13" >
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-top:3%;">
                <tbody>
                <tr>
                    <td width="120" align="center" class="contoh3">
                        <font style="font-size: 12pt;" face="Arial">
                    <b><u>VISUM ET REPERTUM</u></b>
                    </font>
                    </td>
                </tr>
            </table>        
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13" >
            <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-top:3%;">
                <tbody>
                <tr>
                    <td width="120" align="justify" class="contoh3">
                        <font style="font-size: 12pt;" face="Arial">
                    <p>Saya yang bertanda tangan dibawah ini {{ $raw->dokter }}, dokter di Rumah Sakit Bhayangkara
                     Tk. I R. Said Sukanto, berdasarkan permintaan tertulis dari Kepolisian {{ $raw->permintaan }}
                     dengan surat nomor {{ $raw->nosuratpermintaan }}, tertanggal {{ App\Traits\Valet::getDateHuruf($raw->tglpermintaan).' '.substr($raw->tglpermintaan,1,0)   }} mengenai
                     permintaan visum tersebut di atas, maka dengan ini menerangkan bahwa pada tanggal {{ App\Traits\Valet::getDateHuruf2(date('Y-m-d H:i'))  }}
                     Waktu Indonesia Barat, bertempat di Ruang Pemeriksaan Pusat Pelayanan Perempuan dan Anak Terpadu Rumah
                     Sakit Bhayangkara TK. I R. Said Sukanto telah melakukan pemeriksaan atas korban yang menurut
                     surat permintaan visum tersebut adalah :</p>
                    </font>
                    </td>
                </tr>
            </table>        
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13">
            <table cellspacing="0" cellpadding="0" border="0" width="90%">
                <tbody>
                <p>
                <br>
                <tr>
                    <td width="150" class="contoh3" align="left">
                        <font style="font-size: 12pt;" face="Arial">
                                Nama
                    </font>
                    <td>:</td>
                    <td width="700"><font style="font-size: 12pt;" face="Arial" > {{ $raw->namapasien2 }} </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="150" class="contoh3" align="left">
                        <font style="font-size: 12pt;" face="Arial">
                               Tempat, Tgl. Lahir
                    </font>
                    <td>:</td>
                    <td width="700"><font style="font-size: 12pt" face="Arial"> {{ $raw->ttl }} </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="150" class="contoh3" align="left">
                        <font style="font-size: 12pt;" face="Arial">
                    Jenis Kelamin
                    </font>
                    <td>:</td>
                    <td width="700"><font style="font-size: 12pt" face="Arial"> {{ $raw->jeniskelamin }} </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="150" class="contoh3" align="left">
                        <font style="font-size: 12pt;" face="Arial">
                    Agama
                    </font>
                    <td></td>
                    <td width="700"><font style="font-size: 12pt" face="Arial"> {{ $raw->agama }} </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="150" class="contoh3" align="left">
                        <font style="font-size: 12pt;" face="Arial">
                    Warga Negara
                    </font>
                    <td></td>
                    <td width="700"><font style="font-size: 12pt" face="Arial"> {{ $raw->namanegara }} </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="150" class="contoh3" align="left">
                        <font style="font-size: 12pt;" face="Arial">
                    Pekerjaan
                    </font>
                    <td></td>
                    <td width="700"><font style="font-size: 12pt" face="Arial"> {{ $raw->pekerjaan }} </font></td>
                    </td>
                </tr>
                <tr>
                    <td width="150" class="contoh3" align="left">
                        <font style="font-size: 12pt;" face="Arial">
                    Alamat
                    </font>
                    <td></td>
                    <td width="700"><font style="font-size: 12pt" face="Arial"> {{ $raw->alamat }} </font></td>
                    </td>
                </tr>
                </p>
            </table>  
        </td>
    </tr>
    <tr>
        <td bordercolor="#808080" height="13" >
            <table cellspacing="0" cellpadding="0" border="0" width="90%" height="20%">
                <tbody>
                <tr>
                <td width="120" align="left">
                    @php
                $exper = explode('~',$raw->kllvisum3);
                //dd($exper);
                $datas =[];
                foreach ($exper as $r){
                    $datas [] = array(
                        'ket' =>(string)  $r
                    );
                }
            // dd($datas);

            @endphp
            <div style="text-align: left;font-size: 14pt;" face="Arial">
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
                    </td>
                </tr>
            </table>        
        </td>
    </tr>
@endsection