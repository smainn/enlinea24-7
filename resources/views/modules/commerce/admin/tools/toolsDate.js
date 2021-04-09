
const cambiarFormato = (date) => {
    let arrayDate = date.split('-');
    let year = parseInt(arrayDate[0]);
    let month = (parseInt(arrayDate[1]) < 10)?'0' + parseInt(arrayDate[1]):parseInt(arrayDate[1]);
    let day = (parseInt(arrayDate[2]) < 10)?'0' + parseInt(arrayDate[2]):parseInt(arrayDate[2]);

    return day + '/' + month + '/' + year;
}

const stringToDate = (dateString) => {
    let arrayDate = dateString.split('-');
    let year = parseInt(arrayDate[0]);
    let month = parseInt(arrayDate[1])-1;
    let day = parseInt(arrayDate[2]);
    return new Date(year, month, day);
}

const dateToString = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    return year + '-' + month + '-' + day;
}

const dateHourToString = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    let fecha = year + '-' + month + '-' + day;
    
    let hour = date.getHours();
    let minutes = date.getMinutes();
    hour = hour < 10 ? '0' + hour : hour;
    minutes = minutes < 10 ? '0' + minutes : minutes;
  
    let hora = hour + ':' + minutes;
    return fecha + ' ' + hora;
}

export {
    stringToDate,
    dateToString,
    dateHourToString,
    cambiarFormato,
};
