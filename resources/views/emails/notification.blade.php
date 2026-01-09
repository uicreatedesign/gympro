@component('mail::message')
# {{ $title }}

{{ $message }}

@if(!empty($data))
@foreach($data as $key => $value)
**{{ ucfirst(str_replace('_', ' ', $key)) }}:** {{ $value }}
@endforeach
@endif

Thanks,<br>
{{ config('app.name') }}
@endcomponent
