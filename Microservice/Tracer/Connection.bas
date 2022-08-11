Attribute VB_Name = "Connection"
'-------------------------------------
' edited by : agus.sustian
' date : 02 agustus 2017
' RSAB Harapan Kita
'-------------------------------------
Public cn As New ADODB.Connection
'Public rs As New ADODB.recordset
'Public rsc As New ADODB.recordset
'Public RS2 As New ADODB.recordset
'Public RS3 As New ADODB.recordset
'Public RS4 As New ADODB.recordset
'Public RS5 As New ADODB.recordset
'Public RS6 As New ADODB.recordset
'Public RS7 As New ADODB.recordset
'Public RS8 As New ADODB.recordset
Public CN_String As String
'Public strSQL As String
'Public strSQL2 As String
'Public strSQL3 As String
'Public strSQL4 As String
'Public strSQL5 As String
'Public strSQL6 As String
'Public strSQL7 As String
Public serverBackEnd As String


Public StatusCN As String
Public Sub openConnection()
 On Error GoTo NoConn
 Dim host, Port, username, password, database As String
'   host = "localhost"
'   Port = "5433"
'   username = "postgres"
'   password = "j4s4medik4"
'   database = "rs_unand"
   host = "10.8.8.9"
   Port = "5432"
   username = "postgres"
   password = "@db_rsunand2022@"
   database = "rs_unand"
   ''strPassword = "@db_rsunand2022@"
''host = "10.8.8.9"
''strDatabaseName = "rs_unand"
''strUserName = "postgres"
''strServerName = "10.8.8.9"
'strPassword = "j4s4medik4"
'host = "localhost"
'strDatabaseName = "rs_unand"
'strUserName = "postgres2"
'strServerName = "localhost"
'port = "5433"
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
'    frmSettingKoneksi.Show
    
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
  Set rs2 = Nothing
  rs2.Open sql, cn, adOpenStatic, adLockReadOnly
End Function
Public Function ReadRs3(sql As String)
If cn.State = adStateClosed Then Call openConnection
  Set rs3 = Nothing
  rs3.Open sql, cn, adOpenStatic, adLockReadOnly
End Function
Public Function ReadRs4(sql As String)
  Set rs4 = Nothing
  rs4.Open sql, cn, adOpenStatic, adLockReadOnly
End Function
Public Function ReadRs5(sql As String)
  Set RS5 = Nothing
  RS5.Open sql, cn, adOpenStatic, adLockReadOnly
End Function
Public Function ReadRs6(sql As String)
  Set rs6 = Nothing
  rs6.Open sql, cn, adOpenStatic, adLockReadOnly
End Function
Public Function ReadRs7(sql As String)
  Set rs7 = Nothing
  rs7.Open sql, cn, adOpenStatic, adLockReadOnly
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
  Set rs2 = Nothing
  rs2.Open sql, cn, adOpenStatic, adLockOptimistic
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




'
'Sub bukaKoneksi()
'    Set konek = New ADODB.Connection
'    konek.CursorLocation = adUseClient
''    konek.ConnectionString = "" _
''    & "Provider=SQLNCLI10.1;" _
''    & "Integrated Security=SSPI;" _
''    & "Password=@dbRSUDp41n4n@;" _
''    & "DataTypeCompatibility=80;" _
''    & "Persist Security Info=False;" _
''    & "User ID=sa;" _
''    & "Initial Catalog=Painan2;" _
''    & "Data Source=192.168.0.12\ss2008R2"
'Dim strPassword As String
'Dim strUserName As String
'Dim strDatabaseName As String
'Dim strServerName As String
'Dim port As String
''strPassword = "@db_rsunand2022@"
''host = "10.8.8.9"
''strDatabaseName = "rs_unand"
''strUserName = "postgres"
''strServerName = "10.8.8.9"
'strPassword = "j4s4medik4"
'host = "localhost"
'strDatabaseName = "rs_unand"
'strUserName = "postgres2"
'strServerName = "localhost"
'port = "5433"
'
''    konek.ConnectionString = "Provider=SQLOLEDB.1;Password=" & strPassword & ";DataTypeCompatibility=80;Persist Security Info=True;User ID=" & strUserName & ";Initial Catalog=" & strDatabaseName & ";Data Source=" & strServerName
' konek.ConnectionString = "DRIVER={PostgreSQL Unicode};" & _
'                            "SERVER=" & host & ";" & _
'                            "port=" & port & ";" & _
'                            "DATABASE=" & strDatabaseName & ";" & _
'                            "UID=" & strUserName & ";" & _
'                            "PWD=" & strPassword & ""
''strPassword = "j4s4medik4"
''strUserName = "sa"
''strDatabaseName = "db_rsp_kramatjati"
''strServerName = ".\ss2016"
''    konek.ConnectionString = "Provider=SQLOLEDB.1;Password=" & strPassword & ";DataTypeCompatibility=80;Persist Security Info=True;User ID=" & strUserName & ";Initial Catalog=" & strDatabaseName & ";Data Source=" & strServerName
'
'
'On Error Resume Next
'
'If konek.State = adStateOpen Then
'    konek.Close
'    Set konek = New ADODB.Connection
'    konek.Open
'Else
'    konek.Open
'End If
'
'If Err.Number <> 0 Then
'    MsgBox "Koneksi gagal"
'End If
'
'End Sub
'
