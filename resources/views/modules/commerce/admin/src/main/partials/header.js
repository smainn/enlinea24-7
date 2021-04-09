import React, { Component, Fragment } from 'react';
import { Layout, Menu, Dropdown, Icon } from 'antd';
import {withRouter} from 'react-router-dom';
import keysStorage from '../../../tools/keysStorage';
import { readData } from '../../../tools/toolsStorage';
import 'antd/dist/antd.css';
import colors from '../../../tools/colors';
const { Header } = Layout;

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
            let url = '/commerce/admin/perfil';
            this.props.history.push(url);
        }, 400);
    }

    render() {
        const user = readData(keysStorage.user) == null ? {foto:null} : JSON.parse(readData(keysStorage.user));
        const menu = (
            <Menu className={(this.state.dropdown_user)?'menu-user-dropdown active':'menu-user-dropdown'}>
                <div className="user-perfil-navbar">
                    <div className="logo-perfil">
                        <img src={(user.foto == null)?'/img/perfil.png':user.foto} alt="none" className="logo-img-user" />
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
        return (
            <Header 
                style={{ 'padding': 0,}}
                // style={{ position: 'fixed', zIndex: 1, width: '100%', 'padding': 0 }}
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
                        <div>
                            <Dropdown overlay={menu} trigger={['click']} visible={this.state.visible}
                                onVisibleChange={this.onClickDropDownUser.bind(this)}>
                                <a className={`ant-dropdown-link ${colors}`} href="#">
                                    <img src={(user.foto == null)?'/img/perfil.png':user.foto} alt="none" className="icon-img-user" />
                                </a>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </Header>
            // <Fragment>
            //     <Header style={{ background: '#fff', padding: 0 }}>
            //         <Icon
            //         className="trigger"
            //         type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
            //         onClick={this.toggle}
            //         />
            //     </Header>
            // </Fragment>
        );
    }
}
export default withRouter(Navbar);

