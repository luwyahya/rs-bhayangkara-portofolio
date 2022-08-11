VERSION 5.00
Begin VB.Form frmAkuntansi 
   Caption         =   "Akuntansi"
   ClientHeight    =   1110
   ClientLeft      =   60
   ClientTop       =   405
   ClientWidth     =   4395
   Icon            =   "frmAkuntansi.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   1110
   ScaleWidth      =   4395
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmAkuntansi"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Public Function akuntansi(ByVal QueryText As String) As Byte()
On Error Resume Next
    Dim Root As JNode
    Dim Param1() As String
    Dim Param2() As String
    Dim Param3() As String
    Dim Param4() As String
    Dim Param5() As String
    Dim Param6() As String
    Dim Param7() As String
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

        Select Case Param1(0)
            Case "cetak-jurnal"
                If Param4(1) <> 16 Then
                    Call frmLaporanJurnalHarian.CetakLaporanJurnal(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                    Set Root = New JNode
                    Root("Status") = "Cetak Jurnal"
                ElseIf Param4(1) = 16 Then
                    Call frmLaporanJurnalHarian.CetakLaporanJurnalInap(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                    Set Root = New JNode
                    Root("Status") = "Cetak Jurnal"
                End If
            Case "cetak-jurnal-detail"
                If Param4(1) <> 16 Then
                    Call frmLaporanJurnalDetail.CetakLaporanJurnal(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                    Set Root = New JNode
                    Root("Status") = "Cetak Jurnal"
                ElseIf Param4(1) = 16 Then
                    Call frmLaporanJurnalDetail.CetakLaporanJurnalInap(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                    Set Root = New JNode
                    Root("Status") = "Cetak Jurnal"
                End If
            Case "cetak-jurnal-penjamin"
                Call frmLaporanJurnalPenjamin.CetakLaporanJurnal(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Jurnal"
            
            Case "cetak-jurnal-balik"
                If Param4(1) <> 16 Then
                    Call frmLaporanJurnalBalik.CetakLaporanJurnalBalik(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                    Set Root = New JNode
                    Root("Status") = "Cetak Jurnal"
                ElseIf Param4(1) = 16 Then
                    Call frmLaporanJurnalBalik.CetakLaporanJurnalBalikInap(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                    Set Root = New JNode
                    Root("Status") = "Cetak Jurnal Inap"
                End If
            Case "cetak-jurnal-balik-detail"
                If Param4(1) <> 16 Then
                    Call frmLaporanJurnalBalikDetail.CetakLaporanJurnalBalikDetail(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                    Set Root = New JNode
                    Root("Status") = "Cetak Jurnal"
                ElseIf Param4(1) = 16 Then
                    Call frmLaporanJurnalBalikDetail.CetakLaporanJurnalBalikDetailInap(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                    Set Root = New JNode
                    Root("Status") = "Cetak Jurnal"
                End If
            Case "cetak-jurnal-administrasi"
                If Param4(1) = 16 Then
                    Call frmLaporanJurnaAdmin.CetakLaporanJurnalInap(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                    Set Root = New JNode
                    Root("Status") = "Cetak Jurnal"
                End If
            Case "cetak-jurnal-administrasi-detail"
                If Param4(1) = 16 Then
                    Call frmLaporanJurnalAdminDetail.CetakLaporanJurnalInap(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                    Set Root = New JNode
                    Root("Status") = "Cetak Jurnal"
                End If
            
            Case "cetak-jurnal-rev"
                Call frmLaporanJurnalRev.CetakLaporanJurnal(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Jurnal"
            Case "cetak-jurnal-detail-rev"
                Call frmLaporanJurnalDetailRev.CetakLaporanJurnal(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1))
                Set Root = New JNode
                Root("Status") = "Cetak Jurnal"
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
        Kasir = .Read(adReadAll)
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
    If Printers.count > 0 Then
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





