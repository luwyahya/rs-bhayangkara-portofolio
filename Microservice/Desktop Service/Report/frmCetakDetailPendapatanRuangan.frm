VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakDetailPendapatanRuangan 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCetakDetailPendapatanRuangan.frx":0000
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
      TabIndex        =   3
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
      TabIndex        =   2
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
      TabIndex        =   1
      Top             =   480
      Width           =   3015
   End
   Begin CRVIEWERLibCtl.CRViewer CRViewer1 
      Height          =   6975
      Left            =   0
      TabIndex        =   4
      Top             =   0
      Width           =   5895
      DisplayGroupTree=   -1  'True
      DisplayToolbar  =   -1  'True
      EnableGroupTree =   -1  'True
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
      EnableSelectExpertButton=   0   'False
      EnableToolbar   =   -1  'True
      DisplayBorder   =   -1  'True
      DisplayTabs     =   -1  'True
      DisplayBackgroundEdge=   -1  'True
      SelectionFormula=   ""
      EnablePopupMenu =   -1  'True
      EnableExportButton=   -1  'True
      EnableSearchExpertButton=   0   'False
      EnableHelpButton=   0   'False
   End
   Begin VB.TextBox txtNamaFormPengirim 
      Height          =   495
      Left            =   3120
      TabIndex        =   0
      Top             =   600
      Width           =   2175
   End
End
Attribute VB_Name = "frmCetakDetailPendapatanRuangan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crCetakDetailPendapatanRuangan
'Dim bolSuppresDetailSection10 As Boolean
'Dim ii As Integer
'Dim tempPrint1 As String
'Dim p As Printer
'Dim p2 As Printer
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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "LaporanPasienPulang")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCetakDetailPendapatanRuangan = Nothing
End Sub
Public Sub CetakDetailPendapatanRuangan(ID As String, tglAwal As String, tglAkhir As String, strIdDepartemen As String, strIdRuangan As String, strIdKelompokPasien, strIdDokter As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmCetakDetailPendapatanRuangan = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter, orderby As String
Set Report = New crCetakDetailPendapatanRuangan
Dim view As Boolean
view = True

    strFilter = ""
    orderby = ""

    strFilter = " where p.tglregistrasi BETWEEN '" & _
    Format(tglAwal, "yyyy-MM-dd 00:00:00") & "' AND '" & _
    Format(tglAkhir, "yyyy-MM-dd 23:59:59") & "' and p.objectjenisprodukfk <> 97  and p.norecbatal is null " & _
    "and p.pegawaifk not in (320272,13119,13096) "
    
    If strIdDepartemen <> "" Then strFilter = strFilter & " AND p.objectdepartemenfk = '" & strIdDepartemen & "'"
    If strIdRuangan <> "" Then strFilter = strFilter & " AND p.objectruanganfk = '" & strIdRuangan & "' "
    If strIdKelompokPasien <> "" Then strFilter = strFilter & " AND p.objectkelompokpasienlastfk = '" & strIdKelompokPasien & "' "
    If strIdDokter <> "" Then strFilter = strFilter & " AND p.pegawaifk = '" & strIdDokter & "' "
  
    orderby = strFilter & "order by p.noregistrasi asc) as p " & _
            "GROUP BY p.tglregistrasi,p.noregistrasi,p.nocm,p.namapasien,p.objectruanganfk,p.namaruangan,p.namalengkap,p.kelompokpasien,p.nonpj,p.pj,p.verif "
        
    strSQL = "select p.tglregistrasi,p.nocm,p.noregistrasi,p.namapasien,p.objectruanganfk,p.namaruangan,p.namalengkap,p.nocm  +  ' '  + ' / '  +  ' '  +  p.noregistrasi as pasien, " & _
             "SUM(p.karcis) as karcis,SUM(p.volkarcis) as volkarcis,SUM(p.embos) as embos,SUM(p.volembos) as volembos, " & _
             "SUM(p.konsul) as konsul,SUM(p.volkonsul) as volkonsul, SUM(p.tindakan) as tindakan,SUM(p.voltindakan) as voltindakan, " & _
             "SUM(p.diskon) as diskon,p.kelompokpasien,p.nonpj,p.pj,p.verif from " & _
             "(select p.tglregistrasi,p.statusenabled,p.objectruanganfk,p.namaruangan,p.namalengkap,p.nocm,upper(p.namapasien) as namapasien,p.kpid, " & _
             "p.prid,p.karcis,p.volkarcis,p.embos,p.volembos,p.konsul,p.volkonsul,p.tindakan,p. voltindakan,p.diskon,p.noregistrasi, " & _
             "p.kelompokpasien,p.nonpj,p.pj,p.verif,p.pegawaifk from v_pendapatan as p " & orderby

    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            
            .usDokter.SetUnboundFieldSource ("{ado.namalengkap}")
            .usRuanganPelayanan.SetUnboundFieldSource ("{ado.namaruangan}")
            .udTanggal.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .usNocm.SetUnboundFieldSource ("{ado.pasien}")
            .usPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usPenjamin.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .ucKarcis.SetUnboundFieldSource ("{ado.karcis}")
            .ucEmbos.SetUnboundFieldSource ("{ado.embos}")
            .ucKonsul.SetUnboundFieldSource ("{ado.konsul}")
            .ucTindakan.SetUnboundFieldSource ("{ado.tindakan}")
            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
            .unVolKarcis.SetUnboundFieldSource ("{ado.volkarcis}")
            .unVolEmbos.SetUnboundFieldSource ("{ado.volembos}")
            .unVolKonsul.SetUnboundFieldSource ("{ado.volkonsul}")
            .unVolTindakan.SetUnboundFieldSource ("{ado.voltindakan}")
            
        .TxtTgl.SetText "TANGGAL " & Format(tglAwal, "dd-MM-yyyy") & "  s/d  " & Format(tglAkhir, "dd-MM-yyyy")
             
        ReadRs2 "SELECT namalengkap FROM pegawai_m where id='" & ID & "' "
        If RS2.BOF Then
            .txtUser.SetText "-"
        Else
            .txtUser.SetText UCase(IIf(IsNull(RS2("namalengkap")), "-", RS2("namalengkap")))
        End If
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPasienPulang")
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

