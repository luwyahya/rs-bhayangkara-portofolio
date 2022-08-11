Attribute VB_Name = "modUtility"
Public Sub posisiLayarDitengah(FormInduk As Form, FormAnak As Form)
    On Error GoTo Error
    
    Dim atas As Integer
    Dim kiri As Integer
    
    
    atas = ((FormInduk.Height - FormAnak.Height) \ 2)
    kiri = ((FormInduk.Width - FormAnak.Width) \ 2)
    
    FormAnak.Move kiri, atas
    
    Exit Sub
    
Error:
    Call pesanError
End Sub

Public Sub centerForm(ByRef oForm1 As Form, ByVal oForm2 As Form)
    oForm1.Left = (oForm2.Width - oForm1.Width) / 2
    oForm1.Top = (oForm2.Height - 1500 - oForm1.Height) / 2
End Sub





Function Periksa(vCase As String, vObj As Object, vPesan As String) As Boolean
    Periksa = True

    Select Case LCase(vCase)
        Case "text"
            If Len(Trim(vObj.Text)) > 0 Then Exit Function
        Case "datacombo"
            If vObj.MatchedWithList = True Then Exit Function
        Case "nilai"
            If Val(vObj) > 0 Then Exit Function
        Case "combobox"
            If vObj.ListIndex >= 0 Then Exit Function
    End Select

    MsgBox vPesan, vbExclamation, "Validasi"
    vObj.SetFocus
    Periksa = False
End Function
Public Sub deleteADOCommandParameters(ByRef adoCommand As ADODB.Command)
    On Error GoTo Error
    
    Dim prmcounter As Integer
    With adoCommand
        For prmcounter = 0 To .Parameters.Count - 1
            .Parameters.Delete (0)
        Next
    End With
    
    Exit Sub
    
Error:
    
    Call pesanError
End Sub

Public Function periksaInputan(tipeKomponen As String, namaObjek As Object, pesan As String) As Boolean
    On Error GoTo Error
    
    periksaInputan = True
    
    Select Case LCase(tipeKomponen)
        Case "text"
            If Len(Trim(namaObjek.Text)) > 0 Then Exit Function
        Case "datacombo"
            If namaObjek.MatchedWithList = True Then Exit Function
    End Select
    
    MsgBox pesan, vbExclamation, "Validasi"
    namaObjek.SetFocus
    periksaInputan = False
    
    Exit Function

Error:

    Call pesanError
End Function

Public Sub eksekusiQuery(recordset As ADODB.recordset, Query As String)
    On Error GoTo Error
    
    Set recordset = New ADODB.recordset
    recordset.Open Query, konek, adOpenForwardOnly, adLockReadOnly
    
    Exit Sub
    
Error:
    Call pesanError
End Sub

Public Sub pesanError()
    MsgBox "Ada kesalahan dalam loading data" & vbNewLine _
    & "Hubungi administrator dan laporkan pesan berikut" & vbNewLine _
    & Err.Number & " - " & Err.Description, vbCritical, "Validasi"
    
    If (Err.Description = "Communication link failure" Or Err.Description = "TCP Provider: An existing connection was forcibly closed by the remote host.") Then
        konek.Close
        Call openConnection
    End If
    
    
End Sub

Public Sub msubRecFO(recordset As ADODB.recordset, Query As String)
    On Error GoTo errLoad

    Set recordset = New ADODB.recordset
    
    recordset.Open Query, konek, adOpenForwardOnly, adLockReadOnly

    Exit Sub
errLoad:
    Call pesanError
End Sub
Public Sub isiDataCombo(namaDataCombo As Object, rs As recordset, querySQL As String)
    On Error GoTo Error
    
    Set rs = New ADODB.recordset
    Set rs = konek.Execute(querySQL)
    
    Set namaDataCombo.RowSource = rs
    namaDataCombo.BoundColumn = rs(0).Name
    namaDataCombo.ListField = rs(1).Name
    
    Exit Sub
    
Error:
    Call pesanError
End Sub

