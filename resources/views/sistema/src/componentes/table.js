
import React, { Component } from 'react';

export default class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    validar(data) {
        if (typeof data == 'undefined') {
            return false;
        }
        return true;
    }

    thead() {
        if (this.validar(this.props.columna)) {
            var array = [];
            var index = 0;
            this.props.columna.map(
                (resultado, key) => {
                    array.push(<th key={key}>{resultado}</th>);
                    index = key;
                }
            );
            array.push(<th key={index + 1}>Accion</th>);
            return array;
        }
    }

    arrayData() {
        if (this.validar(this.props.data)) {
            return (
                this.props.data.map(
                    (resultado, key) => (
                        <tr key={key}>
                            {this.objetosData(resultado)}
                        </tr>
                    )
                )
            );
        }
    }

    onDelete(event) {
        if (this.validar(this.props.delete)) {
            this.props.delete(event);
        }
    }

    objetosData(data) {
        var arrayDatos = [];
        var contador = 0;
        var array = [];
        for (var a in data) {
            if (contador == 0) {
                array.push(
                    <td key={0}>
                        <a className="btns btns-sm btns-outline-primary">
                            <i className="fa fa-edit"></i>
                        </a>
                        <a className="btns btns-sm btns-outline-danger" onClick={this.onDelete.bind(this, data[a])}>
                            <i className="fa fa-trash"></i>
                        </a>
                    </td>
                );
            }
            contador++;
            arrayDatos.push(<td key={a}>{data[a]}</td>);
        }
        arrayDatos.push(array[0]);
        return arrayDatos;
    }

    render() {

        return (
            <div className="tabless">
                <table className="tables-respons">
                    <thead>
                        <tr>
                            { this.thead() }
                        </tr>
                    </thead>

                    <tbody>
                        { this.arrayData() }
                    </tbody>
                </table>
            </div>
        );
    }
}