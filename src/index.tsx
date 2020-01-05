import React, { createContext } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import rootReducer from "../src/store/modules";
import enhancedReducer from "../src/store/modules";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import thunkMiddleware from "redux-thunk";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: typeof compose;
  }
}

const devTool =
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();

const store = createStore(enhancedReducer, applyMiddleware(thunkMiddleware));
const persistor = persistStore(store);

export const PersistorContext = createContext(persistor);

ReactDOM.render(
  <Provider store={store}>
    <PersistorContext.Provider value={persistor}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </PersistorContext.Provider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
