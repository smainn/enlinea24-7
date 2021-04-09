
import React, { Component, Fragment } from 'react';
import { Layout, Menu, Dropdown, Icon, Badge } from 'antd';
import {withRouter} from 'react-router-dom';
import keysStorage from '../../utils/keysStorage';
import { readData } from '../../utils/toolsStorage';
import 'antd/dist/antd.css';
import routes from '../../utils/routes';
const { Header } = Layout;

import PropTypes from 'prop-types';

//const fs = require("fs");

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            dropdown_user: false,
            visible: false,
        }
    }

    validar(data) {
        return (typeof data == 'undefined') ? false : true;
    }

    onCollapse(event) {
        if (this.validar(this.props.onClick)) {
            this.props.onClick(event);
        }
    }

    onClickDropDownUser() {
        this.setState({
            dropdown_user: !this.state.dropdown_user,
        });
        setTimeout(() => {
            this.setState({
                visible: !this.state.visible
            });
        }, 400);
    }

    onClickPerfil() {
        this.setState({
            dropdown_user: !this.state.dropdown_user,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
            });
            let url = routes.usuario_perfil;
            this.props.history.push(url);
        }, 400);
    }

    imgPerfil() {
        const user = readData(keysStorage.user) == null ? {foto: null} : JSON.parse(readData(keysStorage.user));
        if (user.foto == null || user.foto == '' || (typeof user.foto == undefined)) {
            return (
                <img src='/img/perfil.png' alt="none" className="icon-img-user" />
            );
        }
        if (typeof user.is_file == 'boolean') {
            if (user.is_file) {
                return (
                    <img src={user.foto} alt="none" className="icon-img-user" />
                );
            }else {
                return (
                    <img src='/img/perfil.png' alt="none" className="icon-img-user" />
                );
            }
        }
    }

    imgPerfilMenu() {
        const user = readData(keysStorage.user) == null ? {foto: null} : JSON.parse(readData(keysStorage.user));
        if (user.foto == null || user.foto == '' || (typeof user.foto == undefined)) {
            return (
                <img src='/img/perfil.png' alt="none" className="logo-img-user" />
            );
        }
        if (typeof user.is_file == 'boolean') {
            if (user.is_file) {
                return (
                    <img src={user.foto} alt="none" className="logo-img-user" />
                );
            }else {
                return (
                    <img src='/img/perfil.png' alt="none" className="logo-img-user" />
                );
            }
        }
    }

    render() {
        const user = readData(keysStorage.user) == null ? {foto:null} : JSON.parse(readData(keysStorage.user));
        const menu = (
            <Menu className={(this.state.dropdown_user)?'menu-user-dropdown active':'menu-user-dropdown'}>
                <div className="user-perfil-navbar">
                    <div className="logo-perfil">
                        {this.imgPerfilMenu()}
                    </div>
                    <div className="user-perfil"></div>
                </div>
                <div className="nav-link-perfil">
                    <a className="nav-link-option" onClick={this.onClickPerfil.bind(this)}> 
                        <Icon className="icono-nav-link" type="user" /> 
                            Perfil
                    </a>
                </div>
                <Menu.Divider />
                <div className="nav-link-perfil mtp-4">
                    {this.props.logout}
                </div>
            </Menu>
        );

        var colors = readData(keysStorage.colors);
        colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
        //console.log(this.props.notification)
        return (
            <Header 
                style={{ 'padding': 0,}}
            >
                <div className={`header-container ${colors}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', 
                         width: '100%' }}>
                        <div>
                            <Icon
                                type={this.props.type ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.onCollapse.bind(this)}
                                className={`trigger ${colors}`}
                            />
                        </div>
                        <div style={{display: 'flex',}}>
                            <div style={{height: '100%', width: 40, }}>
                                <div style={{width: '100%', height: '100%', position: 'relative'}}>
                                    <Badge count={this.props.notification.length} style={{ margin: 0, background: '#fff', color: '#999', 
                                            boxShadow: '0 0 0 1px #d9d9d9 inset', position: 'absolute', top: -10, right: -20, fontWeight: 'bold'
                                        }}
                                    >
                                        <a href="#" className="head-example" />
                                    </Badge>
                                    {/* <Icon type="bell" 
                                        style={{fontSize: 25, position: 'absolute', top: 22, 
                                            left: -5, color: 'blue', cursor: 'pointer',
                                        }}
                                    /> */}
                                </div>
                            </div>
                            <div style={{height: '100%'}}>
                                <Dropdown overlay={menu} trigger={['click']} visible={this.state.visible}
                                    onVisibleChange={this.onClickDropDownUser.bind(this)}>
                                    <a className={`ant-dropdown-link ${colors}`} href="#">
                                        {this.imgPerfil()}
                                    </a>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </Header>
        );
    }
}
Navbar.propTypes = {
    notification: PropTypes.array,
  }
  
Navbar.defaultProps = {
    notification: [],
}
export default withRouter(Navbar);

