<?php

use App\Models\Contable\Ajuste\CtbDefiCtasAsientAutom;
use Illuminate\Database\Seeder;

class CtbDefiCtasAsientAutomTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = $this->_getdata();
        foreach ($data as $value) {
            CtbDefiCtasAsientAutom::create($value);
        }
    }
    public function _getdata() {
        return [
            [
                'clave'       => 'A',
                'descripcion' => 'Banco',
                'valor'       => 0.00,
            ],
            [
                'clave'       => 'B',
                'descripcion' => 'Impuesto transacciones',
                'valor'       => 3.00,
            ],
            [
                'clave'       => 'C',
                'descripcion' => 'Descuento sobre ventas',
                'valor'       => 0.00,
            ],
            [
                'clave'       => 'D',
                'descripcion' => 'Ingreso por ventas',
                'valor'       => 0.00,
            ],
            [
                'clave'       => 'E',
                'descripcion' => 'Debito Fiscal impuesto (vta)',
                'valor'       => 13.00,
            ],
            [
                'clave'       => 'F',
                'descripcion' => 'IT x p',
                'valor'       => 3.00,
            ],
            [
                'clave'       => 'G',
                'descripcion' => 'Recargo sobre venta',
                'valor'       => 0.00,
            ],
            [
                'clave'       => 'H',
                'descripcion' => 'Cuentas por cobrar a cliente',
                'valor'       => 0.00,
            ],
            [
                'clave'       => 'I',
                'descripcion' => 'Caja',
                'valor'       => 0.00,
            ],
            [
                'clave'       => 'J',
                'descripcion' => 'Producto cuenta',
                'valor'       => 0.00,
            ],
            [
                'clave'       => 'K',
                'descripcion' => 'Cuentas por pagar a proveedor',
                'valor'       => 0.00,
            ],
            [
                'clave'       => 'L',
                'descripcion' => 'Crédito fiscal impuesto(compra)',
                'valor'       => 13.00,
            ],
        ];
    }
}
