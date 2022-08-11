VERSION 5.00
Begin VB.Form frmGizi 
   BorderStyle     =   1  'Fixed Single
   Caption         =   "Gizi"
   ClientHeight    =   960
   ClientLeft      =   45
   ClientTop       =   375
   ClientWidth     =   5040
   Icon            =   "frmGizi.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   960
   ScaleWidth      =   5040
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmGizi"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Public Function gizi(ByVal QueryText As String) As Byte()
    On Error Resume Next
    Dim Root As JNode
    Dim Param1() As String
    Dim Param2() As String
    Dim Param3() As String
    Dim Param4() As String
    Dim Param5() As String
    Dim arrItem() As String
   
    If CN.State = adStateClosed Then Call openConnection
        
    If Len(QueryText) > 0 Then
        arrItem = Split(QueryText, "&")
        Param1 = Split(arrItem(0), "=")
        Param2 = Split(arrItem(1), "=")
        Param3 = Split(arrItem(2), "=")
        Param4 = Split(arrItem(3), "=")
        Param5 = Split(arrItem(4), "=")
        Select Case Param1(0)
            Case "cek-konek"
'                lblStatus.Caption = "Cek"
                Set Root = New JNode
                Root("Status") = "Ok!!"
                
         Case "cetak-label-gizi"
                Call frmCetakLabelGizi.Cetak(Param1(1), Param2(1), Param3(1))
                Set Root = New JNode
                Root("Status") = "Cetak Label Gizi"
                Root("by") = "grh@epic"
                
                
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
        farmasiApotik = .Read(adReadAll)
        .Close
    End With
    If CN.State = adStateOpen Then CN.Close
    Unload Me
    Exit Function
errLoad:
End Function

Private Sub CETAK_Etiket(strNorec As String, jumlahCetak As Integer)
On Error GoTo errLoad
    Dim prn As Printer
    Dim strPrinter As String
    
    Dim NoAntri As String
    Dim jmlAntrian As Integer
    Dim jenis As String
    
    Set rs = Nothing
    rs.Open "select sr.noresep,to_char(sr.tglresep , 'DD-MON-YYYY') as tglresep, pp.aturanpakai,pp.keteranganpakai2, " & _
            "upper(pr.namaproduk) as namaproduk,upper(ps.namapasien) as namapasien, " & _
            "to_char(ps.tgllahir , 'DD-MON-YYYY') as tglLahir,pr.keterangan " & _
            "from strukresep_t as sr " & _
            "INNER JOIN pelayananpasien_t as pp on pp.strukresepfk=sr.norec " & _
            "INNER JOIN produk_m as pr on pr.id=pp.produkfk " & _
            "INNER JOIN antrianpasiendiperiksa_t as apd on apd.norec=pp.noregistrasifk " & _
            "INNER JOIN pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
            "INNER JOIN pasien_m as ps on ps.id=pd.nocmfk " & _
            "where sr.norec='" & strNorec & "'", CN, adOpenStatic, adLockReadOnly
    
    strPrinter = GetTxt("Setting.ini", "Printer", "CetakLabelEtiket")
    If Printers.count > 0 Then
        For Each prn In Printers
            If prn.DeviceName = strPrinter Then
                Set Printer = prn
                Exit For
            End If
        Next prn
    End If
    
    Dim ii As Integer
    
    For ii = 0 To rs.RecordCount - 1
        For i = 1 To jumlahCetak
            Printer.Print "^XA"
            Printer.Print "^FO20,20^IME:RSAB.GRF^FS"
            Printer.Print "^FO5,80^GB550,1,1^FS"
            
            Printer.Print "^CFA,20"
            Printer.Print "^FO10,90^FDNo Resep :" & rs!noresep & " Tgl Resep :" & rs!tglresep & "^FS"
            Printer.Print "^CFA,21"
            Printer.Print "^FO70,120^FB400,3,0,C,0^FD" & rs!namapasien & "/" & rs!tgllahir & "^FS"
            
            Printer.Print "^CFA,23"
            Printer.Print "^FO70,160^FB400,3,0,C,0^FD" & rs!aturanpakai & "/" & rs!keteranganpakai2 & "^FS"
            
            Printer.Print "^CFA,20"
            Printer.Print "^FO10,230^FB250,3,0,C,0^FD" & rs!namaproduk & "^FS"
            
            Printer.Print "^CFA,21"
            Printer.Print "^FO290,230^FB250,3,0,C,0^FD" & rs!Keterangan & "^FS"
            
            Printer.Print "^XZ"
            Printer.EndDoc
        Next
        rs.MoveNext
    Next
    Exit Sub
    
errLoad:
End Sub
