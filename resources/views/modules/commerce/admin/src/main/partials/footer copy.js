
import React, { Component } from 'react';

import {Layout} from 'antd';
const {
    Footer
} = Layout;
import 'antd/dist/antd.css';

import PropTypes from 'prop-types';
import colors from '../../../tools/colors';

export default class CFooter extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {

        return (
            <Footer style={{ textAlign: 'center'}}>
                {this.props.title} <a target="_blank" href="https://www.smainn.com/">Smainn</a>
            </Footer> 
        );
    }
}

CFooter.propTypes = {
    title: PropTypes.string,
}

CFooter.defaultProps = {
    title: '© 2019 Powered by ',
}


