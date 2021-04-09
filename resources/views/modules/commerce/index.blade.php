@extends('commerce::layouts.master')

@section('content')
    <h1>Hello World</h1>

    <p>
        This view is loaded from module: {!! config('commerce.name') !!}
    </p>

    <div className="pull-left-content">
         <i className="styleImg fa fa-download">
            <input type="file" id="img-content"/>
         </i>
    </div>
    <div className="pull-right-content">
        <i className="fa fa-search-plus"> </i>
    </div>
                                        
    <img src="/images/inbox.png" alt="none" className="img-content" />
                                        
    <div className="pull-left-content">
       <i className="fa fa-angle-double-left"> </i>
    </div>
    <div className="pull-right-content">
        <i className="fa fa-angle-double-right"> </i>
    </div>
    
@stop
