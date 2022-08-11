VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRLaporanffsIGD 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmLaporanffsIGD.frx":0000
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
Attribute VB_Name = "frmCRLaporanffsIGD"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crLaporanffsIGD
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

    Set frmCRLaporanffsIGD = Nothing
End Sub

Public Sub CetakLaporan(jmlCetak As String, tglAwal As String, tglAkhir As String, PrinteDBY As String, idDokter As String, tglLibur As String, kdRuangan As String, kpid As String)
On Error GoTo errLoad
'On Error Resume Next

Set frmCRLaporanffsIGD = Nothing
Dim adocmd As New ADODB.Command

    Dim str1 As String
    Dim str2 As String
    
    Dim diff As Integer
    
    diff = DateDiff("d", tglAwal, tglAkhir)
    Dim strTgl As String
    Dim strTglJamSQL As String
    Dim strTglJamSQLLibur As String
    Dim i As Integer
    Dim SQLdate As String
    Dim SQLdateLibur As String
    
    For i = 0 To diff
        strTgl = Format(DateAdd("d", i, tglAwal), "yyyy-MM-dd")
        If Weekday(strTgl, vbSunday) = 1 Or Weekday(strTgl, vbSunday) = 7 Then
            strTglJamSQL = " or tglregistrasi between '" & strTgl & " 00:00' and '" & strTgl & " 23:59'"
        ElseIf Weekday(strTgl, vbSunday) = 6 Then
            strTglJamSQL = " or tglregistrasi between '" & strTgl & " 00:00' and '" & strTgl & " 06:59' or " & _
                           "tglregistrasi between '" & strTgl & " 16:00' and '" & strTgl & " 23:59'"
        Else
            strTglJamSQL = " or tglregistrasi between '" & strTgl & " 00:00' and '" & strTgl & " 06:59' or " & _
                           "tglregistrasi between '" & strTgl & " 15:30' and '" & strTgl & " 23:59'"
        End If
        SQLdate = SQLdate & strTglJamSQL
    Next
    
    If tglLibur <> "" Then
        Dim strarr() As String
        strarr = Split(tglLibur, ",")
        For i = 0 To UBound(strarr)
           strTglJamSQL = " or tglregistrasi between '" & Format(tglAwal, "yyyy-MM-" & strarr(i)) & " 00:00' and '" & Format(tglAwal, "yyyy-MM-" & strarr(i)) & " 23:59'"
           strTglJamSQLLibur = " or tglregistrasi between '" & Format(tglAwal, "yyyy-MM-" & strarr(i)) & " 00:00' and '" & Format(tglAwal, "yyyy-MM-" & strarr(i)) & " 23:59'"
            SQLdate = SQLdate & strTglJamSQL
            SQLdateLibur = SQLdateLibur & strTglJamSQLLibur
        Next
        SQLdateLibur = " case when " & Right(SQLdateLibur, Len(SQLdateLibur) - 3) & " then 'OT/Libur' else "
        Dim STREND As String
        STREND = " end "
    End If
    
        SQLdate = Right(SQLdate, Len(SQLdate) - 3)
    
    Dim dokter As String
    If idDokter <> "" Then
        dokter = " and pg.id = '" & idDokter & "'"
    End If
    Dim idRuangan As String
    If kdRuangan <> "" Then
        idRuangan = " and ru.id = '" & kdRuangan & "'"
    End If
    Dim idKelompokPasien As String
    If kpid <> "" Then
        If kpid = "153" Then
            idKelompokPasien = " and pd.objectkelompokpasienlastfk in (1,5,3)"
        Else
            idKelompokPasien = " and pd.objectkelompokpasienlastfk = '" & kpid & "'"
        End If
    End If
    
Set Report = New crLaporanffsIGD
    strSQL = "select *, " & SQLdateLibur & "  case when hari='Saturday ' then 'Sabtu' when hari='Sunday   ' then 'Minggu' when hari='Monday   ' then 'Senin' when hari='Tuesday  ' then 'Selasa' when hari='Wednesday' then 'Rabu' when hari='Thursday ' then 'Kamis' when hari='Friday   ' then 'Jumat' " & STREND & "  end as harihari from ( " & _
            "select to_char(pd.tglregistrasi,'Day') as hari,pd.tglregistrasi,pd.noregistrasi,ru.namaruangan,ps.nocm,upper(ps.namapasien) as namapasien, " & _
            "ppd.tglpelayanan, pr.namaproduk,pg.namalengkap,pd.objectkelompokpasienlastfk as kpid, " & _
            "((ppd.hargajual-case when ppd.hargadiscount is null then 0 else ppd.hargadiscount end )* pp.jumlah) as total2,30000 as total,0 as remun " & _
            "from pasiendaftar_t as pd " & _
            "left join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec " & _
            "left join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec " & _
            "left join pelayananpasiendetail_t as ppd on ppd.pelayananpasien=pp.norec " & _
            "left join pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=pp.norec " & _
            "left join pasien_m as ps on ps.id=pd.nocmfk " & _
            "left join produk_m as pr on pr.id=ppd.produkfk " & _
            "left join pegawai_m as pg on pg.id=ppp.objectpegawaifk " & _
            "left join ruangan_m as ru on ru.id=apd.objectruanganfk " & _
            "Where ppd.komponenhargafk = 35 and objectjenispetugaspefk = 4 and pr.id=400 and ru.objectdepartemenfk=24  " & dokter & idRuangan & idKelompokPasien & "" & _
            "order by pd.tglregistrasi) as x where  " & SQLdate

'
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtNamaKasir.SetText PrinteDBY
            .txtVer.SetText App.Comments
            
            .txtPeriode.SetText "Periode : " & Format(tglAwal, "yyyy MMM dd") & " s/d " & Format(tglAkhir, "yyyy MMM dd") & "  "
            .usHari.SetUnboundFieldSource ("{ado.harihari}")
            .usTgl.SetUnboundFieldSource ("{ado.tglregistrasi}")
'            .UnboundDateTime1.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .utJam.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .usLayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .usUnitLayanan.SetUnboundFieldSource ("{ado.namaruangan}")
            .usNoReg.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNoMR.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .ucJasaMedis.SetUnboundFieldSource ("{ado.total}")
            .usNamaDokter.SetUnboundFieldSource ("{ado.namalengkap}")
            
'            If view = "false" Then
'                Dim strPrinter As String
''
'                strPrinter = GetTxt("Setting.ini", "Printer", "LaporanPenerimaan")
'                .SelectPrinter "winspool", strPrinter, "Ne00:"
'                .PrintOut False
'                Unload Me
'            Else
                With CRViewer1
                    .ReportSource = Report
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
'            End If
        'End If
    End With
Exit Sub
errLoad:
End Sub
