VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCrRincianPendapatanHarianPerKelas 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5790
   Icon            =   "frmCrRincianPendapatanHarianPerKelas.frx":0000
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
      EnableExportButton=   0   'False
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
Attribute VB_Name = "frmCrRincianPendapatanHarianPerKelas"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crRncianPendapatanHarianPerkelas
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

    Set frmCrRincianPendapatanHarianPerKelas = Nothing
End Sub

Public Sub CetakLaporanPendapatan(idKasir As String, tglAwal As String, tglAkhir As String, strNoReg, idDepartemen As String, idRuangan As String, idKelas As String, namaPrinted As String, view As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmCrRincianPendapatanHarianPerKelas = Nothing
Dim adocmd As New ADODB.Command

    Dim strarr() As String
    Dim strReg, noreg As String
    Dim i As Integer
    
    If strNoReg <> "" Then
        strarr = Split(strNoReg, "|")
        For i = 0 To UBound(strarr)
           noreg = noreg + "'" & strarr(i) & "',"
        Next
        noreg = Left(noreg, Len(noreg) - 1)
        strReg = "and pd.noregistrasi  in (" & noreg & ") "
    End If
    Dim str1, str2, str3 As String

    
    If idDepartemen <> "" Then
        str1 = " and dp.id=" & idDepartemen & " "
    End If
    If idRuangan <> "" Then
        str2 = " and ru.id=" & idRuangan & " "
    End If
    If idKelas <> "" Then
        str3 = " and kls.id=" & idKelas & " "
    End If
    
Set Report = New crRncianPendapatanHarianPerkelas
'    strSQL = " SELECT pasien_m.nocm, pasien_m.namapasien, pd.noregistrasi, " & _
'             "ru.namaruangan, case when pp.hargadiscount is not null then pp.hargadiscount else 0 end as hargadiscount, km.namakamar, " & _
'             "case when jp.id in (99,25) and pp.hargajual is not null then   pp.hargajual else 0 end as Akomodasi, case when jp.id in (99,25) and pp.hargajual is not null then pp.jumlah else 0 end as VolAkomodasi, " & _
'             "case when jp.id=101 and pp.hargajual is not null then   pp.hargajual else 0 end as Visit, case when jp.id=101 and pp.hargajual is not null then pp.jumlah else 0 end as VolVisit, " & _
'             "case when jp.id=27666 and pp.hargajual is not null then   pp.hargajual else 0 end as SewaAlat, case when jp.id=27666 and pp.hargajual is not null then  pp.jumlah else 0 end as VolSewaAlat, " & _
'             "case when jp.id =102 and pp.hargajual is not null then   pp.hargajual else 0 end AS Tindakan, case when jp.id =102 and pp.hargajual is not null then  pp.jumlah  else 0 end AS VolTindakan, " & _
'             "case when jp.id =100 and pp.hargajual is not null then   pp.hargajual else 0 end AS Konsultasi, case when jp.id =100 and pp.hargajual is not null then  pp.jumlah   else 0 end AS VolKonsultasi " & _
'             "From pasiendaftar_t AS pd  " & _
'             "LEFT JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec LEFT JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec  INNER JOIN produk_m AS pro ON pro.id = pp.produkfk " & _
'             "left join kamar_m as km on km.id = apd.objectkamarfk  LEFT JOIN detailjenisproduk_m AS djp ON djp.id = pro.objectdetailjenisprodukfk LEFT JOIN jenisproduk_m AS jp ON jp.id = djp.objectjenisprodukfk  LEFT JOIN kelompokproduk_m AS kp ON kp.id = jp.objectkelompokprodukfk " & _
'             "LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk  LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk INNER JOIN pasien_m ON pd.nocmfk = pasien_m.id Where pp.tglpelayanan between '" & tglAwal & "' and " & _
'            "'" & tglAkhir & "' AND djp.objectjenisprodukfk <> 97 AND jp.id IN (25, 99, 101, 102, 27666) and pro.id not in (10011572,10011571,402611) " & _
'            strReg & _
'            str1 & _
'            str2 & _
'            str3 '& _
'             " GROUP BY jp.id,pasien_m.nocm, pasien_m.namapasien, pd.noregistrasi,pp.hargadiscount, ru.namaruangan  +  ' '  +  kls.namakelas,kls.namakelas, pro.namaproduk )x" & _
'            " GROUP BY x.nocm, x.namapasien, x.noregistrasi, x.namaruangan, x.hargadiscount, x.namakelas ORDER BY  x.noregistrasi ASC "

    strSQL = "select pasien_m.nocm,pasien_m.namapasien,pd.noregistrasi,ru.namaruangan,case when pp.hargadiscount is not null then pp.hargadiscount else 0 end as hargadiscount, " & _
             "km.namakamar,case when jp.id in (99,25) and pp.hargajual is not null then   pp.hargajual else 0 end as akomodasi, " & _
             "case when jp.id in (99,25) and pp.hargajual is not null then pp.jumlah else 0 end as volakomodasi, " & _
             "case when jp.id=101 and pp.hargajual is not null then   pp.hargajual else 0 end as visit, " & _
             "case when jp.id=101 and pp.hargajual is not null then pp.jumlah else 0 end as volvisit, " & _
             "case when jp.id=27666 and pp.hargajual is not null then   pp.hargajual else 0 end as sewaalat, " & _
             "case when jp.id=27666 and pp.hargajual is not null then  pp.jumlah else 0 end as volsewaalat, " & _
             "case when jp.id in (102,15,26,107,22,49,74,108) and pp.hargajual is not null then   pp.hargajual else 0 end as tindakan, " & _
             "case when jp.id in (102,15,26,107,22,49,74,108) and pp.hargajual is not null then  pp.jumlah  else 0 end as voltindakan, " & _
             "case when jp.id =100 and pp.hargajual is not null then   pp.hargajual else 0 end as konsultasi, " & _
             "case when jp.id =100 and pp.hargajual is not null then  pp.jumlah   else 0 end as volkonsultasi, " & _
             "pro.id as idproduk, pro.namaproduk,jp.id as jpid,jp.jenisproduk " & _
             "from pasiendaftar_t as pd " & _
             "left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec " & _
             "left join pelayananpasien_t as pp on pp.noregistrasifk = apd.norec " & _
             "inner join produk_m as pro on pro.id = pp.produkfk " & _
             "left join kamar_m as km on km.id = apd.objectkamarfk " & _
             "left join detailjenisproduk_m as djp on djp.id = pro.objectdetailjenisprodukfk " & _
             "left join jenisproduk_m as jp on jp.id = djp.objectjenisprodukfk left join kelompokproduk_m as kp on kp.id = jp.objectkelompokprodukfk left join ruangan_m as ru on ru.id = apd.objectruanganfk left join departemen_m as dp on dp.id = ru.objectdepartemenfk inner join pasien_m on pd.nocmfk = pasien_m.id " & _
             "Where pp.tglpelayanan between '" & tglAwal & "' and '" & tglAkhir & "' AND djp.objectjenisprodukfk <> 97 and pro.id not in (10011572,10011571,402611) " & _
            strReg & _
            str1 & _
            str2 & _
            str3

    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtNamaKasir.SetText namaPrinted
            .usNamaRuangan.SetUnboundFieldSource ("{ado.namaruangan}")
            .usNoMR.SetUnboundFieldSource ("{ado.nocm}")
            '.usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usKelas.SetUnboundFieldSource ("{ado.namakamar}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .unVolAkomodasi.SetUnboundFieldSource ("{ado.VolAkomodasi}")
            .ucAkomodasi.SetUnboundFieldSource ("{ado.Akomodasi}")
            .unVolVisite.SetUnboundFieldSource ("{ado.VolVisit}")
            .ucVisite.SetUnboundFieldSource ("{ado.Visit}")
            .unVolKonsultasi.SetUnboundFieldSource ("{ado.VolKonsultasi}")
            .ucKonsultasi.SetUnboundFieldSource ("{ado.Konsultasi}")
            .unVolTindakan.SetUnboundFieldSource ("{ado.VolTindakan}")
            .ucTindakan.SetUnboundFieldSource ("{ado.Tindakan}")
            .unVolSewaAlat.SetUnboundFieldSource ("{ado.VolSewaAlat}")
            .ucSewaAlat.SetUnboundFieldSource ("{ado.SewaAlat}")
            .ucDiskon.SetUnboundFieldSource ("{ado.hargadiscount}")
            .txtPeriode.SetText "Periode : " & Format(tglAwal, "dd-MM-yyyy") & "  s/d  " & Format(tglAkhir, "dd-MM-yyyy")

            If idDepartemen <> "" Then
                If idDepartemen = 16 Then
                    .TxtJudul.SetText "RINCIAN PENDAPATAN HARIAN PER KELAS RAWAT INAP"
                ElseIf idDepartemen = 18 Then
                    .TxtJudul.SetText "RINCIAN PENDAPATAN HARIAN PER KELAS RAWAT JALAN"
                End If
            Else
                .TxtJudul.SetText "RINCIAN PENDAPATAN HARIAN PER KELAS"
            End If
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPedapatan")
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
