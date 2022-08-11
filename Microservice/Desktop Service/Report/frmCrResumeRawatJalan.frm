VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCrResumeRawatJalan 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCrResumeRawatJalan.frx":0000
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
Attribute VB_Name = "frmCrResumeRawatJalan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crResumeRawatJalan

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

    Set frmCrResumeRawatJalan = Nothing
End Sub

Public Sub Cetak(noCm As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCrResumeRawatJalan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter, strFilter1 As String
'Set Report = New crLaporanPasienDaftar
Set Report = New crResumeRawatJalan

      
    strSQL = "select rm.norec, Format(rm.tglresume, 'dd-MM-yyyy HH:mm') as tglresume,   ru.namaruangan,  rm.diagnosisawal as diagnosis,  rm.icd,  rm.jenispemeriksaan, " & _
             "rm.riwayatlalu,  pg.namalengkap as namadokter,  rm.pegawaifk,  pd.noregistrasi,  pd.tglregistrasi,  ps.nocm,  ps.namapasien, " & _
             "ps.namakeluarga,Format(ps.tgllahir, 'dd-MM-yyyy') as tgllahir, DATEDIFF(YEAR, ps.tgllahir, GetDate()) / 365.25 as umur,jk.jeniskelamin,alm.alamatlengkap,kk.namakotakabupaten,ps.notelepon, " & _
             "dk.namadesakelurahan,kc.namakecamatan,ps.nohp,ps.tempatlahir,agm.agama,kbs.name as kebangsaan,pkj.pekerjaan, " & _
             "ps.noidentitas  + ' / ' +  ps.paspor as noidentitas,stp.statusperkawinan,kps.kelompokpasien " & _
             "from resumemedis_t as rm " & _
            "inner join antrianpasiendiperiksa_t as apd on apd.norec = rm.noregistrasifk " & _
            "inner join pasiendaftar_t as pd on pd.norec = apd.noregistrasifk " & _
            "inner join pasien_m as ps on ps.id = pd.nocmfk " & _
            "left join jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk " & _
            "left join alamat_m as alm on alm.nocmfk = ps.id " & _
            "left join kotakabupaten_m as kk on kk.id= alm.objectkotakabupatenfk " & _
            "left join desakelurahan_m as dk on dk.id= alm.objectdesakelurahanfk " & _
            "left join kecamatan_m as kc on kc.id= alm.objectkecamatanfk " & _
            "left join agama_m as agm on agm.id= ps.objectagamafk " & _
            "left join kebangsaan_m as kbs on kbs.id= ps.objectkebangsaanfk " & _
            "left join pekerjaan_m as pkj on pkj.id= ps.objectpekerjaanfk " & _
            "left join statusperkawinan_m as stp on stp.id= ps.objectstatusperkawinanfk " & _
            "inner join kelompokpasien_m as kps on kps.id= pd.objectkelompokpasienlastfk " & _
            "left join ruangan_m as ru on ru.id = apd.objectruanganfk " & _
            "left join pegawai_m as pg on pg.id = rm.pegawaifk " & _
            "where rm.statusenabled = 1 and rm.keteranganlainnya = 'RawatJalan' and ps.nocm = '" & noCm & "' "
    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
           
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usNamaKeluarga.SetUnboundFieldSource ("{ado.namakeluarga}")
            .udtTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
            .usUmur.SetUnboundFieldSource ("{ado.umur}")
            .usJK.SetUnboundFieldSource ("{ado.jeniskelamin}")
            .usNoCm.SetUnboundFieldSource ("{ado.nocm}")
            .usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")
            .usNoTelpon.SetUnboundFieldSource ("{ado.notelepon}")
            .usDesaKelurahan.SetUnboundFieldSource ("{ado.namadesakelurahan}")
            .usKecamatan.SetUnboundFieldSource ("{ado.namakecamatan}")
            .usKotaKab.SetUnboundFieldSource ("{ado.namakotakabupaten}")
            .usNoHP.SetUnboundFieldSource ("{ado.nohp}")
            .usTempatLahir.SetUnboundFieldSource ("{ado.tempatlahir}")
            .usAgama.SetUnboundFieldSource ("{ado.agama}")
            .usKebangsaan.SetUnboundFieldSource ("{ado.kebangsaan}")
            .usPekerjaan.SetUnboundFieldSource ("{ado.pekerjaan}")
            .usNoIdentitas.SetUnboundFieldSource ("{ado.noidentitas}")
            .usKebangsaan.SetUnboundFieldSource ("{ado.pekerjaan}")
            .usStatusKawin.SetUnboundFieldSource ("{ado.statusperkawinan}")
            .usJenisPasien.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .usDiagnosis.SetUnboundFieldSource ("{ado.diagnosis}")
            .udtTglResume.SetUnboundFieldSource ("{ado.tglresume}")
            .usRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .usJenisPemeriksaan.SetUnboundFieldSource ("{ado.jenispemeriksaan}")
            .usRiwayat.SetUnboundFieldSource ("{ado.riwayatlalu}")
            .usDokter.SetUnboundFieldSource ("{ado.namadokter}")
            .usNorec.SetUnboundFieldSource ("{ado.norec}")
            .usICD.SetUnboundFieldSource ("{ado.icd}")
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
