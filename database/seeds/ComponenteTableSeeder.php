
<?php

use Illuminate\Database\Seeder;
use App\Models\Seguridad\Componente;
use Illuminate\Support\Facades\Crypt;

class ComponenteTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $componentes = $this->_getcomponente();

        foreach ($componentes as $componente) {
            $componente['descripcion'] = Crypt::encrypt($componente['descripcion']);
            $componente['tipo'] = Crypt::encrypt($componente['tipo']);
            $componente['estado'] = $componente['estado'];
            $componente['activo'] = Crypt::encrypt('N');
            Componente::create($componente);
        }
    }

    private function _getcomponente()
    {
        return [
            [
                'descripcion'           => 'Home',//1
                'tipo'                  => 'menu',
                'estado'                => 'A'
            ],  
 
            [
                'descripcion'           => 'Subsistema Comercial',//2
                'tipo'                  => 'submenu',
                'estado'                => 'A'
            ],
            [
                'descripcion'           => 'Taller',//3
                'tipo'                  => 'submenu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  2
            ],
            [
                'descripcion'           => 'Vehiculo',//4
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  3
            ],
            [
                'descripcion'           => 'Nuevo',//5
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  4
            ],
            [
                'descripcion'           => 'Código',//6
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  5
            ],
            [
                'descripcion'           => 'Placa*',//7
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  5
            ],
            [
                'descripcion'           => 'Chasis',//8
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  5
            ],
            [
                'descripcion'           => 'Tipo Uso',//9
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  5
            ],
            [
                'descripcion'           => 'Agregar Cliente',//10
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  5
            ],
            [
                'descripcion'           => 'Ver Cliente',//11
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  5
            ],
            [
                'descripcion'           => 'Cod Cliente*',//12
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  5
            ],
            [
                'descripcion'           => 'Nombre Cliente*',//13
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  5
            ],
            [
                'descripcion'           => 'Tipo Vehiculo',//14
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  5
            ],
            [
                'descripcion'           => 'Caracteristicas',//15
                'tipo'                  => 'componente-caracteristicas',
                'estado'                => 'A',
                'idcomponentepadre'     =>  5
            ],
            [
                'descripcion'           => 'Imagen',//16
                'tipo'                  => 'componente-imagen',
                'estado'                => 'A',
                'idcomponentepadre'     =>  5
            ],
            [
                'descripcion'           => 'Descripción',//17
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  5
            ],
            [
                'descripcion'           => 'Notas',//18
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  5
            ],
            [
                'descripcion'           => 'Ver',//19
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  4
            ],
            [
                'descripcion'           => 'Editar',//20
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  4
            ],
            [
                'descripcion'           => 'Eliminar',//21
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  4
            ],
            [
                'descripcion'           => 'Vehiculo Historia',//22
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  3
            ],
            [
                'descripcion'           => 'Nuevo',//23
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  22
            ],
            [
                'descripcion'           => 'Código Cliente',//24
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  23
            ],
            [
                'descripcion'           => 'Nombre Cliente',//25
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  23
            ],
            [
                'descripcion'           => 'Placa*',//26
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  23
            ],
            [
                'descripcion'           => 'Tipo Vehiculo',//27
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  23
            ],
            [
                'descripcion'           => 'Precio',//28
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  23
            ],
            [
                'descripcion'           => 'Km Actual*',//29
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  23
            ],
            [
                'descripcion'           => 'Km Proximo*',//30
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  23
            ],
            [
                'descripcion'           => 'Fecha Proxima',//31
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  23
            ],
            [
                'descripcion'           => 'Diagnostico entrada',//32
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  23
            ],
            [
                'descripcion'           => 'Trabajo realizado',//33
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  23
            ],
            [
                'descripcion'           => 'Notas',//34
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  23
            ],
            [
                'descripcion'           => 'Ver',//35
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  22
            ],
            [
                'descripcion'           => 'Editar',//36
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  22
            ],
            [
                'descripcion'           => 'Eliminar',//37
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  22
            ],
            [
                'descripcion'           => 'Vehiculo Parte',//38
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  3
            ],
            [
                'descripcion'           => 'Nuevo',//39
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  38
            ],
            [
                'descripcion'           => 'Descripción',//40
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  39
            ],
            [
                'descripcion'           => 'Estado',//41
                'tipo'                  => 'componente-check',
                'estado'                => 'A',
                'idcomponentepadre'     =>  39
            ],
            [
                'descripcion'           => 'Editar',//42
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  38
            ],
            [
                'descripcion'           => 'Eliminar',//43
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  38
            ],
            [
                'descripcion'           => 'Vehiculo Caracteristicas',//44
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  3
            ],
            [
                'descripcion'           => 'Nuevo',//45
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  44
            ],
            [
                'descripcion'           => 'Nombre',//46
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  45
            ],
            [
                'descripcion'           => 'Editar',//47
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  44
            ],
            [
                'descripcion'           => 'Eliminar',//48
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  44
            ],            
            [
                'descripcion'           => 'Tipo Vehiculo',//49
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  3
            ],
            [
                'descripcion'           => 'Nuevo',//50
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  49
            ],
            [
                'descripcion'           => 'Reporte',//51
                'tipo'                  => 'submenu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  3
            ],
            [
                'descripcion'           => 'Reporte Vehiculo',//52
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  51
            ],            

            [
                'descripcion'           => 'Almacen',//53
                'tipo'                  => 'submenu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  2
            ],
            [
                'descripcion'           => 'Producto',//54
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  53
            ],
            [
                'descripcion'           => 'Nuevo',//55
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  54
            ],
            [
                'descripcion'           => 'Cód Producto',//56
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  55
            ],
            [
                'descripcion'           => 'Agregar Otros Códigos',//57
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  55
            ],
            [
                'descripcion'           => 'Tipo',//58
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  55
            ],
            [
                'descripcion'           => 'Moneda',//59
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  55
            ],
            [
                'descripcion'           => 'Descripción',//60
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  55
            ],
            [
                'descripcion'           => 'Familia',//61
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  55
            ],
            [
                'descripcion'           => 'Unidad Medida',//62
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  55
            ],
            [
                'descripcion'           => 'Caracteristicas',//63
                'tipo'                  => 'componente-caracteristicas',
                'estado'                => 'A',
                'idcomponentepadre'     =>  55
            ],
            [
                'descripcion'           => 'Imagen',//64
                'tipo'                  => 'componente-imagen',
                'estado'                => 'A',
                'idcomponentepadre'     =>  55
            ],
            [
                'descripcion'           => 'Costo',//65
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  55
            ],
            [
                'descripcion'           => 'Agregar otros Costos',//66
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  55
            ],
            [
                'descripcion'           => 'Precio',//67
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  55
            ],
            [
                'descripcion'           => 'Agregar a Lista Precios',//68
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  55
            ],
            [
                'descripcion'           => 'Stock por Almacen',//69
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  55
            ],
            [
                'descripcion'           => 'Totales Stock',//70
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  55
            ],
            [
                'descripcion'           => 'Palabras claves',//71
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  55
            ],
            [
                'descripcion'           => 'Notas',//72
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  55
            ],
            [
                'descripcion'           => 'Ver',//73
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  54
            ],
            [
                'descripcion'           => 'Editar',//74
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  54
            ],
            [
                'descripcion'           => 'Eliminar',//75
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  54
            ],
            [
                'descripcion'           => 'Ingreso',//76
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  53
            ],
            [
                'descripcion'           => 'Nuevo',//77
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  76
            ],
            [
                'descripcion'           => 'Codigo',//78
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  77
            ],
            [
                'descripcion'           => 'Tipo Ingreso',//79
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  77
            ],
            [
                'descripcion'           => 'Almacen',//80
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  77
            ],
            [
                'descripcion'           => 'Fecha Hora',//81
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  77
            ],
            [
                'descripcion'           => 'Nombre Producto',//82
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  77
            ],
            [
                'descripcion'           => 'Tabla columna Almacen',//83
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  77
            ],
            [
                'descripcion'           => 'Tabla columna Cantidad',//84
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  77
            ],
			[
                'descripcion'           => 'Notas',//85
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  77
            ],
            [
                'descripcion'           => 'Ver',//86
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  76
            ],
            [
                'descripcion'           => 'Editar',//87
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  76
            ],
            [
                'descripcion'           => 'Eliminar',//88
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  76
            ],
            [
                'descripcion'           => 'Salida',//89
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  53
            ],
            [
                'descripcion'           => 'Nuevo',//90
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  89
            ],
            [
                'descripcion'           => 'Codigo',//91
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  90
            ],
            [
                'descripcion'           => 'Tipo Ingreso',//92
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  90
            ],
            [
                'descripcion'           => 'Almacen',//93
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  90
            ],
            [
                'descripcion'           => 'Fecha Hora',//94
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  90
            ],
            [
                'descripcion'           => 'Nombre Producto',//95
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  90
            ],
            [
                'descripcion'           => 'Tabla columna Almacen',//96
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  90
            ],
            [
                'descripcion'           => 'Tabla columna Cantidad',//97
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  90
            ],
			[
                'descripcion'           => 'Notas',//98
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  90
            ],
            [
                'descripcion'           => 'Ver',//99
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  89
            ],
            [
                'descripcion'           => 'Editar',//100
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  89
            ],
            [
                'descripcion'           => 'Eliminar',//101
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  89
            ],

            [
                'descripcion'           => 'Inventario fisico',//102
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  53
            ],
            [
                'descripcion'           => 'Nuevo',//103
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  102
            ], 
            [
                'descripcion'           => 'Fecha',//104
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  103
            ],
            [
                'descripcion'           => 'Almacen',//105
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  103
            ],
            [
                'descripcion'           => 'Descripcion',//106
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  103
            ],
            [
                'descripcion'           => 'Notas',//107
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  103
            ],
            [
                'descripcion'           => 'Agregar todos',//108
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  103
            ],
            [
                'descripcion'           => 'Cargar por familia',//109
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  103
            ],
            [
                'descripcion'           => 'Cargar por producto',//110
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  103
            ],
            [
                'descripcion'           => 'Ver',//111
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  102
            ], 
            [
                'descripcion'           => 'Continuar proceso',//112
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  102
            ],
            [
                'descripcion'           => 'Eliminar',//113
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  102
            ], 
            
            [
                'descripcion'           => 'Lista de Precios',//114    
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  53
            ],
            [
                'descripcion'           => 'Nuevo',//115
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  114
            ],
            [
                'descripcion'           => 'Descripción',//116
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  115
            ],
            [
                'descripcion'           => 'Moneda',//117
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  115
            ],
            [
                'descripcion'           => 'Valor',//118
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  115
            ],
            [
                'descripcion'           => 'Fijo/Porcentaje',//119
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  115
            ],
            [
                'descripcion'           => 'Acción',//120
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  115
            ],
            [
                'descripcion'           => 'Estado',//121
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  115
            ],
            [
                'descripcion'           => 'Fecha inicio',//122
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  115
            ],
            [
                'descripcion'           => 'Fecha fin',//123
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  115
            ],
            [
                'descripcion'           => 'Agregar todos',//124
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  115
            ],
            [
                'descripcion'           => 'Seleccione una lista de precio',//125
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  115
            ],
            [
                'descripcion'           => 'Buscar producto por cod/descripción',//126
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  115
            ],
            [
                'descripcion'           => 'Tabla columna Precio Nuevo',//127
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  115
            ],
            [
                'descripcion'           => 'Notas',//128
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  115
            ],
            [
                'descripcion'           => 'Ver',//129
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  114
            ],
            [
                'descripcion'           => 'Editar',//130
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  114
            ],
            [
                'descripcion'           => 'Eliminar',//131
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  114
            ], 

            [
                'descripcion'           => 'Familia',//132
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  53
            ],
            [
                'descripcion'           => 'Nuevo',//133
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  132
            ], 
            
            [
                'descripcion'           => 'Prod caracteristicas',//134
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  53
            ],
            [
                'descripcion'           => 'Nuevo',//135
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  134
            ], 
            [
                'descripcion'           => 'Descripcion',//136
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  135
            ],
            [
                'descripcion'           => 'Editar',//137
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  134
            ],
            [
                'descripcion'           => 'Eliminar',//138
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  134
            ], 

            [
                'descripcion'           => 'Traspasos',//139    
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  53
            ],
            [
                'descripcion'           => 'Nuevo',//140
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  139
            ],
            [
                'descripcion'           => 'Codigo traspaso',//141
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  140
            ],
            [
                'descripcion'           => 'Tipo Traspaso',//142
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  140
            ],
            [
                'descripcion'           => 'Fecha',//143
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  140
            ],
            [
                'descripcion'           => 'Sale de Almacen',//144
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  140
            ],
            [
                'descripcion'           => 'Entra a Almacen',//145
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  140
            ],
            [
                'descripcion'           => 'Notas',//146
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  140
            ],
            [
                'descripcion'           => 'Cantidad a traspasar',//147
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  140
            ],
            [
                'descripcion'           => 'Ver',//148
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  139
            ],
            [
                'descripcion'           => 'Editar',//149
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  139
            ],
            [
                'descripcion'           => 'Eliminar',//150
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  139
            ],  
            
            [
                'descripcion'           => 'Unidad de Medida',//151
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  53
            ],
            [
                'descripcion'           => 'Nuevo',//152
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  151
            ], 
            [
                'descripcion'           => 'Nombre',//153
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  152
            ],
            [
                'descripcion'           => 'Abreviacion',//154
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  152
            ],
            [
                'descripcion'           => 'Editar',//155
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  151
            ],
            [
                'descripcion'           => 'Eliminar',//156
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  151
            ],            
              
            [
                'descripcion'           => 'Tipo de traspaso',//157
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  53
            ],
            [
                'descripcion'           => 'Nuevo',//158
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  157
            ], 
            [
                'descripcion'           => 'Descripcion',//159
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  158
            ],
		    [
                'descripcion'           => 'Estado',//160
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  158
            ],
            [
                'descripcion'           => 'Editar',//161
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  157
            ],
            [
                'descripcion'           => 'Eliminar',//162
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  157
            ], 
            [
                'descripcion'           => 'Almacenes',//163
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  53
            ],
            [
                'descripcion'           => 'Nuevo',//164
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  163
            ], 
            [
                'descripcion'           => 'Nombre',//165
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  164
            ],
            [
                'descripcion'           => 'Sucursal',//166
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  164
            ],
            [
                'descripcion'           => 'Direccion',//167
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  164
            ],
            [
                'descripcion'           => 'Notas',//168
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  164
            ],
            [
                'descripcion'           => 'Editar',//169
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  163
            ],
            [
                'descripcion'           => 'Eliminar',//170
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  163
            ], 

            [
                'descripcion'           => 'Ubicaciones',//171
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  53
            ],
            [
                'descripcion'           => 'Nuevo',//172
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  171
            ], 
            [
                'descripcion'           => 'Almacen',//173
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  172
            ],
            [
                'descripcion'           => 'Descripcion',//174
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  172
            ],
            [
                'descripcion'           => 'Capacidad',//175
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  172
            ],
            [
                'descripcion'           => 'Notas',//176
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  172
            ],

            [
                'descripcion'           => 'Reporte',//177
                'tipo'                  => 'submenu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  53
            ],
            [
                'descripcion'           => 'Rep de producto',//178
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  177
            ],
            [
                'descripcion'           => 'Ventas',//179
                'tipo'                  => 'submenu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  2
            ],
            [
                'descripcion'           => 'Cliente',//180
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  179
            ],
            [
                'descripcion'           => 'Nuevo',//181
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  180
            ],              
            [
                'descripcion'           => 'Código',//182
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  181
            ],
            [
                'descripcion'           => 'Tipo Cliente',//183
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  181
            ],
            [
                'descripcion'           => 'Tipo Personeria',//184
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  181
            ],
            [
                'descripcion'           => 'Fecha Nacimiento',//185
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  181
            ],
            [
                'descripcion'           => 'Nombres',//186
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  181
            ],
            [
                'descripcion'           => 'Apellidos',//187
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  181
            ],
            [
                'descripcion'           => 'Nit/Ci',//188
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  181
            ],
            [
                'descripcion'           => 'Genero',//189
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  181
            ],
            [
                'descripcion'           => 'Ciudad',//190
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  181
            ],
            [
                'descripcion'           => 'Caracteristicas',//191
                'tipo'                  => 'componente-caracteristicas',
                'estado'                => 'A',
                'idcomponentepadre'     =>  181
            ],
            [
                'descripcion'           => 'Imagen',//192
                'tipo'                  => 'componente-imagen',
                'estado'                => 'A',
                'idcomponentepadre'     =>  181
            ],
            [
                'descripcion'           => 'Contacto',//193
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  181
            ],
            [
                'descripcion'           => 'Notas',//194
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  181
            ],
            [
                'descripcion'           => 'Ver',//195
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  180
            ],
            [
                'descripcion'           => 'Editar',//196
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  180
            ],
            [
                'descripcion'           => 'Eliminar',//197
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  180
            ],
            [
                'descripcion'           => 'Vendedor',//198
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  179
            ],
            [
                'descripcion'           => 'Nuevo',//199
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  198
            ], 
            [
                'descripcion'           => 'Código',//200
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  199
            ], 
            [
                'descripcion'           => 'Comisión venta',//201
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  199
            ], 
            [
                'descripcion'           => 'Ci',//202
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  199
            ], 
            [
                'descripcion'           => 'Fecha Nacimiento',//203
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  199
            ], 
            [
                'descripcion'           => 'Nombres',//204
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  199
            ], 
            [
                'descripcion'           => 'Apellidos',//205
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  199
            ], 
            [
                'descripcion'           => 'Genero',//206
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  199
            ], 
            [
                'descripcion'           => 'Estado',//207
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  199
            ], 
            [
                'descripcion'           => 'Caracteristicas',//208
                'tipo'                  => 'componente-caracteristicas',
                'estado'                => 'A',
                'idcomponentepadre'     =>  199
            ], 
            [
                'descripcion'           => 'Imagen',//209
                'tipo'                  => 'componente-imagen',
                'estado'                => 'A',
                'idcomponentepadre'     =>  199
            ], 
            [
                'descripcion'           => 'Notas',//210
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  199
            ], 
            [
                'descripcion'           => 'Ver',//211
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  198
            ], 
            [
                'descripcion'           => 'Editar',//212
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  198
            ], 
            [
                'descripcion'           => 'Eliminar',//213
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  198
            ], 
            [
                'descripcion'           => 'Venta',//214
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  179
            ],
            [
                'descripcion'           => 'Nuevo',//215
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  214
            ], 
            [
                'descripcion'           => 'Codigo',//216
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Fecha',//217
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Sucursal',//218
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Almacen',//219
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Agregar Cliente',//220
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Ver Cliente',//221
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Codigo Cliente',//222
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Nombre Cliente',//223
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Ci/Nit',//224
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Codigo Vehiculo',//225
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Placa',//226
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Descripción',//227
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Agregar Vendedor',//228
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Ver Vendedor',//229
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Codigo Vendedor',//230
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Nombre Vendedor',//231
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Comisión',//232
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Lista Precios',//233
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Moneda',//234
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Tabla columna CodProducto',//235
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Tabla columna Producto',//236
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Tabla columna Cantidad',//237
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Tabla columna Lista Precios',//238
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Tabla columna PrecioUnit',//239
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Tabla columna %Dcto',//240
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],            
            [
                'descripcion'           => 'Sub Total',//241
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => '% Descuento',//242
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => '% Recargo',//243
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Total',//244
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Observaciones',//245
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Historial Vehiculo',//246
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Partes Vehiculo',//247
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Anticipo',//248
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Ver PlanPago',//249
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Tipo Venta',//250
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Contado',//251
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Credito',//252
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ],
            [
                'descripcion'           => 'Cargar Proforma',//253
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  215
            ], 			
            [
                'descripcion'           => 'Ver',//254
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  214
            ],
            [
                'descripcion'           => 'Eliminar',//255
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  214
            ],

            [
                'descripcion'           => 'Proforma',//256
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  179
            ],
            [
                'descripcion'           => 'Nuevo',//257
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  256
            ], 
            [
                'descripcion'           => 'Codigo',//258
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Fecha',//259
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Sucursal',//260
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Almacen',//261
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Agregar Cliente',//262
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Ver Cliente',//263
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Codigo Cliente',//264
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Nombre Cliente',//265
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Ci/Nit',//266
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Codigo Vehiculo',//267
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Placa',//268
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Descripción',//269
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Agregar Vendedor',//270
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Ver Vendedor',//271
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Codigo Vendedor',//272
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Nombre Vendedor',//273
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Comisión',//274
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Lista Precios',//275
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Moneda',//276
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Tabla columna CodProducto',//277
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Tabla columna Producto',//278
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Tabla columna Cantidad',//279
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Tabla columna Lista Precios',//280
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Tabla columna PrecioUnit',//281
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Tabla columna %Dcto',//282
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],            
            [
                'descripcion'           => 'Sub Total',//283
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => '% Descuento',//284
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => '% Recargo',//285
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Total',//286
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Observaciones',//287
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  257
            ],
            [
                'descripcion'           => 'Ver',//288
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  256
            ],
            [
                'descripcion'           => 'Eliminar',//289
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  256
            ],
            [
                'descripcion'           => 'Cobranza',//290
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  179
            ],
            [
                'descripcion'           => 'Nuevo',//291
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  290
            ], 
            [
                'descripcion'           => 'Codigo',//292
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  291
            ],            
            [
                'descripcion'           => 'Codigo Venta',//293
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  291
            ],   
            [
                'descripcion'           => 'Fecha',//294
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  291
            ],   
            [
                'descripcion'           => 'Codigo Cliente',//295
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  291
            ],   
            [
                'descripcion'           => 'Nombre Cliente',//296
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  291
            ],   
            [
                'descripcion'           => 'Notas',//297
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  291
            ],   
            [
                'descripcion'           => 'Total Venta',//298
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  291
            ],   
            [
                'descripcion'           => 'Pagos acumulados',//299
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  291
            ],   
            [
                'descripcion'           => 'Saldo',//300
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  291
            ],   
            [
                'descripcion'           => 'Cuotas a pagar',//301
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  291
            ],   
            [
                'descripcion'           => 'Total a pagar',//302
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  291
            ],  
	        [
                'descripcion'           => 'Buscar cliente',//303
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  291
            ], 		
			
            [
                'descripcion'           => 'Ver',//304
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  290
            ], 
            [
                'descripcion'           => 'Eliminar',//305
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  290
            ], 
            [
                'descripcion'           => 'Comisión',//306
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  179
            ],
            [
                'descripcion'           => 'Nuevo',//307
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  306
            ],  
            [
                'descripcion'           => 'Descripción*',//308
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  307
            ],
            [
                'descripcion'           => 'Porcentaje*',//309
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  307
            ],
            [
                'descripcion'           => 'Tipo*',//310
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  307
            ],
            [
                'descripcion'           => 'Editar',//311
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  306
            ],
            [
                'descripcion'           => 'Eliminar',//312
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  306
            ],

            [
                'descripcion'           => 'Tipo Cliente',//313
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  179
            ],
            [
                'descripcion'           => 'Nuevo',//314
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  313
            ],  
            [
                'descripcion'           => 'Descripción*',//315
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  314
            ],
            [
                'descripcion'           => 'Editar',//316
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  313
            ],
            [
                'descripcion'           => 'Eliminar',//317
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  313
            ],

            [
                'descripcion'           => 'Flia ciudades',//318
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  179
            ],
            [
                'descripcion'           => 'Nuevo',//319
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  318
            ], 

            [
                'descripcion'           => 'Reportes',//320
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  179
            ],
            [
                'descripcion'           => 'Rep de Ventas',//321
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  320
            ], 
            [
                'descripcion'           => 'Rep de Ventas detallado',//322
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  320
            ], 
            [
                'descripcion'           => 'Rep cuentas por cobrar',//323
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  320
            ], 
            [
                'descripcion'           => 'Rep de cobros realizado',//324
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  320
            ], 
            [
                'descripcion'           => 'Rep Ventas historico veh',//325
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  320
            ], 
            [
                'descripcion'           => 'Rep de cliente',//326
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  320
            ], 
            [
                'descripcion'           => 'Reporte Comisión',//327
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  320
            ], 

            [
                'descripcion'           => 'Reporte Venta por Producto',//328
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  320
            ], 	

            [
                'descripcion'           => 'Compras',//329
                'tipo'                  => 'Submenu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  2
            ],
            [
                'descripcion'           => 'Proveedor',//330
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  329
            ],
            [
                'descripcion'           => 'Nuevo',//331
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  330
            ], 
            [
                'descripcion'           => 'Codigo',//332
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  331
            ],
            [
                'descripcion'           => 'Nombre',//333
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  331
            ],
            [
                'descripcion'           => 'Apellido',//334
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  331
            ],
            [
                'descripcion'           => 'Ci/Nit',//335
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  331
            ],
            [
                'descripcion'           => 'Ciudad',//336
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  331
            ],
            [
                'descripcion'           => 'Estado',//337
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  331
            ],
            [
                'descripcion'           => 'Caracteristicas',//338
                'tipo'                  => 'componente-caracteristicas',
                'estado'                => 'A',
                'idcomponentepadre'     =>  331
            ],
            [
                'descripcion'           => 'Foto',//339
                'tipo'                  => 'componente-imagen',
                'estado'                => 'A',
                'idcomponentepadre'     =>  331
            ],
            [
                'descripcion'           => 'Observaciones',//340
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  331
            ],
            [
                'descripcion'           => 'Notas',//341
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  331
            ],
            [
                'descripcion'           => 'Ver',//342
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  330
            ], 
            [
                'descripcion'           => 'Editar',//343
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  330
            ], 
            [
                'descripcion'           => 'Eliminar',//344
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  330
            ], 
            [
                'descripcion'           => 'Compra',//345
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  329
            ],
            [
                'descripcion'           => 'Nuevo',//346
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  345
            ], 
            [
                'descripcion'           => 'Codigo',//347
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  346
            ],
            [
                'descripcion'           => 'Sucursal',//348
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  346
            ],
            [
                'descripcion'           => 'Almacen',//349
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  346
            ],
            [
                'descripcion'           => 'Moneda',//350
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  346
            ],
            [
                'descripcion'           => 'Agregar Proveedor',//351
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  346
            ],
            [
                'descripcion'           => 'Ver Proveedor',//352
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  346
            ],
            [
                'descripcion'           => 'Codigo Proveedor',//353
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  346
            ],
            [
                'descripcion'           => 'Nombre Proveedor',//354
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  346
            ],
            [
                'descripcion'           => 'Ci/Nit',//355
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  346
            ],
            [
                'descripcion'           => 'Tipo Pago',//356
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  346
            ],
            [
                'descripcion'           => 'Fecha',//357
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  346
            ],
            [
                'descripcion'           => 'Hora',//358
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  346
            ],
            [
                'descripcion'           => 'Tabla columna CodProd',//359
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  346
            ],
            [
                'descripcion'           => 'Tabla columna Producto',//360
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  346
            ],
            [
                'descripcion'           => 'Tabla columna Cantidad',//361
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  346
            ],
            [
                'descripcion'           => 'Tabla columna CostoUnit',//362
                'tipo'                  => 'componente-tabla',
                'estado'                => 'A',
                'idcomponentepadre'     =>  346
            ],
            [
                'descripcion'           => 'Total',//363
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  346
            ],
            [
                'descripcion'           => 'Notas',//364
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  346
            ],
            [
                'descripcion'           => 'Anticipo',//365
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  346
            ],
            [
                'descripcion'           => 'Mostrar PlanPago',//366
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  346
            ],
            [
                'descripcion'           => 'Ver',//367
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  345
            ], 
            [
                'descripcion'           => 'Eliminar',//368
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  345
            ], 
            [
                'descripcion'           => 'Pago',//369
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  329
            ],
            [
                'descripcion'           => 'Nuevo',//370
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  369
            ], 
            [
                'descripcion'           => 'Codigo',//371
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  370
            ],
            [
                'descripcion'           => 'Codigo Compra',//372
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  370
            ],
            [
                'descripcion'           => 'Fecha',//373
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  370
            ],
            [
                'descripcion'           => 'Codigo Proveedor',//374
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  370
            ],
            [
                'descripcion'           => 'Nombre Proveedor',//375
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  370
            ],
            [
                'descripcion'           => 'Total Compra',//376
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  370
            ],
            [
                'descripcion'           => 'Pago Acumulado',//377
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  370
            ],
            [
                'descripcion'           => 'Saldo',//378
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  370
            ],
            [
                'descripcion'           => 'Notas',//379
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  370
            ],
            [
                'descripcion'           => 'Cuotas a pagar',//380
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  370
            ],
            [
                'descripcion'           => 'Total a pagar',//381
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  370
            ],
            [
                'descripcion'           => 'Buscar proveedor',//382
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  370
            ], 			
            [
                'descripcion'           => 'Ver',//383
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  369
            ], 
            [
                'descripcion'           => 'Eliminar',//384
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  369
            ], 
        

            [
                'descripcion'           => 'Subsistema Contable',//385
                'tipo'                  => 'submenu',
                'estado'                => 'A'
            ],
            [
                'descripcion'           => 'Plan de cuentas',//386
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  385
            ],
            [
                'descripcion'           => 'Imprimir PDF',//387
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  386
            ],   
            [
                'descripcion'           => 'Exportar Excel',//388
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  386
            ], 
            [
                'descripcion'           => 'Importar',//389
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  386
            ], 
            [
                'descripcion'           => 'Por defecto',//390
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  386
            ], 
            [
                'descripcion'           => 'Vaciar',//391
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  386
            ], 
            [
                'descripcion'           => 'Comprobante',//392
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  385
            ],
            [
                'descripcion'           => 'Nuevo',//393
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  392
            ],   
            [
                'descripcion'           => 'Ver',//394
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  392
            ], 
            [
                'descripcion'           => 'Editar',//395
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  392
            ], 
            [
                'descripcion'           => 'Eliminar',//396
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  392
            ], 
            [
                'descripcion'           => 'Libro Diario',//397
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  385
            ],
            [
                'descripcion'           => 'Libro Mayor',//398
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  385
            ],   
            [
                'descripcion'           => 'Estado de Resultados',//399
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  385
            ], 
			            [
                'descripcion'           => 'Balance General',//400
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  385
            ], 
			            [
                'descripcion'           => 'Configuraciones',//401
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  385
            ], 
            [
                'descripcion'           => 'Tipo Comprobante',//402
                'tipo'                  => 'submenu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  401
            ],
            [
                'descripcion'           => 'Nuevo',//403
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  402
            ],   
            [
                'descripcion'           => 'Ver',//404
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  402
            ], 
            [
                'descripcion'           => 'Editar',//405
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  402
            ], 
            [
                'descripcion'           => 'Eliminar',//406
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  402
            ], 
            [
                'descripcion'           => 'Tipo Centro Costo',//407
                'tipo'                  => 'submenu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  401
            ],
            [
                'descripcion'           => 'Nuevo',//408
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  407
            ],   
            [
                'descripcion'           => 'Ver',//409
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  407
            ], 
            [
                'descripcion'           => 'Editar',//410
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  407
            ], 
            [
                'descripcion'           => 'Eliminar',//411
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  407
            ], 
			            [
                'descripcion'           => 'Centro Costo',//412
                'tipo'                  => 'submenu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  401
            ],
            [
                'descripcion'           => 'Nuevo',//413
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  412
            ],
			            [
                'descripcion'           => 'Banco',//414
                'tipo'                  => 'submenu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  401
            ],
            [
                'descripcion'           => 'Nuevo',//415
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  414
            ],			
			
            [
                'descripcion'           => 'Gestión y Periodo',//416
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  401
            ],
            [
                'descripcion'           => 'Adicionar Gestión',//417
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  416
            ],   
            [
                'descripcion'           => 'Adicionar Periodo',//418
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  416
            ], 
            [
                'descripcion'           => 'Editar Gestión',//419
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  416
            ], 
            [
                'descripcion'           => 'Editar Periodo',//420
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  416
            ],   
            [
                'descripcion'           => 'Eliminar Gestión',//421
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  416
            ], 
            [
                'descripcion'           => 'Eliminar Periodo',//422
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  416
            ], 
            [
                'descripcion'           => 'Imprimir',//423
                'tipo'                  => 'Botón',
                'estado'                => 'A',
                'idcomponentepadre'     =>  416
            ],
			
            [
                'descripcion'           => 'Configuración',//424
                'tipo'                  => 'submenu',
                'estado'                => 'A'
            ],			
			
			[
                'descripcion'           => 'Tipo Moneda',//425
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  424
            ],
            [
                'descripcion'           => 'Nuevo',//426
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  425
            ], 
            [
                'descripcion'           => 'Editar',//427
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  425
            ],
            [
                'descripcion'           => 'Eliminar',//428
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  425
            ], 

           [
                'descripcion'           => 'Sucursales',//429
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  424
            ],
            [
                'descripcion'           => 'Nuevo',//430
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  429
            ], 
            [
                'descripcion'           => 'Ver',//431
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  429
            ],
            [
                'descripcion'           => 'Editar',//432
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  429
            ],
            [
                'descripcion'           => 'Eliminar',//433
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  429
            ], 
           [
                'descripcion'           => 'Facturación',//434
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  424
            ],
           [
                'descripcion'           => 'Actividad Economica',//435
                'tipo'                  => 'submenu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  434
            ],			
            [
                'descripcion'           => 'Nuevo',//436
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  435
            ], 
            [
                'descripcion'           => 'Editar',//437
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  435
            ],
            [
                'descripcion'           => 'Eliminar',//438
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  435
            ],			
           [
                'descripcion'           => 'Certificacion SIN',//439
                'tipo'                  => 'submenu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  434
            ],			
            [
                'descripcion'           => 'Nuevo',//440
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  439
            ], 
            [
                'descripcion'           => 'Generar Codigo',//441
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  439
            ],			
           [
                'descripcion'           => 'Dosificacion',//442
                'tipo'                  => 'submenu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  434
            ],			
            [
                'descripcion'           => 'Nuevo',//443
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  442
            ], 
            [
                'descripcion'           => 'Ver',//444
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  442
            ],				
            [
                'descripcion'           => 'Editar',//445
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  442
            ],			
					
			[
                'descripcion'           => 'Seguridad',//446
                'tipo'                  => 'submenu',
                'estado'                => 'A'
            ],  
            [
                'descripcion'           => 'Usuario',//447
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  446
            ],  
            [
                'descripcion'           => 'Nuevo',//448
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  447
            ],  
            [
                'descripcion'           => 'Nombre',//449
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  448
            ],
            [
                'descripcion'           => 'Apellido',//450
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  448
            ],
            [
                'descripcion'           => 'Genero',//451
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  448
            ],
            [
                'descripcion'           => 'Foto',//452
                'tipo'                  => 'componente-imagen',
                'estado'                => 'A',
                'idcomponentepadre'     =>  448
            ],
            [
                'descripcion'           => 'Email',//453
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  448
            ],
            [
                'descripcion'           => 'Teléfono',//454
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  448
            ],
            [
                'descripcion'           => 'Usuario',//455
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  448
            ],
            [
                'descripcion'           => 'Contraseña',//456
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  448
            ],
            [
                'descripcion'           => 'Notas',//457
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  448
            ],
            [
                'descripcion'           => 'Ver',//458
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  447
            ],
            [
                'descripcion'           => 'Editar',//459
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  447
            ],
            [
                'descripcion'           => 'Eliminar',//460
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  447
            ],
            [
                'descripcion'           => 'Grupo Usuario',//461
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  446
            ],
            [
                'descripcion'           => 'Nuevo',//462
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  461
            ],
            [
                'descripcion'           => 'Nombre',//463
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  462
            ],
            [
                'descripcion'           => 'Notas',//464
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  462
            ],
            [
                'descripcion'           => 'Editar',//465
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  461
            ],
            [
                'descripcion'           => 'Eliminar',//466
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  461
            ],
            [
                'descripcion'           => 'Activar Modulo',//467
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  446
            ],
            [
                'descripcion'           => 'Asignar Privilegio',//468
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  446
            ],
			[
                'descripcion'           => 'Usuarios Conectados',//469
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  446
            ],
			[
                'descripcion'           => 'Log',//470
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  446
            ],
            [
                'descripcion'           => 'Menu Restaurante',//471
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  2
            ],
            [
                'descripcion'           => 'Config EERR',//472
                'tipo'                  => 'menu',
                'estado'                => 'A',
                'idcomponentepadre'     =>  401
            ],
            [
                'descripcion'           => 'Nuevo',//473
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  472
            ],
            [
                'descripcion'           => 'Editar',//474
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  472
            ],
            [
                'descripcion'           => 'Eliminar',//475
                'tipo'                  => 'boton',
                'estado'                => 'A',
                'idcomponentepadre'     =>  472
            ],

            [
                'descripcion'           => 'Codigo Accion',//476
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  473,
            ],
            [
                'descripcion'           => 'Operacion',//477
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  473,
            ],
            [
                'descripcion'           => 'Formula',//478
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  473,
            ],
            [
                'descripcion'           => 'Valor Porcentual',//479
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  473,
            ],
            [
                'descripcion'           => 'Descripcion',//480
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  473,
            ],
            [
                'descripcion'           => 'Plan de cuenta',//481
                'tipo'                  => 'label+componente',
                'estado'                => 'A',
                'idcomponentepadre'     =>  473,
            ],
        ];
    }
}