
import React, { Component, Fragment } from 'react';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import ws from '../utils/webservices';
import { httpRequest, removeAllData, readData } from '../utils/toolsStorage';
import routes from '../utils/routes';
import keysStorage from '../utils/keysStorage';


export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            noSesion: false,
        }
    }


    componentDidMount() {
        this.inSession();
    }

    inSession() {
        let token = readData(keysStorage.token);
        let jsonEncode = readData(keysStorage.user);
        let user = jsonEncode == null ? null : JSON.parse(jsonEncode);
        if ((token == null) || (typeof token == 'undefined') ||
            (user == null) || (typeof user == 'undefined')) {
            this.setState({ noSesion: true });
            
        } else {
            
            httpRequest('post', ws.wsverificarsesion, {
                id: user.idusuario,
                token: token,
            })
            .then((resp) => {
                
                if (resp.response == -2) {
                    this.setState({ noSesion: true })
                }
            })
            .catch((error) => {
                console.log('ERROR ', error);
            })
        }
    }

    

    render() {
        if (this.state.noSesion) {
            removeAllData();
            return (
                <Redirect to={routes.inicio} />
            )
        }

        return (
            <div>HOME</div>
        );
    }
}

Home.propTypes = {
    title: PropTypes.string,
}

Home.defaultProps = {
    title: 'Caso Uso',
}


