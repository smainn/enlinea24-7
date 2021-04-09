
import { createStore, combineReducers } from 'redux';

import result from './reducers/result';

const reducer = combineReducers({
    result,
});

const store = createStore(reducer);

export default store;
