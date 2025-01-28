import { configureStore,combineReducers} from '@reduxjs/toolkit';
import { LoginSlice,countrySlice } from '../features';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';


const allReducer = combineReducers({
    auth: LoginSlice,
    country: countrySlice
    
  })


const persistConfig = {
    key: 'root',
    //version: 1,
    storage: AsyncStorage,
  }

  const persistedReducer = persistReducer(persistConfig, allReducer);
  


export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })
  
  export const persistor = persistStore(store);

