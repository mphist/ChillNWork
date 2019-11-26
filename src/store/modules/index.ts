import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import media from "./media";
import todo from "./todo";

const rootReducer = combineReducers({
  media,
  todo
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["media"]
};

const enhancedReducer = persistReducer(persistConfig, rootReducer);

export default enhancedReducer;

export type RootState = ReturnType<typeof enhancedReducer>;
