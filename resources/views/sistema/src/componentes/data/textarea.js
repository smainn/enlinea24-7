
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { readData } from '../../utils/toolsStorage';
import keysStorage from '../../utils/keysStorage';

export default class C_TextArea extends Component {

    constructor(props) {
        super(props);
        this.state = {
            focusblur: true,
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
    validar(data) {
        if (typeof data == 'undefined') {
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
    className() {
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
        if ((this.props.readOnly == true) || (this.props.permisions.editable != 'A')) {
            return 'forms-textarea cursor-not-allowed';
        }
        return `forms-textarea ${colors}`;
    }
    label() {
        var value = this.props.value;
        value = ((typeof value == 'undefined') || (value == null))?'':value;

        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;

        if (value.toString().trim().length > 0) {
            return `lbls-input active ${colors}`;
        }
        if (this.state.focusblur) {
            return 'lbls-input';
        }
        return `lbls-input active ${colors}`;
    }
    readOnly() {
        return this.props.readOnly || this.props.permisions.editable != 'A';
    }
    verificarPermisos() {
        var value = this.props.value;
        value = ((typeof value == 'undefined') || (value == null))?'':value;
        if (this.props.permisions.visible == 'A') {
            return (
                <div className={this.props.className}>
                    <div className="inputs-groups">
                        <textarea className={this.className()}
                            value={value}
                            onChange={this.onChange.bind(this)}
                            onFocus={this.onFocus.bind(this)}
                            onBlur={this.onBlur.bind(this)}
                            style={this.props.style}
                            readOnly={this.readOnly()}
                            ref={this.autoFocus.bind(this)}
                        />
                        {(this.props.title.toString().trim().length > 0)?
                            <label onClick={this.onClickFocus.bind(this)} className={this.label()}>
                                {this.props.title}
                            </label>:''
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
C_TextArea.propTypes = {
    style: PropTypes.object,
    permisions: PropTypes.object,
    title: PropTypes.string,
    readOnly: PropTypes.bool,
    onChange: PropTypes.func,
    validar: PropTypes.number,
    value: PropTypes.string,
    className: PropTypes.string,
}

C_TextArea.defaultProps = {
    style: {},
    onChange: undefined,
    readOnly: false,
    permisions: {
        visible: 'A',
        editable: 'A'
    },
    title: '',
    validar: 1,
    value: '',
    className: 'cols-lg-6 cols-md-6 cols-sm-12 cols-xs-12 pt-bottom',
}