
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
                        <font style="font-size: 11pt" face="Arial">No RM</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font style="font-size: 11pt" face="Arial">{{   $raw->nocm }} </font></td>
                    <td height="25" width="105">
                        <font style="font-size: 11pt" face="Arial">Nama</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 11pt" face="Arial">{{  $raw->namapasien    }} </font></td>

                </tr>
                <tr>
                    <td height="25" width="82">
                        <font style="font-size: 11pt" face="Arial">Kelamin</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font style="font-size: 11pt" face="Arial">{{ $raw->jeniskelamin  }} </font></td>
                    <td height="25" width="105">
                        <font style="font-size: 11pt" face="Arial">Umur</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 11pt" face="Arial">{{  $raw->umur }} </font></td>

                </tr>
                 <tr>
                    <td height="25" width="82">
                        <font style="font-size: 11pt" face="Arial">No Kartu</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font style="font-size: 11pt" face="Arial">{{ $raw->nokepesertaan }} </font></td>
                    <td height="25" width="105">
                        <font style="font-size: 11pt" face="Arial">No SEP</font>
                    </td>
                    <td>:</td>
                    <td height="25"><font style="font-size: 11pt" face="Arial">{{  $raw->nosep }} </font></td>

                </tr>
                <tr>
                    <td height="25" width="92">
                        <font style="font-size: 11pt" face="Arial">Cara Bayar</font>
                    </td>
                    <td>:</td>
                    <td height="25" width="401"><font style="font-size: 11pt" face="Arial">{{ $raw->kelompokpasien  }} </font></td>
                    
                  

                </tr>
                <tr>
                     <td height="25" width="105">
                        <font style="font-size: 11pt" face="Arial">Alamat</font>
                    </td>
                    <td>:</td>
                    <td height="25" colspan="4"><font style="font-size: 11pt" face="Arial">{{ $raw->alamatlengkap  }}  </font></td>
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
                        HASIL PEMERIKSAAN LABORATORIUM INI BENAR DI KELUARKAN DARI RS BHAYANGKARA TK IV CIANJUR
                    </span>
            </font>
        </td>
    </tr>
    
       <!--  <tr>
            <td>
                 <font style="font-size: 11pt" face="Arial">Tanggal Cetak : {{ (string) $now }}</font>
            <td>
        </tr> -->
       


@endsection
