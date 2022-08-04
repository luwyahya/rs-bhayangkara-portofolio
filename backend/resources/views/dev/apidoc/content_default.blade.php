@extends('dev.layouts.master')

@section('content')
<div class="row">
    <div class="col-md-12">
        <h1>{{ $title }}</h1>
    </div>
</div>

<div class="row">
    @foreach ($requests as $req)
        <div class="col-md-12">
            <h3>{{ $req['subtitle'] }}</h3>
            <p>{{ @$req['description'] }}</p>
            <p><b>Request: </b><br><pre><span class="label label-default">{{ @$req['tipe'] }}</span> {{ @$req['link'] }}</pre></p>

            @if (isset($req['parameter']))
                <p><b>Parameter: </b><br><pre>{{ json_encode($req['parameter']) }}</pre></p>
            @endif

            @if (isset($req['response']))
                <p><b>Response: </b></p>
                @foreach ($req['response'] as $response)
                    <p>
                        <pre>{{ $response['code'] }}
@if (isset($response['data']))
{{ json_encode($response['data']) }}
@endif
@if (isset($response['header']))
Header => {{ ($response['header']) }}
@endif
                        </pre>
                    </p>
                @endforeach
            @endif

            @if (isset($req['error']))
                <p><b>Error: </b><br><pre><span class="label label-default">GET</span> http://polls.apiblueprint.org/questions</pre></p>
            @endif

        </div>
    @endforeach

</div>
@endsection