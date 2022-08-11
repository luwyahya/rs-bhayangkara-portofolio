VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCrRekapHarianPemeriksaanLaborat 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCrRekapHarianPemeriksaanLaborat.frx":0000
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
   Begin VB.TextBox txtNamaFormPengirim 
      Height          =   495
      Left            =   3120
      TabIndex        =   1
      Top             =   600
      Width           =   2175
   End
End
Attribute VB_Name = "frmCrRekapHarianPemeriksaanLaborat"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
'Dim Report As New crRekapHarianPemeriksaanLaborat
Dim Report As New crRekapHarianPemeriksaanLaboratorium
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

    Set frmCrRekapHarianPemeriksaanLaborat = Nothing
End Sub

Public Sub Cetak(tglAwal As String, tglAkhir As String, idDepartemen As String, idRuangan As String, idKelompok As String, NamaKasir As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCrRekapHarianPemeriksaanLaborat = Nothing
Dim adocmd As New ADODB.Command

    Dim str1, str2, str3 As String
    
    If idDepartemen <> "" Then
        If idDepartemen = 18 Then
            str3 = " and dp.id <> 16 "
        ElseIf idDepartemen = 16 Then
            str3 = " and dp.id = 16 "
        End If
    End If

    If idRuangan <> "" Then
        str1 = " and ru.id=" & idRuangan & " "
    End If
    
    If idKelompok <> "" Then
        str2 = " and kps.id=" & idKelompok & " "
    End If
     
    
Set Report = New crRekapHarianPemeriksaanLaboratorium

    strSQL = "SELECT pd.noregistrasi, pp.tglpelayanan,dp.namadepartemen,ru.namaruangan, kps.kelompokpasien, pr.id, pr.namaproduk, " & _
            "pp.hargajual,pp.jumlah,pp.hargajual*pp.jumlah as subtotal, " & _
            "case when pp.hargadiscount is null then 0 else pp.hargadiscount end as diskon, " & _
            "0 as unitcost, " & _
            "sum(case when ppd.komponenhargafk=38 then ppd.hargajual*ppd.jumlah end) as jasasarana, " & _
            "sum(case when ppd.komponenhargafk=35 then ppd.hargajual*ppd.jumlah end) as jasamedis, " & _
            "sum(case when ppd.komponenhargafk=25 then ppd.hargajual*ppd.jumlah end) as jasaparamedis, " & _
            "sum(case when ppd.komponenhargafk=30 then ppd.hargajual*ppd.jumlah end) as jasaumum " & _
            "from pasiendaftar_t as pd " & _
            "left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec " & _
            "left join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec " & _
            "left join pelayananpasiendetail_t ppd on pp.norec=ppd.pelayananpasien  " & _
            "left join ruangan_m as ru on ru.id=apd.objectruanganfk " & _
            "left join ruangan_m as ru2 on ru2.id=pd.objectruanganlastfk " & _
            "left join departemen_m dp on dp.id=ru2.objectdepartemenfk " & _
            "left join produk_m as pr on pr.id=pp.produkfk left join detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk " & _
            "left join jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk left join kelompokproduk_m as kp on kp.id=jp.objectkelompokprodukfk " & _
            "left join pasien_m as ps on ps.id=pd.nocmfk " & _
            "left join kelompokpasien_m as kps on kps.id=pd.objectkelompokpasienlastfk left join strukpelayanan_t as sp on sp.norec=pp.strukfk " & _
            "where pr.objectdepartemenfk=3 and pp.tglpelayanan BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' and sp.statusenabled is null and djp.objectjenisprodukfk <> 97 " & _
            str1 & _
            str2 & _
            str3 & _
            "group by pd.noregistrasi,pp.tglpelayanan,dp.namadepartemen,ru.namaruangan,kps.kelompokpasien, pr.id, pr.namaproduk,pp.hargajual,pp.jumlah,pp.hargadiscount " & _
            "order by pp.tglpelayanan "
'    Dim uc, tjs, tJm, tjp, tju As Double
'    Dim i As Integer
'
'    For i = 0 To RS2.RecordCount - 1
'        tjs = tjs + CDbl(IIf(isnull(RS2!jasasarana), 0, RS2!jasasarana))
'        tJm = tJm + CDbl(IIf(isnull(RS2!jasamedis), 0, RS2!jasamedis))
'        tjp = tjp + CDbl(IIf(isnull(RS2!jasaparamedis), 0, RS2!jasaparamedis))
'        tju = tju + CDbl(IIf(isnull(RS2!jasaumum), 0, RS2!jasaumum))
'        uc = uc + CDbl(IIf(isnull(RS2!unitcost), 0, RS2!unitcost))
'
'        RS2.MoveNext
'    Next

    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtNamaKasir.SetText NamaKasir
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & " ' "
            .usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usLayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .usKelompokPasien.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .usDepartemen.SetUnboundFieldSource ("{ado.namadepartemen}")
            .unQty.SetUnboundFieldSource ("{ado.jumlah}")
            .unTarif.SetUnboundFieldSource ("{ado.hargajual}")
            .unDiskon.SetUnboundFieldSource ("{ado.diskon}")
            .unSubtotal.SetUnboundFieldSource ("{ado.subtotal}")
            .unUnitCost.SetUnboundFieldSource ("{ado.unitcost}")
            .unJasaSarana.SetUnboundFieldSource ("{ado.jasasarana}")
            .unJasaMedis.SetUnboundFieldSource ("{ado.jasamedis}")
            .unJasaParamedis.SetUnboundFieldSource ("{ado.jasaparamedis}")
            .unJasaUmum.SetUnboundFieldSource ("{ado.jasaumum}")

'            .txtC7.SetText Format(tC7, "##,##0.00")
            If idDepartemen <> "" Then
                If idDepartemen = 18 Then
                    .TxtJudul.SetText "RAWAT JALAN"
                ElseIf idDepartemen = 16 Then
                    .TxtJudul.SetText "RAWAT INAP"
                End If
            Else
                .TxtJudul.SetText "SEMUA INSTALASI"
            End If
            
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
