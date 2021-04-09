
import React, { Component } from 'react';
import Input from '../component/input';
import SelectPaginate from '../component/selectPaginate';

export default class AsignarPrivilegio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            nombre: '',

            gruposUsuarios: [],
            data: [],

            FamiliaPermisos: [],
            permisos: [],

            vistaPermiso: [],
        }
    }

    componentDidMount() {
        this.getGrupoUsuario(1, '', 5);
        this.getPermisos();
    }
    
    getPermisos() {
        axios.get('/commerce/api/permisos').then(
            response => {
                if (response.data.response == 0) {
                    console.log('error en la conexion');
                }
                if (response.data.response == 1) {
                    this.setState({
                        permisos: response.data.data,
                    });

                    var array = response.data.data;
                    var array_aux = [];
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].idcomponentepadre == null) {
                            var objeto = {
                                title: array[i].descripcion,
                                value: array[i].idcomponente,
                                tipo: array[i].tipo,

                                visible: false,
                                editable: false,
                                noVisible: false,
                            };
                            array_aux.push(objeto);
                        }
                    }
                    this.arbolPermisos(array_aux);
                    this.setState({
                        FamiliaPermisos: array_aux,
                    });
                }
            }
        ).catch(
            error => console.log(error)
        );
    }

    arbolPermisos(data) {
        if (data.length === 0) {
            return;
        }
        for (var i = 0; i < data.length; i++) {
            var hijos = this.hijosPermisos(data[i].value);
            data[i].children = hijos;
            this.arbolPermisos(hijos);
        }
    }
    hijosPermisos(idpadre) {
        var array =  this.state.permisos;
        var hijos = [];
        for(var i = 0; i < array.length; i++){
            if(array[i].idcomponentepadre === idpadre){
                var objeto = {
                    title: array[i].descripcion,
                    value: array[i].idcomponente,
                    tipo: array[i].tipo,

                    visible: false,
                    editable: false,
                    noVisible: false,
                };
                hijos.push(objeto);
            }
        }
        return hijos;
    }

    getGrupoUsuario(page, buscar, nroPaginacion) {

        axios.get('/commerce/api/asignar?page=' + page + '&buscar=' + buscar + '&pagina=' + nroPaginacion).then(
            response => {
                if (response.data.response == 0) {
                    console.log('error en la conexion');
                }
                if (response.data.response == 1) {
                    response.data.data.data.map(
                        response => {
                            var objeto = {
                                value: response.idgrupousuario,
                                title: response.nombre,
                            }
                            this.state.data.push(objeto);
                        }
                    );
                    console.log(this.state.data);
                    this.setState({
                        data: this.state.data,
                    });
                }
            }
        ).catch(
            error => console.log(error)
        );
    }

    onChangeGrupo(event) {
        console.log(event)
        this.setState({
            nombre: event.title,
            id: event.value,
        });
        this.getPermisosDelGrupo(event.value);
    }
    getPermisosDelGrupo(idGrupoUsuario) {
        var formData = {
            id: idGrupoUsuario,
        }
        axios.post('/commerce/api/getPermisos', formData).then(
            response => {
                console.log(response.data.data)
            }
        ).catch(
            error => console.log(error)
        );
    }

    onChangeCheckedVisible(event) {
        
            if (event.visible) {
                event.visible = false;
            }else {
                event.visible = true;
                event.noVisible = false;
            }
            this.setState({
                FamiliaPermisos: this.state.FamiliaPermisos,
            });
        
    }

    onChangeCheckedEditable(event) {
        
            if (event.editable) {
                event.editable = false;
            }else {
                event.editable = true;
                event.noVisible = false;
            }
            this.setState({
                FamiliaPermisos: this.state.FamiliaPermisos,
            });
        
    }

    onChangeCheckedNoVisible(event) {
        if (event.noVisible) {
            event.noVisible = false;
        }else {
            event.noVisible = true;
            event.editable = false;
            event.visible = false;
        }
        this.setState({
            FamiliaPermisos: this.state.FamiliaPermisos,
        });
    }

    vistaPermiso() {
        var recorrido = [];
        this.recorridoEnPreOrden(this.state.FamiliaPermisos, recorrido);
        return recorrido;
    }

    recorridoEnPreOrden(nodoActual, recorrido) {
        if (nodoActual.length == 0) {
            return;
        }
        for (var i = 0; i < nodoActual.length; i++) {
            var left = this.altura() - this.alturaRecursivo(nodoActual[i].children);
            recorrido.push(
                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" key={nodoActual[i].value} style={{'borderTop': '1px solid #e8e8e8', 'height': '30px'}}>
                    <div className="cols-lg-8 cols-md-8 cols-sm-8 cols-xs-8 padding-0" style={{'height': '100%'}}>
                    
                        <div className="cols-lg-9 cols-md-9 cols-sm-9 cols-xs-9" style={{'borderRight': '1px solid #e8e8e8'}}>
                            <label style={{'borderTop': '1px solid #e8e8e8', 'width': left*17+'px'}}></label>
                            <label style={{'marginLeft': '18px'}}>{nodoActual[i].title}</label>
                        </div>

                        <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-3 txts-center" style={{'borderRight': '1px solid #e8e8e8'}}>
                            <label>{nodoActual[i].tipo}</label>
                        </div>
                        
                    </div>

                    <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 padding-0" style={{'height': '100%'}}>
                    
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0">
                        
                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 txts-center" style={{'borderRight': '1px solid #e8e8e8'}}>
                            
                                <label className="checkboxContainer">
                                    <input type="checkbox"
                                        onChange={this.onChangeCheckedVisible.bind(this, nodoActual[i])}
                                        checked={nodoActual[i].visible}
                                    />
                                    <span className="checkmark">  </span>
                                </label>
                            </div>

                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 txts-center" style={{'borderRight': '1px solid #e8e8e8'}}>
                            
                                <label className="checkboxContainer">
                                    <input type="checkbox"
                                        onChange={this.onChangeCheckedEditable.bind(this, nodoActual[i])}
                                        checked={nodoActual[i].editable}
                                    />
                                    <span className="checkmark">  </span>
                                </label>
                            </div>

                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 txts-center">
                            
                                <label className="checkboxContainer">
                                    <input type="checkbox"
                                        onChange={this.onChangeCheckedNoVisible.bind(this, nodoActual[i])}
                                        checked={nodoActual[i].noVisible}
                                    />
                                    <span className="checkmark">  </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )
            this.recorridoEnPreOrden(nodoActual[i].children, recorrido);
        }
    }

    altura() {
        return this.alturaRecursivo(this.state.FamiliaPermisos);
    }
    alturaRecursivo(nodoActual) {
        if (nodoActual.length == 0) {
            return 0;
        }
        var alturaMayor = 0;
        for (var i = 0; i < nodoActual.length; i++) {
            var altura = this.alturaRecursivo(nodoActual[i].children);
            if (altura > alturaMayor) {
                alturaMayor = altura;
            }
        }
        return alturaMayor + 1;
    }

    nivelDelDato(nodoActual) {
        if (nodoActual.length == 0) {
            return 0;
        }
        var nivelMayor = 0;
        for (var i = 0; i < nodoActual.length; i++) {
            var nivel = this.nivelDelDato(nodoActual[i].children);
            if (nivel > nivelMayor) {
                nivelMayor = nivel;
            }
        }
        return nivelMayor + 1;
    }

    render() {

        return (
            <div className="rows">

                <div className="cards">
                
                    <div className="pulls-left">
                        <h1 className="lbls-title">Asignar Privilegios</h1>
                    </div>

                    <div className="forms-groups">
                    
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        
                            <div className="cols-lg-2 cols-md-2 cols-sm-2 cols-xs-12">
                            
                                <Input 
                                    title='Id Grupo'
                                    value={this.state.id}
                                />
                            </div>

                            <div className="cols-lg-7 cols-md-7 cols-sm-7 cols-xs-12"></div>

                            <div className="cols-lg-3 cols-md-3 cols-sm-3 cols-xs-12">
                            
                                <SelectPaginate 
                                    title="Grupo"
                                    data={this.state.data}
                                    value={this.state.nombre}
                                    onChange={this.onChangeGrupo.bind(this)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="forms-groups">
                    
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        
                            <div className="txts-center">
                                
                                <button type="button" 
                                    className="btns btns-primary">
                                    Cargar de Por defecto
                                </button>

                                <button type="buton" className="btns btns-primary">
                                
                                    Importar de Otro Grupo 
                                </button>
                                
                            </div>
                        </div>
                    </div>

                    <div className="forms-groups">
                    
                        <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 border padding-0">
                        
                            <div className="cols-lg-8 cols-md-8 cols-sm-8 cols-xs-8 padding-0" style={{'height': '60px'}}>
                            
                                <div className="cols-lg-8 cols-md-8 cols-sm-8 cols-xs-8 txts-center"
                                    style={{'borderRight': '1px solid #e8e8e8', 'height': '100%'}}>
                                
                                    <label>Componente/Funcion</label>
                                </div>

                                <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 txts-center" 
                                    style={{'borderRight': '1px solid #e8e8e8', 'height': '100%'}}>
                                    <label>Tipo</label>
                                </div>
                            </div>

                            <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 padding-0" style={{'height': '60px'}}>
                            
                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 txts-center" style={{'height': '50%'}}>
                                
                                    <label>Permisos/Privilegios</label>
                                </div>

                                <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0" style={{'borderTop': '1px solid #e8e8e8', 'height': '50%'}}>
                                
                                    <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 txts-center" style={{'borderRight': '1px solid #e8e8e8'}}>
                                    
                                        <label>Visible</label>
                                    </div>

                                    <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 txts-center" style={{'borderRight': '1px solid #e8e8e8'}}>
                                    
                                        <label>Editable</label>
                                    </div>

                                    <div className="cols-lg-4 cols-md-4 cols-sm-4 cols-xs-4 txts-center">
                                    
                                        <label>No visible</label>
                                    </div>
                                </div>
                            </div>

                            <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12 padding-0 scrollbars" id="styles-scrollbar">
                            
                                {this.vistaPermiso()}
                            </div>
                            
                        </div>
                    </div>

                    <div className="forms-groups">
                    
                        <div className="txts-center">
                            
                            <button type="button" 
                                className="btns btns-primary">
                                Guardar
                            </button>

                            <button type="buton" className="btns btns-danger">Cancelar</button>
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}