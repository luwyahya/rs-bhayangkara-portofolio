VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Object = "{248DD890-BB45-11CF-9ABC-0080C7E7B78D}#1.0#0"; "mswinsck.ocx"
Begin VB.Form frmCetakAntrianFarmasi 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   9075
   Icon            =   "frmCetakAntrianFarmasi.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7005
   ScaleWidth      =   9075
   WindowState     =   2  'Maximized
   Begin MSWinsockLib.Winsock Winsock1 
      Left            =   8040
      Top             =   6120
      _ExtentX        =   741
      _ExtentY        =   741
      _Version        =   393216
   End
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
      Height          =   7005
      Left            =   0
      TabIndex        =   0
      Top             =   0
      Width           =   9045
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
   Begin VB.PictureBox Picture1 
      Height          =   1095
      Left            =   4080
      ScaleHeight     =   1035
      ScaleWidth      =   4155
      TabIndex        =   5
      Top             =   3000
      Width           =   4215
   End
End
Attribute VB_Name = "frmCetakAntrianFarmasi"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New Cr_cetakBuktiAntrianFarmasi

Dim ii As Integer
Dim tempPrint1 As String
Dim p As Printer
Dim p2 As Printer
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String

Dim bolBuktiPendaftaran As Boolean
Dim strPrinter As String
Dim strPrinter1 As String
Dim PrinterNama As String

Dim adoReport As New ADODB.Command

Private Sub cmdCetak_Click()
  If cboPrinter.Text = "" Then MsgBox "Printer belum dipilih", vbInformation, ".: Information": Exit Sub
    If bolBuktiPendaftaran = True Then
        Report.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        Report.PrintOut False
    End If
    SaveSetting "SMART", "SettingPrinter", "cboPrinter", PrinterNama
End Sub

Private Sub CmdOption_Click()
    
    If bolBuktiPendaftaran = True Then
        Report.PrinterSetup Me.hwnd
    End If
    CRViewer1.Refresh
End Sub

Private Sub Form_Load()
    
    Dim p As Printer
    cboPrinter.Clear
    For Each p In Printers
        cboPrinter.AddItem p.DeviceName
    Next
    strPrinter = strPrinter1
    
    cboPrinter.Text = GetSetting("SMART", "SettingPrinter", "cboPrinter")
    
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCetakAntrianFarmasi = Nothing
'    fso.DeleteFile (App.Path & "\tempbitmap.bmp")
'    Set sect = Nothing

End Sub

Public Sub cetakBuktiAntrianFarmasi(strNorec As String, strNoregis As String, view As String)
'On Error GoTo errLoad
Set frmCetakAntrianFarmasi = Nothing
Dim strSQL As String
Dim strSQL2 As String
Dim str1 As String
bolBuktiPendaftaran = True
Dim NamaPetugas As String
Dim alamatRs As String
Dim namaRs As String
Dim Apoteker As String

    If strNorec <> "" Then
        str1 = Replace(strNorec, "\", "/")
'        ReadRs2 "select pg.namalengkap from logginguser_t as lg " & _
'                "INNER JOIN loginuser_s as lu on lu.id = lg.objectloginuserfk " & _
'                "INNER JOIN pegawai_m as pg on pg.id = lu.objectpegawaifk " & _
'                "where lg.noreff = '" & strNorec & "'"
    End If
'
'    If RS2.EOF = False Then
'       Apoteker = "Apoteker : " & RS2!namalengkap
'    Else
'       Apoteker = "Apoteker : -"
'    End If
    
    With Report
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String
            strSQL = "SELECT  pd.noregistrasi,    ps.nocm,    ps.tgllahir,    ps.namapasien,  pd.tglregistrasi,   jk.reportdisplay AS jk, " & _
                     "ap.alamatlengkap,   ap.mobilephone2,    ru.namaruangan AS ruanganPeriksa,   pp.namalengkap AS namadokter, " & _
                     "kp.kelompokpasien,  apdp.noantrian,pd.statuspasien,apr.noreservasi,apr.tanggalreservasi " & _
                     "FROM    pasiendaftar_t pd " & _
                     "INNER JOIN pasien_m ps ON pd.nocmfk = ps.id LEFT JOIN alamat_m ap ON ap.nocmfk = ps.id " & _
                     "INNER JOIN jeniskelamin_m jk ON ps.objectjeniskelaminfk = jk.id INNER JOIN ruangan_m ru ON pd.objectruanganlastfk = ru.id " & _
                     "LEFT JOIN pegawai_m pp ON pd.objectpegawaifk = pp.id INNER JOIN kelompokpasien_m kp ON pd.objectkelompokpasienlastfk = kp.id " & _
                     "INNER JOIN antrianpasiendiperiksa_t apdp ON apdp.noregistrasifk = pd.norec " & _
                     "LEFT JOIN antrianpasienregistrasi_t as apr on apr.noreservasi=pd.statusschedule " & _
                     "WHERE   pd.noregistrasi = '" & strNoregis & "' "

            strSQL2 = "select noantri, jenis, tglresep, noresep FROM antrianapotik_t where noresep = '" & str1 & "'"
                     
            ReadRs3 strSQL2
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
             If RS3.EOF = False Then
                .database.AddADOCommand CN_String, adoReport
'                .usnoantri.SetUnboundFieldSource ("{ado.noantrian}")
                .udtgl.SetUnboundFieldSource ("{ado.tglregistrasi}")
                .usnodft.SetUnboundFieldSource ("{ado.noregistrasi}")
                .usNoCM.SetUnboundFieldSource ("{ado.nocm}")
                .usnmpasien.SetUnboundFieldSource ("{ado.namapasien}")
                .usJK.SetUnboundFieldSource ("{ado.jk}")
                .udTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
                .usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")
                .usNoTelpon.SetUnboundFieldSource ("{ado.mobilephone2}")
                .usPenjamin.SetUnboundFieldSource ("{ado.kelompokpasien}")
                .usruangperiksa.SetUnboundFieldSource ("{ado.ruanganPeriksa}")
                .usNamaDokter.SetUnboundFieldSource ("{ado.namadokter}")
                .usStatusPasien.SetUnboundFieldSource ("{ado.statuspasien}")
                .usAlamat.SetUnboundFieldSource ("{ado.alamatlengkap}")
                .usAlamats.SetUnboundFieldSource ("{ado.alamatlengkap}")
                .txtAntrian.SetText RS3!jenis & "-" & RS3!NoAntri
'                .txtPetugas.SetText Apoteker
             End If
                        
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "AntrianFarmasi")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = Report
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
                Screen.MousePointer = vbDefault
            End If
     
    End With
Exit Sub
errLoad:

    MsgBox Err.Number & " " & Err.Description
End Sub
