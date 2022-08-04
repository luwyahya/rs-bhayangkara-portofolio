@extends("FormIndikator/bodyprint")
@section("content")


 <?php
  function ceklist($c){
    if ($c==1) {
      $s = "✔";
    }else{ $s="-"; }

    return $s;
  }
 ?>

<div align="center">
  <h2  style="margin-top: 5px">

   FORMULIR CHECK LIST ANALISA KELENGKAPAN INFORMED CONSENT

 </h2>
</div>
<table class="table1"  align="center">
  <thead>
    <tr>
      <th rowspan="2" width="20"> No </th>
      <th rowspan="2"  width=90>Tanggal</th>
      <th rowspan="2" >No. RM</th>
      <th rowspan="2"  width=300>Nama Pasien</th>
      <th rowspan="2" >DPJP</th>
      <th colspan="10">ITEM</th>
      <th  rowspan="2" >Skor</th>
    </tr>
    <tr>
      <th> No RM </th>
      <th> Nama Pasien </th>
      <th> Tgl Lahir </th>
      <th> Jenis Info </th>
      <th> TTD Dokter </th>
      <th> TTD Pasien </th>
      <th> Ident. Pemberi Persetujuan </th>
      <th> TTD Menyatakan</th>
      <th> TTD Dokter</th>
      <th> TT Saksi</th>
    </tr>
  </thead>
  <tbody>
      <?php
    $no =1;
    ?>
    @foreach($data as $datas )

    <tr>
      <td> {{ $no++ }} </td>
      <td> {{ $datas->nocm }} </td>
      <td> {{ $datas->namapasien }} </td>
      <td> {{ $datas->namaruangan }} </td>
      <td> {{ $datas->namalengkap }} </td>
      <td align="center"> {{ ceklist($datas->norm) }} </td>
      <td align="center"> {{ ceklist($datas->nm) }} </td>
      <td align="center"> {{ ceklist($datas->tl) }} </td>
      <td align="center"> {{ ceklist($datas->ji) }} </td>
      <td align="center"> {{ ceklist($datas->ttd) }} </td>
      <td align="center"> {{ ceklist($datas->ttp) }} </td>
      <td align="center"> {{ ceklist($datas->ipp) }} </td>
      <td align="center"> {{ ceklist($datas->ttm) }} </td>
      <td align="center"> {{ ceklist($datas->ttd1) }} </td>
      <td align="center"> {{ ceklist($datas->tts) }} </td>

      <td> {{ $datas->skor }} </td>
    </tr>
    @endforeach
    


  </tbody>
  <tfoot>


  </tfoot>

</table>
@endsection