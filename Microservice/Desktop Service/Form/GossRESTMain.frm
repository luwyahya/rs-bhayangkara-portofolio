VERSION 5.00
Begin VB.Form GossRESTMain 
   BackColor       =   &H00FFFFFF&
   BorderStyle     =   3  'Fixed Dialog
   Caption         =   "Desktop Service"
   ClientHeight    =   645
   ClientLeft      =   45
   ClientTop       =   690
   ClientWidth     =   4560
   ControlBox      =   0   'False
   Icon            =   "GossRESTMain.frx":0000
   LinkTopic       =   "GossRESTMain"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   OLEDropMode     =   1  'Manual
   ScaleHeight     =   645
   ScaleWidth      =   4560
   ShowInTaskbar   =   0   'False
   StartUpPosition =   2  'CenterScreen
   Begin DesktopService.Gossamer Gossamer1 
      Left            =   720
      Top             =   120
      _ExtentX        =   741
      _ExtentY        =   741
      VDir            =   "VDir"
   End
   Begin VB.Image Image1 
      Height          =   600
      Left            =   2640
      Picture         =   "GossRESTMain.frx":0CCA
      Top             =   0
      Width           =   1875
   End
   Begin VB.Label Label2 
      Caption         =   "."
      Height          =   375
      Left            =   3480
      TabIndex        =   1
      Top             =   -120
      Width           =   375
   End
   Begin VB.Label Label1 
      BackStyle       =   0  'Transparent
      Caption         =   "@Epic"
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   9.75
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   0
      OLEDropMode     =   1  'Manual
      TabIndex        =   0
      Top             =   360
      Width           =   855
   End
   Begin VB.Menu mnFile 
      Caption         =   "File"
      Begin VB.Menu mnuSettingPrinter 
         Caption         =   "Printer"
      End
      Begin VB.Menu mnuKoneksi 
         Caption         =   "Koneksi"
      End
      Begin VB.Menu fgdgdfg 
         Caption         =   "Version 20171116.1"
      End
      Begin VB.Menu asdasdasdsa 
         Caption         =   "-"
      End
      Begin VB.Menu mnuExit 
         Caption         =   "Exit"
      End
   End
End
Attribute VB_Name = "GossRESTMain"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit

'Initialized during Form_Load via SanitizeInit, used during Sanitize:

Private Const FROM_CHARS As String = "[]\[\]\'\;\%\_\#"
Private Const TO_CHARS As String = "[[]]\[[]\[]]\['']\\[%]\[_]\[#]"
Private FromChars() As String
Private ToChars() As String

Dim nid As NOTIFYICONDATA ' deklarasi variable

Public STM As ADODB.Stream
Private LogFile As Integer
Private graphicSDKVersion   As String
Private prnSDKVersion       As String
Public urlLengkap As String
Dim fso As New FileSystemObject


Private Sub SanitizeInit()
    FromChars = Split(FROM_CHARS, "\")
    ToChars = Split(TO_CHARS, "\")
End Sub

Private Function Sanitize(ByVal Arg As String) As String
    'Attempt to "sanitize" argument Arg against SQL Injection errors.
    Dim i As Long
    
    For i = 0 To UBound(FromChars)
        Arg = Replace$(Arg, FromChars(i), ToChars(i))
    Next
    Sanitize = Arg
End Function


 
Private Sub TerminateProcess(app_exe As String)
    Dim Process As Object
    For Each Process In GetObject("winmgmts:").ExecQuery("Select Name from Win32_Process Where Name = '" & app_exe & "'")
        Process.Terminate
    Next
End Sub

Private Sub Form_DblClick()
Call minimize_to_tray
End Sub

Private Sub Form_Initialize()
On Error Resume Next
Dim msg As String
    
    fgdgdfg.Caption = App.Comments
    

'    TerminateProcess ("Desktop ServiceC.exe")
'    TerminateProcess ("Desktop ServiceD.exe")
'    TerminateProcess ("Desktop ServiceE.exe")
    
    GossRESTDB.InitializeDB
    GetGraphicsDllVersion graphicSDKVersion
    
    If graphicSDKVersion <> "" Then
        msg = "Graphics: " & graphicSDKVersion & "; "
    End If
        
    ' Gets printer dll version
    '     and if present enables the magnetic encoding frame
    
    GetPrinterDllVersion prnSDKVersion

    If prnSDKVersion <> "" Then
        msg = msg & "Printer: " & prnSDKVersion & "; "
    End If
    
    ' Displays dll versions
     Label2.ToolTipText = msg
    
End Sub

Private Sub Form_Load()
'    Call openConnection
    serverBackEnd = GetTxt("Setting.ini", "Koneksi", "f")
    Label1.ToolTipText = StatusCN
    SanitizeInit
'    Set CN = New ADODB.Connection
'    CN.Open GossRESTDB.ConnectionString
'    Set RS = New ADODB.Recordset
'    'Set up as a high-performance server-side cursor with the ability to
'    'be data-bound to an MSHFlexGrid:
'    With RS
'        .CursorLocation = adUseServer
'        .CursorType = adOpenKeyset
'        .LockType = adLockReadOnly
'        .ActiveConnection = CN
'        .Properties("IRowsetIdentity") = True
'    End With
    Set STM = New ADODB.Stream
    
    LogFile = FreeFile(0)
    
    Open UCase(fso.GetDriveName(App.Path)) & "/log.txt" For Append As #LogFile
    Gossamer1.StartListening
    
'    Show
    WindowState = vbHide
    Call minimize_to_tray
    If cn.State = adStateOpen Then cn.Close
End Sub

Private Sub Form_Unload(Cancel As Integer)
    Gossamer1.StopListening
    
    Close #LogFile
    'To Tray
    Shell_NotifyIcon NIM_DELETE, nid
    If cn.State = adStateOpen Then cn.Close
End Sub
Private Sub Form_MouseMove(Button As Integer, Shift As Integer, x As Single, Y As Single)
    Dim msg As Long
    Dim sFilter As String
    
    msg = x / Screen.TwipsPerPixelX
    Select Case msg
        Case WM_LBUTTONDOWN
            Me.Show ' tampilkan form
            Shell_NotifyIcon NIM_DELETE, nid
        Case WM_LBUTTONUP
        
        Case WM_LBUTTONDBLCLK
        
        Case WM_RBUTTONDOWN
        
        Case WM_RBUTTONUP
'            Me.Show
'            Shell_NotifyIcon NIM_DELETE, nid
            PopupMenu mnFile
        Case WM_RBUTTONDBLCLK
    End Select
End Sub

Sub minimize_to_tray()
    Me.Hide
    nid.cbSize = Len(nid)
    nid.hwnd = Me.hwnd
    nid.uId = vbNull
    nid.uFlags = NIF_ICON Or NIF_TIP Or NIF_MESSAGE
    nid.uCallBackMessage = WM_MOUSEMOVE
    nid.hIcon = Me.Icon
    nid.szTip = "RS UNIV ANDALAS" & vbNullChar
    Shell_NotifyIcon NIM_ADD, nid
End Sub

Private Sub Gossamer1_DynamicRequest( _
    ByVal Method As String, _
    ByVal URI As String, _
    ByVal Params As String, _
    ByVal ReqHeaders As Collection, _
    ByRef RespStatus As Single, _
    ByRef RespStatusText As String, _
    ByRef RespMIME As String, _
    ByRef RespExtraHeaders As String, _
    ByRef RespBody() As Byte, _
    ByVal ClientIndex As Integer)
    On Error Resume Next
    
    Dim ErrNumber As Long
    Dim ErrDescription As String
    
    If Method = "GET" Then
        'We'll assume URI = "/query" but we'll take any as "/query" in this program.
        On Error Resume Next

        Dim Itm As Variant
        For Each Itm In ReqHeaders
            Debug.Print Itm(0), Itm(1)
        Next Itm
        urlLengkap = URI
        If URI = "\printvb\query" Then RespBody = Query(Gossamer1.URLDecode(Params))
        If URI = "\printvb\cetak-antrian" Then RespBody = frmCetakAntrian.CetakAntrian(Gossamer1.URLDecode(Params))
        If URI = "\printvb\kasir" Then RespBody = frmKasir.kasir(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\tata-rekening" Then RespBody = frmTataRekening.TataRekening(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\Pendaftaran" Then RespBody = frmPendaftaran.Pendaftaran(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\farmasiApotik" Then RespBody = frmFarmasiApotik.farmasiApotik(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\laporanPelayanan" Then RespBody = frmLaporanPelayanan.laporanPelayanan(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\formvb\rawat-jalan" Then RespBody = frmRajal.RawatJalan(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\farmasi" Then RespBody = FormFarmasi.Farmasi(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\Piutang" Then RespBody = frmPiutang.Piutang(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\akuntansi" Then RespBody = frmAkuntansi.akuntansi(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\logistik" Then RespBody = frmLogistik.Logistik(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\simakbmn" Then RespBody = frmSimakBmn.Fungsi(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\rekammedis" Then RespBody = frmRekamMedis.Fungsi(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\sdm" Then RespBody = frmSdm.Fungsi(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\cetak-antrian-online" Then RespBody = frmCetakAntrian.CetakAntrianOnline(Gossamer1.URLDecode(Params))
        If URI = "\printvb\jenazah" Then RespBody = frmJenazah.Fungsi(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\remun" Then RespBody = frmRemun.Remun(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\gizi" Then RespBody = frmGizi.gizi(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\e-rekammedis" Then RespBody = frmRekamMedisElektronik.Fungsi(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\bridging" Then RespBody = frmBridging.Fungsi(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\pmkp" Then RespBody = frmPmkp.pmkp(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\ipsrs" Then RespBody = frmIpsrs.Ipsrs(Gossamer1.URLDecode(Params)) 'XX
       
'        If Err Then
'            ErrNumber = Err.Number
'            ErrDescription = Err.Description
'            On Error GoTo 0
'            RespStatus = 500
'            RespStatusText = "Internal Server Error"
'            Print #LogFile, _
'                  "Error "; _
'                  CStr(ErrNumber); _
'                  " (&H"; Right$("0000000" & Hex$(ErrNumber), 8); ") "; _
'                  ErrDescription
'            Exit Sub
'        End If
'        On Error GoTo 0
        RespStatus = 200
        RespStatusText = "ok"
        RespMIME = "application/json" '; charset=utf-8"
        RespExtraHeaders = "Allow: GET" & vbCrLf
        'RespExtraHeaders = "Host: 172.16.16.14:8200"
    Else
        RespStatus = 405
        RespStatusText = "Method Not Allowed"
        RespExtraHeaders = "Allow: GET" & vbCrLf
        
    End If
End Sub

Private Sub Gossamer1_LogEvent(ByVal GossEvent As GossEvent, ByVal ClientIndex As Integer)
    With GossEvent
        Print #LogFile, _
              Format$(.Timestamp, "YYYY-MM-DD HH:NN:SS, "); _
              CStr(ClientIndex); ", "; _
              ", "; _
              CStr(.EventType); ", "; _
              CStr(.EventSubtype); ", "; _
              .Method; ", "; _
              .IP + ":1237" + Replace(urlLengkap, "\", "/") + .Text
    End With
End Sub
Private Function Query(ByVal QueryText As String) As Byte()
'    Const QUERY_TEMPLATE As String = _
'            "SELECT * FROM [Movies] " _
'          & "WHERE " _
'          & "[Title] = '$1$' OR " _
'          & "[Title] LIKE '$1$[ ,.:?]%' OR " _
'          & "[Title] LIKE '%[ ,.:?]$1$' OR " _
'          & "[Title] LIKE '%[ ,.:?]$1$[ ,.:?]%' OR " _
'          & "[Initials1] = '$2$' OR " _
'          & "[Initials2] = '$2$' " _
'          & "ORDER BY [Title] ASC"
'    Dim ActualQuery As String
    Dim Root As JNode
'    Dim RecordIndex As Long
'    Dim FieldIndex As Long
    
'    If Len(QueryText) = 0 Then
'        'Shouldn't match anything, just get an empty Recordset so
'        'we have the field names for headings:
'        ActualQuery = Replace$(Replace$(QUERY_TEMPLATE, _
'                                        "$2$", _
'                                        vbFormFeed), _
'                               "$1$", _
'                               vbFormFeed)
'    Else
'        ActualQuery = Replace$(Replace$(QUERY_TEMPLATE, _
'                                        "$2$", _
'                                        GossRESTDB.AsInitials(QueryText)), _
'                               "$1$", _
'                               Sanitize(QueryText))
'    End If
'    Debug.Print ActualQuery
'    With RS
'        .Open ActualQuery, , , , adCmdText
'        Set Root = New JNode
'        Root("Perusahaan") = "Jasamedika"
'        Set Root("Pegawai") = New JNode
'        Root("Pegawai")(0) = "Riko"
'        Root("Pegawai")(1) = "Agus"
'        For FieldIndex = 0 To .Fields.Count - 1
'            Root("ColumnNames")(FieldIndex) = .Fields(FieldIndex).Name
'        Next
'        If RS.RecordCount > 0 Then
'            Set Root("Rows") = New JNode
'            Root("Rows").MakeArray
'            Do Until .EOF
'                Set Root("Rows")(RecordIndex) = New JNode
'                Root("Rows")(RecordIndex).MakeArray
'                For FieldIndex = 0 To .Fields.Count - 1
'                    Root("Rows")(RecordIndex).Value(FieldIndex) = .Fields(FieldIndex).Value
'                Next
'                .MoveNext
'                RecordIndex = RecordIndex + 1
'            Loop
'        End If
'        .Close
'    End With

If Len(QueryText) > 0 Then
    
    If QueryText = "cetak" Then
        Set Root = New JNode
        'MsgBox "adasdasd", vbInformation, "CETAK SERVICE"
        Root("Status") = "Sukses Dicetak"
'        Set Root("Pegawai") = New JNode
'        Root("Pegawai")(0) = "Riko"
'        Root("Pegawai")(1) = "Agus"
    Else
        Set Root = New JNode
        Root("Status") = "Error"
    End If
End If
    With STM
        .Open
        .Type = adTypeText
        .CharSet = "utf-8"
        .WriteText Root.JSON, adWriteChar
        .Position = 0
        .Type = adTypeBinary
        Query = .Read(adReadAll)
        .Close
    End With
End Function

Private Sub Image1_DblClick()
Call minimize_to_tray
End Sub

Private Sub Label1_Click()
    Call minimize_to_tray
End Sub

Private Sub mnuExit_Click()
    Shell_NotifyIcon NIM_DELETE, nid
    End
End Sub

Private Sub mnuKoneksi_Click()
    frmSettingKoneksi.Show vbModal
End Sub

Private Sub mnuSettingPrinter_Click()
    frmSettingPrinter.Show vbModal
End Sub

'    Public LogFile As Integer
'    LogFile = FreeFile(0)
'
'    Open "E:/txt.txt" For Append As #LogFile
'  sql
'    For i = 0 To 100
'        Print #LogFile, "|" & "024040400415582003KD" & "|,|" & "AS@EPIC" & "|,|" & i & " neng ecie|;"
'    Next
'  sql

Private Sub Picture1_Click()

End Sub
