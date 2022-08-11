VERSION 5.00
Object = "{F9043C88-F6F2-101A-A3C9-08002B2F49FB}#1.2#0"; "comdlg32.ocx"
Begin VB.Form frmLogistik 
   BorderStyle     =   1  'Fixed Single
   Caption         =   "Logistik"
   ClientHeight    =   960
   ClientLeft      =   45
   ClientTop       =   375
   ClientWidth     =   5040
   Icon            =   "frmLogistik.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   960
   ScaleWidth      =   5040
   StartUpPosition =   3  'Windows Default
   Begin MSComDlg.CommonDialog CommonDialog1 
      Left            =   1920
      Top             =   240
      _ExtentX        =   847
      _ExtentY        =   847
      _Version        =   393216
   End
End
Attribute VB_Name = "frmLogistik"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Public Function Logistik(ByVal QueryText As String) As Byte()
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
    Dim Param10() As String
    Dim Param11() As String
    Dim Param12() As String
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
        Param10 = Split(arrItem(9), "=")
        Param11 = Split(arrItem(10), "=")
        Param12 = Split(arrItem(11), "=")
        Select Case Param1(0)
            Case "cek-konek"
'                lblStatus.Caption = "Cek"
                Set Root = New JNode
                Root("Status") = "Ok!!"
                
            Case "cetak-rincian-penerimaan"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
'                lblStatus.Caption = "Cetak Struk Resep"
                Call frmCetakBuktiPenerimaanBarang.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=f9b07b20-81d9-11e7-8420-d5194da3&view=true&user=Gregorius
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
          Case "cetak-detail-penerimaan-sp-sum"
                    Param1 = Split(arrItem(0), "=")
                    Param2 = Split(arrItem(1), "=")
                    Param3 = Split(arrItem(2), "=")
                    Param4 = Split(arrItem(3), "=")
                    Param5 = Split(arrItem(4), "=")
                    Param6 = Split(arrItem(4), "=")
'                lblStatus.Caption = "Cetak Struk Resep"
                Call frmDetailPenerimaanSP2.Cetak(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1))
                'http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=f9b07b20-81d9-11e7-8420-d5194da3&view=true&user=Gregorius
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-bukti-penerimaan"
'                lblStatus.Caption = "Cetak Struk Resep"
                Call frmCetakBuktiPenerimaanBarang2.Cetak(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param10(1))
                'http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=f9b07b20-81d9-11e7-8420-d5194da3&view=true&user=Gregorius
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            
            Case "cetak-bukti-pengeluaran"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
'                lblStatus.Caption = "Cetak Struk Resep"
                Call frmCetakBuktiPengeluaranBarang.Cetak(Param1(1), Param2(1), (Param3(1)), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param10(1))
                'http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=f9b07b20-81d9-11e7-8420-d5194da3&view=true&user=Gregorius
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            
            Case "cetak-bukti-order"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Param10 = Split(arrItem(9), "=")
                Param11 = Split(arrItem(10), "=")
                Param12 = Split(arrItem(11), "=")
'                lblStatus.Caption = "Cetak Struk Resep"
                Call frmCetakBuktiOrderBarang.Cetak(Param1(1), Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1), Param9(1), Param10(1), Param11(1), Param12(1))
                'http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=f9b07b20-81d9-11e7-8420-d5194da3&view=true&user=Gregorius
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            
            Case "cetak-rekap-pengeluaran"
'                lblStatus.Caption = "Cetak Struk Resep"
                Call frmCetakRekapPengeluaranBarang.Cetak(Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=f9b07b20-81d9-11e7-8420-d5194da3&view=true&user=Gregorius
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-rekap-penerimaan"
'                lblStatus.Caption = "Cetak Struk Resep"
                Call frmCetakRekapPenerimaanBarang.Cetak(Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=f9b07b20-81d9-11e7-8420-d5194da3&view=true&user=Gregorius
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-struk-retur"
'                lblStatus.Caption = "Cetak Struk Resep"
                Call frmCetakFarmasiRetur.cetakStrukRetur(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=f9b07b20-81d9-11e7-8420-d5194da3&view=true&user=Gregorius
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "as@epic"
            
            Case "cetak-label-etiket"
'                lblStatus.Caption = "Cetak Label Etiket"
                Call CETAK_Etiket(Param2(1), Val(Param3(1)))
                'http://127.0.0.1:1237/printvb/farmasiApotik?cetak-label-etiket=1&norec=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "as@epic"
            
                Case "cetak-stokopname"
                Call frmCetakStokOpname.Cetak(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1))
'                'http://127.0.0.1:1237/printvb/farmasiApotik?cetak-stokopname=1&tglAwal=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-SPPB"
                Call frmCetakSPPB.Cetak(Param2(1), Param3(1))
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            
            Case "cetak-usulanpermintaanbarang"
                Call frmCetakUsulanPermintaanBarang.Cetak(Param2(1), Param3(1))
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            
            Case "cetak-rekap-amprahan"
'                lblStatus.Caption = "Cetak Struk Resep"
                Call frmCetakRekapAmprah.Cetak(Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=f9b07b20-81d9-11e7-8420-d5194da3&view=true&user=Gregorius
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            
            Case "upload-file-so"
                Me.Show
                CommonDialog1.Filter = "Apps (*.txt)|*.txt|All files (*.*)|*.*"
                CommonDialog1.DefaultExt = "txt"
                CommonDialog1.DialogTitle = "Select File"
                CommonDialog1.ShowOpen
                
                Dim strEmpFileName As String
                Dim strBackSlash As String
                Dim intEmpFileNbr As Integer
                
                Dim kd As String
                Dim qty As Double
                 
                
                strBackSlash = IIf(Right$(App.Path, 1) = "\", "", "\")
                strEmpFileName = CommonDialog1.filename 'App.Path & strBackSlash & "EMPLOYEE.DAT"
                intEmpFileNbr = FreeFile
                
                Open strEmpFileName For Input As #intEmpFileNbr
                
                Do Until EOF(intEmpFileNbr)
                    Input #intEmpFileNbr, kd
                    MsgBox kd
                Loop
                
                'The FileName property gives you the variable you need to use
'                MsgBox CommonDialog1.filename
                
                'Call frmCetakRekapAmprah.cetak(Param2(1), Param3(1), Param4(1), Param5(1))
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-usulanpelaksanaankegiatan"
                Call frmCetakUsulanPelaksanaanKegiatan.Cetak(Param2(1), Param3(1))
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            
            Case "cetak-hps"
                Call frmCetakHargaPerkiraanSendiri.Cetak(Param2(1), Param3(1))
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            
            Case "cetak-riwayatpersediaan"
                Call frmCetakRiwayatPenerimaandanPengeluaran.Cetak(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1))
'               http://127.0.0.1:1237/printvb/logistik?cetak-riwayatpersediaan=1&tglAwal=2018-05-31%2000:00&tglAkhir=2018-05-31%2023:59&idriwayat=IR18050001&view=true&user=Administrator
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-spk"
                Call frmCetakSPK.Cetak(Param2(1), Param3(1))
'               http://127.0.0.1:1237/printvb/logistik?cetak-spk=1&nores=2c7ab260-2bfc-11e8-831c-359d06cb&view=true&user=Administrator
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-rekappersediaan"
                Call frmCetakLaporanPersediaan.Cetak(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1))
'               http://127.0.0.1:1237/printvb/logistik?cetak-rekappersediaan=1&tglAwal=2018-05-31%2000:00&tglAkhir=2018-05-31%2023:59&view=true&user=Administrator
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-stokruangan"
                Call frmCetakStokRuangan.Cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/logistik?cetak-stokruangan=1&strIdRuangan=94&view=true&user=Administrator
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            
            Case "cetak-stokopname2"
                Call frmCetakStokOpnameRev.Cetak(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1))
'                'http://127.0.0.1:1237/printvb/farmasiApotik?cetak-stokopname=1&tglAwal=6a287c10-8cce-11e7-943b-2f7b4944&cetak=1
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-daftar-pengeluaran-barang"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
'                lblStatus.Caption = "Cetak Struk Resep"
                Call frmCetakDaftarPengeluaranBarang.Cetak(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), Param7(1), Param8(1))
                'http://127.0.0.1:1237/printvb/farmasiApotik?cetak-strukresep=1&nores=f9b07b20-81d9-11e7-8420-d5194da3&view=true&user=Gregorius
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-rekapjasaresep"
                Call frmCetakLaporanPersediaan.rekapjasaresep(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1))
'               http://127.0.0.1:1237/printvb/logistik?cetak-rekappersediaan=1&tglAwal=2018-05-31%2000:00&tglAkhir=2018-05-31%2023:59&view=true&user=Administrator
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-laporan-penerimaan-supplier"
                Call frmCetakLaporanSuplier.Cetak(Param2(1), Param3(1), Param4(1), Param4(1), Param5(1))
'               http://127.0.0.1:1237/printvb/logistik?cetak-rekappersediaan=1&tglAwal=2018-05-31%2000:00&tglAkhir=2018-05-31%2023:59&view=true&user=Administrator
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-laporan-penerimaan-supplier-rekap"
                Call frmCetakLaporanSuplierPerBrg.Cetak(Param2(1), Param3(1), Param4(1))
'               http://127.0.0.1:1237/printvb/logistik?cetak-rekappersediaan=1&tglAwal=2018-05-31%2000:00&tglAkhir=2018-05-31%2023:59&view=true&user=Administrator
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
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
        farmasiApotik = .Read(adReadAll)
        .Close
    End With
    If CN.State = adStateOpen Then CN.Close
    Unload Me
    Exit Function
errLoad:
End Function

Private Sub CETAK_Etiket(strNorec As String, jumlahCetak As Integer)
On Error GoTo errLoad
    Dim prn As Printer
    Dim strPrinter As String
    
    Dim NoAntri As String
    Dim jmlAntrian As Integer
    Dim jenis As String
    
    Set rs = Nothing
    rs.Open "select sr.noresep,to_char(sr.tglresep , 'DD-MON-YYYY') as tglresep, pp.aturanpakai,pp.keteranganpakai2, " & _
            "upper(pr.namaproduk) as namaproduk,upper(ps.namapasien) as namapasien, " & _
            "to_char(ps.tgllahir , 'DD-MON-YYYY') as tglLahir,pr.keterangan " & _
            "from strukresep_t as sr " & _
            "INNER JOIN pelayananpasien_t as pp on pp.strukresepfk=sr.norec " & _
            "INNER JOIN produk_m as pr on pr.id=pp.produkfk " & _
            "INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk " & _
            "INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
            "INNER JOIN pasien_m as ps on ps.id=pd.nocmfk " & _
            "where sr.norec='" & strNorec & "'", CN, adOpenStatic, adLockReadOnly
    
    strPrinter = GetTxt("Setting.ini", "Printer", "CetakLabelEtiket")
    If Printers.Count > 0 Then
        For Each prn In Printers
            If prn.DeviceName = strPrinter Then
                Set Printer = prn
                Exit For
            End If
        Next prn
    End If
    
    Dim ii As Integer
    
    For ii = 0 To rs.RecordCount - 1
        For i = 1 To jumlahCetak
            Printer.Print "^XA"
            Printer.Print "^FO20,20^IME:RSAB.GRF^FS"
            Printer.Print "^FO5,80^GB550,1,1^FS"
            
            Printer.Print "^CFA,20"
            Printer.Print "^FO10,90^FDNo Resep :" & rs!noresep & " Tgl Resep :" & rs!tglresep & "^FS"
            Printer.Print "^CFA,21"
            Printer.Print "^FO70,120^FB400,3,0,C,0^FD" & rs!namapasien & "/" & rs!tgllahir & "^FS"
            
            Printer.Print "^CFA,23"
            Printer.Print "^FO70,160^FB400,3,0,C,0^FD" & rs!aturanpakai & "/" & rs!keteranganpakai2 & "^FS"
            
            Printer.Print "^CFA,20"
            Printer.Print "^FO10,230^FB250,3,0,C,0^FD" & rs!namaproduk & "^FS"
            
            Printer.Print "^CFA,21"
            Printer.Print "^FO290,230^FB250,3,0,C,0^FD" & rs!Keterangan & "^FS"
            
            Printer.Print "^XZ"
            Printer.EndDoc
        Next
        rs.MoveNext
    Next
    Exit Sub
    
errLoad:
End Sub
