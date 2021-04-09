
import React, { Component } from 'react';

import {Icon} from 'antd';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { readData } from '../../../../tools/toolsStorage';
import keysStorage from '../../../../tools/keysStorage';

class Navegation extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    className() {
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
        if (this.props.data.length > 0) {
            var index = this.props.data.findIndex(value => (value.key == this.props.keys));
            if (this.props.data[index].value) {
                return `${colors} active`
            }
        }
        return `${colors}`;
    }

    onFocus(event) {
        event.preventDefault();
        if (this.props.data.length > 0) {
            var index = this.props.data.findIndex(value => (value.key == this.props.keys));
            this.props.data.map(value =>{
                if (value.key != this.props.keys) {
                    value.value = false;
                }
            });
            this.props.data[index].value = !this.props.data[index].value;
            this.props.onCollapse(this.props.data);
        }
        return;
    }

    validar(data) {
        if (typeof data == 'undefined') {
            return true;
        }
        return false;
    }

    onClick(event) {
        event.preventDefault();
        if (!this.validar(this.props.onLink)) {
            this.props.onLink(event)
        }
    }

    validarPermisions() {
        if (this.props.permisions.visible == 'A') {
            const className = this.className();
            return (
                <li className={className} onClick={this.onFocus.bind(this)}>
                    <a href="#" onClick={this.onClick.bind(this)} className={className}>
                        <span className="icons-left">
                            <Icon type="home" 
                                style={{'position': 'relative', 'top': '-4px'}}
                            />
                            <label>{this.props.title}</label>
                        </span> 
                    </a>
                </li>
            );
        }
        return null;
    }

    render() {
        const validarPermisions = this.validarPermisions();
        return (
            <>
                { validarPermisions }
            </>
        );
    }
}


Navegation.propTypes = {
    title: PropTypes.string,
    keys: PropTypes.any.isRequired,
    onCollapse: PropTypes.func.isRequired,
    style: PropTypes.object,
    data: PropTypes.array,
    permisions: PropTypes.object
}

Navegation.defaultProps = {
    style: {},
    title: 'Paquete',
    data: [],
    keys: '',
    permisions: {
        visible: 'A',
        editable: 'A'
    }
}

export default Navegation;


