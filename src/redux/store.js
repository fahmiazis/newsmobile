import {createStore, applyMiddleware} from 'redux'
import logger from 'redux-logger'
import promiseMiddleware from 'redux-promise-middleware'
import rootReducers from './reducers'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistStore, persistReducer } from 'redux-persist'

const persistConfig = {
    key: 'root',
    storage: AsyncStorage
}

const persistedReducer =  persistReducer(persistConfig, rootReducers)

export default () => {
    const store = createStore(
        persistedReducer,
        applyMiddleware(promiseMiddleware, logger),
    );
    const persistor = persistStore(store)
    return { store, persistor }
}