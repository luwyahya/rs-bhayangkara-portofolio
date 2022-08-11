Attribute VB_Name = "transmart"
Option Explicit
Public strJson As String
Public Function GetResponse(URI_Response As String) As String
'    Dim oSignature As New Signature
    Dim oHTTRequest As New WinHttp.WinHttpRequest
    Dim oResult As String
    Dim vResult As Object
    Dim lProses As Boolean

    
'    On Error GoTo ErrRequest
    
    oHTTRequest.Option(WinHttpRequestOption_EnableHttp1_1) = False
'    URI_Response = "http://192.168.1.110:8000/service/medifirst2000/desktopservice/get-data-for-rs?strsql=select jenis, max(noantrian) as last from antrianpasienregistrasi_t where  statuspanggil ='1' and tanggalreservasi between '2019-10-16 00:00' and '2019-10-16 23:59' group by jenis order by jenis "
    oHTTRequest.Open "GET", URI_Response, False
    
'    oHTTRequest.SetRequestHeader "X-AUTH-TOKEN", "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbi5pdCJ9.yA2GELoqmY5D9XcBeQxStR2-G_VzTZLw71iQTX_WKTa3cNQ5SwmpjstC6E0NbDZF8IENQFMy_u23ya2vv7lG-g"
'    oHTTRequest.SetRequestHeader "Content-Type", "application/json"
    oHTTRequest.Send

    If oHTTRequest.Status = 200 Then
        GetResponse = True
'        oResult = oHTTRequest.ResponseText
        GetResponse = oHTTRequest.ResponseText
'        lProses = JSONParse(oResult, 1, vResult, Fields.ParseResult, Fields.ParseName)
    Else
        GetResponse = False
'        oResult = oHTTRequest.ResponseText
'        lProses = JSONParse(oResult, 1, vResult, Fields.ParseResult, Fields.ParseName)
    End If
    
    Set oHTTRequest = Nothing
    Exit Function
End Function

