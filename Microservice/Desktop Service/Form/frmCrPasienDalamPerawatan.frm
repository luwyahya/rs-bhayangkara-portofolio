VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCrPasienDalamPerawatan 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   6990
   Icon            =   "frmCrPasienDalamPerawatan.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7005
   ScaleWidth      =   6990
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
      TabIndex        =   2
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
      TabIndex        =   1
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
      TabIndex        =   0
      Top             =   480
      Width           =   3015
   End
   Begin CRVIEWERLibCtl.CRViewer CRViewer1 
      Height          =   7005
      Left            =   0
      TabIndex        =   3
      Top             =   0
      Width           =   7005
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
End
Attribute VB_Name = "frmCrPasienDalamPerawatan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crPasienDalamPerawatan
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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "LaporanPenerimaan")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCrPasienDalamPerawatan = Nothing
End Sub

Public Sub Cetak(tglAwal As String, tglAkhir As String, idRuangan As String, idKelompok As String, noreg As String, noMr As String, namapasien As String, namaLogin As String, view As String)

Set frmCrPasienDalamPerawatan = Nothing
Dim adocmd As New ADODB.Command
    Dim str1 As String
    Dim str2 As String
    Dim str3 As String
    Dim str4 As String
    Dim str5 As String
   
    
    If idRuangan <> "" Then
        str1 = "and z.objectruanganlastfk=" & idRuangan & " "
    End If
    If idKelompok <> "" Then
        str2 = " and z.objectkelompokpasienlastfk=" & idKelompok & " "
    End If
    If noreg <> "" Then
        str3 = " and z.noregistrasi ILIKE % " & noreg & " %"
    End If
      If noMr <> "" Then
        str4 = " and z.nocm ILIKE % " & noMr & " %"
    End If
      If namapasien <> "" Then
        str5 = " and z.namapasien % " & namapasien & " %"
    End If
    
Set Report = New crPasienDalamPerawatan
    strSQL = "SELECT z.tglregistrasi,z.hari, z.noregistrasi, z.nocm, z.namapasien, z.namakelas, z.kelompokpasien, z.namarekanan,z.namaruangan, z.biayaadmin, z.biayamaterai,z.total,sum(((z.biayaadmin + (z.biayamaterai)::double precision) + z.total)) AS totaltagihan,z.diskon, z.deposit, sum(((((z.biayaadmin + (z.biayamaterai)::double precision) + z.total) - z.diskon) - z.deposit)) AS totalkabeh, " & _
             "z.objectkelompokpasienlastfk,z.objectkelasfk, z.objectrekananfk, z.objectruanganlastfk   FROM ( SELECT x.tglregistrasi,  x.hari, x.objectkelompokpasienlastfk,x.objectkelasfk, x.objectrekananfk,x.objectruanganlastfk, " & _
            "x.noregistrasi,x.nocm,x.namapasien,x.namakelas, x.kelompokpasien,x.namarekanan, x.namaruangan,x.biayaadmin, CASE WHEN (x.total > (1000000.99)::double precision) THEN 6000 WHEN (x.total > (500000.99)::double precision) THEN 3000 " & _
            "ELSE 0 END AS biayamaterai, x.total,x.diskon,x.deposit FROM ( SELECT pd.tglregistrasi,date_part('day'::text, ((('now'::text)::date)::timestamp without time zone - pd.tglregistrasi)) AS hari,pd.objectkelompokpasienlastfk,pd.objectkelasfk, pd.objectrekananfk,pd.objectruanganlastfk,pd.noregistrasi, ps.nocm,ps.namapasien,kl.namakelas,klp.kelompokpasien,rk.namarekanan,ru.namaruangan,(sum((((( CASE WHEN (pp.hargajual IS NULL) THEN (0)::double precision ELSE pp.hargajual END - " & _
            "CASE WHEN (pp.hargadiscount IS NULL) THEN (0)::double precision ELSE pp.hargadiscount END) * pp.jumlah) + CASE WHEN (pp.jasa IS NULL) THEN (0)::double precision ELSE pp.jasa END) -  CASE  WHEN (pp.produkfk = 402611) THEN pp.hargajual ELSE (0)::double precision END)) * (0.05)::double precision) AS biayaadmin, " & _
            "sum(((( CASE WHEN (pp.hargajual IS NULL) THEN (0)::double precision ELSE pp.hargajual END * pp.jumlah) +CASE WHEN (pp.jasa IS NULL) THEN (0)::double precision ELSE pp.jasa END) -CASE WHEN (pp.produkfk = 402611) THEN pp.hargajual  ELSE (0)::double precision END)) AS total, " & _
            "sum(( CASE WHEN (pp.produkfk = 402611) THEN pp.hargajual ELSE (0)::double precision  END * pp.jumlah)) AS deposit, sum(  CASE WHEN (pp.hargadiscount IS NULL) THEN (0)::double precision ELSE pp.hargadiscount END) AS diskon " & _
            "FROM ((((((((pasiendaftar_t pd " & _
            "JOIN antrianpasiendiperiksa_t apd ON (((apd.noregistrasifk)::bpchar = pd.norec))) " & _
            "JOIN pelayananpasien_t pp ON (((pp.noregistrasifk)::bpchar = apd.norec))) " & _
            "JOIN ruangan_m ru ON ((ru.id = pd.objectruanganlastfk))) " & _
            "LEFT JOIN kamar_m kmr ON (((kmr.id = apd.objectkamarfk) AND (apd.objectruanganfk = pd.objectruanganlastfk)))) " & _
            "JOIN pasien_m ps ON ((ps.id = pd.nocmfk))) " & _
            "JOIN kelompokpasien_m klp ON ((klp.id = pd.objectkelompokpasienlastfk))) " & _
            "LEFT JOIN kelas_m kl ON ((kl.id = pd.objectkelasfk))) " & _
            "LEFT JOIN rekanan_m rk ON ((rk.id = pd.objectrekananfk))) " & _
            "WHERE (((ru.objectdepartemenfk = ANY (ARRAY[35, 16])) AND (pd.tglpulang IS NULL)) AND (pd.nostruklastfk IS NULL)) " & _
            "GROUP BY pd.tglregistrasi, pd.noregistrasi, ps.nocm, ps.namapasien, kl.namakelas, klp.kelompokpasien, rk.namarekanan, ru.namaruangan, pd.objectkelasfk, pd.objectrekananfk, pd.objectkelompokpasienlastfk, pd.objectruanganlastfk) x) z  " & _
            "where z.tglregistrasi BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
            str1 & _
            str2 & _
            str3 & _
            str4 & _
            str5 & _
            "GROUP BY z.biayaadmin, z.biayamaterai, z.total, z.diskon, z.deposit, z.tglregistrasi, z.hari, z.noregistrasi, z.nocm, z.namapasien, z.namakelas, z.kelompokpasien, z.namarekanan, z.namaruangan, z.objectkelompokpasienlastfk, z.objectkelasfk, z.objectrekananfk, z.objectruanganlastfk order by z.tglregistrasi"
   

   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .usNamaKasir.SetText namaLogin
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .udtTglRegis.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .usRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .unHari.SetUnboundFieldSource ("{ado.hari}")
            .usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNocm.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usKelas.SetUnboundFieldSource ("{ado.namakelas}")
            .usTipePasien.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .usPenjamin.SetUnboundFieldSource ("{ado.namarekanan}")
            .ucJumlah.SetUnboundFieldSource ("{ado.totaltagihan}")
            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
            .ucDeposit.SetUnboundFieldSource ("{ado.deposit}")
            .ucTotal.SetUnboundFieldSource ("{ado.totalkabeh}")
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPenerimaan")
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
