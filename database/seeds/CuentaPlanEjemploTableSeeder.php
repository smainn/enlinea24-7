<?php

use Illuminate\Database\Seeder;
use App\Models\Contable\CuentaPlanEjemplo;

class CuentaPlanEjemploTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $cuentaplanejemplos = $this->_cuentaplanejemplos();
        foreach ($cuentaplanejemplos as $cuenta) {
            CuentaPlanEjemplo::create($cuenta);
        }
    }
    private function _cuentaplanejemplos()
    {               
        return [
            [
                'codcuenta'                  => '1.0.0.00.000',
                'nombre'                     => 'Activo',
                'estado'                     => 'A',
                'fkidcuentaplanejemplopadre' => null,
                'fkidcuentaplantipo'         => 1,
            ],
            [
                'codcuenta'                  => '1.1.0.00.000',
                'nombre'                     => 'Activo Corriente',
                'estado'                     => 'A',
                'fkidcuentaplanejemplopadre' => 1,
                'fkidcuentaplantipo'         => 1,
            ],
            [
                'codcuenta'                  => '1.1.1.00.000',
                'nombre'                     => 'Disponible',
                'estado'                     => 'A',
                'fkidcuentaplanejemplopadre' => 2,
                'fkidcuentaplantipo'         => 1,
            ],
            [
                'codcuenta'                  => '1.1.1.01.000',
                'nombre'                     => 'Caja',
                'estado'                     => 'A',
                'fkidcuentaplanejemplopadre' => 3,
                'fkidcuentaplantipo'         => 1,
            ],
            [
                'codcuenta'                  => '1.1.1.01.001',
                'nombre'                     => 'Caja M/N',
                'estado'                     => 'A',
                'fkidcuentaplanejemplopadre' => 4,
                'fkidcuentaplantipo'         => 1,
            ],
            [
                'codcuenta'                  => '1.1.1.01.002',
                'nombre'                     => 'Caja M/E',
                'estado'                     => 'A',
                'fkidcuentaplanejemplopadre' => 4,
                'fkidcuentaplantipo'         => 1,
            ],
            [
                'codcuenta'                  => '1.1.1.02.000',
                'nombre'                     => 'Caja Chica',
                'estado'                     => 'A',
                'fkidcuentaplanejemplopadre' => 3,
                'fkidcuentaplantipo'         => 1,
            ],
            [
                'codcuenta'                  => '1.1.1.02.001',
                'nombre'                     => 'Caja Chica M/N',
                'estado'                     => 'A',
                'fkidcuentaplanejemplopadre' => 7,
                'fkidcuentaplantipo'         => 1,
            ],
            [
                'codcuenta'                  => '1.1.1.03.000',
                'nombre'                     => 'Banco',
                'estado'                     => 'A',
                'fkidcuentaplanejemplopadre' => 3,
                'fkidcuentaplantipo'         => 1,
            ],
            [
                'codcuenta'                  => '1.1.1.03.001',
                'nombre'                     => 'Banco M/E',
                'estado'                     => 'A',
                'fkidcuentaplanejemplopadre' => 9,
                'fkidcuentaplantipo'         => 1,
            ],
            [
                'codcuenta'                  => '1.1.1.03.002',
                'nombre'                     => 'Banco M/E',
                'estado'                     => 'A',
                'fkidcuentaplanejemplopadre' => 9,
                'fkidcuentaplantipo'         => 1,
            ],
            [
                'codcuenta'                  => '1.1.2.00.000',
                'nombre'                     => 'Creditos o exigibles',
                'estado'                     => 'A',
                'fkidcuentaplanejemplopadre' => 2,
                'fkidcuentaplantipo'         => 1,
            ],
            [
                'codcuenta'                  => '1.2.0.00.000',
                'nombre'                     => 'Activo No Corriente',
                'estado'                     => 'A',
                'fkidcuentaplanejemplopadre' => 1,
                'fkidcuentaplantipo'         => 1,
            ],
            [
                'codcuenta'                  => '2.0.0.00.000',
                'nombre'                     => 'Pasivo',
                'estado'                     => 'A',
                'fkidcuentaplanejemplopadre' => null,
                'fkidcuentaplantipo'         => 2,
            ],
            [
                'codcuenta'                  => '3.0.0.00.000',
                'nombre'                     => 'Patrimonio',
                'estado'                     => 'A',
                'fkidcuentaplanejemplopadre' => null,
                'fkidcuentaplantipo'         => 3,
            ],
            [
                'codcuenta'                  => '4.0.0.00.000',
                'nombre'                     => 'Ingresos',
                'estado'                     => 'A',
                'fkidcuentaplanejemplopadre' => null,
                'fkidcuentaplantipo'         => 4,
            ],
            [
                'codcuenta'                  => '5.0.0.00.000',
                'nombre'                     => 'Egresos',
                'estado'                     => 'A',
                'fkidcuentaplanejemplopadre' => null,
                'fkidcuentaplantipo'         => 5,
            ],
        ];
    }
}
