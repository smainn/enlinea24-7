
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { readData } from '../tools/toolsStorage';
import keysStorage from '../tools/keysStorage';

export default class Input extends Component {

    constructor(props) {
        super(props);
        this.state = {
            focusInput: true,
            error: true,
            
        }
    }

    validar(data) {
        if (typeof data == 'undefined') {
            return false;
        }
        if (data == null) {
            return false;
        }
        return true;
    }

    value() {
        if (this.validar(this.props.value)) {
            return this.props.value;
        }
        return '';
    }

    onChange(event) {
        if (this.validar(this.props.onChange)) {
            this.props.onChange(event.target.value);
        }
    }

    onFocus() {
        this.setState({
            focusInput: false,
        });
    }

    onBlur() {
        if (this.props.value.toString().length == 0) {
            this.setState({
                focusInput: true,
            });
        }
    }

    text() {
        if (this.validar(this.props.type)) {
            if (this.props.type == 'date') {
                this.state.focusInput = false;
            }
            return this.props.type;
        }
        return 'text';
    }

    className() {

        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

        if (this.props.readOnly || this.props.permisions.editable != 'A') {
            return 'forms-control cursor-not-allowed';
        }
        
        if (this.validar(this.props.validar)) {
            if (this.props.validar == 1) {
                return `forms-control ${colors}`;
            }
            if (this.props.validar == 0) {
                return 'forms-control error';
            }
        }
        return `forms-control ${colors}`;
        
    }

    label() {
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

        if (this.validar(this.props.type)) {
            if (this.props.type == 'date') {
                this.state.focusInput = false;
            }
        }

        if (this.validar(this.props.value)) {
            if (this.props.value.toString().length > 0) {
                this.state.focusInput = false;
            }
        }

        if (this.validar(this.props.validar)) {
            if (this.props.validar == 1) {
                if (this.state.focusInput) {
                    return 'lbls-input';
                }
                return `lbls-input active ${colors}`;
            }
            if (this.props.validar == 0) {
                if (this.state.focusInput) {
                    return 'lbls-input error';
                }
                return 'lbls-input error active';
            }
        } else {
            if (this.state.focusInput) {
                return 'lbls-input';
            }
            return `lbls-input active ${colors}`;
        }
    }

    idhtmFor() {
        return this.props.title.toString();
    }

    onclickLabel(event) {
        console.log(event.target.className)
    }

    readOnly() {
        if (this.props.readOnly) {
            this.state.focusInput = false;
        }
        if (this.props.readOnly || this.props.permisions.editable != 'A') {
            this.state.focusInput = false;
            return true;
        }
        //return this.props.readOnly || this.props.permisions.editable != 'A';            
        return false;
    }

    title() {
        if (this.props.title.length > 0) {
            return (
                <label //htmlFor={this.idhtmFor()}
                    className={this.label()}>
                    {this.props.title}
                </label>
            );
        }
        return null;
    }

    verificarPermisos() {
        //console.log('PERMISIONS INPUT ', this.props.permisions);
        const title = this.title();
        if (this.props.permisions.visible == 'A' && this.props.configAllowed) {
            return (
                <div className="inputs-groups">
                    <input className={this.className()}
                        type={this.text()}
                        value={this.value()}
                        onChange={this.onChange.bind(this)}
                        onFocus={this.onFocus.bind(this)}
                        onBlur={this.onBlur.bind(this)}
                        style={this.props.style}
                        readOnly={this.readOnly()}
                        placeholder={this.props.placeholder}
                    />
                    { title }
                </div>
            )
        }

        return null;   
      
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

Input.propTypes = {
   permisions: PropTypes.object,
   title: PropTypes.string,
   readOnly: PropTypes.bool,
   placeholder: PropTypes.string,
   onChange: PropTypes.func,
   configAllowed: PropTypes.bool,
}
 
Input.defaultProps = {
    onChange: undefined,
    value: '',
    title: '',
    placeholder: '',
    readOnly: false,
    permisions: {
        visible: 'A',
        editable: 'A'
    },
    configAllowed: true
}