VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmLaporanJurnaAdmin 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5790
   Icon            =   "frmLaporanJurnalAdmin.frx":0000
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
Attribute VB_Name = "frmLaporanJurnaAdmin"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crLaporanJurnalHarian
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

    Set frmLaporanJurnalAdminDetail = Nothing
End Sub

Public Sub CetakLaporanJurnal(idKasir As String, tglAwal As String, tglAkhir As String, idDepartemen As String, idRuangan As String, namaPrinted As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmLaporanJurnalAdminDetail = Nothing
Dim adocmd As New ADODB.Command

    Dim str1 As String
    Dim str2 As String
    
    If idDepartemen <> "" Then
        If idDepartemen = 18 Then
            str1 = " AND ru2.objectdepartemenfk <> 16"
        Else
            If idDepartemen <> "" Then
                str1 = " AND ru2.objectdepartemenfk = '" & idDepartemen & "' "
            End If
        End If
    End If
    'If idDepartemen <> "" Then
       ' str1 = "and ru.objectdepartemenfk = " & idDepartemen & " "
   ' End If
    If idRuangan <> "" Then
        str2 = " and apd.objectruanganfk=" & idRuangan & " "
    End If
    
    
Set Report = New crLaporanJurnalHarian
    strSQL = "select pd.noregistrasi, ru.namaruangan, tp.produkfk, " & _
            "case when jp.id=97 then '41120040121001' else map.kdperkiraan end as kdperkiraan, " & _
            "case when jp.id=97 then 'Pendt. Tindakan Ka Instalasi Farmasi' else map.namaperkiraan end as namaperkiraan, " & _
            "case when (tp.hargajual* tp.jumlah) is null then 0 else (tp.hargajual* tp.jumlah) end as total, " & _
            "'Pendapatan R.Jalan' as keterangan " & _
            "from pasiendaftar_t as pd left JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec " & _
            "left join pelayananpasien_t as tp on tp.noregistrasifk = apd.norec " & _
            "LEFT JOIN produk_m AS pro ON tp.produkfk = pro.id " & _
            "left JOIN detailjenisproduk_m as djp on djp.id=pro.objectdetailjenisprodukfk " & _
            "left JOIN jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk " & _
            "left JOIN kelompokproduk_m as kp on kp.id=jp.objectkelompokprodukfk left JOIN ruangan_m as ru on ru.id=apd.objectruanganfk left JOIN ruangan_m as ru2 on ru2.id=pd.objectruanganlastfk " & _
            "left join mapjurnalmanual as map on map.objectruanganfk = ru.id and map.jpid=pro.id  " & _
            "left join departemen_m as dp on dp.id = ru.objectdepartemenfk inner JOIN pasien_m as ps on ps.id=pd.nocmfk " & _
            "where pd.tglregistrasi between '" & tglAwal & "' and '" & tglAkhir & "' and  pro.id in (10011572,10011571) and tp.produkfk not in (402611) and map.jenis='Pendapatan' " & _
            str1 & _
            str2 & _
            " order by pro.namaproduk"
   
            
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtPrinted.SetText namaPrinted
            .txtTanggal.SetText Format(tglAwal, "dd/MM/yyyy")
            .txtPeriode.SetText Format(tglAwal, "MM-yyyy")
            .txtDeskripsi.SetText "Pendapatan R. Jalan Tgl " & Format(tglAwal, "dd MMMM yyyy")
            .usNamaRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usKdPerkiraan.SetUnboundFieldSource ("{ado.kdperkiraan}")
            .usNamaPerkiraan.SetUnboundFieldSource ("{ado.namaperkiraan}")
            .usKeterangan.SetUnboundFieldSource ("{ado.keterangan}")
            '.unDebet.SetUnboundFieldSource ("{ado.P_NonJM}")
            '.unKredit.SetUnboundFieldSource ("{ado.P_JM}")
            .ucTotal.SetUnboundFieldSource ("{ado.total}")
            
            
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
Public Sub CetakLaporanJurnalInap(idKasir As String, tglAwal As String, tglAkhir As String, idDepartemen As String, idRuangan As String, namaPrinted As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmLaporanJurnalAdminDetail = Nothing
Dim adocmd As New ADODB.Command

    Dim str1 As String
    Dim str2 As String
    
    If idDepartemen <> "" Then
        str1 = " AND ru3.objectdepartemenfk = '" & idDepartemen & "' "
    End If
    If idRuangan <> "" Then
        str2 = " and apd.objectruanganfk=" & idRuangan & " "
    End If
    
    
Set Report = New crLaporanJurnalHarian
'    strSQL = "select pd.noregistrasi, ru.namaruangan, tp.produkfk,case " & _
            "when jp.id in (99,25)                    then'Pendt. Akomodasi'  +  ' '  +  ru.namaruangan " & _
            "when jp.id =100                          then 'Pendt. Konsultasi'  +  ' '  +  ru.namaruangan " & _
            "when jp.id =101                          then 'Pendt. Visite'  +  ' '  +  ru.namaruangan " & _
            "when jp.id =102                          then 'Pendt. Tindakan'  +  ' '  +  ru.namaruangan " & _
            "when jp.id =36                           then 'Pendt. Tindakan'  +  ' '  +  ru.namaruangan " & _
            "when jp.id =103                          then 'Pendt. Tindakan'  +  ' '  +  ru.namaruangan " & _
            "when jp.id =107                          then 'Pendt. Tindakan'  +  ' '  +  ru.namaruangan " & _
            "when jp.id =97                           then 'Pendt. Tindakan Ka Instalasi Farmasi' " & _
            "when jp.id=27666                         then 'Pendt. Alat Canggih'  +  ' '  +  ru.namaruangan " & _
            "ELSE 'Pendt. Tindakan'  +  ' '  +  ru.namaruangan end  as namaperkiraan, " & _
            "case when (tp.hargajual* tp.jumlah) is null then 0 else (tp.hargajual* tp.jumlah) end as total, " & _
            "'Pendapatan R.Inap' as keterangan " & _
            "from pasiendaftar_t as pd left JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec " & _
            "left join pelayananpasien_t as tp on tp.noregistrasifk = apd.norec left join strukpelayanan_t as sp on sp.noregistrasifk = pd.norec " & _
            "LEFT JOIN produk_m AS pro ON tp.produkfk = pro.id " & _
            "left JOIN detailjenisproduk_m as djp on djp.id=pro.objectdetailjenisprodukfk " & _
            "left JOIN jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk " & _
            "left JOIN kelompokproduk_m as kp on kp.id=jp.objectkelompokprodukfk " & _
            "left JOIN ruangan_m as ru on ru.id=apd.objectruanganfk " & _
            "left join ruangan_m as ru2 on ru2.id = apd.objectruanganasalfk  left join departemen_m as dp on dp.id = ru2.objectdepartemenfk " & _
            "where pd.tglregistrasi between '" & tglAwal & "' and '" & tglAkhir & "'  and sp.statusenabled is null and jp.id in (25,99,100,101,102,36,103,107,97,27666)" & _
            str1 & _
            str2 '& _
            "group by pd.noregistrasi, ru.namaruangan, tp.produkfk, kp.id, pro.id, pro.namaproduk order by pro.id"
    strSQL = "select pd.noregistrasi, ru.namaruangan, tp.produkfk, " & _
            "case when jp.id=97 then '41120040121001' else map.kdperkiraan end as kdperkiraan, " & _
            "case when jp.id=97 then 'Pendt. Tindakan Ka Instalasi Farmasi' else map.namaperkiraan end as namaperkiraan, " & _
            "(tp.hargajual-(case when tp.hargadiscount is null then 0 else tp.hargadiscount end))*tp.jumlah as total, " & _
            "'Pendapatan R.Inap' as keterangan " & _
            "from pasiendaftar_t as pd left JOIN antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec " & _
            "left join pelayananpasien_t as tp on tp.noregistrasifk = apd.norec " & _
            "LEFT JOIN produk_m AS pro ON tp.produkfk = pro.id " & _
            "left JOIN detailjenisproduk_m as djp on djp.id=pro.objectdetailjenisprodukfk " & _
            "left JOIN jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk " & _
            "left JOIN kelompokproduk_m as kp on kp.id=jp.objectkelompokprodukfk " & _
            "left JOIN ruangan_m as ru on ru.id=pd.objectruanganlastfk left JOIN ruangan_m as ru3 on ru3.id=pd.objectruanganlastfk " & _
            "left join ruangan_m as ru2 on ru2.id = apd.objectruanganfk  left join departemen_m as dp on dp.id = ru2.objectdepartemenfk " & _
            "left join mapjurnalmanual as map on map.objectruanganfk = ru3.id and map.jpid=pro.id  " & _
            "where tp.tglpelayanan between '" & tglAwal & "' and '" & tglAkhir & "'   and  pro.id in (10011572,10011571) and tp.produkfk not in (402611) and map.jenis='Pendapatan' " & _
            str1 & _
            str2 '& _

            
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtPrinted.SetText namaPrinted
            .txtTanggal.SetText Format(tglAwal, "dd/MM/yyyy")
            .txtPeriode.SetText Format(tglAwal, "MM-yyyy")
            .txtDeskripsi.SetText "Rekapitulasi Pendapatan R. Inap Tgl " & Format(tglAwal, "dd MMMM yyyy")
            .usNamaRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNamaPerkiraan.SetUnboundFieldSource ("{ado.namaperkiraan}")
            .usKdPerkiraan.SetUnboundFieldSource ("{ado.kdperkiraan}")
            .usKeterangan.SetUnboundFieldSource ("{ado.keterangan}")
            '.unDebet.SetUnboundFieldSource ("{ado.P_NonJM}")
            '.unKredit.SetUnboundFieldSource ("{ado.P_JM}")
            .ucTotal.SetUnboundFieldSource ("{ado.total}")
            
            
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
