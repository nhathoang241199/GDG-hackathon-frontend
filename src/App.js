import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import HomePage from "./pages/home";
import GamePage from "./pages/game";

function App() {
  return (
    <div className={"appMain"}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/game" component={GamePage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
