@extends("FormIndikator/bodyprint")
@section("content")

<div align="center">

  <h2 align="center" style="margin-top: 5px">
    FORMULIR KESALAHAN PENYERAHAN HASIL PEMERIKSAAN

  </h2>
</div>
<table class="table1"  align="center">
  <thead>
    <tr>
      <th width="20"> No </th>
      <th width=100>Tanggal</th>
      <th>No. RM</th>
      <th width=300>Nama Pasien</th>
      <th>Tanggal Pemeriksaan</th>
      <th >Jenis Pemeriksaan</th>
      <th >Tanggal Penyerahan</th>
      <th >Hasil Penyerahan</th>
    </tr>
  </thead>
  <tbody>
    <?php
    $no =1;
    ?>
    @foreach($data as $datas )

    <?php
    $tanggal = strtotime($datas->tanggal);
    $tanggal = date("d-m-Y"); 

    $tanggal_pemeriksaan = strtotime($datas->tanggal_pemeriksaan);
    $tanggal_pemeriksaan = date("d-m-Y"); 

    $tanggal_penyerahan = strtotime($datas->tanggal_penyerahan);
    $tanggal_penyerahan = date("d-m-Y"); 

    ?>

    <tr>
      <td align="center"> {{ $no++ }} </td>
      <td align="center"> {{ $tanggal }} </td>
      <td align="center"> {{ $datas->no_rm }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $datas->tanggal_pemeriksaan }} </td>
      <td> {{ $datas->jenispemeriksaan }} </td>
      <td > {{ $tanggal_penyerahan }} </td>
      <td> {{ $datas->penyerahan_hasil }} </td>
    </tr>
    @endforeach
    

  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection