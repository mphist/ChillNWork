import React from "react";
import HeaderContainer from "./containers/HeaderContainer";
import BodyContainer from "./containers/BodyContainer";

const App = () => {
  const img = process.env.PUBLIC_URL + "/tesla3.jpg";
  return (
    <div>
      <HeaderContainer />
      <BodyContainer />
    </div>
  );
};

export default App;
