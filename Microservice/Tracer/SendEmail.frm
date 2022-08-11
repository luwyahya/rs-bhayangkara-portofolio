VERSION 5.00
Object = "{248DD890-BB45-11CF-9ABC-0080C7E7B78D}#1.0#0"; "mswinsck.ocx"
Begin VB.Form SendEmail 
   Caption         =   "Service Tracer"
   ClientHeight    =   660
   ClientLeft      =   120
   ClientTop       =   450
   ClientWidth     =   7515
   Icon            =   "SendEmail.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   660
   ScaleWidth      =   7515
   StartUpPosition =   3  'Windows Default
   Begin MSWinsockLib.Winsock Winsock1 
      Left            =   600
      Top             =   120
      _ExtentX        =   741
      _ExtentY        =   741
      _Version        =   393216
   End
   Begin VB.ComboBox cbPrinterBlangko 
      Height          =   315
      Left            =   1320
      TabIndex        =   3
      Text            =   "Combo1"
      Top             =   960
      Visible         =   0   'False
      Width           =   4215
   End
   Begin VB.CommandButton cmdSaveReg 
      Caption         =   "&Simpan"
      Height          =   375
      Left            =   5640
      TabIndex        =   2
      Top             =   120
      Width           =   1575
   End
   Begin VB.ComboBox cbPrinterBarcode 
      Height          =   315
      Left            =   1320
      TabIndex        =   0
      Text            =   "Combo1"
      Top             =   165
      Width           =   4215
   End
   Begin VB.Timer Timer2 
      Interval        =   50000
      Left            =   4200
      Top             =   120
   End
   Begin VB.Timer Timer1 
      Interval        =   5000
      Left            =   3120
      Top             =   0
   End
   Begin VB.Label Label3 
      BackStyle       =   0  'Transparent
      Caption         =   "V-02-11-2021"
      Height          =   255
      Left            =   120
      TabIndex        =   5
      Top             =   360
      Width           =   975
   End
   Begin VB.Label Label2 
      Appearance      =   0  'Flat
      AutoSize        =   -1  'True
      BackColor       =   &H80000000&
      BackStyle       =   0  'Transparent
      Caption         =   "Printer Blangko"
      ForeColor       =   &H80000008&
      Height          =   195
      Left            =   240
      TabIndex        =   4
      Top             =   960
      Visible         =   0   'False
      Width           =   1080
   End
   Begin VB.Label Label1 
      Appearance      =   0  'Flat
      AutoSize        =   -1  'True
      BackColor       =   &H80000000&
      BackStyle       =   0  'Transparent
      Caption         =   "Printer Tracer"
      ForeColor       =   &H80000008&
      Height          =   195
      Left            =   240
      TabIndex        =   1
      Top             =   120
      Width           =   960
   End
End
Attribute VB_Name = "SendEmail"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Public strNoPendaftaran As String
Dim a As String
Dim b As String


Private Sub cmdSaveReg_Click()
    On Error GoTo errorLanjut
    mstrServerPrinterBarcode = cbPrinterBarcode.Text
    mstrServerPrinterBarcode2 = cbPrinterBlangko.Text
'    Call CreateKey("HKEY_CURRENT_USER\Software\Medifirst2000")
    Call CreateKey("HKEY_CURRENT_USER\Software\Medifirst2000\Tracer")
    Call CreateKey("HKEY_CURRENT_USER\Software\Medifirst2000\Blangko")
    Call SetStringValue("HKEY_CURRENT_USER\Software\Medifirst2000\Tracer", "Tracer", mstrServerPrinterBarcode)
    Call SetStringValue("HKEY_CURRENT_USER\Software\Medifirst2000\Blangko", "Blangko", mstrServerPrinterBarcode2)
    
    MsgBox "Penyimpanan Berhasil", vbOKOnly
'    WriteIniValue "C:\SettingPrinter.ini", "Default Printer", "PrinterBarcode", mstrServerPrinterBarcode
'    Unload Me
    Screen.MousePointer = vbDefault
    Exit Sub
errorLanjut:
End Sub

Private Sub Form_Load()
    strNamaHostLocal = Winsock1.LocalHostName
    Call openConnection
    
    'Call inisialisasiObjekContext
    For Each prn In Printers
        cbPrinterBarcode.AddItem prn.DeviceName
        cbPrinterBlangko.AddItem prn.DeviceName
    Next
    Call cmdLoadReg_Click

End Sub
Private Sub cmdLoadReg_Click()
    mstrServerPrinterBarcode = GetStringValue("HKEY_CURRENT_USER\Software\Medifirst2000\Tracer", "Tracer")
    mstrServerPrinterBarcode2 = GetStringValue("HKEY_CURRENT_USER\Software\Medifirst2000\Blangko", "Blangko")
'    mstrServerPrinterBarcode = ReadINI("Default Printer", "PrinterBarcode", "", "C:\SettingPrinter.ini")
    cbPrinterBarcode.Text = mstrServerPrinterBarcode
    cbPrinterBlangko.Text = mstrServerPrinterBarcode2
End Sub



'Function SendEmail()
'Dim oSmtp As New EASendMailObjLib.Mail
'Dim email As String
'
''    a = "Laporan Pasien Soekardjo Akan Melebihi Estimasi Tanggungan BPJS"
''    b = "Pasien Atas Nama Soekardjo akan melebihi estimasi Tanggungan BPJS"
'
'    strSQL10 = "Select Email From DataPegawaiEmail Where IdPegawai ='" & rs4("IdPegawai").value & "'"
'    Call eksekusiQuery(rs10, strSQL10)
'    If rs10.RecordCount > 0 Then
'        email = rs10("Email")
'    Else
'        Exit Function
'    End If
'    oSmtp.LicenseCode = "TryIt"
'
'    ' Set acount email
'    oSmtp.FromAddr = "tukangkomputer664@gmail.com"
'
'    ' Add email tujuan
'    oSmtp.AddRecipientEx email, 0
''    oSmtp.AddRecipientEx "jhorlin_sitinjak@yahoo.com", 0
'
'
'    ' Set email subject
'    oSmtp.Subject = a
'
'    ' Set email body
'    oSmtp.BodyText = b
'
'    ' Gmail SMTP server address
'    oSmtp.ServerAddr = "smtp.gmail.com" ' Untuk Gmail
'
'
'
'    oSmtp.ServerPort = 587
'
'    oSmtp.SSL_init
'
'    oSmtp.UserName = "tukangkomputer664@gmail.com"
'    oSmtp.Password = "arnesgesta"
'
''    MsgBox "start to send email ..."
'
'    If oSmtp.SendMail() = 0 Then
''        MsgBox "email was sent successfully!"
''    Else
''        MsgBox "failed to send email with the following error:" & oSmtp.GetLastErrDescription()
'    End If
'End Function
'Function SendEmailAll()
'Dim oSmtp As New EASendMailObjLib.Mail
'
'
''    a = "Laporan Pasien Soekardjo Akan Melebihi Estimasi Tanggungan BPJS"
''    b = "Pasien Atas Nama Soekardjo akan melebihi estimasi Tanggungan BPJS"
'
'    oSmtp.LicenseCode = "TryIt"
'
'    ' Set acount email
'    oSmtp.FromAddr = "tukangkomputer664@gmail.com"
'
'    ' Add email tujuan
'    oSmtp.AddRecipientEx "apepyosa@gmail.com", 0
''    oSmtp.AddRecipientEx "jhorlin_sitinjak@yahoo.com", 0
'
'
'    ' Set email subject
'    oSmtp.Subject = a
'
'    ' Set email body
'    oSmtp.BodyText = b
'
'    ' Gmail SMTP server address
'    oSmtp.ServerAddr = "smtp.gmail.com" ' Untuk Gmail
'
'
'
'    oSmtp.ServerPort = 587
'
'    oSmtp.SSL_init
'
'    oSmtp.UserName = "tukangkomputer664@gmail.com"
'    oSmtp.Password = "arnesgesta"
'
''    MsgBox "start to send email ..."
'
'    If oSmtp.SendMail() = 0 Then
''        MsgBox "email was sent successfully!"
''    Else
''        MsgBox "failed to send email with the following error:" & oSmtp.GetLastErrDescription()
'    End If
'End Function
'
'Private Sub Timer2_Timer()
''Dim jamOn As String
''jamOn = 4
''If jamOn = Format(Now, "hh") Then
''    Timer1.Enabled = True
''End If
'End Sub
Private Sub Timer1_Timer()
On Error GoTo errLoad
    MousePointer = vbHourglass
    Dim i As Integer
    Dim jam As String
    
'    jam = "08"
'    strSQL2 = "SELECT a.noregistrasi, ruangan_m.objectdepartemenfk,a.nocmfk,ruangan_m.namaruangan " & _
'                " FROM pasiendaftar_t AS a INNER JOIN ruangan_m ON a.objectruanganlastfk = ruangan_m.id " & _
'                " WHERE (a.statuspasien='Lama' or a.statuspasien='') and (CAST(a.tglregistrasi AS date) = CAST(Now() AS date)) AND (a.noregistrasi not IN" & _
'                " (SELECT        noregistrasi From Tracer_t WHERE (noregistrasi = a.noregistrasi))) AND (ruangan_m.objectdepartemenfk in ('18','28'))" & _
'                " ORDER BY a.tglregistrasi DESC"
'    Call msubRecFO(rs1, strSQL2)
'    If rs1.EOF = False Then
'        For i = 1 To rs1.RecordCount
'        strSQL10 = "select nocmfk from pasiendaftar_t inner join ruangan_m on pasiendaftar_t.objectruanganlastfk = ruangan_m.id " & _
'                  " where nocmfk='" & rs1(2).value & "' and ruangan_m.objectdepartemenfk in ('18','28')"
'        Call msubRecFO(rs10, strSQL10)
'        If rs10.RecordCount > 1 Then
'            mstrNoPen = rs1(0).value
'            frm_cetak_label_viewer1.Cetaklangsung
'        Else
'            mstrNoPen = rs1(2).value
'            ruangan = rs1(3).value
'            frm_cetak_label_viewer2.Cetaklangsung
'        End If
'        cn.Execute "insert into tracer_t values ('" & rs1(0).value & "')"
'        rs1.MoveNext
'        Next i
'    End If
    'lama rj'
    strSQL2 = "SELECT a.noregistrasi, ruangan_m.objectdepartemenfk " & _
                " FROM pasiendaftar_t AS a INNER JOIN ruangan_m ON a.objectruanganlastfk = ruangan_m.id " & _
                " WHERE a.statusenabled='true' and (a.statuspasien='LAMA' or a.statuspasien='' or statuspasien is null) and (CAST(a.tglregistrasi AS date) = CAST(Now() AS date)) AND (a.noregistrasi not IN" & _
                " (SELECT        noregistrasi From Tracer_t WHERE (noregistrasi = a.noregistrasi))) AND (ruangan_m.objectdepartemenfk in ('18','28','73','74','75')) and (ruangan_m.id not in ('599','597','609','610','322','251','545','544'))" & _
                " ORDER BY a.tglregistrasi DESC"
                 ReadRs strSQL2
'    Call msubRecFO(rs1, strSQL2)
    If rs.EOF = False Then
        For i = 1 To rs.RecordCount
        mstrNoPen = rs(0).value
        
        frm_cetak_label_viewer1.Cetaklangsung
'        frm_cetak_label_viewer1.Cetaklangsung
        cn.Execute "insert into tracer_t values ('" & rs(0).value & "')"
        rs.MoveNext
        Next i
    End If
    'lama igd'
'    strSQL2 = "SELECT a.noregistrasi, ruangan_m.objectdepartemenfk " & _
'                " FROM pasiendaftar_t AS a INNER JOIN ruangan_m ON a.objectruanganlastfk = ruangan_m.id " & _
'                " WHERE DATEPART(hh,a.tglregistrasi) > 7 and DATEPART(hh,a.tglregistrasi) <21  and (a.statuspasien='Lama' or a.statuspasien='' or statuspasien is null) and (CAST(a.tglregistrasi AS date) = CAST(Now() AS date)) AND (a.noregistrasi not IN" & _
'                " (SELECT        noregistrasi From Tracer_t WHERE (noregistrasi = a.noregistrasi))) AND (ruangan_m.objectdepartemenfk in ('24')) " & _
'                " ORDER BY a.tglregistrasi DESC"
'    Call msubRecFO(rs1, strSQL2)
'    If rs1.EOF = False Then
'        For i = 1 To rs1.RecordCount
'        mstrNoPen = rs1(0).value
'
'        frm_cetak_label_viewer1.Cetaklangsung
'        frm_cetak_label_viewer1.Cetaklangsung
'        cn.Execute "insert into tracer_t values ('" & rs1(0).value & "')"
'        rs1.MoveNext
'        Next i
'    End If
'
'    'baru igd'
'    strSQL2 = "SELECT a.noregistrasi, ruangan_m.objectdepartemenfk ,pasien_m.id, pasien_m.nocm,ruangan_m.namaruangan" & _
'                " FROM pasiendaftar_t AS a INNER JOIN ruangan_m ON a.objectruanganlastfk = ruangan_m.id INNER JOIN  pasien_m ON a.nocmfk = pasien_m.id " & _
'                " WHERE DATEPART(hh,a.tglregistrasi) > 7 and DATEPART(hh,a.tglregistrasi) <21  and  a.statuspasien='Baru' and (CAST(a.tglregistrasi AS date) = CAST(Now() AS date)) AND (a.noregistrasi not IN" & _
'                " (SELECT        noregistrasi From Tracer_t WHERE (noregistrasi = a.noregistrasi))) AND (ruangan_m.objectdepartemenfk in ('24')) " & _
'                " ORDER BY a.tglregistrasi DESC"
'    Call msubRecFO(rs2, strSQL2)
'    If rs2.EOF = False Then
'        For i = 1 To rs2.RecordCount
'            'mstrNoPen = rs2(2).value
'             mstrNoPen = rs2(0).value
'            ruangan = rs2(4).value
'            frm_cetak_label_viewer1.Cetaklangsung
'            frm_cetak_label_viewer1.Cetaklangsung
'            cn.Execute "insert into tracer_t values ('" & rs2(0).value & "')"
'            rs2.MoveNext
'        Next i
'    End If
    'baru rj'
    strSQL2 = "SELECT a.noregistrasi, ruangan_m.objectdepartemenfk ,pasien_m.id, pasien_m.nocm,ruangan_m.namaruangan" & _
                " FROM pasiendaftar_t AS a INNER JOIN ruangan_m ON a.objectruanganlastfk = ruangan_m.id INNER JOIN  pasien_m ON a.nocmfk = pasien_m.id " & _
                " WHERE a.statusenabled='true' and a.statuspasien='BARU' and (CAST(a.tglregistrasi AS date) = CAST(Now() AS date)) AND (a.noregistrasi not IN" & _
                " (SELECT        noregistrasi From Tracer_t WHERE (noregistrasi = a.noregistrasi))) AND (ruangan_m.objectdepartemenfk in ('18','28','73','74','75')) and (ruangan_m.id not in ('599','597','609','610','322','251','545','12','544'))" & _
                " ORDER BY a.tglregistrasi DESC"
    ReadRs strSQL2

    If rs.EOF = False Then
        For i = 1 To rs.RecordCount
            'mstrNoPen = rs2(2).value
             mstrNoPen = rs(0).value
            ruangan = rs(4).value
            frm_cetak_label_viewer1.Cetaklangsung
'            frm_cetak_label_viewer1.Cetaklangsung
            cn.Execute "insert into tracer_t values ('" & rs(0).value & "')"
            rs.MoveNext
        Next i
    End If
    
    strSQL2 = "SELECT batalregistrasi_t.norec, pasien_m.nocm, pasien_m.namapasien, ruangan_m.namaruangan" & _
            " FROM batalregistrasi_t INNER JOIN pasiendaftar_t ON batalregistrasi_t.pasiendaftarfk = pasiendaftar_t.norec INNER JOIN" & _
            " pasien_m ON pasiendaftar_t.nocmfk = pasien_m.id INNER JOIN" & _
            " ruangan_m ON pasiendaftar_t.objectruanganlastfk = ruangan_m.id WHERE ruangan_m.objectdepartemenfk in ('18','28','73','74','75') and (CAST(batalregistrasi_t.tanggalpembatalan AS date) = CAST(Now() AS date))" & _
            " and batalregistrasi_t.norec not in (SELECT noregistrasi From Tracer_t WHERE (noregistrasi = batalregistrasi_t.norec))"
    ReadRs strSQL2
    If rs.EOF = False Then
        For i = 1 To rs.RecordCount
            mstrNoPen = rs(0).value
            frm_cetak_label_viewer3.Cetaklangsung
            cn.Execute "insert into tracer_t values ('" & rs(0).value & "')"
            rs.MoveNext
        Next i
    End If

   MousePointer = vbDefault
Exit Sub
errLoad:
    Call pesanError
'    Resume 0
    MousePointer = vbDefault
End Sub

