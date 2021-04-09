
import React, { Component } from 'react';

const style = {
    reportrange: {
        'background': '#fff',
        'cursor': 'pointer',
        'padding': '5px 10px',
        'border': '1px solid #ccc'
    }
};

export default class Home extends Component {
    render() {
        return (
            <div>
                <div className="row" id="inicio-table">
                    Estas en Home
                </div>
            </div>

        );
    }
}
