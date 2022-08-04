
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
                    <td height="25" width="110">
                        <font style="font-size: 11pt" face="Arial">NIP</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font style="font-size: 11pt" face="Arial">{{   $raw->nipdoktermenerangkan }} </font></td>
                    <td height="25" width="105">
                        <font style="font-size: 11pt" face="Arial">No SIP</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 11pt" face="Arial">{{  $raw->sipdoktermenerangkan    }} </font></td>

                </tr>
                <tr>
                    <td height="25" width="82">
                        <font style="font-size: 11pt" face="Arial">Nama</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font style="font-size: 11pt" face="Arial">{{ $raw->doktermenerangkan  }} </font></td>
                    <td height="25" width="105">
                        <font style="font-size: 11pt" face="Arial">Jenis Kelamin</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 11pt" face="Arial">{{  $raw->jkdoktermenerangkan }} </font></td>

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
                        SURAT KEMATIAN INI DITANDA TANGANI DI RUMAH SAKIT BHAYANGKARA TK. I R. SAID SUKANTO, KRAMATJATI, JAKARTA. PADA TANGGAL {{  $raw->tglcetak }}.
                    </span>
            </font>
        </td>
    </tr>
       


@endsection
