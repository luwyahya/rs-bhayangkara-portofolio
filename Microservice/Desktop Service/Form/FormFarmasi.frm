VERSION 5.00
Begin VB.Form FormFarmasi 
   Caption         =   "Farmasi"
   ClientHeight    =   1110
   ClientLeft      =   60
   ClientTop       =   405
   ClientWidth     =   4395
   Icon            =   "FormFarmasi.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   1110
   ScaleWidth      =   4395
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "FormFarmasi"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Public Function Farmasi(ByVal QueryText As String) As Byte()
On Error Resume Next
    Dim Root As JNode
    Dim Param1() As String
    Dim Param2() As String
    Dim Param3() As String
    Dim Param4() As String
    Dim Param5() As String
    Dim Param6() As String
    Dim Param7() As String
    Dim Param8() As String
    Dim Param9() As String
    Dim arrItem() As String
    
   If CN.State = adStateClosed Then Call openConnection
    
    If Len(QueryText) > 0 Then
    
        arrItem = Split(QueryText, "&")
        Param1 = Split(arrItem(0), "=")
        Param2 = Split(arrItem(1), "=")
        Param3 = Split(arrItem(2), "=")
        Param4 = Split(arrItem(3), "=")
        Param5 = Split(arrItem(4), "=")
        Param6 = Split(arrItem(5), "=")
        Param7 = Split(arrItem(6), "=")
        Param8 = Split(arrItem(7), "=")
        Param9 = Split(arrItem(8), "=")

        Select Case Param1(0)
            Case "cetak-RekapPenjualanHarian"
                Call frmCRPenjualanHarianFarmasi.CetakPenjualanHarianFarmasi(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rekap Penjualan Harian Farmasi"
            Case "cetak-RekapPenjualanHarianBebas"
                Call frmCRPenjualanHarianFarmasi.CetakPenjualanHarianFarmasiBebas(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rekap Penjualan Harian Farmasi"
            Case "cetak-RekapPenjualanFarmasi"
                Call frmCRPenjualanFarmasi.CetakPenjualanFarmasi(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rekap Penjualan Harian Farmasi"
            Case "cetak-RekapPenjualanHarianBebas"
                Call frmCRPenjualanHarianFarmasi.CetakPenjualanHarianFarmasiBebas(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rekap Penjualan Harian Farmasi"
            Case "cetak-PenjualanObatPerDokter"
                Call frmCRPenjualanObatPerDokter.CetakPenjualanObatPerDokter(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Penjualan Obat Per Dokter"
            Case "cetak-LabelFarmasi"
                Call frmCetakLabelFarmasi.CetakLabelFarmasi(Param1(1), Param2(1))
                Set Root = New JNode
                Root("Status") = "Cetak Label Farmasi"
            Case "cetak-LabelFarmasiAdmin"
                Call frmCetakLabelFarmasiAdmin.CetakLabelFarmasi(Param1(1), Param2(1))
                Set Root = New JNode
                Root("Status") = "Cetak Label Farmasi"
            Case "cetak-LabelFarmasiKemo"
                Call frmCetakLabelFarmasiKemo.CetakLabelFarmasi(Param1(1), Param2(1))
                Set Root = New JNode
                Root("Status") = "Cetak Label Farmasi"
            Case "cetak-LabelFarmasiTPN"
                Call frmCetakLabelFarmasiTPN.CetakLabelFarmasi(Param1(1), Param2(1))
                Set Root = New JNode
                Root("Status") = "Cetak Label Farmasi"
            Case "cetak-DetailPengeluaranObat"
                Call frmCRDetailPengeluaranObat.Cetak(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Penjualan Obat Per Dokter"
            Case "cetak-DetailPengeluaranObatBebas"
                Call frmCRPenjualanObatBebas.Cetak(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Detail Penjualan Obat Non Layanan"
            Case "cetak-RekapPenjualanKaryawan"
                Call frmCRPenjualanKaryawanFarmasi.Cetak(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                Set Root = New JNode
                Root("Status") = "Cetak Penjualan Obat Non Layanan Karyawan"
            Case "cetak-RekapReturObat"
                Call frmCRLaporanRekapRetur.Cetak(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1))
                Set Root = New JNode
                Root("Status") = "Cetak Detail Penjualan Obat Non Layanan"
            Case "cetak-detailPemakaianVaksin"
                Call frmCRPemakaianVaksin.CetakDetail(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1))
                Set Root = New JNode
                Root("Status") = "Cetak Detail Penjualan Obat Non Layanan"
            Case "cetak-RekapPemakaianVaksin"
                Call frmCRPemakaianVaksin.cetakRekap(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1))
                Set Root = New JNode
                Root("Status") = "Cetak Detail Penjualan Obat Non Layanan"
            Case "cetak-LabelFarmasiOB"
                Call frmCetakLabelFarmasiOB.CetakLabelFarmasiOB(Param1(1), Param2(1))
                Set Root = New JNode
                Root("Status") = "Cetak Label Farmasi"
            Case "cetak-LabelFarmasiCeklis"
                Call frmCetakLabelFarmasi.CetakLabelFarmasiCeklis(Param1(1), Param2(1), Param3(1), Param4(1))
                Set Root = New JNode
                Root("Status") = "Cetak Label Farmasi"
            Case "cetak-LabelIdentitasPasien"
                Call frmCetakLabelIdentitasPasien.CetakLabel(Param1(1), Param2(1), Param3(1))
                Set Root = New JNode
                Root("Status") = "Cetak Label Farmasi"
            Case "cetak-DetailPenjualanObat"
                Call frmPenjualanObatDetail.Cetak(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Detail Penjualan Obat"
            Case "cetak-RekapPenjualanObatPerRuangan"
                Call frmPenjualanObatDetail.cetakRekapRuangan(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param8(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Detail Penjualan Obat"
            Case "cetak-RekapPenjualanObat"
                Call frmPenjualanObatDetailRekap.cetakRekap(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rekap Penjualan Obat"
             Case "cetak-RekapPengeluaranObat"
                Call frmPenjualanObatDetailRekap.cetakRekap2(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rekap Penjualan Obat"
            Case "cetak-DetailPenjualanObat-Bhp"
                Call frmPenjualanObatBhp.Cetak(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Detail Penjualan Obat"
            Case "cetak-RekapPenjualanObat-Bhp"
                Call frmPenjualanObatBhp.cetakRekap(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rekap Penjualan Obat"
            Case "cetak-LabelFarmasiKecil"
                Call frmCetakLabelFarmasiKecil.CetakLabelFarmasi(Param1(1), Param2(1))
                Set Root = New JNode
                Root("Status") = "Cetak Label Farmasi"
            Case "cetak-LabelFarmasiTelemedis"
                Call frmCetakLabelFarmasiTelemedis.CetakLabelFarmasi(Param1(1), Param2(1))
                Set Root = New JNode
                Root("Status") = "Cetak Label Farmasi"
            Case "cetak-LabelFarmasiRekap"
                Call frmCetakLabelFarmasiRekap.CetakLabelFarmasi(Param1(1), Param2(1), Param3(1))
                Set Root = New JNode
                Root("Status") = "Cetak Label Farmasi"
            Case "cetak-buktiantrianfarmasi"
                Param3 = Split(arrItem(2), "=")
'                Param4 = Split(arrItem(3), "=")
                lblStatus.Caption = "Cetak Bukti Antrian Farmasi"
                Call frmCetakAntrianFarmasi.cetakBuktiAntrianFarmasi(Param1(1), Param2(1), Param3(1))
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "ea@epic"
            Case "cetak-LabelFarmasiKecil-ceklis"
                Call frmCetakLabelFarmasiKecil.CetakLabelKecilCeklis(Param1(1), Param2(1), Param3(1), Param4(1))
                Set Root = New JNode
                Root("Status") = "Cetak Label Farmasi"
            Case "cetak-LabelFarmasiRekap-ceklis"
                Call frmCetakLabelFarmasiRekap.CetakLabelFarmasiRekapCeklis(Param1(1), Param2(1), Param3(1), Param4(1))
                Set Root = New JNode
                Root("Status") = "Cetak Label Farmasi"
            Case "cetak-LabelFarmasiOBKecil"
                Call frmCetakLabelFarmasiOB.CetakLabelFarmasiOBKecil(Param1(1), Param2(1))
                Set Root = New JNode
                Root("Status") = "Cetak Label Farmasi"
            Case "cetak-KwitansiApotik"
                Call frmKwitansiApotik.Cetak(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Detail Penjualan Obat"
            Case "cetak-formulir-delegasi-pemberi-obat"
                'http://127.0.0.1:1237/printvb/farmasi?cetak-formulir-delegasi-pemberi-obat&id=341928&view=true
                Call frmCetakFormasiDelegasiPemberianObat.Cetak(Param2(1), Param3(1))
                Set Root = New JNode
                Root("Status") = "Delegasi Pemberian Obat"
                Root("by") = "grh@epic"
            Case "cetak-labelrekap-rajal"
                Call frmCetakLabelFarmasiRajal.CetakLabelFarmasiRekapRajal(Param1(1), Param2(1))
                Set Root = New JNode
                Root("Status") = "Cetak Label Farmasi"
                Case "cetak-LabelFarmasi-ok"
            Call frmCetakLabelFarmasi.CetakLabelFarmasiOk(Param1(1), Param2(1))
                Set Root = New JNode
                Root("Status") = "Cetak Label Farmasi"
            Case "cetak-LabelFarmasiCeklis-Ok"
                Call frmCetakLabelFarmasi.CetakLabelFarmasiCeklisOk(Param1(1), Param2(1), Param3(1), Param4(1))
                Set Root = New JNode
                Root("Status") = "Cetak Label Farmasi"
            Case "cetak-Laporanpasienpulangapotik"
                Call frmPenjualanObatDetailRekap.cetakRekap3(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param8(1), Param7(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rekap Penjualan Obat"
            Case "cetak-LaporanpasienpulangapotikBlok"
                Call frmPenjualanObatDetailRekap.cetakRekap4(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param8(1), Param7(1), Param9(1))
                Set Root = New JNode
                Root("Status") = "Cetak Rekap Penjualan Obat"
            Case Else
                Set Root = New JNode
                Root("Status") = "Error"
        End Select
    End If
    With GossRESTMain.STM
        .Open
        .Type = adTypeText
        .CharSet = "utf-8"
        .WriteText Root.JSON, adWriteChar
        .Position = 0
        .Type = adTypeBinary
        kasir = .Read(adReadAll)
        .Close
    End With
    If CN.State = adStateOpen Then CN.Close
    Unload Me
    Exit Function
    
errLoad:
End Function

Private Sub CETAK_Billing(strNoregistrasi As String, jumlahCetak As Integer, view As String)
On Error GoTo errLoad
    Dim prn As Printer
    Dim strPrinter As String
  
    ReadRs "select pp.norec,pp.tglpelayanan,pr.id as prid, pr.namaproduk, pp.jumlah,kl.id as klid, kl.namakelas, " & _
           "ru.id as ruid,ru.namaruangan,pp.produkfk,pp.hargajual,pg.id as pgid,pg.namalengkap,sp.nostruk, " & _
           "jpp.id as jppid,jpp.jenispetugaspe from " & _
           "pasiendaftar_t As pd " & _
           "inner  join antrianpasiendiperiksa_t as apd on apd.noregistrasifk= pd.norec " & _
           "inner join pelayananpasien_t as pp on pp.noregistrasifk= apd.norec " & _
           "inner join produk_m as pr ON pr.id= pp.produkfk " & _
           "inner JOIN  kelas_m as kl ON kl.id= apd.objectkelasfk " & _
           "inner join ruangan_m as ru ON ru.id= apd.objectruanganfk " & _
           "inner join pelayananpasienpetugas_t as ptu ON ptu.pelayananpasien= pp.norec " & _
           "inner join jenispetugaspelaksana_m as jpp ON jpp.id= ptu.objectjenispetugaspefk " & _
           "inner join pegawai_m as pg ON pg.id= ptu.objectpegawaifk " & _
           "left join strukpelayanan_t as sp ON sp.norec= pp.strukfk " & _
           "Where pd.tglpulang Is Not Null " & _
           "and pd.noregistrasi='" & strNoregistrasi & "'"
    
'    Dim NoAntri As String
'    Dim jmlAntrian As Integer
'    Dim jenis As String
'
'    Set RS = Nothing
'    RS.Open "select * from antrianpasienregistrasi_t where norec ='" & strNorec & "'", CN, adOpenStatic, adLockReadOnly
'    NoAntri = RS!jenis & "-" & RS!noantrian
'    jenis = RS!jenis
'    Set RS = Nothing
'    RS.Open "select count(noantrian) as jmlAntri from antrianpasienregistrasi_t where jenis ='" & jenis & "' and statuspanggil='0'", CN, adOpenStatic, adLockReadOnly
'    jmlAntrian = RS(0)
    
    strPrinter = GetTxt("Setting.ini", "Printer", "CetakAntrian")
    'GetSetting("Jasamedika Service", "CetakAntrian", "Printer")
    If Printers.Count > 0 Then
        For Each prn In Printers
            If prn.DeviceName = strPrinter Then
                Set Printer = prn
                Exit For
            End If
        Next prn
    End If
    
   '
    Printer.fontSize = 10
        Printer.Print "     RUMAH SAKIT ANAK DAN BUNDA"
        Printer.fontSize = 18
        Printer.FontBold = True
        Printer.Print "      HARAPAN KITA"
        Printer.FontBold = False
        Printer.fontSize = 10
        Printer.Print "   Jl. S. Parman Kav.87, Slipi, Jakarta Barat"
        Printer.Print "      Telp. 021-5668286, 021-5668284"
        Printer.Print "      Fax.  021-5601816, 021-5673832"
        Printer.Print "___________________________________"
        Printer.Print ""
        Printer.Print "Tanggal :" & Format(Now(), "yyyy MM dd hh:mm")
        Printer.Print ""
    For i = 0 To rs.RecordCount - 1
        'MsgBox "CETAK"

        Printer.fontSize = 12
          '1,3,,4,6,8,10,12,13,15
        Printer.Print rs(1) & " " & rs(1) & " " & rs(3) & " " & rs(4) & " " & rs(6) & " " & rs(8) & " " & rs(10) & " " & rs(12) & " "
        rs.MoveNext
    Next
    Printer.EndDoc
    Exit Sub
errLoad:
End Sub





