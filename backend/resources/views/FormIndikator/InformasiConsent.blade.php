@extends("FormIndikator/bodyprint")
@section("content")

<div align="center">
  <h2 align="center" style="margin-top: 5px">
    FORMULIR KELENGKAPAN INFORM CONSENT SETELAH MENDAPATKAN INFORMASI YANG JELAS
  </h2>
</div>
<table class="table1"  align="center">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=100>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th>Jenis Informasi</th>
      <th width="50">TT Dokter</th>
      <th width="50">TT Pasien</th>
      <th width="50">TT Identitas pemberi persetujuan</th>
      <th width="50">TT yg Menyatakan</th>
      <th width="50">TT Dokter</th>
      <th width="50">TT Saksi</th>
    </tr>
  </thead>
  <tbody>
    <?php
    $no =1;
    function getKet($str){
      if(strtoupper($str) == "YA"){
        $res ='✔';
      }else{
        $res = '-';
      }
      return $res;
    }
    ?>
    @foreach($data as $datas )

    <?php
    $tanggal = strtotime($datas->tanggal);
    $tanggal = date("d-m-Y"); 


    ?>

    <tr>
      <td align="center"> {{ $no++ }} </td>
      <td align="center"> {{ $tanggal }} </td>
      <td align="center"> {{ $datas->no_rm }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $datas->jenis_informasi }} </td>
      <td align="center"> {{ getKet($datas->tt_dokter) }} </td>
      <td align="center"> {{ getKet($datas->tt_pasien) }} </td>
      <td align="center"> {{ getKet($datas->ident_pemberi_persetujuan) }} </td>
      <td align="center"> {{ getKet($datas->tt_menyatak) }} </td>
      <td align="center"> {{ getKet($datas->tt_dokter1) }} </td>
      <td align="center"> {{ getKet($datas->tt_saksi) }} </td>
      
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection