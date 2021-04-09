
import React, { Component } from 'react';

export default class Select extends Component {

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
    option() {
        if (this.validar(this.props.data)) {
            return (
                this.props.data.map(
                    (resultado, key) => (
                        <option value={resultado.value} key={key}>{resultado.title}</option>
                    )
                )
            )
        }
    }

    render() {

        return (
            <div className="inputs-groups">
                <select className="forms-control"
                    value={this.value()}
                    onChange={this.onChange.bind(this)}
                    style={this.props.style}
                >
                    {this.option()}
                </select>
                <label className='lbls-input active'>
                    {this.props.title}
                </label>
            </div>
        );
    }
}