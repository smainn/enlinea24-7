import React, { Component } from 'react';
import axios from 'axios';

import {Redirect,Link} from 'react-router-dom';
import { TreeSelect,message,notification ,Icon,Modal,Button,Divider} from 'antd';
import "antd/dist/antd.css";     // for css

const TreeNode = TreeSelect.TreeNode;
const confirm = Modal.confirm;
export default class EditarVenta extends Component{

    constructor(props){
        super(props)
        this.state = {
            codigoVenta:"",
            fechaVenta:"",

            sucursalVenta:[],
            sucursalVentaId:'',

            almacenVenta:[],
            almacenVentaId:'',
            almacenVentaSucursal:[],

            clienteVenta:[],
            clienteDataVenta1:undefined,
            clienteDataVenta2:undefined,

            vendedorVenta:[],
            vendedorDataVentaId:undefined,
            vendedorDataNombre:undefined,

            nitVenta:'',
            monedaVenta:[],
            monedaVentaId:"",
            listaVenta:[],
            listaMonedaVenta:[],
            listaVentaId:'',

            productoVenta:[],
            productoCodVenta:undefined,
            productoNombreVenta:undefined,
            unidadMedVenta:'',

            arrayCodProVenta:[],
            arrayProductoVenta:[],
            arrayUnidadVenta:[],
            arrayTipoPoS:[],
            arrayUnidadVentaAbrev:[],
            arrayCantidadVenta:[],
            arrayListaVenta:[],
            arrayPrecioUnit:[],
            arrayDescuento:[],
            arrayPrecioTotal:[],
            arrayIdAlmacenProdDetalle:[],
            arrayListaPreProdDetalle:[],
            subTotalVenta:0,
            descuentoVenta:0,
            recargoVenta:0,
            totalVenta:0,
            arrayItems:[],
            observacionVenta:"",
            visible:false,

            fkidcomisionventa:'',
            comisionvendedor:'',
            idusuario:"1",
            fkidtipocontacredito:1,
            fkidtipotransacventa:1,
            estado:"V",
            estadoProceso:'E',
            redirect:false,
            tipoContaCredito:[],
            visibleCredito:false,

            anticipo:0,
            saldoApagar:0,
            NumeroCuota:1,
            fechaInicioDePago:"",
            tipoPeriodo:1,
            listaDeCuotas:[]
        }
    }
    getSucursal(){
        console.log("llego aqui sucursal")
        axios.get('/commerce/api/sucursal').then(response => {
            console.log(response.data)
            console.log("bien")
            console.log(response.data.data[0].idsucursal)
            if(response.data.response === 1) {
                this.setState({
                    sucursalVenta:response.data.data,
                    sucursalVentaId:response.data.data[0].idsucursal
                })
                this.actualizarAlmacen(response.data.data[0].idsucursal)
            }
        }).catch(error => {
            console.log(error);
        })
    }
    getAlmacen(){
        console.log("llego aqui almacen")
        axios.get('/commerce/api/almacen').then(response => {
            console.log(response.data)
            console.log("bien")
            if(response.data.response == 1) {
                this.setState({
                    almacenVenta:response.data.data,
                })
               
            }
        }).catch(error => {
            console.log(error);
        })  
    }
    getCliente(){
        console.log("llego aqui cliente")
        axios.get('/commerce/api/cliente').then(response => {
            console.log(response.data)
            console.log("bien cliente")
                this.setState({
                    clienteVenta:response.data,
                })      
            
        }).catch(error => {
            console.log(error);
        })  
    }
    getMoneda(){
        console.log("llego aqui Moneda")
        axios.get('/commerce/api/moneda').then(response => {
            console.log(response.data)
            console.log("bien")
            if(response.data.response == 1) {
                this.setState({
                    monedaVenta:response.data.data,
                    monedaVentaId:response.data.data[0].idmoneda
                })
                this.actualizarListaPrecio(response.data.data[0].idmoneda)
            }
        }).catch(error => {
            console.log(error);
        })  
    }
    actualizarListaPrecio(idmoneda){
        for(let i = 0; i < this.state.listaVenta.length ; i++){  
               console.log(this.state.listaVenta[i].fkidmoneda)
            if(this.state.listaVenta[i].fkidmoneda == idmoneda){
               console.log("entro al if",this.state.listaVenta[i].fkidmoneda)
               this.state.listaMonedaVenta.push(this.state.listaVenta[i]);
               var listaventaidV = this.state.listaMonedaVenta[0].idlistaprecio
               this.setState({
                      listaMonedaVenta:this.state.listaMonedaVenta,
                      listaVentaId:this.state.listaMonedaVenta[0].idlistaprecio
               })
            }
        }
        for(let i = 0;i < this.state.arrayItems.length ; i++){
            this.state.arrayListaVenta[i] = listaventaidV
        }
        this.setState({
            arrayListaVenta:this.state.arrayListaVenta
        })
 
    }
    getListaPrecio(){
        console.log("llego aqui Lista Precio")
        axios.get('/commerce/api/listaprecio').then(response => {
            console.log(response.data)
            console.log("bien")
            if(response.data.response === 1) {
                this.setState({
                    listaVenta:response.data.data,
                })
            }
        }).catch(error => {
            console.log(error);
        })   
    }
    getVendedor(){
        console.log("llego aqui Vendedor")
        axios.get('/commerce/api/vendedor').then(response => {
            console.log(response.data)
            console.log("bien")
            if(response.data.response == 1) {
                this.setState({
                    vendedorVenta:response.data.data,
                })
            }
        }).catch(error => {
            console.log(error);
        })   
    }
    getProducto(idalmacen){
         console.log("llego aqui Producto")
         var body = {
             "idalmacen":idalmacen
         }
         axios.post('/commerce/api/getproducto',body).then(response => {
         console.log("llego aqui Producto")
             console.log(response)
             console.log("bien")
             if(response.data.response == 1) {
                 //this.ClearDetalle()
 
                 this.setState({
                     productoVenta:response.data.data,
        
                 })
                 console.log("actualizando los productos")
                 console.log(this.state.productoCodVenta)
                 console.log(this.state.productoNombreVenta)
                 console.log('precio unit',this.state.arrayPrecioUnit)
                 console.log('precio total',this.state.arrayPrecioTotal)
                 console.log('unidad ',this.state.arrayUnidadVenta)
                 console.log('venta abrev',this.state.arrayUnidadVentaAbrev)
             }
         }).catch(error => {
             console.log(error)
         })
     }
     ClearDetalle(){
         for(let i = 0; i < this.state.arrayUnidadVentaAbrev.length; i++){
             this.state.arrayPrecioUnit[i] = ""
             this.state.arrayPrecioTotal[i] = ""
             this.state.arrayCantidadVenta[i] = 1
             this.state.arrayTipoPoS[i] = ""
             this.state.arrayUnidadVentaAbrev[i] = ""
             this.state.arrayDescuento[i] = 0
             this.state.arrayUnidadVenta[i] = ""
             this.state.arrayIdAlmacenProdDetalle[i] = ""
         }
         this.setState({
             arrayProductoVenta:[],
             arrayCodProVenta:[],
             subTotalVenta:'',
             descuentoVenta:0,
             recargoVenta:0,
             totalVenta:''
         })
     }
     getTipoContCredito(){
         console.log("llego aqui tipo conta credito")
         axios.get('/commerce/api/tipocontacredito').then(response => {
             console.log(response.data)
             console.log("bien")
             if(response.data.response == 1) {
                 this.setState({
                     tipoContaCredito:response.data.data,
                 })
             }
         }).catch(error => {
             console.log(error)
         })
     }
     getComision(fkidcomision){
         console.log("llego aqui Tomar Comision")
         var body = {
             "fkidcomisionventa":fkidcomision
         }
         axios.post('/commerce/api/traercomisionvendedor',body).then(response => {
             console.log(response)
             console.log("bien")
             if(response.data.response == 1) {
                 this.setState({
                     comisionvendedor:response.data.data[0].valor,
                 })
             }
         }).catch(error => {
             console.log(error)
         })
     }
    getVentaId(){
        console.log("llego aqui")
        axios.get('/commerce/api/venta/'+this.props.match.params.id+'/edit').then(response => {
            console.log("123")
            console.log(response.data)
            console.log("llego bien el edit venta")
            if(response.data.response == 1){

                var subtotal = 0
                var total = 0
                var codigo = response.data.data[0].codventa
                var fecha = response.data.data[0].fecha
                var descuentoGeneralVenta = response.data.data[0].descuentoporcentaje
                var recargoGeneralVenta = response.data.data[0].recargoporcentaje
                var sucursal = response.data.data[0].idsucursal 
                var idcliente = response.data.data[0].idcliente 
                var nombreCliente = response.data.data[0].nombrecliente + " " + response.data.data[0].apellidocliente
                var idvendedor = response.data.data[0].idvendedor
                var nit = response.data.data[0].nit
                var nombreVendedor = response.data.data[0].nombrevendedor + " " + response.data.data[0].apellidovendedor
                var idalmacen = response.data.datosDetalle[0].idalmacen
                var idmoneda = response.data.datosDetallePrecio[0].idmoneda
                var idlista = response.data.datosDetallePrecio[0].idlistaprecio 

                for(let i = 0;i < response.data.datosDetalle.length ; i++) {
                    var precioTotal = (parseFloat(response.data.datosDetalle[i].preciounit)-((parseFloat(response.data.datosDetalle[i].preciounit)*parseFloat(response.data.datosDetalle[i].factor_desc_incre))/100)*parseInt(response.data.datosDetalle[i].cantidad))
                    this.state.arrayItems.push(this.state.arrayItems.length + 1)
                    this.state.arrayCodProVenta.push(response.data.datosDetalle[i].idproducto)
                    this.state.arrayProductoVenta.push(response.data.datosDetalle[i].descripcion)
                    this.state.arrayUnidadVentaAbrev.push(response.data.datosDetalle[i].abreviacion)
                    this.state.arrayCantidadVenta.push(response.data.datosDetalle[i].cantidad)
                    this.state.arrayPrecioUnit.push(response.data.datosDetalle[i].preciounit)
                    this.state.arrayDescuento.push(response.data.datosDetalle[i].factor_desc_incre)
                    this.state.arrayPrecioTotal.push(precioTotal)
                    subtotal = subtotal + precioTotal
                    total = subtotal - ((subtotal * descuentoGeneralVenta) / 100) + ((subtotal * recargoGeneralVenta) / 100)
                    this.state.arrayListaVenta[i] = parseInt(response.data.datosDetallePrecio[i].idlistaprecio)
                    this.state.arrayTipoPoS[i]= (response.data.datosDetalle[i].tipo)
                    this.state.arrayIdAlmacenProdDetalle[i] = response.data.datosDetallePrecio[i].fkidalmacenproddetalle
                    this.state.arrayListaPreProdDetalle[i] = response.data.datosDetallePrecio[i].fkidlistapreproducdetalle
                }
                this.setState({
                        arrayItems:this.state.arrayItems,
                        arrayCodProVenta:this.state.arrayCodProVenta,
                        arrayProductoVenta:this.state.arrayProductoVenta,
                        arrayUnidadVentaAbrev:this.state.arrayUnidadVentaAbrev,
                        arrayCantidadVenta:this.state.arrayCantidadVenta,
                        arrayPrecioUnit:this.state.arrayPrecioUnit,
                        arrayDescuento:this.state.arrayDescuento,
                        arrayPrecioTotal:this.state.arrayPrecioTotal,
                        subTotalVenta:subtotal,
                        totalVenta:total,
                        codigoVenta:codigo,
                        fechaVenta:fecha,
                        sucursalVentaId:sucursal,
                        clienteDataVenta1:idcliente,
                        clienteDataVenta2:nombreCliente,
                        vendedorDataVentaId:idvendedor,
                        vendedorDataNombre:nombreVendedor,
                        nitVenta:nit,
                        almacenVentaId:idalmacen,
                        arrayListaVenta:this.state.arrayListaVenta,
                        listaVentaId:idlista,
                        arrayTipoPoS:this.state.arrayTipoPoS
                })

            console.log('arrayListaventa',this.state.arrayListaVenta)
            }


           /* var array = []
            var array1 =[]
            var array2 = []
           for (let i=0 ; i < response.data.data2.length ; i++){
                this.state.items.push(this.state.items.length + 1)
                this.state.referenciaSelect.push(response.data.data2[i].fkidreferenciadecontacto)
                this.state.descripcionReferencia.push(response.data.data2[i].valor)
                this.state.idParaContactarlo.push(response.data.data2[i].idclientecontactarlo)
            }
            if(response.data.data.sexo == 'N'){
                this.setState({
                    habilidar: !this.state.habilidar
                })
            }
            this.setState({
                nombrecliente:response.data.data.nombre,
                apellidocliente:response.data.data.apellido,
                codigocliente:response.data.data.codcliente,
                tipopersoneria:response.data.data.tipopersoneria,
                tipocliente:response.data.data.fkidclientetipo,
                nitcicliente:response.data.data.nit,
                sexocliente:response.data.data.sexo,
                fechanacimientocliente:response.data.data.fechanac,
                ciudadclientedata:response.data.data.fkidciudad,
                contactoCliente:response.data.data.contacto,
                notasCliente:response.data.data.notas,
                fotocliente:response.data.data.foto,
                referenciaSelect:this.state.referenciaSelect,
                descripcionReferencia:this.state.descripcionReferencia,
                items:this.state.items,
                idParaContactarlo:this.state.idParaContactarlo
            })*/
        }).catch(error => {
            console.log(error);
        })
    }
     componentWillMount(){

        this.getAlmacen()
        this.getSucursal()
        this.getCliente()
  
        this.getListaPrecio()
        this.getMoneda()
        this.getVendedor()
        this.getProducto()
  
        //this.inicializarCantidad()
       // this.inicializarDescuento()
        this.getTipoContCredito()

        this.getVentaId()

     }
     inicializarCantidad(){
        for(let i=0 ; i < this.state.arrayItems.length ; i++){
            this.state.arrayCantidadVenta[i] = 1;
            this.setState({
                arrayCantidadVenta:this.state.arrayCantidadVenta
            })
        }
   }
   inicializarDescuento(){
        for(let i=0 ; i < this.state.arrayItems.length ; i++){
            this.state.arrayDescuento[i] = 0;
            this.setState({
                arrayDescuento:this.state.arrayDescuento
            })
        }
   }
   guardarDatos(e){

    e.preventDefault();

   }
   ventaCodigo(e){
       console.log(e.target.value)
    this.setState({
        codigoVenta:e.target.value
    })
   }
   ventaFecha(e){
       var fechaActual = new Date()
       var fechaModi = e.target.value.split('-')
       var fechaLlegada = new Date(parseInt(fechaModi[0]),parseInt(fechaModi[1])-1,parseInt(fechaModi[2]))
        console.log(fechaActual)
        console.log(fechaLlegada)
       if(fechaLlegada.getTime() < fechaActual.getTime()){
            message.error("Fecha Invalida")
       }else{
            console.log(e.target.value)
            this.setState({
                fechaVenta:e.target.value
            })
       }
   
   }
   ventaMoneda(e){
      console.log(e.target.value)
      this.state.listaMonedaVenta.splice(0,this.state.listaMonedaVenta.length)
      this.setState({
             monedaVentaId:e.target.value
      })
      this.ClearDetalle()
      this.actualizarListaPrecio(e.target.value)

   }
   ventaSucursal(e){         
       console.log(e.target.value)
       this.state.almacenVentaSucursal.splice(0,this.state.almacenVentaSucursal.length)
       this.setState({
          sucursalVentaId:e.target.value
       })
      this.actualizarAlmacen(e.target.value)
   }
   actualizarAlmacen(idsucursal){
       console.log("llego a actualizar",idsucursal)
       console.log(this.state.almacenVenta)
       console.log(this.state.almacenVentaSucursal)
       for(let i = 0; i < this.state.almacenVenta.length ; i++){  
              console.log(this.state.almacenVenta[i].fkidsucursal)
           if(this.state.almacenVenta[i].fkidsucursal == idsucursal){
              console.log("entro al if",this.state.almacenVenta[i].fkidsucursal)
              this.state.almacenVentaSucursal.push(this.state.almacenVenta[i]);
              var idalmacenA = this.state.almacenVentaSucursal[0].idalmacen
              this.setState({
                     almacenVentaSucursal:this.state.almacenVentaSucursal,
                     almacenVentaId:this.state.almacenVentaSucursal[0].idalmacen
              })
           }
       }

       this.getProducto(idalmacenA)
       console.log(this.state.almacenVentaSucursal[0].idalmacen)
      
   }
   ventaAlmacen(e){
          console.log(e.target.value)
          this.setState({
                 almacenVentaId:e.target.value
          })
          this.getProducto(e.target.value)
   }
   ventaCliente(value){
          console.log("dataaa")
          console.log(value)
          var array =  value.split(" ")
          this.setState({
            clienteDataVenta1:array[0]
        })
         for(let i = 0; i < this.state.clienteVenta.length; i++){
             if(this.state.clienteVenta[i].idcliente == array[0]){
                 this.setState({
                     clienteDataVenta2:this.state.clienteVenta[i].nombre + " " + this.state.clienteVenta[i].apellido,
                     nitVenta:this.state.clienteVenta[i].nit === null ? "no tiene" : this.state.clienteVenta[i].nit 
                 })
             }
         }
   }
   ventaVendedor(value){
       console.log("dataaa")
       console.log(value)
              var array = String(value).split(" ")
              console.log(array)
              this.setState({
                  vendedorDataVentaId:array[0]
              })
              for(let i = 0; i < this.state.vendedorVenta.length; i++){
                if(this.state.vendedorVenta[i].idvendedor == array[0]){
                    this.setState({
                        vendedorDataNombre:this.state.vendedorVenta[i].nombre + " " + this.state.vendedorVenta[i].apellido,
                        fkidcomisionventa:this.state.vendedorVenta[i].fkidcomisionventa
                    })

                        this.getComision(this.state.vendedorVenta[i].fkidcomisionventa)
                }
            }
   }
   getNombreUnidadMedida(idunidadmedida,index){
        console.log("llego aqui Get Unidad Medida")
        var body = {
            "fkidunidadmedida":idunidadmedida
        }
        axios.post('/commerce/api/traerunidad',body).then(response => {
            console.log(response)
            console.log("bien")

            if(response.data.response == 1) {
               
            this.state.arrayUnidadVentaAbrev[index] = response.data.data[0].abreviacion
                this.setState({
                    arrayUnidadVentaAbrev:this.state.arrayUnidadVentaAbrev,
                })
            }
        }).catch(error => {
            console.log(error)
        })
   }
   ventaProducto(value){
    
    console.log("dataaa")
    console.log(value)
    
           var array = String(value).split(" ")
           console.log(array)
           console.log(array.length)
           var indexArray = array.length-1
           var index = parseInt(array[indexArray])
           console.log("index",index)
           this.state.arrayCodProVenta[index] = array[0]
           this.setState({
               arrayCodProVenta:this.state.arrayCodProVenta
           })
           for(let i = 0; i < this.state.productoVenta.length; i++){
             if(this.state.productoVenta[i].idproducto == array[0]){
                 this.state.arrayProductoVenta[index] = this.state.productoVenta[i].descripcion
                 this.state.arrayUnidadVenta[index] = this.state.productoVenta[i].fkidunidadmedida
                 this.state.arrayIdAlmacenProdDetalle[index] = this.state.productoVenta[i].idalmacenproddetalle
                 this.getNombreUnidadMedida(this.state.productoVenta[i].fkidunidadmedida,index)
                 this.state.arrayTipoPoS[index] = this.state.productoVenta[i].tipo
                 this.setState({
                     arrayIdAlmacenProdDetalle:this.state.arrayIdAlmacenProdDetalle,
                     arrayProductoVenta:this.state.arrayProductoVenta,
                     arrayUnidadVentaAbrev:this.state.arrayUnidadVentaAbrev,
                     arrayTipoPoS:this.state.arrayTipoPoS
                 })
             }
         }
         if(this.state.arrayTipoPoS[index] == "P"){
            this.validarStock(this.state.almacenVentaId,this.state.arrayCodProVenta[index],this.state.arrayCantidadVenta[index]) 
         }
         this.getTraerPrecio(this.state.arrayCodProVenta[index],this.state.arrayListaVenta[index],index)
      
          console.log("datos array cod y pro",this.state.arrayCodProVenta)
         console.log(this.state.arrayProductoVenta)
         console.log(this.state.productoVenta)
   }
   
   ventaCantidad(e){
       console.log(e.target.id)
       console.log(e.target.value)
       let index = e.target.id
       let valor = e.target.value
       console.log("id almacen    ",this.state.almacenVentaId)
       console.log("id producto ", this.state.arrayCodProVenta[index])
       if(typeof this.state.arrayCodProVenta[index] != 'undefined'){
            if(valor > 0){
                if(this.state.arrayTipoPoS[index] == "P"){
                    this.validarStock(this.state.almacenVentaId,this.state.arrayCodProVenta[index],valor,index)
                }else{

                  this.state.arrayCantidadVenta[index] = valor
                  this.setState({
                                arrayCantidadVenta:this.state.arrayCantidadVenta
                  })
                }
          
            }else{
                    message.error("Cantidad Igual o Mayor a 1 Por favor")
            }
       }else{
        message.error("Por Favor Seleccion un Producto")
       }
 
       
      console.log(this.state.arrayCantidadVenta)
   }
   validarStock(idalmacen,idproducto,valor,index){
        console.log("llego aqui Stock")
        var  body =  {
            "idalmacen":idalmacen,
            "idproducto":idproducto
        }
        axios.post('/commerce/api/verifistock',body).then(response => {
            console.log("bien stock")
            console.log(response)  
            if(response.data.response == 1) {
                if(response.data.data.length > 0){
                    let stockSuma = 0
                     for(let i = 0; i < response.data.data.length ; i++){
                        stockSuma = stockSuma + response.data.data[i].stock
                     }
                     if(parseInt(stockSuma) >= parseInt(valor)){
                        this.state.arrayCantidadVenta[index] = valor

                        this.setState({
                            arrayCantidadVenta:this.state.arrayCantidadVenta
                        })  
                     }else{
                         message.error("Stock Agotado")
                     }
                }else{
                         message.error("No existe Producto en un almacen")  
                }
              
            }else{
                message.error("Error Del Servidor")
            }
            this.CalculoPrecioTotal(index)
            this.calculoSubTotal() 
        }).catch(error => {
            console.log(error)
        })
     
   }
   getTraerPrecio(idProducto,idListaPrecio,posicion){
       console.log("asdawdweqweajshdjaskdhgajdahgasajsgh")
       console.log(idProducto,idListaPrecio)
       var body = {
           "idproducto" : parseInt(idProducto),
           "idlistaprecio" : idListaPrecio
       }
       axios.post('/commerce/api/getPrecio',body).then(response => {
        console.log("get precioooo")
         console.log(response)
         if(response.data.response == 1){
             if(response.data.data.length != 0){
                this.state.arrayPrecioUnit [posicion] = response.data.data[0].precio
                this.state.arrayListaPreProdDetalle[posicion] = response.data.data[0].idlistapreproducdetalle
                this.setState({
                    arrayPrecioUnit:this.state.arrayPrecioUnit,
                    arrayListaPreProdDetalle:this.state.arrayListaPreProdDetalle
                })   
                console.log(this.state.arrayPrecioUnit)
             }else{
                 this.state.arrayPrecioUnit [posicion] = 0
                 this.state.arrayListaPreProdDetalle [posicion] = 0
                 this.setState({
                    arrayPrecioUnit:this.state.arrayPrecioUnit,
                    arrayListaPreProdDetalle:this.state.arrayListaPreProdDetalle
                 })
                 message.error("No tiene Precio Definido")
             }
             this.CalculoPrecioTotal(posicion)
             this.calculoSubTotal()
         }
       }).catch (error => {
           console.log(error)
       })
   }
   ventaLista(e){
       let index = e.target.id
       let valor = e.target.value
       console.log(index)
       console.log(valor)
       this.state.arrayListaVenta[index] = parseInt(valor)
       this.setState({
           arrayListaVenta:this.state.arrayListaVenta
       })
       console.log(this.state.arrayListaVenta)
       
       this.getTraerPrecio(this.state.arrayCodProVenta[index],this.state.arrayListaVenta[index],index)

   }
   ventaListaPrincipal(e){

  
    for(let i = 0; i < this.state.arrayItems.length ; i++){
        this.state.arrayListaVenta[i] = e.target.value
    }
    this.setState({
        listaVentaId:e.target.value,
        arrayListaVenta:this.state.arrayListaVenta
    })
    this.ClearDetalle()
   }
   ventaPrecioUnit(e){
       let index = e.target.id
       let valor = parseInt(e.target.value)
        if(typeof this.state.arrayCodProVenta[index] != 'undefined'){
                if(valor > 0){
                    this.state.arrayPrecioUnit[index] = valor
                    this.setState({
                        arrayPrecioUnit:this.state.arrayPrecioUnit
                    })
                }else{
                    this.state.arrayPrecioUnit[index] = 1
                    this.setState({
                        arrayPrecioUnit:this.state.arrayPrecioUnit
                    })
                }
        }else{
            message.error("Por favor seleccione un Producto")
          /*  this.state.arrayPrecioUnit[index] = ""
            this.setState({
                arrayPrecioUnit:this.state.arrayPrecioUnit
            })*/
        }
   }
   ventaDescuento(e){
       let index = e.target.id
       let valor = parseFloat(e.target.value)
       if(typeof this.state.arrayCodProVenta[index] != 'undefined'){
            if( valor >= 0){
                console.log("11231231231")
                this.state.arrayDescuento[index] = valor
                this.setState({
                    arrayDescuento:this.state.arrayDescuento
                })
                console.log(this.state.arrayDescuento)
            }else{
                console.log("asdas")
                this.state.arrayDescuento[index] = 0
                this.setState({
                    arrayDescuento:this.state.arrayDescuento
                })
                message.error("Descuento tiene que ser Mayor e Igual a 0")
            }
            this.CalculoPrecioTotal(index)
            this.calculoSubTotal()
       }else{
           message.error("Por Favor Seleccione unProducto")
       }


   }
   CalculoPrecioTotal(posicion){
       console.log(posicion)
       console.log(this.state.arrayCantidadVenta)
       console.log(this.state.arrayPrecioUnit)
      let PrecioUnidad = parseInt(this.state.arrayPrecioUnit[posicion])
      let Descuento = parseInt( this.state.arrayDescuento[posicion] )
      let cantidad = parseInt(this.state.arrayCantidadVenta[posicion])
      console.log("dataaaaa")
      console.log(PrecioUnidad)
      console.log(Descuento)
      console.log(cantidad)
      let precioTotal = ((PrecioUnidad - (PrecioUnidad * Descuento) / 100) * cantidad)
      this.state.arrayPrecioTotal[posicion] = precioTotal
      this.setState({
          arrayPrecioTotal:this.state.arrayPrecioTotal
      })
       console.log("Precio Total",precioTotal)
   }
   calculoSubTotal(){
       let subTotal = 0
         for(let i = 0; i < this.state.arrayPrecioTotal.length ; i++){
            if(typeof this.state.arrayPrecioTotal[i] !== 'undefined') 
                subTotal = subTotal + parseFloat(this.state.arrayPrecioTotal[i])
             }
         this.setState({
             subTotalVenta:subTotal
         })
         this.CalculoTotal(1,subTotal)
   }
   ventaDescuentoTotal(e){
        let valor = parseFloat(e.target.value)
        console.log("venta Descuento   ",valor)
        if(valor >= 0 ){
            this.setState({
                descuentoVenta:e.target.value
            })

        this.CalculoTotal(0,valor)
        }else{
            this.setState({
                descuentoVenta:0
            })
        
        this.CalculoTotal(0,0)
        }    
   }
   ventaRecargoTotal(e){
        let valor = parseInt(e.target.value)
        console.log("venta Recargo   ",valor)
        if(valor >= 0){
            this.setState({
                recargoVenta:e.target.value
            })

        this.CalculoTotal(2,valor)
        }else{
            this.setState({
                recargoVenta:0
            })

        this.CalculoTotal(2,0)
        }
   }
   CalculoTotal(index,valor){
       if(index == 0){
            console.log("0")
            let subTotal = this.state.subTotalVenta
            let descuentoGeneral = this.state.descuentoVenta
            let recargo = this.state.recargoVenta
            console.log("datos total 123")
            console.log(descuentoGeneral)
            console.log(recargo)   
            console.log(subTotal)
            console.log("totales")
            var total = subTotal - ((subTotal * valor) / 100) + ((subTotal * recargo) / 100)

            console.log(total)
       }else if(index == 1){
            console.log("1")
            let subTotal = this.state.subTotalVenta
            let descuentoGeneral = this.state.descuentoVenta
            let recargo = this.state.recargoVenta
            console.log("datos total 123")
            console.log(descuentoGeneral)
            console.log(recargo)   
            console.log(subTotal)
            console.log("totales")
            var total = valor - ((valor * descuentoGeneral) / 100) + ((valor * recargo) / 100)

            console.log(total)
       }else if(index == 2){
            console.log("2")
            let subTotal = this.state.subTotalVenta
            let descuentoGeneral = this.state.descuentoVenta
            let recargo = this.state.recargoVenta
            console.log("datos total 123")
            console.log(descuentoGeneral)
            console.log(recargo)   
            console.log(subTotal)
            
            console.log("totales")
            var total = subTotal - ((subTotal * descuentoGeneral) / 100) + ((subTotal * valor) / 100)
            console.log(total)
       }
     this.setState({
         totalVenta:total,
         saldoApagar:total
     })
   }
   ventaObservacion(e){
       this.setState({
           observacionVenta:e.target.value
       })
   }

   pagar(){
       this.setState({
           visible:!this.state.visible
       })
   }
   handleCancel(){
       this.setState({
           visible:!this.state.visible
       })
   }
   handleCancelcredito(){
       this.setState({
           visibleCredito:!this.state.visibleCredito
       })
   }
   guardarVenta(condicion){
    console.log("condicion   ",condicion)
    if(String(this.state.codigoVenta).length > 0 && String(this.state.fechaVenta).length > 0  && String(this.state.comisionvendedor).length > 0 
        && String(this.state.idusuario).length > 0 && String(this.state.estado).length > 0 && String(this.state.estadoProceso).length > 0 
        && String(this.state.sucursalVentaId).length > 0 && String(this.state.clienteDataVenta1).length > 0 && String(this.state.vendedorDataVentaId).length > 0 
        && String(this.state.fkidtipocontacredito).length > 0 && String(this.state.fkidtipotransacventa).length > 0){
            var hora = new Date()
            var arrayCantidad = []
            var arrayPrecio = []
            var arrayDescuento = []
            var ventadetalle = []
            for(let i=0;i < this.state.arrayCodProVenta.length ; i++){
                console.log('is nan',isNaN(this.state.arrayPrecioUnit[i]))
                if(parseInt(this.state.arrayPrecioUnit[i]) !== 0 && !isNaN(this.state.arrayPrecioUnit[i])){
                    var detalle = {
                        "cantidad":parseInt(this.state.arrayCantidadVenta[i]),
                        "precioUnit":parseFloat(this.state.arrayPrecioUnit[i]),
                        "factor":parseFloat(this.state.arrayDescuento[i]),
                        "tipo":this.state.arrayTipoPoS[i],
                        "fkidalmacenprodetalle":parseInt(this.state.arrayIdAlmacenProdDetalle[i]),
                        "fkidlistaproddetalle":parseInt(this.state.arrayListaPreProdDetalle[i]),
                        "idProducto":parseInt(this.state.arrayCodProVenta)
                    }
                    ventadetalle.push(detalle)
                }
            }
            console.log(ventadetalle)
            console.log(this.state.arrayCodProVenta)
            var body = {
                "codigoventa":this.state.codigoVenta,
                "fechaventa":this.state.fechaVenta,
                "estado":'V',
                "recargoVenta":isNaN(this.state.recargoVenta) ? 0 : parseFloat(this.state.recargoVenta),
                "descuentoVenta": isNaN(this.state.descuentoVenta) ? 0 : parseFloat(this.state.descuentoVenta),
                "nota":this.state.observacionVenta,
                "estadoProceso":'E',
                "fechaHoraFin":null,
                "idusuario":1,
                "fkidsucursal":this.state.sucursalVentaId,
                "fkidcliente":this.state.clienteDataVenta1,
                "fkidvendedor":this.state.vendedorDataVentaId,
                "fkidvehiculo":null,
                "fkidtipocontacredito":1,
                "fkidtipotransacventa":1,
                "hora":hora.getHours()+":"+hora.getMinutes()+":"+hora.getSeconds(),
                "comision":parseInt(this.state.comisionvendedor),
                "arrayidproducto":JSON.stringify(this.state.arrayCodProVenta),
                "arraycantidad":JSON.stringify(this.state.arrayCantidadVenta),
                "arraypreciounit":JSON.stringify(this.state.arrayPrecioUnit),
                "arraydescuento":JSON.stringify(this.state.arrayDescuento) ,
                "arrayIdAlmacenProdDetalle":JSON.stringify(this.state.arrayIdAlmacenProdDetalle),
                "arrayListaPreProdDetalle": JSON.stringify(this.state.arrayListaPreProdDetalle),
                "arrayventadetalle":JSON.stringify(ventadetalle),
                "condicion":condicion,
                "anticipo":null,
           }
           var body2 ={}
           if(condicion == "credito"){
                var sumaPlan = 0
                for(let i = 0; i < this.state.listaDeCuotas.length; i++){
                        sumaPlan = sumaPlan + parseFloat(this.state.listaDeCuotas[i].montoPagar)
                }
                console.log(sumaPlan)
                console.log(this.state.saldoApagar)
                if(sumaPlan == this.state.saldoApagar){
                     body2 = {
                        "planPago":JSON.stringify(this.state.listaDeCuotas),
                        "anticipo":parseFloat(this.state.anticipo),
                        "estadoProceso":"F",
                        "estadoPlan":'I',
                        "montoPagado":0   
                    } 
               
                    message.error("Plan de Pago Correcto")
                }else{
                    message.error("plan de Pago Incorrecto")
                }
           }
           var bodyActual = Object.assign(body,body2)
           console.log("BodyActual",bodyActual)
           console.log("llego aqui a Guardar la venta")
           axios.post('/commerce/api/venta',body).then(response => {
               console.log(response)
               console.log("bien")
               if(response.data.response == 1) {
                   this.setState({
                       redirect:!this.state.redirect
                   })
                   message.success("se inserto correctamente");
               }
           }).catch(error => {
               console.log(error)
           })
            console.log("datos enviados al server.php")
            console.log(body)
        }else{
      
            message.error("datos tienen que estar llenos")
        }
 
   }
   pagarCredito(){

        this.setState({
            visible:false,
            visibleCredito:!this.state.visibleCredito
        })


   }
   modificarFechaPlan(e){
       console.log(e.target.value)
       var fecha = e.target.value
       var index = e.target.id
       console.log(e.target.id)
       console.log(this.state.listaDeCuotas)
       var datos = this.state.listaDeCuotas[index]
       console.log(datos)
       var fechaModi = fecha.split('-')
       //var fechaFormato = String(fechaModi[2]+"/"+fechaModi[1]+"/"+fechaModi[0])
       var fechaActual = new Date(parseInt(fechaModi[0]),parseInt(fechaModi[1])-1,parseInt(fechaModi[2]))
       var fechaVenta = this.state.fechaVenta.split('-')
       //var fechaVentaFormato = String(fechaVenta[2]+"/"+fechaVenta[1]+"/"+fechaVenta[0])
       var fechaVentaComparar =  new Date(parseInt(fechaVenta[0]),parseInt(fechaVenta[1])-1,parseInt(fechaVenta[2]))
       console.log(fechaActual)
       console.log(fechaVentaComparar)
       if(fechaActual.getTime() >= fechaVentaComparar.getTime()){
           console.log("es mayor la fecha")
           this.state.listaDeCuotas[index].FechaApagar = fecha
           this.setState({
               listaDeCuotas:this.state.listaDeCuotas
           })
           console.log(this.state.listaDeCuotas)
       }else{
           console.log("no es mayor")
       }
      // fechaActual.setDate(fechaActual.getDate()+(parseInt(this.state.tipoPeriodo) * i))

   }
   modificarMonto(e){
       console.log(e.target.value)
       var monto = e.target.value
       var index = parseInt(e.target.id)
       var saldoAnterior = this.state.listaDeCuotas[index-1].saldo
       this.state.listaDeCuotas[index].montoPagar = monto
       this.state.listaDeCuotas[index].saldo = saldoAnterior - monto 
       console.log("index ",index)
       console.log("longitud",this.state.listaDeCuotas.length )
       for (let i = index+1; i < this.state.listaDeCuotas.length ; i++){
            this.state.listaDeCuotas[i].saldo = parseFloat(this.state.listaDeCuotas[i-1].saldo) - parseFloat(this.state.listaDeCuotas[i].montoPagar)
            console.log("123",this.state.listaDeCuotas[i].saldo)
        }

       this.setState({
           listaDeCuotas:this.state.listaDeCuotas
       })
       console.log(this.state.listaDeCuotas)
   }
   PlandePago(){
       console.log("lista de cuotas ",this.state.listaDeCuotas)
      if(this.state.listaDeCuotas.length > 0 ){
          return (
          
              this.state.listaDeCuotas.map((l,i)=>(
              <div>
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderTable"> 
                        <label>{l.Nro}</label>
                    </div>
                    <div className="col-lg-3-content col-md-2-content col-sm-12-content col-xs-12-content borderTable"> 
                        <label>{l.descripcion}</label>
                    </div>
                    <div className="col-lg-3-content col-md-2-content col-sm-12-content col-xs-12-content borderTable"> 
                        <input className='form-control-content reinicio-padding' id={i} type='date' value={l.FechaApagar} onChange={this.modificarFechaPlan.bind(this)}></input>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderTable"> 
                        <input className='form-control-content reinicio-padding' id={i} type='text' value={l.montoPagar} onChange={this.modificarMonto.bind(this)} ></input>
                    </div>
                    <div className="col-lg-2-content col-md-1-content col-sm-12-content col-xs-12-content borderTable">
                         <label>{Math.round(l.saldo)}</label>
                    </div>
              </div>
                
              ))
          )
      }else{
          return null
      }
   }
   saldoPagar(anticipo){
       if(anticipo == ''){

        var saldo = this.state.totalVenta - 0
       }else if(anticipo < 0){
        var saldo = this.state.totalVenta - 0
       }else if(anticipo == '-'){
           
        var saldo = this.state.totalVenta - 0
       }else{
        var saldo = this.state.totalVenta - parseInt(anticipo)
       }  
       console.log("saldo a pagar ",saldo)
       this.setState({
            saldoApagar:saldo
       })
   }
   anticipoPago(e){
       var valor = e.target.value
       if(valor == ''){
        this.setState({
                anticipo:e.target.value
        })
       }else if(valor < 0){

        message.error("No Puede Ingresar Numeros Negativos")
           this.setState({
                anticipo:0
           })
       }else{
        this.setState({
                anticipo:e.target.value
        })
       }
      
       this.saldoPagar(e.target.value)
   }
   numeroCuotaPlan(e){
        this.setState({
            NumeroCuota:e.target.value,
           
        })

   }
   generarPlanPago(){

    this.calculoDePlanPago()
   }
   calculoDePlanPago(){
           this.state.listaDeCuotas.splice(0,this.state.listaDeCuotas.length)
           for (let i=0 ; i < this.state.NumeroCuota ; i++){
               console.log(this.state.fechaInicioDePago)
                var arrayfecha = this.state.fechaInicioDePago.split('-')
                var fechaFormato = String(arrayfecha[2]+"/"+arrayfecha[1]+"/"+arrayfecha[0])
                console.log("fecha da te",fechaFormato)
                var fecha = new Date(parseInt(arrayfecha[0]),parseInt(arrayfecha[1])-1,parseInt(arrayfecha[2]))
                console.log("fe ant ",fecha)
                fecha.setDate(fecha.getDate()+(parseInt(this.state.tipoPeriodo) * i))
                console.log('fecha a pagar inicio ',fecha)
                var mes = fecha.getMonth() > 9 ? "" : "0"
                var dia = fecha.getDate() > 9 ? "" : "0"
                var fechaAmostrar = fecha.getFullYear()+"-"+mes+(fecha.getMonth()+1)+"-"+dia+fecha.getDate()

                console.log("mostrador fecha ",fechaAmostrar)


               let cuotas = {
                   "Nro":i+1,
                   "descripcion":"Cuota Nro."+" "+(i+1),
                   "FechaApagar": fechaAmostrar,
                   "montoPagar":Math.round((this.state.saldoApagar/this.state.NumeroCuota)),
                   "saldo":(this.state.saldoApagar-((this.state.saldoApagar/this.state.NumeroCuota)*(i+1)))
               }
               this.state.listaDeCuotas.push(cuotas)
           }
           this.setState({
               listaDeCuotas:this.state.listaDeCuotas
           })
       

   }
   fechaPagoInicio(e){
       console.log(e.target)
        this.setState({
            fechaInicioDePago :e.target.value 
        })
   }
   tipoPeriodo(e){
        this.setState({
            tipoPeriodo:e.target.value
        })
   }
   cabeceraPlan(){
       if(this.state.listaDeCuotas.length > 0){
           return (
               <div >
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderTable form-planpagocabezera "> 
                        <label className="label-group-content-nwe label-plan-pago">Nro Cuotas</label>  
                    </div>
                    <div className="col-lg-3-content col-md-2-content col-sm-12-content col-xs-12-content borderTable form-planpagocabezera"> 
                        <label className="label-group-content-nwe label-plan-pago ">Descripcion</label>   
                    </div>
                    <div className="col-lg-3-content col-md-2-content col-sm-12-content col-xs-12-content borderTable form-planpagocabezera"> 
                        <label className="label-group-content-nwe label-plan-pago">Fecha a Pagar</label>
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderTable form-planpagocabezera"> 
                        <label className="label-group-content-nwe label-plan-pago">Monto a Pagar</label>  
                    </div>
                    <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderTable form-planpagocabezera"> 
                        <label className="label-group-content-nwe label-plan-pago">Saldo</label>    
                    </div>
               </div>
           )
       }
   }
   guardarPlanCredito(){
       var sumaPlan = 0
        for(let i = 0; i < this.state.listaDeCuotas.length; i++){
                sumaPlan = sumaPlan + parseFloat(this.state.listaDeCuotas[i].montoPagar)
        }
        console.log(sumaPlan)
        console.log(this.state.saldoApagar)
        if(sumaPlan == this.state.saldoApagar){

            message.error("Plan de Pago Correcto")
        }else{
            message.error("plan de Pago Incorrecto")
        }

   }
   cancelarPlanCredito(){
       message.error("Cancelo de Plan")
   }
   footerPlanPago(){
       if(this.state.listaDeCuotas.length > 0){
            return(
            <div className="form-group-content">
                    <div className="text-center-content">
                            <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                            
                            </div>       
                            <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <button type="button" className="btn-content btn-danger-content" onClick={this.guardarVenta.bind(this,"credito")}>
                                        Guardar
                                </button>
                            </div>
                            <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                <button type="button" className="btn-content btn-success-content" onClick={this.cancelarPlanCredito.bind(this)}>
                                        Cancelar
                                </button>
                            </div>
                            <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                            
                            </div>   
                                
                                
                    </div>
            </div>
            )
       }else{
            return null
       }
   }
   addRowDetalle(){
        var newRow = this.state.arrayItems.concat(this.state.arrayItems.length + 1);
        this.state.arrayCantidadVenta.push(1);
        this.state.arrayDescuento.push(0)
        this.state.arrayListaVenta.push(this.state.listaVentaId)
        this.setState({
            arrayItems: newRow,
            arrayCantidadVenta:this.state.arrayCantidadVenta,
            arrayDescuento:this.state.arrayDescuento,
            arrayListaVenta:this.state.arrayListaVenta
        });
   }
   removeRowDetalle(i){
            var newItem = this.state.arrayItems;
            newItem.splice(i, 1);
            console.log("aaaaaaaaaaaa")
            this.state.arrayPrecioUnit.splice(i,1)
            this.state.arrayPrecioTotal.splice(i,1)
            this.state.arrayCantidadVenta.splice(i,1)
            this.state.arrayTipoPoS.splice(i,1)
            this.state.arrayUnidadVentaAbrev.splice(i,1)
            this.state.arrayDescuento.splice(i,1)
            this.state.arrayUnidadVenta.splice(i,1)
            this.state.arrayIdAlmacenProdDetalle.splice(i,1)
            this.state.arrayCodProVenta.splice(i,1);
            this.state.arrayListaPreProdDetalle.splice(i,1)
            this.state.arrayProductoVenta.splice(i,1)
            this.state.arrayListaVenta.splice(i,1)
            console.log("asdasdsadasdsad")
            this.setState({
                arrayItems:newItem,
                arrayPrecioUnit:this.state.arrayPrecioUnit,
                arrayPrecioTotal:this.state.arrayPrecioTotal,
                arrayCantidadVenta:this.state.arrayCantidadVenta,
                arrayTipoPoS:this.state.arrayTipoPoS,
                arrayUnidadVentaAbrev:this.state.arrayUnidadVentaAbrev,
                arrayDescuento:this.state.arrayDescuento,
                arrayUnidadVenta:this.state.arrayUnidadVenta,
                arrayIdAlmacenProdDetalle:this.state.arrayIdAlmacenProdDetalle,
                arrayCodProVenta:this.state.arrayCodProVenta,
                arrayProductoVenta:this.state.arrayProductoVenta,
                arrayListaVenta:this.state.arrayListaVenta,
                arrayListaPreProdDetalle:this.state.arrayListaPreProdDetalle
            });
            console.log(this.state.arrayPrecioUnit)
   }
    render() {
        if(this.state.redirect === true){
         return (<Redirect to="/commerce/admin/indexVenta/" />)
        }
        return (
 
         <div>
           <Modal
           title="Basic Modal"
           visible={this.state.visible}
           onCancel={this.handleCancel.bind(this)}
           footer={null}
           >  
                 <div className="form-group-content">
                         <div className="text-center-content">
                                  <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                 
                                  </div>       
                                 <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                     <button type="button" className="btn-content btn-danger-content" onClick={this.guardarVenta.bind(this,"contado")}>
                                             Contado
                                     </button>
                                  </div>
                                  <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                     <button type="button" className="btn-content btn-success-content" onClick={this.pagarCredito.bind(this)}>
                                             Credito
                                     </button>
                                  </div>
                                  <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                 
                                 </div>   
                                       
                                       
                         </div>
                   </div>
         </Modal>
         <Modal
           title="Plan De Pago"
           visible={this.state.visibleCredito}
           onCancel={this.handleCancelcredito.bind(this)}
           footer={null}
           width={950}
           bodyStyle={{  
                         height : window.innerHeight * 0.8
                     }}
           >  
             <div>
                     <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth"> 
                         <div className="borderTable ">
                             <label className="label-group-content-nwe">Total Monto a Pagar</label>
                         </div> 
                     </div>
                     <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth"> 
                         <div className="borderTable ">
                              <input  className='form-control-content reinicio-padding' type='text' value={this.state.totalVenta}></input>
                         </div>
                     </div>
                     <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth"> 
                          <div className="borderTable ">
                              <label className="label-group-content-nwe " >Anticipo</label>
                          </div>
                     </div>
                     <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth"> 
                         <div className="borderTable ">
                              <input className='form-control-content reinicio-padding'  type='text' value={this.state.anticipo} onChange={this.anticipoPago.bind(this)}></input>
                          </div>
                     </div>
                     <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth"> 
                         <div className="borderTable ">
                             <label className="label-group-content-nwe " >Saldo a Pagar</label>
                         </div>
                     </div>
                     <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content "> 
                         <div className="borderTable ">
                              <input  className='form-control-content reinicio-padding' type='text' value={this.state.saldoApagar}></input>
                         </div>
                     </div>
                     <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth"> 
                         <div className="borderTable ">
                             <label className="label-group-content-nwe">Numero de Cuotas</label>
                         </div>
                     </div>
                     <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth"> 
                          <div className="borderTable ">
                              <input  className='form-control-content reinicio-padding' type='text' value={this.state.NumeroCuota} onChange={this.numeroCuotaPlan.bind(this)}></input>
                          </div>
                     </div>
                     <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth">
                         <div className="borderTable ">
                              <label className="label-group-content-nwe " >Fecha Inicio Pago</label>
                         </div>     
                     </div>
                     <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth"> 
                          <div className="borderTable ">
                                 <input className='form-control-content reinicio-padding'  type='date' value={this.state.fechaInicioDePago} onChange={this.fechaPagoInicio.bind(this)}></input>
                           </div>
                     </div>
                     <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content borderRigth"> 
                         <div className="borderTable ">
                              <label className="label-group-content-nwe ">Tipo Periodo</label>
                         </div>
                     </div>
                
                     <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content"> 
                         <div className="borderTable ">
                             <select  className='form-control-content reinicio-padding' onChange={this.tipoPeriodo.bind(this)}>
                                 <option value='1'>Diario</option>
                                 <option value='7'>Semanal</option>
                                 <option value='30'>Mensual</option>
                             </select>
                         </div>
                     </div>
                     <div className="text-center-content">
                         <div className="col-lg-12-content col-md-2-content col-sm-12-content col-xs-12-content">
                             <button type="button" className="btn-content btn-success-content" onClick={this.generarPlanPago.bind(this)}>
                                 Generar Plan Pago
                             </button> 
                         </div>
                     </div>
                     {this.cabeceraPlan()}
 
                     <div className='caja-content'>
                     {this.PlandePago()}
                     </div>
                     {this.footerPlanPago()}
                     
             </div>
         </Modal>
             <div className="row-content">
                 <div className="card-header-content">
                     <div className="pull-left-content">
                         <h1 className="title-logo-content"> Editar Venta </h1>
                     </div>
                 </div>
             </div>
             <form onSubmit={this.guardarDatos.bind(this)} className="formulario-content" encType="multipart/form-data" id="form_register">
               <div>
                   <div className="form-group-content">
                      <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                            <div className="input-group-content">
                             <label htmlFor="codigoVenta"
                                                className="label-group-content-nwe "> Codigo :  </label>
                            </div>
                      </div>
                      <div className="col-lg-2-content col-md-1-content col-sm-12-content col-xs-12-content">
                             <div className="input-group-content">
                                         <input id="codigoVenta" type="text"
                                                value={this.state.codigoVenta}
                                                placeholder="Ingresar Codigo ..."
                                                onChange={this.ventaCodigo.bind(this)}
                                                className='form-control-content'
                                         />
                             </div>
                      </div>
                      <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                            <div className="input-group-content">
                            <label htmlFor="fechaVenta"
                                                className="label-group-content-nwe"> Fecha :</label>
                            </div>
                      </div>
                      <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                             <div className="input-group-content">
                                         <input id="fechaVenta" type="date"
                                                value={this.state.fechaVenta}
                                                placeholder="Ingresar Fecha ..."
                                                onChange={this.ventaFecha.bind(this)}
                                                className='form-control-content'
                                         />
                             </div>
                      </div>
                      <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                            <div className="input-group-content">
                                    <label htmlFor="sucursal" className="label-group-content-nwe"> Sucursal :</label>
                            </div>
                      </div>
                      <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                             <div className="input-group-content">   
                                         <select name="sucursal" id="sucursal" className="form-control-content" onChange={this.ventaSucursal.bind(this)}>
                                                  {this.state.sucursalVenta.map((l,i)=>(
                                                         <option value={l.idsucursal}>{l.nombre}</option>
                                                  ))}           
                                         </select>         
                             </div>
                      </div>
                      <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                            <div className="input-group-content">
                            <label htmlFor="almacen"
                                                className="label-group-content-nwe">Almacen :</label>
                            </div>
                      </div>
                      <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                             <div className="input-group-content">
                                         <select name="almacen" id="almacen" className="form-control-content" onChange={this.ventaAlmacen.bind(this)}>
                                              {this.state.almacenVentaSucursal.map((l,i)=>(
                                                     <option value={l.idalmacen}>{l.descripcion}</option>
                                              ))}
                                         </select>          
                             </div>
                      </div>
                     
                   </div>
                  <Divider/>
                   <div className='form-group-content'>
                      <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                            <div className="input-group-content">
                              <a className="btn btn-sm btn-default-content hint--bottom " aria-label="Agregar Cliente"><i className="fa fa-plus"> </i></a>
                            </div>
                      </div>
                      <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                            <div className="input-group-content" >
                             <label htmlFor="clienteVenta" style={{  }}
                                                className="label-group-content-nwe"> Cliente :  </label>
                            </div>
                      </div>
                      <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                             <div className="input-group-content">
                                                  <TreeSelect
                                                     showSearch
                                                     style={{ width: 180 }}
                                                     dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                     placeholder="Seleccionar Cod"
                                                     allowClear
                                                     value={this.state.clienteDataVenta1}
                                                     treeDefaultExpandAll
                                                     onChange={this.ventaCliente.bind(this)}
                                                     >
                                                    {  
                                                        this.state.clienteVenta.map((l,i) => (
                                                          <TreeNode value={l.idcliente+" "+l.codcliente} title={l.idcliente} key={i}/>
                                                        ))        
                                                     }
                                                 </TreeSelect>
                                       
                             </div>
                      </div>
                      <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                             <div className="input-group-content">
                                                  <TreeSelect
                                                     showSearch
                                                     style={{ width: 180 }}
                                                     dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                     placeholder="Seleccionar Nombre"
                                                     allowClear
                                                     value={this.state.clienteDataVenta2}
                                                     treeDefaultExpandAll
                                                     onChange={this.ventaCliente.bind(this)}
                                                          >
                                                         {  this.state.clienteVenta.map((l,i)=>(
                                                                <TreeNode value={l.idcliente + " "+ l.nombre + " " + l.apellido+" "+l.nit} title={l.nombre+" "+l.apellido} key={i}/>
                                                         ))        
                                                     }
                                                 </TreeSelect>
                                       
                             </div>
                      </div>
                      <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                            <div className="input-group-content">
                             <label htmlFor="nitCliente" style={{  }}
                                                className="label-group-content-nwe"> Nit :  </label>
                            </div>
                      </div>
                      <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                             <div className="input-group-content">
                                         <input id="nitCliente" type="text"
                                                className='form-control-content'
                                                value={this.state.nitVenta}
                                         />    
                             </div>
                      </div>
                      <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                            <div className="input-group-content">
                             <label htmlFor="moneda"
                                                className="label-group-content-nwe"> Moneda :  </label>
                            </div>
                      </div>
                      <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                             <div className="input-group-content">
                                         <select name="moneda" id="moneda" className="form-control-content" onChange={this.ventaMoneda.bind(this)}>
                                                {this.state.monedaVenta.map((l,i)=>(
                                                       <option value={l.idmoneda}>{l.descripcion}</option>
                                                ))}  
                                         </select>
                             </div>
                      </div>
 
                   </div>
                   <div className='form-group-content'>
                      <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                        
                      </div>
                      <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                            <div className="input-group-content" style={{  }}>
                             <label htmlFor="vendedorVenta"
                                                className="label-group-content-nwe"> Vendedor:  </label>
                            </div>
                      </div>
                      <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content" style={{ marginLeft:20 }}>
                             <div className="input-group-content">
                                            <TreeSelect
                                                     showSearch
                                                     style={{ width: 180 }}
                                                     dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                     placeholder="Seleccionar Cod"
                                                     allowClear
                                                     value={this.state.vendedorDataVentaId}
                                                     treeDefaultExpandAll
                                                     onChange={this.ventaVendedor.bind(this)}
                                                          >
                                                    {  
                                                        this.state.vendedorVenta.map((l,i)=>(
                                                          <TreeNode value={l.idvendedor} title={l.idvendedor} key={i}/>
                                                        ))        
                                                     }
                                            </TreeSelect>
                                       
                             </div>
                      </div>
                      <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                             <div className="input-group-content">
                                           <TreeSelect
                                                     showSearch
                                                     style={{ width: 180 }}
                                                     dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                     placeholder="Seleccionar Vendedor"
                                                     allowClear
                                                     value={this.state.vendedorDataNombre}
                                                     treeDefaultExpandAll
                                                     onChange={this.ventaVendedor.bind(this)}
                                                          >
                                                    {  
                                                        this.state.vendedorVenta.map((l,i)=>(
                                                          <TreeNode value={l.idvendedor  + " "+ l.nombre + " " + l.apellido} title={l.nombre + " "+l.apellido} key={i}/>
                                                        ))        
                                                     }
                                            </TreeSelect>
                                       
                             </div>
                      </div>
                      <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                            <div className="input-group-content">
                             <label htmlFor="lista"
                                                className="label-group-content-nwe" style={{ paddingLeft:30}}> lista :  </label>
                            </div>
                      </div>
                      <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                             <div className="input-group-content">
                                         <select name="lista" id="lista" className="form-control-content" onChange={this.ventaListaPrincipal.bind(this)} value={this.state.listaVentaId}>
                                                {this.state.listaMonedaVenta.map((l,i)=>(
                                                       <option value={l.idlistaprecio}>{l.descripcion}</option>
                                                ))}   
                                         </select>
                                       
                             </div>
                      </div>
 
                   </div>
                   <Divider/>
                   <div className="card-caracteristica"> 
                     
                     <div className='form-group-content'>
                         <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                             <label htmlFor="lista" className="label-group-content-nwe "> CodProd </label>
                         </div>
                         <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                             <label htmlFor="lista" className="label-group-content-nwe"> Producto </label>
                         </div>
                         <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                             <label htmlFor="lista" className="label-group-content-nwe"> Unid. Med </label>
                         </div>
                         <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                             <label htmlFor="lista" className="label-group-content-nwe"> Cantidad </label>
                         </div>
                         <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                             <label htmlFor="lista" className="label-group-content-nwe"> Lista </label>
                         </div>
                         <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                             <label htmlFor="lista" className="label-group-content-nwe "> Precio Unit </label>
                         </div>
                         <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                             <label htmlFor="lista" className="label-group-content-nwe"> % Dcto. </label>
                         </div>
                         <div className="col-lg-2-content col-md-1-content col-sm-12-content col-xs-12-content">
                             <label htmlFor="lista" className="label-group-content-nwe"> Precio Total </label>
                         </div>
                         <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content" >
                            <div className="input-group-content" style={{ marginLeft:30}}>
                              <a className="btn btn-sm btn-default-content hint--bottom " aria-label="Mas"><i className="fa fa-plus" onClick={this.addRowDetalle.bind(this)}> </i></a>
                            </div>
                         </div>
                         <Divider/>
                     </div>
                    
 
                     <div className='form-group-content'>
                      <div className="caja-content" >
                         {this.state.arrayItems.map((l,i)=>(
                             <div key={i}>
                              <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                                      <div className="input-group-content">
                                           <TreeSelect
                                                     showSearch
                                                     dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                     placeholder="Codigo"
                                                     value={this.state.arrayCodProVenta[i]}
                                                     treeDefaultExpandAll
                                                     onChange={this.ventaProducto.bind(this)}
                                                         >
                                                         {  
                                                             this.state.productoVenta.map((m,k)=>(
                                                                 <TreeNode key={k} value={m.idproducto+ " " + i} title={m.idproducto} />
                                                             ))        
                                                         }
                                            </TreeSelect>
                                     </div>
                          </div>
                         <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                             <div className="input-group-content">
                                           <TreeSelect
                                                     showSearch
                                                     dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                     placeholder="Producto"
                                                     value={this.state.arrayProductoVenta[i]}
                                                     treeDefaultExpandAll
                                                     onChange={this.ventaProducto.bind(this)}
                                                          >
                                                         {  
                                                             this.state.productoVenta.map((m,j)=>(
                                                                 <TreeNode key={j} value={m.idproducto+" "+m.descripcion + " " + i} title={m.descripcion} />
                                                             ))        
                                                         }
                                            </TreeSelect>
                             </div>
                         </div>
                         <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                             <div className="input-group-content">
                                         <input id={i} type="text"
                                                value = {typeof this.state.arrayUnidadVentaAbrev[i] == 'undefined' ? "" :this.state.arrayUnidadVentaAbrev[i] }
                                                placeholder="Unidad"
                                                className='form-control-content reinicio-padding'
                                         />
                             </div>             
                          </div>
                          <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                             <div className="input-group-content">
                                         <input  id={i} type="number"
                                                 value={this.state.arrayCantidadVenta[i]}
                                                onChange = {this.ventaCantidad.bind(this)}
                                                placeholder="cantidad"
                                                className='form-control-content reinicio-padding'
                                         />
                             </div>
                                     
                          </div>
                          <div className="col-lg-2-content col-md-2-content col-sm-12-content col-xs-12-content">
                             <div className="input-group-content">
                                         <select name="lista" id={i} className="form-control-content" value={this.state.arrayListaVenta[i]} onChange={this.ventaLista.bind(this)} >
                                                {this.state.listaMonedaVenta.map((l,i)=>(
                                                       <option value={l.idlistaprecio}>{l.descripcion}</option>
                                                ))}   
                                         </select>
                             </div>
                         </div>
                         <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                             <div className="input-group-content">
                                         <input id={i} type="text"
                                                placeholder="Precio Uni."
                                                className='form-control-content reinicio-padding'
                                                value={typeof this.state.arrayPrecioUnit[i] == 'undefined' ? "" :this.state.arrayPrecioUnit[i]}
                                         />
                             </div>
                                     
                          </div>
                          <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                             <div className="input-group-content">
                                         <input id={i} type="text"
                                                placeholder="% Desc"
                                                className='form-control-content reinicio-padding'
                                                value={this.state.arrayDescuento[i]}
                                                onChange={this.ventaDescuento.bind(this)}
                                         />
                             </div>
                              
                          </div>
                          <div className="col-lg-2-content col-md-1-content col-sm-12-content col-xs-12-content">
                             <div className="input-group-content">
                                         <input id="preciototal" type="text"
                                                placeholder="Precio Total"
                                                className='form-control-content'
                                                value={ typeof this.state.arrayPrecioTotal[i] == 'undefined' ? "" : this.state.arrayPrecioTotal[i]}
                                         />
                             </div>
                                     
                          </div>
                          <div className="col-lg-1-content col-md-1-content col-sm-12-content col-xs-12-content">
                            <div className="input-group-content" style={{ marginLeft:30}}>
                              <a className="btn btn-sm btn-danger-content hint--bottom " aria-label="Eliminar"><i className="fa fa-remove" onClick={this.removeRowDetalle.bind(this,i)}> </i></a>
                            </div>
                         </div>
                         <Divider/>
                         </div>
                         ))}
                         </div>
                          <div className="form-group-content col-lg-8-content">
                             <div className="col-lg-12-content col-md-12-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                           <textarea className="textarea-content" placeholder="Observaciones" style={{ height:200 }} value={this.state.observacionVenta} onChange={this.ventaObservacion.bind(this)}/>
                                    </div>
                              </div>
                          </div>
                          <div className="form-group-content col-lg-3-content">
                             <div className="col-lg-6-content col-md-4-content col-sm-12-content col-xs-12-content" style={{ }}>
                                    <div className="input-group-content">
                                           <label htmlFor="subtotal"  className="label-group-content"> Sub Total   </label>
                                    </div>
                             </div>
                             <div className="col-lg-6-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                            <input id="subtotal" type="text"
                                                placeholder="Sub Total"
                                                className='form-control-content'
                                                value={this.state.subTotalVenta}
                                            />
                                    </div>
                             </div>
                        
                             <div className="col-lg-6-content col-md-4-content col-sm-12-content col-xs-12-content" style={{  }}>
                                    <div className="input-group-content">
                                           <label htmlFor="descuento"  className="label-group-content">% Desc   </label>
                                    </div>
                             </div>
                             <div className="col-lg-6-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                            <input id="descuento" type="text"
                                                placeholder="descuento "
                                                className='form-control-content'
                                                value={this.state.descuentoVenta}
                                                onChange={this.ventaDescuentoTotal.bind(this)}
                                            />
                                    </div>
                             </div>
                             <div className="col-lg-6-content col-md-4-content col-sm-12-content col-xs-12-content" style={{  }}>
                                    <div className="input-group-content">
                                           <label htmlFor="descargo"  className="label-group-content">% Descargo   </label>
                                    </div>
                             </div>
                             <div className="col-lg-6-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                            <input id="descargo" type="text"
                                                placeholder="descargo  ..."
                                                className='form-control-content'
                                                value={this.state.recargoVenta}
                                                onChange={this.ventaRecargoTotal.bind(this)}
                                            />
                                    </div>
                             </div>
                             <div className="col-lg-6-content col-md-4-content col-sm-12-content col-xs-12-content" style={{  }}>
                                    <div className="input-group-content">
                                           <label htmlFor="total"  className="label-group-content">Total   </label>
                                    </div>
                             </div>
                             <div className="col-lg-6-content col-md-3-content col-sm-12-content col-xs-12-content">
                                    <div className="input-group-content">
                                            <input id="total" type="text"
                                                placeholder="total  ..."
                                                className='form-control-content'
                                                value={this.state.totalVenta}
                                            />
                                    </div>
                             </div>
 
                          </div>
                      </div>
                     
                   </div>
                   <div className="form-group-content">
                         <div className="text-center-content">
                                  <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                 
                                  </div>       
                                 <div className="col-lg-2-content col-md-3-content col-sm-12-content col-xs-12-content">
                                     <button type="button" className="btn-content btn-danger-content" >
                                             Partes Vehiculo
                                     </button>
                                  </div>
                                  <div className="col-lg-2-content col-md-3-content col-sm-12-content col-xs-12-content">
                                     <button type="submit" className="btn-content btn-success-content" onClick={this.pagar.bind(this)}>
                                             Pagar
                                     </button>
                                  </div>
                                  <div className="col-lg-2-content col-md-3-content col-sm-12-content col-xs-12-content">
                                      <button type="button" className="btn-content btn-danger-content" >
                                             Cancelar
                                      </button>
                                  </div>
                                  <div className="col-lg-3-content col-md-3-content col-sm-12-content col-xs-12-content">
                                  
                                  </div>
                                       
                                       
                         </div>
                   </div>
               </div>
             
             </form>
          </div>
        )
    }


}