VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRSetoranKasir 
   Caption         =   "Medifirst2000"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCRSetoranKasir.frx":0000
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
Attribute VB_Name = "frmCRSetoranKasir"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
    Option Explicit
Dim Report As New cr_SetoranKasir
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
    Report.PrinterSetup Me.hWnd
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
    Set frmCRSetoranKasir = Nothing
End Sub

Public Sub Cetak(tglAwal As String, tglAkhir As String, kasirId As String, strIdPegawai As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmCRSetoranKasir = Nothing
Dim adocmd As New ADODB.Command
    
Set Report = New cr_SetoranKasir

 strSQL = "select sbm.norec, cb.carabayar,  sbmcr.objectcarabayarfk as idcarabayar,  sbm.objectkelompoktransaksifk as idkeltransaksi, " & _
            " kt.kelompoktransaksi as keltransaksi,  sbm.keteranganlainnya as keterangan,  p.id as idpegawai,  p.namalengkap as namakasir, " & _
            " sc.noclosing , sbm.nosbm,sv.noverifikasi ,sc.tglclosing , to_char(sbm.tglsbm,'dd-MM-yyyy HH:mm')as tglsbm, sv.tglverifikasi, sbm.totaldibayar," & _
            " pd.noregistrasi,ps.nocm || ' - ' || ps.namapasien as namapasien, sp.norec as norec_sp, ru.id as ruid, ru.namaruangan, sp.namapasien_klien," & _
            " ps.nocm , sbm.noclosingfk " & _
            " from strukbuktipenerimaan_t as sbm " & _
            " inner join strukpelayanan_t as sp on sbm.nostrukfk = sp.norec " & _
            " left join pasiendaftar_t as pd on sp.noregistrasifk = pd.norec" & _
            " left join ruangan_m as ru on ru.id = pd.objectruanganlastfk" & _
            " left join loginuser_s as lu on lu.id = sbm.objectpegawaipenerimafk" & _
            " left join pegawai_m as p on p.id = lu.objectpegawaifk" & _
            " left join pasien_m as ps on ps.id = sp.nocmfk" & _
            " left join strukbuktipenerimaancarabayar_t as sbmcr on sbmcr.nosbmfk = sbm.norec" & _
            " left join carabayar_m as cb on cb.id = sbmcr.objectcarabayarfk" & _
            " left join kelompoktransaksi_m as kt on kt.id = sbm.objectkelompoktransaksifk" & _
            " left join strukclosing_t as sc on sc.norec = sbm.noclosingfk" & _
            " left join strukverifikasi_t as sv on sv.norec = sbm.noverifikasifk" & _
            " where sbm.tglsbm between '" & tglAwal & "' and '" & tglAkhir & "' and p.id = '" & kasirId & "'  "
             
    ReadRs strSQL
    Dim noClose As String
        
    noClose = RS!noclosing
   
    
    Dim tCash, tKk, tKd, tTotal As Double
    Dim i As Integer
    
    tCash = 0
    tKk = 0
    tKd = 0
    tTotal = 0
    For i = 0 To RS.RecordCount - 1
       
        If (RS!idcarabayar = 1) Then
            tCash = tCash + CDbl(IIf(IsNull(RS!totaldibayar), 0, RS!totaldibayar))
        ElseIf (RS!idcarabayar = 2) Then
            tKk = tKk + CDbl(IIf(IsNull(RS!totaldibayar), 0, RS!totaldibayar))
        ElseIf (RS!idcarabayar = 4) Then
            tKd = tKd + CDbl(IIf(IsNull(RS!totaldibayar), 0, RS!totaldibayar))
        End If
        tTotal = tTotal + CDbl(IIf(IsNull(RS!totaldibayar), 0, RS!totaldibayar))
        RS.MoveNext
    Next
  

    ReadRs2 "select DISTINCT sc.noclosing,to_char(sc.tglclosing,'dd-MM-yyyy HH:mm')as tgldiclose,sc.totaldibayar as total," & _
               " sc.objectpegawaidiclosefk,pg.namalengkap as namakasir," & _
               " sck.carabayarfk,cb.carabayar,sck.totaldibayar as jmlsetor," & _
               " sck.objectcarasetorfk ,cs.carasetor,sh.objectpegawaiterimafk,pg2.namalengkap as namapenerima" & _
               " from strukclosing_t as sc" & _
               " inner join strukclosingkasir_t as sck on sck.noclosingfk=sc.norec" & _
               " left join strukhistori_t as sh on sh.noclosing=sc.noclosing" & _
               " left join carabayar_m  as cb on cb.id=sck.carabayarfk" & _
               " left join carasetor_m as cs on cs.id=sck.objectcarasetorfk" & _
               " left join pegawai_m as pg on pg.id=sc.objectpegawaidiclosefk" & _
               " left join pegawai_m as pg2 on pg2.id=sh.objectpegawaiterimafk" & _
               " where sc.tglawal BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' and sc.objectpegawaidiclosefk = '" & kasirId & "' and sc.noclosing = '" & noClose & "' "
               
            
    Dim sCash, sKk, sKd, sTotal As Double, Penerima As String, tglClose As String
    Dim j As Integer
    
    sCash = 0
    sKk = 0
    sKd = 0
    sTotal = 0
    For j = 0 To RS2.RecordCount - 1
        If (RS2!objectcarasetorfk = 1) Then
            sCash = sCash + CDbl(IIf(IsNull(RS2!jmlsetor), 0, RS2!jmlsetor))
        ElseIf (RS2!objectcarasetorfk = 2) Then
            sKk = sKk + CDbl(IIf(IsNull(RS2!jmlsetor), 0, RS2!jmlsetor))
        ElseIf (RS2!objectcarasetorfk = 4) Then
            sKd = sKd + CDbl(IIf(IsNull(RS2!jmlsetor), 0, RS2!jmlsetor))
        End If
        sTotal = sTotal + CDbl(IIf(IsNull(RS2!jmlsetor), 0, RS2!jmlsetor))
        Penerima = RS2!namapenerima
        tglClose = RS2!tgldiclose
        RS2.MoveNext
       
    Next

    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtNamaKasir.SetText strIdPegawai
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .txtTglClosing.SetText "Tgl Closing : " & tglClose & ""
            .txtPenerimaSetoran.SetText "Penerima : " & Penerima & ""
'            .usNamaKasir.SetUnboundFieldSource ("{ado.kasir}")
            .usNoSbm.SetUnboundFieldSource ("{ado.nosbm}")
            .usNoClosing.SetUnboundFieldSource ("{ado.noclosing}")
            .udTglSbm.SetUnboundFieldSource ("{ado.tglsbm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
'            .usDeskripsi.SetUnboundFieldSource ("{ado.namapasien_klien}")
'            .usKeterangan.SetUnboundFieldSource ("{ado.keterangan}")
            .usTotalPenerimaan.SetUnboundFieldSource ("{ado.totaldibayar}")
            .usCaraBayar.SetUnboundFieldSource ("{ado.carabayar}")
            .usNamaKasir.SetUnboundFieldSource ("{ado.namakasir}")
            .unIdCaraBayar.SetUnboundFieldSource ("{ado.idcarabayar}")
            .txtTotalTunai.SetText Format(tCash, "##,##0.00")
            .txtTotalDebit.SetText Format(tKd, "##,##0.00")
            .txtTotalKredit.SetText Format(tKk, "##,##0.00")
            .txtTotalPenerimaan.SetText Format(tTotal, "##,##0.00")
            
            .txtSetoranTunai.SetText Format(sCash, "##,##0.00")
            .txtSetoranKredit.SetText Format(sKk, "##,##0.00")
            .txtSetoranDebit.SetText Format(sKd, "##,##0.00")
            .txtTotalSetor.SetText Format(sTotal, "##,##0.00")
            .txtSisa.SetText Format(tTotal - tTotal, "##,##0.00")

    
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
    MsgBox Err.Number & " " & Err.Description
End Sub


