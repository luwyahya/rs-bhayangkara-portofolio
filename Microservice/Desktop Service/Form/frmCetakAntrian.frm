VERSION 5.00
Begin VB.Form frmCetakAntrian 
   BorderStyle     =   1  'Fixed Single
   Caption         =   "Cetak Antrian"
   ClientHeight    =   690
   ClientLeft      =   45
   ClientTop       =   375
   ClientWidth     =   2925
   Icon            =   "frmCetakAntrian.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   690
   ScaleWidth      =   2925
   StartUpPosition =   3  'Windows Default
   Begin VB.Label lblStatus 
      Caption         =   "Cetak Antrian"
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   9.75
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   240
      TabIndex        =   0
      Top             =   240
      Width           =   2655
   End
End
Attribute VB_Name = "frmCetakAntrian"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Public Function CetakAntrian(ByVal QueryText As String) As Byte()
On Error Resume Next
    Dim Root As JNode
    Dim Param1() As String
    Dim Param2() As String
    Dim arrItem() As String
  If cn.State = adStateClosed Then Call openConnection
  
    
    If Len(QueryText) > 0 Then
        arrItem = Split(QueryText, "&")
        Param1 = Split(arrItem(0), "=")
        Param2 = Split(arrItem(1), "=")
        Select Case Param1(0)
            Case "cetak"
                lblStatus.Caption = "Cetak Antrian"
                Call CETAK_ANTRIAN(Param2(1), Val(Param1(1)))
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                
            Case Else
                Set Root = New JNode
                Root("Status") = "Error"
        End Select
    End If
    With GossRESTMain.STM
        .Open
        .Type = adTypeText
        .CharSet = "utf-8"
        .WriteText Root.JSON, adWriteChar
        .Position = 0
        .Type = adTypeBinary
        CetakAntrian = .Read(adReadAll)
        .Close
    End With
   If cn.State = adStateOpen Then cn.Close

    Unload Me
End Function

Private Sub CETAK_ANTRIAN(strNorec As String, jumlahCetak As Integer)
On Error Resume Next
    Dim prn As Printer
    Dim strPrinter As String
    
    Dim NoAntri As String
    Dim jmlAntrian As Integer
    Dim jenis As String
    Dim ruangan As String
    Dim poliTujuan As String
    
    Set rs = Nothing
    rs.Open "select * from antrianpasienregistrasi_t where norec ='" & strNorec & "'", cn, adOpenStatic, adLockReadOnly
      NoAh = rs!noantrian
    If Len(NoAh) = 1 Then
        NoAh = "00" & rs!noantrian
    ElseIf Len(NoAh) = 2 Then
        NoAh = "0" & rs!noantrian
    End If
   
    
    NoAntri = rs!jenis & "-" & NoAh 'RS!noantrian
    poliTujuan = rs!norujukan
   'NoAntri = RS!jenis & "-" & RS!noantrian
    jenis = rs!jenis
    Set rs = Nothing
    rs.Open "select count(noantrian) as jmlAntri from antrianpasienregistrasi_t where jenis ='" & jenis & "' and " & _
            "statuspanggil='0' and tanggalreservasi between '" & Format(Now(), "YYYY/mm/dd" & " 00:00") & "' and '" & Format(Now(), "YYYY/mm/dd" & " 23:59") & "' ", cn, adOpenStatic, adLockReadOnly
    jmlAntrian = rs(0)
    
     
    If jenis = "A" Then
        'ruangan = "Rehabilitasi Medik"
        ruangan = "NON JKN BARU"
    ElseIf jenis = "B" Then
        'ruangan = "Poli Dalam, THT, Paru"
        ruangan = "JKN BARU"
    ElseIf jenis = "C" Then
        'ruangan = "Poli Obgyn, Anak, Jantung, Kulit"
        'ruangan = "ASURANSI"
        ruangan = "NON JKN LAMA"
    ElseIf jenis = "D" Then
        'ruangan = "Poli Saraf, Jiwa, Gigi, Mata"
        'ruangan = "PERUSAHAAN"
        ruangan = "JKN LAMA"
    ElseIf jenis = "E" Then
        'ruangan = "Poli Bedah, Urologi"
        ruangan = "FINGER PRINT"
    ElseIf jenis = "F" Then
        ruangan = "LAIN-LAIN"
    ElseIf jenis = "G" Then
        ruangan = "BPJS BARU"
    ElseIf jenis = "H" Then
        ruangan = "BPJS POLRI"
    ElseIf jenis = "I" Then
        ruangan = "BPJS NON POLRI"
    ElseIf jenis = "K" Then
        ruangan = "KASIR L-1"
    ElseIf jenis = "L" Then
        ruangan = "KASIR L-2"
    End If
    
    'strPrinter = GetSetting("Jasamedika Service", "CetakAntrian", "Printer")
    strPrinter = GetTxt("Setting.ini", "Printer", "CetakAntrian")
    If Printers.Count > 0 Then
        For Each prn In Printers
            If prn.DeviceName = strPrinter Then
                Set Printer = prn
                Exit For
            End If
        Next prn
    End If
    
    For i = 1 To jumlahCetak
        'MsgBox "CETAK"
        Printer.fontSize = 10
        Printer.Print "                       RUMAH SAKIT"
        Printer.fontSize = 12
        Printer.FontBold = True
        Printer.Print "Bhayangkara TK.IV Cianjur"
        Printer.FontBold = False
        Printer.fontSize = 10
'        Printer.Print "Komp Kampus Unand Jalan Universitas Andalas,"
'        Printer.Print "    Limau Manis, Kec. Pauh, Kota Padang,"
'        Printer.Print "     Sumatera Barat 25176"
        Printer.Print "___________________________________"
        'printer.Print ""
        Printer.Print "             Tanggal :" & Format(Now(), "yyyy MM dd hh:mm")
        Printer.Print ""
        Printer.fontSize = 14
        Printer.FontBold = True
        Printer.Print "      Nomor Antrian Anda : "
        Printer.fontSize = 30
        Printer.Print "       " & NoAntri
        Printer.FontBold = False
        Printer.fontSize = 12
        Printer.Print ""
        Printer.FontBold = True
        Printer.fontSize = 12
        Printer.Print "     " & ruangan
'        Printer.Print "" & poliTujuan
        Printer.FontBold = False
        Printer.fontSize = 10
        'printer.Print ""
        Printer.Print " Silahkan menunggu nomor Anda dipanggil"
        Printer.Print "    Antrian yang belum dipanggil " & jmlAntrian & " orang"
        
        Printer.EndDoc
    Next
End Sub
Public Function CetakAntrianOnline(ByVal QueryText As String) As Byte()
On Error Resume Next
    Dim Root As JNode
    Dim Param1() As String
    Dim Param2() As String
    Dim Param3() As String
    Dim arrItem() As String
  If cn.State = adStateClosed Then Call openConnection
  
    
    If Len(QueryText) > 0 Then
        arrItem = Split(QueryText, "&")
        Param1 = Split(arrItem(0), "=")
        Param2 = Split(arrItem(1), "=")
        Param3 = Split(arrItem(2), "=")
        Select Case Param1(0)
            Case "cetak"
                lblStatus.Caption = "Cetak Antrian"
                Call CETAK_ANTRIAN_ONLINE(Param2(1), Val(Param1(1)), Param3(1))
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                
            Case Else
                Set Root = New JNode
                Root("Status") = "Error"
        End Select
    End If
    With GossRESTMain.STM
        .Open
        .Type = adTypeText
        .CharSet = "utf-8"
        .WriteText Root.JSON, adWriteChar
        .Position = 0
        .Type = adTypeBinary
        CetakAntrianOnline = .Read(adReadAll)
        .Close
    End With
   If cn.State = adStateOpen Then cn.Close

    Unload Me
End Function

Private Sub CETAK_ANTRIAN_ONLINE(strNorec As String, jumlahCetak As Integer, noReservasi As String)
On Error Resume Next
    Dim prn As Printer
    Dim strPrinter As String
    
    Dim NoAntri As String
    Dim jmlAntrian As Integer
    Dim jenis As String
    'Dim noReservasi As String
      
    Set rs = Nothing
    rs.Open "select * from antrianpasienregistrasi_t where norec ='" & strNorec & "'", cn, adOpenStatic, adLockReadOnly
      NoAh = rs!noantrian
    If Len(NoAh) = 1 Then
        NoAh = "00" & rs!noantrian
    ElseIf Len(NoAh) = 2 Then
        NoAh = "0" & rs!noantrian
    End If
    NoAntri = rs!jenis & "-" & NoAh 'RS!noantrian
   'NoAntri = RS!jenis & "-" & RS!noantrian
    jenis = rs!jenis
    'noReservasi = RS!noReservasi
    Set rs = Nothing
    rs.Open "select count(noantrian) as jmlAntri from antrianpasienregistrasi_t where jenis ='" & jenis & "' and " & _
            "statuspanggil='0' and tanggalreservasi between '" & Format(Now(), "YYYY/mm/dd" & " 00:00") & "' and '" & Format(Now(), "YYYY/mm/dd" & " 23:59") & "' ", cn, adOpenStatic, adLockReadOnly
    jmlAntrian = rs(0)
    
    'strPrinter = GetSetting("Jasamedika Service", "CetakAntrian", "Printer")
    strPrinter = GetTxt("Setting.ini", "Printer", "CetakAntrian")
    If Printers.Count > 0 Then
        For Each prn In Printers
            If prn.DeviceName = strPrinter Then
                Set Printer = prn
                Exit For
            End If
        Next prn
    End If
    
    For i = 1 To jumlahCetak
        'MsgBox "CETAK"
        Printer.fontSize = 10
        Printer.Print "           RUMAH SAKIT UMUM DAERAH"
        Printer.fontSize = 18
        Printer.FontBold = True
        Printer.Print "      KOTA MATARAM"
        Printer.FontBold = False
        Printer.fontSize = 10
        Printer.Print "Jl. Bung Karno No.3, Pagutan Raya, Mataram, "
        Printer.Print "                 Nusa Tenggara Barat"
        Printer.Print "     Telp. 0370 - 640774, Fax. 0370 - 646928"
        Printer.Print "___________________________________"
        Printer.Print ""
        Printer.Print "Antrian Pendaftaran"
        Printer.Print "Tanggal :" & Format(Now(), "yyyy MM dd hh:mm")
        Printer.Print ""
        Printer.fontSize = 14
        Printer.FontBold = True
        Printer.Print "Nomor Antrian Anda : "
        Printer.fontSize = 30
        Printer.Print "       " & NoAntri
        Printer.FontBold = False
        Printer.fontSize = 10
        Printer.Print ""
        Printer.Print " No Reservasi : " & noReservasi
        Printer.Print " Silahkan menunggu nomor Anda dipanggil"
        Printer.Print "    Antrian yang belum dipanggil " & jmlAntrian & " orang"
        
        Printer.EndDoc
    Next
End Sub


