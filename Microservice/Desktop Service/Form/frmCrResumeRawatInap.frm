VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCrResumeRawatInap 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCrResumeRawatInap.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7005
   ScaleWidth      =   5820
   WindowState     =   2  'Maximized
   Begin VB.CommandButton cmdOption 
      Caption         =   "Option"
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   315
      Left            =   4920
      TabIndex        =   4
      Top             =   480
      Width           =   975
   End
   Begin VB.CommandButton cmdCetak 
      Caption         =   "Cetak"
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   315
      Left            =   3960
      TabIndex        =   3
      Top             =   480
      Width           =   975
   End
   Begin VB.ComboBox cboPrinter 
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   315
      Left            =   960
      TabIndex        =   2
      Top             =   480
      Width           =   3015
   End
   Begin CRVIEWERLibCtl.CRViewer CRViewer1 
      Height          =   7000
      Left            =   0
      TabIndex        =   0
      Top             =   0
      Width           =   5800
      DisplayGroupTree=   -1  'True
      DisplayToolbar  =   -1  'True
      EnableGroupTree =   0   'False
      EnableNavigationControls=   -1  'True
      EnableStopButton=   -1  'True
      EnablePrintButton=   -1  'True
      EnableZoomControl=   -1  'True
      EnableCloseButton=   -1  'True
      EnableProgressControl=   -1  'True
      EnableSearchControl=   -1  'True
      EnableRefreshButton=   -1  'True
      EnableDrillDown =   -1  'True
      EnableAnimationControl=   -1  'True
      EnableSelectExpertButton=   -1  'True
      EnableToolbar   =   -1  'True
      DisplayBorder   =   -1  'True
      DisplayTabs     =   -1  'True
      DisplayBackgroundEdge=   -1  'True
      SelectionFormula=   ""
      EnablePopupMenu =   -1  'True
      EnableExportButton=   -1  'True
      EnableSearchExpertButton=   -1  'True
      EnableHelpButton=   -1  'True
   End
   Begin VB.TextBox txtNamaFormPengirim 
      Height          =   495
      Left            =   3120
      TabIndex        =   1
      Top             =   600
      Width           =   2175
   End
End
Attribute VB_Name = "frmCrResumeRawatInap"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crResumeRawatInap

Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String

Private Sub cmdCetak_Click()
    Report.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
    'PrinterNama = cboPrinter.Text
    Report.PrintOut False
End Sub

Private Sub CmdOption_Click()
    Report.PrinterSetup Me.hwnd
    CRViewer1.Refresh
End Sub

Private Sub Form_Load()
    Dim p As Printer
    cboPrinter.Clear
    For Each p In Printers
        cboPrinter.AddItem p.DeviceName
    Next
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "PasienDaftar")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCrResumeRawatInap = Nothing
End Sub

Public Sub Cetak(noCm As String, norec As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCrResumeRawatInap = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter, strFilter1 As String
'Set Report = New crLaporanPasienDaftar
Set Report = New crResumeRawatInap
Dim strSQL As String
Dim str1, str2, str3, str4 As String
      
    strSQL = "select rm.norec,format( rm.tglresume,'dd-MM-yyyy HH:mm')as tglresume,  ru.namaruangan,  pg.namalengkap as namadokter,  rm.ringkasanriwayatpenyakit,  " & _
             "rm.pemeriksaanfisik,  rm.pemeriksaanpenunjang,  rm.hasilkonsultasi,  rm.terapi,  rm.diagnosisawal,  rm.diagnosissekunder, " & _
             "rm.tindakanprosedur,  rm.alergi,  rm.diet,  rm.instruksianjuran,  rm.hasillab,  rm.kondisiwaktukeluar,  rm.pengobatandilanjutkan, " & _
             "rm.koderesume,  rm.pegawaifk,  pd.noregistrasi,format(  pd.tglregistrasi,'dd-MM-yyyy HH:mm') as tglregistrasi,  ps.nocm,  ps.namapasien, " & _
             "dt.namaobat,dt.jumlah,dt.dosis,dt.frekuensi,dt.carapemberian, " & _
             "kps.kelompokpasien,format(pd.tglpulang, 'dd-MM-yyyy HH:mm')as tglpulang,ru2.namaruangan as ruanganterakhir, " & _
             "format(ps.tgllahir, 'dd-MM-yyyy') as tgllahir,CONVERT(int,ROUND(DATEDIFF(hour,ps.tgllahir,GETDATE())/8766.0,0)) AS umur,jk.jeniskelamin " & _
             "from resumemedis_t as rm " & _
             "inner join antrianpasiendiperiksa_t as apd on apd.norec = rm.noregistrasifk " & _
             "inner join pasiendaftar_t as pd on pd.norec = apd.noregistrasifk " & _
             "inner join pasien_m as ps on ps.id = pd.nocmfk " & _
             "left join jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk " & _
             "inner join kelompokpasien_m as kps on kps.id= pd.objectkelompokpasienlastfk " & _
             "left join resumemedisdetail_t as dt on dt.resumefk = rm.norec " & _
             "left join ruangan_m as ru on ru.id = apd.objectruanganfk " & _
             "left join ruangan_m as ru2 on ru2.id = pd.objectruanganlastfk " & _
             "left join pegawai_m as pg on pg.id = rm.pegawaifk " & _
             "where rm.statusenabled =1 and rm.keteranganlainnya='RawatInap' and ps.nocm = '" & noCm & "' and rm.norec = '" & norec & "'  "
    
     ReadRs strSQL
    If rs.EOF = False Then
       str1 = rs!ringkasanriwayatpenyakit

    Else
       str1 = "-"
    End If
    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
           
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .udtTglKeluar.SetUnboundFieldSource ("{ado.tglpulang}")
            .udtTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
            .usUmur.SetUnboundFieldSource ("{ado.umur}")
            .usJK.SetUnboundFieldSource ("{ado.jeniskelamin}")
            .usNocm.SetUnboundFieldSource ("{ado.nocm}")
            .udtTglMasuk.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .usRuanganLast.SetUnboundFieldSource ("{ado.ruanganterakhir}")
            .textRiwayat.SetText str1
            .usRingkasan.SetUnboundFieldSource ("{ado.ringkasanriwayatpenyakit}")
            .usPemeriksaanFisik.SetUnboundFieldSource ("{ado.pemeriksaanfisik}")
            .usPemeriksaanPenunjang.SetUnboundFieldSource ("{ado.pemeriksaanpenunjang}")
            .usHasilKonsul.SetUnboundFieldSource ("{ado.hasilkonsultasi}")
            .usTerapi.SetUnboundFieldSource ("{ado.terapi}")
            .usDiagnosisUtama.SetUnboundFieldSource ("{ado.diagnosisawal}")
            .usDiagnosisSekunder.SetUnboundFieldSource ("{ado.diagnosissekunder}")
            .ustindakan.SetUnboundFieldSource ("{ado.tindakanprosedur}")
            .usAlergi.SetUnboundFieldSource ("{ado.alergi}")
            .usDiet.SetUnboundFieldSource ("{ado.diet}")
            .usIntruksi.SetUnboundFieldSource ("{ado.instruksianjuran}")
            .usHasilLab.SetUnboundFieldSource ("{ado.hasillab}")
            .usJenisPasien.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .usKondisi.SetUnboundFieldSource ("{ado.kondisiwaktukeluar}")
            .usPengobatan.SetUnboundFieldSource ("{ado.pengobatandilanjutkan}")
            .usNamaObat.SetUnboundFieldSource ("{ado.namaobat}")
            .usJumlah.SetUnboundFieldSource ("{ado.jumlah}")
            .usDosis.SetUnboundFieldSource ("{ado.dosis}")
            .usFrekuensi.SetUnboundFieldSource ("{ado.frekuensi}")
            .usCaraPemberian.SetUnboundFieldSource ("{ado.carapemberian}")
            .usNorec.SetUnboundFieldSource ("{ado.norec}")
            '.usICD.SetUnboundFieldSource ("{ado.icd}")
'
'            .txtTgl.SetText Format(tglAwal, "dd/MM/yyyy 00:00:00") & "  s/d  " & Format(tglAkhir, "dd/MM/yyyy 23:59:59")
'
          
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "PasienDaftar")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Report
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
            End If
        'End If
    End With
Exit Sub
errLoad:
End Sub
