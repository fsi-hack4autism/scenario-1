import React, { Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles'
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Device from "./components/Device"
import Calendar from "./components/Calendar"
import Dashboard from "./components/Dashboard"
import './App.css';

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
}));

function App() {
  const classes = useStyles();
  
  return (
    <Router>
      <div>
      <Route
          path="/"
          render={({ location }) => (
            <Fragment>
              <AppBar position="fixed" className={classes.appBar}>
                <Tabs value={ location.pathname }>
                  <Tab label="Dashboard" value="/dashboard" component={ Link } to="/" />
                  <Tab label="Device" value="/device" component={ Link } to="/device" />
                  <Tab label="Calendar" value="/calendar" component={ Link } to="/calendar" />
                </Tabs>
              </AppBar>
              <Switch>
                <Route path="/" component={ Dashboard } />
                <Route path="/device" component={ Device } />
                <Route path="/calendar" component={ Calendar } />
              </Switch>
            </Fragment>
          )}
        />
      </div>
    </Router>
  );
}

export default App;
