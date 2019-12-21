import React, { useEffect } from "react";
import Header from "../components/Header";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/modules";
import axios from "axios";
import { login, logout } from "../store/modules/auth";

const HeaderContainer = () => {
  const {
    is_loggedin: loginStatus,
    with_credentials: withCredentials
  } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(
      `useEffect called with loginStatus value = ${loginStatus} 
      and withCredentials value = ${withCredentials}`
    );

    if (!loginStatus) {
      axios({
        method: "post",
        url: "http://localhost:4000/auth/validateAuth",
        withCredentials: withCredentials
      })
        .then(function(response) {
          if (response.data.is_loggedin) {
            console.log("dispatch login");
            dispatch(login());
          }
        })
        .catch(function(err) {
          console.log("Validation error", err);
        });
    }
  });

  const handleLogout = () => {
    axios({
      method: "post",
      url: "http://localhost:4000/auth/logout",
      withCredentials: true
    })
      .then(function(response) {
        console.log("PRINT RESPONSE", response.data);
        if (response.data === "Session is destroyed") {
          console.log("dispatch logout");
          dispatch(logout());
          window.location.replace("/");
        }
      })
      .catch(function(err) {
        console.log("Validation error", err);
      });
  };

  return <Header loginStatus={loginStatus} handleLogout={handleLogout} />;
};

export default HeaderContainer;
