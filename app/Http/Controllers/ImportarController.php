<?php

namespace App\Http\Controllers;

use App\Models\Comercio\Almacen\Almacen;
use App\Models\Comercio\Almacen\ListaPrecio;
use App\Models\Comercio\Almacen\Producto\AlmacenProdDetalle;
use App\Models\Comercio\Almacen\Producto\Familia;
use App\Models\Comercio\Almacen\Producto\ListaPreProducDetalle;
use App\Models\Comercio\Almacen\Producto\Producto;
use App\Models\Comercio\Almacen\Producto\UnidadMedida;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class ImportarController extends Controller
{
    
    public function importarProducto(Request $request) {

        try {

            // return response()->json([
            //     'response' => 1,
            //     'message' => 'exito en importar producto',
            //     'namealmacen' => $request->input('namealmacen')
            // ]);
            
            DB::beginTransaction();

            // $connection = 'enlinea';  // introducir la bd donde se va importar el producto
            $connection = Crypt::decrypt($request->get('x_conexion'));
            $array = [];

            $archivo = $request->file('filearchivo');
            $namealmacen = $request->input('namealmacen');

            // D:\Diego/ALMACEN-CENTRAL.csv

            // $f = fopen( public_path().'/importar/ALM-CENTRAL.csv' , 'r' );  // introducir la direccion del archivo para leer y poblar
            $f = fopen( $archivo , 'r' );  // introducir la direccion del archivo para leer y poblar 
            $linea = fgets($f);

            while (!feof($f)){

                $linea = fgets($f);
                $limite = strlen($linea);
                $posicion = 0;
                $producto = [];

                while ($posicion < $limite) {
                
                    $codproducto = '';
                    while ($linea[$posicion] != ';') {
                        $codproducto .= $linea[$posicion];
                        $posicion++;
                    }
                    $codproducto = utf8_encode($codproducto);
                    array_push($producto, $codproducto);
                
                    $nombreproducto = '';
                    $posicion++;
                    while ($linea[$posicion] != ';') {
                        $nombreproducto .= $linea[$posicion];
                        $posicion++;
                    }
                    $nombreproducto = utf8_encode($nombreproducto);
                    array_push($producto, $nombreproducto);
                
                    $tiposervicio = '';
                    $posicion++;
                    while ($linea[$posicion] != ';') {
                        $tiposervicio .= $linea[$posicion];
                        $posicion++;
                    }
                    $tiposervicio = utf8_encode($tiposervicio);
                    array_push($producto, $tiposervicio);
                
                    $codfamilia = '';
                    $posicion++;
                    while ($linea[$posicion] != ';') {
                        $codfamilia .= $linea[$posicion];
                        $posicion++;
                    }
                    $codfamilia = utf8_encode($codfamilia);
                    array_push($producto, $codfamilia);
                
                    $codunidadmedida = '';
                    $posicion++;
                    while ($linea[$posicion] != ';') {
                        $codunidadmedida .= $linea[$posicion];
                        $posicion++;
                    }
                    $codunidadmedida = utf8_encode($codunidadmedida);
                    array_push($producto, $codunidadmedida);
                
                    $costo = '';
                    $posicion++;
                    while ($linea[$posicion] != ';') {
                        $costo .= $linea[$posicion];
                        $posicion++;
                    }
                    $costo = utf8_encode($costo);
                    array_push($producto, $costo);
                
                    $precio = '';
                    $posicion++;
                    while ($linea[$posicion] != ';') {
                        $precio .= $linea[$posicion];
                        $posicion++;
                    }
                    $precio = utf8_encode($precio);
                    array_push($producto, $precio);
                
                    $stock = '';
                    $posicion++;
                    while ($posicion < $limite) {
                        $stock .= $linea[$posicion];
                        $posicion++;
                    }
                    $stock = utf8_encode($stock);
                    array_push($producto, $stock);

                    $productofamilia = DB::connection($connection)
                        ->table('familia')
                        ->select('idfamilia')
                        ->where([ ['descripcion', trim( $codfamilia )], ['estado', 'A'] ])
                        ->whereNull('deleted_at')
                        ->first();


                        if ( is_null($productofamilia) ) {
                            $productofamilia = new Familia();
                            $productofamilia->descripcion = trim($codfamilia);
                            $productofamilia->setConnection($connection);
                            $productofamilia->save();
                        }
    
                        $unidadmedida = DB::connection($connection)
                            ->table('unidadmedida')
                            ->select('idunidadmedida')
                            ->where([ ['descripcion', trim( $codunidadmedida )] ])
                            ->whereNull('deleted_at')
                            ->first();
    
                        if ( is_null($unidadmedida) ) {
                            $unidadmedida = new UnidadMedida();
                            $unidadmedida->descripcion = trim( $codunidadmedida );
                            $unidadmedida->setConnection($connection);
                            $unidadmedida->save();
                        }
    
                        $codproducto = trim( $codproducto );
    
                        $producto = DB::connection($connection)
                            ->table('producto')
                            ->where([ ['codproducto', $codproducto] ])
                            ->whereNull('deleted_at')
                            ->first();
    
                        $tipoproducto = trim( $tiposervicio ) == '1' ? 'P' : 'S';
    
                        $costo = trim( $costo );
                        $decimal = explode(',', $costo );
    
                        if ( sizeof($decimal) > 1 ) {
                            $costo = $decimal[0] . '.' . $decimal[1];
                        }

                        $precio = trim( $precio );
    
                        $decimal = explode(',', $precio );
    
                        if ( sizeof($decimal) > 1 ) {
                            $precio = $decimal[0] . '.' . $decimal[1];
                        }

                        $stock = trim( $stock );
    
                        if ( is_null($producto) ) {
                            $producto = new Producto();
                            $producto->codproducto = $codproducto;
                            $producto->descripcion = trim($nombreproducto);
                            $producto->tipo = $tipoproducto;
                            $producto->costo = $costo;
                            $producto->precio = $precio;
                            $producto->stock = $stock;
                            $producto->stockminimo = 0;
                            $producto->stockmaximo = 0;
                            $producto->comision = 0;
                            $producto->costodos = 0;
                            $producto->costotres = 0;
                            $producto->costocuatro = 0;
                            $producto->tipocomision = 'V';
                            $producto->fkidfamilia = $productofamilia->idfamilia;
                            $producto->fkidunidadmedida = $unidadmedida->idunidadmedida;
                            $producto->fkidmoneda = 1;
                            $producto->setConnection($connection);
                            $producto->save();

                            $listp = new ListaPrecio();
                            $listp->setConnection($connection);
                            $listaPrecio = $listp->orderBy('idlistaprecio', 'ASC')->first();
                            $listaDetalle = new ListaPreProducDetalle();
                            $listaDetalle->precio = $producto->precio;
                            $listaDetalle->fkidproducto = $producto->idproducto;
                            $listaDetalle->fkidlistaprecio = $listaPrecio->idlistaprecio;
                            $listaDetalle->setConnection($connection);
                            $listaDetalle->save();

                        }else {
                            $obj = new Producto();
                            $obj->setConnection($connection);
                            $producto = $obj->find($producto->idproducto);
                            $producto->stock = $producto->stock * 1 + $stock * 1;
                            $producto->setConnection($connection);
                            $producto->update();
                        }

                        $almacen = DB::connection($connection)
                            ->table('almacen')
                            ->select('idalmacen')
                            ->where([ ['descripcion', $namealmacen] ])
                            ->whereNull('deleted_at')
                            ->first();

                        if ( is_null($almacen) ) {
                            $almacen = new Almacen();
                            $almacen->descripcion = $namealmacen;
                            $almacen->fkidsucursal = 1;
                            $almacen->setConnection($connection);
                            $almacen->save();
                        }

                        $productoalmacen = DB::connection($connection)
                            ->table('almacenproddetalle')
                            ->where([ ['fkidalmacen', $almacen->idalmacen], ['fkidproducto', $producto->idproducto] ])
                            ->whereNull('deleted_at')
                            ->first();

                        if ( is_null($productoalmacen) ) {
                            $productoalmacen = new AlmacenProdDetalle();
                            $productoalmacen->fkidalmacen = $almacen->idalmacen;
                            $productoalmacen->fkidproducto = $producto->idproducto;
                            $productoalmacen->stock = $stock;
                            $productoalmacen->stockminimo = 0;
                            $productoalmacen->stockmaximo = 0;
                            $productoalmacen->setConnection($connection);
                            $productoalmacen->save();
                        }else {
                            $obj = new AlmacenProdDetalle();
                            $obj->setConnection($connection);
                            $productoalmacen = $obj->find($productoalmacen->idalmacenproddetalle);
                            $productoalmacen->stock = $productoalmacen->stock * 1 + $stock * 1;
                            $productoalmacen->setConnection($connection);
                            $productoalmacen->update();
                        }
                    
                    $posicion++;

                }
                array_push($array,  $producto );
            }
            fclose($f);
            
            // while (($data = fgetcsv($f, 0, ';')) !== false) {  // cambiar la separacion de acuerdo al archivo csv ya sea , o ;

            //     if ($data[7] != 'stock-almacen') {
                    
            //         array_push($array, $data);

            //         // $namealmacen = 'ALM-CENTRAL';    /// aqui poner el almacen donde se va llenar los productos

            //         $namealmacen = $request->input('namealmacen');

            //         $productofamilia = DB::connection($connection)
            //             ->table('familia')
            //             ->select('idfamilia')
            //             ->where([ ['descripcion', trim($data[3])], ['estado', 'A'] ])
            //             ->whereNull('deleted_at')
            //             ->first();

            //         if ( is_null($productofamilia) ) {
            //             $productofamilia = new Familia();
            //             $productofamilia->descripcion = trim($data[3]);
            //             $productofamilia->setConnection($connection);
            //             $productofamilia->save();
            //         }

            //         $unidadmedida = DB::connection($connection)
            //             ->table('unidadmedida')
            //             ->select('idunidadmedida')
            //             ->where([ ['descripcion', trim($data[4])] ])
            //             ->whereNull('deleted_at')
            //             ->first();

            //         if ( is_null($unidadmedida) ) {
            //             $unidadmedida = new UnidadMedida();
            //             $unidadmedida->descripcion = trim($data[4]);
            //             $unidadmedida->setConnection($connection);
            //             $unidadmedida->save();
            //         }

            //         $codproducto = trim($data[0]);

            //         $producto = DB::connection($connection)
            //             ->table('producto')
            //             ->where([ ['codproducto', $codproducto] ])
            //             ->whereNull('deleted_at')
            //             ->first();

            //         $tipoproducto = $data[2] == '1' ? 'P' : 'S';

            //         $decimal = explode(',', $data[5]);

            //         if ( sizeof($decimal) > 1 ) {
            //             $data[5] = $decimal[0] . '.' . $decimal[1];
            //         }

            //         $decimal = explode(',', $data[6]);

            //         if ( sizeof($decimal) > 1 ) {
            //             $data[6] = $decimal[0] . '.' . $decimal[1];
            //         }

            //         if ( is_null($producto) ) {
            //             $producto = new Producto();
            //             $producto->codproducto = $codproducto;
            //             $producto->descripcion = trim($data[1]);
            //             $producto->tipo = $tipoproducto;
            //             $producto->costo = $data[5];
            //             $producto->precio = $data[6];
            //             $producto->stock = $data[7];
            //             $producto->stockminimo = 0;
            //             $producto->stockmaximo = 0;
            //             $producto->comision = 0;
            //             $producto->costodos = 0;
            //             $producto->costotres = 0;
            //             $producto->costocuatro = 0;
            //             $producto->tipocomision = 'V';
            //             $producto->fkidfamilia = $productofamilia->idfamilia;
            //             $producto->fkidunidadmedida = $unidadmedida->idunidadmedida;
            //             $producto->fkidmoneda = 1;
            //             $producto->setConnection($connection);
            //             $producto->save();
            //         }else {
            //             $obj = new Producto();
            //             $obj->setConnection($connection);
            //             $producto = $obj->find($producto->idproducto);
            //             $producto->stock = $producto->stock * 1 + $data[7] * 1;
            //             $producto->setConnection($connection);
            //             $producto->update();
            //         }

            //         $almacen = DB::connection($connection)
            //             ->table('almacen')
            //             ->select('idalmacen')
            //             ->where([ ['descripcion', $namealmacen] ])
            //             ->whereNull('deleted_at')
            //             ->first();

            //         if ( is_null($almacen) ) {
            //             $almacen = new Almacen();
            //             $almacen->descripcion = $namealmacen;
            //             $almacen->fkidsucursal = 1;
            //             $almacen->setConnection($connection);
            //             $almacen->save();
            //         }

            //         $productoalmacen = DB::connection($connection)
            //             ->table('almacenproddetalle')
            //             ->where([ ['fkidalmacen', $almacen->idalmacen], ['fkidproducto', $producto->idproducto] ])
            //             ->whereNull('deleted_at')
            //             ->first();

            //         if ( is_null($productoalmacen) ) {
            //             $productoalmacen = new AlmacenProdDetalle();
            //             $productoalmacen->fkidalmacen = $almacen->idalmacen;
            //             $productoalmacen->fkidproducto = $producto->idproducto;
            //             $productoalmacen->stock = $data[7];
            //             $productoalmacen->stockminimo = 0;
            //             $productoalmacen->stockmaximo = 0;
            //             $productoalmacen->setConnection($connection);
            //             $productoalmacen->save();
            //         }else {
            //             $obj = new AlmacenProdDetalle();
            //             $obj->setConnection($connection);
            //             $productoalmacen = $obj->find($productoalmacen->idalmacenproddetalle);
            //             $productoalmacen->stock = $productoalmacen->stock * 1 + $data[7] * 1;
            //             $productoalmacen->setConnection($connection);
            //             $productoalmacen->update();
            //         }     

            //     }
            // }

            DB::commit();
            
            return response()->json([
                'response' => 1,
                'message' => 'exito en importar producto',
                'array' => $array,
            ]);

        } catch (DecryptException $e) {
            DB::rollBack();
            return response()->json([
                'response' => -3,
                'message' => 'Vuelva a iniciar sesion',
            ]);  
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'response' => -1,
                'message' => 'No se puede procesar la solicitud',
                'error' => [
                    'file' => $th->getFile(),
                    'line' => $th->getLine(),
                    'message' => $th->getMessage()
                ]
            ]);
        }
        
    }

    public function download(Request $request) {
        try {
            
            $archivo = $request->input('archivo');

            if ( $archivo == null ) {
                return response()->json([
                    'message'  => 'Ningun archivo recibido',
                ]);
            }

            return response()->download($archivo);

        } catch (DecryptException $e) {
            return response()->json([
                'response'  => -3,
                'message'   => 'Vuelva a iniciar sesion',
                'error'     => [
                    'file'      => $e->getFile(),
                    'line'      => $e->getLine(),
                    'message'   => $e->getMessage()
                ]
            ]); 
        } catch (\Throwable $th) {
            return response()->json([
                'response' => -1,
                'message' => 'Error al procesar la solicitud',
                'error'     => [
                    'file'      => $th->getFile(),
                    'line'      => $th->getLine(),
                    'message'   => $th->getMessage()
                ]
            ]);
        }
    }
}
