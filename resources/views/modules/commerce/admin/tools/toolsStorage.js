import axios from 'axios';
import keysStorage from './keysStorage';
import { dateToString, hourToString } from './toolsDate';

const saveData = (key, data) => {
    localStorage.setItem(key, data);
}

const saveMultiData = (keys, datas) => {
    if (keys.length != datas.length) {
        throw new Error('(saveMultiData) No se pudo guardar, Longitud distintas de los paramteros');
        return;
    }
    let length = datas.length;
    for (let i = 0; i < length; i++) {
        localStorage.setItem(keys[i], datas[i]);
    }
}

const readData = (key) => {
    return localStorage.getItem(key);
}

const removeData = (key) => {
    localStorage.removeItem(key);
}

const removeAllData = () => {
    let img = localStorage.getItem(keysStorage.img);
    let colors = localStorage.getItem(keysStorage.colors);
    localStorage.clear();
    localStorage.setItem(keysStorage.img, img);
    localStorage.setItem(keysStorage.colors, colors);
}

const saveSessionData = (key, data) => {
    sessionStorage.setItem(key, data);
}

const readSessionData = (key) => {
    return sessionStorage.getItem(key);
}

const httpRequest = (method, uri, data = {}) => {
    const token = localStorage.getItem(keysStorage.token);
    const user = JSON.parse(localStorage.getItem(keysStorage.user));
    const connection = localStorage.getItem(keysStorage.connection);
    //console.log(connection);
    let data_aditional = {
        x_idusuario: user == undefined ? 0 : user.idusuario,
        x_grupousuario: user == undefined ? 0 : user.idgrupousuario,
        x_login: user == undefined ? null : user.login,
        x_fecha: dateToString(new Date()),
        x_hora: hourToString(new Date()),
        x_conexion: connection
    };
    const body = Object.assign(data, data_aditional);
    let config = {
        method: method,
        url: uri,
        responseType: 'json',
        headers: {
            Authorization: 'Bearer ' + token
        }
    };
    let met = method.toLowerCase();
    if (met == 'get' || met == 'delete') {
        config.params = body;
    } else {
        config.data = body;
    }
    //console.log('CONFIG ', config);
    return axios(config)
            .then((response) => {
                if (response.status == 200) {
                    return response.data;
                } else if (response.status == 401 || response.status == 405) {// significa que la session se termino o no inicio sesion
                    return { response: -2 };
                } else {
                    return response.data;
                }
                //console.log('RESPONSE ===> ', response);
                
            })
            .catch((error) => {
                console.log(error.response);
                if (error.response.status === 401 || error.response.status == 405) {
                    //return {response: -2};// significa que la session se termino
                    return {response: -2};// significa que la session se termino o no inicio sesion
                }
                return {response: -1}
            });
}

export {
    saveData,
    readData,
    saveMultiData,
    removeData,
    removeAllData,
    saveSessionData,
    readSessionData,
    httpRequest
}