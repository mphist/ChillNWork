import React from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../store/modules/auth";

import "./LocalLogin.scss";

const LocalLogin = () => {
  const dispatch = useDispatch();

  const fetchUser = async (email: string, password: string) => {
    try {
      const user = await axios.post("http://localhost:4000/auth/check", {
        email: email,
        password: password
      });
      console.log("fetched user", user);
      return user;
    } catch (error) {
      console.log("error fetching user", error.response);
      return error.response;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("handlesubmit");
    e.preventDefault();
    const email = (document.getElementById("login-email") as HTMLInputElement)
      .value;
    const password = (document.getElementById(
      "login-password"
    ) as HTMLInputElement).value;

    fetchUser(email, password)
      .then(function(user) {
        if (user) {
          console.log("user data", user);
          if (user.status === 200) {
            console.log("login successful!!");
            dispatch(login());
            (document.getElementById("login-form") as HTMLFormElement).submit();
          } else if (
            user.status === 401 &&
            user.data === "Incorrect password"
          ) {
            console.log("Incorrect password");
            const el = document.getElementById("incorrect-pw-msg");
            if (el !== null) {
              el.className = "incorrect-pw-msg-active";
            }
          } else if (
            user.status === 401 &&
            user.data === "Email doesn't exist"
          ) {
            console.log("Incorrect email");
            const el = document.getElementById("incorrect-email");
            if (el != null) {
              el.className = "incorrect-email-active";
            }
          }
        }
      })
      .catch(function(err) {
        console.log("Error fetching user", err);
      });
  };

  return (
    <div className="local-login">
      <div className="login-form">
        <form
          id="login-form"
          action="http://localhost:4000/auth"
          method="post"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            id="login-email"
            name="login-email"
            className="email"
            placeholder="Email"
            required
          />
          <br />
          <div id="incorrect-email" className="incorrect-email">
            <span className="msg">
              Couldn't find your account. Try again or create a new account.
            </span>
          </div>
          <input
            id="login-password"
            type="password"
            name="login-password"
            className="password"
            placeholder="Password"
            required
          />
          <br />
          <div id="incorrect-pw-msg" className="incorrect-pw-msg">
            <span className="msg">
              Wrong password. Try again or click Forgot password to reset it.
            </span>
          </div>
          <div className="bottom-wrapper">
            <span className="forgot-btn">Forgot password?</span>
            <input className="login-btn" type="submit" value="Log in" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocalLogin;
