import React from "react";
import MediaContainer from "../containers/MediaContainer";
import TodoContainer from "../containers/TodoContainer";
import "../components/Body.scss";

const Body = () => {
  return (
    <div className="body">
      <MediaContainer />
      <TodoContainer />
    </div>
  );
};

export default Body;
