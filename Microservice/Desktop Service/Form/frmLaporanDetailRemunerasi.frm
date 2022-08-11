VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmLaporanDetailRemunerasi 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmLaporanDetailRemunerasi.frx":0000
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
Attribute VB_Name = "frmLaporanDetailRemunerasi"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crLaporanDetailRemunerasi
Dim ReportDetailDokter As New crLaporanDetailRemunerasiDokter
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

    Set frmLaporanDetailRemunerasi = Nothing
End Sub

Public Sub CetakLaporan(namaPrinted As String, tglAwal As String, tglAkhir As String, strDept As String, strruangan As String, strStatus As String, view As String)
On Error GoTo errLoad
On Error Resume Next

Set frmLaporanDetailRemunerasi = Nothing
Dim idRuangan As String
Dim idDept As String
Dim noClosing As String
Dim idDokter As String
Dim str As String
Dim adocmd As New ADODB.Command

If strruangan <> "" Then
    str = " and ru.id =  '" & strruangan & "' "
End If

If strDept <> "" Then
    str = str & " and ru.objectdepartemenfk = '" & strDept & "' "
End If

If strStatus <> "" Then
   If strStatus = "true" Then
    str = str & " and ru.iseksekutif = 1 "
   Else
    str = str & " and ru.iseksekutif = 0 "
   End If
End If

Set Report = New crLaporanDetailRemunerasi

    strSQL = "select x.namaruangan, sum(x.JasaDr) as JasaDr,sum(x.Paramedis) as Paramedis,sum(x.PostRemun) as PostRemun, " & _
             "sum(x.Direksi) as Direksi,sum(x.StaffDireksi) as StaffDireksi,sum(x.Manajemen) as Manajemen from " & _
             "(select ru.namaruangan,case when sdp.jenispagufk  = 7 then sum(sdp.jenispagunilai) else 0 end as 'JasaDr', " & _
             "case when sdp.jenispagufk = 8 then sum(sdp.jenispagunilai) else 0 end as 'Paramedis', " & _
             "case when sdp.jenispagufk  = 9 then sum(sdp.jenispagunilai) else 0 end as 'PostRemun', " & _
             "case when sdp.jenispagufk  = 10 then sum(sdp.jenispagunilai) else 0 end as 'Direksi', " & _
             "case when sdp.jenispagufk  = 11 then sum(sdp.jenispagunilai) else 0 end as 'StaffDireksi', " & _
             "case when sdp.jenispagufk  = 12 then sum(sdp.jenispagunilai) else 0 end as 'Manajemen' " & _
             "from strukdetailpagu_t as sdp " & _
             "INNER JOIN ruangan_m as ru on ru.id=sdp.ruanganfk  " & _
             "inner join strukpagu_t as sp on sp.norec =sdp.strukpagufk " & _
             "Where sp.periodeawal BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
             "and sdp.tglpelayanan  > '2019-05-31 23:59' " & _
             str & "  group by ru.namaruangan,sdp.jenispagufk )as x " & _
             "group by x.namaruangan"
   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .txtUser.SetText namaPrinted
            .txtKelompokPasien.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
            .usNamaRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .ucJasaDr.SetUnboundFieldSource ("{ado.JasaDr}")
            .ucParamedis.SetUnboundFieldSource ("{ado.Paramedis}")
            .ucPostRemun.SetUnboundFieldSource ("{ado.PostRemun}")
            .ucStaffDireksi.SetUnboundFieldSource ("{ado.StaffDireksi}")
            .ucDireksi.SetUnboundFieldSource ("{ado.Direksi}")
            .ucManajemen.SetUnboundFieldSource ("{ado.Manajemen}")
            
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

Public Sub CetakLaporanDetailDokter(namaPrinted As String, tglAwal As String, tglAkhir As String, strDept As String, strruangan As String, strDokter As String, strStatus As String, view As String)
On Error GoTo errLoad
On Error Resume Next

Set frmLaporanDetailRemunerasi = Nothing
Dim idRuangan As String
Dim idDept As String
Dim noClosing As String
Dim idDokter As String
Dim namaDokter As String
Dim str As String
Dim adocmd As New ADODB.Command

If strruangan <> "" Then
    str = " and ru.id =  '" & strruangan & "' "
End If

If strDept <> "" Then
    str = str & " and ru.objectdepartemenfk = '" & strDept & "' "
End If

If strDokter <> "" Then
    str = str & " and sdp.dokterid = '" & strDokter & "' "
    ReadRs "select namalengkap from pegawai_m where id = '" & strDokter & "' "
    If Not rs.EOF Then
        namaDokter = "Dokter : " & rs!namalengkap
    Else
        namaDokter = "Dokter : - "
    End If
End If

If strStatus <> "" Then
   If strStatus = "true" Then
    str = str & " and ru.iseksekutif = 1 "
   Else
    str = str & " and ru.iseksekutif = 0 "
   End If
End If

Set ReportDetailDokter = New crLaporanDetailRemunerasiDokter

    strSQL = "select x.tglpelayanan,x.nocm,x.noregistrasi,x.namapasien,x.namaruangan, " & _
             "x.namaproduk,x.isparamedis,x.iscito,x.hargasatuan,(x.jumlah) as qty, " & _
             "sum(X.jenispagunilai) As total " & _
             "from (select convert(varchar, pp.tglpelayanan, 110) as tglpelayanan,ps.nocm,pd.noregistrasi,ps.namapasien,ru.namaruangan, " & _
             "pr.namaproduk,pp.jumlah,pp.hargasatuan, " & _
             "case when pp.isparamedis = '1' then 'V' else '' end as isparamedis,case when pp.iscito = '1' then 'V' else '' end as iscito, " & _
             "sdp.jenispagunilai from strukdetailpagu_t as sdp " & _
             "INNER JOIN pelayananpasien_t as pp on pp.norec=sdp.pelayananpasienfk " & _
             "INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk " & _
             "INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
             "INNER JOIN produk_m as pr on sdp.produkfk=pr.id " & _
             "INNER JOIN pasien_m as ps on ps.id=pd.nocmfk " & _
             "INNER JOIN ruangan_m as ru on ru.id=sdp.ruanganfk " & _
             "Where pd.tglpulang BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
             "and sdp.tglpelayanan  > '2019-05-31 23:59' " & _
             str & " ) as x " & _
             "group by  x.tglpelayanan,x.nocm,x.noregistrasi,x.namapasien,x.namaruangan,x.namaproduk,x.isparamedis, " & _
             "x.iscito,x.hargasatuan,x.jumlah"
   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With ReportDetailDokter
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
             .txtJudul.SetText "LAPORAN DETAIL REMUNERASI DOKTER"
             .txtUser.SetText namaPrinted
             .txtKelompokPasien.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
             .txtDokter.SetText namaDokter
             .udtTglLayanan.SetUnboundFieldSource ("{ado.tglpelayanan}")
             .usNoRM.SetUnboundFieldSource ("{ado.nocm}")
             .usNoregistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
             .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
             .usNamaRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
             .usNamaLayanan.SetUnboundFieldSource ("{ado.namaproduk}")
             .usCito.SetUnboundFieldSource ("{ado.iscito}")
             .usParam.SetUnboundFieldSource ("{ado.isparamedis}")
             .ucHargaSatuan.SetUnboundFieldSource ("{ado.hargasatuan}")
             .ucTotal.SetUnboundFieldSource ("{ado.total}")
             .unjumlah.SetUnboundFieldSource ("{ado.qty}")
            
            If view = "false" Then
                Dim strPrinter As String
                strPrinter = GetTxt("Setting.ini", "Printer", "Billing")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = ReportDetailDokter
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

Public Sub CetakLaporanDetailParamedis(namaPrinted As String, tglAwal As String, tglAkhir As String, strDept As String, strruangan As String, strStatus As String, view As String)
On Error GoTo errLoad
On Error Resume Next

Set frmLaporanDetailRemunerasi = Nothing
Dim idRuangan As String
Dim idDept As String
Dim noClosing As String
Dim idDokter As String
Dim str As String
Dim adocmd As New ADODB.Command

If strruangan <> "" Then
    str = " and ru.id =  '" & strruangan & "' "
End If

If strDept <> "" Then
    str = str & " and ru.objectdepartemenfk = '" & strDept & "' "
End If

If strStatus <> "" Then
   If strStatus = "true" Then
    str = str & " and ru.iseksekutif = 1 "
   Else
    str = str & " and ru.iseksekutif = 0 "
   End If
End If

Set ReportDetailDokter = New crLaporanDetailRemunerasiDokter

    strSQL = "SELECT x.tglpelayanan,x.nocm,x.noregistrasi,x.namapasien,x.namaruangan,x.namaproduk,x.isparamedis, " & _
             "x.iscito,x.hargasatuan,SUM (x.jumlah) AS qty,SUM (x.jenispagunilai) AS total " & _
             "FROM (SELECT pp.tglpelayanan,ps.nocm,pd.noregistrasi,ps.namapasien,ru.namaruangan, " & _
             "pr.namaproduk, pp.jumlah,pp.hargasatuan, sdp.jenispagunilai, " & _
             "case when pp.isparamedis = '1' then 'V' else '' end as isparamedis,case when pp.iscito = '1' then 'V' else '' end as iscito " & _
             "FROM strukdetailpagu_t AS sdp " & _
             "INNER JOIN pelayananpasien_t AS pp ON pp.norec = sdp.pelayananpasienfk " & _
             "INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk " & _
             "INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk " & _
             "INNER JOIN produk_m AS pr ON sdp.produkfk = pr.id " & _
             "INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk " & _
             "INNER JOIN ruangan_m AS ru ON ru.id = sdp.ruanganfk " & _
             "Where pd.tglpulang BETWEEN '" & tglAwal & "' and '" & tglAkhir & "' " & _
             "and sdp.tglpelayanan > '2019-05-31 23:59' and sdp.jenispagufk = 8 " & _
             str & " ) as x " & _
             "group by  x.tglpelayanan,x.nocm,x.noregistrasi,x.namapasien,x.namaruangan, " & _
             "x.namaproduk,x.isparamedis,x.iscito,x.hargasatuan"
   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With ReportDetailDokter
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
             .txtJudul.SetText "LAPORAN DETAIL REMUNERASI PARAMEDIS"
             .txtUser.SetText namaPrinted
             .txtKelompokPasien.SetText "Periode : " & tglAwal & " s/d " & tglAkhir & ""
             .udtTglLayanan.SetUnboundFieldSource ("{ado.tglpelayanan}")
             .usNoRM.SetUnboundFieldSource ("{ado.nocm}")
             .usNoregistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
             .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
             .usNamaRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
             .usNamaLayanan.SetUnboundFieldSource ("{ado.namaproduk}")
             .usCito.SetUnboundFieldSource ("{ado.iscito}")
             .usParam.SetUnboundFieldSource ("{ado.isparamedis}")
             .ucHargaSatuan.SetUnboundFieldSource ("{ado.hargasatuan}")
             .ucTotal.SetUnboundFieldSource ("{ado.total}")
             .unjumlah.SetUnboundFieldSource ("{ado.qty}")
            
            If view = "false" Then
                Dim strPrinter As String
                strPrinter = GetTxt("Setting.ini", "Printer", "Billing")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = ReportDetailDokter
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

