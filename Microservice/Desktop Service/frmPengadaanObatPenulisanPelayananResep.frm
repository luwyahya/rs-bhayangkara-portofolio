VERSION 5.00
Begin VB.Form frmPengadaanObatPenulisanPelayananResep 
   Caption         =   "Form1"
   ClientHeight    =   3135
   ClientLeft      =   60
   ClientTop       =   405
   ClientWidth     =   4680
   Icon            =   "frmPengadaanObatPenulisanPelayananResep.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   3135
   ScaleWidth      =   4680
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmPengadaanObatPenulisanPelayananResep"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit

'Special Buat Excel
Dim oXL As Excel.Application
Dim oWB As Excel.Workbook
Dim oSheet As Excel.Worksheet
Dim oRng As Excel.Range
Dim oResizeRange As Excel.Range
Dim i As Integer
Dim j As Integer
Dim k As Integer
Dim Cell1 As String
Dim Cell2 As String
Dim Cell3 As String
Dim Cell4 As String
Dim Cell5 As String

Private Sub cmdTutup_Click()
    Unload Me
End Sub

Public Function Cetak(tglAwal As String)
On Error GoTo error
    
    
    'Buka Excel
    Set oXL = CreateObject("Excel.Application")
    Set oWB = oXL.Workbooks.Open(App.Path & "\Formulir RL 3.13.xlsx")
    Set oSheet = oWB.ActiveSheet
      
    strSQL = "SELECT * From profile_m WHERE id='1'"
    Set rs = Nothing
    ReadRs strSQL
    With oSheet
            .Cells(7, 4) = rs("kodeexternal").Value
            .Cells(8, 4) = rs("namalengkap").Value
            .Cells(9, 4) = tglAwal
    End With
'oXL.Visible = True
    Set rs = Nothing
    
    'baris 1
    strSQL = "Select isnull(sum(JmlTerima),0),isnull(sum(JmlStok),0) from V_RL_3_13_1 where year(TglTerima)= '" & tglAwal & "' and (isgeneric='1')"
    ReadRs strSQL
        With oSheet
            If rs.EOF = False Then
                .Cells(16, 5) = rs(0).Value
                .Cells(16, 7) = rs(1).Value
            Else
                .Cells(16, 5) = 0
                .Cells(16, 7) = 0
            End If
            
        End With
    
    strSQL = "Select isnull(sum(JmlStok),0) from V_RL_3_13_1 where year(TglTerima)= '" & tglAwal & "' and (isgeneric='1' and isformularium='1')"
    ReadRs strSQL
    
        With oSheet
            If rs.EOF = False Then
                .Cells(16, 9) = rs(0).Value
            Else
                .Cells(16, 9) = 0
            End If
            
        End With
        
    'baris 2
    strSQL = "Select isnull(sum(JmlTerima),0),isnull(sum(JmlStok),0) from V_RL_3_13_1 where year(TglTerima)= '" & tglAwal & "' and (isgeneric='0' and isformularium='1')"
    ReadRs strSQL
        With oSheet
            If rs.EOF = False Then
                .Cells(17, 5) = rs(0).Value
                .Cells(17, 7) = rs(1).Value
                .Cells(17, 9) = rs(1).Value
            Else
                .Cells(17, 5) = 0
                .Cells(17, 7) = 0
                .Cells(17, 9) = 0
            End If
            
        End With
    
   'baris 3
    strSQL = "Select isnull(sum(JmlTerima),0),isnull(sum(JmlStok),0) from V_RL_3_13_1 where year(TglTerima)= '" & tglAwal & "' and (isgeneric='0' )"
    ReadRs strSQL
        With oSheet
            If rs.EOF = False Then
                .Cells(18, 5) = rs(0).Value
                .Cells(18, 7) = rs(1).Value
            Else
                .Cells(18, 5) = 0
                .Cells(18, 7) = 0
            End If
            
        End With
    
    strSQL = "Select isnull(sum(JmlStok),0) from V_RL_3_13_1 where year(TglTerima)= '" & tglAwal & "' and (isgeneric='0' and isformularium='1')"
    ReadRs strSQL
    
        With oSheet
            If rs.EOF = False Then
                .Cells(18, 9) = rs(0).Value
            Else
                .Cells(18, 9) = 0
            End If
            
        End With
    
    
    
    Set rs = Nothing
    'baris 1
    strSQL = "Select isnull(sum(JmlBarang),0) from V_RL_3_13_2 where year(TglStruk) = '" & tglAwal & "' and isgeneric='1' and KdInstalasi='18'"
    ReadRs strSQL
        With oSheet
            .Cells(24, 5) = rs(0).Value 'rj
        End With
    
    strSQL = "Select isnull(sum(JmlBarang),0) from V_RL_3_13_2 where year(TglStruk) = '" & tglAwal & "' and isgeneric='1' and KdInstalasi='24'"
    ReadRs strSQL
        With oSheet
            .Cells(24, 7) = rs(0).Value 'igd
        End With
        
    strSQL = "Select isnull(sum(JmlBarang),0) from V_RL_3_13_2 where year(TglStruk) = '" & tglAwal & "' and isgeneric='1' and KdInstalasi='16'"
    ReadRs strSQL
        With oSheet
            .Cells(24, 9) = rs(0).Value 'ri
        End With
        
    'baris 2
    strSQL = "Select isnull(sum(JmlBarang),0) from V_RL_3_13_2 where year(TglStruk) = '" & tglAwal & "' and isgeneric='1' and isformularium='1' and KdInstalasi='18'"
    ReadRs strSQL
        With oSheet
            .Cells(25, 5) = rs(0).Value 'rj
        End With
    
    strSQL = "Select isnull(sum(JmlBarang),0) from V_RL_3_13_2 where year(TglStruk) = '" & tglAwal & "' and isgeneric='1' and isformularium='1' and KdInstalasi='24'"
    ReadRs strSQL
        With oSheet
            .Cells(25, 7) = rs(0).Value 'igd
        End With
        
    strSQL = "Select isnull(sum(JmlBarang),0) from V_RL_3_13_2 where year(TglStruk) = '" & tglAwal & "' and isgeneric='1' and isformularium='1' and KdInstalasi='16'"
    ReadRs strSQL
        With oSheet
            .Cells(25, 9) = rs(0).Value 'ri
        End With
    
   'baris 3
    strSQL = "Select isnull(sum(JmlBarang),0) from V_RL_3_13_2 where year(TglStruk) = '" & tglAwal & "' and isgeneric='0' and KdInstalasi='18'"
    ReadRs strSQL
        With oSheet
            .Cells(26, 5) = rs(0).Value 'rj
        End With
    
    strSQL = "Select isnull(sum(JmlBarang),0) from V_RL_3_13_2 where year(TglStruk) = '" & tglAwal & "' and isgeneric='0' and KdInstalasi='24'"
    ReadRs strSQL
        With oSheet
            .Cells(26, 7) = rs(0).Value 'igd
        End With
        
    strSQL = "Select isnull(sum(JmlBarang),0) from V_RL_3_13_2 where year(TglStruk) = '" & tglAwal & "' and isgeneric='0' and KdInstalasi='16'"
    
    ReadRs strSQL
        With oSheet
            .Cells(26, 9) = rs(0).Value 'ri
        End With

    oXL.Visible = True
    Screen.MousePointer = vbDefault
Exit Function
error:
'    MsgBox "Data Tidak Ada", vbInformation, "Validasi"
'Call msubPesanError
    MsgBox Err.Description
    Screen.MousePointer = vbDefault
'    Resume 0
End Function

Private Sub Form_Unload(Cancel As Integer)
On Error Resume Next
oXL.Quit
End Sub

