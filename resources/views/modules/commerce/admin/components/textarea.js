
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { readData } from '../tools/toolsStorage';
import keysStorage from '../tools/keysStorage';

export default class TextArea extends Component {

    constructor(props) {
        super(props);
        this.state = {
            focusInput: true,
        }
    }

    validar(data) {
        if ((typeof data == 'undefined') || (data == null)) {
            return false;
        }
        return true;
    }

    value() {
        if (this.validar(this.props.value)) {
            if (this.props.value == null) {
                return '';
            }
            if (this.props.value.toString().length > 0){
                this.state.focusInput = false;
            }
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
        var value = this.props.value;
        value = ((typeof value == 'undefined') || (value == null))?'':value;
        if (value.length == 0) {
            this.setState({
                focusInput: true,
            });
        }
    }
    
    text() {
        if (this.validar(this.props.type)) {
            return this.props.type;
        }
        return 'text';
    }

    readOnly() {
        return this.props.readOnly || this.props.permisions.editable != 'A';
    }

    className() {
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

        if (this.validar(this.props.validar)) {
            if (this.props.validar == 1) {
                return `forms-textarea ${colors}`;
            }
            if (this.props.validar == 0) {
                return 'forms-textarea error';
            }
        }  else if (this.props.readOnly == true || this.props.permisions.editable != 'A') {
            this.state.focusInput = false;
            return 'forms-textarea cursor-not-allowed';
        }
        return `forms-textarea ${colors}`;
    }

    idhtmFor() {
        if (this.validar(this.props.title)) {
            return this.props.title.toString();
        }
        return 'inicio';
    }

    verificarPermisos() {
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
        if (this.props.permisions.visible == 'A') {
            return (
                <div className="inputs-groups">
                    <textarea className={this.className()}
                        value={this.value()}
                        onChange={this.onChange.bind(this)}
                        onFocus={this.onFocus.bind(this)}
                        onBlur={this.onBlur.bind(this)}
                        style={this.props.style}
                        readOnly={this.readOnly()}
                        id={this.props.id}
                    />
                    <label htmlFor={this.idhtmFor()} 
                        className={(this.state.focusInput)?'lbls-input':`lbls-input active ${colors}`}>
                        {this.props.title}
                    </label>
                </div>
            );
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

TextArea.propTypes = {
    style: PropTypes.object,
    permisions: PropTypes.object,
    title: PropTypes.string,
    id: PropTypes.string,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func
}

TextArea.defaultProps = {
    style: {},
    readOnly: false,
    permisions: {
        visible: 'A',
        editable: 'A'
    },
    title: '',
    id: 'inicio'
}