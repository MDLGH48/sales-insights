import React, { useState, useEffect } from "react";
import "./App.css";
import Correlate from "./components/correlate";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import NavBar from "./components/navbar";
import Predict from "./components/predict";
import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textAlign: "center",
    overflowY: "hidden",
    paddingTop: "5%",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Router>
      <div className={classes.root}>
        <NavBar
          main={<Link to="/">Main</Link>}
          feature1={<Link to="/predictTest">Predict</Link>}
          feature2={<Link to="/correlateTest">Correlate</Link>}></NavBar>

        <Switch>
          <Route path="/predictTest">
            <Predict />
          </Route>
          <Route path="/correlateTest">
            <Correlate />
          </Route>
          <Route path="/">
            <Main />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
function Main() {
  return (
    <div>
      {" "}
      <Typography variant="h2" style={{ alignSelf: "left" }}>
        Main
      </Typography>
    </div>
  );
}
export default App;
