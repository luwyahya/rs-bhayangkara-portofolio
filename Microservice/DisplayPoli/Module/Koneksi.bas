Attribute VB_Name = "Koneksi"
'-------------------------------------
' edited by : agus.sustian
' date : 02 agustus 2017
' date : 26 september 2019
'-------------------------------------
Public CN As New ADODB.Connection
Public RS As New ADODB.Recordset
Public RS2 As New ADODB.Recordset
Public RS3 As New ADODB.Recordset
Public RS4 As New ADODB.Recordset
Public RS5 As New ADODB.Recordset
Public CN_String As String
Public strSQL As String
Public strSQL2 As String
Public strSQL3 As String


Public StatusCN As String
Public Sub openConnection()
 On Error GoTo NoConn
 Dim host, Port, username, password, database As String
   host = GetTxt("Setting.ini", "Koneksi", "a")
   Port = GetTxt("Setting.ini", "Koneksi", "b")
   username = GetTxt("Setting.ini", "Koneksi", "c")
   password = GetTxt("Setting.ini", "Koneksi", "d")
   database = GetTxt("Setting.ini", "Koneksi", "e")
'On Error Resume Next
 
    With CN
        If .State = adStateOpen Then Exit Sub
        .CursorLocation = adUseClient
        
        '.ConnectionString = "DRIVER={PostgreSQL Unicode};" & _
                            "SERVER=192.168.12.1;" & _
                            "port=5432;" & _
                            "DATABASE=rsab_hk_production;" & _
                            "UID=postgres;" & _
                            "PWD=root": StatusCN = "192.168.12.1"
        '.ConnectionString = "DRIVER={PostgreSQL Unicode};" & _
                            "SERVER=" & host & ";" & _
                            "port=" & port & ";" & _
                            "DATABASE=" & database & ";" & _
                            "UID=" & username & ";" & _
                            "PWD=" & password & "": StatusCN = host
        'CN_String = "Provider=SQLNCLI10.1;Password=j4s4medik4;DataTypeCompatibility=80;Persist Security Info=True;User ID=sa;Initial Catalog=rsud_mataram_dev;Data Source=192.168.0.113"
        CN_String = "Provider=SQLOLEDB;Password=" & password & ";DataTypeCompatibility=80;Persist Security Info=True;" & _
                            "User ID=" & username & "" & _
                            ";Initial Catalog=" & database & "" & _
                            ";Data Source=" & host & ""
        'CN_String = "Provider=SQLOLEDB;Password=Telepati1;DataTypeCompatibility=80;Persist Security Info=True;" & _
                            "User ID=sa" & _
                            ";Initial Catalog=MEDIFIRST_TEST1" & _
                            ";Data Source=103.228.236.74,5200"
        .ConnectionString = CN_String
        .ConnectionTimeout = 10
        .Open

        If CN.State = adStateOpen Then
        '    Connected sucsessfully"
        Else
            MsgBox "Koneksi ke database error, hubungi administrator !" & vbCrLf & Err.Description & " (" & Err.Number & ")"
            frmSettingKoneksi.Show vbModal
        End If
    End With
    

    Exit Sub
NoConn:
    MsgBox "Koneksi ke database error, ganti nama Server dan nama Database", vbCritical, "Validasi"
    frmSettingKoneksi.Show vbModal
End Sub

Public Function ReadRs(sql As String)
  Set RS = Nothing
  RS.Open sql, CN, adOpenStatic, adLockReadOnly
End Function

Public Function ReadRs2(sql As String)
    If CN.State = adStateClosed Then Call openConnection
  Set RS2 = Nothing
  RS2.Open sql, CN, adOpenStatic, adLockReadOnly
End Function
Public Function ReadRs3(sql As String)
  Set RS3 = Nothing
  RS3.Open sql, CN, adOpenStatic, adLockReadOnly
End Function
Public Function ReadRs4(sql As String)
  Set RS4 = Nothing
  RS4.Open sql, CN, adOpenStatic, adLockReadOnly
End Function
Public Function ReadRs5(sql As String)
  Set RS5 = Nothing
  RS5.Open sql, CN, adOpenStatic, adLockReadOnly
End Function
Public Function WriteRs(sql As String)
  Set RS = Nothing
  RS.Open sql, CN, adOpenStatic, adLockOptimistic
End Function
Public Function WriteRs2(sql As String)
  Set RS2 = Nothing
  RS2.Open sql, CN, adOpenStatic, adLockOptimistic
End Function
Public Function tempSQLWebService(sql As String) As String
  Set myMSXML = CreateObject("Microsoft.XmlHttp")
    myMSXML.Open "GET", "http://localhost:8200/service/transaksi/temp/save-sql-from-vb6?sql=" + sql, False
    myMSXML.SetRequestHeader "Content-Type", "application/json"
    myMSXML.SetRequestHeader "X-AUTH-TOKEN", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbi5sb2dpc3RpayJ9.amsHnk5s4cv1LvsIWY_fbq0NHBMomRQLUaY62GyvJm2QW0QCwgHxkYeRS918nGyhh6ovGr7Id4R_9JKQ3c66kA"
    myMSXML.Send
    tempSQLWebService = myMSXML.ResponseText
End Function
Function getNewNumber(tableName As String, fieldName As String, Keys As String)
Dim newKode As String
    ReadRs "select count(" & fieldName & ") from " & tableName
    newKode = Keys & 1
    If RS.RecordCount <> 0 Then
        newKode = Keys & (Val(RS(0)) + 1)
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

