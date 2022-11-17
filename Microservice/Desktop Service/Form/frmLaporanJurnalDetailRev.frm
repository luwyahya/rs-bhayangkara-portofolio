VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmLaporanJurnalDetailRev 
   Caption         =   "Transmedic"
   ClientHeight    =   6855
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5775
   Icon            =   "frmLaporanJurnalDetailRev.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   6855
   ScaleWidth      =   5775
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
      Height          =   6855
      Left            =   0
      TabIndex        =   4
      Top             =   0
      Width           =   5775
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
Attribute VB_Name = "frmLaporanJurnalDetailRev"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crLaporanJurnalDetailRev
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

    Set frmLaporanJurnalDetail = Nothing
End Sub

Public Sub CetakLaporanJurnal(noJurnal As String, tglAwal As String, tglAkhir As String, typeDetail As String, idRuangan As String, namaPrinted As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmLaporanJurnalDetail = Nothing
Dim adocmd As New ADODB.Command

    Dim str1 As String
    Dim str2 As String
    Dim judul As String
    
    
Set Report = New crLaporanJurnalDetailRev
            
    'strSQL = "select pd.tglregistrasi, pd.noregistrasi  +  '/'  +  ps.nocm as regcm, ps.namapasien, ru.namaruangan, tp.produkfk as kode, pro.namaproduk as layanan, tp.hargajual, tp.jumlah, " & _
            "case when jp.id=97 then '41120040121001' else map.kdperkiraan end as kdperkiraan, " & _
            "case when jp.id=97 then 'Pendt. Tindakan Ka Instalasi Farmasi' else map.namaperkiraan end as namaperkiraan, " & _
            "(case when tp.hargajual is null then 0 else tp.hargajual end-(case when tp.hargadiscount is null then 0 else tp.hargadiscount end))*tp.jumlah as total, " & _
            "'Pendapatan R. Jalan' as keterangan " & _
            "from pasiendaftar_t as pd left JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec " & _
            "left join pelayananpasien_t as tp on tp.noregistrasifk = apd.norec  " & _
            "LEFT JOIN produk_m AS pro ON tp.produkfk = pro.id " & _
            "left JOIN detailjenisproduk_m as djp on djp.id=pro.objectdetailjenisprodukfk " & _
            "left JOIN jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk " & _
            "left JOIN kelompokproduk_m as kp on kp.id=jp.objectkelompokprodukfk left JOIN ruangan_m as ru on ru.id=apd.objectruanganfk left JOIN ruangan_m as ru2 on ru2.id=pd.objectruanganlastfk " & _
            "left join departemen_m as dp on dp.id = ru.objectdepartemenfk inner JOIN pasien_m as ps on ps.id=pd.nocmfk left join mapjurnalmanual as map on map.objectruanganfk = ru.id and map.jpid=jp.id or map.jpid=jp.id and map.objectruanganfk = 999 " & _
            "where tp.tglpelayanan between '" & tglAwal & "' and '" & tglAkhir & "'   and tp.produkfk not in (402611,10011572,10011571) and map.jenis='Pendapatan' " & _
            str1 & _
            str2 & _
            " order by ps.namapasien"
    

    If Mid(noJurnal, 5, 2) = "PN" And (Right(noJurnal, 5) = "00001" Or Right(noJurnal, 5) = "00002") Then
        judul = "RINCIAN JURNAL PENDAPATAN HARIAN"
        If typeDetail = "BEDAHARGA" Then
            strSQL = "select ru.namaruangan, pd.noregistrasi  ||  '/'  ||  ps.nocm as noMR, ps.namapasien ,pp.produkfk, " & _
                     "pj.namaproduktransaksi as keteranganlainnya, " & _
                     "(case when pp.hargajual is null then 0 else pp.hargajual end-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end)) as hargaPP,pp.jumlah, " & _
                     "pjd.objectaccountfk as accountid, pj.nojurnal,coa.noaccount,coa.namaaccount, " & _
                     "case when pjd.hargasatuand =0 then  pjd.hargasatuank else pjd.hargasatuand end as hargaPJ, " & _
                     "(case when pp.hargajual is null then 0 else pp.hargajual end-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end)) *pp.jumlah as Total " & _
                     "from postingjurnaltransaksi_t as pj " & _
                     "INNER JOIN postingjurnaltransaksid_t as pjd on pj.norec=pjd.norecrelated " & _
                     "INNER JOIN pelayananpasien_t as pp on pp.norec=pj.norecrelated " & _
                     "INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk " & _
                     "INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
                     "INNER JOIN pasien_m as ps on ps.id=pd.nocmfk " & _
                     "INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk " & _
                     "INNER JOIN chartofaccount_m as coa on coa.id=pjd.objectaccountfk " & _
                     "where nojurnal_intern='" & noJurnal & "' and pjd.hargasatuank <>0 " & _
                     "and case when pjd.hargasatuand =0 then  pjd.hargasatuank else pjd.hargasatuand end  <> " & _
                     "((case when pp.hargajual is null then 0 else pp.hargajual end) *pp.jumlah)+ case when jasa is null then 0 else jasa end " & _
                     "order by coa.namaaccount;"
        Else
            strSQL = "select ru.namaruangan, pd.noregistrasi  ||  '/'  ||  ps.nocm as noMR, ps.namapasien , " & _
                     "pp.produkfk, " & _
                     "pj.namaproduktransaksi as keteranganlainnya, " & _
                     "(case when pp.hargajual is null then 0 else pp.hargajual end)  as hargaPP,pp.jumlah, " & _
                     "((case when pp.hargajual is null then 0 else pp.hargajual end) * pp.jumlah) + case when jasa is null then 0 else jasa end as Total, " & _
                     "pjd.objectaccountfk as accountid, pj.nojurnal,coa.noaccount, " & _
                     "coa.namaaccount, " & _
                     "pjd.hargasatuank , pjd.hargasatuand " & _
                     "from postingjurnaltransaksi_t as pj " & _
                     "INNER JOIN postingjurnaltransaksid_t as pjd on pj.norec=pjd.norecrelated " & _
                     "INNER JOIN pelayananpasien_t as pp on pp.norec=pj.norecrelated " & _
                     "INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk " & _
                     "INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
                     "INNER JOIN pasien_m as ps on ps.id=pd.nocmfk " & _
                     "INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk " & _
                     "INNER JOIN chartofaccount_m as coa on coa.id=pjd.objectaccountfk " & _
                     "where nojurnal_intern='" & noJurnal & "' and pjd.hargasatuank <>0 " & _
                     " "
            strSQL = strSQL + " union all select ru.namaruangan,  sp.nostruk  as nomr, sp.namapasien_klien as namapasien , " & _
                     "spd.objectprodukfk as produkfk, pj.namaproduktransaksi as keteranganlainnya, " & _
                     "spd.qtyproduk as hargapp,spd.qtyproduk as jumlah, ((spd.hargasatuan )*spd.qtyproduk) + spd.hargatambahan as total, " & _
                     "pjd.objectaccountfk as accountid, pj.nojurnal,coa.noaccount, coa.namaaccount, pjd.hargasatuank , pjd.hargasatuand " & _
                      "from postingjurnaltransaksi_t as pj " & _
                      "inner join postingjurnaltransaksid_t as pjd on pj.norec=pjd.norecrelated " & _
                      "inner join strukpelayanandetail_t as spd on spd.norec=pj.norecrelated " & _
                      "inner join strukpelayanan_t as sp on sp.norec=spd.nostrukfk " & _
                      "inner join ruangan_m as ru on ru.id=sp.objectruanganfk " & _
                      "inner join chartofaccount_m as coa on coa.id=pjd.objectaccountfk " & _
                      "where nojurnal_intern='" & noJurnal & "' and pjd.hargasatuank <>0 and substring(nostruk,1,2)='OB' " & _
                      ""
        End If
    End If
    If Mid(noJurnal, 5, 2) = "PN" And (Right(noJurnal, 5) = "00003" Or Right(noJurnal, 5) = "00004") Then
        judul = "RINCIAN JURNAL PENDAPATAN NON TUNAI"
        strSQL = "select ru.namaruangan, pd.noregistrasi  ||  '/'  ||  ps.nocm as noMR, ps.namapasien , pp.produkfk, pj.namaproduktransaksi as keteranganlainnya, " & _
                 "pj.deskripsiproduktransaksi,pp.jumlah, pp.statusenabled,pp.norec,((case when pp.hargadiscount is null then 0 else pp.hargadiscount end)) * pp.jumlah as Total, " & _
                 "pjd.objectaccountfk as accountid, pj.nojurnal,coa.noaccount, coa.namaaccount, pjd.hargasatuank , pjd.hargasatuand, " & _
                 "((case when pp.hargadiscount is null then 0 else pp.hargadiscount end)) as hargaPP,0 as totalprekanan " & _
                 "from postingjurnaltransaksi_t as pj INNER JOIN postingjurnaltransaksid_t as pjd on pj.norec=pjd.norecrelated " & _
                 "INNER JOIN pelayananpasien_t as pp on pp.norec=pj.norecrelated INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk " & _
                 "INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk INNER JOIN pasien_m as ps on ps.id=pd.nocmfk " & _
                 "INNER JOIN ruangan_m as ru on ru.id=apd.objectruanganfk INNER JOIN chartofaccount_m as coa on coa.id=pjd.objectaccountfk " & _
                 "where nojurnal_intern='" & noJurnal & "' and pjd.hargasatuank <>0 " & _
                 "Union All " & _
                 " select ru.namaruangan, pd.noregistrasi  ||  '/'  ||  ps.nocm as noMR, ps.namapasien , 0 as produkfk, pj.namaproduktransaksi as keteranganlainnya, " & _
                 "pj.deskripsiproduktransaksi, 1 as jumlah, sp.statusenabled,sp.norec, pjd.hargasatuand as Total, " & _
                 "pjd.objectaccountfk as accountid, pj.nojurnal,coa.noaccount,case when rkn.namarekanan is null then coa.namaaccount  else coa.namaaccount  +  ' -> '  +  rkn.namarekanan end as namaaccount, pjd.hargasatuank , pjd.hargasatuand , " & _
                 "pjd.hargasatuand as hargaPP,sp.totalprekanan " & _
                 "from postingjurnaltransaksi_t as pj INNER JOIN postingjurnaltransaksid_t as pjd on pj.norec=pjd.norecrelated INNER JOIN strukpelayanan_t as sp on sp.norec=pj.norecrelated INNER JOIN pasiendaftar_t as pd on pd.norec=sp.noregistrasifk left JOIN rekanan_m as rkn on rkn.id=pd.objectrekananfk " & _
                 "INNER JOIN pasien_m as ps on ps.id=pd.nocmfk INNER JOIN ruangan_m as ru on ru.id=pd.objectruanganlastfk INNER JOIN chartofaccount_m as coa on coa.id=pjd.objectaccountfk " & _
                 "where nojurnal_intern='" & noJurnal & "' and pjd.hargasatuand <>0 " & _
                 "Union All " & _
                 "select '-' as namaruangan,  ps.nocm as noMR, ps.namapasien , 0 as produkfk, pj.namaproduktransaksi as keteranganlainnya, " & _
                 "pj.deskripsiproduktransaksi, 1 as jumlah, sp.statusenabled,sp.norec,sbm.totaldibayar as Total, " & _
                 "pjd.objectaccountfk as accountid, pj.nojurnal,coa.noaccount, coa.namaaccount, pjd.hargasatuank , pjd.hargasatuand , " & _
                 "sbm.totaldibayar as hargaPP,sp.totalprekanan " & _
                 "from postingjurnaltransaksi_t as pj INNER JOIN postingjurnaltransaksid_t as pjd on pj.norec=pjd.norecrelated INNER JOIN strukbuktipenerimaancarabayar_t as sbmc on sbmc.norec=pj.norecrelated INNER JOIN strukbuktipenerimaan_t as sbm on sbm.norec=sbmc.nosbmfk " & _
                 "left JOIN strukpelayanan_t as sp on sbm.nostrukfk=sp.norec left JOIN pasien_m as ps on ps.id=sp.nocmfk INNER JOIN chartofaccount_m as coa on coa.id=pjd.objectaccountfk " & _
                 "where nojurnal_intern='" & noJurnal & "' and pjd.hargasatuand <>0"

        
    End If
    If Mid(noJurnal, 5, 2) = "KS" And (Right(noJurnal, 5) = "00001") Then
        judul = "RINCIAN JURNAL PENERIMAAN KAS"
        strSQL = "select ru.namaruangan, sbm.nosbm  as nomr,  ps.namapasien , '0' as produkfk, pj.namaproduktransaksi as keteranganlainnya, " & _
                 "pj.deskripsiproduktransaksi,1 as jumlah, sbm.statusenabled,sbmc.norec,sbmc.totaldibayar as total, pjd.objectaccountfk as accountid, " & _
                 "pj.nojurnal,coa.noaccount, coa.namaaccount, pjd.hargasatuank , pjd.hargasatuand, sbmc.totaldibayar as hargapp,0 as totalprekanan " & _
                 "from postingjurnaltransaksi_t as pj " & _
                 "inner join postingjurnaltransaksid_t as pjd on pj.norec=pjd.norecrelated  inner join strukbuktipenerimaancarabayar_t as sbmc on sbmc.norec=pj.norecrelated " & _
                 "inner join strukbuktipenerimaan_t as sbm on sbm.norec=sbmc.nosbmfk  left join strukpelayanan_t as sp on sp.norec=sbm.nostrukfk " & _
                 "left join pasiendaftar_t as pd on pd.norec=sp.noregistrasifk  left join pasien_m as ps on ps.id=sp.nocmfk " & _
                 "left join ruangan_m as ru on ru.id=pd.objectruanganlastfk  inner join chartofaccount_m as coa on coa.id=pjd.objectaccountfk " & _
                 "where nojurnal_intern='" & noJurnal & "' and pjd.hargasatuand <>0 "
    End If
    If Mid(noJurnal, 5, 2) = "RS" And (Right(noJurnal, 5) = "00001") Then
        judul = "RINCIAN JURNAL HUTANG DAGANG"
        strSQL = "select ru.namaruangan,  sp.nostruk  as nomr,  rkn.namarekanan as  namapasien , '0' as produkfk, " & _
                 "pj.namaproduktransaksi as keteranganlainnya, pj.deskripsiproduktransaksi,1 as jumlah, sp.statusenabled, " & _
                 "sp.norec,sp.totalharusdibayar as total, pjd.objectaccountfk as accountid, pj.nojurnal,coa.noaccount, coa.namaaccount, " & _
                 "pjd.hargasatuank , pjd.hargasatuand, sp.totalharusdibayar as hargapp,0 as totalprekanan  " & _
                 "from postingjurnaltransaksi_t as pj  inner join postingjurnaltransaksid_t as pjd on pj.norec=pjd.norecrelated " & _
                 "inner join strukpelayanan_t as sp on sp.norec=pj.norecrelated INNER JOIN rekanan_m as rkn on rkn.id=sp.objectrekananfk " & _
                 "INNER JOIN ruangan_m as ru on ru.id=sp.objectruanganfk  inner join chartofaccount_m as coa on coa.id=pjd.objectaccountfk " & _
                 "where nojurnal_intern='" & noJurnal & "' and pjd.hargasatuand <>0 "
    End If
    

            
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtJudul.SetText "RINCIAN JURNAL PENDAPATAN HARIAN"
            .txtPrinted.SetText namaPrinted
            .txttanggal.SetText Format(tglAwal, "dd-MM-yyyy")
            .txtJudul.SetText judul
            
            .usKdPerkiraan.SetUnboundFieldSource ("{ado.noaccount}")
            .usNmPerkiraan.SetUnboundFieldSource ("{ado.namaaccount}")
            '.usNamaRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .usRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .usRegMR.SetUnboundFieldSource ("{ado.nomr}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usLayanan.SetUnboundFieldSource ("{ado.keteranganlainnya}")
            .ucTarif.SetUnboundFieldSource ("{ado.hargaPP}")
            .unjumlah.SetUnboundFieldSource ("{ado.jumlah}")
            .unKode.SetUnboundFieldSource ("{ado.produkfk}")
            '.unDebet.SetUnboundFieldSource ("{ado.P_NonJM}")
            '.unKredit.SetUnboundFieldSource ("{ado.P_JM}")
            .ucTotal.SetUnboundFieldSource ("{ado.Total}")
            
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanJurnal")
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
'Public Sub CetakLaporanJurnalInap(idKasir As String, tglAwal As String, tglAkhir As String, idDepartemen As String, idRuangan As String, namaPrinted As String, view As String)
'On Error GoTo errLoad
''On Error Resume Next
'
'Set frmLaporanJurnalDetail = Nothing
'Dim adocmd As New ADODB.Command
'
'    Dim str1 As String
'    Dim str2 As String
'
'    If idDepartemen <> "" Then
'        str1 = " AND ru2.objectdepartemenfk in (16) "
'    End If
''    If idDepartemen <> "" Then
''        str1 = "and ru.objectdepartemenfk=" & idDepartemen & " "
''    End If
'    If idRuangan <> "" Then
'        str2 = " and apd.objectruanganfk=" & idRuangan & " "
'    End If
'
'
'Set Report = New crLaporanJurnalDetail
'
'    strSQL = "select pd.tglregistrasi, pd.noregistrasi  +  '/'  +  ps.nocm as regcm, ps.namapasien,case when jp.id=97 then 'Farmasi' else ru.namaruangan end as namaruangan, tp.produkfk as kode, pro.namaproduk as layanan, tp.hargajual, tp.jumlah,  " & _
'            "case when jp.id=97 then '41120040121001' else map.kdperkiraan end as kdperkiraan, " & _
'            "case when jp.id=97 then 'Pendt. Tindakan Ka Instalasi Farmasi' else map.namaperkiraan end as namaperkiraan,   " & _
'            "(tp.hargajual-(case when tp.hargadiscount is null then 0 else tp.hargadiscount end))*tp.jumlah as total, " & _
'            "'Pendapatan R.Inap' as keterangan " & _
'            "from pasiendaftar_t as pd left JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec " & _
'            "left join pelayananpasien_t as tp on tp.noregistrasifk = apd.norec  " & _
'            "LEFT JOIN produk_m AS pro ON tp.produkfk = pro.id " & _
'            "left JOIN detailjenisproduk_m as djp on djp.id=pro.objectdetailjenisprodukfk " & _
'            "left JOIN jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk " & _
'            "left JOIN kelompokproduk_m as kp on kp.id=jp.objectkelompokprodukfk " & _
'            "left JOIN ruangan_m as ru on ru.id=apd.objectruanganfk  left join departemen_m as dp on dp.id = ru.objectdepartemenfk left JOIN ruangan_m as ru2 on ru2.id=pd.objectruanganlastfk " & _
'            "left join mapjurnalmanual as map on map.objectruanganfk = ru.id and map.jpid=jp.id or map.jpid=jp.id and map.objectruanganfk = 999 " & _
'            "inner JOIN pasien_m as ps on ps.id=pd.nocmfk " & _
'            "where tp.tglpelayanan between '" & tglAwal & "' and '" & tglAkhir & "'   and tp.produkfk not in (402611,10011572,10011571) and map.jenis='Pendapatan' " & _
'            str1 & _
'            str2
'
'    adocmd.CommandText = strSQL
'    adocmd.CommandType = adCmdText
'
'    With Report
'        .database.AddADOCommand CN_String, adocmd
'            .txtJudul.SetText "RINCIAN JURNAL PENDAPATAN HARIAN RAWAT INAP"
'            .txtPrinted.SetText namaPrinted
'            .txtTanggal.SetText Format(tglAwal, "dd-MM-yyyy")
'            '.usTglRegis.SetUnboundFieldSource ("{ado.tglregistrasi}")
'            .usKdPerkiraan.SetUnboundFieldSource ("{ado.kdperkiraan}")
'            .usNmPerkiraan.SetUnboundFieldSource ("{ado.namaperkiraan}")
'            '.usNamaRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
'            .usRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
'            .usRegMR.SetUnboundFieldSource ("{ado.regcm}")
'            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
'            .usLayanan.SetUnboundFieldSource ("{ado.layanan}")
'            .ucTarif.SetUnboundFieldSource ("{ado.hargajual}")
'            .unJumlah.SetUnboundFieldSource ("{ado.jumlah}")
'            .unKode.SetUnboundFieldSource ("{ado.kode}")
'            '.unDebet.SetUnboundFieldSource ("{ado.P_NonJM}")
'            '.unKredit.SetUnboundFieldSource ("{ado.P_JM}")
'            .ucTotal.SetUnboundFieldSource ("{ado.total}")
'
'
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanJurnal")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
'                With CRViewer1
'                    .ReportSource = Report
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
'        'End If
'    End With
'Exit Sub
'errLoad:
'    MsgBox Err.Number & " " & Err.Description
'End Sub
'
'
