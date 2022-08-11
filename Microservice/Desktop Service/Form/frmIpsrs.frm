VERSION 5.00
Begin VB.Form frmIpsrs 
   BorderStyle     =   1  'Fixed Single
   Caption         =   "IPSRS"
   ClientHeight    =   960
   ClientLeft      =   45
   ClientTop       =   375
   ClientWidth     =   5040
   ClipControls    =   0   'False
   Icon            =   "frmIpsrs.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   960
   ScaleWidth      =   5040
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmIpsrs"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Public Function Ipsrs(ByVal QueryText As String) As Byte()
    On Error Resume Next
    Dim Root As JNode
    Dim Param1() As String
    Dim Param2() As String
    Dim Param3() As String
    Dim Param4() As String
    Dim Param5() As String
    Dim Param6() As String
    Dim Param7() As String
    Dim Param8() As String
    Dim Param9() As String
    Dim Param10() As String
    Dim Param11() As String
    Dim arrItem() As String
   
    If CN.State = adStateClosed Then Call openConnection
        
    If Len(QueryText) > 0 Then
        arrItem = Split(QueryText, "&")
        Param1 = Split(arrItem(0), "=")
        Param2 = Split(arrItem(1), "=")
        Param3 = Split(arrItem(2), "=")
        Param4 = Split(arrItem(3), "=")
        Param5 = Split(arrItem(4), "=")
        Param6 = Split(arrItem(5), "=")
        Param7 = Split(arrItem(6), "=")
        Param8 = Split(arrItem(7), "=")
        Param9 = Split(arrItem(8), "=")
        Param10 = Split(arrItem(9), "=")
        Param11 = Split(arrItem(10), "=")
        
        Select Case Param1(0)
         Case "cek-konek"
'                lblStatus.Caption = "Cek"
                Set Root = New JNode
                Root("Status") = "Ok!!"
                
         Case "cetak-permohonan-perbaikan"
                Param4 = Split(arrItem(3), "=")
                Param5 = Split(arrItem(4), "=")
                Param6 = Split(arrItem(5), "=")
                Param7 = Split(arrItem(6), "=")
                Param8 = Split(arrItem(7), "=")
                Param9 = Split(arrItem(8), "=")
                Param10 = Split(arrItem(9), "=")
                Param11 = Split(arrItem(10), "=")
                Param12 = Split(arrItem(11), "=")
                Call frmIpsrsPermohonanPerbaikan.Cetak(Param2(1), Param3(1), Param4(1), Param5(1), Param6(1), _
                                                       Param7(1), Param8(1), Param9(1), Param10(1), Param11(1))
                Set Root = New JNode
                Root("Status") = "Cetak Laporan Permohonan Perbaikan"
                Root("by") = "ea@epic"
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
