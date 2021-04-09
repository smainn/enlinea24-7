<?php

use Illuminate\Database\Seeder;
use App\Models\Config\ConfigCliente;
use Illuminate\Support\Facades\Crypt;

class ConfigClienteTableSeeder extends Seeder
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
            ConfigCliente::create($config);
        }
    }

    public function _getConfigs() {
        return [
            [
                'codigospropios' => Crypt::encrypt(true),
                'otroscodigos' => Crypt::encrypt(true),
                'monedapordefecto' => Crypt::encrypt(1),
                'editprecunitenventa' => Crypt::encrypt(true),
                'editcostoproducto' => Crypt::encrypt(true),
                'masdeuncosto' => Crypt::encrypt(true),
                'masdeunalmacen' => Crypt::encrypt(true),
                'editarstockproducto' => Crypt::encrypt(true),
                'clienteesabogado' => Crypt::encrypt(true),
                'ventaendospasos' => Crypt::encrypt(false),
                'facturarsiempre' => Crypt::encrypt('N'),
                'logo' => Crypt::encrypt('/img/enlinea/logo.png'), 
                'logonombre' => Crypt::encrypt('/img/enlinea/nombre.png'), 
                'logoreporte' => Crypt::encrypt('/img/enlinea/logoreporte.png')
            ]
        ];
    }
}
