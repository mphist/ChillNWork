import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
//import storage from "redux-persist/lib/storage";
import storageSession from "redux-persist/lib/storage/session";
import media from "./media";
import todo from "./todo";
import auth from "./auth";

const rootReducer = combineReducers({
  media,
  todo,
  auth
});

const persistConfig = {
  key: "root",
  storage: storageSession,
  blacklist: ["media"]
};

const enhancedReducer = persistReducer(persistConfig, rootReducer);

export default enhancedReducer;

export type RootState = ReturnType<typeof enhancedReducer>;
