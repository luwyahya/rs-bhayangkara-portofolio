<?php

/**
 * Created by PhpStorm.
 * User: GIW
 * Date: 7/31/2019
 * Time: 4:33 PM
 */

namespace App\Http\Controllers\Bridging;

use App\Http\Controllers\ApiController;
use App\Master\Agama;
use App\Master\Pegawai;
use App\Traits\CrudMaster;
use App\Traits\Valet;
use App\Transaksi\LoggingUser;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Master\Departemen;
use App\Web\LoginUser;
use App\Web\Token;
use App\Master\Pasien;
use App\Master\Ruangan;
use App\Master\TempatTidur;
use App\Transaksi\DetailDiagnosaPasien;
use App\Transaksi\IHS_Transaction;
use App\Transaksi\PasienDaftar;
use App\Transaksi\AntrianPasienDiperiksa;
use App\Web\Profile;
use DB;
use Exception;
use Illuminate\Support\Facades\Hash;
use Namshi\JOSE\Base64\Base64UrlSafeEncoder;
use Namshi\JOSE\JWT;
use Namshi\JOSE\JWS;
use Namshi\JOSE\Base64\Encoder;
use Webpatser\Uuid\Uuid;

use Lcobucci\JWT\Signer\Hmac\Sha512;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Hmac\Sha384;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\ValidationData;
use Lcobucci\JWT\Parser;
use Webpatser\Uuid\Uuid as UuidUuid;

class PHSController extends ApiController
{
    use CrudMaster;
    use Valet;
    protected $kdProfile = 17;

    public function __construct()
    {
        parent::__construct($skip_authentication = true);
    }
    protected function curlAPI($headers, $dataJsonSend = null, $url, $method)
    {
        $curl = curl_init();
        // dd($headers);
        if ($dataJsonSend == null || $dataJsonSend == '') {
            curl_setopt_array($curl, array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => $method,
                CURLOPT_HTTPHEADER => $headers
            ));
        } else {
            curl_setopt_array($curl, array(
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => $method,
                CURLOPT_POSTFIELDS => $dataJsonSend,
                CURLOPT_HTTPHEADER => $headers
            ));
        }

        $response = curl_exec($curl);
        $httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        $err = curl_error($curl);
        // dd($httpcode);
        curl_close($curl);
        
        if ($err) {
            $result = "Terjadi Kesalahan #:" . $err;
        } else {

            $result = json_decode($response);
        }
        return $result;
    }
    function getCredentialz()
    {
        $res['client_id'] = $this->settingDataFixed('client_id_PHS', $this->kdProfile);
        $res['client_secret'] = $this->settingDataFixed('client_secret_PHS', $this->kdProfile);
        $res['org'] = $this->settingDataFixed('organization_id_PHS', $this->kdProfile);
        return $res;
    }
    function endPoint()
    {
        return $this->settingDataFixed('base_url_PHS', $this->kdProfile);
    }
    public function generateToken($lokal = null)
    {
        $url = $this->settingDataFixed('auth_url_PHS', $this->kdProfile);
        $headers = array(
            'Content-Type:application/x-www-form-urlencoded',
        );
        $cred = $this->getCredentialz();
        $client_id = $cred['client_id'];
        $client_secret = $cred['client_secret'];

        $dataJsonSend =   'client_id=' . $client_id . '&client_secret=' . $client_secret;
        $methods = 'POST';
        $url = $url . "/generate?grant_type=client_credentials";

        $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        if ($lokal == true) {
            return $response;
        }
        return response()->json($response);
    }
    function getHeader()
    {
        $token = $this->generateToken(true)->access_token;

        $header = array(
            'Content-Type: application/json',
            'Authorization: Bearer ' . $token,
        );
        return $header;
    }
    public function ihsTools(Request $request, $lokal = null)
    {
        try {
            
            $headers = $this->getHeader();
            $dataJsonSend = null;
            
            if ($request['data'] != null) {
                $dataJsonSend = json_encode($request['data']);
            }
            $methods = $request['method'];
            $url = $this->endPoint() . $request['url'];
            
            $response = $this->curlAPI($headers, $dataJsonSend, $url, $methods);
        } catch (Exception $e) {
            $response = array(
                "issue" => $e->getMessage() . ' ' . $e->getLine(),
                "resourceType" => "OperationOutcome"
            );
        }
        if ($lokal) {
            return $response;
        }
        return response()->json($response);
    }
    public function Organization(Request $request)
    {
        $kdProfile = $this->kdProfile;
        $q =  collect(DB::select(" 
        SELECT
        kd.*,
        pr.ihs_id AS ihs_profile,
        pr.ihs_province,
        pr.ihs_city,
        pr.ihs_district,
        pr.ihs_village,
        pr.kodepos,
        pr.alamatlengkap,
        pr.namakota,
        pr.alamatemail,
        pr.website,
        pr.fixedphone ,
        pr.namalengkap as namaprofile
    FROM
        departemen_m AS kd
        LEFT JOIN profile_m AS pr ON pr.ID = kd.kdprofile 
    WHERE
        kd.kdprofile = $kdProfile 
        AND kd.statusenabled = true
        AND kd.ID = $request[id_dept]"))->first();


        $data =  array(
            'resourceType' => 'Organization',
            'active' => $q->statusenabled,
            'identifier' =>
            array(
                0 =>
                array(
                    'use' => 'official',
                    'system' => 'http://fhir.transmedic.co.id/organization/' . $q->phs_profile,
                    'value' => (string) $q->id,
                ),
            ),
            'type' =>
            array(
                0 =>
                array(
                    'coding' =>
                    array(
                        0 =>
                        array(
                            'system' => 'http://terminology.hl7.org/CodeSystem/organization-type',
                            'code' => 'dept',
                            'display' => 'Hospital Department',
                        ),
                    ),
                ),
            ),
            'name' => $q->namadepartemen,
            'telecom' =>
            array(
                [
                    'system' => 'phone',
                    'value' => $q->fixedphone,
                    'use' => 'work',
                ],
                [
                    'system' => 'email',
                    'value' => $q->alamatemail,
                    'use' => 'work',
                ],
                [
                    'system' => 'url',
                    'value' =>  $q->website,
                    'use' => 'work',
                ]
            ),
            'address' =>
            array(
                0 =>
                array(
                    'use' => 'work',
                    'type' => 'both',
                    'line' =>
                    array(
                        0 => $q->alamatlengkap,
                    ),
                    'city' => $q->namakota,
                    'postalCode' => $q->kodepos,
                    'country' => 'ID',
                    'extension' =>
                    array(
                        0 =>
                        array(
                            'url' => 'https://fhir.kemkes.go.id/r4/StructureDefinition/administrativeCode',
                            'extension' =>
                            array(
                                0 =>
                                array(
                                    'url' => 'province',
                                    'valueCode' =>  $q->phs_province,
                                ),
                                1 =>
                                array(
                                    'url' => 'city',
                                    'valueCode' =>  $q->phs_city,
                                ),
                                2 =>
                                array(
                                    'url' => 'district',
                                    'valueCode' =>  $q->phs_district,
                                ),
                                3 =>
                                array(
                                    'url' => 'village',
                                    'valueCode' =>  $q->phs_village,
                                ),
                            ),
                        ),
                    ),
                ),
            ),
            'partOf' =>
            array(
                'reference' => 'Organization/' . $q->phs_profile,
                'display' => $q->namaprofile,
            ),
        );

        $objetoRequest = new \Illuminate\Http\Request();
        $objetoRequest['url'] = $data['resourceType'];
        $objetoRequest['method'] = 'POST';
        $objetoRequest['data'] = $data;

        $response =  $this->ihsTools($objetoRequest, true);
        $noterror = true;
        if ($response->resourceType == 'OperationOutcome') {
            $noterror = false;
        }

        if ($q->phs_id == null) {
            $mod = new IHS_Transaction();
            $mod->norec = $mod->generateNewId();
            $mod->statusenabled = $noterror;
            $mod->kdprofile = $this->kdProfile;
        } else {
            $mod = IHS_Transaction::where('id', $q->phs_id)->first();
        }
        $mod->resourcetype = $data['resourceType'];
        $mod->url =  $this->endPoint() . $data['resourceType'];
        $mod->method = 'POST';
        $mod->id = isset($response->id) ? $response->id : null;
        $mod->body = json_encode($data);
        $mod->response =  json_encode($response);
        $mod->date = date('Y-m-d H:i:s');
        $mod->save();
        if (isset($response->id)) {
            Departemen::where('id', $q->id)->update([
                'phs_id' => $response->id
            ]);
        }
        return response()->json($response);
    }

    public function Location(Request $request)
    {
        
        $kdProfile = $this->kdProfile;
        $lat = $this->settingDataFixed('lat_PHS', $this->kdProfile);
        $long = $this->settingDataFixed('long_PHS', $this->kdProfile);
        $q =  collect(DB::select(" 
        SELECT
        kd.*,
        pr.phs_id AS phs_profile,
        pr.phs_province,
        pr.phs_city,
        pr.phs_district,
        pr.phs_village,
        pr.kodepos,
        pr.alamatlengkap,
        pr.namakota,
        pr.alamatemail,
        pr.website,
        pr.fixedphone ,
        pr.namalengkap as namaprofile,
        pr.lat,
        pr.lng,
        dep.phs_id as phs_dep
    FROM
        ruangan_m AS kd
        LEFT JOIN profile_m AS pr ON pr.ID = kd.kdprofile 
        LEFT JOIN departemen_m AS dep ON dep.ID = kd.objectdepartemenfk 
    WHERE
        -- kd.kdprofile = $kdProfile AND 
        kd.statusenabled = 1
        AND kd.ID = $request[id_ru]"))->first();

        // dd($q->phs_profile);
        $data = array(
            'resourceType' => 'Location',
            'identifier' =>
            array(
                0 =>
                array(
                    'system' => 'http://fhir.transmedic.co.id/location/RS Polri Bhayangkara Kramat Jati',
                    'value' => (string) $q->id,
                ),
            ),
            'status' => 'active',
            'name' =>  $q->namaruangan,
            'description' => $q->namaruangan,
            'mode' => 'instance',
            'telecom' =>
            array(
                0 =>
                array(
                    'system' => 'phone',
                    'value' => '(021) 8753487',
                    'use' => 'work',
                ),
                1 =>
                array(
                    'system' => 'email',
                    'value' =>  'rspkramatjati@gmail.com',
                    'use' => 'work',
                ),
                2 =>
                array(
                    'system' => 'url',
                    'value' =>  'www.transmedic.co.id',
                    'use' => 'work',
                ),
            ),
            'physicalType' =>
            array(
                'coding' =>
                array(
                    0 =>
                    array(
                        'system' => 'http://terminology.hl7.org/CodeSystem/location-physical-type',
                        'code' => 'ro',
                        'display' => 'Room',
                    ),
                ),
            ),
            'position' =>
            array(
                'longitude' => (float) $long,
                'latitude' => (float)$lat,
                'altitude' => 0,
            ),
            'managingOrganization' =>
            array(
                'reference' => 'Organization/' . $q->phs_dep,
            ),
        );

        $objetoRequest = new \Illuminate\Http\Request();
        $objetoRequest['url'] = $data['resourceType'];
        $objetoRequest['method'] = 'POST';
        $objetoRequest['data'] = $data;

        $response =  $this->ihsTools($objetoRequest, true);
        // dd($response);
        $noterror = true;
        if ($response->resourceType == 'OperationOutcome') {
            $noterror = false;
        }

        if ($q->phs_id == null) {
            $mod = new IHS_Transaction();
            $mod->norec = $mod->generateNewId();
            $mod->statusenabled = $noterror;
            $mod->kdprofile = $this->kdProfile;
        } else {
            $mod = IHS_Transaction::where('id', $q->phs_id)->first();
        }
        $mod->resourcetype = $data['resourceType'];
        $mod->url =  $this->endPoint() . $data['resourceType'];
        $mod->method = 'POST';
        $mod->id = isset($response->id) ? $response->id : null;
        $mod->body = json_encode($data);
        $mod->response =  json_encode($response);
        $mod->date = date('Y-m-d H:i:s');
        $mod->save();
        if (isset($response->id)) {
            Ruangan::where('id', $q->id)->update([
                'phs_id' => $response->id
            ]);
        }
        return response()->json($response);
    }
    public function PostAllPatientInap(Request $request)
    {
        $tglAwal=date('Y-m-d 00:00:00');
        $tglAkhir=date('Y-m-d 23:59:59');
        $q =  collect(DB::select("select  pd.noregistrasi,pd.tglregistrasi
                from pasiendaftar_t as pd 
                inner join ruangan_m as ru on ru.id = pd.objectruanganlastfk
                where ru.objectdepartemenfk = 16                 
                and ( pd.tglpulang is null)
                and pd.statusenabled = 1 and pd.phs_id is null
            "));
        
        if (count($q) == 0) {
            $response = array(
                "issue" => 'Pasien tidak termaping',
                "resourceType" => "OperationOutcome"
            );
            return $response;
            return response()->json($response);
        }
        foreach ($q as $k =>  $item) {
            $objetoRequest = new \Illuminate\Http\Request();
            $objetoRequest['noregistrasi'] = $item->noregistrasi;
            $response = $this->Encounter($objetoRequest, true);
        }
        return response()->json($response);
    }
    public function PostAllPatientInapPulang(Request $request)
    {
        $tglAwal=date('Y-m-d 00:00:00');
        $tglAkhir=date('Y-m-d 23:59:59');
        $q =  collect(DB::select("
        select pd.noregistrasi,apd.nobed from pasiendaftar_t as pd
        join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec and pd.objectruanganlastfk=apd.objectruanganfk
        join ruangan_m as ru on pd.objectruanganlastfk=ru.id
        where pd.tglpulang BETWEEN '$tglAwal' and '$tglAkhir' and ru.objectdepartemenfk=16  and pd.phs_id is not null
        
            "));
        
        if (count($q) == 0) {
            $response = array(
                "issue" => 'Pasien tidak termaping',
                "resourceType" => "OperationOutcome"
            );
            return $response;
            return response()->json($response);
        }
        foreach ($q as $k =>  $item) {
            $objetoRequest = new \Illuminate\Http\Request();
            $objetoRequest['noregistrasi'] = $item->noregistrasi;
            $objetoRequest ['id_tt']= $item->nobed;
            $response = $this->Encounter($objetoRequest, true);
            // $ihstt = app('App\Http\Controllers\Bridging\PHSController')->LocationBed($objetoRequest,true);
        }
        return response()->json($response);
    }
    public function PostAllPatientLab(Request $request)
    {
        $tglAwal=date('Y-m-d 00:00:00');
        $tglAkhir=date('Y-m-d 23:59:59');
        $q =  collect(DB::select("select [apd].[norec] from [antrianpasiendiperiksa_] as [apd] 
            inner join [pasiendaftar_t] as [pd] on [pd].[norec] = [apd].[noregistrasifk] inner join [pasien_m] as [ps]
             on [ps].[id] = [pd].[nocmfk] inner join [ruangan_m] as [ru] on [ru].[id] = [apd].[objectruanganfk] left join [ruangan_m]
              as [ruu] on [ruu].[id] = [apd].[objectruanganasalfk] inner join [departemen_m] as [dp] on [dp].[id]
               = [ru].[objectdepartemenfk] where [apd].[tglregistrasi] between '$tglAwal' and '$tglAkhir' and [pd].[statusenabled] = 1 and [ru].[id]='453'"));
        
        if (count($q) == 0) {
            $response = array(
                "issue" => 'Pasien tidak termaping',
                "resourceType" => "OperationOutcome"
            );
            return $response;
            return response()->json($response);
        }
        foreach ($q as $k =>  $item) {
            $objetoRequest = new \Illuminate\Http\Request();
            $objetoRequest['noregistrasi'] = $item->norec;
            $objetoRequest['departemen'] = '3';
            $response = $this->EncounterLab($objetoRequest, true);
        }
        return response()->json($response);
    }
    public function PostAllPatientIGD(Request $request)
    {
        $tglAwal=date('Y-m-d 00:00:00');
        $tglAkhir=date('Y-m-d 23:59:59');
        $q =  collect(DB::select("
SELECT antrianpasiendiperiksa_t.norec FROM antrianpasiendiperiksa_t
                left  join batalregistrasi_t as br on br.pasiendaftarfk=antrianpasiendiperiksa_t.noregistrasifk
				join ruangan_m as ru on antrianpasiendiperiksa_t.objectruanganfk=ru.id
                where tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir' and br.norec is null
				and ru.objectdepartemenfk=24"));
        
        if (count($q) == 0) {
            $response = array(
                "issue" => 'Pasien tidak termaping',
                "resourceType" => "OperationOutcome"
            );
            return $response;
            return response()->json($response);
        }
        foreach ($q as $k =>  $item) {
            $objetoRequest = new \Illuminate\Http\Request();
            $objetoRequest['noregistrasi'] = $item->norec;
            $objetoRequest['departemen'] = '24';
            $response = $this->EncounterLab($objetoRequest, true);
        }
        return response()->json($response);
    }
    public function PostAllPatientRJ(Request $request)
    {
        $tglAwal=date('Y-m-d 00:00:00');
        $tglAkhir=date('Y-m-d 23:59:59');
        $q =  collect(DB::select("
            select [apd].[norec] from [antrianpasiendiperiksa_t] as [apd] 
            inner join [pasiendaftar_t] as [pd] on [pd].[norec] = [apd].[noregistrasifk] inner join [pasien_m] as [ps]
             on [ps].[id] = [pd].[nocmfk] inner join [ruangan_m] as [ru] on [ru].[id] = [apd].[objectruanganfk] left join [ruangan_m]
              as [ruu] on [ruu].[id] = [apd].[objectruanganasalfk] inner join [departemen_m] as [dp] on [dp].[id]
               = [ru].[objectdepartemenfk] where apd.phs_id is null and [apd].[tglregistrasi] between '$tglAwal' and '$tglAkhir' and [pd].[statusenabled] = 1 and [ru].[objectdepartemenfk] = 18 and [ru].[id] not in (251, 453)"));
        
        if (count($q) == 0) {
            $response = array(
                "issue" => 'Pasien tidak termaping',
                "resourceType" => "OperationOutcome"
            );
            return $response;
            return response()->json($response);
        }
        foreach ($q as $k =>  $item) {
            $objetoRequest = new \Illuminate\Http\Request();
            $objetoRequest['noregistrasi'] = $item->norec;
            $objetoRequest['departemen'] = '18';
            $response = $this->EncounterLab($objetoRequest, true);
        }
        return response()->json($response);
    }
    public function PostAllDiagnosa(Request $request)
    {
        $tglAwal=date('Y-m-d 00:00:00');
        $tglAkhir=date('Y-m-d 23:59:59');
        $q =  collect(DB::select("SELECT 
        pd.noregistrasi
         FROM pasiendaftar_t as pd
        join pasien_m as ps on ps.id=pd.nocmfk
        join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
        JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk=apd.norec
        join diagnosa_m as dg on dg.id=ddp.objectdiagnosafk 
				where pd.tglregistrasi BETWEEN '$tglAwal' and '$tglAkhir'
				GROUP BY pd.noregistrasi"));
        
        if (count($q) == 0) {
            $response = array(
                "issue" => 'Pasien tidak termaping',
                "resourceType" => "OperationOutcome"
            );
            return $response;
            return response()->json($response);
        }
        foreach ($q as $k =>  $item) {
            $objetoRequest = new \Illuminate\Http\Request();
            $objetoRequest['noregistrasi'] = $item->noregistrasi;
            $response = $this->Condition($objetoRequest, true);
        }
        return response()->json($response);
    }
    public function MapRoom(Request $request)
    {
        $q =  collect(DB::select("select ru.id,ru.phs_id from ruangan_m as ru
        where objectdepartemenfk in (3,16,18,24,28)
        and ru.phs_id is null
        and ru.statusenabled = 1"));
        if (count($q) == 0) {
            $response = array(
                "issue" => 'Ruangan tidak termaping',
                "resourceType" => "OperationOutcome"
            );
            return $response;
            return response()->json($response);
        }
        foreach ($q as $k =>  $item) {
            $objetoRequest = new \Illuminate\Http\Request();
            $objetoRequest['id_ru'] = $item->id;
            // dd($objetoRequest);
            // $response = app('App\Http\Controllers\Bridging\PHSController')->Location($objetoRequest, true);
            $response = $this->Location($objetoRequest, true);
        }
        return response()->json($response);
    }
    public function MapBed(Request $request)
    {
        $q =  collect(DB::select("select tt.id,tt.phs_id from tempattidur_m as tt
                where tt.statusenabled=1
                and tt.phs_id is null"));
        if (count($q) == 0) {
            $response = array(
                "issue" => 'Tempat Tidur tidak termaping',
                "resourceType" => "OperationOutcome"
            );
            return $response;
            
            return response()->json($response);
        }
        foreach ($q as $k =>  $item) {
            $objetoRequest = new \Illuminate\Http\Request();
            $objetoRequest['id_tt'] = $item->id;
            // dd($objetoRequest);
            // $response = app('App\Http\Controllers\Bridging\PHSController')->Location($objetoRequest, true);
            $response = $this->LocationBed($objetoRequest, true);
        }
        return response()->json($response);
    }
    public function LocationBed(Request $request)
    {
        $kdProfile = $this->kdProfile;
        $phs_service_provider = $this->settingDataFixed('organization_id_PHS', $this->kdProfile);
        $q =  collect(DB::select(" 
        SELECT
        kd.phs_id as phs_ruangan,
        pr.phs_id AS phs_profile,
        pr.phs_province,
        pr.phs_city,
        pr.phs_district,
        pr.phs_village,
        pr.kodepos,
        pr.alamatlengkap,
        pr.namakota,
        pr.alamatemail,
        pr.website,
        pr.fixedphone ,
        pr.namalengkap as namaprofile,
        pr.lat,
        pr.lng,
        dep.phs_id as phs_dep,
        tt.phs_id as phs_tt,
        tt.id,
        tt.objectstatusbedfk,
        case when tt.objectstatusbedfk=1 then 'Unoccupied' else 'Occupied' end as statusttname,
        case when tt.objectstatusbedfk=1 then 'U' else 'O' end as statusttkd,
        tt.namaexternal as namaruangan,
        kl.namaexternal as kelaskode,
		kl.namakelas
    FROM
        ruangan_m AS kd
        LEFT JOIN profile_m AS pr ON pr.ID = kd.kdprofile 
        LEFT JOIN departemen_m AS dep ON dep.ID = kd.objectdepartemenfk
        left join kamar_m as km on km.objectruanganfk=kd.id
		LEFT JOIN tempattidur_m as tt on tt.objectkamarfk=km.id
        left join kelas_m as kl on kl.id=km.objectkelasfk
    WHERE
        --kd.kdprofile = $kdProfile AND 
        kd.statusenabled = 1
        AND tt.id = $request[id_tt]"))->first();

        // dd($q->phs_profile);
        $data = array(
            'id' => $q->phs_tt,
            'resourceType' => 'Location',
            'identifier' =>
            array(
                0 =>
                array(
                    'system' => 'http://fhir.transmedic.co.id/bed/kode-bed',
                    'value' => (string) $q->id,
                ),
            ),
            'status' => 'active',
            'operationalStatus'=>array(
                'system'=>'http://terminology.hl7.org/CodeSystem/v2-0116',
                'code'=> $q->statusttkd,
                'display'=> $q->statusttname
            ),
            'name' =>  $q->namaruangan,
            'description' => $q->namaruangan,
            'mode' => 'instance',
            'physicalType' =>
            array(
                'coding' =>
                array(
                    0 =>
                    array(
                        'system' => 'http://terminology.hl7.org/CodeSystem/location-physical-type',
                        'code' => 'bd',
                        'display' => 'Bed',
                    ),
                    1 =>
                    array(
                        'system' => 'http://fhir.transmedic.co.id/bed/kelas',
                        'code' => $q->kelaskode,
                        'display' => $q->namakelas,
                    ),
                ),
            ),
            'managingOrganization' =>
            array(
                'reference' => 'Organization/' . $phs_service_provider,
            ),
            'partOf' =>
            array(
                'reference' => 'Location/' . $q->phs_ruangan,
            ),
        );
        if ($q->phs_tt == null) {
                unset($data['id']);
            }

        $objetoRequest = new \Illuminate\Http\Request();
        $objetoRequest['url'] = $data['resourceType'];
        $objetoRequest['method'] = $q->phs_tt == null ? 'POST' : 'PUT';
        $objetoRequest['data'] = $data;

        $response =  $this->ihsTools($objetoRequest, true);
        // dd($response);
        $noterror = true;
        if ($response->resourceType == 'OperationOutcome') {
            $noterror = false;
        }

        if ($q->phs_tt == null) {
            $mod = new IHS_Transaction();
            $mod->norec = $mod->generateNewId();
            $mod->statusenabled = $noterror;
            $mod->kdprofile = $this->kdProfile;
        } else {
            $mod = IHS_Transaction::where('id', $q->phs_tt)->first();
        }
        $mod->resourcetype = $data['resourceType'];
        $mod->url =  $this->endPoint() . $data['resourceType'];
        $mod->method = 'POST';
        $mod->id = isset($response->id) ? $response->id : null;
        $mod->body = json_encode($data);
        $mod->response =  json_encode($response);
        $mod->date = date('Y-m-d H:i:s');
        $mod->save();
        if (isset($response->id)) {
            TempatTidur::where('id', $q->id)->update([
                'phs_id' => $response->id
            ]);
        }
        return response()->json($response);
    }
    public function Encounter(Request $request, $lokal = null)
    {
        ini_set('max_execution_time', 250);
        try {

            $kdProfile = $this->kdProfile;
            $phs_service_provider = $this->settingDataFixed('organization_id_PHS', $this->kdProfile);
            $q =  collect(DB::select(" 
        SELECT 
                ps.phs_number
                ,ps.noidentitas
                ,ps.namapasien
                ,case when ru.objectdepartemenfk=16 then  'IMP' else 'AMB'  end as code_class
                ,case when ru.objectdepartemenfk=16 then  'inpatient encounter' else 'ambulatory'  end as name_class
                ,pg.phs_id as phs_practitioner
                ,pg.namalengkap as dokter
                ,pg.noidentitas as nik_dokter
                ,ru.namaruangan
                ,ru.phs_id as phs_location
                ,pd.tglregistrasi
                ,pd.tglpulang
                ,pd.noregistrasi
                ,pd.phs_id as phs_encounter
                ,pd.phs_condition
                ,pd.phs_in_progress
                ,pd.phs_finished
                ,al.alamatlengkap
                ,dk.namadesakelurahan
                ,kc.namakecamatan
                ,kb.namakotakabupaten
                ,pp.namapropinsi
                ,ps.tgllahir
                ,ps.nohp
                ,case when ps.objectjeniskelaminfk=1 then 'male' when ps.objectjeniskelaminfk=2 then 'female' else 'unknown' end as kelamin
                ,rk.namarekanan
                ,jkp.jeniskelompokpasien as kelompokpasien
                ,kp.kesatuanpasien as kesatuan
                ,skp.satuankerjapasien
                ,pd.statusenabled
                ,bt.tanggalpembatalan
                FROM pasiendaftar_t as pd
                join pasien_m as ps on ps.id=pd.nocmfk
                join ruangan_m as ru on ru .id=pd.objectruanganlastfk
                left join pegawai_m as pg on pg .id=pd.objectpegawaifk
                join profile_m as pro on pro.id=pd.kdprofile
                left join alamat_m as al on al.nocmfk=ps.id
                left join desakelurahan_m as dk on dk.id=al.objectdesakelurahanfk
                left join kecamatan_m as kc on kc.id=dk.objectkecamatanfk
                left join kotakabupaten_m as kb on kb.id=dk.objectkotakabupatenfk
                left join propinsi_m as pp on pp.id=dk.objectpropinsifk
                left join rekanan_m as rk on rk.id=pd.objectrekananfk
                left join jeniskelompokpasien_m as jkp on jkp.id=ps.objectjeniskelompokpasienfk
                left join kesatuanpasien_m as kp on kp.id=ps.objectkesatuanfk
                left JOIN satuankerjapasien_m as skp on skp.id=ps.objectsatuankerjafk
                left join batalregistrasi_t as bt on pd.norec=bt.pasiendaftarfk
                where pd.noregistrasi='$request[noregistrasi]'
        "))->first();
           
            $diagnosis = [];
            if ($q->phs_condition != null && $request['diagnosis']) {
                $diagnosis = $request['diagnosis'];
            }
            if ($q->phs_number == null) {
                $objetoRequest = new \Illuminate\Http\Request();
                $objetoRequest['url'] = 'Patient?identifier=https://fhir.kemkes.go.id/id/nik|' . $q->noidentitas;
                $objetoRequest['method'] = 'GET';
                $objetoRequest['data'] = null;
                
                $response2 =  $this->ihsTools($objetoRequest, true);
                if ($response2->resourceType != 'OperationOutcome' && $response2->resourceType == 'Bundle'  &&  $response2->total != 0) {
                    $id_IHS = null;
                    foreach ($response2->entry  as $dd) {
                        $id_IHS = $dd->resource->id;
                    }
                    if ($id_IHS != null) {
                        Pasien::where('noidentitas', $q->noidentitas)->update([
                            'phs_number' => $id_IHS
                        ]);
                    }
                } else {
                    $data = array (
                        'resourceType' => 'Patient',
                        'active' => true,
                        'address' => 
                        array (
                            0 => 
                            array (
                            'city' => $q->namakotakabupaten,
                            'country' => 'ID',
                            'extension' => 
                            array (
                                0 => 
                                array (
                                'extension' => 
                                array (
                                    0 => 
                                    array (
                                    'url' => 'province',
                                    'valueCode' => $q->namapropinsi,
                                    ),
                                    1 => 
                                    array (
                                    'url' => 'city',
                                    'valueCode' => $q->namakotakabupaten,
                                    ),
                                    2 => 
                                    array (
                                    'url' => 'district',
                                    'valueCode' => $q->namakecamatan,
                                    ),
                                    3 => 
                                    array (
                                    'url' => 'village',
                                    'valueCode' => $q->namadesakelurahan,
                                    ),
                                    4 => 
                                    array (
                                    'url' => 'rw',
                                    'valueCode' => 'xxx',
                                    ),
                                    5 => 
                                    array (
                                    'url' => 'rt',
                                    'valueCode' => 'xxx',
                                    ),
                                ),
                                'url' => 'https://fhir.kemkes.go.id/r4/StructureDefinition/administrativeCode',
                                ),
                            ),
                            'line' => 
                            array (
                                0 => $q->alamatlengkap,
                            ),
                            'use' => 'home',
                            ),
                        ),
                        'birthDate' => $q->tgllahir,
                        'communication' => 
                        array (
                            0 => 
                            array (
                            'language' => 
                            array (
                                'coding' => 
                                array (
                                0 => 
                                array (
                                    'code' => 'id-ID',
                                    'display' => 'Indonesian',
                                    'system' => 'urn:ietf:bcp:47',
                                ),
                                ),
                                'text' => 'Indonesian',
                            ),
                            'preferred' => true,
                            ),
                        ),
                        'deceasedBoolean' => false,
                        'extension' => 
                        array (
                            0 => 
                            array (
                            'url' => 'https://fhir.kemkes.go.id/r4/StructureDefinition/citizenshipStatus',
                            'valueCode' => 'WNI',
                            ),
                        ),
                        'gender' => $q->kelamin,
                        'identifier' => 
                        array (
                            0 => 
                            array (
                            'system' => 'https://fhir.kemkes.go.id/id/ihs-number',
                            'use' => 'official',
                            'value' => 'xxx',
                            ),
                            1 => 
                            array (
                            'system' => 'https://fhir.kemkes.go.id/id/nik',
                            'use' => 'official',
                            'value' => $q->noidentitas,
                            ),
                        ),
                        'multipleBirthBoolean' => false,
                        'name' => 
                        array (
                            0 => 
                            array (
                            'text' => $q->namapasien,
                            'use' => 'official',
                            ),
                        ),
                        'telecom' => 
                        array (
                            0 => 
                            array (
                            'system' => 'phone',
                            'use' => 'mobile',
                            'value' => $q->nohp,
                            ),
                        ),
                    );
                    $objetoRequest = new \Illuminate\Http\Request();
                    $objetoRequest['url'] = 'Patient';
                    $objetoRequest['method'] = 'POST';
                    $objetoRequest['data'] = $data;

                    $response2 =  $this->ihsTools($objetoRequest, true);
                    // dd($data);
                    if ($response2->resourceType != 'OperationOutcome' ) {
                        $id_IHS = $response2->id;
                        $noterror = true;
                        if ($id_IHS != null) {
                            Pasien::where('noidentitas', $q->noidentitas)->update([
                                'phs_number' => $id_IHS
                            ]);
                        }
                        $mod = new IHS_Transaction();
                        $mod->norec = $mod->generateNewId();
                        $mod->statusenabled = $noterror;
                        $mod->kdprofile = $this->kdProfile;
                        $mod->resourcetype = $data['resourceType'];
                        $mod->url =  $this->endPoint() . $data['resourceType'];
                        $mod->method = 'POST';
                        $mod->id = isset($response2->id) ? $response2->id : null;
                        $mod->body = json_encode($data);
                        $mod->response =  json_encode($response2);
                        $mod->date = date('Y-m-d H:i:s');
                        $mod->save();
                    } else {
                        if ($lokal == true) {
                            return $response2;
                        }
                        return response()->json($response2);
                    }
                    

                    
                }
                $IHS_NUMBER_PASIEN = $id_IHS;
            } else {
                $IHS_NUMBER_PASIEN = $q->phs_number;
            }

            if ($q->phs_practitioner == null && $q->nik_dokter != null) {
                $objetoRequest = new \Illuminate\Http\Request();
                $objetoRequest['url'] = 'Practitioner?identifier=https://fhir.kemkes.go.id/id/nik|' . $q->nik_dokter;
                $objetoRequest['method'] = 'GET';
                $objetoRequest['data'] = null;
                $id_IHSDOK = null;
                $response2 =  $this->ihsTools($objetoRequest, true);
                if ($response2->resourceType != 'OperationOutcome' && $response2->resourceType == 'Bundle'  &&  $response2->total != 0) {

                    foreach ($response2->entry  as $dd) {
                        $id_IHSDOK = $dd->resource->id;
                    }
                    if ($id_IHSDOK != null) {
                        Pegawai::where('noidentitas', $q->nik_dokter)->update([
                            'phs_id' => $id_IHSDOK
                        ]);
                    }
                }
                $IHS_NUMBER_DOKTER = $id_IHSDOK;
            } else {
                $IHS_NUMBER_DOKTER = $q->phs_practitioner;
            }

            $tglregistrasi =    strtotime(date($q->tglregistrasi));
            $tglregistrasi =  substr(date("Y-m-d\TH:i:s", $tglregistrasi), 0, 23) . date('P', $tglregistrasi);
            $ihs_in_progress = null;
            $ihs_finished = null;
            if ($q->phs_in_progress != null) {
                $ihs_in_progress = strtotime(date($q->phs_in_progress));
                $ihs_in_progress = substr(date("Y-m-d\TH:i:s", $ihs_in_progress), 0, 23) . date('P', $ihs_in_progress);
            }
            if ($q->phs_finished != null) {
                $ihs_finished = strtotime(date($q->tglpulang));
                $ihs_finished = substr(date("Y-m-d\TH:i:s", $ihs_finished), 0, 23) . date('P', $ihs_finished);
            }

            $statusHis=[];
            if($q->statusenabled==true){
                if ($q->code_class == 'AMB') {
                    $status =  'arrived';
                    $ihs_finished = strtotime(date($q->tglpulang));
                    $ihs_finished = substr(date("Y-m-d\TH:i:s", $ihs_finished), 0, 23) . date('P', $ihs_finished);
                    $tglpulang =    strtotime(date($q->tglpulang));
                    $tglpulang =  substr(date("Y-m-d\TH:i:s", $tglpulang), 0, 23) . date('P', $tglpulang);
                    $statusHis =   array(
                        0 =>
                        array(
                            'status' => 'arrived',
                            'period' =>
                            array(
                                'start' => $tglregistrasi,
                                'end' => $ihs_in_progress ? $ihs_in_progress : $tglregistrasi,
                            ),
                        )
                    );
                    if ($ihs_in_progress != null) {
                        $status =  'in-progress';
                        $statusHis =   array(
                            0 =>
                            array(
                                'status' => 'arrived',
                                'period' =>
                                array(
                                    'start' => $tglregistrasi,
                                    'end' => $ihs_in_progress,
                                ),
                            ),
                            1 =>
                            array(
                                'status' => 'in-progress',
                                'period' =>
                                array(
                                    'start' => $ihs_in_progress,
                                    'end' =>  $ihs_finished ? $ihs_finished :  $ihs_in_progress,
                                ),
                            ),
                        );
                    } 
                    if ($ihs_finished != null) {
                        $status =  'finished';
                        $statusHis =   array(
                            0 =>
                            array(
                                'status' => 'arrived',
                                'period' =>
                                array(
                                    'start' => $tglregistrasi,
                                    'end' => $ihs_in_progress,
                                ),
                            ),
                            1 =>
                            array(
                                'status' => 'in-progress',
                                'period' =>
                                array(
                                    'start' => $ihs_in_progress,
                                    'end' =>  $ihs_finished,
                                ),
                            ),
                            2 =>
                            array(
                                'status' => 'finished',
                                'period' =>
                                array(
                                    'start' => $ihs_finished,
                                    'end' => $ihs_finished
                                ),
                            ),
                        );
                    }
                } else {
                    if ($q->tglpulang == null) {
                        $status = 'arrived';

                        $statusHis =   array(
                            0 =>
                            array(
                                'status' => 'arrived',
                                'period' =>
                                array(
                                    'start' => $tglregistrasi,
                                    'end' => $ihs_in_progress ? $ihs_in_progress : $tglregistrasi,
                                ),
                            ),

                        );
                        if ($ihs_in_progress != null) {
                            $status =  'in-progress';
                            $statusHis =   array(
                                0 =>
                                array(
                                    'status' => 'arrived',
                                    'period' =>
                                    array(
                                        'start' => $tglregistrasi,
                                        'end' => $ihs_in_progress,
                                    ),
                                ),
                                1 =>
                                array(
                                    'status' => 'in-progress',
                                    'period' =>
                                    array(
                                        'start' => $ihs_in_progress,
                                        'end' =>  $ihs_finished ? $ihs_finished :  $ihs_in_progress,
                                    ),
                                ),
                            );
                        }
                    } else {
                    $ihs_finished = strtotime(date($q->tglpulang));
                    $ihs_finished = substr(date("Y-m-d\TH:i:s", $ihs_finished), 0, 23) . date('P', $ihs_finished);
            
                        $status =   'finished';
                        $tglpulang =    strtotime(date($q->tglpulang));
                        $tglpulang =  substr(date("Y-m-d\TH:i:s", $tglpulang), 0, 23) . date('P', $tglpulang);
                        $statusHis =   array(
                            0 =>
                            array(
                                'status' => 'arrived',
                                'period' =>
                                array(
                                    'start' => $tglregistrasi,
                                    'end' => $ihs_in_progress ? $ihs_in_progress : $tglpulang,
                                ),
                            )
                        );
                        if ($ihs_in_progress != null) {
                            $status =  'in-progress';
                            $statusHis =   array(
                                0 =>
                                array(
                                    'status' => 'arrived',
                                    'period' =>
                                    array(
                                        'start' => $tglregistrasi,
                                        'end' => $ihs_in_progress,
                                    ),
                                ),
                                1 =>
                                array(
                                    'status' => 'in-progress',
                                    'period' =>
                                    array(
                                        'start' => $ihs_in_progress,
                                        'end' =>  $ihs_finished ? $ihs_finished :  $ihs_in_progress,
                                    ),
                                ),
                            );
                        } 
                        if ($ihs_finished != null) {
                            $status =  'finished';
                            $statusHis =   array(
                                0 =>
                                array(
                                    'status' => 'arrived',
                                    'period' =>
                                    array(
                                        'start' => $tglregistrasi,
                                        'end' => $ihs_in_progress,
                                    ),
                                ),
                                1 =>
                                array(
                                    'status' => 'in-progress',
                                    'period' =>
                                    array(
                                        'start' => $ihs_in_progress,
                                        'end' =>  $ihs_finished,
                                    ),
                                ),
                                2 =>
                                array(
                                    'status' => 'finished',
                                    'period' =>
                                    array(
                                        'start' => $ihs_finished,
                                        'end' => $ihs_finished
                                    ),
                                ),
                            );
                        }
                    }
                }
            }else{
                $status = 'cancelled';

                $statusHis =   array(
                    0 =>
                    array(
                        'status' => 'cancelled',
                        'period' =>
                        array(
                            'start' => $q->tanggalpembatalan,
                            'end' => $q->tanggalpembatalan,
                        ),
                    ),

                );
            }

            $data = array(
                'id' => $q->phs_encounter,
                'resourceType' => 'Encounter',
                'identifier' =>
                array(
                    0 =>
                    array(
                        'system' => 'http://fhir.transmedic.co.id/encounter/noregistrasi',
                        'value' => $q->noregistrasi,
                    ),
                    1 =>
                    array(
                        'system' => 'http://fhir.transmedic.co.id/encounter/golongan',
                        'value' => $q->kelompokpasien,
                    ),
                    2 =>
                    array(
                        'system' => 'http://fhir.transmedic.co.id/encounter/rekanan',
                        'value' => $q->namarekanan,
                    ),
                    3 =>
                    array(
                        'system' => 'http://fhir.transmedic.co.id/encounter/kesatuan',
                        'value' => $q->kesatuan,
                    ),
                    4 =>
                    array(
                        'system' => 'http://fhir.transmedic.co.id/encounter/satuankerja',
                        'value' => $q->satuankerjapasien,
                    )
                ),
                'status' => $status,
                'class' =>
                array(
                    'system' => 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
                    'code' =>  $q->code_class,
                    'display' =>  $q->name_class,
                ),
                 'meta' =>
                array(
                    'system' => 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
                    'code' =>  $q->code_class,
                    'display' =>  $q->name_class,
                ),
                'subject' =>
                array(
                    'reference' => 'Patient/' . $IHS_NUMBER_PASIEN,
                    'display' => $q->namapasien,
                ),
                'participant' =>
                array(
                    0 =>
                    array(
                        'type' =>
                        array(
                            0 =>
                            array(
                                'coding' =>
                                array(
                                    0 =>
                                    array(
                                        'system' => 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
                                        'code' => 'ATND',
                                        'display' => 'attender',
                                    ),
                                ),
                            ),
                        ),
                        'individual' =>
                        array(
                            'reference' => 'Practitioner/' . $IHS_NUMBER_DOKTER,
                        ),
                    ),
                ),
                'period' =>
                array(
                    'start' => $tglregistrasi,
                    'end' => $ihs_finished,
                ),
                'location' =>
                array(
                    0 =>
                    array(
                        'location' =>
                        array(
                            'reference' => 'Location/' . $q->phs_location,
                            'display' => $q->namaruangan,
                        ),
                    ),
                ),
                'diagnosis' => $diagnosis,
                'serviceProvider' =>  array(
                    "reference" => "Organization/" . $phs_service_provider
                ),
                'statusHistory' =>$statusHis
            );

            if ($IHS_NUMBER_DOKTER == null) {
                // unset($data['participant']);
            }
            if ($q->phs_encounter == null) {
                unset($data['id']);
            }
            if ($q->phs_condition == null) {
                unset($data['diagnosis']);
            }
            if ($ihs_finished == null) {
                unset($data['period']['end']);
            }



            $objetoRequest = new \Illuminate\Http\Request();
            $objetoRequest['url'] = $q->phs_encounter == null ? $data['resourceType'] : $data['resourceType'] . '/' . $q->phs_encounter;
            $objetoRequest['method'] =  $q->phs_encounter == null ? 'POST' : 'PUT';
            $objetoRequest['data'] = $data;

            $response =  $this->ihsTools($objetoRequest, true);
            // return($response);
            // die();
            $noterror = true;
            if ($response->resourceType == 'OperationOutcome') {
                $noterror = false;
            }

            if ($q->phs_encounter == null) {
                $mod = new IHS_Transaction();
                $mod->norec = $mod->generateNewId();
                $mod->statusenabled = $noterror;
                $mod->kdprofile = $this->kdProfile;
            } else {
                $mod = IHS_Transaction::where('id', $q->phs_encounter)->first();
            }
            $mod->resourcetype = $data['resourceType'];
            $mod->url =  $this->endPoint() . $data['resourceType'];
            $mod->method = 'POST';
            $mod->id = isset($response->id) ? $response->id : null;
            $mod->body = json_encode($data);
            $mod->response =  json_encode($response);
            $mod->date = date('Y-m-d H:i:s');
            $mod->save();
            if (isset($response->id)) {
                PasienDaftar::where('noregistrasi', $q->noregistrasi)->update([
                    'phs_id' => $response->id
                ]);
            }
        } catch (\Exception $e) {
            $response = array(
                "issue" => $e->getMessage() . ' ' . $e->getLine(),
                "resourceType" => "OperationOutcome"
            );
        }
        if ($lokal == true) {
            return $response;
        }
        return response()->json($response);
    }
    public function EncounterLab(Request $request, $lokal = null)
    {
        
        try {

            $kdProfile = $this->kdProfile;
            $phs_service_provider = $this->settingDataFixed('organization_id_PHS', $this->kdProfile);
            $q =  collect(DB::select(" 
        SELECT 
        ps.phs_number
        ,ps.noidentitas
        ,ps.namapasien
        ,case when ru.objectdepartemenfk=16 then  'IMP' else 'AMB'  end as code_class
        ,case when ru.objectdepartemenfk=16 then  'inpatient encounter' else 'ambulatory'  end as name_class
        ,pg.phs_id as phs_practitioner
        ,pg.namalengkap as dokter
        ,pg.noidentitas as nik_dokter
        ,ru.namaruangan
        ,ru.phs_id as phs_location
        ,apd.tglmasuk as tglregistrasi
        ,pd.tglpulang
        ,apd.phs_id as phs_encounter
        ,pd.phs_condition
        ,pd.phs_in_progress
        ,pd.phs_finished
        ,al.alamatlengkap
        ,dk.namadesakelurahan
        ,kc.namakecamatan
        ,kb.namakotakabupaten
        ,pp.namapropinsi
        ,ps.tgllahir
        ,ps.nohp
        ,case when ps.objectjeniskelaminfk=1 then 'male' when ps.objectjeniskelaminfk=2 then 'female' else 'unknown' end as kelamin
        ,apd.norec as noregistrasi
         FROM pasiendaftar_t as pd
        join pasien_m as ps on ps.id=pd.nocmfk
        join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
        join ruangan_m as ru on ru .id=apd.objectruanganfk
        left join pegawai_m as pg on pg .id=pd.objectpegawaifk
        join profile_m as pro on pro.id=pd.kdprofile
        left join alamat_m as al on al.nocmfk=ps.id
        left join desakelurahan_m as dk on dk.id=al.objectdesakelurahanfk
        left join kecamatan_m as kc on kc.id=dk.objectkecamatanfk
        left join kotakabupaten_m as kb on kb.id=dk.objectkotakabupatenfk
        left join propinsi_m as pp on pp.id=dk.objectpropinsifk
        where apd.norec='$request[noregistrasi]' 
        --and ru.objectdepartemenfk=$request[departemen]
        "))->first();
           
            $diagnosis = [];
            if ($q->phs_condition != null && $request['diagnosis']) {
                $diagnosis = $request['diagnosis'];
            }
            if ($q->phs_number == null) {
                $objetoRequest = new \Illuminate\Http\Request();
                $objetoRequest['url'] = 'Patient?identifier=https://fhir.kemkes.go.id/id/nik|' . $q->noidentitas;
                $objetoRequest['method'] = 'GET';
                $objetoRequest['data'] = null;
                
                $response2 =  $this->ihsTools($objetoRequest, true);
                if ($response2->resourceType != 'OperationOutcome' && $response2->resourceType == 'Bundle'  &&  $response2->total != 0) {
                    $id_IHS = null;
                    foreach ($response2->entry  as $dd) {
                        $id_IHS = $dd->resource->id;
                    }
                    if ($id_IHS != null) {
                        Pasien::where('noidentitas', $q->noidentitas)->update([
                            'phs_number' => $id_IHS
                        ]);
                    }
                } else {
                    $data = array (
                        'resourceType' => 'Patient',
                        'active' => true,
                        'address' => 
                        array (
                            0 => 
                            array (
                            'city' => $q->namakotakabupaten,
                            'country' => 'ID',
                            'extension' => 
                            array (
                                0 => 
                                array (
                                'extension' => 
                                array (
                                    0 => 
                                    array (
                                    'url' => 'province',
                                    'valueCode' => $q->namapropinsi,
                                    ),
                                    1 => 
                                    array (
                                    'url' => 'city',
                                    'valueCode' => $q->namakotakabupaten,
                                    ),
                                    2 => 
                                    array (
                                    'url' => 'district',
                                    'valueCode' => $q->namakecamatan,
                                    ),
                                    3 => 
                                    array (
                                    'url' => 'village',
                                    'valueCode' => $q->namadesakelurahan,
                                    ),
                                    4 => 
                                    array (
                                    'url' => 'rw',
                                    'valueCode' => 'xxx',
                                    ),
                                    5 => 
                                    array (
                                    'url' => 'rt',
                                    'valueCode' => 'xxx',
                                    ),
                                ),
                                'url' => 'https://fhir.kemkes.go.id/r4/StructureDefinition/administrativeCode',
                                ),
                            ),
                            'line' => 
                            array (
                                0 => $q->alamatlengkap,
                            ),
                            'use' => 'home',
                            ),
                        ),
                        'birthDate' => $q->tgllahir,
                        'communication' => 
                        array (
                            0 => 
                            array (
                            'language' => 
                            array (
                                'coding' => 
                                array (
                                0 => 
                                array (
                                    'code' => 'id-ID',
                                    'display' => 'Indonesian',
                                    'system' => 'urn:ietf:bcp:47',
                                ),
                                ),
                                'text' => 'Indonesian',
                            ),
                            'preferred' => true,
                            ),
                        ),
                        'deceasedBoolean' => false,
                        'extension' => 
                        array (
                            0 => 
                            array (
                            'url' => 'https://fhir.kemkes.go.id/r4/StructureDefinition/citizenshipStatus',
                            'valueCode' => 'WNI',
                            ),
                        ),
                        'gender' => $q->kelamin,
                        'identifier' => 
                        array (
                            0 => 
                            array (
                            'system' => 'https://fhir.kemkes.go.id/id/ihs-number',
                            'use' => 'official',
                            'value' => 'xxx',
                            ),
                            1 => 
                            array (
                            'system' => 'https://fhir.kemkes.go.id/id/nik',
                            'use' => 'official',
                            'value' => $q->noidentitas,
                            ),
                        ),
                        'multipleBirthBoolean' => false,
                        'name' => 
                        array (
                            0 => 
                            array (
                            'text' => $q->namapasien,
                            'use' => 'official',
                            ),
                        ),
                        'telecom' => 
                        array (
                            0 => 
                            array (
                            'system' => 'phone',
                            'use' => 'mobile',
                            'value' => $q->nohp,
                            ),
                        ),
                    );
                    $objetoRequest = new \Illuminate\Http\Request();
                    $objetoRequest['url'] = 'Patient';
                    $objetoRequest['method'] = 'POST';
                    $objetoRequest['data'] = $data;

                    $response2 =  $this->ihsTools($objetoRequest, true);
                    // dd($data);
                    if ($response2->resourceType != 'OperationOutcome' ) {
                        $id_IHS = $response2->id;
                        $noterror = true;
                        if ($id_IHS != null) {
                            Pasien::where('noidentitas', $q->noidentitas)->update([
                                'phs_number' => $id_IHS
                            ]);
                        }
                        $mod = new IHS_Transaction();
                        $mod->norec = $mod->generateNewId();
                        $mod->statusenabled = $noterror;
                        $mod->kdprofile = $this->kdProfile;
                        $mod->resourcetype = $data['resourceType'];
                        $mod->url =  $this->endPoint() . $data['resourceType'];
                        $mod->method = 'POST';
                        $mod->id = isset($response2->id) ? $response2->id : null;
                        $mod->body = json_encode($data);
                        $mod->response =  json_encode($response2);
                        $mod->date = date('Y-m-d H:i:s');
                        $mod->save();
                    } else {
                        if ($lokal == true) {
                            return $response2;
                        }
                        return response()->json($response2);
                    }
                    

                    
                }
                $IHS_NUMBER_PASIEN = $id_IHS;
            } else {
                $IHS_NUMBER_PASIEN = $q->phs_number;
            }

            if ($q->phs_practitioner == null && $q->nik_dokter != null) {
                $objetoRequest = new \Illuminate\Http\Request();
                $objetoRequest['url'] = 'Practitioner?identifier=https://fhir.kemkes.go.id/id/nik|' . $q->nik_dokter;
                $objetoRequest['method'] = 'GET';
                $objetoRequest['data'] = null;
                $id_IHSDOK = null;
                $response2 =  $this->ihsTools($objetoRequest, true);
                if ($response2->resourceType != 'OperationOutcome' && $response2->resourceType == 'Bundle'  &&  $response2->total != 0) {

                    foreach ($response2->entry  as $dd) {
                        $id_IHSDOK = $dd->resource->id;
                    }
                    if ($id_IHSDOK != null) {
                        Pegawai::where('noidentitas', $q->nik_dokter)->update([
                            'phs_id' => $id_IHSDOK
                        ]);
                    }
                }
                $IHS_NUMBER_DOKTER = $id_IHSDOK;
            } else {
                $IHS_NUMBER_DOKTER = $q->phs_practitioner;
            }

            $tglregistrasi =    strtotime(date($q->tglregistrasi));
            $tglregistrasi =  substr(date("Y-m-d\TH:i:s", $tglregistrasi), 0, 23) . date('P', $tglregistrasi);
            $ihs_in_progress = null;
            $ihs_finished = null;
            if ($q->phs_in_progress != null) {
                $ihs_in_progress = strtotime(date($q->phs_in_progress));
                $ihs_in_progress = substr(date("Y-m-d\TH:i:s", $ihs_in_progress), 0, 23) . date('P', $ihs_in_progress);
            }
            if ($q->phs_finished != null) {
                $ihs_finished = strtotime(date($q->tglpulang));
                $ihs_finished = substr(date("Y-m-d\TH:i:s", $ihs_finished), 0, 23) . date('P', $ihs_finished);
            }

            $statusHis=[];
            if ($q->code_class == 'AMB') {
                $status =  'arrived';
                $ihs_finished = strtotime(date($q->tglpulang));
                $ihs_finished = substr(date("Y-m-d\TH:i:s", $ihs_finished), 0, 23) . date('P', $ihs_finished);
                $tglpulang =    strtotime(date($q->tglpulang));
                $tglpulang =  substr(date("Y-m-d\TH:i:s", $tglpulang), 0, 23) . date('P', $tglpulang);
                $statusHis =   array(
                    0 =>
                    array(
                        'status' => 'arrived',
                        'period' =>
                        array(
                            'start' => $tglregistrasi,
                            'end' => $ihs_in_progress ? $ihs_in_progress : $tglregistrasi,
                        ),
                    )
                );
                if ($ihs_in_progress != null) {
                    $status =  'in-progress';
                    $statusHis =   array(
                        0 =>
                        array(
                            'status' => 'arrived',
                            'period' =>
                            array(
                                'start' => $tglregistrasi,
                                'end' => $ihs_in_progress,
                            ),
                        ),
                        1 =>
                        array(
                            'status' => 'in-progress',
                            'period' =>
                            array(
                                'start' => $ihs_in_progress,
                                'end' =>  $ihs_finished ? $ihs_finished :  $ihs_in_progress,
                            ),
                        ),
                    );
                } 
                if ($ihs_finished != null) {
                    $status =  'finished';
                    $statusHis =   array(
                        0 =>
                        array(
                            'status' => 'arrived',
                            'period' =>
                            array(
                                'start' => $tglregistrasi,
                                'end' => $ihs_in_progress,
                            ),
                        ),
                        1 =>
                        array(
                            'status' => 'in-progress',
                            'period' =>
                            array(
                                'start' => $ihs_in_progress,
                                'end' =>  $ihs_finished,
                            ),
                        ),
                        2 =>
                        array(
                            'status' => 'finished',
                            'period' =>
                            array(
                                'start' => $ihs_finished,
                                'end' => $ihs_finished
                            ),
                        ),
                    );
                }
            } else {
                if ($q->tglpulang == null) {
                    $status = 'arrived';

                    $statusHis =   array(
                        0 =>
                        array(
                            'status' => 'arrived',
                            'period' =>
                            array(
                                'start' => $tglregistrasi,
                                'end' => $ihs_in_progress ? $ihs_in_progress : $tglregistrasi,
                            ),
                        ),

                    );
                    if ($ihs_in_progress != null) {
                        $status =  'in-progress';
                        $statusHis =   array(
                            0 =>
                            array(
                                'status' => 'arrived',
                                'period' =>
                                array(
                                    'start' => $tglregistrasi,
                                    'end' => $ihs_in_progress,
                                ),
                            ),
                            1 =>
                            array(
                                'status' => 'in-progress',
                                'period' =>
                                array(
                                    'start' => $ihs_in_progress,
                                    'end' =>  $ihs_finished ? $ihs_finished :  $ihs_in_progress,
                                ),
                            ),
                        );
                    }
                } else {
                   $ihs_finished = strtotime(date($q->tglpulang));
                   $ihs_finished = substr(date("Y-m-d\TH:i:s", $ihs_finished), 0, 23) . date('P', $ihs_finished);
           
                    $status =   'finished';
                    $tglpulang =    strtotime(date($q->tglpulang));
                    $tglpulang =  substr(date("Y-m-d\TH:i:s", $tglpulang), 0, 23) . date('P', $tglpulang);
                    $statusHis =   array(
                        0 =>
                        array(
                            'status' => 'arrived',
                            'period' =>
                            array(
                                'start' => $tglregistrasi,
                                'end' => $ihs_in_progress ? $ihs_in_progress : $tglpulang,
                            ),
                        )
                    );
                    if ($ihs_in_progress != null) {
                        $status =  'in-progress';
                        $statusHis =   array(
                            0 =>
                            array(
                                'status' => 'arrived',
                                'period' =>
                                array(
                                    'start' => $tglregistrasi,
                                    'end' => $ihs_in_progress,
                                ),
                            ),
                            1 =>
                            array(
                                'status' => 'in-progress',
                                'period' =>
                                array(
                                    'start' => $ihs_in_progress,
                                    'end' =>  $ihs_finished ? $ihs_finished :  $ihs_in_progress,
                                ),
                            ),
                        );
                    } 
                    if ($ihs_finished != null) {
                        $status =  'finished';
                        $statusHis =   array(
                            0 =>
                            array(
                                'status' => 'arrived',
                                'period' =>
                                array(
                                    'start' => $tglregistrasi,
                                    'end' => $ihs_in_progress,
                                ),
                            ),
                            1 =>
                            array(
                                'status' => 'in-progress',
                                'period' =>
                                array(
                                    'start' => $ihs_in_progress,
                                    'end' =>  $ihs_finished,
                                ),
                            ),
                            2 =>
                            array(
                                'status' => 'finished',
                                'period' =>
                                array(
                                    'start' => $ihs_finished,
                                    'end' => $ihs_finished
                                ),
                            ),
                        );
                    }
                }
            }

            $data = array(
                'id' => $q->phs_encounter,
                'resourceType' => 'Encounter',
                'identifier' =>
                array(
                    0 =>
                    array(
                        'system' => 'http://fhir.transmedic.co.id/encounter/1000004',
                        'value' => $q->noregistrasi,
                    )
                ),
                'status' => $status,
                'class' =>
                array(
                    'system' => 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
                    'code' =>  $q->code_class,
                    'display' =>  $q->name_class,
                ),
                 'meta' =>
                array(
                    'system' => 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
                    'code' =>  $q->code_class,
                    'display' =>  $q->name_class,
                ),
                'subject' =>
                array(
                    'reference' => 'Patient/' . $IHS_NUMBER_PASIEN,
                    'display' => $q->namapasien,
                ),
                'participant' =>
                array(
                    0 =>
                    array(
                        'type' =>
                        array(
                            0 =>
                            array(
                                'coding' =>
                                array(
                                    0 =>
                                    array(
                                        'system' => 'http://terminology.hl7.org/CodeSystem/v3-ParticipationType',
                                        'code' => 'ATND',
                                        'display' => 'attender',
                                    ),
                                ),
                            ),
                        ),
                        'individual' =>
                        array(
                            'reference' => 'Practitioner/' . $IHS_NUMBER_DOKTER,
                        ),
                    ),
                ),
                'period' =>
                array(
                    'start' => $tglregistrasi,
                    'end' => $ihs_finished,
                ),
                'location' =>
                array(
                    0 =>
                    array(
                        'location' =>
                        array(
                            'reference' => 'Location/' . $q->phs_location,
                            'display' => $q->namaruangan,
                        ),
                    ),
                ),
                'diagnosis' => $diagnosis,
                'serviceProvider' =>  array(
                    "reference" => "Organization/" . $phs_service_provider
                ),
                'statusHistory' =>$statusHis
            );

            if ($IHS_NUMBER_DOKTER == null) {
                // unset($data['participant']);
            }
            if ($q->phs_encounter == null) {
                unset($data['id']);
            }
            if ($q->phs_condition == null) {
                unset($data['diagnosis']);
            }
            if ($ihs_finished == null) {
                unset($data['period']['end']);
            }



            $objetoRequest = new \Illuminate\Http\Request();
            $objetoRequest['url'] = $q->phs_encounter == null ? $data['resourceType'] : $data['resourceType'] . '/' . $q->phs_encounter;
            $objetoRequest['method'] =  $q->phs_encounter == null ? 'POST' : 'PUT';
            $objetoRequest['data'] = $data;

            $response =  $this->ihsTools($objetoRequest, true);
           
            $noterror = true;
            if ($response->resourceType == 'OperationOutcome') {
                $noterror = false;
            }

            if ($q->phs_encounter == null) {
                $mod = new IHS_Transaction();
                $mod->norec = $mod->generateNewId();
                $mod->statusenabled = $noterror;
                $mod->kdprofile = $this->kdProfile;
            } else {
                $mod = IHS_Transaction::where('id', $q->phs_encounter)->first();
            }
            $mod->resourcetype = $data['resourceType'];
            $mod->url =  $this->endPoint() . $data['resourceType'];
            $mod->method = 'POST';
            $mod->id = isset($response->id) ? $response->id : null;
            $mod->body = json_encode($data);
            $mod->response =  json_encode($response);
            $mod->date = date('Y-m-d H:i:s');
            $mod->save();
            if (isset($response->id)) {
                AntrianPasienDiperiksa::where('norec', $q->noregistrasi)->update([
                    'phs_id' => $response->id
                ]);
            }
        } catch (\Exception $e) {
            $response = array(
                "issue" => $e->getMessage() . ' ' . $e->getLine(),
                "resourceType" => "OperationOutcome"
            );
        }
        if ($lokal == true) {
            return $response;
        }
        return response()->json($response);
    }
    public function Condition(Request $request, $lokal = null)
    {
        try {
            $kdProfile = $this->kdProfile;
            $q =  collect(DB::select(" 
        SELECT 
        ps.phs_number
        ,ps.namapasien
        ,pd.noregistrasi
        ,pd.phs_id as phs_encounter
        ,pd.phs_condition as conditionhead
        ,dg.kddiagnosa
        ,dg.namadiagnosa
        ,pd.noregistrasi
        ,ddp.phs_id as phs_condition
        ,ddp.norec
         FROM pasiendaftar_t as pd
        join pasien_m as ps on ps.id=pd.nocmfk
        join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec
        JOIN detaildiagnosapasien_t as ddp on ddp.noregistrasifk=apd.norec
        join diagnosa_m as dg on dg.id=ddp.objectdiagnosafk 
        where pd.noregistrasi='$request[noregistrasi]'
        "));
            if (count($q) == 0) {
                $response = array(
                    "issue" => 'Diagnosis belum ada',
                    "resourceType" => "OperationOutcome"
                );
                if ($lokal == true) {
                    return $response;
                }
                return response()->json($response);
            }
            // if ($q[0]->conditionhead == null) {


                if ($q[0]->phs_number == null) {
                    $objetoRequest = new \Illuminate\Http\Request();
                    $objetoRequest['url'] = 'Patient?identifier=https://fhir.kemkes.go.id/id/nik|' . $q[0]->noidentitas;
                    $objetoRequest['method'] = 'GET';
                    $objetoRequest['data'] = null;

                    $response2 =  $this->ihsTools($objetoRequest, true);
                    if ($response2->resourceType != 'OperationOutcome' && $response2->resourceType == 'Bundle' &&  $response2->total != 0) {
                        $id_IHS = null;
                        foreach ($response2->entry  as $dd) {

                            $id_IHS = $dd->resource->id;
                        }
                        if ($id_IHS != null) {
                            Pasien::where('noidentitas', $q[0]->noidentitas)->update([
                                'phs_number' => $id_IHS
                            ]);
                        }
                    }
                    $IHS_NUMBER_PASIEN = $id_IHS;
                } else {
                    $IHS_NUMBER_PASIEN = $q[0]->phs_number;
                }
                $diagnosisArr = [];
                foreach ($q as $k =>  $item) {
                    // $diagnosis[] = ;
                    $data = array(
                        'id' => $item->phs_condition,
                        'resourceType' => 'Condition',
                        'clinicalStatus' =>
                        array(
                            'coding' =>
                            array(
                                0 =>
                                array(
                                    'system' => 'http://terminology.hl7.org/CodeSystem/condition-clinical',
                                    'code' => 'active',
                                    'display' => 'Active',
                                ),
                            ),
                        ),
                        'category' =>
                        array(
                            0 =>
                            array(
                                'coding' =>
                                array(
                                    0 =>
                                    array(
                                        'system' => 'http://terminology.hl7.org/CodeSystem/condition-category',
                                        'code' => 'encounter-diagnosis',
                                        'display' => 'Encounter Diagnosis',
                                    ),
                                ),
                            ),
                        ),
                        'code' =>
                        array(
                            'coding' => [
                                array(
                                    'system' => 'http://hl7.org/fhir/sid/icd-10',
                                    'code' => $item->kddiagnosa,
                                    'display' =>  $item->namadiagnosa,
                                )
                            ]
                        ),
                        'subject' =>
                        array(
                            'reference' => 'Patient/' . $IHS_NUMBER_PASIEN,
                            'display' => $item->namapasien,
                        ),
                        'encounter' =>
                        array(
                            'reference' => 'Encounter/' . $item->phs_encounter,
                        ),
                    );
                    $urlKirim = $data['resourceType'];
                    if ($item->phs_condition == null) {
                        unset($data['id']);
                    }else{
                        $urlKirim = $data['resourceType'].'/'.$data['id'];
                    }

                    $objetoRequest = new \Illuminate\Http\Request();
                    $objetoRequest['url'] = $urlKirim;
                    $objetoRequest['method'] = $item->phs_condition == null ? 'POST' : 'PUT';
                    $objetoRequest['data'] = $data;

                    $response =  $this->ihsTools($objetoRequest, true);
                    // dd($objetoRequest['url']);

                    $noterror = true;
                    if ($response->resourceType == 'OperationOutcome') {
                        $noterror = false;
                    }

                    if ($item->phs_condition == null) {
                        $mod = new IHS_Transaction();
                        $mod->norec = $mod->generateNewId();
                        $mod->statusenabled = $noterror;
                        $mod->kdprofile = $this->kdProfile;
                    } else {
                        $mod = IHS_Transaction::where('id', $item->phs_condition)->first();
                    }
                    if(empty($mod)){
                        $mod = new IHS_Transaction();
                        $mod->norec = $mod->generateNewId();
                        $mod->statusenabled = $noterror;
                        $mod->kdprofile = $this->kdProfile;
                    }
                    $mod->resourcetype = $data['resourceType'];
                    $mod->url =  $this->endPoint() . $data['resourceType'];
                    $mod->method = 'POST';
                    $mod->id = isset($response->id) ? $response->id : null;
                    $mod->body = json_encode($data);
                    $mod->response = json_encode($response);
                    $mod->date = date('Y-m-d H:i:s');
                    $mod->save();
                    if (isset($response->id)) {
                        PasienDaftar::where('noregistrasi', $item->noregistrasi)->update([
                            'phs_condition' => $response->id
                        ]);
                        DetailDiagnosaPasien::where('norec', $item->norec)->update([
                            'phs_id' => $response->id
                        ]);

                        $diagnosisArr[] = array(
                            'condition' =>
                            array(
                                'reference' => 'Condition/' . $mod->id,
                                'display' =>  $item->namadiagnosa,
                            ),
                            'use' =>
                            array(
                                'coding' =>
                                array(
                                    0 =>
                                    array(
                                        'system' => 'http://terminology.hl7.org/CodeSystem/condition-category',
                                        'code' => 'encounter-diagnosis',
                                        'display' => 'Discharge diagnosis',
                                    ),
                                ),
                            ),
                            'rank' => $k + 1,
                        );
                    }
                }

                if (count($diagnosisArr) > 0) {
                    $objetoRequest = new \Illuminate\Http\Request();
                    $objetoRequest['noregistrasi'] = $q[0]->noregistrasi;
                    $objetoRequest['diagnosis'] = $diagnosisArr;
                    PasienDaftar::where('noregistrasi', $q[0]->noregistrasi)->update([
                        'phs_diagnosis' => json_encode($diagnosisArr)
                    ]);
                    $ihs = app('App\Http\Controllers\Bridging\PHSController')->Encounter($objetoRequest, true);
                }
            // }else{
            //     $response = array(
            //         "issue" => $e->getMessage() . ' ' . $e->getLine(),
            //         "resourceType" => "OperationOutcome"
            //     );
            // }
        } catch (\Exception $e) {
            $response = array(
                "issue" => $e->getMessage() . ' ' . $e->getLine(),
                "resourceType" => "OperationOutcome"
            );
        }
        if ($lokal == true) {
            return $response;
        }
        return response()->json($response);
    }
    public function Encountertes(Request $request)
    {
        $objetoRequest = new \Illuminate\Http\Request();
        $objetoRequest['noregistrasi'] = $request['noregistrasi'];
        $ihs = app('App\Http\Controllers\Bridging\PHSController')->Encounter($objetoRequest);
        return $ihs;
    }
    public function getList(Request $request)
    {
        $data = DB::table('ihs_transaction')
            ->select('*')
            ->where('resourcetype', '=', $request['resourcetype']);
        if (isset($request['dari']) && $request['dari'] != '') {
            $data = $data->where('date', '>=', $request['dari'] . ' 00:00');
        }
        if (isset($request['sampai']) && $request['sampai'] != '') {
            $data = $data->where('date', '<=', $request['sampai'] . ' 23:59');
        }
        $data = $data->orderby('date', 'desc');
        $data = $data->get();
        $data2 = [];
        foreach ($data as $d) {
            // $d->body = json_decode( $d->body);
            // $d->response = json_decode( $d->response);
            $daaa = json_decode($d->response);
            if ($daaa->resourceType != 'OperationOutcome') {
                $data2[] =  $daaa;
            }
        }
        return response()->json($data2);
    }
    public function Practitioner(Request $request)
    {

        $pegawai =  Pegawai::where('id', $request['id_nakes'])->first();
        $objetoRequest = new \Illuminate\Http\Request();
        $objetoRequest['url'] = 'Practitioner?identifier=https://fhir.kemkes.go.id/id/nik|' . $pegawai->noidentitas;
        $objetoRequest['method'] = 'GET';
        $objetoRequest['data'] = null;
        $id_IHSDOK = '';
        $response2 =  $this->ihsTools($objetoRequest, true);

        if ($response2->resourceType != 'OperationOutcome' && $response2->resourceType == 'Bundle' &&  $response2->total != 0) {
            foreach ($response2->entry  as $dd) {
                $id_IHSDOK = $dd->resource->id;
            }
        }

        if ($id_IHSDOK != '') {
            Pegawai::where('id', $request['id_nakes'])->update([
                'phs_id' => $id_IHSDOK
            ]);
        }


        return response()->json($response2);
    }

    public function updateIHSPasien(Request $request)
    {
        $kdProfile = (int) $this->kdProfile;
        DB::beginTransaction();
        try {

            $JD = Pasien::where('id', $request['id'])->where('kdprofile', $kdProfile)->update(
                [
                    'phs_number' => $request['ihs_number']
                ]
            );

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            $transMessage = "Simpan Berhasil";
            DB::commit();
            $result = array(
                "status" => 201,
                "pasien" => $JD,
                "as" => 'inhuman',
            );
        } else {
            $transMessage = "Simpan Gagal";
            DB::rollBack();
            $result = array(
                "status" => 400,
                "as" => 'inhuman',
            );
        }
        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
}
