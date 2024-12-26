
@extends('template.templateEmr')
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
                    <td height="25" width="110">
                        <font style="font-size: 11pt" face="Arial">NIP</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font style="font-size: 11pt" face="Arial">{{   $raw->nip }} </font></td>
                    <td height="25" width="105">
                        <font style="font-size: 11pt" face="Arial">No SIP</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 11pt" face="Arial">{{  $raw->nosip    }} </font></td>

                </tr>
                <tr>
                    <td height="25" width="82">
                        <font style="font-size: 11pt" face="Arial">Nama Pegawai</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font style="font-size: 11pt" face="Arial">{{ $raw->namalengkap  }} </font></td>
                    <td height="25" width="105">
                        <font style="font-size: 11pt" face="Arial">Jenis Kelamin</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 11pt" face="Arial">{{  $raw->jeniskelamin }} </font></td>

                </tr>
                <tr>
                    <td height="25" width="82">
                        <font style="font-size: 11pt" face="Arial">Jenis Pegawai</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font style="font-size: 11pt" face="Arial">{{ $raw->jenispegawai  }} </font></td>
                    <td height="25" width="105">
                        <font style="font-size: 11pt" face="Arial">Status Pegawai</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 11pt" face="Arial">{{  $raw->statuspegawai }} </font></td>

                </tr>
                <tr>
                <td height="25" width="105">
                        <font style="font-size: 11pt" face="Arial">Tanda Tangan</font>
                    </td>
                    <td>:</td>
                    <td width="105">
                          <p align="left">
                         @if(!empty($raw->tandatangan))
                         <img src="{{ $raw->tandatangan }}" style="width: 80px" border="0">
                         @endif
                           </p>
                    </td>
                    <td height="25" width="105">
                        <font style="font-size: 11pt" face="Arial">Pangkat Pegawai</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 11pt" face="Arial">{{  $raw->namapangkat }} </font></td>    
                </tr>
                <!-- <tr>
                    <td height="25" width="82">
                        <font style="font-size: 11pt" face="Arial">Umur</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font style="font-size: 11pt" face="Arial">{{ $raw->umur  }} </font></td>
                    
               

                </tr> -->
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
                        {{$message}} INI DITANDA TANGANI OLEH {{  $raw->namalengkap }} DI RUMAH SAKIT BHAYANGKARA TK. IV CIANJUR, KAB.CIANJUR, JAWA BARAT. PADA TANGGAL {{  $tglcetak }}.
                    </span>
            </font>
        </td>
    </tr>
       


@endsection
