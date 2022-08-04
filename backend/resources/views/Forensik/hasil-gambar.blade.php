@extends('forensiktemplate.header2')
@section('content-body')
<style>
@page :first{
    margin-top: 0px;
    margin-bottom: 70px;
}
</style>
<tr>
    <td bordercolor="#808080" height="13" >
        <table cellspacing="0" cellpadding="0" border="0" width="90%">
            <tbody>
            <tr>
                <td width="120" align="justify">
                <img src="{{ $raw->foto }}" alt="Image Preview" />
                </td>
            </tr>
        </table>        
    </td>
</tr>
<tr>
    <td bordercolor="#808080" height="13" >
        <table cellspacing="0" cellpadding="0" border="0" width="90%" style="margin-top: 3%;">
            <tbody>
            <tr>
            <td width="120" align="justify">
                <font style="font-size: 14pt; margin-right:135px;" face="Arial">
                    {{ $raw->keterangangambar }}
                </font>
            </td>
            </tr>
        </table>        
    </td>
</tr>
@endsection