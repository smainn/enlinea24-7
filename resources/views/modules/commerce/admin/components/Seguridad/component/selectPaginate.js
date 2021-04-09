
import React, { Component } from 'react';

export default class SelectPaginate extends Component {

    constructor(props) {
        super(props);
        this.state = {
            focusInput: true,
            menu: 0,
        }
    }

    validar(data) {
        if (typeof data == 'undefined') {
            return false;
        }
        return true;
    }
    onFocus() {
        this.setState({
            focusInput: false,
        });
    }
    arrayData() {
        if (this.validar(this.props.data)) {
            return (
                this.props.data.map(
                    (response, key) => (
                        <input key={key} type="text"
                            value={response.title} 
                            onClick={this.onFocusSeleccionar.bind(this, response)}
                            className="inputs-menu" readOnly />
                    )
                )
            )
        }
    }
    onBlur() {
        if (this.validar(this.props.value)) {
            if (this.props.value.length == 0) {
                this.setState({
                    focusInput: true,
                });
            }
        }else {
            this.setState({
                focusInput: true,
            });
        }
    }
    onFocusMenu() {
        this.setState({
            menu: 1,
        });
    }
    onBlurMenu() {
        this.setState({
            menu: 0,
        });
    }
    onFocusSeleccionar(data) {
        this.onBlurMenu();
        if (this.validar(this.props.onChange)) {
            this.props.onChange(data);
        }
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

    render() {

        return (
            <div className="inputs-groups" 
                onFocus={this.onFocusMenu.bind(this)} 
                onBlur={this.onBlurMenu.bind(this)}>
                
                <input className="input-select"
                    type="text"
                    onFocus={this.onFocus.bind(this)}
                    onBlur={this.onBlur.bind(this)}
                    value={this.value()}
                    readOnly
                />
                <label className={(this.state.focusInput)?'lbls-input':'lbls-input active'}>
                    {this.props.title}
                </label>

                <div className={(this.state.menu == 0)?'select-menu':'select-menu active'}>
                
                    <div className="sub-select-menu">
                        {this.arrayData()}
                    </div>
                </div>
            </div>
        );
    }
}