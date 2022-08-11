Attribute VB_Name = "Koneksi"
'-------------------------------------
' edited by : agus.sustian
' date : 02 agustus 2017
' RSAB Harapan Kita
'-------------------------------------
Public cn As New ADODB.Connection
Public rs As New ADODB.Recordset
Public rsc As New ADODB.Recordset
Public RS2 As New ADODB.Recordset
Public RS3 As New ADODB.Recordset
Public RS4 As New ADODB.Recordset
Public RS5 As New ADODB.Recordset
Public RS6 As New ADODB.Recordset
Public RS7 As New ADODB.Recordset
Public RS8 As New ADODB.Recordset
Public CN_String As String
Public strSQL As String
Public strSQL2 As String
Public strSQL3 As String
Public strSQL4 As String
Public strSQL5 As String
Public strSQL6 As String
Public strSQL7 As String
Public serverBackEnd As String


Public StatusCN As String
Public Sub openConnection()
 On Error GoTo NoConn
 Dim host, Port, username, password, database As String
   host = GetTxt2("Setting.ini", "Koneksi", "a")
   Port = GetTxt2("Setting.ini", "Koneksi", "b")
   username = GetTxt2("Setting.ini", "Koneksi", "c")
   password = GetTxt2("Setting.ini", "Koneksi", "d")
   database = GetTxt2("Setting.ini", "Koneksi", "e")
'On Error Resume Next
 
    With cn
'        If .State = adStateOpen Then Exit Sub
'        .CursorLocation = adUseClient
        CN_String = "DRIVER={PostgreSQL Unicode};" & _
                            "SERVER=" & host & ";" & _
                            "port=" & Port & ";" & _
                            "DATABASE=" & database & ";" & _
                            "UID=" & username & ";" & _
                            "PWD=" & password & ""
'        CN_String = "Server=192.168.0.250;Port=5432;Database=postgres;User Id=postgres;Password=j4s4medik4"
'        CN_String = "DRIVER={PostgreSQL Unicode};Server=" & host & ";Port=" & Port & ";Database=" & database & ";User Id=" & username & ";Password=" & password & ";"
'        .ConnectionString = CN_String
'        StatusCN = host
'        .CommandTimeout = 300
'        .Open

'        CN_String = "Provider=SQLOLEDB;Password=" & password & ";DataTypeCompatibility=80;Persist Security Info=True;" & _
'                            "User ID=" & username & _
'                            ";Initial Catalog=" & database & _
'                            ";Data Source=" & host
                     
        'CN_String = "Provider=SQLNCLI10.1;Integrated Security=SSPI;DataTypeCompatibility=80;Persist Security Info=False;Initial Catalog=rsud_mataram;Data Source=PROJECT3-BATARA\SS2008R2"
                            
        'CN_String = "Provider=SQLNCLI10.1;Password=Telepati1;DataTypeCompatibility=80;Persist Security Info=True;User ID=rsud;Initial Catalog=rsud_mataram_live;Data Source=172.16.0.214,1433"

        .ConnectionString = CN_String
        .Open
        'If CN.State = adStateOpen Then Exit Sub

        If cn.State = adStateOpen Then
        '    Connected sucsessfully"
        Else
            MsgBox "Koneksi ke database error, hubungi administrator !" & vbCrLf & Err.Description & " (" & Err.Number & ")"
            frmSettingKoneksi.Show
        End If
    End With
    

    Exit Sub
NoConn:
    MsgBox "Koneksi ke database error, ganti nama Server dan nama Database", vbCritical, "Validasi"
    frmSettingKoneksi.Show
    
'    frmSetServer.Show
'    blnError = True
'    Unload frmLogin
End Sub

Public Function ReadRs(sql As String)
  Set rs = Nothing
  rs.Open sql, cn, adOpenStatic, adLockReadOnly
End Function

Public Function ReadRs2(sql As String)
    If cn.State = adStateClosed Then Call openConnection
  Set RS2 = Nothing
  RS2.Open sql, cn, adOpenStatic, adLockReadOnly
End Function
Public Function ReadRs3(sql As String)
If cn.State = adStateClosed Then Call openConnection
  Set RS3 = Nothing
  RS3.Open sql, cn, adOpenStatic, adLockReadOnly
End Function
Public Function ReadRs4(sql As String)
  Set RS4 = Nothing
  RS4.Open sql, cn, adOpenStatic, adLockReadOnly
End Function
Public Function ReadRs5(sql As String)
  Set RS5 = Nothing
  RS5.Open sql, cn, adOpenStatic, adLockReadOnly
End Function
Public Function ReadRs6(sql As String)
  Set RS6 = Nothing
  RS6.Open sql, cn, adOpenStatic, adLockReadOnly
End Function
Public Function ReadRs7(sql As String)
  Set RS7 = Nothing
  RS7.Open sql, cn, adOpenStatic, adLockReadOnly
End Function
Public Function ReadRs8(sql As String)
  Set RS8 = Nothing
  RS8.Open sql, cn, adOpenStatic, adLockReadOnly
End Function
Public Function WriteRs(sql As String)
  Set rs = Nothing
  rs.Open sql, cn, adOpenStatic, adLockOptimistic
End Function
Public Function WriteRs2(sql As String)
  Set RS2 = Nothing
  RS2.Open sql, cn, adOpenStatic, adLockOptimistic
End Function
Public Function tempSQLWebService(sql As String) As String
  Set myMSXML = CreateObject("Microsoft.XmlHttp")
    myMSXML.Open "GET", "http://localhost:8200/service/transaksi/temp/save-sql-from-vb6?sql=" + sql, False
    myMSXML.SetRequestHeader "Content-Type", "application/json"
    myMSXML.SetRequestHeader "X-AUTH-TOKEN", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbi5sb2dpc3RpayJ9.amsHnk5s4cv1LvsIWY_fbq0NHBMomRQLUaY62GyvJm2QW0QCwgHxkYeRS918nGyhh6ovGr7Id4R_9JKQ3c66kA"
    myMSXML.Send
    tempSQLWebService = myMSXML.ResponseText
End Function
Function getNewNumber(tableName As String, fieldName As String, keys As String)
Dim newKode As String
    ReadRs "select count(" & fieldName & ") from " & tableName
    newKode = keys & 1
    If rs.RecordCount <> 0 Then
        newKode = keys & (Val(rs(0)) + 1)
    End If
    getNewNumber = newKode
End Function
'Function getNewNumberWithDate(tableName As String, fieldName As String, Keys As String, Tgl As Date) As String
'Dim newKode As String
'    ReadRs "select count(" & fieldName & ") from " & tableName & " where tglRegistrasi = '" & Format_tgl(Tgl) & "'"
'    If RS.RecordCount <> 0 Then
'        newKode = Keys & (Val(RS(0)) + 1)
'    End If
'    getNewNumberWithDate = Format(Tgl, "yyMMdd") & Format(newKode, "0###")
'End Function

Public Function ReadJson(sql As String)
    Dim p As Object
    Dim strJason As String
    strJason = GetResponse(serverBackEnd & "/desktopservice/get-data-for-rs?strsql=" + sql)
'    strJason = GetResponse(serverBackEnd & url & "?strsql=" + sql)
    Set p = JSON.parse(strJason)
    Set rs = Nothing
    If Val(p.Item("RecordCount")) = 0 Then Exit Function

    Dim ff As Variant
    Dim cc As Variant
    Dim fff()  As String
    Dim ccc()  As String
    Dim i As Integer
    Dim ii As Integer
    Dim jmlKolom As Integer
     

    With rs.Fields
        i = 0
        For Each Pp In p.Item("data").Item(1)
            .Append Pp, adVarChar, 100
            i = i + 1
        Next
        jmlKolom = i
    End With
    rs.Open
    For ii = 1 To Val(p.Item("RecordCount"))
        
        ReDim ff(1 To jmlKolom)
        i = 1
        For Each Pp In p.Item("data").Item(ii)
            ff(i) = Pp
            i = i + 1
        Next
         
        
        i = 1
        ReDim cc(1 To jmlKolom)
        For Each Pp In p.Item("data").Item(ii)
            If IsNull(p.Item("data").Item(ii).Item(Pp)) = False Then
                cc(i) = p.Item("data").Item(ii).Item(Pp)
            Else
                cc(i) = " "
            End If
            i = i + 1
        Next
        rs.AddNew
        For i = 1 To jmlKolom
            rs(ff(i)) = cc(i)
        Next
        rs.Update
        rs.MoveFirst
    Next
End Function
Public Function ReadJson2(sql As String)
    Dim p As Object
    Dim strJason As String
    strJason = GetResponse(serverBackEnd & "/desktopservice/get-data-for-rs?strsql=" + sql)
'    strJason = GetResponse(serverBackEnd & url & "?strsql=" + sql)
    Set p = JSON.parse(strJason)
    Set RS2 = Nothing
    If Val(p.Item("RecordCount")) = 0 Then Exit Function

    Dim ff As Variant
    Dim cc As Variant
    Dim fff()  As String
    Dim ccc()  As String
    Dim i As Integer
    Dim ii As Integer
    Dim jmlKolom As Integer
     

    With RS2.Fields
        i = 0
        For Each Pp In p.Item("data").Item(1)
            .Append Pp, adVarChar, 100
            i = i + 1

        Next
        jmlKolom = i

    End With
    RS2.Open 'it opens as adOpenStatic, adLockBatchOptimistic
    For ii = 1 To Val(p.Item("RecordCount"))
        
        ReDim ff(1 To jmlKolom)
        i = 1
        For Each Pp In p.Item("data").Item(ii)
            ff(i) = Pp
            i = i + 1
        Next
         
        
        i = 1
        ReDim cc(1 To jmlKolom)
        For Each Pp In p.Item("data").Item(ii)
            If IsNull(p.Item("data").Item(ii).Item(Pp)) = False Then
                cc(i) = p.Item("data").Item(ii).Item(Pp)
            Else
                cc(i) = " "
            End If
            i = i + 1
        Next
        RS2.AddNew
        For i = 1 To jmlKolom
            RS2(ff(i)) = cc(i)
        Next
        RS2.Update
        RS2.MoveFirst
    Next
End Function

