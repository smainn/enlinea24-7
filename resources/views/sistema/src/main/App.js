
import React, { Component } from 'react';

import {Layout, Breadcrumb, Icon, Spin, Button, Drawer, Card, Radio} from 'antd';

const {
  Content
} = Layout;

import 'antd/dist/antd.css';
import Navbar from './partials/header';
import Sidebar from './partials/sidebar';
import CFooter from './partials/footer';
import keysStorage from './../utils/keysStorage';
import routes from './../utils/routes';
import { removeAllData, httpRequest, readData, saveData } from './../utils/toolsStorage';
import ws from './../utils/webservices';

import PropTypes from 'prop-types';

export default class AppMain extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            visible: false,
            noSesion: false,
            colores: [
              {title: 'danger', value: false},
              {title: 'primary', value: false},
              {title: 'success', value: false},
              {title: 'secondary', value: false},
            ]
        }
    }

    onCollapse() {
        this.setState({
          collapsed: !this.state.collapsed,
        });
    }

    cerrarSesion() {
      let data = readData(keysStorage.user);
      let user = data == null ? null : JSON.parse(data);
      if (user != null) {
        httpRequest('post', ws.wslogout,{
          id: user.idusuario
        })
        .then((resp) => {
         
          if (resp.response == 1) {
            //removeAllData();
            console.log('CERRO SESION CORRECTAMENTE');
            //window.location = 'http://127.0.0.1:8000/commerce/admin/login';
            
          } else {
            
            console.log('NO CERROR SESION');
          }
          removeAllData();
          setTimeout(() => {
            window.location = routes.login;
          }, 100);
        })
        .catch((error) => {
          removeAllData();
          console.log('ERROR AL CERRAR SESION');
        })
      } else {
        removeAllData();
          setTimeout(() => {
            window.location = '/login';
          }, 100);
      }
      
    }

    componentLogout() {
      let token = readData(keysStorage.token);
      let arr = (token != undefined && token != null) ? token.split('.') : [];
      if ( token != null && token != undefined && arr.length === 3) {
        return (
            <a className="nav-link-option"
              onClick={this.cerrarSesion}
              //href={routes.inicio}
              >
              <Icon className="icono-nav-link" type="logout" />
                Cerrar Sesión 
            </a>
        );
      } else {
        return (
            <a className="nav-link-option"
              onClick={this.cerrarSesion}
              href={routes.login}>
                Iniciar Sesión
            </a>
        );
      }
      
    }
    onClose() {
      this.setState({
        visible: false,
      });
    }
    onOpen(){
      this.setState({
        visible: true,
      });
    }

    onClickColors(color) {
      var data = this.state.colores;
      for (let i = 0; i < data.length; i++) {
        if (color == data[i].title) {
          data[i].value = !data[i].value;
        }else {
          data[i].value = false;
        }
      }
      this.setState({
        colores: this.state.colores,
      });
    }
    
    onActive(color) {
      var active = '';
      var data = this.state.colores;
      for (let i = 0; i < data.length; i++) {
        if (color == data[i].title) {
          if (data[i].value) {
            active = 'active';
          }
          break;
        }
      }
      return active;
    }

    onClickUpdateColors() {
      var title = '';
      var data = this.state.colores;
      for (let i = 0; i < data.length; i++) {
        if (data[i].value) {
          title = data[i].title;
          break;
        }
      }

      var body = {
          color: title,
      };

      httpRequest('post', ws.wsconfifcolors, body)
      .then((result) => {
        //console.log(result)
        if (result.response == 1) {
          saveData(keysStorage.colors, title);
          this.onClose();
        }
        if (result.response == -2) {
          this.setState({ noSesion: true })
        }
      })
      .catch((error) => {
          console.log(error);
      });
    }

    extraerPedido() {
      try {
        var array = [];
        var archivo = new XMLHttpRequest();
        archivo.open('get', '/storage/pedido/enlinea-2020-01-31.txt', false);
        archivo.send(null);
        console.log(JSON.parse(archivo.responseText));
      } catch (error) {
        print('ERROR IN EXTRAER PEDIDO');
      }
      
    }

    render() {
      //this.extraerPedido();
      
      let data = readData(keysStorage.user);
      let key = data == null ? null : JSON.parse(data);
      var idgrupo = (typeof key == 'undefined' || key == null) ? '' : key.idgrupousuario;

      const gridStyle = {
        width: '20%',
        border: '1px solid none',
        position: 'relative',
      };

      if (this.state.noSesion) {
        removeAllData();
        return (
            <Redirect to={routes.inicio} />
        )
      }

      const componentLogout = this.componentLogout();
      var colors = readData(keysStorage.colors);
      colors = ((colors == null) || (typeof colors == 'undefined'))?'':colors;
    
        return (
          <Layout style={{ position: 'relative' }}>
            <Sidebar 
              collapsed={this.state.collapsed}
              onClick={this.onCollapse.bind(this)}
              logout={componentLogout}
              ventaendospasos={this.props.ventaendospasos}
              getventaendospasos={this.props.getventaendospasos}
            />
            
            <Layout>

              <Navbar 
                type={this.state.collapsed}
                onClick={this.onCollapse.bind(this)}
                logout={componentLogout}
                notification={this.props.notification}
              />

              <Content style={{ margin: '0 16px' }}>
                
                <Breadcrumb style={{margin: '16px 0'}}></Breadcrumb>

                <div style={{ padding: 18, background: '#fff', minHeight: 360 }}>
                  {this.props.children}
                </div>

              </Content>  
              {(idgrupo == 1)?
                <button onClick={this.onOpen.bind(this)}
                  type='button' className={`btn-open-option ${colors}`}>
                  <Icon type='setting' spin rotate={180}
                    style={{'lineHeight': 0, 'position': 'relative', 'color': 'white',}} />
                </button>:null  
              } 

              <Drawer
                title='Configuracion'
                visible={this.state.visible}
                placement='right'
                width={300}
                bodyStyle={{'paddingLeft': 0, 'paddingRight': 0}}
                closable={false}
                onClose={this.onClose.bind(this)}
              >
                <div style={
                    { 
                      padding: '30px', paddingLeft: 1, paddingRight: 1,
                      }}
                >
                  <Card title="Panel de Color" type="inner" bordered={true} 
                    style={{ width: '100%' }}
                  >
                      <div style={{ 
                        width: '100%', 'display': 'flex', 'flexWrap': 'wrap',
                        'justifyContent': 'center', 'alignItems': 'center',
                      }}>
                        <Card.Grid style={gridStyle}
                          onClick={this.onClickColors.bind(this, 'danger')}
                        >

                          <div className={`swatch-holder ${
                              this.onActive('danger')
                            } bg-danger`} 
                          ></div>

                        </Card.Grid>
                        <Card.Grid style={gridStyle}
                          onClick={this.onClickColors.bind(this, 'primary')}
                        >

                          <div className={`swatch-holder ${
                              this.onActive('primary')  
                            } bg-primary`}
                          ></div>

                        </Card.Grid>
                        <Card.Grid style={gridStyle}
                          onClick={this.onClickColors.bind(this, 'success')}
                        >

                          <div className={`swatch-holder ${
                              this.onActive('success')
                            } bg-success`}
                            
                          ></div>

                        </Card.Grid>
                        <Card.Grid style={gridStyle}
                          onClick={this.onClickColors.bind(this, 'secondary')}
                        >
                          <div className={`swatch-holder 
                            ${this.onActive('secondary')} bg-secondary`}
                            
                          ></div>

                        </Card.Grid>
                      </div>

                      <div style={{'width': '100%', 'paddingTop': '10px', 'textAlign': 'center'}}>
                        <Button type="primary" onClick={this.onClickUpdateColors.bind(this)}
                          style={{'marginRight': 5}}>
                          Aceptar
                        </Button>
                        <Button onClick={this.onClose.bind(this)}>
                          Cancelar
                        </Button>
                      </div>
                  </Card>
                </div>
              </Drawer>
              <CFooter />

            </Layout>
          </Layout>

        );
    }
}

AppMain.propTypes = {
  notification: PropTypes.array,
  ventaendospasos: PropTypes.bool,
}

AppMain.defaultProps = {
  notification: [],
  ventaendospasos: false,
}


