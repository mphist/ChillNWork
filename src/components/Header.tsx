import React from "react";
import "./Header.scss";

const Header: React.FC = () => {
  return (
    <div className="header">
      <span
        className="slider"
        onClick={() => {
          const el = document.getElementById("todo-overlay");
          if (el != null) {
            el.className = "todo-overlay-active";
          }
        }}
      >
        <svg
          version="1.1"
          id="Capa_1"
          x="0px"
          y="0px"
          width="20px"
          height="20px"
          viewBox="0 0 612 612"
        >
          <path
            d="M581.4,520.199H30.6c-16.891,0-30.6,13.709-30.6,30.6C0,567.691,13.709,581.4,30.6,581.4h550.8
   c16.891,0,30.6-13.709,30.6-30.602C612,533.908,598.291,520.199,581.4,520.199z M30.6,91.799h550.8
   c16.891,0,30.6-13.708,30.6-30.6c0-16.892-13.709-30.6-30.6-30.6H30.6C13.709,30.6,0,44.308,0,61.2
   C0,78.091,13.709,91.799,30.6,91.799z M581.4,275.399H30.6C13.709,275.399,0,289.108,0,306s13.709,30.6,30.6,30.6h550.8
   c16.891,0,30.6-13.709,30.6-30.6S598.291,275.399,581.4,275.399z"
          />{" "}
        </svg>
      </span>
      <h1>ChillNWork</h1>
    </div>
  );
};

export default Header;
