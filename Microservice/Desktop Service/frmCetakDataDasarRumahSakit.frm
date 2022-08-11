VERSION 5.00
Begin VB.Form frmCetakDataDasarRumahSakit 
   Caption         =   "Transmedic"
   ClientHeight    =   3135
   ClientLeft      =   60
   ClientTop       =   405
   ClientWidth     =   4680
   Icon            =   "frmCetakDataDasarRumahSakit.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   3135
   ScaleWidth      =   4680
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmCetakDataDasarRumahSakit"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
'Project/reference/microsoft excel 12.0 object library
'Selalu gunakan format file excel 2003  .xls sebagai standar agar pengguna excel 2003 atau diatasnya dpt menggunakan report laporannya
'Catatan: Format excel 2000 tidak dpt mengoperasikan beberapa fungsi yg ada pada excell 2003 atau diatasnya

Option Explicit

'Special Buat Excel
Dim oXL As Excel.Application
Dim oWB As Excel.Workbook
Dim oSheet As Excel.Worksheet
Dim oRng As Excel.Range
Dim oResizeRange As Excel.Range
Dim i As Integer
'Special Buat Excel

Dim Cell12 As String
Dim Cell15 As String
Dim Cell18 As String
Dim Cell21 As String
Dim Cell24 As String


Public Sub Cetak()
On Error GoTo hell

'Buka Excel
      Set oXL = CreateObject("Excel.Application")
      
'Buat Buka Template
      Set oWB = oXL.Workbooks.Open(App.Path & "\Formulir RL 1.1.xlsx")
      Set oSheet = oWB.ActiveSheet
      
    Set rs = Nothing

    strSQL = "select * from V_RL_1_1New"
    ReadRs strSQL
    
       With oSheet
       
       'Format(Now, "dd MMM yyyy 00:00:00")
       .Cells(7, 4) = Format(Now, "yyyy")
       .Cells(10, 8) = Trim(IIf(IsNull(rs!KdRs.Value), "", (rs!KdRs.Value)))
       .Cells(11, 8) = Trim(IIf(IsNull(rs!TglSuratIjinLast.Value), "", (rs!TglSuratIjinLast.Value)))
       .Cells(12, 8) = Trim(IIf(IsNull(rs!namaRs.Value), "", (rs!namaRs.Value)))
       .Cells(13, 8) = Trim(IIf(IsNull(rs!JenisProfile.Value), "", (rs!JenisProfile.Value)))
       .Cells(14, 8) = Trim(IIf(IsNull(rs!KelasRS.Value), "", (rs!KelasRS.Value)))
       .Cells(15, 8) = Trim(IIf(IsNull(rs!Direktur.Value), "", (rs!Direktur.Value)))
       .Cells(16, 8) = Trim(IIf(IsNull(rs!PemilikProfile.Value), "", (rs!PemilikProfile.Value)))
       .Cells(17, 8) = Trim(IIf(IsNull(rs!alamat.Value), "", (rs!alamat.Value)))
       .Cells(18, 8) = Trim(IIf(IsNull(rs!KotaKodyaKab.Value), "", (rs!KotaKodyaKab.Value)))
       .Cells(19, 8) = Trim(IIf(IsNull(rs!KodePos.Value), "", (rs!KodePos.Value)))
       .Cells(20, 8) = Trim(IIf(IsNull(rs!Telepon.Value), "", (rs!Telepon.Value)))
       .Cells(21, 8) = Trim(IIf(IsNull(rs!Faks.Value), "", (rs!Faks.Value)))
       .Cells(22, 8) = Trim(IIf(IsNull(rs!Email.Value), "", (rs!Email.Value)))
       .Cells(23, 8) = Trim(IIf(IsNull(rs!Telepon.Value), "", (rs!Telepon.Value)))
       .Cells(24, 8) = Trim(IIf(IsNull(rs!Website.Value), "", (rs!Website.Value)))
       .Cells(26, 8) = "0" 'Sementara
       .Cells(27, 8) = "0" 'Sementara
          
       .Cells(29, 8) = Trim(IIf(IsNull(rs!NoSuratIjinLast.Value), "", (rs!NoSuratIjinLast.Value)))
       .Cells(30, 8) = Trim(IIf(IsNull(rs!TglSuratIjinLast.Value), "", (rs!TglSuratIjinLast.Value)))
       .Cells(31, 8) = Trim(IIf(IsNull(rs!SignatureByLast.Value), "", (rs!SignatureByLast.Value)))
       .Cells(32, 8) = Trim(IIf(IsNull(rs!StatusSuratIjin.Value), "", (rs!StatusSuratIjin.Value)))
       .Cells(33, 8) = Trim(IIf(IsNull(rs!MasaBerlakuIjin.Value), "", (rs!MasaBerlakuIjin.Value)))
       .Cells(34, 8) = "-"
       .Cells(36, 8) = Trim(IIf(IsNull(rs!TahapanAkreditasi.Value), "", (rs!TahapanAkreditasi.Value)))
       .Cells(37, 8) = Trim(IIf(IsNull(rs!statusAkreditasi.Value), "", (rs!statusAkreditasi.Value)))
       .Cells(38, 8) = Trim(IIf(IsNull(rs!TglSuratIjinLast.Value), "", (rs!TglSuratIjinLast.Value)))
               
      End With
      
      Set rs = Nothing
      

'    strSQL1 = "SELECT Singkatan, SUM(JmlBed) AS JmlBed From V_JmlBedPerRuangan GROUP BY Singkatan, TglAwalSK, TglAkhirSK Having (TglAwalSK <= GETDATE()) And ((TglAkhirSK >= GETDATE() or TglAkhirSK is null)) ORDER BY Singkatan"
    strSQL = "SELECT Singkatan, SUM(JmlBed) AS JmlBed From V_JmlBedPerRuangan GROUP BY Singkatan ORDER BY Singkatan"
      
'      Call msubRecFO(rs1, strSQL1)
    ReadRs strSQL
    
      With oSheet
        
        For i = 1 To rs.RecordCount
          If rs!Singkatan = "VVIP" Then
            Call SetcellforVVIP
          ElseIf rs!Singkatan = "VIP" Then
            Call SetcellforVIP
          ElseIf rs!Singkatan = "I" Then
            Call SetcellforI
          ElseIf rs!Singkatan = "II" Then
            Call SetcellforII
          ElseIf rs!Singkatan = "III" Then
            Call SetcellforIII
          End If
          rs.MoveNext
        Next i
      End With
      
      
'      strSQL2 = "select KdJenisPegawai,KdJabatan,NamaJabatan, Bagian,sum(Jumlah) as Jumlah From V_JumlahKaryawanBerdasarkanJabatan Group by KdJenisPegawai,KdJabatan,NamaJabatan,Bagian order by KdJenisPegawai"
      strSQL2 = "select KdKualifikasiJurusan,isnull(count(IdPegawai),0) as Jumlah From V_RL_1_1 Group by KdKualifikasiJurusan order by KdKualifikasiJurusan"
'      Call msubRecFO(rs2, strSQL2)
      ReadRs2 strSQL2
      
      With oSheet
        
        For i = 1 To RS2.RecordCount
          If RS2!KdKualifikasiJurusan = "A9B1" Or RS2!KdKualifikasiJurusan = "273" Then
            Call SetcellforDokterSpesialisAnak
          
          ElseIf RS2!KdKualifikasiJurusan = "A9B6" Then
            Call SetcellforDokterSpesialisKebidanan
          
          ElseIf RS2!KdKualifikasiJurusan = "337" Then
            Call SetcellforDokterSpesialisPenyakitDalam
          
          ElseIf RS2!KdKualifikasiJurusan = "A9C2" Then
            Call SetcellforDokterSpesialisRadiologi
          
          ElseIf RS2!KdKualifikasiJurusan = "A9C3" Or RS2!KdKualifikasiJurusan = "350" Then
            Call SetcellforDokterSpesialisRehabilitasiMedik
          
          ElseIf RS2!KdKualifikasiJurusan = "241" Then
            Call SetcellforDokterSpesialisAnestesiologi
            
          ElseIf RS2!KdKualifikasiJurusan = "0016" Then
            Call SetcellforDokterSpesialisJantung
            
          ElseIf RS2!KdKualifikasiJurusan = "A9B4" Then
            Call SetcellforDokterSpesialisMata
            
          ElseIf RS2!KdKualifikasiJurusan = "A9C5" Or RS2!KdKualifikasiJurusan = "278" Then
            Call SetcellforDokterSpesialisTHT
            
          ElseIf RS2!KdKualifikasiJurusan = "A9A8" Then
            Call SetcellforDokterSpesialisJiwa
            
          ElseIf RS2!KdKualifikasiJurusan = "A8A3" Then
            Call SetcellforDokterUmum
            
          ElseIf RS2!KdKualifikasiJurusan = "A8A1" Or RS2!KdKualifikasiJurusan = "319" Then
            Call SetcellforDokterGigi
            
          ElseIf RS2!KdKualifikasiJurusan = "295" Then
            Call SetcellforDokterGigiSpesialis
            
        ElseIf RS2!KdKualifikasiJurusan = "0031" Then
            Call SetcellforTenagaKesehatanLainnya

          End If
          RS2.MoveNext
        Next i
      End With
      
      strSQL2 = "SELECT COUNT(pegawai_m.id) AS Jumlah" & _
                " FROM V_TenagaKesehatanKeperawatan INNER JOIN" & _
                " pegawai_m ON V_TenagaKesehatanKeperawatan.id = pegawai_m.objectkualifikasijurusanfk"
'      Call msubRecFO(rs2, strSQL2)
        
      ReadRs2 strSQL2
      
      With oSheet
        
            Call SetcellforPerawat

      End With
      
      
      strSQL2 = "SELECT COUNT(pegawai_m.id) AS Jumlah" & _
                " FROM V_TenagaKesehatanKeperawatanBidan INNER JOIN" & _
                " pegawai_m ON V_TenagaKesehatanKeperawatanBidan.id = pegawai_m.objectkualifikasijurusanfk "
'      Call msubRecFO(rs2, strSQL2)
      ReadRs2 strSQL2
      
      With oSheet

            Call SetcellforBidan

      End With
      
      strSQL2 = "SELECT COUNT(pegawai_m.id) AS Jumlah" & _
            " FROM V_TenagaKesehatanFarmasi INNER JOIN" & _
            " pegawai_m ON V_TenagaKesehatanFarmasi.id = pegawai_m.id"
'      Call msubRecFO(rs2, strSQL2)
      
      ReadRs2 strSQL2
      
      With oSheet

            Call SetcellforFarmasi

      End With
      
      strSQL2 = "SELECT Jumlah From V_TenagaNonKesehatan"
'      Call msubRecFO(rs2, strSQL2)
      
      ReadRs2 strSQL2
      
      With oSheet
        If RS2.EOF = True Then
             .Cells(64, 8) = 0
        Else
           Call SetcellforTenagaNonKesehatan
        End If
      End With
        
    
       strSQL2 = "SELECT COUNT(pegawai_m.id) AS Jumlah" & _
                " FROM V_TenagaKesehatanMedisSpesialisBedah INNER JOIN" & _
                " pegawai_m ON V_TenagaKesehatanMedisSpesialisBedah.id = pegawai_m.objectkualifikasijurusanfk"
'      Call msubRecFO(rs2, strSQL2)
      ReadRs2 strSQL2
      
      With oSheet
        If RS2.EOF = True Then
            .Cells(49, 8) = 0
        Else
            Call SetcellforDokterSpesialisBedah
        End If
      End With
              
oXL.Visible = True
Exit Sub
 
hell:
'    msubPesanError
'    Resume 0
    MsgBox Err.Description
'    Resume 0
End Sub

Private Sub SetcellforVVIP()
    With oSheet
    .Cells(40, 8) = Trim(IIf(IsNull(rs!jmlbed), 0, (rs!jmlbed)))
    End With
End Sub

Private Sub SetcellforVIP()
    With oSheet
    .Cells(41, 8) = Trim(IIf(IsNull(rs!jmlbed), 0, (rs!jmlbed)))
    End With
End Sub

Private Sub SetcellforI()
    With oSheet
    .Cells(42, 8) = Trim(IIf(IsNull(rs!jmlbed), 0, (rs!jmlbed)))
    End With
End Sub

Private Sub SetcellforII()
    With oSheet
    .Cells(43, 8) = Trim(IIf(IsNull(rs!jmlbed), 0, (rs!jmlbed)))
    End With
End Sub

Private Sub SetcellforIII()
    With oSheet
    .Cells(44, 8) = Trim(IIf(IsNull(rs!jmlbed), 0, (rs!jmlbed)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisAnak()
    With oSheet
    .Cells(46, 8) = Trim(IIf(IsNull(RS2!jumlah), 0, (RS2!jumlah)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisKebidanan()
    With oSheet
    .Cells(47, 8) = Trim(IIf(IsNull(RS2!jumlah), 0, (RS2!jumlah)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisPenyakitDalam()
    With oSheet
    .Cells(48, 8) = Trim(IIf(IsNull(RS2!jumlah), 0, (RS2!jumlah)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisBedah()
    With oSheet
    .Cells(49, 8) = Trim(IIf(IsNull(RS2!jumlah), 0, (RS2!jumlah)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisRadiologi()
    With oSheet
    .Cells(50, 8) = Trim(IIf(IsNull(RS2!jumlah), 0, (RS2!jumlah)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisRehabilitasiMedik()
    With oSheet
    .Cells(51, 8) = Trim(IIf(IsNull(RS2!jumlah), 0, (RS2!jumlah)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisAnestesiologi()
    With oSheet
    .Cells(52, 8) = Trim(IIf(IsNull(RS2!jumlah), 0, (RS2!jumlah)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisJantung()
    With oSheet
    .Cells(53, 8) = Trim(IIf(IsNull(RS2!jumlah), 0, (RS2!jumlah)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisMata()
    With oSheet
    .Cells(54, 8) = Trim(IIf(IsNull(RS2!jumlah), 0, (RS2!jumlah)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisTHT()
    With oSheet
    .Cells(55, 8) = Trim(IIf(IsNull(RS2!jumlah), 0, (RS2!jumlah)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisJiwa()
    With oSheet
    .Cells(56, 8) = Trim(IIf(IsNull(RS2!jumlah), 0, (RS2!jumlah)))
    End With
End Sub

Private Sub SetcellforDokterUmum()
    With oSheet
    .Cells(57, 8) = Trim(IIf(IsNull(RS2!jumlah), 0, (RS2!jumlah)))
    End With
End Sub

Private Sub SetcellforDokterGigi()
    With oSheet
    .Cells(58, 8) = Trim(IIf(IsNull(RS2!jumlah), 0, (RS2!jumlah)))
    End With
End Sub

Private Sub SetcellforDokterGigiSpesialis()
    With oSheet
    .Cells(59, 8) = Trim(IIf(IsNull(RS2!jumlah), 0, (RS2!jumlah)))
    End With
End Sub

Private Sub SetcellforPerawat()
    With oSheet
    .Cells(60, 8) = Trim(IIf(IsNull(RS2!jumlah), 0, (RS2!jumlah)))
    End With
End Sub

Private Sub SetcellforBidan()
    With oSheet
    .Cells(61, 8) = Trim(IIf(IsNull(RS2!jumlah), 0, (RS2!jumlah)))
    End With
End Sub

Private Sub SetcellforFarmasi()
    With oSheet
    .Cells(62, 8) = Trim(IIf(IsNull(RS2!jumlah), 0, (RS2!jumlah)))
    End With
End Sub

Private Sub SetcellforTenagaKesehatanLainnya()
    With oSheet
    .Cells(63, 8) = Trim(IIf(IsNull(RS2!jumlah), 0, (RS2!jumlah)))
    End With
End Sub

Private Sub SetcellforTenagaNonKesehatan()
    With oSheet
    .Cells(64, 8) = Trim(IIf(IsNull(RS2!jumlah), 0, (RS2!jumlah)))
    End With
End Sub

Private Sub Form_Unload(Cancel As Integer)
    On Error Resume Next
    oXL.Quit
End Sub


