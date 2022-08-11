VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmLaporanRemunerasi 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmLaporanRemunerasi.frx":0000
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
Attribute VB_Name = "frmLaporanRemunerasi"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crLaporanRemunerasi
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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "Billing")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmLaporanRemunerasi = Nothing
End Sub

Public Sub CetakLaporan(strruangan As String, strDept As String, strNoclosing As String, strDokter As String, view As String)
On Error GoTo errLoad
On Error Resume Next

Set frmLaporanRemunerasi = Nothing
Dim idRuangan As String
Dim idDept As String
Dim noClosing As String
Dim idDokter As String
Dim str As String
Dim adocmd As New ADODB.Command

If strruangan <> "" Then
    str = " and apd.objectruanganfk = '" & strruangan & "' "
End If

If strDept <> "" Then
    str = str & " and ru.objectdepartemenfk = '" & strDept & "' "
End If

If strNoclosing <> "" Then
   noClosing = Replace(strNoclosing, "\", "/")
   str = str & " and sp.noclosing = '" & noClosing & "' "
'    str = str & " and sp.noclosing = 'RC/1906031' "
End If

If strDokter <> "" Then
   str = str & " and dpp.pegawaiid = '" & strDokter & "' "
End If

Set Report = New crLaporanRemunerasi

    strSQL = "SELECT CASE WHEN pp.tglpelayanan IS NULL THEN FORMAT(sp.tglclosing, 'dd-MM-yyyy') ELSE FORMAT(pp.tglpelayanan, 'dd-MM-yyyy') END AS tglpelayanan, " & _
             "CASE WHEN pm.nocm IS NULL THEN '-' ELSE pm.nocm END AS nocm, " & _
             "CASE WHEN pd.noregistrasi IS NULL THEN '-' ELSE pd.noregistrasi END AS noregistrasi, " & _
             "CASE WHEN pm.namapasien IS NULL THEN '-' ELSE pm.namapasien END AS namapasien, " & _
             "sdp.produkfk,pp.jumlah,CASE WHEN pro.namaproduk IS NULL THEN dpp.jenis ELSE pro.namaproduk END AS namaproduk, " & _
             "CASE WHEN pp.isparamedis = 1 THEN 'v' ELSE '-' END AS paramedis,CASE WHEN pp.iscito = 1 THEN 'v' ELSE '-' END AS cito, " & _
             "CASE WHEN pp.hargasatuan IS NULL THEN 0 ELSE pp.hargasatuan * pp.jumlah END AS hargasatuan,apd.objectruanganfk, " & _
             "ru.namaruangan,ru.objectdepartemenfk,dept.namadepartemen,dpp.jenispaginilaitotal AS jenispagunilai,sdp.dokterid, " & _
             "pg.namalengkap AS dokter,br.pasiendaftarfk AS norec_batal,dpp.jpid,pp.norec AS norec_pp,dpp.djpid,djp.detailjenispagu " & _
             "From strukclosing_t As sp INNER JOIN detailpegawaipagu_t AS dpp ON dpp.strukclosingfk = sp.norec " & _
             "LEFT JOIN strukdetailpagu_t AS sdp ON sdp.norec = dpp.norec_sdp " & _
             "LEFT JOIN pelayananpasien_t AS pp ON pp.norec = sdp.pelayananpasienfk " & _
             "LEFT JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk " & _
             "LEFT JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk " & _
             "LEFT JOIN produk_m AS pro ON pro.id = sdp.produkfk " & _
             "LEFT JOIN pasien_m AS pm ON pm.id = pd.nocmfk " & _
             "LEFT JOIN pegawai_m AS pg ON pg.id = sdp.dokterid " & _
             "LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk " & _
             "LEFT JOIN departemen_m AS dept ON dept.id = ru.objectdepartemenfk " & _
             "LEFT JOIN batalregistrasi_t AS br ON br.pasiendaftarfk = pd.norec " & _
             "LEFT JOIN detailjenispagu_t AS djp ON djp.id = dpp.djpid " & _
             "Where br.pasiendaftarfk IS NULL AND sp.statusenabled = 1 " & _
             str & " Order By pp.tglpelayanan ASC"
   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .usRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .udtTanggalPelayanan.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .usNorm.SetUnboundFieldSource ("{ado.nocm}")
            .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usNamaLayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .unQty.SetUnboundFieldSource ("{ado.jumlah}")
            .usParamedis.SetUnboundFieldSource ("{ado.paramedis}")
            .usCito.SetUnboundFieldSource ("{ado.cito}")
            .ucTarifLayanan.SetUnboundFieldSource ("{ado.hargasatuan}")
            .ucJasaRemun.SetUnboundFieldSource ("{ado.jenispagunilai}")
            
            If view = "false" Then
                Dim strPrinter As String
                strPrinter = GetTxt("Setting.ini", "Printer", "Billing")
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
