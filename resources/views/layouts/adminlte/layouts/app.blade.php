<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<!--Begin Header-->
    @include("layouts.adminlte.layouts.partials.html_header")
<!--End Header-->
<body class="hold-transition skin-blue sidebar-mini">
<div class="wrapper">

    <!--Begin Main Header-->
        @include("layouts.adminlte.layouts.partials.main_header")
    <!--End Main Header-->
    <!-- Left side column. contains the logo and sidebar -->

    <!--Begin Main Sidebar-->
        @include("layouts.adminlte.layouts.partials.main_sidebar")
    <!--End Main Sidebar-->
    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
        <!--Begin Content Header-->
            @include("layouts.adminlte.layouts.partials.content_header")
        <!--End Content Header-->

        <!-- Main content -->
        <section class="content">
            @yield("adminlte_main_content")
            <!-- Info boxes -->
        </section>
        <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->

    <!--Begin Footer-->
        @include("layouts.adminlte.layouts.partials.footer")
    <!--End Footer-->

    <!--Begin Control Sidebar-->
        @include("layouts.adminlte.layouts.partials.control_sidebar")
    <!--End Control Sidebar-->

</div>
<!-- ./wrapper -->
<!--Begin Scripts-->
    @include("layouts.adminlte.layouts.partials.scripts")
<!--End Scripts-->
</body>
</html>
