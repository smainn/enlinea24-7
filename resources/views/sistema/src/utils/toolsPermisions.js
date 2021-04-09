
import { readData } from './toolsStorage';
import keysStorage from './keysStorage';


const readPermisions = (key) => {
    //console.log('LLAVE PRIVADA ', secretKey.key);
    let result = readData(keysStorage.permisions);
    if (result) {
        let data = [];
        try {
            data = JSON.parse(result);
        } catch (error) {
            return { visible: 'N', editable: 'N' }; 
        }
        
        //let data = JSON.parse(atob(result));
        //console.log('DATA ===> ', data);
        let length = data != null ? data.length : 0;
        for (let i = 0; i < length; i++) {
            if (data[i].id == key) {
                return data[i];
            }
        }
    }
    //return undefined;
    //return { visible: 'A', editable: 'A' };
    return { visible: 'N', editable: 'N' };
}

export {
    readPermisions
}