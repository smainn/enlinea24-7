<!-- REQUIRED JS SCRIPTS -->
<!-- jQuery 3 -->
<script src="{{asset('templates/admin/adminlte/bower_components/jquery/dist/jquery.min.js')}}"></script>
<!-- Bootstrap 3.3.7 -->
<script src="{{asset('templates/admin/adminlte/bower_components/bootstrap/dist/js/bootstrap.min.js')}}"></script>
<!-- SlimScroll -->
<script src="{{asset('templates/admin/adminlte/bower_components/jquery-slimscroll/jquery.slimscroll.min.js')}}"></script>
<!-- FastClick -->
<script src="{{asset('templates/admin/adminlte/bower_components/fastclick/lib/fastclick.js')}}"></script>
<!-- AdminLTE App -->
<script src="{{asset('templates/admin/adminlte/dist/js/adminlte.min.js')}}"></script>
@yield('adminlte_script')
<!-- AdminLTE for demo purposes -->
<script src="{{asset('templates/admin/adminlte/dist/js/demo.js')}}"></script>
<script>
    $(document).ready(function () {
        $('.sidebar-menu').tree()
    })
</script>
