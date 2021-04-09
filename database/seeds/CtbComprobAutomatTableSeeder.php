<?php

use App\Models\Contable\Ajuste\CtbComprobAutomat;
use Illuminate\Database\Seeder;

class CtbComprobAutomatTableSeeder extends Seeder
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
            CtbComprobAutomat::create($value);
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
