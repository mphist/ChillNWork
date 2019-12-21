import React, { useState } from "react";
import "./Register.scss";
import { useDispatch } from "react-redux";
import { login } from "../store/modules/auth";

const Register = () => {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //e.preventDefault();
    const { className: name, value } = e.target;

    if (name === "password") {
      setPassword(value);
    } else if (name === "password2") {
      setPassword2(value);
    }
  };

  const validateForm = () => {
    let validForm = true;
    if (password !== "" || password2 !== "") {
      if (password !== password2) {
        const el = document.getElementById("error-msg");
        if (el !== null) {
          el.className = "error-msg-active";
        }
        validForm = false;
      }
    }

    return validForm;
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      (document.getElementById("create-form") as HTMLFormElement).submit();
      // account creation successful...
      dispatch(login());
    } else {
      console.log("form has errors");
    }
  };

  return (
    <div id="register-overlay" className="register-overlay">
      <div className="header-wrapper">
        <h3 className="register-header">Create an account</h3>
      </div>
      <div className="btn-wrapper">
        <span
          className="close-btn"
          onClick={() => {
            const el = document.getElementById("register-overlay");
            const el2 = document.getElementById("patch");
            const errEl = document.getElementById("error-msg");
            if (errEl !== null) {
              errEl.className = "error-msg";
            }
            (document.getElementById(
              "email-register"
            ) as HTMLInputElement).value = "";
            (document.getElementById(
              "password-register"
            ) as HTMLInputElement).value = "";
            (document.getElementById(
              "password2-register"
            ) as HTMLInputElement).value = "";

            if (el != null) {
              el.className = "register-overlay-inactive";
            }

            if (el2 != null) {
              el2.className = "patch";
            }
          }}
        >
          X
        </span>
      </div>
      <div className="create-account">
        <div className="create-form">
          <form
            action="http://localhost:4000/register"
            id="create-form"
            method="post"
            onSubmit={handleSubmit}
          >
            <label className="label-email">Email</label>
            <input
              type="email"
              pattern="[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*"
              id="email-register"
              name="email"
              className="email"
              required
            />
            <br />
            <label className="label-password">Password</label>
            <input
              type="password"
              id="password-register"
              name="password"
              className="password"
              minLength={8}
              required
              onChange={handleChange}
            />
            <span className="note-password">
              Password must be at least 8 characters
            </span>
            <br />
            <label className="label-password2">Re-type password</label>
            <input
              type="password"
              id="password2-register"
              name="password2"
              className="password2"
              minLength={8}
              required
              onChange={handleChange}
            />
            {/* <span id="mismatch" className="mismatch">
              Passwords don't match. Please try again
            </span> */}
            <div id="error-msg" className="error-msg">
              <span className="msg">
                Passwords don't match. Please try again.
              </span>
            </div>

            <input
              id="submit-btn"
              type="submit"
              className="submit-btn"
              style={{ display: "none" }}
            />
            <br />
            <div className="bottom-wrapper">
              <input className="create-btn" type="submit" value="Create" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
