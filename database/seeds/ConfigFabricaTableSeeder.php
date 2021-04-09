<?php

use Illuminate\Database\Seeder;
use App\Models\Config\ConfigFabrica;
use Illuminate\Support\Facades\Crypt;

class ConfigFabricaTableSeeder extends Seeder
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
            ConfigFabrica::create($config);
        }
    }

    public function _getConfigs() {
        return [
            [
                'comalmaceninventariocorte' => Crypt::encrypt(true),
                'comalmaceningresoprod' => Crypt::encrypt(true),
                'comalmacensalidaprod' => Crypt::encrypt(true),
                'comalmacenlistadeprecios' => Crypt::encrypt(true),
                'comventasventaalcredito' => Crypt::encrypt(true),
                'comventasventaproforma' => Crypt::encrypt(true),
                'comventascobranza' => Crypt::encrypt(true),
                'comcompras' => Crypt::encrypt(true),
                'comtaller' => Crypt::encrypt(true),
                'comtallervehiculoparte' => Crypt::encrypt(true),
                'comtallervehiculohistoria' => Crypt::encrypt(true),
                'seguridad' => Crypt::encrypt(true)
            ]
        ];
    }
}
