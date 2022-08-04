<?php

/**
 * Created by PhpStorm.
 * User: GIW
 * Date: 7/31/2019
 * Time: 4:33 PM
 */

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\ApiController;
use App\Master\Agama;
use App\Master\Pegawai;
use App\Traits\CrudMaster;
use App\Traits\Valet;
use App\Transaksi\LoggingUser;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Web\LoginUser;
use App\Web\Token;
use App\Master\Pasien;
// use App\Web\Admin\ProfileHistoriAwards as ProfileHistoriAwards;
// use App\Web\Admin\Awards as Awards_M;
// use App\Web\Asal as Asal_M;
// use App\Transaksi\StrukHistori as StrukHistori_T;
use DB;
use Illuminate\Support\Facades\Hash;
use Namshi\JOSE\Base64\Base64UrlSafeEncoder;
use Namshi\JOSE\JWT;
use Namshi\JOSE\JWS;
use Namshi\JOSE\Base64\Encoder;
use Ramsey\Uuid\Uuid;
// use Webpatser\Uuid\Uuid;


use Lcobucci\JWT\Signer\Hmac\Sha512;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Hmac\Sha384;
use Lcobucci\JWT\Builder;
use Lcobucci\JWT\ValidationData;
use Lcobucci\JWT\Parser;



class FhirController extends ApiController
{
    use CrudMaster;


    public function __construct()
    {
        parent::__construct($skip_authentication = true);
    }

    protected function encryptSHA1($pass)
    {
        return sha1($pass);
    }
    protected function encryptHash($pass)
    {
        return  Hash::make($pass);
    }

    public function bundle(Request $request)
    {
        $secretKey = '78d49415207dc15a0aa865e23ba1105926a0514308563c9fd85ba75a5aaa83f5';
        $response = $this->inacbg_decrypt(urldecode($request["x-id"]), $secretKey);

        $uuidBundle = "0000002-" . Uuid::uuid4();
        $uuidComposition = "0000002-" . Uuid::uuid4();
        $uuidPractitioner = "0000002-" . Uuid::uuid4();
        $uuidPatient = "0000002-" . Uuid::uuid4();
        $uuidOrganization = "0000002-" . Uuid::uuid4();
        $uuidCondition = "0000002-" . Uuid::uuid4();
        $uuidDiagnosticReport = "0000002-" . Uuid::uuid4();
        $uuidProcedure = "0000002-" . Uuid::uuid4();
        $uuidDevice = "0000002-" . Uuid::uuid4();
        $uuidEncounter = "0000002-" . Uuid::uuid4();
        $uiidMedicationRequest = "0000002-" . Uuid::uuid4();
        $now = date('Y-m-d H:i:s');
        $Composition = array(
                "resource" => array(
                    "resourceType" => "Composition",
                    "id" => $uuidComposition,
                    "status" => "final",
                    "type" => array(
                        "coding" => array([
                            "system" => "http://loinc.org",
                            "code" => "81218-0"
                        ]),
                        "text" => "Discharge Summary"
                    ),
                    "subject" => array([
                        "reference" => "Patient/".$uuidEncounter,
                        "display" => "Testing"
                    ]),
                    "encounter" => array([
                        "reference" => "Patient/".$uuidEncounter,
                    ]),
                    "date" => "2021-09-01 12:30:02",
                    "author" => array([
                        "reference" => "Practitioner/example",
                        "display" => "Doctor Dave"
                    ]),
                    "title" => "Discharge Summary",
                    "confidentiality" => "N",
                    "section" => [
                        array(
                            "title" => "Reason for admission",
                            "code" => array(
                                "coding" => array([
                                    "system" => "http://loinc.org",
                                    "code" => "29299-5",
                                    "display" => "Reason for visit Narrative"
                                ])
                            ),
                            "text" => array(
                                "status" => "additional",
                                "div" => "<div>Anaknya minta jajan 1000 rupiah cuma dikasih koin 500 rupiah, lalu marah dan koinnya ditelan, sudah 5 jam belum keluar</div>"
                            )
                        ), array(
                            "title" => "Chief complaint",
                            "code" => array(
                                "coding" => array([
                                    "system" => "http://loinc.org",
                                    "code" => "10154-3",
                                    "display" => "Chief complaint Narrative"
                                ])
                            ),
                            "text" => array(
                                "status" => "additional",
                                "div" => "<div>Sudah 5 jam belum keluar koinnya</div>"
                            )
                        ), array(
                            "title" => "Admission diagnosis",
                            "code" => array(
                                "coding" => array([
                                    "system" => "http://loinc.org",
                                    "code" => "42347-5",
                                    "display" => "Admission diagnosis Narrative"
                                ])
                            ),
                            "text" => array(
                                "status" => "additional",
                                "div" => "<div>Cholera</div>"
                            ),
                            "entry" => [array(
                                "reference" => "urn:uuid:541a72a8-df75-4484-ac89-ac4923f03b81"
                            )]
                        ),
                        array(
                            "title" => "Medications on Discharge",
                            "code" => array(
                                "coding" => [array(
                                    "system" => "http://loinc.org",
                                    "code" => "75311-1",
                                    "display" => "Hospital discharge medications Narrative"
                                )]
                            ),
                            "text" => array(
                                "status" => "additional",
                                "div" => "<div>  <table>  <thead>  <tr>   <td>Medication</td>   <td>Last Change</td>  <td>Last ChangeReason</td>  </tr>  </thead>  <tbody>  <tr>   <td>Theophylline 200mg BD after meals</td>  <td>continued</td>   </tr>  <tr>     <td>Ventolin Inhaler</td>    <td>stopped</td>     <td>Getting side effect of tremor</td>     </tr>   </tbody>   </table>  </div>"
                            ),
                            "mode" => "working",
                            "entry" => [array(
                                "reference" => "MedicationRequest/".$uiidMedicationRequest
                            ), array(
                                "reference" => "MedicationRequest/".$uiidMedicationRequest
                            )]
                        ),
                        array(
                            "title" => "Plan of care",
                            "code" => array(
                                "coding" => [array(
                                    "system" => "http://loinc.org",
                                    "code" => "18776-5",
                                    "display" => "Plan of care"
                                )]
                            ),
                            "text" => array(
                                "status" => "additional",
                                "div" => "<div>-</div>"
                            ),
                            "mode" => "working",
                            "entry" => [array(
                                "reference" => "MedicationRequest/".$uiidMedicationRequest
                            )]
                        ),
                        array(
                            "title" => "Hospital course",
                            "code" => array(
                                "coding" => [array(
                                    "system" => "http://loinc.org",
                                    "code" => "8648-8",
                                    "display" => "Hospital course Narrative"
                                )]
                            ),
                            "text" => array(
                                "status" => "additional",
                                "div" => "<div>Riwayat perjalanan perawatan: ....</div>"
                            ),
                            "mode" => "working",
                        ),
                        array(
                            "title" => "Known allergies",
                            "code" => array(
                                "coding" => [array(
                                    "system" => "http://loinc.org",
                                    "code" => "48765-2",
                                    "display" => "Allergies and adverse reactions"
                                )]
                            ),
                            "text" => array(
                                "status" => "additional",
                                "div" => "<div>Allergen: Doxycycline, Reaction: Hives</div>"
                            ),
                            "entry" => [array(
                                "reference" => "AllergyIntolerance/47600e0f-b6b5-4308-84b5-5dec157f7637"
                            )]
                        )
                    ]
                ),
        );
        $Practitioner = array(
                "resource" => array(
                    "resourceType" => "Practitioner",
                    "id" => $uuidPractitioner,
                    "identifier"=> [array(
                        "use"=> "official",
                        "system"=> "urn:oid:nomor_sip",
                        "value"=> "1.2.01.3173.1834/14022/04.16.1"
                    ),
                    array(
                        "use"=> "official",
                        "coding"=> array(
                            "system"=> "http://hl7.org/fhir/v2/0203",
                            "code"=> "NNIDN"
                        ),
                        "value"=> "20009933333-NIK",
                        "assigner"=> array(
                            "display"=> "KEMDAGRI",
                        ),
                    )],
                    "name"=> [array(
                            "use"=> "usual",
                            "text"=> "BAMBANG, DR"
                        )],
                    "telecom"=> [array(
                                "system"=> "phone",
                                "value"=> "0205562431",
                                "use"=> "work"
                                ),
                            array(
                                "system"=> "email",
                                "value"=> "testing@gmail",
                                "use"=> "work"
                            ),
                            array(
                                    "system"=> "fax",
                                    "value"=> "0205662948",
                                    "use"=> "work"
                                )],
                    "address"=> [array(
                                    "use"=> "work",
                                    "line"=> [
                                        "Jakarta"
                                    ],
                                    "city"=> "Amsterdam",
                                    "postalCode"=> "1105 AZ",
                                    "country"=> "NLD"
                                )],
                    "gender"=> "male",
                    "birthDate"=> "1963-07-01"
                ),
        );
        $Patient = array(
                "resource" => array(
                    "resourceType" => "Patient",
                    "id" => $uuidPatient,
                    "identifier"=> [array(
                        "use"=> "usual",
                        "type"=> array(
                            "coding"=> [array(
                                "system"=> "http://hl7.org/fhir/v2/0203",
                                "code"=> "MR",
                            )],
                        ),
                        "value"=> "12345",
                        "assigner"=> array(
                                "system"=> "http://hl7.org/fhir/v2/0203",
                                "display"=> "RS Bhayangkara TK.1 Said Sukanto",
                            ),
                        ),
                    array(
                        "use"=> "official",
                        "type"=> array(
                            "coding"=> [array(
                                "system"=> "http://hl7.org/fhir/v2/0203",
                                "code"=> "MB",
                            )],
                        ),
                        "value"=> "0001094679415",
                        "assigner"=> array(
                                "display"=> "BPJS KESEHATAN",
                            ),
                        ),
                    array(
                        "use"=> "official",
                        "type"=> array(
                            "coding"=> [array(
                                "system"=> "http://hl7.org/fhir/v2/0203",
                                "code"=> "NNIDN",
                            )],
                        ),
                        "value"=> "0001094679415-NIK",
                        "assigner"=> array(
                                "display"=> "KEMDAGRI",
                            ),
                    )],
                    "active"=> true,
                    "name"=> [array(
                                "use"=> "official",
                                "text"=> "BAMBANG"
                            )],
                    "maritalStatus"=> array(
                                "coding"=> [array(
                                    "system"=> "http://hl7.org/fhir/v3/MaritalStatus",
                                    "code"=> "M"
                            )]
                            ),
                    "telecom"=> [array(
                                "system"=> "phone",
                                "value"=> "(03) 5555 6473",
                                "use"=> "work"
                                ),
                            array(
                                "system"=> "phone",
                                "value"=> "(03) 5555 6473",
                                "use"=> "mobile"
                            ),
                            array(
                                    "system"=> "phone",
                                    "value"=> "(03) 5555 6473",
                                    "use"=> "home"
                                )],
                    "gender"=> "male",
                    "birthDate"=> "1974-12-25",
                    "deceasedBoolean"=> false,
                    "address"=> [array(
                                    "line"=> [
                                        "534 Erewhon St"
                                    ],
                                    "city"=> "PleasantVille",
                                    "district"=> "Rainbow",
                                    "state"=> "Vic",
                                    "postalCode"=> "3999",
                                    "text"=> "534 Erewhon St PeasantVille, Rainbow, Vic  3999",
                                    "use"=> "home",
                                    "type"=> "both"
                                )],
                "contact"=> [array(
                                "relationship"=> [array(
                                    "coding"=> [array(
                                        "system"=> "http://hl7.org/fhir/v2/0203",
                                        "code"=> "WIFR",
                                    )],
                                )],
                                "name"=> array(
                                        "use"=> "official",
                                        "text"=> "Ariadne Bor-Jansma",
                                    ),
                                "telecom"=> [array(
                                        "system"=> "phone",
                                        "text"=> "+31201234567",
                                        "use"=> "home"
                                    )],
                                "address"=> [array(
                                            "line"=> [
                                                "534 Erewhon St"
                                            ],
                                            "city"=> "PleasantVille",
                                            "district"=> "Rainbow",
                                            "state"=> "Vic",
                                            "postalCode"=> "3999",
                                            "text"=> "534 Erewhon St PeasantVille, Rainbow, Vic  3999",
                                            "use"=> "home",
                                            "type"=> "both"
                                        )],
                            )],
                                "managingOrganization"=> array(
                                    "reference"=> "Organization/1",
                                    "display"=> "RS Bhayangkara TK.1  Said Sukanto"
                                )
                ),
        );
        $Encounter = array(
                "resource" => array(
                    "resourceType" => "Encounter",
                    "id" => $uuidEncounter,
                    "identifier"=> [array(
                        "system"=> "http://api.bpjs-kesehatan.go.id:8080/Vclaim-rest/SEP/",
                        "value"=> "012931238399488"
                    )],
                    "subject"=> array(
                        "reference"=> "Patient/".$uuidPatient,
                        "display"=> "Testing",
                        "noSep"=> "0903R0040921V006625"
                    ),
                    "class"=> array(
                        "system"=> "http://hl7.org/fhir/v3/ActCode",
                        "code"=> "IMP",
                        "display"=> "inpatient encounter"
                    ),
                    "incomingReferral"=> [array(
                        "identifier"=> [array(
                            "system"=> "nomor_rujukan_bpjs",
                            "value"=> "012931238"
                        ),
                        array(
                            "system"=> "nomor_rujukan_internal_rs",
                            "value"=> "123123"
                        )]
                    )],
                    "reason"=> [array(
                        "coding"=> [array(
                            "code"=> "L50",
                            "display"=> "Urticaria",
                            "system"=> "http://hl7.org/fhir/sid/icd-10"
                        )],
                        "text"=> "Diagnosa masuk: Hives"
                    )],
                    "diagnosis"=> [array(
                        "condition"=> array(
                            "reference"=> "Condition/9283492374",
                            "role"=> array(
                                "coding"=> [array(
                                    "system"=> "http://hl7.org/fhir/diagnosis-role",
                                    "code"=> "DD",
                                    "display"=> "Discharge Diagnosis"
                                )],
                            ),
                        ),
                        "rank"=> 1
                    ),
                    array(
                        "condition"=> array(
                            "reference"=> "Condition/9283492375",
                            "role"=> array(
                                "coding"=> [array(
                                    "system"=> "http://hl7.org/fhir/diagnosis-role",
                                    "code"=> "DD",
                                    "display"=> "Discharge Diagnosis"
                                )],
                            ),
                        ),
                        "rank"=> 2
                    )],
                    "hospitalization"=> array(
                        "dischargeDisposition"=> [array(
                            "coding"=> [array(
                                "code"=> "home",
                                "display"=> "Home",
                                "system"=> "http://hl7.org/fhir/discharge-disposition"
                            )]
                        )]
                    ),
                    "period"=> array(
                        "end"=> "2013-02-01 12:30:02",
                        "start"=> "2013-01-20 12:30:02"
                    ),
                    "status"=> "finished",
                    "text"=> array(
                        "div"=> "<div>Admitted to Orthopedics Service,Middlemore Hospital between Jan 20 and Feb ist 2013 </div>",
                        "status"=> "generated"
                    )
                ),
        );

        $MedicationRequest = array(
                "resource" => array(
                    "resourceType" => "MedicationRequest",
                    "text"=> array(
                        "div"=> "<div>  <p>Theophylline 200mg twice a day</p>   </div>",
                        "status"=> "generated"
                    ),
                    "identifier"=> array(
                        "system"=> "23456",
                        "value"=> "7890",
                    ),
                    "intent"=> "order",
                    "medicationCodeableConcept"=> array(
                        "coding"=> [array(
                            "code"=> "66493003",
                            "system"=> "",
                        )],
                        "text"=> "Theophylline 200mg"
                    ),
                    "dosageInstruction"=> [array(
                        "doseQuantity"=> array(
                            "code"=> "mg",
                            "system"=> "http://unitsofmeasure.org",
                            "unit"=> "mg",
                            "value"=> 1
                        ),
                        "route"=> array(
                            "coding"=> array(
                                "code"=> "394899003",
                                "display"=> "oral administration of treatment",
                                "system"=> "http://snomed.info/sct"
                            ),
                        ),
                        "timing"=> array(
                            "repeat"=> array(
                                "frequency"=> 2,
                                "period"=> 1,
                                "periodUnit"=> "d"
                            ),
                        ),
                        "additionalInstruction"=> array(
                                "text"=> "Take with Food"
                            ),
                    )],
                    "reasonCode"=> [array(
                        "coding"=> [array(
                            "code"=> "L50",
                            "display"=> "Urticaria",
                            "system"=> "http://hl7.org/fhir/sid/icd-10"
                        )],
                        "text"=> "Hives"
                    )],
                    "requester"=> array(
                        "agent"=> array(
                            "display"=> "Peter Practitioner",
                            "reference"> "Practitioner/".$uuidPractitioner
                        ),
                        "onBehalfOf"=> array(
                            "reference"=> "Organization/f002"
                        ),
                    ),
                    "meta"=> array(
                        "lastUpdated"=> "2013-05-05 16:13:03"
                    )
                ),
        );

        $Organization = array(
                "resource" => array(
                    "resourceType" => "Organization",
                    "id"=> $uuidOrganization,
                    "identifier"=> [array(
                        "use"=> "official",
                        "system"=> "urn:oid:bpjs",
                        "value"=> "0000002"
                    ),
                    array(
                        "use"=> "official",
                        "system"=> "urn:oid:bpjs",
                        "value"=> "3173014"
                    )],
                    "type"=>[array(
                        "coding"=>[array(
                            "system"=> "http://hl7.org/fhir/organization-type",
                            "code"=> "prov",
                            "display"=> "Healthcare Provider"
                        )]
                    )],
                    "name"=> "RS Bhayangkara TK.1 Said SUkanto",
                    "alias"=>[
                        "RS Polri"
                    ],
                    "telecom"=> [array(
                        "system"=> "phone",
                        "value"=>"1500-135",
                        "use"=> "work"
                    )],
                    "address"=>[array(
                        "use"=>"work",
                        "text"=> "Jl. Testing",
                        "line"=> [
                            "Jl. Testing Jalan"
                        ],
                        "city"=> "Jakarta Pusat",
                        "state"=> "Daerah Khusus Ibukota Jakarta",
                        "postalCode"=> "10430",
                        "country"=> "IDN"
                    )],
                    "contact"=> [array(
                        "purpose"=>array(
                            "coding"=>[array(
                                "system"=> "http://hl7.org/fhir/contactentity-type",
                                "code"=> "PATINF"
                            )]
                        ),
                        "telecom"=>[array(
                            "system"=> "phone",
                            "value"=> "1500-135"
                        )]
                    )]
                ),
        );

        $Condition = array(
                "resource" => array(
                    "resourceType" => "Condition",
                    "id"=> $uuidCondition,
                    "clinicalStatus"=> "active",
                    "verificationStatus"=> "confirmed",
                    "category"=> [array(
                        "coding"=> [array(
                            "system"=> "http://hl7.org/fhir/condition-category",
                            "code"=> "encounter-diagnosis",
                            "display"=> "Encounter Diagnosis"
                        )]
                    )],
                    "code"=> array(
                        "coding"=>[array(
                            "system"=> "http://hl7.org/fhir/sid/icd-10",
                            "code"=> "A00.1",
                            "display"=> "Cholera"
                        )],
                        "text"=> "Cholera"
                    ),
                    "subject"=> array(
                        "reference"=> "Patient/pid-0012123"
                    ),
                    "onsetDateTime"=> "2012-05-24"
                ),
        );

        $DiagnosticReport = array(
                "resource" => array(
                    "resourceType" => "DiagnosticReport",
                    "id"=> $uuidDiagnosticReport,
                    "meta" =>array(
                        "tag"=>[array(
                            "system"=> "http://example.org/fhir/CodeSystem/workflow-codes",
                            "code"=> "01",
                            "display"=> "Needs Review"
                        )]
                    ),
                    "text"=>array(
                        "status"=> "generated",
                        "div"=>  str_replace(["\r\n","\r","\n","\\r","\\n","\\r\\n"],"<br\>", "<div><h3>CBC Report for Wile. E. COYOTE (MRN: 23453) issued 3-Mar 2011 11:45</h3>\<pre>Test                  Units       Value       Reference Range Haemoglobin           g/L         176         135 - 180 Red Cell Count        x10*12/L    5.9         4.2 - 6.0 Haematocrit                       0.55+       0.38 - 0.52 Mean Cell Volume      fL          99+         80 - 98 Mean Cell Haemoglobin pg          36+         27 - 35 Platelet Count        x10*9/L     444         150 - 450 White Cell Count      x10*9/L     4.6         4.0 - 11.0 Neutrophils           %           20 Neutrophils           x10*9/L     0.9---      2.0 - 7.5 Lymphocytes           %           20 Lymphocytes           x10*9/L     0.9-        1.1 - 4.0 Monocytes             %           20 Monocytes             x10*9/L     0.9         0.2 - 1.0 Eosinophils           %           20\nEosinophils           x10*9/L     0.92++      0.04 - 0.40\nBasophils             %           20\nBasophils             x10*9/L     0.92+++     &lt;0.21\n      </pre>\n\t\t\t<p>Acme Laboratory, Inc signed: Dr Pete Pathologist</p>\n\t\t</div>")
                    ),
                    "contained"=>[array(
                        "resourceType"=> "Observation",
                        "id"=> "r1",
                        "status"=> "final",
                        "code"=> array(
                            "coding"=> [array(
                                "system"=> "http://loinc.org",
                                "code"=> "718-7",
                                "display"=> "Hemoglobin [Mass/volume] in Blood"
                            )],
                            "text"=> "Haemoglobin"
                        ),
                        "subject"=>array(
                            "reference"=>"Patient/pat2"
                        ),
                        "performer"=> [array(
                            "reference"=> "Organization/1832473e-2fe0-452d-abe9-3cdb9879522f",
                            "display"=> "Acme Laboratory, Inc"
                        )],
                        "valueQuantity"=> array(
                            "value"=> 176,
                            "unit"=> "g/L",
                            "system"=> "http://unitsofmeasure.org",
                            "code"=> "g/L"
                        ),
                        "referenceRange"=>[array(
                            "low"=>array(
                                "value"=> 135,
                                "unit"=> "g/L",
                                "system"=> "http://unitsofmeasure.org",
                                "code"=> "g/L"
                            ),
                            "high"=>array(
                                "value"=> 180,
                                "unit"=> "g/L",
                                "system"=> "http://unitsofmeasure.org",
                                "code"=> "g/L"
                            )
                        )]
                    )]
                ),
        );

        $Procedure = array(
                "resource" => array(
                    "resourceType" => "Procedure",
                    "id"=> $uuidProcedure,
                    "text"=>array(
                        "status"=> "generated",
                        "div"=> "<div><p><b>Generated Narrative with Details</b></p><p><b>id</b>: f201</p><p><b>status</b>: completed</p><p><b>code</b>: Chemotherapy <span>(Details : {SNOMED CT code '367336001' = 'Chemotherapy', given as 'Chemotherapy'})</span></p><p><b>subject</b>: <a>Roel</a></p><p><b>context</b>: <a>Roel's encounter on January 28th, 2013</a></p><p><b>performed</b>: 28/01/2013 1:31:00 PM --&gt; 28/01/2013 2:27:00 PM</p><h3>Performers</h3><table><tr><td>-</td><td><b>Role</b></td><td><b>Actor</b></td></tr><tr><td>*</td><td>Medical oncologist <span>(Details : {SNOMED CT code '310512001' = 'Medical oncologist', given as 'Medical oncologist'})</span></td><td><a>Dokter Bronsig</a></td></tr></table><p><b>reasonCode</b>: DiagnosticReport/f201 <span>(Details )</span></p><p><b>bodySite</b>: Sphenoid bone <span>(Details : {SNOMED CT code '272676008' = 'Entire sphenoid bone', given as 'Sphenoid bone'})</span></p><p><b>note</b>: Eerste neo-adjuvante TPF-kuur bij groot proces in sphenoid met intracraniale uitbreiding.</p></div>"
                    ),
                    "status"=> "completed",
                    "code"=> array(
                        "coding"=>[array(
                            "system"=> "http://snomed.info/sct",
                            "code"=> "367336001",
                            "display"=> "Chemotherapy"
                        )]
                    ),
                    "subject"=>array(
                        "reference"=> "Encounter/f202",
                        "display"=> "Roel's encounter on January 28th, 2013"
                    ),
                    "performedPeriod"=>array(
                        "start"=> "2013-01-28T13:31:00+01:00",
                        "end"=> "2013-01-28T14:27:00+01:00"
                    ),
                    "performer"=> [array(
                        "role"=>array(
                            "coding"=>[array(
                                "system"=> "http://snomed.info/sct",
                                "code"=> "310512001",
                                "display"=> "Medical oncologist"
                            )]
                        ),
                        "actor"=>array(
                            "reference"=> "Practitioner/f201",
                            "display"=> "Dokter Bronsig"
                        )
                    )],
                    "reasonCode"=> [array(
                        "text"=> "DiagnosticReport/f201"
                    )],
                    "bodySite"=> [array(
                        "coding"=>[array(
                            "system"=> "http://snomed.info/sct",
                            "code"=> "272676008",
                            "display"=> "Sphenoid bone"
                        )]
                    )],
                    "report"=> [array(
                        "reference"=> "DiagnosticReport/".$uuidDiagnosticReport
                    )],
                    "focalDevice"=> [array(
                        "action"=> array(
                            "coding"=>[array(
                                "system"=> "http://hl7.org/fhir/device-action",
                                "code"=> "implanted"
                            )]
                        ),
                        "manipulated"=>array(
                            "reference"=> "Device/example-pacemaker"
                        )
                    )],
                    "note"=>[array(
                        "text"=> "Eerste neo-adjuvante TPF-kuur bij groot proces in sphenoid met intracraniale uitbreiding."
                    )]
                ),
        );

        $Device = array(
                "resource" => array(
                    "resourceType" => "Device",
                    "id"=> $uuidDevice,
                    "text"=>array(
                        "status"=> "generated",
                        "div"=> "<div><p><b>Generated Narrative with Details</b></p><p><b>id</b>: example-pacemaker</p><p><b>identifier</b>: 1234-5678-90AB-CDEF</p><p><b>type</b>: Performance pace maker for high octane patients <span>(Details : {http://acme.com/devices code 'octane2014' = 'octane2014', given as 'Performance pace maker for high octane patients'})</span></p><p><b>lotNumber</b>: 1234-5678</p><p><b>manufacturer</b>: Acme Devices, Inc</p><p><b>model</b>: PM/Octane 2014</p><p><b>patient</b>: <a>Patient/example</a></p><p><b>contact</b>: ph: ext 4352</p></div>"
                    ),
                    "identifier"=>[array(
                        "system"=> "http://acme.com/devices/pacemakers/octane/serial",
                        "value"=> "1234-5678-90AB-CDEF"
                    )],
                    "type"=>array(
                        "coding"=>[array(
                            "system"=> "http://acme.com/devices",
                            "code"=> "octane2014",
                            "display"=> "Performance pace maker for high octane patients"
                        )]
                    ),
                    "lotNumber"=> "1234-5678",
                    "manufacturer"=> "Acme Devices, Inc",
                    "manufactureDate"=> "2017-01-01 09:00:00",
                    "expirationDate"=> "2021-01-01 09:00:00",
                    "model"=> "PM/Octane 2014",
                    "patient"=> array(
                        "reference"=> "Patient/".$uuidPatient
                    ),
                    "contact"=>[array(
                        "system"=> "phone",
                        "value"=> "ext 4352",
                        "use"=> "work"
                    )]
                ),
        );
        // return $x;
        // die();

        Pasien::where('id', 2)->update(
            [
                'alamatdokterpengirim' => $response
            ]
        );
        

        $result = array(
            "resourceType" => "Bundle",
            "id" => $uuidBundle,
            "meta" => array(
                "lastUpdated" => $now
            ),
            "identifier" => array(
                "system" => "sep",
                "value" => "0903R0040921V006625"
            ),
            "type" => "document",
            "entry" => [$Composition,$Patient,$Encounter,$MedicationRequest,$Practitioner,$Organization,$Condition,$DiagnosticReport,$Procedure,$Device]
        );
        $hasil_encrypt = $this->inacbg_encrypt(json_encode($result), $secretKey);
        return ($hasil_encrypt);
        // return ($result);
        die();
    }

    // Encryption Function
    function inacbg_encrypt($data, $key)
    {
        /// make binary representasion of $key
        $key = hex2bin($key);

        /// check key length, must be 256 bit or 32 bytes
        if (mb_strlen($key, "8bit") !== 32) {
            // throw new Exception("Needs a 256-bit key!");
        }

        /// create initialization vector
        $iv_size = openssl_cipher_iv_length("aes-256-cbc");
        $iv = openssl_random_pseudo_bytes($iv_size); // dengan catatan dibawah

        /// encrypt
        $encrypted = openssl_encrypt($data, "aes-256-cbc", $key, OPENSSL_RAW_DATA, $iv);

        /// create signature, against padding oracle attacks
        $signature = mb_substr(hash_hmac("sha256", $encrypted, $key, true), 0, 10, "8bit");

        /// combine all, encode, and format
        $encoded = chunk_split(base64_encode($signature . $iv . $encrypted));

        return $encoded;
    }

    // Decryption Function
    function inacbg_decrypt($str, $strkey)
    {
        /// make binary representation of $key
        $key = hex2bin($strkey);

        /// check key length, must be 256 bit or 32 bytes
        if (mb_strlen($key, "8bit") !== 32) {
            // throw new Exception("Needs a 256-bit key!");
        }

        /// calculate iv size
        $iv_size = openssl_cipher_iv_length("aes-256-cbc");

        /// breakdown parts
        $decoded = base64_decode($str);
        $signature = mb_substr($decoded, 0, 10, "8bit");
        $iv = mb_substr($decoded, 10, $iv_size, "8bit");
        $encrypted = mb_substr($decoded, $iv_size + 10, NULL, "8bit");

        /// check signature, against padding oracle attack
        $calc_signature = mb_substr(hash_hmac("sha256", $encrypted, $key, true), 0, 10, "8bit");
        if (!$this->inacbg_compare($signature, $calc_signature)) {
            return "SIGNATURE_NOT_MATCH"; /// signature doesn't match
        }

        $decrypted = openssl_decrypt($encrypted, "aes-256-cbc", $key, OPENSSL_RAW_DATA, $iv);

        return $decrypted;
    }

    /// Compare Function
    function inacbg_compare($a, $b)
    {
        /// compare individually to prevent timing attacks

        /// compare length
        if (strlen($a) !== strlen($b)) return false;

        /// compare individual
        $result = 0;
        for ($i = 0; $i < strlen($a); $i++) {
            $result |= ord($a[$i]) ^ ord($b[$i]);
        }

        return $result == 0;
    }
}
