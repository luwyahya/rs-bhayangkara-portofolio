VERSION 5.00
Object = "{F9043C88-F6F2-101A-A3C9-08002B2F49FB}#1.2#0"; "comdlg32.ocx"
Begin VB.Form frmFoto 
   BorderStyle     =   1  'Fixed Single
   Caption         =   "Foto"
   ClientHeight    =   4155
   ClientLeft      =   2415
   ClientTop       =   3165
   ClientWidth     =   3630
   Icon            =   "frmCobaFoto.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   4155
   ScaleWidth      =   3630
   Begin VB.CommandButton cmdSimpanImage 
      Caption         =   "Save"
      Height          =   495
      Left            =   6600
      TabIndex        =   3
      Top             =   840
      Width           =   1455
   End
   Begin VB.CommandButton cmdClear 
      Appearance      =   0  'Flat
      Caption         =   "Clear"
      Height          =   495
      Left            =   6600
      TabIndex        =   2
      Top             =   2040
      Width           =   1455
   End
   Begin VB.CommandButton cmdLoad 
      Caption         =   "Load"
      Height          =   495
      Left            =   6600
      TabIndex        =   1
      Top             =   1440
      Width           =   1455
   End
   Begin VB.CommandButton cmdSelectSave 
      Caption         =   "Select File"
      Height          =   495
      Left            =   2040
      TabIndex        =   0
      Top             =   4200
      Width           =   1455
   End
   Begin MSComDlg.CommonDialog Dialog 
      Left            =   6480
      Top             =   0
      _ExtentX        =   847
      _ExtentY        =   847
      _Version        =   393216
   End
   Begin VB.Image Image1 
      Height          =   3975
      Left            =   120
      Top             =   120
      Width           =   3375
   End
End
Attribute VB_Name = "frmFoto"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim adoReport As New ADODB.Command

Dim mstream As ADODB.Stream
Dim idPasien As String
Dim noCmPasien As String
Dim UrlFile As String


Private Sub cmdClear_Click()
 Image1.Picture = Nothing
End Sub

Private Sub cmdLoad_Click()
'     If Not LoadPictureFromDB(rstRecordset) Then
'        MsgBox "Invalid Data Or No Picture In DB"
'    End If
End Sub

Public Function LoadPictureFromDB(rs As ADODB.Recordset)

'    On Error GoTo procNoPicture
'
'    'If Recordset is Empty, Then Exit
'    If rs Is Nothing Then
'        GoTo procNoPicture
'    End If
'
'    Set strStream = New ADODB.Stream
'    strStream.Type = adTypeBinary
'    strStream.Open
'
'    strStream.Write rs.Fields("**YourImageField**").Value
'
'
'    strStream.SavetoFile "C:\Temp.jpg", adSaveCreateOverWrite
'    Image1.Picture = LoadPicture("C:\Temp.jpg")
'    Kill ("C:\Temp.jpg")
'    LoadPictureFromDB = True
'
'procExitFunction:
'    Exit Function
'procNoPicture:
'    LoadPictureFromDB = False
'    GoTo procExitFunction
End Function

Public Function SavePictureToDB(rs As ADODB.Recordset, _
    sFileName As String)
'    Dim idTea As Integer
'    Dim strSQL As String
''    On Error GoTo procNoPicture
'    Dim oPict As StdPicture
'    Dim idTable As Integer
'    Set oPict = LoadPicture(sFileName)
'
'    'Exit Function if this is NOT a picture file
'    If oPict Is Nothing Then
'        MsgBox "Invalid Picture File!", vbOKOnly, "Oops!"
'        SavePictureToDB = False
'        GoTo procExitSub
'    End If
'
'    Set strStream = New ADODB.Stream
'    strStream.Type = adTypeBinary
'    strStream.Open
'    strStream.LoadFromFile sFileName
'
'    ReadRs2 "select max(id) as id from photopasien_m"
'    If RS2.EOF Then
'        idTable = RS2!ID + 1
'    End If
'
'    ReadRs "select * from photopasien_m where nocmfk = '" & idPasien & "' "
'
'
'    If rs.EOF Then
'        strSQL = "insert into photopasien_m (id,kdprofile,statusenabled,nocmfk,url) values (" & idTable & ",12, 1, '" & strStream.Read & "' & )"
'        strSQL = strSQL & ")"
'    Else
'        strSQL = "update photopasien_m set url = '" & strStream.Read & "'  where nocmfk = '" & idPasien & "'"
'    End If
'    ReadRs3 strSQL
'    Image1.Picture = LoadPicture(sFileName)
'    SavePictureToDB = True
'
'procExitSub:
'    Exit Function
'procNoPicture:
'    SavePictureToDB = False
'    GoTo procExitSub
End Function

Public Function LoadForm(strNoRM As String, strUrl As String, view As String) As String
On Error GoTo hell
    If strNoRM <> "" Then
        ReadRs "select id from pasien_m where id = '" & strNoRM & "'"
        If rs.RecordCount <> 0 Then
            idPasien = rs!ID
        End If
    End If
    frmFoto.Show
    Dim cn_khusus_jang_maneh As ADODB.Connection
'    Open Dialog Box
    With Dialog
        .DialogTitle = "Open Image File...."
        .Filter = "Image Files (*.jpeg; *.jpg)| *.jpeg; *.jpg"
        .CancelError = True
procReOpen:
         .ShowOpen

        If .fileName = "" Then
            MsgBox "Invalid filename or file not found.", _
                vbOKOnly + vbExclamation, "Oops!"
            GoTo procReOpen
        Else
            UrlFile = .fileName
            
            Set cn_khusus_jang_maneh = New ADODB.Connection
            cn_khusus_jang_maneh.Open CN.ConnectionString
            Dim rs_khusus_jang_maneh As ADODB.Recordset
            
            Set rs_khusus_jang_maneh = New ADODB.Recordset
            Set mstream = New ADODB.Stream
            mstream.Type = adTypeBinary
            mstream.Open
            Image1.Picture = LoadPicture(.fileName)
            mstream.LoadFromFile .fileName '"C:\Users\nengepic\Pictures\download.jpg"
            cn_khusus_jang_maneh.BeginTrans
'            ReadRs "select foto from pasien_m where id=" + idPasien
            rs_khusus_jang_maneh.Open "select foto from pasien_m where id=" + idPasien, cn_khusus_jang_maneh, adOpenKeyset, adLockOptimistic
            rs_khusus_jang_maneh.Fields("foto").Value = mstream.Read
            rs_khusus_jang_maneh.Update
            cn_khusus_jang_maneh.CommitTrans
'            If Not SavePictureToDB(RS, .filename) Then
'                MsgBox "Save was unsuccessful :(", vbOKOnly + _
'                        vbExclamation, "Oops!"
'                Exit Sub
'            End If
            
            Set rs_khusus_jang_maneh = New ADODB.Recordset
            rs_khusus_jang_maneh.Open "select foto from pasien_m where id=" + idPasien, cn_khusus_jang_maneh, adOpenKeyset, adLockOptimistic
            Set mstream = New ADODB.Stream
            mstream.Type = adTypeBinary
            mstream.Open
            mstream.Write rs_khusus_jang_maneh.Fields("foto").Value
            mstream.SavetoFile "c:\tmp_epics.jpg", adSaveCreateOverWrite
            
            rs_khusus_jang_maneh.Close
            cn_khusus_jang_maneh.Close
        End If

    End With
    LoadForm = "DONE"
    Unload Me
    
    
hell:
    Unload Me
    
End Function

Private Sub Form_Load()
Call SetWindowPos(frmFoto.hwnd, HWND_TOPMOST, 0, 0, 0, 0, SWP_NOMOVE Or SWP_NOSIZE)
End Sub

Private Sub Form_Unload(Cancel As Integer)
    Set frmFoto = Nothing
End Sub
