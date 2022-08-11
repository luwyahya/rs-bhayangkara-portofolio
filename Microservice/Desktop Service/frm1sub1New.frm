VERSION 5.00
Begin VB.Form frm1sub1New 
   BorderStyle     =   1  'Fixed Single
   Caption         =   "Medifirst2000 - RL 1.1 Data Dasar Rumah Sakit"
   ClientHeight    =   2055
   ClientLeft      =   45
   ClientTop       =   435
   ClientWidth     =   5205
   Icon            =   "frm1sub1New.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MDIChild        =   -1  'True
   MinButton       =   0   'False
   ScaleHeight     =   2055
   ScaleWidth      =   5205
   Begin VB.Frame fraButton 
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   8.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   735
      Left            =   0
      TabIndex        =   0
      Top             =   1320
      Width           =   5205
      Begin VB.CommandButton cmdCetak 
         Caption         =   "&Cetak"
         BeginProperty Font 
            Name            =   "Tahoma"
            Size            =   9
            Charset         =   0
            Weight          =   400
            Underline       =   0   'False
            Italic          =   0   'False
            Strikethrough   =   0   'False
         EndProperty
         Height          =   375
         Left            =   240
         TabIndex        =   2
         Top             =   240
         Width           =   1905
      End
      Begin VB.CommandButton cmdTutup 
         Caption         =   "Tutu&p"
         BeginProperty Font 
            Name            =   "Tahoma"
            Size            =   9
            Charset         =   0
            Weight          =   400
            Underline       =   0   'False
            Italic          =   0   'False
            Strikethrough   =   0   'False
         EndProperty
         Height          =   375
         Left            =   3120
         TabIndex        =   1
         Top             =   240
         Width           =   1935
      End
   End
   Begin VB.Image Image2 
      Height          =   945
      Left            =   3120
      Picture         =   "frm1sub1New.frx":0CCA
      Stretch         =   -1  'True
      Top             =   0
      Width           =   2115
   End
   Begin VB.Image Image3 
      Height          =   975
      Left            =   0
      Picture         =   "frm1sub1New.frx":1A52
      Stretch         =   -1  'True
      Top             =   0
      Width           =   1800
   End
   Begin VB.Image Image1 
      Height          =   975
      Left            =   1800
      Picture         =   "frm1sub1New.frx":4413
      Stretch         =   -1  'True
      Top             =   0
      Width           =   3495
   End
End
Attribute VB_Name = "frm1sub1New"
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
Dim oSheet As Excel.WORKSHEET
Dim oRng As Excel.Range
Dim oResizeRange As Excel.Range
Dim i As Integer
'Special Buat Excel

Dim Cell12 As String
Dim Cell15 As String
Dim Cell18 As String
Dim Cell21 As String
Dim Cell24 As String


Private Sub cmdCetak_Click()
On Error GoTo hell

'Buka Excel
      Set oXL = CreateObject("Excel.Application")
      
'Buat Buka Template
      Set oWB = oXL.Workbooks.Open(App.Path & "\Formulir RL 1.1.xlsx")
      Set oSheet = oWB.ActiveSheet
      
    Set RS = Nothing

    strSQL = "select * from V_RL1_1New"
    Call msubRecFO(RS, strSQL)
    
       With oSheet
       
       'Format(Now, "dd MMM yyyy 00:00:00")
       .Cells(7, 4) = Format(Now, "yyyy")
       .Cells(10, 8) = Trim(IIf(IsNull(RS!KdRs.Value), "", (RS!KdRs.Value)))
       .Cells(11, 8) = Trim(IIf(IsNull(RS!TglSuratIjinLast.Value), "", (RS!TglSuratIjinLast.Value)))
       .Cells(12, 8) = Trim(IIf(IsNull(RS!NamaRS.Value), "", (RS!NamaRS.Value)))
       .Cells(13, 8) = Trim(IIf(IsNull(RS!JenisProfile.Value), "", (RS!JenisProfile.Value)))
       .Cells(14, 8) = Trim(IIf(IsNull(RS!KelasRS.Value), "", (RS!KelasRS.Value)))
       .Cells(15, 8) = Trim(IIf(IsNull(RS!Direktur.Value), "", (RS!Direktur.Value)))
       .Cells(16, 8) = Trim(IIf(IsNull(RS!PemilikProfile.Value), "", (RS!PemilikProfile.Value)))
       .Cells(17, 8) = Trim(IIf(IsNull(RS!alamat.Value), "", (RS!alamat.Value)))
       .Cells(18, 8) = Trim(IIf(IsNull(RS!KotaKodyaKab.Value), "", (RS!KotaKodyaKab.Value)))
       .Cells(19, 8) = Trim(IIf(IsNull(RS!KodePos.Value), "", (RS!KodePos.Value)))
       .Cells(20, 8) = Trim(IIf(IsNull(RS!Telepon.Value), "", (RS!Telepon.Value)))
       .Cells(21, 8) = Trim(IIf(IsNull(RS!Faks.Value), "", (RS!Faks.Value)))
       .Cells(22, 8) = Trim(IIf(IsNull(RS!Email.Value), "", (RS!Email.Value)))
       .Cells(23, 8) = Trim(IIf(IsNull(RS!Telepon.Value), "", (RS!Telepon.Value)))
       .Cells(24, 8) = Trim(IIf(IsNull(RS!Website.Value), "", (RS!Website.Value)))
       .Cells(26, 8) = "0" 'Sementara
       .Cells(27, 8) = "0" 'Sementara
          
       .Cells(29, 8) = Trim(IIf(IsNull(RS!NoSuratIjinLast.Value), "", (RS!NoSuratIjinLast.Value)))
       .Cells(30, 8) = Trim(IIf(IsNull(RS!TglSuratIjinLast.Value), "", (RS!TglSuratIjinLast.Value)))
       .Cells(31, 8) = Trim(IIf(IsNull(RS!SignatureByLast.Value), "", (RS!SignatureByLast.Value)))
       .Cells(32, 8) = Trim(IIf(IsNull(RS!StatusSuratIjin.Value), "", (RS!StatusSuratIjin.Value)))
       .Cells(33, 8) = Trim(IIf(IsNull(RS!MasaBerlakuIjin.Value), "", (RS!MasaBerlakuIjin.Value)))
       .Cells(34, 8) = "-"
       .Cells(36, 8) = Trim(IIf(IsNull(RS!TahapanAkreditasi.Value), "", (RS!TahapanAkreditasi.Value)))
       .Cells(37, 8) = Trim(IIf(IsNull(RS!statusAkreditasi.Value), "", (RS!statusAkreditasi.Value)))
       .Cells(38, 8) = Trim(IIf(IsNull(RS!TglSuratIjinLast.Value), "", (RS!TglSuratIjinLast.Value)))
               
      End With
      
      Set rs1 = Nothing
      
'      strSQL1 = "select Kelas, sum(JmlBed) as JmlBed from V_JmlBedPerRuangan Group by Kelas order by Kelas"
'      strSQL1 = "SELECT Kelas, SUM(JmlBed) AS JmlBed From V_JmlBedPerRuangan GROUP BY Kelas, TglAwalSK, TglAkhirSK Having (TglAwalSK <= GETDATE()) And (TglAkhirSK >= GETDATE())ORDER BY Kelas"


'############## splakuk 19/9/2013
    strSQL1 = "SELECT Singkatan, SUM(JmlBed) AS JmlBed From V_JmlBedPerRuangan GROUP BY Singkatan, TglAwalSK, TglAkhirSK Having (TglAwalSK <= GETDATE()) And ((TglAkhirSK >= GETDATE() or TglAkhirSK is null)) ORDER BY Singkatan"
      Call msubRecFO(rs1, strSQL1)
      
      With oSheet
        
        For i = 1 To rs1.RecordCount
          If rs1!Singkatan = "VVIP" Then
            Call SetcellforVVIP
          ElseIf rs1!Singkatan = "VIP" Then
            Call SetcellforVIP
          ElseIf rs1!Singkatan = "I" Then
            Call SetcellforI
          ElseIf rs1!Singkatan = "II" Then
            Call SetcellforII
          ElseIf rs1!Singkatan = "III" Then
            Call SetcellforIII
          End If
          rs1.MoveNext
        Next i
      End With
      
      
'      strSQL2 = "select KdJenisPegawai,KdJabatan,NamaJabatan, Bagian,sum(Jumlah) as Jumlah From V_JumlahKaryawanBerdasarkanJabatan Group by KdJenisPegawai,KdJabatan,NamaJabatan,Bagian order by KdJenisPegawai"
      strSQL2 = "select KdKualifikasiJurusan,isnull(count(IdPegawai),0) as Jumlah From V_RL1_1 Group by KdKualifikasiJurusan order by KdKualifikasiJurusan"
      Call msubRecFO(RS2, strSQL2)
      
      With oSheet
        
        For i = 1 To RS2.RecordCount
          If RS2!KdKualifikasiJurusan = "0005" Then
            Call SetcellforDokterSpesialisAnak
          ElseIf RS2!KdKualifikasiJurusan = "0006" Then
            Call SetcellforDokterSpesialisKebidanan
          ElseIf RS2!KdKualifikasiJurusan = "0004" Then
            Call SetcellforDokterSpesialisPenyakitDalam
          
          ElseIf RS2!KdKualifikasiJurusan = "0007" Then
            Call SetcellforDokterSpesialisRadiologi
          ElseIf RS2!KdKualifikasiJurusan = "0024" Then
            Call SetcellforDokterSpesialisRehabilitasiMedik
          ElseIf RS2!KdKualifikasiJurusan = "0010" Then
            Call SetcellforDokterSpesialisAnestesiologi
          ElseIf RS2!KdKualifikasiJurusan = "0016" Then
            Call SetcellforDokterSpesialisJantung
          ElseIf RS2!KdKualifikasiJurusan = "0013" Then
            Call SetcellforDokterSpesialisMata
          ElseIf RS2!KdKualifikasiJurusan = "0014" Then
            Call SetcellforDokterSpesialisTHT
          ElseIf RS2!KdKualifikasiJurusan = "0012" Then
            Call SetcellforDokterSpesialisJiwa
          ElseIf RS2!KdKualifikasiJurusan = "0001" Then
            Call SetcellforDokterUmum
          ElseIf RS2!KdKualifikasiJurusan = "0033" Then
            Call SetcellforDokterGigi
          ElseIf RS2!KdKualifikasiJurusan = "0034" Then
            Call SetcellforDokterGigiSpesialis
        ElseIf RS2!KdKualifikasiJurusan = "0031" Then
            Call SetcellforTenagaKesehatanLainnya

          End If
          RS2.MoveNext
        Next i
      End With
      
      strSQL2 = "SELECT COUNT(DataCurrentPegawai.IdPegawai) AS Jumlah" & _
                " FROM V_RL2_TenagaKesehatanKeperawatan INNER JOIN" & _
                " DataCurrentPegawai ON V_RL2_TenagaKesehatanKeperawatan.KdKualifikasiJurusan = DataCurrentPegawai.KdKualifikasiJurusan"
      Call msubRecFO(RS2, strSQL2)
      
      With oSheet
        
            Call SetcellforPerawat

      End With
      
      
      strSQL2 = "SELECT COUNT(DataCurrentPegawai.IdPegawai) AS Jumlah" & _
                " FROM V_RL2_TenagaKesehatanKeperawatan INNER JOIN" & _
                " DataCurrentPegawai ON V_RL2_TenagaKesehatanKeperawatan.KdKualifikasiJurusan = DataCurrentPegawai.KdKualifikasiJurusan where V_RL2_TenagaKesehatanKeperawatan.KdKualifikasiJurusan IN('0046','0047','0048') "
      Call msubRecFO(RS2, strSQL2)
      
      With oSheet

            Call SetcellforBidan

      End With
      
    strSQL2 = "SELECT COUNT(DataCurrentPegawai.IdPegawai) AS Jumlah" & _
            " FROM V_RL2_TenagaKesehatanFarmasi INNER JOIN" & _
            " DataCurrentPegawai ON V_RL2_TenagaKesehatanFarmasi.KdKualifikasiJurusan = DataCurrentPegawai.KdKualifikasiJurusan"
      Call msubRecFO(RS2, strSQL2)
      
      With oSheet

            Call SetcellforFarmasi

      End With
      
      strSQL2 = "SELECT COUNT(DataCurrentPegawai.IdPegawai) AS Jumlah" & _
                " FROM DataCurrentPegawai INNER JOIN" & _
                " KualifikasiJurusan ON DataCurrentPegawai.KdKualifikasiJurusan = KualifikasiJurusan.KdKualifikasiJurusan INNER JOIN " & _
                " DetailKelompokPegawai ON KualifikasiJurusan.KdDetailKelompokPegawai = DetailKelompokPegawai.KdDetailKelompokPegawai" & _
                " GROUP BY DetailKelompokPegawai.KdKelompokPegawai" & _
                " HAVING(DetailKelompokPegawai.KdKelompokPegawai = '02')"
      Call msubRecFO(RS2, strSQL2)
      
      With oSheet
        If RS2.EOF = True Then
             .Cells(64, 8) = 0
        Else
           Call SetcellforTenagaNonKesehatan
        End If
      End With
        
    
       strSQL2 = "SELECT COUNT(DataCurrentPegawai.IdPegawai) AS Jumlah" & _
                " FROM V_RL2_TenagaKesehatanMedis INNER JOIN" & _
                " DataCurrentPegawai ON V_RL2_TenagaKesehatanMedis.KdKualifikasiJurusan = DataCurrentPegawai.KdKualifikasiJurusan where V_RL2_TenagaKesehatanMedis.KdKualifikasiJurusan IN('0003','0019','0020') "
      Call msubRecFO(RS2, strSQL2)
      
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
    msubPesanError
End Sub

Private Sub cmdTutup_Click()
    Unload Me
End Sub

Private Sub Form_Load()
    Call PlayFlashMovie(Me)
    Call centerForm(Me, MDIUtama)
End Sub

Private Sub SetcellforVVIP()
    With oSheet
    .Cells(40, 8) = Trim(IIf(IsNull(rs1!jmlbed), 0, (rs1!jmlbed)))
    End With
End Sub
Private Sub SetcellforVIP()
    With oSheet
    .Cells(41, 8) = Trim(IIf(IsNull(rs1!jmlbed), 0, (rs1!jmlbed)))
    End With
End Sub
Private Sub SetcellforI()
    With oSheet
    .Cells(42, 8) = Trim(IIf(IsNull(rs1!jmlbed), 0, (rs1!jmlbed)))
    End With
End Sub
Private Sub SetcellforII()
    With oSheet
    .Cells(43, 8) = Trim(IIf(IsNull(rs1!jmlbed), 0, (rs1!jmlbed)))
    End With
End Sub
Private Sub SetcellforIII()
    With oSheet
    .Cells(44, 8) = Trim(IIf(IsNull(rs1!jmlbed), 0, (rs1!jmlbed)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisAnak()
    With oSheet
    .Cells(46, 8) = Trim(IIf(IsNull(RS2!Jumlah), 0, (RS2!Jumlah)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisKebidanan()
    With oSheet
    .Cells(47, 8) = Trim(IIf(IsNull(RS2!Jumlah), 0, (RS2!Jumlah)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisPenyakitDalam()
    With oSheet
    .Cells(48, 8) = Trim(IIf(IsNull(RS2!Jumlah), 0, (RS2!Jumlah)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisBedah()
    With oSheet
    .Cells(49, 8) = Trim(IIf(IsNull(RS2!Jumlah), 0, (RS2!Jumlah)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisRadiologi()
    With oSheet
    .Cells(50, 8) = Trim(IIf(IsNull(RS2!Jumlah), 0, (RS2!Jumlah)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisRehabilitasiMedik()
    With oSheet
    .Cells(51, 8) = Trim(IIf(IsNull(RS2!Jumlah), 0, (RS2!Jumlah)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisAnestesiologi()
    With oSheet
    .Cells(52, 8) = Trim(IIf(IsNull(RS2!Jumlah), 0, (RS2!Jumlah)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisJantung()
    With oSheet
    .Cells(53, 8) = Trim(IIf(IsNull(RS2!Jumlah), 0, (RS2!Jumlah)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisMata()
    With oSheet
    .Cells(54, 8) = Trim(IIf(IsNull(RS2!Jumlah), 0, (RS2!Jumlah)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisTHT()
    With oSheet
    .Cells(55, 8) = Trim(IIf(IsNull(RS2!Jumlah), 0, (RS2!Jumlah)))
    End With
End Sub

Private Sub SetcellforDokterSpesialisJiwa()
    With oSheet
    .Cells(56, 8) = Trim(IIf(IsNull(RS2!Jumlah), 0, (RS2!Jumlah)))
    End With
End Sub

Private Sub SetcellforDokterUmum()
    With oSheet
    .Cells(57, 8) = Trim(IIf(IsNull(RS2!Jumlah), 0, (RS2!Jumlah)))
    End With
End Sub

Private Sub SetcellforDokterGigi()
    With oSheet
    .Cells(58, 8) = Trim(IIf(IsNull(RS2!Jumlah), 0, (RS2!Jumlah)))
    End With
End Sub

Private Sub SetcellforDokterGigiSpesialis()
    With oSheet
    .Cells(59, 8) = Trim(IIf(IsNull(RS2!Jumlah), 0, (RS2!Jumlah)))
    End With
End Sub

Private Sub SetcellforPerawat()
    With oSheet
    .Cells(60, 8) = Trim(IIf(IsNull(RS2!Jumlah), 0, (RS2!Jumlah)))
    End With
End Sub

Private Sub SetcellforBidan()
    With oSheet
    .Cells(61, 8) = Trim(IIf(IsNull(RS2!Jumlah), 0, (RS2!Jumlah)))
    End With
End Sub

Private Sub SetcellforFarmasi()
    With oSheet
    .Cells(62, 8) = Trim(IIf(IsNull(RS2!Jumlah), 0, (RS2!Jumlah)))
    End With
End Sub

Private Sub SetcellforTenagaKesehatanLainnya()
    With oSheet
    .Cells(63, 8) = Trim(IIf(IsNull(RS2!Jumlah), 0, (RS2!Jumlah)))
    End With
End Sub

Private Sub SetcellforTenagaNonKesehatan()
    With oSheet
    .Cells(64, 8) = Trim(IIf(IsNull(RS2!Jumlah), 0, (RS2!Jumlah)))
    End With
End Sub

Private Sub Form_Unload(Cancel As Integer)
On Error Resume Next
oXL.Quit
End Sub
