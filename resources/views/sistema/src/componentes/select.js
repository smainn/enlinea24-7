
import React, { Component } from 'react';
import { Select } from 'antd';
import 'antd/dist/antd.css';
import { readData } from '../utils/toolsStorage';
import keysStorage from '../utils/keysStorage';
const {Option} = Select;

export default class SelectView extends Component {

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
            this.props.onChange(event);
        }
    }

    option() {
        if (this.validar(this.props.data)) {
            return (
                this.props.data.map(
                    (resultado, key) => (
                        <Option value={resultado.value} key={key}>{resultado.title}</Option>
                    )
                )
            )
        }
    }

    render() {
        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
        return (
            <div className="inputs-groups">
                <Select className="forms-control"
                    value={this.value()}
                    onChange={this.onChange.bind(this)}
                    style={this.props.style}
                >
                    {this.option()}
                </Select>
                <label className={`lbls-input active ${colors}`}>
                    {this.props.title}
                </label>
            </div>
        );
    }
}