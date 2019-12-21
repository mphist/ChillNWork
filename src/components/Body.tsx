import React from "react";
import MediaContainer from "../containers/MediaContainer";
import TodoContainer from "../containers/TodoContainer";
import Login from "./Login";
import Register from "./Register";

import "../components/Body.scss";

const Body = () => {
  return (
    <div className="body">
      <MediaContainer />
      <TodoContainer />
      <Login />
      <Register />
      <div
        id="patch"
        className="patch"
        onClick={() => {
          const el = document.getElementById("login-overlay");
          const el2 = document.getElementById("patch");
          const el3 = document.getElementById("register-overlay");
          console.log("el", el);
          console.log("el2", el2);

          if (el != null) {
            el.className = "login-overlay-inactive";
          }
          if (el2 !== null) {
            el2.className = "patch";
          }
          if (el3 !== null) {
            el3.className = "register-overlay-inactive";
          }
        }}
      ></div>
    </div>
  );
};

export default Body;
