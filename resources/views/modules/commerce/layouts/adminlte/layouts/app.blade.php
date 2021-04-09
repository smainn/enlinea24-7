<!DOCTYPE html>
<!--
This is a starter template page. Use this page to start your new project from
scratch. This page gets rid of all links and provides the needed markup only.
-->
<html lang="en">

@section('htmlheader')
    @include('commerce::layouts.adminlte.layouts.partials.htmlheader')
@show

<body class="skin-blue sidebar-mini">
<div id="app">
    <div class="wrapper">

    @include('commerce::layouts.adminlte.layouts.partials.mainheader')

    @include('commerce::layouts.adminlte.layouts.partials.sidebar')

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">

        @include('commerce::layouts.adminlte.layouts.partials.contentheader')

        <!-- Main content -->
        <section class="content">
            <!-- Your Page Content Here -->
            @yield('main-content')
        </section><!-- /.content -->
    </div><!-- /.content-wrapper -->

    @include('commerce::layouts.adminlte.layouts.partials.controlsidebar')

    @include('commerce::layouts.adminlte.layouts.partials.footer')

</div><!-- ./wrapper -->
</div>
@section('scripts')
    @include('commerce::layouts.adminlte.layouts.partials.scripts')
@show

</body>
</html>
