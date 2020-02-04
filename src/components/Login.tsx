import React, { Dispatch } from "react";
import SocialLoginButton from "./SocialLoginButton";
import LocalLogin from "./LocalLogin";
import axios from "axios";
import { fetchTodos } from "../store/modules/todo";
import "./Login.scss";

const Login = () => {
  const handleSocialLogin = (provider: string) => {
    window.location.replace(
      process.env.REACT_APP_SITE_API_URL + `/auth/${provider}`
    );
  };

  const fetchUser = async (email: string, password: string) => {
    try {
      const user = await axios.post(
        process.env.REACT_APP_SITE_API_URL + "/auth/check",
        {
          email: email,
          password: password
        }
      );
      return user;
    } catch (error) {
      console.log("error fetching user", error.response);
      return error.response;
    }
  };

  const fetchTodoThunk = (email: string) => {
    return (dispatch: Dispatch<any>) => {
      return axios({
        method: "post",
        url: process.env.REACT_APP_SITE_API_URL + "/data/todo",
        data: {
          email: email
        }
      }).then(response => {
        console.log("fetchTodoThunk called", response.data);
        dispatch(fetchTodos(response.data));
      });
    };
  };

  return (
    <div id="login-overlay" className="login-overlay">
      <div className="header-wrapper">
        <h3 className="login-header">Login</h3>
      </div>
      <div className="btn-wrapper">
        <span
          className="close-btn"
          onClick={() => {
            const el = document.getElementById("login-overlay");
            const el2 = document.getElementById("patch");

            if (el != null) {
              el.className = "login-overlay-inactive";
            }

            if (el2 != null) {
              el2.className = "patch";
            }
          }}
        >
          X
        </span>
      </div>
      <LocalLogin fetchUser={fetchUser} fetchTodoThunk={fetchTodoThunk} />
      <div className="social-login-wrapper">
        <SocialLoginButton
          provider={"google"}
          onSocialLogin={handleSocialLogin}
        />
        <SocialLoginButton
          provider={"facebook"}
          onSocialLogin={handleSocialLogin}
        />
      </div>
      <div className="register-wrapper">
        <span>New here? </span>
        <span
          className="register-link"
          onClick={() => {
            const el = document.getElementById("login-overlay");
            const el2 = document.getElementById("register-overlay");
            const emailInput = document.getElementById("email-register");
            if (el != null) {
              el.className = "login-overlay-inactive";
            }
            if (el2 != null) {
              el2.className = "register-overlay-active";
              if (emailInput !== null) {
                emailInput.focus();
              }
            }
          }}
        >
          Create an account
        </span>
      </div>
    </div>
  );
};

export default Login;
