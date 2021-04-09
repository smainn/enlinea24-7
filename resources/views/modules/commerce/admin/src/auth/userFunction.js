
import axios from 'axios';

export const register = newUser => {
    return axios
        .post('/commerce/api/register', newUser, {
            headers: {'Content-Type': 'application/json'}
        })
        .then(result => {
            console.log(result);
        })
        .catch(error => {
            console.log(error);
        });
}

export const login = user => {
    return axios
        .post('/commerce/api/login', {
            login: user.usuario,
            password: user.password
        })
        .then(result => {
            localStorage.setItem('usertoken', result.data.token);
            console.log(result);
        })
        .catch(error => {
            console.log(error);
        });
}

export const getProfile = () => {
    return axios
        .get('/commerce/api/profile',  {
            headers: {Authorization: `Bearer ${localStorage.usertoken}`}
        })
        .then(result => { 
            console.log(result);
            return result.data;
        })
        .catch(error => {
            console.log(error);
        });
}