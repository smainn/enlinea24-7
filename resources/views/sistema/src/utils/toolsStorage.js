import axios from 'axios';
import keysStorage from './keysStorage';
import { dateToString, hourToString } from './toolsDate';
import strings from './strings';

const saveData = (key, data) => {
    let enco = btoa(data);
    localStorage.setItem(key, enco);
}

const saveMultiData = (keys, datas) => {
    if (keys.length != datas.length) {
        throw new Error('(saveMultiData) No se pudo guardar, Longitud distintas de los paramteros');
        return;
    }
    try {
        let length = datas.length;
        for (let i = 0; i < length; i++) {
            let data = btoa(datas[i]);
            localStorage.setItem(keys[i], data);
        }
        return true;
    } catch (error) {
        return false;
    }
}

const readData = (key) => {  
    try {
        let val = localStorage.getItem(key);
        let item = val == null ? null : atob(val);
        return item; 
    } catch (error) {
        return null;
    }
    
}

const removeData = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        return false;
    }
}

const removeAllData = () => {
    try {
        let img = localStorage.getItem(keysStorage.img);
        let colors = localStorage.getItem(keysStorage.colors);
        localStorage.clear();
        localStorage.setItem(keysStorage.img, img);
        localStorage.setItem(keysStorage.colors, colors);
        return true;
    } catch (error) {
        return false;
    }
    
}

const saveSessionData = (key, data) => {
    try {
        sessionStorage.setItem(key, data);
        return true;
    } catch (error) {
        return false;
    }
}

const readSessionData = (key) => {
    try {
        return sessionStorage.getItem(key);
    } catch (error) {
        return false;
    }
}

const getConfigColor = () => {
    let color = readData(keysStorage.colors);
    switch (color) {
        case 'primary':
            return strings.color_primary;
        case 'secondary':
            return strings.color_secondary;
        case 'success':
            return strings.color_success;
        case 'danger':
            return strings.color_danger;
    }
}

const httpRequest = (method, uri, data = {}) => {
    const token = readData(keysStorage.token);
    const user = JSON.parse(readData(keysStorage.user));
    const connection = readData(keysStorage.connection);
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
            'Authorization': 'Bearer ' + token
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
                console.log(response)
                if (response.status == 200) {
                    return response.data;
                } else if (response.status == 401 || response.status == 405) {// significa que la session se termino o no inicio sesion
                    return { response: -2 };
                } else {
                    return response.data;
                }
                
            })
            .catch((error) => {
                console.log(error.response);
                if (error.response.status === 401 || error.response.status == 405) {
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
    httpRequest,
    getConfigColor
}