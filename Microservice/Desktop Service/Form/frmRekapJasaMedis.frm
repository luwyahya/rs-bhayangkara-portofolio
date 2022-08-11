VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmRekapJasaMedis 
   Caption         =   "Medifirst2000"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmRekapJasaMedis.frx":0000
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
Attribute VB_Name = "frmRekapJasaMedis"
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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "RekapPenerimaan")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmRekapJasaMedis = Nothing
End Sub

Public Sub CetakRekapPendapatan(idKasir As String, tglAwal As String, tglAkhir As String, idDepartemen As String, idRuangan As String, idDokter As String, idKelompok As String, namaKasir As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmRekapJasaMedis = Nothing
Dim adocmd As New ADODB.Command
    Dim str1, str2, str3, str4, str5 As String
    
    If idDokter <> "" Then
        str1 = "and apd.objectpegawaifk=" & idDokter & " "
    End If
    If idDepartemen <> "" Then
        If idDepartemen = 16 Then
            str4 = " and dp.id = 16"
            str5 = " pg.id = 641"
        Else
            If idDepartemen <> "" Then
                str4 = " and dp.id <> 16 "
                str5 = " pg.id = 192"
            End If
        End If
    End If
    If idRuangan <> "" Then
        str2 = " and apd.objectruanganfk=" & idRuangan & " "
    End If
    If idKelompok <> "" Then
        If idKelompok = 0 Then
            str3 = " and kps.id in (1,3,5) "
        Else
            If idKelompok <> "" Then
                str3 = " and kps.id =" & idKelompok & " "
            End If
        End If
    End If
Set Report = New crRekapJasaMedis

   'strSQL = "select  apd.objectruanganfk,ru.namaruangan, apd.objectpegawaifk,pg.namalengkap, (case when cb.id = 1 and pd.objectkelompokpasienlastfk=1 then 1 else 0 end) as CH, " & _
            "(case when cb.id > 1 and pd.objectkelompokpasienlastfk=1 then 1 else 0 end) as KK,(case when  pd.objectkelompokpasienlastfk > 1 then 1 else 0 end) as JM,sum(case when cb.id = 1 then (pp.hargajual-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end ))*pp.jumlah  else 0 end) as P_CH," & _
            "sum(case when cb.id > 1 and pd.objectkelompokpasienlastfk=1 then (pp.hargajual-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end ))*pp.jumlah  else 0 end) as P_KK,sum(case when pd.objectkelompokpasienlastfk > 1 then (pp.hargajual-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end ))*pp.jumlah  else 0 end)  as P_JM, " & _
            "(select sum((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end ))*ppd.jumlah ) from pelayananpasiendetail_t ppd where ppd.komponenhargafk=35 and ppd.noregistrasifk=apd.norec) as M_jasa, " & _
            "0 as M_Pph, 0 as M_Diterima, " & _
            "(select sum((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end ))*ppd.jumlah )  from pelayananpasiendetail_t ppd where ppd.komponenhargafk=25 and ppd.noregistrasifk=apd.norec) as Pr_Jasa, " & _
            "0 as Pr_Pph,0 as Pr_Diterima " & _
            "from pasiendaftar_t as pd " & _
            "inner JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec left JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec " & _
            "left JOIN pegawai_m as pg on pg.id=apd.objectpegawaifk left JOIN ruangan_m as ru on ru.id=apd.objectruanganfk " & _
            "left JOIN produk_m as pr on pr.id=pp.produkfk left JOIN detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk " & _
            "left JOIN jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk left JOIN kelompokproduk_m as kp on kp.id=jp.objectkelompokprodukfk " & _
            "inner JOIN pasien_m as ps on ps.id=pd.nocmfk left JOIN kelompokpasien_m as kps on kps.id=pd.objectkelompokpasienlastfk " & _
            "left JOIN strukpelayanan_t as sp  on sp.noregistrasifk=pd.norec left JOIN strukbuktipenerimaan_t as sbm  on sbm.norec=sp.nosbmlastfk " & _
            "left JOIN strukbuktipenerimaancarabayar_t as sbmc  on sbmc.nosbmfk=sbm.norec " & _
            "left JOIN carabayar_m as cb  on cb.id=sbmc.objectcarabayarfk  " & _
             "where pd.tglregistrasi between '" & tglAwal & "' and '" & tglAkhir & "'  and sp.statusenabled is null " & _
             " " & str1 & " " & str2 & " " & _
             "group by apd.norec, apd.objectruanganfk,ru.namaruangan, apd.objectpegawaifk,pg.namalengkap,sp.norec ,(case when cb.id = 1 and pd.objectkelompokpasienlastfk=1 then 1 else 0 end) , " & _
             "(case when cb.id > 1 and pd.objectkelompokpasienlastfk=1 then 1 else 0 end) , " & _
             "(case when  pd.objectkelompokpasienlastfk > 1 then 1 else 0 end) " & _
            "order by pg.namalengkap"
    
    strSQL = "select  apd.objectruanganfk,ru.namaruangan, apd.objectpegawaifk,pg.namalengkap, pr.namaproduk, " & _
            "(case when pd.objectkelompokpasienlastfk=1 then pd.noregistrasi else null end) as NonPJ,(case when  pd.objectkelompokpasienlastfk > 1 then pd.noregistrasi else null end) as JM," & _
            "sum(case when pd.objectkelompokpasienlastfk = 1 then (pp.hargajual-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end ))*pp.jumlah  else 0 end)  as P_NonJM, " & _
            "sum(case when pd.objectkelompokpasienlastfk > 1 then (pp.hargajual-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end ))*pp.jumlah  else 0 end)  as P_JM, " & _
            "(select sum((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end ))*pp.jumlah ) from pelayananpasiendetail_t ppd where ppd.komponenhargafk=35 and ppd.pelayananpasien=pp.norec) as M_jasa, " & _
            "0 as M_Pph, 0 as M_Diterima, " & _
            "(select sum((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end ))*pp.jumlah )  from pelayananpasiendetail_t ppd where ppd.komponenhargafk=25 and ppd.pelayananpasien=pp.norec) as Pr_Jasa, " & _
            "0 as Pr_Pph,0 as Pr_Diterima " & _
            "from pasiendaftar_t as pd " & _
            "left JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec left JOIN pelayananpasien_t as pp on pp.noregistrasifk=apd.norec " & _
            "left JOIN pegawai_m as pg on pg.id=apd.objectpegawaifk left JOIN ruangan_m as ru on ru.id=apd.objectruanganfk left join departemen_m as dp on dp.id = ru.objectdepartemenfk " & _
            "left JOIN produk_m as pr on pr.id=pp.produkfk left JOIN detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk " & _
            "left JOIN jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk left JOIN kelompokproduk_m as kp on kp.id=jp.objectkelompokprodukfk " & _
            "left JOIN pasien_m as ps on ps.id=pd.nocmfk left JOIN kelompokpasien_m as kps on kps.id=pd.objectkelompokpasienlastfk " & _
            "left JOIN strukpelayanan_t as sp  on sp.noregistrasifk=pd.norec " & _
             "where pd.tglregistrasi between '" & tglAwal & "' and '" & tglAkhir & "' and jp.id not in (25,99) and djp.objectjenisprodukfk <> 97   and sp.statusenabled is null " & _
             " " & str1 & " " & str2 & " " & str3 & " " & str4 & " " & _
             "group by apd.norec,pp.norec,pd.noregistrasi, apd.objectruanganfk,ru.namaruangan, apd.objectpegawaifk,pg.namalengkap,sp.norec , " & _
             "pd.objectkelompokpasienlastfk,pr.namaproduk,  " & _
            "order by pg.namalengkap"
   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtNamaKasir.SetText namaKasir
            .txtPeriode.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
'            .usNamaKasir.SetUnboundFieldSource ("{ado.kasir}")
            .usNamaRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .usLayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .namaDokter.SetUnboundFieldSource ("{ado.namalengkap}")
            .jCH.SetUnboundFieldSource ("{ado.NonPJ}")
            '.jKK.SetUnboundFieldSource ("{ado.KK}")
            .jJM.SetUnboundFieldSource ("{ado.JM}")
            '.pCH.SetUnboundFieldSource ("{ado.P_CH}")
            .pKK.SetUnboundFieldSource ("{ado.P_NonJM}")
            .pJM.SetUnboundFieldSource ("{ado.P_JM}")
            .mJasa.SetUnboundFieldSource ("{ado.M_Jasa}")
            '.mPph.SetUnboundFieldSource ("{ado.M_Pph}")
            '.mDiterima.SetUnboundFieldSource ("{ado.M_Diterima}")
            .prJasa.SetUnboundFieldSource ("{ado.Pr_Jasa}")
            '.prPph.SetUnboundFieldSource ("{ado.Pr_Pph}")
            '.prDiterima.SetUnboundFieldSource ("{ado.Pr_Diterima}")
            
        ReadRs2 "SELECT pg.namalengkap, jb.namajabatan, pg.nippns FROM pegawai_m as pg " & _
                "inner join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
                "where pg.id=776"
        
        If RS2.BOF Then
            .txtJabatan1.SetText "-"
            .txtPegawai1.SetText "-"
            .txtnip1.SetText "-"
        Else
            .txtJabatan1.SetText UCase(IIf(IsNull(RS2("namajabatan")), "-", RS2("namajabatan")))
            .txtPegawai1.SetText UCase(IIf(IsNull(RS2("namalengkap")), "-", RS2("namalengkap")))
            .txtnip1.SetText UCase(IIf(IsNull(RS2("nippns")), "-", "NIP. " & RS2("nippns")))
        End If
        
        ReadRs2 "SELECT pg.namalengkap, jb.namajabatan, pg.nippns FROM pegawai_m as pg " & _
                "inner join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
                "where pg.id=143"
        
        If RS2.BOF Then
            .txtJabatan2.SetText "-"
            .txtPegawai2.SetText "-"
            .txtnip2.SetText "-"
        Else
            .txtJabatan2.SetText UCase(IIf(IsNull(RS2("namajabatan")), "-", RS2("namajabatan")))
            .txtPegawai2.SetText UCase(IIf(IsNull(RS2("namalengkap")), "-", RS2("namalengkap")))
            .txtnip2.SetText UCase(IIf(IsNull(RS2("nippns")), "-", "NIP. " & RS2("nippns")))
        End If
        
        ReadRs2 "SELECT pg.namalengkap, jb.namajabatan, pg.nippns FROM pegawai_m as pg " & _
                "inner join jabatan_m as jb on jb.id = pg.objectjabatanstrukturalfk " & _
                "where " & str5 & ""
        
        If RS2.BOF Then
            .txtJabatan3.SetText "-"
            .txtPegawai3.SetText "-"
            .txtnip3.SetText "-"
        Else
            .txtJabatan3.SetText UCase(IIf(IsNull(RS2("namajabatan")), "-", RS2("namajabatan")))
            .txtPegawai3.SetText UCase(IIf(IsNull(RS2("namalengkap")), "-", RS2("namalengkap")))
            .txtnip3.SetText UCase(IIf(IsNull(RS2("nippns")), "-", "NIP. " & RS2("nippns")))
        End If
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "RekapPenerimaan")
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

'select pg2.id,pg2.namalengkap as kasir, apd.objectruanganfk,ru.namaruangan, apd.objectpegawaifk,pg.namalengkap,
'sum(case when cb.id = 1 and pd.objectkelompokpasienlastfk=1 then 1 else 0 end) as CH,
'sum(case when cb.id > 1 and pd.objectkelompokpasienlastfk=1 then 1 else 0 end) as KK,
'sum(case when  pd.objectkelompokpasienlastfk > 1 then 1 else 0 end) as JM,
'sum(case when cb.id = 1 and pd.objectkelompokpasienlastfk=1 then sp.totalharusdibayar else 0 end) as P_CH,
'sum(case when cb.id > 1 and pd.objectkelompokpasienlastfk=1 then sp.totalharusdibayar else 0 end) as P_KK,
'sum(case when pd.objectkelompokpasienlastfk > 1 then sp.totalharusdibayar else 0 end)  as P_JM,
'
'(select sum((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end ))*ppd.jumlah )
'from pelayananpasiendetail_t ppd left JOIN antrianpasiendiperiksa_t apd2 on apd2.norec=ppd.noregistrasifk
'where ppd.komponenhargafk=35 and apd2.objectpegawaifk=apd.objectpegawaifk and apd2.objectruanganfk=apd.objectruanganfk)
'as M_jasa,
'
'(((select sum((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end ))*ppd.jumlah )
'from pelayananpasiendetail_t ppd left JOIN antrianpasiendiperiksa_t apd2 on apd2.norec=ppd.noregistrasifk
'where ppd.komponenhargafk=35 and apd2.objectpegawaifk=apd.objectpegawaifk and apd2.objectruanganfk=apd.objectruanganfk)) * 10)/100
'as M_Pph,
'
'((select sum((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end ))*ppd.jumlah )
'from pelayananpasiendetail_t ppd left JOIN antrianpasiendiperiksa_t apd2 on apd2.norec=ppd.noregistrasifk
'where ppd.komponenhargafk=35 and apd2.objectpegawaifk=apd.objectpegawaifk and apd2.objectruanganfk=apd.objectruanganfk))-
'((((select sum((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end ))*ppd.jumlah )
'from pelayananpasiendetail_t ppd left JOIN antrianpasiendiperiksa_t apd2 on apd2.norec=ppd.noregistrasifk
'where ppd.komponenhargafk=35 and apd2.objectpegawaifk=apd.objectpegawaifk and apd2.objectruanganfk=apd.objectruanganfk)) * 10)/100)
'as M_Diterima,
'
'(select sum((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end ))*ppd.jumlah )
'from pelayananpasiendetail_t ppd left JOIN antrianpasiendiperiksa_t apd2 on apd2.norec=ppd.noregistrasifk
'where ppd.komponenhargafk=25 and apd2.objectpegawaifk=apd.objectpegawaifk and apd2.objectruanganfk=apd.objectruanganfk)
' as Pr_Jasa,
'
'(((select sum((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end ))*ppd.jumlah )
'from pelayananpasiendetail_t ppd left JOIN antrianpasiendiperiksa_t apd2 on apd2.norec=ppd.noregistrasifk
'where ppd.komponenhargafk=25 and apd2.objectpegawaifk=apd.objectpegawaifk and apd2.objectruanganfk=apd.objectruanganfk)) * 10)/100
' as Pr_Pph,
'
'((select sum((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end ))*ppd.jumlah )
'from pelayananpasiendetail_t ppd left JOIN antrianpasiendiperiksa_t apd2 on apd2.norec=ppd.noregistrasifk
'where ppd.komponenhargafk=25 and apd2.objectpegawaifk=apd.objectpegawaifk and apd2.objectruanganfk=apd.objectruanganfk))-
'((((select sum((ppd.hargajual-(case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end ))*ppd.jumlah )
'from pelayananpasiendetail_t ppd left JOIN antrianpasiendiperiksa_t apd2 on apd2.norec=ppd.noregistrasifk
'where ppd.komponenhargafk=25 and apd2.objectpegawaifk=apd.objectpegawaifk and apd2.objectruanganfk=apd.objectruanganfk)) * 10)/100)
' as Pr_Diterima
'
'from strukpelayanan_t as sp
'LEFT JOIN strukbuktipenerimaan_t as sbm on sp.nosbmlastfk=sbm.norec
'LEFT JOIN strukbuktipenerimaancarabayar_t as sbmc on sbm.norec=sbmc.nosbmfk
'left JOIN carabayar_m as cb on cb.id=sbmc.objectcarabayarfk
'left JOIN loginuser_s as lu on lu.id=sbm.objectpegawaipenerimafk
'left JOIN pegawai_m as pg2 on pg2.id=lu.objectpegawaifk
'left JOIN ruangan_m as ru2 on ru2.id=sbm.objectruanganfk
'inner JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=sp.noregistrasifk
'inner JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk
'inner JOIN pegawai_m as pg on pg.id=apd.objectpegawaifk
'inner JOIN ruangan_m as ru on ru.id=apd.objectruanganfk
'where sp.tglstruk between '2017-09-02 00:00' and '2017-09-02 23:59' and pg2.id=403 --and pg.id=692
'group by pg2.id,pg2.namalengkap , apd.objectruanganfk,ru.namaruangan, apd.objectpegawaifk,pg.namalengkap
'order by pg.namalengkap
