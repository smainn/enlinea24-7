<?php

use Illuminate\Database\Seeder;
use App\Models\Config\ConfigCuenta;
use Illuminate\Support\Facades\Crypt;

class CuentaConfigTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $configs = $this->_getConfigs();
        foreach ($configs as $config) {
            ConfigCuenta::create($config);
        }
    }

    public function _getConfigs() {
        return [
            [
                'fecha' => Crypt::encrypt('2020-01-01'),
                'numniveles' => Crypt::encrypt(5),
                'formato' => Crypt::encrypt('#.#.##.###.####'),
                'estado' => 'A',
            ]
        ];
    }
}
