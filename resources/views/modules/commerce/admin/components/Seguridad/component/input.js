
import React, { Component } from 'react';

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
        return true;
    }

    value() {
        if (this.validar(this.props.value)) {
            
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
        if (this.props.value.length == 0) {
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
    className() {
        if (this.validar(this.props.validar)) {
            if (this.props.validar == 1) {
                return 'forms-control';
            }
            if (this.props.validar == 0) {
                return 'forms-control error';
            }
        }else {
            return 'forms-control';
        }
    }
    label() {
        if (this.validar(this.props.validar)) {
            if (this.props.validar == 1) {
                if (this.state.focusInput) {
                    return 'lbls-input';
                }
                return 'lbls-input active';
            }
            if (this.props.validar == 0) {
                if (this.state.focusInput) {
                    return 'lbls-input error';
                }
                return 'lbls-input error active';
            }
        }else {
            if (this.state.focusInput) {
                return 'lbls-input';
            }
            return 'lbls-input active';
        }
    }

    render() {

        return (
            <div className="inputs-groups">
                <input className={this.className()}
                    type={this.text()}
                    value={this.value()}
                    onChange={this.onChange.bind(this)}
                    onFocus={this.onFocus.bind(this)}
                    onBlur={this.onBlur.bind(this)}
                    style={this.props.style}
                />
                <label className={this.label()}>
                    {this.props.title}
                </label>
            </div>
        );
    }
}