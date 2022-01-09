import logo from './logo.svg';
import './App.css';
import NavigationBar from './NavandFooter';
import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import CurrencyConverter from './CurrencyConverter';



function App() {
  return (
    <Router>
      <NavigationBar />
      <Switch>
        <Route path="/currency-converter" exact component={CurrencyConverter} />
        <Route path="/exchange-rate-list"/>
      </Switch>
    </Router>
  );
}

export default App;
