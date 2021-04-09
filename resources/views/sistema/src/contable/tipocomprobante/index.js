import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Link, withRouter, Redirect} from 'react-router-dom';
import { Pagination, Modal, message, Divider, Table, Select } from 'antd';
import ws from '../../utils/webservices';
import keys from '../../utils/keys';
import { readPermisions } from '../../utils/toolsPermisions';
import { httpRequest, removeAllData, readData } from '../../utils/toolsStorage';
import routes from '../../utils/routes';
import keysStorage from '../../utils/keysStorage';
import 'bootstrap/dist/css/bootstrap.css';
import 'antd/dist/antd.css';
import C_Input from '../../componentes/data/input';
import C_Select from '../../componentes/data/select';
import C_Button from '../../componentes/data/button';
import strings from '../../utils/strings';
import { convertYmdToDmy } from '../../utils/toolsDate';
const { Option } = Select;

class IndexTipoComprobante extends Component {
    constructor(props){
        super(props);
        this.state = {
            tiposcomp: [],
            tiposcompDefault: [],
            noSesion: false,
            buscar: '',
            timeoutSearch: undefined,
            pagination: {},
            paginationDefault: {},
            pagina: 1,
            paginacionDefaults: {},
            nroPaginacion: 10,
            busqueda: '',
            cantPaginas: 10,
            visibleModalVer: false,
            descripcion: '',
            abreviacion: '',
            nroinicial: '',
            nroactual: '',
            firmaa: '',
            firmab: '',
            firmac: '',
            firmad: ''
        };

        this.columns = [
            {
                title: 'Nro',
                dataIndex: 'nro',
                key: 'nro',
                defaultSortOrder: 'ascend',
                width: 50,
                sorter: (a, b) => a.nro - b.nro,
            },
            {
                title: 'Descripcion',
                dataIndex: 'descripcion',
                key: 'descripcion',
                defaultSortOrder: 'ascend',
                width: 100,
                sorter: (a, b) => {return a.descripcion.localeCompare(b.descripcion)}
            },
            {
                title: 'Abrev',
                dataIndex: 'abrev',
                key: 'abrev',
                defaultSortOrder: 'ascend',
                width: 100,
                sorter: (a, b) => {return a.abrev.localeCompare(b.abrev)}
            },
            {
                title: 'Nro. Inicial',
                dataIndex: 'nroinicial',
                key: 'nroinicial',
                defaultSortOrder: 'nroinicial',
                sorter: (a, b) => {return a.nroinicial.localeCompare(b.nroinicial)}
            },
            {
                title: 'Nro. Actual',
                dataIndex: 'nroactual',
                key: 'nroactual',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.nroactual.localeCompare(b.nroactual)}
            },
            {
                title: 'Firma A',
                dataIndex: 'firmaa',
                key: 'firmaa',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.firmaa.localeCompare(b.firmaa)}
            },
            {
                title: 'Firma B',
                dataIndex: 'firmab',
                key: 'firmab',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.firmab.localeCompare(b.firmab)}
            },
            {
                title: 'Firma C',
                dataIndex: 'firmac',
                key: 'firmac',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.firmac.localeCompare(b.firmac)}
            },
            {
                title: 'Firma D',
                dataIndex: 'firmad',
                key: 'firmad',
                defaultSortOrder: 'ascend',
                sorter: (a, b) => {return a.firmad.localeCompare(b.firmad)}
            },
            {
                title: 'Opciones',
                key: 'opciones',
                width: 150,
                render: record => {
                    return (
                        <Fragment>
                            {this.btnVer(record)}
                            {this.btnEditar(record)}
                            {this.btnEliminar(record)}
                        </Fragment>
                    );
                }
            },
        ];

        this.permisions = {
            btn_nuevo: readPermisions(keys.comprobante_btn_nuevo),
            btn_ver: readPermisions(keys.comprobante_btn_ver),
            btn_editar: readPermisions(keys.comprobante_btn_editar),
            btn_eliminar: readPermisions(keys.comprobante_btn_eliminar)
        }
        
        this.onChangeSearch = this.onChangeSearch.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.onChangeSizePage = this.onChangeSizePage.bind(this);
    }

    btnVer(data) {
        if (this.permisions.btn_ver.visible == 'A') {
            return (
                <a  className="btns btns-sm btns-outline-success"
                    onClick={() => this.getTipoComprobante(data.id)}
                    aria-label="Ver">
                    <i className="fa fa-edit"> </i>
                </a>
            );
        }
        return null;
    }

    btnEditar(data) {
        if (this.permisions.btn_editar.visible == 'A') {
        //if (comprobante.estado == 'A') {
            return (
                <Link  to={routes.comprobantetipo_edit + '/' + data.id}
                    className="btns btns-sm btns-outline-primary"
                    aria-label="editar">
                    <i className="fa fa-edit"> </i>
                </Link>
            );
        }
        return null;
    }

    btnEliminar(data) {
        if (this.permisions.btn_eliminar.visible == 'A') {
        //if (comprobante.estado == 'A') {
            return (
                <a
                    className="btns btns-sm btns-outline-danger"
                    onClick={() => this.showDeleteConfirm(data.id)}
                    >
                    <i className="fa fa-trash">
                    </i>
                </a>
            );
        }
        return null;
    }

    onCreateData() {
        var url = routes.comprobantetipo_create;
        this.props.history.push(url);
    }

    btnNuevo() {
        //if (this.permisions.btn_nuevo.visible == 'A') {
            return (
                <div className="pulls-right">
                    <C_Button
                        title='Nuevo'
                        type='primary'
                        onClick={this.onCreateData.bind(this)}
                    />
                </div>
            );
        //}
        //return null;
    }

    componentDidMount() {
        this.getTiposComprobantes();
    }

    getTiposComprobantes() {
        httpRequest('get', ws.wscomprobantetipo)
        .then((result) => {
            //console.log(result);
            if (result.response == 1) {
                let data = result.data;
                let length = data.length;
                let arr = [];
                for (let i = 0; i < length; i++) {
                    arr.push({
                        id: data[i].idcomprobantetipo,
                        nro: (i + 1),
                        descripcion: data[i].descripcion,
                        nroinicial: data[i].numeradoinicial,
                        nroactual: data[i].numeroactual,
                        abrev: data[i].abreviacion,
                        firmaa: data[i].firmaa,
                        firmab: data[i].firmab,
                        firmac: data[i].firmac,
                        firmad: data[i].firmad
                    });
                }
                this.setState({
                    tiposcomp: arr,
                    tiposcompDefault: arr,
                    pagination: result.pagination,
                    paginationDefault: result.pagination,
                })
            
            } else if (result.response == -2) {
                this.setState({
                    noSesion: true
                })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    getTipoComprobante(id) {
        httpRequest('get', ws.wscomprobantetipo + '/' + id)
        .then((result) => {
            //console.log(result)
            if (result.response == 1) {
                let tipocomp = result.tipocomp;
                this.setState({
                    descripcion: tipocomp.descripcion,
                    abreviacion: tipocomp.abreviacion,
                    nroinicial: tipocomp.numeradoinicial,
                    nroactual: tipocomp.numeroactual,
                    firmaa: tipocomp.firmaa,
                    firmab: tipocomp.firmab,
                    firmac: tipocomp.firmac,
                    firmad: tipocomp.firmad,
                    visibleModalVer: true
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else {
                message.error(result.message);
            }
        })
        .catch((error) => {
            message.error(strings.message_error);
        })
    }

    onChangePage(page){
        /*httpRequest('get', ws.wscomprobante + '?page=' + page, {
            busqueda: this.state.busqueda,
            paginate: this.state.cantPaginas
        })
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let length = data.length;
                let arr = [];
                for (let i = 0; i < length; i++) {
                    arr.push({
                        id: data[i].idcomprobante,
                        nro: this.state.cantPaginas * (page - 1) + (i + 1),
                        estado: data[i].estado,
                        fecha: convertYmdToDmy(data[i].fecha.substring(0, 10)),
                        tipocomp: data[i].comprobantetipo,
                        numero: data[i].codcomprobante,
                        referidoa: data[i].referidoa == null ? '' : data[i].referidoa,
                        glosa: data[i].glosa == null ? '' : data[i].glosa
                    });
                }
                this.setState({
                    comprobantes: arr,
                    comprobantesDefaults: arr,
                    pagination: result.pagination,
                    paginationDefault: result.pagination,
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else if(result.response == -1) {
                console.log('Ocurrio un problema en el servidor');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })*/
    }

    searchComprobante2(value, cantPaginas) {
        /*httpRequest('get', ws.wscomprobante, {
            busqueda: value,
            paginate: cantPaginas
        })
        .then((result) => {
            if (result.response == 1) {
                let data = result.data;
                let length = data.length;
                let arr = [];
                for (let i = 0; i < length; i++) {
                    arr.push({
                        id: data[i].idcomprobante,
                        nro: (i + 1),
                        estado: data[i].estado,
                        fecha: convertYmdToDmy(data[i].fecha.substring(0, 10)),
                        tipocomp: data[i].comprobantetipo,
                        numero: data[i].codcomprobante,
                        referidoa: data[i].referidoa == null ? '' : data[i].referidoa,
                        glosa: data[i].glosa == null ? '' : data[i].glosa
                    });
                }
                this.setState({
                    comprobantes: arr,
                    comprobantesDefaults: arr
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            } else if (result.response == -1) {
                console.log('Ocurrio un problema en el servidor');
            } else {
                console.log('Ocurrio un problema en el servidor');
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })*/
    }

    searchComprobante(value) {
        /*if (value.length > 0) {
            if (this.state.timeoutSearch) {
                clearTimeout(this.state.timeoutSearch);
                this.setState({ timeoutSearch: undefined })
            }
            this.state.timeoutSearch = setTimeout(() => this.searchComprobante2(value, this.state.cantPaginas), 300);
            this.setState({
                timeoutSearch: this.state.timeoutSearch
            })
        } else {
            clearTimeout(this.state.timeoutSearch);
            this.setState({
                comprobantes: this.state.comprobantesDefaults,
                pagination: this.state.paginationDefault,
                timeoutSearch: undefined
            })
        }*/
    }

    onChangeSearch(value){
        /*this.searchComprobante(value);
        this.setState({
            buscar: value
        })*/
    }

    onChangeSizePage(value){
        /*this.searchComprobante2(null, value);
        this.setState({
            cantPaginas: value,
            pagina: 1,
        })*/
    }

    openModalVer() {
        this.setState({visibleModalVer: true});
    }

    closeModalVer() {
        this.setState({visibleModalVer: false});
    }

    componentModalVer() {
        return (
            <div className="rows">
                <div className="cards">
                    <C_Input 
                        title="Descripcion"
                        value={this.state.descripcion}
                        readOnly={true}
                    />
                    <C_Input 
                        title="Abreviatura"
                        value={this.state.abreviacion}
                        readOnly={true}
                    />
                    <C_Input 
                        title="Nro Inicial"
                        value={this.state.nroinicial}
                        readOnly={true}
                    />
                    <C_Input 
                        title="Nro Actual"
                        value={this.state.nroactual}
                        readOnly={true}
                    />
                    <C_Input 
                        title="Firma A"
                        value={this.state.firmaa}
                        readOnly={true}
                    />
                    <C_Input 
                        title="Firma B"
                        value={this.state.firmab}
                        readOnly={true}
                    />
                    <C_Input 
                        title="Firma C"
                        value={this.state.firmac}
                        readOnly={true}
                    />
                    <C_Input 
                        title="Firma D"
                        value={this.state.firmad}
                        readOnly={true}
                    />
                    <div className="cols-lg-12 cols-md-12 cols-sm-12 cols-xs-12">
                        <div className="txts-center">
                            <C_Button
                                title='Aceptar'
                                type='primary'
                                onClick={this.closeModalVer.bind(this)}
                            />
                        </div>
                    </div>
                </div>
                
            </div>
        );
    }

    deleteTipoComprobante(id) {
        httpRequest('delete', ws.wscomprobantetipo + '/' + id)
        .then((result) => {
            //console.log(result)
            if (result.response == 1) {
                let data = result.data;
                let length = data.length;
                let arr = [];
                for (let i = 0; i < length; i++) {
                    arr.push({
                        id: data[i].idcomprobantetipo,
                        nro: (i + 1),
                        descripcion: data[i].descripcion,
                        nroinicial: data[i].numeradoinicial,
                        nroactual: data[i].numeroactual,
                        abrev: data[i].abreviacion,
                        firmaa: data[i].firmaa,
                        firmab: data[i].firmab,
                        firmac: data[i].firmac,
                        firmad: data[i].firmad
                    });
                }
                this.setState({
                    tiposcomp: arr,
                    tiposcompDefault: arr,
                    pagination: result.pagination,
                    paginationDefault: result.pagination,
                })
            } else if (result.response == -2) {
                this.setState({ noSesion: true })
            }
        })
        .catch((error) => {
            console.log(error);
            message.error(strings.message_error);
        })
    }

    showDeleteConfirm(id) {
        let deleteTipoComprobante = this.deleteTipoComprobante.bind(this);
        Modal.confirm({
            title: 'Eliminar Tipo de Comprobante',
            content: '¿Estas seguro de eliminar el tipo de comprobante?',
            okText: 'Si',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteTipoComprobante(id);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    render() {

        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio}/>
            )
        }
        const btnNuevo = this.btnNuevo();
        const componentModalVer = this.componentModalVer();
        return (

            <div className="rows">
            <Modal
                    title='Tipo de Comprobante'
                    visible={this.state.visibleModalVer}
                    onOk={this.closeModalVer.bind(this)}
                    onCancel={this.closeModalVer.bind(this)}
                    footer={null}
                    width={850}
                    //style={{'top': '35px', height: 500}}
                >
                    { componentModalVer }
            </Modal>
            
            <div className="cards">
                <div className="pulls-left">
                <h1 className="lbls-title">Gestionar Tipo de Comprobantes</h1>
                </div>
                { btnNuevo }
                <div className="forms-groups">
                    <div className="pulls-left">
                        <C_Select
                            value={this.state.cantPaginas}
                            onChange={this.onChangeSizePage.bind(this)}
                            title='Mostrar'
                            className=''
                            style={{ width: 65 }}
                            component={[
                                <Option key = {0} value = {10}>10</Option>,
                                <Option key = {1} value = {25}>25</Option>,
                                <Option key = {2} value = {50}>50</Option>,
                                <Option key = {3} value = {100}>100</Option>,
                            ]}
                        />
                    </div>
                    <div className="pulls-right">
                        <C_Input
                            value={this.state.buscar}
                            onChange={this.onChangeSearch}
                            title='Buscar'
                            className=''
                        />
                    </div>
                </div>
                <div className="forms-groups">
                    <div className="tabless">
                        <Table
                            columns={this.columns}
                            dataSource={this.state.tiposcomp}
                            bordered={true}
                            pagination={false}
                            className="tables-respons"
                            rowKey="id"
                        />
                    </div>
                </div>
                <div className="pull-right py-3">
                    <Pagination
                        defaultCurrent={this.state.pagina}
                        pageSize={this.state.nroPaginacion}
                        onChange={this.onChangePage}
                        total={this.state.pagination.total}
                        showTotal={(total, range) => `Mostrando ${range[0]}-${range[1]} de un total de ${total} registros`}
                    />
                </div>
            </div>
            </div>
        );
    }
}

export default withRouter(IndexTipoComprobante);
