
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { readData } from '../../tools/toolsStorage';
import keysStorage from '../../tools/keysStorage';

export default class C_Input extends Component {

    constructor(props) {
        super(props);
        this.state = {
            focusblur: true,
            error: true,
            focus: false,
        }
    }
    autoFocus(event) {
        if (event != null) {
            if (this.state.focus) {
                event.focus();
            }
        }
    }
    className() {
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
        if ((this.props.readOnly) || (this.props.permisions.editable != 'A')) {
            return `forms-control ${colors} cursor-not-allowed`;
        }
        if (this.props.validar == 1) {
            return `forms-control ${colors}`;
        }
        if (this.props.validar == 0) {
            return `forms-control error`;
        }
        return `forms-control ${colors}`;
    }
    readOnly() {
        if (this.props.readOnly) {
            if (this.validar(this.props.value)) {
                if (this.props.value.toString().length > 0){
                    this.state.focusblur = false;
                }
            }
        }
        if ((this.props.readOnly) || (this.props.permisions.editable != 'A')) {
            if (this.validar(this.props.value)) {
                if (this.props.value.toString().length > 0){
                    this.state.focusblur = false;
                }
            }
            return true;
        }         
        return false;
    }
    validar(data) {
        if ((typeof data == 'undefined') || (data == null)) {
            return false;
        }
        return true;
    }

    onChange(event) {
        if (this.validar(this.props.onChange)) {
            this.props.onChange(event.target.value);
        }
    }

    onFocus() {
        this.setState({
            focusblur: false,
        });
    }

    onBlur() {
        var value = this.props.value;
        value = ((typeof value == 'undefined') || (value == null))?'':value;
        if (value.toString().length == 0) {
            this.setState({
                focusblur: true,
            });
        }
    }

    prefix() {
        if (this.validar(this.props.prefix)) {
            return this.props.prefix;
        }
    }
    suffix() {
        if (this.validar(this.props.suffix)) {
            return (
                <i style={{'padding': '3px', 'cursor': 'pointer', 
                        'position': 'absolute', 'right': '5px', 'top': '4px',
                        'padding': '3px', 'display': 'flex', 'flexWrap': 'wrap', 
                        'justifyContent': 'center', 'alignItems': 'center',
                    }}
                >
                    {this.props.suffix}
                </i>
            );
        }
    }

    label() {
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
        if (this.props.type == 'date') {
            this.state.focusblur = false;
        }
        if (this.validar(this.props.value)) {
            if (this.props.value.toString().length > 0){
                this.state.focusblur = false;
            }
        }
        if (this.props.validar == 1) {
            if (this.state.focusblur) {
                return 'lbls-input';
            }
            return `lbls-input active ${colors}`;
        }
        if (this.props.validar == 0) {
            if (this.state.focusblur) {
                return 'lbls-input error';
            }
            return 'lbls-input error active';
        }
    }

    onClickFocus() {
        this.setState({
            focusblur: false,
            focus: true,
        });
        setTimeout(() => {
            this.setState({
                focus: false,
            });
        }, 400);
    }

    title() {
        if (this.props.title.toString().trim().length > 0) {
            return (
                <label onClick={this.onClickFocus.bind(this)} 
                    className={this.label()}>
                    {this.props.title}
                </label>
            );
        }
        return null;
    }

    verificarPermisos() {
        const title = this.title();
        var value = this.props.value;
        value = ((typeof value == 'undefined') || (value == null))?'':value;
        if (this.props.permisions.visible == 'A' && this.props.configAllowed) {
            return (
                <div className={this.props.className}>
                    <div className="inputs-groups">
                        <input type={this.props.type}
                            className={this.className()}
                            placeholder={this.props.placeholder}
                            ref={this.autoFocus.bind(this)}
                            value={value}
                            onChange={this.onChange.bind(this)}
                            onFocus={this.onFocus.bind(this)}
                            onBlur={this.onBlur.bind(this)}
                            readOnly={this.readOnly()}
                            style={this.props.style}
                            onKeyPress={this.props.onKeyPress}
                        />
                        { title }
                        { this.prefix() }
                        { this.suffix() }
                        {
                            this.props.validar == 0 ?
                                (this.props.mensaje.toString().trim().length > 0)?
                                <p style={{ color: 'red', position: 'absolute', 
                                    bottom: '-36px', left: 17 }}>
                                    {this.props.mensaje}
                                </p>:''
                            : ''
                        }
                    </div>
                </div>
            );
        }
    }
    render() {
        const verificarPermisos = this.verificarPermisos();
        return (
            <>
                { verificarPermisos }
            </>

        );
    }
}
C_Input.propTypes = {
    permisions: PropTypes.object,
    title: PropTypes.string,
    type: PropTypes.string,
    readOnly: PropTypes.bool,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    onKeyPress: PropTypes.func,
    configAllowed: PropTypes.bool,
    className: PropTypes.string,
    validar: PropTypes.number,
    autoFocus: PropTypes.bool,
    style: PropTypes.object,
    mensaje: PropTypes.string,
    prefix: PropTypes.any,
    suffix: PropTypes.any,
 }
  
 C_Input.defaultProps = {
    onChange: undefined,
    onKeyPress: undefined,
    className: 'cols-lg-3 cols-md-3 cols-sm-12 cols-xs-12 pt-bottom',
    type: 'text',
    value: '',
    title: '',
    validar: 1,
    placeholder: '',
    readOnly: false,
    autoFocus: false,
    permisions: {
        visible: 'A',
        editable: 'A'
    },
    configAllowed: true,
    style: {},
    mensaje: '',
    prefix: undefined,
    suffix: undefined,
 }