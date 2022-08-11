VERSION 5.00
Begin VB.Form frmJenazah 
   Caption         =   "Form1"
   ClientHeight    =   3135
   ClientLeft      =   60
   ClientTop       =   405
   ClientWidth     =   4680
   Icon            =   "frmJenazah.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   3135
   ScaleWidth      =   4680
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmJenazah"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Public Function Fungsi(ByVal QueryText As String) As Byte()
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
                Set Root = New JNode
                Root("Status") = "Ok!!"

            Case "cetak-surat-keterangan-meninggal"
                strSQL2 = "select * from V_DaftarPasienInstalasiJenazah where noregistrasi='" & Param2(1) & "'"
                Call frmCetakDaftarPasienMeninggal.Cetak
                
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "dd5"
            
            Case "cetak-surat-serah-terima-jenazah"
                strSQL2 = "select * from V_DaftarPasienInstalasiJenazah where noregistrasi='" & Param2(1) & "'"
                Call FrmViewerLaporanNew3.Cetak(Param3(1))
                
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "dd5"
                
            Case "cetak-surat-permohonan-tindakan-pada-jenazah"
                strSQL2 = "select * from V_DaftarPasienInstalasiJenazah where noregistrasi='" & Param2(1) & "'"
                Call FrmViewerLaporanNew2.Cetak(Param3(1))
                
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "dd5"
             
            Case "cetak-daftar-jenazah"
               strSQL2 = "select * from V_DaftarPasienInstalasiJenazah where tglmeninggal2 between '" & Param3(1) & "' and '" & Param4(1) & "'"
               Call frmCetakDaftarPasienJenazah.Cetak(Param2(1), Param3(1), Param4(1))
               
               Set Root = New JNode
               Root("Status") = "Sedang Dicetak!!"
               Root("by") = "dd5"

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




