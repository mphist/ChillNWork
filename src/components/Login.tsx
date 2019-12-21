import React from "react";
import SocialLoginButton from "./SocialLoginButton";
import LocalLogin from "./LocalLogin";

import "./Login.scss";

const Login = () => {
  const handleSocialLogin = (provider: string) => {
    window.location.replace(`http://localhost:4000/auth/${provider}`);
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
      <LocalLogin />
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
