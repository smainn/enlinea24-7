
import React, { Component } from 'react';

export default class TextArea extends Component {

    constructor(props) {
        super(props);
        this.state = {
            focusInput: true,
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

    render() {

        return (
            <div className="inputs-groups">
                <textarea className="forms-textarea"
                    value={this.value()}
                    onChange={this.onChange.bind(this)}
                    onFocus={this.onFocus.bind(this)}
                    onBlur={this.onBlur.bind(this)}
                    style={this.props.style}
                />
                <label className={(this.state.focusInput)?'lbls-input':'lbls-input active'}>
                    {this.props.title}
                </label>
            </div>
        );
    }
}