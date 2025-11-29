import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { api } from "../services/api/api";
import userReducer from "../features/user/userSlice";
import authReducer from "../features/auth/authSlice";
import conversationReducer from "../features/conversation/conversationSlice";

export type RootState = ReturnType<typeof store.getState>;

const authPersistConfig = {
  key: "auth",
  storage,
};

// Combine reducers
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  user: userReducer,
  conversation: conversationReducer,
  [api.reducerPath]: api.reducer,
});

// Persist the root reducer
const persistedReducer = persistReducer(
  {
    key: "root",
    storage,
    blacklist: [api.reducerPath], // don't persist RTK query cache
  },
  rootReducer
);

// Now create the store using persistedReducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware),
});

export const persistor = persistStore(store);
