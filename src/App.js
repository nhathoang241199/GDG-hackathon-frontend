import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import HomePage from "./pages/home";
import GamePage from "./pages/game";
import * as s from "./styles/globalStyles";
import Header from "./components/header";
import "./styles/app.css";

function App() {
  return (
    <div className={"appMain"}>
      <BrowserRouter>
        <s.Screen
          style={{ backgroundColor: "var(--black)" }}
          style={{ padding: 24 }}
        >
          <Header />
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/game" component={GamePage} />
          </Switch>
        </s.Screen>
      </BrowserRouter>
    </div>
  );
}

export default App;
