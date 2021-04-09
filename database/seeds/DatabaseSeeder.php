<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            CiudadTableSeeder::class,
            ClientetipoTableSeeder::class,
            ComisionventaTableSeeder::class,
            ReferenciadecontactoTableSeeder::class,
            SucursalTableSeeder::class,
            TipocontacreditoTableSeeder::class,
            TipotransacventaTableSeeder::class,
            VehiculocaracteristicaTableSeeder::class,
            VehiculopartesTableSeeder::class,
            VehiculotipoTableSeeder::class,
            FamiliaTableSeeder::class,
            UnidadmedidaTableSeeder::class,
            MonedaTableSeeder::class,
            ProduccaracteristicaTableSeeder::class,
            ListaprecioTableSeeder::class,
            AlmacenTableSeeder::class,
            AlmacenubicacionTableSeeder::class,
            ComponenteTableSeeder::class,
            IngresoSalidaTrasTipoTableSeeder::class,
            GrupoUsuarioTableSeeder::class,
            AsignacionTableSeeder::class,
            ConfigFabricaTableSeeder::class,
            ConfigClienteTableSeeder::class,
            CuentaConfigTableSeeder::class,
            UsuarioTableSeeder::class,
            CuentaPlanTipoTableSeeder::class,
            CuentaPlanEjemploTableSeeder::class,
            TipoLibroVentaTableSeeder::class,
        ]);
        
        Model::unguard();
    }
}
