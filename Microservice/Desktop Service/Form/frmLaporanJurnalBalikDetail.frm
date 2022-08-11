VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmLaporanJurnalBalikDetail 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5790
   Icon            =   "frmLaporanJurnalBalikDetail.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7005
   ScaleWidth      =   5790
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
Attribute VB_Name = "frmLaporanJurnalBalikDetail"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crLaporanJurnalBalikDetail
Dim Reports As New crLaporanJurnalBalikDetailInap
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
    Reports.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
    'PrinterNama = cboPrinter.Text
    Report.PrintOut False
    Reports.PrintOut False
End Sub

Private Sub CmdOption_Click()
    Report.PrinterSetup Me.hwnd
    Reports.PrinterSetup Me.hwnd
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

    Set frmLaporanJurnalBalikDetail = Nothing
End Sub

Public Sub CetakLaporanJurnalBalikDetail(idKasir As String, tglAwal As String, tglAkhir As String, idDepartemen As String, idRuangan As String, namaPrinted As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmLaporanJurnalBalikDetail = Nothing
Dim adocmd As New ADODB.Command

    Dim str1 As String
    Dim str2 As String
    Dim strFilter, strFilter2, strFilter3 As String

    strFilter = ""
    strFilter2 = ""
    
    strFilter2 = " where pp.tglpelayanan BETWEEN '" & _
    Format(tglAwal, "yyyy-MM-dd 00:00:00") & "' AND '" & _
    Format(tglAkhir, "yyyy-MM-dd 23:59:59") & "' and pp.hargadiscount <> 0 "
    
    strFilter = " where sp.tglstruk BETWEEN '" & _
    Format(tglAwal, "yyyy-MM-dd 00:00:00") & "' AND '" & _
    Format(tglAkhir, "yyyy-MM-dd 23:59:59") & "' AND sp.statusenabled is null and sp.totalprekanan <> 0"
    
    strFilter = strFilter & " AND ru.objectdepartemenfk  <> 16 " 'in(18,28,24) "
    strFilter2 = strFilter2 & " AND ru.objectdepartemenfk <> 16 " 'in(18,28,24)"
    
    If idDepartemen <> "" Then
'        strFilter = strFilter & " AND ru.objectdepartemenfk  = '" & idDepartemen & "'"
'        strFilter2 = strFilter2 & " AND ru.objectdepartemenfk =   '" & idDepartemen & "'"
    End If
    
    

    If idRuangan <> "" Then strFilter = strFilter & " and pd.objectruanganlastfk=" & idRuangan & ""
    
    strFilter = strFilter & " GROUP BY sp.tglstruk, pd.noregistrasi,ps.nocm,ps.namapasien,ru.id,ru.namaruangan,dp.id"
    strFilter2 = strFilter2 & " GROUP BY pp.tglpelayanan,pd.noregistrasi,ps.nocm,ps.namapasien,ru.id,ru.namaruangan,dp.id"
    
Set Report = New crLaporanJurnalBalikDetail

    strSQL = "select tgl,tglregistrasi,noregistrasi,nocm,namapasien,idruangan,namaruangan,iddepartemen," & _
            "sum(umum) as umum,sum(perusahaan) as perusahaan,sum(bpjs) as bpjs, sum(diskon) as diskon,sum(total) as total from ( " & _
            "select to_char(sp.tglstruk , 'YYYY-MM-DD') AS tgl,sp.tglstruk as tglregistrasi,pd.noregistrasi,ps.nocm,ps.namapasien,ru.id AS idruangan,ru.namaruangan,dp.id  AS iddepartemen, " & _
            "sum(CASE WHEN kp.id in (1,6) then sp.totalprekanan else 0 end) as umum, " & _
            "sum(CASE WHEN kp.id in (3,5) then sp.totalprekanan else 0 end) as perusahaan, " & _
            "sum(CASE WHEN kp.id in (2,4) then sp.totalprekanan else 0 end) as bpjs, 0 as diskon, " & _
            "sum(sp.totalprekanan) As total " & _
            "from Pasiendaftar_t as pd  " & _
            "LEFT JOIN strukpelayanan_t as sp on sp.noregistrasifk=pd.norec " & _
            "left join strukpelayananpenjamin_t as spp on spp.nostrukfk = sp.norec " & _
            "LEFT JOIN ruangan_m as ru on ru.id=pd.objectruanganlastfk " & _
            "left join departemen_m as dp on dp.id = ru.objectdepartemenfk " & _
            "left join rekanan_m as r on r.id = pd.objectrekananfk " & _
            "left join jenisrekanan_m as jr on jr.id = r.objectjenisrekananfk " & _
            "LEFT JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk left join pasien_m as ps on ps.id=pd.nocmfk " & _
            strFilter & _
            " Union All " & _
            "select to_char(pp.tglpelayanan, 'YYYY-MM-DD') AS tgl, pp.tglpelayanan as tglregistrasi,pd.noregistrasi,ps.nocm,ps.namapasien,ru.id AS idruangan,ru.namaruangan, dp.id  AS iddepartemen, " & _
            "0 as umum, " & _
            "0 as perusahaan, " & _
            "0 as bpjs, " & _
            "sum(case when pp.hargadiscount * pp.jumlah is null then 0 else pp.hargadiscount * pp.jumlah end) As diskon, 0 as total " & _
            "from pasiendaftar_t as pd inner join antrianpasiendiperiksa_t as adp on adp.noregistrasifk = pd.norec " & _
            "left join pelayananpasien_t as pp on pp.noregistrasifk = adp.norec left join pasien_m as ps on ps.id=pd.nocmfk left join ruangan_m as ru on ru.id=pd.objectruanganlastfk left join departemen_m as dp on dp.id = ru.objectdepartemenfk " & _
            strFilter2 & ")x  group by x.tgl,x.tglregistrasi,x.noregistrasi,x.nocm,x.namapasien,x.idruangan,x.namaruangan,x.idDepartemen "
            

    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtPrinted.SetText namaPrinted
            .txtTanggal.SetText Format(tglAwal, "dd/MM/yyyy")
            '.txtPeriode.SetText Format(tglAwal, "MM-yyyy")
'            .txtTglDeskripsi.SetText Format(tglAwal, "dd/MM/yyyy")
'            '.ucDebet.SetUnboundFieldSource ("{ado.tunai}")
'            '.ucKredit.SetUnboundFieldSource ("{ado.nontunai}")
            .usTgl.SetUnboundFieldSource ("{ado.tgl}")
            .udTglRegistrasi.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .usRegMR.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNocm.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            
            .ucPasien.SetUnboundFieldSource ("{ado.umum}")
            .ucPerusahaan.SetUnboundFieldSource ("{ado.perusahaan}")
            .ucBpjs.SetUnboundFieldSource ("{ado.bpjs}")
            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
            .ucTotal.SetUnboundFieldSource ("{ado.total}")
            
            .usNamaRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
'            .ucDetailDiskon.SetUnboundFieldSource ("{ado.detaildiskon}")
'            .usruanganDiskon.SetUnboundFieldSource ("{ado.ruangandiskon}")
           
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

Public Sub CetakLaporanJurnalBalikDetailInap(idKasir As String, tglAwal As String, tglAkhir As String, idDepartemen As String, idRuangan As String, namaPrinted As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmLaporanJurnalBalikDetail = Nothing
Dim adocmd As New ADODB.Command

    Dim str1 As String
    Dim str2 As String
    Dim strFilter, strFilter2, strFilter3 As String

    strFilter = ""
    strFilter2 = ""
    strFilter3 = ""

    strFilter3 = " where pp.tglpelayanan BETWEEN '" & _
    Format(tglAwal, "yyyy-MM-dd 00:00:00") & "' AND '" & _
    Format(tglAkhir, "yyyy-MM-dd 23:59:59") & "' and pp.hargajual <> 0  and pp.produkfk=402611  "
    
    strFilter2 = " where pp.tglpelayanan BETWEEN '" & _
    Format(tglAwal, "yyyy-MM-dd 00:00:00") & "' AND '" & _
    Format(tglAkhir, "yyyy-MM-dd 23:59:59") & "' and pp.hargadiscount <> 0 "
    
    strFilter = " where sp.tglstruk BETWEEN '" & _
    Format(tglAwal, "yyyy-MM-dd 00:00:00") & "' AND '" & _
    Format(tglAkhir, "yyyy-MM-dd 23:59:59") & "' AND sp.statusenabled is null and sp.totalprekanan <> 0 "
    
    strFilter = strFilter & " AND ru.objectdepartemenfk  in(16) "
    strFilter2 = strFilter2 & " AND ru.objectdepartemenfk in(16)"
    strFilter3 = strFilter3 & " AND ru.objectdepartemenfk in(16)"
    

    If idRuangan <> "" Then strFilter = strFilter & " and pd.objectruanganlastfk=" & idRuangan & ""
    
    strFilter = strFilter & " GROUP BY sp.tglstruk, pd.noregistrasi,ps.nocm,ps.namapasien,ru.id,ru.namaruangan,dp.id"
    strFilter2 = strFilter2 & " GROUP BY pp.tglpelayanan,pd.noregistrasi,ps.nocm,ps.namapasien,ru.id,ru.namaruangan,dp.id"
    strFilter3 = strFilter3 & " GROUP BY pp.tglpelayanan,pd.noregistrasi,ps.nocm,ps.namapasien,ru.id,ru.namaruangan,dp.id"

Set Reports = New crLaporanJurnalBalikDetailInap

    strSQL = "select tgl,tglregistrasi,noregistrasi,nocm,namapasien,idruangan,namaruangan,iddepartemen,sum(umum) as umum,sum(perusahaan) as perusahaan,sum(bpjs) as bpjs, sum(diskon) as diskon,sum(uangmuka) as uangmuka,sum(total) as total  " & _
            "from (select to_char(sp.tglstruk, 'YYYY-MM-DD') AS tgl,sp.tglstruk as tglregistrasi,pd.noregistrasi,ps.nocm,ps.namapasien,ru.id AS idruangan,ru.namaruangan,case when dp.id <> 16 then 18 else 16 end AS iddepartemen, " & _
            "sum(CASE WHEN kp.id in (1,6) then sp.totalprekanan else 0 end) as umum, " & _
            "sum(CASE WHEN kp.id in (3,5) then sp.totalprekanan else 0 end) as perusahaan, " & _
            "sum(CASE WHEN kp.id in (2,4) then sp.totalprekanan else 0 end) as bpjs, 0 as diskon,0 as uangmuka, " & _
            "sum(sp.totalprekanan) As total " & _
            "from Pasiendaftar_t as pd  " & _
            "LEFT JOIN strukpelayanan_t as sp on sp.noregistrasifk=pd.norec left join strukpelayananpenjamin_t as spp on spp.nostrukfk = sp.norec LEFT JOIN ruangan_m as ru on ru.id=pd.objectruanganlastfk left join departemen_m as dp on dp.id = ru.objectdepartemenfk left join rekanan_m as r on r.id = pd.objectrekananfk left join jenisrekanan_m as jr on jr.id = r.objectjenisrekananfk LEFT JOIN kelompokpasien_m as kp on kp.id = pd.objectkelompokpasienlastfk left join pasien_m as ps on ps.id=pd.nocmfk " & _
            strFilter & _
            " Union All " & _
            "select to_char(pp.tglpelayanan, 'YYYY-MM-DD') AS tgl, pp.tglpelayanan as tglregistrasi,pd.noregistrasi,ps.nocm,ps.namapasien,ru.id AS idruangan,ru.namaruangan,case when dp.id <> 16 then 18 else 16 end AS iddepartemen, " & _
            "0 as umum, " & _
            "0 as perusahaan, " & _
            "0 as bpjs, " & _
            "sum(case when pp.hargadiscount * pp.jumlah is null then 0 else pp.hargadiscount * pp.jumlah end) As diskon, 0 as uangmuka, 0 as total " & _
            "from pasiendaftar_t as pd inner join antrianpasiendiperiksa_t as adp on adp.noregistrasifk = pd.norec left join pelayananpasien_t as pp on pp.noregistrasifk = adp.norec left join pasien_m as ps on ps.id=pd.nocmfk left join ruangan_m as ru on ru.id=pd.objectruanganlastfk left join departemen_m as dp on dp.id = ru.objectdepartemenfk " & _
            strFilter2 & _
            " Union All " & _
            "select to_char(pp.tglpelayanan, 'YYYY-MM-DD') AS tgl, pp.tglpelayanan as tglregistrasi,pd.noregistrasi,ps.nocm, " & _
            "ps.namapasien,ru.id AS idruangan,ru.namaruangan,case when dp.id <> 16 then 18 else 16 end AS iddepartemen, " & _
            "0 as umum, 0 as perusahaan, 0 as bpjs, 0 as diskon, " & _
            "sum(case when pp.hargajual is null then 0 else pp.hargajual end) As uangmuka, 0 as total " & _
            "from pasiendaftar_t as pd inner join antrianpasiendiperiksa_t as adp on adp.noregistrasifk = pd.norec left join pelayananpasien_t as pp on pp.noregistrasifk = adp.norec left join pasien_m as ps on ps.id=pd.nocmfk left join ruangan_m as ru on ru.id=pd.objectruanganlastfk left join departemen_m as dp on dp.id = ru.objectdepartemenfk  " & _
            strFilter3 & _
            ")x group by x.tgl,x.tglregistrasi,x.noregistrasi,x.nocm,x.namapasien,x.idruangan,x.namaruangan,x.idDepartemen "
            

    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Reports
        .database.AddADOCommand CN_String, adocmd
            .txtPrinted.SetText namaPrinted
            .txtTanggal.SetText Format(tglAwal, "dd/MM/yyyy")
            '.txtPeriode.SetText Format(tglAwal, "MM-yyyy")
'            .txtTglDeskripsi.SetText Format(tglAwal, "dd/MM/yyyy")
'            '.ucDebet.SetUnboundFieldSource ("{ado.tunai}")
'            '.ucKredit.SetUnboundFieldSource ("{ado.nontunai}")
            .usTgl.SetUnboundFieldSource ("{ado.tgl}")
            .udTglRegistrasi.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .usRegMR.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNocm.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            
            .ucPasien.SetUnboundFieldSource ("{ado.umum}")
            .ucPerusahaan.SetUnboundFieldSource ("{ado.perusahaan}")
            .ucBpjs.SetUnboundFieldSource ("{ado.bpjs}")
            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
            .ucUangMuka.SetUnboundFieldSource ("{ado.uangmuka}")
            .ucTotal.SetUnboundFieldSource ("{ado.total}")
            
            .usNamaRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
'            .ucDetailDiskon.SetUnboundFieldSource ("{ado.detaildiskon}")
'            .usruanganDiskon.SetUnboundFieldSource ("{ado.ruangandiskon}")
           
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanJurnal")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Reports
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
