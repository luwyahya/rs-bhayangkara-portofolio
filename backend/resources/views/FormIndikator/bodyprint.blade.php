<!DOCTYPE html>
<html>

<head>
  <title>Print</title>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js"></script>
  <link rel="stylesheet" type="text/css" href="{{ asset('asset/style.css') }}">
  <script src="asset/jquery.min.js"> </script>

  <style type="text/css">
    h2 {
      width: 1300px; 
      text-align: center;
      margin-top: 5px;
    }
    tbody{
      font-size : 14px;
      table-layout: auto;
    }

    td {
      width: 1px;
      white-space: nowrap;
    }

  </style>
</head>

 
<body style="margin-top: 5px">
  <form id="form1" runat="server">
    <div ng-controller="AnastesiCtrl">
      <!-- <a href="" onclick="myFunction()"> Cetak</a> -->
      <div align="center">
       <img src=" {{ asset('img/header.jpg') }} " alt="">

     </div>
     <div align="center" width=200> Unit : {{$unit}} &nbsp;&nbsp;&nbsp; Bulan : {{ $bln }} {{$thn}} </div>

     @yield("content")

   </div>
   <br clear="all" />

   <!-- <input type="button" id="print" name="print" value="Cetak" onclick="javascript:PrintPage();" class="button" /> -->
 </form>
</body>

</html>

<script>

  $(document).ready(function () {
    window.print();
  });


  $("#incidents tbody").filter(function() {
    return !$.trim($(this).text());
  }).append('<tr>message foo</tr>');


  function closeWindow() {
    window.open('','_parent','');
    window.close();
  }

  function PrintPage() {
    document.getElementById('print').style.display = 'none';
    window.resizeTo(960, 600);
    document.URL = "";
    window.location.href = "";
    window.print();
  }





</script>
