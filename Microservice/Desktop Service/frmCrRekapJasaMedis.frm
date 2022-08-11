VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCrRekapJasaMedis 
   Caption         =   "Medifirst2000"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCrRekapJasaMedis.frx":0000
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
Attribute VB_Name = "frmCrRekapJasaMedis"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crRekapJasaMedis
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

    Set frmCrRekapJasaMedis = Nothing
End Sub

Public Sub cetak(idKasir As String, tglAwal As String, tglAkhir As String, idDepartemen As String, namaKasir As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCrRekapJasaMedis = Nothing
Dim adocmd As New ADODB.Command
'
'    Dim str1 As String
    Dim str2 As String
'    Dim str3 As String
'
'    If idDokter <> "" Then
'        str1 = "and apd.objectpegawaifk=" & idDokter & " "
'    End If
    If idDepartemen <> "" Then
        str2 = ""
    End If
'     If idKasir <> "" Then
'        str3 = " and pg2.id=" & idKasir & " "
'    End If
     
    
Set Report = New crRekapJasaMedis
    strSQL = "SELECT distinct" & _
                " pegawai_m.namalengkap AS dokter, ruangan_m.namaruangan AS ruangan, produk_m.id, " & _
                " produk_m.namaproduk AS layanan, " & _
                " (pelayananpasien_t.jumlah) AS qty, " & _
                " pelayananpasien_t.hargajual AS tarif, " & _
                " (case when pelayananpasien_t.hargadiscount is null then 0 else pelayananpasien_t.hargadiscount END) AS diskon, " & _
                " (pelayananpasien_t.jumlah * pelayananpasien_t.hargajual) AS subtotal, " & _
                " 0 AS unitcost, " & _
                " (CASE WHEN pelayananpasiendetail_t.komponenhargafk= 38 then (pelayananpasiendetail_t.hargajual * pelayananpasien_t.jumlah) else 0 end) AS jasasarana, " & _
                " (CASE WHEN pelayananpasiendetail_t.komponenhargafk= 35 then (pelayananpasiendetail_t.hargajual * pelayananpasien_t.jumlah) else 0 end) AS jasamedis, " & _
                " (CASE WHEN pelayananpasiendetail_t.komponenhargafk= 25 then (pelayananpasiendetail_t.hargajual * pelayananpasien_t.jumlah) else 0 end) AS jasaparamedis, " & _
                " (CASE WHEN pelayananpasiendetail_t.komponenhargafk= 30 then (pelayananpasiendetail_t.hargajual * pelayananpasien_t.jumlah) else 0 end) AS jasaumum " & _
                " From " & _
                " produk_m " & _
                " INNER JOIN detailjenisproduk_m on detailjenisproduk_m.id = produk_m.objectdetailjenisprodukfk INNER JOIN jenisproduk_m on jenisproduk_m.id = detailjenisproduk_m.objectjenisprodukfk " & _
                " INNER JOIN pelayananpasien_t ON pelayananpasien_t.produkfk = produk_m.id " & _
                " INNER JOIN strukpelayanan_t on strukpelayanan_t.norec = pelayananpasien_t.strukfk " & _
                " INNER JOIN pelayananpasiendetail_t ON pelayananpasiendetail_t.produkfk = produk_m.id " & _
                " AND pelayananpasiendetail_t.pelayananpasien = pelayananpasien_t.norec " & _
                " INNER JOIN antrianpasiendiperiksa_t ON pelayananpasien_t.noregistrasifk = antrianpasiendiperiksa_t.norec " & _
                " AND pelayananpasiendetail_t.noregistrasifk = antrianpasiendiperiksa_t.norec " & _
                " INNER JOIN ruangan_m on ruangan_m.id = strukpelayanan_t.objectruanganfk " & _
                " INNER JOIN pelayananpasienpetugas_t on pelayananpasienpetugas_t.pelayananpasien = pelayananpasien_t.norec INNER JOIN pegawai_m on pegawai_m.id = pelayananpasienpetugas_t.objectpegawaifk INNER JOIN jenispegawai_m on jenispegawai_m.id = pegawai_m.objectjenispegawaifk" & _
                " Where pelayananpasien_t.tglpelayanan BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' and strukpelayanan_t.statusenabled is null and jenispegawai_m.id = 1 and jenisproduk_m.id not in (97,25,99)" & _
                str2
                 '" pelayananpasien_t.noregistrasifk = '2f0b21d0-ca5b-11e7-abb3-4be9fade' AND " & _

'   ReadRs2 "select pd.tglregistrasi,pg2.id,pg2.namalengkap as kasir,  apd.objectpegawaifk,pg.namalengkap, sum(case when cb.id = 1 and pd.objectkelompokpasienlastfk=1 then 1 else 0 end) as cash, " & _
'            "sum(case when cb.id > 1 and pd.objectkelompokpasienlastfk=1 then 1 else 0 end) as KK,sum(case when  pd.objectkelompokpasienlastfk > 1 then 1 else 0 end) as JM,sum(case when cb.id = 1 and pd.objectkelompokpasienlastfk=1 then sp.totalharusdibayar else 0 end) as P_CH," & _
'            "sum(case when cb.id > 1 and pd.objectkelompokpasienlastfk=1 then sp.totalharusdibayar else 0 end) as P_KK,sum(case when pd.objectkelompokpasienlastfk > 1 then (case when sp.totalprekanan is null then 0 else sp.totalprekanan end)+(case when sp.totalharusdibayar is null then 0 else sp.totalharusdibayar end) else 0 end)  as P_JM, " & _
'            "(select sum((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end ))*ppd.jumlah ) from pelayananpasiendetail_t ppd where ppd.komponenhargafk=35 and ppd.strukfk=sp.norec) as M_jasa, " & _
'            "0 as M_Pph, 0 as M_Diterima, " & _
'            "(select sum((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end ))*ppd.jumlah )  from pelayananpasiendetail_t ppd where ppd.komponenhargafk=25 and ppd.strukfk=sp.norec) as Pr_Jasa, " & _
'            "0 as Pr_Pph,0 as Pr_Diterima " & _
'            "from strukpelayanan_t as sp " & _
'            "LEFT JOIN strukbuktipenerimaan_t as sbm on sp.nosbmlastfk=sbm.norec " & _
'            "LEFT JOIN strukbuktipenerimaancarabayar_t as sbmc on sbm.norec=sbmc.nosbmfk " & _
'            "left JOIN carabayar_m as cb on cb.id=sbmc.objectcarabayarfk " & _
'            "left JOIN loginuser_s as lu on lu.id=sbm.objectpegawaipenerimafk " & _
'            "left JOIN pegawai_m as pg2 on pg2.id=lu.objectpegawaifk " & _
'            "inner JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=sp.noregistrasifk " & _
'            "inner JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
'            "inner JOIN pegawai_m as pg on pg.id=apd.objectpegawaifk " & _
'            "inner JOIN ruangan_m as ru on ru.id=apd.objectruanganfk " & _
'             "where sp.tglstruk between '" & tglAwal & "' and '" & tglAkhir & "' and sp.statusenabled is null " & _
'             "" & str1 & " " & str2 & " " & _
'             "group by pd.tglregistrasi,pg2.id,pg2.namalengkap ,  apd.objectpegawaifk,pg.namalengkap,sp.norec " & _
'            "order by pg.namalengkap"
'    Dim tCash, tKk, tPj, tJm, tRemun, tPm, tPR As Double
'    Dim i As Integer
'
'    For i = 0 To RS2.RecordCount - 1
'        tCash = tCash + CDbl(IIf(IsNull(RS2!P_CH), 0, RS2!P_CH))
'        tKk = tKk + CDbl(IIf(IsNull(RS2!P_KK), 0, RS2!P_KK))
'        tPj = tPj + CDbl(IIf(IsNull(RS2!P_JM), 0, RS2!P_JM))
'        tJm = tJm + CDbl(IIf(IsNull(RS2!M_jasa), 0, RS2!M_jasa))
'        tPm = tPm + CDbl(IIf(IsNull(RS2!Pr_Jasa), 0, RS2!Pr_Jasa))
'        If Weekday(RS2!tglregistrasi, vbMonday) < 6 Then
'            If CDate(RS2!tglregistrasi) > CDate(Format(RS2!tglregistrasi, "yyyy-MM-dd 07:00")) And _
'                CDate(RS2!tglregistrasi) < CDate(Format(RS2!tglregistrasi, "yyyy-MM-dd 13:00")) Then
'                tRemun = tRemun + CDbl(IIf(IsNull(RS2!M_jasa), 0, RS2!M_jasa))
'                tPR = tPR + CDbl(IIf(IsNull(RS2!Pr_Jasa), 0, RS2!Pr_Jasa))
''                tJm = tJm + CDbl(IIf(IsNull(RS2!M_jasa), 0, RS2!M_jasa))
''                tPm = tPm + CDbl(IIf(IsNull(RS2!Pr_Jasa), 0, RS2!Pr_Jasa))
'            Else
''                tRemun = tRemun + CDbl(IIf(IsNull(RS2!P_JM), 0, RS2!P_JM))
''                tPR = tPR + CDbl(IIf(IsNull(RS2!Pr_Jasa), 0, RS2!Pr_Jasa))
'            End If
'        Else
''            tJm = tJm + CDbl(IIf(IsNull(RS2!M_jasa), 0, RS2!M_jasa))
''            tPm = tPm + CDbl(IIf(IsNull(RS2!Pr_Jasa), 0, RS2!Pr_Jasa))
'            tRemun = 0
'            tPR = 0
'        End If
'
'
'        RS2.MoveNext
'    Next
'
'    Dim tAdmCc, tB3, tBPajak, tB5 As Double
'
'    tAdmCc = (tKk * 3) / 100
'    tB3 = tJm '+ tRemun
'    tRemun = (tRemun * 10) / 100
'    tBPajak = (tB3 * 7.5) / 100
'    tB5 = tB3 - tBPajak
'
'    Dim tC3, tCPajak, tC5, tC7 As Double
'
'    tC3 = tPm '+ tPR
'    tPR = (tPR * 10) / 100
'    tCPajak = (tC3 * 7.5) / 100
'    tC5 = tC3 - tCPajak
'    tC7 = tC5
            
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtNamaKasir.SetText namaKasir
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & " ' "
            .usNamaDokter.SetUnboundFieldSource ("{ado.dokter}")
            .usLayanan.SetUnboundFieldSource ("{ado.layanan}")
            .usRuangan.SetUnboundFieldSource ("{ado.ruangan}")
            .unQty.SetUnboundFieldSource ("{ado.qty}")
            .unTarif.SetUnboundFieldSource ("{ado.tarif}")
            '.unDiskon.SetUnboundFieldSource ("{ado.diskon}")
            .unSubtotal.SetUnboundFieldSource ("{ado.subtotal}")
            .unJasaMedis.SetUnboundFieldSource ("{ado.jasamedis}")
            .unJasaParamedis.SetUnboundFieldSource ("{ado.jasaparamedis}")
'            .txtA1.SetText Format(tCash, "##,##0.00")
'            .txtA2.SetText Format(tKk, "##,##0.00")
'            .txtA3.SetText Format(tAdmCc, "##,##0.00")
'            .txtA4.SetText Format(tPj, "##,##0.00")
'
'            .txtB1.SetText Format(tJm, "##,##0.00")
'            .txtB2.SetText Format(tRemun, "##,##0.00")
'            .txtB3.SetText Format(tB3, "##,##0.00")
'            .txtB4.SetText Format(tBPajak, "##,##0.00")
'            .txtB5.SetText Format(tB5, "##,##0.00")
'
'            .txtC1.SetText Format(tPm, "##,##0.00")
'            .txtC2.SetText Format(0, "##,##0.00")
'            .txtC3.SetText Format(tC3, "##,##0.00")
'            .txtC4.SetText Format(tCPajak, "##,##0.00")
'            .txtC5.SetText Format(tC5, "##,##0.00")
'            .txtC6.SetText Format(0, "##,##0.00")
'            .txtC7.SetText Format(tC7, "##,##0.00")
            
            
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
