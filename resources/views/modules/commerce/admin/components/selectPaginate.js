
import React, { Component } from 'react';
import { readData } from '../tools/toolsStorage';
import keysStorage from '../tools/keysStorage';

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
    onClickDelete() {
        if (this.validar(this.props.onDelete)) {
            this.props.onDelete();
            this.setState({
                focusInput: true,
            });
        }
    }
    deleteValue() {
        if (this.validar(this.props.value)) {
            if (this.props.value.toString().length > 0) {
                return (
                    <a onClick={this.onClickDelete.bind(this)} className="delete-select">x</a>
                );
            }
        }
    }

    className() {
        if (this.validar(this.props.validar)) {
            if (this.props.validar == 1) {
                return 'input-select';
            }
            if (this.props.validar == 0) {
                return 'input-select error';
            }
        }else {
            return 'input-select';
        }
    }
    label() {
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
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
        }else {
            if (this.state.focusInput) {
                return 'lbls-input';
            }
            return `lbls-input active ${colors}`;
        }
    }

    render() {

        return (
            <div className="inputs-groups" 
                onFocus={this.onFocusMenu.bind(this)} 
                onBlur={this.onBlurMenu.bind(this)}>
                
                <input className={this.className()}
                    type="text"
                    onFocus={this.onFocus.bind(this)}
                    onBlur={this.onBlur.bind(this)}
                    value={this.value()}
                    readOnly
                />
                <label className={this.label()}>
                    {this.props.title}
                </label>

                {this.deleteValue()}

                <div className={(this.state.menu == 0)?'select-menu':'select-menu active'}>
                
                    <div className="sub-select-menu">
                        {this.arrayData()}
                    </div>
                </div>
            </div>
        );
    }
}