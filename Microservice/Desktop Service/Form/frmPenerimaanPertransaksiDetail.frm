VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmPenerimaanPertransaksiDetail 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   6990
   Icon            =   "frmPenerimaanPertransaksiDetail.frx":0000
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
Attribute VB_Name = "frmPenerimaanPertransaksiDetail"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crPenerimaanPertransaksiDetail
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

    Set frmPenerimaanPertransaksiDetail = Nothing
End Sub

Public Sub Cetak(idKasir As String, tglAwal As String, tglAkhir As String, idRuangan As String, idDokter As String, view As String, strIdPegawai As String)

Set frmPenerimaanPertransaksiDetail = Nothing
Dim adocmd As New ADODB.Command
    Dim str1 As String
    Dim str2 As String
        Dim str3 As String
        
    If idDokter <> "" Then
        str1 = "and pd.objectpegawaifk=" & idDokter & " "
    End If
    If idRuangan <> "" Then
        str2 = " and pd.objectruanganlastfk=" & idRuangan & " "
    End If
    If idKasir <> "" Then
        str3 = " and pg2.id=" & idKasir & " "
    End If
    
Set Report = New crPenerimaanPertransaksiDetail
    strSQL = "select case when cb.id = 1 then sbm.totaldibayar else 0 end as tunai,case when cb.id > 1 then sbm.totaldibayar else 0 end as nontunai ,sum(case when kpr2.id = 25 then spd.hargasatuan* spd.qtyproduk else 0 end) as nl_akomodasi, sum(case when kpr2.id = 24 then spd.hargasatuan* spd.qtyproduk else 0 end) as nl_farmasi, " & _
             "sum(case when kpr2.id = 20 then spd.hargasatuan* spd.qtyproduk else 0 end) as nl_laundry,sum(case when kpr2.id = 16 then spd.hargasatuan* spd.qtyproduk else 0 end) as nl_jenazah, " & _
             "sum(case when kpr.id = 25 then (pp.hargajual* pp.jumlah)-pp.hargadiscount else 0 end) as karcis,sum(case when kpr.id = 26 and pp.hargadiscount is not null then (pp.hargajual* pp.jumlah)-pp.hargadiscount  when kpr.id = 26 and pp.hargadiscount is null then pp.hargajual* pp.jumlah else 0 end) as konsul, " & _
             "sum(case when kpr.id in (3, 4, 8, 9, 10, 11, 13, 14) and pp.hargadiscount is not null then (pp.hargajual* pp.jumlah)-pp.hargadiscount when kpr.id in (3, 4, 8, 9, 10, 11, 13, 14) and pp.hargadiscount is  null then pp.hargajual* pp.jumlah else 0 end) as tindakan, sum(case when kpr.id =1 and pp.hargadiscount is not null then (pp.hargajual* pp.jumlah)-pp.hargadiscount when kpr.id =1 and pp.hargadiscount is  null then pp.hargajual* pp.jumlah else 0 end) as lab, sum(case when kpr.id =2 and pp.hargadiscount is not null then (pp.hargajual* pp.jumlah)-pp.hargadiscount " & _
            "when kpr.id =2 and pp.hargadiscount is null then pp.hargajual* pp.jumlah else 0 end) as radiologi, " & _
             "sum(case when pp.aturanpakai is not null then (pp.hargajual* pp.jumlah)+ pp.jasa else 0 end) as farmasi,case when pd.noregistrasi is null then sp.nostruk else pd.noregistrasi end as noregistrasi, sbm.tglsbm, ps.nocm,case when ps.namapasien is null then sp.namapasien_klien else ps.namapasien end as namapasien,case when kp.kelompokpasien is null then 'non layanan' else kp.kelompokpasien end as kelompokpasien, " & _
             "ru.namaruangan,  pg.namalengkap, pg2.namalengkap as kasir,  sbm.totaldibayar, case when sp.totalprekanan is null then 0 else sp.totalprekanan end as hutangpenjamin,sp.totalharusdibayar,  lu.namauser as namalogin " & _
             "from strukbuktipenerimaan_t as sbm " & _
             "left join strukbuktipenerimaancarabayar_t as sbmc on sbmc.nosbmfk=sbm.norec " & _
             "left join carabayar_m as cb on cb.id=sbmc.objectcarabayarfk inner join strukpelayanan_t as sp on sp.norec=sbm.nostrukfk " & _
             "left join strukpelayanandetail_t as spd on sp.norec=spd.nostrukfk left join pelayananpasien_t as pp on pp.strukfk=sp.norec " & _
             "left join loginuser_s as lu on lu.id=sbm.objectpegawaipenerimafk left join pegawai_m as pg2 on pg2.id=lu.objectpegawaifk " & _
             "left join pasiendaftar_t as pd on pd.norec=sp.noregistrasifk left join antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk " & _
             "left join produk_m as pr on pr.id=pp.produkfk left join detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk left join jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk " & _
             "left join kelompokproduk_m as kpr on kpr.id=jp.objectkelompokprodukfk  left join pasien_m as ps on ps.id=sp.nocmfk " & _
             "left join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk left join pegawai_m as pg on pg.id=pd.objectpegawaifk " & _
             "left join ruangan_m as ru on ru.id=pd.objectruanganlastfk  left join kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk " & _
             "left join produk_m as pr2 on pr2.id=spd.objectprodukfk  left join detailjenisproduk_m as djp2 on djp2.id=pr2.objectdetailjenisprodukfk " & _
             "left join jenisproduk_m as jp2 on jp2.id=djp2.objectjenisprodukfk left join kelompokproduk_m as kpr2 on kpr2.id=jp2.objectkelompokprodukfk " & _
             "where sbm.tglsbm BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
             str1 & _
             str2 & _
             str3 & _
             "group by sbm.tglsbm, sp.namapasien_klien, kp.kelompokpasien, sp.totalprekanan, sp.totalharusdibayar, lu.namauser, sp.tglstruk, pg2.id, pg2.namalengkap , ru.namaruangan,  pg.namalengkap, ps.nocm , ps.namapasien,  sbmc.objectcarabayarfk,cb.id, sbm.objectruanganfk, ru.namaruangan, pd.noregistrasi,  pd.objectkelompokpasienlastfk , sbm.totaldibayar, sp.nostruk order by pd.noregistrasi "

   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
          .usNamaKasir.SetText strIdPegawai
'           .usNamaLogin.SetText strIdPegawai
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .usNamaLogin.SetUnboundFieldSource ("{ado.kasir}")
            .udtTglSBM.SetUnboundFieldSource ("{ado.tglsbm}")
            .usRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
'            .usKelTransaksi.SetUnboundFieldSource ("{ado.jenistransaksi}")
            .usNoCM.SetUnboundFieldSource ("{ado.nocm}")
            .usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usJK.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .ucTotalbiaya.SetUnboundFieldSource ("{ado.totaldibayar}")
            .ucKarcis.SetUnboundFieldSource ("{ado.karcis}")
            .ucKonsul.SetUnboundFieldSource ("{ado.konsul}")
            .ucTindakan.SetUnboundFieldSource ("{ado.tindakan}")
            .ucLab.SetUnboundFieldSource ("{ado.lab}")
            .ucRadiologi.SetUnboundFieldSource ("{ado.radiologi}")
            .ucResep.SetUnboundFieldSource ("{ado.farmasi}")
            .ucLaundry.SetUnboundFieldSource ("{ado.nl_laundry}")
            .ucJenazah.SetUnboundFieldSource ("{ado.nl_jenazah}")
            .ucEmbos.SetUnboundFieldSource ("{ado.nl_akomodasi}")
            .ucFarmasiNL.SetUnboundFieldSource ("{ado.nl_farmasi}")
            .ucHutangPenjamin.SetUnboundFieldSource ("{ado.hutangpenjamin}")
'            .ucJmlBayar.SetUnboundFieldSource ("{ado.totalharusdibayar}")
            .ucTunai.SetUnboundFieldSource ("{ado.tunai}")
            .ucCard.SetUnboundFieldSource ("{ado.nontunai}")
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
