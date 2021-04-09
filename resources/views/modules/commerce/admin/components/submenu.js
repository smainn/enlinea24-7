
import React, { Component } from 'react';
import { Menu } from 'antd';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';

export default class MenuView extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        
        return (
            <>
                <Menu
                    onClick={this.props.onClick}
                    style={{ width: 256 }}
                    //defaultSelectedKeys={['1']}
                    //defaultOpenKeys={['sub1']}
                    mode="inline"
                >
                    {this.props.comoponent}
                </Menu>
            </>
        );
    }
}
DatePick.propTypes = {
    onClick: PropTypes.func,
}

DatePick.defaultProps = {
    
} 
