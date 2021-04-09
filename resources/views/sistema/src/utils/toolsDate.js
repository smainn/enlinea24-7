
const cambiarFormato = (date = dateToString()) => {
    let arrayDate = date.split('-');
    let year = parseInt(arrayDate[0]);
    let month = (parseInt(arrayDate[1]) < 10)?'0' + parseInt(arrayDate[1]):parseInt(arrayDate[1]);
    let day = (parseInt(arrayDate[2]) < 10)?'0' + parseInt(arrayDate[2]):parseInt(arrayDate[2]);

    return day + '/' + month + '/' + year;
}

const format_fecha_print = (date = dateToString()) => {
    let arrayDate = date.split('-');
    let year = parseInt(arrayDate[0]);
    let month = (parseInt(arrayDate[1]) < 10)?'0' + parseInt(arrayDate[1]):parseInt(arrayDate[1]);
    let day = (parseInt(arrayDate[2]) < 10)?'0' + parseInt(arrayDate[2]):parseInt(arrayDate[2]);

    return day + '_' + month + '_' + year;
}

const stringToDate = (dateString, format = 'f1') => {
    let arrayDate = dateString.split('-');
    let ele1 = parseInt(arrayDate[0]);
    let ele2 = parseInt(arrayDate[1])-1;
    let ele3 = parseInt(arrayDate[2]);
    switch (format) {
        case 'f1':
            return new Date(ele1, ele2, ele3);
        case 'f2':
            return new Date(ele3, ele2, ele1);
        default:
            return new Date(ele1, ele2, ele3);
    }
}

const stringToDateB = (dateString, separador = '-') => {
    let arrayDate = dateString.split(separador);
    let year = parseInt(arrayDate[0]);
    let month = parseInt(arrayDate[1])-1;
    let day = parseInt(arrayDate[2]);
    return new Date(year, month, day);
}

const dateToStringB = (date, separador = '-') => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    return year + separador + month + separador + day;
}

const dateToString = (date = new Date(), format = 'f1') => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    switch (format) {
        case 'f1':
            return year + '-' + month + '-' + day;
        case 'f2':
            return day + '-' + month + '-' + year;
        default:
            return year + '-' + month + '-' + day;
    }
}

const dateHourToString = (date, format = 'f1') => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    let fecha = '';
    switch (format) {
        case 'f1':
            fecha = year + '-' + month + '-' + day;
            break;
        case 'f2':
            fecha = day + '-' + month + '-' + year;
            break;
        default:
            fecha = year + '-' + month + '-' + day;
    }

    let hour = date.getHours();
    let minutes = date.getMinutes();
    let segundos = date.getSeconds();
    hour = hour < 10 ? '0' + hour : hour;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    segundos = segundos < 10 ? '0' + segundos : segundos;

    let hora = hour + ':' + minutes + ':' + segundos;
    return fecha + ' ' + hora;
}

const hourToString = (date = new Date()) => {
    let hour = date.getHours();
    let minutes = date.getMinutes();
    hour = hour < 10 ? '0' + hour : hour;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hour + ':' + minutes;
}

const fullHourToString = (date = new Date()) => {
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let segundos = date.getSeconds();
    hour = hour < 10 ? '0' + hour : hour;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    segundos = segundos < 10 ? '0' + segundos : segundos;
    //milisegundos = milisegundos <
    return hour + ':' + minutes + ':' + segundos;
}

const convertYmdToDmy = (dateString, separador = '-') => {
    if ( separador == '/' ) {
        if (dateString != null && dateString != '' && dateString != undefined) {
            let arrayDate = dateString.split('/');
            let day = arrayDate[0];
            let month = arrayDate[1];
            let year = arrayDate[2];
            return day + '-' + month + '-' + year;
        }
    }
    if (dateString != null && dateString != '' && dateString != undefined) {
        let arrayDate = dateString.split('-');
        let year = arrayDate[0];
        let month = arrayDate[1];
        let day = arrayDate[2];
        return day + '-' + month + '-' + year;
    }
    return '';
}

const convertDmyToYmd = (dateString) => {
    if (dateString != null && dateString != '' && dateString != undefined) {
        let arrayDate = dateString.split('-');
        let day = arrayDate[0];
        let month = arrayDate[1];
        let year = parseInt(arrayDate[2]);
        return year + '-' + month + '-' + day;
    }
    return '';
}

const convertDmyToYmdWithHour = (dateString) => {
    if (dateString != null && dateString != '' && dateString != undefined) {
        let arrayDateHour = dateString.split(' ');
        let arrayDate = arrayDateHour[0].split('-');
        let day = arrayDate[0];
        let month = arrayDate[1];
        let year = arrayDate[2];
        return year + '-' + month + '-' + day + ' ' + arrayDateHour[1];
    }
    return '';
}

const convertYmdToDmyWithHour = (dateString) => {
    if (dateString != null && dateString != '' && dateString != undefined) {
        let arrayDateHour = dateString.split(' ');
        let arrayDate = arrayDateHour[0].split('-');
        let year = arrayDate[0];
        let month = arrayDate[1];
        let day = arrayDate[2];
        return day + '-' + month + '-' + year + ' ' + arrayDateHour[1];
    }
    return '';
}

export {
    stringToDate,
    dateToString,
    dateHourToString,
    hourToString,
    cambiarFormato,
    stringToDateB,
    fullHourToString,
    dateToStringB,
    convertYmdToDmy,
    convertYmdToDmyWithHour,
    convertDmyToYmd,
    convertDmyToYmdWithHour,
    format_fecha_print,
};
