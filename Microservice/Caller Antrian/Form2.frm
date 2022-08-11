VERSION 5.00
Object = "{248DD890-BB45-11CF-9ABC-0080C7E7B78D}#1.0#0"; "mswinsck.ocx"
Begin VB.Form Form2 
   BorderStyle     =   1  'Fixed Single
   Caption         =   "Panggil Antrian"
   ClientHeight    =   5895
   ClientLeft      =   45
   ClientTop       =   375
   ClientWidth     =   5190
   BeginProperty Font 
      Name            =   "Tahoma"
      Size            =   11.25
      Charset         =   0
      Weight          =   400
      Underline       =   0   'False
      Italic          =   0   'False
      Strikethrough   =   0   'False
   EndProperty
   Icon            =   "Form2.frx":0000
   LinkTopic       =   "Form2"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   5895
   ScaleWidth      =   5190
   StartUpPosition =   3  'Windows Default
   Begin VB.CheckBox Check1 
      Caption         =   "Always be On Top "
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   9
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      Height          =   270
      Left            =   0
      TabIndex        =   42
      Top             =   5640
      Width           =   3255
   End
   Begin VB.TextBox G4 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   3240
      TabIndex        =   41
      Text            =   "0"
      Top             =   5160
      Width           =   855
   End
   Begin VB.TextBox G2 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   1680
      TabIndex        =   40
      Text            =   "0"
      Top             =   5160
      Width           =   1575
   End
   Begin VB.TextBox G1 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   960
      TabIndex        =   39
      Text            =   "G"
      Top             =   5160
      Width           =   735
   End
   Begin VB.TextBox F4 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   3240
      TabIndex        =   38
      Text            =   "0"
      Top             =   4800
      Width           =   855
   End
   Begin VB.TextBox F2 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   1680
      TabIndex        =   37
      Text            =   "0"
      Top             =   4800
      Width           =   1575
   End
   Begin VB.TextBox F1 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   960
      TabIndex        =   36
      Text            =   "F"
      Top             =   4800
      Width           =   735
   End
   Begin VB.TextBox E1 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   960
      TabIndex        =   35
      Text            =   "E"
      Top             =   4440
      Width           =   735
   End
   Begin VB.TextBox E2 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   1680
      TabIndex        =   34
      Text            =   "0"
      Top             =   4440
      Width           =   1575
   End
   Begin VB.TextBox E4 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   3240
      TabIndex        =   33
      Text            =   "0"
      Top             =   4440
      Width           =   855
   End
   Begin VB.TextBox D4 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   3240
      TabIndex        =   32
      Text            =   "0"
      Top             =   4080
      Width           =   855
   End
   Begin VB.TextBox D2 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   1680
      TabIndex        =   31
      Text            =   "0"
      Top             =   4080
      Width           =   1575
   End
   Begin VB.TextBox D1 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   960
      TabIndex        =   30
      Text            =   "D"
      Top             =   4080
      Width           =   735
   End
   Begin VB.Timer Timer1 
      Interval        =   1000
      Left            =   4680
      Top             =   120
   End
   Begin VB.TextBox A3 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   7680
      TabIndex        =   29
      Text            =   "0"
      Top             =   3000
      Visible         =   0   'False
      Width           =   1335
   End
   Begin VB.TextBox B3 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   7680
      TabIndex        =   28
      Text            =   "0"
      Top             =   3360
      Visible         =   0   'False
      Width           =   1335
   End
   Begin VB.TextBox C3 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   7680
      TabIndex        =   27
      Text            =   "0"
      Top             =   3720
      Visible         =   0   'False
      Width           =   1335
   End
   Begin VB.TextBox Text9 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      BackColor       =   &H00404040&
      ForeColor       =   &H00FFFFFF&
      Height          =   390
      Left            =   7680
      Locked          =   -1  'True
      TabIndex        =   26
      Text            =   "Berikutnya"
      Top             =   2640
      Visible         =   0   'False
      Width           =   1335
   End
   Begin VB.TextBox Text16 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      BackColor       =   &H00404040&
      ForeColor       =   &H00FFFFFF&
      Height          =   390
      Left            =   3240
      Locked          =   -1  'True
      TabIndex        =   25
      Text            =   "Sisa"
      Top             =   2640
      Width           =   855
   End
   Begin VB.TextBox Text15 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      BackColor       =   &H00404040&
      ForeColor       =   &H00FFFFFF&
      Height          =   390
      Left            =   1680
      Locked          =   -1  'True
      TabIndex        =   24
      Text            =   "Sekarang"
      Top             =   2640
      Width           =   1575
   End
   Begin VB.TextBox Text14 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      BackColor       =   &H00404040&
      ForeColor       =   &H00FFFFFF&
      Height          =   390
      Left            =   960
      Locked          =   -1  'True
      TabIndex        =   23
      Text            =   "Jenis"
      Top             =   2640
      Width           =   735
   End
   Begin VB.TextBox C4 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   3240
      TabIndex        =   22
      Text            =   "0"
      Top             =   3720
      Width           =   855
   End
   Begin VB.TextBox C2 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   1680
      TabIndex        =   21
      Text            =   "0"
      Top             =   3720
      Width           =   1575
   End
   Begin VB.TextBox C1 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   960
      TabIndex        =   20
      Text            =   "C"
      Top             =   3720
      Width           =   735
   End
   Begin VB.TextBox B4 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   3240
      TabIndex        =   19
      Text            =   "0"
      Top             =   3360
      Width           =   855
   End
   Begin VB.TextBox B2 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   1680
      TabIndex        =   18
      Text            =   "0"
      Top             =   3360
      Width           =   1575
   End
   Begin VB.TextBox B1 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   960
      TabIndex        =   17
      Text            =   "B"
      Top             =   3360
      Width           =   735
   End
   Begin VB.TextBox A4 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   3240
      TabIndex        =   16
      Text            =   "0"
      Top             =   3000
      Width           =   855
   End
   Begin VB.TextBox A2 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   1680
      TabIndex        =   15
      Text            =   "0"
      Top             =   3000
      Width           =   1575
   End
   Begin VB.TextBox A1 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Height          =   390
      Left            =   960
      TabIndex        =   14
      Text            =   "A"
      Top             =   3000
      Width           =   735
   End
   Begin VB.Frame Frame1 
      Caption         =   "Info"
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   3375
      Left            =   0
      TabIndex        =   13
      Top             =   2280
      Width           =   5175
   End
   Begin VB.CommandButton Command3 
      Caption         =   ".."
      Height          =   270
      Left            =   4920
      TabIndex        =   12
      Top             =   1920
      Width           =   255
   End
   Begin VB.TextBox Text5 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   15.75
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   495
      Left            =   2520
      TabIndex        =   10
      Top             =   960
      Width           =   1935
   End
   Begin VB.TextBox Text4 
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   495
      Left            =   7200
      TabIndex        =   7
      Text            =   "172.16.16.14"
      Top             =   240
      Width           =   1215
   End
   Begin VB.TextBox Text3 
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   495
      Left            =   7200
      TabIndex        =   6
      Text            =   "2001"
      Top             =   840
      Width           =   1215
   End
   Begin MSWinsockLib.Winsock ws1 
      Left            =   7680
      Top             =   1920
      _ExtentX        =   741
      _ExtentY        =   741
      _Version        =   393216
   End
   Begin VB.TextBox Text2 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   15.75
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   495
      Left            =   960
      TabIndex        =   4
      Text            =   "A"
      Top             =   960
      Width           =   1215
   End
   Begin VB.TextBox Text1 
      Alignment       =   2  'Center
      Appearance      =   0  'Flat
      Enabled         =   0   'False
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   15.75
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   495
      Left            =   960
      TabIndex        =   2
      Text            =   "1"
      Top             =   360
      Width           =   1215
   End
   Begin VB.CommandButton Command2 
      Caption         =   "Panggil Ulang"
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   615
      Left            =   2520
      TabIndex        =   1
      Top             =   1560
      Width           =   1935
   End
   Begin VB.CommandButton Command1 
      Caption         =   "Panggil"
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   12
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   615
      Left            =   480
      TabIndex        =   0
      Top             =   1560
      Width           =   1935
   End
   Begin VB.Label Label5 
      Caption         =   "No Antri Panggil Ulang"
      Height          =   375
      Left            =   2520
      TabIndex        =   11
      Top             =   600
      Width           =   2295
   End
   Begin VB.Label Label4 
      Caption         =   "ip"
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   6720
      TabIndex        =   9
      Top             =   360
      Width           =   615
   End
   Begin VB.Label Label3 
      Caption         =   "port"
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   375
      Left            =   6720
      TabIndex        =   8
      Top             =   960
      Width           =   615
   End
   Begin VB.Label Label2 
      Caption         =   "Jenis"
      Height          =   375
      Left            =   360
      TabIndex        =   5
      Top             =   960
      Width           =   615
   End
   Begin VB.Label Label1 
      Caption         =   "Loket"
      Height          =   375
      Left            =   360
      TabIndex        =   3
      Top             =   360
      Width           =   615
   End
End
Attribute VB_Name = "Form2"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Dim timtimer As Double

Private Sub Check1_Click()
    If Check1.Value = 1 Then
        Call SetWindowPos(Form2.hwnd, HWND_TOPMOST, 0, 0, 0, 0, SWP_NOMOVE Or SWP_NOSIZE)
    Else
        Call SetWindowPos(Form2.hwnd, HWND_NOTOPMOST, 0, 0, 0, 0, SWP_NOMOVE Or SWP_NOSIZE)
    End If
    
End Sub

Private Sub Command1_Click()
    If ws1.State <> sckClosed Then ws1.Close
    ws1.Connect Text4.Text, Text3.Text

    strSQL = "select norec, noantrian from antrianpasienregistrasi_t where  " & _
            "statuspanggil ='0' and " & _
            "jenis ='" & Text2.Text & "' and " & _
            " noantrian IS NOT NULL AND ismobilejkn IS NULL and " & _
            "tanggalreservasi between '" & Format(Now(), "yyyy-mm-dd 00:00") & "' and '" & Format(Now(), "yyyy-mm-dd 23:59") & "' " & _
            "order by noantrian,tanggalreservasi"
    Call ReadRs(strSQL)

    If rs.RecordCount <> 0 Then
        rs.MoveFirst
'        rss.MoveNext
'        strSQL2 = "update antrianpasienregistrasi_t set statuspanggil ='2' where statuspanggil='1' and tempatlahir ='" & Text1.Text & "'"
'        Call ReadRs2(strSQL2)
        strSQL3 = "update antrianpasienregistrasi_t set statuspanggil ='1',tempatlahir='" & Text1.Text & "' where norec='" & rs!norec & "'"
        Call ReadRs3(strSQL3)
    Else
        MsgBox "Antrian habis!", vbInformation, "..:."
    End If
    Call infotainment
End Sub

Private Sub Command2_Click()
    If ws1.State <> sckClosed Then ws1.Close
    ws1.Connect Text4.Text, Text3.Text
    
    strSQL = "select norec, noantrian from antrianpasienregistrasi_t where  " & _
            "noantrian ='" & Text5.Text & "' and " & _
            "jenis ='" & Text2.Text & "' and " & _
            "tanggalreservasi between '" & Format(Now(), "yyyy-mm-dd 00:00") & "' and '" & Format(Now(), "yyyy-mm-dd 23:59") & "' " & _
            "order by tanggalreservasi"
    Call ReadRs(strSQL)
'    Call ReadJson(strSQL)
    If rs.RecordCount <> 0 Then
        rs.MoveFirst
        
'        strSQL2 = "update antrianpasienregistrasi_t set statuspanggil ='2' where statuspanggil='1' and tempatlahir ='" & Text1.Text & "'"
'        Call ReadRs2(strSQL2)
        strSQL3 = "update antrianpasienregistrasi_t set statuspanggil ='1',tempatlahir='" & Text1.Text & "' where norec='" & rs!norec & "'"
        Call ReadRs2(strSQL3)
    Else
        MsgBox "Tidak ada antrian!", vbInformation, "..:."
    End If
    
    Call infotainment
End Sub

Private Sub Command3_Click()
    frmSettingKoneksi.Show vbModal
End Sub

Private Sub Form_Load()
'On Error Resume Next
    
    
    
    Text4.Text = GetTxt("Setting.ini", "Caller", "IP_Display")
    Text3.Text = GetTxt("Setting.ini", "Caller", "Port")
    Text1.Text = GetTxt("Setting.ini", "Caller", "Loket")
    Text2.Text = GetTxt("Setting.ini", "Caller", "Jenis")
    
    Call infotainment
End Sub



Private Sub infotainment()
    On Error Resume Next
        
    strSQL = "select jenis, max(noantrian) as last from antrianpasienregistrasi_t " & _
             "where  statuspanggil ='1' " & _
             "and tanggalreservasi between '" & Format(Now(), "yyyy-mm-dd 00:00") & "' and '" & Format(Now(), "yyyy-mm-dd 23:59") & "' " & _
             "group by jenis order by jenis "
'    Call ReadJson(strSQL)
    ReadRs strSQL
    strSQL2 = "select jenis, count(noantrian) as sisa from antrianpasienregistrasi_t  " & _
             "where  statuspanggil ='0' " & _
             "and tanggalreservasi between '" & Format(Now(), "yyyy-mm-dd 00:00") & "' and '" & Format(Now(), "yyyy-mm-dd 23:59") & "' " & _
             "GROUP BY jenis order by jenis"
'    Call ReadJson2(strSQL2)
    ReadRs2 strSQL2
    A2 = 0
    A3 = 0
    A4 = 0
    
    B2 = 0
    B3 = 0
    B4 = 0
    
    C2 = 0
    C3 = 0
    C4 = 0
    
    D2 = 0
    D3 = 0
    D4 = 0
    
    
    E2 = 0
    E4 = 0
    
    F2 = 0
    F4 = 0
    
    G2 = 0
    G4 = 0
    For i = 0 To rs.RecordCount - 1
        If rs!jenis = A1 Then
            A2 = rs!Last
        End If
        If rs!jenis = B1 Then
            B2 = rs!Last
        End If
        If rs!jenis = C1 Then
            C2 = rs!Last
        End If
        If rs!jenis = D1 Then
            D2 = rs!Last
        End If
        If rs!jenis = E1 Then
            E2 = rs!Last
        End If
        If rs!jenis = F1 Then
            F2 = rs!Last
        End If
        If rs!jenis = G1 Then
            G2 = rs!Last
        End If
        A3 = Val(A2) + 1
        B3 = Val(B2) + 1
        C3 = Val(C2) + 1
        D3 = Val(D2) + 1
        rs.MoveNext
    Next
    For i = 0 To RS2.RecordCount - 1
        If RS2!jenis = A1 Then
            A4 = RS2!sisa
        End If
        If RS2!jenis = B1 Then
            B4 = RS2!sisa
        End If
        If RS2!jenis = C1 Then
            C4 = RS2!sisa
        End If
        If RS2!jenis = D1 Then
            D4 = RS2!sisa
        End If
        If RS2!jenis = E1 Then
            E4 = RS2!sisa
        End If
        If RS2!jenis = F1.Text Then
            F4 = RS2!sisa
        End If
        If RS2!jenis = G1.Text Then
            G4 = RS2!sisa
        End If
        RS2.MoveNext
    Next

        
as_epic:
End Sub























Private Sub Text2_Change()
    Call infotainment
End Sub

Private Sub Timer1_Timer()
    timtimer = timtimer + 1
    If timtimer = 60 Then
        Call infotainment
        timtimer = 1
    End If
End Sub
