<?php

use App\Models\Contable\Ajuste\CtbDetalleComprobAutomat;
use Illuminate\Database\Seeder;

class CtbDetalleComprobAutomatTableSeeder extends Seeder
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
            CtbDetalleComprobAutomat::create($value);
        }
    }
    public function _getdata() {
        return [
            [
                'clave'       => 'A',
                'descripcion' => 'Banco',
                'valor'       => 0.00,
            ],
        ];
    }
}
